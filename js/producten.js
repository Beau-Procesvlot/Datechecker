// De productlijst. Eén blok per productgroep, in eigen woorden, gebaseerd op de bronnen onderaan elk product.
//
// Hoe het oordeel werkt:
// - vragen: korte vragen op de productpagina (waar bewaard? geopend?). Het antwoord kiest een situatie.
// - situaties: de eerste situatie waarvan alle voorwaarden ('als') kloppen, telt.
//     tijd:    welke datum je invult (zie TIJD): de datum op de verpakking, de dag van openen of de dag van invriezen.
//     match:   tot en met zoveel dagen → "It's a match!"
//     twijfel: tot en met zoveel dagen → "Eerst goed bekijken."
//     daarna:  wat erna komt: 'twijfel' (je zintuigen beslissen) of 'ghost' (de bronnen raden het niet meer aan).
//     houdbaar: één zin met de vuistregel voor deze situatie.
//   De grenzen komen uit de bronnen; staat er in de bron geen getal, dan kiezen we de voorzichtige kant.
// - weg: tekenen van bederf. Tik je er één aan, dan is het altijd "Ghosten", wat de datum ook zegt.
// - We zeggen nooit "veilig": het blijft een inschatting, de gebruiker beslist.

const TIJD = {
  datum: { vraag: 'Welke datum staat op de verpakking?', verleden: false },
  open: { vraag: 'Wanneer heb je het opengemaakt?', verleden: true },
  vriezer: { vraag: 'Wanneer heb je het ingevroren?', verleden: true },
  gekookt: { vraag: 'Wanneer heb je het gekookt?', verleden: true },
  gekocht: { vraag: 'Wanneer heb je het gekocht?', verleden: true },
};

const CATEGORIEEN = [
  { id: 'brood', label: 'Brood', kort: 'Brood', kleur: '#fdecc8' },
  { id: 'zuivel', label: 'Zuivel en eieren', kort: 'Zuivel', kleur: '#dfeafb' },
  { id: 'kaas', label: 'Kaas', kort: 'Kaas', kleur: '#fff2b8' },
  { id: 'vlees', label: 'Vlees, vis en vega', kort: 'Vlees en vis', kleur: '#fde0da' },
  { id: 'vers', label: 'Groente en fruit', kort: 'Groente en fruit', kleur: '#e3f1df' },
  { id: 'groente', label: 'Kant-en-klaar en restjes', kort: 'Kant-en-klaar', kleur: '#e2eefb' },
  { id: 'diepvries', label: 'Diepvries', kort: 'Diepvries', kleur: '#e2eefb' },
  { id: 'voorraad', label: 'Voorraadkast', kort: 'Voorraad', kleur: '#fde6cf' },
];

const BRON = {
  vc: { naam: 'Voedingscentrum: Twee houdbaarheidsdatums', url: 'https://www.voedingscentrum.nl/encyclopedie/houdbaarheidsdatums-tht-tgt.aspx' },
  cb: { naam: 'Consumentenbond: Over de houdbaarheidsdatum', url: 'https://www.consumentenbond.nl/duurzamer-eten/houdbaarheidsdatum-voeding' },
  vb: { naam: 'Voedselbank, richtlijn NVWA (strenger: voor uitdelen)', url: 'https://www.voedselbanknijmegen.nl/voedselpakket/kwaliteit-voedselveiligheid/' },
  bw: slug => ({ naam: 'Voedingscentrum, Bewaarwijzer', url: `https://www.voedingscentrum.nl/nl/thema/kopen-koken-bewaren/eten-bewaren/hoe-lang-kan-ik-bewaren/${slug}.aspx` }),
};

const VRAAG_OPEN = { id: 'open', label: 'Is het al open?', opties: [{ id: 'dicht', label: 'Nog dicht' }, { id: 'open', label: 'Al open' }] };

const PRODUCTEN = [
  {
    id: 'afbakbroodjes',
    naam: 'Afbakbroodjes',
    kleur: '#fdecc8',
    zoek: ['afbak', 'afbakbrood', 'pistolets', 'bake off', 'stokbrood afbak', 'petit pain', 'broodjes'],
    categorie: 'brood',
    datum: 'THT',
    vragen: [
      { id: 'plek', label: 'Waar heb je ze bewaard?', opties: [{ id: 'gewoon', label: 'Kast of koelkast' }, { id: 'vriezer', label: 'In de vriezer' }] },
      { ...VRAAG_OPEN, alleenAls: { plek: 'gewoon' } },
    ],
    situaties: [
      { als: { plek: 'vriezer' }, tijd: 'vriezer', match: 90, twijfel: 180, daarna: 'twijfel',
        houdbaar: 'In de vriezer blijven ze 1 tot 3 maanden lekker. Daarna niet gevaarlijk, wel steeds droger.' },
      { als: { plek: 'gewoon', open: 'dicht' }, tijd: 'datum', match: 14, twijfel: 60, daarna: 'ghost',
        houdbaar: 'Verpakt brood kan tot zo’n 2 maanden na de datum, zolang de verpakking heel is en je geen schimmel ziet. Hoe langer, hoe droger.' },
      { als: { plek: 'gewoon', open: 'open' }, tijd: 'open', match: 2, twijfel: 4, daarna: 'ghost',
        houdbaar: 'Open blijven ze 2 tot 4 dagen goed, het liefst in de koelkast. Bewaren? Vries ze in.' },
    ],
    check: [
      'Kijk het hele zakje rond, ook de onderkant en tussen de broodjes: zie je groene, witte of zwarte pluisjes?',
      'Is de verpakking nog heel en niet opgebold?',
      'Ruik even: muf of zuur is een slecht teken.',
    ],
    weg: ['Schimmel, ook maar op één broodje', 'Een muffe of zure geur', 'Een kapotte of opgeblazen verpakking'],
    wegUitleg: 'Bij schimmel op brood gooi je het hele zakje weg. Schimmel groeit verder dan je kunt zien.',
    tip: 'Ga je ze niet snel gebruiken? Vries ze in. Je kunt ze zo uit de vriezer afbakken, een paar minuten langer dan normaal.',
    tweedeLeven: ['Croutons voor soep of salade', 'Wentelteefjes', 'Paneermeel uit de keukenmachine'],
    bron: [BRON.bw('afbakbroodje'), { ...BRON.bw('focaccia'), naam: 'Voedingscentrum, Bewaarwijzer: verpakt brood (focaccia)' }],
  },

  {
    id: 'kaas-goudse',
    naam: 'Kaas, Goudse (jong of belegen)',
    kleur: '#fff2b8',
    zoek: ['kaas', 'goudse', 'jonge kaas', 'belegen kaas', 'jong belegen', 'kaasplakken', 'plakken kaas', 'geraspte kaas', 'edammer', 'boerenkaas', 'halfzachte kaas', 'harde kaas'],
    categorie: 'kaas',
    datum: 'THT',
    vragen: [
      { id: 'plek', label: 'Waar heb je het bewaard?', opties: [{ id: 'koelkast', label: 'In de koelkast' }, { id: 'vriezer', label: 'In de vriezer' }] },
      { id: 'open', label: 'Hoe is het verpakt?', alleenAls: { plek: 'koelkast' }, opties: [{ id: 'dicht', label: 'Dicht (folie of vacuüm)' }, { id: 'open', label: 'Open, of los van de kaasboer' }] },
      { id: 'vorm', label: 'Wat voor stuk?', alleenAls: { plek: 'koelkast', open: 'open' }, opties: [{ id: 'stuk', label: 'Een stuk' }, { id: 'plakken', label: 'Plakken' }, { id: 'geraspt', label: 'Geraspt' }] },
    ],
    situaties: [
      { als: { plek: 'vriezer' }, tijd: 'vriezer', match: 60, twijfel: 120, daarna: 'twijfel',
        houdbaar: 'Ingevroren blijft kaas 2 tot 4 maanden goed. Na het ontdooien brokkelt hij wat: lekker om te raspen of in een gerecht.' },
      { als: { plek: 'koelkast', open: 'dicht' }, tijd: 'datum', match: 60, twijfel: 120, daarna: 'twijfel',
        houdbaar: 'Dichte harde kaas kan tot zo’n 2 maanden na de datum, en vaak langer, als de verpakking heel is en hij er goed uitziet.' },
      { als: { plek: 'koelkast', open: 'open', vorm: 'stuk' }, tijd: 'open', match: 7, twijfel: 14, daarna: 'twijfel',
        houdbaar: 'Een open stuk kaas blijft ongeveer een week goed in de koelkast. Daarna kijk, ruik en proef je.' },
      { als: { plek: 'koelkast', open: 'open', vorm: 'plakken' }, tijd: 'open', match: 4, twijfel: 7, daarna: 'ghost',
        houdbaar: 'Plakken zijn open ongeveer 4 dagen goed in de koelkast.' },
      { als: { plek: 'koelkast', open: 'open', vorm: 'geraspt' }, tijd: 'open', match: 2, twijfel: 3, daarna: 'ghost',
        houdbaar: 'Open geraspte kaas is maar 2 tot 3 dagen goed. Invriezen kan prima, ook in het zakje.' },
    ],
    check: [
      'Kijk naar schimmel. Op een stuk harde kaas mag je een klein plekje ruim wegsnijden: minstens 1 centimeter eromheen.',
      'Ruik: een scherpe ammoniaklucht of iets wat niet naar kaas ruikt, is niet goed.',
      'Een beetje uitgedroogd of zweterig is geen bederf, alleen minder lekker.',
    ],
    weg: ['Schimmel op plakken of geraspte kaas', 'Veel schimmel, of schimmel die diep in het stuk zit', 'Een vreemde, scherpe geur'],
    wegUitleg: 'Wegsnijden kan alleen bij een stuk harde kaas met een klein plekje. Bij plakken en geraspte kaas gooi je het weg.',
    tip: 'Bewaar kaas goed ingepakt in de koelkast, bijvoorbeeld in kaaspapier of vershoudfolie. Zo zweet hij niet en droogt hij niet uit.',
    tweedeLeven: ['Uitgedroogde kaas raspen voor over de pasta of een ovenschotel', 'Tosti’s', 'Kaasstengels van bladerdeeg'],
    bron: [BRON.bw('kaas-48-plus-jong-goudse'), BRON.bw('geraspte-kaas'), BRON.cb],
  },


  {
    id: 'yoghurt',
    naam: 'Yoghurt',
    kleur: '#dfeafb',
    zoek: ['yoghurt', 'yogurt', 'griekse yoghurt', 'volle yoghurt', 'magere yoghurt', 'kwark', 'skyr'],
    categorie: 'zuivel',
    datum: 'THT',
    vragen: [VRAAG_OPEN],
    situaties: [
      { als: { open: 'dicht' }, tijd: 'datum', match: 5, twijfel: 14, daarna: 'ghost',
        houdbaar: 'Dichte yoghurt die steeds in de koelkast stond, is meestal nog een paar dagen tot een week na de datum goed.' },
      { als: { open: 'open' }, tijd: 'open', match: 5, twijfel: 7, daarna: 'ghost',
        houdbaar: 'Open blijft yoghurt 5 tot 7 dagen goed in de koelkast.' },
    ],
    check: [
      'Kijk of er schimmel op zit, ook langs de rand en op het deksel.',
      'Ruik: frisjes zuur is normaal, maar sterk zuur, gistig of muf niet.',
      'Proef een klein beetje: bitter is een teken dat hij over is.',
      'Een laagje vocht bovenop is normaal; even doorroeren.',
    ],
    weg: ['Schimmel', 'Een bolle verpakking of een pak dat sist bij openen', 'Brokkelig en waterig, of bitter van smaak'],
    wegUitleg: 'Zie je schimmel op yoghurt, dan gooi je het hele pak weg, niet alleen het bovenste laagje.',
    tip: 'Zet yoghurt na het opscheppen meteen terug in de koelkast en gebruik een schone lepel. Zo komen er geen schimmels in.',
    tweedeLeven: ['In pannenkoeken- of cakebeslag', 'Marinade voor vlees of groente', 'Smoothie of overnight oats'],
    bron: [BRON.bw('yoghurt-vol'), BRON.cb, BRON.vb],
  },

  {
    id: 'eieren',
    naam: 'Eieren',
    kleur: '#e4edf8',
    zoek: ['ei', 'eieren', 'eitjes', 'scharreleieren', 'vrije-uitloopeieren', 'biologische eieren'],
    categorie: 'zuivel',
    datum: 'THT',
    vragen: [
      { id: 'bereiding', label: 'Hoe ga je ze eten?', opties: [{ id: 'gaar', label: 'Goed gaar (hardgekookt, doorbakken, in de oven)' }, { id: 'zacht', label: 'Zacht of rauw (zachtgekookt, lopend geel, mayo, tiramisu)' }] },
    ],
    situaties: [
      { als: { bereiding: 'zacht' }, tijd: 'datum', match: 0, twijfel: 0, daarna: 'ghost',
        houdbaar: 'Na de datum eet je eieren niet meer zacht of rauw. Wel goed gaar: de hitte doodt eventuele bacteriën.' },
      { als: { bereiding: 'gaar' }, tijd: 'datum', match: 3, twijfel: 7, daarna: 'ghost',
        houdbaar: 'Goed gaar kun je eieren nog enkele dagen na de datum eten. Langer raden de bronnen niet aan.' },
    ],
    check: [
      'De watertest: leg het ei in een glas water. Zinkt het en blijft het liggen? Vers. Gaat het rechtop staan? Ouder. Blijft het drijven? Weg ermee.',
      'Breek het ei eerst in een kommetje en ruik. Een zwavel- of rotte-eierenlucht betekent weg.',
      'Een gebarsten of vieze schaal? Die eieren eet je niet.',
    ],
    weg: ['Het ei blijft drijven in water', 'Een zwavel- of rotte-eierenlucht', 'Een gebarsten schaal'],
    wegUitleg: 'Twijfel je over één ei, breek dan elk ei apart in een kommetje. Zo gaat niet de hele pan mee.',
    tip: 'Bewaar eieren in de doos in de koelkast, met de punt naar beneden. Dan blijven ze langer vers en nemen ze geen geuren over.',
    tweedeLeven: ['Hardgekookt in een eiersalade', 'Quiche of frittata uit de oven', 'Bakken: cake, brownies of pannenkoeken'],
    bron: [BRON.bw('ei-rauw'), BRON.cb],
  },
];

