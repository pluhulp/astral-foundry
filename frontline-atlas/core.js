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
function freshProfile(){return {completed:{},credits:8,earned:8,unlocked:[...starters],training:{},deck:['rifle','scout','medic','light','supply'],settings:{difficulty:'normal',fog:false,motion:true,sound:false}};}
function purchase(p,id){const d=D[id];if(!d||p.unlocked.includes(id)||d.parent&&!p.unlocked.includes(d.parent)||p.earned<d.threshold||p.credits<d.price)return false;p.credits-=d.price;p.unlocked.push(id);return true;}
function train(p,id){const n=p.training[id]||0,cost=3+n*3;if(!D[id]||!p.unlocked.includes(id)||n>=3||p.credits<cost)return false;p.credits-=cost;p.training[id]=n+1;return true;}
function deckError(deck,m,p){if(!Array.isArray(deck)||deck.length<5||deck.length>6)return 'Choose 5–6 units.';
 if(new Set(deck).size!==deck.length)return 'One of each variant per battle.';
 if(deck.some(id=>!D[id]||p&&!p.unlocked.includes(id)))return 'Choose unlocked units.';
 if(deck.reduce((n,id)=>n+D[id].cost,0)>26)return 'Deployment budget: 26.';
 if(!deck.some(id=>D[id].traits.includes('capture')))return 'Bring infantry to capture objectives.';
 if(!['coast','islands'].includes(m.biome)&&deck.some(id=>D[id].branch==='Navy'))return 'Ships require a coastal or island map.';
 return '';
}
function weapon(u){return D[u.type].weapons[u.weapon||0];}
function canFire(u){const i=u.weapon||0;return !(u.serviceUsed||[]).some(Boolean)&&!u.fired&&!u.used[i]&&u.ammo[i]>0;}
function selectWeapon(u,i){if(!Number.isInteger(i)||!D[u.type].weapons[i])return false;u.weapon=i;return true;}
function rangeTiles(s,u){if(!canFire(u)||u.carried||u.hp<=0||has(u,'indirect')&&u.moved&&u.setupTurn!==s.turn)return [];const w=weapon(u);return s.tiles.filter(t=>dist(u,t)>= (has(u,'indirect')?2:1)&&dist(u,t)<=w.range);}
function reload(s,u){if(s.result||s.side!==u.team||u.fired||u.hp<=0||u.carried)return false;const ws=D[u.type].weapons;if(ws.every((w,i)=>u.ammo[i]===w.capacity))return false;
 const t=tile(s,u.x,u.y),depot=t.facility&&t.owner===u.team;
 if(!u.reserve&&!(depot&&(u.team===1||s.credits>0)))return false;
 if(u.reserve)u.reserve--;else if(u.team===0)s.credits--;
 u.ammo=ws.map(w=>w.capacity);u.fired=u.moved=true;u.used=ws.map(()=>true);return true;
}


