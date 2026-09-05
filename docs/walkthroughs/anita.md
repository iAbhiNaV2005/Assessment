# Borrower Copilot Persona Walkthrough: Anita

**Segment:** Informal Gig Delivery & Home Tailoring, Hubballi  
**Loan Purpose:** Personal Two-Wheeler (Scooter)  
**Amount Requested:** ₹45,000  

---

## 1. Profile Inputs & Adaptive Questions Answered

| Question | Value Provided | Category | Underwriting Impact |
|---|---|---|---|
| Loan Purpose | Personal Vehicle (Two-Wheeler) | Must | Evaluated as effectively unsecured for hard blocks |
| Amount Wanted | ₹45,000 | Must | Checked against existing debt load |
| Employment Type | Informal / Gig Worker (No ITR) | Must | Subject to flat documentation haircut |
| Declared Income Range | ₹25,000 to ₹31,000 (Midpoint ₹28,000) | Must | Evaluated for gig seasonality |
| UPI Footprint | Regular UPI QR transaction history | Additional | 5% haircut mitigation (20% net haircut) |
| Assessed Income | **₹22,400 / month** | Derived | `₹28,000 * (1 - 0.20) = ₹22,400` |
| Years in Trade | 3 Years | Must | Baseline stability |
| Existing Monthly EMIs | ₹9,500 across 3 Instant Lending Apps | Must | Consumes 42.4% of assessed monthly income |
| High-Cost Debt Flag | True (100% of existing debt is > 30% APR) | Additional | **Triggers Hard Block H3** |
| Debt Consolidation | Not Selected (New discretionary asset) | Must | Fails consolidation exception |
| Recent Payment Bounces | Yes, within the last 30 days | Additional | **Triggers Hard Block H2** |
| Essential Monthly Expenses | ₹14,000 | Must | Leaves zero surplus after ₹9,500 EMIs |
| Savings Buffer | 0.5 Months (Under 1 month reserves) | Additional | **Triggers Hard Block H4** |
| Collateral | Vehicle Hypothecation | Additional | Does not qualify as strong collateral |

**Confidence Level:** Narrow (+/- 5% variance band, high profile disclosure).

---

## 2. Calculated Outputs (O1 to O4)

### Output 1 — Verdict: Don't borrow now
- **Headline:** Don't borrow now — high default risk and active debt distress.
- **Primary Reason:** Existing debt service already breaches maximum lender capacity, and active high-cost app loans create compounding default risk.
- **Hard Block Triggers Fired:**
  1. **H1 & H3 (High-Cost Predatory Debt):** Existing EMIs (₹9,500) consume 42.4% of Anita's ₹22,400 assessed income. 100% of this debt is with high-cost 30%+ instant apps, and the requested loan is not structured to extinguish them.
  2. **H2 (Recent Payment Return):** A NACH debit or auto-mandate bounced within the last 30 days on an unbacked personal consumption loan. Vehicle hypothecation does not provide strong real estate recovery.
  3. **H4 (Zero Liquidity):** Living paycheck to paycheck with less than 1 month of savings buffer in volatile informal trades.
- **Is Hard Block:** **True.**
- **Recommended Action:** Refinance or clear predatory app loans and establish a 6-month clean repayment track record before acquiring new obligations.

### Output 2, 3, 4 — Responsible Withholding
Rather than encouraging fresh debt that would precipitate insolvency, Lokta suppresses "go-ahead" sanction figures and presents a concrete debt remediation roadmap:

---

## 3. Actionable Debt Remediation Roadmap

1. **Restructure High-Cost App Debt:** Refocus loan objectives immediately to "Debt Consolidation". Replace the 3 compounding 30%+ app loans with a single lower-cost credit line or community microfinance facility.
2. **Rebuild Clean Bank Mandate History:** Maintain zero cheque, auto-debit, or NACH returns for at least 6 consecutive payment cycles to repair bureau standing.
3. **Build 2-Month Living Reserve:** Build an emergency reserve of at least ₹15,000 to ₹25,000 in a dedicated recurring deposit so emergency repairs do not force distress app borrowing.
4. **Channel Digital Receipts:** Continue routing home tailoring and gig delivery customer payments through a commercial UPI QR code to build verified banking statements.

---

## 4. Negotiation Card (Remediation Variant)

1. **Loan Type & Status:** Personal Two-Wheeler · ₹45,000 requested · **Application Deferred**
2. **Fair Rate Warning:** Avoid fresh borrowings; existing debt exceeds 24% threshold.
3. **Primary Factor:** 100% of existing monthly obligations are held in high-cost instant credit lines with a recent auto-debit failure.
4. **Safe EMI Ceiling:** **₹0 / month fresh debt** until existing app loans are consolidated or cleared.
5. **Safe vs Lender Amount:** Safe fresh borrowing is ₹0. Existing debt must be restructured first.
6. **Lender Offer Comparison:** If an NBFC offers an instant approval at 28%+ with high processing deductions, **do not sign**.
7. **Counter Talk-Track:** "I am currently consolidating my existing obligations. Can this loan be disbursed as a direct balance transfer to close my three high-cost app accounts with an NOC, rather than a top-up?"
8. **Confidence Note:** Calculated with 14 of 14 applicable fields answered (100% profile coverage).
