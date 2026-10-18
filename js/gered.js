// Gered: bijhouden wat mensen na een check écht opeten, en de gezamenlijke teller op het beginscherm.
//
// - Alleen "Opgegeten" telt mee. Alleen opzoeken of "Ghosten" telt niet.
// - Kiest iemand niets, dan vraagt de app het de volgende keer op het beginscherm nog eens.
// - Gewicht: een geschatte gemiddelde verpakking (GEWICHT hieronder); was het al open, dan telt de helft.
// - Naar de online teller gaat alleen het gewicht en een willekeurig apparaatnummer, verder niets.

// Adres van de online teller (Cloudflare Worker). Leeg = nog niet online: dan alleen je eigen teller.
const TELLER_URL = 'https://datechecker-teller.beau-f5b.workers.dev';

// Geschat gewicht van een gemiddelde verpakking in grammen. Nieuw product? Zet het hier ook bij.
const GEWICHT = {
  afbakbroodjes: 300, brood: 800, wraps: 370, crackers: 250,
  yoghurt: 500, eieren: 360, melk: 1000, 'melk-houdbaar': 1000, vla: 1000, slagroom: 250,
  roomboter: 250, 'creme-fraiche': 125, haverdrink: 1000,
  'kaas-goudse': 400, brie: 200, mozzarella: 125, roomkaas: 150,
  kipfilet: 300, gehakt: 500, vleeswaren: 150, salami: 100, rookworst: 275, zalm: 250, 'gerookte-zalm': 100, 'vega-gehakt': 250,
  sla: 150, hummus: 200, restjes: 400,
  sap: 1000, pasta: 500, rijst: 500, chips: 200, koekjes: 200, cornflakes: 375, pindakaas: 350, jam: 450,
  pastasaus: 400, mayonaise: 500, ketchup: 500, chocolade: 200, 'bonen-blik': 400,
  banaan: 600, appel: 750, aardbeien: 400, avocado: 200, tomaat: 500, komkommer: 400, paprika: 500,
  aardappelen: 1000, ui: 500, wortels: 500, champignons: 250, broccoli: 500,
  ijs: 500, pizza: 350, 'diepvries-groente': 450, bloem: 1000, olie: 500, koffie: 500, frisdrank: 1500,
};
const gewichtVan = (p, open) => Math.round((GEWICHT[p.id] || 300) * (open ? 0.5 : 1));

const gered = {
  checks: [],   // { id, product, gram, at, status: 'open' | 'opgegeten' | 'weg' | 'onbekend' }
  outbox: [],   // nog niet verstuurde reddingen (bijvoorbeeld zonder internet)
  totaal: null, // { producten, gram } van alle gebruikers, laatst bekend
  apparaat: null,
};

const kg = gram => {
  const k = gram / 1000;
  return k.toLocaleString('nl-NL', { maximumFractionDigits: k < 10 ? 1 : 0 });
};

async function bewaarGered() {
  await DB.setMeta('gered', { checks: gered.checks.slice(-200), outbox: gered.outbox, totaal: gered.totaal });
}

// ---------- Vastleggen ----------
// Na een oordeel: de gebruiker kiest zelf. status = 'opgegeten' of 'weg'.
async function legVast(p, open, status, bestaandId) {
  const gram = gewichtVan(p, open);
  let check = gered.checks.find(c => c.id === bestaandId);
  if (!check) {
    check = { id: newId(), product: p.id, gram, at: Date.now(), status };
    gered.checks.push(check);
  }
  check.status = status;
  if (status === 'opgegeten') gered.outbox.push({ gram: check.gram });
  await bewaarGered();
  if (status === 'opgegeten') verstuur();
  renderZoeken();
  return check;
}

// Productpagina dicht zonder te kiezen, terwijl het oordeel match of twijfel was? Dan later nog eens vragen.
async function onthoudOpenCheck(p, open) {
  // Hetzelfde product staat al open? Dan die bijwerken in plaats van een tweede vraag.
  const al = gered.checks.find(c => c.status === 'open' && c.product === p.id);
  if (al) Object.assign(al, { gram: gewichtVan(p, open), at: Date.now() });
  else gered.checks.push({ id: newId(), product: p.id, gram: gewichtVan(p, open), at: Date.now(), status: 'open' });
  await bewaarGered();
}

// De oudste openstaande vraag die minstens een half uur oud is. Na 7 dagen vragen we het niet meer.
function openVraag() {
  const nu = Date.now();
  for (const c of gered.checks) {
    if (c.status === 'open' && nu - c.at > 7 * 86400000) c.status = 'onbekend';
  }
  return gered.checks.find(c => c.status === 'open' && nu - c.at > 30 * 60000);
}

