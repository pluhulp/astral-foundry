/* V7: silhouette-first models. Extruded hull outlines, lathed fittings and articulated rigs. */
(function(){'use strict';
const T=THREE,A=Atlas,colors={blue:0x537e88,red:0xad654f,dark:0x202b35,tan:0xd6bd87},materials=new Map(),boxGeo=new T.BoxGeometry(),sphereGeo=new T.IcosahedronGeometry(1,1);
function mat(c){if(!materials.has(c))materials.set(c,new T.MeshStandardMaterial({color:c,roughness:.65,metalness:.2}));return materials.get(c);}
function mesh(g,geo,c,x,y,z,w=1,h=1,d=1){let m=new T.Mesh(geo,mat(c));m.position.set(x,y,z);m.scale.set(w,h,d);m.castShadow=m.receiveShadow=true;g.add(m);return m;}
function box(g,c,x,y,z,w,h,d){return mesh(g,boxGeo,c,x,y,z,w,h,d);}
const cylinders=new T.CylinderGeometry(1,1,1,12),cones=new T.ConeGeometry(1,1,8);
function cylinder(g,c,x,y,z,r,h){return mesh(g,cylinders,c,x,y,z,r,h,r);}
function cone(g,c,x,y,z,r,h){return mesh(g,cones,c,x,y,z,r,h,r);}
function ball(g,c,x,y,z,w,h,d){return mesh(g,sphereGeo,c,x,y,z,w,h,d);}
function rod(g,c,a,b,r=.02){let d=new T.Vector3(...b).sub(new T.Vector3(...a)),mid=new T.Vector3(...a).add(new T.Vector3(...b)).multiplyScalar(.5),m=cylinder(g,c,mid.x,mid.y,mid.z,r,d.length());m.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),d.normalize());return m;}
const shapes=new Map();
function shell(g,c,outline,y,height){let key=JSON.stringify([outline,height]),geo=shapes.get(key);if(!geo){let sh=new T.Shape();outline.forEach(([x,z],i)=>i?sh.lineTo(x,z):sh.moveTo(x,z));sh.closePath();geo=new T.ExtrudeGeometry(sh,{depth:height,bevelEnabled:true,bevelSegments:1,steps:1,bevelSize:.012,bevelThickness:.012,curveSegments:1});geo.rotateX(Math.PI/2);geo.translate(0,height,0);shapes.set(key,geo);}return mesh(g,geo,c,0,y,0);}
function hull(g,c,w,l,y,h,kind=0){const points=kind===1?[[-w*.5,-l*.5],[w*.5,-l*.5],[w*.5,l*.2],[0,l*.6],[-w*.5,l*.2]]:kind===2?[[-w*.35,-l*.5],[w*.35,-l*.5],[w*.5,-l*.25],[w*.35,l*.5],[-w*.35,l*.5],[-w*.5,-l*.25]]:[[-w*.5,-l*.5],[w*.5,-l*.5],[w*.5,l*.25],[w*.3,l*.5],[-w*.3,l*.5],[-w*.5,l*.25]];return shell(g,c,points,y,h);}
function bevel(g,c,x,y,z,w,h,d){let q=new T.Group();q.position.set(x,y-h/2,z);g.add(q);hull(q,c,w,d,0,h,0);return q;}
function lathe(g,c,profile,x,y,z){let key='l'+JSON.stringify(profile),geo=shapes.get(key);if(!geo){geo=new T.LatheGeometry(profile.map(p=>new T.Vector2(...p)),12);shapes.set(key,geo);}return mesh(g,geo,c,x,y,z);}
function wheel(g,x,z,r=.09){let q=new T.Group();q.position.set(x,r,z);q.rotation.z=Math.PI/2;g.add(q);lathe(q,0x202831,[[0,-.035],[r*.8,-.035],[r,-.02],[r,.02],[r*.8,.035],[0,.035]],0,0,0);cylinder(q,0x9baba4,0,.042,0,r*.45,.012);}
function barrel(g,x,y,z,len,r=.018){rod(g,0x263740,[x,y,z],[x,y,z+len],r);let muzzle=cylinder(g,0x6a7b7a,x,y,z+len,r*1.5,.045);muzzle.rotation.x=Math.PI/2;let bore=cylinder(g,0x101b22,x,y,z+len+.025,r*.8,.005);bore.rotation.x=Math.PI/2;}
function antenna(g,x,y,z,h=.3){rod(g,0x253741,[x,y,z],[x,y+h,z],.006);ball(g,0xd9b879,x,y+h,z,.012,.012,.012);}
function rack(g,c,x,y,z,n=3){for(let i=0;i<n;i++){let m=cylinder(g,0x353f43,x+(i-(n-1)/2)*.07,y,z,.027,.28);m.rotation.x=.85;cone(g,c,x+(i-(n-1)/2)*.07,y+.1,z+.12,.025,.09).rotation.x=.85;}}
function dish(g,x,y,z,r=.12){antenna(g,x,y-.2,z,.25);let m=lathe(g,0xc5cfb8,[[0,0],[r*.4,.025],[r,.06],[r,.08],[0,.02]],x,y,z);m.rotation.x=.8;rod(g,0x283e48,[x,y,z],[x,y+.14,z+.1],.008);}
function pack(g,c,x,y,z,w=.12,l=.15){let q=new T.Group();q.position.set(x,y,z);g.add(q);hull(q,c,w,l,0,.12);rod(q,0xc6c3a1,[-w*.4,.14,0],[w*.4,.14,0],.008);}
function soldier(g,c,x,z,role,variant,k){let q=new T.Group();q.position.set(x,0,z);q.rotation.y=(k%2?-.22:.17);g.add(q);const skin=[0xbd8c65,0x805b48,0xd7b491][k%3],kneel=['sniper','mortar','machinegun'].includes(role),hip=kneel?.16:.23;
for(let side of [-1,1]){rod(q,0x35473e,[side*.043,hip,0],[side*.055,.045,side*.045],.028);hullAt(q,0x253038,side*.055,.015,side*.045,.07,.13,.04);}
lathe(q,c,[[.065,0],[.077,.1],[.06,.16]],0,hip,0);hullAt(q,variant>=3?0x394b50:0x889277,0,hip+.04,.048,.12,.06,.09);ball(q,skin,0,hip+.21,0,.053,.069,.055);lathe(q,c,[[.065,0],[.064,.035],[.042,.065],[0,.07]],0,hip+.235,0);
rod(q,c,[-.075,hip+.12,0],[-.07,hip+.03,.09],.024);rod(q,c,[.075,hip+.12,0],[.07,hip+.05,.11],.024);ball(q,skin,.07,hip+.05,.12,.026,.025,.025);pack(q,0x53674f,0,hip+.04,-.08,.09,.07);
if(role==='launcher')rod(q,0xa6aa86,[.1,hip+.15,-.12],[.1,hip+.15,.28],.037);else if(role==='flamer'){cylinder(q,0xb4945f,-.04,hip+.12,-.1,.03,.16);cylinder(q,0xb4945f,.04,hip+.12,-.1,.03,.16);barrel(q,.075,hip+.06,.12,.2,.024);}else barrel(q,.075,hip+.06,.12,role==='sniper'?.32:.17,.012);
if(role==='medic'){pack(q,0xd4cdb7,-.1,.08,.04,.09,.09);rod(q,0x668774,[-.13,.225,.04],[-.07,.225,.04],.009);}
if(['scout','commando','ranger','sniper'].includes(role))hullAt(q,0x80906a,0,hip-.015,-.06,.15,.08,.2);
if(variant===1)q.rotation.y+=.4;if(variant===2)antenna(q,-.06,hip+.16,-.09,.2);if(variant===3)hullAt(q,0x41545b,-.12,.1,.15,.12,.045,.23);if(variant===4)rack(q,c,-.09,.17,-.07,2);if(variant===5)pack(q,0xbdab7a,.12,.07,-.05);
}
function hullAt(g,c,x,y,z,w,l,h,kind=0){let q=new T.Group();q.position.set(x,y,z);g.add(q);hull(q,c,w,l,0,h,kind);return q;}
// Width, length and chassis deliberately differ between every platform. No tile-normalization.
const designs={jeep:[.31,.57,'w',2,'open'],apc:[.42,.82,'t',4,'carrier'],light:[.43,.68,'t',4,'turret'],td:[.35,.85,'t',5,'casemate'],arty:[.32,.56,'tow',1,'siege'],mlrs:[.32,.96,'w',3,'rocket'],aa:[.39,.72,'w',3,'radar'],amph:[.48,.86,'t',4,'boat'],supply:[.32,1.03,'w',3,'cargo'],siege:[.59,.92,'t',5,'siege'],autocannon:[.3,.72,'w',3,'turret'],ifv:[.42,.88,'t',5,'carrier'],missile:[.31,1.04,'w',4,'rocket'],spg:[.48,.91,'t',5,'siege'],flak:[.45,.73,'t',4,'radar'],bike:[.14,.49,'bike',2,'bike'],sidecar:[.34,.54,'bike',2,'sidecar'],rocketbike:[.18,.62,'bike',2,'rocket'],quad:[.3,.49,'w',2,'open'],ambulance:[.32,.74,'w',2,'medical'],hospital:[.44,1.04,'w',4,'hospital'],recovery:[.44,.97,'t',5,'crane'],arsenal:[.38,1.13,'w',4,'cargo'],aa_cannon:[.44,.5,'tow',1,'aa'],sam:[.36,1.08,'w',4,'sam'],radar:[.3,.79,'w',3,'dish'],command:[.38,.78,'t',4,'dish'],smoke:[.35,.62,'w',2,'smoke'],atgun:[.35,.62,'tow',1,'casemate'],mortarcarrier:[.37,.76,'t',4,'mortar']};
function model(type,team=0){let d=A.D[type],v=d.variant||0,f=d.family||type,c=team===2?0x88908c:team?colors.red:colors.blue,accent=team===2?0xc3bcaa:team?0xe4b390:0xcad4b0,g=new T.Group();g.userData.rotors=[];
if(d.branch==='Infantry'){
 const role=d.model;const poses={rifle:[[-.13,-.1],[.13,.08],[.02,-.3]],marine:[[-.15,0],[.16,-.18]],assault:[[-.13,0],[.14,0]],ranger:[[-.16,-.15],[.12,.12]],grenadier:[[-.15,0],[.18,-.2]]};let spots=poses[role]||[[-.12,-.04],[.14,-.25]];if(v===3)spots=[[-.18,0],[.18,0]];if(v===4)spots=spots.concat([[0,-.4]]);spots.forEach(([x,z],i)=>soldier(g,c,x,z,role,v,d.design+i));
 if(['mortar','machinegun'].includes(role)){rod(g,0x617776,[-.14,.01,.23],[0,.23,.22],.014);rod(g,0x617776,[.14,.01,.23],[0,.23,.22],.014);if(role==='mortar')rod(g,0x374f56,[0,.04,.16],[0,.35,.26],.035);else barrel(g,0,.24,.1,.34,.018);}
 if(role==='grenadier')pack(g,0xad976c,-.05,.02,.2);if(role==='marine')hullAt(g,0x65756b,0,.01,-.32,.22,.11,.06);if(role==='commando')dish(g,0,.2,-.3,.06);
}else if(d.branch==='Armor'){
 let [w,l,chassis,axles,fit]=designs[f]||designs.light;
 if(v===1){w*=.85;l*=.88;}if(v===4){w*=1.16;l*=1.2;}if(v===5)l*=1.12;
 if(chassis==='bike'){
 for(let z of [-l*.35,l*.35])wheel(g,0,z,.1);rod(g,c,[0,.13,-l*.3],[0,.23,l*.25],.035);hullAt(g,c,0,.16,0,w*.8,l*.5,.09);soldier(g,c,0,-.06,'rifle',v,1);if(f==='sidecar'||v===3){wheel(g,.22,.02,.09);hullAt(g,c,.19,.13,0,.18,.29,.08);barrel(g,.19,.3,.03,.25);}if(f==='rocketbike'||v===4)rack(g,c,.06,.38,-.12,2);
 }else{
 if(chassis==='t'){for(let side of [-1,1]){let track=hullAt(g,0x263039,side*w*.46,.035,0,w*.22,l*.97,.15,2);for(let i=0;i<axles;i++)wheel(g,side*w*.53,(i/(axles-1)-.5)*l*.68,.067);for(let z=-l*.4;z<l*.42;z+=.09)rod(g,0x5a6667,[side*w*.38,.205,z],[side*w*.57,.205,z],.012);}}
 else for(let i=0;i<axles;i++)for(let side of [-1,1])wheel(g,side*w*.5,(axles===1?0:i/(axles-1)-.5)*l*.67,.085);
 if(chassis==='tow'){rod(g,0x697e70,[-w*.5,.06,-.4],[0,.16,0],.025);rod(g,0x697e70,[w*.5,.06,-.4],[0,.16,0],.025);hullAt(g,0x33464d,0,.12,0,w*.73,l*.63,.13);hullAt(g,c,0,.205,-l*.11,w*.57,l*.42,.075);for(let side of [-1,1])box(g,0x8d998e,side*w*.35,.08,-l*.14,.08,.12,.21);}else hull(g,c,w*.86,l,.17,fit==='open'?.08:.13,fit==='boat'?1:0);
 const utility=['cargo','medical','hospital','crane','dish','smoke','rocket','sam'].includes(fit);
 if(utility){hullAt(g,c,0,.29,l*.26,w*.8,l*.23,.19);hullAt(g,0x192f3b,0,.38,l*.33,w*.65,.025,.065);}
 if(['cargo','medical','hospital'].includes(fit)){if(fit==='cargo'){for(let i=0;i<(f==='arsenal'?3:2);i++)pack(g,0xa4a48a,0,.3,-l*.12-i*.18,w*.72,.15);if(d.serviceSlots>1)for(let x of [-w*.42,w*.42])rod(g,0xd7bb76,[x,.3,-.2],[x,.46,-.2],.024);}else{hullAt(g,0xc7cabb,0,.28,-l*.18,w*.85,l*.5,.25);rod(g,0x537e72,[-.07,.55,-.2],[.07,.55,-.2],.018);rod(g,0x537e72,[0,.55,-.27],[0,.55,-.13],.018);if(fit==='hospital')hullAt(g,0x959c86,w*.63,.02,-.14,w*.5,l*.6,.15);}}
 else if(fit==='crane'){rod(g,0xbbac79,[0,.28,-.22],[0,.68,-.4],.035);rod(g,0xbbac79,[0,.68,-.4],[0,.52,-.65],.028);rod(g,0x293a40,[0,.52,-.65],[0,.2,-.65],.006);}
 else if(fit==='dish'){dish(g,0,.62,-.22,f==='radar'?.2:.12);antenna(g,w*.3,.32,-.1,.38);}
 else if(['rocket','sam','smoke'].includes(fit))rack(g,c,0,.43,-.2,fit==='sam'?2:fit==='smoke'?5:4);
 else if(fit==='open'){hullAt(g,0x283b42,0,.25,-.1,w*.7,l*.25,.04);rod(g,0x6e8587,[-w*.4,.28,0],[-w*.4,.43,0],.012);rod(g,0x6e8587,[w*.4,.28,0],[w*.4,.43,0],.012);barrel(g,.05,.42,.04,.2);}
 else if(fit==='carrier'){hullAt(g,c,0,.3,-l*.17,w*.8,l*.5,.19);for(let x of [-w*.2,w*.2])for(let z of [-l*.3,-l*.1])lathe(g,0x91a79c,[[.045,0],[.045,.015],[.035,.025]],x,.515,z);hullAt(g,c,.07,.31,l*.26,w*.36,.17,.08);for(let i=0;i<d.weapons.length;i++)barrel(g,.07+i*.045,.41,l*.26,.18,.013);rod(g,0xc6c8ac,[-w*.3,.43,-l*.44],[w*.3,.43,-l*.44],.012);}
 else if(fit==='boat'){for(let side of [-1,1])hullAt(g,0x6a928d,side*w*.45,.23,0,.09,l*.85,.16,1);hullAt(g,0x243e48,0,.3,-.12,w*.55,l*.45,.02);hullAt(g,c,0,.3,l*.3,w*.65,.18,.12);for(let i=0;i<d.weapons.length;i++)barrel(g,i*.04,.44,l*.3,.16,.014);antenna(g,-w*.3,.4,-l*.35,.32);}
 else if(fit==='mortar'){hullAt(g,0x213844,0,.3,-.14,w*.6,l*.5,.025);for(let i=0;i<d.weapons.length;i++)rod(g,0x839a91,[(i-.5)*.09,.31,-.2],[(i-.5)*.09,.66,.04],.032);hullAt(g,c,0,.3,l*.3,w*.75,.16,.16);}
 else if(fit==='casemate'&&chassis!=='tow'){shell(g,c,[[-w*.4,-.2],[w*.4,-.2],[w*.3,.25],[-w*.3,.25]],.3,.1);for(let i=0;i<d.weapons.length;i++)barrel(g,(i-(d.weapons.length-1)/2)*.07,.37,.24,.61,.022);pack(g,0x8e9a80,-w*.26,.42,-.23,.1,.12);}
 else {let yy=chassis==='tow'?.17:.31;let turret=hullAt(g,c,0,yy,fit==='siege'?-.12:0,w*(fit==='casemate'?.85:.64),l*.35,fit==='siege'?.23:.14,fit==='casemate'?1:2);for(let i=0;i<(v===4&&d.weapons.length>=3?d.weapons.length-2:d.weapons.length);i++){let xx=(i-(d.weapons.length-1)/2)*.095;barrel(g,xx,yy+.13,l*.07,fit==='siege'?.55:fit==='casemate'?.6:fit==='mortar'?.19:.3,fit==='siege'?.038:.022);}lathe(g,accent,[[.06,0],[.06,.025],[.04,.035]],0,yy+(fit==='siege'?.26:.17),-.06);if(fit==='radar'||fit==='aa')dish(g,-w*.3,.49,-.16,.085);}
 }
 // Every kit adds a recognizable module, not just stretched hull dimensions.
 if(v===1){for(let side of [-1,1])cylinder(g,0xac9e76,side*w*.25,.31,-l*.42,.045,.15);}
 if(v===2){dish(g,w*.23,.58,-l*.25,.115);antenna(g,-w*.25,.3,-l*.3,.4);}
 if(v===3){for(let side of [-1,1])hullAt(g,0x82908b,side*w*.54,.24,0,.07,l*.7,.12);}
 if(v===4){for(let side of [-1,1]){hullAt(g,c,side*w*.43,.34,-l*.1,.15,.25,.12);if(!d.serviceSlots&&d.weapons.length>=3)barrel(g,side*w*.43,.47,0,.28);else pack(g,0xc0b189,side*w*.43,.48,-.1,.12,.12);}}
 if(v===5){antenna(g,-w*.35,.32,-l*.3,.55);pack(g,0xbab393,w*.36,.3,-l*.28,.13,.22);}
}else if(d.branch==='Air'){
 const rotor=['heli','transport','scoutheli','supplyheli','medevac'].includes(f),jet=['fighter','bomber','attackjet'].includes(f);
 const l=f==='transport'?1.15:f==='bomber'?1.15:f==='drone'?.55:f==='scoutheli'?.68:.9,w=f==='bomber'?.42:f==='transport'?.33:f==='scoutheli'?.19:.25;
 if(rotor){hull(g,c,w,l*.52,.15,.22,2);hullAt(g,0x213f50,0,.24,l*.23,w*.87,l*.2,.13,1);rod(g,c,[0,.24,-.18],[0,.31,-l*.65],.035);shell(g,c,[[-.2,-l*.56],[.2,-l*.56],[.1,-l*.7],[-.1,-l*.7]],.32,.025);for(let side of [-1,1]){rod(g,0x344952,[side*w*.55,.03,-.25],[side*w*.55,.03,.3],.014);rod(g,0x344952,[side*w*.55,.03,0],[side*w*.4,.2,0],.012);}
 const hubs=f==='transport'?[.2,-.3]:[0];for(let z of hubs){let r=new T.Group();r.position.set(0,.5,z);g.add(r);cylinder(r,0x919d94,0,0,0,.035,.12);for(let k=0;k<4;k++){let arm=new T.Group();arm.rotation.y=k*Math.PI/2;r.add(arm);shell(arm,0x33484e,[[.02,.02],[.055,.02],[.085,.52],[-.005,.57]],.04,.012);}g.userData.rotors.push(r);}
 if(f==='supplyheli')pack(g,0xbca77b,0,-.05,0,.26,.28);else if(f==='medevac'){pack(g,0xd1cfb9,0,.17,-.23,.23,.18);}else for(let side of [-1,1])rack(g,c,side*w*.72,.2,0,2);
 }else if(jet){hull(g,c,w,l,.08,.12,1);shell(g,c,[[-.08,-.35],[-.58,-.28],[-.48,-.06],[-.12,.25],[.12,.25],[.48,-.06],[.58,-.28],[.08,-.35]],.12,.035);hullAt(g,0x18394a,0,.2,.19,.11,.24,.065,2);for(let side of [-1,1]){let fin=shell(g,c,[[side*.08,-.38],[side*.15,-.48],[side*.18,-.24]],.18,.13);rod(g,0x263a44,[side*.11,.12,-.4],[side*.11,.12,-.56],.06);rack(g,c,side*.29,.05,-.04,f==='bomber'?3:1);}if(f==='attackjet')barrel(g,0,.1,.38,.21,.025);
 }else{hull(g,c,.16,.3,.12,.09,2);for(let side of [-1,1])for(let z of [-.2,.2]){rod(g,0x6a8787,[0,.15,0],[side*.26,.15,z],.016);let r=new T.Group();r.position.set(side*.26,.2,z);g.add(r);shell(r,0x303e49,[[-.13,-.015],[.13,-.015],[.13,.015],[-.13,.015]],0,.01);g.userData.rotors.push(r);}ball(g,0x192e3c,0,.08,.12,.045,.04,.045);}
 if(v===1){shell(g,accent,[[-.05,-.4],[.05,-.4],[0,-.7]],.25,.025);}if(v===2)ball(g,0xc6d1bf,0,.05,.36,.08,.08,.08);if(v===3)for(let side of [-1,1])rack(g,c,side*.36,.18,0,3);if(v===4){for(let side of [-1,1])hullAt(g,c,side*.17,.08,-.12,.1,.55,.16);barrel(g,0,.08,.3,.35,.03);}if(v===5)pack(g,0xd4c6a3,0,-.08,-.12,.21,.3);
}else{
 const config={patrol:[.24,.72],frigate:[.29,1.08],destroyer:[.32,1.24],battleship:[.43,1.48],landing:[.42,.87],sub:[.2,1.1],carrier:[.48,1.6],gunboat:[.34,.85]},[w,l]=config[f]||[.3,1];hull(g,0x2f4652,w,l,.02,.11,1);hull(g,c,w*.85,l*.88,.15,.04,1);
 if(f==='sub'){
 lathe(g,c,[[0,0],[.12,.08],[.13,.25],[.12,.8],[0,1]],0,.14,-.5).rotation.x=Math.PI/2;
 hullAt(g,c,0,.18,-.16,.1,.24,.18);antenna(g,0,.36,-.16,.18);
 for(let side of [-1,1]){cylinder(g,0x162d38,side*.12,.10,l*.42,.085,.13).rotation.x=Math.PI/2;box(g,0x8c9b9a,side*.12,.14,l*.44,.15,.11,.10);}
 box(g,0x687e7c,0,.37,-.25,.08,.10,.22);
 for(let side of [-1,1]){
  box(g,0x4e6a73,side*w*.65,.05,-l*.24,.05,.16,.26);
  box(g,0xa0aaa1,side*w*.78,.18,l*.12,.06,.13,.18);
  ball(g,0xa8b7b5,side*.08,.29,-.28,.035,.035,.035);
 }
 hullAt(g,0x536b70,0,.37,-.34,.13,.04,.29);
}
 else if(f==='carrier'){
 hull(g,0x6b7d7c,w*1.05,l*.9,.22,.05);
 for(let z=-l*.3;z<l*.4;z+=.13)rod(g,0xd6cfa9,[-.04,.29,z],[-.04,.29,z+.07],.008);
 hullAt(g,c,w*.35,.28,-.2,.12,.25,.21);
 for(const side of [-1,1]){
   hullAt(g,c,side*w*.78,.28,-l*.25,w*.18,.12,.15);
   barrel(g,side*w*.78,.33,-l*.18,.25,.017);
 }
 for(let i=0;i<3;i++){
   let x=-w*.25+(i%2)*w*.32,z=l*.25-i*l*.23;
   hullAt(g,0x9bafa9,x,.34,z,.10,.09,.27);
   shell(g,0xb7c5b5,[[x-.20,z-.04],[x+.20,z-.04],[x+.08,z+.10],[x-.08,z+.10]],.36,.018);
   hullAt(g,0x344c51,x,.39,z-.10,.065,.025,.09);
 }
}
 else if(f==='landing'){
 hullAt(g,0xb0b8a1,0,.21,0,w*.7,l*.6,.02);
 hullAt(g,c,0,.2,-l*.36,w*.7,.17,.15);
 shell(g,0x849c93,[[-w*.35,l*.3],[w*.35,l*.3],[w*.35,l*.56],[-w*.35,l*.56]],.19,.025);
 for(let side of [-1,1]){
   hullAt(g,0x334952,side*w*.52,.30,-l*.27,.14,.14,.17);
   barrel(g,side*w*.52,.37,-l*.20,.22,.016);
   box(g,0xb2b19f,side*w*.46,.28,l*.18,.16,.12,.26);
 }
 box(g,0xc0be9f,0,.22,l*.44,w*.62,.07,.12);
}
 else{
 hullAt(g,accent,0,.21,-l*.12,w*.62,l*.27,.17);
 hullAt(g,c,0,.4,-l*.13,w*.42,.15,.08);
 dish(g,0,.62,-l*.18,.07);
 const n=d.weapons.length;
 for(let i=0;i<n;i++){
   const z=l*.39-i*l*.78/Math.max(n-1,1);
   const side=n>2?(i%2?-.22:.22)*w:0;
   hullAt(g,c,side,.215,z,w*.48,.145,.11);
   hullAt(g,0x374e54,side,.305,z,w*.38,.08,.085);
   barrel(g,side,.34,z,.22+(f==='battleship'?.13:0),.023);
   if(f==='destroyer'||f==='frigate'||f==='battleship')barrel(g,side+.08,.34,z,.21+(f==='battleship'?.13:0),.015);
 }
 for(let side of [-1,1]){box(g,0x799494,side*w*.7,.19,-l*.10,.09,.17,.18);}
}
 if(v===1)for(let side of [-1,1])hullAt(g,c,side*w*.55,.05,-.1,.06,l*.65,.07,1);if(v===2)dish(g,w*.25,.55,0,.13);if(v===3)rack(g,c,0,.3,l*.08,4);if(v===4){hullAt(g,c,0,.22,-l*.32,w*.7,.23,.18);barrel(g,0,.43,-l*.2,.42,.03);}if(v===5)pack(g,0xbfb38f,0,.26,l*.1,w*.7,.24);
}
// Finishing passes retain silhouette-first scale and faction readability.
if(d.branch==='Navy'){
 const profile={patrol:.72,frigate:1.08,destroyer:1.24,battleship:1.48,landing:.87,sub:1.1,carrier:1.6,gunboat:.85}[f]||1;
 const beam={patrol:.24,frigate:.29,destroyer:.32,battleship:.43,landing:.42,sub:.2,carrier:.48,gunboat:.34}[f]||.3;
 if(f!=='sub'){
  for(const side of [-1,1]){
   rod(g,0x829693,[side*beam*.43,.25,-profile*.40],[side*beam*.43,.25,profile*.36],.009);
   for(let i=0;i<5;i++){
    let zz=-profile*.31+i*profile*.15;
    rod(g,0x6d8584,[side*beam*.43,.17,zz],[side*beam*.43,.265,zz],.009);
   }
  }
  for(const side of [-1,1])for(let i=0;i<4;i++){
   ball(g,0xc2c6b4,side*beam*.42,.11,-profile*.26+i*profile*.17,.024,.021,.024);
  }
  const mast=f==='carrier'?-.26:-.2;
  antenna(g,0,.43,mast,.33);
  ball(g,0xe2c584,-beam*.34,.30,profile*.28,.018,.02,.018);
  ball(g,0xd26d5c,beam*.34,.30,profile*.28,.018,.02,.018);
 }
 if(f==='carrier'){
  for(let i=0;i<3;i++)box(g,0xf0e0a3,-.02,.365,profile*.31-i*.11,.22,.013,.015);
  box(g,0x495f66,beam*.36,.35,.1,.15,.21,.26);
  dish(g,beam*.36,.57,.1,.095);
 }
 if(f==='battleship'||f==='destroyer'){
  for(const side of [-1,1])for(let i=0;i<2;i++){
   hullAt(g,0x516972,side*beam*.52,.23,profile*(i?-.3:.29),.13,.09,.08);
   barrel(g,side*beam*.52,.29,profile*(i?-.3:.29),.17,.012);
  }
 }
}
if(d.branch==='Armor'){
 // Visible running lights, angular armor plates and stowage identify complete chassis.
 for(const side of [-1,1]){
  box(g,side<0?0xe3cb9b:0x8faaa1,side*.13,.245,.32,.07,.043,.03);
  if(v>=2)box(g,0x566c66,side*.17,.33,-.27,.11,.08,.17);
 }
}
if(d.branch==='Air'){
 for(const side of [-1,1])ball(g,side<0?0xd46c61:0xaed1ad,side*.16,.15,-.18,.023,.021,.024);
}
if(d.branch==='Infantry'){
 // Distinct squad equipment prevents small figures from reading as missing torsos.
 if(d.model==='machinegun'||d.model==='mortar')box(g,0x6c8275,-.03,.07,-.27,.24,.13,.2);
 if(v>=3)box(g,0x9a9e7d,0,.12,-.17,.18,.19,.09);
}
g.userData.variant=type;return g;}
window.AtlasArt={T,A,colors,mat,mesh,box,cylinder,cone,ball,bevel,rod,model,boxGeo,sphereGeo};window.AtlasModels={model};
})();
