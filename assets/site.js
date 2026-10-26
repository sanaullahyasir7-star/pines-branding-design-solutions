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

/* Motion layer: reading progress, header depth, scroll reveals, headline masks, hero tilt
   and magnetic buttons. Progressive enhancement: it does nothing for visitors who prefer
   reduced motion, and only content below the first screen is ever hidden, so nothing
   flashes on load. */
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

  // Pointer-only touches (desktop mice and trackpads).
  if (matchMedia('(hover: hover) and (pointer: fine)').matches) {
    const hero = document.querySelector('.bh-hero');
    const shot = hero && hero.querySelector('.bh-hero-visual');
    if (shot) {
      let tilting = false, tx = 0, ty = 0;
      const paint = () => {
        tilting = false;
        shot.style.setProperty('--ry', (tx * 3).toFixed(2) + 'deg');
        shot.style.setProperty('--rx', (-ty * 2.5).toFixed(2) + 'deg');
      };
      hero.addEventListener('pointermove', e => {
        tx = Math.max(-1, Math.min(1, (e.clientX / window.innerWidth - 0.5) * 2));
        ty = Math.max(-1, Math.min(1, (e.clientY / window.innerHeight - 0.5) * 2));
        if (!tilting) { tilting = true; requestAnimationFrame(paint); }
      });
      hero.addEventListener('pointerleave', () => { tx = 0; ty = 0; paint(); });
    }
    document.querySelectorAll('a.button, .site-header .cta').forEach(el => {
      el.addEventListener('pointermove', e => {
        const r = el.getBoundingClientRect();
        el.style.setProperty('--mx', (((e.clientX - r.left) / r.width - 0.5) * 8).toFixed(1) + 'px');
        el.style.setProperty('--my', (((e.clientY - r.top) / r.height - 0.5) * 6).toFixed(1) + 'px');
      });
      el.addEventListener('pointerleave', () => { el.style.removeProperty('--mx'); el.style.removeProperty('--my'); });
    });
  }

  if (!('IntersectionObserver' in window)) return;

  const selectors = [
    '.bh-section-heading', '.bh-work-intro', '.bh-work-card', '.bh-service', '.bh-steps > *',
    '.bh-contact .wrap > *', '.bh-location', '.bh-contained',
    '.section-heading', '.split > *', '.copy-block', '.form-panel', '.planner-summary',
    '.client-project-heading', '.client-project-gallery > *', '.client-project-subsection-heading',
    '.service-card', '.services-section-head', '.services-transition', '.services-next-step',
    '.timeline > article', '.faq-list > details'
  ];
  const excluded = '.testimonials,[data-reveal],.marquee,.brand-marquee,.brand-strip,.prepared-brief,[hidden]';
  const all = [...new Set(document.querySelectorAll(selectors.join(',')))].filter(el => !el.closest(excluded));
  const below = window.innerHeight * 0.92;
  const nested = el => all.some(o => o !== el && o.contains(el));
  const visibleNow = [], targets = [];
  all.forEach(el => {
    if (nested(el)) return;
    (el.getBoundingClientRect().top > below ? targets : visibleNow).push(el);
  });
  if (!targets.length) return;
  root.classList.add('motion');
  // Things already on screen skip the hiding but still get their finishing touches (e.g. step lines).
  visibleNow.forEach(el => el.classList.add('m-in'));

  // Split headings that sit below the fold into masked words, so they can rise as they arrive.
  const splitWords = h => {
    let n = 0;
    const walk = node => {
      [...node.childNodes].forEach(c => {
        if (c.nodeType === 3) {
          const frag = document.createDocumentFragment();
          c.textContent.split(/(\s+)/).forEach(t => {
            if (!t) return;
            if (/^\s+$/.test(t)) { frag.append(t); return; }
            const w = document.createElement('span'), inner = document.createElement('span');
            w.className = 'w sw'; w.style.setProperty('--wi', n++);
            inner.textContent = t; w.append(inner); frag.append(w);
          });
          c.replaceWith(frag);
        } else if (c.nodeType === 1 && c.tagName !== 'BR' && c.tagName.toLowerCase() !== 'svg') walk(c);
      });
    };
    walk(h);
  };
  targets.forEach(t => {
    const heads = t.matches('h2') ? [t] : [...t.querySelectorAll('h2')];
    heads.filter(h => !h.classList.contains('stage-heading') && !h.querySelector('svg') && !h.querySelector('.w'))
         .forEach(splitWords);
  });

  // Keep the data-m state long enough for the slowest transition to finish, then hand the element back.
  const finish = el => { el.removeAttribute('data-m'); el.style.removeProperty('--md'); };
  const reveal = (el, i) => {
    const delay = Math.min(i, 5) * 80;
    el.style.setProperty('--md', delay + 'ms');
    el.classList.add('m-in');
    setTimeout(() => finish(el), 2800 + delay);
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
