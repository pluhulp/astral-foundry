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

const terrainTextures=new Map(),terrainSurfaceMaterials=new Map();
// Tiny deterministic diffuse materials: no external images, downloads or GPU-heavy shaders.
function terrainTexture(kind){
 if(terrainTextures.has(kind))return terrainTextures.get(kind);
 const n=32,data=new Uint8Array(n*n*4),water=kind==='water';
 const hash=(x,y)=>{let h=Math.imul(x+19,374761393)^Math.imul(y+31,668265263);h=Math.imul(h^(h>>>13),1274126177);return ((h^(h>>>16))>>>0)/4294967295;};
 for(let y=0;y<n;y++)for(let x=0;x<n;x++){
  const i=(y*n+x)*4,grain=(hash(x,y)-.5)*2;
  const stripe=water?Math.sin(y*.83+x*.18)*6:kind==='desert'?Math.sin(x*.30+y*.17)*5:0;
  const delta=grain*(water?6:kind==='road'?7:12)+stripe;
  const r=Math.max(0,Math.min(255,235+delta));
  data[i]=r;data[i+1]=Math.max(0,Math.min(255,238+delta));data[i+2]=Math.max(0,Math.min(255,232+delta));data[i+3]=255;
 }
 const tex=new T.DataTexture(data,n,n,T.RGBAFormat);tex.wrapS=tex.wrapT=T.RepeatWrapping;tex.magFilter=T.LinearFilter;tex.minFilter=T.LinearMipmapLinearFilter;
 tex.generateMipmaps=true;tex.needsUpdate=true;tex.colorSpace=T.SRGBColorSpace;terrainTextures.set(kind,tex);return tex;
}
function terrainMaterial(hex,kind){
 const key=hex+'-'+kind;if(terrainSurfaceMaterials.has(key))return terrainSurfaceMaterials.get(key);
 const m=new T.MeshStandardMaterial({color:hex,map:terrainTexture(kind),roughness:.98,metalness:0});
 terrainSurfaceMaterials.set(key,m);return m;
}
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
// A five-point tessellated slope: identical corner sampling keeps neighboring tiles continuous.
function slopeGeometry(s,t){
 // Flat square plateau: two triangles, deliberately NOT a curved heightfield.
 const v=[-.5,0,-.5,-.5,0,.5,.5,0,.5,-.5,0,-.5,.5,0,.5,.5,0,-.5];
 const geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(v,3));
 geo.setAttribute('uv',new T.Float32BufferAttribute([0,0,0,1,1,1,0,0,1,1,1,0],2));
 geo.computeVertexNormals();return geo;
}
function rampGeometry(s,t,u){
 const dx=u.x-t.x,dz=u.y-t.y,x=t.x-s.w/2+.5,z=t.y-s.h/2+.5;
 const a=A.elevation(s,t)+.048,b=A.elevation(s,u)+.048,width=.33;
 const p=dx?[x,z-width,x+dx,z-width,x+dx,z+width,x,z+width]:
             [x-width,z,x-width,z+dz,x+width,z+dz,x+width,z];
 const v=[p[0],a,p[1],p[2],b,p[3],p[4],b,p[5],p[0],a,p[1],p[4],b,p[5],p[6],a,p[7]];
 const geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(v,3));
 geo.setAttribute('uv',new T.Float32BufferAttribute([0,0,1,0,1,1,0,0,1,1,0,1],2));
 geo.computeVertexNormals();return geo;
}
function highlandDetails(parent,s,t,x,z,n){
 const seed=(t.x*71+t.y*163+s.mission.seed)%19,h=A.elevation(s,t);
 if(['road','bridge'].includes(t.terrain)&&seed%5===0){for(let side of [-1,1]){box(parent,0xb0a78e,x+side*.44,.12,z+.25,.07,.22,.08);box(parent,0xdbd1ac,x+side*.44,.25,z+.25,.09,.035,.09);}}
 if(t.terrain==='mountain'&&seed%4===0){const r=crag(parent,h>2.55?0xa2b2b0:0x647b76,x+.1,.03,z-.08,.57,.39,.62,n%5);r.rotation.y=seed*.18;if(h>2.75)crag(parent,0xe1e8df,x-.16,.28,z-.12,.29,.13,.28,(n+2)%5);}
 if(t.terrain==='plain'&&seed%7===0)crag(parent,0x82918a,x+.22,.02,z-.22,.18,.12,.21,n%5);
}

