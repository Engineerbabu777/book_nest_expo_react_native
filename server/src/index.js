import express from "express";
import "dotenv/config";
import authRoutes from "./routes/authRoutes.js";
import bookRoutes from "./routes/bookRoutes.js";
import cors from 'cors'
import { connectDB } from "./config/database.js";
const app = express();

app.use(express.json());
app.use(cors())

app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);

app.listen(3000, () => {
  console.log("Server is running");
  connectDB();
});
