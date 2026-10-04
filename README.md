# Bank of Industry (BOI) Impact Intelligence Portal
### Private AI Proof of Concept (POC)

An institutional-grade development-finance analytics web application and deterministic natural-language intelligence workspace built for the **Bank of Industry (BOI)**, Nigeria's premier development-finance institution.

The portal pairs boardroom-grade clarity and typography with 100% mathematically reconciled impact metrics across Nigeria's 36 States + FCT.

---

## 🏛️ Key Highlights

- **Boardroom-Grade Visual Identity**: Institutional white-and-green foundation (`#0B6B4F`, `#0B4738`), restrained BOI gold accent (`#C59A32`), disciplined typography (`Source Sans 3` and `Source Serif 4`), and clear analytical composition.
- **Two Principal Product Experiences**:
  1. **Impact Dashboard**: Headline KPIs, national balance sheet summary, interactive SVG state choropleth map, sortable territorial data table, geopolitical zone rankings, sector allocations, temporal trajectory (2023–2026), demographic inclusion profile, and prudential loan quality.
  2. **Ask BOI AI Analyst Workspace**: Natural-language conversational intelligence operating against the exact same filtered dataset context, generating structured findings, verified evidence matrices, and full data provenance disclosures with zero ungrounded hallucinations.
- **100% Mathematically Reconciled Synthetic POC Dataset**: Built from 800 deterministically generated facilities (`seed: boi-poc-2026`). Disbursed capital (₦630.99B), direct and indirect jobs (65,846), and inclusion metrics reconcile across all geographic and sectoral granularities with 0.00 variance.
- **Role-Aware Personas**: Dynamic perspective switcher for **Executive Management**, **Impact & Strategy**, and **Development Partners**.
- **Deep-Link Filter State**: Complete URL query persistence supporting bookmarks, sharing, and browser back/forward navigation.

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18.x or later
- npm or yarn

### Installation
```bash
# Clone or navigate to the repository
cd NEP-DARES

# Install dependencies
npm install
```

### Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Run Production Build
```bash
npm run build
npm run start
```

### Run the Mathematical Reconciliation Audit
To verify that all 8 reconciliation audit gates pass with 0.00 discrepancy:
```bash
npx tsx src/lib/data/reconciliation.ts
```

---

## 📊 Core Features & Product Structure

### 1. National Balance Sheet & Headline KPIs
- **Capital Disbursed**: ₦630.99B cumulative real-sector credit deployed.
- **Enterprises Financed**: 800 distinct enterprises spanning Nano, Micro, Small, Medium, and Large tiers.
- **Employment Multiplier**: 65,846 jobs sustained (~104.4 jobs per ₦1B deployed).
- **Inclusion Metrics**: ₦149.33B (23.7%) channeled to women-led enterprises; ₦125.13B (19.8%) to youth-led enterprises.
- **Asset Quality**: 94.7% performing loan portfolio ratio.

### 2. Sub-National Geographic Drill-Down
- **Interactive SVG Map**: State hub nodes with choropleth shading based on capital volume, hover details, and click-to-filter capability.
- **Territorial Data Grid**: Sortable, dense, accessible table of all 36 States + FCT displaying exact figures, jobs, and performing ratios.
- **Zone Ranking**: Ordered horizontal bar charts ranking Nigeria's 6 geopolitical zones.

### 3. Real-Sector Allocation & Trajectory
- **Priority Verticals**: 10 real sectors (Light Manufacturing, Agro-processing, Renewable Energy, Healthcare, etc.) with dynamic metric toggling (Capital, Enterprises, Jobs).
- **Portfolio Trajectory**: 2023–2026 timeline with quarterly/annual granularity switcher and crosshair tooltips.

### 4. Ask BOI AI Analyst Workspace
- Synchronized with active dashboard filters.
- Starter inquiries for rapid exploration.
- Detailed analysis with key finding banners.
- Calculated evidence blocks (tables, rankings, metric cards).
- Full source provenance disclosure (dataset identifier, verified record count, aggregation method, and synthetic disclaimer).

---

## 📁 Repository Structure

```
NEP-DARES/
├── docs/
│   ├── PRD.md                  # Product Requirements Document
│   ├── DATA_MODEL.md           # Schema, PRNG & Reconciliation Specification
│   └── PHASE_2_INTEGRATION.md  # Core Banking & Enterprise Integration Roadmap
├── src/
│   ├── app/
│   │   ├── globals.css         # Tabular numerals, base styles
│   │   ├── layout.tsx          # Font loading (Source Sans 3 & Source Serif 4), a11y skip link
│   │   └── page.tsx            # Main portal page coordinating state, filters & experiences
│   ├── components/
│   │   ├── assistant/
│   │   │   └── AskBOIAIWorkspace.tsx   # Structured natural-language analyst workspace
│   │   ├── common/
│   │   │   ├── BOIHeader.tsx           # Institutional header, persona switcher, POC badge
│   │   │   ├── BoiLogo.tsx             # SVG institutional emblem & logotype
│   │   │   ├── DataDisclaimer.tsx      # Provenance disclaimer & audit stamp
│   │   │   ├── EmptyState.tsx          # Zero-match filter recovery state
│   │   │   └── PrimaryTabs.tsx         # Dashboard / AI Assistant tabs
│   │   ├── dashboard/
│   │   │   ├── InclusionProfile.tsx    # Scale tier & demographic inclusion
│   │   │   ├── KpiSummary.tsx          # Asymmetric headline KPI composition
│   │   │   ├── NationalPortfolioSummary.tsx # Institutional balance sheet & persona brief
│   │   │   ├── PortfolioPerformance.tsx # Prudential risk & asset quality
│   │   │   ├── SectorAllocation.tsx    # Real-sector ranking with metric toggle
│   │   │   ├── StrategicThemeExplorer.tsx # 6 mandate pillars
│   │   │   ├── TrendChart.tsx          # 2023-2026 temporal trajectory
│   │   │   └── ZoneRanking.tsx         # 6 Geopolitical zones ranked comparison
│   │   ├── filters/
│   │   │   └── GlobalFilters.tsx       # Collapsible filter drawer & active chip bar
│   │   └── map/
│   │       └── NigeriaImpactMap.tsx    # Dual SVG map & sortable state data grid
│   ├── lib/
│   │   ├── analytics/
│   │   │   └── aggregation.ts          # Pure mathematical calculation & aggregation engine
│   │   ├── assistant/
│   │   │   └── assistant-provider.ts   # Deterministic analytical query processor
│   │   ├── data/
│   │   │   ├── geo-metadata.ts         # 36 states + FCT, coordinates & zone mappings
│   │   │   ├── prng.ts                 # Mulberry32 deterministic generator
│   │   │   ├── reconciliation.ts       # 8-gate automated mathematical audit script
│   │   │   ├── synthetic-generator.ts  # Seeded record generator
│   │   │   └── synthetic-records.ts    # 800 pre-computed facility records
│   │   └── utils/
│   │       └── formatters.ts           # Naira, number, delta & percentage formatters
│   └── types/
│       ├── dataset.ts                  # Domain models, enums & summary interfaces
│       └── declarations.d.ts           # Ambient CSS declarations
├── tailwind.config.ts                  # Institutional design tokens & typography
├── tsconfig.json                       # TypeScript configuration
└── package.json
```

---

## 🔒 Confidentiality & Synthetic Data Notice

This application is an illustrative Proof of Concept (POC). **No confidential BOI client information or actual proprietary facility accounts were ingested or requested.** All data points displayed within this demonstration are generated deterministically using seed `boi-poc-2026`.
