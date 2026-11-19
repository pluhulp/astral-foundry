const test=require('node:test'),assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs');
const T=require('./three.min.js'),A=require('./core.js');let context={THREE:T,Atlas:A,window:{}};vm.createContext(context);vm.runInContext(fs.readFileSync(__dirname+'/models.js','utf8'),context);vm.runInContext(fs.readFileSync(__dirname+'/render.js','utf8'),context);
test('all 720 faction/variant models contain finite original geometry',()=>{for(let type of Object.keys(A.D))for(let team of [0,1]){let g=context.window.AtlasModels.model(type,team),count=0;g.updateMatrixWorld(true);g.traverse(o=>{if(o.isMesh){count++;assert(o.geometry.attributes.position.count>0);assert(o.matrixWorld.elements.every(Number.isFinite));}});assert(count>=5,type);}});
test('software terrain projection is cached between dynamic frames',()=>{let V=context.window.AtlasView,v=Object.create(V.prototype),noop=()=>{};Object.assign(v,{scene:{background:new T.Color(0x172b35)},ctx:{fillRect:noop,beginPath:noop,moveTo:noop,lineTo:noop,closePath:noop,fill:noop,stroke:noop},w:800,h:600,tileGroup:{},unitGroup:{},markGroup:{},effects:[],metrics:{staticBuilds:0},staticFaces:null});let calls=0;v.collectFaces=g=>{if(g===v.tileGroup)calls++;return []};v.softwareDraw();v.softwareDraw();assert.equal(calls,1);v.staticFaces=null;v.softwareDraw();assert.equal(calls,2);});
test('GPU terrain batches preserve every source transform and reduce draw objects',()=>{let V=context.window.AtlasView,v=Object.create(V.prototype);v.renderer={};v.tileGroup=new T.Group();let geo=new T.BoxGeometry(),mat=new T.MeshBasicMaterial(),expected=[];for(let i=0;i<100;i++){let m=new T.Mesh(geo,mat);m.position.set(i%10,0,Math.floor(i/10));v.tileGroup.add(m);m.updateMatrix();expected.push(m.matrix.clone());}v.batchTerrain();assert.equal(v.tileGroup.children.length,1);let batch=v.tileGroup.children[0];assert(batch.isInstancedMesh);assert.equal(batch.count,100);for(let i=0;i<100;i++){let actual=new T.Matrix4();batch.getMatrixAt(i,actual);assert.deepEqual(actual.elements,expected[i].elements);}});
test('each family has six distinct geometry/equipment signatures',()=>{const crypto=require('node:crypto');for(const f of A.families){let hashes=f.variants.map(id=>{let g=context.window.AtlasModels.model(id);g.updateMatrixWorld(true);let parts=[];g.traverse(o=>{if(o.isMesh)parts.push([Array.from(o.geometry.attributes.position.array),o.matrixWorld.elements,o.material.color.getHex()]);});return crypto.createHash('sha256').update(JSON.stringify(parts)).digest('hex');});assert.equal(new Set(hashes).size,6,f.id);}});
test('models have intentionally different footprint proportions instead of filling tiles',()=>{let ratios=[];for(let id of ['bike','supply','siege','carrier','fighter','rifle']){let g=context.window.AtlasModels.model(id);g.updateMatrixWorld(true);let size=new T.Box3().setFromObject(g).getSize(new T.Vector3());ratios.push(size.x/size.z);}assert(Math.max(...ratios)-Math.min(...ratios)>.5);assert(ratios[0]<ratios[2]);});
test('withdrawn troops remove their model and label rather than leaving ghost units',()=>{let V=context.window.AtlasView,v=Object.create(V.prototype),g=new T.Group(),removed=false;Object.assign(v,{state:{units:[],tiles:[],seen:[]},groups:new Map([[7,g]]),labelsMap:new Map([[7,{remove(){removed=true}}]]),unitGroup:new T.Group(),tileGroup:new T.Group(),fogGroup:new T.Group()});v.unitGroup.add(g);v.sync();assert.equal(v.unitGroup.children.length,0);assert.equal(v.groups.size,0);assert.equal(v.labelsMap.size,0);assert(removed);});

