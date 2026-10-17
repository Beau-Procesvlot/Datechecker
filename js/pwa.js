// De app als "echte" app: offline werken, melding bij een nieuwe versie en uitleg voor het beginscherm.

// ---------- Offline ----------
if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost')) {
  navigator.serviceWorker.register('sw.js').catch(() => { /* zonder service worker werkt de app gewoon online */ });
}

// ---------- Nieuwe versie ----------
// version.json krijgt bij elke update een nieuw nummer. Wijkt het nummer online af van de versie
// die nu open staat, dan verschijnt bovenaan een melding. Tikken = verversen.
let loadedVersion = null;
let lastVersionCheck = 0;

async function onlineVersion() {
  const res = await fetch(`version.json?${Date.now()}`, { cache: 'no-store' });
  return (await res.json()).version;
}

async function checkForUpdate() {
  if (Date.now() - lastVersionCheck < 5 * 60 * 1000) return;
  lastVersionCheck = Date.now();
  try {
    const v = await onlineVersion();
    if (!loadedVersion) loadedVersion = v;
    else if (v !== loadedVersion) showUpdateBanner();
  } catch { /* offline: later nog eens */ }
}

// Als "popover" ligt de melding ook boven een open scherm.
function showUpdateBanner() {
  const el = $('#update-banner');
  el.classList.remove('hidden');
  if (el.showPopover) {
    el.popover = 'manual';
    if (el.matches(':popover-open')) el.hidePopover();
    el.showPopover();
  }
}
$('#update-banner').onclick = () => location.reload();
// Op de iPhone blijft een app op het beginscherm vaak "open" op de achtergrond; daarom ook kijken bij terugkomen.
document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') checkForUpdate(); });
document.addEventListener('DOMContentLoaded', () => checkForUpdate());

// ---------- Beginscherm ----------
const isStandalone = () => window.matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
const isIOS = () => /iPhone|iPad|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

// Uitleg voor de laatste stap van het welkomstscherm.
function homeScreenHTML() {
  if (isStandalone()) {
    return `<p>${APP_NAME} staat al op je beginscherm. Top: zo blijven je gegevens bewaard.</p>
      <p>Maak wel af en toe een back-up (bij Instellingen). Als je telefoon kwijtraakt of je de app verwijdert, heb je alles dan nog.</p>`;
  }
  const steps = isIOS()
    ? `<li>Tik in Safari op <b>Deel</b> <span class="share-icon" aria-hidden="true"></span> (zie je die niet, tik dan eerst op <b>•••</b>)</li>
       <li>Kies <b>Zet op beginscherm</b></li>
       <li>Open ${APP_NAME} voortaan via het icoon op je beginscherm</li>`
    : `<li>Tik in je browser op het menu <b>⋮</b></li>
       <li>Kies <b>App installeren</b> of <b>Toevoegen aan startscherm</b></li>
       <li>Open ${APP_NAME} voortaan via het icoon</li>`;
  return `<ol class="hs-steps">${steps}</ol>
    <p class="w-callout"><strong>Waarom?</strong> Je gegevens staan alleen op je telefoon. Safari wist de gegevens van een website die je 7 dagen niet opent, maar niet van een app op je beginscherm.</p>
    <p class="muted small">Maak daarnaast af en toe een back-up (bij Instellingen).</p>`;
}

// ---------- Privacy ----------
document.querySelectorAll('[data-open-privacy]').forEach(b => b.onclick = e => { e.preventDefault(); $('#privacy-sheet').showModal(); });
