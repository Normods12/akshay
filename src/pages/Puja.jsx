import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { ShieldCheck, ChevronDown, ChevronUp } from 'lucide-react';
import MandalaArt from '../components/ui/MandalaArt';

const pujas = [
  {
    title: 'Navagraha Shanti Puja',
    price: '₹31,000',
    image: '/images/puja_navagraha.png',
    category: 'Planetary Remedies',
    description: 'Balance the cosmic energies of all 9 planets (Navagrahas) through sacred rituals and mantras. This comprehensive puja addresses planetary doshas and brings peace, prosperity and harmony into all aspects of life.',
    benefits: ['Neutralizes planetary afflictions', 'Brings peace and prosperity', 'Improves health and relationships', 'Complete 9-planet worship'],
  },
  {
    title: 'Navagraha Homa (Fire Ritual)',
    price: '₹11,000',
    image: '/images/puja_homa.png',
    category: 'Homa Rituals',
    description: 'Sacred fire ritual (Havan/Homa) performed specifically for all nine planetary deities. The sacred fire carries your prayers directly to the divine, purifying karma and inviting planetary blessings.',
    benefits: ['Purifies negative karma', 'Direct divine connection', 'Powerful planetary appeasement', 'Fire as sacred messenger'],
  },
  {
    title: 'Individual Graha Shanti Puja',
    price: '₹11,000/planet',
    image: '/images/puja_navagraha.png',
    category: 'Individual Planet',
    description: 'Targeted puja for a specific planet causing affliction in your horoscope. Available for Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn, Rahu, and Ketu. Each puja is customized based on your birth chart analysis.',
    benefits: ['Targeted planetary remedy', 'Customized for your chart', 'All 9 planets available', 'Expert Pandit guidance'],
  },
  {
    title: 'Maha Mrityunjaya Japa & Homa',
    price: '₹1,00,000',
    image: '/images/puja_homa.png',
    category: 'Supreme Rituals',
    description: 'The most powerful Vedic ritual for health, longevity, and overcoming life-threatening situations. 125,000 Maha Mrityunjaya mantra chanting combined with a sacred fire ritual performed by expert Pandits.',
    benefits: ['Conquers serious illness', 'Life extension & vitality', 'Removes fear of death', 'Powerful Shiva blessing'],
  },
  {
    title: 'Rudrabhishek',
    price: '₹11,000 – ₹21,000',
    image: '/images/puja_rudra.png',
    category: 'Shiva Rituals',
    description: 'Sacred bathing of the Shiva Lingam with milk, honey, curd, ghee, and sacred waters while chanting Rudra mantras. Available in three levels: Laghu Rudra, Maha Rudra, and Ati Rudra for maximum divine blessings.',
    benefits: ['Lord Shiva blessings', 'Removes obstacles', 'Spiritual growth', 'Three levels available'],
  },
  {
    title: 'Mangal Dosha (Kuja Dosha) Shanti',
    price: '₹21,000',
    image: '/images/puja_navagraha.png',
    category: 'Dosha Remedies',
    description: 'Specialized remedial puja to neutralize the effects of Mangal Dosha in your horoscope. Essential for individuals with Mars affliction affecting marriage and relationships. Performed with complete Vedic rituals.',
    benefits: ['Neutralizes Mangal Dosha', 'Improves marriage prospects', 'Harmonizes relationships', 'Mars energy balancing'],
  },
  {
    title: 'Kaal Sarp Dosha Shanti',
    price: '₹21,000',
    image: '/images/puja_homa.png',
    category: 'Dosha Remedies',
    description: 'Powerful ritual to mitigate the effects of Kaal Sarp Dosha formed when all planets are hemmed between Rahu and Ketu. This dosha can cause obstacles in career, relationships, and overall prosperity.',
    benefits: ['Removes Kaal Sarp effects', 'Career growth', 'Prosperity enhancement', 'Rahu-Ketu balance'],
  },
  {
    title: 'Rahu–Ketu Shanti Puja',
    price: '₹21,000',
    image: '/images/puja_navagraha.png',
    category: 'Planetary Remedies',
    description: 'Dedicated puja to pacify the shadow planets Rahu and Ketu which cause confusion, illusions, and karmic debts. This ritual brings clarity, spiritual growth, and relief from their malefic effects.',
    benefits: ['Shadow planet appeasement', 'Karmic healing', 'Mental clarity', 'Spiritual evolution'],
  },
  {
    title: 'Shani Shanti Puja',
    price: '₹15,000',
    image: '/images/puja_navagraha.png',
    category: 'Planetary Remedies',
    description: 'Sacred ritual to propitiate Saturn (Shani Dev) during Shani Sade Sati, Shani Dasha, or other Saturn afflictions. Performed with sesame seeds, black cloth, iron objects, and specific Saturn mantras.',
    benefits: ['Saturn (Shani) appeasement', 'Sade Sati relief', 'Career protection', 'Discipline and justice'],
  },
  {
    title: 'Pitru Dosha Shanti',
    price: '₹21,000',
    image: '/images/puja_homa.png',
    category: 'Ancestral Rituals',
    description: 'Sacred ritual to honor ancestors and resolve ancestral debts (Pitru Rin). Pitru Dosha causes repeated family obstacles, health issues, and relationship problems. This puja brings peace to departed souls and living family.',
    benefits: ['Ancestral soul peace', 'Family harmony', 'Removes family obstacles', 'Karmic debt resolution'],
  },
  {
    title: 'Narayan Nagbali',
    price: '₹31,000',
    image: '/images/puja_homa.png',
    category: 'Ancestral Rituals',
    description: 'A two-part sacred ritual combining Narayan Bali (for un-natural death souls) and Nagbali (for Nag Dosha). Performed at specific sacred locations to free ancestral souls from bondage and remove family curses.',
    benefits: ['Frees trapped souls', 'Removes family curses', 'Nag dosha remedy', 'Ancestral liberation'],
  },
  {
    title: 'Tripindi Shraddha',
    price: '₹18,000',
    image: '/images/puja_homa.png',
    category: 'Ancestral Rituals',
    description: 'A specialized Shraddha ritual for three generations of ancestors who have not received proper last rites. This powerful ceremony provides liberation to departed souls and brings blessings to the family.',
    benefits: ['Three-generation remedy', 'Ancestral peace', 'Removes generational karma', 'Family prosperity'],
  },
  {
    title: 'Durga Saptashati Path',
    price: '₹51,000',
    image: '/images/puja_durga.png',
    category: 'Goddess Rituals',
    description: 'Complete recitation of all 700 verses of Durga Saptashati (Chandi Path) by expert Pandits. This powerful Shakti sadhana invokes the divine feminine energy for protection, victory over enemies, and spiritual awakening.',
    benefits: ['Divine Shakti protection', 'Victory over enemies', 'Spiritual awakening', 'Complete 700-verse path'],
  },
  {
    title: 'Lakshmi Kubera Puja & Dhanvantari Homa',
    price: '₹41,000',
    image: '/images/puja_navagraha.png',
    category: 'Prosperity Rituals',
    description: 'Combined powerful ritual invoking Goddess Lakshmi and Lord Kubera for wealth, and Dhanvantari (divine physician) for health through sacred fire. Perfect for business prosperity, financial growth, and good health.',
    benefits: ['Wealth and prosperity', 'Business growth', 'Health blessings', 'Divine abundance'],
  },
  {
    title: 'Santana Gopala Puja',
    price: '₹31,000',
    image: '/images/puja_navagraha.png',
    category: 'Special Rituals',
    description: 'Sacred puja to invoke Lord Vishnu in his Santana Gopala form for blessings of progeny, healthy pregnancy, and child welfare. Recommended for couples seeking children or wishing for their child\'s health and prosperity.',
    benefits: ['Progeny blessings', 'Healthy pregnancy', 'Child protection', 'Fertility enhancement'],
  },
  {
    title: 'Shatachandi Yajna',
    price: '₹71,000',
    image: '/images/puja_durga.png',
    category: 'Supreme Rituals',
    description: 'Hundred-fold Chandi path performed as a grand yajna — one of the most powerful Vedic rituals. Removes deep-seated doshas, provides divine protection, and grants all-round prosperity and spiritual merit.',
    benefits: ['Deepest karma cleansing', 'Divine supreme protection', 'Complete prosperity', 'Massive spiritual merit'],
  },
  {
    title: 'Vastu Shanti Puja',
    price: '₹55,000',
    image: '/images/puja_navagraha.png',
    category: 'Vastu & Home',
    description: 'Comprehensive Vastu Shanti ritual to purify and energize your home or office, neutralizing Vastu doshas and balancing the five elements. Creates a harmonious environment for prosperity, health, and happiness.',
    benefits: ['Home energy purification', 'Vastu dosha removal', 'Family harmony', 'Prosperity activation'],
  },
  {
    title: 'Griha Shanti Homa',
    price: '₹21,000',
    image: '/images/puja_homa.png',
    category: 'Vastu & Home',
    description: 'Sacred fire ritual for home peace and prosperity. Performed for new home entry (Griha Pravesh), to resolve domestic disputes, recurring illness, financial losses, or any negative energy affecting the household.',
    benefits: ['Home peace & prosperity', 'New home blessing', 'Negative energy removal', 'Family protection'],
  },
];

