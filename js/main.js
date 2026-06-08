/* Westover Offices — main.js */

// ── Navbar scroll effect ──
const navbar = document.getElementById('navbar');
const onScroll = () => {
  navbar.classList.toggle('scrolled', window.scrollY > 70);
};
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// ── Mobile nav toggle ──
const toggle   = document.getElementById('navToggle');
const menu     = document.getElementById('navMenu');
const backdrop = document.createElement('div');
backdrop.className = 'nav-backdrop';
document.body.appendChild(backdrop);

const closeNav = () => {
  menu.classList.remove('open');
  toggle.classList.remove('open');
  backdrop.classList.remove('open');
  document.body.style.overflow = '';
};

if (toggle && menu) {
  toggle.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('open');
    toggle.classList.toggle('open', isOpen);
    backdrop.classList.toggle('open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });
  backdrop.addEventListener('click', closeNav);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeNav();
  });
}

// ── Smooth scroll for anchor links ──
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    const id = a.getAttribute('href');
    const target = document.querySelector(id);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      closeNav();
    }
  });
});

// ── Lightbox ──
const galImgs = document.querySelectorAll('.gal-img');
if (galImgs.length) {
  const lb = document.createElement('div');
  lb.className = 'lightbox';
  lb.innerHTML = `
    <button class="lb-close" aria-label="Close">&times;</button>
    <button class="lb-prev" aria-label="Previous image">&#8249;</button>
    <button class="lb-next" aria-label="Next image">&#8250;</button>
    <img src="" alt="">
  `;
  document.body.appendChild(lb);

  const lbImg   = lb.querySelector('img');
  const lbClose = lb.querySelector('.lb-close');
  const lbPrev  = lb.querySelector('.lb-prev');
  const lbNext  = lb.querySelector('.lb-next');
  const imgs    = Array.from(galImgs);
  let current   = 0;

  const showImg = (index) => {
    current = (index + imgs.length) % imgs.length;
    const img = imgs[current].querySelector('img');
    lbImg.src = img.src;
    lbImg.alt = img.alt || '';
  };
  const openLb = (index) => {
    showImg(index);
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
  };
  const closeLb = () => {
    lb.classList.remove('open');
    document.body.style.overflow = '';
    setTimeout(() => { lbImg.src = ''; }, 300);
  };

  imgs.forEach((item, i) => item.addEventListener('click', () => openLb(i)));
  lbClose.addEventListener('click', closeLb);
  lbPrev.addEventListener('click', (e) => { e.stopPropagation(); showImg(current - 1); });
  lbNext.addEventListener('click', (e) => { e.stopPropagation(); showImg(current + 1); });
  lb.addEventListener('click', (e) => { if (e.target === lb || e.target === lbImg) closeLb(); });
  document.addEventListener('keydown', (e) => {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape')     closeLb();
    if (e.key === 'ArrowLeft')  showImg(current - 1);
    if (e.key === 'ArrowRight') showImg(current + 1);
  });
}

// ── Contact form ──
const form = document.getElementById('contactForm');
if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const orig = btn.textContent;
    btn.textContent = 'Sending…';
    btn.disabled = true;
    try {
      const res = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      });
      if (res.ok) {
        btn.textContent = 'Message Sent — We\'ll Be in Touch!';
        btn.style.background = '#4a7c59';
        btn.style.borderColor = '#4a7c59';
        form.reset();
        setTimeout(() => {
          btn.textContent = orig;
          btn.style.background = '';
          btn.style.borderColor = '';
          btn.disabled = false;
        }, 5000);
      } else {
        btn.textContent = 'Something went wrong — please call us directly.';
        btn.style.background = '#c0392b';
        btn.style.borderColor = '#c0392b';
        setTimeout(() => {
          btn.textContent = orig;
          btn.style.background = '';
          btn.style.borderColor = '';
          btn.disabled = false;
        }, 5000);
      }
    } catch {
      btn.textContent = 'Something went wrong — please call us directly.';
      btn.style.background = '#c0392b';
      btn.style.borderColor = '#c0392b';
      setTimeout(() => {
        btn.textContent = orig;
        btn.style.background = '';
        btn.style.borderColor = '';
        btn.disabled = false;
      }, 5000);
    }
  });
}

// ── Mobile stats auto-scroll ──
if (window.matchMedia('(max-width: 768px)').matches) {
  const statsGrid = document.querySelector('.stats-grid');
  if (statsGrid) {
    const SPEED = 38; // px per second
    let isPaused = false;
    let lastTime = null;

    const tick = (timestamp) => {
      if (!isPaused) {
        if (lastTime !== null) {
          const px = SPEED * (timestamp - lastTime) / 1000;
          if (statsGrid.scrollLeft + statsGrid.clientWidth >= statsGrid.scrollWidth - 2) {
            statsGrid.scrollTo({ left: 0, behavior: 'smooth' });
            isPaused = true;
            setTimeout(() => { isPaused = false; lastTime = null; }, 1800);
          } else {
            statsGrid.scrollLeft += px;
          }
        }
        lastTime = timestamp;
      }
      requestAnimationFrame(tick);
    };

    statsGrid.addEventListener('touchstart', () => { isPaused = true; lastTime = null; }, { passive: true });
    statsGrid.addEventListener('touchend',   () => { setTimeout(() => { isPaused = false; }, 3000); }, { passive: true });

    requestAnimationFrame(tick);
  }
}

// ── Scroll fade-in ──
const fadeItems = document.querySelectorAll('.fade-up, .bldg-card, .loc-card, .stat');
if (fadeItems.length) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 80);
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  fadeItems.forEach(el => {
    if (!el.classList.contains('fade-up')) {
      el.classList.add('fade-up');
    }
    io.observe(el);
  });
}
