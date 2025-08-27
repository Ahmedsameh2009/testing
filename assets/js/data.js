// Mock data and computations
export const ASSETS=[
 {id:'A-100',name:'Compressor A',type:'Compressor',status:'ok',health:92,lastService:'2025-07-04'},
 {id:'A-101',name:'Boiler B',type:'Boiler',status:'warn',health:76,lastService:'2025-06-18'},
 {id:'A-102',name:'Pump C',type:'Pump',status:'ok',health:88,lastService:'2025-05-22'},
 {id:'A-103',name:'Conveyor D',type:'Conveyor',status:'err',health:45,lastService:'2025-08-01'},
 {id:'A-104',name:'Chiller E',type:'Chiller',status:'ok',health:90,lastService:'2025-07-29'},
 {id:'A-105',name:'Valve F',type:'Valve',status:'warn',health:71,lastService:'2025-06-02'},
 {id:'A-106',name:'Motor G',type:'Motor',status:'ok',health:95,lastService:'2025-08-15'},
 {id:'A-107',name:'Generator H',type:'Generator',status:'ok',health:87,lastService:'2025-07-08'},
];

function rand(n){return Math.floor(Math.random()*n)}
const LEVELS=['info','warn','error'];
export let LOGS=Array.from({length:60},(_,i)=>({
  id:i+1,time:new Date(Date.now()-rand(7*24*3600*1000)).toISOString(),
  asset:ASSETS[rand(ASSETS.length)].id,
  level:LEVELS[rand(LEVELS.length)],
  message:['Inspection complete','Temperature high','Pressure drop detected','Lubrication needed','Unexpected shutdown'][rand(5)]
}));

export let ALERTS=[];
export function addAlert(level,msg,asset){const a={id:crypto.randomUUID?crypto.randomUUID():String(Date.now()+Math.random()),time:new Date().toISOString(),level,msg,asset};ALERTS.unshift(a);ALERTS=ALERTS.slice(0,50);return a;}

// KPIs
export function computeKPIs(){const openWO=rand(20)+12;const mtbf=48+rand(72);const health=Math.round(ASSETS.reduce((a,b)=>a+b.health,0)/ASSETS.length);const critical=ALERTS.filter(a=>a.level==='error').length;return{openWO,mtbf,health,critical};}

// Charts data
export function lineSeries(){const lbl=Array.from({length:12},(_,i)=>`W${i+1}`);const v=lbl.map(()=>rand(12)+6);return{labels:lbl,data:v};}
export function barSeries(){const types=['Preventive','Corrective','Inspection','Upgrade'];const v=types.map(()=>rand(20)+4);return{labels:types,data:v};}
export function donutSeries(){const ok=ASSETS.filter(a=>a.status==='ok').length;const warn=ASSETS.filter(a=>a.status==='warn').length;const err=ASSETS.filter(a=>a.status==='err').length;return{labels:['OK','Warning','Error'],data:[ok,warn,err]};}

// Logs filtering
export function filterLogs(search,level){search=search?.toLowerCase()||'';return LOGS.filter(l=>{
  const okLevel=level==='all'||l.level===level;const txt=`${l.asset} ${l.level} ${l.message}`.toLowerCase();return okLevel && txt.includes(search);
});}

// Seed some alerts
addAlert('warn','Temperature trending high',ASSETS[1].id);
addAlert('info','Scheduled inspection created',ASSETS[2].id);
addAlert('error','Unexpected shutdown detected',ASSETS[3].id);