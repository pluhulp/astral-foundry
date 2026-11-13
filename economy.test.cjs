const vm=require('node:vm'),fs=require('node:fs'),assert=require('node:assert/strict');
const empty=()=>{},node={addEventListener:empty,style:{setProperty:empty},classList:{add:empty,remove:empty,toggle:empty},dataset:{}};
const context=vm.createContext({console,Date,Math,JSON,Object,Array,Number,String,Set,Map,setTimeout:()=>0,clearTimeout:empty,document:{addEventListener:empty,getElementById:()=>node,querySelector:()=>null,querySelectorAll:()=>[],documentElement:node},window:{addEventListener:empty},localStorage:{setItem:empty,getItem:()=>null},assert});
for(const f of ['game.js','universe.js','polish.js','bridge.js','economy.js'])vm.runInContext(fs.readFileSync(f,'utf8'),context,{filename:f});
vm.runInContext(`
render=()=>{};updateLive=()=>{};showCinema=()=>{};save=()=>{};toast=()=>{};
const near=(a,b)=>assert.ok(Math.abs(a-b)<1e-6, a+' != '+b);
state=fresh(); assert.ok(validate(state)); assert.equal(state.r.metal,300);assert.equal(cap('metal'),10000);
const old={...fresh(),economyUnits:undefined,r:{...fresh().r,metal:12},insightTotal:40};
const converted=migrate(old);assert.equal(converted.r.metal,120);assert.equal(converted.insightTotal,400);assert.deepEqual(migrate(converted),converted);assert.ok(validate(converted));
state=fresh();state.cinema=false;build('drill');assert.equal(state.m.drill,1);near(state.r.metal,180.003);simulate(1);near(rates.metal,3);
state=fresh();gather('metal');assert.equal(state.r.metal,310);
for(const [id,k,rate] of [['drill','metal',3],['forest','wood',2.2],['crystal','gems',1.3]]){state=fresh();state.m[id]=1;simulate(1);near(rates[k],rate)}
state=fresh();state.r.metal=10000;expandStorage('metal');assert.equal(cap('metal'),20000);assert.equal(cap('wood'),10000);near(state.r.metal,6500);
state=fresh();assert.equal(techs.find(t=>t.id==='industry').cost,250);assert.equal(missionCost().fuel,400);assert.equal(missionCost().metal,1000);assert.equal(upgradeCost('wood').science,750);
state=fresh();state.stage=10;state.megas=['wonder'];state.r.science=100000;state.r.fuel=20000;beginSurvey();assert.equal(state.r.science,50000);assert.equal(state.r.fuel,10000);simulate(60);assert.equal(state.r.insight,400);assert.equal(state.insightTotal,400);
state=fresh();state.m.drill=1;state.paused=true;simulate(5);assert.equal(state.r.metal,300);state.paused=false;state.off.drill=true;simulate(5);assert.equal(state.r.metal,300);
state=fresh();state.m.drill=1;for(let i=0;i<28800;i++)simulate(1);assert.equal(state.r.metal,10000);
for(const m of machines){state=fresh();state.stage=15;state.cinema=false;state.tech=techs.map(t=>t.id);state.wonders=wonders.map(w=>w.id);state.storageLevels=Object.fromEntries(Object.keys(R).map(k=>[k,35]));state.r=Object.fromEntries(Object.keys(R).map(k=>[k,1e16]));state.m[m.id]=1;simulate(1);assert.ok(Object.values(state.r).every(v=>Number.isFinite(v)&&v>=0));assert.ok(Object.values(m.cost).every(v=>v>0));assert.ok(Object.values(m.out).every(v=>v>0))}
console.log('PASS: fresh economy, save migration/idempotence, starter rates/build/gather, independent storage, research/launch/upgrade prices, survey cost/reward, pause, 8h simulation, '+machines.length+' machine recipes.');
`,context);
