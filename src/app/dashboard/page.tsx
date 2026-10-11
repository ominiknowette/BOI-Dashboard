"use client";

import React from "react";
import Link from "next/link";
import { useDashboardFilter } from "@/context/DashboardFilterContext";
import { KpiCluster } from "@/components/redesign/KpiCluster";
import { PortfolioTrajectoryCard } from "@/components/redesign/PortfolioTrajectoryCard";
import { PrudentialRiskCard } from "@/components/redesign/PrudentialRiskCard";
import { EnterpriseScaleBubbleCard } from "@/components/redesign/EnterpriseScaleBubbleCard";
import { EmptyState } from "@/components/common/EmptyState";
import {
  MapPin,
  Factory,
  Target,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Users,
} from "lucide-react";
import { formatNairaCompact, formatPercent, formatNumber } from "@/lib/utils/formatters";

export default function ExecutiveDashboardPage() {
  const {
    filteredRecords,
    metrics,
    filters,
    timeSeries,
    timeGranularity,
    setTimeGranularity,
    portfolioStatusSummary,
    segmentSummary,
    zoneSummary,
    sectorSummary,
    strategicThemeSummary,
    handleResetFilters,
  } = useDashboardFilter();

  if (filteredRecords.length === 0) {
    return <EmptyState onReset={handleResetFilters} />;
  }

  // Top 3 zones for executive summary preview
  const topZones = [...zoneSummary].sort((a, b) => b.disbursed - a.disbursed).slice(0, 3);

  // Top 3 sectors for executive summary preview
  const topSectors = [...sectorSummary].sort((a, b) => b.disbursed - a.disbursed).slice(0, 3);

  // Top 3 strategic themes for executive summary preview
  const topThemes = [...strategicThemeSummary].sort((a, b) => b.disbursed - a.disbursed).slice(0, 3);

  return (
    <div className="space-y-6">
      {/* FIRST VIEWPORT: Signature 2-Column Grid Matching PinenMFB Composition */}
      <section
        aria-label="Executive Performance and Portfolio Trajectory"
        className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch"
      >
        {/* Left Column (8 cols): 2x2 KpiCluster (Top) + PortfolioTrajectoryCard Grouped Bars (Bottom) */}
        <div className="lg:col-span-8 flex flex-col gap-5 justify-between">
          <KpiCluster metrics={metrics} selectedYear={filters.year} />
          <PortfolioTrajectoryCard
            timeSeries={timeSeries}
            granularity={timeGranularity}
            onGranularityChange={setTimeGranularity}
          />
        </div>

        {/* Right Column (4 cols): PrudentialRiskCard Donut (Top) + EnterpriseScaleBubbleCard D3 Bubbles (Bottom) */}
        <div className="lg:col-span-4 flex flex-col gap-5 justify-between">
          <PrudentialRiskCard
            portfolioStatus={portfolioStatusSummary}
            totalDisbursed={metrics.totalDisbursed}
          />
          <EnterpriseScaleBubbleCard
            segments={segmentSummary}
            totalDisbursed={metrics.totalDisbursed}
          />
        </div>
      </section>

      {/* EXECUTIVE MANDATE DRILL-DOWN TEASERS */}
      <section
        aria-label="Mandate Analytical Portals"
        className="grid grid-cols-1 md:grid-cols-3 gap-5"
      >
        {/* 1. Geographic Allocation Teaser */}
        <div className="bg-white rounded-card p-5 border border-border shadow-card flex flex-col justify-between hover:border-primary-green/40 transition-colors">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-8 h-8 rounded-lg bg-soft-green flex items-center justify-center text-deep-green">
                <MapPin className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-bold text-ink-muted uppercase tracking-wider">
                36 States + FCT
              </span>
            </div>
            <h3 className="text-sm font-bold text-ink mb-1">
              Geographic Deployment
            </h3>
            <p className="text-xs text-ink-muted mb-4">
              Equitable national distribution across all 6 geopolitical zones and states.
            </p>

            <div className="space-y-2 mb-4">
              {topZones.map((z) => (
                <div key={z.zone} className="flex items-center justify-between text-xs">
                  <span className="text-ink font-medium truncate">{z.zone}</span>
                  <span className="font-semibold text-deep-green tabular-nums">
                    {formatNairaCompact(z.disbursed)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <Link
            href="/dashboard/geography"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-deep-green hover:text-primary-green hover:underline pt-3 border-t border-border/60"
          >
            <span>Explore Sub-National Allocation</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* 2. Real Sector Deployment Teaser */}
        <div className="bg-white rounded-card p-5 border border-border shadow-card flex flex-col justify-between hover:border-primary-green/40 transition-colors">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-8 h-8 rounded-lg bg-[#EBF5FB] flex items-center justify-center text-[#1B4F72]">
                <Factory className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-bold text-ink-muted uppercase tracking-wider">
                10 Real Sectors
              </span>
            </div>
            <h3 className="text-sm font-bold text-ink mb-1">
              Real-Sector Deployment
            </h3>
            <p className="text-xs text-ink-muted mb-4">
              Industrial transformation, value-add manufacturing, and agro-processing.
            </p>

            <div className="space-y-2 mb-4">
              {topSectors.map((s) => (
                <div key={s.sector} className="flex items-center justify-between text-xs">
                  <span className="text-ink font-medium truncate">{s.sector}</span>
                  <span className="font-semibold text-deep-green tabular-nums">
                    {formatNairaCompact(s.disbursed)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <Link
            href="/dashboard/sectors"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-deep-green hover:text-primary-green hover:underline pt-3 border-t border-border/60"
          >
            <span>Explore Sector Deployment</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* 3. Strategic Mandate Pillars Teaser */}
        <div className="bg-white rounded-card p-5 border border-border shadow-card flex flex-col justify-between hover:border-primary-green/40 transition-colors">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-8 h-8 rounded-lg bg-[#FDF8EE] flex items-center justify-center text-gold-accent">
                <Target className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-bold text-ink-muted uppercase tracking-wider">
                6 Mandate Pillars
              </span>
            </div>
            <h3 className="text-sm font-bold text-ink mb-1">
              Strategic Priorities
            </h3>
            <p className="text-xs text-ink-muted mb-4">
              Job creation, gender parity, export expansion, and MSME competitiveness.
            </p>

            <div className="space-y-2 mb-4">
              {topThemes.map((t) => (
                <div key={t.theme} className="flex items-center justify-between text-xs">
                  <span className="text-ink font-medium truncate">{t.theme}</span>
                  <span className="font-semibold text-deep-green tabular-nums">
                    {formatNairaCompact(t.disbursed)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <Link
            href="/dashboard/strategic-themes"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-deep-green hover:text-primary-green hover:underline pt-3 border-t border-border/60"
          >
            <span>Explore Strategic Mandate</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
