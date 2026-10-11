"use client";

import React, { useMemo } from "react";
import { hierarchy, pack } from "d3-hierarchy";
import { useDashboardFilter } from "@/context/DashboardFilterContext";
import { EmptyState } from "@/components/common/EmptyState";
import { formatNairaCompact, formatPercent, formatNumber } from "@/lib/utils/formatters";
import { Users, Building2, CheckCircle2 } from "lucide-react";
import { SegmentSummary } from "@/types/dataset";

const BUBBLE_COLORS = [
  "#064B34", // Very dark BOI green
  "#185744", // Deep green
  "#038E46", // Primary green
  "#22C55E", // Bright mint green
  "#86EFAC", // Soft lime green
];

export default function InclusionScaleView() {
  const {
    filteredRecords,
    metrics,
    segmentSummary,
    filters,
    handleToggleWomen,
    handleToggleYouth,
    handleResetFilters,
  } = useDashboardFilter();

  // Sort segments by capital disbursed
  const sortedSegments = useMemo(() => {
    return [...segmentSummary].sort((a, b) => b.disbursed - a.disbursed);
  }, [segmentSummary]);

  // D3 Packed Circles for large rich display
  const packedCircles = useMemo(() => {
    const size = 260;
    const rootData = {
      name: "root",
      children: sortedSegments.map((s) => ({
        ...s,
        value: s.disbursed > 0 ? Math.sqrt(s.disbursed) : 1,
      })),
    };

    const root = hierarchy(rootData).sum((d: any) => d.value);
    const packLayout = pack().size([size, size]).padding(6);
    packLayout(root as any);

    return (root.leaves() as any[]).map((leaf, index) => {
      const seg = leaf.data as SegmentSummary;
      const share =
        metrics.totalDisbursed > 0
          ? (seg.disbursed / metrics.totalDisbursed) * 100
          : 0;
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
  }, [sortedSegments, metrics.totalDisbursed]);

  if (filteredRecords.length === 0) {
    return <EmptyState onReset={handleResetFilters} />;
  }

  const totalEnterprises = segmentSummary.reduce((acc, s) => acc + s.enterprises, 0);

  return (
    <div className="space-y-6">
      {/* Inclusion KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Women-Led Metric */}
        <div
          onClick={handleToggleWomen}
          className={`bg-white rounded-xl p-4 border transition-all cursor-pointer ${
            filters.womenLed === true
              ? "border-deep-green ring-2 ring-soft-green shadow-sm"
              : "border-border hover:border-deep-green/40 shadow-xs"
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-ink-muted">
              Women-Led Enterprises
            </span>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                filters.womenLed === true
                  ? "bg-deep-green text-white"
                  : "bg-soft-green text-deep-green"
              }`}
            >
              {filters.womenLed === true ? "Filtered" : "Click to Filter"}
            </span>
          </div>
          <div className="text-2xl font-bold text-deep-green tabular-nums">
            {formatPercent(metrics.womenLedPercentage)}
          </div>
          <div className="text-[11px] text-ink-muted mt-0.5 flex justify-between">
            <span>Capital: {formatNairaCompact(metrics.womenLedDisbursed)}</span>
            <span className="font-semibold text-ink">
              {formatNumber(metrics.womenLedCount)} MSMEs
            </span>
          </div>
        </div>

        {/* Youth-Led Metric */}
        <div
          onClick={handleToggleYouth}
          className={`bg-white rounded-xl p-4 border transition-all cursor-pointer ${
            filters.youthLed === true
              ? "border-deep-green ring-2 ring-soft-green shadow-sm"
              : "border-border hover:border-deep-green/40 shadow-xs"
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-ink-muted">
              Youth-Led Enterprises
            </span>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                filters.youthLed === true
                  ? "bg-deep-green text-white"
                  : "bg-soft-green text-deep-green"
              }`}
            >
              {filters.youthLed === true ? "Filtered" : "Click to Filter"}
            </span>
          </div>
          <div className="text-2xl font-bold text-deep-green tabular-nums">
            {formatPercent(metrics.youthLedPercentage)}
          </div>
          <div className="text-[11px] text-ink-muted mt-0.5 flex justify-between">
            <span>Capital: {formatNairaCompact(metrics.youthLedDisbursed)}</span>
            <span className="font-semibold text-ink">
              {formatNumber(metrics.youthLedCount)} MSMEs
            </span>
          </div>
        </div>

        {/* MSME Tier Capital Coverage */}
        <div className="bg-white rounded-xl p-4 border border-border shadow-xs">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-ink-muted">
              MSME Share of Facilities
            </span>
            <Users className="w-4 h-4 text-primary-green" />
          </div>
          <div className="text-2xl font-bold text-ink tabular-nums">
            {formatPercent(
              totalEnterprises > 0
                ? (segmentSummary
                    .filter((s) => s.segment !== "Large Enterprise")
                    .reduce((acc, s) => acc + s.enterprises, 0) /
                    totalEnterprises) *
                    100
                : 0
            )}
          </div>
          <div className="text-[11px] text-ink-muted mt-0.5">
            Nano, Micro, Small & Medium
          </div>
        </div>

        {/* Average Facility Ticket Size */}
        <div className="bg-white rounded-xl p-4 border border-border shadow-xs">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-ink-muted">
              Average Facility Size
            </span>
            <Building2 className="w-4 h-4 text-gold-accent" />
          </div>
          <div className="text-2xl font-bold text-ink tabular-nums">
            {formatNairaCompact(
              metrics.enterprisesCount > 0
                ? metrics.totalDisbursed / metrics.enterprisesCount
                : 0
            )}
          </div>
          <div className="text-[11px] text-ink-muted mt-0.5">
            Across active facilities
          </div>
        </div>
      </div>

      {/* RICH ENTERPRISE SCALE VISUALIZATION & DEEP DIVE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Left: Expanded Interactive D3 Bubble Cluster (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-card p-6 border border-border shadow-card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-base font-bold text-ink tracking-tight">
                Enterprise Tier Distribution
              </h3>
              <span className="text-[11px] font-bold text-deep-green bg-soft-green px-2.5 py-1 rounded-md">
                Proportional Area
              </span>
            </div>
            <p className="text-xs text-ink-muted mb-4">
              Visual bubble cluster showing capital allocation volume by enterprise scale tier
            </p>

            <div className="flex items-center justify-center py-2">
              <div className="relative w-[260px] h-[260px]">
                <svg
                  viewBox="0 0 260 260"
                  className="w-full h-full drop-shadow-sm overflow-visible"
                  aria-label="Rich enterprise scale bubble visual"
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
                        fillOpacity={0.92}
                        stroke="#FFFFFF"
                        strokeWidth={2}
                      >
                        <title>{`${circle.name}: ${formatNairaCompact(
                          circle.disbursed
                        )} (${formatPercent(circle.share)}) - ${formatNumber(
                          circle.enterprises
                        )} enterprises`}</title>
                      </circle>
                      {circle.r > 20 && (
                        <>
                          <text
                            x={circle.x}
                            y={circle.y - 6}
                            textAnchor="middle"
                            fill="#FFFFFF"
                            fontSize={circle.r > 38 ? "12px" : "10px"}
                            fontWeight="bold"
                            className="pointer-events-none select-none"
                          >
                            {circle.name}
                          </text>
                          <text
                            x={circle.x}
                            y={circle.y + 10}
                            textAnchor="middle"
                            fill="#FFFFFF"
                            fontSize={circle.r > 38 ? "13px" : "11px"}
                            fontWeight="extrabold"
                            className="pointer-events-none select-none tabular-nums"
                          >
                            {`${Math.round(circle.share)}%`}
                          </text>
                        </>
                      )}
                    </g>
                  ))}
                </svg>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-border/60 flex items-center justify-between text-xs text-ink-muted">
            <span>Hover bubbles for full details</span>
            <span className="font-semibold text-deep-green">
              {sortedSegments.length} Tiers Reconciled
            </span>
          </div>
        </div>

        {/* Right: Rich Enterprise Scale Matrix & MSME Paradox Analysis (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-card p-6 border border-border shadow-card flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-ink mb-1">
              Tier Capital vs Enterprise Beneficiaries Matrix
            </h3>
            <p className="text-xs text-ink-muted mb-4">
              Comprehensive breakdown comparing deployed capital against enterprise count and average ticket size
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-border text-ink-muted font-bold text-[11px] uppercase tracking-wider">
                    <th className="py-2.5 px-3">Tier</th>
                    <th className="py-2.5 px-3 text-right">Capital (₦)</th>
                    <th className="py-2.5 px-3 text-right">Capital %</th>
                    <th className="py-2.5 px-3 text-right">Enterprises</th>
                    <th className="py-2.5 px-3 text-right">Avg Ticket Size</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {sortedSegments.map((seg, idx) => {
                    const capitalShare =
                      metrics.totalDisbursed > 0
                        ? (seg.disbursed / metrics.totalDisbursed) * 100
                        : 0;

                    const avgTicket =
                      seg.enterprises > 0 ? seg.disbursed / seg.enterprises : 0;

                    const color = BUBBLE_COLORS[idx % BUBBLE_COLORS.length];

                    return (
                      <tr key={seg.segment} className="hover:bg-[#F9FAFB] transition-colors">
                        <td className="py-3.5 px-3 font-semibold text-ink">
                          <div className="flex items-center gap-2">
                            <span
                              className="w-2.5 h-2.5 rounded-full shrink-0"
                              style={{ backgroundColor: color }}
                            />
                            <span>{seg.segment}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-3 text-right font-bold text-ink tabular-nums">
                          {formatNairaCompact(seg.disbursed)}
                        </td>
                        <td className="py-3.5 px-3 text-right font-semibold text-deep-green tabular-nums">
                          {formatPercent(capitalShare)}
                        </td>
                        <td className="py-3.5 px-3 text-right font-medium text-ink tabular-nums">
                          {formatNumber(seg.enterprises)}
                        </td>
                        <td className="py-3.5 px-3 text-right font-medium text-ink-muted tabular-nums">
                          {formatNairaCompact(avgTicket)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Institutional Inclusion Insight */}
          <div className="mt-4 p-3 bg-canvas rounded-xl border border-border/80 flex items-start gap-3 text-xs">
            <CheckCircle2 className="w-4 h-4 text-deep-green shrink-0 mt-0.5" />
            <div className="text-ink-muted">
              <span className="font-bold text-ink">Mandate Priority: </span>
              Nano, Micro, and Small enterprises represent the bedrock of nationwide employment generation. BOI targeted intervention programs ensure concessional capital access across informal and underserved commercial segments.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
