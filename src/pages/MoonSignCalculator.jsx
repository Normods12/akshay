import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import LocationPicker from '../components/ui/LocationPicker';

const MOON_SIGN_TRAITS = {
  Mesha: "Aries moon indicates a courageous, energetic, and independent nature. You are driven, passionate, and quick to take initiative.",
  Vrishabha: "Taurus moon brings emotional stability, patience, and a love for comfort and luxury. You value security and are deeply loyal.",
  Mithuna: "Gemini moon reflects a curious, communicative, and adaptable mind. You thrive on intellectual stimulation and social interaction.",
  Karka: "Cancer moon denotes deep sensitivity, strong intuition, and a nurturing disposition. You are deeply connected to family and home.",
  Simha: "Leo moon indicates a warm, generous, and charismatic personality. You have a strong need for self-expression and appreciation.",
  Kanya: "Virgo moon brings an analytical, practical, and detail-oriented approach to life. You find comfort in order and helping others.",
  Tula: "Libra moon reflects a strong desire for harmony, balance, and companionship. You are diplomatic and appreciate beauty in all forms.",
  Vrishchika: "Scorpio moon indicates intense emotions, strong intuition, and a transformative nature. You seek depth and authenticity.",
  Dhanu: "Sagittarius moon brings an optimistic, adventurous, and philosophical outlook. You value freedom and are always seeking the truth.",
  Makara: "Capricorn moon denotes discipline, ambition, and a strong sense of responsibility. You are practical and value long-term security.",
  Kumbha: "Aquarius moon indicates an innovative, humanitarian, and independent spirit. You value intellectual freedom and social progress.",
  Meena: "Pisces moon reflects deep empathy, artistic sensitivity, and strong intuition. You are compassionate and spiritually inclined."
};

