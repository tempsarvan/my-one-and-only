/**
 * 💖 MY ONE AND ONLY - CHEVY & SARVAN 5-GAME ARCADE & REAL ROSE SCROLL
 */

document.addEventListener('DOMContentLoaded', () => {
  initSpotifyWidget();
  initHeartParticles();
  initRealRoseScroll();

  // Timers
  initLiveTimer();
  initNextChapterTimer();

  // Arcade 5 Mini-Games Initializers
  initArcadeTabs();
  initCoopBuilder();
  initQuizGame();
  initCatchGame();
  initMemoryGame();

  // Core Renderers
  renderReasonsFlipCards();
  renderEnvelopes();
  renderCoupons();

  // Proposal & Modal Handlers
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
   2. Arcade Tabs Navigation Handler
   -------------------------------------------------------------------------- */
function initArcadeTabs() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  const gameViews = document.querySelectorAll('.arcade-game-view');
  const sarvanCursor = document.getElementById('sarvan-cursor');

  tabBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');

      tabBtns.forEach((b) => b.classList.remove('active'));
      gameViews.forEach((v) => v.classList.remove('active'));

      btn.classList.add('active');
      const targetView = document.getElementById(targetId);
      if (targetView) targetView.classList.add('active');

      if (targetId === 'game-1' && sarvanCursor) {
        sarvanCursor.classList.add('active');
      } else if (sarvanCursor) {
        sarvanCursor.classList.remove('active');
      }
    });
  });
}

/* --------------------------------------------------------------------------
   3. Game 1: Co-Op Scratch Builder with "Sarvan Cursor"
   -------------------------------------------------------------------------- */
function initCoopBuilder() {
  const cells = document.querySelectorAll('.coop-cell');
  const sarvanCursor = document.getElementById('sarvan-cursor');
  const instruction = document.getElementById('coop-instruction');
  const rewardCard = document.getElementById('blooming-reward-card');
  const coopGrid = document.getElementById('coop-grid');

  if (!cells.length || !sarvanCursor) return;

  const heartIcons = ['💖', '💕', '🌸', '✨', '🌹', '💌'];
  let currentStep = 0;

  function updateSarvanCursorPosition(targetIndex) {
    if (targetIndex >= cells.length) {
      sarvanCursor.classList.remove('active');
      return;
    }

    const targetCell = cells[targetIndex];
    const rect = targetCell.getBoundingClientRect();
    const containerRect = document.getElementById('arcade-container').getBoundingClientRect();

    const topOffset = rect.top - containerRect.top + 15;
    const leftOffset = rect.left - containerRect.left + rect.width / 2;

    sarvanCursor.style.top = `${topOffset}px`;
    sarvanCursor.style.left = `${leftOffset}px`;
    sarvanCursor.classList.add('active');

    cells.forEach((c) => c.classList.remove('target-highlight'));
    targetCell.classList.add('target-highlight');

    if (instruction) {
      instruction.textContent = `Sarvan is pointing to block #${targetIndex + 1}: Click to place! 💖`;
    }
  }

  // Initial positioning
  setTimeout(() => {
    updateSarvanCursorPosition(0);
  }, 500);

  cells.forEach((cell, idx) => {
    cell.addEventListener('click', () => {
      if (idx === currentStep) {
        cell.textContent = heartIcons[idx];
        cell.classList.add('placed');
        triggerConfetti();

        currentStep++;

        if (currentStep < cells.length) {
          updateSarvanCursorPosition(currentStep);
        } else {
          // Completed Co-Op Builder!
          if (instruction) instruction.style.display = 'none';
          if (coopGrid) coopGrid.style.display = 'none';
          if (rewardCard) rewardCard.classList.add('active');
          triggerMassiveHeartCascade();
        }
      }
    });
  });
}

/* --------------------------------------------------------------------------
   4. Game 2: How Well Do You Know Sarvan? Quiz & Dream Location Video
   -------------------------------------------------------------------------- */
