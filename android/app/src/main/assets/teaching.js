'use strict';
// Each ordered block explains one point; regions select the same single panel inline and full screen.
const paragraph=text=>({type:'paragraph',text});
const picture=(id,caption,region=null)=>({type:'figure',id,caption,region});
const hint=(label,text)=>({type:'hint',label,text});
const heading=text=>({type:'heading',text});
const study=(source,text)=>({type:'study',source,text});
const TEACHING={
 biceps:[[
  paragraph('<b>Zgięcie łokcia</b> przybliża przedramię do ramienia. Obrót dłoni to inny ruch: przy zgiętym łokciu <b>supinacja</b> ustawia dłoń ku górze, a <b>pronacja</b> — ku dołowi.'),
  picture('movement','Porównaj ustawienie dłoni; łokieć pozostaje zgięty.'),
  hint('Supinacja','Wyobraź sobie, że niesiesz na dłoni miskę zupy.'),
  paragraph('Ten obrót zachodzi w stawach promieniowo-łokciowych. <b>Kość promieniowa</b> leży po stronie kciuka: przy pronacji krzyżuje łokciową, przy supinacji obie są równoległe. <b>Łokciowa</b> leży po stronie małego palca.'),
  picture('rotation','Tutaj łokcie są wyprostowane: przy supinacji dłoń jest skierowana do przodu. Niebieska kość to promieniowa.'),
  hint('Łokciowa','Ł jak łokieć: jego kostny czubek, wyrostek łokciowy, należy do łokciowej. Promieniowa także uczestniczy w stawie łokciowym.')
 ],[
  paragraph('Biceps ma dwa początki na <b>łopatce</b>. Głowa długa zaczyna się na <b>guzku nadpanewkowym</b> — wyniosłości nad panewką stawu ramiennego. Głowa krótka zaczyna się na <b>wyrostku kruczym</b>, haczykowatym występie z przodu łopatki.'),
  picture('biceps-attachments','Bark: śledź dwa ścięgna od łopatki do mięśnia.',[0,0,1024,503]),
  paragraph('Kurczliwa część, <b>brzusiec</b>, przechodzi w ścięgno przenoszące pociągnięcie na kość. Główny dalszy przyczep bicepsa to <b>guzowatość kości promieniowej</b>: chropowata wypukłość poniżej głowy i szyjki, po stronie zwróconej ku łokciowej. Dzięki temu przebiegowi biceps zgina łokieć i odwraca przedramię.'),
  picture('biceps-attachments','Łokieć: jasne ścięgno kończy się na zaznaczonej części kości.',[0,1048,1024,488]),
  hint('Guzowatość','Pomyśl o chropowatym zaczepie na kości, do którego dochodzi ścięgno.'),
  paragraph('<b>Ramienny</b> biegnie z kości ramiennej do łokciowej, więc może zginać łokieć niezależnie od obrotu promieniowej.'),
  picture('elbow-muscles','Mięsień ramienny: śledź dolne ścięgno do kości łokciowej.',[0,505,690,463]),
  paragraph('<b>Ramienno-promieniowy</b> kończy się na promieniowej blisko nadgarstka i także pomaga w zgięciu. Zmiana chwytu zmienia warunki pracy tych mięśni; nie izoluje jednego z nich.'),
  picture('elbow-muscles','Ramienno-promieniowy: koniec ścięgna leży przy nadgarstku.',[0,968,690,568])
 ]],
 torque:[[
  paragraph('<b>Moment siły</b> opisuje jej działanie obrotowe: siła × prostopadłe ramię. To ramię jest najkrótszą odległością od osi stawu do <b>linii działania siły</b>, a nie długością kości.'),
  {type:'model',id:'torque',caption:'Kółko: oś łokcia. Strzałka: siła w dół. Poziomy odcinek: prostopadłe ramię.'},
  paragraph('W modelu 10 N × 0,20 m = <b>2 N·m</b>. Przy tej samej sile i ramieniu 0,40 m moment wynosi <b>4 N·m</b>. Mięśnie muszą równoważyć większe działanie obrotowe obciążenia.'),
  hint('Ramię siły','Klamka daleko od zawiasu ułatwia obrócenie drzwi.'),
  paragraph('Gdy przedramię zbliża się do pionu, linia ciężaru przechodzi bliżej osi łokcia. Sam ten model nie wyznacza siły konkretnego mięśnia: pomija masę kończyny, przyspieszenie i geometrię przyczepów.')
 ],[
  heading('Bark'),
  paragraph('<b>Piersiowy większy</b> przywodzi ramię poziomo, ku środkowi klatki. Zaczyna się m.in. na obojczyku, mostku i chrząstkach żeber, a kończy na wardze bocznej bruzdy międzyguzkowej kości ramiennej. Przednia część naramiennego pomaga w ruchu ramienia.'),
  picture('press-attachments','Przyczep na kości ramiennej leży w pobliżu barku.',[0,0,1024,695]),
  heading('Łokieć'),
  paragraph('<b>Triceps</b> prostuje łokieć. Głowy boczna i przyśrodkowa zaczynają się na ramiennej, a długa — na łopatce, więc przekracza także bark. Wspólne ścięgno kończy się na <b>wyrostku łokciowym</b>, kostnym czubku łokcia.'),
  picture('press-attachments','Trzy głowy dochodzą do wspólnego dalszego ścięgna.',[0,702,1024,834]),
  paragraph('Zmiana ustawienia łokci zmienia geometrię ruchu i wymagania w obu stawach. Mocniejsze odczucie w klatce nie jest pomiarem jej aktywacji ani dowodem większej przyszłej hipertrofii.')
 ]],
 sarcomere:[[
  paragraph('<b>Włókno mięśniowe</b> to długa komórka zawierająca miofibryle. W miofibryli powtarzają się <b>sarkomery</b>, odcinki między liniami Z. Ich cienkie filamenty zawierają aktynę, a grube — miozynę.'),
  picture('sliding-filaments','Relaxed = rozluźniony; contracted = skrócony; Z line = linia Z. Porównaj oba stany.'),
  paragraph('Głowy miozyny przesuwają aktynę ku środkowi. Rośnie nakładanie filamentów, a linie Z zbliżają się. <b>Same filamenty nie muszą się skracać</b>; pasmo A, odpowiadające długości grubych filamentów, zachowuje szerokość.'),
  hint('Przesuwanie','Dwa grzebienie mogą bardziej wsunąć się jeden w drugi bez skracania zębów.'),
  paragraph('Mięsień może też wytwarzać napięcie przy niemal stałej długości całego mięśnia — to praca <b>izometryczna</b>, np. utrzymywanie nieruchomego obciążenia.')
 ],[
  paragraph('Pobudzenie błony włókna prowadzi do uwolnienia <b>Ca²⁺</b> z siateczki sarkoplazmatycznej, wewnętrznego magazynu wapnia. Wapń wiąże <b>troponinę</b>; przesuwa się <b>tropomiozyna</b>, odsłaniając miejsca wiązania miozyny na aktynie.'),
  picture('calcium-atp','Po lewej spoczynek; po prawej stan po związaniu wapnia.',[0,0,1024,784]),
  paragraph('W cyklu mostka <b>przyłączenie ATP odłącza głowę miozyny od aktyny</b>. Rozkład ATP do ADP i fosforanu nieorganicznego (Pi) przygotowuje głowę do kolejnego cyklu; uwolnienie produktów wiąże się z wytwarzaniem ruchu i siły.'),
  picture('calcium-atp','Śledź cykl pojedynczej głowy, nie całego mięśnia.',[0,789,1024,475]),
  paragraph('Pompy zużywające ATP przenoszą Ca²⁺ z powrotem do siateczki. Gdy jego stężenie spada, miejsca na aktynie znów są osłaniane. <b>Rozluźnienie również wymaga energii.</b>'),
  paragraph('W pracy <b>koncentrycznej</b> mięsień skraca się pod obciążeniem; w <b>ekscentrycznej</b> wytwarza napięcie podczas wydłużania.')
 ]],
 motor:[[
  paragraph('<b>Jednostka motoryczna</b> to jeden neuron ruchowy i wszystkie włókna mięśniowe, które unerwia. Jego <b>akson</b>, długa wypustka przewodząca impulsy, rozgałęzia się do tych włókien.'),
  picture('motor-labelled','Trzy włókna są przykładem, a nie stałą wielkością jednostki.',[0,0,1024,652]),
  paragraph('Jeden mięsień zawiera wiele takich jednostek. Włókna należące do różnych neuronów mogą być przemieszane — jednostka nie jest osobnym, zwartym kawałkiem mięśnia.'),
  picture('motor-units','Kolor oznacza przynależność włókna do neuronu, nie typ włókna. Motor unit = jednostka; motor pool = pula neuronów mięśnia.'),
  hint('Jednostka','Jeden dowódca i cała jego drużyna, nawet gdy ludzie stoją w różnych miejscach.')
 ],[
  paragraph('<b>Rekrutacja</b> oznacza dołączanie jednostek. Przy stopniowym zwiększaniu wymagań zwykle najpierw aktywują się jednostki o niższym progu, potem o wyższym — to zasada wielkości. Wcześniejsze jednostki mogą nadal pracować.'),
  picture('motor-labelled','Każdy nowy neuron oznacza kolejną aktywną jednostkę.',[14,662,562,617]),
  paragraph('<b>Częstość pobudzeń</b> dotyczy jednostek już aktywnych. Gdy następny impuls przychodzi przed pełnym rozluźnieniem włókna, odpowiedzi mogą się sumować i zwiększać napięcie.'),
  picture('motor-labelled','Ten sam neuron, różne odstępy między impulsami. Kreski nie mają skali czasu.',[584,662,428,617]),
  paragraph('W zmęczeniu dodatkowe pobudzanie i rekrutacja mogą częściowo kompensować spadek możliwości włókien. Ta rezerwa jest ograniczona; nie gwarantuje utrzymania siły ani prędkości ruchu.')
 ]],
 energy:[[
  paragraph('Mostki miozynowe i pompy komórki zużywają <b>ATP</b>. Jego niewielki zapas musi być stale odtwarzany z ADP. Trzy współpracujące systemy robią to różnymi drogami:'),
  {type:'pathways'},
  paragraph('Glikoliza zachodzi w <b>cytoplazmie</b>. Mitochondria uczestniczą w przemianach tlenowych. Udział systemów zależy m.in. od intensywności, czasu wysiłku i dostępności substratów; nie przełączają się kolejno jak trzy wyłączniki.'),
  picture('energy','Pomarańczowe mitochondria leżą między czerwonymi miofibrylami. Ilustracja nie pokazuje udziału systemów.')

 ],[
  paragraph('Spadek prędkości kolejnych powtórzeń jest <b>obserwacją</b>. Nie mierzy bezpośrednio stężenia ATP, PCr ani aktywności układu nerwowego.'),
  {type:'model',id:'velocity',caption:'Przykładowy trend prędkości. To model dydaktyczny, nie zapis badania ani Twojej serii.'},
  paragraph('W intensywnej serii maleje PCr, a zmiany m.in. stężenia <b>Pi</b> mogą zaburzać pracę mostków i regulację wapnia. Może zmieniać się też pobudzanie nerwowe. Zmęczenie ma więc kilka współdziałających mechanizmów.'),
  study('fatigue','Allen i wsp. omawiają mechanizmy komórkowe, których znaczenie zależy od warunków. Zwolnienie ruchu nie oznacza, że cały zapas ATP spadł do zera.'),
  paragraph('Po przerwie odtworzenie części PCr może poprawić wynik, ale sama poprawa nie dowodzi tej jednej przyczyny. <b>Mleczan</b> może być paliwem; nie wyjaśnia sam całego zmęczenia ani bolesności następnego dnia.')
 ]],
 fuel:[[
  paragraph('Trawienie węglowodanów dostarcza cukrów prostych. <b>Glukoza</b> po wchłonięciu trafia do krwi, a z niej do tkanek. Komórki mogą wykorzystać ją do odtwarzania ATP lub zmagazynować jako <b>glikogen</b>, rozgałęziony łańcuch jednostek glukozy. Znajduje się on w cytoplazmie, wewnątrz błony komórkowej.'),
  picture('glycogen-cell-v1.4','Przekrój pojedynczego włókna. Złote kulki i powiększenie są symboliczne, bez skali.'),
  {type:'comparison',rows:[['Mięsień','Własny glikogen wykorzystuje przede wszystkim lokalnie; nie uwalnia z niego wolnej glukozy do krwi tak jak wątroba.'],['Wątroba','Pomaga utrzymać glukozę we krwi, m.in. dla innych tkanek między posiłkami.']]},
  hint('Dwa magazyny','Mięsień ma własny prowiant; wątroba jest wspólną spiżarnią.'),
  paragraph('Insulina wspiera pobieranie glukozy przez mięśnie, lecz skurcz również zwiększa jej transport. Insulina nie jest jedynym warunkiem dopływu paliwa podczas ruchu.')
 ],[
  paragraph('Białko z pokarmu jest trawione do <b>aminokwasów</b>. Komórka buduje z nich własne białka: rybosom łączy aminokwasy zgodnie z informacją mRNA. Nie przenosi gotowego białka z posiłku wprost do mięśnia.'),
  picture('nutrition','Rybosom tworzy łańcuch białkowy. Kolorowe elementy są umownymi symbolami.',[0,0,800,1024]),
  paragraph('<b>Kwasy tłuszczowe</b> są substratami przemian tlenowych. Aminokwasy również mogą uczestniczyć w metabolizmie energetycznym, więc podział „paliwo” i „budulec” nie jest bezwzględny.'),
  heading('Odbudowa fosfokreatyny'),
  paragraph('Podczas regeneracji ATP dostarcza fosforan do odbudowy <b>PCr</b>. To odwrotny kierunek niż szybkie odtwarzanie ATP kosztem PCr w wysiłku.'),
  {type:'reaction',label:'Regeneracja',left:'Kreatyna + ATP',right:'PCr + ADP'},
  study('creatine','Stanowisko ISSN opisuje korzyści kreatyny m.in. w powtarzanych intensywnych wysiłkach. Zwiększenie jej zasobu nie zastępuje glikogenu ani aminokwasów do budowy białek.')
 ]],
 adaptation:[[
  paragraph('<b>Hipertrofia</b> to powiększanie włókien mięśniowych po okresie treningu. Powtarzany bodziec mechaniczny uruchamia przebudowę białek; jej wynik zależy od tworzenia i rozkładu w czasie.'),
  picture('adaptation-labelled','Dwa równoczesne procesy w komórce. Strzałki nie mają skali ilościowej.',[0,70,1024,550]),
  paragraph('Wzrost syntezy białek po jednej sesji może obejmować naprawę i przebudowę, więc nie mówi wprost, o ile urośnie mięsień.'),
  study('protein','W 10-tygodniowym badaniu Damas i wsp. związek zintegrowanej syntezy białek z hipertrofią pojawił się po osłabieniu uszkodzeń treningowych. Pojedynczy wczesny pomiar nie wystarczał.'),
  paragraph('Siła może rosnąć także dzięki koordynacji, technice i zmianom sterowania nerwowego. Jej przyrost nie musi być proporcjonalny do zmiany rozmiaru mięśnia.')
 ],[
  paragraph('<b>Pompa</b> jest przejściową zmianą przepływu krwi i płynów po wysiłku. Hipertrofię ocenia się po czasie, w porównywalnych warunkach i poza ostrym obrzmieniem po sesji.'),
  picture('adaptation-labelled','Zbliżenie naczynia i przepływu po sesji.',[14,1085,397,410]),
  paragraph('Bolesność następnego dnia także nie mierzy wzrostu. Odtwarzanie substratów, naprawa struktur i odzyskiwanie sprawności mogą przebiegać w różnym tempie; brak bólu nie oznacza pełnej regeneracji każdego procesu.'),
  study('sleep','Lamon i wsp.: 13 młodych dorosłych, badanie krzyżowe, jedna noc całkowicie bez snu. Zmierzono niższą ostrą syntezę białek mięśniowych. Nie mierzono hipertrofii po miesiącach ani skutku skrócenia snu o godzinę.')
 ]],
 testosterone:[[
  paragraph('Oś <b>HPG</b> łączy podwzgórze, przysadkę i gonady — tutaj jądra. Podwzgórze leży w dolnej części mózgu, a przysadka poniżej niego, połączona szypułą.'),
  picture('hpg-labelled','Zbliżenie dwóch struktur mózgu uczestniczących w osi.',[0,86,675,584]),
  paragraph('Podwzgórze wydziela pulsacyjnie <b>GnRH</b> (gonadoliberynę). Pobudza to przysadkę do wydzielania <b>LH</b> (hormonu luteinizującego). LH dociera z krwią do <b>komórek Leydiga</b>, które produkują testosteron.'),
  picture('hpg-labelled','Komórki Leydiga leżą pomiędzy kanalikami nasiennymi. To powiększenie mikroskopowej struktury.',[340,928,435,510])
 ],[
  paragraph('Testosteron i powstający z jego części estradiol uczestniczą w <b>ujemnym sprzężeniu zwrotnym</b>: ograniczają dalsze pobudzanie osi w podwzgórzu i przysadce.'),
  picture('hpg-feedback-v1.4','Niebieskie strzałki: pobudzanie; pomarańczowa droga: hamowanie. Złote kółka są symbolem hormonu, nie jego budową chemiczną.'),
  paragraph('Gdy sygnał zwrotny słabnie, w sprawnej osi może wzrosnąć pobudzanie przez GnRH i LH. Rzeczywista odpowiedź zależy też od rytmów wydzielania, opóźnień i sprawności narządów.'),
  hint('Sprzężenie','Termostat ogranicza grzanie po osiągnięciu temperatury; reakcja nie jest natychmiastowa.'),
  study('west','West i wsp.: po 15 tygodniach większa ostra odpowiedź hormonalna nie dała dodatkowej hipertrofii ani siły trenowanych zginaczy. Wniosek dotyczy tego protokołu, nie braku biologicznego znaczenia hormonów.')
 ]],
 signals:[[
  paragraph('Hormon dociera z krwią, lecz odpowiedź wymaga <b>odpowiedniego receptora</b>. Insulina wiąże receptor w błonie komórki; wiele hormonów steroidowych działa przez receptory wewnątrz komórki. Dalsza odpowiedź zależy od tkanki.'),
  picture('signals','Fioletowy receptor jest w błonie, turkusowy — wewnątrz komórki. Pomarańczowe elementy oznaczają sygnały. Kolory są umowne.'),
  paragraph('W trzustce komórki <b>beta</b> wydzielają insulinę, wspierającą wykorzystanie i magazynowanie składników. Komórki <b>alfa</b> wydzielają glukagon, który pomaga wątrobie uwalniać glukozę do krwi.'),
  picture('endocrine-labelled','Trzustka i wskazane tkanki docelowe; narządy są w różnych skalach.',[14,86,594,704]),
  paragraph('Glukagon nie uruchamia rozpadu glikogenu mięśniowego tak jak wątrobowego. Wspólny sygnał we krwi nie oznacza identycznej reakcji każdego narządu.')
 ],[
  heading('Dwie części nadnercza'),
  paragraph('<b>Rdzeń</b> wydziela adrenalinę, uczestniczącą w szybkiej mobilizacji paliwa i odpowiedzi krążenia. <b>Kora</b> wydziela m.in. kortyzol. Jego działanie metaboliczne zależy od czasu i wielkości ekspozycji.'),
  picture('endocrine-labelled','Nadnercze leży na nerce; jego kora otacza rdzeń.',[614,86,399,704]),
  hint('Kortyzol','K jak kora i kortyzol.'),
  heading('Oś tarczycy'),
  paragraph('Podwzgórze wydziela <b>TRH</b>, przysadka <b>TSH</b>, a pobudzona tarczyca w szyi — <b>T3 i T4</b>. Te hormony wpływają m.in. na ekspresję genów i tempo przemian oraz hamują wcześniejsze piętra osi.'),
  picture('endocrine-labelled','Śledź jedną oś od góry do dołu; znak poprzeczny oznacza hamowanie.',[508,860,246,646]),
  paragraph('Krótka odpowiedź na wysiłek, przewlekła ekspozycja i podanie leku to różne warunki. Samo „więcej hormonu” nie oznacza zawsze lepszego ani gorszego efektu treningowego.')
 ]],
 evidence:[[
  paragraph('Znajomość mechanizmu pozwala postawić hipotezę, ale nie dowodzi, że program treningowy przyniesie dany efekt u ludzi. <b>Korelacja</b> oznacza współwystępowanie; nie rozstrzyga przyczyny.'),
  picture('evidence-labelled','Wspólny czynnik może wpływać na sen i wynik. Strzałki przedstawiają możliwe wyjaśnienie, nie wynik badania.',[0,404,1024,426]),
  paragraph('<b>Randomizacja</b>, czyli losowy przydział do grup, ogranicza systematyczne różnice początkowe. Nie naprawia jednak złego pomiaru, małej próby ani nieprzestrzegania protokołu.'),
  paragraph('Oceniaj wielkość i niepewność efektu oraz sposób badania. Brak statystycznie istotnej różnicy nie jest automatycznie dowodem identycznych efektów.')
 ],[
  paragraph('Sprawdź <b>co, u kogo i kiedy zmierzono</b>. Stężenie hormonu 30 minut po sesji jest innym wynikiem niż rozmiar mięśnia po tygodniach treningu. Wskaźnik pośredni nie zastępuje właściwego pomiaru efektu.'),
  picture('evidence-labelled','Oś czasu zestawia różne pomiary. Strzałka oznacza upływ czasu, nie związek przyczynowy.',[0,1097,1024,223]),
  paragraph('Podobnie poprawna odpowiedź zaraz po przeczytaniu tekstu nie dowodzi pamiętania tydzień później.'),
  picture('evidence-labelled','Dwie chwile sprawdzenia pamięci, rozdzielone przerwą.',[0,1320,1024,134]),
  study('retrieval','Roediger i Karpicke badali odtwarzanie z pamięci i późniejsze zapamiętanie. Metaanaliza Cepedy i wsp. wspiera rozłożenie nauki w czasie; konkretne odstępy tej aplikacji nie były testowane w tych badaniach.'),
  paragraph('Test od razu po lekcji sprawdza świeżo poznane pojęcia. Inne pytania w powtórce po przerwie sprawdzają, czy nadal rozpoznajesz poprawne zależności bez czytania teorii.')
 ]]
};
const TEACH_FILES={rotation:{src:'images/art/rotation-labelled.png',credit:'Adaptacja za OpenStax · Fundamentals of Nursing, 22.1 · CC BY-NC-SA 4.0'}};
const IMAGE_SIZES={movement:[1536,1024],rotation:[1536,1024],energy:[1536,1024],fuel:[1536,1024],nutrition:[1536,1024],signals:[1536,1024]};
function teachingFigure(id,caption,region=null){
 const f=TEACH_FILES[id]||ART_FILES[id]||{src:`images/art/${id}.png`,credit:'Ilustracja wygenerowana · uproszczenie, bez skali'};
 let visual=`<img src="${f.src}" alt="${escapeHTML(caption)}" decoding="async">`;
 if(region){const [x,y,w,h]=region,[iw,ih]=IMAGE_SIZES[id]||[1024,1536];visual=`<span class="figure-window" style="aspect-ratio:${w}/${h};${w/h<0.6?`max-width:${w/h*64}dvh;margin-inline:auto;`:""}"><img src="${f.src}" alt="${escapeHTML(caption)}" decoding="async" style="width:${iw/w*100}%;height:${ih/h*100}%;left:${-x/w*100}%;top:${-y/h*100}%"></span>`;}
 return `<figure class="lesson-art teaching-art" data-plate="${id}" ${region?`data-region="${region.join(',')}"`:''}><button class="art-button" data-action="art-open" aria-label="Powiększ ilustrację">${visual}</button><figcaption>${caption}<span class="art-credit">${f.credit}</span></figcaption></figure>`;
}
function teachingSection(l,index){return `<section class="teaching" aria-label="Wyjaśnienie z ilustracjami">${TEACHING[l.id][index].map(b=>{
 if(b.type==='paragraph')return `<p>${b.text}</p>`;
 if(b.type==='heading')return `<h2>${b.text}</h2>`;
 if(b.type==='figure')return teachingFigure(b.id,b.caption,b.region);
 if(b.type==='hint')return `<details class="memory-hint"><summary>Skojarzenie: ${b.label}</summary><p>${b.text}</p></details>`;
 if(b.type==='study')return `<aside class="study-note"><p>${b.text}</p><a href="${SOURCE[b.source].url}">${SOURCE[b.source].title}</a></aside>`;
 if(b.type==='model')return b.id==='velocity'?`<figure class="diagram">${energyDiagram(true)}<figcaption>${b.caption}</figcaption></figure>`:diagram(b.id,b.caption);
 if(b.type==='comparison')return `<dl class="tissue-comparison">${b.rows.map(([title,text])=>`<div><dt>${title}</dt><dd>${text}</dd></div>`).join('')}</dl>`;
 if(b.type==='reaction')return `<figure class="reaction"><figcaption>${b.label}</figcaption><div><span>${b.left}</span><span aria-label="prowadzi do">→</span><span>${b.right}</span></div></figure>`;
 if(b.type==='pathways')return `<div class="atp-pathways"><section><h2>Fosfokreatyna (PCr)</h2><p>PCr przekazuje fosforan ADP: PCr + ADP → kreatyna + ATP.</p></section><section><h2>Glikoliza</h2><p>Przemiany glukozy do pirogronianu dostarczają ATP; sama glikoliza nie wymaga tlenu.</p></section><section><h2>Przemiany tlenowe</h2><p>Utlenianie substratów pochodzących m.in. z węglowodanów i tłuszczów; wykorzystuje tlen.</p></section></div>`;
 return '';
 }).join('')}</section>`;}