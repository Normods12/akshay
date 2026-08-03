import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

const ServiceCard = ({ title, description, icon: IconComponent, className = '', children, style, onClick, ...props }) => {
  const { colors } = useTheme();
  const [isHovered, setIsHovered] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div 
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      className={`service-card ${className}`} 
      style={{
        background: `linear-gradient(145deg, var(--color-surface) 0%, var(--color-surface-variant) 55%, var(--color-primary-container) 100%)`,
        border: `1px solid ${isHovered ? 'var(--color-primary)' : 'var(--border-gold)'}`,
        borderRadius: 'var(--radius-lg)',
        padding: '32px',
        boxShadow: isHovered 
          ? '0 12px 28px rgba(0, 0, 0, 0.10)' 
          : 'var(--shadow-gold)',
        transform: !shouldReduceMotion && isHovered ? 'translateY(-6px)' : 'none',
        transition: 'transform 280ms ease-out, box-shadow 280ms ease-out, border-color 280ms ease-out',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        outline: 'none',
        cursor: onClick ? 'pointer' : 'default',
        ...style
      }}
      {...props}
    >
      {/* Icon Circle Container */}
      {IconComponent && (
        <div style={{ 
          width: '76px', 
          height: '76px', 
          backgroundColor: `var(--color-primary-container)`, 
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '24px',
          border: `2px solid ${isHovered ? 'var(--color-secondary)' : `${colors.secondary}33`}`,
          transform: !shouldReduceMotion && isHovered ? 'scale(1.08)' : 'scale(1)',
          transition: 'transform 280ms ease-out, border-color 280ms ease-out',
          boxShadow: `var(--shadow-gold)`,
          color: 'var(--color-primary)',
        }}>
          {typeof IconComponent === 'function' ? (
            <IconComponent isHovered={shouldReduceMotion ? false : isHovered} />
          ) : (
            IconComponent
          )}
        </div>
      )}

      <h3 style={{ 
        marginBottom: '16px', 
        fontFamily: 'var(--font-heading)',
        fontSize: '1.5rem',
        color: 'var(--color-primary)'
      }}>
        {title}
      </h3>
      
      <p style={{ 
        fontSize: '1rem', 
        color: colors.secondary,
        opacity: 0.9, 
        lineHeight: 1.6,
        marginBottom: children ? '24px' : 'auto' 
      }}>
        {description}
      </p>

      {/* Children for extra content */}
      {children}

      {/* Learn More Link */}
      {!children && (
        <div style={{ marginTop: 'auto', paddingTop: '24px' }}>
          <div 
            style={{ 
              fontFamily: 'var(--font-heading)', 
              fontSize: '0.75rem', 
              textTransform: 'uppercase', 
              letterSpacing: '0.1em',
              color: 'var(--color-tertiary)',
              fontWeight: '700',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span>Learn More</span>
            <span style={{ 
              fontSize: '1.1rem', 
              lineHeight: 1,
              transform: !shouldReduceMotion && isHovered ? 'translateX(4px)' : 'translateX(0px)',
              transition: 'transform 280ms ease-out'
            }}>
              ›
            </span>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default ServiceCard;
