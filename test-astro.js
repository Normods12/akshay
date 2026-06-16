const { getPlanetaryPositions, getMoonSign, getNakshatra, getGunMilan } = require('vedic-astro');

async function test() {
  const loc = { latitude: 28.6139, longitude: 77.2090 };
  const eph = await getPlanetaryPositions({ iso: "1990-01-01T12:00:00.000Z" }, loc);
  console.log("eph length:", eph.length);
  
  const moon = eph.find(p => p.name === 'Moon');
  console.log("Moon:", moon);
  
  const boyNak = getNakshatra(moon.longitude);
  console.log("boyNak:", boyNak);
  
  const boySign = getMoonSign(moon.longitude);
  console.log("boySign:", boySign);

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
