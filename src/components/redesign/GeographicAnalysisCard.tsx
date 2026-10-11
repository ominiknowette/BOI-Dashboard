"use client";

import React, { useState } from "react";
import { StateSummary, ZoneSummary, GeopoliticalZone } from "@/types/dataset";
import { NigeriaImpactMap } from "@/components/map/NigeriaImpactMap";
import { formatNairaCompact, formatNumber, formatPercent } from "@/lib/utils/formatters";
import { MapPin, Table as TableIcon, Map as MapIcon, ChevronRight } from "lucide-react";

interface GeographicAnalysisCardProps {
  statesData: StateSummary[];
  zonesData: ZoneSummary[];
  totalDisbursed: number;
  selectedState?: string;
  onSelectState: (state: string) => void;
  selectedZone?: GeopoliticalZone | "all";
  onSelectZone: (zone: GeopoliticalZone | "all") => void;
}

export function GeographicAnalysisCard({
  statesData,
  zonesData,
  totalDisbursed,
  selectedState = "all",
  onSelectState,
  selectedZone = "all",
  onSelectZone,
}: GeographicAnalysisCardProps) {
  const [activeTab, setActiveTab] = useState<"map" | "zones">("map");

  return (
    <div className="bg-white rounded-card p-5 border border-border shadow-card">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-4 border-b border-border/60">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-tile bg-[#F2F4F7] flex items-center justify-center text-deep-green">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-ink tracking-tight">
                Sub-National Allocation & Territorial Drill-Down
              </h3>
              <p className="text-xs font-medium text-ink-muted">
                Capital deployed across 36 Nigerian States + FCT & 6 Geopolitical Zones
              </p>
            </div>
          </div>
        </div>

        {/* View Switcher: Map + Table vs Zonal Rankings */}
        <div className="flex items-center gap-2">
          {selectedZone !== "all" && (
            <button
              type="button"
              onClick={() => onSelectZone("all")}
              className="text-xs font-semibold text-deep-green bg-soft-green px-2.5 py-1 rounded-md hover:bg-soft-green/80 transition-all flex items-center gap-1"
            >
              <span>Zone: {selectedZone}</span>
              <span className="text-xs font-bold">×</span>
            </button>
          )}

          {selectedState !== "all" && (
            <button
              type="button"
              onClick={() => onSelectState("all")}
              className="text-xs font-semibold text-deep-green bg-soft-green px-2.5 py-1 rounded-md hover:bg-soft-green/80 transition-all flex items-center gap-1"
            >
              <span>State: {selectedState}</span>
              <span className="text-xs font-bold">×</span>
            </button>
          )}
        </div>
      </div>

      {/* Grid: Left Map/Table (8 cols) + Right Geopolitical Zone List (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Interactive Map & State Table */}
        <div className="lg:col-span-8 bg-[#F8F9FA] p-3 sm:p-4 rounded-xl border border-border/60">
          <NigeriaImpactMap
            statesData={statesData}
            totalDisbursed={totalDisbursed}
            selectedState={selectedState}
            onSelectState={onSelectState}
            selectedZone={selectedZone}
            hideTitle={true}
          />
        </div>

        {/* Right Column: Ranked Geopolitical Zones */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-border/60">
            <h4 className="text-xs font-bold uppercase tracking-wider text-ink-muted">
              Geopolitical Zones Ranked
            </h4>
            <span className="text-[11px] font-medium text-ink-muted">
              Share of Capital
            </span>
          </div>

          <div className="space-y-2">
            {zonesData.map((zone) => {
              const isSelected = selectedZone === zone.zone;
              const share = totalDisbursed > 0 ? (zone.disbursed / totalDisbursed) * 100 : 0;

              return (
                <button
                  key={zone.zone}
                  type="button"
                  onClick={() => onSelectZone(isSelected ? "all" : zone.zone)}
                  className={`w-full text-left p-3 rounded-xl border transition-all ${
                    isSelected
                      ? "bg-soft-green/50 border-primary-green ring-1 ring-primary-green"
                      : "bg-white hover:bg-[#F8F9FA] border-border"
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-bold text-ink flex items-center gap-1.5">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          isSelected ? "bg-primary-green" : "bg-deep-green"
                        }`}
                      />
                      <span>{zone.zone}</span>
                    </span>
                    <span className="font-bold text-ink tabular-nums">
                      {formatNairaCompact(zone.disbursed)}
                    </span>
                  </div>

                  {/* Progress Bar & Details */}
                  <div className="w-full h-1.5 bg-[#EAECF0] rounded-full overflow-hidden mb-2">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        isSelected ? "bg-primary-green" : "bg-deep-green"
                      }`}
                      style={{ width: `${Math.min(100, Math.max(8, share))}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-ink-muted">
                    <span>
                      {formatNumber(zone.enterprises)} Enterprises • {formatNumber(zone.jobs)} Jobs
                    </span>
                    <span className="font-semibold text-deep-green tabular-nums">
                      {formatPercent(share)}
                    </span>
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
