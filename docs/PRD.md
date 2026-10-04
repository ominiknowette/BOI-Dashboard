# Product Requirements Document (PRD)
## Bank of Industry (BOI) Impact Intelligence Portal — Private AI Proof of Concept

---

### 1. Executive Summary & Context

The **Bank of Industry (BOI) Impact Intelligence Portal** is a boardroom-grade analytical web application and natural-language intelligence workspace designed to evaluate, visualize, and query the developmental outcomes of BOI developmental credit deployment across Nigeria.

Operating under a strict **Private Proof-of-Concept (POC)** boundary, this system evaluates 800 deterministically generated, fully reconciled facility records spanning 2023 to 2026. The application demonstrates how modern development-finance institutions (DFIs) can unify portfolio performance monitoring, sub-national geographic inclusion, employment multiplier assessment, and conversational intelligence into a cohesive, institutional-grade decision platform.

---

### 2. Primary Product Objectives

1. **Boardroom-Grade Decision Support**: Deliver immediate clarity on capital deployment (₦630.99B cumulative disbursed), direct and indirect employment (65,846 jobs supported), and capital preservation (94.7% performing ratio).
2. **Sub-National & Real-Sector Equity**: Enable granular geographic exploration across all 6 Geopolitical Zones and 37 Nigerian territories (36 States + FCT), alongside real-sector allocation across 10 vital industrial verticals.
3. **Inclusive Finance Transparency**: Monitor targeted demographic inclusion metrics, specifically women-led enterprise financing (₦149.33B, 23.7%) and youth-led enterprise financing (₦125.13B, 19.8%).
4. **Deterministic Conversational Intelligence (Ask BOI AI)**: Replace generic, ungrounded chatbots with a role-aware analytical assistant that answers natural-language questions through calculated aggregations, verifiable evidence matrices, and transparent data provenance.
5. **Institutional Visual Identity**: Maintain strict alignment with development-finance design principles: institutional white-and-green palette (`#0B6B4F`, `#0B4738`), restrained BOI gold (`#C59A32`), disciplined typography (`Source Sans 3` and `Source Serif 4`), and clear analytical composition.

---

### 3. User Personas & Tailored Workflows

| Persona | Primary Needs & Tasks | Specific View Adaptations |
| :--- | :--- | :--- |
| **Executive Management**<br>*(MD/CEO, Executive Directors)* | Macro capital allocation, credit quality, portfolio risk exposure, return on developmental investment. | Highlighted capital deployment totals, performing loan ratios (94.7%), principal recovery rates, and executive briefing notes. |
| **Impact & Strategy Team**<br>*(Chief Economist, M&E Officers)* | Employment multipliers (jobs per ₦1B deployed), demographic equity, enterprise tier transitions (Nano to Medium). | Prominent job creation intensity metrics, women-led and youth-led participation shares, and thematic mandate alignment. |
| **Development Partners**<br>*(AfDB, World Bank, AFD, IFC)* | Catalytic additionality, geographic reach into underserved corridors, compliance with co-financing covenants. | State-by-state geographic penetration, thematic pillar tracking (Climate, Digital, Infrastructure), and audited synthetic provenance. |

---

### 4. Functional Capabilities & Product Structure

The portal is organised into two seamless, mutually synchronized product experiences operating over the same active filter scope:

#### Experience 1: Impact Dashboard

1. **Institutional Header & Persona Switcher**:
   - Institutional Bank of Industry emblem and logotype.
   - Live persona toggle: Executive Management, Impact & Strategy, Development Partner.
   - Prominent, non-intrusive "Synthetic POC Data" compliance indicator.

2. **Unified Filter Engine (`GlobalFilters`)**:
   - Multi-dimensional filtering: Year (2023–2026), Geopolitical Zone (6 zones), State (37 territories), Sector (10 sectors), Enterprise Segment (Nano to Large), Strategic Theme (6 pillars), Portfolio Status, Women-Led, and Youth-Led.
   - Active filter chip row with individual dismissal.
   - Full URL parameter synchronization for persistent sharing, bookmarks, and browser navigation.
   - Instant "Reset All Filters" control.

