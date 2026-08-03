import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

/**
 * PlanetOrbit — SVG solar system with 5 glowing planets orbiting a central sun.
 * Used in Hero right column as a premium decorative element.
 */
const PLANETS = [
  { name: 'Mercury', radius: 55,  size: 5,  duration: 8,   color: '#40E0D0', delay: 0 },
  { name: 'Venus',   radius: 80,  size: 7,  duration: 13,  color: '#FF69B4', delay: 1.5 },
  { name: 'Mars',    radius: 108, size: 6,  duration: 20,  color: '#FF4444', delay: 0.8 },
  { name: 'Jupiter', radius: 140, size: 10, duration: 30,  color: '#FFB347', delay: 2 },
  { name: 'Saturn',  radius: 175, size: 8,  duration: 45,  color: '#9370DB', delay: 1 },
];

const CX = 200;
const CY = 200;

const PlanetOrbit = ({ size = 400, opacity = 0.9 }) => {
  const { themeMode } = useTheme();
  const sunColor = themeMode === 'dark' ? '#d4af37' : '#FF9933';

  return (
    <div style={{
      width: size,
      height: size,
      position: 'relative',
      pointerEvents: 'none',
      opacity,
    }}>
      <svg viewBox="0 0 400 400" width="100%" height="100%">
        <defs>
          {PLANETS.map(p => (
            <radialGradient key={`grad-${p.name}`} id={`grad-${p.name}`} cx="30%" cy="30%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
              <stop offset="100%" stopColor={p.color} stopOpacity="1" />
            </radialGradient>
          ))}
          <radialGradient id="sunGrad" cx="35%" cy="35%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
            <stop offset="50%" stopColor={sunColor} stopOpacity="1" />
            <stop offset="100%" stopColor="#FF6600" stopOpacity="0.8" />
          </radialGradient>
          <filter id="glow-strong">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          <filter id="glow-soft">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          <filter id="sun-glow">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>

        {/* Orbit rings */}
        {PLANETS.map(p => (
          <circle
            key={`ring-${p.name}`}
            cx={CX} cy={CY} r={p.radius}
            fill="none"
            stroke={themeMode === 'dark' ? 'rgba(212,175,55,0.12)' : 'rgba(0,0,0,0.08)'}
            strokeWidth="1"
            strokeDasharray="3 6"
          />
        ))}

        {/* Central Sun */}
        <motion.circle
          cx={CX} cy={CY} r={18}
          fill="url(#sunGrad)"
          filter="url(#sun-glow)"
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: `${CX}px ${CY}px` }}
        />
        {/* Sun corona rays */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
          <motion.line
            key={i}
            x1={CX + 20 * Math.cos(angle * Math.PI / 180)}
            y1={CY + 20 * Math.sin(angle * Math.PI / 180)}
            x2={CX + 30 * Math.cos(angle * Math.PI / 180)}
            y2={CY + 30 * Math.sin(angle * Math.PI / 180)}
            stroke={sunColor}
            strokeWidth="1.5"
            strokeLinecap="round"
            animate={{ opacity: [0.3, 0.9, 0.3] }}
            transition={{ duration: 2 + i * 0.2, repeat: Infinity, delay: i * 0.15 }}
          />
        ))}

        {/* Orbiting planets */}
        {PLANETS.map(p => (
          <motion.g
            key={p.name}
            animate={{ rotate: 360 }}
            transition={{ duration: p.duration, repeat: Infinity, ease: 'linear', delay: p.delay }}
            style={{ transformOrigin: `${CX}px ${CY}px` }}
          >
            {/* Planet dot at top of orbit */}
            <circle
              cx={CX}
              cy={CY - p.radius}
              r={p.size}
              fill={`url(#grad-${p.name})`}
              filter="url(#glow-soft)"
            />
            {/* Trail */}
            <circle
              cx={CX}
              cy={CY - p.radius}
              r={p.size + 3}
              fill="none"
              stroke={p.color}
              strokeWidth="1"
              opacity="0.25"
            />
          </motion.g>
        ))}

        {/* Saturn ring (special) */}
        <motion.g
          animate={{ rotate: 360 }}
          transition={{ duration: 45, repeat: Infinity, ease: 'linear', delay: 1 }}
          style={{ transformOrigin: `${CX}px ${CY}px` }}
        >
          <ellipse
            cx={CX}
            cy={CY - 175}
            rx={14}
            ry={4}
            fill="none"
            stroke="#9370DB"
            strokeWidth="2"
            opacity="0.6"
          />
        </motion.g>

        {/* Outer constellation dots */}
        {[0, 72, 144, 216, 288].map((angle, i) => {
          const r = 195;
          return (
            <motion.circle
              key={`star-${i}`}
              cx={CX + r * Math.cos(angle * Math.PI / 180)}
              cy={CY + r * Math.sin(angle * Math.PI / 180)}
              r={1.5}
              fill={sunColor}
              animate={{ opacity: [0.2, 0.8, 0.2] }}
              transition={{ duration: 2 + i * 0.4, repeat: Infinity, delay: i * 0.5 }}
            />
          );
        })}
      </svg>
    </div>
  );
};

export default PlanetOrbit;
