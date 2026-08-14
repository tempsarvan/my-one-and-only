/**
 * 💖 MY ONE AND ONLY - 5TH MONTH ANNIVERSARY APPLICATION SCRIPT
 * Features: Floating Particle Canvas, Live Counter, Story Timeline,
 * "Open When..." Envelope Modals, Coupon Redemption with Confetti, Reason Generator.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Header Text from Config
  initHeader();

  // Initialize Canvas Heart Particle Effect
  initHeartParticles();

  // Initialize Live Relationship Timer
  initLiveTimer();

  // Render Story Timeline Cards
  renderTimeline();

  // Render "Open When..." Envelopes
  renderEnvelopes();

  // Render Redeemable Coupons
  renderCoupons();

  // Setup Reasons Why I Love You Generator
  setupReasonGenerator();

  // Setup Modal Listeners
  setupModalListeners();

  // Setup Audio Control
  setupAudioPlayer();
});

/* --------------------------------------------------------------------------
   1. Header Text Initialization
   -------------------------------------------------------------------------- */
function initHeader() {
  if (typeof ANNIVERSARY_CONFIG !== 'undefined') {
    const heroTitle = document.getElementById('hero-title');
    const heroSubtitle = document.getElementById('hero-subtitle');
    
    if (heroTitle) heroTitle.textContent = ANNIVERSARY_CONFIG.anniversaryTitle;
    if (heroSubtitle) heroSubtitle.textContent = ANNIVERSARY_CONFIG.heroSubtitle;
  }
}

/* --------------------------------------------------------------------------
   2. Live Relationship Timer
   -------------------------------------------------------------------------- */
function initLiveTimer() {
  const daysEl = document.getElementById('timer-days');
  const hoursEl = document.getElementById('timer-hours');
  const minutesEl = document.getElementById('timer-minutes');
  const secondsEl = document.getElementById('timer-seconds');

  if (!daysEl || typeof ANNIVERSARY_CONFIG === 'undefined') return;

  function updateTimer() {
    const now = new Date();
    const start = ANNIVERSARY_CONFIG.startDate;
    const diff = Math.max(0, now - start);

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    daysEl.textContent = String(days).padStart(2, '0');
    hoursEl.textContent = String(hours).padStart(2, '0');
    minutesEl.textContent = String(minutes).padStart(2, '0');
    secondsEl.textContent = String(seconds).padStart(2, '0');
  }

  updateTimer();
  setInterval(updateTimer, 1000);
}

/* --------------------------------------------------------------------------
   3. Floating Canvas Particles (Hearts & Stars)
   -------------------------------------------------------------------------- */
function initHeartParticles() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particles = [];
  const particleCount = 40;

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * width;
      this.y = height + Math.random() * 100;
      this.size = Math.random() * 14 + 8;
      this.speedY = Math.random() * 1.2 + 0.4;
      this.speedX = Math.sin(Math.random() * Math.PI) * 0.6;
      this.opacity = Math.random() * 0.5 + 0.2;
      this.color = Math.random() > 0.3 ? '#ff4d6d' : '#ffe082';
      this.rotation = Math.random() * Math.PI * 2;
      this.rotSpeed = (Math.random() - 0.5) * 0.02;
    }

    update() {
      this.y -= this.speedY;
      this.x += this.speedX;
      this.rotation += this.rotSpeed;

      if (this.y < -30) {
        this.reset();
      }
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      ctx.globalAlpha = this.opacity;
      ctx.fillStyle = this.color;

      // Draw Heart Shape
      ctx.beginPath();
      const topCurveHeight = this.size * 0.3;
      ctx.moveTo(0, topCurveHeight);
      ctx.bezierCurveTo(
        0, 0, 
        -this.size / 2, 0, 
        -this.size / 2, topCurveHeight
      );
      ctx.bezierCurveTo(
        -this.size / 2, (this.size + topCurveHeight) / 2, 
        0, this.size, 
        0, this.size
      );
      ctx.bezierCurveTo(
        0, this.size, 
        this.size / 2, (this.size + topCurveHeight) / 2, 
        this.size / 2, topCurveHeight
      );
      ctx.bezierCurveTo(
        this.size / 2, 0, 
        0, 0, 
        0, topCurveHeight
      );
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach((p) => {
      p.update();
      p.draw();
    });
    requestAnimationFrame(animate);
  }

  animate();
}

/* --------------------------------------------------------------------------
   4. Render Story Timeline
   -------------------------------------------------------------------------- */
function renderTimeline() {
  const container = document.getElementById('timeline-grid');
  if (!container || typeof ANNIVERSARY_CONFIG === 'undefined') return;

  container.innerHTML = '';

  ANNIVERSARY_CONFIG.timeline.forEach((item) => {
    const card = document.createElement('div');
    card.className = 'timeline-card';
    card.innerHTML = `
      <div class="card-img-wrapper">
        <img src="${item.image}" alt="${item.title}" class="card-img" loading="lazy">
        <span class="card-badge">Month 0${item.monthNum}</span>
      </div>
      <div class="card-body">
        <div class="card-date">${item.date}</div>
        <h3 class="card-title">${item.title}</h3>
        <div class="card-subtitle">${item.subtitle}</div>
        <p class="card-text">${item.story}</p>
      </div>
    `;

    // Click card to open full memory modal
    card.addEventListener('click', () => {
      triggerConfetti();
      openModal('💖', item.title, `${item.subtitle}\n(${item.date})\n\n${item.story}`);
    });

    container.appendChild(card);
  });
}

