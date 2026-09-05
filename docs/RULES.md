# Credit Underwriting & Assessment Rules Engine (RULES.md)

This document is the human-readable rendering of `data/rules-config.ts`, which serves as the single source of truth for every threshold, cap, multiplier, and calculation used by the pure domain rules engine in `lib/engine/`.

Every rule and assumption is explicitly categorized with its underlying underwriting rationale and its provenance (regulatory source vs author's credit judgement).

---

## Complete Rules & Constants Table

| What | Value | Why | Source |
|---|---|---|---|
| Repo rate anchor | 5.25% | Base external benchmark anchor for all product rate bands | RBI MPC, held steady through 2026 |
| Salaried FOIR, lender cap, income under ₹30,000 | 40% | Entry salaried earners face higher inflation vulnerability; higher debt allocations risk basic food and rent default | My judgement |
| Salaried FOIR, safe cap, income under ₹30,000 | 30% | Ten-point buffer below lender cap ensuring sufficient unencumbered cashflow | My judgement |
| Salaried FOIR, lender cap, income ₹30,000 to ₹75,000 | 50% | Moderate discretionary surplus allows servicing up to half of take-home pay | My judgement |
| Salaried FOIR, safe cap, income ₹30,000 to ₹75,000 | 40% | Leaves 60% of earnings for household living costs, rent, utilities, and emergency buffer | My judgement |
| Salaried FOIR, lender cap, income over ₹75,000 | 55% | Upper bound for well-paid salaried borrowers with high non-linear discretionary savings | My judgement |
| Salaried FOIR, safe cap, income over ₹75,000 | 45% | Ten-point safety buffer so borrower does not live at the financial edge | My judgement |
| Self-employed formal FOIR, lender cap | 45% | Accommodates business revenue volatility while ensuring debt service coverage | My judgement |
| Self-employed formal FOIR, safe cap | 35% | Protects working capital from excessive personal leverage | My judgement |
| Informal / gig FOIR, lender cap | 35% | Daily contract and gig earnings have high seasonality and zero employer safety nets | RBI MFI Guidelines |
| Informal / gig FOIR, safe cap | 25% | Preserves 75% of income for living essentials during seasonal platform downtime | My judgement |
| FOIR adjustment: score < 650 or unscored | -5% from both caps | Reflects elevated historical default probability and unrated surrogate risk | My judgement |
| FOIR adjustment: bounce in last 6 months | -10% from safe cap only | Push toward caution or block; lender pricing already accounts for this via rate | My judgement |
| FOIR adjustment: collateral pledged | +5% to lender cap only | Reduces lender loss given default, but does not increase monthly borrower cashflow | My judgement |
| Vehicle hypothecation collateral status | Not strong collateral | High resale depreciation and recovery friction; evaluated as unsecured for hard blocks | My judgement |
| Real estate, gold, FD collateral status | Strong collateral | Verifiable tangible assets with enforceable security under SARFAESI or physical possession | SARFAESI Act & RBI Norms |
| Salaried income haircut | 0% flat | Payslip and direct bank credit trail are verifiable and highly reliable | My judgement |
| Self-employed formal income assessment | Average of (ITR / 12, cash midpoint) with variable haircut | ITR alone under-states cash commerce; self-declared cash is unverifiable. Blending balances both | My judgement |
| Self-employed variable haircut (< 20% variable) | 0% haircut | Highly stable business cashflows | My judgement |
| Self-employed variable haircut (20% - 40% variable) | 10% haircut | Discounts moderate incentive or seasonal variability | My judgement |
| Self-employed variable haircut (> 40% variable) | 20% haircut | High reliance on volatile turnover discounts baseline capacity | My judgement |
| Informal / gig income haircut | 25% flat | Unverifiable cash earnings require flat haircut for seasonality and downtime | My judgement |
| Informal digital footprint relief | 5% haircut relief (net 20%) | Regular UPI QR transaction volume provides surrogate banking trail | My judgement |
| LTV ceiling: secured, no prior formal loan history | 50% of asset value | Conservative loan-to-value ceiling for unestablished commercial credit records | My judgement |
| LTV ceiling: secured, with prior formal loan history | 60% of asset value | Higher liquidity advance for established credit vintage | My judgement |
| LTV ceiling: gold loan | 75% of gold market value | Regulatory statutory ceiling for physical gold advances | RBI Master Directions |
| Income multiple: Salaried Prime (750+) | Up to 24x net monthly income | Prime credit record allows maximal unsecured multiple | Industry Benchmark |
| Income multiple: Salaried Near-Prime (650-749) | Up to 15x net monthly income | Standard unsecured bank multiple | Industry Benchmark |
| Income multiple: Salaried Subprime (< 650) / Unscored | Up to 8x net monthly income | Restrictive multiple to prevent over-leveraging | My judgement |
| Income multiple: Formal Self-Employed | Up to 10x assessed monthly income | Standard unsecured NBFC business multiple | My judgement |
| Income multiple: Informal | Up to 6x assessed monthly income | Tight cap for undocumented cashflow streams | My judgement |
| Income multiple on secured loans | No multiple ceiling | LTV and FOIR are the true governors; stacking unsecured multiple under-states sanction | My judgement |
| Safe residual income minimum unspent share | 15% of assessed income | Living expenses + existing debt + new EMI must leave at least 15% unspent buffer | My judgement |
| Home loan spread over repo | +2.00% to +3.25% (7.25% - 8.50%) | Sovereign-grade mortgage spread on residential property | RBI EBLR Norms |
| Loan against property spread over repo | +3.75% to +5.75% (9.00% - 11.00%) | Commercial/residential mortgage with liquidity margin | Retail Lending Pulse |
| Gold loan spread over repo | +4.00% to +8.00% (9.25% - 13.25%) | Physical collateralized advance with low origination cost | RBI Lending Grids |
| Business loan, secured spread over repo | +5.00% to +9.00% (10.25% - 14.25%) | Working capital and commercial fleet funding | MSME Benchmark |
| Two-wheeler loan spread over repo | +5.50% to +9.50% (10.75% - 14.75%) | Asset hypothecation with vehicle depreciation loading | Two-Wheeler NBFCs |
| Personal loan, unsecured, prime spread | +6.00% to +9.00% (11.25% - 14.25%) | Tier-1 salaried prime unsecured bank rates | Prime Bank Grids |
| Personal loan, unsecured, subprime spread | +9.25% to +16.00% (14.50% - 21.25%) | Risk-adjusted NBFC pricing for elevated credit risk | NBFC Fair Practice |
| High-cost threshold | >= 24.0% p.a. | Predatory or instant app borrowing threshold; flagged as avoid | Consumer Protection |
| Rate stability discount | 0.10% per year over 3 years | Rewards demonstrated job or business vintage | My judgement |
| Max rate stability discount | 0.50% (50 bps) total | Caps vintage discount to maintain lender margin | My judgement |
| Processing fee baseline | 1.50% of loan amount | Average digitized retail processing charge | Industry Average |
| GST on processing fee | 18.0% | Statutory goods and services tax | Government of India |
| Effective fee percentage | 1.77% of loan amount | 1.50% * 1.18 upfront fee burden | Statutory Calculation |
| All-in APR approximation formula | `APR = nominal + (fee/P) * (12/tenureMonths) * 100` | Annualized effective cost approximation per RBI KFS guidance | RBI KFS Circular (April 2024) |
| Stress test: income shock | -25% | Simulates job loss, delayed receivables, or medical hiatus | My judgement |
| Stress test: rate shock | +150 bps (+1.50%) | Models 1 to 2 monetary policy rate transmission cycles | My judgement |
| Hard block H1 | Current FOIR > lender cap | Existing obligations already breach maximum capacity | Underwriting Prudence |
| Hard block H2 | Bounce in last 3m AND unsecured non-productive | Active repayment distress on non-asset-backed loan | Early Warning Indicator |
| Hard block H3 | > 30% existing debt is high-cost (>24%) and not consolidating | Refinancing priority; taking new debt compounds default | Debt Spiral Prevention |
| Hard block H4 | Zero savings AND informal AND unsecured non-productive | Zero liquidity buffer combined with volatile cash earnings | Solvency Risk Rule |
| Soft caution S1 | Requested amount > safe amount | Sizing correction; advise capping at safe capacity | Underwriting Prudence |
| Soft caution S2 | Post-loan FOIR in 55% to 65% | Elevated debt burden reduces emergency resilience | Household Safety Buffer |
| Soft caution S3 | Productive purpose but return unverified | Unverified revenue accretion on capital expenditure | MSME Underwriting |
| Confidence: Wide band threshold | 0% to 30% additional questions | +/- 22% variance around midpoint | My judgement |
| Confidence: Medium band threshold | 30% to 70% additional questions | +/- 10% variance around midpoint | My judgement |
| Confidence: Narrow band threshold | Over 70% additional questions | +/- 5% variance around midpoint | My judgement |
