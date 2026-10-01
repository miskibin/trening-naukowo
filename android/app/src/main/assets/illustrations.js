'use strict';
const ART_FILES={
 'sliding-filaments':{src:'images/sliding-filaments.webp',credit:'OpenStax · ryc. 10.10 · CC BY-NC-SA 4.0'},
 'motor-units':{src:'images/motor-units.png',credit:'Casey Henley, MSU · CC BY-NC-SA 4.0'}
};
function artFigure(){return teachingFigure('movement','Porównaj ustawienia dłoni przy podobnym zgięciu łokcia.');}
function openArt(el){
 if(document.querySelector('.art-dialog[open]'))return;
 const figure=el.closest('figure'),dialog=document.createElement('dialog'),scrollYBefore=window.scrollY;
 dialog.className='art-dialog';dialog.setAttribute('aria-label','Ilustracja na pełnym ekranie');
 dialog.innerHTML=`<div class="art-dialog-bar"><button type="button" class="viewer-minus" aria-label="Zmniejsz ilustrację">−</button><button type="button" class="art-zoom" aria-pressed="false">Powiększ</button><button type="button" class="viewer-plus" aria-label="Powiększ ilustrację">+</button><button type="button" class="art-close">Zamknij</button></div><div class="art-scroll" tabindex="0" role="region" aria-label="Ilustracja. Powiększ dwoma palcami, przesuń jednym. Klawisze plus, minus i strzałki; zero pokazuje całość."><div class="art-stage"></div></div><details class="art-description"><summary>Opis i źródło <span class="viewer-scale">100%</span></summary><div class="art-dialog-caption"></div></details>`;
 const image=figure.querySelector('img').cloneNode();image.removeAttribute('class');image.removeAttribute('loading');image.removeAttribute('style');image.draggable=false;
 const canvas=dialog.querySelector('.art-scroll'),stage=dialog.querySelector('.art-stage');const piece=document.createElement('div');piece.className='art-piece';stage.append(piece);piece.append(image);
 const selectedRegion=figure.dataset.region?.split(',').map(Number);
 const caption=figure.querySelector('figcaption');if(caption)dialog.querySelector('.art-dialog-caption').append(...Array.from(caption.childNodes,n=>n.cloneNode(true)));
 let zoom=1,closed=false;const points=new Map();let gesture=null;
 const previousOverflow=document.body.style.overflow;document.body.style.overflow='hidden';
 function resize(next=zoom){
  if(closed||!image.naturalWidth)return;
  const oldWidth=stage.offsetWidth||1,oldHeight=stage.offsetHeight||1;
  const centerX=(canvas.scrollLeft+canvas.clientWidth/2)/oldWidth,centerY=(canvas.scrollTop+canvas.clientHeight/2)/oldHeight;
  zoom=Math.max(1,Math.min(6,next));
  const [rx,ry,rw,rh]=selectedRegion||[0,0,image.naturalWidth,image.naturalHeight];
  const fit=Math.min(canvas.clientWidth/rw,canvas.clientHeight/rh);
  const w=rw*fit*zoom,h=rh*fit*zoom;
  stage.style.width=Math.max(canvas.clientWidth,w)+'px';stage.style.height=Math.max(canvas.clientHeight,h)+'px';
  piece.style.width=w+'px';piece.style.height=h+'px';
  image.style.width=image.naturalWidth*fit*zoom+'px';image.style.height=image.naturalHeight*fit*zoom+'px';
  image.style.left=-rx*fit*zoom+'px';image.style.top=-ry*fit*zoom+'px';
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
