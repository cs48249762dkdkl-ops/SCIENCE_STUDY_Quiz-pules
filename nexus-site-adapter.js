(()=>{
'use strict';
const config=window.NexusSiteConfig;if(!config)return;
const keys=new Set(config.groups.map(g=>g.key));keys.add('nexus-native-completion-v1');keys.add('nexus-quiz-completion-v1');for(const g of config.groups)for(const k of g.rawKeys||[])keys.add(k);
let queued=false;
function changed(){if(!queued){queued=true;queueMicrotask(()=>{queued=false;window.NexusProgress?.capture();renderSummary();});}}
const original=Storage.prototype.setItem,remove=Storage.prototype.removeItem;
Storage.prototype.setItem=function(key,value){original.call(this,key,value);if(this===localStorage&&keys.has(String(key)))changed();};
Storage.prototype.removeItem=function(key){remove.call(this,key);if(this===localStorage&&keys.has(String(key)))changed();};
const path=(v,p)=>p?p.split('.').reduce((a,k)=>a?.[k],v):v;
const asId=v=>String(v);
window.NexusExternalCapture=(unit,read)=>{
 for(const g of config.groups){const v=path(read(g.key,g.mode==='array'?[]:{}),g.path);let done=[];
  if(g.mode==='array')done=Array.isArray(v)?v.map(asId):[];
  if(g.mode==='truthy')done=v&&typeof v==='object'?Object.keys(v).filter(k=>v[k]):[];
  if(g.mode==='present')done=v&&typeof v==='object'?Object.keys(v).filter(k=>v[k]!==null&&v[k]!==undefined):[];
  if(g.mode==='count')done=Number(v)>0?['assessment']:[];
  if(g.mode==='raw')done=(g.rawKeys||[]).filter(k=>localStorage.getItem(k)==='done');
  if(g.mode==='number')done=typeof v==='number'?['assessment']:[];
  const universe=g.ids?new Set(g.ids.map(asId)):null;
  if(universe)done=done.filter(id=>universe.has(id));
  const baselineKey='nexus-adapter-seen:'+g.track+':'+g.kind;
  const known=new Set([...read(baselineKey,[]),...done]);
  const active=new Set(done);
  // Only previously encountered units need cancellation checks. Never create 20,000 empty records.
  for(const raw of known){const id=g.ids?String(g.ids.map(asId).indexOf(raw)):raw;if(/^[a-zA-Z0-9_.:-]{1,120}$/.test(id))unit(config.site,g.track,g.kind,id,active.has(raw),g.total);}
  try{original.call(localStorage,baselineKey,JSON.stringify([...known]));}catch{}
 }
 for(const [track,entries] of Object.entries(read('nexus-quiz-completion-v1',{})))for(const [id,v] of Object.entries(entries||{}))unit(v.site||config.site,track,'quiz',id,!!v.done,v.total);
 const native=read('nexus-native-completion-v1',{});
 for(const [track,entries] of Object.entries(native))for(const [id,v] of Object.entries(entries||{}))unit(v.site||config.site,track,'lesson',id,!!v.done,v.total);
};
window.NexusMarkQuiz=(id,total,track='graded-v1')=>{let v={};try{v=JSON.parse(localStorage.getItem('nexus-quiz-completion-v1')||'{}');}catch{}v[track]??={};v[track][String(id)]={done:true,total,site:config.site};try{localStorage.setItem('nexus-quiz-completion-v1',JSON.stringify(v));}catch{}};
function renderSummary(){const e=document.getElementById('nexus-site-summary');if(e){const s=window.NexusProgress?.summary(config.site);e.textContent=s?.total?'통합 진도 '+s.percent+'% · 완료 '+s.done+'/'+s.total+' (연동된 과정 기준)':'완료한 강의·문제를 자동으로 집계합니다.';}}
function mount(){
 let host=document.getElementById('nexus-sync-panel');if(!host){host=document.createElement('section');host.id='nexus-sync-panel';document.body.append(host);}
 const style=document.createElement('style');style.textContent='#nexus-sync-panel{box-sizing:border-box;display:block!important;clear:both;width:calc(100% - 32px);max-width:1000px;margin:28px auto;padding:20px;border:1px solid #617e91;border-radius:16px;background:#102739;color:#f0f8ff;font:16px/1.65 system-ui;overflow-wrap:anywhere}#nexus-sync-panel h2{color:inherit;font-size:1.3rem}#nexus-sync-panel input{display:block;box-sizing:border-box;width:100%;min-width:0;padding:12px;background:#fff;color:#172c3d;border:1px solid #aaa;border-radius:8px;font:inherit}#nexus-sync-panel .data-actions{display:flex;flex-wrap:wrap;gap:10px;margin-top:12px}#nexus-sync-panel button{white-space:normal;min-height:44px;padding:10px 14px;border-radius:8px;border:1px solid #648797;background:#e0fff2;color:#123a30;font:600 1rem system-ui;cursor:pointer}.nexus-unit-check{display:flex!important;align-items:center;gap:10px;margin:12px 0;padding:12px;border:1px solid #7c9f94;border-radius:8px;font:500 16px/1.6 system-ui;white-space:normal}.nexus-unit-check input{width:20px!important;min-width:20px;height:20px!important;flex:none}';document.head.append(style);
 const top=document.createElement('p');top.id='nexus-site-summary';top.setAttribute('role','status');host.before(top);top.style.cssText='max-width:1000px;margin:12px auto;padding:0 16px;font:600 16px system-ui';renderSummary();
 // These existing eight-lesson blocks previously had no completion controls.
 document.querySelectorAll('details[data-nexus-native] > div > details').forEach((detail,i,all)=>{
  const page=location.pathname.replace(/\/index\.html$/,'/').replace(/[^a-zA-Z0-9]/g,'-').slice(0,70)||'home';const track='native-v1:'+page;
  const label=document.createElement('label');label.className='nexus-unit-check';const input=document.createElement('input');input.type='checkbox';
  let saved={};try{saved=JSON.parse(localStorage.getItem('nexus-native-completion-v1')||'{}');}catch{}
  input.checked=!!saved[track]?.[i]?.done;
  input.addEventListener('change',()=>{let value={};try{value=JSON.parse(localStorage.getItem('nexus-native-completion-v1')||'{}');}catch{}value[track]??={};value[track][i]={done:input.checked,total:all.length,site:config.site};try{localStorage.setItem('nexus-native-completion-v1',JSON.stringify(value));}catch{input.checked=!input.checked;}});
  label.append(input,document.createTextNode('이 강의 학습·실습 완료'));detail.append(label);
 });
 changed();
}
window.addEventListener('nexus-progress',renderSummary);
document.addEventListener('DOMContentLoaded',mount);
})();
