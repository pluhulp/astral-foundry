# Frontline Atlas: Reforged

Independent browser-based, turn-based combined-arms game influenced by tabletop military tactics, including several mechanics popularized by *Noobs in Combat*. Not affiliated with its creators; all code and procedural artwork in this rebuild is independently authored.

## Play

https://pluhulp.github.io/astral-foundry/frontline-atlas/

## Current rebuild

- 10 campaign operations across land, river, coastal, armored, forest, naval and air theaters
- 23 unit types in infantry, mechanized, support, naval and aircraft branches
- Click-to-select, tile movement, range targeting, independent secondary weapons
- Suppression, forest/building concealment, artillery spotters, veterancy, ammunition/fuel logistics, overwatch
- Three difficulties (standard, veteran, expert); objectives generate income and expand deployment capacity
- Isometric unit miniatures, four-angle camera, movement animations, damage effects and distinct terrain
- Branching research dependencies and persistent campaign stars and unit unlocks

## Tactical depth update

- Entrenchment: eligible unspent foot units can DIG IN for +2 defense; movement cancels that stance
- Flanking: close allied land support reduces effective cover on an attacked target
- Contested capture: a unit cannot secure a site while hostile land troops threaten its adjacent tiles; control is reevaluated each turn
- Reinforcement staging: choose a legal spawn tile in your rear area or beside an uncontested captured site rather than receiving random deployments
- Smoke: mortar and artillery units can spend a shot to place a temporary smoke screen blocking longer-range spotting
- Units now animate along their calculated movement route, with muzzle trails, damage effects and terrain elevation graphics

## Controls

Left click selects a unit, moves to a highlighted destination or attacks a valid enemy. Click a reinforcement in the deployment tray and then click a highlighted staging tile. ATTACK and SECONDARY select an attack profile. Right-drag pans, scroll zooms, Q/E rotates, WASD pans, Enter/Space ends turn, Esc cancels.

## Balance

Enemy reinforcement cadence is every 3 turns (standard), 2 turns (veteran), or every turn (expert), with a modest expert attack bonus. Captured objectives grant resources and additional deployment slots.

## QA

The rebuilt inline JavaScript passed syntax checks, mocked DOM/Canvas rendering calls, map spawning and enemy-turn smoke tests for all ten missions. A simple objective-driven automated player won several standard scenarios in a simulation. These are **not** real-browser acceptance tests and do not prove the late-game balance or visual experience is final.

## Known scope gaps

This is not a one-to-one recreation of Noobs in Combat. The Roblox title has far more content, a fully modeled 3D world, multiplayer, more complex transport and weapon mechanics, and deeper progression. Those features are not yet implemented here. No copyrighted game assets or audio are copied.

## Save data

Research stars, unlocks, completed operations and difficulty use browser localStorage under `frontline_atlas_reforged_v1`. Older versions remain recoverable in Git history. This release uses a new save key rather than pretending to migrate every previous battle state.
