export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (!["GET", "POST"].includes(req.method)) return res.status(405).json({ error: "Método não permitido" });

  const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REFRESH_TOKEN } = process.env;
  const isConfigured = Boolean(GOOGLE_CLIENT_ID && GOOGLE_CLIENT_SECRET && GOOGLE_REFRESH_TOKEN);

  if (req.method === "GET") {
    return res.status(200).json({ configured: isConfigured });
  }

  if (!isConfigured) {
    return res.status(503).json({ error: "Integração com Google Calendar não configurada", code: "CALENDAR_NOT_CONFIGURED" });
  }

  let eventPayload = req.body;
  if (Buffer.isBuffer(eventPayload)) eventPayload = eventPayload.toString("utf8");

  if (typeof eventPayload === "string") {
    try {
      eventPayload = JSON.parse(eventPayload);
    } catch {
      return res.status(400).json({ error: "Corpo da requisição inválido" });
    }
  }

  if (!eventPayload || typeof eventPayload !== "object" || Array.isArray(eventPayload)) {
    return res.status(400).json({ error: "Evento inválido" });
  }

  try {
    // Obter access token usando o refresh token
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        refresh_token: GOOGLE_REFRESH_TOKEN,
        grant_type: "refresh_token",
      }),
    });

    const tokenData = await tokenRes.json();

    if (!tokenData.access_token) {
      return res.status(401).json({ error: "Falha ao obter token: " + (tokenData.error_description || tokenData.error) });
    }

    // Criar evento no Google Calendar
    const calRes = await fetch("https://www.googleapis.com/calendar/v3/calendars/primary/events", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(eventPayload),
    });

    const calData = await calRes.json();
    return res.status(calRes.status).json(calData);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
