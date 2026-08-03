import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import CosmicStarfield from '../ui/CosmicStarfield';

const KUNDLI_DIAMOND_SVG = `
  <rect x="2" y="2" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.2" />
  <line x1="2" y1="2" x2="22" y2="22" stroke="currentColor" strokeWidth="1" />
  <line x1="2" y1="22" x2="22" y2="2" stroke="currentColor" strokeWidth="1" />
  <polygon points="12,2 22,12 12,22 2,12" fill="none" stroke="currentColor" strokeWidth="1" />
`;

const QUILL_PEN_SVG = `
  <path fill="currentColor" d="M21 3C15 3 10 7 8 11L4 15L3 21L9 20L13 16C17 14 21 9 21 3Z" opacity="0.3"/>
  <path stroke="currentColor" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M21 3C15 3 10 7 8 11L4 15L3 21L9 20L13 16C17 14 21 9 21 3Z"/>
  <line x1="8" y1="11" x2="13" y2="16" stroke="currentColor" strokeWidth="1.2"/>
`;

const SCROLL_PARCHMENT_SVG = `
  <path stroke="currentColor" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M19 3H7A2 2 0 0 0 5 5V19A2 2 0 0 0 7 21H19A2 2 0 0 0 21 19V5A2 2 0 0 0 19 3Z" />
  <path stroke="currentColor" fill="none" strokeWidth="1.2" strokeLinecap="round" d="M9 7H17M9 11H17M9 15H13" />
  <path stroke="currentColor" fill="none" strokeWidth="1.5" d="M3 7V17A2 2 0 0 0 5 19" />
`;

const SACRED_SUN_YANTRA = `
  <circle cx="12" cy="12" r="9" stroke="currentColor" fill="none" strokeWidth="1.2" />
  <circle cx="12" cy="12" r="4" stroke="currentColor" fill="none" strokeWidth="1" />
  <path d="M12 1v4M12 19v4M1 12h4M19 12h4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" stroke="currentColor" strokeWidth="1.2" />
`;

const SACRED_LOTUS_SVG = `
  <path fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" d="M12 4C10 7 8 10 8 13C8 16 10 18 12 18C14 18 16 16 16 13C16 10 14 7 12 4Z"/>
  <path fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" d="M12 18C8 18 4 15 3 11C6 11 9 13 12 18Z"/>
  <path fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" d="M12 18C16 18 20 15 21 11C18 11 15 13 12 18Z"/>
`;

const STARBURST_SVG = `
  <path fill="currentColor" d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
`;

const KUNDLI_CTA_DECORS = [
  { svg: KUNDLI_DIAMOND_SVG, top: '10%', left: '4%', size: 54, dur: 7, delay: 0, rot: 15 },
  { svg: QUILL_PEN_SVG, top: '15%', right: '5%', size: 48, dur: 8.5, delay: 0.5, rot: -25 },
  { svg: SCROLL_PARCHMENT_SVG, bottom: '12%', left: '6%', size: 46, dur: 9, delay: 1, rot: 12 },
  { svg: SACRED_SUN_YANTRA, bottom: '10%', right: '7%', size: 52, dur: 10, delay: 1.5, rot: -10 },
  { svg: SACRED_LOTUS_SVG, top: '45%', left: '1%', size: 40, dur: 6.5, delay: 2, rot: 8 },
  { svg: KUNDLI_DIAMOND_SVG, top: '48%', right: '2%', size: 42, dur: 8, delay: 0.8, rot: -18 },
  { svg: STARBURST_SVG, top: '8%', left: '25%', size: 22, dur: 4.5, delay: 0.2, rot: 0 },
  { svg: STARBURST_SVG, bottom: '15%', right: '25%', size: 26, dur: 5, delay: 1.2, rot: 45 },
];

