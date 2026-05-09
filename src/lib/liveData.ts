export interface ReliefWebReport {
  id: string;
  title: string;
  url: string;
  date: string;
}

export const MOCK_REPORTS: ReliefWebReport[] = [
  {
    id: "mock-1",
    title: "Hantavirus outbreak in rural Argentina: 15 cases confirmed",
    url: "https://reliefweb.int/report/argentina/hantavirus-outbreak-rural-argentina",
    date: new Date().toISOString(),
  },
  {
    id: "mock-2",
    title: "WHO issues alert for Hantavirus Pulmonary Syndrome in South America",
    url: "https://reliefweb.int/report/world/who-issues-alert-hantavirus",
    date: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "mock-3",
    title: "Seasonal Hantavirus activity increases in Southwestern USA",
    url: "https://reliefweb.int/report/united-states-america/seasonal-hantavirus-activity",
    date: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    id: "mock-4",
    title: "Research Update: New Hantavirus strains detected in rodent populations",
    url: "https://reliefweb.int/report/world/research-update-new-hantavirus-strains",
    date: new Date(Date.now() - 259200000).toISOString(),
  },
  {
    id: "mock-5",
    title: "Public Health Warning: Prevention measures for Hantavirus infection",
    url: "https://reliefweb.int/report/world/public-health-warning-prevention-measures",
    date: new Date(Date.now() - 345600000).toISOString(),
  },
];

export async function getLatestReports(): Promise<ReliefWebReport[]> {
  const appname = "hantagravity-live";
  const url = `https://api.reliefweb.int/v2/reports?appname=${appname}&query[value]=hantavirus&sort[]=date:desc&limit=5&fields[include][]=title&fields[include][]=url&fields[include][]=date.created`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.warn(`ReliefWeb API returned ${response.status}. Falling back to mock data.`);
      return MOCK_REPORTS;
    }
    const data = await response.json();
    
    if (!data.data || data.data.length === 0) {
      return MOCK_REPORTS;
    }

    return data.data.map((itemValue: { id: string; fields: { title: string; url: string; date: { created: string } } }) => ({
      id: itemValue.id,
      title: itemValue.fields.title,
      url: itemValue.fields.url,
      date: itemValue.fields.date.created,
    }));
  } catch (error) {
    console.error("Error fetching ReliefWeb reports:", error);
    return MOCK_REPORTS;
  }
}

// Mock case data for future use
export const MOCK_CASE_STATS = {
  total: 1277,
  deceased: 104,
  confirmed: 312,
  suspected: 549,
  monitoring: 278,
  locations: 42,
  cfr: "8.14%",
};
