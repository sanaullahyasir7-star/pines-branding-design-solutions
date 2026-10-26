/* Contact page enhancements. */
(()=>{'use strict';
document.documentElement.classList.add('js');
const page=document.querySelector('.contact-page');if(!page)return;
const live=page.querySelector('[data-copy-status]'),reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
let timer;
const fallback=value=>{const field=document.createElement('textarea');field.value=value;field.setAttribute('readonly','');field.style.cssText='position:fixed;opacity:0';document.body.append(field);field.select();let ok=false;try{ok=document.execCommand('copy')}catch(_){}field.remove();return ok};
const copy=async value=>{try{if(navigator.clipboard&&isSecureContext){await navigator.clipboard.writeText(value);return true}}catch(_){}return fallback(value)};
page.querySelectorAll('[data-copy-value]').forEach(button=>{button.hidden=false;button.addEventListener('click',async()=>{live.textContent=await copy(button.dataset.copyValue||'')?'Copied':'Could not copy';button.focus({preventScroll:true});clearTimeout(timer);timer=setTimeout(()=>live.textContent='',2000)})});
page.querySelectorAll('[data-region-link]').forEach(link=>link.addEventListener('click',event=>{const target=document.getElementById(link.hash.slice(1));if(!target)return;event.preventDefault();target.scrollIntoView({behavior:reduce?'auto':'smooth',block:'start'});target.focus({preventScroll:true});target.classList.add('contact-jump-highlight');setTimeout(()=>target.classList.remove('contact-jump-highlight'),2500)}));
const items=page.querySelectorAll('[data-reveal]');
const show=item=>{item.classList.add('is-visible');item.style.willChange='opacity,transform';item.addEventListener('transitionend',()=>item.style.willChange='',{once:true})};
if(reduce||!('IntersectionObserver'in window))items.forEach(item=>item.classList.add('is-visible'));
else{const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){show(entry.target);observer.unobserve(entry.target)}}),{threshold:.2});items.forEach(item=>observer.observe(item))}
})();