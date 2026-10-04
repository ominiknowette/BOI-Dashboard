"use client";

import React from "react";
import { StrategicTheme } from "@/types/dataset";
import { formatNairaCompact, formatNumber, formatPercent } from "@/lib/utils/formatters";
import { Compass, Sparkles } from "lucide-react";

interface StrategicThemeExplorerProps {
  themes: { theme: StrategicTheme; disbursed: number; enterprises: number; jobs: number }[];
  totalDisbursed: number;
  selectedTheme?: StrategicTheme | "all";
  onSelectTheme: (theme: StrategicTheme | "all") => void;
}

export function StrategicThemeExplorer({
  themes,
  totalDisbursed,
  selectedTheme = "all",
  onSelectTheme,
}: StrategicThemeExplorerProps) {
  return (
    <div className="bg-white border border-[#DDE5DF] rounded-md shadow-sm p-5 mb-6">
      <div className="flex flex-wrap items-center justify-between pb-3 mb-4 border-b border-[#DDE5DF] gap-2">
        <div className="flex items-center gap-2">
          <Compass className="w-4 h-4 text-[#0B6B4F]" aria-hidden="true" />
          <h3 className="text-sm font-semibold text-[#17201C] uppercase tracking-wide">
            Strategic Priority Themes &amp; Mandate Alignment
          </h3>
        </div>

        {selectedTheme !== "all" && (
          <button
            type="button"
            onClick={() => onSelectTheme("all")}
            className="text-xs text-[#0B6B4F] hover:underline font-medium"
          >
            Clear Strategic Theme Filter
          </button>
        )}
      </div>

      <p className="text-xs text-[#667169] mb-4">
        Cross-cutting mandate themes guiding BOI capital mobilization. Click any strategic pillar to filter the entire portal.
      </p>

      {/* Grid of 6 Strategic Themes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {themes.map((t) => {
          const isSelected = selectedTheme === t.theme;
          const share = totalDisbursed > 0 ? (t.disbursed / totalDisbursed) * 100 : 0;

          return (
            <div
              key={t.theme}
              onClick={() => onSelectTheme(isSelected ? "all" : t.theme)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onSelectTheme(isSelected ? "all" : t.theme);
                }
              }}
              className={`p-3.5 rounded border transition-all cursor-pointer ${
                isSelected
                  ? "bg-[#EDF5F1] border-[#0B6B4F] ring-1 ring-[#0B6B4F]"
                  : "bg-[#FAFBF9] border-[#DDE5DF] hover:border-[#0B6B4F] hover:bg-white"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-[#17201C]">
                  {t.theme}
                </span>
                {isSelected && (
                  <span className="text-[10px] bg-[#0B6B4F] text-white px-1.5 py-0.2 rounded font-medium">
                    Active
                  </span>
                )}
              </div>

              <div className="flex items-baseline justify-between mb-2">
                <span className="text-base font-bold text-[#0B4738] tabular-nums font-serif">
                  {formatNairaCompact(t.disbursed)}
                </span>
                <span className="text-xs text-[#667169] tabular-nums">
                  {formatPercent(share)}
                </span>
              </div>

              <div className="flex items-center justify-between text-[11px] text-[#667169] pt-2 border-t border-[#E8ECE9] tabular-nums">
                <span>{formatNumber(t.enterprises)} enterprises</span>
                <span>{formatNumber(t.jobs)} jobs</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
