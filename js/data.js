/* ========================================================================
   ABODE — Fake data
   ------------------------------------------------------------------------
   This file holds all the sample data the prototype uses to look real.
   When we move to a real product, this will be replaced by a database
   and API calls. For now, every page reads from here.

   To add a new listing or change details, just edit the arrays below.
   ======================================================================== */

// ---------- Listings ----------
// Photos are pulled from Unsplash (free stock photos) so we don't need to
// host our own. You can swap any URL for your own image later.
const ABODE_LISTINGS = [
  {
    id: "L-001",
    lat: 35.5870, lng: -82.5710,
    address: "412 Magnolia Lane",
    city: "Asheville",
    state: "NC",
    zip: "28801",
    price: 615000,
    beds: 4,
    baths: 3,
    sqft: 2840,
    lot: "0.34 acres",
    year: 1998,
    status: "Active",
    photos: [
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=1200",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200",
      "https://images.unsplash.com/photo-1600210492493-0946911123ea?w=1200"
    ],
    description: "A craftsman charmer tucked into a quiet cul-de-sac in West Asheville. Recently updated kitchen with quartz counters, original hardwood floors throughout, and a screened-in back porch overlooking a mature garden. Walking distance to Haywood Road shops and restaurants.",
    sellerId: "U-101",
    listedDate: "2026-04-22",
    commissionSavings: 36900, // 6% of price
    taxValue: 562000,
    priceHistory: [
      { date: "2026-04-22", event: "Listed on Abode", price: 615000 },
      { date: "2019-08-14", event: "Sold", price: 412000 }
    ],
    features: ["Hardwood floors", "Quartz countertops", "Screened porch", "Two-car garage", "Updated HVAC (2023)", "Fenced backyard"]
  },
  {
    id: "L-002",
    lat: 35.5450, lng: -82.6000,
    address: "78 Bramblewood Drive",
    city: "Asheville",
    state: "NC",
    zip: "28806",
    price: 489000,
    beds: 3,
    baths: 2,
    sqft: 1920,
    lot: "0.21 acres",
    year: 2005,
    status: "Active",
    photos: [
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200",
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=1200",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200"
    ],
    description: "Modern 3-bedroom with an open floor plan, vaulted ceilings, and a chef's kitchen that opens onto a stone patio. Owner-occupied for 12 years and impeccably maintained.",
    sellerId: "U-102",
    listedDate: "2026-05-01",
    commissionSavings: 29340,
    taxValue: 445000,
    priceHistory: [
      { date: "2026-05-01", event: "Listed on Abode", price: 489000 },
      { date: "2014-03-09", event: "Sold", price: 295000 }
    ],
    features: ["Vaulted ceilings", "Stone patio", "Chef's kitchen", "Smart thermostat", "EV charger pre-wired"]
  },
  {
    id: "L-003",
    lat: 35.6260, lng: -82.5400,
    address: "1209 Riverside Way",
    city: "Asheville",
    state: "NC",
    zip: "28804",
    price: 875000,
    beds: 5,
    baths: 4,
    sqft: 3650,
    lot: "0.62 acres",
    year: 2012,
    status: "Active",
    photos: [
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200",
      "https://images.unsplash.com/photo-1600566753086-00f18fe6ba65?w=1200"
    ],
    description: "Stunning riverfront home with panoramic mountain views. Five bedrooms, primary suite on the main floor, gourmet kitchen with double islands, and a finished walk-out basement. Private dock access.",
    sellerId: "U-103",
    listedDate: "2026-04-15",
    commissionSavings: 52500,
    taxValue: 798000,
    priceHistory: [
      { date: "2026-04-15", event: "Listed on Abode", price: 875000 }
    ],
    features: ["Riverfront", "Mountain views", "Walk-out basement", "Double-island kitchen", "Three-car garage", "Private dock"]
  },
  {
    id: "L-004",
    lat: 35.6182, lng: -82.3210,
    address: "55 Oakridge Court",
    city: "Black Mountain",
    state: "NC",
    zip: "28711",
    price: 379000,
    beds: 3,
    baths: 2,
    sqft: 1640,
    lot: "0.18 acres",
    year: 1989,
    status: "Active",
    photos: [
      "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=1200",
      "https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?w=1200"
    ],
    description: "Cozy ranch on a quiet street, walking distance to downtown Black Mountain. New roof (2024), updated bathrooms, and a deep covered front porch perfect for rocking chairs.",
    sellerId: "U-104",
    listedDate: "2026-04-30",
    commissionSavings: 22740,
    taxValue: 341000,
    priceHistory: [
      { date: "2026-04-30", event: "Listed on Abode", price: 379000 }
    ],
    features: ["New roof", "Covered porch", "Single level", "Wood-burning fireplace"]
  },
  {
    id: "L-005",
    lat: 35.3187, lng: -82.4610,
    address: "923 Sunset Ridge Road",
    city: "Hendersonville",
    state: "NC",
    zip: "28792",
    price: 549000,
    beds: 4,
    baths: 3,
    sqft: 2410,
    lot: "0.45 acres",
    year: 2001,
    status: "Active",
    photos: [
      "https://images.unsplash.com/photo-1576941089067-2de3c901e126?w=1200",
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1200"
    ],
    description: "Brick ranch with finished bonus room over the garage. Recently painted, new appliances, and a beautifully landscaped yard with mature Japanese maples.",
    sellerId: "U-105",
    listedDate: "2026-05-05",
    commissionSavings: 32940,
    taxValue: 488000,
    priceHistory: [
      { date: "2026-05-05", event: "Listed on Abode", price: 549000 }
    ],
    features: ["Bonus room", "Brick exterior", "Landscaped yard", "Side-entry garage"]
  },
  {
    id: "L-006",
    lat: 35.6970, lng: -82.5601,
    address: "17 Foxglove Terrace",
    city: "Weaverville",
    state: "NC",
    zip: "28787",
    price: 425000,
    beds: 3,
    baths: 2.5,
    sqft: 2080,
    lot: "0.27 acres",
    year: 2019,
    status: "Active",
    photos: [
      "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=1200",
      "https://images.unsplash.com/photo-1600573472556-e636c2acda88?w=1200"
    ],
    description: "Like-new construction in a quiet pocket neighborhood. Open-concept main floor, primary suite up with vaulted ceilings, and a fenced backyard.",
    sellerId: "U-106",
    listedDate: "2026-05-08",
    commissionSavings: 25500,
    taxValue: 398000,
    priceHistory: [
      { date: "2026-05-08", event: "Listed on Abode", price: 425000 }
    ],
    features: ["New construction", "Open concept", "Fenced yard", "Smart home pre-wired"]
  },
  {
    id: "L-007",
    lat: 35.5900, lng: -82.5360,
    address: "240 Tunnel Road #408",
    city: "Asheville",
    state: "NC",
    zip: "28805",
    price: 385000,
    beds: 2,
    baths: 2,
    sqft: 1250,
    lot: "Condo · 0.04 acres common",
    year: 2017,
    status: "Active",
    photos: [
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1200",
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1200"
    ],
    description: "Top-floor condo with city skyline views, hardwood floors, and a private balcony. Building amenities include a fitness center, secure parking, and a rooftop common area. Steps from the South Slope Brewery District.",
    sellerId: "U-101",
    listedDate: "2026-05-12",
    commissionSavings: 23100,
    taxValue: 351000,
    priceHistory: [
      { date: "2026-05-12", event: "Listed on Abode", price: 385000 },
      { date: "2017-09-22", event: "Sold", price: 268000 }
    ],
    features: ["Top floor", "City views", "Private balcony", "In-unit laundry", "Secure parking", "Building gym"]
  },
  {
    id: "L-008",
    lat: 36.2168, lng: -81.6746,
    address: "12 Pine Crest Ridge",
    city: "Boone",
    state: "NC",
    zip: "28607",
    price: 525000,
    beds: 3,
    baths: 2,
    sqft: 2100,
    lot: "1.50 acres",
    year: 2008,
    status: "Active",
    photos: [
      "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=1200",
      "https://images.unsplash.com/photo-1600210492493-0946911123ea?w=1200"
    ],
    description: "Mountain retreat with long-range Blue Ridge views, a wraparound deck, and a wood-burning stone fireplace. Wraparound deck, hot tub, and a heated workshop. Fiber internet — work from home with the view of your life.",
    sellerId: "U-102",
    listedDate: "2026-05-10",
    commissionSavings: 31500,
    taxValue: 478000,
    priceHistory: [
      { date: "2026-05-10", event: "Listed on Abode", price: 525000 }
    ],
    features: ["Mountain views", "Wraparound deck", "Stone fireplace", "Hot tub", "Heated workshop", "Fiber internet"]
  },
  {
    id: "L-009",
    lat: 34.8526, lng: -82.3940,
    address: "1644 Hawthorne Park",
    city: "Greenville",
    state: "SC",
    zip: "29615",
    price: 445000,
    beds: 4,
    baths: 2.5,
    sqft: 2560,
    lot: "0.32 acres",
    year: 2014,
    status: "Active",
    photos: [
      "https://images.unsplash.com/photo-1494526585095-c41746248156?w=1200",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200"
    ],
    description: "Family-friendly home in a golf course community. Open kitchen flows into a great room, bonus playroom upstairs, and a covered screened porch. Walk to the elementary school and a neighborhood pool.",
    sellerId: "U-103",
    listedDate: "2026-05-14",
    commissionSavings: 26700,
    taxValue: 412000,
    priceHistory: [
      { date: "2026-05-14", event: "Listed on Abode", price: 445000 },
      { date: "2014-06-30", event: "Sold", price: 312000 }
    ],
    features: ["Golf community", "Bonus playroom", "Screened porch", "Open kitchen", "Walk to school", "Neighborhood pool"]
  },
  {
    id: "L-010",
    lat: 35.3300, lng: -82.4400,
    address: "7 Stonebridge Estate",
    city: "Hendersonville",
    state: "NC",
    zip: "28739",
    price: 1250000,
    beds: 5,
    baths: 4.5,
    sqft: 4820,
    lot: "2.30 acres",
    year: 2020,
    status: "Active",
    photos: [
      "https://images.unsplash.com/photo-1567496898669-ee935f5f647a?w=1200",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200"
    ],
    description: "Bespoke modern estate on a gated 2.3-acre lot with mountain views. Soaring great room, chef's kitchen with butler's pantry, infinity-edge pool, dedicated home theater, and a wine cellar. Three-car garage with EV chargers and a guest suite over the garage.",
    sellerId: "U-104",
    listedDate: "2026-05-06",
    commissionSavings: 75000,
    taxValue: 1140000,
    priceHistory: [
      { date: "2026-05-06", event: "Listed on Abode", price: 1250000 }
    ],
    features: ["Gated entrance", "Infinity pool", "Home theater", "Wine cellar", "Butler's pantry", "Three-car garage", "EV chargers", "Guest suite"]
  }
];

