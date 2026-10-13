import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, 
  MessageCircle, 
  Send, 
  Bookmark, 
  MoreHorizontal, 
  Grid, 
  Square, 
  Volume2, 
  VolumeX, 
  Play, 
  Check, 
  ExternalLink,
  Share2
} from 'lucide-react';
import MandalaArt from '../components/ui/MandalaArt';

const API_BASE = import.meta.env.VITE_API_BASE || '';

export default function Gallery({ setCurrentPage }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('feed'); // 'feed' | 'grid'
  const [selectedGridPost, setSelectedGridPost] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE}/api/gallery`)
      .then(r => r.json())
      .then(d => {
        setPosts(d.data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#000000', color: '#ffffff', paddingBottom: '80px', position: 'relative' }}>
      {/* Background Mandala Accents */}
      <MandalaArt
        variant={0}
        size={550}
        opacity={0.04}
        style={{ position: 'fixed', top: '15%', right: '-120px', zIndex: 0, pointerEvents: 'none' }}
      />
      <MandalaArt
        variant={1}
        size={500}
        opacity={0.035}
        style={{ position: 'fixed', bottom: '10%', left: '-120px', zIndex: 0, pointerEvents: 'none' }}
      />

      <div style={{ maxWidth: '935px', margin: '0 auto', padding: 'clamp(20px, 4vw, 40px) 16px', position: 'relative', zIndex: 1 }}>
        
        {/* ─── INSTAGRAM PROFILE HEADER ─── */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
          paddingBottom: '32px',
          marginBottom: '24px',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'clamp(20px, 5vw, 48px)',
            flexWrap: 'wrap',
          }}>
            {/* Story Gradient Ring Avatar */}
            <div style={{
              position: 'relative',
              width: 'clamp(84px, 14vw, 136px)',
              height: 'clamp(84px, 14vw, 136px)',
              borderRadius: '50%',
              padding: '3px',
              background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}>
              <div style={{
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                backgroundColor: '#000',
                padding: '3px',
                overflow: 'hidden',
              }}>
                <img
                  src="/profile.png"
                  alt="Acharya Shri Hit Ashay Krishn Goswami"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
                  onError={(e) => { e.target.src = '/icons/sun.png'; }}
                />
              </div>
            </div>

            {/* Profile Info & Action Buttons */}
            <div style={{ flex: 1, minWidth: '240px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap', marginBottom: '16px' }}>
                <h1 style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'clamp(1.2rem, 3vw, 1.55rem)',
                  fontWeight: 600,
                  margin: 0,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  color: '#fff',
                }}>
                  goswami_ashay
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    backgroundColor: '#0095f6',
                    color: '#fff',
                    fontSize: '11px',
                    fontWeight: 900,
                  }}>
                    ✓
                  </span>
                </h1>

                {/* Follow Button */}
                <a
                  href="https://www.instagram.com/goswami_ashay"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    backgroundColor: '#0095f6',
                    color: '#fff',
                    borderRadius: '8px',
                    padding: '7px 20px',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    textDecoration: 'none',
                    fontFamily: 'var(--font-body)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'background-color 0.2s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = '#1877f2'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = '#0095f6'}
                >
                  Follow
                </a>

                {/* Message / WhatsApp Button */}
                <a
                  href="https://wa.me/917000742315"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.12)',
                    color: '#fff',
                    borderRadius: '8px',
                    padding: '7px 16px',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    textDecoration: 'none',
                    fontFamily: 'var(--font-body)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.12)'}
                >
                  Message
                </a>
              </div>

              {/* Stats Counters */}
              <div style={{ display: 'flex', gap: '28px', fontSize: '0.95rem', marginBottom: '16px', fontFamily: 'var(--font-body)' }}>
                <span><strong>{posts.length || 4}</strong> posts</span>
                <span><strong>48.6K</strong> followers</span>
                <span><strong>108</strong> following</span>
              </div>

              {/* Name & Bio */}
              <div style={{ fontSize: '0.88rem', lineHeight: 1.5, fontFamily: 'var(--font-body)', color: '#efefef' }}>
                <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.95rem' }}>
                  Acharya Shri Hit Ashay Krishn Goswami
                </div>
                <div style={{ color: '#d4af37', fontWeight: 600 }}>
                  ✦ Radhavallabh Tradition · Vrindavan Dham
                </div>
                <div>🌸 Vedic Astrology | Kundli Analysis | Vastu & Remedial Pujas</div>
                <div>📜 Founder & Head Acharya: Mannjyotish Academy of Vedic Sciences</div>
                <div style={{ marginTop: '4px' }}>
                  <a
                    href="https://wa.me/917000742315"
                    target="_blank"
                    rel="noreferrer"
                    style={{ color: '#0095f6', textDecoration: 'none', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                  >
                    📞 +91 70007 42315 · Book Consultations ✦
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* ─── STORY HIGHLIGHTS BAR ─── */}
          <div style={{
            display: 'flex',
            gap: '20px',
            overflowX: 'auto',
            paddingTop: '12px',
            scrollbarWidth: 'none',
          }}>
            {[
              { label: 'Darshan', icon: '🪔' },
              { label: 'Vrindavan', icon: '🌸' },
              { label: 'Pujas', icon: '📿' },
              { label: 'Astrology', icon: '🪐' },
              { label: 'Courses', icon: '📜' },
              { label: 'Remedies', icon: '💎' },
              { label: 'Reviews', icon: '✨' },
            ].map((story, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', minWidth: '66px', cursor: 'pointer' }}>
                <div style={{
                  width: '62px',
                  height: '62px',
                  borderRadius: '50%',
                  padding: '2px',
                  border: '1.5px solid rgba(212,175,55,0.5)',
                  backgroundColor: '#161616',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.6rem',
                }}>
                  {story.icon}
                </div>
                <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.7)', fontFamily: 'var(--font-body)' }}>
                  {story.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ─── TABS (FEED VS GRID) ─── */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '40px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          marginBottom: '28px',
        }}>
          <button
            onClick={() => setActiveTab('feed')}
            style={{
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'feed' ? '2px solid #fff' : '2px solid transparent',
              color: activeTab === 'feed' ? '#fff' : 'rgba(255, 255, 255, 0.45)',
              padding: '12px 16px',
              fontSize: '0.85rem',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Square size={16} />
            <span>Feed View</span>
          </button>

          <button
            onClick={() => setActiveTab('grid')}
            style={{
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'grid' ? '2px solid #fff' : '2px solid transparent',
              color: activeTab === 'grid' ? '#fff' : 'rgba(255, 255, 255, 0.45)',
              padding: '12px 16px',
              fontSize: '0.85rem',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Grid size={16} />
            <span>Grid View</span>
          </button>
        </div>

        {/* ─── POSTS CONTENT ─── */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: 'rgba(255,255,255,0.4)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '14px' }}>🌌</div>
            <p style={{ fontFamily: 'var(--font-body)' }}>Loading sacred Instagram feed...</p>
          </div>
        ) : posts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: 'rgba(255,255,255,0.4)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '14px' }}>🌙</div>
            <h3 style={{ fontFamily: 'var(--font-heading)', color: '#d4af37' }}>No Posts Yet</h3>
            <p style={{ fontFamily: 'var(--font-body)' }}>Posts added in the Admin Panel will appear here automatically.</p>
          </div>
        ) : activeTab === 'feed' ? (
          /* FEED VIEW (Scrollable Instagram Feed) */
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '32px' }}>
            {posts.map((post, index) => (
              <InstagramPostCard key={post.id || index} post={post} index={index} />
            ))}
          </div>
        ) : (
          /* GRID VIEW (3x3 Instagram Profile Grid) */
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 'clamp(4px, 1.5vw, 16px)',
          }}>
            {posts.map((post, index) => (
              <InstagramGridItem
                key={post.id || index}
                post={post}
                onClick={() => {
                  setSelectedGridPost(post);
                  setActiveTab('feed');
                  // smooth scroll
                  window.scrollTo({ top: 350, behavior: 'smooth' });
                }}
              />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

// ─── INSTAGRAM POST CARD (FEED VIEW) ──────────────────────────────────────────
function InstagramPostCard({ post }) {
  const [likesCount, setLikesCount] = useState(post.likes || 1240);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showHeartBurst, setShowHeartBurst] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState([
    { user: 'priya_sharma', text: 'Jai Shri Radhavallabh Lal! 🌸 Very powerful insight.' },
    { user: 'rahul_astro', text: 'Har Har Mahadev! Seeking blessings from Acharya ji 🙏' }
  ]);
  const [isExpanded, setIsExpanded] = useState(false);
  const videoRef = useRef(null);

  const isVideo = post.mediaType === 'video' || post.image?.endsWith('.mp4') || post.mediaUrl?.endsWith('.mp4');
  const src = post.mediaUrl || post.image;
  const fullSrc = src?.startsWith('/uploads') ? `${API_BASE}${src}` : src;

  const handleLikeToggle = () => {
    if (isLiked) {
      setIsLiked(false);
      setLikesCount(prev => prev - 1);
    } else {
      setIsLiked(true);
      setLikesCount(prev => prev + 1);
      setShowHeartBurst(true);
      setTimeout(() => setShowHeartBurst(false), 900);
    }
  };

  const handleDoubleTap = () => {
    if (!isLiked) {
      setIsLiked(true);
      setLikesCount(prev => prev + 1);
    }
    setShowHeartBurst(true);
    setTimeout(() => setShowHeartBurst(false), 900);
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setComments(prev => [...prev, { user: 'guest_seeker', text: commentText.trim() }]);
    setCommentText('');
  };

  const handleShare = () => {
    const shareText = `Check out this sacred post by Acharya Shri Hit Ashay Krishn Goswami on MannJyotish: ${post.title || ''}`;
    if (navigator.share) {
      navigator.share({ title: post.title, text: shareText, url: window.location.href }).catch(() => {});
    } else {
      navigator.clipboard.writeText(`${shareText} — ${window.location.href}`);
      alert('Post link copied to clipboard!');
    }
  };

  return (
    <div style={{
      width: '100%',
      maxWidth: '470px',
      backgroundColor: '#000',
      border: '1px solid rgba(255, 255, 255, 0.15)',
      borderRadius: '12px',
      overflow: 'hidden',
      boxShadow: '0 4px 24px rgba(0,0,0,0.6)',
    }}>
      {/* 1. Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 14px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            padding: '2px',
            background: 'linear-gradient(45deg, #f09433, #dc2743, #bc1888)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <img
              src="/profile.png"
              alt="goswami_ashay"
              style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
              onError={(e) => { e.target.src = '/icons/sun.png'; }}
            />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600, fontSize: '0.88rem' }}>
              <span>goswami_ashay</span>
              <span style={{ color: '#0095f6', fontSize: '11px' }}>✓</span>
            </div>
            <div style={{ fontSize: '0.74rem', color: 'rgba(255,255,255,0.6)' }}>
              {post.location || 'Radhavallabh Temple · Vrindavan Dham'}
            </div>
          </div>
        </div>

        <button
          onClick={handleShare}
          style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: '4px' }}
          title="Share"
        >
          <MoreHorizontal size={20} />
        </button>
      </div>

      {/* 2. Media Area (Image or Video) */}
      <div 
        onDoubleClick={handleDoubleTap}
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '1 / 1',
          backgroundColor: '#0a0a0a',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          userSelect: 'none',
        }}
      >
        {isVideo ? (
          <>
            <video
              ref={videoRef}
              src={fullSrc}
              muted={isMuted}
              loop
              autoPlay
              playsInline
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            {/* Sound Toggle Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsMuted(prev => !prev);
              }}
              style={{
                position: 'absolute',
                bottom: '14px',
                right: '14px',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: 'rgba(0,0,0,0.7)',
                color: '#fff',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                zIndex: 2,
              }}
            >
              {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>
          </>
        ) : fullSrc ? (
          <img
            src={fullSrc}
            alt={post.title || 'Sacred Gallery'}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <div style={{ fontSize: '4rem' }}>🕉️</div>
        )}

        {/* Double-Tap Heart Burst Animation */}
        <AnimatePresence>
          {showHeartBurst && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1.2, opacity: 0.95 }}
              exit={{ scale: 1.5, opacity: 0 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                color: '#ff3040',
                pointerEvents: 'none',
                zIndex: 10,
                filter: 'drop-shadow(0 4px 15px rgba(0,0,0,0.8))',
              }}
            >
              <Heart size={100} fill="#ff3040" strokeWidth={0} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 3. Action Buttons */}
      <div style={{ padding: '12px 14px 6px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button
              onClick={handleLikeToggle}
              style={{ background: 'none', border: 'none', color: isLiked ? '#ff3040' : '#fff', cursor: 'pointer', padding: 0 }}
            >
              <Heart size={24} fill={isLiked ? '#ff3040' : 'none'} strokeWidth={isLiked ? 0 : 2} />
            </button>

            <button
              onClick={() => {
                const input = document.getElementById(`comment-input-${post.id}`);
                if (input) input.focus();
              }}
              style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: 0 }}
            >
              <MessageCircle size={24} />
            </button>

            <button
              onClick={handleShare}
              style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: 0 }}
            >
              <Send size={22} />
            </button>
          </div>

          <button
            onClick={() => setIsSaved(prev => !prev)}
            style={{ background: 'none', border: 'none', color: isSaved ? '#ffd700' : '#fff', cursor: 'pointer', padding: 0 }}
          >
            <Bookmark size={24} fill={isSaved ? '#ffd700' : 'none'} strokeWidth={isSaved ? 0 : 2} />
          </button>
        </div>

        {/* 4. Likes Count */}
        <div style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '6px', fontFamily: 'var(--font-body)' }}>
          {likesCount.toLocaleString('en-IN')} likes
        </div>

        {/* 5. Caption */}
        <div style={{ fontSize: '0.88rem', lineHeight: 1.5, fontFamily: 'var(--font-body)', marginBottom: '8px' }}>
          <span style={{ fontWeight: 700, marginRight: '6px' }}>goswami_ashay</span>
          {post.title && <strong style={{ color: '#d4af37', marginRight: '6px' }}>{post.title}</strong>}
          
          <span>
            {isExpanded || !post.description || post.description.length <= 110
              ? post.description
              : `${post.description.slice(0, 110)}... `}
          </span>

          {post.description && post.description.length > 110 && (
            <button
              onClick={() => setIsExpanded(prev => !prev)}
              style={{
                background: 'none',
                border: 'none',
                color: 'rgba(255,255,255,0.45)',
                fontSize: '0.82rem',
                cursor: 'pointer',
                padding: 0,
                marginLeft: '4px',
              }}
            >
              {isExpanded ? 'less' : 'more'}
            </button>
          )}
        </div>

        {/* 6. Comments Preview */}
        {comments.length > 0 && (
          <div style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.5)', marginBottom: '6px', cursor: 'pointer' }}>
            View all {comments.length} comments
          </div>
        )}

        {comments.slice(-2).map((c, i) => (
          <div key={i} style={{ fontSize: '0.82rem', marginBottom: '3px' }}>
            <span style={{ fontWeight: 700, marginRight: '6px' }}>{c.user}</span>
            <span style={{ color: 'rgba(255,255,255,0.85)' }}>{c.text}</span>
          </div>
        ))}

        {/* 7. Timestamp */}
        <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', margin: '8px 0 12px', letterSpacing: '0.04em' }}>
          {new Date(post.createdAt || Date.now()).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
        </div>
      </div>

      {/* 8. Add Comment Input Bar */}
      <form
        onSubmit={handleAddComment}
        style={{
          display: 'flex',
          alignItems: 'center',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          padding: '10px 14px',
        }}
      >
        <span style={{ marginRight: '10px', fontSize: '1.2rem' }}>🌸</span>
        <input
          id={`comment-input-${post.id}`}
          type="text"
          value={commentText}
          placeholder="Add a comment..."
          onChange={e => setCommentText(e.target.value)}
          style={{
            flex: 1,
            background: 'none',
            border: 'none',
            color: '#fff',
            fontSize: '0.86rem',
            outline: 'none',
            fontFamily: 'var(--font-body)',
          }}
        />
        {commentText.trim() && (
          <button
            type="submit"
            style={{
              background: 'none',
              border: 'none',
              color: '#0095f6',
              fontWeight: 700,
              fontSize: '0.86rem',
              cursor: 'pointer',
              padding: 0,
            }}
          >
            Post
          </button>
        )}
      </form>
    </div>
  );
}

// ─── INSTAGRAM GRID ITEM (GRID VIEW) ──────────────────────────────────────────
function InstagramGridItem({ post, onClick }) {
  const isVideo = post.mediaType === 'video' || post.image?.endsWith('.mp4') || post.mediaUrl?.endsWith('.mp4');
  const src = post.mediaUrl || post.image;
  const fullSrc = src?.startsWith('/uploads') ? `${API_BASE}${src}` : src;

  return (
    <div
      onClick={onClick}
      style={{
        position: 'relative',
        aspectRatio: '1 / 1',
        backgroundColor: '#111',
        overflow: 'hidden',
        cursor: 'pointer',
      }}
    >
      {isVideo ? (
        <video
          src={fullSrc}
          muted
          playsInline
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      ) : fullSrc ? (
        <img
          src={fullSrc}
          alt={post.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      ) : (
        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem' }}>
          🕉️
        </div>
      )}

      {/* Reel Video Indicator in Corner */}
      {isVideo && (
        <div style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          color: '#fff',
          filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.8))',
        }}>
          <Play size={18} fill="#fff" />
        </div>
      )}

      {/* Hover Overlay with Likes Count */}
      <div
        className="insta-grid-overlay"
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '16px',
          opacity: 0,
          transition: 'opacity 0.2s',
          color: '#fff',
          fontWeight: 700,
          fontSize: '0.95rem',
        }}
        onMouseEnter={e => e.currentTarget.style.opacity = '1'}
        onMouseLeave={e => e.currentTarget.style.opacity = '0'}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Heart size={18} fill="#fff" /> {post.likes || 1200}
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <MessageCircle size={18} fill="#fff" /> 18
        </span>
      </div>
    </div>
  );
}
