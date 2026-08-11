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

const app = express();
const PORT = process.env.PORT || 3001;

// ─── Config ──────────────────────────────────────────────────────────────────
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'mannjyotishashay@gmail.com';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
const GOOGLE_CALLBACK_URL = process.env.GOOGLE_CALLBACK_URL || `${FRONTEND_URL}/api/auth/google/callback`;
const RESEND_API_KEY = process.env.RESEND_API_KEY || 're_dummy_key_for_development';
const GCAL_REFRESH_TOKEN = process.env.GCAL_REFRESH_TOKEN;

const resend = new Resend(RESEND_API_KEY);

// ─── Google Calendar API Client ───────────────────────────────────────────────
const gcalAuth = new google.auth.OAuth2(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  'http://localhost:4000/oauth2callback'
);
gcalAuth.setCredentials({ refresh_token: GCAL_REFRESH_TOKEN });
const gcal = google.calendar({ version: 'v3', auth: gcalAuth });

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

  const event = await gcal.events.insert({
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
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Only image files are allowed'));
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
    const users = readData('users.json');

    let user = users.find(u => u.googleId === profile.id);
    if (!user) {
      // New user — check if this is the admin email
      user = {
        id: uuidv4(),
        googleId: profile.id,
        name: profile.displayName,
        email: email,
        picture: profile.photos?.[0]?.value || '',
        role: email === ADMIN_EMAIL ? 'admin' : 'user',
        registeredAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
      };
      users.push(user);
    } else {
      // Existing user — update last login & picture
      user.lastLoginAt = new Date().toISOString();
      user.picture = profile.photos?.[0]?.value || user.picture;
      // Ensure admin stays admin
      if (email === ADMIN_EMAIL) user.role = 'admin';
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
  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
    return res.redirect(`${FRONTEND_URL}/?auth=failed`);
  }
  passport.authenticate('google', { session: false, failureRedirect: `${FRONTEND_URL}/?auth=failed` })(req, res, (err) => {
    if (err) return res.redirect(`${FRONTEND_URL}/?auth=failed`);
    const user = req.user;
    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name, picture: user.picture, role: user.role },
      JWT_SECRET,
      { expiresIn: '30d' }
    );
    res.redirect(`${FRONTEND_URL}/?token=${token}`);
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
      reports.unshift({ id: uuidv4(), type: 'kundali', name, email: req.body.email || null, generatedAt: new Date().toISOString() });
      writeData('reports.json', reports.slice(0, 500));
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
  res.json({ success: true, data: gallery });
});

app.post('/api/gallery', verifyToken, requireAdmin, upload.single('image'), (req, res) => {
  const gallery = readData('gallery.json');
  const { title, description } = req.body;
  const newPost = {
    id: uuidv4(),
    title: title || 'Untitled',
    description: description || '',
    image: req.file ? `/uploads/${req.file.filename}` : '',
    createdAt: new Date().toISOString(),
  };
  gallery.unshift(newPost);
  writeData('gallery.json', gallery);
  res.json({ success: true, data: newPost });
});

app.put('/api/gallery/:id', verifyToken, requireAdmin, upload.single('image'), (req, res) => {
  const gallery = readData('gallery.json');
  const idx = gallery.findIndex(g => g.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  gallery[idx] = {
    ...gallery[idx],
    title: req.body.title || gallery[idx].title,
    description: req.body.description !== undefined ? req.body.description : gallery[idx].description,
    image: req.file ? `/uploads/${req.file.filename}` : gallery[idx].image,
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

// ─── Admin: Users ─────────────────────────────────────────────────────────────
app.get('/api/admin/users', verifyToken, requireAdmin, (req, res) => {
  const users = readData('users.json');
  // Never expose googleId
  const safe = users.map(({ googleId, ...u }) => u);
  res.json({ success: true, data: safe });
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

    res.json({ success: true, booking: newBooking, googleCalendarUrl: gCalUrl });
  } catch (err) {
    console.error('Booking endpoint error:', err);
    res.status(500).json({ error: 'Failed to record booking.' });
  }
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
