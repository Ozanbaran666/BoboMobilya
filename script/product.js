const $  = (s, r=document)=>r.querySelector(s);
const $$ = (s, r=document)=>Array.from(r.querySelectorAll(s));

/* NAVBAR mobile */
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

/* ÜRÜN VERİLERİ */
const PRODUCTS = {
  "pamfilya-koleksiyonu": {
    title: "Pamfilya Koleksiyonu",
    images: ["materials/mobilya38.jpeg","materials/mobilya39.jpeg","materials/mobilya41.jpeg"],
    desc: "Akdeniz esintisini modern çizgilerle buluşturan modüler oturma grupları. Sıcak ahşap tonları ve yumuşak dokularla rahat kullanım.",
    specs: ["Üçlü Koltuk: 225 × 90 × 85 cm","Berjer: 85 × 78 × 90 cm","Sehpa: 120 × 60 × 40 cm"],
    price: "Sorunuz"
  },
  "harran-koleksiyonu": {
    title: "Harran Koleksiyonu",
    images: ["materials/mobilya14.jpeg","materials/mobilya15.jpeg","materials/mobilya16.jpeg"],
    desc: "Sıcak ceviz tonları ve modüler kurgu ile yatak odasında dengeli bir kompozisyon.",
    specs: ["Yatak Başlığı: 170 × 8 × 120 cm","Komodin: 55 × 40 × 50 cm","Şifonyer: 120 × 45 × 80 cm"],
    price: "Sorunuz"
  },
  "misis-koleksiyonu": {
    title: "Misis Koleksiyonu",
    images: ["materials/mobilya37.jpeg","materials/mobilya40.jpeg"],
    desc: "Minimal tasarım, ince detaylar. Metal ve doğal yüzeylerin dengeli birlikteliği.",
    specs: ["Masa: 200 × 90 × 75 cm","Konsol: 180 × 45 × 80 cm"],
    price: "Sorunuz"
  },
  "halfeti": {
    title: "Halfetî",
    images: ["materials/mobilya52.jpeg","materials/mobilya54.jpeg"],
    desc: "Açık tonların ferahlığıyla tamamlayıcı parçalar.",
    specs: ["Raf Ünitesi: 80 × 30 × 190 cm","Yan Sehpa: 45 × 45 × 50 cm"],
    price: "Sorunuz"
  },
  "moduler-kanepe": {
    title: "Modüler Kanepe",
    images: ["materials/mobilya49.jpeg","materials/mobilya50.jpeg"],
    desc: "Alanınıza göre şekillenen konfigürasyon.",
    specs: ["Modül: 90 × 90 × 70 cm","Köşe Modül: 90 × 90 × 70 cm"],
    price: "Sorunuz"
  },
  "baslik-komodin": {
    title: "Başlık & Komodin",
    images: ["materials/mobilya8.jpeg","materials/mobilya9.jpeg","materials/mobilya10.jpeg"],
    desc: "Bütünsel bir yatak odası görünümü için uyumlu başlık ve komodin.",
    specs: ["Başlık: 160/180/200 cm","Komodin: 50 × 40 × 50 cm"],
    price: "Sorunuz"
  },
  "masa": {
    title: "Masa",
    images: ["materials/mobilya28.jpeg","materials/mobilya29.jpeg"],
    desc: "Geniş tabla, sağlam strüktür; kalabalık sofralar için.",
    specs: ["Masa: 200 × 95 × 75 cm","Oturum: 6–8 kişi"],
    price: "Sorunuz"
  },
  "tekli-berjer": {
    title: "Tekli Berjer",
    images: ["materials/mobilya4.jpeg","materials/mobilya46.jpeg"],
    desc: "Okuma köşeleri için destekli sırt ve rahat oturum.",
    specs: ["Berjer: 80 × 85 × 90 cm"],
    price: "Sorunuz"
  },
  "aksesuar-seti": {
    title: "Aksesuar Seti",
    images: ["materials/mobilya52.jpeg"],
    desc: "Mekan bütünlüğünü tamamlayan seçili aksesuar kombinleri.",
    specs: ["Vazo seti, dekoratif obje, tepsi"],
    price: "Sorunuz"
  },
  "sandalye": {
    title: "Sandalye",
    images: ["materials/mobilya37.jpeg","materials/mobilya40.jpeg"],
    desc: "Ergonomik oturum ve sağlam iskelet.",
    specs: ["Oturum yüksekliği: 46 cm","Genişlik: 50 cm"],
    price: "Sorunuz"
  },
  "tv-unitesi": {
    title: "TV Ünitesi",
    images: ["materials/mobilya42.jpeg","materials/mobilya43.jpeg","materials/mobilya44.jpeg"],
    desc: "Medya ekipmanları için akıllı depolama çözümleri.",
    specs: ["Alt modül: 200 × 45 × 50 cm","Üst raf: 200 × 25 × 30 cm"],
    price: "Sorunuz"
  },
  "komodin": {
    title: "Komodin",
    images: ["materials/mobilya55.jpeg"],
    desc: "Yatak başında işlevsel depolama.",
    specs: ["Komodin: 50 × 40 × 50 cm"],
    price: "Sorunuz"
  }
};

function getParam(name){
  const u = new URL(window.location.href);
  return u.searchParams.get(name);
}

