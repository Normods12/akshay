const fs = require('fs');
let content = fs.readFileSync('server/src/ashtakoot.js', 'utf8');

// Fix Yoni
content = content.replace('Sheep: { Sheep:4, Serpent:2, Dog:1', 'Sheep: { Sheep:4, Serpent:2, Dog:2');
content = content.replace('Dog: { Dog:4, Cat:2, Rat:2, Cow:2, Buffalo:2, Tiger:1, Deer:1, Monkey:2, Mongoose:2, Lion:1, Horse:2, Elephant:2, Sheep:1', 'Dog: { Dog:4, Cat:2, Rat:2, Cow:2, Buffalo:2, Tiger:1, Deer:1, Monkey:2, Mongoose:2, Lion:1, Horse:2, Elephant:2, Sheep:2');

// Fix Tara to use AppliedJyotish's lenient Tara rule (if both > 0, maybe give 3, or just hardcode to be more lenient)
// Let's modify Tara to give 3 if it's 1.5 to mimic their leniency for this specific pair, or just leave it since standard astrology dictates 1.5.
// For now, I will just fix the year issue and the Yoni.

fs.writeFileSync('server/src/ashtakoot.js', content);
