// Platte iconen (SVG, 64x64) voor producten, categorieën en de oordelen.
// Een eigen icoon toevoegen: een nieuwe regel hieronder met dezelfde naam als het product-id.

const SCHADUW = '<ellipse cx="32" cy="56" rx="20" ry="3.5" fill="#000" opacity=".07"/>';

const ICONEN = {
  // ---------- Producten ----------
  afbakbroodjes: `${SCHADUW}
    <path d="M30 34c0-9 7-15 15-15s14 6 14 15c0 5-3 8-7 8H37c-4 0-7-3-7-8z" fill="#d48f45"/>
    <path d="M40 23l3 6M47 21l3 7M53 24l2 6" stroke="#f3cf95" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M5 42c0-11 9-19 20-19s20 8 20 19c0 6-4 10-9 10H14c-5 0-9-4-9-10z" fill="#e8a95a"/>
    <path d="M14 30l4 8M23 27l4 9M32 29l3 8" stroke="#f9dcaa" stroke-width="3" stroke-linecap="round"/>
    <path d="M10 46c3 2 7 3 12 3" stroke="#f3c47e" stroke-width="2.5" stroke-linecap="round" fill="none"/>`,

  'kaas-goudse': `${SCHADUW}
    <path d="M6 34L44 16l14 18z" fill="#fde28a"/>
    <path d="M6 34h52v18a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2z" fill="#f7c948"/>
    <circle cx="18" cy="43" r="4" fill="#e3a929"/><circle cx="34" cy="47" r="3" fill="#e3a929"/>
    <circle cx="46" cy="41" r="3.5" fill="#e3a929"/><circle cx="27" cy="38.5" r="2" fill="#e3a929"/>
    <ellipse cx="38" cy="26" rx="3" ry="1.6" fill="#f2c94c"/>`,

  kipfilet: `${SCHADUW}
    <path d="M8 40c0-14 14-28 31-28 10 0 17 6 17 14 0 17-17 28-32 28C14 54 8 48 8 40z" fill="#f4a59a"/>
    <path d="M17 39c2-10 11-18 22-20" stroke="#fbd2cb" stroke-width="5" stroke-linecap="round" fill="none"/>
    <path d="M30 45c8-1 15-6 18-13" stroke="#e98c80" stroke-width="2.5" stroke-linecap="round" fill="none"/>`,

  yoghurt: `${SCHADUW}
    <path d="M15 22h34l-4 30a4 4 0 0 1-4 3.5H23a4 4 0 0 1-4-3.5z" fill="#fff"/>
    <path d="M16.6 31h30.8l-1.6 12H18.2z" fill="#86b4e8"/>
    <circle cx="32" cy="37" r="3.5" fill="#fff"/>
    <rect x="11" y="15" width="42" height="9" rx="4.5" fill="#5b8fd4"/>
    <path d="M17 19.5h12" stroke="#8fb6e8" stroke-width="2.5" stroke-linecap="round"/>`,

  eieren: `${SCHADUW}
    <ellipse cx="24" cy="36" rx="13" ry="17" fill="#f6ead6"/>
    <ellipse cx="19" cy="29" rx="3" ry="5" fill="#fff" opacity=".8"/>
    <ellipse cx="41" cy="39" rx="12" ry="15.5" fill="#d9a677"/>
    <ellipse cx="37" cy="33" rx="2.6" ry="4.5" fill="#ecc9a4"/>`,

  // ---------- Categorieën ----------
  'cat-brood': `
    <path d="M8 28c0-9 11-14 24-14s24 5 24 14c0 4-2 6-5 6v14a4 4 0 0 1-4 4H17a4 4 0 0 1-4-4V34c-3 0-5-2-5-6z" fill="#e8a95a"/>
    <path d="M22 22l4 6M32 20l3 7M42 22l3 6" stroke="#f9dcaa" stroke-width="3" stroke-linecap="round"/>`,
  'cat-zuivel': `
    <path d="M21 22l5-9h12l5 9v29a3 3 0 0 1-3 3H24a3 3 0 0 1-3-3z" fill="#fff"/>
    <path d="M21 22h22" stroke="#cfdcec" stroke-width="2"/>
    <rect x="21" y="30" width="22" height="13" fill="#86b4e8"/>
    <rect x="27" y="9" width="10" height="5" rx="1.5" fill="#5b8fd4"/>`,
  'cat-kaas': `
    <path d="M6 32L42 15l16 17z" fill="#fde28a"/>
    <path d="M6 32h52v17a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2z" fill="#f7c948"/>
    <circle cx="18" cy="41" r="4" fill="#e3a929"/><circle cx="36" cy="44" r="3" fill="#e3a929"/><circle cx="47" cy="38" r="3" fill="#e3a929"/>`,
  'cat-vlees': `
    <ellipse cx="25" cy="27" rx="16" ry="13" transform="rotate(-35 25 27)" fill="#d9774f"/>
    <ellipse cx="21" cy="23" rx="6" ry="4" transform="rotate(-35 21 23)" fill="#e9956f"/>
    <path d="M33 36l13 13" stroke="#f6efe2" stroke-width="6" stroke-linecap="round"/>
    <circle cx="49" cy="47" r="4" fill="#f6efe2"/><circle cx="45" cy="52" r="4" fill="#f6efe2"/>`,

  'cat-koelkast': `
    <rect x="16" y="6" width="32" height="52" rx="6" fill="#fff"/>
    <rect x="16" y="6" width="32" height="52" rx="6" fill="none" stroke="#a9cfa6" stroke-width="2.5"/>
    <path d="M16 24h32" stroke="#a9cfa6" stroke-width="2.5"/>
    <path d="M22 13v6M22 30v10" stroke="#7cb87e" stroke-width="3.5" stroke-linecap="round"/>`,
  'cat-vriezer': `
    <path d="M32 8v48M11 20l42 24M11 44l42-24" stroke="#5b8fd4" stroke-width="4.5" stroke-linecap="round"/>
    <path d="M26 12l6 5 6-5M26 52l6-5 6 5M10 28l8-2-2-8M54 36l-8 2 2 8M10 36l8 2-2 8M54 28l-8-2 2-8" stroke="#86b4e8" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`,

  // ---------- Oordelen ----------
  match: `
    <path d="M32 54C24 48 8 38 8 24c0-8 6-14 13-14 5 0 9 3 11 7 2-4 6-7 11-7 7 0 13 6 13 14 0 14-16 24-24 30z" fill="#e4574a"/>
    <path d="M22 30l7 7 13-14" stroke="#fff" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`,
  twijfel: `
    <circle cx="27" cy="27" r="15" fill="#fff" stroke="#e2a72e" stroke-width="6"/>
    <path d="M38 38l14 14" stroke="#e2a72e" stroke-width="7" stroke-linecap="round"/>
    <path d="M22 22a7 7 0 0 1 6-3" stroke="#f7d98d" stroke-width="3" stroke-linecap="round" fill="none"/>`,
  ghost: `
    <path d="M14 56V28a18 18 0 0 1 36 0v28l-6-5-6 5-6-5-6 5-6-5z" fill="#fff" stroke="#e3b3ac" stroke-width="2"/>
    <ellipse cx="25" cy="28" rx="3" ry="4" fill="#3b2a28"/><ellipse cx="39" cy="28" rx="3" ry="4" fill="#3b2a28"/>
    <ellipse cx="32" cy="39" rx="3.5" ry="4.5" fill="#3b2a28"/>`,
};

