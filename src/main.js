/* ── Theme Toggle ──────────────────────────────────────── */
const html          = document.documentElement;
const themeToggle   = document.getElementById('themeToggle');

themeToggle.addEventListener('click', () => {
  html.classList.toggle('dark-theme');
});

/* ── Mobile Nav ────────────────────────────────────────── */
const hamburger = document.getElementById('navHamburger');
const navLinks  = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

/* ── Navbar Scroll Effect ──────────────────────────────── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

/* ── Three.js Particle Background ─────────────────────── */
(function () {
  if (typeof THREE === 'undefined') return;
  if (window.innerWidth < 900) return;

  const canvas   = document.getElementById('bg-canvas');
  const scene    = new THREE.Scene();
  const w        = window.innerWidth;
  const h        = window.innerHeight;

  const camera = new THREE.OrthographicCamera(-w/2, w/2, h/2, -h/2, 1, 100);
  camera.position.z = 10;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setSize(w, h);
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.setClearColor(0, 0);

  const COUNT       = 110;
  const THRESHOLD   = Math.min(w, h) * 0.18;
  const pts         = [];
  const vel         = [];
  const pPositions  = new Float32Array(COUNT * 3);

  for (let i = 0; i < COUNT; i++) {
    const x = (Math.random() - 0.5) * w;
    const y = (Math.random() - 0.5) * h;
    pts.push({ x, y });
    vel.push({ x: (Math.random() - 0.5) * 0.35, y: (Math.random() - 0.5) * 0.35 });
    pPositions[i * 3]     = x;
    pPositions[i * 3 + 1] = y;
    pPositions[i * 3 + 2] = 0;
  }

  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute('position', new THREE.BufferAttribute(pPositions, 3));
  const pMat = new THREE.PointsMaterial({ color: 0x007acc, size: 2.5, transparent: true, opacity: 0.45 });
  scene.add(new THREE.Points(pGeo, pMat));

  const MAX_LINES   = 500;
  const linePos     = new Float32Array(MAX_LINES * 6);
  const lGeo        = new THREE.BufferGeometry();
  lGeo.setAttribute('position', new THREE.BufferAttribute(linePos, 3));
  lGeo.setDrawRange(0, 0);
  const lMat = new THREE.LineBasicMaterial({ color: 0x007acc, transparent: true, opacity: 0.08 });
  const linesMesh = new THREE.LineSegments(lGeo, lMat);
  scene.add(linesMesh);

  function tick() {
    requestAnimationFrame(tick);

    const hw = window.innerWidth  / 2;
    const hh = window.innerHeight / 2;

    for (let i = 0; i < COUNT; i++) {
      pts[i].x += vel[i].x;
      pts[i].y += vel[i].y;
      if (pts[i].x >  hw) pts[i].x = -hw;
      if (pts[i].x < -hw) pts[i].x =  hw;
      if (pts[i].y >  hh) pts[i].y = -hh;
      if (pts[i].y < -hh) pts[i].y =  hh;
      pPositions[i * 3]     = pts[i].x;
      pPositions[i * 3 + 1] = pts[i].y;
    }
    pGeo.attributes.position.needsUpdate = true;

    let li = 0;
    const t2 = THRESHOLD * THRESHOLD;
    for (let i = 0; i < COUNT && li < MAX_LINES; i++) {
      for (let j = i + 1; j < COUNT && li < MAX_LINES; j++) {
        const dx = pts[i].x - pts[j].x;
        const dy = pts[i].y - pts[j].y;
        if (dx * dx + dy * dy < t2) {
          linePos[li * 6]     = pts[i].x; linePos[li * 6 + 1] = pts[i].y; linePos[li * 6 + 2] = 0;
          linePos[li * 6 + 3] = pts[j].x; linePos[li * 6 + 4] = pts[j].y; linePos[li * 6 + 5] = 0;
          li++;
        }
      }
    }
    lGeo.setDrawRange(0, li * 2);
    lGeo.attributes.position.needsUpdate = true;

    renderer.render(scene, camera);
  }
  tick();

  window.addEventListener('resize', () => {
    const nw = window.innerWidth, nh = window.innerHeight;
    camera.left = -nw/2; camera.right = nw/2;
    camera.top = nh/2;   camera.bottom = -nh/2;
    camera.updateProjectionMatrix();
    renderer.setSize(nw, nh);
  });
})();

/* ── GSAP Scroll Reveals ───────────────────────────────── */
if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);

  /* Hero entrance — staggered timeline */
  gsap.timeline({ defaults: { ease: 'power2.out' } })
    .from('.hero-eyebrow',  { opacity: 0, y: 16, duration: 0.6 }, 0.15)
    .from('.hero-title',    { opacity: 0, y: 28, duration: 0.8 }, 0.35)
    .from('.hero-tagline',  { opacity: 0, y: 20, duration: 0.6 }, 0.6)
    .from('.hero-stats',    { opacity: 0, y: 18, duration: 0.6 }, 0.8)
    .from('.hero-actions',  { opacity: 0, y: 18, duration: 0.6 }, 0.95)
    .from('.hero-visual',   { opacity: 0, x: 30, duration: 0.8 }, 0.5);

  /* Story board — paired chip hover */
  const frictionChips = [...document.querySelectorAll('.thought.friction')];
  const sparkChips    = [...document.querySelectorAll('.thought.spark')];

  function bindPair(a, b) {
    a.addEventListener('mouseenter', () => b.classList.add('paired'));
    a.addEventListener('mouseleave', () => b.classList.remove('paired'));
  }
  frictionChips.forEach((chip, i) => { if (sparkChips[i]) bindPair(chip, sparkChips[i]); });
  sparkChips.forEach((chip, i)    => { if (frictionChips[i]) bindPair(chip, frictionChips[i]); });

  /* All .reveal elements outside hero */
  document.querySelectorAll('.reveal').forEach(el => {
    gsap.fromTo(el,
      { opacity: 0, y: 20 },
      {
        opacity: 1, y: 0,
        duration: 0.6,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: el,
          start: 'bottom 95%',
          toggleActions: 'play none none reverse'
        }
      }
    );
  });
}
