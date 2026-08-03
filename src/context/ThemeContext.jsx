import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [themeMode, setThemeMode] = useState('light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', themeMode);
  }, [themeMode]);

  // Original light↔dark toggle (used by the Navbar button)
  const toggleTheme = () => {
    setThemeMode(prev => prev === 'light' ? 'dark' : 'light');
  };

  // ── Color maps ── one per theme; mirrors the CSS variables exactly ──
  const lightColors = {
    primary: '#FF9933',   secondary: '#7c572d',
    tertiary: '#006685',  surface: '#FFFFF0',
    text: '#231A13',      outline: '#887364',
  };

  const darkColors = {
    primary: '#d4af37',   secondary: '#a0a0a0',
    tertiary: '#d4af37',  surface: '#0a0a0a',
    text: '#ffffff',      outline: '#d4af37',
  };

  // Palette A — Indigo & Gold
  const paletteAColors = {
    primary: '#1E2749',   secondary: '#C9A227',
    tertiary: '#8B4513',  surface: '#FAF6EE',
    text: '#1A1612',      outline: '#A08020',
  };

  // Palette B — Terracotta & Sage
  const paletteBColors = {
    primary: '#C15B3E',   secondary: '#2B2622',
    tertiary: '#5C6B4E',  surface: '#F3E9DC',
    text: '#1C1410',      outline: '#9B7B5A',
  };

  // Palette C — Maroon & Brass
  const paletteCColors = {
    primary: '#6E1F2A',   secondary: '#B08D57',
    tertiary: '#006685',  surface: '#FCF8F2',
    text: '#1A1010',      outline: '#9A7A45',
  };

  const getColors = (mode) => {
    switch (mode) {
      case 'palette-a': return paletteAColors;
      case 'palette-b': return paletteBColors;
      case 'palette-c': return paletteCColors;
      case 'dark':      return darkColors;
      default:          return lightColors;
    }
  };

  const themeValues = {
    colors: getColors(themeMode),
    fonts: {
      display: "'Libre Caslon Text', serif",
      body: "'Inter', sans-serif",
    },
  };

  return (
    <ThemeContext.Provider value={{ ...themeValues, themeMode, setThemeMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
