import { NextResponse } from "next/server"

function json(data: unknown, status = 200) {
  return NextResponse.json(data, {
    status,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  })
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  })
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}))
    const { name, email, zweck, region } = body ?? {}
    if (!name || !email || !zweck) {
      return json({ error: "name, email und zweck sind erforderlich" }, 400)
    }

    const lead = {
      name: String(name).trim(),
      email: String(email).trim(),
      zweck: String(zweck).trim(),
      region: region ? String(region).trim() : undefined,
      createdAt: new Date().toISOString(),
    }

    console.log("[lead]", JSON.stringify(lead))
    return json({ ok: true }, 201)
  } catch (error) {
    console.error("[lead] error", error)
    return json({ error: "Interner Fehler" }, 500)
  }
}
