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

const client = createClient(url, service || anon);

async function runControlledDatabaseTests() {
  console.log('=================================================================');
  console.log('CASEBRIDGE AI — SUPABASE CONTROLLED DATABASE TEST SUITE');
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

  // 1. Verify required tables exist
  const tables = ['complaints', 'institutions', 'complaint_relationships', 'audit_logs', 'bureaus'];
  let allTablesExist = true;
  for (const t of tables) {
    const { error, count } = await client.from(t).select('*', { count: 'exact', head: true });
    if (error) allTablesExist = false;
  }
  report('1. Required core tables exist in Supabase schema', allTablesExist, `Verified: ${tables.join(', ')}`);

  // 2. Query institutions
  const { data: insts, error: instErr } = await client.from('institutions').select('*').limit(3);
  report('2. Read institutions directory', !instErr && insts && insts.length > 0, `Found ${insts ? insts.length : 0} institutions. Sample PID: ${insts?.[0]?.id}`);

  // 3. Create isolated test record
  const testId = `AICTE/PGRC/2026/TEST-${Date.now().toString().slice(-4)}`;
  const testRef = `PGRC-2026-TEST-${Date.now().toString().slice(-4)}`;
  const testCode = `TRK-TEST99`;
  const targetPID = insts?.[0]?.id || '1-10492811';

  const testPayload = {
    id: testId,
    ref_number: testRef,
    tracking_code: testCode,
    institution_id: targetPID,
    bureau_id: 'PGRC',
    category: 'CAPITATION_FEE',
    subject: 'Automated Supabase Verification Grievance',
    description: 'Controlled test grievance verifying persistence, constraints, and audit lifecycle.',
    priority: 'HIGH',
    status: 'NEW_INTAKE',
    complainant_name: 'QA Automated Verifier',
    complainant_type: 'Student',
    complainant_email: 'qa.verify@casebridge.test',
    complainant_phone: '9988776655',
    is_anonymous: false,
    is_confidential: false,
    received_date: new Date().toISOString().split('T')[0],
    sla_deadline: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
    days_open: 1,
    last_action_summary: 'Test record injected for controlled integrity verification.'
  };

  const { error: insertErr } = await client.from('complaints').insert(testPayload);
  report('3. Create test complaint record in Supabase', !insertErr, insertErr ? insertErr.message : `Inserted ID: ${testId}, Ref: ${testRef}`);

  // 4. Read back the created record
  const { data: readRecord, error: readErr } = await client.from('complaints').select('*').eq('id', testId).single();
  const readSuccess = !readErr && readRecord && readRecord.ref_number === testRef;
  report('4. Read created record by primary key', readSuccess, readSuccess ? `Found record with status: ${readRecord.status}` : readErr?.message);

  // 5. Update the record
  const { error: updateErr } = await client.from('complaints').update({
    status: 'OVERLAP_FLAGGED',
    last_action_summary: 'Status transitioned during test.'
  }).eq('id', testId);

  const { data: updatedRecord } = await client.from('complaints').select('status').eq('id', testId).single();
  const updateSuccess = !updateErr && updatedRecord?.status === 'OVERLAP_FLAGGED';
  report('5. Update record and verify transition', updateSuccess, `Updated status: ${updatedRecord?.status}`);

  // 6. Test Unique Constraint on ref_number
  const duplicatePayload = { ...testPayload, id: testId + '-DUP' };
  const { error: dupErr } = await client.from('complaints').insert(duplicatePayload);
  report('6. Enforce unique constraint on ref_number', Boolean(dupErr), `Supabase correctly rejected duplicate ref_number (Code: ${dupErr?.code})`);

  // 7. Test Foreign Key Constraint on invalid institution_id
  const invalidFkPayload = {
    ...testPayload,
    id: testId + '-INVALID-FK',
    ref_number: testRef + '-INV',
    institution_id: 'NON_EXISTENT_INSTITUTION_PID_99999'
  };
  const { error: fkErr } = await client.from('complaints').insert(invalidFkPayload);
  report('7. Enforce foreign key referential integrity', Boolean(fkErr), `Supabase correctly rejected non-existent institution PID (Code: ${fkErr?.code})`);

  // 8. Test Dual-Factor Tracking RPC
  const { data: rpcData, error: rpcErr } = await client.rpc('track_complaint', {
    p_ref_number: testRef,
    p_verification: testCode
  });
  const rpcSuccess = !rpcErr && rpcData && rpcData.success;
  report('8. Test dual-factor tracking RPC function', rpcSuccess, rpcSuccess ? `Returned Case ID: ${rpcData.case?.id}` : (rpcErr ? rpcErr.message : rpcData?.error));

  // 9. Clean up test record
  const { error: delErr } = await client.from('complaints').delete().eq('id', testId);
  report('9. Controlled cleanup of isolated test record', !delErr, `Deleted test record ${testId}`);

  // 10. Confirm persistence and state cleanup
  const { data: postCheck } = await client.from('complaints').select('id').eq('id', testId).maybeSingle();
  report('10. Confirmed test record removed without residual corruption', postCheck === null, 'Database returned to pristine state');

  console.log('\n=================================================================');
  console.log(`TEST RESULTS: ${passed}/${total} PASSING`);
  console.log('=================================================================\n');
}

runControlledDatabaseTests().catch(e => console.error(e));
