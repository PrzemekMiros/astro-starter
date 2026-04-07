const ENDPOINT = "https://www.futurewebstudio.pl/contactFormPortfolio.php";
const THANK_YOU_PATH = "/wyslano-wiadomosc/";
const DEFAULT_CONVERSION_VALUE = 1;
const DEFAULT_CONVERSION_CURRENCY = "PLN";
const MESSAGES = {
  sending: "Wysyłam wiadomość...",
  error: "Wystąpił problem. Spróbuj ponownie za chwilę.",
  fallback: "Wiadomość dotarła - skontaktujemy się wkrótce.",
};

function createSubmitHandler(form, statusEl) {
  function buildThankYouUrl(result) {
    const value = Number(result?.value);
    const conversionValue = Number.isFinite(value) ? value : DEFAULT_CONVERSION_VALUE;
    const currency = typeof result?.currency === "string" && result.currency.trim()
      ? result.currency.trim().toUpperCase()
      : DEFAULT_CONVERSION_CURRENCY;

    const params = new URLSearchParams({
      value: String(conversionValue),
      currency,
    });

    return `${THANK_YOU_PATH}?${params.toString()}`;
  }

  return async function handleContactSubmit(event) {
    event.preventDefault();
    if (statusEl) {
      statusEl.textContent = MESSAGES.sending;
      statusEl.dataset.state = "sending";
    }

    const formData = new FormData(form);

    try {
      const response = await fetch(ENDPOINT, {
        method: "POST",
        mode: "cors",
        headers: {
          Accept: "application/json",
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Nie udało się wysłać wiadomości");
      }

      const result = await response.json();
      if (statusEl) {
        statusEl.innerHTML = result?.message ?? MESSAGES.fallback;
        statusEl.dataset.state = "success";
      }

      form.reset();
      window.location.assign(buildThankYouUrl(result));
    } catch (error) {
      console.error("Błąd formularza kontaktowego:", error);
      if (statusEl) {
        statusEl.textContent = MESSAGES.error;
        statusEl.dataset.state = "error";
      }
    }
  };
}

function initContactForm() {
  const form = document.getElementById("contactForm");
  if (!form) return;

  const statusEl = document.getElementById("contact-form-status");
  if (form.__contactFormHandler) {
    form.removeEventListener("submit", form.__contactFormHandler);
  }

  const handler = createSubmitHandler(form, statusEl);
  form.__contactFormHandler = handler;
  form.addEventListener("submit", handler);
}

function runContactFormInit() {
  initContactForm();
}

runContactFormInit();
document.addEventListener("DOMContentLoaded", runContactFormInit);
document.addEventListener("astro:page-load", runContactFormInit);
document.addEventListener("astro:after-swap", runContactFormInit);

