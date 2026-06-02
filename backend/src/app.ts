import express from "express";
import authRoutes from "./modules/auth/auth.routes";
import cookieParser from "cookie-parser";

const app = express();

// Global middleware
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/auth", authRoutes);

export default app;