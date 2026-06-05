# Abode — MVP Specification

**Version:** 0.1 (Sprint 1 baseline)
**Last updated:** June 5, 2026
**Audience:** Claude Code and/or human developers implementing the Abode MVP backend.

---

## What this document is

This is the implementation brief for Abode's Minimum Viable Product. It defines the data model, authentication flows, security model, and storage layout that must be in place before any feature work begins.

The existing static HTML demo (`/Abode/*.html`) is the visual + UX reference. This document is the backend blueprint that those screens get wired up to.

This is a living document. Sprint 1 sections are spec-complete. Sprints 2–6 are sketched and will be expanded in subsequent planning sessions.

---

## Product context

Abode is a real estate platform that lets buyers and sellers transact directly, bypassing realtor commissions. The MVP must support a real transaction end-to-end:

1. A seller can create a listing with photos, price, terms.
2. A buyer can search/filter/view listings, save favorites, message the seller, request a showing, submit an offer.
3. The two can negotiate, accept terms, generate a contract, and proceed to e-signature.
4. Sellers pay a tier fee via Stripe before publishing.
5. Admins can moderate listings and users.

This document defines Sprint 1 (auth + data model) in full. Subsequent sprints are listed at the end for context.

---

## Stack

| Layer        | Technology |
|--------------|------------|
| Hosting      | Firebase Hosting (already live at `whatabode.com`, project `abode-96833`) |
| Auth         | Firebase Authentication (email + password only for MVP) |
| Database     | Cloud Firestore |
| File storage | Firebase Storage |
| Functions    | Firebase Cloud Functions (Node.js) — needed for triggers + Stripe webhooks + email sending |
| Frontend     | Static HTML/CSS/JS (no build step). To be modernized only if necessary. |
| Email        | SendGrid or Postmark via Cloud Functions (decision deferred to Sprint 4) |
| Payments     | Stripe (Sprint 6) |
| E-signature  | DocuSign or Dropbox Sign (Sprint 5) |

**Important:** Firebase Cloud Functions require the **Blaze (pay-as-you-go)** billing plan. The Spark free tier does not support Functions. This upgrade should happen at the start of Sprint 1 so triggers can be deployed.

---

## Architecture overview

```
┌─────────────────────────────────────────────────────┐
│ Browser (static HTML/CSS/JS at whatabode.com)       │
│   - Firebase JS SDK loaded via CDN                  │
│   - Auth, Firestore, Storage SDKs                   │
└────────────────┬────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────┐
│ Firebase Auth                                       │
│   - Email/password                                  │
│   - Email verification                              │
│   - Password reset                                  │
└─────────────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────┐
│ Cloud Firestore                                     │
│   - users, listings, conversations, offers,         │
│     showings, favorites (subcollection)             │
└─────────────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────┐
│ Firebase Storage                                    │
│   - User avatars, pre-approval letters,             │
│     listing photos, listing documents               │
└─────────────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────┐
│ Cloud Functions (Sprint 1+)                         │
│   - onCreate auth trigger → creates users doc       │
│   - Email notification senders (Sprint 4)           │
│   - Stripe webhooks (Sprint 6)                      │
└─────────────────────────────────────────────────────┘
```

---

## Data model

### Core principles

1. **Unified user accounts.** A single user account can have both buyer and seller roles. There is no separate "seller account."
2. **Roles flip on first use.** New users start with `roles.buyer = true`. Seller flips to `true` automatically when they create their first listing.
3. **Light denormalization.** Common display fields (seller name on listings, listing photo on favorites) are duplicated to avoid joins. We accept the staleness trade-off.
4. **Anti-discrimination by design.** No demographic data (race, age, gender, family status, etc.) is collected or stored anywhere. Offer documents are intentionally minimal so seller-side displays cannot leak identity until acceptance.
5. **Embedded arrays where bounded, subcollections where unbounded.** Offers' `rounds` array stays embedded (small, bounded). Messages live as a subcollection (potentially unbounded).

