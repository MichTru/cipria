import { BOUTIQUE, PRENOTAZIONI, NEWSLETTER } from './config.js';
import { getProducts, cart, armadio, formatPrice, isDemo } from './shop.js';

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const root = document.documentElement;
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const lerp = (a, b, t) => a + (b - a) * t;
const easeInOut = t => (t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const waLink = text => `https://wa.me/${BOUTIQUE.whatsapp}?text=${encodeURIComponent(text)}`;
let vw = innerWidth, vh = innerHeight;

/* ---------- Intro: volo di camera 3D ---------- */
const intro = $('[data-intro]');
let started = false;
const start = () => {
  if (started) return;
  started = true;
  intro?.classList.add('out');
  root.classList.add('ready');
  setTimeout(() => intro?.remove(), 800);
};
if (reduced || !intro) {
  start();
} else {
  const stage = $('[data-intro-stage]');
  stage.addEventListener('animationend', start, { once: true });
  $('[data-intro-skip]').addEventListener('click', start);
  intro.addEventListener('pointerdown', start);
  addEventListener('wheel', start, { once: true, passive: true });
  setTimeout(start, 4600); // non restare mai bloccati sull'intro
}

/* ---------- Testi parola per parola ---------- */
function splitWords(el) {
  let i = 0;
  const walk = node => {
    [...node.childNodes].forEach(child => {
      if (child.nodeType === 3) {
        const frag = document.createDocumentFragment();
        child.textContent.split(/(\s+)/).forEach(part => {
          if (!part) return;
          if (/^\s+$/.test(part)) { frag.append(document.createTextNode(' ')); return; }
          const wrap = document.createElement('span');
          wrap.className = 'w-wrap';
          const inner = document.createElement('span');
          inner.className = 'w-in';
          inner.style.setProperty('--i', i++);
          inner.textContent = part;
          wrap.append(inner);
          frag.append(wrap);
        });
        child.replaceWith(frag);
      } else if (child.nodeType === 1 && child.tagName !== 'BR') {
        walk(child);
      }
    });
  };
  walk(el);
}
$$('[data-split]').forEach(splitWords);

const manifesto = $('[data-words]');
manifesto.innerHTML = manifesto.textContent.trim().split(/\s+/).map((w, i) => `<span class="w" style="--i:${i}">${w}</span>`).join(' ');
manifesto.setAttribute('data-reveal-only', '');

/* ---------- Comparsa allo scroll ---------- */
const io = new IntersectionObserver(entries => {
  entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
}, { threshold: .2, rootMargin: '0px 0px -6% 0px' });
const observe = scope => $$('[data-split], [data-reveal], [data-reveal-only]', scope).forEach(el => (reduced ? el.classList.add('in') : io.observe(el)));
observe(document);

/* ---------- Header ---------- */
const header = $('[data-header]');
let lastY = scrollY;
const menuBtn = $('[data-menu-toggle]');
menuBtn.addEventListener('click', () => {
  const open = root.classList.toggle('menu-open');
  menuBtn.setAttribute('aria-expanded', open);
});
$$('.main-nav a').forEach(a => a.addEventListener('click', () => {
  root.classList.remove('menu-open');
  menuBtn.setAttribute('aria-expanded', 'false');
}));

/* ---------- Hero: bagliore e parallasse leggera ---------- */
const hero = $('[data-hero]');
const heroMedia = $('[data-hero-media]');
const glow = $('[data-glow]');
let gTarget = { x: vw * .7, y: vh * .4 }, gPos = { ...gTarget };
if (finePointer) hero.addEventListener('pointermove', e => { gTarget = { x: e.clientX, y: e.clientY }; }, { passive: true });
function renderHero() {
  if (scrollY < vh * 1.2) heroMedia.style.setProperty('--py', `${scrollY * .25}px`);
  if (!finePointer) return;
  gPos.x = lerp(gPos.x, gTarget.x, .07);
  gPos.y = lerp(gPos.y, gTarget.y, .07);
  glow.style.setProperty('--gx', `${gPos.x}px`);
  glow.style.setProperty('--gy', `${gPos.y}px`);
}

/* ---------- Testo in movimento ---------- */
const marquees = $$('[data-marquee]').map(row => {
  const span = row.firstElementChild;
  for (let n = 0; n < 3; n++) row.append(span.cloneNode(true));
  return { row, dir: Number(row.dataset.marquee), x: 0, w: span.offsetWidth, visible: false };
});
const mio = new IntersectionObserver(es => es.forEach(e => { const m = marquees.find(q => q.row === e.target); if (m) m.visible = e.isIntersecting; }));
marquees.forEach(m => mio.observe(m.row));
let velocity = 0;
function renderMarquee(dy) {
  velocity = lerp(velocity, dy, .1);
  marquees.forEach(m => {
    if (!m.visible) return;
    const dir = m.dir * (velocity < -0.5 ? -1 : 1);
    m.x -= (0.6 + Math.min(Math.abs(velocity), 60) * .3) * dir;
    if (m.x <= -m.w) m.x += m.w;
    if (m.x > 0) m.x -= m.w;
    m.row.style.transform = `translate3d(${m.x}px,0,0)`;
  });
}

/* ---------- Sposa: abiti in dissolvenza automatica ---------- */
const sposa = $('[data-sposa]');
const slides = $$('.abito-slide', sposa);
const tabs = $$('[data-abito]', sposa);
const desc = $('[data-abito-desc]', sposa);
const DURATA = 5200;
let current = 0, timer = null, inView = false;
sposa.style.setProperty('--dur', `${DURATA}ms`);
function showAbito(i) {
  current = i;
  slides.forEach((s, n) => s.classList.toggle('on', n === i));
  tabs.forEach((t, n) => {
    t.setAttribute('aria-selected', n === i);
    const bar = $('.bar i', t);
    bar.style.animation = 'none'; void bar.offsetWidth; bar.style.animation = '';
  });
  desc.classList.add('swap');
  setTimeout(() => { desc.textContent = slides[i].dataset.desc; desc.classList.remove('swap'); }, 350);
}
function schedule() {
  clearTimeout(timer);
  if (!inView || reduced || sposa.classList.contains('paused')) return;
  timer = setTimeout(() => { showAbito((current + 1) % slides.length); schedule(); }, DURATA);
}
tabs.forEach((t, n) => t.addEventListener('click', () => { showAbito(n); schedule(); }));
sposa.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse') { sposa.classList.add('paused'); clearTimeout(timer); } });
sposa.addEventListener('pointerleave', e => { if (e.pointerType === 'mouse') { sposa.classList.remove('paused'); showAbito(current); schedule(); } });
new IntersectionObserver(([e]) => { inView = e.isIntersecting; if (inView) { showAbito(current); schedule(); } else clearTimeout(timer); }, { threshold: .35 }).observe(sposa);

/* ---------- Barra mobile ---------- */
const mbar = $('[data-mbar]');
const footer = $('.site-footer');
function renderMbar() {
  const nearEnd = footer.getBoundingClientRect().top < vh;
  mbar.classList.toggle('on', scrollY > vh * .8 && !nearEnd);
}

/* ---------- Vetrina trascinabile con inclinazione ---------- */
const track = $('[data-track]');
let skew = 0, lastLeft = 0;
function renderTrackSkew() {
  const delta = track.scrollLeft - lastLeft;
  lastLeft = track.scrollLeft;
  skew = lerp(skew, clamp(-delta * .25, -7, 7), .12);
  if (Math.abs(skew) < .01) skew = 0;
  track.style.setProperty('--skew', `${skew.toFixed(2)}deg`);
  $$('.card', track).forEach(c => c.style.setProperty('--skew', `${skew.toFixed(2)}deg`));
}
if (finePointer) {
  let down = false, startX = 0, startLeft = 0, lastX = 0, v = 0, moved = false;
  track.addEventListener('pointerdown', e => {
    if (e.pointerType !== 'mouse' || e.target.closest('button, select, a')) return;
    down = true; moved = false; startX = lastX = e.clientX; startLeft = track.scrollLeft; v = 0;
  });
  addEventListener('pointermove', e => {
    if (!down) return;
    if (Math.abs(e.clientX - startX) > 4) { moved = true; track.classList.add('dragging'); }
    v = e.clientX - lastX; lastX = e.clientX;
    track.scrollLeft = startLeft - (e.clientX - startX);
  });
  addEventListener('pointerup', () => {
    if (!down) return;
    down = false;
    track.classList.remove('dragging');
    if (!moved) return;
    let inertia = -v * 1.6;
    const glide = () => {
      track.scrollLeft += inertia;
      inertia *= .93;
      if (Math.abs(inertia) > .5) requestAnimationFrame(glide);
    };
    glide();
  });
}
const step = () => (track.firstElementChild?.getBoundingClientRect().width || 300) + 28;
$('[data-track-prev]').addEventListener('click', () => track.scrollBy({ left: -step(), behavior: 'smooth' }));
$('[data-track-next]').addEventListener('click', () => track.scrollBy({ left: step(), behavior: 'smooth' }));

/* ---------- Cursore e pulsanti magnetici ---------- */
const cursor = $('[data-cursor]');
const cursorLabel = $('[data-cursor-label]');
let cTarget = { x: -100, y: -100 }, cPos = { ...cTarget };
if (finePointer && !reduced) {
  addEventListener('pointermove', e => { cTarget = { x: e.clientX, y: e.clientY }; cursor.classList.add('on'); }, { passive: true });
  document.addEventListener('pointerleave', () => cursor.classList.remove('on'));
  document.addEventListener('pointerover', e => {
    const withText = e.target.closest('[data-cursor-text]');
    const link = e.target.closest('a, button, select, input, .hotspot');
    cursor.classList.toggle('text', !!withText);
    cursor.classList.toggle('link', !withText && !!link);
    cursorLabel.textContent = withText ? withText.dataset.cursorText : '';
  });
  document.addEventListener('pointermove', e => {
    const m = e.target.closest('.magnetic');
    $$('.magnetic').forEach(b => { if (b !== m) b.style.transform = ''; });
    if (!m) return;
    const r = m.getBoundingClientRect();
    const dx = e.clientX - (r.left + r.width / 2);
    const dy = e.clientY - (r.top + r.height / 2);
    m.style.transform = `translate(${dx * .25}px, ${dy * .35}px)`;
  });
}
function renderCursor() {
  cPos.x = lerp(cPos.x, cTarget.x, .2);
  cPos.y = lerp(cPos.y, cTarget.y, .2);
  cursor.style.transform = `translate3d(${cPos.x}px,${cPos.y}px,0)`;
}

/* ---------- Ciclo unico di animazione ---------- */
let prevY = scrollY, running = true;
function frameLoop() {
  if (!running) return;
  const y = scrollY;
  const dy = y - prevY;
  prevY = y;
  header.classList.toggle('solid', y > 40);
  if (Math.abs(y - lastY) > 6) {
    header.classList.toggle('away', y > lastY && y > vh && !root.classList.contains('menu-open'));
    lastY = y;
  }
  renderHero();
  renderMarquee(dy);
  renderTrackSkew();
  renderMbar();
  if (finePointer) renderCursor();
  requestAnimationFrame(frameLoop);
}
document.addEventListener('visibilitychange', () => {
  running = !document.hidden && !reduced;
  if (running) requestAnimationFrame(frameLoop);
});

function onResize() {
  vw = innerWidth; vh = innerHeight;
  marquees.forEach(m => { m.w = m.row.firstElementChild.offsetWidth; });
}
addEventListener('resize', onResize);
document.fonts?.ready.then(onResize);
onResize();
if (reduced) { renderMbar(); addEventListener('scroll', renderMbar, { passive: true }); }
else requestAnimationFrame(frameLoop);

/* ---------- Foto mancanti: resta il segnaposto colorato ---------- */
function dropBroken(img) {
  if (img.complete && img.naturalWidth === 0) img.remove();
  else img.addEventListener('error', () => img.remove(), { once: true });
}
$$('.ph img').forEach(dropBroken);
new MutationObserver(list => list.forEach(r => r.addedNodes.forEach(n => n.nodeType === 1 && $$('.ph img', n).forEach(dropBroken)))).observe(document.body, { childList: true, subtree: true });

/* ---------- Link WhatsApp ---------- */
$$('[data-wa]').forEach(a => { a.href = waLink(a.dataset.wa); });

/* ---------- Borsa ---------- */
const drawer = $('[data-cart]');
const scrim = $('[data-scrim]');
let lastFocus = null;
function openCart() {
  lastFocus = document.activeElement;
  scrim.hidden = false;
  drawer.classList.add('open');
  drawer.setAttribute('aria-hidden', 'false');
  $('[data-close-cart]').focus();
}
function closeCart() {
  drawer.classList.remove('open');
  drawer.setAttribute('aria-hidden', 'true');
  scrim.hidden = true;
  lastFocus?.focus();
}
$$('[data-open-cart]').forEach(b => b.addEventListener('click', openCart));
$('[data-close-cart]').addEventListener('click', closeCart);
scrim.addEventListener('click', closeCart);
addEventListener('keydown', e => { if (e.key === 'Escape' && drawer.classList.contains('open')) closeCart(); });

const linesEl = $('[data-cart-lines]');
cart.subscribe(c => {
  $('[data-cart-dot]').hidden = c.count === 0;
  $('[data-cart-empty]').hidden = c.count > 0;
  $('[data-cart-foot]').hidden = c.count === 0;
  $('[data-cart-total]').textContent = formatPrice(c.total);
  linesEl.innerHTML = '';
  c.lines.forEach(l => {
    const li = document.createElement('li');
    li.className = 'cart-line';
    li.innerHTML = `
      <div class="ph" style="--tinta:${l.tinta}">${l.image ? `<img src="${l.image}" alt="">` : ''}</div>
      <div>
        <h3></h3>
        <p class="meta">Taglia ${l.size} · ${formatPrice(l.price, l.currency)}</p>
        <div class="qty"><button type="button" aria-label="Diminuisci">−</button><span>${l.qty}</span><button type="button" aria-label="Aumenta">+</button></div>
      </div>`;
    $('h3', li).textContent = l.title;
    const [minus, plus] = $$('.qty button', li);
    minus.addEventListener('click', () => cart.setQty(l.variantId, l.qty - 1));
    plus.addEventListener('click', () => cart.setQty(l.variantId, l.qty + 1));
    linesEl.append(li);
  });
});

$('[data-checkout]').addEventListener('click', async () => {
  const note = $('[data-cart-note]');
  try {
    const res = await cart.checkout();
    if (res.demo) {
      note.hidden = false;
      note.textContent = 'Anteprima: il pagamento si attiva collegando Shopify.';
      return;
    }
    location.href = res.url;
  } catch (err) {
    note.hidden = false;
    note.textContent = 'Non è stato possibile aprire il pagamento. Riprova tra poco.';
    console.error(err);
  }
});

/* ---------- Schede prodotto ---------- */
function productCard(p) {
  const el = document.createElement('article');
  el.className = 'card';
  const available = p.variants.filter(v => v.available);
  el.innerHTML = `
    <div class="card-top">
      <div class="ph" style="--tinta:${p.tinta || '#EAD9CF'}">${p.image ? `<img src="${p.image}" alt="" loading="lazy" draggable="false">` : ''}</div>
      <button class="icon-btn fav" type="button" aria-pressed="${armadio.has(p.id)}" aria-label="Aggiungi all’armadio">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/></svg>
      </button>
      <div class="card-quick">
        <select aria-label="Taglia">${available.map(v => `<option value="${v.id}">${v.title}</option>`).join('')}</select>
        <button class="btn" type="button">Aggiungi</button>
      </div>
    </div>
    <div class="card-row"><h3></h3><span class="price">${formatPrice(p.price, p.currency)}</span></div>`;
  $('h3', el).textContent = p.title;
  $('.card-top .ph', el).addEventListener('click', () => openProduct(p));
  $('h3', el).addEventListener('click', () => openProduct(p));
  $('.card-top .ph', el).style.cursor = 'pointer';
  $('h3', el).style.cursor = 'pointer';
  const fav = $('.fav', el);
  fav.addEventListener('click', () => fav.setAttribute('aria-pressed', armadio.toggle(p.id)));
  if (available.length) {
    $('.card-quick .btn', el).addEventListener('click', () => {
      cart.add(p, p.variants.find(v => v.id === $('select', el).value));
      openCart();
    });
  } else {
    $('.card-quick', el).innerHTML = `<a class="btn" href="${waLink(`Ciao! Il capo "${p.title}" tornerà disponibile?`)}">Chiedi in boutique</a>`;
  }
  return el;
}

/* ---------- Compra il look ---------- */
const LOOK = [
  { handle: 'giacca-sartoriale', x: 44, y: 38 },
  { handle: 'top-raso-pizzo', x: 55, y: 32 },
  { handle: 'gonna-raso', x: 48, y: 70 },
  { handle: 'borsa-pelle-foulard', x: 73, y: 73 }
];
function renderLook(products) {
  const spots = $('[data-hotspots]');
  const list = $('[data-look-list]');
  LOOK.forEach(({ handle, x, y }) => {
    const p = products.find(pr => pr.handle === handle);
    if (!p) return;
    const variant = p.variants.find(v => v.available) || p.variants[0];
    const li = document.createElement('li');
    li.className = 'look-item';
    li.innerHTML = `
      <div class="ph" style="--tinta:${p.tinta || '#EAD9CF'}">${p.image ? `<img src="${p.image}" alt="" loading="lazy">` : ''}</div>
      <div><h3></h3><span class="price">${formatPrice(p.price, p.currency)}</span></div>
      <button class="btn" type="button">Aggiungi</button>`;
    $('h3', li).textContent = p.title;
    $('button', li).addEventListener('click', e => { e.stopPropagation(); cart.add(p, variant); openCart(); });
    li.tabIndex = 0;
    li.setAttribute('role', 'button');
    li.setAttribute('aria-label', `${p.title}, apri la scheda`);
    li.addEventListener('click', () => openProduct(p, LOOK.map(l => l.handle)));
    li.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openProduct(p, LOOK.map(l => l.handle)); } });
    list.append(li);

    const spot = document.createElement('button');
    spot.className = 'hotspot';
    spot.type = 'button';
    spot.style.left = `${x}%`;
    spot.style.top = `${y}%`;
    spot.setAttribute('aria-label', p.title);
    spot.setAttribute('aria-pressed', 'false');
    const activate = () => {
      $$('.hotspot').forEach(s => s.setAttribute('aria-pressed', 'false'));
      $$('.look-item').forEach(i => i.classList.remove('active'));
      spot.setAttribute('aria-pressed', 'true');
      li.classList.add('active');
    };
    spot.addEventListener('click', () => { activate(); openProduct(p, LOOK.map(l => l.handle)); });
    spot.addEventListener('pointerenter', activate);
    spots.append(spot);
  });
}

