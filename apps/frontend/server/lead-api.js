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

const listings = [
  {
    id: "l1",
    source: "immoscout",
    external_id: "10001",
    title: "Moderne 3-Zimmer Wohnung mit Balkon",
    price_eur: 485000,
    living_space_sqm: 78,
    rooms: 3,
    postcode: "80331",
    city: "Muenchen",
    quarter: null,
    url: "https://example.com/listing/l1",
  },
  {
    id: "l2",
    source: "immowelt",
    external_id: "10002",
    title: "Einfamilienhaus mit Garten",
    price_eur: 620000,
    living_space_sqm: 145,
    rooms: 5,
    postcode: "20149",
    city: "Hamburg",
    quarter: null,
    url: "https://example.com/listing/l2",
  },
  {
    id: "l3",
    source: "kleinanzeigen",
    external_id: "10003",
    title: "2-Zimmer Altbau mit Stuck",
    price_eur: 320000,
    living_space_sqm: 52,
    rooms: 2,
    postcode: "10117",
    city: "Berlin",
    quarter: null,
    url: "https://example.com/listing/l3",
  },
];

const manualInputsByListing = new Map();

function normalizeNumber(value) {
  if (value === null || value === undefined || value === "") return null;
  const n = Number(value);
  if (Number.isNaN(n)) return null;
  return n;
}

function normalizeBoolean(value, defaultValue = true) {
  if (value === null || value === undefined) return defaultValue;
  if (typeof value === "boolean") return value;
  if (value === "true") return true;
  if (value === "false") return false;
  return defaultValue;
}

app.get("/api/health", (_, res) => {
  sendJson(res, 200, { ok: true });
});

app.get("/api/listings", (_, res) => {
  const payload = listings.map((listing) => ({
    ...listing,
    has_manual_inputs: manualInputsByListing.has(listing.id),
  }));
  sendJson(res, 200, payload);
});

app.get("/api/listings/:id/manual-inputs", (req, res) => {
  const { id } = req.params;
  if (!listings.some((listing) => listing.id === id)) {
    return sendJson(res, 404, { error: "Listing nicht gefunden." });
  }
  const existing = manualInputsByListing.get(id) || null;
  sendJson(res, 200, existing);
});

app.put("/api/listings/:id/manual-inputs", (req, res) => {
  const { id } = req.params;
  if (!listings.some((listing) => listing.id === id)) {
    return sendJson(res, 404, { error: "Listing nicht gefunden." });
  }

  const body = req.body || {};
  const vacancyRate = normalizeNumber(body.vacancy_rate);
  if (vacancyRate !== null && (vacancyRate < 0 || vacancyRate > 1)) {
    return sendJson(res, 400, { error: "vacancy_rate muss zwischen 0 und 1 liegen." });
  }

  const payload = {
    listing_id: id,
    hausgeld_umlagefaehig_monthly_eur: normalizeNumber(
      body.hausgeld_umlagefaehig_monthly_eur
    ),
    hausgeld_nicht_umlagefaehig_monthly_eur: normalizeNumber(
      body.hausgeld_nicht_umlagefaehig_monthly_eur
    ),
    expected_rent_cold_monthly_eur: normalizeNumber(body.expected_rent_cold_monthly_eur),
    vacancy_rate: vacancyRate,
    maintenance_reserve_monthly_eur: normalizeNumber(body.maintenance_reserve_monthly_eur),
    is_estimated: normalizeBoolean(body.is_estimated, true),
  };

  manualInputsByListing.set(id, payload);
  sendJson(res, 200, payload);
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
