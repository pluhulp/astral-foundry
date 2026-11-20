/* Frontline Atlas original procedural soundscape — no external audio or samples. */
(function(root){'use strict';
let audio=null,noise=null,enabled=true,last=0,volume=.32;
function context(){
 if(!enabled)return null;
 if(audio)return audio;
 const C=root.AudioContext||root.webkitAudioContext;
 if(!C)return null;
 try{
  audio=new C();noise=audio.createBuffer(1,Math.ceil(audio.sampleRate*.65),audio.sampleRate);
  const sample=noise.getChannelData(0);
  let seed=29147;for(let i=0;i<sample.length;i++){
   seed=(Math.imul(seed,1664525)+1013904223)|0;
   sample[i]=((seed>>>8)/8388608-1)*.75;
  }
  return audio;
 }catch(e){audio=null;return null;}
}
function arm(){
 const a=context();if(a?.state==='suspended')a.resume().catch(()=>{});
}
function note(freq,seconds,loud=.05,kind='triangle',delay=0,fall=1){
 const a=context();if(!a||a.state==='suspended')return;
 const t=a.currentTime+delay,start=Math.max(.001,freq*fall),end=Math.max(30,freq*.4);
 const osc=a.createOscillator(),g=a.createGain();
 osc.type=kind;osc.frequency.setValueAtTime(Math.max(30,freq),t);
 osc.frequency.exponentialRampToValueAtTime(fall===1?Math.max(30,freq*.84):start,t+seconds);
 g.gain.setValueAtTime(.0001,t);
 g.gain.exponentialRampToValueAtTime(Math.max(.001,loud*volume),t+.008);
 g.gain.exponentialRampToValueAtTime(.0001,t+seconds);
 osc.connect(g);g.connect(a.destination);osc.start(t);osc.stop(t+seconds+.02);
}
function hiss(seconds,loud=.04,cutoff=800,delay=0){
 const a=context();if(!a||!noise||a.state==='suspended')return;
 const t=a.currentTime+delay,src=a.createBufferSource(),filter=a.createBiquadFilter(),g=a.createGain();
 src.buffer=noise;filter.type='lowpass';filter.frequency.setValueAtTime(cutoff,t);
 filter.frequency.exponentialRampToValueAtTime(Math.max(100,cutoff*.35),t+seconds);
 g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(Math.max(.001,loud*volume),t+.009);
 g.gain.exponentialRampToValueAtTime(.0001,t+seconds);
 src.connect(filter);filter.connect(g);g.connect(a.destination);
 src.start(t);src.stop(t+seconds+.018);
}
function cue(name){
 if(!enabled)return;
 arm();const a=context();if(!a||a.state==='suspended')return;
 if(name==='select')note(410,.042,.029,'sine');
 if(name==='guard'){note(300,.080,.046);note(440,.09,.035,'triangle',.095);}
 if(name==='capture'){note(410,.1,.06,'triangle');note(620,.16,.065,'triangle',.10);}
 if(name==='deploy'){note(245,.075,.035,'sine');note(370,.08,.035,'triangle',.06);}
 if(name==='move')note(120,.052,.025,'sine');
 if(name==='warning'){note(190,.12,.065,'sawtooth');note(145,.15,.060,'sawtooth',.18);}
 if(name==='pinned'){note(275,.06,.04,'square');note(190,.1,.03,'triangle',.06);}
}
function events(queue,motion=true){
 if(!enabled||!queue?.length)return;
 arm();const a=context();if(!a||a.state==='suspended')return;
 const shots=queue.filter(e=>e.kind==='attack'||e.kind==='counter'),captures=queue.some(e=>e.kind==='capture'),spawns=queue.some(e=>e.kind==='deploy');
 if(captures)cue('capture');
 if(spawns)cue('deploy');
 if(!shots.length){if(queue.some(e=>e.kind==='move')&&a.currentTime-last>.07){cue('move');last=a.currentTime;}return;}
 // One opening gun report per action batch, no deafening 5× repeated battery blasts.
 const lead=shots[0],heavy=shots.some(e=>e.explosive),range=Math.max(1,Math.hypot(lead.to.x-lead.from.x,lead.to.y-lead.from.y));
 const travel=motion?Math.min(.49,Math.max(.135,.105+range*.023)):.025;
 note(heavy?135:370,heavy?.13:.065,heavy?.17:.055,heavy?'sawtooth':'triangle',0,.54);
 hiss(heavy?.11:.045,heavy?.11:.028,heavy?530:2000);
 for(let i=0;i<Math.min(4,shots.length);i++){
  const shot=shots[i],delay=travel+i*.035;
  if(shot.explosive){note(110,.24,Math.min(.20,.08+Math.max(0,shot.damage||0)*.0009),'triangle',delay,.35);hiss(.26,.14,460,delay);}
  else{note(280,.055,.055,'square',delay,.58);hiss(.075,.042,1750,delay);}
 }
}
root.AtlasSound={arm,events,cue,setEnabled:v=>{enabled=!!v;},setVolume:v=>{volume=Math.max(0,Math.min(1,Number(v)||0));}};
})(typeof window!=='undefined'?window:globalThis);
