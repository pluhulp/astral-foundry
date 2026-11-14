// Stylized, deterministic miniature models. Geometry is local and works offline.
const ModelKit=(()=>{
 const T=window.THREE,cream=0xffe4ad,ink=0x283c50,orange=0xf27a41,teal=0x53b6ad;
 const hash=s=>Array.from(String(s)).reduce((n,c)=>(n*31+c.charCodeAt(0))>>>0,7);
 const material=c=>new T.MeshStandardMaterial({color:c,roughness:1,metalness:0,flatShading:true});
 function mesh(g,geo,c,x=0,y=0,z=0){const o=new T.Mesh(geo,material(c));o.position.set(x,y,z);g.add(o);return o}
 const box=(g,c,x,y,z,w,h,d)=>mesh(g,new T.BoxGeometry(w,h,d),c,x,y,z);
 const orb=(g,c,r,x=0,y=0,z=0,detail=1)=>mesh(g,new T.IcosahedronGeometry(r,detail),c,x,y,z);
 const cylinder=(g,c,r,h,x=0,y=0,z=0,n=8)=>mesh(g,new T.CylinderGeometry(r,r,h,n),c,x,y,z);
 function ring(g,r,c,t=.035,tilt=0){const o=mesh(g,new T.TorusGeometry(r,t,5,40),c);o.rotation.x=Math.PI/2+tilt;return o}
 function surface(g,c,r,lat,lon,size=.12,kind='cone'){const n=new T.Vector3(Math.cos(lat)*Math.cos(lon),Math.sin(lat),Math.cos(lat)*Math.sin(lon)),o=mesh(g,kind==='cone'?new T.ConeGeometry(size,size*2,5):new T.IcosahedronGeometry(size,0),c);o.position.copy(n.multiplyScalar(r));o.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),n.normalize());return o}
 function planet(g,id,r=1.35){const p=new T.Group();p.userData.worldId=id;g.add(p);const colors=[0x4c99b2,0xaab3b4,0x98715b,0xe6b46c,0xc76b4c,0xd9b18c,0xd9cb93,0x73cac5,0x5b78bb];const core=orb(p,colors[id],r,0,0,0,2);core.userData.worldId=id;
 if(id===0){for(let i=0;i<38;i++){let a=i*2.399,b=Math.asin(Math.sin(i*1.71)*.83);if(Math.sin(a*2)+Math.cos(b*4)>.1){const land=surface(p,i%3?0x9cc580:0x729d67,r*.99,b,a,r*.19,'rock');land.scale.y=.35}}for(let i=0;i<9;i++){const cloud=new T.Group();p.add(cloud);const a=i*2.399,b=Math.sin(i)*.7;for(let j=0;j<3;j++)surface(cloud,cream,r*1.04,b,a+j*.09,r*.095,'rock')}surface(p,0xeaf1d4,r*.98,1.53,0,r*.33,'rock');}
 if(id===1||id===2){for(let i=0;i<16;i++){const a=i*2.399,b=Math.asin(Math.sin(i*1.6)*.9),crater=surface(p,id===1?0x637888:0x604e49,r*.99,b,a,r*(.09+i%3*.03),'rock');crater.scale.y=.24}if(id===1){const flag=new T.Group();p.add(flag);flag.position.set(.2,r*.95,.1);cylinder(flag,cream,.018,r*.4,0,r*.16,0);box(flag,orange,r*.12,r*.3,0,r*.23,r*.14,.025)}}
 if(id===3){for(let i=0;i<5;i++){const band=ring(p,r*Math.sqrt(1-Math.pow((i-2)*.28,2)),i%2?cream:0xce895b,r*.075);band.position.y=(i-2)*r*.28}for(let i=0;i<6;i++)surface(p,0xffd88c,r,Math.sin(i)*.8,i*2.3,r*.15,'rock')}
 if(id===4){for(let i=0;i<12;i++)surface(p,i%2?0x954d42:0xe89b66,r*.97,Math.sin(i*2)*.8,i*2.399,r*(.08+i%4*.035));surface(p,cream,r*.95,1.5,0,r*.3,'rock');const canyon=ring(p,r*.99,0x7d4140,r*.032,.7);canyon.rotation.z=.8}
 if(id===5||id===6){for(let i=-3;i<=3;i++){const band=ring(p,r*Math.sqrt(1-Math.pow(i*.23,2)),i%2?0xba8065:cream,r*.055);band.position.y=i*r*.23}if(id===5){const storm=surface(p,0xbd624e,r*.99,-.25,.5,r*.23,'rock');storm.scale.set(1.5,.3,.65)}else{for(let i=0;i<3;i++)ring(p,r*(1.45+i*.18),i%2?cream:0xd99a66,r*.065,.2)}}
 if(id===7){p.rotation.z=1.35;ring(p,r*1.65,cream,r*.04,.2);for(let i=0;i<8;i++)surface(p,0xb6e5cd,r*.97,Math.sin(i)*.8,i*2.399,r*.12,'rock')}
 if(id===8){for(let i=0;i<6;i++){const band=ring(p,r*(.8+i%2*.15),i%2?0x8ba9e1:0x405997,r*.04,.1);band.position.y=(i-2.5)*r*.25}surface(p,0x243a6b,r,-.3,1,r*.22,'rock')}
 return p}
 function world(g,id){const moves=[];if(id<9){const p=planet(g,id);moves.push(t=>p.rotation.y=t*.08);if(id===0){const sat=new T.Group();g.add(sat);box(sat,cream,0,0,0,.2,.2,.2);box(sat,orange,0,0,0,.8,.03,.3);moves.push(t=>{sat.position.set(Math.cos(t*.18)*2,.3,Math.sin(t*.18)*2);sat.rotation.y=-t*.18})}return moves}
 if(id===9){for(let i=0;i<110;i++){let a=i*2.399,r=1.45+(i%11)/11*.95;const rock=orb(g,i%4?0x8aa9ab:cream,.03+(i%5)*.014,Math.cos(a)*r,Math.sin(i*4)*.14,Math.sin(a)*r,0);rock.scale.set(1,1+i%3*.3,.65)}ring(g,1.4,teal,.012);ring(g,2.5,teal,.012);moves.push(t=>g.rotation.y=t*.04)}
 else if(id===10)return structure(g,'wonder',4);
 else if(id===11){orb(g,0xffbf59,.67,-.8,.1,0,2);orb(g,0xffe8aa,.43,.9,-.1,0,1);orb(g,0xe97d55,.2,1.7,.5,-.4);ring(g,2,teal,.015,.3)}
 else if(id===13)return structure(g,'penrose',4);
 else if(id===12){for(let i=0;i<140;i++){let r=Math.sqrt(i/140)*2.3,a=r*2.4+i%4*Math.PI/2;orb(g,i%3?0xa8b8d4:cream,.025+i%3*.01,Math.cos(a)*r,Math.sin(i)*.12,Math.sin(a)*r,0)}orb(g,cream,.25);moves.push(t=>g.rotation.y=t*.04)}
 else if(id===14){for(let k=0;k<5;k++){let a=k*2.4,cx=Math.cos(a)*1.5,cz=Math.sin(a)*1.2;for(let i=0;i<25;i++){let r=i/25*.55,b=i*2.4;orb(g,[cream,teal,orange,0xa894c7,0x85acbf][k],.035,cx+Math.cos(b)*r,Math.sin(k)*.4,cz+Math.sin(b)*r,0)}}}
 else{const points=[];for(let i=0;i<18;i++){let a=i*2.4,r=1.1+(i%3)*.5,v=new T.Vector3(Math.cos(a)*r,Math.sin(i*1.7)*1.2,Math.sin(a)*r);points.push(v);orb(g,i%2?teal:cream,.11,v.x,v.y,v.z)}for(let i=0;i<points.length;i++)for(let j=i+1;j<points.length;j++)if(points[i].distanceTo(points[j])<1.7)beam(g,points[i],points[j],0x777eaa,.016)}return moves}
 function beam(g,a,b,c,r=.05){const d=new T.Vector3().subVectors(b,a),o=cylinder(g,c,r,d.length());o.position.copy(a).add(b).multiplyScalar(.5);o.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),d.normalize());return o}
 function factory(g,id){const m=machines.find(m=>m.id===id),h=hash(id),index=machines.indexOf(m),c=R[Object.keys(m.out)[0]]?.[2]||teal,name=(id+' '+m.name).toLowerCase(),moves=[];
 const base=cylinder(g,ink,1.8,.15,0,-.12,0,6);base.rotation.y=(h%6)*Math.PI/6;
 // Per-design chassis, plumbing and instrument layouts encode its unique recipe.
 const chassis=new T.Group();g.add(chassis);for(let i=0;i<2+h%4;i++){let a=i*2.4+h;box(chassis,orange,Math.cos(a)*1.4,.02,Math.sin(a)*1.4,.25,.08,.12)}
 const tower=(x,z,height=.9)=>{box(g,cream,x,height/2,z,.4,height,.42);box(g,c,x,height+.06,z,.46,.12,.48);box(g,ink,x,height*.65,z+.22,.24,.17,.02)};
 if(/wood|forest|biomass/.test(name)){for(let i=0;i<3+h%4;i++){let a=i*2.4; cylinder(g,0x8e6146,.06,.5,Math.cos(a),.25,Math.sin(a));mesh(g,new T.ConeGeometry(.27,.75,5),0x88ad6d,Math.cos(a),.8,Math.sin(a))}const drone=new T.Group();g.add(drone);box(drone,orange,0,0,0,.5,.2,.35);for(let i=0;i<4;i++){const b=box(drone,cream,(i%2-.5)*.7,.14,(Math.floor(i/2)-.5)*.6,.42,.025,.08);moves.push(t=>b.rotation.y=t*12)}moves.push(t=>drone.position.set(Math.sin(t*.5),1.4,Math.cos(t*.5)*.4))}
 else if(/solar|photovoltaic|sail|collector/.test(name)){for(let i=0;i<2+h%4;i++){let x=(i%3-1)*.9,z=Math.floor(i/3)*1-.4;cylinder(g,cream,.045,.65,x,.3,z);const panel=box(g,0x4e8da8,x,.75,z,.8,.08,.8);panel.rotation.x=-.45;for(let j=0;j<3;j++)box(panel,0x9fd6cc,(j-1)*.23,.05,0,.18,.015,.65)}tower(0,-1,.5)}
 else if(/wind|turbine|hydro|tidal/.test(name)){for(let i=0;i<1+h%3;i++){const x=(i-(h%3)/2)*.9;cylinder(g,cream,.075,1.35,x,.7,0);const rotor=new T.Group();rotor.position.set(x,1.4,.15);g.add(rotor);orb(rotor,orange,.15);for(let j=0;j<3;j++){const blade=box(rotor,teal,0,0,0,.12,1.15,.06);blade.rotation.z=j*Math.PI*2/3;blade.geometry.translate(0,.45,0)}moves.push(t=>rotor.rotation.z=t*1.7)}}
 else if(/fuel|methalox|kerolox|hydrogen|oxygen|water|oil|gas|helium|refin|chem|plasma/.test(name)){for(let i=0;i<2+h%3;i++){let x=(i%2-.5)*.95,z=Math.floor(i/2)*.8-.5,ht=.75+(h%5)*.12; cylinder(g,cream,.32,ht,x,ht/2,z);orb(g,c,.32,x,ht,z);ring(g,.34,orange,.035).position.set(x,ht*.4,z);beam(g,new T.Vector3(x,.25,z),new T.Vector3(0,.25,.9),teal,.06)}tower(.8,.8,.55);const pump=box(g,orange,0,.35,.9,.35,.35,.3);moves.push(t=>pump.position.y=.35+Math.sin(t*4)*.07)}
 else if(/research|lab|data|comput|memory|analy/.test(name)||m.cat==='Research'){for(let i=0;i<2+h%3;i++)tower((i%2-.5)*.8,Math.floor(i/2)*.8-.5,.7+i*.13);const dish=mesh(g,new T.ConeGeometry(.55,.25,10,1,true),teal,0,1.6,0);dish.rotation.z=.7;cylinder(g,orange,.045,.7,0,1.15,0);moves.push(t=>dish.rotation.y=t*.5)}
 else if(/black|penrose|hawking|gravity|singular|vacuum|zero.point|dark/.test(name)){orb(g,ink,.48,0,.9,0);for(let i=0;i<3;i++){const q=ring(g,.7+i*.17,i%2?orange:cream,.055,i*.65);q.position.y=.9;moves.push(t=>q.rotation.z=t*.3+i)}for(let i=0;i<3;i++)tower(Math.cos(i*2.1)*1.25,Math.sin(i*2.1)*1.25,.45)}
 else if(m.energy>0||/fusion|fission|reactor/.test(name)){cylinder(g,cream,.7,.8,0,.4,0);orb(g,c,.5,0,.9,0);const q=ring(g,.83,orange,.09,.55);q.position.y=.9;moves.push(t=>q.rotation.y=t*.6);for(let i=0;i<2+h%3;i++){const a=i*2.4; cylinder(g,teal,.16,.8,Math.cos(a)*1.2,.4,Math.sin(a)*1.2);orb(g,cream,.17,Math.cos(a)*1.2,.85,Math.sin(a)*1.2)}}
 else if(/crystal|gem|quartz|diamond|silic/.test(name)){for(let i=0;i<4+h%4;i++){const a=i*2.4,q=mesh(g,new T.OctahedronGeometry(.22,0),c,Math.cos(a),.35,Math.sin(a));q.scale.y=1.5+i%3*.4}tower(0,0,1.15);const arm=box(g,orange,0,1.3,0,1.5,.12,.14);moves.push(t=>arm.rotation.y=t*.4)}
 else if(/forge|smelt|kiln|furnace|charcoal|alloy/.test(name)){cylinder(g,cream,.65,1,0,.5,0);cylinder(g,ink,.24,.8,.35,1.2,-.2);box(g,orange,0,.4,.62,.5,.35,.04);for(let i=0;i<3;i++)box(g,c,(i-1)*.6,.15,1,.45,.15,.2)}
 else if(/fabric|circuit|assembly|nano|processor/.test(name)){box(g,cream,0,.6,0,1.4,1,.8);box(g,ink,0,.7,.42,1,.6,.03);const arm=box(g,orange,0,1.3,0,1.7,.1,.12);moves.push(t=>arm.rotation.y=Math.sin(t)*.6);for(let i=0;i<3;i++)box(g,c,(i-1)*.55,.12,1,.3,.08,.3)}
 else{tower(-.7,-.5,1.25);tower(.7,-.5,.7);box(g,cream,0,1.4,0,1.8,.15,.2);const drill=mesh(g,new T.ConeGeometry(.28,.8,6),orange,0,.65,0);for(let i=0;i<4;i++)ring(drill,.25-i*.045,cream,.03).position.y=-.2+i*.15;moves.push(t=>{drill.rotation.y=t*4;drill.position.y=.7+Math.sin(t*2)*.12});box(g,ink,0,.1,1,2.6,.1,.5);for(let i=0;i<4;i++){const ore=orb(g,c,.12,0,0,0,0);moves.push(t=>ore.position.set((t*.35+i*.65)%2.6-1.3,.3,1))}}
 // Every machine has a distinct silhouette, not merely a recolored clone.
 const level=Math.max(0,m.stage),podCount=1+index%5;
 for(let i=0;i<podCount;i++){const a=(i/podCount)*Math.PI*2+(h%100)/100;const x=Math.cos(a)*1.45,z=Math.sin(a)*1.45;const pod=mesh(g,index%2?new T.CylinderGeometry(.09,.16,.25+level*.025,5):new T.BoxGeometry(.18,.22+level*.04,.18),i%2?c:cream,x,.15+level*.02,z);pod.rotation.y=a}
 const antenna=cylinder(g,orange,.018,.25+(index%7)*.09,-1,.9,-.7);orb(g,c,.07,-1,1.03+(index%7)*.045,-.7,0);
 g.scale.set(1, .86+(h%13)*.025,1);g.rotation.y=(h%12)*.13;g.userData.design=id;return moves}
 function structure(g,id,progress=4){const h=hash(id),idx=megas.some(m=>m.id===id)?megas.findIndex(m=>m.id===id):hash(id)%31,moves=[],built=c=>progress?c:0x7d8a8b;
 if(/wonder|habitat|station|elevator|wormhub/.test(id)){cylinder(g,built(cream),.28,1.8);for(let i=0;i<2+idx%3;i++){const r=ring(g,.8+i*.27,built(teal),.09,i*.27);r.position.y=(i-1)*.35;for(let j=0;j<4;j++){const a=j*Math.PI/2;box(r,i<progress?orange:ink,Math.cos(a)*(.8+i*.27),Math.sin(a)*(.8+i*.27),0,.3,.2,.12)}}}
 else if(/penrose|blackhole|hawking/.test(id)){orb(g,ink,.6);for(let i=0;i<7;i++)ring(g,.85+i*.12,i<progress*2?orange:ink,.05,.2);for(let i=0;i<3;i++){const p=box(g,cream,Math.cos(i*2.1)*1.9,.3,Math.sin(i*2.1)*1.9,.25,.6,.25);moves.push(t=>p.rotation.y=t*.5)}}
 else if(/brain|comput|archive/.test(id)){orb(g,teal,.8,0,0,0,1);for(let i=0;i<12;i++){let a=i*2.4;box(g,i%4<progress?cream:ink,Math.cos(a)*1.4,Math.sin(i)*.6,Math.sin(a)*1.4,.35,.35,.35)}ring(g,1.9,orange)}
 else if(/web|loom|reality|universe/.test(id)){const vertices=[];for(let i=0;i<8;i++){let v=new T.Vector3(i&1?1:-1,i&2?1:-1,i&4?1:-1);vertices.push(v);orb(g,i%4<progress?teal:ink,.18,v.x,v.y,v.z)}for(let i=0;i<8;i++)for(let j=i+1;j<8;j++)if(vertices[i].distanceTo(vertices[j])<2.1)beam(g,vertices[i],vertices[j],cream,.035);orb(g,orange,.5)}
 else{orb(g,0xffbb57,.5);const count=2+idx%5;for(let i=0;i<count;i++){const r=ring(g,.9+i*.2,i%4<progress?cream:ink,.035,(h%5)*.2+i*.45);for(let j=0;j<3+idx%6;j++){let a=j*Math.PI*2/(3+idx%6);box(r,i%4<progress?teal:ink,Math.cos(a)*(.9+i*.2),Math.sin(a)*(.9+i*.2),0,.18+(idx%3)*.06,.12,.07)}moves.push(t=>r.rotation.z=t*(.05+i*.025))}}
 // Different engineering ID = different assembly and attachment arrangement.
 for(let i=0;i<1+idx%4;i++){let a=i*2.4+(h%11);box(g,progress>i?orange:ink,Math.cos(a)*1.85,Math.sin(a)*.7,Math.sin(a)*1.85,.14,.14,.4)}return moves}
 function resource(g,id){const r=R[id],h=hash(id),c=r[2],name=r[0].toLowerCase();cylinder(g,ink,1.2,.12,0,-.6,0,6);
 if(/hydrogen|helium|oxygen|methane|gas|neon|argon|krypton|nitrogen/.test(name)){cylinder(g,cream,.45,1,0,0,0);orb(g,c,.45,0,.5,0);box(g,orange,0,.92,0,.35,.12,.15);ring(g,.46,c,.08).position.y=-.2}
 else if(/data|research|memory|axiom|map/.test(name)){for(let i=0;i<3+h%3;i++){const q=box(g,i%2?cream:c,0,-.35+i*.22,0,1,.12,.7);q.rotation.y=i*.2}orb(g,orange,.15,0,1,0)}
 else if(/wood|charcoal|carbon/.test(name)){for(let i=0;i<3;i++){const q=cylinder(g,c,.22,1,(i-1)*.35,-.2,i%2*.25);q.rotation.z=Math.PI/2}}
 else if(/metal|iron|copper|alloy|steel|titanium|alumin|gold|silver/.test(name)){for(let i=0;i<3+h%3;i++)box(g,i%2?cream:c,(i%2-.5)*.5,-.35+Math.floor(i/2)*.22,0,.45,.2,.8)}
 else{for(let i=0;i<3+h%5;i++){const a=i*2.4,q=mesh(g,new T.OctahedronGeometry(.25+i%3*.07,0),i%3?c:cream,Math.cos(a)*.45,0,Math.sin(a)*.45);q.scale.y=1.2+(h%7)*.2;q.rotation.z=Math.sin(a)*.35}}
 g.rotation.y=(h%10)*.3;return [t=>g.rotation.y=t*.12+(h%10)*.3]}
 return {planet,world,factory,structure,resource};
})();
