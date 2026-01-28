// Helpers
const $  = (s,r=document)=>r.querySelector(s);
const $$ = (s,r=document)=>Array.from(r.querySelectorAll(s));

// NAV: mobile menu + transparent -> white on scroll
document.addEventListener('DOMContentLoaded', ()=>{
  const header = $('.nav-wrap');
  const hamb   = $('#hamburger');
  const mobile = $('#mobileMenu');

  const onScroll = ()=>{
    if (window.scrollY > 4) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  };
  onScroll();
  window.addEventListener('scroll', onScroll, {passive:true});

  if (hamb && mobile){
    hamb.addEventListener('click', ()=>{
      const open = mobile.classList.toggle('open');
      mobile.setAttribute('aria-hidden', String(!open));
      document.body.style.overflow = open ? 'hidden' : '';
    });
  }
});

/* ===== Gallery slider (auto + dots + drag/touch) ===== */
(function initBrandSlider(){
  const slider = $('#brandSlider');
  if (!slider) return;
  const track  = slider.querySelector('.g-track');
  const slides = Array.from(slider.querySelectorAll('.g-slide'));
  const prev   = slider.querySelector('.g-prev');
  const next   = slider.querySelector('.g-next');
  const dotsWrap = slider.querySelector('.g-dots');

  let index = 0, timer = null;
  const DOTS = slides.map((_,i)=>{
    const b = document.createElement('button');
    if (i===0) b.classList.add('is-active');
    b.addEventListener('click', ()=>go(i));
    dotsWrap.appendChild(b);
    return b;
  });

  function update(){
    track.style.transform = `translateX(-${index*100}%)`;
    DOTS.forEach((d,i)=>d.classList.toggle('is-active', i===index));
  }
  function go(i){
    index = (i + slides.length) % slides.length;
    update();
  }

  prev.addEventListener('click', ()=>go(index-1));
  next.addEventListener('click', ()=>go(index+1));

  // drag / touch
  let startX = 0, delta = 0, dragging = false;
  const onStart = e=>{
    dragging = true;
    slider.classList.add('grabbing');
    startX = (e.touches ? e.touches[0].clientX : e.clientX);
    delta = 0;
    stopAuto();
  };
  const onMove = e=>{
    if (!dragging) return;
    const x = (e.touches ? e.touches[0].clientX : e.clientX);
    delta = x - startX;
    track.style.transition = 'none';
    track.style.transform = `translateX(${(-index*100) + (delta/slider.clientWidth*100)}%)`;
  };
  const onEnd = ()=>{
    if (!dragging) return;
    track.style.transition = '';
    slider.classList.remove('grabbing');
    if (Math.abs(delta) > slider.clientWidth*0.18){
      go(index + (delta<0 ? 1 : -1));
    }else{
      update();
    }
    dragging = false; delta = 0; startAuto();
  };

  slider.addEventListener('mousedown', onStart);
  slider.addEventListener('mousemove', onMove);
  slider.addEventListener('mouseup', onEnd);
  slider.addEventListener('mouseleave', onEnd);
  slider.addEventListener('touchstart', onStart, {passive:true});
  slider.addEventListener('touchmove', onMove, {passive:true});
  slider.addEventListener('touchend', onEnd);

  // autoplay
  const auto = slider.getAttribute('data-autoplay') === '1';
  function startAuto(){ if (auto){ stopAuto(); timer = setInterval(()=>go(index+1), 3500); } }
  function stopAuto(){ if (timer) clearInterval(timer); }
  slider.addEventListener('mouseenter', stopAuto);
  slider.addEventListener('mouseleave', startAuto);

  // init
  update();
  startAuto();
})();
