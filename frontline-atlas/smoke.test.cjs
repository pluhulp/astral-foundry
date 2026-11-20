'use strict';
/* Frontline Atlas: Reforged - deterministic smoke checks (no npm packages) */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
const match = html.match(/<script>([\s\S]*?)<\/script>/);
assert.ok(match, 'the inline game script is present');

const elements = Object.create(null), frames = [], timers = [], stored = Object.create(null);
const mockCtx = new Proxy({createLinearGradient: () => ({addColorStop(){}})}, {
 get(target, key) {return key in target ? target[key] : (() => {})}
});
function element(id='') {
 let children = [], state = new Set(), style = {};
 return {
  id, children,
  get style(){return style}, set style(v){style={cssText:v}},
  classList:{
   add(v){state.add(v)},remove(v){state.delete(v)},
   toggle(v,on){if(on)state.add(v);else state.delete(v)},
   contains(v){return state.has(v)}
  },
  appendChild(child){children.push(child);return child},
  addEventListener(){},
  querySelector(q){return q==='div'?children.find(c=>c.tagName==='div'):null},
  querySelectorAll(q){return q==='button'?children.filter(c=>c.tagName==='button'):[]},
  getBoundingClientRect(){return {width:1000,height:700,left:0,top:0}},
  getContext(){return mockCtx},
  get clientWidth(){return 1000},get clientHeight(){return 700},
  get innerHTML(){return this._html||''},set innerHTML(v){this._html=v;children.length=0},
  get textContent(){return this._text||''},set textContent(v){this._text=v}
 };
}
const document = {
 getElementById(id){return elements[id]||(elements[id]=element(id))},
 createElement(type){const e=element();e.tagName=type;return e},
 querySelectorAll(){return []},body:{appendChild(){}}
};
const window = {addEventListener(){}};
const localStorage={
 getItem(k){return stored[k]||null},setItem(k,v){stored[k]=v},removeItem(k){delete stored[k]}
};
new Function('document','window','localStorage','requestAnimationFrame','devicePixelRatio','setTimeout','clearTimeout',match[1])(
 document,window,localStorage,cb=>frames.push(cb),1,cb=>{timers.push(cb);return 1},()=>{}
);
const game = window.__frontlineTest;
assert.ok(game,'game testing API exposed');
assert.equal(game.SCENARIOS.length,10);
assert.ok(Object.keys(game.UNIT).length>=24);
for(const tab of ['navMissions','navSkirmish','openTech','navLoadout','navProfile','navMarket','navCosmetics','navDaily','navSettings','openHelp']){
 assert.equal(typeof elements[tab].onclick,'function','missing lobby handler: '+tab);
 elements[tab].onclick();
}
for(let i=0;i<game.SCENARIOS.length;i++){
 game.begin(i);
 assert.ok(game.state.units.some(u=>u.team===1));
 assert.ok(game.state.units.some(u=>u.team===2));
 assert.ok(Object.keys(game.state.explored[1]).length>0,'initial fog exploration empty');
 for(let f=0;f<3;f++)frames.shift()?.();
 elements.end.onclick();
 for(const callback of timers.splice(0))callback();
 for(let f=0;f<3;f++)frames.shift()?.();
 assert.equal(game.state.turn,2,'turn could not advance: '+i);
}
game.begin(0);
let position=game.deploymentTiles('rifle')[0];
assert.ok(position,'no deployment tiles');
let count=game.state.units.length;
assert.equal(game.deployAt('rifle',position.x,position.y),true);
assert.equal(game.state.units.length,count+1);
game.writeBattle();
assert.ok(game.savedBattle(),'battle checkpoint missing');
assert.equal(game.resumeBattle(),true);
const rifle=game.state.units.find(u=>u.team===1&&u.type==='rifle');
rifle.morale=1;
assert.equal(game.rally(rifle),true);
assert.equal(rifle.morale,4);
const pointsBefore=game.save.points;
game.finishBattle(false);
assert.ok(game.save.points>pointsBefore,'result did not reward research points');
assert.equal(game.savedBattle(),null,'finished battle checkpoint remains');
assert.ok(Object.keys(game.save.unitXP).length>0,'troops did not receive XP');
console.log('PASS: 10 missions, all lobby tabs, drawing, enemy turn, deployment, resume, rally, battle rewards and XP');
