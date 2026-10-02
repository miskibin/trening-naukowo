import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import {launchBrowser} from './qa-browser.mjs';
const browser=await launchBrowser();
const context=await browser.newContext({viewport:{width:412,height:892},deviceScaleFactor:1,isMobile:true,hasTouch:true});
const page=await context.newPage(),errors=[],requests=[];
page.on('pageerror',e=>errors.push(e.message));page.on('requestfailed',r=>requests.push(r.url()));
const ev=(fn,arg)=>page.evaluate(fn,arg);
const click=name=>page.locator(`[data-action="${name}"]`).first().click();
const solve=async(correct=true)=>{
 const q=await ev(()=>activeTask().q);
 if(q.type==='order'){const indices=q.items.map((_,i)=>i);if(!correct)indices.reverse();for(const index of indices)await page.locator(`[data-action="order-add"][data-index="${index}"]`).click();}
 else await page.locator(`[data-action="select"][data-index="${correct?q.correct:(q.correct+1)%q.opts.length}"]`).click();
 await page.locator('.footer .primary').click();
};
const overflow=async()=>assert(await ev(()=>document.documentElement.scrollWidth<=innerWidth+1),'horizontal overflow');
const noOpenQuestions=async()=>{assert.equal(await page.locator('textarea,[data-action="recall-grade"],[data-action="observe"]').count(),0);assert(!/Przerwij, jeśli|jeśli boli|Co zauważyłeś\?|Wniosek własnymi słowami|Moje wyjaśnienie/.test(await page.locator('body').innerText()));};
const report={lessons:[],reviews:[],tests:[]};
await fs.mkdir('qa',{recursive:true});await page.goto('http://127.0.0.1:8974');
assert.equal(await page.locator('.lesson-row:not([disabled])').count(),1);
const ids=await ev(()=>LESSONS.map(l=>l.id));
for(const id of ids){
 await page.locator(`[data-action="start"][data-id="${id}"]`).first().click();
 for(const step of [0,1]){
  await page.waitForFunction(()=>[...document.querySelectorAll('.teaching img')].every(i=>i.complete&&i.naturalWidth>0));
  assert.equal(await page.locator('.application').count(),1);
  await noOpenQuestions();await overflow();
  if(id==='biceps'&&step===0)await page.screenshot({path:'qa/practical-biceps-v1.5.png',fullPage:true});
  await click('next');
 }
 assert(await page.locator('.footer .primary').isDisabled());
 await solve(false);assert.equal(await ev(()=>session().check.correct),false);
 assert.match(await page.locator('.feedback h2').innerText(),/^Poprawna odpowiedź:/);
 await click('retry-check');await solve();await click('next');
 const type=await ev(()=>currentLesson().practice.type);
 if(['fuel','adaptation'].includes(id)){await solve(false);await click('retry-practice');await solve();await click('next');}
 else{
  await solve();
  if(['torque','sarcomere','motor','hpg'].includes(type)){
   assert(await page.locator('.footer .primary').isDisabled());
   if(['torque','sarcomere'].includes(type))await page.locator('#lab-range').evaluate((el,type)=>{el.value=type==='torque'?'40':'75';el.dispatchEvent(new Event('input',{bubbles:true}));el.dispatchEvent(new Event('change',{bubbles:true}));},type);
   else await click(type==='motor'?'motor-rate':'hpg');
   await solve();
  }
  await click('next');
 }
 assert.equal(await ev(()=>session().step),4);await noOpenQuestions();
 for(let index=0;index<3;index++){
  assert.equal(await ev(()=>session().knowledge.index),index);assert(await page.locator('.footer .primary').isDisabled());
  if(id==='biceps'&&index===1){
   const q=await ev(()=>activeTask().q);await page.locator(`[data-action="select"][data-index="${q.correct}"]`).click();
   const order=await ev(()=>activeTask().a.order);await page.reload();assert.deepEqual(await ev(()=>activeTask().a.order),order);assert.equal(await ev(()=>activeTask().a.selected),q.correct);
   await click('previous');assert.equal(await ev(()=>session().knowledge.index),0);assert.equal(await ev(()=>activeTask().a.correct),false);
   await click('knowledge-next');await page.locator('.footer .primary').click();
   report.tests.push('Quiz selection, shuffled order, wrong grade and question index survive reload and Back');
  }else await solve(!(id==='biceps'&&index===0));
  await overflow();
  if(index<2)await click('knowledge-next');else await click('next');
 }
 assert.equal(await ev(()=>session().step),5);
 assert.match(await page.locator('h1').innerText(),id==='biceps'?/2\/3/:/3\/3/);
 await click('complete');assert(await ev(id=>state.completed.includes(id),id));
 assert.equal(await ev(id=>state.reviews[id].success,id),0);
 report.lessons.push({id,knowledgeQuestions:3,score:id==='biceps'?2:3});
}
report.tests.push('All ten lessons completed through UI, 20 practical contexts, graded knowledge with answer explanations, no open/observation prompts');
await click('reviews');
const doReview=async(id,{first=true,knowledgeWrong=false}={})=>{
 await page.locator(`[data-action="start"][data-id="${id}"][data-mode="review"]`).click();
 await solve(first);if(!first){await click('retry-review');await solve();}await click('next');
 for(let index=0;index<2;index++){await solve(!(knowledgeWrong&&index===0));if(index===0)await click('knowledge-next');}
 await click('finish-review');const result=await ev(()=>session().result);await click('close-review');return result;
};
const dueBefore=await ev(()=>state.reviews.biceps.due);
assert.equal((await doReview('biceps')).delayed,false);assert.equal(await ev(()=>state.reviews.biceps.attempts),0);assert.equal(await ev(()=>state.reviews.biceps.due),dueBefore);
report.tests.push('Early practice neither counts as delayed success nor changes the due date');
await context.addInitScript(()=>{const now=Date.now;Date.now=()=>now()+2*86400000;});await page.reload();await click('reviews');
for(const id of ids){
 const failed=id==='torque'||id==='sarcomere';
 const result=await doReview(id,{first:id!=='torque',knowledgeWrong:id==='sarcomere'});
 assert.equal(result.success,!failed);assert.equal(result.delayed,true);
 assert.equal(await ev(id=>state.reviews[id].attempts,id),1);
 assert.equal(await ev(id=>state.reviews[id].success,id),failed?0:1);
 assert(await ev(({id,days})=>Math.abs(state.reviews[id].due-Date.now()-days*DAY)<3000,{id,days:failed?1:3}));
 report.reviews.push({id,success:!failed,days:failed?1:3});
}
report.tests.push('Different review questions for every lesson; first-answer errors and knowledge errors schedule one day, independent successes three days');
await click('home');await click('about');await noOpenQuestions();
for(const size of [{width:360,height:740},{width:892,height:412},{width:1280,height:900}]){await page.setViewportSize(size);await overflow();}
assert.deepEqual(errors,[]);assert.deepEqual(requests,[]);report.tests.push('No JavaScript errors, failed assets or horizontal overflow at phone, landscape and desktop widths');
await fs.writeFile('qa/knowledge-v1.5.json',JSON.stringify(report,null,2));
console.log('PASS 10 lessons, 10 reviews, 50 new knowledge questions and persistence checks');
await browser.close();
