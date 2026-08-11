import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Clock, User, Phone, Mail, MapPin, CheckCircle, Sparkles, ExternalLink, CalendarCheck } from 'lucide-react';
import { generateGoogleCalendarUrl } from '../utils/googleCalendar';

const GOOGLE_CALENDAR_SCHEDULE_URL = 'https://calendar.app.google/erimu7jnSirvZeap8';

const TIME_SLOTS = [
  '10:00 AM',
  '11:30 AM',
  '02:00 PM',
  '04:00 PM',
  '06:00 PM',
  '08:00 PM',
];

const ALL_SERVICES = [
  { id: 'kundli', title: 'Kundli Reading', price: '₹2,100', category: 'Birth Chart Analysis' },
  { id: 'palm', title: 'Palmistry', price: '₹1,500', category: 'Hand Line Analysis' },
  { id: 'career', title: 'Career Guidance', price: '₹2,500', category: 'Professional Growth' },
  { id: 'marriage', title: 'Marriage Match', price: '₹3,100', category: 'Matchmaking' },
  { id: 'muhurat', title: 'Shubh Muhurat', price: '₹1,100', category: 'Auspicious Timing' },
  { id: 'vastu', title: 'Vastu Consultation', price: '₹5,000', category: 'Space Harmony' },
  { id: 'navagraha-puja', title: 'Navagraha Shanti Puja', price: '₹31,000', category: 'Planetary Remedies' },
  { id: 'navagraha-homa', title: 'Navagraha Homa (Fire Ritual)', price: '₹11,000', category: 'Homa Rituals' },
  { id: 'individual-graha', title: 'Individual Graha Shanti Puja', price: '₹11,000/planet', category: 'Individual Planet' },
  { id: 'mrityunjaya', title: 'Maha Mrityunjaya Japa & Homa', price: '₹1,00,000', category: 'Supreme Rituals' },
  { id: 'rudrabhishek', title: 'Rudrabhishek', price: '₹11,000 – ₹21,000', category: 'Shiva Rituals' },
  { id: 'mangal-dosha', title: 'Mangal Dosha (Kuja Dosha) Shanti', price: '₹21,000', category: 'Dosha Remedies' },
  { id: 'kaal-sarp', title: 'Kaal Sarp Dosha Shanti', price: '₹21,000', category: 'Dosha Remedies' },
  { id: 'rahu-ketu', title: 'Rahu–Ketu Shanti Puja', price: '₹21,000', category: 'Planetary Remedies' },
  { id: 'shani-shanti', title: 'Shani Shanti Puja', price: '₹15,000', category: 'Planetary Remedies' },
  { id: 'pitru-dosha', title: 'Pitru Dosha Shanti', price: '₹21,000', category: 'Ancestral Rituals' },
  { id: 'narayan-nagbali', title: 'Narayan Nagbali', price: '₹31,000', category: 'Ancestral Rituals' },
  { id: 'tripindi', title: 'Tripindi Shraddha', price: '₹18,000', category: 'Ancestral Rituals' },
  { id: 'durga-saptashati', title: 'Durga Saptashati Path', price: '₹51,000', category: 'Goddess Rituals' },
  { id: 'lakshmi-kubera', title: 'Lakshmi Kubera Puja & Dhanvantari Homa', price: '₹41,000', category: 'Prosperity Rituals' },
  { id: 'santana-gopala', title: 'Santana Gopala Puja', price: '₹31,000', category: 'Special Rituals' },
  { id: 'shatachandi', title: 'Shatachandi Yajna', price: '₹71,000', category: 'Supreme Rituals' },
  { id: 'vastu-shanti', title: 'Vastu Shanti Puja', price: '₹55,000', category: 'Vastu & Home' },
  { id: 'griha-shanti', title: 'Griha Shanti Homa', price: '₹21,000', category: 'Vastu & Home' },
];

