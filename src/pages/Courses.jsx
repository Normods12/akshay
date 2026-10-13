import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import SectionHeading from '../components/ui/SectionHeading';
import { SunIcon, TelescopeIcon, CardIcon, StarIcon } from '../components/ui/Icons';
import { motion, AnimatePresence } from 'framer-motion';
import { GraduationCap, Sparkles, Calendar, Compass, Clock, BookOpen } from 'lucide-react';
import CourseDetail from './CourseDetail';
import DemoBookingModal from '../components/ui/DemoBookingModal';

const API_BASE = import.meta.env.VITE_API_BASE || '';

const DEFAULT_COURSES = [
  {
    id: "course-jyotish-prarambh",
    category: "Vedic Jyotish",
    title: "Jyotish Prarambh (Beginner Level)",
    duration: "3 Months",
    level: "Beginner Level",
    icon: "sun",
    description: "This course is the ideal starting point for anyone interested in Vedic Astrology. Students learn the basic principles of Jyotish, the structure of a birth chart, the twelve zodiac signs, the nine planets, the twelve houses, and essential astrological terminology. No prior knowledge is required.",
    whatYouLearn: [
      "Basic principles of Vedic Jyotish",
      "Structure and layout of a Janma Kundali",
      "The twelve zodiac signs (Rashis) & elements",
      "The nine planets (Navagrahas) & character",
      "The twelve houses (Bhavas) & life areas",
      "Essential astrological terminology and basic calculation"
    ],
    idealFor: "Anyone interested in Vedic Astrology. No prior knowledge is required.",
    certification: "Certificate of Completion in Jyotish Prarambh",
    youtubeUrl: "",
    createdAt: "2026-08-06T20:22:00.000Z"
  },
  {
    id: "course-jyotish-pravesh",
    category: "Vedic Jyotish",
    title: "Jyotish Pravesh (Basic Foundation)",
    duration: "3 Months",
    level: "Basic Foundation",
    icon: "telescope",
    description: "This foundation course develops a strong understanding of horoscope reading. Students learn planetary strengths and weaknesses, planetary relationships, aspects (Drishti), conjunctions (Yuti), house lordships, and the fundamental rules of chart interpretation.",
    whatYouLearn: [
      "Planetary strengths and weaknesses (Uchha, Neecha, Moolatrikona)",
      "Planetary relationships (Mitra, Shatru, Sama)",
      "Aspects (Drishti) and Conjunctions (Yuti)",
      "House lordships and functional nature",
      "Fundamental rules of chart interpretation and synthesis"
    ],
    idealFor: "Students seeking to develop a solid foundation in Vedic chart reading.",
    certification: "Certificate of Completion in Jyotish Pravesh",
    youtubeUrl: "",
    createdAt: "2026-08-06T20:22:01.000Z"
  },
  {
    id: "course-nakshatra-vidya",
    category: "Vedic Jyotish",
    title: "Nakshatra Vidya (Nakshatra & Pada Specialization)",
    duration: "4 Months",
    level: "Specialization",
    icon: "star",
    description: "A specialized course focused on the 27 Nakshatras and their four Padas. Students explore the characteristics, symbolism, deities, planetary rulers, nature, compatibility, and predictive applications of each Nakshatra in horoscope analysis.",
    whatYouLearn: [
      "The 27 Nakshatras & their 108 Padas",
      "Characteristics, symbolism, and deities",
      "Planetary rulers, elemental nature, and psychological traits",
      "Compatibility and relationship matching",
      "Predictive applications in horoscope analysis and timing"
    ],
    idealFor: "Astrology students desiring high precision and predictive mastery through Nakshatras.",
    certification: "Specialized Certificate in Nakshatra Vidya",
    youtubeUrl: "",
    createdAt: "2026-08-06T20:22:02.000Z"
  },
  {
    id: "course-graha-vidya",
    category: "Vedic Jyotish",
    title: "Graha Vidya (Planets & Their Results)",
    duration: "3 Months",
    level: "Specialization",
    icon: "sun",
    description: "This course provides an in-depth study of the Navagrahas (Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn, Rahu, and Ketu). Students learn planetary nature, significations, strengths, dignities, yogas, and their influence on different areas of life.",
    whatYouLearn: [
      "Deep dive into the 9 Navagrahas (Sun to Ketu)",
      "Planetary nature and natural significations (Karakatwas)",
      "Strengths, dignities, and combust/retrograde states",
      "Major auspicious and malefic planetary Yogas",
      "Planetary influence on life domains (health, career, relationships)"
    ],
    idealFor: "Learners wishing to master planetary influences and yoga interpretations.",
    certification: "Certificate of Mastery in Graha Vidya",
    youtubeUrl: "",
    createdAt: "2026-08-06T20:22:03.000Z"
  },
  {
    id: "course-bhava-vidya",
    category: "Vedic Jyotish",
    title: "Bhava Vidya (Houses & Life Areas)",
    duration: "3 Months",
    level: "Specialization",
    icon: "telescope",
    description: "This course focuses on the twelve houses (Bhavas) of a horoscope and their significance. Students learn how each house governs different aspects of life, including personality, education, career, marriage, wealth, health, children, spirituality, and foreign travel.",
    whatYouLearn: [
      "Comprehensive study of all twelve Bhavas",
      "Governance of personality, education, career, and wealth",
      "Marriage, health, children, spirituality, and foreign travel houses",
      "Kendra, Trikona, Dusthana, and Upachaya dynamics",
      "Bhavat Bhavam and house lordship placement principles"
    ],
    idealFor: "Students looking to deliver detailed domain-specific horoscope consultations.",
    certification: "Certificate of Mastery in Bhava Vidya",
    youtubeUrl: "",
    createdAt: "2026-08-06T20:22:04.000Z"
  },
  {
    id: "course-rashi-vidya",
    category: "Vedic Jyotish",
    title: "Rashi Vidya (Zodiac Signs in Depth)",
    duration: "3 Months",
    level: "Specialization",
    icon: "star",
    description: "This course offers a detailed study of the twelve Rashis (zodiac signs). Students understand the qualities, elements, modalities, planetary rulerships, strengths, weaknesses, psychological traits, and practical interpretation of each sign in predictive astrology.",
    whatYouLearn: [
      "In-depth analysis of the 12 Rashis (Aries to Pisces)",
      "Qualities, elements (Fire, Earth, Air, Water), and modalities",
      "Planetary rulerships and directional strengths",
      "Strengths, weaknesses, and psychological archetypes",
      "Practical predictive interpretation of signs in natal charts"
    ],
    idealFor: "Students wanting deep psychological and structural mastery of the 12 zodiac signs.",
    certification: "Certificate of Mastery in Rashi Vidya",
    youtubeUrl: "",
    createdAt: "2026-08-06T20:22:05.000Z"
  },
  {
    id: "course-foundation-numerology",
    category: "Numerology",
    title: "Foundation of Numerology: A Beginner's Course",
    duration: "2 Months",
    level: "Beginner Level",
    icon: "sun",
    description: "As you explore numerology, you gain insights into your personality, strengths, challenges, and life patterns. It also helps you understand your family and friends from a new perspective, making it easier to support them with greater awareness and empathy. Most importantly, the knowledge you gain can inspire positive changes in your own life and become a practical tool for self-growth and everyday understanding.",
    whatYouLearn: [
      "Basics and symbolism of core numbers 1 through 9",
      "Deriving life numbers from date of birth and names",
      "Recognizing personal strengths, challenges, and habits",
      "Understanding family and friends with greater empathy",
      "Practical application of numbers for daily clarity and self-growth"
    ],
    idealFor: "Beginners seeking personal growth and an empathetic understanding of others through numbers.",
    certification: "Certificate in Foundation of Numerology",
    youtubeUrl: "",
    createdAt: "2026-08-06T20:23:00.000Z"
  },
  {
    id: "course-mastery-numerology",
    category: "Numerology",
    title: "Mastery of Numerology: An Advanced Course",
    duration: "4 Months",
    level: "Advanced Level",
    icon: "telescope",
    description: "Advanced numerology helps you connect the bigger picture by understanding how different numbers work together and what they reveal in greater detail. It enables you to interpret charts with more clarity, offer meaningful guidance to others, and apply your knowledge with greater confidence in real-life.",
    whatYouLearn: [
      "Complex number interactions and compounding effects",
      "Connecting the bigger picture across multi-number matrices",
      "High-precision chart interpretation techniques",
      "Providing clear, meaningful consultation guidance",
      "Real-world application for career, timing, and personal life decisions"
    ],
    idealFor: "Learners looking to provide professional numerology readings with confidence.",
    certification: "Advanced Certificate in Numerology Mastery",
    youtubeUrl: "",
    createdAt: "2026-08-06T20:23:01.000Z"
  },
  {
    id: "course-quantum-numerology",
    category: "Numerology",
    title: "Quantum Numerology Certification Program",
    duration: "9 Months",
    level: "Professional Certification",
    icon: "star",
    description: "The Quantum Numerology Certification Program is a comprehensive 9-month course designed to help students understand the influence of numbers on personality, relationships, career, finances, health, and life events. The course combines foundational numerology concepts with practical interpretation techniques, enabling students to perform accurate numerology consultations.",
    whatYouLearn: [
      "Fundamentals of Quantum Numerology",
      "Life Path, Destiny & Name Numbers",
      "Master & Karmic Numbers",
      "Personal Year & Life Cycles",
      "Relationship Compatibility",
      "Career & Financial Analysis",
      "Business & Brand Numerology",
      "Lucky Numbers & Name Correction",
      "Practical Case Studies & Consultation Skills"
    ],
    idealFor: "Beginners, astrology enthusiasts, spiritual practitioners, life coaches, and anyone interested in learning professional numerology.",
    certification: "Professional Certificate in Quantum Numerology",
    youtubeUrl: "",
    createdAt: "2026-08-06T20:26:00.000Z"
  },
  {
    id: "course-foundation-tarot",
    category: "Tarot Reading",
    title: "Foundation of Tarot Card Reading: A Beginner's Course",
    duration: "2 Months",
    level: "Beginner Level",
    icon: "card",
    description: "The moment you see the cards, you realize they are more than just beautiful images—they seem to tell a story. Each card carries symbols, emotions, and meanings that connect in a unique way, making you wonder how they reflect different situations in life. Learning tarot helps you understand these stories, strengthen your intuition, and look at life's questions from a fresh perspective. As you practice, the cards become a meaningful tool for self-reflection, guidance, and understanding both yourself and the people around you.",
    whatYouLearn: [
      "Major Arcana: The 22 archetypal soul journey cards",
      "Minor Arcana: Suits of Wands, Cups, Swords, and Pentacles",
      "Symbology, colors, and archetypal story patterns",
      "Developing and trusting your intuitive faculty",
      "Fundamental spreads for self-reflection and guidance"
    ],
    idealFor: "Beginners looking to awaken intuition and learn the language of tarot.",
    certification: "Certificate in Foundation of Tarot Card Reading",
    youtubeUrl: "",
    createdAt: "2026-08-06T20:23:02.000Z"
  },
  {
    id: "course-mastery-tarot",
    category: "Tarot Reading",
    title: "Mastery of Tarot Card Reading: An Advanced Course",
    duration: "4 Months",
    level: "Advanced Level",
    icon: "card",
    description: "As you continue your tarot journey, you begin to realize that every reading has much more to offer than the meanings of individual cards. You start noticing how the cards interact with one another, how small details can change the entire message, and how every spread tells a unique story. Advanced Tarot Card Reading helps you understand these deeper connections, refine your intuition, and interpret each reading with greater clarity and confidence. It enables you to deliver readings that are thoughtful, meaningful, and truly insightful.",
    whatYouLearn: [
      "Advanced card pairing, elemental dignities, and spread dynamics",
      "Noticing subtle visual cues and interconnected story arcs",
      "Complex multi-dimensional relationship and life spreads",
      "Delivering deeply empathetic, transformative client consultations",
      "Refining ethical, compassionate intuitive guidance"
    ],
    idealFor: "Experienced readers seeking mastery in storytelling, nuance, and professional consultation.",
    certification: "Advanced Certificate in Tarot Card Reading Mastery",
    youtubeUrl: "",
    createdAt: "2026-08-06T20:23:03.000Z"
  },
  {
    id: "course-foundation-vastu",
    category: "Vastu Shastra",
    title: "Foundation Certificate in Vastu Shastra",
    duration: "6 Months",
    level: "Foundation Certificate",
    icon: "telescope",
    description: "This beginner-friendly course introduces students to the core principles of Vastu Shastra. It is designed for those with no prior knowledge and focuses on understanding the basic concepts required to analyze residential spaces.",
    whatYouLearn: [
      "Introduction to Vastu Shastra",
      "Importance of Directions (Disha)",
      "Panch Mahabhutas (Five Elements)",
      "Vastu Purusha Mandala",
      "Basic Plot Selection",
      "Entrance, Kitchen, Bedroom & Puja Room Placement",
      "Common Vastu Defects",
      "Simple and Practical Vastu Remedies",
      "Basic Home Vastu Analysis"
    ],
    idealFor: "Beginners, homeowners, and Vastu enthusiasts.",
    certification: "Foundation Certificate in Vastu Shastra",
    youtubeUrl: "",
    createdAt: "2026-08-06T20:38:00.000Z"
  },
  {
    id: "course-advanced-vastu",
    category: "Vastu Shastra",
    title: "Advanced Diploma in Vastu Shastra",
    duration: "9 Months",
    level: "Advanced Diploma",
    icon: "star",
    description: "This intermediate-level course is designed for students who have a basic understanding of Vastu and wish to develop practical consultation skills. It covers detailed residential and commercial Vastu along with advanced corrective measures.",
    whatYouLearn: [
      "Advanced Directional Analysis",
      "Residential & Commercial Vastu",
      "Apartments, Villas & Office Vastu",
      "Plot Shape & Land Analysis",
      "Interior Vastu Planning",
      "Staircase, Toilets, Septic Tank & Water Source Placement",
      "Industrial & Business Vastu Basics",
      "Advanced Vastu Remedies",
      "Practical Case Studies",
      "Client Consultation Techniques"
    ],
    idealFor: "Astrology students, architects, interior designers, and aspiring Vastu consultants.",
    certification: "Advanced Diploma in Vastu Shastra",
    youtubeUrl: "",
    createdAt: "2026-08-06T20:38:01.000Z"
  },
  {
    id: "course-professional-vastu-acharya",
    category: "Vastu Shastra",
    title: "Professional Vastu Acharya Program",
    duration: "1 Year",
    level: "Professional Acharya",
    icon: "sun",
    description: "This professional-level course provides complete mastery in Vastu Shastra. Students gain in-depth knowledge of classical Vastu texts, advanced site analysis, energy balancing, large-scale projects, and professional consultation methods. The program prepares students to establish a successful career as certified Vastu consultants.",
    whatYouLearn: [
      "Classical Principles of Vastu Shastra",
      "Residential, Commercial & Industrial Projects",
      "Temple, Hospital, School & Institutional Vastu",
      "Township & Large Plot Planning",
      "Construction Planning from Foundation to Completion",
      "Advanced Energy Balancing Techniques",
      "Vastu with Astrology Integration",
      "Professional Report Writing",
      "Live Site Analysis & Practical Projects",
      "Client Handling, Consultation & Business Setup"
    ],
    idealFor: "Professional consultants, advanced learners, and those seeking a career in Vastu Shastra.",
    certification: "Professional Vastu Acharya Certificate",
    youtubeUrl: "",
    createdAt: "2026-08-06T20:38:02.000Z"
  }
];

