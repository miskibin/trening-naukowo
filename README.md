# Trening Naukowo

Osobista aplikacja Android po polsku: dziesięć lekcji anatomii funkcjonalnej, fizjologii wysiłku i rozumienia badań.

## Instalacja

[Pobierz APK 1.4](https://github.com/miskibin/trening-naukowo/releases/download/v1.4.0/TreningNaukowo-v1.4.apk) · [wydania](https://github.com/miskibin/trening-naukowo/releases).

Otwórz APK na telefonie i zainstaluj. Przy aktualizacji instaluj nad poprzednią wersją, bez odinstalowywania, aby zachować postęp. Konto i internet nie są potrzebne. Internet jest wymagany tylko do otwierania publikacji.

Oficjalne APK używają tego samego lokalnego klucza podpisu. Klucz nie jest publikowany; samodzielny build wygeneruje inny i nie zastąpi oficjalnej instalacji. Wyczyszczenie danych lub deinstalacja usuwa postęp.

## Nauka

- 20 części teorii: jedno wyjaśnienie danego zagadnienia, ilustracja przy właściwym akapicie. Skojarzenia są krótkie i opcjonalne.
- Ilustracje pokazują pojedynczy temat. Dotknięcie otwiera ten sam fragment na pełnym ekranie; dostępne są zoom, przesuwanie i gest dwóch palców.
- Sprawdzenie, układanie procesu, interpretacja wykresu, interaktywne modele i samodzielne wyjaśnienie. Quiz nie jest ozdobiony przypadkowym obrazkiem.
- Po błędzie pojawia się wyjaśnienie i kolejny przykład. Odczucia w lekkim zadaniu ruchowym nie są oceniane; ruch można zastąpić obserwacją.
- Strzałka i systemowe Wstecz cofają o krok z zachowaniem danych. Wyjdź zapisuje miejsce. Systemowe Wstecz najpierw zamyka obraz.
- Pierwsza powtórka po 24 godzinach. Kolejne po udanych niezależnych próbach: 3, 7, 14 i 30 dni; po błędzie lub niepełnym wyjaśnieniu — następnego dnia. To reguła dydaktyczna, nie indywidualnie zweryfikowana optymalizacja. Wyjaśnienie ocenia użytkownik według kryteriów.

## Treść i ilustracje

[Przegląd wersji 1.4](CONTENT_REVIEW_V1.4.md) opisuje korekty merytoryczne, ograniczenie powtórzeń, przypisanie ilustracji do pojęć i zakres weryfikacji. [SOURCES.md](SOURCES.md) zawiera notatki o badaniach. [ARTWORK.md](ARTWORK.md) dokumentuje grafiki i prompty. Źródła i granice wniosków z eksperymentów są także w aplikacji.

Wersja 1.4 zastępuje rozbudowane słowniczki, skojarzenia i powtórzone akapity z 1.3. Rysunki źródłowe OpenStax oraz Casey Henley (MSU) mają przypisanie autorstwa w opisie pełnoekranowym. Pozostałe ilustracje są wygenerowanymi uproszczeniami, nie pomiarami ani pełnym atlasem.

## Weryfikacja

- `qa/report.json`: wszystkie 10 lekcji przez interfejs, błędy i poprawki, postęp, powtórki, różne rozmiary ekranu.
- `qa/navigation-v1.4.json`: cofanie, zachowanie odpowiedzi/notatki i ochrona przed podwójnym zaliczeniem.
- `qa/editorial-v1.4.json`: 20 części, kontekst ilustracji, granice wybranych paneli oraz zachowanie tego samego panelu na pełnym ekranie.
- `qa/editorial/report.json`: 92 widoki i dekodowanie używanych ilustracji.
- `qa/native/review-v1.4.json`: Android 15 offline, aktualizacja rzeczywistego APK 1.3 z zachowaniem kroku, pełny ekran, rzeczywisty pinch, Wstecz i notatka po restarcie. Przed wymuszonym zamknięciem odczekano 6 sekund na zapis.
- Raporty starszych wydań zachowano jako historię. Ich kryterium „obraz na każdym ekranie” zostało wycofane w 1.4.

Testy techniczne nie potwierdzają poprawności anatomii. Treść i dobór paneli przejrzano osobno; zakres i źródła opisano w przeglądzie. Nie testowano na fizycznym Samsungu Galaxy S24 Ultra.

## Budowanie

Zainstalowane Android SDK i JDK wystarczają, bez Gradle i pobierania bibliotek:

```powershell
.\build.ps1
node tools/dev-server.mjs
node tools/qa.mjs
node tools/navigation-qa.mjs
node tools/art-qa.mjs
node tools/editorial-qa.mjs
```

Podgląd: `http://127.0.0.1:8974`. Playwright korzysta z lokalnego runtime Codex i Chrome; ścieżka jest w skryptach QA. Szczegóły: [README-build.md](README-build.md).