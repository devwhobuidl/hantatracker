export type CaseStatus = "DECEASED" | "CONFIRMED" | "SUSPECTED" | "MONITORING";

export interface Case {
  id: string;
  number: number;
  location: string;
  lat: number;
  lng: number;
  status: CaseStatus;
  details: string;
  sex: string;
  age: number;
  ship: string;
  source: string;
  coordinates: string;
  timestamp: string;
}

export const INITIAL_CASES: Case[] = [
  {
    id: "case-5",
    number: 5,
    location: "ZURICH, CH",
    lat: 47.37,
    lng: 8.55,
    status: "CONFIRMED",
    details: "Severe respiratory distress, pulmonary edema noted upon arrival. Patient was part of the MV Hondius excursion group.",
    sex: "MALE",
    age: 42,
    ship: "MV HONDIUS",
    source: "WHO-EUR-CH-005",
    coordinates: "47°22'N 8°32'E",
    timestamp: "2026-05-09T06:12:00Z",
  },
  {
    id: "case-12",
    number: 12,
    location: "AMSTERDAM, NL",
    lat: 52.3676,
    lng: 4.9041,
    status: "DECEASED",
    details: "Fatality confirmed at 04:30. Secondary contact of Case #2.",
    sex: "FEMALE",
    age: 67,
    ship: "MV HONDIUS",
    source: "RIVM-NL-12",
    coordinates: "52°22'N 4°54'E",
    timestamp: "2026-05-09T04:30:00Z",
  },
  {
    id: "case-8",
    number: 8,
    location: "BERLIN, DE",
    lat: 52.52,
    lng: 13.405,
    status: "SUSPECTED",
    details: "High fever, muscle aches reported. Patient currently in isolation.",
    sex: "MALE",
    age: 29,
    ship: "MV HONDIUS",
    source: "RKI-DE-08",
    coordinates: "52°31'N 13°24'E",
    timestamp: "2026-05-09T07:15:00Z",
  },
  {
    id: "case-3",
    number: 3,
    location: "PARIS, FR",
    lat: 48.8566,
    lng: 2.3522,
    status: "MONITORING",
    details: "Quarantined after potential exposure at Antwerp port.",
    sex: "FEMALE",
    age: 34,
    ship: "MV HONDIUS",
    source: "SANTÉ-FR-03",
    coordinates: "48°51'N 2°21'E",
    timestamp: "2026-05-09T02:45:00Z",
  },
  {
    id: "case-15",
    number: 15,
    location: "LONDON, UK",
    lat: 51.5074,
    lng: -0.1278,
    status: "CONFIRMED",
    details: "Detected at Heathrow screening point. Transferred to specialized biosecurity unit.",
    sex: "MALE",
    age: 51,
    ship: "MV HONDIUS",
    source: "NHS-UK-15",
    coordinates: "51°30'N 0°07'W",
    timestamp: "2026-05-09T08:20:00Z",
  },
  {
    id: "case-22",
    number: 22,
    location: "GENEVA, CH",
    lat: 46.2044,
    lng: 6.1432,
    status: "SUSPECTED",
    details: "WHO employee reporting symptoms after field visit to Zurich hub.",
    sex: "FEMALE",
    age: 39,
    ship: "N/A",
    source: "WHO-GVA-22",
    coordinates: "46°12'N 6°08'E",
    timestamp: "2026-05-09T09:10:00Z",
  },
  {
    id: "case-9",
    number: 9,
    location: "MUNICH, DE",
    lat: 48.1351,
    lng: 11.582,
    status: "MONITORING",
    details: "Contact tracing complete. Minimal symptoms observed.",
    sex: "MALE",
    age: 19,
    ship: "N/A",
    source: "STMG-DE-09",
    coordinates: "48°08'N 11°34'E",
    timestamp: "2026-05-09T05:30:00Z",
  },
  {
    id: "case-18",
    number: 18,
    location: "BRUSSELS, BE",
    lat: 50.8503,
    lng: 4.3517,
    status: "CONFIRMED",
    details: "Severe case identified in EU district. Building lockdown initiated.",
    sex: "FEMALE",
    age: 45,
    ship: "N/A",
    source: "FPS-BE-18",
    coordinates: "50°51'N 4°21'E",
    timestamp: "2026-05-09T10:05:00Z",
  },
  {
    id: "case-31",
    number: 31,
    location: "MADRID, ES",
    lat: 40.4168,
    lng: -3.7038,
    status: "SUSPECTED",
    details: "Travel history to Amsterdam identified. Fever onset T+48h.",
    sex: "MALE",
    age: 56,
    ship: "MV HONDIUS",
    source: "ISCIII-ES-31",
    coordinates: "40°25'N 3°42'W",
    timestamp: "2026-05-09T07:45:00Z",
  },
  {
    id: "case-27",
    number: 27,
    location: "ROME, IT",
    lat: 41.9028,
    lng: 12.4964,
    status: "MONITORING",
    details: "Inbound passenger from Switzerland intercepted at Fiumicino.",
    sex: "FEMALE",
    age: 28,
    ship: "N/A",
    source: "ISS-IT-27",
    coordinates: "41°54'N 12°29'E",
    timestamp: "2026-05-09T03:15:00Z",
  },
];

export const INITIAL_CHAT = [
  { id: 1, user: "istthatmystic", message: "Is it really spreading this fast?", timestamp: "07:45" },
  { id: 2, user: "elibedovic7774", message: "My cousin works at Zurich hospital, says it's crazy there.", timestamp: "07:46" },
  { id: 3, user: "cryptoguard", message: "Look at the map, Switzerland is glowing orange.", timestamp: "07:48" },
  { id: 4, user: "void_walker", message: "Stay safe everyone. Avoid public transport.", timestamp: "07:50" },
  { id: 5, user: "hanta_believer", message: "MV Hondius was the start...", timestamp: "07:51" },
];

export const INITIAL_FEED = [
  { id: 1, type: "ALERT", text: "NEW CASE CONFIRMED: ZURICH DISTRICT 5", timestamp: "1m ago" },
  { id: 2, type: "INFO", text: "MV HONDIUS QUARANTINE EXTENDED TO 21 DAYS", timestamp: "5m ago" },
  { id: 3, type: "WARNING", text: "HEATHROW AIRPORT IMPLEMENTING SCREENING FOR ALL SWISS ARRIVALS", timestamp: "12m ago" },
  { id: 4, type: "CRITICAL", text: "CFR RATE ADJUSTED TO 8.4% NATIONWIDE", timestamp: "20m ago" },
];

export const INITIAL_STATS = {
  total: 1242,
  deceased: 104,
  confirmed: 312,
  suspected: 548,
  monitoring: 278,
  locations: 42,
  cfr: "8.37%",
};
