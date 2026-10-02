# Treść i quizy — przygotowanie wersji 1.5

## Co się zmieniło

Ekran swobodnego wyjaśnienia z samooceną zastąpiono quizem trzech pytań. Każde ma jednoznaczny klucz i wyjaśnienie. Powtórka obejmuje dotychczasowe zadanie na innym przykładzie oraz dwa inne pytania wiedzy. W `knowledge.js` jest 50 nowych pytań: 30 kończących lekcje i 20 przeznaczonych do powtórek.

Pytania dotyczą anatomii, nazw i kolejności procesów, roli składników, prostych obliczeń oraz rozpoznania rodzaju pracy mięśnia. Usunięto nieoceniane pytanie o odczucia w ruchu, pytania otwarte i ogólną instrukcję przerwania zadania. Biceps ma teraz zadanie z kluczem rozróżniające ruch kości przedramienia.

Każda z 20 części teorii ma jedno zastosowanie z `applications.js`. Przykłady dotyczą m.in. uginania z obrotem, ustawienia nadgarstka, wariantów chwytu, zmiany dźwigni we wznosach, pauzy, opuszczania ciężaru, przerw między seriami, odczytu etykiety i porównywania osiągów. Stanowią zastosowania mechanizmów, a nie indywidualnie zweryfikowany plan treningowy.

Usunięto nieużywane wnioski końcowe dublujące teorię. Podsumowanie pokazuje faktyczny wynik quizu i termin następnego sprawdzenia. Wyjaśnienia błędnych odpowiedzi wskazują poprawną odpowiedź zamiast samego ogólnego komunikatu.

`AGENTS.md` wymaga sprawdzenia każdego akapitu przed jego dodaniem i ponownie w kontekście całej strony. Treść musi wnosić nową informację, przykład lub decyzję. Osobno określono reguły ilustracji, sprawdzalności quizu i unikania pustych haseł.

## Granice wniosków

- Rozróżnienie supinacji, pronacji i zgięcia nadgarstka opiera się na OpenStax, rozdziale 9.5; przyczepy na rozdziałach 8.2 i 11.5. Zmiana chwytu nie jest przedstawiana jako izolacja jednego mięśnia ani jako dowód większej hipertrofii.
- Rodzaje skurczu i jednostki motoryczne: OpenStax 10.3–10.4. Przykłady pauzy i opuszczania ciężaru są przełożeniem tych definicji na ćwiczenie.
- Mechanika dźwigni: OpenStax University Physics 10.6. Przykłady porównują zewnętrzny moment ciężaru; nie obliczają siły konkretnego mięśnia.
- Przykłady odpoczynku opierają się na współpracy systemów ATP i wieloczynnikowym zmęczeniu opisanym przez Bakera i Allena. Poprawa po przerwie nie identyfikuje jednej przyczyny.
- Szacowany zapas powtórzeń jest zapisem wysiłku, nie pomiarem rekrutacji neuronów. Porównywanie warunków testu jest zastosowaniem metodologii pomiaru, a nie gwarancją wyników programu.
- Wniosek hormonalny dotyczy opisanego protokołu Westa, nie całej biologii hormonów. Przykłady reklam nie ustalają skuteczności żadnego konkretnego produktu.
- Liczby dotyczące etykiety odżywki i przyrostu w hipotetycznych grupach są przykładami obliczeń, nie wynikami pomiarów.

## Postęp i aktualizacja

Klucz zapisu `trening-naukowo-v1` pozostaje ten sam. Format stanu 2 zachowuje ukończone lekcje, daty, terminy, historię powtórek, wcześniejsze oceny i ustawienia modeli. Dawny niedokończony krok samooceny oraz ekran zakończenia wracają do quizu wiedzy. Obserwacja ruchu bez klucza nie jest uznawana za poprawną odpowiedź na nowe zadanie.

Wstecz w quizie wraca do poprzedniego pytania z zachowaniem wyboru i oceny. Wyjście i restart zachowują także wylosowaną kolejność opcji. Dawne zapisane notatki pozostają w istniejącym stanie jako dane historyczne; aktualny interfejs nie prosi o nowe otwarte odpowiedzi.

Samodzielny sukces powtórki wymaga poprawnego pierwszego zadania i obu odpowiedzi wiedzy. Korekta po błędzie nie kasuje faktu pierwszej błędnej odpowiedzi. Wcześniejsza próba nie zmienia terminu, a ukończona powtórka nie zapisuje się dwa razy.

## Weryfikacja

- `qa/knowledge-v1.5.json`: przejście wszystkich 10 lekcji i 10 powtórek przez interfejs; błędne odpowiedzi i korekta, wynik quizu, zachowanie wyboru i kolejności po restarcie, terminy po sukcesie i błędzie, brak otwartych pytań, błędów JS i brakujących zasobów; szerokości 360, 412, 892 i 1280 px.
- `qa/navigation-v1.5.json`: migracja poprzednich zapisów, brak zaliczenia samej dawnej obserwacji, ochrona przed pominięciem quizu i ponownym zapisem powtórki, cofanie, pełnoekranowa ilustracja oraz 20 zastosowań przy teorii.
- Zrzut `qa/practical-biceps-v1.5.png` sprawdzono wizualnie. Ilustracje nie zostały zmienione.

Testy wykonano na treści WebView w Chromium. Nie zbudowano i nie sprawdzono nowego APK ani instalacji na fizycznym telefonie. Ostatnie opublikowane APK pozostaje 1.4. Aby zachować możliwość aktualizacji nad nim, build 1.5 wymaga oryginalnego klucza `android/build/debug.keystore`, który nie jest przechowywany w repozytorium.
