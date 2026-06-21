export interface CommodityRecord {
  Arrival_Date: string;
  Commodity: string;
  Commodity_Code: string;
  District: string;
  Grade: string;
  Market: string;
  Max_Price: string;
  Min_Price: string;
  Modal_Price: string;
  State: string;
  Variety: string;
}

export interface ApiResponse {
  records: CommodityRecord[];
  total: number;
  count: number;
  limit: string;
  offset: string;
}

const API_KEY = "579b464db66ec23bdd0000016958416b1f65421560b659f8970b0192";

export async function fetchLivePrices(
  commodity: string = "Wheat",
  state?: string,
  district?: string,
  market?: string,
  variety?: string
): Promise<CommodityRecord[]> {
  const params = new URLSearchParams({
    'api-key': API_KEY,
    format: 'json',
    limit: '1000'
  });

  if (commodity && commodity !== 'All Commodities') params.append('filters[Commodity]', commodity);
  if (state && state !== 'All States') params.append('filters[State]', state);
  if (district && district !== 'All Districts') params.append('filters[District]', district);
  if (market && market !== 'All Markets') params.append('filters[Market]', market);
  if (variety && variety !== 'All Varieties') params.append('filters[Variety]', variety);

  // Since the proxy URL was fixed, we can now use the API's native sorting
  params.append('sort[Arrival_Date]', 'desc');

  try {
    const response = await fetch(`https://api.data.gov.in/resource/35985678-0d79-46b4-9ed6-6f13308a1d24?${params.toString()}`);
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    const data: ApiResponse = await response.json();
    
    // Sort client-side descending
    let records = data.records || [];
    records.sort((a, b) => {
      const dateA = a.Arrival_Date.split('/').reverse().join('-');
      const dateB = b.Arrival_Date.split('/').reverse().join('-');
      return new Date(dateB).getTime() - new Date(dateA).getTime();
    });
    
    return records;
  } catch (error) {
    console.error("Failed to fetch live prices:", error);
    return [];
  }
}

export function aggregateTrendData(records: CommodityRecord[]) {
  // We want to group by Arrival_Date and calculate average Modal_Price
  const grouped = records.reduce((acc, record) => {
    const date = record.Arrival_Date;
    if (!acc[date]) {
      acc[date] = { sum: 0, count: 0, min: Infinity, max: -Infinity };
    }
    const price = parseFloat(record.Modal_Price);
    if (!isNaN(price)) {
      acc[date].sum += price;
      acc[date].count += 1;
      acc[date].min = Math.min(acc[date].min, parseFloat(record.Min_Price));
      acc[date].max = Math.max(acc[date].max, parseFloat(record.Max_Price));
    }
    return acc;
  }, {} as Record<string, { sum: number; count: number, min: number, max: number }>);

  const trendData = Object.keys(grouped).map(date => {
    const [dd, mm, yyyy] = date.split('/');
    return {
      date,
      sortableDate: new Date(`${yyyy}-${mm}-${dd}`),
      avgPrice: Math.round(grouped[date].sum / grouped[date].count),
      minPrice: grouped[date].min,
      maxPrice: grouped[date].max
    };
  });

  // Sort ascending for chart
  trendData.sort((a, b) => a.sortableDate.getTime() - b.sortableDate.getTime());
  
  // Filter for exactly the last 7 days up to today
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(today.getDate() - 7);
  sevenDaysAgo.setHours(0, 0, 0, 0);

  const sevenDayTrend = trendData.filter(d => d.sortableDate >= sevenDaysAgo && d.sortableDate <= today);

  return sevenDayTrend;
}
