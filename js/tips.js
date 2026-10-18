// Dating tips: korte bewaartips per onderwerp, in de datingtoon maar met feiten uit de bronnen.

const TIP_CATEGORIEEN = [
  { id: 'koelkast', label: 'Koelkast', icoon: 'cat-koelkast', kleur: '#e3f1df' },
  { id: 'vriezer', label: 'Vriezer', icoon: 'cat-vriezer', kleur: '#e2eefb' },
  { id: 'brood', label: 'Brood', icoon: 'cat-brood', kleur: '#fdecc8' },
  { id: 'zuivel', label: 'Zuivel en eieren', icoon: 'cat-zuivel', kleur: '#dfeafb' },
  { id: 'kaas', label: 'Kaas', icoon: 'cat-kaas', kleur: '#fff2b8' },
  { id: 'vlees', label: 'Vlees en vis', icoon: 'cat-vlees', kleur: '#fde0da' },
];

const VC = 'https://www.voedingscentrum.nl';
const TIPS = [
  { cat: 'koelkast', titel: 'Houd het koel',
    tekst: 'Zet je koelkast op 4 °C. Zo blijft alles langer goed en krijgen bacteriën minder kans. Een koelkastthermometer kost bijna niets.',
    bron: `${VC}/nl/veilig-eten-voedselinfectie-voorkomen/veilig-bewaren.aspx` },
  { cat: 'koelkast', titel: 'Laat je date niet te lang wachten',
    tekst: 'Restjes en open pakken zet je binnen 2 uur terug in de koelkast. Laat ze niet de hele avond op het aanrecht staan.',
    bron: `${VC}/nl/thema/kopen-koken-bewaren/eten-bewaren/hoe-lang-kan-ik-bewaren/kipfilet-gegrild.aspx` },
  { cat: 'koelkast', titel: 'De oudste dates eerst',
    tekst: 'Zet nieuwe boodschappen achterin en wat het eerst over de datum gaat vooraan. Dan zie je het en eet je het op tijd.',
    bron: `${VC}/nl/thema/kopen-koken-bewaren/eten-bewaren/je-voorraad-op-orde.aspx` },

  { cat: 'vriezer', titel: 'Op ijs zetten werkt',
    tekst: 'Haal je de datum van rauwe kip of vlees niet? Vries het in vóór of op de TGT-datum. Kip blijft dan zo’n 3 maanden lekker in plaats van een paar dagen.',
    bron: `${VC}/nl/thema/kopen-koken-bewaren/eten-bewaren/hoe-lang-kan-ik-bewaren/kipfilet-onbereid.aspx` },
  { cat: 'vriezer', titel: 'Langzaam opwarmen',
    tekst: 'Ontdooi vlees en kip in de koelkast, het liefst de avond ervoor, of in de magnetron. Niet op het aanrecht: daar groeien bacteriën sneller.',
    bron: `${VC}/nl/gezonde-recepten/kookhulp/ontdooien-hoe-ontdooi-ik-vlees-kip-gehakt-vis.aspx` },
  { cat: 'vriezer', titel: 'Geen tweede ronde',
    tekst: 'Vries ontdooid rauw vlees niet opnieuw in. Heb je het eerst gaar gemaakt, dan mag het gerecht wel de vriezer in.',
    bron: `${VC}/encyclopedie/vlees.aspx` },
  { cat: 'vriezer', titel: 'Kleine porties, minder spijt',
    tekst: 'Vries in porties in. Dan ontdooi je precies wat je nodig hebt en blijft er niets over om weg te gooien. Schrijf de datum op de zak.',
    bron: `${VC}/nl/service/vraag-en-antwoord/koken-en-bewaren/kun-je-een-maaltijdrestje-tweede-keer-invriezen.aspx` },

  { cat: 'brood', titel: 'Brood houdt van de vriezer',
    tekst: 'Brood blijft het langst goed in de vriezer, een broodtrommel of een goed afgesloten zak. Ingevroren is het 1 tot 3 maanden goed.',
    bron: `${VC}/nl/thema/kopen-koken-bewaren/eten-bewaren/hoe-lang-kan-ik-bewaren/tarwebrood.aspx` },
  { cat: 'brood', titel: 'Afbakken uit de vriezer',
    tekst: 'Afbakbroodjes hoef je niet eerst te ontdooien. Bak ze een paar minuten langer dan op de verpakking staat.',
    bron: `${VC}/nl/thema/kopen-koken-bewaren/eten-bewaren/hoe-lang-kan-ik-bewaren/afbakbroodje.aspx` },
  { cat: 'brood', titel: 'Schimmel is een dealbreaker',
    tekst: 'Zie je schimmel op brood, gooi dan het hele brood of zakje weg. Schimmel groeit verder dan je kunt zien.',
    bron: `${VC}/nl/thema/kopen-koken-bewaren/eten-bewaren/hoe-lang-kan-ik-bewaren/tarwebrood.aspx` },

  { cat: 'zuivel', titel: 'Een schone lepel',
    tekst: 'Schep yoghurt altijd met een schone lepel en zet het pak meteen terug in de koelkast. Zo komen er geen schimmels in.',
    bron: `${VC}/nl/thema/kopen-koken-bewaren/eten-bewaren/hoe-lang-kan-ik-bewaren/yoghurt-vol.aspx` },
  { cat: 'zuivel', titel: 'Eieren: punt naar beneden',
    tekst: 'Bewaar eieren in de doos in de koelkast, met de punt naar beneden. Dan blijven ze langer vers en nemen ze geen geuren over.',
    bron: `${VC}/nl/thema/kopen-koken-bewaren/eten-bewaren/hoe-lang-kan-ik-bewaren/ei-rauw.aspx` },
  { cat: 'zuivel', titel: 'Oudere eieren? Goed gaar',
    tekst: 'Na de datum eet je eieren alleen nog goed gaar: hardgekookt, doorbakken of in de oven. Zachtgekookt of rauw niet meer.',
    bron: `${VC}/nl/thema/kopen-koken-bewaren/eten-bewaren/hoe-lang-kan-ik-bewaren/ei-rauw.aspx` },

  { cat: 'kaas', titel: 'Goed ingepakt',
    tekst: 'Pak kaas in kaaspapier of vershoudfolie. Dan zweet hij niet en droogt hij niet uit.',
    bron: `${VC}/nl/thema/kopen-koken-bewaren/eten-bewaren/hoe-lang-kan-ik-bewaren/kaas-48-plus-jong-goudse.aspx` },
  { cat: 'kaas', titel: 'Een klein plekje mag weg',
    tekst: 'Op een stuk harde kaas mag je een klein schimmelplekje ruim wegsnijden, minstens 1 centimeter. Bij plakken, geraspte of zachte kaas niet.',
    bron: `${VC}/nl/thema/kopen-koken-bewaren/eten-bewaren/hoe-lang-kan-ik-bewaren/kaas-48-plus-jong-goudse.aspx` },
  { cat: 'kaas', titel: 'Kaas kan ook de kou in',
    tekst: 'Kaas kun je 2 tot 4 maanden invriezen. Na het ontdooien brokkelt hij wat, dus gebruik hem dan geraspt of in een gerecht.',
    bron: `${VC}/nl/thema/kopen-koken-bewaren/eten-bewaren/hoe-lang-kan-ik-bewaren/kaas-48-plus-jong-goudse.aspx` },

  { cat: 'vlees', titel: 'TGT is TGT',
    tekst: 'Vers vlees, kip en vis hebben een TGT-datum. Na die datum niet meer eten, ook als het er goed uitziet en goed ruikt.',
    bron: `${VC}/encyclopedie/houdbaarheidsdatums-tht-tgt.aspx` },
  { cat: 'vlees', titel: 'Onderin de koelkast',
    tekst: 'Bewaar rauw vlees goed afgedekt op de onderste plank. Dan kan er geen vleesvocht op je andere eten lekken.',
    bron: `${VC}/nl/thema/kopen-koken-bewaren/eten-bewaren/hoe-lang-kan-ik-bewaren/kipfilet-onbereid.aspx` },
  { cat: 'vlees', titel: 'Open is snel op',
    tekst: 'Een open bakje rauwe kip eet je binnen 2 dagen op, en nooit na de datum. Lukt dat niet? Meteen de vriezer in.',
    bron: `${VC}/nl/thema/kopen-koken-bewaren/eten-bewaren/hoe-lang-kan-ik-bewaren/kipfilet-onbereid.aspx` },
];

