// mini helpers
const $  = (s,r=document)=>r.querySelector(s);
const $$ = (s,r=document)=>Array.from(r.querySelectorAll(s));

// mobile menu
document.addEventListener('DOMContentLoaded', ()=>{
  const hamb = $('#hamburger'), mobile = $('#mobileMenu');
  if (hamb && mobile){
    hamb.addEventListener('click', ()=>{
      mobile.classList.toggle('open');
      hamb.setAttribute('aria-expanded', mobile.classList.contains('open'));
      document.body.style.overflow = mobile.classList.contains('open') ? 'hidden' : '';
    });
  }
});

// last updated (2025 damgası)
document.addEventListener('DOMContentLoaded', ()=>{
  const d = new Date();
  // 2025’e sabitlemek istersen:
  const last = new Date(Math.max(d.getTime(), new Date('2025-01-01').getTime()));
  const fmt = last.toLocaleDateString('tr-TR', {year:'numeric', month:'long', day:'2-digit'});
  $('#lastUpdated').textContent = `Son güncelleme: ${fmt}`;
});

// accordion
document.addEventListener('click', (e)=>{
  const btn = e.target.closest('.acc-toggle');
  if (!btn) return;
  const card = btn.closest('.legal-card');
  const body = card.querySelector('.card-body');
  const expanded = btn.getAttribute('aria-expanded') === 'true';
  btn.setAttribute('aria-expanded', String(!expanded));
  body.style.display = expanded ? 'none' : 'block';
});

// smooth scroll for toc
document.addEventListener('click', (e)=>{
  const a = e.target.closest('.toc a[href^="#"]');
  if (!a) return;
  e.preventDefault();
  const id = a.getAttribute('href');
  const el = $(id);
  if (el){
    const top = el.getBoundingClientRect().top + window.scrollY - 12;
    window.scrollTo({top, behavior:'smooth'});
  }
});

// print & save as txt
document.addEventListener('DOMContentLoaded', ()=>{
  $('#printBtn')?.addEventListener('click', ()=>window.print());

  $('#saveTxtBtn')?.addEventListener('click', ()=>{
    const texts = $$('.legal-card .card-body')
      .map(x=>x.textContent.replace(/\s+\n/g,'\n').trim())
      .join('\n\n--------------------------------\n\n');
    const blob = new Blob([texts], {type:'text/plain;charset=utf-8'});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'hukuki-metinler-bobomobilya.txt';
    document.body.appendChild(a);
    a.click();
    a.remove();
  });
});
