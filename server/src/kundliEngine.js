/**
 * kundliEngine.js  — Full-precision Vedic astrology engine (Swiss Ephemeris)
 *
 * Provides:
 *  • All 9 Navagraha positions (sidereal, arc-second precision)
 *  • Lahiri Ayanamsha (SE_SIDM_LAHIRI)
 *  • Panchang: Tithi, Vara, Nakshatra, Yoga, Karana, Paksha, Moon phase
 *  • Lagna (Rashi) Chart — Whole Sign houses
 *  • Navamsa (D-9) Chart
 *  • Chandra Chart  — Whole Sign, Moon as ascendant
 *  • Chalit Chart   — Sripati (Bhava), Placidus cusps as Bhava Madhya
 *  • Lagna Gochar   — Today's transits from natal Lagna
 *  • Chandra Gochar — Today's transits from natal Moon sign
 *  • Vimshottari Dasha (accurate to the day)
 *  • Mangal Dosha, Kaal Sarp Dosha, Shani Sade Sati
 */

const swisseph = require('swisseph');
const path     = require('path');

// ─── Swiss Ephemeris Setup ────────────────────────────────────────────────────
swisseph.swe_set_ephe_path(path.join(__dirname, '../node_modules/swisseph/ephe'));
swisseph.swe_set_sid_mode(swisseph.SE_SIDM_LAHIRI, 0, 0);

const SE_FLAGS = swisseph.SEFLG_SIDEREAL | swisseph.SEFLG_SPEED;

// ─── Constants ────────────────────────────────────────────────────────────────
const PLANET_IDS = {
  Sun:     swisseph.SE_SUN,
  Moon:    swisseph.SE_MOON,
  Mars:    swisseph.SE_MARS,
  Mercury: swisseph.SE_MERCURY,
  Jupiter: swisseph.SE_JUPITER,
  Venus:   swisseph.SE_VENUS,
  Saturn:  swisseph.SE_SATURN,
  Rahu:    swisseph.SE_MEAN_NODE,
};

const PLANET_ORDER  = ['Sun','Moon','Mars','Mercury','Jupiter','Venus','Saturn','Rahu','Ketu'];
const PLANET_GLYPHS = { Sun:'☉',Moon:'☽',Mars:'♂',Mercury:'☿',Jupiter:'♃',Venus:'♀',Saturn:'♄',Rahu:'☊',Ketu:'☋' };
const PLANET_COLORS = { Sun:'#FFD700',Moon:'#C0C0C0',Mars:'#FF5555',Mercury:'#40E0D0',Jupiter:'#FFB347',Venus:'#FF9EC4',Saturn:'#AA77FF',Rahu:'#888888',Ketu:'#CD853F' };
const SIGN_LORDS    = { Mesha:'Mars',Vrishabha:'Venus',Mithuna:'Mercury',Karka:'Moon',Simha:'Sun',Kanya:'Mercury',Tula:'Venus',Vrishchika:'Mars',Dhanu:'Jupiter',Makara:'Saturn',Kumbha:'Saturn',Meena:'Jupiter' };

const SIGNS = ['Mesha','Vrishabha','Mithuna','Karka','Simha','Kanya','Tula','Vrishchika','Dhanu','Makara','Kumbha','Meena'];
const SIGN_ELEMENT   = { Mesha:'fire',Simha:'fire',Dhanu:'fire',Vrishabha:'earth',Kanya:'earth',Makara:'earth',Mithuna:'air',Tula:'air',Kumbha:'air',Karka:'water',Vrishchika:'water',Meena:'water' };
const NAVAMSA_START  = { fire:0, earth:9, air:6, water:3 };
const NAKSHATRA_SPAN = 360 / 27;

const HOUSE_SIGNIFICANCE = [
  'Self & Personality','Wealth & Family','Communication & Siblings',
  'Home & Mother','Children & Creativity','Health & Service',
  'Marriage & Partnerships','Longevity & Transformation','Dharma & Higher Learning',
  'Career & Fame','Gains & Aspirations','Spirituality & Liberation',
];

