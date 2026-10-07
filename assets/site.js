(() => {
  const menu = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.navlinks');

  if (menu && nav) {
    const closeMenu = () => {
      nav.classList.remove('open');
      menu.setAttribute('aria-expanded', 'false');
      menu.setAttribute('aria-label', 'Open navigation');
      menu.textContent = '☰';
    };

    menu.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('open');
      menu.setAttribute('aria-expanded', String(isOpen));
      menu.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
      menu.textContent = isOpen ? '×' : '☰';
    });
    nav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape') closeMenu();
    });
  }

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if ('IntersectionObserver' in window && !reduceMotion) {
    document.documentElement.classList.add('motion-enabled');
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll('.reveal').forEach(element => observer.observe(element));
  } else {
    document.querySelectorAll('.reveal').forEach(element => element.classList.add('in'));
  }

  document.querySelectorAll('details').forEach(detail => {
    detail.addEventListener('toggle', () => {
      if (detail.open) detail.scrollIntoView({ block: 'nearest', behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  });

  const testimonialRoot = document.querySelector('[data-testimonials-preview]');
  if (testimonialRoot) {
    const items = window.PINES_TESTIMONIALS || [];
    const feature = testimonialRoot.querySelector('[data-testimonial-feature]');
    const grid = testimonialRoot.querySelector('[data-testimonial-grid]');
    const controls = testimonialRoot.querySelector('[data-testimonial-controls]');
    const dots = testimonialRoot.querySelector('[data-testimonial-dots]');
    const escapeHtml = value => String(value).replace(/[&<>"']/g, char => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    })[char]);
    const renderCard = (item, index, featured = false) => `
      <figure class="testimonial-card${featured ? ' testimonial-card-featured' : ''}" data-testimonial-index="${index}">
        <blockquote>${escapeHtml(item.quote)}</blockquote>
        <figcaption><span class="person">${escapeHtml(item.name)}</span>${escapeHtml(item.role)} · ${escapeHtml(item.company)}<br>${escapeHtml(item.service)}</figcaption>
        <span class="testimonial-tag">${escapeHtml(item.projectType)}</span>
      </figure>`;

    if (items.length) {
      // Desktop uses the first quote as a feature; the mobile scroller contains all four.
      feature.innerHTML = renderCard(items[0], 0, true);
      grid.innerHTML = items.map((item, index) => renderCard(item, index)).join('');
      if (items.length > 1 && controls && dots) {
        controls.hidden = false;
        dots.innerHTML = items.map((_, index) => `<button type="button" class="testimonial-dot" aria-label="Show testimonial ${index + 1}" aria-current="${index === 0}" data-dot="${index}"></button>`).join('');
        const cards = [...grid.querySelectorAll('[data-testimonial-index]')];
        const goTo = index => {
          const target = cards[index];
          if (!target) return;
          if (window.matchMedia('(max-width: 760px)').matches) {
            grid.scrollTo({ left: target.offsetLeft, behavior: reduceMotion ? 'auto' : 'smooth' });
          }
          dots.querySelectorAll('button').forEach((dot, dotIndex) => dot.setAttribute('aria-current', String(dotIndex === index)));
        };
        testimonialRoot.querySelector('[data-testimonial-prev]')?.addEventListener('click', () => {
          const active = Number(dots.querySelector('[aria-current="true"]')?.dataset.dot || 0);
          goTo((active + items.length - 1) % items.length);
        });
        testimonialRoot.querySelector('[data-testimonial-next]')?.addEventListener('click', () => {
          const active = Number(dots.querySelector('[aria-current="true"]')?.dataset.dot || 0);
          goTo((active + 1) % items.length);
        });
        dots.addEventListener('click', event => {
          const dot = event.target.closest('[data-dot]');
          if (dot) goTo(Number(dot.dataset.dot));
        });
        let scrollFrame;
        grid.addEventListener('scroll', () => {
          if (!window.matchMedia('(max-width: 760px)').matches) return;
          cancelAnimationFrame(scrollFrame);
          scrollFrame = requestAnimationFrame(() => {
            let nearest = 0;
            let distance = Infinity;
            cards.forEach((card, index) => {
              const currentDistance = Math.abs(card.offsetLeft - grid.scrollLeft);
              if (currentDistance < distance) { distance = currentDistance; nearest = index; }
            });
            dots.querySelectorAll('button').forEach((dot, index) => dot.setAttribute('aria-current', String(index === nearest)));
          });
        }, { passive: true });
      }
    } else {
      feature.innerHTML = '<p class="testimonial-empty">Client testimonials will appear here.</p>';
      grid.hidden = true;
    }
  }

  const form = document.querySelector('[data-project-form]');
  if (form) {
    const status = form.querySelector('[data-form-status]');
    const submit = form.querySelector('[type="submit"]');
    const field = name => form.elements.namedItem(name)?.value.trim() || '';
    form.addEventListener('submit', event => {
      event.preventDefault();
      status.textContent = '';
      status.className = 'form-status';
      if (!form.reportValidity()) return;
      if (field('website')) return; // Honeypot: silently ignore automated spam.

      const details = [
        ['Name', field('name')],
        ['Company / brand', field('company')],
        ['Service', field('product_type')],
        ['Estimated quantity', field('quantity')],
        ['Dimensions', field('size')],
        ['Target deadline', field('deadline')],
        ['Budget range', field('budget')],
        ['Project details', field('details')]
      ].filter(([, value]) => value);
      const message = `Hi Pines, I’d like to discuss a project.\n\n${details.map(([label, value]) => `${label}: ${value}`).join('\n')}`;
      const whatsappUrl = `https://wa.me/923244485746?text=${encodeURIComponent(message)}`;

      if (form.elements.namedItem('download_copy')?.checked) {
        const brief = document.createElement('a');
        brief.href = URL.createObjectURL(new Blob([message], { type: 'text/plain;charset=utf-8' }));
        brief.download = 'pines-project-brief.txt';
        brief.click();
        URL.revokeObjectURL(brief.href);
      }

      status.textContent = 'WhatsApp is opening with your message. Review the details there, then tap Send.';
      status.classList.add('success');
      submit.disabled = true;
      submit.textContent = 'Opening WhatsApp…';
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
      window.setTimeout(() => {
        submit.disabled = false;
        submit.textContent = 'Open WhatsApp with project brief ↗';
      }, 1500);
    });
  }
})();
