import React, { useEffect, useRef } from 'react';

/**
 * ShootingStars — Ultra-High-Performance Deep-Space Galaxy & Meteor Canvas
 * 
 * Performance Optimizations:
 * 1. Zero getBoundingClientRect() calls in the render loop (eliminates layout thrashing).
 * 2. Zero shadowBlur in RAF (eliminates software rasterization and GPU stutter during scroll).
 * 3. IntersectionObserver pauses the canvas loop when scrolled out of view.
 * 4. Dual-arc hardware-accelerated starlight glow with 0ms overhead.
 */
function ShootingStars({ className = '' }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationId = null;
    let isVisible = true;
    let width = window.innerWidth;
    let height = window.innerHeight;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    // Resize handling — dimensions cached strictly here, NEVER inside render()
    const handleResize = () => {
      if (!canvas) return;
      width = canvas.parentElement ? canvas.parentElement.clientWidth : window.innerWidth;
      height = canvas.parentElement ? canvas.parentElement.clientHeight : window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.resetTransform?.();
      ctx.scale(dpr, dpr);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    // ── 1. Galaxy Background Twinkling Stars ─────────────────────────
    const starCount = 75;
    const stars = [];

    class TwinkleStar {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.radius = Math.random() * 0.8 + 0.5; // 0.5px - 1.3px pinpoint
        this.baseAlpha = Math.random() * 0.35 + 0.25;
        this.twinkleSpeed = Math.random() * 0.02 + 0.008;
        this.twinklePhase = Math.random() * Math.PI * 2;
        // Star hues: crisp white, soft starlight cyan, faint golden dust
        const hues = [
          '255, 255, 255',
          '255, 255, 255',
          '210, 245, 255',
          '255, 245, 220'
        ];
        this.rgb = hues[Math.floor(Math.random() * hues.length)];
      }

      draw() {
        this.twinklePhase += this.twinkleSpeed;
        const alpha = Math.max(0.08, this.baseAlpha + Math.sin(this.twinklePhase) * 0.25);

        // Core star point
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.rgb}, ${alpha})`;
        ctx.fill();

        // Soft starlight halo without expensive shadowBlur
        if (this.radius > 0.9) {
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.radius * 2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${this.rgb}, ${alpha * 0.25})`;
          ctx.fill();
        }
      }
    }

    for (let i = 0; i < starCount; i++) {
      stars.push(new TwinkleStar());
    }

    // ── 2. Shooting Stars & Bolides ─────────────────────────────────
    const shootingStars = [];

    class ShootingStar {
      constructor(isBig = false) {
        this.isBig = isBig;
        this.init();
      }

      init() {
        // Spawn primarily along the upper and top-left perimeter
        if (Math.random() < 0.65) {
          this.x = Math.random() * (width * 0.9);
          this.y = -20;
        } else {
          this.x = -20;
          this.y = Math.random() * (height * 0.45);
        }

        // Realistic downward diagonal angle: ~33° to ~41°
        this.angle = (Math.random() * 8 + 33) * (Math.PI / 180);

        if (this.isBig) {
          // Rare Big Shooting Star (Bolide)
          this.speed = Math.random() * 5 + 14;
          this.length = Math.random() * 80 + 240;
          this.thickness = 2.2;
          this.opacity = 1.0;
          this.fadeRate = 0.009;
        } else {
          // Subtle Needle-Thin Meteor
          this.speed = Math.random() * 5 + 10;
          this.length = Math.random() * 50 + 80;
          this.thickness = 1.1;
          this.opacity = Math.random() * 0.25 + 0.75;
          this.fadeRate = 0.016;
        }

        this.vx = Math.cos(this.angle) * this.speed;
        this.vy = Math.sin(this.angle) * this.speed;
        this.isDead = false;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.opacity -= this.fadeRate;

        if (this.opacity <= 0 || this.x > width + 100 || this.y > height + 100) {
          this.isDead = true;
        }
      }

      draw() {
        if (this.isDead || this.opacity <= 0) return;

        const tailX = this.x - Math.cos(this.angle) * this.length;
        const tailY = this.y - Math.sin(this.angle) * this.length;

        // Linear gradient stroke: zero CPU shadowBlur overhead
        const gradient = ctx.createLinearGradient(tailX, tailY, this.x, this.y);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
        gradient.addColorStop(0.7, `rgba(255, 255, 255, ${this.opacity * 0.35})`);
        gradient.addColorStop(1, `rgba(255, 255, 255, ${this.opacity})`);

        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(this.x, this.y);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = this.thickness;
        ctx.lineCap = 'round';
        ctx.stroke();

        // Glowing head point
        if (this.isBig) {
          ctx.beginPath();
          ctx.arc(this.x, this.y, 2.2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
          ctx.fill();

          ctx.beginPath();
          ctx.arc(this.x, this.y, 4.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(0, 244, 255, ${this.opacity * 0.3})`;
          ctx.fill();
        }
      }
    }

    // ── 3. Spawning Timers ───────────────────────────────────────────
    let nextRegularMeteorTime = Date.now() + 1500;
    let nextBigMeteorTime = Date.now() + 6500;

    // ── 4. Main 60fps Animation Loop ────────────────────────────────
    const render = () => {
      if (!isVisible) {
        animationId = null;
        return;
      }

      const now = Date.now();
      ctx.clearRect(0, 0, width, height);

      // Draw background galaxy stars
      for (let i = 0; i < stars.length; i++) {
        stars[i].draw();
      }

      // Spawn regular shooting stars
      if (now >= nextRegularMeteorTime) {
        shootingStars.push(new ShootingStar(false));
        nextRegularMeteorTime = now + Math.random() * 2000 + 2600;
      }

      // Spawn big shooting star
      if (now >= nextBigMeteorTime) {
        shootingStars.push(new ShootingStar(true));
        nextBigMeteorTime = now + Math.random() * 5000 + 11000;
      }

      // Update and draw active meteors
      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const star = shootingStars[i];
        star.update();
        star.draw();
        if (star.isDead) {
          shootingStars.splice(i, 1);
        }
      }

      animationId = requestAnimationFrame(render);
    };

    // ── 5. IntersectionObserver: Pause loop when scrolled off-screen ──
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible && !animationId) {
          animationId = requestAnimationFrame(render);
        }
      },
      { threshold: 0.05 }
    );

    observer.observe(canvas);
    animationId = requestAnimationFrame(render);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', handleResize);
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none ${className}`}
      style={{ display: 'block', width: '100%', height: '100%' }}
    />
  );
}

export default ShootingStars;