// ─── Panchang Tables ─────────────────────────────────────────────────────────
const NAKSHATRAS = [
  {name:'Ashwini',lord:'Ketu'},{name:'Bharani',lord:'Venus'},{name:'Krittika',lord:'Sun'},
  {name:'Rohini',lord:'Moon'},{name:'Mrigashirsha',lord:'Mars'},{name:'Ardra',lord:'Rahu'},
  {name:'Punarvasu',lord:'Jupiter'},{name:'Pushya',lord:'Saturn'},{name:'Ashlesha',lord:'Mercury'},
  {name:'Magha',lord:'Ketu'},{name:'Purva Phalguni',lord:'Venus'},{name:'Uttara Phalguni',lord:'Sun'},
  {name:'Hasta',lord:'Moon'},{name:'Chitra',lord:'Mars'},{name:'Swati',lord:'Rahu'},
  {name:'Vishakha',lord:'Jupiter'},{name:'Anuradha',lord:'Saturn'},{name:'Jyeshtha',lord:'Mercury'},
  {name:'Mula',lord:'Ketu'},{name:'Purva Ashadha',lord:'Venus'},{name:'Uttara Ashadha',lord:'Sun'},
  {name:'Shravana',lord:'Moon'},{name:'Dhanishta',lord:'Mars'},{name:'Shatabhisha',lord:'Rahu'},
  {name:'Purva Bhadrapada',lord:'Jupiter'},{name:'Uttara Bhadrapada',lord:'Saturn'},{name:'Revati',lord:'Mercury'},
];

const TITHIS = [
  'Pratipada','Dvitiya','Tritiya','Chaturthi','Panchami',
  'Shashthi','Saptami','Ashtami','Navami','Dashami',
  'Ekadashi','Dwadashi','Trayodashi','Chaturdashi','Purnima',  // Shukla 1-15
  'Pratipada','Dvitiya','Tritiya','Chaturthi','Panchami',
  'Shashthi','Saptami','Ashtami','Navami','Dashami',
  'Ekadashi','Dwadashi','Trayodashi','Chaturdashi','Amavasya', // Krishna 1-15
];

const VARAS      = ['Ravivara (Sunday)','Somavara (Monday)','Mangalavara (Tuesday)','Budhavara (Wednesday)','Guruvara (Thursday)','Shukravara (Friday)','Shanivara (Saturday)'];
const VARA_LORDS = ['Sun','Moon','Mars','Mercury','Jupiter','Venus','Saturn'];
const VARA_SHORT = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

const YOGAS = [
  'Vishkambha','Preeti','Ayushman','Saubhagya','Shobhana',
  'Atiganda','Sukarman','Dhriti','Shoola','Ganda',
  'Vriddhi','Dhruva','Vyaghata','Harshana','Vajra',
  'Siddhi','Vyatipata','Variyan','Parigha','Shiva',
  'Siddha','Sadhya','Shubha','Shukla','Brahma',
  'Indra','Vaidhriti',
];

const MOVABLE_KARANAS = ['Bava','Balava','Kaulava','Taitila','Gara','Vanija','Vishti/Bhadra'];

// ─── Dasha Data ───────────────────────────────────────────────────────────────
const DASHA_YEARS = { Ketu:7,Venus:20,Sun:6,Moon:10,Mars:7,Rahu:18,Jupiter:16,Saturn:19,Mercury:17 };
const DASHA_ORDER = ['Ketu','Venus','Sun','Moon','Mars','Rahu','Jupiter','Saturn','Mercury'];

// ─── Utilities ────────────────────────────────────────────────────────────────
const norm       = lon => ((lon % 360) + 360) % 360;
const signOf     = lon => SIGNS[Math.floor(norm(lon) / 30)];
const signIdxOf  = lon => Math.floor(norm(lon) / 30);
const degInSign  = lon => norm(lon) % 30;

function degToStr(deg) {
  const d = Math.floor(deg);
  const m = Math.floor((deg - d) * 60);
  const s = Math.round(((deg - d) * 60 - m) * 60);
  return `${d}°${String(m).padStart(2,'0')}'${String(s).padStart(2,'0')}"`;
}

