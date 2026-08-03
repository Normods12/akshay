/**
 * matchCalculator.js
 * Frontend API client for the Kundli Matching server.
 */

export async function calculateMatch({ boy, girl }) {
  if (!boy.locationObj) throw new Error("Please select a location for the boy.");
  if (!girl.locationObj) throw new Error("Please select a location for the girl.");

  const payload = {
    boy: {
      name: boy.name,
      dateOfBirth: boy.dateOfBirth,
      timeOfBirth: boy.timeOfBirth,
      latitude: boy.locationObj.latitude,
      longitude: boy.locationObj.longitude,
      birthPlace: boy.locationObj.shortName || boy.birthPlace,
    },
    girl: {
      name: girl.name,
      dateOfBirth: girl.dateOfBirth,
      timeOfBirth: girl.timeOfBirth,
      latitude: girl.locationObj.latitude,
      longitude: girl.locationObj.longitude,
      birthPlace: girl.locationObj.shortName || girl.birthPlace,
    }
  };

  let res;
  try {
    res = await fetch('/api/match', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch {
    throw new Error('Cannot reach the Match calculation server.');
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || 'Calculation failed. Please try again.');
  }

  const json = await res.json();
  if (!json.success) throw new Error(json.error || 'Unknown error from server');

  return json.data;
}

export function calculateNameMatch({ boy, girl }) {
  if (!boy.name || !girl.name) throw new Error("Please enter names for both the boy and the girl.");
  
  // A deterministic mock generator based on character codes
  const getHash = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return Math.abs(hash);
  };

  const boyHash = getHash(boy.name.toLowerCase().trim());
  const girlHash = getHash(girl.name.toLowerCase().trim());
  
  const combined = boyHash + girlHash;
  
  // Base points between 18 and 36 for a somewhat "realistic" random distribution
  const points = 15 + (combined % 21);
  
  const SIGNS = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
  const NAKSHATRAS = ['Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashirsha', 'Ardra', 'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni'];
  
  const bSign = SIGNS[boyHash % SIGNS.length];
  const gSign = SIGNS[girlHash % SIGNS.length];
  const bNak = NAKSHATRAS[boyHash % NAKSHATRAS.length];
  const gNak = NAKSHATRAS[girlHash % NAKSHATRAS.length];

  return {
    boy: {
      name: boy.name,
      dateOfBirth: 'N/A',
      timeOfBirth: 'N/A',
      birthPlace: 'N/A',
      moonSign: bSign,
      moonSignLord: 'Determined by Name',
      nakshatra: bNak,
      nakshatraLord: 'Determined by Name',
      isManglik: boyHash % 2 === 0
    },
    girl: {
      name: girl.name,
      dateOfBirth: 'N/A',
      timeOfBirth: 'N/A',
      birthPlace: 'N/A',
      moonSign: gSign,
      moonSignLord: 'Determined by Name',
      nakshatra: gNak,
      nakshatraLord: 'Determined by Name',
      isManglik: girlHash % 2 === 0
    },
    ashtakoot: {
      total: points,
      outOf: 36,
      kootas: [
        { attribute: 'Varna', male: 'Brahmin', female: 'Kshatriya', outOf: 1, received: (combined % 2), area: 'Natural Refinement' },
        { attribute: 'Vashya', male: 'Manava', female: 'Jalachar', outOf: 2, received: (combined % 3), area: 'Innate Giving' },
        { attribute: 'Tara', male: bNak, female: gNak, outOf: 3, received: 1.5, area: 'Comfort / Prosperity' },
        { attribute: 'Yoni', male: 'Tiger', female: 'Cow', outOf: 4, received: (combined % 5), area: 'Intimate Physical' },
        { attribute: 'Maitri', male: 'Sun', female: 'Moon', outOf: 5, received: (combined % 6), area: 'Friendship' },
        { attribute: 'Gan', male: 'Deva', female: 'Rakshasa', outOf: 6, received: (combined % 7), area: 'Temperament' },
        { attribute: 'Bhakut', male: bSign, female: gSign, outOf: 7, received: (combined % 8), area: 'Constructive Ability' },
        { attribute: 'Nadi', male: 'Adi', female: 'Antya', outOf: 8, received: (combined % 2) === 0 ? 8 : 0, area: 'Progeny' },
      ]
    },
    manglikMatch: (boyHash % 2) === (girlHash % 2),
    rajjooDosha: combined % 3 === 0,
    vedhaDosha: combined % 5 === 0
  };
}
