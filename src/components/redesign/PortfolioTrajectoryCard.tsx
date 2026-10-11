"use client";

import React, { useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { TimeSeriesPoint } from "@/types/dataset";
import { formatNairaCompact, formatNumber } from "@/lib/utils/formatters";
import { ChevronDown } from "lucide-react";

interface PortfolioTrajectoryCardProps {
  timeSeries: TimeSeriesPoint[];
  granularity: "quarter" | "year";
  onGranularityChange: (g: "quarter" | "year") => void;
}

export function PortfolioTrajectoryCard({
  timeSeries,
  granularity,
  onGranularityChange,
}: PortfolioTrajectoryCardProps) {
  const [metricMode, setMetricMode] = useState<"capital" | "enterprises" | "jobs">("capital");

  // Transform data for chart formatting
  const chartData = timeSeries.map((pt) => {
    // Simplify labels for clean x-axis (e.g. "2024-Q1" -> "Q1 '24")
    let displayPeriod = pt.period;
    if (pt.period.includes("-Q")) {
      const [yr, q] = pt.period.split("-");
      displayPeriod = `${q} '${yr.slice(2)}`;
    }

    return {
      period: pt.period,
      displayPeriod,
      disbursed: pt.disbursed,
      approved: pt.approved,
      outstanding: pt.outstanding,
      enterprises: pt.enterprises,
      jobs: pt.jobs,
    };
  });

  return (
    <div className="bg-white rounded-card p-5 border border-border shadow-card flex flex-col justify-between h-full">
      {/* Header matching PinenMFB "Customer Habbits" */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="text-base font-bold text-ink tracking-tight">
            Capital Deployment Trajectory
          </h3>
          <p className="text-xs font-medium text-ink-muted">
            Track periodic deployment vs approved allocation
          </p>
        </div>

        {/* Controls: Metric Toggle & Period Selector */}
        <div className="flex items-center gap-2">
          {/* Metric Selector */}
          <div className="bg-[#F2F4F7] p-0.5 rounded-lg flex items-center text-[11px] font-semibold">
            <button
              type="button"
              onClick={() => setMetricMode("capital")}
              className={`px-2.5 py-1 rounded-md transition-all ${
                metricMode === "capital"
                  ? "bg-white text-ink shadow-sm"
                  : "text-ink-muted hover:text-ink"
              }`}
            >
              Capital
            </button>
            <button
              type="button"
              onClick={() => setMetricMode("enterprises")}
              className={`px-2.5 py-1 rounded-md transition-all ${
                metricMode === "enterprises"
                  ? "bg-white text-ink shadow-sm"
                  : "text-ink-muted hover:text-ink"
              }`}
            >
              Enterprises
            </button>
            <button
              type="button"
              onClick={() => setMetricMode("jobs")}
              className={`px-2.5 py-1 rounded-md transition-all ${
                metricMode === "jobs"
                  ? "bg-white text-ink shadow-sm"
                  : "text-ink-muted hover:text-ink"
              }`}
            >
              Jobs
            </button>
          </div>

          {/* Granularity Dropdown */}
          <div className="relative">
            <select
              value={granularity}
              onChange={(e) => onGranularityChange(e.target.value as "quarter" | "year")}
              aria-label="Timeframe Granularity"
              className="appearance-none bg-[#F2F4F7] hover:bg-[#EAECF0] text-ink text-[11px] font-semibold pl-2.5 pr-6 py-1.5 rounded-lg border border-transparent cursor-pointer focus:outline-none"
            >
              <option value="quarter">Quarterly</option>
              <option value="year">Annual</option>
            </select>
            <ChevronDown className="w-3 h-3 text-ink-muted absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Compact Legend matching reference */}
      <div className="flex items-center gap-4 text-xs font-medium text-ink-muted mb-2 px-1">
        {metricMode === "capital" ? (
          <>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-primary-green" />
              <span>Approved Capital</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-deep-green" />
              <span>Disbursed Capital</span>
            </div>
          </>
        ) : metricMode === "enterprises" ? (
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-deep-green" />
            <span>Enterprises Financed</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-deep-green" />
            <span>Jobs Supported</span>
          </div>
        )}
      </div>

      {/* Recharts Grouped Bar Chart */}
      <div className="w-full h-[260px] sm:h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
            barGap={4}
          >
            {/* Quiet horizontal dashed grid lines, no vertical lines */}
            <CartesianGrid strokeDasharray="3 3" stroke="#EAECF0" vertical={false} />
            <XAxis
              dataKey="displayPeriod"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#6B7471", fontSize: 11, fontWeight: 500 }}
              dy={6}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              width={55}
              tick={{ fill: "#6B7471", fontSize: 11, fontWeight: 500 }}
              tickFormatter={(val) => {
                if (metricMode !== "capital") return formatNumber(val);
                if (val === 0) return "₦0";
                const b = val / 1_000_000_000;
                return `₦${b % 1 === 0 ? b.toFixed(0) : b.toFixed(1)}bn`;
              }}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-white p-3 rounded-lg border border-border shadow-dropdown text-xs">
                      <div className="font-bold text-ink mb-1.5">{data.period}</div>
                      {metricMode === "capital" ? (
                        <div className="space-y-1">
                          <div className="flex items-center justify-between gap-3 text-primary-green font-medium">
                            <span>Approved:</span>
                            <span className="font-bold tabular-nums">
                              {formatNairaCompact(data.approved)}
                            </span>
                          </div>
                          <div className="flex items-center justify-between gap-3 text-deep-green font-medium">
                            <span>Disbursed:</span>
                            <span className="font-bold tabular-nums">
                              {formatNairaCompact(data.disbursed)}
                            </span>
                          </div>
                        </div>
                      ) : metricMode === "enterprises" ? (
                        <div className="flex items-center justify-between gap-3 text-deep-green font-medium">
                          <span>Enterprises:</span>
                          <span className="font-bold tabular-nums">
                            {formatNumber(data.enterprises)}
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between gap-3 text-deep-green font-medium">
                          <span>Jobs:</span>
                          <span className="font-bold tabular-nums">
                            {formatNumber(data.jobs)}
                          </span>
                        </div>
                      )}
                    </div>
                  );
                }
                return null;
              }}
            />

            {metricMode === "capital" ? (
              <>
                <Bar
                  dataKey="approved"
                  name="Approved Capital"
                  fill="#038E46"
                  radius={[6, 6, 0, 0]}
                  barSize={12}
                />
                <Bar
                  dataKey="disbursed"
                  name="Disbursed Capital"
                  fill="#185744"
                  radius={[6, 6, 0, 0]}
                  barSize={12}
                />
              </>
            ) : metricMode === "enterprises" ? (
              <Bar
                dataKey="enterprises"
                name="Enterprises"
                fill="#185744"
                radius={[6, 6, 0, 0]}
                barSize={18}
              />
            ) : (
              <Bar
                dataKey="jobs"
                name="Jobs Supported"
                fill="#185744"
                radius={[6, 6, 0, 0]}
                barSize={18}
              />
            )}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
