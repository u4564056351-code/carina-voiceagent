async function createWebCallV2(agentId, apiKey) {
  const r = await fetch('https://api.retell.ai/v2/create-web-call', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ agent_id: agentId })
  });
  const data = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(`v2 ${r.status}: ${JSON.stringify(data)}`);
  return data.access_token;
}

async function createWebCallV1(agentId, apiKey) {
  const r = await fetch('https://api.retell.ai/v1/web_calls', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ agent_id: agentId })
  });
  const data = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(`v1 ${r.status}: ${JSON.stringify(data)}`);
  return data.client_secret;
}

export default async function handler(req, res) {
  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    const { agentId } = body;
    if (!agentId) return res.status(400).json({ error: 'agentId fehlt' });

    const apiKey = process.env.RETELL_API_KEY;
    if (!apiKey) return res.status(500).json({ error: 'RETELL_API_KEY fehlt auf dem Server' });

    let token;
    try {
      token = await createWebCallV2(agentId, apiKey);
    } catch (e1) {
      token = await createWebCallV1(agentId, apiKey);
    }
    if (!token) return res.status(502).json({ error: 'Kein Token von Retell erhalten' });

    return res.status(200).json({ token });
  } catch (e) {
    return res.status(500).json({ error: String(e) });
  }
}
