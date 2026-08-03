/**
 * DEV ONLY — PaletteSwitcher
 * Floating bottom-right panel for live palette comparison.
 * To remove: delete this file and its two lines in App.jsx.
 */
import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';

const PALETTES = [
  {
    id: 'light',
    label: 'Current (Saffron)',
    swatch: '#FF9933',
    surface: '#FFFFF0',
    desc: 'Original cream + saffron',
  },
  {
    id: 'palette-a',
    label: 'A · Indigo & Gold',
    swatch: '#1E2749',
    surface: '#FAF6EE',
    desc: 'Deep navy + antique gold',
  },
  {
    id: 'palette-b',
    label: 'B · Terracotta & Sage',
    swatch: '#C15B3E',
    surface: '#F3E9DC',
    desc: 'Warm clay + sage green',
  },
  {
    id: 'palette-c',
    label: 'C · Maroon & Brass',
    swatch: '#6E1F2A',
    surface: '#FCF8F2',
    desc: 'Deep maroon + brass/bronze',
  },
];

const PaletteSwitcher = () => {
  const { themeMode, setThemeMode } = useTheme();
  const [open, setOpen] = useState(false);

  const active = PALETTES.find(p => p.id === themeMode) || PALETTES[0];

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 99999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: '10px',
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* ── Expanded panel ── */}
      {open && (
        <div
          style={{
            background: 'rgba(255,255,255,0.97)',
            border: '1px solid rgba(0,0,0,0.10)',
            borderRadius: '18px',
            padding: '16px',
            boxShadow: '0 12px 40px rgba(0,0,0,0.18)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            minWidth: '232px',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
          }}
        >
          {/* Header */}
          <p style={{
            fontSize: '0.66rem', fontWeight: 800, letterSpacing: '0.12em',
            textTransform: 'uppercase', color: '#888', margin: '0 0 10px 4px',
          }}>
            🧪 Dev · Color Palette
          </p>

          {PALETTES.map((p) => {
            const isActive = themeMode === p.id;
            return (
              <button
                key={p.id}
                onClick={() => setThemeMode(p.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '9px 12px',
                  borderRadius: '10px',
                  border: isActive
                    ? `2px solid ${p.swatch}`
                    : '2px solid transparent',
                  background: isActive
                    ? `${p.swatch}14`
                    : 'transparent',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.18s ease',
                  width: '100%',
                }}
              >
                {/* Swatch circle */}
                <div style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: `linear-gradient(135deg, ${p.swatch} 55%, ${p.surface} 100%)`,
                  flexShrink: 0,
                  boxShadow: isActive
                    ? `0 0 0 2px #fff, 0 0 0 4px ${p.swatch}`
                    : '0 1px 4px rgba(0,0,0,0.15)',
                  transition: 'box-shadow 0.18s ease',
                }} />

                {/* Labels */}
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontSize: '0.78rem',
                    fontWeight: isActive ? 700 : 500,
                    color: isActive ? p.swatch : '#222',
                    lineHeight: 1.2,
                  }}>
                    {p.label}
                  </div>
                  <div style={{
                    fontSize: '0.68rem',
                    color: '#999',
                    marginTop: '2px',
                    lineHeight: 1.2,
                  }}>
                    {p.desc}
                  </div>
                </div>

                {/* Active dot */}
                {isActive && (
                  <div style={{
                    width: '8px', height: '8px', borderRadius: '50%',
                    backgroundColor: p.swatch, flexShrink: 0,
                  }} />
                )}
              </button>
            );
          })}

          {/* Commit hint */}
          <p style={{
            fontSize: '0.63rem', color: '#aaa', margin: '10px 4px 0',
            lineHeight: 1.4, borderTop: '1px solid #eee', paddingTop: '10px',
          }}>
            Active: <strong style={{ color: active.swatch }}>{active.label}</strong>
            <br />Pick one → ask me to make it the permanent default.
          </p>
        </div>
      )}

      {/* ── Toggle button ── */}
      <button
        onClick={() => setOpen(o => !o)}
        title="Dev: Switch Color Palette"
        style={{
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.97)',
          border: `2px solid ${active.swatch}66`,
          boxShadow: `0 4px 18px rgba(0,0,0,0.14), 0 0 0 3px ${active.swatch}22`,
          cursor: 'pointer',
          fontSize: '1.4rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          transform: open ? 'rotate(15deg) scale(1.08)' : 'none',
        }}
      >
        🎨
      </button>
    </div>
  );
};

export default PaletteSwitcher;
