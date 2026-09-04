# Borrower Copilot: 5-Minute Technical & Product Walkthrough

**Take-Home Challenge Submission for Lokta**  
*Author: Engineering Candidate · Assessment Build*

---

## 1. Executive Summary: What We Built and Why

Lenders in India evaluate retail borrowers using proprietary risk scorecards, automated bureau pulls (CIBIL/Experian), and sales playbooks optimized to maximize net interest margins (NIM) and upfront fee income. Borrowers, conversely, walk into branches blind: they accept the first sanction letter offered, only to discover years later that they paid 300 - 500 bps above market rates, stretched past 55% FOIR, and swallowed concealed insurance deductions.

**Borrower Copilot** rebalances this power dynamic. It is a client-side self-assessment engine that answers four core questions before a borrower signs any loan agreement:
1. **O1: Should I borrow at all?** (`BORROW` / `BORROW_LESS` / `DONT_BORROW`) with clear mathematical rationale.
2. **O2: Maximum amount?** Clearly separating what a **lender will sanction** from what the **borrower can safely carry**.
3. **O3: Fair interest rate band?** Providing a risk-adjusted reducing benchmark and true RBI-compliant all-in APR.
4. **O4: Safe monthly EMI ceiling?** Providing tenure trade-offs and a downside macro stress simulation.
5. **The Branch Negotiation Card:** A single, high-impact screen that the borrower can hold up to a branch manager or loan agent to push back on extortionate rates.

---

## 2. Architecture & Domain Separation

The application is structured to ensure that **domain rules are completely decoupled from UI rendering**. This directly satisfies the recruiter evaluation requirement: *"In the follow-up we will ask you to change a rule live."*

```
src/
├── app/                     # NEXT.JS 15 APP ROUTER
│   ├── layout.tsx           # Root layout, Google Fonts (Newsreader, Source Sans, Plex Mono)
│   ├── page.tsx             # Main page entry point
│   └── globals.css          # Tailwind CSS + Apple-grade Liquid Glass utility styles
│
├── domain/                  # 100% PURE TYPESCRIPT LOGIC (Zero Framework/DOM dependencies)
│   ├── types.ts             # Strict domain schemas (Profile, Outputs, Rules)
│   ├── rulesData.ts         # Master registry of 18+ credit underwriting rules
│   ├── affordability.ts     # FOIR ceilings, NDI, and safe carry math
│   ├── sanction.ts          # Bank underwriting limits vs safe carry separation
│   ├── pricing.ts           # Risk spreads, product routing, and monotonic APR solver
│   ├── verdict.ts           # 3-way decision tree (Borrow / Less / Don't)
│   ├── stressTest.ts        # 20% income contraction & +200 bps rate shock
│   ├── engine.ts            # Orchestrator & confidence calculator
│   └── presets.ts           # Verified test profiles (Priya, Ravi, Anita)
│
├── components/              # CLIENT UI LAYER (Liquid Glass Aesthetics)
│   ├── LiquidGlass.tsx      # Apple-inspired frosted glass approximation
│   ├── Header.tsx           # Brand header, theme toggle, rules inspector trigger
│   ├── PersonaSelector.tsx  # 1-click test benchmark cards
│   ├── AdaptiveForm.tsx     # Tier 1 (Must) & Tier 2 (Adaptive) questionnaire
│   ├── OutputsDashboard.tsx # The 4 Core Output cards with stress toggles
│   ├── NegotiationCard.tsx  # Printable one-page branch negotiation sheet
│   └── RulesInspectorModal.tsx # Live rules inspector drawer
│
└── test/
    └── runTests.ts          # Automated assertion suite validating all 3 personas
```

---

## 3. How the Engine Solves the Three Benchmark Personas

