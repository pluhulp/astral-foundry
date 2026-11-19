const test=require('node:test'),assert=require('node:assert/strict'),A=require('./core.js');
function battlefield(water=false){
 const s=A.make(A.missions[0]);s.phase='combat';s.side=1;s.units=[];
 s.tiles.forEach(t=>{t.terrain=water?'water':'plain';t.facility=null;t.owner=-1;t.objective=false;t.path=false;});
 const a=A.tile(s,s.home.x,s.home.y),b=A.tile(s,s.enemyHome.x,s.enemyHome.y);
 a.terrain=b.terrain='plain';a.facility=b.facility='hq';a.owner=0;b.owner=1;
 return s;
}
test('naval weapons lose a little shore bombardment efficiency but keep original ship-to-ship damage',()=>{
 const s=battlefield(),ship=A.add(s,'frigate',0,5,6),inf=A.add(s,'rifle',1,8,6),boat=A.add(s,'patrol',1,9,6);
 const land=A.damage(s,ship,inf),sea=A.damage(s,ship,boat),w=A.D.frigate.weapons[0];
 assert.equal(sea,Math.max(5,Math.round(w.power-A.D.patrol.armor*.65)),'original player navy-versus-navy power must remain unchanged');
 assert(land<sea,'naval cannon should have a modest shore-fire penalty');
 assert(land>sea*.72,'shore-fire penalty should stay modest, not cripple naval combat');
 assert.equal(ship.hp,ship.maxHp);
});
test('coordinated enemy fleet volleys are stronger specifically against player vessels, not land',()=>{
 const s=battlefield(),ship=A.add(s,'frigate',1,5,6),player=A.add(s,'battleship',0,9,6);
 const solitary=A.damage(s,ship,player);
 const wing=A.add(s,'patrol',1,6,6);
 const supported=A.damage(s,ship,player);
 assert(supported>solitary,'a spotting fleet wingman enables focused fire');
 assert(supported<=solitary*1.18,'tactical support remains a small precision improvement');
 wing.hp=0;assert.equal(A.damage(s,ship,player),solitary,'sinking the wingman cancels the coordinated fire bonus');
});
test('flagship has meaningful command compartments and its escort screen is removable',()=>{
 const m=A.missions.find(m=>m.type==='intercept'&&m.biome==='coast'),s=A.make(m),flag=s.units.find(u=>u.flagship);
 assert(flag&&flag.hp>=400,'flagship should not melt to one four-gun capital broadside');
 assert(A.fleetEscort(s,flag),'its escorts should start nearby');
 const navy=A.add(s,'battleship',0,flag.x-6,flag.y);
 const screened=A.damage(s,navy,flag);
 for(const u of A.alive(s,1))if(u.id!==flag.id&&A.D[u.type].branch==='Navy')u.hp=0;
 assert(!A.fleetEscort(s,flag),'escort screen ends when real escorts are destroyed');
 assert(A.damage(s,navy,flag)>screened*1.15,'unescorted flagship becomes significantly more vulnerable');
});
test('one Leviathan four-gun broadside cannot instantly defeat a screened interception flagship',()=>{
 const m=A.missions.find(m=>m.type==='intercept'&&m.biome==='coast'),s=A.make(m),flag=s.units.find(u=>u.flagship);
 s.phase='combat';s.side=0;
 const ship=A.add(s,'battleship__4',0,flag.x-6,flag.y),before=ship.ammo.slice();
 for(let i=0;i<A.D[ship.type].weapons.length;i++){
  A.selectWeapon(ship,i);assert(A.canAttack(s,ship,flag),'all four guns need a legal attack target');
  assert(A.attack(s,ship,flag));
 }
 assert(flag.hp>0,'a single capital ship must not solo-delete this boss in one turn');
 assert.equal(s.result,null,'the operation should not be instantly completed');
 assert.equal(ship.ammo.reduce((n,v,i)=>n+before[i]-v,0),4);
});
test('each naval theater has an actual opposing fleet and accessible sea approach',()=>{
 const maps=A.missions.filter(A.navalMap);assert.equal(maps.length,33);
 for(const m of maps){
  const s=A.make(m),ships=A.alive(s,1).filter(u=>A.D[u.type].branch==='Navy');
  assert(ships.length>=3,m.name+' needs at least three opponents');
  if(['coast','islands'].includes(m.biome))assert(ships.length>=4,m.name+' should start with a task group');
  assert.equal(s.pads.filter(p=>p.kind==='sea').length,3);
 }
 const desert=A.make(A.missions[17]);assert(desert.tiles.filter(t=>t.terrain==='water').length>120,'desert interception should be a usable coastal naval mission');
 assert(A.alive(desert,1).filter(u=>A.D[u.type].branch==='Navy').length>=5);
});
test('enemy destroyer closes into all three gun ranges before opening fire',()=>{
 const s=battlefield(true),ship=A.add(s,'destroyer',1,5,7),
  player=A.add(s,'battleship',0,15,7),spotter=A.add(s,'patrol',1,6,7);
 player.hp=player.maxHp=5000;
 const old=ship.ammo.slice();A.ai(s,ship);
 assert(ship.x>5,'ship should move, not stall at the first long-range firing opportunity');
 assert.equal(old.reduce((n,v,i)=>n+v-ship.ammo[i],0),3,'all three ready guns should fire after moving');
 assert.equal(s.events.filter(e=>e.kind==='attack'&&e.sourceType===ship.type).length,3);
});
test('damaged immobilized enemy warships still use all operational guns',()=>{
 const s=battlefield(),ship=A.add(s,'destroyer',1,5,7),player=A.add(s,'battleship',0,9,7);
 player.hp=player.maxHp=5000;ship.disabled=true;const ammo=ship.ammo.slice();
 A.ai(s,ship);
 assert.equal(ship.x,5,'damaged propulsion must prevent movement');
 assert.equal(ammo.reduce((n,v,i)=>n+v-ship.ammo[i],0),3,'propulsion failure should not disable working guns');
});
test('multiweapon land AI uses each available mount and the salvo ability for a bonus shot',()=>{
 const s=battlefield(),gun=A.add(s,'superheavy',1,6,6),player=A.add(s,'battleship',0,9,6);
 player.hp=player.maxHp=5000;const before=gun.ammo.slice();A.ai(s,gun);
 assert.equal(before.reduce((n,v,i)=>n+v-gun.ammo[i],0),4);
 assert(gun.abilityReady>s.turn,'AI should commit its legal reload/salvo action');
});
test('enemy commander activates every ship with a legal target during its turn',()=>{
 const s=battlefield(),player=A.add(s,'battleship',0,12,8),navy=[
   A.add(s,'destroyer',1,7,7),A.add(s,'frigate',1,7,9),A.add(s,'gunboat',1,9,7),A.add(s,'patrol',1,10,9)
 ];
 player.hp=player.maxHp=9000;
 for(const ship of A.enemyOrder(s))A.ai(s,ship);
 for(const ship of navy){
  assert(ship.ammo.some((n,i)=>n<A.D[ship.type].weapons[i].capacity),ship.type+' must act and fire');
 }
 const volleys=s.events.filter(e=>e.kind==='attack'&&e.sourceType&&A.D[e.sourceType].branch==='Navy');
 assert(volleys.length>=7,'enemy task groups should fire multiple combined batteries, not just two boats');
});
