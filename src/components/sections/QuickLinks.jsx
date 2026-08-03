import React from 'react';

const QuickLinks = ({ setCurrentPage }) => {

  const links = [
    { label: "Kundli Report", action: () => document.getElementById('kundli-features')?.scrollIntoView({ behavior: 'smooth' }) },
    { label: "Gun Milan", action: () => {} },
    { label: "Consultation", action: () => document.getElementById('booking-form')?.scrollIntoView({ behavior: 'smooth' }) },
    { label: "Daily Horoscope", action: () => {} },
    { label: "Courses", action: () => setCurrentPage('courses') },
    { label: "Remedies", action: () => {} }
  ];

  return (
    <div className="container" style={{ 
      display: 'flex', 
      flexWrap: 'wrap', 
      justifyContent: 'center', 
      gap: '12px',
      padding: '24px 20px',
      marginTop: '-40px', // Pull it up to sit neatly under hero
      marginBottom: '40px',
      position: 'relative',
      zIndex: 10
    }}>
      {links.map((link, index) => (
        <button
          key={index}
          onClick={link.action}
          style={{
            padding: '8px 20px',
            borderRadius: '30px',
            border: '1px solid var(--color-primary)',
            backgroundColor: 'transparent',
            color: 'var(--color-primary)',
            fontFamily: 'var(--font-heading)',
            fontSize: '0.9rem',
            fontWeight: '700',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = 'var(--color-primary)';
            e.target.style.color = '#FFFFFF';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = 'transparent';
            e.target.style.color = 'var(--color-primary)';
          }}
        >
          {link.label}
        </button>
      ))}
    </div>
  );
};

export default QuickLinks;
