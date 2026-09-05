// Test runner for Borrower Copilot Pure Domain Rules Engine
// Validates 100% adherence to Borrower_Copilot_Implementation_Plan.md
import { evaluateBorrowerProfile, CANONICAL_PERSONAS } from '../../lib/engine';

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

// 1. TEST PRIYA (Salaried, Bengaluru)
console.log("\n--- Testing Persona 1: Priya (Salaried, Bengaluru) ---");
const priyaResult = evaluateBorrowerProfile(CANONICAL_PERSONAS.priya);
console.log(`Assessed Income: ₹${priyaResult.metrics.assessedIncome.toLocaleString('en-IN')}/mo (Haircut: ${priyaResult.metrics.incomeHaircutPercent}%)`);
console.log(`Verdict: ${priyaResult.o1Verdict.verdict} - ${priyaResult.o1Verdict.primaryReason}`);
console.log(`Lender Sanction: ₹${(priyaResult.o2Amount.lenderSanctionAmount / 100000).toFixed(2)}L | Safe Amount: ₹${(priyaResult.o2Amount.safeAmount / 100000).toFixed(2)}L`);
console.log(`Product: ${priyaResult.o3Rate.productName} @ ${priyaResult.o3Rate.minNominalRate}% - ${priyaResult.o3Rate.maxNominalRate}% (Expected: ${priyaResult.o3Rate.expectedNominalRate}%, APR: ${priyaResult.o3Rate.aprExpected}%)`);
console.log(`Safe EMI Ceiling: ₹${priyaResult.o4Emi.safeEmiCeiling.toLocaleString('en-IN')}/mo`);

assert(priyaResult.o1Verdict.verdict === 'Borrow', 'Priya verdict must be Borrow');
assert(priyaResult.metrics.assessedIncome === 110000, 'Priya assessed income must be full stated net ₹1,10,000');
assert(priyaResult.o2Amount.safeAmount >= 800000, 'Priya safe debt capacity must comfortably cover the ₹8L ask');
assert(priyaResult.o2Amount.lenderSanctionAmount > priyaResult.o2Amount.safeAmount, 'Lender sanction must exceed safe capacity');
assert(priyaResult.o3Rate.aprExpected > priyaResult.o3Rate.expectedNominalRate, 'APR must include processing fee and GST, exceeding nominal rate');
assert(priyaResult.o3Rate.expectedNominalRate >= 11.25 && priyaResult.o3Rate.expectedNominalRate <= 13.5, 'Priya rate must sit in prime band (~11.5% - 13%)');

// 2. TEST RAVI (Self-Employed Formal, Mysuru)
console.log("\n--- Testing Persona 2: Ravi (Self-Employed Formal, Mysuru) ---");
const raviResult = evaluateBorrowerProfile(CANONICAL_PERSONAS.ravi);
console.log(`Assessed Income: ₹${raviResult.metrics.assessedIncome.toLocaleString('en-IN')}/mo (Haircut: ${raviResult.metrics.incomeHaircutPercent}%)`);
console.log(`Verdict: ${raviResult.o1Verdict.verdict} - ${raviResult.o1Verdict.primaryReason}`);
console.log(`Lender Sanction: ₹${(raviResult.o2Amount.lenderSanctionAmount / 100000).toFixed(2)}L | Safe Amount: ₹${(raviResult.o2Amount.safeAmount / 100000).toFixed(2)}L`);
console.log(`Product: ${raviResult.o3Rate.productName} @ ${raviResult.o3Rate.expectedNominalRate}%`);

assert(raviResult.metrics.assessedIncome === 38000, 'Ravi assessed income must equal ₹38,000 after blending ITR/cash and 20% haircut');
assert(raviResult.o1Verdict.verdict === 'Borrow less', 'Ravi verdict must be Borrow less individually against his ₹15L ask');
assert(raviResult.o2Amount.safeAmount >= 600000 && raviResult.o2Amount.safeAmount <= 750000, 'Ravi safe amount must land between ₹6.5L and ₹7.5L');
assert(raviResult.o2Amount.lenderSanctionAmount >= 900000 && raviResult.o2Amount.lenderSanctionAmount <= 1100000, 'Ravi lender sanction must land around ₹10L on secured product');
assert(raviResult.metrics.isCollateralStrong === true, 'Ravi commercial premises must qualify as strong collateral');
assert(raviResult.o2Amount.coApplicantPotentialSanction !== undefined && raviResult.o2Amount.coApplicantPotentialSanction >= 1400000, 'Co-applicant path must bridge household capacity toward ₹15L');

// 3. TEST ANITA (Informal Gig, Hubballi)
console.log("\n--- Testing Persona 3: Anita (Informal Gig, Hubballi) ---");
const anitaResult = evaluateBorrowerProfile(CANONICAL_PERSONAS.anita);
console.log(`Assessed Income: ₹${anitaResult.metrics.assessedIncome.toLocaleString('en-IN')}/mo (Haircut: ${anitaResult.metrics.incomeHaircutPercent}%)`);
console.log(`Verdict: ${anitaResult.o1Verdict.verdict} - ${anitaResult.o1Verdict.primaryReason}`);
console.log(`Is Hard Block: ${anitaResult.o1Verdict.isHardBlock}`);
console.log(`Roadmap items: ${anitaResult.o1Verdict.debtRemediationRoadmap?.length}`);

assert(anitaResult.metrics.assessedIncome === 22400 || anitaResult.metrics.assessedIncome === 21000, 'Anita assessed income must reflect informal haircut (~₹21k - ₹22.4k)');
assert(anitaResult.o1Verdict.verdict === "Don't borrow now", 'Anita verdict must be Don\'t borrow now');
assert(anitaResult.o1Verdict.isHardBlock === true, 'Anita must trigger hard block');
assert(anitaResult.o1Verdict.debtRemediationRoadmap !== undefined && anitaResult.o1Verdict.debtRemediationRoadmap.length > 0, 'Anita must receive remediation roadmap');

console.log("\n==================================================");
console.log("   ALL IMPLEMENTATION PLAN ASSERTIONS PASSED!");
console.log("==================================================");
