const BASE_URL = "http://localhost:3000";

async function runTests() {
  console.log("=== 1. Testing Admin Access Hiding in Public Navigation ===");
  
  // Test Home Page
  const homeRes = await fetch(`${BASE_URL}/`);
  const homeHtml = await homeRes.text();
  if (homeHtml.includes("/admin/login") || homeHtml.includes("Admin Portal") || homeHtml.includes("Admin Login")) {
    throw new Error("FAILED: Admin link found in public home page HTML!");
  }
  console.log("✓ Home page has NO admin links or buttons in header, navigation, or footer.");

  // Test Directory Page
  const dirRes = await fetch(`${BASE_URL}/directory`);
  const dirHtml = await dirRes.text();
  if (dirHtml.includes("/admin/login") || dirHtml.includes("Admin Portal") || dirHtml.includes("Admin Login")) {
    throw new Error("FAILED: Admin link found in public directory page HTML!");
  }
  console.log("✓ Directory page has NO admin links or buttons.");

  // Test Contact Page
  const contactRes = await fetch(`${BASE_URL}/contact`);
  const contactHtml = await contactRes.text();
  if (contactHtml.includes("/admin/login") || contactHtml.includes("Admin Portal") || contactHtml.includes("Admin Login")) {
    throw new Error("FAILED: Admin link found in public contact page HTML!");
  }
  console.log("✓ Contact page has NO admin links or buttons.");

  console.log("\n=== 2. Testing Server-Side Redirection & Security for /admin ===");

  // Request /admin without cookies (redirect: "manual" so we can inspect 307)
  const unauthAdminRes = await fetch(`${BASE_URL}/admin`, { redirect: "manual" });
  console.log(`Unauthenticated GET /admin status: ${unauthAdminRes.status}`);
  const locationHeader = unauthAdminRes.headers.get("location");
  console.log(`Location redirect header: ${locationHeader}`);

  if (unauthAdminRes.status !== 307 && unauthAdminRes.status !== 302 && unauthAdminRes.status !== 308) {
    throw new Error(`FAILED: Expected 307 redirect for unauthenticated /admin, got ${unauthAdminRes.status}`);
  }
  if (!locationHeader || !locationHeader.includes("/admin/login")) {
    throw new Error(`FAILED: Expected location header pointing to /admin/login, got ${locationHeader}`);
  }
  console.log("✓ Unauthenticated visitor is immediately redirected server-side to /admin/login.");

  // Request /admin/login
  const loginPageRes = await fetch(`${BASE_URL}/admin/login`);
  if (!loginPageRes.ok) {
    throw new Error(`FAILED: /admin/login returned status ${loginPageRes.status}`);
  }
  console.log("✓ Admin login page (/admin/login) is publicly accessible and returns 200 OK.");

  console.log("\n=== 3. Testing Protected Admin API Operations ===");

  // Attempt to fetch /api/admin/users without token
  const apiUsersRes = await fetch(`${BASE_URL}/api/admin/users`);
  if (apiUsersRes.status !== 401) {
    throw new Error(`FAILED: GET /api/admin/users should return 401, got ${apiUsersRes.status}`);
  }
  console.log("✓ GET /api/admin/users correctly rejected with 401 Unauthorized.");

  // Attempt to update /api/settings without token
  const apiSettingsRes = await fetch(`${BASE_URL}/api/settings`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ siteName: "Hacked Site" }),
  });
  if (apiSettingsRes.status !== 401) {
    throw new Error(`FAILED: PUT /api/settings should return 401, got ${apiSettingsRes.status}`);
  }
  console.log("✓ PUT /api/settings correctly rejected with 401 Unauthorized.");

  // Attempt to fetch audit logs without token
  const apiAuditRes = await fetch(`${BASE_URL}/api/audit-logs`);
  if (apiAuditRes.status !== 401) {
    throw new Error(`FAILED: GET /api/audit-logs should return 401, got ${apiAuditRes.status}`);
  }
  console.log("✓ GET /api/audit-logs correctly rejected with 401 Unauthorized.");

  console.log("\n=== 4. Testing Admin Authentication Workflow ===");

  // Test admin login with valid credentials
  const loginRes = await fetch(`${BASE_URL}/api/auth`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: "admin@alokworld.in",
      password: "AdminSecure@2026",
    }),
  });

  if (!loginRes.ok) {
    throw new Error(`FAILED: Login failed with status ${loginRes.status}`);
  }
  const loginData = await loginRes.json();
  const setCookieHeader = loginRes.headers.get("set-cookie");
  if (!setCookieHeader || !setCookieHeader.includes("admin_token=")) {
    throw new Error("FAILED: Login did not return httpOnly admin_token cookie!");
  }
  console.log(`✓ Admin login successful. Token cookie received (Role: ${loginData.admin?.role}).`);

  // Extract admin_token cookie
  const cookieMatch = setCookieHeader.match(/admin_token=([^;]+)/);
  const token = cookieMatch ? cookieMatch[1] : null;

  // Request /admin WITH admin_token cookie
  const authAdminRes = await fetch(`${BASE_URL}/admin`, {
    headers: { Cookie: `admin_token=${token}` },
    redirect: "manual",
  });
  console.log(`Authenticated GET /admin status: ${authAdminRes.status}`);
  if (authAdminRes.status !== 200) {
    throw new Error(`FAILED: Expected 200 OK for authenticated /admin, got ${authAdminRes.status}`);
  }
  console.log("✓ Authenticated admin receives 200 OK on /admin without redirect.");

  console.log("\n=== 5. Testing Light Warm Cream Palette (#FFFCF5 & #F0E5D5) ===");
  if (!homeHtml.includes("#FFFCF5")) {
    throw new Error("FAILED: #FFFCF5 not found in home HTML!");
  }
  console.log("✓ Light warm cream background (#FFFCF5) verified in rendered HTML.");

  console.log("\n========================================================");
  console.log("ALL TESTS PASSED SUCCESSFULLY! Security & UI Verified.");
  console.log("========================================================");
}

runTests().catch((err) => {
  console.error("\n❌ TEST FAILED:", err.message);
  process.exit(1);
});
