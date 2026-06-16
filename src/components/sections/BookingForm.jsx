import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import VedicButton from '../ui/VedicButton';
import SectionHeading from '../ui/SectionHeading';
import { OmIcon, StarMapIcon } from '../ui/Icons';


const BookingForm = () => {
  const theme = useTheme();
  const [bookingType, setBookingType] = useState('online'); // 'online' or 'pooja'
  const [formData, setFormData] = useState({
    name: '',
    whatsapp: '',
    birthDate: '',
    birthTime: '',
    birthPlace: '',
    poojaPurpose: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleWhatsAppSubmit = (e) => {
    e.preventDefault();
    
    const { name, whatsapp, birthDate, birthTime, birthPlace, poojaPurpose } = formData;
    const phoneNumber = "919243818146";
    const typeLabel = bookingType === 'online' ? 'Personal Consultation (Online)' : 'Sacred Pooja (In-Person in Bhind)';
    
    let details = `Name: ${name}, Date: ${birthDate}, Time: ${birthTime}, Place: ${birthPlace}`;
    if (bookingType === 'pooja') {
      details += `, Purpose: ${poojaPurpose}`;
    }

    const messageTemplate = `Hi Ashay, I want to book a ${typeLabel}. My details: ${details}. Contact: ${whatsapp}`;
    
    const finalUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(messageTemplate)}`;
    window.open(finalUrl, '_blank');
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
    <section id="booking-form" className="container" style={{ padding: '100px 20px' }}>
      <SectionHeading>Schedule Your Session</SectionHeading>
      
      <div style={{ 
        maxWidth: '600px', 
        margin: '40px auto 0',
        backgroundColor: '#FFFFFF',
        borderRadius: '12px',
        boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
        overflow: 'hidden',
        border: `1px solid ${theme.colors.outline}1A`
      }}>
        {/* Tabs */}
        <div style={{ display: 'flex' }}>
          <div style={tabStyle('online')} onClick={() => setBookingType('online')}>
            <StarMapIcon style={{ marginBottom: '4px' }} />
            <span style={{ fontSize: '0.9rem' }}>Online Consultation</span>
          </div>
          <div style={tabStyle('pooja')} onClick={() => setBookingType('pooja')}>
            <OmIcon style={{ marginBottom: '4px' }} />
            <span style={{ fontSize: '0.9rem' }}>Sacred Pooja</span>
          </div>
        </div>


        <form onSubmit={handleWhatsAppSubmit} style={{ padding: '40px' }}>
          <div style={{ marginBottom: '24px', opacity: 0.7, fontSize: '0.9rem', textAlign: 'center' }}>
            {bookingType === 'online' 
              ? "1-on-1 Zoom/WhatsApp calls for Birth Charts and Career guidance." 
              : "Rituals performed with tradition at our temple in Bhind."}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <label style={{ fontSize: '0.875rem', fontWeight: '600', display: 'block', marginBottom: '8px' }}>Name</label>
              <input 
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
              <label style={{ fontSize: '0.875rem', fontWeight: '600', display: 'block', marginBottom: '8px' }}>WhatsApp</label>
              <input 
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

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <label style={{ fontSize: '0.875rem', fontWeight: '600', display: 'block', marginBottom: '8px' }}>Birth Date</label>
              <input 
                type="date" 
                name="birthDate" 
                required 
                style={inputStyle}
                value={formData.birthDate}
                onChange={handleChange}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.875rem', fontWeight: '600', display: 'block', marginBottom: '8px' }}>Birth Time</label>
              <input 
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
            <label style={{ fontSize: '0.875rem', fontWeight: '600', display: 'block', marginBottom: '8px' }}>Birth Place</label>
            <input 
              type="text" 
              name="birthPlace" 
              placeholder="City, State" 
              required 
              style={inputStyle}
              value={formData.birthPlace}
              onChange={handleChange}
            />
          </div>

          {bookingType === 'pooja' && (
            <div style={{ 
              animation: 'fadeIn 0.5s ease',
              marginTop: '10px'
            }}>
              <label style={{ fontSize: '0.875rem', fontWeight: '600', display: 'block', marginBottom: '8px' }}>Purpose of Pooja</label>
              <textarea 
                name="poojaPurpose" 
                placeholder="Describe your requirement (e.g. Health, Wealth, Marriage)" 
                required={bookingType === 'pooja'}
                style={{ ...inputStyle, height: '80px', resize: 'none' }}
                value={formData.poojaPurpose}
                onChange={handleChange}
              />
            </div>
          )}

          <VedicButton type="submit" style={{ width: '100%', marginTop: '20px' }}>
            Confirm on WhatsApp
          </VedicButton>
        </form>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
};

export default BookingForm;
