// Tweede leven: recepten en ideeën voor eten dat niet meer op z'n best is, maar nog wel goed.
// Alleen voor producten die nog goed zijn: wat "Ghosten" krijgt, krijgt geen tweede kans.

const RECEPTEN = [
  {
    id: 'wentelteefjes', titel: 'Wentelteefjes', tijd: '15 min', icoon: 'brood', kleur: '#fdecc8',
    redt: ['brood', 'afbakbroodjes', 'melk', 'eieren'],
    intro: 'Hét recept voor brood dat droog wordt. Hoe ouder het brood, hoe beter het de melk opzuigt.',
    ingredienten: ['4 sneetjes oud brood of 2 afbakbroodjes', '2 eieren', '200 ml melk of haverdrink', 'Snufje kaneel en suiker', 'Klontje boter'],
    stappen: ['Klop de eieren los met de melk, kaneel en een beetje suiker.', 'Leg het brood erin en laat het even weken. Keer het om.', 'Bak het in een koekenpan met boter, aan beide kanten goudbruin.', 'Lekker met fruit, yoghurt of een beetje jam.'],
  },
  {
    id: 'croutons', titel: 'Croutons', tijd: '15 min', icoon: 'afbakbroodjes', kleur: '#fbe7c6',
    redt: ['brood', 'afbakbroodjes', 'crackers'],
    intro: 'Van hard brood maak je in een kwartier krokante blokjes voor soep of salade.',
    ingredienten: ['Oud brood of afbakbroodjes', 'Scheutje olijfolie', 'Zout, peper en eventueel knoflook of kruiden'],
    stappen: ['Verwarm de oven voor op 200 °C.', 'Snijd het brood in blokjes en hussel ze met olie en kruiden.', 'Bak ze 8 tot 10 minuten in de oven, tot ze goudbruin zijn. Halverwege even omscheppen.', 'Laat afkoelen. In een afgesloten pot blijven ze een week krokant.'],
  },
  {
    id: 'pannenkoeken', titel: 'Pannenkoeken', tijd: '25 min', icoon: 'melk', kleur: '#dfeafb',
    redt: ['melk', 'melk-houdbaar', 'haverdrink', 'yoghurt', 'eieren'],
    intro: 'Melk die bijna op moet, eieren die niet meer zacht mogen of een restje yoghurt: in het beslag gaat alles op.',
    ingredienten: ['250 g bloem', '500 ml melk (of deels yoghurt)', '2 eieren', 'Snufje zout', 'Boter of olie om te bakken'],
    stappen: ['Doe de bloem en het zout in een kom en maak een kuiltje.', 'Klop de eieren erdoor en voeg beetje bij beetje de melk toe, tot een glad beslag.', 'Bak dunne pannenkoeken in een hete pan met een beetje boter.', 'Eieren over de datum? Bak de pannenkoeken goed gaar, niet met een zachte binnenkant.'],
  },
  {
    id: 'frittata', titel: 'Frittata uit de oven', tijd: '30 min', icoon: 'eieren', kleur: '#e4edf8',
    redt: ['eieren', 'restjes', 'kaas-goudse', 'vleeswaren', 'creme-fraiche'],
    intro: 'Een omelet uit de oven waar je bijna elk restje in kwijt kunt: pasta, groente, kaas of ham.',
    ingredienten: ['6 eieren', 'Restjes: gekookte pasta, groente, ham of kaas', 'Scheutje melk of een lepel crème fraîche', 'Zout en peper'],
    stappen: ['Verwarm de oven voor op 180 °C.', 'Klop de eieren los met de melk, zout en peper.', 'Verdeel de restjes over een ingevette ovenschaal en giet de eieren erover. Strooi er kaas over.', 'Bak 20 tot 25 minuten, tot het ei in het midden helemaal gestold is.'],
  },
  {
    id: 'tortillachips', titel: 'Tortillachips uit de oven', tijd: '15 min', icoon: 'wraps', kleur: '#fbe7c6',
    redt: ['wraps', 'hummus'],
    intro: 'Droge wraps worden in de oven knapperige chips. Lekker met hummus of een dip.',
    ingredienten: ['Wraps', 'Beetje olie', 'Zout, paprikapoeder of andere kruiden'],
    stappen: ['Verwarm de oven voor op 190 °C.', 'Bestrijk de wraps dun met olie en strooi er kruiden over.', 'Snijd ze in punten en leg ze naast elkaar op een bakplaat.', 'Bak 6 tot 8 minuten, tot ze goudbruin en knapperig zijn.'],
  },
  {
    id: 'smoothie', titel: 'Smoothie', tijd: '5 min', icoon: 'sap', kleur: '#fde6cf',
    redt: ['yoghurt', 'haverdrink', 'sap', 'melk'],
    intro: 'Yoghurt, sap of havermelk die op moet, plus wat (diepvries)fruit: in vijf minuten een ontbijt.',
    ingredienten: ['Een flinke schep yoghurt', 'Een scheut sap, melk of haverdrink', 'Fruit, vers of uit de vriezer', 'Eventueel een handje havermout'],
    stappen: ['Doe alles in de blender.', 'Mix tot het glad is. Te dik? Scheutje drinken erbij.', 'Meteen opdrinken.'],
  },
  {
    id: 'pastasaus-restjes', titel: 'Romige restjespasta', tijd: '20 min', icoon: 'pastasaus', kleur: '#fbdcd6',
    redt: ['pastasaus', 'slagroom', 'creme-fraiche', 'roomkaas', 'kaas-goudse', 'pasta'],
    intro: 'Een halve pot saus, een restje room of roomkaas en uitgedroogde kaas: samen een romige pastasaus.',
    ingredienten: ['Pasta', 'Restje pastasaus', 'Scheut room, lepel crème fraîche of roomkaas', 'Geraspte (oude) kaas', 'Eventueel groente uit de koelkast'],
    stappen: ['Kook de pasta volgens de verpakking.', 'Verwarm de saus in een pan en roer de room of roomkaas erdoor.', 'Bak eventueel groente mee en schep de pasta erdoor.', 'Rasp er kaas over. Uitgedroogde kaas is hier juist perfect voor.'],
  },
  {
    id: 'gebakken-rijst', titel: 'Gebakken rijst', tijd: '15 min', icoon: 'rijst', kleur: '#eef2f6',
    redt: ['restjes', 'rijst', 'eieren'],
    intro: 'Gekookte rijst van gisteren bakt zelfs beter dan verse. Wel binnen 2 dagen, en goed heet.',
    ingredienten: ['Gekookte rijst van maximaal 2 dagen oud', '1 of 2 eieren', 'Groente die op moet', 'Sojasaus', 'Olie'],
    stappen: ['Verhit olie in een wok of grote pan.', 'Bak de groente kort, schuif opzij en roerbak het ei erbij.', 'Voeg de rijst toe en bak alles flink door tot het dampend heet is.', 'Op smaak brengen met sojasaus.'],
  },
];

