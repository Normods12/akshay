import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

const MatchReport = ({ result }) => {
  const { colors, themeMode } = useTheme();
  const isDark = themeMode === 'dark';

  const { boy, girl, ashtakoot, manglikMatch, rajjooDosha, vedhaDosha } = result;

  const gold = isDark ? '#D4AF37' : '#B8860B';
  const cardBg = isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)';
  const border = `1px solid ${colors.outline}33`;

  const totalPoints = ashtakoot.total;
  let verdict = '';
  let color = '';
  if (totalPoints >= 25) { verdict = 'Excellent Match'; color = '#4CAF50'; }
  else if (totalPoints >= 18) { verdict = 'Good Match'; color = '#8BC34A'; }
  else { verdict = 'Not Recommended'; color = '#F44336'; }

  const renderDetailsTable = (title, data) => (
    <div style={{ flex: 1, border, borderRadius: '16px', overflow: 'hidden', backgroundColor: cardBg }}>
      <div style={{ padding: '12px 16px', backgroundColor: `${gold}22`, borderBottom: border, fontWeight: 700, color: gold, fontFamily: 'var(--font-heading)' }}>
        {title}
      </div>
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {[
          ['Name', data.name],
          ['Date of Birth', data.dateOfBirth],
          ['Time of Birth', data.timeOfBirth],
          ['Birth Place', data.birthPlace],
          ['Janam Rashi', data.moonSign],
          ['Rashi Lord', data.moonSignLord],
          ['Janam Nakshatra', data.nakshatra],
          ['Nakshatra Lord', data.nakshatraLord],
        ].map(([label, value], i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', borderBottom: i < 7 ? border : 'none', paddingBottom: '6px' }}>
            <span style={{ color: colors.text, opacity: 0.7 }}>{label}</span>
            <span style={{ color: colors.text, fontWeight: 600, textAlign: 'right' }}>{value}</span>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      
      {/* Overview Score */}
      <div style={{ textAlign: 'center', padding: '30px', backgroundColor: cardBg, borderRadius: '24px', border }}>
        <h2 style={{ fontFamily: 'var(--font-heading)', color: colors.primary, marginBottom: '10px' }}>Ashtakoot Milan Result</h2>
        <div style={{ fontSize: '3rem', fontWeight: 800, color: gold, fontFamily: 'var(--font-heading)' }}>
          {totalPoints} / 36
        </div>
        <div style={{ fontSize: '1.2rem', color, fontWeight: 700, marginTop: '10px' }}>{verdict}</div>
      </div>

      {/* Basic Details */}
      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        {renderDetailsTable('Basic Details of - Male', boy)}
        {renderDetailsTable('Basic Details of - Female', girl)}
      </div>

      {/* Doshas & Conclusions */}
      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, padding: '20px', backgroundColor: cardBg, borderRadius: '16px', border, textAlign: 'center' }}>
          <h3 style={{ color: colors.text, marginBottom: '8px', fontSize: '1rem' }}>Manglik Match</h3>
          <div style={{ color: manglikMatch ? '#4CAF50' : '#F44336', fontWeight: 700, fontSize: '1.2rem' }}>
            {manglikMatch ? 'Yes (Compatible)' : 'No (Mismatch)'}
          </div>
          <div style={{ fontSize: '0.85rem', opacity: 0.7, marginTop: '10px' }}>
            The Boy is {boy.isManglik ? '' : 'Not'} a Manglik. The Girl is {girl.isManglik ? '' : 'Not'} a Manglik.
          </div>
        </div>

        <div style={{ flex: 1, padding: '20px', backgroundColor: cardBg, borderRadius: '16px', border, textAlign: 'center' }}>
          <h3 style={{ color: colors.text, marginBottom: '8px', fontSize: '1rem' }}>Rajjoo Dosha</h3>
          <div style={{ color: rajjooDosha ? '#F44336' : '#4CAF50', fontWeight: 700, fontSize: '1.2rem' }}>
            {rajjooDosha ? 'Yes (Present)' : 'No'}
          </div>
        </div>

        <div style={{ flex: 1, padding: '20px', backgroundColor: cardBg, borderRadius: '16px', border, textAlign: 'center' }}>
          <h3 style={{ color: colors.text, marginBottom: '8px', fontSize: '1rem' }}>Vedha Dosha</h3>
          <div style={{ color: vedhaDosha ? '#F44336' : '#4CAF50', fontWeight: 700, fontSize: '1.2rem' }}>
            {vedhaDosha ? 'Yes (Present)' : 'No'}
          </div>
        </div>
      </div>

      <div style={{ padding: '20px', backgroundColor: `${gold}11`, borderRadius: '16px', border: `1px solid ${gold}44`, fontSize: '1rem', lineHeight: 1.6, textAlign: 'center', color: colors.text }}>
        {totalPoints >= 18 && manglikMatch && !rajjooDosha 
          ? "All factors are conducive for the match. The couple can go ahead with this alliance."
          : "There are conflicting factors in this match. Please consult an astrologer for remedies before proceeding."}
      </div>

      {/* Ashtakoot Details Table */}
      <div style={{ overflowX: 'auto', borderRadius: '16px', border }}>
        <table style={{ width: '100%', minWidth: '800px', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: `${gold}22`, borderBottom: border }}>
              <th style={{ padding: '16px', color: gold, fontFamily: 'var(--font-heading)' }}>Attribute</th>
              <th style={{ padding: '16px', color: gold, fontFamily: 'var(--font-heading)' }}>Male</th>
              <th style={{ padding: '16px', color: gold, fontFamily: 'var(--font-heading)' }}>Female</th>
              <th style={{ padding: '16px', color: gold, fontFamily: 'var(--font-heading)' }}>Out of</th>
              <th style={{ padding: '16px', color: gold, fontFamily: 'var(--font-heading)' }}>Received</th>
              <th style={{ padding: '16px', color: gold, fontFamily: 'var(--font-heading)' }}>Area of Life</th>
            </tr>
          </thead>
          <tbody>
            {ashtakoot.kootas.map((koota, i) => (
              <tr key={i} style={{ borderBottom: i < 7 ? border : 'none', backgroundColor: i % 2 === 0 ? 'transparent' : cardBg }}>
                <td style={{ padding: '16px', fontWeight: 600, color: colors.text }}>{koota.attribute}</td>
                <td style={{ padding: '16px', color: colors.text, opacity: 0.9 }}>{koota.male}</td>
                <td style={{ padding: '16px', color: colors.text, opacity: 0.9 }}>{koota.female}</td>
                <td style={{ padding: '16px', color: colors.text, fontWeight: 600 }}>{koota.outOf}</td>
                <td style={{ padding: '16px', color: koota.received > 0 ? '#4CAF50' : '#F44336', fontWeight: 700 }}>{koota.received}</td>
                <td style={{ padding: '16px', color: colors.text, opacity: 0.7, fontSize: '0.9rem' }}>{koota.area}</td>
              </tr>
            ))}
            <tr style={{ backgroundColor: `${gold}33`, borderTop: `2px solid ${gold}66` }}>
              <td colSpan="3" style={{ padding: '16px', fontWeight: 800, color: colors.text, textAlign: 'right' }}>Total Points</td>
              <td style={{ padding: '16px', fontWeight: 800, color: colors.text }}>36</td>
              <td style={{ padding: '16px', fontWeight: 800, color: colors.primary, fontSize: '1.2rem' }}>{totalPoints}</td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>

    </motion.div>
  );
};

export default MatchReport;
