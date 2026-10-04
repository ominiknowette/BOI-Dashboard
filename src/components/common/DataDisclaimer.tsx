import React from "react";
import { ShieldCheck, FileSpreadsheet } from "lucide-react";

export function DataDisclaimer({ totalRecords = 800 }: { totalRecords?: number }) {
  return (
    <footer className="bg-boi-surface border-t border-boi-border mt-16 py-8" role="contentinfo">
      <div className="max-w-canvas mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="text-[12px] font-bold uppercase tracking-wider text-boi-green-deep">
                Bank of Industry • Proof of Concept
              </span>
              <span className="text-boi-border">•</span>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-boi-green">
                <ShieldCheck className="w-3.5 h-3.5" />
                Audit: 100% Mathematically Reconciled
              </span>
            </div>
            <p className="text-[13px] text-boi-text leading-relaxed">
              <strong>Illustrative synthetic data for proof-of-concept demonstration. No real BOI client data is included.</strong> Portfolio balances, facility counts, job figures and sector distributions are derived from deterministic demonstration records.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 text-[12px] text-boi-text-muted pt-2 md:pt-0">
            <div className="flex items-center gap-2 bg-boi-bg px-3 py-1.5 rounded-sm border border-boi-border">
              <FileSpreadsheet className="w-4 h-4 text-boi-green" />
              <span>Seed: <code className="font-mono text-boi-ink">boi-poc-2026</code></span>
              <span className="text-boi-border">|</span>
              <span>Scope: <strong className="text-boi-ink tabular-nums">36 States + FCT</strong></span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
