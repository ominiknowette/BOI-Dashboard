export type GeopoliticalZone =
  | "North Central"
  | "North East"
  | "North West"
  | "South East"
  | "South South"
  | "South West";

export type EnterpriseSegment =
  | "Nano"
  | "Micro"
  | "Small"
  | "Medium"
  | "Large Enterprise";

export type Sector =
  | "Manufacturing"
  | "Agro-processing"
  | "Infrastructure"
  | "Healthcare"
  | "Creative Industries"
  | "Technology / Digital Economy"
  | "Renewable Energy"
  | "Solid Minerals"
  | "Engineering"
  | "Services";

export type StrategicTheme =
  | "MSMEs"
  | "Gender Inclusion"
  | "Youth & Skills"
  | "Digital Economy"
  | "Infrastructure Development"
  | "Climate & Sustainability";

export type PortfolioStatus =
  | "Performing"
  | "Watchlist"
  | "Substandard"
  | "Doubtful";

export type RepaymentStatus =
  | "Current"
  | "Grace Period"
  | "Restructured"
  | "Overdue 30-90 Days";

export type Persona = "executive" | "strategy" | "partner";

export type PersonaRole = "Executive Management" | "Impact & Strategy" | "Development Partner";

export function getPersonaRole(p: Persona): PersonaRole {
  switch (p) {
    case "executive":
      return "Executive Management";
    case "strategy":
      return "Impact & Strategy";
    case "partner":
      return "Development Partner";
  }
}

export interface FacilityRecord {
  facilityId: string;
  enterpriseName: string;
  programme: string;
  fund: string;
  sector: Sector;
  strategicTheme: StrategicTheme;
  enterpriseSegment: EnterpriseSegment;
  state: string;
  geopoliticalZone: GeopoliticalZone;
  amountApproved: number;
  amountDisbursed: number;
  outstandingAmount: number;
  jobsSupported: number;
  womenLed: boolean;
  youthLed: boolean;
  approvalDate: string; // ISO YYYY-MM-DD
  disbursementDate: string; // ISO YYYY-MM-DD
  year: number;
  quarter: string; // e.g. "2024-Q2"
  portfolioStatus: PortfolioStatus;
  repaymentStatus: RepaymentStatus;
  originatingUnit: string;
  developmentPartner: string;
}

export interface FilterState {
  year?: string;
  zone?: string;
  state?: string;
  sector?: string;
  segment?: string;
  programme?: string;
  womenLed?: boolean | null;
  youthLed?: boolean | null;
  portfolioStatus?: string;
  strategicTheme?: string;
}

export interface AggregatedMetrics {
  totalDisbursed: number;
  totalApproved: number;
  totalOutstanding: number;
  enterprisesCount: number;
  jobsSupported: number;
  womenLedCount: number;
  womenLedDisbursed: number;
  womenLedPercentage: number;
  youthLedCount: number;
  youthLedDisbursed: number;
  youthLedPercentage: number;
  performingRatio: number;
  performingDisbursed: number;
  atRiskDisbursed: number;
  atRiskRatio: number;
  statesReachedCount: number;
  avgFacilitySize: number;
  jobsPerBillion: number;
  recordsCount: number;
  // Prior period comparisons (calculated from preceding timeframe)
  priorPeriodChange: {
    disbursedDeltaPercent: number;
    enterprisesDeltaPercent: number;
    jobsDeltaPercent: number;
  };
}

export interface ZoneSummary {
  zone: GeopoliticalZone;
  disbursed: number;
  enterprises: number;
  jobs: number;
  statesCount: number;
}

export interface StateSummary {
  state: string;
  zone: GeopoliticalZone;
  disbursed: number;
  enterprises: number;
  jobs: number;
  performingRatio: number;
}

export interface SectorSummary {
  sector: Sector;
  disbursed: number;
  enterprises: number;
  jobs: number;
  percentageOfTotal: number;
}

export interface SegmentSummary {
  segment: EnterpriseSegment;
  disbursed: number;
  enterprises: number;
  jobs: number;
  womenLedCount: number;
  youthLedCount: number;
}

export interface TimeSeriesPoint {
  period: string; // e.g. "2023", "2024", or "2024-Q1"
  disbursed: number;
  approved: number;
  outstanding: number;
  jobs: number;
  enterprises: number;
}

export interface PortfolioStatusSummary {
  status: PortfolioStatus;
  disbursed: number;
  outstanding: number;
  count: number;
  ratio: number;
}

export interface StrategicThemeSummary {
  theme: StrategicTheme;
  disbursed: number;
  enterprises: number;
  jobs: number;
}
