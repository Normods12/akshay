import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import SectionHeading from '../ui/SectionHeading';
import ServiceCard from '../ui/ServiceCard';
import MandalaArt from '../ui/MandalaArt';

const pathVariant = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: (custom = 0) => ({
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { duration: 1.1, ease: "easeInOut", delay: custom },
      opacity: { duration: 0.3, delay: custom }
    }
  })
};

// 1. Kundli Reading → Birth Chart Wheel (12 Astrological Houses)
const KundliWheelIcon = ({ isHovered }) => (
  <motion.svg 
    key={isHovered ? 'hover' : 'idle'} 
    width="40" height="40" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
  >
    <motion.circle 
      cx="24" cy="24" r="21"
      variants={pathVariant}
      initial="hidden" animate="visible" custom={0}
    />
    <motion.circle 
      cx="24" cy="24" r="8"
      variants={pathVariant}
      initial="hidden" animate="visible" custom={0.1}
    />
    {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle, idx) => (
      <motion.line
        key={angle}
        x1={24 + 8 * Math.cos((angle * Math.PI) / 180)}
        y1={24 + 8 * Math.sin((angle * Math.PI) / 180)}
        x2={24 + 21 * Math.cos((angle * Math.PI) / 180)}
        y2={24 + 21 * Math.sin((angle * Math.PI) / 180)}
        variants={pathVariant}
        initial="hidden" animate="visible" custom={0.15 + (idx % 6) * 0.04}
      />
    ))}
    <circle cx="24" cy="24" r="2" fill="currentColor" />
  </motion.svg>
);

// 2. Palmistry → Stylized Palm Outline with Palm Lines
const PalmistryIcon = ({ isHovered }) => (
  <motion.svg 
    key={isHovered ? 'hover' : 'idle'} 
    width="40" height="40" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
  >
    <motion.path 
      d="M 14 42 L 14 26 C 14 23 11 23 11 19 L 11 17 C 11 14 14 14 14 17 L 14 12 C 14 9 17 9 17 12 L 17 7 C 17 4 20 4 20 7 L 20 12 L 21 12 C 21 8 24 8 24 11 L 24 14 C 24 10 27 10 27 13 L 27 21 C 27 22 29 23 31 23 C 34 23 35 26 35 28 C 35 34 31 42 24 42 Z"
      variants={pathVariant}
      initial="hidden" animate="visible" custom={0}
    />
    <motion.path 
      d="M 15 24 Q 22 21 30 26"
      variants={pathVariant}
      initial="hidden" animate="visible" custom={0.15}
    />
    <motion.path 
      d="M 14 28 Q 23 27 32 32"
      variants={pathVariant}
      initial="hidden" animate="visible" custom={0.25}
    />
    <motion.path 
      d="M 18 22 Q 22 30 20 38"
      variants={pathVariant}
      initial="hidden" animate="visible" custom={0.35}
    />
  </motion.svg>
);

// 3. Career Guidance → Clean Line Briefcase
const CareerBriefcaseIcon = ({ isHovered }) => (
  <motion.svg 
    key={isHovered ? 'hover' : 'idle'} 
    width="40" height="40" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
  >
    <motion.rect 
      x="6" y="14" width="36" height="26" rx="4"
      variants={pathVariant}
      initial="hidden" animate="visible" custom={0}
    />
    <motion.path 
      d="M 17 14 V 10 C 17 8 19 6 21 6 H 27 C 29 6 31 8 31 10 V 14"
      variants={pathVariant}
      initial="hidden" animate="visible" custom={0.15}
    />
    <motion.line 
      x1="6" y1="24" x2="42" y2="24"
      variants={pathVariant}
      initial="hidden" animate="visible" custom={0.25}
    />
    <motion.rect 
      x="21" y="22" width="6" height="4" rx="1"
      variants={pathVariant}
      initial="hidden" animate="visible" custom={0.35}
    />
  </motion.svg>
);

// 4. Marriage Match → Two Interlocking Rings
const MarriageRingsIcon = ({ isHovered }) => (
  <motion.svg 
    key={isHovered ? 'hover' : 'idle'} 
    width="40" height="40" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
  >
    <motion.circle 
      cx="18" cy="26" r="11"
      variants={pathVariant}
      initial="hidden" animate="visible" custom={0}
    />
    <motion.circle 
      cx="30" cy="26" r="11"
      variants={pathVariant}
      initial="hidden" animate="visible" custom={0.15}
    />
    <motion.path 
      d="M 18 15 L 15 11 L 18 7 L 21 11 Z"
      variants={pathVariant}
      initial="hidden" animate="visible" custom={0.3}
    />
  </motion.svg>
);

