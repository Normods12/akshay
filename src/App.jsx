import React from 'react';
import './index.css';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/layout/Navbar';
import Hero from './components/sections/Hero';
import RashiBox from './components/sections/RashiBox';
import BookingCategories from './components/sections/BookingCategories';
import HandmadeKundliCTA from './components/sections/HandmadeKundliCTA';
import FreeCalculators from './components/sections/FreeCalculators';
import NavagrahaBooking from './components/sections/NavagrahaBooking';
import StatsCounter from './components/sections/StatsCounter';
import Testimonials from './components/sections/Testimonials';
import ContactDetails from './components/sections/ContactDetails';
import BookingForm from './components/sections/BookingForm';
import Footer from './components/layout/Footer';
import Courses from './pages/Courses';
import FreeKundli from './pages/FreeKundli';
import Matchmaking from './pages/Matchmaking';
import MoonSignCalculator from './pages/MoonSignCalculator';
import Shop from './pages/Shop';
import Puja from './pages/Puja';
import { FeatureModal } from './components/FeatureModal';
import { kundliFeatures, services } from './data/features';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedSign, setSelectedSign] = useState('aries');
  const [selectedFeature, setSelectedFeature] = useState(null);

  return (
      <div className="app-container" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: 'var(--color-surface)', color: 'var(--color-on-surface)' }}>
        <Navbar 
          currentPage={currentPage} 
          setCurrentPage={setCurrentPage} 
        />

        <main style={{ flex: 1 }}>
          <AnimatePresence mode="wait">
            {currentPage === 'home' ? (
              <motion.div 
                key="home"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <Hero />
                <RashiBox setCurrentPage={setCurrentPage} setSelectedSign={setSelectedSign} />
                <BookingCategories setSelectedFeature={setSelectedFeature} />
                <HandmadeKundliCTA />
                <FreeCalculators setCurrentPage={setCurrentPage} />
                <NavagrahaBooking setSelectedFeature={setSelectedFeature} />
                
                {/* Stats & Reviews — each manages its own padding via .section */}
                <StatsCounter />
                <Testimonials />

                <ContactDetails />
                <BookingForm />
              </motion.div>
            ) : currentPage === 'courses' ? (
              <Courses key="courses" />
            ) : currentPage === 'free-kundli' ? (
              <FreeKundli key="free-kundli" />
            ) : currentPage === 'moon-sign' ? (
              <MoonSignCalculator key="moon-sign" />
            ) : currentPage === 'matchmaking' ? (
              <Matchmaking key="matchmaking" />
            ) : currentPage === 'shop' ? (
              <Shop key="shop" />
            ) : currentPage === 'puja' ? (
              <Puja key="puja" />
            ) : null}
          </AnimatePresence>
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
