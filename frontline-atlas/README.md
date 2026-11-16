# Frontline Atlas

An original browser-local, 3D turn-based combined-arms strategy game. Inspired by accessible grid-based tactics; not a Roblox port and contains no Roblox or Noobs in Combat assets, code, maps, or branding.

Play: https://pluhulp.github.io/astral-foundry/frontline-atlas/

## Included
- 60 deterministic campaign operations across Greenline, Dust Frontier, Tidebreak, White Reach, Skyfall, and Iron Meridian. These use five objective templates with seeded terrain, escalating battlegroups, and theater briefings, not 60 hand-scripted story scenarios.
- 32 unit roles across infantry, armor, air, and navy, with original procedural 3D models.
- Movement costs, cover, counterfire, artillery minimum range and splash, AA/AT role bonuses, healing, repairs, transports, capture, facility income, and enemy reinforcements.
- Five objectives: HQ capture, elimination, four-round relay defense, courier escort, and command-vehicle strike. Capturing enemy HQ is an alternate win condition.
- Three campaign medals per operation, sequential unlocks, and four persistent research tracks with three levels each.
- Custom seeded skirmishes with all units unlocked and 2,000 starting supply.
- Difficulty, optional fog of war, audio/animation controls, save export/import, and autosave after completed actions/turns.
- Rotatable/zoomable 3D view, WebGL when available, and a Canvas-based software 3D fallback. All dependencies are bundled locally.

## Controls
Click a friendly unit, then a green tile to move or a highlighted enemy to attack. Moving leaves the action available; attacking ends movement. Capture facilities with infantry standing on their tile. Reinforcements become ready next round.

- Drag: rotate. Shift-drag: pan. Wheel: zoom.
- Q/E: rotate. +/-: zoom. R: reset camera.
- Tab: next ready unit. C: capture. G: dig in. Space: end turn.
- Escape: close a dialog.

Artillery cannot fire after moving and has minimum range two. Splash can hit allies. A transport embarking a squad ends its turn; on a later turn it may move then unload onto an adjacent valid tile. Ships need water; marines and amphibious carriers cross both land and water.

## Development
Buildless static HTML/CSS/JS. Serve this directory using any static HTTP server. No package installation or backend is needed. Local file opening also works in browsers that permit local script loading.

- `core.js`: renderer-independent simulation and campaign data.
- `render.js`: original geometry, WebGL/software rendering, camera and effects.
- `app.js`: interface, progression, settings, local saves.
- `three.min.js`: Three.js r160; see THREE-LICENSE.txt.

Run `node --test *.test.cjs` from this directory.

## Validation and limits
13 automated suites cover all mission setups and objective reachability, action rules, role restrictions, objectives, transports, recruitment, supply, upgrades, fog, repeated AI turns, and model geometry. Browser QA checked movement, turn cycling, recruitment, campaign locks, custom coastal skirmishes, naval recruitment, and saved state restoration using the software 3D renderer. Hardware WebGL was unavailable in the QA browser.

This is a first playable release. The campaign is not exhaustively balance-tested. Single-player only; no multiplayer, naval stealth, fuel/ammunition simulation, destructible terrain, or full recreation of another game's systems. School device policies and performance vary.

Save data stays in the browser under `frontline-atlas-v1`; it is separate from Astral Foundry saves. Export backups from Settings.
