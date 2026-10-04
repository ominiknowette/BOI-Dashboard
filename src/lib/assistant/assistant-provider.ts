import { FacilityRecord, FilterState, PersonaRole } from "@/types/dataset";
import { parseAnalyticalQuery } from "./query-parser";
import { executeAnalyticalPipeline } from "./analytics-engine";
import {
  AnalyticsAssistantProvider,
  AssistantEvidence,
  AssistantProvenance,
  AssistantResponse,
  ConversationContext,
} from "./pipeline-types";

export * from "./pipeline-types";

export class LocalAnalyticsProvider implements AnalyticsAssistantProvider {
  private context: ConversationContext = {};

  async processQuery(
    query: string,
    filters: FilterState,
    persona: PersonaRole | string = "Executive Management",
    allRecords: FacilityRecord[]
  ): Promise<AssistantResponse> {
    // 1. Normalization & Intent Parsing (with session context for conversational follow-ups)
    const parsed = parseAnalyticalQuery(query, this.context);

    // 2. Deterministic Calculation Execution
    const response = executeAnalyticalPipeline(parsed, filters, allRecords, persona);

    // 3. Update Conversation Context
    this.context = {
      lastQuery: parsed,
      lastResponse: response,
      lastDimension: parsed.dimension || this.context.lastDimension,
      lastMetric: parsed.metric || this.context.lastMetric,
      lastEntities: {
        ...this.context.lastEntities,
        ...parsed.entities,
      },
    };

    return response;
  }

  resetContext(): void {
    this.context = {};
  }
}

// Backwards-compatible alias for existing imports
export class RuleBasedAnalyticsProvider extends LocalAnalyticsProvider {}

export const defaultAnalyticsProvider = new LocalAnalyticsProvider();
