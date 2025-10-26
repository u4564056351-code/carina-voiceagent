export default async function handler(req, res) {
  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    const { agentId } = body;
    if (!agentId) return res.status(400).json({ error: 'agentId fehlt' });

    // Retell: Web-Call erstellen -> liefert Token für das Web SDK
    const r = await fetch('https://api.retell.ai/v1/web_calls', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RETELL_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ agent_id: agentId })
    });

    const data = await r.json();
    if (!r.ok) {
      // Fehler transparent hochreichen (hilft beim Debuggen)
      return res.status(r.status).json(data);
    }

    // Abhängig von API-Version: client_secret ODER access_token
    const token = data.client_secret || data.access_token;
    if (!token) return res.status(500).json({ error: 'Kein Token von Retell erhalten' });

    return res.status(200).json({ token });
  } catch (e) {
    return res.status(500).json({ error: String(e) });
  }
}
