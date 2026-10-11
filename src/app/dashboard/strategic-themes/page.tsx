"use client";

import React from "react";
import { useDashboardFilter } from "@/context/DashboardFilterContext";
import { InclusionThemesCard } from "@/components/redesign/InclusionThemesCard";
import { EmptyState } from "@/components/common/EmptyState";
import { formatNairaCompact, formatPercent, formatNumber } from "@/lib/utils/formatters";
import { Target, Factory, Briefcase, Globe2, Users, Leaf, ArrowUpRight } from "lucide-react";
import { StrategicTheme } from "@/types/dataset";

export default function StrategicThemesPage() {
  const {
    filteredRecords,
    metrics,
    strategicThemeSummary,
    filters,
    handleSelectTheme,
    handleToggleWomen,
    handleToggleYouth,
    handleResetFilters,
  } = useDashboardFilter();

  if (filteredRecords.length === 0) {
    return <EmptyState onReset={handleResetFilters} />;
  }

  return (
    <div className="space-y-6">
      {/* Strategic Mandate Core Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {strategicThemeSummary.map((theme) => {
          const share =
            metrics.totalDisbursed > 0
              ? (theme.disbursed / metrics.totalDisbursed) * 100
              : 0;

          const isSelected = filters.strategicTheme === theme.theme;

          return (
            <div
              key={theme.theme}
              onClick={() =>
                handleSelectTheme(isSelected ? "all" : (theme.theme as StrategicTheme))
              }
              className={`bg-white rounded-card p-5 border transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? "border-deep-green ring-2 ring-soft-green shadow-sm"
                  : "border-border hover:border-deep-green/40 shadow-card"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-bold text-ink-muted uppercase tracking-wider">
                    Mandate Pillar
                  </span>
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                      isSelected
                        ? "bg-deep-green text-white"
                        : "bg-soft-green text-deep-green"
                    }`}
                  >
                    {formatPercent(share)}
                  </span>
                </div>

                <h4 className="text-base font-bold text-ink mb-1">
                  {theme.theme}
                </h4>

                <div className="text-2xl font-bold text-deep-green tabular-nums my-2">
                  {formatNairaCompact(theme.disbursed)}
                </div>
              </div>

              <div className="space-y-1.5 pt-3 border-t border-border/60 text-xs">
                <div className="flex justify-between text-ink-muted">
                  <span>Enterprises Supported:</span>
                  <span className="font-semibold text-ink tabular-nums">
                    {formatNumber(theme.enterprises)}
                  </span>
                </div>
                <div className="flex justify-between text-ink-muted">
                  <span>Jobs Generated:</span>
                  <span className="font-semibold text-ink tabular-nums">
                    {formatNumber(theme.jobs)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Inclusion Themes Card */}
      <InclusionThemesCard
        metrics={metrics}
        strategicThemes={strategicThemeSummary}
        selectedTheme={filters.strategicTheme as StrategicTheme | "all"}
        onSelectTheme={handleSelectTheme}
        womenFilter={filters.womenLed}
        onToggleWomen={handleToggleWomen}
        youthFilter={filters.youthLed}
        onToggleYouth={handleToggleYouth}
      />
    </div>
  );
}
