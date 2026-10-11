"use client";

import React from "react";
import { useDashboardFilter } from "@/context/DashboardFilterContext";
import { GeographicAnalysisCard } from "@/components/redesign/GeographicAnalysisCard";
import { EmptyState } from "@/components/common/EmptyState";
import { formatNairaCompact, formatPercent, formatNumber } from "@/lib/utils/formatters";
import { MapPin, Building, Users, Briefcase } from "lucide-react";
import { GeopoliticalZone } from "@/types/dataset";

export default function GeographyView() {
  const {
    filteredRecords,
    metrics,
    stateSummary,
    zoneSummary,
    filters,
    handleSelectState,
    handleSelectZone,
    handleResetFilters,
  } = useDashboardFilter();

  if (filteredRecords.length === 0) {
    return <EmptyState onReset={handleResetFilters} />;
  }

  // Calculate zone metrics
  const sortedZones = [...zoneSummary].sort((a, b) => b.disbursed - a.disbursed);

  return (
    <div className="space-y-6">
      {/* Overview Stat Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-border shadow-xs">
          <div className="flex items-center gap-2 text-ink-muted text-xs font-semibold mb-1">
            <Building className="w-4 h-4 text-deep-green" />
            <span>Total Disbursed</span>
          </div>
          <div className="text-xl font-bold text-ink tabular-nums">
            {formatNairaCompact(metrics.totalDisbursed)}
          </div>
          <div className="text-[11px] text-ink-muted mt-0.5">
            Across 36 States + FCT
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-border shadow-xs">
          <div className="flex items-center gap-2 text-ink-muted text-xs font-semibold mb-1">
            <MapPin className="w-4 h-4 text-primary-green" />
            <span>Active States</span>
          </div>
          <div className="text-xl font-bold text-ink tabular-nums">
            {stateSummary.filter((s) => s.disbursed > 0).length}{" "}
            <span className="text-xs font-normal text-ink-muted">/ 37</span>
          </div>
          <div className="text-[11px] text-ink-muted mt-0.5">
            100% Territorial Coverage
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-border shadow-xs">
          <div className="flex items-center gap-2 text-ink-muted text-xs font-semibold mb-1">
            <Users className="w-4 h-4 text-[#1B4F72]" />
            <span>Enterprises Supported</span>
          </div>
          <div className="text-xl font-bold text-ink tabular-nums">
            {formatNumber(metrics.enterprisesCount)}
          </div>
          <div className="text-[11px] text-ink-muted mt-0.5">
            Direct Beneficiaries
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-border shadow-xs">
          <div className="flex items-center gap-2 text-ink-muted text-xs font-semibold mb-1">
            <Briefcase className="w-4 h-4 text-gold-accent" />
            <span>Jobs Created / Sustained</span>
          </div>
          <div className="text-xl font-bold text-ink tabular-nums">
            {formatNumber(metrics.jobsSupported)}
          </div>
          <div className="text-[11px] text-ink-muted mt-0.5">
            National Labor Impact
          </div>
        </div>
      </div>

      {/* Main Interactive Map & State Analysis */}
      <GeographicAnalysisCard
        statesData={stateSummary}
        zonesData={zoneSummary}
        totalDisbursed={metrics.totalDisbursed}
        selectedState={filters.state}
        onSelectState={handleSelectState}
        selectedZone={filters.zone as GeopoliticalZone | "all"}
        onSelectZone={handleSelectZone}
      />

      {/* Geopolitical Zone Comparison Grid */}
      <div className="bg-white rounded-card p-5 border border-border shadow-card">
        <h3 className="text-base font-bold text-ink mb-1">
          Geopolitical Zone Performance Matrix
        </h3>
        <p className="text-xs text-ink-muted mb-4">
          Comparative capital deployment, enterprise distribution, and employment creation by zone
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedZones.map((z) => {
            const share =
              metrics.totalDisbursed > 0
                ? (z.disbursed / metrics.totalDisbursed) * 100
                : 0;

            const isSelected = filters.zone === z.zone;

            return (
              <div
                key={z.zone}
                onClick={() =>
                  handleSelectZone(isSelected ? "all" : (z.zone as GeopoliticalZone))
                }
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? "border-deep-green bg-soft-green/20 ring-1 ring-deep-green"
                    : "border-border hover:border-deep-green/40 bg-surface"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-sm text-ink">{z.zone}</span>
                  <span className="text-xs font-bold text-deep-green tabular-nums">
                    {formatPercent(share)}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between text-ink-muted">
                    <span>Disbursed:</span>
                    <span className="font-semibold text-ink tabular-nums">
                      {formatNairaCompact(z.disbursed)}
                    </span>
                  </div>
                  <div className="flex justify-between text-ink-muted">
                    <span>Enterprises:</span>
                    <span className="font-semibold text-ink tabular-nums">
                      {formatNumber(z.enterprises)}
                    </span>
                  </div>
                  <div className="flex justify-between text-ink-muted">
                    <span>Jobs Supported:</span>
                    <span className="font-semibold text-ink tabular-nums">
                      {formatNumber(z.jobs)}
                    </span>
                  </div>
                </div>

                {/* Micro progress bar */}
                <div className="w-full h-1.5 bg-[#F2F4F7] rounded-full overflow-hidden mt-3">
                  <div
                    className="h-full bg-deep-green rounded-full"
                    style={{ width: `${Math.min(100, Math.max(5, share * 2))}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
