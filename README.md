# Borrower Copilot

> **Lokta Build Challenge · Take-Home Assessment**  
> A borrower-first personal credit copilot that answers four critical questions before entering a bank branch:  
> **Should I borrow at all? How much am I really eligible for? What is a fair rate for me? What EMI should I agree to?**  
> Complete with a one-page **Branch Negotiation Card** to push back on unfair terms.

---

## Quick Start (Runs Locally in Under 2 Minutes)

This application requires **Node.js (v18+)** and has **zero backend dependencies** (100% client-side computation).

```bash
# 1. Install dependencies
npm install

# 2. Run automated test suite (Validates Priya, Ravi, & Anita logic)
npm test

# 3. Start local development server
npm run dev
```

Open your browser at `http://localhost:3000/`.

---

## Deliverables Index

All four required deliverables are documented and accessible in this repository:

1. **The Working Application**: Interactive Next.js 15 (App Router) + TypeScript + Tailwind CSS application with Apple-inspired Liquid Glass aesthetics and responsive mobile/desktop layouts.
2. **[RULES.md](file:///d:/Projects/Assessment/RULES.md)**: Exhaustive underwriting rulebook cataloging every rule, threshold, band, and assumption: *What · Value · Why · Source / Judgement*.
3. **[RUN_THROUGHS.md](file:///d:/Projects/Assessment/RUN_THROUGHS.md)**: Full run-throughs for **Priya**, **Ravi**, and **Anita**, including questions asked, the 4 core outputs, and their Branch Negotiation Cards.
4. **[WALKTHROUGH.md](file:///d:/Projects/Assessment/WALKTHROUGH.md)**: 5-minute technical and product walkthrough covering domain architecture, live rule defense, roadmap, and what we would cut.

---

## The Four Core Outputs

| Output | What It Is | How Borrower Copilot Solves It |
| :--- | :--- | :--- |
| **O1: The Verdict** | `BORROW` / `BORROW_LESS` / `DONT_BORROW` | Actionable recommendation with explicit financial justification. `DONT_BORROW` triggers on debt distress (e.g. multi-app loans, recent bounces) or deficit cash flow. |
| **O2: Maximum Capacity** | Lender Sanction vs Safe Carry | Separates what a **lender will sanction** under automated FOIR norms from what the **borrower can safely carry** after living costs, rent, and emergency buffers. Explicitly advises which number to use. |
| **O3: Fair Rate & APR** | Risk-based Rate Band + RBI APR | Benchmark reducing balance interest rate band + true all-in APR (including processing fees, legal charges, and 18% GST). Smart product routing (e.g. routing low-ITR property owners to LAP at 9.5% instead of 22% unsecured). |
| **O4: Safe EMI & Stress** | Monthly EMI Ceiling & Shock Test | Maximum safe monthly outflow with interactive tenure trade-offs (12 to 84 months) and a downside stress case (20% income reduction + 200 bps interest rate hike). |

---

## The Three Benchmark Personas

The application features 1-click test buttons to load and evaluate the three official personas:

1. **Priya, 29 (Bengaluru · Salaried)**:
   - *Profile*: MNC Software Engineer, Net ₹1,10,000/mo, 780 CIBIL, ₹14k car loan, rents at ₹28k. Wants ₹8,00,000 for a wedding.
   - *Verdict*: **`BORROW`** (Safe). Bank will sanction up to ₹17.95L, but safe carry is ₹15.15L; advises capping at ₹8L ask. Fair rate: **10.50% - 11.75%** (APR: 11.32% - 13.21%).
2. **Ravi, 42 (Mysuru · Self-Employed)**:
   - *Profile*: Kirana store 14 yrs, cash profit ₹40k-80k/mo, ITR declared ₹4,20,000/yr, unencumbered ₹45,00,000 commercial shop, wife earns ₹18k teaching. Wants ₹15,00,000 for inventory and delivery vehicle.
   - *Verdict*: **`BORROW` via LAP**. Unsecured personal loan is rejected or priced at 22%+ due to low ITR; routed to **Loan Against Property (LAP)** against shop at **9.25% - 11.00%** over 7-10 years.
3. **Anita, 35 (Hubballi · Informal)**:
   - *Profile*: Delivery rider & tailor, ₹26k-30k/mo, 2 children, husband unemployed, 3 predatory app loans (₹35k @ 30%+), 1 EMI bounce last month. Wants ₹1,50,000 for an EV scooter.
   - *Verdict*: **`DONT_BORROW`**. High debt distress risk. Fresh borrowing will trigger a debt spiral. Recommends MFI debt consolidation and subsidized green mobility / PM e-Drive asset leasing.

---

## Architecture & Engineering Design

```
src/
├── app/                     # NEXT.JS 15 APP ROUTER
│   ├── layout.tsx           # Root layout, Google Fonts (Newsreader, Source Sans, Plex Mono)
│   ├── page.tsx             # Main page entry point
│   └── globals.css          # Tailwind CSS + Apple-grade Liquid Glass utility styles
│
├── domain/                  # PURE TYPESCRIPT LOGIC (Zero Framework/DOM dependencies)
│   ├── types.ts             # Domain data models & strict interfaces
│   ├── rulesData.ts         # Master registry of 18+ credit rules
│   ├── affordability.ts     # FOIR ceilings, NDI, and safe carry math
│   ├── sanction.ts          # Bank underwriting limits vs safe carry separation
│   ├── pricing.ts           # Risk pricing bands & monotonic APR bisection solver
│   ├── verdict.ts           # Decision tree (Borrow / Less / Don't)
│   ├── stressTest.ts        # 20% income contraction & +200 bps rate shock
│   ├── engine.ts            # Orchestrator & confidence calculator
│   └── presets.ts           # Official test profiles (Priya, Ravi, Anita)
│
├── components/              # CLIENT UI LAYER (Liquid Glass Aesthetics)
│   ├── LiquidGlass.tsx      # Frosted glass approximation with highlight borders
│   ├── Header.tsx           # Brand header, theme toggle, rules drawer trigger
│   ├── PersonaSelector.tsx  # 1-click test benchmark cards
│   ├── AdaptiveForm.tsx     # Tier 1 (Must) & Tier 2 (Adaptive) questionnaire
│   ├── OutputsDashboard.tsx # The 4 Core Output cards with stress toggles
│   ├── NegotiationCard.tsx  # Printable one-page branch negotiation card
│   └── RulesInspectorModal.tsx # Live rules inspector drawer
│
└── test/
    └── runTests.ts          # Automated assertion suite
```

### Key Engineering Highlights:
- **Clean Separation of Concerns**: All credit rules reside in `src/domain/` as pure TypeScript functions, completely independent of the UI layer. Any rule can be modified live during technical interviews in under 10 seconds.
- **Monotonic Numerical APR Solver**: Uses an unconditionally stable bisection algorithm to calculate the true internal rate of return (IRR) per RBI Key Fact Statement (KFS) norms.
- **Confidence Widens with Silence**: The app starts with a base confidence score (60%) on must-questions, dynamically narrowing the benchmark rate band as verified signals (CIBIL, ITR, Collateral) are provided.
- **Design Craft**: Built with modern typography (`Newsreader` serif + `Source Sans 3` + `IBM Plex Mono` tabular numerals), locked theme colors, responsive layout, and Apple-grade Liquid Glass accents (`backdrop-filter`, edge highlights, radial refractions).

---

## Testing & Verification

Run the automated test runner:

```bash
npm test
```

Expected output:
```
==================================================
   BORROWER COPILOT DOMAIN ENGINE TEST SUITE
==================================================

--- Testing Persona 1: Priya (Salaried MNC, Bengaluru) ---
Verdict: BORROW - Safe to Borrow with Excellent Negotiating Power
Lender Sanction: ₹17.95L | Safe Carry: ₹15.15L
Recommended Product: Personal Loan (Unsecured) @ 10.5% - 11.75% (APR: 11.32% - 13.21%)
Safe EMI Ceiling: ₹39250/mo
[PASS] Priya verdict must be BORROW
[PASS] Priya lender sanction must exceed safe carry
[PASS] Priya advised to use safe carry
[PASS] Priya prime CIBIL rate must be <= 11.0%
[PASS] All-in APR must honestly include fees and exceed nominal rate

--- Testing Persona 2: Ravi (Kirana Owner, Mysuru) ---
Verdict: BORROW - Safe to Borrow (Exclusively via Secured LAP / MSME)
Product Routed: Loan Against Property (LAP / Mortgage)
Rate Band: 9.25% - 11%
Routing Rationale: Routing to LAP: Pledging unencumbered commercial premises slashes interest rates by ~1,000 bps...
[PASS] Ravi must be routed to LAP secured mortgage
[PASS] LAP rate must be prime repo-linked (< 10.0%)
[PASS] Collateral backing must support ₹15L sanction
[PASS] Ravi verdict must be BORROW via LAP

--- Testing Persona 3: Anita (Informal Gig & Tailor, Hubballi) ---
Verdict: DONT_BORROW - Do Not Take Fresh Unsecured Loans
Reason: Your immediate financial priority must be stopping the bleed from high-cost app debt (30%+ APR)...
Flags: Predatory Debt Spiral Detected
[PASS] Anita verdict must be DONT_BORROW due to predatory debt spiral
[PASS] Anita must trigger predatory debt spiral flag
[PASS] Anita recommended fresh borrowing must be 0 until consolidation
```

---

## Regulatory Standards Referenced
- **RBI Master Direction on Regulatory Framework for Microfinance Loans (2022)**
- **RBI Master Direction on Digital Lending Guidelines (2022)**
- **RBI Circular on Key Fact Statement (KFS) for Retail & MSME Loans (April 2024)**
- **RBI Master Circular on Prepayment Charges on Floating Rate Loans**
- **TransUnion CIBIL Retail Lending Pulse & Risk Scoring Bands**