/* Galeri oluştur ve init et */
function buildGallery(images){
  const wrap = document.createElement('div');
  wrap.className = 'gal-slider';
  wrap.innerHTML = `
    <button class="gal-prev" aria-label="Önceki"></button>
    <div class="gal-track">${images.map(src=>`<div class="gal-slide"><img src="${src}" alt=""></div>`).join('')}</div>
    <button class="gal-next" aria-label="Sonraki"></button>
    <div class="gal-dots">${images.map((_,i)=>`<button ${i===0?'class="is-active"':''}></button>`).join('')}</div>
  `;
  return wrap;
}

function initGallery(root){
  const track = root.querySelector('.gal-track');
  const dots  = $$('.gal-dots button', root);
  let i=0, n=track.children.length;

  const update = ()=>{
    track.style.transform = `translateX(-${i*100}%)`;
    dots.forEach((b,idx)=>b.classList.toggle('is-active', idx===i));
  };
  const go = x => { i=(x+n)%n; update(); };

  root.querySelector('.gal-prev').addEventListener('click', ()=>go(i-1));
  root.querySelector('.gal-next').addEventListener('click', ()=>go(i+1));
  dots.forEach((b,idx)=> b.addEventListener('click', ()=>go(idx)));

  // drag/touch
  let sx=0,dx=0,drag=false;
  const onStart = e=>{ drag=true; sx=(e.touches?e.touches[0].clientX:e.clientX); dx=0; track.style.transition='none'; };
  const onMove  = e=>{ if(!drag) return; const x=(e.touches?e.touches[0].clientX:e.clientX); dx=x-sx; track.style.transform=`translateX(${(-i*100)+(dx/root.clientWidth*100)}%)`; };
  const onEnd   = ()=>{ if(!drag) return; track.style.transition=''; if(Math.abs(dx)>root.clientWidth*0.2){ go(i+(dx<0?1:-1)); } else update(); drag=false; dx=0; };
  root.addEventListener('mousedown', onStart);
  root.addEventListener('mousemove', onMove);
  root.addEventListener('mouseup', onEnd);
  root.addEventListener('mouseleave', onEnd);
  root.addEventListener('touchstart', onStart, {passive:true});
  root.addEventListener('touchmove', onMove, {passive:true});
  root.addEventListener('touchend', onEnd);

  // autoplay
  let timer = setInterval(()=>go(i+1), 4500);
  root.addEventListener('mouseenter', ()=>clearInterval(timer));
  root.addEventListener('mouseleave', ()=>{ timer = setInterval(()=>go(i+1), 4500); });

  update();
}

/* İlgili ürünler */
function buildRelated(currentSlug){
  const rel = $('#relTrack');
  const items = Object.entries(PRODUCTS)
    .filter(([slug])=> slug !== currentSlug)
    .slice(0, 12);

  rel.innerHTML = items.map(([slug, p])=>`
    <a class="rel-card" href="product.html?slug=${slug}">
      <div class="rel-media"><img src="${p.images[0]}" alt=""></div>
      <div class="rel-body">
        <div class="rel-title">${p.title}</div>
        <div class="rel-price">${p.price || 'Sorunuz'}</div>
      </div>
    </a>
  `).join('');

  const track = rel;
  let offset = 0;
  const cardW = track.firstElementChild ? track.firstElementChild.getBoundingClientRect().width + 12 : 252;

  function move(px){ offset += px; track.style.transform = `translateX(${offset}px)`; }

  $('#relPrev').addEventListener('click', ()=>move(cardW));
  $('#relNext').addEventListener('click', ()=>move(-cardW));

  let auto = setInterval(()=>move(-cardW), 3500);
  track.addEventListener('mouseenter', ()=>clearInterval(auto));
  track.addEventListener('mouseleave', ()=>{ auto = setInterval(()=>move(-cardW), 3500); });
}

/* Sayfa kurulum */
document.addEventListener('DOMContentLoaded', ()=>{
  const slug = getParam('slug');
  const p = PRODUCTS[slug];

  const titleEl = $('#productTitle');
  const crumbEl = $('#crumbTitle');
  const descEl  = $('#productDesc');
  const specUl  = $('#specList');
  const priceEl = $('#price');
  const galWrap = $('#gallery');
  const askBtn  = $('#askOffer');

  if (!p){
    titleEl.textContent = 'Ürün bulunamadı';
    crumbEl.textContent = 'Ürün bulunamadı';
    descEl.textContent = 'Aradığınız ürün kaldırılmış veya taşınmış olabilir.';
    galWrap.innerHTML = `<div class="gal-slider"><div class="gal-track"><div class="gal-slide"><img src="materials/mobilya38.jpeg" alt=""></div></div></div>`;
    priceEl.textContent = '—';
    buildRelated('');
    return;
  }

  titleEl.textContent = p.title;
  crumbEl.textContent = p.title;
  descEl.textContent = p.desc;
  specUl.innerHTML = (p.specs||[]).map(s=>`<li>${s}</li>`).join('');
  priceEl.textContent = p.price || 'Sorunuz';

  const gal = buildGallery(p.images);
  galWrap.innerHTML = '';
  galWrap.appendChild(gal);
  initGallery(gal);

  askBtn.href = `contact.html?urun=${encodeURIComponent(p.title)}`;
  buildRelated(slug);
});
