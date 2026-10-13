import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { ShieldCheck, BookOpen, Compass, Award, HeartHandshake, ArrowLeft, MessageCircle } from 'lucide-react';
import MandalaArt from '../components/ui/MandalaArt';
import CosmicStarfield from '../components/ui/CosmicStarfield';

export default function AboutAcharya({ setCurrentPage }) {
  const theme = useTheme();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const sections = [
    {
      id: 'lineage',
      title: 'A Lineage Rooted in Seva',
      icon: <HeartHandshake size={24} color="#d4af37" />,
      tag: '18th Generation Seva Heritage',
      content: [
        `The spiritual roots of Shri Acharya Ji's family lie in Vrindavan, within the devotional tradition of the Radhavallabh Sampradaya. The Sampradaya was founded by Shri Hit Harivansh Mahaprabhu Ji. His son, Shri Van Chandra Ji Maharaj, had a daughter named Kishori Ji, who dedicated herself to the service of Kishorivallabh Thakur and established his temple, Kishorivallabh Lal Ji, in the sacred Radhavallabh Ghera of Vrindavan.`,
        `The historic Kishorivallabh Mandir, associated with the family's seva of Shri Kishorivallabh Thakur, has a history of approximately 350–400 years. Shri Acharya Ji's ancestors served Shri Kishorivallabh Thakur at this temple, preserving through generations a tradition in which spiritual practice, seva and responsibility were closely intertwined.`
      ]
    },
    {
      id: 'bhind',
      title: 'From Vrindavan to Bhind',
      icon: <Compass size={24} color="#d4af37" />,
      tag: 'Sacred Consecration',
      content: [
        `The family's history also extends to Bhind, Madhya Pradesh, through a cherished account preserved as part of its traditional heritage. A revered ancestor of Shri Acharya Ji was offered a temple in Bhind by his disciple as a mark of respect and devotion. To consecrate the temple, the ancestor undertook a journey to bring the sacred murtis intended for worship there.`,
        `During this journey, the murtis were discovered in the holy waters of the Yamuna River. They were respectfully brought to Bhind and installed for worship in the temple for which they were intended. Since that time, the family has continued its seva of Shri Radhavallabh Ji in Bhind. The tradition of worship and dedication has remained unbroken through successive generations, and the Bhind temple continues to stand as a symbol of the family's spiritual heritage.`,
        `For Shri Acharya Ji, this history is not simply an account of ancestry. It represents a continuing responsibility: to preserve the lineage, uphold the values and practices received from earlier generations, and carry forward the family's seva of Shri Radhavallabh Ji.`
      ]
    },
    {
      id: 'learning',
      title: 'Spiritual and Scriptural Learning',
      icon: <BookOpen size={24} color="#d4af37" />,
      tag: 'Varanasi & Vrindavan Scholarly Lineage',
      content: [
        `Alongside this inherited tradition of seva, Shri Acharya Ji has pursued the study of Sanatana Dharma in Vrindavan and Varanasi. His learning encompasses the Vedas, Puranas and Shrimad Bhagavatam, with the latter holding an important place in the Vaishnava tradition.`,
        `His education reflects the same continuity that has shaped his family life: knowledge is approached not merely as information, but as something to be studied, understood and carried forward with sincerity.`,
        `Varanasi also became an important part of his journey in Vedic Astrology, or Jyotish. He undertook formal education in Vedic Astrology there and holds a recognized qualification in the subject.`
      ]
    },
    {
      id: 'jyotish',
      title: 'The Path of Jyotish',
      icon: <Award size={24} color="#d4af37" />,
      tag: 'Guiding Contemporary Life Through Ancient Wisdom',
      content: [
        `For more than five years, Shri Acharya Ji has provided guidance through Vedic astrology. His approach is grounded in traditional Jyotish principles, while placing emphasis on clarity, practical understanding and responsible interpretation of planetary influences.`,
        `His guidance addresses matters that form an important part of everyday life, including career, relationships, health and personal growth. Rather than presenting astrology as a source of absolute certainty, his approach is intended to help individuals understand their circumstances with greater awareness and approach important decisions with clarity, balance and practical understanding.`,
        `In this way, his work seeks to bring the traditional discipline of Jyotish into conversation with the questions and realities of contemporary life, while remaining respectful of its traditional foundations.`
      ]
    },
    {
      id: 'mannjyotish',
      title: 'MannJyotish: Learning Vedic Astrology',
      icon: <ShieldCheck size={24} color="#d4af37" />,
      tag: 'Authentic Academy of Vedic Sciences',
      content: [
        `Shri Acharya Ji's commitment to traditional learning also finds expression through MannJyotish, his institute dedicated to the teaching of Vedic Astrology.`,
        `Through MannJyotish, he offers structured and systematic courses ranging from beginner to advanced levels. The study encompasses Jyotish Shastra, Nakshatra Vidya, Graha Vidya, Bhava Vidya and Rashi Vidya, providing learners with a progressive understanding of the different aspects of Vedic astrology.`,
        `His aim is to present Vedic knowledge clearly, practically and authentically, without losing its connection with traditional learning. Teaching, therefore, forms a natural extension of his own journey of study and his commitment to preserving and sharing knowledge.`
      ]
    },
    {
      id: 'tradition',
      title: 'A Continuing Tradition',
      icon: <Compass size={24} color="#d4af37" />,
      tag: 'Preserve · Guide · Serve',
      content: [
        `The journey of Shri Acharya Ji brings together three closely connected streams: the inheritance of a spiritual lineage, the pursuit of traditional knowledge, and the responsibility of seva.`,
        `From the Radhavallabh tradition of Vrindavan and the family's centuries-old association with Shri Kishorivallabh Thakur, to the continuing seva of Shri Radhavallabh Ji in Bhind; from his study of Sanatana Dharma and Vaishnava scriptures to his formal education and recognized qualification in Jyotish; and from his personal practice of seva to his teaching through MannJyotish, each part of his work reflects a continuity between tradition and contemporary understanding.`,
        `Today, Shri Acharya Ji continues his seva of Shri Radhavallabh Ji, remains committed to the principles of Sanatana Dharma and traditional learning, and shares his knowledge through spiritual guidance and the teaching of Jyotish.`,
        `His path is, above all, a continuing one: to preserve what has been received, to learn with sincerity, to guide with responsibility, and to serve spirituality and society through knowledge, guidance and dedication.`
      ]
    }
  ];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#07070a', color: '#fff', position: 'relative', overflow: 'hidden' }}>
      {/* Background Starfield */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, opacity: 0.35 }}>
        <CosmicStarfield starCount={60} opacity={0.3} mouseReactive={false} />
      </div>

      {/* Decorative Mandalas */}
      <MandalaArt
        variant={0}
        size={600}
        opacity={0.08}
        style={{ position: 'absolute', top: '5%', right: '-200px', zIndex: 0, pointerEvents: 'none' }}
      />
      <MandalaArt
        variant={2}
        size={500}
        opacity={0.06}
        style={{ position: 'absolute', top: '45%', left: '-200px', zIndex: 0, pointerEvents: 'none' }}
        direction={-1}
      />

      <div className="container" style={{ position: 'relative', zIndex: 1, padding: '40px 20px 80px', maxWidth: '1000px', margin: '0 auto' }}>
        {/* Back Button */}
        <button
          onClick={() => setCurrentPage('home')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(212, 175, 55, 0.3)',
            borderRadius: '20px',
            padding: '8px 18px',
            color: '#d4af37',
            fontFamily: 'var(--font-heading)',
            fontSize: '0.85rem',
            cursor: 'pointer',
            marginBottom: '36px',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'rgba(212, 175, 55, 0.15)'; }}
          onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)'; }}
        >
          <ArrowLeft size={16} />
          <span>Back to Home</span>
        </button>

        {/* Hero Section of Biography */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '40px',
            alignItems: 'center',
            marginBottom: '60px',
            padding: '36px',
            borderRadius: '24px',
            background: 'linear-gradient(135deg, rgba(20,20,30,0.8), rgba(10,10,15,0.9))',
            border: '1px solid rgba(212, 175, 55, 0.3)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.6), 0 0 30px rgba(212,175,55,0.08)',
          }}
        >
          {/* Portrait Column */}
          <div style={{ textAlign: 'center', position: 'relative' }}>
            <div style={{
              width: '220px',
              height: '220px',
              borderRadius: '50%',
              margin: '0 auto',
              padding: '4px',
              background: 'linear-gradient(135deg, #d4af37, #ffd700, #b8860b)',
              boxShadow: '0 12px 40px rgba(212, 175, 55, 0.4)',
              overflow: 'hidden',
            }}>
              <img
                src="/profile.png"
                alt="Acharya Shri Hit Ashay Krishn Goswami"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  borderRadius: '50%',
                }}
              />
            </div>
            <div style={{
              marginTop: '16px',
              display: 'inline-block',
              padding: '4px 14px',
              borderRadius: '20px',
              background: 'rgba(212, 175, 55, 0.15)',
              border: '1px solid rgba(212, 175, 55, 0.35)',
              color: '#d4af37',
              fontSize: '0.8rem',
              fontWeight: 700,
              fontFamily: 'var(--font-heading)',
              letterSpacing: '0.05em',
            }}>
              ✦ Radhavallabh Sampradaya Seva ✦
            </div>
          </div>

          {/* Heading Column */}
          <div>
            <div style={{
              fontSize: '0.82rem',
              color: '#d4af37',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              fontFamily: 'var(--font-heading)',
              fontWeight: 700,
              marginBottom: '10px',
            }}>
              Sacred Heritage & Vedic Wisdom
            </div>
            <h1 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(2rem, 4vw, 2.75rem)',
              color: '#fff',
              lineHeight: 1.15,
              marginBottom: '16px',
            }}>
              Acharya Shri Hit <br />
              <span style={{ color: '#d4af37' }}>Ashay Krishn Goswami</span>
            </h1>
            <p style={{
              fontSize: '1.02rem',
              color: 'rgba(255, 255, 255, 0.85)',
              lineHeight: 1.7,
              fontFamily: 'var(--font-body)',
              fontStyle: 'italic',
            }}>
              "Acharya Shri Hit Ashay Krishn Goswami is a Vedic astrologer, teacher and spiritual guide, whose life and work are rooted in Sanatana Dharma, the Radhavallabh Sampradaya, traditional learning and seva. He is part of the 18th generation of a family dedicated to the seva of Shri Kishorivallabh Lal Ji of Vrindavan, carrying forward a heritage shaped by devotion, worship, learning and service through generations."
            </p>
          </div>
        </motion.div>

        {/* Narrative Sections */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {sections.map((sec, idx) => (
            <motion.article
              key={sec.id}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
              style={{
                background: 'rgba(18, 18, 25, 0.75)',
                border: '1px solid rgba(212, 175, 55, 0.22)',
                borderRadius: '20px',
                padding: '32px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.4)',
                backdropFilter: 'blur(6px)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px' }}>
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(212, 175, 55, 0.12)',
                  border: '1px solid rgba(212, 175, 55, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  {sec.icon}
                </div>
                <div>
                  <div style={{ fontSize: '0.72rem', color: '#d4af37', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>
                    {sec.tag}
                  </div>
                  <h2 style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '1.45rem',
                    color: '#fff',
                    margin: 0,
                  }}>
                    {sec.title}
                  </h2>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '16px' }}>
                {sec.content.map((p, pIdx) => (
                  <p key={pIdx} style={{
                    color: 'rgba(255, 255, 255, 0.82)',
                    fontSize: '0.96rem',
                    lineHeight: 1.75,
                    margin: 0,
                    fontFamily: 'var(--font-body)',
                  }}>
                    {p}
                  </p>
                ))}
              </div>
            </motion.article>
          ))}
        </div>

        {/* Footer Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{
            marginTop: '60px',
            padding: '40px',
            borderRadius: '24px',
            background: 'linear-gradient(135deg, rgba(212,175,55,0.15) 0%, rgba(20,20,30,0.9) 100%)',
            border: '1px solid rgba(212, 175, 55, 0.4)',
            textAlign: 'center',
          }}
        >
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', color: '#d4af37', marginBottom: '12px' }}>
            Seek Spiritual Guidance from Acharya Ji
          </h3>
          <p style={{ maxWidth: '650px', margin: '0 auto 28px', color: 'rgba(255,255,255,0.75)', fontSize: '0.95rem', lineHeight: 1.6 }}>
            Whether you seek personal Kundli consultations, Vedic remedial pujas, or enrollment in MannJyotish Academy courses, Acharya Ji is here to guide your path with authentic tradition and modern clarity.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => {
                const phoneNumber = "917000742315";
                const msg = "Namaste Acharya Ashay ji, I read your biography and would like to seek personal spiritual and astrological guidance.";
                window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(msg)}`, '_blank');
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 28px',
                borderRadius: '30px',
                background: 'linear-gradient(135deg, #25D366, #128C7E)',
                border: 'none',
                color: '#fff',
                fontFamily: 'var(--font-heading)',
                fontWeight: 700,
                fontSize: '0.92rem',
                cursor: 'pointer',
                boxShadow: '0 6px 20px rgba(37,211,102,0.3)',
              }}
            >
              <MessageCircle size={18} />
              <span>Connect on WhatsApp</span>
            </button>

            <button
              onClick={() => setCurrentPage('courses')}
              style={{
                padding: '12px 28px',
                borderRadius: '30px',
                background: 'rgba(212, 175, 55, 0.12)',
                border: '1.5px solid #d4af37',
                color: '#d4af37',
                fontFamily: 'var(--font-heading)',
                fontWeight: 700,
                fontSize: '0.92rem',
                cursor: 'pointer',
              }}
            >
              Explore Academy Courses
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
