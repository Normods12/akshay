import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import VedicButton from '../ui/VedicButton';
import { motion } from 'framer-motion';
import CosmicStarfield from '../ui/CosmicStarfield';
import SolarSystem3D from '../ui/SolarSystem3D';
import MandalaArt from '../ui/MandalaArt';

const Hero = () => {
  const theme = useTheme();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  };

  return (
    <section id="hero" className="section" style={{ position: 'relative', overflow: 'hidden', backgroundColor: theme.colors.surface }}>

      {/* Aurora shimmer — always visible on dark theme */}
        <div style={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
          background: 'radial-gradient(ellipse 70% 50% at 30% 20%, rgba(212,175,55,0.06) 0%, transparent 70%), radial-gradient(ellipse 60% 40% at 70% 80%, rgba(100,60,180,0.05) 0%, transparent 70%)',
          pointerEvents: 'none', zIndex: 0, animation: 'aurora-shift 12s ease-in-out infinite alternate'
        }} />

      {/* Mandala background layer — behind all content, left-side anchor */}
      <MandalaArt
        variant={0}
        size={640}
        opacity={0.09}
        style={{
          top: '50%',
          left: '-5%',
          transform: 'translateY(-50%)',
          zIndex: 0,
        }}
      />

      {/* Cosmic Starfield ambient background layer with radial gradient mask */}
      <div style={{
        position: 'absolute',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        WebkitMaskImage: 'radial-gradient(circle at 35% 50%, black 0%, transparent 75%)',
        maskImage: 'radial-gradient(circle at 35% 50%, black 0%, transparent 75%)',
      }}>
        <CosmicStarfield 
          starCount={typeof window !== 'undefined' && window.innerWidth < 768 ? 30 : 80} 
          opacity={0.35} 
          mouseReactive={false} 
        />
      </div>

      {/* Video Background for the Whole Hero Section */}
      <div style={{
        position: 'absolute',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 4%, black 96%, transparent 100%)',
        maskImage: 'linear-gradient(to bottom, transparent 0%, black 4%, black 96%, transparent 100%)',
      }}>
        <video
          autoPlay
          loop
          muted
          playsInline
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: 0.45
          }}
        >
          <source src="/hero-animation/hero-1.mp4" type="video/mp4" />
        </video>
      </div>

      <div className="container" style={{
        position: 'relative', zIndex: 1,
        minHeight: '80vh', display: 'flex', alignItems: 'center'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '60px', alignItems: 'center', width: '100%'
        }}>
          {/* Left Column */}
          <motion.div 
            variants={containerVariants}
            initial="hidden" animate="visible"
            style={{ textAlign: 'left' }}
          >
            <motion.div variants={itemVariants} style={{
                display: 'inline-block', padding: '6px 16px',
                backgroundColor: `${theme.colors.primary}15`, color: theme.colors.primary,
                borderRadius: '20px', fontSize: '0.875rem', fontWeight: '600',
                marginBottom: '24px', fontFamily: 'var(--font-body)',
                border: `1px solid ${theme.colors.primary}33`, backdropFilter: 'blur(4px)'
              }}>
              ✦ Vedic Astrologer Since 2019
            </motion.div>
            
            <motion.h1 
              variants={itemVariants}
              className="text-gradient-premium"
              style={{ 
                fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', lineHeight: '1.1',
                marginBottom: '24px', fontFamily: 'var(--font-heading)', letterSpacing: '-0.02em',
              }}>
              Ashay Krishn Goswami
            </motion.h1>
            
            <motion.p variants={itemVariants} style={{ 
                fontSize: '1.25rem', marginBottom: '40px', opacity: 0.8, 
                lineHeight: '1.6', maxWidth: '600px', color: theme.colors.text
              }}>
              Guided by tradition, dedicated to your spiritual evolution through Vedic wisdom and ancient practices.
            </motion.p>

            {/* Quick stats */}
            <motion.div variants={itemVariants} style={{ display: 'flex', gap: '32px', marginBottom: '36px', flexWrap: 'wrap' }}>
              {[{ num: '5000+', label: 'Consultations' }, { num: '7+', label: 'Years' }, { num: '98%', label: 'Accuracy' }].map(s => (
                <div key={s.label}>
                  <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 700, color: theme.colors.primary }}>{s.num}</div>
                  <div style={{ fontSize: '0.8rem', color: theme.colors.text, opacity: 0.6, letterSpacing: '0.05em' }}>{s.label}</div>
                </div>
              ))}
            </motion.div>
            
            <motion.div variants={itemVariants} style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <VedicButton onClick={() => document.getElementById('booking-form')?.scrollIntoView({ behavior: 'smooth' })}>
                Book a Consultation
              </VedicButton>
              <button 
                onClick={() => document.getElementById('booking-categories')?.scrollIntoView({ behavior: 'smooth' })}
                style={{
                  padding: '12px 28px', fontFamily: 'var(--font-heading)', fontWeight: '700',
                  borderRadius: '12px', backgroundColor: 'transparent', color: theme.colors.primary,
                  border: `2px solid ${theme.colors.primary}`, cursor: 'pointer', transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => { e.target.style.backgroundColor = `${theme.colors.primary}1A`; }}
                onMouseLeave={(e) => { e.target.style.backgroundColor = 'transparent'; }}
              >
                View Services
              </button>
            </motion.div>
          </motion.div>

          {/* Right Column */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}
          >
            {/* Solar System 3D — background layer */}
            <div style={{
              position: 'absolute', left: '50%', top: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 1, opacity: 1
            }}>
              <SolarSystem3D size={500} />
            </div>

            {/* Profile Image */}
            <div style={{
              animation: 'float 6s ease-in-out infinite', zIndex: 2,
              width: '70%', maxWidth: '360px', display: 'flex', justifyContent: 'center'
            }}>
              <img 
                src="profile.png" 
                alt="Ashay Krishn Goswami"
                style={{
                  width: '100%', borderRadius: '20px',
                  boxShadow: `0 20px 60px rgba(0,0,0,0.6), 0 0 40px ${theme.colors.primary}25`,
                  border: `1px solid ${theme.colors.primary}44`
                }}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
