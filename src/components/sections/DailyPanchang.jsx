import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { Sun, Moon, Calendar, MapPin } from 'lucide-react';
import SectionHeading from '../ui/SectionHeading';

const DailyPanchang = () => {
  const { colors, themeMode } = useTheme();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPanchang = async () => {
      try {
        const res = await fetch('/api/panchang/today');
        const result = await res.json();
        if (result.success) setData(result.data);
        else setError(result.error);
      } catch (err) {
        setError('Failed to load Daily Panchang');
      } finally {
        setLoading(false);
      }
    };
    fetchPanchang();
  }, []);

  const isDark = themeMode === 'dark';
  const cardBg = isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)';
  const border = `1px solid ${colors.outline}33`;

  if (loading) return null;
  if (error || !data) return null;

  const { panchang, date, moonSign } = data;

  return (
    <section className="container" style={{ marginTop: '60px', marginBottom: '80px' }}>
      <SectionHeading>Today's Panchang</SectionHeading>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        style={{
          marginTop: '40px',
          background: `linear-gradient(135deg, ${colors.primary}11 0%, ${colors.secondary}11 100%)`,
          border: `1px solid ${colors.primary}33`,
          borderRadius: '24px',
          padding: '30px',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ background: colors.primary, color: '#fff', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Calendar size={24} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.2rem', fontFamily: 'var(--font-heading)', color: colors.text }}>{panchang.vara}</h3>
              <p style={{ margin: 0, fontSize: '0.9rem', color: colors.text, opacity: 0.7 }}>{new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: colors.text, opacity: 0.8, fontSize: '0.9rem' }}>
            <MapPin size={16} color={colors.primary} /> Default Location: New Delhi
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          
          <div style={{ padding: '16px', background: cardBg, borderRadius: '16px', border }}>
            <div style={{ fontSize: '0.85rem', color: colors.text, opacity: 0.7, marginBottom: '4px' }}>Tithi</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 600, color: colors.text }}>{panchang.tithi}</div>
            <div style={{ fontSize: '0.8rem', color: colors.primary, marginTop: '4px' }}>{panchang.paksha}</div>
          </div>

          <div style={{ padding: '16px', background: cardBg, borderRadius: '16px', border }}>
            <div style={{ fontSize: '0.85rem', color: colors.text, opacity: 0.7, marginBottom: '4px' }}>Nakshatra</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 600, color: colors.text }}>{panchang.nakshatra}</div>
            <div style={{ fontSize: '0.8rem', color: colors.primary, marginTop: '4px' }}>Lord: {panchang.nakshatraLord}</div>
          </div>

          <div style={{ padding: '16px', background: cardBg, borderRadius: '16px', border }}>
            <div style={{ fontSize: '0.85rem', color: colors.text, opacity: 0.7, marginBottom: '4px' }}>Yoga & Karana</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 600, color: colors.text }}>{panchang.yoga}</div>
            <div style={{ fontSize: '0.8rem', color: colors.primary, marginTop: '4px' }}>Karana: {panchang.karana}</div>
          </div>

          <div style={{ padding: '16px', background: cardBg, borderRadius: '16px', border }}>
            <div style={{ fontSize: '0.85rem', color: colors.text, opacity: 0.7, marginBottom: '4px' }}>Moon Sign (Rashi)</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 600, color: colors.text }}>{moonSign}</div>
            <div style={{ fontSize: '0.8rem', color: colors.primary, marginTop: '4px' }}>Phase: {panchang.moonPhase}</div>
          </div>

        </div>

      </motion.div>
    </section>
  );
};

export default DailyPanchang;
