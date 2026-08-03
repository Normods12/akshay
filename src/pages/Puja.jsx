import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { ShieldCheck } from 'lucide-react';
import MandalaArt from '../components/ui/MandalaArt';

const pujas = [
  { title: 'Navagraha Shanti Puja', price: '₹5,100', image: '/images/puja_navagraha.png', description: 'Balance the energies of all 9 planets to bring peace and prosperity.' },
  { title: 'Maha Mrityunjaya Puja', price: '₹11,000', image: '/images/puja_mrityunjaya.png', description: 'Powerful ritual for health, longevity, and overcoming severe obstacles.' },
  { title: 'Rudrabhishek', price: '₹7,500', image: '/images/puja_rudrabhishek.png', description: 'Seek the blessings of Lord Shiva for spiritual growth and harmony.' }
];

const Puja = () => {
  const theme = useTheme();

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      style={{ 
        minHeight: 'calc(100vh - 80px)', 
        backgroundColor: theme.colors.surface
      }}
    >
      {/* Hero Banner */}
      <div style={{
        position: 'relative',
        padding: '80px 20px',
        backgroundColor: theme.mode === 'dark' ? '#1A1105' : '#FFF5E6',
        borderBottom: `1px solid ${theme.colors.outline}33`,
        textAlign: 'center',
        overflow: 'hidden'
      }}>
        {/* Background Animated Mandala */}
        <MandalaArt
          variant={2}
          size={700}
          opacity={0.1}
          style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 0 }}
        />

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '8px', 
              padding: '10px 20px', 
              backgroundColor: `${theme.colors.primary}22`,
              borderRadius: '30px',
              color: theme.colors.primary,
              fontWeight: 600,
              fontFamily: 'var(--font-body)',
              marginBottom: '20px'
            }}
          >
            <ShieldCheck size={20} />
            <span>ISO Certified Astrological Services</span>
          </motion.div>
          
          <h1 style={{ 
            fontFamily: 'var(--font-heading)', 
            fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', 
            color: theme.colors.text,
            lineHeight: 1.1,
            marginBottom: '24px'
          }}>
            Authentic <span style={{ color: theme.colors.primary }}>Online Puja</span> Services
          </h1>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: '1.2rem',
            color: theme.colors.text,
            opacity: 0.8,
            maxWidth: '700px',
            margin: '0 auto',
            lineHeight: 1.6
          }}>
            Perform powerful Vedic rituals from the comfort of your home. Conducted by expert Pandits with complete Vidhi-Vidhan.
          </p>
        </div>
      </div>

      {/* Services Grid */}
      <div className="container" style={{ padding: '80px 20px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '40px'
        }}>
          {pujas.map((puja, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="glass-panel"
              style={{
                borderRadius: '24px',
                overflow: 'hidden',
                backgroundColor: 'var(--color-surface-variant)',
                border: `1px solid ${theme.colors.outline}33`,
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <div style={{ height: '220px', overflow: 'hidden' }}>
                <motion.img 
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.4 }}
                  src={puja.image} 
                  alt={puja.title} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                />
              </div>
              <div style={{ padding: '30px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', color: theme.colors.primary, marginBottom: '12px' }}>
                  {puja.title}
                </h3>
                <p style={{ fontFamily: 'var(--font-body)', color: theme.colors.text, opacity: 0.8, marginBottom: '20px', lineHeight: 1.5, flexGrow: 1 }}>
                  {puja.description}
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '1.2rem', color: theme.colors.text }}>
                    {puja.price}
                  </span>
                  <button
                    style={{
                      padding: '10px 24px',
                      borderRadius: '8px',
                      border: 'none',
                      backgroundColor: theme.colors.primary,
                      color: '#FFFFFF',
                      fontFamily: 'var(--font-heading)',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.3s'
                    }}
                    onMouseEnter={(e) => e.target.style.opacity = 0.9}
                    onMouseLeave={(e) => e.target.style.opacity = 1}
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default Puja;
