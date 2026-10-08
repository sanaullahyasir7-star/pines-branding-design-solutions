/* Static brief builder. No model calls or backend; messages are sent by the visitor in WhatsApp. */
(() => {
  'use strict';
  const form = document.querySelector('[data-project-form]');
  if (!form) return;
  const value = name => form.elements.namedItem(name)?.value.trim() || '';
  // WhatsApp does not report clicks back to the site. Add attribution to the
  // prepared message so Pines can identify website-originated leads after send.
  const whatsapp = text => {
    const attribution = 'Source: Pines website (utm_source=pines_website; utm_medium=whatsapp; utm_campaign=project_enquiry)';
    const params = new URLSearchParams({ text: `${text}\n\n${attribution}` });
    return `https://wa.me/923244485746?${params.toString()}`;
  };
  const message = rows => 'Hi Pines, I’d like to discuss a project.\n\n' + rows.filter(([, v]) => v).map(([k, v]) => `${k}: ${v}`).join('\n');
  const download = (text, feedback) => {
    try {
      const url = URL.createObjectURL(new Blob([text], { type: 'text/plain;charset=utf-8' }));
      const a = document.createElement('a'); a.href = url; a.download = 'pines-project-brief.txt';
      document.body.append(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      feedback.textContent = 'Brief download requested. This does not send an enquiry.';
    } catch { feedback.textContent = 'The download could not start. Copy the brief or select the text instead.'; }
  };
  const copy = async (text, feedback, fallback) => {
    try { await navigator.clipboard.writeText(text); feedback.textContent = 'Brief copied. Paste it wherever you need it.'; }
    catch {
      feedback.textContent = 'Clipboard access is unavailable. Select the brief text and copy it manually.';
      if (fallback) { fallback.focus(); fallback.select(); }
    }
  };
  const status = form.querySelector('[data-form-status]');
  const prepared = form.querySelector('[data-prepared]');
  const preview = form.querySelector('[data-prepared-text]');
  const link = form.querySelector('[data-whatsapp-link]');
  const feedback = form.querySelector('[data-brief-feedback]');
  const required = [...form.querySelectorAll('[required]')];
  const validate = el => {
    let error = '';
    if (!el.value.trim()) error = el.name === 'product_type' ? 'Choose a category, or select Not sure yet.' : el.name === 'name' ? 'Enter your name so Pines knows who to reply to.' : 'Describe what you would like to make.';
    else if (el.name === 'details' && el.value.trim().length < 10) error = 'Add a little more detail (at least 10 characters).';
    el.setAttribute('aria-invalid', String(Boolean(error)));
    document.getElementById(el.id + '-error').textContent = error;
    return !error;
  };
  required.forEach(el => el.addEventListener('input', () => { if (el.getAttribute('aria-invalid') === 'true') validate(el); }));
  const formMessage = () => message([
    ['Name',value('name')],['Company / brand',value('company')],['Phone / WhatsApp',value('phone')],
    ['Service',value('product_type')],['Delivery destination',value('destination')],['Estimated quantity',value('quantity') || 'Not sure'],
    ['Dimensions',value('size') || 'Need guidance'],['Target date',value('deadline') || 'To discuss'],
    ['Budget',value('budget')],['Project details',value('details')]
  ]);
  const refreshPrepared = () => { preview.value = formMessage(); link.href = whatsapp(preview.value); form.querySelector('[data-whatsapp-same-tab]').href = link.href; };
  form.addEventListener('input', () => {
    if (!prepared.hidden) { refreshPrepared(); feedback.textContent = 'Prepared message updated with your changes.'; }
  });
  form.addEventListener('submit', e => {
    e.preventDefault();
    if (value('website')) return;
    const invalid = required.filter(el => !validate(el));
    if (invalid.length) { status.textContent = 'Please check the highlighted fields. Your details are still here.'; invalid[0].focus(); return; }
    refreshPrepared(); prepared.hidden = false;
    status.textContent = 'Your brief is prepared. Nothing has been sent to Pines yet.';
    feedback.textContent = 'Use the link below to open WhatsApp, review your message and press Send.';
    link.focus();
  });
  // A real target=_blank link lets the browser handle opening. It remains available
  // if new tabs are blocked; the user can open it in the same tab via the context menu.
  // Avoid window.open: noopener can return null even when opening succeeds.
  link.addEventListener('click', () => {
    feedback.textContent = 'If WhatsApp did not open, try the link again, or copy your brief and message +92 324 4485746. Press Send in WhatsApp to contact Pines.';
  });
  form.querySelector('[data-copy-brief]').addEventListener('click', () => copy(preview.value, feedback, preview));
  form.querySelector('[data-download-brief]').addEventListener('click', () => download(preview.value, feedback));
  const fields = [...document.querySelectorAll('[data-plan]')];
  const summary = document.querySelector('[data-plan-summary]');
  const planFeedback = document.querySelector('[data-plan-feedback]');
  const planLink = document.querySelector('[data-plan-whatsapp]');
  let planText = '';
  const planValues = () => Object.fromEntries(fields.map(el => [el.dataset.plan, el.value.trim()]));
  const update = () => {
    const p = planValues();
    planText = message([
      ['Service', p.service], ['Delivery destination',p.destination || 'To discuss'], ['Intended product / use', p.use || 'To discuss'],
      ['Estimated quantity', p.quantity || 'Not sure'], ['Dimensions',p.size || 'Need guidance'],
      ['Artwork status',p.artwork], ['Target date',p.date || 'To discuss'],
      ['Budget',p.budget ? p.budget + ' ' + p.currency : 'To discuss']
    ]);
    summary.textContent = planText; planLink.href = whatsapp(planText);
  };
  fields.forEach(el => el.addEventListener('input', update)); update();
  document.querySelector('[data-plan-copy]').addEventListener('click', () => copy(planText, planFeedback));
  document.querySelector('[data-plan-download]').addEventListener('click', () => download(planText, planFeedback));
  planLink.addEventListener('click', () => { planFeedback.textContent = 'If WhatsApp does not open, copy your brief and message +92 324 4485746. You must press Send in WhatsApp.'; });
  let transferredText = '';
  document.querySelector('[data-plan-transfer]').addEventListener('click', () => {
    const p = planValues();
    const details = form.elements.namedItem('details');
    const base = transferredText ? details.value.replace(transferredText, '').trim() : details.value.trim();
    const addition = planText.replace('Hi Pines, I’d like to discuss a project.\n\n','');
    if ((base + '\n\n' + addition).trim().length > 4000) { planFeedback.textContent = 'Your enquiry is already long. Copy the planner brief and combine the details below.'; return; }
    // Keep existing enquiry answers; planner fills empty fields only.
    for (const [name,v] of Object.entries({destination:p.destination,product_type:p.service,quantity:p.quantity,size:p.size,deadline:p.date,budget:p.budget ? `${p.budget} ${p.currency}` : ''})) {
      const el=form.elements.namedItem(name); if (!el.value && v) el.value=v;
    }
    details.value = [base,addition].filter(Boolean).join('\n\n'); transferredText = addition;
    if (!prepared.hidden) refreshPrepared();
    planFeedback.textContent = 'Brief added to the enquiry. Existing contact details are preserved.';
    form.elements.namedItem('name').focus();
  });
})();
