import fs from 'node:fs/promises';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const root = process.cwd();
const nativeQa = path.join(root, 'qa', 'native');
const assetsRoot = path.join(root, 'android', 'app', 'src', 'main', 'assets');
const adbPath = path.join(process.env.LOCALAPPDATA ?? 'C:\\Users\\skibi\\AppData\\Local', 'Android', 'Sdk', 'platform-tools', 'adb.exe');
const serial = 'emulator-5586';
const expectedText = 'Moja notatka: napięcie zależy od kąta i ramienia momentu siły.';

function adb(...args) {
  return execFileSync(adbPath, ['-s', serial, ...args], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
}

function pause(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function listFiles(directory, prefix = '') {
  const found = [];
  for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
    const relative = path.posix.join(prefix, entry.name);
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) found.push(...await listFiles(full, relative));
    else found.push(relative.replaceAll('\\', '/'));
  }
  return found;
}

async function connect() {
  const targets = await (await fetch('http://127.0.0.1:9223/json')).json();
  const target = targets.find(item => item.type === 'page' && item.url === 'file:///android_asset/index.html');
  if (!target?.webSocketDebuggerUrl) throw new Error('The owned debug WebView page target was not found.');
  const ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => {
    ws.addEventListener('open', resolve, { once: true });
    ws.addEventListener('error', reject, { once: true });
  });
  let nextId = 0;
  const pending = new Map();
  ws.addEventListener('message', event => {
    const message = JSON.parse(event.data);
    const waiter = pending.get(message.id);
    if (!waiter) return;
    pending.delete(message.id);
    if (message.error) waiter.reject(new Error(message.error.message));
    else waiter.resolve(message.result);
  });
  function send(method, params = {}) {
    const id = ++nextId;
    return new Promise((resolve, reject) => {
      pending.set(id, { resolve, reject });
      ws.send(JSON.stringify({ id, method, params }));
    });
  }
  async function evaluate(expression) {
    const response = await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true, userGesture: true });
    if (response.exceptionDetails) throw new Error(response.exceptionDetails.exception?.description ?? response.exceptionDetails.text);
    return response.result?.value;
  }
  return { target, ws, send, evaluate };
}

async function reconnect() {
  let lastError;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      return await connect();
    } catch (error) {
      lastError = error;
      await pause(700);
    }
  }
  throw lastError ?? new Error('The restarted WebView did not reconnect.');
}

async function screenshot(name) {
  const devicePath = '/sdcard/' + name;
  adb('shell', 'screencap', '-p', devicePath);
  const outputPath = path.join(nativeQa, name);
  execFileSync(adbPath, ['-s', serial, 'pull', devicePath, outputPath], { stdio: 'ignore' });
  return outputPath;
}

const offlineMode = adb('shell', 'cmd', 'connectivity', 'airplane-mode').includes('enabled');
if (!offlineMode) throw new Error('Owned emulator is not in airplane mode.');

let client = await connect();
const updateProgress = await client.evaluate("(()=>{const s=JSON.parse(localStorage.getItem('trening-naukowo-v1'));return {key:'trening-naukowo-v1',active:s?.active??null,step:s?.sessions?.['learn:biceps']?.step??null,reader:document.querySelector('.reader-count')?.textContent?.trim()??null};})()");
if (updateProgress.key !== 'trening-naukowo-v1' || updateProgress.active?.id !== 'biceps' || updateProgress.step !== 1 || updateProgress.reader !== '2/6') {
  throw new Error('The v1.1 lesson was not retained at step 2 after update: ' + JSON.stringify(updateProgress));
}

const allAssets = await listFiles(assetsRoot);
const imagePaths = allAssets.filter(file => /\.(png|webp)$/i.test(file)).sort();
const decodeExpression = '(async()=>{const out=[];for(const src of '+JSON.stringify(imagePaths)+'){const image=new Image();image.src=src;try{await image.decode();out.push({src,decoded:true,width:image.naturalWidth,height:image.naturalHeight});}catch(error){out.push({src,decoded:false,error:String(error)});}image.src="";await new Promise(r=>setTimeout(r,30));}return out;})()';
const decoded = await client.evaluate(decodeExpression);
const imageFailures = decoded.filter(image => !image.decoded || !image.width || !image.height);
if (imageFailures.length) {
  throw new Error('Offline asset validation failed: files=' + allAssets.length + ', images=' + imagePaths.length + ', failures=' + JSON.stringify(imageFailures));
}

await client.evaluate("(()=>{if(!state.active||state.active.id!=='biceps')throw Error('Retained biceps session missing');state.sessions['learn:biceps'].step=4;route='lesson';save();render();const field=document.querySelector('#recall-text');if(!field)throw Error('Own-explanation field missing');field.focus();return true;})()");
await client.evaluate('(()=>{const t=document.querySelector("#recall-text");t.value='+JSON.stringify(expectedText)+';t.dispatchEvent(new Event("input",{bubbles:true}));return true;})()');
const writtenNote = await client.evaluate("(()=>{const s=JSON.parse(localStorage.getItem('trening-naukowo-v1'));return {active:s.active,step:s.sessions['learn:biceps'].step,text:s.sessions['learn:biceps'].recall.text,textarea:document.querySelector('#recall-text')?.value,reader:document.querySelector('.reader-count')?.textContent?.trim()};})()");
if (writtenNote.step !== 4 || writtenNote.text !== expectedText || writtenNote.textarea !== expectedText || writtenNote.reader !== '5/6') {
  throw new Error('Polish note was not saved at step 5/6: ' + JSON.stringify(writtenNote));
}

