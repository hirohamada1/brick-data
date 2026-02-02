import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LEADS_PATH = path.join(__dirname, "..", "data", "leads.json");

function ensureDataDir() {
  const dir = path.dirname(LEADS_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function readLeads() {
  ensureDataDir();
  if (!fs.existsSync(LEADS_PATH)) return [];
  try {
    const raw = fs.readFileSync(LEADS_PATH, "utf-8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function writeLeads(leads) {
  ensureDataDir();
  fs.writeFileSync(LEADS_PATH, JSON.stringify(leads, null, 2), "utf-8");
}

function sendJson(res, status, data) {
  res.setHeader("Content-Type", "application/json");
  res.status(status).end(JSON.stringify(data));
}

const app = express();
app.use(express.json());

app.get("/api/health", (_, res) => {
  sendJson(res, 200, { ok: true });
});

app.post("/api/lead", (req, res) => {
  try {
    const body = req.body || {};
    const { name, email, zweck, region } = body;
    if (!name || !email || !zweck) {
      return sendJson(res, 400, { error: "name, email und zweck sind erforderlich" });
    }
    const lead = {
      name: String(name).trim(),
      email: String(email).trim(),
      zweck: String(zweck).trim(),
      region: region ? String(region).trim() : undefined,
      createdAt: new Date().toISOString(),
    };
    const leads = readLeads();
    leads.push(lead);
    writeLeads(leads);
    console.log("[lead]", lead);
    sendJson(res, 201, { ok: true });
  } catch (e) {
    console.error("[lead] error", e);
    sendJson(res, 500, { error: "Interner Fehler" });
  }
});

const PORT = Number(process.env.LEAD_API_PORT) || 3001;
app.listen(PORT, () => {
  console.log(`Lead API listening on http://localhost:${PORT}`);
}).on("error", (e) => {
  if (e.code === "EADDRINUSE") {
    console.error(`Port ${PORT} ist belegt. Bitte anderen Prozess beenden oder LEAD_API_PORT setzen.`);
  }
  process.exit(1);
});
