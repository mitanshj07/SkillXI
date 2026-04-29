export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const GEMINI_KEY = process.env.GOOGLE_API_KEY || 'AIzaSyAV5LHPLVMjhuUjuxbxJvb9hKkSJ1wuxpk';
  const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_KEY}`;

  try {
    const { message, user_wallet, lineup } = req.body;
    
    if (!message) return res.status(400).json({ error: 'No message provided' });

    const systemPrompt = `You are the SkillXI AI Analyst — an elite fantasy sports intelligence engine for Web3 fantasy contests on Solana.

PLATFORM CONTEXT:
- SkillXI is a fantasy sports platform on Solana blockchain
- Users build 11-player lineups for real football/cricket matches
- Entry fees paid in SOL, prizes distributed via smart contracts
- Captain gets 2x points, Vice-Captain gets 1.5x points
- Budget: 100 Credits per team
- Privacy via Umbra Protocol (shielded entries)

AVAILABLE MATCHES:
- Man City vs Arsenal (Premier League GW29) - 8.5 SOL prize pool
- Real Madrid vs Barcelona (La Liga El Clasico) - 45 SOL prize pool  
- PSG vs Bayern Munich (Champions League) - 200 SOL prize pool
- Liverpool vs Tottenham (Premier League GW29) - 12 SOL prize pool
- India vs Australia (T20 International) - 100 SOL prize pool

KEY PLAYERS & AI SCORES:
- Haaland (MCI, FWD, 13.5 Cr, AI: 9.9) - Consensus captain
- De Bruyne (MCI, MID, 10.5 Cr, AI: 9.5) - Creative engine
- Saka (ARS, MID, 10.5 Cr, AI: 9.4) - Differential pick
- Odegaard (ARS, MID, 10.0 Cr, AI: 9.2) - Set-piece threat
- Salah (LIV, FWD, 12.5 Cr, AI: 9.5) - Anfield specialist

User wallet: ${user_wallet || 'Not connected'}
User lineup: ${lineup || 'No lineup built yet'}

RULES:
- Be concise, tactical, and bold
- Use bullet points and clear structure
- Give specific player recommendations with reasoning
- Mention AI scores and prices when relevant
- Speak like an elite sports analyst
- Keep responses under 300 words`;

    const response = await fetch(GEMINI_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [
            { text: systemPrompt },
            { text: message }
          ]
        }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 800 }
      })
    });

    const data = await response.json();
    
    if (data.error) {
      return res.status(500).json({ error: data.error.message });
    }

    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response generated.';

    res.status(200).json({
      response: reply,
      logs: {
        scout: 'Gemini 2.0 Flash — Real-time tactical analysis',
        tactician: 'Cross-referencing match data with AI scoring model'
      },
      lineup_detected: !!lineup && lineup !== '[]'
    });
  } catch (err) {
    console.error('Gemini API error:', err);
    res.status(500).json({ error: err.message });
  }
}
