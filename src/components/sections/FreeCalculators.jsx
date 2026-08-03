import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import SectionHeading from '../ui/SectionHeading';
import MandalaArt from '../ui/MandalaArt';
import { Calculator, Moon, Users } from 'lucide-react';

const CALCULATORS = [
  { id: 'free-kundli', title: 'Free Kundli', icon: Calculator, desc: 'Generate your birth chart' },
  { id: 'matchmaking', title: 'Matchmaking', icon: Users, desc: 'Check compatibility' },
  { id: 'moon-sign', title: 'Moon Sign', icon: Moon, desc: 'Find your rashi' }
];

const FreeCalculators = ({ setCurrentPage }) => {
  const { colors, themeMode } = useTheme();
  const isDark = themeMode === 'dark';

  return (
    <section id="free-calculators" className="section" style={{ position: 'relative', overflow: 'hidden' }}>
      
      {/* Animated Zodiac Mandala Background */}
      <MandalaArt
        variant={1}
        size={700}
        opacity={isDark ? 0.08 : 0.12}
        style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 0 }}
      />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <SectionHeading>Free Calculators</SectionHeading>
        <p style={{ textAlign: 'center', marginBottom: '40px', color: colors.text, opacity: 0.8 }}>
          Discover your cosmic blueprint with our free astrology tools.
        </p>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '24px',
          justifyContent: 'center',
          maxWidth: '900px',
          margin: '0 auto'
        }}>
          {CALCULATORS.map((calc, idx) => (
            <motion.div
              key={calc.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              whileHover={{ y: -5 }}
              onClick={() => {
                if (setCurrentPage) {
                  setCurrentPage(calc.id);
                  window.scrollTo(0, 0);
                }
              }}
              className="glass-panel"
              style={{
                padding: '30px',
                borderRadius: '20px',
                textAlign: 'center',
                cursor: 'pointer',
                border: '1px solid var(--border-gold)',
                background: 'linear-gradient(145deg, var(--color-surface) 0%, var(--color-surface-variant) 60%, var(--color-primary-container) 100%)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.05)',
                transition: 'all 0.3s ease'
              }}
            >
              <div className="card-tag">Free Tool</div>
              <div style={{
                width: '60px', height: '60px', borderRadius: '50%',
                backgroundColor: `${colors.primary}15`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 20px auto'
              }}>
                <calc.icon size={28} color={colors.primary} />
              </div>
              <h3 style={{ fontFamily: 'var(--font-heading)', color: colors.primary, fontSize: '1.25rem', marginBottom: '8px' }}>
                {calc.title}
              </h3>
              <p style={{ fontSize: '0.9rem', color: colors.secondary, opacity: 0.9 }}>
                {calc.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FreeCalculators;
