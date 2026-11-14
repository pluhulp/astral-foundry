// Shared eligibility explanations. These preserve the existing costs and unlock rules.
function researchRequirements(t){if(!t)return[{done:false,label:'Unknown technology'}];return [
 {done:state.stage>=t.stage,label:'Reach '+worlds[t.stage][0],action:"go('expeditions');inspectPlanet("+t.stage+")"},
 ...t.pre.map(id=>({done:has(id),label:techs.find(x=>x.id===id)?.name||id,action:"focusTech('"+id+"')"})),
 {done:cap('science')>=t.cost,label:'Research capacity: '+fmt(cap('science'))+' / '+fmt(t.cost),action:"viewResource('science')"},
 {done:state.r.science+1e-8>=t.cost,label:'Research points: '+fmt(state.r.science)+' / '+fmt(t.cost),action:"viewResource('science')"}
]}
function researchBlockers(t){return researchRequirements(t).filter(r=>!r.done)}
const checkedResearch=research;research=function(id){const t=techs.find(t=>t.id===id);if(!t||has(id))return;const missing=researchBlockers(t);if(missing.length){toast(missing[0].label);return}checkedResearch(id)};
function expeditionRequirements(target=state.stage+1){if(target<=state.stage)return[{done:false,label:'This outpost is already established.'}];if(target>=worlds.length)return[{done:false,label:'All destinations explored.'}];const c=target===state.stage+1?missionCost():{fuel:worlds[target][4]*UNIT_SCALE,metal:100*Math.pow(2.5,target-1)*UNIT_SCALE,science:30*Math.pow(2.3,target-1)*UNIT_SCALE};return [
 {done:target===state.stage+1,label:target===state.stage+1?'Next destination in range':'Establish '+worlds[target-1][0]+' first'},
 {done:!state.mission,label:state.mission?'Expedition already in flight':'Launch bay available'},
 {done:!state.paused,label:state.paused?'Resume simulation to travel':'Simulation running',action:"state.paused=false;save();render()"},
 {done:has('rocketry'),label:'Liquid-fuel rocketry',action:"go('research');focusTech('rocketry')"},
 ...(target>10?[{done:has('warp'),label:'Alcubierre geometry',action:"go('research');focusTech('warp')"}]:[]),
 ...Object.entries(c).map(([k,v])=>({done:state.r[k]+1e-8>=v,label:R[k][0]+': '+fmt(state.r[k])+' / '+fmt(v)+(cap(k)<v?' · expand storage':''),action:"viewResource('"+k+"')"}))
]}
function launchTo(target){const missing=expeditionRequirements(target).filter(r=>!r.done);if(missing.length){toast(missing[0].label);return}launch();render()}
function requirementsList(rows){return rows.map(r=>`<div class="requirement ${r.done?'met':'unmet'}"><span>${r.done?'✓':'○'}</span>${!r.done&&r.action?`<button onclick="${r.action}">${escapeHtml(r.label)} →</button>`:`<span>${escapeHtml(r.label)}</span>`}</div>`).join('')}
const navigationLive=updateLive;updateLive=function(){navigationLive();document.querySelectorAll('[data-research-requirements]').forEach(e=>{let t=techs.find(t=>t.id===e.dataset.researchRequirements);{const h=requirementsList(researchRequirements(t));if(e.innerHTML!==h)e.innerHTML=h}});document.querySelectorAll('[data-tech]').forEach(e=>{let t=techs.find(t=>t.id===e.dataset.tech);e.disabled=has(t.id)||researchBlockers(t).length>0});document.querySelectorAll('[data-expedition-requirements]').forEach(e=>{const h=requirementsList(expeditionRequirements(+e.dataset.expeditionRequirements));if(e.innerHTML!==h)e.innerHTML=h});document.querySelectorAll('[data-launch-target]').forEach(e=>{e.disabled=expeditionRequirements(+e.dataset.launchTarget).some(r=>!r.done)});document.querySelectorAll('[data-flight-time]').forEach(e=>{e.textContent=state.mission?Math.ceil(state.mission.left)+'s to arrival':'Expedition complete'});document.querySelectorAll('[data-flight-progress]').forEach(e=>e.style.width=state.mission?(100-state.mission.left/state.mission.total*100)+'%':'100%')};
