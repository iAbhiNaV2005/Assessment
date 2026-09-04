# Credit Underwriting & Assessment Rules Engine (RULES.md)

This document details every rule, threshold, band, and assumption used by **Borrower Copilot** to evaluate borrowing viability, safe debt capacity, fair risk pricing, all-in APR, and repayment sustainability for Indian retail borrowers.

---

## 1. Fixed Obligation to Income Ratio (FOIR) & Capacity Rules

| Rule ID | What (Rule / Parameter) | Value / Threshold | Why (Underwriting Rationale) | Source / Judgement |
| :--- | :--- | :--- | :--- | :--- |
| `R-FOIR-SAL-01` | FOIR Cap: High-Income Salaried (> ₹1,00,000 net/mo) | **55%** of Net Monthly Take-Home | High-income earners have substantial discretionary surpluses; non-debt living costs do not scale linearly with income, allowing up to 55% debt servicing without risking basic household sustenance. | Industry benchmark: HDFC Bank, ICICI Bank & SBI Prime Salary Lending Norms |
| `R-FOIR-SAL-02` | FOIR Cap: Mid-Income Salaried (₹40,000 to ₹1,00,000 net/mo) | **50%** of Net Monthly Take-Home | Ensures at least 50% of take-home pay remains unencumbered for family sustenance, rent, child education, and emergency healthcare. | Standard Retail Credit Policy (SBI Xpress Credit Manual) |
| `R-FOIR-SAL-03` | FOIR Cap: Entry Salaried (< ₹40,000 net/mo) | **40%** of Net Monthly Take-Home | Lower-income households face higher vulnerability to inflation shocks (food and fuel), requiring a tighter debt ceiling to prevent default. | Consumer Protection Fair Lending Norms |
| `R-FOIR-SELF-01` | FOIR on Documented Income for Self-Employed | **45%** of Net Monthly Taxable Profit (`ITR Annual / 12`) | Lenders underwrite formal self-employed capacity against verified income tax returns (ITR Computation of Total Income) to filter unverified claims. | Bajaj Finserv & Kotak Mahindra Bank MSME Underwriting Manual |
| `R-FOIR-SELF-CASH` | Haircut on Undocumented Cash Inflows | **45% haircut** (only 55% of cash profits counted) | Cash earnings in informal commerce (e.g. kirana retail) fluctuate heavily with seasonal inventory cycles and cannot be verified via automated banking NACH mandates. | Surrogate Underwriting Norms (Shriram Finance / Cholamandalam) |
| `R-FOIR-INF-01` | FOIR Cap: Informal / Gig Earners (< ₹35,000 net/mo) | **35% strictly capped** | Gig workers (delivery riders, home tailoring) lack employer safety nets, medical insurance, or paid leaves. Exceeding 35% debt servicing almost always triggers default during rainy seasons or vehicle downtime. | RBI Master Direction: Regulatory Framework for Microfinance Loans (April 2022) |
| `R-SAFE-CARRY-01` | Safe Carry Capacity Formula | `Net Disposable Surplus = Net Income - (Living Expenses + Rent + Existing EMIs + 15% Emergency Buffer)` | Lenders calculate maximum extraction based on gross or net income; the borrower must calculate what they can pay without sacrificing groceries, school fees, or rent. | Financial Planning Standards Board (FPSB) India & Core Product Principles |
| `R-BUFFER-EMERG` | Minimum Emergency Buffer Deduction | **15% of living costs** (min ₹2,500/mo) | Prevents borrower from committing 100% of liquid monthly surplus to debt, which leaves zero cushion for unexpected medical or vehicle repairs. | Actuarial Best Practice |

---

## 2. Collateral & Loan-to-Value (LTV) Rules

| Rule ID | What (Rule / Parameter) | Value / Threshold | Why (Underwriting Rationale) | Source / Judgement |
| :--- | :--- | :--- | :--- | :--- |
| `R-LTV-LAP-COMM` | Loan-to-Value (LTV) Cap on Commercial Property (e.g. Kirana Shop) | **50% - 60%** of Fair Market Value (FMV) | Commercial real estate carries higher liquidity haircuts during SARFAESI auctions than self-occupied residential property. | RBI Housing & Commercial Real Estate Prudential Norms |
| `R-LTV-LAP-RES` | LTV Cap on Residential Property | **65% - 75%** of FMV | Residential property has higher secondary market liquidity and stronger emotional attachment, leading to lower historical default rates. | National Housing Bank (NHB) Directions |
| `R-LTV-TWO-WHEEL` | LTV Cap on Electric Two-Wheeler Asset Financing | **80% - 85%** of On-Road Price | Requires a 15% - 20% borrower margin equity to avoid immediate negative equity given fast battery and technology depreciation. | Hero Fincorp & Bajaj Auto Finance EV Policy |
| `R-TITLE-VINTAGE` | Property Vintage & Encumbrance Requirement | Minimum **12+ years** clear chain of title; unencumbered | Ensures non-disputed legal ownership to qualify for mortgage registration (MODT - Memorandum of Deposit of Title Deeds). | Transfer of Property Act & State Registration Norms |

