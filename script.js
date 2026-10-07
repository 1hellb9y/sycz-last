'use strict';

// No third-party analytics are loaded by default. If enabling Meta Pixel or GA4,
// implement a compliant consent flow and review financial-ad policy first.
const header = document.querySelector('#header');
const progressBar = document.querySelector('.scroll-progress');
const navButton = document.querySelector('.menu-toggle');
const mobileNav = document.querySelector('#mobile-nav');

function closeNav() {
  navButton.setAttribute('aria-expanded', 'false');
  navButton.setAttribute('aria-label', 'Open navigation');
  mobileNav.hidden = true;
  document.body.classList.remove('menu-open');
}

navButton.addEventListener('click', () => {
  const opening = navButton.getAttribute('aria-expanded') !== 'true';
  navButton.setAttribute('aria-expanded', String(opening));
  navButton.setAttribute('aria-label', opening ? 'Close navigation' : 'Open navigation');
  mobileNav.hidden = !opening;
  document.body.classList.toggle('menu-open', opening);
});
mobileNav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeNav));
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeNav(); });
window.addEventListener('resize', () => { if (innerWidth > 760) closeNav(); });

let scrollScheduled = false;
window.addEventListener('scroll', () => {
  if (scrollScheduled) return;
  scrollScheduled = true;
  requestAnimationFrame(() => {
    header.classList.toggle('scrolled', window.scrollY > 15);
    const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    progressBar.style.width = `${Math.min(100, Math.max(0, window.scrollY / maxScroll * 100))}%`;
    scrollScheduled = false;
  });
}, { passive: true });

const revealElements = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px 45px 0px' });
  revealElements.forEach(el => observer.observe(el));
} else {
  revealElements.forEach(el => el.classList.add('visible'));
}

// Optional hook for a future consent-approved analytics implementation.
// Outbound clicks are NOT purchase confirmations.
document.querySelectorAll('.outbound').forEach(link => {
  link.addEventListener('click', () => {
    const product = link.dataset.product || 'unknown';
    document.dispatchEvent(new CustomEvent('sycz:outbound', { detail: { product } }));
  });
});

document.getElementById('year').textContent = new Date().getFullYear();
