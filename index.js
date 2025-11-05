import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import whatsappRoutes from "./routes/whatsapp.js";

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));
app.use("/api/whatsapp", whatsappRoutes);

// Health check
app.get("/health", (req, res) => res.json({ status: "ok" }));

// Serve dashboard (for you)
app.get("/dashboard", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "dashboard.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Dansar Chat running on port ${PORT}`));
