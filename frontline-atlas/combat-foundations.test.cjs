const test=require('node:test'),assert=require('node:assert/strict'),A=require('./core.js');

function field(type='capture'){
 const m=A.missions.find(m=>m.type===type),s=A.make(m);
 s.phase='combat';s.units=[];s.side=0;s.result=null;s.credits=12;
 s.tiles.forEach(t=>{if(t.terrain!=='void')t.terrain='plain';});
 return s;
}
test('incoming fire accumulates independent pressure; pinned troops cannot maneuver or capture',()=>{
 const s=field(),g=A.add(s,'mg',1,9,8),u=A.add(s,'rifle',0,7,8);
 u.pressure=42;assert.equal(u.hp,u.maxHp);
 const first=A.pressureHit(s,g,u,25);
 assert(first&&A.pinned(s,u));
 assert.equal(u.hp,u.maxHp,'suppression should not inflict free HP damage');
 assert.equal(A.moveBudget(s,u),0);
 assert.equal(A.reach(s,u).size,0);
 const t=A.tile(s,u.x,u.y);t.facility='town';t.owner=1;
 assert(!A.capture(s,u));
 s.turn+=1;assert(!A.pinned(s,u),'one tactical response window later the unit recovers');
});
test('naval and aerial crews remain immune to infantry-style pinning',()=>{
 const s=field(),attacker=A.add(s,'mg',1,5,7);
 for(const id of ['patrol','fighter']){
  const u=A.add(s,id,0,7,7);
  A.pressureHit(s,attacker,u,100);
  assert.equal(u.pressure,0);assert.equal(A.pinned(s,u),false);
 }
});
test('two defensive machine gunners can stop a pressured movement route at the first dangerous tile',()=>{
 const s=field(),a=A.add(s,'mg',0,7,7),b=A.add(s,'mg',0,8,8),enemy=A.add(s,'scout',1,12,7);
 assert(A.setOverwatch(s,a));assert(A.setOverwatch(s,b));
 s.side=1;enemy.pressure=42;const before=enemy.hp;
 assert(A.move(s,enemy,9,7));
 assert(enemy.x>=9&&enemy.x<12);
 assert(enemy.hp<before);
 assert(A.pinned(s,enemy),'overwatch should suppress and stop the advancing scout');
 const path=s.events.find(e=>e.kind==='move');
 assert.equal(path.to.x,enemy.x,'movement animation ends at the real interrupted tile');
 assert.equal(path.path.at(-1).x,enemy.x);
 assert(s.events.some(e=>e.kind==='counter'&&e.overwatch));
});
test('one prepared guard fires only one reaction shot and spends a real magazine round',()=>{
 const s=field(),gun=A.add(s,'mg',0,7,7),mover=A.add(s,'rifle',1,12,7);
 assert(A.setOverwatch(s,gun));s.side=1;
 const ammo=gun.ammo[0],health=mover.hp;
 assert(A.move(s,mover,10,7));
 assert.equal(gun.ammo[0],ammo-1);assert(!gun.guard);
 assert(mover.hp<health);assert.equal(s.events.filter(e=>e.overwatch).length,1);
});
test('concealment prevents a distant ambush on an unseen scout',()=>{
 const s=field(),gun=A.add(s,'mg',0,7,7),mover=A.add(s,'scout',1,12,7);
 A.tile(s,10,7).terrain='forest';
 assert(A.setOverwatch(s,gun));s.side=1;
 const hp=mover.hp;
 assert(A.move(s,mover,10,7));
 assert.equal(mover.hp,hp,'ordinary gunner cannot magically see distant forest concealment');
});
test('ordinary hits never grant a universal free countershot; overwatch is deliberate',()=>{
 const s=field(),a=A.add(s,'light',0,5,6),b=A.add(s,'heavy',1,7,6);
 const hp=a.hp,mag=b.ammo[0],estimate=A.forecast(s,a,b);
 assert(estimate&&estimate.counter===0);
 assert(A.attack(s,a,b));assert.equal(a.hp,hp);
 assert.equal(b.ammo[0],mag);
 assert.equal(s.events.filter(e=>e.kind==='counter').length,0);
});
test('artillery beyond organic line of sight needs an allied live observer',()=>{
 const s=field(),gun=A.add(s,'arty',0,4,7),target=A.add(s,'rifle',1,9,7);
 assert(!A.spottingLink(s,gun,target));
 assert(!A.canAttack(s,gun,target));
 const spot=A.add(s,'scout',0,7,8);
 assert(A.spottingLink(s,gun,target));
 assert(A.canAttack(s,gun,target));
 spot.hp=0;
 assert(!A.spottingLink(s,gun,target));
});
test('captured forward factories deploy affordable land reinforcements; threatened positions are locked',()=>{
 const s=field(),h=s.tiles.find(t=>t.facility==='factory'&&t.owner!==0);
 assert(h);h.owner=0;
 const old=s.credits,u=A.recruit(s,'rifle',h);
 assert(u);assert.equal(A.dist(h,u),1);assert.equal(u.readyTurn,s.turn+1);
 assert.equal(s.credits,old-A.D.rifle.cost);
 assert(!A.recruit(s,'patrol',h));
 const b=A.add(s,'rifle',1,h.x,h.y+2);
 assert(A.recruitError(s,'rifle',h).includes('under threat'));
 b.hp=0;assert(!A.recruitError(s,'rifle',h));
});
test('forward deployment cannot bypass paid HQ starting placement',()=>{
 const s=A.make(A.missions[0]),town=s.tiles.find(t=>t.facility==='town');town.owner=0;
 assert(!A.recruit(s,'rifle',town),'deploy phase must use real HQ land pads');
 const u=A.recruit(s,'rifle');
 assert(u&&s.pads.some(p=>p.x===u.x&&p.y===u.y));
});
test('relay objective needs a live unpinned garrison and an uncontested perimeter',()=>{
 const s=field('hold'),relay=s.tiles.find(t=>t.facility==='relay');assert(relay);
 relay.owner=0;const guard=A.add(s,'rifle',0,relay.x,relay.y);
 assert(A.secureRelay(s));
 const enemy=A.add(s,'rifle',1,relay.x,relay.y+2);
 assert(!A.secureRelay(s));enemy.hp=0;
 guard.pinnedUntil=s.turn;assert(!A.secureRelay(s));
 guard.pinnedUntil=-1;assert(A.secureRelay(s));
});
test('relay counterattack announces an incoming wave and spends its actual budget',()=>{
 const s=field('hold'),relay=s.tiles.find(t=>t.facility==='relay');relay.owner=0;
 A.add(s,'rifle',0,relay.x,relay.y);s.hold=1;s.enemyCredits=12;
 assert.equal(A.relayCounterattack(s),0);
 assert.equal(s.holdThreatTurn,s.turn+1);
 assert(s.log.some(e=>e.text.includes('RADIO INTERCEPT')));
 s.turn++;
 const old=s.enemyCredits,number=A.alive(s,1).length,count=A.relayCounterattack(s);
 assert(count>=1&&count<=3);
 assert.equal(A.alive(s,1).length-number,count);
 assert(s.enemyCredits<old);assert.equal(s.holdThreatTurn,-1);
 assert(A.alive(s,1).every(u=>A.dist(u,relay)>=4));
});
test('first two enemy takedowns each provide one capped battle supply',()=>{
 const s=field(),gun=A.add(s,'superheavy',0,4,7),
 foes=[7,8,6].map(y=>A.add(s,'rifle',1,6,y));
 foes.forEach(v=>v.hp=1);
 const initial=s.credits;for(let i=0;i<3;i++){
  A.selectWeapon(gun,i);assert(A.attack(s,gun,foes[i]));
 }
 assert.equal(s.credits,initial+2);
 assert.equal(s.momentumRewards,2);
});

