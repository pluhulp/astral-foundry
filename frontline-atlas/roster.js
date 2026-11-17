/* Sixty independent troop platforms, six playable configurations each. */
(function(root){'use strict';
function buildRoster(D,abilities,starters){
 const legacy=JSON.parse(JSON.stringify(D)),folded=new Set(['tank','heavy','superheavy','cruiser','logistics','quadflak','twinheli']);
 const ids=Object.keys(legacy).filter(id=>!folded.has(id)),families=[];
 const group={};
 const assign=(kind,list)=>list.split(' ').forEach(id=>group[id]=kind);
 assign('line','rifle marine commando assault grenadier flamer ranger');assign('recon','scout sniper');assign('crew','mg rocket mortar');assign('medical','medic ambulance hospital medevac');
 assign('tank','light td siege');assign('gun','arty spg atgun mortarcarrier');assign('missile','mlrs missile sam');assign('aa','aa flak aa_cannon');assign('transport','apc amph ifv transport landing');
 assign('bike','bike sidecar rocketbike');assign('scoutcar','jeep autocannon');assign('logistics','supply recovery arsenal quad supplyheli carrier');assign('command','radar command smoke');
 assign('rotor','heli scoutheli');assign('jet','fighter bomber attackjet');assign('drone','drone');assign('ship','patrol frigate destroyer battleship gunboat');assign('sub','sub');
 const paths={line:['Standard','Raider','Grenadier','Assault','Veteran','Pathfinder'],recon:['Standard','Outrider','Spotter','Infiltrator','Sharpshooter','Ranger'],crew:['Standard','Mobile crew','Observer','Twin battery','Heavy battery','Assault crew'],medical:['Standard','Rapid response','Trauma team','Armored rescue','Field hospital','Evacuation team'],tank:['Standard','Cruiser','Medium','Heavy','Landship','Command'],gun:['Standard','Mobile mount','Spotter','Twin mount','Siege mount','Counterbattery'],missile:['Standard','Fast launcher','Targeting radar','Twin rack','Saturation rack','Hunter'],aa:['Standard','Mobile defense','Search radar','Quad battery','Long-range','Escort'],transport:['Standard','Rapid insertion','Recon carrier','Fire support','Protected carrier','Rescue carrier'],bike:['Standard','Trail runner','Recon rider','Heavy sidecar','Missile rider','Dispatch rider'],scoutcar:['Standard','Interceptor','Long-range scout','Dual autocannon','Hunter','Screen carrier'],logistics:['Standard','Express','Extended reach','Armored workshop','Dual station','Field arsenal'],command:['Standard','Mobile command','Wide-band radar','Escort command','Signal station','Field support'],rotor:['Standard','Scout','Target designator','Assault gunship','Heavy gunship','Rescue gunship'],jet:['Standard','Interceptor','Reconnaissance','Twin payload','Strike package','Electronic support'],drone:['Standard','Sprint drone','Survey drone','Dual payload','Strike drone','Support drone'],ship:['Standard','Fast patrol','Radar picket','Dual battery','Bombardment','Fleet support'],sub:['Standard','Fast attack','Sonar scout','Twin torpedo','Heavy torpedo','Recon patrol']};
 const templates={};Object.values(legacy).forEach(d=>{if(!templates[d.ability.kind])templates[d.ability.kind]=d.ability;});
 const geometry={rifle:'rifle',scout:'scout',mg:'machinegun',rocket:'launcher',sniper:'sniper',medic:'medic',marine:'marine',commando:'commando',mortar:'mortar',jeep:'buggy',apc:'apc',light:'tank',td:'destroyer',arty:'howitzer',mlrs:'rockettruck',aa:'aa',amph:'amphibious',heli:'helicopter',fighter:'fighter',bomber:'bomber',drone:'drone',transport:'heavyheli',patrol:'patrol',frigate:'frigate',destroyer:'warship',battleship:'battleship',landing:'landing',sub:'submarine',carrier:'carrier',supply:'truck',siege:'siegetank',autocannon:'armoredcar',ifv:'ifv',missile:'missiletruck',spg:'spg',flak:'flaktank',assault:'assault',attackjet:'attackjet',bike:'bike',sidecar:'sidecar',rocketbike:'missilebike',quad:'quad',ambulance:'ambulance',hospital:'hospital',recovery:'recovery',arsenal:'arsenal',supplyheli:'cargoheli',medevac:'rescueheli',scoutheli:'scoutheli',aa_cannon:'aagun',sam:'sam',radar:'radar',command:'command',smoke:'smoke',grenadier:'grenadier',flamer:'flamer',ranger:'ranger',atgun:'atgun',mortarcarrier:'mortarcarrier',gunboat:'gunboat'};
 const abilityFor=(category,v,base)=>{
  if(v===0)return base.ability.kind;
  if(category==='medical')return ['heal','dash','heal','smokescreen','heal','heal'][v];
  if(category==='logistics')return ['ammo','dash','ammo','smokescreen','service','ammo'][v];
  if(category==='transport')return ['unload','unload','scan','salvo','smokescreen','heal'][v];
  if(category==='gun')return ['setup','setup','scan','salvo','suppress','focus'][v];
  if(category==='command')return ['rally','dash','scan','smokescreen','rally','ammo'][v];
  if(category==='recon')return ['scan','dash','scan','smokescreen','focus','rally'][v];
  if(category==='aa')return ['focus','dash','scan','salvo','focus','smokescreen'][v];
  return ['focus','dash','scan','salvo','suppress','smokescreen'][v];
 };
 const specialIDs={light:['light','cruiser','tank','heavy','superheavy','light__command'],supply:['supply','supply__express','supply__reach','supply__armored','logistics','supply__arsenal'],aa_cannon:['aa_cannon','aa_cannon__mobile','aa_cannon__radar','quadflak','aa_cannon__range','aa_cannon__escort'],heli:['heli','heli__scout','heli__target','twinheli','heli__heavy','heli__rescue']};
 ids.forEach((id,index)=>{
  const base=legacy[id],category=group[id],labels=paths[category],variants=[];
  if(!labels)throw new Error('Missing platform '+id);
  for(let v=0;v<6;v++){
   const key=specialIDs[id]?.[v]||(v?id+'__'+v:id),old=legacy[key],d=JSON.parse(JSON.stringify(old||base));
   d.id=key;d.family=id;d.variant=v;d.variantName=labels[v];d.platform=base.name;d.category=category;d.model=geometry[id];d.design=index;
   d.name=old?old.name:base.name.replace(/ squad$| team$/,'')+' · '+labels[v];
   d.parent=v===0?null:variants[v===3?2:v===4?3:v===5?2:0];d.tier=v===0?0:v<3?1:v===4?3:2;
   d.price=v===0?(starters.includes(id)?0:4+Math.min(5,base.cost)):4+d.tier*4;
   d.threshold=v===0?(starters.includes(id)?0:8+Math.min(12,base.cost)):12+d.tier*10;
   if(!old){
    const multipliers=[1,.78,.85,1.12,1.48,1.05];d.hp=Math.round(base.hp*multipliers[v]);d.move=Math.max(1,base.move+[0,2,0,-1,-2,0][v]);d.armor=Math.max(0,base.armor+[0,-5,-3,5,12,1][v]);d.cost=Math.min(10,Math.max(2,base.cost+[0,0,1,2,3,1][v]));
    if(v===2){d.traits=[...new Set([...d.traits,'recon'])];d.weapons.forEach(w=>{w.range=Math.min(9,w.range+1);w.power=Math.round(w.power*.85);});}
    if(v===3&&d.serviceSlots===0){d.weapons=Array.from({length:2},(_,i)=>({...base.weapons[0],name:['Primary battery','Secondary battery'][i],power:Math.round(base.weapons[0].power*.7)}));}
    if(v===4&&d.serviceSlots===0){d.weapons.forEach(w=>{w.power=Math.round(w.power*1.3);w.capacity=3;});}
    if(v===1)d.weapons.forEach(w=>w.power=Math.round(w.power*.8));
    if(category==='medical'){d.serviceSlots=v>=2?2:1;d.serviceRange=v===4?2:1;d.serviceHP=[35,25,55,40,65,45][v];if(v===4)d.traits.push('hospital');}
    if(category==='logistics'){d.serviceSlots=v===4?2:base.serviceSlots;d.serviceRange=v===2||v===5?2:1;d.serviceHP=[35,20,25,70,45,30][v];}
    if(category==='transport'&&v===5){d.serviceSlots=1;d.serviceRange=1;d.serviceHP=35;d.traits.push('heal');}
    if(category==='command'&&v===2)d.traits.push('radar');
    if(category==='tank'&&v===5)d.traits.push('command');
   }
   if(!old&&category==='logistics'&&d.serviceSlots)d.traits=[...new Set([...d.traits,'resupply'])];
   d.range=d.weapons[0].range;d.power=d.weapons[0].power;
   const kind=old?old.ability.kind:abilityFor(category,v,base),template=templates[kind];
   d.ability={...template,name:old?old.ability.name:base.name+' / '+labels[v]+' / '+template.name};
   d.role=old?old.desc:(v===1?'Faster movement, lighter protection and reduced firepower.':v===2?'Improved observation and reach; reduced hull and firepower.':v===3?'Specialist equipment and protection at the cost of mobility.':v===4?'Heavy specialist equipment; expensive and slow.':'A supporting role with balanced mobility.');
   if(d.serviceSlots)d.role+= ' '+d.serviceSlots+' service action(s), range '+d.serviceRange+', restores '+d.serviceHP+' HP.';
   if(d.weapons.length>1)d.role+=' '+d.weapons.length+' independent weapons.';
   d.desc=d.role;D[key]=d;abilities[key]=d.ability;variants.push(key);
  }
  families.push({id,name:base.name,branch:base.branch,category,model:geometry[id],index,variants,description:base.desc});
 });
 return families;
}
if(typeof module!=='undefined')module.exports=buildRoster;else root.AtlasRoster=buildRoster;
})(typeof window!=='undefined'?window:globalThis);
