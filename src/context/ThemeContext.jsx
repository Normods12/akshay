import React, { createContext, useContext, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // Dark theme is permanently locked — no toggle, no palettes
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'dark');
  }, []);

  const darkColors = {
    primary: '#d4af37',   secondary: '#a0a0a0',
    tertiary: '#d4af37',  surface: '#0a0a0a',
    text: '#ffffff',      outline: '#d4af37',
  };

  const themeValues = {
    colors: darkColors,
    themeMode: 'dark',
    fonts: {
      display: "'Libre Caslon Text', serif",
      body: "'Inter', sans-serif",
    },
    // Stub out toggleTheme / setThemeMode so nothing breaks if called
    toggleTheme: () => {},
    setThemeMode: () => {},
  };

  return (
    <ThemeContext.Provider value={themeValues}>
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
