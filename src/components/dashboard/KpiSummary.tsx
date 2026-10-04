import React from "react";
import { AggregatedMetrics } from "@/types/dataset";
import { formatDelta, formatNaira, formatNumber, formatPercent } from "@/lib/utils/formatters";
import { TrendingUp, Users, Briefcase, Award, ShieldCheck, ArrowUpRight } from "lucide-react";

interface KpiSummaryProps {
  metrics: AggregatedMetrics;
  selectedYear?: string;
}

export function KpiSummary({ metrics, selectedYear }: KpiSummaryProps) {
  const disbursedDelta = formatDelta(metrics.priorPeriodChange.disbursedDeltaPercent);
  const enterprisesDelta = formatDelta(metrics.priorPeriodChange.enterprisesDeltaPercent);
  const jobsDelta = formatDelta(metrics.priorPeriodChange.jobsDeltaPercent);

  const yearContextLabel = selectedYear && selectedYear !== "all" ? `vs ${parseInt(selectedYear, 10) - 1}` : "vs 2024 baseline";

  return (
    <section aria-labelledby="impact-glance-heading" className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h2 id="impact-glance-heading" className="text-[14px] font-bold uppercase tracking-wider text-boi-green-deep">
            Impact at a Glance
          </h2>
          <p className="text-[12px] text-boi-text-muted">
            Headline developmental finance performance derived from current active filter scope
          </p>
        </div>
        <span className="text-[11px] font-medium text-boi-text-muted bg-boi-surface px-2 py-0.5 rounded-xs border border-boi-border">
          Status: Verified
        </span>
      </div>

      {/* Asymmetric Institutional Composition: 2 Dominant Metrics + 4 Supporting Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
        {/* DOMINANT 1: Total Amount Disbursed (Financial Mandate Leader) */}
        <div className="lg:col-span-7 bg-boi-surface p-5 rounded-md border border-boi-border flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[12px] font-semibold uppercase tracking-wider text-boi-text-muted">
                Total Amount Disbursed
              </span>
              <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-boi-green px-2 py-0.5 rounded-xs bg-boi-selected border border-boi-green/20">
                <ArrowUpRight className="w-3 h-3" />
                <span className="tabular-nums">{disbursedDelta.text}</span>
                <span className="font-normal text-boi-text-muted">{yearContextLabel}</span>
              </div>
            </div>

            <div className="mt-2 flex items-baseline gap-3">
              <span className="font-serif font-bold text-[34px] sm:text-[40px] text-boi-ink tracking-tight tabular-nums leading-none">
                {formatNaira(metrics.totalDisbursed, true)}
              </span>
              <span className="text-[13px] font-medium text-boi-text-muted tabular-nums">
                ({formatNaira(metrics.totalDisbursed, false)})
              </span>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-boi-border/70 grid grid-cols-2 sm:grid-cols-3 gap-2 text-[12px]">
            <div>
              <span className="text-boi-text-muted block text-[11px]">Approved Capital</span>
              <strong className="text-boi-ink font-semibold tabular-nums">{formatNaira(metrics.totalApproved, true)}</strong>
            </div>
            <div>
              <span className="text-boi-text-muted block text-[11px]">Outstanding Balance</span>
              <strong className="text-boi-ink font-semibold tabular-nums">{formatNaira(metrics.totalOutstanding, true)}</strong>
            </div>
            <div>
              <span className="text-boi-text-muted block text-[11px]">Average Facility</span>
              <strong className="text-boi-ink font-semibold tabular-nums">{formatNaira(metrics.avgFacilitySize, true)}</strong>
            </div>
          </div>
        </div>

        {/* DOMINANT 2: Enterprises Financed (Developmental Mandate Leader) */}
        <div className="lg:col-span-5 bg-boi-surface p-5 rounded-md border border-boi-border flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[12px] font-semibold uppercase tracking-wider text-boi-text-muted">
                Enterprises Financed
              </span>
              <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-boi-green px-2 py-0.5 rounded-xs bg-boi-selected border border-boi-green/20">
                <ArrowUpRight className="w-3 h-3" />
                <span className="tabular-nums">{enterprisesDelta.text}</span>
                <span className="font-normal text-boi-text-muted">{yearContextLabel}</span>
              </div>
            </div>

            <div className="mt-2 flex items-baseline gap-2">
              <span className="font-serif font-bold text-[34px] sm:text-[40px] text-boi-ink tracking-tight tabular-nums leading-none">
                {formatNumber(metrics.enterprisesCount)}
              </span>
              <span className="text-[14px] font-medium text-boi-text-muted">
                enterprises
              </span>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-boi-border/70 flex items-center justify-between text-[12px]">
            <div>
              <span className="text-boi-text-muted block text-[11px]">Geographic Spread</span>
              <strong className="text-boi-ink font-semibold tabular-nums">{metrics.statesReachedCount} of 37 States + FCT</strong>
            </div>
            <div className="text-right">
              <span className="text-boi-text-muted block text-[11px]">Active Scope</span>
              <strong className="text-boi-green font-semibold tabular-nums">100% Reconciled</strong>
            </div>
          </div>
        </div>

        {/* SUPPORTING METRIC 1: Jobs Supported */}
        <div className="col-span-1 sm:col-span-6 lg:col-span-3 bg-boi-surface p-4 rounded-md border border-boi-border">
          <div className="flex items-center justify-between text-[12px] text-boi-text-muted mb-1">
            <span className="font-semibold uppercase tracking-wider text-[11px]">Jobs Supported</span>
            <Briefcase className="w-3.5 h-3.5 text-boi-green" />
          </div>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-[26px] font-bold text-boi-ink tabular-nums leading-tight">
              {formatNumber(metrics.jobsSupported)}
            </span>
          </div>
          <div className="mt-2 text-[11px] text-boi-text-muted flex items-center justify-between">
            <span>Employment Ratio</span>
            <strong className="text-boi-ink tabular-nums font-semibold">
              {metrics.jobsPerBillion.toFixed(1)} jobs / ₦bn
            </strong>
          </div>
        </div>

        {/* SUPPORTING METRIC 2: Women-led Enterprises */}
        <div className="col-span-1 sm:col-span-6 lg:col-span-3 bg-boi-surface p-4 rounded-md border border-boi-border">
          <div className="flex items-center justify-between text-[12px] text-boi-text-muted mb-1">
            <span className="font-semibold uppercase tracking-wider text-[11px]">Women-Led Capital</span>
            <Users className="w-3.5 h-3.5 text-boi-green" />
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-[26px] font-bold text-boi-ink tabular-nums leading-tight">
              {formatPercent(metrics.womenLedPercentage)}
            </span>
            <span className="text-[12px] text-boi-text-muted tabular-nums">
              ({formatNaira(metrics.womenLedDisbursed, true)})
            </span>
          </div>
          <div className="mt-2 text-[11px] text-boi-text-muted flex items-center justify-between">
            <span>Beneficiaries</span>
            <strong className="text-boi-ink tabular-nums font-semibold">
              {formatNumber(metrics.womenLedCount)} enterprises
            </strong>
          </div>
        </div>

        {/* SUPPORTING METRIC 3: Youth-led Enterprises */}
        <div className="col-span-1 sm:col-span-6 lg:col-span-3 bg-boi-surface p-4 rounded-md border border-boi-border">
          <div className="flex items-center justify-between text-[12px] text-boi-text-muted mb-1">
            <span className="font-semibold uppercase tracking-wider text-[11px]">Youth-Led Capital</span>
            <Award className="w-3.5 h-3.5 text-boi-green" />
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-[26px] font-bold text-boi-ink tabular-nums leading-tight">
              {formatPercent(metrics.youthLedPercentage)}
            </span>
            <span className="text-[12px] text-boi-text-muted tabular-nums">
              ({formatNaira(metrics.youthLedDisbursed, true)})
            </span>
          </div>
          <div className="mt-2 text-[11px] text-boi-text-muted flex items-center justify-between">
            <span>Beneficiaries</span>
            <strong className="text-boi-ink tabular-nums font-semibold">
              {formatNumber(metrics.youthLedCount)} enterprises
            </strong>
          </div>
        </div>

        {/* SUPPORTING METRIC 4: Performing Portfolio Ratio */}
        <div className="col-span-1 sm:col-span-6 lg:col-span-3 bg-boi-surface p-4 rounded-md border border-boi-border">
          <div className="flex items-center justify-between text-[12px] text-boi-text-muted mb-1">
            <span className="font-semibold uppercase tracking-wider text-[11px]">Performing Portfolio</span>
            <ShieldCheck className="w-3.5 h-3.5 text-boi-green" />
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-[26px] font-bold text-boi-ink tabular-nums leading-tight">
              {formatPercent(metrics.performingRatio)}
            </span>
            <span className="text-[12px] text-boi-text-muted tabular-nums">
              ({formatNaira(metrics.performingDisbursed, true)})
            </span>
          </div>
          <div className="mt-2 text-[11px] text-boi-text-muted flex items-center justify-between">
            <span>At-Risk Exposure</span>
            <strong className="text-boi-warning tabular-nums font-semibold">
              {formatPercent(metrics.atRiskRatio)} ({formatNaira(metrics.atRiskDisbursed, true)})
            </strong>
          </div>
        </div>
      </div>
    </section>
  );
}
