export default async function handler(req, res) {
  const k = process.env.RETELL_API_KEY || '';
  return res.status(200).json({
    hasKey: !!k,
    keyPrefix: k ? k.slice(0, 4) : null,
    env: process.env.VERCEL_ENV || process.env.NODE_ENV || 'unknown'
  });
}
