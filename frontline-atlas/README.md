# Frontline Atlas v10 — Combat Doctrine (foundation rebuild)

**A foundational combat-system rewrite, not a claim of one-to-one fidelity to Noobs in Combat.** This release changes the decisions inside every round while preserving the game's art, free-fly camera, campaigns, saves, research and naval systems.

## Mechanical changes
- **Resolve / morale**: Ground units have 6 morale points (distinct from HP). Heavy and suppressive fire lowers resolve, while terrain, entrenchment and officers reduce morale loss. At low resolve, ground units become pinned and cannot move/capture; depleted infantry can fall back one tile. Morale recovers slowly while out of fire, helped by command units. Navy and air don't use morale.
- **Deliberate overwatch**: Press **G** or the ◉ Overwatch command on an idle unit, giving up its actions to watch a lane. The first opposing unit to enter range can receive a real reaction attack before finishing its path; it consumes ammunition and may pin/kill the mover. No more universal, automatic free response to every attack.
- **Combined arms counter system**: Regular riflemen are ineffective against heavy armor and warships. Rockets/anti-armor specialists retain their counters. Flanking with another friendly squad near an entrenched target reduces its cover. Damage output scales more strongly with actual unit health.
- **Scouting as a real support job**: Ground indirect artillery firing beyond five tiles needs a recon/radar/command observer or friendly relay that can actually see the target. Close-range organic targeting and naval guns keep their normal behavior.
- **Contested objectives**: Securing a relay or objective triggers real, budgeted Meridian counterattacks approaching that exact location, rather than waiting out the score. Convoy protection can also draw local interceptors.
- **Compact HUD**: Selected ground troops show morale and pinned status; overwatch has a single tactical button instead of a new text menu. Legacy saved battles without morale fields initialize safely.

## Readability / accessibility
- Overwatch fires only once and is cleared on the owner's following turn or after firing; weapon ammo, range, line-of-sight and fog still apply.
- No background processing or multiplayer synchronization required; all actions remain deterministic and represented in the battle save.
- Existing operator mode, deployment controls and 3D model assets are preserved.

