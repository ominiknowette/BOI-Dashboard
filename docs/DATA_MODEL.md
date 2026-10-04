# Data Model & Reconciliation Specification
## Bank of Industry (BOI) Impact Intelligence Portal — Proof of Concept

---

### 1. Architectural Philosophy & POC Boundary

In accordance with institutional governance standards, **no real Bank of Industry customer, facility, or proprietary balance sheet records were accessed, requested, or ingested**.

To achieve a production-grade demonstration without synthetic data inconsistencies, the application implements a deterministic synthetic data generation engine. The dataset satisfies a fundamental DFI requirement:

> **The Zero-Discrepancy Principle:** Headline totals, sub-national geographic totals, sector allocations, enterprise tier summaries, and conversational AI answers are calculated dynamically from individual facility records and must reconcile with 0.00 variance across all rollups.

---

### 2. Entity Schema: `FacilityRecord`

Every record in the synthetic dataset represents an approved and disbursed credit facility granted to an enterprise operating within Nigeria.

```typescript
export interface FacilityRecord {
  facilityId: string;              // Deterministic UUID / code (e.g. "BOI-FAC-2024-0042")
  enterpriseName: string;          // Synthesised enterprise trade name
  programme: string;               // Lending intervention (e.g. "Federal MSME Survival Fund", "Green Energy Fund")
  fund: string;                    // Funding envelope (e.g. "BOI Balance Sheet", "CBN Real Sector Intervention")
  sector: Sector;                  // 1 of 10 priority industrial verticals
  strategicTheme: StrategicTheme;  // 1 of 6 mandate pillars
  enterpriseSegment: EnterpriseSegment; // Scale tier (Nano to Large Enterprise)
  state: string;                   // 1 of 36 States + FCT
  geopoliticalZone: GeopoliticalZone; // 1 of 6 Geopolitical Zones
  amountApproved: number;          // Approved facility limit in Naira (NGN)
  amountDisbursed: number;         // Disbursed capital in Naira (NGN)
  outstandingAmount: number;       // Current principal outstanding in Naira (NGN)
  jobsSupported: number;           // Verified direct & indirect employment created/sustained
  womenLed: boolean;               // Female majority ownership / executive control
  youthLed: boolean;               // Founder / CEO under 35 years of age
  approvalDate: string;            // ISO 8601 Date (YYYY-MM-DD)
  disbursementDate: string;        // ISO 8601 Date (YYYY-MM-DD)
  year: number;                    // Facility calendar year (2023, 2024, 2025, 2026)
  quarter: string;                 // Calendar quarter (e.g. "2024-Q2")
  portfolioStatus: PortfolioStatus;// Prudential classification ("Performing", "Watchlist", "Substandard", "Doubtful")
  repaymentStatus: RepaymentStatus;// Amortization status ("Current", "Grace Period", "Restructured", "Overdue")
  originatingUnit: string;         // Originating division (e.g. "Commercial & MSME Directorate")
  developmentPartner: string;      // Co-financier (e.g. "African Development Bank", "BOI Direct")
}
```

---

### 3. Enumerated Value Domains

#### Geopolitical Zones (6)
- `North Central` (7 territories: Benue, FCT, Kogi, Kwara, Nasarawa, Niger, Plateau)
- `North East` (6 states: Adamawa, Bauchi, Borno, Gombe, Taraba, Yobe)
- `North West` (7 states: Jigawa, Kaduna, Kano, Katsina, Kebbi, Sokoto, Zamfara)
- `South East` (5 states: Abia, Anambra, Ebonyi, Enugu, Imo)
- `South South` (6 states: Akwa Ibom, Bayelsa, Cross River, Delta, Edo, Rivers)
- `South West` (6 states: Ekiti, Lagos, Ogun, Ondo, Osun, Oyo)

#### Real Sectors (10)
1. `Light Manufacturing`
2. `Agro-processing`
3. `Renewable Energy & Off-Grid`
4. `Healthcare & Pharmaceuticals`
5. `Creative Industries & Media`
6. `Technology & Digital Services`
7. `Solid Minerals & Mining Services`
8. `Logistics & Cold Chain Storage`
9. `Textiles & Garment Manufacturing`
10. `Automotive & Engineering Assembly`

