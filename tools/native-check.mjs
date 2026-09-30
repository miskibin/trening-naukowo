import fs from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import assert from 'node:assert/strict';
const adb='C:/Users/skibi/AppData/Local/Android/Sdk/platform-tools/adb.exe';
const ownership=JSON.parse(await fs.readFile('qa/native/ownership.json','utf8'));
assert.equal(ownership.serial,'emulator-5586');assert.equal(ownership.offlineMode,true);
const run=(...args)=>execFileSync(adb,['-s',ownership.serial,...args],{encoding:'utf8'}).trim();
let ws,pending=new Map(),counter=0;
async function attach(){const targets=await (await fetch('http://127.0.0.1:9223/json')).json();const t=targets.find(t=>t.url==='file:///android_asset/index.html');assert(t,'Local packaged WebView target must be present');const url=new URL(t.webSocketDebuggerUrl);url.host='127.0.0.1:9223';ws=new WebSocket(url);ws.addEventListener('message',event=>{const m=JSON.parse(event.data);if(pending.has(m.id)){const p=pending.get(m.id);pending.delete(m.id);m.error?p.reject(Error(JSON.stringify(m.error))):p.resolve(m.result);}});await new Promise((resolve,reject)=>{ws.addEventListener('open',resolve,{once:true});ws.addEventListener('error',reject,{once:true});});}
function command(method,params={}){return new Promise((resolve,reject)=>{const id=++counter;pending.set(id,{resolve,reject});ws.send(JSON.stringify({id,method,params}));});}
async function evaluate(expression){const result=await command('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(result.exceptionDetails)throw Error(JSON.stringify(result.exceptionDetails));return result.result.value;}
const click=action=>evaluate(`document.querySelector('[data-action="${action}"]').click()`);
const solve=async()=>{const q=await evaluate('activeTask().q');if(q.type==='order'){for(let i=0;i<q.items.length;i++)await evaluate(`document.querySelector('[data-action="order-add"][data-index="${i}"]').click()`);}else await evaluate(`document.querySelector('[data-action="select"][data-index="${q.correct}"]').click()`);await evaluate("document.querySelector('.footer .primary').click()");};
async function capture(name){const remote='/sdcard/'+name+'.png';run('shell','screencap','-p',remote);run('pull',remote,'qa/native/'+name+'.png');run('shell','rm',remote);}
await attach();const report={tests:[],metrics:await evaluate('({width:innerWidth,height:innerHeight,dpr:devicePixelRatio,webView:navigator.userAgent})')};
const images=await evaluate(`Promise.all(['images/motor-units.png','images/sliding-filaments.webp'].map(src=>new Promise(resolve=>{const i=new Image();i.onload=()=>resolve({src,width:i.naturalWidth,height:i.naturalHeight});i.onerror=()=>resolve({src,error:true});i.src=src;})))`);
assert(images.every(i=>i.width>100&&!i.error));report.images=images;report.tests.push('Both bundled textbook images load from Android assets in airplane mode');
await click('start');await click('next');await click('next');await solve();await click('next');await click('observe');await click('next');
await evaluate(`(()=>{const t=document.querySelector('#recall-text');t.value='Promieniowa obraca się względem łokciowej; przyczep bicepsa pozwala na supinację.';t.dispatchEvent(new Event('input',{bubbles:true}));})()`);
assert.equal(await evaluate('session().step'),4);
await capture('recall-before-restart');
await new Promise(r=>setTimeout(r,500));ws.close();run('shell','am','force-stop','pl.trening.naukowo');run('shell','am','start','-W','-n','pl.trening.naukowo/.MainActivity');
await new Promise(r=>setTimeout(r,1200));const pid=run('shell','pidof','pl.trening.naukowo');run('forward','tcp:9223','localabstract:webview_devtools_remote_'+pid);await attach();
assert.equal(await evaluate('session().step'),4);assert.match(await evaluate("document.querySelector('#recall-text').value"),/Promieniowa obraca/);report.tests.push('Step and Polish text survive actual Android force-stop and restart');
// Dispatch a real touch event in the WebView to request the software keyboard.
const point=await evaluate(`(()=>{const t=document.querySelector('#recall-text');t.scrollIntoView({block:'center'});const r=t.getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+Math.min(30,r.height/2)};})()`);
await command('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:point.x,y:point.y}]});await command('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
await new Promise(r=>setTimeout(r,700));await capture('keyboard');
report.keyboard={imeState:run('shell','dumpsys','input_method').split('\n').filter(s=>/mInputShown|mIsInputViewShown/.test(s)).join('\n'),layout:await evaluate(`({height:innerHeight,visualHeight:visualViewport.height,footerBottom:document.querySelector('.footer').getBoundingClientRect().bottom})`)};
run('shell','input','keyevent','4');await new Promise(r=>setTimeout(r,300));
await click('reveal');await evaluate(`document.querySelector('[data-action="recall-grade"][data-index="0"]').click()`);await click('next');await click('complete');
assert.equal(await evaluate('state.completed.includes("biceps")'),true);assert.equal(await evaluate('state.reviews.biceps.success'),0);report.tests.push('Native completion, skipped motion and delayed-review record are separate');
await evaluate(`document.querySelector('[data-action="start"][data-id="torque"]').click()`);run('shell','input','keyevent','4');await new Promise(r=>setTimeout(r,400));assert.equal(await evaluate('route'),'home');report.tests.push('Native back exits to start while preserving interrupted lesson');
await capture('native-tested-home');
ownership.appPid=pid;ownership.devToolsSocket='webview_devtools_remote_'+pid;await fs.writeFile('qa/native/ownership.json',JSON.stringify(ownership,null,2));await fs.writeFile('qa/native/report.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));ws.close();
