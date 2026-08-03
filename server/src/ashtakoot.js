const NAKSHATRAS = [
  'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashirsha', 'Ardra', 'Punarvasu', 'Pushya', 'Ashlesha',
  'Magha', 'Purva Phalguni', 'Uttara Phalguni', 'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha',
  'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishta', 'Shatabhisha', 'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati'
];

const SIGNS = ['Mesha', 'Vrishabha', 'Mithuna', 'Karka', 'Simha', 'Kanya', 'Tula', 'Vrishchika', 'Dhanu', 'Makara', 'Kumbha', 'Meena'];
const SIGN_LORDS = { Mesha: 'Mars', Vrishabha: 'Venus', Mithuna: 'Mercury', Karka: 'Moon', Simha: 'Sun', Kanya: 'Mercury', Tula: 'Venus', Vrishchika: 'Mars', Dhanu: 'Jupiter', Makara: 'Saturn', Kumbha: 'Saturn', Meena: 'Jupiter' };

// 1. Varna (1 pt)
const VARNA_MAP = { Karka: 1, Vrishchika: 1, Meena: 1, Mesha: 2, Simha: 2, Dhanu: 2, Vrishabha: 3, Kanya: 3, Makara: 3, Mithuna: 4, Tula: 4, Kumbha: 4 };
const VARNA_NAMES = { 1: 'Brahmin', 2: 'Kshatriya', 3: 'Vaishya', 4: 'Shudra' };
function getVarna(sign) {
  const v = VARNA_MAP[sign];
  const b = arguments[1] || v; // boy
  const g = arguments[2] || v; // girl
  return { score: (b <= g ? 1 : 0), bStr: VARNA_NAMES[b], gStr: VARNA_NAMES[g] };
}

// 2. Vashya (2 pts)
const VASHYA_MAP = {
  Mesha: 'Chatushpad', Vrishabha: 'Chatushpad', Mithuna: 'Manava', Karka: 'Jalachar',
  Simha: 'Vanchar', Kanya: 'Manava', Tula: 'Manava', Vrishchika: 'Keeta',
  Dhanu: 'Chatushpad', // simplified
  Makara: 'Jalachar', Kumbha: 'Manava', Meena: 'Jalachar'
};
const VASHYA_POINTS = {
  Chatushpad: { Chatushpad: 2, Manava: 1, Jalachar: 1, Keeta: 0.5, Vanchar: 0 },
  Manava: { Chatushpad: 1, Manava: 2, Jalachar: 0.5, Keeta: 1, Vanchar: 0 },
  Jalachar: { Chatushpad: 1, Manava: 0.5, Jalachar: 2, Keeta: 1, Vanchar: 1 },
  Keeta: { Chatushpad: 0.5, Manava: 1, Jalachar: 1, Keeta: 2, Vanchar: 0 },
  Vanchar: { Chatushpad: 0, Manava: 0, Jalachar: 1, Keeta: 0, Vanchar: 2 }
};
function getVashya(bSign, gSign) {
  const bv = VASHYA_MAP[bSign], gv = VASHYA_MAP[gSign];
  return { score: VASHYA_POINTS[bv][gv] || 0, bStr: bv, gStr: gv };
}

// 3. Tara (3 pts)
function getTara(bNakIdx, gNakIdx) {
  const t1 = ((gNakIdx - bNakIdx + 27) % 27 + 1) % 9;
  const t2 = ((bNakIdx - gNakIdx + 27) % 27 + 1) % 9;
  const s1 = (t1 === 3 || t1 === 5 || t1 === 7) ? 0 : 1.5;
  const s2 = (t2 === 3 || t2 === 5 || t2 === 7) ? 0 : 1.5;
  // Lenient logic: if either direction is auspicious, grant full 3 points.
  const score = (s1 > 0 || s2 > 0) ? 3 : 0;
  return { score, bStr: NAKSHATRAS[bNakIdx], gStr: NAKSHATRAS[gNakIdx] };
}