test('multiweapon indirect vehicles can fire every mount if they did not physically relocate',()=>{
 const s=field(),u=A.add(s,'battleship',0,5,8),target=A.add(s,'heavy',1,10,8);
 target.hp=target.maxHp=4000;
 for(let i=0;i<A.D[u.type].weapons.length;i++){
  A.selectWeapon(u,i);
  assert(A.canAttack(s,u,target),'a fired but unmoved platform must still use later mounts');
  assert(A.attack(s,u,target));
 }
 assert.equal(u.used.filter(Boolean).length,4);
});
test('artillery can only shoot after actual movement if setup has been completed',()=>{
 const s=field(),gun=A.add(s,'arty',0,5,8),target=A.add(s,'rifle',1,9,8),
  spotter=A.add(s,'scout',0,8,9);
 assert(A.canAttack(s,gun,target));
 assert(A.move(s,gun,6,8));assert.equal(gun.repositionedTurn,s.turn);
 assert(!A.canAttack(s,gun,target),'after relocating, gun needs emplacing');
 assert(A.useAbility(s,gun));
 assert(A.canAttack(s,gun,target));
});
test('range overlay includes other ready mounts even if the manually selected weapon has fired',()=>{
 const s=field(),gun=A.add(s,'battleship',0,5,8),target=A.add(s,'heavy',1,10,8);
 target.hp=target.maxHp=4000;assert(A.attack(s,gun,target));
 assert.equal(gun.used[0],true);
 assert(A.rangeTiles(s,gun).some(p=>p.x===target.x&&p.y===target.y));
 assert(A.canAttackAny(s,gun,target));assert(A.prepareTargetWeapon(s,gun,target));
 assert.notEqual(gun.weapon,0);
});

