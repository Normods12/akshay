import React from 'react';
import { useTheme } from '../../context/ThemeContext';

const Navbar = () => {
  const theme = useTheme();

  return (
    <nav style={{
      padding: '20px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottom: `1px solid ${theme.colors.outline}33`,
    }}>
      <h1 style={{ fontSize: '1.5rem', color: theme.colors.primary }}>Mannjyotish</h1>
      <ul style={{ display: 'flex', gap: '20px', listStyle: 'none' }}>
        <li><a href="#hero">Home</a></li>
        <li><a href="#about">About</a></li>
        <li><a href="#courses">Courses</a></li>
      </ul>
    </nav>
  );
};

export default Navbar;
