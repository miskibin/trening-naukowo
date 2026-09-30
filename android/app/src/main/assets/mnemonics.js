'use strict';
// Original memory cues, grounded in the definitions. Analogies are not mechanisms.
const MNEMONICS={
 biceps:[
  [['Ł jak łokieć','Dotknij kostnego czubka łokcia. To wyrostek łokciowy — część kości łokciowej. Obie kości uczestniczą jednak w stawie łokciowym.'],['Kciuk wskazuje promieniową','Znajdź kciuk i śledź tę stronę przedramienia: tam leży promieniowa. Przy nawracaniu krzyżuje łokciową. To wskazówka położenia, nie wyjaśnienie pochodzenia nazwy.'],['Supinacja: nieś zupę','Przy zgiętym łokciu wyobraź sobie miskę zupy na dłoni skierowanej w górę. Pronacja: obróć dłoń ku dołowi, jak przy odkładaniu jej na stół.']],
  [['Dwugłowy: dwa początki, wspólny koniec','Dwie głowy zaczynają się na łopatce; wspólne dalsze ścięgno przyczepia się do promieniowej. „Głowa” oznacza część mięśnia, nie kości.'],['Guzowatość: chropowaty zaczep','Wyobraź sobie wypukły, chropowaty punkt kotwiczenia na kości, poniżej głowy i szyjki. Guzowatość promieniowej jest miejscem przyczepu ścięgna bicepsa, nie osobną kością ani guzem chorobowym.'],['Nazwy podpowiadają drogę','Ramienno-promieniowy łączy okolicę ramiennej z promieniową. Ramienny kończy się na łokciowej — tu sama krótka nazwa nie wystarcza.']]
 ],
 torque:[
  [['Drzwi otwierasz przy klamce','Tę samą siłę łatwiej wykorzystać dalej od zawiasu. W łokciu liczy się odległość prostopadła do linii siły, a nie sama długość przedramienia.'],['Moment: siła razy ramię','Zapamiętaj parę: ile siły × jak daleko od osi działa jej linia. Jednostka to N·m.']],
  [['Piersiowy przyciąga ramię ku klatce','Wyobraź sobie obejmowanie dużego pudła: ramiona zbliżają się przed klatką. To skojarzenie z jednym z ruchów piersiowego, nie lista wszystkich jego funkcji.'],['Triceps prostuje łokieć','Trzy głowy zbiegają do wspólnego ścięgna na kostnym czubku łokcia. Głowa długa zaczyna się na łopatce, więc przekracza również bark.']]
 ],
 sarcomere:[
  [['Z jak granice odcinka','Sarkomer biegnie od jednej linii Z do drugiej. Przy skracaniu te granice zbliżają się do siebie.'],['Dwa wsuwane grzebienie','Zęby dwóch grzebieni mogą zachodzić na siebie coraz bardziej, choć same zęby nie stają się krótsze. Tak zapamiętasz przesuwanie filamentów; to tylko analogia.']],
  [['Wapń odsłania, ATP odłącza','Ca²⁺ wiąże troponinę i umożliwia odsłonięcie miejsc na aktynie. Przyłączenie ATP do miozyny umożliwia odłączenie mostka — nie myl tych dwóch ról.'],['Pompa też płaci ATP','Powrót wapnia do siateczki wymaga ATP. Rozluźnienie również potrzebuje energii.']]
 ],
 motor:[
  [['Jeden neuron, cała jego drużyna','Jednostka motoryczna to neuron ruchowy i wszystkie włókna, do których dociera jego akson. Nie pojedynczy mięsień ani dowolna grupa włókien.'],['Mały próg, wcześniej do gry','Przy typowym narastaniu zapotrzebowania dołączają najpierw jednostki o niższym progu. To skojarzenie z zasadą wielkości, nie niezmienna kolejność w każdym ruchu.']],
  [['Więcej drużyn ≠ szybsze sygnały','Rekrutacja: dołączają kolejne jednostki. Częstość: już aktywne neurony wysyłają więcej impulsów w tym samym czasie.'],['Kolejny sygnał przed odpoczynkiem','Gdy włókno nie zdąży całkiem się rozluźnić, następna odpowiedź może się zsumować z poprzednią.']]
 ],
 energy:[
  [['ATP to wspólna waluta','PCr, glikoliza i metabolizm tlenowy pomagają odtwarzać ten sam ATP. Współdziałają; nie są trzema rozłącznymi biegami włączanymi po kolei.'],['PCr: fosforan pod ręką','Fosfokreatyna szybko przekazuje fosforan ADP. Skojarz ją z krótkim buforem, a nie z niewyczerpaną baterią.']],
  [['Wolniejszy ruch to objaw, nie diagnoza','Widząc zwalnianie, wiesz co się stało z prędkością. Nie wiesz jeszcze, jaka kombinacja procesów we włóknie i układzie nerwowym do tego doprowadziła.'],['Mleczan może jechać dalej','Mleczan może być wykorzystywany jako paliwo. Nie przypinaj mu automatycznie winy za bolesność następnego dnia.']]
 ],
 fuel:[
  [['Glukoza: jednostka; glikogen: zapas','Wyobraź sobie rozgałęziony łańcuch wielu jednostek glukozy. Ten łańcuch jest przechowywany wewnątrz komórek, nie przewożony w całości przez krew.'],['Wątroba pomaga wszystkim, mięsień sobie','Glikogen wątroby wspiera utrzymanie glukozy we krwi. Mięsień zużywa swój zapas przede wszystkim na własną pracę.']],
  [['Cegły i paliwo mają różne zadania','Aminokwasy są składnikami białek; kwasy tłuszczowe mogą być paliwem. Aminokwasy także mogą uczestniczyć w przemianach energetycznych — analogia nie tworzy szczelnych szuflad.'],['Kreatyna nie jest cegłą mięśnia','Układ kreatyna–PCr buforuje odtwarzanie ATP. Do syntezy białka komórka nadal potrzebuje aminokwasów.']]
 ],
 adaptation:[
  [['Remont ma budowanie i rozbiórkę','Synteza i rozkład białek zachodzą równocześnie. O zmianie po czasie decyduje ich bilans, nie sam chwilowy wzrost jednego procesu.'],['Hipertrofia: większy przekrój','Skojarz wzrost włókna z szerszym przekrojem. Nie myl tego automatycznie ze wzrostem liczby włókien.']],
  [['Pompa to zdjęcie chwili','Większy wygląd zaraz po sesji nie zastępuje porównywalnego pomiaru po tygodniach treningu.'],['Jedna noc to krótki eksperyment','Badanie ostrej syntezy białek po nocy bez snu nie jest pomiarem wielomiesięcznej hipertrofii. Zapamiętaj, co i kiedy naprawdę mierzono.']]
 ],
 testosterone:[
  [['Trzy piętra, trzy nazwy','Podwzgórze wysyła GnRH → przysadka wysyła LH → komórki Leydiga w jądrze produkują testosteron. Śledź kolejność na planszy.'],['Leydiga: między kanalikami','Wyobraź sobie komórki w przestrzeni pomiędzy rurkami, nie wewnątrz ich światła. To pomoc w znalezieniu producenta testosteronu.']],
  [['Termostat hamuje dalszą produkcję','Sygnały końcowe wracają do wcześniejszych pięter i ograniczają pobudzanie. To analogia ujemnego sprzężenia, nie gwarancja stałego stężenia hormonu.'],['Skok po sesji ≠ wzrost po tygodniach','Chwilowe stężenie i długotrwała adaptacja to różne pomiary. Biologiczna rola hormonu nie czyni każdego jego skoku prognozą hipertrofii.']]
 ],
 signals:[
  [['Sygnał musi mieć odbiorcę','Receptor przypomina odbiornik dostrojony do sygnału. Odpowiedź zależy też od dalszych mechanizmów komórki; sama obecność hormonu nie rozstrzyga wyniku.'],['Insulina magazynuje, glukagon uruchamia wątrobę','To skrót do zapamiętania kierunku działania na gospodarkę glukozą. Insulina ma wiele działań, a glukagon nie jest przełącznikiem glikogenu każdego mięśnia.']],
  [['Kora — kortyzol: wspólne K','Kortyzol powstaje w korze nadnercza. Adrenalina pochodzi z jego rdzenia. To dwie części jednego narządu.'],['TSH wysyła polecenie, T3/T4 są produktem','TSH pochodzi z przysadki i pobudza tarczycę. Tarczyca wytwarza T3/T4; nie produkuje TSH.']]
 ],
 evidence:[
  [['Razem nie znaczy: jedno powoduje drugie','Sen i wynik mogą współwystępować, bo wpływa na nie trzeci czynnik. Szukaj innych możliwych dróg na planszy.'],['Trzy pytania do badania','Co zmierzono? U kogo? Po jakim czasie? Odpowiedzi wyznaczają zakres wniosku.']],
  [['Zdjęcie sesji, film adaptacji','Wynik tuż po treningu to inny punkt czasu niż zmiana po całym programie. Nie zamieniaj wskaźnika pośredniego na wynik końcowy.'],['Zamknij — powiedz — sprawdź','Spróbuj odtworzyć mechanizm, potem porównaj i popraw. Wróć po przerwie. Poczucie znajomości podczas czytania nie zastępuje próby z pamięci.']]
 ]
};
function mnemonicSection(l,index){return `<aside class="mnemonics" aria-label="Skojarzenia do zapamiętania"><p class="eyebrow">Zapamiętaj przez skojarzenie</p><h2>Połącz nazwę z tym, co już znasz</h2><dl>${MNEMONICS[l.id][index].map(([a,b])=>`<div><dt>${a}</dt><dd>${b}</dd></div>`).join('')}</dl><p class="mnemonic-note">Autorskie pomoce pamięciowe. Definicje i podpisane plansze wyjaśniają rzeczywisty mechanizm.</p></aside>`;}
