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
    document.documentElement.classList.add('digital-reveal-ready');
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('in'); observer.unobserve(entry.target); }
    }), { threshold: 0.08 });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  }
})();

/* Motion layer: scroll reveals, reading progress and header depth.
   Progressive enhancement. It does nothing for visitors who prefer reduced motion,
   and only content below the first screen is ever hidden, so nothing flashes on load. */
(() => {
  'use strict';
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const root = document.documentElement;
  const header = document.querySelector('.site-header');
  const bar = document.createElement('div');
  bar.className = 'm-progress';
  bar.setAttribute('aria-hidden', 'true');
  document.body.appendChild(bar);
  let queued = false;
  const frame = () => {
    queued = false;
    const y = window.scrollY, max = root.scrollHeight - window.innerHeight;
    bar.style.transform = 'scaleX(' + (max > 0 ? Math.min(1, y / max) : 0) + ')';
    if (header) header.classList.toggle('is-stuck', y > 6);
  };
  addEventListener('scroll', () => { if (!queued) { queued = true; requestAnimationFrame(frame); } }, { passive: true });
  addEventListener('resize', frame);
  frame();
  if (!('IntersectionObserver' in window)) return;

  const selectors = [
    '.bh-section-heading', '.bh-work-intro', '.bh-work-card', '.bh-service', '.bh-steps > *',
    '.bh-contact-links', '.bh-location', '.bh-contained',
    '.section-heading', '.split > *', '.copy-block', '.form-panel', '.planner-summary',
    '.client-project-heading', '.client-project-gallery > *', '.client-project-subsection-heading',
    '.service-card', '.services-section-head', '.services-transition', '.services-next-step',
    '.timeline > article', '.faq-list > details'
  ];
  const excluded = '.testimonials,[data-reveal],.marquee,.brand-marquee,.brand-strip,.prepared-brief,[hidden]';
  const all = [...new Set(document.querySelectorAll(selectors.join(',')))].filter(el => !el.closest(excluded));
  const below = window.innerHeight * 0.92;
  const targets = all.filter(el => !all.some(o => o !== el && o.contains(el)) && el.getBoundingClientRect().top > below);
  if (!targets.length) return;
  root.classList.add('motion');

  const finish = el => { el.removeAttribute('data-m'); el.classList.remove('m-in'); el.style.removeProperty('--md'); };
  const reveal = (el, i) => {
    const delay = Math.min(i, 5) * 80;
    el.style.setProperty('--md', delay + 'ms');
    el.classList.add('m-in');
    setTimeout(() => finish(el), 950 + delay);
  };
  const io = new IntersectionObserver(entries => {
    let i = 0;
    entries.forEach(e => { if (e.isIntersecting) { io.unobserve(e.target); reveal(e.target, i++); } });
  }, { threshold: 0.1, rootMargin: '0px 0px -6% 0px' });
  targets.forEach(el => { el.setAttribute('data-m', ''); io.observe(el); });
  // Keyboard users who tab into something not yet revealed should see it at once.
  addEventListener('focusin', e => {
    const el = e.target.closest && e.target.closest('[data-m]');
    if (el && !el.classList.contains('m-in')) { io.unobserve(el); reveal(el, 0); }
  });
})();
