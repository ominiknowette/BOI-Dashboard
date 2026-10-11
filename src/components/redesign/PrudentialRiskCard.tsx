"use client";

import React from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import { PortfolioStatusSummary, PortfolioStatus } from "@/types/dataset";
import { formatNairaCompact, formatPercent } from "@/lib/utils/formatters";
import { ChevronDown } from "lucide-react";

interface PrudentialRiskCardProps {
  portfolioStatus: PortfolioStatusSummary[];
  totalDisbursed: number;
}

const STATUS_CONFIG: Record<
  PortfolioStatus,
  { color: string; label: string; badgeType: "positive" | "warning" | "risk" | "neutral" }
> = {
  Performing: {
    color: "#185744", // Deep Green
    label: "Performing",
    badgeType: "positive",
  },
  Watchlist: {
    color: "#038E46", // Bright Green
    label: "Watchlist",
    badgeType: "warning",
  },
  Substandard: {
    color: "#C8A34A", // Gold / Amber
    label: "Substandard",
    badgeType: "warning",
  },
  Doubtful: {
    color: "#D94A4A", // Risk Red
    label: "Doubtful",
    badgeType: "risk",
  },
};

export function PrudentialRiskCard({
  portfolioStatus,
  totalDisbursed,
}: PrudentialRiskCardProps) {
  // Filter out zero categories for clean rendering
  const pieData = portfolioStatus
    .filter((p) => p.disbursed > 0)
    .map((p) => ({
      name: p.status,
      value: p.disbursed,
      ratio: p.ratio,
      count: p.count,
      outstanding: p.outstanding,
      color: STATUS_CONFIG[p.status]?.color || "#6B7471",
    }));

  const performingEntry = portfolioStatus.find((p) => p.status === "Performing");
  const performingRatio = performingEntry ? performingEntry.ratio : 0;

  return (
    <div className="bg-gradient-to-b from-[#EAF5EE]/40 via-white to-white rounded-card p-5 border border-border shadow-card flex flex-col justify-between h-full">
      {/* Card Header matching "Product Statistic" */}
      <div className="flex items-center justify-between mb-2">
        <div>
          <h3 className="text-base font-bold text-ink tracking-tight">
            Portfolio Quality
          </h3>
          <p className="text-xs font-medium text-ink-muted">
            Prudential credit risk classification
          </p>
        </div>

        <div className="flex items-center gap-1 text-[11px] font-semibold text-ink-muted bg-white/80 px-2.5 py-1 rounded-md border border-border/80 shadow-xs">
          <span>Q3 2026</span>
          <ChevronDown className="w-3 h-3 text-ink-muted" />
        </div>
      </div>

      {/* Donut Chart with performing ratio center */}
      <div className="relative w-full h-[180px] sm:h-[190px] my-1 flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              innerRadius={52}
              outerRadius={78}
              paddingAngle={2}
              dataKey="value"
              stroke="#FFFFFF"
              strokeWidth={2}
            >
              {pieData.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-white p-2.5 rounded-lg border border-border shadow-dropdown text-xs">
                      <div className="font-bold text-ink mb-1">{data.name}</div>
                      <div className="text-ink-muted">
                        Disbursed:{" "}
                        <span className="font-semibold text-ink tabular-nums">
                          {formatNairaCompact(data.value)}
                        </span>
                      </div>
                      <div className="text-ink-muted">
                        Share:{" "}
                        <span className="font-semibold text-ink tabular-nums">
                          {formatPercent(data.ratio)}
                        </span>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Center Metric Label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-lg font-extrabold text-ink tabular-nums tracking-tight">
            {formatPercent(performingRatio)}
          </span>
          <span className="text-[10px] font-semibold text-ink-muted uppercase tracking-wider">
            Performing
          </span>
        </div>
      </div>

      {/* Breakdown Rows below matching reference */}
      <div className="space-y-2 mt-2 pt-3 border-t border-border/60">
        {portfolioStatus.map((item) => {
          const cfg = STATUS_CONFIG[item.status];
          return (
            <div
              key={item.status}
              className="flex items-center justify-between text-xs py-0.5"
            >
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: cfg.color }}
                />
                <span className="font-semibold text-ink truncate">
                  {cfg.label}
                </span>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="tabular-nums font-semibold text-ink-muted text-[11px]">
                  {formatNairaCompact(item.disbursed)}
                </span>
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full tabular-nums ${
                    item.status === "Performing"
                      ? "bg-[#EAF5EE] text-primary-green"
                      : item.status === "Watchlist"
                      ? "bg-amber-50 text-warning-amber"
                      : item.status === "Substandard"
                      ? "bg-orange-50 text-orange-600"
                      : "bg-red-50 text-risk-red"
                  }`}
                >
                  {formatPercent(item.ratio)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