3. **National Development-Finance Summary Band**:
   - Comprehensive balance sheet overview: Total Disbursed, Principal Outstanding, Average Facility Size, Direct & Indirect Jobs, Employment Intensity (jobs/₦1B), and YoY Growth Rate.
   - Role-specific contextual commentary reflecting the active persona.

4. **Headline KPI Matrix (`KpiSummary`)**:
   - Asymmetric composition featuring 2 dominant metrics (Total Amount Disbursed, Enterprises Financed) and 4 supporting metrics (Jobs Supported, Women-Led Capital, Youth-Led Capital, Performing Portfolio Ratio).
   - Formatted with tabular numerals (`tabular-nums font-mono`) and prior-period baseline deltas.

5. **Sub-National Geographic Drill-Down (`NigeriaImpactMap` & `ZoneRanking`)**:
   - Dual-mode interactive visualization:
     - **Interactive SVG Map**: Choropleth node visualization across 37 territories with intensity shading, hover inspection flyout, and click-to-filter interaction.
     - **Territorial Data Grid**: Complete, searchable, sortable table of all 36 States + FCT displaying exact disbursement figures, enterprise counts, jobs, and performing ratios.
   - **Zone Ranking**: Ordered horizontal bar charts ranking the 6 geopolitical zones by volume and share.

6. **Sector Allocation & Temporal Trajectory**:
   - **Sector Allocation**: Ranked bar charts of 10 real sectors with dynamic metric switcher (Capital Disbursed, Enterprises, Jobs).
   - **Trend Chart**: 2023–2026 trajectory chart with quarterly/annual granularity toggle, hover crosshairs, and zero decorative gradient fills.

7. **Demographic Inclusion & Portfolio Risk Quality**:
   - **Inclusion Profile**: Enterprise scale distribution (Nano, Micro, Small, Medium, Large) paired with Women-Led and Youth-Led demographic performance tiles.
   - **Portfolio Performance**: Prudential credit asset classification (Performing, Watchlist, Substandard, Doubtful) with stacked exposure ratio bars and outstanding principal details.

8. **Strategic Theme Mandate Explorer**:
   - 6 strategic mandate pillars: MSMEs, Gender Inclusion, Youth & Skills, Digital Economy, Infrastructure Development, and Climate & Sustainability.

#### Experience 2: Ask BOI AI Analyst Workspace

1. **Scope-Aware Query Context**:
   - Automatically synchronizes with the active dashboard filters.
   - Explicitly displays the exact number of facility records being evaluated.

2. **Starter Analytical Prompts**:
   - Clickable shortcuts for common DFI inquiries (sector ranking, regional comparison, employment efficiency, gender financing, credit quality).

3. **Structured Analytical Responses**:
   - **Key Finding Callout**: High-level institutional takeaway.
   - **Analytical Narrative**: Concise, precise interpretation.
   - **Evidence Block**: Programmatically generated tables, rankings, or metric grids with exact figures.
   - **Source Provenance**: Dataset identifier, verified records count, aggregation query type, and synthetic notice.
   - **Follow-up Inquiries**: Clickable contextual prompts to drill deeper.

4. **Strict Anti-Hallucination Guardrails**:
   - Queries outside the verified dataset schema are rejected with a transparent limitation notice and redirection to available dimensions.

---

### 5. Technical & Engineering Architecture

- **Framework**: Next.js 14 (App Router) with React 18.
- **Language**: TypeScript with strict mode enabled.
- **Styling**: Tailwind CSS with custom institutional design tokens.
- **State Architecture**: URL search params coordinated with React `useMemo` hooks for pure, client-side re-aggregations.
- **Data Engine**: Deterministic PRNG (`Mulberry32`) generating 800 realistic facilities, verified by an automated reconciliation suite.
- **Accessibility**: Semantic HTML5 (`header`, `nav`, `main`, `section`, `footer`, `table`), ARIA attributes, keyboard accessibility, `:focus-visible` rings, and Skip-to-Content mechanism.
