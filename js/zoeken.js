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

function productKaart(p) {
  return `<button class="product-card" data-product="${p.id}">
    <span class="product-name">${esc(p.naam)}</span>
    <span class="sticker ${p.datum.toLowerCase()}">${p.datum}</span>
  </button>`;
}

function renderZoeken() {
  const term = $('#search').value;
  const el = $('#search-results');
  if (term.trim()) {
    const hits = PRODUCTEN.map(p => ({ p, s: zoekScore(p, term) })).filter(h => h.s).sort((a, b) => b.s - a.s || a.p.naam.localeCompare(b.p.naam));
    el.innerHTML = hits.length
      ? `<div class="product-list">${hits.map(h => productKaart(h.p)).join('')}</div>`
      : `<div class="empty"><h2>Geen match.</h2><p class="muted">"${esc(term)}" staat er nog niet in. De lijst groeit; probeer een algemener woord, zoals "kaas" of "brood".</p></div>`;
  } else {
    const recentHTML = recent.length
      ? `<p class="label">Onlangs opgezocht</p><div class="chips">${recent.map(id => productById(id)).filter(Boolean).map(p => `<button class="chip" data-product="${p.id}">${esc(p.naam)}</button>`).join('')}</div>`
      : '';
    const perCategorie = CATEGORIEEN.map(c => {
      const lijst = PRODUCTEN.filter(p => p.categorie === c.id);
      return lijst.length ? `<p class="label">${c.label}</p><div class="product-list">${lijst.map(productKaart).join('')}</div>` : '';
    }).join('');
    el.innerHTML = recentHTML + perCategorie;
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
