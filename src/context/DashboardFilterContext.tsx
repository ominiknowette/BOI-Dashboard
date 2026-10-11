"use client";

import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  useEffect,
  ReactNode,
} from "react";
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
  GeopoliticalZone,
  Sector,
  StrategicTheme,
  SyntheticRecord,
  AggregatedMetrics,
  ZoneSummary,
  StateSummary,
  SectorSummary,
  SegmentSummary,
  TimeSeriesSummary,
  PortfolioStatusSummary,
  StrategicThemeSummary,
} from "@/types/dataset";

interface DashboardFilterContextType {
  // Role / Persona
  persona: Persona;
  setPersona: (persona: Persona) => void;

  // Filter State
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  activeFilterCount: number;
  handleResetFilters: () => void;
  handleSelectZone: (zone: GeopoliticalZone | "all") => void;
  handleSelectState: (state: string) => void;
  handleSelectSector: (sector: Sector | "all") => void;
  handleSelectTheme: (theme: StrategicTheme | "all") => void;
  handleToggleWomen: () => void;
  handleToggleYouth: () => void;

  // Aggregated Data
  allRecords: SyntheticRecord[];
  filteredRecords: SyntheticRecord[];
  metrics: AggregatedMetrics;
  zoneSummary: ZoneSummary[];
  stateSummary: StateSummary[];
  sectorSummary: SectorSummary[];
  segmentSummary: SegmentSummary[];
  timeSeries: TimeSeriesSummary[];
  portfolioStatusSummary: PortfolioStatusSummary[];
  strategicThemeSummary: StrategicThemeSummary[];

  // Time Granularity
  timeGranularity: "quarter" | "year";
  setTimeGranularity: (granularity: "quarter" | "year") => void;

  // UI Drawers & Shell State
  isFilterDrawerOpen: boolean;
  setIsFilterDrawerOpen: (open: boolean) => void;
  isMobileSidebarOpen: boolean;
  setIsMobileSidebarOpen: (open: boolean) => void;
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: (collapsed: boolean) => void;
  toggleSidebarCollapsed: () => void;
}

const DashboardFilterContext = createContext<DashboardFilterContextType | null>(
  null
);

export function DashboardFilterProvider({
  children,
}: {
  children: ReactNode;
}) {
  const searchParams = useSearchParams();

  // Role Persona State
  const [persona, setPersona] = useState<Persona>("executive");

  // Sidebar Collapsed State with localStorage persistence
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("boi_sidebar_collapsed");
      if (saved !== null) {
        setIsSidebarCollapsed(saved === "true");
      }
    } catch {
      // Fallback for private mode
    }
  }, []);

  const toggleSidebarCollapsed = () => {
    setIsSidebarCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("boi_sidebar_collapsed", String(next));
      } catch {
        // Fallback
      }
      return next;
    });
  };

  // Drawers State
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Time Series Granularity
  const [timeGranularity, setTimeGranularity] = useState<"quarter" | "year">(
    "quarter"
  );

  // Filters State initialized from URL query params
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

  // Keep URL search parameters synchronized for sharing & deep linking
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

  // Active filter count
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

  // Handlers
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

  return (
    <DashboardFilterContext.Provider
      value={{
        persona,
        setPersona,
        filters,
        setFilters,
        activeFilterCount,
        handleResetFilters,
        handleSelectZone,
        handleSelectState,
        handleSelectSector,
        handleSelectTheme,
        handleToggleWomen,
        handleToggleYouth,
        allRecords: SYNTHETIC_RECORDS,
        filteredRecords,
        metrics,
        zoneSummary,
        stateSummary,
        sectorSummary,
        segmentSummary,
        timeSeries,
        portfolioStatusSummary,
        strategicThemeSummary,
        timeGranularity,
        setTimeGranularity,
        isFilterDrawerOpen,
        setIsFilterDrawerOpen,
        isMobileSidebarOpen,
        setIsMobileSidebarOpen,
        isSidebarCollapsed,
        setIsSidebarCollapsed,
        toggleSidebarCollapsed,
      }}
    >
      {children}
    </DashboardFilterContext.Provider>
  );
}

export function useDashboardFilter() {
  const context = useContext(DashboardFilterContext);
  if (!context) {
    throw new Error(
      "useDashboardFilter must be used within a DashboardFilterProvider"
    );
  }
  return context;
}