const MoonSignCalculator = () => {
  const { colors, themeMode } = useTheme();
  const [step, setStep] = useState('form');
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const [formData, setFormData] = useState({ name: '', dateOfBirth: '', timeOfBirth: '', birthPlace: '', locationObj: null });

  const updateForm = (key) => (val) => setFormData(prev => ({ ...prev, [key]: val }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.locationObj) {
      setError("Please select the exact birth city from the dropdown.");
      return;
    }
    setError('');
    setStep('loading');
    try {
      const payload = {
        name: formData.name,
        dateOfBirth: formData.dateOfBirth,
        timeOfBirth: formData.timeOfBirth,
        latitude: formData.locationObj.latitude,
        longitude: formData.locationObj.longitude,
        birthPlace: formData.locationObj.shortName || formData.birthPlace,
      };

      const res = await fetch('/api/kundali', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      
      if (!data.success) throw new Error(data.error);

      setResult({
        name: formData.name,
        moonSign: data.data.moonSign,
        nakshatra: data.data.nakshatra,
        moonSignLord: data.data.moonSignLord || 'Unknown',
        nakshatraLord: data.data.nakshatraLord || 'Unknown',
      });
      setStep('result');
    } catch (err) {
      setError(err.message || 'Calculation failed. Please try again.');
      setStep('form');
    }
  };

  const isDark = themeMode === 'dark';
  const cardBg = isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)';
  const border = `1px solid ${colors.outline}33`;

  const inputStyles = {
    padding: '12px 16px',
    borderRadius: '8px',
    border: `1px solid ${colors.outline}55`,
    backgroundColor: 'transparent',
    color: colors.text,
    fontFamily: 'var(--font-body)',
    fontSize: '1rem',
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box'
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ minHeight: 'calc(100vh - 80px)', backgroundColor: colors.surface, padding: '40px 20px' }}>
      <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
        
        {step === 'form' && (
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2rem, 4vw, 3rem)', color: colors.primary, marginBottom: '16px' }}>
              Moon Sign Calculator
            </h1>
            <p style={{ fontSize: '1.1rem', color: colors.text, opacity: 0.9 }}>
              Discover your Janam Rashi (Moon Sign) and Nakshatra by entering your exact birth details.
            </p>
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          {step === 'form' && (
            <motion.div key="form" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="glass-panel" style={{ padding: '40px', borderRadius: '24px', border, backgroundColor: 'var(--color-surface-variant)' }}>
              {error && <div style={{ padding: '16px', backgroundColor: '#F4433615', border: '1px solid #F4433655', color: '#F44336', borderRadius: '12px', marginBottom: '24px', textAlign: 'center', fontWeight: 600 }}>{error}</div>}
              
              <form style={{ display: 'flex', flexDirection: 'column', gap: '20px' }} onSubmit={handleSubmit}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '0.9rem', fontWeight: 600, color: colors.text }}>Name</label>
                  <input type="text" required placeholder="Your name" value={formData.name} onChange={e => updateForm('name')(e.target.value)} style={inputStyles} />
                </div>
                <div style={{ display: 'flex', gap: '15px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                    <label style={{ fontSize: '0.9rem', fontWeight: 600, color: colors.text }}>Date of Birth</label>
                    <input type="date" required value={formData.dateOfBirth} onChange={e => updateForm('dateOfBirth')(e.target.value)} style={inputStyles} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                    <label style={{ fontSize: '0.9rem', fontWeight: 600, color: colors.text }}>Time of Birth</label>
                    <input type="time" required value={formData.timeOfBirth} onChange={e => updateForm('timeOfBirth')(e.target.value)} style={inputStyles} />
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '0.9rem', fontWeight: 600, color: colors.text }}>Birth Place</label>
                  <LocationPicker required value={formData.birthPlace} onChange={updateForm('birthPlace')} onLocationSelect={updateForm('locationObj')} />
                </div>

                <button type="submit" style={{ padding: '16px', borderRadius: '30px', border: 'none', backgroundColor: colors.primary, color: '#fff', fontFamily: 'var(--font-heading)', fontSize: '1.2rem', fontWeight: 700, cursor: 'pointer', marginTop: '10px' }}>
                  Calculate Moon Sign
                </button>
              </form>
            </motion.div>
          )}

          {step === 'loading' && (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '40vh' }}>
              <div style={{ width: '50px', height: '50px', borderRadius: '50%', border: `4px solid ${colors.outline}33`, borderTopColor: colors.primary, animation: 'spin 1s linear infinite' }} />
              <div style={{ marginTop: '20px', fontSize: '1.2rem', color: colors.primary }}>Calculating...</div>
            </motion.div>
          )}

          {step === 'result' && result && (
            <motion.div key="result" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <button onClick={() => setStep('form')} style={{ alignSelf: 'flex-start', padding: '10px 20px', borderRadius: '8px', border, backgroundColor: 'transparent', color: colors.text, cursor: 'pointer', fontWeight: 600 }}>
                ← Calculate Another
              </button>

              <div style={{ padding: '40px', backgroundColor: cardBg, borderRadius: '24px', border, textAlign: 'center' }}>
                <h2 style={{ fontSize: '1.2rem', color: colors.text, opacity: 0.8, marginBottom: '20px' }}>{result.name}'s Moon Sign Details</h2>
                
                <div style={{ fontSize: '4rem', fontWeight: 800, color: colors.primary, fontFamily: 'var(--font-heading)', lineHeight: 1.2 }}>
                  {result.moonSign}
                </div>
                <div style={{ fontSize: '1.1rem', color: colors.text, opacity: 0.7, marginBottom: '40px' }}>
                  (Janam Rashi)
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', flexWrap: 'wrap', marginBottom: '40px' }}>
                  <div>
                    <div style={{ fontSize: '0.9rem', color: colors.text, opacity: 0.7 }}>Nakshatra</div>
                    <div style={{ fontSize: '1.3rem', fontWeight: 600, color: colors.text }}>{result.nakshatra}</div>
                  </div>
                </div>

                <div style={{ padding: '24px', backgroundColor: `${colors.primary}11`, borderRadius: '16px', border: `1px solid ${colors.primary}33`, textAlign: 'left', lineHeight: 1.6, color: colors.text }}>
                  <h3 style={{ margin: '0 0 10px 0', fontSize: '1.1rem', color: colors.primary }}>Astrological Traits</h3>
                  <p style={{ margin: 0 }}>{MOON_SIGN_TRAITS[result.moonSign] || "Your moon sign holds deep significance in Vedic astrology, governing your emotions and mind."}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
    </motion.div>
  );
};

export default MoonSignCalculator;
