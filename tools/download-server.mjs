import http from 'node:http';
import {createReadStream} from 'node:fs';
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const filename='TreningNaukowo-v1.1.apk';
const apk=path.join(root,filename),size=(await fs.stat(apk)).size;
const hash=createHash('sha256').update(await fs.readFile(apk)).digest('hex');
if(hash!=='873b5a26d21f79a2615770e3047bf6fe58ffbbf4b48e84ed8b93b8d1311aea15')throw Error('Unexpected APK');
const html=`<!doctype html><html lang="pl"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>Pobierz Trening Naukowo</title><style>body{font:18px/1.6 system-ui;background:#f8fafb;color:#172b3c;max-width:550px;margin:10vh auto;padding:24px}h1{line-height:1.2}a{display:block;padding:18px;background:#246992;color:white;text-align:center;text-decoration:none;border-radius:9px}small{color:#586c7d}</style><h1>Trening Naukowo</h1><p>Wersja 1.1 · Android · 36 MB</p><a href="/${filename}" download>Pobierz aplikację APK</a><p>Otwórz pobrany plik na telefonie i zainstaluj jako aktualizację. Zachowasz dotychczasowy postęp.</p><small>Kurs i ilustracje działają bez internetu.</small></html>`;
const server=http.createServer((req,res)=>{
 const url=new URL(req.url,'http://localhost');
 res.setHeader('X-Content-Type-Options','nosniff');res.setHeader('X-Robots-Tag','noindex, nofollow');res.setHeader('Cache-Control','no-store');
 if(!['GET','HEAD'].includes(req.method)){res.writeHead(405,{'Allow':'GET, HEAD'});res.end();return;}
 if(url.pathname==='/'){res.writeHead(200,{'Content-Type':'text/html; charset=utf-8','Content-Length':Buffer.byteLength(html)});res.end(req.method==='HEAD'?undefined:html);return;}
 if(url.pathname==='/robots.txt'){res.writeHead(200,{'Content-Type':'text/plain'});res.end(req.method==='HEAD'?undefined:'User-agent: *\nDisallow: /\n');return;}
 if(url.pathname===`/${filename}.sha256`){const body=`${hash}  ${filename}\n`;res.writeHead(200,{'Content-Type':'text/plain; charset=utf-8','Content-Length':Buffer.byteLength(body)});res.end(req.method==='HEAD'?undefined:body);return;}
 if(url.pathname!==`/${filename}`){res.writeHead(404);res.end();return;}
 let start=0,end=size-1,status=200;
 if(req.headers.range){const m=/^bytes=(\d+)-(\d*)$/.exec(req.headers.range);if(!m){res.writeHead(416,{'Content-Range':`bytes */${size}`});res.end();return;}
  start=Number(m[1]);end=m[2]?Math.min(Number(m[2]),size-1):size-1;
  if(start> end||start>=size){res.writeHead(416,{'Content-Range':`bytes */${size}`});res.end();return;}status=206;res.setHeader('Content-Range',`bytes ${start}-${end}/${size}`);
 }
 res.writeHead(status,{'Content-Type':'application/vnd.android.package-archive','Content-Disposition':`attachment; filename="${filename}"`,'Content-Length':end-start+1,'Accept-Ranges':'bytes'});
 if(req.method==='HEAD'){res.end();return;}
 const stream=createReadStream(apk,{start,end});stream.on('error',()=>res.destroy());res.on('close',()=>stream.destroy());stream.pipe(res);
});
server.listen(8975,'127.0.0.1',()=>console.log(JSON.stringify({port:8975,filename,size,sha256:hash,pid:process.pid})));
