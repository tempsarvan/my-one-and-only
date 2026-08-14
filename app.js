/**
 * 💖 MY ONE AND ONLY - SOFT CREAM & DUSTY ROSE APPLICATION SCRIPT
 * Features: IntersectionObserver Scrollytelling Timeline, 3D Flip Cards,
 * Playful Dodging "No" Button, "Yes" Full-Screen Heart Explosion, Live Timers.
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initSpotifyWidget();
  initHeartParticles();

  // Timers
  initLiveTimer();
  initNextChapterTimer();

  // Render Content
  renderTimeline();
  renderReasonsFlipCards();
  renderEnvelopes();
  renderCoupons();

  // Interactive Handlers
  setupScrollytellingObserver();
  setupProposalInteractions();
  setupModalListeners();
});

/* --------------------------------------------------------------------------
   1. Header Text & Spotify Widget
   -------------------------------------------------------------------------- */
function initHeader() {
  if (typeof ANNIVERSARY_CONFIG !== 'undefined') {
    const heroTitle = document.getElementById('hero-title');
    const heroSubtitle = document.getElementById('hero-subtitle');
    
    if (heroTitle && ANNIVERSARY_CONFIG.heroTitle) {
      heroTitle.innerHTML = "For My Favorite Person, <br><span>My Favorite Chapter.</span>";
    }
    if (heroSubtitle && ANNIVERSARY_CONFIG.heroSubtitle) {
      heroSubtitle.textContent = ANNIVERSARY_CONFIG.heroSubtitle;
    }
  }
}

function initSpotifyWidget() {
  const widget = document.getElementById('spotify-widget');
  const toggleBtn = document.getElementById('spotify-toggle-btn');

  if (!widget || !toggleBtn) return;

  toggleBtn.addEventListener('click', () => {
    widget.classList.toggle('collapsed');
    const arrow = toggleBtn.querySelector('.btn-toggle-spotify');
    if (arrow) {
      arrow.textContent = widget.classList.contains('collapsed') ? '▲' : '▼';
    }
  });
}

/* --------------------------------------------------------------------------
   2. Live Relationship Timer & Next Chapter Countdown
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

function initNextChapterTimer() {
  const daysEl = document.getElementById('next-days');
  const hoursEl = document.getElementById('next-hours');
  const minutesEl = document.getElementById('next-minutes');
  const secondsEl = document.getElementById('next-seconds');

  if (!daysEl || typeof ANNIVERSARY_CONFIG === 'undefined') return;

  function updateNextTimer() {
    const now = new Date();
    const target = ANNIVERSARY_CONFIG.nextChapterDate;
    const diff = Math.max(0, target - now);

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    daysEl.textContent = String(days).padStart(2, '0');
    hoursEl.textContent = String(hours).padStart(2, '0');
    minutesEl.textContent = String(minutes).padStart(2, '0');
    secondsEl.textContent = String(seconds).padStart(2, '0');
  }

  updateNextTimer();
  setInterval(updateNextTimer, 1000);
}

/* --------------------------------------------------------------------------
   3. Scrollytelling IntersectionObserver (Blur-in & Slide-Up Reveal)
   -------------------------------------------------------------------------- */
function setupScrollytellingObserver() {
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -80px 0px',
    threshold: 0.15
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        obs.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.timeline-card').forEach((card) => {
    observer.observe(card);
  });
}

/* --------------------------------------------------------------------------
   4. Render Timeline, 3D Flip Cards, Envelopes & Coupons
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
        <span class="card-badge">Chapter 0${item.monthNum}</span>
      </div>
      <div class="card-body">
        <div class="card-date">${item.date}</div>
        <h3 class="card-title">${item.title}</h3>
        <div class="card-subtitle">${item.subtitle}</div>
        <p class="card-text">${item.story}</p>
      </div>
    `;

    card.addEventListener('click', () => {
      triggerConfetti();
      openModal('💖', item.title, `${item.subtitle}\n(${item.date})\n\n${item.story}`);
    });

    container.appendChild(card);
  });
}

function renderReasonsFlipCards() {
  const container = document.getElementById('reasons-flip-grid');
  if (!container || typeof ANNIVERSARY_CONFIG === 'undefined') return;

  container.innerHTML = '';

  ANNIVERSARY_CONFIG.flipCards.forEach((cardData) => {
    const flipContainer = document.createElement('div');
    flipContainer.className = 'flip-card-container';
    flipContainer.innerHTML = `
      <div class="flip-card-inner">
        <div class="flip-card-front">
          <div class="flip-card-icon">💌</div>
          <h4 class="flip-card-title">${cardData.frontTitle}</h4>
          <span class="flip-card-sub">${cardData.frontSubtitle}</span>
        </div>
        <div class="flip-card-back">
          <p>"${cardData.backNote}"</p>
        </div>
      </div>
    `;

    flipContainer.addEventListener('click', () => {
      flipContainer.classList.toggle('flipped');
      triggerConfetti();
    });

    container.appendChild(flipContainer);
  });
}

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
   5. Playful Interactive Dodging "No" Button & "Yes" Explosion
   -------------------------------------------------------------------------- */
