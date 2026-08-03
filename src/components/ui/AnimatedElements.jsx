import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

const AnimatedElements = ({ size = 300, opacity = 0.1, className = '', style = {} }) => {
  const { colors } = useTheme();
  
  return (
    <div 
      className={`animated-elements-container ${className}`}
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
        <motion.g
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: '100px 100px' }}
        >
          {/* Main Balance Ring */}
          <circle cx="100" cy="100" r="80" fill="none" stroke={colors.primary || "#FF9933"} strokeWidth="1" opacity="0.6"/>
          
          {/* 4 Element Orbs Orbiting */}
          <circle cx="100" cy="20" r="10" fill="#FF4D4D" opacity="0.8"/> {/* Fire */}
          <circle cx="100" cy="180" r="10" fill="#00BFFF" opacity="0.8"/> {/* Water */}
          <circle cx="20" cy="100" r="10" fill="#4CAF50" opacity="0.8"/> {/* Earth */}
          <circle cx="180" cy="100" r="10" fill="#FFD700" opacity="0.8"/> {/* Air */}
          
          {/* Inner Connecting Lines */}
          <line x1="100" y1="20" x2="100" y2="180" stroke={colors.primary || "#FF9933"} strokeWidth="0.5" strokeDasharray="2 4" opacity="0.5"/>
          <line x1="20" y1="100" x2="180" y2="100" stroke={colors.primary || "#FF9933"} strokeWidth="0.5" strokeDasharray="2 4" opacity="0.5"/>
        </motion.g>

        {/* Inner Counter-Rotating Flower of Life core */}
        <motion.g
          animate={{ rotate: -360 }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: '100px 100px' }}
        >
          <circle cx="100" cy="100" r="40" fill="none" stroke={colors.primary || "#FF9933"} strokeWidth="1" opacity="0.6"/>
          {/* Overlapping circles */}
          {[0, 60, 120, 180, 240, 300].map((angle, i) => (
            <circle 
              key={`flower-${i}`}
              cx={100 + 20 * Math.cos(angle * Math.PI / 180)}
              cy={100 + 20 * Math.sin(angle * Math.PI / 180)}
              r="20"
              fill="none"
              stroke={colors.primary || "#FF9933"}
              strokeWidth="0.5"
              opacity="0.5"
            />
          ))}
          <motion.circle 
            cx="100" cy="100" r="5" 
            fill={colors.primary || "#FF9933"}
            animate={{ scale: [1, 1.5, 1] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.g>
      </motion.svg>
    </div>
  );
};

export default AnimatedElements;
