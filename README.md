# Lokta Borrower Copilot

**An independent, client-side retail credit self-assessment and branch negotiation companion for Indian borrowers.**

Built for the Lokta Take-Home Engineering Challenge.

---

## 1. Overview & Problem Statement

Retail lending in India is asymmetric: lenders possess advanced underwriting algorithms, risk-based pricing matrices, and legal loan-to-value limits, while retail borrowers often enter bank branches unaware of their true safe debt capacity or market pricing.

**Borrower Copilot** turns a borrower's income, obligations, and asset profile into **four defensible numbers and a bank-counter negotiation companion**:

1. **O1 — Verdict:** `Borrow`, `Borrow less`, or `Don't borrow now` (via a 7-node decision tree with 4 hard blocks and 3 soft cautions).
2. **O2 — Maximum Amount:** Lender-likely sanction vs true safe carry capacity side-by-side, with clear guidance on which to use and why they differ.
3. **O3 — Fair Interest Rate:** Nominal rate band anchored to the RBI policy repo rate (5.25%), plus all-in APR factoring in statutory processing fees and 18% GST.
4. **O4 — Safe EMI Ceiling:** Monthly debt service limit with a multi-tenure trade-off matrix and a combined worst-case stress test (-25% income shock AND +150 bps rate hike).
5. **Negotiation Card:** A single, branch-ready screen formatted for a borrower to hold at a bank counter, featuring an interactive quote comparison field and counter talk-tracks.

---

## 2. Core Architecture & Engineering Principles

### 2.1 Pure Domain Rules Engine (`lib/engine/`)
The underwriting engine lives entirely separate from the React presentation layer as pure TypeScript functions and plain data structures:
- `data/rules-config.ts`: Single source of truth for all numerical constants (repo rate, FOIR caps, LTVs, income multiples, spreads, stress shocks, fees).
- `lib/engine/schema.ts`: Type definitions for `BorrowerProfile` and derived metrics.
- `lib/engine/questions.ts`: 9 must-questions and 11 adaptive calibration questions with visibility predicates.
- `lib/engine/confidence.ts`: Countable question coverage ratio driving Wide (0-30%), Medium (30-70%), and Narrow (>70%) variance bands.
- `lib/engine/rules/segments.ts`: Segment income assessment (salaried net, blended ITR + cash with volatility haircut, informal flat haircut).
- `lib/engine/rules/foir.ts`: Baseline FOIR caps by income tier and risk adjustments (-5% score, -10% bounce, +5% collateral).
- `lib/engine/rules/amount.ts`: O2 lender sanction vs safe amount calculations.
- `lib/engine/rules/rate.ts`: Product rate spreads over repo rate + stability discounts + APR formula.
- `lib/engine/rules/emi.ts`: Reverse EMI formula, tenure comparison, and worst-case stress testing.
- `lib/engine/rules/decision.ts`: O1 decision tree evaluating hard blocks (H1-H4) and soft cautions (S1-S3).
- `lib/engine/card.ts`: Assembles the 8-item Negotiation Card.

### 2.2 Privacy & Client-Side Execution
- **Zero Backend / Zero API Routes:** All calculations execute locally in the browser runtime.
- **No Data Stored:** No database, no tracking cookies, and no `localStorage`.
- **Session Resilience:** Tab-scoped `sessionStorage` allows accidental refresh protection without indefinite client data persistence.

### 2.3 Next.js App Router Structure
```
app/
  layout.tsx              Root layout, fonts, BorrowerProvider context
  page.tsx                Landing page explaining the 4 outputs + Start button
  assess/
    page.tsx              Adaptive question wizard with dynamic confidence meter
  result/
    page.tsx              Outputs dashboard (O1 to O4) + Negotiation Card
lib/
  engine/                 Pure TypeScript rules engine (zero React dependencies)
components/
  wizard/                 QuestionStep, ProgressConfidenceBar
  results/                VerdictBanner, AmountComparisonCard, RateBandCard, EmiCeilingCard, StressToggle, NegotiationCard
  dev/                    PersonaQuickLoad (pre-fills Priya, Ravi, Anita for 1-click testing)
data/
  rules-config.ts         Single source of numeric constants
docs/
  RULES.md                Complete rules table matching rules-config.ts verbatim
  walkthroughs/
    priya.md              Full run-through for Priya (Salaried, Bengaluru)
    ravi.md               Full run-through for Ravi (Self-Employed, Mysuru)
    anita.md              Full run-through for Anita (Informal Gig, Hubballi)
```

