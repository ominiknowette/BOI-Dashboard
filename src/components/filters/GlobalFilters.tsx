"use client";

import React, { useState } from "react";
import { FilterState, GeopoliticalZone, Sector, EnterpriseSegment, PortfolioStatus, StrategicTheme } from "@/types/dataset";
import { GEOPOLITICAL_ZONES, NIGERIA_STATES } from "@/lib/data/geo-metadata";
import { Filter, ChevronDown, ChevronUp, RotateCcw, X, Check } from "lucide-react";

interface GlobalFiltersProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  onReset: () => void;
  matchingCount: number;
  totalCount: number;
}

const SECTORS: Sector[] = [
  "Manufacturing",
  "Agro-processing",
  "Infrastructure",
  "Healthcare",
  "Creative Industries",
  "Technology / Digital Economy",
  "Renewable Energy",
  "Solid Minerals",
  "Engineering",
  "Services",
];

const SEGMENTS: EnterpriseSegment[] = [
  "Nano",
  "Micro",
  "Small",
  "Medium",
  "Large Enterprise",
];

const STRATEGIC_THEMES: StrategicTheme[] = [
  "MSMEs",
  "Gender Inclusion",
  "Youth & Skills",
  "Digital Economy",
  "Infrastructure Development",
  "Climate & Sustainability",
];

const PORTFOLIO_STATUSES: PortfolioStatus[] = [
  "Performing",
  "Watchlist",
  "Substandard",
  "Doubtful",
];

