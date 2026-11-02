// De productlijst. Eén blok per productgroep, in eigen woorden, gebaseerd op de bronnen onderaan elk product.
// Alle teksten voor de gebruiker zijn Engels (internationaal); de zoekwoorden bevatten Engels én Nederlands.
//
// Hoe het oordeel werkt:
// - vragen: korte vragen op de productpagina (waar bewaard? geopend?). Het antwoord kiest een situatie.
// - situaties: de eerste situatie waarvan alle voorwaarden ('als') kloppen, telt.
//     tijd:    welke datum je invult (zie TIJD): de datum op de verpakking, de dag van openen of de dag van invriezen.
//     match:   tot en met zoveel dagen → "It's a match!"
//     twijfel: tot en met zoveel dagen → "Take a closer look."
//     daarna:  wat erna komt: 'twijfel' (je zintuigen beslissen) of 'ghost' (de bronnen raden het niet meer aan).
//     houdbaar: één zin met de vuistregel voor deze situatie.
//   De grenzen komen uit de bronnen; staat er in de bron geen getal, dan kiezen we de voorzichtige kant.
// - weg: tekenen van bederf. Tik je er één aan, dan is het altijd "Ghosted", wat de datum ook zegt.
// - We zeggen nooit "veilig": het blijft een inschatting, de gebruiker beslist.
// Interne waarden ('THT', 'TGT', 'koel', 'open' enz.) blijven Nederlands; alleen de teksten zijn vertaald.

const TIJD = {
  datum: { vraag: 'What date is on the package?', verleden: false },
  open: { vraag: 'When did you open it?', verleden: true },
  vriezer: { vraag: 'When did you freeze it?', verleden: true },
  gekookt: { vraag: 'When did you cook it?', verleden: true },
  gekocht: { vraag: 'When did you buy it?', verleden: true },
};

const CATEGORIEEN = [
  { id: 'brood', label: 'Bread', kort: 'Bread', kleur: '#fdecc8' },
  { id: 'zuivel', label: 'Dairy and eggs', kort: 'Dairy', kleur: '#dfeafb' },
  { id: 'kaas', label: 'Cheese', kort: 'Cheese', kleur: '#fff2b8' },
  { id: 'vlees', label: 'Meat, fish and veggie', kort: 'Meat & fish', kleur: '#fde0da' },
  { id: 'vers', label: 'Fruit and vegetables', kort: 'Fruit & veg', kleur: '#e3f1df' },
  { id: 'groente', label: 'Ready meals and leftovers', kort: 'Ready meals', kleur: '#e2eefb' },
  { id: 'diepvries', label: 'Frozen', kort: 'Frozen', kleur: '#e2eefb' },
  { id: 'voorraad', label: 'Pantry', kort: 'Pantry', kleur: '#fde6cf' },
];

const BRON = {
  vc: { naam: 'Voedingscentrum (Netherlands Nutrition Centre): two kinds of date labels', url: 'https://www.voedingscentrum.nl/encyclopedie/houdbaarheidsdatums-tht-tgt.aspx' },
  cb: { naam: 'Consumentenbond (Dutch consumer association): about best-before dates', url: 'https://www.consumentenbond.nl/duurzamer-eten/houdbaarheidsdatum-voeding' },
  vb: { naam: 'Dutch food bank guideline, based on NVWA (stricter: for giving food away)', url: 'https://www.voedselbanknijmegen.nl/voedselpakket/kwaliteit-voedselveiligheid/' },
  bw: slug => ({ naam: 'Voedingscentrum storage guide', url: `https://www.voedingscentrum.nl/nl/thema/kopen-koken-bewaren/eten-bewaren/hoe-lang-kan-ik-bewaren/${slug}.aspx` }),
};

const VRAAG_OPEN = { id: 'open', label: 'Is it open yet?', opties: [{ id: 'dicht', label: 'Still sealed' }, { id: 'open', label: 'Already open' }] };

const PRODUCTEN = [
  {
    id: 'afbakbroodjes',
    naam: 'Bake-off rolls',
    kleur: '#fdecc8',
    zoek: ['bake off rolls', 'part baked rolls', 'part-baked', 'baguette', 'bread rolls', 'petit pain', 'afbak', 'afbakbrood', 'afbakbroodjes', 'pistolets', 'stokbrood afbak', 'broodjes'],
    categorie: 'brood',
    datum: 'THT',
    vragen: [
      { id: 'plek', label: 'Where did you keep them?', opties: [{ id: 'gewoon', label: 'Cupboard or fridge' }, { id: 'vriezer', label: 'In the freezer' }] },
      { ...VRAAG_OPEN, alleenAls: { plek: 'gewoon' } },
    ],
    situaties: [
      { als: { plek: 'vriezer' }, tijd: 'vriezer', match: 90, twijfel: 180, daarna: 'twijfel',
        houdbaar: 'In the freezer they stay tasty for 1 to 3 months. After that they’re not dangerous, just drier.' },
      { als: { plek: 'gewoon', open: 'dicht' }, tijd: 'datum', match: 14, twijfel: 60, daarna: 'ghost',
        houdbaar: 'Packaged bread can last up to about 2 months past the date, as long as the package is intact and you see no mould. The longer, the drier.' },
      { als: { plek: 'gewoon', open: 'open' }, tijd: 'open', match: 2, twijfel: 4, daarna: 'ghost',
        houdbaar: 'Once open they keep for 2 to 4 days, preferably in the fridge. Want to keep them longer? Freeze them.' },
    ],
    check: [
      'Look all around the bag, including the bottom and between the rolls: do you see green, white or black fuzz?',
      'Is the package still intact and not puffed up?',
      'Have a sniff: musty or sour is a bad sign.',
    ],
    weg: ['Mould, even on just one roll', 'A musty or sour smell', 'A torn or puffed-up package'],
    wegUitleg: 'If bread has mould, throw out the whole bag. Mould spreads further than you can see.',
    tip: 'Not using them soon? Freeze them. You can bake them straight from the freezer, a few minutes longer than usual.',
    tweedeLeven: ['Croutons for soup or salad', 'French toast', 'Breadcrumbs from the food processor'],
    bron: [BRON.bw('afbakbroodje'), { ...BRON.bw('focaccia'), naam: 'Voedingscentrum storage guide: packaged bread (focaccia)' }],
  },

  {
    id: 'kaas-goudse',
    naam: 'Hard cheese, Gouda, Edam, Cheddar',
    kleur: '#fff2b8',
    zoek: ['cheese', 'hard cheese', 'gouda', 'edam', 'cheddar', 'grated cheese', 'cheese slices', 'sliced cheese', 'parmesan', 'kaas', 'goudse', 'jonge kaas', 'belegen kaas', 'jong belegen', 'kaasplakken', 'plakken kaas', 'geraspte kaas', 'edammer', 'boerenkaas', 'halfzachte kaas', 'harde kaas'],
    categorie: 'kaas',
    datum: 'THT',
    vragen: [
      { id: 'plek', label: 'Where did you keep it?', opties: [{ id: 'koelkast', label: 'In the fridge' }, { id: 'vriezer', label: 'In the freezer' }] },
      { id: 'open', label: 'How is it packed?', alleenAls: { plek: 'koelkast' }, opties: [{ id: 'dicht', label: 'Sealed (foil or vacuum)' }, { id: 'open', label: 'Open, or loose from the cheese shop' }] },
      { id: 'vorm', label: 'What kind of piece?', alleenAls: { plek: 'koelkast', open: 'open' }, opties: [{ id: 'stuk', label: 'A block' }, { id: 'plakken', label: 'Slices' }, { id: 'geraspt', label: 'Grated' }] },
    ],
    situaties: [
      { als: { plek: 'vriezer' }, tijd: 'vriezer', match: 60, twijfel: 120, daarna: 'twijfel',
        houdbaar: 'Frozen cheese keeps for 2 to 4 months. After thawing it gets a bit crumbly: great for grating or cooking.' },
      { als: { plek: 'koelkast', open: 'dicht' }, tijd: 'datum', match: 60, twijfel: 120, daarna: 'twijfel',
        houdbaar: 'Sealed hard cheese can last up to about 2 months past the date, often longer, if the package is intact and it looks fine.' },
      { als: { plek: 'koelkast', open: 'open', vorm: 'stuk' }, tijd: 'open', match: 7, twijfel: 14, daarna: 'twijfel',
        houdbaar: 'An open block of cheese keeps for about a week in the fridge. After that: look, smell and taste.' },
      { als: { plek: 'koelkast', open: 'open', vorm: 'plakken' }, tijd: 'open', match: 4, twijfel: 7, daarna: 'ghost',
        houdbaar: 'Open slices keep for about 4 days in the fridge.' },
      { als: { plek: 'koelkast', open: 'open', vorm: 'geraspt' }, tijd: 'open', match: 2, twijfel: 3, daarna: 'ghost',
        houdbaar: 'Open grated cheese only keeps for 2 to 3 days. Freezing works fine, even in the bag.' },
    ],
    check: [
      'Look for mould. On a block of hard cheese you may cut away a small spot generously: at least 1 centimetre around it.',
      'Smell: a sharp ammonia smell, or anything that doesn’t smell like cheese, is not good.',
      'A bit dried out or sweaty isn’t spoilage, just less tasty.',
    ],
    weg: ['Mould on slices or grated cheese', 'Lots of mould, or mould deep in the block', 'A strange, sharp smell'],
    wegUitleg: 'Cutting mould away only works on a block of hard cheese with a small spot. Slices and grated cheese go in the bin.',
    tip: 'Keep cheese well wrapped in the fridge, for example in cheese paper or cling film. That way it won’t sweat or dry out.',
    tweedeLeven: ['Grate dried-out cheese over pasta or a bake', 'Grilled cheese sandwiches', 'Puff pastry cheese straws'],
    bron: [BRON.bw('kaas-48-plus-jong-goudse'), BRON.bw('geraspte-kaas'), BRON.cb],
  },


  {
    id: 'yoghurt',
    naam: 'Yoghurt',
    kleur: '#dfeafb',
    zoek: ['yoghurt', 'yogurt', 'greek yoghurt', 'greek yogurt', 'quark', 'skyr', 'griekse yoghurt', 'volle yoghurt', 'magere yoghurt', 'kwark'],
    categorie: 'zuivel',
    datum: 'THT',
    vragen: [VRAAG_OPEN],
    situaties: [
      { als: { open: 'dicht' }, tijd: 'datum', match: 5, twijfel: 14, daarna: 'ghost',
        houdbaar: 'Sealed yoghurt that stayed in the fridge is usually fine for a few days to a week past the date.' },
      { als: { open: 'open' }, tijd: 'open', match: 5, twijfel: 7, daarna: 'ghost',
        houdbaar: 'Once open, yoghurt keeps for 5 to 7 days in the fridge.' },
    ],
    check: [
      'Check for mould, also along the edge and on the lid.',
      'Smell: fresh and tangy is normal, but very sour, yeasty or musty is not.',
      'Taste a little: bitter means it has gone off.',
      'A layer of liquid on top is normal; just stir it in.',
    ],
    weg: ['Mould', 'A bulging pack, or one that hisses when opened', 'Lumpy and watery, or bitter'],
    wegUitleg: 'If you see mould on yoghurt, throw out the whole pot, not just the top layer.',
    tip: 'Put yoghurt back in the fridge right after serving and use a clean spoon. That keeps moulds out.',
    tweedeLeven: ['In pancake or cake batter', 'Marinade for meat or vegetables', 'Smoothie or overnight oats'],
    bron: [BRON.bw('yoghurt-vol'), BRON.cb, BRON.vb],
  },

  {
    id: 'eieren',
    naam: 'Eggs',
    kleur: '#e4edf8',
    zoek: ['egg', 'eggs', 'free range eggs', 'organic eggs', 'ei', 'eieren', 'eitjes', 'scharreleieren', 'vrije-uitloopeieren', 'biologische eieren'],
    categorie: 'zuivel',
    datum: 'THT',
    vragen: [
      { id: 'bereiding', label: 'How will you eat them?', opties: [{ id: 'gaar', label: 'Well cooked (hard-boiled, fried through, baked)' }, { id: 'zacht', label: 'Soft or raw (soft-boiled, runny yolk, mayo, tiramisu)' }] },
    ],
    situaties: [
      { als: { bereiding: 'zacht' }, tijd: 'datum', match: 0, twijfel: 0, daarna: 'ghost',
        houdbaar: 'After the date, don’t eat eggs soft or raw anymore. Well cooked is fine: the heat kills any bacteria.' },
      { als: { bereiding: 'gaar' }, tijd: 'datum', match: 3, twijfel: 7, daarna: 'ghost',
        houdbaar: 'Well cooked, eggs can still be eaten a few days past the date. The sources don’t recommend longer.' },
    ],
    check: [
      'The water test: put the egg in a glass of water. Does it sink and lie flat? Fresh. Does it stand upright? Older. Does it float? Bin it.',
      'Crack the egg into a small bowl first and smell it. A sulphur or rotten-egg smell means bin it.',
      'A cracked or dirty shell? Don’t eat those eggs.',
    ],
    weg: ['The egg floats in water', 'A sulphur or rotten-egg smell', 'A cracked shell'],
    wegUitleg: 'Unsure about one egg? Crack each egg into a separate bowl, so you don’t lose the whole pan.',
    tip: 'Keep eggs in their box in the fridge, pointy end down. They stay fresh longer and don’t pick up smells.',
    tweedeLeven: ['Hard-boiled in an egg salad', 'Quiche or oven-baked frittata', 'Baking: cake, brownies or pancakes'],
    bron: [BRON.bw('ei-rauw'), BRON.cb],
  },
];

