import crypto from 'node:crypto';

const TTL_MS = 8 * 60 * 60 * 1000;

function secret() {
  return process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || '';
}

function sign(payload) {
  return crypto.createHmac('sha256', secret()).update(payload).digest('hex');
}

function makeToken() {
  const payload = JSON.stringify({ role: 'admin', exp: Date.now() + TTL_MS });
  const encoded = Buffer.from(payload).toString('base64url');
  return `${encoded}.${sign(encoded)}`;
}

function verifyToken(token = '') {
  try {
    if (!secret() || !token.includes('.')) return false;
    const [encoded, sig] = token.split('.');
    const expected = sign(encoded);
    if (sig.length !== expected.length) return false;
    if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return false;
    const payload = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8'));
    return payload.role === 'admin' && payload.exp > Date.now();
  } catch {
    return false;
  }
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  const configured = Boolean(process.env.ADMIN_PASSWORD && secret());
  if (!configured) return res.status(503).json({ ok: false, configured: false, error: 'Set ADMIN_PASSWORD and ADMIN_SESSION_SECRET in Vercel.' });

  if (req.method === 'GET') {
    const auth = String(req.headers.authorization || '').replace(/^Bearer\s+/i, '');
    return res.status(200).json({ ok: verifyToken(auth), configured: true });
  }

  if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'Method not allowed' });
  const password = String(req.body?.password || '');
  const expected = String(process.env.ADMIN_PASSWORD || '');
  const bufPassword = Buffer.from(password);
  const bufExpected = Buffer.from(expected);
  const valid = bufPassword.length === bufExpected.length && crypto.timingSafeEqual(bufPassword, bufExpected);
  if (!valid) return res.status(401).json({ ok: false, error: 'Invalid admin password' });

  return res.status(200).json({ ok: true, token: makeToken() });
}
