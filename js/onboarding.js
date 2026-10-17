// Welkomstscherm bij de eerste keer. Stappen voegen we toe als de app vorm krijgt;
// de laatste stap is altijd "zet de app op je beginscherm".

let welcomeStep = 0;

function openWelcome() {
  welcomeStep = 0;
  renderWelcome();
  $('#welcome').showModal();
}

function renderWelcome() {
  const steps = document.querySelectorAll('#welcome .w-step');
  steps.forEach((s, i) => s.classList.toggle('hidden', i !== welcomeStep));
  document.querySelectorAll('#welcome .w-dots span').forEach((d, i) => d.classList.toggle('on', i === welcomeStep));
  if (welcomeStep === steps.length - 1) {
    $('#w-home-title').textContent = isStandalone() ? 'Je bent er klaar voor' : `Zet ${APP_NAME} op je beginscherm`;
    $('#w-homescreen').innerHTML = homeScreenHTML();
  }
}

$('#w-start').onclick = () => { welcomeStep = 1; renderWelcome(); };
$('#w-done').onclick = async () => {
  state.profile.onboarded = true;
  await saveProfile();
  $('#welcome').close();
};
// Niet wegtikken met Escape voordat je klaar bent.
$('#welcome').addEventListener('cancel', e => e.preventDefault());
$('#settings-welcome').onclick = openWelcome;
