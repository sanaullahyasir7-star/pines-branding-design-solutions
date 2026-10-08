(() => {
  'use strict';
  document.documentElement.classList.add('js');
  const menu = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.navlinks');
  if (menu && nav) {
    const close = (restore = false) => {
      const wasOpen = nav.classList.contains('open');
      nav.classList.remove('open');
      menu.setAttribute('aria-expanded', 'false');
      menu.setAttribute('aria-label', 'Open navigation');
      menu.textContent = 'Menu';
      if (restore && wasOpen) menu.focus();
    };
    menu.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      menu.setAttribute('aria-expanded', String(open));
      menu.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
      menu.textContent = open ? 'Close' : 'Menu';
    });
    nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => close()));
    document.addEventListener('keydown', e => { if (e.key === 'Escape') close(true); });
    document.addEventListener('click', e => { if (!e.target.closest('.site-header')) close(); });
  }
  const pause = document.querySelector('.marquee-pause');
  pause?.addEventListener('click', () => {
    const paused = pause.getAttribute('aria-pressed') !== 'true';
    pause.setAttribute('aria-pressed', String(paused));
    pause.setAttribute('aria-label', paused ? 'Resume moving service text' : 'Pause moving service text');
    pause.textContent = paused ? 'Resume motion' : 'Pause motion';
    document.querySelector('.marquee-track').style.animationPlayState = paused ? 'paused' : 'running';
  });
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  if ('IntersectionObserver' in window && !reduced.matches) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('in'); observer.unobserve(entry.target); }
    }), { threshold: 0.08 });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  }
})();
