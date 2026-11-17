# Lokalne strony usługowe — wdrożone zmiany

## Dopracowanie wizualne

Style w `src/styles/local-landings.css` są ograniczone atrybutem `data-local-landing` do stron miast. Uporządkowano hierarchię pierwszego ekranu, kartę wykonawcy, odstępy sekcji zaufania, numerowane karty usług i etapy współpracy. Lokalna treść ma na komputerze układ dwóch kolumn, a formularz — ciemny panel wprowadzenia i jasny panel pól. Na telefonach sekcje układają się pionowo. Zachowano pomarańczowy akcent, typografię i działanie formularza. Ponowny build oraz testy przy 320, 390 i 1440 px przeszły pomyślnie.

## Routing i zakres

Repozytorium generuje 32 strony przez `src/pages/miasta/[slug].astro`, z Markdownów w `src/content/miasta/`. Slug nadal powstaje z istniejącego `title`, przez `slugifyTitle`. Zachowane są canonicale, metadane, indeksowalność i mechanizm sitemap.

**Istniejący adres w tym repo to `/miasta/strony-internetowe-pruszkow/`.** Nie znaleziono trasy ani przekierowania `/strony-internetowe-pruszkow/`. Nie dodano drugiego kompletu stron ani nie zmieniono routingu. Przed ustawieniem URL reklamy należy sprawdzić adres działający na opublikowanej witrynie; ewentualne reguły poza repozytorium nie były dostępne do weryfikacji.

Zmiana obejmuje: Białystok, Bydgoszcz, Bytom, Częstochowę, Gdańsk, Gdynię, Gliwice, Grójec, Janki, Katowice, Kielce, Kraków, Łódź, Lublin, Marki, Olsztyn, Opole, Otwock, Poznań, Pruszków, Radom, Rybnik, Rzeszów, Sochaczew, Sosnowiec, Szczecin, Toruń, Warkę, Warszawę, Wrocław, Zabrze i Żyrardów.

## Pliki

- `src/pages/miasta/[slug].astro`: wspólny układ, trzy realizacje, FAQ i formularz na stronie; bez bloga i map sugerujących lokalny punkt obsługi.
- `src/layouts/heroes/MiastaHero.astro`: jeden H1 z istniejącego dopełniacza `town`, zdjęcie wykonawcy, telefon i odnośniki do formularza oraz portfolio.
- `src/components/LocalServiceDetails.astro`, `src/data/local-landing.js`: zakres, proces, zasady wyceny, domyślne realizacje i pytania.
- `src/components/ContactForm.astro`, `src/scripts/contact-form.js`: wspólny formularz, walidacja, honeypot, stany wysyłania, błędu i przyjęcia; blokada wielokrotnego wysłania.
- `src/pages/kontakt/index.astro`: wykorzystanie tego samego formularza i mechanizmu pomiaru.
- `src/components/FaqList.astro`, `src/pages/faq/index.astro`: wyodrębniony istniejący mechanizm kart FAQ i danych strukturalnych, współdzielony ze stronami miast.
- `src/components/Header.astro`, `src/components/Footer.astro`, `src/layouts/BaseLayout.astro`: wariant lokalny nagłówka i stopki, dostęp do prywatności i cookies, jedna instancja ClientRouter.
- `src/components/home/{ClientsLogos,Testimonials,FeaturedWork}.astro`: wariant lokalny bez niepotwierdzonych statystyk, z prawdziwymi materiałami i opisami zakresu z portfolio. Pozostałe użycia zachowują dotychczasowe nagłówki.
- `src/scripts/google-ads.js`, `src/scripts/cookie-modal.js`: wspólny pomiar powiązany z istniejącymi zgodami.
- `src/pages/wyslano-wiadomosc/index.astro`: usunięty pomiar oparty na odwiedzinach/parametrach URL; strona nie potwierdza samym wejściem przyjęcia zgłoszenia, ma `noindex`.
- `src/content/config.ts`, `tina/config.ts`, `tina/tina-lock.json`: opcjonalne dane, pola edytora Tina i zaktualizowany schemat CMS.
- `src/content/miasta/*.md`: zastąpienie widocznych `{town}` istniejącą formą dopełniacza; bez zgadywania odmiany. Zachowane obszerne treści lokalne. W Pruszkowie i Warszawie usunięte rozbieżne stare ceny; termin w Warszawie uzależniony od uzgodnionego zakresu.
- `scripts/test-local-landings.mjs`: lokalna weryfikacja stron i pomiaru. `.gitignore`: pominięcie lokalnych zrzutów i logu builda.

