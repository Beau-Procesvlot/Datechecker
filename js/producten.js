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
};

const CATEGORIEEN = [
  { id: 'brood', label: 'Brood', kort: 'Brood', kleur: '#fdecc8' },
  { id: 'zuivel', label: 'Zuivel en eieren', kort: 'Zuivel', kleur: '#dfeafb' },
  { id: 'kaas', label: 'Kaas', kort: 'Kaas', kleur: '#fff2b8' },
  { id: 'vlees', label: 'Vlees, vis en vega', kort: 'Vlees en vis', kleur: '#fde0da' },
  { id: 'groente', label: 'Groente en kant-en-klaar', kort: 'Kant-en-klaar', kleur: '#e3f1df' },
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
    id: 'kipfilet',
    naam: 'Kipfilet, rauw',
    kleur: '#fde0da',
    zoek: ['kip', 'kipfilet', 'kippenvlees', 'kipreepjes', 'kippendijen', 'kipblokjes', 'gevogelte'],
    categorie: 'vlees',
    datum: 'TGT',
    vragen: [
      { id: 'plek', label: 'Waar heb je het bewaard?', opties: [{ id: 'koelkast', label: 'In de koelkast' }, { id: 'vriezer', label: 'Ingevroren vóór de datum' }] },
    ],
    situaties: [
      { als: { plek: 'vriezer' }, tijd: 'vriezer', match: 90, twijfel: 180, daarna: 'twijfel',
        houdbaar: 'Ingevroren vóór de datum blijft kip zo’n 3 maanden lekker. Daarna niet gevaarlijk, wel kans op een droge, ranzige smaak.' },
      { als: { plek: 'koelkast' }, tijd: 'datum', match: 0, twijfel: 0, daarna: 'ghost',
        houdbaar: 'Rauwe kip eet je uiterlijk op de datum zelf. Al open? Dan binnen 2 dagen, en nooit na de datum.' },
    ],
    check: [
      'Ruik direct na het openen. Een zure of rotte lucht betekent weg.',
      'Kijk naar de kleur: grauw of groenig is niet goed.',
      'Voel: plakkerig of slijmerig vlees eet je niet.',
      'Bak kip altijd helemaal gaar: vanbinnen wit, zonder roze.',
    ],
    weg: ['Een zure of rotte geur', 'Grauw of groenig verkleurd', 'Plakkerig of slijmerig'],
    wegUitleg: 'Bij kip kun je niet alles zien of ruiken. Twijfel je? Dan niet doen.',
    tip: 'Haal je het niet vóór de datum? Vries het op tijd in. Ontdooi het in de koelkast (niet op het aanrecht) en bak het daarna binnen een dag.',
    tweedeLeven: [],
    bron: [BRON.bw('kipfilet-onbereid'), BRON.vb],
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
    id: 'melk', naam: 'Melk, vers', kleur: '#dfeafb', categorie: 'zuivel', datum: 'THT',
    zoek: ['melk', 'halfvolle melk', 'volle melk', 'magere melk', 'karnemelk', 'verse melk', 'koemelk'],
    vragen: [VRAAG_OPEN],
    situaties: [
      S({ open: 'dicht' }, 'datum', 1, 5, 'ghost', 'Gooi melk niet meteen weg na de datum: kijk, ruik en proef een slokje.', GEEN),
      S({ open: 'open' }, 'open', 7, 10, 'ghost', 'Open blijft melk ongeveer een week goed in de koelkast. Daarna kijk, ruik en proef je.'),
    ],
    check: ['Ruik aan het pak: zuur is niet goed.', 'Schenk een beetje in een glas: klontjes of vlokken betekent weg.', 'Proef een slokje: smaakt het gewoon? Dan zit je goed.'],
    weg: ['Zure geur of smaak', 'Klontjes of vlokken'],
    wegUitleg: 'Zure melk drink je niet meer. Maar zuur is niet giftig: twijfel je alleen een beetje, gebruik het dan in beslag.',
    tip: 'Zet melk na het inschenken meteen terug in de koelkast, niet in de deur maar op een koude plank.',
    tweedeLeven: ['Pannenkoeken of wentelteefjes', 'Havermout of rijstepap', 'Een witte saus'],
    bron: [BRON.bw('melk-halfvol'), BRON.vb],
  },
  {
    id: 'melk-houdbaar', naam: 'Melk, lang houdbaar', kleur: '#fde0da', categorie: 'zuivel', datum: 'THT',
    zoek: ['houdbare melk', 'lang houdbare melk', 'uht melk', 'koffiemelk', 'melk houdbaar'],
    vragen: [VRAAG_OPEN],
    situaties: [
      S({ open: 'dicht' }, 'datum', 60, 365, 'twijfel', 'Lang houdbare melk die nog dicht is, kan vaak nog maanden na de datum. Kijk, ruik en proef.'),
      S({ open: 'open' }, 'open', 7, 10, 'ghost', 'Eenmaal open is het gewone melk: zet hem in de koelkast en drink hem binnen een week op.'),
    ],
    check: ['Is het pak niet bol of beschadigd?', 'Ruik en proef een beetje: zuur of klontjes betekent weg.'],
    weg: ['Een bol of lekkend pak', 'Zure geur of smaak', 'Klontjes of vlokken'],
    wegUitleg: 'Een bol pak betekent dat er iets in groeit. Niet openen en weggooien.',
    tip: 'Dicht hoeft hij niet in de koelkast. Na het openen wel, net als gewone melk.',
    tweedeLeven: ['Pannenkoeken', 'Pudding of vla', 'Havermout'],
    bron: [BRON.bw('lang-houdbare-melk'), BRON.vb],
  },
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
    id: 'slagroom', naam: 'Slagroom en kookroom', kleur: '#fdf0cc', categorie: 'zuivel', datum: 'THT',
    zoek: ['slagroom', 'room', 'kookroom', 'zure room', 'roomboter', 'opklopbare room', 'cooking cream'],
    vragen: [VRAAG_OPEN],
    situaties: [
      S({ open: 'dicht' }, 'datum', 1, 3, 'ghost', 'Gooi room niet meteen weg na de datum: kijk, ruik en proef een beetje.', GEEN),
      S({ open: 'open' }, 'open', 4, 6, 'ghost', 'Open blijft room 4 tot 6 dagen goed in de koelkast.'),
    ],
    check: ZUIVEL_CHECK,
    weg: ['Brokken of waterig', 'Zure geur', 'Schimmel'],
    wegUitleg: 'Zure of brokkelige room niet meer gebruiken.',
    tip: 'Room kun je invriezen, maar de structuur verandert. Gebruik hem daarna in saus of soep, niet om te kloppen.',
    tweedeLeven: ['Pastasaus of soep', 'Romige ovenschotel'],
    bron: [BRON.bw('slagroom-ongeklopt'), BRON.vb],
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
  {
    id: 'creme-fraiche', naam: 'Crème fraîche en zure room', kleur: '#e3f1df', categorie: 'zuivel', datum: 'THT',
    zoek: ['creme fraiche', 'crème fraîche', 'zure room', 'smetana', 'sour cream'],
    vragen: [VRAAG_OPEN],
    situaties: [
      S({ open: 'dicht' }, 'datum', 3, 7, 'ghost', 'Crème fraîche is na de datum vaak nog enkele dagen goed. Kijk, ruik en proef.'),
      S({ open: 'open' }, 'open', 5, 7, 'ghost', 'Open blijft het 5 tot 7 dagen goed in de koelkast.'),
    ],
    check: ZUIVEL_CHECK,
    weg: ['Brokken of uitgedroogd', 'Zure geur', 'Schimmel'],
    wegUitleg: 'Schimmel in een bakje? Dan het hele bakje weg, niet alleen de bovenkant.',
    tip: 'Schep het met een schone lepel. Invriezen kan tot 3 maanden; gebruik het daarna in saus of soep.',
    tweedeLeven: ['Door de soep of pastasaus', 'Dipsaus met kruiden'],
    bron: [BRON.bw('creme-fraiche-halfvol'), BRON.cb],
  },
  {
    id: 'haverdrink', naam: 'Haverdrink en plantaardige drinks', kleur: '#f1e6d2', categorie: 'zuivel', datum: 'THT',
    zoek: ['haverdrink', 'havermelk', 'oatly', 'sojamelk', 'sojadrink', 'amandelmelk', 'amandeldrink', 'plantaardige melk', 'rijstdrink'],
    vragen: [VRAAG_OPEN],
    situaties: [
      S({ open: 'dicht' }, 'datum', 60, 365, 'twijfel', 'Dichte pakken uit het schap (niet gekoeld) zijn lang houdbaar en vaak nog maanden na de datum goed.'),
      S({ open: 'open' }, 'open', 5, 7, 'ghost', 'Open blijft het 5 tot 7 dagen goed in de koelkast.'),
    ],
    check: ['Is het pak niet bol?', 'Ruik en proef een beetje: zuur of bitter betekent weg.', 'Schud even: brokken die niet verdwijnen zijn niet goed.'],
    weg: ['Een bol pak', 'Brokken of waterig', 'Zure geur of bittere smaak'],
    wegUitleg: 'Zuur, bitter of brokkelig? Dan drink je het niet meer.',
    tip: 'Na het openen altijd in de koelkast. Invriezen kan, maar de structuur verandert: gebruik het dan in een smoothie of gerecht.',
    tweedeLeven: ['Smoothie', 'Havermout of pannenkoeken'],
    bron: [BRON.bw('haverdrink'), BRON.vb],
  },

  // ======================= KAAS =======================
  {
    id: 'brie', naam: 'Brie en camembert', kleur: '#f6f0de', categorie: 'kaas', datum: 'THT',
    zoek: ['brie', 'camembert', 'zachte kaas', 'schimmelkaas', 'witschimmelkaas', 'gorgonzola', 'blauwe kaas'],
    vragen: [VRAAG_OPEN],
    situaties: [
      S({ open: 'dicht' }, 'datum', 0, 0, 'ghost', 'Zachte kaas eet je uiterlijk op de datum.', { ghostTekst: 'Zachte (schimmel)kazen zijn gevoelig voor ziekmakende bacteriën. Houd je bij deze kaas aan de datum.' }),
      S({ open: 'open' }, 'open', 4, 4, 'ghost', 'Open blijft zachte kaas ongeveer 4 dagen goed in de koelkast.'),
    ],
    check: ['De witte korst hoort erbij. Andere kleuren schimmel niet.', 'Ruik: een scherpe ammoniaklucht betekent dat hij over is.'],
    weg: ['Gekleurde schimmel die er niet hoort', 'Een scherpe ammoniaklucht', 'Uitgedroogd of verkleurd'],
    wegUitleg: 'Bij zachte kaas snijd je schimmel niet weg: dan gaat de hele kaas weg.',
    tip: 'Bewaar hem in een afsluitbaar bakje of de eigen verpakking in de koelkast. Zwanger? Kies dan kaas van gepasteuriseerde melk.',
    tweedeLeven: ['Uit de oven met honing', 'Op een tosti'],
    bron: [BRON.bw('brie-60-plus')],
  },
  {
    id: 'mozzarella', naam: 'Mozzarella en verse kaas', kleur: '#e9f2fb', categorie: 'kaas', datum: 'THT',
    zoek: ['mozzarella', 'burrata', 'buffelmozzarella', 'verse kaas', 'feta', 'ricotta', 'mascarpone', 'cottage cheese'],
    vragen: [VRAAG_OPEN],
    situaties: [
      S({ open: 'dicht' }, 'datum', 0, 0, 'ghost', 'Verse kaas eet je uiterlijk op de datum.', { ghostTekst: 'Verse en zachte kazen zijn gevoelig voor ziekmakende bacteriën. Houd je bij deze kaas aan de datum.' }),
      S({ open: 'open' }, 'open', 4, 4, 'ghost', 'Open blijft mozzarella ongeveer 4 dagen goed, in het eigen vocht in de koelkast.'),
    ],
    check: ['Ruik: zuur of vreemd betekent weg.', 'Is het vocht helder? Troebel of slijmerig is niet goed.'],
    weg: ['Zure of vreemde geur', 'Slijmerig of troebel vocht', 'Schimmel'],
    wegUitleg: 'Verse kaas die zuur ruikt, eet je niet meer.',
    tip: 'Bewaar mozzarella in het eigen vocht, met het bakje afgedekt in de koelkast. Invriezen is minder geschikt.',
    tweedeLeven: ['Op een pizza of in een ovenschotel'],
    bron: [BRON.bw('mozzarella'), BRON.bw('brie-60-plus')],
  },
  {
    id: 'roomkaas', naam: 'Roomkaas en smeerkaas', kleur: '#eef1f5', categorie: 'kaas', datum: 'THT',
    zoek: ['roomkaas', 'philadelphia', 'smeerkaas', 'kruidenkaas', 'boursin', 'zuivelspread', 'cream cheese'],
    vragen: [VRAAG_OPEN],
    situaties: [
      S({ open: 'dicht' }, 'datum', 0, 3, 'ghost', 'Roomkaas is een verse, zachte kaas: na de datum alleen nog kort, en kijk, ruik en proef goed.', GEEN),
      S({ open: 'open' }, 'open', 4, 4, 'ghost', 'Open blijft roomkaas ongeveer 4 dagen goed in de koelkast.'),
    ],
    check: ZUIVEL_CHECK,
    weg: ['Schimmel', 'Zure of vreemde geur', 'Uitgedroogd of verkleurd'],
    wegUitleg: 'Schimmel in een kuipje? Dan het hele kuipje weg.',
    tip: 'Gebruik een schoon mes om wat uit het kuipje te scheppen. Invriezen kan tot een maand.',
    tweedeLeven: ['Door een pastasaus', 'Cheesecake of frosting'],
    bron: [BRON.bw('roomkaas-60-plus')],
  },

  // ======================= VLEES, VIS EN VEGA =======================
  {
    id: 'gehakt', naam: 'Gehakt, rauw', kleur: '#fde0da', categorie: 'vlees', datum: 'TGT',
    zoek: ['gehakt', 'rundergehakt', 'half om half', 'varkensgehakt', 'kipgehakt', 'hamburger', 'burgers', 'gehaktballen', 'slavink'],
    vragen: [VRAAG_PLEK_TGT],
    situaties: [VRIES_VLEES, S({ plek: 'koel' }, 'datum', 0, 0, 'ghost', 'Gehakt eet je uiterlijk op de datum. Al open? Dan nog dezelfde of de volgende dag.')],
    check: [...VLEES_CHECK, 'Bak gehakt helemaal gaar: vanbinnen niet meer roze.'],
    weg: VLEES_WEG, wegUitleg: VLEES_UITLEG,
    tip: 'Haal je de datum niet? Vries het op tijd in. Ontdooi in de koelkast en bak het daarna binnen een dag.',
    tweedeLeven: [],
    bron: [BRON.bw('rundergehakt-onbereid'), BRON.vb],
  },
  {
    id: 'vleeswaren', naam: 'Vleeswaren', kleur: '#fce4e8', categorie: 'vlees', datum: 'TGT',
    zoek: ['vleeswaren', 'ham', 'beenham', 'kipfilet beleg', 'rosbief', 'gebraden gehakt', 'boterhamworst', 'leverworst', 'kalkoenfilet', 'beleg'],
    vragen: [VRAAG_PLEK_TGT, { ...VRAAG_OPEN, alleenAls: { plek: 'koel' } }],
    situaties: [
      VRIES_VLEES,
      S({ plek: 'koel', open: 'open' }, 'open', 3, 5, 'ghost', 'Open blijven vleeswaren 3 tot 5 dagen goed, en nooit na de datum. Zwanger, of eet je voor ouderen of kleine kinderen? Dan maximaal 2 dagen.'),
      S({ plek: 'koel' }, 'datum', 0, 0, 'ghost', 'Vleeswaren eet je uiterlijk op de datum.'),
    ],
    check: VLEES_CHECK,
    weg: VLEES_WEG, wegUitleg: 'Vleeswaren zijn gevoelig voor listeria. Die zie, ruik en proef je niet.',
    tip: 'Bewaar vleeswaren op de koudste plek in de koelkast (vaak de onderste plank), in een afsluitbaar bakje.',
    tweedeLeven: ['In een omelet of quiche', 'Op een tosti of pizza (wel binnen de datum)'],
    bron: [BRON.bw('kipfilet-vleeswaar'), BRON.bw('beenham')],
  },
  {
    id: 'salami', naam: 'Salami en droge worst', kleur: '#fbdcd6', categorie: 'vlees', datum: 'TGT',
    zoek: ['salami', 'chorizo', 'droge worst', 'cervelaat', 'snijworst', 'pepperoni', 'fuet'],
    vragen: [VRAAG_PLEK_TGT, { ...VRAAG_OPEN, alleenAls: { plek: 'koel' } }],
    situaties: [
      VRIES_VLEES,
      S({ plek: 'koel', open: 'open' }, 'open', 5, 7, 'ghost', 'Open blijft salami 5 tot 7 dagen goed, en nooit na de datum. Zwanger, of eet je voor ouderen of kleine kinderen? Dan maximaal 2 dagen.'),
      S({ plek: 'koel' }, 'datum', 0, 0, 'ghost', 'Salami eet je uiterlijk op de datum.'),
    ],
    check: VLEES_CHECK,
    weg: VLEES_WEG, wegUitleg: 'Vleeswaren zijn gevoelig voor listeria. Die zie, ruik en proef je niet.',
    tip: 'Bewaar het op de koudste plek in de koelkast, in een afsluitbaar bakje of de eigen verpakking.',
    tweedeLeven: ['Op een pizza of in een pastasaus (wel binnen de datum)'],
    bron: [BRON.bw('salami')],
  },
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
    tweedeLeven: ['Door de stamppot of erwtensoep', 'In plakjes in een pastasaus'],
    bron: [BRON.bw('rookworst-ambachtelijk-gekookt'), BRON.vc],
  },
  {
    id: 'zalm', naam: 'Vis, vers (zoals zalm)', kleur: '#fde3d3', categorie: 'vlees', datum: 'TGT',
    zoek: ['vis', 'zalm', 'verse vis', 'kabeljauw', 'pangasius', 'tilapia', 'visfilet', 'garnalen', 'tonijn vers'],
    vragen: [VRAAG_PLEK_TGT],
    situaties: [VRIES_VLEES, S({ plek: 'koel' }, 'datum', 0, 0, 'ghost', 'Verse vis eet je het liefst dezelfde dag, en uiterlijk op de datum. Open? Binnen 2 dagen.')],
    check: ['Ruik: verse vis ruikt fris, naar zee. Een sterke vislucht of zure geur betekent weg.', 'Kijk: glanzend en stevig is goed, dof en slap niet.', 'Bak of kook vis goed gaar.'],
    weg: ['Een sterke vislucht of zure geur', 'Dof, grauw of slijmerig'],
    wegUitleg: VLEES_UITLEG,
    tip: 'Bewaar verse vis zo koud mogelijk, onderin de koelkast. Of vries hem in op de dag van aankoop.',
    tweedeLeven: [],
    bron: [BRON.bw('zalm-rauw')],
  },
  {
    id: 'gerookte-zalm', naam: 'Gerookte zalm', kleur: '#fde8dc', categorie: 'vlees', datum: 'TGT',
    zoek: ['gerookte zalm', 'zalm gerookt', 'gerookte vis', 'gerookte makreel', 'paling', 'forel gerookt'],
    vragen: [VRAAG_PLEK_TGT],
    situaties: [VRIES_VLEES, S({ plek: 'koel' }, 'datum', 0, 0, 'ghost', 'Gerookte zalm eet je uiterlijk op de datum. Open? Binnen 2 dagen.')],
    check: VLEES_CHECK,
    weg: VLEES_WEG, wegUitleg: 'Gerookte vis is gevoelig voor listeria. Die zie, ruik en proef je niet.',
    tip: 'Bewaar hem op de koudste plek in de koelkast. Zwanger? Eet gerookte vis dan liever niet koud, maar verwarmd in een gerecht.',
    tweedeLeven: [],
    bron: [BRON.bw('zalm-gerookt')],
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
    id: 'sla', naam: 'Sla en voorgesneden groente', kleur: '#e3f1df', categorie: 'groente', datum: 'TGT',
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
    id: 'sap', naam: 'Sap', kleur: '#fde6cf', categorie: 'voorraad', datum: 'THT',
    zoek: ['sap', 'jus', 'sinaasappelsap', 'appelsap', 'jus d orange', 'vruchtensap', 'multivruchtensap', 'smoothie'],
    vragen: [VRAAG_OPEN],
    situaties: [
      S({ open: 'dicht' }, 'datum', 180, 365, 'twijfel', 'Een dicht pak sap uit het schap kan tot een jaar na de datum, als de verpakking heel is. Vers geperst sap uit de koeling niet: dat drink je binnen 1 tot 2 dagen.'),
      S({ open: 'open' }, 'open', 3, 7, 'ghost', 'Open blijft sap 3 tot 7 dagen goed in de koelkast.'),
    ],
    check: ['Is het pak niet bol?', 'Ruik en proef: smaakt het anders of prikkelt het? Dan niet meer drinken.', 'Troebel of draderig sap is niet goed.'],
    weg: ['Een bol pak', 'Schimmel, of troebel en draderig', 'Smaakt gistig of prikkelt'],
    wegUitleg: 'Gistig of prikkelend sap is gaan gisten. Weg ermee.',
    tip: 'Flessen sap bewaar je het liefst donker, anders verdwijnt de vitamine C sneller.',
    tweedeLeven: ['Smoothie', 'Ijslolly’s'],
    bron: [BRON.bw('sinaasappelsap')],
  },
  {
    id: 'pasta', naam: 'Pasta, droog', kleur: '#fdf0cc', categorie: 'voorraad', datum: 'THT',
    zoek: ['pasta', 'spaghetti', 'macaroni', 'penne', 'fusilli', 'noedels', 'mie', 'lasagnebladen'],
    vragen: [],
    situaties: [S({}, 'datum', 365, 730, 'twijfel', 'Droge pasta kan nauwelijks bederven: tot een jaar na de datum en vaak langer, als het droog en goed afgesloten is bewaard.')],
    check: DROOG_CHECK, weg: DROOG_WEG,
    wegUitleg: 'Beestjes in het pak? Gooi het weg en maak de kast goed schoon.',
    tip: DROOG_TIP,
    tweedeLeven: [],
    bron: [BRON.bw('pasta-onbereid')],
  },
  {
    id: 'rijst', naam: 'Rijst, droog', kleur: '#eef2f6', categorie: 'voorraad', datum: 'THT',
    zoek: ['rijst', 'witte rijst', 'zilvervliesrijst', 'basmati', 'risotto', 'couscous', 'bulgur', 'quinoa'],
    vragen: [],
    situaties: [S({}, 'datum', 365, 730, 'twijfel', 'Droge rijst kan nauwelijks bederven: tot een jaar na de datum en vaak langer, als het droog en goed afgesloten is bewaard.')],
    check: DROOG_CHECK, weg: DROOG_WEG,
    wegUitleg: 'Beestjes in het pak? Gooi het weg en maak de kast goed schoon.',
    tip: `${DROOG_TIP} Gekookte rijst is een ander verhaal: zie Restjes.`,
    tweedeLeven: [],
    bron: [BRON.bw('witte-rijst-onbereid')],
  },
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
    id: 'koekjes', naam: 'Koekjes en snoep', kleur: '#f8e2c4', categorie: 'voorraad', datum: 'THT',
    zoek: ['koekjes', 'koek', 'cookies', 'biscuit', 'biscuitjes', 'ontbijtkoek', 'snoep', 'drop', 'stroopwafels', 'repen'],
    vragen: [],
    situaties: [S({}, 'datum', 60, 120, 'twijfel', 'Koekjes zijn tot zo’n 2 maanden na de datum goed, als ze er goed uitzien en de verpakking heel is.')],
    check: ['Ruik: muf of ranzig is niet lekker meer.', 'Zacht of uitgedroogd is geen bederf, wel minder lekker.'],
    weg: ['Schimmel', 'Muffe of ranzige geur'],
    wegUitleg: 'Muf of ranzig? Weg ermee.',
    tip: 'Doe een open pak in een goed sluitende trommel. Koekjes kunnen ook 3 maanden de vriezer in.',
    tweedeLeven: ['Bodem voor een cheesecake', 'Kruimels door de yoghurt of over ijs'],
    bron: [BRON.bw('koekje-chocolate-chip-cookie')],
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
    id: 'pastasaus', naam: 'Pastasaus in pot', kleur: '#fbdcd6', categorie: 'voorraad', datum: 'THT',
    zoek: ['pastasaus', 'tomatensaus', 'pesto', 'curry saus', 'wokasaus', 'saus in pot', 'passata', 'tomatenpuree'],
    vragen: [VRAAG_OPEN],
    situaties: [
      S({ open: 'dicht' }, 'datum', 60, 120, 'twijfel', 'Een dichte pot is tot zo’n 2 maanden na de datum goed, als de pot heel is en het deksel niet bol staat.'),
      S({ open: 'open' }, 'open', 3, 5, 'ghost', 'Open blijft pastasaus ongeveer 3 dagen goed in de koelkast. Invriezen kan tot 3 maanden.'),
    ],
    check: ['Klikt het deksel bij het openen? Dan was de pot goed dicht.', 'Kijk of er schimmel op zit, ook onder het deksel.', 'Ruik: zuur of gistig is niet goed.'],
    weg: ['Een bol deksel of een pot die niet klikt', 'Schimmel', 'Zure of gistige geur'],
    wegUitleg: 'Schimmel in een pot saus? Dan de hele pot weg.',
    tip: 'Over van een pot? Vries de rest in een bakje in. Zo heb je later een snelle maaltijd.',
    tweedeLeven: ['Shakshuka', 'Basis voor soep of een ovenschotel'],
    bron: [BRON.bw('pastasaus-zonder-vlees')],
  },
  {
    id: 'mayonaise', naam: 'Mayonaise en sauzen', kleur: '#e4edf8', categorie: 'voorraad', datum: 'THT',
    zoek: ['mayonaise', 'mayo', 'fritessaus', 'sauzen', 'saus', 'curry', 'knoflooksaus', 'sambal', 'mosterd', 'dressing'],
    vragen: [VRAAG_OPEN],
    situaties: [
      S({ open: 'dicht' }, 'datum', 60, 120, 'twijfel', 'Dicht is mayonaise tot zo’n 2 maanden na de datum goed, als de verpakking heel is.'),
      S({ open: 'open' }, 'open', 60, 120, 'twijfel', 'Open blijft mayonaise 2 tot 4 maanden goed in de koelkast.'),
    ],
    check: ['Ruik en proef: ranzig of anders dan normaal betekent weg.', 'Kijk naar de kleur: verkleurd of uit elkaar gevallen is niet goed.'],
    weg: ['Ranzige geur of smaak', 'Verkleurd', 'Schimmel'],
    wegUitleg: 'Ranzige mayonaise eet je niet meer.',
    tip: 'Zet een open fles of pot mayonaise in de koelkast.',
    tweedeLeven: [],
    bron: [BRON.bw('mayonaise')],
  },
  {
    id: 'ketchup', naam: 'Ketchup', kleur: '#fbd9d4', categorie: 'voorraad', datum: 'THT',
    zoek: ['ketchup', 'tomatenketchup', 'curry ketchup', 'barbecuesaus', 'bbq saus', 'sweet chili'],
    vragen: [VRAAG_OPEN],
    situaties: [
      S({ open: 'dicht' }, 'datum', 60, 120, 'twijfel', 'Dicht is ketchup tot zo’n 2 maanden na de datum goed, als de fles heel is.'),
      S({ open: 'open' }, 'open', 270, 365, 'twijfel', 'Open blijft ketchup 9 maanden tot een jaar goed in de koelkast.'),
    ],
    check: ['Ruik en proef: anders dan normaal betekent weg.', 'Kijk naar schimmel rond de dop.'],
    weg: ['Schimmel', 'Gistige of ranzige geur', 'Verkleurd'],
    wegUitleg: 'Schimmel of een gistige lucht? Weg ermee.',
    tip: 'Veeg de dop schoon na gebruik en zet de fles na het openen in de koelkast.',
    tweedeLeven: [],
    bron: [BRON.bw('tomatenketchup')],
  },
  {
    id: 'chocolade', naam: 'Chocolade', kleur: '#efdccd', categorie: 'voorraad', datum: 'THT',
    zoek: ['chocolade', 'reep', 'chocoladereep', 'pure chocolade', 'melkchocolade', 'tony', 'paaseitjes', 'bonbons'],
    vragen: [],
    situaties: [S({}, 'datum', 60, 120, 'twijfel', 'Chocolade is tot zo’n 2 maanden na de datum goed, en vaak langer, als hij er goed uitziet.')],
    check: ['Een witte waas op chocolade is vet of suiker dat naar buiten komt. Niet schadelijk!', 'Ruik: muf betekent dat hij over is.'],
    weg: ['Muffe geur', 'Beestjes'],
    wegUitleg: 'Muffe chocolade is niet lekker meer.',
    tip: 'Bewaar chocolade koel en droog, maar liever niet in de koelkast.',
    tweedeLeven: ['Smelten over fruit', 'Brownies of chocoladesaus'],
    bron: [BRON.bw('pure-chocolade')],
  },
  {
    id: 'bonen-blik', naam: 'Blik en pot (groente, bonen)', kleur: '#e3f1df', categorie: 'voorraad', datum: 'THT',
    zoek: ['blik', 'conserven', 'bonen', 'kidneybonen', 'bruine bonen', 'kikkererwten', 'mais', 'doperwten', 'tomatenblokjes', 'groente in pot', 'tonijn in blik', 'soep in blik'],
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

const DATUM_UITLEG = {
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
})[p.datum];

const productById = id => PRODUCTEN.find(p => p.id === id);
