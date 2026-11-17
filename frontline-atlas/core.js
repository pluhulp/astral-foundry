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
function purchase(p,id){const d=D[id];if(!d||p.unlocked.includes(id)||d.parent&&!p.unlocked.includes(d.parent)||p.earned<d.threshold||p.credits<d.price)return false;p.credits-=d.price;p.unlocked.push(id);return true;}
function train(p,id){const n=p.training[id]||0,cost=3+n*3;if(!D[id]||!p.unlocked.includes(id)||n>=3||p.credits<cost)return false;p.credits-=cost;p.training[id]=n+1;return true;}
function deckError(deck,m,p){if(!Array.isArray(deck)||deck.length<1||deck.length>6)return 'Choose 1–6 troop types.';
if(new Set(deck).size!==deck.length)return 'One of each variant per deck.';
if(deck.some(id=>!D[id]||p&&!p.unlocked.includes(id)))return 'Choose unlocked units.';
if(!deck.some(id=>D[id].traits.includes('capture')))return 'Bring infantry for objectives.';
if(!['coast','islands'].includes(m.biome)&&deck.some(id=>D[id].branch==='Navy'))return 'Ships need coastal waters.';
if(!deck.some(id=>D[id].cost<=10))return 'Bring a troop affordable with 10 starting supply.';return ''; }

function weapon(u){return D[u.type].weapons[u.weapon||0];}
function canFire(u){const i=u.weapon||0;return !u.landed&&!(u.serviceUsed||[]).some(Boolean)&&!u.fired&&!u.used[i]&&u.ammo[i]>0;}
function selectWeapon(u,i){if(!Number.isInteger(i)||!D[u.type].weapons[i])return false;u.weapon=i;return true;}
function rangeTiles(s,u){if(!canFire(u)||u.carried||u.hp<=0||has(u,'indirect')&&u.moved&&u.setupTurn!==s.turn)return [];const w=weapon(u);return s.tiles.filter(t=>t.terrain!=='void'&&dist(u,t)>= (has(u,'indirect')?2:1)&&dist(u,t)<=w.range);}
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
if(a.kind==='salvo'){if(u.shotRound!==s.turn||!(u.used||[]).some((v,i)=>v&&u.ammo[i]>0)||(u.serviceUsed||[]).some(Boolean))return 'Fire a weapon with ammo remaining first.';}
else if(a.kind==='service'){if(!(u.serviceUsed||[]).some(Boolean))return 'Use a service bay first.';}
else if(u.fired)return 'Action already spent.';
if(a.kind==='dash'&&u.moved)return 'Use before moving.';
if(a.kind==='unload'&&(!u.cargo||!insertionTile(s,u)))return 'Embark infantry and clear an adjacent tile first.';
if(a.kind==='setup'&&!u.moved)return 'Move before emplacing.';
return '';
}
function insertionTile(s,u){const b=s.units.find(v=>v.id===u.cargo&&v.hp>0);return b&&s.tiles.find(t=>dist(t,u)===1&&!at(s,t.x,t.y)&&passable(s,b,t.x,t.y));}
function useAbility(s,u){
if(abilityError(s,u))return false;const a=D[u.type].ability;
if(u.team===0)s.credits-=a.cost;u.abilityReady=s.turn+a.cooldown;
const allies=alive(s,u.team).filter(v=>!v.carried&&(D[v.type].branch!=='Air'||v.landed)&&dist(u,v)<=2);
if(a.kind==='dash'){u.boostTurn=s.turn;u.moveBoost=1;}
if(a.kind==='scan'){u.scanTurn=s.turn;}
if(a.kind==='focus'){u.focusTurn=s.turn;}
if(a.kind==='suppress'){u.suppressTurn=s.turn;}
if(a.kind==='setup'){u.setupTurn=s.turn;}
if(a.kind==='salvo'){const i=u.used.findIndex((v,i)=>v&&u.ammo[i]>0);u.used[i]=false;u.weapon=i;u.fired=false;}
if(a.kind==='service'){u.serviceUsed[u.serviceUsed.findIndex(Boolean)]=false;u.fired=false;}
if(a.kind==='heal'){allies.filter(v=>D[v.type].branch==='Infantry').forEach(v=>v.hp=Math.min(v.maxHp,v.hp+30));u.fired=u.moved=true;}
if(a.kind==='ammo'){allies.forEach(v=>{v.ammo=D[v.type].weapons.map(w=>w.capacity);v.reserve=1;});u.fired=u.moved=true;}
if(a.kind==='rally'){allies.filter(v=>!v.moved&&!v.fired&&v!==u).forEach(v=>{v.boostTurn=s.turn;v.moveBoost=1;});u.fired=u.moved=true;}
if(a.kind==='smokescreen'){allies.filter(v=>dist(u,v)<=1).forEach(v=>v.smokeUntil=s.turn);u.fired=u.moved=true;}
if(a.kind==='unload'){const t=insertionTile(s,u),b=s.units.find(v=>v.id===u.cargo);unload(s,u,t.x,t.y);b.moved=b.fired=false;b.used=D[b.type].weapons.map(()=>false);b.serviceUsed=Array(D[b.type].serviceSlots).fill(false);u.fired=u.moved=true;}
log(s,D[u.type].name+': '+a.name+'.');return true;
}
function moveBudget(s,u){return u.disabled||u.landed?0:Math.max(1,D[u.type].move+(u.boostTurn===s.turn?(u.moveBoost||0):0)-(u.suppressedUntil>=s.turn?1:0));}

