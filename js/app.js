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

  selectors.mapPlaceholder.innerHTML = `<div style="padding:18px;text-align:center">📍 Interactive map active (demo)<br/><small>Pins and weather overlays (temperatures in °C) will appear here</small></div>`;
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

// --- Weather forecast integration (NEA / data.gov.sg) ---
const FORECAST_URL = 'https://api.data.gov.sg/v1/environment/4-day-weather-forecast';
const forecastCacheKey = 'ss_forecast_cache_v1';

function formatDateIsoToLabel(isoDate){
  try {
    const d = new Date(isoDate);
    return d.toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' });
  } catch(e){
    return isoDate;
  }
}

async function fetchAndRenderForecast(){
  const container = document.getElementById('forecastContainer');
  if (!container) return;

  // Try cache first (10 minute TTL)
  try{
    const cached = JSON.parse(localStorage.getItem(forecastCacheKey) || 'null');
    if (cached && (Date.now() - cached.ts) < (10 * 60 * 1000)){
      renderForecast(cached.data, container);
      return;
    }
  }catch(e){ /* ignore cache parse errors */ }

  container.innerHTML = '<div class="forecast-loading">Loading forecast…</div>';
  try{
    const resp = await fetch(FORECAST_URL, { cache: 'no-cache' });
    if (!resp.ok) throw new Error('Network response not ok ' + resp.status);
    const json = await resp.json();
    // store in cache
    try{ localStorage.setItem(forecastCacheKey, JSON.stringify({ ts: Date.now(), data: json })); }catch(e){ /* ignore */ }

    renderForecast(json, container);
  }catch(err){
    console.warn('Forecast fetch failed', err);
    container.innerHTML = `<div class="forecast-loading">Weather currently unavailable — check back soon.</div>`;
  }
}

function renderForecast(json, container){
  const items = json?.items?.[0]?.forecasts || [];
  if (!items.length){
    container.innerHTML = `<div class="forecast-loading">No forecast data available</div>`;
    return;
  }

  // Build markup for each day
  const nodes = items.map(day => {
    const dateLabel = formatDateIsoToLabel(day.date || day.timestamp);
    const low = day.temperature?.low ?? null;
    const high = day.temperature?.high ?? null;
    const desc = day.forecast || day.general?.forecast || '';
    const humidity = day.relative_humidity ? `RH ${day.relative_humidity.low}%–${day.relative_humidity.high}%` : '';
    const wind = day.wind ? `Wind ${day.wind.direction} ${day.wind.speed?.low ?? ''}–${day.wind.speed?.high ?? ''} km/h` : '';

    return `<article class="forecast-card" role="group" aria-label="Forecast for ${dateLabel}">
      <div class="forecast-day">${dateLabel}</div>
      <div class="forecast-temp">${high ?? '--'}°C / ${low ?? '--'}°C</div>
      <div class="forecast-desc">${escapeHtml(desc)}</div>
      <small class="muted">${humidity} ${wind}</small>
    </article>`;
  }).join('\n');

  container.innerHTML = nodes;
}

function escapeHtml(s){
  if(!s) return '';
  return String(s).replace(/[&<>"'`]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;', '`':'&#96;'}[c]));
}

// Kick off once DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // load forecast (NEA 4-day API)
  fetchAndRenderForecast();
});
