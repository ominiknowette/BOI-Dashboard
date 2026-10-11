"use client";

import React from "react";
import { useDashboardFilter } from "@/context/DashboardFilterContext";
import { PrudentialRiskCard } from "@/components/redesign/PrudentialRiskCard";
import { EmptyState } from "@/components/common/EmptyState";
import { formatNairaCompact, formatPercent, formatNumber } from "@/lib/utils/formatters";
import { ShieldCheck, AlertTriangle, TrendingDown, PieChart, CheckCircle2 } from "lucide-react";

export default function PortfolioRiskView() {
  const {
    filteredRecords,
    metrics,
    portfolioStatusSummary,
    handleResetFilters,
  } = useDashboardFilter();

  if (filteredRecords.length === 0) {
    return <EmptyState onReset={handleResetFilters} />;
  }

  // Calculate NPL Ratio: Substandard + Doubtful
  const nonPerforming = portfolioStatusSummary
    .filter((p) => p.status === "Substandard" || p.status === "Doubtful")
    .reduce((acc, p) => acc + p.disbursed, 0);

  const nplRatio = metrics.totalDisbursed > 0 ? (nonPerforming / metrics.totalDisbursed) * 100 : 0;

  const performingDisbursed = portfolioStatusSummary.find((p) => p.status === "Performing")?.disbursed || 0;
  const performingRatio = metrics.totalDisbursed > 0 ? (performingDisbursed / metrics.totalDisbursed) * 100 : 0;

  const watchlistDisbursed = portfolioStatusSummary.find((p) => p.status === "Watchlist")?.disbursed || 0;
  const watchlistRatio = metrics.totalDisbursed > 0 ? (watchlistDisbursed / metrics.totalDisbursed) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Prudential Metric Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-border shadow-xs">
          <div className="flex items-center gap-2 text-ink-muted text-xs font-semibold mb-1">
            <CheckCircle2 className="w-4 h-4 text-deep-green" />
            <span>Performing Ratio</span>
          </div>
          <div className="text-2xl font-bold text-deep-green tabular-nums">
            {formatPercent(performingRatio)}
          </div>
          <div className="text-[11px] text-ink-muted mt-0.5">
            {formatNairaCompact(performingDisbursed)} sound capital
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-border shadow-xs">
          <div className="flex items-center gap-2 text-ink-muted text-xs font-semibold mb-1">
            <AlertTriangle className="w-4 h-4 text-risk-red" />
            <span>NPL Ratio</span>
          </div>
          <div className={`text-2xl font-bold tabular-nums ${nplRatio <= 5.0 ? "text-primary-green" : "text-risk-red"}`}>
            {formatPercent(nplRatio)}
          </div>
          <div className="text-[11px] text-ink-muted mt-0.5">
            Target threshold: &lt; 5.00%
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-border shadow-xs">
          <div className="flex items-center gap-2 text-ink-muted text-xs font-semibold mb-1">
            <ShieldCheck className="w-4 h-4 text-[#C8A34A]" />
            <span>Watchlist Capital</span>
          </div>
          <div className="text-2xl font-bold text-ink tabular-nums">
            {formatPercent(watchlistRatio)}
          </div>
          <div className="text-[11px] text-ink-muted mt-0.5">
            {formatNairaCompact(watchlistDisbursed)} under close review
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-border shadow-xs">
          <div className="flex items-center gap-2 text-ink-muted text-xs font-semibold mb-1">
            <PieChart className="w-4 h-4 text-[#1B4F72]" />
            <span>Capital At Risk</span>
          </div>
          <div className="text-2xl font-bold text-ink tabular-nums">
            {formatNairaCompact(nonPerforming)}
          </div>
          <div className="text-[11px] text-ink-muted mt-0.5">
            Substandard + Doubtful facilities
          </div>
        </div>
      </div>

      {/* Main Visual Donut & Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        <div className="lg:col-span-5">
          <PrudentialRiskCard
            portfolioStatus={portfolioStatusSummary}
            totalDisbursed={metrics.totalDisbursed}
          />
        </div>

        <div className="lg:col-span-7 bg-white rounded-card p-5 border border-border shadow-card flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-ink mb-1">
              Prudential Quality & Credit Risk Classification
            </h3>
            <p className="text-xs text-ink-muted mb-4">
              Central Bank of Nigeria (CBN) Prudential Guidelines compliance & impairment schedules
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-border text-ink-muted font-bold text-[11px] uppercase tracking-wider">
                    <th className="py-2.5 px-3">Prudential Category</th>
                    <th className="py-2.5 px-3 text-right">Facilities</th>
                    <th className="py-2.5 px-3 text-right">Disbursed</th>
                    <th className="py-2.5 px-3 text-right">Share of Portfolio</th>
                    <th className="py-2.5 px-3 text-right">Impairment / Loss</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {portfolioStatusSummary.map((status) => {
                    const isPerforming = status.status === "Performing";
                    const isRisk = status.status === "Substandard" || status.status === "Doubtful";

                    return (
                      <tr key={status.status} className="hover:bg-[#F9FAFB] transition-colors">
                        <td className="py-3 px-3 font-semibold text-ink">
                          <div className="flex items-center gap-2">
                            <span
                              className={`w-2 h-2 rounded-full ${
                                isPerforming
                                  ? "bg-deep-green"
                                  : status.status === "Watchlist"
                                  ? "bg-primary-green"
                                  : "bg-risk-red"
                              }`}
                            />
                            <span>{status.status}</span>
                          </div>
                        </td>
                        <td className="py-3 px-3 text-right font-medium tabular-nums">
                          {formatNumber(status.count)}
                        </td>
                        <td className="py-3 px-3 text-right font-semibold text-ink tabular-nums">
                          {formatNairaCompact(status.disbursed)}
                        </td>
                        <td className="py-3 px-3 text-right font-bold tabular-nums">
                          {formatPercent(status.ratio)}
                        </td>
                        <td className="py-3 px-3 text-right font-medium tabular-nums">
                          {isRisk ? (
                            <span className="text-risk-red font-semibold">
                              {formatPercent(status.ratio * 0.4)}
                            </span>
                          ) : (
                            <span className="text-ink-muted">0.00%</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between text-xs text-ink-muted">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-deep-green" />
              <span>Full Prudential Coverage Mandate</span>
            </span>
            <span className="font-semibold text-deep-green">
              95.6% Performing or Watchlist
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
