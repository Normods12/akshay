import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import SectionHeading from '../ui/SectionHeading';

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

  const cardStyle = {
    backgroundColor: '#FFFFFF',
    border: `1px solid ${sandalwood}`,
    borderRadius: '8px',
    padding: '24px',
    transition: 'all 0.3s ease',
    borderTop: `4px solid ${sandalwood}`,
    boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
  };

  return (
    <section id="wisdom-hub" className="container" style={{ padding: '80px 20px' }}>
      <SectionHeading>Wisdom Hub</SectionHeading>
      
      <div style={{ marginBottom: '60px' }}>
        <h3 style={{ 
          fontFamily: 'var(--font-heading)', 
          fontSize: '1.75rem', 
          marginBottom: '32px',
          color: sandalwood,
          textAlign: 'center'
        }}>
          Vedic Terminology
        </h3>
        
        <p style={{ 
          maxWidth: '700px', 
          margin: '0 auto 40px', 
          textAlign: 'center', 
          fontSize: '1.1rem', 
          lineHeight: '1.6',
          opacity: 0.9,
          fontStyle: 'italic'
        }}>
          "Vedic Terminology is the language of the stars. From understanding your Janma Kundali (Birth Chart) to navigating the Mahadashas (Time Cycles), we simplify ancient Sanskrit concepts for the modern seeker."
        </p>

        <div style={{ 
          display: 'grid', 

          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '24px' 
        }}>
          {terms.map((term, index) => (
            <div key={index} style={cardStyle} className="wisdom-card">
              <h4 style={{ 
                fontFamily: 'var(--font-heading)', 
                marginBottom: '12px',
                color: theme.colors.text 
              }}>
                {term.title}
              </h4>
              <p style={{ fontSize: '0.9rem', opacity: 0.8, lineHeight: 1.6 }}>
                {term.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ 
        backgroundColor: `${sandalwood}0D`, 
        padding: '48px', 
        borderRadius: '12px',
        border: `1px dashed ${sandalwood}`
      }}>
        <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
          <h3 style={{ 
            fontFamily: 'var(--font-heading)', 
            fontSize: '1.75rem', 
            marginBottom: '20px',
            color: sandalwood 
          }}>
            Western Tarot & Vedic Fusion
          </h3>
          <p style={{ fontSize: '1.1rem', lineHeight: '1.8', opacity: 0.9 }}>
            Bridging the intuitive archetypes of Western Tarot with the mathematical precision of Vedic Astrology. This unique fusion offers a holistic perspective, revealing both the immediate energetic shifts and the long-term karmic patterns of your life.
          </p>
        </div>
      </div>

      <style>{`
        .wisdom-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 24px rgba(212, 165, 116, 0.2);
        }
      `}</style>
    </section>
  );
};

export default WisdomHub;
