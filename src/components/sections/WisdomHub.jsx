import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import SectionHeading from '../ui/SectionHeading';
import { motion } from 'framer-motion';
import AnimatedEnergyBalance from '../ui/AnimatedEnergyBalance';

const WisdomHub = () => {
  const theme = useTheme();
  const sandalwood = "#D4A574";

  const terms = [
    {
      title: "Nakshatra",
      description: "The 27 lunar mansions that define the subtle qualities of our personality and destiny."
    },
    {
      title: "Dasha",
      description: "The planetary periods that govern the timing of major life events and internal shifts."
    },
    {
      title: "Lagna",
      description: "The Ascendant sign that determines our physical presence and the lens through which we view life."
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <motion.section id="wisdom-hub" className="section section--alt container" 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      style={{ position: 'relative', overflow: 'hidden' }}
    >
      <AnimatedEnergyBalance 
        size={500} 
        opacity={0.15} 
        style={{
          position: 'absolute',
          top: '10%',
          right: '5%',
          zIndex: 0
        }}
      />
      <div style={{ position: 'relative', zIndex: 1 }}>
        <SectionHeading>Wisdom Hub</SectionHeading>
      
      <div style={{ marginBottom: '60px' }}>
        <motion.h3 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ 
            fontFamily: 'var(--font-heading)', 
            fontSize: '1.75rem', 
            marginBottom: '32px',
            color: sandalwood,
            textAlign: 'center'
          }}
        >
          Vedic Terminology
        </motion.h3>
        
        <motion.p 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          style={{ 
            maxWidth: '700px', 
            margin: '0 auto 40px', 
            textAlign: 'center', 
            fontSize: '1.1rem', 
            lineHeight: '1.6',
            opacity: 0.9,
            fontStyle: 'italic',
            color: theme.colors.text
          }}
        >
          "Vedic Terminology is the language of the stars. From understanding your Janma Kundali (Birth Chart) to navigating the Mahadashas (Time Cycles), we simplify ancient Sanskrit concepts for the modern seeker."
        </motion.p>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '24px' 
          }}
        >
          {terms.map((term, index) => (
            <motion.div 
              key={index} 
              variants={itemVariants}
              whileHover={{ y: -8, scale: 1.02 }}
              transition={{ delay: index * 0.1 }}
              className="glass-panel wisdom-card"
              style={{
                borderRadius: '12px',
                padding: '28px 24px',
                borderTop: `4px solid ${sandalwood}`,
                transition: 'border-color 0.3s ease'
              }}
            >
              <h4 style={{ 
                fontFamily: 'var(--font-heading)', 
                marginBottom: '12px',
                color: theme.colors.primary,
                fontSize: '1.25rem'
              }}>
                {term.title}
              </h4>
              <p style={{ fontSize: '0.95rem', opacity: 0.85, lineHeight: 1.6, color: theme.colors.text }}>
                {term.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="glass-panel"
        style={{ 
          padding: '48px', 
          borderRadius: '16px',
          border: `1px solid ${sandalwood}40`,
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          background: `radial-gradient(circle at center, ${sandalwood}10 0%, transparent 70%)`,
          pointerEvents: 'none'
        }} />
        
        <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <h3 style={{ 
            fontFamily: 'var(--font-heading)', 
            fontSize: '1.75rem', 
            marginBottom: '20px',
            color: theme.colors.primary 
          }}>
            Western Tarot & Vedic Fusion
          </h3>
          <p style={{ fontSize: '1.1rem', lineHeight: '1.8', opacity: 0.9, color: theme.colors.text }}>
            Bridging the intuitive archetypes of Western Tarot with the mathematical precision of Vedic Astrology. This unique fusion offers a holistic perspective, revealing both the immediate energetic shifts and the long-term karmic patterns of your life.
          </p>
        </div>
      </motion.div>
      </div>
    </motion.section>
  );
};

export default WisdomHub;
