// De productlijst. Eén blok per productgroep, in eigen woorden, gebaseerd op de bronnen onderaan elk product.
//
// Hoe het oordeel werkt:
// - vragen: korte vragen op de productpagina (geopend? waar ligt het?). Het antwoord kiest een situatie.
// - situaties: de eerste situatie waarvan alle voorwaarden ('als') kloppen, telt.
//     tijd:    welke knoppen je krijgt (zie TIJD hieronder): dagen over de datum, dagen open, of tijd in de vriezer.
//     match:   tot en met zoveel dagen → "It's a match!"
//     twijfel: tot en met zoveel dagen → "Eerst goed bekijken."
//     daarna:  wat erna komt: 'twijfel' (THT: nog steeds je zintuigen laten beslissen) of 'ghost' (niet meer eten).
//     houdbaar: één zin met de vuistregel voor deze situatie.
// - weg: tekenen van bederf. Tik je er één aan, dan is het altijd "Ghosten", wat de datum ook zegt.
// - We zeggen nooit "veilig": het blijft een inschatting, de gebruiker beslist.

const TIJD = {
  datum: {
    vraag: 'Hoe lang is het over de datum?',
    opties: [
      { label: 'Nog niet', dagen: 0 },
      { label: '1–3 dagen', dagen: 3 },
      { label: '4–7 dagen', dagen: 7 },
      { label: '1–2 weken', dagen: 14 },
      { label: '2–4 weken', dagen: 28 },
      { label: '1–2 maanden', dagen: 60 },
      { label: 'Langer', dagen: 999 },
    ],
  },
  open: {
    vraag: 'Hoe lang is het al open?',
    opties: [
      { label: 'Vandaag', dagen: 0 },
      { label: '1–2 dagen', dagen: 2 },
      { label: '3–4 dagen', dagen: 4 },
      { label: '5–7 dagen', dagen: 7 },
      { label: '1–2 weken', dagen: 14 },
      { label: 'Langer', dagen: 999 },
    ],
  },
  vriezer: {
    vraag: 'Hoe lang ligt het al in de vriezer?',
    opties: [
      { label: 'Korter dan een maand', dagen: 30 },
      { label: '1–3 maanden', dagen: 90 },
      { label: '3–6 maanden', dagen: 180 },
      { label: 'Langer', dagen: 999 },
    ],
  },
};

const CATEGORIEEN = [
  { id: 'brood', label: 'Brood en bakkerij' },
  { id: 'zuivel', label: 'Zuivel en eieren' },
  { id: 'kaas', label: 'Kaas' },
  { id: 'vlees', label: 'Vlees, vis en kip' },
];

const VRAAG_OPEN = { id: 'open', label: 'Is het al open?', opties: [{ id: 'dicht', label: 'Nog dicht' }, { id: 'open', label: 'Al open' }] };

