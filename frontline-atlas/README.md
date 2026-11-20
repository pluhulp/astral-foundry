# Frontline Atlas: Reforged

A **standalone, browser-based, turn-based combined-arms tactics game**, influenced by the broad gameplay structure of *Noobs in Combat* but independently developed. It uses original procedural graphics and its own title, interface details, data, and missions. It is **not** affiliated with the creators of Noobs in Combat.

**Play:** https://pluhulp.github.io/astral-foundry/frontline-atlas/

## The complete gameplay pass (November 2026)

### Lobby and profile

- A rebuilt command lobby with **Campaigns, Solo Skirmish, Research Tree, Loadouts, Profile, Market, Appearance, Daily Rewards, Settings/Saves, and Field Manual**
- Three persistent meta currencies: research points (★), gold nuggets (⬡), and gems (◆). **TIX** are earned and spent within battles; earning more tickets and capturing outposts increases reinforcement options.
- Campaign results show research earnings, nuggets, gems, turns, kills, and per-unit combat XP
- XP persists **even for unit types that are destroyed during battle**, provided they previously participated; new units gain veterancy bonuses based on permanent unit XP
- Profile counters for wins, battles, eliminations, deployed units, battle tickets earned and spent
- Daily free resource claims; exchange market with no real-money payments

### Progression

- **24 distinct unit types** across infantry, transports, armored units, artillery, naval units, and aircraft
- Five research lanes with prerequisites and experience thresholds
- Nine optional experience-gated equipment variants that change range, armor, damage, health, or vision
- User-configurable deployment **loadouts of up to eight blueprints**, with additional slots purchasable using earned gems
- Five color schemes: Classic Olive, Dune Expedition, Winter Brigade, Midnight Corps, Crimson Legion
- Normal / Tryhard / Rigged AI difficulty, with changing reinforcement pacing and reward multipliers

### Battle system

- Ten built-in maps; three victory formats: control every objective, eliminate enemy units, or survive timed defenses
- Dedicated solo skirmish selection with smaller repeatable progression rewards
- Tile-based movement with weighted terrain costs; movement animation follows valid routes
- Sight, explored fog-of-war and live enemy detection; scouting affects what appears in the minimap
- Morale, pinning, fallback behavior and Rally; infantry can dig in to strengthen defensive terrain cover
- Flanking support, dedicated armor penetration, veterancy, multi-weapon firing, and combined-arms counters
- Artillery spotter requirements, temporary obscuring smoke, deliberate overwatch reaction fire
- Limited ammunition and fuel, nearby resupply, repairs, and specialized transport boarding/unloading
- Player-selected rear and forward reinforcement locations, with forward deployment enabled by captured sites
- Enemy AI chooses targets, seeks terrain cover, recaptures objectives, supplies damaged units and selects reinforcement counters
- Original low-poly isometric terrain/unit renderings, raised terrain, roads, bridges, buildings, forests, ships, aircraft, shell traces and damage effects

### Saving and controls

- Research/currency/profile progress saves to browser localStorage automatically
- Solo battles support checkpoints, resumes (up to three permitted recalls) and seven-day save expiration
- Settings include reduced-motion graphics and **export/import of a portable JSON save**
- Click a friendly troop to select it; click blue highlighted movement tiles to relocate it, or valid enemy targets to attack
- Use the unit panel for primary/secondary weapons, resupply, rally, dig in, smoke, overwatch, boarding and unloading
- Select Reinforcements and click a legal deployment tile
- Right-drag = pan; scroll = zoom; Q/E = rotate; F = focus selected; R = frame entire map; Enter/Space = end turn; Escape = cancel

## Technical / QA

The project is served as static HTML/CSS/JavaScript from `index.html` and does not require a build process. All UI and procedural miniature models are self-contained.

The latest version passed scripted JavaScript syntax, mocked DOM/menu initialization, mocked Canvas drawing, startup and enemy-turn simulations for ten scenarios, currency/result processing, smoke/rally, deployment, fog visibility data, and solo-save/resume checks.

**These are automated smoke checks, NOT complete tests in a real browser**. Graphics layout, visual polish, performance on Chromebook/iOS, mission-by-mission balance and all edge cases still require player acceptance testing.

## Limits compared with Noobs in Combat

This is **not** a full one-to-one recreation. NiC has substantially more maps and unit evolutions, several deep mission mechanics and perks not modeled here, Roblox multiplayer/co-op, a full 3D world with its own animations and assets, and a much larger balancing/testing history. The interface follows general menu organization rather than reproducing copyrighted artwork, audio or logos. This game makes no claim of integration with official Noobs in Combat accounts.

## Save migration

Meta progression is stored under `frontline_atlas_reforged_v1`. Older Reforged saves with the `stars` currency migrate their previous stars into research points. Current solo-battle checkpoints use `frontline_atlas_reforged_battle_v2`; this is distinct from meta progression. Export before clearing browser site data.

## References consulted

- [Noobs in Combat main menu guide](https://noobsincombat.fandom.com/wiki/Tutorial)
- [Currency reference](https://noobsincombat.fandom.com/wiki/Currency)
- [Community v6.0 changelog](https://www.reddit.com/r/NoobsInCombat/comments/1xfk308/changelog_how_to_migrate_your_data_from_the_old/)
