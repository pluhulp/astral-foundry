const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),A=require('./core.js');
const source=fs.readFileSync(__dirname+'/app.js','utf8');

function harness(A,source,initial={}){
 const nodes=new Map(),listeners={},data=new Map(Object.entries(initial));
 const node=id=>{if(!nodes.has(id))nodes.set(id,{hidden:false,innerHTML:'',textContent:'',value:'',style:{},classList:{add(){},remove(){}},focus(){},click(){}});return nodes.get(id);};
 const document={getElementById:node,addEventListener:(name,fn)=>listeners[name]=fn,createElement:()=>({click(){}})};
 class View{constructor(){this.angle=-.55;this.zoom=1;this.pan={};View.instance=this;}setState(s){this.state=s;}resize(){}mark(){}sync(){}events(){this.state.events=[];}cameraUpdate(){}panByPixels(dx,dy){this.panLog=[dx,dy];}centerOn(x,y){this.focus=[x,y];}}
 const storage={getItem:k=>data.get(k)||null,setItem:(k,v)=>data.set(k,v)};
 new Function('Atlas','document','window','localStorage','matchMedia','AtlasView','setTimeout','clearTimeout',source)(A,document,{scrollTo(){}},storage,()=>({matches:false}),View,()=>0,()=>{});
 const click=(action,id)=>listeners.click({target:{closest:()=>({dataset:{do:action,id:id===undefined?undefined:String(id)},disabled:false})}});
 return {nodes,node,click,change:(id,checked)=>listeners.change({target:{id,checked,value:checked}}),view:()=>View.instance,saved:()=>JSON.parse(data.get('frontline-atlas-v3')||'null'),key:e=>listeners.keydown({target:{tagName:'BODY'},preventDefault(){},...e})};
}