// ---------- Uitbreiding naar 40 producten ----------
// Kortere schrijfwijze voor een situatie: S(voorwaarden, soort datum, match, twijfel, daarna, vuistregel, extra).
const S = (als, tijd, match, twijfel, daarna, houdbaar, extra = {}) => ({ als, tijd, match, twijfel, daarna, houdbaar, ...extra });
// Bron noemt geen termijn na de datum: dat zeggen we er eerlijk bij.
const GEEN = { geenTermijn: true };

const VRAAG_PLEK = (koel = 'In de koelkast') => ({ id: 'plek', label: 'Waar heb je het bewaard?', opties: [{ id: 'koel', label: koel }, { id: 'vriezer', label: 'In de vriezer' }] });
const VRAAG_PLEK_TGT = { id: 'plek', label: 'Waar heb je het bewaard?', opties: [{ id: 'koel', label: 'In de koelkast' }, { id: 'vriezer', label: 'Ingevroren vóór de datum' }] };
const VRAAG_SOORT = { id: 'soort', label: 'Wat voor datum staat erop?', opties: [{ id: 'tgt', label: 'Te gebruiken tot (TGT)' }, { id: 'tht', label: 'Ten minste houdbaar tot (THT)' }] };

// Gedeeld door vers vlees, vis en vleeswaren
const VLEES_CHECK = ['Ruik direct na het openen: een zure of afwijkende lucht betekent weg.', 'Kijk naar de kleur: grauw of groenig is niet goed.', 'Voel: plakkerig of slijmerig eet je niet.'];
const VLEES_WEG = ['Een zure of afwijkende geur', 'Grauw of groenig verkleurd', 'Plakkerig of slijmerig'];
const VLEES_UITLEG = 'Ziekmakende bacteriën in vlees en vis zie, ruik en proef je niet altijd. Twijfel je? Dan niet doen.';
const VRIES_VLEES = S({ plek: 'vriezer' }, 'vriezer', 90, 180, 'twijfel', 'Ingevroren vóór de datum blijft het zo’n 3 maanden goed. Daarna niet gevaarlijk, wel kans op een droge, ranzige smaak.');
// Gedeeld door gekoelde zuivel
const ZUIVEL_CHECK = ['Kijk of er schimmel op zit, ook op het deksel of de dop.', 'Ruik: zuur, gistig of muf is niet goed.', 'Proef een klein beetje: bitter of vreemd? Niet doen.'];
// Gedeeld door de voorraadkast
const DROOG_CHECK = ['Kijk of de verpakking heel en droog is gebleven.', 'Zie je beestjes, spinsel of schimmel? Weg ermee.', 'Ruik: muf of ranzig betekent dat de kwaliteit eraf is.'];
const DROOG_WEG = ['Beestjes of spinsel in het pak', 'Schimmel', 'Een muffe of ranzige geur'];
const DROOG_TIP = 'Koel, droog, donker en goed afgesloten bewaren. Een open pak doe je in een goed sluitende bak, dan komen er geen beestjes in.';

