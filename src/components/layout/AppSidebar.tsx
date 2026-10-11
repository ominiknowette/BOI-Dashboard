"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  MapPin,
  Factory,
  PieChart,
  Users,
  Target,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  ChevronLeft,
  Database,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { Persona, getPersonaRole } from "@/types/dataset";
import { useDashboardFilter } from "@/context/DashboardFilterContext";

export type NavItemKey =
  | "dashboard"
  | "geography"
  | "sectors"
  | "portfolio"
  | "inclusion"
  | "themes"
  | "assistant";

interface NavItemConfig {
  key: NavItemKey;
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  isSpecial?: boolean;
}

const NAV_ITEMS: {
  section: string;
  items: NavItemConfig[];
}[] = [
  {
    section: "Overview",
    items: [
      {
        key: "dashboard",
        label: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    section: "Analytics",
    items: [
      {
        key: "geography",
        label: "Geography",
        href: "/dashboard/geography",
        icon: MapPin,
      },
      {
        key: "sectors",
        label: "Sectors",
        href: "/dashboard/sectors",
        icon: Factory,
      },
      {
        key: "portfolio",
        label: "Portfolio & Risk",
        href: "/dashboard/portfolio-risk",
        icon: PieChart,
      },
      {
        key: "inclusion",
        label: "Inclusion & Scale",
        href: "/dashboard/inclusion-scale",
        icon: Users,
      },
      {
        key: "themes",
        label: "Strategic Themes",
        href: "/dashboard/strategic-themes",
        icon: Target,
      },
    ],
  },
  {
    section: "Intelligence",
    items: [
      {
        key: "assistant",
        label: "Ask BOI AI",
        href: "/dashboard/ask-boi-ai",
        icon: Sparkles,
        isSpecial: true,
      },
    ],
  },
];

interface AppSidebarProps {
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export function AppSidebar({
  isMobileOpen = false,
  onCloseMobile,
}: AppSidebarProps) {
  const pathname = usePathname();
  const {
    persona,
    setPersona,
    isSidebarCollapsed,
    toggleSidebarCollapsed,
  } = useDashboardFilter();

  const personaRole = getPersonaRole(persona);

  const cyclePersona = () => {
    const sequence: Persona[] = ["executive", "strategy", "partner"];
    const nextIndex = (sequence.indexOf(persona) + 1) % sequence.length;
    setPersona(sequence[nextIndex]);
  };

  // Close mobile drawer on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isMobileOpen && onCloseMobile) {
        onCloseMobile();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isMobileOpen, onCloseMobile]);

  // Lock body scroll on mobile when drawer is open
  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileOpen]);

  const isItemActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 lg:hidden transition-opacity duration-200"
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        aria-label="Application Sidebar"
        className={`fixed inset-y-0 left-0 z-50 lg:static lg:z-auto shrink-0 bg-surface rounded-r-2xl lg:rounded-sidebar border-r lg:border border-border shadow-sidebar flex flex-col justify-between select-none transition-all duration-200 ease-in-out ${
          /* Desktop sticky height and scroll */
          "lg:sticky lg:top-5 lg:h-[calc(100dvh-2.5rem)]"
        } ${
          /* Mobile slide-in behavior */
          isMobileOpen
            ? "translate-x-0 w-[260px] p-5 overflow-y-auto"
            : "-translate-x-full lg:translate-x-0"
        } ${
          /* Desktop collapsible width & padding */
          isSidebarCollapsed
            ? "lg:w-[76px] lg:p-3"
            : "lg:w-[240px] lg:p-5"
        }`}
      >
        {/* Top Header & Navigation Section (scrollable if needed) */}
        <div className="flex-1 min-h-0 flex flex-col overflow-y-auto">
          {/* BOI Brand Header */}
          <div
            className={`flex items-center mb-6 shrink-0 ${
              isSidebarCollapsed
                ? "justify-center"
                : "justify-between px-1"
            }`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div
                className="w-10 h-10 rounded-tile bg-dark-boi-green flex items-center justify-center text-white shadow-sm shrink-0"
                title="Bank of Industry Impact Portal"
              >
                <span className="font-bold text-lg font-sans tracking-tight">
                  B
                </span>
              </div>

              {!isSidebarCollapsed && (
                <div className="min-w-0">
                  <h1 className="font-bold text-sm text-ink leading-tight tracking-tight truncate">
                    Bank of Industry
                  </h1>
                  <p className="text-[11px] font-medium text-ink-muted leading-tight truncate">
                    Impact Intelligence
                  </p>
                </div>
              )}
            </div>

            {/* Desktop Collapse / Expand Toggle */}
            <button
              type="button"
              onClick={toggleSidebarCollapsed}
              className={`hidden lg:flex p-1.5 text-ink-muted hover:text-ink hover:bg-[#F2F4F7] rounded-lg transition-colors ${
                isSidebarCollapsed ? "mt-3" : ""
              }`}
              title={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              aria-label={
                isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"
              }
            >
              {isSidebarCollapsed ? (
                <PanelLeftOpen className="w-4 h-4 text-ink-muted" />
              ) : (
                <PanelLeftClose className="w-4 h-4 text-ink-muted" />
              )}
            </button>

            {/* Mobile Close Button */}
            {onCloseMobile && (
              <button
                type="button"
                onClick={onCloseMobile}
                className="lg:hidden p-1.5 text-ink-muted hover:text-ink hover:bg-[#F2F4F7] rounded-lg"
                aria-label="Close sidebar"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Navigation Items */}
          <nav className="space-y-5 flex-1" aria-label="Main Navigation">
            {NAV_ITEMS.map((sectionGroup) => (
              <div key={sectionGroup.section}>
                {!isSidebarCollapsed ? (
                  <div className="text-[10px] font-bold text-ink-muted uppercase tracking-wider px-3 mb-2">
                    {sectionGroup.section}
                  </div>
                ) : (
                  <div className="w-full border-t border-border/40 my-2" />
                )}

                <div className="space-y-1">
                  {sectionGroup.items.map((item) => {
                    const active = isItemActive(item.href);
                    const Icon = item.icon;

                    return (
                      <Link
                        key={item.key}
                        href={item.href}
                        onClick={() => {
                          if (onCloseMobile) onCloseMobile();
                        }}
                        title={isSidebarCollapsed ? item.label : undefined}
                        className={`w-full flex items-center rounded-xl text-xs font-semibold transition-all group ${
                          isSidebarCollapsed
                            ? "justify-center p-2.5"
                            : "gap-3 px-3.5 py-2.5"
                        } ${
                          active
                            ? "bg-deep-green text-white shadow-sm"
                            : "text-ink-muted hover:text-ink hover:bg-[#F2F4F7]"
                        }`}
                      >
                        <Icon
                          className={`w-4 h-4 shrink-0 transition-transform ${
                            active
                              ? "text-white"
                              : item.isSpecial
                              ? "text-gold-accent"
                              : "text-ink-muted group-hover:text-ink"
                          }`}
                        />
                        {!isSidebarCollapsed && (
                          <span className="truncate">{item.label}</span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </div>

        {/* Lower Role & Scope Panel */}
        <div
          className={`shrink-0 pt-3 border-t border-border/60 ${
            isSidebarCollapsed ? "mt-2" : "mt-6"
          }`}
        >
          {isSidebarCollapsed ? (
            /* Collapsed Role Icon Trigger */
            <div className="flex flex-col items-center gap-2">
              <button
                type="button"
                onClick={cyclePersona}
                className="w-10 h-10 rounded-xl bg-dark-boi-green text-white hover:bg-deep-green flex items-center justify-center transition-all shadow-xs"
                title={`Active Scope: ${personaRole} (Click to switch)`}
                aria-label={`Switch role from ${personaRole}`}
              >
                <ShieldCheck className="w-4 h-4 text-soft-green" />
              </button>
            </div>
          ) : (
            /* Expanded PinenMFB Active Scope Tile */
            <div className="bg-dark-boi-green text-white rounded-card p-4 relative overflow-hidden shadow-sm">
              <div className="absolute -right-6 -bottom-6 w-20 h-20 bg-primary-green/20 rounded-full blur-xl pointer-events-none" />

              <div className="flex items-center gap-2 mb-2">
                <div className="w-5 h-5 rounded-md bg-white/10 flex items-center justify-center">
                  <ShieldCheck className="w-3.5 h-3.5 text-soft-green" />
                </div>
                <span className="text-[10px] font-bold tracking-wider uppercase text-soft-green">
                  Active Scope
                </span>
              </div>

              <p className="text-xs font-bold leading-tight truncate mb-1">
                {personaRole}
              </p>

              <p className="text-[11px] text-white/70 leading-normal mb-3">
                {persona === "executive"
                  ? "Full national oversight & credit risk."
                  : persona === "strategy"
                  ? "Developmental returns & inclusion."
                  : "Multilateral aggregated proof."}
              </p>

              <button
                type="button"
                onClick={cyclePersona}
                className="w-full bg-primary-green hover:bg-primary-green/90 active:scale-[0.98] text-white text-[11px] font-bold py-1.5 px-3 rounded-control flex items-center justify-center gap-1.5 transition-all shadow-sm"
              >
                <span>Switch Role</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Synthetic POC Indicator */}
          {!isSidebarCollapsed && (
            <div className="mt-3 flex items-center justify-center gap-1.5 text-[10px] text-ink-muted">
              <Database className="w-3 h-3 text-primary-green" />
              <span>Synthetic POC Data</span>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