test('pinned infantry loses firing opportunity, and medical aid restores cohesion',()=>{
 const s=field(),gun=A.add(s,'rifle',0,5,7),target=A.add(s,'rifle',1,7,7);
 gun.pressure=85;gun.pinnedUntil=s.turn;
 assert(A.pinned(s,gun));assert(!A.canAttack(s,gun,target));
 const medic=A.add(s,'medic',0,5,8);
 medic.hp=medic.maxHp;
 assert(A.useAbility(s,medic));
 assert(!A.pinned(s,gun),'triage should clear disabling pressure');
 assert(gun.pressure<=35);
 assert(A.canAttack(s,gun,target),'recovered squad can act if it has not used an action');
});
test('isolated damaged infantry can surrender at extreme pressure, but nearby allies prevent routing',()=>{
 const s=field(),suppressor=A.add(s,'mg',1,5,7),solo=A.add(s,'rifle',0,7,7);
 solo.hp=Math.floor(solo.maxHp*.37);solo.pressure=91;
 const n=s.kills;A.pressureHit(s,suppressor,solo,17);
 assert.equal(solo.hp,0);assert(solo.surrendered);
 assert.equal(s.kills,n); // friendly unit surrendered; no fictional enemy kill
 const covered=A.add(s,'rifle',0,11,7);covered.hp=Math.floor(covered.maxHp*.36);covered.pressure=91;
 const ally=A.add(s,'rifle',0,11,8);
 A.pressureHit(s,suppressor,covered,17);
 assert(covered.hp>0,'nearby teammates keep a panicked squad from surrendering');
 assert(A.pinned(s,covered));
});

test('scout infantry may move in two commands without exceeding one shared budget',()=>{
 const s=field(),unit=A.add(s,'scout',0,5,7);
 s.tiles.forEach(t=>{if(t.terrain!=='void'&&!t.facility)t.terrain='plain';});
 const budget=A.moveBudget(s,unit);
 assert.equal(budget,A.D.scout.move);
 assert(A.move(s,unit,7,7));assert.equal(unit.moveSpent,2);
 assert(A.canSplitMove(s,unit));
 assert(A.move(s,unit,8,7));assert.equal(unit.moveSpent,3);
 assert(!A.reach(s,unit).has('10,7'),'scouts cannot conjure extra movement beyond the original budget');
 assert(A.move(s,unit,9,7));assert.equal(unit.moveSpent,4);
 assert.equal(A.reach(s,unit).size,0);
});
test('firing ends a scout unit movement allowance and ordinary tanks still move only once',()=>{
 const s=field(),scout=A.add(s,'scout',0,5,7),target=A.add(s,'rifle',1,7,8);
 s.tiles.forEach(t=>{if(t.terrain!=='void'&&!t.facility)t.terrain='plain';});
 assert(A.move(s,scout,6,7));assert(A.canSplitMove(s,scout));
 assert(A.attack(s,scout,target));
 assert(!A.canSplitMove(s,scout));assert.equal(A.reach(s,scout).size,0);
 const tank=A.add(s,'light',0,4,9);assert(A.move(s,tank,5,9));
 assert.equal(A.reach(s,tank).size,0);
});
