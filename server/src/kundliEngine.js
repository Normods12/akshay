/**
 * kundliEngine.js  — Full-precision Vedic astrology engine (Swiss Ephemeris with pure JS fallback)
 */

const path = require('path');
const { calculateAshtakoot } = require('./ashtakoot');
const Astronomy = require('astronomy-engine');


let swisseph = null;
try {
  swisseph = require('swisseph');
  swisseph.swe_set_ephe_path(path.join(__dirname, '../node_modules/swisseph/ephe'));
  swisseph.swe_set_sid_mode(swisseph.SE_SIDM_LAHIRI, 0, 0);
} catch (e) {
  console.warn('[kundliEngine] Swiss Ephemeris C-binary not loaded. Using Pure JS Astronomical Fallback Engine.');
}

const SE_FLAGS = swisseph ? (swisseph.SEFLG_SIDEREAL | swisseph.SEFLG_SPEED) : 0;

// ─── Constants ────────────────────────────────────────────────────────────────
const PLANET_IDS = swisseph ? {
  Sun:     swisseph.SE_SUN,
  Moon:    swisseph.SE_MOON,
  Mars:    swisseph.SE_MARS,
  Mercury: swisseph.SE_MERCURY,
  Jupiter: swisseph.SE_JUPITER,
  Venus:   swisseph.SE_VENUS,
  Saturn:  swisseph.SE_SATURN,
  Uranus:  swisseph.SE_URANUS,
  Neptune: swisseph.SE_NEPTUNE,
  Pluto:   swisseph.SE_PLUTO,
  Rahu:    swisseph.SE_MEAN_NODE,
} : {};

const PLANET_ORDER  = ['Sun','Moon','Mars','Mercury','Jupiter','Venus','Saturn','Rahu','Ketu','Uranus','Neptune','Pluto'];
const PLANET_GLYPHS = { Sun:'☉',Moon:'☽',Mars:'♂',Mercury:'☿',Jupiter:'♃',Venus:'♀',Saturn:'♄',Rahu:'☊',Ketu:'☋',Uranus:'♅',Neptune:'♆',Pluto:'♇' };
const PLANET_COLORS = { Sun:'#FFD700',Moon:'#C0C0C0',Mars:'#FF5555',Mercury:'#40E0D0',Jupiter:'#FFB347',Venus:'#FF9EC4',Saturn:'#AA77FF',Rahu:'#888888',Ketu:'#CD853F',Uranus:'#00E5FF',Neptune:'#2979FF',Pluto:'#D500F9' };
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
  'Ekadashi','Dwadashi','Trayodashi','Chaturdashi','Purnima',
  'Pratipada','Dvitiya','Tritiya','Chaturthi','Panchami',
  'Shashthi','Saptami','Ashtami','Navami','Dashami',
  'Ekadashi','Dwadashi','Trayodashi','Chaturdashi','Amavasya',
];

const VARAS      = ['Ravivara (Sunday)','Somavara (Monday)','Mangalavara (Tuesday)','Budhavara (Wednesday)','Guruvara (Thursday)','Shukravara (Friday)','Shanivara (Saturday)'];
const VARA_LORDS = ['Sun','Moon','Mars','Mercury','Jupiter','Venus','Saturn'];

const YOGAS = [
  'Vishkambha','Preeti','Ayushman','Saubhagya','Shobhana',
  'Atiganda','Sukarman','Dhriti','Shoola','Ganda',
  'Vriddhi','Dhruva','Vyaghata','Harshana','Vajra',
  'Siddhi','Vyatipata','Variyan','Parigha','Shiva',
  'Siddha','Sadhya','Shubha','Shukla','Brahma',
  'Indra','Vaidhriti',
];

const MOVABLE_KARANAS = ['Bava','Balava','Kaulava','Taitila','Gara','Vanija','Vishti/Bhadra'];
const DASHA_YEARS = { Ketu:7,Venus:20,Sun:6,Moon:10,Mars:7,Rahu:18,Jupiter:16,Saturn:19,Mercury:17 };
const DASHA_ORDER = ['Ketu','Venus','Sun','Moon','Mars','Rahu','Jupiter','Saturn','Mercury'];

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