// ---------- Uitbreiding naar 40 producten ----------
// Kortere schrijfwijze voor een situatie: S(voorwaarden, soort datum, match, twijfel, daarna, vuistregel, extra).
const S = (als, tijd, match, twijfel, daarna, houdbaar, extra = {}) => ({ als, tijd, match, twijfel, daarna, houdbaar, ...extra });
// Bron noemt geen termijn na de datum: dat zeggen we er eerlijk bij.
const GEEN = { geenTermijn: true };

const VRAAG_PLEK = (koel = 'In the fridge') => ({ id: 'plek', label: 'Where did you keep it?', opties: [{ id: 'koel', label: koel }, { id: 'vriezer', label: 'In the freezer' }] });
const VRAAG_PLEK_TGT = { id: 'plek', label: 'Where did you keep it?', opties: [{ id: 'koel', label: 'In the fridge' }, { id: 'vriezer', label: 'Frozen before the date' }] };
const VRAAG_SOORT = { id: 'soort', label: 'What kind of date is on it?', opties: [{ id: 'tgt', label: 'Use by' }, { id: 'tht', label: 'Best before' }] };

// Gedeeld door vers vlees, vis en vleeswaren
const VLEES_CHECK = ['Smell it right after opening: a sour or off smell means bin it.', 'Check the colour: grey or greenish is not good.', 'Feel it: sticky or slimy is a no.'];
const VLEES_WEG = ['A sour or off smell', 'Grey or greenish colour', 'Sticky or slimy'];
const VLEES_UITLEG = 'You can’t always see, smell or taste harmful bacteria in meat and fish. In doubt? Don’t.';
const VRIES_VLEES = S({ plek: 'vriezer' }, 'vriezer', 90, 180, 'twijfel', 'Frozen before the date, it keeps for about 3 months. After that it’s not dangerous, but it may taste dry or rancid.');
// Gedeeld door gekoelde zuivel
const ZUIVEL_CHECK = ['Check for mould, also on the lid or cap.', 'Smell: sour, yeasty or musty is not good.', 'Taste a little: bitter or strange? Don’t.'];
// Gedeeld door de voorraadkast
const DROOG_CHECK = ['Check that the package stayed intact and dry.', 'See bugs, webbing or mould? Bin it.', 'Smell: musty or rancid means the quality is gone.'];
const DROOG_WEG = ['Bugs or webbing in the pack', 'Mould', 'A musty or rancid smell'];
const DROOG_TIP = 'Store cool, dry, dark and well sealed. Put an open pack in a tightly closing container to keep bugs out.';

