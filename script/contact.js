// Helpers
const $  = (s,r=document)=>r.querySelector(s);
const $$ = (s,r=document)=>Array.from(r.querySelectorAll(s));

// NAV: mobile menu
document.addEventListener('DOMContentLoaded', ()=>{
  const hamb   = $('#hamburger');
  const mobile = $('#mobileMenu');
  if (hamb && mobile){
    hamb.addEventListener('click', ()=>{
      const open = mobile.classList.toggle('open');
      mobile.setAttribute('aria-hidden', String(!open));
      document.body.style.overflow = open ? 'hidden' : '';
    });
  }
});

// FORM: doğrulama + sayaç + PHP'ye gönder
(function initForm(){
  const form = $('#contactForm');
  if (!form) return;
  const msg = form.message;
  const count = $('#msgCount');
  const toast = $('#toast');
  const submitBtn = $('#submitBtn');

  const updateCount = ()=>{ if (count) count.textContent = msg.value.length; };
  msg.addEventListener('input', updateCount);
  updateCount();

  form.phone.addEventListener('input', e=>{
    let v = e.target.value.replace(/\D/g,'').slice(0,11);
    const parts = [v.slice(0,4), v.slice(4,7), v.slice(7,9), v.slice(9,11)].filter(Boolean);
    e.target.value = parts.join(' ').trim();
  });

  function validate(field){
    const wrap = field.closest('.field');
    const err = wrap?.querySelector('.error');
    let ok = true, message = '';
    if (field.hasAttribute('required') && !field.value.trim()){
      ok = false; message = 'Bu alan zorunludur.';
    } else if (field.type === 'email' && field.value){
      ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value);
      if (!ok) message = 'Geçerli bir e-posta girin.';
    }
    if (err){ err.textContent = ok ? '' : message; }
    field.classList.toggle('invalid', !ok);
    return ok;
  }

  $$('input[required], select[required], textarea[required]', form)
    .forEach(el => el.addEventListener('blur', ()=>validate(el)));

  form.addEventListener('submit', async e=>{
    e.preventDefault();
    const fields = $$('input, select, textarea', form);
    const allOk = fields.every(f => !f.hasAttribute('required') || validate(f));
    if (!allOk) return;

    submitBtn.disabled = true;
    submitBtn.textContent = 'Gönderiliyor…';

    try{
      const resp = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept':'application/json' }
      });
      const data = await resp.json();
      if (data.success){
        form.reset();
        updateCount();
        toast.textContent = data.message || 'Mesajınız alındı. En kısa sürede dönüş yapacağız.';
        toast.classList.add('show');
        setTimeout(()=>toast.classList.remove('show'), 2500);
      } else {
        alert(data.message || 'Gönderim sırasında bir sorun oluştu.');
      }
    } catch(err){
      alert('Sunucuya ulaşılamadı. Biraz sonra tekrar deneyin.');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Gönder';
    }
  });
})();