function setupProposalInteractions() {
  const btnYes = document.getElementById('btn-yes');
  const btnNo = document.getElementById('btn-no');
  const container = document.getElementById('proposal-btn-container');

  if (!btnYes || !btnNo || !container) return;

  // Playful dodging physics for the "No" button
  function dodgeButton() {
    const containerRect = container.getBoundingClientRect();
    const btnRect = btnNo.getBoundingClientRect();

    const maxLeft = containerRect.width - btnRect.width - 20;
    const maxTop = 150; // allow dodging vertically

    const randomLeft = Math.floor(Math.random() * maxLeft) - (maxLeft / 2);
    const randomTop = Math.floor(Math.random() * maxTop) - (maxTop / 2);

    btnNo.style.position = 'relative';
    btnNo.style.left = `${randomLeft}px`;
    btnNo.style.top = `${randomTop}px`;
  }

  btnNo.addEventListener('mouseover', dodgeButton);
  btnNo.addEventListener('mouseenter', dodgeButton);
  btnNo.addEventListener('touchstart', (e) => {
    e.preventDefault();
    dodgeButton();
  });

  btnNo.addEventListener('click', (e) => {
    e.preventDefault();
    dodgeButton();
  });

  // "Yes" button handler: Full-screen heart particle cascade & modal
  btnYes.addEventListener('click', () => {
    triggerMassiveHeartCascade();
    openModal(
      '💖',
      'YAY! You Said Yes! 🎉',
      `You are officially my favorite person forever and ever!\n\nThank you for making these past 5 months so incredibly sweet, magical, and unforgettable.\n\nI love you with all my heart! 💕✨`
    );
  });
}

/* --------------------------------------------------------------------------
   6. Particle Canvas & Confetti Helpers
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
  const particleCount = 35;

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * width;
      this.y = height + Math.random() * 100;
      this.size = Math.random() * 12 + 6;
      this.speedY = Math.random() * 1.0 + 0.3;
      this.speedX = Math.sin(Math.random() * Math.PI) * 0.5;
      this.opacity = Math.random() * 0.4 + 0.15;
      this.color = Math.random() > 0.4 ? '#D4A5A5' : '#B87373';
      this.rotation = Math.random() * Math.PI * 2;
      this.rotSpeed = (Math.random() - 0.5) * 0.015;
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

      ctx.beginPath();
      const topCurveHeight = this.size * 0.3;
      ctx.moveTo(0, topCurveHeight);
      ctx.bezierCurveTo(0, 0, -this.size / 2, 0, -this.size / 2, topCurveHeight);
      ctx.bezierCurveTo(-this.size / 2, (this.size + topCurveHeight) / 2, 0, this.size, 0, this.size);
      ctx.bezierCurveTo(0, this.size, this.size / 2, (this.size + topCurveHeight) / 2, this.size / 2, topCurveHeight);
      ctx.bezierCurveTo(this.size / 2, 0, 0, 0, 0, topCurveHeight);
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

function triggerConfetti() {
  if (typeof confetti === 'function') {
    confetti({
      particleCount: 65,
      spread: 65,
      origin: { y: 0.6 },
      colors: ['#D4A5A5', '#B87373', '#8C5252', '#F5E8E8']
    });
  }
}

function triggerMassiveHeartCascade() {
  if (typeof confetti === 'function') {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 2000 };

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) {
        return clearInterval(interval);
      }
      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }, colors: ['#D4A5A5', '#B87373', '#8C5252'] });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }, colors: ['#D4A5A5', '#B87373', '#F5E8E8'] });
    }, 250);
  }
}

function randomInRange(min, max) {
  return Math.random() * (max - min) + min;
}

/* --------------------------------------------------------------------------
   7. Modal Listeners
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
