export default async function handler(req, res) {
  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    const { agentId } = body;
    if (!agentId) return res.status(400).json({ error: 'agentId fehlt' });

    const r = await fetch('https://api.retellai.com/v2/create-web-call', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RETELL_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ agent_id: agentId })
    });

    const data = await r.json().catch(() => ({}));
    if (!r.ok) return res.status(r.status).json(data);

    // v2: access_token, v1: client_secret – wir geben beides zurück-kompatibel weiter
    const token = data.access_token || data.client_secret;
    if (!token) return res.status(502).json({ error: 'Kein Token von Retell erhalten' });

    return res.status(200).json({ token });
  } catch (e) {
    return res.status(500).json({ error: String(e) });
  }
}
