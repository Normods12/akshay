import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import AnimatedElements from '../components/ui/AnimatedElements';

const shopCategories = [
  {
    id: 'gemstones',
    title: 'Gemstones',
    price: 'Starting from ₹1,999',
    image: '/images/shop_gemstones.png',
    delay: 0.1
  },
  {
    id: 'rudraksha',
    title: 'Rudraksha',
    price: 'Starting from ₹999',
    image: '/images/shop_rudraksha.png',
    delay: 0.2
  },
  {
    id: 'bracelets',
    title: 'Bracelets',
    price: 'Starting from ₹599',
    image: '/images/shop_bracelets.png',
    delay: 0.3
  },
  {
    id: 'crystals',
    title: 'Crystal & Trees',
    price: 'Starting from ₹599',
    image: '/images/shop_crystals.png',
    delay: 0.4
  }
];

const Shop = () => {
  const theme = useTheme();

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      style={{ 
        position: 'relative', 
        minHeight: 'calc(100vh - 80px)', 
        padding: '80px 20px',
        backgroundColor: theme.colors.surface
      }}
    >
      <AnimatedElements 
        size={400} 
        opacity={0.06} 
        style={{
          position: 'absolute',
          bottom: '5%',
          right: '5%',
          zIndex: 0
        }}
      />
      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: '60px' }}
        >
          <h1 style={{ 
            fontFamily: 'var(--font-heading)', 
            fontSize: 'clamp(2.5rem, 4vw, 3.5rem)', 
            color: theme.colors.primary,
            lineHeight: 1.2,
            marginBottom: '16px'
          }}>
            Sacred Energy Tools
          </h1>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: '1.2rem',
            color: theme.colors.text,
            opacity: 0.9,
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            Enhance your spiritual journey and balance your energy with our authentic, certified selection of sacred items.
          </p>
        </motion.div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '30px'
        }}>
          {shopCategories.map((category) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: category.delay }}
              whileHover={{ y: -10 }}
              style={{
                borderRadius: '16px',
                overflow: 'hidden',
                backgroundColor: 'var(--color-surface-variant)',
                border: `1px solid ${theme.colors.outline}33`,
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <div style={{ height: '240px', overflow: 'hidden' }}>
                <img 
                  src={category.image} 
                  alt={category.title} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                />
              </div>
              <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', color: theme.colors.text, marginBottom: '8px' }}>
                  {category.title}
                </h3>
                <p style={{ fontFamily: 'var(--font-body)', color: theme.colors.text, opacity: 0.8, marginBottom: '24px', flexGrow: 1 }}>
                  {category.price}
                </p>
                <button
                  style={{
                    padding: '12px',
                    width: '100%',
                    borderRadius: '8px',
                    border: `1px solid ${theme.colors.primary}`,
                    backgroundColor: 'transparent',
                    color: theme.colors.primary,
                    fontFamily: 'var(--font-heading)',
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.3s'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = theme.colors.primary;
                    e.target.style.color = '#fff';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'transparent';
                    e.target.style.color = theme.colors.primary;
                  }}
                >
                  Shop now
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default Shop;
