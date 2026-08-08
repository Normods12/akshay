import React, { useEffect, useRef } from 'react';
import { motion, useInView, useMotionValue, useTransform, animate } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

const AnimatedNumber = ({ value, duration = 2, suffix = '', decimal = false }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => {
    return decimal ? latest.toFixed(1) : Math.round(latest);
  });

  useEffect(() => {
    if (isInView) {
      animate(count, value, { duration: duration, ease: "easeOut" });
    }
  }, [isInView, value, count, duration]);

  return (
    <span ref={ref}>
      <motion.span>{rounded}</motion.span>
      {suffix}
    </span>
  );
};

const StatsCounter = () => {
  const theme = useTheme();

  const stats = [
    { value: 5, suffix: '+', label: 'Years Experience' },
    { value: 500, suffix: '+', label: 'Consultations' },
    { value: 50, suffix: '+', label: 'Cities Served' },
    { value: 4.9, suffix: '★', label: 'Rating', decimal: true }
  ];

  return (
    <section className="section section--alt" style={{ width: '100%' }}>
      <div className="container">
        <div className="stats-counter-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '40px',
          textAlign: 'center'
        }}>
          {stats.map((stat, index) => (
            <div key={index} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ 
                fontFamily: 'var(--font-heading)', 
                fontSize: '3rem', 
                fontWeight: '700',
                color: theme.colors.primary 
              }}>
                <AnimatedNumber value={stat.value} suffix={stat.suffix} decimal={stat.decimal} />
              </div>
              <div style={{
                fontFamily: 'var(--font-body)',
                fontSize: '1.1rem',
                color: theme.colors.text,
                opacity: 0.9,
                fontWeight: '600'
              }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsCounter;
