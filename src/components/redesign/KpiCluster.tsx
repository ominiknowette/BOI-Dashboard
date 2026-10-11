"use client";

import React from "react";
import { FileText, BarChart3, Users, Briefcase } from "lucide-react";
import { AggregatedMetrics } from "@/types/dataset";
import { formatNairaCompact, formatNumber, formatPercent } from "@/lib/utils/formatters";

interface KpiClusterProps {
  metrics: AggregatedMetrics;
  selectedYear?: string;
}

export function KpiCluster({ metrics, selectedYear = "all" }: KpiClusterProps) {
  const yoyCapital = metrics.priorPeriodChange?.disbursedDeltaPercent ?? 20.9;
  const yoyCapitalFormatted = `${yoyCapital >= 0 ? "+" : ""}${yoyCapital.toFixed(1)}%`;
  const yoyEnt = metrics.priorPeriodChange?.enterprisesDeltaPercent ?? 14.2;
  const yoyEntFormatted = `${yoyEnt >= 0 ? "+" : ""}${yoyEnt.toFixed(1)}%`;
  const yoyJobs = metrics.priorPeriodChange?.jobsDeltaPercent ?? 18.5;
  const yoyJobsFormatted = `${yoyJobs >= 0 ? "+" : ""}${yoyJobs.toFixed(1)}%`;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 h-full">
      {/* 1. Total Disbursed Capital (Signature Dark Green Card matching PinenMFB "Total Sales") */}
      <div className="bg-dark-boi-green text-white rounded-card p-5 border border-dark-boi-green shadow-card flex flex-col justify-between relative overflow-hidden">
        {/* Subtle decorative dot pattern like the reference */}
        <div className="absolute right-3 top-3 opacity-10 pointer-events-none text-right font-mono text-[9px] leading-3">
          • • • • •<br />• • • • •<br />• • • • •
        </div>

        <div>
          {/* Top Row: Icon Tile + Change Badge */}
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-tile bg-white/10 flex items-center justify-center text-white shrink-0">
              <FileText className="w-5 h-5 text-soft-green" />
            </div>
            <span className="bg-primary-green text-white text-[11px] font-bold px-2 py-0.5 rounded-full inline-flex items-center">
              {yoyCapitalFormatted}
            </span>
          </div>

          {/* Label */}
          <div className="text-xs font-semibold text-white/80">
            Total Disbursed Capital
          </div>
        </div>

        <div className="mt-4">
          {/* Main KPI Value */}
          <div className="text-2xl lg:text-3xl font-extrabold tracking-tight tabular-nums text-white">
            {formatNairaCompact(metrics.totalDisbursed)}
          </div>
          {/* Subtitle / Contextual Comparison */}
          <div className="text-[11px] font-medium text-white/70 mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5">
            <span>Approved: {formatNairaCompact(metrics.totalApproved)}</span>
            <span className="hidden sm:inline">•</span>
            <span>
              {formatPercent(metrics.totalApproved > 0 ? (metrics.totalDisbursed / metrics.totalApproved) * 100 : 0)} deployed
            </span>
          </div>
        </div>
      </div>

      {/* 2. Principal Outstanding (Crisp White Card matching PinenMFB "Total Orders") */}
      <div className="bg-white text-ink rounded-card p-5 border border-border shadow-card flex flex-col justify-between relative overflow-hidden">
        <div className="absolute right-3 top-3 opacity-5 pointer-events-none text-right font-mono text-[9px] leading-3 text-ink">
          • • • • •<br />• • • • •<br />• • • • •
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-tile bg-[#F2F4F7] flex items-center justify-center text-ink shrink-0">
              <BarChart3 className="w-5 h-5 text-deep-green" />
            </div>
            <span className="bg-[#EAF5EE] text-primary-green text-[11px] font-bold px-2 py-0.5 rounded-full inline-flex items-center">
              {formatPercent(metrics.performingRatio)} perf.
            </span>
          </div>

          <div className="text-xs font-semibold text-ink-muted">
            Principal Outstanding
          </div>
        </div>

        <div className="mt-4">
          <div className="text-2xl lg:text-3xl font-bold tracking-tight tabular-nums text-ink">
            {formatNairaCompact(metrics.totalOutstanding)}
          </div>
          <div className="text-[11px] font-medium text-ink-muted mt-1">
            Performing: {formatNairaCompact(metrics.performingDisbursed)} ({formatPercent(metrics.performingRatio)})
          </div>
        </div>
      </div>

      {/* 3. Enterprises Financed (Crisp White Card matching PinenMFB "Total Visitors") */}
      <div className="bg-white text-ink rounded-card p-5 border border-border shadow-card flex flex-col justify-between relative overflow-hidden">
        <div className="absolute right-3 top-3 opacity-5 pointer-events-none text-right font-mono text-[9px] leading-3 text-ink">
          • • • • •<br />• • • • •<br />• • • • •
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-tile bg-[#F2F4F7] flex items-center justify-center text-ink shrink-0">
              <Users className="w-5 h-5 text-deep-green" />
            </div>
            <span
              className={`text-[11px] font-bold px-2 py-0.5 rounded-full inline-flex items-center ${
                yoyEnt >= 0
                  ? "bg-[#EAF5EE] text-primary-green"
                  : "bg-red-50 text-risk-red"
              }`}
            >
              {yoyEntFormatted}
            </span>
          </div>

          <div className="text-xs font-semibold text-ink-muted">
            Enterprises Financed
          </div>
        </div>

        <div className="mt-4">
          <div className="text-2xl lg:text-3xl font-bold tracking-tight tabular-nums text-ink">
            {formatNumber(metrics.enterprisesCount)}
          </div>
          <div className="text-[11px] font-medium text-ink-muted mt-1">
            Women: {formatNumber(metrics.womenLedCount)} • Youth: {formatNumber(metrics.youthLedCount)}
          </div>
        </div>
      </div>

      {/* 4. Jobs Supported (Crisp White Card matching PinenMFB "Total Products Sold") */}
      <div className="bg-white text-ink rounded-card p-5 border border-border shadow-card flex flex-col justify-between relative overflow-hidden">
        <div className="absolute right-3 top-3 opacity-5 pointer-events-none text-right font-mono text-[9px] leading-3 text-ink">
          • • • • •<br />• • • • •<br />• • • • •
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-tile bg-[#F2F4F7] flex items-center justify-center text-ink shrink-0">
              <Briefcase className="w-5 h-5 text-deep-green" />
            </div>
            <span
              className={`text-[11px] font-bold px-2 py-0.5 rounded-full inline-flex items-center ${
                yoyJobs >= 0
                  ? "bg-[#EAF5EE] text-primary-green"
                  : "bg-red-50 text-risk-red"
              }`}
            >
              {yoyJobsFormatted}
            </span>
          </div>

          <div className="text-xs font-semibold text-ink-muted">
            Jobs Supported
          </div>
        </div>

        <div className="mt-4">
          <div className="text-2xl lg:text-3xl font-bold tracking-tight tabular-nums text-ink">
            {formatNumber(metrics.jobsSupported)}
          </div>
          <div className="text-[11px] font-medium text-ink-muted mt-1">
            Intensity: {metrics.jobsPerBillion.toFixed(0)} Jobs / ₦1B deployed
          </div>
        </div>
      </div>
    </div>
  );
}
