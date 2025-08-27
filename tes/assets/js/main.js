// App bootstrap
import {qs,qsa,on,debounce,throttle,initTheme,setTheme,cssVar,applyRoleGates} from './utils.js';
import {ASSETS,filterLogs,computeKPIs,addAlert} from './data.js';
import {initAuth,logout,getCurrentUser} from './auth.js';
import {initCharts} from './charts.js';
import {initCalendar,addCalendarEvent} from './calendar.js';

function switchSection(name){qsa('.section').forEach(s=>{const active=s.id==='section-'+name;s.hidden=!active;s.classList.toggle('active',active)});qsa('.nav-item').forEach(b=>{const act=b.dataset.target===name;b.classList.toggle('active',act);b.setAttribute('aria-current',act?'page':'false')});localStorage.setItem('lastSection',name);}

function renderAssets(list=ASSETS){const grid=qs('#assetsGrid');grid.innerHTML='';list.forEach(a=>{const div=document.createElement('div');div.className='asset';div.innerHTML=`<div><strong>${a.name}</strong><div class="muted">${a.id} · ${a.type}</div></div><div class="status"><span class="dot ${a.status==='ok'?'ok':a.status==='warn'?'warn':'err'}"></span><span>${a.status.toUpperCase()}</span></div>`;grid.appendChild(div)});}

function renderKPIs(){const k=computeKPIs();qs('#kpiOpenWO').textContent=k.openWO;qs('#kpiMTBF').textContent=k.mtbf;qs('#kpiHealth').textContent=k.health+'%';qs('#kpiCritical').textContent=k.critical;}

function renderAlerts(){const panel=qs('#recentAlerts');const alerts=JSON.parse(localStorage.getItem('recentAlerts')||'[]');panel.innerHTML='';alerts.slice(0,6).forEach(a=>{const li=document.createElement('li');li.className='alert '+(a.level==='error'?'error':a.level==='warn'?'warn':'info');li.innerHTML=`<i class="fa-regular fa-bell"></i><span>${a.msg}</span><span class="muted"> · ${new Date(a.time).toLocaleString()}</span>`;panel.appendChild(li)});}

function pushAlert(level,msg,asset){const a=addAlert(level,msg,asset);const list=JSON.parse(localStorage.getItem('recentAlerts')||'[]');list.unshift(a);localStorage.setItem('recentAlerts',JSON.stringify(list.slice(0,20)));renderAlerts();}

function renderLogs(){const body=qs('#logsTable tbody');const search=qs('#logSearch').value;const level=qs('#logLevel').value;const rows=filterLogs(search,level);body.innerHTML='';rows.forEach(r=>{const tr=document.createElement('tr');tr.innerHTML=`<td>${new Date(r.time).toLocaleString()}</td><td>${r.asset}</td><td>${r.level.toUpperCase()}</td><td>${r.message}</td>`;body.appendChild(tr)});}

function applyRoute(){const name=location.hash?location.hash.slice(1):(localStorage.getItem('lastSection')||'dashboard');switchSection(name);}

function bindNav(){qsa('.nav-item').forEach(b=>on(b,'click',()=>{const target=b.dataset.target; if(location.hash!==('#'+target)){location.hash=target;} else {switchSection(target);}}));}

function bindTopbar(){on(qs('#themeToggle'),'click',()=>{const cur=localStorage.getItem('theme')||'auto';const next=cur==='light'?'dark':cur==='dark'?'auto':'light';setTheme(next)});on(qs('#globalSearch'),'input',debounce((e)=>{const term=e.target.value.toLowerCase();const list=ASSETS.filter(a=>`${a.name} ${a.id} ${a.type}`.toLowerCase().includes(term));renderAssets(list);if(qs('#section-logs').classList.contains('active')) renderLogs();},200));on(qs('#logoutBtn'),'click',logout);} 

function bindSettings(){qsa('#section-settings [data-theme]').forEach(btn=>on(btn,'click',()=>setTheme(btn.dataset.theme)));}

function bindLogs(){on(qs('#logSearch'),'input',debounce(renderLogs,200));on(qs('#logLevel'),'change',renderLogs);} 

function simulateTraffic(){setInterval(()=>{const r=Math.random();if(r<.4) pushAlert('info','Routine check completed',ASSETS[0].id); else if(r<.7) pushAlert('warn','Temperature approaching threshold',ASSETS[1].id); else pushAlert('error','Vibration anomaly detected',ASSETS[3].id);},7000);}

function bindCalendar(){const btn=document.getElementById('addEventBtn');if(!btn) return;on(btn,'click',()=>{const user=getCurrentUser();if(!user|| (user.role!=='admin'&&user.role!=='technician')) return;const title=prompt('Task title');if(!title) return;const date=prompt('YYYY-MM-DD');if(!date) return;addCalendarEvent({title,start:date,allDay:true});});}

async function init(){initTheme();initAuth();bindNav();window.addEventListener('hashchange',applyRoute);applyRoute();bindTopbar();bindSettings();renderAssets();renderKPIs();renderAlerts();bindLogs();initCharts();initCalendar();bindCalendar();simulateTraffic();renderLogs();initMotionEffects();initHistory();}

// Initialize motion effects
function initMotionEffects() {
  // Create new motion effects instance
  window.motionEffects = new MotionEffects();
}

// Initialize history section
function initHistory() {
  // History manager is initialized by history.js
  // Just ensure it's available
  if (window.historyManager) {
    console.log('History manager initialized successfully');
  }
}

document.addEventListener('DOMContentLoaded',init);