let catalog = [];
getProducts().then(products => {
  catalog = products;
  products.forEach(p => track.append(productCard(p)));
  renderLook(products);
}).catch(err => console.error('Catalogo non disponibile', err));

/* ---------- Scheda prodotto ---------- */
const pdp = $('[data-pdp]');
const pdpMain = $('[data-pdp-main]');
const pdpSlides = $('[data-pdp-slides]');
const pdpThumbs = $('[data-pdp-thumbs]');
const pdpSizes = $('[data-pdp-sizes]');
const pdpAdd = $('[data-pdp-add]');
const pdpFav = $('[data-pdp-fav]');
const VIEWS = [
  { o: '50% 50%', s: 1 },
  { o: '50% 28%', s: 1.75 },
  { o: '50% 74%', s: 1.75 }
];
let pdpProduct = null, pdpVariant = null;

function goSlide(i) {
  pdpSlides.scrollTo({ left: pdpSlides.clientWidth * i, behavior: reduced ? 'auto' : 'smooth' });
}
function syncThumbs() {
  const i = Math.round(pdpSlides.scrollLeft / Math.max(1, pdpSlides.clientWidth));
  $$('button', pdpThumbs).forEach((b, n) => b.setAttribute('aria-current', n === i));
}
pdpSlides.addEventListener('scroll', () => requestAnimationFrame(syncThumbs), { passive: true });

