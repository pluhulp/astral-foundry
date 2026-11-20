# Frontline Atlas — Combat Foundations Review (v10)

## Scope and research integrity

This report reviews the entire tactical loop as a **design system**, not just surface presentation. Frontline Atlas is an original browser tactics game: all art, sound, source code, factions and mission writing remain original. We are studying *Noobs in Combat* (NiC) to understand why it feels responsive, risky and meaningful, **not** copying its assets or redistributing Roblox content.

The external references reviewed include the original fan-maintained NiC Fandom wiki's [Unit Properties](https://noobsincombat.fandom.com/wiki/Unit_Properties), [Features](https://noobsincombat.fandom.com/wiki/Features), community pages on [controls / overwatch / spotting](https://noobsincombat.wiki/progression/noobs-in-combat-controls), [perk-based movement and multiple attacks](https://noobsincombat.wiki/progression/noobs-in-combat-perks), [morale, suppression and surrender](https://noobsincombat.wiki/progression/noobs-in-combat-morale), and [currency, campaign and squad role interactions](https://newgame.co.jp/metaverse/en/roblox/5734383673/noobs-in-combat/guide/). Two long reference videos were identified: [main-campaign solo playthrough](https://www.youtube.com/watch?v=z71QM_zJJJo) and [community-campaign solo playthrough](https://www.youtube.com/watch?v=OcOWPsnTexs). Chapters/descriptions were available; there was **no full frame-by-frame video playback** in the development environment. Rules from player guides may differ by NiC version and individual unit perk, and should not be treated as verified official internal formulas. The design remains under real-player verification.

## Why v9.8 felt hollow — findings from the real code

1. **No battlefield pressure except damage.** Units could safely approach most enemy positions because ordinary small arms inflicted HP loss but had no persistent suppression or pinning. Gunners had no way to deny a roadway without killing the enemy outright.
2. **Free reactive counterfire on every attack.** Many enemies shot back simply for being attacked. This produced damage trades rather than player-made ambushes and area control.
3. **Objective timers without contest conditions.** Relay missions were effectively "own the tile for four rounds"; no nearby defending garrison check, suppression check, or proactive threat linked to captured control.
4. **The economy was detached from the frontline.** Captured facilities granted bonus supply/capacity, but every paid purchase still had to spawn at the same back-row HQ pad. Advancing the front barely changed the tactical tempo.
5. **Arbitrary enemy HP inflation on difficulty.** Hard mode multiplied HP, making battles take longer without making the enemy more thoughtful. It also disguised differences between recon, light armor, and anti-armor counters.
6. **Weapon actions were incorrectly tied to movement state.** A unit's `attack()` set `u.moved=true`, so indirect units could be blocked from firing other mounts despite never changing tiles. Only some branches were exempt.
7. **Forced weapon-menu clicking.** Multi-gun units could be selected and fired, but after the chosen mount was spent, red highlights and click behavior still looked only at that mount.
8. **Too much empty opening space.** Enemy task groups and friendly deployment were near opposite rear edges, often delaying first fire to rounds 3–5 with few genuine choices in the meantime.
9. **Little audible consequence.** Visual blasts existed, but there was no proper low-latency combat soundscape for shots, impacts, pinned troops or control captures.
10. **Large catalog, little combined-arms incentive.** Fifty-two non-retired vehicle families and hundreds of variants could be selected, but information, morale, security of deployment, command positioning and infantry anti-vehicle interactions lacked enough cross-dependencies to make composition interesting.

The common failure is *action economy*: spending supply, moving, scouting, protecting, holding and firing did not sufficiently affect the **next decision**.

## v10 systems and intended feedback loops

| Pillar | v10 implementation | Consequence |
|---|---|---|
| Suppression | Damage inflicts pressure; machine guns and blasts inflict extra pressure; at 60+ units are pinned; pressure recovers, command proximity/entrenchment mitigate | Fire matters before lethal damage; coordinated attackers can force enemies off the offensive |
| Morale | Pinned ground units cannot move, fire or capture during their pin window; isolated low-HP infantry may surrender at extreme pressure | Keeping teammates together, falling back, and medic recovery prevent cascading collapses |
| Prepared reaction | Overwatch orders consume the unit's action; enemy movement is processed **tile by tile**; a visible guard can fire once per round and interrupt an advancing unit | Flanking, scouting and baiting defensive fire become important |
| Artillery spotting | Ground indirect guns need personal sight or a genuinely observing friendly infantry/recon/command unit | Recon becomes the artillery's forward eyes rather than optional redundancy |
| Recon mobility | Recon infantry/scout vehicles can spend the **same finite movement budget** across separate tile clicks; moving then firing is legal where the weapon allows it | Scout units can peek, react and reposition without gaining unlimited extra movement |
| Multi-gun actions | All ready weapon mounts considered; clicking a valid target auto-selects a remaining legal mount; no extra ammo consumed without a click | Heavy units feel fast and responsive without hiding their real action costs |
| Forward line | Captured secure towns/factories deploy paid, delayed land reinforcements adjacent to the outpost; enemy within two tiles blocks it | Capturing forward infrastructure changes supply geography and creates a vulnerable contested logistics chain |
| Relay missions | Hold progress requires a living unpinned friendly squad and a hostile-free perimeter; counterattacks are warned one round early and funded from enemy budget | No more passive four-round "end turn" victories |
| Momentum | One supply per enemy takedown, capped at +2 per player turn. Baseline +1/+factory income and costs intact | Limited reward for decisive fighting without heavy-unit purchase snowball |
| Early pacing | Relevant missions begin with one to three mixed-role enemy vanguard units near central roads | Scouts, machine guns and approach lanes matter before a full rear-line push |
| Difficulty | Identical unit HP and base weapon stats across difficulties; economy reserve, enemy vanguard density and response interval change | Harder means more pressure and better-supported enemies, not artificially spongier units |
| Scene feedback | Original synthesized gun/impact/capture sounds, cosmetic shockwave/crater graphics, movement that follows routes, unit badges for pinned/guarded | Every order has readable visual and audible cause/effect |
| Navy | Preserve v9.8 ship power, escort screens and AI broadside positioning | Ship duels remain decisive while infantry/ground have their own counters |

