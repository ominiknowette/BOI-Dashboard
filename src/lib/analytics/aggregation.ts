import {
  AggregatedMetrics,
  EnterpriseSegment,
  FacilityRecord,
  FilterState,
  GeopoliticalZone,
  PortfolioStatus,
  PortfolioStatusSummary,
  Sector,
  SectorSummary,
  SegmentSummary,
  StateSummary,
  StrategicTheme,
  TimeSeriesPoint,
  ZoneSummary,
} from "@/types/dataset";
import { GEOPOLITICAL_ZONES, NIGERIA_STATES } from "../data/geo-metadata";

export function filterRecords(
  records: FacilityRecord[],
  filters: FilterState
): FacilityRecord[] {
  return records.filter((r) => {
    if (filters.year && filters.year !== "all") {
      if (r.year.toString() !== filters.year) return false;
    }
    if (filters.zone && filters.zone !== "all") {
      if (r.geopoliticalZone !== filters.zone) return false;
    }
    if (filters.state && filters.state !== "all") {
      if (r.state.toLowerCase() !== filters.state.toLowerCase()) return false;
    }
    if (filters.sector && filters.sector !== "all") {
      if (r.sector !== filters.sector) return false;
    }
    if (filters.segment && filters.segment !== "all") {
      if (r.enterpriseSegment !== filters.segment) return false;
    }
    if (filters.programme && filters.programme !== "all") {
      if (r.programme !== filters.programme) return false;
    }
    if (filters.portfolioStatus && filters.portfolioStatus !== "all") {
      if (r.portfolioStatus !== filters.portfolioStatus) return false;
    }
    if (filters.strategicTheme && filters.strategicTheme !== "all") {
      if (r.strategicTheme !== filters.strategicTheme) return false;
    }
    if (filters.womenLed !== undefined && filters.womenLed !== null) {
      if (r.womenLed !== filters.womenLed) return false;
    }
    if (filters.youthLed !== undefined && filters.youthLed !== null) {
      if (r.youthLed !== filters.youthLed) return false;
    }
    return true;
  });
}

export function computeAggregatedMetrics(
  records: FacilityRecord[],
  allRecords: FacilityRecord[],
  selectedYear?: string
): AggregatedMetrics {
  const count = records.length;
  if (count === 0) {
    return {
      totalDisbursed: 0,
      totalApproved: 0,
      totalOutstanding: 0,
      enterprisesCount: 0,
      jobsSupported: 0,
      womenLedCount: 0,
      womenLedDisbursed: 0,
      womenLedPercentage: 0,
      youthLedCount: 0,
      youthLedDisbursed: 0,
      youthLedPercentage: 0,
      performingRatio: 0,
      performingDisbursed: 0,
      atRiskDisbursed: 0,
      atRiskRatio: 0,
      statesReachedCount: 0,
      avgFacilitySize: 0,
      jobsPerBillion: 0,
      recordsCount: 0,
      priorPeriodChange: {
        disbursedDeltaPercent: 0,
        enterprisesDeltaPercent: 0,
        jobsDeltaPercent: 0,
      },
    };
  }

  let totalDisbursed = 0;
  let totalApproved = 0;
  let totalOutstanding = 0;
  let jobsSupported = 0;
  let womenLedCount = 0;
  let womenLedDisbursed = 0;
  let youthLedCount = 0;
  let youthLedDisbursed = 0;
  let performingDisbursed = 0;
  let atRiskDisbursed = 0;

  const statesSet = new Set<string>();

  for (let i = 0; i < count; i++) {
    const r = records[i];
    totalDisbursed += r.amountDisbursed;
    totalApproved += r.amountApproved;
    totalOutstanding += r.outstandingAmount;
    jobsSupported += r.jobsSupported;

    statesSet.add(r.state);

    if (r.womenLed) {
      womenLedCount++;
      womenLedDisbursed += r.amountDisbursed;
    }

    if (r.youthLed) {
      youthLedCount++;
      youthLedDisbursed += r.amountDisbursed;
    }

    if (r.portfolioStatus === "Performing") {
      performingDisbursed += r.amountDisbursed;
    } else {
      atRiskDisbursed += r.amountDisbursed;
    }
  }

  const womenLedPercentage = totalDisbursed > 0 ? (womenLedDisbursed / totalDisbursed) * 100 : 0;
  const youthLedPercentage = totalDisbursed > 0 ? (youthLedDisbursed / totalDisbursed) * 100 : 0;
  const performingRatio = totalDisbursed > 0 ? (performingDisbursed / totalDisbursed) * 100 : 0;
  const atRiskRatio = totalDisbursed > 0 ? (atRiskDisbursed / totalDisbursed) * 100 : 0;
  const avgFacilitySize = totalDisbursed / count;
  const jobsPerBillion = totalDisbursed > 0 ? jobsSupported / (totalDisbursed / 1_000_000_000) : 0;

  // Calculate prior period change
  // If specific year selected, compare with (selectedYear - 1). If all, compare 2025 vs 2024.
  const currentYearNum = selectedYear && selectedYear !== "all" ? parseInt(selectedYear, 10) : 2025;
  const priorYearNum = currentYearNum - 1;

  const priorYearRecords = allRecords.filter((r) => r.year === priorYearNum);
  const currentYearRecords = allRecords.filter((r) => r.year === currentYearNum);

  const priorDisbursed = priorYearRecords.reduce((acc, r) => acc + r.amountDisbursed, 0);
  const curDisbursed = currentYearRecords.reduce((acc, r) => acc + r.amountDisbursed, 0);
  const disbursedDeltaPercent = priorDisbursed > 0 ? ((curDisbursed - priorDisbursed) / priorDisbursed) * 100 : 0;

  const priorEnterprises = priorYearRecords.length;
  const curEnterprises = currentYearRecords.length;
  const enterprisesDeltaPercent = priorEnterprises > 0 ? ((curEnterprises - priorEnterprises) / priorEnterprises) * 100 : 0;

  const priorJobs = priorYearRecords.reduce((acc, r) => acc + r.jobsSupported, 0);
  const curJobs = currentYearRecords.reduce((acc, r) => acc + r.jobsSupported, 0);
  const jobsDeltaPercent = priorJobs > 0 ? ((curJobs - priorJobs) / priorJobs) * 100 : 0;

  return {
    totalDisbursed,
    totalApproved,
    totalOutstanding,
    enterprisesCount: count,
    jobsSupported,
    womenLedCount,
    womenLedDisbursed,
    womenLedPercentage,
    youthLedCount,
    youthLedDisbursed,
    youthLedPercentage,
    performingRatio,
    performingDisbursed,
    atRiskDisbursed,
    atRiskRatio,
    statesReachedCount: statesSet.size,
    avgFacilitySize,
    jobsPerBillion,
    recordsCount: count,
    priorPeriodChange: {
      disbursedDeltaPercent: Number(disbursedDeltaPercent.toFixed(1)),
      enterprisesDeltaPercent: Number(enterprisesDeltaPercent.toFixed(1)),
      jobsDeltaPercent: Number(jobsDeltaPercent.toFixed(1)),
    },
  };
}