PRODUCTEN.push(
  // ======================= BROOD =======================
  {
    id: 'brood', naam: 'Brood, gesneden', kleur: '#fdecc8', categorie: 'brood', datum: 'THT',
    zoek: ['brood', 'boterhammen', 'volkorenbrood', 'witbrood', 'bruinbrood', 'tarwebrood', 'meergranen', 'sneetjes', 'casino'],
    vragen: [VRAAG_PLEK('In de broodtrommel of zak')],
    situaties: [
      S({ plek: 'vriezer' }, 'vriezer', 90, 180, 'twijfel', 'Ingevroren blijft brood 1 tot 3 maanden goed. Daarna droogt het steeds meer uit.'),
      S({ plek: 'koel' }, 'datum', 0, 4, 'twijfel', 'Brood is open meestal 2 tot 4 dagen lekker. Daarna wordt het droog: prima voor toast of een tosti.', GEEN),
    ],
    check: ['Kijk elke snee rond, ook de korst en de onderkant: zie je pluisjes of vlekjes?', 'Ruik in de zak: muf is een slecht teken.'],
    weg: ['Schimmel, ook maar op één snee', 'Een muffe geur'],
    wegUitleg: 'Bij schimmel gooi je het hele brood weg. Schimmel groeit verder dan je kunt zien.',
    tip: 'Vries brood meteen na aankoop in porties in en haal er elke dag uit wat je nodig hebt. In de koelkast wordt het juist sneller oudbakken.',
    tweedeLeven: ['Roosteren of een tosti maken', 'Wentelteefjes', 'Croutons of paneermeel', 'Broodpudding'],
    bron: [BRON.bw('tarwebrood')],
  },
  {
    id: 'wraps', naam: 'Wraps en tortilla’s', kleur: '#fbe7c6', categorie: 'brood', datum: 'THT',
    zoek: ['wrap', 'wraps', 'tortilla', 'tortillas', 'pitabrood', 'naanbrood'],
    vragen: [VRAAG_OPEN],
    situaties: [
      S({ open: 'dicht' }, 'datum', 60, 120, 'twijfel', 'Dicht en met een hele verpakking zijn wraps tot zo’n 2 maanden na de datum goed.'),
      S({ open: 'open' }, 'open', 2, 5, 'twijfel', 'Open bewaar je wraps in de koelkast: ongeveer 2 dagen, daarna kijk, ruik en proef je. Invriezen kan tot 6 maanden.'),
    ],
    check: ['Kijk naar schimmelvlekjes, ook tussen de wraps.', 'Hard en droog is niet erg: even opwarmen en ze zijn weer soepel.'],
    weg: ['Schimmel', 'Een muffe of zure geur'],
    wegUitleg: 'Zie je schimmel, dan gooi je de hele stapel weg.',
    tip: 'Haal je het pak niet op tijd leeg? Vries de wraps in, met een stukje bakpapier ertussen. Dan pak je er zo eentje uit.',
    tweedeLeven: ['Krokante tortillachips uit de oven', 'Quesadilla', 'Mini-pizza’s'],
    bron: [BRON.bw('wrap-ongevuld-alle-soorten')],
  },
  {
    id: 'crackers', naam: 'Crackers en beschuit', kleur: '#f8e2b5', categorie: 'brood', datum: 'THT',
    zoek: ['crackers', 'cracker', 'beschuit', 'knäckebröd', 'knackebrod', 'rijstwafels', 'toast', 'cream crackers'],
    vragen: [VRAAG_OPEN],
    situaties: [
      S({ open: 'dicht' }, 'datum', 60, 120, 'twijfel', 'Dicht en met een hele verpakking zijn crackers tot zo’n 2 maanden na de datum goed.'),
      S({ open: 'open' }, 'open', 30, 60, 'twijfel', 'Open blijven ze ongeveer een maand lekker in de kast, als je het pak goed sluit.'),
    ],
    check: DROOG_CHECK,
    weg: DROOG_WEG,
    wegUitleg: 'Slap of minder knapperig is geen bederf. Beestjes, schimmel of een ranzige lucht wel.',
    tip: DROOG_TIP,
    tweedeLeven: ['Slappe crackers 5 minuten in de oven: weer knapperig', 'Verkruimeld als crumble of paneerlaag'],
    bron: [BRON.bw('cracker-volkoren')],
  },

  // ======================= ZUIVEL =======================
  {
    id: 'vla', naam: 'Vla en toetjes', kleur: '#f3e1cf', categorie: 'zuivel', datum: 'THT',
    zoek: ['vla', 'chocoladevla', 'vanillevla', 'pudding', 'toetje', 'toetjes', 'dessert', 'griesmeelpudding', 'chocolademousse'],
    vragen: [VRAAG_OPEN],
    situaties: [
      S({ open: 'dicht' }, 'datum', 1, 3, 'ghost', 'Toetjes zijn na de datum meestal nog enkele dagen goed. Kijk, ruik en proef.'),
      S({ open: 'open' }, 'open', 4, 6, 'ghost', 'Open blijft vla 4 tot 6 dagen goed in de koelkast.'),
    ],
    check: ZUIVEL_CHECK,
    weg: ['Brokken of waterig', 'Zure geur', 'Bittere smaak', 'Schimmel'],
    wegUitleg: 'Bittere of zure vla is over de datum heen. Weg ermee.',
    tip: 'Schep vla met een schone lepel en zet het pak meteen terug in de koelkast.',
    tweedeLeven: ['Als saus over een stukje cake', 'Invriezen als waterijsje'],
    bron: [BRON.bw('vla-chocolade-vol'), BRON.cb, BRON.vb],
  },
  {
    id: 'roomboter', naam: 'Roomboter', kleur: '#fff4c7', categorie: 'zuivel', datum: 'THT',
    zoek: ['boter', 'roomboter', 'margarine', 'halvarine', 'bakboter', 'kuipje boter'],
    vragen: [VRAAG_OPEN],
    situaties: [
      S({ open: 'dicht' }, 'datum', 60, 120, 'twijfel', 'Dichte boter is tot zo’n 2 maanden na de datum goed, als de verpakking heel is.'),
      S({ open: 'open' }, 'open', 30, 45, 'twijfel', 'Open blijft boter ongeveer een maand goed in de koelkast.'),
    ],
    check: ['Ruik: ranzig of zuur betekent dat de boter over is.', 'Kijk naar de kleur: donker verkleurde randjes zijn niet goed.'],
    weg: ['Ranzige of zure geur', 'Donker verkleurd', 'Schimmel'],
    wegUitleg: 'Ranzige boter is niet meer lekker. Weg ermee.',
    tip: 'Boter kan tot 6 maanden in de vriezer. Laat hem in de verpakking of wikkel hem in folie, dan komt er geen lucht bij.',
    tweedeLeven: ['Bakken: koekjes of cake', 'Kruidenboter'],
    bron: [BRON.bw('roomboter-ongezouten')],
  },

  // ======================= KAAS =======================

  // ======================= VLEES, VIS EN VEGA =======================
  {
    id: 'rookworst', naam: 'Rookworst', kleur: '#f6dccb', categorie: 'vlees', datum: 'kies',
    zoek: ['rookworst', 'unox', 'worst', 'knakworst', 'knakworstjes', 'frankfurter', 'braadworst'],
    vragen: [VRAAG_SOORT, VRAAG_PLEK_TGT, { ...VRAAG_OPEN, alleenAls: { plek: 'koel' } }],
    situaties: [
      VRIES_VLEES,
      S({ plek: 'koel', open: 'open' }, 'open', 2, 2, 'ghost', 'Open eet je rookworst binnen 2 dagen op.'),
      S({ soort: 'tgt', plek: 'koel' }, 'datum', 0, 0, 'ghost', 'Staat er TGT op? Dan eet je hem uiterlijk op de datum.'),
      S({ soort: 'tht', plek: 'koel' }, 'datum', 0, 2, 'ghost', 'Staat er THT op? Dan kan het kort na de datum nog, als hij er goed uitziet en goed ruikt.', GEEN),
    ],
    check: VLEES_CHECK,
    weg: VLEES_WEG, wegUitleg: VLEES_UITLEG,
    tip: 'Rookworst kan prima de vriezer in, tot 3 maanden. Ontdooi in de koelkast en verwarm hem goed.',
    tweedeLeven: [],
    bron: [BRON.bw('rookworst-ambachtelijk-gekookt'), BRON.vc],
  },
  {
    id: 'vega-gehakt', naam: 'Vleesvervangers', kleur: '#e8efd9', categorie: 'vlees', datum: 'kies',
    zoek: ['vegetarisch gehakt', 'vega gehakt', 'vegaburger', 'vleesvervanger', 'vegetarische burger', 'tofu', 'tempeh', 'vegetarisch', 'vegan', 'kipstuckjes vega'],
    vragen: [VRAAG_SOORT, VRAAG_PLEK('In de koelkast'), { ...VRAAG_OPEN, alleenAls: { plek: 'koel' } }],
    situaties: [
      S({ plek: 'vriezer' }, 'vriezer', 90, 180, 'twijfel', 'In de vriezer blijven vleesvervangers zo’n 3 maanden goed.'),
      S({ plek: 'koel', open: 'open' }, 'open', 2, 2, 'ghost', 'Open eet je vleesvervangers binnen 2 dagen op.'),
      S({ soort: 'tgt', plek: 'koel' }, 'datum', 0, 0, 'ghost', 'Staat er TGT op? Dan uiterlijk op de datum opeten.'),
      S({ soort: 'tht', plek: 'koel' }, 'datum', 0, 2, 'ghost', 'Staat er THT op? Dan kan het kort na de datum nog, als het er goed uitziet en goed ruikt.', GEEN),
    ],
    check: ['Ruik: een afwijkende, zure geur betekent weg.', 'Kijk naar schimmel of verkleuring.', 'Uitgedroogde randjes zijn niet erg; slijmerig wel.'],
    weg: ['Een afwijkende of zure geur', 'Schimmel of verkleuring', 'Slijmerig'],
    wegUitleg: 'Ook bij vega geldt: twijfel je, dan niet doen.',
    tip: 'Bewaar ze op de koudste plek in de koelkast, of vries ze op tijd in.',
    tweedeLeven: [],
    bron: [BRON.bw('vegetarisch-gehakt-onbereid'), BRON.vc],
  },

  // ======================= GROENTE EN KANT-EN-KLAAR =======================
  {
    id: 'sla', naam: 'Sla en voorgesneden groente', kleur: '#e3f1df', categorie: 'vers', datum: 'TGT',
    zoek: ['sla', 'zakje sla', 'ijsbergsla', 'rucola', 'veldsla', 'spinazie', 'voorgesneden groente', 'roerbakgroente', 'nasigroente', 'bamigroente', 'soepgroente', 'snijbonen gesneden'],
    vragen: [],
    situaties: [S({}, 'datum', 0, 0, 'ghost', 'Voorgesneden groente in een zakje eet je uiterlijk op de datum, het liefst dezelfde dag als je het opent.')],
    check: ['Een zakje dat een beetje bol staat is vaak gewoon goed: er zit een speciaal luchtmengsel in.', 'Kijk of de groente fris is: niet slap, slijmerig of bruin.', 'Ruik: zuur betekent weg.'],
    weg: ['Slijmerig of papperig', 'Schimmel', 'Een zure geur'],
    wegUitleg: 'Voorgesneden groente met een TGT-datum eet je na de datum niet meer.',
    tip: 'Bewaar zakjes sla niet naast appels, bananen of peren: daardoor bederft sla sneller.',
    tweedeLeven: [],
    bron: [{ naam: 'Voedingscentrum: Groente (voorgesneden)', url: 'https://www.voedingscentrum.nl/encyclopedie/groente.aspx' }, BRON.bw('sla-krop-rauw')],
  },
  {
    id: 'hummus', naam: 'Hummus en dips', kleur: '#f6ead3', categorie: 'groente', datum: 'kies',
    zoek: ['hummus', 'humus', 'dip', 'dips', 'tzatziki', 'guacamole', 'baba ganoush', 'smeersel', 'spread'],
    vragen: [VRAAG_SOORT, VRAAG_OPEN],
    situaties: [
      S({ open: 'open' }, 'open', 5, 10, 'ghost', 'Open blijft kant-en-klare hummus 5 tot 10 dagen goed in de koelkast. Zelfgemaakt maar 1 tot 3 dagen.'),
      S({ soort: 'tgt' }, 'datum', 0, 0, 'ghost', 'Staat er TGT op? Dan uiterlijk op de datum opeten.'),
      S({ soort: 'tht' }, 'datum', 0, 3, 'ghost', 'Staat er THT op? Dan kan het kort na de datum nog. Kijk, ruik en proef.', GEEN),
    ],
    check: ['Kijk of er schimmel op zit.', 'Is het verkleurd of waterig geworden? Dan niet meer eten.', 'Ruik: zuur of gistig is niet goed.'],
    weg: ['Verkleurd en waterig', 'Schimmel', 'Zure of gistige geur'],
    wegUitleg: 'Verkleurd en waterig betekent weg, ook als het nog binnen de tijd is.',
    tip: 'Schep met een schoon mes of lepel, en niet met een stuk brood waar je al van hebt gegeten. Invriezen kan tot 3 maanden.',
    tweedeLeven: ['Als saus over geroosterde groente', 'Door een pastasaus'],
    bron: [BRON.bw('hummus-naturel'), BRON.vc],
  },
  {
    id: 'restjes', naam: 'Restjes, zelf gekookt', kleur: '#e2eefb', categorie: 'groente', datum: 'zelf',
    zoek: ['restjes', 'restje', 'kliekjes', 'gekookte pasta', 'gekookte rijst', 'avondeten', 'maaltijd', 'zelf gekookt', 'meal prep', 'soep'],
    vragen: [VRAAG_PLEK('In de koelkast')],
    situaties: [
      S({ plek: 'vriezer' }, 'vriezer', 90, 180, 'twijfel', 'Ingevroren restjes zijn zo’n 3 maanden goed. Daarna gaat de kwaliteit achteruit.'),
      S({ plek: 'koel' }, 'gekookt', 2, 2, 'ghost', 'Restjes eet je binnen 2 dagen op. Lukt dat niet? Vries ze op tijd in.'),
    ],
    check: ['Stond het binnen 2 uur na het koken in de koelkast? Anders liever niet.', 'Warm restjes goed door: dampend heet, ook in het midden.', 'Ruik en kijk: zuur of schimmel betekent weg.'],
    weg: ['Langer dan 2 uur buiten de koelkast gestaan', 'Een zure geur', 'Schimmel'],
    wegUitleg: 'Eten dat lang buiten de koelkast heeft gestaan, kan bacteriën bevatten die je niet ziet of ruikt.',
    tip: 'Laat restjes snel afkoelen, zet ze goed afgesloten in de koelkast en vries in porties in.',
    tweedeLeven: ['Pasta: een frittata of pastasalade', 'Rijst: nasi of gebakken rijst (goed heet)', 'Groente: soep of een wrap'],
    bron: [BRON.bw('pasta-gekookt')],
  },

  // ======================= VOORRAADKAST =======================
  {
    id: 'chips', naam: 'Chips en nootjes', kleur: '#fff2b8', categorie: 'voorraad', datum: 'THT',
    zoek: ['chips', 'nachos', 'tortillachips', 'popcorn', 'nootjes', 'pinda', 'pindas', 'borrelnootjes', 'zoutjes'],
    vragen: [VRAAG_OPEN],
    situaties: [
      S({ open: 'dicht' }, 'datum', 60, 120, 'twijfel', 'Een dichte zak is tot zo’n 2 maanden na de datum goed, als de verpakking heel is.'),
      S({ open: 'open' }, 'open', 5, 14, 'twijfel', 'Een open zak is na 2 tot 5 dagen minder knapperig. Niet erg, alleen minder lekker.'),
    ],
    check: ['Ruik: ranzig of muf betekent dat de olie over is.', 'Slap is niet erg: 5 minuten in de oven en ze zijn weer krokant.'],
    weg: ['Ranzige geur of smaak', 'Schimmel'],
    wegUitleg: 'Ranzig smaakt vies. Weg ermee.',
    tip: 'Sluit een open zak met een knijper of doe het in een afgesloten bak.',
    tweedeLeven: ['Verkruimeld als krokant laagje op een ovenschotel', 'Paneerlaag voor kip of vis'],
    bron: [BRON.bw('chips')],
  },
  {
    id: 'cornflakes', naam: 'Ontbijtgranen', kleur: '#fdeab0', categorie: 'voorraad', datum: 'THT',
    zoek: ['cornflakes', 'muesli', 'granola', 'cruesli', 'havermout', 'ontbijtgranen', 'cereals', 'brinta'],
    vragen: [],
    situaties: [S({}, 'datum', 60, 120, 'twijfel', 'Ontbijtgranen zijn tot zo’n 2 maanden na de datum goed, als ze er goed uitzien en de verpakking heel is. Open blijven ze enkele maanden lekker.')],
    check: DROOG_CHECK, weg: DROOG_WEG,
    wegUitleg: 'Beestjes of een muffe lucht? Weg ermee.',
    tip: DROOG_TIP,
    tweedeLeven: ['Slappe cornflakes even in de oven: weer krokant', 'Als krokant laagje op een crumble'],
    bron: [BRON.bw('ontbijtproduct-cornflakes')],
  },
  {
    id: 'pindakaas', naam: 'Pindakaas en chocopasta', kleur: '#f3dcc2', categorie: 'voorraad', datum: 'THT',
    zoek: ['pindakaas', 'chocopasta', 'nutella', 'hazelnootpasta', 'notenpasta', 'speculoospasta'],
    vragen: [],
    situaties: [S({}, 'datum', 60, 120, 'twijfel', 'Pindakaas is tot zo’n 2 maanden na de datum goed, en vaak langer. Open blijft hij tot een jaar goed in de kast.')],
    check: ['Ruik en proef: ranzig of anders dan normaal betekent dat hij over is.', 'Een laagje olie bovenop is normaal: even roeren.'],
    weg: ['Ranzige geur of smaak', 'Schimmel'],
    wegUitleg: 'Ranzige pindakaas is niet lekker meer.',
    tip: 'Sluit de pot goed af en bewaar hem op een droge plek. Gebruik een schoon mes.',
    tweedeLeven: ['Satésaus', 'Door havermout of een smoothie'],
    bron: [BRON.bw('pindakaas')],
  },
  {
    id: 'jam', naam: 'Jam en zoet beleg', kleur: '#fbd9de', categorie: 'voorraad', datum: 'THT',
    zoek: ['jam', 'confiture', 'stroop', 'appelstroop', 'honing', 'hagelslag', 'vlokken', 'zoet beleg'],
    vragen: [],
    situaties: [S({}, 'datum', 365, 730, 'twijfel', 'Door de vele suiker bederft jam niet snel: tot een jaar na de datum en vaak langer. Open tot een jaar, in de kast of koelkast.')],
    check: ['Kijk of er schimmel op zit.', 'Ruik: gistig of alcoholisch betekent dat de jam gaat gisten.'],
    weg: ['Schimmel', 'Gistige of alcoholische geur'],
    wegUitleg: 'Schimmel op jam? Gooi de hele pot weg, niet alleen het plekje.',
    tip: 'Schep jam altijd met een schoon mes, zonder broodkruimels. Dan blijft hij het langst goed.',
    tweedeLeven: ['Door de yoghurt', 'Saus bij pannenkoeken', 'In een cake of crumble'],
    bron: [BRON.bw('jam')],
  },
  {
    id: 'pastasaus', naam: 'Pastasaus en pesto, in pot', kleur: '#fbdcd6', categorie: 'voorraad', datum: 'THT',
    zoek: ['pastasaus', 'tomatensaus', 'pesto', 'groene pesto', 'rode pesto', 'curry saus', 'wokasaus', 'saus in pot', 'passata', 'tomatenpuree', 'tomatenblokjes'],
    vragen: [VRAAG_OPEN],
    situaties: [
      S({ open: 'dicht' }, 'datum', 60, 120, 'twijfel', 'Een dichte pot is tot zo’n 2 maanden na de datum goed, als de pot heel is en het deksel niet bol staat.'),
      S({ open: 'open' }, 'open', 3, 5, 'ghost', 'Open blijft pastasaus ongeveer 3 dagen goed in de koelkast, pesto ongeveer 4 dagen. Invriezen kan tot 3 maanden.'),
    ],
    check: ['Klikt het deksel bij het openen? Dan was de pot goed dicht.', 'Kijk of er schimmel op zit, ook onder het deksel.', 'Ruik: zuur of gistig is niet goed.'],
    weg: ['Een bol deksel of een pot die niet klikt', 'Schimmel', 'Zure of gistige geur'],
    wegUitleg: 'Schimmel in een pot saus? Dan de hele pot weg.',
    tip: 'Over van een pot? Vries de rest in een bakje in. Zo heb je later een snelle maaltijd.',
    tweedeLeven: ['Shakshuka', 'Basis voor soep of een ovenschotel'],
    bron: [BRON.bw('pastasaus-zonder-vlees'), BRON.bw('pesto')],
  },
  {
    id: 'bonen-blik', naam: 'Blik en pot, groente, bonen, fruit, soep', kleur: '#e3f1df', categorie: 'voorraad', datum: 'THT',
    zoek: ['blik', 'blikje', 'conserven', 'pot', 'bonen', 'kidneybonen', 'bruine bonen', 'witte bonen', 'kikkererwten', 'linzen', 'mais', 'doperwten', 'sperziebonen in pot', 'rode bieten', 'zuurkool', 'augurken', 'tomatenblokjes', 'groente in pot', 'fruit in blik', 'ananas', 'perziken', 'appelmoes', 'tonijn in blik', 'sardines', 'soep in blik', 'ravioli in blik', 'knakworst in blik'],
    vragen: [VRAAG_OPEN],
    situaties: [
      S({ open: 'dicht' }, 'datum', 365, 730, 'twijfel', 'Een heel blik of een dichte pot is vaak nog een jaar of langer na de datum goed.'),
      S({ open: 'open' }, 'open', 2, 3, 'ghost', 'Open doe je de rest in een bakje en eet je het binnen 2 dagen op. Invriezen kan tot 3 maanden.'),
    ],
    check: ['Is het blik niet bol, gedeukt bij de naad, roestig of lekkend?', 'Spuit het bij het openen of ruikt het raar? Niet eten.', 'Kijk of er schimmel op zit.'],
    weg: ['Een bol, lekkend of roestig blik', 'Spuit bij het openen', 'Schimmel of een vreemde geur'],
    wegUitleg: 'Een bol blik kan betekenen dat er bacteriën in groeien. Niet openen, gewoon weggooien.',
    tip: 'Bewaar blikken en potten koel, droog en donker. Zet het eerst gekochte blik vooraan.',
    tweedeLeven: ['Bonen: chili, soep of een dip', 'Kikkererwten: hummus of krokant uit de oven'],
    bron: [BRON.bw('bruine-bonen-blik-glas'), BRON.vb],
  },
);