// 4. Yoni (4 pts)
const YONI_MAP = [
  'Horse', 'Elephant', 'Sheep', 'Serpent', 'Serpent', 'Dog', 'Cat', 'Sheep', 'Cat',
  'Rat', 'Rat', 'Cow', 'Buffalo', 'Tiger', 'Buffalo', 'Tiger', 'Deer', 'Deer',
  'Dog', 'Monkey', 'Mongoose', 'Monkey', 'Lion', 'Horse', 'Lion', 'Cow', 'Elephant'
];
// Simplified Yoni scores (0 to 4 based on typical friendship)
const YONI_MATRIX = {
  Horse: { Horse:4, Elephant:2, Sheep:2, Serpent:3, Dog:2, Cat:2, Rat:2, Cow:2, Buffalo:2, Tiger:1, Deer:3, Monkey:3, Mongoose:2, Lion:1 },
  Elephant: { Elephant:4, Sheep:3, Serpent:3, Dog:2, Cat:2, Rat:2, Cow:3, Buffalo:3, Tiger:1, Deer:2, Monkey:3, Mongoose:2, Lion:1, Horse:2 },
  Sheep: { Sheep:4, Serpent:2, Dog:2, Cat:2, Rat:2, Cow:2, Buffalo:2, Tiger:1, Deer:3, Monkey:2, Mongoose:2, Lion:1, Horse:2, Elephant:3 },
  Serpent: { Serpent:4, Dog:2, Cat:1, Rat:1, Cow:2, Buffalo:2, Tiger:2, Deer:2, Monkey:2, Mongoose:0, Lion:2, Horse:3, Elephant:3, Sheep:2 },
  Dog: { Dog:4, Cat:2, Rat:2, Cow:2, Buffalo:2, Tiger:1, Deer:1, Monkey:2, Mongoose:2, Lion:1, Horse:2, Elephant:2, Sheep:2, Serpent:2 },
  Cat: { Cat:4, Rat:0, Cow:2, Buffalo:2, Tiger:1, Deer:2, Monkey:2, Mongoose:2, Lion:1, Horse:2, Elephant:2, Sheep:2, Serpent:1, Dog:2 },
  Rat: { Rat:4, Cow:2, Buffalo:2, Tiger:1, Deer:2, Monkey:2, Mongoose:2, Lion:1, Horse:2, Elephant:2, Sheep:2, Serpent:1, Dog:2, Cat:0 },
  Cow: { Cow:4, Buffalo:3, Tiger:0, Deer:2, Monkey:2, Mongoose:2, Lion:1, Horse:2, Elephant:3, Sheep:2, Serpent:2, Dog:2, Cat:2, Rat:2 },
  Buffalo: { Buffalo:4, Tiger:1, Deer:2, Monkey:2, Mongoose:2, Lion:1, Horse:2, Elephant:3, Sheep:2, Serpent:2, Dog:2, Cat:2, Rat:2, Cow:3 },
  Tiger: { Tiger:4, Deer:1, Monkey:2, Mongoose:2, Lion:1, Horse:1, Elephant:1, Sheep:1, Serpent:2, Dog:1, Cat:1, Rat:1, Cow:0, Buffalo:1 },
  Deer: { Deer:4, Monkey:2, Mongoose:2, Lion:1, Horse:3, Elephant:2, Sheep:3, Serpent:2, Dog:1, Cat:2, Rat:2, Cow:2, Buffalo:2, Tiger:1 },
  Monkey: { Monkey:4, Mongoose:2, Lion:2, Horse:3, Elephant:3, Sheep:2, Serpent:2, Dog:2, Cat:2, Rat:2, Cow:2, Buffalo:2, Tiger:2, Deer:2 },
  Mongoose: { Mongoose:4, Lion:2, Horse:2, Elephant:2, Sheep:2, Serpent:0, Dog:2, Cat:2, Rat:2, Cow:2, Buffalo:2, Tiger:2, Deer:2, Monkey:2 },
  Lion: { Lion:4, Horse:1, Elephant:1, Sheep:1, Serpent:2, Dog:1, Cat:1, Rat:1, Cow:1, Buffalo:1, Tiger:1, Deer:1, Monkey:2, Mongoose:2 }
};
function getYoni(bNakIdx, gNakIdx) {
  const by = YONI_MAP[bNakIdx], gy = YONI_MAP[gNakIdx];
  const s = YONI_MATRIX[by]?.[gy] ?? YONI_MATRIX[gy]?.[by] ?? 2;
  return { score: s, bStr: `${NAKSHATRAS[bNakIdx]} (${by})`, gStr: `${NAKSHATRAS[gNakIdx]} (${gy})` };
}

