'use strict';
// Three questions at the end of a lesson, two different questions in its review.
const KNOWLEDGE={
 biceps:[
  choice('Przy łokciu zgiętym do 90° obracasz dłoń z dołu ku górze. Jaki to ruch?', ['Supinacja przedramienia','Zgięcie nadgarstka','Wyprost łokcia'],0,'Supinacja obraca przedramię. Zgięcie nadgarstka zmieniłoby kąt dłoni względem przedramienia.'),
  choice('Gdzie kończy się główne dalsze ścięgno bicepsa?', ['Na wyrostku łokciowym','Na guzowatości kości promieniowej','Na wyrostku kruczym łopatki'],1,'Guzowatość promieniowej jest dalszym przyczepem. Wyrostek kruczy to początek głowy krótkiej; wyrostek łokciowy jest przyczepem tricepsa.'),
  choice('W uginaniu młotkowym utrzymujesz kciuk ku górze. Co opisuje ten chwyt?', ['Przedramię jest w pełnej pronacji','Przedramię jest w pełnej supinacji','Przedramię pozostaje w ustawieniu pośrednim'],2,'Chwyt młotkowy utrzymuje ustawienie pośrednie. Łokieć nadal się zgina, choć przedramię nie wykonuje pełnej supinacji.'),
  choice('Która kość leży po stronie małego palca?', ['Kość łokciowa','Kość promieniowa','Kość ramienna'],0,'Łokciowa leży po stronie małego palca; promieniowa po stronie kciuka. Te strony rozpoznasz także przy zmianie chwytu.'),
  choice('Zginasz dłoń w nadgarstku, nie obracając przedramienia. Co się zmieniło?', ['Kąt dłoni względem przedramienia','Kąt przedramienia względem ramienia','Położenie promieniowej z równoległego na skrzyżowane'],0,'To zgięcie nadgarstka. Zmniejszenie kąta w łokciu byłoby zgięciem łokcia, a krzyżowanie kości wiąże się z pronacją.')
 ],
 torque:[
  choice('Siła 20 N działa z prostopadłym ramieniem 0,30 m. Ile wynosi moment?', ['6 N·m','0,6 N·m','60 N·m'],0,'20 × 0,30 = 6 N·m. Ramię podstawiasz w metrach.'),
  choice('Co mierzy prostopadłe ramię siły?', ['Długość kości od stawu do dłoni','Najkrótszą odległość osi stawu od linii siły','Drogę dłoni podczas całego powtórzenia'],1,'Mierzysz odległość od osi do linii działania siły, pod kątem prostym. Długość kości nie określa jej w każdym ustawieniu.'),
  choice('W rozpiętkach utrzymujesz podobne zgięcie łokcia i zbliżasz ramiona przed klatką. Który ruch dominuje?', ['Prostowanie łokcia przez triceps','Supinacja przedramienia przez biceps','Przywodzenie poziome w barku'],2,'Rozpiętki wykorzystują przede wszystkim ruch w barku. Wyciskanie dodatkowo wymaga wyprostu łokcia.'),
  choice('Ciężar i oś barku są takie same. Dłoń znalazła się bliżej pionowej linii przez bark. Co dzieje się z momentem ciężaru?', ['Maleje','Rośnie','Pozostaje bez zmian'],0,'Mniejsza prostopadła odległość przy tej samej sile daje mniejszy zewnętrzny moment.'),
  choice('Na której części kości kończy się wspólne ścięgno tricepsa?', ['Na guzowatości promieniowej','Na wyrostku łokciowym','Na wyrostku kruczym'],1,'Triceps pociąga wyrostek łokciowy kości łokciowej i prostuje łokieć.')
 ],
 sarcomere:[
  choice('Co wyznacza granice jednego sarkomeru?', ['Dwie sąsiednie linie Z','Dwie sąsiednie błony komórkowe','Dwa sąsiednie ścięgna'],0,'Sarkomer jest odcinkiem miofibryli między liniami Z. W jednym włóknie występuje wiele sarkomerów.'),
  choice('Z którym białkiem wiąże się wapń, uruchamiając odsłonięcie aktyny?', ['Z miozyną','Z troponiną','Z kolagenem'],1,'Wapń wiąże troponinę. Zmienia się położenie tropomiozyny, która osłaniała miejsca wiązania na aktynie.'),
  choice('Trzymasz hantel nieruchomo w połowie uginania. Jak nazywa się ta praca?', ['Koncentryczna','Ekscentryczna','Izometryczna'],2,'Przy utrzymywaniu położenia mięśnie wytwarzają napięcie bez wyraźnej zmiany długości całego mięśnia.'),
  choice('Co umożliwia odłączenie miozyny od aktyny?', ['Przyłączenie ATP do miozyny','Przyłączenie wapnia do kolagenu','Skrócenie grubego filamentu'],0,'Nowe ATP wiąże się z głową miozyny i umożliwia odłączenie mostka.'),
  choice('Co wymaga ATP podczas rozluźnienia włókna?', ['Powrót wapnia do siateczki','Skracanie filamentu aktyny','Przeniesienie troponiny do krwi'],0,'Pompy transportujące Ca²⁺ do siateczki zużywają ATP. Spadek wapnia pozwala ponownie osłonić miejsca na aktynie.')
 ],
 motor:[
  choice('Co należy do jednej jednostki motorycznej?', ['Jeden neuron i wszystkie unerwiane przez niego włókna','Jedno włókno i wszystkie neurony całego mięśnia','Cały mięsień razem z przyczepami'],0,'Jednostkę wyznacza wspólne unerwienie przez jeden neuron, nie sąsiedztwo włókien.'),
  choice('Który proces oznacza rekrutację?', ['Przyspieszenie impulsów tego samego neuronu','Dołączenie kolejnych jednostek motorycznych','Zwiększenie ilości glikogenu w komórce'],1,'Rekrutacja zwiększa liczbę aktywnych jednostek. Częstość impulsów to oddzielny sposób sterowania napięciem.'),
  choice('Co może się sumować, gdy impulsy przychodzą przed pełnym rozluźnieniem?', ['Liczba ścięgien','Długość aksonów','Odpowiedzi skurczowe aktywnych włókien'],2,'Częstsze pobudzenia mogą zwiększać napięcie przez sumowanie odpowiedzi, bez dołączenia nowych jednostek.'),
  choice('Przy stopniowym zwiększaniu wymagań które jednostki zwykle dołączają wcześniej?', ['O niższym progu pobudzenia','O wyższym progu pobudzenia','Wszystkie jednocześnie'],0,'Zasada wielkości opisuje zwykle kolejność od jednostek o niższym do wyższego progu.'),
  choice('Dlaczego jeden kolor na schemacie może występować w kilku miejscach mięśnia?', ['Włókna tej samej jednostki mogą być przemieszane z innymi','Neuron przesuwa się między włóknami podczas ruchu','Kolor wskazuje aktualny zapas ATP w całym mięśniu'],0,'Jednostka to grupa połączona z jednym neuronem, a nie osobny zwarty fragment mięśnia.')
 ],
 energy:[
  choice('Gdzie zachodzi glikoliza?', ['W cytoplazmie','Wyłącznie w mitochondriach','W siateczce sarkoplazmatycznej'],0,'Glikoliza zachodzi w cytoplazmie; mitochondria uczestniczą w dalszych przemianach tlenowych.'),
  choice('Który związek szybko przekazuje fosforan do ADP?', ['Glikogen','Fosfokreatyna','Troponina'],1,'PCr uczestniczy w szybkim odtwarzaniu ATP. Glikogen magazynuje jednostki glukozy.'),
  choice('Co oznacza Pi w opisie zmęczenia?', ['Impuls nerwowy','Białko kurczliwe','Fosforan nieorganiczny'],2,'Pi to fosforan nieorganiczny. Zmiany jego stężenia mogą wpływać m.in. na mostki i regulację wapnia.'),
  choice('Która droga sama nie wymaga tlenu?', ['Glikoliza','Przemiany tlenowe w mitochondriach','Utlenianie kwasów tłuszczowych'],0,'Sama glikoliza nie wymaga tlenu. Wytworzony pirogronian może być potem wykorzystywany w przemianach tlenowych.'),
  choice('Który opis działania systemów energetycznych jest poprawny?', ['Współdziałają od początku, a ich udziały się zmieniają','Glikoliza zaczyna działać dopiero po wyczerpaniu całego PCr','Mitochondria włączają się dopiero po zakończeniu serii'],0,'Drogi działają równocześnie. Różnią się tempem i pojemnością, bez ostrego przełączania.')
 ],
 fuel:[
  choice('Gdzie znajduje się glikogen mięśniowy?', ['W cytoplazmie włókna','Jako rozgałęziony łańcuch krążący we krwi','Wyłącznie w jądrze komórki'],0,'Glikogen jest zapasem wewnątrz komórki. Krew transportuje glukozę, nie takie łańcuchy glikogenu.'),
  choice('Co rybosom wykorzystuje do budowy białka?', ['Fosfokreatynę jako łańcuch','Aminokwasy według informacji mRNA','Nietrawione łańcuchy białek z posiłku'],1,'Rybosom łączy aminokwasy. Białko pokarmowe jest wcześniej trawione.'),
  choice('Która reakcja opisuje odbudowę PCr podczas regeneracji?', ['PCr + ADP → kreatyna + ATP','Glikogen + ATP → białko','Kreatyna + ATP → PCr + ADP'],2,'W regeneracji ATP dostarcza fosforan do odbudowy PCr. Odwrotna reakcja szybko odtwarza ATP w wysiłku.'),
  choice('Który narząd może uwalniać glukozę z własnego glikogenu do krwi?', ['Wątroba','Mięsień dwugłowy ramienia','Mięsień trójgłowy ramienia'],0,'Wątroba pomaga utrzymać glukozę we krwi. Glikogen mięśniowy jest wykorzystywany przede wszystkim lokalnie.'),
  choice('Porcja odżywki waży 30 g, a etykieta podaje 23 g białka na porcję. Ile białka dodasz do dziennego zapisu?', ['23 g','30 g','53 g'],0,'W tym przykładzie pozostałe 7 g porcji to inne składniki. Masa proszku nie jest równa masie białka.')
 ],
 adaptation:[
  choice('Co oznacza hipertrofia mięśniowa?', ['Powiększanie włókien po okresie treningu','Chwilowy wzrost przepływu krwi po serii','Samo zwiększenie częstości impulsów'],0,'Hipertrofia dotyczy trwałej zmiany rozmiaru włókien. Pompa i sterowanie nerwowe opisują inne zjawiska.'),
  choice('Które procesy wspólnie wpływają na bilans białek mięśnia?', ['Przepływ krwi i kolor skóry','Synteza i rozkład białek','Pronacja i supinacja'],1,'Wynik przebudowy zależy od tworzenia i rozkładu w czasie. Sama chwilowa synteza nie określa całego bilansu.'),
  choice('Co może poprawić wynik w pierwszych sesjach nowego ćwiczenia bez wykrywalnego wzrostu mięśnia?', ['Większa bolesność','Większa pompa','Lepsza technika i koordynacja'],2,'Uczenie ruchu i zmiana sterowania nerwowego mogą poprawiać wynik niezależnie od wykrywalnej hipertrofii.'),
  choice('Co bezpośrednio opisuje pompa po treningu?', ['Przejściową zmianę przepływu krwi i płynów','Przyrost nowych sarkomerów zmierzony w tej serii','Długoterminowy bilans białek całego mięśnia'],0,'Pompa opisuje ostrą reakcję płynów i krążenia, a nie pomiar trwałego wzrostu.'),
  choice('Kiedy porównanie rozmiaru mięśnia lepiej oddziela hipertrofię od pompy?', ['W podobnych warunkach poza ostrym obrzmieniem po sesji','Od razu po najcięższej serii każdego programu','Raz przed treningiem, a drugi raz tuż po nim'],0,'Ujednolicenie warunków ogranicza wpływ przejściowej pompy na porównanie.')
 ],
 testosterone:[
  choice('Która struktura wydziela GnRH?', ['Podwzgórze','Przysadka','Komórki Leydiga'],0,'GnRH powstaje w podwzgórzu i pobudza przysadkę.'),
  choice('Który hormon bezpośrednio pobudza komórki Leydiga?', ['TSH','LH','TRH'],1,'LH jest sygnałem z przysadki do komórek Leydiga. TSH i TRH należą do osi tarczycy.'),
  choice('Co produkują komórki Leydiga?', ['GnRH','LH','Testosteron'],2,'Komórki Leydiga w jądrach produkują testosteron w odpowiedzi na pobudzanie przez LH.'),
  choice('Które dwa piętra ogranicza sygnał zwrotny hormonów płciowych?', ['Podwzgórze i przysadkę','Trzustkę i wątrobę','Rdzeń i korę nadnercza'],0,'Hamowanie wraca do wcześniejszych pięter osi HPG: podwzgórza i przysadki.'),
  choice('Czym jest estradiol w tej osi?', ['Hormonem powstającym m.in. z części testosteronu','Inną nazwą LH wydzielanego przez przysadkę','Receptorem komórek Leydiga'],0,'Część testosteronu ulega przemianie do estradiolu. Oba hormony uczestniczą w regulacji zwrotnej.')
 ],
 signals:[
  choice('Które komórki trzustki wydzielają insulinę?', ['Beta','Alfa','Komórki Leydiga'],0,'Komórki beta produkują insulinę, a alfa glukagon.'),
  choice('Gdzie znajduje się receptor insuliny?', ['Wyłącznie w jądrze komórkowym','W błonie komórki','W świetle naczynia krwionośnego'],1,'Insulina wiąże receptor błonowy. Dalszy sygnał jest przekazywany do wnętrza komórki.'),
  choice('Która część nadnercza wydziela adrenalinę?', ['Kora','Szypuła','Rdzeń'],2,'Rdzeń wydziela adrenalinę. Kora wytwarza m.in. kortyzol.'),
  choice('Który łańcuch poprawnie opisuje oś tarczycy?', ['TRH → TSH → T3/T4','GnRH → TSH → testosteron','LH → TRH → insulina'],0,'TRH pobudza przysadkę do wydzielania TSH, a TSH pobudza tarczycę do produkcji T3/T4.'),
  choice('Który hormon wytwarza kora nadnercza?', ['Kortyzol','Insulinę','GnRH'],0,'Kortyzol powstaje w korze nadnercza. Insulina w komórkach beta trzustki, a GnRH w podwzgórzu.')
 ],
 evidence:[
  choice('Co oznacza randomizacja uczestników badania?', ['Losowy przydział do porównywanych grup','Wybór grupy przez uczestnika','Pomiar wyniku w losowej jednostce'],0,'Randomizacja oznacza losowanie przydziału. Pomaga ograniczyć systematyczne różnice grup na początku.'),
  choice('Czym jest korelacja dwóch zjawisk?', ['Dowodem, że pierwsze powoduje drugie','Ich współwystępowaniem','Dowodem identyczności ich mechanizmów'],1,'Korelacja opisuje współwystępowanie; możliwa jest odwrotna przyczyna albo wspólny czynnik.'),
  choice('Hipotetycznie: średni przyrost wynosi 1,0 kg w A i 1,3 kg w B. Ile wynosi różnica bezwzględna?', ['30 kg','1,3 kg','0,3 kg'],2,'1,3 − 1,0 = 0,3 kg. Hasło „30% większy przyrost” wymaga wskazania wartości odniesienia.'),
  choice('Który pomiar odpowiada pytaniu o hipertrofię?', ['Zmiana rozmiaru mięśnia po okresie treningu','Stężenie hormonu 30 minut po serii','Ocena pieczenia podczas ostatniego powtórzenia'],0,'Trwała zmiana rozmiaru odpowiada pytaniu o hipertrofię. Pozostałe pomiary dotyczą innych efektów.'),
  choice('Co oznacza brak statystycznie istotnej różnicy?', ['Wynik nie wystarczył do wykazania różnicy w tym teście','Dowiedziono identycznych efektów u każdej osoby','Oba programy na pewno nie działały'],0,'Brak istotności sam nie dowodzi równoważności. Trzeba uwzględnić wielkość efektu, niepewność i projekt badania.')
 ]
};
for(const l of LESSONS){l.knowledge=KNOWLEDGE[l.id].slice(0,3);l.reviewKnowledge=KNOWLEDGE[l.id].slice(3);}