Istniejąca zmiana użytkownika w `src/components/home/Offer.astro` pozostaje nietknięta. Nie było `AGENTS.md` w repo ani sprawdzonych katalogach nadrzędnych; README zawiera jedynie instrukcję instalacji.

Istniejące dane adresowe są niespójne: `/kontakt/` podaje Pruszków, a schemat Organization w BaseLayout — Warkę. Nie zmieniono adresu na podstawie domysłu i nie dodano lokalnych adresów do stron miast. Przed aktualizacją danych firmy trzeba potwierdzić właściwy adres.

## Dane i wartości domyślne

| Pole | Znaczenie | Brak wartości |
| --- | --- | --- |
| `town` | Istniejąca, wymagana forma dopełniacza | Nie wyprowadzamy odmiany z nazwy ani sluga |
| `lead` | Opcjonalne dodatkowe wprowadzenie | Brak dodatkowego akapitu; podstawowy opis współpracy pozostaje |
| `projects` | Lista nazw plików portfolio bez `.md` | Agencja ubezpieczeniowa, Zdalny Asystent, Centrum Rehabilitacji |
| `faq` | Lista obiektów `{title, answer}` | Sześć pytań wspólnych; lokalne pytania dodawane przed nimi |
| `maplink` | Zachowane dotychczasowe dane, obecnie opcjonalne | Bez mapy ani pustej sekcji; szablon nie osadza map |

Nieznane identyfikatory projektów są pomijane; zestaw uzupełniają istniejące realizacje. Niekompletne FAQ są pomijane. Te same pytania lokalne mają pierwszeństwo przed wspólnymi odpowiedziami.

Do formularza trafiają `source-page` (ścieżka bez query string), `city` (identyfikator pliku miasta wynikający z routingu) i `submission-id` (losowy UUID, bez danych osobowych). Na zwykłym kontakcie `city` jest pusty. UUID powstaje przed POST i pozostaje taki sam przy ponowieniu po błędzie.

## Formularz i ograniczenia hostingu

