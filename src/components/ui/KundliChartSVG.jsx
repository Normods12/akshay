import React, { useId } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

/**
 * KundliChartSVG — North Indian style 12-house kundli grid.
 *
 * Counter-clockwise from House 1 (top diamond):
 *   2=top-left-upper  1=top-diamond  12=top-right-upper
 *   3=top-left-lower             11=top-right-lower
 *   4=left-diamond               10=right-diamond
 *   5=bot-left-upper              9=bot-right-upper
 *   6=bot-left-lower   7=bot-diamond  8=bot-right-lower
 *
 * IMPORTANT: Do NOT animate SVG `x`/`y` with framer-motion.
 * FM maps those to CSS translateX/Y, which stacks on top of the SVG
 * attributes and double-offsets labels (planets vanish or land in wrong houses).
 */

const PLANET_COLORS = {
  Sun: '#c48100', Moon: '#4a4a8a', Mars: '#c02020', Mercury: '#007a6e',
  Jupiter: '#b05000', Venus: '#a02070', Saturn: '#4030a0', Rahu: '#303040', Ketu: '#6a3010'
};

const PLANET_SYMBOLS = {
  Sun: 'Su', Moon: 'Mo', Mars: 'Ma', Mercury: 'Me',
  Jupiter: 'Ju', Venus: 'Ve', Saturn: 'Sa', Rahu: 'Ra', Ketu: 'Ke'
};

const W = 360;
const H = 360;

// cx/cy = label anchor inside each house polygon (nudged inward from edges)
const NI_HOUSES_FINAL = [
  // House 1 — top diamond
  { house: 1,  points: `${W/2},0 ${W/4},${H/4} ${W/2},${H/2} ${3*W/4},${H/4}`,              cx: 180, cy: 78  },
  // House 2 — top-left upper corner triangle
  { house: 2,  points: `0,0 ${W/4},${H/4} ${W/2},0`,                                         cx: 100, cy: 42  },
  // House 3 — top-left lower side triangle
  { house: 3,  points: `0,0 0,${H/2} ${W/4},${H/4}`,                                         cx: 48,  cy: 90  },
  // House 4 — left diamond
  { house: 4,  points: `0,${H/2} ${W/4},${3*H/4} ${W/2},${H/2} ${W/4},${H/4}`,              cx: 90,  cy: 180 },
  // House 5 — bottom-left upper side triangle
  { house: 5,  points: `0,${H/2} 0,${H} ${W/4},${3*H/4}`,                                    cx: 48,  cy: 270 },
  // House 6 — bottom-left lower corner triangle
  { house: 6,  points: `0,${H} ${W/2},${H} ${W/4},${3*H/4}`,                                 cx: 100, cy: 318 },
  // House 7 — bottom diamond
  { house: 7,  points: `${W/2},${H/2} ${W/4},${3*H/4} ${W/2},${H} ${3*W/4},${3*H/4}`,       cx: 180, cy: 282 },
  // House 8 — bottom-right lower corner triangle
  { house: 8,  points: `${W/2},${H} ${W},${H} ${3*W/4},${3*H/4}`,                            cx: 260, cy: 318 },
  // House 9 — bottom-right upper side triangle
  { house: 9,  points: `${3*W/4},${3*H/4} ${W},${H} ${W},${H/2}`,                            cx: 312, cy: 270 },
  // House 10 — right diamond
  { house: 10, points: `${W/2},${H/2} ${3*W/4},${3*H/4} ${W},${H/2} ${3*W/4},${H/4}`,       cx: 270, cy: 180 },
  // House 11 — top-right lower side triangle
  { house: 11, points: `${3*W/4},${H/4} ${W},${H/2} ${W},0`,                                  cx: 312, cy: 90  },
  // House 12 — top-right upper corner triangle
  { house: 12, points: `${W/2},0 ${3*W/4},${H/4} ${W},0`,                                     cx: 260, cy: 42  },
];

const RASHIS = ['Mesha','Vrishabha','Mithuna','Karka','Simha','Kanya','Tula','Vrishchika','Dhanu','Makara','Kumbha','Meena'];

