export default async function handler(req, res) {
  try {
    const { agentId } = req.body || {};
    if (!agentId) return res.status(400).json({ error: "agentId fehlt" });

    const r = await fetch("https://api.retellai.com/v2/create-web-call", {
      method: "POST",
      headers: {
        Authorization: process.env.RETELL_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ agent_id: agentId }),
    });

    const data = await r.json();
    if (!r.ok) return res.status(r.status).json(data);

    res.status(200).json({ token: data.client_secret });
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
}
