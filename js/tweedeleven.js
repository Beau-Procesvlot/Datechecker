// Tweede leven: recepten en ideeën voor eten dat niet meer op z'n best is, maar nog wel goed.
// Alleen voor producten die nog goed zijn: wat "Ghosten" krijgt, krijgt geen tweede kans.

const RECEPTEN = [
  {
    id: 'wentelteefjes', titel: 'French toast', tijd: '15 min', icoon: 'brood', kleur: '#fdecc8',
    redt: ['brood', 'afbakbroodjes', 'melk', 'eieren'],
    intro: 'THE recipe for bread that’s drying out. The older the bread, the better it soaks up the milk.',
    ingredienten: ['4 slices of old bread or 2 bake-off rolls', '2 eggs', '200 ml milk or oat milk', 'Pinch of cinnamon and sugar', 'Knob of butter'],
    stappen: ['Whisk the eggs with the milk, cinnamon and a little sugar.', 'Lay the bread in it and let it soak for a moment. Turn it over.', 'Fry it in a pan with butter until golden brown on both sides.', 'Delicious with fruit, yoghurt or a little jam.'],
  },
  {
    id: 'croutons', titel: 'Croutons', tijd: '15 min', icoon: 'afbakbroodjes', kleur: '#fbe7c6',
    redt: ['brood', 'afbakbroodjes', 'crackers'],
    intro: 'Turn hard bread into crunchy cubes for soup or salad in fifteen minutes.',
    ingredienten: ['Old bread or bake-off rolls', 'Splash of olive oil', 'Salt, pepper and maybe garlic or herbs'],
    stappen: ['Preheat the oven to 200 °C.', 'Cut the bread into cubes and toss them with oil and herbs.', 'Bake for 8 to 10 minutes until golden brown. Give them a stir halfway.', 'Let them cool. In a sealed jar they stay crunchy for a week.'],
  },
  {
    id: 'pannenkoeken', titel: 'Pancakes', tijd: '25 min', icoon: 'melk', kleur: '#dfeafb',
    redt: ['melk', 'melk-houdbaar', 'haverdrink', 'yoghurt', 'eieren'],
    intro: 'Milk that needs using up, eggs that shouldn’t be eaten soft anymore, or a bit of yoghurt: it all goes into the batter.',
    ingredienten: ['250 g flour', '500 ml milk (or partly yoghurt)', '2 eggs', 'Pinch of salt', 'Butter or oil for frying'],
    stappen: ['Put the flour and salt in a bowl and make a well.', 'Whisk in the eggs and add the milk little by little, until you have a smooth batter.', 'Fry thin pancakes in a hot pan with a little butter.', 'Eggs past the date? Cook the pancakes all the way through, not soft in the middle.'],
  },
  {
    id: 'frittata', titel: 'Oven frittata', tijd: '30 min', icoon: 'eieren', kleur: '#e4edf8',
    redt: ['eieren', 'restjes', 'kaas-goudse', 'creme-fraiche'],
    intro: 'An oven-baked omelette that takes almost any leftover: pasta, vegetables or cheese.',
    ingredienten: ['6 eggs', 'Leftovers: cooked pasta, vegetables or cheese', 'Splash of milk or a spoon of crème fraîche', 'Salt and pepper'],
    stappen: ['Preheat the oven to 180 °C.', 'Whisk the eggs with the milk, salt and pepper.', 'Spread the leftovers over a greased oven dish and pour the eggs over them. Sprinkle with cheese.', 'Bake for 20 to 25 minutes, until the egg is completely set in the middle.'],
  },
  {
    id: 'tortillachips', titel: 'Oven tortilla chips', tijd: '15 min', icoon: 'wraps', kleur: '#fbe7c6',
    redt: ['wraps', 'hummus'],
    intro: 'Dry wraps turn into crunchy chips in the oven. Great with hummus or a dip.',
    ingredienten: ['Wraps', 'A little oil', 'Salt, paprika or other spices'],
    stappen: ['Preheat the oven to 190 °C.', 'Brush the wraps thinly with oil and sprinkle with spices.', 'Cut them into triangles and lay them side by side on a baking tray.', 'Bake for 6 to 8 minutes, until golden and crispy.'],
  },
  {
    id: 'smoothie', titel: 'Smoothie', tijd: '5 min', icoon: 'sap', kleur: '#fde6cf',
    redt: ['yoghurt', 'haverdrink', 'sap', 'melk'],
    intro: 'Yoghurt, juice or oat milk that needs using up, plus some (frozen) fruit: breakfast in five minutes.',
    ingredienten: ['A big spoonful of yoghurt', 'A splash of juice, milk or oat milk', 'Fruit, fresh or frozen', 'Maybe a handful of oats'],
    stappen: ['Put everything in the blender.', 'Blend until smooth. Too thick? Add a splash of liquid.', 'Drink it right away.'],
  },
  {
    id: 'pastasaus-restjes', titel: 'Creamy leftover pasta', tijd: '20 min', icoon: 'pastasaus', kleur: '#fbdcd6',
    redt: ['pastasaus', 'slagroom', 'creme-fraiche', 'roomkaas', 'kaas-goudse', 'pasta'],
    intro: 'Half a jar of sauce, some leftover cream or cream cheese and dried-out cheese: together a creamy pasta sauce.',
    ingredienten: ['Pasta', 'Leftover pasta sauce', 'Splash of cream, a spoon of crème fraîche or cream cheese', 'Grated (old) cheese', 'Maybe some vegetables from the fridge'],
    stappen: ['Cook the pasta according to the package.', 'Heat the sauce in a pan and stir in the cream or cream cheese.', 'Fry some vegetables along with it if you like, and stir in the pasta.', 'Grate cheese over it. Dried-out cheese is actually perfect for this.'],
  },
  {
    id: 'gebakken-rijst', titel: 'Fried rice', tijd: '15 min', icoon: 'rijst', kleur: '#eef2f6',
    redt: ['restjes', 'rijst', 'eieren'],
    intro: 'Yesterday’s cooked rice actually fries better than fresh. Within 2 days though, and piping hot.',
    ingredienten: ['Cooked rice, no more than 2 days old', '1 or 2 eggs', 'Vegetables that need using up', 'Soy sauce', 'Oil'],
    stappen: ['Heat oil in a wok or large pan.', 'Fry the vegetables briefly, push them aside and scramble the egg in.', 'Add the rice and stir-fry everything until it’s piping hot.', 'Season with soy sauce.'],
  },
];

