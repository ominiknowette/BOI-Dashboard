"use client";

import React from "react";
import { useDashboardFilter } from "@/context/DashboardFilterContext";
import { AskBOIAIWorkspace } from "@/components/assistant/AskBOIAIWorkspace";
import { getPersonaRole } from "@/types/dataset";

export default function AskBOIAIView() {
  const {
    filteredRecords,
    allRecords,
    filters,
    persona,
  } = useDashboardFilter();

  const personaRole = getPersonaRole(persona);

  return (
    <div className="space-y-4">
      <AskBOIAIWorkspace
        records={filteredRecords}
        allRecords={allRecords}
        filters={filters}
        persona={personaRole}
      />
    </div>
  );
}