// ─── Fetch planet positions from Swiss Ephemeris ──────────────────────────────
function getPlanets(jd) {
  const raw = {};
  for (const [name, id] of Object.entries(PLANET_IDS)) {
    const r = swisseph.swe_calc_ut(jd, id, SE_FLAGS);
    if (r.error) throw new Error(`SwissEph [${name}]: ${r.error}`);
    raw[name] = { longitude: norm(r.longitude), latitude: r.latitude, speed: r.longitudeSpeed, isRetrograde: r.longitudeSpeed < 0 };
  }
  raw.Ketu = { longitude: norm(raw.Rahu.longitude + 180), latitude: -raw.Rahu.latitude, speed: -raw.Rahu.speed, isRetrograde: false };
  return raw;
}

// ─── Navamsa (D-9) sign for a given longitude ────────────────────────────────
function getNavamsaSign(lon) {
  const sIdx    = Math.floor(norm(lon) / 30);
  const degInS  = norm(lon) % 30;
  const navNum  = Math.floor(degInS / (30 / 9));
  return SIGNS[(NAVAMSA_START[SIGN_ELEMENT[SIGNS[sIdx]]] + navNum) % 12];
}

// ─── Build Whole Sign houses ──────────────────────────────────────────────────
function buildWholeSignHouses(lagnaSignIdx, rawPlanets, label = '') {
  const houses = Array.from({ length: 12 }, (_, i) => ({
    number: i + 1,
    sign: SIGNS[(lagnaSignIdx + i) % 12],
    significance: HOUSE_SIGNIFICANCE[i],
    planets: [],
  }));
  for (const planet of PLANET_ORDER) {
    if (!rawPlanets[planet]) continue;
    const hi = (signIdxOf(rawPlanets[planet].longitude) - lagnaSignIdx + 12) % 12;
    houses[hi].planets.push(planet);
  }
  return houses;
}

// ─── Chalit (Sripati Bhava) chart ────────────────────────────────────────────
// Placidus cusps = Bhava Madhya; midpoints between cusps = Bhava Sandhis
// A planet belongs to Bhava N if it lies between Sandhi(N-1,N) and Sandhi(N,N+1)
function buildChalitChart(jd, lat, lon, ayanamsha, rawPlanets) {
  // Get Placidus cusp longitudes (tropical)
  const hr      = swisseph.swe_houses(jd, lat, lon, 'P');
  // hr.house is [cusp1, cusp2, ..., cusp12] (tropical)
  const cusps   = hr.house.map(c => norm(c - ayanamsha)); // convert to sidereal

  // Compute Bhava Sandhis: midpoint of consecutive cusps (circular arithmetic)
  const sandhis = cusps.map((c, i) => {
    const next = cusps[(i + 1) % 12];
    let mid = (c + next) / 2;
    if (next < c) mid = norm((c + next + 360) / 2); // handle wrap
    return norm(mid);
  });

  const houses = Array.from({ length: 12 }, (_, i) => ({
    number: i + 1,
    sign: signOf(cusps[i]),      // sign of Bhava Madhya
    cuspDegree: degToStr(degInSign(cusps[i])),
    significance: HOUSE_SIGNIFICANCE[i],
    planets: [],
  }));

  for (const planet of PLANET_ORDER) {
    if (!rawPlanets[planet]) continue;
    const pLon = rawPlanets[planet].longitude;
    // Find which Bhava this planet belongs to
    for (let i = 0; i < 12; i++) {
      const start = sandhis[(i + 11) % 12]; // sandhi before this bhava
      const end   = sandhis[i];             // sandhi after this bhava
      let inBhava;
      if (start <= end) {
        inBhava = pLon >= start && pLon < end;
      } else { // wraps around 0°
        inBhava = pLon >= start || pLon < end;
      }
      if (inBhava) { houses[i].planets.push(planet); break; }
    }
  }
  return houses;
}