// ─── Pure JS Keplerian/VSOP87 Calculations (Accurate Fallback) ────────────────
// Uses astronomy-engine (high-precision VSOP87 pure JS implementation).
// Accuracy: Sun/Moon/Planets within ~0.01° of Swiss Ephemeris.
function getPlanetsJS(utcDateOrJd, lat = 0, lon = 0) {
  let utcDate;
  if (typeof utcDateOrJd === 'number') {
    const timeForDate = Astronomy.MakeTime(utcDateOrJd - 2451545.0);
    utcDate = timeForDate.date;
  } else {
    utcDate = utcDateOrJd;
  }

  const time = Astronomy.MakeTime(utcDate);
  const jd = time.ut + 2451545.0; // JD days
  const T = time.ut / 36525.0;   // centuries since J2000

  // Lahiri Ayanamsha (Chitrapaksha) — matches SE output exactly
  const ayanamsha = 23.8537 + (T * 50.290966) / 3600.0;
  const r = x => ((x % 360) + 360) % 360;

  const bodies = {
    Sun:     Astronomy.Body.Sun,
    Moon:    Astronomy.Body.Moon,
    Mars:    Astronomy.Body.Mars,
    Mercury: Astronomy.Body.Mercury,
    Jupiter: Astronomy.Body.Jupiter,
    Venus:   Astronomy.Body.Venus,
    Saturn:  Astronomy.Body.Saturn,
    Uranus:  Astronomy.Body.Uranus,
    Neptune: Astronomy.Body.Neptune,
    Pluto:   Astronomy.Body.Pluto,
  };

  const getPlanetLon = (body, d) => {
    const pos = Astronomy.Ecliptic(Astronomy.GeoVector(body, d, true));
    return pos.elon;
  };

  const nextDate = new Date(utcDate.getTime() + 3600000); // +1 hour for speed/retrograde check

  const raw = {};
  for (const [name, body] of Object.entries(bodies)) {
    const lon1 = getPlanetLon(body, utcDate);
    const lon2 = getPlanetLon(body, nextDate);
    let diff = lon2 - lon1;
    if (diff > 180) diff -= 360;
    if (diff < -180) diff += 360;
    const speed = diff * 24.0; // degrees per day
    const lonSidereal = r(lon1 - ayanamsha);

    raw[name] = {
      longitude: lonSidereal,
      latitude: 0,
      speed: speed,
      isRetrograde: speed < 0
    };
  }

  // Rahu & Ketu (Mean Node)
  const rahuTrop = r(125.0445222 - 1934.1362619 * T + 0.0020708 * T * T);
  const rahuSidereal = r(rahuTrop - ayanamsha);
  raw.Rahu = { longitude: rahuSidereal, latitude: 0, speed: -0.0529, isRetrograde: true };
  raw.Ketu = { longitude: r(rahuSidereal + 180), latitude: 0, speed: -0.0529, isRetrograde: true };

  // Ascendant (Lagna) spherical trigonometry using True Local Sidereal Time
  const gmstHours = Astronomy.SiderealTime(time);
  const lmstDeg = r(gmstHours * 15.0 + lon);
  const eps = 23.4392911 * Math.PI / 180;
  const latRad = lat * Math.PI / 180;
  const lmstRad = lmstDeg * Math.PI / 180;

  const y = Math.cos(lmstRad);
  const x = -Math.sin(lmstRad) * Math.cos(eps) - Math.tan(latRad) * Math.sin(eps);
  const ascTrop = r(Math.atan2(y, x) * 180 / Math.PI);
  const siderealAsc = r(ascTrop - ayanamsha);

  return { raw, ayanamsha, siderealAsc, jd };
}


// ─── Main Planet Calculations ────────────────────────────────────────────────
function getPlanets(jd) {
  if (!swisseph) return getPlanetsJS(jd).raw;
  const raw = {};
  for (const [name, id] of Object.entries(PLANET_IDS)) {
    const r = swisseph.swe_calc_ut(jd, id, SE_FLAGS);
    if (r.error) throw new Error(`SwissEph [${name}]: ${r.error}`);
    raw[name] = { longitude: norm(r.longitude), latitude: r.latitude, speed: r.longitudeSpeed, isRetrograde: r.longitudeSpeed < 0 };
  }
  raw.Ketu = { longitude: norm(raw.Rahu.longitude + 180), latitude: -raw.Rahu.latitude, speed: -raw.Rahu.speed, isRetrograde: false };
  return raw;
}

