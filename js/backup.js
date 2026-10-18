// ---------- Back-up ----------
// Alles als één bestand. Belangrijk op een iPhone: Safari wist websitegegevens
// als je de app 7 dagen niet opent (tenzij hij op je beginscherm staat).
const BACKUP_ID = 'datechecker';

$('#backup-save').onclick = async () => {
  const data = { app: BACKUP_ID, version: 1, savedAt: new Date().toISOString(), items: state.items, profile: state.profile, gered: gered.checks };
  const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
  const file = new File([blob], `${BACKUP_ID}-backup-${today()}.json`, { type: 'application/json' });
  // Op de iPhone opent dit het deelmenu (bewaren in Bestanden, AirDrop…).
  if (navigator.canShare?.({ files: [file] })) {
    try { await navigator.share({ files: [file], title: `${APP_NAME} back-up` }); await backupMade(); return; } catch (err) { if (err.name === 'AbortError') return; }
  }
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = file.name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  await backupMade();
};

// Onthouden wanneer de laatste back-up was.
async function backupMade() {
  state.profile.lastBackupAt = Date.now();
  await saveProfile();
  renderBackupInfo();
}
function renderBackupInfo() {
  const at = state.profile.lastBackupAt;
  $('#backup-info').textContent = at ? `Laatste back-up: ${new Date(at).toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' })}.` : 'Je hebt nog geen back-up gemaakt.';
}

$('#backup-restore').onclick = () => $('#backup-file').click();
$('#backup-file').onchange = async e => {
  const file = e.target.files[0];
  e.target.value = '';
  if (!file) return;
  try {
    const data = JSON.parse(await file.text());
    if (data.app !== BACKUP_ID || !Array.isArray(data.items)) throw new Error();
    if (!confirm(`Back-up van ${new Date(data.savedAt).toLocaleDateString('nl-NL')} met ${data.items.length} items terugzetten? Wat er nu al in staat blijft bewaard.`)) return;
    for (const it of data.items) await saveItem(it);
    // Je eigen gered-teller: checks die er nog niet zijn erbij zetten.
    const bekend = new Set(gered.checks.map(c => c.id));
    gered.checks.push(...(data.gered || []).filter(c => !bekend.has(c.id)));
    await bewaarGered();
    renderZoeken();
    toast(`${data.items.length} items teruggezet`);
    renderSettings();
  } catch {
    toast('Dit is geen geldige back-up');
  }
};