// 5. Graha Maitri (5 pts)
const MAITRI = {
  Sun: { Sun:5, Moon:5, Mars:5, Mercury:4, Jupiter:5, Venus:0, Saturn:0 },
  Moon: { Sun:5, Moon:5, Mars:4, Mercury:5, Jupiter:4, Venus:4, Saturn:4 },
  Mars: { Sun:5, Moon:5, Mars:5, Mercury:0, Jupiter:5, Venus:4, Saturn:4 },
  Mercury: { Sun:5, Moon:1, Mars:4, Mercury:5, Jupiter:4, Venus:5, Saturn:4 },
  Jupiter: { Sun:5, Moon:5, Mars:5, Mercury:0, Jupiter:5, Venus:0, Saturn:4 },
  Venus: { Sun:0, Moon:0, Mars:4, Mercury:5, Jupiter:4, Venus:5, Saturn:5 },
  Saturn: { Sun:0, Moon:0, Mars:0, Mercury:5, Jupiter:4, Venus:5, Saturn:5 }
};
function getMaitri(bSign, gSign) {
  const bl = SIGN_LORDS[bSign], gl = SIGN_LORDS[gSign];
  const bg = MAITRI[bl]?.[gl] || 0;
  const gb = MAITRI[gl]?.[bl] || 0;
  let score = 0;
  if (bg===5 && gb===5) score=5;
  else if ((bg===5&&gb===4) || (bg===4&&gb===5)) score=4;
  else if (bg===4 && gb===4) score=3;
  else if ((bg===5&&gb<=1) || (bg<=1&&gb===5)) score=1;
  else if ((bg===4&&gb<=1) || (bg<=1&&gb===4)) score=0.5;
  else score=0;
  return { score, bStr: `${bl}`, gStr: `${gl}` };
}

// 6. Gana (6 pts)
const GANA_MAP = [
  'Deva', 'Manushya', 'Rakshasa', 'Manushya', 'Deva', 'Manushya', 'Deva', 'Deva', 'Rakshasa',
  'Rakshasa', 'Manushya', 'Manushya', 'Deva', 'Rakshasa', 'Deva', 'Rakshasa', 'Deva', 'Rakshasa',
  'Rakshasa', 'Manushya', 'Manushya', 'Deva', 'Rakshasa', 'Rakshasa', 'Manushya', 'Manushya', 'Deva'
];
function getGana(bNakIdx, gNakIdx) {
  const bg = GANA_MAP[bNakIdx], gg = GANA_MAP[gNakIdx];
  let score = 0;
  if (bg === 'Deva' && gg === 'Deva') score = 6;
  else if (bg === 'Manushya' && gg === 'Manushya') score = 6;
  else if (bg === 'Rakshasa' && gg === 'Rakshasa') score = 6;
  else if (bg === 'Deva' && gg === 'Manushya') score = 6;
  else if (bg === 'Manushya' && gg === 'Deva') score = 5;
  else if (bg === 'Deva' && gg === 'Rakshasa') score = 1;
  else score = 0;
  return { score, bStr: bg, gStr: gg };
}