---

### `users/{uid}`

Document ID matches Firebase Auth uid.

| Field | Type | Notes |
|-------|------|-------|
| `uid` | string | Matches Auth uid. |
| `email` | string | From Auth, mirrored for query. |
| `emailVerified` | boolean | Synced from Auth state. Updated by Auth trigger. |
| `firstName` | string | Collected at signup. |
| `lastName` | string | Collected at signup. |
| `displayName` | string | Computed `"FirstName L."` for public display. |
| `phoneNumber` | string \| null | Optional at signup. Required before transacting. |
| `photoURL` | string \| null | Storage URL of avatar. |
| `roles.buyer` | boolean | Default `true` for all new users. |
| `roles.seller` | boolean | Default `false`. Flips to `true` on first successful listing publish. |
| `sellerTier` | string \| null | `"basic"` \| `"savvy"` \| `"professional"` \| `"investor"` \| `null`. Set when seller purchases. |
| `sellerTierBoughtAt` | timestamp \| null | When the tier was purchased. |
| `preApproved` | boolean | Buyer side. Optional. |
| `preApprovedAmount` | number \| null | Buyer side. Optional. |
| `preApprovalDocURL` | string \| null | Uploaded letter (Storage). |
| `defaultAddress` | string \| null | Optional. Speeds up listing creation. |
| `createdAt` | timestamp | Set by Auth trigger. |
| `updatedAt` | timestamp | Maintained by client on profile edit. |
| `lastLoginAt` | timestamp | Updated on successful login. |

---

### `listings/{listingId}`

Top-level collection. Document ID is auto-generated.

| Field | Type | Notes |
|-------|------|-------|
| `listingId` | string | Mirrors doc ID. |
| `sellerId` | string | References `users/{uid}`. |
| `status` | string | `"draft"` \| `"active"` \| `"pending"` \| `"sold"` \| `"withdrawn"`. |
| `sellerName` | string | Denormalized for fast list display. |
| `sellerPhotoURL` | string \| null | Denormalized. |
| `addressLine1` | string | |
| `city` | string | Filterable. |
| `state` | string | Filterable. |
| `zip` | string | Filterable. |
| `displayAddress` | string | Computed convenience string for UI. |
| `lat` | number | For map display. |
| `lng` | number | |
| `price` | number | Asking price. |
| `annualTaxes` | number \| null | |
| `hoaMonthly` | number \| null | |
| `beds` | number | |
| `baths` | number | Allow decimals (e.g., 2.5). |
| `sqft` | number | |
| `lotSizeSqft` | number \| null | |
| `yearBuilt` | number \| null | |
| `propertyType` | string | `"single_family"` \| `"condo"` \| `"townhouse"` \| `"land"` \| `"multi_family"` \| `"manufactured"`. |
| `title` | string | Marketing title for the listing. |
| `description` | string | Long-form description. |
| `photos` | string[] | Firebase Storage URLs. `photos[0]` is the hero image. |
| `documents` | object[] | `[{ name, url, type }]`. Pre-uploaded disclosures, etc. |
| `requireViewingBeforeOffer` | boolean | Matches the toggle on `create-listing.html`. |
| `showingAvailability` | object[] | Schema deferred to Sprint 4. Empty array on create. |
| `viewCount` | number | Denormalized counter. Increments via Function on detail page load. |
| `favoriteCount` | number | Denormalized counter. |
| `offerCount` | number | Denormalized counter. |
| `createdAt` | timestamp | |
| `publishedAt` | timestamp \| null | Null until status moves to `active`. |
| `updatedAt` | timestamp | |

**Status state machine:**

```
draft ──publish──> active ──offer accepted──> pending ──close──> sold
        │              │                          │
        │              └──withdraw──> withdrawn   └──fall through──> active
        │
        └──delete──> (hard delete from Firestore)
```

---

### `conversations/{conversationId}`

Top-level. Always exactly 2 participants for MVP (buyer ↔ seller). Group chats out of scope.