## Grounded references (studied, not cloned)
- Roblox Noobs in Combat game mechanics, as documented by the community [perks guide](https://noobsincombat.wiki/progression/noobs-in-combat-perks), [morale guide](https://noobsincombat.wiki/progression/noobs-in-combat-morale), [damage guide](https://noobsincombat.wiki/progression/noobs-in-combat-damage-calculator), and [strategy guide](https://newgame.co.jp/metaverse/en/roblox/5734383673/noobs-in-combat/guide/).
- Noobs in Combat v6 community [changelog](https://www.reddit.com/r/NoobsInCombat/comments/1xfk308/) describes dynamic vision, transitions and short-path reveals, which remain candidates for subsequent visual fidelity work.
- Relevant public YouTube references: [Noobs in Combat beginner gameplay](https://www.youtube.com/watch?v=6yYGMjEkrwo), [tutorial/boot camp](https://www.youtube.com/watch?v=YwIvgJnjy0U), [tactics](https://www.youtube.com/watch?v=o2j21CBzaB0). The searchable video descriptions and metadata were reviewed, **not** claimed as frame-by-frame footage analysis.

## Follow-up areas for a full identity rebuild
### Additional systems completed in this pass
- Vehicle crews can surrender their surviving ground hulls as neutral salvage; adjacent ready infantry can secure them with a single battlefield click, consuming an action, then require resupply to repair their seized vehicle. Battles containing neutral vehicles remain valid v3 saves.
- Original optional synthesized audio is available in Settings (off by default), generated in-browser without music or downloads.
- Fog of war now reveals progressively while troops traverse path tiles rather than only snapping at the destination; enemy model visibility tracks walking positions.
- First Light now includes an authored early contested approach with initial enemy contact verified by deterministic simulation, instead of generic distant deployment.
- A more responsive enemy-turn loop skips artificial pauses on idle actions. Objective counterattack count is visible on the HUD.
- A sourced mechanics-by-mechanics audit, evidence limits and human playtest plan are recorded in [GAMEPLAY_RESEARCH.md](./GAMEPLAY_RESEARCH.md).

The following are **not finished** by v10 and require more playtesting or authored content:
1. Objective-specific mission scripts, enemy formations, tutorial/onboarding, and hand-authored stage pacing.
2. Fuel, multi-move, resupply routes, deeper transports and radio-battery linking; abandoned vehicle capture is implemented in a simplified form.
3. Detailed weapon penetration tables, squad-level casualties, and deeper morale state transitions.
4. Deep GPU verification of animated fog, more varied audio/impact mixing, effect timbre, advanced UI timing and refined sound feedback.
5. Measured playtesting against curated scenarios—opening missions, naval flagship, siege battery, convoy and hold relay—using metrics like time-to-contact, casualty rate, positioning decisions, turn length and viable counter-loadouts.
6. Role/tech-tree economy evaluation across all 312 configurations, to reduce duplicated units and make counter roles more meaningful.

The next phases must be based on playtests, not speculatively adding mechanics. The 80 maps and v3 storage key remain compatible.

---

# Frontline Atlas v9.8 — Fleet Tactics & Action-Economy Balance

## The navy is still devastating—but needs combined arms
- Naval weapon **base powers remain identical** against other ships. Against Infantry or Armor on shore, naval damage uses a modest **0.84 multiplier**. Aircraft are unaffected. Existing range, movement, gun mounts, loadouts and player ship-to-ship damage are unchanged.
- Meridian ships gain a small 10% **coordinated fire-control bonus against player vessels only when another friendly warship within five tiles independently spots the target**. Kill or separate the escort and the bonus disappears.
- Enemy commanders now check every operational mount before firing, plan movements around how many batteries can reach the enemy (not just the first long-range gun), and select naval targets as priority. Enemy destroyers can move *then* fire all three guns. Immobilized ships can still shoot unless their ammunition or guns are genuinely exhausted.
- Multi-gun land AI also uses **salvo/autoloader abilities** for extra legal shots when the weapon system has spent guns with spare ammunition. All actions obey normal ammunition/cooldown limits.
- Naval maps now start with 3–5 enemy vessels as a meaningful combined-arms task group, plus the normal budgeted reinforcement logic. That eliminates the two-opponent-ship problem. A previously broken desert interception mission now has actual connected sea and five ship escorts: **33 naval-compatible missions** in total.

## Flagships are bosses, not glass boats
- Flagship command compartments start at **1.6× standard carrier health**; this is specific to flagship missions, not a global buff to carriers.
- While a separate allied Navy unit is alive within four tiles, an **escort screen reduces incoming damage by 24%**. Sinking or pulling those escorts away removes the protection immediately. The unit panel explicitly says `ESCORT SCREEN −24% INCOMING` or `ESCORT SCREEN LOST`.
- A lone Leviathan firing all four batteries can damage the flagship significantly, but should not immediately complete the mission. Fleet coordination is now more important than an instant broadside.

## Verification
`node --test *.test.cjs` under `frontline-atlas/` covers the existing campaigns and new `balance.test.cjs` scenarios for ship/shore damage, normal player naval damage, fleet synergy, escort-screen removal, flagship boss durability, naval map generation, full-mount AI turns and land autoloader abilities.

Player progression remains on the same v3 save format, operator mode remains available, and the v9.7 camera, mountain terrain and animations are unchanged.

---

# Frontline Atlas v9.7 — Combat Feel & Square Cliffside Terrain

## Combat animation priorities
- **True route-following travel:** units move through every tactical waypoint, not directly to the final square. Movement duration scales with branch and path length (armor ~200 ms/tile, infantry 220, navy 240, air 165) and smooths the start/end of the move. Vehicles ease their orientation into turns, infantry lightly bob, aircraft bank, and armor can leave a small puff of dust.
- **Visible shell trajectories:** a shot leaves the firing position and follows a short, animated ballistic tracer to the target, landing after the firing effect rather than instantly. Navies, mortars, artillery and the five-shell barrages use the stronger explosion treatment.
- **Impact spectacle:** bright initial flash, shockwave ring, short-lived blast cloud, small debris sparks and floating damage text synchronized with impact. Impacts on water produce a pale foam ring; land impacts from explosive weapons leave a small scorch crater. Destroyed vehicles sometimes leave compact wreckage pieces.
- **Cosmetic craters:** capped at 58 simultaneous historical marks, not persisted in save data, not physics obstacles and not gameplay damage. Temporary effects are capped during large artillery attacks for GPU performance.
- **Motion setting honored:** reduced-motion mode skips route animation, dust and extra particles; impacts remain brief so hit confirmation is still readable.

## Highlands: square terraces, angular ramps, cloud cliffs
The highlands retain a high-altitude impression while **the tactical map itself remains blocky**. The former smoothly interpolated mountain heightfield is now a handful of flat, square terraces (~2.5 units total height change), joined by simple triangular ramps where roads step up or down. Vertical cliff faces, a lower cloud bank and huge distant peaks give the sense of a summit or cliffside battle without throwing large curved hills through the map. Gentle raised hill tiles occur in other biomes too. The free-flight camera, unit altitude, high-ground firing bonuses and mountain ray-picking use the same revised stepped height function.

## Verification
Use `node --test *.test.cjs` in `frontline-atlas/`. The `animations.test.cjs` suite verifies route interpolation, true projectile travel, distinct water/land impacts, persistent bounded craters, effect lifecycle and reduced motion. `environment.test.cjs` verifies the flat square tiers, angular ramps, 80-map connectivity and shared alpine 3D raycasting. Saves retain the same v3 storage format. Other games in the repository are untouched.

---

# Frontline Atlas v9.6 — Worldcraft: Mountains, Harbors & Atmosphere

## The mountains are finally mountains
Highland Storm's ten campaigns now use a **continuous heightfield** instead of a level plane surrounded by mountain props. The road rises across multiple broad ridges and a winding valley, and real hill surfaces have shared corner elevations. Mountain forts, units, warning zones and tactical overlays follow the same elevated surface, with a roughly 4–6 unit total height range. Nearby terrain can block line-of-sight, serious uphill movement costs more, and firing from substantially higher terrain gains +1 range. An alpine landscape mesh extends the geometry beyond the playable board, while the free-fly camera keeps at least 1.35 units above the local mountainside and focuses on the actual height of selected units.

## Bigger naval battlefields
The 32 naval-compatible maps now feature wider and more connected open-water regions; coastal and island theaters are roughly half or more ocean with land approaches and objective roads retained. Ocean environments have coastal surf, gentle water-pattern textures, navigational buoys, wooden docks, cargo yards, cranes, port warehouses, and a lighthouse. Naval models trail small animated foam wakes when ambience is on.

## Biomes, materials, sky & models
- Bluewater, snow, mountains, desert, grasslands and cityscapes now have a large **vertex-gradient sky dome** and stylized sun, replacing the solid-color outdoor horizon.
- Every outdoors biome receives authored, sparse details specific to its setting: urban blocks and streetlamps, snowy huts and drifts, alpine shelters and road guard posts, desert cliffs and brush, coastal decking, and rural farms/fences.
- A tiny generated texture atlas (32×32 texels per material family) adds subtle roughness/grain/wave variation to road, stone, grass and sea colors without external assets. The toy attic retains its clean uniform felt floor.
- Naval hulls have deck railings, portholes, extra mounts and navigational lights. Armor receives additional plating and lights, aircraft have colored navigation lights, and specialized infantry get clearer equipment.
- The movement/attacks/research/campaign progression remain the same outside new tactical altitude calculations, and operator-mode saves remain on the v3 storage key.

## Verification
`node --test *.test.cjs` in `frontline-atlas/`. Added `environment.test.cjs` coverage for alpine height/raycasting, sea navigability, sky gradient, terrain meshes and detailed unit models. Software fallback remains available; the sky dome uses background color when running without WebGL.

---

# Frontline Atlas v9.5 — Free-flight camera

The previous camera rotated around a central pivot with an orthographic projection. The entire navigation layer has been replaced by a **real perspective camera located in 3D world space**. Mouse look changes only the camera's heading and pitch; movement translates the camera itself, not the terrain or an artificial orbit target.

## Controls
- **Hold right mouse + move:** free-look yaw/pitch, without orbiting a map pivot
- **WASD:** continuous camera-relative free flight across the battlefield
- **E / Q:** fly up / down
- **Shift:** 2.35× movement speed while held
- **Alt:** precision movement at 40% speed
- **Mouse wheel / + / − controls:** physically dolly camera forward/backward, not just change the orthographic zoom
- **Left-drag:** grab and translate the camera across the map without rotating it
- **F or ◎ button:** physically fly to selected unit and aim at it
- **R or ⌂ button:** reset to the familiar overview angle
- **↶ / ↷ buttons:** look left/right in 45° steps
- **Settings > Camera controls:** free flight by default, with an alternate left-drag look option
- **Settings > Camera flight speed:** Slow/Normal/Fast persistent preferences

Perspective raycasting retains troop selection, attack clicks, terrain tiles and UI. The camera is clamped above the ground plane and inside a generous world boundary. Camera smoothing/acceleration runs on the existing animation loop, and input is released on window blur or when opening a menu. The camera is not saved into the player's battle or profile progression, and older settings remain valid.

## Tests
Run `node --test *.test.cjs` inside `frontline-atlas/`. The suite includes camera perspective/heading invariance, actual movement, height/speed, unit focus, UI control persistence and the battle's existing tactical controls.

---

# Frontline Atlas v9.4 — Command and Special Operations

## The new battlefield director
The Meridian AI now operates from a fog-of-war-respecting **shared intelligence board**: sightings persist briefly, advanced scouts and sonar gather contacts before main attacks, ships prioritize naval threats and screening actions, support vessels triage repairs and aircraft, and multiple weapons coordinate around high-value and wounded targets. Tactical positioning evaluates reachable squares using firepower, expected incoming damage, cover, movement cost, objective opportunities, standoff range, allied screening and supported flanks. These are decisions, not flat HP/damage multipliers. The enemy turns use one planned action per unit rather than repeatedly calling the entire AI for each gun.

## Set-piece operations
28 campaign missions are now special operations. **Every mission** in the campaign grid has a briefing subtitle, with special missions called out visually.

- **Kill the Batteries** — four enemy long-range siege launchers acquire units, telegraph a five-cell cross in red, and fire heavy bombardments on the following enemy phase. Destroy each launcher to silence it.
- **Counterbattery / Reverse Siege** — four stationary five-shell batteries on your side, a 40-supply starting pool, and five escalating enemy assault waves. Keep two batteries alive through round 15.
- **Convoy Under Fire** — six starting pads in a straight line and 40 initial supply. A protected vehicle moves automatically along the road while your initial escort force handles ambushes. **No reinforcements after launch.** Clear the route and prevent the vehicle's destruction.
- **Fortified Breakthrough** — breach three protected strongpoints with entrenched defensive screens and approaching enemy reinforcements.
- **Naval Interception** — prevent an enemy flagship and its escorts from escaping the map while contesting sea lanes.
- Existing hold, elimination, escort, capture, strike and defense missions remain playable. Custom skirmish can select special operation objectives.

## More engaging pacing
Two enemy takedowns in one player turn grant +1 supply, capped at +2 per turn; creating tactical momentum is more rewarding than waiting passively. Emplacements are anchored in place but retain their gun actions. Predictive red artillery warning tiles create counterplay rather than invisible unavoidable damage.

## Camera and controls
Default **Tactical** layout:
- **Left-drag** pans the map with actual pixel/world calibration; a short drag moves a handful of tiles.
- **Right-drag** or **Shift-drag** orbits the diorama.
- **Mouse wheel** zooms toward the cursor.
- WASD screen-relative pan, Q/E rotate by 45°, F centers selected unit (or resets), and the existing reset/in/out buttons work.
- **Settings → Camera controls** offers **Classic** layout if you prefer left-drag orbit.

Save format and player progress remain v3 compatible. Mission data derives its behavior from the mission's type, not a new save schema. Operator mode retains full testing access, and the separate space game is unchanged.

### Verification
Run `node --test *.test.cjs` under `frontline-atlas/`. AI, special objective and camera regression coverage is in `director.test.cjs` and `operations.test.cjs`.

---

# Frontline Atlas v9.3 — Naval Warfare: Bluewater Overhaul

## Warships are now a fleet, not floating tanks

- **Sea-dominant maps**: 32 naval-compatible missions feature broad connected offshore water lanes. Coastal and island theater maps allocate about 39–57% of the board to sea; mixed inland theaters now have substantial lower channels. Land objectives and existing infantry routes remain reachable.
- **More ships to fight**: every naval mission has an opposing fleet with 2–4 waterborne enemy ships. Three friendly naval deployment pads allow a larger initial fleet.
- **Actual navy speed and range**: patrols, gunboats and landing craft move up to 7 tiles; destroyers/frigates around 6; capital ships around 5. Basic ranges span 5–11 tiles, growing further on radar variants, rather than the previous global 4-tile cap. Ships have improved naval spotting.
- **Independent gun mounts**: all eight naval platforms have 2–4 weapon stations, and each one fires using its own ammo and action. Three-dimensional ship models have separated turrets; carrier, submarine and landing craft have rebuilt deck features.
- **Mobile naval artillery**: naval gunnery can fire after moving, including indirect battleship fire. Short-range land weapon systems retain their existing restrictions.
- **FIVE-shell bombardment**: activate the 'Five-shell saturation' ability, then fire at a visible enemy. One selected gun fires five separate impacts: the target and the four cardinally adjacent tiles. Each adjacent impact deals 65% of its normal damage to any unit on that tile, INCLUDING allies. One gun charge is spent. Friendly-fire risk is shown in the preview.
- **Varied naval specialization**: six research configurations across each naval family, featuring shoot-and-scoot attacks, evasive wake smoke, sonar/stealth counterplay, rolling broadsides, bombardment launchers, ship repair flotillas, torpedo runs, protected landing corridors and carrier aircraft resupply sorties. These are implemented gameplay abilities, not just text labels.
- **Old naval battles continue working**: saved ammo and used-gun arrays are safely expanded to fit the new armament; purchased units, progression and profile storage remain unchanged.
- **Visual environment**: naval theaters extend the ocean floor into the background, with distant islands rather than trees growing out of the sea. Empty barrage impacts show effects without fake "-0" damage numbers.

### Testing
Run `node --test *.test.cjs` inside `frontline-atlas/`. Naval-specific regressions live in `naval.test.cjs`: 32 navigable sea maps, ship range and speed, multi-battery firing, five-shot friendly fire, marine beachheads, sonar vs silent-running, ship repositions, fleet support and migration of legacy ship magazines.

---

# Frontline Atlas v9.2 — Cohesive World & Toy Attic

- Toy biome is a continuous deep-green felt playfield. The surrounding ground meets tile-top elevation and uses the exact same material color, so previously void spaces no longer reveal a brown gap or cliff.
- Fog of war uses translucent tints rather than a competing opaque teal checkerboard; unseen enemies still remain hidden.
- Toy debris is placed sparsely, with a maximum of one object per 4×4 region when the chosen tile contains ruins. Five distinct but size- and palette-matched toy prop designs include wooden blocks, a little car, spool/die, tiny fort, and domino. Deterministic seed-based rotations make repeated models less conspicuous.
- Toy-themed mountain areas use subtle cardboard ridges instead of a full mountain on every blocked tile.
- Instead of a circular ring of generic cubes, the attic background now has constructed rear/side walls, structural roof beams, a window, bookshelf with books, stacked packing boxes, toy chest, small railway, and one larger block sculpture. Background geometry remains outside the playable grid.
- All other environments now have an outer ground plane matching their main map terrain color and elevation.

## Verification
`node --test *.test.cjs` runs the core, UI, progression, and 3D geometry tests including checks for matching floor/tile materials, soft fog, sparse distinct toy props and attic scenery.

---

# Frontline Atlas — v9.1: Operator & Terrain

## What's improved
- **Operator mode**: Settings → Operator mode makes all 80 missions, 312 active unit configurations, research branches, and unlimited battle supply available for testing. Operator battles have a temporary 30-unit cap and do **not** award credits or campaign progress. Original purchases, training and cleared missions are preserved. Turn off Operator mode and start a new battle to return to normal progression. Operator status on an active test battle is preserved even if the setting is subsequently turned off.
- **Roads**: Main arteries and connectors are straight, road markings align with their neighbor tiles, intersections have clean junction markings, and the old road-overlay stacking is removed.
- **Movement**: Ground Armor begins with +1 movement when standing on a road or bridge. Infantry standing on narrow footpaths gain +1. These are turn-budget bonuses, not additive per-road-tile bonuses. Air and Navy receive no terrain movement benefits.
- **Landscape**: Mountain and hill objects use uneven faceted ridge meshes rather than repeated cones/rounded blobs, forests have varied trees, and the map sits on a biome-colored outdoor ground plane rather than the sky background. Distant cliffs use angular rock silhouettes.
- **Save compatibility**: Storage key and version remain unchanged; existing player progress is retained.

## Regression verification
`node --test *.test.cjs` in the `frontline-atlas/` folder, including checks for operator isolation, road/path movement by branch, 80-map facility connectivity, and terrain geometry.

---

# Previous v9: Contested Frontiers

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
