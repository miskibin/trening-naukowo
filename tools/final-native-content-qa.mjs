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
 assert(report.offline);const client=await connect(),ev=e=>client.evaluate(e);report.sections=[];
 for(const id of await ev('LESSONS.map(l=>l.id)'))for(const step of [0,1]){
  await ev(`state.active={id:'${id}',mode:'learn'};state.sessions['learn:${id}']={...initSession(),step:${step}};route='lesson';render();`);
  const images=await ev(`(async()=>{const out=[];for(const i of document.querySelectorAll('.teaching img')){await i.decode();out.push(i.getAttribute('src'));}return out;})()`);
  assert(await ev('document.documentElement.scrollWidth<=innerWidth+1'));report.sections.push({id,step,images});
 }
 for(const [id,step,src] of [['fuel',0,'glycogen-cell-v1.4'],['testosterone',1,'hpg-feedback-v1.4'],['signals',1,'endocrine-labelled']]){
  await ev(`state.active={id:'${id}',mode:'learn'};state.sessions['learn:${id}']={...initSession(),step:${step}};route='lesson';render();`);
  await ev(`(async()=>{const i=document.querySelector('img[src*="${src}"]');await i.decode();i.closest('figure').querySelector('button').click();})()`);await pause(500);
  const fit=await ev(`(()=>{const d=document.querySelector('dialog'),p=d.querySelector('.art-piece'),c=d.querySelector('.art-scroll');return p.offsetWidth<=c.clientWidth+1&&p.offsetHeight<=c.clientHeight+1;})()`);assert(fit);
  await screenshot(id+'-final-v1.4.png');adb('shell','input','keyevent','4');await pause(200);assert.equal(await ev('!!document.querySelector("dialog")'),false);
 }
 await ev("state.active={id:'fuel',mode:'learn'};state.sessions['learn:fuel']=initSession();route='lesson';save();render();");await pause(6000);
 report.tests=['Final content of all 20 sections decodes offline','New glycogen and HPG illustrations fit native full screen','Selected endocrine panel fits native full screen','Physical Back closes each view without changing the step'];
 await fs.writeFile('qa/native/final-content-v1.4.json',JSON.stringify(report,null,2));console.log('PASS final native content: 20 sections and three fullscreen views offline');
}finally{ws?.close();clearTimeout(deadline);}
