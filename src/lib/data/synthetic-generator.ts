import {
  EnterpriseSegment,
  FacilityRecord,
  GeopoliticalZone,
  PortfolioStatus,
  RepaymentStatus,
  Sector,
  StrategicTheme,
} from "@/types/dataset";
import { NIGERIA_STATES } from "./geo-metadata";
import { createPRNG, pickOne, randFloat, randInt } from "./prng";

const PROGRAMMES = [
  "National Industrial Recovery Fund",
  "Youth Enterprise Support Programme (YES-P)",
  "Women in Manufacturing & Tech (WIMT)",
  "Agro-Industrial Value Chain Development Fund",
  "Renewable Energy & Energy Efficiency Facility",
  "MSME Growth Intervention Fund",
  "Digital Creative & Tech Infrastructure Window",
  "Solid Minerals & Mining Beneficiation Fund",
] as const;

const FUNDS = [
  "BOI Special Intervention Fund",
  "Federal Ministry of Industry, Trade & Investment (FMITI) Fund",
  "BOI-AfDB Co-Financing Facility",
  "CBN SME Restructuring Window",
  "BOI Commercial Development Window",
] as const;

const PARTNERS = [
  "African Development Bank (AfDB)",
  "World Bank Group",
  "Agence Française de Développement (AFD)",
  "Islamic Development Bank (IsDB)",
  "BOI Balance Sheet Direct",
] as const;

const SECTORS: Sector[] = [
  "Manufacturing",
  "Agro-processing",
  "Infrastructure",
  "Healthcare",
  "Creative Industries",
  "Technology / Digital Economy",
  "Renewable Energy",
  "Solid Minerals",
  "Engineering",
  "Services",
];

const STRATEGIC_THEMES: StrategicTheme[] = [
  "MSMEs",
  "Gender Inclusion",
  "Youth & Skills",
  "Digital Economy",
  "Infrastructure Development",
  "Climate & Sustainability",
];

const ENTERPRISE_PREFIXES = [
  "Crown", "Apex", "Kaduna", "Lekki", "Greenfield", "Sunrise", "Prime", "Kano", "Edo", "Niger",
  "Sahara", "Atlantic", "Savannah", "Sterling", "Zaria", "Horizon", "Heritage", "Pinnacle",
  "Bluefield", "Terra", "Vanguard", "Delta", "SolidRock", "Vitality", "Aero", "Zenith",
  "Oasis", "Unity", "Golden", "Matrix", "BioHealth", "AgroMax", "Solaris", "FiberNet",
];

const ENTERPRISE_SUFFIXES = [
  "Industries Ltd", "Agro Ventures", "Processing Co.", "Tech Solutions", "Energy Systems",
  "Fabrication Works", "Logistics Ltd", "Pharmaceuticals", "Holdings", "Enterprises",
  "Engineering Ltd", "Mills Ltd", "Solar Power", "Textiles", "Health Services", "Foods Ltd",
];

