"use client";

import React from "react";
import { LayoutDashboard, MessageSquareText } from "lucide-react";

export type ProductTab = "dashboard" | "assistant";

interface PrimaryTabsProps {
  activeTab: ProductTab;
  onTabChange: (tab: ProductTab) => void;
  assistantQueryCount?: number;
}

export function PrimaryTabs({
  activeTab,
  onTabChange,
  assistantQueryCount = 0,
}: PrimaryTabsProps) {
  return (
    <nav className="bg-boi-surface border-b border-boi-border" aria-label="Primary navigation">
      <div className="max-w-canvas mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8 -mb-px" role="tablist">
          {/* Tab 1: Impact Dashboard */}
          <button
            role="tab"
            aria-selected={activeTab === "dashboard"}
            aria-controls="panel-dashboard"
            id="tab-dashboard"
            onClick={() => onTabChange("dashboard")}
            className={`flex items-center gap-2 py-3 text-[14px] font-medium border-b-2 transition-all duration-150 ${
              activeTab === "dashboard"
                ? "border-boi-green text-boi-green font-semibold"
                : "border-transparent text-boi-text-muted hover:text-boi-text hover:border-boi-border"
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Impact Dashboard</span>
          </button>

          {/* Tab 2: Ask BOI AI */}
          <button
            role="tab"
            aria-selected={activeTab === "assistant"}
            aria-controls="panel-assistant"
            id="tab-assistant"
            onClick={() => onTabChange("assistant")}
            className={`flex items-center gap-2 py-3 text-[14px] font-medium border-b-2 transition-all duration-150 ${
              activeTab === "assistant"
                ? "border-boi-green text-boi-green font-semibold"
                : "border-transparent text-boi-text-muted hover:text-boi-text hover:border-boi-border"
            }`}
          >
            <MessageSquareText className="w-4 h-4" />
            <span>Ask BOI AI</span>
            {assistantQueryCount > 0 && (
              <span className="inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-semibold rounded-full bg-boi-selected text-boi-green border border-boi-green/20 tabular-nums">
                {assistantQueryCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
}
