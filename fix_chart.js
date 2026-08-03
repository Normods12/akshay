const fs = require('fs');
const file = 'src/components/ui/KundliChartSVG.jsx';
let content = fs.readFileSync(file, 'utf8');

const replacement = `const NI_HOUSES_FINAL = [
  // 1: Top Rhombus
  { house: 1,  points: \`\${W/2},0 \${W/4},\${H/4} \${W/2},\${H/2} \${3*W/4},\${H/4}\`, cx: W/2, cy: H/4 - 10 },
  // 2: Top Left Triangle (Upper)
  { house: 2,  points: \`0,0 \${W/2},0 \${W/4},\${H/4}\`, cx: W/4, cy: H/8 - 5 },
  // 3: Top Left Triangle (Left)
  { house: 3,  points: \`0,0 \${W/4},\${H/4} 0,\${H/2}\`, cx: W/8 - 5, cy: H/4 },
  // 4: Left Rhombus
  { house: 4,  points: \`0,\${H/2} \${W/4},\${3*H/4} \${W/2},\${H/2} \${W/4},\${H/4}\`, cx: W/4 - 10, cy: H/2 },
  // 5: Bottom Left Triangle (Left)
  { house: 5,  points: \`0,\${H} 0,\${H/2} \${W/4},\${3*H/4}\`, cx: W/8 - 5, cy: 3*H/4 },
  // 6: Bottom Left Triangle (Bottom)
  { house: 6,  points: \`0,\${H} \${W/4},\${3*H/4} \${W/2},\${H}\`, cx: W/4, cy: 7*H/8 + 5 },
  // 7: Bottom Rhombus
  { house: 7,  points: \`\${W/2},\${H} \${3*W/4},\${3*H/4} \${W/2},\${H/2} \${W/4},\${3*H/4}\`, cx: W/2, cy: 3*H/4 + 10 },
  // 8: Bottom Right Triangle (Bottom)
  { house: 8,  points: \`\${W},\${H} \${W/2},\${H} \${3*W/4},\${3*H/4}\`, cx: 3*W/4, cy: 7*H/8 + 5 },
  // 9: Bottom Right Triangle (Right)
  { house: 9,  points: \`\${W},\${H} \${3*W/4},\${3*H/4} \${W},\${H/2}\`, cx: 7*W/8 + 5, cy: 3*H/4 },
  // 10: Right Rhombus
  { house: 10, points: \`\${W},\${H/2} \${3*W/4},\${H/4} \${W/2},\${H/2} \${3*W/4},\${3*H/4}\`, cx: 3*W/4 + 10, cy: H/2 },
  // 11: Top Right Triangle (Right)
  { house: 11, points: \`\${W},0 \${W},\${H/2} \${3*W/4},\${H/4}\`, cx: 7*W/8 + 5, cy: H/4 },
  // 12: Top Right Triangle (Upper)
  { house: 12, points: \`\${W},0 \${3*W/4},\${H/4} \${W/2},0\`, cx: 3*W/4, cy: H/8 - 5 }
];`;

content = content.replace(/const NI_HOUSES_FINAL = \[[\s\S]*?\];/, replacement);
fs.writeFileSync(file, content);
console.log('Fixed chart SVG coordinates');
