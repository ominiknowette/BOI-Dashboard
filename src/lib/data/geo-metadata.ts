import { GeopoliticalZone } from "@/types/dataset";

export interface StateMeta {
  code: string;
  name: string;
  capital: string;
  zone: GeopoliticalZone;
  x: number; // approximate relative SVG map position (0-1000)
  y: number; // approximate relative SVG map position (0-800)
  pathD?: string;
}

export const GEOPOLITICAL_ZONES: GeopoliticalZone[] = [
  "North Central",
  "North East",
  "North West",
  "South East",
  "South South",
  "South West",
];

export const NIGERIA_STATES: StateMeta[] = [
  // North Central (7)
  { code: "FC", name: "FCT", capital: "Abuja", zone: "North Central", x: 490, y: 390 },
  { code: "BE", name: "Benue", capital: "Makurdi", zone: "North Central", x: 570, y: 500 },
  { code: "KO", name: "Kogi", capital: "Lokoja", zone: "North Central", x: 450, y: 470 },
  { code: "KW", name: "Kwara", capital: "Ilorin", zone: "North Central", x: 310, y: 410 },
  { code: "NA", name: "Nasarawa", capital: "Lafia", zone: "North Central", x: 550, y: 430 },
  { code: "NI", name: "Niger", capital: "Minna", zone: "North Central", x: 380, y: 340 },
  { code: "PL", name: "Plateau", capital: "Jos", zone: "North Central", x: 600, y: 360 },

  // North East (6)
  { code: "AD", name: "Adamawa", capital: "Yola", zone: "North East", x: 790, y: 390 },
  { code: "BA", name: "Bauchi", capital: "Bauchi", zone: "North East", x: 670, y: 280 },
  { code: "BO", name: "Borno", capital: "Maiduguri", zone: "North East", x: 860, y: 190 },
  { code: "GO", name: "Gombe", capital: "Gombe", zone: "North East", x: 740, y: 290 },
  { code: "TA", name: "Taraba", capital: "Jalingo", zone: "North East", x: 710, y: 460 },
  { code: "YO", name: "Yobe", capital: "Damaturu", zone: "North East", x: 760, y: 180 },

  // North West (7)
  { code: "JI", name: "Jigawa", capital: "Dutse", zone: "North West", x: 610, y: 180 },
  { code: "KD", name: "Kaduna", capital: "Kaduna", zone: "North West", x: 490, y: 280 },
  { code: "KN", name: "Kano", capital: "Kano", zone: "North West", x: 550, y: 190 },
  { code: "KT", name: "Katsina", capital: "Katsina", zone: "North West", x: 470, y: 140 },
  { code: "KE", name: "Kebbi", capital: "Birnin Kebbi", zone: "North West", x: 250, y: 210 },
  { code: "SO", name: "Sokoto", capital: "Sokoto", zone: "North West", x: 330, y: 140 },
  { code: "ZA", name: "Zamfara", capital: "Gusau", zone: "North West", x: 400, y: 200 },

  // South East (5)
  { code: "AB", name: "Abia", capital: "Umuahia", zone: "South East", x: 490, y: 640 },
  { code: "AN", name: "Anambra", capital: "Awka", zone: "South East", x: 440, y: 590 },
  { code: "EB", name: "Ebonyi", capital: "Abakaliki", zone: "South East", x: 530, y: 570 },
  { code: "EN", name: "Enugu", capital: "Enugu", zone: "South East", x: 490, y: 550 },
  { code: "IM", name: "Imo", capital: "Owerri", zone: "South East", x: 440, y: 640 },

  // South South (6)
  { code: "AK", name: "Akwa Ibom", capital: "Uyo", zone: "South South", x: 510, y: 690 },
  { code: "BY", name: "Bayelsa", capital: "Yenagoa", zone: "South South", x: 380, y: 680 },
  { code: "CR", name: "Cross River", capital: "Calabar", zone: "South South", x: 570, y: 630 },
  { code: "DE", name: "Delta", capital: "Asaba", zone: "South South", x: 380, y: 590 },
  { code: "ED", name: "Edo", capital: "Benin City", zone: "South South", x: 360, y: 510 },
  { code: "RI", name: "Rivers", capital: "Port Harcourt", zone: "South South", x: 440, y: 690 },

  // South West (6)
  { code: "EK", name: "Ekiti", capital: "Ado-Ekiti", zone: "South West", x: 320, y: 470 },
  { code: "LA", name: "Lagos", capital: "Ikeja", zone: "South West", x: 190, y: 550 },
  { code: "OG", name: "Ogun", capital: "Abeokuta", zone: "South West", x: 210, y: 510 },
  { code: "ON", name: "Ondo", capital: "Akure", zone: "South West", x: 310, y: 520 },
  { code: "OS", name: "Osun", capital: "Osogbo", zone: "South West", x: 270, y: 470 },
  { code: "OY", name: "Oyo", capital: "Ibadan", zone: "South West", x: 220, y: 440 },
];

export const STATE_BY_NAME = new Map<string, StateMeta>(
  NIGERIA_STATES.map((s) => [s.name.toLowerCase(), s])
);

export const STATE_TO_ZONE: Record<string, GeopoliticalZone> = Object.fromEntries(
  NIGERIA_STATES.map((s) => [s.name, s.zone])
);

export function getZoneForState(stateName: string): GeopoliticalZone | undefined {
  return STATE_TO_ZONE[stateName] || STATE_BY_NAME.get(stateName.toLowerCase())?.zone;
}
