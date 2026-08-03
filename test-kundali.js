const { calculateKundali } = require('./server/src/kundliEngine.js');
const { localToUTC } = require('./server/src/timezone.js');

const res = localToUTC("2004-12-23", "07:30", 19.303, 73.059);
const k = calculateKundali(res.utcDate, 19.303, 73.059);

console.log("Lagna:", k.ascendant);
k.lagnaChart.forEach(h => {
  if(h.planets.length > 0) {
    console.log(`House ${h.number} (${h.sign}): ${h.planets.join(', ')}`);
  }
});
