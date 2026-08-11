import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import AnimatedElements from '../components/ui/AnimatedElements';

const INITIAL_SHOP_ITEMS = [
  {
    id: 'shop-1',
    title: 'Gemstones',
    price: 'Starting from ₹1,999',
    category: 'gemstones',
    image: '/images/shop_gemstones.png'
  },
  {
    id: 'shop-2',
    title: 'Rudraksha',
    price: 'Starting from ₹999',
    category: 'rudraksha',
    image: '/images/shop_rudraksha.png'
  },
  {
    id: 'shop-3',
    title: 'Bracelets',
    price: 'Starting from ₹599',
    category: 'bracelets',
    image: '/images/shop_bracelets.png'
  },
  {
    id: 'shop-4',
    title: 'Crystal & Trees',
    price: 'Starting from ₹599',
    category: 'crystals',
    image: '/images/shop_crystals.png'
  }
];

const Shop = ({ onBookService }) => {
  const theme = useTheme();
  const [items, setItems] = useState(INITIAL_SHOP_ITEMS);

  useEffect(() => {
    fetch('/api/shop')
      .then(res => res.json())
      .then(data => {
        if (data.data && Array.isArray(data.data) && data.data.length > 0) {
          setItems(data.data);
        }
      })
      .catch(() => {
        fetch('http://localhost:3001/api/shop')
          .then(r => r.json())
          .then(d => { if (d.data && d.data.length > 0) setItems(d.data); })
          .catch(e => console.warn('Shop fetch warning:', e));
      });
  }, []);

  const handleShopClick = (item) => {
    const phoneNumber = "919243818146";
    const msg = `Namaste Ashay ji, I am interested in purchasing "${item.title}" (${item.price || ''}). Please share details and ordering instructions.`;
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(msg)}`, '_blank');
  };

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
          {items.map((item, idx) => {
            const imgSrc = item.image ? (item.image.startsWith('/uploads') ? `http://localhost:3001${item.image}` : item.image) : '/images/shop_gemstones.png';
            const displayPrice = item.price ? (item.price.toString().startsWith('₹') || item.price.toString().toLowerCase().includes('starting') ? item.price : `₹${item.price}`) : 'Price on Request';

            return (
              <motion.div
                key={item.id || idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: (idx % 4) * 0.1 }}
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
                <div style={{ height: '240px', overflow: 'hidden', position: 'relative' }}>
                  <img 
                    src={imgSrc} 
                    alt={item.title} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => {
                      if (item.image && item.image.startsWith('/uploads') && !e.target.dataset.triedRelative) {
                        e.target.dataset.triedRelative = 'true';
                        e.target.src = item.image;
                      }
                    }}
                  />
                  {item.category && (
                    <span style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(0,0,0,0.7)', color: theme.colors.primary, fontSize: '0.75rem', fontWeight: 700, padding: '4px 10px', borderRadius: '12px', border: `1px solid ${theme.colors.primary}44`, textTransform: 'uppercase' }}>
                      {item.category}
                    </span>
                  )}
                </div>
                <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                  <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', color: theme.colors.text, marginBottom: '8px' }}>
                    {item.title}
                  </h3>
                  <p style={{ fontFamily: 'var(--font-body)', color: theme.colors.primary, fontWeight: 700, fontSize: '1.1rem', marginBottom: '24px', flexGrow: 1 }}>
                    {displayPrice}
                  </p>
                  <button
                    onClick={() => handleShopClick(item)}
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
                    Shop now ✦
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

export default Shop;
