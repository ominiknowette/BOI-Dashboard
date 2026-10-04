import {
  EnterpriseSegment,
  FacilityRecord,
  FilterState,
  GeopoliticalZone,
  PersonaRole,
  PortfolioStatus,
  Sector,
  StrategicTheme,
} from "@/types/dataset";

export type AnalyticalIntent =
  | "TOTAL"
  | "RANKING"
  | "TOP_N"
  | "BOTTOM_N"
  | "COMPARISON"
  | "TREND"
  | "BREAKDOWN"
  | "AVERAGE"
  | "PERCENTAGE"
  | "RATIO"
  | "COUNT"
  | "LOOKUP"
  | "UNSUPPORTED";

export type MetricTarget =
  | "disbursed"
  | "approved"
  | "outstanding"
  | "jobs"
  | "enterprises"
  | "avgFacilitySize"
  | "jobsPerBillion"
  | "performingRatio"
  | "womenLed"
  | "youthLed";

export type DimensionTarget =
  | "sector"
  | "state"
  | "zone"
  | "segment"
  | "programme"
  | "strategicTheme"
  | "portfolioStatus"
  | "year";

export interface ParsedEntities {
  years?: number[];
  states?: string[];
  zones?: GeopoliticalZone[];
  sectors?: Sector[];
  segments?: EnterpriseSegment[];
  programmes?: string[];
  themes?: StrategicTheme[];
  statuses?: PortfolioStatus[];
  isWomenLed?: boolean;
  isYouthLed?: boolean;
  limit?: number;
}

export interface ParsedQuery {
  rawQuery: string;
  normalizedQuery: string;
  intent: AnalyticalIntent;
  metric: MetricTarget;
  dimension?: DimensionTarget;
  entities: ParsedEntities;
  isUnsupported: boolean;
  unsupportedTopic?: string;
  isAmbiguous: boolean;
  ambiguityClarification?: string;
}

export interface AssistantEvidence {
  type: "comparison" | "ranking" | "table" | "metrics";
  title: string;
  subtitle?: string;
  items?: { label: string; value: string; secondaryValue?: string; percentage?: string }[];
  columns?: string[];
  rows?: (string | number)[][];
}

export interface AssistantProvenance {
  datasetName: string;
  recordsCount: number;
  period: string;
  activeFilters: string[];
  aggregationType: string;
  disclaimer: string;
}

export interface AssistantResponse {
  id: string;
  query: string;
  timestamp: string;
  analysis: string;
  keyFinding?: string;
  evidence?: AssistantEvidence;
  provenance: AssistantProvenance;
  followUps: string[];
  unsupported?: boolean;
}

export interface ConversationContext {
  lastQuery?: ParsedQuery;
  lastResponse?: AssistantResponse;
  lastDimension?: DimensionTarget;
  lastMetric?: MetricTarget;
  lastEntities?: ParsedEntities;
}

export interface AnalyticsAssistantProvider {
  processQuery(
    query: string,
    filters: FilterState,
    persona: PersonaRole | string,
    allRecords: FacilityRecord[],
    context?: ConversationContext
  ): Promise<AssistantResponse>;
}
