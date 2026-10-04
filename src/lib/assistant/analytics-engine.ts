import {
  EnterpriseSegment,
  FacilityRecord,
  FilterState,
  GeopoliticalZone,
  Sector,
  StrategicTheme,
} from "@/types/dataset";
import {
  aggregateBySector,
  aggregateBySegment,
  aggregateByState,
  aggregateByZone,
  computeAggregatedMetrics,
  filterRecords,
} from "../analytics/aggregation";
import {
  formatNairaCompact,
  formatNairaFull,
  formatNumber,
  formatPercent,
} from "../utils/formatters";
import {
  AssistantEvidence,
  AssistantProvenance,
  AssistantResponse,
  ParsedQuery,
} from "./pipeline-types";

export function executeAnalyticalPipeline(
  parsed: ParsedQuery,
  activeFilters: FilterState,
  allRecords: FacilityRecord[],
  persona: string = "Executive Management"
): AssistantResponse {
  const timestamp = new Date().toLocaleTimeString("en-NG", {
    hour: "2-digit",
    minute: "2-digit",
  });

  // 1. Handle Unsupported Queries Gracefully (No Hallucination)
  if (parsed.isUnsupported) {
    const topic = parsed.unsupportedTopic || "unsupported data dimensions";
    return {
      id: `ans-${Date.now()}`,
      query: parsed.rawQuery,
      timestamp,
      analysis: `The current POC dataset does not contain information regarding ${topic}. As an audited analytical system, this assistant only evaluates verified development-finance records. You can analyse loan disbursements, approvals, jobs created, real sectors, Nigerian states, geopolitical zones, enterprise scale tiers, and demographic inclusion.`,
      keyFinding: `Information on "${topic}" is outside the active POC data boundary.`,
      unsupported: true,
      provenance: {
        datasetName: "Synthetic BOI POC Dataset",
        recordsCount: 0,
        period: activeFilters.year || "All Periods",
        activeFilters: ["Out-of-Scope Query"],
        aggregationType: "Zero evaluation — Query outside schema",
        disclaimer: "Illustrative synthetic data for proof-of-concept demonstration.",
      },
      followUps: [
        "Which sectors received the most funding in 2025?",
        "Compare North West and South West by disbursement and jobs supported.",
        "Which states generated the most jobs per ₦1 billion disbursed?",
        "Show women-led MSME financing by geopolitical zone.",
      ],
    };
  }

  // 2. Synthesize Effective Filters by combining Dashboard Scope + Query Entity Overrides
  const effectiveFilters: FilterState = { ...activeFilters };

  // Explicit entity overrides from query
  if (parsed.entities.years && parsed.entities.years.length === 1) {
    effectiveFilters.year = parsed.entities.years[0].toString();
  }
  if (parsed.entities.zones && parsed.entities.zones.length === 1) {
    effectiveFilters.zone = parsed.entities.zones[0];
  }
  if (parsed.entities.states && parsed.entities.states.length === 1) {
    effectiveFilters.state = parsed.entities.states[0];
  }
  if (parsed.entities.sectors && parsed.entities.sectors.length === 1) {
    effectiveFilters.sector = parsed.entities.sectors[0];
  }
  if (parsed.entities.isWomenLed !== undefined) {
    effectiveFilters.womenLed = parsed.entities.isWomenLed;
  }
  if (parsed.entities.isYouthLed !== undefined) {
    effectiveFilters.youthLed = parsed.entities.isYouthLed;
  }

  // Filter records
  let matchedRecords = filterRecords(allRecords, effectiveFilters);

  // If query specifies multiple states/zones/sectors for a comparison, handle within comparison logic
  const metrics = computeAggregatedMetrics(matchedRecords, allRecords, effectiveFilters.year);

  // Build clean provenance info
  const activeChips: string[] = [];
  if (effectiveFilters.year && effectiveFilters.year !== "all") activeChips.push(`Year: ${effectiveFilters.year}`);
  if (effectiveFilters.zone && effectiveFilters.zone !== "all") activeChips.push(effectiveFilters.zone);
  if (effectiveFilters.state && effectiveFilters.state !== "all") activeChips.push(`State: ${effectiveFilters.state}`);
  if (effectiveFilters.sector && effectiveFilters.sector !== "all") activeChips.push(effectiveFilters.sector);
  if (effectiveFilters.segment && effectiveFilters.segment !== "all") activeChips.push(effectiveFilters.segment);
  if (effectiveFilters.womenLed) activeChips.push("Women-Led");
  if (effectiveFilters.youthLed) activeChips.push("Youth-Led");
  if (activeChips.length === 0) activeChips.push("National Portfolio");

  const baseProvenance: AssistantProvenance = {
    datasetName: "Synthetic BOI POC Dataset",
    recordsCount: matchedRecords.length,
    period: effectiveFilters.year && effectiveFilters.year !== "all" ? effectiveFilters.year : "2023–2026",
    activeFilters: activeChips,
    aggregationType: "Deterministic Aggregation",
    disclaimer: "Illustrative synthetic data for proof-of-concept demonstration. No real BOI client data is included.",
  };

  // -------------------------------------------------------------
  // INTENT A: COMPARISON (e.g. Lagos vs Kano, NW vs SW, Sectors)
  // -------------------------------------------------------------
  if (parsed.intent === "COMPARISON") {
    // 1. Compare States
    if (parsed.entities.states && parsed.entities.states.length >= 2) {
      const stateA = parsed.entities.states[0];
      const stateB = parsed.entities.states[1];
      const recsA = allRecords.filter((r) => r.state.toLowerCase() === stateA.toLowerCase() && (effectiveFilters.year && effectiveFilters.year !== "all" ? r.year.toString() === effectiveFilters.year : true));
      const recsB = allRecords.filter((r) => r.state.toLowerCase() === stateB.toLowerCase() && (effectiveFilters.year && effectiveFilters.year !== "all" ? r.year.toString() === effectiveFilters.year : true));

      const disbA = recsA.reduce((acc, r) => acc + r.amountDisbursed, 0);
      const disbB = recsB.reduce((acc, r) => acc + r.amountDisbursed, 0);
      const jobsA = recsA.reduce((acc, r) => acc + r.jobsSupported, 0);
      const jobsB = recsB.reduce((acc, r) => acc + r.jobsSupported, 0);
      const jobsPerBnA = disbA > 0 ? (jobsA / (disbA / 1e9)).toFixed(1) : "0.0";
      const jobsPerBnB = disbB > 0 ? (jobsB / (disbB / 1e9)).toFixed(1) : "0.0";

      const leader = disbA >= disbB ? stateA : stateB;
      const analysis = `Comparative evaluation between ${stateA} and ${stateB}: ${stateA} received ${formatNairaCompact(disbA)} across ${recsA.length} enterprises (${formatNumber(jobsA)} jobs supported, ${jobsPerBnA} jobs/₦bn). ${stateB} received ${formatNairaCompact(disbB)} across ${recsB.length} enterprises (${formatNumber(jobsB)} jobs supported, ${jobsPerBnB} jobs/₦bn). ${leader} accounts for the larger financing volume under the current scope.`;

      return {
        id: `ans-${Date.now()}`,
        query: parsed.rawQuery,
        timestamp,
        analysis,
        keyFinding: `${stateA} records ${formatNairaCompact(disbA)} (${formatNumber(jobsA)} jobs) vs ${stateB} with ${formatNairaCompact(disbB)} (${formatNumber(jobsB)} jobs).`,
        evidence: {
          type: "table",
          title: `Territorial Comparison: ${stateA} vs ${stateB}`,
          columns: ["Territory", "Total Disbursed", "Enterprises", "Jobs Supported", "Jobs / ₦1B"],
          rows: [
            [stateA, formatNairaCompact(disbA), recsA.length, formatNumber(jobsA), `${jobsPerBnA} jobs`],
            [stateB, formatNairaCompact(disbB), recsB.length, formatNumber(jobsB), `${jobsPerBnB} jobs`],
          ],
        },
        provenance: { ...baseProvenance, aggregationType: "State pairwise aggregation filter" },
        followUps: [
          `Show sector breakdown in ${stateA}`,
          `Show sector breakdown in ${stateB}`,
          `Now show women-led businesses in ${stateA} and ${stateB}`,
        ],
      };
    }

    // 2. Compare Geopolitical Zones (e.g. North West vs South West)
    if (parsed.entities.zones && parsed.entities.zones.length >= 2) {
      const zoneA = parsed.entities.zones[0];
      const zoneB = parsed.entities.zones[1];
      const recsA = allRecords.filter((r) => r.geopoliticalZone === zoneA && (effectiveFilters.year && effectiveFilters.year !== "all" ? r.year.toString() === effectiveFilters.year : true));
      const recsB = allRecords.filter((r) => r.geopoliticalZone === zoneB && (effectiveFilters.year && effectiveFilters.year !== "all" ? r.year.toString() === effectiveFilters.year : true));

      const disbA = recsA.reduce((acc, r) => acc + r.amountDisbursed, 0);
      const disbB = recsB.reduce((acc, r) => acc + r.amountDisbursed, 0);
      const jobsA = recsA.reduce((acc, r) => acc + r.jobsSupported, 0);
      const jobsB = recsB.reduce((acc, r) => acc + r.jobsSupported, 0);
      const jobsPerBnA = disbA > 0 ? (jobsA / (disbA / 1e9)).toFixed(1) : "0.0";
      const jobsPerBnB = disbB > 0 ? (jobsB / (disbB / 1e9)).toFixed(1) : "0.0";

      const analysis = `Regional comparison between ${zoneA} and ${zoneB}: ${zoneA} accounts for ${formatNairaCompact(disbA)} across ${recsA.length} enterprises (${formatNumber(jobsA)} jobs supported, ${jobsPerBnA} jobs/₦bn). ${zoneB} accounts for ${formatNairaCompact(disbB)} across ${recsB.length} enterprises (${formatNumber(jobsB)} jobs supported, ${jobsPerBnB} jobs/₦bn).`;

      return {
        id: `ans-${Date.now()}`,
        query: parsed.rawQuery,
        timestamp,
        analysis,
        keyFinding: `${zoneA} (${formatNairaCompact(disbA)}, ${formatNumber(jobsA)} jobs) compared against ${zoneB} (${formatNairaCompact(disbB)}, ${formatNumber(jobsB)} jobs).`,
        evidence: {
          type: "table",
          title: `Comparative Analysis: ${zoneA} vs ${zoneB}`,
          columns: ["Geopolitical Zone", "Disbursement", "Enterprises", "Jobs Supported", "Employment Multiplier"],
          rows: [
            [zoneA, formatNairaCompact(disbA), recsA.length, formatNumber(jobsA), `${jobsPerBnA} jobs / ₦bn`],
            [zoneB, formatNairaCompact(disbB), recsB.length, formatNumber(jobsB), `${jobsPerBnB} jobs / ₦bn`],
          ],
        },
        provenance: { ...baseProvenance, aggregationType: "GeopoliticalZone pairwise comparison" },
        followUps: [
          `Which states in ${zoneA} received the highest disbursement?`,
          `Which states in ${zoneB} received the highest disbursement?`,
          "What about jobs in other geopolitical zones?",
        ],
      };
    }

    // 3. Compare Sectors (e.g. Manufacturing vs Agro-processing)
    if (parsed.entities.sectors && parsed.entities.sectors.length >= 2) {
      const secA = parsed.entities.sectors[0];
      const secB = parsed.entities.sectors[1];
      const recsA = matchedRecords.filter((r) => r.sector === secA);
      const recsB = matchedRecords.filter((r) => r.sector === secB);

      const disbA = recsA.reduce((acc, r) => acc + r.amountDisbursed, 0);
      const disbB = recsB.reduce((acc, r) => acc + r.amountDisbursed, 0);
      const jobsA = recsA.reduce((acc, r) => acc + r.jobsSupported, 0);
      const jobsB = recsB.reduce((acc, r) => acc + r.jobsSupported, 0);

      const analysis = `Cross-sector analysis between ${secA} and ${secB}: ${secA} received ${formatNairaCompact(disbA)} across ${recsA.length} enterprises (${formatNumber(jobsA)} jobs). ${secB} received ${formatNairaCompact(disbB)} across ${recsB.length} enterprises (${formatNumber(jobsB)} jobs).`;

      return {
        id: `ans-${Date.now()}`,
        query: parsed.rawQuery,
        timestamp,
        analysis,
        keyFinding: `${secA} (${formatNairaCompact(disbA)}) vs ${secB} (${formatNairaCompact(disbB)}).`,
        evidence: {
          type: "table",
          title: `Sector Comparison: ${secA} vs ${secB}`,
          columns: ["Sector", "Disbursement", "Enterprises", "Jobs Supported"],
          rows: [
            [secA, formatNairaCompact(disbA), recsA.length, formatNumber(jobsA)],
            [secB, formatNairaCompact(disbB), recsB.length, formatNumber(jobsB)],
          ],
        },
        provenance: { ...baseProvenance, aggregationType: "Sector pairwise comparison" },
        followUps: [
          `Show top states for ${secA}`,
          `Show top states for ${secB}`,
          "What percentage of the portfolio is performing?",
        ],
      };
    }
  }

  // -------------------------------------------------------------
  // INTENT B: JOB INTENSITY / JOBS PER BILLION (States or National)
  // -------------------------------------------------------------
  if (parsed.metric === "jobsPerBillion" || (parsed.rawQuery.toLowerCase().includes("per ₦1 billion") || parsed.rawQuery.toLowerCase().includes("per billion") || parsed.rawQuery.toLowerCase().includes("jobs-to-disbursement"))) {
    const states = aggregateByState(matchedRecords);
    const validStates = states
      .filter((s) => s.disbursed >= 1_000_000_000)
      .map((s) => ({
        state: s.state,
        zone: s.zone,
        disbursed: s.disbursed,
        jobs: s.jobs,
        jobsPerBn: Number((s.disbursed > 0 ? s.jobs / (s.disbursed / 1e9) : 0).toFixed(1)),
      }))
      .sort((a, b) => b.jobsPerBn - a.jobsPerBn);

    const topState = validStates[0];
    const nationalBench = metrics.jobsPerBillion.toFixed(1);

    const analysis = `Job creation efficiency across the current scope benchmarks at an average of ${nationalBench} jobs per ₦1.0 billion disbursed. Among states with substantial funding (>₦1bn), ${topState?.state} recorded the highest employment impact with ${topState?.jobsPerBn} jobs/₦bn (${formatNumber(topState?.jobs)} jobs supported from ${formatNairaCompact(topState?.disbursed)} disbursed).`;

    return {
      id: `ans-${Date.now()}`,
      query: parsed.rawQuery,
      timestamp,
      analysis,
      keyFinding: `Highest employment efficiency observed in ${topState?.state} (${topState?.jobsPerBn} jobs/₦bn) vs national benchmark of ${nationalBench} jobs/₦bn.`,
      evidence: {
        type: "ranking",
        title: "Top States by Job Creation Efficiency",
        subtitle: "Jobs supported per ₦1.0 billion disbursed (min. ₦1.0B volume)",
        items: validStates.slice(0, 6).map((s) => ({
          label: `${s.state} (${s.zone})`,
          value: `${s.jobsPerBn} jobs / ₦bn`,
          secondaryValue: `${formatNairaCompact(s.disbursed)} | ${formatNumber(s.jobs)} jobs`,
        })),
      },
      provenance: { ...baseProvenance, aggregationType: "Calculated ratio: sum(jobsSupported) / (sum(amountDisbursed) / 1e9) grouped by state" },
      followUps: [
        "Which sectors have the highest job creation per billion disbursed?",
        "Compare job creation between Nano/Micro and Large Enterprises",
        "What is the total job count supported across women-led enterprises?",
      ],
    };
  }

  // -------------------------------------------------------------
  // INTENT C: SECTOR ANALYSIS / TOP SECTORS (e.g. Top funding in 2025)
  // -------------------------------------------------------------
  if (parsed.dimension === "sector" || parsed.rawQuery.toLowerCase().includes("sector")) {
    const sectors = aggregateBySector(matchedRecords, parsed.metric === "jobs" ? "jobs" : parsed.metric === "enterprises" ? "enterprises" : "disbursed");
    const topSector = sectors[0];
    const limit = parsed.entities.limit || (parsed.intent === "TOP_N" ? 5 : 6);
    const topSlice = sectors.slice(0, limit);

    const totalDisb = metrics.totalDisbursed;
    const topDisbShare = totalDisb > 0 ? (topSector.disbursed / totalDisb) * 100 : 0;

    const periodLabel = effectiveFilters.year && effectiveFilters.year !== "all" ? `in ${effectiveFilters.year}` : "across all evaluated cycles";
    const analysis = `Across the active scope ${periodLabel} (${matchedRecords.length} facilities, ${formatNairaCompact(totalDisb)} total disbursed), ${topSector.sector} leads capital allocation with ${formatNairaCompact(topSector.disbursed)} (${formatPercent(topDisbShare)}), supporting ${formatNumber(topSector.jobs)} jobs across ${topSector.enterprises} enterprises. The top ${topSlice.length} sectors account for ${formatPercent(topSlice.reduce((acc, s) => acc + s.percentageOfTotal, 0))} of all deployed capital.`;

    return {
      id: `ans-${Date.now()}`,
      query: parsed.rawQuery,
      timestamp,
      analysis,
      keyFinding: `${topSector.sector} leads allocation ${periodLabel} with ${formatNairaCompact(topSector.disbursed)} across ${topSector.enterprises} enterprises.`,
      evidence: {
        type: "ranking",
        title: `Sector Capital Allocation Breakdown ${periodLabel}`,
        subtitle: `Ranked by total disbursement across ${matchedRecords.length} facilities`,
        items: topSlice.map((s) => ({
          label: s.sector,
          value: formatNairaCompact(s.disbursed),
          secondaryValue: `${formatNumber(s.enterprises)} enterprises | ${formatNumber(s.jobs)} jobs`,
          percentage: formatPercent(s.percentageOfTotal),
        })),
      },
      provenance: { ...baseProvenance, aggregationType: "Sum of amountDisbursed grouped by sector, descending rank" },
      followUps: [
        "How many jobs does Agro-processing generate per ₦1 billion disbursed?",
        "Show sector performance by performing vs at-risk exposure",
        "What percentage of Manufacturing financing reached women-led businesses?",
      ],
    };
  }

  // -------------------------------------------------------------
  // INTENT D: STATE ANALYSIS / HIGHEST FUNDING STATE
  // -------------------------------------------------------------
  if (parsed.dimension === "state" || parsed.rawQuery.toLowerCase().includes("state")) {
    const states = aggregateByState(matchedRecords);
    const topState = states[0];
    const limit = parsed.entities.limit || 5;
    const topSlice = states.slice(0, limit);

    const analysis = `Territorial analysis across the active selection identifies ${topState.state} State (${topState.zone} Zone) as the leading beneficiary, receiving ${formatNairaCompact(topState.disbursed)} (${formatNairaFull(topState.disbursed)}) across ${topState.enterprises} enterprises, supporting ${formatNumber(topState.jobs)} jobs with a performing portfolio ratio of ${formatPercent(topState.performingRatio)}.`;

    return {
      id: `ans-${Date.now()}`,
      query: parsed.rawQuery,
      timestamp,
      analysis,
      keyFinding: `${topState.state} State leads funding with ${formatNairaCompact(topState.disbursed)} across ${topState.enterprises} enterprises.`,
      evidence: {
        type: "ranking",
        title: "Top States by Capital Disbursement",
        subtitle: "Ranked by total amount disbursed",
        items: topSlice.map((s) => ({
          label: `${s.state} (${s.zone})`,
          value: formatNairaCompact(s.disbursed),
          secondaryValue: `${formatNumber(s.enterprises)} enterprises | ${formatNumber(s.jobs)} jobs`,
          percentage: formatPercent(metrics.totalDisbursed > 0 ? (s.disbursed / metrics.totalDisbursed) * 100 : 0),
        })),
      },
      provenance: { ...baseProvenance, aggregationType: "Sum of amountDisbursed grouped by state, descending rank" },
      followUps: [
        `Compare ${topState.state} and Kano`,
        `Show sector breakdown in ${topState.state}`,
        "Which geopolitical zone supported the most jobs?",
      ],
    };
  }

  // -------------------------------------------------------------
  // INTENT E: GEOPOLITICAL ZONE DISTRIBUTION / MOST JOBS
  // -------------------------------------------------------------
  if (parsed.dimension === "zone" || parsed.rawQuery.toLowerCase().includes("zone") || parsed.rawQuery.toLowerCase().includes("geopolitical")) {
    const zones = aggregateByZone(matchedRecords);
    const sortedByMetric = [...zones].sort((a, b) => parsed.metric === "jobs" ? b.jobs - a.jobs : b.disbursed - a.disbursed);
    const leader = sortedByMetric[0];

    const analysis = parsed.metric === "jobs"
      ? `Zonal employment analysis confirms that ${leader.zone} supported the highest volume of employment, sustaining ${formatNumber(leader.jobs)} direct and indirect jobs across ${leader.enterprises} enterprises with ${formatNairaCompact(leader.disbursed)} disbursed.`
      : `Zonal disbursement analysis confirms ${leader.zone} accounts for the highest capital allocation at ${formatNairaCompact(leader.disbursed)} (${formatPercent(metrics.totalDisbursed > 0 ? (leader.disbursed / metrics.totalDisbursed) * 100 : 0)} of total), supporting ${formatNumber(leader.jobs)} jobs across ${leader.enterprises} enterprises.`;

    return {
      id: `ans-${Date.now()}`,
      query: parsed.rawQuery,
      timestamp,
      analysis,
      keyFinding: `${leader.zone} leads ${parsed.metric === "jobs" ? "job creation" : "capital deployment"} with ${parsed.metric === "jobs" ? `${formatNumber(leader.jobs)} jobs` : formatNairaCompact(leader.disbursed)}.`,
      evidence: {
        type: "table",
        title: "Geopolitical Zone Breakdown",
        columns: ["Geopolitical Zone", "Disbursement", "Enterprises", "Jobs Supported", "States Active"],
        rows: zones.map((z) => [
          z.zone,
          formatNairaCompact(z.disbursed),
          formatNumber(z.enterprises),
          formatNumber(z.jobs),
          `${z.statesCount} states`,
        ]),
      },
      provenance: { ...baseProvenance, aggregationType: "Group-by geopoliticalZone with sum and count" },
      followUps: [
        "Compare North West and South West by disbursement and jobs supported.",
        "Which states in the South West received the most?",
        "Show women-led MSME financing by geopolitical zone.",
      ],
    };
  }

  // -------------------------------------------------------------
  // INTENT F: DEMOGRAPHIC INCLUSION (Women-Led / Youth-Led / MSME)
  // -------------------------------------------------------------
  if (parsed.entities.isWomenLed || parsed.entities.isYouthLed || parsed.rawQuery.toLowerCase().includes("women") || parsed.rawQuery.toLowerCase().includes("youth") || parsed.rawQuery.toLowerCase().includes("gender")) {
    const womenCount = metrics.womenLedCount;
    const womenDisb = metrics.womenLedDisbursed;
    const womenPct = metrics.womenLedPercentage;

    const youthCount = metrics.youthLedCount;
    const youthDisb = metrics.youthLedDisbursed;
    const youthPct = metrics.youthLedPercentage;
    const youthEnterprisePct = metrics.enterprisesCount > 0 ? (youthCount / metrics.enterprisesCount) * 100 : 0;

    const isYouthSpecific = parsed.rawQuery.toLowerCase().includes("youth");
    const isWomenSpecific = parsed.rawQuery.toLowerCase().includes("women") || parsed.rawQuery.toLowerCase().includes("female") || parsed.rawQuery.toLowerCase().includes("gender");

    let analysis = "";
    if (isYouthSpecific && !isWomenSpecific) {
      analysis = `Within the active scope, ${formatNumber(youthCount)} enterprises (${formatPercent(youthEnterprisePct)} of all funded enterprises) are verified Youth-Led businesses (founder/CEO under 35 years). Total capital deployed to youth-led enterprises is ${formatNairaCompact(youthDisb)} (${formatPercent(youthPct)} of total disbursed capital).`;
    } else if (isWomenSpecific && !isYouthSpecific) {
      analysis = `Within the active scope, ${formatNumber(womenCount)} enterprises (${formatPercent(metrics.enterprisesCount > 0 ? (womenCount / metrics.enterprisesCount) * 100 : 0)} of all funded enterprises) are verified Women-Led businesses, receiving ${formatNairaCompact(womenDisb)} (${formatPercent(womenPct)} of disbursed capital).`;
    } else {
      analysis = `Demographic inclusion tracking reflects strong developmental additionality: Women-Led enterprises represent ${formatNumber(womenCount)} businesses receiving ${formatNairaCompact(womenDisb)} (${formatPercent(womenPct)} of capital). Youth-Led enterprises represent ${formatNumber(youthCount)} businesses receiving ${formatNairaCompact(youthDisb)} (${formatPercent(youthPct)} of capital).`;
    }

    // If query asks by zone (e.g. "Show women-led MSME financing by geopolitical zone")
    if (parsed.rawQuery.toLowerCase().includes("zone") || parsed.rawQuery.toLowerCase().includes("geopolitical")) {
      const targetRecords = matchedRecords.filter((r) => isWomenSpecific ? r.womenLed : r.youthLed);
      const zoneAgg = aggregateByZone(targetRecords);

      return {
        id: `ans-${Date.now()}`,
        query: parsed.rawQuery,
        timestamp,
        analysis,
        keyFinding: `${isWomenSpecific ? "Women-Led" : "Youth-Led"} financing across zones: ${zoneAgg[0]?.zone} leads with ${formatNairaCompact(zoneAgg[0]?.disbursed || 0)}.`,
        evidence: {
          type: "table",
          title: `${isWomenSpecific ? "Women-Led" : "Youth-Led"} Financing by Geopolitical Zone`,
          columns: ["Geopolitical Zone", "Disbursement", "Enterprises", "Jobs Supported"],
          rows: zoneAgg.map((z) => [
            z.zone,
            formatNairaCompact(z.disbursed),
            formatNumber(z.enterprises),
            formatNumber(z.jobs),
          ]),
        },
        provenance: { ...baseProvenance, aggregationType: `Boolean attribute (${isWomenSpecific ? "womenLed=true" : "youthLed=true"}) grouped by geopoliticalZone` },
        followUps: [
          "Compare North West and South West by disbursement and jobs supported.",
          "What percentage of the portfolio is performing?",
          "Which programme financed the most enterprises?",
        ],
      };
    }

    return {
      id: `ans-${Date.now()}`,
      query: parsed.rawQuery,
      timestamp,
      analysis,
      keyFinding: isYouthSpecific
        ? `${formatPercent(youthEnterprisePct)} of enterprises (${formatNumber(youthCount)} units) are Youth-Led, accounting for ${formatNairaCompact(youthDisb)}.`
        : `${formatNumber(womenCount)} enterprises are Women-Led (${formatNairaCompact(womenDisb)}), and ${formatNumber(youthCount)} are Youth-Led (${formatNairaCompact(youthDisb)}).`,
      evidence: {
        type: "metrics",
        title: "Demographic Inclusion Metrics",
        items: [
          { label: "Women-Led Capital", value: formatNairaCompact(womenDisb), percentage: `${formatPercent(womenPct)} of capital` },
          { label: "Women-Led Enterprises", value: formatNumber(womenCount), secondaryValue: "Enterprises funded" },
          { label: "Youth-Led Capital", value: formatNairaCompact(youthDisb), percentage: `${formatPercent(youthPct)} of capital` },
          { label: "Youth-Led Enterprises", value: formatNumber(youthCount), secondaryValue: "Enterprises funded" },
        ],
      },
      provenance: { ...baseProvenance, aggregationType: "Demographic boolean filter aggregation" },
      followUps: [
        "Show women-led MSME financing by geopolitical zone.",
        "Show youth-led enterprises in the South West.",
        "What is the repayment performance of women-led facilities?",
      ],
    };
  }

  // -------------------------------------------------------------
  // INTENT G: PORTFOLIO QUALITY & RISK (Performing %, NPL, Status)
  // -------------------------------------------------------------
  if (parsed.dimension === "portfolioStatus" || parsed.rawQuery.toLowerCase().includes("performing") || parsed.rawQuery.toLowerCase().includes("risk") || parsed.rawQuery.toLowerCase().includes("npl") || parsed.rawQuery.toLowerCase().includes("asset quality")) {
    const performingRatio = metrics.performingRatio;
    const performingDisb = metrics.performingDisbursed;
    const atRiskRatio = metrics.atRiskRatio;
    const atRiskDisb = metrics.atRiskDisbursed;

    const analysis = `Portfolio asset quality under the active scope shows a Performing Portfolio Ratio of ${formatPercent(performingRatio)} (${formatNairaCompact(performingDisb)} across ${matchedRecords.filter((r) => r.portfolioStatus === "Performing").length} facilities). At-risk exposure (Watchlist, Substandard, and Doubtful facilities) totals ${formatNairaCompact(atRiskDisb)} (${formatPercent(atRiskRatio)}). Outstanding balance is ${formatNairaCompact(metrics.totalOutstanding)}.`;

    return {
      id: `ans-${Date.now()}`,
      query: parsed.rawQuery,
      timestamp,
      analysis,
      keyFinding: `Active portfolio is ${formatPercent(performingRatio)} performing with ${formatPercent(atRiskRatio)} at-risk exposure.`,
      evidence: {
        type: "metrics",
        title: "Prudential Loan Asset Quality",
        items: [
          { label: "Performing Facilities", value: formatNairaCompact(performingDisb), percentage: formatPercent(performingRatio) },
          { label: "At-Risk Exposure", value: formatNairaCompact(atRiskDisb), percentage: formatPercent(atRiskRatio) },
          { label: "Principal Outstanding", value: formatNairaCompact(metrics.totalOutstanding), secondaryValue: "Current credit ledger" },
          { label: "Performing Units", value: `${matchedRecords.filter((r) => r.portfolioStatus === "Performing").length} units`, secondaryValue: `Total: ${matchedRecords.length}` },
        ],
      },
      provenance: { ...baseProvenance, aggregationType: "Prudential loan classification ratio against total disbursed" },
      followUps: [
        "Which sectors have the highest at-risk facility volume?",
        "Compare North West and South West by disbursement and jobs supported.",
        "Which programme supported the most businesses?",
      ],
    };
  }

  // -------------------------------------------------------------
  // INTENT H: PROGRAMMES (e.g. Which programme financed the most?)
  // -------------------------------------------------------------
  if (parsed.dimension === "programme" || parsed.rawQuery.toLowerCase().includes("programme") || parsed.rawQuery.toLowerCase().includes("program")) {
    const progMap = new Map<string, { disbursed: number; count: number; jobs: number }>();
    for (const r of matchedRecords) {
      const cur = progMap.get(r.programme) || { disbursed: 0, count: 0, jobs: 0 };
      cur.disbursed += r.amountDisbursed;
      cur.count += 1;
      cur.jobs += r.jobsSupported;
      progMap.set(r.programme, cur);
    }

    const progList = Array.from(progMap.entries())
      .map(([prog, d]) => ({ prog, ...d }))
      .sort((a, b) => b.count - a.count);

    const leader = progList[0];
    const analysis = `Programmatic analysis identifies "${leader.prog}" as the intervention funding the highest number of enterprises, financing ${leader.count} businesses with ${formatNairaCompact(leader.disbursed)} disbursed and ${formatNumber(leader.jobs)} jobs sustained.`;

    return {
      id: `ans-${Date.now()}`,
      query: parsed.rawQuery,
      timestamp,
      analysis,
      keyFinding: `"${leader.prog}" financed the most enterprises (${leader.count} units, ${formatNairaCompact(leader.disbursed)} disbursed).`,
      evidence: {
        type: "ranking",
        title: "Intervention Programmes Ranked by Enterprises Financed",
        items: progList.slice(0, 6).map((p) => ({
          label: p.prog,
          value: `${p.count} enterprises`,
          secondaryValue: `${formatNairaCompact(p.disbursed)} disbursed | ${formatNumber(p.jobs)} jobs`,
        })),
      },
      provenance: { ...baseProvenance, aggregationType: "Count and sum grouped by programme" },
      followUps: [
        "Which sectors received the most funding in 2025?",
        "What was the average facility size in 2025?",
        "Show financing trends over time.",
      ],
    };
  }

  // -------------------------------------------------------------
  // INTENT I: TRENDS / HISTORICAL TRAJECTORY
  // -------------------------------------------------------------
  if (parsed.intent === "TREND" || parsed.rawQuery.toLowerCase().includes("trend") || parsed.rawQuery.toLowerCase().includes("over time")) {
    const yearMap = new Map<number, { disbursed: number; count: number; jobs: number }>();
    for (const r of allRecords) {
      const cur = yearMap.get(r.year) || { disbursed: 0, count: 0, jobs: 0 };
      cur.disbursed += r.amountDisbursed;
      cur.count += 1;
      cur.jobs += r.jobsSupported;
      yearMap.set(r.year, cur);
    }

    const years = Array.from(yearMap.keys()).sort();
    const rows = years.map((y) => {
      const d = yearMap.get(y)!;
      return [y.toString(), formatNairaCompact(d.disbursed), d.count, formatNumber(d.jobs)];
    });

    const analysis = `Historical credit deployment trend demonstrates steady expansion from ₦${(yearMap.get(2023)!.disbursed / 1e9).toFixed(1)}bn in 2023 to peak annual deployment of ₦${(yearMap.get(2025)!.disbursed / 1e9).toFixed(1)}bn in 2025, with 2026 YTD figures continuing steady disbursement across priority real sectors.`;

    return {
      id: `ans-${Date.now()}`,
      query: parsed.rawQuery,
      timestamp,
      analysis,
      keyFinding: "Financing expanded consistently across 2023–2025, peaking in 2025 with strong employment multipliers.",
      evidence: {
        type: "table",
        title: "Annual Portfolio Trajectory (2023–2026)",
        columns: ["Year", "Disbursed (NGN)", "Enterprises", "Jobs Supported"],
        rows,
      },
      provenance: { ...baseProvenance, aggregationType: "Time-series aggregation grouped by year" },
      followUps: [
        "Which sectors received the most funding in 2025?",
        "What was the average facility size in 2025?",
        "Which state received the highest disbursement?",
      ],
    };
  }

  // -------------------------------------------------------------
  // INTENT J: AVERAGE FACILITY SIZE
  // -------------------------------------------------------------
  if (parsed.metric === "avgFacilitySize" || parsed.rawQuery.toLowerCase().includes("average facility")) {
    const avgSize = metrics.avgFacilitySize;
    const yearLabel = effectiveFilters.year && effectiveFilters.year !== "all" ? `in ${effectiveFilters.year}` : "across the entire portfolio";

    const analysis = `The average facility size ${yearLabel} was ${formatNairaCompact(avgSize)} (${formatNairaFull(avgSize)}) across ${metrics.enterprisesCount} financed enterprises, representing ${formatNairaCompact(metrics.totalDisbursed)} cumulative disbursement.`;

    return {
      id: `ans-${Date.now()}`,
      query: parsed.rawQuery,
      timestamp,
      analysis,
      keyFinding: `Average facility size ${yearLabel} was ${formatNairaCompact(avgSize)} across ${metrics.enterprisesCount} enterprises.`,
      evidence: {
        type: "metrics",
        title: `Facility Sizing Summary (${yearLabel})`,
        items: [
          { label: "Average Facility Size", value: formatNairaCompact(avgSize) },
          { label: "Total Disbursed", value: formatNairaCompact(metrics.totalDisbursed) },
          { label: "Enterprises Financed", value: formatNumber(metrics.enterprisesCount) },
          { label: "Jobs Supported", value: formatNumber(metrics.jobsSupported) },
        ],
      },
      provenance: { ...baseProvenance, aggregationType: "Total amountDisbursed / enterprisesCount" },
      followUps: [
        "Which sectors received the most funding in 2025?",
        "Compare Nano/Micro and Large Enterprises",
        "Which programme financed the most enterprises?",
      ],
    };
  }

  // -------------------------------------------------------------
  // INTENT K: TOTALS / GENERAL MACRO DISBURSEMENT (e.g. How much disbursed in 2024?)
  // -------------------------------------------------------------
  const periodDesc = effectiveFilters.year && effectiveFilters.year !== "all" ? `in ${effectiveFilters.year}` : "across all evaluated cycles";
  const geoDesc = effectiveFilters.zone && effectiveFilters.zone !== "all" ? `in the ${effectiveFilters.zone}` : "";

  const analysis = `Total developmental financing disbursed ${periodDesc} ${geoDesc} stands at ${formatNairaCompact(metrics.totalDisbursed)} (${formatNairaFull(metrics.totalDisbursed)}) across ${formatNumber(metrics.enterprisesCount)} enterprises, sustaining ${formatNumber(metrics.jobsSupported)} direct and indirect jobs across ${metrics.statesReachedCount} territories with a performing loan ratio of ${formatPercent(metrics.performingRatio)}.`;

  return {
    id: `ans-${Date.now()}`,
    query: parsed.rawQuery,
    timestamp,
    analysis,
    keyFinding: `Disbursement totals ${formatNairaCompact(metrics.totalDisbursed)} across ${formatNumber(metrics.enterprisesCount)} enterprises ${periodDesc} ${geoDesc}.`,
    evidence: {
      type: "metrics",
      title: "Portfolio Key Indicators Summary",
      items: [
        { label: "Amount Disbursed", value: formatNairaCompact(metrics.totalDisbursed) },
        { label: "Enterprises Financed", value: formatNumber(metrics.enterprisesCount) },
        { label: "Jobs Supported", value: formatNumber(metrics.jobsSupported) },
        { label: "Performing Portfolio", value: formatPercent(metrics.performingRatio) },
      ],
    },
    provenance: { ...baseProvenance, aggregationType: "Macro portfolio sum and count within active filter scope" },
    followUps: [
      "Which sectors received the most funding?",
      "Compare North West and South West by disbursement and jobs supported.",
      "Which states generated the most jobs per ₦1 billion disbursed?",
      "Show women-led MSME financing by geopolitical zone.",
    ],
  };
}
