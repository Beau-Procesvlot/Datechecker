// De productpagina: vragen, hoe lang over de datum, en het oordeel (match, twijfel of ghosten).

let huidig = null; // { p, antw: {vraag: optie}, dagen: getal of null, weg: Set }

function openProduct(id) {
  const p = productById(id);
  if (!p) return;
  // Elke vraag begint op de eerste keuze, zodat er altijd een situatie is.
  const antw = Object.fromEntries(p.vragen.map(v => [v.id, v.opties[0].id]));
  huidig = { p, antw, dagen: null, weg: new Set() };
  renderProduct();
  $('#product-sheet').showModal();
  $('#product-body').scrollTop = 0;
  onthoudRecent(id).then(() => { if (!$('#search').value.trim()) renderZoeken(); });
}

const vraagZichtbaar = (v, antw) => !v.alleenAls || Object.entries(v.alleenAls).every(([k, val]) => antw[k] === val);

function huidigeSituatie(p, antw) {
  const zichtbaar = Object.fromEntries(p.vragen.filter(v => vraagZichtbaar(v, antw)).map(v => [v.id, antw[v.id]]));
  return p.situaties.find(s => Object.entries(s.als).every(([k, val]) => zichtbaar[k] === val));
}

// Het oordeel. Tekenen van bederf gaan altijd voor de datum.
function oordeel(p, sit, dagen, weg) {
  if (weg.size) return { type: 'ghost', titel: 'Ghosten.', tekst: `Deze date gaat niet door. ${p.wegUitleg}` };
  if (dagen == null) return null;
  const type = dagen <= sit.match ? 'match' : dagen <= sit.twijfel ? 'twijfel' : sit.daarna;
  if (type === 'match') {
    return { type, titel: 'It’s a match!', tekst: p.datum === 'TGT' || dagen === 0 ? 'Nog binnen de tijd. Eet smakelijk, en check even de punten hieronder.' : 'Waarschijnlijk nog goed. Even kijken, ruiken en proeven voor je begint.' };
  }
  if (type === 'twijfel') {
    const ver = dagen > sit.twijfel;
    return { type, titel: 'Eerst goed bekijken.', tekst: ver
      ? 'Dit is al lang geleden. Vaak niet gevaarlijk, maar wel minder lekker. Check extra goed, of geef het een tweede leven.'
      : 'Het kan nog goed zijn. Loop de punten hieronder na voordat je het eet.' };
  }
  return { type: 'ghost', titel: 'Ghosten.', tekst: p.datum === 'TGT'
    ? 'Deze date gaat niet door. Bij een TGT-datum eet je het daarna niet meer, ook als het er goed uitziet: bacteriën zie of ruik je niet.'
    : `Deze date gaat niet door. ${sit.houdbaar}` };
}

function renderProduct() {
  const { p, antw, dagen, weg } = huidig;
  const sit = huidigeSituatie(p, antw);
  const tijd = TIJD[sit.tijd];
  const o = oordeel(p, sit, dagen, weg);
  const cat = CATEGORIEEN.find(c => c.id === p.categorie);
  const d = DATUM_UITLEG[p.datum];

  const vragenHTML = p.vragen.filter(v => vraagZichtbaar(v, antw)).map(v => `
    <p class="label">${esc(v.label)}</p>
    <div class="chips">${v.opties.map(op => `<button class="chip ${antw[v.id] === op.id ? 'on' : ''}" data-vraag="${v.id}" data-optie="${op.id}">${esc(op.label)}</button>`).join('')}</div>`).join('');

  const tijdHTML = `
    <p class="label">${tijd.vraag}</p>
    <div class="chips">${tijd.opties.map(op => `<button class="chip ${dagen === op.dagen ? 'on' : ''}" data-dagen="${op.dagen}">${op.label}</button>`).join('')}</div>`;

  const oordeelHTML = o
    ? `<div class="verdict ${o.type}" id="verdict"><strong>${o.titel}</strong><p>${esc(o.tekst)}</p></div>`
    : `<div class="verdict leeg" id="verdict"><p>Kies hierboven hoe lang, dan zie je of je date doorgaat.</p></div>`;

  const tweedeLeven = p.tweedeLeven.length
    ? `<h3>Niet je type meer?</h3><p class="muted small">Niet meer lekker, wel nog goed? Geef het een tweede kans:</p><ul class="ideas">${p.tweedeLeven.map(t => `<li>${esc(t)}</li>`).join('')}</ul>`
    : p.tweedeLevenNee ? `<h3>Niet je type meer?</h3><p class="muted small">${esc(p.tweedeLevenNee)}</p>` : '';

  $('#product-body').innerHTML = `
    <span class="brand">${cat ? cat.label : ''}</span>
    <h2 class="product-title">${esc(p.naam)}</h2>
    <div class="date-type"><span class="sticker ${p.datum.toLowerCase()}">${p.datum}</span><p><b>${d.kort}.</b> ${d.uitleg}</p></div>

    ${vragenHTML}
    ${tijdHTML}

    ${oordeelHTML}
    <p class="rule">${esc(sit.houdbaar)}</p>

    <p class="label">Merk je iets hiervan? <span class="muted">Dan altijd weg</span></p>
    <div class="chips">${p.weg.map((w, i) => `<button class="chip warn ${weg.has(i) ? 'on' : ''}" data-weg="${i}">${esc(w)}</button>`).join('')}</div>

    <h3>Check dit eerst</h3>
    <ul class="checks">${p.check.map(c => `<li>${esc(c)}</li>`).join('')}</ul>

    <h3>Bewaartip</h3>
    <p>${esc(p.tip)}</p>

    ${tweedeLeven}

    <p class="disclaimer">Een inschatting, geen garantie: jij beslist. Twijfel je? Niet doen. Zwanger, of eet je voor een baby, peuter of iemand met weinig weerstand? Houd je dan aan de datum.</p>
    <p class="source">Bron: ${[...p.bron, ALGEMENE_BRON].map(b => `<a href="${b.url}" target="_blank" rel="noopener">${esc(b.naam)}</a>`).join(' · ')}</p>`;

  const body = $('#product-body');
  body.querySelectorAll('[data-vraag]').forEach(b => b.onclick = () => {
    huidig.antw[b.dataset.vraag] = b.dataset.optie;
    // Andere situatie = andere tijdvraag: dan opnieuw laten kiezen.
    if (huidigeSituatie(p, huidig.antw).tijd !== sit.tijd) huidig.dagen = null;
    renderProduct();
  });
  body.querySelectorAll('[data-dagen]').forEach(b => b.onclick = () => {
    huidig.dagen = +b.dataset.dagen;
    renderProduct();
    $('#verdict').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });
  body.querySelectorAll('[data-weg]').forEach(b => b.onclick = () => {
    const i = +b.dataset.weg;
    if (huidig.weg.has(i)) huidig.weg.delete(i); else huidig.weg.add(i);
    renderProduct();
  });
}