// ---------- Users (buyers + sellers) ----------
const ABODE_USERS = [
  { id: "U-101", name: "Marcus & Lila Hartwell", role: "seller", initials: "MH" },
  { id: "U-102", name: "Diane Okafor", role: "seller", initials: "DO" },
  { id: "U-103", name: "The Pemberton Family", role: "seller", initials: "PF" },
  { id: "U-104", name: "Ray Caldwell", role: "seller", initials: "RC" },
  { id: "U-105", name: "Susan & Hank Robles", role: "seller", initials: "SR" },
  { id: "U-106", name: "Tia Brennan", role: "seller", initials: "TB" },
  { id: "U-201", name: "You (Demo Buyer)", role: "buyer", initials: "YB" }
];

// ---------- Offers & negotiation thread ----------
// This drives the negotiation room. Each entry is one event in the thread.
const ABODE_OFFER_THREAD = {
  listingId: "L-001",
  buyerId: "U-201",
  sellerId: "U-101",
  status: "negotiating", // negotiating | accepted | declined | under-contract | closed
  events: [
    {
      type: "offer",
      from: "buyer",
      date: "2026-05-09T14:22:00",
      price: 590000,
      earnestMoney: 8000,
      closingDate: "2026-06-30",
      contingencies: ["Inspection", "Financing", "Appraisal"],
      message: "We love the house. Here's our initial offer with standard contingencies. Pre-approval letter and proof of funds attached.",
      attachments: ["Pre-approval letter.pdf", "Proof of funds.pdf"]
    },
    {
      type: "counter",
      from: "seller",
      date: "2026-05-10T09:15:00",
      price: 608000,
      earnestMoney: 10000,
      closingDate: "2026-06-20",
      contingencies: ["Inspection", "Financing", "Appraisal"],
      message: "Thanks for the offer — the home has only been listed a few weeks and we've had strong interest. We can come down a bit from list, but we'd want to close a little sooner and a slightly higher earnest deposit."
    },
    {
      type: "message",
      from: "buyer",
      date: "2026-05-10T16:40:00",
      message: "Appreciate the quick reply. Reviewing with our lender and will respond by tomorrow."
    }
  ]
};

