import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { generateHoroscope } from '../../utils/ai';

const ZODIAC_SIGNS = [
  { id: 'aries',       name: 'Aries',       rashi: 'Mesha',      image: 'aries.png',       symbol: '♈' },
  { id: 'taurus',      name: 'Taurus',      rashi: 'Vrishabha',  image: 'taurus.png',      symbol: '♉' },
  { id: 'gemini',      name: 'Gemini',      rashi: 'Mithuna',    image: 'gemini.png',      symbol: '♊' },
  { id: 'cancer',      name: 'Cancer',      rashi: 'Karka',      image: 'cancer.png',      symbol: '♋' },
  { id: 'leo',         name: 'Leo',         rashi: 'Simha',      image: 'leo.png',         symbol: '♌' },
  { id: 'virgo',       name: 'Virgo',       rashi: 'Kanya',      image: 'virgo.png',       symbol: '♍' },
  { id: 'libra',       name: 'Libra',       rashi: 'Tula',       image: 'libra.png',       symbol: '♎' },
  { id: 'scorpio',     name: 'Scorpio',     rashi: 'Vrishchika', image: 'scorpio.png',     symbol: '♏' },
  { id: 'sagittarius', name: 'Sagittarius', rashi: 'Dhanu',      image: 'sagitarius.png',  symbol: '♐' },
  { id: 'capricorn',   name: 'Capricorn',   rashi: 'Makara',     image: 'capricorn.png',   symbol: '♑' },
  { id: 'aquarius',    name: 'Aquarius',    rashi: 'Kumbha',     image: 'aquarius.png',    symbol: '♒' },
  { id: 'pisces',      name: 'Pisces',      rashi: 'Meena',      image: 'pisces.png',      symbol: '♓' },
];

const TIMEFRAMES = ['Daily', 'Tomorrow', 'Weekly', 'Monthly', 'Yearly'];

const CATEGORY_CONFIG = [
  { key: 'Overall',  emoji: '✨', label: 'Overall' },
  { key: 'Love',     emoji: '❤️', label: 'Love & Relations' },
  { key: 'Career',   emoji: '🚀', label: 'Career & Goals' },
  { key: 'Finance',  emoji: '💰', label: 'Finance' },
  { key: 'Health',   emoji: '🌿', label: 'Health & Wellness' },
];

// Persistent cache
const horoscopeCache = {};

const getDateRangeStr = (timeframe) => {
  const now = new Date();
  const opts = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  if (timeframe === 'Daily') return now.toLocaleDateString('en-US', opts);
  if (timeframe === 'Tomorrow') {
    const d = new Date(now); d.setDate(d.getDate() + 1);
    return d.toLocaleDateString('en-US', opts);
  }
  if (timeframe === 'Weekly') {
    const s = new Date(now); s.setDate(now.getDate() - now.getDay() + 1);
    const e = new Date(s); e.setDate(s.getDate() + 6);
    return `${s.toLocaleDateString('en-US', opts)} – ${e.toLocaleDateString('en-US', opts)}`;
  }
  if (timeframe === 'Monthly') {
    const s = new Date(now.getFullYear(), now.getMonth(), 1);
    const e = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    return `${s.toLocaleDateString('en-US', opts)} – ${e.toLocaleDateString('en-US', opts)}`;
  }
  if (timeframe === 'Yearly') {
    return `Jan 1, ${now.getFullYear()} – Dec 31, ${now.getFullYear()}`;
  }
  return '';
};

