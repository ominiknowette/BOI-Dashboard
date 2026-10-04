"use client";

import React, { useState, useMemo } from "react";
import { StateSummary, GeopoliticalZone } from "@/types/dataset";
import { NIGERIA_STATES, StateMeta } from "@/lib/data/geo-metadata";
import { formatNairaCompact, formatNairaFull, formatNumber, formatPercent } from "@/lib/utils/formatters";
import { MapPin, Table as TableIcon, Map as MapIcon, ArrowUpDown, Check, Filter } from "lucide-react";

interface NigeriaImpactMapProps {
  statesData: StateSummary[];
  totalDisbursed: number;
  selectedState?: string;
  onSelectState: (state: string) => void;
  selectedZone?: GeopoliticalZone | "all";
}

export function NigeriaImpactMap({
  statesData,
  totalDisbursed,
  selectedState = "all",
  onSelectState,
  selectedZone = "all",
}: NigeriaImpactMapProps) {
  const [viewMode, setViewMode] = useState<"map" | "table">("map");
  const [hoveredStateCode, setHoveredStateCode] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<"disbursed" | "enterprises" | "jobs" | "performingRatio">("disbursed");
  const [sortAsc, setSortAsc] = useState(false);

  // Map state names to summary data for fast lookup
  const stateDataMap = useMemo(() => {
    const map = new Map<string, StateSummary>();
    for (const s of statesData) {
      map.set(s.state.toLowerCase(), s);
    }
    return map;
  }, [statesData]);

  // Max disbursed for choropleth scale
  const maxStateDisbursed = useMemo(() => {
    let max = 1;
    for (const s of statesData) {
      if (s.disbursed > max) max = s.disbursed;
    }
    return max;
  }, [statesData]);

  // Filtered & sorted states for the table view
  const filteredAndSortedStates = useMemo(() => {
    let list = statesData.filter((s) => {
      if (selectedZone !== "all" && s.zone !== selectedZone) return false;
      if (searchQuery.trim() !== "") {
        return s.state.toLowerCase().includes(searchQuery.toLowerCase().trim());
      }
      return true;
    });

    list.sort((a, b) => {
      const valA = a[sortField];
      const valB = b[sortField];
      return sortAsc ? (valA > valB ? 1 : -1) : (valA < valB ? 1 : -1);
    });

    return list;
  }, [statesData, selectedZone, searchQuery, sortField, sortAsc]);

  // Active hover/selected state metadata
  const activeMeta = useMemo(() => {
    if (hoveredStateCode) {
      return NIGERIA_STATES.find((s) => s.code === hoveredStateCode) || null;
    }
    if (selectedState && selectedState !== "all") {
      return NIGERIA_STATES.find((s) => s.name.toLowerCase() === selectedState.toLowerCase()) || null;
    }
    return null;
  }, [hoveredStateCode, selectedState]);

  const activeData = useMemo(() => {
    if (!activeMeta) return null;
    return stateDataMap.get(activeMeta.name.toLowerCase()) || null;
  }, [activeMeta, stateDataMap]);

  // Choropleth color generator based on institutional green scale
  const getFillColor = (disbursed: number, isHighlighted: boolean, isFilteredOut: boolean) => {
    if (isFilteredOut) return "#E8ECE9";
    if (disbursed === 0) return "#EDF1EE";
    const ratio = Math.min(1, disbursed / maxStateDisbursed);
    if (isHighlighted) return "#0B4738"; // Deepest green
    if (ratio > 0.75) return "#0B6B4F"; // Primary green
    if (ratio > 0.5) return "#228B65";
    if (ratio > 0.25) return "#5EAB8E";
    return "#A1CFBD"; // Light muted sage green
  };

  return (
    <div className="bg-white border border-[#DDE5DF] rounded-md shadow-sm overflow-hidden flex flex-col h-full">
      {/* Top Header & View Toggle */}
      <div className="px-5 py-3.5 border-b border-[#DDE5DF] bg-[#FAFBF9] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-[#0B6B4F]" aria-hidden="true" />
          <h3 className="text-sm font-semibold text-[#17201C] uppercase tracking-wide">
            Sub-National Geographic Allocation &amp; Territorial Drill-Down
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <div className="inline-flex rounded-md border border-[#DDE5DF] bg-white p-0.5 text-xs">
            <button
              type="button"
              onClick={() => setViewMode("map")}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                viewMode === "map"
                  ? "bg-[#0B6B4F] text-white"
                  : "text-[#667169] hover:text-[#17201C]"
              }`}
              aria-label="Switch to map view"
            >
              <MapIcon className="w-3.5 h-3.5" aria-hidden="true" />
              Map View
            </button>
            <button
              type="button"
              onClick={() => setViewMode("table")}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                viewMode === "table"
                  ? "bg-[#0B6B4F] text-white"
                  : "text-[#667169] hover:text-[#17201C]"
              }`}
              aria-label="Switch to table view"
            >
              <TableIcon className="w-3.5 h-3.5" aria-hidden="true" />
              State Table
            </button>
          </div>

          {selectedState !== "all" && (
            <button
              type="button"
              onClick={() => onSelectState("all")}
              className="text-xs text-[#0B6B4F] hover:underline font-medium ml-2"
            >
              Reset State
            </button>
          )}
        </div>
      </div>

      {/* Main View Area */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col">
        {viewMode === "map" ? (
          <div className="flex flex-col lg:flex-row gap-5 items-stretch flex-1">
            {/* SVG Choropleth Map */}
            <div className="flex-1 bg-[#FAFBF9] border border-[#DDE5DF] rounded p-3 relative flex items-center justify-center min-h-[380px]">
              <svg
                viewBox="100 80 820 660"
                className="w-full h-auto max-h-[440px] select-none"
                aria-label="Map of Nigeria depicting state-by-state credit distribution"
              >
                {/* Background Grid Lines for Technical Institutional Look */}
                <defs>
                  <pattern id="gridPattern" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#E6ECE7" strokeWidth="0.5" />
                  </pattern>
                </defs>
                <rect x="100" y="80" width="820" height="660" fill="url(#gridPattern)" />

                {/* State Hub Nodes & Boundary Bubbles */}
                {NIGERIA_STATES.map((state) => {
                  const sData = stateDataMap.get(state.name.toLowerCase());
                  const disbursed = sData ? sData.disbursed : 0;
                  const isSelected = selectedState.toLowerCase() === state.name.toLowerCase();
                  const isHovered = hoveredStateCode === state.code;
                  const isFilteredOut = selectedZone !== "all" && state.zone !== selectedZone;

                  const fillColor = getFillColor(disbursed, isSelected || isHovered, isFilteredOut);
                  const circleRadius = isSelected || isHovered ? 26 : Math.max(16, Math.min(24, 16 + (disbursed / maxStateDisbursed) * 10));

                  return (
                    <g
                      key={state.code}
                      transform={`translate(${state.x}, ${state.y})`}
                      className={`cursor-pointer transition-all duration-150 ${isFilteredOut ? "opacity-35" : "opacity-100"}`}
                      onClick={() => {
                        if (!isFilteredOut) {
                          onSelectState(isSelected ? "all" : state.name);
                        }
                      }}
                      onMouseEnter={() => setHoveredStateCode(state.code)}
                      onMouseLeave={() => setHoveredStateCode(null)}
                      role="button"
                      tabIndex={0}
                      aria-label={`${state.name}: ${formatNairaCompact(disbursed)} disbursed`}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          onSelectState(isSelected ? "all" : state.name);
                        }
                      }}
                    >
                      {/* Selection Ring */}
                      {(isSelected || isHovered) && (
                        <circle
                          r={circleRadius + 4}
                          fill="none"
                          stroke={isSelected ? "#0B4738" : "#0B6B4F"}
                          strokeWidth="2.5"
                          strokeDasharray={isSelected ? undefined : "3 3"}
                        />
                      )}

                      {/* State Choropleth Node */}
                      <circle
                        r={circleRadius}
                        fill={fillColor}
                        stroke="#FFFFFF"
                        strokeWidth="1.5"
                        className="transition-colors"
                      />

                      {/* State Label */}
                      <text
                        textAnchor="middle"
                        dy="0.35em"
                        fill={disbursed > maxStateDisbursed * 0.4 ? "#FFFFFF" : "#17201C"}
                        fontSize={circleRadius > 20 ? "11px" : "10px"}
                        fontWeight="bold"
                        fontFamily="var(--font-sans), system-ui, sans-serif"
                        pointerEvents="none"
                      >
                        {state.code}
                      </text>
                    </g>
                  );
                })}
              </svg>

              {/* Legend overlay at bottom-left */}
              <div className="absolute bottom-2 left-2 bg-white/95 border border-[#DDE5DF] px-2.5 py-1.5 rounded text-[10px] text-[#667169] shadow-sm backdrop-blur-none">
                <span className="font-semibold text-[#17201C] block mb-1">Disbursement Volume</span>
                <div className="flex items-center gap-1">
                  <span className="w-3 h-2.5 bg-[#EDF1EE] border border-[#DDE5DF]" />
                  <span>Low</span>
                  <span className="w-3 h-2.5 bg-[#A1CFBD]" />
                  <span className="w-3 h-2.5 bg-[#5EAB8E]" />
                  <span className="w-3 h-2.5 bg-[#0B6B4F]" />
                  <span className="w-3 h-2.5 bg-[#0B4738]" />
                  <span>High</span>
                </div>
              </div>
            </div>

            {/* Right Information Panel for Hovered / Selected State */}
            <div className="w-full lg:w-80 border border-[#DDE5DF] rounded p-4 bg-[#FAFBF9] flex flex-col justify-between">
              {activeMeta && activeData ? (
                <div>
                  <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#DDE5DF]">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#0B6B4F] tracking-wider block">
                        {activeMeta.zone} Zone
                      </span>
                      <h4 className="text-base font-bold text-[#17201C] font-serif">
                        {activeMeta.name} State
                      </h4>
                      <span className="text-xs text-[#667169]">
                        Capital: {activeMeta.capital}
                      </span>
                    </div>
                    {selectedState.toLowerCase() === activeMeta.name.toLowerCase() && (
                      <span className="text-[10px] bg-[#0B6B4F] text-white px-2 py-0.5 rounded font-medium">
                        Filtered
                      </span>
                    )}
                  </div>

                  <div className="space-y-2.5 text-xs mb-4">
                    <div className="flex justify-between py-1 border-b border-[#E8ECE9]">
                      <span className="text-[#667169]">Total Disbursed:</span>
                      <span className="font-bold text-[#0B4738] tabular-nums">
                        {formatNairaCompact(activeData.disbursed)}
                      </span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-[#E8ECE9]">
                      <span className="text-[#667169]">National Share:</span>
                      <span className="font-semibold text-[#17201C] tabular-nums">
                        {formatPercent(totalDisbursed > 0 ? (activeData.disbursed / totalDisbursed) * 100 : 0)}
                      </span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-[#E8ECE9]">
                      <span className="text-[#667169]">Enterprises Financed:</span>
                      <span className="font-semibold text-[#17201C] tabular-nums">
                        {formatNumber(activeData.enterprises)}
                      </span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-[#E8ECE9]">
                      <span className="text-[#667169]">Jobs Supported:</span>
                      <span className="font-semibold text-[#17201C] tabular-nums">
                        {formatNumber(activeData.jobs)}
                      </span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-[#E8ECE9]">
                      <span className="text-[#667169]">Performing Ratio:</span>
                      <span className="font-semibold text-[#0B6B4F] tabular-nums">
                        {formatPercent(activeData.performingRatio)}
                      </span>
                    </div>
                  </div>

                  <p className="text-[11px] text-[#667169] mb-4">
                    Exact Total: <strong className="tabular-nums text-[#17201C]">{formatNairaFull(activeData.disbursed)}</strong>
                  </p>
                </div>
              ) : (
                <div className="my-auto text-center py-8">
                  <MapPin className="w-8 h-8 text-[#0B6B4F] mx-auto mb-2 opacity-50" aria-hidden="true" />
                  <h4 className="text-sm font-semibold text-[#17201C] mb-1">Select a State</h4>
                  <p className="text-xs text-[#667169] max-w-[220px] mx-auto">
                    Hover over or click any state hub on the map to inspect granular balance sheet and impact metrics.
                  </p>
                </div>
              )}

              {activeMeta && (
                <button
                  type="button"
                  onClick={() => onSelectState(selectedState.toLowerCase() === activeMeta.name.toLowerCase() ? "all" : activeMeta.name)}
                  className="w-full py-2 px-3 text-xs font-semibold rounded bg-[#0B6B4F] hover:bg-[#0B4738] text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B6B4F]"
                >
                  {selectedState.toLowerCase() === activeMeta.name.toLowerCase()
                    ? `Clear Filter (${activeMeta.name})`
                    : `Filter Entire Portal to ${activeMeta.name}`}
                </button>
              )}
            </div>
          </div>
        ) : (
          /* Table View for Complete Scannable Record Lookup */
          <div className="flex flex-col flex-1">
            {/* Table Search & Filter Bar */}
            <div className="flex items-center justify-between gap-3 mb-3">
              <input
                type="text"
                placeholder="Search state name (e.g. Lagos, Kano, Rivers)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="text-xs border border-[#DDE5DF] rounded px-3 py-1.5 w-64 max-w-full focus:outline-none focus:border-[#0B6B4F]"
              />
              <span className="text-xs text-[#667169] tabular-nums">
                Showing {filteredAndSortedStates.length} of 37 territories
              </span>
            </div>

            {/* Scrollable, Dense, Accessible Table */}
            <div className="border border-[#DDE5DF] rounded overflow-x-auto flex-1 max-h-[460px]">
              <table className="w-full text-left border-collapse text-xs">
                <thead className="bg-[#FAFBF9] border-b border-[#DDE5DF] sticky top-0 z-10 text-[#667169]">
                  <tr>
                    <th scope="col" className="p-2.5 font-semibold">Territory</th>
                    <th scope="col" className="p-2.5 font-semibold">Zone</th>
                    <th
                      scope="col"
                      className="p-2.5 font-semibold text-right cursor-pointer hover:text-[#17201C]"
                      onClick={() => {
                        if (sortField === "disbursed") setSortAsc(!sortAsc);
                        else { setSortField("disbursed"); setSortAsc(false); }
                      }}
                    >
                      <span className="inline-flex items-center gap-1 justify-end">
                        Disbursed (NGN)
                        <ArrowUpDown className="w-3 h-3" />
                      </span>
                    </th>
                    <th
                      scope="col"
                      className="p-2.5 font-semibold text-right cursor-pointer hover:text-[#17201C]"
                      onClick={() => {
                        if (sortField === "enterprises") setSortAsc(!sortAsc);
                        else { setSortField("enterprises"); setSortAsc(false); }
                      }}
                    >
                      <span className="inline-flex items-center gap-1 justify-end">
                        Enterprises
                        <ArrowUpDown className="w-3 h-3" />
                      </span>
                    </th>
                    <th
                      scope="col"
                      className="p-2.5 font-semibold text-right cursor-pointer hover:text-[#17201C]"
                      onClick={() => {
                        if (sortField === "jobs") setSortAsc(!sortAsc);
                        else { setSortField("jobs"); setSortAsc(false); }
                      }}
                    >
                      <span className="inline-flex items-center gap-1 justify-end">
                        Jobs
                        <ArrowUpDown className="w-3 h-3" />
                      </span>
                    </th>
                    <th
                      scope="col"
                      className="p-2.5 font-semibold text-right cursor-pointer hover:text-[#17201C]"
                      onClick={() => {
                        if (sortField === "performingRatio") setSortAsc(!sortAsc);
                        else { setSortField("performingRatio"); setSortAsc(false); }
                      }}
                    >
                      <span className="inline-flex items-center gap-1 justify-end">
                        Performing %
                        <ArrowUpDown className="w-3 h-3" />
                      </span>
                    </th>
                    <th scope="col" className="p-2.5 font-semibold text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8ECE9]">
                  {filteredAndSortedStates.map((st) => {
                    const isSelected = selectedState.toLowerCase() === st.state.toLowerCase();
                    return (
                      <tr
                        key={st.state}
                        className={`hover:bg-[#FAFBF9] transition-colors ${
                          isSelected ? "bg-[#EDF5F1] font-medium" : ""
                        }`}
                      >
                        <td className="p-2.5 font-medium text-[#17201C]">
                          {st.state}
                        </td>
                        <td className="p-2.5 text-[#667169]">{st.zone}</td>
                        <td className="p-2.5 text-right font-semibold text-[#0B4738] tabular-nums">
                          {formatNairaCompact(st.disbursed)}
                        </td>
                        <td className="p-2.5 text-right tabular-nums text-[#17201C]">
                          {formatNumber(st.enterprises)}
                        </td>
                        <td className="p-2.5 text-right tabular-nums text-[#17201C]">
                          {formatNumber(st.jobs)}
                        </td>
                        <td className="p-2.5 text-right tabular-nums text-[#0B6B4F]">
                          {formatPercent(st.performingRatio)}
                        </td>
                        <td className="p-2.5 text-center">
                          <button
                            type="button"
                            onClick={() => onSelectState(isSelected ? "all" : st.state)}
                            className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                              isSelected
                                ? "bg-[#0B6B4F] text-white"
                                : "border border-[#DDE5DF] text-[#0B6B4F] hover:bg-[#EDF5F1]"
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
        )}
      </div>
    </div>
  );
}
