import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, MessageCircle, CheckCircle2 } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function FirstQuestionModal({ isOpen, onClose }) {
  const theme = useTheme();

  if (!isOpen) return null;

  const handleWhatsAppRedirect = () => {
    const phoneNumber = "917000742315";
    const message = "Namaste Acharya Ashay ji! I would like to ask my first astrological question under the ₹99 introductory offer.";
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
    onClose();
  };

  return (
    <AnimatePresence>
      <div style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(8px)',
      }}>
        {/* Modal Backdrop Click */}
        <div 
          onClick={onClose} 
          style={{ position: 'absolute', inset: 0 }} 
        />

        {/* Modal Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.88, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.88, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: '460px',
            background: 'linear-gradient(145deg, #13131a 0%, #0a0a0f 100%)',
            border: '1px solid rgba(212, 175, 55, 0.4)',
            borderRadius: '24px',
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8), 0 0 40px rgba(212, 175, 55, 0.15)',
            overflow: 'hidden',
            padding: '28px 24px 24px',
            textAlign: 'center',
            color: '#fff',
            zIndex: 1,
          }}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            aria-label="Close popup"
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              background: 'rgba(255, 255, 255, 0.08)',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'rgba(255, 255, 255, 0.7)',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.18)'; }}
            onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.7)'; e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)'; }}
          >
            <X size={18} />
          </button>

          {/* Golden Aura Glow Top Center */}
          <div style={{
            position: 'absolute',
            top: '-50px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '180px',
            height: '180px',
            background: 'radial-gradient(circle, rgba(212,175,55,0.3) 0%, transparent 70%)',
            borderRadius: '50%',
            pointerEvents: 'none',
          }} />

          {/* Astrologer Avatar with Golden Ring */}
          <div style={{ position: 'relative', display: 'inline-block', marginBottom: '16px' }}>
            <div style={{
              width: '94px',
              height: '94px',
              borderRadius: '50%',
              padding: '3px',
              background: 'linear-gradient(135deg, #d4af37, #ffd700, #b8860b)',
              boxShadow: '0 8px 24px rgba(212,175,55,0.35)',
              margin: '0 auto',
            }}>
              <img
                src="/profile.png"
                alt="Acharya Shri Hit Ashay Krishn Goswami"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  borderRadius: '50%',
                }}
              />
            </div>
            <div style={{
              position: 'absolute',
              bottom: '2px',
              right: '4px',
              background: '#00E676',
              color: '#000',
              borderRadius: '50%',
              width: '20px',
              height: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid #13131a',
            }}>
              <CheckCircle2 size={12} color="#000" strokeWidth={3} />
            </div>
          </div>

          {/* Badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 14px',
            borderRadius: '20px',
            backgroundColor: 'rgba(212, 175, 55, 0.15)',
            border: '1px solid rgba(212, 175, 55, 0.35)',
            color: '#d4af37',
            fontSize: '0.75rem',
            fontFamily: 'var(--font-heading)',
            fontWeight: 700,
            letterSpacing: '0.05em',
            marginBottom: '10px',
          }}>
            <Sparkles size={13} />
            <span>EXCLUSIVE WELCOME BLESSING</span>
          </div>

          {/* Title */}
          <h3 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(1.2rem, 3.5vw, 1.45rem)',
            color: '#fff',
            marginBottom: '8px',
            lineHeight: 1.25,
          }}>
            Ask Your First Question to <br />
            <span style={{ color: '#d4af37' }}>Acharya Ashay Ji</span>
          </h3>

          <p style={{
            fontSize: '0.85rem',
            color: 'rgba(255, 255, 255, 0.7)',
            lineHeight: 1.5,
            marginBottom: '16px',
            fontFamily: 'var(--font-body)',
          }}>
            Have an urgent question regarding Career, Love, Marriage timing, or Kundli Dosha? Get genuine, authentic Vedic clarity directly on WhatsApp.
          </p>

          {/* Price Offer Card */}
          <div style={{
            background: 'rgba(212, 175, 55, 0.08)',
            border: '1px dashed rgba(212, 175, 55, 0.35)',
            borderRadius: '14px',
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '20px',
          }}>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                First Consultation Offer
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                <span style={{ fontSize: '1.75rem', fontWeight: 800, color: '#d4af37', fontFamily: 'var(--font-heading)' }}>
                  ₹99
                </span>
                <span style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.4)', textDecoration: 'line-through' }}>
                  ₹501
                </span>
              </div>
            </div>
            <div style={{
              background: 'linear-gradient(135deg, rgba(37,211,102,0.2), rgba(37,211,102,0.05))',
              border: '1px solid rgba(37,211,102,0.4)',
              color: '#25D366',
              padding: '4px 10px',
              borderRadius: '12px',
              fontSize: '0.72rem',
              fontWeight: 700,
            }}>
              ⚡ 80% OFF
            </div>
          </div>

          {/* Action CTA Button */}
          <motion.button
            whileHover={{ scale: 1.03, boxShadow: '0 8px 30px rgba(37, 211, 102, 0.4)' }}
            whileTap={{ scale: 0.97 }}
            onClick={handleWhatsAppRedirect}
            style={{
              width: '100%',
              padding: '13px 20px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
              border: 'none',
              color: '#fff',
              fontFamily: 'var(--font-heading)',
              fontWeight: 700,
              fontSize: '0.98rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              boxShadow: '0 6px 20px rgba(37, 211, 102, 0.3)',
              marginBottom: '10px',
            }}
          >
            <MessageCircle size={20} />
            <span>Ask on WhatsApp for ₹99</span>
          </motion.button>

          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'rgba(255, 255, 255, 0.45)',
              fontSize: '0.78rem',
              cursor: 'pointer',
              textDecoration: 'underline',
              padding: '4px',
            }}
            onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.7)'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.45)'}
          >
            Maybe later
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
