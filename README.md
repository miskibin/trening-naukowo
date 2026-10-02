# Trening Naukowo

Osobista aplikacja Android po polsku: dziesięć lekcji anatomii funkcjonalnej, fizjologii wysiłku i rozumienia badań.

## Instalacja

Aktualny kod przygotowuje wersję 1.5. Opublikowane APK 1.4 nie zawiera jeszcze quizów i zastosowań opisanych poniżej.

[Pobierz APK 1.4](https://github.com/miskibin/trening-naukowo/releases/download/v1.4.0/TreningNaukowo-v1.4.apk) · [wydania](https://github.com/miskibin/trening-naukowo/releases).

Otwórz APK na telefonie i zainstaluj. Przy aktualizacji instaluj nad poprzednią wersją, bez odinstalowywania, aby zachować postęp. Konto i internet nie są potrzebne. Internet jest wymagany tylko do otwierania publikacji.

Oficjalne APK używają tego samego lokalnego klucza podpisu. Klucz nie jest publikowany; samodzielny build wygeneruje inny i nie zastąpi oficjalnej instalacji. Wyczyszczenie danych lub deinstalacja usuwa postęp.

## Nauka w wersji 1.5

- 20 części teorii, każda z konkretnym zastosowaniem: chwyt i technika ćwiczenia, moment siły, pauza, odpoczynek, zapis wyniku, skład posiłku lub ocena twierdzenia o treningu.
- Ilustracje stoją przy omawianym pojęciu. Pełny ekran powiększa ten sam fragment; działa zoom i przesuwanie.
- Sprawdzenie pojęcia i zastosowania oraz quiz końcowy: trzy pytania z kluczem i wyjaśnieniem odpowiedzi. Bez pytań otwartych, samooceny tekstu i oceniania odczuć.
- Powtórka używa innego zadania i dwóch innych pytań wiedzy. Termin wydłuża się po poprawnych pierwszych odpowiedziach; błąd nie staje się samodzielnym sukcesem po pokazaniu rozwiązania.
- Pierwsza powtórka po 24 godzinach; po udanych próbach odstępy 3, 7, 14 i 30 dni, po błędzie jeden dzień. To reguła kursu.
- Wstecz wraca także do poprzedniego pytania w quizie. Wyjdź zapisuje miejsce, odpowiedź i kolejność opcji. Wstecz najpierw zamyka obraz.
- Aktualizacja zapisów 1.4 zachowuje ukończone lekcje, terminy, historię i wcześniejsze odpowiedzi. Niedokończona samoocena przechodzi na quiz, a nieoceniana obserwacja ruchu na zadanie z kluczem.

## Treść i weryfikacja

[CONTENT_REVIEW_V1.5.md](CONTENT_REVIEW_V1.5.md) opisuje zmianę i jej zakres. [AGENTS.md](AGENTS.md) wymaga dwóch przeglądów każdego akapitu: nowa informacja lub praktyczna umiejętność, następnie kontrola powtórzeń na całej stronie. [SOURCES.md](SOURCES.md) dokumentuje podstawy treści.

`tools/qa.mjs` przechodzi wszystkie lekcje i powtórki przez interfejs. `tools/navigation-qa.mjs` sprawdza aktualizację dawnych zapisów, cofanie, zapis odpowiedzi i ochronę przed podwójnym zaliczeniem. Wyniki są w `qa/knowledge-v1.5.json` i `qa/navigation-v1.5.json`.

Raporty 1.4 i starsze pozostają historią wcześniejszych wydań. Testy obecnej zmiany dotyczą interfejsu WebView w przeglądarce; nie zastępują sprawdzenia nowego APK na fizycznym Samsungu Galaxy S24 Ultra.

## Budowanie

Zainstalowane Android SDK i JDK wystarczają, bez Gradle i pobierania bibliotek:

```powershell
.\build.ps1
node tools/dev-server.mjs
node tools/qa.mjs
node tools/navigation-qa.mjs
```

Podgląd: `http://127.0.0.1:8974`. Playwright może użyć zainstalowanej przeglądarki lub ścieżki z `PLAYWRIGHT_EXECUTABLE_PATH`. Runtime Codex jest wykrywany przez `CODEX_PRIMARY_RUNTIME_NODE_MODULES`. Szczegóły: [README-build.md](README-build.md).