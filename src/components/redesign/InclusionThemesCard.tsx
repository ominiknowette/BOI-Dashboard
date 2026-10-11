"use client";

import React from "react";
import { AggregatedMetrics, StrategicTheme, StrategicThemeSummary } from "@/types/dataset";
import { formatNairaCompact, formatNumber, formatPercent } from "@/lib/utils/formatters";
import { Users, Target, HeartHandshake, Sparkles, ChevronRight } from "lucide-react";

interface InclusionThemesCardProps {
  metrics: AggregatedMetrics;
  strategicThemes: StrategicThemeSummary[];
  selectedTheme?: StrategicTheme | "all";
  onSelectTheme: (theme: StrategicTheme | "all") => void;
  womenFilter?: boolean | null;
  onToggleWomen: () => void;
  youthFilter?: boolean | null;
  onToggleYouth: () => void;
}

export function InclusionThemesCard({
  metrics,
  strategicThemes,
  selectedTheme = "all",
  onSelectTheme,
  womenFilter,
  onToggleWomen,
  youthFilter,
  onToggleYouth,
}: InclusionThemesCardProps) {
  const womenShare =
    metrics.totalDisbursed > 0 ? (metrics.womenLedDisbursed / metrics.totalDisbursed) * 100 : 0;
  const youthShare =
    metrics.totalDisbursed > 0 ? (metrics.youthLedDisbursed / metrics.totalDisbursed) * 100 : 0;

  return (
    <div className="bg-white rounded-card p-5 border border-border shadow-card">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-4 border-b border-border/60">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-tile bg-[#F2F4F7] flex items-center justify-center text-deep-green">
            <Target className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-ink tracking-tight">
              Demographic Inclusion & Strategic Mandate Pillars
            </h3>
            <p className="text-xs font-medium text-ink-muted">
              Targeted inclusion for women, youth, and national development themes
            </p>
          </div>
        </div>

        {selectedTheme !== "all" && (
          <button
            type="button"
            onClick={() => onSelectTheme("all")}
            className="text-xs font-semibold text-deep-green bg-soft-green px-2.5 py-1 rounded-md hover:bg-soft-green/80 transition-all flex items-center gap-1 self-start sm:self-auto"
          >
            <span>Theme: {selectedTheme}</span>
            <span className="text-xs font-bold">×</span>
          </button>
        )}
      </div>

      {/* Two Sections: Top Inclusion Highlight Cards + Bottom Strategic Themes Grid */}
      <div className="space-y-6">
        {/* Inclusion Highlight Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Women-Led Enterprise Card */}
          <button
            type="button"
            onClick={onToggleWomen}
            className={`text-left p-4 rounded-xl border transition-all ${
              womenFilter === true
                ? "bg-[#EAF5EE] border-primary-green ring-1 ring-primary-green"
                : "bg-[#F8F9FA] hover:bg-[#F2F4F7] border-border"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-ink flex items-center gap-2">
                <HeartHandshake className="w-4 h-4 text-primary-green" />
                <span>Women-Led Enterprises</span>
              </span>
              <span className="bg-primary-green text-white text-[10px] font-bold px-2 py-0.5 rounded-full tabular-nums">
                {formatPercent(womenShare)} of portfolio
              </span>
            </div>

            <div className="text-2xl font-extrabold text-ink tabular-nums">
              {formatNairaCompact(metrics.womenLedDisbursed)}
            </div>

            <div className="text-xs text-ink-muted mt-1">
              Financed: <span className="font-semibold text-ink">{formatNumber(metrics.womenLedCount)}</span> enterprises
            </div>
          </button>

          {/* Youth-Led Enterprise Card */}
          <button
            type="button"
            onClick={onToggleYouth}
            className={`text-left p-4 rounded-xl border transition-all ${
              youthFilter === true
                ? "bg-[#EAF5EE] border-primary-green ring-1 ring-primary-green"
                : "bg-[#F8F9FA] hover:bg-[#F2F4F7] border-border"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-ink flex items-center gap-2">
                <Users className="w-4 h-4 text-deep-green" />
                <span>Youth-Led Enterprises</span>
              </span>
              <span className="bg-deep-green text-white text-[10px] font-bold px-2 py-0.5 rounded-full tabular-nums">
                {formatPercent(youthShare)} of portfolio
              </span>
            </div>

            <div className="text-2xl font-extrabold text-ink tabular-nums">
              {formatNairaCompact(metrics.youthLedDisbursed)}
            </div>

            <div className="text-xs text-ink-muted mt-1">
              Financed: <span className="font-semibold text-ink">{formatNumber(metrics.youthLedCount)}</span> enterprises
            </div>
          </button>
        </div>

        {/* 6 Strategic Priority Themes Grid */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-ink-muted mb-3">
            Cross-Cutting Mandate Pillars
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {strategicThemes.map((theme) => {
              const isSelected = selectedTheme === theme.theme;
              const share =
                metrics.totalDisbursed > 0
                  ? (theme.disbursed / metrics.totalDisbursed) * 100
                  : 0;

              return (
                <button
                  key={theme.theme}
                  type="button"
                  onClick={() => onSelectTheme(isSelected ? "all" : theme.theme)}
                  className={`text-left p-3.5 rounded-xl border transition-all ${
                    isSelected
                      ? "bg-[#FDF8EE] border-gold-accent ring-1 ring-gold-accent shadow-xs"
                      : "bg-white hover:bg-[#F8F9FA] border-border"
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-bold text-ink truncate">{theme.theme}</span>
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full tabular-nums ${
                        isSelected ? "bg-gold-accent text-white" : "bg-[#F2F4F7] text-ink-muted"
                      }`}
                    >
                      {formatPercent(share)}
                    </span>
                  </div>

                  <div className="text-base font-extrabold text-ink tabular-nums my-1">
                    {formatNairaCompact(theme.disbursed)}
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-ink-muted mt-1">
                    <span>{formatNumber(theme.enterprises)} Enterprises</span>
                    <span>{formatNumber(theme.jobs)} Jobs</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