test('boot opens main menu without starting a battle',()=>{let h=harness(A,source);assert(h.node('screen-content').innerHTML.includes('FRONTLINE'));assert(h.node('battle').hidden);assert.equal(h.view(),undefined);});
function setup(){let h=harness(A,source);h.click('mission',0);h.click('deploy');return h;}
function place(h,type='rifle',i=0){h.click('hq');h.click('spawn',type);h.view().onClick(h.view().state.pads[i]);}
test('battle begins in paid deployment with HQ panel and no free troops',()=>{let h=setup();assert.equal(A.alive(h.view().state,0).length,0);assert.equal(h.saved().battle.credits,10);assert(h.node('unit-panel').innerHTML.includes('Deployment & resupply'));assert.equal(h.node('end-turn').textContent,'Begin operation →');});
test('choosing a troop requires a valid pad and deducts supply once',()=>{let h=setup();h.click('spawn','light');assert.equal(A.alive(h.view().state,0).length,0);h.view().onClick({x:10,y:10});assert.equal(h.view().state.credits,10);h.view().onClick(h.view().state.pads[0]);assert.equal(h.view().state.credits,6);assert.equal(A.alive(h.view().state,0).length,1);});
test('starting operation and selecting deployed troop opens weapons',()=>{let h=setup();place(h,'light');h.node('end-turn').onclick();let u=h.view().state.units.find(u=>u.team===0);h.view().onClick(u);assert(h.node('unit-panel').innerHTML.includes('Main gun'));assert(h.node('unit-panel').innerHTML.includes('4/4'));assert.equal(h.view().state.phase,'combat');});
test('empty force cannot begin operation',()=>{let h=setup();h.node('end-turn').onclick();assert.equal(h.view().state.phase,'deployment');assert(h.node('toast').textContent.includes('at least one'));});
test('deployment state and troop placements survive save and resume',()=>{let h=setup();place(h,'rifle');let saved=JSON.stringify(h.saved()),h2=harness(A,source,{'frontline-atlas-v3':saved});h2.click('resume');assert.equal(h2.view().state.phase,'deployment');assert.equal(h2.view().state.credits,8);assert.equal(A.alive(h2.view().state,0).length,1);});
test('pre-v7 battle is archived while unlocks and credits are preserved',()=>{let profile=A.freshProfile();profile.credits=profile.earned=34;let h=harness(A,source,{'frontline-atlas-v3':JSON.stringify({profile,battle:{version:2,mission:{id:0}}})});assert(!h.node('screen-content').innerHTML.includes('Resume operation'));h.click('mission',0);h.click('deploy');assert.equal(h.saved().profile.credits,34);assert.equal(h.saved().profile.retiredBattle.version,2);});
test('armory six variants and independent custom objectives remain available',()=>{let h=harness(A,source);h.click('armory');assert(h.node('screen-content').innerHTML.includes('52 focused platforms'));h.click('tree','light');assert(h.node('screen-content').innerHTML.includes('Citadel landship'));h.click('skirmish');assert(h.node('screen-content').innerHTML.includes('Protect the relief convoy'));});
test('ammo, mobility and grounded states are prominent in troop panel',()=>{let h=setup();place(h,'light');h.node('end-turn').onclick();let u=h.view().state.units.find(u=>u.team===0);u.ammo=[0];u.disabled=true;h.view().onClick(u);assert(h.node('unit-panel').innerHTML.includes('OUT OF AMMO'));assert(h.node('unit-panel').innerHTML.includes('IMMOBILIZED'));let air=A.add(h.view().state,'fighter',0,5,5);air.landed=true;h.view().onClick(air);assert(h.node('unit-panel').innerHTML.includes('LANDED'));assert(h.node('unit-panel').innerHTML.includes('Take off'));});
test('deployment return-to-reserve button refunds and reopens HQ',()=>{let h=setup();place(h,'light');let s=h.view().state,u=A.alive(s,0)[0];h.view().onClick(u);assert(h.node('unit-panel').innerHTML.includes('Return to reserve'));h.click('withdraw');assert.equal(s.credits,10);assert.equal(A.alive(s,0).length,0);assert(h.node('unit-panel').innerHTML.includes('Deployment & resupply'));});
test('one-click enemy shot fires immediately and shift-click retains optional forecast',()=>{let h=setup();place(h,'light');h.node('end-turn').onclick();let s=h.view().state,a=A.alive(s,0)[0];s.tiles.forEach(t=>t.terrain='plain');const b=A.add(s,'rifle',1,a.x+2,a.y),ammo=a.ammo[0],hp=b.hp;h.view().onClick(a);h.view().onClick(b,{shiftKey:true});assert(h.node('unit-panel').innerHTML.includes('Return fire:'));assert.equal(b.hp,hp);assert.equal(a.ammo[0],ammo);h.click('cancel-fire');h.view().onClick(b);assert(b.hp<hp);assert.equal(a.ammo[0],ammo-1);h.view().onClick(b);assert.equal(a.ammo[0],ammo-1);});
test('force roster focuses an owned troop and exposes its actions',()=>{let h=setup();place(h,'light');h.node('end-turn').onclick();const u=A.alive(h.view().state,0)[0];h.click('focus-unit',u.id);assert(h.node('battle-force').innerHTML.includes('Kestrel light tank'));assert(h.node('unit-panel').innerHTML.includes('Main gun'));assert(Number.isFinite(h.view().pan.x));});

test('side-panel uses compact combat actions and displays expandable command capacity',()=>{const h=setup();place(h,'rifle');h.node('end-turn').onclick();const u=A.alive(h.view().state,0)[0];h.view().onClick(u);const html=h.node('unit-panel').innerHTML;assert(html.includes('status-chips'));assert(!html.includes('>Move<'));assert(h.node('battle-stats').textContent.includes('/10 troops'));});

test('operator setting opens every mission and unit without modifying real unlocks or victories',()=>{
 const h=harness(A,source),before=h.saved();h.click('settings');
 assert(h.node('screen-content').innerHTML.includes('Operator mode'));
 h.change('operator',true);
 assert.equal(h.saved().profile.settings.operator,true);
 h.click('campaign');assert(!h.node('screen-content').innerHTML.includes('Locked'));
 h.click('mission',79);assert(h.node('screen-content').innerHTML.includes('Battlegroup'));
 h.click('deck-toggle','siege');
 assert(h.saved().profile.deck.includes('siege'),'heavy specialist should be virtually unlocked');
 h.click('deploy');
 const s=h.view().state;assert(s.operator);assert.equal(s.credits,999);assert.equal(s.upgrades.siege,3);
 assert.equal(A.capacity(s),30);
 const beforeSupply=s.credits;h.click('spawn','siege');h.view().onClick(s.pads[0]);
 assert.equal(s.credits,beforeSupply);
 s.result='victory';h.click('resume');
 const saved=h.saved();
 assert.equal(saved.profile.credits,before?.profile?.credits??8);
 assert.equal(saved.profile.unlocked.length,A.starters.length);
 assert.equal(Object.keys(saved.profile.completed).length,0);
 h.click('settings');h.change('operator',false);
 assert.equal(h.saved().profile.settings.operator,false);
});

