import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import KundliChartSVG from './KundliChartSVG';

// ─── Inline SVG Icons ────────────────────────────────────────────────────────
const SvgIcon = ({ children, size = 16, style, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, ...style }}>
    {children}
  </svg>
);

const IconCrystalBall = (p) => <SvgIcon {...p}><circle cx="12" cy="12" r="7"/><path d="M8 21h8"/><path d="M12 19v2"/></SvgIcon>;
const IconCalendar = (p) => <SvgIcon {...p}><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></SvgIcon>;
const IconClock = (p) => <SvgIcon {...p}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></SvgIcon>;
const IconMapPin = (p) => <SvgIcon {...p}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></SvgIcon>;
const IconPlanet = (p) => <SvgIcon {...p}><circle cx="12" cy="12" r="5"/><path d="M12 17c-4 0-8-1-10-3 0-2.5 4.5-4 10-4s10 1.5 10 4c-2 2-6 3-10 3z"/></SvgIcon>;
const IconMoon = (p) => <SvgIcon {...p}><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></SvgIcon>;
const IconStar = (p) => <SvgIcon {...p}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></SvgIcon>;
const IconTrident = (p) => <SvgIcon {...p}><path d="M3 8v3a9 9 0 0 0 18 0V8"/><line x1="12" y1="2" x2="12" y2="22"/><line x1="9" y1="22" x2="15" y2="22"/></SvgIcon>;
const IconGlobe = (p) => <SvgIcon {...p}><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></SvgIcon>;
const IconTelescope = (p) => <SvgIcon {...p}><path d="M22 2l-3 3"/><path d="M14 6l6 6"/><path d="M8 12l6 6"/><path d="M4 16l-2 6 6-2"/><path d="M10.8 7.2l6 6L9 21 3 15l7.8-7.8z"/></SvgIcon>;
const IconLotus = (p) => <SvgIcon {...p}><path d="M12 22s-8-6-8-12c0-4.4 3.6-8 8-8s8 3.6 8 8c0 6-8 12-8 12z"/><path d="M12 22s4-6 4-12c0-2.2-1.8-4-4-4s-4 1.8-4 4c0 6 4 12 4 12z"/><path d="M12 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></SvgIcon>;
const IconSunrise = (p) => <SvgIcon {...p}><path d="M12 2v6"/><path d="M4.22 10.22l1.42 1.42"/><path d="M18.36 10.22l-1.42 1.42"/><path d="M2 18h20"/><path d="M12 18a6 6 0 0 0-6-6h12a6 6 0 0 0-6 6z"/></SvgIcon>;
const IconOm = (p) => <SvgIcon {...p}><path d="M12 2c-.6 0-1.1.2-1.5.6-.4.4-.6.9-.6 1.5 0 .6.2 1.1.6 1.5.4.4.9.6 1.5.6s1.1-.2 1.5-.6c.4-.4.6-.9.6-1.5s-.2-1.1-.6-1.5c-.4-.4-.9-.6-1.5-.6z" /><path d="M7.5 10c0-1.4 1.1-2.5 2.5-2.5h4c1.4 0 2.5 1.1 2.5 2.5s-1.1 2.5-2.5 2.5h-1c-1.4 0-2.5 1.1-2.5 2.5s1.1 2.5 2.5 2.5h2" /><path d="M6 14.5c-1.1 0-2 .9-2 2s.9 2 2 2" /><path d="M18 14.5c1.1 0 2 .9 2 2s-.9 2-2 2" /></SvgIcon>;
const IconScroll = (p) => <SvgIcon {...p}><path d="M4 18V4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z" /><path d="M4 18c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2" /><path d="M8 7h8" /><path d="M8 11h8" /><path d="M8 15h4" /></SvgIcon>;

// ─── Colour helper ────────────────────────────────────────────────────────────
const RASHI_MEANING = {
  Mesha:'♈ Aries', Vrishabha:'♉ Taurus', Mithuna:'♊ Gemini', Karka:'♋ Cancer',
  Simha:'♌ Leo', Kanya:'♍ Virgo', Tula:'♎ Libra', Vrishchika:'♏ Scorpio',
  Dhanu:'♐ Sagittarius', Makara:'♑ Capricorn', Kumbha:'♒ Aquarius', Meena:'♓ Pisces'
};
const PLANET_COLORS = {
  Sun:'#FFD700', Moon:'#C0C0C0', Mars:'#FF5555', Mercury:'#40E0D0',
  Jupiter:'#FFB347', Venus:'#FF9EC4', Saturn:'#AA77FF', Rahu:'#888', Ketu:'#CD853F'
};
const PLANET_GLYPHS   = { Sun:'☉', Moon:'☽', Mars:'♂', Mercury:'☿', Jupiter:'♃', Venus:'♀', Saturn:'♄', Rahu:'☊', Ketu:'☋' };
const PLANET_SYMBOLS  = { Sun:'Su', Moon:'Mo', Mars:'Ma', Mercury:'Me', Jupiter:'Ju', Venus:'Ve', Saturn:'Sa', Rahu:'Ra', Ketu:'Ke' };

// ─── Corner Flourish ──────────────────────────────────────────────────────────
const CornerFlourish = ({ color }) => (
  <>
    {[
      { top: '5px', left: '5px', rotate: 0 },
      { top: '5px', right: '5px', rotate: 90 },
      { bottom: '5px', right: '5px', rotate: 180 },
      { bottom: '5px', left: '5px', rotate: 270 }
    ].map((pos, i) => (
      <svg key={i} width="46" height="46" viewBox="0 0 100 100" style={{
        position: 'absolute', top: pos.top, bottom: pos.bottom, left: pos.left, right: pos.right,
        transform: `rotate(${pos.rotate}deg)`, opacity: 0.35, pointerEvents: 'none', zIndex: 11
      }}>
        <path d="M 0,0 C 40,0 60,20 60,60 C 60,80 80,100 100,100" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
        <path d="M 0,25 C 25,25 35,35 35,60" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
        <path d="M 25,0 C 25,25 35,35 60,35" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="16" cy="16" r="3" fill={color} />
        <circle cx="48" cy="48" r="1.5" fill={color} />
      </svg>
    ))}
  </>
);