function openProduct(p, lookHandles = null) {
  pdpProduct = p;
  const tinta = p.tinta || '#EAD9CF';
  $('[data-pdp-type]').textContent = p.productType || '';
  $('[data-pdp-title]').textContent = p.title;
  $('[data-pdp-price]').textContent = formatPrice(p.price, p.currency);
  $('[data-pdp-desc]').textContent = p.description || '';
  $('[data-pdp-details]').textContent = p.description || '';
  pdpMain.classList.remove('zoom');
  pdpSlides.innerHTML = VIEWS.map(v => `
    <div class="pdp-slide" style="--tinta:${tinta}">
      <div style="width:100%;height:100%;transform:scale(${v.s});transform-origin:${v.o}">${p.image ? `<img src="${p.image}" alt="">` : ''}</div>
    </div>`).join('');
  $$('.pdp-slide img', pdpSlides).forEach((img, i) => { img.alt = i === 0 ? p.title : `${p.title}, dettaglio`; });
  pdpThumbs.innerHTML = VIEWS.map((v, i) => `
    <button type="button" aria-label="Foto ${i + 1}" aria-current="${i === 0}">
      <div style="width:100%;height:100%;overflow:hidden;background:${tinta}"><div style="width:100%;height:100%;transform:scale(${v.s});transform-origin:${v.o}">${p.image ? `<img src="${p.image}" alt="">` : ''}</div></div>
    </button>`).join('');
  $$('button', pdpThumbs).forEach((b, i) => b.addEventListener('click', () => goSlide(i)));
  // taglie
  pdpVariant = p.variants.find(v => v.available) || null;
  pdpSizes.innerHTML = '';
  p.variants.forEach(v => {
    const b = document.createElement('button');
    b.type = 'button';
    b.textContent = v.title;
    b.disabled = !v.available;
    b.setAttribute('aria-pressed', v === pdpVariant);
    b.addEventListener('click', () => {
      pdpVariant = v;
      $$('button', pdpSizes).forEach(x => x.setAttribute('aria-pressed', x === b));
      updateTry();
    });
    pdpSizes.append(b);
  });
  pdpAdd.disabled = !pdpVariant;
  pdpAdd.textContent = pdpVariant ? 'Aggiungi alla borsa' : 'Non disponibile online';
  pdpFav.setAttribute('aria-pressed', armadio.has(p.id));
  updateTry();
  // completa il look
  const others = (lookHandles || []).filter(h => h !== p.handle).map(h => catalog.find(c => c.handle === h)).filter(Boolean);
  const lookBox = $('[data-pdp-look]');
  const lookList = $('[data-pdp-look-list]');
  lookBox.hidden = !others.length;
  lookList.innerHTML = '';
  others.forEach(o => {
    const b = document.createElement('button');
    b.type = 'button';
    b.innerHTML = `<div class="ph" style="--tinta:${o.tinta || '#EAD9CF'}">${o.image ? `<img src="${o.image}" alt="">` : ''}</div><span></span><strong>${formatPrice(o.price, o.currency)}</strong>`;
    $('span', b).textContent = o.title;
    b.addEventListener('click', () => { openProduct(o, lookHandles); $('.pdp-info').scrollTop = 0; });
    lookList.append(b);
  });
  $$('img', pdp).forEach(dropBroken);
  if (!pdp.open) {
    pdp.showModal();
    document.body.classList.add('locked');
  }
  requestAnimationFrame(() => { pdpSlides.scrollLeft = 0; syncThumbs(); });
}
function updateTry() {
  const size = pdpVariant ? ` in taglia ${pdpVariant.title}` : '';
  $('[data-pdp-try]').href = waLink(`Ciao! Vorrei provare in boutique "${pdpProduct.title}"${size}.`);
}
pdpAdd.addEventListener('click', () => {
  if (!pdpVariant) return;
  cart.add(pdpProduct, pdpVariant);
  pdp.close();
  openCart();
});
pdpFav.addEventListener('click', () => pdpFav.setAttribute('aria-pressed', armadio.toggle(pdpProduct.id)));
$('[data-pdp-close]').addEventListener('click', () => pdp.close());
pdp.addEventListener('click', e => { if (e.target === pdp) pdp.close(); });
pdp.addEventListener('close', () => document.body.classList.remove('locked'));
// zoom con il mouse
if (finePointer) {
  pdpMain.addEventListener('click', () => pdpMain.classList.toggle('zoom'));
  pdpMain.addEventListener('pointermove', e => {
    if (!pdpMain.classList.contains('zoom')) return;
    const r = pdpMain.getBoundingClientRect();
    $$('.pdp-slide img', pdpMain).forEach(img => {
      img.style.setProperty('--zx', `${((e.clientX - r.left) / r.width) * 100}%`);
      img.style.setProperty('--zy', `${((e.clientY - r.top) / r.height) * 100}%`);
    });
  });
  pdpMain.addEventListener('pointerleave', () => pdpMain.classList.remove('zoom'));
}

