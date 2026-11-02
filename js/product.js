// De productpagina: vragen, de datum, en het oordeel (match, twijfel of ghosten).

let huidig = null; // { p, antw: {vraag: optie}, datum: 'jjjj-mm-dd' of '', weg: Set }

function openProduct(id) {
  const p = productById(id);
  if (!p) return;
  // Elke vraag begint op de eerste keuze, zodat er altijd een situatie is.
  const antw = Object.fromEntries(p.vragen.map(v => [v.id, v.opties[0].id]));
  huidig = { p, antw, datum: '', weg: new Set(), vraagGetoond: false, besluit: null, checkId: null };
  renderProduct();
  if (!$('#product-sheet').open) $('#product-sheet').showModal();
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
  const tijdsduur = n >= 60 ? `${n % 30 > 7 ? 'just over ' : ''}${Math.floor(n / 30)} months`
    : n >= 14 ? `${n % 7 > 1 ? 'just over ' : ''}${Math.floor(n / 7)} weeks`
    : `${n} ${n === 1 ? 'day' : 'days'}`;
  if (tijd === 'datum') {
    if (dagen === 0) return 'That’s today.';
    return dagen < 0 ? `${tijdsduur[0].toUpperCase()}${tijdsduur.slice(1)} to go.` : `${tijdsduur[0].toUpperCase()}${tijdsduur.slice(1)} past the date.`;
  }
  if (dagen < 0) return 'That date is in the future.';
  if (tijd === 'open') return dagen === 0 ? 'Opened today.' : `Open for ${tijdsduur}.`;
  if (tijd === 'gekocht') return dagen === 0 ? 'Bought today.' : `Bought ${tijdsduur} ago.`;
  if (tijd === 'gekookt') return dagen === 0 ? 'Cooked today.' : `Cooked ${tijdsduur} ago.`;
  return dagen === 0 ? 'Frozen today.' : `In the freezer for ${tijdsduur}.`;
}

// Het oordeel. Tekenen van bederf gaan altijd voor de datum.
// Bij producten waar het per merk verschilt, kiest de gebruiker welke datum erop staat.
const echteDatum = (p, antw = {}) => p.datum === 'kies' ? (antw.soort === 'tgt' ? 'TGT' : 'THT') : p.datum;

