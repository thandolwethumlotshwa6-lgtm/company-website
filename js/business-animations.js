// js/business-animations.js
// Shared animations for all business pages

(function () {
  'use strict';

  // ===== 1. FLOATING PARTICLES CANVAS =====
  function initParticleCanvas(canvasId, themeColor) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let W, H;

    function resize() {
      W = canvas.width = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    const particles = [];
    const COUNT = 70;

    class Particle {
      constructor() {
        this.reset();
        this.y = Math.random() * H;
      }
      reset() {
        this.x = Math.random() * W;
        this.y = H + Math.random() * 100;
        this.radius = Math.random() * 4 + 1;
        this.speedY = -(Math.random() * 0.8 + 0.3);
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.alpha = Math.random() * 0.5 + 0.2;
        this.phase = Math.random() * Math.PI * 2;
      }
      update() {
        this.y += this.speedY;
        this.phase += 0.02;
        this.x += Math.sin(this.phase) * 0.4 + this.speedX;
        if (this.y < -20) this.reset();
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${themeColor.r}, ${themeColor.g}, ${themeColor.b}, ${this.alpha})`;
        ctx.fill();

        // glow
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius * 3, 0, Math.PI * 2);
        const glow = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius * 3);
        glow.addColorStop(0, `rgba(${themeColor.r}, ${themeColor.g}, ${themeColor.b}, ${this.alpha * 0.4})`);
        glow.addColorStop(1, `rgba(${themeColor.r}, ${themeColor.g}, ${themeColor.b}, 0)`);
        ctx.fillStyle = glow;
        ctx.fill();
      }
    }

    for (let i = 0; i < COUNT; i++) particles.push(new Particle());

    function animate() {
      ctx.clearRect(0, 0, W, H);
      particles.forEach(p => { p.update(); p.draw(); });
      requestAnimationFrame(animate);
    }
    animate();
  }

  // ===== 2. SCROLL REVEAL =====
  function initScrollReveal() {
    const elements = document.querySelectorAll('.reveal');
    if (!elements.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add('revealed');
          }, i * 100);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    elements.forEach(el => observer.observe(el));
  }

  // ===== 3. ANIMATED COUNTERS (optional) =====
  function initCounters() {
    const counters = document.querySelectorAll('[data-count]');
    if (!counters.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.dataset.count, 10);
          let current = 0;
          const step = target / 60;
          const timer = setInterval(() => {
            current += step;
            if (current >= target) {
              current = target;
              clearInterval(timer);
            }
            el.textContent = Math.floor(current);
          }, 16);
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(el => observer.observe(el));
  }

  // ===== 4. HOVER TILT ON CARDS =====
  function initCardTilt() {
    document.querySelectorAll('.tilt-card').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const rotateX = ((y / rect.height) - 0.5) * -10;
        const rotateY = ((x / rect.width) - 0.5) * 10;
        card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.03)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) scale(1)';
      });
    });
  }

  // ===== 5. INIT ALL =====
  document.addEventListener('DOMContentLoaded', () => {
    // Auto-init particle canvas if it exists
    const heroCanvas = document.querySelector('.business-hero canvas');
    if (heroCanvas && heroCanvas.id) {
      const color = heroCanvas.dataset.color || '37, 99, 235';
      const [r, g, b] = color.split(',').map(Number);
      initParticleCanvas(heroCanvas.id, { r, g, b });
    }

    initScrollReveal();
    initCounters();
    initCardTilt();
  });

  // Expose for manual use
  window.BusinessAnimations = {
    initParticleCanvas,
    initScrollReveal,
    initCardTilt
  };
})();