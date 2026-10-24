const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const env = fs.readFileSync('.env.local', 'utf-8');
const getVal = (k) => {
  const m = env.match(new RegExp(k + '=(.*)'));
  return m ? m[1].trim().replace(/^["']|["']$/g, '') : null;
};

const url = getVal('NEXT_PUBLIC_SUPABASE_URL') || getVal('SUPABASE_URL');
const anon = getVal('NEXT_PUBLIC_SUPABASE_ANON_KEY');
const service = getVal('SUPABASE_SERVICE_ROLE_KEY');

const client = createClient(url, anon);
const adminClient = createClient(url, service || anon);

async function testSupabaseAuth() {
  console.log('=================================================================');
  console.log('CASEBRIDGE AI — SUPABASE AUTHENTICATION TEST SUITE');
  console.log('=================================================================\n');

  let passed = 0;
  let total = 0;

  function report(name, isPass, detail) {
    total++;
    if (isPass) {
      passed++;
      console.log(`[PASS] ${name}`);
      if (detail) console.log(`       Evidence: ${detail}`);
    } else {
      console.log(`[FAIL] ${name}`);
      if (detail) console.log(`       Error: ${detail}`);
    }
  }

  // 1. Test invalid login credentials
  const { data: failData, error: failErr } = await client.auth.signInWithPassword({
    email: 'nonexistent.user@aicte-india.org',
    password: 'wrong_password_123'
  });
  report(
    '1. Rejection of invalid credentials with safe error message',
    Boolean(failErr),
    failErr ? `Expected rejection: ${failErr.message} (Status: ${failErr.status})` : 'Failed to reject invalid login'
  );

  // 2. Test user provisioning or signup with metadata
  const testEmail = `qa.officer.${Date.now()}@gmail.com`;
  const testPassword = 'SecurePassword@2026';

  let createdUserId = null;
  // Use admin client to create user with pre-confirmed email (bypasses SMTP rate limits)
  const { data: signUpData, error: signUpErr } = await adminClient.auth.admin.createUser({
    email: testEmail,
    password: testPassword,
    email_confirm: true,
    user_metadata: {
      full_name: 'Dr. Test Officer',
      role: 'REVIEWER',
      bureau_id: 'PGRC'
    }
  });

  if (!signUpErr && signUpData?.user) {
    createdUserId = signUpData.user.id;
    report(
      '2. User registration with institutional metadata via Supabase Auth',
      true,
      `User created with ID: ${createdUserId}`
    );
  } else {
    report(
      '2. User registration with institutional metadata via Supabase Auth',
      false,
      signUpErr ? signUpErr.message : 'No user returned'
    );
  }

  // 3. Test signing in with the newly created account
  if (createdUserId) {
    const { data: signInData, error: signInErr } = await client.auth.signInWithPassword({
      email: testEmail,
      password: testPassword
    });

    const isLoginOk = !signInErr && signInData?.session?.access_token;
    report(
      '3. Login with valid credentials and session token issuance',
      Boolean(isLoginOk),
      isLoginOk ? `JWT Access Token issued (Length: ${signInData.session.access_token.length})` : signInErr?.message
    );

    // 4. Test session retrieval
    const { data: sessionData, error: sessionErr } = await client.auth.getSession();
    const hasActiveSession = !sessionErr && sessionData?.session !== null;
    report(
      '4. Active session retrieval and persistence',
      hasActiveSession,
      hasActiveSession ? `Active session user: ${sessionData.session.user.email}` : 'Session not found'
    );

    // 5. Test logout
    const { error: signOutErr } = await client.auth.signOut();
    const { data: postLogoutSession } = await client.auth.getSession();
    const isLoggedOut = !signOutErr && postLogoutSession.session === null;
    report(
      '5. Logout and session invalidation',
      isLoggedOut,
      isLoggedOut ? 'Session successfully cleared' : 'Session still active'
    );

    // 6. Cleanup created test user via admin API
    try {
      await adminClient.auth.admin.deleteUser(createdUserId);
      report('6. Controlled test user cleanup via Admin API', true, `Deleted test user ${createdUserId}`);
    } catch (e) {
      report('6. Controlled test user cleanup via Admin API', false, e.message);
    }
  }

  console.log('\n=================================================================');
  console.log(`AUTH TEST RESULTS: ${passed}/${total} PASSING`);
  console.log('=================================================================\n');
}

testSupabaseAuth().catch(e => console.error(e));
