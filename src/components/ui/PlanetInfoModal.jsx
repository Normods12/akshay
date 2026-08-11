import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';

const PLANET_DATA = {
  sun: {
    name: 'Surya (Sun)',
    sanskrit: 'सूर्य',
    color: '#FF6B00',
    glow: 'rgba(255,107,0,0.3)',
    gradient: 'linear-gradient(135deg, rgba(255,107,0,0.15), rgba(255,165,0,0.08))',
    icon: '/icons/sun.png',
    lines: [
      '🌟 Surya is the soul of the cosmos — the Atmakaraka — the significator of your inner self, ego, and life force.',
      '👑 It rules Leo (Simha Rashi) and is exalted in Aries, making it the most powerful planet in terms of authority and royalty.',
      '🏛️ A strong Sun blesses with government favor, leadership qualities, respect from superiors, and a powerful personality.',
      '🔥 Surya represents the father, the king, the physician, and the spiritual guru in Vedic tradition.',
      '⚡ Its Mahadasha lasts 6 years and can bring great rises in career if well-placed, or health struggles if afflicted.',
      '💎 Remedies: Offer red flowers and water to the Sun at sunrise; wear Ruby (Manik); chant the Aditya Hridayam daily.',
      '🕐 The first hour of Sunday (Surya Vara) is considered the most auspicious time for Sun-related endeavors.',
      '📿 Mantra: ॐ ह्रां ह्रीं ह्रौं सः सूर्याय नमः — chant 108 times at sunrise for blessings of health and clarity.',
    ]
  },
  moon: {
    name: 'Chandra (Moon)',
    sanskrit: 'चन्द्र',
    color: '#C9E8F0',
    glow: 'rgba(200,232,240,0.3)',
    gradient: 'linear-gradient(135deg, rgba(200,232,240,0.15), rgba(150,200,220,0.08))',
    icon: '/icons/moon.png',
    lines: [
      '🌙 Chandra is the mind — the Manas — governing emotions, intuition, memory, and our deepest subconscious patterns.',
      '🌊 It rules Cancer (Karka Rashi) and is exalted in Taurus, where its qualities of nourishment and stability shine most.',
      '👩 The Moon represents the mother, home, water, milk, emotions, the masses, and the rhythms of daily life.',
      '🌟 In Vedic astrology, the birth Moon sign (Janam Rashi) is considered more important than the Sun sign for daily life.',
      '🔮 A strong Moon grants emotional intelligence, excellent memory, good relationships with women, and a fertile imagination.',
      '⚡ Its Mahadasha lasts 10 years — often a period of travel, emotional growth, and connection to family and homeland.',
      '💎 Remedies: Offer milk and white flowers to the Moon on Mondays; wear Pearl (Moti); fast on Mondays.',
      '📿 Mantra: ॐ श्रां श्रीं श्रौं सः चन्द्रमसे नमः — chant 108 times on full moon nights for mental peace.',
    ]
  },
  mars: {
    name: 'Mangala (Mars)',
    sanskrit: 'मंगल',
    color: '#FF3333',
    glow: 'rgba(255,51,51,0.3)',
    gradient: 'linear-gradient(135deg, rgba(255,51,51,0.15), rgba(200,0,0,0.08))',
    icon: '/icons/mars.png',
    lines: [
      '🔴 Mangala is the warrior planet — governing energy, courage, aggression, passion, and the capacity for decisive action.',
      '🏠 It rules Aries (Mesha) and Scorpio (Vrishchika) and is exalted in Capricorn, where discipline channels its energy.',
      '⚔️ Mars represents brothers, soldiers, surgeons, engineers, land, and property in the Vedic framework.',
      '💥 Mangal Dosha — formed when Mars occupies the 1st, 4th, 7th, 8th, or 12th house — can affect marriage compatibility.',
      '🌋 A strong Mars gives athletic ability, fearlessness, sharp logic, and success in competitive environments.',
      '🧰 Mars rules blood, the muscular system, and accidents — its affliction can cause injuries, inflammation, or disputes.',
      '💎 Remedies: Offer red lentils (masoor dal) to Hanuman Ji on Tuesdays; wear Coral (Moonga); fast on Tuesdays.',
      '📿 Mantra: ॐ क्रां क्रीं क्रौं सः भौमाय नमः — chant 108 times on Tuesdays for courage and conflict resolution.',
    ]
  },
  mercury: {
    name: 'Budha (Mercury)',
    sanskrit: 'बुध',
    color: '#00E676',
    glow: 'rgba(0,230,118,0.3)',
    gradient: 'linear-gradient(135deg, rgba(0,230,118,0.15), rgba(0,180,80,0.08))',
    icon: '/icons/mercury.png',
    lines: [
      '🟢 Budha is the planet of intellect — governing logic, communication, trade, learning, and analytical thinking.',
      '💼 It rules Gemini (Mithuna) and Virgo (Kanya) and is exalted in Virgo, where its analytical nature is at its peak.',
      '📚 Mercury represents students, teachers, traders, writers, accountants, and those who work with information.',
      '🗣️ A strong Mercury bestows eloquence, mathematical genius, quick wit, and the ability to master multiple languages.',
      '✍️ Budha governs the nervous system, skin, respiratory tract, and all communication pathways in the body.',
      '🤝 Retrograde Mercury can cause delays in contracts, communication errors, and technological issues — review carefully.',
      '💎 Remedies: Donate green vegetables on Wednesdays; wear Emerald (Panna); feed green grass to cows.',
      '📿 Mantra: ॐ ब्रां ब्रीं ब्रौं सः बुधाय नमः — chant 108 times on Wednesdays for clarity and business success.',
    ]
  },
  jupiter: {
    name: 'Guru (Jupiter)',
    sanskrit: 'गुरु',
    color: '#FFD700',
    glow: 'rgba(255,215,0,0.3)',
    gradient: 'linear-gradient(135deg, rgba(255,215,0,0.15), rgba(200,160,0,0.08))',
    icon: '/icons/jupiter.png',
    lines: [
      '✨ Guru is the greatest benefic — the divine teacher who bestows wisdom, dharma, expansion, and abundant blessings.',
      '🌈 It rules Sagittarius (Dhanu) and Pisces (Meena) and is exalted in Cancer, where its nurturing wisdom flourishes.',
      '🙏 Jupiter represents the guru, priests, judges, philosophers, banks, wealth, children, and higher knowledge.',
      '📖 A strong Jupiter grants deep spiritual wisdom, financial abundance, a righteous character, and good fortune in all areas.',
      '🌍 Jupiter takes approximately one year to transit each sign, bringing growth and opportunity to the houses it touches.',
      '👶 Jupiter is the primary significator (Karaka) for children, marriage for women, wealth, and higher education.',
      '💎 Remedies: Offer yellow flowers and turmeric to Lord Vishnu on Thursdays; wear Yellow Sapphire (Pukhraj).',
      '📿 Mantra: ॐ ग्रां ग्रीं ग्रौं सः गुरवे नमः — chant 108 times on Thursdays for wisdom and prosperity.',
    ]
  },
  venus: {
    name: 'Shukra (Venus)',
    sanskrit: 'शुक्र',
    color: '#FF69B4',
    glow: 'rgba(255,105,180,0.3)',
    gradient: 'linear-gradient(135deg, rgba(255,105,180,0.15), rgba(200,50,130,0.08))',
    icon: '/icons/venus.png',
    lines: [
      '💫 Shukra is the planet of love, beauty, and luxury — governing relationships, art, music, fashion, and sensory pleasure.',
      '💖 It rules Taurus (Vrishabha) and Libra (Tula) and is exalted in Pisces, where its compassion and devotion peak.',
      '🎨 Venus represents the wife (in a man\'s chart), artistic talent, vehicles, jewelry, perfume, and material comforts.',
      '🌹 A strong Venus blesses with charisma, aesthetic sensitivity, a loving nature, and success in creative fields.',
      '💃 Shukra governs the reproductive system, kidneys, and skin — its affliction can bring issues in relationships and health.',
      '🌟 Venus is the Guru (preceptor) of the Asuras in Vedic mythology — it holds the secret of bringing life back.',
      '💎 Remedies: Offer white flowers to Goddess Lakshmi on Fridays; wear Diamond or White Sapphire; wear white clothing.',
      '📿 Mantra: ॐ द्रां द्रीं द्रौं सः शुक्राय नमः — chant 108 times on Fridays for love and artistic success.',
    ]
  },
  saturn: {
    name: 'Shani (Saturn)',
    sanskrit: 'शनि',
    color: '#9C27B0',
    glow: 'rgba(156,39,176,0.3)',
    gradient: 'linear-gradient(135deg, rgba(156,39,176,0.15), rgba(100,0,130,0.08))',
    icon: '/icons/saturn.png',
    lines: [
      '⚖️ Shani is the cosmic judge — the great karmic teacher who brings discipline, delays, and ultimately, profound wisdom.',
      '🏔️ It rules Capricorn (Makara) and Aquarius (Kumbha) and is exalted in Libra, where justice is most perfectly served.',
      '👷 Saturn represents laborers, servants, the elderly, iron, oil, coal, and all things that require long-term patience.',
      '🌑 Sade Sati — Saturn\'s 7.5 year transit over your Moon sign — is often a period of intense lessons and transformation.',
      '⏳ A well-placed Saturn grants extraordinary discipline, political power, longevity, and the ability to build lasting structures.',
      '🧘 Shani teaches us that nothing worthwhile comes without effort — it rewards sincerity and punishes shortcuts.',
      '💎 Remedies: Donate black sesame seeds and mustard oil on Saturdays; wear Blue Sapphire (Neelam) with great care.',
      '📿 Mantra: ॐ प्रां प्रीं प्रौं सः शनैश्चराय नमः — chant 108 times on Saturdays for karmic relief and protection.',
    ]
  },
  rahu: {
    name: 'Rahu (North Node)',
    sanskrit: 'राहु',
    color: '#00BCD4',
    glow: 'rgba(0,188,212,0.3)',
    gradient: 'linear-gradient(135deg, rgba(0,188,212,0.15), rgba(0,130,160,0.08))',
    icon: '/icons/north-node.png',
    lines: [
      '🌑 Rahu is the head of the cosmic serpent — a shadow planet (chayagraha) with no physical form but immense karmic power.',
      '🎭 It is the planet of illusion, obsession, worldly desire, technology, and the breaking of social conventions.',
      '🌍 Rahu governs foreign lands, unconventional thinking, sudden events, outcastes, and the rise to power through unusual means.',
      '⚡ A strong Rahu can catapult someone to sudden fame and fortune — but always accompanied by hidden tests and karmic debts.',
      '🔮 Rahu amplifies whatever it touches — it can magnify both the blessings and the challenges of planets it conjoins.',
      '✈️ Rahu is the karaka for foreign travel, immigration, outcaste professions, and careers in media and technology.',
      '💎 Remedies: Donate hessonite garnet offerings on Saturdays; wear Gomed (Hessonite); chant the Durga Kavacham.',
      '📿 Mantra: ॐ भ्रां भ्रीं भ्रौं सः राहवे नमः — chant 108 times on Saturdays for protection from illusions and sudden setbacks.',
    ]
  },
  ketu: {
    name: 'Ketu (South Node)',
    sanskrit: 'केतु',
    color: '#FF9800',
    glow: 'rgba(255,152,0,0.3)',
    gradient: 'linear-gradient(135deg, rgba(255,152,0,0.15), rgba(200,100,0,0.08))',
    icon: '/icons/south-node.png',
    lines: [
      '🌠 Ketu is the tail of the cosmic serpent — the planet of past-life karma, spirituality, and ultimate liberation (Moksha).',
      '🧘 It represents detachment, intuition, psychic ability, renunciation, and the fruits of accumulated past-life wisdom.',
      '🔥 Ketu burns away material attachments, bringing sudden separations that ultimately serve one\'s spiritual evolution.',
      '🌀 A strong Ketu gives spiritual insight, healing abilities, mastery over the occult, and liberation from karmic cycles.',
      '🏛️ Ketu rules mathematics, computers, healing, spirituality, and the deep arts of the inner world.',
      '⚡ When conjunct with powerful planets, Ketu can give sudden moksha-like events — both losses and profound awakenings.',
      '💎 Remedies: Offer sesame seeds and donate blankets on Tuesdays and Saturdays; wear Cat\'s Eye (Lehsunia).',
      '📿 Mantra: ॐ स्त्रां स्त्रीं स्त्रौं सः केतवे नमः — chant 108 times for spiritual growth and karmic healing.',
    ]
  },
};

