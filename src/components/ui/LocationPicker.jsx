import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { searchLocations } from '../../utils/kundliCalculator';

// ─── Debounce Hook ────────────────────────────────────────────────────────────
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

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
  }, [debouncedQuery, selected]);

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
          placeholder="Type city name, e.g. Mumbai..."
          required={required}
          style={{
            padding: '13px 40px 13px 16px', borderRadius: '10px',
            border: `1.5px solid ${focused ? colors.primary : (selected ? colors.primary + '88' : colors.outline + '55')}`,
            backgroundColor: 'transparent', color: colors.text,
            fontFamily: 'var(--font-body)', fontSize: '1rem',
            outline: 'none', width: '100%', boxSizing: 'border-box',
            transition: 'border-color 0.3s'
          }}
        />
        {/* Loading / Success icons */}
        <div style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', display: 'flex', alignItems: 'center' }}>
          {loading && <div style={{ width: '16px', height: '16px', borderRadius: '50%', border: `2px solid ${colors.outline}`, borderTopColor: colors.primary, animation: 'spin 1s linear infinite' }} />}
          {!loading && selected && <span style={{ color: colors.primary, fontSize: '1.2rem' }}>✓</span>}
        </div>
      </div>

      {isOpen && results.length > 0 && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, right: 0, marginTop: '8px', zIndex: 50,
          backgroundColor: isDark ? '#1A1A1A' : '#FFFFFF',
          border: `1px solid ${colors.outline}33`, borderRadius: '12px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.15)', maxHeight: '240px', overflowY: 'auto'
        }}>
          {results.map((loc, i) => (
            <div
              key={i}
              onClick={() => handleSelect(loc)}
              style={{
                padding: '12px 16px', cursor: 'pointer', borderBottom: i < results.length - 1 ? `1px solid ${colors.outline}22` : 'none',
                transition: 'background-color 0.2s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = isDark ? '#2A2A2A' : '#F5F5F5'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <div style={{ fontSize: '0.95rem', fontWeight: 600, color: colors.text, marginBottom: '2px' }}>{loc.shortName}</div>
              <div style={{ fontSize: '0.8rem', color: colors.text, opacity: 0.6, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{loc.displayName}</div>
            </div>
          ))}
        </div>
      )}
      <style>{`@keyframes spin { 0% { transform: translateY(-50%) rotate(0deg); } 100% { transform: translateY(-50%) rotate(360deg); } }`}</style>
    </div>
  );
};

export default LocationPicker;