// ─── Golden Spiral Particle Canvas ───────────────────────────────────────────
const GoldenParticles = ({ active = true }) => {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const particlesRef = useRef([]);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    const cx = canvas.width / 2, cy = canvas.height / 2;

    particlesRef.current = Array.from({ length: 80 }, (_, i) => {
      const angle = (i / 80) * Math.PI * 6;
      const r = (i / 80) * Math.min(cx, cy) * 0.85;
      return {
        baseAngle: angle,
        speed: 0.004 + Math.random() * 0.008,
        r: r + (Math.random() - 0.5) * 20,
        size: Math.random() * 2.5 + 0.8,
        alpha: Math.random() * 0.5 + 0.3,
        alphaDir: Math.random() > 0.5 ? 1 : -1,
        alphaSpeed: 0.008 + Math.random() * 0.012,
        hue: 40 + Math.random() * 25,
        t: Math.random() * Math.PI * 2,
      };
    });

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particlesRef.current.forEach(p => {
        p.t += p.speed;
        p.alpha += p.alphaSpeed * p.alphaDir;
        if (p.alpha > 0.9 || p.alpha < 0.1) p.alphaDir *= -1;

        const x = cx + p.r * Math.cos(p.baseAngle + p.t);
        const y = cy + p.r * Math.sin(p.baseAngle + p.t) * 0.4;

        const grad = ctx.createRadialGradient(x, y, 0, x, y, p.size * 3);
        grad.addColorStop(0, `hsla(${p.hue}, 100%, 75%, ${p.alpha})`);
        grad.addColorStop(1, `hsla(${p.hue}, 100%, 55%, 0)`);
        ctx.beginPath();
        ctx.arc(x, y, p.size * 3, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(x, y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 100%, 90%, ${p.alpha * 1.2})`;
        ctx.fill();
      });
      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, [active]);

  return (
    <canvas ref={canvasRef} style={{
      position: 'absolute', inset: 0, width: '100%', height: '100%',
      pointerEvents: 'none', opacity: 0.7, zIndex: 0
    }} />
  );
};

// ─── Warp-Speed Transition Canvas ────────────────────────────────────────────
const WarpCanvas = ({ active }) => {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const streaksRef = useRef([]);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    const cx = canvas.width / 2, cy = canvas.height / 2;

    streaksRef.current = Array.from({ length: 60 }, () => {
      const angle = Math.random() * Math.PI * 2;
      const d = Math.random() * 30 + 10;
      return { angle, d, speed: Math.random() * 30 + 15, alpha: 1, length: 0 };
    });

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let done = true;
      streaksRef.current.forEach(s => {
        s.d += s.speed;
        s.length = Math.min(s.d * 0.4, 80);
        s.alpha = Math.max(0, 1 - s.d / Math.max(cx, cy));
        if (s.alpha > 0) done = false;

        const x1 = cx + s.d * Math.cos(s.angle);
        const y1 = cy + s.d * Math.sin(s.angle);
        const x0 = cx + (s.d - s.length) * Math.cos(s.angle);
        const y0 = cy + (s.d - s.length) * Math.sin(s.angle);

        const grad = ctx.createLinearGradient(x0, y0, x1, y1);
        grad.addColorStop(0, `rgba(212,175,55,0)`);
        grad.addColorStop(1, `rgba(255,240,200,${s.alpha})`);
        ctx.beginPath();
        ctx.moveTo(x0, y0);
        ctx.lineTo(x1, y1);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.5;
        ctx.globalAlpha = s.alpha;
        ctx.stroke();
      });
      ctx.globalAlpha = 1;
      if (!done) animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, [active]);

  return active ? (
    <canvas ref={canvasRef} style={{
      position: 'absolute', inset: 0, width: '100%', height: '100%',
      pointerEvents: 'none', zIndex: 20,
    }} />
  ) : null;
};

// ─── Ornamental Divider ───────────────────────────────────────────────────────
const Divider = ({ color = '#d4af37' }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '12px 0' }}>
    <div style={{ flex: 1, height: '1px', background: `linear-gradient(to right, transparent, ${color}88)` }} />
    <span style={{ color, fontSize: '0.9rem' }}>✦</span>
    <div style={{ flex: 1, height: '1px', background: `linear-gradient(to left, transparent, ${color}88)` }} />
  </div>
);

// ─── Glowing Planet Pill ─────────────────────────────────────────────────────
const PlanetPill = ({ planet, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.5, x: Math.random() > 0.5 ? 80 : -80 }}
    animate={{ opacity: 1, scale: 1, x: 0 }}
    transition={{ delay, type: 'spring', stiffness: 200, damping: 18 }}
    style={{
      display: 'grid', gridTemplateColumns: '24px 1fr 1fr 40px 38px',
      alignItems: 'center', gap: '6px',
      padding: '5px 8px', borderRadius: '6px',
      backgroundColor: `${PLANET_COLORS[planet.name]}0A`,
      border: `1px solid ${PLANET_COLORS[planet.name]}33`,
    }}
  >
    <motion.span
      animate={{ filter: [`drop-shadow(0 0 2px ${PLANET_COLORS[planet.name]})`, `drop-shadow(0 0 8px ${PLANET_COLORS[planet.name]})`, `drop-shadow(0 0 2px ${PLANET_COLORS[planet.name]})`] }}
      transition={{ duration: 2 + delay, repeat: Infinity, ease: 'easeInOut' }}
      style={{ color: PLANET_COLORS[planet.name], fontSize: '1rem', textAlign: 'center' }}
    >
      {planet.glyph}
    </motion.span>
    <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '0.72rem' }}>{planet.name}</span>
    <span style={{ fontSize: '0.68rem', opacity: 0.7 }}>{RASHI_MEANING[planet.sign]?.split(' ')[1] || planet.sign}</span>
    <span style={{ fontSize: '0.6rem', opacity: 0.55, textAlign: 'right', fontFamily: 'monospace' }}>{planet.degreeStr || planet.degree + '°'}</span>
    <motion.span
      animate={{ opacity: planet.isRetrograde ? [0.5, 1, 0.5] : 1 }}
      transition={{ duration: 1.5, repeat: Infinity }}
      style={{ fontSize: '0.63rem', color: planet.isRetrograde ? '#FF5555' : '#4CAF50', textAlign: 'center' }}
    >
      {planet.isRetrograde ? '℞' : '▶'}
    </motion.span>
  </motion.div>
);

// ─── Pages ───────────────────────────────────────────────────────────────────

const CoverPage = ({ result, gold }) => (
  <div style={{ height: '100%', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '20px 30px' }}>
    <GoldenParticles active={true} />
    <div style={{ position: 'relative', zIndex: 1 }}>
      <motion.div animate={{ rotate: [0, 360] }} transition={{ duration: 35, repeat: Infinity, ease: 'linear' }}
        style={{ color: gold, marginBottom: '10px', filter: `drop-shadow(0 0 12px ${gold})`, display: 'inline-block' }}>
        <IconCrystalBall size={44} />
      </motion.div>
      <div style={{ fontSize: '0.65rem', letterSpacing: '0.25em', color: gold, textTransform: 'uppercase', marginBottom: '6px' }}>Vedic Astrology Report</div>
      <Divider color={gold} />
      <motion.h1
        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3, duration: 0.6 }}
        style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.3rem, 3vw, 2rem)', color: gold, marginBottom: '4px', lineHeight: 1.2,
          textShadow: `0 0 20px ${gold}66, 0 0 40px ${gold}33` }}>
        {result.name}
      </motion.h1>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', opacity: 0.65, marginBottom: '16px' }}>Janma Kundali (Birth Chart)</p>
      <Divider color={gold} />
      <div style={{ fontSize: '0.78rem', opacity: 0.7, lineHeight: 2.1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><IconCalendar size={14} color={gold} /> {new Date(result.dateOfBirth).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><IconClock size={14} color={gold} /> {result.timeOfBirth}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><IconMapPin size={14} color={gold} /> {result.birthPlace}</div>
      </div>
      <Divider color={gold} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', width: '100%' }}>
        {[
          { label: 'Lagna', value: result.ascendant },
          { label: 'Rashi', value: result.moonSign },
          { label: 'Nakshatra', value: result.nakshatra?.split(' ')[0] },
        ].map(({ label, value }, i) => (
          <motion.div key={label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 + i * 0.1 }}
            style={{ textAlign: 'center', padding: '7px 4px', border: `1px solid ${gold}44`, borderRadius: '8px', background: `${gold}08` }}>
            <div style={{ fontSize: '0.58rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: gold, opacity: 0.8 }}>{label}</div>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.75rem', color: gold, marginTop: '2px' }}>{value}</div>
          </motion.div>
        ))}
      </div>
      <p style={{ marginTop: '18px', fontSize: '0.6rem', opacity: 0.45, fontStyle: 'italic', letterSpacing: '0.05em' }}>
        Prepared by Ashay Krishn Goswami · Vedic Astrologer
      </p>
    </div>
  </div>
);

const ContentsPage = ({ gold, goTo }) => {
  const getIconForIndex = (i) => {
    switch (i) {
      case 2: return <IconScroll size={14} color={gold} />;
      case 3: return <IconSunrise size={14} color={gold} />;
      case 4: return <IconCrystalBall size={14} color={gold} />;
      case 5: return <IconLotus size={14} color={gold} />;
      case 6: return <IconMoon size={14} color={gold} />;
      case 7: return <IconPlanet size={14} color={gold} />;
      case 8: return <IconGlobe size={14} color={gold} />;
      case 9: return <IconGlobe size={14} color={gold} />;
      case 10: return <IconStar size={14} color={gold} />;
      case 11: return <IconClock size={14} color={gold} />;
      case 12: return <IconTrident size={14} color={gold} />;
      default: return <IconScroll size={14} color={gold} />;
    }
  };

  return (
    <div style={{ height: '100%', padding: '20px 24px', overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
      <div style={{ fontSize: '0.58rem', letterSpacing: '0.2em', color: gold, textTransform: 'uppercase', marginBottom: '2px' }}>Chapter I</div>
      <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', color: gold, marginBottom: '4px' }}>Table of Contents</h2>
      <Divider color={gold} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {PAGE_LABELS.map((label, idx) => {
          if (idx === 0 || idx === 1 || idx === PAGE_LABELS.length - 1) return null; // skip cover, contents, cert
          return (
            <motion.button key={label} onClick={() => goTo(idx)}
              whileHover={{ scale: 1.02, backgroundColor: `${gold}14` }} whileTap={{ scale: 0.98 }}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%',
                padding: '8px 12px', border: `1px solid ${gold}22`, borderRadius: '6px',
                backgroundColor: 'transparent', color: 'inherit', cursor: 'pointer', textAlign: 'left',
                transition: 'border-color 0.2s'
              }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ opacity: 0.8 }}>{getIconForIndex(idx)}</span>
                <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-heading)', fontWeight: 600 }}>{idx - 1}. {label}</span>
              </div>
              <span style={{ fontSize: '0.65rem', opacity: 0.5 }}>{idx + 1}</span>
            </motion.button>
          );
        })}
      </div>
      <Divider color={gold} />
    </div>
  );
};

const SummaryPage = ({ result, gold }) => (
  <div style={{ height: '100%', padding: '20px 24px', overflow: 'auto' }}>
    <div style={{ fontSize: '0.58rem', letterSpacing: '0.2em', color: gold, textTransform: 'uppercase', marginBottom: '2px' }}>Chapter II</div>
    <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', color: gold, marginBottom: '2px' }}>Birth Summary</h2>
    <Divider color={gold} />
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px' }}>
      {[
        { icon: <IconPlanet size={14} color={gold} />, label: 'Lagna', value: `${result.ascendant} (${result.ascendantDegree || ''})` },
        { icon: <IconMoon size={14} color={gold} />, label: 'Moon Sign', value: `${result.moonSign} — ${RASHI_MEANING[result.moonSign] || ''}` },
        { icon: <IconStar size={14} color={gold} />, label: 'Nakshatra', value: `${result.nakshatra} (Pada ${result.nakshatraPada})` },
        { icon: <IconTrident size={14} color={gold} />, label: 'Nakshatra Lord', value: result.nakshatraLord },
        { icon: <IconCalendar size={14} color={gold} />, label: 'Date of Birth', value: result.dateOfBirth },
        { icon: <IconClock size={14} color={gold} />, label: 'Time of Birth', value: result.timeOfBirth },
        { icon: <IconMapPin size={14} color={gold} />, label: 'Birth Place', value: result.birthPlace },
        { icon: <IconGlobe size={14} color={gold} />, label: 'Coordinates', value: `${result.location?.latitude?.toFixed(3)}°N, ${result.location?.longitude?.toFixed(3)}°E` },
        ...(result.timezone ? [{ icon: <IconClock size={14} color={gold} />, label: 'Timezone', value: `${result.timezone} (${result.utcOffset})` }] : []),
        ...(result.ayanamsha ? [{ icon: <IconTelescope size={14} color={gold} />, label: 'Ayanamsha', value: `${parseFloat(result.ayanamsha).toFixed(2)}° Lahiri` }] : []),
      ].map(({ icon, label, value }, i) => (
        <motion.div key={label} initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px', padding: '5px 0', borderBottom: `1px solid ${gold}18` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
            <span style={{ opacity: 0.8 }}>{icon}</span>
            <span style={{ fontSize: '0.7rem', opacity: 0.6 }}>{label}</span>
          </div>
          <span style={{ fontSize: '0.73rem', fontFamily: 'var(--font-heading)', color: gold, textAlign: 'right', fontWeight: 700 }}>{value}</span>
        </motion.div>
      ))}
    </div>
    <Divider color={gold} />
    <div style={{ fontSize: '0.62rem', opacity: 0.4, textAlign: 'center', letterSpacing: '0.03em' }}>
      ⚙ Engine: Swiss Ephemeris C Library · Ayanamsha: Lahiri
    </div>
  </div>
);

const PanchangPage = ({ result, gold }) => (
  <div style={{ height: '100%', padding: '20px 24px', overflow: 'auto' }}>
    <div style={{ fontSize: '0.58rem', letterSpacing: '0.2em', color: gold, textTransform: 'uppercase', marginBottom: '2px' }}>Chapter III</div>
    <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', color: gold, marginBottom: '2px' }}>Panchang Details</h2>
    <div style={{ fontSize: '0.68rem', opacity: 0.5, marginBottom: '4px' }}>Five Limbs of Time</div>
    <Divider color={gold} />
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px' }}>
      {[
        { icon: <IconMoon size={14} color={gold} />, label: 'Tithi', value: result.panchang?.tithi },
        { icon: <IconMoon size={14} color={gold} />, label: 'Paksha', value: result.panchang?.paksha },
        { icon: <IconCalendar size={14} color={gold} />, label: 'Vara (Day)', value: result.panchang?.vara },
        { icon: <IconStar size={14} color={gold} />, label: 'Nakshatra', value: result.panchang?.nakshatra },
        { icon: <IconLotus size={14} color={gold} />, label: 'Yoga', value: result.panchang?.yoga },
        { icon: <IconClock size={14} color={gold} />, label: 'Karana', value: result.panchang?.karana },
        { icon: <IconMoon size={14} color={gold} />, label: 'Moon Phase', value: result.panchang?.moonPhase },
        { icon: <IconClock size={14} color={gold} />, label: 'Rahu Kaal', value: result.panchang?.rahuKaal },
      ].map(({ icon, label, value }, i) => (
        <motion.div key={label} initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px', padding: '5px 0', borderBottom: `1px solid ${gold}18` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
            <span style={{ opacity: 0.8 }}>{icon}</span>
            <span style={{ fontSize: '0.7rem', opacity: 0.6 }}>{label}</span>
          </div>
          <span style={{ fontSize: '0.73rem', fontFamily: 'var(--font-heading)', color: gold, textAlign: 'right', fontWeight: 700 }}>{value || '—'}</span>
        </motion.div>
      ))}
    </div>
  </div>
);

const GenericChartPage = ({ gold, title, subtitle, chapter, houses, ascendantStr, size = 300 }) => {
  const [drawn, setDrawn] = useState(false);
  useEffect(() => { 
    setDrawn(false);
    const t = setTimeout(() => setDrawn(true), 300); 
    return () => clearTimeout(t); 
  }, [title]);

  return (
    <div style={{ height: '100%', padding: '14px 18px', display: 'flex', flexDirection: 'column' }}>
      <div style={{ fontSize: '0.58rem', letterSpacing: '0.2em', color: gold, textTransform: 'uppercase', marginBottom: '2px' }}>{chapter}</div>
      <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', color: gold, marginBottom: '2px' }}>{title}</h2>
      {subtitle && <div style={{ fontSize: '0.68rem', opacity: 0.5, marginBottom: '4px' }}>{subtitle}</div>}
      <Divider color={gold} />
      
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
        {/* Scroll Treatment wrapping the chart */}
        <div style={{ 
          position: 'relative', 
          backgroundColor: `${gold}0A`, 
          padding: '24px 16px',
          borderLeft: `1px solid ${gold}22`,
          borderRight: `1px solid ${gold}22`,
        }}>
          {/* Top scroll bar */}
          <div style={{ position: 'absolute', top: '-8px', left: '-10px', right: '-10px', height: '12px', borderRadius: '6px', 
            background: `linear-gradient(to bottom, ${gold}88, ${gold}44)`, border: `1px solid ${gold}55`, boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }} />
          {/* Bottom scroll bar */}
          <div style={{ position: 'absolute', bottom: '-8px', left: '-10px', right: '-10px', height: '12px', borderRadius: '6px', 
            background: `linear-gradient(to top, ${gold}88, ${gold}44)`, border: `1px solid ${gold}55`, boxShadow: '0 -2px 4px rgba(0,0,0,0.2)' }} />

          {/* SVG stroke-draw animation overlay */}
          <motion.div initial={{ opacity: 1 }} animate={{ opacity: drawn ? 0 : 1 }} transition={{ duration: 0.5, delay: 1.5 }}
            style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2 }}>
            <svg width="260" height="260" viewBox="0 0 360 360" style={{ position: 'absolute' }}>
              {[
                // Outer square
                `M 0 0 L 360 0`, `M 360 0 L 360 360`, `M 360 360 L 0 360`, `M 0 360 L 0 0`,
                // Diagonals
                `M 0 0 L 360 360`, `M 360 0 L 0 360`,
                // Inner diamond
                `M 180 0 L 360 180`, `M 360 180 L 180 360`, `M 180 360 L 0 180`, `M 0 180 L 180 0`
              ].map((d, i) => (
                <motion.path key={i} d={d} fill="none" stroke={gold} strokeWidth="2" initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 0.6 }} transition={{ duration: 0.5, delay: i * 0.1, ease: 'easeOut' }} />
              ))}
            </svg>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: drawn ? 1 : 0, scale: drawn ? 1 : 0.85 }} transition={{ duration: 0.6, delay: 1.8 }}>
            <KundliChartSVG houses={houses} ascendant={ascendantStr} size={size} />
          </motion.div>
        </div>
      </div>

    </div>
  );
};

const PlanetsPage = ({ result, gold }) => (
  <div style={{ height: '100%', padding: '18px 20px', overflow: 'auto' }}>
    <div style={{ fontSize: '0.58rem', letterSpacing: '0.2em', color: gold, textTransform: 'uppercase', marginBottom: '2px' }}>Chapter X</div>
    <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', color: gold, marginBottom: '1px' }}>Graha Sthiti</h2>
    <div style={{ fontSize: '0.68rem', opacity: 0.5, marginBottom: '4px' }}>Planetary Positions</div>
    <Divider color={gold} />
    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
      {result.planets.map((p, i) => <PlanetPill key={p.name} planet={p} delay={i * 0.07} />)}
    </div>
    <Divider color={gold} />
    <div style={{ fontSize: '0.62rem', opacity: 0.35, textAlign: 'center' }}>℞ = Retrograde · ▶ = Direct · Degree precise to arc-second</div>
  </div>
);

// Vimshottari proportions (years) in the standard order
const VIMSH_ORDER = ['Sun','Moon','Mars','Rahu','Jupiter','Saturn','Mercury','Ketu','Venus'];
const VIMSH_YEARS = { Sun:6, Moon:10, Mars:7, Rahu:18, Jupiter:16, Saturn:19, Mercury:17, Ketu:7, Venus:20 };
const TOTAL_YEARS = 120;

function computeSubPeriods(parentLord, parentStart, parentEnd) {
  // Antar Dasha order starts from the Maha Dasha lord itself
  const startIdx = VIMSH_ORDER.indexOf(parentLord);
  const parentDuration = parentEnd - parentStart; // ms
  const subPeriods = [];
  let cursor = new Date(parentStart);

  for (let i = 0; i < VIMSH_ORDER.length; i++) {
    const lord = VIMSH_ORDER[(startIdx + i) % VIMSH_ORDER.length];
    const fracYears = (VIMSH_YEARS[parentLord] * VIMSH_YEARS[lord]) / TOTAL_YEARS;
    const durationMs = parentDuration * (VIMSH_YEARS[lord] / TOTAL_YEARS) * (VIMSH_YEARS[parentLord] / TOTAL_YEARS) * (TOTAL_YEARS / VIMSH_YEARS[parentLord]);
    // Simpler: proportion of parent period
    const fracOfParent = VIMSH_YEARS[lord] / TOTAL_YEARS;
    const periodMs = parentDuration * fracOfParent;
    const start = new Date(cursor);
    cursor = new Date(cursor.getTime() + periodMs);
    const end = new Date(cursor);
    subPeriods.push({ lord, start, end, years: parseFloat(fracYears.toFixed(2)), color: PLANET_COLORS[lord] || gold });
  }
  return subPeriods;
}

const DashaPage = ({ result, gold }) => {
  const now = new Date();
  const [selectedMaha, setSelectedMaha] = useState(null); // selected Maha Dasha object
  const [selectedAntar, setSelectedAntar] = useState(null); // selected Antar Dasha object

  const currentMaha = result.dashas?.find(d => d.start <= now && d.end >= now);

  // Compute Antar Dashas when a Maha Dasha is selected
  const antarDashas = selectedMaha ? computeSubPeriods(selectedMaha.lord, selectedMaha.start, selectedMaha.end) : [];
  const currentAntar = antarDashas.find(d => d.start <= now && d.end >= now);

  // Compute Pratyantar Dashas when an Antar Dasha is selected
  const pratyantarDashas = selectedAntar ? computeSubPeriods(selectedAntar.lord, selectedAntar.start, selectedAntar.end) : [];
  const currentPratyantar = pratyantarDashas.find(d => d.start <= now && d.end >= now);

  const renderDashaRow = (d, i, isCurrentFn, onClick, isClickable = true) => {
    const isCurr = isCurrentFn(d);
    const pct = isCurr ? Math.min(100, ((now - d.start) / (d.end - d.start)) * 100) : (d.end < now ? 100 : 0);
    const color = d.color || PLANET_COLORS[d.lord] || gold;
    return (
      <motion.div key={`${d.lord}-${i}`}
        initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
        transition={{ delay: i * 0.05 }}
        onClick={isClickable ? () => onClick(d) : undefined}
        style={{
          padding: '6px 10px', borderRadius: '8px',
          border: `1px solid ${isCurr ? color : gold + '22'}`,
          backgroundColor: isCurr ? `${color}14` : 'transparent',
          position: 'relative', overflow: 'hidden',
          cursor: isClickable ? 'pointer' : 'default',
          transition: 'border-color 0.2s, background-color 0.2s',
        }}
        whileHover={isClickable ? { borderColor: `${color}66`, backgroundColor: `${color}0A` } : {}}
      >
        {isCurr && (
          <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 1, delay: 0.5 }}
            style={{ position: 'absolute', bottom: 0, left: 0, height: '2px', backgroundColor: color }} />
        )}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <motion.div
              animate={isCurr ? { boxShadow: [`0 0 4px ${color}`, `0 0 12px ${color}88`, `0 0 4px ${color}`] } : {}}
              transition={{ duration: 1.8, repeat: Infinity }}
              style={{ width: '9px', height: '9px', borderRadius: '50%', backgroundColor: color, flexShrink: 0 }}
            />
            <span style={{ fontFamily: 'var(--font-heading)', fontSize: '0.77rem', color: isCurr ? color : 'inherit', fontWeight: 700 }}>{d.lord}</span>
            {isCurr && (
              <motion.span animate={{ opacity: [1, 0.4, 1] }} transition={{ duration: 1.2, repeat: Infinity }}
                style={{ fontSize: '0.58rem', backgroundColor: color, color: '#000', padding: '1px 6px', borderRadius: '10px', fontWeight: 700 }}>
                NOW
              </motion.span>
            )}
            {isClickable && <span style={{ fontSize: '0.55rem', opacity: 0.4, marginLeft: '4px' }}>▶</span>}
          </div>
          <span style={{ fontSize: '0.62rem', opacity: 0.55 }}>
            {d.start.getFullYear()}–{d.end.getFullYear()} · {typeof d.years === 'number' ? d.years + 'y' : d.years}
          </span>
        </div>
      </motion.div>
    );
  };

  return (
    <div style={{ height: '100%', padding: '18px 20px', overflow: 'auto' }}>
      <div style={{ fontSize: '0.58rem', letterSpacing: '0.2em', color: gold, textTransform: 'uppercase', marginBottom: '2px' }}>Chapter XI</div>
      <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', color: gold, marginBottom: '1px' }}>Vimshottari Dasha</h2>
      <div style={{ fontSize: '0.68rem', opacity: 0.5, marginBottom: '4px' }}>120-Year Planetary Period Cycle</div>
      <Divider color={gold} />

      {/* Breadcrumb Navigation */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', fontSize: '0.68rem', flexWrap: 'wrap' }}>
        <motion.span
          whileHover={{ color: gold }}
          onClick={() => { setSelectedMaha(null); setSelectedAntar(null); }}
          style={{ cursor: 'pointer', opacity: !selectedMaha ? 1 : 0.5, color: gold, fontWeight: 700 }}
        >Maha Dasha</motion.span>
        {selectedMaha && (
          <>
            <span style={{ opacity: 0.4 }}>›</span>
            <motion.span
              whileHover={{ color: gold }}
              onClick={() => setSelectedAntar(null)}
              style={{ cursor: 'pointer', opacity: !selectedAntar ? 1 : 0.5, color: selectedMaha.color || gold, fontWeight: 700 }}
            >{selectedMaha.lord} Antar</motion.span>
          </>
        )}
        {selectedAntar && (
          <>
            <span style={{ opacity: 0.4 }}>›</span>
            <span style={{ color: selectedAntar.color || gold, fontWeight: 700 }}>{selectedAntar.lord} Pratyantar</span>
          </>
        )}
      </div>

      {/* Back Button */}
      {(selectedMaha || selectedAntar) && (
        <motion.button
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          onClick={() => { if (selectedAntar) { setSelectedAntar(null); } else { setSelectedMaha(null); } }}
          style={{
            padding: '4px 12px', borderRadius: '20px', border: `1px solid ${gold}44`,
            backgroundColor: 'transparent', color: gold, fontFamily: 'var(--font-body)',
            fontSize: '0.72rem', cursor: 'pointer', marginBottom: '8px',
          }}
        >
          ← Back
        </motion.button>
      )}

      <div style={{ position: 'relative', paddingLeft: '24px' }}>
        <svg style={{ position: 'absolute', left: '10px', top: 0, bottom: 0, width: '4px', height: '100%' }}>
          <motion.line x1="2" y1="0" x2="2" y2="100%"
            stroke={gold} strokeWidth="2" strokeDasharray="4 3"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
            transition={{ duration: 1.2, ease: 'easeOut' }} />
        </svg>

        <AnimatePresence mode="wait">
          {/* Maha Dasha List */}
          {!selectedMaha && (
            <motion.div key="maha" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              {result.dashas?.map((d, i) =>
                renderDashaRow(d, i, (row) => row === currentMaha, (d) => setSelectedMaha(d), true)
              )}
              <div style={{ fontSize: '0.6rem', opacity: 0.4, textAlign: 'center', marginTop: '8px' }}>
                ▶ Click any period to view Antar Dasha
              </div>
            </motion.div>
          )}

          {/* Antar Dasha List */}
          {selectedMaha && !selectedAntar && (
            <motion.div key="antar" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <div style={{ fontSize: '0.7rem', color: selectedMaha.color || gold, fontWeight: 700, marginBottom: '4px', fontFamily: 'var(--font-heading)' }}>
                {selectedMaha.lord} · Antar Dasha
              </div>
              {antarDashas.map((d, i) =>
                renderDashaRow(d, i, (row) => row === currentAntar, (d) => setSelectedAntar(d), true)
              )}
              <div style={{ fontSize: '0.6rem', opacity: 0.4, textAlign: 'center', marginTop: '8px' }}>
                ▶ Click any period to view Pratyantar Dasha
              </div>
            </motion.div>
          )}

          {/* Pratyantar Dasha List */}
          {selectedAntar && (
            <motion.div key="pratyantar" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <div style={{ fontSize: '0.7rem', color: selectedAntar.color || gold, fontWeight: 700, marginBottom: '4px', fontFamily: 'var(--font-heading)' }}>
                {selectedMaha?.lord} › {selectedAntar.lord} · Pratyantar Dasha
              </div>
              {pratyantarDashas.map((d, i) =>
                renderDashaRow(d, i, (row) => row === currentPratyantar, () => {}, false)
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const DoshasPage = ({ result, gold }) => {
  const PulseRings = ({ color }) => (
    <>
      {[0, 0.4, 0.8].map(delay => (
        <motion.div key={delay}
          animate={{ scale: [1, 1.8], opacity: [0.5, 0] }}
          transition={{ duration: 1.6, delay, repeat: Infinity, ease: 'easeOut' }}
          style={{
            position: 'absolute', inset: 0, borderRadius: '50%',
            border: `2px solid ${color}`,
          }}
        />
      ))}
    </>
  );

  return (
    <div style={{ height: '100%', padding: '18px 22px', overflow: 'auto' }}>
      <div style={{ fontSize: '0.58rem', letterSpacing: '0.2em', color: gold, textTransform: 'uppercase', marginBottom: '2px' }}>Chapter XII</div>
      <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', color: gold, marginBottom: '2px' }}>Dosha Analysis</h2>
      <Divider color={gold} />

      {result.doshas?.mangal && (() => {
        const present = result.doshas.mangal.present;
        const c = present ? '#FF4444' : '#4CAF50';
        return (
          <div style={{ marginBottom: '14px', padding: '12px', borderRadius: '10px', border: `1.5px solid ${c}55`, backgroundColor: `${c}0C` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ position: 'relative', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {present && <PulseRings color={c} />}
                  <span style={{ fontSize: '1rem', position: 'relative', zIndex: 1, color: c }}><IconPlanet size={16} /></span>
                </div>
                <span style={{ fontFamily: 'var(--font-heading)', fontSize: '0.82rem', color: c }}>Mangal Dosha</span>
              </div>
              <span style={{ fontSize: '0.62rem', fontWeight: 700, padding: '2px 8px', borderRadius: '10px', backgroundColor: c, color: '#fff' }}>
                {present ? 'PRESENT' : 'ABSENT'}
              </span>
            </div>
            <p style={{ fontSize: '0.7rem', lineHeight: 1.6, opacity: 0.8 }}>{result.doshas.mangal.description}</p>
          </div>
        );
      })()}

      {result.doshas?.kaalSarp && (() => {
        const present = result.doshas.kaalSarp.present;
        const c = present ? '#FF4444' : '#4CAF50';
        return (
          <div style={{ marginBottom: '14px', padding: '12px', borderRadius: '10px', border: `1.5px solid ${c}55`, backgroundColor: `${c}0C` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ position: 'relative', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {present && <PulseRings color={c} />}
                  <span style={{ fontSize: '1rem', position: 'relative', zIndex: 1, color: c }}><IconGlobe size={16} /></span>
                </div>
                <span style={{ fontFamily: 'var(--font-heading)', fontSize: '0.82rem', color: c }}>Kaal Sarp Dosha</span>
              </div>
              <span style={{ fontSize: '0.62rem', fontWeight: 700, padding: '2px 8px', borderRadius: '10px', backgroundColor: c, color: '#fff' }}>
                {present ? 'PRESENT' : 'ABSENT'}
              </span>
            </div>
            <p style={{ fontSize: '0.7rem', lineHeight: 1.6, opacity: 0.8 }}>{result.doshas.kaalSarp.description}</p>
          </div>
        );
      })()}

      <Divider color={gold} />
      <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        style={{ padding: '10px 14px', backgroundColor: `${gold}10`, borderRadius: '8px', border: `1px solid ${gold}33` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <motion.span animate={{ rotate: [0, 15, 0, -15, 0] }} transition={{ duration: 4, repeat: Infinity }} style={{ color: gold }}>
            <IconLotus size={16} />
          </motion.span>
          <p style={{ fontSize: '0.68rem', fontFamily: 'var(--font-heading)', color: gold }}>Consult Ashay Krishn Goswami</p>
        </div>
        <p style={{ fontSize: '0.66rem', opacity: 0.65, lineHeight: 1.5 }}>For personalized remedies, muhurta, and detailed chart analysis — book a 1-on-1 consultation.</p>
      </motion.div>
    </div>
  );
};

const CertificatePage = ({ result, gold }) => (
  <div style={{ height: '100%', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '30px' }}>
    <div style={{ position: 'relative', zIndex: 1 }}>
      <motion.div animate={{ rotate: [0, 360] }} transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
        style={{ color: gold, marginBottom: '20px', filter: `drop-shadow(0 0 12px ${gold}66)`, display: 'inline-block' }}>
        <IconOm size={56} />
      </motion.div>
      <div style={{ fontSize: '0.65rem', letterSpacing: '0.3em', color: gold, textTransform: 'uppercase', marginBottom: '10px', opacity: 0.7 }}>
        Authentic Vedic Reading
      </div>
      <Divider color={gold} />
      <div style={{ margin: '16px 0', fontSize: '0.75rem', opacity: 0.8, fontStyle: 'italic', lineHeight: 1.6 }}>
        Prepared exclusively for
      </div>
      <motion.h1
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.8 }}
        style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.5rem, 4vw, 2.2rem)', color: gold, marginBottom: '16px', lineHeight: 1.1,
          textShadow: `0 0 20px ${gold}44` }}>
        {result.name}
      </motion.h1>
      <Divider color={gold} />
      <div style={{ marginTop: '20px', fontSize: '0.6rem', opacity: 0.5, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
        May the planets guide you to peace and prosperity
      </div>
    </div>
  </div>
);


// ─── Page Labels ──────────────────────────────────────────────────────────────
const PAGE_LABELS = ['Cover', 'Contents', 'Summary', 'Panchang', 'Lagna', 'Navamsa', 'Chandra', 'Chalit', 'Lagna Gochar', 'Chandra Gochar', 'Planets', 'Dasha', 'Doshas', 'Certificate'];

// ─── Main Book Viewer ─────────────────────────────────────────────────────────
const KundliBookViewer = ({ result }) => {
  const { themeMode } = useTheme();
  const isDark = themeMode === 'dark';
  
  // Responsive 2-page spread state
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 900);
    handleResize(); // init
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const [page, setPage] = useState(0); // On desktop, this will be the Left Page index (always even, or handles cover properly)
  const [direction, setDirection] = useState(1);
  const [warp, setWarp] = useState(false);
  const totalPages = PAGE_LABELS.length;

  const gold = isDark ? '#d4af37' : '#b8860b';
  const pageBg = isDark ? '#150f04' : '#fdf8ed';
  const pageText = isDark ? '#f0e6cc' : '#2d1f0e';
  const spineColor = isDark ? '#1a1204' : '#100a02';

  const goTo = useCallback((targetIndex) => {
    let next = targetIndex;
    if (next < 0) next = 0;
    if (next >= totalPages) next = totalPages - 1;
    
    // On desktop, align 'next' to the left side of the spread (even index)
    if (isDesktop) {
      const isTargetStandalone = next === 0 || next === totalPages - 1;
      if (!isTargetStandalone && next % 2 === 0) {
        next = next - 1;
      }
    }

    if (next === page) return; // already on this spread/page

    setDirection(next > page ? 1 : -1);
    setWarp(true);
    setTimeout(() => setWarp(false), 600);
    setTimeout(() => setPage(next), 150);
  }, [page, totalPages, isDesktop]);

  const variants = {
    enter: (dir) => ({ rotateY: dir > 0 ? 80 : -80, opacity: 0, transformPerspective: 1400 }),
    center: { rotateY: 0, opacity: 1, transformPerspective: 1400, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } },
    exit: (dir) => ({ rotateY: dir > 0 ? -80 : 80, opacity: 0, transformPerspective: 1400, transition: { duration: 0.35, ease: [0.55, 0.06, 0.68, 0.19] } }),
  };

  // Keyboard navigation
  useEffect(() => {
    const handler = (e) => {
      const step = isDesktop && page !== 0 && page !== totalPages - 1 ? 2 : 1;
      if (e.key === 'ArrowRight') goTo(page + step);
      if (e.key === 'ArrowLeft') goTo(page - step);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [goTo, page, isDesktop]);

  const renderPage = (p) => {
    const g = p === 0 || p === PAGE_LABELS.length - 1 ? gold : (isDark ? '#c9a227' : '#8B6914');
    switch (p) {
      case 0: return <CoverPage result={result} gold={g} />;
      case 1: return <ContentsPage gold={g} goTo={goTo} />;
      case 2: return <SummaryPage result={result} gold={g} />;
      case 3: return <PanchangPage result={result} gold={g} />;
      case 4: return <GenericChartPage result={result} gold={g} chapter="Chapter IV" title="Lagna Chart" subtitle="Birth Ascendant (D-1)" houses={result.lagnaChart} ascendantStr={result.ascendant} />;
      case 5: return <GenericChartPage result={result} gold={g} chapter="Chapter V" title="Navamsa Chart" subtitle="Ninth Divisional (D-9)" houses={result.navamsaChart} ascendantStr={result.navamsaAscendant} />;
      case 6: return <GenericChartPage result={result} gold={g} chapter="Chapter VI" title="Chandra Chart" subtitle="Moon Ascendant" houses={result.chandraChart} ascendantStr={result.moonSign} />;
      case 7: return <GenericChartPage result={result} gold={g} chapter="Chapter VII" title="Chalit Chart" subtitle="Sripati Bhava (Cusps)" houses={result.chalitChart} ascendantStr={result.chalitChart?.[0]?.sign} />;
      case 8: return <GenericChartPage result={result} gold={g} chapter="Chapter VIII" title="Lagna Gochar" subtitle="Current Transits from Lagna" houses={result.lagnaGochar} ascendantStr={result.ascendant} />;
      case 9: return <GenericChartPage result={result} gold={g} chapter="Chapter IX" title="Chandra Gochar" subtitle="Current Transits from Moon" houses={result.chandraGochar} ascendantStr={result.moonSign} />;
      case 10: return <PlanetsPage result={result} gold={g} />;
      case 11: return <DashaPage result={result} gold={g} />;
      case 12: return <DoshasPage result={result} gold={g} />;
      case 13: return <CertificatePage result={result} gold={g} />;
      default: return null;
    }
  };

  const PageContent = ({ pageIndex }) => (
    <div style={{ position: 'relative', width: '100%', height: '100%', backgroundColor: pageBg, color: pageText }}>
      {/* Corner Flourish behind page */}
      <CornerFlourish color={gold} />
      
      {/* Page ruled lines */}
      {pageIndex !== 0 && pageIndex !== PAGE_LABELS.length - 1 && Array.from({ length: 26 }).map((_, i) => (
        <div key={i} style={{ position: 'absolute', left: '22px', right: '22px', top: `${28 + i * 18.5}px`, height: '1px', backgroundColor: `${gold}06` }} />
      ))}
      
      {/* Actual Content */}
      <div style={{ position: 'relative', zIndex: 12, height: '100%' }}>
        {renderPage(pageIndex)}
      </div>

      {/* Footer */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '7px 22px', borderTop: `1px solid ${gold}18`, 
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: pageBg, zIndex: 15 }}>
        <span style={{ fontSize: '0.58rem', opacity: 0.35, fontStyle: 'italic' }}>{PAGE_LABELS[pageIndex]}</span>
        <span style={{ fontSize: '0.58rem', opacity: 0.35 }}>{pageIndex + 1} / {totalPages}</span>
      </div>
    </div>
  );

  const isStandalone = isDesktop && (page === 0 || page === totalPages - 1);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '18px' }}>
      {/* Chapter quick-jump */}
      <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', justifyContent: 'center', maxWidth: '800px' }}>
        {PAGE_LABELS.map((label, i) => {
          const isTabActive = isDesktop 
            ? (isStandalone ? i === page : (i === page || i === page + 1))
            : i === page;
          return (
            <motion.button key={i} onClick={() => goTo(i)} whileHover={{ scale: 1.05, y: -2 }}
              style={{ padding: '4px 10px', borderRadius: '16px', fontSize: '0.7rem',
                border: `1px solid ${gold}${isTabActive ? '88' : '28'}`,
                backgroundColor: isTabActive ? `${gold}20` : 'transparent',
                color: isTabActive ? gold : 'inherit', cursor: 'pointer',
                opacity: isTabActive ? 1 : 0.55, transition: 'all 0.2s' }}>
              {label}
            </motion.button>
          );
        })}
      </div>

      {/* Book Container */}
      <div style={{ position: 'relative', width: '100%', maxWidth: isDesktop && !isStandalone ? '900px' : '480px', margin: '0 auto', transition: 'max-width 0.3s ease' }}>
        
        {/* Book shadow */}
        <div style={{ position: 'absolute', bottom: '-10px', left: '4%', right: '4%', height: '18px',
          background: 'radial-gradient(ellipse, rgba(0,0,0,0.4) 0%, transparent 70%)', borderRadius: '50%', zIndex: 0 }} />

        {/* Outer Frame */}
        <div style={{
          position: 'relative',
          borderRadius: '4px 8px 8px 4px', overflow: 'hidden',
          boxShadow: isDark ? '4px 4px 30px rgba(0,0,0,0.8), inset -1px 0 4px rgba(0,0,0,0.4)' : '4px 4px 20px rgba(0,0,0,0.2)',
          background: pageBg,
          border: `1px solid ${gold}33`
        }}>
          
          {/* Warp overlay over the whole book during transitions */}
          <WarpCanvas active={warp} />

          {/* Spine Graphic (Left Edge of whole book) */}
          <div style={{
            position: 'absolute', left: 0, top: 0, bottom: 0, width: '22px',
            background: `linear-gradient(to right, ${spineColor}, ${isDark ? '#2a1a06' : '#1e1203'})`,
            boxShadow: 'inset -3px 0 8px rgba(0,0,0,0.4)',
            zIndex: 30, display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ writingMode: 'vertical-rl', textOrientation: 'mixed', fontSize: '0.5rem',
              color: gold, letterSpacing: '0.15em', opacity: 0.65, fontFamily: 'var(--font-heading)',
              transform: 'rotate(180deg)' }}>VEDIC KUNDALI</span>
          </div>

          <div style={{ display: 'flex', height: '510px', position: 'relative', marginLeft: '22px' }}>
            
            {/* Left Page (or Single Page on Mobile) */}
            <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
              <AnimatePresence initial={false} custom={direction} mode="wait">
                <motion.div key={page} custom={direction} variants={variants} initial="enter" animate="center" exit="exit"
                  style={{ position: 'absolute', inset: 0, originX: direction > 0 ? 0 : 1 }}>
                  <PageContent pageIndex={page} />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Desktop Center Spine Divide */}
            {isDesktop && !isStandalone && (
              <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: '30px', transform: 'translateX(-50%)',
                background: `linear-gradient(to right, 
                  rgba(0,0,0,0.02) 0%, 
                  rgba(0,0,0,0.08) 40%, 
                  rgba(0,0,0,0.15) 50%, 
                  rgba(0,0,0,0.08) 60%, 
                  rgba(0,0,0,0.02) 100%)`, zIndex: 40, pointerEvents: 'none' }} />
            )}

            {/* Right Page (Desktop Only) */}
            {isDesktop && !isStandalone && (
              <div style={{ flex: 1, position: 'relative', overflow: 'hidden', borderLeft: `1px solid ${gold}11` }}>
                {page + 1 < totalPages ? (
                  <AnimatePresence initial={false} custom={direction} mode="wait">
                    <motion.div key={page + 1} custom={direction} variants={variants} initial="enter" animate="center" exit="exit"
                      style={{ position: 'absolute', inset: 0, originX: direction > 0 ? 0 : 1 }}>
                      <PageContent pageIndex={page + 1} />
                    </motion.div>
                  </AnimatePresence>
                ) : (
                  <div style={{ width: '100%', height: '100%', backgroundColor: pageBg }}>
                    {/* Blank page placeholder for right side if odd total pages */}
                  </div>
                )}
              </div>
            )}

            {/* Book edge sheen */}
            <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '15px',
              background: 'linear-gradient(to right, transparent, rgba(0,0,0,0.08))', pointerEvents: 'none', zIndex: 40 }} />
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <motion.button onClick={() => goTo(page - (isDesktop && !isStandalone ? 2 : 1))} disabled={page === 0}
          whileHover={page > 0 ? { scale: 1.12, boxShadow: `0 0 12px ${gold}44` } : {}} whileTap={page > 0 ? { scale: 0.95 } : {}}
          style={{ width: '42px', height: '42px', borderRadius: '50%', border: `1.5px solid ${gold}66`,
            backgroundColor: 'transparent', color: gold, fontSize: '1.3rem', cursor: page > 0 ? 'pointer' : 'not-allowed',
            opacity: page === 0 ? 0.25 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}>‹</motion.button>

        <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
          {(() => {
            const stops = [];
            if (isDesktop) {
              stops.push(0);
              for (let j = 1; j < totalPages - 1; j += 2) stops.push(j);
              stops.push(totalPages - 1);
            }
            const dotCount = isDesktop ? stops.length : totalPages;
            return Array.from({ length: dotCount }).map((_, i) => {
              const targetPage = isDesktop ? stops[i] : i;
              const isActive = page === targetPage;
              return (
                <motion.button key={i} onClick={() => goTo(targetPage)} whileHover={{ scale: 1.4 }}
                  style={{ width: isActive ? '22px' : '7px', height: '7px', borderRadius: '4px', border: 'none',
                    cursor: 'pointer', backgroundColor: isActive ? gold : `${gold}44`, transition: 'all 0.3s ease', padding: 0 }} />
              );
            });
          })()}
        </div>

        <motion.button onClick={() => goTo(page + (isDesktop && !isStandalone ? 2 : 1))} disabled={page >= totalPages - 1}
          whileHover={page < totalPages - 1 ? { scale: 1.12, boxShadow: `0 0 12px ${gold}44` } : {}} whileTap={page < totalPages - 1 ? { scale: 0.95 } : {}}
          style={{ width: '42px', height: '42px', borderRadius: '50%', border: `1.5px solid ${gold}66`,
            backgroundColor: 'transparent', color: gold, fontSize: '1.3rem', cursor: page < totalPages - 1 ? 'pointer' : 'not-allowed',
            opacity: page >= totalPages - 1 ? 0.25 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}>›</motion.button>
      </div>



      <p style={{ fontSize: '0.68rem', opacity: 0.35, textAlign: 'center' }}>
        Use ← → arrow keys to navigate · Click chapter tabs above
      </p>
    </div>
  );
};

export default KundliBookViewer;
