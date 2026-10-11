"use client";

import React, { useState, useMemo, Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
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

// Layout & Navigation Primitives
import { AppSidebar, NavItemKey } from "@/components/layout/AppSidebar";
import { AppHeader } from "@/components/layout/AppHeader";
import { FilterDrawer } from "@/components/filters/FilterDrawer";

// Redesigned Analytics Cards (Strictly aligned to PinenMFB aesthetic & BOI Mandate)
import { KpiCluster } from "@/components/redesign/KpiCluster";
import { PortfolioTrajectoryCard } from "@/components/redesign/PortfolioTrajectoryCard";
import { PrudentialRiskCard } from "@/components/redesign/PrudentialRiskCard";
import { EnterpriseScaleBubbleCard } from "@/components/redesign/EnterpriseScaleBubbleCard";
import { GeographicAnalysisCard } from "@/components/redesign/GeographicAnalysisCard";
import { SectorAllocationCard } from "@/components/redesign/SectorAllocationCard";
import { InclusionThemesCard } from "@/components/redesign/InclusionThemesCard";

// Natural Language AI Workspace & Disclosure
import { AskBOIAIWorkspace } from "@/components/assistant/AskBOIAIWorkspace";
import { DataDisclaimer } from "@/components/common/DataDisclaimer";
import { EmptyState } from "@/components/common/EmptyState";
import { X, RotateCcw } from "lucide-react";

function PortalContent() {
  const searchParams = useSearchParams();

  // Role / Persona State
  const [persona, setPersona] = useState<Persona>("executive");

  // Primary active navigation item
  const [activeItem, setActiveItem] = useState<NavItemKey>("dashboard");

  // Primary Workspace Mode ("dashboard" | "assistant")
  const [activeTab, setActiveTab] = useState<"dashboard" | "assistant">("dashboard");

  // Time Series Granularity
  const [timeGranularity, setTimeGranularity] = useState<"quarter" | "year">("quarter");

  // Filter Drawer & Mobile Navigation Drawers
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

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

  // Count active filters
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.year && filters.year !== "all") count++;
    if (filters.zone && filters.zone !== "all") count++;
    if (filters.state && filters.state !== "all") count++;
    if (filters.sector && filters.sector !== "all") count++;
    if (filters.segment && filters.segment !== "all") count++;
    if (filters.programme && filters.programme !== "all") count++;
    if (filters.strategicTheme && filters.strategicTheme !== "all") count++;
    if (filters.portfolioStatus && filters.portfolioStatus !== "all") count++;
    if (filters.womenLed !== null && filters.womenLed !== undefined) count++;
    if (filters.youthLed !== null && filters.youthLed !== undefined) count++;
    return count;
  }, [filters]);

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
      state: "all",
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

  const handleSelectTheme = (theme: StrategicTheme | "all") => {
    setFilters((prev) => ({
      ...prev,
      strategicTheme: theme,
    }));
  };

  const handleToggleWomen = () => {
    setFilters((prev) => ({
      ...prev,
      womenLed: prev.womenLed === true ? null : true,
    }));
  };

  const handleToggleYouth = () => {
    setFilters((prev) => ({
      ...prev,
      youthLed: prev.youthLed === true ? null : true,
    }));
  };

  // Navigation Routing Handler
  const handleNavigate = (item: NavItemKey) => {
    setActiveItem(item);
    if (item === "assistant") {
      setActiveTab("assistant");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (item === "dashboard") {
      setActiveTab("dashboard");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      setActiveTab("dashboard");
      setTimeout(() => {
        const el = document.getElementById(`section-${item}`);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 50);
    }
  };

  const personaRole = getPersonaRole(persona);

  return (
    <div className="min-h-screen bg-canvas text-ink flex flex-col font-sans selection:bg-soft-green selection:text-deep-green">
      {/* Responsive Application Shell */}
      <div className="flex-1 max-w-[1600px] w-full mx-auto p-3 sm:p-4 md:p-6 flex flex-col lg:flex-row gap-5 items-start">
        {/* Left Persistent / Mobile Off-canvas Sidebar */}
        <AppSidebar
          activeItem={activeItem}
          onNavigate={handleNavigate}
          currentPersona={persona}
          onPersonaChange={setPersona}
          isMobileOpen={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
        />

        {/* Main Content Area */}
        <main id="main-content" className="flex-1 min-w-0 w-full flex flex-col">
          {/* Top Institutional Header */}
          <AppHeader
            title={
              activeTab === "assistant"
                ? "Ask BOI AI Analyst"
                : "Impact Dashboard"
            }
            subtitle={
              activeTab === "assistant"
                ? "Interactive Development Finance Intelligence • Context-Aware Analytical Engine"
                : "Q3 2026 Reporting Cycle • National Development Mandate"
            }
            currentPersona={persona}
            onPersonaChange={setPersona}
            activeFilterCount={activeFilterCount}
            onOpenFilters={() => setIsFilterDrawerOpen(true)}
            onAskAI={() => handleNavigate("assistant")}
            onToggleMobileSidebar={() => setIsMobileSidebarOpen(true)}
          />

          {/* Active Filter Chips Strip (When filters are applied) */}
          {activeFilterCount > 0 && (
            <div className="bg-white rounded-xl p-3 mb-5 border border-border shadow-xs flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-ink-muted mr-1">
                Active Filters:
              </span>

              {filters.year && filters.year !== "all" && (
                <span className="inline-flex items-center gap-1 bg-[#F2F4F7] text-ink text-xs font-semibold px-2.5 py-1 rounded-md">
                  <span>Year: {filters.year}</span>
                  <button
                    type="button"
                    onClick={() => setFilters((p) => ({ ...p, year: "all" }))}
                    className="hover:text-risk-red text-ink-muted ml-0.5"
                    aria-label="Remove year filter"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {filters.zone && filters.zone !== "all" && (
                <span className="inline-flex items-center gap-1 bg-soft-green text-deep-green text-xs font-semibold px-2.5 py-1 rounded-md">
                  <span>Zone: {filters.zone}</span>
                  <button
                    type="button"
                    onClick={() => setFilters((p) => ({ ...p, zone: "all", state: "all" }))}
                    className="hover:text-risk-red text-deep-green ml-0.5"
                    aria-label="Remove zone filter"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {filters.state && filters.state !== "all" && (
                <span className="inline-flex items-center gap-1 bg-soft-green text-deep-green text-xs font-semibold px-2.5 py-1 rounded-md">
                  <span>State: {filters.state}</span>
                  <button
                    type="button"
                    onClick={() => setFilters((p) => ({ ...p, state: "all" }))}
                    className="hover:text-risk-red text-deep-green ml-0.5"
                    aria-label="Remove state filter"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {filters.sector && filters.sector !== "all" && (
                <span className="inline-flex items-center gap-1 bg-[#F2F4F7] text-ink text-xs font-semibold px-2.5 py-1 rounded-md">
                  <span>Sector: {filters.sector}</span>
                  <button
                    type="button"
                    onClick={() => setFilters((p) => ({ ...p, sector: "all" }))}
                    className="hover:text-risk-red text-ink-muted ml-0.5"
                    aria-label="Remove sector filter"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {filters.strategicTheme && filters.strategicTheme !== "all" && (
                <span className="inline-flex items-center gap-1 bg-[#FDF8EE] text-gold-accent text-xs font-semibold px-2.5 py-1 rounded-md">
                  <span>Theme: {filters.strategicTheme}</span>
                  <button
                    type="button"
                    onClick={() => setFilters((p) => ({ ...p, strategicTheme: "all" }))}
                    className="hover:text-risk-red text-gold-accent ml-0.5"
                    aria-label="Remove theme filter"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {filters.womenLed === true && (
                <span className="inline-flex items-center gap-1 bg-soft-green text-deep-green text-xs font-semibold px-2.5 py-1 rounded-md">
                  <span>Women-Led</span>
                  <button
                    type="button"
                    onClick={() => setFilters((p) => ({ ...p, womenLed: null }))}
                    className="hover:text-risk-red text-deep-green ml-0.5"
                    aria-label="Remove women-led filter"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {filters.youthLed === true && (
                <span className="inline-flex items-center gap-1 bg-soft-green text-deep-green text-xs font-semibold px-2.5 py-1 rounded-md">
                  <span>Youth-Led</span>
                  <button
                    type="button"
                    onClick={() => setFilters((p) => ({ ...p, youthLed: null }))}
                    className="hover:text-risk-red text-deep-green ml-0.5"
                    aria-label="Remove youth-led filter"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              <button
                type="button"
                onClick={handleResetFilters}
                className="text-xs font-semibold text-risk-red hover:underline ml-auto flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset All</span>
              </button>
            </div>
          )}

          {/* Primary View Routing */}
          {filteredRecords.length === 0 ? (
            <EmptyState onReset={handleResetFilters} />
          ) : activeTab === "assistant" ? (
            <AskBOIAIWorkspace
              records={filteredRecords}
              allRecords={SYNTHETIC_RECORDS}
              filters={filters}
              persona={personaRole}
            />
          ) : (
            <div className="space-y-5">
              {/* FIRST VIEWPORT: Signature 2-Column Grid Matching PinenMFB Composition */}
              <section
                aria-label="Executive Performance and Portfolio Trajectory"
                className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch"
              >
                {/* Left Column (8 cols): 2x2 KpiCluster (Top) + PortfolioTrajectoryCard Grouped Bars (Bottom) */}
                <div className="lg:col-span-8 flex flex-col gap-5 justify-between">
                  <KpiCluster metrics={metrics} selectedYear={filters.year} />
                  <div id="section-portfolio-trend">
                    <PortfolioTrajectoryCard
                      timeSeries={timeSeries}
                      granularity={timeGranularity}
                      onGranularityChange={setTimeGranularity}
                    />
                  </div>
                </div>

                {/* Right Column (4 cols): PrudentialRiskCard Donut (Top) + EnterpriseScaleBubbleCard D3 Bubbles (Bottom) */}
                <div className="lg:col-span-4 flex flex-col gap-5 justify-between">
                  <div id="section-portfolio">
                    <PrudentialRiskCard
                      portfolioStatus={portfolioStatusSummary}
                      totalDisbursed={metrics.totalDisbursed}
                    />
                  </div>
                  <div id="section-inclusion">
                    <EnterpriseScaleBubbleCard
                      segments={segmentSummary}
                      totalDisbursed={metrics.totalDisbursed}
                    />
                  </div>
                </div>
              </section>

              {/* BELOW THE FOLD ANALYTICAL DEEP-DIVES */}
              {/* 1. Geographic & Sub-National Allocation */}
              <section id="section-geography" aria-label="Sub-National Geographic Allocation">
                <GeographicAnalysisCard
                  statesData={stateSummary}
                  zonesData={zoneSummary}
                  totalDisbursed={metrics.totalDisbursed}
                  selectedState={filters.state}
                  onSelectState={handleSelectState}
                  selectedZone={filters.zone as GeopoliticalZone | "all"}
                  onSelectZone={handleSelectZone}
                />
              </section>

              {/* 2. Real Sector Deployment */}
              <section id="section-sectors" aria-label="Real Sector Deployment">
                <SectorAllocationCard
                  sectors={sectorSummary}
                  totalDisbursed={metrics.totalDisbursed}
                  totalEnterprises={metrics.enterprisesCount}
                  totalJobs={metrics.jobsSupported}
                  selectedSector={filters.sector as Sector | "all"}
                  onSelectSector={handleSelectSector}
                />
              </section>

              {/* 3. Demographic Inclusion & Strategic Priority Mandate Themes */}
              <section id="section-themes" aria-label="Demographic Inclusion & Strategic Mandate Pillars">
                <InclusionThemesCard
                  metrics={metrics}
                  strategicThemes={strategicThemeSummary}
                  selectedTheme={filters.strategicTheme as StrategicTheme | "all"}
                  onSelectTheme={handleSelectTheme}
                  womenFilter={filters.womenLed}
                  onToggleWomen={handleToggleWomen}
                  youthFilter={filters.youthLed}
                  onToggleYouth={handleToggleYouth}
                />
              </section>
            </div>
          )}

          {/* Institutional Audit & Synthetic Data Provenance Disclaimer */}
          <DataDisclaimer totalRecords={SYNTHETIC_RECORDS.length} />
        </main>
      </div>

      {/* Slide-out Multi-Attribute Filter Drawer */}
      <FilterDrawer
        isOpen={isFilterDrawerOpen}
        onClose={() => setIsFilterDrawerOpen(false)}
        filters={filters}
        onFilterChange={setFilters}
        onReset={handleResetFilters}
        matchingCount={filteredRecords.length}
        totalCount={SYNTHETIC_RECORDS.length}
      />
    </div>
  );
}

export default function Home() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-canvas flex items-center justify-center p-8 text-deep-green text-sm font-semibold">
          Loading Bank of Industry Impact Intelligence Portal...
        </div>
      }
    >
      <PortalContent />
    </Suspense>
  );
}