let tipFilter = null;

// Elke dag een andere tip bovenaan.
function tipVanDeDag() {
  const dag = Math.floor(new Date(today()) / 86400000);
  return TIPS[dag % TIPS.length];
}

function tipKaart(t, groot = false) {
  const c = TIP_CATEGORIEEN.find(x => x.id === t.cat);
  return `<article class="tip-card ${groot ? 'featured' : ''}" style="--kleur:${c.kleur}">
    <div class="tip-head">${icoon(c.icoon, 'tip-icon')}<span class="tip-cat">${groot ? 'Tip van de dag · ' : ''}${c.label}</span></div>
    <h3>${esc(t.titel)}</h3>
    <p>${esc(t.tekst)}</p>
    <a class="tip-source" href="${t.bron}" target="_blank" rel="noopener">Bron: Voedingscentrum</a>
  </article>`;
}

function renderTips() {
  const dagTip = tipVanDeDag();
  const lijst = TIPS.filter(t => !tipFilter || t.cat === tipFilter);
  $('#tips-body').innerHTML = `
    ${tipFilter ? '' : tipKaart(dagTip, true)}
    <div class="chips scroll-x tip-filter">
      <button class="chip ${!tipFilter ? 'on' : ''}" data-tipcat="">Alles</button>
      ${TIP_CATEGORIEEN.map(c => `<button class="chip ${tipFilter === c.id ? 'on' : ''}" data-tipcat="${c.id}">${c.label}</button>`).join('')}
    </div>
    <div class="tip-list">${lijst.filter(t => tipFilter || t !== dagTip).map(t => tipKaart(t)).join('')}</div>`;
  $('#tips-body').querySelectorAll('[data-tipcat]').forEach(b => b.onclick = () => { tipFilter = b.dataset.tipcat || null; renderTips(); });
}