// Pending offers shown on the seller dashboard.
// receivedAt is the precise time the system logged it — used for the
// "first received wins ties" rule.
const ABODE_PENDING_OFFERS = [
  {
    id: "O-001",
    listingId: "L-001",
    buyerName: "Demo Buyer",
    price: 590000,
    earnestMoney: 8000,
    closingDate: "2026-06-30",
    contingencies: ["Inspection", "Financing", "Appraisal"],
    financing: "Conventional",
    proofOfFunds: true,
    status: "Counter sent",
    date: "2026-05-09",
    receivedAt: "2026-05-09T14:22:00",
    threadId: "L-001"
  },
  {
    id: "O-002",
    listingId: "L-001",
    buyerName: "Jordan Reyes",
    price: 590000,
    earnestMoney: 8000,
    closingDate: "2026-06-30",
    contingencies: ["Inspection", "Financing", "Appraisal"],
    financing: "Conventional",
    proofOfFunds: true,
    status: "Reviewing",
    date: "2026-05-09",
    receivedAt: "2026-05-09T16:08:00",
    threadId: null
  },
  {
    id: "O-003",
    listingId: "L-001",
    buyerName: "Tariq & Anika Hassan",
    price: 575000,
    earnestMoney: 10000,
    closingDate: "2026-06-15",
    contingencies: ["Inspection", "Appraisal"],
    financing: "Cash",
    proofOfFunds: true,
    status: "Reviewing",
    date: "2026-05-08",
    receivedAt: "2026-05-08T11:30:00",
    threadId: null
  }
];