---

## 3. Product Routing & Substitution Rules

| Rule ID | What (Rule / Parameter) | Value / Threshold | Why (Underwriting Rationale) | Source / Judgement |
| :--- | :--- | :--- | :--- | :--- |
| `R-ROUTING-RAVI` | Mortgage Substitution for Self-Employed with Low ITR | Route to **Loan Against Property (LAP)** @ 9.25% - 11.0% instead of Unsecured Personal Loan @ 22%+ | A ₹15 Lakh unsecured loan on a ₹4.2 Lakh ITR will be rejected or priced at predatory rates. Pledging an unencumbered ₹45 Lakh shop slashes the interest rate by 1,000+ bps and extends tenure up to 10-15 years. | Commercial Credit Judgement (Mortgage Arbitrage) |
| `R-ROUTING-EV` | Asset Hypothecation Routing for Gig Riders | Route to **Hypothecated EV Loan** with green subsidy instead of Personal Loan | Backed by the electric two-wheeler asset with legal charge; qualifies for lower rates than personal loans and state EV subsidies (e.g. PM e-Drive). | SIDBI EV Financing Guidelines |
| `R-CONSOLIDATION-MFI` | Microfinance / SHG Debt Consolidation | Transfer multi-app payday loans to **MFI Term Loan** @ 18% - 22% reducing | Regulated MFIs are capped by RBI regulations and provide human loan officers and structured weekly/monthly schedules, replacing extortionate app debt. | RBI Fair Practices Code for NBFC-MFIs |

---

## 4. Risk Pricing & Interest Rate Benchmark Rules

| Rule ID | What (Rule / Parameter) | Value / Threshold | Why (Underwriting Rationale) | Source / Judgement |
| :--- | :--- | :--- | :--- | :--- |
| `R-PRICING-CIBIL-750` | Prime Salaried Personal Loan Benchmark (CIBIL 750+) | **10.50% - 11.75%** p.a. (Reducing Balance) | Borrowers with 750+ CIBIL and Tier-1 MNC employment have < 0.8% 90-DPD historical default rates; eligible for competitive Tier-1 bank prime salary relationship grids. | SBI Xpress Credit / HDFC Bank Prime Pricing Grids (2024) |
| `R-PRICING-CIBIL-700` | Near-Prime Personal Loan Benchmark (CIBIL 700 - 749) | **12.00% - 13.50%** p.a. (Reducing Balance) | Moderate bureau record with occasional minor delays; standard mid-tier bank pricing. | Bank of Baroda / Axis Bank Retail Pricing Schedule |
| `R-PRICING-LAP-COMM` | Commercial Property Mortgage Benchmark (LAP) | **9.25% - 11.00%** p.a. (Repo-Linked EBLR) | Fully secured against immovable real estate with low LTV (<40%), qualifying for sovereign-grade repo-linked external benchmark lending rates. | RBI External Benchmark Lending Rate (EBLR) Guidelines |
| `R-PRICING-NTC` | New-to-Credit (NTC / Score Unknown) Band | **13.00% - 17.50%** (Unsecured) / **9.50% - 11.50%** (Secured) | Absence of credit history forces banks to rely on surrogate banking checks, widening the benchmark band. Secured assets tighten the band immediately. | TransUnion CIBIL Retail Lending Pulse |
| `R-PRICING-SUBPRIME` | Subprime / Delinquent Profile (CIBIL < 650 or Bounces) | **20.00% - 28.00%** (NBFC High Risk) | High historical probability of default requires substantial risk premium loading. | NBFC Risk-Based Pricing Master Directions |

---

## 5. Processing Fees, Charges & All-In APR Rules

