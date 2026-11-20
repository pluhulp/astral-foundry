const test=require('node:test'),assert=require('node:assert/strict'),A=require('./core.js');
function field(){
 const s=A.make(A.missions[0]);s.phase='combat';s.side=0;s.units=[];s.result=null;s.events=[];
 for(const t of s.tiles){t.terrain='plain';t.facility=null;t.owner=-1;t.objective=false;t.path=false;}
 A.tile(s,s.home.x,s.home.y).facility='hq';A.tile(s,s.home.x,s.home.y).owner=0;
 A.tile(s,s.enemyHome.x,s.enemyHome.y).facility='hq';A.tile(s,s.enemyHome.x,s.enemyHome.y).owner=1;
 return s;
}
test('health and morale are independent, and repeated suppressive fire pins a mobile target',()=>{
 const s=field(),attacker=A.add(s,'mg',0,6,8),target=A.add(s,'rifle',1,8,8);
 const original=target.hp;
 A.shake(s,attacker,target,20);assert(target.morale<=3&&target.hp===original);
 A.shake(s,attacker,target,20);
 assert(A.pinned(s,target),'suppression should pin targets without having to kill them');
 assert(!A.reach(s,target).size,'pinned units cannot reposition');
});
test('a pinned infantry squad cannot take a factory even while standing on it',()=>{
 const s=field(),unit=A.add(s,'rifle',0,9,8),factory=A.tile(s,9,8);factory.facility='factory';unit.morale=1;unit.pinnedUntil=s.turn+1;
 assert.equal(A.capture(s,unit),false);assert.equal(factory.owner,-1);
});
test('naval and air units have no morale bar and cannot be pinned',()=>{
 const s=field(),gun=A.add(s,'mg',1,5,7),navy=A.add(s,'frigate',0,7,7),air=A.add(s,'fighter',0,8,7);
 A.shake(s,gun,navy,95);A.shake(s,gun,air,95);
 assert.equal(A.resolve(navy),null);assert.equal(A.resolve(air),null);
 assert(!A.pinned(s,navy)&&!A.pinned(s,air));
});
test('cover and adjacent officers help units resist suppression',()=>{
 const s=field(),attacker=A.add(s,'mg',1,6,8),a=A.add(s,'rifle',0,8,8),b=A.add(s,'rifle',0,9,8);
 const commander=A.add(s,'command',0,9,9);assert(A.has(commander,'command'));
 A.tile(s,b.x,b.y).terrain='forest';b.entrenched=true;
 A.shake(s,attacker,a,29);A.shake(s,attacker,b,29);
 assert(b.morale>=a.morale);
});
test('ordinary attackers do not trigger automatic return fire from every defender',()=>{
 const s=field(),a=A.add(s,'rifle',0,6,8),b=A.add(s,'rifle',1,8,8),before=a.hp;
 assert(A.attack(s,a,b));assert.equal(a.hp,before);
 assert.equal(s.events.filter(e=>e.kind==='counter').length,0);
});
test('deliberate overwatch reacts to incoming movement, consumes ammo once, then expires',()=>{
 const s=field(),guard=A.add(s,'mg',1,12,8),mover=A.add(s,'scout',0,7,8);
 s.side=1;assert(A.overwatch(s,guard));s.side=0;
 const oldAmmo=guard.ammo[0],oldHp=mover.hp;
 assert(A.move(s,mover,10,8),'scout has sufficient movement to enter a watched lane');
 assert(mover.hp<oldHp,'guard must actually fire');
 assert.equal(guard.ammo[0],oldAmmo-1);assert(!guard.guard);
 assert(s.events.some(e=>e.kind==='counter'&&e.id===mover.id));
});
test('artillery requires a scouting network beyond local range and works with a nearby scout',()=>{
 const s=field(),gun=A.add(s,'arty',0,4,8),target=A.add(s,'rifle',1,9,8);
 assert(!A.hasSpotter(s,gun,target));
 assert(!A.canAttack(s,gun,target));
 A.add(s,'scout',0,7,8);
 assert(A.hasSpotter(s,gun,target));
 assert(A.canAttack(s,gun,target));
});
test('regular rifle fire is no longer an effective heavy-tank or battleship counter',()=>{
 const s=field(),rifle=A.add(s,'rifle',0,6,8),inf=A.add(s,'rifle',1,8,8),tank=A.add(s,'heavy',1,8,9),ship=A.add(s,'frigate',1,7,9);
 const soft=A.damage(s,rifle,inf);
 assert(A.damage(s,rifle,tank)<soft*.6);
 assert(A.damage(s,rifle,ship)<soft*.5);
});
test('holding a relay provokes a budgeted local response instead of four empty end-turn clicks',()=>{
 const m=A.missions.find(m=>m.type==='hold'),s=A.make(m);
 s.phase='combat';s.side=0;s.hold=1;s.enemyCredits=20;
 const relay=s.tiles.find(t=>t.facility==='relay');relay.owner=0;
 const before=A.alive(s,1).length;
 A.objectivePressure(s);
 assert(A.alive(s,1).length>before);
 assert(s.pressure?.count>0);
 assert(s.log[0].text.includes('COUNTERATTACK'));
 const once=A.alive(s,1).length;A.objectivePressure(s);assert.equal(A.alive(s,1).length,once);
});
test('morale recovers on a quiet turn and old saves without morale fields remain playable',()=>{
 const s=field(),soldier=A.add(s,'rifle',0,8,8);
 delete soldier.morale;delete soldier.pinnedUntil;
 assert.equal(A.resolve(soldier),6);assert(!A.pinned(s,soldier));
 soldier.morale=2;soldier.underFireTurn=-2;
 A.recoverMorale(s,soldier);assert.equal(soldier.morale,3);
});
