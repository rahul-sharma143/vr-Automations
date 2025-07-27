import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "/api";

export interface CryptoCurrency {
  id: string;
  name: string;
  symbol: string;
  current_price: number;
  market_cap: number;
  price_change_percentage_24h: number;
  last_updated: string;
  image: string;
  market_cap_rank: number;
  price_change_percentage_7d?: number;
  total_volume?: number;
  circulating_supply?: number;
}

export interface HistoryData {
  id: string;
  timestamp: string;
  data: CryptoCurrency[];
}

export const getCoins = async (): Promise<CryptoCurrency[]> => {
  try {
    const res = await axios.get<CryptoCurrency[]>(`${API_BASE}/crypto`);

    // Ensure we always return an array
    if (!Array.isArray(res.data)) {
      console.error("API returned non-array data:", res.data);
      return [];
    }

    return res.data;
  } catch (error) {
    console.error("Error fetching coins:", error);
    return [];
  }
};

export const saveSnapshot = async (): Promise<{ timestamp: string }> => {
  const res = await axios.post<{ timestamp: string }>(`${API_BASE}/history`);
  return res.data;
};

export const getHistory = async (): Promise<HistoryData[]> => {
  const res = await axios.get<HistoryData[]>(`${API_BASE}/history`);
  return res.data;
};

export const getCoinHistory = async (coinId: string): Promise<any[]> => {
  const res = await axios.get<any[]>(`${API_BASE}/history/${coinId}`);
  return res.data;
};
