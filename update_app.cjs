const fs = require('fs');
const file = 'src/App.jsx';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('import DailyPanchang')) {
  content = content.replace(
    "import Hero from './components/sections/Hero';",
    "import Hero from './components/sections/Hero';\nimport DailyPanchang from './components/sections/DailyPanchang';"
  );
  content = content.replace(
    "<QuickLinks setCurrentPage={setCurrentPage} />",
    "<QuickLinks setCurrentPage={setCurrentPage} />\n                <DailyPanchang />"
  );
  fs.writeFileSync(file, content);
  console.log('App.jsx updated with DailyPanchang');
} else {
  console.log('App.jsx already has DailyPanchang');
}
