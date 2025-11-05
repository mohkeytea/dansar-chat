import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import whatsappRoutes from "./routes/whatsapp.js";

dotenv.config();

const app = express();
app.use(bodyParser.json());

// Static file setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.use("/api/whatsapp", whatsappRoutes);

// Default route → serve dashboard.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "dashboard.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Dansar Chat server running on port ${PORT}`));
