/**
 * 💖 MY ONE AND ONLY - TOKYO HANABI NIGHT SKY & MUSIC JUKEBOX
 * Features: Lana Del Rey & The Weeknd Jukebox Engine, Clean 2D Animated Rose,
 * Canvas Fireworks Engine, Scratch Block Coding, 5 Arcade Games.
 */

document.addEventListener('DOMContentLoaded', () => {
  initSpotifyWidget();
  initHeartParticles();
  initFireworksEngine();
  init2DRoseScroll();

  // Music Jukebox Engine
  renderMusicJukebox();

  // Timers
  initLiveTimer();
  initNextChapterTimer();

  // Arcade 5 Mini-Games Initializers
  initArcadeTabs();
  initScratchBlockBuilder();
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
   2. 🎵 Lana Del Rey & The Weeknd Music Jukebox Engine
   -------------------------------------------------------------------------- */
function renderMusicJukebox() {
  const gridContainer = document.getElementById('music-tracks-grid');
  const trackTitleEl = document.getElementById('jukebox-track-title');
  const artistNameEl = document.getElementById('jukebox-artist-name');
  const iconEl = document.getElementById('jukebox-icon');
  const audioPlayer = document.getElementById('jukebox-audio-player');
  const spotifyIframe = document.getElementById('spotify-iframe');
  const spotifyArtistLabel = document.getElementById('spotify-artist-label');
  const spotifyTrackLabel = document.getElementById('spotify-track-label');

  if (!gridContainer || typeof ANNIVERSARY_CONFIG === 'undefined' || !ANNIVERSARY_CONFIG.musicPlaylist) return;

  const tracks = ANNIVERSARY_CONFIG.musicPlaylist;
  gridContainer.innerHTML = '';

  tracks.forEach((track, idx) => {
    const btn = document.createElement('button');
    btn.className = `track-card-btn ${idx === 0 ? 'active' : ''}`;
    btn.innerHTML = `
      <span class="track-cover">${track.cover}</span>
      <div>
        <div class="track-name">${track.title}</div>
        <div class="track-artist">${track.artist}</div>
      </div>
    `;

    btn.addEventListener('click', () => {
      document.querySelectorAll('.track-card-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      if (trackTitleEl) trackTitleEl.textContent = track.title;
      if (artistNameEl) artistNameEl.textContent = track.artist;
      if (iconEl) iconEl.textContent = track.cover;

      if (audioPlayer) {
        audioPlayer.src = track.audioUrl;
        audioPlayer.play().catch((e) => console.log('Audio autoplay prevented:', e));
      }

      if (spotifyIframe && track.spotifyUrl) {
        spotifyIframe.src = track.spotifyUrl;
      }
      if (spotifyArtistLabel) spotifyArtistLabel.textContent = track.artist;
      if (spotifyTrackLabel) spotifyTrackLabel.textContent = track.title;

      triggerConfetti();
      launchFireworkBurst(window.innerWidth / 2, window.innerHeight * 0.4);
    });

    gridContainer.appendChild(btn);
  });

  // Set initial default track
  if (tracks.length > 0 && audioPlayer) {
    audioPlayer.src = tracks[0].audioUrl;
  }
}

/* --------------------------------------------------------------------------
   3. Clean 2D Animated Vector Rose Scroll Engine (5 Month Petals)
   -------------------------------------------------------------------------- */
function init2DRoseScroll() {
  const scrollContainer = document.getElementById('flower-scroll-container');
  const heroOverlay = document.getElementById('hero-overlay');
  const cardDisplay = document.getElementById('fallen-petal-card-display');
  const vectorRoseSvg = document.getElementById('vector-rose-svg');

  const petalEls = [
    document.getElementById('vector-petal-1'),
    document.getElementById('vector-petal-2'),
    document.getElementById('vector-petal-3'),
    document.getElementById('vector-petal-4'),
    document.getElementById('vector-petal-5')
  ];

  if (!scrollContainer || !vectorRoseSvg) return;

  let scrollProgress = 0;

  function updateScroll() {
    const rect = scrollContainer.getBoundingClientRect();
    const totalScrollable = scrollContainer.offsetHeight - window.innerHeight;
    if (totalScrollable <= 0) return;

    const currentScroll = Math.max(0, -rect.top);
    scrollProgress = Math.min(1, Math.max(0, currentScroll / totalScrollable));

    if (heroOverlay) {
      const heroOpacity = Math.max(0, 1 - (scrollProgress / 0.22));
      heroOverlay.style.opacity = heroOpacity;
    }

    vectorRoseSvg.style.transform = `scale(${1 + scrollProgress * 0.25}) rotate(${scrollProgress * 45}deg)`;

    const petalAngles = [-45, 45, -75, 75, 0];

    petalEls.forEach((petal, i) => {
      if (!petal) return;
      const petalThreshold = 0.18 + (i * 0.16);

      if (scrollProgress >= petalThreshold) {
        const uncurlRatio = Math.min(1, (scrollProgress - petalThreshold) / 0.16);
        const targetRotate = petalAngles[i] * (1 + uncurlRatio * 0.8);
        const targetTranslateY = uncurlRatio * 35;
        const targetScale = 1 + uncurlRatio * 0.15;

        petal.style.transform = `translateY(${targetTranslateY}px) rotate(${targetRotate}deg) scale(${targetScale})`;
      } else {
        petal.style.transform = `rotate(0deg) scale(1)`;
      }
    });

    if (typeof ANNIVERSARY_CONFIG !== 'undefined' && ANNIVERSARY_CONFIG.timeline) {
      let activeMonthIndex = -1;

      if (scrollProgress >= 0.18 && scrollProgress < 0.34) activeMonthIndex = 0;
      else if (scrollProgress >= 0.34 && scrollProgress < 0.50) activeMonthIndex = 1;
      else if (scrollProgress >= 0.50 && scrollProgress < 0.66) activeMonthIndex = 2;
      else if (scrollProgress >= 0.66 && scrollProgress < 0.82) activeMonthIndex = 3;
      else if (scrollProgress >= 0.82) activeMonthIndex = 4;

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
}

/* --------------------------------------------------------------------------
   4. Interactive Tokyo Fireworks Particle Engine (Hanabi Engine)
   -------------------------------------------------------------------------- */
let launchFireworkBurst = function(x, y) {};

function initFireworksEngine() {
  const canvas = document.getElementById('fireworks-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const fireworks = [];
  const particles = [];
  const colors = ['#E0A96D', '#FF758F', '#D4A5A5', '#FFF0F3', '#FFD166', '#06D6A0'];

  class Firework {
    constructor(startX, startY, targetX, targetY) {
      this.x = startX;
      this.y = startY;
      this.startX = startX;
      this.startY = startY;
      this.targetX = targetX;
      this.targetY = targetY;
      this.distanceToTarget = Math.hypot(targetX - startX, targetY - startY);
      this.distanceTraveled = 0;
      this.coordinates = [];
      this.coordinateCount = 3;

      while (this.coordinateCount--) {
        this.coordinates.push([this.x, this.y]);
      }

      this.angle = Math.atan2(targetY - startY, targetX - startX);
      this.speed = 3.5;
      this.acceleration = 1.05;
      this.brightness = Math.random() * 30 + 70;
      this.targetRadius = 1;
    }

    update(index) {
      this.coordinates.pop();
      this.coordinates.unshift([this.x, this.y]);

      if (this.targetRadius < 8) {
        this.targetRadius += 0.3;
      } else {
        this.targetRadius = 1;
      }

      this.speed *= this.acceleration;
      const vx = Math.cos(this.angle) * this.speed;
      const vy = Math.sin(this.angle) * this.speed;
      this.distanceTraveled = Math.hypot(this.x + vx - this.startX, this.y + vy - this.startY);

      if (this.distanceTraveled >= this.distanceToTarget) {
        createParticles(this.targetX, this.targetY);
        fireworks.splice(index, 1);
      } else {
        this.x += vx;
        this.y += vy;
      }
    }

    draw() {
      ctx.beginPath();
      ctx.moveTo(this.coordinates[this.coordinates.length - 1][0], this.coordinates[this.coordinates.length - 1][1]);
      ctx.lineTo(this.x, this.y);
      ctx.strokeStyle = `hsl(${Math.random() * 360}, 100%, ${this.brightness}%)`;
      ctx.stroke();
    }
  }

  class Particle {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.coordinates = [];
      this.coordinateCount = 5;

      while (this.coordinateCount--) {
        this.coordinates.push([this.x, this.y]);
      }

      this.angle = Math.random() * Math.PI * 2;
      this.speed = Math.random() * 10 + 1;
      this.friction = 0.95;
      this.gravity = 0.98;
      this.hue = Math.floor(Math.random() * 360);
      this.brightness = Math.random() * 30 + 70;
      this.alpha = 1;
      this.decay = Math.random() * 0.018 + 0.012;
      this.color = colors[Math.floor(Math.random() * colors.length)];
    }

    update(index) {
      this.coordinates.pop();
      this.coordinates.unshift([this.x, this.y]);
      this.speed *= this.friction;
      this.x += Math.cos(this.angle) * this.speed;
      this.y += Math.sin(this.angle) * this.speed + this.gravity;
      this.alpha -= this.decay;

      if (this.alpha <= this.decay) {
        particles.splice(index, 1);
      }
    }

    draw() {
      ctx.beginPath();
      ctx.moveTo(this.coordinates[this.coordinates.length - 1][0], this.coordinates[this.coordinates.length - 1][1]);
      ctx.lineTo(this.x, this.y);
      ctx.strokeStyle = this.color;
      ctx.globalAlpha = this.alpha;
      ctx.stroke();
      ctx.globalAlpha = 1;
    }
  }

  function createParticles(x, y) {
    let particleCount = 75;
    while (particleCount--) {
      particles.push(new Particle(x, y));
    }
  }

  launchFireworkBurst = function(x, y) {
    const startX = width / 2 + (Math.random() - 0.5) * 400;
    const startY = height;
    fireworks.push(new Firework(startX, startY, x, y));
  };

  setInterval(() => {
    if (Math.random() > 0.4) {
      launchFireworkBurst(Math.random() * width, Math.random() * (height * 0.5) + 80);
    }
  }, 2200);

  function loop() {
    ctx.globalCompositeOperation = 'destination-out';
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.fillRect(0, 0, width, height);
    ctx.globalCompositeOperation = 'lighter';

    let i = fireworks.length;
    while (i--) {
      fireworks[i].draw();
      fireworks[i].update(i);
    }

    let j = particles.length;
    while (j--) {
      particles[j].draw();
      particles[j].update(j);
    }

    requestAnimationFrame(loop);
  }

  loop();
}

/* --------------------------------------------------------------------------
   5. Arcade Tabs Navigation Handler
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
   6. Game 1: Scratch Block Coding Engine with "Sarvan Cursor"
   -------------------------------------------------------------------------- */
function initScratchBlockBuilder() {
  const palette = document.getElementById('scratch-palette');
  const stackWorkspace = document.getElementById('scratch-stack');
  const placeholder = document.getElementById('scratch-placeholder');
  const sarvanCursor = document.getElementById('sarvan-cursor');
  const instruction = document.getElementById('scratch-instruction');
  const rewardCard = document.getElementById('blooming-reward-card');

  if (!palette || !stackWorkspace || !sarvanCursor || typeof ANNIVERSARY_CONFIG === 'undefined' || !ANNIVERSARY_CONFIG.scratchBlocks) return;

  const blocksData = ANNIVERSARY_CONFIG.scratchBlocks;
  let currentStep = 0;
  palette.innerHTML = '';

  blocksData.forEach((block, idx) => {
    const el = document.createElement('div');
    el.className = `scratch-block scratch-block-${block.type}`;
    el.setAttribute('data-id', block.id);
    el.setAttribute('data-idx', idx);
    el.innerHTML = `<span>${block.icon}</span> <span>${block.label}</span>`;

    palette.appendChild(el);
  });

  const paletteBlockEls = palette.querySelectorAll('.scratch-block');

  function updateSarvanCursorPosition(stepIdx) {
    if (stepIdx >= blocksData.length) {
      sarvanCursor.classList.remove('active');
      return;
    }

    const targetBlock = paletteBlockEls[stepIdx];
    if (!targetBlock) return;

    const rect = targetBlock.getBoundingClientRect();
    const containerRect = document.getElementById('arcade-container').getBoundingClientRect();

    const topOffset = rect.top - containerRect.top + 15;
    const leftOffset = rect.left - containerRect.left + rect.width / 2;

    sarvanCursor.style.top = `${topOffset}px`;
    sarvanCursor.style.left = `${leftOffset}px`;
    sarvanCursor.classList.add('active');

    paletteBlockEls.forEach((b) => b.classList.remove('target-highlight'));
    targetBlock.classList.add('target-highlight');

    if (instruction) {
      instruction.textContent = `Sarvan is pointing to block #${stepIdx + 1}: Click to snap into code! 🧩`;
    }
  }

  setTimeout(() => {
    updateSarvanCursorPosition(0);
  }, 500);

  paletteBlockEls.forEach((btn, idx) => {
    btn.addEventListener('click', () => {
      if (idx === currentStep) {
        if (placeholder) placeholder.style.display = 'none';

        const blockData = blocksData[idx];
        const stackedEl = document.createElement('div');
        stackedEl.className = `scratch-block scratch-block-${blockData.type} scratch-stacked-block`;
        stackedEl.innerHTML = `<span>${blockData.icon}</span> <span>${blockData.label}</span>`;
        stackWorkspace.appendChild(stackedEl);

        btn.style.opacity = '0.3';
        btn.style.pointerEvents = 'none';
        btn.classList.remove('target-highlight');

        triggerConfetti();
        launchFireworkBurst(window.innerWidth / 2, window.innerHeight * 0.4);

        currentStep++;

        if (currentStep < blocksData.length) {
          updateSarvanCursorPosition(currentStep);
        } else {
          if (instruction) instruction.style.display = 'none';
          if (rewardCard) rewardCard.classList.add('active');
          triggerMassiveHeartCascade();
        }
      }
    });
  });
}

/* --------------------------------------------------------------------------
   7. Game 2: How Well Do You Know Sarvan? Quiz & Dream Location Video
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
          launchFireworkBurst(window.innerWidth / 2, window.innerHeight * 0.35);

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
        launchFireworkBurst(window.innerWidth / 2, window.innerHeight * 0.3);
      }
    });
  });
}

/* --------------------------------------------------------------------------
   8. Game 3: Catch Sarvan's Heart Canvas Arcade
   -------------------------------------------------------------------------- */
function initCatchGame() {
  const canvas = document.getElementById('catch-canvas');
  const scoreDisplay = document.getElementById('catch-score-display');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = canvas.parentElement.clientWidth || 450);
  let height = (canvas.height = 300);

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

    ctx.fillStyle = '#E0A96D';
    ctx.beginPath();
    ctx.roundRect(basketX, height - 25, basketWidth, basketHeight, 8);
    ctx.fill();

    for (let i = hearts.length - 1; i >= 0; i--) {
      const h = hearts[i];
      h.y += h.speed;

      ctx.fillStyle = '#FF758F';
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
   9. Game 4: Memory Match Card Game
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
   10. Relationship Timers
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
   11. Render Flip Cards, Envelopes & Coupons
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
      launchFireworkBurst(window.innerWidth / 2, window.innerHeight * 0.5);
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
      launchFireworkBurst(window.innerWidth / 2, window.innerHeight * 0.4);
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
        launchFireworkBurst(window.innerWidth / 2, window.innerHeight * 0.35);
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
   12. Proposal Interaction Handlers
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
    launchFireworkBurst(window.innerWidth / 2, window.innerHeight * 0.3);
    launchFireworkBurst(window.innerWidth * 0.25, window.innerHeight * 0.4);
    launchFireworkBurst(window.innerWidth * 0.75, window.innerHeight * 0.4);

    openModal(
      '💖',
      'YAY! You Said Yes, Shivi! 🎉',
      `You are officially Sarvan's favorite person forever and ever!\n\nThank you for making these past 5 months so incredibly sweet, magical, and unforgettable.\n\nSarvan loves you with all his heart! 💕✨`
    );
  });
}

/* --------------------------------------------------------------------------
   13. Particles & Modals
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
      this.color = Math.random() > 0.4 ? '#E0A96D' : '#FF758F';
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
      colors: ['#E0A96D', '#FF758F', '#D4A5A5', '#FFF0F3']
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
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }, colors: ['#E0A96D', '#FF758F', '#D4A5A5'] });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }, colors: ['#E0A96D', '#FF758F', '#FFF0F3'] });
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
