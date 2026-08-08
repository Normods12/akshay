import React, { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { calculateKundli, searchLocations } from '../utils/kundliCalculator';
import KundliBookViewer from '../components/ui/KundliBookViewer';
import CosmicStarfield from '../components/ui/CosmicStarfield';
import MandalaArt from '../components/ui/MandalaArt';

// ─── Simple debounce hook ────────────────────────────────────────────────────
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

// ─── FormField ───────────────────────────────────────────────────────────────
const FormField = ({ label, type = 'text', value, onChange, placeholder, required, children }) => {
  const { colors } = useTheme();
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', position: 'relative' }}>
      <label style={{
        fontSize: '0.78rem', fontWeight: 600, letterSpacing: '0.05em',
        color: focused ? colors.primary : colors.text,
        opacity: focused ? 1 : 0.65,
        textTransform: 'uppercase', fontFamily: 'var(--font-body)', transition: 'color 0.2s'
      }}>
        {label} {required && <span style={{ color: colors.primary }}>*</span>}
      </label>
      {children || (
        <input
          type={type} value={value} onChange={e => onChange(e.target.value)}
          placeholder={placeholder} required={required}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          style={{
            padding: '13px 16px', borderRadius: '10px',
            border: `1.5px solid ${focused ? colors.primary : colors.outline + '55'}`,
            backgroundColor: focused ? `${colors.primary}08` : 'transparent',
            color: colors.text, fontFamily: 'var(--font-body)', fontSize: '1rem',
            outline: 'none', width: '100%', boxSizing: 'border-box',
            transition: 'all 0.25s ease',
            boxShadow: focused ? `0 0 0 3px ${colors.primary}18` : 'none'
          }}
        />
      )}
    </div>
  );
};

