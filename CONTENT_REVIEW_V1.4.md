# Przegląd treści i ilustracji — wersja 1.4

## Problem i zmiana konstrukcji

W 1.3 tę samą informację przedstawiano w planszy, podpisie, słowniczku, skojarzeniu i akapicie. Testy potwierdzały obecność tych warstw, lecz nie oceniały, czy uczą bez powtórzeń. W 1.4 zastąpiono je jednym uporządkowanym objaśnieniem. `teaching.js` jest jedynym źródłem tekstu teorii; stare akapity usunięto z `lessons.js`, a `mnemonics.js` wycofano.

Pojęcie jest zdefiniowane tam, gdzie jest potrzebne. Ilustracja następuje po odpowiednim akapicie. Podpis służy odczytaniu rysunku: orientacja, legenda, skala. Krótkie skojarzenia przy wybranych pojęciach są opcjonalnym rozwinięciem. Bibliografia pozostaje schowana. Quiz, własne wyjaśnienie, start i podsumowanie nie zawierają ozdobnych obrazków.

Wydzielono pojedyncze panele bez zmiany źródłowych plików. Pełny ekran powiększa ten sam panel. Rekrutacja i częstość impulsów, początek i koniec bicepsa, piersiowy i triceps, nadnercze i oś tarczycy są pokazane osobno. Wąską pionową oś tarczycy ograniczono do wysokości odpowiedniej dla telefonu; szczegóły pozostają dostępne w powiększeniu.

## Kontrola merytoryczna

- Wycofano planszę `fuel-labelled`: rozgałęzienie glikogenu sugerowało obecność we krwi. Nowy rysunek `glycogen-cell-v1.4.png` pokazuje zapas wewnątrz cytoplazmy. Kulki są symbolami jednostek glukozy, nie wzorem atomowym. Rola wątroby i mięśnia jest porównana w tekście.
- Wycofano panele hipertrofii z `adaptation-labelled`: podpis „to samo włókno” nie odpowiadał wyglądowi przekroju. Używany jest tylko panel syntezy/rozkładu i osobny panel pompy. Hipertrofia jest zdefiniowana tekstowo, bez niewiarygodnej ilustracji przekroju.
- Wycofano `metabolism-labelled` z teorii. Trzy drogi ATP są opisane w osobnych krótkich wierszach. Glikoliza jest przypisana do cytoplazmy, przemiany tlenowe do mitochondriów; systemy współdziałają od początku, bez fikcyjnych ostrych przełączeń.
- Odróżniono pobudzenie, wiązanie wapnia z troponiną, odsłonięcie aktyny i cykl mostka. Przyłączenie ATP odłącza miozynę; pompowanie wapnia również wymaga ATP. Poprawiono podpis orientacji: stany na rycinie są po lewej i prawej.
- Odróżniono rozpoznanie spadku prędkości od pomiaru przyczyn. Pi, regulacja wapnia i sterowanie nerwowe mają kontekst, bez twierdzenia, że ATP w całym mięśniu musi spaść do zera.
- Doprecyzowano promieniową po stronie kciuka, łokciową po stronie małego palca, znaczenie wyrostka łokciowego oraz guzowatości poniżej głowy i szyjki promieniowej. Skojarzenie z łokciem nie sugeruje, że promieniowa nie tworzy stawu łokciowego.
- Oddzielono przyczepy ramiennego i ramienno-promieniowego, bez ilustracji sugerującej izolację mięśnia samym chwytem.
- Dla hormonów określono źródło sygnału i tkankę docelową. Glukagon nie jest uniwersalnym przełącznikiem glikogenu mięśniowego. Receptor błonowy jest fioletowy, wewnętrzny turkusowy; ligandy na rycinie są pomarańczowe.
- Nowy `hpg-feedback-v1.4.png` przedstawia jedną oś z hamowaniem dwóch wcześniejszych pięter, bez fragmentów sąsiednich rycin. Testosteron i estradiol uczestniczą w sprzężeniu; przewidywanie odpowiedzi zakłada sprawność narządów.
- Usunięto zdjęcie snu jako rzekomą ilustrację wyniku eksperymentu. Zachowano konkretny protokół i granice wniosku zamiast ogólnej obietnicy hipertrofii.

### Zakres badań