// 7. Bhakoot (7 pts)
function getBhakoot(bSign, gSign) {
  const bIdx = SIGNS.indexOf(bSign), gIdx = SIGNS.indexOf(gSign);
  const diff = (gIdx - bIdx + 12) % 12;
  // diff: 0(1/1)->7, 1(2/12)->0, 2(3/11)->7, 3(4/10)->7, 4(5/9)->0, 5(6/8)->0, 6(7/7)->7, 7(8/6)->0, 8(9/5)->0, 9(10/4)->7, 10(11/3)->7, 11(12/2)->0
  const score = [7, 0, 7, 7, 0, 0, 7, 0, 0, 7, 7, 0][diff];
  return { score, bStr: bSign, gStr: gSign };
}

// 8. Nadi (8 pts)
const NADI_MAP = [
  'Adi', 'Madhya', 'Antya', 'Antya', 'Madhya', 'Adi', 'Adi', 'Madhya', 'Antya',
  'Antya', 'Madhya', 'Adi', 'Adi', 'Madhya', 'Antya', 'Antya', 'Madhya', 'Adi',
  'Adi', 'Madhya', 'Antya', 'Antya', 'Madhya', 'Adi', 'Adi', 'Madhya', 'Antya'
];
function getNadi(bNakIdx, gNakIdx) {
  const bn = NADI_MAP[bNakIdx], gn = NADI_MAP[gNakIdx];
  return { score: bn === gn ? 0 : 8, bStr: bn, gStr: gn };
}

// Main calculateAshtakoot function
function calculateAshtakoot(bSign, bNak, gSign, gNak) {
  const bNakIdx = NAKSHATRAS.indexOf(bNak);
  const gNakIdx = NAKSHATRAS.indexOf(gNak);

  const varna = getVarna(bSign, VARNA_MAP[bSign], VARNA_MAP[gSign]);
  const vashya = getVashya(bSign, gSign);
  const tara = getTara(bNakIdx, gNakIdx);
  const yoni = getYoni(bNakIdx, gNakIdx);
  const maitri = getMaitri(bSign, gSign);
  const gana = getGana(bNakIdx, gNakIdx);
  const bhakoot = getBhakoot(bSign, gSign);
  const nadi = getNadi(bNakIdx, gNakIdx);

  const totalScore = varna.score + vashya.score + tara.score + yoni.score + maitri.score + gana.score + bhakoot.score + nadi.score;

  return {
    total: totalScore,
    outOf: 36,
    kootas: [
      { attribute: 'Varna', male: varna.bStr, female: varna.gStr, outOf: 1, received: varna.score, area: 'Natural Refinement / Work' },
      { attribute: 'Vashya', male: vashya.bStr, female: vashya.gStr, outOf: 2, received: vashya.score, area: 'Innate Giving / Attraction' },
      { attribute: 'Tara', male: tara.bStr, female: tara.gStr, outOf: 3, received: tara.score, area: 'Comfort / Prosperity / Health' },
      { attribute: 'Yoni', male: yoni.bStr, female: yoni.gStr, outOf: 4, received: yoni.score, area: 'Intimate Physical' },
      { attribute: 'Maitri', male: maitri.bStr, female: maitri.gStr, outOf: 5, received: maitri.score, area: 'Friendship' },
      { attribute: 'Gan', male: gana.bStr, female: gana.gStr, outOf: 6, received: gana.score, area: 'Temperament' },
      { attribute: 'Bhakut', male: bhakoot.bStr, female: bhakoot.gStr, outOf: 7, received: bhakoot.score, area: 'Constructive Ability' },
      { attribute: 'Nadi', male: nadi.bStr, female: nadi.gStr, outOf: 8, received: nadi.score, area: 'Progeny / Excess' },
    ]
  };
}

module.exports = { calculateAshtakoot, SIGN_LORDS };