let tlFilter = null;

function receptKaart(r) {
  return `<button class="recipe-card" data-recept="${r.id}" style="--kleur:${r.kleur}">
    ${icoon(r.icoon, 'recipe-icon')}
    <span class="recipe-time">${r.tijd}</span>
    <span class="recipe-title">${esc(r.titel)}</span>
    <span class="recipe-saves">Redt ${r.redt.length} producten</span>
  </button>`;
}

function renderTweedeLeven() {
  // Alleen producten met ideeën; vlees en vis na de datum krijgen geen tweede kans.
  const metIdeeen = PRODUCTEN.filter(p => p.tweedeLeven.length);
  const cats = CATEGORIEEN.filter(c => metIdeeen.some(p => p.categorie === c.id));
  const lijst = metIdeeen.filter(p => !tlFilter || p.categorie === tlFilter);

  $('#tl-body').innerHTML = `
    <div class="tl-note">${icoon('match', 'tl-note-icon')}<p><b>Alleen voor eten dat nog goed is.</b> Niet meer op z’n best, wel nog te eten? Check het eerst bij Zoeken. Wat “Ghosten” krijgt, krijgt geen tweede kans.</p></div>

    <div class="section-head"><h2>Recepten</h2></div>
    <div class="recipe-row">${RECEPTEN.map(receptKaart).join('')}</div>

    <div class="section-head"><h2>Per product</h2></div>
    <div class="chips scroll-x tip-filter">
      <button class="chip ${!tlFilter ? 'on' : ''}" data-tlcat="">Alles</button>
      ${cats.map(c => `<button class="chip ${tlFilter === c.id ? 'on' : ''}" data-tlcat="${c.id}">${c.kort}</button>`).join('')}
    </div>
    <div class="idea-list">${lijst.map(p => `
      <article class="idea-card">
        <button class="idea-head" data-product="${p.id}" style="--kleur:${p.kleur}">
          ${icoon(p.id, 'idea-icon')}<span><b>${esc(naamDelen(p).titel)}</b><small>Check of het nog goed is ›</small></span>
        </button>
        <ul class="ideas">${p.tweedeLeven.map(t => `<li>${esc(t)}</li>`).join('')}</ul>
        ${receptKnoppen(p.id)}
      </article>`).join('')}
    </div>`;

  const body = $('#tl-body');
  body.querySelectorAll('[data-recept]').forEach(b => b.onclick = () => openRecept(b.dataset.recept));
  body.querySelectorAll('[data-product]').forEach(b => b.onclick = () => openProduct(b.dataset.product));
  body.querySelectorAll('[data-tlcat]').forEach(b => b.onclick = () => { tlFilter = b.dataset.tlcat || null; renderTweedeLeven(); });
}

// Knopjes naar de recepten waarin dit product gered wordt (ook gebruikt op de productpagina).
function receptKnoppen(productId) {
  const r = RECEPTEN.filter(x => x.redt.includes(productId));
  return r.length ? `<div class="recipe-links">${r.map(x => `<button class="pill-link recipe-link" data-recept="${x.id}">Recept: ${esc(x.titel)}</button>`).join('')}</div>` : '';
}

function openRecept(id) {
  const r = RECEPTEN.find(x => x.id === id);
  if (!r) return;
  const gered = r.redt.map(productById).filter(Boolean);
  $('#recept-body').innerHTML = `
    <div class="recipe-hero" style="--kleur:${r.kleur}">${icoon(r.icoon, 'recipe-hero-icon')}</div>
    <span class="kicker">Tweede leven · ${r.tijd}</span>
    <h2 class="sheet-title">${esc(r.titel)}</h2>
    <p>${esc(r.intro)}</p>
    <h3>Je hebt nodig</h3>
    <ul class="ideas">${r.ingredienten.map(i => `<li>${esc(i)}</li>`).join('')}</ul>
    <h3>Zo maak je het</h3>
    <ol class="steps">${r.stappen.map(s => `<li>${esc(s)}</li>`).join('')}</ol>
    <h3>Dit recept redt</h3>
    <div class="recent-row saved-row">${gered.map(p => `<button class="recent-card" data-product="${p.id}" style="--kleur:${p.kleur}">${icoon(p.id)}<span>${esc(naamDelen(p).titel)}</span></button>`).join('')}</div>`;
  $('#recept-body').querySelectorAll('[data-product]').forEach(b => b.onclick = () => { $('#recept-sheet').close(); openProduct(b.dataset.product); });
  $('#recept-sheet').showModal();
  $('#recept-body').scrollTop = 0;
}
