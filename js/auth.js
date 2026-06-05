/* ========================================================================
   ABODE — Auth Helper Module
   ------------------------------------------------------------------------
   Centralizes all Firebase Auth operations and Firestore user-document
   reads/writes. Depends on firebase-init.js being loaded first.

   Usage on any page:
     AbodeAuth.signIn(email, password)
     AbodeAuth.signUp(firstName, lastName, email, password, phoneNumber)
     AbodeAuth.signOut()
     AbodeAuth.sendPasswordReset(email)
     AbodeAuth.resendVerification()
     AbodeAuth.onAuthChanged(callback)   // subscribe to auth state
     AbodeAuth.currentUser()             // returns Firebase User or null
     AbodeAuth.requireVerified()         // shows modal if not verified
   ======================================================================== */

const AbodeAuth = (() => {
  // ---- Internal helpers --------------------------------------------------

  function auth() { return window.abodeFirebase.auth; }
  function db()   { return window.abodeFirebase.db;   }

  /** Update the users/{uid} document fields on login / profile save. */
  function _updateUserDoc(uid, fields) {
    return db().collection("users").doc(uid).set(
      { ...fields, updatedAt: firebase.firestore.FieldValue.serverTimestamp() },
      { merge: true }
    );
  }

  // ---- Public API --------------------------------------------------------

  /**
   * Sign up a new user with email + password.
   * Creates the Firebase Auth account, updates displayName, sends
   * verification email, and waits for the onUserCreate Cloud Function
   * to create the Firestore document.
   */
  async function signUp(firstName, lastName, email, password, phoneNumber) {
    const displayName = `${firstName} ${lastName.charAt(0).toUpperCase()}.`;
    const cred = await auth().createUserWithEmailAndPassword(email, password);
    await cred.user.updateProfile({ displayName });
    await auth().currentUser.sendEmailVerification();

    // Optimistically write the fields the Cloud Function won't have
    // (firstName, lastName, phoneNumber) in case the trigger is slow.
    await _updateUserDoc(cred.user.uid, {
      uid:         cred.user.uid,
      email:       email,
      firstName:   firstName,
      lastName:    lastName,
      displayName: displayName,
      phoneNumber: phoneNumber || null,
    });

    return cred.user;
  }

  /**
   * Sign in with email + password.
   * Updates lastLoginAt and emailVerified in the user document.
   * Returns the Firebase User.
   */
  async function signIn(email, password) {
    const cred = await auth().signInWithEmailAndPassword(email, password);
    await auth().currentUser.reload(); // refresh emailVerified status
    await _updateUserDoc(cred.user.uid, {
      lastLoginAt:   firebase.firestore.FieldValue.serverTimestamp(),
      emailVerified: auth().currentUser.emailVerified,
    });
    return auth().currentUser;
  }

  /**
   * Sign out and redirect to the home page.
   */
  async function signOut() {
    await auth().signOut();
    window.location.href = "index.html";
  }

  /**
   * Send a password reset email to the given address.
   */
  function sendPasswordReset(email) {
    return auth().sendPasswordResetEmail(email);
  }

  /**
   * Resend the email verification to the currently signed-in user.
   */
  function resendVerification() {
    const user = auth().currentUser;
    if (!user) throw new Error("No signed-in user.");
    return user.sendEmailVerification();
  }

  /**
   * Subscribe to auth state changes.
   * callback(user) is called immediately with the current state,
   * then again on every sign-in / sign-out.
   * Returns the unsubscribe function.
   */
  function onAuthChanged(callback) {
    return auth().onAuthStateChanged(callback);
  }

  /** Returns the current Firebase User, or null if not signed in. */
  function currentUser() {
    return auth().currentUser;
  }

  /**
   * Read the Firestore user document for the given uid.
   * Returns the data object or null.
   */
  async function getUserDoc(uid) {
    const snap = await db().collection("users").doc(uid).get();
    return snap.exists ? snap.data() : null;
  }

  /**
   * Check whether the signed-in user has verified their email.
   * If not, shows a modal prompting them to verify and returns false.
   * Use this as a gate before gated actions (create listing, make offer).
   */
  async function requireVerified() {
    const user = auth().currentUser;
    if (!user) {
      window.location.href = "login.html";
      return false;
    }
    await user.reload();
    if (user.emailVerified) return true;

    _showVerifyModal();
    return false;
  }

  // ---- Verify-email modal ------------------------------------------------

  function _showVerifyModal() {
    if (document.getElementById("abode-verify-modal")) return; // already shown

    const modal = document.createElement("div");
    modal.id = "abode-verify-modal";
    modal.style.cssText = `
      position:fixed; inset:0; z-index:9999;
      display:flex; align-items:center; justify-content:center;
      background:rgba(0,0,0,0.45);
    `;
    modal.innerHTML = `
      <div style="background:white; border-radius:12px; padding:2rem; max-width:400px; width:90%; text-align:center; box-shadow:0 8px 32px rgba(0,0,0,0.18);">
        <div style="font-size:2rem; margin-bottom:0.5rem;">✉️</div>
        <h3 style="margin-bottom:0.5rem;">Verify your email to continue</h3>
        <p style="color:#6b6b6b; margin-bottom:1.5rem; font-size:0.95rem;">
          We sent a verification link when you signed up.
          Check your inbox (and spam folder), then try again.
        </p>
        <button id="abode-resend-btn" style="
          display:block; width:100%; padding:0.75rem; border-radius:8px;
          background:#0a0a0a; color:white; border:none; font-size:1rem;
          cursor:pointer; margin-bottom:0.75rem;
        ">Resend verification email</button>
        <button id="abode-verify-close" style="
          display:block; width:100%; padding:0.75rem; border-radius:8px;
          background:transparent; color:#6b6b6b; border:1px solid #ececea;
          font-size:0.95rem; cursor:pointer;
        ">Close</button>
      </div>
    `;
    document.body.appendChild(modal);

    document.getElementById("abode-resend-btn").addEventListener("click", async () => {
      try {
        await resendVerification();
        document.getElementById("abode-resend-btn").textContent = "Sent! Check your inbox.";
        document.getElementById("abode-resend-btn").disabled = true;
      } catch (e) {
        alert("Could not send — " + (e.message || "please try again."));
      }
    });

    document.getElementById("abode-verify-close").addEventListener("click", () => {
      modal.remove();
    });
  }

  // ---- Nav wiring --------------------------------------------------------

  /**
   * Call once on DOMContentLoaded to bind the nav sign-out button and
   * keep the nav's auth state in sync.
   *
   * The nav is rendered by main.js using data-attributes on the placeholder.
   * This function uses onAuthStateChanged so the nav reflects reality even
   * on page refreshes (e.g., the user already signed in from another tab).
   *
   * Because main.js injects the nav synchronously on DOMContentLoaded and
   * onAuthStateChanged fires async, we re-render the nav once auth state
   * resolves so the sign-in/sign-out controls are accurate.
   */
  function wireNav() {
    onAuthChanged(async (user) => {
      if (!user) return; // not signed in — nav already shows "Log in"

      const userDoc = await getUserDoc(user.uid);
      const role    = userDoc?.roles?.seller ? "seller" : "buyer";
      const name    = user.displayName || userDoc?.firstName || "";

      // Re-render the nav with live auth state.
      // abodeNavHTML is defined in main.js and already loaded.
      const navWrap = document.querySelector(".nav-wrap");
      if (navWrap && typeof abodeNavHTML === "function") {
        const active = navWrap.closest("[data-active]")?.dataset?.active || "";
        navWrap.outerHTML = abodeNavHTML(active, true, name, role);
      }

      // Bind sign-out to any element with data-action="signout"
      document.querySelectorAll("[data-action='signout']").forEach(el => {
        el.addEventListener("click", (e) => { e.preventDefault(); signOut(); });
      });
    });
  }

  return { signUp, signIn, signOut, sendPasswordReset, resendVerification,
           onAuthChanged, currentUser, getUserDoc, requireVerified, wireNav };
})();
