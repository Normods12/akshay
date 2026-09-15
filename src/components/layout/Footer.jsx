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
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '24px', marginBottom: '20px', fontSize: '0.95rem' }}>
        <span>📞 Contact: <a href="tel:+919243818146" style={{ color: theme.colors.primary, textDecoration: 'none', fontWeight: 600 }}>+91 92438 18146</a></span>
        <span>💬 WhatsApp: <a href="https://wa.me/917000742315" target="_blank" rel="noopener noreferrer" style={{ color: '#25D366', textDecoration: 'none', fontWeight: 600 }}>+91 70007 42315</a></span>
        <span>📸 Instagram: <a href="https://www.instagram.com/goswami_ashay" target="_blank" rel="noopener noreferrer" style={{ color: theme.colors.primary, textDecoration: 'none', fontWeight: 600 }}>@goswami_ashay</a></span>
      </div>
      <p style={{ opacity: 0.6, fontSize: '0.875rem' }}>
        © {new Date().getFullYear()} Mannjyotish · Acharya Shri Hit Ashay Krishn Goswami. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