test('old v3 naval save resumes despite having fewer weapon magazines and expands ammo safely',()=>{
 const m=A.missions.find(m=>m.biome==='coast');
 const battle=A.make(m,'normal',{},['rifle','frigate']);
 const u=A.recruit(battle,'frigate');assert(u);
 u.ammo=[2];u.used=[true];
 const profile=A.freshProfile(),payload=JSON.stringify({profile,battle});
 const h=harness(A,source,{'frontline-atlas-v3':payload});
 assert(h.node('screen-content').innerHTML.includes('Resume operation'),'old battle should not be archived');
 h.click('resume');
 const loaded=h.view().state.units.find(x=>x.id===u.id);
 assert.equal(loaded.ammo.length,A.D.frigate.weapons.length);
 assert.equal(loaded.used.length,A.D.frigate.weapons.length);
 assert.equal(loaded.ammo[0],2);
 assert(loaded.ammo[1]>0);
 assert.deepEqual(h.saved().profile.completed,{});
});
test('five-shell barrage HUD exposes armed state and friendly-fire risk without extra action screens',()=>{
 const h=setup();const s=h.view().state;
 const u=A.add(s,'battleship__4',0,6,8);
 s.tiles.forEach(t=>t.terrain='plain');s.phase='combat';s.credits=10;
 const b=A.add(s,'rifle',1,11,8),ally=A.add(s,'rifle',0,11,9);
 h.view().onClick(u);
 h.click('ability');
 assert(h.node('unit-panel').innerHTML.includes('5-SHELL VOLLEY ARMED'));
 h.view().onClick(b,{shiftKey:true});
 assert(h.node('unit-panel').innerHTML.includes('FRIENDLY FIRE'));
});

test('campaign previews describe every mission and visually distinguish specials',()=>{
 const h=harness(A,source);h.click('campaign');
 assert(h.node('screen-content').innerHTML.includes('mission-brief'));
 assert(h.node('screen-content').innerHTML.includes('special-operation'));
 assert(h.node('screen-content').innerHTML.includes('WAVE DEFENSE'));
 h.click('mission',0);
 assert(h.node('screen-content').innerHTML.includes('FRONTLINE ASSAULT'));
});
test('camera settings toggle strategy dragging versus legacy orbit without touching progression',()=>{
 const h=harness(A,source);h.click('settings');
 assert(h.node('screen-content').innerHTML.includes('Camera controls'));
 h.change('cameraLayout','classic');
 assert.equal(h.saved().profile.settings.cameraLayout,'classic');
 h.click('mission',0);h.click('deploy');
 assert.equal(h.view().controls,'classic');
 h.key({key:'d'});assert.deepEqual(h.view().panLog,[95,0]);
 h.key({key:'q'});assert(h.view().angle<-.55);
});
test('artillery alert and momentum both appear in battle HUD',()=>{
 const h=setup(),s=h.view().state;
 s.warningZones=[{x:10,y:10,batteryId:123}];s.momentumRewards=1;
 h.click('hq');h.view().onClick(s.pads[0]);
 assert(h.node('battle-stats').textContent.includes('MOMENTUM'));
});

test('40-supply escort and reverse artillery battles survive browser save reloads',()=>{
 for(const kind of ['escort','counterbattery']){
  const m=A.missions.find(m=>m.type===kind),profile=A.freshProfile(),battle=A.make(m);
  const h=harness(A,source,{'frontline-atlas-v3':JSON.stringify({profile,battle})});
  assert(h.node('screen-content').innerHTML.includes('Resume operation'),kind+' archived a valid save');
  h.click('resume');assert.equal(h.view().state.credits,40);
  assert.equal(h.view().state.mission.type,kind);
 }
});
