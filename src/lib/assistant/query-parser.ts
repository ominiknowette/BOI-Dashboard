import {
  EnterpriseSegment,
  GeopoliticalZone,
  Sector,
  StrategicTheme,
  PortfolioStatus,
} from "@/types/dataset";
import { NIGERIA_STATES } from "../data/geo-metadata";
import {
  AnalyticalIntent,
  ConversationContext,
  DimensionTarget,
  MetricTarget,
  ParsedEntities,
  ParsedQuery,
} from "./pipeline-types";

const ALL_SECTORS: Sector[] = [
  "Manufacturing",
  "Agro-processing",
  "Infrastructure",
  "Healthcare",
  "Creative Industries",
  "Technology / Digital Economy",
  "Renewable Energy",
  "Solid Minerals",
  "Engineering",
  "Services",
];

const ALL_ZONES: GeopoliticalZone[] = [
  "North Central",
  "North East",
  "North West",
  "South East",
  "South South",
  "South West",
];

const ALL_SEGMENTS: EnterpriseSegment[] = [
  "Nano",
  "Micro",
  "Small",
  "Medium",
  "Large Enterprise",
];

const UNSUPPORTED_KEYWORDS: { pattern: RegExp; topic: string }[] = [
  { pattern: /\b(salary|salaries|remuneration|compensation|wage|wages|earn|earning)\b/i, topic: "executive remuneration and salaries" },
  { pattern: /\b(ceo|managing director|board of directors|board members|executive committee)\b/i, topic: "executive management biographical or personal data" },
  { pattern: /\b(politics|election|presidency|president|party|governor)\b/i, topic: "political affiliations or elections" },
  { pattern: /\b(weather|climate forecast|temperature|rain)\b/i, topic: "meteorological forecasts" },
  { pattern: /\b(stock price|share price|equity ticker|nasdaq|ngx|crypto|bitcoin|ethereum)\b/i, topic: "public stock market and cryptocurrency tickers" },
  { pattern: /\b(bvn|nin|bank account|password|credentials|secret)\b/i, topic: "confidential customer identification data" },
];

