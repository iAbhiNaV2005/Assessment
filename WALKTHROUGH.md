# Borrower Copilot: Technical & Product Walkthrough

**Take-Home Challenge Submission for Lokta**  
*Stack: Next.js 15 (App Router), TypeScript, Tailwind CSS, Client-Side Pure Domain Rules Engine*

---

## 1. Executive Summary: What We Built and Why

Retail lending in India is asymmetric: lenders possess advanced underwriting algorithms, risk-based pricing matrices, and legal loan-to-value limits, while retail borrowers often enter bank branches unaware of their true safe debt capacity or market pricing.

**Borrower Copilot** rebalances this power dynamic. It is a client-side self-assessment engine that answers four core questions before a borrower signs any loan agreement:
1. **O1: Should I borrow at all?** (`Borrow` / `Borrow less` / `Don't borrow now`) via a deterministic decision tree.
2. **O2: Maximum amount?** Clearly separating what a **lender will sanction** from what the **borrower can safely carry**.
3. **O3: Fair interest rate band?** Providing a risk-adjusted reducing benchmark anchored to the RBI repo rate (5.25%) and true all-in APR.
4. **O4: Safe monthly EMI ceiling?** Providing tenure trade-offs and a -25% income & +150 bps rate shock stress simulation.
5. **The Branch Negotiation Card:** A single, high-impact screen that the borrower can hold up to a branch manager or loan agent to push back on elevated rates.

---

## 2. Architecture & Domain Separation

The application is structured to ensure that **domain rules are completely decoupled from UI rendering**. This directly satisfies the recruiter evaluation requirement: *"In the follow-up we will ask you to change a rule live."*

```
app/
  layout.tsx              Root layout, typography, BorrowerProvider context
  page.tsx                Landing page explaining the 4 outputs + Start button
  assess/
    page.tsx              Adaptive question wizard with dynamic confidence meter
  result/
    page.tsx              Outputs dashboard (O1 to O4) + Negotiation Card

lib/
  engine/                 100% PURE TYPESCRIPT LOGIC (Zero React/DOM dependencies)
    schema.ts             BorrowerProfile shape, derived metrics, and outputs
    questions.ts          9 must-questions and 11 adaptive calibration questions
    confidence.ts         Countable question ratio driving wide, medium, narrow bands
    rules/
      segments.ts         Assessed income formulas by segment with volatility haircuts
      foir.ts             FOIR caps table and risk adjustments
      amount.ts           O2 lender sanction vs safe amount calculations
      rate.ts             O3 rate bands over repo + stability discounts + APR
      emi.ts              O4 reverse EMI formula, tenure matrix, and stress test
      decision.ts         O1 hard-block (H1-H4) and soft-caution (S1-S3) checks
    card.ts               Assembles the 8-item Negotiation Card

components/
  wizard/                 QuestionStep, ProgressConfidenceBar
  results/                VerdictBanner, AmountComparisonCard, RateBandCard, EmiCeilingCard, StressToggle, NegotiationCard
  dev/                    PersonaQuickLoad (pre-fills Priya, Ravi, Anita for 1-click testing)

data/
  rules-config.ts         Single source of numeric constants (repo rate, FOIR caps, LTVs, spreads)

docs/
  RULES.md                Complete rules table matching rules-config.ts verbatim
  walkthroughs/           Priya, Ravi, and Anita worked examples
```

---

## 3. How the Engine Solves the Three Benchmark Personas

