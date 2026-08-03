import React from 'react';
import { useTheme } from '../../context/ThemeContext';

const Marquee = () => {
  const { colors } = useTheme();

  const row1 = [
    "✦ Kundli Reading", "✦ Gun Milan", "✦ Career Report", "✦ Love Report", 
    "✦ Manglik Analysis", "✦ Vastu", "✦ Numerology", "✦ Palm Reading"
  ];
  
  const row2 = [
    "✧ Dasha Analysis", "✧ Daily Horoscope", "✧ Sacred Pooja", "✧ Gemstone Guide", 
    "✧ Nakshatra", "✧ Panchang", "✧ Muhurat", "✧ Prashn Kundli"
  ];

  const renderPill = (text, index) => (
    <div key={index} style={{
      padding: '8px 24px',
      border: `1px solid ${colors.outline}40`,
      borderRadius: '30px',
      color: 'var(--color-primary)',
      fontFamily: 'var(--font-body)',
      fontSize: '13px',
      fontWeight: '600',
      whiteSpace: 'nowrap',
      backgroundColor: 'var(--bg-dark)',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 2px 10px rgba(0,0,0,0.02)'
    }}>
      {text}
    </div>
  );

  return (
    <section style={{ 
      width: '100%', 
      overflow: 'hidden', 
      padding: '40px 0',
      position: 'relative',
      backgroundColor: 'transparent'
    }}>
      <style>
        {`
          @keyframes marquee-left {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          @keyframes marquee-right {
            0% { transform: translateX(-50%); }
            100% { transform: translateX(0); }
          }
          .marquee-wrapper {
            display: flex;
            overflow: hidden;
            width: 100%;
          }
          .marquee-wrapper:hover .marquee-container {
            animation-play-state: paused;
          }
          .marquee-container {
            display: flex;
            width: max-content;
          }
          .marquee-track {
            display: flex;
            gap: 16px;
            padding-right: 16px;
          }
          .marquee-row-1 {
            margin-bottom: 16px;
          }
        `}
      </style>

      {/* Row 1 - Scrolls Left */}
      <div className="marquee-wrapper marquee-row-1">
        <div className="marquee-container" style={{ animation: 'marquee-left 35s linear infinite' }}>
          <div className="marquee-track">
            {row1.map((item, i) => renderPill(item, `r1-o-${i}`))}
          </div>
          <div className="marquee-track">
            {row1.map((item, i) => renderPill(item, `r1-d-${i}`))}
          </div>
        </div>
      </div>

      {/* Row 2 - Scrolls Right */}
      <div className="marquee-wrapper">
        <div className="marquee-container" style={{ animation: 'marquee-right 35s linear infinite' }}>
          <div className="marquee-track">
            {row2.map((item, i) => renderPill(item, `r2-o-${i}`))}
          </div>
          <div className="marquee-track">
            {row2.map((item, i) => renderPill(item, `r2-d-${i}`))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Marquee;