---

## 3. Quick Start & Verification

### Prerequisites
- Node.js 18+ (tested on Node 20 / 22)
- npm or yarn

### Installation
```bash
npm install
```

### Running the Domain Engine Test Suite
Run the automated assertion suite validating all three canonical personas:
```bash
npm test
```
*Expected Result:*
```
==================================================
   BORROWER COPILOT DOMAIN ENGINE TEST SUITE
==================================================
[PASS] Priya verdict must be Borrow
[PASS] Priya assessed income must be full stated net ₹1,10,000
[PASS] Priya safe debt capacity must comfortably cover the ₹8L ask
[PASS] Lender sanction must exceed safe capacity
[PASS] APR must include processing fee and GST, exceeding nominal rate
[PASS] Priya rate must sit in prime band (~11.5% - 13%)
[PASS] Ravi assessed income must equal ₹38,000 after blending ITR/cash and 20% haircut
[PASS] Ravi verdict must be Borrow less individually against his ₹15L ask
[PASS] Ravi safe amount must land between ₹6.5L and ₹7.5L
[PASS] Ravi lender sanction must land around ₹10L on secured product
[PASS] Ravi commercial premises must qualify as strong collateral
[PASS] Co-applicant path must bridge household capacity toward ₹15L
[PASS] Anita assessed income must reflect informal haircut (~₹21k - ₹22.4k)
[PASS] Anita verdict must be Don't borrow now
[PASS] Anita must trigger hard block
[PASS] Anita must receive remediation roadmap
==================================================
   ALL IMPLEMENTATION PLAN ASSERTIONS PASSED!
==================================================
```

### Running Locally in Development
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build Validation
```bash
npm run build
```
Validates zero TypeScript errors, clean static chunk generation, and zero SSR hydration issues.

---

## 4. Persona Validation Summary

| Persona | Segment | Request | Assessed Income | Verdict | Key Underwriting Rationale |
|---|---|---|---|---|---|
| **Priya** | Salaried, Bengaluru | ₹8,00,000 PL | ₹1,10,000/mo (0% haircut) | **Borrow** | Ask sits safely within ₹10,72,000 safe capacity. Prime CIBIL (780) qualifies for 11.80% rate + 12.39% APR. Survives combined stress test. |
| **Ravi** | Self-Employed, Mysuru | ₹15,00,000 Fleet | ₹38,000/mo (blended ITR + cash, 20% haircut) | **Borrow less** | Individually supports ₹6,59,000 safe amount (~₹10L lender sanction). Commercial premises (₹45L) unlocks secured 11.35% LAP. Adding wife as co-applicant bridges household capacity to ₹15L+. |
| **Anita** | Informal Gig, Hubballi | ₹1,50,000 Scooter | ₹22,400/mo (20% net haircut with UPI) | **Don't borrow now** | Fails Hard Block H3 (100% of existing debt is in 30%+ instant apps) and H2 (recent bounce in last 30 days). Displays 4-step debt remediation roadmap. |

Detailed end-to-end trace logs for each persona are documented in [`docs/walkthroughs/`](./docs/walkthroughs/).

---

## 5. Submission Guarantees


- **Single Source of Truth:** Every constant in `RULES.md` matches `data/rules-config.ts` verbatim.
- **Explainability:** Every number on the results screen and Negotiation Card can be traced to a single underlying underwriting reason.
- **Phone-First Responsive Design:** Tested on 375px mobile viewport widths and desktop screens.
