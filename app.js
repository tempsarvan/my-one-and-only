/**
 * 💖 MY ONE AND ONLY - 3D SCROLL FLOWER & FALLING PETAL TILE CARDS
 * Features: Three.js 3D Blooming Rose, Scroll-Driven Petal Unfurling & Falling,
 * Dynamic Fallen Petal Card Display Overlay, 3D Flip Cards, Playful Dodging No Button.
 */

document.addEventListener('DOMContentLoaded', () => {
  initSpotifyWidget();
  initHeartParticles();
  init3DFlowerScroll();

  // Timers
  initLiveTimer();
  initNextChapterTimer();

  // Render Content
  renderReasonsFlipCards();
  renderEnvelopes();
  renderCoupons();

  // Interactive Handlers
  setupProposalInteractions();
  setupModalListeners();
});

/* --------------------------------------------------------------------------
   1. Spotify Player Widget
   -------------------------------------------------------------------------- */
function initSpotifyWidget() {
  const widget = document.getElementById('spotify-widget');
  const toggleBtn = document.getElementById('spotify-toggle-btn');
  const artistLabel = document.getElementById('spotify-artist-label');
  const iframe = document.getElementById('spotify-iframe');

  if (typeof ANNIVERSARY_CONFIG !== 'undefined') {
    if (artistLabel && ANNIVERSARY_CONFIG.spotifyArtistName) {
      artistLabel.textContent = ANNIVERSARY_CONFIG.spotifyArtistName;
    }
    if (iframe && ANNIVERSARY_CONFIG.spotifyPlaylistUrl) {
      iframe.src = ANNIVERSARY_CONFIG.spotifyPlaylistUrl;
    }
  }

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
   2. Three.js 3D Blooming Rose & Scroll-Driven Falling Petals
   -------------------------------------------------------------------------- */
function init3DFlowerScroll() {
  const canvas = document.getElementById('flower-canvas-3d');
  const scrollContainer = document.getElementById('flower-scroll-container');
  const heroOverlay = document.getElementById('hero-overlay');
  const cardDisplay = document.getElementById('fallen-petal-card-display');

  if (!canvas || !scrollContainer || typeof THREE === 'undefined') return;

  // Scene, Camera, Renderer
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 0.5, 11);

  const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Lighting Setup
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.75);
  scene.add(ambientLight);

  const roseLight = new THREE.DirectionalLight(0xd4a5a5, 1.2);
  roseLight.position.set(5, 8, 5);
  scene.add(roseLight);

  const goldLight = new THREE.PointLight(0xffe082, 1.4, 25);
  goldLight.position.set(-5, -2, 4);
  scene.add(goldLight);

  // Group for the 3D Flower
  const flowerGroup = new THREE.Group();
  scene.add(flowerGroup);

  // Stem
  const stemMat = new THREE.MeshStandardMaterial({ color: 0x4a5d4e, roughness: 0.6 });
  const stemGeo = new THREE.CylinderGeometry(0.12, 0.15, 6, 16);
  const stem = new THREE.Mesh(stemGeo, stemMat);
  stem.position.y = -3.4;
  flowerGroup.add(stem);

  // Bud Center
  const centerMat = new THREE.MeshStandardMaterial({ color: 0xe6b89c, roughness: 0.3, emissive: 0xd4a5a5, emissiveIntensity: 0.3 });
  const centerGeo = new THREE.SphereGeometry(0.5, 32, 32);
  const centerNode = new THREE.Mesh(centerGeo, centerMat);
  centerNode.position.y = -0.2;
  flowerGroup.add(centerNode);

  // 5 Petals
  const petals = [];
  const petalCount = 5;
  const petalMat = new THREE.MeshStandardMaterial({
    color: 0xd4a5a5,
    roughness: 0.35,
    metalness: 0.1,
    side: THREE.DoubleSide
  });

  function createPetalGeometry() {
    const geom = new THREE.SphereGeometry(1.6, 24, 24, 0, Math.PI * 0.75, 0, Math.PI * 0.65);
    geom.scale(1, 1.25, 0.35);
    return geom;
  }

  for (let i = 0; i < petalCount; i++) {
    const pivot = new THREE.Group();
    pivot.position.set(0, -0.2, 0);

    const petalMesh = new THREE.Mesh(createPetalGeometry(), petalMat);
    petalMesh.position.set(0, 0.8, 0.5);

    const angle = (i / petalCount) * Math.PI * 2;
    pivot.rotation.y = angle;
    pivot.rotation.x = 0.85; // closed bud initial state

    pivot.add(petalMesh);
    flowerGroup.add(pivot);

    petals.push({
      pivot: pivot,
      mesh: petalMesh,
      baseAngleY: angle,
      monthIndex: i
    });
  }

  flowerGroup.position.set(0, 0, 0);

  // Resize Listener
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // Scroll Progress Logic
  let scrollProgress = 0;

  function updateScroll() {
    const rect = scrollContainer.getBoundingClientRect();
    const totalScrollable = scrollContainer.offsetHeight - window.innerHeight;
    if (totalScrollable <= 0) return;

    const currentScroll = Math.max(0, -rect.top);
    scrollProgress = Math.min(1, Math.max(0, currentScroll / totalScrollable));

    // 1. Hero Overlay Opacity
    if (heroOverlay) {
      const heroOpacity = Math.max(0, 1 - (scrollProgress / 0.25));
      heroOverlay.style.opacity = heroOpacity;
    }

    // 2. Petal Unfurling & Falling Stages (0.2 to 1.0)
    if (typeof ANNIVERSARY_CONFIG !== 'undefined' && ANNIVERSARY_CONFIG.timeline) {
      let activeMonthIndex = -1;

      if (scrollProgress >= 0.2 && scrollProgress < 0.36) activeMonthIndex = 0;
      else if (scrollProgress >= 0.36 && scrollProgress < 0.52) activeMonthIndex = 1;
      else if (scrollProgress >= 0.52 && scrollProgress < 0.68) activeMonthIndex = 2;
      else if (scrollProgress >= 0.68 && scrollProgress < 0.84) activeMonthIndex = 3;
      else if (scrollProgress >= 0.84) activeMonthIndex = 4;

      if (activeMonthIndex >= 0 && cardDisplay) {
        const data = ANNIVERSARY_CONFIG.timeline[activeMonthIndex];
        document.getElementById('petal-card-badge').textContent = `Fallen Petal #0${activeMonthIndex + 1} • Month 0${activeMonthIndex + 1}`;
        document.getElementById('petal-card-title').textContent = data.title;
        document.getElementById('petal-card-date').textContent = data.date;
        document.getElementById('petal-card-text').textContent = data.story;
        document.getElementById('petal-card-img').src = data.image;

        cardDisplay.classList.add('active');

        // Click fallen petal card to open modal
        cardDisplay.onclick = () => {
          triggerConfetti();
          openModal('🌹', data.title, `${data.subtitle}\n(${data.date})\n\n${data.story}`);
        };
      } else if (cardDisplay) {
        cardDisplay.classList.remove('active');
      }
    }
  }

  window.addEventListener('scroll', updateScroll);
  updateScroll();

  // Animation Loop
  function animate() {
    requestAnimationFrame(animate);

    // Idle rotation
    flowerGroup.rotation.y += 0.003;

    // Petal position mapping driven by scrollProgress
    petals.forEach((p, i) => {
      const petalStageStart = 0.2 + (i * 0.16);

      if (scrollProgress < 0.2) {
        // Phase 1: Uncurling from closed rosebud to bloom
        const unfurlAngle = 0.85 - (scrollProgress * 4.25);
        p.pivot.rotation.x = unfurlAngle;
        p.pivot.position.set(0, -0.2, 0);
      } else if (scrollProgress >= petalStageStart) {
        // Phase 2: Petal i detaches and falls gracefully
        const fallFactor = (scrollProgress - petalStageStart) / 0.16;
        p.pivot.position.y = -0.2 - (fallFactor * 4);
        p.pivot.position.x = Math.sin(Date.now() * 0.002 + i) * 0.6;
        p.pivot.rotation.z = Math.cos(Date.now() * 0.0015 + i) * 0.3;
      }
    });

    renderer.render(scene, camera);
  }

  animate();
}

/* --------------------------------------------------------------------------
   3. Live Relationship Timers
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
   4. Render 3D Flip Cards, Envelopes & Coupons
   -------------------------------------------------------------------------- */
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

  function dodgeButton() {
    const containerRect = container.getBoundingClientRect();
    const btnRect = btnNo.getBoundingClientRect();

    const maxLeft = containerRect.width - btnRect.width - 20;
    const maxTop = 150;

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
   6. Canvas Heart Background Particles & Confetti
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
