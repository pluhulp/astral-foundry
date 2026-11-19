const test=require('node:test'),assert=require('node:assert/strict'),A=require('./core.js');
function start(m){const s=A.make(m);if(!A.alive(s,0).some(u=>!u.courier))assert(A.recruit(s,'rifle'));assert(A.launch(s));return s;}
test('80 missions have readable subtitles and 28 bespoke assignments',()=>{
 assert.equal(A.missions.length,80);assert.equal(Object.keys(A.specialOperations).length,28);
 assert(A.missions.every(m=>m.subtitle&&m.subtitle.length>=20));
 for(const [id,t] of Object.entries(A.specialOperations))assert.equal(A.missions[+id].type,t);
});
test('special operations seed correct capturable assets and artillery formations',()=>{
 for(const m of A.missions){const s=A.make(m);
  if(['battery','counterbattery'].includes(m.type))assert.equal(s.batteryIDs.length,4,m.name);
  if(m.type==='breach')assert.equal(s.strongpointIDs.length,3,m.name);
  if(m.type==='intercept')assert(s.units.some(u=>u.id===s.flagshipId&&u.flagship),m.name);
  if(m.type==='escort'){const land=s.pads.filter(p=>p.kind==='land');assert.equal(land.length,6);assert(land.every(p=>p.y===land[0].y));assert.equal(s.credits,40);}
 }
});
test('four enemy emplacements create cross-shaped telegraphed bombardments and destruction cancels fire',()=>{
 const m=A.missions.find(m=>m.type==='battery'),s=start(m);
 assert.equal(s.warningZones.length,4);
 const gun=s.units.find(v=>v.battery);s.events=[];A.beginEnemy(s);
 assert.equal(s.warningZones.length,0);assert.equal(s.events.filter(e=>e.kind==='attack').length,20);
 s.side=0;s.turn++;s.warningZones=[{batteryId:gun.id,x:4,y:4}];gun.hp=0;s.events=[];A.beginEnemy(s);
 assert.equal(s.events.length,0);
});
test('warning zones deal real damage, have friendly fire, and can be dodged',()=>{
 const m=A.missions.find(m=>m.type==='battery'),s=start(m),gun=s.units.find(v=>v.battery);
 const victim=A.add(s,'rifle',0,10,10),safe=A.add(s,'rifle',0,15,15),friend=A.add(s,'rifle',1,11,10);
 const before=[victim.hp,safe.hp,friend.hp];s.warningZones=[{batteryId:gun.id,x:10,y:10}];s.events=[];
 A.beginEnemy(s);assert(victim.hp<before[0]);assert.equal(safe.hp,before[1]);assert(friend.hp<before[2]);
});
test('reverse siege has four stationary guns that fire five shots and five assault waves',()=>{
 const m=A.missions.find(m=>m.type==='counterbattery'),s=start(m),guns=A.alive(s,0).filter(u=>u.battery);
 assert.equal(s.credits,40);assert.equal(guns.length,4);
 const gun=guns[0],foe=A.add(s,'rifle',1,gun.x+3,gun.y),ammo=gun.ammo[0];
 assert.equal(A.reach(s,gun).size,0);assert(A.canAttack(s,gun,foe));assert(A.attack(s,gun,foe));assert.equal(gun.ammo[0],ammo-1);
 for(let i=0;i<10;i++){s.result=null;A.beginPlayer(s);}
 assert.equal(s.batteryWave,5);assert.equal(gun.ammo[0],ammo);
});
test('reverse siege loses after three of four batteries die',()=>{
 const s=start(A.missions.find(m=>m.type==='counterbattery'));
 for(const id of s.batteryIDs.slice(0,3))s.units.find(u=>u.id===id).hp=0;
 assert.equal(A.check(s),'defeat');
});
test('convoy can progress automatically along six-pad corridor but cannot receive reinforcements',()=>{
 const s=A.make(A.missions.find(m=>m.type==='escort'));assert.equal(s.pads.filter(p=>p.kind==='land').length,6);
 assert(A.recruit(s,'rifle'));assert(A.launch(s));
 assert(A.recruitError(s,'rifle',A.tile(s,s.home.x,s.home.y)).includes('no new reinforcements'));
 for(const u of A.alive(s,1))u.hp=0;
 const courier=s.units.find(u=>u.courier),old=courier.x;
 A.beginPlayer(s);assert(courier.x>old);assert.equal(s.escortProgress,2);
 A.tile(s,s.enemyHome.x,s.enemyHome.y).owner=0;assert.equal(A.check(s),null);
});
test('strongpoint breakthrough wins on destruction of three entrenched defenses',()=>{
 const s=start(A.missions.find(m=>m.type==='breach'));assert.equal(A.check(s),null);
 for(const id of s.strongpointIDs)s.units.find(u=>u.id===id).hp=0;
 assert.equal(A.check(s),'victory');
});
test('interception wins by sinking the flagship and loses if it escapes west',()=>{
 const m=A.missions.find(m=>m.type==='intercept'),s=start(m),flag=s.units.find(u=>u.id===s.flagshipId);
 assert(flag.escape);assert.equal(A.check(s),null);flag.x=3;assert.equal(A.check(s),'defeat');
 const t=start(m);t.units.find(u=>u.id===t.flagshipId).hp=0;assert.equal(A.check(t),'victory');
});

test('artillery tracks only visible contacts; without spotting it shells fixed public approach corridors',()=>{
 const m=A.missions.find(m=>m.type==='battery'),s=start(m);
 assert(s.warningZones.length===4);assert(s.warningZones.every(z=>z.spotted===false));
 const enemy=A.alive(s,1).find(u=>!u.battery),ally=A.alive(s,0).find(u=>!u.courier);
 const x=enemy.x-1,y=enemy.y;
 A.tile(s,x,y).terrain='road';ally.x=x;ally.y=y;
 assert(A.visibleTo(s,ally,1),'enemy scout/contact must see the relocated troop');
 A.beginPlayer(s);
 assert(s.warningZones.some(z=>z.spotted===true));
});
