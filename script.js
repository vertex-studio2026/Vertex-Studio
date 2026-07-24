/* =====================================================
   Lumen Studio — Interactive behaviors
   ===================================================== */

// Loading screen
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  setTimeout(() => loader.classList.add('hidden'), 400);
});

// Year
document.getElementById('year').textContent = new Date().getFullYear();

// Sticky nav shadow on scroll
const nav = document.getElementById('nav');
const toTop = document.getElementById('toTop');
const onScroll = () => {
  const y = window.scrollY;
  nav.classList.toggle('scrolled', y > 20);
  toTop.classList.toggle('show', y > 500);
};
window.addEventListener('scroll', onScroll, { passive: true });

// Mobile menu
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
hamburger.addEventListener('click', () => {
  const open = mobileMenu.classList.toggle('open');
  hamburger.setAttribute('aria-expanded', open);
  hamburger.querySelector('i').className = open ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
});
mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  mobileMenu.classList.remove('open');
  hamburger.querySelector('i').className = 'fa-solid fa-bars';
}));

// Dark mode
const themeToggle = document.getElementById('themeToggle');
const savedTheme = localStorage.getItem('vertex-theme');
if (savedTheme === 'dark') document.documentElement.setAttribute('data-theme', 'dark');
const syncIcon = () => {
  const dark = document.documentElement.getAttribute('data-theme') === 'dark';
  themeToggle.querySelector('i').className = dark ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
};
syncIcon();
themeToggle.addEventListener('click', () => {
  const dark = document.documentElement.getAttribute('data-theme') === 'dark';
  if (dark) { document.documentElement.removeAttribute('data-theme'); localStorage.setItem('vertex-theme','light'); }
  else { document.documentElement.setAttribute('data-theme','dark'); localStorage.setItem('vertex-theme','dark'); }
  syncIcon();
});

// Reveal on scroll via IntersectionObserver
const io = new IntersectionObserver((entries) => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('in'), i * 60);
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// Animated counters
const counterIO = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = +el.dataset.target;
    const duration = 1600;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.floor(eased * target).toLocaleString();
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    counterIO.unobserve(el);
  });
}, { threshold: 0.4 });
document.querySelectorAll('.counter').forEach(el => counterIO.observe(el));

// Lightbox
const lightbox = document.getElementById('lightbox');
const lbImage = document.getElementById('lbImage');
const lbClose = document.getElementById('lbClose');
document.querySelectorAll('.p-item').forEach(item => {
  item.addEventListener('click', () => {
    lbImage.src = item.dataset.img;
    lbImage.alt = item.querySelector('img').alt;
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden','false');
  });
});
const closeLb = () => { lightbox.classList.remove('open'); lightbox.setAttribute('aria-hidden','true'); lbImage.src=''; };
lbClose.addEventListener('click', closeLb);
lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLb(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLb(); });

// Scroll to top
toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// Contact form
const form = document.getElementById('contactForm');
const formNote = document.getElementById('formNote');
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = form.name.value.trim();
  const email = form.email.value.trim();
  const message = form.message.value.trim();
  if (!name || !email || !message) { formNote.textContent = 'Please fill out all required fields.'; formNote.style.color = '#ef4444'; return; }
  if (!/^\S+@\S+\.\S+$/.test(email)) { formNote.textContent = 'Please enter a valid email address.'; formNote.style.color = '#ef4444'; return; }
  formNote.style.color = '';
  formNote.textContent = 'Thanks! We\'ll get back to you within one business day.';
  form.reset();
});

// Smooth close of open <details> siblings (single-open FAQ)
document.querySelectorAll('.faq details').forEach(d => {
  d.addEventListener('toggle', () => {
    if (d.open) document.querySelectorAll('.faq details').forEach(o => { if (o !== d) o.open = false; });
  });
});
