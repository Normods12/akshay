const fs = require('fs');
const file = 'server/server.js';
let content = fs.readFileSync(file, 'utf8');

const replacement = `const { calculateKundali, calculateMatch } = require('./src/kundliEngine');`;
content = content.replace(/const { calculateKundali } = require\('\.\/src\/kundliEngine'\);/, replacement);

const endpoint = `
// ─── Matchmaking ──────────────────────────────────────────────────────────────
app.post('/api/match', async (req, res) => {
  try {
    const { boy, girl } = req.body;
    
    // Convert local birth times to UTC
    const b = localToUTC(boy.dateOfBirth, boy.timeOfBirth, boy.latitude, boy.longitude);
    const g = localToUTC(girl.dateOfBirth, girl.timeOfBirth, girl.latitude, girl.longitude);
    
    const result = calculateMatch(
      b.utcDate, boy.latitude, boy.longitude,
      g.utcDate, girl.latitude, girl.longitude
    );
    
    res.json({
      success: true,
      data: {
        boy: {
          name: boy.name,
          dateOfBirth: boy.dateOfBirth,
          timeOfBirth: boy.timeOfBirth,
          birthPlace: boy.birthPlace,
          ...result.boy
        },
        girl: {
          name: girl.name,
          dateOfBirth: girl.dateOfBirth,
          timeOfBirth: girl.timeOfBirth,
          birthPlace: girl.birthPlace,
          ...result.girl
        },
        ashtakoot: result.ashtakoot,
        manglikMatch: result.manglikMatch,
        rajjooDosha: result.rajjooDosha,
        vedhaDosha: result.vedhaDosha
      }
    });
  } catch (err) {
    console.error('Matchmaking error:', err.message);
    res.status(500).json({ error: err.message || 'Calculation failed' });
  }
});
`;

if (!content.includes('/api/match')) {
  content = content.replace('// ─── Start Server', endpoint + '\n// ─── Start Server');
}

fs.writeFileSync(file, content);
console.log('Added /api/match endpoint to server.js');
