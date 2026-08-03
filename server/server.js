/**
 * server.js
 * Express API server for Swiss Ephemeris based Vedic Kundali calculation.
 * Runs on port 3001. Vite dev server proxies /api/* to this server.
 *
 * POST /api/kundali
 *   Body: { name, dateOfBirth, timeOfBirth, latitude, longitude, birthPlace }
 *   Returns: Full kundali JSON (planets, houses, navamsa, dasha, doshas)
 *
 * GET /api/health
 *   Returns: { status: "ok", engine: "Swiss Ephemeris" }
 */

const express = require('express');
const cors = require('cors');
const { calculateKundali, calculateMatch } = require('./src/kundliEngine');
const { localToUTC } = require('./src/timezone');

const app = express();
const PORT = process.env.PORT || 3001;

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:4173'] }));
app.use(express.json());

// Request logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    engine: 'Swiss Ephemeris (swisseph)',
    ayanamsha: 'Lahiri (Chitrapaksha)',
    houseSystem: 'Whole Sign (Vedic)',
    version: '1.0.0',
  });
});

// ─── Kundali Calculation ──────────────────────────────────────────────────────
app.post('/api/kundali', async (req, res) => {
  try {
    const { name, dateOfBirth, timeOfBirth, latitude, longitude, birthPlace } = req.body;

    // Validate required fields
    const missing = [];
    if (!name) missing.push('name');
    if (!dateOfBirth) missing.push('dateOfBirth');
    if (!timeOfBirth) missing.push('timeOfBirth');
    if (latitude === undefined || latitude === null) missing.push('latitude');
    if (longitude === undefined || longitude === null) missing.push('longitude');

    if (missing.length > 0) {
      return res.status(400).json({ error: `Missing required fields: ${missing.join(', ')}` });
    }

    // Validate date/time format
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateOfBirth)) {
      return res.status(400).json({ error: 'dateOfBirth must be in YYYY-MM-DD format' });
    }
    if (!/^\d{2}:\d{2}$/.test(timeOfBirth)) {
      return res.status(400).json({ error: 'timeOfBirth must be in HH:MM format' });
    }

    // Step 1: Convert local birth time → UTC (using geo-tz + luxon)
    const { utcDate, timezone, utcOffset, utcOffsetFormatted } = localToUTC(
      dateOfBirth, timeOfBirth, parseFloat(latitude), parseFloat(longitude)
    );

    console.log(`  Name: ${name}`);
    console.log(`  Birth: ${dateOfBirth} ${timeOfBirth} (${timezone} / UTC${utcOffsetFormatted})`);
    console.log(`  UTC:   ${utcDate.toISOString()}`);
    console.log(`  Coords: ${latitude}°N, ${longitude}°E`);

    // Step 2: Run Swiss Ephemeris calculations
    const kundali = calculateKundali(utcDate, parseFloat(latitude), parseFloat(longitude));

    // Step 3: Return full result
    res.json({
      success: true,
      data: {
        // Personal info
        name,
        birthPlace: birthPlace || `${latitude}, ${longitude}`,
        dateOfBirth,
        timeOfBirth,
        location: { latitude: parseFloat(latitude), longitude: parseFloat(longitude) },

        // Timezone info
        timezone,
        utcOffset: utcOffsetFormatted,
        utcDateTime: utcDate.toISOString(),

        // Kundali calculations
        ...kundali,
      },
    });

  } catch (err) {
    console.error('Kundali calculation error:', err.message);
    res.status(500).json({ error: err.message || 'Calculation failed' });
  }
});


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

// ─── Start Server ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log('');
  console.log('╔══════════════════════════════════════════════════════╗');
  console.log('║     Vedic Kundali API Server (Swiss Ephemeris)       ║');
  console.log(`║     Running at http://localhost:${PORT}                  ║`);
  console.log('║     Engine: Swiss Ephemeris C Library (swisseph)     ║');
  console.log('║     Ayanamsha: Lahiri (Chitrapaksha)                 ║');
  console.log('║     House System: Whole Sign (Vedic)                 ║');
  console.log('╚══════════════════════════════════════════════════════╝');
  console.log('');
});
