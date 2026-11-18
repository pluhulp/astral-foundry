# Frontline Atlas — v9: contested frontiers

Standalone turn-based 3D tactics game. No build step or external assets are needed; serve `frontline-atlas/` over HTTP. The repository-root space game is independent and unchanged.

## What's new

- **80 campaign missions, eight theaters:** Greenline, Dust Frontier, Tidebreak, White Reach, Skyfall, Iron Meridian, **Playroom Rebellion** (toy-soldier attic), and **Highland Storm** (mountain passes).
- **32 water-enabled missions:** coastal chapters and selected other stages now provide water, legal naval pads, and ship deployment opportunities.
- **Territorial economy:** 1 supply per round (2 while holding at least one factory). Capturing an outpost awards immediate supply: +3 factories, +2 towns, +1 other facilities. The bank is capped at 24.
- **Dynamic force limit:** initial maximum of 10 active troops; captured towns add +2 slots and other non-HQ facilities +1, to a maximum of 20.
- **Real research dependencies:** variants appear in branching connected research columns. Heavy specialization branches have prerequisite troops and earned-credit requirements. Eight redundant troop families are retired from new purchasing but retained in the database for existing saves; 52 families and 312 variants remain purchasable.
- **Better challenges:** objectives have entrenched sentries, enemy squads prioritize nearby threats and contested outposts, and capturing territory triggers enemy counterattacks. AI retreats only at critical health, rather than spending much of a battle running away.
- **Three-wave defense mode:** 20 starting supply and three escalating assaults on rounds 3, 6, and 9. Survive with the HQ intact and clear attackers after round 12.
- **Landscape variety:** seeded terrain ridges instead of isolated random obstacles, layered mountains, raised hills, stylized toy blocks, distant skyline / alpine range / woods / attic environments, clouds, and rain or snow in selected theaters.
- **Command speed:** click teal destination tiles to move and auto-capture; click an enemy directly to fire if legal. Shift-click a hostile to preview damage/retaliation before confirming. Most direct-fire troops can fire after moving; indirect weapons still require setup.
- **UI & camera:** compact side-mounted unit and HQ controls; W/A/S/D pan, Q/E rotate, scroll zoom, right-drag or Shift-drag pan, left-drag orbit, plus eased camera movement.
- **Model fixes:** towed weapons now have proper solid gun carriages; existing family/variant silhouettes are retained.

## Compatibility and verification

Existing storage remains under `frontline-atlas-v3`, preserving completed missions, owned variants, spending currency and current v3 battles. The eight retired families still load in old saves; they simply no longer appear as new research choices.

Automated tests run with `node --test *.test.cjs` in `frontline-atlas/`. GitHub Actions executes the suite on changes to this branch. Coverage includes mission maps/connectivity, supply limits, new defense waves, AI turns, progression, model geometry, and simulated UI interaction. Full WebGL/GPU visual validation should be performed in a browser with graphics acceleration before regarding art polish as complete.

---

## Previous v8 behavior

## v8 command and combat polish

- Click a hostile unit to preview exact damage, surviving HP, return fire and visible friendly blast victims. Confirm the shot or cancel without spending ammo.
- Select a placed starting troop to return it to reserve for a full refund before beginning the operation. Refunds cannot be repeated or used during combat.
- Collapsible force roster lists friendly troop health/readiness and centers the camera on selection. The collapsible field log shows the latest twelve events.
- AI reacquires targets after moving, sends medics and logistics toward patients, and can service allies after approaching them. Difficulty now applies consistently to starting enemies and reinforcements.
- Helicopters board infantry while landed; fast-rope abilities support airborne insertion. Deployment blocks transport/smoke actions. Failed save imports no longer replace the current profile.
- Existing v7 battles remain compatible. The root space game is untouched.

## Tactical overhaul

- Pick 1–6 unlocked troop types, including infantry. There is no combined deck point cap. The roster remains 60 families × six configurations.
- New battles begin with **10 supply and no free deck units**. Select a troop in HQ, then click one of four rear land pads. Coastal theaters include two naval pads. Begin operation when your starting force is placed. During combat arrivals wait until the next round; occupied pads block spawning. Ten active combat units maximum.
- Income is 4 supply per round, plus 1 per owned factory (maximum +2), with a 14-supply bank cap. A base Goliath costs 8; a carrier or Citadel costs 10. Repairs and purchases share the supply pool.
- Maps are 24–28 by 18–24 tiles, with seeded irregular boundaries, cutouts, water, mountain obstacles, concealment, roads, and reachable facilities. All 60 map layouts differ.
- Mission victories are independent: capture HQ, eliminate, hold relay, escort courier, destroy command, seize marked facilities, or protect a relief convoy for ten rounds. HQ capture cannot bypass other objectives. Towns heal occupants, factories provide income, relays provide local vision, and airfields service landed aircraft.
- Fog is mandatory. Regular troops see four tiles, recon six, radar seven; active scans reach eight. Forest and ruin concealment reduces ordinary detection to two tiles. Mountains block vision and direct fire. AI targeting uses the same visibility rules.
- AI scores attacks for damage/kills/support targets, seeks cover and standoff distance, routes around obstacles, captures objectives, uses support/scan/attack abilities, retreats for repairs, and purchases reinforcements from a bounded budget.
- Global movement, range, armor, hull and firepower are reduced. Movement boosts add one tile. Armor and naval units suffering a substantial hit below 45% hull can lose mobility. Supply service or HQ restores running gear.
- Aircraft must land on suitable terrain for ground resupply. Landing/takeoff spend the turn. Grounded aircraft cannot move, fire or use tactical abilities; they take extra damage. Owned airfields repair/rearm them automatically.
- Unit panels explain roles and show prominent ammunition, immobilization and landing warnings.

## New model construction

`models.js` uses extruded hull outlines, lathed fittings, articulated figures, and platform-specific chassis/equipment assemblies. Bodies are not normalized to tile dimensions: narrow bikes, long logistics trucks, low tank destroyers, broad siege platforms, distinct aircraft and elongated ships use different footprints. Six configurations per family add recognizable equipment modules. Preview thumbnails and battlefield use the same geometry. Shared geometry/material caches reduce allocations. Part surfaces use physical separation rather than coplanar overlays.

`core.js` owns rules and map generation; `roster.js` builds families; `render.js` handles camera, terrain, fog, models and effects; `app.js` owns menus and saves.

## Progress compatibility

The storage key remains `frontline-atlas-v3`. Existing credits, unlocked troops, training and completed missions are preserved. Pre-v7 active battles cannot use the new map/deployment rules: their data is archived as `profile.retiredBattle` and included in exported saves; start a new operation. New battles use version 3. Import accepts old version-2 battles by archiving them, too.

## Verification

Run `node --test *.test.cjs` (65 checks). Checks cover 60-map determinism and objective connectivity, paid placement, arrival limits, deck changes, income, fog/LOS, damage/repair, flight, objectives, tactical abilities, AI turns, progression and saves. Geometry checks cover all 720 faction/configuration models and six distinct equipment signatures per family. Eight simulated AI rounds run across every mission.

Browser QA verified paid tank/infantry placement, no free starting force, start-operation flow, hidden enemies, round transition and +4 income. This QA browser disables WebGL, so canvas rendering is checked visually; GPU lighting/shadows still need a WebGL-capable device.

V8 browser QA verified the force list, camera focus, deployment spend and full refund. Combat forecasts, confirmation/cancellation, AI reacquisition, medic routing, air transport and reinforcement difficulty are covered by automated regression checks.
