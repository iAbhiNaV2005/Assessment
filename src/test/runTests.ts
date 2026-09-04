// Test runner for Borrower Copilot Domain Engine
import { assessBorrowerProfile } from '../domain/engine';
import { PERSONA_PRESETS } from '../domain/presets';

console.log("==================================================");
console.log("   BORROWER COPILOT DOMAIN ENGINE TEST SUITE");
console.log("==================================================\n");

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`[FAIL] ${message}`);
    process.exit(1);
  } else {
    console.log(`[PASS] ${message}`);
  }
}

// 1. TEST PRIYA (Salaried MNC, Bengaluru)
console.log("\n--- Testing Persona 1: Priya (Salaried MNC, Bengaluru) ---");
const priyaResult = assessBorrowerProfile(PERSONA_PRESETS.priya.profile);
console.log(`Verdict: ${priyaResult.O1_Verdict.verdict} - ${priyaResult.O1_Verdict.headline}`);
console.log(`Lender Sanction: ₹${(priyaResult.O2_Capacity.lenderSanctionAmount / 100000).toFixed(2)}L | Safe Carry: ₹${(priyaResult.O2_Capacity.safeCarryAmount / 100000).toFixed(2)}L`);
console.log(`Recommended Product: ${priyaResult.O3_Pricing.productDisplayName} @ ${priyaResult.O3_Pricing.rateBandMin}% - ${priyaResult.O3_Pricing.rateBandMax}% (APR: ${priyaResult.O3_Pricing.aprMin}% - ${priyaResult.O3_Pricing.aprMax}%)`);
console.log(`Safe EMI Ceiling: ₹${priyaResult.O4_Outflow.safeEmiCeiling}/mo`);

assert(priyaResult.O1_Verdict.verdict === 'BORROW', 'Priya verdict must be BORROW');
assert(priyaResult.O2_Capacity.lenderSanctionAmount > priyaResult.O2_Capacity.safeCarryAmount, 'Priya lender sanction must exceed safe carry');
assert(priyaResult.O2_Capacity.primaryMetricToUse === 'safe_carry', 'Priya advised to use safe carry');
assert(priyaResult.O3_Pricing.rateBandMin <= 11.0, 'Priya prime CIBIL rate must be <= 11.0%');
assert(priyaResult.O3_Pricing.aprMin > priyaResult.O3_Pricing.rateBandMin, 'All-in APR must honestly include fees and exceed nominal rate');

// 2. TEST RAVI (Kirana Self-Employed, Mysuru)
console.log("\n--- Testing Persona 2: Ravi (Kirana Owner, Mysuru) ---");
const raviResult = assessBorrowerProfile(PERSONA_PRESETS.ravi.profile);
console.log(`Verdict: ${raviResult.O1_Verdict.verdict} - ${raviResult.O1_Verdict.headline}`);
console.log(`Product Routed: ${raviResult.O3_Pricing.productDisplayName}`);
console.log(`Rate Band: ${raviResult.O3_Pricing.rateBandMin}% - ${raviResult.O3_Pricing.rateBandMax}%`);
console.log(`Routing Rationale: ${raviResult.O3_Pricing.routingReason}`);

assert(raviResult.O3_Pricing.recommendedProduct === 'lap_secured', 'Ravi must be routed to LAP secured mortgage');
assert(raviResult.O3_Pricing.rateBandMin < 10.0, 'LAP rate must be prime repo-linked (< 10.0%)');
assert(raviResult.O2_Capacity.lenderSanctionAmount >= 1500000, 'Collateral backing must support ₹15L sanction');
assert(raviResult.O1_Verdict.verdict === 'BORROW', 'Ravi verdict must be BORROW via LAP');

// 3. TEST ANITA (Informal Gig Delivery & Tailor, Hubballi)
console.log("\n--- Testing Persona 3: Anita (Informal Gig & Tailor, Hubballi) ---");
const anitaResult = assessBorrowerProfile(PERSONA_PRESETS.anita.profile);
console.log(`Verdict: ${anitaResult.O1_Verdict.verdict} - ${anitaResult.O1_Verdict.headline}`);
console.log(`Reason: ${anitaResult.O1_Verdict.reason}`);
console.log(`Flags: ${anitaResult.O1_Verdict.criticalFlags.map(f => f.title).join(', ')}`);

assert(anitaResult.O1_Verdict.verdict === 'DONT_BORROW', 'Anita verdict must be DONT_BORROW due to predatory debt spiral');
assert(anitaResult.O1_Verdict.criticalFlags.some(f => f.title.includes('Predatory Debt Spiral')), 'Anita must trigger predatory debt spiral flag');
assert(anitaResult.O2_Capacity.recommendedAmount === 0, 'Anita recommended fresh borrowing must be 0 until consolidation');

console.log("\n==================================================");
console.log("   ALL DOMAIN REASONING TESTS PASSED PERFECTLY!");
console.log("==================================================");
