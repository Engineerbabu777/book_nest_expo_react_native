import express from "express";
import "dotenv/config";
import authRoutes from "./routes/authRoutes.js";
import { connectDB } from "./config/database.js";
const app = express();

app.use(express.json());

app.use("/api/auth", authRoutes);
app.listen(3000, () => {
  console.log("Server is running");
  connectDB;
});
