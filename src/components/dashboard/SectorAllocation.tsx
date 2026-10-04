"use client";

import React, { useState } from "react";
import { SectorSummary, Sector } from "@/types/dataset";
import { formatNairaCompact, formatNumber, formatPercent } from "@/lib/utils/formatters";
import { Factory, ArrowUpDown, Filter } from "lucide-react";

interface SectorAllocationProps {
  sectors: SectorSummary[];
  totalDisbursed: number;
  totalEnterprises: number;
  totalJobs: number;
  selectedSector?: Sector | "all";
  onSelectSector: (sector: Sector | "all") => void;
}

export function SectorAllocation({
  sectors,
  totalDisbursed,
  totalEnterprises,
  totalJobs,
  selectedSector = "all",
  onSelectSector,
}: SectorAllocationProps) {
  const [metric, setMetric] = useState<"disbursed" | "enterprises" | "jobs">("disbursed");

  // Re-sort sectors based on active metric
  const sortedSectors = [...sectors].sort((a, b) => {
    if (metric === "disbursed") return b.disbursed - a.disbursed;
    if (metric === "enterprises") return b.enterprises - a.enterprises;
    return b.jobs - a.jobs;
  });

  const getMetricMax = () => {
    if (metric === "disbursed") return Math.max(...sectors.map((s) => s.disbursed), 1);
    if (metric === "enterprises") return Math.max(...sectors.map((s) => s.enterprises), 1);
    return Math.max(...sectors.map((s) => s.jobs), 1);
  };

  const maxVal = getMetricMax();

  const getMetricDisplay = (s: SectorSummary) => {
    if (metric === "disbursed") {
      const share = totalDisbursed > 0 ? (s.disbursed / totalDisbursed) * 100 : 0;
      return {
        value: formatNairaCompact(s.disbursed),
        shareText: formatPercent(share),
        rawRatio: s.disbursed / maxVal,
      };
    }
    if (metric === "enterprises") {
      const share = totalEnterprises > 0 ? (s.enterprises / totalEnterprises) * 100 : 0;
      return {
        value: formatNumber(s.enterprises),
        shareText: formatPercent(share),
        rawRatio: s.enterprises / maxVal,
      };
    }
    const share = totalJobs > 0 ? (s.jobs / totalJobs) * 100 : 0;
    return {
      value: formatNumber(s.jobs),
      shareText: formatPercent(share),
      rawRatio: s.jobs / maxVal,
    };
  };

  return (
    <div className="bg-white border border-[#DDE5DF] rounded-md shadow-sm p-5 flex flex-col h-full">
      {/* Header and Metric Switcher */}
      <div className="flex flex-wrap items-center justify-between pb-3 mb-4 border-b border-[#DDE5DF] gap-2">
        <div className="flex items-center gap-2">
          <Factory className="w-4 h-4 text-[#0B6B4F]" aria-hidden="true" />
          <h3 className="text-sm font-semibold text-[#17201C] uppercase tracking-wide">
            Real-Sector Allocation &amp; Priority Verticals
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <div className="inline-flex rounded-md border border-[#DDE5DF] bg-white p-0.5 text-xs">
            <button
              type="button"
              onClick={() => setMetric("disbursed")}
              className={`px-2 py-0.5 rounded text-xs font-medium transition-colors ${
                metric === "disbursed"
                  ? "bg-[#0B6B4F] text-white"
                  : "text-[#667169] hover:text-[#17201C]"
              }`}
            >
              Capital (NGN)
            </button>
            <button
              type="button"
              onClick={() => setMetric("enterprises")}
              className={`px-2 py-0.5 rounded text-xs font-medium transition-colors ${
                metric === "enterprises"
                  ? "bg-[#0B6B4F] text-white"
                  : "text-[#667169] hover:text-[#17201C]"
              }`}
            >
              Enterprises
            </button>
            <button
              type="button"
              onClick={() => setMetric("jobs")}
              className={`px-2 py-0.5 rounded text-xs font-medium transition-colors ${
                metric === "jobs"
                  ? "bg-[#0B6B4F] text-white"
                  : "text-[#667169] hover:text-[#17201C]"
              }`}
            >
              Jobs
            </button>
          </div>

          {selectedSector !== "all" && (
            <button
              type="button"
              onClick={() => onSelectSector("all")}
              className="text-xs text-[#0B6B4F] hover:underline font-medium ml-1"
            >
              Clear Sector
            </button>
          )}
        </div>
      </div>

      <p className="text-xs text-[#667169] mb-4">
        Ordered comparison across BOI priority real sectors. Click any sector bar to isolate its portfolio impact.
      </p>

      {/* Ranked Horizontal Bars */}
      <div className="space-y-2.5 flex-1 flex flex-col justify-between">
        {sortedSectors.map((s) => {
          const isSelected = selectedSector === s.sector;
          const display = getMetricDisplay(s);
          const barWidthPercent = display.rawRatio * 100;

          return (
            <div
              key={s.sector}
              onClick={() => onSelectSector(isSelected ? "all" : s.sector)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onSelectSector(isSelected ? "all" : s.sector);
                }
              }}
              className={`p-2 rounded transition-all cursor-pointer border ${
                isSelected
                  ? "bg-[#EDF5F1] border-[#0B6B4F] ring-1 ring-[#0B6B4F]"
                  : "bg-white border-transparent hover:border-[#DDE5DF] hover:bg-[#FAFBF9]"
              }`}
            >
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-medium text-[#17201C] truncate max-w-[240px] sm:max-w-xs">
                  {s.sector}
                </span>
                <div className="text-right shrink-0">
                  <span className="font-bold text-[#0B4738] tabular-nums">
                    {display.value}
                  </span>
                  <span className="text-[11px] text-[#667169] ml-1.5 tabular-nums">
                    ({display.shareText})
                  </span>
                </div>
              </div>

              {/* Bar track */}
              <div className="w-full bg-[#E8ECE9] h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    isSelected ? "bg-[#0B4738]" : "bg-[#0B6B4F]"
                  }`}
                  style={{ width: `${Math.max(2, barWidthPercent)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
