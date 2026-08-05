/* global process */

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDatabase } from "./config/database.js";
import authRoutes from "./routes/authRoutes.js";
import bookRoutes from "./routes/bookRoutes.js";
import loanRoutes from "./routes/loanRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/loans", loanRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "API de BookNest funcionando correctamente",
  });
});

const PORT = process.env.PORT || 3000;

connectDatabase();

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});