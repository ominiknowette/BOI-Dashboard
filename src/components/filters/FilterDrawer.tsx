"use client";

import React from "react";
import { FilterState, GeopoliticalZone, Sector, EnterpriseSegment, PortfolioStatus, StrategicTheme } from "@/types/dataset";
import { GEOPOLITICAL_ZONES, NIGERIA_STATES } from "@/lib/data/geo-metadata";
import { X, RotateCcw, Check, SlidersHorizontal } from "lucide-react";

interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
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

const PORTFOLIO_STATUSES: PortfolioStatus[] = [
  "Performing",
  "Watchlist",
  "Substandard",
  "Doubtful",
];

const STRATEGIC_THEMES: StrategicTheme[] = [
  "MSMEs",
  "Gender Inclusion",
  "Youth & Skills",
  "Digital Economy",
  "Infrastructure Development",
  "Climate & Sustainability",
];

export function FilterDrawer({
  isOpen,
  onClose,
  filters,
  onFilterChange,
  onReset,
  matchingCount,
  totalCount,
}: FilterDrawerProps) {
  if (!isOpen) return null;

  const handleChange = (key: keyof FilterState, value: any) => {
    onFilterChange({
      ...filters,
      [key]: value,
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-ink/30 backdrop-blur-xs flex justify-end transition-opacity">
      <div
        className="relative w-full max-w-md bg-white h-full shadow-dialog flex flex-col justify-between overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-label="Filter Portal Dataset"
      >
        {/* Header */}
        <div className="p-5 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-tile bg-[#F2F4F7] flex items-center justify-center text-deep-green">
              <SlidersHorizontal className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-ink">Analytical Filters</h3>
              <p className="text-xs text-ink-muted">
                Showing {matchingCount} of {totalCount} verified records
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg text-ink-muted hover:text-ink hover:bg-[#F2F4F7] flex items-center justify-center transition-all"
            aria-label="Close Filter Drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Filter Form Controls */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 text-xs">
          {/* Year Filter */}
          <div>
            <label className="block font-bold text-ink mb-1.5 uppercase tracking-wider text-[11px]">
              Reporting Period / Year
            </label>
            <select
              value={filters.year || "all"}
              onChange={(e) => handleChange("year", e.target.value)}
              className="w-full bg-[#F8F9FA] border border-border rounded-control p-2.5 font-medium text-ink focus:ring-2 focus:ring-primary-green/20"
            >
              <option value="all">All Available Years (2023 - 2026)</option>
              <option value="2026">2026 (Active Baseline)</option>
              <option value="2025">2025</option>
              <option value="2024">2024</option>
              <option value="2023">2023</option>
            </select>
          </div>

          {/* Geopolitical Zone */}
          <div>
            <label className="block font-bold text-ink mb-1.5 uppercase tracking-wider text-[11px]">
              Geopolitical Zone
            </label>
            <select
              value={filters.zone || "all"}
              onChange={(e) => {
                onFilterChange({
                  ...filters,
                  zone: e.target.value,
                  state: "all", // reset state if zone changes
                });
              }}
              className="w-full bg-[#F8F9FA] border border-border rounded-control p-2.5 font-medium text-ink focus:ring-2 focus:ring-primary-green/20"
            >
              <option value="all">All 6 Geopolitical Zones</option>
              {GEOPOLITICAL_ZONES.map((z) => (
                <option key={z} value={z}>
                  {z}
                </option>
              ))}
            </select>
          </div>

          {/* State Filter */}
          <div>
            <label className="block font-bold text-ink mb-1.5 uppercase tracking-wider text-[11px]">
              State
            </label>
            <select
              value={filters.state || "all"}
              onChange={(e) => handleChange("state", e.target.value)}
              className="w-full bg-[#F8F9FA] border border-border rounded-control p-2.5 font-medium text-ink focus:ring-2 focus:ring-primary-green/20"
            >
              <option value="all">All 36 States + FCT</option>
              {NIGERIA_STATES.filter(
                (s) => filters.zone === "all" || !filters.zone || s.zone === filters.zone
              ).map((s) => (
                <option key={s.code} value={s.name}>
                  {s.name} ({s.zone})
                </option>
              ))}
            </select>
          </div>

          {/* Real Sector */}
          <div>
            <label className="block font-bold text-ink mb-1.5 uppercase tracking-wider text-[11px]">
              Real Sector
            </label>
            <select
              value={filters.sector || "all"}
              onChange={(e) => handleChange("sector", e.target.value)}
              className="w-full bg-[#F8F9FA] border border-border rounded-control p-2.5 font-medium text-ink focus:ring-2 focus:ring-primary-green/20"
            >
              <option value="all">All 10 Priority Sectors</option>
              {SECTORS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Enterprise Segment */}
          <div>
            <label className="block font-bold text-ink mb-1.5 uppercase tracking-wider text-[11px]">
              Enterprise Segment
            </label>
            <select
              value={filters.segment || "all"}
              onChange={(e) => handleChange("segment", e.target.value)}
              className="w-full bg-[#F8F9FA] border border-border rounded-control p-2.5 font-medium text-ink focus:ring-2 focus:ring-primary-green/20"
            >
              <option value="all">All Segments (Nano to Large)</option>
              {SEGMENTS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Portfolio Status */}
          <div>
            <label className="block font-bold text-ink mb-1.5 uppercase tracking-wider text-[11px]">
              Prudential Portfolio Status
            </label>
            <select
              value={filters.portfolioStatus || "all"}
              onChange={(e) => handleChange("portfolioStatus", e.target.value)}
              className="w-full bg-[#F8F9FA] border border-border rounded-control p-2.5 font-medium text-ink focus:ring-2 focus:ring-primary-green/20"
            >
              <option value="all">All Risk Categories</option>
              {PORTFOLIO_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Strategic Theme */}
          <div>
            <label className="block font-bold text-ink mb-1.5 uppercase tracking-wider text-[11px]">
              Strategic Mandate Pillar
            </label>
            <select
              value={filters.strategicTheme || "all"}
              onChange={(e) => handleChange("strategicTheme", e.target.value)}
              className="w-full bg-[#F8F9FA] border border-border rounded-control p-2.5 font-medium text-ink focus:ring-2 focus:ring-primary-green/20"
            >
              <option value="all">All Mandate Themes</option>
              {STRATEGIC_THEMES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          {/* Demographic Inclusion Toggles */}
          <div className="pt-2 border-t border-border space-y-2">
            <span className="block font-bold text-ink uppercase tracking-wider text-[11px]">
              Inclusion Criteria
            </span>

            <label className="flex items-center gap-2.5 p-2.5 rounded-lg bg-[#F8F9FA] cursor-pointer hover:bg-[#F2F4F7]">
              <input
                type="checkbox"
                checked={filters.womenLed === true}
                onChange={(e) => handleChange("womenLed", e.target.checked ? true : null)}
                className="rounded text-primary-green focus:ring-primary-green"
              />
              <span className="font-semibold text-ink">Filter Women-Led Enterprises Only</span>
            </label>

            <label className="flex items-center gap-2.5 p-2.5 rounded-lg bg-[#F8F9FA] cursor-pointer hover:bg-[#F2F4F7]">
              <input
                type="checkbox"
                checked={filters.youthLed === true}
                onChange={(e) => handleChange("youthLed", e.target.checked ? true : null)}
                className="rounded text-primary-green focus:ring-primary-green"
              />
              <span className="font-semibold text-ink">Filter Youth-Led Enterprises Only</span>
            </label>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-border bg-[#F8F9FA] flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onReset}
            className="flex items-center gap-1.5 text-xs font-semibold text-ink-muted hover:text-ink px-3 py-2 rounded-control transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-1.5 bg-deep-green hover:bg-dark-boi-green text-white text-xs font-bold px-5 py-2.5 rounded-control transition-all shadow-sm"
          >
            <Check className="w-4 h-4" />
            <span>Apply ({matchingCount})</span>
          </button>
        </div>
      </div>
    </div>
  );
}
