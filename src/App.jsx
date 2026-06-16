import React from 'react';
import './index.css';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/layout/Navbar';
import Hero from './components/sections/Hero';
import About from './components/sections/About';
import Footer from './components/layout/Footer';

import SectionHeading from './components/ui/SectionHeading';
import ServiceCard from './components/ui/ServiceCard';
import WisdomHub from './components/sections/WisdomHub';
import BookingForm from './components/sections/BookingForm';
import Courses from './pages/Courses';
import { FeatureModal } from './components/FeatureModal';
import { kundliFeatures, services } from './data/features';


import { useTheme } from './context/ThemeContext';
import { useState } from 'react';




import { Moon, Sun } from 'lucide-react';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedFeature, setSelectedFeature] = useState(null);
  const { themeMode, toggleTheme } = useTheme();

  return (
      <div className="app-container" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: 'var(--color-surface)', color: 'var(--color-on-surface)' }}>
        <nav style={{
          padding: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid var(--color-outline)',
          position: 'sticky',
          top: 0,
          backgroundColor: 'var(--color-surface)',
          zIndex: 1000,
          backdropFilter: 'blur(8px)'
        }}>
          <h1 
            style={{ fontSize: '1.5rem', color: '#FF9933', cursor: 'pointer', fontFamily: 'var(--font-heading)' }}
            onClick={() => setCurrentPage('home')}
          >
            Mannjyotish
          </h1>
          <ul style={{ display: 'flex', gap: '30px', listStyle: 'none', fontFamily: 'var(--font-heading)', fontWeight: '600', alignItems: 'center' }}>
            <li><a href="#" onClick={(e) => { e.preventDefault(); setCurrentPage('home'); }} style={{ color: currentPage === 'home' ? 'var(--color-primary)' : 'inherit' }}>Home</a></li>
            <li><a href="#" onClick={(e) => { e.preventDefault(); setCurrentPage('courses'); }} style={{ color: currentPage === 'courses' ? 'var(--color-primary)' : 'inherit' }}>Courses</a></li>
            <li>
              <button onClick={toggleTheme} style={{ background: 'transparent', color: 'var(--color-on-surface)', display: 'flex', alignItems: 'center' }}>
                {themeMode === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            </li>
          </ul>
        </nav>

        <main style={{ flex: 1, paddingBottom: '80px' }}>
          {currentPage === 'home' ? (
            <>
              <Hero />
              <About />
              <section className="container" style={{ marginTop: '80px', marginBottom: '80px' }}>
                <SectionHeading>Kundli Features</SectionHeading>
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
                  gap: '32px',
                  marginTop: '60px'
                }}>
                  {kundliFeatures.map(feature => (
                    <ServiceCard 
                      key={feature.id}
                      title={feature.title} 
                      description={feature.description}
                      icon={<feature.icon size={24} color="var(--color-primary)" />}
                      onClick={() => setSelectedFeature(feature)}
                      style={{ cursor: 'pointer' }}
                    />
                  ))}
                </div>
              </section>

              <section className="container" style={{ marginTop: '80px', marginBottom: '80px' }}>
                <SectionHeading>Astrology Services</SectionHeading>
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
                  gap: '32px',
                  marginTop: '60px'
                }}>
                  {services.map(service => (
                    <ServiceCard 
                      key={service.id}
                      title={service.title} 
                      description={service.description}
                      icon={<service.icon size={24} color="var(--color-primary)" />}
                      onClick={() => setSelectedFeature(service)}
                      style={{ cursor: 'pointer' }}
                    />
                  ))}
                </div>
              </section>

              <WisdomHub />
              <BookingForm />
            </>
          ) : (
            <Courses />
          )}
        </main>
        <Footer />
        {selectedFeature && (
          <FeatureModal 
            isOpen={true} 
            feature={selectedFeature} 
            onClose={() => setSelectedFeature(null)} 
          />
        )}
      </div>
  );
}

export default App;
