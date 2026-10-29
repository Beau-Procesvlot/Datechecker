// Datechecker Plus en de steunknop.
//
// - Steunen: een Stripe-betaallink waar je zelf het bedrag kiest. Geen ontgrendeling, gewoon een bedankje.
// - Plus (eenmalig): eigen producten (met de regels van een bestaande groep, "lijkt op…") en eigen recepten.
//   Na betalen stuurt Stripe je terug naar de app met ?plus=<sessie-id>. De teller (Cloudflare) controleert bij
//   Stripe of er echt betaald is en geeft een ontgrendelcode. Met die code zet je Plus terug op een nieuwe telefoon.
// - Alles wat je zelf toevoegt, blijft op je eigen telefoon (en in je back-up).
//
// De basis blijft altijd gratis: opzoeken of je eten nog goed is, kost nooit geld.

// Stripe Payment Links. Leeg = nog niet ingesteld: dan staat er "binnenkort".
const STEUN_URL = '';
const PLUS_URL = '';
const PLUS_PRIJS = '€2,99';

const plus = {
  code: null,          // ontgrendelcode, of null
  producten: [],       // { id, naam, lijktOp, zoek: [], notitie }
  recepten: [],        // { id, titel, ingredienten: [], stappen: [], redt: [] }
};
const heeftPlus = () => !!plus.code;

async function bewaarPlus() {
  await DB.setMeta('plus', { code: plus.code, producten: plus.producten, recepten: plus.recepten });
}

// ---------- Eigen producten en recepten in de app zetten ----------
// Een eigen product is een kopie van de gekozen groep, met jouw naam en notitie. De regels (termijnen,
// checks, wanneer weg) komen dus altijd uit de gecontroleerde groep.
function maakEigenProduct(e) {
  const t = productById(e.lijktOp);
  if (!t) return null;
  ICONEN[e.id] = ICONEN[t.id];
  GEWICHT[e.id] = GEWICHT[t.id] || 300;
  return {
    ...t, id: e.id, naam: e.naam, zoek: [e.naam, ...e.zoek, ...t.zoek],
    eigen: true, sjabloon: t.id, notitie: e.notitie || '',
  };
}

function maakEigenRecept(e) {
  const eerste = e.redt.map(productById).find(Boolean);
  return {
    id: e.id, titel: e.titel, tijd: '', icoon: eerste ? eerste.id : 'restjes', kleur: '#e3f1df',
    redt: e.redt, intro: 'Jouw eigen recept.', ingredienten: e.ingredienten, stappen: e.stappen, eigen: true,
  };
}

// Opnieuw opbouwen: eerst alle eigen dingen eruit, dan de huidige erin.
function zetEigenInApp() {
  for (let i = PRODUCTEN.length - 1; i >= 0; i--) if (PRODUCTEN[i].eigen) PRODUCTEN.splice(i, 1);
  for (let i = RECEPTEN.length - 1; i >= 0; i--) if (RECEPTEN[i].eigen) RECEPTEN.splice(i, 1);
  if (!heeftPlus()) return;
  for (const e of plus.producten) { const p = maakEigenProduct(e); if (p) PRODUCTEN.push(p); }
  for (const e of plus.recepten) RECEPTEN.push(maakEigenRecept(e));
}

// ---------- Ontgrendelen ----------
async function controleerPlus(body) {
  const res = await fetch(`${TELLER_URL}/plus`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
  });
  return { ok: res.ok, data: await res.json().catch(() => ({})) };
}

async function activeerPlus(code) {
  plus.code = code;
  await bewaarPlus();
  zetEigenInApp();
  renderZoeken();
  if (!$('#tab-instellingen').classList.contains('hidden')) renderSettings();
}

// Terug van Stripe: ?plus=<sessie> (net betaald) of ?bedankt=1 (gesteund).
async function verwerkTerugkomst() {
  const q = new URLSearchParams(location.search);
  if (!q.has('plus') && !q.has('bedankt')) return;
  history.replaceState(null, '', location.pathname);
  if (q.has('bedankt')) { toast('Dankjewel voor je steun! 💚'); return; }
  try {
    const { ok, data } = await controleerPlus({ sessie: q.get('plus') });
    if (ok && data.code) {
      await activeerPlus(data.code);
      openPlusSheet(true);
    } else {
      toast('Betaling nog niet gevonden. Probeer het zo nog eens via Instellingen.');
    }
  } catch {
    toast('Geen internet: activeer Plus straks via Instellingen.');
  }
}

