import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import SectionHeading from '../ui/SectionHeading';
import MandalaArt from '../ui/MandalaArt';
import HoroscopeModal from '../ui/HoroscopeModal';
import LoginModal from '../auth/LoginModal';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const MagicalDust = () => {
  return (
    <div style={{ position: 'absolute', inset: -40, pointerEvents: 'none', zIndex: 2, overflow: 'visible' }}>
      {[...Array(35)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ 
            opacity: 0, 
            y: Math.random() * 100 + 50,
            x: (Math.random() - 0.5) * 400
          }}
          animate={{ 
            opacity: [0, 1, 0],
            y: Math.random() * -200 - 50,
            x: (Math.random() - 0.5) * 400 + (Math.random() - 0.5) * 100
          }}
          transition={{
            duration: Math.random() * 3 + 2,
            repeat: Infinity,
            delay: Math.random() * 2,
            ease: "easeInOut"
          }}
          style={{
            position: 'absolute',
            bottom: '10%',
            left: '50%',
            width: Math.random() * 4 + 2 + 'px',
            height: Math.random() * 4 + 2 + 'px',
            backgroundColor: '#FFD700',
            borderRadius: '50%',
            boxShadow: '0 0 10px 3px rgba(255, 215, 0, 0.8), 0 0 20px 5px rgba(255, 215, 0, 0.4)',
            filter: 'blur(0.5px)'
          }}
        />
      ))}
    </div>
  );
};

const ZODIAC_ICONS = {
  'aries': `
    <path stroke="currentColor" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M12 5a5 5 0 1 0 -4 8" />
    <path stroke="currentColor" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M16 13a5 5 0 1 0 -4 -8" />
    <path stroke="currentColor" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M12 21l0 -16" />
  `,
  'taurus': `
    <path stroke="currentColor" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M6 3a6 6 0 0 0 12 0" />
    <path stroke="currentColor" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M6 15a6 6 0 1 0 12 0a6 6 0 1 0 -12 0" />
  `,
  'gemini': `
    <path stroke="currentColor" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M3 3a21 21 0 0 0 18 0" />
    <path stroke="currentColor" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M3 21a21 21 0 0 1 18 0" />
    <path stroke="currentColor" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M7 4.5l0 15" />
    <path stroke="currentColor" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M17 4.5l0 15" />
  `,
  'cancer': `
    <path stroke="currentColor" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M3 12a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
    <path stroke="currentColor" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
    <path stroke="currentColor" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M3 12a10 6.5 0 0 1 14 -6.5" />
    <path stroke="currentColor" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M21 12a10 6.5 0 0 1 -14 6.5" />
  `,
  'leo': `
    <path stroke="currentColor" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M13 17a4 4 0 1 0 8 0" />
    <path stroke="currentColor" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M3 16a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
    <path stroke="currentColor" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M7 7a4 4 0 1 0 8 0a4 4 0 1 0 -8 0" />
    <path stroke="currentColor" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M7 7c0 3 2 5 2 9" />
    <path stroke="currentColor" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M15 7c0 4 -2 6 -2 10" />
  `,
  'virgo': `
    <path stroke="currentColor" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M3 4a2 2 0 0 1 2 2v9" />
    <path stroke="currentColor" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M5 6a2 2 0 0 1 4 0v9" />
    <path stroke="currentColor" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M9 6a2 2 0 0 1 4 0v10a7 5 0 0 0 7 5" />
    <path stroke="currentColor" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M12 21a7 5 0 0 0 7 -5v-2a3 3 0 0 0 -6 0" />
  `,
  'libra': `
    <path stroke="currentColor" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M5 20l14 0" />
    <path stroke="currentColor" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M5 17h5v-.3a7 7 0 1 1 4 0v.3h5" />
  `,
  'scorpio': `
    <path stroke="currentColor" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M3 4a2 2 0 0 1 2 2v9" />
    <path stroke="currentColor" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M5 6a2 2 0 0 1 4 0v9" />
    <path stroke="currentColor" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M9 6a2 2 0 0 1 4 0v10a3 3 0 0 0 3 3h5l-3 -3m0 6l3 -3" />
  `,
  'sagittarius': `
    <path stroke="currentColor" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M4 20l16 -16" />
    <path stroke="currentColor" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M13 4h7v7" />
    <path stroke="currentColor" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M6.5 12.5l5 5" />
  `,
  'capricorn': `
    <path stroke="currentColor" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M4 4a3 3 0 0 1 3 3v9" />
    <path stroke="currentColor" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M7 7a3 3 0 0 1 6 0v11a3 3 0 0 1 -3 3" />
    <path stroke="currentColor" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M13 17a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
  `,
  'aquarius': `
    <path stroke="currentColor" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M3 10l3 -3l3 3l3 -3l3 3l3 -3l3 3" />
    <path stroke="currentColor" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M3 17l3 -3l3 3l3 -3l3 3l3 -3l3 3" />
  `,
  'pisces': `
    <path stroke="currentColor" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M5 3a21 21 0 0 1 0 18" />
    <path stroke="currentColor" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M19 3a21 21 0 0 0 0 18" />
    <path stroke="currentColor" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M5 12l14 0" />
  `
};

