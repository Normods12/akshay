import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [themeMode, setThemeMode] = useState('light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', themeMode);
  }, [themeMode]);

  const toggleTheme = () => {
    setThemeMode(prev => prev === 'light' ? 'dark' : 'light');
  };

  const lightColors = {
    primary: '#FF9933',
    surface: '#FFFFF0',
    text: '#231A13',
    outline: '#887364',
  };

  const darkColors = {
    primary: '#d4af37',
    surface: '#0a0a0a',
    text: '#ffffff',
    outline: '#d4af37',
  };

  const themeValues = {
    colors: themeMode === 'light' ? lightColors : darkColors,
    fonts: {
      display: "'Libre Caslon Text', serif",
      body: "'Inter', sans-serif",
    }
  };

  return (
    <ThemeContext.Provider value={{ ...themeValues, themeMode, toggleTheme }}>
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