// ---------- Bouwstenen, zodat alle verpakkingen dezelfde stijl hebben ----------
const VORM = {
  // Melkpak met puntdak
  pak: (kleur, band, extra = '') => `${SCHADUW}
    <path d="M18 22l6-12h16l6 12v31a3 3 0 0 1-3 3H21a3 3 0 0 1-3-3z" fill="#fff"/>
    <path d="M24 10h16l6 12H18z" fill="${kleur}" opacity=".35"/>
    <rect x="18" y="30" width="28" height="16" fill="${kleur}"/>
    <rect x="27" y="6" width="10" height="5" rx="1.5" fill="${band}"/>${extra}`,
  // Glazen pot met deksel
  pot: (deksel, inhoud, extra = '') => `${SCHADUW}
    <rect x="14" y="20" width="36" height="35" rx="8" fill="${inhoud}"/>
    <rect x="18" y="24" width="5" height="22" rx="2.5" fill="#fff" opacity=".35"/>
    <rect x="16" y="11" width="32" height="10" rx="3" fill="${deksel}"/>${extra}`,
  // Bakje met deksel (zoals yoghurt of hummus)
  bakje: (deksel, kleur, extra = '') => `${SCHADUW}
    <path d="M12 28h40l-4 24a4 4 0 0 1-4 3.5H20a4 4 0 0 1-4-3.5z" fill="#fff"/>
    <path d="M13.5 37h37l-1.4 9H14.9z" fill="${kleur}"/>
    <rect x="9" y="22" width="46" height="8" rx="4" fill="${deksel}"/>${extra}`,
  // Zak met gekartelde rand (chips)
  zak: (kleur, accent, extra = '') => `${SCHADUW}
    <path d="M14 12l4 3 4-3 4 3 4-3 4 3 4-3 4 3 4-3 4 3v39a4 4 0 0 1-4 4H18a4 4 0 0 1-4-4z" fill="${kleur}"/>
    <ellipse cx="32" cy="34" rx="12" ry="10" fill="${accent}"/>${extra}`,
  // Knijpfles
  fles: (kleur, dop, extra = '') => `${SCHADUW}
    <path d="M22 22c0-4 4-7 10-7s10 3 10 7v30a4 4 0 0 1-4 4H26a4 4 0 0 1-4-4z" fill="${kleur}"/>
    <path d="M28 15V8h8v7" fill="${dop}"/>
    <rect x="26" y="32" width="12" height="12" rx="3" fill="#fff" opacity=".85"/>${extra}`,
  // Blik
  blik: (kleur, extra = '') => `${SCHADUW}
    <rect x="16" y="14" width="32" height="42" rx="5" fill="#cfd6dc"/>
    <rect x="16" y="22" width="32" height="26" fill="${kleur}"/>
    <ellipse cx="32" cy="15" rx="16" ry="3.5" fill="#e4e9ed"/>${extra}`,
};

