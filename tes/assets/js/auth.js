// Simple demo auth with role-based UI gates
import {qs,on,storage,applyRoleGates,Roles} from './utils.js';

export function getCurrentUser(){return storage.sget('user',null)}
function setCurrentUser(u){storage.sset('user',u)}
export function logout(){storage.sset('user',null);location.reload()}

function updateBadge(user){const badge=qs('#userBadge');if(!badge) return;badge.textContent=`${user.username} · ${user.role}`;const roleEl=qs('#currentRole');if(roleEl) roleEl.textContent=user.role;}

export function initAuth(){const modal=qs('#auth-modal');const app=qs('#app');const form=qs('#login-form');
  const existing=getCurrentUser();if(existing){app.hidden=false;modal.hidden=true;updateBadge(existing);applyRoleGates(document.body,existing.role);return}
  modal.hidden=false;on(form,'submit',(e)=>{e.preventDefault();const username=qs('#username').value.trim()||'user';const role=qs('#role').value;const user={username,role,token:Math.random().toString(36).slice(2)};setCurrentUser(user);app.hidden=false;modal.hidden=true;updateBadge(user);applyRoleGates(document.body,role);});}