import { useState, useEffect } from 'react';
import { Menu, X, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

interface NavbarProps {
  theme?: string;
  toggleTheme?: () => void;
  SunIcon?: any;
  MoonIcon?: any;
}

export function Navbar({ theme, toggleTheme, SunIcon, MoonIcon }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`} style={{ 
      transition: 'all 0.3s ease',
      background: isScrolled ? 'var(--bg-darker)' : 'transparent',
      boxShadow: isScrolled ? '0 4px 30px rgba(0, 0, 0, 0.1)' : 'none',
      borderBottom: isScrolled ? '1px solid var(--border-gold)' : 'none'
    }}>
      <div className="container flex-between">
        <Link to="/" className="logo flex-center" style={{ gap: '0.5rem', fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontWeight: 600 }}>
          <Star className="text-gradient" />
          <span className="text-gradient">MannJyotish</span>
        </Link>

        <div className="nav-links">
          <a href="#services" className="nav-link">Services</a>
          <a href="#kundli" className="nav-link">Kundli Features</a>
          <a href="#astrology" className="nav-link">Daily Astrology</a>
          <a href="#about" className="nav-link">About</a>
        </div>

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          {toggleTheme && SunIcon && MoonIcon && (
            <button 
              onClick={toggleTheme} 
              style={{ 
                background: 'transparent', 
                border: '1px solid var(--border-gold)', 
                color: 'var(--text-primary)',
                padding: '0.5rem',
                borderRadius: '50%',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              title="Toggle Light/Dark Theme"
            >
              {theme === 'dark' ? <SunIcon size={20} /> : <MoonIcon size={20} />}
            </button>
          )}
          <a href="#book" className="btn btn-primary" style={{ display: 'none' }}>Book Consultation</a>
          <button 
            className="mobile-menu-btn" 
            style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', display: 'none' }}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>
      
      {/* Mobile Menu logic would go here if we expand it */}
    </nav>
  );
}