/* --------------------------------------------------------------------------
   5. Render "Open When..." Envelopes
   -------------------------------------------------------------------------- */
function renderEnvelopes() {
  const container = document.getElementById('envelopes-grid');
  if (!container || typeof ANNIVERSARY_CONFIG === 'undefined') return;

  container.innerHTML = '';

  ANNIVERSARY_CONFIG.envelopes.forEach((env) => {
    const card = document.createElement('div');
    card.className = 'envelope-card';
    card.innerHTML = `
      <div class="env-icon">${env.icon}</div>
      <h3 class="env-title">${env.title}</h3>
      <div class="env-subtitle">${env.subtitle}</div>
    `;

    card.addEventListener('click', () => {
      triggerConfetti();
      openModal(env.icon, env.title, env.content);
    });

    container.appendChild(card);
  });
}

/* --------------------------------------------------------------------------
   6. Render Love Coupons
   -------------------------------------------------------------------------- */
function renderCoupons() {
  const container = document.getElementById('coupons-grid');
  if (!container || typeof ANNIVERSARY_CONFIG === 'undefined') return;

  const redeemedMap = JSON.parse(localStorage.getItem('redeemed_coupons') || '{}');

  container.innerHTML = '';

  ANNIVERSARY_CONFIG.coupons.forEach((coupon) => {
    const isRedeemed = !!redeemedMap[coupon.id];
    const card = document.createElement('div');
    card.className = `coupon-card ${isRedeemed ? 'redeemed' : ''}`;
    card.innerHTML = `
      <div>
        <div class="coupon-header">
          <span class="coupon-icon">${coupon.icon}</span>
          <span class="coupon-tag">${coupon.tag}</span>
        </div>
        <h3 class="coupon-title">${coupon.title}</h3>
        <p class="coupon-desc">${coupon.description}</p>
      </div>
      <button class="btn-redeem" ${isRedeemed ? 'disabled' : ''}>
        ${isRedeemed ? 'Redeemed ✨' : 'Redeem Coupon 💖'}
      </button>
    `;

    const btn = card.querySelector('.btn-redeem');
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (!redeemedMap[coupon.id]) {
        redeemedMap[coupon.id] = true;
        localStorage.setItem('redeemed_coupons', JSON.stringify(redeemedMap));
        card.classList.add('redeemed');
        btn.disabled = true;
        btn.textContent = 'Redeemed ✨';
        triggerConfetti();
        openModal(
          coupon.icon,
          'Coupon Redeemed! 🎉',
          `You have redeemed: "${coupon.title}"!\n\nCoupon Code: ${coupon.code}\n\nTake a screenshot and send it to me anytime you want to claim this gift! 💕`
        );
      }
    });

    container.appendChild(card);
  });
}

/* --------------------------------------------------------------------------
   7. Reasons Why I Love You Generator
   -------------------------------------------------------------------------- */
function setupReasonGenerator() {
  const btn = document.getElementById('btn-generate-reason');
  const display = document.getElementById('reason-display');

  if (!btn || !display || typeof ANNIVERSARY_CONFIG === 'undefined') return;

  btn.addEventListener('click', () => {
    const reasons = ANNIVERSARY_CONFIG.reasons;
    const randomIndex = Math.floor(Math.random() * reasons.length);
    const selectedReason = reasons[randomIndex];

    display.style.opacity = '0';
    display.style.transform = 'scale(0.95)';

    setTimeout(() => {
      display.textContent = `"${selectedReason}" 💖`;
      display.style.opacity = '1';
      display.style.transform = 'scale(1)';
    }, 200);

    triggerConfetti();
  });
}

/* --------------------------------------------------------------------------
   8. Modal Handlers
   -------------------------------------------------------------------------- */
function setupModalListeners() {
  const overlay = document.getElementById('modal-overlay');
  const closeBtn = document.getElementById('modal-close');

  if (!overlay || !closeBtn) return;

  closeBtn.addEventListener('click', closeModal);

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('active')) {
      closeModal();
    }
  });
}

function openModal(icon, title, body) {
  const overlay = document.getElementById('modal-overlay');
  const iconEl = document.getElementById('modal-icon');
  const titleEl = document.getElementById('modal-title');
  const bodyEl = document.getElementById('modal-body');

  if (iconEl) iconEl.textContent = icon;
  if (titleEl) titleEl.textContent = title;
  if (bodyEl) bodyEl.textContent = body;

  if (overlay) overlay.classList.add('active');
}

function closeModal() {
  const overlay = document.getElementById('modal-overlay');
  if (overlay) overlay.classList.remove('active');
}

/* --------------------------------------------------------------------------
   9. Audio Player setup
   -------------------------------------------------------------------------- */
function setupAudioPlayer() {
  const toggleBtn = document.getElementById('audio-toggle');
  const audio = document.getElementById('bg-audio');

  if (!toggleBtn || !audio) return;

  toggleBtn.addEventListener('click', () => {
    if (audio.paused) {
      audio.play().then(() => {
        toggleBtn.classList.add('playing');
        toggleBtn.textContent = '🎶';
      }).catch((err) => {
        console.log('Audio playback prevented:', err);
      });
    } else {
      audio.pause();
      toggleBtn.classList.remove('playing');
      toggleBtn.textContent = '🎵';
    }
  });
}

/* --------------------------------------------------------------------------
   10. Confetti Burst Helper
   -------------------------------------------------------------------------- */
function triggerConfetti() {
  if (typeof confetti === 'function') {
    confetti({
      particleCount: 70,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#ff4d6d', '#ff758f', '#ffe082', '#ffffff']
    });
  }
}