function initQuizGame() {
  const titleEl = document.getElementById('quiz-question-title');
  const gridEl = document.getElementById('quiz-options-grid');
  const dreamBox = document.getElementById('dream-location-box');
  const locationBtns = document.querySelectorAll('.location-btn');
  const videoContainer = document.getElementById('location-video-container');
  const videoPlayer = document.getElementById('location-video-player');
  const videoDesc = document.getElementById('location-video-desc');

  if (!titleEl || !gridEl || typeof ANNIVERSARY_CONFIG === 'undefined' || !ANNIVERSARY_CONFIG.quiz) return;

  const quizData = ANNIVERSARY_CONFIG.quiz;
  let currentQIndex = 0;

  function renderQuestion(index) {
    if (index >= quizData.length) {
      // Transition to Question 5: Dream Location Box
      titleEl.style.display = 'none';
      gridEl.style.display = 'none';
      if (dreamBox) dreamBox.classList.add('active');
      return;
    }

    const q = quizData[index];
    titleEl.textContent = `Question ${index + 1} of 4: ${q.question}`;
    gridEl.innerHTML = '';

    q.options.forEach((opt) => {
      const btn = document.createElement('button');
      btn.className = 'quiz-opt-btn';
      btn.textContent = opt;

      btn.addEventListener('click', () => {
        if (opt === q.correct) {
          btn.classList.add('correct');
          triggerConfetti();
          setTimeout(() => {
            currentQIndex++;
            renderQuestion(currentQIndex);
          }, 800);
        } else {
          btn.classList.add('wrong');
          setTimeout(() => btn.classList.remove('wrong'), 600);
        }
      });

      gridEl.appendChild(btn);
    });
  }

  renderQuestion(0);

  // Question 5: Dream Location Buttons (Venice, Paris, Italy, Rome)
  locationBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const locKey = btn.getAttribute('data-loc');
      const locData = ANNIVERSARY_CONFIG.locationVideos[locKey];

      if (locData && videoPlayer && videoContainer && videoDesc) {
        videoPlayer.src = locData.videoUrl;
        videoDesc.textContent = `${locData.name} • ${locData.description}`;
        videoContainer.classList.add('active');
        videoPlayer.play().catch((err) => console.log('Video play error:', err));
        triggerConfetti();
      }
    });
  });
}

/* --------------------------------------------------------------------------
   5. Game 3: Catch Sarvan's Heart Canvas Arcade
   -------------------------------------------------------------------------- */
function initCatchGame() {
  const canvas = document.getElementById('catch-canvas');
  const scoreDisplay = document.getElementById('catch-score-display');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = canvas.parentElement.clientWidth || 450);
  let height = (canvas.height = 320);

  let score = 0;
  let basketX = width / 2 - 30;
  const basketWidth = 60;
  const basketHeight = 16;

  const hearts = [];
  let isGameOver = false;

  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    basketX = e.clientX - rect.left - basketWidth / 2;
  });

  canvas.addEventListener('touchmove', (e) => {
    if (e.touches[0]) {
      const rect = canvas.getBoundingClientRect();
      basketX = e.touches[0].clientX - rect.left - basketWidth / 2;
    }
  });

  function spawnHeart() {
    if (isGameOver) return;
    hearts.push({
      x: Math.random() * (width - 20) + 10,
      y: -20,
      speed: Math.random() * 1.8 + 1.2,
      size: 14
    });
  }

  setInterval(spawnHeart, 1200);

  function loop() {
    ctx.clearRect(0, 0, width, height);

    // Draw Basket
    ctx.fillStyle = '#B87373';
    ctx.beginPath();
    ctx.roundRect(basketX, height - 25, basketWidth, basketHeight, 8);
    ctx.fill();

    // Draw & Update Hearts
    for (let i = hearts.length - 1; i >= 0; i--) {
      const h = hearts[i];
      h.y += h.speed;

      ctx.fillStyle = '#ff4d6d';
      ctx.font = '16px sans-serif';
      ctx.fillText('💖', h.x, h.y);

      // Catch Collision
      if (h.y >= height - 35 && h.y <= height - 10 && h.x >= basketX - 10 && h.x <= basketX + basketWidth + 10) {
        hearts.splice(i, 1);
        score++;
        if (scoreDisplay) scoreDisplay.textContent = `Score: ${score} / 10 Hearts`;
        triggerConfetti();

        if (score >= 10 && !isGameOver) {
          isGameOver = true;
          if (scoreDisplay) scoreDisplay.textContent = `🎉 You caught all 10 hearts for Sarvan! 🎉`;
          triggerMassiveHeartCascade();
        }
      } else if (h.y > height + 20) {
        hearts.splice(i, 1);
      }
    }

    requestAnimationFrame(loop);
  }

  loop();
}

/* --------------------------------------------------------------------------
   6. Game 4: Memory Match Card Game
   -------------------------------------------------------------------------- */
