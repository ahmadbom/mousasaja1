/* ============================================================
   Luxury Islamic Wedding Invitation — Script
   ============================================================ */

/* ---------------- Floating Gold Particles ---------------- */
(function particles(){
  const canvas = document.getElementById('particles-canvas');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  let w, h, particlesArr = [];

  function resize(){
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  function Particle(){
    this.reset(true);
  }
  Particle.prototype.reset = function(initial){
    this.x = Math.random() * w;
    this.y = initial ? Math.random() * h : h + 10;
    this.r = Math.random() * 1.8 + 0.6;
    this.speed = Math.random() * 0.4 + 0.15;
    this.drift = (Math.random() - 0.5) * 0.3;
    this.opacity = Math.random() * 0.5 + 0.15;
    this.twinkle = Math.random() * 0.02 + 0.005;
    this.phase = Math.random() * Math.PI * 2;
  };
  Particle.prototype.update = function(){
    this.y -= this.speed;
    this.x += this.drift;
    this.phase += this.twinkle;
    if(this.y < -10) this.reset(false);
  };
  Particle.prototype.draw = function(){
    const flicker = (Math.sin(this.phase) + 1) / 2;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(205,163,77,${(this.opacity * (0.5 + flicker * 0.5)).toFixed(3)})`;
    ctx.shadowBlur = 6;
    ctx.shadowColor = 'rgba(205,163,77,0.6)';
    ctx.fill();
  };

  const count = window.innerWidth < 600 ? 35 : 70;
  for(let i = 0; i < count; i++) particlesArr.push(new Particle());

  function loop(){
    ctx.clearRect(0, 0, w, h);
    particlesArr.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(loop);
  }
  loop();
})();

/* ---------------- Landing Page: Open Invitation ---------------- */
(function landingTransition(){
  const openBtn = document.getElementById('openBtn');
  const veil = document.getElementById('veil');
  if(!openBtn || !veil) return;

  openBtn.addEventListener('click', () => {
    veil.classList.add('active');
    sessionStorage.setItem('inv_gesture', '1');
    setTimeout(() => {
      window.location.href = 'invitation.html';
    }, 650);
  });
})();

/* ---------------- Scroll Fade-in Animations ---------------- */
(function scrollReveal(){
  const sections = document.querySelectorAll('.section');
  if(!sections.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

  sections.forEach(sec => observer.observe(sec));
})();

/* ---------------- Countdown Timer ---------------- */
(function countdown(){
  const daysEl = document.getElementById('cd-days');
  const hoursEl = document.getElementById('cd-hours');
  const minsEl = document.getElementById('cd-mins');
  const secsEl = document.getElementById('cd-secs');
  if(!daysEl) return;

  // Wedding date/time — edit here to match the real event
 const target = new Date('2026-07-19T21:00:00');

  function pad(n){ return String(n).padStart(2, '0'); }

  function tick(){
    const now = new Date();
    let diff = target - now;
    if(diff < 0) diff = 0;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const mins = Math.floor((diff / (1000 * 60)) % 60);
    const secs = Math.floor((diff / 1000) % 60);

    daysEl.textContent = pad(days);
    hoursEl.textContent = pad(hours);
    minsEl.textContent = pad(mins);
    secsEl.textContent = pad(secs);
  }

  tick();
  setInterval(tick, 1000);
})();

/* ---------------- Quran Audio Player ---------------- */
(function audioPlayer(){
  const audio = document.getElementById('quranAudio');
  const playBtn = document.getElementById('playBtn');
  const iconPlay = document.getElementById('iconPlay');
  const iconPause = document.getElementById('iconPause');
  const progressFill = document.getElementById('progressFill');
  const audioHint = document.getElementById('audioHint');
  const audioPrompt = document.getElementById('audioPrompt');
  if(!audio) return;

  function setPlayingUI(isPlaying){
    iconPlay.style.display = isPlaying ? 'none' : 'block';
    iconPause.style.display = isPlaying ? 'block' : 'none';
    audioHint.textContent = isPlaying
      ? 'يتم التشغيل بهدوء — اضغط على الزر للإيقاف المؤقت'
      : 'متوقف مؤقتًا — اضغط على الزر للاستمرار';
  }

  playBtn.addEventListener('click', () => {
    if(audio.paused){
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  });

  audio.addEventListener('play', () => setPlayingUI(true));
  audio.addEventListener('pause', () => setPlayingUI(false));

  audio.addEventListener('timeupdate', () => {
    if(audio.duration){
      progressFill.style.width = ((audio.currentTime / audio.duration) * 100) + '%';
    }
  });

  // Attempt autoplay on load; if blocked by the browser, show a gentle prompt
  function tryAutoplay(){
    const playPromise = audio.play();
    if(playPromise !== undefined){
      playPromise
        .then(() => {
          if(audioPrompt) audioPrompt.classList.add('hidden');
        })
        .catch(() => {
          if(audioPrompt) audioPrompt.classList.remove('hidden');
        });
    }
  }

  window.addEventListener('DOMContentLoaded', tryAutoplay);

  if(audioPrompt){
    audioPrompt.addEventListener('click', () => {
      audio.play().catch(() => {});
      audioPrompt.classList.add('hidden');
    });
  }
})();
