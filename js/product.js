// De productpagina: vragen, de datum, en het oordeel (match, twijfel of ghosten).

let huidig = null; // { p, antw: {vraag: optie}, datum: 'jjjj-mm-dd' of '', weg: Set }

function openProduct(id) {
  const p = productById(id);
  if (!p) return;
  // Elke vraag begint op de eerste keuze, zodat er altijd een situatie is.
  const antw = Object.fromEntries(p.vragen.map(v => [v.id, v.opties[0].id]));
  huidig = { p, antw, datum: '', weg: new Set() };
  renderProduct();
  $('#product-sheet').showModal();
  $('#product-sheet').scrollTop = 0;
  onthoudRecent(id).then(() => { if (!$('#search').value.trim()) renderZoeken(); });
}

const vraagZichtbaar = (v, antw) => !v.alleenAls || Object.entries(v.alleenAls).every(([k, val]) => antw[k] === val);

function huidigeSituatie(p, antw) {
  const zichtbaar = Object.fromEntries(p.vragen.filter(v => vraagZichtbaar(v, antw)).map(v => [v.id, antw[v.id]]));
  return p.situaties.find(s => Object.entries(s.als).every(([k, val]) => zichtbaar[k] === val));
}

// Aantal dagen tussen de gekozen datum en vandaag. Positief = de datum is voorbij.
// Beide als middernacht UTC gelezen, dan telt zomer- of wintertijd niet mee.
const dagenSinds = datum => Math.round((new Date(today()) - new Date(datum)) / 86400000);

function datumTekst(tijd, dagen) {
  const n = Math.abs(dagen);
  // Vanaf twee weken in weken, vanaf twee maanden in maanden: "ruim 3 maanden" leest makkelijker dan "109 dagen".
  const tijdsduur = n >= 60 ? `${n % 30 > 7 ? 'ruim ' : ''}${Math.floor(n / 30)} maanden`
    : n >= 14 ? `${n % 7 > 1 ? 'ruim ' : ''}${Math.floor(n / 7)} weken`
    : `${n} ${n === 1 ? 'dag' : 'dagen'}`;
  if (tijd === 'datum') {
    if (dagen === 0) return 'Dat is vandaag.';
    return dagen < 0 ? `Nog ${tijdsduur} te gaan.` : `${tijdsduur[0].toUpperCase()}${tijdsduur.slice(1)} over de datum.`;
  }
  if (dagen < 0) return 'Die datum ligt in de toekomst.';
  const Tijdsduur = tijdsduur[0].toUpperCase() + tijdsduur.slice(1);
  if (tijd === 'open') return dagen === 0 ? 'Vandaag geopend.' : `${Tijdsduur} open.`;
  return dagen === 0 ? 'Vandaag ingevroren.' : `${Tijdsduur} in de vriezer.`;
}

// Het oordeel. Tekenen van bederf gaan altijd voor de datum.
function oordeel(p, sit, dagen, weg) {
  if (weg.size) return { type: 'ghost', titel: 'Ghosten.', tekst: `Deze date gaat niet door. ${p.wegUitleg}` };
  if (dagen == null) return null;
  const d = Math.max(0, dagen);
  const type = d <= sit.match ? 'match' : d <= sit.twijfel ? 'twijfel' : sit.daarna;
  if (type === 'match') {
    return { type, titel: 'It’s a match!', tekst: dagen <= 0 && sit.tijd === 'datum'
      ? 'Nog binnen de datum. Eet smakelijk.'
      : 'Waarschijnlijk nog goed. Even kijken, ruiken en proeven voor je begint.' };
  }
  if (type === 'twijfel') {
    return { type, titel: 'Eerst goed bekijken.', tekst: d > sit.twijfel
      ? 'Dit is al lang geleden. Vaak niet gevaarlijk, maar wel minder lekker. Check extra goed, of geef het een tweede leven.'
      : 'Het kan nog goed zijn. Loop de punten hieronder na voordat je het eet.' };
  }
  return { type: 'ghost', titel: 'Ghosten.', tekst: p.datum === 'TGT'
    ? 'Deze date gaat niet door. Bij een TGT-datum eet je het na de datum niet meer, ook als het er goed uitziet: bacteriën zie of ruik je niet.'
    : `Deze date gaat niet door. Zo lang erna raden de bronnen het niet meer aan.` };
}

