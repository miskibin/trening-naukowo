import {createRequire} from 'node:module';
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const {chromium}=createRequire(import.meta.url)('C:/Users/skibi/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const browser=await chromium.launch({channel:'chrome',headless:true});
const page=await browser.newPage({viewport:{width:412,height:892},isMobile:true,hasTouch:true});
const errors=[];page.on('pageerror',e=>errors.push(e.message));
await fs.mkdir('qa/editorial/panels',{recursive:true});await page.goto('http://127.0.0.1:8974');
const report={sections:[],panels:[],tests:[]};
const ids=await page.evaluate(()=>LESSONS.map(l=>l.id));
for(const id of ids)for(const step of [0,1]){
 await page.evaluate(({id,step})=>{state.active={id,mode:'learn'};state.sessions['learn:'+id]={...initSession(),step};route='lesson';render();},{id,step});
 await page.waitForFunction(()=>[...document.querySelectorAll('.teaching img')].every(i=>i.complete&&i.naturalWidth));
 assert.equal(await page.locator('.term-key,.mnemonics,.mechanism').count(),0);
 const paragraphs=await page.locator('.teaching>p').allTextContents();assert.equal(new Set(paragraphs).size,paragraphs.length);
 const text=await page.locator('.reader').innerText();report.sections.push({id,step,words:text.split(/\s+/).length,text});
 const figures=page.locator('.teaching .lesson-art');
 for(let index=0;index<await figures.count();index++){
  const figure=figures.nth(index);await figure.scrollIntoViewIfNeeded();
  const data=await figure.evaluate(f=>{const i=f.querySelector('img'),region=f.dataset.region?.split(',').map(Number);return{plate:f.dataset.plate,region,natural:[i.naturalWidth,i.naturalHeight],caption:f.querySelector('figcaption').childNodes[0].textContent,preceding:f.previousElementSibling?.tagName};});
  assert.equal(data.preceding,'P',id+':'+step+' figure lacks adjacent explanation');
  if(data.region){const [x,y,w,h]=data.region;assert(x>=0&&y>=0&&w>0&&h>0&&x+w<=data.natural[0]&&y+h<=data.natural[1]);}
  assert(data.caption.split(/\s+/).length<=35);
  assert(!['fuel-labelled','metabolism-labelled','sleep'].includes(data.plate));
  await figure.screenshot({path:`qa/editorial/panels/${id}-${step}-${index}.png`});
  await figure.locator('.art-button').click();
  await page.waitForFunction(()=>{const i=document.querySelector('.art-piece img');return i?.complete&&i.naturalWidth&&document.querySelector('.art-piece').offsetWidth>0;});
  await page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
  const fit=await page.evaluate(()=>{const p=document.querySelector('.art-piece'),c=document.querySelector('.art-scroll'),i=p.querySelector('img'),r=p.getBoundingClientRect();return{fits:r.width<=c.clientWidth+1&&r.height<=c.clientHeight+1,ratio:r.width/r.height,imgLeft:parseFloat(i.style.left),pieceWidth:r.width,descriptionOpen:document.querySelector('.art-description').open};});
  assert(fit.fits);assert.equal(fit.descriptionOpen,false);
  const r=data.region||[0,0,...data.natural];assert(Math.abs(fit.ratio/(r[2]/r[3])-1)<0.001,JSON.stringify({id,step,index,data,fit}));assert(Math.abs(fit.imgLeft+r[0]*fit.pieceWidth/r[2])<0.1);
  await page.locator('.art-zoom').click();assert.equal(await page.locator('.art-zoom').getAttribute('aria-pressed'),'true');
  assert(await page.locator('.art-scroll').evaluate(c=>c.scrollWidth>c.clientWidth||c.scrollHeight>c.clientHeight));
  await page.evaluate(()=>window.appBack());assert.equal(await page.evaluate(()=>session().step),step);
  report.panels.push({id,step,index,...data});
 }
}
for(const step of [2,4,5]){await page.evaluate(step=>{session().step=step;render();},step);assert.equal(await page.locator('.lesson-art').count(),0);}
await page.evaluate(()=>{route='home';render();});assert.equal(await page.locator('.lesson-art').count(),0);
const baseline=JSON.parse(await fs.readFile('qa/editorial-v1.3-baseline.json','utf8'));
report.visibleWords={before:baseline.reduce((n,r)=>n+r.words,0),after:report.sections.reduce((n,r)=>n+r.words,0)};
report.visibleWords.reductionPercent=Math.round((1-report.visibleWords.after/report.visibleWords.before)*100);
assert.deepEqual(errors,[]);
report.tests=['20 ordered sections, no repeated glossary/mnemonic/chain layer','Every raster figure follows its contextual paragraph','Selected regions stay inside the actual source image','Every full-screen view fits and retains the selected region','Zoom/pan space and Back without changing lesson step','Home, quiz, recall and conclusion omit decorative raster images'];
await fs.writeFile('qa/editorial-v1.4.json',JSON.stringify(report,null,2));
console.log(`PASS ${report.sections.length} sections, ${report.panels.length} contextual panels; visible words ${report.visibleWords.before} → ${report.visibleWords.after} (${report.visibleWords.reductionPercent}% less).`);
await browser.close();