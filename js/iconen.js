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

const icoon = (naam, klasse = 'icon') => ICONEN[naam]
  ? `<svg class="${klasse}" viewBox="0 0 64 64" aria-hidden="true">${ICONEN[naam]}</svg>`
  : '';
