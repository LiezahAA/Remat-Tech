// ============================================================
// SHARED SCRIPT — multigate (index + all use-case pages)
// ============================================================

// ---------- mobile nav toggle ----------
const navToggle = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');
if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navLinks.classList.toggle('open');
  });
  // close mobile nav on plain link click (non-parent)
  navLinks.querySelectorAll('a:not(.nav-parent)').forEach(a => a.addEventListener('click', () => {
    navToggle.classList.remove('active');
    navLinks.classList.remove('open');
  }));
}

// ---------- dropdown menus ----------
document.querySelectorAll('.has-dropdown').forEach(item => {
  const parent = item.querySelector('.nav-parent');
  if (!parent) return;
  parent.addEventListener('click', e => {
    if (window.innerWidth > 880) return; // hover handles desktop
    e.preventDefault();
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.has-dropdown').forEach(i => i.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  });
});
document.addEventListener('click', e => {
  if (!e.target.closest('.has-dropdown')) {
    document.querySelectorAll('.has-dropdown').forEach(i => i.classList.remove('open'));
  }
});

// ---------- faq accordion (index page) ----------
document.querySelectorAll('.faq-item').forEach(item => {
  item.addEventListener('click', () => {
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  });
});

// ---------- news carousel (index page) ----------
const newsCards = document.querySelectorAll('.news-card');
if (newsCards.length) {
  let newsIndex = 0;
  function focusNews(i){
    newsCards.forEach((c,idx) => c.style.opacity = idx === i ? '1' : '0.55');
  }
  document.getElementById('newsNext')?.addEventListener('click', () => {
    newsIndex = (newsIndex + 1) % newsCards.length;
    focusNews(newsIndex);
  });
  document.getElementById('newsPrev')?.addEventListener('click', () => {
    newsIndex = (newsIndex - 1 + newsCards.length) % newsCards.length;
    focusNews(newsIndex);
  });
}

// ---------- stat counters (index page) ----------
function animateCounter(el) {
  const target   = parseFloat(el.dataset.target);
  const decimals = parseInt(el.dataset.decimals) || 0;
  const duration = 1800;
  const start    = performance.now();
  function step(now) {
    const elapsed  = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased    = 1 - Math.pow(1 - progress, 3);
    el.textContent = (eased * target).toFixed(decimals);
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}
const statSection = document.querySelector('.stats');
if (statSection) {
  const statObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.counter').forEach(animateCounter);
        statObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });
  statObserver.observe(statSection);
}

// ---------- value-we-deliver dot nav (smes page) ----------
const vdCards = document.querySelectorAll('.vd-card');
const vdDots  = document.querySelectorAll('.track-nav button');
if (vdCards.length && vdDots.length) {
  let vdIndex = 1;
  function setVdActive(i){
    vdCards.forEach((c, idx) => c.style.opacity = idx === i ? '1' : '0.55');
    vdDots.forEach((d, idx) => d.classList.toggle('active', idx === (i % vdDots.length)));
  }
  document.getElementById('vdNext')?.addEventListener('click', () => {
    vdIndex = (vdIndex + 1) % vdCards.length;
    setVdActive(vdIndex);
  });
  document.getElementById('vdPrev')?.addEventListener('click', () => {
    vdIndex = (vdIndex - 1 + vdCards.length) % vdCards.length;
    setVdActive(vdIndex);
  });
}

// ---------- features carousel (treasury page) ----------
const featTrack = document.querySelector('.feat-track');
if (featTrack) {
  const featCards = document.querySelectorAll('.feat-card');
  let featIndex = 0;
  function updateFeatVisibility(){
    const visibleCount = window.innerWidth <= 880 ? 1 : 3;
    featCards.forEach((card, idx) => {
      card.style.display = (idx >= featIndex && idx < featIndex + visibleCount) ? 'flex' : 'none';
    });
  }
  document.getElementById('featNext')?.addEventListener('click', () => {
    const visibleCount = window.innerWidth <= 880 ? 1 : 3;
    featIndex = Math.min(featIndex + 1, featCards.length - visibleCount);
    updateFeatVisibility();
  });
  document.getElementById('featPrev')?.addEventListener('click', () => {
    featIndex = Math.max(featIndex - 1, 0);
    updateFeatVisibility();
  });
  window.addEventListener('resize', updateFeatVisibility);
  updateFeatVisibility();
}

// ---------- back to top (smes + future pages) ----------
document.getElementById('backToTop')?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ---------- scroll reveal (all pages) ----------
const revealEls = document.querySelectorAll('.reveal, .ldr-reveal');
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting){
      entry.target.classList.add('in');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
revealEls.forEach(el => revealObserver.observe(el));

// ---------- features carousel (treasury page) ----------
const featCards = document.querySelectorAll('.feat-card');
if (featCards.length) {
  let featIndex = 0;
  function updateFeatVisibility(){
    const visibleCount = window.innerWidth <= 880 ? 1 : 3;
    featCards.forEach((card, idx) => {
      card.style.display = (idx >= featIndex && idx < featIndex + visibleCount) ? 'flex' : 'none';
    });
  }
  document.getElementById('featNext')?.addEventListener('click', () => {
    const visibleCount = window.innerWidth <= 880 ? 1 : 3;
    featIndex = Math.min(featIndex + 1, featCards.length - visibleCount);
    updateFeatVisibility();
  });
  document.getElementById('featPrev')?.addEventListener('click', () => {
    featIndex = Math.max(featIndex - 1, 0);
    updateFeatVisibility();
  });
  window.addEventListener('resize', updateFeatVisibility);
  updateFeatVisibility();
}

// ---------- cbfi features carousel (crossborder page) ----------
const cbfiTrack = document.querySelector('.cbfi-feat-track');
if (cbfiTrack) {
  const cbfiCards = cbfiTrack.querySelectorAll('.cbfi-feat-card');
  let cbfiIndex = 0;
  function moveCbfi() {
    const card = cbfiCards[0];
    const gap = 24;
    const cardW = card.offsetWidth + gap;
    cbfiTrack.style.transform = `translateX(-${cbfiIndex * cardW}px)`;
  }
  document.getElementById('cbfiNext')?.addEventListener('click', () => {
    cbfiIndex = Math.min(cbfiIndex + 1, cbfiCards.length - 1);
    moveCbfi();
  });
  document.getElementById('cbfiPrev')?.addEventListener('click', () => {
    cbfiIndex = Math.max(cbfiIndex - 1, 0);
    moveCbfi();
  });
}

// ---------- values carousel (about page) ----------
const valuesTrack = document.querySelector('.values-track');
if (valuesTrack) {
  const valueCards = valuesTrack.querySelectorAll('.value-card');
  const valueDots = document.querySelectorAll('.values-nav button');
  let valIdx = 0;
  function moveValues() {
    const card = valueCards[0];
    const gap = 24;
    const cardW = card.offsetWidth + gap;
    const visible = window.innerWidth > 1024 ? 3 : window.innerWidth > 640 ? 2 : 1;
    const maxIdx = Math.max(0, valueCards.length - visible);
    valIdx = Math.min(valIdx, maxIdx);
    valuesTrack.style.transform = `translateX(-${valIdx * cardW}px)`;
    valueDots.forEach((d,i) => d.classList.toggle('active', i === valIdx));
  }
  valueDots.forEach((dot, i) => {
    dot.addEventListener('click', () => { valIdx = i; moveValues(); });
  });
  window.addEventListener('resize', moveValues);
  moveValues();
}
