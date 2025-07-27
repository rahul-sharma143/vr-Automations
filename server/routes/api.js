import express from "express";
import fetch from "node-fetch";
import Coin from "../models/coin.js";
import History from "../models/History.js";

const router = express.Router();

// GET /api/coins
router.get("/coins", async (req, res) => {
  try {
    const response = await fetch(
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1"
    );
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Failed to fetch data from CoinGecko:", error);
    res.status(500).json({ error: "Failed to fetch coins" });
  }
});

async function fetchLiveData() {
  const res = await fetch(
    "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1"
  );
  if (!res.ok) throw new Error("Failed to fetch data from CoinGecko");
  return await res.json();
}

// Shared function for cron job & manual sync
export async function syncCoins() {
  try {
    const data = await fetchLiveData();
    const timestamp = new Date();

    const formattedData = data.map((coin) => ({
      coinId: coin.id,
      name: coin.name,
      symbol: coin.symbol,
      price: coin.current_price,
      marketCap: coin.market_cap,
      change24h: coin.price_change_percentage_24h,
      timestamp,
    }));

    // Overwrite current Coin data
    await Coin.deleteMany({});
    await Coin.insertMany(formattedData);

    // Append to History
    await History.insertMany(formattedData);

    console.log("Coins synced and history updated");
  } catch (error) {
    console.error("syncCoins error:", error.message);
  }
}
router.post("/history", async (req, res) => {
  try {
    await syncCoins();
    res.json({ success: true, message: "Manual sync completed" });
  } catch (err) {
    console.error("Error in manual sync:", err);
    res.status(500).json({ error: "Failed to sync coin data" });
  }
});

// 🔹 GET /api/history/:coinId — Get coin's history
router.get("/history/:coinId", async (req, res) => {
  try {
    const coinId = req.params.coinId;
    const history = await History.find({ coinId }).sort({ timestamp: 1 });
    res.json(history);
  } catch (err) {
    console.error("Error fetching history:", err);
    res.status(500).json({ error: "Failed to fetch history" });
  }
});

export default router;
