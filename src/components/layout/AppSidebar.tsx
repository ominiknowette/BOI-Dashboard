"use client";

import React from "react";
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
  Database,
} from "lucide-react";
import { Persona, PersonaRole, getPersonaRole } from "@/types/dataset";

export type NavItemKey =
  | "dashboard"
  | "geography"
  | "sectors"
  | "portfolio"
  | "inclusion"
  | "themes"
  | "assistant";

interface AppSidebarProps {
  activeItem: NavItemKey;
  onNavigate: (item: NavItemKey) => void;
  currentPersona: Persona;
  onPersonaChange: (persona: Persona) => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export function AppSidebar({
  activeItem,
  onNavigate,
  currentPersona,
  onPersonaChange,
  isMobileOpen = false,
  onCloseMobile,
}: AppSidebarProps) {
  const personaRole = getPersonaRole(currentPersona);

  const cyclePersona = () => {
    const sequence: Persona[] = ["executive", "strategy", "partner"];
    const nextIndex = (sequence.indexOf(currentPersona) + 1) % sequence.length;
    onPersonaChange(sequence[nextIndex]);
  };

  const handleItemClick = (item: NavItemKey) => {
    onNavigate(item);
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 lg:hidden transition-opacity"
          aria-hidden="true"
        />
      )}

      <aside
        aria-label="Application Sidebar"
        className={`fixed inset-y-0 left-0 z-50 lg:static lg:z-auto w-[250px] lg:w-[240px] shrink-0 bg-surface rounded-r-2xl lg:rounded-sidebar p-5 border-r lg:border border-border shadow-sidebar flex flex-col justify-between select-none transition-transform duration-200 ease-out overflow-y-auto ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div>
          {/* BOI Brand Header */}
          <div className="flex items-center justify-between px-1 mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-tile bg-dark-boi-green flex items-center justify-center text-white shadow-sm shrink-0">
                <span className="font-bold text-lg font-sans tracking-tight">B</span>
              </div>
              <div className="min-w-0">
                <h1 className="font-bold text-sm text-ink leading-tight tracking-tight truncate">
                  Bank of Industry
                </h1>
                <p className="text-[11px] font-medium text-ink-muted leading-tight truncate">
                  Impact Intelligence
                </p>
              </div>
            </div>

            {/* Mobile close button */}
            {onCloseMobile && (
              <button
                type="button"
                onClick={onCloseMobile}
                className="lg:hidden p-1.5 text-ink-muted hover:text-ink hover:bg-[#F2F4F7] rounded-lg"
                aria-label="Close sidebar"
              >
                <ChevronRight className="w-4 h-4 rotate-180" />
              </button>
            )}
          </div>

        {/* Navigation Sections */}
        <nav className="space-y-6">
          {/* Section: Overview */}
          <div>
            <div className="text-[10px] font-bold text-ink-muted uppercase tracking-wider px-3 mb-2">
              Overview
            </div>
            <button
              type="button"
              onClick={() => handleItemClick("dashboard")}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeItem === "dashboard"
                  ? "bg-deep-green text-white shadow-sm"
                  : "text-ink-muted hover:text-ink hover:bg-[#F2F4F7]"
              }`}
            >
              <LayoutDashboard className="w-4 h-4 shrink-0" />
              <span>Dashboard</span>
            </button>
          </div>

          {/* Section: Analytics */}
          <div>
            <div className="text-[10px] font-bold text-ink-muted uppercase tracking-wider px-3 mb-2">
              Analytics
            </div>
            <div className="space-y-1">
              <button
                type="button"
                onClick={() => handleItemClick("geography")}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  activeItem === "geography"
                    ? "bg-deep-green text-white shadow-sm"
                    : "text-ink-muted hover:text-ink hover:bg-[#F2F4F7]"
                }`}
              >
                <MapPin className="w-4 h-4 shrink-0" />
                <span>Geography</span>
              </button>

              <button
                type="button"
                onClick={() => handleItemClick("sectors")}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  activeItem === "sectors"
                    ? "bg-deep-green text-white shadow-sm"
                    : "text-ink-muted hover:text-ink hover:bg-[#F2F4F7]"
                }`}
              >
                <Factory className="w-4 h-4 shrink-0" />
                <span>Sectors</span>
              </button>

              <button
                type="button"
                onClick={() => handleItemClick("portfolio")}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  activeItem === "portfolio"
                    ? "bg-deep-green text-white shadow-sm"
                    : "text-ink-muted hover:text-ink hover:bg-[#F2F4F7]"
                }`}
              >
                <PieChart className="w-4 h-4 shrink-0" />
                <span>Portfolio & Risk</span>
              </button>

              <button
                type="button"
                onClick={() => handleItemClick("inclusion")}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  activeItem === "inclusion"
                    ? "bg-deep-green text-white shadow-sm"
                    : "text-ink-muted hover:text-ink hover:bg-[#F2F4F7]"
                }`}
              >
                <Users className="w-4 h-4 shrink-0" />
                <span>Inclusion & Scale</span>
              </button>

              <button
                type="button"
                onClick={() => handleItemClick("themes")}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  activeItem === "themes"
                    ? "bg-deep-green text-white shadow-sm"
                    : "text-ink-muted hover:text-ink hover:bg-[#F2F4F7]"
                }`}
              >
                <Target className="w-4 h-4 shrink-0" />
                <span>Strategic Themes</span>
              </button>
            </div>
          </div>

          {/* Section: Intelligence */}
          <div>
            <div className="text-[10px] font-bold text-ink-muted uppercase tracking-wider px-3 mb-2">
              Intelligence
            </div>
            <button
              type="button"
              onClick={() => handleItemClick("assistant")}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeItem === "assistant"
                  ? "bg-deep-green text-white shadow-sm"
                  : "text-ink-muted hover:text-ink hover:bg-[#F2F4F7]"
              }`}
            >
              <Sparkles className="w-4 h-4 shrink-0 text-gold-accent" />
              <span>Ask BOI AI</span>
            </button>
          </div>
        </nav>
      </div>

      {/* Lower Visual Block: Role & Scope Panel (replacing "Upgrade Pro") */}
      <div className="mt-8 pt-4 border-t border-border/60">
        <div className="bg-dark-boi-green text-white rounded-card p-4 relative overflow-hidden shadow-sm">
          {/* Subtle background glow */}
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
            {currentPersona === "executive"
              ? "Full national oversight & credit risk."
              : currentPersona === "strategy"
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

        {/* Data Status Pill */}
        <div className="mt-3 flex items-center justify-center gap-1.5 text-[10px] text-ink-muted">
          <Database className="w-3 h-3 text-primary-green" />
          <span>Synthetic POC Data</span>
        </div>
      </div>
    </aside>
    </>
  );
}
