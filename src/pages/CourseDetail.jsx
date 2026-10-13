import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Play, Calendar, CheckCircle2, BookOpen, Clock, Users, ShieldCheck } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import CourseCertificate from '../components/ui/CourseCertificate';
import DemoBookingModal from '../components/ui/DemoBookingModal';
import MandalaArt from '../components/ui/MandalaArt';

export default function CourseDetail({ course, onBack }) {
  const theme = useTheme();
  const [isDemoOpen, setIsDemoOpen] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  if (!course) return null;

  const handleEnrollWhatsApp = () => {
    const phoneNumber = "917000742315";
    const message = `Namaste Acharya Ashay ji! I am interested in enrolling for the "${course.title}" certification course at MannJyotish Academy. Please share details regarding fees and schedule.`;
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
  };

  // Syllabus modules based on course
  const syllabusModules = [
    {
      title: 'Module 1: Jyotish Shastra Foundations',
      desc: 'Understanding the cosmic blueprint, 12 Rashis (zodiac signs), 12 Bhavas (houses), and their spiritual archetypes.'
    },
    {
      title: 'Module 2: Graha Vidya & Planetary Influences',
      desc: 'Deep study of the Navagrahas, planetary dignities, exaltation, debilitation, aspects (Drishti), and planetary friendships.'
    },
    {
      title: 'Module 3: Nakshatra Vidya & Stellar Energies',
      desc: 'The 27 lunar constellations, their ruling deities, padas, and subtle psychological traits for high precision prediction.'
    },
    {
      title: 'Module 4: Bhava Vidya & Life Synthesis',
      desc: 'Mapping planetary energies to Career, Marriage, Wealth, Health, and Spiritual Moksha.'
    },
    {
      title: 'Module 5: Dasha Systems & Practical Remedial Jyotish',
      desc: 'Vimshottari Dasha calculations, transits (Gochar), classical gemstone, mantra, and daan remedies rooted in the Radhavallabh tradition.'
    }
  ];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#09090e', color: '#fff', padding: '40px 20px 100px', position: 'relative' }}>
      <MandalaArt
        variant={0}
        size={500}
        opacity={0.06}
        style={{ position: 'fixed', top: '10%', right: '-150px', zIndex: 0, pointerEvents: 'none' }}
      />
      <MandalaArt
        variant={2}
        size={450}
        opacity={0.05}
        style={{ position: 'fixed', bottom: '10%', left: '-150px', zIndex: 0, pointerEvents: 'none' }}
        direction={-1}
      />

      <div className="container" style={{ maxWidth: '900px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        {/* Back Button */}
        <button
          onClick={onBack}
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
            marginBottom: '32px',
          }}
          onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'rgba(212, 175, 55, 0.15)'; }}
          onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)'; }}
        >
          <ArrowLeft size={16} />
          <span>Back to All Courses</span>
        </button>

        {/* Course Header */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{
            display: 'inline-block',
            padding: '4px 14px',
            borderRadius: '20px',
            backgroundColor: 'rgba(212, 175, 55, 0.15)',
            border: '1px solid rgba(212, 175, 55, 0.35)',
            color: '#d4af37',
            fontSize: '0.78rem',
            fontFamily: 'var(--font-heading)',
            fontWeight: 700,
            letterSpacing: '0.06em',
            marginBottom: '12px'
          }}>
            ✦ VEDIC CERTIFICATION PROGRAM
          </div>

          <h1 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(1.8rem, 4.5vw, 2.8rem)',
            color: '#fff',
            lineHeight: 1.2,
            marginBottom: '16px'
          }}>
            {course.title}
          </h1>

          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', fontSize: '0.88rem', color: 'rgba(255,255,255,0.7)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Clock size={16} color="#d4af37" /> {course.duration || '3 Months'} · Live + Recorded
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Users size={16} color="#d4af37" /> Mentored by Acharya Ashay Ji
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ShieldCheck size={16} color="#d4af37" /> {course.certification || 'Official Certificate Included'}
            </span>
          </div>
        </div>

        {/* 1. YouTube Video Section (Attached from Admin Panel or Placeholder) */}
        <div style={{
          marginBottom: '48px',
          borderRadius: '20px',
          overflow: 'hidden',
          border: '1.5px solid rgba(212, 175, 55, 0.35)',
          boxShadow: '0 16px 50px rgba(0,0,0,0.7), 0 0 30px rgba(212,175,55,0.12)',
          background: '#0a0a0f',
        }}>
          {course.youtubeUrl ? (
            <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden' }}>
              <iframe
                src={course.youtubeUrl.includes('embed') ? course.youtubeUrl : course.youtubeUrl.replace('watch?v=', 'embed/')}
                title={course.title}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  border: 'none'
                }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : (
            <div style={{
              padding: '60px 20px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'radial-gradient(ellipse at center, rgba(212,175,55,0.12) 0%, #0d0c13 80%)',
            }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: 'rgba(212, 175, 55, 0.2)',
                border: '2px solid #d4af37',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#d4af37',
                marginBottom: '16px',
                boxShadow: '0 0 25px rgba(212,175,55,0.35)'
              }}>
                <Play size={28} style={{ marginLeft: '4px' }} />
              </div>
              <h3 style={{ fontFamily: 'var(--font-heading)', color: '#d4af37', fontSize: '1.3rem', marginBottom: '8px' }}>
                Course Lecture & Practical Demonstration
              </h3>
              <p style={{ maxWidth: '520px', color: 'rgba(255,255,255,0.65)', fontSize: '0.88rem', lineHeight: 1.5, margin: '0 0 20px' }}>
                Preview lectures and demo recordings are attached dynamically. Enroll in the live demo class to attend this week's interactive session directly with Acharya Ji!
              </p>
              <button
                onClick={() => setIsDemoOpen(true)}
                style={{
                  padding: '10px 24px',
                  borderRadius: '25px',
                  background: 'linear-gradient(135deg, #d4af37, #b8860b)',
                  border: 'none',
                  color: '#000',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  fontFamily: 'var(--font-heading)',
                  cursor: 'pointer'
                }}
              >
                Join Free Demo Class (1st of Next Month)
              </button>
            </div>
          )}
        </div>

        {/* 2. Course Description & Curriculum */}
        <div style={{
          background: 'rgba(18, 18, 25, 0.8)',
          border: '1px solid rgba(212, 175, 55, 0.25)',
          borderRadius: '20px',
          padding: '36px',
          marginBottom: '48px',
          boxShadow: '0 10px 35px rgba(0,0,0,0.4)',
        }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', color: '#d4af37', fontSize: '1.5rem', marginBottom: '16px' }}>
            Course Overview & Curriculum
          </h2>
          <p style={{ fontSize: '1rem', lineHeight: 1.7, color: 'rgba(255,255,255,0.85)', marginBottom: '28px', fontFamily: 'var(--font-body)' }}>
            {course.description}
          </p>

          <h3 style={{ fontFamily: 'var(--font-heading)', color: '#fff', fontSize: '1.2rem', marginBottom: '18px' }}>
            What You Will Learn:
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '32px' }}>
            {Array.isArray(course.whatYouLearn) && course.whatYouLearn.length > 0 ? (
              course.whatYouLearn.map((item, idx) => (
                <div key={idx} style={{
                  padding: '14px 18px',
                  borderRadius: '12px',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(212,175,55,0.15)',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                }}>
                  <span style={{ color: '#d4af37', fontSize: '1.1rem', marginTop: '-2px' }}>✦</span>
                  <div style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.9rem', lineHeight: 1.5 }}>
                    {item}
                  </div>
                </div>
              ))
            ) : (
              syllabusModules.map((mod, idx) => (
                <div key={idx} style={{
                  padding: '14px 18px',
                  borderRadius: '12px',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(212,175,55,0.15)',
                }}>
                  <div style={{ color: '#d4af37', fontWeight: 700, fontSize: '0.92rem', marginBottom: '4px' }}>
                    {mod.title}
                  </div>
                  <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', lineHeight: 1.5 }}>
                    {mod.desc}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Ideal For Section */}
          {course.idealFor && (
            <div style={{
              padding: '16px 20px',
              borderRadius: '14px',
              background: 'rgba(212,175,55,0.08)',
              border: '1px dashed rgba(212,175,55,0.3)',
              marginBottom: '28px',
            }}>
              <div style={{ color: '#d4af37', fontWeight: 700, fontSize: '0.88rem', textTransform: 'uppercase', marginBottom: '4px' }}>
                🎯 Ideal For / Who Can Join:
              </div>
              <div style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.9rem', lineHeight: 1.5 }}>
                {course.idealFor}
              </div>
            </div>
          )}

          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
            borderTop: '1px solid rgba(212,175,55,0.2)',
            paddingTop: '24px'
          }}>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase' }}>Admission & Enrollment</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>Direct Acharya Mentorship</div>
            </div>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <button
                onClick={() => setIsDemoOpen(true)}
                style={{
                  padding: '11px 22px',
                  borderRadius: '30px',
                  background: 'rgba(212, 175, 55, 0.12)',
                  border: '1.5px solid #d4af37',
                  color: '#d4af37',
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  cursor: 'pointer'
                }}
              >
                Enroll Free Demo Class
              </button>
              <button
                onClick={handleEnrollWhatsApp}
                style={{
                  padding: '11px 24px',
                  borderRadius: '30px',
                  background: 'linear-gradient(135deg, #25D366, #128C7E)',
                  border: 'none',
                  color: '#fff',
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  boxShadow: '0 4px 15px rgba(37,211,102,0.35)'
                }}
              >
                Enroll via WhatsApp
              </button>
            </div>
          </div>
        </div>

        {/* 3. The Sacred Course Certificate Showcase */}
        <div style={{ marginBottom: '60px' }}>
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              color: '#d4af37',
              fontSize: '0.78rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: '8px'
            }}>
              <span>📜</span> OFFICIAL ACCREDITATION
            </div>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.4rem, 3.5vw, 2rem)', color: '#fff', margin: 0 }}>
              Course Certificate Included
            </h2>
            <p style={{ maxWidth: '580px', margin: '8px auto 0', color: 'rgba(255,255,255,0.65)', fontSize: '0.88rem' }}>
              Upon successful completion of the course and practical horoscope interpretation, each scholar is awarded an official, signed, and stamped Certificate from MannJyotish Academy.
            </p>
          </div>

          <CourseCertificate courseTitle={course.title} />
        </div>
      </div>

      <DemoBookingModal
        isOpen={isDemoOpen}
        onClose={() => setIsDemoOpen(false)}
        preselectedCourse={course.title}
      />
    </div>
  );
}