test('terrain rendering builds a solid outer floor, faceted rock meshes and aligned road markings',()=>{
 const s=A.make(A.missions[0]),V=context.window.AtlasView,v=Object.create(V.prototype);
 Object.assign(v,{scene:new T.Scene(),tileGroup:new T.Group(),unitGroup:new T.Group(),markGroup:new T.Group(),fogGroup:new T.Group(),backdrop:new T.Group(),effects:[],animations:[],groups:new Map(),labelsMap:new Map(),labels:{innerHTML:''},renderer:null,motion:false,cameraUpdate(){},sync(){}});
 v.scene.background=new T.Color(0x8ba9b4);
 assert.doesNotThrow(()=>v.setState(s));
 const floor=v.backdrop.children.find(o=>o.isMesh&&o.scale.x>=100&&o.scale.z>=100);
 assert(floor,'background should contain a real land-colored floor');
 const crags=[];v.tileGroup.traverse(o=>{if(o.isMesh&&o.geometry.type==='BufferGeometry')crags.push(o);});
 assert(crags.length>0,'mountain and hill tiles should contain faceted ridge geometry');
 const roadMarks=[];v.tileGroup.traverse(o=>{if(o.isMesh&&o.position.y===.019)roadMarks.push(o);});assert(roadMarks.length>0,'road center markings should be rendered');
});

test('toy attic uses one seamless felt-colored ground at exactly the game-board elevation',()=>{
 const s=A.make(A.missions.find(m=>m.biome==='toy')),v=Object.create(context.window.AtlasView.prototype);
 Object.assign(v,{scene:new T.Scene(),tileGroup:new T.Group(),unitGroup:new T.Group(),markGroup:new T.Group(),fogGroup:new T.Group(),backdrop:new T.Group(),effects:[],animations:[],groups:new Map(),labelsMap:new Map(),labels:{innerHTML:''},renderer:null,motion:false,cameraUpdate(){},sync(){}});
 v.scene.background=new T.Color(0x8ba9b4);v.setState(s);
 const ground=v.backdrop.children.find(o=>o.isMesh&&o.scale.x>=100&&o.scale.z>=100);
 assert(ground,'a continuous floor must extend around the board');
 assert.equal(ground.material.color.getHex(),v.groundColor);
 assert(Math.abs((ground.position.y+ground.scale.y/2)-(-.005))<1e-6,'outer floor should meet the tile tops without a cliff');
 const t=s.tiles.find(t=>t.terrain==='plain'&&!t.facility&&!t.path&&!t.pad);
 assert(t,'a plain tile must exist');
 const x=t.x-s.w/2+.5,z=t.y-s.h/2+.5;
 let tile=null;v.tileGroup.traverse(o=>{if(!tile&&o.isMesh&&o.position.x===x&&o.position.y===-.25&&o.position.z===z)tile=o;});
 assert(tile,'plain tile should be rendered');
 assert.equal(tile.material.color.getHex(),ground.material.color.getHex(),'toy floor and tile must be the same tone');
 assert.equal(v.fogHiddenMat.transparent,true,'unexplored tiles should tint rather than replace the floor color');
 assert(v.fogHiddenMat.opacity<.45,'fog should not form opaque checkerboard patches');
});
test('toy decor is sparse, rotated, varied and coordinated instead of repeated on every ruins tile',()=>{
 const s=A.make(A.missions.find(m=>m.biome==='toy')),v=Object.create(context.window.AtlasView.prototype);
 Object.assign(v,{scene:new T.Scene(),tileGroup:new T.Group(),unitGroup:new T.Group(),markGroup:new T.Group(),fogGroup:new T.Group(),backdrop:new T.Group(),effects:[],animations:[],groups:new Map(),labelsMap:new Map(),labels:{innerHTML:''},renderer:null,motion:false,cameraUpdate(){},sync(){}});
 v.scene.background=new T.Color(0x8ba9b4);v.setState(s);
 const props=[];v.tileGroup.traverse(o=>{if(o.userData.toyProp!==undefined)props.push(o);});
 const ruins=s.tiles.filter(t=>t.terrain==='ruins');
 assert(props.length>1,'at least two props should be placed');
 assert(props.length<ruins.length/5,'props should appear in fewer than one fifth of ruins cells');
 assert(new Set(props.map(o=>o.userData.toyProp)).size>=2,'props should not all share one silhouette');
 assert(new Set(props.map(o=>o.rotation.y)).size>=2,'props should not face the same way');
 const rooms=v.backdrop.children.filter(o=>o.userData.roomPart);
 assert(rooms.some(o=>o.userData.roomPart==='back-wall'));
 assert(rooms.some(o=>o.userData.roomPart==='side-wall'));
 assert(rooms.some(o=>o.userData.roomPart==='window-frame'));
});

