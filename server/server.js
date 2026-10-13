/**
 * server.js — Mannjyotish API Server
 * Express + Swiss Ephemeris + Google OAuth + JWT + Admin CRUD
 * Port 3001. Vite dev server proxies /api/* to this server.
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const multer = require('multer');

const { Resend } = require('resend');
const { google } = require('googleapis');

const { calculateKundali, calculateMatch } = require('./src/kundliEngine');
const { localToUTC } = require('./src/timezone');
const { readData, writeData } = require('./src/dataStore');
const { verifyToken, requireAdmin, JWT_SECRET } = require('./src/authMiddleware');
const { sendWhatsApp } = require('./src/whatsapp');

const app = express();
const PORT = process.env.PORT || 3001;

// ─── Config ──────────────────────────────────────────────────────────────────
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const ADMIN_EMAILS = (process.env.ADMIN_EMAIL || 'mannjyotishashay@gmail.com,smaddirala23@gmail.com,smaddirala90@gmail.com')
  .split(',')
  .map(e => e.trim().toLowerCase());
const ADMIN_EMAIL = ADMIN_EMAILS[0] || 'mannjyotishashay@gmail.com';
const FRONTEND_URL = process.env.FRONTEND_URL || 'https://mannjyotish.com';
const GOOGLE_CALLBACK_URL = process.env.GOOGLE_CALLBACK_URL || `${FRONTEND_URL}/api/auth/google/callback`;

const getFrontendUrl = (req) => {
  if (process.env.FRONTEND_URL) return process.env.FRONTEND_URL.replace(/\/$/, '');
  if (req) {
    const proto = req.headers['x-forwarded-proto'] || req.protocol || 'https';
    const host = req.headers['x-forwarded-host'] || req.headers?.host;
    if (host && !host.includes('localhost')) {
      return `${proto}://${host}`;
    }
  }
  return 'https://mannjyotish.com';
};
const RESEND_API_KEY = process.env.RESEND_API_KEY || 're_dummy_key_for_development';
const GCAL_REFRESH_TOKEN = process.env.GCAL_REFRESH_TOKEN;

const resend = new Resend(RESEND_API_KEY);

// ─── Google Calendar API Client (lazy init — avoids startup block) ────────────
let _gcal = null;
function getGcal() {
  if (!_gcal) {
    const gcalAuth = new google.auth.OAuth2(
      GOOGLE_CLIENT_ID,
      GOOGLE_CLIENT_SECRET,
      'http://localhost:4000/oauth2callback'
    );
    if (GCAL_REFRESH_TOKEN) gcalAuth.setCredentials({ refresh_token: GCAL_REFRESH_TOKEN });
    _gcal = google.calendar({ version: 'v3', auth: gcalAuth });
  }
  return _gcal;
}


/**
 * insertGoogleCalendarEvent — Directly creates event on Ashay's Google Calendar
 * and sends a native Google Calendar invite to the client. Zero clicks required.
 */
async function insertGoogleCalendarEvent({ title, description, location, date, timeSlot, clientName, clientEmail }) {
  const eventDate = date ? new Date(date) : new Date();
  let hours = 10, minutes = 0;

  if (timeSlot) {
    const match = timeSlot.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
    if (match) {
      hours = parseInt(match[1], 10);
      minutes = parseInt(match[2], 10);
      const ampm = match[3] ? match[3].toUpperCase() : null;
      if (ampm === 'PM' && hours < 12) hours += 12;
      if (ampm === 'AM' && hours === 12) hours = 0;
    }
  }

  const startDate = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate(), hours, minutes);
  const endDate = new Date(startDate.getTime() + 60 * 60 * 1000);

  const attendees = [
    { email: ADMIN_EMAIL, responseStatus: 'accepted' },
  ];
  if (clientEmail) {
    attendees.push({ email: clientEmail, responseStatus: 'accepted', displayName: clientName || 'Client' });
  }

  const event = await getGcal().events.insert({
    calendarId: 'primary',
    sendUpdates: 'all', // Sends native Google Calendar invite to client automatically
    requestBody: {
      summary: title || 'Mannjyotish Consultation',
      description: description || '',
      location: location || 'Online Zoom / WhatsApp',
      start: { dateTime: startDate.toISOString(), timeZone: 'Asia/Kolkata' },
      end: { dateTime: endDate.toISOString(), timeZone: 'Asia/Kolkata' },
      attendees,
      status: 'confirmed',
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 24 * 60 },
          { method: 'popup', minutes: 30 },
        ],
      },
    },
  });

  return event.data.htmlLink;
}

function buildGoogleCalendarUrl({ title, description, location, date, timeSlot }) {
  const eventDate = date ? new Date(date) : new Date();
  let hours = 10;
  let minutes = 0;

  if (timeSlot) {
    const match = timeSlot.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
    if (match) {
      hours = parseInt(match[1], 10);
      minutes = parseInt(match[2], 10);
      const ampm = match[3] ? match[3].toUpperCase() : null;
      if (ampm === 'PM' && hours < 12) hours += 12;
      if (ampm === 'AM' && hours === 12) hours = 0;
    }
  }

  const startDate = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate(), hours, minutes);
  const endDate = new Date(startDate.getTime() + 60 * 60 * 1000);

  const formatCalTime = (d) => d.toISOString().replace(/-|:|\.\d\d\d/g, '');
  const datesParam = `${formatCalTime(startDate)}/${formatCalTime(endDate)}`;

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: title || 'Mannjyotish Booking',
    dates: datesParam,
    details: description || 'Sacred Astrological Consultation & Ritual booking.',
    location: location || 'Online / Mannjyotish',
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

function buildIcsAttachment({ title, description, location, date, timeSlot, clientName, clientEmail, adminEmail }) {
  const eventDate = date ? new Date(date) : new Date();
  let hours = 10;
  let minutes = 0;

  if (timeSlot) {
    const match = timeSlot.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
    if (match) {
      hours = parseInt(match[1], 10);
      minutes = parseInt(match[2], 10);
      const ampm = match[3] ? match[3].toUpperCase() : null;
      if (ampm === 'PM' && hours < 12) hours += 12;
      if (ampm === 'AM' && hours === 12) hours = 0;
    }
  }

  const startDate = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate(), hours, minutes);
  const endDate = new Date(startDate.getTime() + 60 * 60 * 1000);

  const formatIcsTime = (d) => d.toISOString().replace(/-|:|\.\d\d\d/g, '');
  const uid = `booking-${Date.now()}-${Math.random().toString(36).substring(2, 7)}@mannjyotish.com`;

  const cleanDesc = (description || '').replace(/\r?\n/g, '\\n');
  const cleanTitle = (title || 'Mannjyotish Booking').replace(/\r?\n/g, ' ');

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Mannjyotish Astrology//Vedic Bookings//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:REQUEST',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `SEQUENCE:0`,
    `DTSTAMP:${formatIcsTime(new Date())}`,
    `DTSTART:${formatIcsTime(startDate)}`,
    `DTEND:${formatIcsTime(endDate)}`,
    `SUMMARY:${cleanTitle}`,
    `DESCRIPTION:${cleanDesc}`,
    `LOCATION:${location || 'Online Zoom / WhatsApp'}`,
    `ORGANIZER;CN=Mannjyotish Astrologer:mailto:${adminEmail}`,
    `ATTENDEE;CUTYPE=INDIVIDUAL;ROLE=REQ-PARTICIPANT;PARTSTAT=ACCEPTED;RSVP=FALSE;CN=Mannjyotish Admin:mailto:${adminEmail}`,
    clientEmail ? `ATTENDEE;CUTYPE=INDIVIDUAL;ROLE=REQ-PARTICIPANT;PARTSTAT=ACCEPTED;RSVP=FALSE;CN=${clientName || 'Client'}:mailto:${clientEmail}` : '',
    'STATUS:CONFIRMED',
    'TRANSP:OPAQUE',
    'END:VEVENT',
    'END:VCALENDAR'
  ].filter(Boolean).join('\r\n');
}