const KundliChartSVG = ({ houses = [], ascendant = '', size = 360 }) => {
  const { themeMode, colors } = useTheme();
  const clipId = useId().replace(/:/g, '');
  const isDark    = themeMode === 'dark';
  const primary   = colors.primary;
  const stroke    = isDark ? 'rgba(212,175,55,0.45)' : 'rgba(120,90,60,0.35)';
  const bg        = isDark ? 'rgba(10,10,10,0.92)' : 'rgba(255,253,240,0.97)';
  const textOutline = isDark ? 'rgba(0,0,0,0.85)' : 'rgba(255,255,255,0.95)';

  const ascIdx = RASHIS.indexOf(ascendant);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.55, ease: 'easeOut' }}
      style={{ width: size, height: size, position: 'relative', margin: '0 auto' }}
    >
      <svg
        viewBox={`0 0 ${W} ${H}`}
        width="100%"
        height="100%"
        style={{ overflow: 'visible' }}
      >
        <defs>
          <clipPath id={`kundli-clip-${clipId}`}>
            <rect x="0" y="0" width={W} height={H} />
          </clipPath>
        </defs>

        <rect x="0" y="0" width={W} height={H} fill={bg} rx="8" />

        <g clipPath={`url(#kundli-clip-${clipId})`}>
          {NI_HOUSES_FINAL.map(({ house, points, cx, cy }, idx) => {
            const houseData  = houses[house - 1];
            const signIdx    = houseData?.sign
              ? RASHIS.indexOf(houseData.sign)
              : (ascIdx >= 0 ? (ascIdx + house - 1) % 12 : house - 1);
            const signNumber = signIdx >= 0 ? signIdx + 1 : house;
            const planets    = houseData?.planets || [];

            const nPlanets   = planets.length;
            const lineHeight = nPlanets > 3 ? 16 : 18;
            const blockHeight = (1 + nPlanets) * lineHeight;
            // Keep the label stack inside the canvas
            const safeCy = Math.min(Math.max(cy, 20 + blockHeight / 2), H - 20 - blockHeight / 2);
            const fontSize = nPlanets > 3 ? 16 : 18;
            const startY = safeCy - blockHeight / 2 + lineHeight * 0.75;

            return (
              <motion.g
                key={house}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.35, delay: idx * 0.04 }}
              >
                <polygon
                  points={points}
                  fill={isDark ? 'rgba(255,255,255,0.025)' : 'rgba(0,0,0,0.015)'}
                  stroke={stroke}
                  strokeWidth="1.5"
                />

                {/* Sign (rashi) number — plain SVG text, no FM x/y */}
                <text
                  x={cx}
                  y={startY}
                  textAnchor="middle"
                  fontSize="22"
                  fontWeight="bold"
                  fontFamily="'Cinzel', serif"
                  fill={primary}
                  stroke={textOutline}
                  strokeWidth="3"
                  paintOrder="stroke"
                >
                  {signNumber}
                </text>

                {/* Planet abbreviations — plain SVG text (FM y would double-offset) */}
                {planets.map((planet, pi) => {
                  const name = typeof planet === 'string' ? planet : planet?.name;
                  if (!name) return null;
                  const py = startY + (pi + 1) * lineHeight;
                  return (
                    <text
                      key={`${house}-${name}-${pi}`}
                      x={cx}
                      y={py}
                      textAnchor="middle"
                      fontSize={fontSize}
                      fontWeight="700"
                      fontFamily="'Inter', 'Segoe UI', sans-serif"
                      fill={PLANET_COLORS[name] || primary}
                      stroke={textOutline}
                      strokeWidth="2.5"
                      paintOrder="stroke"
                    >
                      {PLANET_SYMBOLS[name] || String(name).substring(0, 2)}
                    </text>
                  );
                })}
              </motion.g>
            );
          })}

          <text x={W/2} y={H/2 - 10} textAnchor="middle" fontSize="9"
            fill={isDark ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.25)'}
            stroke={textOutline} strokeWidth="2" paintOrder="stroke"
            fontFamily="'Cinzel', serif">
            {ascendant || 'Lagna'}
          </text>
          <text x={W/2} y={H/2 + 5} textAnchor="middle" fontSize="11"
            fill={primary} fontFamily="'Cinzel', serif">
            ॐ
          </text>
        </g>

        {[[0,0],[W,0],[0,H],[W,H]].map(([x,y],i) => (
          <motion.circle key={i} cx={x} cy={y} r={4} fill={primary}
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }}
          />
        ))}
      </svg>
    </motion.div>
  );
};

export default KundliChartSVG;
