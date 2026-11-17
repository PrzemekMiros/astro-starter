import { trackLead } from './google-ads.js';

// One delegated listener, including forms inserted by Astro ClientRouter.
document.addEventListener('submit', async (event) => {
  const form = event.target;
  if (!(form instanceof HTMLFormElement) || !form.matches('[data-contact-form]')) return;
  event.preventDefault();
  if (form.dataset.sending || form.dataset.sent || !form.reportValidity()) return;
  const status = form.querySelector('[data-form-status]');
  const button = form.querySelector('button[type="submit"]');
  const label = button.querySelector('span');
  const originalLabel = label.textContent;
  const data = new FormData(form);
  if (String(data.get('bot-field') || '').trim()) return;
  if (!String(data.get('name')).trim() || !String(data.get('message')).trim()) {
    status.textContent = 'Uzupełnij imię i wiadomość — pola nie mogą zawierać samych spacji.';
    status.focus();
    return;
  }
  // Reuse the random ID on retry; it contains no personal data.
  const idField = form.elements.namedItem('submission-id');
  idField.value ||= crypto.randomUUID();
  data.set('submission-id', idField.value);
  form.dataset.sending = 'true';
  form.setAttribute('aria-busy', 'true');
  button.disabled = true;
  label.textContent = 'Wysyłanie…';
  status.textContent = 'Trwa wysyłanie zapytania. Poczekaj na potwierdzenie.';
  try {
    const response = await fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(data).toString(),
    });
    if (!response.ok) throw new Error('Submission rejected');
    form.dataset.sent = 'true';
    label.textContent = 'Zapytanie wysłane';
    status.textContent = 'Dziękuję! Twoje zapytanie zostało przyjęte. Skontaktuję się z Tobą, aby ustalić dalsze kroki.';
    // Only this accepted POST can trigger a conversion, never a page view or URL.
    trackLead(idField.value);
    form.reset();
  } catch {
    status.textContent = 'Nie udało się potwierdzić wysłania. Spróbuj ponownie lub zadzwoń: +48 788 660 190.';
    button.disabled = false;
    label.textContent = originalLabel;
  } finally {
    delete form.dataset.sending;
    form.removeAttribute('aria-busy');
    status.focus();
  }
});
