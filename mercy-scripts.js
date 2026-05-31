/* ================================================
   MERCY — A Love Letter in Poems
   JavaScript: mercy-scripts.js
   ================================================ */


// ── CUSTOM CURSOR ───────────────────────────────
const cursor = document.getElementById('cursor');
const trail  = document.getElementById('trail');
let mx = 0, my = 0, tx = 0, ty = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cursor.style.left = mx + 'px';
  cursor.style.top  = my + 'px';
});

function animateTrail() {
  tx += (mx - tx) * 0.12;
  ty += (my - ty) * 0.12;
  trail.style.left = tx + 'px';
  trail.style.top  = ty + 'px';
  requestAnimationFrame(animateTrail);
}
animateTrail();


// ── 3D STARFIELD ────────────────────────────────
const canvas = document.getElementById('starfield');
const ctx    = canvas.getContext('2d');
let W, H, mouseX = 0, mouseY = 0;
const stars  = [];

function resizeCanvas() {
  W = canvas.width  = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

document.addEventListener('mousemove', e => {
  mouseX = (e.clientX / W - 0.5) * 2;
  mouseY = (e.clientY / H - 0.5) * 2;
});

// Populate stars
for (let i = 0; i < 280; i++) {
  stars.push({
    x:       Math.random() * 2000 - 1000,
    y:       Math.random() * 2000 - 1000,
    z:       Math.random() * 1000,
    size:    Math.random() * 2 + 0.3,
    color:   Math.random() > 0.85
               ? `hsl(${330 + Math.random() * 30}, 80%, 80%)`
               : `hsl(${40  + Math.random() * 20}, 60%, 90%)`,
    speed:   Math.random() * 0.4 + 0.1,
    twinkle: Math.random() * Math.PI * 2
  });
}

function drawStars() {
  ctx.clearRect(0, 0, W, H);

  // Deep-space vignette
  const grd = ctx.createRadialGradient(W/2, H/2, 0, W/2, H/2, Math.max(W, H));
  grd.addColorStop(0, 'rgba(26,8,16,0)');
  grd.addColorStop(1, 'rgba(13,6,8,0.8)');
  ctx.fillStyle = grd;
  ctx.fillRect(0, 0, W, H);

  stars.forEach(s => {
    s.z -= s.speed;
    if (s.z <= 0) s.z = 1000;
    s.twinkle += 0.02;

    const px    = (s.x + mouseX * 40) / s.z * W/2 + W/2;
    const py    = (s.y + mouseY * 40) / s.z * H/2 + H/2;
    const r     = (1 - s.z / 1000) * s.size * 2.5;
    const alpha = (1 - s.z / 1000) * (0.7 + 0.3 * Math.sin(s.twinkle));

    if (px < 0 || px > W || py < 0 || py > H) return;

    // Glow halo
    const glow = ctx.createRadialGradient(px, py, 0, px, py, r * 3);
    glow.addColorStop(0, s.color.replace(')', `, ${alpha})`).replace('hsl', 'hsla'));
    glow.addColorStop(1, 'transparent');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(px, py, r * 3, 0, Math.PI * 2);
    ctx.fill();

    // Core dot
    ctx.fillStyle  = s.color;
    ctx.globalAlpha = alpha;
    ctx.beginPath();
    ctx.arc(px, py, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  });

  requestAnimationFrame(drawStars);
}
drawStars();


// ── FALLING PETALS & HEARTS ─────────────────────
const scene       = document.getElementById('scene');
const petalColors = ['#f9c8d4','#e8a0b0','#d4607a','#fde8f0','#c8536a'];
const heartEmojis = ['♥','❤','💕'];

function createPetal() {
  const el = document.createElement('div');
  el.className = 'petal';
  el.style.left            = `${Math.random() * 110 - 5}%`;
  el.style.top             = '-30px';
  el.style.background      = `radial-gradient(ellipse at 30% 30%, ${petalColors[Math.floor(Math.random()*3)]}, ${petalColors[Math.floor(Math.random()*petalColors.length)]})`;
  el.style.animationDuration = `${Math.random() * 8 + 6}s`;
  el.style.animationDelay    = `${Math.random() * 4}s`;
  el.style.transform         = `rotate(${Math.random() * 360}deg)`;
  el.style.width             = `${Math.random() * 8 + 8}px`;
  el.style.height            = `${Math.random() * 10 + 12}px`;
  scene.appendChild(el);
  setTimeout(() => el.remove(), 16000);
}

function createHeart() {
  const el = document.createElement('div');
  el.className = 'heart-float';
  el.textContent             = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
  el.style.left              = `${Math.random() * 100}%`;
  el.style.bottom            = '-20px';
  el.style.fontSize          = `${Math.random() * 10 + 10}px`;
  el.style.animationDuration = `${Math.random() * 6 + 8}s`;
  el.style.animationDelay    = '0s';
  scene.appendChild(el);
  setTimeout(() => el.remove(), 15000);
}

setInterval(createPetal, 600);
setInterval(createHeart, 2000);


// ── SCROLL REVEAL ───────────────────────────────
const reveals = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.15 });
reveals.forEach(r => revealObserver.observe(r));


// ── PROGRESS BAR ────────────────────────────────
const prog = document.getElementById('progress');
window.addEventListener('scroll', () => {
  const pct = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
  prog.style.width = pct + '%';
  updateNavDots();
});


// ── NAV DOTS ────────────────────────────────────
const sections = document.querySelectorAll('.section-target');
const dots     = document.querySelectorAll('.nav-dot');

