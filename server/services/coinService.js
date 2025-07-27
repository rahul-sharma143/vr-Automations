import fetch from "node-fetch";

export async function syncCoins() {
  const response = await fetch(
    "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd"
  );
  const data = await response.json();

  console.log("Synced coins:", data.length);
}
