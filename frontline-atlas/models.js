/* Atlas / sculpted miniature art system. Shared geometry; no remote assets. */
(function(){'use strict';
const T=THREE,A=Atlas,colors={blue:0x487b7d,red:0xb9654b,dark:0x25343b,tan:0xe4c492};
const cache=new Map(),boxGeo=new T.BoxGeometry(1,1,1),cylGeo=new T.CylinderGeometry(1,1,1,10),coneGeo=new T.ConeGeometry(1,1,7),sphereGeo=new T.IcosahedronGeometry(1,1),ringGeo=new T.TorusGeometry(1,.14,5,16);
function mat(c){if(!cache.has(c))cache.set(c,new T.MeshStandardMaterial({color:c,roughness:.76,metalness:.14}));return cache.get(c);}
function mesh(g,geo,c,x,y,z,sx,sy,sz){const m=new T.Mesh(geo,mat(c));m.position.set(x,y,z);m.scale.set(sx,sy,sz);m.castShadow=true;m.receiveShadow=true;g.add(m);return m;}
function box(g,c,x,y,z,w,h,d){return mesh(g,boxGeo,c,x,y,z,w,h,d);}
function cylinder(g,c,x,y,z,r,h){return mesh(g,cylGeo,c,x,y,z,r,h,r);}
function cone(g,c,x,y,z,r,h){return mesh(g,coneGeo,c,x,y,z,r,h,r);}
function ball(g,c,x,y,z,w,h,d){return mesh(g,sphereGeo,c,x,y,z,w,h,d);}
function rod(g,c,from,to,r=.025){const a=new T.Vector3(...from),b=new T.Vector3(...to),delta=b.clone().sub(a),mid=a.clone().add(b).multiplyScalar(.5),m=cylinder(g,c,mid.x,mid.y,mid.z,r,delta.length());m.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),delta.normalize());return m;}
const hullGeo=new T.CylinderGeometry(.8,1,1,4,1);hullGeo.rotateY(Math.PI/4);
function bevel(g,c,x,y,z,w,h,d){return mesh(g,hullGeo,c,x,y,z,w*.7,h,d*.7);}
function cross(g,x,y,z,size=.15){box(g,0xe7e7d0,x,y,z,size,.025,size*.28);box(g,0xe7e7d0,x,y,z,size*.28,.025,size);}
function gun(g,c,x,y,z,length=.5,r=.025){rod(g,c,[x,y,z],[x,y+.025,z+length],r);box(g,0x26363d,x,y+.025,z+length,.07,.06,.08);}
function wheel(g,x,y,z,r=.13){const tire=cylinder(g,0x202b31,x,y,z,r,.09);tire.rotation.z=Math.PI/2;const hub=cylinder(g,0x8c9c96,x+Math.sign(x)*.05,y,z,r*.5,.015);hub.rotation.z=Math.PI/2;}
function stripe(g,c,x,y,z,w=.28){box(g,c,x,y,z,w,.015,.045);}
function person(g,c,x,z,role,variant,seed){const p=new T.Group();p.position.set(x,0,z);g.add(p);const skin=[0xc89a72,0x8d6550,0xd9b48e][seed%3],armor=variant>=3?0x344c50:0x73806b,helm=variant===2?0xa5ad8c:c;
 rod(p,0x35433f,[-.065,.24,0],[-.085,.08,.045],.045);rod(p,0x35433f,[.065,.24,0],[.075,.08,-.04],.045);bevel(p,0x26343a,-.085,.04,.075,.11,.07,.18);bevel(p,0x26343a,.075,.04,-.015,.11,.07,.18);
 bevel(p,c,0,.34,0,.26,.25,.18);bevel(p,armor,0,.35,.085,.21,.19,.07);for(const s of [-1,1]){ball(p,c,s*.14,.42,0,.07,.065,.075);rod(p,c,[s*.14,.4,0],[s*.16,.28,.075],.04);ball(p,skin,s*.15,.29,.10,.04,.04,.04);box(p,0x8f9273,s*.05,.29,.13,.07,.06,.04);}
 ball(p,skin,0,.53,0,.09,.11,.085);ball(p,helm,0,.59,-.015,.115,.08,.115);box(p,0x233d43,0,.555,.082,.14,.04,.025);stripe(p,0xe1c48a,0,.646,-.02,.095);bevel(p,0x55654e,0,.35,-.13,.20,.19,.1);
 const launcher=['launcher','flamer'].includes(role);gun(p,0x28393e,.14,.32,.09,role==='sniper'?.48:launcher?.34:.29,launcher?.05:.018);box(p,0x4e6263,.14,.34,.15,.04,.04,.09);
 if(launcher)cylinder(p,role==='flamer'?0xbe9b60:0x87926d,0,.4,-.16,.08,.23);
 if(role==='medic')cross(p,0,.46,-.14,.13);if(['scout','commando','ranger','sniper'].includes(role)){bevel(p,0x8c9e7c,0,.38,-.11,.29,.32,.12);box(p,0x293b43,-.15,.56,.07,.06,.06,.06);}
 if(variant>=3)for(const s of [-1,1])bevel(p,armor,s*.09,.16,.04,.10,.09,.07);
 return p;
}
function model(type,team=0){const d=A.D[type],v=d.variant||0,role=d.model||'tank',design=d.design||0,c=team?colors.red:colors.blue,accent=team?0xe1ab79:0xc3d3ac,dark=colors.dark,g=new T.Group();g.userData.variant=type;g.userData.rotors=[];
 const wide=(v===4?1.12:v===1?.86:1)*(1+(design%3-1)*.035),long=1+(design%4-1.5)*.045;
 if(d.branch==='Infantry'){
  person(g,c,-.18,-.12,role,v,design);person(g,c,.17,.13,role,v,design+1);
  if(['rifle','marine','assault','grenadier','ranger'].includes(role))person(g,c,.19,-.24,role,v,design+2);
  if(['machinegun','mortar'].includes(role)){rod(g,dark,[-.14,.04,.26],[0,.25,.25]);rod(g,dark,[.14,.04,.26],[0,.25,.25]);rod(g,dark,[0,.04,.05],[0,.25,.25]);if(role==='mortar')rod(g,0x657b6c,[0,.12,.25],[0,.42,.08],.055);else gun(g,dark,0,.26,.16,.43,.027);}
 }else if(['bike','sidecar','missilebike','quad'].includes(role)){
  if(role==='quad'){for(const x of [-.22,.22])for(const z of [-.23,.23])wheel(g,x,.13,z);bevel(g,c,0,.24,0,.48,.17,.58);}else{wheel(g,.005,.15,-.28,.16);wheel(g,.005,.15,.28,.16);rod(g,0x9caeaa,[0,.18,-.25],[0,.3,.1],.035);bevel(g,c,0,.30,0,.22,.16,.36);rod(g,dark,[0,.18,.28],[0,.46,.16],.025);rod(g,dark,[-.16,.46,.16],[.16,.46,.16],.018);}
  const rider=person(g,c,0,0,'rifle',v,design);rider.scale.setScalar(.63);rider.position.set(0,.20,-.04);box(g,0xf4d79c,0,.34,.31,.10,.07,.025);
  if(role==='sidecar'||v===3){bevel(g,c,.28,.23,.03,.25,.22,.48);wheel(g,.42,.13,0);gun(g,dark,.28,.42,.15,.35);}
  if(role==='missilebike'||v===4){for(const x of [-.14,.14])rod(g,0xa2aa7d,[x,.43,-.25],[x,.43,.2],.055);}
  if(role==='quad'||v===5){bevel(g,0xa79a70,0,.38,-.26,.32,.18,.22);stripe(g,accent,0,.48,-.26,.27);}
 }else if(d.branch==='Armor'){
  const towed=['howitzer','aagun','atgun'].includes(role),truck=['truck','ambulance','hospital','arsenal','rockettruck','missiletruck','sam','radar'].includes(role),tracked=['tank','destroyer','siegetank','spg','flaktank','recovery','mortarcarrier'].includes(role);
  if(towed){for(const x of [-.29,.29])wheel(g,x,.16,-.14,.17);for(const s of [-1,1])rod(g,c,[s*.12,.15,-.1],[s*.29,.04,-.52],.035);cylinder(g,c,0,.23,0,.22,.18);bevel(g,c,0,.37,0,.45,.26,.12);}
  else{for(const s of [-1,1]){if(tracked){bevel(g,0x263332,s*.29,.16,0,.20,.26,.84);for(const z of [-.29,-.1,.1,.29])wheel(g,s*.37,.15,z,.08);for(const z of [-.34,-.17,0,.17,.34])stripe(g,0x77847a,s*.30,.295,z,.15);}else for(const z of truck?[-.31,0,.29]:[-.26,.26])wheel(g,s*.3,.13,z,.135);}
   bevel(g,c,0,.29,0,.62,.25,truck?.96:.82);bevel(g,accent,0,.41,-.05,.48,.045,.5);
   if(truck){bevel(g,c,0,.48,.26,.53,.33,.35);box(g,0xa0c3c2,0,.53,.435,.38,.14,.015);for(const x of [-.28,.28])box(g,0x9eb4af,x,.52,.30,.025,.1,.10);}
  }
  const armed=['tank','destroyer','siegetank','spg','howitzer','aagun','atgun','flaktank','aa','armoredcar','ifv','mortarcarrier','apc','amphibious'];
  if(armed.includes(role)){
   const turret=new T.Group();turret.position.set(0,towed?.36:.44,truck?-.18:0);g.add(turret);cylinder(turret,dark,0,0,0,.22,.05);bevel(turret,c,0,.10,0,role==='siegetank'?.48:.37,.19,.40);cylinder(turret,accent,.07,.22,-.07,.07,.025);
   const n=d.weapons.length;for(let i=0;i<n;i++){let x=n===1?0:(i%2?1:-1)*.115,z=n===3&&i===0?.1:0,y=.12+(i>=2?.09:0);gun(turret,dark,x,y,z,Math.min(.75,.28+d.weapons[i].range*.045),role==='aagun'?.018:.027);}
   if(v>=3||role==='tank'){for(const s of [-1,1])bevel(g,accent,s*.32,.35,.06,.07,.17,.52);}
  }
  if(['rockettruck','missiletruck','sam'].includes(role)){for(const x of [-.15,0,.15])for(const y of [.50,.63]){rod(g,c,[x,y,-.43],[x,y+.10,.02],.055);ball(g,accent,x,y+.10,.03,.045,.045,.045);}}
  if(['truck','arsenal','hospital','ambulance','recovery'].includes(role)){
   if(role==='recovery'){rod(g,0xbba16e,[0,.47,-.25],[0,.90,-.05],.06);rod(g,0xbba16e,[0,.90,-.05],[0,.86,.48],.045);rod(g,dark,[0,.86,.48],[0,.43,.48],.012);}
   else{bevel(g,role==='ambulance'||role==='hospital'?0xc7d0b5:0x7e8a6c,0,.49,-.22,.49,.33,.52);for(const z of [-.39,-.12])stripe(g,accent,0,.66,z,.43);if(['ambulance','hospital'].includes(role))cross(g,0,.68,-.22,.22);else for(let i=0;i<Math.max(1,d.serviceSlots);i++)bevel(g,0xc1a57a,(i-(d.serviceSlots-1)/2)*.20,.70,-.22,.16,.13,.22);}
  }
  if(['radar','command','smoke'].includes(role)){bevel(g,c,0,.49,-.15,.45,.3,.45);if(role==='smoke'){for(const x of [-.2,.2])for(const z of [-.3,-.1,.1])rod(g,dark,[x,.6,z],[x*1.2,.78,z+.06],.035);}else{rod(g,dark,[0,.6,-.15],[0,1.02,-.15],.02);const dish=cylinder(g,accent,0,.96,-.15,.23,.035);dish.rotation.x=.9;rod(g,accent,[-.23,.81,-.15],[.23,.81,-.15],.015);}}
  for(const x of [-.23,.23]){box(g,0xf4d8a0,x,.32,truck?.49:.42,.07,.055,.025);box(g,0x9e5a44,x,.29,truck?-.49:-.42,.06,.035,.025);}rod(g,dark,[-.21,.4,-.25],[-.21,.83,-.28],.008);
  if(v===2||v===5){rod(g,dark,[.23,.45,-.22],[.23,.92,-.22],.01);ball(g,accent,.23,.94,-.22,.045,.045,.045);}
 }else if(d.branch==='Air'){
  const rotor=role.includes('heli')||role==='helicopter';
  if(rotor){ball(g,c,0,.24,.04,.26,.23,.47);ball(g,0xa4c8c8,0,.26,.33,.22,.17,.23);bevel(g,c,0,.15,-.42,.14,.14,.59);bevel(g,c,0,.31,-.68,.06,.36,.24);for(const s of [-1,1]){rod(g,dark,[s*.20,.1,-.2],[s*.25,-.04,-.2],.018);rod(g,dark,[s*.25,-.04,-.34],[s*.25,-.04,.38],.022);}
   for(const z of role==='heavyheli'||role==='cargoheli'?[-.25,.25]:[0]){rod(g,dark,[0,.40,z],[0,.56,z],.025);const rot=new T.Group();rot.position.set(0,.57,z);for(let i=0;i<4;i++){const b=bevel(rot,0x34484c,0,0,.30,.075,.02,.68);b.rotation.y=i*Math.PI/2;b.position.set(Math.sin(i*Math.PI/2)*.30,0,Math.cos(i*Math.PI/2)*.30);}g.add(rot);g.userData.rotors.push(rot);}g.userData.rotor=g.userData.rotors[0];
   if(d.serviceSlots){bevel(g,0xc6b485,0,-.04,0,.37,.16,.35);if(role==='rescueheli')cross(g,0,.45,.03,.16);}
   for(let i=0;i<d.weapons.length;i++){const side=i%2?1:-1;gun(g,dark,side*.28,.12,.10,.36);}
  }else if(role==='drone'){bevel(g,c,0,.15,0,.28,.12,.39);for(const x of [-.34,.34])for(const z of [-.28,.28]){rod(g,dark,[0,.15,0],[x,.15,z],.025);const ring=mesh(g,ringGeo,c,x,.16,z,.16,.16,.16);ring.rotation.x=Math.PI/2;rod(g,accent,[x-.13,.16,z],[x+.13,.16,z],.012);}ball(g,0x85c4cc,0,.07,.16,.07,.07,.07);}
  else{ball(g,c,0,.19,0,.13,.13,.62);cone(g,accent,0,.19,.66,.12,.25).rotation.x=Math.PI/2;bevel(g,0x88b6c0,0,.30,.23,.17,.12,.29);for(const side of [-1,1]){const wing=bevel(g,c,side*.33,.17,-.04,.72,.045,.42);wing.rotation.y=side*.26;bevel(g,c,side*.19,.21,-.47,.38,.04,.21);const tail=bevel(g,c,side*.12,.33,-.5,.035,.32,.24);tail.rotation.z=-side*.2;rod(g,dark,[side*.15,.12,-.38],[side*.15,.12,-.65],.07);for(let i=0;i<d.weapons.length;i++)rod(g,0xd7c4a4,[side*(.22+i*.1),.10,-.15],[side*(.22+i*.1),.10,.17],.035);}}
 }else{
  bevel(g,0x2e4850,0,.10,0,.59,.22,1.22);bevel(g,c,0,.22,-.02,.51,.09,1.1);cone(g,c,0,.16,.63,.29,.43).rotation.x=Math.PI/2;
  if(role==='submarine'){ball(g,c,0,.15,0,.25,.18,.72);bevel(g,c,0,.39,-.08,.15,.26,.28);rod(g,dark,[0,.49,-.08],[0,.70,-.08],.017);}
  else if(role==='carrier'){bevel(g,0x6b7e7d,0,.32,0,.69,.08,1.28);for(const z of [-.4,-.2,0,.2,.4])box(g,0xe1d5aa,-.07,.37,z,.02,.015,.1);bevel(g,c,.22,.49,-.23,.18,.28,.35);}
  else if(role==='landing'){bevel(g,0x889890,0,.28,0,.36,.07,.8);bevel(g,c,0,.38,-.44,.43,.27,.25);box(g,accent,0,.26,.42,.4,.04,.28);}
  else{bevel(g,accent,0,.43,-.16,.32,.36,.38);bevel(g,c,0,.66,-.17,.19,.12,.25);rod(g,dark,[0,.7,-.16],[0,.98,-.16],.012);rod(g,dark,[-.17,.84,-.16],[.17,.84,-.16],.01);for(let i=0;i<d.weapons.length;i++){const z=i%2?-.45:.31;bevel(g,c,0,.34,z,.24,.15,.24);gun(g,dark,0,.40,z,.32);}}
  for(const side of [-1,1])for(const z of [-.36,0,.36]){rod(g,0xc4ceba,[side*.25,.25,z],[side*.25,.37,z],.008);}
 }
 // Silhouette changes reflect role equipment, rather than a colour-only reskin.
 if(v===2&&d.branch!=='Infantry'&&d.branch!=='Air'){ball(g,0xc3d4b1,.2,.62,-.25,.08,.08,.08);}
 if(v===4&&d.branch==='Armor'){for(const side of [-1,1])for(const z of [-.25,0,.25])bevel(g,0x647975,side*.31,.38,z,.10,.16,.18);}
 if(v===5&&d.branch!=='Air'){rod(g,dark,[-.20,.4,-.2],[-.20,1.0,-.2],.012);stripe(g,0xe4bb72,0,.44,.1,.25);}
 g.scale.set(wide,d.branch==='Infantry'?1:1+(v===4?.10:0),long);return g;
}
window.AtlasArt={T,A,colors,mat,mesh,box,cylinder,cone,ball,bevel,rod,model,boxGeo,sphereGeo};window.AtlasModels={model};
})();
