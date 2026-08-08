import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import SectionHeading from '../ui/SectionHeading';
import MandalaArt from '../ui/MandalaArt';

const QUOTE_MARK_SVG = `<path fill="currentColor" d="M9 7c-3 0-5 2.5-5 6s2 6 5 6h1v-4H9c-1 0-2-1-2-3s1-3 2-3h1V7H9zm10 0c-3 0-5 2.5-5 6s2 6 5 6h1v-4h-1c-1 0-2-1-2-3s1-3 2-3h1V7h-1z"/>`;

const TestimonialStarsAndQuotes = ({ primaryColor = 'var(--color-primary)' }) => (
  <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
    <motion.div
      animate={{ opacity: [0.08, 0.18, 0.08], rotate: [0, -4, 0] }}
      transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      style={{ position: 'absolute', top: '4%', left: '2%', width: 90, height: 90, color: primaryColor }}
    >
      <svg viewBox="0 0 24 24" width="100%" height="100%" dangerouslySetInnerHTML={{ __html: QUOTE_MARK_SVG }} />
    </motion.div>
    <motion.div
      animate={{ opacity: [0.08, 0.18, 0.08], rotate: [0, 4, 0] }}
      transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      style={{ position: 'absolute', bottom: '6%', right: '3%', width: 100, height: 100, color: primaryColor, transform: 'scaleX(-1)' }}
    >
      <svg viewBox="0 0 24 24" width="100%" height="100%" dangerouslySetInnerHTML={{ __html: QUOTE_MARK_SVG }} />
    </motion.div>
    {[
      { top: '15%', left: '30%', size: 14, dur: 3.2 },
      { top: '65%', left: '18%', size: 10, dur: 4 },
      { top: '25%', right: '22%', size: 12, dur: 3.6 },
      { top: '70%', right: '30%', size: 16, dur: 4.4 },
    ].map((star, i) => (
      <motion.span
        key={i}
        animate={{ opacity: [0.15, 0.5, 0.15], scale: [0.8, 1.15, 0.8] }}
        transition={{ duration: star.dur, repeat: Infinity, delay: i * 0.6, ease: 'easeInOut' }}
        style={{ position: 'absolute', top: star.top, left: star.left, right: star.right, fontSize: star.size, color: '#FFD700' }}
      >
        ★
      </motion.span>
    ))}
  </div>
);

const Testimonials = () => {
  const theme = useTheme();

  const testimonials = [
    { name: "Priya Sharma", city: "Delhi", text: "Ashay ji's guidance on my marriage timing was incredibly accurate. Highly recommended.", rating: 5 },
    { name: "Rahul Verma", city: "Mumbai", text: "Got my Kundli analyzed and the career predictions were spot on. Very detailed and genuine.", rating: 5 },
    { name: "Sneha Patel", city: "Ahmedabad", text: "The Vastu consultation transformed our home's energy completely. A truly gifted astrologer.", rating: 5 }
  ];

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <motion.section 
      id="testimonials"
      className="section"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      style={{ position: 'relative', overflow: 'hidden' }}
    >
      <MandalaArt
        variant={1}
        size="520px"
        opacity={0.28}
        style={{ position: 'absolute', top: '-260px', right: '-260px', zIndex: 0, pointerEvents: 'none' }}
      />
      <TestimonialStarsAndQuotes primaryColor="var(--color-primary)" />
      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
      <SectionHeading>What People Say</SectionHeading>
      
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        className="testimonials-grid"
        style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
          gap: '32px',
          marginTop: '60px'
        }}
      >
        {testimonials.map((testimonial, index) => (
          <motion.div 
            key={index} 
            variants={itemVariants}
            className="glass-panel"
            whileHover={{ y: -5 }}
            style={{
              padding: '32px',
              borderRadius: '16px',
              border: '1px solid var(--border-gold)',
              borderTop: `3px solid var(--color-secondary)`,
              display: 'flex',
              flexDirection: 'column',
              background: 'linear-gradient(160deg, var(--color-surface) 0%, var(--color-surface-variant) 55%, var(--color-primary-container) 100%)',
            }}
          >
            {/* Header: Avatar and Rating */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                backgroundColor: '#ffffff',
                color: '#231a13', /* dark text for initials inside white circle */
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'var(--font-heading)',
                fontWeight: '700',
                fontSize: '1.2rem',
                border: `2px solid ${theme.colors.primary}33`,
                boxShadow: '0 4px 10px rgba(0,0,0,0.05)'
              }}>
                {getInitials(testimonial.name)}
              </div>
              
              <div style={{ color: 'var(--color-primary)', display: 'flex', gap: '4px' }}>
                {[...Array(testimonial.rating)].map((_, i) => (
                  <span key={i} style={{ fontSize: '1.2rem' }}>★</span>
                ))}
              </div>
            </div>

            {/* Quote Text */}
            <p style={{ 
              fontStyle: 'italic', 
              fontSize: '1rem', 
              lineHeight: '1.6',
              color: theme.colors.text,
              opacity: 0.9,
              flexGrow: 1,
              marginBottom: '24px'
            }}>
              "{testimonial.text}"
            </p>

            {/* Author */}
            <div>
              <div style={{ fontFamily: 'var(--font-heading)', fontWeight: '700', color: theme.colors.primary, marginBottom: '4px' }}>
                {testimonial.name}
              </div>
              <div style={{ fontSize: '0.85rem', color: theme.colors.secondary, fontWeight: '500', letterSpacing: '0.03em' }}>
                {testimonial.city}
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
      </div>
    </motion.section>
  );
};

export default Testimonials;