// ─── Location Picker (dropdown autocomplete) ─────────────────────────────────
const LocationPicker = ({ value, onChange, onLocationSelect, required }) => {
  const { colors, themeMode } = useTheme();
  const [query, setQuery] = useState(value || '');
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(false);
  const [selected, setSelected] = useState(null);
  const debouncedQuery = useDebounce(query, 400);
  const containerRef = useRef(null);

  // Search when query changes
  useEffect(() => {
    if (debouncedQuery.length < 2 || selected) return;
    setLoading(true);
    searchLocations(debouncedQuery).then(res => {
      setResults(res);
      setIsOpen(res.length > 0);
      setLoading(false);
    });
  }, [debouncedQuery]);

  // Click outside to close
  useEffect(() => {
    const handler = (e) => { if (!containerRef.current?.contains(e.target)) setIsOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSelect = (loc) => {
    setSelected(loc);
    setQuery(loc.shortName);
    setIsOpen(false);
    onChange(loc.shortName);
    onLocationSelect(loc);
  };

  const handleInputChange = (val) => {
    setQuery(val);
    setSelected(null);
    onLocationSelect(null);
    onChange(val);
    if (val.length < 2) { setResults([]); setIsOpen(false); }
  };

  const isDark = themeMode === 'dark';

  return (
    <div ref={containerRef} style={{ position: 'relative' }}>
      <div style={{ position: 'relative' }}>
        <input
          type="text"
          value={query}
          onChange={e => handleInputChange(e.target.value)}
          onFocus={() => { setFocused(true); if (results.length > 0 && !selected) setIsOpen(true); }}
          onBlur={() => setFocused(false)}
          placeholder="Type city name, e.g. Mumbai, Varanasi..."
          required={required}
          style={{
            padding: '13px 40px 13px 16px', borderRadius: '10px',
            border: `1.5px solid ${focused ? colors.primary : (selected ? colors.primary + '88' : colors.outline + '55')}`,
            backgroundColor: focused ? `${colors.primary}08` : 'transparent',
            color: colors.text, fontFamily: 'var(--font-body)', fontSize: '1rem',
            outline: 'none', width: '100%', boxSizing: 'border-box',
            transition: 'all 0.25s ease',
            boxShadow: focused ? `0 0 0 3px ${colors.primary}18` : 'none',
          }}
        />
        {/* Status icon */}
        <div style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
          {loading ? (
            <motion.span animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
              style={{ color: colors.primary, fontSize: '0.9rem', display: 'inline-block' }}>⟳</motion.span>
          ) : selected ? (
            <span style={{ color: '#4CAF50', fontSize: '1rem' }}>✓</span>
          ) : (
            <span style={{ color: colors.text, opacity: 0.4, fontSize: '0.9rem' }}>📍</span>
          )}
        </div>
      </div>

      {/* Selected location info */}
      {selected && (
        <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
          style={{ marginTop: '6px', padding: '6px 12px', borderRadius: '8px', backgroundColor: `${colors.primary}12`, border: `1px solid ${colors.primary}33`, fontSize: '0.75rem', color: colors.primary }}>
          📍 {selected.displayName?.substring(0, 80)}{selected.displayName?.length > 80 ? '...' : ''}
          <button onClick={() => { setSelected(null); setQuery(''); onChange(''); onLocationSelect(null); }}
            style={{ marginLeft: '8px', background: 'none', border: 'none', color: colors.primary, cursor: 'pointer', fontSize: '0.8rem', opacity: 0.7 }}>✕</button>
        </motion.div>
      )}

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -8, scaleY: 0.9 }}
            animate={{ opacity: 1, y: 0, scaleY: 1 }}
            exit={{ opacity: 0, y: -8, scaleY: 0.9 }}
            transition={{ duration: 0.18 }}
            style={{
              position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 1000,
              marginTop: '4px', borderRadius: '12px',
              backgroundColor: isDark ? '#111108' : '#fffff0',
              border: `1.5px solid ${colors.primary}44`,
              boxShadow: `0 12px 40px ${isDark ? 'rgba(0,0,0,0.6)' : 'rgba(0,0,0,0.15)'}`,
              overflow: 'hidden',
              transformOrigin: 'top',
            }}
          >
            <div style={{ padding: '6px 0', maxHeight: '260px', overflowY: 'auto' }}>
              {results.map((loc, i) => (
                <motion.button
                  key={i}
                  whileHover={{ backgroundColor: `${colors.primary}12` }}
                  onClick={() => handleSelect(loc)}
                  style={{
                    width: '100%', textAlign: 'left', padding: '10px 16px',
                    border: 'none', backgroundColor: 'transparent', cursor: 'pointer',
                    borderBottom: i < results.length - 1 ? `1px solid ${colors.outline}18` : 'none',
                    display: 'flex', flexDirection: 'column', gap: '2px',
                  }}
                >
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.9rem', fontWeight: 600, color: colors.text }}>
                    📍 {loc.shortName}
                  </span>
                  <span style={{ fontSize: '0.72rem', color: colors.text, opacity: 0.5, lineHeight: 1.3 }}>
                    {loc.displayName?.substring(0, 70)}{loc.displayName?.length > 70 ? '...' : ''}
                  </span>
                  <span style={{ fontSize: '0.65rem', color: colors.primary, opacity: 0.7 }}>
                    {loc.latitude?.toFixed(3)}°N · {loc.longitude?.toFixed(3)}°E
                  </span>
                </motion.button>
              ))}
            </div>
            <div style={{ padding: '6px 12px', borderTop: `1px solid ${colors.outline}18`, fontSize: '0.65rem', opacity: 0.4, textAlign: 'right' }}>
              via OpenStreetMap
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ─── Planet Orbit Loading Canvas ─────────────────────────────────────────────
const OrbitLoadingCanvas = () => {
  const canvasRef = useRef(null);
  const animRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.offsetWidth; const H = canvas.offsetHeight;
    canvas.width = W; canvas.height = H;
    const cx = W / 2, cy = H / 2;
    const t0 = Date.now();

    const planets = [
      { r: 48, speed: 1.8,  size: 5,  color: '#FFD700', angle: 0,    glyph: '☉' },
      { r: 70, speed: 1.2,  size: 4,  color: '#C0C0C0', angle: 1.2,  glyph: '☽' },
      { r: 90, speed: 0.9,  size: 3.5,color: '#FF5555', angle: 2.4,  glyph: '♂' },
      { r: 112,speed: 0.65, size: 6,  color: '#FFB347', angle: 0.6,  glyph: '♃' },
      { r: 134,speed: 0.45, size: 4,  color: '#AA77FF', angle: 4.0,  glyph: '♄' },
    ];

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      const t = (Date.now() - t0) / 1000;

      // Central mandala Om glow
      const coreGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 30);
      coreGrad.addColorStop(0, 'rgba(212,175,55,0.6)');
      coreGrad.addColorStop(0.5, 'rgba(212,175,55,0.1)');
      coreGrad.addColorStop(1, 'transparent');
      ctx.beginPath(); ctx.arc(cx, cy, 30, 0, Math.PI * 2);
      ctx.fillStyle = coreGrad; ctx.fill();
      ctx.fillStyle = 'rgba(212,175,55,0.9)'; ctx.font = '20px serif';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText('ॐ', cx, cy);

      planets.forEach((p, i) => {
        const angle = p.angle + t * p.speed;

        // Orbit ellipse
        ctx.beginPath();
        ctx.ellipse(cx, cy, p.r, p.r * 0.38, 0, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(212,175,55,0.15)`; ctx.lineWidth = 1;
        ctx.setLineDash([4, 6]); ctx.stroke(); ctx.setLineDash([]);

        // Planet glow trail
        for (let trail = 6; trail >= 0; trail--) {
          const ta = angle - trail * 0.08;
          const tx = cx + p.r * Math.cos(ta);
          const ty = cy + p.r * 0.38 * Math.sin(ta);
          ctx.beginPath(); ctx.arc(tx, ty, p.size * (1 - trail / 8), 0, Math.PI * 2);
          ctx.fillStyle = p.color; ctx.globalAlpha = (1 - trail / 8) * 0.25;
          ctx.fill();
        }
        ctx.globalAlpha = 1;

        // Planet body
        const px = cx + p.r * Math.cos(angle);
        const py = cy + p.r * 0.38 * Math.sin(angle);
        const grad = ctx.createRadialGradient(px - p.size * 0.3, py - p.size * 0.3, 0, px, py, p.size * 1.5);
        grad.addColorStop(0, '#fff');
        grad.addColorStop(0.3, p.color);
        grad.addColorStop(1, `${p.color}00`);
        ctx.beginPath(); ctx.arc(px, py, p.size * 1.5, 0, Math.PI * 2);
        ctx.fillStyle = grad; ctx.fill();
        ctx.beginPath(); ctx.arc(px, py, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color; ctx.fill();
      });

      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, []);

  return <canvas ref={canvasRef} style={{ width: '280px', height: '280px' }} />;
};

// ─── Loading Screen ───────────────────────────────────────────────────────────
const LoadingScreen = ({ name }) => {
  const { colors } = useTheme();
  const tips = [
    'Calculating planetary positions with Lahiri Ayanamsha...',
    'Computing your Lagna (Ascendant)...',
    'Placing planets in the 12 houses...',
    'Calculating Vimshottari Dasha periods...',
    'Detecting doshas...',
    'Preparing your Kundali book...',
  ];
  const [tipIdx, setTipIdx] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTipIdx(i => (i + 1) % tips.length), 1200);
    return () => clearInterval(id);
  }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ textAlign: 'center', padding: '60px 20px', minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <OrbitLoadingCanvas />
      <motion.h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', color: colors.primary, marginBottom: '10px', marginTop: '10px' }}
        animate={{ opacity: [0.7, 1, 0.7] }} transition={{ duration: 2, repeat: Infinity }}>
        Reading the Stars for {name}...
      </motion.h2>
      <AnimatePresence mode="wait">
        <motion.p key={tipIdx}
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
          style={{ color: colors.text, opacity: 0.65, fontFamily: 'var(--font-body)', fontSize: '0.9rem' }}>
          {tips[tipIdx]}
        </motion.p>
      </AnimatePresence>
    </motion.div>
  );
};

// ─── Planet Debug Table ──────────────────────────────────────────────────────
const PLANET_COLORS_MAP = {
  Sun:'#FFD700', Moon:'#C0C0C0', Mars:'#FF5555', Mercury:'#40E0D0',
  Jupiter:'#FFB347', Venus:'#FF9EC4', Saturn:'#AA77FF', Rahu:'#888', Ketu:'#CD853F', ASCENDANT:'#d4af37'
};

const PlanetDebugTable = ({ result }) => {
  const { colors, themeMode } = useTheme();
  const isDark = themeMode === 'dark';
  const bg   = isDark ? 'rgba(15,12,5,0.95)' : 'rgba(255,252,240,0.98)';
  const border = isDark ? 'rgba(212,175,55,0.2)' : 'rgba(180,140,60,0.25)';
  const hdr  = isDark ? 'rgba(212,175,55,0.12)' : 'rgba(184,134,11,0.1)';
  const alt  = isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)';

  const rows = [
    ...( result.planets || [] ),
    result.ascendantData,
  ].filter(Boolean);

  const col = (txt, extra = {}) => ({
    fontSize: '0.72rem', padding: '6px 10px', borderBottom: `1px solid ${border}`,
    borderRight: `1px solid ${border}`, whiteSpace: 'nowrap', ...extra
  });

  const HEADERS = ['Planet', 'R', 'Sign', 'Sign Lord', 'Degree', 'Nakshatra', 'Nak. Lord', 'House'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
      style={{ marginTop: '40px', borderRadius: '16px', overflow: 'hidden', border: `1px solid ${border}`,
        boxShadow: isDark ? '0 8px 32px rgba(0,0,0,0.5)' : '0 8px 32px rgba(0,0,0,0.08)' }}
    >
      {/* Header */}
      <div style={{ padding: '14px 20px', background: hdr, borderBottom: `1px solid ${border}`,
        display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ fontSize: '1rem' }}>🔬</span>
        <span style={{ fontFamily: 'var(--font-heading)', fontSize: '0.95rem', color: colors.primary, fontWeight: 700 }}>
          Planet Positions Table
        </span>
        <span style={{ fontSize: '0.7rem', opacity: 0.5, marginLeft: 'auto' }}>
          Lahiri Ayanamsha · Swiss Ephemeris
        </span>
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto', backgroundColor: bg }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-body)' }}>
          <thead>
            <tr style={{ backgroundColor: hdr }}>
              {HEADERS.map(h => (
                <th key={h} style={{ ...col('', {}), fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.06em',
                  textTransform: 'uppercase', color: colors.primary, textAlign: 'left' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((p, i) => (
              <tr key={p.name} style={{ backgroundColor: i % 2 === 0 ? 'transparent' : alt }}>
                <td style={{ ...col(''), color: PLANET_COLORS_MAP[p.name] || colors.primary, fontWeight: 700 }}>
                  {p.glyph ? `${p.glyph} ` : ''}{p.name}
                </td>
                <td style={{ ...col(''), color: p.isRetrograde ? '#FF5555' : (isDark ? '#4CAF50' : '#2e7d32'),
                  fontWeight: 700, textAlign: 'center' }}>
                  {p.isRetrograde ? 'R' : '—'}
                </td>
                <td style={{ ...col(''), color: colors.text }}>{p.sign}</td>
                <td style={{ ...col(''), color: colors.text, opacity: 0.75 }}>{p.signLord}</td>
                <td style={{ ...col(''), fontFamily: 'monospace', color: colors.text }}>{p.degree}°</td>
                <td style={{ ...col(''), color: colors.text }}>{p.nakshatra}</td>
                <td style={{ ...col(''), color: colors.text, opacity: 0.75 }}>{p.nakshatraLord}</td>
                <td style={{ ...col(''), color: colors.primary, fontWeight: 700, textAlign: 'center',
                  borderRight: 'none' }}>{p.house}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ padding: '8px 16px', background: hdr, borderTop: `1px solid ${border}`,
        fontSize: '0.65rem', opacity: 0.5, textAlign: 'right' }}>
        Ayanamsha: {parseFloat(result.ayanamsha || 0).toFixed(4)}° Lahiri · JD {result.julianDay}
      </div>
    </motion.div>
  );
};

// ─── Main FreeKundli Page ────────────────────────────────────────────────────
const FreeKundli = () => {
  const { colors, themeMode } = useTheme();
  const [step, setStep] = useState('form');
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const [formData, setFormData] = useState({ name: '', dateOfBirth: '', timeOfBirth: '', birthPlace: '' });
  const [locationObj, setLocationObj] = useState(null);

  const update = useCallback((key) => (val) => setFormData(f => ({ ...f, [key]: val })), []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.dateOfBirth || !formData.timeOfBirth || !formData.birthPlace) {
      setError('Please fill in all fields.');
      return;
    }
    if (!locationObj) {
      setError('Please select a location from the dropdown to ensure accuracy.');
      return;
    }
    setError('');
    setStep('loading');
    try {
      const data = await calculateKundli({ ...formData, locationObj });
      setResult(data);
      setStep('result');
    } catch (err) {
      setError(err.message || 'Calculation failed. Please try again.');
      setStep('form');
    }
  };

  const reset = () => { setStep('form'); setResult(null); setError(''); setLocationObj(null); };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}
      style={{ position: 'relative', minHeight: 'calc(100vh - 80px)', backgroundColor: colors.surface, overflow: 'hidden' }}
    >
      <CosmicStarfield starCount={120} opacity={themeMode === 'dark' ? 0.45 : 0.15} />
      <MandalaArt
        size={600}
        opacity={themeMode === 'dark' ? 0.08 : 0.1}
        style={{ top: '-10%', right: '-10%', zIndex: 0 }}
      />

      <div className="container" style={{ position: 'relative', zIndex: 1, padding: '60px 20px' }}>
        <AnimatePresence mode="wait">

          {/* ── FORM ── */}
          {step === 'form' && (
            <motion.div key="form" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '60px', alignItems: 'center' }}>

                {/* Left: Hero text */}
                <motion.div initial={{ x: -30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
                  <div style={{
                    display: 'inline-block', padding: '5px 14px',
                    backgroundColor: `${colors.primary}18`, color: colors.primary,
                    borderRadius: '20px', fontSize: '0.78rem', fontWeight: 700,
                    marginBottom: '20px', border: `1px solid ${colors.primary}33`, fontFamily: 'var(--font-body)'
                  }}>✦ Vedic Astrology · Lahiri Ayanamsha</div>
                  <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', color: colors.primary, lineHeight: 1.15, marginBottom: '18px' }}>
                    Free Kundli Calculator
                  </h1>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '1.05rem', color: colors.text, opacity: 0.85, lineHeight: 1.7, marginBottom: '28px' }}>
                    Get your authentic Vedic birth chart — planets, Dasha, Nakshatra, and dosha analysis. Delivered as a beautiful Kundali book. Free & instant.
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {[
                      { icon: '📖', text: 'Delivered in premium Book format' },
                      { icon: '☉', text: '9 Planets + Rahu/Ketu placement' },
                      { icon: '🏠', text: 'North Indian 12-house chart' },
                      { icon: '⏳', text: 'Complete Vimshottari Dasha timeline' },
                      { icon: '⚠️', text: 'Mangal & Kaal Sarp dosha detection' },
                    ].map(({ icon, text }, i) => (
                      <motion.div key={i} initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.07 }}
                        style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ fontSize: '1.1rem', width: '22px', textAlign: 'center' }}>{icon}</span>
                        <span style={{ color: colors.text, fontSize: '0.95rem', opacity: 0.9 }}>{text}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Right: Form card */}
                <motion.div initial={{ x: 30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.2 }}
                  className="glass-panel kundli-form-card"
                  style={{
                    padding: '36px', borderRadius: '20px',
                    border: `1px solid ${colors.outline}33`,
                    backgroundColor: themeMode === 'dark' ? 'rgba(15,12,5,0.92)' : 'rgba(255,255,240,0.94)',
                    boxShadow: themeMode === 'dark' ? `0 20px 60px rgba(0,0,0,0.6), 0 0 40px ${colors.primary}12` : '0 20px 60px rgba(0,0,0,0.1)',
                  }}>
                  <div style={{ textAlign: 'center', marginBottom: '26px' }}>
                    <div style={{ fontSize: '1.8rem', marginBottom: '8px' }}>🔮</div>
                    <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', color: colors.primary }}>Enter Birth Details</h2>
                    <p style={{ color: colors.text, opacity: 0.55, fontSize: '0.82rem', marginTop: '4px' }}>All fields required for accurate calculation</p>
                  </div>

                  <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                    <FormField label="Full Name" value={formData.name} onChange={update('name')} placeholder="Enter your full name" required />

                    <div className="kundli-form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                      <FormField label="Date of Birth" type="date" value={formData.dateOfBirth} onChange={update('dateOfBirth')} required />
                      <FormField label="Time of Birth" type="time" value={formData.timeOfBirth} onChange={update('timeOfBirth')} required />
                    </div>


                    {/* Location Picker */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{
                        fontSize: '0.78rem', fontWeight: 600, letterSpacing: '0.05em', color: colors.text,
                        opacity: 0.65, textTransform: 'uppercase', fontFamily: 'var(--font-body)',
                      }}>
                        Birth Place <span style={{ color: colors.primary }}>*</span>
                      </label>
                      <LocationPicker
                        value={formData.birthPlace}
                        onChange={update('birthPlace')}
                        onLocationSelect={setLocationObj}
                        required
                      />
                      {!locationObj && formData.birthPlace && (
                        <p style={{ fontSize: '0.72rem', color: colors.primary, opacity: 0.75, margin: '2px 0 0' }}>
                          ↑ Select a location from the dropdown for accurate coordinates
                        </p>
                      )}
                    </div>

                    {error && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        style={{ padding: '10px 14px', borderRadius: '8px', backgroundColor: '#FF444418', border: '1px solid #FF444440', color: '#FF4444', fontSize: '0.85rem' }}>
                        ⚠️ {error}
                      </motion.div>
                    )}

                    <motion.button type="submit" whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }}
                      style={{
                        padding: '14px', borderRadius: '12px', border: 'none',
                        background: `linear-gradient(135deg, ${colors.primary}, ${colors.primary}cc)`,
                        color: '#FFFFFF', fontFamily: 'var(--font-heading)', fontSize: '1.05rem', fontWeight: 700,
                        cursor: 'pointer', boxShadow: `0 8px 24px ${colors.primary}44`, marginTop: '4px',
                      }}>
                      ✦ Generate Kundali Book
                    </motion.button>
                    <p style={{ textAlign: 'center', fontSize: '0.72rem', color: colors.text, opacity: 0.4, marginTop: '-6px' }}>
                      Lahiri Ayanamsha · VSOP87 Algorithms · Free Forever
                    </p>
                  </form>
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* ── LOADING ── */}
          {step === 'loading' && (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <LoadingScreen name={formData.name} />
            </motion.div>
          )}

          {/* ── RESULTS: BOOK VIEWER ── */}
          {step === 'result' && result && (
            <motion.div key="result" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              {/* Header */}
              <div style={{ textAlign: 'center', marginBottom: '36px' }}>
                <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 200 }}
                  style={{ fontSize: '2.5rem', marginBottom: '8px' }}>📖</motion.div>
                <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', color: colors.primary, marginBottom: '6px' }}>
                  {result.name}'s Vedic Kundali
                </h1>
                <p style={{ color: colors.text, opacity: 0.6, fontSize: '0.9rem' }}>
                  {result.dateOfBirth} · {result.timeOfBirth} · {result.birthPlace}
                </p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '14px', flexWrap: 'wrap' }}>
                  {[
                    { label: 'Lagna', value: result.ascendant },
                    { label: 'Rashi', value: result.moonSign },
                    { label: 'Nakshatra', value: result.nakshatra },
                  ].map(({ label, value }) => (
                    <motion.div key={label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                      style={{
                        textAlign: 'center', padding: '8px 18px', borderRadius: '30px',
                        border: `1px solid ${colors.primary}33`, backgroundColor: `${colors.primary}10`
                      }}>
                      <div style={{ fontSize: '0.65rem', color: colors.primary, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{label}</div>
                      <div style={{ fontFamily: 'var(--font-heading)', color: colors.text, fontWeight: 700, marginTop: '2px', fontSize: '0.9rem' }}>{value}</div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Book Viewer */}
              <KundliBookViewer result={result} />

              {/* Debug Planet Table */}
              <PlanetDebugTable result={result} />

              {/* Reset */}
              <div style={{ textAlign: 'center', marginTop: '32px' }}>
                <motion.button onClick={reset} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  style={{
                    padding: '11px 30px', borderRadius: '30px', border: `2px solid ${colors.primary}`,
                    backgroundColor: 'transparent', color: colors.primary,
                    fontFamily: 'var(--font-heading)', fontSize: '0.95rem', fontWeight: 700, cursor: 'pointer',
                  }}>
                  ← Calculate Another Kundli
                </motion.button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default FreeKundli;