// ---------- Online teller ----------
async function apparaatNummer() {
  if (!gered.apparaat) {
    gered.apparaat = (await DB.getMeta('apparaat')) || (Math.random().toString(36).slice(2) + Date.now().toString(36));
    await DB.setMeta('apparaat', gered.apparaat);
  }
  return gered.apparaat;
}

async function haalTotaal() {
  if (!TELLER_URL) return;
  try {
    const res = await fetch(`${TELLER_URL}/totaal`, { cache: 'no-store' });
    if (res.ok) { gered.totaal = await res.json(); await bewaarGered(); renderZoeken(); }
  } catch { /* offline: laatst bekende getal blijft staan */ }
}

let bezigMetVersturen = false;
async function verstuur() {
  if (!TELLER_URL || bezigMetVersturen || !gered.outbox.length) return;
  bezigMetVersturen = true;
  const apparaat = await apparaatNummer();
  try {
    while (gered.outbox.length) {
      const res = await fetch(`${TELLER_URL}/gered`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gram: gered.outbox[0].gram, apparaat }),
      });
      // 429 = vandaag al genoeg gemeld vanaf deze telefoon: niet opnieuw proberen, wel lokaal meetellen.
      if (!res.ok && res.status !== 429) break;
      const data = await res.json();
      if (data.gram != null) gered.totaal = { producten: data.producten, gram: data.gram };
      gered.outbox.shift();
    }
  } catch { /* offline: later opnieuw */ }
  bezigMetVersturen = false;
  await bewaarGered();
  renderZoeken();
}

// ---------- Weergave ----------
function mijnTotaal() {
  const mijn = gered.checks.filter(c => c.status === 'opgegeten');
  return { producten: mijn.length, gram: mijn.reduce((s, c) => s + c.gram, 0) };
}

// De kaart bovenaan het beginscherm.
function tellerHTML() {
  const mijn = mijnTotaal();
  const samen = gered.totaal;
  const groot = samen
    ? `<span class="counter-kicker">Samen met alle gebruikers</span><b class="counter-big">± ${kg(samen.gram)} kg</b><span class="counter-sub">eten gered van de prullenbak</span>`
    : `<span class="counter-kicker">Jouw teller</span><b class="counter-big">± ${kg(mijn.gram)} kg</b><span class="counter-sub">eten door jou gered van de prullenbak</span>`;
  const klein = samen
    ? `<p class="counter-me">Jij redde er ${mijn.producten} ${mijn.producten === 1 ? 'product' : 'producten'} van (± ${kg(mijn.gram)} kg)</p>`
    : (mijn.producten ? `<p class="counter-me">${mijn.producten} ${mijn.producten === 1 ? 'product' : 'producten'} opgegeten na een check</p>` : `<p class="counter-me">Check een product en eet het op: dan telt het mee.</p>`);
  return `<div class="counter-card">${icoon('match', 'counter-icon')}<div class="counter-text">${groot}${klein}</div></div>`;
}

// "Is die date doorgegaan?" voor een check van eerder.
function vraagHTML() {
  const c = openVraag();
  const p = c && productById(c.product);
  if (!p) return '';
  const wanneer = daysAgoText(new Date(c.at).toISOString().slice(0, 10));
  return `<div class="followup" data-check="${c.id}" style="--kleur:${p.kleur}">
    ${icoon(p.id, 'followup-icon')}
    <div class="followup-text"><b>Is die date doorgegaan?</b><span>Je checkte ${wanneer} ${esc(naamDelen(p).titel.toLowerCase())}.</span></div>
    <div class="followup-buttons">
      <button class="chip on" data-antwoord="opgegeten">Opgegeten</button>
      <button class="chip" data-antwoord="weg">Weggegooid</button>
      <button class="chip" data-antwoord="onbekend">Weet ik niet meer</button>
    </div>
  </div>`;
}

function koppelVraag(el) {
  const v = el.querySelector('.followup');
  if (!v) return;
  v.querySelectorAll('[data-antwoord]').forEach(b => b.onclick = async () => {
    const c = gered.checks.find(x => x.id === v.dataset.check);
    const p = productById(c.product);
    if (b.dataset.antwoord === 'onbekend') { c.status = 'onbekend'; await bewaarGered(); renderZoeken(); return; }
    await legVast(p, false, b.dataset.antwoord, c.id);
    toast(b.dataset.antwoord === 'opgegeten' ? `Gered! ± ${kg(c.gram)} kg minder weggegooid` : 'Jammer. Volgende keer beter!');
  });
}

document.addEventListener('DOMContentLoaded', async () => {
  const data = (await DB.getMeta('gered')) || {};
  gered.checks = data.checks || [];
  gered.outbox = data.outbox || [];
  gered.totaal = data.totaal || null;
  renderZoeken();
  haalTotaal();
  verstuur();
});
window.addEventListener('online', verstuur);
