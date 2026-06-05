/* ========================================================================
   ABODE — Firebase SDK Initialization
   ------------------------------------------------------------------------
   Load this script BEFORE any page-level JS that uses Firebase.
   It initializes the app once and exports the shared service instances
   via window.abodeFirebase so every page can import them without
   re-initializing the SDK.

   CDN imports at the bottom of each HTML page should look like:
     <script src="https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js"></script>
     <script src="https://www.gstatic.com/firebasejs/10.12.2/firebase-auth-compat.js"></script>
     <script src="https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore-compat.js"></script>
     <script src="https://www.gstatic.com/firebasejs/10.12.2/firebase-storage-compat.js"></script>
     <script src="js/firebase-init.js"></script>
   ======================================================================== */

(function () {
  const firebaseConfig = {
    apiKey:            "AIzaSyYOUR_API_KEY",          // TODO: replace with real value from Firebase Console
    authDomain:        "abode-96833.firebaseapp.com",
    projectId:         "abode-96833",
    storageBucket:     "abode-96833.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",    // TODO: replace
    appId:             "YOUR_APP_ID",                 // TODO: replace
  };

  // Initialize only once (guard against double-load)
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }

  // Expose shared service handles globally
  window.abodeFirebase = {
    app:       firebase.app(),
    auth:      firebase.auth(),
    db:        firebase.firestore(),
    storage:   firebase.storage(),
  };
})();
