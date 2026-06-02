import express from "express";
import authRoutes from "./modules/auth/auth.routes";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";

const app = express();

// Global middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
);
app.use(helmet());
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/auth", authRoutes);

export default app;
