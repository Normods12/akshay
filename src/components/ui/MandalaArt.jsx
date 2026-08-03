/**
 * MandalaArt — Smoothly Rotating Vector Mandala Component using the 3 mandal-arts SVGs
 *
 * Props:
 *   variant   {number|string}  0 / 'floral' | 1 / 'flower' | 2 / 'outlined' (default 0)
 *   size      {number|string}  px side length or CSS unit (default 500)
 *   opacity   {number}         overall opacity (default 0.1)
 *   color     {string}         override color (default: theme primary)
 *   speed     {number}         rotation duration in seconds (default 35)
 *   direction {number}         1 for clockwise, -1 for counter-clockwise (default 1)
 *   className {string}
 *   style     {object}         extra container styles
 */
import React, { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

const MANDALA_FILES = [
  '/mandalas/mandala-1.svg', // 0: Floral Mandala
  '/mandalas/mandala-2.svg', // 1: Vintage Flower Mandala
  '/mandalas/mandala-3.svg', // 2: Outlined Mandala
];

const svgCache = {};

const MandalaArt = ({
  variant = 0,
  size = 500,
  opacity = 0.1,
  color,
  speed = 35,
  direction = 1,
  className = '',
  style = {},
}) => {
  const { colors } = useTheme();
  const themeColor = color || colors.primary || '#FF9933';
  const reduced = useReducedMotion();
  const [svgHtml, setSvgHtml] = useState('');

  // Resolve variant index (0, 1, or 2)
  let fileIndex = 0;
  if (typeof variant === 'number') {
    fileIndex = Math.abs(variant) % MANDALA_FILES.length;
  } else if (typeof variant === 'string') {
    if (variant.includes('flower') || variant === '1') fileIndex = 1;
    else if (variant.includes('outline') || variant === '2') fileIndex = 2;
    else fileIndex = 0;
  }

  const svgPath = MANDALA_FILES[fileIndex];

  useEffect(() => {
    if (svgCache[svgPath]) {
      setSvgHtml(svgCache[svgPath]);
      return;
    }
    fetch(svgPath)
      .then((res) => res.text())
      .then((text) => {
        // Clean width/height attributes so SVG scales smoothly inside container
        const cleaned = text
          .replace(/width="[^"]*"/gi, 'width="100%"')
          .replace(/height="[^"]*"/gi, 'height="100%"')
          .replace(/<svg/gi, '<svg style="width:100%;height:100%;display:block;transform-origin:50% 50%;"');
        svgCache[svgPath] = cleaned;
        setSvgHtml(cleaned);
      })
      .catch((err) => console.error('Failed to load mandala SVG:', err));
  }, [svgPath]);

  return (
    <div
      className={`mandala-art ${className}`}
      style={{
        width: size,
        height: size,
        opacity,
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        ...style,
      }}
    >
      {/* Whole component breathing pulse */}
      <motion.div
        animate={{ scale: [0.97, 1.03, 0.97], opacity: [0.85, 1, 0.85] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          width: '100%',
          height: '100%',
          position: 'relative',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          transformOrigin: '50% 50%',
        }}
      >
        {/* Continuous 360° Smooth Rotation of the SVG Vector Artwork */}
        <div
          dangerouslySetInnerHTML={{ __html: svgHtml }}
          style={{
            width: '100%',
            height: '100%',
            color: themeColor,
            fill: themeColor,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transformOrigin: '50% 50%',
            filter: `drop-shadow(0 0 10px ${themeColor}33)`,
            animation: `mandala-spin ${speed}s linear infinite ${direction < 0 ? 'reverse' : 'normal'}`,
          }}
        />
        <style>{`
          @keyframes mandala-spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </motion.div>
    </div>
  );
};

export default MandalaArt;
