import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
const adbPath='C:/Users/skibi/AppData/Local/Android/Sdk/platform-tools/adb.exe';
const adb=(...args)=>execFileSync(adbPath,['-s','emulator-5586',...args],{encoding:'utf8',timeout:15000}).trim();
const pause=ms=>new Promise(r=>setTimeout(r,ms));
const deadline=setTimeout(()=>{console.error('Native QA exceeded 90 seconds');process.exit(1);},90000);
let ws;
async function connect(){
 const list=await(await fetch('http://127.0.0.1:9223/json',{signal:AbortSignal.timeout(5000)})).json();
 const target=list.find(t=>t.url==='file:///android_asset/index.html');assert(target);
 ws=new WebSocket(target.webSocketDebuggerUrl);
 await new Promise((resolve,reject)=>{const timer=setTimeout(()=>reject(Error('WebSocket timeout')),5000);ws.onopen=()=>{clearTimeout(timer);resolve();};ws.onerror=reject;});
 let id=0;const pending=new Map();
 ws.onmessage=e=>{const m=JSON.parse(e.data),p=pending.get(m.id);if(!p)return;clearTimeout(p.timer);pending.delete(m.id);m.error?p.reject(Error(m.error.message)):p.resolve(m.result);};
 const send=(method,params={})=>new Promise((resolve,reject)=>{const key=++id,timer=setTimeout(()=>{pending.delete(key);reject(Error(method+' timed out'));},8000);pending.set(key,{resolve,reject,timer});ws.send(JSON.stringify({id:key,method,params}));});
 const evaluate=async expression=>{const r=await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true,userGesture:true});if(r.exceptionDetails)throw Error(r.exceptionDetails.exception?.description||r.exceptionDetails.text);return r.result?.value;};
 return {send,evaluate};
}
async function screenshot(name){adb('shell','screencap','-p','/sdcard/'+name);adb('pull','/sdcard/'+name,'qa/native/'+name);}
const report={tests:[],offline:adb('shell','cmd','connectivity','airplane-mode').includes('enabled')};
try{
 assert(report.offline);let client=await connect();const ev=e=>client.evaluate(e);
 report.updatedState=await ev("({active:state.active,step:session()?.step,count:document.querySelector('.reader-count')?.textContent})");
 assert.equal(report.updatedState.step,1);assert.equal(report.updatedState.active.id,'biceps');assert.equal(report.updatedState.count,'2/6');
 report.tests.push('Real release v1.2 UI progress at step 2 retained by install -r v1.3');
 await ev("document.querySelector('dialog')?.close()");await pause(300);
 const before=await ev('innerHeight');
 await ev("document.querySelector('[data-plate=\"biceps-attachments\"] .art-button').click()");await pause(1000);
 // Android shows its own first-use immersive guidance above the app. Acknowledge
 // that visible OS dialog on this isolated QA device before testing physical Back.
 adb('shell','uiautomator','dump','/sdcard/viewer-guidance.xml');
 const osUi=adb('shell','cat','/sdcard/viewer-guidance.xml');
 const ok=osUi.match(/<node[^>]*resource-id="android:id\/ok"[^>]*bounds="\[(\d+),(\d+)\]\[(\d+),(\d+)\]"/);
 if(ok){adb('shell','input','tap',String(Math.round((+ok[1]+ +ok[3])/2)),String(Math.round((+ok[2]+ +ok[4])/2)));await pause(300);report.systemGuidanceAcknowledged=true;}
 report.viewer=await ev("(()=>{const d=document.querySelector('.art-dialog'),r=d.getBoundingClientRect(),i=d.querySelector('img').getBoundingClientRect(),c=d.querySelector('.art-scroll').getBoundingClientRect();return {height:innerHeight,dialog:{x:r.x,y:r.y,w:r.width,h:r.height},fit:i.width<=c.width+1&&i.height<=c.height+1,descriptionOpen:d.querySelector('details').open};})()");
 assert(report.viewer.height>before);assert.equal(report.viewer.dialog.y,0);assert(Math.abs(report.viewer.dialog.h-report.viewer.height)<1);assert(report.viewer.fit);assert.equal(report.viewer.descriptionOpen,false);
 await screenshot('fullscreen-v1.3.png');
 // Actual multi-touch events through WebView CDP, rather than setting zoom state.
 const touch=(x,y,id)=>({x,y,id,radiusX:3,radiusY:3,force:1});
 await client.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[touch(150,350,1),touch(250,450,2)]});
 await client.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[touch(80,280,1),touch(320,520,2)]});
 await client.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await pause(150);
 assert.equal(await ev("document.querySelector('.art-zoom').getAttribute('aria-pressed')"),'true');
 await screenshot('fullscreen-zoom-v1.3.png');
 adb('shell','input','keyevent','4');await pause(650);
 assert.equal(await ev("!!document.querySelector('dialog')"),false);assert.equal(await ev('session().step'),1);assert.equal(await ev('innerHeight'),before);
 report.tests.push('Native immersive bars hidden, full viewport fit, real pinch zoom; Android Back closes viewer and restores system bars without changing step');
 await ev("session().step=4;render();const t=document.querySelector('#recall-text');t.value='Promieniowa jest po stronie kciuka, a czubek łokcia należy do łokciowej.';t.dispatchEvent(new Event('input',{bubbles:true}));");
 await pause(6000);ws.close();adb('shell','am','force-stop','pl.trening.naukowo');adb('shell','am','start','-W','-n','pl.trening.naukowo/.MainActivity');await pause(1500);
 const pid=adb('shell','pidof','pl.trening.naukowo');adb('forward','tcp:9223','localabstract:webview_devtools_remote_'+pid);client=await connect();
 report.restart=await client.evaluate('({step:session().step,text:session().recall.text})');assert.equal(report.restart.step,4);assert(report.restart.text.startsWith('Promieniowa jest po stronie kciuka'));
 adb('shell','input','keyevent','4');await pause(250);assert.equal(await client.evaluate('session().step'),3);
 report.tests.push('Polish note and step retained after force-stop (6-second storage commit window); system Back still moves one step');
 await fs.writeFile('qa/native/review-v1.3.json',JSON.stringify(report,null,2));console.log('PASS native review/update/fullscreen/pinch/restart offline');
}finally{ws?.close();clearTimeout(deadline);}
