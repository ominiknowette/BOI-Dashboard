"use client";

import React from "react";
import { Persona } from "@/types/dataset";
import { BoiLogo } from "./BoiLogo";
import { UserCheck, ShieldAlert, Sparkles, Building2, TrendingUp, Users } from "lucide-react";

interface BOIHeaderProps {
  currentPersona: Persona;
  onPersonaChange: (persona: Persona) => void;
}

export function BOIHeader({ currentPersona, onPersonaChange }: BOIHeaderProps) {
  const personas: { id: Persona; label: string; roleDesc: string; icon: React.ReactNode }[] = [
    {
      id: "executive",
      label: "Executive Management",
      roleDesc: "Strategic overview, capital disbursement, jobs & portfolio risk",
      icon: <Building2 className="w-3.5 h-3.5 text-boi-green" />,
    },
    {
      id: "strategy",
      label: "Impact & Strategy",
      roleDesc: "Detailed inclusion, geographic spread, sector & segment metrics",
      icon: <TrendingUp className="w-3.5 h-3.5 text-boi-green" />,
    },
    {
      id: "partner",
      label: "Development Partner",
      roleDesc: "Programmatic outcomes, governance, provenance & thematic reach",
      icon: <Users className="w-3.5 h-3.5 text-boi-green" />,
    },
  ];

  return (
    <header className="bg-boi-surface border-b border-boi-border sticky top-0 z-40">
      <div className="max-w-canvas mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          {/* Left: Brand & Title */}
          <div className="flex items-center gap-3">
            <BoiLogo />
            <div className="h-7 w-px bg-boi-border hidden sm:block" aria-hidden="true" />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-[17px] sm:text-[19px] font-bold tracking-tight text-boi-ink leading-none">
                  Impact Intelligence
                </h1>
                <span className="inline-flex items-center px-1.5 py-0.5 rounded-xs text-[10px] font-semibold uppercase tracking-wider bg-boi-selected text-boi-green border border-boi-green/20">
                  POC
                </span>
              </div>
              <p className="text-[12px] text-boi-text-muted mt-0.5 hidden sm:block">
                Development finance, portfolio and impact intelligence
              </p>
            </div>
          </div>

          {/* Right: Persona selector & Synthetic Data indicator */}
          <div className="flex items-center gap-3 self-end sm:self-auto">
            {/* Persona Switcher */}
            <div className="flex items-center gap-1.5 bg-boi-bg p-1 rounded-sm border border-boi-border">
              <span className="text-[11px] font-medium text-boi-text-muted px-1.5 hidden md:inline">
                View As:
              </span>
              <div className="flex items-center gap-1" role="group" aria-label="Demo persona switcher">
                {personas.map((p) => {
                  const isActive = currentPersona === p.id;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => onPersonaChange(p.id)}
                      className={`px-2.5 py-1 text-[12px] font-medium rounded-xs transition-colors duration-150 flex items-center gap-1.5 ${
                        isActive
                          ? "bg-boi-surface text-boi-ink font-semibold shadow-subtle border border-boi-border"
                          : "text-boi-text-muted hover:text-boi-text hover:bg-boi-surface/50"
                      }`}
                      title={p.roleDesc}
                    >
                      {p.icon}
                      <span className="hidden sm:inline">{p.label}</span>
                      <span className="sm:hidden">{p.label.split(" ")[0]}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* POC Data Badge */}
            <div
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm text-[11px] font-medium bg-[#F0F4F1] text-boi-ink border border-boi-border"
              title="Demonstration environment running on deterministic synthetic records. No official BOI disclosures."
            >
              <span className="w-1.5 h-1.5 rounded-full bg-boi-green" aria-hidden="true" />
              <span className="font-medium">Synthetic POC Data</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