// Recepten verwijzen soms nog naar een oude product-id: omzetten naar de samengevoegde groep, zonder dubbele.
for (const r of RECEPTEN) r.redt = [...new Set(r.redt.map(id => ALIAS[id] || id))];

let tlFilter = null;

function receptKaart(r) {
  return `<button class="recipe-card" data-recept="${r.id}" style="--kleur:${r.kleur}">
    ${icoon(r.icoon, 'recipe-icon')}
    <span class="recipe-time">${r.tijd || 'Own'}</span>
    <span class="recipe-title">${esc(r.titel)}</span>
    <span class="recipe-saves">Saves ${r.redt.length} products</span>
  </button>`;
}

function renderTweedeLeven() {
  // Vlees, vis en vleeswaren krijgen nooit een tweede leven: te veel risico als ze niet meer goed smaken.
  const metIdeeen = PRODUCTEN.filter(p => p.tweedeLeven.length && p.categorie !== 'vlees');
  const cats = CATEGORIEEN.filter(c => metIdeeen.some(p => p.categorie === c.id));
  const lijst = metIdeeen.filter(p => !tlFilter || p.categorie === tlFilter);

  $('#tl-body').innerHTML = `
    <div class="tl-note">${icoon('match', 'tl-note-icon')}<p><b>Only for food that’s still good.</b> Past its best but still edible? Check it under Search first. Whatever gets “Ghosted” gets no second chance. Never meat, fish or cold cuts: if it doesn’t taste right anymore, it goes.</p></div>

    <div class="section-head"><h2>Recipes</h2></div>
    <div class="recipe-row">${plusReceptKaart()}${RECEPTEN.map(receptKaart).join('')}</div>

    <div class="section-head"><h2>By product</h2></div>
    <div class="chips scroll-x tip-filter">
      <button class="chip ${!tlFilter ? 'on' : ''}" data-tlcat="">All</button>
      ${cats.map(c => `<button class="chip ${tlFilter === c.id ? 'on' : ''}" data-tlcat="${c.id}">${c.kort}</button>`).join('')}
    </div>
    <div class="idea-list">${lijst.map(p => `
      <article class="idea-card">
        <button class="idea-head" data-product="${p.id}" style="--kleur:${p.kleur}">
          ${icoon(p.id, 'idea-icon')}<span><b>${esc(naamDelen(p).titel)}</b><small>Check if it’s still good ›</small></span>
        </button>
        <ul class="ideas">${p.tweedeLeven.map(t => `<li>${esc(t)}</li>`).join('')}</ul>
        ${receptKnoppen(p.id)}
      </article>`).join('')}
    </div>`;

  const body = $('#tl-body');
  body.querySelectorAll('[data-recept]').forEach(b => b.onclick = () => openRecept(b.dataset.recept));
  const eigenRecept = $('#eigen-recept-knop');
  if (eigenRecept) eigenRecept.onclick = () => openEigenRecept();
  body.querySelectorAll('[data-product]').forEach(b => b.onclick = () => openProduct(b.dataset.product));
  body.querySelectorAll('[data-tlcat]').forEach(b => b.onclick = () => { tlFilter = b.dataset.tlcat || null; renderTweedeLeven(); });
}