| Dimension | Priya (Salaried MNC, 29) | Ravi (Kirana Owner, 42) | Anita (Informal Gig, 35) |
| :--- | :--- | :--- | :--- |
| **Profile Archetype** | Prime Salaried, 780 CIBIL, ₹1.10L/mo, ₹14k car loan, rents ₹28k | Self-employed, ₹40k-80k cash, ITR ₹4.2L/yr, unencumbered ₹45L shop, No CIBIL | Informal gig rider & tailor, ₹26k-30k/mo, 3 app loans @ 30%+, 1 bounce |
| **Loan Ask** | ₹8,00,000 (Wedding) | ₹15,00,000 (Stock & Delivery Van) | ₹1,50,000 (Electric Delivery Scooter) |
| **O1 Verdict** | **`BORROW`** (Prime negotiating power) | **`BORROW`** (Exclusively via Secured LAP) | **`DONT_BORROW`** (Debt spiral risk) |
| **O2 Sanction vs Safe Carry** | Bank sanctions **₹17.95L**; Safe carry is **₹15.15L**. Recommended: Use Safe Carry, cap at ₹8L ask. | Unsecured bank sanction is only **₹4.40L** (rejected). Secured LAP sanction is **₹24.75L**. Recommended: ₹15L LAP. | Instant apps sanction **₹65k** at 36% flat. Safe carry is **₹0 fresh debt** until app loans cleared. |
| **O3 Product Routing & Rate** | Personal Loan @ **10.50% - 11.75%** (APR: 11.32% - 13.21%) | Routed to LAP @ **9.25% - 11.00%** (Saving 1,000+ bps vs unsecured credit) | Commercial EV Asset Loan @ **13.50% - 16.50%** (with PM e-Drive subsidy) |
| **O4 Safe EMI Ceiling** | **₹39,250 / mo** (36-mo EMI is ₹26,005; FOIR 36%) | **₹52,700 / mo** (84-mo LAP EMI is ₹25,480; FOIR 28%) | **₹1,200 / mo** (Cannot service fresh ₹5,200 EMI without default) |
| **Key Negotiation Script** | "780 CIBIL + MNC salary = Tier-1 prime grid; cap fee at 1.0% and waive login charges." | "Pledging ₹45L shop at <35% LTV = zero bank risk; quote 9.5% repo-linked EBLR, not unsecured." | "Consolidate ₹35k app debt via MFI at 18%-22%; apply for subsidized EV asset lease." |

---

## 4. Live Rule Defense & How to Modify Rules Live

During technical evaluation, when asked to change an assumption live:
1. **Change FOIR Ceiling**: Open `src/domain/affordability.ts` → `getFoirCeiling()`. Adjust salaried cap from `55%` to `50%`. The app updates immediately via Vite HMR.
2. **Change Benchmark Rates**: Open `src/domain/pricing.ts` → `determinePricingAndRouting()`. Adjust repo spread from `10.5%` to `9.9%`.
3. **Change Distress Triggers**: Open `src/domain/verdict.ts` → `determineVerdict()`. Adjust app loan count threshold from `3` to `2`.
4. Run `npm test` in the terminal to verify the automated test suite against the updated rules.

---

## 5. What We Would Build Next (Product Roadmap)

1. **Account Aggregator (AA) Integration via Sahamati API**:
   - Allow borrowers to securely share 6 months of bank statements with zero document upload.
   - Automatically parse salary credits, average monthly balances (AMB), and existing NACH mandates to auto-populate net disposable income in under 15 seconds.
2. **Sanction Letter & KFS OCR Scanner**:
   - Let borrowers photograph or upload a PDF sanction letter received from a bank.
   - The engine automatically parses hidden flat rates, bundled insurance, and processing fees, outputting an instant "True Cost Audit" comparing the bank's quote to Borrower Copilot benchmarks.
3. **Multi-Lingual Vernacular Audio Prompts**:
   - For informal borrowers like Anita and semi-formal shopkeepers like Ravi, localized voice prompts in Kannada, Hindi, Tamil, and Marathi ensure financial literacy without English reading barriers.
4. **Bank Branch Geo-Benchmarking**:
   - Aggregate verified branch pricing from public PSU and private banks within the borrower's pin code (e.g. SBI Mysuru Main vs Canara Bank vs HDFC) to provide exact branch coordinates where fair rates are currently being sanctioned.

---

## 6. What We Would Cut (Ruthless Product Discipline)

1. **Cut Black-Box Machine Learning Models**:
   - Machine learning algorithms are non-deterministic, hard to explain in branches, and prone to socio-economic bias.
   - For credit negotiation, borrowers need **deterministic, auditable rules** where every number can be justified in a single sentence to a bank manager.
2. **Cut User Accounts & Login Walls**:
   - Requiring mobile OTP, phone numbers, or passwords introduces high drop-off and privacy concerns.
   - Retail borrowers are paranoid about data theft and spam calls from DSA agents; keeping the tool 100% anonymous and client-side builds unassailable trust.
3. **Cut Niche, Low-Volume Credit Products**:
   - Do not bloat the engine with education loans, luxury yacht loans, or credit card balance transfers. Focus deeply on the four high-frequency retail products: Personal Loans, LAP/MSME Mortgages, Vehicle/EV loans, and Gold loans.
