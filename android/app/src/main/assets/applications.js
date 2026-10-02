'use strict';
const APPLICATIONS={
 biceps:[
  {title:'Uginanie z obrotem: patrz na przedramię',text:'W uginaniu z hantlem możesz zacząć z kciukiem ku górze, a podczas podnoszenia obrócić dłoń ku górze. To dwa niezależne ruchy. Zginanie nadgarstka nie zastępuje supinacji. Przy porównaniu techniki obserwuj ustawienie dłoni względem przedramienia i obrót przedramienia względem ramienia.'},
  {title:'Hantle, młotki czy sztanga?',text:'Hantle pozwalają każdej ręce osobno wybrać kąt obrotu; sztanga wiąże ustawienie obu dłoni. Uginanie młotkowe utrzymuje chwyt pośredni, ale nadal angażuje zginacze łokcia, w tym biceps. Porównuj progres osobno dla każdego chwytu: większy ciężar w młotkach nie jest wynikiem tego samego zadania co uginanie z supinacją.'}
 ],
 torque:[
  {title:'Wznosy bokiem: kilogramy nie wystarczą',text:'Jeśli przy wznosach coraz mocniej zginasz łokcie, skracasz odległość ciężaru od barku. Możesz podnieść więcej kilogramów bez proporcjonalnego wzrostu zewnętrznego momentu. Zapis „8 kg” porównuj z poprzednią sesją dopiero przy podobnym ugięciu łokcia i zakresie ruchu.'},
  {title:'Rozpiętki nie zastępują wyprostu łokcia',text:'W wyciskaniu zmieniasz położenie ramienia w barku i prostujesz łokieć. W rozpiętkach kąt łokcia pozostaje podobny, więc zadanie jest inne. Gdy planujesz pracę tricepsa, nie licz serii rozpiętek tak samo jak serii wyciskania lub prostowania na wyciągu.'}
 ],
 sarcomere:[
  {title:'Pauza jest częścią obciążenia',text:'Zatrzymanie hantla w połowie uginania nie daje tej samej przerwy co odłożenie go na stojak. Mięśnie nadal równoważą moment ciężaru. Zapisuj wariant z pauzą osobno: 10 płynnych powtórzeń i 10 powtórzeń z zatrzymaniem to różne zadania.'},
  {title:'Opuszczanie też jest pracą mięśnia',text:'Podczas kontrolowanego opuszczania zginacze łokcia mogą wytwarzać napięcie, mimo że się wydłużają — to praca ekscentryczna. Swobodne puszczenie ciężaru zmienia to zadanie. Przy porównywaniu serii zachowaj podobny sposób opuszczania; sama liczba uniesień nie opisuje całego powtórzenia.'}
 ],
 motor:[
  {title:'Progres w nowym ćwiczeniu',text:'Pierwsze sesje na nowej maszynie mogą poprawić wynik dzięki lepszemu sterowaniu ruchem. Aby odróżnić naukę ustawienia od zmiany zadania, zachowaj wysokość siedziska, chwyt i zakres ruchu w kolejnych próbach. Zapis ustawień pozwoli odtworzyć ćwiczenie zamiast za każdym razem uczyć się innej wersji.'},
  {title:'Liczba powtórzeń i zapas',text:'Zapis „10 powtórzeń” pomija to, czy mógłbyś wykonać jeszcze pięć, czy żadnego. Dodaj szacowany zapas powtórzeń przy tej samej technice. To informacja o wysiłku, a nie pomiar liczby aktywnych neuronów; pomaga porównywać serie o tej samej masie i liczbie powtórzeń.'}
 ],
 energy:[
  {title:'Stoper między seriami',text:'Dwie sesje z tym samym ciężarem mogą dać różną liczbę powtórzeń, jeśli raz odpoczywasz minutę, a raz trzy. Zapisuj długość przerwy razem z wynikiem. Inaczej spadek liczby powtórzeń może wyglądać jak utrata siły, choć zmieniłeś warunki regeneracji między seriami.'},
  {title:'Kolejna seria spadła z 8 do 5 powtórzeń',text:'Zanim obniżysz ciężar, możesz sprawdzić następną serię po dłuższej przerwie. Jeśli wynik wróci, uzyskasz praktyczną wskazówkę do organizacji sesji. Sam ten test nie określi, czy odpowiadała za to fosfokreatyna, regulacja wapnia czy sterowanie nerwowe.'}
 ],
 fuel:[
  {title:'Krótka przerwa nie resetuje całej sesji',text:'PCr i glikogen to różne zapasy. Po wielu seriach możesz odzyskać część zdolności do krótkiego wysiłku, pozostając z uszczuplonym glikogenem. Gdy porównujesz ćwiczenie wykonywane na początku i na końcu treningu, zanotuj jego miejsce w sesji — testujesz także skutek wcześniejszej pracy.'},
  {title:'Czytaj ilość białka, nie masę proszku',text:'Przykład etykiety: porcja odżywki waży 30 g, ale zawiera 23 g białka. Do zapisu posiłków dodajesz 23 g. Kreatyna ma inną rolę i nie wypełnia brakujących gramów białka; zakup kolejnego suplementu nie zmienia ilości aminokwasów dostarczanych z jedzenia.'}
 ],
 adaptation:[
  {title:'Dwa osobne zapisy: wynik i rozmiar',text:'Przy porównywaniu treningów zapisuj osiągi w konkretnym ćwiczeniu osobno od obwodu lub innych pomiarów rozmiaru. Wzrost liczby powtórzeń po opanowaniu techniki jest realnym progresem, ale nie przeliczysz go na centymetry bicepsa. To dwa różne wyniki, które mogą zmieniać się w różnym tempie.'},
  {title:'Pomiar obwodu przed czy po treningu?',text:'Nie zestawiaj pomiaru po ciężkiej sesji z pomiarem wykonanym przed treningiem. Pompa zmienia warunki porównania. Ustal powtarzalną porę i miejsce pomiaru; przy ocenie kolejnego treningu zapisuj osobno sen i wynik pierwszej serii, zamiast uznawać sam brak bolesności za pełną regenerację.'}
 ],
 testosterone:[
  {title:'Rozpoznaj obietnicę „pobudzenia osi”',text:'W reklamie preparatu zwróć uwagę, na które ogniwo ma on działać: GnRH, LH czy produkcję w jądrach. Zmiana jednego sygnału nie jest jeszcze pomiarem większej siły lub mięśni. Szukaj badania na ludziach mierzącego obiecany efekt treningowy, a nie samego opisu łańcucha hormonów.'},
  {title:'Dodatkowe serie tylko dla „piku hormonów”?',text:'W protokole Westa większa ostra odpowiedź hormonalna nie poprawiła adaptacji trenowanych zginaczy. Jeśli dodajesz serię, określ jej zadanie w planie: pracę konkretnej grupy lub zmianę objętości. Sam chwilowy pik testosteronu nie uzasadnia oczekiwania większego przyrostu bicepsa.'}
 ],
 signals:[
  {title:'Superseria biceps–triceps',text:'Uginanie i prostowanie łokcia obciążają różne mięśnie, z własnymi zapasami glikogenu. Biceps może odpoczywać podczas pracy tricepsa; jego zmęczenie nie oznacza zużycia lokalnego paliwa w tricepsie. Cała superseria nadal obciąża organizm, więc zmiana grupy nie jest tym samym co całkowity odpoczynek.'},
  {title:'„Kortyzol po treningu” nie ocenia programu',text:'Krótki pomiar po wysiłku opisuje ostrą odpowiedź, a nie całą ekspozycję w kolejnych dniach. Przy porównywaniu dwóch programów sprawdzaj ich wyniki w czasie i warunki odpoczynku. Nie zmieniaj planu wyłącznie dlatego, że trudniejsza sesja wywołała większą chwilową odpowiedź hormonalną.'}
 ],
 evidence:[
  {title:'„30% większy przyrost”: ile to jest?',text:'Hipotetyczny przykład: grupa A zyskała średnio 1,0 kg, a B 1,3 kg. Różnica to 0,3 kg, choć względnie wynosi 30%. Przy haśle reklamowym sprawdź wartość wyjściową, różnicę bezwzględną i niepewność pomiaru. Duży procent nie mówi sam, czy efekt będzie odczuwalny.'},
  {title:'Porównuj ten sam test, w tym samym miejscu sesji',text:'Jeśli wcześniej wyciskałeś jako pierwsze ćwiczenie, a teraz po rozpiętkach, liczba powtórzeń nie porównuje tych samych warunków. Do oceny postępu ustal kolejność, zakres i przerwy. Jeśli interesuje Cię trwały wynik, wykonaj porównanie po okresie treningu, a nie tylko po jednej udanej sesji.'}
 ]
};
