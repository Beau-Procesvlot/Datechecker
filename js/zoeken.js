// Zoeken: zoekbalk, onlangs opgezocht en alle producten per categorie.

let recent = []; // product-id's, nieuwste eerst

// Kleine letters, zonder accenten en leestekens: "Crème-fraîche" → "creme fraiche".
const normaal = s => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9 ]+/g, ' ').trim();

// Aantal tikfouten tussen twee woorden (alleen gebruikt voor korte woorden, dus snel genoeg).
function afstand(a, b) {
  const d = Array.from({ length: a.length + 1 }, (_, i) => [i]);
  for (let j = 1; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    }
  }
  return d[a.length][b.length];
}

// Score: hoe beter het product bij de zoekterm past (0 = niet).
function zoekScore(p, term) {
  const q = normaal(term);
  if (!q) return 0;
  const namen = [p.naam, ...p.zoek].map(normaal);
  if (namen.some(n => n === q)) return 4;
  if (namen.some(n => n.startsWith(q))) return 3;
  if (namen.some(n => n.includes(q))) return 2;
  // Tikfout: één letter verschil mag vanaf 4 letters, twee vanaf 7.
  const max = q.length >= 7 ? 2 : q.length >= 4 ? 1 : 0;
  if (max && namen.some(n => n.split(' ').some(w => afstand(w.slice(0, q.length + 1), q) <= max))) return 1;
  return 0;
}

let filterCat = null; // gekozen categorie-tegel, of null voor alles

// "Kaas, Goudse (jong of belegen)" → titel "Kaas", ondertitel "Goudse (jong of belegen)".
function naamDelen(p) {
  const [titel, ...rest] = p.naam.split(', ');
  return { titel, sub: rest.join(', ') };
}

function productKaart(p) {
  const { titel, sub } = naamDelen(p);
  return `<button class="product-card" data-product="${p.id}" style="--kleur:${p.kleur}">
    ${icoon(p.id, 'card-icon')}
    ${sticker(p)}
    <span class="product-name">${esc(titel)}</span>
    ${sub ? `<span class="product-sub">${esc(sub)}</span>` : ''}
  </button>`;
}

// Twee kolommen om en om: de rechterkolom begint wat lager, zoals een Pinterest-raster.
function raster(lijst) {
  const kolom = rest => `<div class="grid-col">${lijst.filter((_, i) => i % 2 === rest).map(productKaart).join('')}</div>`;
  return `<div class="product-grid">${kolom(0)}${kolom(1)}</div>`;
}

function renderZoeken() {
  const term = $('#search').value;
  const el = $('#search-results');
  if (term.trim()) {
    const hits = PRODUCTEN.map(p => ({ p, s: zoekScore(p, term) })).filter(h => h.s).sort((a, b) => b.s - a.s || a.p.naam.localeCompare(b.p.naam));
    el.innerHTML = hits.length
      ? raster(hits.map(h => h.p))
      : `<div class="empty">${icoon('ghost', 'empty-icon')}<h2>Geen match.</h2><p class="muted">"${esc(term)}" staat er nog niet in. De lijst groeit; probeer een algemener woord, zoals "kaas" of "brood".</p></div>`;
  } else {
    const banner = `<button class="info-banner" id="open-info">
      <span class="info-text"><b>THT of TGT?</b><span>Het verschil bepaalt of je date doorgaat.</span><span class="info-link">Lees hoe het zit</span></span>
      <span class="info-stickers"><span class="sticker tht">THT</span><span class="sticker tgt">TGT</span></span>
    </button>`;
    const tegels = `<div class="section-head"><h2>Categorieën</h2></div>
      <div class="cat-row">${CATEGORIEEN.map(c => `<button class="cat-tile ${filterCat === c.id ? 'on' : ''}" data-cat="${c.id}" style="--kleur:${c.kleur}">
        <span class="cat-icon">${icoon('cat-' + c.id)}</span><span>${c.kort}</span></button>`).join('')}</div>`;
    const recentLijst = recent.map(id => productById(id)).filter(Boolean);
    const recentHTML = recentLijst.length && !filterCat
      ? `<div class="section-head"><h2>Onlangs opgezocht</h2></div>
         <div class="recent-row">${recentLijst.map(p => `<button class="recent-card" data-product="${p.id}" style="--kleur:${p.kleur}">${icoon(p.id)}<span>${esc(naamDelen(p).titel)}</span></button>`).join('')}</div>`
      : '';
    const volgorde = id => CATEGORIEEN.findIndex(c => c.id === id);
    const lijst = PRODUCTEN.filter(p => !filterCat || p.categorie === filterCat).sort((a, b) => volgorde(a.categorie) - volgorde(b.categorie));
    const titel = filterCat ? CATEGORIEEN.find(c => c.id === filterCat).label : 'Alle producten';
    const grid = `<div class="section-head"><h2>${titel}</h2>${filterCat ? '<button class="pill-link" id="clear-cat">Alles tonen</button>' : ''}</div>
      ${raster(lijst)}`;
    el.innerHTML = banner + tegels + recentHTML + grid;
    $('#open-info').onclick = () => $('#info-sheet').showModal();
    el.querySelectorAll('[data-cat]').forEach(b => b.onclick = () => { filterCat = filterCat === b.dataset.cat ? null : b.dataset.cat; renderZoeken(); });
    const clear = $('#clear-cat');
    if (clear) clear.onclick = () => { filterCat = null; renderZoeken(); };
  }
  el.querySelectorAll('[data-product]').forEach(b => b.onclick = () => openProduct(b.dataset.product));
}

async function onthoudRecent(id) {
  recent = [id, ...recent.filter(x => x !== id)].slice(0, 8);
  await DB.setMeta('recent', recent);
}

$('#search').addEventListener('input', renderZoeken);
// Enter op het toetsenbord = eerste resultaat openen.
$('#search').addEventListener('keydown', e => {
  if (e.key !== 'Enter') return;
  const first = $('#search-results [data-product]');
  if (first) { $('#search').blur(); first.click(); }
});

document.addEventListener('DOMContentLoaded', async () => {
  recent = (await DB.getMeta('recent')) || [];
  renderZoeken();
});
