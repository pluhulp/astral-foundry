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
 const crags=v.tileGroup.children.filter(o=>o.isMesh&&o.geometry.type==='BufferGeometry');
 assert(crags.length>0,'mountain and hill tiles should contain faceted ridge geometry');
 assert(v.tileGroup.children.some(o=>o.isMesh&&o.position.y===.019),'road center markings should be rendered');
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
 const tile=v.tileGroup.children.find(o=>o.isMesh&&o.position.x===x&&o.position.y===-.25&&o.position.z===z);
 assert(tile,'plain tile should be rendered');
 assert.equal(tile.material.color.getHex(),ground.material.color.getHex(),'toy floor and tile must be the same tone');
 assert.equal(v.fogHiddenMat.transparent,true,'unexplored tiles should tint rather than replace the floor color');
 assert(v.fogHiddenMat.opacity<.45,'fog should not form opaque checkerboard patches');
});
test('toy decor is sparse, rotated, varied and coordinated instead of repeated on every ruins tile',()=>{
 const s=A.make(A.missions.find(m=>m.biome==='toy')),v=Object.create(context.window.AtlasView.prototype);
 Object.assign(v,{scene:new T.Scene(),tileGroup:new T.Group(),unitGroup:new T.Group(),markGroup:new T.Group(),fogGroup:new T.Group(),backdrop:new T.Group(),effects:[],animations:[],groups:new Map(),labelsMap:new Map(),labels:{innerHTML:''},renderer:null,motion:false,cameraUpdate(){},sync(){}});
 v.scene.background=new T.Color(0x8ba9b4);v.setState(s);
 const props=v.tileGroup.children.filter(o=>o.userData.toyProp!==undefined);
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
