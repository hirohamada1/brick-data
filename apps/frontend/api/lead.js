/**
 * Vercel serverless: POST /api/lead – speichert Lead nur in-memory (MVP).
 * Keine externe DB; Log für Debug.
 * Hinweis: Vercel-Response hat kein .json(), daher manuell JSON senden.
 */
function allowCors(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

function sendJson(res, status, data) {
  res.setHeader("Content-Type", "application/json");
  res.status(status).end(JSON.stringify(data));
}

export default function handler(req, res) {
  allowCors(res);
  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).end();
  }

  try {
    let body = req.body;
    if (body === undefined || body === null) body = {};
    if (typeof body === "string") {
      try {
        body = body ? JSON.parse(body) : {};
      } catch {
        body = {};
      }
    }
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
    console.log("[lead]", JSON.stringify(lead));
    sendJson(res, 201, { ok: true });
  } catch (e) {
    console.error("[lead] error", e);
    sendJson(res, 500, { error: "Interner Fehler" });
  }
}
