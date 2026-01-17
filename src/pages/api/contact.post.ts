import type { APIRoute } from "astro";
import nodemailer from "nodemailer";

const CONTACT_EMAIL = "kontakt@przemekmiros.pl";

const createJsonResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });

const createErrorResponse = (message: string, status = 400) =>
  createJsonResponse({ error: message }, status);

const getTransporter = () => {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT) || 587;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    throw new Error("Brak ustawionych danych SMTP (SMTP_HOST/SMTP_USER/SMTP_PASS).");
  }

  return nodemailer.createTransport({
    host,
    port,
    auth: { user, pass },
    secure: port === 465,
  });
};

export const post: APIRoute = async ({ request }) => {
  const formData = await request.formData();
  const name = (formData.get("name") ?? "").toString().trim();
  const email = (formData.get("email") ?? "").toString().trim();
  const message = (formData.get("message") ?? "").toString().trim();
  const botField = (formData.get("bot-field") ?? "").toString().trim();

  if (botField) {
    return createErrorResponse("Spam detected", 422);
  }

  if (!name || !email || !message) {
    return createErrorResponse("Uzupełnij wszystkie pola formularza.");
  }

  let transporter;
  try {
    transporter = getTransporter();
  } catch (error) {
    console.error("[contact] Missing SMTP config:", error);
    return createErrorResponse("Brak konfiguracji SMTP.", 500);
  }

  const mailOptions = {
    from: `${name} <${email}>`,
    to: CONTACT_EMAIL,
    subject: `Kontakt ze strony: ${name}`,
    text: `${message}\n\nEmail: ${email}`,
    html: `<p><strong>Imię i nazwisko:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Treść wiadomości:</strong></p>
      <p>${message.replace(/\n/g, "<br/>")}</p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    return createJsonResponse({ message: "Wiadomość odebrana - dziękujemy za kontakt." });
  } catch (error) {
    console.error("[contact] Błąd wysyłki maila:", error);
    return createErrorResponse("Nie udało się wysłać wiadomości - spróbuj ponownie.", 502);
  }
};