const HandmadeKundliDribbbleArt = ({ accentColor }) => {
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1, overflow: 'hidden' }}>
      {KUNDLI_CTA_DECORS.map((item, idx) => (
        <motion.div
          key={idx}
          animate={{
            y: [0, -14, 0],
            rotate: [item.rot, item.rot + 12, item.rot],
            opacity: [0.15, 0.32, 0.15],
            scale: [0.95, 1.05, 0.95]
          }}
          transition={{
            duration: item.dur,
            repeat: Infinity,
            delay: item.delay,
            ease: 'easeInOut'
          }}
          style={{
            position: 'absolute',
            top: item.top,
            left: item.left,
            right: item.right,
            bottom: item.bottom,
            color: accentColor,
            width: item.size,
            height: item.size,
            filter: `drop-shadow(0 0 8px ${accentColor}66)`
          }}
        >
          <svg viewBox="0 0 24 24" width="100%" height="100%" dangerouslySetInnerHTML={{ __html: item.svg }} />
        </motion.div>
      ))}
    </div>
  );
};

const HandmadeKundliCTA = () => {
  const { themeMode } = useTheme();
  
  const bgColor = themeMode === 'dark' 
    ? 'rgba(212, 175, 55, 0.08)' 
    : 'var(--color-on-surface)';
  
  const accentColor = themeMode === 'dark' ? '#D4AF37' : '#FFFFFF';

  return (
    <motion.section 
      id="handmade-kundli"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="section"
      style={{ 
        backgroundColor: bgColor,
        textAlign: 'center',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Starfield overlay with intense meteor shower */}
      <CosmicStarfield starCount={80} opacity={themeMode === 'dark' ? 0.4 : 0.15} meteorShower={true} />
      <HandmadeKundliDribbbleArt accentColor={accentColor} />

      {/* Shimmer sweep */}
      <div style={{
        position: 'absolute', top: 0, left: '-100%', width: '60%', height: '100%',
        background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.04) 50%, transparent 100%)',
        animation: 'shimmer-sweep 6s ease-in-out infinite',
        pointerEvents: 'none', zIndex: 1,
        transform: 'skewX(-15deg)',
      }} />

      {/* Gold accent lines */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
        background: themeMode === 'dark'
          ? 'linear-gradient(90deg, transparent, rgba(212,175,55,0.6), transparent)'
          : 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
        zIndex: 2,
      }} />
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '2px',
        background: themeMode === 'dark'
          ? 'linear-gradient(90deg, transparent, rgba(212,175,55,0.6), transparent)'
          : 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
        zIndex: 2,
      }} />

      <div className="container" style={{ maxWidth: '800px', position: 'relative', zIndex: 3 }}>
        <h2 style={{ 
          fontFamily: 'var(--font-heading)', 
          fontSize: 'clamp(2rem, 4vw, 3rem)',
          color: themeMode === 'dark' ? 'var(--color-primary)' : 'var(--color-surface)',
          marginBottom: '20px'
        }}>
          Personalized Handmade Kundli
        </h2>
        
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: '1.125rem', lineHeight: '1.6',
          color: themeMode === 'dark' ? 'var(--color-text)' : 'var(--color-surface)', 
          opacity: 0.9, marginBottom: '40px'
        }}>
          Experience the authenticity of a traditionally crafted, handwritten Kundli. Deep, accurate, and uniquely yours, beautifully presented for generations to come.
        </p>

        <motion.button 
          onClick={() => document.getElementById('booking-form')?.scrollIntoView({ behavior: 'smooth' })}
          whileHover={{ scale: 1.05, y: -3 }}
          whileTap={{ scale: 0.97 }}
          style={{
            backgroundColor: '#FFFFFF', color: '#111111',
            fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: '700',
            padding: '16px 40px', borderRadius: '30px', border: 'none', cursor: 'pointer',
            boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
            position: 'relative', overflow: 'hidden',
          }}
        >
          {/* Shimmer on button */}
          <span style={{
            position: 'absolute', top: 0, left: '-100%', width: '60%', height: '100%',
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
            animation: 'shimmer-sweep 3s ease-in-out infinite',
            pointerEvents: 'none',
          }} />
          Order Now ✦
        </motion.button>
      </div>
    </motion.section>
  );
};

export default HandmadeKundliCTA;
