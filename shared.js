// ============================================================
// SHARED SCRIPT — multigate (index + all use-case pages)
// ============================================================

// ---------- hide floating nav on scroll-down, reveal on scroll-up ----------
// Prevents the fixed pill nav from parking on top of headline text as the
// user scrolls through sections further down the page (e.g. the power
// banner on index, or hero copy on inner pages).
(function () {
  const header = document.querySelector('header.nav');
  if (!header) return;
  let lastY = window.scrollY;
  let ticking = false;
  const REVEAL_ZONE = 80; // always show nav near the very top of the page

  function onScroll() {
    const y = window.scrollY;
    if (y <= REVEAL_ZONE) {
      header.classList.remove('nav-hidden');
    } else if (y > lastY) {
      // scrolling down
      header.classList.add('nav-hidden');
      document.querySelectorAll('.has-dropdown').forEach(i => i.classList.remove('open'));
    } else if (y < lastY) {
      // scrolling up
      header.classList.remove('nav-hidden');
    }
    lastY = y;
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(onScroll);
      ticking = true;
    }
  }, { passive: true });
})();

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
  const cbfiWrap = document.querySelector('.cbfi-feat-wrap');
  const cbfiCards = cbfiTrack.querySelectorAll('.cbfi-feat-card');
  const cbfiGap = 24;
  let cbfiScroll = 0;

  function cbfiVisibleCount() {
    const cardW = cbfiCards[0].offsetWidth + cbfiGap;
    return Math.max(1, Math.round((cbfiWrap.offsetWidth + cbfiGap) / cardW));
  }
  function cbfiStep() {
    return (cbfiCards[0].offsetWidth + cbfiGap) * cbfiVisibleCount();
  }
  function cbfiMaxScroll() {
    let total = 0;
    cbfiCards.forEach(c => total += c.offsetWidth);
    total += cbfiGap * (cbfiCards.length - 1);
    return Math.max(0, total - cbfiWrap.offsetWidth);
  }
  function moveCbfi() {
    cbfiScroll = Math.min(cbfiScroll, cbfiMaxScroll());
    cbfiTrack.style.transform = `translateX(-${cbfiScroll}px)`;
  }
  document.getElementById('cbfiNext')?.addEventListener('click', () => {
    cbfiScroll = Math.min(cbfiScroll + cbfiStep(), cbfiMaxScroll());
    moveCbfi();
  });
  document.getElementById('cbfiPrev')?.addEventListener('click', () => {
    cbfiScroll = Math.max(cbfiScroll - cbfiStep(), 0);
    moveCbfi();
  });
  window.addEventListener('resize', moveCbfi);
  moveCbfi();
}

// ---------- values carousel (about page) ----------
const valuesTrack = document.querySelector('.values-track');
if (valuesTrack) {
  const valueCards = valuesTrack.querySelectorAll('.value-card');
  const valuesNav = document.querySelector('.values-nav');
  const gap = 32;
  let valIdx = 0;

  function getVisible(){
    return window.innerWidth > 1024 ? 3 : window.innerWidth > 640 ? 2 : 1;
  }

  function buildDots(maxIdx){
    valuesNav.innerHTML = '';
    for (let i = 0; i <= maxIdx; i++){
      const b = document.createElement('button');
      if (i === valIdx) b.classList.add('active');
      b.addEventListener('click', () => { valIdx = i; moveValues(); });
      valuesNav.appendChild(b);
    }
  }

  function moveValues(rebuildDots){
    const card = valueCards[0];
    const cardW = card.offsetWidth + gap;
    const visible = getVisible();
    const maxIdx = Math.max(0, valueCards.length - visible);
    valIdx = Math.min(valIdx, maxIdx);
    valuesTrack.style.transform = `translateX(-${valIdx * cardW}px)`;
    if (rebuildDots) buildDots(maxIdx);
    valuesNav.querySelectorAll('button').forEach((d,i) => d.classList.toggle('active', i === valIdx));
  }

  window.addEventListener('resize', () => moveValues(true));
  moveValues(true);
}

// ---------- request-a-demo off-canvas drawer ----------
(function () {
  const overlay = document.getElementById('rdmOverlay');
  const drawer  = document.getElementById('rdmDrawer');
  const closeBtn = document.getElementById('rdmClose');
  const openTriggers = document.querySelectorAll('.js-open-demo');
  const form = document.getElementById('rdmForm');
  if (!overlay || !drawer) return;

  let lastFocused = null;

  function openDrawer(e) {
    if (e) e.preventDefault();
    lastFocused = document.activeElement;
    overlay.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    const firstField = document.getElementById('rdmEmail');
    if (firstField) setTimeout(() => firstField.focus(), 300);
  }

  function closeDrawer() {
    overlay.classList.remove('is-open');
    document.body.style.overflow = '';
    if (lastFocused) lastFocused.focus();
  }

  openTriggers.forEach(el => el.addEventListener('click', openDrawer));
  closeBtn?.addEventListener('click', closeDrawer);

  // click on backdrop (outside the drawer panel) closes it
  overlay.addEventListener('click', e => {
    if (e.target === overlay) closeDrawer();
  });

  // esc key closes it
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && overlay.classList.contains('is-open')) closeDrawer();
  });

  form?.addEventListener('submit', e => {
    e.preventDefault();
    // placeholder submit handling — wire up to real endpoint later
    closeDrawer();
  });
})();
