/* Diorama battlefield, shared art and cached rendering. */
(function(){'use strict';
const {T,A,colors,mat,mesh,box,cylinder,cone,ball,bevel,rod,model,boxGeo,sphereGeo}=window.AtlasArt;
// Faceted asymmetrical cliff geometry: multiple uneven ridge peaks rather than cone primitives.
const cragGeometries=Array.from({length:5},(_,v)=>{
 const xs=[-.48,-.3,-.07,.18,.39,.5],heights=[.13,.62+(v%2)*.18,.96-(v%3)*.1,.7+(v%3)*.08,.35,.11];
 const out=[],push=(a,b,c)=>out.push(...a,...b,...c);
 for(let i=0;i<xs.length-1;i++){
  const xa=xs[i],xb=xs[i+1],za=Math.sin((i+v)*1.7)*.09,zb=Math.sin((i+v+1)*1.7)*.09;
  const ra=[xa,heights[i],za],rb=[xb,heights[i+1],zb];
  push([xa,0,-.47],ra,rb);push([xa,0,-.47],rb,[xb,0,-.47]);
  push(ra,[xa,0,.47],rb);push(rb,[xa,0,.47],[xb,0,.47]);
  push([xa,0,-.47],[xb,0,-.47],[xb,0,.47]);push([xa,0,-.47],[xb,0,.47],[xa,0,.47]);
 }
 const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(out,3));g.computeVertexNormals();return g;
});
function crag(g,c,x,y,z,sx,sy,sz,variant=0){return mesh(g,cragGeometries[variant%5],c,x,y,z,sx,sy,sz);}
const pineGeo=new T.CylinderGeometry(.09,.29,.43,6);
function pine(g,x,z,n,snow){const h=.64+(n%4)*.12;rod(g,0x765f4c,[x,0,z],[x,h*.86,z],.036);for(let k=0;k<3;k++){let r=mesh(g,pineGeo,snow?k===2?0xe9ece6:0x315c57:[0x244e42,0x326451,0x407260][k],x,h*.28+k*h*.22,z,(.95-k*.17),(.9-k*.10),(.95-k*.17));r.rotation.y=n*.35;}if(n%4===0)ball(g,0x72987b,x+.2,.08,z-.23,.13,.08,.10);}

const TOY_FELT=0x52675d;
const TOY_PALETTE=[0xa88e6d,0x769d9b,0xd7b779,0xc87864,0x556c71];
function addToyProp(parent,s,t){
 // One curated object per ~4x4 tiles, rather than an identical plastic pile on every ruin.
 const cx=Math.floor(t.x/4),cy=Math.floor(t.y/4),seed=s.mission.seed|0;
 const h=((cx*73856093)^(cy*19349663)^(seed*83492791))>>>0;
 if(t.x!==cx*4+h%4||t.y!==cy*4+(h>>>4)%4)return;
 const type=(h>>>9)%5,angle=((h>>>14)%12)*Math.PI/6;
 const x=t.x-s.w/2+.5,z=t.y-s.h/2+.5,g=new T.Group();
 g.position.set(x,0,z);g.rotation.y=angle;g.userData.toyProp=type;parent.add(g);
 const wood=TOY_PALETTE[0],blue=TOY_PALETTE[1],gold=TOY_PALETTE[2],red=TOY_PALETTE[3],ink=TOY_PALETTE[4];
 if(type===0){ // Little matching wooden construction blocks.
   box(g,wood,-.14,.16,-.05,.43,.32,.39);
   box(g,gold,.14,.13,.14,.31,.26,.31);
   box(g,blue,-.14,.38,-.05,.28,.16,.27);
 }else if(type===1){ // Wind-up tin car, with a consistent toy-scale footprint.
   box(g,blue,0,.17,0,.72,.20,.34);box(g,red,-.08,.31,-.04,.29,.16,.26);
   for(const sx of [-.25,.25])for(const sz of [-.2,.2]){
     const w=cylinder(g,ink,sx,.105,sz,.085,.07);w.rotation.x=Math.PI/2;
   }
   box(g,gold,.27,.21,0,.045,.065,.25);
 }else if(type===2){ // Spool and a single loose die.
   cylinder(g,wood,-.15,.16,0,.19,.26);
   cylinder(g,gold,-.15,.32,0,.23,.045);
   box(g,blue,.21,.15,.06,.31,.3,.3);
   for(const [a,b] of [[.12,0],[.28,.12]])ball(g,ink,a,.307,b,.025,.012,.025);
 }else if(type===3){ // Small two-piece toy fort, not a repeated tower.
   box(g,red,0,.16,-.15,.65,.32,.22);box(g,wood,-.2,.30,.14,.24,.60,.22);
   box(g,wood,.2,.30,.14,.24,.60,.22);
   box(g,gold,0,.58,.12,.6,.10,.27);
 }else{ // A domino and wooden marker.
   box(g,wood,-.11,.09,-.07,.29,.18,.58);
   for(const [px,pz] of [[-.20,-.24],[-.04,-.12],[-.19,.04],[-.04,.15]])ball(g,ink,px,.19,pz,.023,.012,.023);
   cylinder(g,red,.25,.10,.18,.13,.18);
 }
}
class View{
constructor(canvas,labels){this.canvas=canvas;this.labels=labels;this.scene=new T.Scene();this.scene.background=new T.Color(0x8ba9b4);this.scene.fog=new T.Fog(0xa9bac1,36,85);this.scene.add(new T.HemisphereLight(0xffffff,0x687964,2));let sun=new T.DirectionalLight(0xffefd2,2.5);sun.position.set(-8,16,10);this.scene.add(sun);this.camera=new T.PerspectiveCamera(42,1,.12,240);this.eye=new T.Vector3(-18,19,22);this.yaw=2.50;this.pitch=-.60;this.flightSpeed=9;this.controls='flight';this.keys=new Set();this.flightVelocity=new T.Vector3();this.flightTick=0;this.cameraEase=null;this.backdrop=new T.Group();this.scene.add(this.backdrop);this.groups=new Map();this.labelsMap=new Map();this.ray=new T.Raycaster();this.pointer=new T.Vector2();this.animations=[];this.effects=[];this.last=0;this.motion=true;this.dirty=true;this.staticFaces=null;this.metrics={frames:0,renderMs:0,staticBuilds:0};this.selectedId=null;
try{this.renderer=new T.WebGLRenderer({canvas,antialias:true,powerPreference:'low-power'});this.renderer.setPixelRatio(Math.min(devicePixelRatio,1.25));this.renderer.outputColorSpace=T.SRGBColorSpace;this.renderer.toneMapping=T.ACESFilmicToneMapping;this.renderer.toneMappingExposure=1.1;this.renderer.shadowMap.enabled=true;this.renderer.shadowMap.type=T.PCFSoftShadowMap;sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);Object.assign(sun.shadow.camera,{left:-22,right:22,top:22,bottom:-22});sun.shadow.bias=-.002;this.software=false;}catch(e){this.software=true;let replacement=document.createElement('canvas');replacement.id=canvas.id;canvas.replaceWith(replacement);this.canvas=replacement;this.ctx=replacement.getContext('2d');}
this.tileGroup=new T.Group();this.unitGroup=new T.Group();this.markGroup=new T.Group();this.fogGroup=new T.Group();this.scene.add(this.tileGroup,this.unitGroup,this.markGroup,this.fogGroup);this.resize();this.bind();this.resizeObserver=new ResizeObserver(()=>this.resize());this.resizeObserver.observe(this.canvas.parentElement);requestAnimationFrame(t=>this.frame(t));}
// A true free camera: neither the level nor the view target is rotated around a central pivot.
direction(){const c=Math.cos(this.pitch);return new T.Vector3(Math.sin(this.yaw)*c,Math.sin(this.pitch),Math.cos(this.yaw)*c);}
clampEye(){
 if(!this.eye)return;
 const limX=(this.state?.w||26)*1.65,limZ=(this.state?.h||22)*1.9;
 this.eye.x=Math.max(-limX,Math.min(limX,this.eye.x));
 this.eye.y=Math.max(1.35,Math.min(85,this.eye.y));
 this.eye.z=Math.max(-limZ,Math.min(limZ,this.eye.z));
}
fly(forward=0,right=0,up=0,amount=1){
 const side=new T.Vector3(-Math.cos(this.yaw),0,Math.sin(this.yaw));
 const ahead=new T.Vector3(Math.sin(this.yaw),0,Math.cos(this.yaw));
 const delta=ahead.multiplyScalar(forward).addScaledVector(side,right).add(new T.Vector3(0,up,0));
 if(delta.lengthSq()===0)return;
 delta.normalize().multiplyScalar(amount);
 this.eye.add(delta);this.clampEye();this.cameraUpdate();
}
panByPixels(dx,dy){
 const scale=Math.max(.008,this.eye.y*.0014);
 const side=new T.Vector3(-Math.cos(this.yaw),0,Math.sin(this.yaw));
 const ahead=new T.Vector3(Math.sin(this.yaw),0,Math.cos(this.yaw));
 this.eye.addScaledVector(side,-dx*scale).addScaledVector(ahead,dy*scale);
 this.clampEye();this.cameraUpdate();
}
lookBy(dx,dy=0){
 this.yaw+=dx;this.pitch=Math.max(-1.43,Math.min(.44,this.pitch+dy));this.cameraUpdate();
}
dolly(steps){
 this.eye.addScaledVector(this.direction(),Math.max(-9,Math.min(9,steps)));
 this.clampEye();this.cameraUpdate();
}
setKey(key,pressed){if(!this.keys)this.keys=new Set();const k=String(key).toLowerCase();if(pressed)this.keys.add(k);else this.keys.delete(k);}
releaseKeys(){this.keys?.clear();this.flightVelocity?.set(0,0,0);this.flightTick=0;}
flightStep(now){
 if(!this.eye||!this.keys)return false;
 const previous=this.flightTick||now;this.flightTick=now;
 const dt=Math.max(0,Math.min(.06,(now-previous)/1000));
 if(!dt)return false;
 const key=k=>this.keys.has(k);
 const f=+(key('w')||key('arrowup'))-+(key('s')||key('arrowdown'));
 const side=+key('d')-+key('a'),up=+key('e')-+key('q');
 const input=new T.Vector3(side,up,f);
 if(input.lengthSq()>0)input.normalize();
 const boost=key('shift')?2.35:key('alt')?.40:1;
 const speed=(this.flightSpeed||9)*boost;
 const rightVector=new T.Vector3(-Math.cos(this.yaw),0,Math.sin(this.yaw));
 const forwardVector=new T.Vector3(Math.sin(this.yaw),0,Math.cos(this.yaw));
 const desired=rightVector.multiplyScalar(input.x*speed).addScaledVector(forwardVector,input.z*speed);
 desired.y=input.y*speed*.82;
 const velocity=this.flightVelocity||(this.flightVelocity=new T.Vector3());
 velocity.lerp(desired,1-Math.exp(-11*dt));
 if(velocity.lengthSq()<.001&&!input.lengthSq()){velocity.set(0,0,0);return false;}
 this.eye.addScaledVector(velocity,dt);this.clampEye();this.cameraUpdate();return true;
}
focusPoint(x,y){
 if(!this.state)return;
 const worldX=x-this.state.w/2+.5,worldZ=y-this.state.h/2+.5;
 const height=9.5,back=11.5;
 // Preserve current heading while actually flying to a new position.
 this.eye.set(worldX-Math.sin(this.yaw)*back,height,worldZ-Math.cos(this.yaw)*back);
 this.clampEye();
 const dx=worldX-this.eye.x,dz=worldZ-this.eye.z;
 this.yaw=Math.atan2(dx,dz);this.pitch=Math.atan2(.45-this.eye.y,Math.hypot(dx,dz));
 this.cameraUpdate();
}
centerOn(x,y){this.focusPoint(x,y);}
resetCamera(){
 this.eye.set(-18,19,22);this.yaw=2.50;this.pitch=-.60;
 this.flightVelocity?.set(0,0,0);this.releaseKeys();this.cameraEase=null;this.cameraUpdate(true);
}
bind(){
 let down=null,drag=false;
 this.canvas.addEventListener('pointerdown',e=>{
  if(e.button>2)return;
  this.canvas.focus?.({preventScroll:true});
  const mode=e.button===2?'look':e.button===1?'pan':this.controls==='classic'?'look':'pan';
  down={x:e.clientX,y:e.clientY,lastX:e.clientX,lastY:e.clientY,mode};
  drag=false;this.canvas.setPointerCapture?.(e.pointerId);
 });
 this.canvas.addEventListener('pointermove',e=>{
  if(!down){if(this.onHover){const t=this.pick(e);if(t)this.onHover(t);}return;}
  const dx=e.clientX-down.lastX,dy=e.clientY-down.lastY;down.lastX=e.clientX;down.lastY=e.clientY;
  if(Math.hypot(e.clientX-down.x,e.clientY-down.y)>4)drag=true;
  if(!drag)return;
  if(down.mode==='pan')this.panByPixels(dx,dy);
  else this.lookBy(-dx*.0035,-dy*.0033);
 });
 this.canvas.addEventListener('pointerup',e=>{
  if(down&&!drag&&e.button===0&&this.onClick){const t=this.pick(e);if(t)this.onClick(t,e);}
  down=null;
 });
 this.canvas.addEventListener('pointercancel',()=>down=null);
 this.canvas.addEventListener('wheel',e=>{
  e.preventDefault();
  const factor=e.deltaMode===1?12:e.deltaMode===2?160:1;
  const step=-Math.sign(e.deltaY)*Math.min(8,Math.abs(e.deltaY)*factor*.025);
  this.dolly(step);
 },{passive:false});
 this.canvas.addEventListener('contextmenu',e=>e.preventDefault());
}
resize(){
 const r=this.canvas.parentElement.getBoundingClientRect();this.w=r.width;this.h=r.height;
 if(this.renderer)this.renderer.setSize(this.w,this.h,false);
 else{this.canvas.width=this.w;this.canvas.height=this.h;}
 this.cameraUpdate(true);
}
cameraUpdate(force=false){
 if(!this.eye||!this.camera)return;
 const target={x:this.eye.x,y:this.eye.y,z:this.eye.z,yaw:this.yaw,pitch:this.pitch};
 if(!this.cameraEase||force)this.cameraEase={...target};
 let moving=false;const smooth=force?1:.32;
 for(const key of Object.keys(target)){
  let error=target[key]-this.cameraEase[key];
  if(key==='yaw')error=Math.atan2(Math.sin(error),Math.cos(error));
  if(Math.abs(error)>.0007){this.cameraEase[key]+=error*smooth;moving=true;}
  else this.cameraEase[key]=target[key];
 }
 this.cameraAnimating=moving;
 const v=this.cameraEase,c=Math.cos(v.pitch);
 this.camera.aspect=Math.max(.1,this.w/Math.max(1,this.h));
 this.camera.position.set(v.x,v.y,v.z);
 this.camera.lookAt(v.x+Math.sin(v.yaw)*c,v.y+Math.sin(v.pitch),v.z+Math.cos(v.yaw)*c);
 this.camera.updateProjectionMatrix();this.camera.updateMatrixWorld();
 this.staticFaces=null;this.dirty=true;
}
clear(group){while(group.children.length)group.remove(group.children[0]);}
setState(s){this.staticFaces=null;this.dirty=true;this.animations=[];this.effects.forEach(e=>{e.el?.remove();this.scene.remove(e.fx);});this.effects=[];this.state=s;this.clear(this.tileGroup);this.clear(this.unitGroup);this.clear(this.backdrop);this.groups.clear();this.labels.innerHTML='';this.labelsMap.clear();let biome=s.mission.biome;this.scene.background.set(({grass:0x8eb4c0,desert:0xe1b47f,snow:0xa3bbcc,urban:0x899ead,coast:0x8cb7bf,islands:0x8dbfba,toy:0xa58c78,mountain:0x8fa7bd})[biome]||0x91a9b4);this.scene.fog=new T.Fog(this.scene.background,38,78);let palette=biome==='desert'?[0xbca678,0xc7b486,0xd4c296]:biome==='snow'?[0xd7dfd7,0xcad6d0,0xe5e9dd]:biome==='urban'?[0x657581,0x73818c,0x87949b]:biome==='coast'?[0xbcae7d,0xcbbb8c,0xad9f72]:biome==='islands'?[0x4b8c70,0x619878,0x74aa87]:biome==='toy'?[TOY_FELT,TOY_FELT,TOY_FELT]:biome==='mountain'?[0x6e8a82,0x819b90,0xa5b6a1]:[0x60866c,0x6d9379,0x80a28a];this.groundColor=palette[1];this.fogSeenMat?.dispose();this.fogHiddenMat?.dispose();this.fogSeenMat=new T.MeshBasicMaterial({color:0x14241e,transparent:true,opacity:.13,depthWrite:false});this.fogHiddenMat=new T.MeshBasicMaterial({color:0x14241e,transparent:true,opacity:.34,depthWrite:false});this.makeBackdrop(s);


s.tiles.forEach(t=>{if(t.terrain==='void')return;let x=t.x-s.w/2+.5,z=t.y-s.h/2+.5,n=(t.x*17+t.y*31)%13,c=t.terrain==='water'?0x397d8a:t.terrain==='road'||t.terrain==='bridge'?0x626c69:biome==='toy'?TOY_FELT:new T.Color(palette[1]).multiplyScalar(.99+(n%5)*.004).getHex();let tile=box(this.tileGroup,c,x,-.25,z,1,.5,1);tile.userData.tile=t;
if(t.pad){box(this.tileGroup,0x344e59,x,.025,z,.82,.035,.82);for(let i=-2;i<=2;i++)box(this.tileGroup,0xc7ba86,x+i*.13,.049,z,.05,.01,.65);}
if(t.terrain==='mountain'){
 if(biome==='toy'){
  // The mountain terrain is a cardboard obstacle: clustered folded ridges, not a cone on every tile.
  box(this.tileGroup,0x65786d,x,.055,z,.96,.11,.96);
  if((t.x*13+t.y*7+s.mission.seed)%4===0){
   const ridge=crag(this.tileGroup,0x9d967b,x,.115,z,1.03,.61,.88,(n+2)%5);
   ridge.rotation.y=((n%3)-1)*.15;
   box(this.tileGroup,0xc3b18e,x-.1,.15,z+.28,.5,.12,.2);
  }
 }else{
  const rock=biome==='snow'?0xbccbd0:biome==='desert'?0x9c8876:0x526a69;
  crag(this.tileGroup,rock,x,.025,z,.92,.82+(n%3)*.09,.89,n%5);
  crag(this.tileGroup,biome==='snow'?0xe6eae4:biome==='desert'?0xc1a68b:0x81958c,x+.18,.21,z-.12,.44,.32,.42,(n+2)%5);
  for(let k=0;k<2;k++)box(this.tileGroup,0x778c84,x-.31+k*.56,.065,z+.3,.18,.08,.13);
 }
}
if(t.objective){for(let dx of [-.45,.45])box(this.tileGroup,0xe1b568,x+dx,.055,z,.04,.04,.9);}
if(t.terrain==='water'){box(this.tileGroup,0x77a9ab,x-.18,.008,z+.22,.35,.008,.012);if(n%2)box(this.tileGroup,0x61979c,x+.2,.008,z-.2,.21,.008,.012);}
if(t.path){const dz=t.pathAxis==='x';box(this.tileGroup,biome==='snow'?0xd2d5c6:biome==='desert'?0xaa926d:0x9b906f,x,.012,z,dz?.96:.20,.018,dz?.20:.96);for(let j=0;j<3;j++)box(this.tileGroup,0xd0c4a1,x+(dz?(j-1)*.3:.04),.025,z+(dz?.035:(j-1)*.3),.07,.018,.048);}
if(t.terrain==='bridge'){for(let side of [-1,1]){box(this.tileGroup,0xafafa0,x,.15,z+side*.43,1,.06,.045);for(let dx of [-.4,.4])box(this.tileGroup,0x777f76,x+dx,.08,z+side*.43,.04,.2,.04);}}
if((t.terrain==='road'||t.terrain==='bridge')&&!t.facility){
 const isRoad=(xx,yy)=>['road','bridge'].includes(A.tile(s,xx,yy)?.terrain);
 const e=isRoad(t.x+1,t.y),w=isRoad(t.x-1,t.y),n=isRoad(t.x,t.y-1),so=isRoad(t.x,t.y+1);
 const horizontal=(e||w)&&!(n||so)||(e&&w),vertical=!horizontal&&(n||so);
 const junction=(e||w)&&(n||so);
 const markColor=t.terrain==='bridge'?0xd9d7c4:0xcdd2b7;
 if(!junction){if(horizontal){box(this.tileGroup,markColor,x,.019,z,.35,.01,.025);for(const off of [-.43,.43])box(this.tileGroup,0x99a8a0,x,.014,z+off,.98,.012,.018);}
 else if(vertical){box(this.tileGroup,markColor,x,.019,z,.025,.01,.35);for(const off of [-.43,.43])box(this.tileGroup,0x99a8a0,x+off,.014,z,.018,.012,.98);}}
 else{for(const dx of [-.32,.32])for(const dz of [-.32,.32])box(this.tileGroup,0xadb4aa,x+dx,.014,z+dz,.08,.01,.08);}
}
if(t.terrain==='forest'){const tx=x-.18+(n%3)*.06,tz=z-.19+(n%4)*.045;if(biome==='desert'){for(let k=0;k<3;k++)rod(this.tileGroup,0x89906b,[tx,.02,tz],[tx+(k-1)*.12,.31,tz+.06*k],.028);ball(this.tileGroup,0x9f996e,tx,.34,tz,.19,.13,.22);}else{pine(this.tileGroup,tx,tz,n,biome==='snow');if(n%3!==1)pine(this.tileGroup,x+.27,z+.22,(n+2)%13,biome==='snow');}if(n%3===0)crag(this.tileGroup,0x72877b,x+.32,.02,z-.28,.16,.12,.20,n%5);}
if(t.terrain==='hill'||t.terrain==='dune'){const sand=t.terrain==='dune';const hill=crag(this.tileGroup,sand?0xc1a178:biome==='snow'?0xdbdfdd:0x738a79,x-.03,.01,z-.03,.74,.26+(n%3)*.07,.78,(n+2)%5);hill.rotation.y=n*.11;if(n%2===0)crag(this.tileGroup,sand?0xd6b88b:0x94a696,x+.3,.01,z+.26,.25,.16,.22,n%5);}
if(t.terrain==='ruins'){if(biome==='toy'){addToyProp(this.tileGroup,s,t);}else{box(this.tileGroup,0x9a9d90,x-.23,.25,z,.11,.5,.55);box(this.tileGroup,0xc0bca6,x,.16,z-.23,.55,.32,.11);for(let i=0;i<3;i++){let rubble=box(this.tileGroup,0x7d8980,x+.12+i*.07,.06,z+.1,.15,.12,.13);rubble.rotation.y=i;}}}
if(t.facility){let g=new T.Group();g.position.set(x,0,z);g.userData.facility=t;this.tileGroup.add(g);let col=t.owner===0?colors.blue:t.owner===1?colors.red:0x9c9b7a;box(g,0x8c9688,0,.025,0,.94,.05,.9);
if(t.facility==='airfield'){box(g,0x394e53,0,.065,0,.8,.03,.8);for(let dx of [-.16,.16])box(g,0xd7cfb0,dx,.09,0,.04,.01,.38);box(g,0xd7cfb0,0,.09,0,.32,.01,.04);for(let dx of [-.38,.38])for(let dz of [-.38,.38])ball(g,0xf0be67,dx,.09,dz,.025,.025,.025);}
else if(t.facility==='relay'){box(g,0xa9ad98,0,.14,0,.45,.25,.45);for(let dx of [-.12,.12])rod(g,0x526b67,[dx,.24,0],[0,.95,0],.025);let dish=cylinder(g,0xd0d5c3,0,.95,0,.22,.035);dish.rotation.x=.65;rod(g,0x30464c,[0,.95,0],[0,1.1,.2],.015);}
else if(t.facility==='hq'){bevel(g,0xaab1a0,0,.27,0,.77,.44,.63);box(g,col,0,.51,-.06,.64,.08,.54);box(g,0x243f49,0,.33,.32,.5,.1,.015);box(g,0x567c7c,.12,.65,-.12,.3,.25,.25);box(g,0xc4c6ad,.12,.79,-.12,.36,.05,.31);rod(g,0xd2c6a8,[-.22,.5,-.18],[-.22,1.08,-.18],.012);box(g,0xd2c6a8,-.22,.94,-.18,.22,.015,.015);for(let dx of [-.35,.35])box(g,0x586c66,dx,.12,.3,.13,.18,.3);}
else if(t.facility==='factory'){box(g,0xa6ab99,0,.25,0,.73,.43,.6);box(g,col,0,.49,0,.8,.08,.68);box(g,0x354a4e,0,.22,.31,.4,.3,.02);cylinder(g,0x596963,.26,.65,-.19,.065,.75);for(let i=0;i<3;i++)box(g,0x849b91,-.22+i*.2,.4,.315,.1,.07,.01);}
else{box(g,0xc6bea4,-.12,.24,0,.48,.42,.5);let roof=cone(g,0x786d59,-.12,.55,0,.38,.25);roof.rotation.y=Math.PI/4;box(g,0x49666b,-.23,.28,.26,.1,.12,.02);box(g,0x63756c,-.04,.17,.26,.1,.26,.02);box(g,0xa3a58d,.28,.15,-.12,.24,.25,.25);}
rod(g,0xc0baa3,[.39,0,.3],[.39,.95,.3],.012);let flag=box(g,col,.49,.84,.3,.2,.13,.012);g.userData.flag=flag;}
});this.batchTerrain();this.cameraUpdate();this.sync();}
makeToyRoom(s){
 const g=this.backdrop,W=s.w/2,H=s.h/2,zBack=-H-8,xRight=W+8;
 const pine=0x765943,plaster=0xb3a089,trim=0x5b4639,cloth=TOY_FELT;
 // Two proper attic walls, baseboards and overhead beams, all BEHIND the playfield.
 const back=box(g,plaster,0,4.6,zBack,W*2+19,9.2,.46);back.userData.roomPart='back-wall';
 const side=box(g,0xa9937d,xRight,4.6,-.6,.46,9.2,H*2+19);side.userData.roomPart='side-wall';
 box(g,trim,0,.30,zBack+.31,W*2+19,.60,.27);
 box(g,trim,xRight-.31,.30,-.6,.27,.60,H*2+19);
 box(g,0x684e3c,0,9.15,zBack+.27,W*2+19,.45,.35);
 for(let j=0;j<6;j++){
  const x=-W-6+j*(W*2+12)/5;
  box(g,pine,x,4.7,zBack+.44,.22,9.0,.27);
  rod(g,pine,[x,9.15,zBack+.45],[x+1.7,10.65,zBack+4.3],.18);
 }
 for(let j=0;j<4;j++)box(g,0x765942,xRight-.39,4.7,-H-5+j*(H*2+9)/3,.25,9.0,.26);
 // Framed attic window, a pale sky pane and dark wooden muntins.
 const wx=-W*.13,wz=zBack+.55;
 const win=box(g,trim,wx,6.12,wz,4.3,3.05,.19);win.userData.roomPart='window-frame';
 box(g,0x9fbac1,wx,6.12,wz+.12,3.75,2.55,.025);
 box(g,0xa4c3cb,wx-.91,6.12,wz+.144,1.76,2.41,.01);
 box(g,0x85a9af,wx+.91,6.12,wz+.144,1.76,2.41,.01);
 box(g,pine,wx,6.12,wz+.22,.13,2.77,.15);
 box(g,pine,wx,6.11,wz+.22,3.95,.13,.15);
 box(g,0xd9c6a0,wx,4.48,wz+.50,4.65,.21,.60);
 // Tall shelf with a few distinct silhouettes rather than dozens of scattered toys.
 const sx=-W*.78,sz=zBack+1.7;
 for(const dx of [-2.0,2.0])box(g,pine,sx+dx,2.45,sz,.19,4.9,1.18);
 for(const yy of [.25,2.1,4.13])box(g,0x947357,sx,yy,sz,4.4,.17,1.25);
 for(let k=0;k<10;k++){
  const h=1.05+(k%3)*.17,xx=sx-1.58+k*.32;
  const book=box(g,TOY_PALETTE[(k+1)%5],xx,2.2+h*.5,sz,.23,h,.73);
  book.rotation.z=(k%4-1.5)*.035;
  box(g,0xdfcfaa,xx,2.2+h*.5,sz+.38,.16,h*.70,.015);
 }
 for(let k=0;k<3;k++){const xx=sx-1.2+k*1.25;box(g,TOY_PALETTE[(k+2)%5],xx,.55,sz,.64,.54,.66);box(g,0xe0ccaa,xx,.85,sz,.50,.08,.55);}
 // Cardboard packing crates, sealed with crossing tape and stencil-like panels.
 const cartons=[{x:W*.61,z:zBack+2.3,w:2.45,h:2.0,d:2.0},{x:W*.76,z:zBack+4.7,w:2.8,h:1.3,d:1.7},{x:W*.37,z:zBack+3.2,w:1.6,h:1.0,d:1.5}];
 for(let i=0;i<cartons.length;i++){const v=cartons[i],y=v.h/2;box(g,i%2?0xbda078:0xc4aa80,v.x,y,v.z,v.w,v.h,v.d);box(g,0xe0c799,v.x,v.h+.012,v.z,.21,.025,v.d);box(g,0x94734d,v.x,v.h*.52,v.z+v.d/2+.018,v.w*.6,.10,.024);box(g,0x9b7e5a,v.x+v.w*.27,y,v.z+v.d/2+.03,.06,v.h*.52,.025);}
 // A wooden toy chest sits at the right edge, not on any gameplay tile.
 const tx=W+4,tz=H*.25;
 box(g,0x7b5945,tx,.78,tz,3.7,1.55,2.65);
 const lid=box(g,0xa97e5b,tx,1.65,tz-.16,3.85,.28,2.78);lid.rotation.x=-.13;
 box(g,0xd9b87c,tx,1.16,tz+1.34,1.28,.36,.06);
 for(const dx of [-1.4,1.4])box(g,0xb9a174,tx+dx,.83,tz+1.36,.12,1.30,.08);
 for(const dx of [-1.2,.0,1.2])box(g,0xc39d65,tx+dx,.47,tz+1.40,.32,.09,.05);
 // A clean model railway stays outside the battle tiles.
 const railZ=zBack+3.2,railA=-W*.37,railB=W*.18;
 for(const dz of [-.24,.24])rod(g,0x66716b,[railA,.035,railZ+dz],[railB,.035,railZ+dz],.033);
 for(let i=0;i<10;i++){const rx=railA+i*(railB-railA)/9;box(g,0x93735a,rx,.017,railZ,.12,.045,.85);}
 for(let i=0;i<3;i++){
  const gx=railA+1.1+i*1.35;
  box(g,TOY_PALETTE[[3,1,2][i]],gx,.32,railZ,1.05,.35,.55);
  box(g,i===0?0x516a72:0xa98a64,gx-.12,.60,railZ,.48,.27,.46);
  for(const dx of [-.32,.32])for(const dz of [-.29,.29]){
   const wh=cylinder(g,0x3b4c4b,gx+dx,.14,railZ+dz,.10,.07);wh.rotation.x=Math.PI/2;
  }
 }
 // One giant stack of construction blocks as a distant set piece, not tile litter.
 const fx=-W-3.2,fz=H*.12;
 for(let j=0;j<4;j++){const yy=.38+j*.63;box(g,TOY_PALETTE[j%5],fx+(j%2)*.16,yy,fz,1.0,.62,.9);}
 const roof=box(g,0xd8b882,fx+.06,2.87,fz,1.3,.18,1.04);roof.rotation.z=.09;
}
makeBackdrop(s){const b=s.mission.biome,seed=s.mission.seed||1,isToy=b==='toy',snow=b==='snow',high=b==='mountain',urban=b==='urban',desert=b==='desert';
 const land=(b==='coast'||b==='islands')?0x397d8a:(this.groundColor||TOY_FELT);
 // A real terrain-colored world beneath the board prevents the sky from appearing as the floor.
 box(this.backdrop,land,0,-.255,0,125,.5,115);if(isToy){this.makeToyRoom(s);return;}
 for(let i=0;i<55;i++){const a=i/55*Math.PI*2,range=18+(i%6)*2.4,x=Math.cos(a)*range,z=Math.sin(a)*range;
  if(high||snow||desert)crag(this.backdrop,high?0x627c78:snow?0xb4c5c8:0xbda17c,x,-.49,z,1.5+(i%4),.35+(i%5)*.17,1.4+(i%3),i%5);
  else if((b==='coast'||b==='islands')&&i%4===0){crag(this.backdrop,0x689486,x,-.23,z,2.4+(i%3),.48+(i%2)*.32,2.8,i%5);if(i%3===0)pine(this.backdrop,x+.25,z-.2,i,false);}
  else if(!isToy&&!urban&&b!=='coast'&&b!=='islands'&&i%2===0)pine(this.backdrop,x,z,i,snow);
  else if(urban&&i%4===0)box(this.backdrop,0x495760,x,.25,z,1.8,1.1,2.3);
 }
 for(let i=0;i<38;i++){const angle=i/38*Math.PI*2,dist=27+(i%6)*1.9,x=Math.cos(angle)*dist,z=Math.sin(angle)*dist,r=(Math.sin(i*2.7+seed*.2)+1)*.5;if(isToy){const q=box(this.backdrop,i%3===0?0x846e5a:0x9e856a,x,3.1,z,2.5,6,2.3);q.rotation.y=angle+.15;if(i%6===0)box(this.backdrop,0xb39c75,x,6.3,z,2.7,.3,2.5);}else if(urban){box(this.backdrop,[0x5a6870,0x788996,0x677c85][i%3],x,1.5+r*2,z,1.2+r*1.5,3+r*4,1.1+r*.9);}else if(high||snow){const peak=crag(this.backdrop,snow?0xdde6e8:i%3===0?0xa5b5bc:0x637d80,x,-.35,z,4+r*1.4,5+r*3,4+r*1.4,i%5);peak.rotation.y=i*.3;}else if(!desert){for(let k=0;k<2;k++)cone(this.backdrop,0x294c49,x+k*.9,1.2,z+.3*k,.9,2.5+r*2);}else{const dune=box(this.backdrop,0xd0b58a,x,.25,z,3,.5+r,2.6);dune.rotation.y=i*.3;}}if(high||snow||b==='coast'||b==='islands'){for(let i=0;i<11;i++){const x=(i-5)*5;const peak=crag(this.backdrop,high?0x768a9e:snow?0xe3e9ee:0x638b93,x,-.34,-31,6,8+(i%4)*2,4.5,i%5);peak.rotation.y=i*.3;}}const storm=(s.mission.n%5===3),snowfall=b==='snow'&&s.mission.n%2===0;for(let i=0;i<(storm?23:11);i++){let angle=i/23*Math.PI*2,dist=25+(i%4)*2,x=Math.cos(angle)*dist,z=Math.sin(angle)*dist,y=8+(i%4)*.7;ball(this.backdrop,storm?0x657983:0xe2e5e0,x,y,z,2.1,.42,1.3);ball(this.backdrop,storm?0x4a5f6a:0xf1eee1,x+.9,y+.14,z+.3,1.3,.51,1.1);}if(storm||snowfall){for(let i=0;i<76;i++){let x=Math.sin(i*12.98+seed)*s.w*.48,z=Math.cos(i*9.13+seed)*s.h*.48,y=1.9+(i%11)*.27;if(snowfall)ball(this.backdrop,0xffffff,x,y,z,.035,.035,.035);else rod(this.backdrop,0xa4b8be,[x,y,z],[x-.12,y-.35,z+.09],.009);}}}
batchTerrain(){if(!this.renderer)return;this.tileGroup.updateMatrixWorld(true);let buckets=new Map(),remove=[];this.tileGroup.traverse(o=>{if(!o.isMesh||o.parent.userData.facility)return;let key=o.geometry.uuid+o.material.uuid;if(!buckets.has(key))buckets.set(key,[]);buckets.get(key).push(o);remove.push(o);});for(let meshes of buckets.values()){let first=meshes[0],batch=new T.InstancedMesh(first.geometry,first.material,meshes.length);meshes.forEach((m,i)=>batch.setMatrixAt(i,m.matrixWorld));batch.castShadow=true;batch.receiveShadow=true;batch.instanceMatrix.needsUpdate=true;this.tileGroup.add(batch);}remove.forEach(o=>o.parent.remove(o));}
sync(){this.dirty=true;let s=this.state;const present=new Set(s.units.map(u=>u.id));for(const [id,g]of this.groups)if(!present.has(id)){this.unitGroup.remove(g);this.groups.delete(id);this.labelsMap.get(id)?.remove();this.labelsMap.delete(id);}this.clear(this.fogGroup);s.seen=s.seen||[];for(let t of s.tiles){if(t.terrain==='void')continue;const index=t.y*s.w+t.x;if(A.tileVisible(s,t)||t.pad)s.seen[index]=true;else{const seen=!!s.seen[index],shade=this.software?new T.Color(this.groundColor||TOY_FELT).multiplyScalar(seen?.82:.65).getHex():0x26372d;const overlay=box(this.fogGroup,shade,t.x-s.w/2+.5,.075,t.y-s.h/2+.5,.998,.018,.998);if(!this.software)overlay.material=seen?this.fogSeenMat:this.fogHiddenMat;}}s.units.forEach(u=>{if(u.hp<=0||u.carried||!A.visible(s,u)){let g=this.groups.get(u.id);if(g)g.visible=false;let l=this.labelsMap.get(u.id);if(l)l.style.display='none';return;}let g=this.groups.get(u.id);if(!g){g=model(u.type,u.team);g.userData.unitId=u.id;if(u.battery)g.scale.setScalar(1.55);else if(u.strongpoint)g.scale.setScalar(1.23);else if(u.flagship)g.scale.setScalar(1.17);this.unitGroup.add(g);this.groups.set(u.id,g);let label=document.createElement('div');label.className='unit-label '+(u.team?'enemy':'friendly');label.innerHTML='<span></span><i><b></b></i>';this.labels.append(label);this.labelsMap.set(u.id,label);g.rotation.y=u.team?Math.PI:0;}g.visible=true;if(!this.animations.some(a=>a.id===u.id))g.position.set(u.x-s.w/2+.5,A.D[u.type].branch==='Air'&&!u.landed?1.1:.04,u.y-s.h/2+.5);let l=this.labelsMap.get(u.id);l.style.display='block';l.classList.toggle('selected',u.id===this.selectedId);l.classList.toggle('damaged',u.hp<u.maxHp);l.classList.toggle('critical-label',u.disabled||!u.ammo.some(n=>n>0));l.querySelector('span').textContent=u.disabled?'IMMOBILIZED':!u.ammo.some(n=>n>0)?'NO AMMO':u.landed?'LANDED':u.courier?'CONVOY':u.battery?'SIEGE BATTERY':u.strongpoint?'FORTIFIED':u.flagship?'FLAGSHIP':u.command?'COMMAND':u.team===0?(u.fired?'✓':u.moved?'•':'••'):'';l.querySelector('b').style.width=(u.hp/u.maxHp*100)+'%';});this.tileGroup.children.forEach(g=>{if(g.userData.flag){let t=g.userData.facility;if(g.userData.owner!==t.owner){g.userData.owner=t.owner;this.staticFaces=null;}g.userData.flag.material=mat(t.owner===0?colors.blue:t.owner===1?colors.red:0x9c9b7a);}});}
mark(selected,moves,targets){this.selectedId=selected?.id||null;this.dirty=true;this.clear(this.markGroup);let s=this.state;const mark=(x,y,col,h)=>{let m=box(this.markGroup,col,x-s.w/2+.5,.035+(h||0),y-s.h/2+.5,.87,.025,.87);return m;};if(selected){const region=new Set(moves.map(p=>p.x+','+p.y));moves.forEach(p=>{let x=p.x-s.w/2+.5,z=p.y-s.h/2+.5;box(this.markGroup,0x48bea5,x,.04,z,.24,.018,.24);});A.rangeTiles(s,selected).forEach(p=>{let x=p.x-s.w/2+.5,z=p.y-s.h/2+.5;for(let side of [-1,1]){box(this.markGroup,0xcf8d51,x+side*.39,.055,z,.022,.02,.78);box(this.markGroup,0xcf8d51,x,.055,z+side*.39,.78,.02,.022);}});moves.forEach(p=>{let x=p.x-s.w/2+.5,z=p.y-s.h/2+.5;for(let [dx,dy]of [[1,0],[-1,0],[0,1],[0,-1]])if(!region.has((p.x+dx)+','+(p.y+dy)))box(this.markGroup,0x3c8e80,x+dx*.46,.045,z+dy*.46,dx?.035:.94,.018,dy?.035:.94);});targets.forEach(u=>{let x=u.x-s.w/2+.5,z=u.y-s.h/2+.5;for(let side of [-1,1]){box(this.markGroup,0xc45c43,x+side*.42,.05,z,.035,.03,.84);box(this.markGroup,0xc45c43,x,.05,z+side*.42,.84,.03,.035);}});let x=selected.x-s.w/2+.5,z=selected.y-s.h/2+.5;for(let side of [-1,1]){box(this.markGroup,0xf4d98c,x+side*.47,.07,z,.045,.05,.98);box(this.markGroup,0xf4d98c,x,.07,z+side*.47,.98,.05,.045);}}
if(s.warningZones?.length)for(const warning of s.warningZones){
 const locations=[[0,0],[1,0],[-1,0],[0,1],[0,-1]];
 for(const [dx,dy] of locations){
  const x=warning.x+dx,y=warning.y+dy,t=A.tile(s,x,y);if(!t||t.terrain==='void')continue;
  const mx=x-s.w/2+.5,mz=y-s.h/2+.5,col=dx===0&&dy===0?0xde4e36:0xb96948;
  for(const side of [-1,1]){box(this.markGroup,col,mx+side*.43,.095,mz,.055,.032,.82);box(this.markGroup,col,mx,.095,mz+side*.43,.82,.032,.055);}
 }
 }
if(s.mission.type==='escort'&&s.convoyRoute){for(const [i,t] of s.convoyRoute.entries())if(i%3===0&&i>=s.escortProgress){box(this.markGroup,0x8abfb8,t.x-s.w/2+.5,.075,t.y-s.h/2+.5,.13,.018,.13);}}
for(const t of s.tiles.filter(t=>t.objective)){let x=t.x-s.w/2+.5,z=t.y-s.h/2+.5;for(let side of [-1,1]){box(this.markGroup,t.owner===0?0x9fc995:0xe3b467,x+side*.45,.13,z,.04,.025,.9);box(this.markGroup,t.owner===0?0x9fc995:0xe3b467,x,.13,z+side*.45,.9,.025,.04);}}
if(s.mission.type==='convoy')mark(s.extraction.x,s.extraction.y,0xdcc67c,.01);}
pick(e){let r=this.canvas.getBoundingClientRect();this.pointer.set((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1);this.ray.setFromCamera(this.pointer,this.camera);if(!this.state)return null;this.unitGroup.updateMatrixWorld(true);for(const hit of this.ray.intersectObjects(this.unitGroup.children,true)){let g=hit.object;while(g&&!g.userData.unitId)g=g.parent;if(g&&g.visible){let u=this.state.units.find(u=>u.id===g.userData.unitId);if(u&&u.hp>0&&!u.carried&&A.visible(this.state,u))return {x:u.x,y:u.y};}}let p=new T.Vector3();if(!this.ray.ray.intersectPlane(new T.Plane(new T.Vector3(0,1,0),0),p))return null;let x=Math.floor(p.x+this.state.w/2),y=Math.floor(p.z+this.state.h/2);return x>=0&&x<this.state.w&&y>=0&&y<this.state.h&&A.tile(this.state,x,y).terrain!=='void'?{x,y}:null;}
events(){for(let ev of this.state.events.splice(0)){if(ev.kind==='move'&&this.motion)this.animations.push({...ev,start:performance.now(),duration:Math.min(700,ev.path.length*120)});else if(ev.kind==='attack'||ev.kind==='counter'){let fx=new T.Group();mesh(fx,sphereGeo,0xffd579,0,0,0,.10,.10,.10);this.scene.add(fx);this.effects.push({...ev,start:performance.now(),fx});let p=document.createElement('div');p.className='damage';p.textContent='−'+ev.damage;if(ev.damage>0){this.labels.append(p);ev.el=p;this.effects[this.effects.length-1].el=p;}}}this.sync();}
project(x,y,z){let p=new T.Vector3(x,y,z).project(this.camera);return {x:(p.x+1)*this.w/2,y:(1-p.y)*this.h/2};}
collectFaces(group){let faces=[],normal=new T.Vector3(),a=new T.Vector3(),b=new T.Vector3(),c=new T.Vector3(),light=new T.Vector3(-.4,1,.7).normalize(),matrix=new T.Matrix4();const vp=new T.Matrix4().multiplyMatrices(this.camera.projectionMatrix,this.camera.matrixWorldInverse);group.updateMatrixWorld(true);group.traverse(o=>{if(!o.isMesh)return;for(let p=o;p;p=p.parent)if(!p.visible)return;let geo=o.geometry,pos=geo.attributes.position,idx=geo.index,col=o.material.color;matrix.multiplyMatrices(vp,o.matrixWorld);let lastColor='',lastNormal=-2;for(let i=0;i<(idx?idx.count:pos.count);i+=3){let ia=idx?idx.getX(i):i,ib=idx?idx.getX(i+1):i+1,ic=idx?idx.getX(i+2):i+2;a.fromBufferAttribute(pos,ia).applyMatrix4(matrix);b.fromBufferAttribute(pos,ib).applyMatrix4(matrix);c.fromBufferAttribute(pos,ic).applyMatrix4(matrix);if((b.x-a.x)*(c.y-a.y)-(b.y-a.y)*(c.x-a.x)<=0)continue;normal.fromBufferAttribute(geo.attributes.normal,ia).transformDirection(o.matrixWorld);let shade=.72+Math.max(0,normal.dot(light))*.28;if(shade!==lastNormal){lastColor='#'+col.clone().multiplyScalar(shade).getHexString();lastNormal=shade;}faces.push({pts:[(a.x+1)*this.w/2,(1-a.y)*this.h/2,(b.x+1)*this.w/2,(1-b.y)*this.h/2,(c.x+1)*this.w/2,(1-c.y)*this.h/2],z:(a.z+b.z+c.z)/3,c:lastColor});}});return faces;}
softwareDraw(){let ctx=this.ctx;ctx.fillStyle='#'+this.scene.background.getHexString();ctx.fillRect(0,0,this.w,this.h);if(!this.staticFaces){this.staticFaces=this.collectFaces(this.tileGroup);this.metrics.staticBuilds++;}let faces=this.staticFaces.concat(...(this.backdrop?this.collectFaces(this.backdrop):[]),this.collectFaces(this.unitGroup),this.collectFaces(this.markGroup),this.collectFaces(this.fogGroup));for(let e of this.effects)if(e.fx)faces.push(...this.collectFaces(e.fx));faces.sort((a,b)=>b.z-a.z);let color='';for(let f of faces){ctx.beginPath();ctx.moveTo(f.pts[0],f.pts[1]);ctx.lineTo(f.pts[2],f.pts[3]);ctx.lineTo(f.pts[4],f.pts[5]);ctx.closePath();if(color!==f.c){ctx.fillStyle=f.c;ctx.strokeStyle=f.c;color=f.c;}ctx.fill();ctx.lineWidth=.4;ctx.stroke();}}

frame(t){requestAnimationFrame(tt=>this.frame(tt));if(document.hidden||!this.state){this.flightTick=0;return;}this.flightStep(t);if(this.cameraAnimating)this.cameraUpdate();let active=this.animations.length||this.effects.length||this.cameraAnimating,ambient=this.motion&&!this.software&&this.state.units.some(u=>u.hp>0&&['Air','Navy'].includes(A.D[u.type].branch));if(!this.dirty&&!active&&!ambient)return;if(t-this.last<(this.software?33:16))return;this.last=t;let began=performance.now();this.dirty=false;let s=this.state;this.animations=this.animations.filter(a=>{let progress=Math.min(1,(t-a.start)/a.duration),g=this.groups.get(a.id);if(g){let f=progress*(a.path.length),idx=Math.min(a.path.length-1,Math.floor(f)),from=idx===0?a.from:a.path[idx-1],to=a.path[idx],mix=progress===1?1:f-idx;g.position.x=from.x+(to.x-from.x)*mix-s.w/2+.5;g.position.z=from.y+(to.y-from.y)*mix-s.h/2+.5;g.rotation.y=Math.atan2(to.x-from.x,to.y-from.y);}return progress<1;});s.units.forEach(u=>{let g=this.groups.get(u.id),l=this.labelsMap.get(u.id);if(!g||!g.visible)return;if(this.motion&&A.D[u.type].branch==='Air'&&!u.landed)g.position.y=1.12+Math.sin(t*.002+u.id)*.05;if(this.motion&&A.D[u.type].branch==='Navy')g.position.y=.04+Math.sin(t*.0015+u.id)*.02;if(this.motion&&!u.landed)(g.userData.rotors||[g.userData.rotor]).filter(Boolean).forEach(r=>r.rotation.y=t*.025);let p=this.project(g.position.x,g.position.y+.85,g.position.z);let transform='translate('+Math.round(p.x)+'px,'+Math.round(p.y)+'px) translate(-50%,-50%)';if(l.style.transform!==transform)l.style.transform=transform;});this.effects=this.effects.filter(e=>{let f=(t-e.start)/1100;if(f>=1){e.el?.remove();this.scene.remove(e.fx);return false;}if(e.fx){let travel=Math.min(1,f*3);e.fx.position.set(e.from.x+(e.to.x-e.from.x)*travel-s.w/2+.5,.45+Math.sin(travel*Math.PI)*.65,e.from.y+(e.to.y-e.from.y)*travel-s.h/2+.5);e.fx.scale.setScalar(travel<1?1:Math.max(.1,4*(1-f)));}let p=this.project(e.to.x-s.w/2+.5,1+f,e.to.y-s.h/2+.5);e.el.style.transform='translate('+p.x+'px,'+p.y+'px)';e.el.style.opacity=1-f;return true;});if(this.renderer)this.renderer.render(this.scene,this.camera);else this.softwareDraw();this.metrics.frames++;this.metrics.renderMs=performance.now()-began;}
}
window.AtlasView=View;
const thumbs=new Map();let observer;
function thumbnail(id){if(thumbs.has(id))return thumbs.get(id);let canvas=document.createElement('canvas');canvas.width=630;canvas.height=420;let ctx=canvas.getContext('2d'),g=model(id,0);g.rotation.y=-.25;g.updateMatrixWorld(true);let bounds=new T.Box3().setFromObject(g),size=bounds.getSize(new T.Vector3()),center=bounds.getCenter(new T.Vector3());let span=Math.max(size.x,size.y,size.z)*.84;const camera=new T.OrthographicCamera(-span*1.5,span*1.5,span,-span,.01,50);camera.position.set(-3.5,2.8,5);camera.lookAt(center);camera.updateProjectionMatrix();camera.updateMatrixWorld();ctx.fillStyle='#00000025';ctx.beginPath();ctx.ellipse(315,336,170,25,0,0,Math.PI*2);ctx.fill();let faces=View.prototype.collectFaces.call({camera,w:630,h:420},g).sort((a,b)=>b.z-a.z);for(let f of faces){ctx.fillStyle=f.c;ctx.strokeStyle=f.c;ctx.lineWidth=.5;ctx.beginPath();ctx.moveTo(f.pts[0],f.pts[1]);ctx.lineTo(f.pts[2],f.pts[3]);ctx.lineTo(f.pts[4],f.pts[5]);ctx.closePath();ctx.fill();ctx.stroke();}let url=canvas.toDataURL();thumbs.set(id,url);return url;}
function hydrate(){if(typeof document==='undefined'||!document.querySelectorAll)return;const paint=img=>{if(!img.isConnected)return;img.src=thumbnail(img.dataset.model);img.classList.add('loaded');};if(typeof IntersectionObserver!=='undefined'&&!observer)observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){observer.unobserve(e.target);requestAnimationFrame(()=>paint(e.target));}}),{rootMargin:'100px'});document.querySelectorAll('img[data-model]:not([data-queued])').forEach(img=>{img.dataset.queued='1';if(observer)observer.observe(img);else paint(img);});}
window.AtlasModels={model,thumbnail,hydrate};
})();