const ZODIAC_SIGNS = [
  { id: 'aries', name: 'Aries', rashi: 'Mesha', image: 'aries.png' },
  { id: 'taurus', name: 'Taurus', rashi: 'Vrishabha', image: 'taurus.png' },
  { id: 'gemini', name: 'Gemini', rashi: 'Mithuna', image: 'gemini.png' },
  { id: 'cancer', name: 'Cancer', rashi: 'Karka', image: 'cancer.png' },
  { id: 'leo', name: 'Leo', rashi: 'Simha', image: 'leo.png' },
  { id: 'virgo', name: 'Virgo', rashi: 'Kanya', image: 'virgo.png' },
  { id: 'libra', name: 'Libra', rashi: 'Tula', image: 'libra.png' },
  { id: 'scorpio', name: 'Scorpio', rashi: 'Vrishchika', image: 'scorpio.png' },
  { id: 'sagittarius', name: 'Sagittarius', rashi: 'Dhanu', image: 'sagitarius.png' },
  { id: 'capricorn', name: 'Capricorn', rashi: 'Makara', image: 'capricorn.png' },
  { id: 'aquarius', name: 'Aquarius', rashi: 'Kumbha', image: 'aquarius.png' },
  { id: 'pisces', name: 'Pisces', rashi: 'Meena', image: 'pisces.png' }
];

const FLOATING_DECORS = [
  { icon: ZODIAC_ICONS.aries, top: '2%', left: '2%', size: 52, duration: 7, delay: 0, rotate: 12 },
  { icon: ZODIAC_ICONS.leo, top: '12%', right: '2%', size: 58, duration: 9, delay: 1, rotate: -20 },
  { icon: ZODIAC_ICONS.scorpio, bottom: '6%', left: '1%', size: 54, duration: 8, delay: 0.5, rotate: 15 },
  { icon: ZODIAC_ICONS.sagittarius, bottom: '4%', right: '3%', size: 48, duration: 10, delay: 1.5, rotate: -10 },
  { icon: ZODIAC_ICONS.taurus, top: '48%', left: '-1%', size: 44, duration: 6, delay: 2, rotate: 25 },
  { icon: ZODIAC_ICONS.libra, top: '50%', right: '-1%', size: 50, duration: 8.5, delay: 0.8, rotate: -15 },
  { icon: ZODIAC_ICONS.pisces, top: '90%', left: '45%', size: 40, duration: 7.5, delay: 1.2, rotate: 30 },
  { icon: ZODIAC_ICONS.aquarius, top: '4%', left: '46%', size: 44, duration: 9.5, delay: 0.3, rotate: -8 },
  { icon: ZODIAC_ICONS.gemini, top: '25%', left: '40%', size: 38, duration: 8, delay: 1.8, rotate: 18 },
  { icon: ZODIAC_ICONS.virgo, bottom: '15%', right: '20%', size: 42, duration: 7.2, delay: 0.4, rotate: -12 },
];

const STARBURST_SVG = `
  <path fill="currentColor" d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
`;

const ASTRO_RING_SVG = `
  <circle cx="12" cy="12" r="9" stroke="currentColor" fill="none" strokeWidth="1.2" strokeDasharray="3 3" />
  <circle cx="12" cy="12" r="5" stroke="currentColor" fill="none" strokeWidth="1" />
  <circle cx="12" cy="12" r="1.5" fill="currentColor" />
`;