export function GlobalFilters({
  filters,
  onFilterChange,
  onReset,
  matchingCount,
  totalCount,
}: GlobalFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Count active filters
  let activeCount = 0;
  if (filters.year && filters.year !== "all") activeCount++;
  if (filters.zone && filters.zone !== "all") activeCount++;
  if (filters.state && filters.state !== "all") activeCount++;
  if (filters.sector && filters.sector !== "all") activeCount++;
  if (filters.segment && filters.segment !== "all") activeCount++;
  if (filters.strategicTheme && filters.strategicTheme !== "all") activeCount++;
  if (filters.portfolioStatus && filters.portfolioStatus !== "all") activeCount++;
  if (filters.womenLed === true) activeCount++;
  if (filters.youthLed === true) activeCount++;

  const filteredStates = filters.zone && filters.zone !== "all"
    ? NIGERIA_STATES.filter((s) => s.zone === filters.zone)
    : NIGERIA_STATES;

  return (
    <div className="bg-boi-surface border-b border-boi-border">
      <div className="max-w-canvas mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
        {/* Main Bar: Summary & Toggle */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="inline-flex items-center gap-2 px-3 py-1.5 text-[13px] font-semibold text-boi-ink bg-boi-bg hover:bg-boi-border/50 border border-boi-border rounded-sm transition-colors"
              aria-expanded={isExpanded}
              aria-controls="expanded-filters-panel"
            >
              <Filter className="w-3.5 h-3.5 text-boi-green" />
              <span>Filters</span>
              {activeCount > 0 ? (
                <span className="inline-flex items-center justify-center px-1.5 py-0.2 text-[11px] font-bold rounded-full bg-boi-green text-white tabular-nums">
                  {activeCount}
                </span>
              ) : (
                <span className="text-[12px] text-boi-text-muted font-normal">
                  (All Records)
                </span>
              )}
              {isExpanded ? (
                <ChevronUp className="w-3.5 h-3.5 text-boi-text-muted" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5 text-boi-text-muted" />
              )}
            </button>

            {/* Quick Active Chips */}
            {activeCount > 0 && (
              <div className="flex flex-wrap items-center gap-1.5">
                {filters.year && filters.year !== "all" && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium bg-boi-selected text-boi-green-deep border border-boi-green/20 rounded-xs">
                    Year: {filters.year}
                    <button
                      type="button"
                      onClick={() => onFilterChange({ ...filters, year: "all" })}
                      className="hover:text-boi-error"
                      aria-label="Remove year filter"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {filters.zone && filters.zone !== "all" && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium bg-boi-selected text-boi-green-deep border border-boi-green/20 rounded-xs">
                    {filters.zone}
                    <button
                      type="button"
                      onClick={() => onFilterChange({ ...filters, zone: "all", state: "all" })}
                      className="hover:text-boi-error"
                      aria-label="Remove zone filter"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {filters.state && filters.state !== "all" && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium bg-boi-selected text-boi-green-deep border border-boi-green/20 rounded-xs">
                    State: {filters.state}
                    <button
                      type="button"
                      onClick={() => onFilterChange({ ...filters, state: "all" })}
                      className="hover:text-boi-error"
                      aria-label="Remove state filter"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {filters.sector && filters.sector !== "all" && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium bg-boi-selected text-boi-green-deep border border-boi-green/20 rounded-xs">
                    {filters.sector}
                    <button
                      type="button"
                      onClick={() => onFilterChange({ ...filters, sector: "all" })}
                      className="hover:text-boi-error"
                      aria-label="Remove sector filter"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {filters.strategicTheme && filters.strategicTheme !== "all" && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium bg-boi-selected text-boi-green-deep border border-boi-green/20 rounded-xs">
                    Theme: {filters.strategicTheme}
                    <button
                      type="button"
                      onClick={() => onFilterChange({ ...filters, strategicTheme: "all" })}
                      className="hover:text-boi-error"
                      aria-label="Remove theme filter"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {filters.womenLed && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium bg-boi-selected text-boi-green-deep border border-boi-green/20 rounded-xs">
                    Women-Led
                    <button
                      type="button"
                      onClick={() => onFilterChange({ ...filters, womenLed: null })}
                      className="hover:text-boi-error"
                      aria-label="Remove women-led filter"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {filters.youthLed && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium bg-boi-selected text-boi-green-deep border border-boi-green/20 rounded-xs">
                    Youth-Led
                    <button
                      type="button"
                      onClick={() => onFilterChange({ ...filters, youthLed: null })}
                      className="hover:text-boi-error"
                      aria-label="Remove youth-led filter"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Right: Record count & Reset action */}
          <div className="flex items-center gap-3">
            <span className="text-[12px] text-boi-text-muted tabular-nums">
              Showing <strong className="text-boi-ink font-semibold">{matchingCount}</strong> of{" "}
              {totalCount} facilities
            </span>

            {activeCount > 0 && (
              <button
                type="button"
                onClick={onReset}
                className="inline-flex items-center gap-1 text-[12px] font-medium text-boi-green hover:text-boi-green-deep underline-offset-2 hover:underline"
              >
                <RotateCcw className="w-3 h-3" />
                Reset filters
              </button>
            )}
          </div>
        </div>

        {/* Expanded Filter Drawer / Panel */}
        {isExpanded && (
          <div
            id="expanded-filters-panel"
            className="pt-4 pb-2 mt-3 border-t border-boi-border grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3"
          >
            {/* Period / Year */}
            <div>
              <label htmlFor="filter-year" className="block text-[11px] font-semibold text-boi-text-muted uppercase tracking-wider mb-1">
                Period / Year
              </label>
              <select
                id="filter-year"
                value={filters.year || "all"}
                onChange={(e) => onFilterChange({ ...filters, year: e.target.value })}
                className="w-full text-[13px] px-2.5 py-1.5 bg-boi-surface border border-boi-border rounded-xs text-boi-ink focus:border-boi-green"
              >
                <option value="all">All Years (2023–2026)</option>
                <option value="2026">2026 (YTD)</option>
                <option value="2025">2025</option>
                <option value="2024">2024</option>
                <option value="2023">2023</option>
              </select>
            </div>

            {/* Geopolitical Zone */}
            <div>
              <label htmlFor="filter-zone" className="block text-[11px] font-semibold text-boi-text-muted uppercase tracking-wider mb-1">
                Geopolitical Zone
              </label>
              <select
                id="filter-zone"
                value={filters.zone || "all"}
                onChange={(e) =>
                  onFilterChange({
                    ...filters,
                    zone: e.target.value,
                    state: "all", // reset state if zone changes
                  })
                }
                className="w-full text-[13px] px-2.5 py-1.5 bg-boi-surface border border-boi-border rounded-xs text-boi-ink focus:border-boi-green"
              >
                <option value="all">All Zones</option>
                {GEOPOLITICAL_ZONES.map((z) => (
                  <option key={z} value={z}>
                    {z}
                  </option>
                ))}
              </select>
            </div>

            {/* Nigerian State */}
            <div>
              <label htmlFor="filter-state" className="block text-[11px] font-semibold text-boi-text-muted uppercase tracking-wider mb-1">
                State
              </label>
              <select
                id="filter-state"
                value={filters.state || "all"}
                onChange={(e) => onFilterChange({ ...filters, state: e.target.value })}
                className="w-full text-[13px] px-2.5 py-1.5 bg-boi-surface border border-boi-border rounded-xs text-boi-ink focus:border-boi-green"
              >
                <option value="all">All 36 States + FCT</option>
                {filteredStates.map((s) => (
                  <option key={s.code} value={s.name}>
                    {s.name} ({s.zone.split(" ")[0]})
                  </option>
                ))}
              </select>
            </div>

            {/* Sector */}
            <div>
              <label htmlFor="filter-sector" className="block text-[11px] font-semibold text-boi-text-muted uppercase tracking-wider mb-1">
                Sector
              </label>
              <select
                id="filter-sector"
                value={filters.sector || "all"}
                onChange={(e) => onFilterChange({ ...filters, sector: e.target.value })}
                className="w-full text-[13px] px-2.5 py-1.5 bg-boi-surface border border-boi-border rounded-xs text-boi-ink focus:border-boi-green"
              >
                <option value="all">All Sectors</option>
                {SECTORS.map((sec) => (
                  <option key={sec} value={sec}>
                    {sec}
                  </option>
                ))}
              </select>
            </div>

            {/* Enterprise Segment */}
            <div>
              <label htmlFor="filter-segment" className="block text-[11px] font-semibold text-boi-text-muted uppercase tracking-wider mb-1">
                Enterprise Segment
              </label>
              <select
                id="filter-segment"
                value={filters.segment || "all"}
                onChange={(e) => onFilterChange({ ...filters, segment: e.target.value })}
                className="w-full text-[13px] px-2.5 py-1.5 bg-boi-surface border border-boi-border rounded-xs text-boi-ink focus:border-boi-green"
              >
                <option value="all">All Segments</option>
                {SEGMENTS.map((seg) => (
                  <option key={seg} value={seg}>
                    {seg}
                  </option>
                ))}
              </select>
            </div>

            {/* Strategic Theme */}
            <div>
              <label htmlFor="filter-theme" className="block text-[11px] font-semibold text-boi-text-muted uppercase tracking-wider mb-1">
                Strategic Theme
              </label>
              <select
                id="filter-theme"
                value={filters.strategicTheme || "all"}
                onChange={(e) => onFilterChange({ ...filters, strategicTheme: e.target.value })}
                className="w-full text-[13px] px-2.5 py-1.5 bg-boi-surface border border-boi-border rounded-xs text-boi-ink focus:border-boi-green"
              >
                <option value="all">All Themes</option>
                {STRATEGIC_THEMES.map((theme) => (
                  <option key={theme} value={theme}>
                    {theme}
                  </option>
                ))}
              </select>
            </div>

            {/* Portfolio Status */}
            <div>
              <label htmlFor="filter-portfolio" className="block text-[11px] font-semibold text-boi-text-muted uppercase tracking-wider mb-1">
                Portfolio Status
              </label>
              <select
                id="filter-portfolio"
                value={filters.portfolioStatus || "all"}
                onChange={(e) => onFilterChange({ ...filters, portfolioStatus: e.target.value })}
                className="w-full text-[13px] px-2.5 py-1.5 bg-boi-surface border border-boi-border rounded-xs text-boi-ink focus:border-boi-green"
              >
                <option value="all">All Asset Classes</option>
                {PORTFOLIO_STATUSES.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>

            {/* Inclusion Toggles */}
            <div className="col-span-2 sm:col-span-1 flex flex-col justify-end gap-1.5 pb-0.5">
              <span className="block text-[11px] font-semibold text-boi-text-muted uppercase tracking-wider">
                Inclusion Focus
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onFilterChange({ ...filters, womenLed: filters.womenLed ? null : true })}
                  className={`px-2 py-1 text-[12px] font-medium rounded-xs border transition-colors ${
                    filters.womenLed
                      ? "bg-boi-selected text-boi-green-deep border-boi-green font-semibold"
                      : "bg-boi-surface text-boi-text-muted border-boi-border hover:bg-boi-bg"
                  }`}
                >
                  Women-Led
                </button>
                <button
                  type="button"
                  onClick={() => onFilterChange({ ...filters, youthLed: filters.youthLed ? null : true })}
                  className={`px-2 py-1 text-[12px] font-medium rounded-xs border transition-colors ${
                    filters.youthLed
                      ? "bg-boi-selected text-boi-green-deep border-boi-green font-semibold"
                      : "bg-boi-surface text-boi-text-muted border-boi-border hover:bg-boi-bg"
                  }`}
                >
                  Youth-Led
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
