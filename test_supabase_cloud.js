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

console.log('--- SUPABASE ENVIRONMENT AUDIT ---');
console.log('Supabase URL:', url);
console.log('Anon Key Present:', Boolean(anon));
console.log('Service Role Key Present:', Boolean(service));

async function testSupabase() {
  if (!url || (!anon && !service)) {
    console.error('FAIL: Missing Supabase credentials in .env.local');
    return;
  }

  const client = createClient(url, service || anon);

  console.log('\n--- TESTING TABLE SCHEMAS & ACCESS ---');
  const tables = ['complaints', 'institutions', 'complaint_relationships', 'audit_logs', 'users_profile', 'bureaus'];
  
  for (const table of tables) {
    try {
      const { data, error, count } = await client.from(table).select('*', { count: 'exact', head: false }).limit(2);
      if (error) {
        console.log(`Table [${table}]: ERROR -> ${error.message} (Code: ${error.code})`);
      } else {
        console.log(`Table [${table}]: OK -> Count: ${count}, Sample rows: ${data ? data.length : 0}`);
      }
    } catch (e) {
      console.log(`Table [${table}]: EXCEPTION -> ${e.message}`);
    }
  }

  console.log('\n--- TESTING SUPABASE AUTHENTICATION ---');
  try {
    const { data: authData, error: authError } = await client.auth.getSession();
    if (authError) {
      console.log('Auth getSession error:', authError.message);
    } else {
      console.log('Auth service reachable. Initial session:', authData.session ? 'Active' : 'No active session (Anonymous)');
    }
  } catch (e) {
    console.log('Auth exception:', e.message);
  }
}

testSupabase();