export function aggregateByZone(records: FacilityRecord[]): ZoneSummary[] {
  const zoneMap: Record<GeopoliticalZone, { disbursed: number; enterprises: number; jobs: number; states: Set<string> }> = {
    "North Central": { disbursed: 0, enterprises: 0, jobs: 0, states: new Set() },
    "North East": { disbursed: 0, enterprises: 0, jobs: 0, states: new Set() },
    "North West": { disbursed: 0, enterprises: 0, jobs: 0, states: new Set() },
    "South East": { disbursed: 0, enterprises: 0, jobs: 0, states: new Set() },
    "South South": { disbursed: 0, enterprises: 0, jobs: 0, states: new Set() },
    "South West": { disbursed: 0, enterprises: 0, jobs: 0, states: new Set() },
  };

  for (const r of records) {
    const target = zoneMap[r.geopoliticalZone];
    if (target) {
      target.disbursed += r.amountDisbursed;
      target.enterprises += 1;
      target.jobs += r.jobsSupported;
      target.states.add(r.state);
    }
  }

  return GEOPOLITICAL_ZONES.map((zone) => ({
    zone,
    disbursed: zoneMap[zone].disbursed,
    enterprises: zoneMap[zone].enterprises,
    jobs: zoneMap[zone].jobs,
    statesCount: zoneMap[zone].states.size,
  })).sort((a, b) => b.disbursed - a.disbursed);
}

export function aggregateByState(records: FacilityRecord[]): StateSummary[] {
  const map = new Map<string, { zone: GeopoliticalZone; disbursed: number; enterprises: number; jobs: number; performingDisbursed: number }>();

  // Initialize with all known states so even unvisited states appear with 0 if needed
  for (const st of NIGERIA_STATES) {
    map.set(st.name, {
      zone: st.zone,
      disbursed: 0,
      enterprises: 0,
      jobs: 0,
      performingDisbursed: 0,
    });
  }

  for (const r of records) {
    let entry = map.get(r.state);
    if (!entry) {
      entry = { zone: r.geopoliticalZone, disbursed: 0, enterprises: 0, jobs: 0, performingDisbursed: 0 };
      map.set(r.state, entry);
    }
    entry.disbursed += r.amountDisbursed;
    entry.enterprises += 1;
    entry.jobs += r.jobsSupported;
    if (r.portfolioStatus === "Performing") {
      entry.performingDisbursed += r.amountDisbursed;
    }
  }

  const result: StateSummary[] = [];
  for (const [state, data] of map.entries()) {
    result.push({
      state,
      zone: data.zone,
      disbursed: data.disbursed,
      enterprises: data.enterprises,
      jobs: data.jobs,
      performingRatio: data.disbursed > 0 ? (data.performingDisbursed / data.disbursed) * 100 : 100,
    });
  }

  return result.sort((a, b) => b.disbursed - a.disbursed);
}

