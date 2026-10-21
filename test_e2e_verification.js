const http = require('http');

async function testFetch(url) {
  return new Promise((resolve) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, length: data.length }));
    }).on('error', (err) => resolve({ status: 500, error: err.message }));
  });
}

async function runTests() {
  console.log("=== CASEBRIDGE AI E2E VERIFICATION SUITE ===");

  const routes = [
    // Public Website
    "http://localhost:3000/",
    "http://localhost:3000/about",
    "http://localhost:3000/how-it-works",
    "http://localhost:3000/help",
    "http://localhost:3000/track-complaint",
    "http://localhost:3000/login",
    
    // Student & Public Complaint Portal
    "http://localhost:3000/complaints/register",
    "http://localhost:3000/complaints/confirmation?ref=PGRC-2026-0892&code=TRK-882194",
    "http://localhost:3000/complaints/track",
    "http://localhost:3000/complaints/AICTE%2FPGRC%2F2026%2F0892",
    
    // Institution Portal
    "http://localhost:3000/institution/login",
    "http://localhost:3000/institution/dashboard",
    "http://localhost:3000/institution/complaints",
    "http://localhost:3000/institution/complaints/AICTE%2FPGRC%2F2026%2F0892",
    "http://localhost:3000/institution/profile",
    "http://localhost:3000/institution/responses",
    
    // Administrative Console
    "http://localhost:3000/dashboard",
    "http://localhost:3000/cases",
    "http://localhost:3000/cases/AICTE%2FPGRC%2F2026%2F0892",
    "http://localhost:3000/institutions",
    "http://localhost:3000/institutions/1-10492811",
    "http://localhost:3000/overlap-review",
    "http://localhost:3000/overlap-review/OVL-2026-001",
    "http://localhost:3000/intake",
    "http://localhost:3000/reports",
    "http://localhost:3000/admin/access"
  ];

  let passed = 0;
  let failed = 0;

  for (const r of routes) {
    const res = await testFetch(r);
    if (res.status === 200) {
      console.log(`[PASS] ${res.status} - ${r}`);
      passed++;
    } else {
      console.error(`[FAIL] ${res.status} - ${r}`);
      failed++;
    }
  }

  console.log(`\nROUTE RESULTS: ${passed} Passed, ${failed} Failed out of ${routes.length} routes.`);
  if (failed > 0) process.exit(1);
}

runTests();
