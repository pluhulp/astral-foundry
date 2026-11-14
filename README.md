# Astral Foundry
A browser-local space industry game. Play at https://pluhulp.github.io/astral-foundry/.

## Observatory update
- Material units, outputs, inputs, prices, research and storage are scaled by 10. Existing saves convert once, including exports imported from the previous release.
- Starter drill: 3 metal/s; forestry drone: 2.2 wood/s; crystal extractor: 1.3 gems/s.
- Open observatory layout and draggable 3D planetary, industrial, Sol and construction scenes.
- One shared Three.js renderer draws only visible scenes, capped at 20 fps. When WebGL is unavailable, a software renderer projects the same meshes at 10 fps. Reduced motion draws static scenes. Hidden tabs stop decorative rendering.
- Three.js r160 is bundled locally; no runtime CDN or account is required. See THREE-LICENSE.txt.

## Run
Serve this directory with any static HTTP server. GitHub Pages publishes the repository root.

## Check
Run `node economy.test.cjs` for save migration, production, prices, storage, surveys, offline production and machine recipe checks.

Saves remain in browser local storage. Use Settings → Export save to move between devices or hosts.

### Orbital interface update
The interface now uses orbital command, a selectable 3D solar map, a focused machine workbench, and explicit research/expedition requirements. Launch controls are restored on both the home and destination views. Save schema and economy denominations are unchanged.

Validation: `node economy.test.cjs` covers all 114 research unlocks, Earth–Luna–Mercury launches, blocked and duplicate launches, save migration, independent storage, and all 239 machine recipes. Earth texture: Three.js examples, `textures/planets/earth_atmos_2048.jpg`.