PRODUCTEN.push(
  // ======================= BROOD =======================
  {
    id: 'brood', naam: 'Bread, sliced', kleur: '#fdecc8', categorie: 'brood', datum: 'THT',
    zoek: ['bread', 'sliced bread', 'loaf', 'white bread', 'brown bread', 'wholemeal', 'sourdough', 'toast bread', 'brood', 'boterhammen', 'volkorenbrood', 'witbrood', 'bruinbrood', 'tarwebrood', 'meergranen', 'sneetjes', 'casino'],
    vragen: [VRAAG_PLEK('In the bread bin or bag')],
    situaties: [
      S({ plek: 'vriezer' }, 'vriezer', 90, 180, 'twijfel', 'Frozen bread keeps for 1 to 3 months. After that it dries out more and more.'),
      S({ plek: 'koel' }, 'datum', 0, 4, 'twijfel', 'Once open, bread usually tastes good for 2 to 4 days. After that it gets dry: fine for toast or a toastie.', GEEN),
    ],
    check: ['Check every slice, including the crust and the bottom: any fuzz or spots?', 'Smell inside the bag: musty is a bad sign.'],
    weg: ['Mould, even on just one slice', 'A musty smell'],
    wegUitleg: 'If there’s mould, throw out the whole loaf. Mould spreads further than you can see.',
    tip: 'Freeze bread in portions right after buying it and take out what you need each day. In the fridge it actually goes stale faster.',
    tweedeLeven: ['Toast it or make a toastie', 'French toast', 'Croutons or breadcrumbs', 'Bread pudding'],
    bron: [BRON.bw('tarwebrood')],
  },
  {
    id: 'wraps', naam: 'Wraps and tortillas', kleur: '#fbe7c6', categorie: 'brood', datum: 'THT',
    zoek: ['wrap', 'wraps', 'tortilla', 'tortillas', 'pita', 'pitta', 'naan', 'flatbread', 'pitabrood', 'naanbrood'],
    vragen: [VRAAG_OPEN],
    situaties: [
      S({ open: 'dicht' }, 'datum', 60, 120, 'twijfel', 'Sealed in an intact package, wraps are fine up to about 2 months past the date.'),
      S({ open: 'open' }, 'open', 2, 5, 'twijfel', 'Once open, keep wraps in the fridge: about 2 days, then look, smell and taste. Freezing works for up to 6 months.'),
    ],
    check: ['Look for mould spots, also between the wraps.', 'Hard and dry is fine: warm them up and they’re soft again.'],
    weg: ['Mould', 'A musty or sour smell'],
    wegUitleg: 'If you see mould, throw out the whole stack.',
    tip: 'Not finishing the pack in time? Freeze the wraps with a piece of baking paper between them. Then you can grab one at a time.',
    tweedeLeven: ['Crispy oven-baked tortilla chips', 'Quesadilla', 'Mini pizzas'],
    bron: [BRON.bw('wrap-ongevuld-alle-soorten')],
  },
  {
    id: 'crackers', naam: 'Crackers and rusks', kleur: '#f8e2b5', categorie: 'brood', datum: 'THT',
    zoek: ['crackers', 'cracker', 'rusk', 'rusks', 'crispbread', 'rice cakes', 'toast', 'cream crackers', 'beschuit', 'knäckebröd', 'knackebrod', 'rijstwafels'],
    vragen: [VRAAG_OPEN],
    situaties: [
      S({ open: 'dicht' }, 'datum', 60, 120, 'twijfel', 'Sealed in an intact package, crackers are fine up to about 2 months past the date.'),
      S({ open: 'open' }, 'open', 30, 60, 'twijfel', 'Once open they stay tasty in the cupboard for about a month, if you close the pack well.'),
    ],
    check: DROOG_CHECK,
    weg: DROOG_WEG,
    wegUitleg: 'Soft or less crunchy isn’t spoilage. Bugs, mould or a rancid smell are.',
    tip: DROOG_TIP,
    tweedeLeven: ['Soft crackers: 5 minutes in the oven makes them crunchy again', 'Crumbled as a crumble topping or coating'],
    bron: [BRON.bw('cracker-volkoren')],
  },

  // ======================= ZUIVEL =======================
  {
    id: 'vla', naam: 'Custard and desserts', kleur: '#f3e1cf', categorie: 'zuivel', datum: 'THT',
    zoek: ['custard', 'pudding', 'dessert', 'desserts', 'chocolate pudding', 'chocolate mousse', 'rice pudding', 'vla', 'chocoladevla', 'vanillevla', 'toetje', 'toetjes', 'griesmeelpudding', 'chocolademousse'],
    vragen: [VRAAG_OPEN],
    situaties: [
      S({ open: 'dicht' }, 'datum', 1, 3, 'ghost', 'Desserts are usually still fine a few days past the date. Look, smell and taste.'),
      S({ open: 'open' }, 'open', 4, 6, 'ghost', 'Once open, custard keeps for 4 to 6 days in the fridge.'),
    ],
    check: ZUIVEL_CHECK,
    weg: ['Lumpy or watery', 'Sour smell', 'Bitter taste', 'Mould'],
    wegUitleg: 'Bitter or sour custard has gone off. Bin it.',
    tip: 'Serve custard with a clean spoon and put the pack straight back in the fridge.',
    tweedeLeven: ['As a sauce over a slice of cake', 'Freeze it into ice lollies'],
    bron: [BRON.bw('vla-chocolade-vol'), BRON.cb, BRON.vb],
  },
  {
    id: 'roomboter', naam: 'Butter', kleur: '#fff4c7', categorie: 'zuivel', datum: 'THT',
    zoek: ['butter', 'margarine', 'spread', 'baking butter', 'boter', 'roomboter', 'halvarine', 'bakboter', 'kuipje boter'],
    vragen: [VRAAG_OPEN],
    situaties: [
      S({ open: 'dicht' }, 'datum', 60, 120, 'twijfel', 'Sealed butter is fine up to about 2 months past the date, if the package is intact.'),
      S({ open: 'open' }, 'open', 30, 45, 'twijfel', 'Once open, butter keeps for about a month in the fridge.'),
    ],
    check: ['Smell: rancid or sour means the butter has gone off.', 'Check the colour: darkened edges are not good.'],
    weg: ['Rancid or sour smell', 'Darkened colour', 'Mould'],
    wegUitleg: 'Rancid butter doesn’t taste good anymore. Bin it.',
    tip: 'Butter can go in the freezer for up to 6 months. Keep it in its wrapper or wrap it in foil, so no air gets to it.',
    tweedeLeven: ['Baking: cookies or cake', 'Herb butter'],
    bron: [BRON.bw('roomboter-ongezouten')],
  },

  // ======================= KAAS =======================

  // ======================= VLEES, VIS EN VEGA =======================
  {
    id: 'rookworst', naam: 'Smoked sausage', kleur: '#f6dccb', categorie: 'vlees', datum: 'kies',
    zoek: ['smoked sausage', 'sausage', 'frankfurter', 'hot dog', 'bratwurst', 'kielbasa', 'rookworst', 'unox', 'worst', 'knakworst', 'knakworstjes', 'braadworst'],
    vragen: [VRAAG_SOORT, VRAAG_PLEK_TGT, { ...VRAAG_OPEN, alleenAls: { plek: 'koel' } }],
    situaties: [
      VRIES_VLEES,
      S({ plek: 'koel', open: 'open' }, 'open', 2, 2, 'ghost', 'Once open, eat smoked sausage within 2 days.'),
      S({ soort: 'tgt', plek: 'koel' }, 'datum', 0, 0, 'ghost', 'Does it say “use by”? Then eat it on the date at the latest.'),
      S({ soort: 'tht', plek: 'koel' }, 'datum', 0, 2, 'ghost', 'Does it say “best before”? Then it can still be fine shortly after the date, if it looks and smells good.', GEEN),
    ],
    check: VLEES_CHECK,
    weg: VLEES_WEG, wegUitleg: VLEES_UITLEG,
    tip: 'Smoked sausage freezes well, for up to 3 months. Thaw it in the fridge and heat it through properly.',
    tweedeLeven: [],
    bron: [BRON.bw('rookworst-ambachtelijk-gekookt'), BRON.vc],
  },
  {
    id: 'vega-gehakt', naam: 'Meat substitutes', kleur: '#e8efd9', categorie: 'vlees', datum: 'kies',
    zoek: ['meat substitute', 'meat alternative', 'veggie burger', 'vegan burger', 'vegetarian mince', 'plant based', 'tofu', 'tempeh', 'seitan', 'vegetarian', 'vegan', 'vegetarisch gehakt', 'vega gehakt', 'vegaburger', 'vleesvervanger', 'vegetarische burger', 'vegetarisch', 'kipstuckjes vega'],
    vragen: [VRAAG_SOORT, VRAAG_PLEK('In the fridge'), { ...VRAAG_OPEN, alleenAls: { plek: 'koel' } }],
    situaties: [
      S({ plek: 'vriezer' }, 'vriezer', 90, 180, 'twijfel', 'In the freezer, meat substitutes keep for about 3 months.'),
      S({ plek: 'koel', open: 'open' }, 'open', 2, 2, 'ghost', 'Once open, eat meat substitutes within 2 days.'),
      S({ soort: 'tgt', plek: 'koel' }, 'datum', 0, 0, 'ghost', 'Does it say “use by”? Then eat it on the date at the latest.'),
      S({ soort: 'tht', plek: 'koel' }, 'datum', 0, 2, 'ghost', 'Does it say “best before”? Then it can still be fine shortly after the date, if it looks and smells good.', GEEN),
    ],
    check: ['Smell: an off or sour smell means bin it.', 'Look for mould or discolouration.', 'Dried-out edges are fine; slimy is not.'],
    weg: ['An off or sour smell', 'Mould or discolouration', 'Slimy'],
    wegUitleg: 'Veggie or not: in doubt, don’t.',
    tip: 'Keep them in the coldest spot in the fridge, or freeze them in time.',
    tweedeLeven: [],
    bron: [BRON.bw('vegetarisch-gehakt-onbereid'), BRON.vc],
  },

  // ======================= GROENTE EN KANT-EN-KLAAR =======================
  {
    id: 'sla', naam: 'Salad and pre-cut vegetables', kleur: '#e3f1df', categorie: 'vers', datum: 'TGT',
    zoek: ['salad', 'bagged salad', 'lettuce', 'iceberg', 'rocket', 'arugula', 'lambs lettuce', 'spinach', 'pre-cut vegetables', 'stir fry vegetables', 'soup vegetables', 'sla', 'zakje sla', 'ijsbergsla', 'rucola', 'veldsla', 'spinazie', 'voorgesneden groente', 'roerbakgroente', 'nasigroente', 'bamigroente', 'soepgroente', 'snijbonen gesneden'],
    vragen: [],
    situaties: [S({}, 'datum', 0, 0, 'ghost', 'Eat pre-cut vegetables in a bag by the date at the latest, preferably the same day you open them.')],
    check: ['A bag that’s slightly puffed up is often perfectly fine: it contains a special gas mixture.', 'Check that the vegetables look fresh: not limp, slimy or brown.', 'Smell: sour means bin it.'],
    weg: ['Slimy or mushy', 'Mould', 'A sour smell'],
    wegUitleg: 'Don’t eat pre-cut vegetables with a “use by” date after that date.',
    tip: 'Don’t store bags of salad next to apples, bananas or pears: they make salad spoil faster.',
    tweedeLeven: [],
    bron: [{ naam: 'Voedingscentrum: vegetables (pre-cut)', url: 'https://www.voedingscentrum.nl/encyclopedie/groente.aspx' }, BRON.bw('sla-krop-rauw')],
  },
  {
    id: 'hummus', naam: 'Hummus and dips', kleur: '#f6ead3', categorie: 'groente', datum: 'kies',
    zoek: ['hummus', 'houmous', 'dip', 'dips', 'tzatziki', 'guacamole', 'baba ganoush', 'spread', 'humus', 'smeersel'],
    vragen: [VRAAG_SOORT, VRAAG_OPEN],
    situaties: [
      S({ open: 'open' }, 'open', 5, 10, 'ghost', 'Once open, shop-bought hummus keeps for 5 to 10 days in the fridge. Homemade only 1 to 3 days.'),
      S({ soort: 'tgt' }, 'datum', 0, 0, 'ghost', 'Does it say “use by”? Then eat it on the date at the latest.'),
      S({ soort: 'tht' }, 'datum', 0, 3, 'ghost', 'Does it say “best before”? Then it can still be fine shortly after the date. Look, smell and taste.', GEEN),
    ],
    check: ['Check for mould.', 'Has it become discoloured or watery? Then don’t eat it.', 'Smell: sour or yeasty is not good.'],
    weg: ['Discoloured and watery', 'Mould', 'Sour or yeasty smell'],
    wegUitleg: 'Discoloured and watery means bin it, even if it’s still within the time.',
    tip: 'Scoop with a clean knife or spoon, not with bread you’ve already bitten. It can be frozen for up to 3 months.',
    tweedeLeven: ['As a sauce over roasted vegetables', 'Stirred into a pasta sauce'],
    bron: [BRON.bw('hummus-naturel'), BRON.vc],
  },
  {
    id: 'restjes', naam: 'Leftovers, home-cooked', kleur: '#e2eefb', categorie: 'groente', datum: 'zelf',
    zoek: ['leftovers', 'leftover', 'cooked pasta', 'cooked rice', 'dinner', 'meal', 'home cooked', 'meal prep', 'soup', 'takeaway', 'restjes', 'restje', 'kliekjes', 'gekookte pasta', 'gekookte rijst', 'avondeten', 'maaltijd', 'zelf gekookt', 'soep'],
    vragen: [VRAAG_PLEK('In the fridge')],
    situaties: [
      S({ plek: 'vriezer' }, 'vriezer', 90, 180, 'twijfel', 'Frozen leftovers keep for about 3 months. After that the quality goes down.'),
      S({ plek: 'koel' }, 'gekookt', 2, 2, 'ghost', 'Eat leftovers within 2 days. Can’t manage that? Freeze them in time.'),
    ],
    check: ['Did it go in the fridge within 2 hours of cooking? If not, better not.', 'Reheat leftovers thoroughly: piping hot, also in the middle.', 'Smell and look: sour or mould means bin it.'],
    weg: ['Left out of the fridge for more than 2 hours', 'A sour smell', 'Mould'],
    wegUitleg: 'Food that was left out of the fridge for a long time can contain bacteria you can’t see or smell.',
    tip: 'Let leftovers cool quickly, put them in the fridge well covered, and freeze in portions.',
    tweedeLeven: ['Pasta: a frittata or pasta salad', 'Rice: fried rice (piping hot)', 'Vegetables: soup or a wrap'],
    bron: [BRON.bw('pasta-gekookt')],
  },

  // ======================= VOORRAADKAST =======================
  {
    id: 'chips', naam: 'Crisps and nuts', kleur: '#fff2b8', categorie: 'voorraad', datum: 'THT',
    zoek: ['crisps', 'chips', 'potato chips', 'nachos', 'tortilla chips', 'popcorn', 'nuts', 'peanuts', 'snacks', 'pretzels', 'tortillachips', 'nootjes', 'pinda', 'pindas', 'borrelnootjes', 'zoutjes'],
    vragen: [VRAAG_OPEN],
    situaties: [
      S({ open: 'dicht' }, 'datum', 60, 120, 'twijfel', 'A sealed bag is fine up to about 2 months past the date, if the package is intact.'),
      S({ open: 'open' }, 'open', 5, 14, 'twijfel', 'An open bag gets less crunchy after 2 to 5 days. Not a problem, just less tasty.'),
    ],
    check: ['Smell: rancid or musty means the oil has gone off.', 'Soft is fine: 5 minutes in the oven makes them crispy again.'],
    weg: ['Rancid smell or taste', 'Mould'],
    wegUitleg: 'Rancid tastes nasty. Bin it.',
    tip: 'Close an open bag with a clip or put it in a sealed container.',
    tweedeLeven: ['Crumbled as a crunchy topping on a bake', 'Coating for chicken or fish'],
    bron: [BRON.bw('chips')],
  },
  {
    id: 'cornflakes', naam: 'Breakfast cereals', kleur: '#fdeab0', categorie: 'voorraad', datum: 'THT',
    zoek: ['cereal', 'cereals', 'cornflakes', 'muesli', 'granola', 'oats', 'porridge oats', 'breakfast cereal', 'cruesli', 'havermout', 'ontbijtgranen', 'brinta'],
    vragen: [],
    situaties: [S({}, 'datum', 60, 120, 'twijfel', 'Breakfast cereals are fine up to about 2 months past the date, if they look fine and the package is intact. Once open they stay tasty for a few months.')],
    check: DROOG_CHECK, weg: DROOG_WEG,
    wegUitleg: 'Bugs or a musty smell? Bin it.',
    tip: DROOG_TIP,
    tweedeLeven: ['Soft cornflakes: a few minutes in the oven makes them crunchy again', 'As a crunchy crumble topping'],
    bron: [BRON.bw('ontbijtproduct-cornflakes')],
  },
  {
    id: 'pindakaas', naam: 'Peanut butter and chocolate spread', kleur: '#f3dcc2', categorie: 'voorraad', datum: 'THT',
    zoek: ['peanut butter', 'chocolate spread', 'nutella', 'hazelnut spread', 'nut butter', 'speculoos spread', 'biscoff spread', 'pindakaas', 'chocopasta', 'hazelnootpasta', 'notenpasta', 'speculoospasta'],
    vragen: [],
    situaties: [S({}, 'datum', 60, 120, 'twijfel', 'Peanut butter is fine up to about 2 months past the date, often longer. Once open it keeps for up to a year in the cupboard.')],
    check: ['Smell and taste: rancid or different from normal means it has gone off.', 'A layer of oil on top is normal: just stir.'],
    weg: ['Rancid smell or taste', 'Mould'],
    wegUitleg: 'Rancid peanut butter doesn’t taste good anymore.',
    tip: 'Close the jar tightly and store it in a dry place. Use a clean knife.',
    tweedeLeven: ['Satay sauce', 'Stirred into oats or a smoothie'],
    bron: [BRON.bw('pindakaas')],
  },
  {
    id: 'jam', naam: 'Jam and sweet spreads', kleur: '#fbd9de', categorie: 'voorraad', datum: 'THT',
    zoek: ['jam', 'jelly', 'marmalade', 'honey', 'syrup', 'sprinkles', 'sweet spread', 'confiture', 'stroop', 'appelstroop', 'honing', 'hagelslag', 'vlokken', 'zoet beleg'],
    vragen: [],
    situaties: [S({}, 'datum', 365, 730, 'twijfel', 'All that sugar means jam doesn’t spoil quickly: up to a year past the date, often longer. Once open, up to a year in the cupboard or fridge.')],
    check: ['Check for mould.', 'Smell: yeasty or boozy means the jam is fermenting.'],
    weg: ['Mould', 'Yeasty or boozy smell'],
    wegUitleg: 'Mould on jam? Throw out the whole jar, not just the spot.',
    tip: 'Always scoop jam with a clean knife, without breadcrumbs. Then it keeps the longest.',
    tweedeLeven: ['Stirred into yoghurt', 'Sauce for pancakes', 'In a cake or crumble'],
    bron: [BRON.bw('jam')],
  },
  {
    id: 'pastasaus', naam: 'Pasta sauce and pesto, in a jar', kleur: '#fbdcd6', categorie: 'voorraad', datum: 'THT',
    zoek: ['pasta sauce', 'tomato sauce', 'pesto', 'green pesto', 'red pesto', 'curry sauce', 'stir fry sauce', 'sauce in a jar', 'passata', 'tomato puree', 'tomato paste', 'chopped tomatoes', 'pastasaus', 'tomatensaus', 'groene pesto', 'rode pesto', 'curry saus', 'wokasaus', 'saus in pot', 'tomatenpuree', 'tomatenblokjes'],
    vragen: [VRAAG_OPEN],
    situaties: [
      S({ open: 'dicht' }, 'datum', 60, 120, 'twijfel', 'A sealed jar is fine up to about 2 months past the date, if the jar is intact and the lid isn’t bulging.'),
      S({ open: 'open' }, 'open', 3, 5, 'ghost', 'Once open, pasta sauce keeps for about 3 days in the fridge, pesto about 4 days. You can freeze it for up to 3 months.'),
    ],
    check: ['Does the lid pop when you open it? Then the jar was properly sealed.', 'Check for mould, also under the lid.', 'Smell: sour or yeasty is not good.'],
    weg: ['A bulging lid, or a jar that doesn’t pop', 'Mould', 'Sour or yeasty smell'],
    wegUitleg: 'Mould in a jar of sauce? Then the whole jar goes.',
    tip: 'Half a jar left? Freeze the rest in a container. Instant quick meal for later.',
    tweedeLeven: ['Shakshuka', 'Base for a soup or a bake'],
    bron: [BRON.bw('pastasaus-zonder-vlees'), BRON.bw('pesto')],
  },
  {
    id: 'bonen-blik', naam: 'Tins and jars, vegetables, beans, fruit, soup', kleur: '#e3f1df', categorie: 'voorraad', datum: 'THT',
    zoek: ['tin', 'can', 'canned', 'tinned', 'jar', 'beans', 'kidney beans', 'baked beans', 'chickpeas', 'lentils', 'sweetcorn', 'corn', 'peas', 'beetroot', 'sauerkraut', 'pickles', 'gherkins', 'canned fruit', 'pineapple', 'peaches', 'apple sauce', 'tuna', 'sardines', 'canned soup', 'ravioli', 'blik', 'blikje', 'conserven', 'pot', 'bonen', 'kidneybonen', 'bruine bonen', 'witte bonen', 'kikkererwten', 'linzen', 'mais', 'doperwten', 'sperziebonen in pot', 'rode bieten', 'zuurkool', 'augurken', 'tomatenblokjes', 'groente in pot', 'fruit in blik', 'ananas', 'perziken', 'appelmoes', 'tonijn in blik', 'soep in blik', 'ravioli in blik', 'knakworst in blik'],
    vragen: [VRAAG_OPEN],
    situaties: [
      S({ open: 'dicht' }, 'datum', 365, 730, 'twijfel', 'An intact tin or sealed jar is often still fine a year or more past the date.'),
      S({ open: 'open' }, 'open', 2, 3, 'ghost', 'Once open, put the rest in a container and eat it within 2 days. You can freeze it for up to 3 months.'),
    ],
    check: ['Is the tin bulging, dented at the seam, rusty or leaking?', 'Does it spurt when opened or smell strange? Don’t eat it.', 'Check for mould.'],
    weg: ['A bulging, leaking or rusty tin', 'Spurts when opened', 'Mould or a strange smell'],
    wegUitleg: 'A bulging tin can mean bacteria are growing inside. Don’t open it, just throw it away.',
    tip: 'Store tins and jars cool, dry and dark. Put the oldest tin at the front.',
    tweedeLeven: ['Beans: chilli, soup or a dip', 'Chickpeas: hummus or roasted until crispy'],
    bron: [BRON.bw('bruine-bonen-blik-glas'), BRON.vb],
  },
);

