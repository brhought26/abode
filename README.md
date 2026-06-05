# Abode — Prototype Website

A working clickable prototype of your home-buying-and-selling platform. Built with plain HTML, CSS, and JavaScript so you can open it, change it, and learn the basics of web code as you go.

---

## 1. How to open the site

You don't need to install anything.

1. Find the `abode` folder on your computer.
2. Double-click `index.html`.

The site opens in your default web browser. Click around — every page is linked.

> **If you'd rather use a specific browser:** right-click `index.html` → *Open with* → choose Chrome, Safari, Firefox, etc.

---

## 2. The investor-demo path

When you're showing this to someone, this is the order I'd walk through:

1. **`index.html`** — the pitch. Scroll to the commission calculator and slide the price up to $1M to make their eyes pop.
2. **`get-started.html`** — show that buyers and sellers each have a dedicated flow.
3. **`search.html`** — click "Map view" to show that the geographic search is built in.
4. **`listing.html`** — pick any home. Show the listing detail.
5. **`make-offer.html`** — walk through the 3-step offer flow. (Auto-loads if you clicked "Make an Offer" from the listing page.)
6. **`negotiation.html`** — **this is the killer page.** Show the offer thread, then use the "View as Buyer / View as Seller" toggle in the top-right to demonstrate that both sides use the same tool. Click "Counter" to send a new counter offer in real time.
7. **`closing-roadmap.html`** — visualize how Abode replaces the agent's "I'll guide you through closing" role with software.
8. **`dashboard.html`** — toggle between Buyer and Seller dashboards.
9. **`pricing.html`** — close on the savings story.

---

## 3. The file structure

```
abode/
├── README.md              ← This file
├── index.html             ← Landing page
├── get-started.html       ← Buyer / Seller split
├── search.html            ← Browse homes
├── listing.html           ← Single listing detail
├── make-offer.html        ← 3-step offer flow
├── negotiation.html       ← Live offer thread with Accept/Counter/Decline
├── closing-roadmap.html   ← Step-by-step closing checklist
├── dashboard.html         ← Buyer & seller dashboards (toggle)
├── create-listing.html    ← 6-step seller listing flow
├── education.html         ← Education Center
├── professionals.html     ← Find Professionals directory
├── pricing.html           ← Pricing tiers
├── login.html             ← Log in / sign up
│
├── css/
│   └── styles.css         ← All the brand colors, fonts, and shared styles
│
├── js/
│   ├── data.js            ← All the fake listings, users, offers, messages
│   └── main.js            ← Shared nav bar + footer (injected on every page)
│
└── images/                ← For your own image uploads
```

---

## 4. How to make common tweaks

### Change the brand color
Open `css/styles.css`. At the very top you'll see:

```css
:root {
  --brand: #2d5a3d;          /* deep forest green */
  --accent: #c98654;         /* warm terracotta */
  ...
}
```

Swap the color codes (search for "hex color picker" online to find new ones) and save. Refresh your browser — every page updates.

### Change a homepage headline
Open `index.html`. Find the line that starts with `<h1` near the top. Edit the text between `<h1...>` and `</h1>`. Save. Refresh.

### Add or change a property listing
Open `js/data.js`. Each listing is one block inside the `ABODE_LISTINGS` array. Copy an existing one, paste it below, change the values (id, address, price, photos). Save. Every page that shows listings updates automatically.

For photos, you can use any public image URL — I used Unsplash. To use your own photo, save it inside the `images/` folder and use the path `"images/your-photo.jpg"`.

### Change what's in the nav bar
Open `js/main.js`. The function `abodeNavHTML` near the top builds the nav. Add or remove links there — they'll appear on every page.

### Change the negotiation example
Open `js/data.js` and look for `ABODE_OFFER_THREAD`. The `events` array is the conversation between buyer and seller. Add new events to extend the thread.

---

## 5. How the code works (the 30-second version)

- **HTML files** are the pages. They describe what shows up on screen.
- **CSS** (`css/styles.css`) makes things pretty — colors, fonts, spacing.
- **JavaScript** (`js/...`) makes things interactive — like the commission calculator on the home page or the Accept/Counter buttons.
- **Tailwind** is a tool we load from the internet (you'll see `<script src="https://cdn.tailwindcss.com">` at the top of each page) that gives us shortcut classes like `class="btn"`. It just saves us from writing extra CSS.

The shared nav bar and footer are NOT in every HTML file — they're injected by `js/main.js`. That means if you want to add a new link to every page, you only edit it in one place.

---

## 6. What's fake (and what to replace later)

| Currently fake | When you're ready to make it real |
|----------------|-----------------------------------|
| Listings & users | A database (Supabase, Firebase, or Postgres) |
| File uploads (proof of funds, photos) | Cloud storage (AWS S3, Cloudflare R2) |
| Messages, offers, negotiation events | Same database + real-time updates |
| Login / signup | An auth service (Auth0, Clerk, or Supabase Auth) |
| Map view (currently a drawing) | Mapbox or Google Maps |
| Zillow/Redfin syndication | Their feed APIs (require partnerships) |
| Contract generation | DocuSign, HelloSign, or a custom PDF library |
| Payments | Stripe |

When you're ready, an engineer can take this exact prototype and migrate it to **Next.js + a real database** in 2–4 weeks. The pages, flows, and copy all carry over — only the data layer changes.

---

## 7. What's next

When you outgrow this prototype, the natural next steps are:

1. **Migrate to Next.js** (the React framework most startups use) so we can add real accounts, persistent data, and a proper API.
2. **Connect a database** so listings, offers, and messages save between sessions.
3. **Add real authentication** so users can sign up and log back in.
4. **Hook up payments** through Stripe so the $499 listing fee actually charges.
5. **Replace the demo map** with Mapbox.

We can do these one at a time — there's no rush. This prototype is enough to validate the idea with users, run investor meetings, and start signing up early sellers.

---

## 8. Quick reference — opening files

If you want to edit a file:
- **For text edits, colors, simple changes:** any text editor works (Notepad, TextEdit). Just make sure to save as plain text.
- **For real editing:** download **VS Code** (free) — it color-codes the syntax so it's much easier to read. https://code.visualstudio.com

---

Built May 2026. Questions? Just ask.
