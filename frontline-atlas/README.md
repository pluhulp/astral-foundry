# Frontline Atlas

Standalone turn-based tactics game. Open `index.html` through a static HTTP server. All assets are local; no build or network dependencies. The repository-root space game is separate.

## Version 6 — miniature warfare

- 60 independently unlockable troop families, each with six playable configurations (360 total). Searchable family gallery, branch filters, compact configuration cards, parent requirements and equipment disclosures.
- Tanks keep light, cruiser, medium, heavy, landship and command choices in one family. Earlier configurations remain available. Credits and lifetime earnings gate purchases, never campaign troop unlocks.
- Role-based configurations trade mobility, armor, firepower, observation and support capacity. Dual logistics stations have separate actions. All configurations have tactical abilities with costs and cooldowns.
- Rebuilt procedural miniature models for infantry, bikes, tracked/wheeled vehicles, helicopters, aircraft, drones and naval units. Equipment, hull proportions and variant details change their silhouettes. Armory and menu thumbnails render the same geometry as the battlefield.
- New slate/ochre interface, full-screen diorama battlefield, biome palettes, trees, rubble, bridges, road markings, HQ bunkers, factories, helipads and relay towers. WebGL lighting/shadows with a cached canvas fallback for machines without WebGL.
- Existing 67 unit IDs, weapon arrays, health/movement/service definitions and v3 saves remain compatible. Existing campaign, deck, HQ deployment and infinite HQ resupply rules remain intact.

## Files

`core.js` handles game rules; `roster.js` builds family configuration data; `models.js` creates shared miniature geometry; `render.js` handles terrain, camera, models, effects and thumbnails; `app.js` handles menus, saves and controls; `style.css` handles presentation. Bundled Three.js retains its upstream license.

## Checks

Run `node --test *.test.cjs` from this folder. Tests cover missions, movement, combat, ammunition, independent weapons and service bays, recruitment, tactical abilities, save/menu flow, family progression, all 720 faction/configuration models, and terrain batching/caching.

Browser QA covers the menu, searchable gallery, six-configuration detail, saved-battle resume, HQ and battlefield fallback. The QA browser disables WebGL, so GPU shadows require validation on a WebGL-capable device.
