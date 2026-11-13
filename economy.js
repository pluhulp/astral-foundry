// Material denomination update: every amount and price uses ten times the old units.
// Time, machine counts, efficiencies and unlock requirements are unchanged.
const UNIT_SCALE=10;
const scaleAmounts=o=>Object.fromEntries(Object.entries(o).map(([k,v])=>[k,v*UNIT_SCALE]));
for(const m of machines){m.cost=scaleAmounts(m.cost);m.out=scaleAmounts(m.out);m.input=scaleAmounts(m.input)}
for(const t of techs)t.cost*=UNIT_SCALE;
for(const w of wonders)w.cost*=UNIT_SCALE;
for(const m of megas)m.cost=scaleAmounts(m.cost);
const unitsFresh=fresh;fresh=function(){const s=unitsFresh();s.r=scaleAmounts(s.r);s.economyUnits=2;return s};
const unitsMigrate=migrate;migrate=function(s){s=unitsMigrate(s);if(s&&s.economyUnits!==2){s={...s,r:scaleAmounts(s.r||{}),insightTotal:(s.insightTotal||0)*UNIT_SCALE,economyUnits:2}}return s};
const unitsCap=cap;cap=function(k){return unitsCap(k)*UNIT_SCALE};
const unitsMission=missionCost;missionCost=function(){return scaleAmounts(unitsMission())};
const unitsUpgrade=upgradeCost;upgradeCost=function(k){return scaleAmounts(unitsUpgrade(k))};
resourceStorageCost=function(k){const level=state.storageLevels[k]||0;return{[k]:Math.floor(cap(k)*.35),metal:k==='metal'?Math.floor(cap(k)*.35):Math.round(60*Math.pow(1.7,level)*Math.pow(1.5,Math.min(8,R[k][3])))*UNIT_SCALE}};
gather=function(k){if(!unlocked(k)||!['metal','wood','gems'].includes(k))return;state.r[k]=Math.min(cap(k),state.r[k]+UNIT_SCALE*(1+state.stage)*globalBoost());state.clicks++;checkAchievements();updateLive()};
state=fresh();
