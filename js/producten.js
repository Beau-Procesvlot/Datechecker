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
};

const CATEGORIEEN = [
  { id: 'brood', label: 'Brood', kort: 'Brood', kleur: '#fdecc8' },
  { id: 'zuivel', label: 'Zuivel en eieren', kort: 'Zuivel', kleur: '#dfeafb' },
  { id: 'kaas', label: 'Kaas', kort: 'Kaas', kleur: '#fff2b8' },
  { id: 'vlees', label: 'Vlees, vis en kip', kort: 'Vlees en vis', kleur: '#fde0da' },
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

const DATUM_UITLEG = {
  THT: { kort: 'Ten minste houdbaar tot', uitleg: 'Een kwaliteitsdatum. Na de datum vaak nog prima: kijk, ruik en proef.' },
  TGT: { kort: 'Te gebruiken tot', uitleg: 'Een veiligheidsdatum. Na de datum niet meer eten, ook als het er goed uitziet.' },
};

const productById = id => PRODUCTEN.find(p => p.id === id);
