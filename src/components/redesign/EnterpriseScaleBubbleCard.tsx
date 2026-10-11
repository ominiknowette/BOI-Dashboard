"use client";

import React, { useMemo } from "react";
import { hierarchy, pack } from "d3-hierarchy";
import { SegmentSummary } from "@/types/dataset";
import { formatNairaCompact, formatPercent, formatNumber } from "@/lib/utils/formatters";
import { Building2, ChevronDown } from "lucide-react";

interface EnterpriseScaleBubbleCardProps {
  segments: SegmentSummary[];
  totalDisbursed: number;
}

// Tonal green palette matching PinenMFB overlapping circles
const BUBBLE_COLORS = [
  "#064B34", // Very dark BOI green
  "#185744", // Deep green
  "#038E46", // Primary green
  "#22C55E", // Bright mint green
  "#86EFAC", // Soft lime green
];

export function EnterpriseScaleBubbleCard({
  segments,
  totalDisbursed,
}: EnterpriseScaleBubbleCardProps) {
  // Sort segments by disbursed capital for consistent hierarchy
  const sortedSegments = useMemo(() => {
    return [...segments].sort((a, b) => b.disbursed - a.disbursed);
  }, [segments]);

  // Use d3-hierarchy pack to compute mathematically sound, proportional circle coordinates
  const packedCircles = useMemo(() => {
    const width = 160;
    const height = 160;

    const rootData = {
      name: "root",
      children: sortedSegments.map((s) => ({
        ...s,
        value: s.disbursed > 0 ? s.disbursed : 1,
      })),
    };

    const root = hierarchy(rootData).sum((d: any) => d.value);
    const packLayout = pack().size([width, height]).padding(2);
    packLayout(root as any);

    return (root.leaves() as any[]).map((leaf, index) => {
      const seg = leaf.data as SegmentSummary;
      const share = totalDisbursed > 0 ? (seg.disbursed / totalDisbursed) * 100 : 0;
      return {
        name: seg.segment,
        disbursed: seg.disbursed,
        enterprises: seg.enterprises,
        share,
        x: leaf.x,
        y: leaf.y,
        r: leaf.r,
        color: BUBBLE_COLORS[index % BUBBLE_COLORS.length],
      };
    });
  }, [sortedSegments, totalDisbursed]);

  const maxDisbursed = Math.max(...segments.map((s) => s.disbursed), 1);

  return (
    <div className="bg-white rounded-card p-5 border border-border shadow-card flex flex-col justify-between h-full">
      {/* Card Header matching "Customer Growth" */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-base font-bold text-ink tracking-tight">
            Enterprise Scale
          </h3>
          <p className="text-xs font-medium text-ink-muted">
            Credit allocation across enterprise tiers
          </p>
        </div>

        <div className="flex items-center gap-1 text-[11px] font-semibold text-ink-muted bg-[#F2F4F7] px-2.5 py-1 rounded-md">
          <span>Active</span>
          <ChevronDown className="w-3 h-3 text-ink-muted" />
        </div>
      </div>

      {/* Two Column Layout: Left Bubble Cluster + Right Ranked List */}
      <div className="flex flex-col xl:flex-row items-center gap-4">
        {/* Left: D3 Packed Overlapping Bubble Cluster */}
        <div className="w-full xl:w-[130px] flex items-center justify-center shrink-0">
          <div className="relative w-[120px] h-[120px]">
            <svg
              viewBox="0 0 160 160"
              className="w-full h-full drop-shadow-xs overflow-visible"
              aria-label="Enterprise scale proportional bubble visual"
            >
              {packedCircles.map((circle) => (
                <g key={circle.name} className="transition-all hover:opacity-90 cursor-default">
                  <circle
                    cx={circle.x}
                    cy={circle.y}
                    r={circle.r}
                    fill={circle.color}
                    fillOpacity={0.92}
                    stroke="#FFFFFF"
                    strokeWidth={1.5}
                  />
                  {circle.r > 14 && (
                    <text
                      x={circle.x}
                      y={circle.y}
                      dy="0.35em"
                      textAnchor="middle"
                      fill="#FFFFFF"
                      fontSize={circle.r > 24 ? "12px" : "10px"}
                      fontWeight="bold"
                      className="pointer-events-none select-none tabular-nums"
                    >
                      {`${Math.round(circle.share)}%`}
                    </text>
                  )}
                </g>
              ))}
            </svg>
          </div>
        </div>

        {/* Right: Ranked List with Mini Progress Bars matching reference */}
        <div className="flex-1 w-full space-y-2">
          {sortedSegments.map((item) => {
            const barWidth = Math.max(8, Math.round((item.disbursed / maxDisbursed) * 100));
            const share = totalDisbursed > 0 ? (item.disbursed / totalDisbursed) * 100 : 0;

            return (
              <div key={item.segment} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-ink truncate flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-deep-green" />
                    <span>{item.segment}</span>
                  </span>
                  <div className="flex items-center gap-1.5 shrink-0 text-ink-muted text-[11px] font-medium tabular-nums">
                    <span>{formatNairaCompact(item.disbursed)}</span>
                    <span className="text-ink font-bold">({formatPercent(share)})</span>
                  </div>
                </div>

                {/* Progress bar matching flags/bars in Customer Growth */}
                <div className="w-full h-1.5 bg-[#F2F4F7] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-deep-green rounded-full transition-all duration-300"
                    style={{ width: `${barWidth}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Insight Line */}
      <div className="mt-3 pt-2.5 border-t border-border/60 flex items-center justify-between text-[11px] text-ink-muted">
        <span>Nano + Micro + Small Coverage:</span>
        <span className="font-bold text-deep-green tabular-nums">
          {formatPercent(
            totalDisbursed > 0
              ? (segments
                  .filter((s) => s.segment === "Nano" || s.segment === "Micro" || s.segment === "Small")
                  .reduce((acc, s) => acc + s.disbursed, 0) /
                  totalDisbursed) *
                  100
              : 0
          )}
        </span>
      </div>
    </div>
  );
}