| Field | Type | Notes |
|-------|------|-------|
| `conversationId` | string | Mirrors doc ID. |
| `participants` | string[] | Two uids. Enables `array-contains` queries for "my conversations." |
| `participantNames` | object | `{ uid: "Name" }` map. Denormalized. |
| `participantPhotos` | object | `{ uid: "url" }` map. Denormalized. |
| `listingId` | string \| null | Optional. Most convos start scoped to a listing. |
| `listingTitle` | string \| null | Denormalized. |
| `lastMessage` | string | Truncated preview (~100 chars). |
| `lastMessageAt` | timestamp | For sorting conversation list. |
| `lastMessageBy` | string | uid of the sender. |
| `unread` | object | `{ uid: count }` map. Per-participant unread badge. |
| `createdAt` | timestamp | |

#### `conversations/{conversationId}/messages/{messageId}` (subcollection)

| Field | Type | Notes |
|-------|------|-------|
| `messageId` | string | Mirrors doc ID. |
| `senderId` | string | uid. |
| `text` | string | Message body. |
| `attachments` | object[] | `[{ type, url }]`. Out of scope for MVP — empty for now. |
| `readBy` | string[] | uids who have seen this message. |
| `createdAt` | timestamp | Server timestamp. |

---

### `offers/{offerId}`

Top-level. The negotiation history lives as an embedded `rounds` array.

| Field | Type | Notes |
|-------|------|-------|
| `offerId` | string | Mirrors doc ID. |
| `listingId` | string | |
| `buyerId` | string | |
| `sellerId` | string | Denormalized for `where sellerId == me` queries. |
| `status` | string | `"submitted"` \| `"countered"` \| `"accepted"` \| `"rejected"` \| `"withdrawn"` \| `"expired"`. |
| `price` | number | Current (latest round) price. |
| `earnestMoney` | number | |
| `dueDiligenceAmount` | number | |
| `closingDate` | timestamp | |
| `offerExpiresAt` | timestamp | Auto-moves status → expired via scheduled function. |
| `contingencies.inspection` | boolean | |
| `contingencies.appraisal` | boolean | |
| `contingencies.financing` | boolean | |
| `contingencies.saleOfBuyerHome` | boolean | |
| `buyerName` | string | Denormalized. NO photo, NO demographics. |
| `buyerPreApproved` | boolean | Denormalized. |
| `buyerPreApprovalAmount` | number \| null | Denormalized. |
| `rounds` | object[] | `[{ by, price, terms, sentAt, note }]`. Every counter/response. |
| `conversationId` | string \| null | Linked conversation if any. |
| `contractId` | string \| null | Set when status → accepted and contract is drafted. |
| `createdAt` | timestamp | |
| `updatedAt` | timestamp | |

**Status state machine:**

```
submitted ──counter──> countered ──accept──> accepted
    │           │           │
    │           └──reject──> rejected
    │           │
    │           └──withdraw──> withdrawn
    │
    └──expires──> expired
```

**Critical privacy note:** This document explicitly excludes any field that could be used for discriminatory selection (buyer photo, age, family status, employment, etc.). Seller-facing offer cards should default to an even more anonymized presentation, revealing only what's strictly necessary to evaluate the offer (price + terms + pre-approval status).

---

### `users/{uid}/favorites/{listingId}` (subcollection)

Owner-scoped. Document ID matches `listingId` so saving twice is idempotent.

| Field | Type | Notes |
|-------|------|-------|
| `listingId` | string | Mirrors doc ID. |
| `listingPhoto` | string | Hero photo, denormalized. |
| `listingPrice` | number | Denormalized. |
| `listingAddress` | string | Denormalized. |
| `listingBeds` | number | |
| `listingBaths` | number | |
| `listingSqft` | number | |
| `favoritedAt` | timestamp | |

**Staleness trade-off accepted:** If a listing's price changes, the favorited copy will be out of date until the buyer clicks through. For MVP we accept this. A future Cloud Function can fan-out updates.