// ─── Uploads directory ────────────────────────────────────────────────────────
const UPLOADS_DIR = path.join(__dirname, '..', 'public', 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// ─── Multer storage ───────────────────────────────────────────────────────────
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOADS_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${uuidv4()}${ext}`);
  }
});
const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB for short reels/videos
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) cb(null, true);
    else cb(new Error('Only image and video files are allowed'));
  }
});

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors({
  origin: [FRONTEND_URL, 'http://localhost:5173', 'http://localhost:4173'],
  credentials: true
}));
app.use(express.json());
app.use('/uploads', express.static(UPLOADS_DIR));
app.use(passport.initialize());

// Request logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// ─── Google OAuth Strategy ────────────────────────────────────────────────────
if (GOOGLE_CLIENT_ID && GOOGLE_CLIENT_SECRET) {
  passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: GOOGLE_CALLBACK_URL,
  }, (accessToken, refreshToken, profile, done) => {
    const email = profile.emails?.[0]?.value || '';
    const isUserAdmin = ADMIN_EMAILS.includes(email.toLowerCase());
    const users = readData('users.json');

    let user = users.find(u => u.googleId === profile.id);
    if (!user) {
      // New user — check if this is an admin email
      user = {
        id: uuidv4(),
        googleId: profile.id,
        name: profile.displayName,
        email: email,
        picture: profile.photos?.[0]?.value || '',
        role: isUserAdmin ? 'admin' : 'user',
        registeredAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
      };
      users.push(user);
    } else {
      // Existing user — update last login & picture
      user.lastLoginAt = new Date().toISOString();
      user.picture = profile.photos?.[0]?.value || user.picture;
      // Ensure admin stays admin if in ADMIN_EMAILS
      if (isUserAdmin) user.role = 'admin';
      const idx = users.findIndex(u => u.googleId === profile.id);
      users[idx] = user;
    }

    writeData('users.json', users);
    return done(null, user);
  }));
} else {
  console.warn('⚠️  GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET missing. Google OAuth disabled.');
}

// ─── Auth Routes ──────────────────────────────────────────────────────────────
app.get('/api/auth/google', (req, res, next) => {
  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
    return res.status(503).json({ error: 'Google OAuth is not configured on this server.' });
  }
  passport.authenticate('google', { scope: ['profile', 'email'], session: false })(req, res, next);
});

app.get('/api/auth/google/callback', (req, res, next) => {
  const targetFrontend = getFrontendUrl(req);
  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
    return res.redirect(`${targetFrontend}/?auth=failed`);
  }
  passport.authenticate('google', { session: false, failureRedirect: `${targetFrontend}/?auth=failed` })(req, res, (err) => {
    if (err) {
      console.error('Google auth callback error:', err);
      return res.redirect(`${targetFrontend}/?auth=failed`);
    }
    const user = req.user;
    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name, picture: user.picture, role: user.role },
      JWT_SECRET,
      { expiresIn: '30d' }
    );
    console.log(`✅ Google Auth Success for ${user.email}, redirecting to ${targetFrontend}/?token=...`);
    res.redirect(`${targetFrontend}/?token=${token}`);
  });
});

app.get('/api/auth/me', verifyToken, (req, res) => {
  res.json({ success: true, user: req.user });
});

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    engine: 'Swiss Ephemeris (swisseph)',
    ayanamsha: 'Lahiri (Chitrapaksha)',
    houseSystem: 'Whole Sign (Vedic)',
    version: '2.0.0',
  });
});

// ─── Kundali Calculation ──────────────────────────────────────────────────────
app.post('/api/kundali', async (req, res) => {
  try {
    const { name, dateOfBirth, timeOfBirth, latitude, longitude, birthPlace } = req.body;
    const missing = [];
    if (!name) missing.push('name');
    if (!dateOfBirth) missing.push('dateOfBirth');
    if (!timeOfBirth) missing.push('timeOfBirth');
    if (latitude === undefined || latitude === null) missing.push('latitude');
    if (longitude === undefined || longitude === null) missing.push('longitude');
    if (missing.length > 0) return res.status(400).json({ error: `Missing required fields: ${missing.join(', ')}` });

    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateOfBirth)) return res.status(400).json({ error: 'dateOfBirth must be in YYYY-MM-DD format' });
    if (!/^\d{2}:\d{2}$/.test(timeOfBirth)) return res.status(400).json({ error: 'timeOfBirth must be in HH:MM format' });

    const { utcDate, timezone, utcOffsetFormatted } = localToUTC(dateOfBirth, timeOfBirth, parseFloat(latitude), parseFloat(longitude));
    const kundali = calculateKundali(utcDate, parseFloat(latitude), parseFloat(longitude));

    // Log report
    try {
      const reports = readData('reports.json');
      reports.unshift({
        id: uuidv4(),
        type: 'kundali',
        name,
        email: req.body.email || null,
        dateOfBirth,
        timeOfBirth,
        birthPlace: birthPlace || `${latitude}, ${longitude}`,
        generatedAt: new Date().toISOString()
      });
      writeData('reports.json', reports.slice(0, 1000));
    } catch (e) {}

    res.json({
      success: true,
      data: {
        name, birthPlace: birthPlace || `${latitude}, ${longitude}`,
        dateOfBirth, timeOfBirth,
        location: { latitude: parseFloat(latitude), longitude: parseFloat(longitude) },
        timezone, utcOffset: utcOffsetFormatted, utcDateTime: utcDate.toISOString(),
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
    const b = localToUTC(boy.dateOfBirth, boy.timeOfBirth, boy.latitude, boy.longitude);
    const g = localToUTC(girl.dateOfBirth, girl.timeOfBirth, girl.latitude, girl.longitude);
    const result = calculateMatch(b.utcDate, boy.latitude, boy.longitude, g.utcDate, girl.latitude, girl.longitude);

    try {
      const reports = readData('reports.json');
      reports.unshift({ id: uuidv4(), type: 'matchmaking', name: `${boy.name} & ${girl.name}`, generatedAt: new Date().toISOString() });
      writeData('reports.json', reports.slice(0, 500));
    } catch (e) {}

    res.json({ success: true, data: {
      boy: { name: boy.name, dateOfBirth: boy.dateOfBirth, timeOfBirth: boy.timeOfBirth, birthPlace: boy.birthPlace, ...result.boy },
      girl: { name: girl.name, dateOfBirth: girl.dateOfBirth, timeOfBirth: girl.timeOfBirth, birthPlace: girl.birthPlace, ...result.girl },
      ashtakoot: result.ashtakoot, manglikMatch: result.manglikMatch, rajjooDosha: result.rajjooDosha, vedhaDosha: result.vedhaDosha
    }});
  } catch (err) {
    console.error('Matchmaking error:', err.message);
    res.status(500).json({ error: err.message || 'Calculation failed' });
  }
});

// ─── Daily Panchang ───────────────────────────────────────────────────────────
app.get('/api/panchang/today', async (req, res) => {
  try {
    const lat = parseFloat(req.query.lat) || 28.6139;
    const lon = parseFloat(req.query.lon) || 77.2090;
    const nowIST = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
    const b = localToUTC(nowIST.toISOString().split('T')[0], nowIST.toTimeString().split(' ')[0].substring(0, 5), lat, lon);
    const result = calculateKundali(b.utcDate, lat, lon);
    res.json({ success: true, data: {
      date: nowIST.toISOString().split('T')[0],
      time: nowIST.toTimeString().split(' ')[0].substring(0, 5),
      location: { latitude: lat, longitude: lon },
      panchang: result.panchang, moonSign: result.moonSign, nakshatra: result.nakshatra
    }});
  } catch (err) {
    console.error('Panchang error:', err.message);
    res.status(500).json({ error: err.message || 'Calculation failed' });
  }
});

// ─── Gallery Routes ───────────────────────────────────────────────────────────
app.get('/api/gallery', (req, res) => {
  const gallery = readData('gallery.json');
  // "the one posted first should appear on first"
  // If post has explicit order, sort by order; otherwise by createdAt ascending (earliest first)
  const sorted = [...gallery].sort((a, b) => {
    if (a.order !== undefined && b.order !== undefined && a.order !== null && b.order !== null) {
      return Number(a.order) - Number(b.order);
    }
    return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
  });
  res.json({ success: true, data: sorted });
});

app.post('/api/gallery', verifyToken, requireAdmin, upload.single('media'), (req, res) => {
  const gallery = readData('gallery.json');
  const { title, description, location, mediaType, videoUrl, mediaUrl, likes, order } = req.body;
  
  let detectedType = mediaType || 'image';
  let mediaPath = '';

  if (req.file) {
    mediaPath = `/uploads/${req.file.filename}`;
    if (req.file.mimetype.startsWith('video/')) {
      detectedType = 'video';
    }
  } else if (mediaUrl) {
    mediaPath = mediaUrl;
  } else if (req.body.image) {
    mediaPath = req.body.image;
  } else if (videoUrl) {
    mediaPath = videoUrl;
    detectedType = 'video';
  }

  // Also check extension if mediaPath has mp4/webm/mov
  if (mediaPath && (mediaPath.endsWith('.mp4') || mediaPath.endsWith('.webm') || mediaPath.endsWith('.mov'))) {
    detectedType = 'video';
  }

  const newPost = {
    id: uuidv4(),
    title: title || '',
    description: description || '',
    location: location || 'Vrindavan Dham · Radhavallabh Temple',
    mediaType: detectedType,
    mediaUrl: mediaPath,
    image: mediaPath, // backward compatibility
    likes: req.body.likes !== undefined && req.body.likes !== '' ? Number(likes) : Math.floor(Math.random() * 500) + 750,
    order: order !== undefined && order !== '' ? Number(order) : (gallery.length > 0 ? Math.max(...gallery.map(g => Number(g.order || 0))) + 1 : 1),
    createdAt: new Date().toISOString(),
  };

  gallery.push(newPost);
  writeData('gallery.json', gallery);
  res.json({ success: true, data: newPost });
});

app.put('/api/gallery/:id', verifyToken, requireAdmin, upload.single('media'), (req, res) => {
  const gallery = readData('gallery.json');
  const idx = gallery.findIndex(g => g.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });

  let mediaPath = gallery[idx].mediaUrl || gallery[idx].image;
  let detectedType = req.body.mediaType || gallery[idx].mediaType || 'image';

  if (req.file) {
    mediaPath = `/uploads/${req.file.filename}`;
    detectedType = req.file.mimetype.startsWith('video/') ? 'video' : 'image';
  } else if (req.body.mediaUrl) {
    mediaPath = req.body.mediaUrl;
  } else if (req.body.image) {
    mediaPath = req.body.image;
  }

  if (mediaPath && (mediaPath.endsWith('.mp4') || mediaPath.endsWith('.webm') || mediaPath.endsWith('.mov'))) {
    detectedType = 'video';
  }

  gallery[idx] = {
    ...gallery[idx],
    title: req.body.title !== undefined ? req.body.title : gallery[idx].title,
    description: req.body.description !== undefined ? req.body.description : gallery[idx].description,
    location: req.body.location !== undefined ? req.body.location : gallery[idx].location,
    mediaType: detectedType,
    mediaUrl: mediaPath,
    image: mediaPath,
    likes: req.body.likes !== undefined && req.body.likes !== '' ? Number(req.body.likes) : gallery[idx].likes,
    order: req.body.order !== undefined && req.body.order !== '' ? Number(req.body.order) : gallery[idx].order,
    updatedAt: new Date().toISOString(),
  };

  writeData('gallery.json', gallery);
  res.json({ success: true, data: gallery[idx] });
});

app.delete('/api/gallery/:id', verifyToken, requireAdmin, (req, res) => {
  const gallery = readData('gallery.json');
  const filtered = gallery.filter(g => g.id !== req.params.id);
  writeData('gallery.json', filtered);
  res.json({ success: true });
});

// ─── Admin: Pujas CRUD ────────────────────────────────────────────────────────
app.get('/api/pujas', (req, res) => {
  res.json({ success: true, data: readData('pujas.json') });
});

app.post('/api/admin/pujas', verifyToken, requireAdmin, upload.single('image'), (req, res) => {
  const pujas = readData('pujas.json');
  const { title, price, category, description, benefits } = req.body;
  const newPuja = {
    id: uuidv4(),
    title, price, category, description,
    benefits: benefits ? (Array.isArray(benefits) ? benefits : benefits.split('\n').filter(Boolean)) : [],
    image: req.file ? `/uploads/${req.file.filename}` : '',
    createdAt: new Date().toISOString(),
  };
  pujas.unshift(newPuja);
  writeData('pujas.json', pujas);
  res.json({ success: true, data: newPuja });
});

app.put('/api/admin/pujas/:id', verifyToken, requireAdmin, upload.single('image'), (req, res) => {
  const pujas = readData('pujas.json');
  const idx = pujas.findIndex(p => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  const { title, price, category, description, benefits } = req.body;
  pujas[idx] = {
    ...pujas[idx],
    title: title || pujas[idx].title,
    price: price || pujas[idx].price,
    category: category || pujas[idx].category,
    description: description !== undefined ? description : pujas[idx].description,
    benefits: benefits ? (Array.isArray(benefits) ? benefits : benefits.split('\n').filter(Boolean)) : pujas[idx].benefits,
    image: req.file ? `/uploads/${req.file.filename}` : pujas[idx].image,
    updatedAt: new Date().toISOString(),
  };
  writeData('pujas.json', pujas);
  res.json({ success: true, data: pujas[idx] });
});

app.delete('/api/admin/pujas/:id', verifyToken, requireAdmin, (req, res) => {
  const pujas = readData('pujas.json');
  writeData('pujas.json', pujas.filter(p => p.id !== req.params.id));
  res.json({ success: true });
});

// ─── Admin: Courses CRUD ──────────────────────────────────────────────────────
app.get('/api/courses', (req, res) => {
  res.json({ success: true, data: readData('courses.json') });
});

app.post('/api/admin/courses', verifyToken, requireAdmin, (req, res) => {
  const courses = readData('courses.json');
  const { title, description, icon, youtubeUrl } = req.body;
  const newCourse = { id: uuidv4(), title, description, icon: icon || 'sun', youtubeUrl: youtubeUrl || '', createdAt: new Date().toISOString() };
  courses.unshift(newCourse);
  writeData('courses.json', courses);
  res.json({ success: true, data: newCourse });
});

app.put('/api/admin/courses/:id', verifyToken, requireAdmin, (req, res) => {
  const courses = readData('courses.json');
  const idx = courses.findIndex(c => c.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  courses[idx] = { ...courses[idx], ...req.body, updatedAt: new Date().toISOString() };
  writeData('courses.json', courses);
  res.json({ success: true, data: courses[idx] });
});

app.delete('/api/admin/courses/:id', verifyToken, requireAdmin, (req, res) => {
  const courses = readData('courses.json');
  writeData('courses.json', courses.filter(c => c.id !== req.params.id));
  res.json({ success: true });
});

// ─── Admin: Shop CRUD ─────────────────────────────────────────────────────────
app.get('/api/shop', (req, res) => {
  res.json({ success: true, data: readData('shop.json') });
});

app.post('/api/admin/shop', verifyToken, requireAdmin, upload.single('image'), (req, res) => {
  const shop = readData('shop.json');
  const { title, price, category } = req.body;
  const newItem = {
    id: uuidv4(), title, price, category,
    image: req.file ? `/uploads/${req.file.filename}` : '',
    createdAt: new Date().toISOString(),
  };
  shop.unshift(newItem);
  writeData('shop.json', shop);
  res.json({ success: true, data: newItem });
});

app.put('/api/admin/shop/:id', verifyToken, requireAdmin, upload.single('image'), (req, res) => {
  const shop = readData('shop.json');
  const idx = shop.findIndex(s => s.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  shop[idx] = {
    ...shop[idx], ...req.body,
    image: req.file ? `/uploads/${req.file.filename}` : shop[idx].image,
    updatedAt: new Date().toISOString(),
  };
  writeData('shop.json', shop);
  res.json({ success: true, data: shop[idx] });
});

app.delete('/api/admin/shop/:id', verifyToken, requireAdmin, (req, res) => {
  const shop = readData('shop.json');
  writeData('shop.json', shop.filter(s => s.id !== req.params.id));
  res.json({ success: true });
});

// ─── Reviews API ─────────────────────────────────────────────────────────────
// Public: get up to 5 featured reviews for homepage
app.get('/api/reviews/featured', (req, res) => {
  const reviews = readData('reviews.json');
  const featured = reviews.filter(r => r.isFeatured && r.isApproved).slice(0, 5);
  res.json({ success: true, data: featured });
});

// Authenticated user submits a review
app.post('/api/reviews', verifyToken, (req, res) => {
  const { rating, text, city } = req.body;
  if (!text || !text.trim()) {
    return res.status(400).json({ error: 'Review text is required.' });
  }
  const reviews = readData('reviews.json');
  const newReview = {
    id: uuidv4(),
    userId: req.user.id || '',
    userName: req.user.name || 'Seeker',
    userEmail: req.user.email || '',
    userPicture: req.user.picture || '',
    rating: Math.max(1, Math.min(5, Number(rating) || 5)),
    city: city ? city.trim() : 'India',
    text: text.trim(),
    isApproved: true,
    isFeatured: false,
    createdAt: new Date().toISOString()
  };
  reviews.unshift(newReview);
  writeData('reviews.json', reviews);
  res.json({ success: true, data: newReview });
});

// Admin: Get all reviews
app.get('/api/admin/reviews', verifyToken, requireAdmin, (req, res) => {
  const reviews = readData('reviews.json');
  res.json({ success: true, data: reviews });
});

// Admin: Create custom review
app.post('/api/admin/reviews', verifyToken, requireAdmin, (req, res) => {
  const { userName, rating, text, city, isFeatured, isApproved } = req.body;
  const reviews = readData('reviews.json');
  const newReview = {
    id: uuidv4(),
    userName: userName || 'Seeker',
    city: city || 'India',
    rating: Math.max(1, Math.min(5, Number(rating) || 5)),
    text: (text || '').trim(),
    isApproved: isApproved !== undefined ? isApproved : true,
    isFeatured: isFeatured || false,
    createdAt: new Date().toISOString()
  };
  reviews.unshift(newReview);
  writeData('reviews.json', reviews);
  res.json({ success: true, data: newReview });
});

// Admin: Update review (approve/unapprove, toggle featured, edit)
app.put('/api/admin/reviews/:id', verifyToken, requireAdmin, (req, res) => {
  const reviews = readData('reviews.json');
  const idx = reviews.findIndex(r => r.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Review not found' });

  // If setting isFeatured to true, ensure max 5 featured reviews
  if (req.body.isFeatured === true) {
    const featuredCount = reviews.filter(r => r.id !== req.params.id && r.isFeatured).length;
    if (featuredCount >= 5) {
      return res.status(400).json({ error: 'Maximum 5 reviews can be featured on the homepage. Please unpin another review first.' });
    }
  }

  reviews[idx] = {
    ...reviews[idx],
    ...req.body,
    updatedAt: new Date().toISOString()
  };
  writeData('reviews.json', reviews);
  res.json({ success: true, data: reviews[idx] });
});

// Admin: Delete review
app.delete('/api/admin/reviews/:id', verifyToken, requireAdmin, (req, res) => {
  const reviews = readData('reviews.json');
  writeData('reviews.json', reviews.filter(r => r.id !== req.params.id));
  res.json({ success: true });
});

// ─── Admin: Users ─────────────────────────────────────────────────────────────
app.get('/api/admin/users', verifyToken, requireAdmin, (req, res) => {
  const users = readData('users.json');
  const reports = readData('reports.json');

  const safe = users.map(({ googleId, ...u }) => {
    const userReports = reports.filter(r => r.email && u.email && r.email.toLowerCase() === u.email.toLowerCase());
    return {
      ...u,
      kundliCount: userReports.length,
      lastKundliAt: userReports.length > 0 ? userReports[0].generatedAt : null
    };
  });
  res.json({ success: true, data: safe });
});

app.get('/api/admin/reports', verifyToken, requireAdmin, (req, res) => {
  const reports = readData('reports.json');
  res.json({ success: true, data: reports });
});

app.put('/api/admin/users/:id/role', verifyToken, requireAdmin, (req, res) => {
  const users = readData('users.json');
  const idx = users.findIndex(u => u.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  users[idx].role = req.body.role === 'admin' ? 'admin' : 'user';
  writeData('users.json', users);
  res.json({ success: true, data: users[idx] });
});

// ─── Admin: Dashboard Stats ───────────────────────────────────────────────────
app.get('/api/admin/stats', verifyToken, requireAdmin, (req, res) => {
  const users = readData('users.json');
  const gallery = readData('gallery.json');
  const pujas = readData('pujas.json');
  const courses = readData('courses.json');
  const shop = readData('shop.json');
  const reports = readData('reports.json');

  const now = new Date();
  const last7Days = new Date(now - 7 * 24 * 60 * 60 * 1000);

  const recentUsers = users
    .filter(u => new Date(u.registeredAt) > last7Days)
    .map(({ googleId, ...u }) => u)
    .slice(0, 10);

  const recentReports = reports.slice(0, 10);

  res.json({
    success: true,
    data: {
      totalUsers: users.length,
      totalGalleryPosts: gallery.length,
      totalPujas: pujas.length,
      totalCourses: courses.length,
      totalShopItems: shop.length,
      totalReports: reports.length,
      recentUsers,
      recentReports,
    }
  });
});

// ─── Contact Form Endpoint (Resend Email) ─────────────────────────────────────
app.post('/api/contact', async (req, res) => {
  try {
    const { user_name, user_email, message } = req.body;
    if (!user_name || !user_email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required.' });
    }

    // 1. Send email to Admin
    try {
      await resend.emails.send({
        from: 'Mannjyotish Contact <onboarding@resend.dev>',
        to: [ADMIN_EMAIL],
        subject: `✨ New Website Message from ${user_name}`,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 24px; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #d4af37; border-radius: 12px; background: #faf9f6;">
            <h2 style="color: #b8860b; border-bottom: 2px solid #d4af37; padding-bottom: 10px; margin-top:0;">🌟 New Inquiry Received</h2>
            <p><strong>Name:</strong> ${user_name}</p>
            <p><strong>Email:</strong> <a href="mailto:${user_email}">${user_email}</a></p>
            <p><strong>Message:</strong></p>
            <div style="background: #fff; padding: 16px; border-left: 4px solid #d4af37; border-radius: 6px; font-style: italic; white-space: pre-wrap;">${message}</div>
            <p style="font-size: 0.85em; color: #777; margin-top: 24px; text-align: center;">Sent from Mannjyotish Web Platform</p>
          </div>
        `
      });
    } catch (e) {
      console.error('Failed sending admin contact email via Resend:', e);
    }

    // 2. Send confirmation to user
    try {
      await resend.emails.send({
        from: 'Mannjyotish Support <onboarding@resend.dev>',
        to: [user_email],
        subject: `Thank you for reaching out to Mannjyotish, ${user_name}`,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 24px; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #d4af37; border-radius: 12px; background: #faf9f6;">
            <h2 style="color: #b8860b; text-align: center; margin-top: 0;">🙏 Namaste ${user_name}</h2>
            <p>Thank you for contacting Mannjyotish. We have received your message and will get back to you shortly.</p>
            <div style="background: #fff; padding: 14px; border-left: 4px solid #d4af37; margin: 16px 0;">"${message}"</div>
            <p style="text-align: center; color: #b8860b; font-weight: bold; margin-top: 24px;">Hari Om 🕉️<br/>Mannjyotish Team</p>
          </div>
        `
      });
    } catch (e) {
      console.error('Failed sending user contact confirmation email via Resend:', e);
    }

    res.json({ success: true, message: 'Message sent successfully!' });
  } catch (err) {
    console.error('Contact endpoint error:', err);
    res.status(500).json({ error: 'Failed to send message.' });
  }
});

// ─── Busy Slots Endpoint (Conflict Checking) ──────────────────────────────────
app.get('/api/bookings/busy-slots', (req, res) => {
  const { date } = req.query;
  if (!date) return res.json({ success: true, busySlots: [] });
  const bookings = readData('bookings.json');
  const busySlots = bookings
    .filter(b => b.bookingDate === date && b.status !== 'cancelled')
    .map(b => b.bookingTimeSlot);
  res.json({ success: true, busySlots });
});

// ─── Bookings Endpoint (Resend Email + Google Calendar + ICS Invite) ──────────
app.post('/api/bookings', async (req, res) => {
  try {
    const {
      name, email, whatsapp, birthDate, birthTime, birthPlace,
      serviceTitle, servicePrice, bookingDate, bookingTimeSlot, notes, bookingType
    } = req.body;

    if (!name || !whatsapp) {
      return res.status(400).json({ error: 'Name and WhatsApp number are required.' });
    }

    const targetDate = bookingDate || new Date().toISOString().split('T')[0];
    const targetSlot = bookingTimeSlot || '10:00 AM';

    const bookings = readData('bookings.json');

    // Slot Conflict Check (Calendly-style Slot Locking)
    const isConflict = bookings.some(
      b => b.bookingDate === targetDate && b.bookingTimeSlot === targetSlot && b.status !== 'cancelled'
    );

    if (isConflict) {
      return res.status(409).json({
        error: `The time slot "${targetSlot}" on ${targetDate} has already been booked. Please select another available time slot.`
      });
    }

    const bookingId = uuidv4();

    const richDescription = [
      `🔮 Service: ${serviceTitle || 'Astrological Consultation'} ${servicePrice ? `(${servicePrice})` : ''}`,
      `📍 Location / Mode: ${bookingType === 'pooja' ? 'Temple Campus, Bhind, MP' : 'Online Zoom / WhatsApp'}`,
      `👤 Client Name: ${name}`,
      `📱 WhatsApp: ${whatsapp}`,
      `📧 Email: ${email || 'Not provided'}`,
      `🎂 Birth Date: ${birthDate || 'N/A'}`,
      `⏰ Birth Time: ${birthTime || 'N/A'}`,
      `🏙️ Birth Place: ${birthPlace || 'N/A'}`,
      `📝 Notes / Requirement: ${notes || 'None'}`,
      `----------------------------------------`,
      `Booked via Mannjyotish Vedic Astrology Platform`
    ].join('\n');

    const gCalUrl = buildGoogleCalendarUrl({
      title: `Mannjyotish: ${serviceTitle || 'Consultation'} - ${name}`,
      description: richDescription,
      location: bookingType === 'pooja' ? 'Temple Campus, Bhind, MP' : 'Online Zoom / WhatsApp',
      date: targetDate,
      timeSlot: targetSlot,
    });

    const newBooking = {
      id: bookingId,
      name,
      email: email || '',
      whatsapp,
      birthDate: birthDate || '',
      birthTime: birthTime || '',
      birthPlace: birthPlace || '',
      serviceTitle: serviceTitle || 'General Consultation',
      servicePrice: servicePrice || '',
      bookingDate: targetDate,
      bookingTimeSlot: targetSlot,
      notes: notes || '',
      bookingType: bookingType || 'online',
      googleCalendarUrl: gCalUrl,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    };

    bookings.unshift(newBooking);
    writeData('bookings.json', bookings);

    // Build iCal (.ics) file string for automatic Google Calendar invite placement
    const icsContent = buildIcsAttachment({
      title: `Mannjyotish: ${newBooking.serviceTitle} - ${name}`,
      description: richDescription,
      location: bookingType === 'pooja' ? 'Temple Campus, Bhind, MP' : 'Online Zoom / WhatsApp',
      date: targetDate,
      timeSlot: targetSlot,
      clientName: name,
      clientEmail: email,
      adminEmail: ADMIN_EMAIL,
    });

    const icsAttachment = [
      {
        filename: 'invite.ics',
        content: Buffer.from(icsContent).toString('base64'),
        contentType: 'text/calendar; method=REQUEST; name=invite.ics',
      }
    ];

    // ── Auto-insert event directly into Google Calendar (zero clicks for client) ─
    let gcalEventLink = null;
    try {
      gcalEventLink = await insertGoogleCalendarEvent({
        title: `${newBooking.serviceTitle} — ${name}`,
        description: `Service: ${newBooking.serviceTitle} ${newBooking.servicePrice ? `(${newBooking.servicePrice})` : ''}\nClient: ${name}\nPhone: ${whatsapp}\nEmail: ${email || 'N/A'}\nBirth Date: ${birthDate || 'N/A'}, Time: ${birthTime || 'N/A'}, Place: ${birthPlace || 'N/A'}\nNotes: ${notes || 'None'}`,
        location: bookingType === 'pooja' ? 'Bhind Temple, Madhya Pradesh' : 'Online — Zoom / WhatsApp',
        date: newBooking.bookingDate,
        timeSlot: newBooking.bookingTimeSlot,
        clientName: name,
        clientEmail: email,
      });
      console.log('✅ Google Calendar event created:', gcalEventLink);
    } catch (gcalErr) {
      console.error('⚠️ Google Calendar API error (non-fatal):', gcalErr.message);
    }

    // Send emails via Resend
    try {
      // Admin Email with ICS invite

      await resend.emails.send({
        from: 'Mannjyotish Bookings <onboarding@resend.dev>',
        to: [ADMIN_EMAIL],
        subject: `🪔 New Booking: ${newBooking.serviceTitle} (${name})`,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 24px; color: #333; max-width: 650px; margin: 0 auto; border: 2px solid #d4af37; border-radius: 14px; background: #fffdf9;">
            <h2 style="color: #b8860b; border-bottom: 2px solid #d4af37; padding-bottom: 8px; margin-top: 0;">🪔 New Booking Received</h2>
            <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
              <tr><td style="padding: 10px; font-weight: bold; width: 35%;">Service / Ritual:</td><td style="padding: 10px; color: #b8860b; font-weight: bold;">${newBooking.serviceTitle} ${newBooking.servicePrice ? `(${newBooking.servicePrice})` : ''}</td></tr>
              <tr style="background: #f7f5f0;"><td style="padding: 10px; font-weight: bold;">Client Name:</td><td style="padding: 10px;">${name}</td></tr>
              <tr><td style="padding: 10px; font-weight: bold;">WhatsApp / Phone:</td><td style="padding: 10px;"><a href="https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}">${whatsapp}</a></td></tr>
              <tr style="background: #f7f5f0;"><td style="padding: 10px; font-weight: bold;">Email:</td><td style="padding: 10px;">${email || 'Not provided'}</td></tr>
              <tr><td style="padding: 10px; font-weight: bold;">Date & Time Slot:</td><td style="padding: 10px; font-weight: bold; color: #333;">${newBooking.bookingDate} at ${newBooking.bookingTimeSlot}</td></tr>
              <tr style="background: #f7f5f0;"><td style="padding: 10px; font-weight: bold;">Birth Details:</td><td style="padding: 10px;">Date: ${birthDate || 'N/A'}, Time: ${birthTime || 'N/A'}, Place: ${birthPlace || 'N/A'}</td></tr>
              <tr><td style="padding: 10px; font-weight: bold;">Notes / Purpose:</td><td style="padding: 10px;">${notes || 'None'}</td></tr>
            </table>

            <div style="margin-top: 25px; text-align: center;">
              <a href="${gCalUrl}" target="_blank" style="background: #d4af37; color: #000; padding: 14px 28px; text-decoration: none; font-weight: bold; border-radius: 8px; display: inline-block;">📅 Add to Google Calendar</a>
            </div>
          </div>
        `,
        attachments: icsAttachment,
      });

      // User Confirmation Email with ICS invite (if email provided)
      if (email) {
        await resend.emails.send({
          from: 'Mannjyotish Astrology <onboarding@resend.dev>',
          to: [email],
          subject: `✨ Booking Confirmation: ${newBooking.serviceTitle} with Mannjyotish`,
          html: `
            <div style="font-family: Arial, sans-serif; padding: 24px; color: #333; max-width: 650px; margin: 0 auto; border: 2px solid #d4af37; border-radius: 14px; background: #fffdf9;">
              <h2 style="color: #b8860b; text-align: center; margin-top: 0;">🙏 Namaste ${name}!</h2>
              <p style="font-size: 1.05em; text-align: center;">Your booking for <strong>${newBooking.serviceTitle}</strong> has been successfully received.</p>

              <div style="background: #f7f5f0; padding: 18px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #d4af37;">
                <h3 style="margin-top:0; color: #b8860b;">Booking Overview:</h3>
                <p style="margin: 6px 0;"><strong>Service:</strong> ${newBooking.serviceTitle} ${newBooking.servicePrice ? `(${newBooking.servicePrice})` : ''}</p>
                <p style="margin: 6px 0;"><strong>Scheduled Slot:</strong> ${newBooking.bookingDate} (${newBooking.bookingTimeSlot})</p>
                <p style="margin: 6px 0;"><strong>Mode:</strong> ${bookingType === 'pooja' ? 'Sacred Pooja in Bhind Temple' : 'Online Personal Consultation'}</p>
              </div>

              <div style="text-align: center; margin: 28px 0;">
                <a href="${gCalUrl}" target="_blank" style="background: #d4af37; color: #000; padding: 14px 28px; text-decoration: none; font-weight: bold; border-radius: 8px; display: inline-block;">📅 Add Session to Google Calendar</a>
              </div>

              <p style="font-size: 0.9em; color: #666; text-align: center;">We attached a calendar invitation (event.ics) to this email. Your calendar app will automatically add it!</p>
              <p style="text-align: center; color: #b8860b; font-weight: bold; margin-top: 28px;">Hari Om 🕉️<br/>Mannjyotish Vedic Astrology</p>
            </div>
          `,
          attachments: icsAttachment,
        });
      }
    } catch (e) {
      console.error('Error sending Resend booking emails:', e);
    }

    // ── WhatsApp notification to admin (non-blocking) ──────────────────────────
    const adminWhatsAppNumber = process.env.ADMIN_WHATSAPP_NUMBER;
    if (adminWhatsAppNumber) {
      sendWhatsApp({
        to: adminWhatsAppNumber,
        body: [
          `🪔 *New Booking — ${newBooking.serviceTitle}*`,
          `👤 Client: ${name}`,
          `📱 WhatsApp: ${whatsapp}`,
          `📅 Date & Time: ${newBooking.bookingDate} at ${newBooking.bookingTimeSlot}`,
          `💰 Price: ${newBooking.servicePrice || 'N/A'}`,
          `📝 Notes: ${notes || 'None'}`,
          `🔗 Manage: https://mannjyotish.com/admin`,
        ].join('\n'),
      }).catch(err => console.warn('[whatsapp:booking-notify]', err.message));
    }

    res.json({ success: true, booking: newBooking, googleCalendarUrl: gCalUrl });
  } catch (err) {
    console.error('Booking endpoint error:', err);
    res.status(500).json({ error: 'Failed to record booking.' });
  }
});