await pause(6000);
client.ws.close();
adb('shell', 'am', 'force-stop', 'pl.trening.naukowo');
adb('shell', 'am', 'start', '-W', '-n', 'pl.trening.naukowo/.MainActivity');
await pause(900);
try { adb('forward', '--remove', 'tcp:9223'); } catch {}
const appPidV12 = adb('shell', 'pidof', 'pl.trening.naukowo').split(' ')[0];
adb('forward', 'tcp:9223', 'localabstract:webview_devtools_remote_' + appPidV12);
client = await reconnect();
const afterRestart = await client.evaluate("(()=>{const s=JSON.parse(localStorage.getItem('trening-naukowo-v1'));const f=document.querySelector('#recall-text');return {key:'trening-naukowo-v1',active:s?.active??null,step:s?.sessions?.['learn:biceps']?.step??null,text:s?.sessions?.['learn:biceps']?.recall?.text??null,textarea:f?.value??null,reader:document.querySelector('.reader-count')?.textContent?.trim()??null};})()");
if (afterRestart.step !== 4 || afterRestart.text !== expectedText || afterRestart.textarea !== expectedText || afterRestart.reader !== '5/6') {
  throw new Error('Polish note did not survive force-stop/restart: ' + JSON.stringify(afterRestart));
}

adb('shell', 'input', 'keyevent', '4');
await pause(650);
const step4Back = await client.evaluate("(()=>{const s=JSON.parse(localStorage.getItem('trening-naukowo-v1'));return {step:s.sessions['learn:biceps'].step,reader:document.querySelector('.reader-count')?.textContent?.trim()};})()");
if (step4Back.step !== 3 || step4Back.reader !== '4/6') throw new Error('Android Back did not move step 4 to 3: ' + JSON.stringify(step4Back));

await client.evaluate("(()=>{state.sessions['learn:biceps'].step=1;route='lesson';save();render();window.scrollTo(0,0);return true;})()");
const atlas = await client.evaluate("(()=>({step:document.querySelector('.reader-count')?.textContent?.trim(),title:document.querySelector('.reader h1')?.textContent,illustration:document.querySelector('.art-button img')?.getAttribute('src')}))()");
if (atlas.step !== '2/6' || !atlas.illustration) throw new Error('Biceps atlas step 1 did not render: ' + JSON.stringify(atlas));
const atlasScreenshot = await screenshot('v1.2-atlas-step1.png');
await client.evaluate("(()=>{const b=document.querySelector('.art-button');if(!b)throw Error('Atlas art button missing');b.click();const d=document.querySelector('.art-dialog[open]');if(!d)throw Error('Atlas zoom dialog did not open');const z=d.querySelector('.art-zoom');if(z)z.click();return true;})()");
const zoomOpen = await client.evaluate("(()=>{const d=document.querySelector('.art-dialog[open]');return {open:!!d,zoomed:!!d?.classList.contains('zoomed'),pressed:d?.querySelector('.art-zoom')?.getAttribute('aria-pressed')??null};})()");
if (!zoomOpen.open || !zoomOpen.zoomed || zoomOpen.pressed !== 'true') throw new Error('Atlas zoom did not open: ' + JSON.stringify(zoomOpen));

adb('shell', 'input', 'keyevent', '4');
await pause(650);
const zoomBack = await client.evaluate("(()=>({dialogOpen:!!document.querySelector('.art-dialog[open]'),step:JSON.parse(localStorage.getItem('trening-naukowo-v1')).sessions['learn:biceps'].step,reader:document.querySelector('.reader-count')?.textContent?.trim()}))()");
if (zoomBack.dialogOpen || zoomBack.step !== 1 || zoomBack.reader !== '2/6') throw new Error('Android Back failed to close zoom before leaving the step: ' + JSON.stringify(zoomBack));

adb('shell', 'input', 'keyevent', '4');
await pause(650);
const step1Back = await client.evaluate("(()=>({step:JSON.parse(localStorage.getItem('trening-naukowo-v1')).sessions['learn:biceps'].step,reader:document.querySelector('.reader-count')?.textContent?.trim()}))()");
if (step1Back.step !== 0 || step1Back.reader !== '1/6') throw new Error('Android Back did not move step 1 to 0: ' + JSON.stringify(step1Back));

adb('shell', 'input', 'keyevent', '4');
await pause(650);
const homeBack = await client.evaluate("(()=>({onHome:!document.querySelector('.reader'),resume:document.body.innerText.includes('Postęp zapisany'),active:JSON.parse(localStorage.getItem('trening-naukowo-v1')).active,step:JSON.parse(localStorage.getItem('trening-naukowo-v1')).sessions['learn:biceps'].step}))()");
if (!homeBack.onHome || !homeBack.resume || homeBack.active?.id !== 'biceps' || homeBack.step !== 0) throw new Error('Android Back did not return step 0 to resumable home: ' + JSON.stringify(homeBack));

const report = {
  version: '1.2.0',
  offline: true,
  assetFiles: allAssets.length,
  imageDecode: { count: imagePaths.length, failures: [], images: decoded },
  v11UpdateRetainedStep1: updateProgress,
  polishNoteWritten: writtenNote,
  polishNoteAfterForceStop: afterRestart,
  androidBackStep4To3: step4Back,
  atlas,
  atlasScreenshot: path.relative(root, atlasScreenshot).replaceAll('\\', '/'),
  zoomOpened: zoomOpen,
  androidBackClosedZoom: zoomBack,
  androidBackStep1To0: step1Back,
  androidBackStep0ToHome: homeBack,
  verifiedAtUtc: new Date().toISOString(),
};
await fs.writeFile(path.join(nativeQa, 'navigation-v1.2.json'), JSON.stringify(report, null, 2) + '\n', 'utf8');
client.ws.close();
console.log(JSON.stringify(report, null, 2));
