import mongoose from "mongoose";

const HistorySchema = new mongoose.Schema({
  coinId: String,
  name: String,
  symbol: String,
  price: Number,
  marketCap: Number,
  change24h: Number,
  timestamp: Date,
});

export default mongoose.models.History ||
  mongoose.model("History", HistorySchema);
