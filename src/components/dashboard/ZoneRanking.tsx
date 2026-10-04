"use client";

import React from "react";
import { ZoneSummary, GeopoliticalZone } from "@/types/dataset";
import { formatNairaCompact, formatNumber, formatPercent } from "@/lib/utils/formatters";
import { Map, ArrowRight } from "lucide-react";

interface ZoneRankingProps {
  zones: ZoneSummary[];
  totalDisbursed: number;
  selectedZone?: GeopoliticalZone | "all";
  onSelectZone: (zone: GeopoliticalZone | "all") => void;
}

export function ZoneRanking({
  zones,
  totalDisbursed,
  selectedZone = "all",
  onSelectZone,
}: ZoneRankingProps) {
  const maxDisbursed = Math.max(...zones.map((z) => z.disbursed), 1);

  return (
    <div className="bg-white border border-[#DDE5DF] rounded-md shadow-sm p-5 flex flex-col h-full">
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#DDE5DF]">
        <div className="flex items-center gap-2">
          <Map className="w-4 h-4 text-[#0B6B4F]" aria-hidden="true" />
          <h3 className="text-sm font-semibold text-[#17201C] uppercase tracking-wide">
            Geopolitical Zone Distribution
          </h3>
        </div>
        {selectedZone !== "all" && (
          <button
            type="button"
            onClick={() => onSelectZone("all")}
            className="text-xs text-[#0B6B4F] hover:underline font-medium"
          >
            Clear Zone Selection
          </button>
        )}
      </div>

      <p className="text-xs text-[#667169] mb-4">
        Ranked by capital deployment across the 6 geopolitical zones. Select a zone to filter the portal context.
      </p>

      <div className="space-y-3 flex-1 flex flex-col justify-around">
        {zones.map((z) => {
          const share = totalDisbursed > 0 ? (z.disbursed / totalDisbursed) * 100 : 0;
          const barWidthPercent = (z.disbursed / maxDisbursed) * 100;
          const isSelected = selectedZone === z.zone;

          return (
            <div
              key={z.zone}
              onClick={() => onSelectZone(isSelected ? "all" : z.zone)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onSelectZone(isSelected ? "all" : z.zone);
                }
              }}
              className={`p-2.5 rounded transition-all cursor-pointer border ${
                isSelected
                  ? "bg-[#EDF5F1] border-[#0B6B4F] ring-1 ring-[#0B6B4F]"
                  : "bg-[#FAFBF9] border-transparent hover:border-[#DDE5DF] hover:bg-[#F5F7F5]"
              }`}
            >
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-semibold text-[#17201C] flex items-center gap-1.5">
                  {z.zone}
                  {isSelected && (
                    <span className="text-[10px] bg-[#0B6B4F] text-white px-1.5 py-0.2 rounded font-sans font-medium">
                      Active
                    </span>
                  )}
                </span>
                <div className="text-right">
                  <span className="font-bold text-[#0B4738] tabular-nums">
                    {formatNairaCompact(z.disbursed)}
                  </span>
                  <span className="text-[11px] text-[#667169] ml-1.5 tabular-nums">
                    ({formatPercent(share)})
                  </span>
                </div>
              </div>

              {/* Progress track */}
              <div className="w-full bg-[#E8ECE9] h-2 rounded-full overflow-hidden mb-1.5">
                <div
                  className="h-full bg-[#0B6B4F] rounded-full transition-all duration-300"
                  style={{ width: `${Math.max(2, barWidthPercent)}%` }}
                />
              </div>

              {/* Detail row */}
              <div className="flex items-center justify-between text-[11px] text-[#667169] tabular-nums">
                <span>{formatNumber(z.enterprises)} enterprises</span>
                <span>{formatNumber(z.jobs)} jobs</span>
                <span>{z.statesCount} states active</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
