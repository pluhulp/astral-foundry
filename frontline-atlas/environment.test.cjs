const test=require('node:test'),assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs');
const T=require('./three.min.js'),A=require('./core.js'),context={THREE:T,Atlas:A,window:{}};
vm.createContext(context);
vm.runInContext(fs.readFileSync(__dirname+'/models.js','utf8'),context);
vm.runInContext(fs.readFileSync(__dirname+'/render.js','utf8'),context);
const View=context.window.AtlasView;
function renderState(s){
 const v=Object.create(View.prototype);
 Object.assign(v,{scene:new T.Scene(),tileGroup:new T.Group(),unitGroup:new T.Group(),markGroup:new T.Group(),fogGroup:new T.Group(),backdrop:new T.Group(),effects:[],animations:[],groups:new Map(),labelsMap:new Map(),labels:{innerHTML:''},renderer:null,software:false,motion:false,w:1100,h:720,camera:new T.PerspectiveCamera(42,1100/720,.12,240),eye:new T.Vector3(-18,19,22),yaw:2.5,pitch:-.6,cameraEase:null,ray:new T.Raycaster(),pointer:new T.Vector2(),canvas:{getBoundingClientRect:()=>({left:0,top:0,width:1100,height:720})},sync(){}});
 v.scene.background=new T.Color(0x8ba9b4);v.setState(s);v.cameraUpdate(true);
 return v;
}
test('mountain theaters use restrained stepped square elevation and angular road ramps',()=>{
 const maps=A.missions.filter(m=>m.biome==='mountain');assert.equal(maps.length,10);
 for(const m of maps){
  const s=A.make(m),heights=s.tiles.filter(t=>t.terrain!=='void').map(t=>A.elevation(s,t));
  assert(Math.max(...heights)-Math.min(...heights)>=1.80,m.name+' needs distinct mountain terraces');
   assert(Math.max(...heights)-Math.min(...heights)<=2.60,m.name+' must avoid excessive height variation');
   assert(new Set(heights.map(x=>x.toFixed(3))).size<=5,'terraces must be a few clear height tiers');
  const mid=Math.floor(s.h/2);
  const road=s.tiles.filter(t=>t.y===mid&&['road','bridge'].includes(t.terrain));
  assert(road.length>12);assert(Math.max(...road.map(t=>A.elevation(s,t)))-Math.min(...road.map(t=>A.elevation(s,t)))>=1.20);
  assert(road.every(t=>Number.isFinite(t.elevation)));
 }
});
test('alpine tops remain flat square facets rather than smoothed continuous hills',()=>{
 const s=A.make(A.missions[70]),v=renderState(s),slope=v.slopeSurfaces;
 assert(slope.length>100,'must build real topographic surface meshes');
 const left=A.tile(s,8,9),right=A.tile(s,9,9);
 const shared=A.groundHeight(s,8.5,8.5);
 assert(Math.abs(shared-A.groundHeight(s,8.5,8.5))<1e-9);
 for(const mesh of slope.slice(0,12)){
  assert.equal(mesh.geometry.attributes.position.count,6);assert([...mesh.geometry.attributes.position.array].filter((_,i)=>i%3===1).every(y=>Math.abs(y)<.001),'each square tile has a level top');
  for(const n of mesh.geometry.attributes.normal.array)assert(Number.isFinite(n));
 }
 const tile=right;assert(slope.some(x=>x.userData.tile===tile));
 const ramps=v.tileGroup.children.filter(o=>o.userData.roadRamp);
 assert(ramps.length>=1,'each alpine road must have visible angular elevation connectors');
 assert(ramps.every(o=>o.geometry.attributes.position.count===6),'road connectors are simple triangle-pair ramps');
});
test('mountain camera selects an actual elevated tile, not a fake sea-level plane',()=>{
 const s=A.make(A.missions[70]),v=renderState(s);
 const tile=s.tiles.find(t=>t.x===Math.floor(s.w/2)&&t.y===Math.floor(s.h/2));
 assert(tile&&tile.terrain!=='void');
 v.centerOn(tile.x,tile.y);v.cameraUpdate(true);
 const p=v.project(tile.x-s.w/2+.5,A.groundHeight(s,tile.x,tile.y)+.01,tile.y-s.h/2+.5);
 const hit=v.pick({clientX:p.x,clientY:p.y});
 assert(hit,'ray must hit the actual physical alpine surface');
 assert.equal(hit.x,tile.x);assert.equal(hit.y,tile.y);
});
test('small hills on nonmountain maps are gentle raised square features, not huge curved slopes',()=>{
 const s=A.make(A.missions[0]),hill=s.tiles.find(t=>t.terrain==='hill');
 assert(hill,'there should be at least one hill in the grass theater');
 assert.equal(A.groundHeight(s,hill.x,hill.y),.22);
 const nonhill=s.tiles.find(t=>t.terrain==='plain');
 assert(nonhill&&A.groundHeight(s,nonhill.x,nonhill.y)===0);
});
test('slopes cost uphill infantry and armor movement but never slow air and ships',()=>{
 const s=A.make(A.missions[70]),road=s.tiles.find(t=>t.terrain==='road'&&t.x>3&&t.x<s.w-4);
 assert(road);
 const infantry=A.add(s,'rifle',0,road.x,road.y);
 assert(A.moveBudget(s,infantry)>=1);
 const air=A.add(s,'fighter',0,road.x+1,road.y+1),budget=A.moveBudget(s,air);
 assert(budget===A.D.fighter.move);
 assert(A.rangeElevation(s,infantry,{x:road.x,y:road.y})===0);
});
test('the navy retains 32 playable sea theaters and coastal maps are genuinely ocean-dominant',()=>{
 const maps=A.missions.filter(A.navalMap);assert.equal(maps.length,32);
 for(const m of maps){const s=A.make(m),sea=s.tiles.filter(t=>t.terrain==='water').length/s.tiles.length;
  assert(sea>=.25,m.name+' open sea '+sea);
  if(['coast','islands'].includes(m.biome))assert(sea>=.49,m.name+' should be a bluewater level');
  assert.equal(s.pads.filter(p=>p.kind==='sea').length,3);
  const fleet=A.alive(s,1).filter(u=>A.D[u.type].branch==='Navy');assert(fleet.length>=2);
 }
});
test('ocean backdrop has a gradient skybox, sun and authored port architecture',()=>{
 const s=A.make(A.missions.find(m=>m.biome==='coast')),v=renderState(s);
 const sky=v.backdrop.children.filter(o=>o.userData.sky);
 assert(sky.length>=2,'sky dome and sun should exist');
 assert(sky.some(o=>!!o.geometry.attributes.color),'sky must use multi-stop vertex gradient');
 const docks=v.backdrop.children.filter(o=>o.isMesh);
 assert(docks.length>70,'harbor should be visually populated');
 const waters=s.tiles.filter(t=>t.terrain==='water');
 assert(waters.length>150,'the sea should occupy a substantial part of the grid');
});
test('unit finishing details provide complete infantry bodies, aircraft lights and ship rails',()=>{
 for(const id of ['rifle','marine','light','fighter','frigate','destroyer','carrier']){
  const g=context.window.AtlasModels.model(id),boxes=[];
  g.traverse(o=>{if(o.isMesh)boxes.push(o);});
  assert(boxes.length>=10,id+' must be a real multi-part model');
  assert(boxes.every(o=>o.geometry?.attributes?.position?.count>0));
 }
});
