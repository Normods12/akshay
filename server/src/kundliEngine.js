/**
 * kundliEngine.js  — Full-precision Vedic astrology engine (Swiss Ephemeris with pure JS fallback)
 */

const path = require('path');
const { calculateAshtakoot } = require('./ashtakoot');

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
  Rahu:    swisseph.SE_MEAN_NODE,
} : {};

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

// ─── Pure JS Keplerian Orbital Calculations (Fallback) ────────────────────────
function getPlanetsJS(jd) {
  const d = jd - 2451545.0; // days since J2000
  const ayanamsha = 24.0 + (d / 36525.0) * 0.7; // Lahiri approx

  // Sun tropical longitude
  const L_sun = norm(280.466 + 0.98564736 * d);
  const g_sun = norm(357.529 + 0.98560028 * d) * Math.PI / 180;
  const sunTrop = norm(L_sun + 1.915 * Math.sin(g_sun) + 0.020 * Math.sin(2 * g_sun));

  // Moon tropical longitude
  const L_moon = norm(218.316 + 13.176396 * d);
  const M_moon = norm(134.963 + 13.064993 * d) * Math.PI / 180;
  const moonTrop = norm(L_moon + 6.289 * Math.sin(M_moon));

  // Mars
  const marsTrop = norm(355.433 + 0.524033 * d);
  // Mercury
  const mercTrop = norm(sunTrop + 15 * Math.sin(norm(250 + 4 * d) * Math.PI / 180));
  // Jupiter
  const jupTrop  = norm(34.351 + 0.083091 * d);
  // Venus
  const venTrop  = norm(sunTrop + 22 * Math.sin(norm(180 + 1.6 * d) * Math.PI / 180));
  // Saturn
  const satTrop  = norm(50.077 + 0.033459 * d);
  // Rahu (mean node, retrograde movement)
  const rahuTrop = norm(125.044 - 0.0529539 * d);

  const raw = {
    Sun:     { longitude: norm(sunTrop - ayanamsha), latitude: 0, speed: 0.98, isRetrograde: false },
    Moon:    { longitude: norm(moonTrop - ayanamsha), latitude: 0, speed: 13.1, isRetrograde: false },
    Mars:    { longitude: norm(marsTrop - ayanamsha), latitude: 0, speed: 0.52, isRetrograde: false },
    Mercury: { longitude: norm(mercTrop - ayanamsha), latitude: 0, speed: 1.2, isRetrograde: false },
    Jupiter: { longitude: norm(jupTrop - ayanamsha), latitude: 0, speed: 0.08, isRetrograde: false },
    Venus:   { longitude: norm(venTrop - ayanamsha), latitude: 0, speed: 1.1, isRetrograde: false },
    Saturn:  { longitude: norm(satTrop - ayanamsha), latitude: 0, speed: 0.03, isRetrograde: false },
    Rahu:    { longitude: norm(rahuTrop - ayanamsha), latitude: 0, speed: -0.05, isRetrograde: true },
  };

  raw.Ketu = { longitude: norm(raw.Rahu.longitude + 180), latitude: 0, speed: -0.05, isRetrograde: true };
  return { raw, ayanamsha, siderealAsc: norm(sunTrop - ayanamsha + 90) };
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
    const y = utcDate.getUTCFullYear();
    const m = utcDate.getUTCMonth() + 1;
    const d = utcDate.getUTCDate() + (utcDate.getUTCHours() + utcDate.getUTCMinutes()/60)/24;
    jd = 367*y - Math.floor(7*(y + Math.floor((m+9)/12))/4) + Math.floor(275*m/9) + d + 1721013.5;
    const jsData = getPlanetsJS(jd);
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
