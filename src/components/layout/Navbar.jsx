import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Moon, Sun, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const DropdownMenu = ({ title, items, current, setCurrentPage }) => {
  const [isOpen, setIsOpen] = useState(false);
  const theme = useTheme();

  return (
    <div 
      style={{ position: 'relative' }}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '4px', 
        cursor: 'pointer',
        color: items.some(i => i.id === current) ? theme.colors.primary : 'inherit',
        padding: '10px 0'
      }}>
        {title} <ChevronDown size={16} />
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'absolute',
              top: '100%',
              left: '50%',
              transform: 'translateX(-50%)',
              backgroundColor: 'var(--color-surface)',
              border: `1px solid ${theme.colors.outline}33`,
              borderRadius: '12px',
              padding: '12px 0',
              minWidth: '200px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
              zIndex: 100
            }}
          >
            {items.map((item, idx) => (
              <div 
                key={idx}
                onClick={() => setCurrentPage(item.id)}
                style={{
                  padding: '10px 24px',
                  cursor: 'pointer',
                  color: current === item.id ? theme.colors.primary : 'var(--color-text)',
                  fontSize: '0.95rem',
                  transition: 'background 0.2s',
                  backgroundColor: 'transparent'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = `${theme.colors.primary}15`;
                  e.target.style.color = theme.colors.primary;
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.color = current === item.id ? theme.colors.primary : 'var(--color-text)';
                }}
              >
                {item.label}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Navbar = ({ currentPage, setCurrentPage, themeMode, toggleTheme }) => {
  const theme = useTheme();

  const handleHomeScroll = (id) => {
    if (currentPage !== 'home') {
      setCurrentPage('home');
      setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 100);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="glass-panel"
      style={{
        padding: '15px 40px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        borderBottom: `1px solid ${theme.colors.outline}33`
      }}>
      <motion.h1 
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        style={{ fontSize: '1.5rem', color: theme.colors.primary, cursor: 'pointer', fontFamily: 'var(--font-heading)' }}
        onClick={() => setCurrentPage('home')}
      >
        Mannjyotish
      </motion.h1>
      <ul style={{ 
        display: 'flex', 
        gap: '24px', 
        listStyle: 'none', 
        fontFamily: 'var(--font-heading)', 
        fontWeight: '600', 
        alignItems: 'center', 
        margin: 0,
        fontSize: '0.95rem'
      }}>
        <motion.li whileHover={{ y: -2 }}>
          <a href="#" onClick={(e) => { e.preventDefault(); setCurrentPage('home'); }} style={{ color: currentPage === 'home' ? theme.colors.primary : 'inherit', transition: 'color 0.3s ease', textDecoration: 'none' }}>Home</a>
        </motion.li>
        
        <motion.li whileHover={{ y: -2 }}>
          <DropdownMenu 
            title="Reports" 
            current={currentPage} 
            setCurrentPage={setCurrentPage}
            items={[
              { label: 'Free Kundli', id: 'free-kundli' },
              { label: 'Matchmaking', id: 'matchmaking' },
              { label: 'Moon Sign Calculator', id: 'moon-sign' }
            ]}
          />
        </motion.li>

        <motion.li whileHover={{ y: -2 }}>
          <a href="#" onClick={(e) => { e.preventDefault(); setCurrentPage('horoscope'); }} style={{ color: currentPage === 'horoscope' ? theme.colors.primary : 'inherit', transition: 'color 0.3s ease', textDecoration: 'none' }}>Horoscopes</a>
        </motion.li>

        <motion.li whileHover={{ y: -2 }}>
          <a href="#" onClick={(e) => { e.preventDefault(); setCurrentPage('puja'); }} style={{ color: currentPage === 'puja' ? theme.colors.primary : 'inherit', transition: 'color 0.3s ease', textDecoration: 'none' }}>Online Puja</a>
        </motion.li>

        <motion.li whileHover={{ y: -2 }}>
          <a href="#" onClick={(e) => { e.preventDefault(); setCurrentPage('courses'); }} style={{ color: currentPage === 'courses' ? theme.colors.primary : 'inherit', transition: 'color 0.3s ease', textDecoration: 'none' }}>Courses</a>
        </motion.li>

        <motion.li whileHover={{ y: -2 }}>
          <a href="#" onClick={(e) => { e.preventDefault(); setCurrentPage('shop'); }} style={{ color: currentPage === 'shop' ? theme.colors.primary : 'inherit', transition: 'color 0.3s ease', textDecoration: 'none' }}>Shop</a>
        </motion.li>

        <motion.li whileHover={{ y: -2 }}>
          <a href="#" onClick={(e) => { e.preventDefault(); handleHomeScroll('booking-form'); }} style={{ color: 'inherit', transition: 'color 0.3s ease', textDecoration: 'none' }}>Consultation</a>
        </motion.li>

        <motion.li whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <div 
            onClick={toggleTheme}
            style={{
              width: '56px',
              height: '28px',
              backgroundColor: themeMode === 'dark' ? theme.colors.primary : '#ccc',
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              padding: '0 4px',
              cursor: 'pointer',
              position: 'relative',
              transition: 'background-color 0.3s'
            }}
          >
            <motion.div
              style={{
                width: '20px',
                height: '20px',
                backgroundColor: '#fff',
                borderRadius: '50%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
              }}
              animate={{
                x: themeMode === 'dark' ? 28 : 0,
              }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            >
              {themeMode === 'dark' ? (
                <Moon size={12} color={theme.colors.primary} />
              ) : (
                <Sun size={12} color="#f28c38" />
              )}
            </motion.div>
          </div>
        </motion.li>
      </ul>
    </motion.nav>
  );
};

export default Navbar;
