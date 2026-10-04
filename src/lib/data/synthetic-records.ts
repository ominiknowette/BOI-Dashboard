import { FacilityRecord } from "@/types/dataset";
import { generateSyntheticDataset } from "./synthetic-generator";

export const POC_SEED = "boi-poc-2026";
export const POC_DATASET_VERSION = "2026.1-POC";

/**
 * 800 Deterministically seeded facility records
 * Covering all 36 Nigerian States + FCT, 6 Geopolitical Zones, 10 Sectors, and 5 Enterprise Segments.
 */
export const SYNTHETIC_RECORDS: FacilityRecord[] = generateSyntheticDataset(POC_SEED, 800);
