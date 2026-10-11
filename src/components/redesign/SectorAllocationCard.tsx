"use client";

import React, { useState, useMemo } from "react";
import { SectorSummary, Sector } from "@/types/dataset";
import { formatNairaCompact, formatNumber, formatPercent } from "@/lib/utils/formatters";
import { Factory, ChevronRight } from "lucide-react";

interface SectorAllocationCardProps {
  sectors: SectorSummary[];
  totalDisbursed: number;
  totalEnterprises: number;
  totalJobs: number;
  selectedSector?: Sector | "all";
  onSelectSector: (sector: Sector | "all") => void;
}

export function SectorAllocationCard({
  sectors,
  totalDisbursed,
  totalEnterprises,
  totalJobs,
  selectedSector = "all",
  onSelectSector,
}: SectorAllocationCardProps) {
  const [metricMode, setMetricMode] = useState<"capital" | "enterprises" | "jobs">("capital");

  // Sort sectors based on active metric
  const sortedSectors = useMemo(() => {
    return [...sectors].sort((a, b) => {
      if (metricMode === "jobs") return b.jobs - a.jobs;
      if (metricMode === "enterprises") return b.enterprises - a.enterprises;
      return b.disbursed - a.disbursed;
    });
  }, [sectors, metricMode]);

  const maxVal = useMemo(() => {
    if (metricMode === "jobs") {
      return Math.max(...sectors.map((s) => s.jobs), 1);
    }
    if (metricMode === "enterprises") {
      return Math.max(...sectors.map((s) => s.enterprises), 1);
    }
    return Math.max(...sectors.map((s) => s.disbursed), 1);
  }, [sectors, metricMode]);

  return (
    <div className="bg-white rounded-card p-5 border border-border shadow-card">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-4 border-b border-border/60">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-tile bg-[#F2F4F7] flex items-center justify-center text-deep-green">
            <Factory className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-ink tracking-tight">
              Real-Sector Allocation & Priority Verticals
            </h3>
            <p className="text-xs font-medium text-ink-muted">
              Strategic capital & employment outcomes across 10 real sectors
            </p>
          </div>
        </div>

        {/* Metric Selector & Active Filter Indicator */}
        <div className="flex items-center gap-2">
          {selectedSector !== "all" && (
            <button
              type="button"
              onClick={() => onSelectSector("all")}
              className="text-xs font-semibold text-deep-green bg-soft-green px-2.5 py-1 rounded-md hover:bg-soft-green/80 transition-all flex items-center gap-1"
            >
              <span>Sector: {selectedSector}</span>
              <span className="text-xs font-bold">×</span>
            </button>
          )}

          <div className="bg-[#F2F4F7] p-0.5 rounded-lg flex items-center text-[11px] font-semibold">
            <button
              type="button"
              onClick={() => setMetricMode("capital")}
              className={`px-2.5 py-1 rounded-md transition-all ${
                metricMode === "capital"
                  ? "bg-white text-ink shadow-sm"
                  : "text-ink-muted hover:text-ink"
              }`}
            >
              Capital (NGN)
            </button>
            <button
              type="button"
              onClick={() => setMetricMode("enterprises")}
              className={`px-2.5 py-1 rounded-md transition-all ${
                metricMode === "enterprises"
                  ? "bg-white text-ink shadow-sm"
                  : "text-ink-muted hover:text-ink"
              }`}
            >
              Enterprises
            </button>
            <button
              type="button"
              onClick={() => setMetricMode("jobs")}
              className={`px-2.5 py-1 rounded-md transition-all ${
                metricMode === "jobs"
                  ? "bg-white text-ink shadow-sm"
                  : "text-ink-muted hover:text-ink"
              }`}
            >
              Jobs Supported
            </button>
          </div>
        </div>
      </div>

      {/* Ordered Horizontal Bars (2-column grid on desktop) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3.5">
        {sortedSectors.map((s, idx) => {
          const isSelected = selectedSector === s.sector;
          const currentVal =
            metricMode === "jobs"
              ? s.jobs
              : metricMode === "enterprises"
              ? s.enterprises
              : s.disbursed;

          const barPercent = Math.max(8, Math.round((currentVal / maxVal) * 100));
          const totalRef =
            metricMode === "jobs"
              ? totalJobs
              : metricMode === "enterprises"
              ? totalEnterprises
              : totalDisbursed;
          const share = totalRef > 0 ? (currentVal / totalRef) * 100 : 0;

          return (
            <button
              key={s.sector}
              type="button"
              onClick={() => onSelectSector(isSelected ? "all" : s.sector)}
              className={`w-full text-left p-2.5 rounded-xl border transition-all ${
                isSelected
                  ? "bg-[#FDF8EE] border-gold-accent ring-1 ring-gold-accent"
                  : "bg-white hover:bg-[#F8F9FA] border-border/80"
              }`}
            >
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-semibold text-ink flex items-center gap-2 truncate">
                  <span className="text-[10px] text-ink-muted font-mono w-4">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <span className="truncate">{s.sector}</span>
                </span>
                <span className="font-bold text-ink tabular-nums text-right shrink-0">
                  {metricMode === "capital" ? formatNairaCompact(s.disbursed) : formatNumber(currentVal)}
                </span>
              </div>

              {/* Progress Bar with deep/bright green, gold if selected */}
              <div className="w-full h-2 bg-[#EAECF0] rounded-full overflow-hidden mb-1.5">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    isSelected
                      ? "bg-gold-accent"
                      : idx < 3
                      ? "bg-deep-green"
                      : "bg-primary-green"
                  }`}
                  style={{ width: `${barPercent}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-ink-muted">
                <span>
                  {formatNumber(s.enterprises)} Enterprises • {formatNumber(s.jobs)} Jobs
                </span>
                <span
                  className={`font-semibold tabular-nums ${
                    isSelected ? "text-gold-accent font-bold" : "text-deep-green"
                  }`}
                >
                  {formatPercent(share)}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
