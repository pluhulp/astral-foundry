# Frontline Atlas v10 — Gameplay research and redesign audit

## Purpose and evidence limits

Frontline Atlas v9.8 had attractive 3D art, many troop variants and large battles, but player feedback repeatedly reported **hollow pacing, unclear tactical roles, excessive waiting, insufficient pressure during hold objectives and oversimplified shoot-to-deplete-HP encounters**. This audit compares the reference game's documented systems to our actual engine and identifies why those shortcomings arose.

**Source access disclaimer:** Public wiki/community pages and searchable video titles/descriptions were examined. The video references are **not** claimed to have been watched frame-by-frame, and independently measured reference values (TTK, match duration, AI actions/turn) are not available. These mechanics are a deliberate original adaptation, not a code, art, sound or exact stat replication.

## Verified reference features, implementation and remaining gaps

| System | Noobs in Combat, grounded references | Frontline Atlas v9.8 deficiency | v10 result | Remaining fidelity |
|---|---|---|---|---|
| Suppression/morale | A dedicated morale mechanic; units lose combat resolve and may retreat; enemy crew can abandon vehicles | Damage only subtracted HP, automatic retaliation regardless of tactical stance | 6-point resolve for land units; suppression, cover mitigation, pinning, infantry fallback, neutral abandoned vehicles | More granular unit/crew morale and recovery pacing need playtesting |
| Reactive combat / ambush | Overwatch and ambush attacks can interrupt enemy advances | Free automatic counterfire after nearly all attacks; no actual lane-holding decision | Explicit G/◉ Overwatch, single reaction using ammo at **each actual route square**, interruption by suppression/kill | Actual reaction-visibility tuning and movement UX |
| Recon / artillery | Artillery spotting by observing units and radio-linked support | Indirect artillery could fire with generic shared vision and ignore its observer | Ground artillery beyond five tiles needs field recon/command or relay observer | Deeper radio-battery linking, counterbattery radar and observable range bands |
| Combined arms | Infantry/armor/air/naval have specific targets, weaknesses, penetration and resupply needs | Weapon power summed against generic armor with few tactical counters | Ordinary infantry weak against heavy armor and naval hulls; health-sensitive damage; flank weakens cover | Armor piercing/ammo/fuel/squad composition need dedicated penetration model |
| Tactical objectives | Capturing, defending and supply interactions create an active tactical front | Several objectives can be won by ending rounds until timer completes | Budgeted local counterattacks at owned relays, objectives, convoy and recent captures | Unique authored stage triggers, garrisons and multi-stage operations |
| AI action economy | Weapon availability, movement, positioning and logistics matter | AI sometimes moved without firing; pathing favors neutral points; idle delays | Real multi-gun AI from v9.8; v10 goal priority, morale/cover risk, medics prioritize wounded, unseen artillery waits for spotters | Human-like threat anticipation, multi-round tactical doctrine and playtest-based difficulty |
| Pacing | Community/YouTube descriptions emphasize compact consequential interactions | Opening First Light initially required several empty turns before contact | Opening encounter hand-placed nearer; first meaningful fire observed round one in deterministic simulation; idle AI pause omitted | Need real-human playtesting, mission-by-mission encounter authoring |
| Fog & visual continuity | Recent patch notes mention fog updating during movement rather than popping | Fog only updated after entire move command | Reveal sight as unit walks each waypoint, enemy visibility follows movement, explored fog restored afterward | GPU/browser visibility validation |
| Sound/impact feedback | Tactical shooter presentation implies distinct action feedback | Impacts visually improved v9.7 but entirely silent | Optional **original synthesized** movement, gunfire, blast and morale tones, off by default | Audio mixing, sound variety, performance / accessibility |
| Presentation & controls | Brief contextual UI with responsive map interaction | Many buttons and long textual panels compete with stage | Compact unit morale/pinned/overwatch/neutral-hull status, G hotkey, direct click capture | Input ergonomics should be observed in a browser |
| Progression | Earn units/roles strategically and preserve strategic tradeoffs | 52 families × six variants blur roles and overcomplicate counter-play | Retain v9 tech tree/saves while starting combat-role differentiation | Complete research-tree and cost audit not yet done |

## Public references studied

- [Noobs in Combat — Perks & mechanics](https://noobsincombat.wiki/progression/noobs-in-combat-perks): overwatch, suppression, indirect fire and role traits
- [Noobs in Combat — Morale](https://noobsincombat.wiki/progression/noobs-in-combat-morale): pinning, retreat, crew abandonment and recovery
- [Noobs in Combat — Damage Calculator](https://noobsincombat.wiki/progression/noobs-in-combat-damage-calculator): attack output, role matchups and health dependence
- [Noobs in Combat general gameplay guide](https://newgame.co.jp/metaverse/en/roblox/5734383673/noobs-in-combat/guide/): acquisition, infantry/armor/air and equipment distinctions
- [Noobs in Combat community patch discussion](https://www.reddit.com/r/NoobsInCombat/comments/1xfk308/): visual continuity and reveal along the moving path
- Public gameplay/tutorial references for future frame-by-frame comparisons, **only metadata/descriptions accessible during this pass**: [beginner gameplay](https://www.youtube.com/watch?v=6yYGMjEkrwo), [boot camp](https://www.youtube.com/watch?v=YwIvgJnjy0U), [tactics](https://www.youtube.com/watch?v=o2j21CBzaB0)

## What to validate in human playtesting next

**Opening scenario / First Light:** A first contact in the first 1–2 turns is desirable, but avoid instant unavoidable losses. Compare two or three viable low-cost opening force compositions; log action counts, losses, recovery windows and number of tactically meaningful decisions.

**Holding relay:** A defended radio relay should provoke a contested approach with suppress/ambush/counterattack interplay rather than a four-turn idle countdown. Track attacker arrivals and whether defenders can respond without spamming new troops.

**Siege and convoy:** Telegraph fire, ensure that roadblocks and attack lines are readable, and test whether preserving transport/spotter links creates tactical choices.

**Naval interception:** Keep v9.8 anti-naval balance but measure actual fleet density, number of guns fired each turn, retreat ability and flagship survivability. New land-unit morale doesn't affect vessels.

**Performance:** Benchmark path-based fog reveals, sound and particles with four batteries active, large naval engagements and reduced motion toggled on/off. Unit tests do not validate GPU performance or subjective gameplay feel.

**Pass/fail standard:** Repeated user testing should find battles more skillful, dynamic and intuitive *across missions*, not merely see a long list of features. No exact Noobs in Combat equivalence is claimed.