Pozostał Netlify Forms: nazwa `contact`, `form-name`, `method=POST`, `data-netlify`, adres powrotu. Dodany honeypot `bot-field`. Bez JavaScript działa natywny POST; nie nalicza wtedy konwersji. Przy JavaScript sukces wyświetlany jest na formularzu dopiero po poprawnej odpowiedzi HTTP na POST, zgodnie z [integracją AJAX Netlify Forms](https://docs.netlify.com/manage/forms/setup/).

W repo nie ma własnego backendu obsługującego ten formularz. Netlify zarządza odbiorem i filtrowaniem spamu; nie dodano pozornej walidacji serwerowej w przeglądarce. **Pola ukryte i UUID są niezaufaną deklaracją klienta**, nie dowodem tożsamości ani podpisanym potwierdzeniem serwera. Przy przyszłym webhooku/backendzie trzeba sprawdzać `city` i `source-page` względem listy istniejących tras. Nie używać ich do autoryzacji ani bezpośredniego renderowania HTML. Netlify nie zwraca swojego identyfikatora zgłoszenia w tym przepływie AJAX, dlatego UUID koreluje zgłoszenie z konwersją, ale nie jest identyfikatorem wygenerowanym przez serwer.

Lokalne testy nie potwierdzają aktywnego wykrywania formularzy, dostarczenia maila, klasyfikacji antyspamowej ani konfiguracji powiadomień w panelu Netlify. Po publikacji należy sprawdzić, że formularz `contact` zawiera nowe pola i że hosting faktycznie przyjmuje POST. Nie wysłano produkcyjnych wiadomości testowych.

## Pomiar i zgody

Jedyny tag to `AW-18067926091`, a konwersja to `AW-18067926091/kgjcCNis7ZYcEMvYuqdD`. Google ładuje się dopiero po zgodzie marketingowej. Domyślnie zgody są odrzucone; zmiana w istniejącym panelu aktualizuje Consent Mode. Wycofanie zgody blokuje dalsze konwersje. Brak zgody nie blokuje formularza i nie tworzy kolejki konwersji do późniejszego odtworzenia.

Zdarzenie powstaje wyłącznie po udanym POST. Parametry to `send_to` i `transaction_id`; wiadomość, e-mail, telefon i imię nie trafiają do parametrów pomiaru. UUID jest dodatkową [deduplikacją Google Ads](https://support.google.com/google-ads/answer/6386790). Kliknięcie CTA, błąd, bezpośredni URL podziękowania, odświeżenie i przejście ClientRouter nie tworzą konwersji.

## Weryfikacja lokalna

- `npm run build`: poprawny build, 32 miasta. Istniejące ostrzeżenia Astro dotyczą pustych kolekcji `posts`/`klienci` i eksportu `fontData` w zależności; nie blokują builda.
- `git diff --check`: brak błędów formatowania.
- Automatyczna kontrola wszystkich 32 stron: jeden H1, canonical, źródło formularza, brak `{town}`, przypadkowych awatarów i tekstu „Pruszków” na stronach innych miast.
- Przeglądarka: Pruszków, Warszawa, Janki, szerokości 320, 390 i 1440 px; odnośniki, indeksowanie, metadane, trzy realizacje, checkbox domyślnie pusty.
- Osobny tymczasowy build: Nowy Dwór Mazowiecki z `town: Nowego Dworu Mazowieckiego`, bez `lead`, `maplink`, `projects`, `faq`. Pełny szablon sprawdzony przy 390 i 1440 px. Plik testowy usunięty przed końcowym buildem; nie powstała dodatkowa strona do publikacji.
- Formularz: walidacja, HTTP 500, ponowienie z tym samym ID, podwójne wysłanie, sukces, brak danych osobowych w zdarzeniu, brak pomiaru bez zgody, przejścia między miastami, odświeżenie i wejście na podziękowanie z parametrami.
- Ruch POST oraz żądania Google są przechwycone lokalnie. Podgląd obrazów używa oryginalnych plików zamiast produkcyjnego przetwarzania Netlify Image CDN. Nie testowano Tag Assistant ani faktycznej atrybucji Google Ads.

Powtórzenie: `npm run build`, następnie `node scripts/test-local-landings.mjs` w środowisku z Playwright i Chromium. Jeśli biblioteka jest poza projektem, ustaw `PLAYWRIGHT_MODULE` na jej `index.mjs`; opcjonalnie `PLAYWRIGHT_EXECUTABLE` na istniejący plik Chromium. Skrypt nie dodaje zależności aplikacji. Zrzuty są w `.local-verification/` (pomijane przez Git).

## Test po publikacji w Tag Assistant

1. Otwórz opublikowany adres miasta w Tag Assistant, w czystej sesji bez blokowania reklam. Sprawdź też właściwy canonical i URL docelowy — w repo występuje prefiks `/miasta/`.
2. Przed zgodą marketingową i po jej odrzuceniu nie powinno być załadowanego Google tagu ani zdarzenia konwersji. W ustawieniach cookies zaakceptuj marketing; sprawdź jedną instalację `AW-18067926091` i aktualizację zgód.
3. Kliknij CTA, wywołaj błąd walidacji i otwórz bezpośrednio `/wyslano-wiadomosc/`. Żaden z tych kroków nie powinien wysłać konwersji.
4. Po uzgodnieniu rzeczywistego zgłoszenia testowego wyślij formularz raz. Sprawdź przyjęcie w panelu Netlify, `source-page`, `city` i `submission-id`. Dopiero ten test potwierdza hosting, a nie samą obecność kodu.
5. Sprawdź dokładnie jedną konwersję z etykietą `kgjcCNis7ZYcEMvYuqdD`; `transaction_id` ma odpowiadać `submission-id` z Netlify. W parametrach nie może być danych formularza.
6. Odśwież, wróć do strony, przejdź między miastami i otwórz podziękowanie. Nie może pojawić się ponowienie poprzedniej konwersji. Nowe, uzgodnione zgłoszenie powinno mieć inne ID.
7. Wycofaj zgodę marketingową i sprawdź jej aktualizację. Dalsze zgłoszenie może być przyjęte przez Netlify, ale nie powinno wysyłać konwersji. Awarię sieci/HTTP sprawdzaj na środowisku testowym bez ponawiania produkcyjnych wiadomości.

Nie opublikowano zmian, nie wykonano push i nie zmieniono kampanii Google Ads. Przypisanie strony docelowej do reklamy pozostaje osobną czynnością.
