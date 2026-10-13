import React from 'react';
import { Award, CheckCircle, ShieldCheck } from 'lucide-react';

export default function CourseCertificate({ courseTitle = 'Advanced Chart Reading' }) {
  return (
    <div style={{
      width: '100%',
      maxWidth: '780px',
      margin: '0 auto',
      position: 'relative',
      // Authentic ivory-white parchment background with subtle texture
      backgroundColor: '#fbf9f4',
      backgroundImage: `
        radial-gradient(ellipse at 50% 50%, rgba(255, 255, 255, 0.95) 0%, rgba(246, 240, 227, 0.85) 100%),
        repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(184, 134, 11, 0.02) 3px, rgba(184, 134, 11, 0.02) 6px)
      `,
      border: '10px double #b8860b',
      borderRadius: '12px',
      padding: 'clamp(28px, 5.5vw, 48px)',
      boxShadow: '0 25px 70px rgba(0, 0, 0, 0.55), 0 4px 20px rgba(184, 134, 11, 0.25), inset 0 0 60px rgba(212, 175, 55, 0.08)',
      color: '#2a241e',
      textAlign: 'center',
      overflow: 'hidden',
    }}>
      {/* Delicate Inner Security Border */}
      <div style={{
        position: 'absolute',
        inset: '10px',
        border: '1.5px solid rgba(184, 134, 11, 0.55)',
        borderRadius: '6px',
        pointerEvents: 'none',
      }} />

      {/* Second Inner Micro-Dotted Border */}
      <div style={{
        position: 'absolute',
        inset: '16px',
        border: '1px dashed rgba(184, 134, 11, 0.35)',
        borderRadius: '4px',
        pointerEvents: 'none',
      }} />

      {/* Watermarked Center Sacred Emblem */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        fontSize: '220px',
        color: 'rgba(184, 134, 11, 0.045)',
        pointerEvents: 'none',
        userSelect: 'none',
        lineHeight: 1,
        fontFamily: 'serif',
      }}>
        🕉
      </div>

      {/* Decorative Golden Corner Flourishes */}
      {['top-left', 'top-right', 'bottom-left', 'bottom-right'].map(pos => (
        <div key={pos} style={{
          position: 'absolute',
          width: '28px',
          height: '28px',
          borderColor: '#b8860b',
          borderStyle: 'solid',
          borderWidth: pos.includes('top') ? '3.5px 0 0 0' : '0 0 3.5px 0',
          borderLeftWidth: pos.includes('left') ? '3.5px' : '0',
          borderRightWidth: pos.includes('right') ? '3.5px' : '0',
          top: pos.includes('top') ? '18px' : 'auto',
          bottom: pos.includes('bottom') ? '18px' : 'auto',
          left: pos.includes('left') ? '18px' : 'auto',
          right: pos.includes('right') ? '18px' : 'auto',
          pointerEvents: 'none',
        }} />
      ))}

      {/* Academy Header */}
      <div style={{ marginBottom: '16px', position: 'relative', zIndex: 1 }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          color: '#8b6508',
          fontFamily: 'var(--font-heading)',
          fontSize: '0.86rem',
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          fontWeight: 800,
          marginBottom: '6px'
        }}>
          <span>✦</span> MANNJYOTISH ACADEMY OF VEDIC SCIENCES <span>✦</span>
        </div>
        <div style={{
          fontSize: '0.74rem',
          color: '#6e6356',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          fontWeight: 600,
        }}>
          Rooted in Radhavallabh Tradition · Vrindavan Dham
        </div>
      </div>

      {/* Main Title */}
      <div style={{ position: 'relative', zIndex: 1, margin: '14px 0 6px' }}>
        <h2 style={{
          fontFamily: 'var(--font-heading)',
          fontSize: 'clamp(1.7rem, 4vw, 2.4rem)',
          color: '#1f1b16',
          letterSpacing: '0.04em',
          margin: 0,
          textTransform: 'uppercase',
          fontWeight: 800,
          textShadow: '0 1px 1px rgba(0,0,0,0.1)',
        }}>
          Certificate of Completion
        </h2>
        <div style={{
          width: '120px',
          height: '2px',
          background: 'linear-gradient(90deg, transparent, #b8860b, transparent)',
          margin: '8px auto 0',
        }} />
      </div>

      <p style={{
        fontFamily: 'var(--font-body)',
        fontSize: '0.85rem',
        color: '#685e54',
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        margin: '16px 0 14px',
        fontWeight: 600,
        position: 'relative',
        zIndex: 1,
      }}>
        This is to officially certify that
      </p>

      {/* Recipient Line */}
      <div style={{
        margin: '10px auto 20px',
        maxWidth: '440px',
        borderBottom: '2px solid #b8860b',
        paddingBottom: '8px',
        position: 'relative',
        zIndex: 1,
      }}>
        <span style={{
          fontFamily: 'serif',
          fontSize: 'clamp(1.4rem, 3.2vw, 1.85rem)',
          color: '#1a1714',
          fontWeight: 700,
          fontStyle: 'italic',
          letterSpacing: '0.02em',
        }}>
          [Enrolled Scholar Name]
        </span>
      </div>

      {/* Course Declaration */}
      <p style={{
        maxWidth: '580px',
        margin: '0 auto 22px',
        fontSize: '0.92rem',
        color: '#423c34',
        lineHeight: 1.65,
        fontFamily: 'var(--font-body)',
        position: 'relative',
        zIndex: 1,
      }}>
        has successfully completed the comprehensive curriculum, scriptural studies, and practical chart interpretation in
      </p>

      {/* Course Plaque */}
      <div style={{
        display: 'inline-block',
        padding: '10px 28px',
        borderRadius: '30px',
        backgroundColor: 'rgba(212, 175, 55, 0.12)',
        border: '1.5px solid #b8860b',
        fontFamily: 'var(--font-heading)',
        fontSize: '1.2rem',
        color: '#7a5400',
        fontWeight: 800,
        marginBottom: '36px',
        boxShadow: '0 2px 10px rgba(184, 134, 11, 0.15)',
        letterSpacing: '0.03em',
        position: 'relative',
        zIndex: 1,
      }}>
        {courseTitle}
      </div>

      {/* Stamp / Gold Seal & Signatures Footer */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '24px',
        borderTop: '1px solid rgba(184, 134, 11, 0.35)',
        paddingTop: '24px',
        position: 'relative',
        zIndex: 1,
      }}>
        {/* Verification Code */}
        <div style={{ textAlign: 'left' }}>
          <div style={{ fontSize: '0.68rem', color: '#7a7065', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
            Verification Code
          </div>
          <div style={{ fontFamily: 'monospace', fontSize: '0.88rem', color: '#7a5400', fontWeight: 700, marginTop: '2px' }}>
            MJ-VRN-{new Date().getFullYear()}-CERT
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px', fontSize: '0.72rem', color: '#15803d', fontWeight: 700 }}>
            <CheckCircle size={13} />
            <span>Authenticated</span>
          </div>
        </div>

        {/* Embossed Physical Gold Seal */}
        <div style={{
          position: 'relative',
          width: '92px',
          height: '92px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, #ffe066 0%, #d4af37 55%, #946910 100%)',
          boxShadow: '0 6px 18px rgba(184, 134, 11, 0.4), inset 0 0 10px rgba(255,255,255,0.6), inset 0 0 6px rgba(0,0,0,0.35)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#382200',
          border: '2px dashed #6b4300',
          transform: 'rotate(-6deg)',
        }}>
          <ShieldCheck size={24} color="#3d2600" strokeWidth={2.4} />
          <span style={{ fontSize: '0.58rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#331f00', marginTop: '2px' }}>
            OFFICIAL
          </span>
          <span style={{ fontSize: '0.52rem', fontWeight: 800, color: '#331f00', letterSpacing: '0.05em' }}>
            SEAL
          </span>
        </div>

        {/* Signature Section */}
        <div style={{ textAlign: 'right' }}>
          <div style={{
            fontFamily: 'serif',
            fontSize: '1.35rem',
            fontStyle: 'italic',
            color: '#1a233a', // Real fountain-pen dark blue ink tone
            marginBottom: '4px',
            fontWeight: 700,
          }}>
            Ashay Krishn Goswami
          </div>
          <div style={{ width: '170px', height: '1.5px', backgroundColor: '#b8860b', marginLeft: 'auto', marginBottom: '4px' }} />
          <div style={{ fontSize: '0.74rem', color: '#1a1714', fontWeight: 700 }}>
            Acharya Shri Hit Ashay Krishn Goswami
          </div>
          <div style={{ fontSize: '0.68rem', color: '#685e54', fontWeight: 500 }}>
            Founder & Head Acharya, MannJyotish
          </div>
        </div>
      </div>
    </div>
  );
}
