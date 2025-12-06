import express from "express";
import cors from "cors";
import taskRoutes from "./routes/task.routes.js";
 import dotenv from "dotenv";
const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/tasks", taskRoutes);

export default app;