function scrollToSection(i) {
  sections[i]?.scrollIntoView({ behavior: 'smooth' });
}

function updateNavDots() {
  const scrollMid = window.scrollY + window.innerHeight / 2;
  sections.forEach((s, i) => {
    const top = s.offsetTop;
    const bot = top + s.offsetHeight;
    dots[i]?.classList.toggle('active', scrollMid >= top && scrollMid < bot);
  });
}


// ── POEM TEXT DATA ──────────────────────────────
const poems = [

  /* Poem I — The First Time I Saw You */
  `The first time I saw you, the whole world held its breath — as if the stars leaned in closer, and the moon forgot to set.

Your eyes were quiet oceans where I wanted to drown slowly, your laugh a song the birds had only dreamed of singing.

I did not choose to love you, the way the river does not choose the sea — I simply flowed toward you, knowing nowhere else to be.

And in that single glorious moment, before you'd even said my name, I knew that everything before you was only waiting for you to come.`,

  /* Poem II — In the Quiet Hours */
  `In the quiet hours before dawn, when the city finally sleeps, I think of the way you say my name — soft and sure, like you mean it.

I think of your hands, warm and certain, and how the world shrinks to something small and safe whenever you are near.

You are the kind of beautiful that doesn't need the light — you carry your own glow, a lantern in my longest night.

I never knew that silence could be so full of someone, until I found myself in every quiet thinking only of you.`,

  /* Poem III — Mercy */
  `Your name is a poem I repeat to myself the way a prayer is repeated — not out of habit, but out of need.

Mercy. Mercy. Mercy. Three syllables that hold every beautiful thing I've ever known.

You are the grace I didn't earn, the gift I didn't know to ask for, the answer to a question I had carried all my life.

In a world that is often unkind, you are the soft place I land — the mercy shown to a wandering heart by the most extraordinary hands.

You are my Mercy, and I am endlessly, hopelessly, gloriously yours.`,

  /* Poem IV — A Thousand Little Things */
  `I love you in a thousand little things — the way you tilt your head when you are thinking, the sound your laughter makes when it catches you by surprise.

I love you in the small hours, in the ordinary days, in the grocery-store moments and the storms we've weathered side by side.

Love is not always fireworks — sometimes it is steady candlelight, burning warm and sure and faithful through the ordinary dark.

You are my steady candlelight, Mercy. My everyday miracle. The reason ordinary days feel like extraordinary gifts.

I would choose you — a thousand times, in a thousand lifetimes — always, always you.`,

  /* Poem V — What I Want You to Know */
  `I want you to know that you are enough — more than enough, a whole universe of enough.

I want you to know that on your hardest days, when you cannot see your own light, I will hold it for you.

I want you to know that loving you is the easiest thing I have ever done — and the most important.

That I wake up grateful. That you have made me better. That the world is more beautiful simply because you are in it.

And I want you to know this is not just a poem — this is every truth I carry, written down so you can keep it.

You are loved, Mercy. Completely. Without condition. Forever.`
];


// ── VOICE OVER ──────────────────────────────────
let currentUtterance = null;
let currentBtn       = null;

function speakPoem(index, btn) {
  // If something is already playing, stop it first
  if (currentUtterance) {
    speechSynthesis.cancel();
    if (currentBtn) {
      currentBtn.classList.remove('playing');
      currentBtn.querySelector('.btn-text').textContent = 'Hear this poem';
    }
    // If user tapped the same button → just toggle off
    if (currentBtn === btn) {
      currentBtn = null;
      currentUtterance = null;
      return;
    }
  }

  const utterance = new SpeechSynthesisUtterance(poems[index]);

  // Pick the most romantic voice available
  const voices = speechSynthesis.getVoices();
  const preferred = voices.find(v =>
    v.name.includes('Samantha')            ||
    v.name.includes('Karen')               ||
    v.name.includes('Moira')               ||
    v.name.includes('Tessa')               ||
    v.name.includes('Google UK English Female') ||
    v.name.includes('Microsoft Aria')      ||
    (v.lang === 'en-GB' && v.name.toLowerCase().includes('female'))
  ) || voices.find(v => v.lang.startsWith('en') && !v.name.includes('Male'))
    || voices[0];

  if (preferred) utterance.voice = preferred;
  utterance.rate   = 0.82;   // slow and tender
  utterance.pitch  = 1.05;
  utterance.volume = 1;

  currentUtterance = utterance;
  currentBtn       = btn;

  btn.classList.add('playing');
  btn.querySelector('.btn-text').textContent = 'Tap to pause';

  utterance.onend = () => {
    btn.classList.remove('playing');
    btn.querySelector('.btn-text').textContent = 'Hear this poem';
    currentBtn       = null;
    currentUtterance = null;
  };

  utterance.onerror = () => {
    btn.classList.remove('playing');
    btn.querySelector('.btn-text').textContent = 'Hear this poem';
  };

  speechSynthesis.speak(utterance);
}

// Warm up the voice list (some browsers load async)
if (typeof speechSynthesis !== 'undefined' && speechSynthesis.onvoiceschanged !== undefined) {
  speechSynthesis.onvoiceschanged = () => speechSynthesis.getVoices();
}


// ── 3D CARD TILT ON HOVER ───────────────────────
document.querySelectorAll('.poem-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width  - 0.5;
    const y = (e.clientY - rect.top)  / rect.height - 0.5;
    card.style.transform = `perspective(1000px) rotateY(${x * 10}deg) rotateX(${-y * 6}deg) scale(1.02)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});
