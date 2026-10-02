'use strict';
const KEY='trening-naukowo-v1';
const DAY=86400000;
const app=document.getElementById('app');
const escapeHTML=t=>String(t??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const freshState=()=>({version:2,completed:[],completedAt:{},sessions:{},reviews:{},active:null});
let storageError=false,state=readState();
let route=state.active?'lesson':'home';

function readState(){
 try{
  const s=JSON.parse(localStorage.getItem(KEY));if(!s)return freshState();
  if(![1,2].includes(s.version)||!Array.isArray(s.completed)||!s.sessions||!s.reviews||!s.completedAt)throw Error('format');
  s.completed=s.completed.filter(id=>LESSONS.some(l=>l.id===id));
  if(s.active&&!LESSONS.some(l=>l.id===s.active.id))s.active=null;
  for(const [key,value] of Object.entries(s.sessions)){
   value.knowledge??={index:0,answers:[]};
   // The old observation had no answer key; it cannot count as a correct quiz.
   if(s.version===1){if(key==='learn:biceps')value.practice={};if(key.startsWith('learn:')&&value.step===5)value.step=4;}
  }
  s.version=2;return s;
 }catch(e){storageError=true;return freshState();}
}
function save(){try{localStorage.setItem(KEY,JSON.stringify(state));storageError=false;}catch(e){storageError=true;}}
function shuffle(items){const a=[...items];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
const arrow='<svg viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7"/></svg>';
const info='<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7v1"/></svg>';
function formatDate(time){return new Date(time).toLocaleDateString('pl-PL',{day:'numeric',month:'long'});}
function nextLesson(){return LESSONS.find(l=>!state.completed.includes(l.id));}
function currentLesson(){return LESSONS.find(l=>l.id===state.active?.id);}
function session(){return state.sessions[sessionKey()];}
function sessionKey(){return state.active.mode+':'+state.active.id;}
function initSession(){return {step:0,check:{},practice:{},knowledge:{index:0,answers:[]},reviewCorrect:null};}
function storageWarning(){return storageError?'<p class="warning" role="alert">Nie udało się odczytać lub zapisać postępu. Zachowaj aplikację otwartą; sprawdź wolne miejsce na urządzeniu. Nie odinstalowuj aplikacji, jeśli chcesz zachować dane.</p>':'';}
function render(resetScroll=true){const focused=document.activeElement;const focusAction=focused?.dataset?.action,focusIndex=focused?.dataset?.index,focusId=focused?.id;if(state.active&&!currentLesson()){state.active=null;route='home';save();}const content=route==='home'?renderHome():route==='reviews'?renderReviews():route==='about'?renderAbout():renderLesson();app.innerHTML=`<div class="shell">${storageWarning()}${content}</div>`;bind();if(resetScroll){window.scrollTo(0,0);const heading=app.querySelector('h1');if(heading){heading.tabIndex=-1;heading.focus({preventScroll:true});}}else{const candidate=focusId?document.getElementById(focusId):[...app.querySelectorAll('[data-action]')].find(e=>e.dataset.action===focusAction&&e.dataset.index===focusIndex&&!e.disabled);candidate?.focus({preventScroll:true});}}
function header(title){return `<header class="topbar"><span class="brand">${title}</span><button class="icon-button" data-action="about" aria-label="O aplikacji i danych">${info}</button></header>`;}
function renderHome(){const next=nextLesson();let saved=state.active;const resumable=saved?LESSONS.find(l=>l.id===saved.id):null;const display=resumable||next;const due=LESSONS.filter(l=>state.reviews[l.id]&&state.reviews[l.id].due<=Date.now());let c=header('Trening Naukowo');if(display){const s=resumable?session():null;c+=`<section class="continue"><p class="eyebrow">${resumable?'Kontynuuj':'Następna lekcja'} · ${display.minutes} min</p><h1>${display.title}</h1><p class="small">${display.goal}</p><button class="primary" data-action="start" data-id="${display.id}" data-mode="${saved?.mode||'learn'}">${resumable?'Wróć do zapisanego kroku':'Rozpocznij'}</button>${s?`<div class="progress-caption"><span>${saved.mode==='review'?'Powtórka':'Lekcja'} · krok ${s.step+1}/${saved.mode==='review'?3:6}</span><span>Postęp zapisany</span></div>`:''}</section>`;}else c+='<section class="continue"><h1>Ścieżka ukończona</h1><p>Do tych mechanizmów wrócisz w powtórkach. Powtórki sprawdzają wiedzę na innych pytaniach niż quiz kończący lekcję.</p></section>';
if(state.completed.length)c+=`<section class="review-entry"><h2>Powtórki${due.length?' · '+due.length+' na dziś':''}</h2><p class="small">${due.length?'Nowy przykład, bez wcześniejszego podglądania teorii.':`Najbliższy termin: ${formatDate(Math.min(...Object.values(state.reviews).map(r=>r.due)))}.`}</p><button class="text-button" data-action="reviews">${due.length?'Przejdź do powtórek →':'Zobacz terminy →'}</button></section>`;
c+='<h2 class="section-title">Ścieżka nauki</h2>';let chapter='';LESSONS.forEach((l,i)=>{if(l.chapter!==chapter){chapter=l.chapter;c+=`<h3 class="chapter-title chapter">${chapter}</h3>`;}const done=state.completed.includes(l.id),r=state.reviews[l.id],unlocked=done||l===next;c+=`<button class="lesson-row" data-action="start" data-mode="learn" data-id="${l.id}" ${unlocked?'':'disabled'}><span class="lesson-number ${done?'done':''}">${done?'✓':String(i+1).padStart(2,'0')}</span><span class="lesson-row-body"><span class="lesson-row-title">${l.title}</span><span class="lesson-row-detail">${done?`Lekcja ukończona · ${r?.success||0} udanych powtórek po czasie`:l.short+' · '+l.minutes+' min'}${!unlocked?' · po poprzedniej lekcji':''}</span></span><span class="chevron" aria-hidden="true">›</span></button>`;});c+=`<footer class="home-bottom"><span class="small">${state.completed.length}/${LESSONS.length} lekcji ukończonych</span><button class="text-button" data-action="about">Dane i źródła</button></footer>`;return c;}
function renderReviews(){let c=`<header class="reader-header"><button class="icon-button" data-action="home" aria-label="Wróć do startu">${arrow}</button><span>Powtórki</span></header><main class="reader"><h1>Przypomnij bez podglądania</h1><p class="small">Ukończenie lekcji i rozwiązanie zadania po czasie są zapisywane osobno. Wcześniejsza próba nie przesuwa terminu.</p><div class="review-list">`;const reviews=LESSONS.filter(l=>state.reviews[l.id]).sort((a,b)=>state.reviews[a.id].due-state.reviews[b.id].due);if(!reviews.length)c+='<p>Po ukończeniu pierwszej lekcji pojawi się tu jej powtórka.</p>';for(const l of reviews){const r=state.reviews[l.id],due=r.due<=Date.now();c+=`<button class="lesson-row" data-action="start" data-mode="review" data-id="${l.id}"><span class="lesson-row-body"><span class="lesson-row-title">${l.title}</span><span class="review-due">${due?'Na dziś':formatDate(r.due)+' · można przećwiczyć wcześniej'}</span><span class="lesson-row-detail">${r.success} udanych powtórek po czasie${r.attempts?' · '+r.attempts+' prób':''}</span></span><span class="chevron" aria-hidden="true">›</span></button>`;}return c+'</div></main>';}
function renderAbout(){return `<header class="reader-header"><button class="icon-button" data-action="home" aria-label="Wróć do startu">${arrow}</button><span>Dane i źródła</span></header><main class="reader"><h1>Twój kurs, na tym telefonie</h1><p>Dziesięć lekcji, zadania i ilustracje są zapisane w aplikacji i działają bez internetu. Nie potrzebujesz konta.</p><section class="about-section"><h2>Zapis postępu</h2><p>Każdy krok i odpowiedź są zapisywane lokalnie. Możesz wyjść z lekcji i wrócić do tego samego miejsca.</p><p class="small">Odinstalowanie aplikacji lub wyczyszczenie jej danych usuwa postęp. Zachowaj APK i zainstaluj aktualizację bez wcześniejszej deinstalacji.</p></section><section class="about-section"><h2>Co oznaczają powtórki?</h2><p>Po ukończeniu lekcji pierwsza powtórka przypada następnego dnia. Udana próba bez wcześniejszej pomocy wydłuża odstęp kolejno do 3, 7, 14 i 30 dni. Po błędzie w pierwszej odpowiedzi temat wraca następnego dnia.</p><p class="small">Quizy mają zapisany klucz odpowiedzi. Termin wydłuża się po poprawnym rozwiązaniu wszystkich pytań powtórki bez wcześniejszego pokazania odpowiedzi. Odstępy 1–3–7–14–30 dni są regułą kursu.</p><ul class="rubric"><li><a href="${SOURCE.retrieval.url}">Roediger i Karpicke (2006) — odtwarzanie z pamięci</a></li><li><a href="${SOURCE.spacing.url}">Cepeda i wsp. (2006) — rozłożenie nauki w czasie</a></li></ul></section><section class="about-section"><h2>Materiały naukowe</h2><p>Bibliografia jest dostępna po rozwinięciu przy każdej lekcji. Rysunki są uproszczone; modele i wykresy dydaktyczne nie przedstawiają Twoich pomiarów.</p><p>Krótkie skojarzenia można rozwinąć przy wybranych pojęciach. Są autorską pomocą w nauce.</p><p class="small">Ilustracje źródłowe: Casey Henley, Michigan State University, <i>Introduction to Neuroscience</i>; OpenStax, <i>Anatomy and Physiology 2e</i>. CC BY-NC-SA 4.0. Informacje i linki przy odpowiednich ilustracjach.</p></section><section class="about-section"><h2>Zakres pierwszej wersji</h2><p>To kurs mechanizmów, nie pełny atlas. Każda część teorii ma zastosowanie do ćwiczenia, zapisu treningu lub oceny twierdzenia. Pytania sprawdzają wiedzę; aplikacja nie ocenia odczuć ani swobodnego tekstu.</p><p class="small">Internet jest potrzebny tylko do otwarcia publikacji w przeglądarce.</p></section><p class="small">Treści 1.5 · quizy wiedzy i zastosowania praktyczne</p></main>`;}
function sources(l){return `<details class="sources"><summary>Bibliografia</summary><ul>${l.sources.map(k=>`<li><a href="${SOURCE[k].url}">${SOURCE[k].title}</a><span class="source-kind">${SOURCE[k].kind}</span></li>`).join('')}</ul><p class="small">Publikacje otwierają się w przeglądarce. Lekcje i ilustracje działają offline.</p></details>`;}
function diagram(id,caption){return `<figure class="diagram">${DIAGRAMS[id]()}<figcaption>${caption||'Schemat dydaktyczny · bez skali'}</figcaption></figure>`;}
function readerHeader(s,review=false){const steps=review?3:6,canBack=s.step>0&&!(review&&s.result);return `<header class="reader-header"><button class="icon-button" data-action="previous" aria-label="${canBack?'Poprzedni krok':'Wyjdź i zachowaj postęp'}">${arrow}</button><div class="reader-progress" aria-label="Krok ${s.step+1} z ${steps}">${Array.from({length:steps},(_,i)=>`<span class="${i<=s.step?'filled':''}"></span>`).join('')}</div><span class="reader-count">${s.step+1}/${steps}</span><button class="text-button reader-exit" data-action="exit">Wyjdź</button></header>`;}
function footer(label,action,disabled=false){return `<footer class="footer"><button class="primary" data-action="${action}" ${disabled?'disabled':''}>${label}</button></footer>`;}

function renderLesson(){
 const l=currentLesson(),s=session();if(!s)return '';
 if(state.active.mode==='review')return renderReview(l,s);
 let body='',foot='';
 if(s.step<2){
  const t=l.theory[s.step],use=APPLICATIONS[l.id][s.step];
  body=`<p class="eyebrow">${l.chapter} · teoria</p><h1>${t.title}</h1>${teachingSection(l,s.step)}<aside class="application"><h2>${use.title}</h2><p>${use.text}</p></aside>${sources(l)}`;
  foot=footer(s.step===1?'Sprawdź wiedzę':'Dalej','next');
 }else if(s.step===2){
  const q=s.check.variant?l.retry:l.task;
  body=`<p class="eyebrow">${s.check.variant?'Inny przykład':'Sprawdzenie'}</p>${renderTask(q,s.check)}${sources(l)}`;foot=taskFooter(q,s.check,'check');
 }else if(s.step===3){const r=renderPractice(l,s.practice);body=r.body;foot=r.foot;
 }else if(s.step===4){const r=renderKnowledge(l,s,false);body=r.body;foot=r.foot;
 }else{
  const score=knowledgeScore(l,s,false);
  body=`<p class="eyebrow">Koniec lekcji</p><h1>${score.correct}/${score.total} w quizie wiedzy</h1><p class="small">${state.completed.includes(l.id)?'Termin zapisanej powtórki pozostaje bez zmian.':'Pierwsza powtórka jutro: inne pytania, bez wcześniejszego czytania teorii.'}</p>${sources(l)}`;
  foot=footer('Zakończ lekcję','complete');
 }
 return readerHeader(s)+`<main class="reader">${body}</main>`+foot;
}
function ensureTask(q,a){if(!a.order){a.order=shuffle(q.type==='order'?q.items.map((_,i)=>i):q.opts.map((_,i)=>i));if(q.type==='order'&&a.order.every((v,i)=>v===i))a.order.push(a.order.shift());a.selected=q.type==='order'?[]:null;save();}}
function renderTask(q,a,heading='h1',withArt=true){ensureTask(q,a);let content=`<${heading}>${q.q}</${heading}>`;if(q.type==='graph')content+=`<figure class="diagram">${energyDiagram(true)}<figcaption>Wykres modelowy, nie dane pomiarowe</figcaption></figure>`;
if(q.type==='order'){content+='<p class="small">Dotykaj etapów w kolejności. Dotknij wybranego etapu, aby go usunąć.</p><div class="order-slot">';content+=a.selected.length?a.selected.map((idx,i)=>`<button class="order-item" data-action="order-remove" data-index="${idx}" ${a.answered?'disabled':''}><span>${i+1}</span>${escapeHTML(q.items[idx])}</button>`).join(''):'<span class="small">Tu pojawi się Twój łańcuch.</span>';content+='</div><div class="order-pool">'+a.order.map(idx=>`<button data-action="order-add" data-index="${idx}" ${a.answered||a.selected.includes(idx)?'disabled':''}>${escapeHTML(q.items[idx])}</button>`).join('')+'</div>';}else content+='<div class="options" role="group" aria-label="Odpowiedzi">'+a.order.map((idx,i)=>`<button class="option ${a.selected===idx?'selected':''} ${a.answered&&a.selected===idx?(a.correct?'correct':'wrong'):''}" data-action="select" data-index="${idx}" aria-pressed="${a.selected===idx}" ${a.answered?'disabled':''}><span class="marker" aria-hidden="true">${String.fromCharCode(65+i)}</span><span>${escapeHTML(q.opts[idx])}</span></button>`).join('')+'</div>';
if(a.answered)content+=`<div class="feedback ${a.correct?'':'error'}" role="status"><h2>${a.correct?'Poprawna odpowiedź':'Poprawna odpowiedź: '+escapeHTML(q.type==='order'?q.items.join(' → '):q.opts[q.correct])}</h2><p>${q.why}</p></div>`;return content;}
function taskReady(q,a){return q.type==='order'?a.selected?.length===q.items.length:a.selected!==null&&a.selected!==undefined;}
function taskFooter(q,a,kind){if(!a.answered)return footer('Sprawdź odpowiedź','submit-'+kind,!taskReady(q,a));return footer(a.correct?'Dalej':'Zastosuj w innym przykładzie',a.correct?'next':'retry-'+kind);}
function renderPractice(l,p){
 const task=l.practice;let body='<p class="eyebrow">Zastosowanie</p>',foot='';
 if(p.variant){body+=renderTask(l.retry,p.transfer);return {body,foot:taskFooter(l.retry,p.transfer,'practice-transfer')};}
 const q=practiceQuestion(task);p.answer??={};
 if(!p.answer.answered){body+=renderTask(q,p.answer);return {body,foot:footer(task.type==='order'?'Sprawdź kolejność':'Sprawdź przewidywanie','submit-practice',!taskReady(q,p.answer))};}
 body+=`<h1>${task.title}</h1><div class="feedback ${p.answer.correct?'':'error'}" role="status"><p>${q.why}</p></div>${renderLab(task,p)}${task.note?`<p class="small">${task.note}</p>`:''}`;
 const interactive=['torque','sarcomere','motor','hpg'].includes(task.type);
 if(!p.answer.correct)foot=footer('Zastosuj w innym przykładzie','retry-practice');
 else if(!interactive)foot=footer('Dalej','next');
 else if(!p.touched){body+='<p class="small">Zmień warunek powyżej, potem zinterpretuj wynik.</p>';foot=footer('Najpierw zmień warunek','next',true);}
 else {p.interpret??={};const interpretation=labQuestion(task);body+=renderTask(interpretation,p.interpret,'h2',false);foot=taskFooter(interpretation,p.interpret,'interpret');}
 return {body,foot};
}
function labQuestion(t){
 const qs={
  torque:choice('Która zasada wyjaśnia zmianę wyniku po przesunięciu siły?',['Moment zmienia się proporcjonalnie do prostopadłego ramienia przy stałej sile.','Moment pozostaje stały, dopóki nie zmieni się długość kości.','Moment zależy od samej siły, a odległość wpływa tylko na zakres ruchu.'],0,'Model liczy moment jako 10 N razy prostopadłe ramię. To geometria linii działania siły, nie długość kości.'),
  sarcomere:choice('Co zmieniło się w modelu po zbliżeniu linii Z?',['Zwiększyło się nakładanie filamentów, bez zmiany ich długości.','Gruby filament skrócił się razem z całym sarkomerem.','Zmieniła się tylko długość aktyny, a nakładanie pozostało stałe.'],0,'Linie Z są bliżej, a filamenty zachowują długość. Skrócenie jednostki wynika z przesuwania.'),
  motor:choice('Który opis oddziela dwa zmieniane warunki?',['Liczba jednostek to rekrutacja; gęstość impulsów to częstość pobudzeń.','Gęstość impulsów oznacza dołączanie nowych jednostek, niezależnie od liczby neuronów.','Więcej jednostek oznacza, że każdy neuron przejął nowe włókna.'],0,'Rekrutacja zmienia liczbę aktywnych jednostek. Częstość zmienia sygnały w jednostkach już aktywnych.'),
  hpg:choice('Na które piętra wraca hamujący sygnał końcowy?',['Na podwzgórze i przysadkę.','Wyłącznie na komórki Leydiga, z pominięciem mózgu.','LH hamuje podwzgórze zamiast sygnału testosteronu i estradiolu.'],0,'W uproszczonej osi sygnał hormonów płciowych ogranicza wcześniejsze pobudzanie w podwzgórzu i przysadce.')
 };return qs[t.type];
}
function practiceQuestion(t){return t.type==='order'?{type:'order',q:t.question,items:t.items,why:'Kolejność rozdziela trawienie, wchłanianie i wykorzystanie w komórce. Zapis jako glikogen jest jedną z możliwości.'}:{type:'choice',q:t.question,opts:t.opts,correct:t.correct,why:t.why||(t.type==='torque'?'Przy stałej sile większe prostopadłe ramię daje większy moment.':t.type==='sarcomere'?'Filamenty przesuwają się względem siebie; gruby filament nie musi się skrócić.':t.type==='motor'?'Częstsze pobudzenia mogą zwiększać sumowanie odpowiedzi aktywnych włókien.':t.type==='hpg'?'Spadek sygnału zwrotnego osłabia hamowanie, co w sprawnej osi sprzyja większemu pobudzaniu przez LH.':t.type==='energy'?'Poprawę wyniku można obserwować bez pomiaru przyczyny. Odtworzenie PCr jest możliwym mechanizmem, lecz nie jedynym.':null)};}
function renderLab(t,p){if(t.type==='torque'){p.value??=20;return `<div class="lab"><div id="lab-diagram" class="diagram">${torqueDiagram(p.value)}</div><label class="lab-label" for="lab-range">Prostopadłe ramię <span id="lab-value">${p.value} cm</span></label><input id="lab-range" type="range" min="10" max="40" step="1" value="${p.value}" data-lab="torque"><p id="lab-output" class="lab-output">10 N × ${(p.value/100).toFixed(2)} m = ${(p.value/10).toFixed(1)} N·m</p></div>`;}if(t.type==='sarcomere'){p.value??=0;return `<div class="lab"><div id="lab-diagram" class="diagram">${sarcomereDiagram(p.value)}</div><label class="lab-label" for="lab-range">Zbliżenie linii Z</label><input id="lab-range" type="range" min="0" max="100" value="${p.value}" data-lab="sarcomere"><p class="lab-output">Gruby filament zachowuje długość.</p></div>`;}if(t.type==='motor'){p.units??=2;p.rate??=1;return `<div class="lab"><div class="diagram">${motorDiagram(p.units,p.rate)}</div><div class="lab-controls"><button data-action="motor-units">Jednostki: ${p.units} z 3</button><button data-action="motor-rate">Pobudzenia: ${p.rate===1?'rzadsze':'częstsze'}</button></div><p class="small">Liczba kresek oznacza jedynie względną częstość sygnałów, bez skali czasowej.</p></div>`;}if(t.type==='hpg'){p.low??=false;return `<div class="lab"><div class="diagram">${hpgDiagram(p.low)}</div><div class="lab-controls"><button data-action="hpg" aria-pressed="${p.low}">${p.low?'Przywróć sygnał wyjściowy':'Obniż sygnał zwrotny'}</button></div><p class="lab-output">${p.low?'Słabsze hamowanie → większe pobudzanie przez LH w modelu.':'Sygnał końcowy ogranicza dalsze pobudzanie.'}</p></div>`;}if(t.type==='energy')return diagram('energy','Model zależności · bez wartości udziałów');return '';}

function knowledgeQuestions(l,review){return review?l.reviewKnowledge:l.knowledge;}
function knowledgeScore(l,s,review){const questions=knowledgeQuestions(l,review);return {correct:questions.filter((_,i)=>s.knowledge.answers[i]?.correct===true).length,total:questions.length};}
function knowledgeComplete(l,s,review){return knowledgeQuestions(l,review).every((_,i)=>s.knowledge.answers[i]?.answered===true);}
function renderKnowledge(l,s,review){
 s.knowledge??={index:0,answers:[]};
 const k=s.knowledge,questions=knowledgeQuestions(l,review),q=questions[k.index];
 k.answers[k.index]??={};const a=k.answers[k.index];
 const body=`<p class="eyebrow">${review?'Powtórka wiedzy':'Quiz wiedzy'} · ${k.index+1}/${questions.length}</p>${renderTask(q,a)}`;
 const last=k.index===questions.length-1;
 return {body,foot:footer(a.answered?(last?(review?'Zapisz powtórkę':'Wynik quizu'):'Następne pytanie'):'Sprawdź odpowiedź',a.answered?(last?(review?'finish-review':'next'):'knowledge-next'):'submit-knowledge',!a.answered&&!taskReady(q,a))};
}

function renderReview(l,s){
 let body='',foot='';
 if(s.step===0){const q=s.check.variant?l.retry:l.review;body='<p class="eyebrow">Powtórka bez teorii</p>'+renderTask(q,s.check);foot=taskFooter(q,s.check,'review');
 }else if(s.step===1){const r=renderKnowledge(l,s,true);body=r.body;foot=r.foot;
 }else{
  const result=s.result;
  body=`<p class="eyebrow">Powtórka zapisana</p><h1>${result.delayed?(result.success?'Wszystkie pierwsze odpowiedzi poprawne':'Wrócimy do tego tematu jutro'):'Próba przed terminem zakończona'}</h1><p class="small">Kolejny termin: ${formatDate(state.reviews[l.id].due)}.${result.delayed?'':' Wcześniejsza próba nie przesuwa terminu.'}</p>`;
  foot=footer('Wróć do powtórek','close-review');
 }
 return readerHeader(s,true)+`<main class="reader">${body}</main>`+foot;
}
function start(id,mode='learn'){const l=LESSONS.find(l=>l.id===id);if(!l)return;if(mode==='review'&&!state.completed.includes(id))return;if(mode==='learn'&&!state.completed.includes(id)&&nextLesson()?.id!==id)return;state.active={id,mode};const key=sessionKey();state.sessions[key]??=initSession();route='lesson';save();render();}
function activeTask(){
 const l=currentLesson(),s=session(),review=state.active.mode==='review';
 if((review&&s.step===1)||(!review&&s.step===4)){const k=s.knowledge;return {q:knowledgeQuestions(l,review)[k.index],a:k.answers[k.index]};}
 if(review&&s.step===0)return {q:s.check.variant?l.retry:l.review,a:s.check};
 if(!review&&s.step===2)return {q:s.check.variant?l.retry:l.task,a:s.check};
 if(!review&&s.step===3){if(s.practice.variant)return {q:l.retry,a:s.practice.transfer};if(s.practice.touched&&s.practice.answer?.correct&&s.practice.interpret)return {q:labQuestion(l.practice),a:s.practice.interpret};return {q:practiceQuestion(l.practice),a:s.practice.answer};}
 return null;
}
function gradeTask(q,a){a.answered=true;a.correct=q.type==='order'?a.selected.every((v,i)=>v===i):a.selected===q.correct;}
function action(name,el){if(name==='art-open'){openArt(el);return;}if(name==='previous'){previousStep();return;}if(name==='home'){route='home';render();return;}if(name==='about'){route='about';render();return;}if(name==='reviews'){route='reviews';render();return;}if(name==='start'){start(el.dataset.id,el.dataset.mode);return;}if(name==='exit'){if(state.active?.mode==='review'&&session()?.result){delete state.sessions[sessionKey()];state.active=null;}route='home';save();render();return;}if(!state.active)return;const l=currentLesson(),s=session();if(name==='next'){const review=state.active.mode==='review';if((!review&&s.step===4&&!knowledgeComplete(l,s,false))||(review&&s.step===0&&s.check.correct!==true))return;s.step++;save();render();return;}if(name==='knowledge-next'){const k=s.knowledge;if(!k.answers[k.index]?.answered||k.index>=knowledgeQuestions(l,state.active.mode==='review').length-1)return;k.index++;save();render();return;}if(name==='select'){const t=activeTask();if(t&&!t.a.answered){t.a.selected=Number(el.dataset.index);save();render(false);}return;}if(name==='order-add'||name==='order-remove'){const t=activeTask();if(!t||t.a.answered)return;const idx=Number(el.dataset.index);if(name==='order-add'&&!t.a.selected.includes(idx))t.a.selected.push(idx);if(name==='order-remove')t.a.selected=t.a.selected.filter(v=>v!==idx);save();render(false);return;}
if(name.startsWith('submit-')){const t=activeTask();if(!t||!taskReady(t.q,t.a)||t.a.answered)return;gradeTask(t.q,t.a);if(state.active.mode==='review'&&s.step===0&&s.reviewCorrect===null)s.reviewCorrect=t.a.correct;save();render(false);app.querySelector('.feedback')?.scrollIntoView({block:'nearest'});return;}
if(name.startsWith('retry-')){if(s.step===3&&state.active.mode==='learn'){s.practice.variant=true;s.practice.transfer={};}else{s.check={variant:true};}save();render();return;}
if(name==='motor-units'){s.practice.units=s.practice.units%3+1;s.practice.touched=true;save();render(false);return;}if(name==='motor-rate'){s.practice.rate=s.practice.rate===1?3:1;s.practice.touched=true;save();render(false);return;}if(name==='hpg'){s.practice.low=!s.practice.low;s.practice.touched=true;save();render(false);return;}
if(name==='complete'){if(s.step!==5||!knowledgeComplete(l,s,false))return;if(!state.completed.includes(l.id)){state.completed.push(l.id);state.completedAt[l.id]=Date.now();state.reviews[l.id]={due:Date.now()+DAY,streak:0,attempts:0,success:0,history:[]};}delete state.sessions[sessionKey()];state.active=null;save();route='home';render();return;}
if(name==='finish-review'){if(s.result||!knowledgeComplete(l,s,true)||s.check.correct!==true)return;const r=state.reviews[l.id];const delayed=Date.now()>=r.due;const success=s.reviewCorrect===true&&knowledgeScore(l,s,true).correct===l.reviewKnowledge.length;if(delayed){r.attempts++;r.history.push({time:Date.now(),correctFirst:s.reviewCorrect,knowledgeCorrect:knowledgeScore(l,s,true).correct,knowledgeTotal:l.reviewKnowledge.length,success});if(success){r.success++;r.streak++;}else r.streak=0;const days=success?[3,7,14,30][Math.min(r.streak-1,3)]:1;r.due=Date.now()+days*DAY;}s.result={delayed,success};s.step=2;save();render();return;}
if(name==='close-review'){delete state.sessions[sessionKey()];state.active=null;save();route='reviews';render();}}
function bind(){app.querySelectorAll('[data-action]').forEach(el=>el.addEventListener('click',()=>action(el.dataset.action,el)));const slider=app.querySelector('[data-lab]');if(slider){slider.addEventListener('input',()=>{const p=session().practice;p.value=Number(slider.value);p.touched=true;save();if(slider.dataset.lab==='torque'){app.querySelector('#lab-diagram').innerHTML=torqueDiagram(p.value);app.querySelector('#lab-value').textContent=p.value+' cm';app.querySelector('#lab-output').textContent=`10 N × ${(p.value/100).toFixed(2)} m = ${(p.value/10).toFixed(1)} N·m`;}else app.querySelector('#lab-diagram').innerHTML=sarcomereDiagram(p.value);});slider.addEventListener('change',()=>render(false));}}
function previousStep(){
 const s=session(),review=state.active?.mode==='review';
 if(route==='lesson'&&s&&((review&&s.step===1)||(!review&&s.step===4))&&s.knowledge.index>0){s.knowledge.index--;save();render();return;}
 if(route==='lesson'&&s&&s.step>0&&!(review&&s.result)){s.step--;save();render();}
 else{if(review&&s?.result){delete state.sessions[sessionKey()];state.active=null;route='reviews';}else route='home';save();render();}
}
window.appBack=()=>{const art=document.querySelector('.art-dialog[open]');if(art){art.close();return true;}if(route!=='home'){if(route==='lesson')previousStep();else{route='home';save();render();}return true;}return false;};
window.addEventListener('pageshow',()=>render(false));
document.addEventListener('visibilitychange',()=>{if(document.hidden)save();});
render();
