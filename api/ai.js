export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { prompt = '', context = 'SkillXI football fantasy contest' } = req.body || {};
  const apiKey = process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY;
  if (!apiKey) return res.status(200).json({ text: fallbackReply(prompt), provider: 'fallback' });
  try {
    if (process.env.GEMINI_API_KEY) {
      const model = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ contents: [{ parts: [{ text: buildPrompt(prompt, context) }] }] }) });
      const data = await response.json();
      return res.status(200).json({ text: data?.candidates?.[0]?.content?.parts?.[0]?.text || fallbackReply(prompt), provider: 'gemini' });
    }
    const response = await fetch('https://api.openai.com/v1/chat/completions', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.OPENAI_API_KEY}` }, body: JSON.stringify({ model: process.env.OPENAI_MODEL || 'gpt-4o-mini', messages: [{ role: 'system', content: context }, { role: 'user', content: prompt }] }) });
    const data = await response.json();
    return res.status(200).json({ text: data?.choices?.[0]?.message?.content || fallbackReply(prompt), provider: 'openai' });
  } catch (error) { return res.status(200).json({ text: fallbackReply(prompt), provider: 'fallback', warning: error.message }); }
}
function buildPrompt(prompt, context) { return `You are SkillXI's football fantasy analyst. Use concise actionable advice. Context: ${context}. User: ${prompt}`; }
function fallbackReply(prompt) { const q = String(prompt).toLowerCase(); if (q.includes('captain')) return 'Captain Haaland for safety. Use De Bruyne as a leverage captain in larger contests.'; if (q.includes('differential')) return 'Ben White, Declan Rice, and Josko Gvardiol are the best lower-owned pivots.'; return 'Build around Haaland, Saka, De Bruyne, Odegaard, and one defensive value pick. Keep budget under 100 credits.'; }