const FloatingAstrologyArt = ({ primaryColor }) => {
  return (
    <div style={{ position: 'absolute', inset: '-20px', pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
      {FLOATING_DECORS.map((item, idx) => (
        <motion.div
          key={idx}
          animate={{
            y: [0, -18, 0],
            rotate: [item.rotate, item.rotate + 15, item.rotate],
            opacity: [0.12, 0.28, 0.12],
            scale: [0.95, 1.05, 0.95]
          }}
          transition={{
            duration: item.duration,
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
            color: primaryColor,
            width: item.size,
            height: item.size,
            filter: `drop-shadow(0 0 10px ${primaryColor}55)`
          }}
        >
          <svg viewBox="0 0 24 24" width="100%" height="100%" dangerouslySetInnerHTML={{ __html: item.icon }} />
        </motion.div>
      ))}

      {/* Decorative Starbursts & Geometric Astro Rings scattered */}
      {[
        { top: '8%', left: '22%', size: 24, dur: 4 },
        { top: '28%', right: '12%', size: 30, dur: 5.5 },
        { bottom: '18%', left: '15%', size: 20, dur: 3.8 },
        { bottom: '25%', right: '28%', size: 26, dur: 4.6 },
        { top: '75%', left: '26%', size: 22, dur: 5 },
      ].map((star, i) => (
        <motion.div
          key={`star-${i}`}
          animate={{
            scale: [0.8, 1.25, 0.8],
            opacity: [0.15, 0.45, 0.15],
            rotate: [0, 180, 360]
          }}
          transition={{
            duration: star.dur,
            repeat: Infinity,
            delay: i * 0.7,
            ease: 'easeInOut'
          }}
          style={{
            position: 'absolute',
            top: star.top,
            left: star.left,
            right: star.right,
            bottom: star.bottom,
            color: '#FFD700',
            width: star.size,
            height: star.size
          }}
        >
        </motion.div>
      ))}
    </div>
  );
};

// Rashi Card Component
const RashiCard = ({ sign, index, onClick, colors }) => (
  <motion.div
    key={sign.id}
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.03, duration: 0.4 }}
    whileHover={{ y: -5, scale: 1.02 }}
    onClick={onClick}
    className="glass-panel"
    style={{
      padding: '16px 10px',
      borderRadius: '16px',
      border: '1px solid var(--border-gold)',
      background: `linear-gradient(145deg, var(--color-surface) 0%, var(--color-surface-variant) 100%)`,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      cursor: 'pointer',
      boxShadow: `0 4px 12px rgba(0,0,0,0.05)`,
      textAlign: 'center'
    }}
  >
    <div style={{
      width: '96px',
      height: '96px',
      marginBottom: '8px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '16px',
      overflow: 'hidden'
    }}>
      <img 
        src={`/icons-horoscope/${sign.image}`} 
        alt={sign.name}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain'
        }}
      />
    </div>
    
    <h3 style={{ 
      fontFamily: 'var(--font-heading)', 
      color: colors.text, 
      fontSize: '0.95rem', 
      marginBottom: '2px' 
    }}>
      {sign.name}
    </h3>
    <span style={{ 
      fontSize: '0.7rem', 
      color: colors.primary, 
      opacity: 0.9,
      marginBottom: '8px',
      fontWeight: 500
    }}>
      ({sign.rashi})
    </span>

    <div style={{
      fontSize: '0.65rem',
      color: colors.secondary,
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
      paddingTop: '8px',
      borderTop: `1px solid ${colors.outline}33`,
      width: '100%'
    }}>
      View
    </div>
  </motion.div>
);

