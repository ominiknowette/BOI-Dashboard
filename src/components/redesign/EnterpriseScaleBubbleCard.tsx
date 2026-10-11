"use client";

import React, { useMemo } from "react";
import { hierarchy, pack } from "d3-hierarchy";
import { SegmentSummary } from "@/types/dataset";
import { formatNairaCompact, formatPercent } from "@/lib/utils/formatters";
import { ChevronDown } from "lucide-react";

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

  // Use d3-hierarchy pack with balanced sizing so small tiers remain clear and legible
  const packedCircles = useMemo(() => {
    const size = 160;

    // Use square root scaling for visual hierarchy so Nano/Micro don't disappear into 2px dots
    const rootData = {
      name: "root",
      children: sortedSegments.map((s) => ({
        ...s,
        // Sqrt scale provides visual contrast while preserving legibility
        value: s.disbursed > 0 ? Math.sqrt(s.disbursed) : 1,
      })),
    };

    const root = hierarchy(rootData).sum((d: any) => d.value);
    const packLayout = pack().size([size, size]).padding(3);
    packLayout(root as any);

    return (root.leaves() as any[]).map((leaf, index) => {
      const seg = leaf.data as SegmentSummary;
      const share =
        totalDisbursed > 0 ? (seg.disbursed / totalDisbursed) * 100 : 0;
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
      <div className="flex items-center justify-between mb-3 shrink-0">
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

      {/* Layout: 42% Bubble Visual / 58% Ranked List on wide viewports; clean centered stack when card width is compact */}
      <div className="flex flex-col 2xl:flex-row items-center gap-4 my-auto">
        {/* Left: D3 Packed Overlapping Bubble Cluster (40-45% width on 2xl) */}
        <div className="w-full 2xl:w-[42%] flex items-center justify-center shrink-0">
          <div className="relative w-[110px] h-[110px] 2xl:w-[125px] 2xl:h-[125px] max-w-full">
            <svg
              viewBox="0 0 160 160"
              className="w-full h-full drop-shadow-xs overflow-visible"
              aria-label="Enterprise scale proportional bubble visual"
            >
              {packedCircles.map((circle) => (
                <g
                  key={circle.name}
                  className="transition-all hover:opacity-90 cursor-default"
                >
                  <circle
                    cx={circle.x}
                    cy={circle.y}
                    r={circle.r}
                    fill={circle.color}
                    fillOpacity={0.94}
                    stroke="#FFFFFF"
                    strokeWidth={1.5}
                  >
                    <title>{`${circle.name}: ${formatNairaCompact(
                      circle.disbursed
                    )} (${formatPercent(circle.share)})`}</title>
                  </circle>
                  {circle.r > 15 && (
                    <text
                      x={circle.x}
                      y={circle.y}
                      dy="0.35em"
                      textAnchor="middle"
                      fill="#FFFFFF"
                      fontSize={circle.r > 26 ? "12px" : "10px"}
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

        {/* Right: Ranked List with Mini Progress Bars (55-60% width on 2xl, full width on stack) */}
        <div className="w-full 2xl:w-[58%] flex-1 flex flex-col justify-center space-y-2">
          {sortedSegments.map((item, idx) => {
            const barWidth = Math.max(
              6,
              Math.round((item.disbursed / maxDisbursed) * 100)
            );
            const share =
              totalDisbursed > 0 ? (item.disbursed / totalDisbursed) * 100 : 0;
            const dotColor = BUBBLE_COLORS[idx % BUBBLE_COLORS.length];

            return (
              <div key={item.segment} className="space-y-1">
                <div className="flex items-center justify-between text-xs gap-1">
                  <span className="font-semibold text-ink truncate flex items-center gap-1.5 min-w-0">
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: dotColor }}
                    />
                    <span className="truncate">{item.segment}</span>
                  </span>
                  <div className="flex items-center gap-1 shrink-0 text-ink-muted text-[11px] font-medium tabular-nums ml-auto">
                    <span>{formatNairaCompact(item.disbursed)}</span>
                    <span className="text-ink font-bold">
                      ({formatPercent(share)})
                    </span>
                  </div>
                </div>

                {/* Progress bar matching flags/bars in Customer Growth */}
                <div className="w-full h-1.5 bg-[#F2F4F7] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${barWidth}%`,
                      backgroundColor: dotColor,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Insight Line */}
      <div className="mt-3 pt-2.5 border-t border-border/60 flex items-center justify-between text-[11px] text-ink-muted shrink-0">
        <span>Nano + Micro + Small Coverage:</span>
        <span className="font-bold text-deep-green tabular-nums">
          {formatPercent(
            totalDisbursed > 0
              ? (segments
                  .filter(
                    (s) =>
                      s.segment === "Nano" ||
                      s.segment === "Micro" ||
                      s.segment === "Small"
                  )
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