export function generateSyntheticDataset(seed = "boi-poc-2026", count = 800): FacilityRecord[] {
  const rng = createPRNG(seed);
  const records: FacilityRecord[] = [];

  // Guarantee that every state gets baseline representation
  // 37 territories * 15 minimum = 555 records, remaining 245 distributed
  let recordCounter = 1;

  for (let i = 0; i < count; i++) {
    // Select state: ensure even coverage for first 37 * 15 records
    const stateMeta =
      i < NIGERIA_STATES.length * 16
        ? NIGERIA_STATES[i % NIGERIA_STATES.length]
        : pickOne(NIGERIA_STATES, rng);

    const state = stateMeta.name;
    const geopoliticalZone: GeopoliticalZone = stateMeta.zone;

    // Enterprise segment distribution
    // Nano: 20%, Micro: 30%, Small: 25%, Medium: 15%, Large: 10%
    const segRoll = rng();
    let enterpriseSegment: EnterpriseSegment = "Micro";
    let amountApproved = 0;
    let jobsSupported = 0;

    if (segRoll < 0.2) {
      enterpriseSegment = "Nano";
      amountApproved = Math.round(randFloat(300_000, 1_800_000, rng) / 50_000) * 50_000;
      jobsSupported = randInt(1, 4, rng);
    } else if (segRoll < 0.5) {
      enterpriseSegment = "Micro";
      amountApproved = Math.round(randFloat(2_500_000, 12_000_000, rng) / 250_000) * 250_000;
      jobsSupported = randInt(3, 12, rng);
    } else if (segRoll < 0.75) {
      enterpriseSegment = "Small";
      amountApproved = Math.round(randFloat(18_000_000, 110_000_000, rng) / 1_000_000) * 1_000_000;
      jobsSupported = randInt(12, 45, rng);
    } else if (segRoll < 0.9) {
      enterpriseSegment = "Medium";
      amountApproved = Math.round(randFloat(140_000_000, 850_000_000, rng) / 5_000_000) * 5_000_000;
      jobsSupported = randInt(40, 180, rng);
    } else {
      enterpriseSegment = "Large Enterprise";
      amountApproved = Math.round(randFloat(1_200_000_000, 16_000_000_000, rng) / 50_000_000) * 50_000_000;
      jobsSupported = randInt(130, 1_250, rng);
    }

    // Disbursement percentage (typically 80% to 100% of approved)
    const disburseRatio = randFloat(0.85, 1.0, rng);
    const amountDisbursed = Math.round(amountApproved * disburseRatio);

    // Outstanding balance (typically 40% to 90% of disbursed depending on age)
    const outstandingRatio = randFloat(0.35, 0.92, rng);
    const outstandingAmount = Math.round(amountDisbursed * outstandingRatio);

    // Sector selection with weighted propensity
    const sector = pickOne(SECTORS, rng);

    // Strategic theme
    let strategicTheme: StrategicTheme = "MSMEs";
    if (sector === "Renewable Energy") strategicTheme = "Climate & Sustainability";
    else if (sector === "Technology / Digital Economy" || sector === "Creative Industries")
      strategicTheme = "Digital Economy";
    else if (sector === "Infrastructure" || sector === "Engineering")
      strategicTheme = "Infrastructure Development";
    else if (rng() < 0.35) strategicTheme = "Gender Inclusion";
    else if (rng() < 0.5) strategicTheme = "Youth & Skills";
    else strategicTheme = "MSMEs";

    // Women-led: higher in certain sectors/themes
    const womenLed =
      strategicTheme === "Gender Inclusion"
        ? true
        : rng() < 0.32;

    // Youth-led: higher in youth theme or tech/creative
    const youthLed =
      strategicTheme === "Youth & Skills" || sector === "Technology / Digital Economy"
        ? true
        : rng() < 0.28;

    // Dates across 2023 - 2026
    const yearRoll = rng();
    let year = 2025;
    if (yearRoll < 0.18) year = 2023;
    else if (yearRoll < 0.45) year = 2024;
    else if (yearRoll < 0.85) year = 2025;
    else year = 2026;

    const month = randInt(1, year === 2026 ? 8 : 12, rng);
    const day = randInt(1, 28, rng);
    const quarterNum = Math.ceil(month / 3);
    const quarter = `${year}-Q${quarterNum}`;

    const approvalDate = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const disburseMonth = Math.min(12, month + randInt(0, 2, rng));
    const disbursementDate = `${year}-${String(disburseMonth).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

    // Portfolio Status:
    // Performing (88%), Watchlist (7%), Substandard (3%), Doubtful (2%)
    const portRoll = rng();
    let portfolioStatus: PortfolioStatus = "Performing";
    let repaymentStatus: RepaymentStatus = "Current";

    if (portRoll < 0.88) {
      portfolioStatus = "Performing";
      repaymentStatus = rng() < 0.85 ? "Current" : "Grace Period";
    } else if (portRoll < 0.95) {
      portfolioStatus = "Watchlist";
      repaymentStatus = "Restructured";
    } else if (portRoll < 0.98) {
      portfolioStatus = "Substandard";
      repaymentStatus = "Overdue 30-90 Days";
    } else {
      portfolioStatus = "Doubtful";
      repaymentStatus = "Overdue 30-90 Days";
    }

    const programme = pickOne(PROGRAMMES, rng);
    const fund = pickOne(FUNDS, rng);
    const developmentPartner = pickOne(PARTNERS, rng);

    const enterpriseName = `${pickOne(ENTERPRISE_PREFIXES, rng)} ${pickOne(ENTERPRISE_SUFFIXES, rng)}`;

    const originatingUnit =
      enterpriseSegment === "Large Enterprise"
        ? "Large Enterprises Directorate"
        : enterpriseSegment === "Nano" || enterpriseSegment === "Micro"
        ? "Micro & MSME Directorate"
        : "SME Commercial Directorate";

    const facilityId = `BOI-FAC-${year}-${String(recordCounter).padStart(4, "0")}`;
    recordCounter++;

    records.push({
      facilityId,
      enterpriseName,
      programme,
      fund,
      sector,
      strategicTheme,
      enterpriseSegment,
      state,
      geopoliticalZone,
      amountApproved,
      amountDisbursed,
      outstandingAmount,
      jobsSupported,
      womenLed,
      youthLed,
      approvalDate,
      disbursementDate,
      year,
      quarter,
      portfolioStatus,
      repaymentStatus,
      originatingUnit,
      developmentPartner,
    });
  }

  return records;
}
