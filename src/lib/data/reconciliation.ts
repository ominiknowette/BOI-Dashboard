import { FacilityRecord } from "@/types/dataset";
import {
  aggregateBySector,
  aggregateBySegment,
  aggregateByState,
  aggregateByZone,
  computeAggregatedMetrics,
} from "../analytics/aggregation";
import { SYNTHETIC_RECORDS } from "./synthetic-records";

export interface ReconciliationCheck {
  name: string;
  expected: number;
  actual: number;
  difference: number;
  passed: boolean;
  description: string;
}

export interface ReconciliationReport {
  timestamp: string;
  totalRecords: number;
  allPassed: boolean;
  checks: ReconciliationCheck[];
}

export function runReconciliationAudit(records: FacilityRecord[] = SYNTHETIC_RECORDS): ReconciliationReport {
  const metrics = computeAggregatedMetrics(records, records);
  const totalDisbursed = metrics.totalDisbursed;
  const totalJobs = metrics.jobsSupported;
  const totalEnterprises = records.length;

  const checks: ReconciliationCheck[] = [];

  // 1. Zone Disbursement Sum == Total Disbursement
  const zones = aggregateByZone(records);
  const zoneDisbursedSum = zones.reduce((acc, z) => acc + z.disbursed, 0);
  checks.push({
    name: "Zone Disbursement Reconciliation",
    expected: totalDisbursed,
    actual: zoneDisbursedSum,
    difference: Math.abs(totalDisbursed - zoneDisbursedSum),
    passed: totalDisbursed === zoneDisbursedSum,
    description: "Sum of all 6 geopolitical zone disbursements must exactly equal national total.",
  });

  // 2. Zone Enterprises Sum == Total Enterprises
  const zoneEnterprisesSum = zones.reduce((acc, z) => acc + z.enterprises, 0);
  checks.push({
    name: "Zone Enterprise Count Reconciliation",
    expected: totalEnterprises,
    actual: zoneEnterprisesSum,
    difference: Math.abs(totalEnterprises - zoneEnterprisesSum),
    passed: totalEnterprises === zoneEnterprisesSum,
    description: "Sum of enterprises across zones must equal total record count.",
  });

  // 3. State Disbursement Sum == Total Disbursement
  const states = aggregateByState(records);
  const stateDisbursedSum = states.reduce((acc, s) => acc + s.disbursed, 0);
  checks.push({
    name: "State Disbursement Reconciliation",
    expected: totalDisbursed,
    actual: stateDisbursedSum,
    difference: Math.abs(totalDisbursed - stateDisbursedSum),
    passed: totalDisbursed === stateDisbursedSum,
    description: "Sum of disbursements across all 36 states + FCT must equal national total.",
  });

  // 4. State Jobs Sum == Total Jobs Supported
  const stateJobsSum = states.reduce((acc, s) => acc + s.jobs, 0);
  checks.push({
    name: "State Jobs Reconciliation",
    expected: totalJobs,
    actual: stateJobsSum,
    difference: Math.abs(totalJobs - stateJobsSum),
    passed: totalJobs === stateJobsSum,
    description: "Sum of jobs reported across all states must equal national total jobs supported.",
  });

  // 5. Sector Disbursement Sum == Total Disbursement
  const sectors = aggregateBySector(records);
  const sectorDisbursedSum = sectors.reduce((acc, s) => acc + s.disbursed, 0);
  checks.push({
    name: "Sector Disbursement Reconciliation",
    expected: totalDisbursed,
    actual: sectorDisbursedSum,
    difference: Math.abs(totalDisbursed - sectorDisbursedSum),
    passed: totalDisbursed === sectorDisbursedSum,
    description: "Sum of allocations across all sectors must equal national total.",
  });

  // 6. Enterprise Segment Sum == Total Enterprises
  const segments = aggregateBySegment(records);
  const segmentEnterprisesSum = segments.reduce((acc, s) => acc + s.enterprises, 0);
  checks.push({
    name: "Enterprise Segment Count Reconciliation",
    expected: totalEnterprises,
    actual: segmentEnterprisesSum,
    difference: Math.abs(totalEnterprises - segmentEnterprisesSum),
    passed: totalEnterprises === segmentEnterprisesSum,
    description: "Sum of Nano, Micro, Small, Medium, Large enterprises must equal total record count.",
  });

  // 7. Women-Led Direct Match
  const rawWomenCount = records.filter((r) => r.womenLed).length;
  checks.push({
    name: "Women-Led Enterprise Count Reconciliation",
    expected: rawWomenCount,
    actual: metrics.womenLedCount,
    difference: Math.abs(rawWomenCount - metrics.womenLedCount),
    passed: rawWomenCount === metrics.womenLedCount,
    description: "Aggregated women-led count must exactly match source records with womenLed=true.",
  });

  // 8. Youth-Led Direct Match
  const rawYouthCount = records.filter((r) => r.youthLed).length;
  checks.push({
    name: "Youth-Led Enterprise Count Reconciliation",
    expected: rawYouthCount,
    actual: metrics.youthLedCount,
    difference: Math.abs(rawYouthCount - metrics.youthLedCount),
    passed: rawYouthCount === metrics.youthLedCount,
    description: "Aggregated youth-led count must exactly match source records with youthLed=true.",
  });

  const allPassed = checks.every((c) => c.passed);

  return {
    timestamp: new Date().toISOString(),
    totalRecords: records.length,
    allPassed,
    checks,
  };
}