---

### `showings/{showingId}` (light schema, expands in Sprint 4)

| Field | Type | Notes |
|-------|------|-------|
| `showingId` | string | Mirrors doc ID. |
| `listingId` | string | |
| `sellerId` | string | |
| `buyerId` | string | |
| `requestedFor` | timestamp | Specific date/time. |
| `status` | string | `"pending"` \| `"confirmed"` \| `"declined"` \| `"completed"` \| `"cancelled"`. |
| `notes` | string \| null | Optional. |
| `createdAt` | timestamp | |

Calendar availability schema (how a seller publishes open slots) gets designed alongside the Sprint 4 calendar UI.

---

## Authentication

### Methods

- **Email + password only** for MVP launch.
- Google sign-in, Apple sign-in, and phone-based auth are deferred to later if A/B data justifies them.

### Required environment

- Firebase Auth enabled in console with **Email/Password** provider only.
- Email verification template customized with Abode branding (Firebase Console → Authentication → Templates).
- Password reset template customized with Abode branding.

### Signup flow

1. User lands on `/signup` page.
2. Form fields: `firstName`, `lastName`, `email`, `password`, (optional) `phoneNumber`.
3. On submit:
   - Call `createUserWithEmailAndPassword(email, password)`.
   - Call `updateProfile({ displayName: firstName + " " + lastName.charAt(0) + "." })` on the Auth user.
   - Call `sendEmailVerification()`.
4. Auth trigger Cloud Function `onUserCreate` fires:
   - Creates `users/{uid}` document with:
     - `roles: { buyer: true, seller: false }`
     - `emailVerified: false`
     - `createdAt: serverTimestamp()`
     - Form-collected fields
5. Client redirects to `/verify-email` screen with copy: "Check your inbox. Click the link to verify, then come back here."

### Login flow

1. User on `/login` enters email + password.
2. Call `signInWithEmailAndPassword(email, password)`.
3. On success:
   - Update `users/{uid}.lastLoginAt` and `emailVerified` (in case it changed).
   - Read `roles` to determine dashboard routing.
   - If both `roles.buyer` and `roles.seller`, show a role selector. Otherwise route to the relevant dashboard.

### Password reset flow

1. On `/login`, "Forgot password?" link → `/reset` page.
2. User enters email.
3. Call `sendPasswordResetEmail(email)`.
4. User receives email → clicks link → Firebase-hosted reset page → returns to `/login` once set.

### Email verification gate

- Trigger points where verification is enforced:
  - **Creating a listing** (`create-listing.html`)
  - **Submitting an offer** (`make-offer.html`)
  - **Initiating a payment** (Stripe Checkout in Sprint 6)
- Before allowing the gated action, client checks `auth.currentUser.emailVerified`. If false, show modal: "Verify your email to continue." with "Resend verification" button.

### Role promotion: buyer → also seller

- When a seller successfully publishes their first listing, set `users/{uid}.roles.seller = true` in the same transaction that creates the listing.
- This unlocks the seller dashboard.

### Logout

- Call `signOut()`.
- Clear any client-side cached state.
- Redirect to `/index.html`.

### Existing demo password gate

The `gate.html` access code (`equitysaver`) protects the demo. In production this should be removed. When MVP launches, run a cleanup script to strip the `<!-- abode-gate-check -->` block from every HTML file.

---

## Security rules (design)

The actual `firestore.rules` and `storage.rules` files are written during implementation. These are the principles to encode.

### Firestore