/* ---------- Prenotazione prova ---------- */
const booking = $('[data-booking]');
const bookingForm = $('[data-booking-form]');
const bookingGo = $('[data-booking-go]');
const submitBtn = $('button[type="submit"]', bookingForm);
$$('[data-open-booking]').forEach(b => b.addEventListener('click', () => {
  if (PRENOTAZIONI.calendarUrl) { location.href = PRENOTAZIONI.calendarUrl; return; }
  bookingGo.hidden = true;
  submitBtn.hidden = false;
  booking.showModal();
}));
$('[data-close-booking]').addEventListener('click', () => booking.close());
booking.addEventListener('click', e => { if (e.target === booking) booking.close(); });
bookingForm.addEventListener('submit', e => {
  e.preventDefault();
  if (!bookingForm.reportValidity()) return;
  const d = Object.fromEntries(new FormData(bookingForm));
  const mese = d.data ? new Date(`${d.data}-01`).toLocaleDateString('it-IT', { month: 'long', year: 'numeric' }) : 'da definire';
  const testo = `Ciao! Vorrei prenotare una prova abito da sposa.\nNome: ${d.nome}\nTelefono: ${d.telefono}\nMatrimonio: ${mese}\nGiorno preferito: ${d.giorno}${d.note ? `\nNote: ${d.note}` : ''}`;
  bookingGo.href = waLink(testo);
  submitBtn.hidden = true;
  bookingGo.hidden = false;
  bookingGo.focus();
});

/* ---------- Guida sposa ---------- */
$('[data-guida-form]').addEventListener('submit', async e => {
  e.preventDefault();
  const form = e.currentTarget;
  if (NEWSLETTER.endpoint) {
    try { await fetch(NEWSLETTER.endpoint, { method: 'POST', body: new FormData(form) }); } catch (err) { console.error(err); }
  }
  form.hidden = true;
  $('[data-guida-ok]').hidden = false;
});

if (isDemo) root.dataset.demo = '';
