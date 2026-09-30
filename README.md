# Trening Naukowo

Osobista aplikacja Android po polsku: dziesięć lekcji anatomii funkcjonalnej, fizjologii wysiłku i rozumienia badań. Projekt przygotowany dla telefonu o wymiarach ekranu Samsunga Galaxy S24 Ultra.

## Instalacja

Gotowy pakiet: [pobierz APK z GitHub Releases](https://github.com/miskibin/trening-naukowo/releases/latest/download/TreningNaukowo-v1.2.apk). Strona wydania: [Releases](https://github.com/miskibin/trening-naukowo/releases).

1. Przenieś plik APK na telefon, np. przewodem USB.
2. Otwórz APK na telefonie i pozwól wybranej aplikacji na instalowanie z tego źródła, jeśli Android o to poprosi.
3. Zainstaluj i otwórz **Trening Naukowo**. Konto i internet nie są potrzebne.

Przy aktualizacji instaluj APK nad poprzednią wersją, bez odinstalowywania. Wersje z tego projektu używają tego samego lokalnego klucza podpisu. Wyczyszczenie danych lub odinstalowanie usuwa postęp; pierwsza wersja nie eksportuje kopii zapasowej.

Kod i dokumentacja są w repozytorium; pliki APK i ich sumy SHA-256 są załącznikami wydania. Lokalny klucz podpisu nie jest publikowany. Samodzielny build wygeneruje inny klucz, więc nie zastąpi zainstalowanego oficjalnego APK bez zachowania oryginalnego klucza.

## Co działa

- Kolejny krok kursu wynika z wcześniejszych pojęć. Lekcje nie zawierają pustych tematów.
- Teoria, pytania z wiarygodnymi nieporozumieniami, układanie procesu, wskazanie struktury, interpretacja wykresu i samodzielne wyjaśnienie.
- Po błędzie: wyjaśnienie mechanizmu i przykład do ponownego zastosowania.
- Modele momentu siły, sarkomeru, jednostek motorycznych i sprzężenia hormonalnego: przewidywanie, zmiana warunku oraz interpretacja.
- Lekki ruch przedramienia na siedząco można zastąpić obserwacją. Subiektywne odczucie nie jest oceniane.
- Strzałka i systemowe Wstecz cofają o krok z zachowaniem odpowiedzi, obserwacji i notatki. Osobny przycisk Wyjdź zapisuje miejsce.
- Każdy krok i wpisany tekst zapisują się lokalnie. Przerwaną lekcję można kontynuować.
- Ukończenie lekcji i powodzenie powtórki po czasie to odrębne dane. Wcześniejsza próba nie przesuwa terminu. Błąd w pierwszej odpowiedzi albo niepełne wyjaśnienie daje powrót następnego dnia.
- Pierwsza powtórka po 24 godzinach; kolejne po udanych próbach: 3, 7, 14 i 30 dni. To jawna reguła dydaktyczna, nie dowód indywidualnej optymalizacji.
- Każda część lekcji i powtórki ma ilustrację; dotknięcie otwiera powiększenie. Cały kurs, 27 wygenerowanych ilustracji i 8 ilustracji źródłowych znajdują się w APK. Linki do publikacji otwierają przeglądarkę i wymagają internetu.

## Źródła i ilustracje

Bibliografia i ograniczenia przy każdej lekcji są dostępne po rozwinięciu. Dodatkowa notatka badawcza: `SOURCES.md`. Tekst jest autorskim opracowaniem wiedzy z podręczników, badań i przeglądów; nie kopiowano treści mockupów.

W wersji 1.2 każda z 20 części teorii ma widoczne plansze uczące struktur oraz objaśnienia podpisów. Dodano 11 podpisanych plansz: początki i zakończenie bicepsa, trzy zginacze łokcia, piersiowy i triceps, wapń–ATP, jednostki motoryczne, metabolizm, składniki pokarmowe, przebudowa, oś HPG, gruczoły oraz rozumienie badań. Osobne zbliżenie kości promieniowej odróżnia głowę, szyjkę i guzowatość.

Prompty i zakres: `ARTWORK.md`, `tools/art-manifest-v1.2.json`; specyfikacja wszystkich części: `VISUAL_TEACHING_SPEC.md`. Błędne warianty przyczepu piersiowego odrzucono i zastąpiono zbliżeniem poprawionym po kontroli anatomii. W pytaniach nadal są obrazy bez podpisów odpowiedzi. Wykres prędkości jest modelowy.

Zewnętrzne ilustracje: OpenStax oraz Casey Henley (Michigan State University), CC BY-NC-SA 4.0; dodatkowa rycina przyczepu bicepsa: Elgendy i wsp., Cureus (2025), CC BY 4.0. Dodatkowo DrJanaOfficial, CC BY-SA 4.0 (bliższa kość promieniowa) i Gray (1918), domena publiczna. Szczegółowe przypisania i licencje: `android/app/src/main/assets/images/reference/GRAPHICS.md` oraz `android/app/src/main/assets/images/GRAPHICS.md`, również przy ilustracjach w aplikacji. Ryciny zachowano bez zmian. Ilustracje nie zastępują pełnego atlasu anatomicznego.

## Weryfikacja

`qa/report.json` zapisuje wynik przejścia wszystkich dziesięciu lekcji w przeglądarce. Test objął błędne odpowiedzi, dodatkowy przykład, pominięcie ruchu, odtworzenie zapisanego kroku i tekstu po reloadzie, powtórkę przed terminem i po terminie oraz różne szerokości ekranu. Zrzuty są w `qa/`.

`qa/art/report.json` sprawdza ilustracje w 60 częściach lekcji i 30 częściach powtórek oraz dwa układy ekranu. Wszystkie 31 ilustracji używanych w głównych widokach załadowało się; powiększenie i cofanie działają. Zrzuty obu części teorii dla każdego tematu są w `qa/art/`. `qa/navigation-v1.2.json` potwierdza cofanie z zachowaniem danych, zamykanie obrazu przed cofaniem kroku oraz brak podwójnego zaliczenia powtórki.

Weryfikacja wersji 1.1: `qa/native/native-check-v1.1.json` potwierdza dekodowanie wszystkich 20 obrazów z APK na Androidzie 15 w trybie samolotowym, powiększanie i zamykanie obrazu fizycznym przyciskiem Wstecz. `qa/native/v1-update-v1.1.json` potwierdza zachowanie lekcji przy aktualizacji z prawdziwego APK 1.0. `qa/native/text-restart-v1.1.json` potwierdza dokładne zachowanie polskiej notatki po wymuszonym zamknięciu. `qa/native/keyboard-v1.1.json` potwierdza dopasowanie obszaru aplikacji i przycisk nad klawiaturą. Końcowy podpis, identyczność wszystkich 27 zasobów i sprzątanie własnego emulatora: `qa/release-verification-v1.1.txt`. Starsze raporty zachowano osobno.

Nie wykonano testu na fizycznym Samsungu Galaxy S24 Ultra. Tekstowe wyjaśnienia są oceniane przez użytkownika według pokazanych kryteriów; nie ma automatycznego oceniania znaczenia tekstu. Aplikacja edukuje, nie diagnozuje i nie zaleca terapii.

## Budowanie i lokalne QA

Zainstalowane narzędzia Android SDK i JDK wystarczają; bez Gradle i pobierania bibliotek:

```powershell
.\build.ps1
node tools/dev-server.mjs
node tools/qa.mjs
```

Podgląd działa wyłącznie na `http://127.0.0.1:8974`. Testy Playwright korzystają z lokalnego pakietu runtime Codex i Chrome — jego ścieżkę można dostosować w `tools/qa.mjs`. Szczegóły budowania: `README-build.md`.
