import {createRequire} from 'node:module';
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const require=createRequire(import.meta.url);
const {chromium}=require('C:/Users/skibi/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
await fs.mkdir('qa/art',{recursive:true});
const browser=await chromium.launch({channel:'chrome',headless:true});
const context=await browser.newContext({viewport:{width:412,height:892},isMobile:true,hasTouch:true});
const page=await context.newPage();const errors=[],failed=[];
page.on('pageerror',e=>errors.push(e.message));page.on('requestfailed',r=>failed.push(r.url()));
await page.goto('http://127.0.0.1:8974');
const ids=await page.evaluate(()=>LESSONS.map(l=>l.id));const report={screens:[],imageFiles:[]};
async function imageCheck(label){
 await page.locator('.lesson-art img').first().waitFor();
 await page.waitForFunction(()=>Array.from(document.querySelectorAll('.lesson-art img')).every(i=>i.complete&&i.naturalWidth>0));
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),true,label+' overflow');
 const srcs=await page.locator('.lesson-art img').evaluateAll(imgs=>imgs.map(i=>i.getAttribute('src')));
 report.screens.push({label,srcs});
}
for(const id of ids){
 for(const mode of ['learn','review'])for(let step=0;step<(mode==='learn'?6:3);step++){
  await page.evaluate(({id,mode,step})=>{
   state=freshState();state.completed=LESSONS.map(l=>l.id);state.reviews[id]={due:Date.now()+DAY,success:0,attempts:0};
   state.active={id,mode};const s=initSession();s.step=step;s.result={success:true,delayed:false};state.sessions[mode+':'+id]=s;route='lesson';save();render();
  },{id,mode,step});
  await imageCheck(`${id}:${mode}:${step}`);
  if(mode==='learn'&&step<2)await page.screenshot({path:`qa/art/${id}-${step}.png`,fullPage:true});
 }
}
// A visible image opens a real scrollable dialog. Android Back must close it without leaving the step.
await page.evaluate(()=>{state.active={id:'biceps',mode:'learn'};state.sessions['learn:biceps']=initSession();route='lesson';render();});
await page.locator('.art-button').first().click();assert(await page.locator('dialog').isVisible());
await page.locator('.art-zoom').click();assert.equal(await page.locator('.art-zoom').getAttribute('aria-pressed'),'true');
assert(await page.locator('.art-scroll').evaluate(el=>el.scrollWidth>el.clientWidth));
assert.equal(await page.evaluate(()=>window.appBack()),true);await page.locator('dialog').waitFor({state:'detached'});
assert.equal(await page.evaluate(()=>session().step),0);
await page.setViewportSize({width:360,height:760});await imageCheck('small phone 360');
await page.setViewportSize({width:892,height:412});await imageCheck('phone landscape');
// Decode every packaged image, including less frequently used secondary plates.
report.imageFiles=await page.evaluate(async()=>{
 const paths=[...new Set([...Object.values(ART).flatMap(a=>[a.first,a.second,a.neutral]).map(id=>ART_FILES[id]?.src||`images/art/${id}.png`),...Object.values(TEACHING).flat().flatMap(t=>t.plates.map(([id])=>TEACH_FILES[id]?.src||ART_FILES[id]?.src||`images/art/${id}.png`))])];
 return Promise.all(paths.map(async src=>{const i=new Image();i.src=src;await i.decode();return{src,width:i.naturalWidth,height:i.naturalHeight};}));
});
report.errors=errors;report.failedRequests=failed;
assert.deepEqual(errors,[]);assert.deepEqual(failed,[]);
await fs.writeFile('qa/art/report.json',JSON.stringify(report,null,2));
console.log(`PASS ${report.screens.length} screens, ${report.imageFiles.length} illustrations, zoom/native Back, 360px/landscape, no JS or load failures.`);
await browser.close();
