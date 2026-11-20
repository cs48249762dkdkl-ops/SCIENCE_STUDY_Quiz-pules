(()=>{
'use strict';
const BASELINE='nexus-progress-observed-v1';
const API=document.currentScript?.dataset.api||'/api/progress';
const C=window.NexusProgressCore,STORE='nexus-progress-ledger-v1',PENDING='nexus-progress-pending-v1',TOKEN='nexus-progress-key-v1',DEVICE='nexus-progress-device-v1';
const read=(k,f)=>{try{return JSON.parse(localStorage.getItem(k))??f;}catch{return f;}};
let observed=read(BASELINE,{});
let events=C.merge(read(STORE,[])),pending=C.merge(read(PENDING,[])),busy=false,timer;
let device=localStorage.getItem(DEVICE);if(!device){device=crypto.randomUUID();localStorage.setItem(DEVICE,device);}
const status=s=>{const el=document.getElementById('nexus-sync-status');if(el)el.textContent=s;};
function persist(){localStorage.setItem(STORE,JSON.stringify(events));localStorage.setItem(PENDING,JSON.stringify(pending));window.dispatchEvent(new Event('nexus-progress'));}
function record(e){const old=events.find(x=>C.key(x)===C.key(e));if(old&&old.done===e.done&&old.total===e.total)return;
 e={...e,clock:events.reduce((n,x)=>Math.max(n,x.clock+1),Date.now()),device};if(!C.valid(e))return;
 events=C.merge(events,[e]);pending=C.merge(pending,[e]);try{persist();}catch{status('저장 공간 부족: 기록 백업이 필요합니다.');}clearTimeout(timer);timer=setTimeout(sync,800);
}
const b64=a=>btoa(String.fromCharCode(...new Uint8Array(a)));
const un64=s=>Uint8Array.from(atob(s),c=>c.charCodeAt(0));
async function encryptionKey(token){return crypto.subtle.importKey('raw',Uint8Array.from(token.match(/../g),h=>parseInt(h,16)),{name:'AES-GCM'},false,['encrypt','decrypt']);}
async function sync(){
 const token=localStorage.getItem(TOKEN);if(!token||busy)return;busy=true;status('동기화 중…');
 try{
  const headers={Authorization:'Bearer '+token,'Content-Type':'application/json'},key=await encryptionKey(token);
  const sent=pending.slice(0,200);
  if(sent.length){const iv=crypto.getRandomValues(new Uint8Array(12));const data=await crypto.subtle.encrypt({name:'AES-GCM',iv},key,new TextEncoder().encode(JSON.stringify(sent)));
   const r=await fetch(API,{method:'POST',headers,body:JSON.stringify({v:1,iv:b64(iv),data:b64(data)})});if(!r.ok)throw Error();
   const ids=new Set(sent.map(e=>C.key(e)+'|'+e.clock+'|'+e.device));pending=pending.filter(e=>!ids.has(C.key(e)+'|'+e.clock+'|'+e.device));
  }
  let cursor=null;do{const r=await fetch(API+(cursor?'?cursor='+encodeURIComponent(cursor):''),{headers,cache:'no-store'});if(!r.ok)throw Error();const body=await r.json();
   for(const b of body.batches){const bytes=await crypto.subtle.decrypt({name:'AES-GCM',iv:un64(b.iv)},key,un64(b.data));events=C.merge(events,JSON.parse(new TextDecoder().decode(bytes)));}cursor=body.cursor;
  }while(cursor);
  persist();status(pending.length?'동기화 중 · 남은 기록 '+pending.length+'개':'동기화 완료 · '+new Date().toLocaleTimeString('ko-KR'));
 }catch{status('동기화 대기 · 연결되면 재시도합니다.');}finally{busy=false;if(pending.length&&navigator.onLine)setTimeout(sync,15000);}
}
function unit(site,track,kind,id,done,total){const e={site,track,kind,unit:String(id),done:!!done,total},k=C.key(e),v=JSON.stringify([e.done,total]);if(observed[k]===v)return;const first=!(k in observed);observed[k]=v;localStorage.setItem(BASELINE,JSON.stringify(observed));if(first&&!e.done)return;record(e);}
function capture(){
 if(window.NexusExternalCapture)window.NexusExternalCapture(unit,read);
 const academy=read('study-nexus-academy-v1',{}).sites||{};
 for(const [site,r] of Object.entries(academy)){
  for(let i=0;i<4;i++)unit(site,'academy-v1','lesson',i,r.done?.includes(i),4);
  if(typeof r.score==='number')unit(site,'academy-v1','quiz','assessment',true,1);
 }
 const intensive=read('study-nexus-intensive-2026-v1',{}).courses||{};
 for(const [site,r] of Object.entries(intensive)){
  for(let i=0;i<8;i++){const l=r.lessons?.[i];unit(site,'intensive-v1','lesson',i,l?.done&&String(l.evidence||'').trim().length>=30,8);}
  for(const i of [1,4,7]){const p=r.projects?.[i];unit(site,'intensive-v1','project',i,p?.done&&String(p.evidence||'').trim().length>=80&&p.rubric?.filter(Boolean).length===3,3);}
  unit(site,'intensive-v1','exam','assessment',typeof r.quiz?.score==='number'&&r.quiz.score>=6,1);
 }
 const career=read('study-nexus-career-proof-2026-v1',{}).records||{};
 for(const [site,r] of Object.entries(career)){
  for(let i=0;i<5;i++){unit(site,'career-v1','project',i,r.steps?.includes(i),5);unit(site,'career-v1','check',i,r.criteria?.includes(i),6);}
  unit(site,'career-v1','check','evidence',String(r.evidence||'').trim().length>=200,6);
 }
}
window.NexusProgress={record,capture,sync,setUnit:unit,summary:site=>C.summary(events,site),events:()=>events.slice()};
window.addEventListener('nexus-learning-saved',capture);
window.addEventListener('storage',e=>{if([STORE,PENDING].includes(e.key)){events=C.merge(events,read(STORE,[]));pending=C.merge(pending,read(PENDING,[]));window.dispatchEvent(new Event('nexus-progress'));}else if(e.key?.startsWith('study-nexus-'))capture();});
window.addEventListener('online',sync);window.addEventListener('focus',sync);
document.addEventListener('DOMContentLoaded',()=>{
 const host=document.getElementById('nexus-sync-panel');
 if(host){host.innerHTML='<h2>학습 진도 자동 연동</h2><p>강의·퀴즈·시험 완료 기록을 자동 집계합니다. 기기 간에는 같은 연결 코드를 한 번 입력하세요. 코드는 기록 접근 권한이므로 본인 기기에서만 사용하세요.</p><label for="nexus-sync-code">기기 연결 코드</label><input id="nexus-sync-code" type="password" autocomplete="off" spellcheck="false" style="width:100%;max-width:40rem"><div class="data-actions"><button id="nexus-sync-new" class="primary-button">연결 코드 만들기</button><button id="nexus-sync-connect" class="secondary-button">이 코드로 연결</button><button id="nexus-sync-show" class="secondary-button">코드 표시 / 숨김</button><button id="nexus-sync-now" class="secondary-button">지금 동기화</button></div><p id="nexus-sync-status" role="status" aria-live="polite"></p><p>허브와 연동된 학습 사이트의 완료 진도를 공유합니다. 외부 사이트에도 같은 연결 코드를 한 번 입력하세요. 각 사이트의 통합 진도는 연결된 과정의 기록을 기준으로 계산됩니다. 메모·책 파일·계정 정보는 전송하지 않습니다.</p>';
 const input=document.getElementById('nexus-sync-code');input.value=localStorage.getItem(TOKEN)||'';
 document.getElementById('nexus-sync-new').onclick=()=>{if(localStorage.getItem(TOKEN)){status('이미 연결 코드가 있습니다. 다른 기기에서 이 코드를 입력하세요.');return;}input.value=[...crypto.getRandomValues(new Uint8Array(32))].map(x=>x.toString(16).padStart(2,'0')).join('');localStorage.setItem(TOKEN,input.value);pending=C.merge(pending,events);persist();sync();};
 document.getElementById('nexus-sync-connect').onclick=()=>{const token=input.value.trim();if(!/^[a-f0-9]{64}$/.test(token)){status('64자리 연결 코드를 확인하세요.');return;}const prior=localStorage.getItem(TOKEN);if(prior&&prior!==token){status('이미 다른 기록에 연결되어 있습니다. 기존 연결을 보존했습니다.');return;}localStorage.setItem(TOKEN,token);pending=C.merge(pending,events);persist();sync();};
 document.getElementById('nexus-sync-show').onclick=()=>input.type=input.type==='password'?'text':'password';document.getElementById('nexus-sync-now').onclick=sync;
 status(localStorage.getItem(TOKEN)?'동기화 준비됨':'이 기기에 자동 기록 중 · 기기 연결 전');
 }
 capture();sync();
});
setInterval(()=>{if(!document.hidden)sync();},60000);
})();
