# Astro Starter Kit: Minimal

## Konfiguracja kontaktu

- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` – dane serwera SMTP, który wysyła maile z formularza kontaktowego.
- `SMTP_PORT` domyślnie 587, ale możesz użyć 465 (w takim przypadku w kodzie zaznaczamy `secure` jako `true`).
- Warto podczas rozwoju korzystać z narzędzi typu Mailtrap, lokalnego `maildev` albo z konta SMTP (np. Gmail z hasłem aplikacji) i podkładać zmienne przed uruchomieniem `npm run dev`.

Przykład uruchomienia (`PowerShell`):  
```powershell
$env:SMTP_HOST="smtp.mailtrap.io"
$env:SMTP_PORT="587"
$env:SMTP_USER="kontakt@futurewebstudio.pl"
$env:SMTP_PASS="xxxxxxxxxx"
npm run dev
```
