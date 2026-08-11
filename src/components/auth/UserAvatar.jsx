import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

export default function UserAvatar({ setCurrentPage }) {
  const { user, logout, isAdmin } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  if (!user) return null;

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(!open)}
        style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          background: 'none', border: '2px solid rgba(212,175,55,0.4)',
          borderRadius: '40px', padding: '4px 12px 4px 4px',
          cursor: 'pointer', transition: 'border-color 0.2s',
        }}
        onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(212,175,55,0.8)'}
        onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(212,175,55,0.4)'}
      >
        <img
          src={user.picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=d4af37&color=000`}
          alt={user.name}
          style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }}
        />
        <span style={{
          fontFamily: 'var(--font-heading)', fontSize: '0.85rem',
          color: '#d4af37', fontWeight: 600, maxWidth: '100px',
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {user.name?.split(' ')[0]}
        </span>
        {isAdmin && (
          <span style={{
            background: 'linear-gradient(135deg,#d4af37,#b8860b)',
            color: '#000', fontSize: '0.6rem', fontWeight: 800,
            padding: '2px 6px', borderRadius: '10px', letterSpacing: '0.05em',
          }}>
            ADMIN
          </span>
        )}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            style={{
              position: 'absolute', top: 'calc(100% + 8px)', right: 0,
              background: 'linear-gradient(145deg, #111, #1a1a1a)',
              border: '1px solid rgba(212,175,55,0.25)',
              borderRadius: '14px', padding: '8px 0', minWidth: '200px',
              boxShadow: '0 20px 50px rgba(0,0,0,0.6)', zIndex: 9999,
            }}
          >
            {/* User info */}
            <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(212,175,55,0.12)' }}>
              <div style={{ fontSize: '0.85rem', color: '#fff', fontWeight: 600, fontFamily: 'var(--font-heading)' }}>
                {user.name}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', marginTop: '2px' }}>
                {user.email}
              </div>
            </div>

            {/* Menu items */}
            {isAdmin && (
              <MenuItem
                icon="⚙️"
                label="Admin Panel"
                onClick={() => { setCurrentPage('admin'); setOpen(false); }}
              />
            )}
            <MenuItem
              icon="🚪"
              label="Sign Out"
              onClick={() => { logout(); setOpen(false); }}
              danger
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MenuItem({ icon, label, onClick, danger }) {
  return (
    <div
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: '10px',
        padding: '10px 16px', cursor: 'pointer',
        color: danger ? '#ff6b6b' : 'rgba(255,255,255,0.8)',
        fontSize: '0.88rem', fontFamily: 'var(--font-body)',
        transition: 'background 0.15s, color 0.15s',
      }}
      onMouseEnter={e => { e.currentTarget.style.background = danger ? 'rgba(255,107,107,0.08)' : 'rgba(212,175,55,0.08)'; }}
      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
    >
      <span>{icon}</span>
      <span>{label}</span>
    </div>
  );
}
