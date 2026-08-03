import React, { useEffect, useRef } from 'react';

/**
 * CosmicStarfield — Canvas starfield with twinkling stars, shooting meteors,
 * and mouse-reactive parallax drift. Zero dependencies.
 */
const CosmicStarfield = ({ starCount = 150, opacity = 0.6, mouseReactive = false, meteorShower = false }) => {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const starsRef = useRef([]);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const meteorsRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      initStars();
    };

    const initStars = () => {
      starsRef.current = Array.from({ length: starCount }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        ox: 0, oy: 0,  // offset from mouse parallax
        r: Math.random() * 1.5 + 0.3,
        alpha: Math.random(),
        alphaSpeed: (Math.random() * 0.008 + 0.002) * (Math.random() > 0.5 ? 1 : -1),
        depth: Math.random() * 0.8 + 0.2, // parallax depth
        color: Math.random() > 0.85
          ? `hsl(${40 + Math.random() * 20}, 100%, 80%)`
          : `hsl(${200 + Math.random() * 60}, 60%, 90%)`,
      }));
    };

    const spawnMeteor = () => {
      const startX = Math.random() * canvas.width * 0.9;
      meteorsRef.current.push({
        x: startX, y: -50,
        vx: Math.random() * 8 + 6,
        vy: Math.random() * 6 + 4,
        len: Math.random() * 200 + 150,
        alpha: 1.5,
        width: Math.random() * 2 + 1,
      });
    };

    // Mouse tracking
    const handleMouse = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    if (mouseReactive) {
      window.addEventListener('mousemove', handleMouse, { passive: true });
    }

    let lastMeteor = 0;
    let meteorInterval = meteorShower ? 800 + Math.random() * 1500 : 4000 + Math.random() * 5000;

    const draw = (ts) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      starsRef.current.forEach(star => {
        star.alpha += star.alphaSpeed;
        if (star.alpha <= 0 || star.alpha >= 1) star.alphaSpeed *= -1;
        star.alpha = Math.max(0.05, Math.min(1, star.alpha));

        // Mouse parallax
        let px = star.x, py = star.y;
        if (mouseReactive && mx > -9000) {
          const targetOx = ((mx - cx) / cx) * 12 * star.depth;
          const targetOy = ((my - cy) / cy) * 8 * star.depth;
          star.ox += (targetOx - star.ox) * 0.04;
          star.oy += (targetOy - star.oy) * 0.04;
          px = star.x + star.ox;
          py = star.y + star.oy;
        }

        ctx.beginPath();
        ctx.arc(px, py, star.r, 0, Math.PI * 2);
        ctx.fillStyle = star.color;
        ctx.globalAlpha = star.alpha * 0.8;
        ctx.fill();

        // Cross-sparkle for brighter stars
        if (star.r > 1.2 && star.alpha > 0.7) {
          ctx.globalAlpha = star.alpha * 0.35;
          ctx.strokeStyle = star.color;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(px - star.r * 3, py);
          ctx.lineTo(px + star.r * 3, py);
          ctx.moveTo(px, py - star.r * 3);
          ctx.lineTo(px, py + star.r * 3);
          ctx.stroke();
        }
      });

      // Meteors
      if (ts - lastMeteor > meteorInterval) { 
        if (meteorShower) {
          const burst = Math.floor(Math.random() * 3) + 1;
          for (let i = 0; i < burst; i++) setTimeout(spawnMeteor, Math.random() * 300);
        } else {
          spawnMeteor(); 
        }
        lastMeteor = ts; 
        meteorInterval = meteorShower ? 600 + Math.random() * 1200 : 4000 + Math.random() * 5000;
      }
      meteorsRef.current = meteorsRef.current.filter(m => m.alpha > 0.01);
      meteorsRef.current.forEach(m => {
        const grad = ctx.createLinearGradient(m.x - m.vx * m.len / 10, m.y - m.vy * m.len / 10, m.x, m.y);
        grad.addColorStop(0, `rgba(255,255,255,0)`);
        grad.addColorStop(0.5, `rgba(255,220,150,${Math.min(m.alpha * 0.8, 1)})`);
        grad.addColorStop(1, `rgba(255,255,255,${Math.min(m.alpha * 1.5, 1)})`);
        ctx.beginPath();
        ctx.moveTo(m.x - m.vx * m.len / 10, m.y - m.vy * m.len / 10);
        ctx.lineTo(m.x, m.y);
        ctx.strokeStyle = grad;
        ctx.lineWidth = m.width;
        ctx.globalAlpha = Math.min(m.alpha, 1);
        ctx.stroke();
        m.x += m.vx; m.y += m.vy; m.alpha -= 0.02;
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
      if (mouseReactive) window.removeEventListener('mousemove', handleMouse);
    };
  }, [starCount, mouseReactive]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute', inset: 0,
        width: '100%', height: '100%',
        pointerEvents: 'none', opacity, zIndex: 0,
      }}
    />
  );
};

export default CosmicStarfield;