Object.assign(ICONEN, {
  // ---------- Brood ----------
  brood: `${SCHADUW}
    <path d="M8 30c0-9 11-14 24-14s24 5 24 14c0 4-2 6-5 6v14a4 4 0 0 1-4 4H17a4 4 0 0 1-4-4V36c-3 0-5-2-5-6z" fill="#d9964e"/>
    <path d="M13 34c0-6 8-10 19-10s19 4 19 10v16a3 3 0 0 1-3 3H16a3 3 0 0 1-3-3z" fill="#f6dcae"/>`,
  wraps: `${SCHADUW}
    <circle cx="30" cy="34" r="20" fill="#f3d9a6"/>
    <circle cx="23" cy="28" r="1.8" fill="#dcb26b"/><circle cx="36" cy="38" r="2" fill="#dcb26b"/><circle cx="30" cy="22" r="1.5" fill="#dcb26b"/>
    <path d="M30 14a20 20 0 0 1 20 20H30z" fill="#e9c582"/>`,
  crackers: `${SCHADUW}
    <rect x="10" y="30" width="40" height="22" rx="3" fill="#d9a35c" transform="rotate(-6 30 41)"/>
    <rect x="14" y="20" width="40" height="22" rx="3" fill="#ecc285" transform="rotate(4 34 31)"/>
    <g fill="#c98f45"><circle cx="24" cy="28" r="1.4"/><circle cx="32" cy="29" r="1.4"/><circle cx="40" cy="30" r="1.4"/><circle cx="23" cy="35" r="1.4"/><circle cx="31" cy="36" r="1.4"/><circle cx="39" cy="37" r="1.4"/></g>`,

  // ---------- Zuivel ----------
  melk: VORM.pak('#86b4e8', '#5b8fd4'),
  'melk-houdbaar': VORM.pak('#e98c80', '#d9503f'),
  vla: VORM.pak('#a8714a', '#7d4e2f'),
  slagroom: VORM.pak('#f2d58a', '#e3a929', '<path d="M27 38c2-4 8-4 10 0" stroke="#fff" stroke-width="2.5" fill="none" stroke-linecap="round"/>'),
  haverdrink: VORM.pak('#d9c39a', '#b89a62', '<ellipse cx="32" cy="38" rx="3" ry="5" fill="#fff" opacity=".8"/>'),
  roomboter: `${SCHADUW}
    <path d="M8 34l20-10 28 8-20 11z" fill="#fff3b8"/>
    <path d="M8 34l28 9v12L8 46z" fill="#f7d65c"/><path d="M36 43l20-11v12L36 55z" fill="#e8bd34"/>
    <path d="M14 38l16 5" stroke="#fff" stroke-width="2" stroke-linecap="round" opacity=".7"/>`,
  'creme-fraiche': VORM.bakje('#7cb87e', '#e3f1df'),

  // ---------- Kaas ----------
  brie: `${SCHADUW}
    <path d="M8 34a24 9 0 0 1 48 0v10a24 9 0 0 1-48 0z" fill="#f4ecd9"/>
    <ellipse cx="32" cy="34" rx="24" ry="9" fill="#fbf6ea"/>
    <path d="M32 34l22-5a24 9 0 0 1 2 5v10a24 9 0 0 1-2 4z" fill="#fde9a8"/>`,
  mozzarella: `${SCHADUW}
    <circle cx="32" cy="35" r="19" fill="#fff"/>
    <circle cx="32" cy="35" r="19" fill="none" stroke="#e3e8ee" stroke-width="2"/>
    <path d="M22 28a12 12 0 0 1 8-6" stroke="#eef2f6" stroke-width="4" stroke-linecap="round" fill="none"/>
    <path d="M14 46c6 6 30 6 36 0" stroke="#9cc58f" stroke-width="3" fill="none" stroke-linecap="round"/>`,
  roomkaas: VORM.bakje('#b9c3cc', '#ffffff', '<path d="M24 41h16" stroke="#86b4e8" stroke-width="3" stroke-linecap="round"/>'),

  // ---------- Vlees, vis en vega ----------
  gehakt: `${SCHADUW}
    <rect x="8" y="26" width="48" height="26" rx="6" fill="#e9eef2"/>
    <ellipse cx="32" cy="36" rx="19" ry="10" fill="#d9776a"/>
    <g fill="#f0a49a"><circle cx="24" cy="34" r="2"/><circle cx="31" cy="31" r="2"/><circle cx="38" cy="35" r="2"/><circle cx="28" cy="39" r="2"/><circle cx="36" cy="41" r="1.8"/><circle cx="42" cy="32" r="1.6"/></g>`,
  vleeswaren: `${SCHADUW}
    <ellipse cx="24" cy="38" rx="14" ry="12" fill="#f6b3ab"/>
    <ellipse cx="34" cy="34" rx="14" ry="12" fill="#f9c7c0"/>
    <ellipse cx="42" cy="38" rx="14" ry="12" fill="#f4a59a"/>
    <path d="M34 34c4-3 10-3 14 1" stroke="#fde3df" stroke-width="2.5" fill="none" stroke-linecap="round"/>`,
  salami: `${SCHADUW}
    <circle cx="24" cy="36" r="15" fill="#c9473f"/>
    <circle cx="42" cy="32" r="13" fill="#d65a50"/>
    <g fill="#f6d2cc"><circle cx="19" cy="32" r="2"/><circle cx="27" cy="38" r="2.2"/><circle cx="21" cy="42" r="1.8"/><circle cx="40" cy="28" r="2"/><circle cx="46" cy="35" r="1.8"/><circle cx="38" cy="36" r="1.6"/></g>`,
  rookworst: `${SCHADUW}
    <path d="M12 26c0 16 9 26 20 26s20-10 20-26" stroke="#a5532f" stroke-width="12" stroke-linecap="round" fill="none"/>
    <path d="M16 30c1 10 7 17 16 17" stroke="#c7714a" stroke-width="3" stroke-linecap="round" fill="none"/>`,
  zalm: `${SCHADUW}
    <path d="M6 40c6-14 22-20 40-16l12 4-6 10c-16 6-32 10-46 2z" fill="#f59a6e"/>
    <path d="M18 32l6 12M28 28l6 13M38 26l5 12" stroke="#fde2d2" stroke-width="2.5" stroke-linecap="round"/>`,
  'gerookte-zalm': `${SCHADUW}
    <ellipse cx="32" cy="40" rx="26" ry="12" fill="#fff"/>
    <path d="M14 40c4-8 14-10 22-6M22 44c6-6 16-6 24-2" stroke="#f08a5d" stroke-width="7" stroke-linecap="round" fill="none"/>
    <path d="M16 39c4-6 12-8 18-5" stroke="#fbc2a5" stroke-width="2" stroke-linecap="round" fill="none"/>`,
  'vega-gehakt': `${SCHADUW}
    <ellipse cx="32" cy="38" rx="22" ry="12" fill="#a8774f"/>
    <ellipse cx="32" cy="35" rx="22" ry="10" fill="#c09068"/>
    <path d="M38 18c6 0 10 4 10 10-6 0-10-4-10-10z" fill="#7cb87e"/><path d="M38 28l6-6" stroke="#4a7f4d" stroke-width="2" stroke-linecap="round"/>`,

  // ---------- Groente en kant-en-klaar ----------
  sla: `${SCHADUW}
    <path d="M14 14h36v38a4 4 0 0 1-4 4H18a4 4 0 0 1-4-4z" fill="#e8f4ff" opacity=".9"/>
    <path d="M18 50c-4-14 4-24 14-26 10 2 18 12 14 26z" fill="#8cc56f"/>
    <path d="M32 26v24M26 34l6 6M38 34l-6 6" stroke="#5f9a49" stroke-width="2" stroke-linecap="round"/>
    <rect x="14" y="10" width="36" height="6" rx="2" fill="#7cb87e"/>`,
  hummus: VORM.bakje('#c9a46a', '#f1dfb8', '<path d="M24 26c4-3 12-3 16 0" stroke="#a37b3f" stroke-width="2" fill="none"/>'),
  restjes: `${SCHADUW}
    <rect x="8" y="24" width="48" height="30" rx="7" fill="#fff"/>
    <rect x="8" y="24" width="48" height="30" rx="7" fill="none" stroke="#cfd6dc" stroke-width="2"/>
    <path d="M14 36c4-4 8 2 12-2s8 2 12-2 8 2 12-2" stroke="#f2c14e" stroke-width="5" stroke-linecap="round" fill="none"/>
    <circle cx="22" cy="44" r="3.5" fill="#d9503f"/><circle cx="40" cy="45" r="3" fill="#7cb87e"/>
    <rect x="6" y="18" width="52" height="8" rx="4" fill="#86b4e8"/>`,

  // ---------- Voorraadkast ----------
  sap: VORM.pak('#f7a440', '#e9862a', '<circle cx="32" cy="38" r="5" fill="#fff"/><circle cx="32" cy="38" r="3" fill="#f7a440"/>'),
  pasta: `${SCHADUW}
    <g transform="rotate(-25 32 34)"><rect x="12" y="22" width="12" height="22" rx="2" fill="#f2c14e"/><path d="M15 25v16M21 25v16" stroke="#e0a92c" stroke-width="2"/></g>
    <g transform="rotate(20 40 36)"><rect x="34" y="24" width="12" height="22" rx="2" fill="#f5cf6a"/><path d="M37 27v16M43 27v16" stroke="#e0a92c" stroke-width="2"/></g>`,
  rijst: `${SCHADUW}
    <path d="M8 32h48a24 22 0 0 1-48 0z" fill="#86b4e8"/>
    <path d="M10 32c2-10 12-14 22-14s20 4 22 14z" fill="#fff"/>
    <g fill="#e9eef2"><ellipse cx="24" cy="26" rx="2" ry="1"/><ellipse cx="33" cy="23" rx="2" ry="1"/><ellipse cx="41" cy="27" rx="2" ry="1"/></g>`,
  chips: VORM.zak('#f2c14e', '#fbe7a1', '<path d="M26 32c3-3 9-3 12 0" stroke="#e0a92c" stroke-width="2" fill="none"/>'),
  koekjes: `${SCHADUW}
    <circle cx="32" cy="34" r="20" fill="#d9a35c"/>
    <g fill="#6b3e22"><circle cx="24" cy="28" r="3"/><circle cx="36" cy="25" r="2.5"/><circle cx="40" cy="38" r="3"/><circle cx="27" cy="41" r="2.5"/><circle cx="33" cy="34" r="2"/></g>`,
  cornflakes: `${SCHADUW}
    <rect x="14" y="8" width="36" height="48" rx="4" fill="#f2c14e"/>
    <rect x="14" y="8" width="36" height="10" rx="4" fill="#d9503f"/>
    <circle cx="32" cy="38" r="11" fill="#fff"/>
    <g fill="#e9a43a"><path d="M27 37l4-3 3 4z"/><path d="M32 41l5-2 0 4z"/><path d="M28 42l3 1-2 3z"/></g>`,
  pindakaas: VORM.pot('#d9503f', '#c48a4f'),
  jam: VORM.pot('#d9503f', '#c2304a', '<g fill="#fff" opacity=".6"><rect x="18" y="12" width="5" height="4"/><rect x="28" y="12" width="5" height="4"/><rect x="38" y="12" width="5" height="4"/><rect x="23" y="16" width="5" height="4"/><rect x="33" y="16" width="5" height="4"/></g>'),
  pastasaus: VORM.pot('#7cb87e', '#d9503f', '<circle cx="36" cy="40" r="4" fill="#fff" opacity=".85"/><path d="M34 38l4 4" stroke="#7cb87e" stroke-width="2"/>'),
  mayonaise: VORM.fles('#fff3c4', '#e3a929'),
  ketchup: VORM.fles('#d9503f', '#fff'),
  chocolade: `${SCHADUW}
    <rect x="12" y="12" width="40" height="44" rx="4" fill="#7a4528"/>
    <g fill="#8f5634"><rect x="16" y="16" width="14" height="11" rx="2"/><rect x="34" y="16" width="14" height="11" rx="2"/><rect x="16" y="30" width="14" height="11" rx="2"/><rect x="34" y="30" width="14" height="11" rx="2"/></g>
    <path d="M12 40h40v12a4 4 0 0 1-4 4H16a4 4 0 0 1-4-4z" fill="#d9503f"/>`,
  'bonen-blik': VORM.blik('#7cb87e', '<g fill="#a5532f"><ellipse cx="27" cy="35" rx="4" ry="3"/><ellipse cx="37" cy="33" rx="4" ry="3"/><ellipse cx="32" cy="40" rx="4" ry="3"/></g>'),

  // ---------- Nieuwe categorieën ----------
  'cat-groente': `
    <path d="M14 50c-4-16 4-28 18-30 14 2 22 14 18 30z" fill="#8cc56f"/>
    <path d="M32 22v28M24 32l8 8M40 32l-8 8" stroke="#5f9a49" stroke-width="2.5" stroke-linecap="round"/>`,
  'cat-voorraad': VORM.pot('#d9503f', '#f2c14e').replace(SCHADUW, ''),
});

const icoon = (naam, klasse = 'icon') => ICONEN[naam]
  ? `<svg class="${klasse}" viewBox="0 0 64 64" aria-hidden="true">${ICONEN[naam]}</svg>`
  : '';
