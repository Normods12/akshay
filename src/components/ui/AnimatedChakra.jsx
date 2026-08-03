import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

const AnimatedChakra = ({ size = 400, opacity = 0.1, className = '', style = {}, showAum = false }) => {
  const { colors } = useTheme();
  const baseColor = colors.primary || '#FF9933';

  return (
    <div 
      className={`animated-chakra-container ${className}`}
      style={{
        width: size,
        height: size,
        opacity: opacity,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        pointerEvents: 'none',
        ...style
      }}
    >
      <motion.svg 
        viewBox="0 0 200 200" 
        width="100%" 
        height="100%" 
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Outermost pulsing glow ring */}
        <motion.circle
          cx="100" cy="100" r="96"
          fill="none" stroke={baseColor} strokeWidth="2"
          animate={{ opacity: [0.05, 0.35, 0.05], scale: [0.96, 1.03, 0.96] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: '100px 100px', filter: `drop-shadow(0 0 6px ${baseColor})` }}
        />

        {/* Outer Ring 1 - Slow Spin */}
        <motion.g
          animate={{ rotate: 360 }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: '100px 100px' }}
        >
          <circle cx="100" cy="100" r="90" fill="none" stroke={baseColor} strokeWidth="1" strokeDasharray="4 6" opacity="0.6"/>
          <circle cx="100" cy="100" r="85" fill="none" stroke={baseColor} strokeWidth="0.5" opacity="0.4"/>
          {/* Small outer circles */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
            <circle 
              key={`outer-${i}`}
              cx={100 + 90 * Math.cos(angle * Math.PI / 180)}
              cy={100 + 90 * Math.sin(angle * Math.PI / 180)}
              r="2.5"
              fill={baseColor}
            />
          ))}
        </motion.g>

        {/* Golden shimmer ring */}
        <motion.circle
          cx="100" cy="100" r="88"
          fill="none" stroke={baseColor} strokeWidth="0.8"
          strokeDasharray="8 16"
          animate={{ rotate: -360 }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
          style={{ transformOrigin: '100px 100px', opacity: 0.3 }}
        />

        {/* Lotus Petals - Medium Spin Reverse + Pulse */}
        <motion.g
          animate={{ 
            rotate: -360,
            scale: [1, 1.05, 1] 
          }}
          transition={{ 
            rotate: { duration: 30, repeat: Infinity, ease: "linear" },
            scale: { duration: 4, repeat: Infinity, ease: "easeInOut" }
          }}
          style={{ transformOrigin: '100px 100px' }}
        >
          {/* 8 Lotus Petals */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
            <path
              key={`petal-${i}`}
              d="M 100 100 Q 130 50 100 20 Q 70 50 100 100"
              fill="none"
              stroke={baseColor}
              strokeWidth="1.5"
              opacity="0.8"
              transform={`rotate(${angle} 100 100)`}
            />
          ))}
        </motion.g>

        {/* Inner Ring - Fast Spin */}
        <motion.g
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: '100px 100px' }}
        >
          <circle cx="100" cy="100" r="35" fill="none" stroke={baseColor} strokeWidth="2" strokeDasharray="10 5" opacity="0.8"/>
          {/* Triangles (Sri Yantra vibe) */}
          <polygon points="100,70 125,115 75,115" fill="none" stroke={baseColor} strokeWidth="1" opacity="0.7"/>
          <polygon points="100,130 125,85 75,85" fill="none" stroke={baseColor} strokeWidth="1" opacity="0.7"/>
        </motion.g>

        {/* Core Glowing Center - Pulse */}
        <motion.circle
          cx="100" cy="100" r="14"
          fill={baseColor}
          animate={{ opacity: [0.4, 1, 0.4], scale: [0.9, 1.25, 0.9] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: '100px 100px', filter: `drop-shadow(0 0 8px ${baseColor})` }}
        />
        <circle cx="100" cy="100" r="6" fill={colors.surface || '#FFF'} opacity="0.9"/>

        {/* Aum symbol at center (optional) */}
        {showAum && (
          <text
            x="100" y="104"
            textAnchor="middle"
            fontSize="10"
            fill={colors.surface || '#FFF'}
            fontFamily="serif"
            opacity="0.85"
          >
            ॐ
          </text>
        )}
      </motion.svg>
    </div>
  );
};

export default AnimatedChakra;
