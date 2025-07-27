import cron from "node-cron";
import { syncCoins } from "./routes/api.js"; 

export const startCronJob = () => {
  cron.schedule("0 * * * *", async () => {
    console.log("⏰ Running hourly sync...");
    await syncCoins();
  });

  console.log("🕒 Cron job scheduled to run every hour");
};
