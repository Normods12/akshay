const fs = require('fs');
const file = 'server/server.js';
let content = fs.readFileSync(file, 'utf8');

const endpoint = `
// ─── Daily Panchang ───────────────────────────────────────────────────────────
app.get('/api/panchang/today', async (req, res) => {
  try {
    const lat = parseFloat(req.query.lat) || 28.6139; // New Delhi
    const lon = parseFloat(req.query.lon) || 77.2090;

    // Get current date/time in India (IST)
    const nowIST = new Date(new Date().toLocaleString("en-US", {timeZone: "Asia/Kolkata"}));
    
    // Create UTC date that matches exactly the current moment
    const b = localToUTC(
      nowIST.toISOString().split('T')[0],
      nowIST.toTimeString().split(' ')[0].substring(0,5),
      lat, lon
    );

    const result = calculateKundali(b.utcDate, lat, lon);
    
    res.json({
      success: true,
      data: {
        date: nowIST.toISOString().split('T')[0],
        time: nowIST.toTimeString().split(' ')[0].substring(0,5),
        location: { latitude: lat, longitude: lon },
        panchang: result.panchang,
        moonSign: result.moonSign,
        nakshatra: result.nakshatra
      }
    });
  } catch (err) {
    console.error('Panchang error:', err.message);
    res.status(500).json({ error: err.message || 'Calculation failed' });
  }
});
`;

if (!content.includes('/api/panchang/today')) {
  content = content.replace('// ─── Start Server', endpoint + '\n// ─── Start Server');
  fs.writeFileSync(file, content);
  console.log('Added /api/panchang/today endpoint to server.js');
} else {
  console.log('Endpoint already exists');
}
