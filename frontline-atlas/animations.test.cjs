const test=require('node:test'),assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs');
const T=require('./three.min.js'),A=require('./core.js');
const context={THREE:T,Atlas:A,window:{},performance:{now:()=>1000},document:{createElement:()=>({className:'',textContent:'',style:{},remove(){this.removed=true;}})}};
vm.createContext(context);
vm.runInContext(fs.readFileSync(__dirname+'/models.js','utf8'),context);
vm.runInContext(fs.readFileSync(__dirname+'/render.js','utf8'),context);
const View=context.window.AtlasView;
function state(){
 const s=A.make(A.missions[0]);s.phase='combat';s.side=0;s.fog=false;
 s.tiles.forEach(t=>{if(t.terrain!=='void')t.terrain='plain';});s.events=[];return s;
}
function view(s){
 const v=Object.create(View.prototype),labels=[];
 Object.assign(v,{state:s,scene:new T.Scene(),groups:new Map(),animations:[],effects:[],impactHistory:[],impactGroup:new T.Group(),motion:true,software:false,
 labels:{append:n=>labels.push(n)},sync(){},project(){return{x:300,y:200}},screenLabels:labels});
 v.scene.add(v.impactGroup);return v;
}
test('shells fly toward targets and create a shockwave, rising smoke and persistent land crater',()=>{
 const s=state(),v=view(s),ev={kind:'attack',from:{x:3,y:6},to:{x:9,y:6},damage:70,id:17,sourceType:'battleship',targetType:'tank',explosive:true,destroyed:true};
 s.events.push(ev);v.events();
 assert.equal(v.effects.length,1);const e=v.effects[0];assert.equal(e.kind,'shot');
 assert(e.travel>=150);assert(e.duration>e.travel);
 v.advanceEffects(e.start+e.travel*.50,s);
 assert(e.tracer.position.x>e.from.x&&e.tracer.position.x<e.to.x,'projectile must visibly traverse the gap');
 assert.equal(e.blast.visible,false);
 v.advanceEffects(e.start+e.travel+30,s);
 assert(e.impacted);assert.equal(e.blast.visible,true);
 assert.equal(v.impactHistory.length,1);
 assert(v.impactHistory[0].children.length>=4,'crater and wreckage should remain after blast');
 assert(v.screenLabels.some(n=>n.textContent==='−70'&&n.style.display==='block'));
 v.advanceEffects(e.start+e.duration+1,s);
 assert.equal(v.effects.length,0);assert.equal(v.impactHistory.length,1,'crater must remain after particles fade');
});
test('water hits create light ripple decals instead of land craters',()=>{
 const s=state(),v=view(s),t=A.tile(s,8,8);t.terrain='water';
 const ev={kind:'attack',from:{x:2,y:8},to:{x:8,y:8},damage:40,explosive:true,sourceType:'destroyer'};
 v.makeShot(ev,1000);const e=v.effects[0];
 v.advanceEffects(1000+e.travel+20,s);
 assert.equal(v.impactHistory.length,1);
 assert.equal(v.impactHistory[0].userData.water,true);
 const mark=v.impactHistory[0];assert.equal(mark.children.length,2,'water should not create persistent steel wreckage');
});
test('small-arms fire has a modest impact flash but no terrain crater',()=>{
 const s=state(),v=view(s);v.makeShot({kind:'attack',from:{x:5,y:5},to:{x:7,y:5},damage:18,explosive:false,sourceType:'rifle'},1000);
 const e=v.effects[0];v.advanceEffects(1000+e.travel+1,s);
 assert(e.impacted);assert.equal(v.impactHistory.length,0);
});
test('the impact limit stays bounded through repeated twenty-shell naval bombardments',()=>{
 const s=state(),v=view(s);
 for(let i=0;i<100;i++)v.addImpactMark({to:{x:8+i%2,y:9},damage:30,explosive:true,targetType:'light',destroyed:i%13===0});
 assert.equal(v.impactHistory.length,58);
 assert.equal(v.impactGroup.children.length,58);
});
test('ground units follow each waypoint gradually, not a straight teleport to the endpoint',()=>{
 const s=state(),v=view(s),u=A.add(s,'light',0,8,7),g=new T.Group();
 const path=[3,4,5,6,7,8].map(x=>({x,y:7}));
 v.groups.set(u.id,g);v.motion=true;v.events=View.prototype.events;
 s.events.push({kind:'move',id:u.id,from:{x:2,y:7},to:{x:8,y:7},path});
 v.events();assert.equal(v.animations.length,1);
 const a=v.animations[0];assert(a.duration>=1100,'six tiles should visibly take more than one second');
 v.advanceMovement(a.start+a.duration*.45,s);
 assert(g.position.x>2-s.w/2+.5&&g.position.x<8-s.w/2+.5);
 assert(v.effects.some(e=>e.kind==='dust'),'armor should kick up occasional subtle dust');
 v.advanceMovement(a.start+a.duration+1,s);
 assert.equal(v.animations.length,0);
 assert(Math.abs(g.position.x-(8-s.w/2+.5))<1e-6);
});
test('effects and movement honor the existing reduce-motion setting',()=>{
 const s=state(),v=view(s),u=A.add(s,'light',0,8,7);
 v.motion=false;
 s.events.push({kind:'move',id:u.id,from:{x:2,y:7},to:{x:8,y:7},path:[{x:8,y:7}]});
 s.events.push({kind:'attack',from:{x:2,y:7},to:{x:7,y:7},damage:30,explosive:true});
 v.events();assert.equal(v.animations.length,0);assert.equal(v.effects.length,1);
 assert(v.effects[0].travel<=25,'reduced motion plays only a quick impact');
});
test('core emits explosive/kill annotations without changing damage and weapon count',()=>{
 const s=state();s.units=[];
 const attacker=A.add(s,'battleship__4',0,3,8),target=A.add(s,'rifle',1,11,8);
 target.hp=1;const before=attacker.ammo[0];
 assert(A.useAbility(s,attacker));assert(A.attack(s,attacker,target));
 const shots=s.events.filter(e=>e.kind==='attack');
 assert.equal(shots.length,5);assert(shots.every(e=>e.explosive===true&&e.sourceType===attacker.type));
 assert(shots.some(e=>e.destroyed&&e.id===target.id));
 assert.equal(attacker.ammo[0],before-1);
});
