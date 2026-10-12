/* Contact page enhancements: copy controls, region jumps and reveal-on-scroll. */
(() => {
  'use strict';
  document.documentElement.classList.add('js');
  const page = document.querySelector('.contact-page');
  if (!page) return;

  const live = page.querySelector('[data-copy-status]');
  const copyButtons = page.querySelectorAll('[data-copy-value]');
  copyButtons.forEach(button => { button.hidden = false; });

  const fallbackCopy = value => {
    const field = document.createElement('textarea');
    field.value = value;
    field.setAttribute('readonly', '');
    field.style.position = 'fixed';
    field.style.opacity = '0';
    document.body.appendChild(field);
    field.select();
    let copied = false;
    try { copied = document.execCommand('copy'); } catch (_) {}
    field.remove();
    return copied;
  };

  copyButtons.forEach(button => {
    button.addEventListener('click', async () => {
      const value = button.dataset.copyValue || '';
      let copied = false;
      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(value);
          copied = true;
        } else copied = fallbackCopy(value);
      } catch (_) {
        copied = fallbackCopy(value);
      }
      live.textContent = copied ? 'Copied' : 'Could not copy';
      window.setTimeout(() => { live.textContent = ''; }, 2000);
    });
  });

  page.querySelectorAll('[data-region-link]').forEach(link => {
    link.addEventListener('click', event => {
      const target = page.querySelector(link.getAttribute('href'));
      if (!target) return;
      event.preventDefault();
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
      target.focus({ preventScroll: true });
      target.classList.remove('contact-jump-highlight');
      void target.offsetWidth;
      target.classList.add('contact-jump-highlight');
      window.setTimeout(() => target.classList.remove('contact-jump-highlight'), 2500);
    });
  });

  const revealItems = page.querySelectorAll('[data-reveal]');
  const reveal = item => {
    item.classList.add('is-visible');
    item.style.willChange = 'opacity, transform';
    item.addEventListener('transitionend', () => { item.style.willChange = ''; }, { once: true });
  };
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
    revealItems.forEach(item => { item.classList.add('is-visible'); });
  } else {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          reveal(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
    revealItems.forEach(item => observer.observe(item));
  }
})();