// ---------- Plus-scherm ----------
function openPlusSheet(netGekocht = false) {
  const body = $('#plus-body');
  if (heeftPlus()) {
    body.innerHTML = `
      <div class="plus-hero">${icoon('match', 'plus-hero-icon')}</div>
      <h2 class="sheet-title">${netGekocht ? 'It’s a match! Plus is van jou.' : 'Je hebt Datechecker Plus'}</h2>
      <p>Je kunt nu eigen producten en eigen recepten toevoegen. Dankjewel dat je Datechecker steunt!</p>
      <div class="plus-code"><span>Jouw code</span><b>${esc(plus.code)}</b></div>
      <p class="muted small">Bewaar deze code. Daarmee zet je Plus terug op een nieuwe telefoon. Hij staat ook in je back-up.</p>
      <button class="btn primary" id="plus-sluit">Aan de slag</button>`;
    $('#plus-sluit').onclick = () => $('#plus-sheet').close();
  } else {
    body.innerHTML = `
      <div class="plus-hero">${icoon('restjes', 'plus-hero-icon')}</div>
      <span class="kicker">Eenmalig ${PLUS_PRIJS} · geen abonnement</span>
      <h2 class="sheet-title">Datechecker Plus</h2>
      <ul class="plus-lijst">
        <li><b>Eigen producten.</b> Staat iets er niet in? Voeg het toe en kies waar het op lijkt. Dan krijg je de gecontroleerde regels van die groep.</li>
        <li><b>Eigen recepten.</b> Bewaar je eigen reddingsrecepten en koppel ze aan je producten.</li>
        <li><b>Je steunt de maker.</b> Opzoeken of je eten nog goed is, blijft voor iedereen gratis.</li>
      </ul>
      ${PLUS_URL
        ? `<a class="btn primary" href="${PLUS_URL}" target="_blank" rel="noopener">Koop Plus voor ${PLUS_PRIJS}</a>
           <p class="muted small plus-legal">Je betaalt veilig via Stripe. Plus werkt meteen na het betalen; daarom vervalt je herroepingsrecht. Zie de <a href="voorwaarden.html" target="_blank" rel="noopener">voorwaarden</a>.</p>`
        : `<button class="btn primary" disabled>Binnenkort te koop</button>`}
      <details class="fold">
        <summary>Heb je al een code?</summary>
        <div class="plus-code-form">
          <input type="text" id="plus-code-input" placeholder="Bijvoorbeeld ABCD2345" autocomplete="off" autocapitalize="characters" maxlength="12">
          <button class="btn small primary" id="plus-code-knop">Activeer</button>
        </div>
      </details>`;
    $('#plus-code-knop').onclick = async () => {
      const code = $('#plus-code-input').value.trim();
      if (!code) return;
      try {
        const { ok, data } = await controleerPlus({ code });
        if (ok && data.code) { await activeerPlus(data.code); openPlusSheet(true); }
        else toast(data.fout === 'te veel pogingen vandaag' ? 'Te veel pogingen. Probeer het morgen weer.' : 'Deze code kennen we niet.');
      } catch { toast('Geen internet. Probeer het straks nog eens.'); }
    };
  }
  if (!$('#plus-sheet').open) $('#plus-sheet').showModal();
  body.scrollTop = 0;
}

// ---------- Eigen product: formulier ----------
function sjabloonOpties(gekozen) {
  return CATEGORIEEN.map(c => {
    const lijst = PRODUCTEN.filter(p => !p.eigen && p.categorie === c.id);
    return lijst.length ? `<optgroup label="${esc(c.label)}">${lijst.map(p => `<option value="${p.id}" ${p.id === gekozen ? 'selected' : ''}>${esc(p.naam)}</option>`).join('')}</optgroup>` : '';
  }).join('');
}