// Shared art direction: a restrained palette, one architectural set piece per district,
// and terrain-dependent decoration rather than random piles of repeated cubes.
function scenicDetail(parent,s,t,x,z,n){
 const biome=s.mission.biome,hash=((t.x*11939)^(t.y*29269)^(s.mission.seed*17))>>>0;
 if(t.terrain==='water'){
  const shore=[[1,0],[-1,0],[0,1],[0,-1]].filter(([dx,dy])=>{
   const next=A.tile(s,t.x+dx,t.y+dy);return next&&next.terrain!=='water'&&next.terrain!=='void'&&next.terrain!=='bridge';
  });
  for(const [dx,dy] of shore){
   const q=box(parent,0xa9d4cf,x+dx*.41,.019,z+dy*.41,dx?.045:.82,.016,dy?.045:.82);
   q.rotation.y=0;
  }
  if(hash%41===0){
   cylinder(parent,0xb8a985,x,.13,z,.11,.18);
   cylinder(parent,0xd65f47,x,.30,z,.09,.19);
   cylinder(parent,0xe8dfb9,x,.41,z,.12,.03);
   rod(parent,0x424f55,[x,.43,z],[x,.64,z],.011);
  }else if(hash%13===0){for(let i=0;i<2;i++)box(parent,0x91c1c1,x-.20+i*.27,.019,z-.11,.26,.008,.018);}
  return;
 }
 if(t.facility||t.pad||biome==='toy')return;
 if(['road','bridge'].includes(t.terrain)){
  if(hash%23===0&&t.terrain==='road'){
   rod(parent,0x63726b,[x+.40,.0,z+.38],[x+.40,.85,z+.38],.022);
   box(parent,0xd2bf83,x+.4,.76,z+.38,.29,.16,.065);
  }
  if(biome==='snow'&&hash%6===0)box(parent,0xe2e6e4,x-.44,.06,z+.20,.12,.10,.42);
  return;
 }
 if(biome==='coast'||biome==='islands'){
  if(hash%16===0){const wood=0x8d866c;
   box(parent,wood,x,.035,z,.72,.07,.6);
   for(const side of [-1,1]){box(parent,0x64594c,x+side*.31,.16,z+.27,.07,.27,.07);
    box(parent,wood,x+side*.31,.33,z+.27,.06,.05,.11);}
  }else if(hash%11===0)for(let j=0;j<3;j++)ball(parent,0x628b6b,x+.16*j-.2,.08,z+(j%2)*.13,.1,.08,.12);
 }else if(biome==='desert'){
  if(hash%18===0){
   crag(parent,0xaf805f,x-.05,.01,z,.58,.38,.6,hash%5);
   crag(parent,0xd5ad7e,x+.25,.01,z-.18,.23,.23,.22,(hash+2)%5);
  }else if(hash%13===0){rod(parent,0x6d9172,[x,.04,z],[x,.39,z],.035);
   rod(parent,0x72916b,[x,.24,z],[x+.19,.31,z],.025);}
 }else if(biome==='urban'){
  if(hash%8===0){
   const h=.55+(hash%4)*.16;
   box(parent,0x62757b,x,.5*h,z,.74,h,.7);
   box(parent,0x83969b,x,h+.045,z,.79,.07,.75);
   for(let side of [-1,1])box(parent,0xb5c8c7,x+side*.2,h*.58,z+.36,.12,.14,.01);
  }else if(hash%17===0){rod(parent,0x727b76,[x,.02,z],[x,.73,z],.028);
   ball(parent,0xead4a1,x,.75,z,.09,.085,.085);}
 }else if(biome==='snow'){
  if(hash%13===0){
   box(parent,0xa5b6b3,x,.19,z,.61,.38,.58);
   const roof=cone(parent,0xdce4e4,x,.53,z,.43,.31);roof.rotation.y=.78;
   box(parent,0x6e8790,x,.28,z+.30,.13,.13,.018);
  }else if(hash%7===0)ball(parent,0xe9efee,x,.08,z,.26,.12,.19);
 }else if(biome==='mountain'){
  if(hash%21===0&&t.terrain==='plain'){
   box(parent,0x89998e,x,.23,z,.65,.43,.62);
   const roof=cone(parent,0x586e6a,x,.52,z,.46,.28);roof.rotation.y=.78;
   box(parent,0xe2cf9f,x,.35,z+.32,.11,.13,.015);
  }
 }else{
  if(hash%18===0){
   for(let j=0;j<3;j++)box(parent,0xb0a17d,x-.3+j*.3,.10,z+.15,.22,.20,.16);
  }else if(hash%11===0){
   rod(parent,0xa6a287,[x-.4,.02,z-.31],[x+.4,.02,z-.31],.026);
   for(const dx of [-.35,0,.35])rod(parent,0x9a947d,[x+dx,.02,z-.31],[x+dx,.31,z-.31],.017);
  }
 }
}
function skyDome(parent,s){
 const b=s.mission.biome,sky={
  grass:[0x273f66,0x92b9cf,0xd4d9c2],
  desert:[0x49678e,0xdba67e,0xf2cb99],
  snow:[0x596b81,0xadc5ce,0xe1e7e5],
  urban:[0x344d6e,0x92a8b4,0xb8bbb5],
  coast:[0x244f81,0x87bed5,0xc9dde1],
  islands:[0x2b6985,0x9ecfca,0xdde6cc],
  mountain:[0x263e69,0x82a9c2,0xc3d3dc]
 }[b]||[0x526782,0xa6bfca,0xd2d8cf];
 const geo=new T.SphereGeometry(175,36,18),pos=geo.attributes.position,cols=[];
 const top=new T.Color(sky[0]),middle=new T.Color(sky[1]),horizon=new T.Color(sky[2]);
 for(let i=0;i<pos.count;i++){
  const h=pos.getY(i)/175;
  const color=h>.25?middle.clone().lerp(top,Math.min(1,(h-.25)*1.35)):horizon.clone().lerp(middle,Math.max(0,Math.min(1,(h+.18)*2.4)));
  cols.push(color.r,color.g,color.b);
 }
 geo.setAttribute('color',new T.Float32BufferAttribute(cols,3));
 const dome=new T.Mesh(geo,new T.MeshBasicMaterial({vertexColors:true,side:T.BackSide,depthWrite:false,fog:false}));
 dome.userData.sky=true;dome.renderOrder=-100;parent.add(dome);
 const sunGeo=new T.SphereGeometry(b==='snow'?4.4:5.7,14,10);
 const orb=new T.Mesh(sunGeo,new T.MeshBasicMaterial({color:b==='desert'?0xffdbb0:0xfff4d6,fog:false,depthWrite:false}));
 orb.position.set(-78,106,-105);orb.userData.sky=true;parent.add(orb);
}
class View{
constructor(canvas,labels){this.canvas=canvas;this.labels=labels;this.scene=new T.Scene();this.scene.background=new T.Color(0x8ba9b4);this.scene.fog=new T.Fog(0xa9bac1,36,85);this.scene.add(new T.HemisphereLight(0xffffff,0x687964,2));let sun=new T.DirectionalLight(0xffefd2,2.5);sun.position.set(-8,16,10);this.scene.add(sun);this.camera=new T.PerspectiveCamera(42,1,.12,240);this.eye=new T.Vector3(-18,19,22);this.yaw=2.50;this.pitch=-.60;this.flightSpeed=9;this.controls='flight';this.keys=new Set();this.flightVelocity=new T.Vector3();this.flightTick=0;this.cameraEase=null;this.backdrop=new T.Group();this.scene.add(this.backdrop);this.groups=new Map();this.labelsMap=new Map();this.wakes=[];this.ray=new T.Raycaster();this.pointer=new T.Vector2();this.animations=[];this.effects=[];this.impactGroup=new T.Group();this.scene.add(this.impactGroup);this.impactHistory=[];this.last=0;this.motion=true;this.dirty=true;this.staticFaces=null;this.metrics={frames:0,renderMs:0,staticBuilds:0};this.selectedId=null;
try{this.renderer=new T.WebGLRenderer({canvas,antialias:true,powerPreference:'low-power'});this.renderer.setPixelRatio(Math.min(devicePixelRatio,1.25));this.renderer.outputColorSpace=T.SRGBColorSpace;this.renderer.toneMapping=T.ACESFilmicToneMapping;this.renderer.toneMappingExposure=1.1;this.renderer.shadowMap.enabled=true;this.renderer.shadowMap.type=T.PCFSoftShadowMap;sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);Object.assign(sun.shadow.camera,{left:-22,right:22,top:22,bottom:-22});sun.shadow.bias=-.002;this.software=false;}catch(e){this.software=true;let replacement=document.createElement('canvas');replacement.id=canvas.id;canvas.replaceWith(replacement);this.canvas=replacement;this.ctx=replacement.getContext('2d');}
this.tileGroup=new T.Group();this.unitGroup=new T.Group();this.markGroup=new T.Group();this.fogGroup=new T.Group();this.scene.add(this.tileGroup,this.unitGroup,this.markGroup,this.fogGroup);this.resize();this.bind();this.resizeObserver=new ResizeObserver(()=>this.resize());this.resizeObserver.observe(this.canvas.parentElement);requestAnimationFrame(t=>this.frame(t));}
// A true free camera: neither the level nor the view target is rotated around a central pivot.
direction(){const c=Math.cos(this.pitch);return new T.Vector3(Math.sin(this.yaw)*c,Math.sin(this.pitch),Math.cos(this.yaw)*c);}
clampEye(){
 if(!this.eye)return;
 const limX=(this.state?.w||26)*1.65,limZ=(this.state?.h||22)*1.9;
 this.eye.x=Math.max(-limX,Math.min(limX,this.eye.x));
 const tileX=this.eye.x+(this.state?.w||26)/2-.5,tileY=this.eye.z+(this.state?.h||22)/2-.5;const floor=this.state?A.groundHeight(this.state,tileX,tileY):0;this.eye.y=Math.max(floor+1.35,Math.min(85,this.eye.y));
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
 const targetHeight=A.groundHeight(this.state,x,y)+.45,height=Math.max(9.5,targetHeight+8),back=11.5;
 // Preserve current heading while actually flying to a new position.
 this.eye.set(worldX-Math.sin(this.yaw)*back,height,worldZ-Math.cos(this.yaw)*back);
 this.clampEye();
 const dx=worldX-this.eye.x,dz=worldZ-this.eye.z;
 this.yaw=Math.atan2(dx,dz);this.pitch=Math.atan2(targetHeight-this.eye.y,Math.hypot(dx,dz));
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
setState(s){this.staticFaces=null;this.dirty=true;this.animations=[];this.effects.forEach(e=>{e.el?.remove();this.scene.remove(e.fx);});this.effects=[];if(!this.impactGroup){this.impactGroup=new T.Group();this.scene.add(this.impactGroup);}this.clear(this.impactGroup);this.impactHistory=[];this.state=s;this.slopeSurfaces=[];this.clear(this.tileGroup);this.clear(this.unitGroup);this.clear(this.backdrop);this.groups.clear();this.wakes=[];this.labels.innerHTML='';this.labelsMap.clear();let biome=s.mission.biome;this.scene.background.set(({grass:0x8eb4c0,desert:0xe1b47f,snow:0xa3bbcc,urban:0x899ead,coast:0x8cb7bf,islands:0x8dbfba,toy:0xa58c78,mountain:0x8fa7bd})[biome]||0x91a9b4);this.scene.fog=new T.Fog(this.scene.background,38,78);let palette=biome==='desert'?[0xbca678,0xc7b486,0xd4c296]:biome==='snow'?[0xd7dfd7,0xcad6d0,0xe5e9dd]:biome==='urban'?[0x657581,0x73818c,0x87949b]:biome==='coast'?[0xbcae7d,0xcbbb8c,0xad9f72]:biome==='islands'?[0x4b8c70,0x619878,0x74aa87]:biome==='toy'?[TOY_FELT,TOY_FELT,TOY_FELT]:biome==='mountain'?[0x6e8a82,0x819b90,0xa5b6a1]:[0x60866c,0x6d9379,0x80a28a];this.groundColor=palette[1];this.fogSeenMat?.dispose();this.fogHiddenMat?.dispose();this.fogSeenMat=new T.MeshBasicMaterial({color:0x14241e,transparent:true,opacity:.13,depthWrite:false});this.fogHiddenMat=new T.MeshBasicMaterial({color:0x14241e,transparent:true,opacity:.34,depthWrite:false});this.makeBackdrop(s);


s.tiles.forEach(t=>{if(t.terrain==='void')return;
 const patch=new T.Group(),height=A.elevation(s,t);patch.position.y=height;patch.userData.tilePatch=t;this.tileGroup.add(patch);
 let x=t.x-s.w/2+.5,z=t.y-s.h/2+.5,n=(t.x*17+t.y*31)%13,c=t.terrain==='water'?0x397d8a:t.terrain==='road'||t.terrain==='bridge'?biome==='mountain'?0x858a82:0x626c69:biome==='toy'?TOY_FELT:biome==='mountain'?(height>2.65?0xc5d3cc:height>1.85?0x819a94:t.terrain==='forest'?0x557a68:0x688779):new T.Color(palette[1]).multiplyScalar(.99+(n%5)*.004).getHex();
 let tile;
 if(biome==='mountain'){
  // Square cliff columns reach below the cloud layer; road ramps are separate triangular meshes.
  box(patch,t.terrain==='mountain'?0x546966:0x607a72,x,-(height+3.15)*.5-.03,z,.997,height+3.15,.997);
  tile=mesh(patch,slopeGeometry(s,t),c,x,.018,z);tile.userData.terrainSurface=true;this.slopeSurfaces.push(tile);
 }else tile=box(patch,c,x,-.25,z,1,.5,1);
 tile.userData.tile=t;if(biome!=='toy'){tile.material=terrainMaterial(c,t.terrain==='water'?'water':['road','bridge'].includes(t.terrain)?'road':biome);}
if(t.pad){box(patch,0x344e59,x,.025,z,.82,.035,.82);for(let i=-2;i<=2;i++)box(patch,0xc7ba86,x+i*.13,.049,z,.05,.01,.65);}
if(t.terrain==='mountain'){
 if(biome==='toy'){
  // The mountain terrain is a cardboard obstacle: clustered folded ridges, not a cone on every tile.
  box(patch,0x65786d,x,.055,z,.96,.11,.96);
  if((t.x*13+t.y*7+s.mission.seed)%4===0){
   const ridge=crag(patch,0x9d967b,x,.115,z,1.03,.61,.88,(n+2)%5);
   ridge.rotation.y=((n%3)-1)*.15;
   box(patch,0xc3b18e,x-.1,.15,z+.28,.5,.12,.2);
  }
 }else{
  if(biome==='mountain')highlandDetails(patch,s,t,x,z,n);
  else{
   const rock=biome==='snow'?0xbccbd0:biome==='desert'?0x9c8876:0x526a69;
   crag(patch,rock,x,.025,z,.92,.82+(n%3)*.09,.89,n%5);
   crag(patch,biome==='snow'?0xe3e8e4:0x81958c,x+.18,.21,z-.12,.44,.32,.42,(n+2)%5);
  }
 }
}
if(t.objective){for(let dx of [-.45,.45])box(patch,0xe1b568,x+dx,.055,z,.04,.04,.9);}
if(t.terrain==='water'){box(patch,0x77a9ab,x-.18,.008,z+.22,.35,.008,.012);if(n%2)box(patch,0x61979c,x+.2,.008,z-.2,.21,.008,.012);}
if(t.path){const dz=t.pathAxis==='x';box(patch,biome==='snow'?0xd2d5c6:biome==='desert'?0xaa926d:0x9b906f,x,.012,z,dz?.96:.20,.018,dz?.20:.96);for(let j=0;j<3;j++)box(patch,0xd0c4a1,x+(dz?(j-1)*.3:.04),.025,z+(dz?.035:(j-1)*.3),.07,.018,.048);}
if(t.terrain==='bridge'){for(let side of [-1,1]){box(patch,0xafafa0,x,.15,z+side*.43,1,.06,.045);for(let dx of [-.4,.4])box(patch,0x777f76,x+dx,.08,z+side*.43,.04,.2,.04);}}
if((t.terrain==='road'||t.terrain==='bridge')&&!t.facility){
 const isRoad=(xx,yy)=>['road','bridge'].includes(A.tile(s,xx,yy)?.terrain);
 const e=isRoad(t.x+1,t.y),w=isRoad(t.x-1,t.y),n=isRoad(t.x,t.y-1),so=isRoad(t.x,t.y+1);
 const horizontal=(e||w)&&!(n||so)||(e&&w),vertical=!horizontal&&(n||so);
 const junction=(e||w)&&(n||so);
 const markColor=t.terrain==='bridge'?0xd9d7c4:0xcdd2b7;
 if(!junction){if(horizontal){box(patch,markColor,x,.019,z,.35,.01,.025);for(const off of [-.43,.43])box(patch,0x99a8a0,x,.014,z+off,.98,.012,.018);}
 else if(vertical){box(patch,markColor,x,.019,z,.025,.01,.35);for(const off of [-.43,.43])box(patch,0x99a8a0,x+off,.014,z,.018,.012,.98);}}
 else{for(const dx of [-.32,.32])for(const dz of [-.32,.32])box(patch,0xadb4aa,x+dx,.014,z+dz,.08,.01,.08);}
}
if(t.terrain==='forest'){const tx=x-.18+(n%3)*.06,tz=z-.19+(n%4)*.045;if(biome==='desert'){for(let k=0;k<3;k++)rod(patch,0x89906b,[tx,.02,tz],[tx+(k-1)*.12,.31,tz+.06*k],.028);ball(patch,0x9f996e,tx,.34,tz,.19,.13,.22);}else{pine(patch,tx,tz,n,biome==='snow');if(n%3!==1)pine(patch,x+.27,z+.22,(n+2)%13,biome==='snow');}if(n%3===0)crag(patch,0x72877b,x+.32,.02,z-.28,.16,.12,.20,n%5);}
if(t.terrain==='hill'||t.terrain==='dune'){const sand=t.terrain==='dune';const hill=crag(patch,sand?0xc1a178:biome==='snow'?0xdbdfdd:0x738a79,x-.03,.01,z-.03,.74,.26+(n%3)*.07,.78,(n+2)%5);hill.rotation.y=n*.11;if(n%2===0)crag(patch,sand?0xd6b88b:0x94a696,x+.3,.01,z+.26,.25,.16,.22,n%5);}
if(biome==='mountain'&&t.terrain!=='mountain')highlandDetails(patch,s,t,x,z,n);
if(t.terrain==='ruins'){if(biome==='toy'){addToyProp(patch,s,t);}else{box(patch,0x9a9d90,x-.23,.25,z,.11,.5,.55);box(patch,0xc0bca6,x,.16,z-.23,.55,.32,.11);for(let i=0;i<3;i++){let rubble=box(patch,0x7d8980,x+.12+i*.07,.06,z+.1,.15,.12,.13);rubble.rotation.y=i;}}}
scenicDetail(patch,s,t,x,z,n);
if(t.facility){let g=new T.Group();g.position.set(x,0,z);g.userData.facility=t;patch.add(g);let col=t.owner===0?colors.blue:t.owner===1?colors.red:0x9c9b7a;box(g,0x8c9688,0,.025,0,.94,.05,.9);
if(t.facility==='airfield'){box(g,0x394e53,0,.065,0,.8,.03,.8);for(let dx of [-.16,.16])box(g,0xd7cfb0,dx,.09,0,.04,.01,.38);box(g,0xd7cfb0,0,.09,0,.32,.01,.04);for(let dx of [-.38,.38])for(let dz of [-.38,.38])ball(g,0xf0be67,dx,.09,dz,.025,.025,.025);}
else if(t.facility==='relay'){box(g,0xa9ad98,0,.14,0,.45,.25,.45);for(let dx of [-.12,.12])rod(g,0x526b67,[dx,.24,0],[0,.95,0],.025);let dish=cylinder(g,0xd0d5c3,0,.95,0,.22,.035);dish.rotation.x=.65;rod(g,0x30464c,[0,.95,0],[0,1.1,.2],.015);}
else if(t.facility==='hq'){bevel(g,0xaab1a0,0,.27,0,.77,.44,.63);box(g,col,0,.51,-.06,.64,.08,.54);box(g,0x243f49,0,.33,.32,.5,.1,.015);box(g,0x567c7c,.12,.65,-.12,.3,.25,.25);box(g,0xc4c6ad,.12,.79,-.12,.36,.05,.31);rod(g,0xd2c6a8,[-.22,.5,-.18],[-.22,1.08,-.18],.012);box(g,0xd2c6a8,-.22,.94,-.18,.22,.015,.015);for(let dx of [-.35,.35])box(g,0x586c66,dx,.12,.3,.13,.18,.3);}
else if(t.facility==='factory'){box(g,0xa6ab99,0,.25,0,.73,.43,.6);box(g,col,0,.49,0,.8,.08,.68);box(g,0x354a4e,0,.22,.31,.4,.3,.02);cylinder(g,0x596963,.26,.65,-.19,.065,.75);for(let i=0;i<3;i++)box(g,0x849b91,-.22+i*.2,.4,.315,.1,.07,.01);}
else{box(g,0xc6bea4,-.12,.24,0,.48,.42,.5);let roof=cone(g,0x786d59,-.12,.55,0,.38,.25);roof.rotation.y=Math.PI/4;box(g,0x49666b,-.23,.28,.26,.1,.12,.02);box(g,0x63756c,-.04,.17,.26,.1,.26,.02);box(g,0xa3a58d,.28,.15,-.12,.24,.25,.25);}
rod(g,0xc0baa3,[.39,0,.3],[.39,.95,.3],.012);let flag=box(g,col,.49,.84,.3,.2,.13,.012);g.userData.flag=flag;}
});
 if(biome==='mountain'){
  for(const t of s.tiles){
   if(t.terrain!=='road'&&t.terrain!=='bridge')continue;
   for(const [dx,dy] of [[1,0],[0,1]]){
    const next=A.tile(s,t.x+dx,t.y+dy);
    if(!next||!['road','bridge'].includes(next.terrain))continue;
    if(Math.abs(A.elevation(s,t)-A.elevation(s,next))<.2)continue;
    const ramp=new T.Mesh(rampGeometry(s,t,next),terrainMaterial(0xaaa58e,'road'));
    ramp.userData.roadRamp=true;ramp.receiveShadow=true;ramp.material.side=T.DoubleSide;
    this.tileGroup.add(ramp);
   }
  }
 }
 this.batchTerrain();this.cameraUpdate();this.sync();}
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
makeAlpineSurround(s){
 // Outboard square cliffs, not rolling curved terrain; mist rests BELOW the playable summit.
 const g=this.backdrop,w=s.w,h=s.h;
 for(let y=-2;y<=h+1;y++){
  for(const x of [-2,-1,w,w+1]){
   const height=A.groundHeight(s,x,y),wx=x-w/2+.5,wz=y-h/2+.5;
   box(g,(x+y)%3===0?0x637e79:0x6f8981,wx,(height-3.2)*.5,wz,1.01,height+3.2,1.01);
   if((x+y*3)%8===0){
    const p=crag(g,0x8eaaa0,wx,height+.01,wz,.62,.31,.66,(x+y+50)%5);p.rotation.y=.25;
   }
  }
 }
 for(let x=0;x<w;x++){
  for(const y of [-2,-1,h,h+1]){
   const height=A.groundHeight(s,x,y),wx=x-w/2+.5,wz=y-h/2+.5;
   box(g,(x*7+y)%5===0?0x5f7b75:0x718e86,wx,(height-3.2)*.5,wz,1.01,height+3.2,1.01);
  }
 }
 // Broad, low cloud banks make the terrain feel like a peak above the clouds.
 for(let i=0;i<23;i++){
  const angle=i*2.399,rad=Math.max(w,h)*.52+2+(i%4)*2.5;
  const x=Math.cos(angle)*rad,z=Math.sin(angle)*rad;
  const cloud=ball(g,0xdce9ed,x,-1.35+(i%3)*.16,z,2.8+(i%4)*.75,.25,1.9+(i%3)*.6);
  cloud.material=new T.MeshBasicMaterial({color:0xe1eff3,transparent:true,opacity:.54,depthWrite:false});
 }
 // Monumental distant mountains have jagged silhouettes; playable ground remains square.
 for(let i=0;i<20;i++){
  const angle=i*Math.PI*2/20,rad=25+(i%4)*2;
  const x=Math.cos(angle)*rad,z=Math.sin(angle)*rad;
  const hgt=5.5+(i%5)*1.45,peak=crag(g,i%3===0?0xb3bec0:0x668482,x,-2.9,z,5+(i%3),hgt,4+(i%4),i%5);
  peak.rotation.y=i*.27;
 }
}
makeHarbor(s){
 const g=this.backdrop,coast=s.mission.biome==='coast',w=s.w/2;
 // Port structures sit just beyond the tactical map edge, rather than cluttering its tiles.
 const x=w+3,z=-s.h*.22,steel=0x647d83,wood=0x867e6b;
 for(let i=0;i<3;i++){
  const zz=z+i*3.3;
  box(g,wood,x-1.4,.13,zz,4.2,.26,1.55);
  for(let side of [-1,1])for(let end of [-1,1])box(g,0x546568,x-1.4+side*1.9,-.26,zz+end*.65,.19,.77,.23);
  box(g,i%2?0xc5ab80:0x9bada8,x+.5,1.0,zz,.95,1.8,.95);
  for(let j=0;j<3;j++)box(g,[0x9b6d5b,0xc4a078,0x748e94][(i+j)%3],x-2.6+j*.85,.38,zz+.13,.76,.61,.82);
  const mastX=x+1.5;
  rod(g,steel,[mastX,0,zz],[mastX,4.7,zz],.075);
  rod(g,steel,[mastX,4.45,zz],[mastX-2.1,4.45,zz],.052);
  rod(g,steel,[mastX-1.8,4.45,zz],[mastX-1.8,1.2,zz],.012);
  box(g,0xcfbd93,mastX-1.8,1.1,zz,.19,.15,.16);
 }
 // Harbor entry lighthouse and water tower are navigational landmarks.
 const lx=w+5,lz=s.h*.38;
 cylinder(g,0xd6d8c7,lx,1.22,lz,.47,2.45);
 cylinder(g,0xc86f5e,lx,2.55,lz,.52,.25);
 cylinder(g,0xe4c789,lx,2.9,lz,.41,.45);
 cone(g,0x546e71,lx,3.3,lz,.65,.41);
 for(let i=0;i<5;i++)box(g,0x829a9b,lx,.2+i*.26,lz+.46,.06,.10,.045);
 if(coast){
  for(let i=0;i<3;i++){
   const zz=-s.h*.40+i*4.6;
   box(g,0x879794,-w-4.5,.9,zz,2.8,1.8,2.5);
   const roof=box(g,0x536f70,-w-4.5,1.88,zz,3.1,.18,2.65);roof.rotation.z=i%2?.12:-.12;
   for(let k=0;k<3;k++)box(g,0xd1bf97,-w-5.2+k*.72,.80,zz+1.27,.23,.34,.05);
  }
 }
}
makeBackdrop(s){const b=s.mission.biome,seed=s.mission.seed||1,isToy=b==='toy',snow=b==='snow',high=b==='mountain',urban=b==='urban',desert=b==='desert';
 const land=(b==='coast'||b==='islands')?0x397d8a:(this.groundColor||TOY_FELT);
 // A real terrain-colored world beneath the board prevents the sky from appearing as the floor.
 const floor=box(this.backdrop,b==='mountain'?0x7895a9:land,0,b==='mountain'?-3.255:-.255,0,125,.5,115);if(!isToy)floor.material=terrainMaterial(b==='mountain'?0x7895a9:land,(b==='coast'||b==='islands')?'water':b);if(isToy){this.makeToyRoom(s);return;}skyDome(this.backdrop,s);if(b==='mountain')this.makeAlpineSurround(s);if(b==='coast'||b==='islands')this.makeHarbor(s);
 for(let i=0;i<55;i++){const a=i/55*Math.PI*2,range=18+(i%6)*2.4,x=Math.cos(a)*range,z=Math.sin(a)*range;
  if(high||snow||desert)crag(this.backdrop,high?0x627c78:snow?0xb4c5c8:0xbda17c,x,-.49,z,1.5+(i%4),.35+(i%5)*.17,1.4+(i%3),i%5);
  else if((b==='coast'||b==='islands')&&i%4===0){crag(this.backdrop,0x689486,x,-.23,z,2.4+(i%3),.48+(i%2)*.32,2.8,i%5);if(i%3===0)pine(this.backdrop,x+.25,z-.2,i,false);}
  else if(!isToy&&!urban&&b!=='coast'&&b!=='islands'&&i%2===0)pine(this.backdrop,x,z,i,snow);
  else if(urban&&i%4===0)box(this.backdrop,0x495760,x,.25,z,1.8,1.1,2.3);
 }
 for(let i=0;i<38;i++){const angle=i/38*Math.PI*2,dist=27+(i%6)*1.9,x=Math.cos(angle)*dist,z=Math.sin(angle)*dist,r=(Math.sin(i*2.7+seed*.2)+1)*.5;if(isToy){const q=box(this.backdrop,i%3===0?0x846e5a:0x9e856a,x,3.1,z,2.5,6,2.3);q.rotation.y=angle+.15;if(i%6===0)box(this.backdrop,0xb39c75,x,6.3,z,2.7,.3,2.5);}else if(urban){box(this.backdrop,[0x5a6870,0x788996,0x677c85][i%3],x,1.5+r*2,z,1.2+r*1.5,3+r*4,1.1+r*.9);}else if(high||snow){const peak=crag(this.backdrop,snow?0xdde6e8:i%3===0?0xa5b5bc:0x637d80,x,-.35,z,4+r*1.4,5+r*3,4+r*1.4,i%5);peak.rotation.y=i*.3;}else if(!desert){for(let k=0;k<2;k++)cone(this.backdrop,0x294c49,x+k*.9,1.2,z+.3*k,.9,2.5+r*2);}else{const dune=box(this.backdrop,0xd0b58a,x,.25,z,3,.5+r,2.6);dune.rotation.y=i*.3;}}if(high||snow||b==='coast'||b==='islands'){for(let i=0;i<11;i++){const x=(i-5)*5;const peak=crag(this.backdrop,high?0x768a9e:snow?0xe3e9ee:0x638b93,x,-.34,-31,6,8+(i%4)*2,4.5,i%5);peak.rotation.y=i*.3;}}const storm=(s.mission.n%5===3),snowfall=b==='snow'&&s.mission.n%2===0;for(let i=0;i<(storm?23:11);i++){let angle=i/23*Math.PI*2,dist=25+(i%4)*2,x=Math.cos(angle)*dist,z=Math.sin(angle)*dist,y=8+(i%4)*.7;ball(this.backdrop,storm?0x657983:0xe2e5e0,x,y,z,2.1,.42,1.3);ball(this.backdrop,storm?0x4a5f6a:0xf1eee1,x+.9,y+.14,z+.3,1.3,.51,1.1);}if(storm||snowfall){for(let i=0;i<76;i++){let x=Math.sin(i*12.98+seed)*s.w*.48,z=Math.cos(i*9.13+seed)*s.h*.48,y=1.9+(i%11)*.27;if(snowfall)ball(this.backdrop,0xffffff,x,y,z,.035,.035,.035);else rod(this.backdrop,0xa4b8be,[x,y,z],[x-.12,y-.35,z+.09],.009);}}}
batchTerrain(){if(!this.renderer)return;this.tileGroup.updateMatrixWorld(true);let buckets=new Map(),remove=[];this.tileGroup.traverse(o=>{if(!o.isMesh||o.userData.terrainSurface||o.userData.roadRamp||o.parent.userData.facility)return;let key=o.geometry.uuid+o.material.uuid;if(!buckets.has(key))buckets.set(key,[]);buckets.get(key).push(o);remove.push(o);});for(let meshes of buckets.values()){let first=meshes[0],batch=new T.InstancedMesh(first.geometry,first.material,meshes.length);meshes.forEach((m,i)=>batch.setMatrixAt(i,m.matrixWorld));batch.castShadow=true;batch.receiveShadow=true;batch.instanceMatrix.needsUpdate=true;this.tileGroup.add(batch);}remove.forEach(o=>o.parent.remove(o));}
sync(){this.dirty=true;let s=this.state;const present=new Set(s.units.map(u=>u.id));for(const [id,g]of this.groups)if(!present.has(id)){this.unitGroup.remove(g);this.groups.delete(id);this.labelsMap.get(id)?.remove();this.labelsMap.delete(id);}this.clear(this.fogGroup);s.seen=s.seen||[];for(let t of s.tiles){if(t.terrain==='void')continue;const index=t.y*s.w+t.x;if(A.tileVisible(s,t)||t.pad)s.seen[index]=true;else{const seen=!!s.seen[index],shade=this.software?new T.Color(this.groundColor||TOY_FELT).multiplyScalar(seen?.82:.65).getHex():0x26372d;const overlay=box(this.fogGroup,shade,t.x-s.w/2+.5,A.elevation(s,t)+.075,t.y-s.h/2+.5,.998,.018,.998);if(!this.software)overlay.material=seen?this.fogSeenMat:this.fogHiddenMat;}}s.units.forEach(u=>{if(u.hp<=0||u.carried||!A.visible(s,u)){let g=this.groups.get(u.id);if(g)g.visible=false;let l=this.labelsMap.get(u.id);if(l)l.style.display='none';return;}let g=this.groups.get(u.id);if(!g){g=model(u.type,u.team);g.userData.unitId=u.id;if(A.D[u.type].branch==='Navy'){
  const wake=new T.Group();wake.userData.wake=true;g.add(wake);g.userData.wake=wake;
  for(let k=0;k<3;k++)for(let side of [-1,1]){
   const q=box(wake,0x91c9c9,side*(.19+k*.10),.025,-.48-k*.18,.12+k*.05,.012,.07);
   q.rotation.y=side*.17;
  }
 }
 if(u.battery)g.scale.setScalar(1.55);else if(u.strongpoint)g.scale.setScalar(1.23);else if(u.flagship)g.scale.setScalar(1.17);this.unitGroup.add(g);this.groups.set(u.id,g);let label=document.createElement('div');label.className='unit-label '+(u.team?'enemy':'friendly');label.innerHTML='<span></span><i><b></b></i>';this.labels.append(label);this.labelsMap.set(u.id,label);g.rotation.y=u.team?Math.PI:0;}g.visible=true;if(!this.animations.some(a=>a.id===u.id))g.position.set(u.x-s.w/2+.5,(A.D[u.type].branch==='Air'&&!u.landed?1.1:.04)+A.elevation(s,A.tile(s,u.x,u.y)),u.y-s.h/2+.5);let l=this.labelsMap.get(u.id);l.style.display='block';l.classList.toggle('selected',u.id===this.selectedId);l.classList.toggle('damaged',u.hp<u.maxHp);l.classList.toggle('critical-label',u.disabled||!u.ammo.some(n=>n>0));l.querySelector('span').textContent=u.disabled?'IMMOBILIZED':!u.ammo.some(n=>n>0)?'NO AMMO':u.landed?'LANDED':u.courier?'CONVOY':u.battery?'SIEGE BATTERY':u.strongpoint?'FORTIFIED':u.flagship?'FLAGSHIP':u.command?'COMMAND':u.team===0?(u.fired?'✓':u.moved?'•':'••'):'';l.querySelector('b').style.width=(u.hp/u.maxHp*100)+'%';});this.tileGroup.traverse(g=>{if(g.userData.flag){let t=g.userData.facility;if(g.userData.owner!==t.owner){g.userData.owner=t.owner;this.staticFaces=null;}g.userData.flag.material=mat(t.owner===0?colors.blue:t.owner===1?colors.red:0x9c9b7a);}});}
mark(selected,moves,targets){this.selectedId=selected?.id||null;this.dirty=true;this.clear(this.markGroup);let s=this.state;const mark=(x,y,col,h)=>{let m=box(this.markGroup,col,x-s.w/2+.5,A.groundHeight(s,x,y)+.065+(h||0),y-s.h/2+.5,.87,.025,.87);return m;};if(selected){const region=new Set(moves.map(p=>p.x+','+p.y));moves.forEach(p=>{let x=p.x-s.w/2+.5,z=p.y-s.h/2+.5;box(this.markGroup,0x48bea5,x,A.groundHeight(s,p.x,p.y)+.06,z,.24,.018,.24);});A.rangeTiles(s,selected).forEach(p=>{let x=p.x-s.w/2+.5,z=p.y-s.h/2+.5;for(let side of [-1,1]){box(this.markGroup,0xcf8d51,x+side*.39,A.groundHeight(s,p.x,p.y)+.09,z,.022,.02,.78);box(this.markGroup,0xcf8d51,x,A.groundHeight(s,p.x,p.y)+.09,z+side*.39,.78,.02,.022);}});moves.forEach(p=>{let x=p.x-s.w/2+.5,z=p.y-s.h/2+.5;for(let [dx,dy]of [[1,0],[-1,0],[0,1],[0,-1]])if(!region.has((p.x+dx)+','+(p.y+dy)))box(this.markGroup,0x3c8e80,x+dx*.46,A.groundHeight(s,p.x,p.y)+.07,z+dy*.46,dx?.035:.94,.018,dy?.035:.94);});targets.forEach(u=>{let x=u.x-s.w/2+.5,z=u.y-s.h/2+.5;for(let side of [-1,1]){box(this.markGroup,0xc45c43,x+side*.42,A.groundHeight(s,u.x,u.y)+.08,z,.035,.03,.84);box(this.markGroup,0xc45c43,x,A.groundHeight(s,u.x,u.y)+.08,z+side*.42,.84,.03,.035);}});let x=selected.x-s.w/2+.5,z=selected.y-s.h/2+.5;for(let side of [-1,1]){box(this.markGroup,0xf4d98c,x+side*.47,A.groundHeight(s,selected.x,selected.y)+.11,z,.045,.05,.98);box(this.markGroup,0xf4d98c,x,A.groundHeight(s,selected.x,selected.y)+.11,z+side*.47,.98,.05,.045);}}
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
pick(e){let r=this.canvas.getBoundingClientRect();this.pointer.set((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1);this.ray.setFromCamera(this.pointer,this.camera);if(!this.state)return null;this.unitGroup.updateMatrixWorld(true);for(const hit of this.ray.intersectObjects(this.unitGroup.children,true)){let g=hit.object;while(g&&!g.userData.unitId)g=g.parent;if(g&&g.visible){let u=this.state.units.find(u=>u.id===g.userData.unitId);if(u&&u.hp>0&&!u.carried&&A.visible(this.state,u))return {x:u.x,y:u.y};}}if(this.state.mission.biome==='mountain'){
 this.tileGroup.updateMatrixWorld(true);
 for(const hit of this.ray.intersectObjects(this.slopeSurfaces||[],false)){
  const t=hit.object.userData.tile;
  if(t&&t.terrain!=='void')return {x:t.x,y:t.y};
 }
 return null;
}
let p=new T.Vector3();
if(!this.ray.ray.intersectPlane(new T.Plane(new T.Vector3(0,1,0),0),p))return null;
let x=Math.floor(p.x+this.state.w/2),y=Math.floor(p.z+this.state.h/2);
return x>=0&&x<this.state.w&&y>=0&&y<this.state.h&&A.tile(this.state,x,y).terrain!=='void'?{x,y}:null;}
events(){
 const now=performance.now(),s=this.state;
 for(const ev of s.events.splice(0)){
  if(ev.kind==='move'){
   if(!this.motion||!Array.isArray(ev.path)||!ev.path.length)continue;
   const unit=s.units.find(u=>u.id===ev.id),branch=A.D[unit?.type]?.branch,
    millis=branch==='Navy'?240:branch==='Air'?165:branch==='Infantry'?220:200;
   this.animations=this.animations.filter(a=>a.id!==ev.id);
   this.animations.push({...ev,start:now,duration:Math.min(2200,Math.max(230,ev.path.length*millis))});
  }else if(ev.kind==='attack'||ev.kind==='counter')this.makeShot(ev,now);
 }
 this.sync();
}

 // Impacts are decorative only. They never alter pathfinding, damage, or tile ownership.
 addImpactMark(ev){
  if(!ev.explosive||!this.state||!this.impactGroup)return null;
  const s=this.state,t=A.tile(s,ev.to.x,ev.to.y);
  if(!t||t.terrain==='void')return null;
  const wet=t.terrain==='water', snow=s.mission.biome==='snow',toy=s.mission.biome==='toy';
  const g=new T.Group(),x=ev.to.x-s.w/2+.5,z=ev.to.y-s.h/2+.5,y=A.groundHeight(s,ev.to.x,ev.to.y)+.038;
  g.position.set(x,y,z);g.userData.impactMark=true;g.userData.water=wet;
  const radius=Math.min(.34,.22+(ev.damage||0)*.001);
  const dark=new T.Mesh(new T.CircleGeometry(radius,13),new T.MeshBasicMaterial({color:wet?0x488f9b:toy?0x64544b:snow?0x929b9a:0x292d29,transparent:true,opacity:wet?.33:.76,depthWrite:false,side:T.DoubleSide}));
  dark.rotation.x=-Math.PI/2;dark.userData.uniqueImpactMaterial=true;g.add(dark);
  const rim=new T.Mesh(new T.RingGeometry(radius*.76,radius*1.25,13),
    new T.MeshBasicMaterial({color:wet?0xb1e0e0:toy?0x927d65:snow?0xc1cbc8:0x726c58,transparent:true,opacity:wet?.56:.73,depthWrite:false,side:T.DoubleSide}));
  rim.position.y=.007;rim.rotation.x=-Math.PI/2;rim.userData.uniqueImpactMaterial=true;g.add(rim);
  if(ev.destroyed&&ev.targetType&&A.D[ev.targetType]?.branch!=='Infantry'&&!wet){
   for(const side of [-1,1]){
    const wreck=box(g,0x313d3b,side*.09,.045,side*.08,.16,.07,.19);
    wreck.rotation.y=side*.53;wreck.rotation.z=side*.26;
   }
  }
  this.impactGroup.add(g);
  this.impactHistory.push(g);
  while(this.impactHistory.length>58){const stale=this.impactHistory.shift();this.impactGroup.remove(stale);stale.traverse(o=>{if(o.userData.uniqueImpactMaterial&&o.material)o.material.dispose();if(o.geometry&&o.geometry!==sphereGeo&&o.geometry!==boxGeo)o.geometry.dispose();});}
  return g;
 }
 createDust(x,z,y,size=.13){
  if(this.effects.length>45||!this.motion||this.software)return;
  const fx=new T.Group(),smoke=mesh(fx,sphereGeo,0x9c9b86,0,0,0,size,size*.5,size);
  smoke.material=new T.MeshBasicMaterial({color:0xb5b1a0,transparent:true,opacity:.23,depthWrite:false});
  fx.position.set(x,y,z);this.scene.add(fx);
  this.effects.push({kind:'dust',fx,smoke,baseSize:size,start:performance.now(),duration:410});
 }
 makeShot(ev,now){
  if(!this.state||!ev.to||!ev.from)return;
  const s=this.state,wet=A.tile(s,ev.to.x,ev.to.y)?.terrain==='water',explosive=!!ev.explosive;
  const fx=new T.Group(),fromY=A.groundHeight(s,ev.from.x,ev.from.y)+.52,toY=A.groundHeight(s,ev.to.x,ev.to.y)+.09;
  const from=new T.Vector3(ev.from.x-s.w/2+.5,fromY,ev.from.y-s.h/2+.5),
        to=new T.Vector3(ev.to.x-s.w/2+.5,toY,ev.to.y-s.h/2+.5);
  const tracer=mesh(fx,sphereGeo,explosive?0xf8dcaa:0xffe0ad,0,0,0,explosive?.065:.037,explosive?.065:.037,explosive?.12:.09);
  tracer.material=new T.MeshBasicMaterial({color:explosive?0xffd28a:0xfff0cb,transparent:true,opacity:1,depthWrite:false});
  const blast=new T.Group();blast.position.copy(to);fx.add(blast);blast.visible=false;
  const flame=mesh(blast,sphereGeo,explosive?0xffa84b:0xf7d8a7,0,.11,0,.24,.22,.24);
  flame.material=new T.MeshBasicMaterial({color:explosive?0xffb452:0xffe2ad,transparent:true,opacity:.95,depthWrite:false});
  const core=mesh(blast,sphereGeo,0xffe1a5,0,.11,0,.15,.14,.15);
  core.material=new T.MeshBasicMaterial({color:0xffebac,transparent:true,opacity:1,depthWrite:false});
  const ring=new T.Mesh(new T.RingGeometry(explosive?.18:.11,explosive?.245:.16,16),
    new T.MeshBasicMaterial({color:wet?0xbde4e8:0xe6c094,side:T.DoubleSide,transparent:true,opacity:.9,depthWrite:false}));
  ring.rotation.x=-Math.PI/2;ring.position.y=.035;blast.add(ring);
  const smoke=mesh(blast,sphereGeo,wet?0xb7dade:0x606b67,0,.21,0,.19,.14,.19);
  smoke.material=new T.MeshBasicMaterial({color:wet?0xc0e3e3:0x666c65,transparent:true,opacity:wet?.42:.48,depthWrite:false});
  const sparks=[];
  if(this.motion&&!this.software){
   for(let i=0;i<(explosive?5:2);i++){
    const p=mesh(blast,sphereGeo,i%2?0xffca6c:0xe7cc9f,0,.12,0,.027,.027,.027);
    p.material=new T.MeshBasicMaterial({color:i%2?0xffbc69:0xe7d2aa,transparent:true,opacity:.88,depthWrite:false});
    sparks.push(p);
   }
  }
  this.scene.add(fx);
  let el=null;
  if(ev.damage>0&&this.labels?.append){
   el=document.createElement('div');el.className='damage';el.textContent='−'+ev.damage;
   el.style.display='none';this.labels.append(el);
  }
  const distance=Math.hypot(ev.to.x-ev.from.x,ev.to.y-ev.from.y);
  const travel=this.motion?Math.min(490,Math.max(135,105+distance*23)):25;
  const burst=this.motion?explosive?690:360:180;
  this.effects.push({kind:'shot',...ev,fx,tracer,blast,flame,core,ring,smoke,sparks,from,to,wet,explosive,el,start:now,travel,burst,duration:travel+burst,impacted:false});
  // Limit the expensive simultaneous active particle systems during 4-battery shellstorms.
  while(this.effects.length>54){const stale=this.effects.shift();stale.el?.remove();if(stale.fx)this.scene.remove(stale.fx);}
 }
 advanceMovement(now,s){
  this.animations=this.animations.filter(a=>{
   const g=this.groups.get(a.id),u=s.units.find(v=>v.id===a.id);
   const count=a.path?.length||0,progress=Math.max(0,Math.min(1,(now-a.start)/Math.max(1,a.duration)));
   if(!g||!u||!count)return false;
   // Continuous travel across EVERY path tile; ease into departure and arrival only.
   const ease=progress<.10?progress*progress*5:progress>.90?1-5*(1-progress)*(1-progress):.05+(progress-.10)*1.125;
   const distance=Math.max(0,Math.min(count,ease*count));
   const idx=Math.min(count-1,Math.floor(distance)),from=idx===0?a.from:a.path[idx-1],to=a.path[idx],mix=progress>=1?1:distance-idx;
   const gx=from.x+(to.x-from.x)*mix,gy=from.y+(to.y-from.y)*mix;
   g.position.set(gx-s.w/2+.5,A.groundHeight(s,gx,gy)+(A.D[u.type].branch==='Air'&&!u.landed?1.1:.04),gy-s.h/2+.5);
   if(A.D[u.type].branch==='Infantry')g.position.y+=Math.abs(Math.sin(distance*Math.PI*3))*.016;
   const desired=Math.atan2(to.x-from.x,to.y-from.y);
   g.rotation.y+=Math.atan2(Math.sin(desired-g.rotation.y),Math.cos(desired-g.rotation.y))*.23;
   if(A.D[u.type].branch==='Air')g.rotation.z=Math.sin(desired-g.rotation.y)*.11;
   if(A.D[u.type].branch==='Armor'&&this.motion&&!this.software&&
      (a.lastDust===undefined||distance-a.lastDust>.85)){
    if(a.lastDust!==undefined||progress>.1)this.createDust(g.position.x,g.position.z,g.position.y,.12);
    a.lastDust=distance;
   }
   if(progress>=1){g.position.set(u.x-s.w/2+.5,A.groundHeight(s,u.x,u.y)+(A.D[u.type].branch==='Air'&&!u.landed?1.1:.04),u.y-s.h/2+.5);g.rotation.z=0;return false;}
   return true;
  });
 }
 advanceEffects(now,s){
  this.effects=this.effects.filter(e=>{
   const elapsed=now-e.start;
   if(elapsed>=e.duration){
    e.el?.remove();if(e.fx)this.scene.remove(e.fx);return false;
   }
   if(e.kind==='dust'){
    const f=elapsed/e.duration;e.smoke.scale.setScalar(e.baseSize*(1+f*2));
    e.smoke.material.opacity=.23*(1-f);
    e.fx.position.y+=.0015;return true;
   }
   if(e.kind!=='shot')return true;
   if(elapsed<e.travel){
    const f=Math.max(0,Math.min(1,elapsed/Math.max(1,e.travel)));
    const midpoint=e.from.clone().lerp(e.to,f);
    midpoint.y+=Math.sin(Math.PI*f)*(e.explosive?1.1:0.26);
    e.tracer.position.copy(midpoint);
    e.tracer.visible=true;e.blast.visible=false;return true;
   }
   if(!e.impacted){
    e.impacted=true;e.tracer.visible=false;e.blast.visible=true;
    e.el&&(e.el.style.display='block');
    this.addImpactMark(e);
    if(e.id){
     const g=this.groups.get(e.id);
     if(g&&g.visible)g.userData.hitAt=now;
    }
   }
   const f=Math.min(1,(elapsed-e.travel)/Math.max(1,e.burst)),p=1-Math.pow(1-f,3);
   const flare=1+p*(e.explosive?2.2:1.0);e.flame.scale.set(.24*flare,.22*flare,.24*flare);
   e.flame.position.y=.10+p*.14;e.flame.material.opacity=.95*Math.pow(1-f,2.5);
   e.core.scale.setScalar(.15*Math.max(.01,1-f*1.7));e.core.material.opacity=1-f;
   e.ring.scale.setScalar(1+p*(e.explosive?3.9:1.9));e.ring.material.opacity=.85*(1-f);
   e.smoke.position.y=.18+f*(e.wet?.32:.65);
   const plume=1+f*(e.explosive?3:1.2);e.smoke.scale.set(.19*plume,.14*plume,.19*plume);
   e.smoke.material.opacity=(e.wet?.42:.48)*(1-f);
   for(let i=0;i<e.sparks.length;i++){
    const a=i*2.399+(e.to.x*13+e.to.y)*.1,rad=f*(.35+(i%3)*.11);
    const p=e.sparks[i];p.position.set(Math.cos(a)*rad,.14+f*.75-.68*f*f,Math.sin(a)*rad);
    p.material.opacity=(1-f)*.84;
   }
   if(e.el){
    const labelY=e.to.y,position=this.project(e.to.x-s.w/2+.5,
     A.groundHeight(s,e.to.x,labelY)+.85+f*.62,e.to.y-s.h/2+.5);
    e.el.style.transform='translate('+Math.round(position.x)+'px,'+Math.round(position.y)+'px)';
    e.el.style.opacity=1-f;
   }
   return true;
  });
 }
project(x,y,z){let p=new T.Vector3(x,y,z).project(this.camera);return {x:(p.x+1)*this.w/2,y:(1-p.y)*this.h/2};}
collectFaces(group){let faces=[],normal=new T.Vector3(),a=new T.Vector3(),b=new T.Vector3(),c=new T.Vector3(),light=new T.Vector3(-.4,1,.7).normalize(),matrix=new T.Matrix4();const vp=new T.Matrix4().multiplyMatrices(this.camera.projectionMatrix,this.camera.matrixWorldInverse);group.updateMatrixWorld(true);group.traverse(o=>{if(!o.isMesh||o.userData.sky)return;for(let p=o;p;p=p.parent)if(!p.visible)return;let geo=o.geometry,pos=geo.attributes.position,idx=geo.index,col=o.material.color;matrix.multiplyMatrices(vp,o.matrixWorld);let lastColor='',lastNormal=-2;for(let i=0;i<(idx?idx.count:pos.count);i+=3){let ia=idx?idx.getX(i):i,ib=idx?idx.getX(i+1):i+1,ic=idx?idx.getX(i+2):i+2;a.fromBufferAttribute(pos,ia).applyMatrix4(matrix);b.fromBufferAttribute(pos,ib).applyMatrix4(matrix);c.fromBufferAttribute(pos,ic).applyMatrix4(matrix);if((b.x-a.x)*(c.y-a.y)-(b.y-a.y)*(c.x-a.x)<=0)continue;normal.fromBufferAttribute(geo.attributes.normal,ia).transformDirection(o.matrixWorld);let shade=.72+Math.max(0,normal.dot(light))*.28;if(shade!==lastNormal){lastColor='#'+col.clone().multiplyScalar(shade).getHexString();lastNormal=shade;}faces.push({pts:[(a.x+1)*this.w/2,(1-a.y)*this.h/2,(b.x+1)*this.w/2,(1-b.y)*this.h/2,(c.x+1)*this.w/2,(1-c.y)*this.h/2],z:(a.z+b.z+c.z)/3,c:lastColor});}});return faces;}
softwareDraw(){let ctx=this.ctx;ctx.fillStyle='#'+this.scene.background.getHexString();ctx.fillRect(0,0,this.w,this.h);if(!this.staticFaces){this.staticFaces=this.collectFaces(this.tileGroup);this.metrics.staticBuilds++;}let faces=this.staticFaces.concat(...(this.backdrop?this.collectFaces(this.backdrop):[]),this.collectFaces(this.unitGroup),this.collectFaces(this.markGroup),this.collectFaces(this.fogGroup));for(let e of this.effects)if(e.fx)faces.push(...this.collectFaces(e.fx));faces.sort((a,b)=>b.z-a.z);let color='';for(let f of faces){ctx.beginPath();ctx.moveTo(f.pts[0],f.pts[1]);ctx.lineTo(f.pts[2],f.pts[3]);ctx.lineTo(f.pts[4],f.pts[5]);ctx.closePath();if(color!==f.c){ctx.fillStyle=f.c;ctx.strokeStyle=f.c;color=f.c;}ctx.fill();ctx.lineWidth=.4;ctx.stroke();}}

frame(t){requestAnimationFrame(tt=>this.frame(tt));if(document.hidden||!this.state){this.flightTick=0;return;}this.flightStep(t);if(this.cameraAnimating)this.cameraUpdate();let active=this.animations.length||this.effects.length||this.cameraAnimating,ambient=this.motion&&!this.software&&this.state.units.some(u=>u.hp>0&&['Air','Navy'].includes(A.D[u.type].branch));if(!this.dirty&&!active&&!ambient)return;if(t-this.last<(this.software?33:16))return;this.last=t;let began=performance.now();this.dirty=false;let s=this.state;this.advanceMovement(t,s);s.units.forEach(u=>{let g=this.groups.get(u.id),l=this.labelsMap.get(u.id);if(!g||!g.visible)return;if(this.motion&&A.D[u.type].branch==='Air'&&!u.landed&&!this.animations.some(a=>a.id===u.id))g.position.y=1.12+A.groundHeight(s,u.x,u.y)+Math.sin(t*.002+u.id)*.05;if(this.motion&&A.D[u.type].branch==='Navy'){
 g.position.y=.04+Math.sin(t*.0015+u.id)*.025;
 if(g.userData.wake){g.userData.wake.position.z=Math.sin(t*.001+u.id)*.04;g.userData.wake.scale.x=1+Math.sin(t*.0015+u.id)*.08;}
}if(g.userData.hitAt&&t-g.userData.hitAt<240)g.rotation.z+=Math.sin((t-g.userData.hitAt)*.09)*.007;else if(!this.animations.some(a=>a.id===u.id))g.rotation.z*=.80;if(this.motion&&!u.landed)(g.userData.rotors||[g.userData.rotor]).filter(Boolean).forEach(r=>r.rotation.y=t*.025);let p=this.project(g.position.x,g.position.y+.85,g.position.z);let transform='translate('+Math.round(p.x)+'px,'+Math.round(p.y)+'px) translate(-50%,-50%)';if(l.style.transform!==transform)l.style.transform=transform;});this.advanceEffects(t,s);if(this.renderer)this.renderer.render(this.scene,this.camera);else this.softwareDraw();this.metrics.frames++;this.metrics.renderMs=performance.now()-began;}
}
window.AtlasView=View;
const thumbs=new Map();let observer;
function thumbnail(id){if(thumbs.has(id))return thumbs.get(id);let canvas=document.createElement('canvas');canvas.width=630;canvas.height=420;let ctx=canvas.getContext('2d'),g=model(id,0);g.rotation.y=-.25;g.updateMatrixWorld(true);let bounds=new T.Box3().setFromObject(g),size=bounds.getSize(new T.Vector3()),center=bounds.getCenter(new T.Vector3());let span=Math.max(size.x,size.y,size.z)*.84;const camera=new T.OrthographicCamera(-span*1.5,span*1.5,span,-span,.01,50);camera.position.set(-3.5,2.8,5);camera.lookAt(center);camera.updateProjectionMatrix();camera.updateMatrixWorld();ctx.fillStyle='#00000025';ctx.beginPath();ctx.ellipse(315,336,170,25,0,0,Math.PI*2);ctx.fill();let faces=View.prototype.collectFaces.call({camera,w:630,h:420},g).sort((a,b)=>b.z-a.z);for(let f of faces){ctx.fillStyle=f.c;ctx.strokeStyle=f.c;ctx.lineWidth=.5;ctx.beginPath();ctx.moveTo(f.pts[0],f.pts[1]);ctx.lineTo(f.pts[2],f.pts[3]);ctx.lineTo(f.pts[4],f.pts[5]);ctx.closePath();ctx.fill();ctx.stroke();}let url=canvas.toDataURL();thumbs.set(id,url);return url;}
function hydrate(){if(typeof document==='undefined'||!document.querySelectorAll)return;const paint=img=>{if(!img.isConnected)return;img.src=thumbnail(img.dataset.model);img.classList.add('loaded');};if(typeof IntersectionObserver!=='undefined'&&!observer)observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){observer.unobserve(e.target);requestAnimationFrame(()=>paint(e.target));}}),{rootMargin:'100px'});document.querySelectorAll('img[data-model]:not([data-queued])').forEach(img=>{img.dataset.queued='1';if(observer)observer.observe(img);else paint(img);});}
window.AtlasModels={model,thumbnail,hydrate};
})();
