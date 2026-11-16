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
function make(m,difficulty='normal',upgrades={}){
const rand=rng(m.seed),s={version:1,mission:{...m},w:14,h:12,turn:1,side:0,credits:450+m.ch*85,enemyCredits:100,difficulty,units:[],tiles:[],log:[],nextId:1,result:null,hold:0,kills:0,losses:0,upgrades:{...upgrades},events:[]};
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
let player=['rifle','rifle','scout','light','medic'];
if(m.ch>=1)player.push('rocket','arty');if(m.ch>=2)player.push('heli','engineer');if(m.ch>=4)player.push('fighter');
const spots=[[2,5],[2,7],[3,3],[2,3],[1,7],[3,8],[1,2],[4,1],[2,9],[1,0]];
player.forEach((t,i)=>{let [x,y]=spots[i];tile(s,x,y).terrain='plain';add(s,t,0,x,y);});
const enemies=['rifle','rifle','light',...(m.id>0?['mg']:[]),...(m.difficulty>2?['tank','rocket']:[]),...(m.difficulty>3?['arty','aa']:[]),...(m.ch>=4?['heli','heavy']:[])];
const enemySpots=m.biome==='coast'?[[7,3],[7,7],[6,5],[6,1],[7,9],[8,2],[8,8],[5,0],[7,0],[8,10]]:[[11,3],[11,8],[11,5],[10,1],[12,9],[9,3],[12,1],[11,10],[10,10],[13,6]];
enemies.forEach((t,i)=>{let [x,y]=enemySpots[i];tile(s,x,y).terrain='plain';let u=add(s,t,1,x,y);if(m.type==='strike'&&i===2)u.command=true;});
if(['coast','islands'].includes(m.biome)){
const sea=m.biome==='coast'?[[10,9],[12,9],[11,1],[13,3]]:[[1,6],[6,6],[12,5],[8,5]];
['destroyer','landing','frigate','patrol'].forEach((t,i)=>{let [x,y]=sea[i];tile(s,x,y).terrain='water';add(s,t,i<2?0:1,x,y);});
}
if(m.type==='convoy'){let u=add(s,'apc',0,1,9);u.courier=true;}
log(s,'Operation '+m.name+'. '+objectiveNames[m.type]+'.');return s;
}
function tile(s,x,y){return s.tiles[y*s.w+x];}
function at(s,x,y){return s.units.find(u=>u.hp>0&&!u.carried&&u.x===x&&u.y===y);}
function add(s,type,team,x,y){let d=D[type],health=d.hp+(team===0?(s.upgrades.armor||0)*8:0);let u={id:s.nextId++,type,team,x,y,hp:health,maxHp:health,moved:false,fired:false,guard:false,xp:0};s.units.push(u);return u;}
function passable(s,u,x,y){if(x<0||y<0||x>=s.w||y>=s.h)return false;const t=tile(s,x,y);return D[u.type].branch==='Air'||(D[u.type].branch==='Navy'?t.terrain==='water':t.terrain!=='water'||has(u,'amphibious'));}
function step(s,u,x,y){let t=tile(s,x,y);return D[u.type].branch==='Air'||D[u.type].branch==='Navy'?1:['forest','hill','ruins','dune','water'].includes(t.terrain)?2:1;}
function reach(s,u){let map=new Map();if(u.moved||u.fired||u.carried||u.hp<=0)return map;let max=D[u.type].move+(u.team===0?(s.upgrades.mobility||0):0),open=[{x:u.x,y:u.y,cost:0,path:[]}];map.set(u.x+','+u.y,open[0]);while(open.length){open.sort((a,b)=>a.cost-b.cost);let p=open.shift();for(const [dx,dy]of [[1,0],[-1,0],[0,1],[0,-1]]){let x=p.x+dx,y=p.y+dy,k=x+','+y;if(!passable(s,u,x,y)||at(s,x,y)&&at(s,x,y)!==u)continue;let cost=p.cost+step(s,u,x,y);if(cost>max||map.has(k)&&map.get(k).cost<=cost)continue;let next={x,y,cost,path:[...p.path,{x,y}]};map.set(k,next);open.push(next);}}map.delete(u.x+','+u.y);return map;}
function move(s,u,x,y){if(s.result||s.side!==u.team)return false;let p=reach(s,u).get(x+','+y);if(!p)return false;const old={x:u.x,y:u.y};u.x=x;u.y=y;u.moved=true;u.guard=false;s.events.push({kind:'move',id:u.id,from:old,to:{x,y},path:p.path});return true;}
function canAttack(s,a,b,retaliate=false){if(!a||!b||a.hp<=0||b.hp<=0||a.carried||b.carried||a.team===b.team||(!retaliate&&a.fired))return false;let d=dist(a,b),def=D[a.type];if(has(a,'antiShip')&&D[b.type].branch!=='Navy')return false;if(D[b.type].branch==='Air'&&!has(a,'antiAir')&&D[a.type].branch!=='Air'&&!['rifle','mg'].includes(a.type))return false;return d<=def.range&&d>=(has(a,'indirect')?2:1)&&(!has(a,'indirect')||!a.moved);}
function damage(s,a,b){let ad=D[a.type],bd=D[b.type],power=ad.power,mult=.65+.35*a.hp/a.maxHp;if(has(a,'antiArmor')&&bd.branch==='Armor')mult*=1.4;if(has(a,'antiInf')&&bd.branch==='Infantry')mult*=1.4;if(has(a,'antiAir')&&bd.branch==='Air')mult*=1.55;if(a.type==='fighter'&&bd.branch!=='Air')mult*=.45;if(bd.branch==='Air'&&ad.branch==='Infantry')mult*=.4;let cover=bd.branch==='Air'?0:({forest:9,hill:6,ruins:12}[tile(s,b.x,b.y).terrain]||0);if(b.guard)cover+=8;return Math.max(5,Math.round(power*mult+(a.team===0?(s.upgrades.weapons||0)*4:0)+Math.min(a.xp,3)*3-bd.armor*.65-cover));}
function hurt(s,u,n){u.hp=Math.max(0,u.hp-n);if(!u.hp){if(u.team===1)s.kills++;else s.losses++;if(u.cargo){let c=s.units.find(v=>v.id===u.cargo);if(c&&c.hp>0){c.hp=0;if(c.team===0)s.losses++;}}}}
function attack(s,a,b){if(s.result||s.side!==a.team||!canAttack(s,a,b))return false;let n=damage(s,a,b);hurt(s,b,n);a.fired=true;a.moved=true;a.guard=false;a.xp+=b.hp===0?1:0;s.events.push({kind:'attack',from:{x:a.x,y:a.y},to:{x:b.x,y:b.y},damage:n,id:b.id});log(s,D[a.type].name+' hit '+D[b.type].name+' for '+n+'.');if(has(a,'splash'))s.units.filter(v=>v.id!==b.id&&v.hp>0&&!v.carried&&dist(v,b)===1).forEach(v=>hurt(s,v,Math.round(n*.3)));if(b.hp>0&&canAttack(s,b,a,true)&&!has(b,'indirect')){let reply=Math.round(damage(s,b,a)*.45);hurt(s,a,reply);s.events.push({kind:'counter',from:{x:b.x,y:b.y},to:{x:a.x,y:a.y},damage:reply,id:a.id});}check(s);return true;}
function capture(s,u){if(s.result||u.hp<=0||s.side!==u.team||u.fired||u.carried||!has(u,'capture'))return false;let t=tile(s,u.x,u.y);if(!t.facility||t.owner===u.team)return false;t.owner=u.team;u.fired=true;u.moved=true;log(s,D[u.type].name+' captured '+t.facility+'.');check(s);return true;}
function support(s,a,b){if(s.result||s.side!==a.team||a.fired||a.team!==b.team||dist(a,b)>1||a.carried||b.carried||b.hp<=0)return false;let valid=has(a,'heal')&&D[b.type].branch==='Infantry'||has(a,'repair')&&D[b.type].branch!=='Infantry';if(!valid||b.hp>=b.maxHp)return false;b.hp=Math.min(b.maxHp,b.hp+35);a.fired=true;a.moved=true;log(s,D[b.type].name+' restored 35 health.');return true;}
function load(s,a,b){if(s.result||s.side!==a.team||!has(a,'transport')||a.cargo||a.fired||a.team!==b.team||D[b.type].branch!=='Infantry'||dist(a,b)!==1||b.carried)return false;a.cargo=b.id;b.carried=a.id;a.fired=true;a.moved=true;b.moved=b.fired=true;return true;}
function unload(s,a,x,y){let b=s.units.find(v=>v.id===a.cargo);if(s.result||s.side!==a.team||!b||a.fired||dist(a,{x,y})!==1||at(s,x,y)||!passable(s,b,x,y))return false;b.carried=null;b.x=x;b.y=y;b.moved=b.fired=true;a.cargo=null;a.fired=true;check(s);return true;}
function recruit(s,type){let d=D[type];if(s.result||s.side!==0||!d||s.credits<d.cost||s.units.filter(u=>u.team===0&&u.hp>0).length>=24)return false;let tiles=s.tiles.filter(t=>t.owner===0&&t.facility);if(d.branch==='Navy')tiles.push(...alive(s,0).filter(u=>D[u.type].branch==='Navy'));for(let t of tiles){for(let [dx,dy]of [[0,0],[1,0],[-1,0],[0,1],[0,-1],[2,0],[0,2]]){let x=t.x+dx,y=t.y+dy;if(!at(s,x,y)&&passable(s,{type},x,y)){let u=add(s,type,0,x,y);u.moved=u.fired=true;s.credits-=d.cost;log(s,d.name+' deployed. Ready next turn.');return u;}}}return false;}
function alive(s,team){return s.units.filter(u=>u.hp>0&&u.team===team);}
function log(s,text){s.log.unshift({turn:s.turn,text});s.log=s.log.slice(0,60);}
function check(s){if(s.result)return s.result;let hqs=s.tiles.filter(t=>t.facility==='hq'),m=s.mission;let win=hqs.some(t=>t.x!==1&&t.owner===0),lose=tile(s,1,5).owner===1||alive(s,0).length===0;
if(m.type==='eliminate'&&alive(s,1).length===0)win=true;
if(m.type==='hold'&&s.hold>=4)win=true;
if(m.type==='strike'&&!s.units.some(u=>u.command&&u.hp>0))win=true;
if(m.type==='convoy'){let c=s.units.find(u=>u.courier);if(!c||c.hp<=0)lose=true;else if(dist(c,s.extraction)===0)win=true;}
if(lose||win){s.result=lose?'defeat':'victory';log(s,lose?'Operation failed. Regroup and try another approach.':'Operation complete. The front advances.');}return s.result;}
function beginEnemy(s){if(s.result||s.side!==0)return false;s.side=1;alive(s,1).forEach(u=>{u.moved=false;u.fired=false;});return true;}
function ai(s,u){if(u.hp<=0||u.carried||s.result)return;let targets=alive(s,0).filter(v=>!v.carried);let hit=targets.filter(v=>canAttack(s,u,v)).sort((a,b)=>damage(s,u,b)/b.hp-damage(s,u,a)/a.hp)[0];if(hit){attack(s,u,hit);return;}
let destinations=targets.slice();if(has(u,'capture'))destinations.push(...s.tiles.filter(t=>t.facility&&t.owner!==1));if(!destinations.length)return;let destination=destinations.sort((a,b)=>dist(u,a)-dist(u,b))[0];let moves=[...reach(s,u).values()];moves.sort((a,b)=>(dist(a,destination)+step(s,u,a.x,a.y)*.15)-(dist(b,destination)+step(s,u,b.x,b.y)*.15));if(moves.length)move(s,u,moves[0].x,moves[0].y);if(capture(s,u))return;hit=targets.filter(v=>canAttack(s,u,v)).sort((a,b)=>a.hp-b.hp)[0];if(hit)attack(s,u,hit);else u.guard=true;}
function beginPlayer(s){if(s.result)return;s.side=0;s.turn++;let owned=s.tiles.filter(t=>t.owner===0&&t.facility);let income=120+owned.length*35+(s.upgrades.logistics||0)*25;s.credits+=income;let relay=s.tiles.find(t=>t.facility==='relay');s.hold=relay?.owner===0?s.hold+1:0;alive(s,0).forEach(u=>{u.moved=u.fired=false;if(!u.carried&&tile(s,u.x,u.y).owner===0&&tile(s,u.x,u.y).facility)u.hp=Math.min(u.maxHp,u.hp+15);if(D[u.type].branch==='Air'&&alive(s,0).some(v=>has(v,'supply')&&dist(u,v)<=2))u.hp=Math.min(u.maxHp,u.hp+25);});
if(s.turn%4===0&&alive(s,1).length<10){let h=s.tiles.find(t=>t.facility==='hq'&&t.owner===1);if(h){let candidates=['rifle','light',...(s.mission.ch>0?['rocket','tank']:[])],type=candidates[(s.turn/4)%candidates.length|0];for(let [dx,dy]of [[0,0],[-1,0],[0,1],[0,-1]]){let x=h.x+dx,y=h.y+dy;if(!at(s,x,y)&&passable(s,{type},x,y)){let u=add(s,type,1,x,y);if(s.difficulty==='easy')u.hp=Math.round(u.hp*.7);break;}}}}
log(s,'Turn '+s.turn+': +'+income+' supply.');check(s);}
function visible(s,u){return !s.fog||u.team===0||alive(s,0).some(a=>!a.carried&&dist(a,u)<=(has(a,'recon')?7:5));}
function unlock(type,cleared){let order=Object.keys(D).indexOf(type);return ['rifle','scout','mg','rocket','medic','engineer','jeep','light','apc','patrol','landing'].includes(type)||cleared>=Math.min(20,Math.floor(order/3)*2);}
root.Atlas={D,chapters,missions,objectiveNames,make,tile,at,has,dist,reach,move,canAttack,damage,attack,capture,support,load,unload,recruit,alive,log,check,beginEnemy,ai,beginPlayer,visible,unlock,add,passable};if(typeof module!=='undefined')module.exports=root.Atlas;
})(typeof window!=='undefined'?window:globalThis);
