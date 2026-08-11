import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

export default function LoginModal({ onClose, message }) {
  const { loginWithGoogle } = useAuth();

  // Close on ESC & disable body scroll
  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKey);
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = originalStyle;
    };
  }, [onClose]);

  const modalContent = (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, zIndex: 99999,
          backgroundColor: 'rgba(0,0,0,0.85)',
          backdropFilter: 'blur(10px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '16px',
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.88, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', damping: 22, stiffness: 320 }}
          onClick={(e) => e.stopPropagation()}
          style={{
            background: 'linear-gradient(145deg, #0f0f0f 0%, #1a1a1a 50%, #0d0d0d 100%)',
            border: '1px solid rgba(212,175,55,0.35)',
            borderRadius: '24px',
            padding: '36px 32px',
            maxWidth: '400px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            textAlign: 'center',
            boxShadow: '0 40px 80px rgba(0,0,0,0.9), 0 0 60px rgba(212,175,55,0.1)',
            position: 'relative',
            boxSizing: 'border-box',
          }}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            style={{
              position: 'absolute', top: '14px', right: '14px',
              background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
              color: 'rgba(255,255,255,0.5)', width: '32px', height: '32px',
              borderRadius: '50%', fontSize: '1.2rem', cursor: 'pointer', lineHeight: 1,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.background = 'rgba(255,255,255,0.15)'; }}
            onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}
          >
            ×
          </button>

          {/* Om symbol */}
          <div style={{
            width: '64px', height: '64px', borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(212,175,55,0.2), rgba(212,175,55,0.05))',
            border: '1px solid rgba(212,175,55,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 20px',
            fontSize: '2rem',
            boxShadow: '0 0 30px rgba(212,175,55,0.15)',
          }}>
            🕉️
          </div>

          <h2 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '1.5rem',
            color: '#ffffff',
            marginBottom: '10px',
            background: 'linear-gradient(135deg, #d4af37, #f5d76e)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            Sign In to Continue
          </h2>

          <p style={{
            color: 'rgba(255,255,255,0.6)',
            fontSize: '0.9rem',
            lineHeight: 1.5,
            marginBottom: '28px',
            fontFamily: 'var(--font-body)',
          }}>
            {message || 'Please sign in to access your personalized Vedic horoscope and spiritual insights.'}
          </p>

          {/* Google Sign In Button */}
          <motion.button
            whileHover={{ scale: 1.03, boxShadow: '0 8px 30px rgba(212,175,55,0.3)' }}
            whileTap={{ scale: 0.97 }}
            onClick={loginWithGoogle}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              gap: '12px', width: '100%',
              padding: '13px 20px', borderRadius: '14px',
              background: 'linear-gradient(135deg, #d4af37, #b8860b)',
              border: 'none', cursor: 'pointer',
              color: '#000', fontFamily: 'var(--font-heading)',
              fontWeight: 700, fontSize: '0.95rem',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 20px rgba(212,175,55,0.2)',
            }}
          >
            <GoogleIcon />
            Continue with Google
          </motion.button>

          <p style={{
            marginTop: '18px', color: 'rgba(255,255,255,0.35)',
            fontSize: '0.75rem', fontFamily: 'var(--font-body)',
          }}>
            Free to join • Secure • No spam
          </p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );

  return ReactDOM.createPortal(modalContent, document.body);
}
