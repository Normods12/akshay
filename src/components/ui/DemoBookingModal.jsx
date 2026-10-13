import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Clock, CheckCircle2, Sparkles, Mail, Phone, User, BookOpen } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const API_BASE = import.meta.env.VITE_API_BASE || '';

export default function DemoBookingModal({ isOpen, onClose, preselectedCourse = '' }) {
  const theme = useTheme();

  // Calculate the 1st of next month
  const getNextMonthFirstDate = () => {
    const now = new Date();
    // If today is the 1st, schedule for the 1st of next month; otherwise next month
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    const monthName = nextMonth.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
    return {
      formatted: `1st of ${monthName}`,
      isoDate: nextMonth.toISOString().split('T')[0],
      displayFull: `1st ${monthName} at 7:00 PM IST`,
      nextMonthObj: nextMonth,
    };
  };

  const batchInfo = getNextMonthFirstDate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [courseTitle, setCourseTitle] = useState(preselectedCourse || 'Foundation of Jyotish');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim() || !email.trim() || !phone.trim()) {
      setErrorMsg('Please provide your name, email, and WhatsApp number.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/api/demo-booking`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          courseTitle,
          notes: notes.trim(),
          eventDate: batchInfo.displayFull
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to enroll in demo class.');
      }

      setIsSuccess(true);
    } catch (err) {
      setErrorMsg(err.message || 'Something went wrong. Please try again or WhatsApp us directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Google Calendar link generator for 1st of next month 7:00 PM - 8:30 PM IST (UTC + 5:30)
  const generateGCalUrl = () => {
    const year = batchInfo.nextMonthObj.getFullYear();
    const month = String(batchInfo.nextMonthObj.getMonth() + 1).padStart(2, '0');
    // 7:00 PM IST is 13:30 UTC
    const startStr = `${year}${month}01T133000Z`;
    const endStr = `${year}${month}01T150000Z`;
    const title = encodeURIComponent(`MannJyotish Live Demo Class: ${courseTitle}`);
    const details = encodeURIComponent(`Live Vedic Astrology Demo Class conducted by Acharya Shri Hit Ashay Krishn Goswami.\nMeeting link will be shared on your registered WhatsApp & Email.`);
    const location = encodeURIComponent('Online (Google Meet / Zoom)');
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startStr}/${endStr}&details=${details}&location=${location}`;
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
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        backdropFilter: 'blur(8px)',
      }}>
        <div onClick={onClose} style={{ position: 'absolute', inset: 0 }} />

        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: '500px',
            backgroundColor: '#13131c',
            border: '1px solid rgba(212, 175, 55, 0.4)',
            borderRadius: '24px',
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.9), 0 0 35px rgba(212,175,55,0.15)',
            padding: '32px 28px',
            color: '#fff',
            zIndex: 1,
            fontFamily: 'var(--font-body)',
            maxHeight: '90vh',
            overflowY: 'auto',
          }}
        >
          {/* Close button */}
          <button
            onClick={onClose}
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
              color: 'rgba(255, 255, 255, 0.6)',
              cursor: 'pointer',
            }}
          >
            <X size={18} />
          </button>

          {isSuccess ? (
            <div style={{ textAlign: 'center', padding: '16px 0' }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'rgba(34, 197, 94, 0.15)',
                border: '1px solid #22c55e',
                color: '#22c55e',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
              }}>
                <CheckCircle2 size={36} />
              </div>

              <h3 style={{ fontFamily: 'var(--font-heading)', color: '#d4af37', fontSize: '1.5rem', marginBottom: '8px' }}>
                You're Enrolled for the Demo Class!
              </h3>
              <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.92rem', lineHeight: 1.5, marginBottom: '20px' }}>
                Your seat has been reserved for <strong>{batchInfo.displayFull}</strong>. A confirmation email has been dispatched to <strong>{email}</strong> and Acharya Ji's desk.
              </p>

              <div style={{
                background: 'rgba(212,175,55,0.08)',
                border: '1px solid rgba(212,175,55,0.25)',
                borderRadius: '12px',
                padding: '14px',
                marginBottom: '24px',
                textAlign: 'left',
                fontSize: '0.85rem'
              }}>
                <div style={{ color: '#d4af37', fontWeight: 700, marginBottom: '4px' }}>📋 Enrollment Summary</div>
                <div>👤 {name}</div>
                <div>📱 WhatsApp: {phone}</div>
                <div>🗓️ Schedule: {batchInfo.displayFull}</div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <a
                  href={generateGCalUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    padding: '12px 20px',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #d4af37, #b8860b)',
                    color: '#000',
                    fontFamily: 'var(--font-heading)',
                    fontWeight: 800,
                    fontSize: '0.9rem',
                    textDecoration: 'none',
                  }}
                >
                  <Calendar size={18} />
                  <span>Add to Google Calendar</span>
                </a>

                <button
                  onClick={onClose}
                  style={{
                    padding: '10px',
                    background: 'none',
                    border: '1px solid rgba(255,255,255,0.2)',
                    color: '#fff',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    fontSize: '0.85rem'
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {/* Header */}
              <div style={{ textAlign: 'center', marginBottom: '22px' }}>
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
                  marginBottom: '10px',
                }}>
                  <Sparkles size={13} />
                  <span>FREE LIVE INTERACTIVE WORKSHOP</span>
                </div>

                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.45rem', margin: '0 0 6px', color: '#fff' }}>
                  Enroll in Live Demo Class
                </h3>
                <p style={{ fontSize: '0.84rem', color: 'rgba(255, 255, 255, 0.65)', margin: 0 }}>
                  Conducted live by Acharya Shri Hit Ashay Krishn Goswami
                </p>
              </div>

              {/* Event Batch Highlight Banner */}
              <div style={{
                background: 'linear-gradient(135deg, rgba(212,175,55,0.18), rgba(212,175,55,0.06))',
                border: '1.5px solid rgba(212,175,55,0.4)',
                borderRadius: '14px',
                padding: '12px 16px',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
              }}>
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #d4af37, #b8860b)',
                  color: '#000',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <Calendar size={22} />
                </div>
                <div>
                  <div style={{ fontSize: '0.72rem', color: '#d4af37', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Scheduled Monthly Cohort
                  </div>
                  <div style={{ fontSize: '0.98rem', fontWeight: 700, color: '#fff' }}>
                    {batchInfo.formatted}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.65)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={12} />
                    <span>07:00 PM to 08:30 PM IST · Live Online</span>
                  </div>
                </div>
              </div>

              {errorMsg && (
                <div style={{
                  padding: '10px 14px',
                  borderRadius: '10px',
                  background: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid rgba(239, 68, 68, 0.4)',
                  color: '#f87171',
                  fontSize: '0.82rem',
                  marginBottom: '16px',
                }}>
                  {errorMsg}
                </div>
              )}

              {/* Form Fields */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '22px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: 'rgba(255,255,255,0.6)', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Your Full Name *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <User size={16} color="rgba(255,255,255,0.4)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="e.g. Ramesh Chandra"
                      style={{
                        width: '100%',
                        padding: '10px 14px 10px 38px',
                        borderRadius: '10px',
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(212,175,55,0.25)',
                        color: '#fff',
                        fontSize: '0.88rem',
                        outline: 'none',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: 'rgba(255,255,255,0.6)', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Email Address (For Zoom/Meet Link) *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={16} color="rgba(255,255,255,0.4)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="e.g. ramesh@example.com"
                      style={{
                        width: '100%',
                        padding: '10px 14px 10px 38px',
                        borderRadius: '10px',
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(212,175,55,0.25)',
                        color: '#fff',
                        fontSize: '0.88rem',
                        outline: 'none',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: 'rgba(255,255,255,0.6)', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    WhatsApp Mobile Number (For reminders & notes) *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Phone size={16} color="rgba(255,255,255,0.4)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      style={{
                        width: '100%',
                        padding: '10px 14px 10px 38px',
                        borderRadius: '10px',
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(212,175,55,0.25)',
                        color: '#fff',
                        fontSize: '0.88rem',
                        outline: 'none',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: 'rgba(255,255,255,0.6)', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Course of Interest
                  </label>
                  <select
                    value={courseTitle}
                    onChange={e => setCourseTitle(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '10px',
                      background: '#1a1a24',
                      border: '1px solid rgba(212,175,55,0.3)',
                      color: '#d4af37',
                      fontWeight: 600,
                      fontSize: '0.88rem',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  >
                    <option value="Foundation of Jyotish">Foundation of Jyotish (Beginner)</option>
                    <option value="Advanced Chart Reading">Advanced Chart Reading & Dashas</option>
                    <option value="The Art of Tarot">The Art of Tarot & Vedic Fusion</option>
                    <option value="General Vedic Astrology">General Vedic Astrological Studies</option>
                  </select>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  width: '100%',
                  padding: '13px 20px',
                  borderRadius: '14px',
                  background: 'linear-gradient(135deg, #d4af37 0%, #b8860b 100%)',
                  border: 'none',
                  color: '#000',
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 800,
                  fontSize: '0.98rem',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 6px 20px rgba(212,175,55,0.35)',
                  opacity: isSubmitting ? 0.7 : 1,
                }}
              >
                <span>{isSubmitting ? 'Reserving Seat...' : `Confirm Free Demo for 1st of Next Month ✦`}</span>
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