const abilities={"rifle":{"kind":"dash","name":"Double time","desc":"Gain +2 movement this turn before moving.","cost":0,"cooldown":2},"light":{"kind":"dash","name":"Flanking gears","desc":"Gain +2 movement this turn before moving.","cost":0,"cooldown":2},"cruiser":{"kind":"dash","name":"Cruise overdrive","desc":"Gain +2 movement this turn before moving.","cost":0,"cooldown":2},"jeep":{"kind":"dash","name":"Off-road sprint","desc":"Gain +2 movement this turn before moving.","cost":0,"cooldown":2},"bike":{"kind":"dash","name":"Throttle burst","desc":"Gain +2 movement this turn before moving.","cost":0,"cooldown":2},"rocketbike":{"kind":"dash","name":"Ambush run","desc":"Gain +2 movement this turn before moving.","cost":0,"cooldown":2},"quad":{"kind":"dash","name":"Express delivery","desc":"Gain +2 movement this turn before moving.","cost":0,"cooldown":2},"patrol":{"kind":"dash","name":"Full ahead","desc":"Gain +2 movement this turn before moving.","cost":0,"cooldown":2},"scoutheli":{"kind":"dash","name":"Low-level dash","desc":"Gain +2 movement this turn before moving.","cost":0,"cooldown":2},"ranger":{"kind":"dash","name":"Trail run","desc":"Gain +2 movement this turn before moving.","cost":0,"cooldown":2},"marine":{"kind":"dash","name":"Beach rush","desc":"Gain +2 movement this turn before moving.","cost":0,"cooldown":2},"fighter":{"kind":"dash","name":"Afterburner","desc":"Gain +2 movement this turn before moving.","cost":0,"cooldown":2},"scout":{"kind":"scan","name":"Spotter binoculars","desc":"Reveal enemies within 10 tiles for this round.","cost":0,"cooldown":3},"drone":{"kind":"scan","name":"Sensor sweep","desc":"Reveal enemies within 10 tiles for this round.","cost":0,"cooldown":3},"radar":{"kind":"scan","name":"Wide-band sweep","desc":"Reveal enemies within 10 tiles for this round.","cost":0,"cooldown":3},"sub":{"kind":"scan","name":"Sonar pulse","desc":"Reveal enemies within 10 tiles for this round.","cost":0,"cooldown":3},"rocket":{"kind":"focus","name":"Guided rocket","desc":"Your next attack this round gains +18 power.","cost":0,"cooldown":2},"sniper":{"kind":"focus","name":"Steady scope","desc":"Your next attack this round gains +18 power.","cost":0,"cooldown":2},"tank":{"kind":"focus","name":"Rangefinder","desc":"Your next attack this round gains +18 power.","cost":0,"cooldown":2},"heavy":{"kind":"focus","name":"Breach round","desc":"Your next attack this round gains +18 power.","cost":0,"cooldown":2},"td":{"kind":"focus","name":"Hunter optics","desc":"Your next attack this round gains +18 power.","cost":0,"cooldown":2},"missile":{"kind":"focus","name":"Guided strike","desc":"Your next attack this round gains +18 power.","cost":0,"cooldown":2},"sam":{"kind":"focus","name":"Radar lock","desc":"Your next attack this round gains +18 power.","cost":0,"cooldown":2},"aa_cannon":{"kind":"focus","name":"Lead tracking","desc":"Your next attack this round gains +18 power.","cost":0,"cooldown":2},"atgun":{"kind":"focus","name":"Armor-piercing shot","desc":"Your next attack this round gains +18 power.","cost":0,"cooldown":2},"attackjet":{"kind":"focus","name":"Laser designation","desc":"Your next attack this round gains +18 power.","cost":0,"cooldown":2},"battleship":{"kind":"focus","name":"Fire control","desc":"Your next attack this round gains +18 power.","cost":0,"cooldown":2},"mg":{"kind":"salvo","name":"Sustained burst","desc":"Ready one fired weapon again. Still consumes ammunition.","cost":1,"cooldown":3},"superheavy":{"kind":"salvo","name":"Autoloader cycle","desc":"Ready one fired weapon again. Still consumes ammunition.","cost":1,"cooldown":3},"flak":{"kind":"salvo","name":"Battery recycle","desc":"Ready one fired weapon again. Still consumes ammunition.","cost":1,"cooldown":3},"quadflak":{"kind":"salvo","name":"Staggered barrage","desc":"Ready one fired weapon again. Still consumes ammunition.","cost":1,"cooldown":3},"sidecar":{"kind":"salvo","name":"Sidecar follow-up","desc":"Ready one fired weapon again. Still consumes ammunition.","cost":1,"cooldown":3},"twinheli":{"kind":"salvo","name":"Staggered strike","desc":"Ready one fired weapon again. Still consumes ammunition.","cost":1,"cooldown":3},"gunboat":{"kind":"salvo","name":"Rolling broadside","desc":"Ready one fired weapon again. Still consumes ammunition.","cost":1,"cooldown":3},"destroyer":{"kind":"salvo","name":"Rapid salvo","desc":"Ready one fired weapon again. Still consumes ammunition.","cost":1,"cooldown":3},"medic":{"kind":"heal","name":"Emergency dressings","desc":"Heal nearby infantry by 30 HP within two tiles; ends action.","cost":1,"cooldown":3},"ambulance":{"kind":"heal","name":"Triage stop","desc":"Heal nearby infantry by 30 HP within two tiles; ends action.","cost":1,"cooldown":3},"hospital":{"kind":"heal","name":"Field surgery","desc":"Heal nearby infantry by 30 HP within two tiles; ends action.","cost":1,"cooldown":3},"medevac":{"kind":"heal","name":"Rescue drop","desc":"Heal nearby infantry by 30 HP within two tiles; ends action.","cost":1,"cooldown":3},"supply":{"kind":"ammo","name":"Field cache","desc":"Refill nearby allies’ magazines and reserves within two tiles; ends action.","cost":2,"cooldown":3},"arsenal":{"kind":"ammo","name":"Ammo distribution","desc":"Refill nearby allies’ magazines and reserves within two tiles; ends action.","cost":2,"cooldown":3},"supplyheli":{"kind":"ammo","name":"Airdrop","desc":"Refill nearby allies’ magazines and reserves within two tiles; ends action.","cost":2,"cooldown":3},"carrier":{"kind":"ammo","name":"Fleet replenishment","desc":"Refill nearby allies’ magazines and reserves within two tiles; ends action.","cost":2,"cooldown":3},"logistics":{"kind":"service","name":"Third-shift crew","desc":"Ready one spent service bay again, without refreshing weapons.","cost":1,"cooldown":3},"recovery":{"kind":"service","name":"Crane overtime","desc":"Ready one spent service bay again, without refreshing weapons.","cost":1,"cooldown":3},"command":{"kind":"rally","name":"Coordinated advance","desc":"Nearby unmoved allies gain +2 movement this round; ends action.","cost":1,"cooldown":3},"commando":{"kind":"rally","name":"Squad rally","desc":"Nearby unmoved allies gain +2 movement this round; ends action.","cost":1,"cooldown":3},"smoke":{"kind":"smokescreen","name":"Screen curtain","desc":"Screen yourself and adjacent allies for +18 cover this round; ends action.","cost":1,"cooldown":3},"grenadier":{"kind":"smokescreen","name":"Smoke grenades","desc":"Screen yourself and adjacent allies for +18 cover this round; ends action.","cost":1,"cooldown":3},"assault":{"kind":"smokescreen","name":"Breach screen","desc":"Screen yourself and adjacent allies for +18 cover this round; ends action.","cost":1,"cooldown":3},"autocannon":{"kind":"smokescreen","name":"Escape screen","desc":"Screen yourself and adjacent allies for +18 cover this round; ends action.","cost":1,"cooldown":3},"heli":{"kind":"smokescreen","name":"Rotor smoke","desc":"Screen yourself and adjacent allies for +18 cover this round; ends action.","cost":1,"cooldown":3},"frigate":{"kind":"smokescreen","name":"Fleet screen","desc":"Screen yourself and adjacent allies for +18 cover this round; ends action.","cost":1,"cooldown":3},"apc":{"kind":"unload","name":"Assault dismount","desc":"Unload cargo onto a free adjacent tile, ready to move and act; ends transport action.","cost":0,"cooldown":3},"amph":{"kind":"unload","name":"Beach landing","desc":"Unload cargo onto a free adjacent tile, ready to move and act; ends transport action.","cost":0,"cooldown":3},"transport":{"kind":"unload","name":"Fast rope","desc":"Unload cargo onto a free adjacent tile, ready to move and act; ends transport action.","cost":0,"cooldown":3},"landing":{"kind":"unload","name":"Rapid beachhead","desc":"Unload cargo onto a free adjacent tile, ready to move and act; ends transport action.","cost":0,"cooldown":3},"ifv":{"kind":"unload","name":"Covered insertion","desc":"Unload cargo onto a free adjacent tile, ready to move and act; ends transport action.","cost":0,"cooldown":3},"arty":{"kind":"setup","name":"Quick deployment","desc":"Fire indirect weapons after moving this round.","cost":1,"cooldown":3},"spg":{"kind":"setup","name":"Stabilizer lock","desc":"Fire indirect weapons after moving this round.","cost":1,"cooldown":3},"mortar":{"kind":"setup","name":"Fast setup","desc":"Fire indirect weapons after moving this round.","cost":1,"cooldown":3},"mortarcarrier":{"kind":"setup","name":"Hydraulic mounts","desc":"Fire indirect weapons after moving this round.","cost":1,"cooldown":3},"mlrs":{"kind":"suppress","name":"Saturation rockets","desc":"Your next hit this round slows its target by 2 and reduces its power by 8 through its next turn.","cost":1,"cooldown":3},"siege":{"kind":"suppress","name":"Concussion round","desc":"Your next hit this round slows its target by 2 and reduces its power by 8 through its next turn.","cost":1,"cooldown":3},"bomber":{"kind":"suppress","name":"Disruption run","desc":"Your next hit this round slows its target by 2 and reduces its power by 8 through its next turn.","cost":1,"cooldown":3},"flamer":{"kind":"suppress","name":"Flame suppression","desc":"Your next hit this round slows its target by 2 and reduces its power by 8 through its next turn.","cost":1,"cooldown":3}};
abilities.aa={kind:'scan',name:'Airspace sweep',desc:'Reveal enemies within 10 tiles for this round.',cost:0,cooldown:3};
for(const [id,ability] of Object.entries(abilities))D[id].ability=ability;
function abilityError(s,u){
if(!u||u.hp<=0||u.carried||s.result||s.side!==u.team||u.readyTurn>s.turn)return 'Unavailable now.';
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
const allies=alive(s,u.team).filter(v=>!v.carried&&dist(u,v)<=2);
if(a.kind==='dash'){u.boostTurn=s.turn;u.moveBoost=2;}
if(a.kind==='scan'){u.scanTurn=s.turn;}
if(a.kind==='focus'){u.focusTurn=s.turn;}
if(a.kind==='suppress'){u.suppressTurn=s.turn;}
if(a.kind==='setup'){u.setupTurn=s.turn;}
if(a.kind==='salvo'){const i=u.used.findIndex((v,i)=>v&&u.ammo[i]>0);u.used[i]=false;u.weapon=i;u.fired=false;}
if(a.kind==='service'){u.serviceUsed[u.serviceUsed.findIndex(Boolean)]=false;u.fired=false;}
if(a.kind==='heal'){allies.filter(v=>D[v.type].branch==='Infantry').forEach(v=>v.hp=Math.min(v.maxHp,v.hp+30));u.fired=u.moved=true;}
if(a.kind==='ammo'){allies.forEach(v=>{v.ammo=D[v.type].weapons.map(w=>w.capacity);v.reserve=1;});u.fired=u.moved=true;}
if(a.kind==='rally'){allies.filter(v=>!v.moved&&!v.fired&&v!==u).forEach(v=>{v.boostTurn=s.turn;v.moveBoost=2;});u.fired=u.moved=true;}
if(a.kind==='smokescreen'){allies.filter(v=>dist(u,v)<=1).forEach(v=>v.smokeUntil=s.turn);u.fired=u.moved=true;}
if(a.kind==='unload'){const t=insertionTile(s,u),b=s.units.find(v=>v.id===u.cargo);unload(s,u,t.x,t.y);b.moved=b.fired=false;b.used=D[b.type].weapons.map(()=>false);b.serviceUsed=Array(D[b.type].serviceSlots).fill(false);u.fired=u.moved=true;}
log(s,D[u.type].name+': '+a.name+'.');return true;
}
function moveBudget(s,u){return Math.max(1,D[u.type].move+(u.boostTurn===s.turn?(u.moveBoost||0):0)-(u.suppressedUntil>=s.turn?2:0));}

