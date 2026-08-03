import React, { useEffect, useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';

/**
 * ConstellationLines — Canvas constellation dots connected with animated stroke lines.
 * Used as a decorative background in sections (About, CTABanner).
 */

// Predefined zodiac-inspired constellation point patterns
const CONSTELLATION_SETS = [
  // Orion-like
  [
    [0.15, 0.2], [0.25, 0.35], [0.22, 0.5], [0.18, 0.65],
    [0.28, 0.65], [0.25, 0.5], [0.35, 0.35], [0.3, 0.2],
    [0.22, 0.15], [0.28, 0.15]
  ],
  // Scorpio-like
  [
    [0.55, 0.15], [0.6, 0.25], [0.65, 0.3], [0.7, 0.4],
    [0.75, 0.5], [0.8, 0.55], [0.85, 0.6], [0.82, 0.7],
    [0.78, 0.75], [0.72, 0.8]
  ],
  // Ursa Minor-like (right side)
  [
    [0.45, 0.1], [0.5, 0.2], [0.6, 0.25], [0.65, 0.35],
    [0.55, 0.4], [0.5, 0.5], [0.45, 0.6]
  ]
];

const ConstellationLines = ({ opacity = 0.18 }) => {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const { themeMode } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    const starColor = themeMode === 'dark' ? '#d4af37' : '#FF9933';
    const lineColor = themeMode === 'dark' ? '#d4af37' : '#FF9933';

    // Build actual pixel coordinates
    const constellations = CONSTELLATION_SETS.map(pts =>
      pts.map(([rx, ry]) => ({
        x: rx * canvas.offsetWidth,
        y: ry * canvas.offsetHeight,
        r: Math.random() * 2 + 1.2,
        twinkle: Math.random(),
        twinkleSpeed: Math.random() * 0.015 + 0.005,
      }))
    );

    // Line progress for draw-on animation
    const lineProgress = CONSTELLATION_SETS.map(s => Array(s.length - 1).fill(0));
    const lineSpeed = 0.004;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      constellations.forEach((pts, ci) => {
        // Draw connecting lines with animated progress
        for (let i = 0; i < pts.length - 1; i++) {
          const p = lineProgress[ci][i];
          const newP = Math.min(1, p + lineSpeed);
          lineProgress[ci][i] = newP;

          // Oscillate opacity for breathing effect
          const breathe = 0.4 + 0.4 * Math.sin(Date.now() / 2000 + ci * 1.2 + i * 0.5);

          const a = pts[i], b = pts[i + 1];
          const ex = a.x + (b.x - a.x) * newP;
          const ey = a.y + (b.y - a.y) * newP;

          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(ex, ey);
          ctx.strokeStyle = lineColor;
          ctx.globalAlpha = breathe * 0.7;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }

        // Draw stars
        pts.forEach(star => {
          star.twinkle += star.twinkleSpeed;
          const alpha = 0.5 + 0.5 * Math.sin(star.twinkle);

          // Glow halo
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.r + 2.5, 0, Math.PI * 2);
          ctx.fillStyle = starColor;
          ctx.globalAlpha = alpha * 0.15;
          ctx.fill();

          // Core star
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
          ctx.fillStyle = starColor;
          ctx.globalAlpha = alpha * 0.9;
          ctx.fill();
        });
      });

      ctx.globalAlpha = 1;
      animRef.current = requestAnimationFrame(draw);
    };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();
    animRef.current = requestAnimationFrame(draw);

    return () => {
      ro.disconnect();
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [themeMode]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        opacity,
        zIndex: 0,
      }}
    />
  );
};

export default ConstellationLines;
