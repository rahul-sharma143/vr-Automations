import mongoose from "mongoose";

const CoinSchema = new mongoose.Schema({
  coinId: String,
  name: String,
  symbol: String,
  price: Number,
  marketCap: Number,
  change24h: Number,
  timestamp: Date,
});

export default mongoose.models.Coin || mongoose.model("Coin", CoinSchema);
