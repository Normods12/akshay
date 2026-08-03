import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import MandalaArt from '../components/ui/MandalaArt';
import { generateHoroscope } from '../utils/ai';

const ZODIAC_SIGNS = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
];

const TIMEFRAMES = ['Daily', 'Tomorrow', 'Weekly', 'Monthly', 'Yearly'];

// Caching structure: cache['Aries-Daily'] = { Overall: '...', Love: '...', etc }
const horoscopeCache = {};

// Helper to format dates
const getDateRangeStr = (timeframe) => {
  const now = new Date();
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  
  if (timeframe === 'Daily') {
    return now.toLocaleDateString('en-US', options);
  }
  if (timeframe === 'Tomorrow') {
    const tmrw = new Date(now);
    tmrw.setDate(tmrw.getDate() + 1);
    return tmrw.toLocaleDateString('en-US', options);
  }
  if (timeframe === 'Weekly') {
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay() + 1); // Monday
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6); // Sunday
    return `${startOfWeek.toLocaleDateString('en-US', options)} - ${endOfWeek.toLocaleDateString('en-US', options)}`;
  }
  if (timeframe === 'Monthly') {
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    return `${startOfMonth.toLocaleDateString('en-US', options)} - ${endOfMonth.toLocaleDateString('en-US', options)}`;
  }
  if (timeframe === 'Yearly') {
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const endOfYear = new Date(now.getFullYear(), 11, 31);
    return `${startOfYear.toLocaleDateString('en-US', options)} - ${endOfYear.toLocaleDateString('en-US', options)}`;
  }
  return '';
};

