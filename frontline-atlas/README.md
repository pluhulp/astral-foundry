# Frontline Atlas — v7

Standalone turn-based tactics game inside `frontline-atlas/`. The repository-root space game is independent and unchanged. Serve this directory over HTTP; no build step or external assets are required.

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

Run `node --test *.test.cjs`. Checks cover 60-map determinism and objective connectivity, paid placement, arrival limits, deck changes, income, fog/LOS, damage/repair, flight, objectives, tactical abilities, AI turns, progression and saves. Geometry checks cover all 720 faction/configuration models and six distinct equipment signatures per family. Eight simulated AI rounds run across every mission.

Browser QA verified paid tank/infantry placement, no free starting force, start-operation flow, hidden enemies, round transition and +4 income. This QA browser disables WebGL, so canvas rendering is checked visually; GPU lighting/shadows still need a WebGL-capable device.
