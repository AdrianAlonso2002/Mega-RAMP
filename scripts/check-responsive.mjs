import {spawn} from 'node:child_process';
import {mkdtempSync,rmSync,writeFileSync,mkdirSync,readFileSync} from 'node:fs';
import {tmpdir} from 'node:os';import {join,resolve,sep} from 'node:path';
const delay=ms=>new Promise(r=>setTimeout(r,ms));
const profile=mkdtempSync(join(tmpdir(),'mega-ramp-ui-review-')),results=[];
const chrome=spawn('C:/Program Files/Google/Chrome/Application/chrome.exe',['--headless=new','--no-first-run','--no-default-browser-check','--disable-background-networking','--disable-extensions','--enable-unsafe-swiftshader','--remote-debugging-port=0','--user-data-dir='+profile,'about:blank'],{windowsHide:true,stdio:'ignore'});
let ws;
try {
 let port;for(let i=0;i<100;i++){try{port=readFileSync(join(profile,'DevToolsActivePort'),'utf8').split('\n')[0];break;}catch{await delay(100);}}
 if(!port)throw Error('Chrome startup failed');
 const pages=await (await fetch('http://127.0.0.1:'+port+'/json/list')).json();
 ws=new WebSocket(pages.find(p=>p.type==='page').webSocketDebuggerUrl);await new Promise((r,j)=>{ws.onopen=r;ws.onerror=j;});
 let sequence=0;const pending=new Map();ws.onmessage=event=>{const m=JSON.parse(event.data);if(m.id){const p=pending.get(m.id);pending.delete(m.id);m.error?p.reject(m.error):p.resolve(m.result);}};
 const call=(method,params={})=>new Promise((resolve,reject)=>{const id=++sequence;pending.set(id,{resolve,reject});ws.send(JSON.stringify({id,method,params}));});
 await call('Page.enable');mkdirSync('reports/ui-review',{recursive:true});
 for(const [screen,width,height] of [['hud',390,844],['hud',320,568],['hud',740,360],['pause',740,360],['title',740,360],['options',740,360],['character-select',740,360]]) {
  await call('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:true});
  await call('Page.navigate',{url:'http://localhost:5173/reports/ui-review.html?screen='+screen});
  let report;
  for(let i=0;i<120;i++){await delay(100);try{const r=await call('Runtime.evaluate',{expression:'document.querySelector("#review-result")?.textContent',returnByValue:true});if(r.result.value){report=JSON.parse(r.result.value);break;}}catch{}}
  if(!report)throw Error('Missing UI result: '+screen);results.push(report);console.log(JSON.stringify(report));
  const image=await call('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});writeFileSync(resolve('reports/ui-review/'+screen+'-'+width+'.png'),Buffer.from(image.data,'base64'));
 }
 writeFileSync('reports/ui-review-results.json',JSON.stringify(results,null,2)+'\n');
 if(results.some(r=>r.errors?.length||r.horizontalOverflow||r.outside?.length))process.exitCode=1;
 await call('Browser.close');
}finally{ws?.close();chrome.kill();await delay(400);const target=resolve(profile),tempRoot=resolve(tmpdir())+sep;if(!target.startsWith(tempRoot)||!target.includes('mega-ramp-ui-review-'))throw Error('Unexpected review profile path');try{rmSync(target,{recursive:true,force:true});}catch{}}
