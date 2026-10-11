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
} from "lucide-react";
import { formatNairaCompact, formatPercent, formatNumber } from "@/lib/utils/formatters";

export default function DashboardView() {
  const {
    filteredRecords,
    metrics,
    filters,
    timeSeries,
    timeGranularity,
    setTimeGranularity,
    portfolioStatusSummary,
    segmentSummary,
    handleResetFilters,
  } = useDashboardFilter();

  if (filteredRecords.length === 0) {
    return <EmptyState onReset={handleResetFilters} />;
  }

  return (
    <div className="space-y-6">
      {/* 1. Core Mandate KPI Cluster (5 Strategic Institutional Metrics) */}
      <section aria-labelledby="kpi-heading">
        <h2 id="kpi-heading" className="sr-only">
          Mandate Key Performance Indicators
        </h2>
        <KpiCluster metrics={metrics} />
      </section>

      {/* 2. Primary Analytics Grid: Trajectory & Prudential Risk */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Left: Portfolio Trajectory (Disbursements & Job Creation Trends) */}
        <div className="lg:col-span-8 flex flex-col">
          <PortfolioTrajectoryCard
            timeSeries={timeSeries}
            granularity={timeGranularity}
            onGranularityChange={setTimeGranularity}
          />
        </div>

        {/* Right: Portfolio & Prudential Risk Distribution */}
        <div className="lg:col-span-4 flex flex-col">
          <PrudentialRiskCard
            portfolioStatus={portfolioStatusSummary}
            totalDisbursed={metrics.totalDisbursed}
          />
        </div>
      </div>

      {/* 3. Enterprise Scale Visualisation (MSME Tier Breakdown) */}
      <section aria-labelledby="scale-heading">
        <h2 id="scale-heading" className="sr-only">
          Enterprise Scale & MSME Distribution
        </h2>
        <EnterpriseScaleBubbleCard
          segments={segmentSummary}
          totalDisbursed={metrics.totalDisbursed}
        />
      </section>

      {/* 4. Strategic Drill-Down Quick Navigation Band */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Geography Card */}
        <Link
          href="/dashboard/geography"
          className="bg-white rounded-card p-5 border border-border shadow-card hover:border-primary-green/50 hover:shadow-md transition-all group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-tile bg-soft-green/50 flex items-center justify-center text-deep-green group-hover:bg-primary-green group-hover:text-white transition-colors">
                <MapPin className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-bold text-primary-green uppercase tracking-wider flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                Explore <ArrowRight className="w-3 h-3" />
              </span>
            </div>
            <h3 className="font-bold text-sm text-ink mb-1">
              Geographic Allocation
            </h3>
            <p className="text-xs text-ink-muted leading-relaxed">
              Explore national sub-national distribution across 36 states and the FCT with geopolitical zone aggregations.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between text-[11px] font-medium text-ink-muted">
            <span>Active States: {filters.state ? filters.state : "36 + FCT"}</span>
            <span className="text-ink font-semibold">{formatNairaCompact(metrics.totalDisbursed)}</span>
          </div>
        </Link>

        {/* Sectors Card */}
        <Link
          href="/dashboard/sectors"
          className="bg-white rounded-card p-5 border border-border shadow-card hover:border-primary-green/50 hover:shadow-md transition-all group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-tile bg-soft-green/50 flex items-center justify-center text-deep-green group-hover:bg-primary-green group-hover:text-white transition-colors">
                <Factory className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-bold text-primary-green uppercase tracking-wider flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                Explore <ArrowRight className="w-3 h-3" />
              </span>
            </div>
            <h3 className="font-bold text-sm text-ink mb-1">
              Real-Sector Allocation
            </h3>
            <p className="text-xs text-ink-muted leading-relaxed">
              Analyze capital deployment across 10 priority industrial sectors including agro-processing, healthcare, and tech.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between text-[11px] font-medium text-ink-muted">
            <span>Priority Sectors: {filters.sector ? filters.sector : "10 Sectors"}</span>
            <span className="text-ink font-semibold">{formatNumber(metrics.enterprisesCount)} units</span>
          </div>
        </Link>

        {/* Strategic Themes Card */}
        <Link
          href="/dashboard/strategic-themes"
          className="bg-white rounded-card p-5 border border-border shadow-card hover:border-primary-green/50 hover:shadow-md transition-all group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-tile bg-soft-green/50 flex items-center justify-center text-deep-green group-hover:bg-primary-green group-hover:text-white transition-colors">
                <Target className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-bold text-primary-green uppercase tracking-wider flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                Explore <ArrowRight className="w-3 h-3" />
              </span>
            </div>
            <h3 className="font-bold text-sm text-ink mb-1">
              Strategic Mandate Themes
            </h3>
            <p className="text-xs text-ink-muted leading-relaxed">
              Track progress against industrialization, women-led business equity, youth job generation, and green transition.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between text-[11px] font-medium text-ink-muted">
            <span>Women Share: {formatPercent(metrics.womenLedPercentage)}</span>
            <span className="text-ink font-semibold">{formatNumber(metrics.jobsSupported)} jobs</span>
          </div>
        </Link>
      </div>
    </div>
  );
}
