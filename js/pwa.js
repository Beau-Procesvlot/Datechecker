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
    return `<p>${APP_NAME} is already on your home screen. Nice: that way your data stays saved.</p>
      <p>Do make a backup now and then (in Settings). If you lose your phone or delete the app, you’ll still have everything.</p>`;
  }
  const steps = isIOS()
    ? `<li>In Safari, tap <b>Share</b> <span class="share-icon" aria-hidden="true"></span> (don’t see it? Tap <b>•••</b> first)</li>
       <li>Choose <b>Add to Home Screen</b></li>
       <li>From now on, open ${APP_NAME} from the icon on your home screen</li>`
    : `<li>In your browser, tap the menu <b>⋮</b></li>
       <li>Choose <b>Install app</b> or <b>Add to Home screen</b></li>
       <li>From now on, open ${APP_NAME} from the icon</li>`;
  return `<ol class="hs-steps">${steps}</ol>
    <p class="w-callout"><strong>Why?</strong> Your data is only stored on your phone. Safari deletes the data of a website you haven’t opened for 7 days, but not of an app on your home screen.</p>
    <p class="muted small">Also make a backup now and then (in Settings).</p>`;
}

// ---------- Privacy ----------
document.querySelectorAll('[data-open-privacy]').forEach(b => b.onclick = e => { e.preventDefault(); $('#privacy-sheet').showModal(); });