// Knopjes naar de recepten waarin dit product gered wordt (ook gebruikt op de productpagina).
function receptKnoppen(productId) {
  if (productById(productId)?.categorie === 'vlees') return '';
  const r = RECEPTEN.filter(x => x.redt.includes(productId));
  return r.length ? `<div class="recipe-links">${r.map(x => `<button class="pill-link recipe-link" data-recept="${x.id}">Recipe: ${esc(x.titel)}</button>`).join('')}</div>` : '';
}

function openRecept(id) {
  const r = RECEPTEN.find(x => x.id === id);
  if (!r) return;
  const gered = r.redt.map(productById).filter(Boolean);
  $('#recept-body').innerHTML = `
    <div class="recipe-hero" style="--kleur:${r.kleur}">${icoon(r.icoon, 'recipe-hero-icon')}</div>
    <span class="kicker">${r.eigen ? 'Your own recipe' : `Second chance · ${r.tijd}`}</span>
    <h2 class="sheet-title">${esc(r.titel)}</h2>
    ${r.eigen ? '' : `<p>${esc(r.intro)}</p>`}
    <h3>You’ll need</h3>
    <ul class="ideas">${r.ingredienten.map(i => `<li>${esc(i)}</li>`).join('')}</ul>
    <h3>How to make it</h3>
    <ol class="steps">${r.stappen.map(s => `<li>${esc(s)}</li>`).join('')}</ol>
    <h3>This recipe saves</h3>
    <div class="recent-row saved-row">${gered.map(p => `<button class="recent-card" data-product="${p.id}" style="--kleur:${p.kleur}">${icoon(p.id)}<span>${esc(naamDelen(p).titel)}</span></button>`).join('')}</div>`;
  $('#recept-body').insertAdjacentHTML('beforeend', eigenReceptKnoppen(r));
  koppelEigenRecept(r);
  $('#recept-body').querySelectorAll('[data-product]').forEach(b => b.onclick = () => { $('#recept-sheet').close(); openProduct(b.dataset.product); });
  $('#recept-sheet').showModal();
  $('#recept-body').scrollTop = 0;
}
