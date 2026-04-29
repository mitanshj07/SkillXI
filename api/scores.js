export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const API_KEY = process.env.FOOTBALL_API_KEY || 'ebf76d464844eacdbe8a101bf8ee9106';
  
  try {
    const { league, next, live } = req.query;
    
    let url = 'https://v3.football.api-sports.io/fixtures';
    const params = new URLSearchParams();
    
    if (live === 'true' || live === 'all') {
      params.set('live', 'all');
    } else if (next) {
      params.set('league', league || '39'); // Default: Premier League
      params.set('season', '2025');
      params.set('next', next);
    } else {
      // Default: today's fixtures
      const today = new Date().toISOString().split('T')[0];
      params.set('date', today);
    }

    const response = await fetch(`${url}?${params.toString()}`, {
      headers: { 'x-apisports-key': API_KEY }
    });

    const data = await response.json();
    res.status(200).json(data.response || []);
  } catch (err) {
    console.error('Scores API error:', err);
    res.status(500).json({ error: err.message });
  }
}
