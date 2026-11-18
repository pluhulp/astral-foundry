const test=require('node:test'),assert=require('node:assert/strict'),A=require('./core.js');
function field(){const s=A.make(A.missions[0]);s.phase='combat';s.units=[];s.tiles.forEach(t=>{t.terrain='plain';t.facility=null;t.owner=-1;t.objective=false;t.path=false;});s.tiles[s.home.y*s.w+s.home.x].facility='hq';A.tile(s,s.home.x,s.home.y).owner=0;A.tile(s,s.enemyHome.x,s.enemyHome.y).facility='hq';A.tile(s,s.enemyHome.x,s.enemyHome.y).owner=1;return s;}
test('each of 32 naval-compatible maps has open-water staging, actual enemy fleet and navigable sea lanes',()=>{
 const maps=A.missions.filter(A.navalMap);assert.equal(maps.length,32);
 for(const m of maps){
  const s=A.make(m),sea=s.tiles.filter(t=>t.terrain==='water').length/s.tiles.length;
  assert(sea>=.25,m.name+' water ratio '+sea);
  if(['coast','islands'].includes(m.biome))assert(sea>=.34,m.name+' must have a large sea');
  const pads=s.pads.filter(p=>p.kind==='sea');assert.equal(pads.length,3);
  const fleet=A.alive(s,1).filter(u=>A.D[u.type].branch==='Navy');assert(fleet.length>=2,m.name);
  const visited=new Set([pads[0].x+','+pads[0].y]),queue=[pads[0]];
  while(queue.length){const p=queue.shift();for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){const x=p.x+dx,y=p.y+dy,k=x+','+y;if(!visited.has(k)&&A.passable(s,{type:'patrol'},x,y)){visited.add(k);queue.push({x,y});}}}
  for(const p of pads)assert(visited.has(p.x+','+p.y));
  for(const u of fleet)assert(visited.has(u.x+','+u.y),m.name+' should have a connected enemy ship');
 }
});
test('every naval family has six specialized loadouts, multiple guns, long range and proper movement',()=>{
 const families=A.families.filter(f=>f.branch==='Navy');assert.equal(families.length,8);
 for(const f of families){
  const seen=new Set();
  for(const id of f.variants){
   const d=A.D[id];assert(d.move>=4,id);assert(d.range>=4,id);
   assert(d.weapons.length>=2&&d.weapons.length<=4,id);
   assert(d.weapons.every(w=>w.range>=4&&w.capacity>0),id);
   assert(d.ability.name&&d.ability.desc&&d.ability.cooldown>=2,id);
   seen.add(d.ability.kind);
  }
  assert(seen.size>=5,f.id+' should have diverse tactical skills');
 }
 for(const id of ['patrol','frigate','destroyer','battleship','sub','carrier','gunboat']){
  assert(A.D[id].range>=6,id);assert(A.D[id].move>=5,id);
 }
 assert.equal(A.D.battleship.weapons.length,4);
});
test('five-shot bombardment lands at center and four orthogonal tiles, hurting foes and allies',()=>{
 const s=field(),b=A.add(s,'rifle',1,11,8),sh=A.add(s,'battleship__4',0,3,8);
 const targets=[[12,8,0],[10,8,1],[11,9,1],[11,7,0]].map(([x,y,team])=>A.add(s,'rifle',team,x,y));
 const prev=targets.map(u=>u.hp),mag=sh.ammo[0],first=b.hp,credits=s.credits;
 assert(A.useAbility(s,sh));assert.equal(s.credits,credits-2);
 const saved=JSON.stringify(s),forecast=A.forecast(s,sh,b);assert.equal(JSON.stringify(s),saved,'forecast must not mutate state');
 assert(forecast.splash.filter(u=>u.friendly).length===2);
 assert(A.attack(s,sh,b));assert(b.hp<first);
 for(let i=0;i<targets.length;i++)assert(targets[i].hp<prev[i],'collateral tile '+i);
 assert.equal(sh.ammo[0],mag-1,'single battery shot launches all five shells');
 assert.equal(s.events.filter(e=>e.kind==='attack').length,5);
 assert.equal(sh.bombardTurn,null);assert.equal(b.suppressedUntil,undefined,'bombard must not apply obsolete missile slow');
});
test('five-shell damage works on empty neighboring tiles without phantom units or zero-damage labels',()=>{
 const s=field(),target=A.add(s,'rifle',1,9,8),gun=A.add(s,'battleship',0,3,8);
 assert(A.useAbility(s,gun));assert(A.attack(s,gun,target));
 assert.equal(s.events.filter(e=>e.kind==='attack').length,5);
 assert.equal(s.events.filter(e=>e.kind==='attack'&&e.damage===0).length,4);
});
test('independent naval guns continue firing after sailing; battleship indirect fire is mobile',()=>{
 const s=field(),ship=A.add(s,'battleship',0,4,8),enemy=A.add(s,'light',1,8,8);
 for(let x=3;x<=7;x++)A.tile(s,x,8).terrain='water';
 assert(A.move(s,ship,5,8));assert(ship.moved);
 assert(A.canAttack(s,ship,enemy),'ship artillery should fire after repositioning');
 assert(A.attack(s,ship,enemy));const mag=ship.ammo[1];
 A.selectWeapon(ship,1);assert(A.canAttack(s,ship,enemy));assert(A.attack(s,ship,enemy));
 assert.equal(ship.ammo[1],mag-1);
});
test('rolling broadside can refresh two spent gun mounts but not create ammunition',()=>{
 const s=field(),ship=A.add(s,'destroyer__3',0,4,8),foe=A.add(s,'light',1,8,8);foe.hp=foe.maxHp=2000;
 for(let i=0;i<2;i++){A.selectWeapon(ship,i);assert(A.attack(s,ship,foe));}
 const ammo=ship.ammo.slice();assert(A.useAbility(s,ship));
 assert.equal(ship.used[0],false);assert.equal(ship.used[1],false);
 for(let i=0;i<2;i++){A.selectWeapon(ship,i);assert(A.attack(s,ship,foe));assert.equal(ship.ammo[i],ammo[i]-1);}
});
test('shoot-and-scoot allows exactly two water steps after firing and then expires',()=>{
 const s=field(),ship=A.add(s,'patrol',0,4,8),target=A.add(s,'light',1,8,8);
 for(let x=3;x<=7;x++)A.tile(s,x,8).terrain='water';
 assert(A.useAbility(s,ship));assert(A.attack(s,ship,target));
 assert.equal(A.moveBudget(s,ship),2);assert(A.reach(s,ship).has('6,8'));
 assert(A.move(s,ship,6,8));assert(!A.reach(s,ship).size);
});
test('submarine silent running hides from regular sight; sonar restores detection',()=>{
 const s=field(),sub=A.add(s,'sub',1,7,8),spot=A.add(s,'rifle',0,3,8),ping=A.add(s,'frigate__2',0,2,8);
 assert(A.visibleTo(s,sub,0),'ordinary visual detection before diving');
 s.side=1;assert(A.useAbility(s,sub));s.side=0;
 assert(!A.visibleTo(s,sub,0),'silent running should conceal beyond two tiles');
 assert(A.useAbility(s,ping));assert(A.visibleTo(s,sub,0),'sonar should reveal silent submarine');
});
test('carrier supports airborne aircraft and beachhead landing keeps infantry ready and sheltered',()=>{
 const s=field(),ship=A.add(s,'carrier',0,4,8),jet=A.add(s,'fighter',0,5,8);
 jet.hp=15;jet.ammo=[0];assert(!jet.landed);assert(A.useAbility(s,ship));
 assert(jet.hp>15);assert.equal(jet.ammo[0],A.D.fighter.weapons[0].capacity);
 const craft=A.add(s,'landing__5',0,8,8),marine=A.add(s,'marine',0,9,8);
 assert(A.load(s,craft,marine));assert(A.useAbility(s,craft));assert(!marine.carried);
 assert(!marine.moved&&!marine.fired);assert.equal(marine.smokeUntil,s.turn+1);assert(marine.entrenched);
});
