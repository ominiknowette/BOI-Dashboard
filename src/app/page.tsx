"use client";

import React, { useState, useMemo, Suspense, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { SYNTHETIC_RECORDS } from "@/lib/data/synthetic-records";
import {
  filterRecords,
  computeAggregatedMetrics,
  aggregateByZone,
  aggregateByState,
  aggregateBySector,
  aggregateBySegment,
  aggregateTimeSeries,
  aggregatePortfolioStatus,
  aggregateByStrategicTheme,
} from "@/lib/analytics/aggregation";
import {
  FilterState,
  Persona,
  getPersonaRole,
  GeopoliticalZone,
  Sector,
  EnterpriseSegment,
  PortfolioStatus,
  StrategicTheme,
} from "@/types/dataset";
import { BOIHeader } from "@/components/common/BOIHeader";
import { PrimaryTabs, ProductTab } from "@/components/common/PrimaryTabs";
import { GlobalFilters } from "@/components/filters/GlobalFilters";
import { KpiSummary } from "@/components/dashboard/KpiSummary";
import { NationalPortfolioSummary } from "@/components/dashboard/NationalPortfolioSummary";
import { NigeriaImpactMap } from "@/components/map/NigeriaImpactMap";
import { ZoneRanking } from "@/components/dashboard/ZoneRanking";
import { SectorAllocation } from "@/components/dashboard/SectorAllocation";
import { TrendChart } from "@/components/dashboard/TrendChart";
import { InclusionProfile } from "@/components/dashboard/InclusionProfile";
import { PortfolioPerformance } from "@/components/dashboard/PortfolioPerformance";
import { StrategicThemeExplorer } from "@/components/dashboard/StrategicThemeExplorer";
import { EmptyState } from "@/components/common/EmptyState";
import { AskBOIAIWorkspace } from "@/components/assistant/AskBOIAIWorkspace";
import { DataDisclaimer } from "@/components/common/DataDisclaimer";

function PortalContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Persona State
  const [persona, setPersona] = useState<Persona>("executive");

  // Tab State
  const [activeTab, setActiveTab] = useState<ProductTab>("dashboard");

  // Time Series Granularity
  const [timeGranularity, setTimeGranularity] = useState<"quarter" | "year">("quarter");

  // Filters State initialized from URL params if present
  const [filters, setFilters] = useState<FilterState>(() => {
    return {
      year: searchParams.get("year") || "all",
      zone: searchParams.get("zone") || "all",
      state: searchParams.get("state") || "all",
      sector: searchParams.get("sector") || "all",
      segment: searchParams.get("segment") || "all",
      programme: searchParams.get("programme") || "all",
      strategicTheme: searchParams.get("theme") || "all",
      portfolioStatus: searchParams.get("status") || "all",
      womenLed: searchParams.get("women") === "true" ? true : null,
      youthLed: searchParams.get("youth") === "true" ? true : null,
    };
  });

  // Keep URL updated with filter state for persistent sharing & deep linking
  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.year && filters.year !== "all") params.set("year", filters.year);
    if (filters.zone && filters.zone !== "all") params.set("zone", filters.zone);
    if (filters.state && filters.state !== "all") params.set("state", filters.state);
    if (filters.sector && filters.sector !== "all") params.set("sector", filters.sector);
    if (filters.segment && filters.segment !== "all") params.set("segment", filters.segment);
    if (filters.programme && filters.programme !== "all") params.set("programme", filters.programme);
    if (filters.strategicTheme && filters.strategicTheme !== "all") params.set("theme", filters.strategicTheme);
    if (filters.portfolioStatus && filters.portfolioStatus !== "all") params.set("status", filters.portfolioStatus);
    if (filters.womenLed === true) params.set("women", "true");
    if (filters.youthLed === true) params.set("youth", "true");

    const queryString = params.toString();
    const newUrl = queryString ? `?${queryString}` : window.location.pathname;
    window.history.replaceState(null, "", newUrl);
  }, [filters]);

  // Filter dataset
  const filteredRecords = useMemo(() => {
    return filterRecords(SYNTHETIC_RECORDS, filters);
  }, [filters]);

  // Compute aggregations (100% deterministic & mathematically reconciled)
  const metrics = useMemo(() => {
    return computeAggregatedMetrics(filteredRecords, SYNTHETIC_RECORDS, filters.year);
  }, [filteredRecords, filters.year]);

  const zoneSummary = useMemo(() => {
    return aggregateByZone(filteredRecords);
  }, [filteredRecords]);

  const stateSummary = useMemo(() => {
    return aggregateByState(filteredRecords);
  }, [filteredRecords]);

  const sectorSummary = useMemo(() => {
    return aggregateBySector(filteredRecords);
  }, [filteredRecords]);

  const segmentSummary = useMemo(() => {
    return aggregateBySegment(filteredRecords);
  }, [filteredRecords]);

  const timeSeries = useMemo(() => {
    return aggregateTimeSeries(filteredRecords, timeGranularity);
  }, [filteredRecords, timeGranularity]);

  const portfolioStatusSummary = useMemo(() => {
    return aggregatePortfolioStatus(filteredRecords);
  }, [filteredRecords]);

  const strategicThemeSummary = useMemo(() => {
    return aggregateByStrategicTheme(filteredRecords);
  }, [filteredRecords]);

  // Filter Handlers
  const handleResetFilters = () => {
    setFilters({
      year: "all",
      zone: "all",
      state: "all",
      sector: "all",
      segment: "all",
      programme: "all",
      strategicTheme: "all",
      portfolioStatus: "all",
      womenLed: null,
      youthLed: null,
    });
  };

  const handleSelectZone = (zone: GeopoliticalZone | "all") => {
    setFilters((prev) => ({
      ...prev,
      zone,
      state: "all", // reset state if zone changes
    }));
  };

  const handleSelectState = (state: string) => {
    setFilters((prev) => ({
      ...prev,
      state,
    }));
  };

  const handleSelectSector = (sector: Sector | "all") => {
    setFilters((prev) => ({
      ...prev,
      sector,
    }));
  };

  const handleSelectSegment = (segment: EnterpriseSegment | "all") => {
    setFilters((prev) => ({
      ...prev,
      segment,
    }));
  };

  const handleSelectStatus = (status: PortfolioStatus | "all") => {
    setFilters((prev) => ({
      ...prev,
      portfolioStatus: status,
    }));
  };

  const handleSelectTheme = (theme: StrategicTheme | "all") => {
    setFilters((prev) => ({
      ...prev,
      strategicTheme: theme,
    }));
  };

  const personaRole = getPersonaRole(persona);

  return (
    <div className="min-h-screen bg-boi-bg text-boi-text flex flex-col font-sans selection:bg-boi-selected selection:text-boi-green-deep">
      {/* 1. Institutional Top Navigation */}
      <BOIHeader currentPersona={persona} onPersonaChange={setPersona} />

      {/* 2. Primary Product Tabs */}
      <PrimaryTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {/* 3. Global Filter Context Bar */}
      <GlobalFilters
        filters={filters}
        onFilterChange={setFilters}
        onReset={handleResetFilters}
        matchingCount={filteredRecords.length}
        totalCount={SYNTHETIC_RECORDS.length}
      />

      {/* 4. Main Product Workspace */}
      <main id="main-content" className="flex-1 max-w-canvas mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full">
        {filteredRecords.length === 0 ? (
          <EmptyState onReset={handleResetFilters} />
        ) : activeTab === "dashboard" ? (
          <div className="space-y-6">
            {/* National Portfolio Balance Sheet Summary */}
            <NationalPortfolioSummary metrics={metrics} persona={personaRole} />

            {/* Headline KPI Grid */}
            <KpiSummary metrics={metrics} selectedYear={filters.year} />

            {/* Section A: Geographic Drill-Down & Zonal Distribution */}
            <section aria-label="Geographic allocation analysis" className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              <div className="lg:col-span-8">
                <NigeriaImpactMap
                  statesData={stateSummary}
                  totalDisbursed={metrics.totalDisbursed}
                  selectedState={filters.state}
                  onSelectState={handleSelectState}
                  selectedZone={filters.zone as GeopoliticalZone | "all"}
                />
              </div>
              <div className="lg:col-span-4">
                <ZoneRanking
                  zones={zoneSummary}
                  totalDisbursed={metrics.totalDisbursed}
                  selectedZone={filters.zone as GeopoliticalZone | "all"}
                  onSelectZone={handleSelectZone}
                />
              </div>
            </section>

            {/* Section B: Sector Allocation & Temporal Trajectory */}
            <section aria-label="Sector and time-series analysis" className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              <div className="lg:col-span-6">
                <SectorAllocation
                  sectors={sectorSummary}
                  totalDisbursed={metrics.totalDisbursed}
                  totalEnterprises={metrics.enterprisesCount}
                  totalJobs={metrics.jobsSupported}
                  selectedSector={filters.sector as Sector | "all"}
                  onSelectSector={handleSelectSector}
                />
              </div>
              <div className="lg:col-span-6">
                <TrendChart
                  timeSeries={timeSeries}
                  granularity={timeGranularity}
                  onGranularityChange={setTimeGranularity}
                />
              </div>
            </section>

            {/* Section C: Enterprise Scale, Demographics & Portfolio Risk */}
            <section aria-label="Inclusion profile and credit performance" className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              <div className="lg:col-span-7">
                <InclusionProfile
                  segments={segmentSummary}
                  totalDisbursed={metrics.totalDisbursed}
                  womenLedCount={metrics.womenLedCount}
                  womenLedDisbursed={metrics.womenLedDisbursed}
                  womenLedPercentage={metrics.womenLedPercentage}
                  youthLedCount={metrics.youthLedCount}
                  youthLedDisbursed={metrics.youthLedDisbursed}
                  youthLedPercentage={metrics.youthLedPercentage}
                  selectedSegment={filters.segment as EnterpriseSegment | "all"}
                  onSelectSegment={handleSelectSegment}
                />
              </div>
              <div className="lg:col-span-5">
                <PortfolioPerformance
                  portfolioStatus={portfolioStatusSummary}
                  totalDisbursed={metrics.totalDisbursed}
                  totalOutstanding={metrics.totalOutstanding}
                  selectedStatus={filters.portfolioStatus as PortfolioStatus | "all"}
                  onSelectStatus={handleSelectStatus}
                />
              </div>
            </section>

            {/* Section D: Strategic Priority Mandate Themes */}
            <StrategicThemeExplorer
              themes={strategicThemeSummary}
              totalDisbursed={metrics.totalDisbursed}
              selectedTheme={filters.strategicTheme as StrategicTheme | "all"}
              onSelectTheme={handleSelectTheme}
            />
          </div>
        ) : (
          /* Second Principal Experience: Ask BOI AI Analyst Workspace */
          <AskBOIAIWorkspace
            records={filteredRecords}
            allRecords={SYNTHETIC_RECORDS}
            filters={filters}
            persona={personaRole}
          />
        )}
      </main>

      {/* 5. Institutional Disclaimer & Provenance Audit Footer */}
      <DataDisclaimer totalRecords={SYNTHETIC_RECORDS.length} />
    </div>
  );
}

export default function Home() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F5F7F5] flex items-center justify-center p-8 text-[#0B6B4F] text-sm font-medium">
          Loading Bank of Industry Impact Intelligence Portal...
        </div>
      }
    >
      <PortalContent />
    </Suspense>
  );
}
