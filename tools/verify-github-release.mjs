import fs from 'node:fs/promises';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
const version=process.argv[2]||'1.4';
assert(/^\d+\.\d+$/.test(version));
const expected=JSON.parse(await fs.readFile(`qa/final-asset-verification-v${version}.json`,'utf8'));
const url=`https://github.com/miskibin/trening-naukowo/releases/download/v${version}.0/TreningNaukowo-v${version}.apk`;
const result=await fetch(url,{signal:AbortSignal.timeout(60000)});assert.equal(result.status,200);
const hash=createHash('sha256');let bytes=0;
for await(const chunk of result.body){hash.update(chunk);bytes+=chunk.length;}
const sha256=hash.digest('hex');assert.equal(bytes,expected.bytes);assert.equal(sha256,expected.sha256);
const checksum=await fetch(url+'.sha256',{signal:AbortSignal.timeout(15000)});assert.equal(checksum.status,200);
assert.equal((await checksum.text()).trim(),`${sha256}  TreningNaukowo-v${version}.apk`);
const report={url,anonymousDownload:true,httpStatus:result.status,bytes,sha256,checksumMatches:true,verifiedAt:new Date().toISOString()};
await fs.writeFile(`qa/github-release-verification-v${version}.json`,JSON.stringify(report,null,2));
console.log(JSON.stringify(report,null,2));