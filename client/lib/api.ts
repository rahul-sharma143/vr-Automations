import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

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
export interface UserSignup {
  name: string;
  email: string;
  password: string;
}
export interface UserLogin {
  email: string;
  password: string;
}

export interface UserResponse {
  token: string;
  ok: boolean;
  message: string;
}
export const signup = async (user: UserSignup): Promise<UserResponse> => {
  const res = await axios.post<UserResponse>(`${API_BASE}/users`, user);
  return res.data;
};
export const login = async (user: UserLogin): Promise<UserResponse> => {
  const res = await axios.post<UserResponse>(`${API_BASE}/users/login`, user);
  return res.data;
};

export const getCoins = async (): Promise<CryptoCurrency[]> => {
  const res = await axios.get<CryptoCurrency[]>(`${API_BASE}/coins`);
  return res.data;
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