// ─── Demo Class Booking Endpoint ──────────────────────────────────────────────
app.post('/api/demo-booking', async (req, res) => {
  try {
    const { name, email, phone, courseTitle, notes, eventDate } = req.body;
    if (!name || !email || !phone) {
      return res.status(400).json({ error: 'Name, email, and phone number are required.' });
    }

    const bookings = readData('bookings.json');
    const newDemoBooking = {
      id: uuidv4(),
      type: 'demo_class',
      title: `Live Demo Class: ${courseTitle || 'Vedic Astrology'}`,
      service: courseTitle || 'Foundation of Jyotish',
      name,
      email,
      phone,
      notes: notes || '',
      date: eventDate || '1st of Upcoming Month',
      time: '07:00 PM IST',
      status: 'confirmed',
      createdAt: new Date().toISOString()
    };

    bookings.unshift(newDemoBooking);
    writeData('bookings.json', bookings);

    // Send emails via Resend
    try {
      // 1. Alert email to Acharya Ji
      await resend.emails.send({
        from: 'Mannjyotish Academy <onboarding@resend.dev>',
        to: ['goswamiashay000@gmail.com'],
        subject: `🎓 New Demo Class Registration: ${name} (${newDemoBooking.date})`,
        html: `
          <div style="font-family: sans-serif; padding: 20px; color: #333; max-width: 600px; border: 1px solid #e0c878; border-radius: 12px; background: #fffdf7;">
            <h2 style="color: #b8860b; border-bottom: 2px solid #b8860b; padding-bottom: 8px;">🎓 New Live Demo Class Enrollment</h2>
            <p><strong>Student Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>WhatsApp / Phone:</strong> ${phone}</p>
            <p><strong>Course of Interest:</strong> ${courseTitle || 'Foundation of Jyotish'}</p>
            <p><strong>Batch Schedule:</strong> ${newDemoBooking.date} at 7:00 PM IST</p>
            ${notes ? `<p><strong>Student Question / Notes:</strong> ${notes}</p>` : ''}
            <p style="margin-top: 20px; font-size: 0.85em; color: #888;">MannJyotish Academy Automated Notification</p>
          </div>
        `
      });

      // 2. Confirmation email to the User
      await resend.emails.send({
        from: 'Mannjyotish Academy <onboarding@resend.dev>',
        to: [email],
        subject: `🕉️ Your Demo Class Seat is Reserved: ${newDemoBooking.date} at 7:00 PM IST`,
        html: `
          <div style="font-family: sans-serif; padding: 24px; color: #333; max-width: 600px; border: 1px solid #d4af37; border-radius: 14px; background: #fffefb;">
            <div style="text-align: center; margin-bottom: 20px;">
              <h1 style="color: #b8860b; margin: 0; font-size: 24px;">MannJyotish Academy</h1>
              <p style="color: #666; font-size: 14px; margin: 4px 0;">Institute of Vedic Sciences & Astrology · Vrindavan Lineage</p>
            </div>
            <p>Namaste <strong>${name}</strong>,</p>
            <p>Congratulations! Your seat for the <strong>Live Vedic Astrology Demo Class</strong> has been reserved.</p>
            <div style="background: #fbf7ec; border-left: 4px solid #b8860b; padding: 14px 18px; margin: 20px 0; border-radius: 4px;">
              <p style="margin: 4px 0;"><strong>📚 Course:</strong> ${courseTitle || 'Foundation of Jyotish'}</p>
              <p style="margin: 4px 0;"><strong>🗓️ Date:</strong> ${newDemoBooking.date}</p>
              <p style="margin: 4px 0;"><strong>🕖 Time:</strong> 7:00 PM IST</p>
              <p style="margin: 4px 0;"><strong>🎙️ Mentor:</strong> Acharya Shri Hit Ashay Krishn Goswami</p>
            </div>
            <p>You will receive the private session link and study materials on your WhatsApp (<strong>${phone}</strong>) prior to the class.</p>
            <p style="margin-top: 24px;">Blessings and regards,<br><strong>Acharya Shri Hit Ashay Krishn Goswami</strong><br>MannJyotish Academy</p>
          </div>
        `
      });
    } catch (mailErr) {
      console.error('Demo booking Resend mail warning:', mailErr);
    }

    res.json({ success: true, booking: newDemoBooking });
  } catch (err) {
    console.error('Demo booking error:', err);
    res.status(500).json({ error: 'Failed to reserve demo class.' });
  }
});

