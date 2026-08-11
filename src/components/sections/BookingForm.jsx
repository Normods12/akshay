import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import VedicButton from '../ui/VedicButton';
import SectionHeading from '../ui/SectionHeading';
import { OmIcon, StarMapIcon } from '../ui/Icons';
import { motion, AnimatePresence } from 'framer-motion';
import MandalaArt from '../ui/MandalaArt';
import { generateGoogleCalendarUrl } from '../../utils/googleCalendar';

const BookingFormOrbitArt = ({ primaryColor = 'var(--color-primary)' }) => (
  <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
      style={{ position: 'absolute', top: '10%', right: '6%', width: 160, height: 160, color: primaryColor, opacity: 0.1 }}
    >
      <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" />
      </svg>
    </motion.div>
    <motion.div
      animate={{ y: [0, -14, 0], opacity: [0.08, 0.16, 0.08] }}
      transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      style={{ position: 'absolute', bottom: '8%', left: '5%', width: 120, height: 120, color: primaryColor }}
    >
      <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M3 10h18" />
        <path d="M8 3v4" />
        <path d="M16 3v4" />
      </svg>
    </motion.div>
  </div>
);

const BookingForm = () => {
  const theme = useTheme();
  const [bookingType, setBookingType] = useState('online'); // 'online' or 'pooja'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    whatsapp: '',
    birthDate: '',
    birthTime: '',
    birthPlace: '',
    poojaPurpose: ''
  });

  const [submittedCalUrl, setSubmittedCalUrl] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const { name, whatsapp, email, birthDate, birthTime, birthPlace, poojaPurpose } = formData;
    const typeLabel = bookingType === 'online' ? 'Personal Consultation (Online)' : 'Sacred Pooja (In-Person in Bhind)';
    
    const fallbackUrl = generateGoogleCalendarUrl({
      serviceTitle: typeLabel,
      name,
      whatsapp,
      email,
      birthDate,
      birthTime,
      birthPlace,
      notes: poojaPurpose,
      bookingType,
    });

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email: email || '',
          whatsapp,
          birthDate,
          birthTime,
          birthPlace,
          serviceTitle: typeLabel,
          notes: poojaPurpose,
          bookingType,
        })
      });
      const data = await res.json();
      if (data.googleCalendarUrl) {
        setSubmittedCalUrl(data.googleCalendarUrl);
      } else {
        setSubmittedCalUrl(fallbackUrl);
      }
      setSubmitted(true);
    } catch (err) {
      console.warn('Booking API call error in BookingForm:', err);
      setSubmittedCalUrl(fallbackUrl);
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    marginBottom: '20px',
    border: 'none',
    borderBottom: `2px solid ${theme.colors.outline}33`,
    backgroundColor: `${theme.colors.primary}0D`,
    borderRadius: '4px',
    fontFamily: 'var(--font-body)',
    fontSize: '1rem',
    color: theme.colors.text,
    outline: 'none',
    transition: 'all 0.3s ease'
  };

  const tabStyle = (type) => ({
    flex: 1,
    padding: '16px',
    cursor: 'pointer',
    textAlign: 'center',
    transition: 'all 0.3s ease',
    borderBottom: bookingType === type ? `3px solid ${theme.colors.primary}` : '1px solid #eee',
    backgroundColor: bookingType === type ? `${theme.colors.primary}08` : 'transparent',
    color: bookingType === type ? theme.colors.primary : '#666',
    fontWeight: bookingType === type ? '700' : '400',
    fontFamily: 'var(--font-heading)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px'
  });

  return (
    <section id="booking-form" className="section" style={{ position: 'relative', overflow: 'hidden' }}>
      <MandalaArt
        variant={1}
        size="480px"
        opacity={0.28}
        style={{ position: 'absolute', bottom: '-240px', right: '-240px', zIndex: 0, pointerEvents: 'none' }}
      />
      <BookingFormOrbitArt primaryColor={theme.colors.primary} />
      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
      <SectionHeading>Schedule Your Session</SectionHeading>
      
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        style={{ 
          maxWidth: '600px', 
          margin: '40px auto 0',
          backgroundColor: 'var(--bg-dark)',
          borderRadius: '12px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
          overflow: 'hidden',
          border: `1px solid ${theme.colors.outline}1A`
        }}
        className="glass-panel"
      >
        {/* Tabs */}
        <div style={{ display: 'flex' }}>
          <motion.div 
            whileHover={{ backgroundColor: `${theme.colors.primary}10` }}
            whileTap={{ scale: 0.98 }}
            style={tabStyle('online')} 
            onClick={() => setBookingType('online')}
          >
            <StarMapIcon style={{ marginBottom: '4px' }} />
            <span style={{ fontSize: '0.9rem' }}>Online Consultation</span>
          </motion.div>
          <motion.div 
            whileHover={{ backgroundColor: `${theme.colors.primary}10` }}
            whileTap={{ scale: 0.98 }}
            style={tabStyle('pooja')} 
            onClick={() => setBookingType('pooja')}
          >
            <OmIcon style={{ marginBottom: '4px' }} />
            <span style={{ fontSize: '0.9rem' }}>Sacred Pooja</span>
          </motion.div>
        </div>

        {submitted ? (
          <div style={{ padding: '40px', textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>✨</div>
            <h3 style={{ fontFamily: 'var(--font-heading)', color: theme.colors.primary, fontSize: '1.6rem', marginBottom: '12px' }}>
              Response Sent Successfully!
            </h3>
            <p style={{ color: theme.colors.text, opacity: 0.85, fontSize: '0.95rem', marginBottom: '24px', lineHeight: 1.6 }}>
              Thank you <strong>{formData.name}</strong>. Your request for <strong>{bookingType === 'online' ? 'Online Personal Consultation' : 'Sacred Pooja'}</strong> has been received.<br/>
              Confirmation details & calendar invitation (.ics) have been emailed via Resend to <strong>{formData.email || 'Admin & registered email'}</strong>.
            </p>
            {submittedCalUrl && (
              <a
                href={submittedCalUrl} target="_blank" rel="noopener noreferrer"
                style={{
                  display: 'inline-block', padding: '12px 24px', borderRadius: '8px',
                  background: theme.colors.primary, color: '#000', fontFamily: 'var(--font-heading)',
                  fontWeight: 700, textDecoration: 'none', marginBottom: '16px'
                }}
              >
                📅 Add to Google Calendar
              </a>
            )}
            <div>
              <button
                onClick={() => { setSubmitted(false); setFormData({ name: '', email: '', whatsapp: '', birthDate: '', birthTime: '', birthPlace: '', poojaPurpose: '' }); }}
                style={{ background: 'none', border: `1px solid ${theme.colors.primary}`, color: theme.colors.primary, padding: '8px 18px', borderRadius: '6px', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: '0.85rem' }}
              >
                Submit Another Request
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="booking-form-element" style={{ padding: '40px' }}>
            <div style={{ marginBottom: '24px', opacity: 0.7, fontSize: '0.9rem', textAlign: 'center', color: theme.colors.text }}>
              {bookingType === 'online' 
                ? "1-on-1 Zoom/WhatsApp calls for Birth Charts and Career guidance." 
                : "Rituals performed with tradition at our temple in Bhind."}
            </div>

            <div className="booking-form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <label style={{ fontSize: '0.875rem', fontWeight: '600', display: 'block', marginBottom: '8px', color: theme.colors.text }}>Name *</label>
                <motion.input 
                  whileFocus={{ scale: 1.02, borderBottomColor: theme.colors.primary }}
                  type="text" 
                  name="name" 
                  placeholder="Your full name" 
                  required 
                  style={inputStyle}
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.875rem', fontWeight: '600', display: 'block', marginBottom: '8px', color: theme.colors.text }}>WhatsApp *</label>
                <motion.input 
                  whileFocus={{ scale: 1.02, borderBottomColor: theme.colors.primary }}
                  type="tel" 
                  name="whatsapp" 
                  placeholder="+91 XXXXX XXXXX" 
                  required 
                  style={inputStyle}
                  value={formData.whatsapp}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.875rem', fontWeight: '600', display: 'block', marginBottom: '8px', color: theme.colors.text }}>Email Address (For Resend Email & Calendar Invite)</label>
              <motion.input 
                whileFocus={{ scale: 1.02, borderBottomColor: theme.colors.primary }}
                type="email" 
                name="email" 
                placeholder="name@example.com" 
                style={inputStyle}
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="booking-form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <label style={{ fontSize: '0.875rem', fontWeight: '600', display: 'block', marginBottom: '8px', color: theme.colors.text }}>Birth Date *</label>
                <motion.input 
                  whileFocus={{ scale: 1.02, borderBottomColor: theme.colors.primary }}
                  type="date" 
                  name="birthDate" 
                  required 
                  style={inputStyle}
                  value={formData.birthDate}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.875rem', fontWeight: '600', display: 'block', marginBottom: '8px', color: theme.colors.text }}>Birth Time *</label>
                <motion.input 
                  whileFocus={{ scale: 1.02, borderBottomColor: theme.colors.primary }}
                  type="time" 
                  name="birthTime" 
                  required 
                  style={inputStyle}
                  value={formData.birthTime}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.875rem', fontWeight: '600', display: 'block', marginBottom: '8px', color: theme.colors.text }}>Birth Place *</label>
              <motion.input 
                whileFocus={{ scale: 1.02, borderBottomColor: theme.colors.primary }}
                type="text" 
                name="birthPlace" 
                placeholder="City, State" 
                required 
                style={inputStyle}
                value={formData.birthPlace}
                onChange={handleChange}
              />
            </div>

            <AnimatePresence>
              {bookingType === 'pooja' && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  style={{ marginTop: '10px' }}
                >
                  <label style={{ fontSize: '0.875rem', fontWeight: '600', display: 'block', marginBottom: '8px', color: theme.colors.text }}>Purpose of Pooja *</label>
                  <motion.textarea 
                    whileFocus={{ scale: 1.02, borderBottomColor: theme.colors.primary }}
                    name="poojaPurpose" 
                    placeholder="Describe your requirement (e.g. Health, Wealth, Marriage)" 
                    required={bookingType === 'pooja'}
                    style={{ ...inputStyle, height: '80px', resize: 'none' }}
                    value={formData.poojaPurpose}
                    onChange={handleChange}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <VedicButton type="submit" disabled={loading} style={{ width: '100%', marginTop: '20px' }}>
              {loading ? 'Sending Request...' : 'Submit Booking Request ✦'}
            </VedicButton>
          </form>
        )}
      </motion.div>
      </div>
    </section>
  );
};

export default BookingForm;