// ---------- Uitbreiding: groente en fruit, diepvries en meer voorraad ----------
// Losse groente en fruit hebben geen datum: je telt vanaf de dag dat je het kocht (tijd 'gekocht').
const VRIES_LOS = (match, twijfel, tekst) => S({ plek: 'vriezer' }, 'vriezer', match, twijfel, 'twijfel', tekst);
const VERS_CHECK = ['Kijk naar schimmel of rotte, natte plekken.', 'Voel: slap of rimpelig is niet erg, slijmerig wel.', 'Ruik: zuur of rot betekent weg.'];
const VERS_WEG = ['Schimmel', 'Rot, nat of slijmerig', 'Een zure of rotte geur'];
const DIEPVRIES = 'Diepvriesproducten zijn tot een jaar na de datum goed, en vaak langer, zolang de verpakking heel is en het steeds bevroren is gebleven.';

PRODUCTEN.push(
  // ======================= GROENTE EN FRUIT =======================
  {
    id: 'banaan', naam: 'Bananen', kleur: '#fff2b8', categorie: 'vers', datum: 'los',
    zoek: ['banaan', 'bananen', 'bruine banaan', 'rijpe banaan'],
    vragen: [{ id: 'plek', label: 'Waar heb je ze bewaard?', opties: [{ id: 'schaal', label: 'Op de fruitschaal' }, { id: 'vriezer', label: 'In de vriezer' }] }],
    situaties: [
      VRIES_LOS(240, 365, 'Zonder schil ingevroren blijven bananen 8 tot 12 maanden goed. Perfect voor smoothies of bananenbrood.'),
      S({ plek: 'schaal' }, 'gekocht', 3, 7, 'twijfel', 'Op de fruitschaal blijven bananen 3 tot 7 dagen lekker. Daarna worden ze bruin en zoeter: ideaal om mee te bakken.'),
    ],
    check: ['Een bruine of gevlekte schil is niet erg: de banaan is dan juist extra zoet.', 'Pel hem: zwart, papperig of gistig ruikend vruchtvlees eet je niet meer.'],
    weg: ['Schimmel', 'Zwart en papperig vanbinnen', 'Ruikt gistig of naar alcohol'],
    wegUitleg: 'Een bruine schil mag, zwart en papperig vruchtvlees niet.',
    tip: 'Bewaar bananen buiten de koelkast en apart van ander fruit: daardoor rijpt dat sneller. Folie om de steeltjes houdt ze langer goed.',
    tweedeLeven: ['Bananenbrood', 'Smoothie', 'Pannenkoekjes van banaan en ei', 'Invriezen voor "nice cream"'],
    bron: [BRON.bw('banaan')],
  },
  {
    id: 'appel', naam: 'Appels en peren', kleur: '#fde0da', categorie: 'vers', datum: 'los',
    zoek: ['appel', 'appels', 'peer', 'peren', 'elstar', 'jonagold', 'pink lady'],
    vragen: [{ id: 'plek', label: 'Waar heb je ze bewaard?', opties: [{ id: 'koel', label: 'In de koelkast' }, { id: 'schaal', label: 'Op de fruitschaal' }, { id: 'vriezer', label: 'In de vriezer' }] }],
    situaties: [
      VRIES_LOS(240, 365, 'In partjes ingevroren blijven appels 8 tot 12 maanden goed. Daarna vooral lekker in moes of taart.'),
      S({ plek: 'koel' }, 'gekocht', 30, 90, 'twijfel', 'In de koelkast blijven appels weken tot maanden goed.'),
      S({ plek: 'schaal' }, 'gekocht', 7, 14, 'twijfel', 'Op de fruitschaal blijven appels ongeveer een week lekker, daarna worden ze melig.'),
    ],
    check: ['Een gerimpelde of melige appel is niet erg: prima voor appelmoes of taart.', 'Snijd een kleine beurse plek ruim weg.', 'Schimmel of rot rond het klokhuis? Dan weg.'],
    weg: ['Schimmel', 'Groot rot of nat plekje', 'Een gistige geur'],
    wegUitleg: 'Een kleine beurse plek snijd je weg. Schimmel of rot betekent weg.',
    tip: 'Appels houden het langst in de groentelade van de koelkast, apart van andere groente en fruit.',
    tweedeLeven: ['Appelmoes', 'Appeltaart of crumble', 'Gebakken appeltjes met kaneel'],
    bron: [BRON.bw('appel-met-schil')],
  },
  {
    id: 'aardbeien', naam: 'Aardbeien en bessen', kleur: '#fbd9de', categorie: 'vers', datum: 'los',
    zoek: ['aardbeien', 'aardbei', 'frambozen', 'blauwe bessen', 'bessen', 'bramen', 'zacht fruit'],
    vragen: [{ id: 'plek', label: 'Waar heb je ze bewaard?', opties: [{ id: 'koel', label: 'In de koelkast' }, { id: 'schaal', label: 'Op het aanrecht' }, { id: 'vriezer', label: 'In de vriezer' }] }],
    situaties: [
      VRIES_LOS(240, 365, 'Ingevroren blijven aardbeien 8 tot 12 maanden goed. Na het ontdooien zijn ze zacht: lekker in smoothies of saus.'),
      S({ plek: 'koel' }, 'gekocht', 1, 3, 'ghost', 'In de koelkast blijven aardbeien 1 tot 3 dagen goed.'),
      S({ plek: 'schaal' }, 'gekocht', 1, 1, 'ghost', 'Buiten de koelkast eet je aardbeien dezelfde dag op.'),
    ],
    check: ['Kijk het bakje goed door, ook onderin: schimmel verspreidt zich snel.', 'Slappe aardbeien zijn niet erg, beschimmelde wel.'],
    weg: ['Schimmel', 'Papperig en lekkend'],
    wegUitleg: 'Gooi beschimmelde aardbeien weg en de aardbeien die ertegenaan lagen ook. De rest kun je goed bekijken.',
    tip: 'Laat de kroontjes eraan tot je ze eet en bewaar ze droog, bijvoorbeeld op keukenpapier.',
    tweedeLeven: ['Smoothie', 'Jam of compote', 'Invriezen voor later'],
    bron: [BRON.bw('aardbeien')],
  },
  {
    id: 'avocado', naam: 'Avocado', kleur: '#e8efd9', categorie: 'vers', datum: 'los',
    zoek: ['avocado', 'avocados', 'avocado’s'],
    vragen: [{ id: 'plek', label: 'Waar heb je hem bewaard?', opties: [{ id: 'schaal', label: 'Op de fruitschaal' }, { id: 'vriezer', label: 'In de vriezer' }] }],
    situaties: [
      VRIES_LOS(240, 365, 'Gepureerd of in stukjes ingevroren blijft avocado 8 tot 12 maanden goed. Daarna lekker in guacamole of een smoothie.'),
      S({ plek: 'schaal' }, 'gekocht', 3, 6, 'twijfel', 'Op de fruitschaal is een avocado 1 tot 6 dagen goed, afhankelijk van hoe rijp hij was. Eenmaal rijp kan hij nog wat langer in de koelkast.'),
    ],
    check: ['Bruine draadjes of een paar bruine plekjes kun je wegsnijden.', 'Heel zacht, grijs of zuur ruikend vruchtvlees eet je niet.'],
    weg: ['Schimmel', 'Grotendeels bruin of grijs vanbinnen', 'Een zure of ranzige geur'],
    wegUitleg: 'Een paar bruine plekjes snijd je weg, een grijze of zure avocado niet.',
    tip: 'Halve avocado over? Laat de pit erin, dek hem af en zet hem in de koelkast.',
    tweedeLeven: ['Guacamole', 'Op toast', 'Door een smoothie'],
    bron: [BRON.bw('avocado')],
  },
  {
    id: 'champignons', naam: 'Champignons', kleur: '#f1e6d2', categorie: 'vers', datum: 'los',
    zoek: ['champignons', 'champignon', 'paddenstoelen', 'kastanjechampignons', 'oesterzwammen'],
    vragen: [{ id: 'plek', label: 'Waar heb je ze bewaard?', opties: [{ id: 'koel', label: 'In de koelkast' }, { id: 'vriezer', label: 'In de vriezer' }] }],
    situaties: [
      VRIES_LOS(90, 180, 'Geblancheerd of gebakken ingevroren blijven champignons 3 maanden goed.'),
      S({ plek: 'koel' }, 'gekocht', 3, 5, 'ghost', 'In de koelkast blijven champignons ongeveer 3 dagen goed.'),
    ],
    check: ['Een paar bruine plekjes zijn niet erg.', 'Slijmerig, slap of zuur ruikend? Dan weg.'],
    weg: ['Slijmerig', 'Schimmel', 'Een zure geur'],
    wegUitleg: 'Slijmerige champignons gooi je weg.',
    tip: 'Bewaar champignons in een papieren zak of een afgesloten bakje, niet in plastic.',
    tweedeLeven: ['Champignonsoep', 'Roerbakken of door de pastasaus'],
    bron: [BRON.bw('champignons-rauw')],
  },
  {
    id: 'broccoli', naam: 'Broccoli en kool', kleur: '#e3f1df', categorie: 'vers', datum: 'los',
    zoek: ['broccoli', 'bloemkool', 'spruitjes', 'kool', 'boerenkool', 'spitskool', 'sperziebonen', 'prei'],
    vragen: [{ id: 'plek', label: 'Waar heb je het bewaard?', opties: [{ id: 'koel', label: 'In de koelkast' }, { id: 'schaal', label: 'Buiten de koelkast' }, { id: 'vriezer', label: 'In de vriezer' }] }],
    situaties: [
      VRIES_LOS(365, 540, 'Kort geblancheerd en ingevroren blijft broccoli een jaar goed.'),
      S({ plek: 'koel' }, 'gekocht', 3, 5, 'twijfel', 'In de koelkast blijft broccoli 3 tot 5 dagen goed.'),
      S({ plek: 'schaal' }, 'gekocht', 1, 2, 'twijfel', 'Buiten de koelkast blijft broccoli maar 1 tot 2 dagen goed.'),
    ],
    check: ['Een beetje geel worden is niet erg: dan is hij minder lekker, maar nog prima te eten.', 'Slap? Even in koud water zetten.', 'Schimmel of een zure geur? Dan weg.'],
    weg: ['Schimmel', 'Slijmerig of bruin en nat', 'Een zure geur'],
    wegUitleg: 'Geel mag, beschimmeld of slijmerig niet.',
    tip: 'Bewaar broccoli in de koelkast in een open zak of verpakking.',
    tweedeLeven: ['Broccolisoep', 'Ovenschotel', 'Roerbakken'],
    bron: [BRON.bw('broccoli-rauw')],
  },

  // ======================= DIEPVRIES =======================

  // ======================= VOORRAADKAST (EXTRA) =======================
  {
    id: 'olie', naam: 'Olie en azijn', kleur: '#f3f6d8', categorie: 'voorraad', datum: 'THT',
    zoek: ['olie', 'olijfolie', 'zonnebloemolie', 'frituurolie', 'bakolie', 'azijn', 'sojasaus'],
    vragen: [],
    situaties: [S({}, 'datum', 60, 120, 'twijfel', 'Olie is tot zo’n 2 maanden na de datum goed, en vaak langer. Open blijft het ongeveer een jaar goed.')],
    check: ['Ruik en proef: ranzig, zuur of anders dan normaal betekent dat de olie over is.', 'Donker verkleurd? Niet meer gebruiken.'],
    weg: ['Ranzige of zure geur', 'Donker verkleurd'],
    wegUitleg: 'Ranzige olie smaakt vies en gebruik je niet meer.',
    tip: 'Bewaar olie afgesloten, koel en donker, dus niet naast het fornuis.',
    tweedeLeven: [],
    bron: [BRON.bw('olijfolie')],
  },
  {
    id: 'koffie', naam: 'Koffie en thee', kleur: '#efdccd', categorie: 'voorraad', datum: 'THT',
    zoek: ['koffie', 'koffiebonen', 'gemalen koffie', 'koffiepads', 'cups', 'thee', 'theezakjes', 'oploskoffie'],
    vragen: [],
    situaties: [S({}, 'datum', 365, 730, 'twijfel', 'Droge koffie en thee zijn tot een jaar na de datum goed, en vaak langer, als ze droog bewaard zijn. Open verliest koffie na een paar weken wel smaak.')],
    check: ['Ruik eraan: minder geur betekent minder smaak, niet dat het bedorven is.', 'Vochtig geworden of schimmel? Dan weg.'],
    weg: ['Schimmel', 'Vochtig geworden'],
    wegUitleg: 'Vochtige of beschimmelde koffie of thee gooi je weg.',
    tip: 'Bewaar koffie en thee koel, droog en donker in een goed sluitende pot.',
    tweedeLeven: ['Oude koffie: in tiramisu of een koffiecake', 'Koffiedik: als plantenvoeding'],
    bron: [BRON.bw('koffiebonen')],
  },
);

