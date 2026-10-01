# Ilustracje wersji 1.2

12 nowych podpisanych plansz wygenerowano wbudowanym `image_gen`, bez Qwen/sfgpu. Jedenaście plansz ma 1024 × 1536 px; porównanie kości `rotation-labelled.png` ma 1536 × 1024 px. Pliki PNG: `android/app/src/main/assets/images/art/*-labelled.png`, `biceps-attachments.png`, `elbow-muscles.png`, `press-attachments.png`, `calcium-atp.png`. Prompty: [art-manifest-v1.2.json](tools/art-manifest-v1.2.json).

Wszystkie 20 części teorii przedstawiają strukturę lub mechanizm na widocznej planszy i definiują podpisy po polsku. Guzowatość jest pokazana jako wypukłość kości poniżej głowy/szyjki, a nie mięsień. Oryginalna rycina kości promieniowej jest obok jako odniesienie.

Kontrola anatomiczna odrzuciła dwa warianty z za niskim przyczepem piersiowego. Końcowy wariant przedstawia zbliżenie bruzdy międzyguzkowej bliższej ramiennej i poprawny przyczep na jej wardze bocznej. Diagramy komórkowe są jakościowe, symbole cząsteczek nie są wzorami strukturalnymi. Ikona glikogenu ilustruje rozgałęzienie; zapis jest wewnątrz komórek, nie we krwi. Osie czasu w planszy badań nie przedstawiają związku przyczynowego między hormonem a hipertrofią.

Specyfikacja: [VISUAL_TEACHING_SPEC.md](VISUAL_TEACHING_SPEC.md). Ryciny źródłowe i licencje: [reference/GRAPHICS.md](android/app/src/main/assets/images/reference/GRAPHICS.md). Kontrola widoków i nawigacji: [qa/art/report.json](qa/art/report.json), [qa/navigation-v1.2.json](qa/navigation-v1.2.json).

## Historia 1.1

# Ilustracje wersji 1.1

16 nowych plansz wygenerowano wbudowanym narzędziem `image_gen`. Nie używano modelu Qwen ani usług sfgpu. Wybrane oryginały PNG są w `android/app/src/main/assets/images/art/`; każda ma 1536 × 1024 px. Wszystkie są dołączone do APK i dostępne offline.

Zestaw promptów i wybranych plików zapisano w [art-manifest-v1.1.json](tools/art-manifest-v1.1.json). Planszę `fuel.png` poprawiono osobnym wywołaniem edycji: usunięto centralne jądra w przekroju włókien mięśniowych, zachowując prawidłowe centralne jądra hepatocytów. Pierwszy wygenerowany wariant porównania kości odrzucono, ponieważ nie przedstawiał wyraźnie krzyżowania promieniowej przy nawracaniu.

Każda z 60 części lekcji i 30 części powtórek zawiera ilustrację. Obrazy można powiększyć, przewijać w poziomie i zamknąć przyciskiem Wstecz. W sprawdzeniu i własnym wyjaśnieniu używane są wersje bez podpisów odpowiedzi; przy jednostkach motorycznych pozostaje neutralny obraz budowy mięśnia, aby nie pokazywać definicji jednostki. Ilustracje są używane ponownie tam, gdzie wyjaśniają ten sam temat.

Rastry są uproszczonym kontekstem, nie pomiarami ani atlasem przyczepów. Dokładne relacje, wzory i kierunki sprzężeń przedstawiają podpisany tekst oraz osobne modele. Przegląd naukowy i ograniczenia podpisów zapisano w [ART_QA.md](ART_QA.md). Bibliografia pozostaje przy każdej lekcji; patrz również [SOURCES.md](SOURCES.md).

Uzupełnienie stanowią cztery niezmienione ilustracje źródłowe: OpenStax (sarkomer oraz nawracanie/odwracanie), Casey Henley/MSU (jednostki motoryczne), Elgendy i wsp./Cureus (przyczep bicepsa). Szczegółowa atrybucja znajduje się w [GRAPHICS.md](android/app/src/main/assets/images/GRAPHICS.md). Dwie ryciny bicepsa są dostępne po rozwinięciu źródeł wyłącznie w teorii. Angielskie oznaczenia mają polskie objaśnienia.

Kontrola aplikacji: `tools/art-qa.mjs` sprawdza obecność i dekodowanie ilustracji we wszystkich 90 krokach, powiększanie, Wstecz oraz układ na 360 px i w poziomie. Wynik: [qa/art/report.json](qa/art/report.json). `tools/qa.mjs` sprawdza pełne przejście lekcji, korektę błędów, zapis oraz odroczone powtórki: [qa/report.json](qa/report.json).

Android 15, emulator offline: wszystkie 20 obrazów poprawnie zdekodowano z APK; powiększenie i systemowe cofanie działały. Aktualizacja 1.0 → 1.1 zachowała rozpoczętą lekcję, polska notatka przetrwała wymuszone zamknięcie, a klawiatura nie zasłaniała przycisku. Końcowy pakiet 1.1.0 ma 35 641 768 bajtów, podpis zgodny z poprzednią wersją i wyłączone debugowanie. Weryfikacja: [release-verification-v1.1.txt](qa/release-verification-v1.1.txt). Własny emulator został zamknięty i usunięty; fizycznego S24 Ultra nie testowano.

## Wersja 1.4 — pojedyncze zagadnienia

Złożone plansze są wyświetlane jako wybrane pojedyncze panele, również w pełnym ekranie. Wycofano z lekcji mylące przekroje hipertrofii oraz plansze glikogenu/metabolizmu. Źródłowe pliki pozostają jako historia; ich obecność w repo nie oznacza wykorzystania w aktualnej lekcji.

Dwie nowe grafiki wygenerowano wbudowanym `image_gen`: `hpg-feedback-v1.4.png` (jedna oś i hamowanie) oraz `glycogen-cell-v1.4.png` (glikogen wewnątrz komórki). Prompty są w `tools/*-v1.4-prompt.txt`. Podpisy wyjaśniają umowne symbole. Dobór i kontrolę opisuje `CONTENT_REVIEW_V1.4.md`.