// Dating tips: korte bewaartips per onderwerp, in de datingtoon maar met feiten uit de bronnen.

const TIP_CATEGORIEEN = [
  { id: 'koelkast', label: 'Fridge', icoon: 'cat-koelkast', kleur: '#e3f1df' },
  { id: 'vriezer', label: 'Freezer', icoon: 'cat-vriezer', kleur: '#e2eefb' },
  { id: 'brood', label: 'Bread', icoon: 'cat-brood', kleur: '#fdecc8' },
  { id: 'zuivel', label: 'Dairy and eggs', icoon: 'cat-zuivel', kleur: '#dfeafb' },
  { id: 'kaas', label: 'Cheese', icoon: 'cat-kaas', kleur: '#fff2b8' },
  { id: 'vlees', label: 'Meat and fish', icoon: 'cat-vlees', kleur: '#fde0da' },
];

const VC = 'https://www.voedingscentrum.nl';
const TIPS = [
  { cat: 'koelkast', titel: 'Keep it cool',
    tekst: 'Set your fridge to 4 °C. Everything stays good for longer and bacteria get less of a chance. A fridge thermometer costs next to nothing.',
    bron: `${VC}/nl/veilig-eten-voedselinfectie-voorkomen/veilig-bewaren.aspx` },
  { cat: 'koelkast', titel: 'Don’t keep your date waiting',
    tekst: 'Put leftovers and open packs back in the fridge within 2 hours. Don’t leave them on the counter all evening.',
    bron: `${VC}/nl/thema/kopen-koken-bewaren/eten-bewaren/hoe-lang-kan-ik-bewaren/kipfilet-gegrild.aspx` },
  { cat: 'koelkast', titel: 'Oldest dates first',
    tekst: 'Put new groceries at the back and whatever expires first at the front. That way you see it and eat it in time.',
    bron: `${VC}/nl/thema/kopen-koken-bewaren/eten-bewaren/je-voorraad-op-orde.aspx` },

  { cat: 'vriezer', titel: 'Putting it on ice works',
    tekst: 'Won’t make the date on raw chicken or meat? Freeze it before or on the use-by date. Chicken then stays good for about 3 months instead of a few days.',
    bron: `${VC}/nl/thema/kopen-koken-bewaren/eten-bewaren/hoe-lang-kan-ik-bewaren/kipfilet-onbereid.aspx` },
  { cat: 'vriezer', titel: 'Warm up slowly',
    tekst: 'Thaw meat and chicken in the fridge, ideally the night before, or in the microwave. Not on the counter: bacteria grow faster there.',
    bron: `${VC}/nl/gezonde-recepten/kookhulp/ontdooien-hoe-ontdooi-ik-vlees-kip-gehakt-vis.aspx` },
  { cat: 'vriezer', titel: 'No second round',
    tekst: 'Don’t refreeze thawed raw meat. If you cook it first, the dish can go back in the freezer.',
    bron: `${VC}/encyclopedie/vlees.aspx` },
  { cat: 'vriezer', titel: 'Small portions, fewer regrets',
    tekst: 'Freeze in portions. Then you thaw exactly what you need and nothing is left to throw away. Write the date on the bag.',
    bron: `${VC}/nl/service/vraag-en-antwoord/koken-en-bewaren/kun-je-een-maaltijdrestje-tweede-keer-invriezen.aspx` },

  { cat: 'brood', titel: 'Bread loves the freezer',
    tekst: 'Bread keeps longest in the freezer, a bread bin or a well-closed bag. Frozen, it’s good for 1 to 3 months.',
    bron: `${VC}/nl/thema/kopen-koken-bewaren/eten-bewaren/hoe-lang-kan-ik-bewaren/tarwebrood.aspx` },
  { cat: 'brood', titel: 'Bake straight from frozen',
    tekst: 'No need to thaw bake-off rolls first. Bake them a few minutes longer than it says on the package.',
    bron: `${VC}/nl/thema/kopen-koken-bewaren/eten-bewaren/hoe-lang-kan-ik-bewaren/afbakbroodje.aspx` },
  { cat: 'brood', titel: 'Mould is a dealbreaker',
    tekst: 'See mould on bread? Throw out the whole loaf or bag. Mould spreads further than you can see.',
    bron: `${VC}/nl/thema/kopen-koken-bewaren/eten-bewaren/hoe-lang-kan-ik-bewaren/tarwebrood.aspx` },

  { cat: 'zuivel', titel: 'A clean spoon',
    tekst: 'Always scoop yoghurt with a clean spoon and put it straight back in the fridge. That keeps moulds out.',
    bron: `${VC}/nl/thema/kopen-koken-bewaren/eten-bewaren/hoe-lang-kan-ik-bewaren/yoghurt-vol.aspx` },
  { cat: 'zuivel', titel: 'Eggs: pointy end down',
    tekst: 'Keep eggs in their box in the fridge, pointy end down. They stay fresh longer and don’t pick up smells.',
    bron: `${VC}/nl/thema/kopen-koken-bewaren/eten-bewaren/hoe-lang-kan-ik-bewaren/ei-rauw.aspx` },
  { cat: 'zuivel', titel: 'Older eggs? Cook them well',
    tekst: 'After the date, only eat eggs well cooked: hard-boiled, fried through or baked. Not soft-boiled or raw anymore.',
    bron: `${VC}/nl/thema/kopen-koken-bewaren/eten-bewaren/hoe-lang-kan-ik-bewaren/ei-rauw.aspx` },

  { cat: 'kaas', titel: 'Wrap it up',
    tekst: 'Wrap cheese in cheese paper or cling film. Then it won’t sweat or dry out.',
    bron: `${VC}/nl/thema/kopen-koken-bewaren/eten-bewaren/hoe-lang-kan-ik-bewaren/kaas-48-plus-jong-goudse.aspx` },
  { cat: 'kaas', titel: 'A small spot can go',
    tekst: 'On a block of hard cheese you may cut away a small mould spot generously, at least 1 centimetre. Not with slices, grated or soft cheese.',
    bron: `${VC}/nl/thema/kopen-koken-bewaren/eten-bewaren/hoe-lang-kan-ik-bewaren/kaas-48-plus-jong-goudse.aspx` },
  { cat: 'kaas', titel: 'Cheese can go cold too',
    tekst: 'You can freeze cheese for 2 to 4 months. After thawing it gets a bit crumbly, so use it grated or in a dish.',
    bron: `${VC}/nl/thema/kopen-koken-bewaren/eten-bewaren/hoe-lang-kan-ik-bewaren/kaas-48-plus-jong-goudse.aspx` },

  { cat: 'vlees', titel: 'Use by means use by',
    tekst: 'Fresh meat, chicken and fish have a use-by date. Don’t eat them after that date, even if they look and smell fine.',
    bron: `${VC}/encyclopedie/houdbaarheidsdatums-tht-tgt.aspx` },
  { cat: 'vlees', titel: 'Bottom of the fridge',
    tekst: 'Keep raw meat well covered on the bottom shelf. Then no meat juices can drip onto your other food.',
    bron: `${VC}/nl/thema/kopen-koken-bewaren/eten-bewaren/hoe-lang-kan-ik-bewaren/kipfilet-onbereid.aspx` },
  { cat: 'vlees', titel: 'Open means eat it soon',
    tekst: 'Eat an open pack of raw chicken within 2 days, and never after the date. Can’t manage that? Straight into the freezer.',
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
    <div class="tip-head">${icoon(c.icoon, 'tip-icon')}<span class="tip-cat">${groot ? 'Tip of the day · ' : ''}${c.label}</span></div>
    <h3>${esc(t.titel)}</h3>
    <p>${esc(t.tekst)}</p>
    <a class="tip-source" href="${t.bron}" target="_blank" rel="noopener">Source: Voedingscentrum</a>
  </article>`;
}

function renderTips() {
  const dagTip = tipVanDeDag();
  const lijst = TIPS.filter(t => !tipFilter || t.cat === tipFilter);
  $('#tips-body').innerHTML = `
    ${tipFilter ? '' : tipKaart(dagTip, true)}
    <div class="chips scroll-x tip-filter">
      <button class="chip ${!tipFilter ? 'on' : ''}" data-tipcat="">All</button>
      ${TIP_CATEGORIEEN.map(c => `<button class="chip ${tipFilter === c.id ? 'on' : ''}" data-tipcat="${c.id}">${c.label}</button>`).join('')}
    </div>
    <div class="tip-list">${lijst.filter(t => tipFilter || t !== dagTip).map(t => tipKaart(t)).join('')}</div>`;
  $('#tips-body').querySelectorAll('[data-tipcat]').forEach(b => b.onclick = () => { tipFilter = b.dataset.tipcat || null; renderTips(); });
}
