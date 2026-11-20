(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.NexusProgressCore=factory();})(globalThis,function(){
'use strict';
const safe=s=>typeof s==='string'&&/^[a-zA-Z0-9_.:-]{1,120}$/.test(s);
function valid(e){return e&&safe(e.site)&&safe(e.track)&&safe(e.unit)&&['lesson','quiz','exam','project','check'].includes(e.kind)&&typeof e.done==='boolean'&&Number.isInteger(e.total)&&e.total>0&&e.total<=100000&&Number.isSafeInteger(e.clock)&&e.clock>0&&safe(e.device);}
const key=e=>[e.site,e.track,e.kind,e.unit].join('|');
function merge(...sets){const out=new Map();for(const list of sets)for(const e of list||[])if(valid(e)){const k=key(e),old=out.get(k);if(!old||e.clock>old.clock||(e.clock===old.clock&&e.device>old.device))out.set(k,e);}return [...out.values()];}
function summary(events,site){const groups=new Map();for(const e of merge(events).filter(e=>e.site===site)){const k=e.track+'|'+e.kind;let g=groups.get(k);if(!g)groups.set(k,g={total:0,done:0,kind:e.kind});g.total=Math.max(g.total,e.total);if(e.done)g.done++;}let done=0,total=0;for(const g of groups.values()){done+=Math.min(g.done,g.total);total+=g.total;}return {done,total,percent:total?Math.round(done/total*100):0,groups:[...groups.values()]};}
return {valid,key,merge,summary};
});
