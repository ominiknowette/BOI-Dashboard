"use client";

import React from "react";
import {
  DashboardFilterProvider,
  useDashboardFilter,
} from "@/context/DashboardFilterContext";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { AppHeader } from "@/components/layout/AppHeader";
import { ActiveFilterChips } from "@/components/filters/ActiveFilterChips";
import { FilterDrawer } from "@/components/filters/FilterDrawer";
import { DataDisclaimer } from "@/components/common/DataDisclaimer";

function DashboardLayoutInner({ children }: { children: React.ReactNode }) {
  const {
    isMobileSidebarOpen,
    setIsMobileSidebarOpen,
    isFilterDrawerOpen,
    setIsFilterDrawerOpen,
    filters,
    setFilters,
    handleResetFilters,
    filteredRecords,
    allRecords,
  } = useDashboardFilter();

  return (
    <div className="min-h-screen bg-canvas text-ink flex flex-col font-sans selection:bg-soft-green selection:text-deep-green">
      {/* Responsive Application Shell */}
      <div className="flex-1 max-w-[1600px] w-full mx-auto p-3 sm:p-4 md:p-6 flex flex-col lg:flex-row gap-5 items-start">
        {/* Left Persistent / Mobile Off-canvas Sidebar */}
        <AppSidebar
          isMobileOpen={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
        />

        {/* Main Content Viewport */}
        <main id="main-content" className="flex-1 min-w-0 w-full flex flex-col">
          {/* Top Institutional Header */}
          <AppHeader />

          {/* Active Filter Chips Strip */}
          <ActiveFilterChips />

          {/* Route Content */}
          <div className="flex-1 min-w-0">{children}</div>

          {/* Institutional Audit & Synthetic Data Provenance Disclaimer */}
          <DataDisclaimer totalRecords={allRecords.length} />
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
        totalCount={allRecords.length}
      />
    </div>
  );
}

export function DashboardClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardFilterProvider>
      <DashboardLayoutInner>{children}</DashboardLayoutInner>
    </DashboardFilterProvider>
  );
}
