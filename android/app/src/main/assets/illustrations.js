'use strict';
// Raster illustrations provide anatomical context; exact models remain separately labelled.
const ART={
 biceps:{first:'movement',second:'biceps',neutral:'movement',captions:['Ten sam zgięty łokieć; zmienia się ustawienie dłoni.','Przebieg mięśnia dwugłowego ramienia. Szczegóły przyczepów opisano poniżej.']},
 torque:{first:'torque',second:'press',neutral:'torque',captions:['Obciążenie w dłoni działa w pewnej odległości od osi łokcia.','Wyciskanie łączy ruch w barku i łokciu; zaznaczono piersiowy większy i triceps.']},
 sarcomere:{first:'sarcomere',second:'sliding-filaments',neutral:'sarcomere',captions:['Mięsień zawiera włókna, a włókna — miofibryle z powtarzającymi się sarkomerami.','U góry rozluźniony, u dołu skrócony sarkomer. Linie Z zbliżają się; grube filamenty zachowują długość.']},
 motor:{first:'motor',second:'motor-units',neutral:'sarcomere',captions:['Jedna jednostka motoryczna: neuron i unerwiane przez niego włókna. Trzy włókna są przykładem, nie stałą liczbą.','Każdy kolor łączy neuron z jego włóknami. Kolor nie oznacza typu włókna ani kolejności rekrutacji.']},
 energy:{first:'energy',second:'press',neutral:'energy',captions:['Wnętrze włókna mięśniowego: miofibryle i mitochondria. Ilustracja nie pokazuje udziału dróg odtwarzania ATP.','Spowolnienie ruchu jest obserwacją; samo nie wskazuje jednej przyczyny zmęczenia.']},
 fuel:{first:'fuel',second:'nutrition',neutral:'fuel',captions:['Wątroba i mięśnie mogą magazynować glikogen; wykorzystują go w różny sposób.','Synteza białek i przemiany energetyczne to różne procesy. Kreatyna nie zastępuje aminokwasów.']},
 adaptation:{first:'adaptation',second:'sleep',neutral:'sleep',captions:['Powiększony rybosom tworzy łańcuch białkowy. Elementy i skala są uproszczone; włókno mięśniowe ma wiele jąder.','Sen jest kontekstem regeneracji. Wyniki pojedynczego eksperymentu opisano w tekście i źródłach.']},
 testosterone:{first:'hpg',second:'hpg',neutral:'hpg',captions:['Mózg z okolicą podwzgórza i przysadki oraz przekrój jądra z komórkami między kanalikami.','Narządy tej samej osi hormonalnej; sprzężenie zwrotne opisano w tekście.']},
 signals:{first:'signals',second:'glands',neutral:'glands',captions:['Receptor może znajdować się w błonie lub wewnątrz komórki; zależy to od rodzaju sygnału.','Od lewej: tarczyca, trzustka oraz przekrój nadnercza na nerce. Narządy pokazano w różnych skalach.']},
 evidence:{first:'evidence',second:'learning',neutral:'learning',captions:['Pomiar mięśnia i dokumentowanie obserwacji. Ilustracja nie zawiera wyników badania.','Odtwarzanie z pamięci: próba wyjaśnienia przy zamkniętym podręczniku.']}
};
const ART_FILES={
 'sliding-filaments':{src:'images/sliding-filaments.webp',credit:'OpenStax · ryc. 10.10 · CC BY-NC-SA 4.0'},
 'motor-units':{src:'images/motor-units.png',credit:'Casey Henley, MSU · CC BY-NC-SA 4.0'}
};
const ART_ALT={
 biceps:'Anatomiczna ilustracja ramienia z odsłoniętym bicepsem, kośćmi i ścięgnami',
 movement:'Dwa ustawienia dłoni osoby siedzącej z łokciem zgiętym',
 torque:'Osoba trzyma mały ciężar na poziomym przedramieniu',
 press:'Wyciskanie sztangi na ławce z zaznaczonymi mięśniami klatki i ramienia',
 sarcomere:'Powiększenie włókien mięśniowych i miofibryli',
 motor:'Neuron ruchowy z rozgałęzionym aksonem i włóknami mięśniowymi',
 energy:'Przekrój komórki mięśniowej i powiększone mitochondrium',
 fuel:'Wątroba i mięśnie oraz powiększenia ich komórek',
 nutrition:'Rybosom i mitochondrium jako struktury uczestniczące w różnych procesach',
 adaptation:'Przekrój włókna mięśniowego i rybosom tworzący łańcuch białkowy',
 sleep:'Osoba śpiąca i osobna ilustracja włókna mięśniowego',
 hpg:'Przekrój mózgu oraz przekrój jądra i komórki między kanalikami',
 signals:'Błona komórki, receptory i jądro komórkowe',
 glands:'Tarczyca, trzustka oraz nadnercze na nerce',
 evidence:'Pomiar ultrasonograficzny mięśnia i zapisywanie obserwacji',
 learning:'Osoba pisząca z pamięci przy zamkniętym podręczniku',
 'sliding-filaments':'Podręcznikowe porównanie rozluźnionego i skróconego sarkomeru',
 'motor-units':'Trzy neurony i unerwiane przez nie włókna jednego mięśnia'
};
function artFigure(l,kind='neutral',index=0){
 const a=ART[l.id],id=kind==='theory'?(index===0?a.first:a.second):kind==='summary'?a.second:a.neutral;
 const file=ART_FILES[id]||{src:`images/art/${id}.png`,credit:'Ilustracja wygenerowana · uproszczona, bez skali'};
 const caption=kind==='theory'?a.captions[index]:kind==='summary'?a.captions[1]:kind==='practice'&&l.id==='biceps'?'Porównaj ustawienia dłoni przy podobnym zgięciu łokcia.':'Ilustracja tematu · bez podpisów odpowiedzi';
 return `<figure class="lesson-art"><button class="art-button" data-action="art-open" aria-label="Powiększ ilustrację"><img src="${file.src}" alt="${ART_ALT[id]}" decoding="async"></button><figcaption>${caption}<span class="art-credit">${file.credit} · dotknij, aby powiększyć</span></figcaption></figure>`;
}
function openArt(el){
 const figure=el.closest('figure'),dialog=document.createElement('dialog');
 dialog.className='art-dialog';dialog.innerHTML=`<div class="art-dialog-bar"><button type="button" class="text-button art-zoom" aria-pressed="false">Powiększ szczegóły</button><button type="button" class="text-button art-close">Zamknij</button></div><div class="art-scroll"><img src="${figure.querySelector('img').getAttribute('src')}" alt="${figure.querySelector('img').alt}"></div><p class="small art-dialog-caption">${figure.querySelector('figcaption').innerHTML}</p>`;
 document.body.append(dialog);dialog.querySelector('.art-close').onclick=()=>dialog.close();
 dialog.querySelector('.art-zoom').onclick=e=>{const zoomed=dialog.classList.toggle('zoomed');e.currentTarget.setAttribute('aria-pressed',String(zoomed));e.currentTarget.textContent=zoomed?'Pokaż całość':'Powiększ szczegóły';};
 dialog.addEventListener('close',()=>dialog.remove());dialog.showModal();
}
