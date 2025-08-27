// Utilities and theme/role helpers
export const qs=(s,sc=document)=>sc.querySelector(s);export const qsa=(s,sc=document)=>Array.from(sc.querySelectorAll(s));export const on=(el,ev,cb,opt)=>el.addEventListener(ev,cb,opt);
export const storage={get:(k,d=null)=>{try{return JSON.parse(localStorage.getItem(k))??d}catch{return d}},set:(k,v)=>localStorage.setItem(k,JSON.stringify(v)),sget:(k,d=null)=>{try{return JSON.parse(sessionStorage.getItem(k))??d}catch{return d}},sset:(k,v)=>sessionStorage.setItem(k,JSON.stringify(v))};
export const throttle=(fn,wait=200)=>{let t=0;return (...a)=>{const n=Date.now();if(n-t>=wait){t=n;fn(...a)}}};export const debounce=(fn,wait=300)=>{let id;return(...a)=>{clearTimeout(id);id=setTimeout(()=>fn(...a),wait)}};
export const sleep=(ms)=>new Promise(r=>setTimeout(r,ms));

// Theme
const prefers=window.matchMedia('(prefers-color-scheme: dark)');
export function setTheme(mode){const html=document.documentElement;let applied=mode; if(mode==='auto'){applied=prefers.matches?'dark':'light'};html.setAttribute('data-theme',applied);storage.set('theme',mode);document.dispatchEvent(new CustomEvent('themechange',{detail:{mode,applied}}));}
export function initTheme(){const saved=storage.get('theme','auto');setTheme(saved);on(prefers,'change',()=>{if(storage.get('theme','auto')==='auto')setTheme('auto')});}

// Roles
export const Roles=['viewer','technician','admin'];
export function hasRole(userRole,required){const order={viewer:0,technician:1,admin:2};return order[userRole]>=order[required];}
export function applyRoleGates(root,userRole){qsa('[data-requires-role]',root).forEach(el=>{const need=el.getAttribute('data-requires-role');el.toggleAttribute('disabled',!hasRole(userRole,need));el.style.display=hasRole(userRole,need)?'':'none';});}

// Colors from CSS vars
export function cssVar(name){return getComputedStyle(document.documentElement).getPropertyValue(name).trim();}