// ─── Panchang Calculation ─────────────────────────────────────────────────────
function calculatePanchang(sunLon, moonLon, jd) {
  // Tithi
  const diff       = norm(moonLon - sunLon);
  const tithiIdx   = Math.min(29, Math.floor(diff / 12));
  const tithiNum   = tithiIdx + 1;
  const paksha     = tithiIdx < 15 ? 'Shukla Paksha' : 'Krishna Paksha';
  const tithiName  = TITHIS[tithiIdx];
  const tithiPct   = ((diff / 12) - tithiIdx) * 100; // % completed

  // Vara (day-of-week from Julian Day)
  const varaIdx    = Math.floor((jd + 1.5) % 7);
  const vara       = VARAS[varaIdx];
  const varaLord   = VARA_LORDS[varaIdx];

  // Nakshatra (from Moon)
  const nakIdx     = Math.floor(moonLon / NAKSHATRA_SPAN);
  const nakData    = NAKSHATRAS[nakIdx];
  const degInNak   = moonLon - nakIdx * NAKSHATRA_SPAN;
  const pada       = Math.floor(degInNak / (NAKSHATRA_SPAN / 4)) + 1;
  const nakPct     = (degInNak / NAKSHATRA_SPAN) * 100;

  // Yoga
  const yogaSum    = (sunLon + moonLon) % 360;
  const yogaIdx    = Math.floor(yogaSum / (360 / 27));
  const yoga       = YOGAS[yogaIdx] || '—';

  // Karana
  const ht         = Math.floor(diff / 6); // half-tithi index 0-59
  let karana;
  if (ht === 0)            karana = 'Kimstughna';
  else if (ht >= 1 && ht <= 56) karana = MOVABLE_KARANAS[(ht - 1) % 7];
  else if (ht === 57)      karana = 'Shakuni';
  else if (ht === 58)      karana = 'Chatushpada';
  else                     karana = 'Naga';

  // Moon phase
  const illumination = Math.round(((1 - Math.cos((diff * Math.PI) / 180)) / 2) * 100);
  const moonPhase = diff < 180 ? `Waxing (${illumination}% lit)` : `Waning (${illumination}% lit)`;

  // Rahu Kaal (position 1-8 in daytime, 1/8 daytime each)
  const RAHU_KAAL_POS = [8, 2, 7, 5, 6, 4, 3, 1]; // Sun to Sat
  const rahukaalPos   = RAHU_KAAL_POS[varaIdx];
  const rahukaalStart = `${5 + Math.floor((rahukaalPos - 1) * 1.5)}:${((rahukaalPos - 1) * 90) % 60 === 0 ? '00' : '30'} AM approx`;

  return {
    tithi:      `${tithiName} (${tithiNum}/30)`,
    tithiNum,
    tithiPct:   tithiPct.toFixed(1),
    paksha,
    vara,
    varaLord,
    nakshatra:  nakData.name,
    nakshatraPada: pada,
    nakshatraLord: nakData.lord,
    nakshatraPct: nakPct.toFixed(1),
    yoga,
    karana,
    moonPhase,
    rahuKaal:   rahukaalStart,
  };
}

// ─── Vimshottari Dasha ────────────────────────────────────────────────────────
function calcVimshottariDasha(moonLon, birthDate) {
  const nakIdx      = Math.floor(moonLon / NAKSHATRA_SPAN);
  const lord        = NAKSHATRAS[nakIdx].lord;
  const startIdx    = DASHA_ORDER.indexOf(lord);
  const fracElapsed = (moonLon - nakIdx * NAKSHATRA_SPAN) / NAKSHATRA_SPAN;
  const currentMs   = DASHA_YEARS[lord] * 365.25 * 24 * 3600 * 1000;
  let   cursor      = new Date(birthDate.getTime() - fracElapsed * currentMs);
  const dashas      = [];
  for (let i = 0; i < 9; i++) {
    const dl  = DASHA_ORDER[(startIdx + i) % 9];
    const ms  = DASHA_YEARS[dl] * 365.25 * 24 * 3600 * 1000;
    const s   = new Date(cursor.getTime());
    const e   = new Date(cursor.getTime() + ms);
    dashas.push({ lord: dl, years: DASHA_YEARS[dl], color: PLANET_COLORS[dl], start: s, end: e });
    cursor = e;
  }
  return dashas;
}

