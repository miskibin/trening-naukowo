import {createRequire} from 'node:module';
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const require=createRequire(import.meta.url);
const {chromium}=require('C:/Users/skibi/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const browser=await chromium.launch({channel:'chrome',headless:true});
const page=await browser.newPage({viewport:{width:412,height:892}});
const errors=[];page.on('pageerror',e=>errors.push(e.message));
const tests=[],coverage=[];
try{
 await page.goto('http://127.0.0.1:8974');
 for(const id of await page.evaluate(()=>LESSONS.map(l=>l.id)))for(let index=0;index<2;index++){
  await page.evaluate(({id,index})=>{state=freshState();state.completed=LESSONS.map(l=>l.id);start(id);session().step=index;render();},{id,index});
  const cues=await page.locator('.mnemonics dt').allTextContents();assert(cues.length>=2);
  assert(await page.locator('.mnemonic-note').isVisible());coverage.push({id,index,cues});
 }
 tests.push('All 20 theory sections have at least two visible, qualified memory cues');
 await page.evaluate(()=>{start('biceps');session().step=0;render();});
 await page.locator('[data-plate="rotation"] .art-button').click();
 await page.waitForFunction(()=>document.querySelector('.art-stage img').naturalWidth>0);
 async function fits(){return page.evaluate(()=>{const d=document.querySelector('.art-dialog'),c=document.querySelector('.art-scroll'),i=c.querySelector('img'),r=d.getBoundingClientRect(),a=i.getBoundingClientRect(),b=c.getBoundingClientRect();return {full:r.x===0&&r.y===0&&Math.abs(r.width-innerWidth)<1&&Math.abs(r.height-innerHeight)<1,fit:a.width<=b.width+1&&a.height<=b.height+1,width:a.width,height:a.height};});}
 assert((await fits()).full);assert((await fits()).fit);
 await page.locator('.viewer-plus').click();assert.equal(await page.locator('.art-zoom').getAttribute('aria-pressed'),'true');
 const c=page.locator('.art-scroll');const box=await c.boundingBox();
 await page.mouse.move(box.x+box.width*.75,box.y+box.height*.7);await page.mouse.down();await page.mouse.move(box.x+box.width*.25,box.y+box.height*.3,{steps:10});await page.mouse.up();
 assert(await c.evaluate(e=>e.scrollLeft>0||e.scrollTop>0));
 await page.locator('.art-zoom').click();assert((await fits()).fit);
 await page.setViewportSize({width:892,height:412});await page.waitForTimeout(100);assert((await fits()).full);assert((await fits()).fit);
 await page.screenshot({path:'qa/viewer-landscape-v1.3.png'});
 await page.keyboard.press('Escape');assert.equal(await page.locator('dialog').count(),0);
 assert.equal(await page.evaluate(()=>document.activeElement.dataset.action),'art-open');
 tests.push('Landscape image fits full viewport; buttons zoom, mouse pans, orientation refits, Escape restores image-button focus');
 await page.setViewportSize({width:360,height:760});await page.locator('[data-action="next"]').click();
 await page.locator('[data-plate="biceps-attachments"] .art-button').scrollIntoViewIfNeeded();
 const scroll=await page.evaluate(()=>window.scrollY);await page.locator('[data-plate="biceps-attachments"] .art-button').click();
 await page.waitForFunction(()=>document.querySelector('.art-stage img').naturalWidth>0);assert((await fits()).fit);
 await page.screenshot({path:'qa/viewer-portrait-v1.3.png'});
 await c.focus();await page.keyboard.press('+');assert.equal(await page.locator('.art-zoom').getAttribute('aria-pressed'),'true');
 await page.keyboard.press('0');assert((await fits()).fit);
 assert.equal(await page.evaluate(()=>window.appBack()),true);await page.locator('dialog').waitFor({state:'detached'});
 assert.equal(await page.evaluate(()=>session().step),1);assert(Math.abs(await page.evaluate(()=>window.scrollY)-scroll)<2);
 tests.push('Tall labelled plate fits at 360px; keyboard zoom/fit; Back closes image before lesson and retains page position');
 for(const id of ['motor','sarcomere']){
  await page.evaluate(id=>{start(id);session().step=0;render();},id);
  await page.locator('.sources>summary').click();const details=page.locator('.sources details');await details.locator('summary').click();
  await details.locator('.art-button').click();assert(await page.locator('dialog').isVisible());await page.locator('.art-close').click();
 }
 tests.push('Both additional bibliography figures open in the same viewer');
 await page.evaluate(()=>{start('biceps');session().step=2;render();});
 const option=page.locator('[data-action="select"]').first();const index=await option.getAttribute('data-index');await option.focus();await page.keyboard.press('Space');
 assert.equal(await page.evaluate(()=>document.activeElement.dataset.index),index);
 tests.push('Keyboard answer selection keeps focus on the selected answer');
 await page.evaluate(()=>{state.reviews.biceps={due:Date.now()+DAY,attempts:0,success:0};start('biceps','review');session().step=2;session().result={delayed:false,success:true};render();});
 await page.locator('[data-action="exit"]').click();assert.equal(await page.evaluate(()=>state.active),null);
 await page.evaluate(()=>start('biceps','review'));assert.equal(await page.evaluate(()=>session().step),0);
 assert.equal(await page.locator('.mnemonics').count(),0);
 tests.push('Exit clears a completed review session; next review starts afresh without memory cues revealing answers');
 assert.deepEqual(errors,[]);
 await fs.writeFile('qa/review-v1.3.json',JSON.stringify({tests,coverage,errors},null,2));console.log('PASS '+tests.length+' review checks, 20 mnemonic sections');
}finally{await browser.close();}