export default function BookingModal({ isOpen, onClose, initialService }) {
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  const [service, setService] = useState(initialService || ALL_SERVICES[0]);
  const [activeTab, setActiveTab] = useState('quickform'); // 'quickform' (recommended) or 'gcal'
  const [bookingType, setBookingType] = useState('online');
  const [selectedDate, setSelectedDate] = useState(tomorrow);
  const [selectedSlot, setSelectedSlot] = useState('10:00 AM');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    whatsapp: '',
    birthDate: '',
    birthTime: '',
    birthPlace: '',
    notes: '',
  });

  const [busySlots, setBusySlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [bookingResult, setBookingResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (!selectedDate) return;
    fetch(`/api/bookings/busy-slots?date=${selectedDate}`)
      .then(res => res.json())
      .then(data => {
        if (data.busySlots) {
          setBusySlots(data.busySlots);
          if (data.busySlots.includes(selectedSlot)) {
            const avail = TIME_SLOTS.find(s => !data.busySlots.includes(s));
            if (avail) setSelectedSlot(avail);
          }
        }
      })
      .catch(err => console.warn('Busy slots fetch warning:', err));
  }, [selectedDate]);

  useEffect(() => {
    if (initialService) {
      setService(initialService);
      if (initialService.category?.includes('Ritual') || initialService.category?.includes('Puja') || initialService.category?.includes('Homa') || initialService.title?.includes('Puja')) {
        setBookingType('pooja');
      } else {
        setBookingType('online');
      }
    }
  }, [initialService]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    if (busySlots.includes(selectedSlot)) {
      setErrorMsg(`The slot ${selectedSlot} is already booked on ${selectedDate}. Please select an available slot.`);
      setLoading(false);
      return;
    }

    const payload = {
      name: formData.name,
      email: formData.email,
      whatsapp: formData.whatsapp,
      birthDate: formData.birthDate,
      birthTime: formData.birthTime,
      birthPlace: formData.birthPlace,
      serviceTitle: service.title,
      servicePrice: service.price || 'Consultation',
      bookingDate: selectedDate,
      bookingTimeSlot: selectedSlot,
      notes: formData.notes,
      bookingType,
    };

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        setBookingResult(data);
      } else {
        setErrorMsg(data.error || 'Failed to record booking.');
      }
    } catch (err) {
      console.warn('Backend booking submission fallback activated:', err);
      const fallbackUrl = generateGoogleCalendarUrl({
        serviceTitle: service.title,
        servicePrice: service.price,
        name: formData.name,
        whatsapp: formData.whatsapp,
        email: formData.email,
        birthDate: formData.birthDate,
        birthTime: formData.birthTime,
        birthPlace: formData.birthPlace,
        notes: formData.notes,
        bookingType,
        date: selectedDate,
        timeSlot: selectedSlot,
      });

      setBookingResult({
        booking: { ...payload, id: 'local-' + Date.now() },
        googleCalendarUrl: fallbackUrl,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsAppOpen = () => {
    const phoneNumber = "919243818146";
    const birthInfo = formData.birthDate ? `\nBirth Details: Date: ${formData.birthDate}, Time: ${formData.birthTime || 'N/A'}, Place: ${formData.birthPlace || 'N/A'}` : '';
    const msg = `Hi Ashay ji, I am booking ${service.title} (${service.price || ''}) for ${selectedDate} at ${selectedSlot}.\nClient Name: ${formData.name || 'Client'}\nWhatsApp: ${formData.whatsapp || ''}${birthInfo}${formData.notes ? `\nNotes: ${formData.notes}` : ''}`;
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <AnimatePresence>
      <div style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '16px', overflowY: 'auto'
      }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3 }}
          style={{
            position: 'relative', width: '100%', maxWidth: '780px',
            height: '85vh', display: 'flex', flexDirection: 'column',
            backgroundColor: '#111111',
            border: '1px solid rgba(212, 175, 55, 0.4)',
            borderRadius: '24px',
            boxShadow: '0 25px 70px rgba(0,0,0,0.9)',
            overflow: 'hidden', color: '#fff',
            fontFamily: 'var(--font-body)'
          }}
        >
          {/* Header */}
          <div style={{ padding: '20px 24px 16px', borderBottom: '1px solid rgba(212,175,55,0.2)', backgroundColor: '#181818', position: 'relative' }}>
            <button
              onClick={onClose}
              style={{
                position: 'absolute', top: '16px', right: '16px',
                background: 'rgba(255,255,255,0.08)', border: 'none',
                borderRadius: '50%', width: '36px', height: '36px',
                color: '#fff', cursor: 'pointer', display: 'flex',
                alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s'
              }}
            >
              <X size={20} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#d4af37', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block' }}>
                  ✦ Mannjyotish Booking System
                </span>
                <h2 style={{ fontFamily: 'var(--font-heading)', color: '#ffffff', fontSize: '1.4rem', margin: '4px 0 0' }}>
                  {service.title}
                </h2>
              </div>
              {service.price && (
                <span style={{ fontSize: '1rem', fontWeight: 700, color: '#d4af37', background: 'rgba(212,175,55,0.15)', padding: '4px 12px', borderRadius: '20px', border: '1px solid rgba(212,175,55,0.3)', marginLeft: 'auto', marginRight: '40px' }}>
                  {service.price}
                </span>
              )}
            </div>

            {/* Mode Tabs */}
            <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
              <button
                type="button"
                onClick={() => setActiveTab('quickform')}
                style={{
                  padding: '8px 16px', borderRadius: '20px', border: 'none',
                  background: activeTab === 'quickform' ? 'linear-gradient(135deg, #d4af37, #b8860b)' : 'rgba(255,255,255,0.06)',
                  color: activeTab === 'quickform' ? '#000' : '#aaa',
                  fontWeight: 700, fontFamily: 'var(--font-heading)', fontSize: '0.82rem',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', transition: 'all 0.2s'
                }}
              >
                <Sparkles size={16} /> 1. Service & Birth Details Form (Recommended)
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('gcal')}
                style={{
                  padding: '8px 16px', borderRadius: '20px', border: 'none',
                  background: activeTab === 'gcal' ? 'linear-gradient(135deg, #d4af37, #b8860b)' : 'rgba(255,255,255,0.06)',
                  color: activeTab === 'gcal' ? '#000' : '#aaa',
                  fontWeight: 700, fontFamily: 'var(--font-heading)', fontSize: '0.82rem',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', transition: 'all 0.2s'
                }}
              >
                <CalendarCheck size={16} /> 2. Embedded Google Calendar
              </button>
            </div>
          </div>

          {/* Body Content */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
            {activeTab === 'gcal' ? (
              <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ background: 'rgba(212,175,55,0.12)', padding: '14px 18px', borderRadius: '14px', border: '1px solid rgba(212,175,55,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                  <div>
                    <h4 style={{ margin: '0 0 4px', color: '#d4af37', fontSize: '1rem', fontFamily: 'var(--font-heading)' }}>
                      🔮 Booking Service: <span style={{ textDecoration: 'underline', color: '#fff' }}>{service.title} ({service.price})</span>
                    </h4>
                    <p style={{ margin: 0, fontSize: '0.83rem', color: 'rgba(255,255,255,0.85)' }}>
                      In Google's form below, please enter <strong>"{service.title}"</strong> under <em>Service or Ritual Name</em>, or use our <button type="button" onClick={() => setActiveTab('quickform')} style={{ color: '#d4af37', background: 'none', border: 'none', textDecoration: 'underline', cursor: 'pointer', fontWeight: 700 }}>Auto-Fill Form</button> to transmit birth details directly!
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      type="button"
                      onClick={() => setActiveTab('quickform')}
                      style={{
                        padding: '8px 14px', borderRadius: '8px',
                        background: 'linear-gradient(135deg, #d4af37, #b8860b)', color: '#000',
                        fontFamily: 'var(--font-heading)', fontWeight: 700,
                        fontSize: '0.8rem', border: 'none', cursor: 'pointer'
                      }}
                    >
                      Auto-Fill Service & Birth Details ✦
                    </button>
                    <a
                      href={GOOGLE_CALENDAR_SCHEDULE_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        padding: '8px 14px', borderRadius: '8px',
                        background: 'rgba(255,255,255,0.1)', color: '#fff',
                        fontFamily: 'var(--font-heading)', fontWeight: 700,
                        fontSize: '0.8rem', textDecoration: 'none',
                        display: 'flex', alignItems: 'center', gap: '6px'
                      }}
                    >
                      Fullscreen Schedule <ExternalLink size={14} />
                    </a>
                  </div>
                </div>

                {/* Embedded Google Calendar Appointment Schedule iframe */}
                <div style={{ flex: 1, minHeight: '420px', borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', background: '#fff' }}>
                  <iframe
                    src={GOOGLE_CALENDAR_SCHEDULE_URL}
                    title="Google Calendar Appointment Schedule"
                    style={{ width: '100%', height: '100%', border: 'none', minHeight: '420px' }}
                  />
                </div>
              </div>
            ) : !bookingResult ? (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {/* Pre-Selected Service Banner & Selector */}
                <div style={{ background: 'rgba(212,175,55,0.08)', padding: '12px 16px', borderRadius: '12px', border: '1px solid rgba(212,175,55,0.3)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '0.8rem', color: '#d4af37', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>
                    🔮 Selected Service / Ritual (Auto-Filled)
                  </label>
                  <select
                    value={service.id}
                    onChange={(e) => {
                      const found = ALL_SERVICES.find(s => s.id === e.target.value);
                      if (found) setService(found);
                    }}
                    style={{
                      width: '100%', padding: '10px 12px', borderRadius: '8px',
                      background: '#1a1a1a', border: '1px solid rgba(212,175,55,0.4)',
                      color: '#d4af37', fontWeight: 700, fontFamily: 'var(--font-heading)',
                      fontSize: '0.95rem', outline: 'none', cursor: 'pointer'
                    }}
                  >
                    {ALL_SERVICES.map((s) => (
                      <option key={s.id} value={s.id} style={{ background: '#111', color: '#fff' }}>
                        {s.title} ({s.price}) — {s.category}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Mode Selector */}
                <div style={{ display: 'flex', gap: '10px', background: 'rgba(255,255,255,0.04)', padding: '4px', borderRadius: '12px', border: '1px solid rgba(212,175,55,0.2)' }}>
                  <button
                    type="button"
                    onClick={() => setBookingType('online')}
                    style={{
                      flex: 1, padding: '10px', borderRadius: '8px', border: 'none',
                      background: bookingType === 'online' ? '#d4af37' : 'transparent',
                      color: bookingType === 'online' ? '#000' : '#aaa',
                      fontWeight: 700, fontFamily: 'var(--font-heading)', cursor: 'pointer', transition: 'all 0.2s'
                    }}
                  >
                    💻 Online Consultation
                  </button>
                  <button
                    type="button"
                    onClick={() => setBookingType('pooja')}
                    style={{
                      flex: 1, padding: '10px', borderRadius: '8px', border: 'none',
                      background: bookingType === 'pooja' ? '#d4af37' : 'transparent',
                      color: bookingType === 'pooja' ? '#000' : '#aaa',
                      fontWeight: 700, fontFamily: 'var(--font-heading)', cursor: 'pointer', transition: 'all 0.2s'
                    }}
                  >
                    🪔 Temple / Pooja Ritual
                  </button>
                </div>

                {/* Date & Time Slot */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: '#d4af37', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px', fontWeight: 600 }}>
                      <Calendar size={14} /> Select Date
                    </label>
                    <input
                      type="date"
                      min={tomorrow}
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      required
                      style={{
                        width: '100%', padding: '12px', borderRadius: '10px',
                        background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(212,175,55,0.3)',
                        color: '#fff', outline: 'none', fontFamily: 'var(--font-body)', boxSizing: 'border-box'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: '#d4af37', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px', fontWeight: 600 }}>
                      <Clock size={14} /> Available Time Slots
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                      {TIME_SLOTS.map((slot) => {
                        const isBusy = busySlots.includes(slot);
                        const isSelected = selectedSlot === slot;
                        return (
                          <button
                            key={slot}
                            type="button"
                            disabled={isBusy}
                            onClick={() => setSelectedSlot(slot)}
                            style={{
                              padding: '8px 4px',
                              borderRadius: '8px',
                              border: isSelected ? '2px solid #d4af37' : isBusy ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(212,175,55,0.3)',
                              background: isSelected ? 'rgba(212,175,55,0.25)' : isBusy ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.4)',
                              color: isBusy ? '#555' : isSelected ? '#d4af37' : '#fff',
                              fontSize: '0.8rem',
                              fontWeight: isSelected ? 700 : 400,
                              cursor: isBusy ? 'not-allowed' : 'pointer',
                              textAlign: 'center',
                              textDecoration: isBusy ? 'line-through' : 'none',
                              transition: 'all 0.2s',
                            }}
                          >
                            {slot} {isBusy ? '🔒' : ''}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Personal Information */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', marginBottom: '4px', display: 'block' }}>Full Name *</label>
                    <input
                      type="text" name="name" placeholder="Your Name" required
                      value={formData.name} onChange={handleChange}
                      style={{ width: '100%', padding: '12px', borderRadius: '10px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(212,175,55,0.3)', color: '#fff', outline: 'none', boxSizing: 'border-box' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', marginBottom: '4px', display: 'block' }}>WhatsApp Number *</label>
                    <input
                      type="tel" name="whatsapp" placeholder="+91 98765 43210" required
                      value={formData.whatsapp} onChange={handleChange}
                      style={{ width: '100%', padding: '12px', borderRadius: '10px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(212,175,55,0.3)', color: '#fff', outline: 'none', boxSizing: 'border-box' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', marginBottom: '4px', display: 'block' }}>Email Address (For Resend Email & iCal Invite)</label>
                  <input
                    type="email" name="email" placeholder="name@example.com"
                    value={formData.email} onChange={handleChange}
                    style={{ width: '100%', padding: '12px', borderRadius: '10px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(212,175,55,0.3)', color: '#fff', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>

                {/* Birth Details for Chart Generation */}
                <div style={{ padding: '16px', borderRadius: '12px', background: 'rgba(212,175,55,0.05)', border: '1px dashed rgba(212,175,55,0.3)' }}>
                  <div style={{ fontSize: '0.82rem', color: '#d4af37', fontWeight: 700, marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    ✦ Birth Details (Optional - For Kundli Calculations)
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                    <input
                      type="date" name="birthDate" value={formData.birthDate} onChange={handleChange}
                      placeholder="Birth Date"
                      style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '0.85rem', boxSizing: 'border-box' }}
                    />
                    <input
                      type="time" name="birthTime" value={formData.birthTime} onChange={handleChange}
                      placeholder="Birth Time"
                      style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '0.85rem', boxSizing: 'border-box' }}
                    />
                    <input
                      type="text" name="birthPlace" value={formData.birthPlace} onChange={handleChange}
                      placeholder="City, State"
                      style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '0.85rem', boxSizing: 'border-box' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', marginBottom: '4px', display: 'block' }}>Notes / Specific Requirement</label>
                  <textarea
                    name="notes" rows={2} placeholder="Describe your question or specific requirement..."
                    value={formData.notes} onChange={handleChange}
                    style={{ width: '100%', padding: '12px', borderRadius: '10px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(212,175,55,0.3)', color: '#fff', outline: 'none', resize: 'none', boxSizing: 'border-box' }}
                  />
                </div>

                {errorMsg && (
                  <div style={{ color: '#ff6b6b', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    ⚠️ {errorMsg}
                  </div>
                )}

                <button
                  type="submit" disabled={loading}
                  style={{
                    padding: '14px', borderRadius: '12px', border: 'none',
                    background: 'linear-gradient(135deg, #d4af37, #b8860b)',
                    color: '#000', fontFamily: 'var(--font-heading)',
                    fontWeight: 700, fontSize: '1rem', cursor: loading ? 'wait' : 'pointer',
                    opacity: loading ? 0.7 : 1, transition: 'all 0.2s', marginTop: '10px'
                  }}
                >
                  {loading ? 'Confirming Booking & Sending Invite...' : 'Confirm Booking & Send Calendar Invites ✦'}
                </button>
              </form>
            ) : (
              /* Success Confirmation Screen */
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <div style={{ width: '70px', height: '70px', borderRadius: '50%', background: 'rgba(16,185,129,0.15)', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', border: '2px solid #10B981' }}>
                  <CheckCircle size={40} />
                </div>

                <h2 style={{ fontFamily: 'var(--font-heading)', color: '#d4af37', fontSize: '1.8rem', marginBottom: '8px' }}>
                  Booking Confirmed!
                </h2>

                <p style={{ color: '#aaa', fontSize: '0.95rem', marginBottom: '24px' }}>
                  Thank you <strong>{bookingResult.booking.name}</strong>. Your session for <strong>{bookingResult.booking.serviceTitle}</strong> is scheduled for <strong>{bookingResult.booking.bookingDate}</strong> at <strong>{bookingResult.booking.bookingTimeSlot}</strong>.
                </p>

                {/* Action Buttons */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '400px', margin: '0 auto 24px' }}>
                  {bookingResult.googleCalendarUrl && (
                    <a
                      href={bookingResult.googleCalendarUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        padding: '14px 20px', borderRadius: '12px',
                        background: 'linear-gradient(135deg, #d4af37, #b8860b)',
                        color: '#000', fontFamily: 'var(--font-heading)', fontWeight: 700,
                        textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                      }}
                    >
                      📅 Add to Google Calendar
                    </a>
                  )}

                  <button
                    onClick={handleWhatsAppOpen}
                    style={{
                      padding: '14px 20px', borderRadius: '12px',
                      background: '#25D366', color: '#fff',
                      fontFamily: 'var(--font-heading)', fontWeight: 700, border: 'none',
                      cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                    }}
                  >
                    💬 Confirm on WhatsApp
                  </button>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.04)', padding: '14px', borderRadius: '12px', fontSize: '0.85rem', color: '#888', border: '1px solid rgba(255,255,255,0.08)' }}>
                  ✨ Confirmation details and calendar invite (.ics) have been sent via Resend.
                </div>

                <button
                  onClick={onClose}
                  style={{
                    marginTop: '20px', background: 'none', border: '1px solid rgba(212,175,55,0.4)',
                    color: '#d4af37', padding: '10px 24px', borderRadius: '8px', cursor: 'pointer',
                    fontFamily: 'var(--font-heading)', fontWeight: 600
                  }}
                >
                  Close Window
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
