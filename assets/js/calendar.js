// FullCalendar integration
import {getCurrentUser} from './auth.js';

let calendar;
export function initCalendar(){const el=document.getElementById('calendar');if(!el) return;const {Calendar}=window;
  calendar=new Calendar(el,{initialView:'dayGridMonth',height:650,headerToolbar:{left:'prev,next today',center:'title',right:'dayGridMonth,timeGridWeek,listWeek'},events:[],dateClick:(info)=>{
    const user=getCurrentUser();if(!user|| (user.role!=='admin'&&user.role!=='technician')) return;
    const title=prompt('Task title');if(!title) return;calendar.addEvent({title,start:info.dateStr,allDay:true});},
    eventClick:(info)=>{info.jsEvent.preventDefault();alert(info.event.title);} });
  calendar.render();
}
export function addCalendarEvent(evt){if(calendar) calendar.addEvent(evt)}