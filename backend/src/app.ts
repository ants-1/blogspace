import express from "express";
import authRoutes from "./modules/auth/auth.routes";

const app = express();

app.use(express.json());

// Routes
app.use("/auth", authRoutes);

export default app;