#### Enterprise Scale Tiers (5)
| Segment | Typical Facility Range (NGN) | Employment Profile | Portfolio Role |
| :--- | :--- | :--- | :--- |
| **Nano** | ₦250,000 – ₦1,500,000 | 1 – 3 jobs | High inclusion, micro-multiplier |
| **Micro** | ₦2,000,000 – ₦10,000,000 | 4 – 15 jobs | Informal transition, widespread spread |
| **Small** | ₦15,000,000 – ₦100,000,000 | 15 – 50 jobs | Backbone of commercial MSME economy |
| **Medium** | ₦120,000,000 – ₦500,000,000 | 50 – 150 jobs | High value addition, regional supply chain |
| **Large Enterprise** | ₦600,000,000 – ₦5,000,000,000 | 150 – 600 jobs | Industrial anchors, capital intensive |

#### Strategic Themes (6)
1. `MSMEs`
2. `Gender Inclusion`
3. `Youth & Skills`
4. `Digital Economy`
5. `Infrastructure Development`
6. `Climate & Sustainability`

#### Prudential Loan Asset Classes (4)
- **Performing**: Current on debt service covenants; 0–29 days past due.
- **Watchlist**: Performing with emerging sector or liquidity friction; 30–89 days past due.
- **Substandard**: 90–179 days past due; debt service compromised, requires monitoring.
- **Doubtful**: 180+ days past due; full repayment questionable without collateral execution.

---

### 4. Deterministic PRNG Implementation

To guarantee identical results across client-side hydrations, server-side builds, and analytical Q&A evaluations, the dataset generator uses the **Mulberry32** pseudo-random number generator algorithm initialized with the constant seed `boi-poc-2026`:

```typescript
export class Mulberry32PRNG {
  private state: number;

  constructor(seedString: string) {
    let h = 0x811c9dc5;
    for (let i = 0; i < seedString.length; i++) {
      h ^= seedString.charCodeAt(i);
      h = Math.imul(h, 0x01000193);
    }
    this.state = h >>> 0;
  }

  next(): number {
    let t = (this.state += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }
}
```

---

### 5. Mathematical Reconciliation Verification

The dataset generator was validated using the automated programmatic test harness located at `src/lib/data/reconciliation.ts`. All 8 institutional audit gates passed with **0.00 discrepancy**:

```
========================================================================
           BANK OF INDUSTRY (BOI) IMPACT PORTAL POC
              MATHEMATICAL RECONCILIATION AUDIT REPORT
========================================================================
Total Synthetic Records: 800
Deterministic Seed: "boi-poc-2026"

[1] National Portfolio Disbursed:
    ₦630,994,309,266.00
    - Zonal sum matches National total:      PASS (Diff: 0.00)
    - State sum matches National total:      PASS (Diff: 0.00)
    - Sector sum matches National total:     PASS (Diff: 0.00)
    - Segment sum matches National total:    PASS (Diff: 0.00)
    - Theme sum matches National total:      PASS (Diff: 0.00)

[2] Employment Outcomes:
    65,846 Direct & Indirect Jobs
    - Zonal jobs match National total:       PASS (Diff: 0)
    - State jobs match National total:       PASS (Diff: 0)
    - Sector jobs match National total:      PASS (Diff: 0)
    - Segment jobs match National total:     PASS (Diff: 0)

[3] Demographic Inclusion:
    - Women-Led Count: 345 facilities (₦149,332,654,124.00, 23.67%)
    - Youth-Led Count: 376 facilities (₦125,130,498,321.00, 19.83%)
    - Inclusion totals reconcile with details: PASS

[4] Prudential Asset Quality:
    - Performing Ratio: 94.70%
    - At-Risk Ratio:    5.30%
    - Performing + At-Risk = 100.00%:         PASS

OVERALL AUDIT RESULT: 8/8 CHECKS PASSED (100% RECONCILED)
========================================================================
```
