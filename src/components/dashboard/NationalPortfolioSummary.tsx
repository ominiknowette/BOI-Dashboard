"use client";

import React from "react";
import { AggregatedMetrics, PersonaRole } from "@/types/dataset";
import { formatNairaFull, formatNairaCompact, formatNumber, formatPercent } from "@/lib/utils/formatters";
import { ArrowUpRight, ArrowDownRight, ShieldCheck, MapPin, Briefcase, Activity } from "lucide-react";

interface NationalPortfolioSummaryProps {
  metrics: AggregatedMetrics;
  persona: PersonaRole;
}

export function NationalPortfolioSummary({ metrics, persona }: NationalPortfolioSummaryProps) {
  const repaidAmount = Math.max(0, metrics.totalDisbursed - metrics.totalOutstanding);
  const repaymentRate = metrics.totalDisbursed > 0 ? (repaidAmount / metrics.totalDisbursed) * 100 : 0;

  return (
    <section aria-labelledby="portfolio-summary-heading" className="bg-white border border-[#DDE5DF] rounded-md shadow-sm overflow-hidden mb-6">
      {/* Header Band */}
      <div className="bg-[#FAFBF9] px-5 py-3.5 border-b border-[#DDE5DF] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-[#0B6B4F]" aria-hidden="true" />
          <h2 id="portfolio-summary-heading" className="text-sm font-semibold text-[#17201C] tracking-wide uppercase">
            National Development-Finance Summary &amp; Capital Position
          </h2>
        </div>
        <div className="flex items-center gap-3 text-xs text-[#667169]">
          <span className="inline-flex items-center gap-1 font-medium text-[#0B4738]">
            <MapPin className="w-3.5 h-3.5 text-[#0B6B4F]" aria-hidden="true" />
            <span className="tabular-nums font-semibold">{metrics.statesReachedCount}</span> / 37 Territories Active
          </span>
          <span className="hidden sm:inline text-[#DDE5DF]">|</span>
          <span className="tabular-nums">
            Total Records: <strong className="text-[#17201C]">{formatNumber(metrics.recordsCount)}</strong>
          </span>
        </div>
      </div>

      {/* Grid of Analytical Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 divide-x divide-y md:divide-y-0 divide-[#DDE5DF]">
        {/* Total Disbursed */}
        <div className="p-4 bg-white">
          <span className="text-[11px] font-semibold tracking-wider text-[#667169] uppercase block mb-1">
            Total Disbursed
          </span>
          <span className="text-base sm:text-lg font-bold text-[#0B4738] tabular-nums block font-serif">
            {formatNairaCompact(metrics.totalDisbursed)}
          </span>
          <span className="text-[11px] text-[#667169] tabular-nums block mt-1" title={formatNairaFull(metrics.totalDisbursed)}>
            Exact: {formatNairaFull(metrics.totalDisbursed)}
          </span>
        </div>

        {/* Outstanding Balance */}
        <div className="p-4 bg-white">
          <span className="text-[11px] font-semibold tracking-wider text-[#667169] uppercase block mb-1">
            Principal Outstanding
          </span>
          <span className="text-base sm:text-lg font-bold text-[#17201C] tabular-nums block">
            {formatNairaCompact(metrics.totalOutstanding)}
          </span>
          <span className="text-[11px] text-[#667169] tabular-nums block mt-1">
            Repaid: {formatPercent(repaymentRate)} of principal
          </span>
        </div>

        {/* Average Facility Size */}
        <div className="p-4 bg-white">
          <span className="text-[11px] font-semibold tracking-wider text-[#667169] uppercase block mb-1">
            Avg Facility Size
          </span>
          <span className="text-base sm:text-lg font-bold text-[#17201C] tabular-nums block">
            {formatNairaCompact(metrics.avgFacilitySize)}
          </span>
          <span className="text-[11px] text-[#667169] tabular-nums block mt-1">
            Across {formatNumber(metrics.enterprisesCount)} enterprises
          </span>
        </div>

        {/* Total Jobs Supported */}
        <div className="p-4 bg-white">
          <span className="text-[11px] font-semibold tracking-wider text-[#667169] uppercase block mb-1">
            Direct &amp; Indirect Jobs
          </span>
          <span className="text-base sm:text-lg font-bold text-[#17201C] tabular-nums block">
            {formatNumber(metrics.jobsSupported)}
          </span>
          <span className="text-[11px] text-[#667169] tabular-nums block mt-1">
            ~{Math.round(metrics.jobsSupported / Math.max(1, metrics.enterprisesCount))} jobs / enterprise
          </span>
        </div>

        {/* Job Intensity */}
        <div className="p-4 bg-white">
          <span className="text-[11px] font-semibold tracking-wider text-[#667169] uppercase block mb-1">
            Jobs / ₦1B Deployed
          </span>
          <span className="text-base sm:text-lg font-bold text-[#0B6B4F] tabular-nums block">
            {Math.round(metrics.jobsPerBillion)} <span className="text-xs font-normal text-[#667169]">jobs</span>
          </span>
          <span className="text-[11px] text-[#667169] block mt-1">
            Development multiplier
          </span>
        </div>

        {/* Prior Period Delta */}
        <div className="p-4 bg-white">
          <span className="text-[11px] font-semibold tracking-wider text-[#667169] uppercase block mb-1">
            YoY Capital Growth
          </span>
          <div className="flex items-center gap-1.5 mt-0.5">
            {metrics.priorPeriodChange.disbursedDeltaPercent >= 0 ? (
              <span className="inline-flex items-center text-xs font-semibold text-[#0B6B4F] tabular-nums">
                <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                +{metrics.priorPeriodChange.disbursedDeltaPercent}%
              </span>
            ) : (
              <span className="inline-flex items-center text-xs font-semibold text-[#B33A3A] tabular-nums">
                <ArrowDownRight className="w-3.5 h-3.5" aria-hidden="true" />
                {metrics.priorPeriodChange.disbursedDeltaPercent}%
              </span>
            )}
            <span className="text-[11px] text-[#667169]">vs prior cycle</span>
          </div>
          <span className="text-[10px] text-[#667169] tabular-nums block mt-1">
            Jobs delta: {metrics.priorPeriodChange.jobsDeltaPercent >= 0 ? "+" : ""}{metrics.priorPeriodChange.jobsDeltaPercent}%
          </span>
        </div>
      </div>

      {/* Role-Specific Institutional Commentary */}
      <div className="bg-[#EDF5F1] px-5 py-2.5 border-t border-[#DDE5DF] text-xs text-[#0B4738] flex items-start sm:items-center gap-2">
        <ShieldCheck className="w-4 h-4 text-[#0B6B4F] shrink-0 mt-0.5 sm:mt-0" aria-hidden="true" />
        <div className="flex-1">
          {persona === "Executive Management" && (
            <p>
              <strong>Executive Brief:</strong> Strategic capital distribution remains on track with{" "}
              <span className="font-semibold tabular-nums">{formatPercent(metrics.performingRatio)}</span> portfolio performing status. Principal recovery is{" "}
              <span className="font-semibold tabular-nums">{formatPercent(repaymentRate)}</span> against active credit lines.
            </p>
          )}
          {persona === "Impact & Strategy" && (
            <p>
              <strong>Impact &amp; Strategy Focus:</strong> Inclusion targets reflect{" "}
              <span className="font-semibold tabular-nums">{formatPercent(metrics.womenLedPercentage)}</span> female enterprise participation and{" "}
              <span className="font-semibold tabular-nums">{formatPercent(metrics.youthLedPercentage)}</span> youth-led financing with a national multiplier of{" "}
              <span className="font-semibold tabular-nums">{Math.round(metrics.jobsPerBillion)}</span> jobs per billion naira.
            </p>
          )}
          {persona === "Development Partner" && (
            <p>
              <strong>Partner Additionality:</strong> Co-financing leverage indicates catalytic additionality across sub-national commercial corridors, with{" "}
              <span className="font-semibold tabular-nums">{metrics.statesReachedCount}</span> territories covered under standard institutional governance covenants.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