function initMemoryGame() {
  const grid = document.getElementById('memory-grid');
  if (!grid) return;

  const items = ['💖', '💖', '🌹', '🌹', '☕', '☕', '🎵', '🎵', '💌', '💌', '✨', '✨'];
  // Shuffle
  items.sort(() => Math.random() - 0.5);

  let flippedCards = [];
  let matchedCount = 0;

  grid.innerHTML = '';

  items.forEach((item, idx) => {
    const card = document.createElement('div');
    card.className = 'memory-card';
    card.setAttribute('data-val', item);
    card.textContent = '❓';

    card.addEventListener('click', () => {
      if (flippedCards.length < 2 && !card.classList.contains('flipped')) {
        card.classList.add('flipped');
        card.textContent = item;
        flippedCards.push(card);

        if (flippedCards.length === 2) {
          if (flippedCards[0].getAttribute('data-val') === flippedCards[1].getAttribute('data-val')) {
            matchedCount += 2;
            flippedCards = [];
            triggerConfetti();
            if (matchedCount === items.length) {
              triggerMassiveHeartCascade();
              openModal('🏆', 'Memory Match Master!', 'You matched all our memory cards, Chevy! Sarvan loves you! 💕');
            }
          } else {
            setTimeout(() => {
              flippedCards.forEach((c) => {
                c.classList.remove('flipped');
                c.textContent = '❓';
              });
              flippedCards = [];
            }, 800);
          }
        }
      }
    });

    grid.appendChild(card);
  });
}

/* --------------------------------------------------------------------------
   7. Three.js Real Rose Scroll Engine
   -------------------------------------------------------------------------- */
function initRealRoseScroll() {
  const canvas = document.getElementById('flower-canvas-3d');
  const scrollContainer = document.getElementById('flower-scroll-container');
  const heroOverlay = document.getElementById('hero-overlay');
  const cardDisplay = document.getElementById('fallen-petal-card-display');

  if (!canvas || !scrollContainer || typeof THREE === 'undefined') return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 0, 10);

  const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.95);
  scene.add(ambientLight);

  const textureLoader = new THREE.TextureLoader();
  const petalTextureUrl = (typeof ANNIVERSARY_CONFIG !== 'undefined' && ANNIVERSARY_CONFIG.realPetalImage) ? ANNIVERSARY_CONFIG.realPetalImage : './assets/real_petal.png';

  textureLoader.load(petalTextureUrl, (texture) => {
    const petalCount = 5;
    const petals = [];

    const petalGeo = new THREE.PlaneGeometry(2.2, 2.2);
    const petalMat = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      side: THREE.DoubleSide
    });

    for (let i = 0; i < petalCount; i++) {
      const mesh = new THREE.Mesh(petalGeo, petalMat);
      mesh.position.set((Math.random() - 0.5) * 3, 2 + i * 0.5, (Math.random() - 0.5) * 2);
      mesh.rotation.z = Math.random() * Math.PI * 2;
      scene.add(mesh);

      petals.push({
        mesh: mesh,
        baseX: (i - 2) * 1.8,
        monthIndex: i
      });
    }

    let scrollProgress = 0;

    function updateScroll() {
      const rect = scrollContainer.getBoundingClientRect();
      const totalScrollable = scrollContainer.offsetHeight - window.innerHeight;
      if (totalScrollable <= 0) return;

      const currentScroll = Math.max(0, -rect.top);
      scrollProgress = Math.min(1, Math.max(0, currentScroll / totalScrollable));

      if (heroOverlay) {
        const heroOpacity = Math.max(0, 1 - (scrollProgress / 0.25));
        heroOverlay.style.opacity = heroOpacity;
      }

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

    function animate() {
      requestAnimationFrame(animate);

      petals.forEach((p, i) => {
        const petalStageStart = 0.2 + (i * 0.16);

        if (scrollProgress >= petalStageStart) {
          const fallFactor = (scrollProgress - petalStageStart) / 0.16;
          p.mesh.position.y = 3 - (fallFactor * 6);
          p.mesh.position.x = p.baseX + Math.sin(Date.now() * 0.002 + i) * 0.5;
          p.mesh.rotation.z += 0.005;
        } else {
          p.mesh.position.y = 4 + i;
        }
      });

      renderer.render(scene, camera);
    }

    animate();
  });

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}

/* --------------------------------------------------------------------------
   8. Relationship Timers
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
   9. Render Flip Cards, Envelopes & Coupons
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
          `You have redeemed: "${coupon.title}"!\n\nCoupon Code: ${coupon.code}\n\nTake a screenshot and send it to Sarvan anytime you want to claim this gift! 💕`
        );
      }
    });

    container.appendChild(card);
  });
}

/* --------------------------------------------------------------------------
   10. Proposal Interaction Handlers
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
      'YAY! You Said Yes, Chevy! 🎉',
      `You are officially Sarvan's favorite person forever and ever!\n\nThank you for making these past 5 months so incredibly sweet, magical, and unforgettable.\n\nSarvan loves you with all his heart! 💕✨`
    );
  });
}

/* --------------------------------------------------------------------------
   11. Particles & Modals
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
