/* ========================================================================
   ABODE — Main JS
   ------------------------------------------------------------------------
   This file runs on every page. Its main job is to inject the shared
   navigation bar and footer into each page so we don't have to copy/paste
   them across every HTML file. Edit them once here, and they update
   everywhere.

   Each HTML page has these two empty placeholders near the top and bottom:
     <div data-include="nav"></div>
     <div data-include="footer"></div>
   When the page loads, the code below finds those divs and fills them in.
   ======================================================================== */

// ---------- Nav HTML ----------
function abodeNavHTML(activePage, loggedIn, userName, userRole) {
  // 'activePage' is one of: home, search, dashboard, education, professionals, pricing, documents
  // 'loggedIn' is true when the user is "signed in" (set via data-loggedin on the nav placeholder)
  // 'userName' and 'userRole' personalize the account pill on the right.
  const link = (page, label, href) => {
    const cls = activePage === page ? "nav-link active" : "nav-link";
    return `<a href="${href}" class="${cls}">${label}</a>`;
  };

  // The Document Center link only appears for logged-in users.
  // It carries the user's role/name so the account pill stays consistent across pages.
  const docCenterHref = loggedIn
    ? `document-center.html?role=${encodeURIComponent(userRole || "buyer")}&user=${encodeURIComponent(userName || "")}`
    : "document-center.html";
  const docCenterLink = loggedIn ? link("documents", "Document Center", docCenterHref) : "";

  // Build the right-side controls. Logged-in users see an account pill instead of Log in / Get Started.
  const dashboardHref = userRole === "seller" ? "seller-dashboard.html" : "buyer-dashboard.html";
  const initial = (userName || "U").trim().charAt(0).toUpperCase();
  const rightSide = loggedIn
    ? `<a href="${dashboardHref}" class="btn btn-outline btn-sm" style="display:inline-flex; gap:0.5rem; align-items:center;">
         <span style="width:22px; height:22px; border-radius:50%; background:var(--ink); color:white; display:inline-flex; align-items:center; justify-content:center; font-size:0.72rem; font-weight:600;">${initial}</span>
         <span>${userName || "Account"}</span>
       </a>
       <a href="#" data-action="signout" class="btn btn-ghost btn-sm">Sign out</a>`
    : `<a href="login.html" class="btn btn-primary btn-sm">Log in</a>`;

  return `
    <div class="nav-wrap">
      <div class="container" style="display:flex; align-items:center; justify-content:space-between; padding-top:0.85rem; padding-bottom:0.85rem;">
        <a href="index.html" class="logo" style="text-decoration:none;">Abode</a>

        <div class="hidden md:flex" style="display:flex; gap:0.25rem; align-items:center;">
          ${link("abode-way", "The Abode Way", "get-started.html")}
          ${link("search", "Browse Homes", "search.html")}
          ${link("seller", "Sell Your Home", "create-listing.html")}
          ${link("education", "Education", "education.html")}
          ${link("professionals", "Find Pros", "professionals.html")}
          ${link("pricing", "Pricing", "pricing.html")}
          ${docCenterLink}
        </div>

        <div style="display:flex; gap:0.5rem; align-items:center;">
          ${rightSide}
        </div>
      </div>
    </div>
  `;
}

// ---------- Footer HTML ----------
function abodeFooterHTML() {
  return `
    <footer>
      <div class="container">
        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap:2rem; margin-bottom:2rem;">
          <div>
            <div class="logo" style="margin-bottom:0.5rem;">Abode</div>
            <p style="font-size:0.9rem; opacity:0.7; max-width:240px;">A better way to buy and sell — without the 6% commission.</p>
          </div>
          <div>
            <div style="font-weight:600; margin-bottom:0.75rem; color:white;">For Buyers</div>
            <a href="search.html" style="display:block; padding:0.25rem 0; font-size:0.9rem;">Browse homes</a>
            <a href="buyer-dashboard.html" style="display:block; padding:0.25rem 0; font-size:0.9rem;">Buyer dashboard</a>
            <a href="education.html" style="display:block; padding:0.25rem 0; font-size:0.9rem;">Buyer guide</a>
          </div>
          <div>
            <div style="font-weight:600; margin-bottom:0.75rem; color:white;">For Sellers</div>
            <a href="create-listing.html" style="display:block; padding:0.25rem 0; font-size:0.9rem;">List your home</a>
            <a href="seller-dashboard.html" style="display:block; padding:0.25rem 0; font-size:0.9rem;">Seller dashboard</a>
            <a href="pricing.html" style="display:block; padding:0.25rem 0; font-size:0.9rem;">Pricing</a>
          </div>
          <div>
            <div style="font-weight:600; margin-bottom:0.75rem; color:white;">Resources</div>
            <a href="education.html" style="display:block; padding:0.25rem 0; font-size:0.9rem;">Education Center</a>
            <a href="professionals.html" style="display:block; padding:0.25rem 0; font-size:0.9rem;">Find Professionals</a>
            <a href="faqs.html" style="display:block; padding:0.25rem 0; font-size:0.9rem;">FAQs</a>
            <a href="#" style="display:block; padding:0.25rem 0; font-size:0.9rem;">Help &amp; Support</a>
          </div>
        </div>
        <div style="border-top:1px solid rgba(255,255,255,0.1); padding-top:1.25rem; font-size:0.8rem; opacity:0.6; display:flex; justify-content:space-between; flex-wrap:wrap; gap:1rem;">
          <span>&copy; 2026 Abode. Prototype — not affiliated with any real listings.</span>
          <span><a href="#">Terms</a> &middot; <a href="#">Privacy</a></span>
        </div>
      </div>
    </footer>
  `;
}

// ---------- Inject on load ----------
document.addEventListener("DOMContentLoaded", function() {
  const navTarget = document.querySelector('[data-include="nav"]');
  if (navTarget) {
    const active   = navTarget.dataset.active    || "";
    const loggedIn = navTarget.dataset.loggedin  === "true";
    const userName = navTarget.dataset.user      || "";
    const userRole = navTarget.dataset.role      || "";
    navTarget.outerHTML = abodeNavHTML(active, loggedIn, userName, userRole);
  }
  const footerTarget = document.querySelector('[data-include="footer"]');
  if (footerTarget) {
    footerTarget.outerHTML = abodeFooterHTML();
  }

  // If Firebase auth is available, re-render the nav once auth state resolves
  // so the sign-in/sign-out controls reflect the actual session.
  if (typeof AbodeAuth !== "undefined") {
    AbodeAuth.wireNav();
  }
});