```
match /users/{uid} {
  allow read:  if request.auth != null;            // public-ish, no sensitive data here
  allow write: if request.auth.uid == uid;
}

match /users/{uid}/favorites/{listingId} {
  allow read, write: if request.auth.uid == uid;
}

match /listings/{listingId} {
  allow read:   if resource.data.status == "active"
                || request.auth.uid == resource.data.sellerId;
  allow create: if request.auth.uid == request.resource.data.sellerId
                && request.auth.token.email_verified == true;
  allow update, delete: if request.auth.uid == resource.data.sellerId;
}

match /conversations/{cid} {
  allow read, write: if request.auth.uid in resource.data.participants;
  allow create: if request.auth.uid in request.resource.data.participants;
}

match /conversations/{cid}/messages/{mid} {
  allow read, write: if request.auth.uid in
    get(/databases/$(database)/documents/conversations/$(cid)).data.participants;
}

match /offers/{oid} {
  allow read:   if request.auth.uid == resource.data.buyerId
                || request.auth.uid == resource.data.sellerId;
  allow create: if request.auth.uid == request.resource.data.buyerId
                && request.auth.token.email_verified == true;
  allow update: if (request.auth.uid == resource.data.buyerId
                    || request.auth.uid == resource.data.sellerId)
                && /* status transition is valid */;
}

match /showings/{sid} {
  allow read:   if request.auth.uid == resource.data.buyerId
                || request.auth.uid == resource.data.sellerId;
  allow create: if request.auth.uid == request.resource.data.buyerId;
  allow update: if request.auth.uid == resource.data.sellerId
                || request.auth.uid == resource.data.buyerId;
}
```

### Storage

```
match /users/{uid}/avatar.{ext} {
  allow read:  if request.auth != null;
  allow write: if request.auth.uid == uid;
}

match /users/{uid}/preApproval.{ext} {
  allow read:  if request.auth.uid == uid;       // private
  allow write: if request.auth.uid == uid;
}

match /listings/{listingId}/photos/{photoId} {
  allow read:  if request.auth != null;
  allow write: if request.auth.uid ==
    firestore.get(/databases/(default)/documents/listings/$(listingId)).data.sellerId;
}

match /listings/{listingId}/documents/{docId} {
  allow read:  if request.auth != null;          // MVP: all signed-in users
  allow write: if request.auth.uid ==
    firestore.get(/databases/(default)/documents/listings/$(listingId)).data.sellerId;
}
```

---

## Storage layout

```
firebase-storage://abode-96833/
├── users/
│   └── {uid}/
│       ├── avatar.{jpg,png,webp}
│       └── preApproval.pdf
├── listings/
│   └── {listingId}/
│       ├── photos/
│       │   ├── {photoId-1}.jpg
│       │   ├── {photoId-2}.jpg
│       │   └── ...
│       └── documents/
│           ├── disclosure.pdf
│           └── ...
```

---

## Sprint 1 implementation notes

The order to wire things up:

1. **Upgrade to Blaze billing plan.** Cloud Functions require this.
2. **Enable Firestore** in the Firebase Console (Native mode, not Datastore).
3. **Enable Firebase Storage** in the Firebase Console.
4. **Enable Auth** with Email/Password provider only.
5. **Customize Auth email templates** (verification, password reset) with Abode branding.
6. **Write `firestore.rules`** based on the design above. Deploy with `firebase deploy --only firestore:rules`.
7. **Write `storage.rules`** similarly. Deploy with `firebase deploy --only storage`.
8. **Initialize Cloud Functions** locally (`firebase init functions`, TypeScript or JavaScript — TypeScript recommended).
9. **Implement `onUserCreate` Auth trigger** that creates the `users/{uid}` document.
10. **Build `/signup.html`** — replace stub form with real Firebase Auth call.
11. **Build `/login.html`** — replace stub form with real Firebase Auth call.
12. **Build `/reset.html`** — password reset entry page.
13. **Build `/verify-email.html`** — post-signup landing page with resend button.
14. **Wire navigation** to show signed-in state (already supported via `data-loggedin="true"` attribute on existing nav).
15. **Add Sign-out handler** to the existing nav account pill.

### What stays static for now

The following pages remain static-data-driven until their respective sprints:

- `search.html` (Sprint 3)
- `listing.html` (Sprint 3)
- `make-offer.html` (Sprint 5)
- `negotiation.html` (Sprint 5)
- `seller-dashboard.html` / `buyer-dashboard.html` (Sprint 2/3 partial wiring)