const RashiBox = ({ setCurrentPage, setSelectedSign }) => {
  const { colors } = useTheme();
  const { isLoggedIn } = useAuth();
  const [modalSign, setModalSign] = useState(null);
  const [showLogin, setShowLogin] = useState(false);

  const handleSignClick = (signId) => {
    if (isLoggedIn) {
      setModalSign(signId);
    } else {
      setShowLogin(true);
    }
  };

  return (
    <section id="rashi-section" className="section" style={{ position: 'relative', overflow: 'hidden' }}>
      <FloatingAstrologyArt primaryColor={colors.primary} />
      <MandalaArt
        variant={2}
        size="550px"
        opacity={0.13}
        style={{ position: 'absolute', top: '-280px', left: '-280px', zIndex: 0, pointerEvents: 'none' }}
      />
      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
      <SectionHeading>Daily Horoscope & Rashi</SectionHeading>
      <p style={{ textAlign: 'center', marginBottom: '40px', color: colors.text, opacity: 0.8, fontSize: '1.1rem' }}>
        Select your Moon Sign (Janam Rashi) to read your daily astrological insights.
      </p>

      {/* 4-Column Layout (Desktop) / Sequential 2-Column Layout (Mobile: 1-6, Lottie, 7-12) */}
      <div className="rashi-4col-grid" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '16px',
        alignItems: 'center'
      }}>
        {/* Row 1: Cards 1 to 4 (Aries, Taurus, Gemini, Cancer) */}
        {ZODIAC_SIGNS.slice(0, 4).map((sign, index) => (
          <div key={sign.id} style={{ order: index + 1 }}>
            <RashiCard sign={sign} index={index} onClick={() => handleSignClick(sign.id)} colors={colors} />
          </div>
        ))}

        {/* Card 5 (Leo) */}
        <div style={{ order: 5 }}>
          <RashiCard sign={ZODIAC_SIGNS[4]} index={4} onClick={() => handleSignClick(ZODIAC_SIGNS[4].id)} colors={colors} />
        </div>

        {/* Card 6 (Virgo) — Order 6 */}
        <div style={{ order: 6 }}>
          <RashiCard sign={ZODIAC_SIGNS[5]} index={5} onClick={() => handleSignClick(ZODIAC_SIGNS[5].id)} colors={colors} />
        </div>

        {/* Central Astrology Lottie Animation — Order 7 on Mobile */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rashi-lottie-center"
          style={{
            gridColumn: '2 / span 2',
            gridRow: '2 / span 2',
            order: 7,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            padding: '10px',
            width: '100%',
            height: '100%'
          }}
        >
          {/* Background Golden Glow */}
          <div style={{
            position: 'absolute',
            width: '90%',
            height: '90%',
            background: 'radial-gradient(circle, rgba(212,175,55,0.18) 0%, transparent 70%)',
            filter: 'blur(35px)',
            pointerEvents: 'none',
            zIndex: 0
          }} />

          <DotLottieReact
            src="/Astrology.lottie"
            loop
            autoplay
            renderConfig={{ preserveAspectRatio: 'xMidYMid meet' }}
            style={{
              width: '100%',
              height: '100%',
              maxWidth: '420px',
              maxHeight: '420px',
              aspectRatio: '1 / 1',
              objectFit: 'contain',
              zIndex: 1
            }}
          />
        </motion.div>

        {/* Card 7 (Libra) — Order 8 */}
        <div style={{ order: 8 }}>
          <RashiCard sign={ZODIAC_SIGNS[6]} index={6} onClick={() => handleSignClick(ZODIAC_SIGNS[6].id)} colors={colors} />
        </div>

        {/* Card 8 (Scorpio) — Order 9 */}
        <div style={{ order: 9 }}>
          <RashiCard sign={ZODIAC_SIGNS[7]} index={7} onClick={() => handleSignClick(ZODIAC_SIGNS[7].id)} colors={colors} />
        </div>

        {/* Row 4: Cards 9 to 12 (Sagittarius, Capricorn, Aquarius, Pisces) — Orders 10 to 13 */}
        {ZODIAC_SIGNS.slice(8, 12).map((sign, index) => (
          <div key={sign.id} style={{ order: index + 10 }}>
            <RashiCard sign={sign} index={index + 8} onClick={() => handleSignClick(sign.id)} colors={colors} />
          </div>
        ))}
      </div>
      </div>

      {/* Horoscope Modal */}
      {modalSign && (
        <HoroscopeModal
          initialSign={modalSign}
          onClose={() => setModalSign(null)}
        />
      )}

      {/* Login Modal */}
      {showLogin && (
        <LoginModal
          onClose={() => setShowLogin(false)}
          message="Sign in to view your personalized daily Rashi horoscope and cosmic insights."
        />
      )}
    </section>
  );
};

export default RashiBox;
