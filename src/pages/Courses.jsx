import React from 'react';
import { useTheme } from '../context/ThemeContext';
import SectionHeading from '../components/ui/SectionHeading';
import VedicButton from '../components/ui/VedicButton';
import ServiceCard from '../components/ui/ServiceCard';
import { SunIcon, TelescopeIcon, CardIcon } from '../components/ui/Icons';
import { motion } from 'framer-motion';

const Courses = () => {
  const theme = useTheme();

  const courseList = [
    {
      title: "Foundation of Jyotish",
      description: "Learn the fundamentals of Vedic Astrology, planetary alignments, and the logic behind the 12 houses.",
      icon: <SunIcon />
    },
    {
      title: "Advanced Chart Reading",
      description: "Master the art of synthesis. Learn how to combine Dashas, transits, and Nakshatras for accurate predictions.",
      icon: <TelescopeIcon />
    },
    {
      title: "The Art of Tarot",
      description: "A deep dive into our unique Vedic-Tarot fusion. Learn to read cards through the lens of ancient spiritual archetypes.",
      icon: <CardIcon />
    }
  ];

  const handleEnroll = (courseTitle) => {
    const phoneNumber = "919243818146";
    const message = `Hi Ashay, I am interested in enrolling for the "${courseTitle}" course. Please provide more details.`;
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="courses-page" style={{ padding: '60px 0' }}>
      <section className="container">
        <SectionHeading>Mannjyotish Academy</SectionHeading>
        
        {/* Video Feature */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ 
            marginTop: '60px', 
            marginBottom: '80px',
            textAlign: 'center'
          }}
        >
          <h3 style={{ 
            fontFamily: 'var(--font-heading)', 
            marginBottom: '32px',
            color: theme.colors.primary 
          }}>
            Introduction to Vedic Wisdom
          </h3>
          <div style={{ 
            position: 'relative', 
            paddingBottom: '56.25%', 
            height: 0, 
            overflow: 'hidden',
            borderRadius: '16px',
            boxShadow: 'var(--shadow-gold)',
            backgroundColor: '#000',
            border: `1px solid ${theme.colors.outline}33`
          }}>
            <iframe 
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                border: 0
              }}
              src="https://www.youtube.com/embed/2GasDsqo8JA?list=PLiUoKTT-PqD2ese2Ww4bJQvZ-7C7CEKnB" 
              title="Introduction to Vedic Wisdom"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
            ></iframe>
          </div>
        </motion.div>

        {/* Course List */}
        <div style={{ marginBottom: '60px' }}>
          <motion.h3 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ 
            fontFamily: 'var(--font-heading)', 
            fontSize: '2rem', 
            marginBottom: '48px',
            textAlign: 'center',
            color: theme.colors.text
          }}>
            Available Courses
          </motion.h3>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: '32px' 
          }}>
            {courseList.map((course, index) => (
              <ServiceCard 
                key={index}
                title={course.title}
                description={course.description}
                icon={course.icon}
                style={{ position: 'relative', paddingBottom: '80px' }}
              >
                <div style={{ 
                  position: 'absolute', 
                  bottom: '24px', 
                  left: '24px', 
                  right: '24px' 
                }}>
                  <VedicButton 
                    style={{ width: '100%' }}
                    onClick={() => handleEnroll(course.title)}
                  >
                    Enroll Now
                  </VedicButton>
                </div>
              </ServiceCard>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Courses;
