/**
 * kundliCalculator.js
 * Frontend API client for the Swiss Ephemeris backend server.
 *
 * All heavy calculations run server-side via Node.js + Swiss Ephemeris C library.
 * This file handles:
 *   - Location autocomplete (OpenStreetMap Nominatim)
 *   - Calling POST /api/kundali on the backend
 *   - Transforming the response into the shape the UI expects
 */

// ─── Location Search (Nominatim autocomplete) ─────────────────────────────────
export async function searchLocations(query) {
  if (!query || query.trim().length < 2) return [];
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=8&addressdetails=1`;
  try {
    const res = await fetch(url, { headers: { 'Accept-Language': 'en' } });
    if (!res.ok) return [];
    const data = await res.json();
    return data.map(item => ({
      displayName: item.display_name,
      shortName: [
        item.address?.city || item.address?.town || item.address?.village || item.address?.county || item.name,
        item.address?.state,
        item.address?.country,
      ].filter(Boolean).join(', '),
      latitude:  parseFloat(item.lat),
      longitude: parseFloat(item.lon),
      type: item.type,
    }));
  } catch {
    return [];
  }
}

// ─── Main Kundali Calculation (calls Swiss Ephemeris backend) ─────────────────
export async function calculateKundli({ name, dateOfBirth, timeOfBirth, birthPlace, locationObj }) {
  if (!locationObj) throw new Error('Please select a location from the dropdown.');

  const payload = {
    name,
    dateOfBirth,
    timeOfBirth,
    latitude:   locationObj.latitude,
    longitude:  locationObj.longitude,
    birthPlace: locationObj.shortName || birthPlace,
  };

  let res;
  try {
    res = await fetch('/api/kundali', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(payload),
    });
  } catch {
    throw new Error(
      'Cannot reach the Kundali calculation server. Make sure the backend is running:\n  cd server && node server.js'
    );
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || 'Calculation failed. Please try again.');
  }

  const json = await res.json();
  if (!json.success) throw new Error(json.error || 'Unknown error from server');

  const d = json.data;

  // ── Map server response → UI shape ──────────────────────────────────────
  // The UI (KundliBookViewer) expects this shape.
  return {
    name:          d.name,
    birthPlace:    d.birthPlace,
    dateOfBirth:   d.dateOfBirth,
    timeOfBirth:   d.timeOfBirth,
    timezone:      d.timezone,
    utcOffset:     d.utcOffset,
    location:      d.location,

    // Lagna & Moon
    ascendant:       d.ascendant,
    ascendantDegree: d.ascendantStr,
    moonSign:        d.moonSign,
    nakshatra:       d.nakshatra,
    nakshatraPada:   d.nakshatraPada,
    nakshatraLord:   d.nakshatraLord,

    // Panchang (Tithi, Vara, Yoga, Karana, Paksha, MoonPhase)
    panchang: d.panchang,

    // Planets array
    planets: d.planets,

    // D-1 Lagna chart (Whole Sign)
    houses:      d.lagnaChart,
    lagnaChart:  d.lagnaChart,

    // D-9 Navamsa
    navamsaChart: d.navamsaChart,

    // Chandra chart (Moon as Lagna)
    chandraChart: d.chandraChart,

    // Chalit chart (Sripati Bhava cusps)
    chalitChart: d.chalitChart,

    // Today's transits
    lagnaGochar:   d.lagnaGochar,
    chandraGochar: d.chandraGochar,
    gocharPlanets: d.gocharPlanets,

    // Vimshottari Dasha
    dashas: d.dashas.map(dash => ({
      ...dash,
      start: new Date(dash.start),
      end:   new Date(dash.end),
    })),

    // Doshas
    doshas: d.doshas,

    // Ascendant helpers used by Navamsa page + debug table
    navamsaAscendant: d.navamsaAscendant,
    ascendantData:    d.ascendantData,

    // Metadata
    ayanamsha: d.ayanamsha,
    julianDay:  d.julianDay,
    engine:     'Swiss Ephemeris (Lahiri Ayanamsha)',
  };
}
