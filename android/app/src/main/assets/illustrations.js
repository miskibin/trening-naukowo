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
 if(document.querySelector('.art-dialog[open]'))return;
 const figure=el.closest('figure'),dialog=document.createElement('dialog'),scrollYBefore=window.scrollY;
 dialog.className='art-dialog';dialog.setAttribute('aria-label','Ilustracja na pełnym ekranie');
 dialog.innerHTML=`<div class="art-dialog-bar"><button type="button" class="viewer-minus" aria-label="Zmniejsz ilustrację">−</button><button type="button" class="art-zoom" aria-pressed="false">Powiększ</button><button type="button" class="viewer-plus" aria-label="Powiększ ilustrację">+</button><button type="button" class="art-close">Zamknij</button></div><div class="art-scroll" tabindex="0" role="region" aria-label="Ilustracja. Powiększ dwoma palcami, przesuń jednym. Klawisze plus, minus i strzałki; zero pokazuje całość."><div class="art-stage"></div></div><details class="art-description"><summary>Opis i źródło <span class="viewer-scale">100%</span></summary><div class="art-dialog-caption"></div></details>`;
 const image=figure.querySelector('img').cloneNode();image.removeAttribute('class');image.removeAttribute('loading');image.draggable=false;
 const canvas=dialog.querySelector('.art-scroll'),stage=dialog.querySelector('.art-stage');stage.append(image);
 const caption=figure.querySelector('figcaption');if(caption)dialog.querySelector('.art-dialog-caption').append(...Array.from(caption.childNodes,n=>n.cloneNode(true)));
 let zoom=1,closed=false;const points=new Map();let gesture=null;
 const previousOverflow=document.body.style.overflow;document.body.style.overflow='hidden';
 function resize(next=zoom){
  if(closed||!image.naturalWidth)return;
  const oldWidth=stage.offsetWidth||1,oldHeight=stage.offsetHeight||1;
  const centerX=(canvas.scrollLeft+canvas.clientWidth/2)/oldWidth,centerY=(canvas.scrollTop+canvas.clientHeight/2)/oldHeight;
  zoom=Math.max(1,Math.min(6,next));
  const fit=Math.min(canvas.clientWidth/image.naturalWidth,canvas.clientHeight/image.naturalHeight);
  const w=image.naturalWidth*fit*zoom,h=image.naturalHeight*fit*zoom;
  stage.style.width=Math.max(canvas.clientWidth,w)+'px';stage.style.height=Math.max(canvas.clientHeight,h)+'px';
  image.style.width=w+'px';image.style.height=h+'px';
  canvas.scrollLeft=zoom===1?0:centerX*stage.offsetWidth-canvas.clientWidth/2;
  canvas.scrollTop=zoom===1?0:centerY*stage.offsetHeight-canvas.clientHeight/2;
  dialog.classList.toggle('zoomed',zoom>1);const toggle=dialog.querySelector('.art-zoom');
  toggle.setAttribute('aria-pressed',String(zoom>1));toggle.textContent=zoom>1?'Całość':'Powiększ';
  dialog.querySelector('.viewer-minus').disabled=zoom===1;dialog.querySelector('.viewer-plus').disabled=zoom===6;
  dialog.querySelector('.viewer-scale').textContent=Math.round(zoom*100)+'%';
 }
 dialog.querySelector('.art-close').onclick=()=>dialog.close();
 dialog.querySelector('.art-zoom').onclick=()=>resize(zoom>1?1:2.5);
 dialog.querySelector('.viewer-plus').onclick=()=>resize(zoom*1.5);
 dialog.querySelector('.viewer-minus').onclick=()=>resize(zoom/1.5);
 dialog.addEventListener('keydown',e=>{if(e.key==='+'||e.key==='='){e.preventDefault();resize(zoom*1.5);}if(e.key==='-'){e.preventDefault();resize(zoom/1.5);}if(e.key==='0'){e.preventDefault();resize(1);}});
 function beginGesture(){const p=[...points.values()];gesture=p.length===2?{distance:Math.hypot(p[0].x-p[1].x,p[0].y-p[1].y),zoom}:p.length===1?{x:p[0].x,y:p[0].y,left:canvas.scrollLeft,top:canvas.scrollTop}:null;}
 canvas.addEventListener('pointerdown',e=>{if(e.pointerType==='mouse'&&e.button!==0)return;points.set(e.pointerId,{x:e.clientX,y:e.clientY});canvas.setPointerCapture(e.pointerId);beginGesture();});
 canvas.addEventListener('pointermove',e=>{if(!points.has(e.pointerId))return;points.set(e.pointerId,{x:e.clientX,y:e.clientY});const p=[...points.values()];if(p.length===2&&gesture?.distance>0)resize(gesture.zoom*Math.hypot(p[0].x-p[1].x,p[0].y-p[1].y)/gesture.distance);else if(p.length===1&&gesture){canvas.scrollLeft=gesture.left+gesture.x-p[0].x;canvas.scrollTop=gesture.top+gesture.y-p[0].y;}});
 for(const name of ['pointerup','pointercancel','lostpointercapture'])canvas.addEventListener(name,e=>{points.delete(e.pointerId);beginGesture();});
 canvas.addEventListener('wheel',e=>{if(e.ctrlKey){e.preventDefault();resize(zoom*(e.deltaY<0?1.15:1/1.15));}},{passive:false});
 const observer=new ResizeObserver(()=>resize());observer.observe(canvas);image.onload=()=>resize();
 dialog.addEventListener('close',()=>{closed=true;observer.disconnect();window.NativeViewer?.setFullscreen(false);dialog.remove();document.body.style.overflow=previousOverflow;window.scrollTo(0,scrollYBefore);if(el.isConnected)el.focus({preventScroll:true});});
 document.body.append(dialog);dialog.showModal();window.NativeViewer?.setFullscreen(true);resize();
}