### Files that need creation in Sprint 1

| File | Purpose |
|------|---------|
| `signup.html` | New user signup form |
| `verify-email.html` | Post-signup verification screen |
| `reset.html` | Password reset entry |
| `firestore.rules` | Firestore security rules |
| `storage.rules` | Storage security rules |
| `functions/src/index.ts` | Cloud Functions entry point with `onUserCreate` |
| `js/firebase-init.js` | Firebase SDK initialization shared across pages |
| `js/auth.js` | Auth helper module (signIn, signOut, currentUser, etc.) |

### Files that need modification in Sprint 1

| File | Change |
|------|--------|
| `login.html` | Wire form submit to `signInWithEmailAndPassword`. |
| `js/main.js` | Read Auth state, toggle nav, redirect from gated pages. |
| `firebase.json` | Add `functions`, `firestore`, `storage` blocks. |

---

## Future sprints (preview)

These are not in scope for Sprint 1 but are sketched here so the data model can support them.

### Sprint 2 — Listings creation + real data
- Wire `create-listing.html` to Firestore writes.
- Photo upload to Firebase Storage.
- Replace `js/data.js` with live Firestore reads on `search.html`.

### Sprint 3 — Search, discovery, favorites
- Filters wired to Firestore queries.
- Map view backed by real lat/lng.
- Save/favorite buttons persist to subcollection.
- `listing.html` driven by real data + viewCount increment.

### Sprint 4 — Messaging + calendar + email notifications
- Real-time messaging via Firestore listeners.
- Showing calendar — finalize `showingAvailability` schema.
- Email notifications via Cloud Function + SendGrid/Postmark.

### Sprint 5 — Offers, contracts, e-signature
- Wire `make-offer.html` to Firestore.
- Negotiation room actions (accept/counter/reject) write to offer state machine.
- Contract template generation.
- DocuSign or Dropbox Sign integration.

### Sprint 6 — Payments + admin moderation
- Stripe Checkout for seller tier purchases.
- Stripe webhook → Cloud Function → updates `users/{uid}.sellerTier`.
- Admin dashboard with listing approve/reject + user moderation.

---

## Open questions to revisit later

These are flagged here so they don't get lost.

- **Listing document visibility:** Should seller-uploaded disclosures be readable by any signed-in user, or restricted to buyers with an active offer? MVP default: signed-in users.
- **Conversation deletion:** What happens when a buyer deletes a conversation? Soft delete vs. hard delete. Default: soft delete by removing them from `participants`.
- **Multi-offer notifications:** Should buyers be notified when a competing offer arrives? Probably yes, but anonymized.
- **Listing expiration:** Should listings auto-archive after N days? Pricing tiers will affect this — Investor tier might have indefinite, Basic might cap at 90 days.
- **Buyer pre-approval verification:** Currently self-attested. A future verification step (calling the lender, or integrating with a service) is needed before launch in any meaningful market.

---

## Appendix A — Firestore composite indexes likely needed

Plan to create these via the Firebase Console as queries demand them:

- `listings` where `status == "active"` orderBy `createdAt desc`
- `listings` where `status == "active"` AND `city == X` orderBy `price`
- `listings` where `status == "active"` AND `state == X` orderBy `price`
- `listings` where `sellerId == X` orderBy `updatedAt desc`
- `offers` where `sellerId == X` orderBy `createdAt desc`
- `offers` where `buyerId == X` orderBy `createdAt desc`
- `conversations` where `participants array-contains X` orderBy `lastMessageAt desc`

Firestore will surface the exact index URL the first time a query needs one.

---

## Appendix B — Field-level seed data

For local development, seed Firestore with the existing `js/data.js` listings (10 listings across NC and SC). The seller for all seeded listings can be a single dev account `seller-seed@abode.dev`.

---

**End of Sprint 1 specification.**
