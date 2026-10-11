"use client";

import React, { useState, useEffect, useRef } from "react";
import { FacilityRecord, FilterState, PersonaRole } from "@/types/dataset";
import {
  AssistantResponse,
  defaultAnalyticsProvider,
} from "@/lib/assistant/assistant-provider";
import { formatNumber } from "@/lib/utils/formatters";
import {
  Send,
  Database,
  ArrowRight,
  RotateCcw,
  AlertCircle,
  Filter,
} from "lucide-react";

interface AskBOIAIWorkspaceProps {
  records: FacilityRecord[];
  allRecords: FacilityRecord[];
  filters: FilterState;
  persona: PersonaRole;
}

const STARTER_QUERIES = [
  "Which sectors received the most funding in 2025?",
  "Compare North West and South West by disbursement and jobs supported.",
  "Which states generated the most jobs per ₦1 billion disbursed?",
  "Show women-led MSME financing by geopolitical zone.",
];

export function AskBOIAIWorkspace({
  records,
  allRecords,
  filters,
  persona,
}: AskBOIAIWorkspaceProps) {
  const [queryInput, setQueryInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [history, setHistory] = useState<AssistantResponse[]>([]);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Auto-answer the first starter question on initial mount if history is empty
  useEffect(() => {
    if (history.length === 0 && records.length > 0) {
      setIsLoading(true);
      defaultAnalyticsProvider
        .processQuery(STARTER_QUERIES[0], filters, persona, allRecords)
        .then((res) => {
          setHistory([res]);
        })
        .catch(() => {
          setErrorMessage(
            "We couldn't complete that analysis. Try rephrasing the question or reset the current filters."
          );
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSend = async (qText?: string) => {
    const textToSubmit = (qText || queryInput).trim();
    if (!textToSubmit || isLoading) return;

    setIsLoading(true);
    setErrorMessage(null);
    setQueryInput("");

    try {
      const response = await defaultAnalyticsProvider.processQuery(
        textToSubmit,
        filters,
        persona,
        allRecords
      );
      setHistory((prev) => [...prev, response]);
    } catch (err) {
      console.error("AI Assistant processing error:", err);
      setErrorMessage(
        "We couldn't complete that analysis. Try rephrasing the question or reset the current filters."
      );
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  };

  const handleClear = () => {
    defaultAnalyticsProvider.resetContext();
    setHistory([]);
    setErrorMessage(null);
  };

  // Determine active filter count & labels
  const activeFilterList: string[] = [];
  if (filters.year && filters.year !== "all") activeFilterList.push(`Year: ${filters.year}`);
  if (filters.zone && filters.zone !== "all") activeFilterList.push(`Zone: ${filters.zone}`);
  if (filters.state && filters.state !== "all") activeFilterList.push(`State: ${filters.state}`);
  if (filters.sector && filters.sector !== "all") activeFilterList.push(`Sector: ${filters.sector}`);
  if (filters.segment && filters.segment !== "all") activeFilterList.push(`Segment: ${filters.segment}`);
  if (filters.programme && filters.programme !== "all") activeFilterList.push(`Programme: ${filters.programme}`);
  if (filters.strategicTheme && filters.strategicTheme !== "all") activeFilterList.push(`Theme: ${filters.strategicTheme}`);
  if (filters.womenLed) activeFilterList.push("Women-Led");
  if (filters.youthLed) activeFilterList.push("Youth-Led");

  return (
    <div className="space-y-6">
      {/* Workspace Header & Active Context Scope */}
      <div className="bg-white border border-border rounded-card shadow-card p-5">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-border/60">
          <div>
            <h2 className="text-base font-bold text-ink flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-primary-green" aria-hidden="true" />
              Ask BOI AI — Portfolio Intelligence &amp; Natural Language Analytics
            </h2>
            <p className="text-xs text-ink-muted mt-0.5">
              Deterministic analytical reasoning against verified facility records. All responses cite exact evidence, calculations, and data provenance.
            </p>
          </div>

          {history.length > 0 && (
            <button
              type="button"
              onClick={handleClear}
              className="inline-flex items-center gap-1.5 text-xs text-ink-muted hover:text-ink px-3 py-1.5 rounded-lg border border-border hover:bg-[#F2F4F7] transition-all font-semibold"
            >
              <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
              Reset Conversation
            </button>
          )}
        </div>

        {/* Active Filter Scope Notice */}
        <div className="mt-3.5 pt-1 flex flex-wrap items-center justify-between text-xs gap-2">
          <div className="flex items-center gap-2 text-deep-green">
            <Filter className="w-3.5 h-3.5 text-primary-green" aria-hidden="true" />
            <span className="font-semibold">Active Analysis Scope:</span>
            <span className="tabular-nums font-bold text-ink">
              {formatNumber(records.length)} records ({records.length === allRecords.length ? "Full Portfolio" : "Filtered Subset"})
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {activeFilterList.length > 0 ? (
              activeFilterList.map((f, i) => (
                <span
                  key={i}
                  className="bg-soft-green text-deep-green border border-primary-green/30 text-[11px] px-2.5 py-0.5 rounded-full font-semibold"
                >
                  {f}
                </span>
              ))
            ) : (
              <span className="text-[11px] text-ink-muted font-medium">
                National Scope: All 37 Territories &amp; 10 Sectors Active
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Starter Shortcuts */}
      <div className="bg-white border border-border rounded-card p-4 shadow-card">
        <span className="text-[11px] font-bold text-ink-muted uppercase tracking-wider block mb-2.5">
          Suggested Analytical Inquiries (Click to ask):
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {STARTER_QUERIES.map((sq, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleSend(sq)}
              disabled={isLoading}
              className="text-xs bg-white hover:bg-[#EDF5F1] text-[#17201C] hover:text-[#0B4738] border border-[#DDE5DF] hover:border-[#0B6B4F] px-3 py-2 rounded transition-all text-left shadow-2xs disabled:opacity-50"
            >
              &ldquo;{sq}&rdquo;
            </button>
          ))}
        </div>
      </div>

      {/* Conversation Thread */}
      <div className="space-y-6">
        {history.map((item) => (
          <article
            key={item.id}
            aria-label={`Analysis for query: ${item.query}`}
            className="bg-white border border-[#DDE5DF] rounded-md shadow-sm overflow-hidden"
          >
            {/* User Query Bar */}
            <div className="bg-[#FAFBF9] px-5 py-3 border-b border-[#DDE5DF] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="text-xs font-bold text-[#0B6B4F] uppercase tracking-wide">
                  User Inquiry
                </span>
                <span className="text-sm font-semibold text-[#17201C]">
                  &ldquo;{item.query}&rdquo;
                </span>
              </div>
              <span className="text-xs text-[#667169] tabular-nums font-mono">
                {item.timestamp}
              </span>
            </div>

            {/* Structured Analysis Body */}
            <div className="p-5 space-y-4">
              {/* Context Badge */}
              <div className="flex flex-wrap items-center gap-2 text-xs pb-1">
                <span className="text-[#667169] font-medium">Context:</span>
                <span className="font-semibold text-[#17201C]">
                  {item.provenance.activeFilters.join(" · ")}
                </span>
                <span className="text-[#DDE5DF]">|</span>
                <span className="text-[#667169]">
                  Matching Records: <strong className="text-[#17201C] tabular-nums">{formatNumber(item.provenance.recordsCount)}</strong>
                </span>
              </div>

              {/* Key Finding Callout */}
              {item.keyFinding && (
                <div className="p-3 bg-[#EDF5F1] border-l-4 border-[#0B6B4F] text-xs sm:text-sm text-[#0B4738] font-medium leading-relaxed">
                  <strong>Key Finding:</strong> {item.keyFinding}
                </div>
              )}

              {/* Detailed Narrative */}
              <div>
                <span className="text-[11px] font-bold text-[#667169] uppercase tracking-wider block mb-1">
                  Analysis
                </span>
                <p className="text-xs sm:text-sm text-[#17201C] leading-relaxed">
                  {item.analysis}
                </p>
              </div>

              {/* Evidence Container (Tables / Rankings / Metrics) */}
              {item.evidence && (
                <div className="mt-4 border border-[#DDE5DF] rounded bg-[#FAFBF9] p-4">
                  <div className="mb-3">
                    <span className="text-[10px] font-bold text-[#0B6B4F] uppercase tracking-wider block mb-0.5">
                      Evidence
                    </span>
                    <h4 className="text-xs font-bold text-[#17201C] uppercase tracking-wide">
                      {item.evidence.title}
                    </h4>
                    {item.evidence.subtitle && (
                      <p className="text-[11px] text-[#667169]">
                        {item.evidence.subtitle}
                      </p>
                    )}
                  </div>

                  {/* Evidence Type: Ranking / List */}
                  {item.evidence.type === "ranking" && item.evidence.items && (
                    <div className="space-y-2">
                      {item.evidence.items.map((it, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between text-xs p-2.5 bg-white border border-[#E8ECE9] rounded"
                        >
                          <div>
                            <span className="font-semibold text-[#17201C]">
                              {idx + 1}. {it.label}
                            </span>
                            {it.secondaryValue && (
                              <span className="text-[11px] text-[#667169] ml-2">
                                ({it.secondaryValue})
                              </span>
                            )}
                          </div>
                          <div className="text-right">
                            <span className="font-bold text-[#0B4738] tabular-nums">
                              {it.value}
                            </span>
                            {it.percentage && (
                              <span className="text-[11px] text-[#667169] ml-1.5 tabular-nums">
                                ({it.percentage})
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Evidence Type: Table */}
                  {item.evidence.type === "table" && item.evidence.columns && item.evidence.rows && (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead className="bg-[#EDF5F1] border-b border-[#DDE5DF] text-[#0B4738]">
                          <tr>
                            {item.evidence.columns.map((c, colIdx) => (
                              <th key={colIdx} className="p-2 font-semibold">
                                {c}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E8ECE9] bg-white">
                          {item.evidence.rows.map((r, rowIdx) => (
                            <tr key={rowIdx} className="hover:bg-[#FAFBF9]">
                              {r.map((cell, cellIdx) => (
                                <td
                                  key={cellIdx}
                                  className={`p-2 tabular-nums ${
                                    cellIdx > 0 ? "font-medium text-[#17201C]" : "font-semibold"
                                  }`}
                                >
                                  {cell}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* Evidence Type: Metrics Grid */}
                  {item.evidence.type === "metrics" && item.evidence.items && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      {item.evidence.items.map((m, mIdx) => (
                        <div
                          key={mIdx}
                          className="p-2.5 bg-white border border-[#E8ECE9] rounded"
                        >
                          <span className="text-[10px] text-[#667169] uppercase font-semibold block mb-0.5">
                            {m.label}
                          </span>
                          <span className="text-sm font-bold text-[#0B4738] tabular-nums block">
                            {m.value}
                          </span>
                          {m.percentage && (
                            <span className="text-[11px] text-[#0B6B4F] tabular-nums block">
                              {m.percentage}
                            </span>
                          )}
                          {m.secondaryValue && (
                            <span className="text-[10px] text-[#667169] block mt-0.5">
                              {m.secondaryValue}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Data Provenance & Source Transparency */}
              <div className="pt-3 border-t border-[#E8ECE9] flex flex-wrap items-center justify-between text-[11px] text-[#667169] gap-2">
                <div className="flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5 text-[#0B6B4F]" aria-hidden="true" />
                  <span>
                    <strong>Source Provenance:</strong> {item.provenance.datasetName} |{" "}
                    <span className="tabular-nums font-semibold text-[#17201C]">
                      {formatNumber(item.provenance.recordsCount)} records
                    </span>
                  </span>
                </div>
                <div className="text-[10px] text-[#859288] italic">
                  {item.provenance.aggregationType}
                </div>
              </div>

              {/* Suggested Follow-Ups */}
              {item.followUps && item.followUps.length > 0 && (
                <div className="pt-2">
                  <span className="text-[11px] font-semibold text-[#667169] block mb-1.5">
                    Recommended Follow-up Analyses:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {item.followUps.map((fu, fuIdx) => (
                      <button
                        key={fuIdx}
                        type="button"
                        onClick={() => handleSend(fu)}
                        disabled={isLoading}
                        className="inline-flex items-center gap-1 text-[11px] text-[#0B6B4F] hover:text-[#0B4738] bg-[#EDF5F1] hover:bg-[#DDE5DF] px-2.5 py-1 rounded transition-colors"
                      >
                        <ArrowRight className="w-3 h-3" aria-hidden="true" />
                        {fu}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </article>
        ))}

        {isLoading && (
          <div
            role="status"
            aria-live="polite"
            className="bg-white border border-[#DDE5DF] rounded-md p-5 text-center text-xs text-[#667169]"
          >
            <span className="font-semibold text-[#0B6B4F] inline-flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#0B6B4F] animate-ping" />
              Analysing portfolio data...
            </span>
          </div>
        )}

        {errorMessage && (
          <div
            role="alert"
            className="bg-[#FDF2F2] border border-[#B33A3A]/30 rounded-md p-4 text-xs text-[#B33A3A] flex items-center gap-2"
          >
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <div ref={chatBottomRef} />
      </div>

      {/* Input Form at Bottom */}
      <div className="sticky bottom-4 z-20 bg-white border border-[#DDE5DF] rounded-md shadow-md p-3">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <label htmlFor="ai-query-input" className="sr-only">
            Ask an analytical question about the BOI portfolio
          </label>
          <input
            id="ai-query-input"
            type="text"
            value={queryInput}
            onChange={(e) => setQueryInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Type your analytical question (e.g., 'Which sectors received the most funding in 2025?', 'Compare Lagos and Kano')..."
            className="flex-1 text-xs sm:text-sm border border-[#DDE5DF] rounded px-3 py-2 text-[#17201C] placeholder-[#667169] focus:outline-none focus:border-[#0B6B4F] focus:ring-1 focus:ring-[#0B6B4F]"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !queryInput.trim()}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-[#0B6B4F] hover:bg-[#0B4738] rounded transition-colors disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B6B4F]"
            aria-label="Send analytical query"
          >
            <Send className="w-4 h-4" aria-hidden="true" />
            <span className="hidden sm:inline">Ask BOI AI</span>
          </button>
        </form>
        <div className="mt-1.5 text-[10px] text-[#667169] flex justify-between items-center px-1">
          <span>Deterministic analytical engine. Evaluates verified facility records.</span>
          <span className="font-mono">Press Enter to submit</span>
        </div>
      </div>
    </div>
  );
}