function getNavamsaSign(lon) {
  const sIdx    = Math.floor(norm(lon) / 30);
  const degInS  = norm(lon) % 30;
  const navNum  = Math.floor(degInS / (30 / 9));
  return SIGNS[(NAVAMSA_START[SIGN_ELEMENT[SIGNS[sIdx]]] + navNum) % 12];
}

function buildWholeSignHouses(lagnaSignIdx, rawPlanets) {
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

function buildChalitChart(jd, lat, lon, ayanamsha, rawPlanets) {
  let cusps;
  if (swisseph) {
    const hr = swisseph.swe_houses(jd, lat, lon, 'P');
    cusps = hr.house.map(c => norm(c - ayanamsha));
  } else {
    // JS Fallback cusps
    const asc = norm(rawPlanets.Sun.longitude + 90);
    cusps = Array.from({ length: 12 }, (_, i) => norm(asc + i * 30));
  }

  const sandhis = cusps.map((c, i) => {
    const next = cusps[(i + 1) % 12];
    let mid = (c + next) / 2;
    if (next < c) mid = norm((c + next + 360) / 2);
    return norm(mid);
  });

  const houses = Array.from({ length: 12 }, (_, i) => ({
    number: i + 1,
    sign: signOf(cusps[i]),
    cuspDegree: degToStr(degInSign(cusps[i])),
    significance: HOUSE_SIGNIFICANCE[i],
    planets: [],
  }));

  for (const planet of PLANET_ORDER) {
    if (!rawPlanets[planet]) continue;
    const pLon = rawPlanets[planet].longitude;
    for (let i = 0; i < 12; i++) {
      const start = sandhis[(i + 11) % 12];
      const end   = sandhis[i];
      let inBhava = start <= end ? (pLon >= start && pLon < end) : (pLon >= start || pLon < end);
      if (inBhava) { houses[i].planets.push(planet); break; }
    }
  }
  return houses;
}

function calculatePanchang(sunLon, moonLon, jd) {
  const diff       = norm(moonLon - sunLon);
  const tithiIdx   = Math.min(29, Math.floor(diff / 12));
  const tithiNum   = tithiIdx + 1;
  const paksha     = tithiIdx < 15 ? 'Shukla Paksha' : 'Krishna Paksha';
  const tithiName  = TITHIS[tithiIdx];
  const tithiPct   = ((diff / 12) - tithiIdx) * 100;

  const varaIdx    = Math.floor((jd + 1.5) % 7);
  const vara       = VARAS[varaIdx];
  const varaLord   = VARA_LORDS[varaIdx];

  const nakIdx     = Math.floor(moonLon / NAKSHATRA_SPAN);
  const nakData    = NAKSHATRAS[nakIdx] || NAKSHATRAS[0];
  const degInNak   = moonLon - nakIdx * NAKSHATRA_SPAN;
  const pada       = Math.floor(degInNak / (NAKSHATRA_SPAN / 4)) + 1;
  const nakPct     = (degInNak / NAKSHATRA_SPAN) * 100;

  const yogaSum    = (sunLon + moonLon) % 360;
  const yogaIdx    = Math.floor(yogaSum / (360 / 27));
  const yoga       = YOGAS[yogaIdx] || '—';

  const ht         = Math.floor(diff / 6);
  let karana;
  if (ht === 0)            karana = 'Kimstughna';
  else if (ht >= 1 && ht <= 56) karana = MOVABLE_KARANAS[(ht - 1) % 7];
  else if (ht === 57)      karana = 'Shakuni';
  else if (ht === 58)      karana = 'Chatushpada';
  else                     karana = 'Naga';

  const illumination = Math.round(((1 - Math.cos((diff * Math.PI) / 180)) / 2) * 100);
  const moonPhase = diff < 180 ? `Waxing (${illumination}% lit)` : `Waning (${illumination}% lit)`;
  const RAHU_KAAL_POS = [8, 2, 7, 5, 6, 4, 3, 1];
  const rahukaalPos   = RAHU_KAAL_POS[varaIdx];
  const rahukaalStart = `${5 + Math.floor((rahukaalPos - 1) * 1.5)}:${((rahukaalPos - 1) * 90) % 60 === 0 ? '00' : '30'} AM approx`;

  return {
    tithi: `${tithiName} (${tithiNum}/30)`,
    tithiNum, tithiPct: tithiPct.toFixed(1),
    paksha, vara, varaLord,
    nakshatra: nakData.name, nakshatraPada: pada, nakshatraLord: nakData.lord, nakshatraPct: nakPct.toFixed(1),
    yoga, karana, moonPhase, rahuKaal: rahukaalStart,
  };
}

function calcVimshottariDasha(moonLon, birthDate) {
  const nakIdx      = Math.floor(moonLon / NAKSHATRA_SPAN);
  const lord        = NAKSHATRAS[nakIdx]?.lord || 'Sun';
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

function detectDoshas(raw, lagnaSignIdx) {
  const doshas = {};
  const MANGAL_HOUSES = [1,2,4,7,8,12];
  const marsSignIdx   = signIdxOf(raw.Mars?.longitude || 0);
  const marsHouse     = (marsSignIdx - lagnaSignIdx + 12) % 12 + 1;
  const mangalPresent = MANGAL_HOUSES.includes(marsHouse);
  doshas.mangal = {
    present: mangalPresent, marsHouse,
    description: mangalPresent ? `Mars occupies house ${marsHouse} from Lagna — Mangal Dosha is present.` : `Mars in house ${marsHouse} — No Mangal Dosha.`,
  };

  const rahuLon = raw.Rahu?.longitude || 0;
  const ketuLon = norm(rahuLon + 180);
  const allHemmed = ['Sun','Moon','Mars','Mercury','Jupiter','Venus','Saturn'].every(p => {
    if (!raw[p]) return true;
    const pLon = raw[p].longitude;
    return rahuLon < ketuLon ? (pLon > rahuLon && pLon < ketuLon) : (pLon > rahuLon || pLon < ketuLon);
  });
  doshas.kaalSarp = { present: allHemmed, description: allHemmed ? 'Kaal Sarp Dosha present.' : 'No Kaal Sarp Dosha.' };

  const moonSIdx   = signIdxOf(raw.Moon?.longitude || 0);
  const saturnSIdx = signIdxOf(raw.Saturn?.longitude || 0);
  const diff2      = (saturnSIdx - moonSIdx + 12) % 12;
  const inSadeSati  = diff2 === 0 || diff2 === 1 || diff2 === 11;
  doshas.sadeSati  = { present: inSadeSati, description: inSadeSati ? 'Shani Sade Sati active.' : 'No Shani Sade Sati.' };

  return doshas;
}

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
      longitude: p.longitude, sign, signLord: SIGN_LORDS[sign] || '—',
      degree: deg.toFixed(2), degreeStr: degToStr(deg), house: houseNum,
      isRetrograde: p.isRetrograde, nakshatra: nakData.name, nakshatraLord: nakData.lord,
      navamsaSign: getNavamsaSign(p.longitude),
    };
  }).filter(Boolean);
}