// ---------- Uitbreiding: groente en fruit, diepvries en meer voorraad ----------
// Losse groente en fruit hebben geen datum: je telt vanaf de dag dat je het kocht (tijd 'gekocht').
const VRIES_LOS = (match, twijfel, tekst) => S({ plek: 'vriezer' }, 'vriezer', match, twijfel, 'twijfel', tekst);
const VERS_CHECK = ['Look for mould or rotten, wet spots.', 'Feel: limp or wrinkly is fine, slimy is not.', 'Smell: sour or rotten means bin it.'];
const VERS_WEG = ['Mould', 'Rotten, wet or slimy', 'A sour or rotten smell'];
const DIEPVRIES = 'Frozen products are fine up to a year past the date, often longer, as long as the package is intact and it has stayed frozen the whole time.';

PRODUCTEN.push(
  // ======================= GROENTE EN FRUIT =======================
  {
    id: 'banaan', naam: 'Bananas', kleur: '#fff2b8', categorie: 'vers', datum: 'los',
    zoek: ['banana', 'bananas', 'brown banana', 'ripe banana', 'banaan', 'bananen', 'bruine banaan', 'rijpe banaan'],
    vragen: [{ id: 'plek', label: 'Where did you keep them?', opties: [{ id: 'schaal', label: 'In the fruit bowl' }, { id: 'vriezer', label: 'In the freezer' }] }],
    situaties: [
      VRIES_LOS(240, 365, 'Peeled and frozen, bananas keep for 8 to 12 months. Perfect for smoothies or banana bread.'),
      S({ plek: 'schaal' }, 'gekocht', 3, 7, 'twijfel', 'In the fruit bowl, bananas stay tasty for 3 to 7 days. After that they get brown and sweeter: ideal for baking.'),
    ],
    check: ['A brown or spotty peel is fine: the banana is actually extra sweet.', 'Peel it: black, mushy or yeasty-smelling flesh is a no.'],
    weg: ['Mould', 'Black and mushy inside', 'Smells yeasty or boozy'],
    wegUitleg: 'A brown peel is fine, black and mushy flesh is not.',
    tip: 'Keep bananas out of the fridge and away from other fruit: they make it ripen faster. Wrapping the stems in foil keeps them good for longer.',
    tweedeLeven: ['Banana bread', 'Smoothie', 'Banana and egg pancakes', 'Freeze for “nice cream”'],
    bron: [BRON.bw('banaan')],
  },
  {
    id: 'appel', naam: 'Apples and pears', kleur: '#fde0da', categorie: 'vers', datum: 'los',
    zoek: ['apple', 'apples', 'pear', 'pears', 'gala', 'pink lady', 'granny smith', 'appel', 'appels', 'peer', 'peren', 'elstar', 'jonagold'],
    vragen: [{ id: 'plek', label: 'Where did you keep them?', opties: [{ id: 'koel', label: 'In the fridge' }, { id: 'schaal', label: 'In the fruit bowl' }, { id: 'vriezer', label: 'In the freezer' }] }],
    situaties: [
      VRIES_LOS(240, 365, 'Frozen in slices, apples keep for 8 to 12 months. After that they’re best in apple sauce or pie.'),
      S({ plek: 'koel' }, 'gekocht', 30, 90, 'twijfel', 'In the fridge, apples keep for weeks to months.'),
      S({ plek: 'schaal' }, 'gekocht', 7, 14, 'twijfel', 'In the fruit bowl, apples stay tasty for about a week, then they get mealy.'),
    ],
    check: ['A wrinkly or mealy apple is fine: perfect for apple sauce or pie.', 'Cut a small bruise away generously.', 'Mould or rot around the core? Then bin it.'],
    weg: ['Mould', 'A large rotten or wet spot', 'A yeasty smell'],
    wegUitleg: 'Cut away a small bruise. Mould or rot means bin it.',
    tip: 'Apples last longest in the fridge’s vegetable drawer, away from other fruit and vegetables.',
    tweedeLeven: ['Apple sauce', 'Apple pie or crumble', 'Baked apples with cinnamon'],
    bron: [BRON.bw('appel-met-schil')],
  },
  {
    id: 'aardbeien', naam: 'Strawberries and berries', kleur: '#fbd9de', categorie: 'vers', datum: 'los',
    zoek: ['strawberries', 'strawberry', 'raspberries', 'blueberries', 'berries', 'blackberries', 'soft fruit', 'aardbeien', 'aardbei', 'frambozen', 'blauwe bessen', 'bessen', 'bramen', 'zacht fruit'],
    vragen: [{ id: 'plek', label: 'Where did you keep them?', opties: [{ id: 'koel', label: 'In the fridge' }, { id: 'schaal', label: 'On the counter' }, { id: 'vriezer', label: 'In the freezer' }] }],
    situaties: [
      VRIES_LOS(240, 365, 'Frozen strawberries keep for 8 to 12 months. After thawing they’re soft: great in smoothies or sauce.'),
      S({ plek: 'koel' }, 'gekocht', 1, 3, 'ghost', 'In the fridge, strawberries keep for 1 to 3 days.'),
      S({ plek: 'schaal' }, 'gekocht', 1, 1, 'ghost', 'Out of the fridge, eat strawberries the same day.'),
    ],
    check: ['Check the whole punnet, including the bottom: mould spreads fast.', 'Soft strawberries are fine, mouldy ones are not.'],
    weg: ['Mould', 'Mushy and leaking'],
    wegUitleg: 'Throw out mouldy strawberries and the ones touching them. Check the rest carefully.',
    tip: 'Leave the green tops on until you eat them and keep them dry, for example on kitchen paper.',
    tweedeLeven: ['Smoothie', 'Jam or compote', 'Freeze for later'],
    bron: [BRON.bw('aardbeien')],
  },
  {
    id: 'avocado', naam: 'Avocado', kleur: '#e8efd9', categorie: 'vers', datum: 'los',
    zoek: ['avocado', 'avocados', 'avocado’s'],
    vragen: [{ id: 'plek', label: 'Where did you keep it?', opties: [{ id: 'schaal', label: 'In the fruit bowl' }, { id: 'vriezer', label: 'In the freezer' }] }],
    situaties: [
      VRIES_LOS(240, 365, 'Mashed or in chunks, frozen avocado keeps for 8 to 12 months. Then it’s great in guacamole or a smoothie.'),
      S({ plek: 'schaal' }, 'gekocht', 3, 6, 'twijfel', 'In the fruit bowl, an avocado keeps for 1 to 6 days, depending on how ripe it was. Once ripe, it lasts a bit longer in the fridge.'),
    ],
    check: ['Brown threads or a few brown spots can be cut away.', 'Very soft, grey or sour-smelling flesh is a no.'],
    weg: ['Mould', 'Mostly brown or grey inside', 'A sour or rancid smell'],
    wegUitleg: 'Cut away a few brown spots, but not a grey or sour avocado.',
    tip: 'Half an avocado left? Leave the stone in, cover it and put it in the fridge.',
    tweedeLeven: ['Guacamole', 'On toast', 'In a smoothie'],
    bron: [BRON.bw('avocado')],
  },
  {
    id: 'champignons', naam: 'Mushrooms', kleur: '#f1e6d2', categorie: 'vers', datum: 'los',
    zoek: ['mushrooms', 'mushroom', 'button mushrooms', 'chestnut mushrooms', 'oyster mushrooms', 'champignons', 'champignon', 'paddenstoelen', 'kastanjechampignons', 'oesterzwammen'],
    vragen: [{ id: 'plek', label: 'Where did you keep them?', opties: [{ id: 'koel', label: 'In the fridge' }, { id: 'vriezer', label: 'In the freezer' }] }],
    situaties: [
      VRIES_LOS(90, 180, 'Blanched or fried and then frozen, mushrooms keep for 3 months.'),
      S({ plek: 'koel' }, 'gekocht', 3, 5, 'ghost', 'In the fridge, mushrooms keep for about 3 days.'),
    ],
    check: ['A few brown spots are fine.', 'Slimy, limp or sour-smelling? Then bin them.'],
    weg: ['Slimy', 'Mould', 'A sour smell'],
    wegUitleg: 'Slimy mushrooms go in the bin.',
    tip: 'Keep mushrooms in a paper bag or a closed container, not in plastic.',
    tweedeLeven: ['Mushroom soup', 'Stir-fried or in a pasta sauce'],
    bron: [BRON.bw('champignons-rauw')],
  },
  {
    id: 'broccoli', naam: 'Broccoli and cabbage', kleur: '#e3f1df', categorie: 'vers', datum: 'los',
    zoek: ['broccoli', 'cauliflower', 'brussels sprouts', 'cabbage', 'kale', 'green beans', 'leek', 'bloemkool', 'spruitjes', 'kool', 'boerenkool', 'spitskool', 'sperziebonen', 'prei'],
    vragen: [{ id: 'plek', label: 'Where did you keep it?', opties: [{ id: 'koel', label: 'In the fridge' }, { id: 'schaal', label: 'Out of the fridge' }, { id: 'vriezer', label: 'In the freezer' }] }],
    situaties: [
      VRIES_LOS(365, 540, 'Briefly blanched and frozen, broccoli keeps for a year.'),
      S({ plek: 'koel' }, 'gekocht', 3, 5, 'twijfel', 'In the fridge, broccoli keeps for 3 to 5 days.'),
      S({ plek: 'schaal' }, 'gekocht', 1, 2, 'twijfel', 'Out of the fridge, broccoli only keeps for 1 to 2 days.'),
    ],
    check: ['A bit of yellowing is fine: less tasty, but still perfectly edible.', 'Limp? Put it in cold water for a while.', 'Mould or a sour smell? Then bin it.'],
    weg: ['Mould', 'Slimy or brown and wet', 'A sour smell'],
    wegUitleg: 'Yellow is fine, mouldy or slimy is not.',
    tip: 'Keep broccoli in the fridge in an open bag or its packaging.',
    tweedeLeven: ['Broccoli soup', 'Oven bake', 'Stir fry'],
    bron: [BRON.bw('broccoli-rauw')],
  },

  // ======================= DIEPVRIES =======================

  // ======================= VOORRAADKAST (EXTRA) =======================
  {
    id: 'olie', naam: 'Oil and vinegar', kleur: '#f3f6d8', categorie: 'voorraad', datum: 'THT',
    zoek: ['oil', 'olive oil', 'sunflower oil', 'frying oil', 'cooking oil', 'vinegar', 'soy sauce', 'olie', 'olijfolie', 'zonnebloemolie', 'frituurolie', 'bakolie', 'azijn', 'sojasaus'],
    vragen: [],
    situaties: [S({}, 'datum', 60, 120, 'twijfel', 'Oil is fine up to about 2 months past the date, often longer. Once open it keeps for about a year.')],
    check: ['Smell and taste: rancid, sour or different from normal means the oil has gone off.', 'Darkened in colour? Don’t use it anymore.'],
    weg: ['Rancid or sour smell', 'Darkened colour'],
    wegUitleg: 'Rancid oil tastes nasty; don’t use it anymore.',
    tip: 'Store oil sealed, cool and dark, so not next to the stove.',
    tweedeLeven: [],
    bron: [BRON.bw('olijfolie')],
  },
  {
    id: 'koffie', naam: 'Coffee and tea', kleur: '#efdccd', categorie: 'voorraad', datum: 'THT',
    zoek: ['coffee', 'coffee beans', 'ground coffee', 'coffee pods', 'capsules', 'tea', 'tea bags', 'instant coffee', 'koffie', 'koffiebonen', 'gemalen koffie', 'koffiepads', 'cups', 'thee', 'theezakjes', 'oploskoffie'],
    vragen: [],
    situaties: [S({}, 'datum', 365, 730, 'twijfel', 'Dry coffee and tea are fine up to a year past the date, often longer, if kept dry. Once open, coffee does lose flavour after a few weeks.')],
    check: ['Smell it: less aroma means less flavour, not that it has gone off.', 'Got damp or mouldy? Then bin it.'],
    weg: ['Mould', 'Got damp'],
    wegUitleg: 'Damp or mouldy coffee or tea goes in the bin.',
    tip: 'Keep coffee and tea cool, dry and dark in a tightly closing jar.',
    tweedeLeven: ['Old coffee: in tiramisu or a coffee cake', 'Coffee grounds: as plant food'],
    bron: [BRON.bw('koffiebonen')],
  },
);