// ─── WhatsApp Cloud API Webhooks ──────────────────────────────────────────────
// 1. GET verification endpoint (Meta dashboard verifies Callback URL & Token)
app.get('/api/webhook/whatsapp', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  const WHATSAPP_VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN || 'mannjyotish_wa_secret_2026';

  if (mode && token) {
    if (mode === 'subscribe' && token === WHATSAPP_VERIFY_TOKEN) {
      console.log('✓ WhatsApp Webhook verified successfully by Meta!');
      return res.status(200).send(challenge);
    } else {
      console.warn('WhatsApp verification failed: token mismatch');
      return res.sendStatus(403);
    }
  }
  return res.sendStatus(400);
});

const { sendWhatsAppMessage, handleIncomingWhatsAppInteraction } = require('./src/whatsappBot');

// 2. POST webhook event handler (Meta delivers incoming messages and status updates)
app.post('/api/webhook/whatsapp', async (req, res) => {
  const body = req.body;
  if (body.object) {
    // Respond with 200 OK within 3 seconds as required by Meta
    res.status(200).send('EVENT_RECEIVED');

    try {
      if (
        body.entry &&
        body.entry[0]?.changes &&
        body.entry[0]?.changes[0]?.value?.messages &&
        body.entry[0]?.changes[0]?.value?.messages[0]
      ) {
        const msg = body.entry[0].changes[0].value.messages[0];
        const contact = body.entry[0].changes[0].value.contacts?.[0];
        const from = msg.from; // User's WhatsApp number
        const senderName = contact?.profile?.name || '';

        let userChoice = '';
        if (msg.type === 'interactive') {
          if (msg.interactive?.type === 'button_reply') {
            userChoice = msg.interactive.button_reply.id || msg.interactive.button_reply.title || '';
          } else if (msg.interactive?.type === 'list_reply') {
            userChoice = msg.interactive.list_reply.id || msg.interactive.list_reply.title || '';
          }
        } else if (msg.type === 'text') {
          userChoice = msg.text?.body || '';
        }

        console.log(`[WhatsApp Incoming] From: ${from} (${senderName}) | Type: ${msg.type} | Input: ${userChoice}`);

        // Generate and send interactive button or list reply
        const botReply = handleIncomingWhatsAppInteraction(userChoice, from, senderName);
        await sendWhatsAppMessage(from, botReply);
      }
    } catch (e) {
      console.error('Error handling WhatsApp message event:', e);
    }
  } else {
    res.sendStatus(404);
  }
});