export function aggregateBySector(
  records: FacilityRecord[],
  sortBy: "disbursed" | "enterprises" | "jobs" = "disbursed"
): SectorSummary[] {
  const totalDisbursed = records.reduce((acc, r) => acc + r.amountDisbursed, 0);
  const sectorMap = new Map<Sector, { disbursed: number; enterprises: number; jobs: number }>();

  for (const r of records) {
    const cur = sectorMap.get(r.sector) || { disbursed: 0, enterprises: 0, jobs: 0 };
    cur.disbursed += r.amountDisbursed;
    cur.enterprises += 1;
    cur.jobs += r.jobsSupported;
    sectorMap.set(r.sector, cur);
  }

  const result: SectorSummary[] = [];
  for (const [sector, d] of sectorMap.entries()) {
    result.push({
      sector,
      disbursed: d.disbursed,
      enterprises: d.enterprises,
      jobs: d.jobs,
      percentageOfTotal: totalDisbursed > 0 ? (d.disbursed / totalDisbursed) * 100 : 0,
    });
  }

  return result.sort((a, b) => {
    if (sortBy === "jobs") return b.jobs - a.jobs;
    if (sortBy === "enterprises") return b.enterprises - a.enterprises;
    return b.disbursed - a.disbursed;
  });
}

export function aggregateBySegment(records: FacilityRecord[]): SegmentSummary[] {
  const orderedSegments: EnterpriseSegment[] = [
    "Nano",
    "Micro",
    "Small",
    "Medium",
    "Large Enterprise",
  ];

  const map = new Map<EnterpriseSegment, { disbursed: number; enterprises: number; jobs: number; womenLedCount: number; youthLedCount: number }>();
  for (const s of orderedSegments) {
    map.set(s, { disbursed: 0, enterprises: 0, jobs: 0, womenLedCount: 0, youthLedCount: 0 });
  }

  for (const r of records) {
    const entry = map.get(r.enterpriseSegment);
    if (entry) {
      entry.disbursed += r.amountDisbursed;
      entry.enterprises += 1;
      entry.jobs += r.jobsSupported;
      if (r.womenLed) entry.womenLedCount += 1;
      if (r.youthLed) entry.youthLedCount += 1;
    }
  }

  return orderedSegments.map((segment) => ({
    segment,
    ...map.get(segment)!,
  }));
}

export function aggregateTimeSeries(
  records: FacilityRecord[],
  granularity: "year" | "quarter" = "quarter"
): TimeSeriesPoint[] {
  const pointMap = new Map<string, { disbursed: number; jobs: number; enterprises: number }>();

  for (const r of records) {
    const key = granularity === "year" ? r.year.toString() : r.quarter;
    const cur = pointMap.get(key) || { disbursed: 0, jobs: 0, enterprises: 0 };
    cur.disbursed += r.amountDisbursed;
    cur.jobs += r.jobsSupported;
    cur.enterprises += 1;
    pointMap.set(key, cur);
  }

  const keys = Array.from(pointMap.keys()).sort();
  return keys.map((period) => ({
    period,
    ...pointMap.get(period)!,
  }));
}

export function aggregatePortfolioStatus(records: FacilityRecord[]): PortfolioStatusSummary[] {
  const statuses: PortfolioStatus[] = ["Performing", "Watchlist", "Substandard", "Doubtful"];
  const totalDisbursed = records.reduce((acc, r) => acc + r.amountDisbursed, 0);

  const map = new Map<PortfolioStatus, { disbursed: number; outstanding: number; count: number }>();
  for (const st of statuses) {
    map.set(st, { disbursed: 0, outstanding: 0, count: 0 });
  }

  for (const r of records) {
    const entry = map.get(r.portfolioStatus);
    if (entry) {
      entry.disbursed += r.amountDisbursed;
      entry.outstanding += r.outstandingAmount;
      entry.count += 1;
    }
  }

  return statuses.map((status) => {
    const d = map.get(status)!;
    return {
      status,
      disbursed: d.disbursed,
      outstanding: d.outstanding,
      count: d.count,
      ratio: totalDisbursed > 0 ? (d.disbursed / totalDisbursed) * 100 : 0,
    };
  });
}

export function aggregateByStrategicTheme(
  records: FacilityRecord[]
): { theme: StrategicTheme; disbursed: number; enterprises: number; jobs: number }[] {
  const themes: StrategicTheme[] = [
    "MSMEs",
    "Gender Inclusion",
    "Youth & Skills",
    "Digital Economy",
    "Infrastructure Development",
    "Climate & Sustainability",
  ];

  const map = new Map<StrategicTheme, { disbursed: number; enterprises: number; jobs: number }>();
  for (const t of themes) {
    map.set(t, { disbursed: 0, enterprises: 0, jobs: 0 });
  }

  for (const r of records) {
    const cur = map.get(r.strategicTheme);
    if (cur) {
      cur.disbursed += r.amountDisbursed;
      cur.enterprises += 1;
      cur.jobs += r.jobsSupported;
    }
  }

  return themes.map((theme) => ({
    theme,
    ...map.get(theme)!,
  })).sort((a, b) => b.disbursed - a.disbursed);
}