| Rule ID | What (Rule / Parameter) | Value / Threshold | Why (Underwriting Rationale) | Source / Judgement |
| :--- | :--- | :--- | :--- | :--- |
| `R-APR-CALC-01` | True All-In APR Formula (Internal Rate of Return) | $\text{Net Disbursed} = \sum_{t=1}^n \frac{\text{EMI}_t}{(1 + \text{APR}_{monthly})^t}$ | Lenders conceal the true cost of borrowing by advertising headline interest rates while deducting 2%+ processing fees, documentation charges, and 18% GST upfront from disbursed proceeds. | RBI Circular on Key Fact Statement (KFS) for Retail Loans (April 2024) |
| `R-FEE-CAP-SAL` | Fair Processing Fee Ceiling (Salaried Personal Loans) | **1.00% - 1.50%** of principal + 18% GST (capped at ₹10,000) | Administrative processing costs for digitized salaried underwriting are under ₹1,500 per file; anything above 1.5% is excessive intermediary margin. | Consumer Lending Best Practice |
| `R-FEE-CAP-LAP` | Fair Processing Fee Ceiling (Secured LAP) | **0.50% - 1.00%** of principal + legal/valuation at actuals | High ticket size (₹15L+) compensates lenders; percentage fees must scale down. | Indian Banks' Association (IBA) Fair Practice Code |
| `R-FORECLOSURE-01` | Prepayment & Foreclosure Penalty Prohibition | **0% penalty** on floating rate retail loans | Lenders are legally prohibited from penalizing individual borrowers who repay floating-rate retail term loans early using their own funds. | RBI Master Circular on Prepayment Charges (2014 & 2019 Updates) |

---

## 6. Debt Distress & Verdict Decision Tree Rules

| Rule ID | What (Rule / Parameter) | Value / Threshold | Why (Underwriting Rationale) | Source / Judgement |
| :--- | :--- | :--- | :--- | :--- |
| `R-DISTRESS-ANITA` | Multi-App Predatory Debt Spiral Trigger | Trigger **`DONT_BORROW`** if: $\ge 3$ App Loans, APR $\ge 30\%$, and $\ge 1$ EMI bounce | Borrowing fresh high-cost unsecured funds while already juggling multiple digital lending apps with bounces guarantees an insolvency trap; priority must be consolidation. | RBI Digital Lending Guidelines & Insolvency Early Warning Signals |
| `R-VERDICT-DEFICIT` | Negative Disposable Surplus Trigger | Trigger **`DONT_BORROW`** if: `True Disposable Surplus <= ₹2,000` | Servicing any new loan would force the borrower to cut back on food, shelter, or healthcare. | Lokta Core Principle: "Do No Financial Harm" |
| `R-VERDICT-LESS` | Over-Leveraged Borrowing Request | Trigger **`BORROW_LESS`** if: `Amount Wanted > Safe Carry Capacity` | Protects borrower from stretching beyond their monthly cash flow comfort zone, even if the bank's automated model is willing to sanction more. | Underwriting Prudence |
| `R-VERDICT-SAFE` | Prime Borrowing Sanction | Trigger **`BORROW`** if: `Amount Wanted <= Safe Carry Capacity` and `FOIR <= Cap` | Borrower has proven surplus, verified income, and adequate buffers to service debt with high confidence. | Standard Responsible Lending |

---

## 7. Stress Testing & Macro Shock Rules

| Rule ID | What (Rule / Parameter) | Value / Threshold | Why (Underwriting Rationale) | Source / Judgement |
| :--- | :--- | :--- | :--- | :--- |
| `R-STRESS-INCOME` | Income Contraction Stress Simulation | **20% drop in net income** (25% for self-employed seasonal retail) | Simulates real-world shocks: job restructuring, delayed business receivables, health emergencies, or platform gig algorithm changes. | Basel III Retail Portfolio Stress Testing Guidelines |
| `R-STRESS-RATE` | Interest Rate Shock Simulation | **+200 bps (+2.0%) rate hike** | Simulates an RBI repo rate tightening cycle over a multi-year repayment horizon for floating rate credit. | RBI Financial Stability Report Macro Scenarios |
| `R-STRESS-SOLVENCY`| Post-Shock Solvency Test | `Stressed Income - Stressed Outflows > 0` and `Stressed FOIR <= 55%` | Determines whether the borrower survives a worst-case scenario without defaulting on bank commitments. | Prudential Underwriting Standard |

---

## 8. Explainability & Confidence Rules

| Rule ID | What (Rule / Parameter) | Value / Threshold | Why (Underwriting Rationale) | Source / Judgement |
| :--- | :--- | :--- | :--- | :--- |
| `R-CONFIDENCE-SILENCE` | Confidence Widens with Silence | Base = 60%; +15% for CIBIL; +10% for ITR; +15% for Collateral; +10% for Debt history | If critical fields are unverified (e.g. unknown credit score), the engine widens the interest rate band and flags lower confidence rather than hallucinating artificial precision. | Assignment Rule: "Confidence widens with silence; unknown is never zero." |
| `R-EXPLAINABILITY-01` | One-Sentence Rule Transparency | Every limit, rate, and ceiling must provide a plain-language explanation | Borrowers must know *why* a number is ₹22,000 and not ₹30,000 so they can negotiate with confidence. | Lokta Core Mandate |
