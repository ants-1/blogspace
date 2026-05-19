import app from "./app";
import dotenv from "dotenv";
import { connectDB } from "./config/db";
import { connectRedis } from "./config/redis";

dotenv.config();

const PORT = process.env.PORT || 3000;

connectDB();
connectRedis();

app.listen(PORT, () => {
  console.log(`Server running on https://localhost:${PORT}`);
})