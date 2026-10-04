"use client";

import React from "react";
import { PortfolioStatusSummary, PortfolioStatus } from "@/types/dataset";
import { formatNairaCompact, formatNumber, formatPercent } from "@/lib/utils/formatters";
import { ShieldAlert, CheckCircle2, AlertTriangle, AlertOctagon, XCircle } from "lucide-react";

interface PortfolioPerformanceProps {
  portfolioStatus: PortfolioStatusSummary[];
  totalDisbursed: number;
  totalOutstanding: number;
  selectedStatus?: PortfolioStatus | "all";
  onSelectStatus: (status: PortfolioStatus | "all") => void;
}

export function PortfolioPerformance({
  portfolioStatus,
  totalDisbursed,
  totalOutstanding,
  selectedStatus = "all",
  onSelectStatus,
}: PortfolioPerformanceProps) {
  const getStatusColor = (status: PortfolioStatus) => {
    switch (status) {
      case "Performing":
        return {
          badge: "bg-[#EDF5F1] text-[#0B6B4F] border-[#0B6B4F]",
          bar: "bg-[#0B6B4F]",
          icon: CheckCircle2,
          textColor: "text-[#0B6B4F]",
        };
      case "Watchlist":
        return {
          badge: "bg-[#FFF8E7] text-[#A66B13] border-[#A66B13]",
          bar: "bg-[#A66B13]",
          icon: AlertTriangle,
          textColor: "text-[#A66B13]",
        };
      case "Substandard":
        return {
          badge: "bg-[#FFF0EB] text-[#C05621] border-[#C05621]",
          bar: "bg-[#C05621]",
          icon: AlertOctagon,
          textColor: "text-[#C05621]",
        };
      case "Doubtful":
        return {
          badge: "bg-[#FDF2F2] text-[#B33A3A] border-[#B33A3A]",
          bar: "bg-[#B33A3A]",
          icon: XCircle,
          textColor: "text-[#B33A3A]",
        };
    }
  };

  return (
    <div className="bg-white border border-[#DDE5DF] rounded-md shadow-sm p-5 flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#DDE5DF]">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-[#0B6B4F]" aria-hidden="true" />
          <h3 className="text-sm font-semibold text-[#17201C] uppercase tracking-wide">
            Prudential Risk &amp; Portfolio Quality
          </h3>
        </div>
        {selectedStatus !== "all" && (
          <button
            type="button"
            onClick={() => onSelectStatus("all")}
            className="text-xs text-[#0B6B4F] hover:underline font-medium"
          >
            Clear Status
          </button>
        )}
      </div>

      <p className="text-xs text-[#667169] mb-4">
        Prudential classification of loan assets. Reflects credit risk exposure and repayment compliance across all facilities.
      </p>

      {/* Stacked Ratio Bar for Immediate Visual Assessment */}
      <div className="w-full bg-[#E8ECE9] h-3 rounded-full overflow-hidden flex mb-5">
        {portfolioStatus.map((item) => {
          const config = getStatusColor(item.status);
          const widthPercent = totalDisbursed > 0 ? (item.disbursed / totalDisbursed) * 100 : 0;
          return (
            <div
              key={item.status}
              className={`h-full ${config.bar} transition-all duration-300`}
              style={{ width: `${widthPercent}%` }}
              title={`${item.status}: ${formatPercent(widthPercent)}`}
            />
          );
        })}
      </div>

      {/* Status Breakdown Tiles */}
      <div className="space-y-3 flex-1 flex flex-col justify-around">
        {portfolioStatus.map((item) => {
          const config = getStatusColor(item.status);
          const Icon = config.icon;
          const isSelected = selectedStatus === item.status;
          const share = totalDisbursed > 0 ? (item.disbursed / totalDisbursed) * 100 : 0;

          return (
            <div
              key={item.status}
              onClick={() => onSelectStatus(isSelected ? "all" : item.status)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onSelectStatus(isSelected ? "all" : item.status);
                }
              }}
              className={`p-3 rounded transition-all cursor-pointer border ${
                isSelected
                  ? "bg-[#EDF5F1] border-[#0B6B4F] ring-1 ring-[#0B6B4F]"
                  : "bg-[#FAFBF9] border-transparent hover:border-[#DDE5DF] hover:bg-[#F5F7F5]"
              }`}
            >
              <div className="flex items-center justify-between text-xs mb-1.5">
                <div className="flex items-center gap-1.5 font-semibold text-[#17201C]">
                  <Icon className={`w-3.5 h-3.5 ${config.textColor}`} aria-hidden="true" />
                  <span>{item.status}</span>
                  {isSelected && (
                    <span className="text-[10px] bg-[#0B6B4F] text-white px-1.5 py-0.2 rounded font-normal">
                      Filtered
                    </span>
                  )}
                </div>
                <div className="text-right">
                  <span className={`font-bold tabular-nums ${config.textColor}`}>
                    {formatNairaCompact(item.disbursed)}
                  </span>
                  <span className="text-[11px] text-[#667169] ml-1.5 tabular-nums">
                    ({formatPercent(share)})
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-[#667169] tabular-nums">
                <span>{formatNumber(item.count)} facilities</span>
                <span>Outstanding: {formatNairaCompact(item.outstanding)}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
