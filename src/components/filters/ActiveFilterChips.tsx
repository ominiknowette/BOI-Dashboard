"use client";

import React from "react";
import { X, RotateCcw } from "lucide-react";
import { useDashboardFilter } from "@/context/DashboardFilterContext";

export function ActiveFilterChips() {
  const {
    filters,
    setFilters,
    activeFilterCount,
    handleResetFilters,
  } = useDashboardFilter();

  if (activeFilterCount === 0) return null;

  return (
    <div className="bg-white rounded-xl p-3 mb-5 border border-border shadow-xs flex flex-wrap items-center gap-2">
      <span className="text-xs font-bold text-ink-muted mr-1">
        Active Filters:
      </span>

      {filters.year && filters.year !== "all" && (
        <span className="inline-flex items-center gap-1 bg-[#F2F4F7] text-ink text-xs font-semibold px-2.5 py-1 rounded-md">
          <span>Year: {filters.year}</span>
          <button
            type="button"
            onClick={() => setFilters((p) => ({ ...p, year: "all" }))}
            className="hover:text-risk-red text-ink-muted ml-0.5"
            aria-label="Remove year filter"
          >
            <X className="w-3 h-3" />
          </button>
        </span>
      )}

      {filters.zone && filters.zone !== "all" && (
        <span className="inline-flex items-center gap-1 bg-soft-green text-deep-green text-xs font-semibold px-2.5 py-1 rounded-md">
          <span>Zone: {filters.zone}</span>
          <button
            type="button"
            onClick={() => setFilters((p) => ({ ...p, zone: "all", state: "all" }))}
            className="hover:text-risk-red text-deep-green ml-0.5"
            aria-label="Remove zone filter"
          >
            <X className="w-3 h-3" />
          </button>
        </span>
      )}

      {filters.state && filters.state !== "all" && (
        <span className="inline-flex items-center gap-1 bg-soft-green text-deep-green text-xs font-semibold px-2.5 py-1 rounded-md">
          <span>State: {filters.state}</span>
          <button
            type="button"
            onClick={() => setFilters((p) => ({ ...p, state: "all" }))}
            className="hover:text-risk-red text-deep-green ml-0.5"
            aria-label="Remove state filter"
          >
            <X className="w-3 h-3" />
          </button>
        </span>
      )}

      {filters.sector && filters.sector !== "all" && (
        <span className="inline-flex items-center gap-1 bg-[#F2F4F7] text-ink text-xs font-semibold px-2.5 py-1 rounded-md">
          <span>Sector: {filters.sector}</span>
          <button
            type="button"
            onClick={() => setFilters((p) => ({ ...p, sector: "all" }))}
            className="hover:text-risk-red text-ink-muted ml-0.5"
            aria-label="Remove sector filter"
          >
            <X className="w-3 h-3" />
          </button>
        </span>
      )}

      {filters.strategicTheme && filters.strategicTheme !== "all" && (
        <span className="inline-flex items-center gap-1 bg-[#FDF8EE] text-gold-accent text-xs font-semibold px-2.5 py-1 rounded-md">
          <span>Theme: {filters.strategicTheme}</span>
          <button
            type="button"
            onClick={() => setFilters((p) => ({ ...p, strategicTheme: "all" }))}
            className="hover:text-risk-red text-gold-accent ml-0.5"
            aria-label="Remove theme filter"
          >
            <X className="w-3 h-3" />
          </button>
        </span>
      )}

      {filters.portfolioStatus && filters.portfolioStatus !== "all" && (
        <span className="inline-flex items-center gap-1 bg-[#F2F4F7] text-ink text-xs font-semibold px-2.5 py-1 rounded-md">
          <span>Status: {filters.portfolioStatus}</span>
          <button
            type="button"
            onClick={() => setFilters((p) => ({ ...p, portfolioStatus: "all" }))}
            className="hover:text-risk-red text-ink-muted ml-0.5"
            aria-label="Remove portfolio status filter"
          >
            <X className="w-3 h-3" />
          </button>
        </span>
      )}

      {filters.womenLed === true && (
        <span className="inline-flex items-center gap-1 bg-soft-green text-deep-green text-xs font-semibold px-2.5 py-1 rounded-md">
          <span>Women-Led</span>
          <button
            type="button"
            onClick={() => setFilters((p) => ({ ...p, womenLed: null }))}
            className="hover:text-risk-red text-deep-green ml-0.5"
            aria-label="Remove women-led filter"
          >
            <X className="w-3 h-3" />
          </button>
        </span>
      )}

      {filters.youthLed === true && (
        <span className="inline-flex items-center gap-1 bg-soft-green text-deep-green text-xs font-semibold px-2.5 py-1 rounded-md">
          <span>Youth-Led</span>
          <button
            type="button"
            onClick={() => setFilters((p) => ({ ...p, youthLed: null }))}
            className="hover:text-risk-red text-deep-green ml-0.5"
            aria-label="Remove youth-led filter"
          >
            <X className="w-3 h-3" />
          </button>
        </span>
      )}

      <button
        type="button"
        onClick={handleResetFilters}
        className="text-xs font-semibold text-risk-red hover:underline ml-auto flex items-center gap-1 cursor-pointer"
      >
        <RotateCcw className="w-3 h-3" />
        <span>Reset All</span>
      </button>
    </div>
  );
}
