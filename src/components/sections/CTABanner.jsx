import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import CosmicStarfield from '../ui/CosmicStarfield';

const CTABanner = () => {
  const { themeMode } = useTheme();
  
  const bgColor = themeMode === 'dark' 
    ? 'rgba(212, 175, 55, 0.08)' 
    : 'var(--color-on-surface)';

  return (
    <motion.section 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      style={{ 
        backgroundColor: bgColor,
        padding: '80px 20px',
        textAlign: 'center',
        margin: '60px 0',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Starfield overlay */}
      <CosmicStarfield starCount={80} opacity={themeMode === 'dark' ? 0.4 : 0.15} />

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
        {/* Decorative symbol */}
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          style={{
            fontSize: '2rem', marginBottom: '16px', display: 'inline-block',
            color: themeMode === 'dark' ? 'var(--color-primary)' : 'rgba(255,255,255,0.6)'
          }}
        >
          ✦
        </motion.div>

        <h2 style={{ 
          fontFamily: 'var(--font-heading)', 
          fontSize: 'clamp(2rem, 4vw, 3rem)',
          color: themeMode === 'dark' ? 'var(--color-primary)' : 'var(--color-surface)',
          marginBottom: '20px'
        }}>
          Your Stars Are Aligned. Are You Ready?
        </h2>
        
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: '1.125rem', lineHeight: '1.6',
          color: 'var(--color-surface)', opacity: 0.9, marginBottom: '40px'
        }}>
          Book a personal consultation with Ashay Krishn Goswami and get clarity on life's most important decisions.
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
          Book a Consultation ✦
        </motion.button>

        {/* Trust signals */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '32px', marginTop: '32px', flexWrap: 'wrap' }}>
          {['★★★★★ 4.9 Rating', '5000+ Consultations', 'Since 2019'].map(text => (
            <span key={text} style={{
              fontSize: '0.82rem', color: 'rgba(255,255,255,0.65)',
              fontFamily: 'var(--font-body)', letterSpacing: '0.04em'
            }}>{text}</span>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default CTABanner;