const chapters=[
{name:'Greenline',biome:'grass',kicker:'THE HOME FRONT',story:'The Meridian Coalition has crossed the border. Reassemble the Atlas defense force and reopen the Greenline corridor.',names:['First Light','Orchard Road','The Crossing','Broken Signal','Iron Harvest','Hold the Line','Night Courier','Railhead','The Long Valley','Greenline Rising']},
{name:'Dust Frontier',biome:'desert',kicker:'THE SOUTHERN EXPANSE',story:'Fuel convoys vanish into the dunes. Take the desert wells, protect supply lines, and break the armored blockade.',names:['Dustfall','Dry River','Mirage Station','Copper Road','Dune Hunters','Last Oasis','Sandrunner','Glass Horizon','Sunhammer','The Red Citadel']},
{name:'Tidebreak',biome:'coast',kicker:'THE COASTAL WAR',story:'Meridian warships control the strait. Escort landing forces through contested waters and retake the harbor towns.',names:['Saltwater','Beachhead','Harbor Watch','Deep Channel','Iron Wake','Breakwater','Coastal Runner','Silent Current','Storm Fleet','Tidebreak']},
{name:'White Reach',biome:'snow',kicker:'THE NORTHERN FRONT',story:'The war reaches the frozen north. Hold mountain facilities and push through the fortified pass.',names:['Whiteout','Pine Needle','Frozen Ford','Cold Relay','Icebreaker','Winter Watch','Northern Express','Avalanche','Polar Dawn','The White Keep']},
{name:'Skyfall',biome:'islands',kicker:'THE ISLAND CHAIN',story:'Scattered island airfields hold the key to the final offensive. Coordinate aircraft, marines, and naval fire support.',names:['High Altitude','Island Hopper','Blue Divide','Radar Silence','Cloudburst','Watchtower','Sea Courier','Wingbreak','Thunderhead','Skyfall']},
{name:'Iron Meridian',biome:'urban',kicker:'THE FINAL OFFENSIVE',story:'The Coalition capital lies ahead. Combine every branch, defend your bridgehead, and dismantle Meridian command.',names:['Outer Ring','Foundry District','Steel Bridge','Dead Frequency','Hammerfall','The Last Stand','Capital Express','Ash Boulevard','Citadel Gate','End of the Meridian']}
];
const objectiveNames={capture:'Capture enemy HQ',eliminate:'Eliminate hostile forces',hold:'Hold the relay for 4 turns',convoy:'Escort the courier to extraction',strike:'Destroy the command vehicle',seize:'Capture and hold all marked facilities for 2 rounds',protect:'Protect the relief convoy for 10 rounds'};
const missions=chapters.flatMap((c,ch)=>c.names.map((name,n)=>({id:ch*10+n,name,ch,n,biome:c.biome,seed:1807+ch*171+n*37,type:['capture','seize','protect','strike','eliminate','hold','convoy','seize','protect','capture'][n],difficulty:1+ch+Math.floor(n/4),par:12+ch*2+n,description:c.story})));
const has=(u,t)=>D[u.type].traits.includes(t),dist=(a,b)=>Math.abs(a.x-b.x)+Math.abs(a.y-b.y);
function rng(seed){return ()=>{seed|=0;seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return ((t^t>>>14)>>>0)/4294967296;};}
function make(m,difficulty='normal',upgrades={},deck=['rifle','scout','medic','light','supply']){
const error=deckError(deck,m);if(error)throw new Error(error);const rand=rng(m.seed),w=24+(m.n%3)*2,h=18+(m.n%4)*2,mid=Math.floor(h/2),s={version:3,phase:'deployment',fog:true,deck:[...deck],mission:{...m},w,h,turn:1,side:0,credits:10,enemyCredits:6,difficulty,units:[],tiles:[],log:[],nextId:1,result:null,hold:0,seized:0,kills:0,losses:0,upgrades:{...upgrades},events:[],pads:[],seen:[],home:{x:2,y:mid},enemyHome:{x:w-3,y:mid+(m.n%3)-1}};
for(let y=0;y<h;y++)for(let x=0;x<w;x++){
const edge=1+Math.floor((Math.sin(y*.7+m.seed)*.5+.5)*3),inset=1+Math.floor((Math.cos(x*.5+m.n)*.5+.5)*2);const shape=m.n%6,cut=shape===0?Math.abs(y-mid)<3&&x>w-6:shape===1?x>w*.45&&x<w*.65&&y<mid-3:shape===2?(x<4||x>w-5)&&(y<5||y>h-6):shape===3?y<Math.floor(x*.22)-1:shape===4?y>h-2-Math.floor(Math.abs(x-w/2)*.3):x<5&&Math.abs(y-mid)>4;let terrain=cut||x<edge-1||x>w-edge||y<inset-1||y>h-inset?'void':rand()<.13?'mountain':rand()<.23?'forest':rand()<.2?'hill':'plain';
if(m.biome==='desert'&&terrain==='forest')terrain='dune';if(m.biome==='urban'&&terrain==='forest')terrain='ruins';
const river=Math.floor(w*.5+Math.sin(y*.4+m.n)*2);
if(terrain!=='void'&&((m.biome==='coast'&&y>=h-5)||(m.biome==='islands'&&(y>=h-5||x===river&&y>3))||m.n%4===2&&Math.abs(x-river)<1))terrain='water';
s.tiles.push({x,y,terrain,owner:-1,facility:null});}
// A seeded winding road and two lateral routes guarantee infantry objectives remain reachable.
const road=(x,y)=>{const t=tile(s,x,y);if(!t)return;t.terrain=t.terrain==='water'?'bridge':'road';};
for(let x=1;x<w-1;x++){let yy=mid+Math.round(Math.sin(x*.35+m.n)*2);for(let y=Math.min(mid,yy);y<=Math.max(mid,yy);y++)road(x,y);road(x,mid);}
const facility=(x,y,f,owner,objective=false)=>{for(let yy=Math.min(mid,y);yy<=Math.max(mid,y);yy++)road(x,yy);const t=tile(s,x,y);t.terrain='road';t.facility=f;t.owner=owner;t.objective=objective;};
facility(2,mid,'hq',0);facility(s.enemyHome.x,s.enemyHome.y,'hq',1);
const pts=[[Math.floor(w*.33),mid-4,'factory'],[Math.floor(w*.58),mid+3,'town'],[w-7,mid-4,'relay'],[Math.floor(w*.45),mid-6,'airfield'],[w-8,mid+5,'factory']];
pts.forEach(([x,y,f],i)=>facility(x,y,f,i===2?1:-1,m.type==='seize'&&i<3||m.type==='hold'&&f==='relay'));
for(const [x,y]of [[2,mid-2],[3,mid-1],[2,mid+2],[3,mid+1]]){for(let yy=Math.min(y,mid);yy<=Math.max(y,mid);yy++)road(x,yy);s.pads.push({x,y,kind:'land'});}
if(['coast','islands'].includes(m.biome)){for(let x=1;x<w-1;x++)for(let y=h-4;y<h-1;y++){const t=tile(s,x,y);if(t.facility||['road','bridge'].includes(t.terrain))t.terrain='bridge';else t.terrain='water';}s.pads.push({x:2,y:h-3,kind:'sea'},{x:4,y:h-3,kind:'sea'});}
s.pads.forEach(p=>tile(s,p.x,p.y).pad=true);
s.extraction={x:w-3,y:mid+4};facility(s.extraction.x,s.extraction.y,'town',-1);
const enemies=['rifle','rocket','light','scout','supply',...(m.n>0?['mg']:[]),...(m.difficulty>2?['td','arty']:[]),...(m.ch>2?['aa','command']:[])];
enemies.forEach((type,i)=>{let x=w-5-(i%3)*2,y=mid-5+Math.floor(i/3)*3;road(x,y);let u=add(s,type,1,x,y);if(m.type==='strike'&&i===2)u.command=true;});
if(m.type==='protect'||m.type==='convoy'){const u=add(s,'apc',0,3,mid);u.courier=true;u.protected=m.type==='protect';if(u.protected)u.moved=u.fired=true;}
log(s,'Place your force on deployment pads. 10 supply; no free deck units.');return s;
}
function launch(s){if(s.phase!=='deployment'||!alive(s,0).some(u=>!u.courier))return false;s.phase='combat';log(s,objectiveNames[s.mission.type]+'. +4 supply per round.');return true;}
function tile(s,x,y){return x>=0&&y>=0&&x<s.w&&y<s.h?s.tiles[y*s.w+x]:null;}

