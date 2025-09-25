import express from "express";
import cors from "cors";
import holidaysFromApi from "./Routes/holidaysFromApi.js";

const app = express();

// Parse JSON bodies
app.use(express.json());

// Enable CORS
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "*", // fallback to * if not set
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// Routes
app.use("/api/fetchFrom", holidaysFromApi);

export default app;
