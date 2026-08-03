import React from 'react';
import { motion } from 'framer-motion';

const AnimatedEnergyBalance = ({ size = 300, opacity = 0.15, className = '', style = {} }) => {
  // Traditional chakra colors from root to crown
  const chakraColors = [
    '#FF4D4D', // Root (Red)
    '#FF9933', // Sacral (Orange)
    '#FFD700', // Solar Plexus (Yellow)
    '#4CAF50', // Heart (Green)
    '#00BFFF', // Throat (Blue)
    '#4B0082', // Third Eye (Indigo)
    '#9400D3'  // Crown (Violet)
  ];

  return (
    <div 
      className={`animated-energy-container ${className}`}
      style={{
        width: size / 2, // narrower width
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
        viewBox="0 0 100 400" 
        width="100%" 
        height="100%" 
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Central Energy Line */}
        <motion.line 
          x1="50" y1="40" x2="50" y2="360" 
          stroke="#FFD700" 
          strokeWidth="2"
          strokeDasharray="4 4"
          animate={{ strokeDashoffset: [0, -20] }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          opacity="0.5"
        />

        {/* Chakras */}
        {chakraColors.map((color, index) => {
          const cy = 360 - (index * 53); // Spaced from bottom to top
          return (
            <motion.g key={`chakra-${index}`}>
              {/* Outer Glow Pulse */}
              <motion.circle
                cx="50"
                cy={cy}
                r="18"
                fill="none"
                stroke={color}
                strokeWidth="1"
                animate={{ 
                  scale: [1, 1.3, 1],
                  opacity: [0.3, 0.8, 0.3]
                }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity, 
                  ease: "easeInOut",
                  delay: index * 0.3 // Cascade effect
                }}
              />
              {/* Core */}
              <motion.circle
                cx="50"
                cy={cy}
                r="10"
                fill={color}
                opacity="0.85"
                animate={{ scale: [0.9, 1.1, 0.9] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: index * 0.3 }}
              />
            </motion.g>
          );
        })}
      </motion.svg>
    </div>
  );
};

export default AnimatedEnergyBalance;
