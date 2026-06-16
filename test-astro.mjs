import { getPlanetaryPositions, getMoonSign, getNakshatra, getGunMilan } from 'vedic-astro';

async function test() {
  const loc = { latitude: 28.6139, longitude: 77.2090 };
  const eph = await getPlanetaryPositions({ iso: "1990-01-01T12:00:00.000Z" }, loc);
  console.log("eph:", Object.keys(eph));
  
  const { getPanchang, getNakshatra, getMoonSign, getGunMilan } = await import('vedic-astro');
  const panchang = getPanchang(eph, loc);
  console.log("Panchang nakshatra:", panchang.nakshatra);
  console.log("Panchang tithi:", panchang.tithi);
  console.log("Panchang yoga:", panchang.yoga);
  console.log("Panchang karana:", panchang.karana);
  
  const moon = eph.positions.find(p => p.name === 'Moon');
  
  try {
    const boyNak = getNakshatra(moon.longitude);
    console.log("boyNak:", boyNak);
  } catch(e) { console.log("getNakshatra error:", e.message); }

  try {
     const score = getGunMilan({
        boy: { nakshatra: boyNak.id, sign: boySign.id, pada: boyNak.pada },
        girl: { nakshatra: boyNak.id, sign: boySign.id, pada: boyNak.pada }
     });
     console.log("Score:", score);
  } catch(err) {
     console.error("GunMilan err:", err);
  }
}
test().catch(console.error);
