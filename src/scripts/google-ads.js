const TAG = 'AW-18067926091';
const sent = new Set();
let marketingAllowed = false;

window.dataLayer ||= [];
window.gtag ||= function () { window.dataLayer.push(arguments); };

function applyConsent(consent) {
  marketingAllowed = consent?.marketing === true;
  window.gtag('consent', 'update', {
    ad_storage: marketingAllowed ? 'granted' : 'denied',
    ad_user_data: marketingAllowed ? 'granted' : 'denied',
    ad_personalization: marketingAllowed ? 'granted' : 'denied',
    analytics_storage: consent?.analytics === true ? 'granted' : 'denied',
  });
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
