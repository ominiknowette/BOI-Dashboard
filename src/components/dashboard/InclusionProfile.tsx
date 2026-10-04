"use client";

import React from "react";
import { SegmentSummary, EnterpriseSegment } from "@/types/dataset";
import { formatNairaCompact, formatNumber, formatPercent } from "@/lib/utils/formatters";
import { Users, Sparkles, Building2, UserCheck } from "lucide-react";

interface InclusionProfileProps {
  segments: SegmentSummary[];
  totalDisbursed: number;
  womenLedCount: number;
  womenLedDisbursed: number;
  womenLedPercentage: number;
  youthLedCount: number;
  youthLedDisbursed: number;
  youthLedPercentage: number;
  selectedSegment?: EnterpriseSegment | "all";
  onSelectSegment: (segment: EnterpriseSegment | "all") => void;
}

export function InclusionProfile({
  segments,
  totalDisbursed,
  womenLedCount,
  womenLedDisbursed,
  womenLedPercentage,
  youthLedCount,
  youthLedDisbursed,
  youthLedPercentage,
  selectedSegment = "all",
  onSelectSegment,
}: InclusionProfileProps) {
  const maxSegmentDisbursed = Math.max(...segments.map((s) => s.disbursed), 1);

  return (
    <div className="bg-white border border-[#DDE5DF] rounded-md shadow-sm p-5 flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#DDE5DF]">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-[#0B6B4F]" aria-hidden="true" />
          <h3 className="text-sm font-semibold text-[#17201C] uppercase tracking-wide">
            Enterprise Scale &amp; Demographic Inclusion Profile
          </h3>
        </div>
        {selectedSegment !== "all" && (
          <button
            type="button"
            onClick={() => onSelectSegment("all")}
            className="text-xs text-[#0B6B4F] hover:underline font-medium"
          >
            Clear Segment
          </button>
        )}
      </div>

      {/* Demographic Spotlight Banners (Women-led & Youth-led) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
        {/* Women-Led */}
        <div className="p-3.5 rounded border border-[#DDE5DF] bg-[#FAFBF9]">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-semibold text-[#17201C] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#0B6B4F]" />
              Women-Led Enterprises
            </span>
            <span className="font-bold text-[#0B6B4F] tabular-nums">
              {formatPercent(womenLedPercentage)} of capital
            </span>
          </div>
          <div className="flex items-baseline justify-between text-xs">
            <span className="text-base font-bold text-[#0B4738] tabular-nums">
              {formatNairaCompact(womenLedDisbursed)}
            </span>
            <span className="text-[11px] text-[#667169] tabular-nums">
              {formatNumber(womenLedCount)} enterprises funded
            </span>
          </div>
        </div>

        {/* Youth-Led */}
        <div className="p-3.5 rounded border border-[#DDE5DF] bg-[#FAFBF9]">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-semibold text-[#17201C] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#C59A32]" />
              Youth-Led Enterprises (&lt;35 yrs)
            </span>
            <span className="font-bold text-[#C59A32] tabular-nums">
              {formatPercent(youthLedPercentage)} of capital
            </span>
          </div>
          <div className="flex items-baseline justify-between text-xs">
            <span className="text-base font-bold text-[#17201C] tabular-nums">
              {formatNairaCompact(youthLedDisbursed)}
            </span>
            <span className="text-[11px] text-[#667169] tabular-nums">
              {formatNumber(youthLedCount)} enterprises funded
            </span>
          </div>
        </div>
      </div>

      <p className="text-xs text-[#667169] mb-3">
        Credit distribution by enterprise scale from Nano micro-credits to Large Industrial operations:
      </p>

      {/* Segments breakdown */}
      <div className="space-y-3 flex-1 flex flex-col justify-around">
        {segments.map((seg) => {
          const share = totalDisbursed > 0 ? (seg.disbursed / totalDisbursed) * 100 : 0;
          const barWidth = (seg.disbursed / maxSegmentDisbursed) * 100;
          const isSelected = selectedSegment === seg.segment;

          return (
            <div
              key={seg.segment}
              onClick={() => onSelectSegment(isSelected ? "all" : seg.segment)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onSelectSegment(isSelected ? "all" : seg.segment);
                }
              }}
              className={`p-2.5 rounded transition-all cursor-pointer border ${
                isSelected
                  ? "bg-[#EDF5F1] border-[#0B6B4F] ring-1 ring-[#0B6B4F]"
                  : "bg-white border-transparent hover:border-[#DDE5DF] hover:bg-[#FAFBF9]"
              }`}
            >
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-semibold text-[#17201C]">
                  {seg.segment}
                </span>
                <div className="text-right">
                  <span className="font-bold text-[#0B4738] tabular-nums">
                    {formatNairaCompact(seg.disbursed)}
                  </span>
                  <span className="text-[11px] text-[#667169] ml-1.5 tabular-nums">
                    ({formatPercent(share)})
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-[#E8ECE9] h-2 rounded-full overflow-hidden mb-1.5">
                <div
                  className="h-full bg-[#0B6B4F] rounded-full transition-all duration-300"
                  style={{ width: `${Math.max(2, barWidth)}%` }}
                />
              </div>

              {/* Sub metrics */}
              <div className="flex items-center justify-between text-[11px] text-[#667169] tabular-nums">
                <span>{formatNumber(seg.enterprises)} enterprises</span>
                <span>{formatNumber(seg.jobs)} jobs</span>
                <span>
                  ♀ {formatNumber(seg.womenLedCount)} | ⚲ {formatNumber(seg.youthLedCount)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