function at(s,x,y){return s.units.find(u=>u.hp>0&&!u.carried&&u.x===x&&u.y===y);}
function add(s,type,team,x,y){let d=D[type],health=d.hp+(team===0?(s.upgrades[type]||0)*8:0);let u={id:s.nextId++,type,team,x,y,hp:health,maxHp:health,landed:false,disabled:false,moved:false,fired:false,guard:false,xp:0,weapon:0,ammo:d.weapons.map(w=>w.capacity),used:d.weapons.map(()=>false),reserve:1,serviceUsed:Array(d.serviceSlots).fill(false)};s.units.push(u);return u;}
function passable(s,u,x,y){const t=tile(s,x,y);if(!t||t.terrain==='void')return false;if(D[u.type].branch==='Air')return true;if(t.terrain==='mountain')return false;return D[u.type].branch==='Navy'?t.terrain==='water':t.terrain!=='water'||has(u,'amphibious');}

function step(s,u,x,y){let t=tile(s,x,y);return D[u.type].branch==='Air'||D[u.type].branch==='Navy'?1:['forest','hill','ruins','dune','water'].includes(t.terrain)?2:1;}
function reach(s,u){let map=new Map();if(s.phase==='deployment'||u.protected||u.disabled||u.landed||u.moved||u.fired||u.carried||u.hp<=0)return map;let max=moveBudget(s,u),open=[{x:u.x,y:u.y,cost:0,path:[]}];map.set(u.x+','+u.y,open[0]);while(open.length){open.sort((a,b)=>a.cost-b.cost);let p=open.shift();for(const [dx,dy]of [[1,0],[-1,0],[0,1],[0,-1]]){let x=p.x+dx,y=p.y+dy,k=x+','+y;if(!passable(s,u,x,y)||at(s,x,y)&&at(s,x,y)!==u)continue;let cost=p.cost+step(s,u,x,y);if(cost>max||map.has(k)&&map.get(k).cost<=cost)continue;let next={x,y,cost,path:[...p.path,{x,y}]};map.set(k,next);open.push(next);}}map.delete(u.x+','+u.y);return map;}
function move(s,u,x,y){if(s.phase==='deployment'||s.result||s.side!==u.team)return false;let p=reach(s,u).get(x+','+y);if(!p)return false;const old={x:u.x,y:u.y};u.x=x;u.y=y;u.moved=true;u.guard=false;s.events.push({kind:'move',id:u.id,from:old,to:{x,y},path:p.path});return true;}
function canAttack(s,a,b,retaliate=false){if(s.phase==='deployment'||!a||!b||a.landed||!visibleTo(s,b,a.team)||a.hp<=0||b.hp<=0||a.carried||b.carried||a.team===b.team||(!retaliate&&!canFire(a))||a.ammo[a.weapon||0]<=0)return false;let d=dist(a,b),def=weapon(a);if(has(a,'antiShip')&&D[b.type].branch!=='Navy')return false;if(D[b.type].branch==='Air'&&!b.landed&&!has(a,'antiAir')&&D[a.type].branch!=='Air'&&!['rifle','mg'].includes(D[a.type].family))return false;return (has(a,'indirect')||lineOfSight(s,a,b))&&d<=def.range&&d>=(has(a,'indirect')?2:1)&&(!has(a,'indirect')||!a.moved||a.setupTurn===s.turn);}
function damage(s,a,b){let ad=D[a.type],bd=D[b.type],power=weapon(a).power+(a.focusTurn===s.turn?10:0)-(a.suppressedUntil>=s.turn?8:0)+(alive(s,a.team).some(v=>!v.carried&&has(v,'command')&&dist(a,v)<=2)?5:0),mult=.65+.35*a.hp/a.maxHp;if(has(a,'antiArmor')&&bd.branch==='Armor')mult*=1.4;if(has(a,'antiInf')&&bd.branch==='Infantry')mult*=1.4;if(has(a,'antiAir')&&bd.branch==='Air')mult*=1.55;if(D[a.type].family==='fighter'&&bd.branch!=='Air')mult*=.45;if(b.landed)mult*=1.35;if(bd.branch==='Air'&&ad.branch==='Infantry'&&!b.landed)mult*=.4;let cover=bd.branch==='Air'?0:({forest:9,hill:6,ruins:12}[tile(s,b.x,b.y).terrain]||0);if(b.smokeUntil>=s.turn)cover+=18;return Math.max(5,Math.round(power*mult+(a.team===0?(s.upgrades[a.type]||0)*2:0)+Math.min(a.xp,3)*2-bd.armor*.65-cover));}
function hurt(s,u,n){u.hp=Math.max(0,u.hp-n);if(u.hp>0&&u.hp/u.maxHp<=.45&&n>=12&&D[u.type].branch!=='Infantry'&&D[u.type].branch!=='Air'){u.disabled=true;log(s,D[u.type].name+': running gear disabled. Supply repair needed.');}if(!u.hp){if(u.team===1)s.kills++;else s.losses++;if(u.cargo){let c=s.units.find(v=>v.id===u.cargo);if(c&&c.hp>0){c.hp=0;if(c.team===0)s.losses++;}}}}
function attack(s,a,b){if(s.result||s.side!==a.team||!canAttack(s,a,b))return false;let n=damage(s,a,b);hurt(s,b,n);a.focusTurn=null;if(a.suppressTurn===s.turn){b.suppressedUntil=s.turn+(a.team===1?1:0);a.suppressTurn=null;}a.shotRound=s.turn;a.ammo[a.weapon||0]--;a.used[a.weapon||0]=true;a.fired=a.used.every((used,i)=>used||a.ammo[i]===0);a.moved=true;a.guard=false;a.xp+=b.hp===0?1:0;s.events.push({kind:'attack',from:{x:a.x,y:a.y},to:{x:b.x,y:b.y},damage:n,id:b.id});log(s,D[a.type].name+' hit '+D[b.type].name+' for '+n+'.');if(has(a,'splash'))s.units.filter(v=>v.id!==b.id&&v.hp>0&&!v.carried&&dist(v,b)===1).forEach(v=>hurt(s,v,Math.round(n*.3)));if(b.hp>0&&canAttack(s,b,a,true)&&!has(b,'indirect')){b.ammo[b.weapon||0]--;let reply=Math.round(damage(s,b,a)*.45);hurt(s,a,reply);s.events.push({kind:'counter',from:{x:b.x,y:b.y},to:{x:a.x,y:a.y},damage:reply,id:a.id});}check(s);return true;}
function capture(s,u){if(s.phase==='deployment'||s.result||u.hp<=0||s.side!==u.team||u.fired||u.carried||!has(u,'capture'))return false;let t=tile(s,u.x,u.y);if(!t.facility||t.owner===u.team)return false;t.owner=u.team;u.fired=true;u.moved=true;log(s,D[u.type].name+' captured '+t.facility+'.');check(s);return true;}
function support(s,a,b,slot=0){const d=D[a.type];if(s.phase==='deployment'||s.result||s.side!==a.team||a.landed||a.fired||a.hp<=0||a.team!==b.team||dist(a,b)<1||dist(a,b)>d.serviceRange||a.carried||b.carried||b.hp<=0||!Number.isInteger(slot)||slot<0||slot>=d.serviceSlots)return false;
a.serviceUsed=a.serviceUsed||Array(d.serviceSlots).fill(false);if(a.serviceUsed[slot])return false;
const truck=has(a,'resupply'),heal=has(a,'heal')&&D[b.type].branch==='Infantry';
if(!truck&&!heal||D[b.type].branch==='Air'&&!b.landed)return false;
const needsAmmo=b.ammo.some((n,i)=>n<D[b.type].weapons[i].capacity)||b.reserve<1;
if(b.hp>=b.maxHp&&!b.disabled&&(!truck||!needsAmmo)||truck&&a.team===0&&s.credits<1)return false;
b.hp=Math.min(b.maxHp,b.hp+d.serviceHP);if(truck){b.disabled=false;b.ammo=D[b.type].weapons.map(w=>w.capacity);b.reserve=1;if(a.team===0)s.credits--;}
a.serviceUsed[slot]=true;a.used=D[a.type].weapons.map(()=>true);a.moved=true;a.fired=a.serviceUsed.every(Boolean);log(s,D[b.type].name+' serviced.');return true;}
function smoke(s,a,b){if(s.result||s.side!==a.team||!has(a,'smoke')||a.fired||a.hp<=0||a.carried||b.carried||b.hp<=0||a.team!==b.team||dist(a,b)>3||s.credits<1)return false;b.smokeUntil=s.turn;a.fired=a.moved=true;s.credits--;return true;}
function baseService(s,h,b){if(s.result||s.side!==0||!s.tiles.includes(h)||h.facility!=='hq'||h.owner!==0||!b||b.team!==0||b.hp<=0||b.carried||dist(h,b)>1)return false;
if(D[b.type].branch==='Air'&&!b.landed)return false;b.disabled=false;b.hp=b.maxHp;b.ammo=D[b.type].weapons.map(w=>w.capacity);b.reserve=1;log(s,D[b.type].name+' fully resupplied at HQ.');return true;}
function recruitError(s,type,h){if(s.result||s.side!==0)return 'Wait for your turn.';if(!h||!s.tiles.includes(h)||h.facility!=='hq'||h.owner!==0)return 'Select your HQ.';
if(!D[type]||!s.deck?.includes(type))return 'Only your selected deck can deploy.';
if(s.credits<D[type].cost)return 'Need '+D[type].cost+' supply.';
if(alive(s,0).filter(u=>!u.courier).length>=10)return 'Ten active troops maximum.';
if(!spawnTile(s,type,h))return 'All suitable deployment pads are occupied.';return '';}
function spawnTile(s,type,h){return (s.pads||[]).filter(t=>(D[type].branch==='Navy'?t.kind==='sea':t.kind==='land')&&!at(s,t.x,t.y)&&passable(s,{type},t.x,t.y))[0];}
function load(s,a,b){if(s.result||s.side!==a.team||!has(a,'transport')||a.cargo||a.fired||a.team!==b.team||D[b.type].branch!=='Infantry'||dist(a,b)!==1||b.carried)return false;a.cargo=b.id;b.carried=a.id;a.fired=true;a.moved=true;b.moved=b.fired=true;return true;}
function unload(s,a,x,y){let b=s.units.find(v=>v.id===a.cargo);if(s.result||s.side!==a.team||!b||a.fired||dist(a,{x,y})!==1||at(s,x,y)||!passable(s,b,x,y))return false;b.carried=null;b.x=x;b.y=y;b.moved=b.fired=true;a.cargo=null;a.fired=true;check(s);return true;}
function recruit(s,type,h=s.tiles.find(t=>t.facility==='hq'&&t.owner===0),chosen){if(recruitError(s,type,h))return false;const t=chosen||spawnTile(s,type,h);if(!s.pads.some(p=>p.x===t.x&&p.y===t.y&&(D[type].branch==='Navy'?p.kind==='sea':p.kind==='land'))||at(s,t.x,t.y)||!passable(s,{type},t.x,t.y))return false;
const u=add(s,type,0,t.x,t.y);s.credits-=D[type].cost;if(s.phase!=='deployment'){u.readyTurn=s.turn+1;u.moved=u.fired=true;u.used=D[type].weapons.map(()=>true);u.serviceUsed=Array(D[type].serviceSlots).fill(true);}return u;}
function flight(s,u){if(!u||D[u.type].branch!=='Air'||s.phase==='deployment'||s.result||s.side!==u.team||u.fired||u.carried)return false;const t=tile(s,u.x,u.y);if(!u.landed&&['water','mountain','forest','void'].includes(t.terrain))return false;u.landed=!u.landed;u.moved=u.fired=true;u.used.fill(true);log(s,D[u.type].name+(u.landed?' landed. Ground service available.':' airborne. Ready next round.'));return true;}

