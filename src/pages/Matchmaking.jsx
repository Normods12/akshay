import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import LocationPicker from '../components/ui/LocationPicker';
import { calculateMatch, calculateNameMatch } from '../utils/matchCalculator';
import MatchReport from '../components/ui/MatchReport';

const Matchmaking = () => {
  const { colors, themeMode } = useTheme();
  const [step, setStep] = useState('form');
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const [boyData, setBoyData] = useState({ name: '', dateOfBirth: '', timeOfBirth: '', birthPlace: '', locationObj: null });
  const [girlData, setGirlData] = useState({ name: '', dateOfBirth: '', timeOfBirth: '', birthPlace: '', locationObj: null });

  const [boyNameData, setBoyNameData] = useState({ name: '' });
  const [girlNameData, setGirlNameData] = useState({ name: '' });

  const updateBoy = useCallback((key) => (val) => setBoyData(prev => ({ ...prev, [key]: val })), []);
  const updateGirl = useCallback((key) => (val) => setGirlData(prev => ({ ...prev, [key]: val })), []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!boyData.locationObj || !girlData.locationObj) {
      setError("Please select the exact birth city for both individuals from the dropdown.");
      return;
    }
    setError('');
    setStep('loading');
    try {
      const data = await calculateMatch({ boy: boyData, girl: girlData });
      setResult(data);
      setStep('result');
    } catch (err) {
      setError(err.message || 'Calculation failed. Please try again.');
      setStep('form');
    }
  };

  const handleNameSubmit = async (e) => {
    e.preventDefault();
    if (!boyNameData.name || !girlNameData.name) {
      setError("Please enter names for both individuals.");
      return;
    }
    setError('');
    setStep('loading');
    try {
      // Simulate network delay for effect
      await new Promise(r => setTimeout(r, 800));
      const data = calculateNameMatch({ boy: boyNameData, girl: girlNameData });
      setResult(data);
      setStep('result');
    } catch (err) {
      setError(err.message || 'Calculation failed. Please try again.');
      setStep('form');
    }
  };

  const reset = () => {
    setStep('form');
    setResult(null);
    setError('');
  };

  const isDark = themeMode === 'dark';
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
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}
      style={{ position: 'relative', minHeight: 'calc(100vh - 80px)', backgroundColor: colors.surface, padding: '40px 20px' }}
    >
      <div className="container" style={{ position: 'relative', zIndex: 1, maxWidth: '1000px', margin: '0 auto' }}>
        
        {step === 'form' && (
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6 }} style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2rem, 4vw, 3rem)', color: colors.primary, lineHeight: 1.2, marginBottom: '16px' }}>
              Free Kundli Matching
            </h1>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '1.1rem', color: colors.text, opacity: 0.9, maxWidth: '600px', margin: '0 auto' }}>
              Check your marriage compatibility instantly with accurate Ashtakoot Guna Milan and detailed relationship insights.
            </p>
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          {step === 'form' && (
            <motion.div key="form" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
              {error && (
                <div style={{ padding: '16px', backgroundColor: '#F4433615', border: '1px solid #F4433655', color: '#F44336', borderRadius: '12px', textAlign: 'center', fontWeight: 600 }}>
                  {error}
                </div>
              )}
              
              {/* Form 1: Match by DOB */}
              <div className="glass-panel matchmaking-card" style={{ padding: '40px', borderRadius: '24px', border: `1px solid ${colors.outline}33`, backgroundColor: 'var(--color-surface-variant)', boxShadow: '0 20px 50px rgba(0,0,0,0.05)' }}>
                <h2 style={{ fontFamily: 'var(--font-heading)', color: colors.primary, marginBottom: '24px', textAlign: 'center' }}>Matchmaking by Date of Birth</h2>
                <form className="matchmaking-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px' }} onSubmit={handleSubmit}>
                  
                  {/* Boy's Details */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <h3 style={{ fontFamily: 'var(--font-heading)', color: colors.primary, borderBottom: `1px solid ${colors.outline}33`, paddingBottom: '10px' }}>Boy's Details</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <label style={{ fontSize: '0.9rem', fontWeight: 600, color: colors.text }}>Name</label>
                      <input type="text" required placeholder="Boy's name" value={boyData.name} onChange={e => updateBoy('name')(e.target.value)} style={inputStyles} />
                    </div>
                    <div className="matchmaking-row" style={{ display: 'flex', gap: '15px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                        <label style={{ fontSize: '0.9rem', fontWeight: 600, color: colors.text }}>Date of Birth</label>
                        <input type="date" required value={boyData.dateOfBirth} onChange={e => updateBoy('dateOfBirth')(e.target.value)} style={inputStyles} />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                        <label style={{ fontSize: '0.9rem', fontWeight: 600, color: colors.text }}>Time of Birth</label>
                        <input type="time" required value={boyData.timeOfBirth} onChange={e => updateBoy('timeOfBirth')(e.target.value)} style={inputStyles} />
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <label style={{ fontSize: '0.9rem', fontWeight: 600, color: colors.text }}>Birth Place</label>
                      <LocationPicker required value={boyData.birthPlace} onChange={updateBoy('birthPlace')} onLocationSelect={updateBoy('locationObj')} />
                    </div>
                  </div>

                  {/* Girl's Details */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <h3 style={{ fontFamily: 'var(--font-heading)', color: colors.primary, borderBottom: `1px solid ${colors.outline}33`, paddingBottom: '10px' }}>Girl's Details</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <label style={{ fontSize: '0.9rem', fontWeight: 600, color: colors.text }}>Name</label>
                      <input type="text" required placeholder="Girl's name" value={girlData.name} onChange={e => updateGirl('name')(e.target.value)} style={inputStyles} />
                    </div>
                    <div className="matchmaking-row" style={{ display: 'flex', gap: '15px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                        <label style={{ fontSize: '0.9rem', fontWeight: 600, color: colors.text }}>Date of Birth</label>
                        <input type="date" required value={girlData.dateOfBirth} onChange={e => updateGirl('dateOfBirth')(e.target.value)} style={inputStyles} />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                        <label style={{ fontSize: '0.9rem', fontWeight: 600, color: colors.text }}>Time of Birth</label>
                        <input type="time" required value={girlData.timeOfBirth} onChange={e => updateGirl('timeOfBirth')(e.target.value)} style={inputStyles} />
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <label style={{ fontSize: '0.9rem', fontWeight: 600, color: colors.text }}>Birth Place</label>
                      <LocationPicker required value={girlData.birthPlace} onChange={updateGirl('birthPlace')} onLocationSelect={updateGirl('locationObj')} />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                    <button type="submit" style={{ padding: '16px 48px', borderRadius: '30px', border: 'none', backgroundColor: colors.primary, color: '#FFFFFF', fontFamily: 'var(--font-heading)', fontSize: '1.2rem', fontWeight: 700, cursor: 'pointer', transition: 'all 0.3s', boxShadow: '0 8px 20px rgba(0,0,0,0.15)' }}>
                      Match by DOB
                    </button>
                  </div>
                </form>
              </div>

              {/* Form 2: Match by Name */}
              <div className="glass-panel matchmaking-card" style={{ padding: '40px', borderRadius: '24px', border: `1px solid ${colors.outline}33`, backgroundColor: 'var(--color-surface-variant)', boxShadow: '0 20px 50px rgba(0,0,0,0.05)' }}>
                <h2 style={{ fontFamily: 'var(--font-heading)', color: colors.primary, marginBottom: '24px', textAlign: 'center' }}>Matchmaking by Name</h2>
                <form className="matchmaking-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px' }} onSubmit={handleNameSubmit}>

                  
                  {/* Boy's Details */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <h3 style={{ fontFamily: 'var(--font-heading)', color: colors.primary, borderBottom: `1px solid ${colors.outline}33`, paddingBottom: '10px' }}>Boy's Details</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <label style={{ fontSize: '0.9rem', fontWeight: 600, color: colors.text }}>Boy's Name</label>
                      <input type="text" required placeholder="Enter boy's full name" value={boyNameData.name} onChange={e => setBoyNameData({ name: e.target.value })} style={inputStyles} />
                    </div>
                  </div>

                  {/* Girl's Details */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <h3 style={{ fontFamily: 'var(--font-heading)', color: colors.primary, borderBottom: `1px solid ${colors.outline}33`, paddingBottom: '10px' }}>Girl's Details</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <label style={{ fontSize: '0.9rem', fontWeight: 600, color: colors.text }}>Girl's Name</label>
                      <input type="text" required placeholder="Enter girl's full name" value={girlNameData.name} onChange={e => setGirlNameData({ name: e.target.value })} style={inputStyles} />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                    <button type="submit" style={{ padding: '16px 48px', borderRadius: '30px', border: 'none', backgroundColor: colors.primary, color: '#FFFFFF', fontFamily: 'var(--font-heading)', fontSize: '1.2rem', fontWeight: 700, cursor: 'pointer', transition: 'all 0.3s', boxShadow: '0 8px 20px rgba(0,0,0,0.15)' }}>
                      Match by Name
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          )}

          {step === 'loading' && (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
              <div style={{ width: '60px', height: '60px', borderRadius: '50%', border: `4px solid ${colors.outline}33`, borderTopColor: colors.primary, animation: 'spin 1s linear infinite' }} />
              <div style={{ marginTop: '24px', fontFamily: 'var(--font-heading)', fontSize: '1.5rem', color: colors.primary }}>Aligning the stars...</div>
              <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
            </motion.div>
          )}

          {step === 'result' && result && (
            <motion.div key="result" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <button onClick={reset} style={{ padding: '10px 24px', borderRadius: '8px', border: `1px solid ${colors.outline}`, backgroundColor: 'transparent', color: colors.text, cursor: 'pointer', marginBottom: '30px', fontFamily: 'var(--font-body)', fontWeight: 600 }}>
                ← Calculate Another
              </button>
              <MatchReport result={result} />
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </motion.div>
  );
};

export default Matchmaking;
