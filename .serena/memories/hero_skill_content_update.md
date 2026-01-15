# Hero Skill Content Update - January 2026

## Summary
Successfully added detailed skill descriptions for 21 heroes (42% of total roster), directly addressing user feedback about lacking meaningful content.

## Heroes Updated

### Nature Faction (5 heroes)
- **Monk** (Mythic Tank): Mountain Strike (damage immunity), Ultimate Zen Power (dodge + counterattack), Guardian Messenger (soldier HP boost)
- **Tidecaller** (Mythic DPS): Hydro Hammer (stun + summon), Ascend (knockup + Water Lord), Surge (normal attacks heal team) - Best Nature hero
- **Treeguard** (Legendary Tank): Growth (HP + damage reduction + heal), Titanwood Assault (thorns summon)
- **Forest Maiden** (Legendary Controller): Sheepherd (lamb summon), Song of Life/Revenge (summon death synergies)
- **Pixie** (Legendary DPS): Root Absorption (attack steal), Sunflower Core (AOE stun), Nature's Harmony (damage reduction per Nature hero)

### League Faction (8 heroes)
- **Paragon** (Mythic DPS): Celestial Blade (control immune AOE), Final Verdict (70% HP execute + CDR), Conqueror (scales with Legendary+ count) - Highest League DPS
- **Bishop** (Mythic DPS): Fair Strike/Confession (anti-summon), Sacred Burst (death trigger AOE), Divine Descent (AOE autos)
- **Rose Princess** (Mythic Tank): Be Brave (Courage stacks), Bloom (Resentment conversion damage), Weapon Up! (ATK scales damage reduction)
- **Adjudicator** (Legendary Tank): Shield of Faith (massive shield), Eternal (HP can't drop below 1), Indomitable (team damage reduction)
- **Pyromancer** (Legendary DPS): Detonate (burn application), Skyfire (massive AOE), Ember (low HP damage boost)
- **Nun** (Legendary Healer): Therapy (single target + healing amp), Radiant Song (max HP + damage reduction), Sacred Union (team HP boost)
- **Secret Keeper** (Legendary Tank): Arcane Shield (debuff cleanse), Forbidden Realm (AOE silence), Spell Reflection (brief immunity)
- **Bard** (Legendary Support): Cheer (movement/attack speed), Endgame Serenade (CDR after ultimate), Fight Song (League crit rate)

### Horde Faction (8 heroes)
- **Storm Maiden** (Mythic DPS): Lightning Storm (AOE knockup), Wings of Freedom (team dodge), Wind Field (stacking team attack)
- **Witch** (Mythic Healer): Dark Healing (primary heal), Dread Golem (fear summon), Dark Magic Boost (attack + stun immunity)
- **Barbarian** (Legendary Tank): Taunt (force enemy focus), Horde Defender (team damage reduction), Fortified Defense (shield)
- **Shaman** (Legendary Healer): Healing Breeze (lowest HP target), Ancestor's Soul (death prevention), Wolf Soul (2 wolf summons)
- **Swordmaster** (Legendary Tank): Whirlwind/Blade Storm (AOE spin), Battle Will (prevent death at 1 HP), Suppression (missing HP damage)
- **Warlock** (Legendary Support): Shadow Rite (Horde HP boost), Malicious Passion (Horde damage boost), Bloodlust (lifesteal + attack speed)
- **Wilderness Hunter** (Legendary DPS): Barb (extra attacks + bleed), Fatal Preyer (damage + knockback), Tradition (Horde damage)
- **Soulmancer** (Legendary Support): Soul Link (damage sharing), Soul Recall (near-death resurrection AOE), Soul Empowerment (Horde HP)

## Key Mechanics Documented
- **War Messenger/Guardian Messenger** passives: Increase soldier stats per 1000 deployed (critical for campaign)
- **Faction synergies**: Heroes with team-wide buffs (Barbarian, Warlock, Nun, etc.)
- **Summon mechanics**: Nature's sacrifice/death triggers (Forest Maiden, Pixie)
- **Execute mechanics**: Paragon's Final Verdict (70% HP), Bishop's anti-summon
- **Resurrection mechanics**: Battle Will, Soul Recall, Ancestor's Soul
- **Conversion mechanics**: Rose Princess Courage→Resentment system
- **Stacking buffs**: Wind Field, Revenge, Sacred Burst

## Sources Used
- https://www.guidetopheroes.com/ (Nature, League, Horde faction guides)
- https://topheroes.info/ (Hero database and guides)
- https://gameplay.tips/ (Desert Prince, Paragon, Soulmancer guide)
- Reddit r/TopHeroes community discussions
- LootBar, PocketGamer tier lists

## Remaining Work
- 29 heroes still need skill descriptions (Epic/Rare priorities)
- Mythic heroes: Altar Marshal, Artificer, Beastmaster, Desert Prince, Petalis, Shadow Priest
- Legendary heroes with empty skills: Druid, Pathfinder, Sage, Watcher, Windwalker, others
- Epic heroes: Knight, Minister, Outlaw, Priestess, Ranger, Rogue, Dancer (all have empty skills)
- Rare heroes: Archer, Blacksmith, Guard, Pharmacist, Warrior, Wizard (all empty)

## Technical Notes
- JSON validation passed: 50 heroes total, 21 with descriptions
- All skill objects include: name, type, description, tips
- Consistent formatting: Active/Passive/Ultimate types
- Tips focus on: strategic usage, synergies, positioning, mechanics
- No breaking changes to existing structure