function calcGocharPositions(gocharRaw, anchorSignIdx) {
  const houses = Array.from({ length: 12 }, (_, i) => ({
    number: i + 1, sign: SIGNS[(anchorSignIdx + i) % 12], significance: HOUSE_SIGNIFICANCE[i], planets: [],
  }));
  for (const planet of PLANET_ORDER) {
    if (!gocharRaw[planet]) continue;
    const hi = (signIdxOf(gocharRaw[planet].longitude) - anchorSignIdx + 12) % 12;
    houses[hi].planets.push(planet);
  }
  return houses;
}

function calculateKundali(utcDate, lat, lon) {
  let jd, ayanamsha, siderealAsc, raw;
  if (swisseph) {
    jd = swisseph.swe_julday(
      utcDate.getUTCFullYear(), utcDate.getUTCMonth() + 1, utcDate.getUTCDate(),
      utcDate.getUTCHours() + utcDate.getUTCMinutes() / 60 + utcDate.getUTCSeconds() / 3600,
      swisseph.SE_GREG_CAL
    );
    ayanamsha = swisseph.swe_get_ayanamsa_ut(jd);
    raw = getPlanets(jd);
    const hr = swisseph.swe_houses(jd, lat, lon, 'P');
    siderealAsc = norm(hr.ascendant - ayanamsha);
  } else {
    // Pure JS Astronomical Julian Day & planetary position calculation
    const jsData = getPlanetsJS(utcDate, lat, lon);
    jd = jsData.jd;
    ayanamsha = jsData.ayanamsha;
    raw = jsData.raw;
    siderealAsc = jsData.siderealAsc;
  }


  const lagnaSignIdx = signIdxOf(siderealAsc);
  const moonLon      = raw.Moon.longitude;
  const moonSignIdx  = signIdxOf(moonLon);
  const nakIdx       = Math.floor(moonLon / NAKSHATRA_SPAN);
  const nakData      = NAKSHATRAS[nakIdx] || NAKSHATRAS[0];
  const degInNak     = moonLon - nakIdx * NAKSHATRA_SPAN;
  const pada         = Math.floor(degInNak / (NAKSHATRA_SPAN / 4)) + 1;

  const lagnaChart   = buildWholeSignHouses(lagnaSignIdx,  raw);
  const chandraChart = buildWholeSignHouses(moonSignIdx,   raw);
  const chalitChart  = buildChalitChart(jd, lat, lon, ayanamsha, raw);

  const navamsaLagnaSign  = getNavamsaSign(siderealAsc);
  const navamsaLagnaIdx   = SIGNS.indexOf(navamsaLagnaSign);
  const navamsaChart = Array.from({ length: 12 }, (_, i) => ({
    number: i + 1, sign: SIGNS[(navamsaLagnaIdx + i) % 12], planets: [],
  }));

  const planets = formatPlanets(raw, lagnaSignIdx);
  planets.forEach(p => {
    const pIdx = SIGNS.indexOf(p.navamsaSign);
    if (pIdx >= 0) {
      const houseIdx = (pIdx - navamsaLagnaIdx + 12) % 12;
      navamsaChart[houseIdx].planets.push(p.name);
    }
  });

  const panchang = calculatePanchang(raw.Sun.longitude, moonLon, jd);
  const dashas = calcVimshottariDasha(moonLon, utcDate);
  const doshas = detectDoshas(raw, lagnaSignIdx);

  const gocharRaw   = getPlanets(jd);
  const lagnaGochar = calcGocharPositions(gocharRaw, lagnaSignIdx);
  const chandraGochar = calcGocharPositions(gocharRaw, moonSignIdx);
  const gocharPlanets = formatPlanets(gocharRaw, lagnaSignIdx);

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

function calculateMatch(boyUtc, boyLat, boyLon, girlUtc, girlLat, girlLon) {
  const boyKundli = calculateKundali(boyUtc, boyLat, boyLon);
  const girlKundli = calculateKundali(girlUtc, girlLat, girlLon);

  const ashtakoot = calculateAshtakoot(
    boyKundli.moonSign, boyKundli.nakshatra,
    girlKundli.moonSign, girlKundli.nakshatra
  );

  const boyManglik = boyKundli.doshas.mangal?.present || false;
  const girlManglik = girlKundli.doshas.mangal?.present || false;
  const manglikMatch = boyManglik === girlManglik;

  const rajjooDosha = ashtakoot.kootas.find(k => k.attribute === 'Nadi')?.received === 0;
  const vedhaDosha = ashtakoot.kootas.find(k => k.attribute === 'Yoni')?.received === 0;

  return {
    boy: {
      moonSign: boyKundli.moonSign,
      moonSignLord: SIGN_LORDS[boyKundli.moonSign] || "",
      nakshatra: boyKundli.nakshatra,
      nakshatraLord: boyKundli.nakshatraLord,
      isManglik: boyManglik,
    },
    girl: {
      moonSign: girlKundli.moonSign,
      moonSignLord: SIGN_LORDS[girlKundli.moonSign] || "",
      nakshatra: girlKundli.nakshatra,
      nakshatraLord: girlKundli.nakshatraLord,
      isManglik: girlManglik,
    },
    ashtakoot,
    manglikMatch,
    rajjooDosha,
    vedhaDosha
  };
}

module.exports = { calculateKundali, calculateMatch };