function oordeel(p, sit, dagen, weg, antw) {
  if (weg.size) return { type: 'ghost', titel: 'Ghosted.', tekst: `This date is off. ${p.wegUitleg}` };
  if (dagen == null) return null;
  const d = Math.max(0, dagen);
  const type = d <= sit.match ? 'match' : d <= sit.twijfel ? 'twijfel' : sit.daarna;
  if (type === 'match') {
    return { type, titel: 'It’s a match!', tekst: dagen <= 0 && sit.tijd === 'datum'
      ? 'Still within the date. Enjoy your meal.'
      : 'Probably still good. Just look, smell and taste before you dig in.' };
  }
  if (type === 'twijfel') {
    return { type, titel: 'Take a closer look.', tekst: d > sit.twijfel
      ? 'That’s quite a while ago. Often not dangerous, but less tasty. Check extra carefully, or give it a second chance.'
      : 'It may still be good. Go through the points below before you eat it.' };
  }
  if (sit.ghostTekst) return { type: 'ghost', titel: 'Ghosted.', tekst: `This date is off. ${sit.ghostTekst}` };
  return { type: 'ghost', titel: 'Ghosted.', tekst: echteDatum(p, antw) === 'TGT'
    ? 'This date is off. With a “use by” date you don’t eat it after the date, even if it looks fine: you can’t see or smell bacteria.'
    : `This date is off. The sources don’t recommend eating it this long after.` };
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
    <div class="date-type">${sticker(p)}<p>${['THT', 'TGT'].includes(p.datum) ? '' : `<b>${d.kort}.</b> `}${d.uitleg}</p></div>
    ${eigenProductBanner(p)}

    ${vragenHTML}

    <p class="label">${tijd.vraag}</p>
    <div class="date-row">
      <input type="date" id="p-datum" class="date-input" value="${huidig.datum}" ${tijd.verleden ? `max="${today()}"` : ''}>
      <button class="chip" id="p-vandaag">Today</button>
    </div>
    <p class="date-feedback" id="p-datum-tekst"></p>

    <div id="p-oordeel"></div>`;

  koppelEigenProduct(p);
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
  const o = oordeel(p, sit, dagen, weg, antw);
  $('#p-datum-tekst').textContent = dagen == null ? '' : datumTekst(sit.tijd, dagen);

  const oordeelHTML = o
    ? `<div class="verdict ${o.type}" id="verdict">${icoon(o.type, 'verdict-icon')}<div><strong>${o.titel}</strong><p>${esc(o.tekst)}</p></div></div>`
    : `<div class="verdict leeg" id="verdict"><p>Enter the date to see if your date is still on.</p></div>`;

  const bronnen = `<p class="source">Source: ${p.bron.map(b => `<a href="${b.url}" target="_blank" rel="noopener">${esc(b.naam)}</a>`).join(' · ')}</p>`;

  // Vlees en vis na de TGT-datum: geen verdere vragen of checks, het antwoord is gewoon nee.
  if (o?.type === 'ghost' && echteDatum(p, antw) === 'TGT' && !weg.size) {
    huidig.vraagGetoond = false;
    $('#p-oordeel').innerHTML = `${oordeelHTML}
      <h3>Next time</h3><p>${esc(p.tip)}</p>
      ${bronnen}`;
    return;
  }

  const tweedeLeven = p.tweedeLeven.length
    ? `<details class="fold"><summary>Not your type anymore?</summary><p class="muted small">Past its best but still good? Give it a second chance:</p><ul class="ideas">${p.tweedeLeven.map(t => `<li>${esc(t)}</li>`).join('')}</ul>${receptKnoppen(p.id)}</details>`
    : '';

  $('#p-oordeel').innerHTML = `${oordeelHTML}
    <p class="rule">${esc(sit.houdbaar)}${sit.geenTermijn ? ' <b>The sources don’t give a fixed period after the date here: look, smell and taste.</b>' : ''}</p>
    ${eetVraagHTML(o)}

    <p class="label">Notice any of these? <span class="muted">Then always bin it</span></p>
    <div class="chips">${p.weg.map((w, i) => `<button class="chip warn ${weg.has(i) ? 'on' : ''}" data-weg="${i}">${esc(w)}</button>`).join('')}</div>

    <details class="fold" ${o?.type === 'twijfel' ? 'open' : ''}><summary>Check this first</summary><ul class="checks">${p.check.map(c => `<li>${esc(c)}</li>`).join('')}</ul></details>
    <details class="fold"><summary>Storage tip</summary><p>${esc(p.tip)}</p></details>
    ${tweedeLeven}

    <p class="disclaimer">An estimate, not a guarantee: you decide. In doubt? Don’t. Pregnant, or eating for a baby, toddler or someone with low immunity? Then stick to the date.</p>
    ${bronnen}`;

  const eetKnop = $('#eet-ja'), weggooiKnop = $('#eet-nee');
  if (eetKnop) eetKnop.onclick = () => besluit('opgegeten');
  if (weggooiKnop) weggooiKnop.onclick = () => besluit('weg');
  $('#p-oordeel').querySelectorAll('[data-recept]').forEach(b => b.onclick = () => openRecept(b.dataset.recept));
  $('#p-oordeel').querySelectorAll('[data-weg]').forEach(b => b.onclick = () => {
    const i = +b.dataset.weg;
    if (huidig.weg.has(i)) huidig.weg.delete(i); else huidig.weg.add(i);
    renderOordeel();
  });
  if (o) $('#verdict').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

$('#product-back').onclick = () => $('#product-sheet').close();

// ---------- Is deze date doorgegaan? ----------
// Alleen bij een match of twijfel: dan kan het nog opgegeten worden, en telt het mee voor de teller.
function eetVraagHTML(o) {
  const tonen = o && (o.type === 'match' || o.type === 'twijfel');
  huidig.vraagGetoond = tonen;
  if (!tonen) return '';
  if (huidig.besluit === 'opgegeten') return `<div class="eat-box done">${icoon('match', 'eat-icon')}<p><b>Saved!</b> Counts towards the total: ± ${kg(gewichtVan(huidig.p, huidig.antw.open === 'open'))} kg less wasted.</p></div>${steunHTML(true)}`;
  if (huidig.besluit === 'weg') return `<div class="eat-box"><p>Thrown away. Too bad, better luck next time!</p></div>`;
  return `<div class="eat-box">
    <p><b>Did this date happen?</b> Let us know, so it counts towards the total.</p>
    <div class="row"><button class="btn primary" id="eet-ja">I’m eating it</button><button class="btn" id="eet-nee">Threw it away</button></div>
  </div>`;
}

async function besluit(status) {
  huidig.besluit = status;
  const check = await legVast(huidig.p, huidig.antw.open === 'open', status, huidig.checkId);
  huidig.checkId = check.id;
  if (status === 'opgegeten') toast(`Saved! ± ${kg(check.gram)} kg less wasted`);
  renderOordeel();
}

// Pagina dicht zonder te kiezen? Dan vraagt het beginscherm het later nog eens.
$('#product-sheet').addEventListener('close', () => {
  if (huidig?.vraagGetoond && !huidig.besluit) {
    huidig.besluit = 'later'; // maar één keer onthouden, ook als 'close' vaker afgaat
    onthoudOpenCheck(huidig.p, huidig.antw.open === 'open');
  }
});