export default function PlanetInfoModal({ planetId, onClose, onBookService }) {
  const planet = PLANET_DATA[planetId];

  const handleBook = () => {
    onClose();
    if (onBookService) {
      onBookService({
        title: `${planet ? planet.name : 'Planetary'} Consultation`,
        price: '₹2,100',
        category: 'Planetary Remedies',
      });
    }
  };

  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  if (!planet) return null;

  return ReactDOM.createPortal(
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, zIndex: 99998,
          backgroundColor: 'rgba(0,0,0,0.82)',
          backdropFilter: 'blur(10px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '20px',
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', damping: 22, stiffness: 280 }}
          onClick={(e) => e.stopPropagation()}
          style={{
            background: `linear-gradient(145deg, #0a0a0a 0%, #141414 50%, #0d0d0d 100%)`,
            border: `1px solid ${planet.color}44`,
            borderRadius: '24px',
            padding: '0',
            maxWidth: '620px',
            width: '100%',
            maxHeight: '90vh',
            overflow: 'hidden',
            display: 'flex', flexDirection: 'column',
            boxShadow: `0 40px 80px rgba(0,0,0,0.9), 0 0 80px ${planet.glow}`,
          }}
        >
          {/* Header */}
          <div style={{
            padding: '32px 32px 24px',
            background: planet.gradient,
            borderBottom: `1px solid ${planet.color}22`,
            display: 'flex', alignItems: 'center', gap: '20px',
            position: 'relative',
          }}>
            {/* Planet image */}
            <div style={{
              width: '72px', height: '72px', flexShrink: 0,
              filter: `drop-shadow(0 0 20px ${planet.glow})`,
            }}>
              <img src={planet.icon} alt={planet.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            </div>

            <div>
              <div style={{ fontSize: '1.5rem', color: planet.color, fontFamily: 'var(--font-body)', marginBottom: '4px' }}>
                {planet.sanskrit}
              </div>
              <h2 style={{
                fontFamily: 'var(--font-heading)', fontSize: '1.6rem',
                color: '#ffffff', margin: 0, lineHeight: 1.1,
              }}>
                {planet.name}
              </h2>
            </div>

            {/* Close */}
            <button
              onClick={onClose}
              style={{
                position: 'absolute', top: '16px', right: '16px',
                background: 'rgba(255,255,255,0.08)', border: `1px solid ${planet.color}33`,
                borderRadius: '50%', width: '36px', height: '36px',
                color: 'rgba(255,255,255,0.6)', cursor: 'pointer',
                fontSize: '1.2rem', lineHeight: 1, display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = `${planet.color}22`; e.currentTarget.style.color = '#fff'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = 'rgba(255,255,255,0.6)'; }}
            >
              ×
            </button>
          </div>

          {/* Content */}
          <div style={{ padding: '28px 32px 32px', overflowY: 'auto', flex: 1 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {planet.lines.map((line, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06, duration: 0.35 }}
                  style={{
                    display: 'flex', gap: '12px', alignItems: 'flex-start',
                    padding: '12px 16px', borderRadius: '12px',
                    background: i % 2 === 0 ? `${planet.color}08` : 'transparent',
                    border: i % 2 === 0 ? `1px solid ${planet.color}15` : '1px solid transparent',
                  }}
                >
                  <div style={{
                    width: '4px', height: '4px', borderRadius: '50%',
                    backgroundColor: planet.color, flexShrink: 0, marginTop: '8px',
                    boxShadow: `0 0 8px ${planet.glow}`,
                  }} />
                  <p style={{
                    color: 'rgba(255,255,255,0.82)', fontSize: '0.92rem',
                    lineHeight: 1.65, margin: 0, fontFamily: 'var(--font-body)',
                  }}>
                    {line}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Book consultation CTA */}
            <motion.button
              onClick={handleBook}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              style={{
                display: 'block', width: '100%', marginTop: '24px',
                padding: '14px 24px', borderRadius: '14px', textAlign: 'center',
                background: `linear-gradient(135deg, ${planet.color}, ${planet.color}99)`,
                color: '#000', fontFamily: 'var(--font-heading)',
                fontWeight: 700, fontSize: '0.95rem', border: 'none', cursor: 'pointer',
                boxShadow: `0 8px 30px ${planet.glow}`,
              }}
            >
              📅 Book {planet.name} Consultation
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
}