// ─── Dosha Detection ─────────────────────────────────────────────────────────
function detectDoshas(raw, lagnaSignIdx) {
  const doshas = {};

  // Mangal Dosha
  const MANGAL_HOUSES = [1,2,4,7,8,12];
  const marsSignIdx   = signIdxOf(raw.Mars?.longitude || 0);
  const marsHouse     = (marsSignIdx - lagnaSignIdx + 12) % 12 + 1;
  const mangalPresent = MANGAL_HOUSES.includes(marsHouse);
  doshas.mangal = {
    present: mangalPresent,
    marsHouse,
    description: mangalPresent
      ? `Mars occupies house ${marsHouse} from Lagna — Mangal Dosha is present. Mangal puja on Tuesdays, red coral (after expert consultation), donate red lentils.`
      : `Mars in house ${marsHouse} — No Mangal Dosha.`,
  };

  // Kaal Sarp Dosha
  const rahuLon = raw.Rahu?.longitude || 0;
  const ketuLon = norm(rahuLon + 180);
  const allHemmed = ['Sun','Moon','Mars','Mercury','Jupiter','Venus','Saturn'].every(p => {
    if (!raw[p]) return true;
    const pLon = raw[p].longitude;
    return rahuLon < ketuLon ? (pLon > rahuLon && pLon < ketuLon) : (pLon > rahuLon || pLon < ketuLon);
  });
  doshas.kaalSarp = {
    present: allHemmed,
    description: allHemmed
      ? 'Kaal Sarp Dosha — all planets hemmed between Rahu and Ketu. Rahu-Ketu puja, Naag Panchami rituals, Naag Stotra recitation.'
      : 'No Kaal Sarp Dosha.',
  };

  // Shani Sade Sati
  const moonSIdx   = signIdxOf(raw.Moon?.longitude || 0);
  const saturnSIdx = signIdxOf(raw.Saturn?.longitude || 0);
  const diff2      = (saturnSIdx - moonSIdx + 12) % 12;
  const inSadeSati = diff2 === 0 || diff2 === 1 || diff2 === 11;
  doshas.sadeSati  = {
    present: inSadeSati,
    description: inSadeSati
      ? 'Shani Sade Sati active — Saturn near natal Moon. Shani puja, black sesame on Saturdays, Shani stotra recitation.'
      : 'No Shani Sade Sati influence.',
  };

  return doshas;
}

// ─── Format planet list ───────────────────────────────────────────────────────
function formatPlanets(raw, lagnaSignIdx) {
  return PLANET_ORDER.map(name => {
    const p = raw[name]; if (!p) return null;
    const deg      = degInSign(p.longitude);
    const houseNum = (signIdxOf(p.longitude) - lagnaSignIdx + 12) % 12 + 1;
    const sign     = signOf(p.longitude);
    const nakIdx   = Math.floor(p.longitude / NAKSHATRA_SPAN);
    const nakData  = NAKSHATRAS[nakIdx] || { name: '—', lord: '—' };
    return {
      name, glyph: PLANET_GLYPHS[name], color: PLANET_COLORS[name],
      longitude: p.longitude, sign,
      signLord: SIGN_LORDS[sign] || '—',
      degree: deg.toFixed(2), degreeStr: degToStr(deg),
      house: houseNum, isRetrograde: p.isRetrograde,
      nakshatra: nakData.name,
      nakshatraLord: nakData.lord,
      navamsaSign: getNavamsaSign(p.longitude),
    };
  }).filter(Boolean);
}

