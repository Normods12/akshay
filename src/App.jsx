import React from 'react';
import './index.css';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
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
import Gallery from './pages/Gallery';
import AdminPanel from './pages/AdminPanel';
import BookingModal from './components/BookingModal';
import WhatsAppButton from './components/ui/WhatsAppButton';
import AiChatbot from './components/ui/AiChatbot';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedSign, setSelectedSign] = useState('aries');
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [bookingService, setBookingService] = useState(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  const handleOpenBooking = (service) => {
    setBookingService(service);
    setIsBookingOpen(true);
  };

  return (
    <AuthProvider>
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
                <Hero setCurrentPage={setCurrentPage} />
                <RashiBox setCurrentPage={setCurrentPage} setSelectedSign={setSelectedSign} />
                <BookingCategories onBookService={handleOpenBooking} />
                <HandmadeKundliCTA />
                <FreeCalculators setCurrentPage={setCurrentPage} />
                <NavagrahaBooking onBookService={handleOpenBooking} />
                
                {/* Stats & Reviews */}
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
            ) : (currentPage === 'puja' || currentPage === 'pooja') ? (
              <Puja key="puja" onBookService={handleOpenBooking} />
            ) : currentPage === 'gallery' ? (
              <Gallery key="gallery" setCurrentPage={setCurrentPage} />
            ) : currentPage === 'admin' ? (
              <AdminPanel key="admin" setCurrentPage={setCurrentPage} />
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
        <BookingModal
          isOpen={isBookingOpen}
          onClose={() => setIsBookingOpen(false)}
          initialService={bookingService}
        />
        <WhatsAppButton />
        <AiChatbot onBookService={handleOpenBooking} />
      </div>
    </AuthProvider>
  );
}

export default App;
