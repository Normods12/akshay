import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import VedicButton from '../ui/VedicButton';

const Hero = () => {
  const theme = useTheme();

  return (
    <section id="hero" style={{
      padding: '120px 20px',
      textAlign: 'center',
      maxWidth: '100%',
      margin: '0 auto',
      position: 'relative',
      overflow: 'hidden',
      backgroundColor: theme.colors.surface,
    }}>
      {/* Mandala Background Overlay */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '100%',
        height: '100%',
        backgroundImage: 'url(mandala.png)',
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        opacity: 0.05,
        pointerEvents: 'none',
        zIndex: 0
      }} />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: '800px', margin: '0 auto' }}>

      <div style={{
        display: 'inline-block',
        padding: '6px 16px',
        backgroundColor: `${theme.colors.primary}15`,
        color: theme.colors.primary,
        borderRadius: '20px',
        fontSize: '0.875rem',
        fontWeight: '600',
        marginBottom: '24px',
        fontFamily: 'var(--font-body)',
        border: `1px solid ${theme.colors.primary}33`
      }}>
        Since 2019
      </div>
      
      <h1 style={{ 
        fontSize: '4rem', 
        lineHeight: '1.1',
        marginBottom: '24px', 
        fontFamily: 'var(--font-heading)',
        color: theme.colors.text,
        letterSpacing: '-0.02em'
      }}>
        Ashay Krinshn Goswami
      </h1>
      
      <p style={{ 
        fontSize: '1.25rem', 
        marginBottom: '40px', 
        opacity: 0.8, 
        lineHeight: '1.6',
        maxWidth: '600px',
        margin: '0 auto 40px'
      }}>
        Guided by tradition, dedicated to your spiritual evolution through Vedic wisdom and ancient practices.
      </p>
      
      <VedicButton onClick={() => document.getElementById('booking-form')?.scrollIntoView({ behavior: 'smooth' })}>
        Book a Consultation
      </VedicButton>
      </div>
    </section>

  );
};

export default Hero;
