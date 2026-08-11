import React from 'react';
import { motion } from 'framer-motion';

export default function WhatsAppButton() {
  const whatsappUrl = `https://wa.me/919243818146?text=${encodeURIComponent('Namaste Ashay ji! I would like to inquire about Vedic astrology consultations & pujas.')}`;

  return (
    <motion.a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 9990,
        width: '60px',
        height: '60px',
        borderRadius: '50%',
        backgroundColor: '#25D366',
        color: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 8px 24px rgba(37, 211, 102, 0.4), 0 0 0 4px rgba(37, 211, 102, 0.15)',
        cursor: 'pointer',
        textDecoration: 'none',
      }}
      title="Chat on WhatsApp"
    >
      <svg
        width="34"
        height="34"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.705 1.758zm6.637-4.472l.403.239c1.472.875 3.167 1.338 4.898 1.339 5.176 0 9.387-4.211 9.389-9.389.001-2.507-.975-4.864-2.753-6.643-1.779-1.778-4.137-2.754-6.644-2.754-5.177 0-9.389 4.212-9.39 9.389-.001 1.792.513 3.538 1.488 5.053l.263.411-1.002 3.659 3.748-.983z"/>
      </svg>
    </motion.a>
  );
}
