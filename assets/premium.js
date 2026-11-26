/* Pines premium layer: inertial smooth scrolling (Lenis, MIT) and a "View" cursor on
   project imagery. Desktop pointers only; nothing runs for reduced-motion visitors, and
   touch devices keep their native scrolling. */
(() => {
  'use strict';
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;

  // ---- Smooth scrolling ----
  if (fine && typeof window.Lenis === 'function') {
    const lenis = new window.Lenis({ lerp: 0.085, wheelMultiplier: 0.95, smoothWheel: true });
    window.pinesLenis = lenis;
    const raf = t => { lenis.raf(t); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);

    const headerOffset = () => {
      const h = document.querySelector('.site-header');
      return -((h ? h.offsetHeight : 80) + 16);
    };
    // Same-page anchor links glide instead of jumping.
    document.addEventListener('click', e => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = e.target.closest('a[href*="#"]');
      if (!a) return;
      const url = new URL(a.href, location.href);
      if (url.pathname !== location.pathname || url.search !== location.search || !url.hash) return;
      let target;
      try { target = document.getElementById(decodeURIComponent(url.hash.slice(1))); } catch (_) { return; }
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target, { offset: headerOffset(), duration: 1.4, easing: t => 1 - Math.pow(1 - t, 4) });
      history.pushState(null, '', url.hash);
      // Move focus for keyboard and screen-reader users without a second jump.
      if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    });
    // Elements with their own scrolling keep native behaviour.
    document.querySelectorAll('textarea, select[multiple], .contact-region-links, [data-scroll-native]')
      .forEach(el => el.setAttribute('data-lenis-prevent', ''));
    // Late-loading images change the page height.
    addEventListener('load', () => lenis.resize());
  }

  // ---- "View" cursor on project imagery ----
  if (fine) {
    const targets = '.bh-work-card, .bh-service, .client-project-gallery a, .service-card-image';
    const dot = document.createElement('div');
    dot.className = 'p-cursor';
    dot.setAttribute('aria-hidden', 'true');
    dot.textContent = 'View';
    document.body.appendChild(dot);
    let x = -200, y = -200, cx = x, cy = y, running = false;
    const step = () => {
      cx += (x - cx) * 0.2; cy += (y - cy) * 0.2;
      dot.style.setProperty('--cx', cx.toFixed(1) + 'px');
      dot.style.setProperty('--cy', cy.toFixed(1) + 'px');
      if (Math.abs(x - cx) > 0.2 || Math.abs(y - cy) > 0.2) requestAnimationFrame(step); else running = false;
    };
    addEventListener('pointermove', e => {
      x = e.clientX; y = e.clientY;
      if (!dot.classList.contains('on')) { cx = x; cy = y; }
      dot.classList.toggle('on', !!e.target.closest(targets));
      if (!running) { running = true; requestAnimationFrame(step); }
    }, { passive: true });
    document.addEventListener('pointerleave', () => dot.classList.remove('on'));
  }
})();
