/* Frontline Atlas — deterministic, renderer-independent tactical simulation. */
(function(root){'use strict';
const D={};
function unit(id,name,branch,cost,hp,move,range,power,armor,traits,desc){D[id]={id,name,branch,cost,hp,move,range,power,armor,traits:traits.split(' ').filter(Boolean),desc};}
unit('rifle','Rifle squad','Infantry',100,100,3,2,30,2,'capture','Reliable line infantry. Capture facilities and fight from cover.');
unit('scout','Pathfinders','Infantry',120,75,5,2,23,0,'capture recon','Fast reconnaissance with extended vision.');
unit('mg','Machine gunners','Infantry',150,100,2,3,40,3,'capture antiInf','Suppress exposed infantry with heavy automatic fire.');
unit('rocket','AT team','Infantry',170,85,2,3,45,1,'capture antiArmor','Shoulder-fired rockets excel against armored targets.');
unit('sniper','Marksmen','Infantry',180,65,3,5,40,0,'capture antiInf indirect','Long-range specialists. Cannot fire after moving.');
unit('medic','Field medics','Infantry',130,80,3,1,15,0,'capture heal','Restore 35 health to adjacent infantry.');
unit('engineer','Combat engineers','Infantry',140,90,3,2,22,2,'capture repair','Repair adjacent vehicles for 35 health.');
unit('marine','Marine squad','Infantry',180,110,3,2,36,4,'capture amphibious','Cross water and seize coastal positions.');
unit('commando','Commandos','Infantry',230,100,4,3,42,3,'capture recon','Elite reconnaissance and objective-capture infantry.');
unit('mortar','Mortar team','Infantry',210,75,2,5,38,0,'capture indirect splash','Indirect explosive fire damages neighboring units.');
unit('jeep','Recon buggy','Armor',170,85,6,2,27,5,'recon','Rapid wheeled reconnaissance and flanking.');
unit('apc','Sentinel APC','Armor',220,140,5,2,35,10,'transport','Carries one adjacent infantry squad; deploy it across the front.');
unit('light','Kestrel light tank','Armor',250,140,5,3,42,12,'antiArmor','A mobile tank for rapid exploitation.');
unit('tank','Atlas battle tank','Armor',330,185,4,3,55,20,'antiArmor','Heavy frontal protection and a high-velocity cannon.');
unit('heavy','Bastion heavy tank','Armor',460,250,3,3,66,26,'antiArmor','Slow breakthrough armor. Bring engineers.');
unit('td','Lancer tank destroyer','Armor',350,135,4,5,66,12,'antiArmor','Long-range armor hunter with a fragile hull.');
unit('arty','Field howitzer','Armor',290,100,2,6,52,5,'indirect splash','Long-range area fire. Cannot fire after moving.');
unit('mlrs','Tempest rocket truck','Armor',420,110,3,7,55,5,'indirect splash','Wide-reaching salvo artillery with minimum range two.');
unit('aa','Skyguard AA','Armor',240,125,4,4,42,9,'antiAir','Radar-guided fire deals increased damage to aircraft.');
unit('amph','Amphibious carrier','Armor',270,150,4,3,36,10,'amphibious transport','Carries infantry across rivers and island channels.');
unit('heli','Viper gunship','Air',350,120,6,3,48,5,'antiArmor','Low-altitude attack platform. Vulnerable to AA.');
unit('fighter','Swift interceptor','Air',380,130,8,4,52,8,'antiAir','Air-superiority fighter; ground damage is reduced.');
unit('bomber','Condor bomber','Air',480,155,6,3,72,8,'splash','Heavy strike aircraft with splash damage.');
unit('drone','Survey drone','Air',190,65,7,2,22,0,'recon','Cheap aerial reconnaissance with light armament.');
unit('transport','Pelican airlift','Air',320,140,7,1,15,4,'transport','Airborne transport for a single infantry squad.');
unit('patrol','Mako patrol boat','Navy',210,120,6,3,35,8,'','Fast littoral combat vessel.');
unit('frigate','Escort frigate','Navy',350,190,5,5,48,16,'antiAir','Fleet escort with anti-aircraft batteries.');
unit('destroyer','Pike destroyer','Navy',440,230,4,5,60,20,'antiArmor','Balanced surface combatant and shore bombardment.');
unit('battleship','Leviathan battleship','Navy',650,330,3,7,80,28,'indirect splash','Devastating naval artillery; cannot fire after moving.');
unit('landing','Landing craft','Navy',200,130,5,2,20,6,'transport','Ferries infantry; unload onto an adjacent shore tile.');
unit('sub','Needle submarine','Navy',390,140,4,4,72,10,'antiShip','Torpedoes target naval vessels only.');
unit('carrier','Horizon carrier','Navy',620,280,3,4,40,22,'antiAir supply','Repairs nearby friendly aircraft each turn.');

unit('supply','Mule supply truck','Armor',2,95,5,1,10,3,'repair resupply','Repair and replenish adjacent allies for 1 supply.');
unit('cruiser','Comet cruiser tank','Armor',5,120,7,3,44,8,'antiArmor recon','Fast flanker. Trades armor for speed.');
unit('superheavy','Citadel landship','Armor',10,310,1,4,70,32,'antiArmor','Three independent cannons. Extremely slow.');
unit('siege','Goliath siege tank','Armor',8,230,2,6,75,24,'indirect splash','Armored siege gun. Deploy before firing.');
unit('autocannon','Jackal armored car','Armor',4,115,6,3,42,8,'recon antiInf','Rapid infantry hunter.');
unit('ifv','Warden IFV','Armor',5,170,4,3,45,15,'transport antiInf','Armored infantry carrier with autocannon.');
unit('missile','Scorpion missile carrier','Armor',6,110,4,6,64,7,'antiArmor indirect','Fragile long-range missile platform.');
unit('spg','Nomad self-propelled gun','Armor',6,155,3,6,60,12,'indirect splash','Mobile protected artillery.');
unit('flak','Tempest flak tank','Armor',6,180,3,5,50,18,'antiAir','Tracked air defense with twin batteries.');
unit('logistics','Bison logistics truck','Armor',3,145,4,1,12,8,'repair resupply','Heavy support: restores 55 HP and all ammunition.');
unit('assault','Breach assault squad','Infantry',4,125,3,2,48,8,'capture antiInf','Armored close assault infantry.');
unit('attackjet','Spear strike jet','Air',7,145,7,4,65,8,'antiArmor','Precision ground attack aircraft.');
unit("bike","Wasp scout bike","Armor",2,65,8,2,24,1,"recon","Two wheels, eight movement: fast reconnaissance.");
unit("sidecar","Badger sidecar team","Armor",3,85,7,3,36,3,"recon antiInf","Sidecar machine gun and a separate rifle.");
unit("rocketbike","Hornet missile bike","Armor",4,75,7,4,53,2,"recon antiArmor","Fast ambush platform with a three-shot missile rack.");
unit("quad","Lynx supply quad","Armor",3,80,7,1,16,2,"resupply repair","Rapid support: light repair and ammunition delivery.");
unit("ambulance","Mercy ambulance","Armor",3,110,6,1,10,4,"heal","Two independent medical teams heal adjacent infantry.");
unit("hospital","Sanctuary field hospital","Armor",5,170,3,1,10,10,"heal hospital","Two medical actions at range two; nearby infantry recover each round.");
unit("recovery","Atlas recovery rig","Armor",5,200,3,1,12,18,"resupply repair","Heavy repair crane restores 85 HP and ammunition.");
unit("arsenal","Quartermaster arsenal","Armor",6,170,3,1,12,12,"resupply repair","Two supply stations reach allies two tiles away.");
unit("supplyheli","Crane supply helicopter","Air",5,105,7,1,12,2,"resupply repair","Fly supplies over rivers and service allies at range two.");
unit("medevac","Angel rescue helicopter","Air",5,120,7,1,14,3,"heal transport","Airborne medical team and infantry evacuation.");
unit("scoutheli","Firefly scout helicopter","Air",3,80,8,3,26,2,"recon","Fast aerial scout with extended vision.");
unit("twinheli","Hydra assault helicopter","Air",7,155,5,4,55,8,"antiArmor","Independent cannon and rocket pod.");
unit("aa_cannon","Sentry AA cannon","Armor",3,100,2,5,45,5,"antiAir","Towable anti-air gun; trades mobility for reach.");
unit("quadflak","Porcupine quad flak","Armor",5,140,2,4,32,10,"antiAir","Four independent short-range AA barrels.");
unit("sam","Sentinel SAM launcher","Armor",6,120,3,7,62,6,"antiAir","Long-range missile air defense.");
unit("radar","Watchman radar truck","Armor",4,90,5,1,10,2,"recon radar","Nine-tile vision reveals hidden approaches.");
unit("command","Beacon command carrier","Armor",5,160,4,2,24,14,"command","Nearby allies receive +5 attack damage within two tiles.");
unit("smoke","Veil smoke carrier","Armor",4,135,5,2,22,9,"smoke","Smoke protects an ally within three tiles for the enemy turn.");
unit("grenadier","Grenadier squad","Infantry",3,95,3,3,39,3,"capture splash","Explosive area damage; watch friendly fire.");
unit("flamer","Firebreak assault squad","Infantry",4,120,3,1,60,8,"capture antiInf","Powerful close-range infantry specialist.");
unit("ranger","Ranger patrol","Infantry",4,90,5,4,36,3,"capture recon","Fast objective raiders with extended rifle range.");
unit("atgun","Pike AT cannon","Armor",4,105,2,6,68,7,"antiArmor indirect","Long-range towed gun; cannot fire after moving.");
unit("mortarcarrier","Marten mortar carrier","Armor",5,140,4,5,46,9,"indirect splash","Protected mortar carrier with two independent tubes.");
unit("gunboat","Hammer gunboat","Navy",5,165,5,4,42,12,"antiArmor","Independent bow and stern cannons.");
const starters=['rifle','scout','medic','light','supply','jeep'];
const parents={rifle:null,scout:'rifle',mg:'rifle',rocket:'rifle',medic:null,marine:'rifle',commando:'scout',sniper:'scout',mortar:'mg',assault:'mg',light:null,tank:'light',heavy:'tank',superheavy:'heavy',cruiser:'light',td:'tank',siege:'heavy',jeep:null,autocannon:'jeep',apc:'jeep',ifv:'apc',amph:'apc',aa:'autocannon',flak:'aa',missile:'td',arty:'light',spg:'arty',mlrs:'spg',supply:null,logistics:'supply',drone:null,heli:'drone',fighter:'drone',bomber:'attackjet',attackjet:'fighter',transport:'heli',patrol:null,frigate:'patrol',destroyer:'frigate',battleship:'destroyer',landing:'patrol',sub:'frigate',carrier:'destroyer'};
Object.assign(parents,{"bike":"jeep","sidecar":"bike","rocketbike":"bike","quad":"supply","ambulance":"medic","hospital":"ambulance","recovery":"supply","arsenal":"logistics","supplyheli":"supply","medevac":"ambulance","scoutheli":"drone","twinheli":"heli","aa_cannon":"jeep","quadflak":"aa_cannon","sam":"aa","radar":"jeep","command":"apc","smoke":"apc","grenadier":"rifle","flamer":"assault","ranger":"scout","atgun":"rocket","mortarcarrier":"mortar","gunboat":"patrol"});
delete D.engineer;
function depth(id){return parents[id]?1+depth(parents[id]):0;}
for(const d of Object.values(D)){
 if(d.cost>20)d.cost=Math.max(2,Math.round(d.cost/65));
 d.parent=parents[d.id]||null;d.tier=depth(d.id);
 d.price=starters.includes(d.id)?0:4+d.tier*4;
 d.threshold=starters.includes(d.id)?0:8+d.tier*10;
 d.weapons=[{name:d.branch==='Infantry'?'Primary weapon':hasTrait(d,'indirect')?'Siege gun':d.branch==='Air'?'Weapon pod':d.id==='supply'||d.id==='logistics'?'Cab gun':'Main gun',power:d.power,range:d.range,capacity:d.power>=60?3:d.power>=40?4:6}];
}
function hasTrait(d,t){return d.traits.includes(t);}
D.tank.name='Atlas medium tank';D.heavy.desc='Slow breakthrough armor. Bring a supply truck.';
D.superheavy.weapons=[{name:'120 mm main cannon',power:70,range:4,capacity:3},{name:'75 mm left cannon',power:44,range:3,capacity:4},{name:'75 mm right cannon',power:44,range:3,capacity:4}];
D.flak.weapons=[{name:'Left AA battery',power:35,range:5,capacity:6},{name:'Right AA battery',power:35,range:5,capacity:6}];

for(const id of Object.keys(D)){const d=D[id];d.serviceSlots=hasTrait(d,'resupply')||hasTrait(d,'heal')?1:0;d.serviceRange=1;d.serviceHP=35;}
for(const id of ['logistics','arsenal','ambulance','hospital'])D[id].serviceSlots=2;
for(const id of ['arsenal','hospital','supplyheli','medevac'])D[id].serviceRange=2;
D.logistics.serviceHP=55;D.logistics.desc='Two independent service bays: repair and resupply two allies per turn.';
D.recovery.serviceHP=85;D.quad.serviceHP=20;D.hospital.serviceHP=60;D.ambulance.serviceHP=50;
for(const [id,n,power,range,cap] of [['sidecar',2,24,3,6],['quadflak',4,24,4,6],['mortarcarrier',2,36,5,4],['gunboat',2,38,4,4]])D[id].weapons=Array.from({length:n},(_,i)=>({name:(id==='sidecar'?['Sidecar MG','Rider rifle'][i]:'Battery '+(i+1)),power,range,capacity:cap}));
D.twinheli.weapons=[{name:'30 mm cannon',power:38,range:3,capacity:6},{name:'Rocket pod',power:55,range:4,capacity:3}];
function freshProfile(){return {completed:{},credits:8,earned:8,unlocked:[...starters],training:{},deck:['rifle','scout','medic','light','supply'],settings:{difficulty:'normal',fog:true,motion:true,sound:false}};}
function purchase(p,id){const d=D[id];if(!d||d.retired||p.unlocked.includes(id)||d.parent&&!p.unlocked.includes(d.parent)||d.techParent&&!p.unlocked.includes(d.techParent)||p.earned<d.threshold||p.credits<d.price)return false;p.credits-=d.price;p.unlocked.push(id);return true;}
function train(p,id){const n=p.training[id]||0,cost=3+n*3;if(!D[id]||!p.unlocked.includes(id)||n>=3||p.credits<cost)return false;p.credits-=cost;p.training[id]=n+1;return true;}
function deckError(deck,m,p){if(!Array.isArray(deck)||deck.length<1||deck.length>6)return 'Choose 1–6 troop types.';
if(new Set(deck).size!==deck.length)return 'One of each variant per deck.';
if(deck.some(id=>!D[id]||p&&!p.settings?.operator&&!p.unlocked.includes(id)))return 'Choose unlocked units.';
if(!deck.some(id=>D[id].traits.includes('capture')))return 'Bring infantry for objectives.';
if(!navalMap(m)&&deck.some(id=>D[id].branch==='Navy'))return 'Ships need a map with navigable water.';
if(!deck.some(id=>D[id].cost<=10))return 'Bring a troop affordable with 10 starting supply.';return ''; }

function weapon(u){return D[u.type].weapons[u.weapon||0];}
function canFire(u){const i=u.weapon||0;return !u.landed&&!(u.serviceUsed||[]).some(Boolean)&&!u.fired&&!u.used[i]&&u.ammo[i]>0;}
function selectWeapon(u,i){if(!Number.isInteger(i)||!D[u.type].weapons[i])return false;u.weapon=i;return true;}
function canAttackAny(s,u,v){
 if(!u||!v)return false;const old=u.weapon||0;
 let result=false;
 for(let i=0;i<D[u.type].weapons.length;i++){
  if(u.used[i]||u.ammo[i]<=0)continue;
  u.weapon=i;
  if(canAttack(s,u,v)){result=true;break;}
 }
 u.weapon=old;return result;
}
// Keep an explicit selected gun if legal; otherwise choose a useful unused
// mount. Multiple attacks stay one enemy click each, never auto-spend ammo.
function prepareTargetWeapon(s,u,v){
 if(canAttack(s,u,v))return true;
 if(!u||u.fired)return false;
 const old=u.weapon||0;let best=null;
 for(let i=0;i<D[u.type].weapons.length;i++){
  if(u.used[i]||u.ammo[i]<=0)continue;
  u.weapon=i;
  if(!canAttack(s,u,v))continue;
  const power=damage(s,u,v),score=Math.min(power,v.hp)+(power>=v.hp?25:0);
  if(!best||score>best.score)best={i,score};
 }
 u.weapon=best?.i??old;return !!best;
}
function rangeTiles(s,u){
 if(!u||u.fired||u.landed||u.carried||u.hp<=0||(u.serviceUsed||[]).some(Boolean))return [];
 if(has(u,'indirect')&&D[u.type].branch!=='Navy'&&u.repositionedTurn===s.turn&&u.setupTurn!==s.turn)return [];
 const usable=D[u.type].weapons.filter((w,i)=>!u.used[i]&&u.ammo[i]>0);
 if(!usable.length)return [];
 return s.tiles.filter(t=>t.terrain!=='void'&&
  dist(u,t)>=(has(u,'indirect')?2:1)&&usable.some(w=>dist(u,t)<=(u.battery?13:w.range)+
   (u.rangeBoostTurn===s.turn?2:0)+(tile(s,u.x,u.y)?.terrain==='hill'?1:0)+rangeElevation(s,u,t)));
}
function reload(s,u){if(s.phase==='deployment'||s.result||s.side!==u.team||u.fired||u.hp<=0||u.carried||D[u.type].branch==='Air'&&!u.landed)return false;const ws=D[u.type].weapons;if(ws.every((w,i)=>u.ammo[i]===w.capacity))return false;
 const t=tile(s,u.x,u.y),depot=t.facility&&t.owner===u.team;
 if(!u.reserve&&!(depot&&(u.team===1||s.credits>0)))return false;
 if(u.reserve)u.reserve--;else if(u.team===0)s.credits--;
 u.ammo=ws.map(w=>w.capacity);u.fired=u.moved=true;u.used=ws.map(()=>true);return true;
}


const abilities={"rifle":{"kind":"dash","name":"Double time","desc":"Gain +2 movement this turn before moving.","cost":0,"cooldown":2},"light":{"kind":"dash","name":"Flanking gears","desc":"Gain +2 movement this turn before moving.","cost":0,"cooldown":2},"cruiser":{"kind":"dash","name":"Cruise overdrive","desc":"Gain +2 movement this turn before moving.","cost":0,"cooldown":2},"jeep":{"kind":"dash","name":"Off-road sprint","desc":"Gain +2 movement this turn before moving.","cost":0,"cooldown":2},"bike":{"kind":"dash","name":"Throttle burst","desc":"Gain +2 movement this turn before moving.","cost":0,"cooldown":2},"rocketbike":{"kind":"dash","name":"Ambush run","desc":"Gain +2 movement this turn before moving.","cost":0,"cooldown":2},"quad":{"kind":"dash","name":"Express delivery","desc":"Gain +2 movement this turn before moving.","cost":0,"cooldown":2},"patrol":{"kind":"dash","name":"Full ahead","desc":"Gain +2 movement this turn before moving.","cost":0,"cooldown":2},"scoutheli":{"kind":"dash","name":"Low-level dash","desc":"Gain +2 movement this turn before moving.","cost":0,"cooldown":2},"ranger":{"kind":"dash","name":"Trail run","desc":"Gain +2 movement this turn before moving.","cost":0,"cooldown":2},"marine":{"kind":"dash","name":"Beach rush","desc":"Gain +2 movement this turn before moving.","cost":0,"cooldown":2},"fighter":{"kind":"dash","name":"Afterburner","desc":"Gain +2 movement this turn before moving.","cost":0,"cooldown":2},"scout":{"kind":"scan","name":"Spotter binoculars","desc":"Reveal enemies within 10 tiles for this round.","cost":0,"cooldown":3},"drone":{"kind":"scan","name":"Sensor sweep","desc":"Reveal enemies within 10 tiles for this round.","cost":0,"cooldown":3},"radar":{"kind":"scan","name":"Wide-band sweep","desc":"Reveal enemies within 10 tiles for this round.","cost":0,"cooldown":3},"sub":{"kind":"scan","name":"Sonar pulse","desc":"Reveal enemies within 10 tiles for this round.","cost":0,"cooldown":3},"rocket":{"kind":"focus","name":"Guided rocket","desc":"Your next attack this round gains +18 power.","cost":0,"cooldown":2},"sniper":{"kind":"focus","name":"Steady scope","desc":"Your next attack this round gains +18 power.","cost":0,"cooldown":2},"tank":{"kind":"focus","name":"Rangefinder","desc":"Your next attack this round gains +18 power.","cost":0,"cooldown":2},"heavy":{"kind":"focus","name":"Breach round","desc":"Your next attack this round gains +18 power.","cost":0,"cooldown":2},"td":{"kind":"focus","name":"Hunter optics","desc":"Your next attack this round gains +18 power.","cost":0,"cooldown":2},"missile":{"kind":"focus","name":"Guided strike","desc":"Your next attack this round gains +18 power.","cost":0,"cooldown":2},"sam":{"kind":"focus","name":"Radar lock","desc":"Your next attack this round gains +18 power.","cost":0,"cooldown":2},"aa_cannon":{"kind":"focus","name":"Lead tracking","desc":"Your next attack this round gains +18 power.","cost":0,"cooldown":2},"atgun":{"kind":"focus","name":"Armor-piercing shot","desc":"Your next attack this round gains +18 power.","cost":0,"cooldown":2},"attackjet":{"kind":"focus","name":"Laser designation","desc":"Your next attack this round gains +18 power.","cost":0,"cooldown":2},"battleship":{"kind":"focus","name":"Fire control","desc":"Your next attack this round gains +18 power.","cost":0,"cooldown":2},"mg":{"kind":"salvo","name":"Sustained burst","desc":"Ready one fired weapon again. Still consumes ammunition.","cost":1,"cooldown":3},"superheavy":{"kind":"salvo","name":"Autoloader cycle","desc":"Ready one fired weapon again. Still consumes ammunition.","cost":1,"cooldown":3},"flak":{"kind":"salvo","name":"Battery recycle","desc":"Ready one fired weapon again. Still consumes ammunition.","cost":1,"cooldown":3},"quadflak":{"kind":"salvo","name":"Staggered barrage","desc":"Ready one fired weapon again. Still consumes ammunition.","cost":1,"cooldown":3},"sidecar":{"kind":"salvo","name":"Sidecar follow-up","desc":"Ready one fired weapon again. Still consumes ammunition.","cost":1,"cooldown":3},"twinheli":{"kind":"salvo","name":"Staggered strike","desc":"Ready one fired weapon again. Still consumes ammunition.","cost":1,"cooldown":3},"gunboat":{"kind":"salvo","name":"Rolling broadside","desc":"Ready one fired weapon again. Still consumes ammunition.","cost":1,"cooldown":3},"destroyer":{"kind":"salvo","name":"Rapid salvo","desc":"Ready one fired weapon again. Still consumes ammunition.","cost":1,"cooldown":3},"medic":{"kind":"heal","name":"Emergency dressings","desc":"Heal nearby infantry by 30 HP within two tiles; ends action.","cost":1,"cooldown":3},"ambulance":{"kind":"heal","name":"Triage stop","desc":"Heal nearby infantry by 30 HP within two tiles; ends action.","cost":1,"cooldown":3},"hospital":{"kind":"heal","name":"Field surgery","desc":"Heal nearby infantry by 30 HP within two tiles; ends action.","cost":1,"cooldown":3},"medevac":{"kind":"heal","name":"Rescue drop","desc":"Heal nearby infantry by 30 HP within two tiles; ends action.","cost":1,"cooldown":3},"supply":{"kind":"ammo","name":"Field cache","desc":"Refill nearby allies’ magazines and reserves within two tiles; ends action.","cost":2,"cooldown":3},"arsenal":{"kind":"ammo","name":"Ammo distribution","desc":"Refill nearby allies’ magazines and reserves within two tiles; ends action.","cost":2,"cooldown":3},"supplyheli":{"kind":"ammo","name":"Airdrop","desc":"Refill nearby allies’ magazines and reserves within two tiles; ends action.","cost":2,"cooldown":3},"carrier":{"kind":"ammo","name":"Fleet replenishment","desc":"Refill nearby allies’ magazines and reserves within two tiles; ends action.","cost":2,"cooldown":3},"logistics":{"kind":"service","name":"Third-shift crew","desc":"Ready one spent service bay again, without refreshing weapons.","cost":1,"cooldown":3},"recovery":{"kind":"service","name":"Crane overtime","desc":"Ready one spent service bay again, without refreshing weapons.","cost":1,"cooldown":3},"command":{"kind":"rally","name":"Coordinated advance","desc":"Nearby unmoved allies gain +2 movement this round; ends action.","cost":1,"cooldown":3},"commando":{"kind":"rally","name":"Squad rally","desc":"Nearby unmoved allies gain +2 movement this round; ends action.","cost":1,"cooldown":3},"smoke":{"kind":"smokescreen","name":"Screen curtain","desc":"Screen yourself and adjacent allies for +18 cover this round; ends action.","cost":1,"cooldown":3},"grenadier":{"kind":"smokescreen","name":"Smoke grenades","desc":"Screen yourself and adjacent allies for +18 cover this round; ends action.","cost":1,"cooldown":3},"assault":{"kind":"smokescreen","name":"Breach screen","desc":"Screen yourself and adjacent allies for +18 cover this round; ends action.","cost":1,"cooldown":3},"autocannon":{"kind":"smokescreen","name":"Escape screen","desc":"Screen yourself and adjacent allies for +18 cover this round; ends action.","cost":1,"cooldown":3},"heli":{"kind":"smokescreen","name":"Rotor smoke","desc":"Screen yourself and adjacent allies for +18 cover this round; ends action.","cost":1,"cooldown":3},"frigate":{"kind":"smokescreen","name":"Fleet screen","desc":"Screen yourself and adjacent allies for +18 cover this round; ends action.","cost":1,"cooldown":3},"apc":{"kind":"unload","name":"Assault dismount","desc":"Unload cargo onto a free adjacent tile, ready to move and act; ends transport action.","cost":0,"cooldown":3},"amph":{"kind":"unload","name":"Beach landing","desc":"Unload cargo onto a free adjacent tile, ready to move and act; ends transport action.","cost":0,"cooldown":3},"transport":{"kind":"unload","name":"Fast rope","desc":"Unload cargo onto a free adjacent tile, ready to move and act; ends transport action.","cost":0,"cooldown":3},"landing":{"kind":"unload","name":"Rapid beachhead","desc":"Unload cargo onto a free adjacent tile, ready to move and act; ends transport action.","cost":0,"cooldown":3},"ifv":{"kind":"unload","name":"Covered insertion","desc":"Unload cargo onto a free adjacent tile, ready to move and act; ends transport action.","cost":0,"cooldown":3},"arty":{"kind":"setup","name":"Quick deployment","desc":"Fire indirect weapons after moving this round.","cost":1,"cooldown":3},"spg":{"kind":"setup","name":"Stabilizer lock","desc":"Fire indirect weapons after moving this round.","cost":1,"cooldown":3},"mortar":{"kind":"setup","name":"Fast setup","desc":"Fire indirect weapons after moving this round.","cost":1,"cooldown":3},"mortarcarrier":{"kind":"setup","name":"Hydraulic mounts","desc":"Fire indirect weapons after moving this round.","cost":1,"cooldown":3},"mlrs":{"kind":"suppress","name":"Saturation rockets","desc":"Your next hit this round slows its target by 2 and reduces its power by 8 through its next turn.","cost":1,"cooldown":3},"siege":{"kind":"suppress","name":"Concussion round","desc":"Your next hit this round slows its target by 2 and reduces its power by 8 through its next turn.","cost":1,"cooldown":3},"bomber":{"kind":"suppress","name":"Disruption run","desc":"Your next hit this round slows its target by 2 and reduces its power by 8 through its next turn.","cost":1,"cooldown":3},"flamer":{"kind":"suppress","name":"Flame suppression","desc":"Your next hit this round slows its target by 2 and reduces its power by 8 through its next turn.","cost":1,"cooldown":3}};
abilities.aa={kind:'scan',name:'Airspace sweep',desc:'Reveal enemies within 10 tiles for this round.',cost:0,cooldown:3};
for(const [id,ability] of Object.entries(abilities))D[id].ability=ability;
function abilityError(s,u){
if(!u||u.landed||s.phase==='deployment'||u.hp<=0||u.carried||s.result||s.side!==u.team||u.readyTurn>s.turn)return 'Unavailable now.';
const a=D[u.type].ability;if(!a)return 'No ability.';
if((u.abilityReady||0)>s.turn)return 'Ready in '+(u.abilityReady-s.turn)+' round(s).';
if(u.team===0&&s.credits<a.cost)return 'Need '+a.cost+' supply.';
if(a.kind==='salvo'||a.kind==='broadside'){if(u.shotRound!==s.turn||!(u.used||[]).some((v,i)=>v&&u.ammo[i]>0)||(u.serviceUsed||[]).some(Boolean))return 'Fire a weapon with ammo remaining first.';}
else if(a.kind==='service'){if(!(u.serviceUsed||[]).some(Boolean))return 'Use a service bay first.';}
else if(u.fired)return 'Action already spent.';
if(a.kind==='dash'&&u.moved)return 'Use before moving.';
if((a.kind==='unload'||a.kind==='beachhead')&&(!u.cargo||!insertionTile(s,u)))return 'Embark infantry and clear an adjacent tile first.';
if(a.kind==='setup'&&!u.moved)return 'Move before emplacing.';
 if(['evasion','harass'].includes(a.kind)&&u.moved)return 'Use before moving.';
 if(a.kind==='fleetpatch'&&!alive(s,u.team).some(v=>D[v.type].branch==='Navy'&&dist(u,v)<=2&&(v.hp<v.maxHp||v.disabled)))return 'No damaged ship within 2 tiles.';
 if(a.kind==='sortie'&&!alive(s,u.team).some(v=>D[v.type].branch==='Air'&&dist(u,v)<=4))return 'No allied aircraft within 4 tiles.';
return '';
}
function insertionTile(s,u){const b=s.units.find(v=>v.id===u.cargo&&v.hp>0);return b&&s.tiles.find(t=>dist(t,u)===1&&!at(s,t.x,t.y)&&passable(s,b,t.x,t.y));}
function useAbility(s,u){
if(abilityError(s,u))return false;const a=D[u.type].ability;
if(u.team===0)s.credits-=a.cost;u.abilityReady=s.turn+a.cooldown;
const allies=alive(s,u.team).filter(v=>!v.carried&&(D[v.type].branch!=='Air'||v.landed)&&dist(u,v)<=2);
if(a.kind==='dash'){u.boostTurn=s.turn;u.moveBoost=1;}
if(a.kind==='scan'||a.kind==='sonar'){u.scanTurn=s.turn;}
if(a.kind==='focus'){u.focusTurn=s.turn;}
if(a.kind==='suppress'){u.suppressTurn=s.turn;}
 if(a.kind==='bombard'){u.bombardTurn=s.turn;}
 if(a.kind==='harass'){u.harassTurn=s.turn;}
 if(a.kind==='rangefinder'){u.rangeBoostTurn=s.turn;}
 if(a.kind==='silent'){u.submergedUntil=s.turn+1;u.fired=u.moved=true;}
 if(a.kind==='torpedo'){u.torpedoTurn=s.turn;}
 if(a.kind==='evasion'){u.boostTurn=s.turn;u.moveBoost=2;u.smokeUntil=s.turn+1;}
if(a.kind==='setup'){u.setupTurn=s.turn;}
if(a.kind==='salvo'){const i=u.used.findIndex((v,i)=>v&&u.ammo[i]>0);u.used[i]=false;u.weapon=i;u.fired=false;}
 if(a.kind==='broadside'){
  const spent=u.used.map((v,i)=>v&&u.ammo[i]>0?i:-1).filter(i=>i>=0).slice(0,2);
  for(const i of spent)u.used[i]=false;
  u.weapon=spent[0];u.fired=false;
 }
 if(a.kind==='screen'){alive(s,u.team).filter(v=>D[v.type].branch==='Navy'&&dist(u,v)<=2).forEach(v=>v.smokeUntil=s.turn+1);u.fired=u.moved=true;}
 if(a.kind==='fleetpatch'){alive(s,u.team).filter(v=>D[v.type].branch==='Navy'&&dist(u,v)<=2).forEach(v=>{v.hp=Math.min(v.maxHp,v.hp+28);v.disabled=false;});u.fired=u.moved=true;}
 if(a.kind==='sortie'){alive(s,u.team).filter(v=>D[v.type].branch==='Air'&&dist(u,v)<=4).forEach(v=>{v.hp=Math.min(v.maxHp,v.hp+24);v.ammo=D[v.type].weapons.map(w=>w.capacity);v.reserve=1;});u.fired=u.moved=true;}
 if(a.kind==='beachhead'){const t=insertionTile(s,u),b=s.units.find(v=>v.id===u.cargo);unload(s,u,t.x,t.y,true);b.moved=b.fired=false;b.used=D[b.type].weapons.map(()=>false);b.entrenched=true;b.smokeUntil=s.turn+1;u.fired=u.moved=true;}
if(a.kind==='service'){u.serviceUsed[u.serviceUsed.findIndex(Boolean)]=false;u.fired=false;}
if(a.kind==='heal'){allies.filter(v=>D[v.type].branch==='Infantry').forEach(v=>{v.hp=Math.min(v.maxHp,v.hp+30);v.pressure=Math.max(0,(v.pressure||0)-50);if(v.pressure<60)v.pinnedUntil=-1;});u.fired=u.moved=true;}
if(a.kind==='ammo'){allies.forEach(v=>{v.ammo=D[v.type].weapons.map(w=>w.capacity);v.reserve=1;});u.fired=u.moved=true;}
if(a.kind==='rally'){allies.filter(v=>!v.moved&&!v.fired&&v!==u).forEach(v=>{v.boostTurn=s.turn;v.moveBoost=1;});u.fired=u.moved=true;}
if(a.kind==='smokescreen'){allies.filter(v=>dist(u,v)<=1).forEach(v=>v.smokeUntil=s.turn);u.fired=u.moved=true;}
if(a.kind==='unload'){const t=insertionTile(s,u),b=s.units.find(v=>v.id===u.cargo);unload(s,u,t.x,t.y,true);b.moved=b.fired=false;b.used=D[b.type].weapons.map(()=>false);b.serviceUsed=Array(D[b.type].serviceSlots).fill(false);u.fired=u.moved=true;}
log(s,D[u.type].name+': '+a.name+'.');return true;
}
function moveBudget(s,u){if(u.disabled||u.landed||pinned(s,u))return 0;if(u.evadeMove===s.turn)return 2;const branch=D[u.type].branch,t=tile(s,u.x,u.y);const roadBoost=branch==='Armor'&&['road','bridge'].includes(t?.terrain)?1:0;const footBoost=branch==='Infantry'&&t?.path===true?1:0;return Math.max(1,D[u.type].move+roadBoost+footBoost+(u.boostTurn===s.turn?(u.moveBoost||0):0)-(u.suppressedUntil>=s.turn?1:0));}

function navalMap(m){return ['coast','islands'].includes(m.biome)||m.n%4===2||m.type==='intercept';}
function capacity(s,team=0){if(team===0&&s.operator)return 30;return 10+Math.min(10,s.tiles.filter(t=>t.owner===team&&t.facility&&t.facility!=='hq').reduce((n,t)=>n+(t.facility==='town'?2:1),0));}
const chapters=[
{name:'Greenline',biome:'grass',kicker:'THE HOME FRONT',story:'The Meridian Coalition has crossed the border. Reassemble the Atlas defense force and reopen the Greenline corridor.',names:['First Light','Orchard Road','The Crossing','Broken Signal','Iron Harvest','Hold the Line','Night Courier','Railhead','The Long Valley','Greenline Rising']},
{name:'Dust Frontier',biome:'desert',kicker:'THE SOUTHERN EXPANSE',story:'Fuel convoys vanish into the dunes. Take the desert wells, protect supply lines, and break the armored blockade.',names:['Dustfall','Dry River','Mirage Station','Copper Road','Dune Hunters','Last Oasis','Sandrunner','Glass Horizon','Sunhammer','The Red Citadel']},
{name:'Tidebreak',biome:'coast',kicker:'THE COASTAL WAR',story:'Meridian warships control the strait. Escort landing forces through contested waters and retake the harbor towns.',names:['Saltwater','Beachhead','Harbor Watch','Deep Channel','Iron Wake','Breakwater','Coastal Runner','Silent Current','Storm Fleet','Tidebreak']},
{name:'White Reach',biome:'snow',kicker:'THE NORTHERN FRONT',story:'The war reaches the frozen north. Hold mountain facilities and push through the fortified pass.',names:['Whiteout','Pine Needle','Frozen Ford','Cold Relay','Icebreaker','Winter Watch','Northern Express','Avalanche','Polar Dawn','The White Keep']},
{name:'Skyfall',biome:'islands',kicker:'THE ISLAND CHAIN',story:'Scattered island airfields hold the key to the final offensive. Coordinate aircraft, marines, and naval fire support.',names:['High Altitude','Island Hopper','Blue Divide','Radar Silence','Cloudburst','Watchtower','Sea Courier','Wingbreak','Thunderhead','Skyfall']},
{name:'Iron Meridian',biome:'urban',kicker:'THE CITY WAR',story:'Break through city blocks and industrial fortifications.',names:['Outer Ring','Foundry District','Steel Bridge','Dead Frequency','Hammerfall','The Last Stand','Capital Express','Ash Boulevard','Citadel Gate','End of the Meridian']},
{name:'Playroom Rebellion',biome:'toy',kicker:'THE ATTIC FRONT',story:'Tiny armies battle across a toy-strewn attic: blocks, marbles, model railways, and carpeted hills.',names:['Tin Platoon','Building Blocks','Train Set','Lost Marbles','Cardboard Keep','The Floor Is Lava','Toy Box','Clockwork Army','Bedroom Siege','Last Toy Standing']},
{name:'Highland Storm',biome:'mountain',kicker:'THE HIGH PASSES',story:'Storm clouds, steep ridges, alpine villages, and ambushes guard the highland passes.',names:['Ridgeline','Mountain Village','Snowmelt Ford','Echo Valley','Thunder Road','Pine Pass','Cliff Harbor','Long Ascent','Storm Warning','Above the Clouds']}
];
const objectiveNames={capture:'Capture enemy HQ',eliminate:'Eliminate hostile forces',hold:'Hold the relay for 4 turns',convoy:'Escort the courier to extraction',strike:'Destroy the command vehicle',seize:'Capture and hold all marked facilities for 2 rounds',protect:'Protect the relief convoy for 10 rounds',defense:'Survive three offensive waves and secure HQ',battery:'Destroy all four siege batteries',counterbattery:'Defend your artillery against five enemy assault waves',escort:'Escort the autonomous convoy to extraction',breach:'Break three entrenched defensive positions',intercept:'Intercept the escaping enemy flagship'};
const specialOperations={
 5:'defense',8:'battery',14:'breach',16:'escort',17:'intercept',18:'battery',
 22:'intercept',25:'counterbattery',26:'escort',29:'battery',
 33:'breach',35:'defense',38:'battery',
 42:'intercept',46:'escort',49:'intercept',
 52:'breach',55:'counterbattery',58:'battery',59:'breach',
 62:'escort',65:'defense',68:'counterbattery',69:'breach',
 72:'battery',75:'counterbattery',77:'breach',79:'battery'
};
const operationDescriptions={
 battery:'FOUR RED BATTERIES · Red warning zones mark incoming five-shell strikes. Destroy the guns to silence them.',
 counterbattery:'REVERSE SIEGE · You command four fixed heavy batteries. Repel five large assaults before they overrun your guns.',
 escort:'NO REINFORCEMENTS · 40 starting supply, six starting pads in a line. Escort an autonomous convoy through ambushes.',
 breach:'FORTIFIED BREAKTHROUGH · Destroy three protected strongpoints through successive defensive lines.',
 intercept:'NAVAL INTERCEPTION · Sink a heavily escorted enemy flagship before it escapes west.',
 defense:'WAVE DEFENSE · Survive three incoming attacks with enhanced starting reserves.'
};
const defaultSubtitles={capture:'FRONTLINE ASSAULT · Advance infantry to the enemy command post',seize:'MULTI-POINT CONTROL · Secure and hold contested objectives',protect:'HOLD THE PERIMETER · Keep relief vehicles alive',strike:'HIGH-VALUE TARGET · Destroy enemy command armor',eliminate:'CLEAR THE FIELD · Eliminate hostile formations',hold:'POSITIONAL WARFARE · Retain the relay under counterattack',convoy:'MOBILE ESCORT · Guide the courier to extraction'};
const missions=chapters.flatMap((c,ch)=>c.names.map((name,n)=>{
 const id=ch*10+n,type=specialOperations[id]||['capture','seize','protect','strike','eliminate','hold','convoy','seize','protect','capture'][n];
 return {id,name,ch,n,biome:c.biome,seed:1807+ch*171+n*37,type,difficulty:1+ch+Math.floor(n/4),par:12+ch*2+n,description:c.story,subtitle:operationDescriptions[type]||defaultSubtitles[type]};
}));
const has=(u,t)=>D[u.type].traits.includes(t),dist=(a,b)=>Math.abs(a.x-b.x)+Math.abs(a.y-b.y);
// Shared continuous alpine heightfield: actual ground, tactical units and ray picks agree.
// Chunky square mountain terraces, with short angular ramps only along connected roads.
function mountainTier(s,x,y){
 const seed=s.mission.seed||1807,u=x/Math.max(1,s.w-1),v=y/Math.max(1,s.h-1);
 const raw=Math.max(.12,1.35+3.3*Math.pow(Math.max(0,u),1.18)
  +1.05*Math.sin(u*7.2+seed*.013)+.76*Math.cos(v*8.1+seed*.019)
  +.47*Math.sin(u*4.7+v*5.2+seed*.007)
  -.9*Math.exp(-Math.pow((v-(.50+.09*Math.sin(u*5.2+seed*.004)))/.15,2)));
 const terraces=Math.floor((raw-.6)/1.12),ascendingShelf=Math.floor(3*Math.max(0,x)/Math.max(1,s.w-1));
 return Math.max(0,Math.min(4,Math.max(terraces,ascendingShelf)));
}
function mountainPlatform(s,x,y){return .7+.62*mountainTier(s,x,y);}
function groundHeight(s,x,y){
 if(!s?.mission)return 0;
 if(s.mission.biome!=='mountain')return tile(s,Math.round(x),Math.round(y))?.terrain==='hill'?.22:0;
 const nearestX=Math.round(x),nearestY=Math.round(y),tol=.14;
 const road=(xx,yy)=>['road','bridge'].includes(tile(s,xx,yy)?.terrain);
 // A triangular road ramp bridges two square terrace centers; the rest stays level.
 if(Math.abs(y-nearestY)<tol&&Math.abs(x-Math.round(x))>1e-6){
  const lo=Math.floor(x),hi=lo+1;
  if(road(lo,nearestY)&&road(hi,nearestY))
   return mountainPlatform(s,lo,nearestY)+(mountainPlatform(s,hi,nearestY)-mountainPlatform(s,lo,nearestY))*(x-lo);
 }
 if(Math.abs(x-nearestX)<tol&&Math.abs(y-Math.round(y))>1e-6){
  const lo=Math.floor(y),hi=lo+1;
  if(road(nearestX,lo)&&road(nearestX,hi))
   return mountainPlatform(s,nearestX,lo)+(mountainPlatform(s,nearestX,hi)-mountainPlatform(s,nearestX,lo))*(y-lo);
 }
 return mountainPlatform(s,nearestX,nearestY);
}
function elevation(s,t){return t?groundHeight(s,t.x,t.y):0;}
function rangeElevation(s,a,b){if(s.mission.biome!=='mountain'||D[a.type]?.branch==='Air'||D[a.type]?.branch==='Navy')return 0;return elevation(s,tile(s,a.x,a.y))-elevation(s,tile(s,b.x,b.y))>=.61?1:0;}
function rng(seed){return ()=>{seed|=0;seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return ((t^t>>>14)>>>0)/4294967296;};}
function make(m,difficulty='normal',upgrades={},deck=['rifle','scout','medic','light','supply']){
const error=deckError(deck,m);if(error)throw new Error(error);const rand=rng(m.seed),w=24+(m.n%3)*2,h=18+(m.n%4)*2,mid=Math.floor(h/2),s={version:3,phase:'deployment',fog:true,deck:[...deck],mission:{...m},w,h,turn:1,side:0,credits:m.type==='defense'?20:m.type==='escort'||m.type==='counterbattery'?40:m.type==='battery'?22:m.type==='breach'?18:10,enemyCredits:difficulty==='easy'?5:difficulty==='hard'?12:8,difficulty,units:[],tiles:[],log:[],nextId:1,result:null,hold:0,seized:0,kills:0,losses:0,upgrades:{...upgrades},events:[],pads:[],seen:[],home:{x:2,y:mid},enemyHome:{x:w-3,y:mid+(m.n%3)-1}};
for(let y=0;y<h;y++)for(let x=0;x<w;x++){
const edge=1+Math.floor((Math.sin(y*.7+m.seed)*.5+.5)*3),inset=1+Math.floor((Math.cos(x*.5+m.n)*.5+.5)*2);const shape=m.n%6,cut=shape===0?Math.abs(y-mid)<3&&x>w-6:shape===1?x>w*.45&&x<w*.65&&y<mid-3:shape===2?(x<4||x>w-5)&&(y<5||y>h-6):shape===3?y<Math.floor(x*.22)-1:shape===4?y>h-2-Math.floor(Math.abs(x-w/2)*.3):x<5&&Math.abs(y-mid)>4;const ridge=Math.sin((x+m.seed*.001)*.43)*.43+Math.cos((y-m.seed*.002)*.51)*.35+Math.sin((x+y)*.24+m.n)*.24;let terrain=cut||x<edge-1||x>w-edge||y<inset-1||y>h-inset?'void':ridge>.53?'mountain':ridge>.25?'hill':ridge<-.35?'forest':'plain';if(terrain==='plain'&&rand()<.06)terrain='forest';
if(m.biome==='desert'&&terrain==='forest')terrain='dune';if(m.biome==='urban'&&terrain==='forest')terrain='ruins';if(m.biome==='toy'&&terrain==='forest')terrain='ruins';if(m.biome==='mountain'&&terrain==='plain'&&rand()<.08)terrain='forest';
const river=Math.floor(w*.5+Math.sin(y*.4+m.n)*2);
if(navalMap(m)){
// Deep water occupies the foreground and, for coastal theaters, a second offshore basin.
// Keep the central road corridor and high-ground facilities connected for infantry.
const maritime=['coast','islands'].includes(m.biome);
const deepWater=y>=mid+4;
const northernSea=maritime&&y<=mid-5||!maritime&&m.n%3===0&&y<=mid-7;
const inlet=m.biome==='islands'&&y>=mid+2&&x<Math.floor(w*.32);
const riverChannel=m.n%4===2&&Math.abs(x-river)<=1&&y>mid+2;
if(deepWater||northernSea||inlet||riverChannel)terrain='water';
}
s.tiles.push({x,y,terrain,owner:-1,facility:null});}
// A legible road network: two parallel east-west arteries and straight north-south connectors.
const road=(x,y)=>{const t=tile(s,x,y);if(!t)return;t.terrain=t.terrain==='water'?'bridge':'road';t.path=false;};
const horizontal=(y,x1=1,x2=w-2)=>{for(let x=x1;x<=x2;x++)road(x,y);};
const vertical=(x,y1,y2)=>{for(let y=Math.min(y1,y2);y<=Math.max(y1,y2);y++)road(x,y);};
horizontal(mid);
horizontal(mid+4,Math.floor(w*.2),w-3);
horizontal(mid-4,Math.floor(w*.3),w-5);
for(const x of [6,Math.floor(w*.55),w-5])vertical(x,mid-4,mid+4);
const facility=(x,y,f,owner,objective=false)=>{const nearest=[mid,mid-4,mid+4].reduce((a,b)=>Math.abs(y-a)<=Math.abs(y-b)?a:b);vertical(x,nearest,y);const t=tile(s,x,y);t.terrain='road';t.path=false;t.facility=f;t.owner=owner;t.objective=objective;};
facility(2,mid,'hq',0);facility(s.enemyHome.x,s.enemyHome.y,'hq',1);
const pts=[[Math.floor(w*.33),mid-4,'factory'],[Math.floor(w*.58),mid+3,'town'],[w-7,mid-4,'relay'],[Math.floor(w*.45),mid-6,'airfield'],[w-8,mid+5,'factory']];
pts.forEach(([x,y,f],i)=>facility(x,y,f,i===2?1:-1,m.type==='seize'&&i<3||m.type==='hold'&&f==='relay'));
for(const [x,y]of [[2,mid-2],[3,mid-1],[2,mid+2],[3,mid+1]]){for(let yy=Math.min(y,mid);yy<=Math.max(y,mid);yy++)road(x,yy);s.pads.push({x,y,kind:'land'});}
if(navalMap(m)){
 for(let x=1;x<w-1;x++)for(let y=mid+4;y<h-1;y++){const t=tile(s,x,y);if(!t.facility&&t.terrain!=='road'&&t.terrain!=='bridge')t.terrain='water';}
 for(const p of [{x:2,y:h-3,kind:'sea'},{x:4,y:h-3,kind:'sea'},{x:6,y:h-3,kind:'sea'}]){
   const t=tile(s,p.x,p.y);t.terrain='water';s.pads.push(p);
 }
}
s.pads.forEach(p=>tile(s,p.x,p.y).pad=true);
s.extraction={x:w-3,y:mid+4};facility(s.extraction.x,s.extraction.y,'town',-1);
// Narrow foot trails are distinct from vehicle roads and help infantry maneuver.
for(const lane of [mid-2,mid+2])for(let x=3;x<w-3;x++){
 const t=tile(s,x,lane);
 if(t&&['plain','forest','dune','hill','ruins'].includes(t.terrain)&&!t.facility&&!t.pad){t.path=true;t.pathAxis='x';}
}
const enemies=['rifle','rocket','light','scout','supply',...(m.n>0?['mg']:[]),...(m.difficulty>2?['td','arty']:[]),...(m.ch>2?['aa','command']:[])];
enemies.forEach((type,i)=>{let x=w-5-(i%3)*2,y=mid-5+Math.floor(i/3)*3;road(x,y);let u=add(s,type,1,x,y);if(i%3===0)u.entrenched=true;if(m.type==='strike'&&i===2)u.command=true;});
// Deliberate mid-map vanguard instead of a six-turn march across empty squares.
// Opponent patrols scout, skirmish or hold road choke points and attract early
// decisions. Scenario-specific assault/wave missions retain their authored setup.
if(!['intercept','counterbattery','escort'].includes(m.type)){
 const wings=difficulty==='easy'?1:difficulty==='hard'?(m.n===0?2:3):m.n===0?1:m.type==='defense'?1:2,
  doctrines=[['scout','rifle'],['rifle','mg'],['scout','rocket'],['light','rifle']],
  picks=doctrines[m.n%doctrines.length];
 for(let i=0;i<wings;i++){
  const type=picks[i%picks.length],goal={x:Math.floor(w*(i===0?.51:.58)),y:mid+(i?3:-3)};
  const spots=s.tiles.filter(t=>!t.facility&&!t.pad&&!at(s,t.x,t.y)&&
   passable(s,{type},t.x,t.y)&&t.x>=Math.floor(w*.40)&&t.x<=Math.floor(w*.64)&&
   dist(t,s.home)>=5).sort((a,b)=>dist(a,goal)-dist(b,goal));
  if(spots[0]){
   const t=spots[0],u=add(s,type,1,t.x,t.y);
   u.entrenched=type==='mg';u.sentry=type==='mg';u.vanguard=true;
  }
 }
}
if(navalMap(m)){
 // A proper opposing task group: smaller waters get three ships, coastal seas
 // start with a four/five-vessel combined-arms fleet. No inflated weapon stats.
 const ocean=['coast','islands'].includes(m.biome)||m.type==='intercept';
 const fleet=ocean?['patrol','frigate','gunboat','destroyer','sub']:['patrol','gunboat','frigate'];
 for(let i=0;i<fleet.length;i++){
   const x=w-5-(i%3)*3,y=h-3-Math.floor(i/3),t=tile(s,x,y);
   if(t&&t.terrain==='water'&&!at(s,x,y)){const ship=add(s,fleet[i],1,x,y);ship.entrenched=false;}
 }
}
if(['hold','seize','capture','defense'].includes(m.type)){const guarded=s.tiles.filter(t=>t.facility&&(t.objective||t.facility==='relay'||t.facility==='factory')&&t.x>w*.35).slice(0,m.type==='defense'?3:2);for(const [i,target] of guarded.entries()){let t=s.tiles.filter(t=>t.terrain!=='void'&&!t.facility&&dist(t,target)>=1&&dist(t,target)<=3&&passable(s,{type:'mg'},t.x,t.y)&&!at(s,t.x,t.y)).sort((a,b)=>dist(a,target)-dist(b,target))[0];if(t){let u=add(s,i%2?'rocket':'mg',1,t.x,t.y);u.entrenched=true;u.sentry=true;}}}
if(m.type==='defense'){for(let i=0;i<3;i++){const x=Math.floor(w*.62)+i,y=mid-4+i*4,t=tile(s,x,y);if(t){t.terrain='road';const u=add(s,i===1?'rocket':'rifle',1,x,y);u.entrenched=true;u.sentry=true;}}}
if(m.type==='protect'||m.type==='convoy'){const u=add(s,'apc',0,3,mid);u.courier=true;u.protected=m.type==='protect';if(u.protected)u.moved=u.fired=true;}
initializeSpecial(s);
if(m.biome==='mountain')s.tiles.forEach(t=>{t.elevation=groundHeight(s,t.x,t.y);});
log(s,'Place your force. '+s.credits+' initial supply; captured positions grant reserves and command capacity.');
return s;
}

function safeSpawn(s,type,team,x,y,traits={}){
 const t=tile(s,x,y);if(!t||!passable(s,{type},x,y)||at(s,x,y))return null;
 const u=add(s,type,team,x,y);Object.assign(u,traits);return u;
}
function initializeSpecial(s){
 const m=s.mission,mid=Math.floor(s.h/2),w=s.w;
 if(m.type==='escort'){
   s.escortNoReinforce=true;
   // Six closely spaced starting positions, all on the paved approach.
   s.pads.filter(p=>p.kind==='land').forEach(p=>{const t=tile(s,p.x,p.y);if(t)t.pad=false;});s.pads=s.pads.filter(p=>p.kind==='sea');
   for(let x=2;x<=7;x++){const y=mid+1,t=tile(s,x,y);t.terrain='road';t.pad=true;s.pads.push({x,y,kind:'land'});}
   const t=tile(s,3,mid);t.terrain='road';
   const courier=s.units.find(u=>u.courier)||safeSpawn(s,'apc',0,3,mid);
   courier.courier=true;courier.protected=true;courier.moved=courier.fired=true;
   s.convoyRoute=[];for(let x=3;x<=w-3;x++)s.convoyRoute.push({x,y:mid});for(let y=mid+1;y<=mid+4;y++)s.convoyRoute.push({x:w-3,y});
   s.escortProgress=0;s.escortAmbushes=0;
   for(const pos of s.convoyRoute){const road=tile(s,pos.x,pos.y);if(road&&road.terrain!=='water'){road.terrain='road';road.path=false;}}
   s.extraction={x:w-3,y:mid+4};
 }
 if(m.type==='battery'||m.type==='counterbattery'){
   s.batteryIDs=[];s.warningZones=[];s.batteryWave=0;
   for(let i=0;i<4;i++){
     const target={x:m.type==='battery'?w-4-(i%2)*3:3+(i%2)*2,y:mid-6+Math.floor(i/2)*11};
     const candidates=s.tiles.filter(t=>t.terrain!=='void'&&t.terrain!=='water'&&!t.facility&&!t.pad&&!at(s,t.x,t.y)&&
       (m.type==='battery'?t.x>=w-10:t.x<=8)&&t.y>=2&&t.y<s.h-2);
     candidates.sort((a,b)=>dist(a,target)-dist(b,target)||a.x-b.x||a.y-b.y);
     const t=candidates[0];if(!t)continue;t.terrain='road';t.path=false;
     // Heavy ground emplacements are static but retain attack actions.
     const u=safeSpawn(s,'mlrs__4',m.type==='battery'?1:0,t.x,t.y,{battery:true,anchored:true,entrenched:true,sentry:true});
     if(u){u.maxHp=Math.round(u.maxHp*1.5);u.hp=u.maxHp;s.batteryIDs.push(u.id);}
   }
 }
 if(m.type==='breach'){
   s.strongpointIDs=[];
   for(let i=0;i<3;i++){
     const x=Math.floor(w*.47)+i*3,y=mid+(i-1)*4,t=tile(s,x,y);
     t.terrain='road';t.path=false;
     const u=safeSpawn(s,i===2?'heavy':'td',1,x,y,{strongpoint:true,anchored:true,entrenched:true,sentry:true});
     if(u){u.maxHp=Math.round(u.maxHp*1.35);u.hp=u.maxHp;s.strongpointIDs.push(u.id);}
     for(let j=0;j<2;j++){const px=x-1+(j%2)*2,py=y+1,pt=tile(s,px,py);if(pt&&pt.terrain!=='void'&&!pt.facility&&pt.terrain!=='water'){pt.terrain='road';safeSpawn(s,j?'rocket':'mg',1,px,py,{entrenched:true,sentry:true});}}
   }
 }
 if(m.type==='intercept'){
   const y=s.h-3,x=w-4,t=tile(s,x,y);t.terrain='water';
   const flagship=safeSpawn(s,'carrier',1,x,y,{flagship:true,escape:true});
   if(flagship){flagship.maxHp=Math.round(flagship.maxHp*1.6);flagship.hp=flagship.maxHp;flagship.bridgeArmor=true;s.flagshipId=flagship.id;}
 }
}
function batteryWarnings(s){
 if(s.mission.type!=='battery')return;
 const guns=alive(s,1).filter(u=>u.battery);
 // Precision only for targets the Meridian team can actually see.
 const targets=alive(s,0).filter(u=>!u.carried&&(!u.courier||!u.protected)&&visibleTo(s,u,1));
 s.warningZones=[];
 for(let i=0;i<guns.length;i++){
  let x,y;
  if(targets.length){
   const rank=targets.slice().sort((a,b)=>{
    const score=v=>(v.courier?100:0)+(D[v.type].branch==='Armor'?20:0)+targets.filter(k=>dist(k,v)===1).length*24;
    return score(b)-score(a)||a.id-b.id;
   });
   const target=rank[(i+s.turn)%rank.length];x=target.x;y=target.y;
  }else{
   // Scheduled area-denial fire on public road approaches, NOT tracking hidden units.
   x=Math.max(4,Math.min(s.w-7,4+(s.turn*2+i*5)%Math.max(8,s.w-11)));
   y=Math.max(3,Math.min(s.h-4,Math.floor(s.h/2)+[-4,-1,2,4][i%4]));
  }
  s.warningZones.push({batteryId:guns[i].id,x,y,turn:s.turn+1,spotted:targets.length>0});
 }
 if(s.warningZones.length)log(s,s.warningZones.length+' enemy batteries acquiring '+(targets.length?'VISIBLE targets':'road approaches')+' — move out of the RED STRIKE ZONES!');
}
function batteryStrike(s){
 if(s.mission.type!=='battery'||!s.warningZones?.length)return;
 for(const z of s.warningZones){
  const gun=s.units.find(v=>v.id===z.batteryId&&v.hp>0);if(!gun)continue;
  const impact=[[0,0],[1,0],[-1,0],[0,1],[0,-1]];
  for(const [dx,dy] of impact){
   const p={x:z.x+dx,y:z.y+dy},t=tile(s,p.x,p.y);if(!t)continue;
   const victim=t.terrain==='void'?null:at(s,p.x,p.y);
   const amount=victim?Math.max(8,Math.round((dx===0&&dy===0?39:24))):0;
   const before=victim?.hp;
   if(victim)hurt(s,victim,amount);
   s.events.push({kind:'attack',from:{x:gun.x,y:gun.y},to:p,damage:amount,id:victim?.id,sourceType:gun.type,targetType:victim?.type,explosive:true,destroyed:!!(before>0&&victim.hp===0)});
  }
 }
 s.warningZones=[];log(s,'MERIDIAN ARTILLERY: saturation strike landed!');
}
function specialWave(s){
 if(s.mission.type!=='counterbattery'&&s.mission.type!=='escort'&&s.mission.type!=='breach')return;
 const n=s.mission.type==='counterbattery'?5:s.mission.type==='escort'?4:3;
 const trigger=s.mission.type==='counterbattery'?s.turn%2===0:s.mission.type==='escort'?s.turn%3===0:s.turn%3===0;
 if(!trigger||s.batteryWave>=n)return;
 s.batteryWave=(s.batteryWave||0)+1;
 const mid=Math.floor(s.h/2),size=s.mission.type==='counterbattery'?5+s.batteryWave:s.mission.type==='escort'?3+s.batteryWave:3+s.batteryWave;
 const pool=s.batteryWave>=3?['rifle','rocket','light','td','mg','heavy']:['rifle','rocket','scout','light','mg','grenadier'];
 let count=0;
 for(let j=0;j<size;j++){
  const x=s.mission.type==='escort'?Math.min(s.w-5,Math.floor(s.w*.45)+s.batteryWave*2):s.w-5-Math.floor(j/3)*2;
  const y=Math.max(2,Math.min(s.h-3,mid-6+(j%6)*2));
  const t=tile(s,x,y),type=pool[(j+s.batteryWave)%pool.length];if(!t||t.facility||at(s,x,y)||t.terrain==='water')continue;
  if(!passable(s,{type},x,y)){t.terrain='road';}
  const u=safeSpawn(s,type,1,x,y,{assault:true});if(u){count++;u.sentry=false;u.entrenched=false;}
 }
 log(s,'INCOMING ASSAULT '+s.batteryWave+'/'+n+': '+count+' enemy units — protect your assets!');
}
function advanceConvoy(s){
 if(s.mission.type!=='escort')return;
 const courier=s.units.find(u=>u.courier&&u.hp>0);if(!courier)return;
 let steps=0;
 while(steps<2&&s.escortProgress<s.convoyRoute.length-1){
  const pos=s.convoyRoute[s.escortProgress+1],occupant=at(s,pos.x,pos.y);
  if(occupant&&occupant!==courier)break;
  const danger=alive(s,1).some(u=>dist(u,courier)<=2);
  if(danger&&steps>0)break;
  const old={x:courier.x,y:courier.y};courier.x=pos.x;courier.y=pos.y;s.escortProgress++;steps++;
  s.events.push({kind:'move',id:courier.id,from:old,to:{...pos},path:[{...pos}]});
 }
 if(steps)log(s,'Convoy advanced '+steps+' tile(s). '+(s.convoyRoute.length-1-s.escortProgress)+' remaining.');
 else log(s,'Convoy halted — clear the road and protect the route!');
}
function launch(s){if(s.phase!=='deployment'||!alive(s,0).some(u=>!u.courier))return false;s.phase='combat';if(s.mission.type==='battery')batteryWarnings(s);log(s,objectiveNames[s.mission.type]+'. '+(s.mission.subtitle||'Hold facilities to build supply and command capacity.'));return true;}
function tile(s,x,y){return x>=0&&y>=0&&x<s.w&&y<s.h?s.tiles[y*s.w+x]:null;}

function at(s,x,y){return s.units.find(u=>u.hp>0&&!u.carried&&u.x===x&&u.y===y);}
function add(s,type,team,x,y){let d=D[type],health=team===0?d.hp+(s.upgrades[type]||0)*8:d.hp;let u={id:s.nextId++,type,team,x,y,hp:health,maxHp:health,landed:false,disabled:false,moved:false,fired:false,guard:false,xp:0,weapon:0,ammo:d.weapons.map(w=>w.capacity),used:d.weapons.map(()=>false),reserve:1,serviceUsed:Array(d.serviceSlots).fill(false),pressure:0,pinnedUntil:-1,watchSpentTurn:-1};s.units.push(u);return u;}
// v10 front-line doctrine: fire can win ground without immediately destroying a squad.
// Pressure (0..100) is intentionally not a second HP bar. Ships/aircraft are exempt.
function pinned(s,u){return !!u&&D[u.type]?.branch!=='Navy'&&D[u.type]?.branch!=='Air'&&(u.pinnedUntil??-1)>=s.turn;}
function pressureHit(s,a,b,damageAmount,extra=0){
 if(!b||b.hp<=0||['Navy','Air'].includes(D[b.type].branch))return false;
 const attacker=a&&D[a.type],victim=D[b.type],old=b.pressure||0;
 const rounds=Math.max(5,Math.round(64*damageAmount/b.maxHp)),
  suppressor=attacker&&(['mg','quadflak','flak'].includes(attacker.family)||has(a,'suppress'))?18:0,
  blast=attacker&&(has(a,'splash')||has(a,'indirect'))?9:0,
  command=alive(s,b.team).some(v=>v.hp>0&&has(v,'command')&&dist(v,b)<=2)?12:0;
 const gain=Math.max(4,Math.round((rounds+suppressor+blast+extra)*(victim.branch==='Armor'?.62:1))-
    (b.entrenched?7:0)-command);
 b.pressure=Math.min(100,old+gain);
 if(b.pressure>=60){
  // Broken, isolated infantry can surrender instead of magically fighting to
  // the last hit point. Nearby allies and command vehicles prevent routs.
  if(b.pressure>=95&&b.hp<=b.maxHp*.45&&victim.branch==='Infantry'&&
     !alive(s,b.team).some(v=>v.id!==b.id&&!v.carried&&dist(v,b)<=2)){
   b.surrendered=true;log(s,D[b.type].name+' SURRENDERED: isolated under sustained fire.');
   hurt(s,b,b.hp);return true;
  }
  const wasPinned=pinned(s,b);
  b.pinnedUntil=Math.max(b.pinnedUntil??-1,s.turn+(b.team===0&&s.side===1?1:0));
  b.entrenched=false;
  if(!wasPinned)log(s,D[b.type].name+' PINNED by incoming fire. Reposition and capture disabled next activation.');
  return !wasPinned;
 }
 return false;
}
function setOverwatch(s,u){
 if(!u||s.phase!=='combat'||s.result||s.side!==u.team||u.hp<=0||u.carried||
    u.landed||u.fired||pinned(s,u)||['Navy','Air'].includes(D[u.type].branch)||
    has(u,'indirect')||!(u.ammo||[]).some((n,i)=>n>0&&!u.used[i]))return false;
 u.guard=true;u.entrenched=true;u.moved=true;u.fired=true;
 log(s,D[u.type].name+' covering the approach. First hostile movement in range triggers a reaction shot.');
 return true;
}
// Interrupt movement at waypoints, never via omniscient attacks through fog or stone.
// Each guard or sentry gets one reaction per enemy turn; two guards can interrupt one route.
function reactionFire(s,mover){
 let count=0;
 const guards=alive(s,1-mover.team).filter(u=>!u.carried&&!u.landed&&!pinned(s,u)&&
  (u.guard||u.sentry&&u.entrenched&&!u.fired)&&u.watchSpentTurn!==s.turn&&
  D[u.type].branch!=='Navy'&&D[u.type].branch!=='Air'&&!has(u,'indirect'));
 for(const guard of guards){
  if(mover.hp<=0||pinned(s,mover)||count>=2)break;
  let best=null,old=guard.weapon||0;
  for(let i=0;i<D[guard.type].weapons.length;i++){
   if(guard.used[i]||guard.ammo[i]<=0)continue;
   guard.weapon=i;
   if(canAttack(s,guard,mover,true)){
    const score=damage(s,guard,mover)+(has(guard,'antiArmor')&&D[mover.type].branch==='Armor'?10:0);
    if(!best||score>best.score)best={i,score};
   }
  }
  guard.weapon=old;
  if(!best)continue;
  guard.weapon=best.i;
  const before=mover.hp,damageAmount=Math.max(3,Math.round(damage(s,guard,mover)*.68));
  hurt(s,mover,damageAmount);
  pressureHit(s,guard,mover,damageAmount,12);
  guard.ammo[best.i]--;guard.used[best.i]=true;guard.watchSpentTurn=s.turn;guard.guard=false;
  guard.fired=true;
  s.events.push({kind:'counter',from:{x:guard.x,y:guard.y},to:{x:mover.x,y:mover.y},damage:damageAmount,
   id:mover.id,sourceType:guard.type,targetType:mover.type,explosive:isExplosiveShot(guard),destroyed:before>0&&mover.hp===0,overwatch:true});
  log(s,D[guard.type].name+' AMBUSH: interrupted '+D[mover.type].name+' at '+mover.x+','+mover.y+'.');
  count++;
 }
 return count;
}
function passable(s,u,x,y){const t=tile(s,x,y);if(!t||t.terrain==='void')return false;if(D[u.type].branch==='Air')return true;if(t.terrain==='mountain')return false;return D[u.type].branch==='Navy'?t.terrain==='water':t.terrain!=='water'||has(u,'amphibious');}

function step(s,u,x,y,fromX=u.x,fromY=u.y){
 const t=tile(s,x,y),branch=D[u.type].branch;
 if(branch==='Air'||branch==='Navy')return 1;
 const base=['forest','hill','ruins','dune','water'].includes(t.terrain)?2:1;
 if(s.mission.biome!=='mountain')return base;
 const rise=elevation(s,t)-elevation(s,tile(s,fromX,fromY));
 const paved=['road','bridge'].includes(t.terrain)&&['road','bridge'].includes(tile(s,fromX,fromY)?.terrain);
 return base+(rise>.42&&!paved?1:0)+(rise>1.15&&branch==='Armor'?1:0);
}
function reach(s,u){let map=new Map();if(s.phase==='deployment'||u.anchored||u.protected||u.disabled||u.landed||pinned(s,u)||((u.moved||u.fired)&&u.evadeMove!==s.turn)||u.carried||u.hp<=0)return map;let max=moveBudget(s,u),open=[{x:u.x,y:u.y,cost:0,path:[]}];map.set(u.x+','+u.y,open[0]);while(open.length){open.sort((a,b)=>a.cost-b.cost);let p=open.shift();for(const [dx,dy]of [[1,0],[-1,0],[0,1],[0,-1]]){let x=p.x+dx,y=p.y+dy,k=x+','+y;if(!passable(s,u,x,y)||at(s,x,y)&&at(s,x,y)!==u)continue;let cost=p.cost+step(s,u,x,y,p.x,p.y);if(cost>max||map.has(k)&&map.get(k).cost<=cost)continue;let next={x,y,cost,path:[...p.path,{x,y}]};map.set(k,next);open.push(next);}}map.delete(u.x+','+u.y);return map;}
function move(s,u,x,y){
 if(s.phase==='deployment'||s.result||s.side!==u.team||u.anchored)return false;
 const p=reach(s,u).get(x+','+y);if(!p)return false;
 const from={x:u.x,y:u.y},travel=[],event={kind:'move',id:u.id,from,to:{x,y},path:travel};
 s.events.push(event);
 u.moved=true;u.repositionedTurn=s.turn;u.guard=false;u.entrenched=false;u.evadeMove=null;
 for(const point of p.path){
  u.x=point.x;u.y=point.y;travel.push({x:u.x,y:u.y});
  reactionFire(s,u);
  if(u.hp<=0||pinned(s,u))break;
 }
 event.to={x:u.x,y:u.y};check(s);return true;
}
// Long-range indirect shells need a real team observer rather than global
// omniscient targeting. Nearby infantry/recon and active radios can relay a target.
function spottingLink(s,a,b){
 if(!has(a,'indirect')||D[a.type].branch==='Navy'||a.battery)return true;
 if(sight(s,a,b))return true;
 return alive(s,a.team).some(v=>v.id!==a.id&&!v.carried&&v.hp>0&&
  (D[v.type].branch==='Infantry'||has(v,'recon')||has(v,'radar')||has(v,'command'))&&
  sight(s,v,b));
}
function canAttack(s,a,b,retaliate=false){if(s.phase==='deployment'||!a||!b||a.landed||!visibleTo(s,b,a.team)||a.hp<=0||b.hp<=0||a.carried||b.carried||a.team===b.team||pinned(s,a)||(!retaliate&&!canFire(a))||a.ammo[a.weapon||0]<=0||!spottingLink(s,a,b))return false;let d=dist(a,b),def=weapon(a);if(has(a,'antiShip')&&D[b.type].branch!=='Navy')return false;if(D[b.type].branch==='Air'&&!b.landed&&!has(a,'antiAir')&&D[a.type].branch!=='Air'&&!['rifle','mg'].includes(D[a.type].family))return false;return (has(a,'indirect')||lineOfSight(s,a,b))&&d<=(a.battery?13:def.range)+(a.rangeBoostTurn===s.turn?2:0)+(tile(s,a.x,a.y)?.terrain==='hill'?1:0)+rangeElevation(s,a,b)&&d>=(has(a,'indirect')?2:1)&&(!has(a,'indirect')||a.battery||D[a.type].branch==='Navy'||a.repositionedTurn!==s.turn||a.setupTurn===s.turn);}
function fleetEscort(s,b){
 if(!b.flagship||D[b.type].branch!=='Navy')return null;
 return alive(s,b.team).find(v=>v.id!==b.id&&!v.carried&&D[v.type].branch==='Navy'&&dist(v,b)<=4);
}
function navalFireControl(s,a,b){
 if(a.team!==1||D[a.type].branch!=='Navy'||D[b.type].branch!=='Navy')return false;
 // Enemy fleet commanders achieve tighter salvos only when another SHIP spots
 // the same target and stays close enough to share fire-control data.
 return alive(s,1).some(v=>v.id!==a.id&&D[v.type].branch==='Navy'&&!v.carried&&
   dist(v,a)<=5&&sight(s,v,b));
}
function damage(s,a,b){let ad=D[a.type],bd=D[b.type],power=weapon(a).power+(a.torpedoTurn===s.turn&&bd.branch==='Navy'?32:0)+(a.focusTurn===s.turn?10:0)-(a.suppressedUntil>=s.turn?8:0)+(alive(s,a.team).some(v=>!v.carried&&has(v,'command')&&dist(a,v)<=2)?5:0),mult=.65+.35*a.hp/a.maxHp;if(has(a,'antiArmor')&&bd.branch==='Armor')mult*=1.4;if(has(a,'antiInf')&&bd.branch==='Infantry')mult*=1.4;if(has(a,'antiAir')&&bd.branch==='Air')mult*=1.55;if(D[a.type].family==='fighter'&&bd.branch!=='Air')mult*=.45;if(b.landed)mult*=1.35;if(bd.branch==='Air'&&ad.branch==='Infantry'&&!b.landed)mult*=.4;if((a.pressure||0)>=35&&ad.branch!=='Navy'&&ad.branch!=='Air')mult*=.86;
if(ad.branch==='Navy'&&(bd.branch==='Armor'||bd.branch==='Infantry'))mult*=.84;
if(navalFireControl(s,a,b))mult*=1.10;
if(fleetEscort(s,b))mult*=.76;
let cover=bd.branch==='Air'?0:({forest:9,hill:6,ruins:12}[tile(s,b.x,b.y).terrain]||0);if(b.smokeUntil>=s.turn)cover+=18;if(b.entrenched)cover+=8;return Math.max(5,Math.round(power*mult+(a.team===0?(s.upgrades[a.type]||0)*2:0)+Math.min(a.xp,3)*2-bd.armor*.65-cover));}
function hurt(s,u,n){u.hp=Math.max(0,u.hp-n);if(u.hp>0&&u.hp/u.maxHp<=.45&&n>=12&&D[u.type].branch!=='Infantry'&&D[u.type].branch!=='Air'){u.disabled=true;log(s,D[u.type].name+': '+(D[u.type].branch==='Navy'?'propulsion disabled':'running gear disabled')+'. Supply repair needed.');}if(!u.hp){if(u.team===1){s.kills++;if(s.side===0&&s.phase==='combat'){
   s.lastKillTurn=s.turn;s.killsThisTurn=(s.killsThisTurn||0)+1;
   if((s.momentumRewards||0)<2){s.momentumRewards=(s.momentumRewards||0)+1;if(!s.operator)s.credits=Math.min(24,s.credits+1);log(s,'MOMENTUM +1 supply: battlefield takedown secured.');}
 }}else s.losses++;if(u.cargo){let c=s.units.find(v=>v.id===u.cargo);if(c&&c.hp>0){c.hp=0;if(c.team===0)s.losses++;}}}}
function isExplosiveShot(u){return has(u,'splash')||has(u,'indirect')||D[u.type].branch==='Navy'||weapon(u).power>=40&&['Armor','Air'].includes(D[u.type].branch)||D[u.type].branch==='Infantry'&&has(u,'antiArmor');}
function attack(s,a,b){
 if(s.result||s.side!==a.team||!canAttack(s,a,b))return false;
 const bombard=a.battery||a.bombardTurn===s.turn,point={x:b.x,y:b.y},n=damage(s,a,b),initial=b.hp;
 hurt(s,b,n);pressureHit(s,a,b,n);a.focusTurn=null;a.torpedoTurn=null;a.bombardTurn=null;
 if(a.suppressTurn===s.turn){b.suppressedUntil=s.turn+(a.team===1?1:0);a.suppressTurn=null;}
 a.shotRound=s.turn;a.ammo[a.weapon||0]--;a.used[a.weapon||0]=true;a.fired=a.used.every((used,i)=>used||a.ammo[i]===0);
 a.moved=true;a.guard=false;a.evadeMove=a.harassTurn===s.turn?s.turn:null;a.harassTurn=null;a.xp+=initial>0&&b.hp===0?1:0;
 s.events.push({kind:'attack',from:{x:a.x,y:a.y},to:point,damage:n,id:b.id,sourceType:a.type,targetType:b.type,explosive:bombard||isExplosiveShot(a),destroyed:initial>0&&b.hp===0});
 if(bombard){
  let friendlies=0;
  for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){
   const impact={x:point.x+dx,y:point.y+dy},cell=tile(s,impact.x,impact.y);
   if(!cell)continue;
   const v=cell.terrain==='void'?null:at(s,impact.x,impact.y),dmg=v&&v.hp>0&&!v.carried?Math.max(5,Math.round(damage(s,a,v)*.65)):0;
   const before=v?.hp;
   if(v&&dmg){if(v.team===a.team)friendlies++;hurt(s,v,dmg);pressureHit(s,a,v,dmg);if(before>0&&v.hp===0&&v.team!==a.team)a.xp++;}
   s.events.push({kind:'attack',from:{x:a.x,y:a.y},to:impact,damage:dmg,id:v?.id,sourceType:a.type,targetType:v?.type,explosive:true,destroyed:!!(before>0&&v.hp===0)});
  }
  log(s,D[a.type].name+' fired FIVE-shell bombardment at '+D[b.type].name+'; '+(friendlies?'FRIENDLY FIRE '+friendlies+' vessel(s)/unit(s).':'impact pattern clear of allies.'));
 }else{
  log(s,D[a.type].name+' hit '+D[b.type].name+' for '+n+'.');
  if(has(a,'splash'))s.units.filter(v=>v.id!==b.id&&v.hp>0&&!v.carried&&dist(v,b)===1).forEach(v=>{const d=Math.round(n*.3);hurt(s,v,d);pressureHit(s,a,v,d);});
 }
 // Counterfire is earned by deliberately setting an ambush / overwatch instead of
 // automatically receiving a free shot every time any unit is attacked.
 check(s);return true;
}
function capture(s,u){if(s.phase==='deployment'||s.result||u.hp<=0||s.side!==u.team||u.fired||u.carried||pinned(s,u)||!has(u,'capture'))return false;let t=tile(s,u.x,u.y);if(!t.facility||t.owner===u.team)return false;t.owner=u.team;u.fired=true;u.moved=true;u.entrenched=true;const reward=t.facility==='factory'?3:t.facility==='town'?2:1;if(u.team===0)s.credits=Math.min(s.operator?999:24,s.credits+reward);else s.enemyCredits=Math.min(24,s.enemyCredits+reward);if(u.team===0&&t.facility!=='hq'){s.lastCaptureTurn=s.turn;s.alerts=(s.alerts||0)+1;s.lastCapture={x:t.x,y:t.y};}log(s,D[u.type].name+' captured '+t.facility+' (+'+reward+' supply; command cap '+capacity(s,u.team)+').');s.events.push({kind:'capture',to:{x:t.x,y:t.y},team:u.team});check(s);return true;}
function support(s,a,b,slot=0){const d=D[a.type];if(s.phase==='deployment'||s.result||s.side!==a.team||a.landed||a.fired||a.hp<=0||a.team!==b.team||dist(a,b)<1||dist(a,b)>d.serviceRange||a.carried||b.carried||b.hp<=0||!Number.isInteger(slot)||slot<0||slot>=d.serviceSlots)return false;
a.serviceUsed=a.serviceUsed||Array(d.serviceSlots).fill(false);if(a.serviceUsed[slot])return false;
const truck=has(a,'resupply'),heal=has(a,'heal')&&D[b.type].branch==='Infantry';
if(!truck&&!heal||D[b.type].branch==='Air'&&!b.landed)return false;
const needsAmmo=b.ammo.some((n,i)=>n<D[b.type].weapons[i].capacity)||b.reserve<1;
if(b.hp>=b.maxHp&&!b.disabled&&(!truck||!needsAmmo)||truck&&a.team===0&&s.credits<1)return false;
b.hp=Math.min(b.maxHp,b.hp+d.serviceHP);b.pressure=Math.max(0,(b.pressure||0)-35);if(truck){b.disabled=false;b.ammo=D[b.type].weapons.map(w=>w.capacity);b.reserve=1;if(a.team===0)s.credits--;}
a.serviceUsed[slot]=true;a.used=D[a.type].weapons.map(()=>true);a.moved=true;a.fired=a.serviceUsed.every(Boolean);log(s,D[b.type].name+' serviced.');return true;}
function smoke(s,a,b){if(s.phase==='deployment'||a.landed||s.result||s.side!==a.team||!has(a,'smoke')||a.fired||a.hp<=0||a.carried||b.carried||b.hp<=0||a.team!==b.team||dist(a,b)>3||s.credits<1)return false;b.smokeUntil=s.turn;a.fired=a.moved=true;s.credits--;return true;}
function baseService(s,h,b){if(s.result||s.side!==0||!s.tiles.includes(h)||h.facility!=='hq'||h.owner!==0||!b||b.team!==0||b.hp<=0||b.carried||dist(h,b)>1)return false;
if(D[b.type].branch==='Air'&&!b.landed)return false;b.disabled=false;b.hp=b.maxHp;b.ammo=D[b.type].weapons.map(w=>w.capacity);b.reserve=1;log(s,D[b.type].name+' fully resupplied at HQ.');return true;}
function recruitError(s,type,h){if(s.result||s.side!==0)return 'Wait for your turn.';if(!h||!s.tiles.includes(h)||h.owner!==0||!['hq','factory','town'].includes(h.facility))return 'Select a friendly HQ or captured outpost.';
if(h.facility!=='hq'&&(s.phase==='deployment'||!['Infantry','Armor'].includes(D[type]?.branch)))
 return 'Forward outposts deploy land forces only during combat.';
if(h.facility!=='hq'&&alive(s,1).some(u=>!u.carried&&dist(u,h)<=2))return 'Forward outpost under threat. Clear enemy units within 2 tiles.';
if(!D[type]||!s.deck?.includes(type))return 'Only your selected deck can deploy.';
if(s.mission.type==='escort'&&s.phase!=='deployment')return 'Convoy mission: no new reinforcements after deployment.';if(s.credits<D[type].cost)return 'Need '+D[type].cost+' supply.';
if(alive(s,0).filter(u=>!u.courier).length>=capacity(s,0))return 'Command capacity reached ('+capacity(s,0)+'). Capture facilities to expand it.';
if(!spawnTile(s,type,h))return 'All suitable deployment pads are occupied.';return '';}
function legalSpawn(s,type,h,t){
 if(!t||at(s,t.x,t.y)||!passable(s,{type},t.x,t.y))return false;
 if(h.facility==='hq')return s.pads.some(p=>p.x===t.x&&p.y===t.y&&
  (D[type].branch==='Navy'?p.kind==='sea':p.kind==='land'));
 return ['factory','town'].includes(h.facility)&&dist(t,h)===1&&!t.facility&&!t.pad&&
  ['Infantry','Armor'].includes(D[type].branch);
}
function spawnTile(s,type,h){
 if(h.facility==='hq')return(s.pads||[]).find(t=>legalSpawn(s,type,h,t));
 return [[-1,0],[0,-1],[0,1],[1,0]].map(([dx,dy])=>tile(s,h.x+dx,h.y+dy))
  .find(t=>legalSpawn(s,type,h,t));
}
function load(s,a,b){if(s.phase==='deployment'||a.hp<=0||b.hp<=0||D[a.type].branch==='Air'&&!a.landed||s.result||s.side!==a.team||!has(a,'transport')||a.cargo||a.fired||a.team!==b.team||D[b.type].branch!=='Infantry'||dist(a,b)!==1||b.carried)return false;a.cargo=b.id;b.carried=a.id;a.fired=true;a.moved=true;b.moved=b.fired=true;return true;}
function unload(s,a,x,y,airdrop=false){let b=s.units.find(v=>v.id===a.cargo);if(s.phase==='deployment'||a.hp<=0||D[a.type].branch==='Air'&&!a.landed&&!airdrop||s.result||s.side!==a.team||!b||a.fired||dist(a,{x,y})!==1||at(s,x,y)||!passable(s,b,x,y))return false;b.carried=null;b.x=x;b.y=y;b.moved=b.fired=true;a.cargo=null;a.fired=true;check(s);return true;}
function recruit(s,type,h=s.tiles.find(t=>t.facility==='hq'&&t.owner===0),chosen){if(recruitError(s,type,h))return false;const t=chosen||spawnTile(s,type,h);if(!legalSpawn(s,type,h,t))return false;
const u=add(s,type,0,t.x,t.y);if(!s.operator)s.credits-=D[type].cost;if(s.phase!=='deployment'){u.readyTurn=s.turn+1;u.moved=u.fired=true;u.used=D[type].weapons.map(()=>true);u.serviceUsed=Array(D[type].serviceSlots).fill(true);}return u;}
function withdraw(s,u){if(s.phase!=='deployment'||s.side!==0||s.result||!u||!s.units.includes(u)||u.team!==0||u.courier||u.carried||u.cargo||u.hp<=0)return false;s.units.splice(s.units.indexOf(u),1);if(!s.operator)s.credits+=D[u.type].cost;return true;}
function forecast(s,a,b){if(!canAttack(s,a,b)||s.result||s.side!==a.team)return null;const hit=damage(s,a,b),remaining=Math.max(0,b.hp-hit),after={...b,hp:remaining};let counter=0;const shell=a.battery||a.bombardTurn===s.turn;
 const splash=(shell||has(a,'splash'))?s.units.filter(v=>v.hp>0&&!v.carried&&v.id!==b.id&&dist(v,b)===1&&visibleTo(s,v,a.team)).map(v=>({id:v.id,friendly:v.team===a.team,damage:Math.min(v.hp,shell?Math.max(5,Math.round(damage(s,a,v)*.65)):Math.round(hit*.3))})):[];return {damage:Math.min(b.hp,hit),remaining,counter,kill:remaining===0,splash};}
function flight(s,u){if(!u||D[u.type].branch!=='Air'||s.phase==='deployment'||s.result||s.side!==u.team||u.fired||u.carried)return false;const t=tile(s,u.x,u.y);if(!u.landed&&['water','mountain','forest','void'].includes(t.terrain))return false;u.landed=!u.landed;u.moved=u.fired=true;u.used.fill(true);log(s,D[u.type].name+(u.landed?' landed. Ground service available.':' airborne. Ready next round.'));return true;}

function alive(s,team){return s.units.filter(u=>u.hp>0&&u.team===team);}
function log(s,text){s.log.unshift({turn:s.turn,text});s.log=s.log.slice(0,60);}
function check(s){if(s.result||s.phase==='deployment')return s.result;let m=s.mission,home=tile(s,s.home.x,s.home.y),enemy=tile(s,s.enemyHome.x,s.enemyHome.y),win=false,lose=home.owner===1;
if(m.type==='capture')win=enemy.owner===0;
if(m.type==='eliminate')win=alive(s,1).length===0;
if(m.type==='hold')win=s.hold>=4;
if(m.type==='defense')win=(s.waves||0)>=3&&s.turn>=12&&alive(s,1).length===0;
if(m.type==='battery')win=s.batteryIDs?.every(id=>!s.units.some(u=>u.id===id&&u.hp>0));
if(m.type==='counterbattery'){const guns=alive(s,0).filter(u=>u.battery);lose=lose||guns.length<2;win=(s.batteryWave||0)>=5&&s.turn>=15&&guns.length>=2;}
if(m.type==='breach')win=s.strongpointIDs?.every(id=>!s.units.some(u=>u.id===id&&u.hp>0));
if(m.type==='escort'){const escort=s.units.find(u=>u.courier);lose=lose||!escort||escort.hp<=0;win=!!escort&&escort.hp>0&&dist(escort,s.extraction)===0;}
if(m.type==='intercept'){const flag=s.units.find(u=>u.id===s.flagshipId);win=!flag||flag.hp<=0;lose=lose||!!flag&&flag.hp>0&&(flag.x<=4||s.turn>=16);}
if(m.type==='seize')win=s.seized>=2;
if(m.type==='strike')win=!s.units.some(u=>u.command&&u.hp>0);
if(m.type==='convoy'||m.type==='protect'){let c=s.units.find(u=>u.courier);if(!c||c.hp<=0)lose=true;else win=m.type==='convoy'?dist(c,s.extraction)===0:s.turn>=11;}
const cheapest=Math.min(...s.deck.map(id=>D[id].cost));if(!alive(s,0).some(u=>!u.courier)&&s.credits<cheapest)lose=true;
if((s.emptyRounds||0)>=3)lose=true;
 if(s.turn>60)lose=true;
if(lose||win){s.result=lose?'defeat':'victory';log(s,lose?'Operation failed.':'Objective secured.');}return s.result;}
function resetUnit(u){u.moved=u.fired=!!u.protected;u.guard=false;u.pressure=Math.max(0,(u.pressure||0)-23);u.used=D[u.type].weapons.map(()=>false);u.serviceUsed=Array(D[u.type].serviceSlots).fill(false);}
function beginEnemy(s){if(s.phase==='deployment'||s.result||s.side!==0)return false;s.side=1;alive(s,1).forEach(resetUnit);batteryStrike(s);commandIntel(s);return true;}
function lineOfSight(s,a,b){
 const n=Math.max(Math.abs(a.x-b.x),Math.abs(a.y-b.y));
 const aH=elevation(s,tile(s,a.x,a.y))+.9,bH=elevation(s,tile(s,b.x,b.y))+.9;
 for(let i=1;i<n;i++){
  const x=a.x+(b.x-a.x)*i/n,y=a.y+(b.y-a.y)*i/n,t=tile(s,Math.round(x),Math.round(y));
  if(!t||t.terrain==='void'||t.terrain==='mountain')return false;
  if(s.mission.biome==='mountain'&&groundHeight(s,x,y)>.85+aH+(bH-aH)*i/n)return false;
 }return true;
}
function sight(s,a,b){let range=a.scanTurn===s.turn?(D[a.type].branch==='Navy'?13:8):D[a.type].branch==='Navy'?(has(a,'radar')?12:has(a,'recon')?11:9):has(a,'radar')?7:has(a,'recon')?6:4;if(a.landed)range=2;const t=tile(s,b.x,b.y),concealed=t&&(['forest','ruins'].includes(t.terrain)&&D[b.type]?.branch!=='Air'||D[b.type]?.family==='sub'&&b.submergedUntil>=s.turn);if(concealed&&!has(a,'recon')&&!has(a,'radar')&&a.scanTurn!==s.turn)range=Math.min(range,2);return dist(a,b)<=range&&(a.scanTurn===s.turn||lineOfSight(s,a,b));}
function visibleTo(s,u,team){return u.team===team||alive(s,team).some(a=>!a.carried&&sight(s,a,u))||s.tiles.some(t=>t.owner===team&&t.facility==='relay'&&dist(t,u)<=5&&lineOfSight(s,t,u));}
function visible(s,u){return visibleTo(s,u,0);}
function tileVisible(s,t){return alive(s,0).some(a=>!a.carried&&sight(s,a,t))||s.tiles.some(f=>f.owner===0&&f.facility&&dist(f,t)<=(f.facility==='relay'?5:2)&&lineOfSight(s,f,t));}
function AisTactical(t,s){return t.objective||t.facility==='relay'&&s.mission.type==='hold'||t.facility==='town'||t.facility==='factory';}

// The field director only remembers enemies it has actually spotted; no omniscient targeting.
function commandIntel(s){
 if(s.aiOrders?.turn===s.turn)return s.aiOrders;
 const contacts=Object.assign({},s.aiMemory||{});
 for(const v of alive(s,0))if(!v.carried&&visibleTo(s,v,1)){
  contacts[v.id]={id:v.id,x:v.x,y:v.y,seen:s.turn,type:v.type};
 }
 for(const [id,c] of Object.entries(contacts))if(s.turn-c.seen>2||!alive(s,0).some(v=>v.id===+id))delete contacts[id];
 s.aiMemory=contacts;
 const now=alive(s,0).filter(v=>!v.carried&&visibleTo(s,v,1));
 const highValue=v=>D[v.type].branch==='Navy'?18+(v.type==='carrier'||v.type==='battleship'?22:0):has(v,'resupply')?25:has(v,'capture')?16:has(v,'indirect')?19:8;
 const targets=now.slice().sort((a,b)=>highValue(b)+(1-b.hp/b.maxHp)*34+(b.courier?60:0)-highValue(a)-(1-a.hp/a.maxHp)*34-(a.courier?60:0));
 const orders={turn:s.turn,focus:targets[0]?.id||null,contacts};
 s.aiOrders=orders;return orders;
}
function enemyOrder(s){
 commandIntel(s);
 const priority=u=>{
  if(u.battery)return -50;
  if(u.anchored)return 20;
  const k=D[u.type].ability.kind,branch=D[u.type].branch;
  if(['scan','sonar'].includes(k))return 100;
  if(has(u,'resupply')||has(u,'heal'))return 90;
  if(branch==='Navy'&&['screen','fleetpatch','sortie'].includes(k))return 82;
  if(u.escape)return 80;
  if(has(u,'recon'))return 75;
  if(has(u,'indirect'))return 65;
  if(has(u,'capture'))return 45;
  return 60;
 };
 return alive(s,1).slice().sort((a,b)=>priority(b)-priority(a)||a.id-b.id);
}
function tacticalThreat(s,u,p,targets){
 let danger=0;
 for(const v of targets){
  const w=D[v.type].weapons;
  const range=Math.max(...w.map(k=>k.range));
  const distance=dist(v,p),indirect=has(v,'indirect');
  if(distance>range+1||distance<(indirect?2:1))continue;
  if(!indirect&&!lineOfSight(s,v,p))continue;
  danger+=Math.max(...w.map(k=>k.power))*(distance<=range?1:.25);
 }
 const tileCover=({forest:14,ruins:17,hill:8}[tile(s,p.x,p.y)?.terrain]||0);
 return Math.max(0,danger-tileCover);
}
function attackChoice(s,u,visible,focus){
 let best=null;const old=u.weapon;
 for(let i=0;i<D[u.type].weapons.length;i++){
  if(u.used[i]||u.ammo[i]<=0)continue;
  u.weapon=i;
  for(const v of visible)if(v.hp>0&&canAttack(s,u,v)){
   const n=damage(s,u,v),fatal=n>=v.hp;
   const threat=has(v,'resupply')?26:D[v.type].branch==='Navy'&&D[u.type].branch==='Navy'?52:has(v,'indirect')?20:0;
   const score=Math.min(n,v.hp)*.65+(fatal?80:0)+(v.id===focus?27:0)+threat+(v.courier?90:0)+(v.flagship?80:0);
   if(!best||score>best.score)best={i,target:v,score};
  }
 }
 u.weapon=old;return best;
}
function fireTactically(s,u,focus){
 let fired=false;
 for(let shot=0;shot<D[u.type].weapons.length+3;shot++){
  const visible=alive(s,0).filter(v=>!v.carried&&visibleTo(s,v,1));
  if(u.fired){
    if(['broadside','salvo'].includes(D[u.type].ability.kind)&&visible.length&&!abilityError(s,u))useAbility(s,u);
    else break;
  }
  const choice=attackChoice(s,u,visible,focus);if(!choice)break;
  selectWeapon(u,choice.i);
  const k=D[u.type].ability.kind;
  if(['focus','torpedo','rangefinder','suppress'].includes(k)&&!abilityError(s,u))useAbility(s,u);
  if(k==='bombard'&&!abilityError(s,u)){
   const v=choice.target,adj=alive(s,0).filter(p=>dist(p,v)===1).length,friend=alive(s,1).filter(p=>p.id!==u.id&&dist(p,v)===1).length;
   if(adj>=1&&adj>=friend)useAbility(s,u);
  }
  if(!attack(s,u,choice.target))break;
  fired=true;
  // Coordinate fire to finish the original priority target instead of spreading damage.
  if(choice.target.hp>0)s.aiOrders={...commandIntel(s),turn:s.turn,focus:choice.target.id};
 }
 return fired;
}
function goalFor(s,u,visible,contacts){
 const branch=D[u.type].branch,unit=visible.slice().sort((a,b)=>dist(u,a)-dist(u,b))[0];
 if(branch==='Navy'){
  const ships=visible.filter(v=>D[v.type].branch==='Navy').sort((a,b)=>dist(u,a)-dist(u,b));
  if(ships.length)return ships[0];
  const remembered=Object.values(contacts).filter(v=>D[v.type]?.branch==='Navy').sort((a,b)=>dist(u,a)-dist(u,b))[0];
  return remembered||{x:Math.max(3,Math.floor(s.w*.36)),y:s.h-3};
 }
 if(u.assault&&s.mission.type==='counterbattery'){
  return alive(s,0).filter(v=>v.battery).sort((a,b)=>dist(u,a)-dist(u,b))[0]||s.home;
 }
 if(s.mission.type==='escort'&&s.units.some(v=>v.courier)){
  const courier=s.units.find(v=>v.courier&&v.hp>0);
  if(courier)return courier;
 }
 if(unit&&dist(u,unit)<=Math.max(9,weapon(u).range+4))return unit;
 const defense=s.tiles.filter(t=>t.facility&&t.owner===0);
 const goals=has(u,'capture')?defense.concat(s.tiles.filter(t=>t.facility&&t.owner!==1)):defense;
 if(goals.length)return goals.sort((a,b)=>dist(u,a)-dist(u,b))[0];
 const remembered=Object.values(contacts).sort((a,b)=>dist(u,a)-dist(u,b))[0];
 return remembered||s.home;
}
// An admiral evaluates a prospective firing position across ALL ready mounts,
// not just the first gun that happens to reach the target.
function batteryCoverageAt(s,u,p,targets){
 let guns=0,weight=0;
 const moved=p.x!==u.x||p.y!==u.y,indirect=has(u,'indirect');
 for(let i=0;i<D[u.type].weapons.length;i++){
  if(u.used[i]||u.ammo[i]<=0)continue;
  const w=D[u.type].weapons[i];let best=0;
  for(const v of targets){
   if(v.hp<=0||v.carried||v.team===u.team)continue;
   const range=w.range+(u.rangeBoostTurn===s.turn?2:0),d=dist(p,v);
   if(d<(indirect?2:1)||d>range)continue;
   if(!indirect&&!lineOfSight(s,p,v))continue;
   if(indirect&&D[u.type].branch!=='Navy'&&moved&&u.setupTurn!==s.turn)continue;
   const force=Math.min(v.hp,w.power)*(D[v.type].branch==='Navy'&&D[u.type].branch==='Navy'?1.22:1);
   best=Math.max(best,force+(v.flagship?12:0));
  }
  if(best){guns++;weight+=best;}
 }
 return {guns,weight};
}
function planNavalBroadside(s,u,visible){
 if(D[u.type].branch!=='Navy'||u.moved||u.disabled||u.anchored||u.fired||!visible.length)return false;
 const targets=visible.filter(v=>v.hp>0&&!v.carried);
 if(!targets.length)return false;
 const base=batteryCoverageAt(s,u,u,targets),companions=alive(s,1).filter(v=>v.id!==u.id&&D[v.type].branch==='Navy');
 let best=null;
 for(const p of reach(s,u).values()){
  const options=batteryCoverageAt(s,u,p,targets);
  if(!options.guns||options.guns<base.guns)continue;
  const screen=companions.some(v=>v.flagship&&dist(v,p)<=4)?12:0;
  const incoming=tacticalThreat(s,u,p,targets);
  const score=options.weight+options.guns*15+screen-incoming*.12-(p.cost||0)*.4;
  if(!best||score>best.score)best={p,options,score};
 }
 if(!best)return false;
 const baseScore=base.weight+base.guns*15-tacticalThreat(s,u,u,targets)*.12;
 // If one long-range gun works now but three will work after moving, MOVE FIRST.
 if((best.options.guns>base.guns&&best.score>baseScore+14)||
    (base.guns===0&&best.options.guns>0&&best.score>baseScore+8)){
  return move(s,u,best.p.x,best.p.y);
 }
 return false;
}
function tacticalPosition(s,u,goal,visible,contactHistory){
 if(u.anchored||u.disabled||u.moved||u.fired)return false;
 const movement=[...reach(s,u).values()];
 if(!movement.length)return false;
 const branch=D[u.type].branch;
 const hostile=visible;
 const friends=alive(s,1).filter(v=>v.id!==u.id&&!v.carried);
 const enemySight=hostile;
 const ideal=branch==='Navy'?D[u.type].family==='sub'?5:Math.max(4,Math.min(8,weapon(u).range-1)):has(u,'indirect')?4:2;
 const potential=(p)=>{
  const pos={...u,x:p.x,y:p.y,moved:p.x!==u.x||p.y!==u.y};
  let opportunities=0;
  for(const enemy of hostile){
   const d=dist(pos,enemy),direct=has(u,'indirect')||lineOfSight(s,pos,enemy);
   if(d<=Math.max(...D[u.type].weapons.map(w=>w.range))&&d>=(has(u,'indirect')?2:1)&&direct&&(branch==='Navy'||!has(u,'indirect')||!pos.moved||u.setupTurn===s.turn)){
    opportunities=Math.max(opportunities,Math.min(enemy.hp,Math.max(...D[u.type].weapons.map(w=>w.power)))+(enemy.hp<40?22:0));
   }
  }
  let goalDistance=dist(p,goal);
  const distanceScore=Math.max(-80,50-goalDistance*4.7);
  const danger=tacticalThreat(s,u,p,enemySight);
  const close=hostile.length?Math.min(...hostile.map(v=>dist(p,v))):99;
  const cover=({forest:6,ruins:9,hill:5}[tile(s,p.x,p.y)?.terrain]||0);
  const objective=tile(s,p.x,p.y)?.facility&&tile(s,p.x,p.y).owner!==1&&has(u,'capture')?30:0;
  const screened=branch==='Navy'?friends.filter(v=>D[v.type].branch==='Navy'&&dist(p,v)<=3).length*4:0;
  const cohesion=friends.filter(v=>dist(p,v)<=2).length*1.4;
  const standoff=close<ideal?-(ideal-close)*10:0;
  const flank=hostile.some(v=>friends.some(ally=>dist(ally,v)<=3)&&dist(p,v)<=3)?9:0;
  return distanceScore+opportunities*.7+objective+screened+cohesion+flank+cover+standoff-danger*(u.hp<u.maxHp*.5?.65:.34);
 };
 const from={x:u.x,y:u.y},stay=potential(from);
 const shortlist=movement.sort((a,b)=>dist(a,goal)-dist(b,goal)).slice(0,100);
 let best=null;
 for(const p of shortlist){const score=potential(p)-(p.cost||0)*.09;if(!best||score>best.score)best={p,score};}
 if(best&&best.score>stay+3)return move(s,u,best.p.x,best.p.y);
 return false;
}
function ai(s,u){
 if(!u||u.hp<=0||u.carried||s.result||u.fired||u.battery||u.readyTurn>s.turn)return;
 const plan=commandIntel(s),kind=D[u.type].ability.kind,branch=D[u.type].branch;
 if(['scan','sonar'].includes(kind)&&!abilityError(s,u))useAbility(s,u);
 const friends=alive(s,1).filter(v=>!v.carried);
 let visible=alive(s,0).filter(v=>!v.carried&&visibleTo(s,v,1));
 // Repair and command ships first; a support unit must earn its action.
 if(has(u,'resupply')||has(u,'heal')){
  for(let slot=0;slot<D[u.type].serviceSlots;slot++)
   for(const v of friends.slice().sort((a,b)=>a.hp/a.maxHp-b.hp/b.maxHp))
    if(support(s,u,v,slot))break;
  if(u.fired)return;
 }
 if(['fleetpatch','sortie','screen'].includes(kind)){
  const hurtNavy=friends.some(v=>D[v.type].branch==='Navy'&&dist(u,v)<=2&&(v.disabled||v.hp<v.maxHp*.70));
  const aircraft=friends.some(v=>D[v.type].branch==='Air'&&dist(u,v)<=4&&(v.hp<v.maxHp*.82||v.ammo.some((n,i)=>n<D[v.type].weapons[i].capacity)));
  const threatened=visible.some(v=>D[v.type].branch==='Navy'&&dist(v,u)<=8)&&friends.some(v=>v!==u&&D[v.type].branch==='Navy'&&dist(v,u)<=2&&(v.hp<v.maxHp*.88||['carrier','battleship'].includes(D[v.type].family)));
  if(((kind==='fleetpatch'&&hurtNavy)||(kind==='sortie'&&aircraft)||(kind==='screen'&&threatened))&&!abilityError(s,u)){
   useAbility(s,u);if(u.fired)return;
  }
 }
 if(u.landed){if(u.hp<u.maxHp||u.ammo.some((n,i)=>n<D[u.type].weapons[i].capacity)){u.hp=Math.min(u.maxHp,u.hp+25);u.ammo=D[u.type].weapons.map(w=>w.capacity);}else flight(s,u);return;}
 if(u.ammo.every(n=>n===0)){
  const station=friends.find(v=>has(v,'resupply')&&v!==u)||tile(s,s.enemyHome.x,s.enemyHome.y);
  tacticalPosition(s,u,station,visible,plan.contacts);reload(s,u);return;
 }
 if(kind==='silent'&&u.hp<u.maxHp*.5&&visible.some(v=>D[v.type].branch==='Navy')&&!abilityError(s,u)){useAbility(s,u);return;}
 if(kind==='harass'&&visible.length&&!abilityError(s,u))useAbility(s,u);
 if(kind==='evasion'&&visible.length>=2&&!abilityError(s,u))useAbility(s,u);
 if(kind==='rangefinder'&&visible.some(v=>dist(v,u)>weapon(u).range)&&!abilityError(s,u))useAbility(s,u);
 if(u.escape){
  const to=[...reach(s,u).values()].filter(p=>p.x<u.x&&p.x>=u.x-3).sort((a,b)=>a.x-b.x||dist(a,{x:3,y:s.h-3})-dist(b,{x:3,y:s.h-3}));
  if(to[0])move(s,u,to[0].x,to[0].y);
  fireTactically(s,u,plan.focus);return;
 }
 // Use naval movement to bring the secondary guns into range BEFORE firing.
 if(branch==='Navy'&&visible.length)planNavalBroadside(s,u,visible);
 if(fireTactically(s,u,plan.focus))return;
 if(capture(s,u))return;
 // Entrenched garrisons anchor a front, but engage if a real target enters range.
 if(u.sentry&&u.entrenched&&!visible.some(v=>dist(u,v)<=Math.max(7,weapon(u).range)))return;
 const goal=goalFor(s,u,visible,plan.contacts);
 tacticalPosition(s,u,goal,visible,plan.contacts);
 if(capture(s,u))return;
 if(has(u,'resupply')||has(u,'heal')){
  for(let slot=0;slot<D[u.type].serviceSlots;slot++)for(const v of friends.slice().sort((a,b)=>a.hp/a.maxHp-b.hp/b.maxHp))if(support(s,u,v,slot))break;
 }
 if(has(u,'indirect')&&u.moved&&kind==='setup'&&!abilityError(s,u))useAbility(s,u);
 fireTactically(s,u,plan.focus);
 if(!u.moved&&visible.length===0){u.entrenched=true;if(['mg','atgun','td','rifle','rocket'].includes(D[u.type].family)&&!pinned(s,u))setOverwatch(s,u);}
}
function income(s,team=0){return 1+Math.min(1,s.tiles.filter(t=>t.owner===team&&t.facility==='factory').length);}
// The relay is genuinely contested: sitting on it under hostile fire is not victory.
function secureRelay(s){
 const relay=s.tiles.find(t=>t.facility==='relay');
 if(!relay||relay.owner!==0)return false;
 return alive(s,0).some(u=>!u.carried&&dist(u,relay)<=1&&!pinned(s,u))&&
  !alive(s,1).some(u=>!u.carried&&dist(u,relay)<=2);
}
function relayCounterattack(s){
 if(s.mission.type!=='hold'||s.phase==='deployment'||s.result)return 0;
 const relay=s.tiles.find(t=>t.facility==='relay');
 if(!relay||relay.owner!==0){s.holdThreatTurn=0;return 0;}
 if(!s.holdThreatTurn){
  if(s.hold>=1&&s.hold<=3){s.holdThreatTurn=s.turn+1;
   log(s,'MERIDIAN RADIO INTERCEPT: reinforcements approaching the relay. Dig in or intercept.');
  }
  return 0;
 }
 if(s.turn<s.holdThreatTurn||s.holdThreatTurn<0)return 0;
 s.holdThreatTurn=-1;
 if(alive(s,1).length>=18)return 0;
 const flank=s.tiles.filter(t=>t.terrain!=='void'&&!t.facility&&!t.pad&&!at(s,t.x,t.y)&&
  dist(t,relay)>=4&&dist(t,relay)<=7&&t.x>=relay.x-1&&
  passable(s,{type:'rifle'},t.x,t.y)).sort((a,b)=>
  Math.abs(a.y-relay.y)-Math.abs(b.y-relay.y)||b.x-a.x);
 let deployed=0;
 for(const type of ['rifle','rocket','light']){
  if(!flank.length||s.enemyCredits<D[type].cost||alive(s,1).length>=18)break;
  const i=flank.findIndex(t=>passable(s,{type},t.x,t.y)&&!at(s,t.x,t.y)&&
    !alive(s,1).some(v=>dist(v,t)<=1));
  if(i<0)continue;
  const site=flank.splice(i,1)[0],u=add(s,type,1,site.x,site.y);
  u.assault=true;u.sentry=false;u.entrenched=false;
  s.enemyCredits-=D[type].cost;deployed++;
 }
 if(deployed)log(s,'RELAY COUNTERATTACK: '+deployed+' Meridian units closing on the transmitter.');
 return deployed;
}
function counterpressure(s){if(!(s.alerts>0)||!s.lastCapture||s.mission.type==='defense')return;const h=tile(s,s.enemyHome.x,s.enemyHome.y);if(h.owner!==1)return;const capture=s.lastCapture;for(const type of ['rocket','rifle']){if(s.enemyCredits<D[type].cost||alive(s,1).length>=16)break;const candidates=s.tiles.filter(t=>!at(s,t.x,t.y)&&!t.facility&&passable(s,{type},t.x,t.y)&&dist(t,capture)>=4&&dist(t,capture)<=8&&dist(t,h)<=10).sort((a,b)=>dist(a,capture)-dist(b,capture));const t=candidates[0];if(!t)continue;let u=add(s,type,1,t.x,t.y);u.entrenched=false;s.enemyCredits-=D[type].cost;log(s,'Meridian counterattack approaching the captured position.');}}

function fleetReinforcements(s){
 if(!navalMap(s.mission)||s.turn<3||s.turn%(s.difficulty==='hard'?2:3)!==0)return;
 const enemyFleet=alive(s,1).filter(v=>D[v.type].branch==='Navy');
 if(enemyFleet.length>=7)return;
 const revealed=alive(s,0).filter(v=>visibleTo(s,v,1)),capital=revealed.some(v=>['battleship','carrier','destroyer'].includes(D[v.type].family));
 const aircraft=revealed.some(v=>D[v.type].branch==='Air');
 const choice=capital?'sub':aircraft?'frigate':s.turn%6===0?'destroyer':'gunboat';
 const type=s.enemyCredits>=D[choice].cost?choice:s.enemyCredits>=D.patrol.cost?'patrol':null;
 if(!type)return;
 const spots=s.tiles.filter(t=>t.terrain==='water'&&!at(s,t.x,t.y)&&t.x>=s.w-9&&t.y>=Math.floor(s.h/2)+5).sort((a,b)=>dist(a,{x:s.w-4,y:s.h-3})-dist(b,{x:s.w-4,y:s.h-3}));
 if(!spots.length)return;
 const t=spots[0],ship=add(s,type,1,t.x,t.y);ship.readyTurn=s.turn+1;ship.fired=ship.moved=true;s.enemyCredits-=D[type].cost;
 log(s,'MERIDIAN NAVAL RESPONSE: '+D[type].name+' deploying to counter your fleet.');
}
function counterRaids(s){
 if(['defense','counterbattery','escort','eliminate'].includes(s.mission.type)||s.turn<5||s.turn%3!==2)return;
 const captureAge=s.turn-(s.lastCaptureTurn||1),killAge=s.turn-(s.lastKillTurn||1);
 if(captureAge<3||killAge<3)return;
 const target=s.tiles.filter(t=>t.facility&&t.owner===0&&t.facility!=='hq').sort((a,b)=>a.x-b.x)[0]||tile(s,s.home.x,s.home.y);
 let count=0;
 for(const type of ['ranger','rocket']){
  if(s.enemyCredits<D[type].cost||alive(s,1).length>=18)break;
  const positions=s.tiles.filter(t=>!at(s,t.x,t.y)&&!t.facility&&passable(s,{type},t.x,t.y)&&dist(t,target)>=4&&dist(t,target)<=7&&t.x>target.x+2).sort((a,b)=>dist(a,target)-dist(b,target));
  if(!positions.length)continue;
  add(s,type,1,positions[0].x,positions[0].y);s.enemyCredits-=D[type].cost;count++;
 }
 if(count)log(s,'MERIDIAN RAID: '+count+' flanking units exploiting your stalled advance.');
}
function wave(s){if(s.mission.type!=='defense'||![3,6,9].includes(s.turn))return;const number=(s.waves||0)+1;s.waves=number;const pool=number===1?['rifle','scout','rocket']:number===2?['mg','light','rocket','medic']:['heavy','rocket','mg','light','scout'];let deployed=0;for(let i=0;i<pool.length;i++){const x=Math.floor(s.w*.66)+(i%2),y=Math.floor(s.h/2)-5+i*2;const t=tile(s,x,y);if(t&&!at(s,x,y)){t.terrain='road';let u=add(s,pool[i],1,x,y);u.entrenched=i%2===0;deployed++;}}log(s,'INCOMING WAVE '+number+'/3: '+deployed+' hostile units approaching.');}
function beginPlayer(s){if(s.result||s.phase==='deployment')return;s.side=0;s.turn++;s.killsThisTurn=0;s.momentumRewards=0;
 const fieldForce=alive(s,0).filter(u=>!u.courier&&!u.carried);
 s.emptyRounds=fieldForce.length?0:(s.emptyRounds||0)+1;
 if(s.emptyRounds===1)log(s,'NO FIELD FORCE: deploy reinforcements before the command position is overrun.');
 if(s.emptyRounds===2)log(s,'LAST CHANCE: no active troops. Deploy now or the mission ends next round.');
 const gain=income(s);s.credits=s.operator?999:Math.min(24,s.credits+gain);
 const relay=s.tiles.find(t=>t.facility==='relay'),held=secureRelay(s);
 if(s.mission.type==='hold'&&relay?.owner===0&&!held&&s.hold>0)log(s,'RELAY CONTESTED: hostiles or suppression broke your hold. Clear the perimeter.');
 s.hold=held?s.hold+1:0;s.seized=s.tiles.filter(t=>t.objective).every(t=>t.owner===0)?(s.seized||0)+1:0;
alive(s,0).forEach(u=>{resetUnit(u);if(u.battery){u.ammo=D[u.type].weapons.map(w=>w.capacity);u.bombardTurn=s.turn;}const t=tile(s,u.x,u.y);if(t.owner===0&&t.facility==='town')u.hp=Math.min(u.maxHp,u.hp+12);if(t.owner===0&&t.facility==='airfield'&&u.landed){u.hp=Math.min(u.maxHp,u.hp+20);u.ammo=D[u.type].weapons.map(w=>w.capacity);u.reserve=1;}if(!u.carried&&D[u.type].branch==='Infantry'&&alive(s,0).some(v=>has(v,'hospital')&&dist(u,v)<=2))u.hp=Math.min(u.maxHp,u.hp+8);});
s.enemyCredits=Math.min(24,s.enemyCredits+(s.difficulty==='easy'?1:s.difficulty==='hard'?3:2)+Math.min(1,s.tiles.filter(t=>t.owner===1&&t.facility==='factory').length));advanceConvoy(s);specialWave(s);batteryWarnings(s);wave(s);relayCounterattack(s);fleetReinforcements(s);counterRaids(s);counterpressure(s);if((s.turn%2===0||(s.alerts||0)>0)&&alive(s,1).length<16&&s.mission.type!=='eliminate'&&s.mission.type!=='defense'&&s.mission.type!=='counterbattery'&&s.mission.type!=='escort'){const h=tile(s,s.enemyHome.x,s.enemyHome.y);if(h.owner===1){const heavy=alive(s,0).some(u=>visibleTo(s,u,1)&&D[u.type].armor>=15),air=alive(s,0).some(u=>visibleTo(s,u,1)&&D[u.type].branch==='Air'),options=air?['aa','rocket','rifle']:heavy?['rocket','td','rifle']:['rifle','light','scout','arty'];let type=options[(s.turn/2-1)%options.length];if(s.enemyCredits>=D[type].cost){let t=s.tiles.find(t=>dist(t,h)===1&&!at(s,t.x,t.y)&&passable(s,{type},t.x,t.y));if(t){add(s,type,1,t.x,t.y);s.enemyCredits-=D[type].cost;}}}s.alerts=Math.max(0,(s.alerts||0)-1);s.lastCapture=null;}
log(s,'Round '+s.turn+': +'+gain+' supply.');check(s);}
function unlock(type,profile){return !!profile?.unlocked?.includes(type);}
const families=(typeof module!=='undefined'?require('./roster.js'):root.AtlasRoster)(D,abilities,starters);
const duplicateFamilies=new Set(['radar','smoke','quad','sidecar','scoutheli','aa_cannon','arsenal','mortarcarrier']);
for(const f of families)if(duplicateFamilies.has(f.id)){f.retired=true;for(const id of f.variants)D[id].retired=true;}
const techLinks={siege:'heavy',missile:'td',spg:'arty',mlrs:'spg',battleship:'destroyer',carrier:'frigate',attackjet:'fighter',bomber:'fighter',sam:'aa',hospital:'ambulance',recovery:'logistics',destroyer:'frigate',frigate:'patrol',sub:'patrol',twinheli:'heli',atgun:'rocket',flamer:'assault',medevac:'medic',landing:'patrol',gunboat:'patrol',ifv:'apc',amph:'apc',transport:'heli',command:'apc'};
for(const [id,parent] of Object.entries(techLinks))if(D[id]){D[id].techParent=parent;if(D[id].variant===0)D[id].threshold=Math.max(D[id].threshold,['siege','battleship','carrier','bomber'].includes(id)?60:20);}
for(const d of Object.values(D)){d.move=Math.max(1,Math.min(d.branch==='Air'?5:4,Math.ceil(d.move*.65)));d.hp=Math.round(d.hp*(d.branch==='Armor'?.82:.9));d.armor=Math.round(d.armor*.7);if(d.family==='siege')d.cost=Math.max(8,d.cost);if(d.family==='carrier'||d.id==='superheavy')d.cost=Math.max(10,d.cost);d.weapons.forEach(w=>{w.power=Math.round(w.power*.72);w.range=Math.max(1,Math.min(hasTrait(d,'indirect')?5:4,w.range));});d.range=d.weapons[0].range;d.power=d.weapons[0].power;d.desc=d.desc.replace('Two wheels, eight movement:','Fast, lightly protected:').replace('Nine-tile vision','Long-range vision');d.ability.desc=d.ability.desc.replace('+2 movement','+1 movement').replace('10 tiles','8 tiles').replace('+18 power','+10 power').replace('slows its target by 2','slows its target by 1');}

const navalArsenal={
 patrol:{move:7,range:6,armament:[['30 mm bow cannon',42,6],['Aft autocannon',28,5]],role:'Fast coast guard and harassment; flanks, reconnaissance and retreat.'},
 frigate:{move:6,range:8,armament:[['Dual-purpose naval gun',52,8],['Missile battery',41,8],['Close defense turret',28,6]],role:'Long-range anti-air escort and fleet shielding.'},
 destroyer:{move:6,range:9,armament:[['Forward 127 mm gun',62,9],['Stern 127 mm gun',51,8],['Guided missile cells',44,9]],role:'Mobile stand-off gunship with independent ship-to-shore batteries.'},
 battleship:{move:5,range:11,armament:[['Main battery A',78,11],['Main battery B',72,11],['Broadside turrets',56,9],['Secondary guns',42,7]],role:'Slow capital ship; devastating coordinated shore bombardment.'},
 gunboat:{move:7,range:7,armament:[['Twin bow guns',48,7],['Stern deck gun',40,6],['Rocket turret',36,7]],role:'Shallow-water raider with independent guns and close support.'},
 sub:{move:7,range:9,armament:[['Heavy torpedo tubes',79,9],['Wake-homing torpedo',59,8]],role:'Subsurface ambusher: torpedoes attack ships, not ground units.'},
 landing:{move:7,range:5,armament:[['Bow support gun',29,5],['Flank machine guns',22,4]],role:'Fast amphibious insertion with cover for troops on the beach.'},
 carrier:{move:5,range:9,armament:[['Strike squadron',43,9],['Escort missiles',37,8],['Point defense battery',30,6]],role:'Floating fleet airbase: squadrons, long-range support and replenishment.'}
};
function navyAbility(d){
 const kind=d.family==='sub'?['silent','evasion','sonar','broadside','torpedo','screen'][d.variant]:
 d.family==='landing'?['unload','evasion','sonar','broadside','bombard','beachhead'][d.variant]:
 d.family==='carrier'?['sortie','evasion','sonar','broadside','bombard','fleetpatch'][d.variant]:
 ['patrol','frigate','destroyer','battleship','gunboat'].includes(d.family)?
 (d.variant===0?({patrol:'harass',frigate:'screen',destroyer:'torpedo',battleship:'rangefinder',gunboat:'harass'}[d.family]):['evasion','evasion','sonar','broadside','bombard','fleetpatch'][d.variant]):'sonar';
 const templates={
 silent:{name:'Silent running',desc:'Dive beneath radar: hidden beyond 2 tiles unless spotted by sonar or radar. Cannot fire or move this turn.',cost:1,cooldown:3},
 harass:{name:'Shoot and scoot',desc:'After your next gunshot this turn, reposition up to 2 water tiles.',cost:0,cooldown:3},
 rangefinder:{name:'Fire-control solution',desc:'Extend all guns by +2 range this turn. Requires spotting.',cost:1,cooldown:3},
 bombard:{name:'Five-shell saturation',desc:'Arm your next gun: fire five impacts in a cross (target + 4 adjacent tiles). Allies can be HIT. Consumes one gun shot.',cost:2,cooldown:3},
 broadside:{name:'Rolling broadside',desc:'After firing, reload the breeches on up to two spent guns with remaining ammo and fire them again.',cost:1,cooldown:3},
 evasion:{name:'Flank-speed smoke wake',desc:'Before moving, gain +2 movement and generate defensive smoke around this vessel through the enemy response.',cost:1,cooldown:3},
 sonar:{name:'Active sonar and fire control',desc:'Reveal hostiles up to 13 tiles away, including hidden submarines, this round.',cost:0,cooldown:3},
 fleetpatch:{name:'Damage-control flotilla',desc:'Restore 28 HP and clear engine damage on nearby friendly ships, including this vessel.',cost:2,cooldown:4},
 screen:{name:'Chaff and decoy umbrella',desc:'Apply defensive smoke to your vessel and allied ships within 2 tiles for the enemy turn.',cost:1,cooldown:3},
 torpedo:{name:'Coordinated torpedo run',desc:'Arm your next torpedo to inflict heavy bonus damage to a ship target. No effect on land targets.',cost:1,cooldown:3},
 sortie:{name:'Airwing resupply sortie',desc:'Replenish aircraft ammunition and repair up to 24 HP on nearby allied aircraft, even while airborne.',cost:2,cooldown:3},
 unload:{name:'Landing ramp assault',desc:'Unload embarked infantry onto the adjacent shore ready to move and attack.',cost:0,cooldown:3},
 beachhead:{name:'Protected landing corridor',desc:'Fast-disembark embarked infantry: they can act immediately and gain defensive cover for the enemy response.',cost:1,cooldown:3}
 };
 return {kind,...templates[kind],name:d.family+' / '+d.variantName+' · '+templates[kind].name};
}
for(const d of Object.values(D)){
 if(d.branch!=='Navy')continue;
 const cfg=navalArsenal[d.family];if(!cfg)continue;
 const v=d.variant??0,scales=[1,.88,.88,.92,1.07,.94];
 d.move=Math.max(4,cfg.move+[0,2,0,-1,-2,0][v]);
 d.weapons=cfg.armament.map(([name,power,range],i)=>({
  name,power:Math.max(12,Math.round(power*scales[v])),
  range:range+(v===2?2:v===4?1:v===5?1:0),
  capacity:i===0?4:5
 }));
 if(v===3||v===4){
  d.weapons.push({name:v===3?'Broadside auxiliary':'Bombardment launcher',power:v===3?31:45,range:cfg.range+(v===4?2:0),capacity:3});
 }
 d.weapons=d.weapons.slice(0,4);
 d.range=Math.max(...d.weapons.map(w=>w.range));
 d.power=d.weapons[0].power;
 d.desc=cfg.role+' '+d.variantName+': '+d.weapons.length+' independent weapon stations; '+d.move+' movement, '+d.range+' range.';
 d.ability=navyAbility(d);abilities[d.id]=d.ability;
}
// Navy is a separate long-range branch; land-unit balance clamps must not apply to ships.
root.Atlas={canAttackAny,prepareTargetWeapon,spottingLink,legalSpawn,spawnTile,secureRelay,relayCounterattack,pinned,pressureHit,setOverwatch,reactionFire,fleetEscort,navalFireControl,batteryCoverageAt,groundHeight,elevation,rangeElevation,enemyOrder,commandIntel,operationDescriptions,specialOperations,withdraw,forecast,launch,flight,income,capacity,navalMap,tileVisible,visibleTo,lineOfSight,families,abilities,abilityError,useAbility,moveBudget,smoke,baseService,recruitError,freshProfile,purchase,train,deckError,weapon,canFire,selectWeapon,rangeTiles,reload,starters,D,chapters,missions,objectiveNames,make,tile,at,has,dist,reach,move,canAttack,damage,attack,capture,support,load,unload,recruit,alive,log,check,beginEnemy,ai,beginPlayer,visible,unlock,add,passable};if(typeof module!=='undefined')module.exports=root.Atlas;
})(typeof window!=='undefined'?window:globalThis);
