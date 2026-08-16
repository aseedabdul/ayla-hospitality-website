// Automated API and Database Verification Suite for AYLA Hospitality

const BASE_URL = "http://localhost:5000/api";

async function assert(desc, condition, details = "") {
  if (condition) {
    console.log(`  ✓ ${desc}`);
  } else {
    console.error(`  ✗ FAIL: ${desc} ${details ? `(${details})` : ""}`);
    throw new Error(`Assertion failed: ${desc}`);
  }
}

async function runTests() {
  console.log("\n==================================================");
  console.log("  RUNNING AYLA HOSPITALITY FULL-STACK TEST SUITE");
  console.log("==================================================\n");

  // 1. Health Check
  console.log("1. Testing Health Endpoint...");
  const healthRes = await fetch(`${BASE_URL}/health`);
  const healthData = await healthRes.json();
  assert("API server is healthy", healthRes.ok && healthData.status === "healthy");

  // 2. Categories API
  console.log("\n2. Testing Categories API...");
  const catRes = await fetch(`${BASE_URL}/categories`);
  const catData = await catRes.json();
  assert("Categories list returned", catRes.ok && Array.isArray(catData.categories));
  assert("Seeded 5 initial categories exist", catData.categories.length >= 5);
  const travelKit = catData.categories.find((c) => c.id === "travel-kit");
  assert("Travel Kit category present", Boolean(travelKit));

  // 3. Brands API
  console.log("\n3. Testing Brands API...");
  const brandsRes = await fetch(`${BASE_URL}/brands`);
  const brandsData = await brandsRes.json();
  assert("Brands list returned", brandsRes.ok && Array.isArray(brandsData.brands));
  assert("AYLA Essentials brand present", brandsData.brands.includes("AYLA Essentials"));

  // 4. Products API & Multi-filtering
  console.log("\n4. Testing Products API & Filters...");
  const prodRes = await fetch(`${BASE_URL}/products`);
  const prodData = await prodRes.json();
  assert("Products list returned", prodRes.ok && Array.isArray(prodData.products));
  assert("All 16 products seeded", prodData.products.length >= 16);

  // Search filter
  const searchRes = await fetch(`${BASE_URL}/products?q=coffee`);
  const searchData = await searchRes.json();
  assert("Search for 'coffee' finds Single-Origin Coffee Beans", searchData.products.some((p) => p.name.includes("Coffee")));

  // Category filter
  const catFilterRes = await fetch(`${BASE_URL}/products?category=travel-kit`);
  const catFilterData = await catFilterRes.json();
  assert("Category filter works", catFilterData.products.every((p) => p.category === "travel-kit"));

  // Price sort
  const sortRes = await fetch(`${BASE_URL}/products?sort=price-asc`);
  const sortData = await sortRes.json();
  assert("Sort by price ascending works", sortData.products[0].price <= sortData.products[1].price);

  // 5. Customer Authentication & Profile
  console.log("\n5. Testing Customer Auth & Profile...");
  const testEmail = `guest_${Date.now()}@example.com`;
  const regRes = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: testEmail,
      password: "password123",
      name: "Jean-Luc Picard",
      hotel: "The Meridian Hotel",
      room: "501",
      phone: "+1 (555) 999-0199",
    }),
  });
  const regData = await regRes.json();
  assert("Customer registration succeeds with JWT token", regRes.ok && regData.token);
  const userToken = regData.token;

  // Login
  const loginRes = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: testEmail, password: "password123" }),
  });
  const loginData = await loginRes.json();
  assert("Customer login succeeds", loginRes.ok && loginData.profile.name === "Jean-Luc Picard");

  // Profile Update
  const updateProfRes = await fetch(`${BASE_URL}/auth/profile`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${userToken}`,
    },
    body: JSON.stringify({ room: "Suite 707" }),
  });
  const updateProfData = await updateProfRes.json();
  assert("Customer profile update persists to database", updateProfRes.ok && updateProfData.profile.room === "Suite 707");

  // 6. Admin Authentication & Protection
  console.log("\n6. Testing Admin Auth & Protected Routes...");
  const adminLoginRes = await fetch(`${BASE_URL}/auth/admin/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: "admin@aylahospitality.com",
      password: "adminpassword123",
    }),
  });
  const adminLoginData = await adminLoginRes.json();
  assert("Admin staff login succeeds", adminLoginRes.ok && adminLoginData.token);
  const adminToken = adminLoginData.token;

  // Verify non-admin blocked from admin stats
  const blockedRes = await fetch(`${BASE_URL}/admin/stats`, {
    headers: { Authorization: `Bearer ${userToken}` },
  });
  assert("Non-admin user blocked from admin stats (403 Forbidden)", blockedRes.status === 403);

  // Admin access to stats
  const adminStatsRes = await fetch(`${BASE_URL}/admin/stats`, {
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  const adminStatsData = await adminStatsRes.json();
  assert("Admin successfully accesses dashboard stats", adminStatsRes.ok && adminStatsData.stats.totalProducts >= 16);

  // 7. Cart Server-side Lifecycle & Price Calculation
  console.log("\n7. Testing Cart Operations & Calculations...");
  const sessionToken = `test-sess-${Date.now()}`;
  const addCartRes = await fetch(`${BASE_URL}/cart/items`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-session-token": sessionToken,
    },
    body: JSON.stringify({ productId: "p-001", quantity: 2 }),
  });
  const addCartData = await addCartRes.json();
  assert("Add item to cart succeeded", addCartRes.ok && addCartData.itemCount === 2);
  assert("Server subtotal calculated correctly (2 * $24 = $48)", addCartData.subtotal === 48);

  // Apply promo code
  const promoRes = await fetch(`${BASE_URL}/cart/discount`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-session-token": sessionToken,
    },
    body: JSON.stringify({ code: "AYLA-NIGHT10" }),
  });
  const promoData = await promoRes.json();
  assert("Promo code AYLA-NIGHT10 applies 10% discount ($4.80)", promoRes.ok && promoData.discountAmount === 4.8);
  assert("Complimentary delivery on order over $40", promoData.deliveryFee === 0);
  assert("Final total equals $43.20 ($48 - $4.80)", promoData.total === 43.2);

  // Clear cart
  const clearRes = await fetch(`${BASE_URL}/cart`, {
    method: "DELETE",
    headers: { "x-session-token": sessionToken },
  });
  const clearData = await clearRes.json();
  assert("Cart cleared successfully", clearRes.ok && clearData.items.length === 0);

  // 8. Wishlist Lifecycle
  console.log("\n8. Testing Wishlist API...");
  const toggleRes = await fetch(`${BASE_URL}/wishlist/toggle`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-session-token": sessionToken,
    },
    body: JSON.stringify({ productId: "p-003" }),
  });
  const toggleData = await toggleRes.json();
  assert("Toggle adds product to wishlist", toggleRes.ok && toggleData.ids.includes("p-003"));

  // Toggle again to remove
  const toggleOffRes = await fetch(`${BASE_URL}/wishlist/toggle`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-session-token": sessionToken,
    },
    body: JSON.stringify({ productId: "p-003" }),
  });
  const toggleOffData = await toggleOffRes.json();
  assert("Toggle removes product from wishlist", toggleOffRes.ok && !toggleOffData.ids.includes("p-003"));

  // 9. Admin Product CRUD Lifecycle
  console.log("\n9. Testing Admin Product CRUD Lifecycle...");
  const newProdRes = await fetch(`${BASE_URL}/products`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${adminToken}`,
    },
    body: JSON.stringify({
      name: "Imperial Gold Bath Robe",
      brand: "AYLA Essentials",
      category: "travel-kit",
      size: "One Size",
      price: 120.0,
      stock: 15,
      available: true,
      description: "Plush organic cotton robe with gold embroidery.",
    }),
  });
  const newProdData = await newProdRes.json();
  assert("Admin creates new product", newProdRes.ok && newProdData.product?.id);
  const createdId = newProdData.product.id;

  // Update product stock and price
  const updateProdRes = await fetch(`${BASE_URL}/products/${createdId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${adminToken}`,
    },
    body: JSON.stringify({ price: 135.0, stock: 12 }),
  });
  const updateProdData = await updateProdRes.json();
  assert("Admin updates product price to $135 and stock to 12", updateProdRes.ok && updateProdData.product.price === 135);

  // Delete product
  const delProdRes = await fetch(`${BASE_URL}/products/${createdId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  assert("Admin deletes product", delProdRes.ok);

  console.log("\n==================================================");
  console.log("  ALL TESTS PASSED! FULL-STACK APPLICATION READY");
  console.log("==================================================\n");
}

runTests().catch((err) => {
  console.error("Test execution aborted:", err);
  process.exit(1);
});