// ─── Baileys Direct WhatsApp Bot (Zero-Card QR Connect) ──────────────────────
let baileysBotModule = null;
try {
  baileysBotModule = require('./src/baileysBot');
  baileysBotModule.startBaileysBot();
  console.log('✓ Baileys WhatsApp Bot module loaded and initialized.');
} catch (bErr) {
  console.warn('Baileys bot initialization warning (run npm install if needed):', bErr.message);
}

app.get('/api/whatsapp/status', (req, res) => {
  if (!baileysBotModule) {
    return res.json({ status: 'not_installed', error: 'Baileys not loaded' });
  }
  res.json(baileysBotModule.getBotState());
});

// ─── Chit Fund Reminder Endpoints ────────────────────────────────────────────
app.get('/api/chitfund/preview', (req, res) => {
  try {
    const { parseChitFundData } = require('./src/chitFundReminder');
    const data = parseChitFundData();
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/chitfund/send-reminders', async (req, res) => {
  try {
    const { sendReminders } = require('./src/sendChitReminders');
    const limit = parseInt(req.body.limit, 10) || 2;
    const results = await sendReminders(limit);
    res.json({ success: true, count: results.length, data: results });
  } catch (err) {
    console.error('Chit fund reminder API error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/whatsapp/logout', async (req, res) => {
  if (!baileysBotModule) {
    return res.json({ success: false });
  }
  const result = await baileysBotModule.logoutBot();
  res.json(result);
});

// User-friendly QR code linking page
app.get(['/whatsapp-scan', '/api/whatsapp/scan'], (req, res) => {
  res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Connect WhatsApp Bot | MannJyotish</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700&family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: radial-gradient(circle at top, #141b2d 0%, #080c14 100%);
      color: #f3f4f6;
      font-family: 'Outfit', sans-serif;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 24px;
    }
    .card {
      background: rgba(18, 24, 38, 0.85);
      backdrop-filter: blur(16px);
      border: 1px solid rgba(212, 175, 55, 0.35);
      border-radius: 24px;
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6), 0 0 30px rgba(212, 175, 55, 0.15);
      max-width: 480px;
      width: 100%;
      padding: 36px 28px;
      text-align: center;
      position: relative;
    }
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: rgba(212, 175, 55, 0.15);
      color: #e5c158;
      border: 1px solid rgba(212, 175, 55, 0.4);
      padding: 6px 14px;
      border-radius: 999px;
      font-size: 12px;
      font-weight: 600;
      letter-spacing: 0.5px;
      margin-bottom: 16px;
      text-transform: uppercase;
    }
    h1 {
      font-family: 'Cinzel', serif;
      font-size: 26px;
      color: #f7e7b4;
      margin-bottom: 8px;
      letter-spacing: 0.5px;
    }
    p.subtitle {
      color: #9ca3af;
      font-size: 14px;
      line-height: 1.5;
      margin-bottom: 24px;
    }
    .qr-container {
      background: #ffffff;
      border-radius: 16px;
      padding: 16px;
      display: inline-block;
      box-shadow: 0 8px 30px rgba(0,0,0,0.4);
      margin-bottom: 20px;
      position: relative;
      min-width: 260px;
      min-height: 260px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .qr-image {
      width: 240px;
      height: 240px;
      display: block;
      border-radius: 8px;
    }
    .status-pill {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 8px 16px;
      border-radius: 12px;
      font-size: 13px;
      font-weight: 500;
      margin-bottom: 24px;
    }
    .status-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
    }
    .status-connecting {
      background: rgba(234, 179, 8, 0.15);
      color: #facc15;
      border: 1px solid rgba(234, 179, 8, 0.3);
    }
    .status-connecting .status-dot {
      background: #facc15;
      box-shadow: 0 0 8px #facc15;
      animation: pulse 1.5s infinite;
    }
    .status-ready {
      background: rgba(59, 130, 246, 0.15);
      color: #60a5fa;
      border: 1px solid rgba(59, 130, 246, 0.3);
    }
    .status-ready .status-dot {
      background: #60a5fa;
      box-shadow: 0 0 8px #60a5fa;
      animation: pulse 1.5s infinite;
    }
    .status-connected {
      background: rgba(34, 197, 94, 0.15);
      color: #4ade80;
      border: 1px solid rgba(34, 197, 94, 0.3);
    }
    .status-connected .status-dot {
      background: #4ade80;
      box-shadow: 0 0 8px #4ade80;
    }
    .instructions {
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 14px;
      padding: 16px;
      text-align: left;
      font-size: 13px;
      color: #d1d5db;
      line-height: 1.6;
      margin-bottom: 20px;
    }
    .instructions ol {
      padding-left: 20px;
    }
    .instructions li {
      margin-bottom: 6px;
    }
    .instructions strong {
      color: #f7e7b4;
    }
    .btn-logout {
      background: transparent;
      border: 1px solid rgba(239, 68, 68, 0.4);
      color: #f87171;
      padding: 8px 18px;
      border-radius: 8px;
      font-size: 12px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .btn-logout:hover {
      background: rgba(239, 68, 68, 0.15);
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.4; transform: scale(0.85); }
    }
    .spinner {
      border: 3px solid rgba(0, 0, 0, 0.1);
      width: 40px;
      height: 40px;
      border-radius: 50%;
      border-left-color: #b8860b;
      animation: spin 1s linear infinite;
    }
    @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
  </style>
</head>
<body>
  <div class="card">
    <div class="badge">🕉️ MannJyotish WhatsApp Service</div>
    <h1>Connect WhatsApp Bot</h1>
    <p class="subtitle">Link your WhatsApp number to activate the automated Vedic Astrology menu assistant.</p>

    <div id="statusPill" class="status-pill status-connecting">
      <span class="status-dot"></span>
      <span id="statusText">Checking WhatsApp connection...</span>
    </div>

    <div class="qr-container" id="qrWrapper">
      <div class="spinner" id="loadingSpinner"></div>
      <img id="qrImg" class="qr-image" style="display:none;" alt="Scan WhatsApp QR" />
      <div id="connectedView" style="display:none; color: #15803d; text-align: center; padding: 20px;">
        <div style="font-size: 54px; margin-bottom: 12px;">✅</div>
        <h3 style="font-size: 20px; font-weight: 700; color: #166534; margin-bottom: 4px;">WhatsApp Bot Active!</h3>
        <p id="userPhone" style="font-size: 14px; color: #374151; font-weight: 600;"></p>
        <p style="font-size: 12px; color: #4b5563; margin-top: 6px;">The bot is live and responding to incoming messages.</p>
      </div>
    </div>

    <div class="instructions" id="instructionsBox">
      <ol>
        <li>Open <strong>WhatsApp</strong> on your mobile phone.</li>
        <li>Tap <strong>Menu (⋮)</strong> or <strong>Settings</strong> ⚙️.</li>
        <li>Tap <strong>Linked Devices</strong>.</li>
        <li>Tap <strong>Link a Device</strong> and point your camera at this QR code.</li>
      </ol>
    </div>

    <div id="logoutSection" style="display:none;">
      <button class="btn-logout" onclick="disconnectDevice()">Disconnect / Unlink Number</button>
    </div>
  </div>

  <script>
    let pollInterval = null;

    async function checkStatus() {
      try {
        const res = await fetch('/api/whatsapp/status');
        const data = await res.json();

        const pill = document.getElementById('statusPill');
        const statusText = document.getElementById('statusText');
        const spinner = document.getElementById('loadingSpinner');
        const qrImg = document.getElementById('qrImg');
        const connectedView = document.getElementById('connectedView');
        const instructions = document.getElementById('instructionsBox');
        const logoutSec = document.getElementById('logoutSection');

        if (data.status === 'connected') {
          pill.className = 'status-pill status-connected';
          statusText.textContent = 'Active & Connected';
          spinner.style.display = 'none';
          qrImg.style.display = 'none';
          connectedView.style.display = 'block';
          instructions.style.display = 'none';
          logoutSec.style.display = 'block';
          document.getElementById('userPhone').textContent = data.user?.id ? 'Linked: ' + data.user.id.split(':')[0] : 'Device Linked';
        } else if (data.status === 'qr_ready' && data.qr) {
          pill.className = 'status-pill status-ready';
          statusText.textContent = 'Scan QR Code with WhatsApp';
          spinner.style.display = 'none';
          qrImg.src = data.qr;
          qrImg.style.display = 'block';
          connectedView.style.display = 'none';
          instructions.style.display = 'block';
          logoutSec.style.display = 'none';
        } else {
          pill.className = 'status-pill status-connecting';
          statusText.textContent = 'Preparing QR code...';
          spinner.style.display = 'block';
          qrImg.style.display = 'none';
          connectedView.style.display = 'none';
          instructions.style.display = 'block';
          logoutSec.style.display = 'none';
        }
      } catch (e) {
        console.error('Polling error:', e);
      }
    }

    async function disconnectDevice() {
      if (!confirm('Are you sure you want to unlink this WhatsApp account?')) return;
      try {
        await fetch('/api/whatsapp/logout', { method: 'POST' });
        checkStatus();
      } catch (e) {
        alert('Failed to disconnect');
      }
    }

    checkStatus();
    pollInterval = setInterval(checkStatus, 2500);
  </script>
</body>
</html>`);
});


// ─── Courses Endpoints ────────────────────────────────────────────────────────
app.get('/api/courses', (req, res) => {
  const courses = readData('courses.json');
  res.json({ success: true, data: courses });
});

app.post('/api/admin/courses', verifyToken, requireAdmin, upload.single('image'), (req, res) => {
  const { title, description, type, icon, youtubeUrl } = req.body;
  const imagePath = req.file ? `/uploads/${req.file.filename}` : '';
  const newCourse = {
    id: uuidv4(),
    title: title || 'New Course',
    description: description || '',
    type: type || (youtubeUrl ? 'youtube' : 'image'),
    icon: icon || 'sun',
    youtubeUrl: youtubeUrl || '',
    image: imagePath,
    createdAt: new Date().toISOString(),
  };
  const courses = readData('courses.json');
  courses.unshift(newCourse);
  writeData('courses.json', courses);
  res.json({ success: true, data: newCourse });
});

app.put('/api/admin/courses/:id', verifyToken, requireAdmin, upload.single('image'), (req, res) => {
  const { title, description, type, icon, youtubeUrl } = req.body;
  const courses = readData('courses.json');
  const index = courses.findIndex(c => c.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Course not found' });

  let imagePath = courses[index].image || '';
  if (req.file) imagePath = `/uploads/${req.file.filename}`;

  courses[index] = {
    ...courses[index],
    title: title !== undefined ? title : courses[index].title,
    description: description !== undefined ? description : courses[index].description,
    type: type !== undefined ? type : courses[index].type,
    icon: icon !== undefined ? icon : courses[index].icon,
    youtubeUrl: youtubeUrl !== undefined ? youtubeUrl : courses[index].youtubeUrl,
    image: imagePath,
    updatedAt: new Date().toISOString(),
  };

  writeData('courses.json', courses);
  res.json({ success: true, data: courses[index] });
});

app.delete('/api/admin/courses/:id', verifyToken, requireAdmin, (req, res) => {
  const courses = readData('courses.json');
  const filtered = courses.filter(c => c.id !== req.params.id);
  writeData('courses.json', filtered);
  res.json({ success: true });
});

// ─── AI Chatbot API Endpoint ──────────────────────────────────────────────────
app.post('/api/chat', (req, res) => {
  try {
    const { message, history } = req.body;
    const text = (message || '').trim().toLowerCase();

    // Contextual AI Response Engine
    let reply = "";
    let services = [];

    if (!text) {
      return res.json({
        reply: "🙏 Namaste! How may I assist your spiritual journey today? Ask about Kundli, Palmistry, Pujas, or schedule a session!",
        services: []
      });
    }

    if (/^(hi|hello|namaste|hey|pranam|good morning|good evening)/i.test(text)) {
      reply = "🙏 Namaste! How may I assist your spiritual journey today? Ask me about your Kundli analysis, Palmistry, Marriage Match, or Sacred Pujas!";
    }
    else if (/^(yes|yep|yeah|sure|okay|ok|haan|ha|pls|please|book|schedule)/i.test(text) && text.length <= 15) {
      reply = "Wonderful! Which service or sacred puja would you like to schedule with Astrologer Ashay ji? Tap an option below to open our live Google Calendar scheduler:";
      services = [
        { title: 'Kundli Reading', price: '₹2,100', category: 'Birth Chart Analysis' },
        { title: 'Palmistry', price: '₹1,500', category: 'Hand Line Analysis' },
        { title: 'Career Guidance', price: '₹2,500', category: 'Professional Growth' },
        { title: 'Marriage Match', price: '₹3,100', category: 'Matchmaking' },
        { title: 'Navagraha Shanti Puja', price: '₹31,000', category: 'Planetary Remedies' }
      ];
    }
    else if (/(thanks|thank you|dhanyawad|shukriya|bless)/i.test(text)) {
      reply = "Hari Om 🕉️ May cosmic blessings bring health, peace, and prosperity into your life! Feel free to ask anything anytime.";
    }
    else if (/(price|cost|charge|fee|how much|rate)/i.test(text)) {
      reply = "Here are our consultation and puja offerings:\n• Kundli Reading: ₹2,100\n• Palmistry: ₹1,500\n• Career Guidance: ₹2,500\n• Marriage Match: ₹3,100\n• Shubh Muhurat: ₹1,100\n• Vastu Consultation: ₹5,000\n• Navagraha Shanti Puja: ₹31,000\n• Rudrabhishek: ₹11,000\n\nWhich session would you like to book?";
      services = [
        { title: 'Kundli Reading', price: '₹2,100' },
        { title: 'Palmistry', price: '₹1,500' },
        { title: 'Career Guidance', price: '₹2,500' }
      ];
    }
    else if (/(kundli|birth chart|horoscope|janam patri)/i.test(text)) {
      reply = "Kundli Reading (₹2,100) provides a detailed analysis of your 12 houses, planetary placements, Dasha periods, and life predictions. Would you like to schedule a Kundli session?";
      services = [{ title: 'Kundli Reading', price: '₹2,100', category: 'Birth Chart Analysis' }];
    }
    else if (/(palmistry|palm|hand line|hast)/i.test(text)) {
      reply = "Palmistry (₹1,500) analyzes the lines, mounts, and signs on your hands to reveal your destiny, career, health, and major milestones. Would you like to book a Palmistry session?";
      services = [{ title: 'Palmistry', price: '₹1,500', category: 'Hand Line Analysis' }];
    }
    else if (/(career|job|business|profession|money)/i.test(text)) {
      reply = "Career Guidance (₹2,500) provides deep astrological analysis of your 10th house, Dasha periods, and planetary transits for job growth and financial success.";
      services = [{ title: 'Career Guidance', price: '₹2,500', category: 'Professional Growth' }];
    }
    else if (/(marriage|match|compatibility|wedding|shaadi|partner)/i.test(text)) {
      reply = "Marriage Match (₹3,100) evaluates 36 Guna Ashtakoot compatibility, Mangal Dosha checks, and planetary alignment for a prosperous married life.";
      services = [{ title: 'Marriage Match', price: '₹3,100', category: 'Matchmaking' }];
    }
    else if (/(puja|pooja|homa|havan|temple|ritual)/i.test(text)) {
      reply = "We perform 18+ authentic Vedic Pujas with complete Vidhi-Vidhan in our Bhind Temple Campus, including Navagraha Shanti Puja (₹31,000), Rudrabhishek (₹11,000), and Mangal Dosha Shanti (₹21,000).";
      services = [
        { title: 'Navagraha Shanti Puja', price: '₹31,000' },
        { title: 'Rudrabhishek', price: '₹11,000' }
      ];
    }
    else {
      reply = "Mannjyotish is led by Astrologer Ashay Krishn Goswami. We provide Kundli Reading, Palmistry, Career Guidance, Marriage Matchmaking, and 18+ Temple Pujas. Would you like to schedule an appointment with Ashay ji?";
      services = [
        { title: 'Kundli Reading', price: '₹2,100' },
        { title: 'General Consultation', price: 'Consultation' }
      ];
    }

    res.json({ success: true, reply, services });
  } catch (err) {
    console.error('AI chat API error:', err);
    res.status(500).json({ error: 'Failed to process message.' });
  }
});

// ─── Admin Bookings Endpoint ──────────────────────────────────────────────────
app.get('/api/admin/bookings', verifyToken, requireAdmin, (req, res) => {
  const bookings = readData('bookings.json');
  res.json({ success: true, data: bookings });
});

app.delete('/api/admin/bookings/:id', verifyToken, requireAdmin, (req, res) => {
  const bookings = readData('bookings.json');
  const filtered = bookings.filter(b => b.id !== req.params.id);
  writeData('bookings.json', filtered);
  res.json({ success: true });
});

// ─── DMR Chit Fund Local-First Management & Mock API Engine ──────────────────
const {
  parseChitFundData,
  buildReminderMessage,
  executeDispatch,
  getDispatchHistory,
  saveActiveExcelBuffer,
  resetToSampleExcel
} = require('./src/chitFundReminder');

const uploadExcel = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
  fileFilter: (req, file, cb) => {
    if (file.originalname.match(/\.(xlsx|xls|csv)$/i)) cb(null, true);
    else cb(new Error('Only Excel (.xlsx, .xls) or CSV files are allowed'));
  }
});

// 1. Get parsed data (Config, Subscribers with Paid/Pending Status, Summary Stats)
app.get('/api/chitfund/data', (req, res) => {
  try {
    const data = parseChitFundData();
    res.json({ success: true, ...data });
  } catch (err) {
    console.error('[ChitFund API Error]:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 2. Upload and parse new monthly Excel sheet
app.post('/api/chitfund/upload', uploadExcel.single('file'), (req, res) => {
  try {
    if (!req.file || !req.file.buffer) {
      return res.status(400).json({ success: false, error: 'No Excel file uploaded.' });
    }
    const data = saveActiveExcelBuffer(req.file.buffer);
    res.json({
      success: true,
      message: `Successfully loaded "${req.file.originalname}" (${data.subscribers.length} subscribers found)`,
      fileName: req.file.originalname,
      ...data
    });
  } catch (err) {
    console.error('[ChitFund Upload Error]:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 3. Reset back to original sample data
app.post('/api/chitfund/reset', (req, res) => {
  try {
    const data = resetToSampleExcel();
    res.json({ success: true, message: 'Reset to default sample Excel sheet', ...data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 4. Preview personalized WhatsApp reminder payload
app.post('/api/chitfund/preview', (req, res) => {
  try {
    const { subscriber, config } = req.body;
    if (!subscriber) return res.status(400).json({ success: false, error: 'Subscriber details required' });
    const rendered = buildReminderMessage(subscriber, config || { fundName: 'DMR CHIT FUND PVT LTD', batch: 'DST1C - 25 LAKHS', psoNumber: 'MM270826P567' });
    res.json({ success: true, rendered });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 5. Fire reminders via Mock BSP API (or live channels)
app.post('/api/chitfund/dispatch', async (req, res) => {
  try {
    const { subscriberIds, mode = 'mock', delayMs = 300 } = req.body;
    if (!subscriberIds || !Array.isArray(subscriberIds) || subscriberIds.length === 0) {
      return res.status(400).json({ success: false, error: 'No subscriber IDs provided for dispatch.' });
    }
    const result = await executeDispatch({ subscriberIds, mode, delayMs });
    res.json(result);
  } catch (err) {
    console.error('[ChitFund Dispatch Error]:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 6. Get dispatch history
app.get('/api/chitfund/history', (req, res) => {
  try {
    const history = getDispatchHistory();
    res.json({ success: true, history });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─── Start Server ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log('');
  console.log('╔══════════════════════════════════════════════════════╗');
  console.log('║     Mannjyotish API Server v2.0                      ║');
  console.log(`║     Running at http://localhost:${PORT}                  ║`);
  console.log('║     Engine: Swiss Ephemeris C Library (swisseph)     ║');
  console.log('║     Auth: Google OAuth 2.0 + JWT                     ║');
  console.log('╚══════════════════════════════════════════════════════╝');
  console.log('');
});