const Horoscope = ({ selectedSign = 'aries', setSelectedSign }) => {
  const { colors } = useTheme();
  
  // Normalize initial sign to capitalized
  const initialSign = selectedSign ? selectedSign.charAt(0).toUpperCase() + selectedSign.slice(1) : 'Aries';
  
  const [activeSign, setActiveSign] = useState(initialSign);
  const [activeTimeframe, setActiveTimeframe] = useState('Daily');
  const [loading, setLoading] = useState(false);
  const [horoscopeData, setHoroscopeData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Sync external selectedSign prop changes (e.g. clicked from RashiBox)
    if (selectedSign) {
      setActiveSign(selectedSign.charAt(0).toUpperCase() + selectedSign.slice(1));
    }
  }, [selectedSign]);

  useEffect(() => {
    const fetchHoroscope = async () => {
      setLoading(true);
      setError(null);
      
      const cacheKey = `${activeSign}-${activeTimeframe}`;
      if (horoscopeCache[cacheKey]) {
        setHoroscopeData(horoscopeCache[cacheKey]);
        setLoading(false);
        return;
      }
      
      try {
        const dateRange = getDateRangeStr(activeTimeframe);
        const jsonStr = await generateHoroscope(activeSign, activeTimeframe, dateRange);
        const data = JSON.parse(jsonStr);
        horoscopeCache[cacheKey] = data;
        setHoroscopeData(data);
      } catch (err) {
        console.error(err);
        setError("The stars are currently clouded. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchHoroscope();
  }, [activeSign, activeTimeframe]);

  const handleSignClick = (sign) => {
    setActiveSign(sign);
    if (setSelectedSign) setSelectedSign(sign.toLowerCase());
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: 'relative', minHeight: 'calc(100vh - 80px)', padding: '60px 20px', backgroundColor: 'var(--color-surface)' }}
    >
      <MandalaArt variant={2} size="80vw" opacity={0.05} style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 0 }} />
      
      <div className="container" style={{ maxWidth: '1100px', position: 'relative', zIndex: 1 }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2rem, 4vw, 3rem)', color: colors.text }}>
            Free <span style={{ color: colors.primary }}>Daily / Weekly / Monthly</span> Horoscope
          </h1>
        </div>

        {/* Zodiac Signs Strip */}
        <div style={{ 
          display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '15px', marginBottom: '40px',
          scrollbarWidth: 'none', msOverflowStyle: 'none'
        }}>
          {ZODIAC_SIGNS.map(sign => (
            <div 
              key={sign}
              onClick={() => handleSignClick(sign)}
              style={{
                padding: '10px 24px',
                borderRadius: '30px',
                border: `1px solid ${activeSign === sign ? colors.primary : colors.outline}`,
                backgroundColor: activeSign === sign ? colors.primary : 'transparent',
                color: activeSign === sign ? 'var(--color-surface)' : colors.text,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                fontWeight: 600,
                transition: 'all 0.3s ease',
                boxShadow: activeSign === sign ? `0 4px 15px ${colors.primary}44` : 'none'
              }}
            >
              {sign}
            </div>
          ))}
        </div>

        {/* Timeframe Tabs */}
        <div style={{ display: 'flex', gap: '30px', borderBottom: `1px solid ${colors.outline}33`, marginBottom: '40px', overflowX: 'auto' }}>
          {TIMEFRAMES.map((tf) => (
            <div 
              key={tf}
              onClick={() => setActiveTimeframe(tf)}
              style={{
                fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '1.1rem',
                color: activeTimeframe === tf ? colors.primary : colors.text,
                borderBottom: activeTimeframe === tf ? `3px solid ${colors.primary}` : 'none',
                paddingBottom: '12px', marginBottom: '-2px',
                cursor: 'pointer', opacity: activeTimeframe === tf ? 1 : 0.6,
                whiteSpace: 'nowrap'
              }}
            >
              Your {tf}
            </div>
          ))}
        </div>

        {/* Date & Title Display */}
        <div style={{ marginBottom: '40px', backgroundColor: 'var(--color-surface-variant)', padding: '24px', borderRadius: '16px', border: '1px solid var(--border-gold)' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', color: colors.primary, fontSize: '1.6rem', marginBottom: '8px' }}>
            {activeSign} {activeTimeframe} Horoscope | {activeTimeframe}'s Prediction for {activeSign}
          </h2>
          <div style={{ fontSize: '1.1rem', color: colors.text, opacity: 0.8, fontWeight: 500 }}>
            {getDateRangeStr(activeTimeframe)}
          </div>
        </div>

        {/* Content Area */}
        <div style={{ minHeight: '400px', position: 'relative' }}>
          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '300px' }}>
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}>
                <div style={{ fontSize: '4rem' }}>🌟</div>
              </motion.div>
              <p style={{ marginTop: '20px', color: colors.primary, fontWeight: 500, fontSize: '1.2rem' }}>Consulting the stars for {activeSign}...</p>
            </div>
          ) : error ? (
            <div style={{ color: '#ef4444', textAlign: 'center', padding: '40px', fontSize: '1.2rem', backgroundColor: '#fee2e2', borderRadius: '16px' }}>{error}</div>
          ) : horoscopeData ? (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <div style={{
                maxWidth: '900px',
                margin: '0 auto'
              }}>
                <div className="glass-panel" style={{ padding: '40px', borderRadius: '24px', border: '1px solid var(--border-gold)' }}>
                  {['Overall', 'Love', 'Finance', 'Career', 'Health'].map(category => (
                    <div key={category} style={{ marginBottom: '35px' }}>
                      <h3 style={{ 
                        fontFamily: 'var(--font-heading)', 
                        color: colors.primary, 
                        fontSize: '1.5rem', 
                        marginBottom: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px'
                      }}>
                        {category === 'Love' && '❤️'}
                        {category === 'Finance' && '💰'}
                        {category === 'Career' && '🚀'}
                        {category === 'Health' && '🌿'}
                        {category === 'Overall' && '✨'}
                        {category}
                      </h3>
                      <p style={{ 
                        color: colors.text, 
                        lineHeight: '1.8', 
                        fontSize: '1.1rem', 
                        opacity: 0.9,
                        letterSpacing: '0.01em'
                      }}>
                        {horoscopeData[category]}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ) : null}
        </div>

      </div>
    </motion.div>
  );
};

export default Horoscope;
