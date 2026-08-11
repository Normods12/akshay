import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import LoginModal from '../components/auth/LoginModal';
import MandalaArt from '../components/ui/MandalaArt';

const API_BASE = import.meta.env.VITE_API_BASE || '';

export default function Gallery({ setCurrentPage }) {
  const { isLoggedIn } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) {
      setShowLogin(true);
      setLoading(false);
      return;
    }
    fetch(`${API_BASE}/api/gallery`)
      .then(r => r.json())
      .then(d => { setPosts(d.data || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [isLoggedIn]);

  if (!isLoggedIn) {
    return (
      <div style={{
        minHeight: 'calc(100vh - 80px)', display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        background: '#0a0a0a', flexDirection: 'column', gap: '24px',
      }}>
        <div style={{ fontSize: '4rem' }}>🔒</div>
        <h2 style={{ fontFamily: 'var(--font-heading)', color: '#d4af37', fontSize: '2rem' }}>
          Sign In to View Gallery
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-body)' }}>
          This gallery is exclusive to registered members.
        </p>
        {showLogin && <LoginModal onClose={() => { setShowLogin(false); setCurrentPage('home'); }} message="Sign in to access the sacred gallery." />}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ minHeight: 'calc(100vh - 80px)', backgroundColor: '#080808' }}
    >
      {/* Hero Banner */}
      <div style={{
        position: 'relative',
        padding: 'clamp(48px, 8vw, 100px) 20px 60px',
        textAlign: 'center', overflow: 'hidden',
        borderBottom: '1px solid rgba(212,175,55,0.15)',
      }}>
        <MandalaArt variant={1} size={600} opacity={0.08}
          style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 0 }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            style={{
              display: 'inline-block', padding: '8px 20px', borderRadius: '30px',
              background: 'rgba(212,175,55,0.12)', border: '1px solid rgba(212,175,55,0.3)',
              color: '#d4af37', fontWeight: 600, fontFamily: 'var(--font-body)',
              marginBottom: '20px', fontSize: '0.9rem',
            }}
          >
            ✦ Sacred Gallery
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            style={{
              fontFamily: 'var(--font-heading)', fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              color: '#ffffff', marginBottom: '16px',
              background: 'linear-gradient(135deg, #d4af37, #f5d76e, #d4af37)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}
          >
            Cosmic Wisdom Gallery
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
            style={{ color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-body)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}
          >
            Explore sacred imagery, astrological insights, and spiritual wisdom curated by Ashay Krishn Goswami.
          </motion.p>
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="container" style={{ padding: '60px 20px 80px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.4)', padding: '80px 0' }}>
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🌌</div>
            <p style={{ fontFamily: 'var(--font-body)' }}>Loading sacred gallery...</p>
          </div>
        ) : posts.length === 0 ? (
          <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.4)', padding: '80px 0' }}>
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🌙</div>
            <h3 style={{ fontFamily: 'var(--font-heading)', color: '#d4af37', marginBottom: '8px' }}>
              Gallery Coming Soon
            </h3>
            <p style={{ fontFamily: 'var(--font-body)' }}>
              Sacred content will be added here by Ashay ji. Check back soon.
            </p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '28px',
          }}>
            {posts.map((post, i) => (
              <GalleryCard key={post.id} post={post} index={i} />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

function GalleryCard({ post, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: (index % 4) * 0.1, duration: 0.5 }}
      whileHover={{ y: -6, boxShadow: '0 24px 60px rgba(212,175,55,0.15)' }}
      style={{
        borderRadius: '20px', overflow: 'hidden',
        background: 'linear-gradient(145deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))',
        border: '1px solid rgba(212,175,55,0.18)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
        transition: 'all 0.3s ease',
      }}
    >
      {post.image ? (
        <div style={{ height: '220px', overflow: 'hidden', position: 'relative' }}>
          <img
            src={post.image.startsWith('/uploads') ? `${API_BASE}${post.image}` : post.image}
            alt={post.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
            onError={(e) => {
              if (post.image && post.image.startsWith('/uploads') && !e.target.dataset.triedRelative) {
                e.target.dataset.triedRelative = 'true';
                e.target.src = post.image;
              }
            }}
            onMouseEnter={e => e.target.style.transform = 'scale(1.07)'}
            onMouseLeave={e => e.target.style.transform = 'scale(1)'}
          />
          {/* Gradient overlay */}
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            height: '60px',
            background: 'linear-gradient(to top, rgba(10,10,10,0.8), transparent)',
          }} />
        </div>
      ) : (
        <div style={{
          height: '220px', display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'linear-gradient(135deg, rgba(212,175,55,0.08), rgba(100,50,150,0.08))',
          fontSize: '4rem',
        }}>
          🕉️
        </div>
      )}
      <div style={{ padding: '20px 22px 24px' }}>
        <h3 style={{
          fontFamily: 'var(--font-heading)', color: '#d4af37',
          fontSize: '1.15rem', marginBottom: '8px', lineHeight: 1.3,
        }}>
          {post.title}
        </h3>
        {post.description && (
          <p style={{
            color: 'rgba(255,255,255,0.55)', fontSize: '0.875rem',
            lineHeight: 1.6, fontFamily: 'var(--font-body)', marginBottom: '12px',
          }}>
            {post.description}
          </p>
        )}
        <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.25)', fontFamily: 'var(--font-body)' }}>
          {new Date(post.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
        </div>
      </div>
    </motion.div>
  );
}
