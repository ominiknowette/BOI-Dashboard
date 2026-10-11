"use client";

import React from "react";
import { useDashboardFilter } from "@/context/DashboardFilterContext";
import { SectorAllocationCard } from "@/components/redesign/SectorAllocationCard";
import { EmptyState } from "@/components/common/EmptyState";
import { formatNairaCompact, formatPercent, formatNumber } from "@/lib/utils/formatters";
import { Factory, TrendingUp, Users, Cpu, ShieldCheck } from "lucide-react";
import { Sector } from "@/types/dataset";

export default function SectorsPage() {
  const {
    filteredRecords,
    metrics,
    sectorSummary,
    filters,
    handleSelectSector,
    handleResetFilters,
  } = useDashboardFilter();

  if (filteredRecords.length === 0) {
    return <EmptyState onReset={handleResetFilters} />;
  }

  // Calculate sector efficiency
  const sortedSectors = [...sectorSummary].sort((a, b) => b.disbursed - a.disbursed);

  const manufacturing = sectorSummary.find((s) => s.sector === "Manufacturing");
  const agro = sectorSummary.find((s) => s.sector === "Agro-processing");
  const tech = sectorSummary.find((s) => s.sector === "Technology / Digital Economy");

  return (
    <div className="space-y-6">
      {/* Sector Pillar Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white rounded-card p-5 border border-border shadow-card">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold text-deep-green uppercase tracking-wider bg-soft-green px-2.5 py-1 rounded-md">
              Primary Industrial Driver
            </span>
            <Factory className="w-4 h-4 text-deep-green" />
          </div>
          <h4 className="text-base font-bold text-ink mb-1">
            Manufacturing
          </h4>
          <div className="text-2xl font-bold text-deep-green tabular-nums mb-2">
            {formatNairaCompact(manufacturing?.disbursed || 0)}
          </div>
          <div className="text-xs text-ink-muted flex justify-between pt-2 border-t border-border/60">
            <span>Jobs Generated:</span>
            <span className="font-semibold text-ink tabular-nums">
              {formatNumber(manufacturing?.jobs || 0)}
            </span>
          </div>
        </div>

        <div className="bg-white rounded-card p-5 border border-border shadow-card">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold text-[#1B4F72] uppercase tracking-wider bg-[#EBF5FB] px-2.5 py-1 rounded-md">
              Food Security & Rural Value Chain
            </span>
            <TrendingUp className="w-4 h-4 text-[#1B4F72]" />
          </div>
          <h4 className="text-base font-bold text-ink mb-1">
            Agro-Processing
          </h4>
          <div className="text-2xl font-bold text-ink tabular-nums mb-2">
            {formatNairaCompact(agro?.disbursed || 0)}
          </div>
          <div className="text-xs text-ink-muted flex justify-between pt-2 border-t border-border/60">
            <span>Jobs Generated:</span>
            <span className="font-semibold text-ink tabular-nums">
              {formatNumber(agro?.jobs || 0)}
            </span>
          </div>
        </div>

        <div className="bg-white rounded-card p-5 border border-border shadow-card">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold text-gold-accent uppercase tracking-wider bg-[#FDF8EE] px-2.5 py-1 rounded-md">
              Future Economy & Innovation
            </span>
            <Cpu className="w-4 h-4 text-gold-accent" />
          </div>
          <h4 className="text-base font-bold text-ink mb-1">
            Technology & Digital Economy
          </h4>
          <div className="text-2xl font-bold text-ink tabular-nums mb-2">
            {formatNairaCompact(tech?.disbursed || 0)}
          </div>
          <div className="text-xs text-ink-muted flex justify-between pt-2 border-t border-border/60">
            <span>Enterprises Supported:</span>
            <span className="font-semibold text-ink tabular-nums">
              {formatNumber(tech?.enterprises || 0)}
            </span>
          </div>
        </div>
      </div>

      {/* Main Sector Allocation Interactive Card */}
      <SectorAllocationCard
        sectors={sectorSummary}
        totalDisbursed={metrics.totalDisbursed}
        totalEnterprises={metrics.enterprisesCount}
        totalJobs={metrics.jobsSupported}
        selectedSector={filters.sector as Sector | "all"}
        onSelectSector={handleSelectSector}
      />

      {/* Sector Employment & Efficiency Analysis */}
      <div className="bg-white rounded-card p-5 border border-border shadow-card">
        <h3 className="text-base font-bold text-ink mb-1">
          Sector Capital Intensity vs Job Creation Elasticity
        </h3>
        <p className="text-xs text-ink-muted mb-4">
          Analysis of direct jobs generated per ₦100 million in disbursed facility capital
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-border text-ink-muted font-bold text-[11px] uppercase tracking-wider">
                <th className="py-2.5 px-3">Sector</th>
                <th className="py-2.5 px-3 text-right">Disbursed</th>
                <th className="py-2.5 px-3 text-right">Enterprises</th>
                <th className="py-2.5 px-3 text-right">Jobs Created</th>
                <th className="py-2.5 px-3 text-right">Jobs / ₦100m</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {sortedSectors.map((s) => {
                const jobsPer100m =
                  s.disbursed > 0
                    ? Math.round((s.jobs / s.disbursed) * 100_000_000)
                    : 0;

                const isSelected = filters.sector === s.sector;

                return (
                  <tr
                    key={s.sector}
                    className={`hover:bg-[#F9FAFB] transition-colors ${
                      isSelected ? "bg-soft-green/20" : ""
                    }`}
                  >
                    <td className="py-3 px-3 font-semibold text-ink">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-deep-green shrink-0" />
                        <span>{s.sector}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-right font-medium tabular-nums">
                      {formatNairaCompact(s.disbursed)}
                    </td>
                    <td className="py-3 px-3 text-right font-medium tabular-nums">
                      {formatNumber(s.enterprises)}
                    </td>
                    <td className="py-3 px-3 text-right font-medium tabular-nums">
                      {formatNumber(s.jobs)}
                    </td>
                    <td className="py-3 px-3 text-right font-bold text-deep-green tabular-nums">
                      {jobsPer100m} jobs
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        type="button"
                        onClick={() =>
                          handleSelectSector(isSelected ? "all" : (s.sector as Sector))
                        }
                        className={`text-[11px] font-bold px-2 py-1 rounded transition-colors ${
                          isSelected
                            ? "bg-deep-green text-white"
                            : "bg-[#F2F4F7] text-ink-muted hover:text-ink hover:bg-border"
                        }`}
                      >
                        {isSelected ? "Selected" : "Filter"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
