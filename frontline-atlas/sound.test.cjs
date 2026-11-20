const test=require('node:test'),assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs');
const source=fs.readFileSync(__dirname+'/sound.js','utf8');
test('the combat sound engine degrades safely when WebAudio is blocked or unavailable',()=>{
 const ctx={window:{}};vm.runInNewContext(source,ctx);
 assert.doesNotThrow(()=>{ctx.window.AtlasSound.arm();ctx.window.AtlasSound.cue('capture');ctx.window.AtlasSound.events([{kind:'attack',from:{x:1,y:2},to:{x:3,y:4},explosive:true,damage:80}]);});
});
test('procedural battle cues are bounded, muted on demand, and need no external files',()=>{
 let voices=0,buffered=0;
 const parameter=()=>({setValueAtTime(){},exponentialRampToValueAtTime(){}});
 class FakeAudioContext{
  constructor(){this.sampleRate=4000;this.currentTime=10;this.state='running';this.destination={};}
  createBuffer(ch,n){buffered++;return{getChannelData:()=>new Float32Array(n)};}
  createOscillator(){return{frequency:parameter(),connect(){},start(){voices++},stop(){}};}
  createGain(){return{gain:parameter(),connect(){}};}
  createBiquadFilter(){return{frequency:parameter(),connect(){}};}
  createBufferSource(){return{connect(){},start(){voices++},stop(){}};}
 }
 const context={window:{AudioContext:FakeAudioContext}};vm.runInNewContext(source,context);
 const a=context.window.AtlasSound;a.cue('guard');assert(voices>=2);
 const first=voices;a.setEnabled(false);a.cue('capture');assert.equal(voices,first);
 a.setEnabled(true);
 const five=Array.from({length:5},(_,i)=>({kind:'attack',from:{x:1,y:2},to:{x:8+i%2,y:5},explosive:true,damage:65}));
 a.events(five,true);
 assert(voices>first&&voices-first<=12,'five-shell barrage is mixed into a limited number of voices');
 assert.equal(buffered,1,'all sound effects share one generated noise buffer');
});
