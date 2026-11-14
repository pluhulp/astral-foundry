const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),THREE=require('./three.min.js');
const noop=()=>{},node={addEventListener:noop,style:{setProperty:noop},classList:{add:noop,remove:noop,toggle:noop},dataset:{}};
const ctx=vm.createContext({console,Date,Math,JSON,Object,Array,Number,String,Set,Map,setTimeout:()=>0,clearTimeout:noop,document:{addEventListener:noop,getElementById:()=>node,querySelector:()=>null,querySelectorAll:()=>[],documentElement:node},window:{THREE,addEventListener:noop},localStorage:{setItem:noop,getItem:()=>null},assert,THREE});
for(const f of ['game.js','universe.js','polish.js','bridge.js','economy.js','model-kit.js'])vm.runInContext(fs.readFileSync(f,'utf8'),ctx,{filename:f});
vm.runInContext(`
const signatures=new Set();let checked=0;
function inspect(kind,id){const group=new THREE.Group(),moves=ModelKit[kind](group,id,4);for(const t of [0,1,10]){moves.forEach(f=>f(t));group.updateMatrixWorld(true);group.traverse(o=>{assert.ok(o.matrixWorld.elements.every(Number.isFinite),kind+' '+id);if(o.geometry)assert.ok(Array.from(o.geometry.attributes.position.array).every(Number.isFinite),id)})}assert.ok(group.children.length,kind+' '+id);checked++;return group}
for(let i=0;i<16;i++)inspect('world',i);
for(const m of machines){const g=inspect('factory',m.id),parts=[];g.traverse(o=>{if(o.geometry)parts.push([o.geometry.type,o.geometry.parameters,o.position.toArray(),o.rotation.toArray(),o.scale.toArray()])});const signature=JSON.stringify(parts);assert.ok(!signatures.has(signature),'Duplicate geometry: '+m.id);signatures.add(signature)}
for(const m of [...megas,...wonders])inspect('structure',m.id);
for(const k of Object.keys(R))inspect('resource',k);
console.log('PASS: '+checked+' valid model assemblies; '+signatures.size+' distinct machine geometries; all animation transforms finite.');
`,ctx);
