import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import SectionHeading from '../ui/SectionHeading';

const PLANETS = [
  { id: 'sun', name: 'Surya (Sun)', color: '#FF4500', meaning: 'Soul, Power, Career', icon: '/icons/sun.png' },
  { id: 'moon', name: 'Chandra (Moon)', color: '#E0F7FA', meaning: 'Mind, Emotions, Mother', icon: '/icons/moon.png' },
  { id: 'mars', name: 'Mangala (Mars)', color: '#FF3333', meaning: 'Energy, Courage, Property', icon: '/icons/mars.png' },
  { id: 'mercury', name: 'Budha (Mercury)', color: '#00E676', meaning: 'Intellect, Communication, Business', icon: '/icons/mercury.png' },
  { id: 'jupiter', name: 'Guru (Jupiter)', color: '#FFD700', meaning: 'Wisdom, Wealth, Expansion', icon: '/icons/jupiter.png' },
  { id: 'venus', name: 'Shukra (Venus)', color: '#FF69B4', meaning: 'Love, Luxury, Relationships', icon: '/icons/venus.png' },
  { id: 'saturn', name: 'Shani (Saturn)', color: '#9C27B0', meaning: 'Discipline, Karma, Longevity', icon: '/icons/saturn.png' },
  { id: 'rahu', name: 'Rahu (North Node)', color: '#00BCD4', meaning: 'Ambition, Illusions, Foreign Travel', icon: '/icons/north-node.png' },
  { id: 'ketu', name: 'Ketu (South Node)', color: '#FF9800', meaning: 'Spirituality, Liberation, Detachment', icon: '/icons/south-node.png' },
];

const NavagrahaBooking = ({ setSelectedFeature }) => {
  const { colors, themeMode } = useTheme();
  const isDark = themeMode === 'dark';

  return (
    <section id="navagraha" className="section section--alt container" style={{ position: 'relative' }}>
      <SectionHeading>Navagraha Shanti</SectionHeading>
      <p style={{ textAlign: 'center', marginBottom: '60px', color: colors.text, opacity: 0.8, fontSize: '1.1rem' }}>
        Select a planet to book a specific Puja, remedy, or consultation to harmonize its cosmic energy.
      </p>

      <div className="navagraha-grid" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '32px',
        justifyContent: 'center'
      }}>
        {PLANETS.map((planet, index) => (
          <motion.div
            key={planet.id}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.5, type: 'spring' }}
            whileHover={{ y: -8, scale: 1.02 }}
            onClick={() => {
              if (setSelectedFeature) {
                setSelectedFeature({
                  title: `${planet.name} Consultation`,
                  description: `Book a specialized consultation or remedy for ${planet.name} focusing on ${planet.meaning}.`
                });
              }
              document.getElementById('booking-form')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="glass-panel"
            style={{
              padding: '30px',
              borderRadius: '24px',
              border: '1px solid var(--border-gold)',
              background: `linear-gradient(145deg, var(--color-surface) 0%, var(--color-surface-variant) 60%, var(--color-primary-container) 100%)`,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              cursor: 'pointer',
              boxShadow: isDark ? `0 10px 30px ${planet.color}15` : `0 8px 24px rgba(0,0,0,0.06)`,
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* Background Glow */}
            <div style={{
              position: 'absolute', top: '-50%', left: '-50%', width: '200%', height: '200%',
              background: `radial-gradient(circle, ${planet.color}22 0%, transparent 60%)`,
              zIndex: 0, pointerEvents: 'none'
            }} />

            {/* Animated Planet Icon */}
            <motion.div
              animate={{ 
                y: [0, -10, 0],
                filter: [
                  `drop-shadow(0 5px 15px ${planet.color}66)`,
                  `drop-shadow(0 15px 25px ${planet.color}AA)`,
                  `drop-shadow(0 5px 15px ${planet.color}66)`
                ]
              }}
              transition={{ 
                duration: 4 + (index % 3), 
                repeat: Infinity, 
                ease: 'easeInOut',
                delay: index * 0.2
              }}
              style={{
                width: ['saturn', 'rahu', 'ketu'].includes(planet.id) ? '160px' : '90px', 
                height: ['saturn', 'rahu', 'ketu'].includes(planet.id) ? '160px' : '90px',
                marginBottom: '20px', zIndex: 1,
                display: 'flex', justifyContent: 'center', alignItems: 'center'
              }}
            >
              <img 
                src={planet.icon} 
                alt={planet.name} 
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'contain',
                  transform: ['saturn', 'rahu', 'ketu'].includes(planet.id) ? 'scale(1.3)' : 'none',
                  transition: 'transform 0.3s ease'
                }} 
              />
            </motion.div>

            <h3 style={{ fontFamily: 'var(--font-heading)', color: colors.primary, fontSize: '1.4rem', marginBottom: '8px', zIndex: 1 }}>
              {planet.name}
            </h3>
            <p style={{ fontSize: '0.85rem', color: colors.secondary, opacity: 0.95, textAlign: 'center', zIndex: 1, letterSpacing: '0.02em' }}>
              {planet.meaning}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default NavagrahaBooking;
