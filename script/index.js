// helpers
const $  = (s, r=document)=>r.querySelector(s);
const $$ = (s, r=document)=>Array.from(r.querySelectorAll(s));

// ===== Mobile menu =====
document.addEventListener('DOMContentLoaded', ()=>{
  const hamb = $('#hamburger');
  const mobile = $('#mobileMenu');
  if (hamb && mobile){
    hamb.addEventListener('click', ()=>{
      mobile.classList.toggle('open');
      const open = mobile.classList.contains('open');
      mobile.setAttribute('aria-hidden', String(!open));
      document.body.style.overflow = open ? 'hidden' : '';
    });
  }
});

// ===== Mega dropdown (klavye desteği + touch) =====
document.addEventListener('DOMContentLoaded', ()=>{
  const megaItem = document.querySelector('.main-nav li.mega');
  if (!megaItem) return;
  const link = megaItem.querySelector('a');
  const panel = megaItem.querySelector('.mega-panel');

  // Touch: linke ikinci dokunuşta aç/kapat
  let touched = false;
  link.addEventListener('touchend', (e)=>{
    if (!touched){
      touched = true;
      panel.style.opacity = '1';
      panel.style.visibility = 'visible';
      panel.style.transform = 'translateY(0)';
      setTimeout(()=>touched=false, 600);
      e.preventDefault();
    }
  });

  // Esc ile kapat
  document.addEventListener('keydown', (e)=>{
    if (e.key === 'Escape'){
      panel.removeAttribute('style');
    }
  });
});

// ===== Hero slider =====
document.addEventListener('DOMContentLoaded', ()=>{
  const slider = $('#heroSlider');
  if (!slider) return;
  const slides = $$('.slide', slider);
  const prev = $('#prev');
  const next = $('#next');
  let i = 0;
  const go = idx=>{
    slides[i].classList.remove('active');
    i = (idx + slides.length) % slides.length;
    slides[i].classList.add('active');
  };
  prev?.addEventListener('click', ()=>go(i-1));
  next?.addEventListener('click', ()=>go(i+1));
  setInterval(()=>go(i+1), 6000);
});

// ===== Scroll reveal =====
document.addEventListener('DOMContentLoaded', ()=>{
  const targets = $$('.reveal');
  if (!('IntersectionObserver' in window)){
    targets.forEach(el=>el.classList.add('is-visible'));
    return;
  }
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if (entry.isIntersecting){
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, {threshold: 0.12});
  targets.forEach(el=>io.observe(el));
});
// ===== Basit arama yönlendirmesi =====
document.addEventListener('DOMContentLoaded', ()=>{
  const searchForm = document.querySelector('.nav-search');
  if (!searchForm) return;
  searchForm.addEventListener('submit', (e)=>{
    e.preventDefault();
    const q = (searchForm.querySelector('input[name="q"]')?.value || '').trim();
    // search.html dosyasına göreli yönlendirme
    window.location.href = `search.html?q=${encodeURIComponent(q)}`;
  });
});
