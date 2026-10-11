"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SlidersHorizontal, User, Sparkles, ChevronDown, Menu } from "lucide-react";
import { Persona, getPersonaRole } from "@/types/dataset";
import { useDashboardFilter } from "@/context/DashboardFilterContext";

interface RouteHeaderMeta {
  title: string;
  subtitle: string;
}

const ROUTE_META: Record<string, RouteHeaderMeta> = {
  "/dashboard": {
    title: "Executive Impact Dashboard",
    subtitle: "Q3 2026 Reporting Cycle • National Development Mandate",
  },
  "/dashboard/geography": {
    title: "Geographic Allocation",
    subtitle: "Sub-National Credit Deployment • 36 States & FCT Distribution",
  },
  "/dashboard/sectors": {
    title: "Real-Sector Allocation",
    subtitle: "Industrial & Value-Chain Deployment • 10 Priority Real Sectors",
  },
  "/dashboard/portfolio-risk": {
    title: "Portfolio & Prudential Risk",
    subtitle: "Credit Quality, NPL Distribution & Capital Adequacy Oversight",
  },
  "/dashboard/inclusion-scale": {
    title: "Inclusion & Enterprise Scale",
    subtitle: "MSME Tier Deployment, Nano Enterprise Coverage & Demographic Parity",
  },
  "/dashboard/strategic-themes": {
    title: "Strategic Mandate Themes",
    subtitle: "National Priorities: Industrialisation, Export Expansion & Green Transition",
  },
  "/dashboard/ask-boi-ai": {
    title: "Ask BOI AI Analyst",
    subtitle: "Interactive Development Finance Intelligence • Context-Aware Analytical Engine",
  },
};

export function AppHeader() {
  const pathname = usePathname();
  const {
    persona,
    setPersona,
    activeFilterCount,
    setIsFilterDrawerOpen,
    setIsMobileSidebarOpen,
  } = useDashboardFilter();

  const personaRole = getPersonaRole(persona);

  // Derive route metadata or fallback to default
  const currentMeta = ROUTE_META[pathname] || {
    title: "Executive Impact Dashboard",
    subtitle: "Q3 2026 Reporting Cycle • National Development Mandate",
  };

  const isAskAIPage = pathname === "/dashboard/ask-boi-ai";

  return (
    <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      {/* Left: Mobile hamburger + Route Title & Subtitle */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setIsMobileSidebarOpen(true)}
          className="lg:hidden p-2 bg-white rounded-lg border border-border shadow-xs text-ink hover:bg-[#F2F4F7] transition-colors"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5 text-deep-green" />
        </button>
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-ink">
            {currentMeta.title}
          </h2>
          <p className="text-xs font-medium text-ink-muted mt-0.5">
            {currentMeta.subtitle}
          </p>
        </div>
      </div>

      {/* Right: Controls & Profile */}
      <div className="flex items-center gap-3">
        {/* Ask AI Quick Trigger (Hidden when on Ask AI page) */}
        {!isAskAIPage && (
          <Link
            href="/dashboard/ask-boi-ai"
            className="hidden md:flex items-center gap-2 bg-white hover:bg-[#F2F4F7] text-ink text-xs font-semibold px-3 py-2 rounded-control border border-border shadow-card transition-all"
            title="Open Natural Language Intelligence"
          >
            <Sparkles className="w-3.5 h-3.5 text-gold-accent" />
            <span>Ask AI</span>
          </Link>
        )}

        {/* Global Filter Trigger */}
        <button
          type="button"
          onClick={() => setIsFilterDrawerOpen(true)}
          className="flex items-center gap-2 bg-white hover:bg-[#F2F4F7] text-ink text-xs font-semibold px-3.5 py-2 rounded-control border border-border shadow-card transition-all"
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-deep-green" />
          <span>Filters</span>
          {activeFilterCount > 0 && (
            <span className="bg-primary-green text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full leading-tight">
              {activeFilterCount}
            </span>
          )}
        </button>

        {/* Role Switcher Dropdown */}
        <div className="relative">
          <select
            value={persona}
            onChange={(e) => setPersona(e.target.value as Persona)}
            aria-label="Select User Role"
            className="appearance-none bg-white hover:bg-[#F2F4F7] text-ink text-xs font-semibold pl-3 pr-8 py-2 rounded-control border border-border shadow-card cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-green/20"
          >
            <option value="executive">Executive Management</option>
            <option value="strategy">Impact & Strategy</option>
            <option value="partner">Development Partner</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-ink-muted absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* User Profile Tile (Matching PinenMFB exactly) */}
        <div className="flex items-center gap-2.5 pl-1">
          <div className="w-9 h-9 rounded-full bg-white border border-border flex items-center justify-center text-ink shadow-sm shrink-0">
            <User className="w-4 h-4 text-deep-green" />
          </div>
          <div className="hidden lg:block text-left">
            <div className="text-xs font-bold text-ink leading-tight">
              Antonio Samuel
            </div>
            <div className="text-[10px] font-medium text-ink-muted leading-tight">
              {personaRole}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
