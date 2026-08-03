const fs = require('fs');

// Update Navbar.jsx
let nav = fs.readFileSync('src/components/layout/Navbar.jsx', 'utf8');
nav = nav.replace(
  "{ label: 'Matchmaking', id: 'matchmaking' }",
  "{ label: 'Matchmaking', id: 'matchmaking' },\n              { label: 'Moon Sign Calculator', id: 'moon-sign' }"
);
fs.writeFileSync('src/components/layout/Navbar.jsx', nav);
console.log('Navbar updated');

// Update App.jsx
let app = fs.readFileSync('src/App.jsx', 'utf8');
if (!app.includes('import MoonSignCalculator')) {
  app = app.replace(
    "import Matchmaking from './pages/Matchmaking';",
    "import Matchmaking from './pages/Matchmaking';\nimport MoonSignCalculator from './pages/MoonSignCalculator';"
  );
  app = app.replace(
    ") : currentPage === 'matchmaking' ? (",
    ") : currentPage === 'moon-sign' ? (\n              <MoonSignCalculator key=\"moon-sign\" />\n            ) : currentPage === 'matchmaking' ? ("
  );
  fs.writeFileSync('src/App.jsx', app);
  console.log('App.jsx updated with Moon Sign Route');
}
