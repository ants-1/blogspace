import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import authRoutes from "./modules/auth/auth.routes";
import userRoutes from "./modules/users/user.routes";
import postRoutes from "./modules/posts/post.routes";
import commentRoutes from "./modules/comments/comment.routes";
import reactionRoutes from "./modules/reaction/reaction.routes";
import { errorHandler } from "./middleware/error.middleware";

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
app.use("/users", userRoutes);
app.use("/posts", postRoutes);
app.use("/posts/:postId/comments", commentRoutes);
app.use("/posts/:postId", reactionRoutes);

// Global error handler
app.use(errorHandler);

export default app;
