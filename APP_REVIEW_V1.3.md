# Przegląd aplikacji i wydanie 1.3

Przejrzano główne widoki, przejście wszystkich lekcji, powtórki, zapis, nawigację, grafiki i obsługę Androida. Kryteria interfejsu: [Web Interface Guidelines](https://github.com/vercel-labs/web-interface-guidelines), zastosowane do polskiego kursu mobilnego. Nie jest to certyfikat bezbłędności ani pełny audyt bezpieczeństwa.

## Znalezione problemy i poprawki

| Problem | Zmiana |
|---|---|
| Podgląd był małym dialogiem; opis zabierał miejsce, wysoka plansza nie mieściła się w całości. | Dialog zajmuje cały viewport. Obraz dopasowuje oba wymiary; opis i źródło są rozwijane. Android przechodzi w tryb immersyjny i przywraca paski po zamknięciu. |
| Stałe powiększenie nie zapewniało wygodnej kontroli szczegółów. | Zoom 100–600%, gest dwóch palców, przesuwanie jednym, przyciski +/−/Całość, klawisze +/−/0 i strzałki. Zmiana orientacji dopasowuje obraz. |
| Ryciny sarkomeru i jednostek motorycznych w bibliografii nie były klikalne. | Używają tego samego dostępnego podglądu co pozostałe obrazy rastrowe. |
| Alt ilustracji był wstawiany do HTML podglądu bez bezpiecznego kodowania cudzysłowów. | Podgląd klonuje element DOM; opis także zachowuje przypisanie źródeł. |
| Podgląd nie blokował przewijania tła ani jawnie nie przywracał pozycji/fokusu. | Modalność, blokada tła, zachowanie pozycji strony i powrót fokusu do przycisku ilustracji. |
| Wybranie odpowiedzi przebudowywało DOM i gubiło fokus klawiatury. | Zachowanie fokusu przy zmianie w tym samym kroku; nowy krok otrzymuje fokus nagłówka. Margines przewijania uwzględnia przycisk w stopce. |
| „Wyjdź” na wyniku powtórki zostawiało zakończoną sesję do ponownego otwarcia. | Usuwa zakończoną sesję; nowa próba zaczyna się od pytania. Wynik i termin pozostają zapisane tylko raz. |
| Definicje były dokładne, ale brakowało podpórek do zapamiętania nazw. | Wszystkie 20 części teorii mają co najmniej dwa skojarzenia z wyjaśnieniem i ograniczeniem analogii. Brak tych podpowiedzi podczas niezależnej powtórki. |
| Dokument źródłowy nadal nazywał kurs ośmiolekcyjnym. | Poprawiono nazwę do 10 lekcji i dodano podstawę anatomiczną nowych skojarzeń. |

## Podstawa treści

Kości i punkty orientacyjne sprawdzono w [OpenStax 8.2](https://openstax.org/books/anatomy-and-physiology-2e/pages/8-2-bones-of-the-upper-limb). Reszta wskazówek korzysta z istniejącej bibliografii poszczególnych lekcji. Przykłady „Ł jak łokieć”, „kciuk wskazuje promieniową” i „supinacja: nieś zupę” są autorskimi pomocami, nie tezami o etymologii ani metodą osobno zbadaną eksperymentalnie. Badania odtwarzania z pamięci i odstępów w nauce uzasadniają sprawdzanie wiedzy po czasie, nie dowodzą skuteczności każdego skojarzenia.

## Weryfikacja

- `tools/qa.mjs`: wszystkie 10 lekcji, błędy i ponowny przykład, zadania i modele, zapis tekstu, terminy powtórek, mały telefon/landscape/desktop; brak błędów JS i żądań zasobów.
- `tools/art-qa.mjs`: 92 widoki; dekodowanie 31 głównych ilustracji, zoom i zamykanie.
- `tools/navigation-qa.mjs`: cofanie z zachowaniem danych, rozdzielenie zamknięcia obrazu od kroku lekcji, brak podwójnego zaliczenia, pokrycie plansz wszystkich 20 części.
- `tools/review-qa.mjs` i `qa/review-v1.3.json`: rzeczywisty rozmiar pełnego viewportu, dopasowanie wysokiego/poziomego obrazu, zoom, pan, orientacja, klawiatura i fokus, dodatkowe źródłowe ryciny, zakończona powtórka oraz 20 zestawów skojarzeń.
- `qa/native/review-v1.3.json`: Android 15 offline, aktualizacja prawdziwego APK 1.2 → 1.3 zachowała krok 2/6; ukrycie i powrót pasków systemowych, prawdziwe zdarzenia multitouch, systemowe Wstecz, polska notatka po force-stop/restart. Przed force-stop test czekał 6 sekund na zapis WebView; natychmiastowego ubicia w trakcie zapisu nie gwarantujemy.

Android przy pierwszym użyciu trybu immersyjnego wyświetlił własną instrukcję z przyciskiem „Got it”. Zaakceptowano ją na izolowanym emulatorze przed testem Wstecz. Aplikacja nie wyłącza ani nie omija tego komunikatu systemowego.

Zachowano klucz podpisu, identyfikator pakietu i klucz lokalnego postępu. APK z wydania ma wyłączone debugowanie WebView. Nie przeprowadzono testu na fizycznym S24 Ultra; emulator i przeglądarka nie zastępują tego testu.