// ─── Gochar (current transit) chart positions ─────────────────────────────────
function calcGocharPositions(gocharRaw, anchorSignIdx) {
  const houses = Array.from({ length: 12 }, (_, i) => ({
    number: i + 1,
    sign: SIGNS[(anchorSignIdx + i) % 12],
    significance: HOUSE_SIGNIFICANCE[i],
    planets: [],
  }));
  for (const planet of PLANET_ORDER) {
    if (!gocharRaw[planet]) continue;
    const hi = (signIdxOf(gocharRaw[planet].longitude) - anchorSignIdx + 12) % 12;
    houses[hi].planets.push(planet);
  }
  return houses;
}

// ─── MAIN EXPORT ──────────────────────────────────────────────────────────────
function calculateKundali(utcDate, lat, lon) {
  // ── Julian Day ───────────────────────────────────────────────────────────
  const jd = swisseph.swe_julday(
    utcDate.getUTCFullYear(), utcDate.getUTCMonth() + 1, utcDate.getUTCDate(),
    utcDate.getUTCHours() + utcDate.getUTCMinutes() / 60 + utcDate.getUTCSeconds() / 3600,
    swisseph.SE_GREG_CAL
  );

  // ── Ayanamsha ────────────────────────────────────────────────────────────
  const ayanamsha = swisseph.swe_get_ayanamsa_ut(jd);

  // ── Birth planets ────────────────────────────────────────────────────────
  const raw = getPlanets(jd);

  // ── Ascendant (sidereal from Placidus) ────────────────────────────────────
  const hr          = swisseph.swe_houses(jd, lat, lon, 'P');
  const siderealAsc = norm(hr.ascendant - ayanamsha);
  const lagnaSignIdx= signIdxOf(siderealAsc);

  // ── Moon data ────────────────────────────────────────────────────────────
  const moonLon      = raw.Moon.longitude;
  const moonSignIdx  = signIdxOf(moonLon);
  const nakIdx       = Math.floor(moonLon / NAKSHATRA_SPAN);
  const nakData      = NAKSHATRAS[nakIdx];
  const degInNak     = moonLon - nakIdx * NAKSHATRA_SPAN;
  const pada         = Math.floor(degInNak / (NAKSHATRA_SPAN / 4)) + 1;

  // ── All chart types ───────────────────────────────────────────────────────
  const lagnaChart   = buildWholeSignHouses(lagnaSignIdx,  raw);
  const chandraChart = buildWholeSignHouses(moonSignIdx,   raw, 'Chandra');
  const chalitChart  = buildChalitChart(jd, lat, lon, ayanamsha, raw);

  // Navamsa chart (D-9) — built relative to the actual Navamsa Lagna, not fixed to Aries
  const navamsaLagnaSign  = getNavamsaSign(siderealAsc);
  const navamsaLagnaIdx   = SIGNS.indexOf(navamsaLagnaSign);
  const navamsaChart = Array.from({ length: 12 }, (_, i) => ({
    number: i + 1,
    sign: SIGNS[(navamsaLagnaIdx + i) % 12],
    planets: [],
  }));

  // ── Format planets with navamsa ───────────────────────────────────────────
  const planets = formatPlanets(raw, lagnaSignIdx);
  planets.forEach(p => {
    const pIdx = SIGNS.indexOf(p.navamsaSign);
    if (pIdx < 0) return;
    const houseIdx = (pIdx - navamsaLagnaIdx + 12) % 12;
    navamsaChart[houseIdx].planets.push(p.name);
  });

  // ── Panchang ─────────────────────────────────────────────────────────────
  const panchang = calculatePanchang(raw.Sun.longitude, moonLon, jd);

  // ── Dasha ────────────────────────────────────────────────────────────────
  const dashas = calcVimshottariDasha(moonLon, utcDate);

  // ── Doshas ───────────────────────────────────────────────────────────────
  const doshas = detectDoshas(raw, lagnaSignIdx);

  // ── Today's Gochar positions (current transits) ───────────────────────────
  const todayJd  = swisseph.swe_julday(
    ...(() => {
      const n = new Date();
      return [n.getUTCFullYear(), n.getUTCMonth()+1, n.getUTCDate(),
              n.getUTCHours() + n.getUTCMinutes()/60];
    })(),
    swisseph.SE_GREG_CAL
  );
  swisseph.swe_set_sid_mode(swisseph.SE_SIDM_LAHIRI, 0, 0); // ensure mode
  const gocharRaw   = getPlanets(todayJd);
  const lagnaGochar = calcGocharPositions(gocharRaw, lagnaSignIdx);
  const chandraGochar = calcGocharPositions(gocharRaw, moonSignIdx);

  // Today's transit planet details (for the Gochar page header)
  const gocharPlanets = formatPlanets(gocharRaw, lagnaSignIdx);

  // Ascendant row for debug table
  const ascNakIdx  = Math.floor(siderealAsc / NAKSHATRA_SPAN);
  const ascNakData = NAKSHATRAS[ascNakIdx] || { name: '—', lord: '—' };
  const ascSign    = SIGNS[lagnaSignIdx];

  return {
    julianDay:       jd.toFixed(5),
    ayanamsha:       ayanamsha.toFixed(6),
    ascendant:       ascSign,
    ascendantDegree: (siderealAsc % 30).toFixed(2),
    ascendantStr:    degToStr(siderealAsc % 30),
    moonSign:        signOf(moonLon),
    nakshatra:       nakData.name,
    nakshatraPada:   pada,
    nakshatraLord:   nakData.lord,
    panchang,
    planets,
    lagnaChart,
    navamsaChart,
    chandraChart,
    chalitChart,
    lagnaGochar,
    chandraGochar,
    gocharPlanets,
    dashas,
    doshas,
    navamsaAscendant: navamsaLagnaSign,
    ascendantData: {
      name: 'ASCENDANT',
      sign: ascSign,
      signLord: SIGN_LORDS[ascSign] || '—',
      degree: (siderealAsc % 30).toFixed(2),
      degreeStr: degToStr(siderealAsc % 30),
      house: 1,
      isRetrograde: false,
      nakshatra: ascNakData.name,
      nakshatraLord: ascNakData.lord,
    },
  };
}