The map, camera, armory/research, 80-mission campaign, progression, original character models, ship classes, v9.7 weapon FX and operator mode remain intact. Save storage stays `frontline-atlas-v3`; new optional pressure fields are initialized safely on first use.

## Important design choices, not literal copying

- Most units still move and fire in a round, as explicitly requested for Frontline Atlas. Indirect ground guns need a proper firing setup after moving. The separate NiC guides describe unit-specific exceptions; copying one blanket rule would violate the user's chosen feel.
- Machine guns establish dangerous crossing lanes, not invisible aimbot fire. Prepared guards use normal range, visibility, available ammunition and no more than one reaction in a turn.
- Suppression is a separate pressure variable instead of opaque damage multipliers. Navy and air retain their existing non-infantry combat identity.
- Land forward spawning uses secure nearby facilities and the existing shared supply pool, not infinite free units or teleports. Dedicated deployment missions keep their pre-existing restrictions.
- The v10 sound design uses WebAudio oscillators and one deterministically generated noise buffer, with a mute toggle and capped simultaneous voices. No copyrighted gun sounds or music are copied.

## Acceptance and quality gates

### Automated checks

- **Rules:** every prepared reaction consumes a real shell, no overwatch through unseen terrain, 60+ pressure pins, isolation/surrender conditions, support recovery, no universal free counterfire, indirect spotter requirements, physical-position movement interruption, split recon budget invariants, capture/hold rules, and one-click multi-gun fire.
- **Balance:** player and enemy use the same unit HP on all difficulties; easy/normal/hard differ in budget and force density; naval damage and escort screen regressions preserved.
- **Campaign:** all 80 stages construct and accept complete multi-round AI turns without crashes, out-of-bounds coordinates or overlapping active units; naval missions retain their connected seas.
- **Compatibility:** v3 saves and operator unlocks remain readable; previously rewarded campaign completions and research are untouched; run `node --test *.test.cjs`.

### Human playtest rubric — still required

Use these criteria **before** declaring the overhaul complete; automation cannot prove that the game is fun:

1. First real threat occurs by approximately rounds 1–3 for most regular skirmishes, without a guaranteed unavoidable kill during opening placement.
2. Three ordinary rounds contain meaningful *choices* (maneuver / scout / pin / counterattack / repair / reinforce) rather than only clicking End Turn.
3. No standard light vehicle can be a universal answer to infantry, armor, anti-air, and naval engagements.
4. A competent player can counter an enemy gunline by spotting, suppression, artillery, maneuver, or cutting off supplies; not exclusively by accumulating 400+ HP.
5. User can fire all guns by directly clicking valid enemies without opening the weapon picker after every shot.
6. A veteran player wins by applying combinations of unit roles, not by saving for a single Leviathan or super-heavy tank.
7. On Hard, tactical loss is explainable from a missed threat, poor route or supply decision, not arbitrary HP amplification.
8. The HUD remains minimal and accurate; reaction danger tiles only display for enemy units actually observed.
9. Audio should be audible but not overwhelming; the Sound toggle must turn off the whole sound engine.
10. Replay several mission archetypes (first land map, relay hold, entrenched breakthrough, convoy, naval interception, artillery defense, mountain pass), not just one easy showcase.

### Measurable diagnostics

With passive player deployment of rifle + light armor (not a competent player's strategy), 80 seeded missions yielded first damaging contact across rounds 2–5 before v10 vanguards, and 1–5 after v10 vanguards; a majority began fighting by round 3. **This is a smoke-test for wasted turns, not a benchmark for fun or optimal balance.** Real players and a GPU-capable browser are still needed to evaluate tactical clarity, audio mixing, 3D performance, and feel.

## Important unfinished design work

**Not claimed complete:** full play-by-play inspection of the entire NiC campaign; live competitive/user playtesting; coherent handwritten scenario mechanics for every one of 80 maps (many missions share seeded templates); vehicle fuel/field towing and neutral equipment capture; individual veterancy/squad morale progression; true multiplayer or cooperative tactical turns; game-wide AI difficulty/win-rate calibration over a human-quality player policy; complete soundscape/UI accessibility. Some guide rules reflect NiC versions different from today's experience.

Those are substantial remaining systems—not defects to disguise with more bloom or shiny models. The design foundation is ready for **quantitative rebalancing and human playtesting**, and should be iterated from real encounters rather than another blind stat buff.

## Reference links

- [Noobs in Combat unit properties](https://noobsincombat.fandom.com/wiki/Unit_Properties)
- [Controls and overwatch](https://noobsincombat.wiki/progression/noobs-in-combat-controls)
- [Multi-move / multi-attack / recon perks](https://noobsincombat.wiki/progression/noobs-in-combat-perks)
- [Morale and surrender](https://noobsincombat.wiki/progression/noobs-in-combat-morale)
- [Economy and campaign guide](https://newgame.co.jp/metaverse/en/roblox/5734383673/noobs-in-combat/guide/)
- [Main campaign playthrough, chapter index](https://www.youtube.com/watch?v=z71QM_zJJJo)
- [Community campaign playthrough, chapter index](https://www.youtube.com/watch?v=OcOWPsnTexs)