// ---------- Samengevoegde productgroepen en extra veelgezochte producten ----------
// Producten met (bijna) dezelfde regels staan samen in één groep. Verschillen de regels een beetje,
// dan geldt de voorzichtigste. De oude namen blijven vindbaar via 'zoek' en via ALIAS hieronder.
PRODUCTEN.push(
  // ---------- Zuivel ----------
  {
    id: 'melk', naam: 'Milk and milk alternatives', kleur: '#dfeafb', categorie: 'zuivel', datum: 'THT',
    zoek: ['milk', 'semi skimmed milk', 'whole milk', 'skimmed milk', 'buttermilk', 'long life milk', 'uht milk', 'chocolate milk', 'drinking yoghurt', 'oat milk', 'oat drink', 'oatly', 'soy milk', 'soya milk', 'almond milk', 'plant based milk', 'rice milk', 'melk', 'halfvolle melk', 'volle melk', 'magere melk', 'karnemelk', 'koemelk', 'houdbare melk', 'lang houdbare melk', 'koffiemelk', 'chocolademelk', 'drinkyoghurt', 'haverdrink', 'havermelk', 'sojamelk', 'sojadrink', 'amandelmelk', 'amandeldrink', 'plantaardige melk', 'rijstdrink'],
    vragen: [
      { id: 'soort', label: 'What kind of milk?', opties: [{ id: 'vers', label: 'From the chiller (fresh)' }, { id: 'houdbaar', label: 'Long-life, from the shelf' }, { id: 'plant', label: 'Plant-based, from the shelf' }] },
      VRAAG_OPEN,
    ],
    situaties: [
      S({ soort: 'plant', open: 'open' }, 'open', 5, 7, 'ghost', 'Once open, a plant-based drink keeps for 5 to 7 days in the fridge.'),
      S({ open: 'open' }, 'open', 7, 10, 'ghost', 'Once open, milk keeps for about a week in the fridge. After that: look, smell and taste.'),
      S({ soort: 'vers' }, 'datum', 1, 5, 'ghost', 'Don’t throw fresh milk away right after the date: look, smell and taste a sip.', GEEN),
      S({}, 'datum', 60, 365, 'twijfel', 'Sealed long-life milk and plant-based drinks from the shelf are often fine for months past the date.'),
    ],
    check: ['Is the carton not bulging?', 'Smell the carton: sour is not good.', 'Pour a little into a glass: lumps or flakes mean bin it.', 'Taste a sip: tastes normal? Then you’re good.'],
    weg: ['A bulging or leaking carton', 'Sour smell or taste', 'Lumps, flakes or chunks'],
    wegUitleg: 'Don’t drink sour or lumpy milk.',
    tip: 'Put milk back in the fridge right after pouring, not in the door but on a cold shelf. Long-life milk only needs the fridge once opened.',
    tweedeLeven: ['Pancakes or French toast', 'Porridge or rice pudding', 'Smoothie', 'A white sauce'],
    bron: [BRON.bw('melk-halfvol'), BRON.bw('lang-houdbare-melk'), BRON.bw('haverdrink'), BRON.vb],
  },
  {
    id: 'slagroom', naam: 'Cream and crème fraîche, whipping cream, cooking cream, sour cream', kleur: '#fdf0cc', categorie: 'zuivel', datum: 'THT',
    zoek: ['cream', 'whipping cream', 'double cream', 'single cream', 'cooking cream', 'sour cream', 'creme fraiche', 'crème fraîche', 'smetana', 'slagroom', 'room', 'kookroom', 'zure room', 'opklopbare room'],
    vragen: [VRAAG_OPEN],
    situaties: [
      S({ open: 'dicht' }, 'datum', 1, 3, 'ghost', 'Don’t throw cream away right after the date: look, smell and taste a little.', GEEN),
      S({ open: 'open' }, 'open', 4, 6, 'ghost', 'Once open, cream and crème fraîche keep for 4 to 7 days in the fridge.'),
    ],
    check: ZUIVEL_CHECK,
    weg: ['Lumpy or watery', 'Sour smell', 'Mould'],
    wegUitleg: 'Mould in a tub? Then the whole tub goes, not just the top.',
    tip: 'Scoop with a clean spoon. Freezing works, but the texture changes: use it in sauce or soup afterwards, not for whipping.',
    tweedeLeven: ['Pasta sauce or soup', 'Creamy oven bake', 'Herb dip'],
    bron: [BRON.bw('slagroom-ongeklopt'), BRON.bw('creme-fraiche-halfvol'), BRON.vb],
  },
  {
    id: 'gekookte-eieren', naam: 'Eggs, boiled', kleur: '#fdf0cc', categorie: 'zuivel', datum: 'zelf',
    zoek: ['boiled egg', 'boiled eggs', 'hard boiled egg', 'hard-boiled eggs', 'soft boiled egg', 'peeled egg', 'easter eggs', 'gekookt ei', 'gekookte eieren', 'hardgekookt ei', 'hardgekookte eieren', 'zachtgekookt ei', 'gepeld ei', 'paaseieren', 'eitje'],
    vragen: [{ id: 'soort', label: 'What kind of egg?', opties: [{ id: 'hard', label: 'Hard-boiled, still in the shell' }, { id: 'gepeld', label: 'Hard-boiled and peeled' }, { id: 'zacht', label: 'Soft-boiled' }] }],
    situaties: [
      S({ soort: 'hard' }, 'gekookt', 7, 7, 'ghost', 'A hard-boiled egg in its shell keeps for a week in the fridge.'),
      S({}, 'gekookt', 2, 2, 'ghost', 'Peeled or soft-boiled, an egg only keeps for 2 days in the fridge, in a closed container.'),
    ],
    check: ['Was the egg in the fridge? Out of the fridge, eat it the same day.', 'Smell it: a strong sulphur smell means bin it.'],
    weg: ['A strong sulphur or rotten-egg smell', 'Slimy', 'Left out of the fridge for a long time'],
    wegUitleg: 'Does the egg smell odd or feel slimy? Bin it.',
    tip: 'Cool boiled eggs quickly in cold water and then put them in the fridge.',
    tweedeLeven: ['Egg salad', 'In a salad or on bread'],
    bron: [BRON.bw('ei-gekookt')],
  },

  // ---------- Kaas ----------
  {
    id: 'brie', naam: 'Soft cheese, brie, mozzarella, cream cheese', kleur: '#f6f0de', categorie: 'kaas', datum: 'THT',
    zoek: ['soft cheese', 'brie', 'camembert', 'blue cheese', 'gorgonzola', 'mozzarella', 'burrata', 'fresh cheese', 'feta', 'ricotta', 'mascarpone', 'cottage cheese', 'cream cheese', 'philadelphia', 'boursin', 'goat cheese', 'goats cheese', 'zachte kaas', 'schimmelkaas', 'witschimmelkaas', 'blauwe kaas', 'verse kaas', 'roomkaas', 'smeerkaas', 'kruidenkaas', 'geitenkaas'],
    vragen: [VRAAG_OPEN],
    situaties: [
      S({ open: 'dicht' }, 'datum', 0, 0, 'ghost', 'Eat soft and fresh cheese by the date at the latest.', { ghostTekst: 'Soft and fresh cheeses are sensitive to harmful bacteria. Stick to the date with this cheese.' }),
      S({ open: 'open' }, 'open', 4, 4, 'ghost', 'Once open, soft and fresh cheese keeps for about 4 days in the fridge.'),
    ],
    check: ['The white rind of brie or camembert is supposed to be there. Other colours of mould are not.', 'Smell: sour, strange or a sharp ammonia smell means bin it.', 'Mozzarella: is the liquid clear? Cloudy or slimy is not good.'],
    weg: ['Mould that doesn’t belong there', 'Sour, strange or sharp smell', 'Slimy or cloudy liquid'],
    wegUitleg: 'Don’t cut mould off soft cheese: the whole cheese goes.',
    tip: 'Keep soft cheese in a sealable container or its own packaging, mozzarella in its own liquid. Scoop with a clean knife. Pregnant? Choose cheese made from pasteurised milk.',
    tweedeLeven: ['Oven-baked brie with honey', 'Mozzarella on a pizza or in a bake', 'Cream cheese stirred into a pasta sauce'],
    bron: [BRON.bw('brie-60-plus'), BRON.bw('mozzarella'), BRON.bw('roomkaas-60-plus')],
  },

  // ---------- Vlees en vis ----------
  {
    id: 'kipfilet', naam: 'Raw meat and chicken, chicken breast, mince, steak', kleur: '#fde0da', categorie: 'vlees', datum: 'TGT',
    zoek: ['chicken', 'chicken breast', 'chicken thighs', 'drumsticks', 'poultry', 'meat', 'raw meat', 'mince', 'minced beef', 'ground beef', 'pork mince', 'burgers', 'hamburger', 'meatballs', 'steak', 'bacon', 'pork belly', 'pork chops', 'stewing beef', 'pork tenderloin', 'sausages', 'kip', 'kipfilet', 'kippenvlees', 'kipreepjes', 'kippendijen', 'kipblokjes', 'gevogelte', 'vlees', 'rauw vlees', 'gehakt', 'rundergehakt', 'half om half', 'varkensgehakt', 'gehaktballen', 'slavink', 'biefstuk', 'speklapjes', 'spek', 'karbonade', 'shoarma', 'stoofvlees', 'varkenshaas', 'worstjes', 'braadworst'],
    vragen: [VRAAG_PLEK_TGT],
    situaties: [
      VRIES_VLEES,
      S({ plek: 'koel' }, 'datum', 0, 0, 'ghost', 'Eat raw meat and chicken by the date at the latest. Already open? Chicken within 2 days, mince the same or next day.'),
    ],
    check: [...VLEES_CHECK, 'Always cook chicken and mince all the way through: no pink left inside.'],
    weg: VLEES_WEG, wegUitleg: VLEES_UITLEG,
    tip: 'Won’t make the date? Freeze it in time. Thaw it in the fridge (not on the counter) and cook it within a day.',
    tweedeLeven: [],
    bron: [BRON.bw('kipfilet-onbereid'), BRON.bw('rundergehakt-onbereid'), BRON.vb],
  },
  {
    id: 'vleeswaren', naam: 'Cold cuts and sausage, ham, sliced chicken, salami', kleur: '#fce4e8', categorie: 'vlees', datum: 'TGT',
    zoek: ['cold cuts', 'deli meat', 'lunch meat', 'ham', 'sliced chicken', 'roast beef', 'turkey slices', 'liver sausage', 'salami', 'chorizo', 'pepperoni', 'dry sausage', 'pastrami', 'prosciutto', 'vleeswaren', 'beenham', 'kipfilet beleg', 'rosbief', 'gebraden gehakt', 'boterhamworst', 'leverworst', 'kalkoenfilet', 'beleg', 'droge worst', 'cervelaat', 'snijworst', 'fuet', 'filet americain'],
    vragen: [VRAAG_PLEK_TGT, { ...VRAAG_OPEN, alleenAls: { plek: 'koel' } }],
    situaties: [
      VRIES_VLEES,
      S({ plek: 'koel', open: 'open' }, 'open', 3, 5, 'ghost', 'Once open, cold cuts keep for 3 to 5 days, and never past the date. Pregnant, or eating for older people or young children? Then 2 days at most.'),
      S({ plek: 'koel' }, 'datum', 0, 0, 'ghost', 'Eat cold cuts by the date at the latest.'),
    ],
    check: VLEES_CHECK,
    weg: VLEES_WEG, wegUitleg: 'Cold cuts are sensitive to listeria. You can’t see, smell or taste it.',
    tip: 'Keep cold cuts in the coldest spot of the fridge (often the bottom shelf), in a sealable container.',
    tweedeLeven: [],
    bron: [BRON.bw('kipfilet-vleeswaar'), BRON.bw('beenham'), BRON.bw('salami')],
  },
  {
    id: 'zalm', naam: 'Fish, fresh and smoked', kleur: '#fde3d3', categorie: 'vlees', datum: 'TGT',
    zoek: ['fish', 'salmon', 'fresh fish', 'cod', 'pangasius', 'tilapia', 'fish fillet', 'prawns', 'shrimp', 'fresh tuna', 'smoked salmon', 'smoked fish', 'smoked mackerel', 'eel', 'trout', 'herring', 'mussels', 'vis', 'zalm', 'verse vis', 'kabeljauw', 'visfilet', 'garnalen', 'tonijn vers', 'gerookte zalm', 'gerookte vis', 'gerookte makreel', 'paling', 'forel', 'haring', 'mosselen'],
    vragen: [VRAAG_PLEK_TGT],
    situaties: [VRIES_VLEES, S({ plek: 'koel' }, 'datum', 0, 0, 'ghost', 'Eat fish by the date at the latest, fresh fish preferably the same day. Open? Within 2 days.')],
    check: ['Smell: fresh fish smells fresh, like the sea. A strong fishy or sour smell means bin it.', 'Look: shiny and firm is good, dull, grey or limp is not.', 'Cook fresh fish all the way through.'],
    weg: ['A strong fishy or sour smell', 'Dull, grey or slimy'],
    wegUitleg: 'Fish, and especially smoked fish, is sensitive to bacteria you can’t see or smell.',
    tip: 'Keep fish as cold as possible, at the bottom of the fridge, or freeze it on the day you buy it. Pregnant? Eat smoked fish heated in a dish rather than cold.',
    tweedeLeven: [],
    bron: [BRON.bw('zalm-rauw'), BRON.bw('zalm-gerookt')],
  },

  // ---------- Groente en fruit ----------
  {
    id: 'tomaat', naam: 'Tomatoes and peppers, also cucumber and courgette', kleur: '#fbd9d4', categorie: 'vers', datum: 'los',
    zoek: ['tomato', 'tomatoes', 'cherry tomatoes', 'pepper', 'peppers', 'bell pepper', 'cucumber', 'courgette', 'zucchini', 'aubergine', 'eggplant', 'vegetables', 'tomaat', 'tomaten', 'cherrytomaten', 'snoeptomaten', 'paprika', 'puntpaprika', 'komkommer', 'snackkomkommer', 'groente'],
    vragen: [
      { id: 'plek', label: 'Where did you keep it?', opties: [{ id: 'schaal', label: 'In the fruit bowl or the fridge' }, { id: 'vriezer', label: 'In the freezer' }] },
      { id: 'open', label: 'Is it already cut?', alleenAls: { plek: 'schaal' }, opties: [{ id: 'dicht', label: 'Still whole' }, { id: 'open', label: 'Cut' }] },
    ],
    situaties: [
      VRIES_LOS(90, 180, 'Briefly blanched and frozen, tomatoes and peppers keep for at least 3 months. After that they’re mainly for sauce or soup. Cucumber can’t be frozen.'),
      S({ open: 'open' }, 'open', 2, 3, 'ghost', 'Once cut, keep it covered in the fridge and eat it within 2 days.'),
      S({ plek: 'schaal' }, 'gekocht', 7, 14, 'twijfel', 'Whole tomatoes, peppers and cucumbers keep for about a week, preferably out of the fridge. Soft or wrinkly is fine for sauce or soup.'),
    ],
    check: ['Soft, wrinkly or limp is fine: ideal for sauce, soup or the oven.', 'Cut small rotten spots away generously.', 'Only eat tomatoes once they’re ripe, not green.'],
    weg: VERS_WEG,
    wegUitleg: 'Soft is fine; rotten, slimy or mouldy is not.',
    tip: 'Tomatoes, peppers and cucumber don’t like the cold: they lose flavour in the fridge. A cut piece does go in the fridge, covered.',
    tweedeLeven: ['Tomato soup or pasta sauce', 'Roasted vegetables from the oven', 'Shakshuka', 'Tzatziki'],
    bron: [BRON.bw('tomaat-rauw'), BRON.bw('paprika-rauw'), BRON.bw('komkommer-met-schil'), BRON.bw('komkommer-zonder-schil')],
  },
  {
    id: 'aardappelen', naam: 'Potatoes and onions, also carrots and garlic', kleur: '#f3e1cf', categorie: 'vers', datum: 'los',
    zoek: ['potato', 'potatoes', 'new potatoes', 'sweet potato', 'onion', 'onions', 'red onion', 'shallot', 'garlic', 'carrot', 'carrots', 'parsnip', 'celeriac', 'root vegetables', 'aardappel', 'aardappelen', 'piepers', 'krieltjes', 'zoete aardappel', 'ui', 'uien', 'rode ui', 'sjalot', 'knoflook', 'wortel', 'wortels', 'worteltjes', 'peen', 'winterpeen', 'bospeen', 'pastinaak', 'knolselderij'],
    vragen: [],
    situaties: [S({}, 'gekocht', 30, 45, 'twijfel', 'In a cool, dry, dark place, potatoes and carrots keep for about a month, whole onions even about 2 months. A leftover cut onion: covered in the fridge, about a week.')],
    check: ['Cut green spots on potatoes away generously.', 'Sprouts can be cut away; the rest is still fine to eat.', 'Limp or wrinkly is fine for cooking or mashing.'],
    weg: ['Mould', 'Rotten, soft and wet, or slimy', 'A potato that is mostly green'],
    wegUitleg: 'Rotten, mouldy or mostly green? Then bin it.',
    tip: 'Keep them dry, dark and cool, but not onions next to potatoes: they rot faster that way. Limp carrots firm up again in a glass of cold water.',
    tweedeLeven: ['Mash or rösti', 'Soup', 'Roasted in the oven'],
    bron: [BRON.bw('aardappelen-rauw'), BRON.bw('ui-rauw'), BRON.bw('winterwortel-rauw')],
  },
  {
    id: 'citrus', naam: 'Citrus fruit, orange, mandarin, lemon', kleur: '#fde6cf', categorie: 'vers', datum: 'los',
    zoek: ['orange', 'oranges', 'mandarin', 'mandarins', 'clementine', 'satsuma', 'tangerine', 'lemon', 'lime', 'grapefruit', 'citrus', 'sinaasappel', 'sinaasappels', 'mandarijn', 'mandarijnen', 'citroen', 'limoen'],
    vragen: [{ id: 'plek', label: 'Where did you keep it?', opties: [{ id: 'schaal', label: 'In the fruit bowl' }, { id: 'vriezer', label: 'In the freezer' }] }],
    situaties: [
      VRIES_LOS(90, 180, 'Frozen in pieces or as juice, citrus fruit keeps for at least 3 months.'),
      S({ plek: 'schaal' }, 'gekocht', 14, 21, 'twijfel', 'In the fruit bowl, citrus fruit keeps for 1 to 2 weeks. A bit dried out is fine: just squeeze it.'),
    ],
    check: ['Dried out or less juicy is fine: use the juice or the zest.', 'Mould (often green or white powder)? Then bin it, and check the fruit next to it too.'],
    weg: ['Mould', 'Soft and rotten'],
    wegUitleg: 'Mould on citrus fruit spreads quickly to the fruit next to it.',
    tip: 'Keep citrus fruit out of the fridge and away from apples, bananas or pears. A cut piece: cut side down on a saucer in the fridge.',
    tweedeLeven: ['Fresh juice', 'Lemon zest in a cake or dressing'],
    bron: [BRON.bw('sinaasappel'), BRON.bw('mandarijn')],
  },
  {
    id: 'druiven', naam: 'Grapes', kleur: '#e8e1f3', categorie: 'vers', datum: 'los',
    zoek: ['grapes', 'grape', 'green grapes', 'red grapes', 'black grapes', 'seedless grapes', 'druiven', 'druif', 'witte druiven', 'blauwe druiven', 'pitloze druiven'],
    vragen: [{ id: 'plek', label: 'Where did you keep them?', opties: [{ id: 'koel', label: 'In the fridge' }, { id: 'schaal', label: 'In the fruit bowl' }, { id: 'vriezer', label: 'In the freezer' }] }],
    situaties: [
      VRIES_LOS(240, 365, 'Frozen grapes keep for 8 to 12 months. Frozen grapes make a tasty snack.'),
      S({ plek: 'koel' }, 'gekocht', 7, 14, 'twijfel', 'In the fridge, grapes keep for 1 to 2 weeks.'),
      S({ plek: 'schaal' }, 'gekocht', 3, 4, 'twijfel', 'In the fruit bowl, grapes keep for 3 to 4 days.'),
    ],
    check: ['A few wrinkly grapes are fine.', 'Take out mouldy grapes and check the rest carefully.'],
    weg: ['Lots of mould', 'Mushy and yeasty-smelling'],
    wegUitleg: 'Remove single mouldy grapes; if the whole bunch is affected, bin it.',
    tip: 'Leave grapes on the stem and keep them dry, for example in a paper bag.',
    tweedeLeven: ['Freeze as a snack', 'In a smoothie'],
    bron: [BRON.bw('druiven')],
  },

  // ---------- Kant-en-klaar ----------
  {
    id: 'sushi', naam: 'Sushi', kleur: '#fde3d3', categorie: 'groente', datum: 'los',
    zoek: ['sushi', 'maki', 'nigiri', 'poke bowl', 'pokebowl', 'sashimi'],
    vragen: [],
    situaties: [S({}, 'gekocht', 1, 1, 'ghost', 'Keep sushi in the fridge for 1 day at most. Does it have a “use by” date? Then by that date at the latest.')],
    check: ['Did it go in the fridge within 2 hours? If not, don’t eat it.', 'Smell and look: an off smell or dull colour means bin it.'],
    weg: ['Out of the fridge for more than 2 hours', 'An off smell', 'Dull or grey fish'],
    wegUitleg: 'Sushi with raw fish is very perishable. In doubt? Don’t.',
    tip: 'Ordered too much? Straight into the fridge, and eat it the next day. Don’t freeze delivered sushi.',
    tweedeLeven: [],
    bron: [BRON.bw('sushi')],
  },
  {
    id: 'gebak', naam: 'Cake and pastries', kleur: '#fbe3ea', categorie: 'groente', datum: 'los',
    zoek: ['cake', 'pastry', 'pastries', 'cream cake', 'apple pie', 'pie', 'tart', 'cheesecake', 'muffin', 'croissant', 'donut', 'doughnut', 'cupcake', 'birthday cake', 'taart', 'gebak', 'slagroomtaart', 'appeltaart', 'tompouce', 'vlaai', 'bossche bol', 'verjaardagstaart'],
    vragen: [
      { id: 'room', label: 'Does it contain (whipped) cream?', opties: [{ id: 'ja', label: 'Yes (whipped cream, cream, custard)' }, { id: 'nee', label: 'No (apple pie, sponge cake)' }] },
      { id: 'plek', label: 'Where did you keep it?', opties: [{ id: 'koel', label: 'In the fridge' }, { id: 'vriezer', label: 'In the freezer' }] },
    ],
    situaties: [
      S({ room: 'ja', plek: 'vriezer' }, 'vriezer', 30, 60, 'twijfel', 'Cake with whipped cream keeps for about a month in the freezer.'),
      S({ plek: 'vriezer' }, 'vriezer', 90, 180, 'twijfel', 'Cake without cream keeps for about 3 months in the freezer.'),
      S({ room: 'ja' }, 'gekocht', 1, 1, 'ghost', 'Eat cake with whipped cream or cream within a day. It spoils easily.'),
      S({}, 'gekocht', 3, 5, 'ghost', 'Cake without cream keeps for about 3 days in the fridge. After that: look, smell and taste.'),
    ],
    check: ['Was it in the fridge? Cake with cream that was left out should be eaten the same day.', 'Check for mould and smell the cream: sour means bin it.'],
    weg: ['Mould', 'Sour cream or filling', 'Cream cake that was left out of the fridge for a long time'],
    wegUitleg: 'If there’s mould, throw out the whole piece, not just the spot.',
    tip: 'Keep cake in the fridge, preferably covered. Froze it yourself? Write the date on it.',
    tweedeLeven: ['Dry cake: tiramisu or trifle', 'Crumbs over yoghurt or ice cream'],
    bron: [BRON.bw('vruchtengebak-met-slagroom'), BRON.bw('appeltaart')],
  },

  // ---------- Diepvries ----------
  {
    id: 'pizza', naam: 'Frozen food, ice cream, pizza, vegetables and snacks', kleur: '#e2eefb', categorie: 'diepvries', datum: 'THT',
    zoek: ['frozen', 'freezer', 'frozen pizza', 'pizza', 'ready meal frozen', 'frozen snacks', 'fries', 'chips frozen', 'ice cream', 'ice lolly', 'magnum', 'sorbet', 'frozen vegetables', 'frozen fruit', 'frozen peas', 'frozen spinach', 'fish fingers', 'diepvries', 'diepvriespizza', 'diepvriesmaaltijd', 'frikandellen', 'kroketten', 'snacks', 'patat', 'friet', 'ijs', 'roomijs', 'ijsje', 'waterijs', 'diepvriesgroente', 'diepvriesfruit', 'erwten diepvries', 'spinazie diepvries', 'bevroren fruit', 'vissticks'],
    vragen: [VRAAG_OPEN],
    situaties: [
      S({ open: 'dicht' }, 'datum', 365, 730, 'twijfel', DIEPVRIES),
      S({ open: 'open' }, 'open', 90, 180, 'twijfel', 'An open tub or bag in the freezer stays tasty for about 3 months. After that you get more ice crystals and freezer burn.'),
    ],
    check: ['Has it stayed frozen the whole time? Clumped-together pieces mean it has thawed at some point.', 'White, dry patches (freezer burn) and ice crystals aren’t dangerous, just less tasty.', 'Always cook or heat frozen meals and snacks until piping hot.'],
    weg: ['Has thawed and been refrozen', 'Rancid or strange smell'],
    wegUitleg: 'Thawed and refrozen? Better not.',
    tip: 'Set your freezer to -18 °C, close open bags with a clip and write the date on anything you freeze yourself.',
    tweedeLeven: ['Frozen fruit: smoothie or over yoghurt', 'Frozen vegetables: soup or stir fry', 'Ice cream: milkshake'],
    bron: [BRON.bw('roomijs'), BRON.bw('pizza-frutti-di-mare-diepvries')],
  },

  // ---------- Voorraadkast ----------
  {
    id: 'pasta', naam: 'Pasta and rice, also flour, dry from the cupboard', kleur: '#fdf0cc', categorie: 'voorraad', datum: 'THT',
    zoek: ['pasta', 'spaghetti', 'macaroni', 'penne', 'fusilli', 'noodles', 'lasagne sheets', 'rice', 'white rice', 'brown rice', 'basmati', 'risotto rice', 'couscous', 'bulgur', 'quinoa', 'flour', 'self raising flour', 'baking mix', 'pancake mix', 'cornflour', 'sugar', 'oats', 'dried lentils', 'noedels', 'mie', 'lasagnebladen', 'rijst', 'witte rijst', 'zilvervliesrijst', 'bloem', 'meel', 'tarwebloem', 'zelfrijzend bakmeel', 'bakmix', 'pannenkoekenmix', 'maizena', 'suiker', 'havermout', 'linzen droog'],
    vragen: [],
    situaties: [S({}, 'datum', 365, 730, 'twijfel', 'Dry pasta, rice and flour hardly spoil: up to a year past the date and often longer, if stored dry and well sealed.')],
    check: DROOG_CHECK, weg: DROOG_WEG,
    wegUitleg: 'Bugs (like pantry moths) in the pack? Throw it out and clean the cupboard well.',
    tip: `${DROOG_TIP} Cooked pasta or rice is a different story: see Leftovers.`,
    tweedeLeven: [],
    bron: [BRON.bw('pasta-onbereid'), BRON.bw('witte-rijst-onbereid'), BRON.bw('bloem')],
  },
  {
    id: 'koekjes', naam: 'Biscuits and chocolate, also sweets', kleur: '#f8e2c4', categorie: 'voorraad', datum: 'THT',
    zoek: ['biscuits', 'cookies', 'cookie', 'biscuit', 'cake bars', 'sweets', 'candy', 'liquorice', 'stroopwafels', 'cereal bar', 'granola bar', 'chocolate', 'chocolate bar', 'dark chocolate', 'milk chocolate', 'tony', 'easter eggs', 'chocolates', 'koekjes', 'koek', 'biscuitjes', 'ontbijtkoek', 'snoep', 'drop', 'repen', 'mueslireep', 'chocolade', 'reep', 'chocoladereep', 'pure chocolade', 'melkchocolade', 'paaseitjes', 'bonbons', 'chocoladeletter', 'pepernoten', 'kruidnoten'],
    vragen: [],
    situaties: [S({}, 'datum', 60, 120, 'twijfel', 'Biscuits, chocolate and sweets are fine up to about 2 months past the date, often longer, if they look fine and the package is intact.')],
    check: ['A white haze on chocolate is fat or sugar coming to the surface. Not harmful!', 'Smell: musty or rancid doesn’t taste good anymore.', 'Soft or dried out isn’t spoilage, just less tasty.'],
    weg: ['Mould', 'Musty or rancid smell', 'Bugs'],
    wegUitleg: 'Musty, rancid or mouldy? Bin it.',
    tip: 'Put an open pack in a tightly closing tin. Keep chocolate cool and dry, but preferably not in the fridge. Biscuits can go in the freezer for 3 months.',
    tweedeLeven: ['Base for a cheesecake', 'Crumbs in yoghurt or over ice cream', 'Melt chocolate over fruit or into brownies'],
    bron: [BRON.bw('koekje-chocolate-chip-cookie'), BRON.bw('pure-chocolade')],
  },
  {
    id: 'mayonaise', naam: 'Sauces, mayonnaise, ketchup, mustard', kleur: '#e4edf8', categorie: 'voorraad', datum: 'THT',
    zoek: ['mayonnaise', 'mayo', 'sauce', 'sauces', 'ketchup', 'tomato ketchup', 'curry sauce', 'garlic sauce', 'sambal', 'mustard', 'dressing', 'bbq sauce', 'barbecue sauce', 'sweet chilli', 'satay sauce', 'sriracha', 'hot sauce', 'mayonaise', 'fritessaus', 'sauzen', 'saus', 'tomatenketchup', 'curry', 'knoflooksaus', 'mosterd', 'barbecuesaus', 'bbq saus', 'satesaus'],
    vragen: [VRAAG_OPEN],
    situaties: [
      S({ open: 'dicht' }, 'datum', 60, 120, 'twijfel', 'Sealed sauces are fine up to about 2 months past the date, if the package is intact.'),
      S({ open: 'open' }, 'open', 60, 120, 'twijfel', 'Once open, sauces keep a long time in the fridge: mayonnaise 2 to 4 months, ketchup even 9 months to a year.'),
    ],
    check: ['Smell and taste: rancid, yeasty or different from normal means bin it.', 'Check for mould around the cap and for discolouration.'],
    weg: ['Mould', 'Rancid or yeasty smell', 'Discoloured or separated'],
    wegUitleg: 'Rancid or mouldy sauce goes in the bin.',
    tip: 'Keep open bottles and jars in the fridge and wipe the cap clean after use.',
    tweedeLeven: [],
    bron: [BRON.bw('mayonaise'), BRON.bw('tomatenketchup')],
  },
  {
    id: 'sap', naam: 'Juice and soft drinks', kleur: '#fde6cf', categorie: 'voorraad', datum: 'THT',
    zoek: ['juice', 'orange juice', 'apple juice', 'fruit juice', 'smoothie', 'soft drink', 'soda', 'fizzy drink', 'cola', 'fanta', 'sprite', 'iced tea', 'lemonade', 'squash', 'cordial', 'energy drink', 'water', 'sap', 'jus', 'sinaasappelsap', 'appelsap', 'jus d orange', 'vruchtensap', 'multivruchtensap', 'frisdrank', 'ice tea', 'limonade', 'siroop', 'energiedrank', 'spa'],
    vragen: [VRAAG_OPEN],
    situaties: [
      S({ open: 'dicht' }, 'datum', 180, 365, 'twijfel', 'A sealed bottle, carton or can from the shelf can last up to a year past the date, if the package is intact. Not freshly squeezed juice from the chiller: drink that within 1 to 2 days.'),
      S({ open: 'open' }, 'open', 3, 7, 'twijfel', 'Once open, juice and soft drinks keep for 3 to 7 days in the fridge. After that: look, smell and taste.'),
    ],
    check: ['Is the carton or can not bulging, rusty or leaking?', 'Smell and taste: does juice taste yeasty or fizzy? Then it has started fermenting.', 'Cloudy or stringy juice is not good.'],
    weg: ['A bulging, leaking or rusty carton or can', 'Mould, or cloudy and stringy', 'Tastes yeasty or fizzy (juice)'],
    wegUitleg: 'Yeasty or fizzy juice has started fermenting. Bin it.',
    tip: 'Keep bottles of juice in the dark, otherwise the vitamin C disappears faster. Close open bottles tightly and put them in the fridge.',
    tweedeLeven: ['Smoothie', 'Ice lollies'],
    bron: [BRON.bw('sinaasappelsap'), BRON.bw('cola')],
  },
  {
    id: 'wijn', naam: 'Wine and beer', kleur: '#f3dce4', categorie: 'voorraad', datum: 'THT',
    zoek: ['wine', 'red wine', 'white wine', 'rosé', 'rose', 'prosecco', 'sparkling wine', 'champagne', 'beer', 'lager', 'craft beer', 'can of beer', 'alcohol', 'cider', 'wijn', 'rode wijn', 'witte wijn', 'bubbels', 'bier', 'pils', 'speciaalbier', 'blikje bier'],
    vragen: [
      { id: 'soort', label: 'What is it?', opties: [{ id: 'wijn', label: 'Wine' }, { id: 'bier', label: 'Beer' }] },
      VRAAG_OPEN,
    ],
    situaties: [
      S({ soort: 'bier', open: 'open' }, 'open', 1, 2, 'twijfel', 'Open beer only tastes good for a day. With the cap back on you can still drink it the next day.'),
      S({ open: 'open' }, 'open', 3, 5, 'twijfel', 'An open bottle of wine keeps for about 3 days in the fridge. After that it turns sour, but it’s not dangerous.'),
      S({}, 'datum', 365, 730, 'twijfel', 'Sealed wine keeps almost indefinitely and doesn’t even need a date on it. Sealed beer is often fine long past the date, although the taste fades.'),
    ],
    check: ['Smell and taste: sour, musty or vinegary? Then the quality is gone.', 'Flat beer isn’t dangerous, just less tasty.'],
    weg: ['Mould in the bottle or around the cork', 'A bulging or leaking can'],
    wegUitleg: 'Sour wine isn’t dangerous, just nasty. Mould or a bulging can means bin it.',
    tip: 'Put the cork or cap back on and keep an open bottle in the fridge, red wine too.',
    tweedeLeven: ['Wine: in a sauce, risotto or stew', 'Beer: in pancake batter or a stew'],
    bron: [BRON.bw('rode-wijn'), BRON.bw('bier-pils')],
  },
);