function openEigenProduct(id = null) {
  if (!heeftPlus()) return openPlusSheet();
  const e = plus.producten.find(x => x.id === id) || { naam: '', lijktOp: '', zoek: [], notitie: '' };
  $('#eigen-body').innerHTML = `
    <span class="kicker">Datechecker Plus</span>
    <h2 class="sheet-title">${id ? 'Eigen product aanpassen' : 'Eigen product toevoegen'}</h2>
    <p class="label">Naam</p>
    <input type="text" id="e-naam" maxlength="40" placeholder="Bijvoorbeeld: kwark van de markt" value="${esc(e.naam)}">
    <p class="label">Lijkt op</p>
    <select id="e-sjabloon" class="select"><option value="">Kies een productgroep…</option>${sjabloonOpties(e.lijktOp)}</select>
    <p class="muted small">Datechecker gebruikt de gecontroleerde regels van deze groep. Twijfel je? Kies de groep die het meest lijkt, of de strengste.</p>
    <p class="label">Extra zoekwoorden <span class="muted">(niet verplicht)</span></p>
    <input type="text" id="e-zoek" maxlength="80" placeholder="Gescheiden door komma’s" value="${esc(e.zoek.join(', '))}">
    <p class="label">Notitie <span class="muted">(niet verplicht)</span></p>
    <textarea id="e-notitie" maxlength="300" rows="3" placeholder="Bijvoorbeeld: zelf ingevroren in porties">${esc(e.notitie)}</textarea>
    <button class="btn primary" id="e-bewaar">Bewaren</button>`;
  $('#e-bewaar').onclick = async () => {
    const naam = $('#e-naam').value.trim();
    const lijktOp = $('#e-sjabloon').value;
    if (!naam || !lijktOp) { toast('Vul een naam in en kies waar het op lijkt'); return; }
    const nieuw = {
      id: id || 'eigen-' + newId(), naam, lijktOp,
      zoek: $('#e-zoek').value.split(',').map(s => s.trim()).filter(Boolean),
      notitie: $('#e-notitie').value.trim(),
    };
    plus.producten = [...plus.producten.filter(x => x.id !== nieuw.id), nieuw];
    await bewaarPlus();
    zetEigenInApp();
    renderZoeken();
    $('#eigen-sheet').close();
    toast(id ? 'Aangepast' : `${naam} toegevoegd`);
    if ($('#product-sheet').open) openProduct(nieuw.id);
  };
  $('#eigen-sheet').showModal();
}

// Blok bovenaan de productpagina van een eigen product.
function eigenProductBanner(p) {
  if (!p.eigen) return '';
  const t = productById(p.sjabloon);
  return `<div class="eigen-banner">
    <p><b>Jouw eigen product.</b> Gebruikt de regels van <i>${esc(t ? t.naam : 'een productgroep')}</i>, niet apart gecontroleerd door Datechecker.</p>
    ${p.notitie ? `<p class="eigen-notitie">${esc(p.notitie)}</p>` : ''}
    <div class="row"><button class="btn small" id="eigen-bewerk">Aanpassen</button><button class="btn small danger" id="eigen-weg">Verwijderen</button></div>
  </div>`;
}

function koppelEigenProduct(p) {
  if (!p.eigen) return;
  $('#eigen-bewerk').onclick = () => openEigenProduct(p.id);
  $('#eigen-weg').onclick = async () => {
    if (!confirm(`${p.naam} verwijderen?`)) return;
    plus.producten = plus.producten.filter(x => x.id !== p.id);
    await bewaarPlus();
    zetEigenInApp();
    $('#product-sheet').close();
    renderZoeken();
    toast('Verwijderd');
  };
}

// ---------- Eigen recept: formulier ----------
function openEigenRecept(id = null) {
  if (!heeftPlus()) return openPlusSheet();
  const e = plus.recepten.find(x => x.id === id) || { titel: '', ingredienten: [], stappen: [], redt: [] };
  // Vlees en vis krijgen geen tweede leven, ook niet in eigen recepten.
  const kies = PRODUCTEN.filter(p => p.categorie !== 'vlees');
  const gekozen = new Set(e.redt);
  $('#eigen-body').innerHTML = `
    <span class="kicker">Datechecker Plus</span>
    <h2 class="sheet-title">${id ? 'Eigen recept aanpassen' : 'Eigen recept toevoegen'}</h2>
    <p class="label">Naam van het recept</p>
    <input type="text" id="r-titel" maxlength="50" placeholder="Bijvoorbeeld: oma’s broodpudding" value="${esc(e.titel)}">
    <p class="label">Je hebt nodig <span class="muted">(één per regel)</span></p>
    <textarea id="r-ingr" rows="4" maxlength="1000">${esc(e.ingredienten.join('\n'))}</textarea>
    <p class="label">Zo maak je het <span class="muted">(één stap per regel)</span></p>
    <textarea id="r-stappen" rows="5" maxlength="2000">${esc(e.stappen.join('\n'))}</textarea>
    <p class="label">Dit recept redt</p>
    <div class="chips" id="r-redt">${kies.map(p => `<button type="button" class="chip ${gekozen.has(p.id) ? 'on' : ''}" data-id="${p.id}">${esc(naamDelen(p).titel)}</button>`).join('')}</div>
    <p class="muted small">Alleen voor eten dat nog goed is. Vlees en vis staan er bewust niet bij.</p>
    <button class="btn primary" id="r-bewaar">Bewaren</button>`;
  $('#r-redt').querySelectorAll('.chip').forEach(b => b.onclick = () => {
    if (gekozen.has(b.dataset.id)) gekozen.delete(b.dataset.id); else gekozen.add(b.dataset.id);
    b.classList.toggle('on');
  });
  $('#r-bewaar').onclick = async () => {
    const titel = $('#r-titel').value.trim();
    const regels = el => el.value.split('\n').map(s => s.trim()).filter(Boolean);
    if (!titel || !regels($('#r-stappen')).length) { toast('Vul een naam en minstens één stap in'); return; }
    const nieuw = { id: id || 'eigen-r-' + newId(), titel, ingredienten: regels($('#r-ingr')), stappen: regels($('#r-stappen')), redt: [...gekozen] };
    plus.recepten = [...plus.recepten.filter(x => x.id !== nieuw.id), nieuw];
    await bewaarPlus();
    zetEigenInApp();
    $('#eigen-sheet').close();
    if ($('#recept-sheet').open) $('#recept-sheet').close();
    renderTweedeLeven();
    toast(id ? 'Aangepast' : 'Recept bewaard');
  };
  $('#eigen-sheet').showModal();
}

