# Phase 2 Enterprise Integration Roadmap
## Bank of Industry (BOI) Impact Intelligence Portal

---

### 1. Architectural Migration Overview

While the **Phase 1 Proof of Concept (POC)** validated user experience, institutional aesthetics, mathematical reconciliation, and conversational analytical workflows against a 100% deterministic synthetic dataset, **Phase 2** establishes the production integration pathway to connect the portal directly with the Bank of Industry's enterprise data infrastructure.

```
+-----------------------------------------------------------------------------------+
|                        PHASE 2 TARGET ENTERPRISE ARCHITECTURE                     |
+-----------------------------------------------------------------------------------+
|                                                                                   |
|  [BOI Core Banking / LMS]      [M&E Field Verification]     [Co-Financier Feeds]  |
|  (Finacle / Bespoke LMS)        (Impact Survey / Mobile)     (AfDB / WB Portals)  |
|            |                               |                           |          |
|            +-------------------------------+---------------------------+          |
|                                            |                                      |
|                                            v                                      |
|                        [Secure ETL & Data Pipeline Layer]                         |
|                       (Apache Kafka / Airflow / dbt Core)                         |
|                                            |                                      |
|                          +-----------------+-----------------+                    |
|                          | Anonymization & Data Sanitisation |                    |
|                          | - Mask client proprietary names   |                    |
|                          | - Retain developmental attributes |                    |
|                          +-----------------+-----------------+                    |
|                                            |                                      |
|                                            v                                      |
|                        [Enterprise Analytics Warehouse]                          |
|                             (PostgreSQL / Snowflake)                              |
|                          Gold Layer: Reconciled Data Mart                         |
|                                            |                                      |
|                    +-----------------------+-----------------------+              |
|                    |                                               |              |
|                    v                                               v              |
|       [Next.js App Server / API]                     [Enterprise Hybrid RAG]      |
|       - Role-Based Access Control                    - Semantic Data Layer        |
|       - Materialized Metric Cache                    - Private VPC LLM Engine     |
|       - Real-time Drill-down API                     - Provenance Verifier        |
|                    |                                               |              |
|                    +-----------------------+-----------------------+              |
|                                            |                                      |
|                                            v                                      |
|                 [BOI Impact Intelligence Web Application]                         |
|                 - Executive Management Workspace                                  |
|                 - Impact & Strategy Drill-down                                    |
|                 - Ask BOI AI Analyst Assistant                                    |
|                                                                                   |
+-----------------------------------------------------------------------------------+
```

---

### 2. Core Banking & Loan Management System (LMS) Ingestion

#### Ingestion Vectors
1. **Batch Pipeline (Daily Midnight Sync)**:
   - Automated ingestion of settled disbursements, repayments, amortisation schedules, and prudential loan classifications from the core banking database.
   - Idempotent upsert operations keyed on internal facility reference numbers.
2. **Event-Driven Change Data Capture (CDC)**:
   - For high-value transactions (>₦500m), real-time CDC updates trigger incremental metric refreshes.

#### Client Confidentiality & Data Sanitisation Gateway
To balance executive transparency with banking secrecy laws and NDPR (Nigeria Data Protection Regulation) compliance:
- **Client Anonymisation**: Customer corporate names can be optionally abstracted to industry descriptors for external or development partner views (e.g., `"Tier-1 Agro-Processor #402"` instead of legal business names).
- **Developmental Metadata Preservation**: Fields necessary for impact analysis (LGA, State, Geopolitical Zone, Sector, Enterprise Scale, Gender/Youth leadership, Verified Jobs) are preserved intact.

---

### 3. Analytics Warehouse & Data Mart (Gold Layer)

The underlying storage layer transitions from in-memory arrays to a structured dimensional model:

#### Star Schema Architecture
- **Fact Table**: `fact_facility_disbursement` (Facility ID, Disbursed Amount, Approved Amount, Outstanding Principal, Direct Jobs, Indirect Jobs, Dates).
- **Dimension Tables**:
  - `dim_geography` (State, Geopolitical Zone, LGA, Capital, Coordinates).
  - `dim_sector` (Sector, Sub-Sector, Industrial Classification Code).
  - `dim_enterprise` (Scale Tier, Registration Category, Inception Year).
  - `dim_demographic` (Women-Led Flag, Youth-Led Flag, Founder Age Bracket).
  - `dim_prudential_status` (Performing, Watchlist, Substandard, Doubtful, NPL Provision).
  - `dim_strategic_mandate` (MSME, Green/Climate, Digital Economy, etc.).

---

### 4. Upgrading "Ask BOI AI" to an Enterprise Hybrid Engine

In production, natural-language querying must combine the fluidity of large language models with the arithmetic precision of relational query engines. LLMs must **never** be permitted to guess arithmetic aggregations.

#### Hybrid Semantic Architecture:
1. **Intent & Schema Routing**: The system maps the user's inquiry to predefined dimensional queries or generates parameterized SQL through a typed Semantic Layer.
2. **Deterministic SQL Execution**: Aggregations (`SUM`, `COUNT`, `AVG`, `RATIO`) execute directly against the audited analytical database.
3. **Synthesis & Provenance Generation**: The enterprise LLM receives the SQL results as grounded structured JSON. It generates boardroom-grade narrative commentary while embedding exact evidence tables and source SQL query signatures into the response.
4. **Guardrail Enforcer**: Any question requesting information outside authorized schema boundaries (e.g., individual borrower bank statements or proprietary collateral valuations) is rejected systematically with an explanatory governance notice.

---

### 5. Identity, Access Management & Security

1. **Single Sign-On (SSO)**:
   - Microsoft Entra ID (formerly Azure Active Directory) SAML/OIDC integration with BOI's corporate directory.
2. **Role-Based Access Control (RBAC)**:
   - **Executive Persona**: Unrestricted macro portfolio view, prudential exposure, balance sheet summary.
   - **Impact & Strategy Persona**: Operational metrics, M&E field verification status, micro-level job intensity.
   - **Development Partner Persona**: Scoped strictly to facilities co-financed by or aligned with the partner's legal covenants.
3. **Audit Trails**:
   - Comprehensive audit logging of all analytical Q&A queries, filter exports, and report downloads.