// Oude product-id's die nu in een samengevoegde groep zitten (voor 'onlangs opgezocht', de teller en recepten).
const ALIAS = {
  'melk-houdbaar': 'melk', haverdrink: 'melk', mozzarella: 'brie', roomkaas: 'brie', 'creme-fraiche': 'slagroom',
  salami: 'vleeswaren', gehakt: 'kipfilet', 'gerookte-zalm': 'zalm', rijst: 'pasta', bloem: 'pasta',
  chocolade: 'koekjes', ketchup: 'mayonaise', frisdrank: 'sap', ijs: 'pizza', 'diepvries-groente': 'pizza',
  paprika: 'tomaat', komkommer: 'tomaat', ui: 'aardappelen', wortels: 'aardappelen',
};

const DATUM_UITLEG = {
  los: { kort: 'No date', uitleg: 'Bought loose: you count from the day you bought it.' },
  THT: { kort: 'Best before', uitleg: 'A quality date. After it, food is often still fine: look, smell and taste.' },
  TGT: { kort: 'Use by', uitleg: 'A safety date. Don’t eat it after this date, even if it looks fine.' },
  kies: { kort: 'Best before or use by', uitleg: 'This differs per brand. Check which date is on the package.' },
  zelf: { kort: 'No date', uitleg: 'Home-cooked: you count from the day you made it.' },
};

// Het stickertje op de kaart en de productpagina.
const sticker = p => ({
  THT: '<span class="sticker tht">Best before</span>',
  TGT: '<span class="sticker tgt">Use by</span>',
  kies: '<span class="sticker kies">Check label</span>',
  zelf: '<span class="sticker zelf">Leftover</span>',
  los: '<span class="sticker los">Fresh</span>',
})[p.datum];

const productById = id => PRODUCTEN.find(p => p.id === (ALIAS[id] || id));