function eigenReceptKnoppen(r) {
  return r.eigen ? `<div class="row eigen-acties"><button class="btn small" id="recept-bewerk">Aanpassen</button><button class="btn small danger" id="recept-weg">Verwijderen</button></div>` : '';
}

function koppelEigenRecept(r) {
  if (!r.eigen) return;
  $('#recept-bewerk').onclick = () => openEigenRecept(r.id);
  $('#recept-weg').onclick = async () => {
    if (!confirm(`${r.titel} verwijderen?`)) return;
    plus.recepten = plus.recepten.filter(x => x.id !== r.id);
    await bewaarPlus();
    zetEigenInApp();
    $('#recept-sheet').close();
    renderTweedeLeven();
    toast('Verwijderd');
  };
}

// Kaart "eigen recept" vooraan in de receptenrij, en "eigen product" op het beginscherm.
const plusLabel = () => heeftPlus() ? '' : '<span class="plus-badge">Plus</span>';
function plusReceptKaart() {
  return `<button class="recipe-card add-card" id="eigen-recept-knop">
    ${plusLabel()}<span class="add-plus">+</span><span class="recipe-title">Eigen recept</span><span class="recipe-saves">Bewaar je eigen redding</span>
  </button>`;
}
function plusProductKnop() {
  return `<button class="add-product" id="eigen-product-knop"><span class="add-plus">+</span><span><b>Eigen product toevoegen</b><small>Staat het er niet in? Voeg het zelf toe.</small></span>${plusLabel()}</button>`;
}

// ---------- Steunen ----------
function steunHTML(klein = false) {
  if (!STEUN_URL) return '';
  return klein
    ? `<a class="steun-link" href="${STEUN_URL}" target="_blank" rel="noopener">Blij met Datechecker? Trakteer de maker op een koffie ☕</a>`
    : `<a class="settings-row" href="${STEUN_URL}" target="_blank" rel="noopener"><span>Trakteer de maker op een koffie ☕</span><span class="muted">›</span></a>`;
}

// Instellingen: Plus-status en steunen.
function renderPlusInstellingen() {
  $('#set-plus').innerHTML = heeftPlus()
    ? `<button class="settings-row" id="set-plus-open"><span>Je hebt Plus · code ${esc(plus.code)}</span><span class="muted">›</span></button>`
    : `<button class="settings-row" id="set-plus-open"><span>Datechecker Plus · eenmalig ${PLUS_PRIJS}</span><span class="muted">›</span></button>`;
  $('#set-plus-open').onclick = () => openPlusSheet();
  $('#set-steun').innerHTML = steunHTML() || '<p class="muted small">De steunknop komt binnenkort.</p>';
}

document.addEventListener('DOMContentLoaded', async () => {
  const data = (await DB.getMeta('plus')) || {};
  plus.code = data.code || null;
  plus.producten = data.producten || [];
  plus.recepten = data.recepten || [];
  zetEigenInApp();
  renderZoeken();
  verwerkTerugkomst();
});
