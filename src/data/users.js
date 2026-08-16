// Mock guest profile — replace with authenticated session data once a backend exists.
export const guestUser = {
  id: "u-001",
  name: "Camille Fontaine",
  email: "camille.fontaine@example.com",
  phone: "+1 (415) 555-0148",
  hotel: "The Meridian Hotel",
  room: "412",
  memberSince: "2024",
  tier: "Gold Guest",
};

// Mock admin account shape — no real credentials. Login UI validates against this
// shape only for demo purposes; a real deployment must verify against a backend.
export const adminDemoHint = {
  note: "Demo only — any email/password combination signs in locally. Connect a real auth backend before launch.",
};
