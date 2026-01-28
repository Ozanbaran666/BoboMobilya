// Helpers
const $  = (s,r=document)=>r.querySelector(s);
const $$ = (s,r=document)=>Array.from(r.querySelectorAll(s));
const debounce = (fn,d=200)=>{let t;return(...a)=>{clearTimeout(t);t=setTimeout(()=>fn(...a),d);}};

// NAV: mobile menu
document.addEventListener('DOMContentLoaded', ()=>{
  const hamb = $('#hamburger'), mobile = $('#mobileMenu');
  if (hamb && mobile){
    hamb.addEventListener('click', ()=>{
      const isOpen = mobile.classList.toggle('open');
      hamb.setAttribute('aria-expanded', String(isOpen));
      mobile.setAttribute('aria-hidden', String(!isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });
  }
});

// Build small sliders on cards from data-images
function buildCardSlider(container){
  const list = (container.getAttribute('data-images') || '')
    .split(',').map(s=>s.trim()).filter(Boolean);
  if (!list.length) return;

  const slider = document.createElement('div');
  slider.className = 'media-slider';
  slider.innerHTML = `
    <button class="media-prev" aria-label="Önceki"></button>
    <div class="media-track"></div>
    <button class="media-next" aria-label="Sonraki"></button>
    <div class="media-dots" aria-hidden="true"></div>
  `;
  const track = slider.querySelector('.media-track');
  list.forEach(src=>{
    const slide = document.createElement('div');
    slide.className = 'media-slide';
    slide.innerHTML = `<img src="${src}" alt="" loading="lazy">`;
    track.appendChild(slide);
  });
  container.innerHTML = '';
  container.appendChild(slider);

  const slides = $$('.media-slide', slider);
  const dotsWrap = slider.querySelector('.media-dots');
  let i = 0;

  slides.forEach((_,idx)=>{
    const b = document.createElement('button');
    if (idx===0) b.classList.add('is-active');
    b.addEventListener('click', ()=>go(idx));
    dotsWrap.appendChild(b);
  });

  function update(){
    track.style.transform = `translateX(-${i*100}%)`;
    dotsWrap.querySelectorAll('button').forEach((b,idx)=> b.classList.toggle('is-active', idx===i));
  }
  function go(n){ i = (n+slides.length)%slides.length; update(); }

  slider.querySelector('.media-prev').addEventListener('click', ()=>go(i-1));
  slider.querySelector('.media-next').addEventListener('click', ()=>go(i+1));

  // drag / touch
  let startX=0, delta=0, dragging=false;
  const onStart = e=>{ dragging=true; slider.classList.add('grabbing'); startX=(e.touches?e.touches[0].clientX:e.clientX); delta=0; };
  const onMove  = e=>{ if(!dragging) return; const x=(e.touches?e.touches[0].clientX:e.clientX); delta=x-startX; track.style.transition='none'; track.style.transform=`translateX(${(-i*100)+(delta/slider.clientWidth*100)}%)`; };
  const onEnd   = ()=>{ if(!dragging) return; track.style.transition=''; slider.classList.remove('grabbing'); if(Math.abs(delta)>slider.clientWidth*0.2){ go(i+(delta<0?1:-1)); } else update(); dragging=false; delta=0; };
  slider.addEventListener('mousedown', onStart);
  slider.addEventListener('mousemove', onMove);
  slider.addEventListener('mouseup', onEnd);
  slider.addEventListener('mouseleave', onEnd);
  slider.addEventListener('touchstart', onStart, {passive:true});
  slider.addEventListener('touchmove', onMove, {passive:true});
  slider.addEventListener('touchend', onEnd);

  update();
}

// Init all card sliders
function initCardSliders(root=document){
  root.querySelectorAll('.product-card .product-media[data-images]').forEach(buildCardSlider);
}

// LIGHTBOX
const Lightbox = (()=>{

  let lb, stage, dots, track, prev, next, closeBtn, idx=0, imgs=[];

  function cache(){
    lb    = $('#lightbox');
    stage = lb.querySelector('.lightbox-stage');
    dots  = lb.querySelector('.lightbox-dots');
    prev  = lb.querySelector('.light-prev');
    next  = lb.querySelector('.light-next');
    closeBtn = lb.querySelector('.lightbox-close');
  }

  function build(images, start=0){
    imgs = images.slice();
    idx = Math.max(0, Math.min(start, imgs.length-1));
    stage.innerHTML = `<div class="lightbox-track">${imgs.map(src=>`<div class="lightbox-slide"><img src="${src}" alt=""></div>`).join('')}</div>`;
    track = stage.querySelector('.lightbox-track');
    dots.innerHTML = imgs.map((_,i)=>`<button ${i===idx?'class="is-active"':''}></button>`).join('');
    dots.querySelectorAll('button').forEach((b,i)=> b.addEventListener('click', ()=>go(i)));
    update();
    // drag
    let sx=0,dx=0,drag=false;
    const onStart = e=>{ drag=true; sx=(e.touches?e.touches[0].clientX:e.clientX); dx=0; track.style.transition='none'; };
    const onMove  = e=>{ if(!drag) return; const x=(e.touches?e.touches[0].clientX:e.clientX); dx=x-sx; track.style.transform=`translateX(${(-idx*100)+(dx/lb.clientWidth*100)}%)`; };
    const onEnd   = ()=>{ if(!drag) return; track.style.transition=''; if(Math.abs(dx)>lb.clientWidth*0.2){ go(idx+(dx<0?1:-1)); } else update(); drag=false; dx=0; };
    stage.addEventListener('mousedown', onStart);
    stage.addEventListener('mousemove', onMove);
    stage.addEventListener('mouseup', onEnd);
    stage.addEventListener('mouseleave', onEnd);
    stage.addEventListener('touchstart', onStart, {passive:true});
    stage.addEventListener('touchmove', onMove, {passive:true});
    stage.addEventListener('touchend', onEnd);
  }

  function update(){
    track.style.transform = `translateX(-${idx*100}%)`;
    dots.querySelectorAll('button').forEach((b,i)=> b.classList.toggle('is-active', i===idx));
  }
  function go(i){ idx = (i+imgs.length)%imgs.length; update(); }

  function open(images, start=0){
    if (!lb) cache();
    build(images, start);
    lb.classList.add('open');
    lb.setAttribute('aria-hidden','false');
    document.body.style.overflow = 'hidden';
  }
  function close(){
    lb.classList.remove('open');
    lb.setAttribute('aria-hidden','true');
    document.body.style.overflow = '';
  }

  function bind(){
    if (!lb) cache();
    lb.querySelector('.lightbox-backdrop').addEventListener('click', close);
    closeBtn.addEventListener('click', close);
    prev.addEventListener('click', ()=>go(idx-1));
    next.addEventListener('click', ()=>go(idx+1));
    document.addEventListener('keydown', e=>{
      if (!lb.classList.contains('open')) return;
      if (e.key==='Escape') close();
      if (e.key==='ArrowLeft') prev.click();
      if (e.key==='ArrowRight') next.click();
    });
  }

  return { open, bind };
})();

// Collections: filter + search + sort + pagination
document.addEventListener('DOMContentLoaded', ()=>{
  Lightbox.bind();

  const grid   = $('#grid');
  if (!grid) return;

  initCardSliders(grid);

  const chips  = $$('.filter-chip');
  const search = $('.search-input');
  const sorter = $('.select');
  const pager  = $('#pager');

  const allCards = $$('.product-card', grid);
  const originalOrder = allCards.slice();
  let filtered = allCards.slice();
  let activeCat = 'tümü';
  let currentPage = 1;
  let perPage = calcPerPage();

  // Clicking image opens LIGHTBOX
  grid.addEventListener('click', (e)=>{
    const img = e.target.closest('.media-slide img');
    if (!img) return;
    const card = e.target.closest('.product-card');
    const media = card.querySelector('.product-media');
    const images = (media.getAttribute('data-images')||'').split(',').map(s=>s.trim()).filter(Boolean);
    const sliderImgs = Array.from(card.querySelectorAll('.media-slide img')).map(x=>x.getAttribute('src'));
    const startIndex = Math.max(0, sliderImgs.indexOf(img.getAttribute('src')));
    Lightbox.open(images.length?images:sliderImgs, startIndex);
  });

  function calcPerPage(){
    const cs = getComputedStyle(grid);
    const cols = cs.gridTemplateColumns.split(' ').length || 1;
    const rows = 2;
    return cols * rows;
  }

  function renderPager(totalPages){
    if (!pager) return;
    pager.innerHTML = '';
    const makeBtn = (label, page, disabled=false, isCurrent=false) => {
      const a = document.createElement('a');
      a.textContent = label;
      a.href = '#!';
      a.className = 'page-link' + (isCurrent ? ' current' : '');
      if (disabled) a.setAttribute('disabled','');
      a.addEventListener('click', (e)=>{
        e.preventDefault();
        if (disabled || page === currentPage) return;
        goToPage(page);
      });
      return a;
    };
    const total = Math.max(1, totalPages);
    pager.appendChild(makeBtn('‹', Math.max(1, currentPage-1), currentPage===1));
    for (let i=1;i<=total;i++) pager.appendChild(makeBtn(String(i), i, false, i===currentPage));
    pager.appendChild(makeBtn('›', Math.min(total, currentPage+1), currentPage===total));
  }

  function slideAndUpdate(direction, updateFn){
    const cls = direction === 'left' ? 'grid-slide-left' : 'grid-slide-right';
    grid.classList.remove('grid-settle','grid-slide-left','grid-slide-right');
    grid.classList.add(cls);
    setTimeout(()=>{
      updateFn();
      grid.classList.remove('grid-slide-left','grid-slide-right');
      grid.classList.add('grid-settle');
      setTimeout(()=>grid.classList.remove('grid-settle'), 380);
    }, 140);
  }

  function renderPage(direction='left'){
    const totalPages = Math.ceil(filtered.length / perPage) || 1;
    currentPage = Math.min(Math.max(1, currentPage), totalPages);
    const start = (currentPage - 1) * perPage;
    const end   = start + perPage;

    slideAndUpdate(direction, ()=>{
      filtered.forEach((card, idx)=>{ card.style.display = (idx >= start && idx < end) ? '' : 'none'; });
    });
    renderPager(totalPages);
  }

  function applyFilterSortSearch(){
    const q = (search?.value || '').toLowerCase().trim();

    filtered = allCards.filter(card=>{
      const cat   = (card.dataset.cat||'').toLowerCase().trim();
      const tags  = (card.dataset.tags||'').toLowerCase();
      const title = (card.querySelector('.product-title')?.textContent || '').toLowerCase();
      const okCat = activeCat === 'tümü' || (cat && cat === activeCat);
      const okQ   = !q || title.includes(q) || tags.includes(q);
      return okCat && okQ;
    });

    const val = (sorter?.value || '').toLowerCase();
    if (val.includes('alfabetik')){
      filtered.sort((a,b)=>{
        const ta = (a.querySelector('.product-title')?.textContent||'').toLowerCase();
        const tb = (b.querySelector('.product-title')?.textContent||'').toLowerCase();
        return ta.localeCompare(tb, 'tr');
      });
    } else if (val.includes('yeni')){
      filtered.sort((a,b)=>((b.dataset.new==='1') - (a.dataset.new==='1')));
    } else {
      filtered.sort((a,b)=>{
        const fb = (b.dataset.featured==='1') - (a.dataset.featured==='1');
        if (fb) return fb;
        return originalOrder.indexOf(a) - originalOrder.indexOf(b);
      });
    }

    currentPage = 1;
    renderPage('left');
  }

  function goToPage(page){
    const dir = page > currentPage ? 'left' : 'right';
    currentPage = page;
    renderPage(dir);
  }

  $$('.filter-chip').forEach(chip=>{
    chip.addEventListener('click', ()=>{
      chips.forEach(c=>c.classList.remove('active'));
      chip.addEventListener('blur', ()=>chip.classList.remove('focus'));
      chip.classList.add('active');
      activeCat = (chip.dataset.filter || 'tümü').toLowerCase();
      applyFilterSortSearch();
    });
  });

  if (search) search.addEventListener('input', debounce(applyFilterSortSearch, 200));
  if (sorter) sorter.addEventListener('change', applyFilterSortSearch);

  window.addEventListener('resize', debounce(()=>{
    const newPer = calcPerPage();
    if (newPer !== perPage){ perPage = newPer; renderPage('left'); }
  }, 200));

  // Initial
  applyFilterSortSearch();
});
