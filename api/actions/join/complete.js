function cors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept-Encoding');
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-store');
}

export default async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: { message: 'Method not allowed' } });
  const contest = String(req.query.contest || 'contest');
  const signature = String(req.body?.signature || '');
  return res.status(200).json({
    type: 'completed',
    title: 'SkillXI proof recorded',
    icon: `https://${req.headers.host || 'skill-xi-two.vercel.app'}/assets/skillxi-blink.svg`,
    label: 'Proof created',
    description: signature
      ? `Your SkillXI proof receipt for ${contest} was submitted: ${signature.slice(0, 8)}...${signature.slice(-8)}`
      : `Your SkillXI proof receipt for ${contest} was submitted.`
  });
}
