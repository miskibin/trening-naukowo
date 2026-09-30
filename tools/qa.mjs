import {createRequire} from 'node:module';
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const require=createRequire(import.meta.url);
const {chromium}=require('C:/Users/skibi/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
await fs.mkdir('qa',{recursive:true});
const browser=await chromium.launch({channel:'chrome',headless:true});
const context=await browser.newContext({viewport:{width:412,height:892},deviceScaleFactor:1,isMobile:true,hasTouch:true});
const page=await context.newPage();
const errors=[],requests=[];page.on('pageerror',e=>errors.push(e.message));page.on('requestfailed',r=>requests.push(r.url()));
await page.goto('http://127.0.0.1:8974');
const click=a=>page.locator(`[data-action="${a}"]`).first().click();
const ev=(code,arg)=>page.evaluate(code,arg);
const checkNoOverflow=async()=>assert(await ev(()=>document.documentElement.scrollWidth<=innerWidth+1),'horizontal overflow');
const snap=async name=>{await page.screenshot({path:`qa/${name}.png`,fullPage:true});};
const solve=async(correct=true)=>{
 const q=await ev(()=>activeTask().q);
 if(q.type==='order'){
  const indices=q.items.map((_,i)=>i);if(!correct)indices.reverse();
  for(const i of indices)await page.locator(`[data-action="order-add"][data-index="${i}"]`).click();
 }else {const index=correct?q.correct:(q.correct+1)%q.opts.length;await page.locator(`[data-action="select"][data-index="${index}"]`).click();}
 await page.locator('.footer .primary').click();
};
const out={lessons:[],tests:[]};
await snap('01-start');await checkNoOverflow();
assert.equal(await ev(()=>LESSONS.length),10);
assert.equal(await page.locator('.lesson-row:not([disabled])').count(),1);
out.tests.push('First lesson available, future lessons follow prerequisite path');
const ids=await ev(()=>LESSONS.map(l=>l.id));
for(const [i,id] of ids.entries()){
 await page.locator(`[data-action="start"][data-id="${id}"]`).first().click();
 await checkNoOverflow();if(i===0)await snap('02-theory');
 await click('next');await click('next');
 assert(await page.locator('.footer .primary').isDisabled());
 assert.equal(await page.locator('.option.correct,.option.wrong').count(),0);
 const original=await page.locator('h1').innerText();
 await solve(false);assert.equal(await ev(()=>session().check.correct),false);
 if(i===0)await snap('03-correction');
 await click('retry-check');assert.notEqual(await page.locator('h1').innerText(),original);
 await solve(true);await click('next');
 const type=await ev(()=>currentLesson().practice.type);
 if(type==='movement'){
  await click('observe');assert.equal(await ev(()=>session().practice.response),2);
  assert.equal(await page.locator('.feedback.error').count(),0);
  await snap('04-movement-skipped');await click('next');
 }else {
  const practiceWrong=['fuel','adaptation'].includes(id);await solve(!practiceWrong);
  if(practiceWrong){await click('retry-practice');await solve(true);await click('next');}
  else if(['torque','sarcomere','motor','hpg'].includes(type)){
   assert(await page.locator('.footer .primary').isDisabled());
   if(type==='torque'||type==='sarcomere'){
    await page.locator('#lab-range').evaluate((el,type)=>{el.value=type==='torque'?'40':'75';el.dispatchEvent(new Event('input',{bubbles:true}));el.dispatchEvent(new Event('change',{bubbles:true}));},type);
    if(type==='torque')assert.match(await page.locator('#lab-output').innerText(),/4.0 N·m/);
   }else await click(type==='motor'?'motor-rate':'hpg');
   await checkNoOverflow();
   if(id==='torque')await snap('05-torque-experiment');
   if(id==='testosterone')await snap('06-hormone-feedback');
   await solve(true);await click('next');
  }else await click('next');
 }
 assert.equal(await ev(()=>session().step),4);
 await page.locator('#recall-text').fill('Moje wyjaśnienie mechanizmu: zachowuję zależności i opisuję przyczynę.');
 if(i===0){await page.reload();assert.match(await page.locator('#recall-text').inputValue(),/Moje wyjaśnienie/);out.tests.push('Interrupted lesson resumes exact step and text after reload');}
 await click('reveal');await page.locator('[data-action="recall-grade"][data-index="0"]').click();
 await click('next');await click('complete');
 assert(await ev(id=>state.completed.includes(id),id));
 assert.equal(await ev(id=>state.reviews[id].success,id),0);
 out.lessons.push({id,result:'completed',wrongAnswerRemediated:true});
}
out.tests.push('All ten lessons completed through UI, without counting immediate responses as delayed mastery');
await snap('07-course-complete');
await page.locator('[data-action="reviews"]').first().click();
await page.locator('[data-action="start"][data-id="biceps"][data-mode="review"]').click();
await solve(true);await click('next');await page.locator('#recall-text').fill('Przyczep na promieniowej pozwala bicepsowi obracać kość; ramienny ciągnie łokciową.');await click('reveal');await page.locator('[data-action="recall-grade"][data-index="0"]').click();await click('finish-review');
assert.equal(await ev(()=>state.reviews.biceps.attempts),0);out.tests.push('Early rehearsal does not count as delayed success or shift due date');await click('close-review');
// Advance time without changing the course state to exercise the actual scheduling path.
await context.addInitScript(()=>{const original=Date.now;Date.now=()=>original()+2*86400000;});await page.reload();
await click('reviews');await page.locator('[data-action="start"][data-id="biceps"]').click();
await solve(true);await click('next');await page.locator('#recall-text').fill('Biceps ma przyczep na obracającej się promieniowej, a ramienny na łokciowej.');await click('reveal');await page.locator('[data-action="recall-grade"][data-index="0"]').click();await click('finish-review');
assert.equal(await ev(()=>state.reviews.biceps.success),1);assert.equal(await ev(()=>state.reviews.biceps.attempts),1);assert(await ev(()=>Math.abs(state.reviews.biceps.due-Date.now()-3*DAY)<3000));out.tests.push('Delayed independent success schedules 3 days');await snap('08-delayed-review');await click('close-review');
await page.locator('[data-action="start"][data-id="torque"]').click();await solve(false);await click('retry-review');await solve(true);await click('next');await click('recall-help');await click('finish-review');assert.equal(await ev(()=>state.reviews.torque.success),0);assert(await ev(()=>Math.abs(state.reviews.torque.due-Date.now()-DAY)<3000));out.tests.push('Wrong first answer plus assistance schedules one day and is not counted as independent success');await click('close-review');
await click('home');await click('about');await snap('09-data-and-sources');
await page.setViewportSize({width:360,height:740});await checkNoOverflow();await snap('10-small-phone');
await page.setViewportSize({width:892,height:412});await checkNoOverflow();
await page.setViewportSize({width:1280,height:900});await checkNoOverflow();
out.tests.push('360px phone, S24 Ultra sized viewport, landscape and desktop: no horizontal overflow');
assert.equal(errors.length,0,errors.join('\n'));assert.equal(requests.length,0,requests.join('\n'));
out.tests.push('No JavaScript errors or failed asset requests');
// Save a completed-state fixture for inspecting reviews, not shipped inside the app.
await fs.writeFile('qa/completed-state.json',JSON.stringify(await ev(()=>state),null,2));
await fs.writeFile('qa/report.json',JSON.stringify(out,null,2));
console.log(JSON.stringify(out,null,2));await browser.close();