function alive(s,team){return s.units.filter(u=>u.hp>0&&u.team===team);}
function log(s,text){s.log.unshift({turn:s.turn,text});s.log=s.log.slice(0,60);}
function check(s){if(s.result||s.phase==='deployment')return s.result;let m=s.mission,home=tile(s,s.home.x,s.home.y),enemy=tile(s,s.enemyHome.x,s.enemyHome.y),win=false,lose=home.owner===1;
if(m.type==='capture')win=enemy.owner===0;
if(m.type==='eliminate')win=alive(s,1).length===0;
if(m.type==='hold')win=s.hold>=4;
if(m.type==='seize')win=s.seized>=2;
if(m.type==='strike')win=!s.units.some(u=>u.command&&u.hp>0);
if(m.type==='convoy'||m.type==='protect'){let c=s.units.find(u=>u.courier);if(!c||c.hp<=0)lose=true;else win=m.type==='convoy'?dist(c,s.extraction)===0:s.turn>=11;}
const cheapest=Math.min(...s.deck.map(id=>D[id].cost));if(!alive(s,0).some(u=>!u.courier)&&s.credits<cheapest)lose=true;
if(s.turn>60)lose=true;
if(lose||win){s.result=lose?'defeat':'victory';log(s,lose?'Operation failed.':'Objective secured.');}return s.result;}
function resetUnit(u){u.moved=u.fired=!!u.protected;u.used=D[u.type].weapons.map(()=>false);u.serviceUsed=Array(D[u.type].serviceSlots).fill(false);}
function beginEnemy(s){if(s.phase==='deployment'||s.result||s.side!==0)return false;s.side=1;alive(s,1).forEach(resetUnit);return true;}
function lineOfSight(s,a,b){let n=Math.max(Math.abs(a.x-b.x),Math.abs(a.y-b.y));for(let i=1;i<n;i++){let t=tile(s,Math.round(a.x+(b.x-a.x)*i/n),Math.round(a.y+(b.y-a.y)*i/n));if(!t||t.terrain==='mountain'||t.terrain==='void')return false;}return true;}
function sight(s,a,b){let range=a.scanTurn===s.turn?8:has(a,'radar')?7:has(a,'recon')?6:4;if(a.landed)range=2;const t=tile(s,b.x,b.y),concealed=t&&['forest','ruins'].includes(t.terrain)&&D[b.type]?.branch!=='Air';if(concealed&&!has(a,'recon')&&!has(a,'radar')&&a.scanTurn!==s.turn)range=Math.min(range,2);return dist(a,b)<=range&&(a.scanTurn===s.turn||lineOfSight(s,a,b));}
function visibleTo(s,u,team){return u.team===team||alive(s,team).some(a=>!a.carried&&sight(s,a,u))||s.tiles.some(t=>t.owner===team&&t.facility==='relay'&&dist(t,u)<=5&&lineOfSight(s,t,u));}
function visible(s,u){return visibleTo(s,u,0);}
function tileVisible(s,t){return alive(s,0).some(a=>!a.carried&&sight(s,a,t))||s.tiles.some(f=>f.owner===0&&f.facility&&dist(f,t)<=(f.facility==='relay'?5:2)&&lineOfSight(s,f,t));}
function ai(s,u){if(u.hp<=0||u.carried||s.result||u.fired)return;
if(D[u.type].ability.kind==='scan')useAbility(s,u);
const friends=alive(s,1).filter(v=>!v.carried),targets=alive(s,0).filter(v=>!v.carried&&visibleTo(s,v,1)),ownHQ=tile(s,s.enemyHome.x,s.enemyHome.y);
if(has(u,'resupply')){for(let i=0;i<D[u.type].serviceSlots;i++)for(const b of friends.slice().sort((a,b)=>a.hp/a.maxHp-b.hp/b.maxHp))if(support(s,u,b,i))break;if(u.fired)return;}
if(u.landed){if(u.hp<u.maxHp||u.ammo.some((n,i)=>n<D[u.type].weapons[i].capacity)){u.hp=Math.min(u.maxHp,u.hp+25);u.ammo=D[u.type].weapons.map(w=>w.capacity);return;}flight(s,u);return;}
if(u.hp<u.maxHp*.35||u.ammo.every(n=>n===0)||u.disabled){if(D[u.type].branch==='Air'){flight(s,u);return;}const service=friends.find(v=>has(v,'resupply')&&v.id!==u.id)||ownHQ;let paths=[...reach(s,u).values()].sort((a,b)=>dist(a,service)-dist(b,service));if(paths[0])move(s,u,paths[0].x,paths[0].y);if(dist(u,ownHQ)<=1){u.hp=Math.min(u.maxHp,u.hp+35);u.disabled=false;u.ammo=D[u.type].weapons.map(w=>w.capacity);}else reload(s,u);return;}
const fire=()=>{let best=null;for(let i=0;i<D[u.type].weapons.length;i++){selectWeapon(u,i);for(const v of targets)if(canAttack(s,u,v)){let score=damage(s,u,v)+(v.hp<=damage(s,u,v)?50:0)+(has(v,'resupply')?20:0)+(v.courier?35:0);if(!best||score>best.score)best={i,v,score};}}if(best){selectWeapon(u,best.i);if(['focus','suppress'].includes(D[u.type].ability.kind))useAbility(s,u);attack(s,u,best.v);return true;}return false;};
if(fire()){while(!u.fired&&fire()){}return;}
if(capture(s,u))return;
let goals=has(u,'capture')?s.tiles.filter(t=>t.facility&&t.owner!==1):[];
if(s.mission.type==='protect')goals.push(...targets.filter(v=>v.courier));
if(has(u,'resupply'))goals.push(...friends.filter(v=>v.disabled||v.hp<v.maxHp*.7));
let goal=(goals.length?goals:targets.length?targets:[s.home]).slice().sort((a,b)=>dist(u,a)-dist(u,b))[0];
const route=new Map([[goal.x+','+goal.y,0]]),queue=[goal];while(queue.length){const p=queue.shift(),cost=route.get(p.x+','+p.y);for(const [dx,dy]of [[1,0],[-1,0],[0,1],[0,-1]]){const x=p.x+dx,y=p.y+dy,k=x+','+y;if(!route.has(k)&&passable(s,u,x,y)){route.set(k,cost+1);queue.push({x,y});}}}
const moves=[...reach(s,u).values()];const score=p=>{let threat=targets.reduce((n,v)=>n+(dist(v,p)<=weapon(v).range?weapon(v).power:0),0),cover=['forest','ruins','hill'].includes(tile(s,p.x,p.y).terrain)?2:0,near=targets.length?Math.min(...targets.map(v=>dist(p,v))):99,standoff=has(u,'indirect')&&near<3?12:0;return (route.get(p.x+','+p.y)??dist(p,goal)+20)+threat*(u.hp<u.maxHp*.6?.07:.025)+standoff-cover;};moves.sort((a,b)=>score(a)-score(b));if(moves[0]&&score(moves[0])<score(u))move(s,u,moves[0].x,moves[0].y);
if(capture(s,u))return;if(has(u,'indirect')&&u.moved)useAbility(s,u);while(!u.fired&&fire()){}u.fired=true;}
function income(s,team=0){return 4+Math.min(2,s.tiles.filter(t=>t.owner===team&&t.facility==='factory').length);}
function beginPlayer(s){if(s.result||s.phase==='deployment')return;s.side=0;s.turn++;const gain=income(s);s.credits=Math.min(14,s.credits+gain);const relay=s.tiles.find(t=>t.facility==='relay');s.hold=relay?.owner===0?s.hold+1:0;s.seized=s.tiles.filter(t=>t.objective).every(t=>t.owner===0)?(s.seized||0)+1:0;
alive(s,0).forEach(u=>{resetUnit(u);const t=tile(s,u.x,u.y);if(t.owner===0&&t.facility==='town')u.hp=Math.min(u.maxHp,u.hp+12);if(t.owner===0&&t.facility==='airfield'&&u.landed){u.hp=Math.min(u.maxHp,u.hp+20);u.ammo=D[u.type].weapons.map(w=>w.capacity);u.reserve=1;}if(!u.carried&&D[u.type].branch==='Infantry'&&alive(s,0).some(v=>has(v,'hospital')&&dist(u,v)<=2))u.hp=Math.min(u.maxHp,u.hp+8);});
s.enemyCredits=Math.min(16,s.enemyCredits+income(s,1));if(s.turn%2===0&&alive(s,1).length<12&&s.mission.type!=='eliminate'){const h=tile(s,s.enemyHome.x,s.enemyHome.y);if(h.owner===1){const heavy=alive(s,0).some(u=>visibleTo(s,u,1)&&D[u.type].armor>=15),air=alive(s,0).some(u=>visibleTo(s,u,1)&&D[u.type].branch==='Air'),options=air?['aa','rocket','rifle']:heavy?['rocket','td','rifle']:['rifle','light','scout','arty'];let type=options[(s.turn/2-1)%options.length];if(s.enemyCredits>=D[type].cost){let t=s.tiles.find(t=>dist(t,h)===1&&!at(s,t.x,t.y)&&passable(s,{type},t.x,t.y));if(t){add(s,type,1,t.x,t.y);s.enemyCredits-=D[type].cost;}}}}
log(s,'Round '+s.turn+': +'+gain+' supply.');check(s);}
function unlock(type,profile){return !!profile?.unlocked?.includes(type);}
const families=(typeof module!=='undefined'?require('./roster.js'):root.AtlasRoster)(D,abilities,starters);
for(const d of Object.values(D)){d.move=Math.max(1,Math.min(d.branch==='Air'?5:4,Math.ceil(d.move*.65)));d.hp=Math.round(d.hp*(d.branch==='Armor'?.82:.9));d.armor=Math.round(d.armor*.7);if(d.family==='siege')d.cost=Math.max(8,d.cost);if(d.family==='carrier'||d.id==='superheavy')d.cost=Math.max(10,d.cost);d.weapons.forEach(w=>{w.power=Math.round(w.power*.72);w.range=Math.max(1,Math.min(hasTrait(d,'indirect')?5:4,w.range));});d.range=d.weapons[0].range;d.power=d.weapons[0].power;d.desc=d.desc.replace('Two wheels, eight movement:','Fast, lightly protected:').replace('Nine-tile vision','Long-range vision');d.ability.desc=d.ability.desc.replace('+2 movement','+1 movement').replace('10 tiles','8 tiles').replace('+18 power','+10 power');}
root.Atlas={launch,flight,income,tileVisible,visibleTo,lineOfSight,families,abilities,abilityError,useAbility,moveBudget,smoke,baseService,recruitError,freshProfile,purchase,train,deckError,weapon,canFire,selectWeapon,rangeTiles,reload,starters,D,chapters,missions,objectiveNames,make,tile,at,has,dist,reach,move,canAttack,damage,attack,capture,support,load,unload,recruit,alive,log,check,beginEnemy,ai,beginPlayer,visible,unlock,add,passable};if(typeof module!=='undefined')module.exports=root.Atlas;
})(typeof window!=='undefined'?window:globalThis);