test('every active naval hull has physical geometry for multiple independent weapon stations',()=>{
 const ids=['patrol','frigate','destroyer','battleship','gunboat','landing','sub','carrier'];
 for(const id of ids){
  const d=A.D[id],g=context.window.AtlasModels.model(id,0);g.updateMatrixWorld(true);
  let meshes=0;g.traverse(o=>{if(o.isMesh)meshes++;});
  assert(d.weapons.length>=2,id+' needs at least two independent batteries');
  assert(meshes>=12,id+' needs a developed physical hull / guns');
  assert(A.D[id].range>=5,id+' should have longer range than land units');
 }
});

test('camera is perspective and changes view direction without orbiting its position around the terrain',()=>{
 const V=context.window.AtlasView,v=Object.create(V.prototype);
 const camera=new T.PerspectiveCamera(42,1,.12,240);
 Object.assign(v,{state:{w:24,h:18},w:1100,h:720,camera,eye:new T.Vector3(-18,19,22),yaw:2.5,pitch:-.6,cameraEase:null,dirty:false});
 v.cameraUpdate(true);
 const initial=camera.position.clone(),forward=new T.Vector3();camera.getWorldDirection(forward);
 v.lookBy(-.4,.1);v.cameraUpdate(true);
 const rotated=new T.Vector3();camera.getWorldDirection(rotated);
 assert.equal(camera.isPerspectiveCamera,true);
 assert(camera.position.distanceTo(initial)<.000001,'looking around must never orbit camera around the board');
 assert(rotated.distanceTo(forward)>.3,'free-look must visibly rotate view direction');
});
test('freeflight translates actual camera coordinates, flies forward, rises and focuses a unit',()=>{
 const V=context.window.AtlasView,v=Object.create(V.prototype);
 Object.assign(v,{state:{w:24,h:18},w:1100,h:720,eye:new T.Vector3(-18,19,22),yaw:2.5,pitch:-.6,flightSpeed:9,keys:new Set(),flightVelocity:new T.Vector3(),flightTick:0,cameraUpdate(){}});
 const initial=v.eye.clone();
 v.panByPixels(90,0);assert(v.eye.distanceTo(initial)>.5&&v.eye.distanceTo(initial)<6,'mouse dragging physically translates the camera');
 v.setKey('w',true);v.flightStep(1000);v.flightStep(1050);
 assert(v.eye.distanceTo(initial)>1);
 v.setKey('w',false);
 const prior=v.eye.y;v.setKey('e',true);v.flightStep(1100);
 assert(v.eye.y>prior,'E rises vertically during free flight');
 v.setKey('e',false);v.releaseKeys();assert.equal(v.keys.size,0);
 v.focusPoint(8,8);
 const target=new T.Vector3(8-12+.5,.45,8-9+.5);
 const direction=target.clone().sub(v.eye).normalize();
 assert(v.direction().distanceTo(direction)<.001,'focus must aim from a new physical position toward the selected unit');
});
test('scroll dolly uses camera forward direction, clamps ground collision and protects world bounds',()=>{
 const V=context.window.AtlasView,v=Object.create(V.prototype);
 Object.assign(v,{state:{w:24,h:18},eye:new T.Vector3(0,2,8),yaw:Math.PI,pitch:-.8,cameraUpdate(){}});
 const before=v.eye.clone();v.dolly(5);assert(v.eye.distanceTo(before)>2);
 v.dolly(800);assert(v.eye.y>=1.35&&v.eye.y<=85);
 v.fly(0,0,1,600);assert(v.eye.y<=85);
 v.fly(1,0,0,600);assert(Math.abs(v.eye.z)<=18*1.9);
});