// ---------- Samengevoegde productgroepen en extra veelgezochte producten ----------
// Producten met (bijna) dezelfde regels staan samen in één groep. Verschillen de regels een beetje,
// dan geldt de voorzichtigste. De oude namen blijven vindbaar via 'zoek' en via ALIAS hieronder.
PRODUCTEN.push(
  // ---------- Zuivel ----------
  {
    id: 'melk', naam: 'Melk en melkvervangers', kleur: '#dfeafb', categorie: 'zuivel', datum: 'THT',
    zoek: ['melk', 'halfvolle melk', 'volle melk', 'magere melk', 'karnemelk', 'koemelk', 'houdbare melk', 'lang houdbare melk', 'uht melk', 'koffiemelk', 'chocolademelk', 'drinkyoghurt', 'haverdrink', 'havermelk', 'oatly', 'sojamelk', 'sojadrink', 'amandelmelk', 'amandeldrink', 'plantaardige melk', 'rijstdrink'],
    vragen: [
      { id: 'soort', label: 'Wat voor melk?', opties: [{ id: 'vers', label: 'Uit de koeling (vers)' }, { id: 'houdbaar', label: 'Lang houdbaar, uit het schap' }, { id: 'plant', label: 'Plantaardig, uit het schap' }] },
      VRAAG_OPEN,
    ],
    situaties: [
      S({ soort: 'plant', open: 'open' }, 'open', 5, 7, 'ghost', 'Open blijft een plantaardige drink 5 tot 7 dagen goed in de koelkast.'),
      S({ open: 'open' }, 'open', 7, 10, 'ghost', 'Open blijft melk ongeveer een week goed in de koelkast. Daarna kijk, ruik en proef je.'),
      S({ soort: 'vers' }, 'datum', 1, 5, 'ghost', 'Gooi verse melk niet meteen weg na de datum: kijk, ruik en proef een slokje.', GEEN),
      S({}, 'datum', 60, 365, 'twijfel', 'Lang houdbare melk en plantaardige drinks uit het schap kunnen dicht vaak nog maanden na de datum.'),
    ],
    check: ['Is het pak niet bol?', 'Ruik aan het pak: zuur is niet goed.', 'Schenk een beetje in een glas: klontjes of vlokken betekent weg.', 'Proef een slokje: smaakt het gewoon? Dan zit je goed.'],
    weg: ['Een bol of lekkend pak', 'Zure geur of smaak', 'Klontjes, vlokken of brokken'],
    wegUitleg: 'Zure of klonterige melk drink je niet meer.',
    tip: 'Zet melk na het inschenken meteen terug in de koelkast, niet in de deur maar op een koude plank. Lang houdbaar hoeft pas na het openen de koelkast in.',
    tweedeLeven: ['Pannenkoeken of wentelteefjes', 'Havermout of rijstepap', 'Smoothie', 'Een witte saus'],
    bron: [BRON.bw('melk-halfvol'), BRON.bw('lang-houdbare-melk'), BRON.bw('haverdrink'), BRON.vb],
  },
  {
    id: 'slagroom', naam: 'Room en crème fraîche, slagroom, kookroom, zure room', kleur: '#fdf0cc', categorie: 'zuivel', datum: 'THT',
    zoek: ['slagroom', 'room', 'kookroom', 'zure room', 'creme fraiche', 'crème fraîche', 'smetana', 'sour cream', 'cooking cream', 'opklopbare room'],
    vragen: [VRAAG_OPEN],
    situaties: [
      S({ open: 'dicht' }, 'datum', 1, 3, 'ghost', 'Gooi room niet meteen weg na de datum: kijk, ruik en proef een beetje.', GEEN),
      S({ open: 'open' }, 'open', 4, 6, 'ghost', 'Open blijven room en crème fraîche 4 tot 7 dagen goed in de koelkast.'),
    ],
    check: ZUIVEL_CHECK,
    weg: ['Brokken of waterig', 'Zure geur', 'Schimmel'],
    wegUitleg: 'Schimmel in een bakje? Dan het hele bakje weg, niet alleen de bovenkant.',
    tip: 'Schep met een schone lepel. Invriezen kan, maar de structuur verandert: gebruik het daarna in saus of soep, niet om te kloppen.',
    tweedeLeven: ['Pastasaus of soep', 'Romige ovenschotel', 'Dipsaus met kruiden'],
    bron: [BRON.bw('slagroom-ongeklopt'), BRON.bw('creme-fraiche-halfvol'), BRON.vb],
  },
  {
    id: 'gekookte-eieren', naam: 'Eieren, gekookt', kleur: '#fdf0cc', categorie: 'zuivel', datum: 'zelf',
    zoek: ['gekookt ei', 'gekookte eieren', 'hardgekookt ei', 'hardgekookte eieren', 'zachtgekookt ei', 'gepeld ei', 'paaseieren', 'eitje'],
    vragen: [{ id: 'soort', label: 'Wat voor ei?', opties: [{ id: 'hard', label: 'Hardgekookt, nog in de schaal' }, { id: 'gepeld', label: 'Hardgekookt en gepeld' }, { id: 'zacht', label: 'Zachtgekookt' }] }],
    situaties: [
      S({ soort: 'hard' }, 'gekookt', 7, 7, 'ghost', 'Een hardgekookt ei in de schaal blijft een week goed in de koelkast.'),
      S({}, 'gekookt', 2, 2, 'ghost', 'Gepeld of zachtgekookt bewaar je een ei maar 2 dagen in de koelkast, in een afgesloten bakje.'),
    ],
    check: ['Stond het ei in de koelkast? Buiten de koelkast eet je het dezelfde dag op.', 'Ruik eraan: een sterke zwavellucht betekent weg.'],
    weg: ['Een sterke zwavel- of rotte-eierenlucht', 'Slijmerig', 'Lang buiten de koelkast gestaan'],
    wegUitleg: 'Ruikt het ei raar of is het slijmerig? Weg ermee.',
    tip: 'Laat gekookte eieren snel afkoelen in koud water en zet ze daarna in de koelkast.',
    tweedeLeven: ['Eiersalade', 'In een salade of op brood'],
    bron: [BRON.bw('ei-gekookt')],
  },

  // ---------- Kaas ----------
  {
    id: 'brie', naam: 'Zachte kaas, brie, mozzarella, roomkaas', kleur: '#f6f0de', categorie: 'kaas', datum: 'THT',
    zoek: ['brie', 'camembert', 'zachte kaas', 'schimmelkaas', 'witschimmelkaas', 'gorgonzola', 'blauwe kaas', 'mozzarella', 'burrata', 'verse kaas', 'feta', 'ricotta', 'mascarpone', 'cottage cheese', 'roomkaas', 'philadelphia', 'smeerkaas', 'kruidenkaas', 'boursin', 'cream cheese', 'geitenkaas'],
    vragen: [VRAAG_OPEN],
    situaties: [
      S({ open: 'dicht' }, 'datum', 0, 0, 'ghost', 'Zachte en verse kaas eet je uiterlijk op de datum.', { ghostTekst: 'Zachte en verse kazen zijn gevoelig voor ziekmakende bacteriën. Houd je bij deze kaas aan de datum.' }),
      S({ open: 'open' }, 'open', 4, 4, 'ghost', 'Open blijft zachte en verse kaas ongeveer 4 dagen goed in de koelkast.'),
    ],
    check: ['De witte korst van brie of camembert hoort erbij. Andere kleuren schimmel niet.', 'Ruik: zuur, vreemd of een scherpe ammoniaklucht betekent weg.', 'Mozzarella: is het vocht helder? Troebel of slijmerig is niet goed.'],
    weg: ['Schimmel die er niet hoort', 'Zure, vreemde of scherpe geur', 'Slijmerig of troebel vocht'],
    wegUitleg: 'Bij zachte kaas snijd je schimmel niet weg: dan gaat de hele kaas weg.',
    tip: 'Bewaar zachte kaas in een afsluitbaar bakje of de eigen verpakking, mozzarella in het eigen vocht. Schep met een schoon mes. Zwanger? Kies kaas van gepasteuriseerde melk.',
    tweedeLeven: ['Brie uit de oven met honing', 'Mozzarella op een pizza of in een ovenschotel', 'Roomkaas door een pastasaus'],
    bron: [BRON.bw('brie-60-plus'), BRON.bw('mozzarella'), BRON.bw('roomkaas-60-plus')],
  },

  // ---------- Vlees en vis ----------
  {
    id: 'kipfilet', naam: 'Rauw vlees en kip, kipfilet, gehakt, biefstuk', kleur: '#fde0da', categorie: 'vlees', datum: 'TGT',
    zoek: ['kip', 'kipfilet', 'kippenvlees', 'kipreepjes', 'kippendijen', 'kipblokjes', 'drumsticks', 'gevogelte', 'vlees', 'rauw vlees', 'gehakt', 'rundergehakt', 'half om half', 'varkensgehakt', 'hamburger', 'burgers', 'gehaktballen', 'slavink', 'biefstuk', 'speklapjes', 'spek', 'karbonade', 'shoarma', 'stoofvlees', 'varkenshaas', 'worstjes', 'braadworst'],
    vragen: [VRAAG_PLEK_TGT],
    situaties: [
      VRIES_VLEES,
      S({ plek: 'koel' }, 'datum', 0, 0, 'ghost', 'Rauw vlees en kip eet je uiterlijk op de datum. Al open? Kip binnen 2 dagen, gehakt dezelfde of de volgende dag.'),
    ],
    check: [...VLEES_CHECK, 'Bak kip en gehakt altijd helemaal gaar: vanbinnen niet meer roze.'],
    weg: VLEES_WEG, wegUitleg: VLEES_UITLEG,
    tip: 'Haal je de datum niet? Vries het op tijd in. Ontdooi in de koelkast (niet op het aanrecht) en bak het daarna binnen een dag.',
    tweedeLeven: [],
    bron: [BRON.bw('kipfilet-onbereid'), BRON.bw('rundergehakt-onbereid'), BRON.vb],
  },
  {
    id: 'vleeswaren', naam: 'Vleeswaren en worst, ham, kipfilet, salami', kleur: '#fce4e8', categorie: 'vlees', datum: 'TGT',
    zoek: ['vleeswaren', 'ham', 'beenham', 'kipfilet beleg', 'rosbief', 'gebraden gehakt', 'boterhamworst', 'leverworst', 'kalkoenfilet', 'beleg', 'salami', 'chorizo', 'droge worst', 'cervelaat', 'snijworst', 'pepperoni', 'fuet', 'filet americain', 'pastrami'],
    vragen: [VRAAG_PLEK_TGT, { ...VRAAG_OPEN, alleenAls: { plek: 'koel' } }],
    situaties: [
      VRIES_VLEES,
      S({ plek: 'koel', open: 'open' }, 'open', 3, 5, 'ghost', 'Open blijven vleeswaren 3 tot 5 dagen goed, en nooit na de datum. Zwanger, of eet je voor ouderen of kleine kinderen? Dan maximaal 2 dagen.'),
      S({ plek: 'koel' }, 'datum', 0, 0, 'ghost', 'Vleeswaren eet je uiterlijk op de datum.'),
    ],
    check: VLEES_CHECK,
    weg: VLEES_WEG, wegUitleg: 'Vleeswaren zijn gevoelig voor listeria. Die zie, ruik en proef je niet.',
    tip: 'Bewaar vleeswaren op de koudste plek in de koelkast (vaak de onderste plank), in een afsluitbaar bakje.',
    tweedeLeven: [],
    bron: [BRON.bw('kipfilet-vleeswaar'), BRON.bw('beenham'), BRON.bw('salami')],
  },
  {
    id: 'zalm', naam: 'Vis, vers en gerookt', kleur: '#fde3d3', categorie: 'vlees', datum: 'TGT',
    zoek: ['vis', 'zalm', 'verse vis', 'kabeljauw', 'pangasius', 'tilapia', 'visfilet', 'garnalen', 'tonijn vers', 'gerookte zalm', 'gerookte vis', 'gerookte makreel', 'paling', 'forel', 'haring', 'mosselen'],
    vragen: [VRAAG_PLEK_TGT],
    situaties: [VRIES_VLEES, S({ plek: 'koel' }, 'datum', 0, 0, 'ghost', 'Vis eet je uiterlijk op de datum, verse vis het liefst dezelfde dag. Open? Binnen 2 dagen.')],
    check: ['Ruik: verse vis ruikt fris, naar zee. Een sterke vislucht of zure geur betekent weg.', 'Kijk: glanzend en stevig is goed, dof, grauw of slap niet.', 'Bak of kook verse vis goed gaar.'],
    weg: ['Een sterke vislucht of zure geur', 'Dof, grauw of slijmerig'],
    wegUitleg: 'Vis, en zeker gerookte vis, is gevoelig voor bacteriën die je niet ziet of ruikt.',
    tip: 'Bewaar vis zo koud mogelijk, onderin de koelkast, of vries hem in op de dag van aankoop. Zwanger? Eet gerookte vis liever verwarmd in een gerecht.',
    tweedeLeven: [],
    bron: [BRON.bw('zalm-rauw'), BRON.bw('zalm-gerookt')],
  },

  // ---------- Groente en fruit ----------
  {
    id: 'tomaat', naam: 'Tomaat en paprika, ook komkommer en courgette', kleur: '#fbd9d4', categorie: 'vers', datum: 'los',
    zoek: ['tomaat', 'tomaten', 'cherrytomaten', 'snoeptomaten', 'paprika', 'puntpaprika', 'komkommer', 'snackkomkommer', 'courgette', 'aubergine', 'groente'],
    vragen: [
      { id: 'plek', label: 'Waar heb je het bewaard?', opties: [{ id: 'schaal', label: 'Op de fruitschaal of in de koelkast' }, { id: 'vriezer', label: 'In de vriezer' }] },
      { id: 'open', label: 'Is het al aangesneden?', alleenAls: { plek: 'schaal' }, opties: [{ id: 'dicht', label: 'Nog heel' }, { id: 'open', label: 'Aangesneden' }] },
    ],
    situaties: [
      VRIES_LOS(90, 180, 'Kort geblancheerd en ingevroren blijven tomaat en paprika minstens 3 maanden goed. Daarna vooral voor saus of soep. Komkommer kun je niet invriezen.'),
      S({ open: 'open' }, 'open', 2, 3, 'ghost', 'Aangesneden bewaar je het afgedekt in de koelkast en eet je het binnen 2 dagen op.'),
      S({ plek: 'schaal' }, 'gekocht', 7, 14, 'twijfel', 'Heel blijven tomaat, paprika en komkommer ongeveer een week goed, het liefst buiten de koelkast. Zacht of gerimpeld is prima voor saus of soep.'),
    ],
    check: ['Zacht, gerimpeld of slap is niet erg: ideaal voor saus, soep of de oven.', 'Snijd kleine rotte plekjes ruim weg.', 'Eet tomaten pas als ze rijp zijn, niet groen.'],
    weg: VERS_WEG,
    wegUitleg: 'Zacht mag, rot, slijmerig of beschimmeld niet.',
    tip: 'Tomaat, paprika en komkommer kunnen niet goed tegen kou: in de koelkast verliezen ze smaak. Een aangesneden stuk bewaar je wel afgedekt in de koelkast.',
    tweedeLeven: ['Tomatensoep of pastasaus', 'Geroosterde groente uit de oven', 'Shakshuka', 'Tzatziki'],
    bron: [BRON.bw('tomaat-rauw'), BRON.bw('paprika-rauw'), BRON.bw('komkommer-met-schil'), BRON.bw('komkommer-zonder-schil')],
  },
  {
    id: 'aardappelen', naam: 'Aardappelen en uien, ook wortels en knoflook', kleur: '#f3e1cf', categorie: 'vers', datum: 'los',
    zoek: ['aardappel', 'aardappelen', 'piepers', 'krieltjes', 'zoete aardappel', 'ui', 'uien', 'rode ui', 'sjalot', 'knoflook', 'wortel', 'wortels', 'worteltjes', 'peen', 'winterpeen', 'bospeen', 'pastinaak', 'knolselderij'],
    vragen: [],
    situaties: [S({}, 'gekocht', 30, 45, 'twijfel', 'Op een koele, droge, donkere plek blijven aardappelen en wortels ongeveer een maand goed, hele uien zelfs zo’n 2 maanden. Een restje gesneden ui: afgedekt in de koelkast, ongeveer een week.')],
    check: ['Groene plekken op aardappelen snijd je ruim weg.', 'Uitlopers (kiemen) mag je wegsnijden, de rest kun je nog eten.', 'Slap of gerimpeld is niet erg om te koken of pureren.'],
    weg: ['Schimmel', 'Rot, zacht en nat of slijmerig', 'Een aardappel die grotendeels groen is'],
    wegUitleg: 'Rot, beschimmeld of grotendeels groen? Dan weg.',
    tip: 'Bewaar ze droog, donker en koel, maar uien en aardappelen niet naast elkaar: dan rotten ze sneller. Slappe wortels worden weer stevig in een glas koud water.',
    tweedeLeven: ['Puree, stamppot of rösti', 'Soep', 'Geroosterd uit de oven'],
    bron: [BRON.bw('aardappelen-rauw'), BRON.bw('ui-rauw'), BRON.bw('winterwortel-rauw')],
  },
  {
    id: 'citrus', naam: 'Citrusfruit, sinaasappel, mandarijn, citroen', kleur: '#fde6cf', categorie: 'vers', datum: 'los',
    zoek: ['sinaasappel', 'sinaasappels', 'mandarijn', 'mandarijnen', 'clementine', 'citroen', 'limoen', 'grapefruit', 'citrus'],
    vragen: [{ id: 'plek', label: 'Waar heb je het bewaard?', opties: [{ id: 'schaal', label: 'Op de fruitschaal' }, { id: 'vriezer', label: 'In de vriezer' }] }],
    situaties: [
      VRIES_LOS(90, 180, 'In stukjes of als sap ingevroren blijft citrusfruit minstens 3 maanden goed.'),
      S({ plek: 'schaal' }, 'gekocht', 14, 21, 'twijfel', 'Op de fruitschaal blijft citrusfruit 1 tot 2 weken goed. Een beetje uitgedroogd is niet erg: pers het uit.'),
    ],
    check: ['Uitgedroogd of minder sappig is niet erg: gebruik het sap of de rasp.', 'Schimmel (vaak groen of wit poeder)? Dan weg, en kijk ook de vruchten ernaast na.'],
    weg: ['Schimmel', 'Zacht en rot'],
    wegUitleg: 'Schimmel op citrusfruit verspreidt zich snel naar de vruchten ernaast.',
    tip: 'Bewaar citrusfruit buiten de koelkast en niet naast appels, bananen of peren. Een aangesneden stuk: snijvlak op een schoteltje in de koelkast.',
    tweedeLeven: ['Vers sap', 'Citroenrasp door een cake of dressing'],
    bron: [BRON.bw('sinaasappel'), BRON.bw('mandarijn')],
  },
  {
    id: 'druiven', naam: 'Druiven', kleur: '#e8e1f3', categorie: 'vers', datum: 'los',
    zoek: ['druiven', 'druif', 'witte druiven', 'blauwe druiven', 'pitloze druiven'],
    vragen: [{ id: 'plek', label: 'Waar heb je ze bewaard?', opties: [{ id: 'koel', label: 'In de koelkast' }, { id: 'schaal', label: 'Op de fruitschaal' }, { id: 'vriezer', label: 'In de vriezer' }] }],
    situaties: [
      VRIES_LOS(240, 365, 'Ingevroren blijven druiven 8 tot 12 maanden goed. Bevroren druiven zijn een lekkere snack.'),
      S({ plek: 'koel' }, 'gekocht', 7, 14, 'twijfel', 'In de koelkast blijven druiven 1 tot 2 weken goed.'),
      S({ plek: 'schaal' }, 'gekocht', 3, 4, 'twijfel', 'Op de fruitschaal blijven druiven 3 tot 4 dagen goed.'),
    ],
    check: ['Een paar rimpelige druiven zijn niet erg.', 'Haal beschimmelde druiven eruit en kijk de rest goed na.'],
    weg: ['Veel schimmel', 'Papperig en gistig ruikend'],
    wegUitleg: 'Losse beschimmelde druiven eruit; is de hele tros aangetast, dan weg.',
    tip: 'Laat druiven aan de tros zitten en bewaar ze droog, bijvoorbeeld in een papieren zak.',
    tweedeLeven: ['Invriezen als snack', 'Door een smoothie'],
    bron: [BRON.bw('druiven')],
  },

  // ---------- Kant-en-klaar ----------
  {
    id: 'sushi', naam: 'Sushi', kleur: '#fde3d3', categorie: 'groente', datum: 'los',
    zoek: ['sushi', 'maki', 'nigiri', 'poke bowl', 'pokebowl', 'sashimi'],
    vragen: [],
    situaties: [S({}, 'gekocht', 1, 1, 'ghost', 'Sushi bewaar je hooguit 1 dag in de koelkast. Staat er een TGT-datum op? Dan uiterlijk op die datum.')],
    check: ['Stond het binnen 2 uur in de koelkast? Anders niet meer eten.', 'Ruik en kijk: een afwijkende geur of doffe kleur betekent weg.'],
    weg: ['Langer dan 2 uur buiten de koelkast', 'Een afwijkende geur', 'Doffe of grauwe vis'],
    wegUitleg: 'Sushi met rauwe vis is erg bederfelijk. Twijfel je? Niet doen.',
    tip: 'Te veel besteld? Meteen in de koelkast, en de volgende dag opeten. Bezorgde sushi vries je niet in.',
    tweedeLeven: [],
    bron: [BRON.bw('sushi')],
  },
  {
    id: 'gebak', naam: 'Taart en gebak', kleur: '#fbe3ea', categorie: 'groente', datum: 'los',
    zoek: ['taart', 'gebak', 'slagroomtaart', 'appeltaart', 'tompouce', 'vlaai', 'bossche bol', 'cake', 'cheesecake', 'muffin', 'croissant', 'donut', 'cupcake', 'verjaardagstaart'],
    vragen: [
      { id: 'room', label: 'Zit er slagroom of room in?', opties: [{ id: 'ja', label: 'Ja (slagroom, room, vla)' }, { id: 'nee', label: 'Nee (appeltaart, cake)' }] },
      { id: 'plek', label: 'Waar heb je het bewaard?', opties: [{ id: 'koel', label: 'In de koelkast' }, { id: 'vriezer', label: 'In de vriezer' }] },
    ],
    situaties: [
      S({ room: 'ja', plek: 'vriezer' }, 'vriezer', 30, 60, 'twijfel', 'Gebak met slagroom blijft ongeveer een maand goed in de vriezer.'),
      S({ plek: 'vriezer' }, 'vriezer', 90, 180, 'twijfel', 'Gebak zonder room blijft ongeveer 3 maanden goed in de vriezer.'),
      S({ room: 'ja' }, 'gekocht', 1, 1, 'ghost', 'Gebak met slagroom of room eet je binnen een dag op. Het is gevoelig voor bederf.'),
      S({}, 'gekocht', 3, 5, 'ghost', 'Gebak zonder room blijft ongeveer 3 dagen goed in de koelkast. Daarna kijk, ruik en proef je.'),
    ],
    check: ['Stond het in de koelkast? Gebak met room buiten de koelkast eet je dezelfde dag op.', 'Kijk naar schimmel en ruik aan de room: zuur betekent weg.'],
    weg: ['Schimmel', 'Zure room of vulling', 'Gebak met room dat lang buiten de koelkast stond'],
    wegUitleg: 'Bij schimmel gooi je het hele stuk weg, niet alleen het plekje.',
    tip: 'Bewaar gebak in de koelkast, het liefst afgedekt. Zelf ingevroren? Schrijf de datum erop.',
    tweedeLeven: ['Droge cake: tiramisu of trifle', 'Kruimels over yoghurt of ijs'],
    bron: [BRON.bw('vruchtengebak-met-slagroom'), BRON.bw('appeltaart')],
  },

  // ---------- Diepvries ----------
  {
    id: 'pizza', naam: 'Diepvries, ijs, pizza, groente en snacks', kleur: '#e2eefb', categorie: 'diepvries', datum: 'THT',
    zoek: ['diepvries', 'diepvriespizza', 'pizza', 'diepvriesmaaltijd', 'frikandellen', 'kroketten', 'snacks', 'patat', 'friet', 'ijs', 'roomijs', 'ijsje', 'magnum', 'waterijs', 'sorbet', 'diepvriesgroente', 'diepvriesfruit', 'erwten diepvries', 'spinazie diepvries', 'bevroren fruit', 'vissticks'],
    vragen: [VRAAG_OPEN],
    situaties: [
      S({ open: 'dicht' }, 'datum', 365, 730, 'twijfel', DIEPVRIES),
      S({ open: 'open' }, 'open', 90, 180, 'twijfel', 'Een open bak of zak in de vriezer blijft ongeveer 3 maanden lekker. Daarna krijg je meer ijskristallen en vriesbrand.'),
    ],
    check: ['Is het steeds bevroren gebleven? Klonterige stukjes betekenen dat het een keer ontdooid is.', 'Witte, droge plekken (vriesbrand) en ijskristallen zijn niet gevaarlijk, wel minder lekker.', 'Bak of verwarm diepvriesmaaltijden en snacks altijd helemaal heet.'],
    weg: ['Is ontdooid geweest en weer ingevroren', 'Ranzige of vreemde geur'],
    wegUitleg: 'Ontdooid en opnieuw ingevroren? Dan liever niet.',
    tip: 'Zet je vriezer op -18 °C, sluit open zakken met een knijper en schrijf de datum op wat je zelf invriest.',
    tweedeLeven: ['Diepvriesfruit: smoothie of over de yoghurt', 'Diepvriesgroente: soep of roerbakken', 'IJs: milkshake'],
    bron: [BRON.bw('roomijs'), BRON.bw('pizza-frutti-di-mare-diepvries')],
  },

  // ---------- Voorraadkast ----------
  {
    id: 'pasta', naam: 'Pasta en rijst, ook bloem, droog uit de kast', kleur: '#fdf0cc', categorie: 'voorraad', datum: 'THT',
    zoek: ['pasta', 'spaghetti', 'macaroni', 'penne', 'fusilli', 'noedels', 'mie', 'lasagnebladen', 'rijst', 'witte rijst', 'zilvervliesrijst', 'basmati', 'risotto', 'couscous', 'bulgur', 'quinoa', 'bloem', 'meel', 'tarwebloem', 'zelfrijzend bakmeel', 'bakmix', 'pannenkoekenmix', 'maizena', 'suiker', 'havermout', 'linzen droog'],
    vragen: [],
    situaties: [S({}, 'datum', 365, 730, 'twijfel', 'Droge pasta, rijst en bloem kunnen nauwelijks bederven: tot een jaar na de datum en vaak langer, als ze droog en goed afgesloten zijn bewaard.')],
    check: DROOG_CHECK, weg: DROOG_WEG,
    wegUitleg: 'Beestjes (zoals meelmotten) in het pak? Gooi het weg en maak de kast goed schoon.',
    tip: `${DROOG_TIP} Gekookte pasta of rijst is een ander verhaal: zie Restjes.`,
    tweedeLeven: [],
    bron: [BRON.bw('pasta-onbereid'), BRON.bw('witte-rijst-onbereid'), BRON.bw('bloem')],
  },
  {
    id: 'koekjes', naam: 'Koekjes en chocolade, ook snoep', kleur: '#f8e2c4', categorie: 'voorraad', datum: 'THT',
    zoek: ['koekjes', 'koek', 'cookies', 'biscuit', 'biscuitjes', 'ontbijtkoek', 'snoep', 'drop', 'stroopwafels', 'repen', 'mueslireep', 'chocolade', 'reep', 'chocoladereep', 'pure chocolade', 'melkchocolade', 'tony', 'paaseitjes', 'bonbons', 'chocoladeletter', 'pepernoten', 'kruidnoten'],
    vragen: [],
    situaties: [S({}, 'datum', 60, 120, 'twijfel', 'Koekjes, chocolade en snoep zijn tot zo’n 2 maanden na de datum goed, en vaak langer, als ze er goed uitzien en de verpakking heel is.')],
    check: ['Een witte waas op chocolade is vet of suiker dat naar buiten komt. Niet schadelijk!', 'Ruik: muf of ranzig is niet lekker meer.', 'Zacht of uitgedroogd is geen bederf, wel minder lekker.'],
    weg: ['Schimmel', 'Muffe of ranzige geur', 'Beestjes'],
    wegUitleg: 'Muf, ranzig of beschimmeld? Weg ermee.',
    tip: 'Doe een open pak in een goed sluitende trommel. Bewaar chocolade koel en droog, maar liever niet in de koelkast. Koekjes kunnen 3 maanden de vriezer in.',
    tweedeLeven: ['Bodem voor een cheesecake', 'Kruimels door de yoghurt of over ijs', 'Chocolade smelten over fruit of in brownies'],
    bron: [BRON.bw('koekje-chocolate-chip-cookie'), BRON.bw('pure-chocolade')],
  },
  {
    id: 'mayonaise', naam: 'Sauzen, mayonaise, ketchup, mosterd', kleur: '#e4edf8', categorie: 'voorraad', datum: 'THT',
    zoek: ['mayonaise', 'mayo', 'fritessaus', 'sauzen', 'saus', 'ketchup', 'tomatenketchup', 'curry', 'knoflooksaus', 'sambal', 'mosterd', 'dressing', 'barbecuesaus', 'bbq saus', 'sweet chili', 'satesaus', 'sriracha'],
    vragen: [VRAAG_OPEN],
    situaties: [
      S({ open: 'dicht' }, 'datum', 60, 120, 'twijfel', 'Dicht zijn sauzen tot zo’n 2 maanden na de datum goed, als de verpakking heel is.'),
      S({ open: 'open' }, 'open', 60, 120, 'twijfel', 'Open blijven sauzen in de koelkast lang goed: mayonaise 2 tot 4 maanden, ketchup zelfs 9 maanden tot een jaar.'),
    ],
    check: ['Ruik en proef: ranzig, gistig of anders dan normaal betekent weg.', 'Kijk naar schimmel rond de dop en naar verkleuring.'],
    weg: ['Schimmel', 'Ranzige of gistige geur', 'Verkleurd of uit elkaar gevallen'],
    wegUitleg: 'Ranzige of beschimmelde saus gooi je weg.',
    tip: 'Zet open flessen en potten in de koelkast en veeg de dop schoon na gebruik.',
    tweedeLeven: [],
    bron: [BRON.bw('mayonaise'), BRON.bw('tomatenketchup')],
  },
  {
    id: 'sap', naam: 'Sap en frisdrank', kleur: '#fde6cf', categorie: 'voorraad', datum: 'THT',
    zoek: ['sap', 'jus', 'sinaasappelsap', 'appelsap', 'jus d orange', 'vruchtensap', 'multivruchtensap', 'smoothie', 'frisdrank', 'cola', 'fanta', 'sprite', 'ice tea', 'limonade', 'siroop', 'energiedrank', 'spa', 'water'],
    vragen: [VRAAG_OPEN],
    situaties: [
      S({ open: 'dicht' }, 'datum', 180, 365, 'twijfel', 'Een dichte fles, pak of blik uit het schap kan tot een jaar na de datum, als de verpakking heel is. Vers geperst sap uit de koeling niet: dat drink je binnen 1 tot 2 dagen.'),
      S({ open: 'open' }, 'open', 3, 7, 'twijfel', 'Open blijven sap en frisdrank 3 tot 7 dagen goed in de koelkast. Daarna kijk, ruik en proef je.'),
    ],
    check: ['Is het pak of blik niet bol, roestig of lekkend?', 'Ruik en proef: smaakt sap gistig of prikkelt het? Dan is het gaan gisten.', 'Troebel of draderig sap is niet goed.'],
    weg: ['Een bol, lekkend of roestig pak of blik', 'Schimmel, of troebel en draderig', 'Smaakt gistig of prikkelt (sap)'],
    wegUitleg: 'Gistig of prikkelend sap is gaan gisten. Weg ermee.',
    tip: 'Bewaar flessen sap donker, anders verdwijnt de vitamine C sneller. Zet open flessen goed dicht in de koelkast.',
    tweedeLeven: ['Smoothie', 'IJslolly’s'],
    bron: [BRON.bw('sinaasappelsap'), BRON.bw('cola')],
  },
  {
    id: 'wijn', naam: 'Wijn en bier', kleur: '#f3dce4', categorie: 'voorraad', datum: 'THT',
    zoek: ['wijn', 'rode wijn', 'witte wijn', 'rosé', 'rose', 'prosecco', 'bubbels', 'bier', 'pils', 'speciaalbier', 'blikje bier', 'alcohol', 'cider'],
    vragen: [
      { id: 'soort', label: 'Wat is het?', opties: [{ id: 'wijn', label: 'Wijn' }, { id: 'bier', label: 'Bier' }] },
      VRAAG_OPEN,
    ],
    situaties: [
      S({ soort: 'bier', open: 'open' }, 'open', 1, 2, 'twijfel', 'Open bier is maar een dag lekker. Met de dop erop kun je het de volgende dag nog drinken.'),
      S({ open: 'open' }, 'open', 3, 5, 'twijfel', 'Een open fles wijn blijft ongeveer 3 dagen goed in de koelkast. Daarna wordt hij zuur, maar niet gevaarlijk.'),
      S({}, 'datum', 365, 730, 'twijfel', 'Dicht is wijn vrijwel onbeperkt houdbaar en hoeft er zelfs geen datum op te staan. Bier is dicht vaak nog lang na de datum goed, al wordt de smaak minder.'),
    ],
    check: ['Ruik en proef: smaakt het zuur, muf of naar azijn? Dan is de kwaliteit eraf.', 'Bier zonder prik is niet gevaarlijk, alleen minder lekker.'],
    weg: ['Schimmel in de fles of rond de kurk', 'Een bol of lekkend blik'],
    wegUitleg: 'Zure wijn is niet gevaarlijk, wel vies. Schimmel of een bol blik betekent weg.',
    tip: 'Doe de kurk of dop terug en zet een open fles in de koelkast, ook rode wijn.',
    tweedeLeven: ['Wijn: in een saus, risotto of stoofpot', 'Bier: in pannenkoekenbeslag of een stoofpot'],
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
  los: { kort: 'Geen datum', uitleg: 'Los gekocht: je telt vanaf de dag dat je het kocht.' },
  THT: { kort: 'Ten minste houdbaar tot', uitleg: 'Een kwaliteitsdatum. Na de datum vaak nog prima: kijk, ruik en proef.' },
  TGT: { kort: 'Te gebruiken tot', uitleg: 'Een veiligheidsdatum. Na de datum niet meer eten, ook als het er goed uitziet.' },
  kies: { kort: 'THT of TGT', uitleg: 'Dit verschilt per merk. Kijk op de verpakking welke datum erop staat.' },
  zelf: { kort: 'Geen datum', uitleg: 'Zelf gekookt: je telt vanaf de dag dat je het maakte.' },
};

// Het stickertje op de kaart en de productpagina.
const sticker = p => ({
  THT: '<span class="sticker tht">THT</span>',
  TGT: '<span class="sticker tgt">TGT</span>',
  kies: '<span class="sticker kies">THT/TGT</span>',
  zelf: '<span class="sticker zelf">Restje</span>',
  los: '<span class="sticker los">Los</span>',
})[p.datum];

const productById = id => PRODUCTEN.find(p => p.id === (ALIAS[id] || id));