// Bovenste deel: titel, vragen en de datum. Wordt alleen opnieuw getekend als je een vraag beantwoordt.
function renderProduct() {
  const { p, antw } = huidig;
  const sit = huidigeSituatie(p, antw);
  const tijd = TIJD[sit.tijd];
  const cat = CATEGORIEEN.find(c => c.id === p.categorie);
  const d = DATUM_UITLEG[p.datum];
  $('#product-hero').style.setProperty('--kleur', p.kleur);
  $('#product-hero-icon').innerHTML = icoon(p.id, 'hero-icon');

  const vragenHTML = p.vragen.filter(v => vraagZichtbaar(v, antw)).map(v => `
    <p class="label">${esc(v.label)}</p>
    <div class="chips">${v.opties.map(op => `<button class="chip ${antw[v.id] === op.id ? 'on' : ''}" data-vraag="${v.id}" data-optie="${op.id}">${esc(op.label)}</button>`).join('')}</div>`).join('');

  $('#product-body').innerHTML = `
    ${cat && cat.kort !== naamDelen(p).titel ? `<span class="kicker">${cat.label}</span>` : ''}
    <h2 class="product-title">${esc(naamDelen(p).titel)}</h2>
    ${naamDelen(p).sub ? `<p class="product-sub-title">${esc(naamDelen(p).sub)}</p>` : ''}
    <div class="date-type"><span class="sticker ${p.datum.toLowerCase()}">${p.datum}</span><p><b>${d.kort}.</b> ${d.uitleg}</p></div>

    ${vragenHTML}

    <p class="label">${tijd.vraag}</p>
    <div class="date-row">
      <input type="date" id="p-datum" class="date-input" value="${huidig.datum}" ${tijd.verleden ? `max="${today()}"` : ''}>
      <button class="chip" id="p-vandaag">Vandaag</button>
    </div>
    <p class="date-feedback" id="p-datum-tekst"></p>

    <div id="p-oordeel"></div>`;

  const body = $('#product-body');
  body.querySelectorAll('[data-vraag]').forEach(b => b.onclick = () => {
    huidig.antw[b.dataset.vraag] = b.dataset.optie;
    // Andere soort datum (bijvoorbeeld "ingevroren op" in plaats van de datum op de verpakking)? Dan opnieuw invullen.
    if (huidigeSituatie(p, huidig.antw).tijd !== sit.tijd) huidig.datum = '';
    renderProduct();
  });
  // 'change' en niet 'input': anders verspringt alles terwijl je nog een jaartal aan het typen bent.
  $('#p-datum').addEventListener('change', e => { huidig.datum = e.target.value; renderOordeel(); });
  $('#p-vandaag').onclick = () => { huidig.datum = today(); $('#p-datum').value = huidig.datum; renderOordeel(); };
  renderOordeel();
}

// Onderste deel: het oordeel en alles wat daarbij hoort. Opnieuw getekend bij elke nieuwe datum of aangetikt bederf.
function renderOordeel() {
  const { p, antw, datum, weg } = huidig;
  const sit = huidigeSituatie(p, antw);
  const dagen = datum ? dagenSinds(datum) : null;
  const o = oordeel(p, sit, dagen, weg);
  $('#p-datum-tekst').textContent = dagen == null ? '' : datumTekst(sit.tijd, dagen);

  const oordeelHTML = o
    ? `<div class="verdict ${o.type}" id="verdict">${icoon(o.type, 'verdict-icon')}<div><strong>${o.titel}</strong><p>${esc(o.tekst)}</p></div></div>`
    : `<div class="verdict leeg" id="verdict"><p>Vul de datum in, dan zie je of je date doorgaat.</p></div>`;

  const bronnen = `<p class="source">Bron: ${p.bron.map(b => `<a href="${b.url}" target="_blank" rel="noopener">${esc(b.naam)}</a>`).join(' · ')}</p>`;

  // Vlees en vis na de TGT-datum: geen verdere vragen of checks, het antwoord is gewoon nee.
  if (o?.type === 'ghost' && p.datum === 'TGT' && !weg.size) {
    $('#p-oordeel').innerHTML = `${oordeelHTML}
      <h3>Volgende keer</h3><p>${esc(p.tip)}</p>
      ${bronnen}`;
    return;
  }

  const tweedeLeven = p.tweedeLeven.length
    ? `<details class="fold"><summary>Niet je type meer?</summary><p class="muted small">Niet meer lekker, wel nog goed? Geef het een tweede kans:</p><ul class="ideas">${p.tweedeLeven.map(t => `<li>${esc(t)}</li>`).join('')}</ul></details>`
    : '';

  $('#p-oordeel').innerHTML = `${oordeelHTML}
    <p class="rule">${esc(sit.houdbaar)}</p>

    <p class="label">Merk je iets hiervan? <span class="muted">Dan altijd weg</span></p>
    <div class="chips">${p.weg.map((w, i) => `<button class="chip warn ${weg.has(i) ? 'on' : ''}" data-weg="${i}">${esc(w)}</button>`).join('')}</div>

    <details class="fold" ${o?.type === 'twijfel' ? 'open' : ''}><summary>Check dit eerst</summary><ul class="checks">${p.check.map(c => `<li>${esc(c)}</li>`).join('')}</ul></details>
    <details class="fold"><summary>Bewaartip</summary><p>${esc(p.tip)}</p></details>
    ${tweedeLeven}

    <p class="disclaimer">Een inschatting, geen garantie: jij beslist. Twijfel je? Niet doen. Zwanger, of eet je voor een baby, peuter of iemand met weinig weerstand? Houd je dan aan de datum.</p>
    ${bronnen}`;

  $('#p-oordeel').querySelectorAll('[data-weg]').forEach(b => b.onclick = () => {
    const i = +b.dataset.weg;
    if (huidig.weg.has(i)) huidig.weg.delete(i); else huidig.weg.add(i);
    renderOordeel();
  });
  if (o) $('#verdict').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

$('#product-back').onclick = () => $('#product-sheet').close();
