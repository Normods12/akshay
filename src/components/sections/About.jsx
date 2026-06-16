import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import SectionHeading from '../ui/SectionHeading';

const About = () => {
  const theme = useTheme();

  return (
    <section id="about" className="container" style={{ padding: '80px 20px' }}>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        gap: '60px',
        alignItems: 'center'
      }}>
        <div style={{
          position: 'relative',
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
          aspectRatio: '4/5'
        }}>
          <img 
            src="profile.png" 
            alt="Ashay Krinshn Goswami" 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />

          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '40%',
            background: 'linear-gradient(transparent, rgba(0,0,0,0.6))',
            pointerEvents: 'none'
          }} />
        </div>

        <div>
          <SectionHeading style={{ textAlign: 'left', marginBottom: '32px' }}>Rooted in Tradition</SectionHeading>
          
          <p style={{ fontSize: '1.125rem', lineHeight: '1.8', marginBottom: '24px', color: theme.colors.text }}>
            Hailing from the sacred land of **Vrindavan**, Ashay Krinshn Goswami carries a heritage of profound spiritual wisdom passed down through generations. His journey led him to the ancient city of **Varanasi (Kashi)**, the spiritual capital of India, where he underwent rigorous training in Vedic astrology, Sanskrit, and sacred rituals.
          </p>

          <p style={{ fontSize: '1.125rem', lineHeight: '1.8', marginBottom: '32px', color: theme.colors.text }}>
            By blending the traditional authenticity of his roots with a deep understanding of modern life, Ashay provides guidance that is both timeless and transformative.
          </p>

          <div style={{ 
            display: 'flex', 
            gap: '24px',
            padding: '24px',
            backgroundColor: `${theme.colors.primary}0D`,
            borderRadius: '8px',
            borderLeft: `4px solid ${theme.colors.primary}`
          }}>
            <div>
              <h4 style={{ color: theme.colors.primary, marginBottom: '8px', fontFamily: 'var(--font-heading)' }}>Vrindavan Heritage</h4>
              <p style={{ fontSize: '0.9rem', opacity: 0.8 }}>Ancestral roots in the heart of Bhakti tradition.</p>
            </div>
            <div style={{ width: '1px', backgroundColor: `${theme.colors.outline}33` }} />
            <div>
              <h4 style={{ color: theme.colors.primary, marginBottom: '8px', fontFamily: 'var(--font-heading)' }}>Kashi Training</h4>
              <p style={{ fontSize: '0.9rem', opacity: 0.8 }}>Classical education in the ancient arts of Varanasi.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
