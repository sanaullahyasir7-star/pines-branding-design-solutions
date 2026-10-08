/* Progressive enhancement: all four reviews remain readable without JavaScript. */
(() => {
  'use strict';
  const track = document.querySelector('[data-testimonial-grid]');
  const controls = document.querySelector('.bh-review-controls');
  if (!track || !controls) return;
  const cards = [...track.querySelectorAll('.testimonial-card')];
  const previous = controls.querySelector('[data-review-prev]');
  const next = controls.querySelector('[data-review-next]');
  const status = controls.querySelector('[data-review-status]');
  const mobile = matchMedia('(max-width:760px)');
  const reduced = matchMedia('(prefers-reduced-motion:reduce)');
  let active = 0, timer;
  const update = () => {
    const left = track.getBoundingClientRect().left;
    active = cards.reduce((best, card, i) => Math.abs(card.getBoundingClientRect().left-left) < Math.abs(cards[best].getBoundingClientRect().left-left) ? i : best, 0);
    status.textContent = `${active + 1} of ${cards.length}`;
    previous.setAttribute('aria-disabled', String(active === 0));
    next.setAttribute('aria-disabled', String(active === cards.length - 1));
  };
  const go = index => {
    if (!mobile.matches || index < 0 || index >= cards.length) return;
    const target = cards[index].getBoundingClientRect().left - track.getBoundingClientRect().left + track.scrollLeft;
    track.scrollTo({left:target,behavior:reduced.matches ? 'instant' : 'smooth'});
  };
  previous.addEventListener('click', () => go(active - 1));
  next.addEventListener('click', () => go(active + 1));
  track.addEventListener('keydown', event => {
    if (!mobile.matches || !['ArrowLeft','ArrowRight','Home','End'].includes(event.key)) return;
    event.preventDefault();
    go(event.key === 'Home' ? 0 : event.key === 'End' ? cards.length - 1 : active + (event.key === 'ArrowRight' ? 1 : -1));
  });
  track.addEventListener('scroll', () => {clearTimeout(timer); timer = setTimeout(update,100);}, {passive:true});
  const configure = () => {
    track.classList.toggle('is-carousel',mobile.matches);
    controls.hidden = !mobile.matches;
    if (mobile.matches) {
      track.tabIndex = 0;
      track.setAttribute('role','region');
      track.setAttribute('aria-roledescription','carousel');
      track.setAttribute('aria-label','Client testimonials. Swipe or use the Previous and Next buttons.');
    } else {
      track.removeAttribute('tabindex');
      track.removeAttribute('role');
      track.removeAttribute('aria-roledescription');
      track.setAttribute('aria-label','Client testimonials');
    }
    update();
  };
  mobile.addEventListener('change',configure);
  window.addEventListener('resize',update);
  configure();
})();
