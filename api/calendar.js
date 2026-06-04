export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (!["GET", "POST", "DELETE"].includes(req.method)) return res.status(405).json({ error: "Método não permitido" });

  const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REFRESH_TOKEN } = process.env;
  const isConfigured = Boolean(GOOGLE_CLIENT_ID && GOOGLE_CLIENT_SECRET && GOOGLE_REFRESH_TOKEN);

  if (req.method === "GET") {
    return res.status(200).json({ configured: isConfigured });
  }

  if (!isConfigured) {
    return res.status(503).json({ error: "Integração com Google Calendar não configurada", code: "CALENDAR_NOT_CONFIGURED" });
  }

  async function getAccessToken() {
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
      const googleError = tokenData.error_description || tokenData.error || "Token inválido";
      console.error("[calendar] Token exchange failed:", JSON.stringify(tokenData));
      const err = new Error(`Falha na autenticação Google: ${googleError}`);
      err.googleError = tokenData.error;
      err.googleErrorDescription = tokenData.error_description;
      throw err;
    }
    return tokenData.access_token;
  }

  if (req.method === "DELETE") {
    let body = req.body;
    if (Buffer.isBuffer(body)) body = body.toString("utf8");
    if (typeof body === "string") {
      try { body = JSON.parse(body); } catch { body = {}; }
    }
    const eventId = body?.eventId;
    if (!eventId) return res.status(400).json({ error: "eventId é obrigatório" });

    try {
      const accessToken = await getAccessToken();
      const delRes = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventId}`,
        { method: "DELETE", headers: { Authorization: `Bearer ${accessToken}` } }
      );
      if (delRes.status === 204 || delRes.status === 200) {
        return res.status(200).json({ deleted: true });
      }
      let delData = {};
      try { delData = await delRes.json(); } catch {}
      return res.status(delRes.status).json(delData);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  // POST — criar evento
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
    const accessToken = await getAccessToken();
    const calRes = await fetch("https://www.googleapis.com/calendar/v3/calendars/primary/events", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(eventPayload),
    });
    const calData = await calRes.json();
    return res.status(calRes.status).json(calData);
  } catch (err) {
    if (err.googleError) {
      return res.status(401).json({
        error: err.message,
        googleError: err.googleError,
        googleErrorDescription: err.googleErrorDescription,
      });
    }
    return res.status(500).json({ error: err.message });
  }
}
