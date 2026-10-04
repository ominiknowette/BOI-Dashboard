"use client";

import React from "react";
import { FilterX, RotateCcw } from "lucide-react";

interface EmptyStateProps {
  onReset: () => void;
  message?: string;
  submessage?: string;
}

export function EmptyState({
  onReset,
  message = "No facility records match your current filter criteria.",
  submessage = "Try clearing one or more active filters (e.g. Geopolitical Zone, Sector, or Year) to restore full portfolio visibility.",
}: EmptyStateProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="bg-white border border-[#DDE5DF] rounded-md p-10 text-center my-6 max-w-2xl mx-auto shadow-sm"
    >
      <div className="w-12 h-12 rounded-full bg-[#EDF5F1] text-[#0B6B4F] flex items-center justify-center mx-auto mb-4 border border-[#DDE5DF]">
        <FilterX className="w-6 h-6" aria-hidden="true" />
      </div>
      <h3 className="font-serif text-lg font-bold text-[#17201C] mb-2">
        {message}
      </h3>
      <p className="text-sm text-[#667169] mb-6 max-w-md mx-auto leading-relaxed">
        {submessage}
      </p>
      <button
        type="button"
        onClick={onReset}
        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#0B6B4F] hover:bg-[#0B4738] rounded transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B6B4F] focus-visible:ring-offset-2"
      >
        <RotateCcw className="w-4 h-4" aria-hidden="true" />
        Reset All Portfolio Filters
      </button>
    </div>
  );
}
