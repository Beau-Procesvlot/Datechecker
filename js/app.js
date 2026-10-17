// Gedeelde staat, hulpfuncties en het opstarten van de app.

const APP_NAME = 'Datechecker';

const state = {
  items: [],
  profile: { onboarded: false },
};

const $ = sel => document.querySelector(sel);
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const newId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
// Lokale datum (niet UTC), anders is het na middernacht nog "gisteren".
const today = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };

// Rij met keuzeknoppen. isOn(id) bepaalt of een knop aan staat.
function renderChips(el, options, isOn, onClick) {
  el.innerHTML = '';
  for (const o of options) {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'chip' + (isOn(o.id) ? ' on' : '');
    b.textContent = o.label;
    b.onclick = () => onClick(o.id);
    el.appendChild(b);
  }
}

function daysAgoText(dateStr) {
  if (!dateStr) return 'nog nooit';
  const days = Math.round((new Date(today()) - new Date(dateStr)) / 86400000);
  if (days === 0) return 'vandaag';
  if (days === 1) return 'gisteren';
  return `${days} dagen geleden`;
}

let toastTimer;
function toast(text) {
  const el = $('#toast');
  el.textContent = text;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 2200);
}

// Sluit een sheet als je op de donkere achtergrond tikt.
document.querySelectorAll('dialog.sheet').forEach(d => d.addEventListener('click', e => {
  if (e.target === d) d.close();
}));

// Sheets wegslepen aan het greepje bovenaan: ver genoeg (of snel genoeg) omlaag = sluiten,
// anders veert hij terug.
document.querySelectorAll('dialog.sheet .sheet-handle').forEach(handle => {
  const sheet = handle.closest('dialog');
  let startY = 0, lastY = 0, lastT = 0, speed = 0, dragging = false;

  handle.addEventListener('pointerdown', e => {
    dragging = true;
    startY = lastY = e.clientY;
    lastT = performance.now();
    speed = 0;
    sheet.style.transition = 'none';
    try { handle.setPointerCapture(e.pointerId); } catch { /* sommige browsers: niet nodig */ }
  });
  handle.addEventListener('pointermove', e => {
    if (!dragging) return;
    const now = performance.now();
    speed = (e.clientY - lastY) / Math.max(1, now - lastT); // px per ms
    lastY = e.clientY;
    lastT = now;
    const dy = Math.max(0, e.clientY - startY);
    sheet.style.transform = `translateY(${dy}px)`;
  });
  const end = () => {
    if (!dragging) return;
    dragging = false;
    const dy = Math.max(0, lastY - startY);
    sheet.style.transition = 'transform .22s ease-out';
    if (dy > sheet.offsetHeight * 0.25 || (dy > 30 && speed > 0.6)) {
      sheet.style.transform = 'translateY(100%)';
      setTimeout(() => { sheet.close(); sheet.style.transform = ''; sheet.style.transition = ''; }, 220);
    } else {
      sheet.style.transform = '';
      setTimeout(() => { sheet.style.transition = ''; }, 220);
    }
  };
  handle.addEventListener('pointerup', end);
  handle.addEventListener('pointercancel', end);
});

// ---------- Opslaan ----------
async function saveItem(item) {
  await DB.putItem(item);
  const i = state.items.findIndex(x => x.id === item.id);
  if (i >= 0) state.items[i] = item; else state.items.push(item);
}
async function removeItem(id) {
  await DB.deleteItem(id);
  state.items = state.items.filter(x => x.id !== id);
}
async function saveProfile() {
  await DB.setMeta('profile', state.profile);
}

// ---------- Tabs ----------
const TAB_TITLES = { zoeken: 'Zoeken', 'tweede-leven': 'Tweede leven', instellingen: 'Instellingen' };

function showTab(name) {
  document.querySelectorAll('.tabbar button').forEach(b => b.classList.toggle('on', b.dataset.tab === name));
  document.querySelectorAll('main > section').forEach(s => s.classList.toggle('hidden', s.id !== 'tab-' + name));
  $('#page-title').textContent = TAB_TITLES[name];
  window.scrollTo(0, 0);
  if (name === 'instellingen') renderSettings();
}
document.querySelectorAll('.tabbar button').forEach(b => b.onclick = () => showTab(b.dataset.tab));

function renderSettings() {
  renderBackupInfo();
}

// ---------- Start ----------
// Pas starten als alle scripts geladen zijn (de opslag kan eerder klaar zijn dan de rest).
document.addEventListener('DOMContentLoaded', async () => {
  state.profile = { ...state.profile, ...((await DB.getMeta('profile')) || {}) };
  state.items = await DB.allItems();
  if (!(await DB.persistent)) $('#storage-warning').classList.remove('hidden');
  // Vraag de browser om de gegevens niet zomaar op te ruimen bij weinig ruimte.
  navigator.storage?.persist?.().catch(() => {});
  showTab('zoeken');
  if (!state.profile.onboarded) openWelcome();
});
