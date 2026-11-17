const TAG = 'AW-18067926091';
const GTM_CONTAINER = 'GTM-THGT723D';
const sent = new Set();
let loaded = false;
let marketingAllowed = false;

window.dataLayer ||= [];
window.gtag ||= function () { window.dataLayer.push(arguments); };
window.gtag('consent', 'default', {
  ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied', analytics_storage: 'denied',
});

function applyConsent(consent) {
  marketingAllowed = consent?.marketing === true;
  window.gtag('consent', 'update', {
    ad_storage: marketingAllowed ? 'granted' : 'denied',
    ad_user_data: marketingAllowed ? 'granted' : 'denied',
    ad_personalization: marketingAllowed ? 'granted' : 'denied',
    analytics_storage: consent?.analytics === true ? 'granted' : 'denied',
  });
  if (!marketingAllowed || loaded) return;
  loaded = true;
  window.gtag('js', new Date());
  window.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' });
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtm.js?id=${GTM_CONTAINER}`;
  // Kept outside the swapped head so ClientRouter cannot remove/reinstall it.
  document.body.append(script);
}
 
try { applyConsent(JSON.parse(localStorage.getItem('cookie-consent-v1') || 'null')); } catch { applyConsent(null); }
window.addEventListener('site:consent', (event) => applyConsent(event.detail));
window.addEventListener('storage', (event) => {
  if (event.key !== 'cookie-consent-v1') return;
  try { applyConsent(JSON.parse(event.newValue || 'null')); } catch { applyConsent(null); }
});

export function trackLead(id) {
  if (!marketingAllowed || !id || sent.has(id)) return;
  sent.add(id);
  try {
    window.gtag('event', 'conversion', {
      send_to: `${TAG}/kgjcCNis7ZYcEMvYuqdD`, transaction_id: id,
    });
  } catch { /* Measurement must never change the accepted form's success state. */ }
}