const chapters=[
{name:'Greenline',biome:'grass',kicker:'THE HOME FRONT',story:'The Meridian Coalition has crossed the border. Reassemble the Atlas defense force and reopen the Greenline corridor.',names:['First Light','Orchard Road','The Crossing','Broken Signal','Iron Harvest','Hold the Line','Night Courier','Railhead','The Long Valley','Greenline Rising']},
{name:'Dust Frontier',biome:'desert',kicker:'THE SOUTHERN EXPANSE',story:'Fuel convoys vanish into the dunes. Take the desert wells, protect supply lines, and break the armored blockade.',names:['Dustfall','Dry River','Mirage Station','Copper Road','Dune Hunters','Last Oasis','Sandrunner','Glass Horizon','Sunhammer','The Red Citadel']},
{name:'Tidebreak',biome:'coast',kicker:'THE COASTAL WAR',story:'Meridian warships control the strait. Escort landing forces through contested waters and retake the harbor towns.',names:['Saltwater','Beachhead','Harbor Watch','Deep Channel','Iron Wake','Breakwater','Coastal Runner','Silent Current','Storm Fleet','Tidebreak']},
{name:'White Reach',biome:'snow',kicker:'THE NORTHERN FRONT',story:'The war reaches the frozen north. Hold mountain facilities and push through the fortified pass.',names:['Whiteout','Pine Needle','Frozen Ford','Cold Relay','Icebreaker','Winter Watch','Northern Express','Avalanche','Polar Dawn','The White Keep']},
{name:'Skyfall',biome:'islands',kicker:'THE ISLAND CHAIN',story:'Scattered island airfields hold the key to the final offensive. Coordinate aircraft, marines, and naval fire support.',names:['High Altitude','Island Hopper','Blue Divide','Radar Silence','Cloudburst','Watchtower','Sea Courier','Wingbreak','Thunderhead','Skyfall']},
{name:'Iron Meridian',biome:'urban',kicker:'THE FINAL OFFENSIVE',story:'The Coalition capital lies ahead. Combine every branch, defend your bridgehead, and dismantle Meridian command.',names:['Outer Ring','Foundry District','Steel Bridge','Dead Frequency','Hammerfall','The Last Stand','Capital Express','Ash Boulevard','Citadel Gate','End of the Meridian']}
];
const objectiveNames={capture:'Capture enemy HQ',eliminate:'Eliminate hostile forces',hold:'Hold the relay for 4 turns',convoy:'Escort the courier to extraction',strike:'Destroy the command vehicle'};
const missions=chapters.flatMap((c,ch)=>c.names.map((name,n)=>({id:ch*10+n,name,ch,n,biome:c.biome,seed:1807+ch*171+n*37,type:['capture','eliminate','capture','strike','eliminate','hold','convoy','strike','eliminate','capture'][n],difficulty:1+ch+Math.floor(n/4),par:12+ch*2+n,description:c.story})));
const has=(u,t)=>D[u.type].traits.includes(t),dist=(a,b)=>Math.abs(a.x-b.x)+Math.abs(a.y-b.y);
function rng(seed){return ()=>{seed|=0;seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return ((t^t>>>14)>>>0)/4294967296;};}
function make(m,difficulty='normal',upgrades={},deck=['rifle','scout','medic','light','supply']){
const error=deckError(deck,m);if(error)throw new Error(error);const rand=rng(m.seed),s={version:2,deck:[...deck],mission:{...m},w:14,h:12,turn:1,side:0,credits:12,enemyCredits:0,difficulty,units:[],tiles:[],log:[],nextId:1,result:null,hold:0,kills:0,losses:0,upgrades:{...upgrades},events:[]};
for(let y=0;y<s.h;y++)for(let x=0;x<s.w;x++){
let terrain=rand()<.18?'forest':rand()<.12?'hill':'plain';
if(m.biome==='desert')terrain=terrain==='forest'?'dune':terrain;
if(m.biome==='urban'&&rand()<.3)terrain='ruins';
if(m.biome==='coast'&&x>=9)terrain='water';
if(m.biome==='islands'&&y>=4&&y<=7&&x!==3&&x!==10)terrain='water';
if(!['coast','islands'].includes(m.biome)&&m.n%3===2&&x===7)terrain=[3,8].includes(y)?'bridge':'water';
if(y===5&&terrain!=='water')terrain='road';
s.tiles.push({x,y,terrain,owner:-1,facility:null});}
function facility(x,y,f,owner){const t=tile(s,x,y);t.terrain='road';t.facility=f;t.owner=owner;}
const ex=m.biome==='coast'?7:12,ey=m.biome==='islands'?2:5;
facility(1,5,'hq',0);facility(ex,ey,'hq',1);facility(4,3,'town',-1);facility(m.biome==='coast'?6:10,8,'town',-1);facility(4,8,'factory',-1);facility(6,2,'airfield',-1);facility(6,9,'relay',-1);
s.extraction={x:m.biome==='coast'?7:12,y:9};tile(s,s.extraction.x,9).terrain='road';
let player=deck;
const spots=[[2,5],[2,7],[3,3],[2,3],[1,7],[3,8],[1,2],[4,1],[2,9],[1,0]];
player.forEach((t,i)=>{let [x,y]=spots[i];if(D[t].branch==='Navy'){const waters=s.tiles.filter(t=>t.terrain==='water'&&t.x<7&&!at(s,t.x,t.y));const sea=m.biome==='coast'?s.tiles.find(t=>t.terrain==='water'&&t.y===9-i&&!at(s,t.x,t.y)):waters[0];if(sea){x=sea.x;y=sea.y;}}else tile(s,x,y).terrain='plain';add(s,t,0,x,y);});
const enemies=['rifle','rifle','light',...(m.id>0?['mg']:[]),...(m.difficulty>2?['tank','rocket']:[]),...(m.difficulty>3?['arty','aa']:[]),...(m.ch>=4?['heli','heavy']:[])];
const enemySpots=m.biome==='coast'?[[7,3],[7,7],[6,5],[6,1],[7,9],[8,2],[8,8],[5,0],[7,0],[8,10]]:[[11,3],[11,8],[11,5],[10,1],[12,9],[9,3],[12,1],[11,10],[10,10],[13,6]];
enemies.forEach((t,i)=>{let [x,y]=enemySpots[i];tile(s,x,y).terrain='plain';let u=add(s,t,1,x,y);if(m.type==='strike'&&i===2)u.command=true;});
if(['coast','islands'].includes(m.biome)){
const sea=m.biome==='coast'?[[10,9],[12,9],[11,1],[13,3]]:[[1,6],[6,6],[12,5],[8,5]];
['frigate','patrol'].forEach((t,i)=>{let [x,y]=sea[i+2];tile(s,x,y).terrain='water';add(s,t,1,x,y);});
}
if(m.type==='convoy'){let u=add(s,'apc',0,1,9);u.courier=true;}
log(s,'Operation '+m.name+'. '+objectiveNames[m.type]+'.');return s;
}
function tile(s,x,y){return s.tiles[y*s.w+x];}
function at(s,x,y){return s.units.find(u=>u.hp>0&&!u.carried&&u.x===x&&u.y===y);}
function add(s,type,team,x,y){let d=D[type],health=d.hp+(team===0?(s.upgrades[type]||0)*8:0);let u={id:s.nextId++,type,team,x,y,hp:health,maxHp:health,moved:false,fired:false,guard:false,xp:0,weapon:0,ammo:d.weapons.map(w=>w.capacity),used:d.weapons.map(()=>false),reserve:1,serviceUsed:Array(d.serviceSlots).fill(false)};s.units.push(u);return u;}
function passable(s,u,x,y){if(x<0||y<0||x>=s.w||y>=s.h)return false;const t=tile(s,x,y);return D[u.type].branch==='Air'||(D[u.type].branch==='Navy'?t.terrain==='water':t.terrain!=='water'||has(u,'amphibious'));}
function step(s,u,x,y){let t=tile(s,x,y);return D[u.type].branch==='Air'||D[u.type].branch==='Navy'?1:['forest','hill','ruins','dune','water'].includes(t.terrain)?2:1;}
function reach(s,u){let map=new Map();if(u.moved||u.fired||u.carried||u.hp<=0)return map;let max=moveBudget(s,u),open=[{x:u.x,y:u.y,cost:0,path:[]}];map.set(u.x+','+u.y,open[0]);while(open.length){open.sort((a,b)=>a.cost-b.cost);let p=open.shift();for(const [dx,dy]of [[1,0],[-1,0],[0,1],[0,-1]]){let x=p.x+dx,y=p.y+dy,k=x+','+y;if(!passable(s,u,x,y)||at(s,x,y)&&at(s,x,y)!==u)continue;let cost=p.cost+step(s,u,x,y);if(cost>max||map.has(k)&&map.get(k).cost<=cost)continue;let next={x,y,cost,path:[...p.path,{x,y}]};map.set(k,next);open.push(next);}}map.delete(u.x+','+u.y);return map;}
function move(s,u,x,y){if(s.result||s.side!==u.team)return false;let p=reach(s,u).get(x+','+y);if(!p)return false;const old={x:u.x,y:u.y};u.x=x;u.y=y;u.moved=true;u.guard=false;s.events.push({kind:'move',id:u.id,from:old,to:{x,y},path:p.path});return true;}
function canAttack(s,a,b,retaliate=false){if(!a||!b||a.hp<=0||b.hp<=0||a.carried||b.carried||a.team===b.team||(!retaliate&&!canFire(a))||a.ammo[a.weapon||0]<=0)return false;let d=dist(a,b),def=weapon(a);if(has(a,'antiShip')&&D[b.type].branch!=='Navy')return false;if(D[b.type].branch==='Air'&&!has(a,'antiAir')&&D[a.type].branch!=='Air'&&!['rifle','mg'].includes(D[a.type].family))return false;return d<=def.range&&d>=(has(a,'indirect')?2:1)&&(!has(a,'indirect')||!a.moved||a.setupTurn===s.turn);}
function damage(s,a,b){let ad=D[a.type],bd=D[b.type],power=weapon(a).power+(a.focusTurn===s.turn?18:0)-(a.suppressedUntil>=s.turn?8:0)+(alive(s,a.team).some(v=>!v.carried&&has(v,'command')&&dist(a,v)<=2)?5:0),mult=.65+.35*a.hp/a.maxHp;if(has(a,'antiArmor')&&bd.branch==='Armor')mult*=1.4;if(has(a,'antiInf')&&bd.branch==='Infantry')mult*=1.4;if(has(a,'antiAir')&&bd.branch==='Air')mult*=1.55;if(D[a.type].family==='fighter'&&bd.branch!=='Air')mult*=.45;if(bd.branch==='Air'&&ad.branch==='Infantry')mult*=.4;let cover=bd.branch==='Air'?0:({forest:9,hill:6,ruins:12}[tile(s,b.x,b.y).terrain]||0);if(b.smokeUntil>=s.turn)cover+=18;return Math.max(5,Math.round(power*mult+(a.team===0?(s.upgrades[a.type]||0)*3:0)+Math.min(a.xp,3)*3-bd.armor*.65-cover));}
function hurt(s,u,n){u.hp=Math.max(0,u.hp-n);if(!u.hp){if(u.team===1)s.kills++;else s.losses++;if(u.cargo){let c=s.units.find(v=>v.id===u.cargo);if(c&&c.hp>0){c.hp=0;if(c.team===0)s.losses++;}}}}
function attack(s,a,b){if(s.result||s.side!==a.team||!canAttack(s,a,b))return false;let n=damage(s,a,b);hurt(s,b,n);a.focusTurn=null;if(a.suppressTurn===s.turn){b.suppressedUntil=s.turn+(a.team===1?1:0);a.suppressTurn=null;}a.shotRound=s.turn;a.ammo[a.weapon||0]--;a.used[a.weapon||0]=true;a.fired=a.used.every((used,i)=>used||a.ammo[i]===0);a.moved=true;a.guard=false;a.xp+=b.hp===0?1:0;s.events.push({kind:'attack',from:{x:a.x,y:a.y},to:{x:b.x,y:b.y},damage:n,id:b.id});log(s,D[a.type].name+' hit '+D[b.type].name+' for '+n+'.');if(has(a,'splash'))s.units.filter(v=>v.id!==b.id&&v.hp>0&&!v.carried&&dist(v,b)===1).forEach(v=>hurt(s,v,Math.round(n*.3)));if(b.hp>0&&canAttack(s,b,a,true)&&!has(b,'indirect')){b.ammo[b.weapon||0]--;let reply=Math.round(damage(s,b,a)*.45);hurt(s,a,reply);s.events.push({kind:'counter',from:{x:b.x,y:b.y},to:{x:a.x,y:a.y},damage:reply,id:a.id});}check(s);return true;}
function capture(s,u){if(s.result||u.hp<=0||s.side!==u.team||u.fired||u.carried||!has(u,'capture'))return false;let t=tile(s,u.x,u.y);if(!t.facility||t.owner===u.team)return false;t.owner=u.team;u.fired=true;u.moved=true;log(s,D[u.type].name+' captured '+t.facility+'.');check(s);return true;}
function support(s,a,b,slot=0){const d=D[a.type];if(s.result||s.side!==a.team||a.fired||a.hp<=0||a.team!==b.team||dist(a,b)<1||dist(a,b)>d.serviceRange||a.carried||b.carried||b.hp<=0||!Number.isInteger(slot)||slot<0||slot>=d.serviceSlots)return false;
a.serviceUsed=a.serviceUsed||Array(d.serviceSlots).fill(false);if(a.serviceUsed[slot])return false;
const truck=has(a,'resupply'),heal=has(a,'heal')&&D[b.type].branch==='Infantry';
if(!truck&&!heal)return false;
const needsAmmo=b.ammo.some((n,i)=>n<D[b.type].weapons[i].capacity)||b.reserve<1;
if(b.hp>=b.maxHp&&(!truck||!needsAmmo)||truck&&a.team===0&&s.credits<1)return false;
b.hp=Math.min(b.maxHp,b.hp+d.serviceHP);if(truck){b.ammo=D[b.type].weapons.map(w=>w.capacity);b.reserve=1;if(a.team===0)s.credits--;}
a.serviceUsed[slot]=true;a.used=D[a.type].weapons.map(()=>true);a.moved=true;a.fired=a.serviceUsed.every(Boolean);log(s,D[b.type].name+' serviced.');return true;}
function smoke(s,a,b){if(s.result||s.side!==a.team||!has(a,'smoke')||a.fired||a.hp<=0||a.carried||b.carried||b.hp<=0||a.team!==b.team||dist(a,b)>3||s.credits<1)return false;b.smokeUntil=s.turn;a.fired=a.moved=true;s.credits--;return true;}
function baseService(s,h,b){if(s.result||s.side!==0||!s.tiles.includes(h)||h.facility!=='hq'||h.owner!==0||!b||b.team!==0||b.hp<=0||b.carried||dist(h,b)>1)return false;
b.hp=b.maxHp;b.ammo=D[b.type].weapons.map(w=>w.capacity);b.reserve=1;log(s,D[b.type].name+' fully resupplied at HQ.');return true;}
function recruitError(s,type,h){if(s.result||s.side!==0)return 'Wait for your turn.';if(!h||!s.tiles.includes(h)||h.facility!=='hq'||h.owner!==0)return 'Select your HQ.';
if(!D[type]||!s.deck?.includes(type))return 'Only your battle deck can deploy.';
if(s.credits<D[type].cost)return 'Not enough supply.';
if(alive(s,0).filter(u=>!u.courier).length>=8)return 'Eight active troops maximum.';
if(alive(s,0).filter(u=>!u.courier&&u.type===type).length>=2)return 'Two of each variant maximum.';
if(s.deployedTurn===s.turn)return 'One deployment per round.';
if(!spawnTile(s,type,h))return 'Clear a deployment tile near HQ.';return '';}
function spawnTile(s,type,h){return s.tiles.filter(t=>(D[type].branch==='Navy'||dist(t,h)<=2)&&!at(s,t.x,t.y)&&passable(s,{type},t.x,t.y)).sort((a,b)=>dist(a,h)-dist(b,h))[0];}
function load(s,a,b){if(s.result||s.side!==a.team||!has(a,'transport')||a.cargo||a.fired||a.team!==b.team||D[b.type].branch!=='Infantry'||dist(a,b)!==1||b.carried)return false;a.cargo=b.id;b.carried=a.id;a.fired=true;a.moved=true;b.moved=b.fired=true;return true;}
function unload(s,a,x,y){let b=s.units.find(v=>v.id===a.cargo);if(s.result||s.side!==a.team||!b||a.fired||dist(a,{x,y})!==1||at(s,x,y)||!passable(s,b,x,y))return false;b.carried=null;b.x=x;b.y=y;b.moved=b.fired=true;a.cargo=null;a.fired=true;check(s);return true;}
function recruit(s,type,h=s.tiles.find(t=>t.facility==='hq'&&t.owner===0)){if(recruitError(s,type,h))return false;const t=spawnTile(s,type,h),u=add(s,type,0,t.x,t.y);u.readyTurn=s.turn+1;u.moved=u.fired=true;u.used=D[type].weapons.map(()=>true);u.serviceUsed=Array(D[type].serviceSlots).fill(true);s.credits-=D[type].cost;s.deployedTurn=s.turn;return u;}
function alive(s,team){return s.units.filter(u=>u.hp>0&&u.team===team);}
function log(s,text){s.log.unshift({turn:s.turn,text});s.log=s.log.slice(0,60);}
function check(s){if(s.result)return s.result;let hqs=s.tiles.filter(t=>t.facility==='hq'),m=s.mission;let win=hqs.some(t=>t.x!==1&&t.owner===0),lose=tile(s,1,5).owner===1||alive(s,0).length===0;
if(m.type==='eliminate'&&alive(s,1).length===0)win=true;
if(m.type==='hold'&&s.hold>=4)win=true;
if(m.type==='strike'&&!s.units.some(u=>u.command&&u.hp>0))win=true;
if(m.type==='convoy'){let c=s.units.find(u=>u.courier);if(!c||c.hp<=0)lose=true;else if(dist(c,s.extraction)===0)win=true;}
if(lose||win){s.result=lose?'defeat':'victory';log(s,lose?'Operation failed. Regroup and try another approach.':'Operation complete. The front advances.');}return s.result;}
function beginEnemy(s){if(s.result||s.side!==0)return false;s.side=1;alive(s,1).forEach(u=>{u.moved=false;u.fired=false;u.used=D[u.type].weapons.map(()=>false);u.serviceUsed=Array(D[u.type].serviceSlots).fill(false);});return true;}
function ai(s,u){if(u.hp<=0||u.carried||s.result)return;if(u.ammo.every(n=>n===0)){if(reload(s,u))return;let h=s.tiles.find(t=>t.facility==='hq'&&t.owner===1);if(h){let paths=[...reach(s,u).values()].sort((a,b)=>dist(a,h)-dist(b,h));if(paths[0])move(s,u,paths[0].x,paths[0].y);reload(s,u);}return;}let targets=alive(s,0).filter(v=>!v.carried);let hit=targets.filter(v=>canAttack(s,u,v)).sort((a,b)=>damage(s,u,b)/b.hp-damage(s,u,a)/a.hp)[0];if(hit){attack(s,u,hit);return;}
let destinations=targets.slice();if(has(u,'capture'))destinations.push(...s.tiles.filter(t=>t.facility&&t.owner!==1));if(!destinations.length)return;let destination=destinations.sort((a,b)=>dist(u,a)-dist(u,b))[0];let moves=[...reach(s,u).values()];moves.sort((a,b)=>(dist(a,destination)+step(s,u,a.x,a.y)*.15)-(dist(b,destination)+step(s,u,b.x,b.y)*.15));if(moves.length)move(s,u,moves[0].x,moves[0].y);if(capture(s,u))return;hit=targets.filter(v=>canAttack(s,u,v)).sort((a,b)=>a.hp-b.hp)[0];if(hit)attack(s,u,hit);else u.fired=true;}
function beginPlayer(s){if(s.result)return;s.side=0;s.turn++;let owned=s.tiles.filter(t=>t.owner===0&&t.facility);let income=1;s.credits=Math.min(24,s.credits+income);let relay=s.tiles.find(t=>t.facility==='relay');s.hold=relay?.owner===0?s.hold+1:0;alive(s,0).forEach(u=>{u.moved=u.fired=false;u.used=D[u.type].weapons.map(()=>false);u.serviceUsed=Array(D[u.type].serviceSlots).fill(false);if(!u.carried&&D[u.type].branch==='Infantry'&&alive(s,0).some(v=>!v.carried&&has(v,'hospital')&&dist(u,v)<=2))u.hp=Math.min(u.maxHp,u.hp+10);if(!u.carried&&tile(s,u.x,u.y).owner===0&&tile(s,u.x,u.y).facility)u.hp=Math.min(u.maxHp,u.hp+15);if(D[u.type].branch==='Air'&&alive(s,0).some(v=>has(v,'supply')&&dist(u,v)<=2))u.hp=Math.min(u.maxHp,u.hp+25);});
if(s.turn%6===0&&s.turn<=18&&alive(s,1).length<6){let h=s.tiles.find(t=>t.facility==='hq'&&t.owner===1);if(h){let candidates=['rifle','light',...(s.mission.ch>0?['rocket','tank']:[])],type=candidates[(s.turn/4)%candidates.length|0];for(let [dx,dy]of [[0,0],[-1,0],[0,1],[0,-1]]){let x=h.x+dx,y=h.y+dy;if(!at(s,x,y)&&passable(s,{type},x,y)){let u=add(s,type,1,x,y);if(s.difficulty==='easy')u.hp=Math.round(u.hp*.7);break;}}}}
log(s,'Turn '+s.turn+': +'+income+' supply.');check(s);}
function visible(s,u){return !s.fog||u.team===0||alive(s,0).some(a=>!a.carried&&dist(a,u)<=(a.scanTurn===s.turn?10:has(a,'radar')?9:has(a,'recon')?7:5));}
function unlock(type,profile){return !!profile?.unlocked?.includes(type);}
const families=(typeof module!=='undefined'?require('./roster.js'):root.AtlasRoster)(D,abilities,starters);
root.Atlas={families,abilities,abilityError,useAbility,moveBudget,smoke,baseService,recruitError,freshProfile,purchase,train,deckError,weapon,canFire,selectWeapon,rangeTiles,reload,starters,D,chapters,missions,objectiveNames,make,tile,at,has,dist,reach,move,canAttack,damage,attack,capture,support,load,unload,recruit,alive,log,check,beginEnemy,ai,beginPlayer,visible,unlock,add,passable};if(typeof module!=='undefined')module.exports=root.Atlas;
})(typeof window!=='undefined'?window:globalThis);