const renderIcon = (iconName) => {
  switch (iconName) {
    case 'telescope':
      return <TelescopeIcon />;
    case 'card':
      return <CardIcon />;
    case 'star':
      return <StarIcon />;
    case 'sun':
    default:
      return <SunIcon />;
  }
};

const CATEGORIES = [
  'All Courses',
  'Vedic Jyotish',
  'Numerology',
  'Tarot Reading',
  'Vastu Shastra'
];

const Courses = () => {
  const theme = useTheme();
  const [courses, setCourses] = useState(DEFAULT_COURSES);
  const [selectedCategory, setSelectedCategory] = useState('All Courses');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE}/api/courses`)
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          setCourses(data.data);
        }
      })
      .catch(() => {});
  }, []);

  if (selectedCourse) {
    return (
      <CourseDetail
        course={selectedCourse}
        onBack={() => setSelectedCourse(null)}
      />
    );
  }

  const filteredCourses = selectedCategory === 'All Courses'
    ? courses
    : courses.filter(c => c.category === selectedCategory);

  return (
    <div className="courses-page" style={{ padding: '60px 0 100px', position: 'relative' }}>
      <section className="container">
        <SectionHeading>Mannjyotish Academy</SectionHeading>

        {/* Poster Image Feature */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ 
            marginTop: '40px', 
            marginBottom: '50px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          <h3 style={{ 
            fontFamily: 'var(--font-heading)', 
            marginBottom: '20px',
            color: theme.colors.primary,
            fontSize: 'clamp(1.3rem, 3vw, 1.8rem)'
          }}>
            Vedic Astrology & Occult Sciences Certification
          </h3>
          <div style={{ 
            position: 'relative', 
            maxWidth: '720px', 
            width: '100%',
            overflow: 'hidden',
            borderRadius: '20px',
            boxShadow: '0 12px 40px rgba(212,175,55,0.25)',
            border: `1px solid ${theme.colors.outline}44`
          }}>
            <img 
              src="/images/vedic-astrology-classes.jpg" 
              alt="MannJyotish Vedic Astrology Classes"
              style={{
                width: '100%',
                height: 'auto',
                display: 'block',
                borderRadius: '20px',
                transition: 'transform 0.5s ease'
              }}
            />
          </div>
        </motion.div>

        {/* Category Filters */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          flexWrap: 'wrap',
          gap: '10px',
          marginBottom: '40px',
        }}>
          {CATEGORIES.map(cat => {
            const count = cat === 'All Courses' 
              ? courses.length 
              : courses.filter(c => c.category === cat).length;

            const isSelected = selectedCategory === cat;

            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '9px 18px',
                  borderRadius: '30px',
                  border: isSelected ? '1.5px solid #d4af37' : '1px solid rgba(255,255,255,0.15)',
                  backgroundColor: isSelected ? 'rgba(212, 175, 55, 0.2)' : 'rgba(255,255,255,0.04)',
                  color: isSelected ? '#ffd700' : 'rgba(255,255,255,0.7)',
                  fontFamily: 'var(--font-heading)',
                  fontSize: '0.86rem',
                  fontWeight: isSelected ? 700 : 500,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <span>{cat}</span>
                <span style={{
                  fontSize: '0.74rem',
                  padding: '2px 7px',
                  borderRadius: '10px',
                  backgroundColor: isSelected ? '#d4af37' : 'rgba(255,255,255,0.1)',
                  color: isSelected ? '#000' : '#fff',
                  fontWeight: 700,
                }}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Course List */}
        <div style={{ marginBottom: '60px' }}>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', 
            gap: '24px',
            maxWidth: '1100px',
            margin: '0 auto'
          }}>
            {filteredCourses.map((course, index) => (
              <motion.div
                key={course.id || index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: (index % 6) * 0.08 }}
                whileHover={{ y: -6, boxShadow: '0 16px 35px rgba(0,0,0,0.5), 0 0 25px rgba(212,175,55,0.18)' }}
                style={{
                  background: 'linear-gradient(160deg, rgba(22,22,30,0.95) 0%, rgba(12,12,18,0.98) 100%)',
                  border: '1px solid rgba(212, 175, 55, 0.28)',
                  borderRadius: '20px',
                  padding: '24px 20px',
                  display: 'flex',
                  flexDirection: 'column',
                  textAlign: 'left',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
                  backdropFilter: 'blur(8px)',
                  position: 'relative',
                }}
              >
                {/* Header row: Icon + Badges */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(212,175,55,0.25) 0%, rgba(212,175,55,0.06) 70%)',
                    border: '1.5px solid rgba(212,175,55,0.45)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#d4af37',
                    boxShadow: '0 4px 14px rgba(212,175,55,0.2)',
                    flexShrink: 0
                  }}>
                    {renderIcon(course.icon)}
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                    <span style={{
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      color: '#d4af37',
                      backgroundColor: 'rgba(212,175,55,0.12)',
                      padding: '3px 8px',
                      borderRadius: '12px',
                      border: '1px solid rgba(212,175,55,0.3)'
                    }}>
                      {course.category}
                    </span>
                    <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)', display: 'flex', alignItems: 'center', gap: '3px' }}>
                      <Clock size={11} /> {course.duration}
                    </span>
                  </div>
                </div>

                {/* Title */}
                <h4 style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.18rem',
                  color: '#fff',
                  marginBottom: '10px',
                  lineHeight: 1.3,
                  fontWeight: 700
                }}>
                  {course.title}
                </h4>

                {/* Level Tag */}
                <div style={{ fontSize: '0.75rem', color: '#f5d76e', fontWeight: 600, marginBottom: '10px' }}>
                  ✦ {course.level || 'Certification Program'}
                </div>

                {/* Description */}
                <p style={{
                  fontSize: '0.84rem',
                  color: 'rgba(255,255,255,0.7)',
                  lineHeight: 1.55,
                  marginBottom: '20px',
                  flexGrow: 1,
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  fontFamily: 'var(--font-body)',
                }}>
                  {course.description}
                </p>

                {/* View Details Button */}
                <button
                  onClick={() => setSelectedCourse(course)}
                  style={{
                    width: '100%',
                    padding: '10px 18px',
                    borderRadius: '25px',
                    background: 'linear-gradient(135deg, rgba(212,175,55,0.95), rgba(184,134,11,0.95))',
                    border: 'none',
                    color: '#000',
                    fontFamily: 'var(--font-heading)',
                    fontWeight: 800,
                    fontSize: '0.86rem',
                    cursor: 'pointer',
                    letterSpacing: '0.04em',
                    boxShadow: '0 4px 15px rgba(212,175,55,0.25)',
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.02)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
                >
                  <span>✦ View Details & Syllabus</span>
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Sticky Enroll Demo Class Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        whileHover={{ scale: 1.06, boxShadow: '0 10px 35px rgba(212, 175, 55, 0.5)' }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsDemoModalOpen(true)}
        style={{
          position: 'fixed',
          bottom: '30px',
          right: '30px',
          zIndex: 99,
          background: 'linear-gradient(135deg, #d4af37 0%, #aa7c11 100%)',
          color: '#000',
          border: '1.5px solid rgba(255,255,255,0.4)',
          borderRadius: '50px',
          padding: '14px 24px',
          fontFamily: 'var(--font-heading)',
          fontWeight: 800,
          fontSize: '0.92rem',
          letterSpacing: '0.05em',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          boxShadow: '0 8px 30px rgba(0,0,0,0.5), 0 0 20px rgba(212,175,55,0.3)',
        }}
      >
        <Sparkles size={18} color="#000" />
        <span>Join Demo Class</span>
      </motion.button>

      {/* Demo Booking Modal */}
      <DemoBookingModal
        isOpen={isDemoModalOpen}
        onClose={() => setIsDemoModalOpen(false)}
      />
    </div>
  );
};

export default Courses;
