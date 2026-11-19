const test=require('node:test'),assert=require('node:assert/strict'),A=require('./core.js');
function field(){const s=A.make(A.missions[0]);s.phase='combat';s.units=[];s.tiles.forEach(t=>{t.terrain='plain';t.facility=null;t.owner=-1;t.objective=false;});const p=A.tile(s,s.home.x,s.home.y);p.facility='hq';p.owner=0;const q=A.tile(s,s.enemyHome.x,s.enemyHome.y);q.facility='hq';q.owner=1;s.side=1;return s;}
test('enemy field director prioritizes recon, logistic support, then heavier units',()=>{
 const s=field(),armor=A.add(s,'heavy',1,7,8),recon=A.add(s,'scout',1,8,8),med=A.add(s,'medic',1,9,8);
 const ids=A.enemyOrder(s).map(u=>u.id);assert(ids.indexOf(recon.id)<ids.indexOf(armor.id));assert(ids.indexOf(med.id)<ids.indexOf(armor.id));
});
test('shared intelligence never acquires invisible targets and expires stale contacts after two turns',()=>{
 const s=field(),enemy=A.add(s,'rifle',1,3,3),target=A.add(s,'rifle',0,7,3);
 A.tile(s,7,3).terrain='forest';assert(!A.visibleTo(s,target,1));
 assert.equal(Object.keys(A.commandIntel(s).contacts).length,0);
 A.tile(s,7,3).terrain='plain';s.aiOrders=null;assert(A.commandIntel(s).contacts[target.id]);
 target.x=18;target.y=15;
 s.turn+=3;s.aiOrders=null;assert(!A.commandIntel(s).contacts[target.id]);
});
test('a shared focus priority favors damaged vulnerable targets and courier assets',()=>{
 const s=field(),e=A.add(s,'light',1,5,5),a=A.add(s,'heavy',0,7,5),b=A.add(s,'rifle',0,5,7);
 b.hp=8;s.aiOrders=null;
 assert.equal(A.commandIntel(s).focus,b.id);
});
test('enemy uses a high-value lethal shot instead of randomly shooting full-health units',()=>{
 const s=field(),gun=A.add(s,'light',1,6,6),weak=A.add(s,'rifle',0,8,6),strong=A.add(s,'rifle',0,6,8);
 weak.hp=5;strong.hp=strong.maxHp;
 A.ai(s,gun);assert.equal(weak.hp,0);assert(strong.hp>0);
});
test('naval AI operates more than one gun in a combat round when targets survive',()=>{
 const s=field(),ship=A.add(s,'destroyer',1,5,5),target=A.add(s,'battleship',0,10,5);
 target.hp=target.maxHp=1500;A.ai(s,ship);
 assert(ship.ammo.filter((n,i)=>n<A.D[ship.type].weapons[i].capacity).length>=2,'ship should fire multiple separate batteries');
});
test('AI orders use visible units and do not magically damage a hidden target',()=>{
 const s=field(),gun=A.add(s,'td',1,4,4),hidden=A.add(s,'rifle',0,14,14);
 A.tile(s,14,14).terrain='forest';const hp=hidden.hp;A.ai(s,gun);assert.equal(hidden.hp,hp);
});
test('enemy naval flagships deliberately retreat toward their sea exit',()=>{
 const s=field(),u=A.add(s,'carrier',1,19,12),hunter=A.add(s,'patrol',0,5,12);
 u.escape=true;
 for(let y=9;y<=16;y++)for(let x=3;x<=22;x++)A.tile(s,x,y).terrain='water';
 const before=u.x;A.ai(s,u);assert(u.x<before);
});
test('rapid aggression earns capped tactical supply without giving enemies free rewards',()=>{
 const s=field(),gun=A.add(s,'superheavy',0,4,4),a=A.add(s,'rifle',1,6,4),b=A.add(s,'rifle',1,6,5);
 a.hp=b.hp=1;s.side=0;s.credits=6;s.killsThisTurn=0;
 assert(A.attack(s,gun,a));A.selectWeapon(gun,1);assert(A.attack(s,gun,b));
 assert.equal(s.credits,7);assert.equal(s.momentumRewards,1);
});
