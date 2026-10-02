import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import {launchBrowser} from './qa-browser.mjs';
const browser=await launchBrowser(),page=await browser.newPage({viewport:{width:360,height:780}}),errors=[];
page.on('pageerror',e=>errors.push(e.message));await page.goto('http://127.0.0.1:8974');
const click=name=>page.locator(`[data-action="${name}"]`).first().click();
const ev=(fn,arg)=>page.evaluate(fn,arg),tests=[];
const legacy=step=>({version:1,completed:['biceps'],completedAt:{biceps:12345},reviews:{biceps:{due:987654321,streak:2,success:2,attempts:3,history:[{time:100,success:true,explanationGrade:0}]}},sessions:{'learn:torque':{step,check:{selected:0,order:[2,0,1],answered:true,correct:true},practice:{answer:{selected:0,answered:true,correct:true},value:30,touched:true,interpret:{selected:0,answered:true,correct:true}},recall:{text:'Moja zapisana notatka',revealed:true,grade:0},reviewCorrect:null}},active:{id:'torque',mode:'learn'}});
const seed=async state=>{await ev(value=>{state=value;localStorage.setItem(KEY,JSON.stringify(value));},state);await page.reload();};
await seed(legacy(4));assert.equal(await ev(()=>state.version),2);assert.equal(await ev(()=>session().step),4);assert.equal(await page.locator('textarea').count(),0);assert.match(await page.locator('.eyebrow').innerText(),/Quiz wiedzy/i);
assert.deepEqual(await ev(()=>state.completed),['biceps']);assert.equal(await ev(()=>state.completedAt.biceps),12345);assert.equal(await ev(()=>state.reviews.biceps.due),987654321);assert.equal(await ev(()=>session().practice.value),30);assert.deepEqual(await ev(()=>session().check.order),[2,0,1]);
await ev(()=>action('next',{}));assert.equal(await ev(()=>session().step),4);await ev(()=>action('complete',{}));assert.deepEqual(await ev(()=>state.completed),['biceps']);
await click('previous');assert.equal(await ev(()=>session().step),3);await click('next');assert.equal(await ev(()=>session().step),4);
tests.push('Legacy self-assessment becomes a graded quiz without losing completed lessons, dates, history, model settings or earlier answers; completion cannot bypass the quiz');
await seed(legacy(5));assert.equal(await ev(()=>session().step),4);tests.push('Unfinished legacy completion screen returns to the new quiz before allowing completion');
const movement=legacy(3);movement.completed=[];movement.sessions={'learn:biceps':{step:3,check:{answered:true,correct:true},practice:{observe:true,response:2},recall:{text:'',grade:null},reviewCorrect:null}};movement.active={id:'biceps',mode:'learn'};
await seed(movement);assert.equal(await ev(()=>currentLesson().practice.type),'choice');assert.equal(await ev(()=>session().practice.answer.answered),undefined);assert.equal(await page.locator('[data-action="observe"]').count(),0);assert(await page.locator('.footer .primary').isDisabled());tests.push('Ungraded legacy movement observation cannot count as a correct practice answer');
await ev(()=>{state=freshState();state.completed=['biceps'];state.completedAt.biceps=12345;state.reviews.biceps={due:Date.now()-DAY,streak:0,success:0,attempts:0,history:[]};start('biceps','review');});
const solve=async()=>{const q=await ev(()=>activeTask().q);await page.locator(`[data-action="select"][data-index="${q.correct}"]`).click();await page.locator('.footer .primary').click();};
await solve();await click('next');await solve();await click('knowledge-next');await solve();await click('finish-review');const before=await ev(()=>JSON.stringify(state.reviews.biceps));await ev(()=>action('finish-review',{}));assert.equal(await ev(()=>JSON.stringify(state.reviews.biceps)),before);await click('previous');assert.equal(await ev(()=>route),'reviews');assert.equal(await ev(()=>state.active),null);tests.push('Completed review records once and Back returns to reviews without reopening its editable result');
await ev(()=>{state.completed=LESSONS.map(l=>l.id);start('biceps');session().step=1;render();});await page.locator('[data-plate="biceps-attachments"] .art-button').first().click();await ev(()=>window.appBack());await page.locator('dialog').waitFor({state:'detached'});assert.equal(await ev(()=>session().step),1);await ev(()=>window.appBack());assert.equal(await ev(()=>session().step),0);await click('exit');await click('start');assert.equal(await ev(()=>session().step),0);tests.push('System Back closes the illustration before leaving a step; Exit preserves the exact lesson step');
const coverage=[];
for(const id of await ev(()=>LESSONS.map(l=>l.id)))for(const step of [0,1]){
 await ev(({id,step})=>{state.completed=LESSONS.map(l=>l.id);start(id);session().step=step;render();},{id,step});
 await page.waitForFunction(()=>[...document.querySelectorAll('.teaching img')].every(i=>i.complete&&i.naturalWidth>0));assert.equal(await page.locator('.application').count(),1);assert(await ev(()=>document.documentElement.scrollWidth<=innerWidth+1));coverage.push({id,step,application:await page.locator('.application h2').innerText()});
}
assert.deepEqual(errors,[]);await fs.writeFile('qa/navigation-v1.5.json',JSON.stringify({tests,coverage,errors},null,2));await browser.close();console.log('PASS legacy migrations, Back, single review record, all 20 applications');
