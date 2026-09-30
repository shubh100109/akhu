/**
 * SORRY VIDEO CARD - FOR AKHU
 * Features:
 * - Real Background Song: Samjhawan (Lofi Flip)
 * - Surprise Pop-out Characters that suddenly peek in
 * - Forward-only storytelling (No back buttons, no sliding dots)
 * - Dynamic Animated "Come-and-Go" Love Feelings Reel (romantic, cute & funny)
 * - Readable 3.5s Celebration State on "Yes, I forgive you"
 * - Automatic Continuous Heart Rain on Grand Finale
 * - Anti-Clockwise Upright Centerpiece Selfie & Kiss Flip
 */

document.addEventListener('DOMContentLoaded', () => {
  // ==========================================
  // 1. STATE & DOM REFERENCES
  // ==========================================
  const state = {
    currentScene: 0,
    totalScenes: 5,
    isMusicPlaying: false,
    isAutoPlaying: false,
    autoPlayTimer: null,
    noButtonClickCount: 0,
    activeMemoryIdx: 0,
    isKissShowing: false,
    reelIndex: 0,
    reelTimer: null,
    isHeartRainActive: false,
    heartRainInterval: null,
    surprisePopoutTimer: null
  };

  const scenes = document.querySelectorAll('.card-scene');
  const card = document.getElementById('sorry-card');
  const canvas = document.getElementById('fx-canvas');
  const ctx = canvas.getContext('2d');

  // Background Audio
  const bgMusic = document.getElementById('bg-music');
  const btnMusic = document.getElementById('btn-music');
  const musicIcon = document.getElementById('music-icon');
  const musicText = document.getElementById('music-text');

  // Auto-play Button
  const btnAutoPlay = document.getElementById('btn-autoplay');
  const playIcon = document.getElementById('play-icon');
  const playText = document.getElementById('play-text');

  // Pop-out Surprise Character
  const surprisePopout = document.getElementById('surprise-popout');
  const popoutSpeech = document.getElementById('popout-speech');
  const popoutText = document.getElementById('popout-text');
  const popoutGif = document.getElementById('popout-gif');

  // Scene Buttons (Forward-only)
  const btnHearMe = document.getElementById('btn-hear-me');
  const btnNext1 = document.getElementById('btn-next-1');
  const btnNext2 = document.getElementById('btn-next-2');

  // Scene 4 Interactive Game
  const btnForgiveYes = document.getElementById('btn-forgive-yes');
  const btnForgiveNo = document.getElementById('btn-forgive-no');
  const forgiveGif = document.getElementById('forgive-gif');
  const forgiveTitle = document.getElementById('forgive-title');
  const forgiveSubtitle = document.getElementById('forgive-subtitle');
  const forgiveNormalView = document.getElementById('forgive-normal-view');
  const forgiveCelebrationView = document.getElementById('forgive-celebration-view');
  const countdownNum = document.getElementById('countdown-num');

  // Scene 3 Memory Stack
  const memoryStack = document.getElementById('memory-stack');
  const memoryCards = document.querySelectorAll('.memory-card');
  const photoCounter = document.getElementById('photo-counter');

  // Scene 3 Love Feelings Reel
  const loveReelCard = document.getElementById('love-reel-card');
  const reelItem = document.getElementById('reel-item');
  const reelIcon = document.getElementById('reel-icon');
  const reelTitle = document.getElementById('reel-title');
  const reelDesc = document.getElementById('reel-desc');
  const reelDots = document.querySelectorAll('.reel-dot');

  // Scene 5 Finale
  const photoFlipBtn = document.getElementById('photo-flip-btn');
  const finalPolaroid = document.getElementById('final-polaroid');
  const finalImgMain = document.getElementById('final-img-main');
  const finalImgKiss = document.getElementById('final-img-kiss');
  const photoFlipText = document.getElementById('photo-flip-text');
  const btnHug = document.getElementById('btn-hug');
  const btnRainLove = document.getElementById('btn-rain-love');
  const btnRestart = document.getElementById('btn-restart');
  const hugModal = document.getElementById('hug-modal');
  const btnCloseHug = document.getElementById('btn-close-hug');

  // ==========================================
  // 2. CANVAS SPARKLES, CONFETTI & HEART RAIN
  // ==========================================
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particles = [];
  const ambientHearts = [];

  class Particle {
    constructor(x, y, color, type = 'sparkle') {
      this.x = x;
      this.y = y;
      this.color = color;
      this.type = type;
      this.size = type === 'heart' ? Math.random() * 12 + 10 : (type === 'rain' ? Math.random() * 14 + 12 : Math.random() * 5 + 3);
      
      if (type === 'rain') {
        this.vx = (Math.random() - 0.5) * 1.5;
        this.vy = Math.random() * 2 + 1.8; // Downward rainfall
        this.heartChar = ['💖', '💕', '🌸', '✨', '🤍', '🧁', '🐰'][Math.floor(Math.random() * 7)];
      } else {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * (type === 'confetti' ? 7 : 3) + 1;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed - (type === 'confetti' ? 2 : 0);
      }

      this.life = 1;
      this.decay = type === 'rain' ? Math.random() * 0.006 + 0.004 : Math.random() * 0.02 + 0.015;
      this.rotation = Math.random() * Math.PI * 2;
      this.vRot = (Math.random() - 0.5) * 0.08;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.rotation += this.vRot;
      if (this.type === 'confetti') {
        this.vy += 0.15;
      }
      this.life -= this.decay;
    }

    draw(c) {
      c.save();
      c.globalAlpha = Math.max(0, this.life);
      c.translate(this.x, this.y);
      c.rotate(this.rotation);

      if (this.type === 'heart') {
        c.font = `${this.size}px sans-serif`;
        c.textAlign = 'center';
        c.textBaseline = 'middle';
        c.fillText('💖', 0, 0);
      } else if (this.type === 'rain') {
        c.font = `${this.size}px sans-serif`;
        c.textAlign = 'center';
        c.textBaseline = 'middle';
        c.fillText(this.heartChar, 0, 0);
      } else if (this.type === 'confetti') {
        c.fillStyle = this.color;
        c.fillRect(-this.size / 2, -this.size / 2, this.size, this.size * 0.6);
      } else {
        // Glowing sparkle star
        c.fillStyle = this.color;
        c.beginPath();
        for (let i = 0; i < 4; i++) {
          c.lineTo(Math.cos((i * Math.PI) / 2) * this.size, Math.sin((i * Math.PI) / 2) * this.size);
          c.lineTo(Math.cos((i * Math.PI) / 2 + Math.PI / 4) * (this.size * 0.35), Math.sin((i * Math.PI) / 2 + Math.PI / 4) * (this.size * 0.35));
        }
        c.closePath();
        c.fill();
      }

      c.restore();
    }
  }

  // Floating ambient background hearts
  class AmbientHeart {
    constructor() {
      this.reset(true);
    }
    reset(initial = false) {
      this.x = Math.random() * width;
      this.y = initial ? Math.random() * height : height + 20;
      this.size = Math.random() * 14 + 10;
      this.vy = -(Math.random() * 0.8 + 0.5);
      this.vx = Math.sin(Math.random() * 10) * 0.5;
      this.alpha = Math.random() * 0.35 + 0.15;
      this.char = ['💕', '🌸', '✨', '🤍', '🧁'][Math.floor(Math.random() * 5)];
    }
    update() {
      this.y += this.vy;
      this.x += Math.sin(this.y * 0.02) * 0.6;
      if (this.y < -30) this.reset();
    }
    draw(c) {
      c.save();
      c.globalAlpha = this.alpha;
      c.font = `${this.size}px sans-serif`;
      c.fillText(this.char, this.x, this.y);
      c.restore();
    }
  }

  for (let i = 0; i < 15; i++) {
    ambientHearts.push(new AmbientHeart());
  }

  function loopFX() {
    ctx.clearRect(0, 0, width, height);

    // Draw ambient background elements
    for (const ah of ambientHearts) {
      ah.update();
      ah.draw(ctx);
    }

    // Draw active particle sparkles, confetti & rain
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.update();
      p.draw(ctx);
      if (p.life <= 0) particles.splice(i, 1);
    }

    requestAnimationFrame(loopFX);
  }
  loopFX();

  // Pointer / Touch Trail Generator
  function spawnTrail(x, y) {
    const colors = ['#ff8fab', '#ffccd5', '#ffd166', '#f3e8ff', '#ff4d6d'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    if (Math.random() < 0.4) {
      particles.push(new Particle(x, y, color, 'heart'));
    } else {
      particles.push(new Particle(x, y, color, 'sparkle'));
    }
  }

  window.addEventListener('mousemove', (e) => {
    spawnTrail(e.clientX, e.clientY);
  });

  window.addEventListener('touchmove', (e) => {
    if (e.touches && e.touches[0]) {
      spawnTrail(e.touches[0].clientX, e.touches[0].clientY);
    }
  }, { passive: true });

  // Confetti explosion helper
  function triggerConfetti(originX = width / 2, originY = height / 2, count = 55) {
    const colors = ['#ff4d6d', '#ff758f', '#ffccd5', '#ffd166', '#a2d2ff', '#b5e48c', '#ffffff'];
    for (let i = 0; i < count; i++) {
      const color = colors[Math.floor(Math.random() * colors.length)];
      particles.push(new Particle(originX, originY, color, 'confetti'));
      if (i % 3 === 0) {
        particles.push(new Particle(originX, originY, color, 'heart'));
      }
    }
  }

  // Automatic Continuous Heart Rain (Active on Finale)
  function startAutomaticHeartRain() {
    if (state.isHeartRainActive) return;
    state.isHeartRainActive = true;
    
    // Spawn initial burst
    for (let i = 0; i < 25; i++) {
      particles.push(new Particle(Math.random() * width, Math.random() * height * 0.4, '#ff4d6d', 'rain'));
    }

    state.heartRainInterval = setInterval(() => {
      if (!state.isHeartRainActive) return;
      // Spawn 2-3 rain hearts from the top across the screen
      for (let i = 0; i < 3; i++) {
        const startX = Math.random() * width;
        const startY = -15 - Math.random() * 20;
        particles.push(new Particle(startX, startY, '#ff758f', 'rain'));
      }
    }, 200);
  }

  function stopAutomaticHeartRain() {
    state.isHeartRainActive = false;
    clearInterval(state.heartRainInterval);
  }

  // ==========================================
  // 3. BACKGROUND MUSIC: SAMJHAWAN (LOFI FLIP)
  // ==========================================
  function playSong() {
    if (!bgMusic) return;
    bgMusic.play().then(() => {
      state.isMusicPlaying = true;
      btnMusic.classList.add('active');
      musicIcon.textContent = '🎶';
      musicText.textContent = 'Playing: Samjhawan';
    }).catch((e) => {
      console.warn('Audio play error (waiting for user interaction):', e);
    });
  }

  function pauseSong() {
    if (!bgMusic) return;
    bgMusic.pause();
    state.isMusicPlaying = false;
    btnMusic.classList.remove('active');
    musicIcon.textContent = '🎵';
    musicText.textContent = 'Song: Samjhawan (Paused)';
  }

  function toggleMusic() {
    if (state.isMusicPlaying) {
      pauseSong();
    } else {
      playSong();
    }
  }

  btnMusic.addEventListener('click', toggleMusic);

  // ==========================================
  // 4. SURPRISE POP-OUT CHARACTER SYSTEM
  // ==========================================
  const surprisePopoutList = [
    { text: "Pwease listen to him! 🥺", gif: "assets/gifs/cute-adorable.gif" },
    { text: "Bun Bun! Look at him, he's so sorry! 😭", gif: "assets/gifs/crying-dudu3.gif" },
    { text: "He loves you to the moon & back! 💕", gif: "assets/gifs/mocha-bear-hearts.gif" },
    { text: "He promised unlimited cuddles & sweets! 🧁", gif: "assets/gifs/bubu-bubu-dudu.gif" },
    { text: "You're his favorite Sugar Puff Akhu! 🌸", gif: "assets/gifs/kawaii-mochi.gif" },
    { text: "Say yes to your idiot bun bun! 🥰", gif: "assets/gifs/happy1.gif" }
  ];

  let popoutIndex = 0;

  function triggerSurprisePopout(customText = null, customGif = null) {
    if (!surprisePopout) return;

    const data = surprisePopoutList[popoutIndex % surprisePopoutList.length];
    popoutIndex++;

    popoutText.textContent = customText || data.text;
    popoutGif.src = customGif || data.gif;

    surprisePopout.classList.add('active');

    // Pop tiny hearts at the popout character
    const rect = surprisePopout.getBoundingClientRect();
    triggerConfetti(rect.left + 30, rect.top, 8);

    // Auto-hide after 3.8 seconds
    clearTimeout(state.surprisePopoutTimer);
    state.surprisePopoutTimer = setTimeout(() => {
      surprisePopout.classList.remove('active');
    }, 3800);
  }

  // Tapping the pop-out character triggers heart burst!
  if (surprisePopout) {
    surprisePopout.addEventListener('click', () => {
      const rect = surprisePopout.getBoundingClientRect();
      triggerConfetti(rect.left + 35, rect.top + 20, 20);
      popoutText.textContent = "He loves you SO much! 💖";
    });
  }

  // Schedule surprise pop-outs every 9-14 seconds
  function startPopoutLoop() {
    const randomDelay = Math.random() * 5000 + 9000;
    setTimeout(() => {
      triggerSurprisePopout();
      startPopoutLoop();
    }, randomDelay);
  }
  startPopoutLoop();

  // ==========================================
  // 5. SCENE NAVIGATION (FORWARD-ONLY)
  // ==========================================
  function goToScene(targetIdx) {
    if (targetIdx < 0 || targetIdx >= state.totalScenes || targetIdx === state.currentScene) {
      return;
    }

    const currentSceneEl = scenes[state.currentScene];
    const targetSceneEl = scenes[targetIdx];

    // Outgoing animation
    currentSceneEl.classList.remove('active');
    currentSceneEl.classList.add('slide-out-left');

    setTimeout(() => {
      currentSceneEl.classList.remove('slide-out-left');
    }, 450);

    // Incoming animation
    targetSceneEl.classList.add('active');
    state.currentScene = targetIdx;

    // Trigger surprise pop-out on scene change!
    setTimeout(() => {
      if (targetIdx === 1) {
        triggerSurprisePopout("Psst! Look how cute you two are! 🤍", "assets/gifs/cute-adorable.gif");
      } else if (targetIdx === 2) {
        triggerSurprisePopout("You're his sweet little bun bun! 🐰", "assets/gifs/mocha-bear-hearts.gif");
      } else if (targetIdx === 3) {
        triggerSurprisePopout("Don't click No, he's crying! 🥺", "assets/gifs/sad2.gif");
      } else if (targetIdx === 4) {
        triggerSurprisePopout("YAYYY FOREVER TOGETHER! 💍", "assets/gifs/happy0.gif");
      }
    }, 800);

    // Trigger specific scene effects
    if (targetIdx === 0) {
      triggerConfetti(width / 2, height / 2, 15);
      stopAutomaticHeartRain();
      stopC2Slideshow();
    } else if (targetIdx === 1) {
      stopC2Slideshow();
      stopAutomaticHeartRain();
    } else if (targetIdx === 2) {
      startC2Slideshow();
      startFloatingLoveReel();
      stopAutomaticHeartRain();
    } else if (targetIdx === 3) {
      stopC2Slideshow();
      resetForgiveGame();
      stopAutomaticHeartRain();
    } else if (targetIdx === 4) {
      stopC2Slideshow();
      // Final scene: AUTOMATIC CONTINUOUS HEART RAIN!
      setTimeout(() => {
        triggerConfetti(width / 2, height * 0.4, 75);
        startAutomaticHeartRain();
      }, 300);
    }
  }

  // Scene 1: "Please hear me out once 🥺👉👈"
  btnHearMe.addEventListener('click', (e) => {
    triggerConfetti(e.clientX || width / 2, e.clientY || height / 2, 45);

    // Start Samjhawan (Lofi Flip) on first tap!
    playSong();

    setTimeout(() => {
      goToScene(1);
    }, 350);
  });

  // Scene 2 & 3 Forward-only Buttons
  btnNext1.addEventListener('click', () => goToScene(2));
  btnNext2.addEventListener('click', () => goToScene(3));

  // Chapter 2 Background Slides & Floating Love Reel
  const c2Slides = document.querySelectorAll('.c2-slide');
  const floatingLoveItem = document.getElementById('floating-love-item');
  const floatingLoveBadge = document.getElementById('floating-love-badge');
  const floatingLoveText = document.getElementById('floating-love-text');
  const floatingLoveReel = document.getElementById('floating-love-reel');

  let c2SlideIdx = 0;
  function startC2Slideshow() {
    clearInterval(state.c2SlideTimer);
    c2SlideIdx = 0;
    c2Slides.forEach((s, idx) => s.classList.toggle('active', idx === 0));
    state.c2SlideTimer = setInterval(() => {
      c2SlideIdx = (c2SlideIdx + 1) % c2Slides.length;
      c2Slides.forEach((s, idx) => s.classList.toggle('active', idx === c2SlideIdx));
    }, 3600);
  }

  function stopC2Slideshow() {
    clearInterval(state.c2SlideTimer);
  }

  // ==========================================
  // 6. FLOATING ANIMATED LOVE FEELINGS
  // (Sincere, Sweet, Tender & Touching)
  // ==========================================
  const floatingLoveEntries = [
    {
      badge: "🐰 My Sweet Little Bun Bun",
      text: "You are the softest, purest love in my entire life. My world is only colorful when you smile."
    },
    {
      badge: "🧁 My Precious Sugar Puff",
      text: "The sweetness in everything I do. I promise to never bring bitterness or harsh words into our love again."
    },
    {
      badge: "🌸 My One & Only Akhu",
      text: "The girl who holds my whole heart. Seeing you hurt broke my own soul. You deserve only tenderness."
    },
    {
      badge: "🤝 Forever Holding Your Hand",
      text: "My fingers belong intertwined with yours. Through every silly misunderstanding, I will always choose you."
    },
    {
      badge: "🤍 My Peace & My Home",
      text: "No anger will ever be bigger than my love for you. You are my home, my Akhu."
    }
  ];

  function updateFloatingLoveReel(newIdx) {
    if (!floatingLoveItem) return;
    state.reelIndex = newIdx % floatingLoveEntries.length;

    floatingLoveItem.classList.remove('fade-in');
    floatingLoveItem.classList.add('fade-out');

    setTimeout(() => {
      const data = floatingLoveEntries[state.reelIndex];
      floatingLoveBadge.textContent = data.badge;
      floatingLoveText.textContent = data.text;

      floatingLoveItem.classList.remove('fade-out');
      floatingLoveItem.classList.add('fade-in');
    }, 320);
  }

  function startFloatingLoveReel() {
    clearInterval(state.reelTimer);
    state.reelTimer = setInterval(() => {
      updateFloatingLoveReel(state.reelIndex + 1);
    }, 3800);
  }

  if (floatingLoveReel) {
    floatingLoveReel.addEventListener('click', () => {
      updateFloatingLoveReel(state.reelIndex + 1);
      triggerConfetti(width / 2, height * 0.5, 10);
      startFloatingLoveReel();
    });
  }

  // ==========================================
  // 7. PLAYFUL RUNAWAY "NO" BUTTON & SWEET CELEBRATION
  // ==========================================
  const playfulPleadings = [
    { title: "Wait, really? 🥺 Are you sure?", subtitle: "Look at my sad puppy eyes... pwease? 🥺", gif: "assets/gifs/sad1.gif", noText: "Still No 🙈" },
    { title: "I am truly sorry, Akhu... 🥺", subtitle: "I promise I will never speak to you with that tone or anger ever again.", gif: "assets/gifs/sad2.gif", noText: "Promise? 🥺" },
    { title: "Can I give you a warm tight hug? 🫂", subtitle: "I miss holding my sweet little bun bun so much...", gif: "assets/gifs/couple-forgive-me.gif", noText: "Maybe... 👉👈" },
    { title: "My heart hurts seeing you sad... 💔", subtitle: "You are the most precious person in my life. Please forgive your idiot.", gif: "assets/gifs/crying-dudu4.gif", noText: "Don't cry 🥺" },
    { title: "I love you with all my heart, Akhu 🌸", subtitle: "No fight and no bad mood will ever change how much you mean to me.", gif: "assets/gifs/happy2.gif", noText: "Yes! ❤️" }
  ];

  function resetForgiveGame() {
    state.noButtonClickCount = 0;
    if (forgiveNormalView) forgiveNormalView.style.display = 'flex';
    if (forgiveCelebrationView) forgiveCelebrationView.style.display = 'none';
    btnForgiveYes.style.transform = 'scale(1)';
    btnForgiveNo.style.transform = 'translate(0, 0)';
    btnForgiveNo.textContent = 'No 😤';
    forgiveTitle.textContent = 'Akhu... do you forgive me? 🥺';
    forgiveSubtitle.textContent = 'I promise unlimited cuddles, sweet treats, and to never speak to you harshly ever again!';
    forgiveGif.src = 'assets/gifs/sad0.gif';
  }

  function handleNoInteraction() {
    state.noButtonClickCount++;

    const stepIdx = Math.min(state.noButtonClickCount - 1, playfulPleadings.length - 1);
    const data = playfulPleadings[stepIdx];

    forgiveTitle.textContent = data.title;
    forgiveSubtitle.textContent = data.subtitle;
    forgiveGif.src = data.gif;
    btnForgiveNo.textContent = data.noText;

    // Enlarge "Yes" button progressively
    const yesScale = 1 + state.noButtonClickCount * 0.12;
    btnForgiveYes.style.transform = `scale(${yesScale})`;

    // Playful dodge movement for "No" button
    const randomX = (Math.random() - 0.5) * 55;
    const randomY = (Math.random() - 0.5) * 30;
    btnForgiveNo.style.transform = `translate(${randomX}px, ${randomY}px)`;

    triggerConfetti(width / 2, height * 0.5, 10);

    // If she clicked No repeatedly, auto-accept!
    if (state.noButtonClickCount >= 5) {
      btnForgiveNo.addEventListener('click', () => {
        acceptForgiveness();
      }, { once: true });
    }
  }

  btnForgiveNo.addEventListener('click', handleNoInteraction);
  btnForgiveNo.addEventListener('mouseenter', () => {
    if (state.noButtonClickCount > 1) {
      handleNoInteraction();
    }
  });

  // When she clicks "Yes, I forgive you":
  // Simple, touching, sincere celebration! Stays for 3.5s so it's comfortable to read!
  function acceptForgiveness() {
    triggerConfetti(width / 2, height / 2, 85);

    // Switch to sweet, sincere celebration view
    if (forgiveNormalView) forgiveNormalView.style.display = 'none';
    if (forgiveCelebrationView) forgiveCelebrationView.style.display = 'flex';

    triggerSurprisePopout("I love you so much, Akhu ❤️", "assets/gifs/happy1.gif");

    let secondsLeft = 3;
    const timerInterval = setInterval(() => {
      secondsLeft--;
      triggerConfetti(width / 2, height * 0.45, 15);
      if (secondsLeft <= 0) {
        clearInterval(timerInterval);
        goToScene(4);
      }
    }, 1000);
  }

  btnForgiveYes.addEventListener('click', acceptForgiveness);

  // ==========================================
  // 9. FINALE: SPECIAL PHOTO TOGGLE & ACTIONS
  // ==========================================
  function flipFinalPhoto() {
    state.isKissShowing = !state.isKissShowing;
    triggerConfetti(width / 2, height * 0.35, 25);

    if (state.isKissShowing) {
      finalImgMain.classList.remove('active');
      finalImgKiss.classList.add('active');
      photoFlipText.textContent = 'Tap for our smiling selfie 🥰';
    } else {
      finalImgKiss.classList.remove('active');
      finalImgMain.classList.add('active');
      photoFlipText.textContent = 'Tap for our sweet kiss 💋';
    }
  }

  if (photoFlipBtn) {
    photoFlipBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      flipFinalPhoto();
    });
  }

  if (finalPolaroid) {
    finalPolaroid.addEventListener('click', flipFinalPhoto);
  }

  // Virtual Hug Modal
  btnHug.addEventListener('click', () => {
    triggerConfetti(width / 2, height / 2, 60);
    hugModal.classList.add('active');
  });

  btnCloseHug.addEventListener('click', () => {
    hugModal.classList.remove('active');
  });

  // Rain Hearts Action
  btnRainLove.addEventListener('click', () => {
    triggerConfetti(width * 0.3, height * 0.3, 40);
    triggerConfetti(width * 0.7, height * 0.3, 40);
    triggerConfetti(width * 0.5, height * 0.5, 60);
  });

  // Restart Story
  btnRestart.addEventListener('click', () => {
    resetForgiveGame();
    stopAutomaticHeartRain();
    goToScene(0);
  });

  // ==========================================
  // 10. AUTO-PLAY STORY MODE
  // ==========================================
  function startAutoPlay() {
    playSong();
    state.isAutoPlaying = true;
    btnAutoPlay.classList.add('active');
    playIcon.textContent = '⏸';
    playText.textContent = 'Pause';

    clearTimeout(state.autoPlayTimer);
    scheduleNextAutoSlide();
  }

  function stopAutoPlay() {
    state.isAutoPlaying = false;
    btnAutoPlay.classList.remove('active');
    playIcon.textContent = '▶';
    playText.textContent = 'Auto Play';
    clearTimeout(state.autoPlayTimer);
  }

  function scheduleNextAutoSlide() {
    if (!state.isAutoPlaying) return;

    state.autoPlayTimer = setTimeout(() => {
      if (!state.isAutoPlaying) return;
      const nextIdx = (state.currentScene + 1) % state.totalScenes;
      goToScene(nextIdx);

      if (nextIdx === state.totalScenes - 1) {
        stopAutoPlay();
      } else {
        scheduleNextAutoSlide();
      }
    }, 7000);
  }

  btnAutoPlay.addEventListener('click', () => {
    if (state.isAutoPlaying) {
      stopAutoPlay();
    } else {
      startAutoPlay();
    }
  });

  // Desktop Card 3D Tilt Effect
  window.addEventListener('mousemove', (e) => {
    if (window.innerWidth < 768) return;
    const cardRect = card.getBoundingClientRect();
    const cardCenterX = cardRect.left + cardRect.width / 2;
    const cardCenterY = cardRect.top + cardRect.height / 2;

    const rotY = ((e.clientX - cardCenterX) / (window.innerWidth / 2)) * 4;
    const rotX = -((e.clientY - cardCenterY) / (window.innerHeight / 2)) * 4;

    card.style.transform = `perspective(1000px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg)`;
  });

  window.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
  });
});
