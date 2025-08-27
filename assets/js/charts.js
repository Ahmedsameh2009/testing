// Chart.js wrappers with theme support and lazy init
import {cssVar} from './utils.js';
import {lineSeries,barSeries,donutSeries} from './data.js';

let charts={};
function palette(){return{bg:cssVar('--bg'),panel:cssVar('--panel'),text:cssVar('--text'),muted:cssVar('--muted'),primary:cssVar('--primary'),accent:cssVar('--accent'),warn:cssVar('--warn'),danger:cssVar('--danger'),border:cssVar('--border')}}

function buildLine(ctx){const p=palette();const d=lineSeries();return new Chart(ctx,{type:'line',data:{labels:d.labels,datasets:[{label:'Work Orders',data:d.data,borderColor:p.primary,backgroundColor:p.primary+'33',fill:true,tension:.3}]},options:{responsive:true,plugins:{legend:{display:false}},scales:{x:{ticks:{color:p.muted}},y:{ticks:{color:p.muted},grid:{color:p.border}}}}})}
function buildBar(ctx){const p=palette();const d=barSeries();return new Chart(ctx,{type:'bar',data:{labels:d.labels,datasets:[{label:'Count',data:d.data,backgroundColor:[p.primary,p.accent,p.warn,p.danger]}]},options:{plugins:{legend:{display:false}},scales:{x:{ticks:{color:p.muted}},y:{ticks:{color:p.muted}}}}})}
function buildDonut(ctx){const p=palette();const d=donutSeries();return new Chart(ctx,{type:'doughnut',data:{labels:d.labels,datasets:[{data:d.data,backgroundColor:[p.accent,p.warn,p.danger]}]},options:{plugins:{legend:{labels:{color:p.muted}}}}})}

export function initCharts(){const line=document.getElementById('lineChart');const bar=document.getElementById('barChart');const donut=document.getElementById('donutChart');
  const obs=new IntersectionObserver((entries)=>{entries.forEach(e=>{if(e.isIntersecting){const id=e.target.id;if(charts[id]) return;charts[id]=id==='lineChart'?buildLine(e.target):id==='barChart'?buildBar(e.target):buildDonut(e.target);}})},{threshold:.2});[line,bar,donut].forEach(c=>c&&obs.observe(c));
  document.addEventListener('themechange',()=>{Object.values(charts).forEach(ch=>{const p=palette();if(ch.config.type==='line'){ch.data.datasets[0].borderColor=p.primary;ch.data.datasets[0].backgroundColor=p.primary+'33';}
    if(ch.config.type==='bar'){ch.data.datasets[0].backgroundColor=[p.primary,p.accent,p.warn,p.danger];}
    if(ch.config.type==='doughnut'){ch.data.datasets[0].backgroundColor=[p.accent,p.warn,p.danger];}
    ch.update('none');});});}