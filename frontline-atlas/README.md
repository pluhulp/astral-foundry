# Frontline Atlas
Original, browser-local 3D turn-based tactics. The Astral Foundry root game is separate.
Play: https://pluhulp.github.io/astral-foundry/frontline-atlas/

## Version 5
- Every one of the 67 variants now has a named tactical ability, shown in the loadout, armory and bottom action bar. Twelve mechanics cover temporary movement, recon sweeps, aimed shots, follow-up shots, triage, ammo drops, overtime service, rally orders, smoke screens, rapid insertion, mobile artillery setup and suppression. Supply costs and 2–3-round cooldowns limit these actions.
- Reinforcements cannot use abilities on their arrival turn. Follow-up shots consume normal ammunition; overtime service cannot refresh weapon actions. Cooldowns persist in saves.
- Main menu, 60-operation level select, custom skirmishes and relay defense.
- Full-viewport battlefield with model selection, teal movement tiles, amber weapon-range tiles and a bottom unit action bar.
- Choose 5–6 distinct variants before deployment, within 26 deployment points. Click your HQ to recruit from the chosen deck: 1 per round, 2 per variant, 8 active non-courier units maximum. New arrivals act next round. Escort missions add a separate courier.
- 67 variants in branching platform trees. Unlocks require a parent, lifetime earnings threshold and a credit purchase; campaign completion does not unlock troops.
- Earlier variants remain selectable. Training is purchased for each variant separately, up to three ranks, and applies to newly deployed units.
- Light tank → medium → heavy → three-cannon superheavy or siege tank; light tank also branches into fast cruisers and artillery.
- Independent cannon selection, ammunition magazines (3–6 shots), one reserve reload, and supply trucks.
- Trucks repair infantry/vehicles within their service range and refill every magazine plus the reserve for 1 supply. Servicing never grants an extra weapon action.
- HQ offers unlimited free full repair/ammunition/reserve service to units on or adjacent to it, without refreshing spent actions. Click the building or HUD HQ button. Naval reinforcements launch at the nearest free water tile.
- Dig in removed. Smoke carriers instead provide targeted, paid, one-round cover.
- 24 added variants include scout/missile/sidecar bikes, supply quads, ambulances, field hospitals, recovery rigs, supply/rescue/scout/assault helicopters, AA/AT cannons, quad flak, SAM launchers, radar trucks, command carriers, grenadiers, flame troops, rangers, mortar carriers and gunboats.
- Logistics/arsenal trucks and ambulances/hospitals have two independent service buttons. Each bay acts once per round; servicing blocks weapon fire that round. Range and repair strength vary by platform.
- Radar grants nine-tile fog vision; command carriers add 5 attack power within two tiles; hospitals passively heal nearby infantry by 10 HP per round. Supply actions and smoke consume 1 supply.
- Updated infantry helmets, armor, pouches, limbs and weapons; dedicated bike and towed-gun models; support cargo, medical markings, cranes, radar dishes, rocket pods and smoke launchers.
- Reload ends a unit's turn. With no reserve, a unit must reload on an owned facility for 1 supply, or get truck support.
- Supply begins at 12, gains 1 per round and caps at 24. First campaign victories award 6 credits; repeat/custom victories 3; defeats 1.
- Six biome palettes: grassland, desert, coast, snow, islands and urban. Original procedural models, reinforced vehicle details, landship turrets and supply cargo.
- Local bundled Three.js, hardware WebGL and software projection fallback. Static terrain batching/caching retained.

## Controls
Click a friendly model to see movement and weapon ranges. Click a teal tile to move. Select a weapon, then an enemy within amber range. Each weapon fires once per turn. Firing ends movement; a multi-weapon unit can still use its other weapons.

Drag to orbit, Shift-drag to pan, scroll to zoom. Q/E rotate, Tab cycles ready units, C captures, Space ends the turn, Escape deselects or pauses.

Artillery cannot fire after moving and has minimum range two. Ships require water. Transports embark one adjacent squad and unload on a later turn. Capture enemy HQ or complete the mission-specific objective; losing your HQ or all friendly forces loses the battle.

## Saves
Version 4 retains the v3 save format. Existing battles recover their deck and initialize the new service slots when resumed.

Version 3 uses `frontline-atlas-v3`. On first launch it migrates valid completed operations from `frontline-atlas-v1` and awards up to 60 migration credits. Old active battles and global upgrades are not reused. The old save key and the root game's saves remain untouched. Export/import v3 saves in Settings. Pending enemy turns resume when loading a battle. Rewards are claimed only once per battle.

## Development and validation
Buildless HTML/CSS/JavaScript; serve this directory with any static HTTP server.
Run `node --test frontline-atlas/*.test.cjs` from the repository root.

- `core.js`: simulation, data, unlocks, ammo and loadout rules.
- `render.js`: procedural geometry, WebGL/software view, tile markers and model picking.
- `app.js`: main menu, progression, loadout, controls and saves.
- Tests: deterministic setup and objective reachability for all 60 missions, combat/support/transport rules, HQ deployment/free resupply, dual service slots, specialty support, economic limits, unlocks, per-variant training, ammo, multiweapon actions, AI invariants, geometry and rendering caches, plus mocked-DOM menu/loadout/save integration.

Validation: 49 tests pass under the Node test runner. Browser QA verified menu/loadout flow, battlefield rendering, HQ deployment costs and per-round lock, free resupply, troop selection, movement boost and its visible cooldown. All device sizes and the full campaign have not been manually playtested. No external assets or network dependencies are needed at runtime.
