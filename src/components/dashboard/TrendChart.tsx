"use client";

import React, { useState, useMemo } from "react";
import { TimeSeriesPoint } from "@/types/dataset";
import { formatNairaCompact, formatNumber } from "@/lib/utils/formatters";
import { TrendingUp } from "lucide-react";

interface TrendChartProps {
  timeSeries: TimeSeriesPoint[];
  granularity: "quarter" | "year";
  onGranularityChange: (g: "quarter" | "year") => void;
}

export function TrendChart({
  timeSeries,
  granularity,
  onGranularityChange,
}: TrendChartProps) {
  const [metric, setMetric] = useState<"disbursed" | "jobs" | "enterprises">("disbursed");
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const values = useMemo(() => {
    return timeSeries.map((d) => d[metric]);
  }, [timeSeries, metric]);

  const maxVal = useMemo(() => {
    return Math.max(...values, 1);
  }, [values]);

  // Chart dimensions
  const width = 760;
  const height = 260;
  const paddingLeft = 60;
  const paddingRight = 30;
  const paddingTop = 25;
  const paddingBottom = 40;

  const innerWidth = width - paddingLeft - paddingRight;
  const innerHeight = height - paddingTop - paddingBottom;

  // Generate coordinates
  const points = useMemo(() => {
    if (timeSeries.length === 0) return [];
    const step = timeSeries.length > 1 ? innerWidth / (timeSeries.length - 1) : innerWidth / 2;
    return timeSeries.map((d, i) => {
      const val = d[metric];
      const x = paddingLeft + i * step;
      const y = paddingTop + innerHeight - (val / maxVal) * innerHeight;
      return { x, y, data: d, val };
    });
  }, [timeSeries, metric, maxVal, innerWidth, innerHeight]);

  const polylinePoints = points.map((p) => `${p.x},${p.y}`).join(" ");

  // Y-axis ticks (4 ticks)
  const yTicks = [0, maxVal * 0.33, maxVal * 0.66, maxVal];

  const formatTickVal = (val: number) => {
    if (metric === "disbursed") return formatNairaCompact(val);
    return formatNumber(Math.round(val));
  };

  return (
    <div className="bg-white border border-[#DDE5DF] rounded-md shadow-sm p-5 flex flex-col h-full">
      {/* Header & Controls */}
      <div className="flex flex-wrap items-center justify-between pb-3 mb-4 border-b border-[#DDE5DF] gap-2">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-[#0B6B4F]" aria-hidden="true" />
          <h3 className="text-sm font-semibold text-[#17201C] uppercase tracking-wide">
            Portfolio Trajectory &amp; Temporal Deployment
          </h3>
        </div>

        <div className="flex items-center gap-2">
          {/* Granularity Toggle */}
          <div className="inline-flex rounded-md border border-[#DDE5DF] bg-white p-0.5 text-xs">
            <button
              type="button"
              onClick={() => onGranularityChange("quarter")}
              className={`px-2.5 py-0.5 rounded text-xs font-medium transition-colors ${
                granularity === "quarter"
                  ? "bg-[#0B6B4F] text-white"
                  : "text-[#667169] hover:text-[#17201C]"
              }`}
            >
              Quarterly
            </button>
            <button
              type="button"
              onClick={() => onGranularityChange("year")}
              className={`px-2.5 py-0.5 rounded text-xs font-medium transition-colors ${
                granularity === "year"
                  ? "bg-[#0B6B4F] text-white"
                  : "text-[#667169] hover:text-[#17201C]"
              }`}
            >
              Annual
            </button>
          </div>

          {/* Metric Selector */}
          <div className="inline-flex rounded-md border border-[#DDE5DF] bg-white p-0.5 text-xs">
            <button
              type="button"
              onClick={() => setMetric("disbursed")}
              className={`px-2 py-0.5 rounded text-xs font-medium transition-colors ${
                metric === "disbursed"
                  ? "bg-[#0B4738] text-white"
                  : "text-[#667169] hover:text-[#17201C]"
              }`}
            >
              Capital (NGN)
            </button>
            <button
              type="button"
              onClick={() => setMetric("jobs")}
              className={`px-2 py-0.5 rounded text-xs font-medium transition-colors ${
                metric === "jobs"
                  ? "bg-[#0B4738] text-white"
                  : "text-[#667169] hover:text-[#17201C]"
              }`}
            >
              Jobs
            </button>
            <button
              type="button"
              onClick={() => setMetric("enterprises")}
              className={`px-2 py-0.5 rounded text-xs font-medium transition-colors ${
                metric === "enterprises"
                  ? "bg-[#0B4738] text-white"
                  : "text-[#667169] hover:text-[#17201C]"
              }`}
            >
              Enterprises
            </button>
          </div>
        </div>
      </div>

      <p className="text-xs text-[#667169] mb-3">
        Temporal trend across the 2023–2026 lifecycle. Direct data points indicate exact periodic volume.
      </p>

      {/* SVG Trend Chart */}
      <div className="relative w-full flex-1 min-h-[220px]">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-full select-none overflow-visible"
          aria-label={`Time series trend of ${metric} from 2023 to 2026`}
        >
          {/* Horizontal grid lines & Y labels */}
          {yTicks.map((tick, i) => {
            const y = paddingTop + innerHeight - (tick / maxVal) * innerHeight;
            return (
              <g key={i}>
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={width - paddingRight}
                  y2={y}
                  stroke="#E8ECE9"
                  strokeDasharray="3 3"
                />
                <text
                  x={paddingLeft - 8}
                  y={y}
                  textAnchor="end"
                  dy="0.32em"
                  fontSize="10px"
                  fill="#667169"
                  className="tabular-nums font-mono"
                >
                  {formatTickVal(tick)}
                </text>
              </g>
            );
          })}

          {/* Area under curve (subtle institutional tint) */}
          {points.length > 0 && (
            <polygon
              points={`${points[0].x},${paddingTop + innerHeight} ${polylinePoints} ${
                points[points.length - 1].x
              },${paddingTop + innerHeight}`}
              fill="#0B6B4F"
              fillOpacity="0.06"
            />
          )}

          {/* Line */}
          {points.length > 0 && (
            <polyline
              points={polylinePoints}
              fill="none"
              stroke="#0B6B4F"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* X axis baseline */}
          <line
            x1={paddingLeft}
            y1={paddingTop + innerHeight}
            x2={width - paddingRight}
            y2={paddingTop + innerHeight}
            stroke="#DDE5DF"
          />

          {/* Data Points & X labels */}
          {points.map((p, i) => {
            const isHovered = hoveredIndex === i;
            return (
              <g
                key={i}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
                className="cursor-pointer"
              >
                {/* Vertical hover indicator */}
                {isHovered && (
                  <line
                    x1={p.x}
                    y1={paddingTop}
                    x2={p.x}
                    y2={paddingTop + innerHeight}
                    stroke="#0B4738"
                    strokeDasharray="2 2"
                    strokeWidth="1"
                  />
                )}

                {/* Point circle */}
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={isHovered ? 6 : 4}
                  fill="#FFFFFF"
                  stroke={isHovered ? "#0B4738" : "#0B6B4F"}
                  strokeWidth="2.5"
                  className="transition-all"
                />

                {/* X-axis label */}
                <text
                  x={p.x}
                  y={paddingTop + innerHeight + 18}
                  textAnchor="middle"
                  fontSize={granularity === "quarter" ? "9.5px" : "11px"}
                  fill={isHovered ? "#0B4738" : "#667169"}
                  fontWeight={isHovered ? "bold" : "normal"}
                  className="tabular-nums"
                >
                  {p.data.period}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Hover detail tooltip overlay */}
        {hoveredIndex !== null && points[hoveredIndex] && (
          <div
            className="absolute bg-white border border-[#DDE5DF] rounded p-2 text-xs shadow-md pointer-events-none transform -translate-x-1/2 -translate-y-full z-20"
            style={{
              left: `${(points[hoveredIndex].x / width) * 100}%`,
              top: `${(points[hoveredIndex].y / height) * 100 - 8}%`,
            }}
          >
            <div className="font-semibold text-[#17201C] pb-1 border-b border-[#E8ECE9]">
              Period: {points[hoveredIndex].data.period}
            </div>
            <div className="pt-1 text-[#0B4738] font-bold tabular-nums">
              {metric === "disbursed"
                ? formatNairaCompact(points[hoveredIndex].data.disbursed)
                : formatNumber(points[hoveredIndex].val)}
            </div>
            <div className="text-[10px] text-[#667169] mt-0.5 tabular-nums">
              {metric === "disbursed"
                ? `${formatNumber(points[hoveredIndex].data.enterprises)} enterprises | ${formatNumber(points[hoveredIndex].data.jobs)} jobs`
                : `${formatNairaCompact(points[hoveredIndex].data.disbursed)} disbursed`}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
