/**
 * 💖 MY ONE AND ONLY - ULTRA-PREMIUM 5TH MONTH ANNIVERSARY APP SCRIPT
 * Features: Three.js Scroll-Driven 3D Flower Unraveling & Petal Drop,
 * Top-Right Lana Del Rey Glass Spotify Widget, Sept 15 Countdown, Live Timer,
 * Envelopes, Coupons, and Heart Reason Generator.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Header Text & Spotify Widget
  initHeader();
  initSpotifyWidget();

  // Initialize Canvas Heart Background & 3D Flower Unraveling
  initHeartParticles();
  init3DFlower();

  // Initialize Live Timers (5-Month Timer & Next Sept 15th Countdown)
  initLiveTimer();
  initNextChapterTimer();

  // Render Core Sections
  renderTimeline();
  renderEnvelopes();
  renderCoupons();

  // Setup Interaction Handlers
  setupReasonGenerator();
  setupModalListeners();
});

/* --------------------------------------------------------------------------
   1. Header & Top-Right Spotify Widget
   -------------------------------------------------------------------------- */
function initHeader() {
  if (typeof ANNIVERSARY_CONFIG !== 'undefined') {
    const heroTitle = document.getElementById('hero-title');
    const heroSubtitle = document.getElementById('hero-subtitle');
    
    if (heroTitle) heroTitle.textContent = ANNIVERSARY_CONFIG.anniversaryTitle;
    if (heroSubtitle) heroSubtitle.textContent = ANNIVERSARY_CONFIG.heroSubtitle;
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
   2. Three.js 3D Scroll-Driven Blooming Rose & Petal Drop Scene
   -------------------------------------------------------------------------- */
function init3DFlower() {
  const canvas = document.getElementById('flower-canvas');
  const trackSection = document.getElementById('flower-track-section');
  if (!canvas || !trackSection || typeof THREE === 'undefined') return;

  // Scene, Camera, Renderer
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 1, 12);

  const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
  scene.add(ambientLight);

  const mainLight = new THREE.DirectionalLight(0xff758f, 1.2);
  mainLight.position.set(5, 10, 7);
  scene.add(mainLight);

  const goldLight = new THREE.PointLight(0xffe082, 1.5, 20);
  goldLight.position.set(-4, -2, 5);
  scene.add(goldLight);

  // Group for the 3D Flower
  const flowerGroup = new THREE.Group();
  scene.add(flowerGroup);

  // 1. Stem
  const stemMat = new THREE.MeshStandardMaterial({ color: 0x1b4332, roughness: 0.6 });
  const stemGeo = new THREE.CylinderGeometry(0.12, 0.15, 6, 16);
  const stem = new THREE.Mesh(stemGeo, stemMat);
  stem.position.y = -3.5;
  flowerGroup.add(stem);

  // 2. Center Bud Receptacle
  const centerMat = new THREE.MeshStandardMaterial({ 
    color: 0xffe082, 
    emissive: 0xffb703,
    emissiveIntensity: 0.4,
    roughness: 0.3 
  });
  const centerGeo = new THREE.SphereGeometry(0.5, 32, 32);
  const centerNode = new THREE.Mesh(centerGeo, centerMat);
  centerNode.position.y = -0.3;
  flowerGroup.add(centerNode);

  // 3. Create 5 Distinct Rose Petals
  const petals = [];
  const petalCount = 5;
  const petalMat = new THREE.MeshStandardMaterial({
    color: 0xff4d6d,
    roughness: 0.35,
    metalness: 0.1,
    side: THREE.DoubleSide
  });

  // Create curved petal geometry
  function createPetalGeometry() {
    const geom = new THREE.SphereGeometry(1.6, 24, 24, 0, Math.PI * 0.7, 0, Math.PI * 0.6);
    geom.scale(1, 1.3, 0.3);
    return geom;
  }

  for (let i = 0; i < petalCount; i++) {
    const petalPivot = new THREE.Group();
    petalPivot.position.set(0, -0.2, 0);

    const petalMesh = new THREE.Mesh(createPetalGeometry(), petalMat);
    // Offset petal relative to pivot
    petalMesh.position.set(0, 0.8, 0.5);

    // Initial closed rosebud angle
    const angle = (i / petalCount) * Math.PI * 2;
    petalPivot.rotation.y = angle;
    petalPivot.rotation.x = 0.8; // Tightly closed

    petalPivot.add(petalMesh);
    flowerGroup.add(petalPivot);

    petals.push({
      pivot: petalPivot,
      mesh: petalMesh,
      baseAngleY: angle,
      floatY: 0,
      floatX: 0,
      isDetached: false
    });
  }

  // Position Flower Group
  flowerGroup.position.set(0, 0.5, 0);

  // Responsive Resize
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // Scroll Progress Listener
  let scrollProgress = 0;

  function updateScrollProgress() {
    const rect = trackSection.getBoundingClientRect();
    const totalScrollable = trackSection.offsetHeight - window.innerHeight;
    if (totalScrollable <= 0) return;

    const currentScroll = Math.max(0, -rect.top);
    scrollProgress = Math.min(1, Math.max(0, currentScroll / totalScrollable));
  }

  window.addEventListener('scroll', updateScrollProgress);
  updateScrollProgress();

  // Render & Animation Loop
  function animate() {
    requestAnimationFrame(animate);

    // Smooth flower idle rotation
    flowerGroup.rotation.y += 0.005;

    // Unfurling math driven by scrollProgress (0 to 1)
    petals.forEach((p, index) => {
      if (scrollProgress < 0.75) {
        // Phase 1: Uncurling & blooming in place
        p.isDetached = false;
        const unfurlAngle = 0.8 - (scrollProgress * 1.1); // opens from 0.8 rad down to -0.3 rad
        p.pivot.rotation.x = unfurlAngle;
        p.pivot.position.set(0, -0.2, 0);
      } else {
        // Phase 2: Petals detach and float down
        p.isDetached = true;
        const detachFactor = (scrollProgress - 0.75) / 0.25; // 0 to 1
        p.pivot.position.y = -0.2 - (detachFactor * (3 + index * 1.5));
        p.pivot.position.x = Math.sin(Date.now() * 0.002 + index) * 0.8;
        p.pivot.rotation.z = Math.cos(Date.now() * 0.0015 + index) * 0.4;
      }
    });

    renderer.render(scene, camera);
  }

  animate();
}

/* --------------------------------------------------------------------------
   3. Live Relationship Timers (5-Month Timer & Sept 15th Countdown)
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
   4. Floating Canvas Particles
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
  const particleCount = 45;

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

/* --------------------------------------------------------------------------
   5. Render Timeline, Envelopes & Coupons
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
        <span class="card-badge">Petal 0${item.monthNum} • Month 0${item.monthNum}</span>
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
      openModal('🌹', item.title, `${item.subtitle}\n(${item.date})\n\n${item.story}`);
    });

    container.appendChild(card);
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
   6. Reasons Generator & Modals
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

function triggerConfetti() {
  if (typeof confetti === 'function') {
    confetti({
      particleCount: 75,
      spread: 75,
      origin: { y: 0.6 },
      colors: ['#ff4d6d', '#ff758f', '#ffe082', '#ffffff']
    });
  }
}
