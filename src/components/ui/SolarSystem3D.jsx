import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { motion } from 'framer-motion';

const PLANETS = [
  { name: 'Mercury', distance: 40, size: 4, speed: 4, color: '#A0522D' },
  { name: 'Venus', distance: 65, size: 6, speed: 7, color: '#DEB887' },
  { name: 'Earth', distance: 95, size: 7, speed: 10, color: '#4169E1' },
  { name: 'Mars', distance: 125, size: 5, speed: 18, color: '#CD5C5C' },
  { name: 'Jupiter', distance: 170, size: 14, speed: 30, color: '#DAA520' },
];

const SolarSystem3D = ({ size = 450 }) => {
  const { themeMode } = useTheme();
  const isDark = themeMode === 'dark';
  const sunColor = isDark ? '#FFD700' : '#FF8C00';
  const orbitColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';

  return (
    <div style={{
      width: size,
      height: size,
      position: 'relative',
      perspective: '1000px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transformStyle: 'preserve-3d'
    }}>
      <motion.div
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          transformStyle: 'preserve-3d',
          transform: 'rotateX(70deg)'
        }}
        animate={{ rotateZ: 360 }}
        transition={{ duration: 100, repeat: Infinity, ease: 'linear' }}
      >
        {/* Sun */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '40px',
          height: '40px',
          background: `radial-gradient(circle at 30% 30%, #fff, ${sunColor}, #FF4500)`,
          borderRadius: '50%',
          transform: 'translate(-50%, -50%) rotateX(-70deg)',
          boxShadow: `0 0 40px ${sunColor}88`,
          zIndex: 10
        }} />

        {/* Orbits and Planets */}
        {PLANETS.map((planet, index) => (
          <div key={planet.name} style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: `${planet.distance * 2}px`,
            height: `${planet.distance * 2}px`,
            border: `1px solid ${orbitColor}`,
            borderRadius: '50%',
            transform: 'translate(-50%, -50%)',
            transformStyle: 'preserve-3d'
          }}>
            <motion.div
              style={{
                position: 'absolute',
                top: 0,
                left: '50%',
                width: '100%',
                height: '100%',
                transformOrigin: '50% 50%',
                transformStyle: 'preserve-3d'
              }}
              animate={{ rotateZ: 360 }}
              transition={{ duration: planet.speed, repeat: Infinity, ease: 'linear' }}
            >
              <div style={{
                position: 'absolute',
                top: `-${planet.size / 2}px`,
                left: `calc(50% - ${planet.size / 2}px)`,
                width: `${planet.size}px`,
                height: `${planet.size}px`,
                background: `radial-gradient(circle at 30% 30%, #fff, ${planet.color})`,
                borderRadius: '50%',
                transform: 'rotateX(-70deg)',
                boxShadow: `0 0 10px ${planet.color}44`
              }} />
            </motion.div>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default SolarSystem3D;