// Buyer's pending offers
const ABODE_BUYER_OFFERS = [
  {
    id: "O-001",
    listingId: "L-001",
    address: "412 Magnolia Lane",
    price: 590000,
    status: "Counter received",
    date: "2026-05-10",
    threadId: "L-001"
  }
];

// Reminders for both dashboards
const ABODE_REMINDERS = {
  buyer: [
    { date: "2026-05-12", text: "Respond to counter offer on 412 Magnolia Lane", urgent: true },
    { date: "2026-05-15", text: "Showing scheduled: 78 Bramblewood Drive at 2:00 PM", urgent: false },
    { date: "2026-05-18", text: "Inspection due for 1209 Riverside Way", urgent: false }
  ],
  seller: [
    { date: "2026-05-11", text: "Open house: Saturday 11–1", urgent: false },
    { date: "2026-05-12", text: "Buyer counter expected today", urgent: true },
    { date: "2026-05-14", text: "Update listing photos — 3 are flagged", urgent: false }
  ]
};

// Messages preview
const ABODE_MESSAGES = [
  { id: "M-1", from: "Demo Buyer", subject: "Counter offer received", preview: "Thanks for the quick response. Reviewing with our lender...", date: "2026-05-10", unread: true },
  { id: "M-2", from: "Jordan Reyes", subject: "Question about HVAC age", preview: "Hi! Loved the showing. Quick question about the HVAC system...", date: "2026-05-08", unread: true },
  { id: "M-3", from: "Abode Education", subject: "Your closing timeline guide", preview: "Now that you have an active offer, here's what to expect...", date: "2026-05-07", unread: false }
];

// ---------- Helpers ----------
function abodeFindListing(id) {
  return ABODE_LISTINGS.find(l => l.id === id);
}

function abodeFindUser(id) {
  return ABODE_USERS.find(u => u.id === id);
}

function abodeFormatPrice(n) {
  return "$" + n.toLocaleString("en-US");
}

function abodeFormatDate(iso) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function abodeFormatDateTime(iso) {
  return new Date(iso).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
}

// Make available globally
window.ABODE = {
  LISTINGS: ABODE_LISTINGS,
  USERS: ABODE_USERS,
  OFFER_THREAD: ABODE_OFFER_THREAD,
  PENDING_OFFERS: ABODE_PENDING_OFFERS,
  BUYER_OFFERS: ABODE_BUYER_OFFERS,
  REMINDERS: ABODE_REMINDERS,
  MESSAGES: ABODE_MESSAGES,
  findListing: abodeFindListing,
  findUser: abodeFindUser,
  formatPrice: abodeFormatPrice,
  formatDate: abodeFormatDate,
  formatDateTime: abodeFormatDateTime
};