[West i wsp.](https://pubmed.ncbi.nlm.nih.gov/19910330/): 15-tygodniowy protokół nie wykazał dodatkowej hipertrofii/siły trenowanych zginaczy wskutek większej ostrej odpowiedzi hormonalnej. To nie dowód braku znaczenia hormonów w biologii.

[Damas i wsp.](https://pmc.ncbi.nlm.nih.gov/articles/PMC5023708/): w 10-tygodniowym treningu związek zintegrowanej syntezy białek z hipertrofią był widoczny po osłabieniu uszkodzeń. Wczesny pojedynczy wskaźnik nie zastępuje pomiaru wzrostu.

[Lamon i wsp.](https://pmc.ncbi.nlm.nih.gov/articles/PMC7785053/): 13 młodych dorosłych, badanie krzyżowe, jedna noc całkowitego pozbawienia snu i ostry pomiar syntezy białek. Nie badano przyrostu mięśni po miesiącach ani skrócenia snu o godzinę.

[Baker i wsp.](https://pmc.ncbi.nlm.nih.gov/articles/PMC3005844/) i [Allen i wsp.](https://pubmed.ncbi.nlm.nih.gov/18195089/) dostarczają kontekstu dla współpracy systemów ATP i wieloczynnikowego zmęczenia. Podstawy przyczepów, skurczu i osi hormonalnych pochodzą z podręczników przypisanych w `SOURCE`.

[Roediger i Karpicke](https://pubmed.ncbi.nlm.nih.gov/16507066/) oraz [Cepeda i wsp.](https://pubmed.ncbi.nlm.nih.gov/16719566/) wspierają odtwarzanie i rozłożenie nauki w czasie. Nie testowali konkretnego terminarza aplikacji. Brak istotnej różnicy statystycznej nie jest utożsamiany z dowodem równoważności.

## Przypisanie wizualne

| Lekcja | Pierwsza część | Druga część |
|---|---|---|
| Biceps | obrót dłoni; obrót kości | dwa początki; guzowatość; ramienny; ramienno-promieniowy, oddzielnie |
| Moment | oś, linia siły i ramię w jednym modelu | piersiowy i triceps, oddzielnie |
| Sarkomer | porównanie nakładania filamentów | wapń oraz cykl mostka, oddzielnie |
| Jednostki | jedna jednostka; rozmieszczenie włókien w mięśniu | rekrutacja oraz częstość, oddzielnie |
| Energia | mitochondria między miofibrylami | tylko omawiany wykres prędkości |
| Substraty | glikogen wewnątrz komórki | rybosom; jedna reakcja odbudowy PCr |
| Adaptacja | tworzenie i rozkład białek | naczynie i pompa, bez fałszywego przekroju hipertrofii |
| HPG | lokalizacja struktur; komórki Leydiga | sama oś z hamowaniem zwrotnym |
| Sygnały | dwa położenia receptora; trzustka | nadnercze; sama oś tarczycy |
| Badania | możliwa wspólna przyczyna | czas pomiaru efektu; czas testu pamięci, oddzielnie |

## Grafiki wygenerowane w tym wydaniu

Użyto wbudowanego narzędzia `image_gen` zgodnie ze skillem `imagegen`, bez API/CLI i bez zewnętrznego zadania GPU. Pliki projektu:

- `android/app/src/main/assets/images/art/hpg-feedback-v1.4.png`; pełny prompt: [tools/hpg-feedback-v1.4-prompt.txt](tools/hpg-feedback-v1.4-prompt.txt).
- `android/app/src/main/assets/images/art/glycogen-cell-v1.4.png`; pełny prompt: [tools/glycogen-cell-v1.4-prompt.txt](tools/glycogen-cell-v1.4-prompt.txt).

Sprawdzono napisy, kierunki strzałek, rozdzielenie wnętrza i otoczenia komórki oraz zgodność z celem ilustracji. Są to schematyczne rysunki dydaktyczne, nie zdjęcia preparatów. Przegląd autora aplikacji nie zastępuje niezależnej oceny anatomisty.

## Weryfikacja

`qa/editorial-v1.3-baseline.json` i `qa/editorial-v1.4.json` zawierają rzeczywisty tekst widoczny na 20 stronach. Porównanie nie obejmuje rozwiniętej bibliografii i schowanych podpowiedzi. Spadek liczby słów dokumentuje ograniczenie warstw; sam nie dowodzi jakości dydaktycznej.

Przejście przez wszystkie lekcje, korekty po błędzie i powtórki: `qa/report.json`. Cofanie z danymi: `qa/navigation-v1.4.json`. Kontekst 30 paneli, rzeczywiste granice obrazów, dopasowanie i zachowanie wybranego panelu w viewerze: `qa/editorial-v1.4.json`. Zrzuty paneli sprawdzono wizualnie; testy techniczne nie oceniają anatomii.

Android 15 w trybie samolotowym: `qa/native/review-v1.4.json` potwierdza aktualizację rzeczywistego wydania 1.3, zachowanie kroku, ukrycie pasków, rzeczywisty gest dwóch palców, zamknięcie obrazu przez Wstecz, odtworzenie notatki po wymuszonym zamknięciu i dekodowanie ilustracji wszystkich 20 części. Przed zabiciem procesu odczekano 6 sekund na zapis; nie jest to test odporności na natychmiastowe przerwanie zapisu. Końcowe nowe grafiki i panele sprawdzono ponownie w `qa/native/final-content-v1.4.json`. Zainstalowano też końcowe APK bez debugowania: `qa/release-v1.4.json` potwierdza wersję 1.4.0/code 5, zachowany certyfikat, brak socketu debugowania WebView i pracę offline. `qa/final-asset-verification-v1.4.json` potwierdza identyczność wszystkich 47 zasobów z dostarczonym pakietem.