// 5. Shubh Muhurat → Sun / Clock Hybrid Symbol
const MuhuratSunClockIcon = ({ isHovered }) => (
  <motion.svg 
    key={isHovered ? 'hover' : 'idle'} 
    width="40" height="40" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
  >
    <motion.circle 
      cx="24" cy="24" r="13"
      variants={pathVariant}
      initial="hidden" animate="visible" custom={0}
    />
    <motion.path 
      d="M 24 24 L 18 17 M 24 24 L 31 19"
      variants={pathVariant}
      initial="hidden" animate="visible" custom={0.15}
    />
    {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, idx) => (
      <motion.line
        key={angle}
        x1={24 + 15 * Math.cos((angle * Math.PI) / 180)}
        y1={24 + 15 * Math.sin((angle * Math.PI) / 180)}
        x2={24 + 20 * Math.cos((angle * Math.PI) / 180)}
        y2={24 + 20 * Math.sin((angle * Math.PI) / 180)}
        variants={pathVariant}
        initial="hidden" animate="visible" custom={0.2 + idx * 0.03}
      />
    ))}
  </motion.svg>
);

// 6. Vastu Consultation → Astrological Compass with Directional Markings
const VastuCompassIcon = ({ isHovered }) => (
  <motion.svg 
    key={isHovered ? 'hover' : 'idle'} 
    width="40" height="40" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
  >
    <motion.circle 
      cx="24" cy="24" r="21"
      variants={pathVariant}
      initial="hidden" animate="visible" custom={0}
    />
    <motion.circle 
      cx="24" cy="24" r="16"
      variants={pathVariant}
      initial="hidden" animate="visible" custom={0.1}
    />
    <motion.polygon 
      points="24,8 27,21 40,24 27,27 24,40 21,27 8,24 21,21"
      variants={pathVariant}
      initial="hidden" animate="visible" custom={0.2}
    />
    <circle cx="24" cy="24" r="2" fill="currentColor" />
  </motion.svg>
);

const CATEGORIES = [
  { id: 'kundli', title: 'Kundli Reading', price: '₹2,100', description: 'Deep dive into your birth chart for life predictions.', icon: KundliWheelIcon },
  { id: 'palm', title: 'Palmistry', price: '₹1,500', description: 'Discover what the lines on your hands reveal.', icon: PalmistryIcon },
  { id: 'career', title: 'Career Guidance', price: '₹2,500', description: 'Astrological insights into your professional path.', icon: CareerBriefcaseIcon },
  { id: 'marriage', title: 'Marriage Match', price: '₹3,100', description: 'Compatibility checks for a prosperous union.', icon: MarriageRingsIcon },
  { id: 'muhurat', title: 'Shubh Muhurat', price: '₹1,100', description: 'Find the most auspicious time for new beginnings.', icon: MuhuratSunClockIcon },
  { id: 'vastu', title: 'Vastu Consultation', price: '₹5,000', description: 'Harmonize your living or working space.', icon: VastuCompassIcon },
];

const BookingCategories = ({ onBookService }) => {
  const { colors } = useTheme();

  return (
    <motion.section 
      id="booking-categories"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="section section--alt"
      style={{ position: 'relative', overflow: 'hidden' }}
    >
      {/* Background Quadrant Mandalas */}
      <MandalaArt 
        variant={1} 
        size="600px" 
        opacity={0.28} 
        style={{ 
          position: 'absolute', 
          top: '-300px', 
          right: '-300px', 
          zIndex: 0, 
          pointerEvents: 'none' 
        }} 
      />
      <MandalaArt 
        variant={2} 
        size="500px" 
        opacity={0.22} 
        style={{ 
          position: 'absolute', 
          bottom: '-250px', 
          left: '-250px', 
          zIndex: 0, 
          pointerEvents: 'none' 
        }} 
      />
      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <SectionHeading>Book Consultation</SectionHeading>
        <p style={{ textAlign: 'center', marginBottom: '60px', color: colors.text, opacity: 0.8, fontSize: '1.1rem' }}>
          Select an area of focus to begin your journey towards clarity and purpose.
        </p>
        
        <div className="booking-categories-grid" style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
          gap: '32px',
        }}>
          {CATEGORIES.map((category, index) => (
            <ServiceCard 
              key={category.id}
              title={category.title} 
              description={category.description}
              icon={category.icon}
              onClick={() => {
                if (onBookService) {
                  onBookService(category);
                }
              }}
              style={{ cursor: 'pointer' }}
              transition={{ duration: 0.5, ease: "easeOut", delay: index * 0.1 }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid rgba(212,175,55,0.2)' }}>
                <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.1rem', color: '#d4af37' }}>
                  {category.price}
                </span>
                <span style={{
                  padding: '8px 16px', borderRadius: '8px',
                  background: 'linear-gradient(135deg, #d4af37, #b8860b)',
                  color: '#000', fontFamily: 'var(--font-heading)',
                  fontWeight: 700, fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '4px'
                }}>
                  Book Session ›
                </span>
              </div>
            </ServiceCard>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default BookingCategories;
