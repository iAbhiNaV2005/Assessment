export interface RuleRegistryEntry {
  id: string;
  category: 'FOIR' | 'LTV' | 'PRICING' | 'ROUTING' | 'DISTRESS' | 'APR' | 'STRESS';
  what: string;
  value: string;
  why: string;
  source: string;
}

export const MASTER_RULES_REGISTRY: RuleRegistryEntry[] = [
  {
    id: 'R-FOIR-SAL-01',
    category: 'FOIR',
    what: 'FOIR Ceiling for High-Income Salaried (> ₹1,00,000/mo)',
    value: '50% - 55% of Net Monthly Income',
    why: 'High-income earners have substantial discretionary buffers, allowing debt service up to 55% without risking basic sustenance.',
    source: 'RBI Master Direction on Retail Lending & HDFC/ICICI Underwriting Grids',
  },
  {
    id: 'R-FOIR-SAL-02',
    category: 'FOIR',
    what: 'FOIR Ceiling for Mid-Income Salaried (₹40,000 - ₹1,00,000/mo)',
    value: '45% - 50% of Net Monthly Income',
    why: 'Guarantees at least 50% of take-home pay remains available for family living costs, education, and unexpected emergencies.',
    source: 'SBI Personal Loan Underwriting Policy',
  },
  {
    id: 'R-FOIR-SELF-01',
    category: 'FOIR',
    what: 'FOIR on Documented ITR for Self-Employed',
    value: '45% of Taxable Monthly Net Profit (ITR / 12)',
    why: 'Lenders evaluate formal repayment capacity strictly against declared tax returns to curb tax evasion risk.',
    source: 'Bajaj Finserv / Kotak Mahindra MSME Credit Manual',
  },
  {
    id: 'R-FOIR-SELF-CASH',
    category: 'FOIR',
    what: 'Haircut on Undocumented Cash Inflows for Self-Employed',
    value: '40% - 50% Haircut applied to unbanked cash receipts',
    why: 'Cash earnings fluctuate heavily with seasonal demand and cannot be legally garnished or tracked through NACH mandate.',
    source: 'Shriram Finance / Chola MSME Surrogate Underwriting Norms',
  },
  {
    id: 'R-FOIR-INF-01',
    category: 'FOIR',
    what: 'FOIR Ceiling for Informal / Gig Earners (< ₹35,000/mo)',
    value: '35% Max FOIR (strictly capped)',
    why: 'Informal workers lack social safety nets, paid leaves, or health insurance; volatile cash flow makes >35% debt fatal.',
    source: 'RBI Master Direction – Regulatory Framework for Microfinance Loans (2022)',
  },
  {
    id: 'R-SAFE-CARRY-01',
    category: 'FOIR',
    what: 'Safe Carry Capacity Formula',
    value: 'Net Disposable Surplus = Net Income - (Living Expenses + Rent + Existing EMIs + 15% Emergency Buffer)',
    why: 'Lenders calculate what they can legally extract; the borrower must calculate what they can pay without forfeiting groceries or rent.',
    source: 'Financial Planning Standards Board (FPSB) India & Lokta Core Principles',
  },
  {
    id: 'R-LTV-LAP-01',
    category: 'LTV',
    what: 'Loan-to-Value (LTV) Cap on Unencumbered Commercial Property',
    value: '50% - 60% of Fair Market Valuation',
    why: 'Commercial premises have higher liquidation haircuts than self-occupied residential property during SARFAESI recovery.',
    source: 'RBI Housing & Commercial Real Estate Prudential Norms',
  },
  {
    id: 'R-LTV-TWO-WHEEL',
    category: 'LTV',
    what: 'LTV Cap on Electric Two-Wheeler Asset Financing',
    value: '80% - 85% on On-Road Price',
    why: 'Requires 15-20% borrower margin money to prevent immediate negative equity given fast battery depreciation.',
    source: 'Hero Fincorp / Bajaj Auto Finance EV Policy',
  },
  {
    id: 'R-ROUTING-RAVI',
    category: 'ROUTING',
    what: 'Asset-Backed Product Substitution for Self-Employed with Low ITR',
    value: 'Route to Loan Against Property (LAP) @ 9.5% - 11.25% instead of Unsecured Personal Loan @ 22%+',
    why: '₹15L unsecured is impossible on ₹4.2L ITR; pledging ₹45L unencumbered shop slashes rate by 1,200 bps and extends tenure to 10-15 years.',
    source: 'Prudent Banking Underwriting & Mortgage Substitution Rule',
  },
  {
    id: 'R-DISTRESS-ANITA',
    category: 'DISTRESS',
    what: 'High-Cost Debt Multi-App Distress Trigger',
    value: 'Trigger "DONT_BORROW / CONSOLIDATE" if >= 3 App Loans, Rate >= 30%, and >= 1 Bounce',
    why: 'Adding fresh debt while juggling predatory app loans leads to debt spiral; priority must be consolidation or debt settlement.',
    source: 'RBI Digital Lending Guidelines (2022) & Insolvency Pre-bankruptcy Indicators',
  },
  {
    id: 'R-PRICING-CIBIL-750',
    category: 'PRICING',
    what: 'Personal Loan Rate Band for Prime Salaried (CIBIL 750+)',
    value: '10.50% - 11.75% Reducing Balance Rate',
    why: 'Prime Tier-1 salaried employees exhibit < 0.8% 90-DPD historical delinquency; eligible for competitive Tier-1 bank pricing.',
    source: 'SBI Xpress Credit / HDFC Bank Prime Salary Relationship Grid',
  },
  {
    id: 'R-PRICING-NTC',
    category: 'PRICING',
    what: 'New-to-Credit (NTC / No CIBIL) Benchmark Band',
    value: '13.00% - 17.50% Unsecured / 9.50% - 11.50% Secured',
    why: 'Absence of repayment history requires lenders to rely on banking surrogates or asset collateral, widening the pricing spread.',
    source: 'TransUnion CIBIL 2024 Retail Lending Pulse',
  },
  {
    id: 'R-APR-CALC-01',
    category: 'APR',
    what: 'All-In True Annual Percentage Rate (APR) Formula',
    value: 'Internal Rate of Return (IRR) equating Net Disbursed = ∑ [EMI_t / (1 + APR)^t]',
    why: 'Lenders disguise true cost by quoting headline rate while deducting 2% fee + 18% GST + insurance upfront from disbursement.',
    source: 'RBI Mandate on Key Fact Statement (KFS) for All Retail Loans (April 2024)',
  },
  {
    id: 'R-FEE-CAP-01',
    category: 'PRICING',
    what: 'Standard Processing Fee Benchmark',
    value: '1.0% - 1.75% of Loan Amount (capped at ₹10,000 for standard PL) + 18% GST',
    why: 'Any processing fee above 2% represents predatory margin padding by NBFC intermediaries.',
    source: 'Consumer Lending Fair Practice Code',
  },
  {
    id: 'R-STRESS-SHOCK-01',
    category: 'STRESS',
    what: 'Downside Stress Test: 20% Income Contraction',
    value: 'Income reduced to 80% with non-discretionary expenses fixed',
    why: 'Tests whether borrower survives unexpected pay cut, job loss, illness, or seasonal sales dip without defaulting on EMI.',
    source: 'Basel III Retail Portfolio Stress Testing Standard',
  },
  {
    id: 'R-PRODUCTIVE-ASSET',
    category: 'ROUTING',
    what: 'Productive Asset Uplift Factor',
    value: 'Include 50% of conservatively projected incremental income in post-disbursement cash flow',
    why: 'Loans that generate revenue (e.g. delivery EV, shop inventory) pay for themselves if unit economics are verified.',
    source: 'SIDBI Micro-Enterprise Assessment Methodology',
  },
];
