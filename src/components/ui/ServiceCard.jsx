import React from 'react';

const ServiceCard = ({ title, description, icon, className = '', children, ...props }) => {
  const sandalwood = "#D4A574";

  return (
    <div className={`service-card ${className}`} {...props}>
      {/* Icon Container */}
      {icon && (
        <div style={{ 
          width: '64px', 
          height: '64px', 
          backgroundColor: `${sandalwood}1A`, // 10% opacity
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '24px'
        }}>
          {icon}
        </div>
      )}

      <h3 style={{ 
        marginBottom: '16px', 
        fontFamily: 'var(--font-heading)',
        fontSize: '1.5rem' 
      }}>
        {title}
      </h3>
      
      <p style={{ 
        fontSize: '1rem', 
        opacity: 0.8, 
        lineHeight: 1.6,
        marginBottom: children ? '24px' : 'auto' 
      }}>
        {description}
      </p>

      {/* Children for any extra content (like buttons in Courses page) */}
      {children}

      {/* Learn More Link */}
      {!children && (
        <div style={{ marginTop: 'auto', paddingTop: '24px' }}>
          <a 
            href="#" 
            onClick={(e) => e.preventDefault()}
            style={{ 
              fontFamily: 'var(--font-heading)', 
              fontSize: '0.75rem', 
              textTransform: 'uppercase', 
              letterSpacing: '0.1em',
              color: '#008080',
              fontWeight: '700',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            Learn More <span style={{ fontSize: '1rem' }}>›</span>
          </a>
        </div>
      )}
    </div>
  );
};

export default ServiceCard;