export function parseAnalyticalQuery(
  rawQuery: string,
  context?: ConversationContext
): ParsedQuery {
  const norm = rawQuery.trim().toLowerCase();

  // 1. Check for Unsupported / Out-of-Scope queries
  for (const item of UNSUPPORTED_KEYWORDS) {
    if (item.pattern.test(norm)) {
      return {
        rawQuery,
        normalizedQuery: norm,
        intent: "UNSUPPORTED",
        metric: "disbursed",
        entities: {},
        isUnsupported: true,
        unsupportedTopic: item.topic,
        isAmbiguous: false,
      };
    }
  }

  // 2. Check for conversational follow-up triggers
  const isFollowUpJobs = /^(what about|how about|in terms of|show me|and)\s+(jobs?|employment)\??$/i.test(norm);
  const isFollowUpWomen = /^(now show|what about|how about|and)\s+(women|women-led|female)\??$/i.test(norm);
  const isFollowUpYouth = /^(now show|what about|how about|and)\s+(youth|youth-led|young)\??$/i.test(norm);
  const isFollowUpFunding = /^(what about|how about)\s+(funding|disbursement|capital|amount)\??$/i.test(norm);

  const entities: ParsedEntities = {};

  // Extract Years
  const yearMatches = norm.match(/\b(202[3-6])\b/g);
  if (yearMatches) {
    entities.years = Array.from(new Set(yearMatches.map((y) => parseInt(y, 10))));
  }

  // Extract Limit (e.g. top 5, top three, 10)
  const topNMatch = norm.match(/\b(?:top|bottom|first|first)\s+(\d+|one|two|three|four|five|six|seven|eight|nine|ten)\b/i);
  if (topNMatch) {
    const numWord = topNMatch[1].toLowerCase();
    const wordMap: Record<string, number> = {
      one: 1, two: 2, three: 3, four: 4, five: 5,
      six: 6, seven: 7, eight: 8, nine: 9, ten: 10,
    };
    entities.limit = wordMap[numWord] || parseInt(numWord, 10) || 5;
  }

  // Extract States
  const foundStates: string[] = [];
  for (const st of NIGERIA_STATES) {
    const stateNameLower = st.name.toLowerCase();
    const regex = new RegExp(`\\b${stateNameLower}\\b`, "i");
    if (regex.test(norm)) {
      foundStates.push(st.name);
    }
  }
  if (/\babuja\b/i.test(norm) && !foundStates.includes("FCT")) {
    foundStates.push("FCT");
  }
  if (foundStates.length > 0) {
    entities.states = foundStates;
  }

  // Extract Geopolitical Zones
  const foundZones: GeopoliticalZone[] = [];
  for (const z of ALL_ZONES) {
    const zoneLower = z.toLowerCase();
    if (norm.includes(zoneLower)) {
      foundZones.push(z);
    }
  }
  if (foundZones.length > 0) {
    entities.zones = foundZones;
  }

  // Extract Sectors
  const foundSectors: Sector[] = [];
  if (/\bmanufacturing\b/i.test(norm)) foundSectors.push("Manufacturing");
  if (/\b(agro|agro-processing|agriculture|farming)\b/i.test(norm)) foundSectors.push("Agro-processing");
  if (/\binfrastructure\b/i.test(norm)) foundSectors.push("Infrastructure");
  if (/\b(healthcare|pharmaceuticals?|health|pharma)\b/i.test(norm)) foundSectors.push("Healthcare");
  if (/\b(creative|media|entertainment|film)\b/i.test(norm)) foundSectors.push("Creative Industries");
  if (/\b(tech|technology|digital|software)\b/i.test(norm)) foundSectors.push("Technology / Digital Economy");
  if (/\b(renewable|solar|energy|clean energy)\b/i.test(norm)) foundSectors.push("Renewable Energy");
  if (/\b(solid minerals|minerals|mining)\b/i.test(norm)) foundSectors.push("Solid Minerals");
  if (/\bengineering\b/i.test(norm)) foundSectors.push("Engineering");
  if (/\bservices\b/i.test(norm)) foundSectors.push("Services");
  if (foundSectors.length > 0) {
    entities.sectors = foundSectors;
  }

  // Extract Enterprise Segments
  const foundSegments: EnterpriseSegment[] = [];
  if (/\bnano\b/i.test(norm)) foundSegments.push("Nano");
  if (/\bmicro\b/i.test(norm)) foundSegments.push("Micro");
  if (/\bsmall\b/i.test(norm)) foundSegments.push("Small");
  if (/\bmedium\b/i.test(norm)) foundSegments.push("Medium");
  if (/\blarge(?:\s+enterprise)?\b/i.test(norm)) foundSegments.push("Large Enterprise");
  if (/\bmsmes?\b/i.test(norm)) {
    // MSME covers Nano, Micro, Small, Medium
    entities.segments = ["Nano", "Micro", "Small", "Medium"];
  } else if (foundSegments.length > 0) {
    entities.segments = foundSegments;
  }

  // Extract Inclusion Flags
  if (/\b(women|women-led|female|gender)\b/i.test(norm)) {
    entities.isWomenLed = true;
  }
  if (/\b(youth|youth-led|young)\b/i.test(norm)) {
    entities.isYouthLed = true;
  }

  // Extract Portfolio Status
  const foundStatuses: PortfolioStatus[] = [];
  if (/\bperforming\b/i.test(norm)) foundStatuses.push("Performing");
  if (/\bwatchlist\b/i.test(norm)) foundStatuses.push("Watchlist");
  if (/\bsubstandard\b/i.test(norm)) foundStatuses.push("Substandard");
  if (/\bdoubtful\b/i.test(norm)) foundStatuses.push("Doubtful");
  if (foundStatuses.length > 0) {
    entities.statuses = foundStatuses;
  }

  // Handle Conversational Follow-up Context Injection
  if (isFollowUpJobs && context?.lastDimension) {
    return {
      rawQuery,
      normalizedQuery: norm,
      intent: "BREAKDOWN",
      metric: "jobs",
      dimension: context.lastDimension,
      entities: { ...context.lastEntities },
      isUnsupported: false,
      isAmbiguous: false,
    };
  }
  if (isFollowUpWomen && context?.lastEntities) {
    return {
      rawQuery,
      normalizedQuery: norm,
      intent: context.lastQuery?.intent || "BREAKDOWN",
      metric: context.lastMetric || "disbursed",
      dimension: context.lastDimension,
      entities: { ...context.lastEntities, isWomenLed: true },
      isUnsupported: false,
      isAmbiguous: false,
    };
  }
  if (isFollowUpYouth && context?.lastEntities) {
    return {
      rawQuery,
      normalizedQuery: norm,
      intent: context.lastQuery?.intent || "BREAKDOWN",
      metric: context.lastMetric || "disbursed",
      dimension: context.lastDimension,
      entities: { ...context.lastEntities, isYouthLed: true },
      isUnsupported: false,
      isAmbiguous: false,
    };
  }
  if (isFollowUpFunding && context?.lastDimension) {
    return {
      rawQuery,
      normalizedQuery: norm,
      intent: "BREAKDOWN",
      metric: "disbursed",
      dimension: context.lastDimension,
      entities: { ...context.lastEntities },
      isUnsupported: false,
      isAmbiguous: false,
    };
  }

  // 3. Determine Metric Target
  let metric: MetricTarget = "disbursed";
  if (/\b(jobs?|employment|workers?)\b/i.test(norm)) {
    if (/\b(ratio|intensity|per billion|efficiency)\b/i.test(norm)) {
      metric = "jobsPerBillion";
    } else {
      metric = "jobs";
    }
  } else if (/\b(enterprises?|businesses?|companies?|firms?|units?|count|number of)\b/i.test(norm)) {
    metric = "enterprises";
  } else if (/\b(average|avg|mean)\s+(?:facility|loan|deal|ticket)\b/i.test(norm)) {
    metric = "avgFacilitySize";
  } else if (/\b(performing|performance|npl|at[- ]risk)\b/i.test(norm)) {
    metric = "performingRatio";
  } else if (/\b(women|female)\b/i.test(norm) && !/\b(disburs|fund|amount)\b/i.test(norm)) {
    metric = "womenLed";
  } else if (/\b(youth|young)\b/i.test(norm) && !/\b(disburs|fund|amount)\b/i.test(norm)) {
    metric = "youthLed";
  } else if (/\boutstanding\b/i.test(norm)) {
    metric = "outstanding";
  } else if (/\bapproved\b/i.test(norm)) {
    metric = "approved";
  }

  // 4. Determine Dimension Target
  let dimension: DimensionTarget | undefined;
  if (/\b(sector|sectors|industry|industries)\b/i.test(norm) || (entities.sectors && entities.sectors.length > 0)) {
    dimension = "sector";
  } else if (/\b(state|states|territor(?:y|ies))\b/i.test(norm) || (entities.states && entities.states.length > 0)) {
    dimension = "state";
  } else if (/\b(zone|zones|geopolitical|region|regional)\b/i.test(norm) || (entities.zones && entities.zones.length > 0)) {
    dimension = "zone";
  } else if (/\b(segment|segments|size|scale|msme|tier)\b/i.test(norm) || (entities.segments && entities.segments.length > 0)) {
    dimension = "segment";
  } else if (/\b(programme|program|programmes|programs|fund|funds)\b/i.test(norm)) {
    dimension = "programme";
  } else if (/\b(status|asset quality|risk)\b/i.test(norm)) {
    dimension = "portfolioStatus";
  } else if (/\b(trend|trends|history|trajectory|timeline|year|years)\b/i.test(norm)) {
    dimension = "year";
  }

  // 5. Determine Intent
  let intent: AnalyticalIntent = "TOTAL";

  // Comparison intent: compare 2+ entities
  const hasMultipleStates = entities.states && entities.states.length >= 2;
  const hasMultipleZones = entities.zones && entities.zones.length >= 2;
  const hasMultipleSectors = entities.sectors && entities.sectors.length >= 2;
  if (/\b(compare|comparison|versus|vs|between)\b/i.test(norm) || hasMultipleStates || hasMultipleZones || hasMultipleSectors) {
    intent = "COMPARISON";
  } else if (/\b(trend|trends|trajectory|evolution|over time|from \d{4} to \d{4}|historical)\b/i.test(norm)) {
    intent = "TREND";
  } else if (/\b(top|highest|most|largest|leader|leading|best|greatest|rank|ranking)\b/i.test(norm)) {
    intent = entities.limit ? "TOP_N" : "RANKING";
  } else if (/\b(bottom|lowest|least|worst)\b/i.test(norm)) {
    intent = entities.limit ? "BOTTOM_N" : "RANKING";
  } else if (/\b(average|avg|mean)\b/i.test(norm)) {
    intent = "AVERAGE";
  } else if (/\b(percentage|percent|share|proportion|rate)\b/i.test(norm)) {
    intent = "PERCENTAGE";
  } else if (/\b(ratio|intensity|multiplier)\b/i.test(norm)) {
    intent = "RATIO";
  } else if (dimension && !entities.states?.length && !entities.sectors?.length && !entities.zones?.length) {
    intent = "BREAKDOWN";
  } else if (/\b(how many|count of|number of)\b/i.test(norm)) {
    intent = "COUNT";
  }

  // Ambiguity check
  let isAmbiguous = false;
  let ambiguityClarification: string | undefined;
  if (/what is the biggest (sector|zone|state)\??$/i.test(norm)) {
    isAmbiguous = true;
    ambiguityClarification = "Interpreted as highest by total disbursed capital.";
  }

  return {
    rawQuery,
    normalizedQuery: norm,
    intent,
    metric,
    dimension,
    entities,
    isUnsupported: false,
    isAmbiguous,
    ambiguityClarification,
  };
}