const PRODUCTEN = [
  {
    id: 'afbakbroodjes',
    naam: 'Afbakbroodjes',
    zoek: ['afbak', 'afbakbrood', 'pistolets', 'bake off', 'stokbrood afbak', 'petit pain', 'broodjes'],
    categorie: 'brood',
    datum: 'THT',
    vragen: [VRAAG_OPEN],
    situaties: [
      { als: { open: 'dicht' }, tijd: 'datum', match: 7, twijfel: 21, daarna: 'twijfel',
        houdbaar: 'Dicht en zonder schimmel zijn ze meestal nog een week of langer na de datum prima. Daarna worden ze vooral droog en taai.' },
      { als: { open: 'open' }, tijd: 'open', match: 2, twijfel: 4, daarna: 'twijfel',
        houdbaar: 'Open blijven ze een paar dagen goed, het liefst in de koelkast. Wil je ze bewaren, vries ze dan in.' },
    ],
    check: [
      'Kijk het hele zakje rond, ook de onderkant en tussen de broodjes: zie je groene, witte of zwarte pluisjes?',
      'Ruik even: muf of zuur is een slecht teken.',
      'Na het afbakken: smaakt het gewoon naar brood? Dan zit je goed.',
    ],
    weg: ['Schimmel, ook maar op één broodje', 'Een muffe of zure geur'],
    wegUitleg: 'Bij schimmel op brood gooi je het hele zakje weg. Schimmel groeit verder dan je kunt zien.',
    tip: 'Ga je ze niet snel gebruiken? Vries ze in. Je kunt ze zo uit de vriezer afbakken, een paar minuten langer dan normaal.',
    tweedeLeven: ['Croutons voor soep of salade', 'Wentelteefjes', 'Paneermeel uit de keukenmachine'],
    bron: [{ naam: 'Voedingscentrum, Bewaarwijzer: afbakbroodje', url: 'https://www.voedingscentrum.nl/nl/thema/kopen-koken-bewaren/eten-bewaren/hoe-lang-kan-ik-bewaren/afbakbroodje.aspx' }],
  },

  {
    id: 'kaas-goudse',
    naam: 'Kaas, Goudse (jong of belegen)',
    zoek: ['kaas', 'goudse', 'jonge kaas', 'belegen kaas', 'jong belegen', 'kaasplakken', 'plakken kaas', 'geraspte kaas', 'edammer', 'boerenkaas', 'halfzachte kaas'],
    categorie: 'kaas',
    datum: 'THT',
    vragen: [
      { id: 'open', label: 'Hoe is het verpakt?', opties: [{ id: 'dicht', label: 'Dicht (folie of vacuüm)' }, { id: 'open', label: 'Open, of los van de kaasboer' }] },
      { id: 'vorm', label: 'Wat voor stuk?', alleenAls: { open: 'open' }, opties: [{ id: 'stuk', label: 'Een stuk' }, { id: 'plakken', label: 'Plakken' }, { id: 'geraspt', label: 'Geraspt' }] },
    ],
    situaties: [
      { als: { open: 'dicht' }, tijd: 'datum', match: 30, twijfel: 60, daarna: 'twijfel',
        houdbaar: 'Dicht en met een hele verpakking kan harde kaas vaak nog weken tot zo’n 2 maanden na de datum.' },
      { als: { open: 'open', vorm: 'stuk' }, tijd: 'open', match: 7, twijfel: 14, daarna: 'twijfel',
        houdbaar: 'Een open stuk kaas blijft ongeveer een week goed in de koelkast.' },
      { als: { open: 'open', vorm: 'plakken' }, tijd: 'open', match: 4, twijfel: 7, daarna: 'twijfel',
        houdbaar: 'Plakken drogen sneller uit: reken op een dag of 4 in de koelkast.' },
      { als: { open: 'open', vorm: 'geraspt' }, tijd: 'open', match: 2, twijfel: 4, daarna: 'twijfel',
        houdbaar: 'Geraspte kaas is maar een paar dagen goed als hij open is. Invriezen kan prima.' },
      { als: { open: 'open' }, tijd: 'open', match: 4, twijfel: 7, daarna: 'twijfel',
        houdbaar: 'Kies hierboven wat voor stuk het is voor een preciezer antwoord.' },
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
    bron: [{ naam: 'Voedingscentrum, Bewaarwijzer: kaas 48+, jong, Goudse', url: 'https://www.voedingscentrum.nl/nl/thema/kopen-koken-bewaren/eten-bewaren/hoe-lang-kan-ik-bewaren/kaas-48-plus-jong-goudse.aspx' }],
  },

  {
    id: 'kipfilet',
    naam: 'Kipfilet, rauw',
    zoek: ['kip', 'kipfilet', 'kippenvlees', 'kipreepjes', 'kippendijen', 'kipblokjes', 'gevogelte'],
    categorie: 'vlees',
    datum: 'TGT',
    vragen: [
      { id: 'plek', label: 'Waar ligt het?', opties: [{ id: 'koelkast', label: 'In de koelkast' }, { id: 'vriezer', label: 'Ingevroren vóór de datum' }] },
      { ...VRAAG_OPEN, alleenAls: { plek: 'koelkast' } },
    ],
    situaties: [
      { als: { plek: 'vriezer' }, tijd: 'vriezer', match: 90, twijfel: 180, daarna: 'twijfel',
        houdbaar: 'Ingevroren vóór de datum blijft kip zo’n 3 maanden lekker. Daarna is het niet gevaarlijk, maar kan het droog en ranzig gaan smaken.' },
      { als: { plek: 'koelkast', open: 'open' }, tijd: 'open', match: 2, twijfel: 2, daarna: 'ghost',
        houdbaar: 'Open rauwe kip eet je binnen 2 dagen op, en nooit na de datum.' },
      { als: { plek: 'koelkast' }, tijd: 'datum', match: 0, twijfel: 0, daarna: 'ghost',
        houdbaar: 'Rauwe kip heeft een TGT-datum: eet het op of vries het in, uiterlijk op de datum zelf.' },
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
    tweedeLevenNee: 'Rauwe kip na de datum krijgt geen tweede kans. Wel tip: vries het in vóór de datum, dan heb je later nog een maaltijd.',
    bron: [{ naam: 'Voedingscentrum, Bewaarwijzer: kipfilet, onbereid', url: 'https://www.voedingscentrum.nl/nl/thema/kopen-koken-bewaren/eten-bewaren/hoe-lang-kan-ik-bewaren/kipfilet-onbereid.aspx' }],
  },

  {
    id: 'yoghurt',
    naam: 'Yoghurt',
    zoek: ['yoghurt', 'yogurt', 'griekse yoghurt', 'volle yoghurt', 'magere yoghurt', 'kwark', 'skyr'],
    categorie: 'zuivel',
    datum: 'THT',
    vragen: [VRAAG_OPEN],
    situaties: [
      { als: { open: 'dicht' }, tijd: 'datum', match: 7, twijfel: 21, daarna: 'twijfel',
        houdbaar: 'Een dicht pak of bakje yoghurt is vaak nog een week of langer na de datum goed, als het in de koelkast heeft gestaan.' },
      { als: { open: 'open' }, tijd: 'open', match: 5, twijfel: 7, daarna: 'twijfel',
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
    bron: [{ naam: 'Voedingscentrum, Bewaarwijzer: yoghurt, vol', url: 'https://www.voedingscentrum.nl/nl/thema/kopen-koken-bewaren/eten-bewaren/hoe-lang-kan-ik-bewaren/yoghurt-vol.aspx' }],
  },

  {
    id: 'eieren',
    naam: 'Eieren',
    zoek: ['ei', 'eieren', 'eitjes', 'scharreleieren', 'vrije-uitloopeieren', 'biologische eieren'],
    categorie: 'zuivel',
    datum: 'THT',
    vragen: [
      { id: 'bereiding', label: 'Hoe ga je ze eten?', opties: [{ id: 'gaar', label: 'Goed gaar (hardgekookt, doorbakken, in de oven)' }, { id: 'zacht', label: 'Zacht of rauw (zachtgekookt, spiegelei met lopend geel, mayo, tiramisu)' }] },
    ],
    situaties: [
      { als: { bereiding: 'zacht' }, tijd: 'datum', match: 0, twijfel: 0, daarna: 'ghost',
        houdbaar: 'Na de datum eet je eieren niet meer zacht of rauw. Wel goed gaar: dan doodt de hitte eventuele bacteriën.' },
      { als: { bereiding: 'gaar' }, tijd: 'datum', match: 14, twijfel: 28, daarna: 'ghost',
        houdbaar: 'Goed gaar zijn eieren meestal nog een paar weken na de datum te eten. Hoe ouder, hoe vaker het geel uitloopt en het ei uitdroogt.' },
    ],
    check: [
      'De watertest: leg het ei in een glas water. Zinkt het en blijft het liggen? Vers. Gaat het rechtop staan? Ouder, maar goed gaar nog prima. Blijft het drijven? Weg ermee.',
      'Breek het ei eerst in een kommetje en ruik. Een zwavel- of rotte-eierenlucht betekent weg.',
      'Een gebarsten of vieze schaal? Die eieren eet je niet.',
    ],
    weg: ['Het ei blijft drijven in water', 'Een zwavel- of rotte-eierenlucht', 'Een gebarsten schaal'],
    wegUitleg: 'Twijfel je over één ei, breek dan elk ei apart in een kommetje. Zo gaat niet de hele pan mee.',
    tip: 'Bewaar eieren in de doos in de koelkast, met de punt naar beneden. Dan blijven ze langer vers en nemen ze geen geuren over.',
    tweedeLeven: ['Hardgekookt in een eiersalade', 'Quiche of frittata uit de oven', 'Bakken: cake, brownies of pannenkoeken'],
    bron: [{ naam: 'Voedingscentrum, Bewaarwijzer: ei, rauw', url: 'https://www.voedingscentrum.nl/nl/thema/kopen-koken-bewaren/eten-bewaren/hoe-lang-kan-ik-bewaren/ei-rauw.aspx' }],
  },
];

const ALGEMENE_BRON = { naam: 'Voedingscentrum: Twee houdbaarheidsdatums', url: 'https://www.voedingscentrum.nl/encyclopedie/houdbaarheidsdatums-tht-tgt.aspx' };

const DATUM_UITLEG = {
  THT: { kort: 'Ten minste houdbaar tot', uitleg: 'Een kwaliteitsdatum. Na de datum vaak nog prima: kijk, ruik en proef.' },
  TGT: { kort: 'Te gebruiken tot', uitleg: 'Een veiligheidsdatum. Na de datum niet meer eten, ook als het er goed uitziet.' },
};

const productById = id => PRODUCTEN.find(p => p.id === id);
