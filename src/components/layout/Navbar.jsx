import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { ChevronDown, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import UserAvatar from '../auth/UserAvatar';
import LoginModal from '../auth/LoginModal';

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
              boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
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
                  color: current === item.id ? theme.colors.primary : 'var(--color-on-surface)',
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
                  e.target.style.color = current === item.id ? theme.colors.primary : 'var(--color-on-surface)';
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

const Navbar = ({ currentPage, setCurrentPage }) => {
  const theme = useTheme();
  const { isLoggedIn, isAdmin } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  const handleHomeScroll = (id) => {
    if (currentPage !== 'home') {
      setCurrentPage('home');
      setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 300);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileOpen(false);
  };

  const navLinks = [
    { label: 'Home', action: () => { setCurrentPage('home'); setMobileOpen(false); } },
    { label: 'Horoscopes', action: () => handleHomeScroll('rashi-section') },
    { label: 'Online Puja', action: () => { setCurrentPage('puja'); setMobileOpen(false); } },
    { label: 'Courses', action: () => { setCurrentPage('courses'); setMobileOpen(false); } },
    { label: 'Shop', action: () => { setCurrentPage('shop'); setMobileOpen(false); } },
    { label: 'Consultation', action: () => handleHomeScroll('booking-form') },
  ];

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
      <a
        href="/"
        className="logo"
        onClick={(e) => {
          e.preventDefault();
          setCurrentPage('home');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      >
        <span className="logo-icon">
          <svg 
            width="24" 
            height="24" 
            viewBox="0 0 100 100" 
            fill="currentColor"
            style={{ display: 'block' }}
          >
            <text 
              x="50" 
              y="72" 
              fontSize="75" 
              textAnchor="middle" 
              fill="currentColor" 
              fontFamily="system-ui, -apple-system, 'Devanagari Sangam MN', 'Noto Sans Devanagari', 'Arial Unicode MS', sans-serif"
              fontWeight="bold"
            >
              🕉
            </text>
          </svg>
        </span>

        <span className="logo-text">MANNJYOTISH</span>
      </a>



      {/* Desktop Nav */}
      <ul style={{ 
        display: 'flex', 
        gap: '24px', 
        listStyle: 'none', 
        fontFamily: 'var(--font-heading)', 
        fontWeight: '600', 
        alignItems: 'center', 
        margin: 0,
        fontSize: '0.95rem'
      }} className="navbar-desktop">
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
          <a href="#" onClick={(e) => { e.preventDefault(); handleHomeScroll('rashi-section'); }} style={{ color: 'inherit', transition: 'color 0.3s ease', textDecoration: 'none' }}>Horoscopes</a>
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
        {isAdmin && (
          <motion.li whileHover={{ y: -2 }}>
            <a href="#" onClick={(e) => { e.preventDefault(); setCurrentPage('admin'); }} style={{ color: currentPage === 'admin' ? theme.colors.primary : '#d4af37', transition: 'color 0.3s ease', textDecoration: 'none', fontWeight: 800 }}>⚙ Admin</a>
          </motion.li>
        )}
      </ul>

      {/* Auth: UserAvatar or Login Button */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {isLoggedIn ? (
          <UserAvatar setCurrentPage={setCurrentPage} />
        ) : (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowLogin(true)}
            style={{
              padding: '8px 20px', borderRadius: '20px',
              background: 'linear-gradient(135deg, #d4af37, #b8860b)',
              border: 'none', color: '#000',
              fontFamily: 'var(--font-heading)', fontWeight: 700,
              fontSize: '0.85rem', cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(212,175,55,0.25)',
            }}
          >
            Sign In
          </motion.button>
        )}

        {/* Mobile Hamburger */}
        <button 
          className="navbar-mobile-toggle"
          onClick={() => setMobileOpen(!mobileOpen)}
          style={{
            background: 'none', border: 'none', color: theme.colors.primary,
            cursor: 'pointer', display: 'none', padding: '4px'
          }}
        >
        {mobileOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{
              position: 'absolute', top: '100%', left: 0, right: 0,
              backgroundColor: 'var(--color-surface)',
              borderBottom: `1px solid ${theme.colors.outline}33`,
              boxShadow: '0 10px 30px rgba(0,0,0,0.4)',
              zIndex: 999, overflow: 'hidden',
            }}
            className="navbar-mobile-menu"
          >
            {navLinks.map((link, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={link.action}
                style={{
                  padding: '16px 24px',
                  cursor: 'pointer',
                  color: 'var(--color-on-surface)',
                  fontFamily: 'var(--font-heading)',
                  fontWeight: '600',
                  fontSize: '1rem',
                  borderBottom: `1px solid ${theme.colors.outline}22`,
                  transition: 'background 0.2s, color 0.2s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = `${theme.colors.primary}15`; e.currentTarget.style.color = theme.colors.primary; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--color-on-surface)'; }}
              >
                {link.label}
              </motion.div>
            ))}
            {/* Reports Dropdown inline on mobile */}
            {['Free Kundli', 'Matchmaking', 'Moon Sign Calculator'].map((label, i) => (
              <motion.div
                key={`report-${i}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: (navLinks.length + i) * 0.05 }}
                onClick={() => { 
                  setCurrentPage(['free-kundli', 'matchmaking', 'moon-sign'][i]); 
                  setMobileOpen(false); 
                }}
                style={{
                  padding: '14px 40px',
                  cursor: 'pointer',
                  color: theme.colors.primary,
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.9rem',
                  borderBottom: `1px solid ${theme.colors.outline}11`,
                  transition: 'background 0.2s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = `${theme.colors.primary}10`; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
              >
                ↳ {label}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      </div>

      {/* Login Modal */}
      {showLogin && (
        <LoginModal onClose={() => setShowLogin(false)} />
      )}
    </motion.nav>
  );
};

export default Navbar;