test('siege artillery warnings display five clearly marked threatened tiles per battery',()=>{
 const V=context.window.AtlasView,v=Object.create(V.prototype),s=A.make(A.missions.find(m=>m.type==='battery'));
 Object.assign(v,{state:s,markGroup:new T.Group(),selectedId:null});
 s.warningZones=[{x:12,y:10,batteryId:s.batteryIDs[0]}];v.mark(null,[],[]);
 const warning=v.markGroup.children.filter(o=>o.isMesh&&[0xde4e36,0xb96948].includes(o.material.color.getHex()));
 assert(warning.length>=20,'four border segments around five strike squares must be visible');
});

test('right mouse drag rotates the free camera without moving it, and click selection remains distinct from navigation',()=>{
 const V=context.window.AtlasView,v=Object.create(V.prototype),handlers={};
 const canvas={
  addEventListener:(name,fn)=>handlers[name]=fn,
  setPointerCapture(){},focus(){},
  getBoundingClientRect:()=>({left:0,top:0,width:1100,height:720})
 };
 let clicks=0;
 Object.assign(v,{canvas,state:{w:24,h:18},w:1100,h:720,eye:new T.Vector3(-18,19,22),yaw:2.5,pitch:-.6,controls:'flight',cameraUpdate(){},onClick(){clicks++;},pick(){return {x:10,y:9};}});
 v.bind();
 const start=v.eye.clone(),original=v.yaw;
 handlers.pointerdown({button:2,clientX:250,clientY:260});
 handlers.pointermove({button:2,clientX:345,clientY:250});
 handlers.pointerup({button:2,clientX:345,clientY:250});
 assert.equal(clicks,0,'free-look must not activate a troop');
 assert(v.eye.distanceTo(start)<1e-8,'free-look cannot orbit the camera position');
 assert(Math.abs(v.yaw-original)>.2,'free-look should visibly change heading');
 handlers.pointerdown({button:0,clientX:200,clientY:200});
 handlers.pointerup({button:0,clientX:200,clientY:200});
 assert.equal(clicks,1,'left-click without drag selects normally');
 handlers.pointerdown({button:0,clientX:200,clientY:200});
 handlers.pointermove({button:0,clientX:310,clientY:240});
 handlers.pointerup({button:0,clientX:310,clientY:240});
 assert.equal(clicks,1,'dragging must not accidentally trigger a battle click');
 assert(v.eye.distanceTo(start)>1,'panning must translate actual position');
});
test('perspective picking still resolves battlefield grid positions',()=>{
 const V=context.window.AtlasView,v=Object.create(V.prototype),s=A.make(A.missions[0]);
 const width=1100,height=720;
 const canvas={getBoundingClientRect:()=>({left:0,top:0,width,height})};
 Object.assign(v,{canvas,state:s,w:width,h:height,eye:new T.Vector3(-18,19,22),yaw:2.5,pitch:-.6,
 camera:new T.PerspectiveCamera(42,width/height,.12,240),ray:new T.Raycaster(),pointer:new T.Vector2(),unitGroup:new T.Group(),cameraEase:null});
 v.cameraUpdate(true);
 const t={x:Math.floor(s.w/2),y:Math.floor(s.h/2)};
 const p=v.project(t.x-s.w/2+.5,0,t.y-s.h/2+.5);
 const picked=v.pick({clientX:p.x,clientY:p.y});
 assert(picked,'perspective ray must hit ground');
 assert.equal(picked.x,t.x);assert.equal(picked.y,t.y);
});
