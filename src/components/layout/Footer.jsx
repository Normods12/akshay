import React from 'react';
import { useTheme } from '../../context/ThemeContext';

const Footer = () => {
  const theme = useTheme();

  return (
    <footer style={{
      padding: '48px 20px',
      textAlign: 'center',
      borderTop: `1px solid ${theme.colors.outline}33`,
      marginTop: 'auto',
    }}>
      <p style={{ opacity: 0.6, fontSize: '0.875rem' }}>
        © {new Date().getFullYear()} Mannjyotish. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
