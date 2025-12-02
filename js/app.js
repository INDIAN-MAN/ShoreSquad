// ShoreSquad — minimal app.js to provide interactivity and demo-friendly stubs
// Use ES modules and keep small for performance.

const selectors = {
  openMap: document.getElementById('openMap'),
  learnMore: document.getElementById('learnMore'),
  mapPlaceholder: document.getElementById('mapPlaceholder'),
  joinForm: document.getElementById('joinForm')
}

// Feature: Lazy-load map assets when user opens map for the first time
let mapLoaded = false;
selectors.openMap?.addEventListener('click', async () => {
  // If the page already includes an embedded map (iframe) just scroll to it
  if (selectors.mapPlaceholder?.querySelector('iframe')) {
    selectors.mapPlaceholder.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return;
  }

  // Otherwise proceed with demo lazy-load flow for interactive map assets
  if (mapLoaded) return;
  mapLoaded = true;
  selectors.mapPlaceholder.textContent = 'Loading interactive map…';

  // Simulate lightweight dynamic import / map initialization
  // This is where you'd initialize a real map (e.g., MapLibre, Mapbox GL, Leaflet)
  await new Promise(res => setTimeout(res, 700));

  selectors.mapPlaceholder.innerHTML = `<div style="padding:18px;text-align:center">📍 Interactive map active (demo)<br/><small>Pins and weather overlays will appear here</small></div>`;
});

// Learn more gently scroll
selectors.learnMore?.addEventListener('click', () => {
  document.getElementById('features')?.scrollIntoView({behavior:'smooth'});
});

// Form: basic validated submission with unobtrusive feedback
selectors.joinForm?.addEventListener('submit', async (ev) => {
  ev.preventDefault();
  const email = document.getElementById('email')?.value?.trim();
  if (!email) return;

  // Minimal optimistic UI
  const submitBtn = selectors.joinForm.querySelector('button') || null;
  const orig = submitBtn?.textContent;
  if (submitBtn) submitBtn.textContent = 'Joining…';

  // Simulate network call with debounce for performance
  await new Promise(res => setTimeout(res, 700));

  // Show a small confirmation message
  alert(`Thanks — you're in! Watch your inbox for ShoreSquad event alerts: ${email}`);
  if (submitBtn) submitBtn.textContent = orig;
  selectors.joinForm.reset();
});

// Progressive enhancement: keyboard and focus helpers
document.addEventListener('keydown', (e) => {
  // Press 'M' to open the map quickly (keyboard shortcut demo)
  if (e.key?.toLowerCase() === 'm') {
    selectors.openMap?.click();
  }
});

// Tiny performance telemetry (no external calls) — can be expanded
console.debug('ShoreSquad app initialized — lightweight microbundle friendly');