| Dimension | Priya (Salaried, Bengaluru) | Ravi (Self-Employed, Mysuru) | Anita (Informal Gig, Hubballi) |
| :--- | :--- | :--- | :--- |
| **Profile Archetype** | Prime Salaried, 790 CIBIL, ₹1.10L/mo, ₹14k car loan, 5 yrs vintage | Self-employed, ₹4.2L ITR + ₹60k/mo cash, ₹45L shop premises, unscored | Informal gig rider & tailor, ₹25k-₹31k/mo, 3 app loans @ 30%+, recent bounce |
| **Loan Ask** | ₹8,00,000 (Wedding) | ₹15,00,000 (Commercial Vehicle Fleet) | ₹45,000 (Two-Wheeler Scooter) |
| **O1 Verdict** | **`Borrow`** (Comfortable safe capacity) | **`Borrow less`** (Sizing correction individually) | **`Don't borrow now`** (Active debt distress) |
| **O2 Sanction vs Safe Carry** | Safe capacity is **₹10,72,000**; Lender sanction is **₹14,04,000**. Recommendation: Use ₹8,00,000 ask. | Individual safe is **₹6,59,000**; Individual lender sanction is **₹9,88,000**. Co-applicant spouse bridges to **₹17,16,000** (covers ₹15L). | Instant apps sanction ₹65k at 36%. Safe fresh borrowing is **₹0 fresh debt** until existing app loans are cleared. |
| **O3 Product & Fair Rate** | Personal Loan Prime @ **11.25% - 14.25%** (Target: 11.80%, APR: 12.39%) | Routed to Secured Business / LAP @ **10.25% - 14.25%** (Target: 11.35%, APR: 11.60%) | High-cost warning (existing loans >24% threshold). Fresh debt deferred. |
| **O4 Safe EMI Ceiling** | **₹35,503 / mo** (EMI for ₹8L ask is ₹26,500/mo; post-loan FOIR 36.8%) | **₹11,400 / mo** (at 7 years tenure on individual safe capacity). | **₹0 / mo** fresh debt. Existing EMIs consume 42.4% of income. |
| **Key Negotiation Script** | "790 CIBIL + 5 yrs MNC tenure = prime relationship grid; match 11.8% and cap fee at 1.0%." | "Pledging ₹45L commercial shop at <35% LTV; applying jointly with spouse to cover ₹15L at secured 11.35% LAP pricing." | "Refinance ₹35k app debt via microfinance at 18%-22% reducing; maintain 6 months clean repayment." |

---

## 4. Live Rule Defense & How to Modify Rules Live

During technical evaluation, when asked to change an assumption live:
1. **The Single Source of Truth**: Open `data/rules-config.ts`.
2. **Change Repo Rate**: Change `REPO_RATE: 5.25` to `REPO_RATE: 5.50`. All product rate bands and APR calculations immediately shift across the app.
3. **Change FOIR Ceiling**: Change `FOIR_CAPS.salaried.over75k.lenderCap: 0.55` to `0.50`. All maximum amounts recompute instantly on the next render.
4. **Change Stress Test Shocks**: Change `STRESS_TEST.incomeShockPercent: -0.25` to `-0.30`.
5. Run `npm test` in the terminal to verify the automated test suite against the updated rules.

---

## 5. What We Would Build Next (Product Roadmap)

1. **Account Aggregator (AA) Integration via Sahamati API**:
   - Allow borrowers to securely share 6 months of bank statements with zero document upload.
   - Automatically parse salary credits, average monthly balances (AMB), and existing NACH mandates to auto-populate net disposable income in under 15 seconds.
2. **Sanction Letter & KFS OCR Scanner**:
   - Let borrowers photograph or upload a PDF sanction letter received from a bank.
   - The engine automatically parses hidden flat rates, bundled insurance, and processing fees, outputting an instant "True Cost Audit" comparing the bank's quote to Borrower Copilot benchmarks.
3. **Multi-Lingual Vernacular Prompts**:
   - For informal borrowers like Anita and semi-formal shopkeepers like Ravi, localized prompts in Kannada, Hindi, Tamil, and Telugu remove English literacy barriers.

---

## 6. What We Would Cut (Ruthless Product Discipline)

1. **Cut Black-Box Machine Learning Models**:
   - Machine learning algorithms are non-deterministic, hard to explain in branches, and prone to socio-economic bias. Pure deterministic rules with documented tables build unshakeable borrower confidence.
2. **Cut User Accounts & Central Databases**:
   - Storing user PAN, bureau data, or payslips creates regulatory liability under the Digital Personal Data Protection Act (DPDPA 2023). Running 100% client-side in the borrower's browser guarantees complete data privacy by design.