const HoroscopeModal = ({ initialSign, onClose }) => {
  const { colors, themeMode } = useTheme();
  const isDark = themeMode === 'dark';

  const initIdx = ZODIAC_SIGNS.findIndex(s => s.id === initialSign?.toLowerCase()) || 0;
  const [signIdx, setSignIdx]         = useState(Math.max(0, initIdx));
  const [timeframe, setTimeframe]     = useState('Daily');
  const [loading, setLoading]         = useState(false);
  const [horoscopeData, setHoroscopeData] = useState(null);
  const [error, setError]             = useState(null);
  const [slideDir, setSlideDir]       = useState(1);

  const sign = ZODIAC_SIGNS[signIdx];

  const navigateSign = useCallback((dir) => {
    setSlideDir(dir);
    setSignIdx(prev => (prev + dir + 12) % 12);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft')  navigateSign(-1);
      if (e.key === 'ArrowRight') navigateSign(1);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose, navigateSign]);

  // Fetch horoscope whenever sign or timeframe changes
  useEffect(() => {
    const fetchHoroscope = async () => {
      const cacheKey = `${sign.name}-${timeframe}`;
      if (horoscopeCache[cacheKey]) {
        setHoroscopeData(horoscopeCache[cacheKey]);
        return;
      }
      setLoading(true);
      setError(null);
      setHoroscopeData(null);
      try {
        const dateRange = getDateRangeStr(timeframe);
        const jsonStr = await generateHoroscope(sign.name, timeframe, dateRange);
        const data = JSON.parse(jsonStr);
        horoscopeCache[cacheKey] = data;
        setHoroscopeData(data);
      } catch (err) {
        setError('The stars are momentarily clouded. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchHoroscope();
  }, [sign.name, timeframe]);

  const overlayBg = isDark
    ? 'rgba(6, 4, 14, 0.92)'
    : 'rgba(20, 10, 40, 0.80)';

  const modalBg = isDark
    ? 'rgba(18, 12, 35, 0.97)'
    : 'rgba(255, 252, 245, 0.98)';

  const primary = colors.primary;
  const text    = isDark ? '#f0e6cc' : '#1a1020';
  const muted   = isDark ? 'rgba(240,230,200,0.55)' : 'rgba(30,20,60,0.55)';
  const cardBg  = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)';
  const borderC = isDark ? 'rgba(212,175,55,0.2)' : 'rgba(120,80,160,0.15)';

  return (
    <AnimatePresence>
      <motion.div
        key="horoscope-modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, zIndex: 1000,
          background: overlayBg,
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '16px',
        }}
      >
        <motion.div
          key="horoscope-modal-box"
          initial={{ opacity: 0, scale: 0.92, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 30 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          onClick={e => e.stopPropagation()}
          style={{
            width: '100%', maxWidth: '820px',
            maxHeight: '90vh',
            background: modalBg,
            borderRadius: '24px',
            border: `1px solid ${primary}33`,
            boxShadow: `0 30px 80px rgba(0,0,0,0.5), 0 0 0 1px ${primary}15, inset 0 1px 0 ${primary}22`,
            display: 'flex', flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          {/* ─── Header ─── */}
          <div style={{
            padding: '20px 24px 0',
            background: `linear-gradient(135deg, ${primary}10 0%, transparent 60%)`,
            borderBottom: `1px solid ${borderC}`,
          }}>
            {/* Close + Title row */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '1.5rem', filter: `drop-shadow(0 0 8px ${primary})` }}>
                  {sign.symbol}
                </span>
                <div>
                  <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', color: primary, lineHeight: 1 }}>
                    {sign.name}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: muted, marginTop: '2px' }}>
                    {sign.rashi} · {timeframe} Horoscope
                  </div>
                </div>
              </div>
              <button
                onClick={onClose}
                aria-label="Close horoscope"
                style={{
                  width: '36px', height: '36px', borderRadius: '50%',
                  border: `1px solid ${borderC}`,
                  background: cardBg, color: muted,
                  cursor: 'pointer', fontSize: '1.2rem',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.2s ease',
                  flexShrink: 0,
                }}
                onMouseEnter={e => { e.currentTarget.style.color = primary; e.currentTarget.style.borderColor = primary; }}
                onMouseLeave={e => { e.currentTarget.style.color = muted; e.currentTarget.style.borderColor = borderC; }}
              >
                ✕
              </button>
            </div>

            {/* Sign navigation strip */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              marginBottom: '16px',
            }}>
              {/* Prev Arrow */}
              <button
                onClick={() => navigateSign(-1)}
                style={{
                  width: '32px', height: '32px', borderRadius: '50%',
                  border: `1px solid ${borderC}`, background: cardBg, color: primary,
                  cursor: 'pointer', fontSize: '1rem', flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = `${primary}22`; }}
                onMouseLeave={e => { e.currentTarget.style.background = cardBg; }}
              >‹</button>

              {/* Scrollable sign pills */}
              <div style={{
                flex: 1, display: 'flex', gap: '6px', overflowX: 'auto',
                scrollbarWidth: 'none', msOverflowStyle: 'none',
                paddingBottom: '2px',
              }}>
                {ZODIAC_SIGNS.map((s, i) => (
                  <button
                    key={s.id}
                    onClick={() => { setSlideDir(i > signIdx ? 1 : -1); setSignIdx(i); }}
                    title={`${s.name} (${s.rashi})`}
                    style={{
                      flexShrink: 0,
                      padding: '5px 12px',
                      borderRadius: '20px',
                      border: `1px solid ${i === signIdx ? primary : borderC}`,
                      background: i === signIdx ? `${primary}22` : 'transparent',
                      color: i === signIdx ? primary : muted,
                      cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600,
                      transition: 'all 0.2s',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {s.symbol} {s.name}
                  </button>
                ))}
              </div>

              {/* Next Arrow */}
              <button
                onClick={() => navigateSign(1)}
                style={{
                  width: '32px', height: '32px', borderRadius: '50%',
                  border: `1px solid ${borderC}`, background: cardBg, color: primary,
                  cursor: 'pointer', fontSize: '1rem', flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = `${primary}22`; }}
                onMouseLeave={e => { e.currentTarget.style.background = cardBg; }}
              >›</button>
            </div>

            {/* Timeframe tabs */}
            <div style={{ display: 'flex', gap: '4px' }}>
              {TIMEFRAMES.map(tf => (
                <button
                  key={tf}
                  onClick={() => setTimeframe(tf)}
                  style={{
                    padding: '7px 16px', borderRadius: '10px 10px 0 0',
                    border: `1px solid ${timeframe === tf ? primary : 'transparent'}`,
                    borderBottom: 'none',
                    background: timeframe === tf ? `${primary}18` : 'transparent',
                    color: timeframe === tf ? primary : muted,
                    cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600,
                    transition: 'all 0.2s',
                  }}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>

          {/* ─── Body / Content ─── */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '24px', scrollbarWidth: 'thin' }}>
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '280px', gap: '16px' }}
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                    style={{ fontSize: '3.5rem', filter: `drop-shadow(0 0 12px ${primary})` }}
                  >
                    {sign.symbol}
                  </motion.div>
                  <p style={{ color: primary, fontWeight: 600, fontSize: '1rem', opacity: 0.8 }}>
                    Consulting the stars for {sign.name}…
                  </p>
                </motion.div>
              ) : error ? (
                <motion.div
                  key="error"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  style={{ textAlign: 'center', padding: '60px 20px', color: '#ef4444', fontSize: '1rem' }}
                >
                  {error}
                </motion.div>
              ) : horoscopeData ? (
                <motion.div
                  key={`${sign.id}-${timeframe}`}
                  initial={{ opacity: 0, x: slideDir * 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -slideDir * 40 }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                >
                  {/* Date range pill */}
                  <div style={{
                    textAlign: 'center', marginBottom: '24px',
                    fontSize: '0.78rem', color: muted,
                    padding: '6px 16px', borderRadius: '20px',
                    border: `1px solid ${borderC}`,
                    display: 'inline-block',
                  }}>
                    📅 {getDateRangeStr(timeframe)}
                  </div>

                  {/* Categories */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {CATEGORY_CONFIG.map(({ key, emoji, label }, i) => (
                      <motion.div
                        key={key}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.07, duration: 0.4 }}
                        style={{
                          padding: '18px 20px',
                          borderRadius: '16px',
                          border: `1px solid ${borderC}`,
                          background: cardBg,
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                          <span style={{ fontSize: '1.2rem' }}>{emoji}</span>
                          <span style={{
                            fontFamily: 'var(--font-heading)', fontWeight: 700,
                            fontSize: '0.95rem', color: primary,
                          }}>
                            {label}
                          </span>
                        </div>
                        <p style={{
                          color: text, lineHeight: '1.75', fontSize: '0.95rem',
                          margin: 0, opacity: 0.88,
                        }}>
                          {horoscopeData[key]}
                        </p>
                      </motion.div>
                    ))}
                  </div>

                  {/* CTA footer */}
                  <div style={{
                    marginTop: '24px', textAlign: 'center', padding: '16px',
                    borderRadius: '12px',
                    background: `linear-gradient(135deg, ${primary}0C, transparent)`,
                    border: `1px solid ${primary}22`,
                  }}>
                    <p style={{ fontSize: '0.8rem', color: muted, margin: '0 0 8px' }}>
                      Want a deeper, personalised reading?
                    </p>
                    <span style={{ fontSize: '0.85rem', color: primary, fontWeight: 600 }}>
                      ✦ Book a consultation with Ashay Krishn Goswami ✦
                    </span>
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>

          {/* ─── Footer nav ─── */}
          <div style={{
            padding: '12px 24px',
            borderTop: `1px solid ${borderC}`,
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            background: `${primary}05`,
          }}>
            <button
              onClick={() => navigateSign(-1)}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '8px 16px', borderRadius: '10px',
                border: `1px solid ${borderC}`, background: 'transparent',
                color: primary, cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600,
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = `${primary}15`; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
            >
              ‹ {ZODIAC_SIGNS[(signIdx - 1 + 12) % 12].name}
            </button>
            <span style={{ fontSize: '0.75rem', color: muted }}>
              {signIdx + 1} / 12
            </span>
            <button
              onClick={() => navigateSign(1)}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '8px 16px', borderRadius: '10px',
                border: `1px solid ${borderC}`, background: 'transparent',
                color: primary, cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600,
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = `${primary}15`; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
            >
              {ZODIAC_SIGNS[(signIdx + 1) % 12].name} ›
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default HoroscopeModal;
