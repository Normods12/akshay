import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import SectionHeading from '../ui/SectionHeading';
import MandalaArt from '../ui/MandalaArt';
import { Phone, Mail, MapPin } from 'lucide-react';

const ContactSignalArt = ({ primaryColor = 'var(--color-primary)' }) => (
  <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
    {[0, 1, 2].map((i) => (
      <motion.div
        key={`ping-a-${i}`}
        animate={{ scale: [1, 2.2], opacity: [0.35, 0] }}
        transition={{ duration: 4, repeat: Infinity, delay: i * 1.3, ease: 'easeOut' }}
        style={{ position: 'absolute', top: '18%', left: '8%', width: 140, height: 140, borderRadius: '50%', border: `2px solid ${primaryColor}` }}
      />
    ))}
    {[0, 1, 2].map((i) => (
      <motion.div
        key={`ping-b-${i}`}
        animate={{ scale: [1, 2.2], opacity: [0.3, 0] }}
        transition={{ duration: 4.5, repeat: Infinity, delay: 1 + i * 1.3, ease: 'easeOut' }}
        style={{ position: 'absolute', bottom: '14%', right: '6%', width: 120, height: 120, borderRadius: '50%', border: `2px solid ${primaryColor}` }}
      />
    ))}
  </div>
);

const InstagramIcon = ({ size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const FacebookIcon = ({ size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const YoutubeIcon = ({ size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.56 49.56 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
    <polygon points="10 15 15 12 10 9 10 15" />
  </svg>
);

const ContactDetails = () => {
  const { colors, themeMode } = useTheme();
  const isDark = themeMode === 'dark';

  const formRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });

  const handleSendEmail = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });

    if (!formRef.current) return;
    const formData = new FormData(formRef.current);
    const user_name = formData.get('user_name');
    const user_email = formData.get('user_email');
    const message = formData.get('message');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_name, user_email, message }),
      });

      const data = await res.json();
      if (data.success) {
        setLoading(false);
        setStatus({ type: 'success', message: '✨ Thank you! Your message has been sent successfully.' });
        if (formRef.current) formRef.current.reset();
      } else {
        setLoading(false);
        setStatus({ type: 'error', message: `❌ ${data.error || 'Unable to send message.'}` });
      }
    } catch (error) {
      setLoading(false);
      setStatus({ type: 'error', message: '❌ Unable to send message. Please try again.' });
      console.error('Resend Contact Error:', error);
    }
  };

  return (
    <section id="contact" className="section section--alt" style={{ position: 'relative', overflow: 'hidden' }}>
      <MandalaArt
        variant={2}
        size="500px"
        opacity={0.1}
        style={{ position: 'absolute', top: '-250px', left: '-250px', zIndex: 0, pointerEvents: 'none' }}
      />
      <ContactSignalArt primaryColor={colors.primary} />
      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
      <SectionHeading>Contact Us</SectionHeading>
      <p style={{ textAlign: 'center', marginBottom: '60px', color: colors.text, opacity: 0.8, fontSize: '1.1rem' }}>
        Reach out to us for bookings, inquiries, or spiritual guidance.
      </p>

      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '40px',
        justifyContent: 'center',
        alignItems: 'stretch'
      }}>
        {/* Contact Info */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="glass-panel"
          style={{
            flex: '1 1 350px',
            padding: '40px',
            borderRadius: '24px',
            border: `1px solid ${colors.outline}33`,
            backgroundColor: 'var(--color-surface-variant)',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px'
          }}
        >
          <h3 style={{ fontFamily: 'var(--font-heading)', color: colors.primary, fontSize: '1.5rem', marginBottom: '10px' }}>
            Get in Touch
          </h3>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ padding: '12px', backgroundColor: `${colors.primary}15`, borderRadius: '50%' }}>
              <Phone size={24} color={colors.primary} />
            </div>
            <div>
              <p style={{ fontSize: '0.85rem', color: colors.text, opacity: 0.6 }}>Phone / WhatsApp</p>
              <p style={{ fontSize: '1.1rem', fontWeight: 600, color: colors.text }}>+91 98765 43210</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ padding: '12px', backgroundColor: `${colors.primary}15`, borderRadius: '50%' }}>
              <Mail size={24} color={colors.primary} />
            </div>
            <div>
              <p style={{ fontSize: '0.85rem', color: colors.text, opacity: 0.6 }}>Email Address</p>
              <p style={{ fontSize: '1.1rem', fontWeight: 600, color: colors.text }}>contact@mannjyotish.com</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ padding: '12px', backgroundColor: `${colors.primary}15`, borderRadius: '50%' }}>
              <MapPin size={24} color={colors.primary} />
            </div>
            <div>
              <p style={{ fontSize: '0.85rem', color: colors.text, opacity: 0.6 }}>Location</p>
              <p style={{ fontSize: '1.1rem', fontWeight: 600, color: colors.text }}>Vrindavan, Uttar Pradesh, India</p>
            </div>
          </div>

          <div style={{ marginTop: 'auto', paddingTop: '20px', borderTop: `1px solid ${colors.outline}33` }}>
            <p style={{ fontSize: '0.9rem', color: colors.text, opacity: 0.8, marginBottom: '12px' }}>Follow us on social media</p>
            <div style={{ display: 'flex', gap: '16px' }}>
              {[InstagramIcon, FacebookIcon, YoutubeIcon].map((Icon, idx) => (
                <a key={idx} href="#" style={{ color: colors.primary, opacity: 0.8, transition: 'opacity 0.3s' }} onMouseEnter={e => e.target.style.opacity = 1} onMouseLeave={e => e.target.style.opacity = 0.8}>
                  <Icon size={24} color={colors.primary} />
                </a>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Quick Contact Form */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="glass-panel"
          style={{
            flex: '1 1 400px',
            padding: '40px',
            borderRadius: '24px',
            border: `1px solid ${colors.outline}33`,
            backgroundColor: 'var(--color-surface-variant)',
          }}
        >
          <h3 style={{ fontFamily: 'var(--font-heading)', color: colors.primary, fontSize: '1.5rem', marginBottom: '24px' }}>
            Send a Message
          </h3>
          <form ref={formRef} onSubmit={handleSendEmail} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <input type="text" name="user_name" placeholder="Your Name" required style={{ padding: '14px', borderRadius: '12px', border: `1px solid ${colors.outline}55`, backgroundColor: 'transparent', color: colors.text, outline: 'none' }} />
            <input type="email" name="user_email" placeholder="Your Email" required style={{ padding: '14px', borderRadius: '12px', border: `1px solid ${colors.outline}55`, backgroundColor: 'transparent', color: colors.text, outline: 'none' }} />
            <textarea name="message" placeholder="How can we help you?" required rows={4} style={{ padding: '14px', borderRadius: '12px', border: `1px solid ${colors.outline}55`, backgroundColor: 'transparent', color: colors.text, outline: 'none', resize: 'none' }}></textarea>
            <button type="submit" disabled={loading} style={{ padding: '14px', borderRadius: '12px', border: 'none', backgroundColor: colors.primary, color: '#fff', fontSize: '1.1rem', fontWeight: 600, cursor: loading ? 'wait' : 'pointer', fontFamily: 'var(--font-heading)', opacity: loading ? 0.7 : 1 }}>
              {loading ? 'Sending Message...' : 'Send Message'}
            </button>
            {status.message && (
              <p style={{ marginTop: '8px', fontSize: '0.95rem', fontWeight: 500, color: status.type === 'success' ? '#10B981' : '#EF4444', textAlign: 'center' }}>
                {status.message}
              </p>
            )}
          </form>
        </motion.div>
      </div>
      </div>
    </section>
  );
};

export default ContactDetails;
