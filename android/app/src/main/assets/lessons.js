/* Autorskie objaśnienia; bibliografia przy każdej lekcji. */
const OS='https://openstax.org/books/anatomy-and-physiology-2e/pages/';
const SOURCE={
 forearmBones:{title:'Betts i wsp. · Anatomy and Physiology 2e, 8.2',url:OS+'8-2-bones-of-the-upper-limb',kind:'Podręcznik · promieniowa, łokciowa, wyrostek łokciowy i guzowatość'},
 bicepsAnatomy:{title:'Tiwana, Charlick, Varacallo · StatPearls (2024)',url:'https://www.ncbi.nlm.nih.gov/books/NBK519538/',kind:'Podręcznik · Anatomia mięśnia dwugłowego ramienia'},
 brachialis:{title:'Plantz, Bordoni · StatPearls (2023)',url:'https://www.ncbi.nlm.nih.gov/books/NBK551630/',kind:'Podręcznik · Anatomia mięśnia ramiennego'},
 brachioradialis:{title:'Lung, Ekblad, Bisogno · StatPearls (2024)',url:'https://www.ncbi.nlm.nih.gov/books/NBK526110/',kind:'Podręcznik · Anatomia mięśnia ramienno-promieniowego'},
 torque:{title:'Ling, Sanny, Moebs · University Physics, 10.6',url:'https://openstax.org/books/university-physics-volume-1/pages/10-6-torque',kind:'Podręcznik · Definicja momentu siły'},
 coupling:{title:'Calderón, Bolaños, Caputo (2014)',url:'https://pmc.ncbi.nlm.nih.gov/articles/PMC5425715/',kind:'Przegląd · Sprzężenie pobudzenia ze skurczem'},
 rate:{title:'Enoka i Duchateau (2017)',url:'https://pmc.ncbi.nlm.nih.gov/articles/PMC5629984/',kind:'Przegląd · Rate Coding and the Control of Muscle Force'},
 arm:{title:'Betts i wsp. · Anatomy and Physiology 2e, 11.5',url:OS+'11-5-muscles-of-the-pectoral-girdle-and-upper-limbs',kind:'Podręcznik · przyczepy i funkcje mięśni'},
 movement:{title:'Betts i wsp. · Anatomy and Physiology 2e, 9.5',url:OS+'9-5-types-of-body-movements',kind:'Podręcznik · ruchy w stawach'},
 contraction:{title:'Betts i wsp. · Anatomy and Physiology 2e, 10.3',url:OS+'10-3-muscle-fiber-contraction-and-relaxation',kind:'Podręcznik · mechanizm skurczu'},
 motor:{title:'Betts i wsp. · Anatomy and Physiology 2e, 10.4',url:OS+'10-4-nervous-system-control-of-muscle-tension',kind:'Podręcznik · sterowanie napięciem'},
 energy:{title:'Baker, McCormick, Robergs (2010)',url:'https://pmc.ncbi.nlm.nih.gov/articles/PMC3005844/',kind:'Przegląd · Interaction among skeletal muscle metabolic energy systems'},
 fatigue:{title:'Allen, Lamb, Westerblad (2008)',url:'https://pubmed.ncbi.nlm.nih.gov/18195089/',kind:'Przegląd · Skeletal muscle fatigue: cellular mechanisms'},
 carbs:{title:'Betts i wsp. · Anatomy and Physiology 2e, 24.2',url:OS+'24-2-carbohydrate-metabolism',kind:'Podręcznik · metabolizm węglowodanów'},
 creatine:{title:'Kreider i wsp. (2017)',url:'https://pmc.ncbi.nlm.nih.gov/articles/PMC5469049/',kind:'Stanowisko ISSN · bezpieczeństwo i skuteczność kreatyny'},
 protein:{title:'Damas i wsp. (2016)',url:'https://pubmed.ncbi.nlm.nih.gov/27219125/',kind:'Badanie · synteza białek, uszkodzenia i hipertrofia'},
 sleep:{title:'Lamon i wsp. (2021)',url:'https://pmc.ncbi.nlm.nih.gov/articles/PMC7785053/',kind:'Badanie · jedna noc bez snu i synteza białek mięśniowych'},
 hormones:{title:'Betts i wsp. · Anatomy and Physiology 2e, 27.1',url:OS+'27-1-anatomy-and-physiology-of-the-male-reproductive-system',kind:'Podręcznik · oś podwzgórze–przysadka–jądra'},
 endocrine:{title:'Betts i wsp. · Anatomy and Physiology 2e, 17.2',url:OS+'17-2-hormones',kind:'Podręcznik · receptory i sprzężenia zwrotne'},
 pancreas:{title:'Betts i wsp. · Anatomy and Physiology 2e, 17.9',url:OS+'17-9-the-endocrine-pancreas',kind:'Podręcznik · insulina i glukagon'},
 adrenal:{title:'Betts i wsp. · Anatomy and Physiology 2e, 17.6',url:OS+'17-6-the-adrenal-glands',kind:'Podręcznik · kortyzol i adrenalina'},
 thyroid:{title:'Betts i wsp. · Anatomy and Physiology 2e, 17.4',url:OS+'17-4-the-thyroid-gland',kind:'Podręcznik · hormony tarczycy'},
 west:{title:'West i wsp. (2010)',url:'https://pubmed.ncbi.nlm.nih.gov/19910330/',kind:'Badanie · ostre wzrosty hormonów a adaptacja po 15 tygodniach'},
 retrieval:{title:'Roediger i Karpicke (2006)',url:'https://pubmed.ncbi.nlm.nih.gov/16507066/',kind:'Badanie · odtwarzanie z pamięci a późniejsze zapamiętanie'},
 spacing:{title:'Cepeda i wsp. (2006)',url:'https://pubmed.ncbi.nlm.nih.gov/16719566/',kind:'Metaanaliza · nauka rozłożona w czasie'}
};
const choice=(q,opts,correct,why)=>({type:'choice',q,opts,correct,why});
const LESSONS=[
{
 id:'biceps',title:'Dlaczego biceps nie tylko zgina łokieć?',short:'Przyczep → kierunek ruchu',minutes:7,chapter:'Od budowy do ruchu',goal:'Powiążesz przyczep na kości promieniowej z odwracaniem przedramienia.',sources:['forearmBones','arm','movement','bicepsAnatomy','brachialis','brachioradialis'],caveat:'Schemat kości pokazuje zasadę ruchu, nie dokładną geometrię stawu. Odczucie napięcia nie mierzy aktywacji ani wzrostu mięśnia.',
 theory:[
 {title:'Dwa ruchy, dwa różne pytania',diagram:'forearm'},
 {title:'Przyczep wyjaśnia funkcję'}
 ],
 task:{type:'identify',q:'Która kość musi być pociągana przez ścięgno bicepsa, aby pomagał odwracać przedramię?',opts:['Kość po stronie kciuka','Kość po stronie małego palca'],correct:0,why:'To kość promieniowa. Jej obrót względem łokciowej zmienia ustawienie dłoni; właśnie na niej kończy się główne ścięgno bicepsa.'},
 retry:choice('Dłoń jest skierowana w dół. Dlaczego mięsień ramienny nadal może zginać łokieć?',['Jego przyczep na kości łokciowej pozwala zginać łokieć mimo obrotu promieniowej.','Jego przyczep leży na promieniowej, która obraca się razem z dłonią.','Przy nawróceniu biceps przestaje zginać łokieć i działa już tylko jako odwracacz przedramienia.'],0,'Ramienny nie zmienia przyczepu. Obrót promieniowej zmienia mechanikę bicepsa, ale nie usuwa funkcji zginania ramiennego.'),
 practice:{type:'choice',title:'Rozpoznaj ruch w uginaniu',question:'Łokieć pozostaje zgięty. Obracasz dłoń ku górze, nie zginając nadgarstka. Które kości zmieniają wzajemne ustawienie?',opts:['Promieniowa i łokciowa','Ramienna i łopatka','Kości śródręcza i paliczków'],correct:0,why:'Promieniowa obraca się względem łokciowej w stawach promieniowo-łokciowych. To pozwala zmienić chwyt bez zmiany kąta łokcia.'},

 review:choice('W uginaniu nachwytem ramienny nadal zgina łokieć. Które przyczepy wyjaśniają, dlaczego jego funkcja różni się od funkcji bicepsa?',['Na promieniowej dla bicepsa, na łokciowej dla ramiennego.','Na łokciowej dla bicepsa, na promieniowej dla ramiennego.','Oba kończą się na promieniowej; różnią się głównie linią pociągania.'],0,'Biceps kończy się na promieniowej, a ramienny na łokciowej. Różne przyczepy pomagają wyjaśnić różnicę funkcji.' )
},
{
 id:'torque',title:'Dlaczego ten sam ciężar bywa trudniejszy?',short:'Siła × ramię siły',minutes:6,chapter:'Od budowy do ruchu',goal:'Przewidzisz zmianę momentu siły przy zmianie ustawienia kończyny.',sources:['arm','movement','torque'],caveat:'Model używa zadanej siły 10 N i idealnego ramienia. Nie uwzględnia masy kończyny, dynamiki ani zmiennych ramion sił mięśni.',
 theory:[
 {title:'Znaczenie ma odległość od osi',diagram:'torque'},
 {title:'Staw, przyczep, linia działania'}
 ],
 task:choice('Siła wynosi 10 N. Prostopadłe ramię zwiększa się z 20 do 40 cm. Jak zmienia się jej moment?',['Rośnie dwukrotnie.','Nie zmienia się, bo siła jest taka sama.','Maleje dwukrotnie, bo dźwignia jest dłuższa.'],0,'Moment = siła × prostopadłe ramię. Z 10 × 0,20 otrzymujesz 2 N·m, a z 10 × 0,40 — 4 N·m.'),
 retry:choice('Przy tej samej pionowej sile dłoń przesuwa się bliżej pionowej linii przechodzącej przez łokieć. Co dzieje się z zewnętrznym momentem?',['Maleje, bo skraca się prostopadłe ramię.','Rośnie, bo staw jest bardziej zgięty.','Pozostaje stały, bo długość kości się nie zmienia.'],0,'Długość kości to nie to samo co prostopadła odległość od linii działania siły.'),
 practice:{type:'torque',title:'Najpierw przewidź, potem zmień',question:'W modelu przesuniemy linię siły dalej od łokcia. Wymagany przeciwny moment…',opts:['Wzrośnie','Zmaleje','Nie zmieni się'],correct:0,note:'Zmieniasz odległość przy stałej sile. Odczyt to obliczenie z modelu, nie pomiar człowieka.'},
 review:choice('Dwa ustawienia mają tę samą siłę, lecz ramiona 15 i 30 cm. Czy możesz na tej podstawie porównać zewnętrzne momenty?',['Tak: w drugim ustawieniu moment jest dwukrotnie większy.','Nie: moment zależy wyłącznie od masy obciążenia.','Tak: w drugim ustawieniu moment jest dwukrotnie mniejszy.'],0,'Podwojenie prostopadłego ramienia przy stałej sile podwaja moment. Nie jest to jednak bezpośredni pomiar siły pojedynczego mięśnia.')
},
{
 id:'sarcomere',title:'Co właściwie skraca się w mięśniu?',short:'Wapń, filamenty i ATP',minutes:7,chapter:'Jak powstaje siła',goal:'Rozdzielisz sygnał wapniowy od roli ATP w cyklu mostków.',sources:['contraction','coupling','motor'],caveat:'Schemat pokazuje przesuwanie filamentów, bez skali molekularnej. Cały mięsień może wytwarzać napięcie także bez zmiany swojej długości.',
 theory:[
 {title:'Filamenty przesuwają się, nie kurczą',diagram:'sarcomere'},
 {title:'Wapń otwiera dostęp; ATP podtrzymuje cykl'}
 ],
 task:{type:'order',q:'Ułóż zdarzenia od sygnału do ruchu filamentów.',items:['Sygnał nerwowy pobudza włókno','Wapń wiąże troponinę','Odsłaniają się miejsca na aktynie','Mostki miozyny przesuwają aktynę'],why:'Wapń zmienia dostępność miejsc wiązania. Dopiero wtedy mostki mogą wykonywać cykl prowadzący do przesuwania filamentów.'},
 retry:choice('Mostek miozyny właśnie pociągnął aktynę. Co pozwala mu się odłączyć?',['Przyłączenie nowego ATP do miozyny.','Skrócenie samego filamentu aktyny.','Przyłączenie wapnia bezpośrednio do miozyny zamiast do troponiny.'],0,'ATP przyłącza się do głowy miozyny i umożliwia odłączenie. Wapń reguluje dostęp do aktyny poprzez troponinę.'),
 practice:{type:'sarcomere',title:'Sprawdź przesuwanie filamentów',question:'Gdy sarkomer się skróci, długość grubego filamentu…',opts:['Pozostanie taka sama','Zmniejszy się','Zwiększy się'],correct:0,note:'Przesuń linie Z i porównaj końce grubego filamentu. To model przesuwania, nie model siły.'},
 review:choice('Mięsień wytwarza napięcie, lecz nie zmienia długości. Czy to przeczy pracy mostków miozyny?',['Nie: mostki mogą wytwarzać napięcie bez skracania całego mięśnia.','Tak: każdy cykl mostka musi dać zauważalne skrócenie całego mięśnia.','Nie: napięcie bez ruchu pochodzi wyłącznie z biernego rozciągnięcia ścięgien.'],0,'Wytwarzanie napięcia nie jest tym samym co skracanie całego mięśnia. Przy równowadze obciążenia i sił mięśniowych mostki mogą pracować bez zmiany długości mięśnia.')
},
{
 id:'motor',title:'Jak układ nerwowy zwiększa siłę?',short:'Rekrutacja i częstość pobudzeń',minutes:6,chapter:'Jak powstaje siła',goal:'Rozróżnisz dwie drogi zwiększania napięcia i unikniesz mitu o wyłączaniu wolnych włókien.',sources:['motor','rate'],caveat:'Rysunek jednostek jest jakościowy. Liczba świecących punktów nie odpowiada procentowi aktywacji ani sile konkretnej osoby.',
 theory:[
 {title:'Jednostka motoryczna to zespół',diagram:'motor'},
 {title:'Więcej jednostek i częstsze impulsy'}
 ],
 task:choice('Siła wzrosła, choć liczba aktywnych jednostek się nie zmieniła. Co może to wyjaśnić?',['Częstsze impulsy w już aktywnych jednostkach.','Rzadsze impulsy, które wydłużają skurcz pojedynczych włókien.','Wyłączenie wszystkich jednostek o niskim progu.'],0,'Wzrost częstotliwości pobudzeń może zwiększać sumowanie odpowiedzi. Rekrutacja oznaczałaby zmianę liczby aktywnych jednostek.'),
 retry:choice('Dołączyły jednostki o wyższym progu. Co wynika z tego o wcześniej aktywnych jednostkach?',['Mogą nadal pracować razem z nowo dołączonymi.','Muszą zostać wszystkie wyłączone.','Ich włókna od razu zmieniają typ na szybki.'],0,'Dołączanie jednostek nie jest przełączaniem całego mięśnia z jednego typu włókien na drugi.'),
 practice:{type:'motor',title:'Zmień tylko jeden warunek',question:'Liczba aktywnych jednostek pozostanie stała. Co może zwiększyć sumowanie ich odpowiedzi?',opts:['Częstsze pobudzenia','Rzadsze pobudzenia','Natychmiastowa zmiana aktywnych włókien z typu wolnego na szybki'],correct:0,note:'Model pokazuje dwa niezależne sposoby sterowania. Nie wylicza rzeczywistej siły.'},
 review:choice('W zmęczonej serii dołącza więcej jednostek, ale prędkość nadal spada. Czy jest to sprzeczne?',['Nie: kompensacja może nie równoważyć zmniejszonej zdolności włókien do wytwarzania siły.','Tak: większa rekrutacja zawsze przywraca początkową prędkość.','Tak: zmęczenie zależy wyłącznie od liczby aktywnych neuronów.'],0,'Sterowanie nerwowe i stan mięśnia wspólnie wpływają na wynik. Dodatkowa rekrutacja nie zapewnia pełnej kompensacji.')
},
{
 id:'energy',title:'Dlaczego ostatnie powtórzenia zwalniają?',short:'Odtwarzanie ATP i zmęczenie',minutes:7,chapter:'Energia i adaptacja',goal:'Wyjaśnisz współpracę systemów energetycznych bez sprowadzania zmęczenia do braku ATP.',sources:['energy','fatigue'],caveat:'Wykres przedstawia tylko przykładowy spadek prędkości. Nie pochodzi z pomiaru; nie pokazuje udziałów systemów energetycznych ani tempa Twojego ruchu.',
 theory:[
 {title:'ATP trzeba stale odtwarzać',diagram:'energy'},
 {title:'Zwolnienie ma kilka przyczyn'}
 ],
 task:choice('Które zestawienie poprawnie przypisuje drogę odtwarzania ATP do miejsca?', ['Glikoliza — cytoplazma; przemiany tlenowe — mitochondria.','Glikoliza — mitochondria; przemiany tlenowe — siateczka.','Glikoliza — jądro komórkowe; przemiany tlenowe — ścięgno.'],0,'Glikoliza zachodzi w cytoplazmie, a mitochondria uczestniczą w przemianach tlenowych. Obie drogi działają razem z systemem PCr.'),
 retry:choice('Czy metabolizm tlenowy działa dopiero po całkowitym zużyciu fosfokreatyny?',['Nie, systemy współdziałają od początku, ze zmiennym udziałem.','Tak, PCr musi się wyczerpać, zanim metabolizm tlenowy wniesie istotny wkład.','Tak, podczas szybkiej serii mitochondria wstrzymują przemiany do końca wysiłku.'],0,'Nie ma ostrej granicy przełączenia. Istotne są różnice tempa i pojemności oraz współpraca dróg.'),
 practice:{type:'energy',title:'Odróżnij obserwację od przyczyny',question:'Po odpoczynku kolejna seria jest szybsza. Co można powiedzieć bez pomiaru metabolitów?',opts:['Wynik się poprawił; odtworzenie PCr jest możliwą częścią wyjaśnienia.','Poprawa dowodzi, że PCr była jedynym czynnikiem spadku prędkości.','Poprawa dowodzi, że wszystkie zasoby energetyczne wróciły już do normy.'],correct:0,note:'Schemat pokazuje drogi odtwarzania ATP. Nie wylicza ich udziałów i nie przewiduje Twojego wyniku.'},
 review:choice('Po tej samej serii dwie osoby mają podobny wykres prędkości. Czy muszą mieć taki sam udział glikolizy?',['Nie: podobny wynik nie identyfikuje jednego mechanizmu energetycznego.','Tak: prędkość jednoznacznie mierzy glikolizę.','Tak: ta sama liczba powtórzeń oznacza taki sam udział każdego systemu energetycznego.'],0,'Ten sam obserwowany efekt może wynikać z różnych kombinacji mechanizmów.')
},
{
 id:'fuel',title:'Co organizm robi ze składnikami posiłku?',short:'Glukoza, glikogen i kreatyna',minutes:6,chapter:'Energia i adaptacja',goal:'Rozróżnisz paliwo, zapas i mechanizm szybkiego odtwarzania ATP.',sources:['carbs','creatine','energy'],caveat:'Schemat pomija wiele etapów trawienia i przemian. Lekcja wyjaśnia mechanizm; nie ustala dawek suplementów ani indywidualnego jadłospisu.',
 theory:[
 {title:'Posiłek nie zamienia się od razu w mięsień',diagram:'fuel'},
 {title:'Różne składniki, różne role'}
 ],
 task:choice('Które powiązanie poprawnie oddziela zapas paliwa od szybkiego transferu fosforanu?',['Glikogen → zapas glukozy; PCr → szybkie odtwarzanie ATP z ADP.','Glikogen → szybkie odtwarzanie ATP z ADP; PCr → dłuższy zapas glukozy.','Glikogen i PCr → równoważne zapasy energii, różniące się tylko szybkością użycia.'],0,'Glikogen magazynuje jednostki glukozy, a fosfokreatyna uczestniczy w transferze fosforanu. To różne związki i funkcje.'),
 retry:choice('Dlaczego kreatyna nie zastępuje białka z posiłku?',['Nie dostarcza zestawu aminokwasów potrzebnych do syntezy białek.','Kreatyna dostarcza energii, więc jej fosforan może zastąpić aminokwasy w budowie białek.','PCr jest składnikiem białek kurczliwych, z którego organizm odbudowuje miozynę.'],0,'Wsparcie odtwarzania ATP i dostarczenie materiału do syntezy białek to dwie różne potrzeby.'),
 practice:{type:'order',title:'Odtwórz jedną drogę z posiłku',question:'Ułóż uproszczoną drogę wykorzystania węglowodanów.',items:['Trawienie węglowodanów','Wchłonięcie glukozy','Pobranie glukozy przez komórkę','Wykorzystanie do ATP lub zapis jako glikogen'],note:'To jedna z możliwych dróg. Organizm reguluje przepływ substratów w zależności od potrzeb.'},
 review:choice('W modelu PCr wróciła do wyjściowego poziomu, ale glikogen pozostał uszczuplony. Czy to możliwe?',['Tak: są to odrębne zapasy i procesy odtwarzania.','Nie: PCr i glikogen odbudowują się w tym samym tempie, więc poziomy muszą wrócić razem.','Nie: PCr jest szybko dostępną częścią zapasu glikogenu.'],0,'Powrót jednego wskaźnika nie dowodzi pełnej regeneracji wszystkich układów.')
},
{
 id:'adaptation',title:'Co pozostaje po treningu?',short:'Adaptacja, sen i ograniczenia odczuć',minutes:7,chapter:'Energia i adaptacja',goal:'Oddzielisz chwilowe zmęczenie i pompę od adaptacji mierzonej po czasie.',sources:['protein','sleep','west'],caveat:'Badania mają określone populacje i protokoły. Krótki eksperyment bez snu nie wylicza Twojego przyrostu; odczucia nie są pomiarem syntezy białek.',
 theory:[
 {title:'Bodziec uruchamia przebudowę',diagram:'adaptation'},
 {title:'Regeneracja nie ma jednego wskaźnika'}
 ],
 task:choice('Po treningu A pompa jest większa niż po B. Czego jeszcze potrzebujesz, aby porównać hipertrofię?',['Pomiarów rozmiaru mięśnia po okresie treningu, w porównywalnych warunkach.','Tylko oceny pompy godzinę po treningu.','Tylko oceny bolesności następnego dnia.'],0,'Chwilowa objętość i bolesność nie mierzą długoterminowego powiększenia włókien. Potrzebny jest wynik po czasie i kontrola warunków.'),
 retry:choice('Wynik w nowym ćwiczeniu poprawił się w pierwszych sesjach, lecz rozmiar mięśnia nie zmienił się w pomiarze. Jakie wyjaśnienie jest możliwe?',['Poprawa techniki i sterowania nerwowego.','Każda poprawa siły musi oznaczać wykrywalną hipertrofię.','Bez bolesności trudno uznać poprawę za rzeczywistą adaptację.'],0,'Wynik siłowy ma kilka składowych. Nauka zadania może poprawić wynik bez wykrywalnej zmiany rozmiaru.'),
 practice:{type:'choice',title:'Wybierz pomiar odpowiedni do pytania',question:'Chcesz sprawdzić trwałą zmianę siły, a nie dzisiejszą gotowość. Najlepsze porównanie to…',opts:['Powtarzalny test w podobnych warunkach przed i po okresie treningu.','Porównanie pieczenia pod koniec dwóch losowych serii.','Ocena napięcia mięśnia dłonią po treningu.'],correct:0,why:'Ten sam test przed i po okresie treningu porównuje trwałą zmianę osiągów. Pieczenie i dotyk po sesji nie mierzą siły.'},
 review:choice('Dwa programy dały podobną bolesność, lecz różne zmiany rozmiaru mięśni po miesiącach. Co to pokazuje?',['Bolesność nie jest jednoznacznym zastępczym pomiarem hipertrofii.','Większa bolesność zwykle oznacza proporcjonalnie większy wzrost, niezależnie od rodzaju treningu.','Rozmiar mięśnia nie może zmienić się bez większej bolesności.'],0,'Podobna reakcja krótkotrwała może współistnieć z różnymi długoterminowymi efektami.')
},
{
 id:'testosterone',title:'Co steruje produkcją testosteronu?',short:'Sygnały i ujemne sprzężenie zwrotne',minutes:8,chapter:'Regulacja i dowody',goal:'Odtworzysz oś hormonalną i przewidzisz kierunek odpowiedzi w uproszczonym modelu.',sources:['hormones','endocrine','west'],caveat:'Model dotyczy osi u dorosłego mężczyzny i zakłada sprawne elementy układu. Pomija pulsacyjność, opóźnienia i inne sygnały. Nie interpretuje badań krwi ani leczenia.',
 theory:[
 {title:'Trzy piętra regulacji',diagram:'hpg'},
 {title:'Wynik wraca do układu sterującego'}
 ],
 task:{type:'order',q:'Ułóż główny łańcuch pobudzania produkcji testosteronu.',items:['Podwzgórze: GnRH','Przysadka: LH','Komórki Leydiga','Produkcja testosteronu'],why:'GnRH jest sygnałem do przysadki, a LH do komórek Leydiga. Ujemne sprzężenie zwrotne wraca w przeciwnym kierunku.'},
 retry:choice('W sprawnym uproszczonym układzie wzrasta sygnał zwrotny testosteronu. W którą stronę działa on na wydzielanie LH?',['Hamuje je.','Bezpośrednio je nasila jako dodatnie sprzężenie.','Nie może oddziaływać na przysadkę.'],0,'Ujemne sprzężenie oznacza przeciwdziałanie dalszemu zwiększaniu końcowego sygnału.'),
 practice:{type:'hpg',title:'Przewidź odpowiedź układu',question:'Testosteron spada, a pozostałe elementy osi są sprawne. Osłabione hamowanie sprzyja…',opts:['Wzrostowi pobudzania przez LH','Dalszemu hamowaniu LH','Zanikowi receptorów LH z definicji'],correct:0,note:'Zmieniasz jedynie sygnał zwrotny. To model kierunku zależności, nie symulacja stężenia we krwi.'},
 review:choice('W modelu przysadka nie reaguje na GnRH. Czy samo osłabienie hamowania zwrotnego gwarantuje wzrost testosteronu?',['Nie: przerwane ogniwo może uniemożliwić przekazanie sygnału przez LH.','Tak: samo silniejsze pobudzenie podwzgórza zwiększy testosteron mimo braku odpowiedzi przysadki.','Tak: GnRH pobudza komórki Leydiga bez pośrednictwa LH.'],0,'Przewidywanie wzrostu zakładało sprawność pozostałych elementów. Uszkodzenie ogniwa zmienia warunki modelu.')
},
{
 id:'signals',title:'Dlaczego ten sam hormon nie działa na wszystko?',short:'Receptor, paliwo i odpowiedź na stres',minutes:7,chapter:'Regulacja i dowody',goal:'Połączysz sygnał z komórką docelową i oddzielisz role kilku hormonów.',sources:['endocrine','pancreas','adrenal','thyroid'],caveat:'Opisy są skróconymi funkcjami hormonów, nie pełnym katalogiem efektów. Zmiany stężeń i reakcje tkanek zależą od kontekstu.',
 theory:[
 {title:'Komórka musi umieć odebrać sygnał',diagram:'receptor'},
 {title:'Stres i tempo przemian'}
 ],
 task:choice('Glukagon wzrasta między posiłkami. Która zależność najlepiej opisuje jego rolę w utrzymaniu glukozy we krwi?',['Działanie na wątrobę sprzyja uwalnianiu glukozy.','Działa identycznie na glikogen wątroby i każdego mięśnia.','Działa głównie na mięśnie, które uwalniają własny glikogen do krwi.'],0,'Wątroba może dostarczać glukozę do krwi. Glikogen mięśniowy służy głównie lokalnej pracy, a odpowiedź zależy od tkanki i receptorów.'),
 retry:choice('W modelu komórka nie ma receptora dla danego hormonu. Czy samo zwiększenie hormonu zapewnia specyficzną odpowiedź tej komórki?',['Nie, brakuje sposobu odbioru tego sygnału.','Tak, wyższe stężenie wymusza odpowiedź nawet bez właściwego receptora.','Tak, hormon może przeniknąć do komórki i wywołać odpowiedź bez udziału receptora.'],0,'Sygnał wymaga odpowiedniego receptora i dalszych mechanizmów odpowiedzi.'),
 practice:{type:'choice',title:'Zastosuj znane sprzężenie',question:'W sprawnej uproszczonej osi rośnie sygnał T3/T4. Co przewidujesz dla pobudzania przez TSH?',opts:['Spadek przez ujemne sprzężenie zwrotne.','TSH rośnie, by przeciwdziałać wzrostowi T3/T4.','TSH nie zmienia się, bo T3/T4 działają wyłącznie w tarczycy.'],correct:0,why:'T3/T4 hamują wcześniejsze piętra osi tarczycy. Przy sprawnym sprzężeniu ich wzrost ogranicza pobudzanie przez TSH.'},
 review:choice('Stężenie hormonu jest takie samo w dwóch tkankach, ale odpowiedź jest różna. Jakie wyjaśnienie jest możliwe?',['Inne receptory lub dalsze mechanizmy odpowiedzi komórkowej.','Jeśli hormon jest obecny, receptory nie mają znaczenia dla reakcji tkanki.','Samo stężenie zawsze określa odpowiedź niezależnie od tkanki.'],0,'Dawka sygnału nie opisuje całego układu. Tkanka i jej mechanizmy odbioru zmieniają efekt.')
},
{
 id:'evidence',title:'Co badanie naprawdę pozwala stwierdzić?',short:'Mechanizm, związek i efekt po czasie',minutes:7,chapter:'Regulacja i dowody',goal:'Dopasujesz wniosek do pomiaru, projektu badania i czasu obserwacji.',sources:['west','protein','retrieval','spacing'],caveat:'Przykłady bez nazw publikacji są hipotetycznymi projektami badań, bez wymyślonych wyników. Algorytm powtórek 1–3–7–14 dni jest decyzją dydaktyczną, nie zweryfikowaną indywidualną optymalizacją.',
 theory:[
 {title:'Plausybilny mechanizm to początek',diagram:'evidence'},
 {title:'Mierz to, o czym chcesz mówić'}
 ],
 task:choice('Hipotetyczne badanie mierzy tylko hormon 30 minut po jednej sesji. Który wniosek pasuje do pomiaru?',['Opisano ostrą odpowiedź hormonalną; nie zmierzono długoterminowej hipertrofii.','Większa odpowiedź po sesji przewiduje proporcjonalnie większą hipertrofię w tym programie.','Wynik można uogólnić na osoby o innej płci i poziomie treningu.'],0,'Czas i rodzaj pomiaru wyznaczają zakres wniosku. Ostra reakcja i trwała adaptacja są odrębnymi wynikami.'),
 retry:choice('W obserwacji osoby z większą pompą mają większe mięśnie. Co pozostaje nierozstrzygnięte?',['Czy pompa jest przyczyną, czy wiąże się np. z objętością treningu lub rozmiarem mięśnia.','Skoro pompa i rozmiar rosną razem, pompa musi być czynnikiem wzrostu.','Pompa z treningu na trening wystarcza do śledzenia trwałej hipertrofii.'],0,'Współwystępowanie nie określa kierunku przyczyny ani nie wyklucza czynników wspólnych.'),
 practice:{type:'choice',title:'Dobierz projekt do pytania',question:'Chcesz porównać trwałą hipertrofię dwóch programów. Który projekt najlepiej odpowiada temu celowi?',opts:['Przydział do programów, porównywalne warunki i pomiary mięśni przed oraz po okresie treningu.','Uczestnicy wybierają program, a porównuje się tylko wynik końcowy.','Programy są losowane, ale pomiary odbywają się w różnym czasie od treningu i bez ujednolicenia nawodnienia.'],correct:0,why:'Przydział do grup i porównywalny pomiar przed oraz po treningu ograniczają wpływ różnic początkowych i przejściowej pompy.'},
 review:choice('Autorzy sprawdzili pamięć dopiero bezpośrednio po przeczytaniu tekstu. Czy ustalili trwałość pamięci po tygodniu?',['Nie: potrzebny jest test po tym czasie, bez wcześniejszego podglądania.','Tak: każda poprawna odpowiedź dowodzi trwałego opanowania.','Tak: subiektywne poczucie łatwości zastępuje odroczony test.'],0,'To ten sam problem wskaźnika i czasu obserwacji. Dopasuj test do twierdzenia o trwałości.')
}
];