module.exports = { calculateKundali };

// ─── Matchmaking ─────────────────────────────────────────────────────────────
const { calculateAshtakoot } = require('./ashtakoot');

function calculateMatch(boyUtc, boyLat, boyLon, girlUtc, girlLat, girlLon) {
  const boyKundli = calculateKundali(boyUtc, boyLat, boyLon);
  const girlKundli = calculateKundali(girlUtc, girlLat, girlLon);

  const ashtakoot = calculateAshtakoot(
    boyKundli.moonSign, boyKundli.nakshatra,
    girlKundli.moonSign, girlKundli.nakshatra
  );

  const boyManglik = boyKundli.doshas.mangal?.present || false;
  const girlManglik = girlKundli.doshas.mangal?.present || false;
  const manglikMatch = boyManglik === girlManglik; // Both Manglik or both non-Manglik is a match

  // Determine Rajjoo and Vedha based on score/nadi
  const rajjooDosha = ashtakoot.kootas.find(k => k.attribute === 'Nadi').received === 0;
  const vedhaDosha = ashtakoot.kootas.find(k => k.attribute === 'Yoni').received === 0;

  return {
    boy: {
      moonSign: boyKundli.moonSign,
      moonSignLord: require("./ashtakoot").SIGN_LORDS?.[ boyKundli.moonSign ] || "",
      nakshatra: boyKundli.nakshatra,
      nakshatraLord: boyKundli.nakshatraLord,
      isManglik: boyKundli.doshas.mangal?.present || false,
    },
    girl: {
      moonSign: girlKundli.moonSign,
      moonSignLord: require("./ashtakoot").SIGN_LORDS?.[ girlKundli.moonSign ] || "",
      nakshatra: girlKundli.nakshatra,
      nakshatraLord: girlKundli.nakshatraLord,
      isManglik: girlKundli.doshas.mangal?.present || false,
    },
    ashtakoot,
    manglikMatch,
    rajjooDosha,
    vedhaDosha
  };
}

module.exports = { calculateKundali, calculateMatch };
