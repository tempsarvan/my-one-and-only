/**
 * 💖 MY ONE AND ONLY - SHIVI & SARVAN 3D PARAMETRIC ROSE & 5-GAME ARCADE
 * Features: Three.js Parametric 3D Rose Geometry Engine with PBR Velvet Shading,
 * Scroll-Driven 3D Petal Unfurling & Detachment Physics.
 */

document.addEventListener('DOMContentLoaded', () => {
  initSpotifyWidget();
  initHeartParticles();
  init3DRoseEngine();

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
   2. Three.js Parametric 3D WebGL Rose Geometry Engine
   -------------------------------------------------------------------------- */
function init3DRoseEngine() {
  const canvas = document.getElementById('flower-canvas-3d');
  const scrollContainer = document.getElementById('flower-scroll-container');
  const heroOverlay = document.getElementById('hero-overlay');
  const cardDisplay = document.getElementById('fallen-petal-card-display');

  if (!canvas || !scrollContainer || typeof THREE === 'undefined') return;

  // Scene, Camera & Renderer
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 1.2, 7.5);

  const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Lighting System
  const ambientLight = new THREE.AmbientLight(0xFFF0F3, 0.85);
  scene.add(ambientLight);

  const keyLight = new THREE.DirectionalLight(0xFFFFFF, 1.2);
  keyLight.position.set(5, 8, 5);
  scene.add(keyLight);

  const warmPointLight = new THREE.PointLight(0xFFE082, 1.5, 20);
  warmPointLight.position.set(-3, 2, 4);
  scene.add(warmPointLight);

  const fillLight = new THREE.DirectionalLight(0xD4A5A5, 0.6);
  fillLight.position.set(-5, -4, -2);
  scene.add(fillLight);

  // Helper Function: Create Curved 3D Rose Petal Geometry
  function createCurvedPetalGeometry(width = 1.6, height = 2.2, widthSegments = 16, heightSegments = 16) {
    const geo = new THREE.PlaneGeometry(width, height, widthSegments, heightSegments);
    const pos = geo.attributes.position;

    for (let i = 0; i < pos.count; i++) {
      const u = (pos.getX(i) / width) + 0.5; // 0 to 1
      const v = (pos.getY(i) / height) + 0.5; // 0 to 1

      // Cupping Z-displacement (petal bowl curvature)
      const cupZ = -0.35 * Math.sin(u * Math.PI) * Math.sin(v * Math.PI);
      
      // Edge flare curl
      const edgeCurl = 0.12 * Math.pow(v, 1.5) * Math.cos((u - 0.5) * Math.PI * 2);
      
      // Tapering top
      const taperX = (1 - 0.2 * Math.pow(v, 2));

      pos.setX(i, pos.getX(i) * taperX);
      pos.setZ(i, cupZ + edgeCurl);
    }

    geo.computeVertexNormals();
    return geo;
  }

  // PBR Velvet Rose Materials
  const petalMaterialDark = new THREE.MeshStandardMaterial({
    color: 0xC9184A,
    roughness: 0.38,
    metalness: 0.04,
    side: THREE.DoubleSide
  });

  const petalMaterialMid = new THREE.MeshStandardMaterial({
    color: 0xE63946,
    roughness: 0.35,
    metalness: 0.05,
    side: THREE.DoubleSide
  });

  const petalMaterialOuter = new THREE.MeshStandardMaterial({
    color: 0xFF4D6D,
    roughness: 0.32,
    metalness: 0.05,
    side: THREE.DoubleSide
  });

  const stemMaterial = new THREE.MeshStandardMaterial({
    color: 0x2D5A27,
    roughness: 0.6,
    metalness: 0.1
  });

  // Construct 3D Rose Master Group
  const roseGroup = new THREE.Group();
  scene.add(roseGroup);

  // Stem & Sepals
  const stemGeo = new THREE.CylinderGeometry(0.12, 0.15, 4.5, 16);
  const stemMesh = new THREE.Mesh(stemGeo, stemMaterial);
  stemMesh.position.y = -2.6;
  roseGroup.add(stemMesh);

  // Petal Storage Arrays
  const innerPetals = [];
  const midPetals = [];
  const outerPetals = [];
  const fallingPetals = [];

  // 1. Inner Bud Layer (6 Petals)
  const innerCount = 6;
  for (let i = 0; i < innerCount; i++) {
    const pivot = new THREE.Group();
    const geo = createCurvedPetalGeometry(1.1, 1.6);
    const mesh = new THREE.Mesh(geo, petalMaterialDark);
    mesh.position.y = 0.8;
    pivot.add(mesh);

    pivot.rotation.y = (i * Math.PI * 2) / innerCount;
    pivot.rotation.x = 0.22 + (i * 0.02);

    roseGroup.add(pivot);
    innerPetals.push({ pivot, baseAngleX: pivot.rotation.x });
  }

  // 2. Mid Layer (6 Petals)
  const midCount = 6;
  for (let i = 0; i < midCount; i++) {
    const pivot = new THREE.Group();
    const geo = createCurvedPetalGeometry(1.5, 2.0);
    const mesh = new THREE.Mesh(geo, petalMaterialMid);
    mesh.position.y = 1.0;
    pivot.add(mesh);

    pivot.rotation.y = (i * Math.PI * 2) / midCount + (Math.PI / 6);
    pivot.rotation.x = 0.45;

    roseGroup.add(pivot);
    midPetals.push({ pivot, baseAngleX: pivot.rotation.x });
  }

  // 3. Outer Blooming Layer (6 Petals)
  const outerCount = 6;
  for (let i = 0; i < outerCount; i++) {
    const pivot = new THREE.Group();
    const geo = createCurvedPetalGeometry(1.8, 2.4);
    const mesh = new THREE.Mesh(geo, petalMaterialOuter);
    mesh.position.y = 1.2;
    pivot.add(mesh);

    pivot.rotation.y = (i * Math.PI * 2) / outerCount;
    pivot.rotation.x = 0.75;

    roseGroup.add(pivot);
    outerPetals.push({ pivot, baseAngleX: pivot.rotation.x });
  }

  // 4. 5 Detachable Falling Moment Petals
  const fallingCount = 5;
  for (let i = 0; i < fallingCount; i++) {
    const pivot = new THREE.Group();
    const geo = createCurvedPetalGeometry(2.0, 2.5);
    const mesh = new THREE.Mesh(geo, petalMaterialOuter);
    mesh.position.y = 1.3;
    pivot.add(mesh);

    pivot.rotation.y = (i * Math.PI * 2) / fallingCount + (Math.PI / 10);
    pivot.rotation.x = 0.95;

    roseGroup.add(pivot);

    fallingPetals.push({
      pivot: pivot,
      mesh: mesh,
      baseAngleX: 0.95,
      baseAngleY: pivot.rotation.y,
      detached: false,
      monthIndex: i
    });
  }

  // Position Rose Group
  roseGroup.position.set(0, -0.2, 0);
  roseGroup.rotation.x = 0.35;

  // Scroll Tracking & Animation Physics
  let scrollProgress = 0;

  function updateScroll() {
    const rect = scrollContainer.getBoundingClientRect();
    const totalScrollable = scrollContainer.offsetHeight - window.innerHeight;
    if (totalScrollable <= 0) return;

    const currentScroll = Math.max(0, -rect.top);
    scrollProgress = Math.min(1, Math.max(0, currentScroll / totalScrollable));

    // Hero Overlay Fade Out
    if (heroOverlay) {
      const heroOpacity = Math.max(0, 1 - (scrollProgress / 0.22));
      heroOverlay.style.opacity = heroOpacity;
    }

    // 1. Rose Unfurling Rotation
    roseGroup.rotation.y = scrollProgress * Math.PI * 1.2;
    roseGroup.rotation.x = 0.35 + scrollProgress * 0.25;

    // 2. Uncurl Petals in 3D Space
    const bloomFactor = Math.min(1, scrollProgress / 0.35);

    innerPetals.forEach((p) => {
      p.pivot.rotation.x = p.baseAngleX + (bloomFactor * 0.35);
    });

    midPetals.forEach((p) => {
      p.pivot.rotation.x = p.baseAngleX + (bloomFactor * 0.55);
    });

    outerPetals.forEach((p) => {
      p.pivot.rotation.x = p.baseAngleX + (bloomFactor * 0.75);
    });

    // 3. Fall Physics & Detachment for 5 Moment Petals
    fallingPetals.forEach((p, i) => {
      const fallStartThreshold = 0.22 + (i * 0.15);

      if (scrollProgress >= fallStartThreshold) {
        const fallRatio = Math.min(1, (scrollProgress - fallStartThreshold) / 0.15);

        // Detach and Float down in 3D Space
        p.pivot.position.y = - (fallRatio * 8);
        p.pivot.position.x = Math.sin((Date.now() * 0.002) + i) * 1.5;
        p.pivot.rotation.z += 0.01;
        p.pivot.rotation.x = p.baseAngleX + (fallRatio * 1.5);
      } else {
        p.pivot.position.y = 0;
        p.pivot.position.x = 0;
        p.pivot.rotation.x = p.baseAngleX + (bloomFactor * 0.85);
      }
    });

    // 4. Sync Active Month Card Display
    if (typeof ANNIVERSARY_CONFIG !== 'undefined' && ANNIVERSARY_CONFIG.timeline) {
      let activeMonthIndex = -1;

      if (scrollProgress >= 0.22 && scrollProgress < 0.37) activeMonthIndex = 0;
      else if (scrollProgress >= 0.37 && scrollProgress < 0.52) activeMonthIndex = 1;
      else if (scrollProgress >= 0.52 && scrollProgress < 0.67) activeMonthIndex = 2;
      else if (scrollProgress >= 0.67 && scrollProgress < 0.82) activeMonthIndex = 3;
      else if (scrollProgress >= 0.82) activeMonthIndex = 4;

      if (activeMonthIndex >= 0 && cardDisplay) {
        const data = ANNIVERSARY_CONFIG.timeline[activeMonthIndex];
        document.getElementById('petal-card-badge').textContent = `Fallen 3D Petal #0${activeMonthIndex + 1} • Month 0${activeMonthIndex + 1}`;
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

  // Render Loop
  function animate() {
    requestAnimationFrame(animate);

    // Subtle gentle ambient float
    roseGroup.position.y = -0.2 + Math.sin(Date.now() * 0.0015) * 0.08;

    renderer.render(scene, camera);
  }

  animate();

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}

/* --------------------------------------------------------------------------
   3. Arcade Tabs Navigation Handler
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
   4. Game 1: Co-Op Scratch Builder with "Sarvan Cursor"
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
   5. Game 2: How Well Do You Know Sarvan? Quiz & Dream Location Video
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
   6. Game 3: Catch Sarvan's Heart Canvas Arcade
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
   7. Game 4: Memory Match Card Game
   -------------------------------------------------------------------------- */
function initMemoryGame() {
  const grid = document.getElementById('memory-grid');
  if (!grid) return;

  const items = ['💖', '💖', '🌹', '🌹', '☕', '☕', '🎵', '🎵', '💌', '💌', '✨', '✨'];
  items.sort(() => Math.random() - 0.5);

  let flippedCards = [];
  let matchedCount = 0;

  grid.innerHTML = '';

  items.forEach((item) => {
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
              openModal('🏆', 'Memory Match Master!', 'You matched all our memory cards, Shivi! Sarvan loves you! 💕');
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
      'YAY! You Said Yes, Shivi! 🎉',
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
