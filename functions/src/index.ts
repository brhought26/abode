import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();
const db = admin.firestore();

// ---------------------------------------------------------------------------
// onUserCreate — Auth trigger
// ---------------------------------------------------------------------------
// Fires every time a new Firebase Auth user is created (signup).
// Creates the canonical users/{uid} document in Firestore so every
// downstream read has a consistent starting point.
//
// The client also writes firstName / lastName / phoneNumber immediately
// after signup (auth.js → signUp) as an optimistic merge, so if this
// trigger fires slightly after the client write, it won't overwrite those
// fields because we only set() the fields the trigger owns, and the client
// uses merge: true.
// ---------------------------------------------------------------------------
export const onUserCreate = functions.auth.user().onCreate(async (user) => {
  const { uid, email, displayName, photoURL } = user;

  const now = admin.firestore.FieldValue.serverTimestamp();

  // Parse displayName written by the client during signup ("Jane B.")
  // into firstName / lastName best-effort, as a fallback only.
  let firstName = "";
  let lastName  = "";
  if (displayName) {
    const parts = displayName.trim().split(/\s+/);
    firstName = parts[0] ?? "";
    // Drop the trailing "." from the abbreviated last name if present
    lastName  = (parts[1] ?? "").replace(/\.$/, "");
  }

  const userDoc = {
    uid,
    email:          email ?? "",
    emailVerified:  false, // will be updated on first login
    firstName,
    lastName,
    displayName:    displayName ?? "",
    phoneNumber:    null,
    photoURL:       photoURL ?? null,
    roles: {
      buyer:  true,
      seller: false,
    },
    sellerTier:          null,
    sellerTierBoughtAt:  null,
    preApproved:         false,
    preApprovedAmount:   null,
    preApprovalDocURL:   null,
    defaultAddress:      null,
    createdAt:           now,
    updatedAt:           now,
    lastLoginAt:         null,
  };

  await db.collection("users").doc(uid).set(userDoc, { merge: true });

  functions.logger.info("Created user document", { uid, email });
});

// ---------------------------------------------------------------------------
// onListingPublish — promote user to seller role on first listing publish
// ---------------------------------------------------------------------------
// Watches listing writes. When a listing transitions to status "active"
// for the first time, flips roles.seller = true on the seller's user doc.
// ---------------------------------------------------------------------------
export const onListingWrite = functions.firestore
  .document("listings/{listingId}")
  .onWrite(async (change) => {
    const before = change.before.data();
    const after  = change.after.data();

    if (!after) return; // listing deleted — nothing to do

    const justPublished =
      after.status === "active" &&
      (!before || before.status !== "active");

    if (!justPublished) return;

    const sellerId = after.sellerId as string | undefined;
    if (!sellerId) return;

    await db.collection("users").doc(sellerId).set(
      { roles: { seller: true }, updatedAt: admin.firestore.FieldValue.serverTimestamp() },
      { merge: true }
    );

    functions.logger.info("Promoted user to seller", { sellerId });
  });