const CATEGORIES = ['All', 'Planetary Remedies', 'Homa Rituals', 'Individual Planet', 'Supreme Rituals', 'Shiva Rituals', 'Dosha Remedies', 'Ancestral Rituals', 'Goddess Rituals', 'Prosperity Rituals', 'Special Rituals', 'Vastu & Home'];

const PujaCard = ({ puja, index, onBookService }) => {
  const theme = useTheme();
  const [expanded, setExpanded] = useState(false);

  const handleBookNow = () => {
    if (onBookService) {
      onBookService(puja);
    } else {
      const phoneNumber = "919243818146";
      const message = `Hi Ashay ji, I want to book ${puja.title} (${puja.price}). Please guide me.`;
      window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: (index % 3) * 0.1 }}
      style={{
        borderRadius: '20px',
        overflow: 'hidden',
        backgroundColor: 'rgba(255,255,255,0.03)',
        border: `1px solid rgba(212,175,55,0.2)`,
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
        transition: 'all 0.3s ease',
      }}
      whileHover={{ y: -4, borderColor: 'rgba(212,175,55,0.45)', boxShadow: '0 16px 48px rgba(0,0,0,0.5)' }}
    >
      {/* Image */}
      <div style={{ height: '180px', overflow: 'hidden', position: 'relative' }}>
        <motion.img
          whileHover={{ scale: 1.07 }}
          transition={{ duration: 0.5 }}
          src={puja.image ? (puja.image.startsWith('/uploads') ? `${import.meta.env.VITE_API_BASE || ''}${puja.image}` : puja.image) : '/images/puja_navagraha.png'}
          alt={puja.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          onError={(e) => {
            if (puja.image && puja.image.startsWith('/uploads') && !e.target.dataset.triedRelative) {
              e.target.dataset.triedRelative = 'true';
              e.target.src = puja.image;
            } else {
              e.target.style.display = 'none';
            }
          }}
        />
        {/* Category badge */}
        <div style={{
          position: 'absolute', top: '12px', left: '12px',
          backgroundColor: 'rgba(212,175,55,0.9)', color: '#000',
          padding: '3px 10px', borderRadius: '20px',
          fontSize: '0.65rem', fontWeight: 700, fontFamily: 'var(--font-body)',
          letterSpacing: '0.05em',
        }}>
          {puja.category}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        <h3 style={{
          fontFamily: 'var(--font-heading)', fontSize: '1rem',
          color: '#d4af37', marginBottom: '8px', lineHeight: 1.3
        }}>
          {puja.title}
        </h3>

        <p style={{
          fontFamily: 'var(--font-body)', color: '#a0a0a0',
          fontSize: '0.82rem', lineHeight: 1.5, marginBottom: '12px', flexGrow: 1,
        }}>
          {puja.description}
        </p>

        {/* Benefits toggle */}
        <motion.button
          onClick={() => setExpanded(!expanded)}
          style={{
            background: 'none', border: 'none', color: '#d4af37',
            fontFamily: 'var(--font-body)', fontSize: '0.78rem',
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px',
            marginBottom: '10px', padding: '0',
          }}
        >
          {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          {expanded ? 'Hide Benefits' : 'View Benefits'}
        </motion.button>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              style={{ overflow: 'hidden', marginBottom: '12px' }}
            >
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {puja.benefits.map((b, i) => (
                  <li key={i} style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    color: '#ffffff', fontSize: '0.78rem',
                  }}>
                    <span style={{ color: '#d4af37', flexShrink: 0 }}>✦</span> {b}
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '12px', borderTop: '1px solid rgba(212,175,55,0.15)' }}>
          <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.1rem', color: '#ffffff' }}>
            {puja.price}
          </span>
          <motion.button
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={handleBookNow}
            style={{
              padding: '8px 18px', borderRadius: '8px', border: 'none',
              background: 'linear-gradient(135deg, #d4af37, #b8860b)',
              color: '#000', fontFamily: 'var(--font-heading)',
              fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer',
            }}
          >
            Book Now
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

const Puja = ({ onBookService }) => {
  const [livePujas, setLivePujas] = useState(pujas);
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    fetch('/api/pujas')
      .then(res => res.json())
      .then(data => {
        if (data.data && Array.isArray(data.data) && data.data.length > 0) {
          setLivePujas(data.data);
        }
      })
      .catch(e => console.warn('Pujas fetch warning:', e));
  }, []);

  const dynamicCategories = ['All', ...new Set(livePujas.map(p => p.category).filter(Boolean))];
  const filteredPujas = activeCategory === 'All' ? livePujas : livePujas.filter(p => p.category === activeCategory);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      style={{ minHeight: 'calc(100vh - 80px)', backgroundColor: '#0a0a0a' }}
    >
      {/* Hero Banner */}
      <div style={{
        position: 'relative',
        padding: 'clamp(48px, 8vw, 100px) 20px',
        backgroundColor: '#080808',
        borderBottom: `1px solid rgba(212,175,55,0.2)`,
        textAlign: 'center',
        overflow: 'hidden'
      }}>
        {/* Mandala Background — darker golden */}
        <MandalaArt
          variant={2} size={700} opacity={0.25}
          style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 0 }}
        />
        <MandalaArt
          variant={0} size={400} opacity={0.12}
          style={{ top: '-100px', right: '-100px', zIndex: 0 }}
          direction={-1}
        />

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '10px 20px',
              backgroundColor: 'rgba(212,175,55,0.15)',
              borderRadius: '30px',
              color: '#d4af37',
              fontWeight: 600,
              fontFamily: 'var(--font-body)',
              marginBottom: '20px',
              border: '1px solid rgba(212,175,55,0.3)',
            }}
          >
            <ShieldCheck size={20} />
            <span>ISO Certified Astrological Services</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(2rem, 5vw, 4rem)',
              color: '#ffffff',
              lineHeight: 1.1,
              marginBottom: '20px',
            }}
          >
            Authentic <span style={{ color: '#d4af37' }}>Online Puja</span> Services
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'clamp(1rem, 2vw, 1.2rem)',
              color: '#a0a0a0',
              maxWidth: '700px',
              margin: '0 auto 32px',
              lineHeight: 1.7,
            }}
          >
            Perform powerful Vedic rituals from the comfort of your home. Conducted by expert Pandits with complete Vidhi-Vidhan.
          </motion.p>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            style={{ display: 'flex', gap: '32px', justifyContent: 'center', flexWrap: 'wrap' }}
          >
            {[
              { num: '18+', label: 'Sacred Pujas' },
              { num: '5000+', label: 'Rituals Performed' },
              { num: '100%', label: 'Authentic Vidhi' },
              { num: '24/7', label: 'Support' },
            ].map((s, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', color: '#d4af37', fontWeight: 700 }}>{s.num}</div>
                <div style={{ fontSize: '0.78rem', color: '#a0a0a0', letterSpacing: '0.05em' }}>{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Category Filter */}
      <div style={{ padding: '32px 20px 0', backgroundColor: '#0a0a0a' }}>
        <div className="container">
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '8px' }}>
            {dynamicCategories.map(cat => (
              <motion.button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                style={{
                  padding: '7px 16px', borderRadius: '20px',
                  border: `1px solid ${activeCategory === cat ? 'rgba(212,175,55,0.8)' : 'rgba(212,175,55,0.2)'}`,
                  backgroundColor: activeCategory === cat ? 'rgba(212,175,55,0.15)' : 'transparent',
                  color: activeCategory === cat ? '#d4af37' : '#a0a0a0',
                  fontFamily: 'var(--font-body)', fontSize: '0.78rem',
                  fontWeight: activeCategory === cat ? 700 : 400,
                  cursor: 'pointer', transition: 'all 0.2s',
                }}
              >
                {cat}
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Pujas Grid */}
      <div className="container" style={{ padding: '40px 20px 80px' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="puja-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '24px',
            }}
          >
            {filteredPujas.map((puja, idx) => (
              <PujaCard key={puja.title} puja={puja} index={idx} onBookService={onBookService} />
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Disclaimer */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          style={{
            marginTop: '48px', padding: '24px 32px',
            borderRadius: '16px', backgroundColor: 'rgba(212,175,55,0.06)',
            border: '1px solid rgba(212,175,55,0.2)', textAlign: 'center',
          }}
        >
          <p style={{ color: '#a0a0a0', fontSize: '0.85rem', lineHeight: 1.7, margin: 0 }}>
            <span style={{ color: '#d4af37', fontWeight: 700 }}>✦ Note:</span> All pujas are performed with complete Vedic procedures (Vidhi-Vidhan) by trained and experienced Pandits.
            Prices may vary based on specific requirements and scale of the ritual. Contact us for detailed consultation before booking.
          </p>
          <motion.a
            href={`https://wa.me/919243818146?text=${encodeURIComponent('Hi Ashay ji, I want to enquire about Online Puja services.')}`}
            target="_blank" rel="noopener noreferrer"
            whileHover={{ scale: 1.03 }}
            style={{
              display: 'inline-block', marginTop: '16px',
              padding: '12px 28px', borderRadius: '12px',
              background: 'linear-gradient(135deg, #d4af37, #b8860b)',
              color: '#000', fontFamily: 'var(--font-heading)',
              fontWeight: 700, fontSize: '0.95rem',
              textDecoration: 'none',
            }}
          >
            📱 WhatsApp for Consultation
          </motion.a>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Puja;
