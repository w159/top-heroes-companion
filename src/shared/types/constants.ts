
import { Hero, GameEvent, GiftCode, Faction, Pet, Relic, Skin } from './types';

// =============================================================================
// HEROES - Aligned with heroes.json (source of truth) + enriched metadata
// Heroes are sourced from topheroes.info, topheroes1.fandom.com, and mobi.gg
// Last updated: February 2026
// =============================================================================

export const HEROES: Hero[] = [
  // ═══════════════════════════════════════════════════════════════════════════
  // NATURE FACTION — Mythic
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'tidecaller',
    image: '/img/heroes/tidecaller.webp',
    imageUrl: '/img/heroes/tidecaller.webp',
    name: 'Tidecaller',
    faction: 'Nature',
    rarity: 'Mythic',
    role: 'DPS',
    tier: 'S',
    description: 'The supreme Nature hero. Summons water elementals and a Water Lord. Normal attacks heal allies and hit multiple targets. Dominates both PvP and PvE.',
    skills: [
      { name: 'Hydro Hammer', type: 'Active', description: 'Deals damage, stuns, and summons a guardian water elemental.' },
      { name: 'Ascend', type: 'Ultimate', description: 'Deals damage, knocks enemies up, and summons Water Lord.' },
      { name: 'Purification Lance', type: 'Active', description: 'Deals damage and summons a ranged elemental.' },
      { name: 'Surge', type: 'Passive', description: 'Normal attacks heal all allies.' },
      { name: 'Evolve', type: 'Passive', description: 'Normal attacks can hit an additional target.' }
    ],
    recommendedSets: ['Fury of Blood'],
    bonds: [{ partnerId: 'monk', bonus: 'Team DMG +10%' }, { partnerId: 'petalis', bonus: 'Team DMG +15%' }],
    specialWeapon: { name: 'Divine Trident', description: 'Enhances summon damage and stun duration.' },
    exclusiveGear: { name: 'Heart of the Sea', statBonus: 'ATK +20%, Healing +15%' }
  },
  {
    id: 'altar-marshal',
    image: '/img/heroes/altar-marshal.webp',
    imageUrl: '/img/heroes/altar-marshal.webp',
    name: 'Altar Marshal',
    faction: 'Nature',
    rarity: 'Mythic',
    role: 'Tank',
    tier: 'A',
    description: 'Frontline warrior with fire-based attacks, demon-slaying power, and agile wind-fire movement.',
    skills: [
      { name: 'Chaos Binding', type: 'Active', description: 'Binds enemies in place with chaos energy.' },
      { name: 'Demon-Slayer', type: 'Ultimate', description: 'Unleashes devastating demon-slaying attack.' },
      { name: 'Inferno Lotus', type: 'Active', description: 'Creates a lotus of fire dealing AoE damage.' },
      { name: 'Windfire Dash', type: 'Passive', description: 'Gains movement and attack speed boost.' },
      { name: 'Spirit Pearl', type: 'Passive', description: 'Enhances defense and grants spirit protection.' }
    ],
    recommendedSets: ['Fury of Blood'],
    specialWeapon: { name: 'Fire-Tipped Spear', description: 'Increases fire damage and demon-slaying bonus.' }
  },
  {
    id: 'monk',
    image: '/img/heroes/monk.webp',
    imageUrl: '/img/heroes/monk.webp',
    name: 'Monk',
    faction: 'Nature',
    rarity: 'Mythic',
    role: 'Tank',
    tier: 'A',
    description: 'Agile frontline disruptor with dodge, counterattacks, and control immunity. Gains shields when units die.',
    skills: [
      { name: 'Mountain Strike', type: 'Active', description: 'Deals damage, increases max HP, and grants damage immunity.' },
      { name: 'Ultimate Zen Power', type: 'Ultimate', description: 'Grants dodge, damage reduction, and counterattacks when hit.' },
      { name: 'Fiery Breath', type: 'Active', description: 'Deals damage and grants control immunity.' },
      { name: 'Thundering Kick', type: 'Passive', description: 'Adds a chance to follow up Mountain Strike with a stun.' },
      { name: 'Merciful Victor', type: 'Passive', description: 'Gains a shield when units die or are sacrificed.' }
    ],
    recommendedSets: ['Fury of Blood'],
    bonds: [{ partnerId: 'tidecaller', bonus: 'Team DMG +10%' }]
  },
  {
    id: 'petalis',
    image: '/img/heroes/petalis.webp',
    imageUrl: '/img/heroes/petalis.webp',
    name: 'Petalis',
    faction: 'Nature',
    rarity: 'Mythic',
    role: 'Support',
    tier: 'S',
    description: 'Lotus-themed support with charm, healing, and sakura rain. Fox spirit secrets provide additional team benefits.',
    skills: [
      { name: 'Sacred Lotus', type: 'Active', description: 'Heals allies with sacred lotus energy.' },
      { name: 'Charm Flower', type: 'Ultimate', description: 'Charms enemies, causing them to fight for your team.' },
      { name: 'Twin Lotus', type: 'Active', description: 'Creates twin lotuses that heal and damage.' },
      { name: 'Sakura Rain', type: 'Active', description: 'Rains sakura petals for AoE healing.' },
      { name: 'Flourish', type: 'Passive', description: 'Enhances healing effects over time.' },
      { name: 'Fox Spirit Secrets', type: 'Passive', description: 'Grants additional team buffs.' }
    ],
    recommendedSets: ['Glory of the Knight'],
    bonds: [{ partnerId: 'tidecaller', bonus: 'Team DMG +15%' }]
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // NATURE FACTION — Legendary
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'pixie',
    image: '/img/heroes/pixie.webp',
    imageUrl: '/img/heroes/pixie.webp',
    name: 'Pixie',
    faction: 'Nature',
    rarity: 'Legendary',
    role: 'DPS',
    tier: 'S',
    description: 'Nature damage dealer with root absorption, AoE stuns, and pollen debuffs. Synergizes with summon-heavy comps.',
    skills: [
      { name: 'Root Absorption', type: 'Active', description: 'Summons roots that deal damage and steal attack from enemies.' },
      { name: 'Sunflower Core', type: 'Ultimate', description: 'Summons a powerful core that damages and stuns all enemies.' },
      { name: 'Phantom Pollen', type: 'Active', description: 'Reduces enemy hit rate and deals damage over time.' },
      { name: 'Forest Ally', type: 'Passive', description: 'Each dead/sacrificed unit reduces Sunflower Core cooldown.' },
      { name: 'Protector', type: 'Passive', description: 'Increases defensive stats.' },
      { name: "Nature's Harmony", type: 'Passive', description: 'Gains damage reduction for each living Nature hero.' }
    ],
    recommendedSets: ['Glory of the Knight'],
    specialWeapon: { name: 'Golden Apple', description: 'Enhances summon synergy and cooldown reduction.' }
  },
  {
    id: 'forest-maiden',
    image: '/img/heroes/forest-maiden.webp',
    imageUrl: '/img/heroes/forest-maiden.webp',
    name: 'Forest Maiden',
    faction: 'Nature',
    rarity: 'Legendary',
    role: 'Controller',
    tier: 'B',
    description: 'Summons sheep for CC and damage. Heals allies when summoned units die, creating a sacrifice-heal loop.',
    skills: [
      { name: 'Baa-Baa Charge', type: 'Active', description: 'Summons sheep that deal damage and stun enemies.' },
      { name: 'Sheepherd', type: 'Ultimate', description: 'Summons a powerful lamb to fight for the team.' },
      { name: 'Forest Lullaby', type: 'Active', description: 'Grants damage reduction to nearby allies.' },
      { name: 'Song of Life', type: 'Passive', description: 'When units die or are sacrificed, all heroes recover HP.' },
      { name: 'Revenge', type: 'Passive', description: 'Each time a unit dies, all heroes gain permanent damage increase.' },
      { name: 'Blessing of Spring', type: 'Passive', description: 'Additional supportive bonuses for Nature team.' }
    ],
    recommendedSets: ['Fury of Blood']
  },
  {
    id: 'windwalker',
    image: '/img/heroes/windwalker.webp',
    imageUrl: '/img/heroes/windwalker.webp',
    name: 'Windwalker',
    faction: 'Nature',
    rarity: 'Legendary',
    role: 'DPS',
    tier: 'B',
    description: 'Ranged Nature damage dealer with wind-based attacks.',
    skills: [],
    recommendedSets: ["Titan's Might"]
  },
  {
    id: 'sage',
    image: '/img/heroes/sage.webp',
    imageUrl: '/img/heroes/sage.webp',
    name: 'Sage',
    faction: 'Nature',
    rarity: 'Legendary',
    role: 'Tank',
    tier: 'A',
    description: 'Nature tank providing energy support and team buffs.',
    skills: [],
    recommendedSets: ['Fury of Blood']
  },
  {
    id: 'druid',
    image: '/img/heroes/druid.webp',
    imageUrl: '/img/heroes/druid.webp',
    name: 'Druid',
    faction: 'Nature',
    rarity: 'Legendary',
    role: 'Healer',
    tier: 'B',
    description: 'Nature healer who shapeshifts to protect allies.',
    skills: [],
    recommendedSets: ['Fury of Blood']
  },
  {
    id: 'treeguard',
    image: '/img/heroes/treeguard.webp',
    imageUrl: '/img/heroes/treeguard.webp',
    name: 'Treeguard',
    faction: 'Nature',
    rarity: 'Legendary',
    role: 'Tank',
    tier: 'B',
    description: 'The ultimate physical wall with high self-regeneration and CC immunity.',
    skills: [
      { name: 'Growth', type: 'Active', description: 'Increases max HP, reduces damage taken, and heals self.' },
      { name: 'Titanwood Assault', type: 'Ultimate', description: 'Summons thorns that deal damage and heal Treeguard.' },
      { name: 'Vitality Surge', type: 'Active', description: 'Increases damage output and heals self.' },
      { name: 'Timber Shell', type: 'Passive', description: 'Increases damage reduction and max HP, and provides healing.' },
      { name: 'Vine', type: 'Passive', description: 'While Growth is active, attacks deal extra damage and apply poison.' }
    ],
    recommendedSets: ['Fury of Blood']
  },
  {
    id: 'pathfinder',
    image: '/img/heroes/pathfinder.webp',
    imageUrl: '/img/heroes/pathfinder.webp',
    name: 'Pathfinder',
    faction: 'Nature',
    rarity: 'Legendary',
    role: 'DPS',
    tier: 'C',
    description: 'Nature damage dealer specializing in exploration and ranged attacks.',
    skills: []
  },
  {
    id: 'watcher',
    image: '/img/heroes/watcher.webp',
    imageUrl: '/img/heroes/watcher.webp',
    name: 'Watcher',
    faction: 'Nature',
    rarity: 'Legendary',
    role: 'Controller',
    tier: 'C',
    description: 'Nature controller with observation-based abilities.',
    skills: [],
    recommendedSets: ["Titan's Might"]
  },
  {
    id: 'stonemason',
    image: '/img/heroes/stonemason.webp',
    imageUrl: '/img/heroes/stonemason.webp',
    name: 'Stonemason',
    faction: 'Nature',
    rarity: 'Legendary',
    role: 'DPS',
    tier: 'C',
    description: 'Nature damage dealer who crafts stone projectiles.',
    skills: []
  },

  // Nature — Epic
  {
    id: 'dancer',
    image: '/img/heroes/dancer.webp',
    imageUrl: '/img/heroes/dancer.webp',
    name: 'Dancer',
    faction: 'Nature',
    rarity: 'Epic',
    role: 'Support',
    tier: 'C',
    description: 'Graceful Nature support hero.'
  },
  {
    id: 'priestess',
    image: '/img/heroes/priestess.webp',
    imageUrl: '/img/heroes/priestess.webp',
    name: 'Priestess',
    faction: 'Nature',
    rarity: 'Epic',
    role: 'Healer',
    tier: 'D',
    description: 'Nature healer with basic healing abilities.'
  },

  // Nature — Rare
  {
    id: 'archer',
    image: '/img/heroes/archer.webp',
    imageUrl: '/img/heroes/archer.webp',
    name: 'Archer',
    faction: 'Nature',
    rarity: 'Rare',
    role: 'DPS',
    tier: 'D',
    description: 'Basic Nature ranged unit.'
  },
  {
    id: 'pharmacist',
    image: '/img/heroes/pharmacist.webp',
    imageUrl: '/img/heroes/pharmacist.webp',
    name: 'Pharmacist',
    faction: 'Nature',
    rarity: 'Rare',
    role: 'Healer',
    tier: 'D',
    description: 'Basic Nature healer.'
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // LEAGUE FACTION — Mythic
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'paragon',
    image: '/img/heroes/paragon.webp',
    imageUrl: '/img/heroes/paragon.webp',
    name: 'Paragon',
    faction: 'League',
    rarity: 'Mythic',
    role: 'DPS',
    tier: 'A',
    description: 'Holy warrior with AoE damage, burn stacks, team ATK buff, and League faction bonus. Primary League DPS.',
    skills: [
      { name: 'Commanding Call', type: 'Active', description: 'Deals rectangular AoE damage and grants allies shield.' },
      { name: 'Celestial Blade', type: 'Ultimate', description: 'Grants control immunity, deals massive AoE damage, applies burn, gains damage reduction.' },
      { name: 'Moral Fury', type: 'Active', description: 'Waves flag to increase all allies\' ATK and deals damage per second.' },
      { name: 'Final Verdict', type: 'Passive', description: 'Increases damage against enemies above 70% HP. Reduces ultimate CD by 2s per kill.' },
      { name: 'Ultimate Execution', type: 'Passive', description: 'Extends normal attack range, adds additional target, boosts normal ATK damage.' },
      { name: 'Conqueror', type: 'Passive', description: 'Boosts castle ATK per Legendary+ hero; grants skill crit at 6 heroes.' }
    ],
    recommendedSets: ['Glory of the Knight'],
    bonds: [{ partnerId: 'astrologer', bonus: 'Team DMG +10%' }, { partnerId: 'rose-princess', bonus: 'DMG Reduction +15%' }],
    specialWeapon: { name: 'Everlasting Justice', description: 'Ultimate ignores 25% of target defense.' },
    exclusiveGear: { name: 'Golden Armor', statBonus: 'ATK +20%, HP +10%' },
    skins: [{ name: 'Dark Moon' }, { name: 'Chef' }, { name: 'Wishing Star' }, { name: 'Bunny' }]
  },
  {
    id: 'bishop',
    image: '/img/heroes/bishop.webp',
    imageUrl: '/img/heroes/bishop.webp',
    name: 'Bishop',
    faction: 'League',
    rarity: 'Mythic',
    role: 'DPS',
    tier: 'B',
    description: 'Anti-summon specialist with AoE transformation ultimate. Deals extra damage vs summoned units and snowballs as enemies fall.',
    skills: [
      { name: 'Fair Strike', type: 'Active', description: 'Deals extra damage against summoned units.' },
      { name: 'Divine Descent', type: 'Ultimate', description: 'Increases ATK and damage reduction, grants AoE normal attacks temporarily.' },
      { name: 'Confession', type: 'Active', description: 'Deals damage, applies Weaken debuff, extra effective vs summons.' },
      { name: 'Solar Shield', type: 'Passive', description: 'Increases crit rate and crit resistance.' },
      { name: 'Sacred Burst', type: 'Active', description: 'Triggers AoE damage automatically when enemies die.' },
      { name: 'War Messenger', type: 'Passive', description: 'Increases soldiers\' ATK per 1000 deployed.' }
    ],
    recommendedSets: ['Glory of the Knight'],
    specialWeapon: { name: 'Libram of Light', description: 'Enhances anti-summon damage and AoE transformation.' }
  },
  {
    id: 'rose-princess',
    image: '/img/heroes/rose-princess.webp',
    imageUrl: '/img/heroes/rose-princess.webp',
    name: 'Rose Princess',
    faction: 'League',
    rarity: 'Mythic',
    role: 'Tank',
    tier: 'S',
    description: 'Unique tank that stores damage as Resentment then converts it to burst. ATK stat increases tankiness. Applies Heal Ban.',
    skills: [
      { name: 'Be Brave', type: 'Active', description: 'Gains Courage stacks for damage reduction; damage converts to Resentment.' },
      { name: 'Bloom', type: 'Ultimate', description: 'Consumes Resentment stacks to deal massive damage and apply Heal Ban.' },
      { name: 'Thorns', type: 'Active', description: 'Damage scales with accumulated Resentment stacks.' },
      { name: 'Weapon Up!', type: 'Passive', description: 'Damage reduction scales with ATK stat.' },
      { name: 'Roses', type: 'Passive', description: 'Gains Courage and HP when enemies die.' },
      { name: 'Guardian Messenger', type: 'Passive', description: 'Increases soldiers\' HP per 1000 deployed.' }
    ],
    recommendedSets: ['Fury of Blood'],
    specialWeapon: { name: 'Royalthron Blade', description: 'Enhances Resentment conversion and Heal Ban duration.' },
    bonds: [{ partnerId: 'paragon', bonus: 'DMG Reduction +15%' }]
  },
  {
    id: 'artificer',
    image: '/img/heroes/artificer.webp',
    imageUrl: '/img/heroes/artificer.webp',
    name: 'Artificer',
    faction: 'League',
    rarity: 'Mythic',
    role: 'Support',
    tier: 'S',
    description: 'Mechanical genius deploying turrets, pulse mods, and magnifiers. Provides team-wide buffs and sustained support.',
    skills: [
      { name: 'TH-300', type: 'Active', description: 'Deploys a TH-300 turret for sustained damage.' },
      { name: 'Upgrade!', type: 'Ultimate', description: 'Upgrades all deployed turrets and boosts team.' },
      { name: 'Pulse Mod', type: 'Active', description: 'Sends a pulse that buffs allies.' },
      { name: 'Magnifier', type: 'Active', description: 'Amplifies damage of allied attacks.' },
      { name: 'Parts Collection', type: 'Passive', description: 'Collects parts from combat for upgrades.' },
      { name: 'Flickering Watch', type: 'Passive', description: 'Provides team-wide timing benefits.' }
    ],
    recommendedSets: ['Glory of the Knight'],
    specialWeapon: { name: 'Spark of Thought', description: 'Turrets apply slowing effect and deal more damage.' }
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // LEAGUE FACTION — Legendary
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'adjudicator',
    image: '/img/heroes/adjudicator.webp',
    imageUrl: '/img/heroes/adjudicator.webp',
    name: 'Adjudicator',
    faction: 'League',
    rarity: 'Legendary',
    role: 'Tank',
    tier: 'A',
    description: 'Near-immortal League tank with stun, self-heal, team damage reduction, and an invincibility passive that prevents death.',
    skills: [
      { name: 'Guardian Discipline', type: 'Active', description: 'Deals damage, stuns, grants damage reduction and control immunity.' },
      { name: 'Shield of Faith', type: 'Ultimate', description: 'Summons massive shield that explodes for damage when it expires.' },
      { name: 'Judgment', type: 'Active', description: 'Deals damage, stuns target, and heals self.' },
      { name: 'Indomitable', type: 'Passive', description: 'Grants damage reduction to all allies.' },
      { name: 'Eternal', type: 'Passive', description: 'HP cannot drop below 1 — grants brief invincibility.' },
      { name: 'Order of Sanctity', type: 'Passive', description: 'Additional defensive bonuses for League team.' }
    ],
    recommendedSets: ['Fury of Blood'],
    specialWeapon: { name: 'Judgment', description: 'Enhances stun duration and invincibility window.' }
  },
  {
    id: 'astrologer',
    image: '/img/heroes/astrologer.webp',
    imageUrl: '/img/heroes/astrologer.webp',
    name: 'Astrologer',
    faction: 'League',
    rarity: 'Legendary',
    role: 'DPS',
    tier: 'B',
    description: 'League damage dealer with light-based ray attacks and foresight abilities.',
    skills: [
      { name: 'Ray Beam', type: 'Active', description: 'Fires a beam of light dealing damage.' },
      { name: 'Solar Beam', type: 'Ultimate', description: 'Channels massive solar energy for devastating damage.' },
      { name: 'Arc Light', type: 'Active', description: 'Creates arcs of light hitting multiple enemies.' },
      { name: 'Foresight', type: 'Passive', description: 'Increases accuracy and critical hit chance.' },
      { name: 'Insights', type: 'Passive', description: 'Provides additional damage scaling.' }
    ],
    recommendedSets: ["Titan's Might"],
    specialWeapon: { name: 'Starry Orb', description: 'Enhances light damage and beam width.' },
    bonds: [{ partnerId: 'paragon', bonus: 'Team DMG +10%' }]
  },
  {
    id: 'bard',
    image: '/img/heroes/bard.webp',
    imageUrl: '/img/heroes/bard.webp',
    name: 'Bard',
    faction: 'League',
    rarity: 'Legendary',
    role: 'Support',
    tier: 'B',
    description: 'Musical support with team speed buffs, cooldown reduction, and crit rate boosts for League heroes.',
    skills: [
      { name: 'Cheer', type: 'Active', description: 'Increases movement and attack speed of allies.' },
      { name: 'Resonant Chord', type: 'Ultimate', description: 'Deals massive damage and stuns enemies.' },
      { name: 'Grace', type: 'Active', description: 'Increases allies\' crit rate.' },
      { name: 'Endgame Serenade', type: 'Passive', description: 'Reduces allies\' skill cooldowns after using Resonant Chord.' },
      { name: 'Fight Song', type: 'Passive', description: 'Increases crit rate for all League heroes.' }
    ],
    recommendedSets: ['Fury of Blood'],
    specialWeapon: { name: 'Heartbringer Harp', description: 'Enhances buff duration and team speed.' }
  },
  {
    id: 'nun',
    image: '/img/heroes/nun.webp',
    imageUrl: '/img/heroes/nun.webp',
    name: 'Nun',
    faction: 'League',
    rarity: 'Legendary',
    role: 'Healer',
    tier: 'B',
    description: 'League healer with single-target heals, AoE healing, and team-wide HP buff. Increases final damage reduction for allies.',
    skills: [
      { name: 'Therapy', type: 'Active', description: 'Heals single ally with lowest HP and increases healing received.' },
      { name: 'Radiant Song', type: 'Ultimate', description: 'Increases max HP and grants final damage reduction to all allies.' },
      { name: 'Prayer of Healing', type: 'Active', description: 'Heals all allies at once.' },
      { name: 'Holy Grace', type: 'Passive', description: 'Grants self damage reduction.' },
      { name: 'Sacred Union', type: 'Passive', description: 'Increases max HP of all League heroes.' }
    ],
    recommendedSets: ['Fury of Blood'],
    specialWeapon: { name: 'Blessing', description: 'Overhealing converts into a shield.' }
  },
  {
    id: 'pyromancer',
    image: '/img/heroes/pyromancer.webp',
    imageUrl: '/img/heroes/pyromancer.webp',
    name: 'Pyromancer',
    faction: 'League',
    rarity: 'Legendary',
    role: 'DPS',
    tier: 'B',
    description: 'Fire mage with burn, massive AoE burst, and scaling damage when low on HP.',
    skills: [
      { name: 'Detonate', type: 'Active', description: 'Deals damage and applies burn status effect to enemies.' },
      { name: 'Skyfire', type: 'Ultimate', description: 'Massive area damage dealing multiple hits to all enemies.' },
      { name: 'Flame Shield', type: 'Active', description: 'Provides shield to self and damages nearby enemies.' },
      { name: 'Elemental Mastery', type: 'Passive', description: 'Increases all skill damage output.' },
      { name: 'Ember', type: 'Passive', description: 'Grants ATK boost when HP drops below threshold.' },
      { name: 'Burst Rune', type: 'Passive', description: 'Further enhances burst damage from skills.' }
    ],
    recommendedSets: ['Glory of the Knight']
  },
  {
    id: 'secret-keeper',
    image: '/img/heroes/secret-keeper.webp',
    imageUrl: '/img/heroes/secret-keeper.webp',
    name: 'Secret Keeper',
    faction: 'League',
    rarity: 'Legendary',
    role: 'Tank',
    tier: 'B',
    description: 'AoE silence tank who cleanses debuffs and reflects spells. Generates passive shields.',
    skills: [
      { name: 'Arcane Shield', type: 'Active', description: 'Increases damage reduction and removes debuffs from self.' },
      { name: 'Forbidden Realm', type: 'Ultimate', description: 'Silences all enemies and deals damage.' },
      { name: 'Spell Reflection', type: 'Active', description: 'Deals damage and grants brief ability immunity.' },
      { name: 'Arcane Link', type: 'Passive', description: 'Increases max HP.' },
      { name: 'Arcane Guardian', type: 'Passive', description: 'Grants damage-absorbing shield periodically.' }
    ],
    recommendedSets: ['Fury of Blood'],
    specialWeapon: { name: 'Absolute Zero', description: 'Silence duration extended and adds freeze effect.' }
  },
  {
    id: 'hostess',
    image: '/img/heroes/hostess.webp',
    imageUrl: '/img/heroes/hostess.webp',
    name: 'Hostess',
    faction: 'League',
    rarity: 'Legendary',
    role: 'Tank',
    tier: 'B',
    description: 'Tavern brawler tank with agile footwork and a devastating 100-ton hammer ultimate.',
    skills: [
      { name: '100T Hammer!', type: 'Ultimate', description: 'Smashes enemies with a massive hammer for devastating damage.' },
      { name: 'Drunken Brawl', type: 'Active', description: 'Fights with unpredictable brawling style.' },
      { name: 'Agile Footwork', type: 'Passive', description: 'Increases dodge and movement speed.' },
      { name: 'Inn Keeper', type: 'Passive', description: 'Provides team sustain benefits.' }
    ],
    recommendedSets: ['Fury of Blood']
  },

  // League — Epic
  {
    id: 'knight',
    image: '/img/heroes/knight.webp',
    imageUrl: '/img/heroes/knight.webp',
    name: 'Knight',
    faction: 'League',
    rarity: 'Epic',
    role: 'Tank',
    tier: 'C',
    description: 'Basic League tank.'
  },
  {
    id: 'minister',
    image: '/img/heroes/minister.webp',
    imageUrl: '/img/heroes/minister.webp',
    name: 'Minister',
    faction: 'League',
    rarity: 'Epic',
    role: 'Support',
    tier: 'C',
    description: 'League support minister.'
  },
  {
    id: 'ranger',
    image: '/img/heroes/ranger.webp',
    imageUrl: '/img/heroes/ranger.webp',
    name: 'Ranger',
    faction: 'League',
    rarity: 'Epic',
    role: 'DPS',
    tier: 'C',
    description: 'League ranged damage dealer.'
  },

  // League — Rare
  {
    id: 'guard',
    image: '/img/heroes/guard.webp',
    imageUrl: '/img/heroes/guard.webp',
    name: 'Guard',
    faction: 'Horde',
    rarity: 'Rare',
    role: 'Tank',
    tier: 'D',
    description: 'Basic Horde tank fodder.'
  },
  {
    id: 'warrior',
    image: '/img/heroes/warrior.webp',
    imageUrl: '/img/heroes/warrior.webp',
    name: 'Warrior',
    faction: 'League',
    rarity: 'Rare',
    role: 'Tank',
    tier: 'D',
    description: 'Basic League melee fighter.'
  },
  {
    id: 'wizard',
    image: '/img/heroes/wizard.webp',
    imageUrl: '/img/heroes/wizard.webp',
    name: 'Wizard',
    faction: 'League',
    rarity: 'Rare',
    role: 'DPS',
    tier: 'D',
    description: 'Basic League spellcaster.'
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // HORDE FACTION — Mythic
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'shadow-priest',
    image: '/img/heroes/shadow-priest.webp',
    imageUrl: '/img/heroes/shadow-priest.webp',
    name: 'Shadow Priest',
    faction: 'Horde',
    rarity: 'Mythic',
    role: 'Healer',
    tier: 'S',
    description: 'The #1 ranked hero in the game (Feb 2026). Dark healer who debuffs enemies with armor reduction and lifesteal curses while keeping allies alive.',
    skills: [],
    recommendedSets: ['Sage'],
    specialWeapon: { name: 'Shadow Orb', description: 'Curses reduce enemy attack speed by 20%.' },
    bonds: [{ partnerId: 'wanderer', bonus: 'Energy Regen +15%' }, { partnerId: 'desert-prince', bonus: 'DEF +12%' }]
  },
  {
    id: 'desert-prince',
    image: '/img/heroes/desert-prince.webp',
    imageUrl: '/img/heroes/desert-prince.webp',
    name: 'Desert Prince',
    faction: 'Horde',
    rarity: 'Mythic',
    role: 'Tank',
    tier: 'S',
    description: 'Horde tank with royal armor, scorching scimitar attacks, and insight-based passive abilities.',
    skills: [
      { name: 'Royal Armor', type: 'Active', description: 'Activates royal armor for massive damage reduction.' },
      { name: 'Scorching Scimitar', type: 'Active', description: 'Slashes with a burning scimitar dealing fire damage.' },
      { name: 'Royal Treasury', type: 'Passive', description: 'Gains resources and bonuses from combat.' },
      { name: 'Eye of Insight', type: 'Passive', description: 'Reveals enemy weaknesses.' },
      { name: 'Enthusiast', type: 'Passive', description: 'Gains enthusiasm stacks for increased power.' }
    ],
    recommendedSets: ['Glory of the Knight'],
    bonds: [{ partnerId: 'shadow-priest', bonus: 'DEF +12%' }]
  },
  {
    id: 'wanderer',
    image: '/img/heroes/wanderer.webp',
    imageUrl: '/img/heroes/wanderer.webp',
    name: 'Wanderer',
    faction: 'Horde',
    rarity: 'Mythic',
    role: 'Tank',
    tier: 'A',
    description: 'Monkey King-themed tank with illusory clones, immobilization, and robust constitution. The Great Sage passive.',
    skills: [
      { name: 'Immobilize', type: 'Active', description: 'Roots enemies in place.' },
      { name: 'Illusory Split', type: 'Ultimate', description: 'Creates illusory clones that fight alongside.' },
      { name: 'Staff Stances', type: 'Passive', description: 'Switches between offensive and defensive stances.' },
      { name: 'Robust Constitution', type: 'Passive', description: 'Increases HP and damage reduction.' },
      { name: 'True Sight', type: 'Passive', description: 'Reveals hidden enemies.' },
      { name: 'The Great Sage', type: 'Passive', description: 'Ultimate passive granting sage powers.' }
    ],
    recommendedSets: ["Titan's Might"],
    specialWeapon: { name: 'Fire-Tipped Spear', description: 'Clone damage increased and gains fire damage.' },
    bonds: [{ partnerId: 'shadow-priest', bonus: 'Energy Regen +15%' }]
  },
  {
    id: 'storm-maiden',
    image: '/img/heroes/storm-maiden.webp',
    imageUrl: '/img/heroes/storm-maiden.webp',
    name: 'Storm Maiden',
    faction: 'Horde',
    rarity: 'Mythic',
    role: 'DPS',
    tier: 'A',
    description: 'Lightning-based AoE damage dealer with projectile-blocking tornado and team-wide dodge buff.',
    skills: [
      { name: 'Whirlwind Feathers', type: 'Active', description: 'Deals damage, increases movement and attack speed.' },
      { name: 'Lightning Storm', type: 'Ultimate', description: 'Deals massive damage and launches enemies into the air.' },
      { name: 'Wings of Freedom', type: 'Active', description: 'Grants dodge to all heroes in queue.' },
      { name: 'Tornado', type: 'Active', description: 'Channels whirlwind that blocks projectiles, then deals damage.' },
      { name: 'Wind Field', type: 'Passive', description: 'Each Tornado cast permanently increases team ATK.' },
      { name: 'War Messenger', type: 'Passive', description: 'Increases soldier ATK per 1000 deployed.' }
    ],
    recommendedSets: ["Titan's Might"],
    specialWeapon: { name: 'Stormbringer', description: 'Lightning damage enhanced and tornado duration increased.' }
  },
  {
    id: 'beastmaster',
    image: '/img/heroes/beastmaster.webp',
    imageUrl: '/img/heroes/beastmaster.webp',
    name: 'Beastmaster',
    faction: 'Horde',
    rarity: 'Mythic',
    role: 'Tank',
    tier: 'A',
    description: 'Capybara companion tank with traps, bubble shields, and citrus healing. Trusty friend passive.',
    skills: [
      { name: 'Capybara Strike', type: 'Active', description: 'Commands capybara companion to strike enemies.' },
      { name: 'Beast Trap', type: 'Ultimate', description: 'Sets traps that immobilize and damage enemies.' },
      { name: 'Fresh Citrus', type: 'Active', description: 'Tosses healing citrus to recover HP.' },
      { name: 'Bubble Shield', type: 'Active', description: 'Creates a protective bubble shield.' },
      { name: 'Trusty Friend', type: 'Passive', description: 'Capybara companion gains combat bonuses.' },
      { name: 'Well-trained', type: 'Passive', description: 'Increases companion damage and durability.' }
    ],
    recommendedSets: ['Fury of Blood'],
    specialWeapon: { name: 'Tender Spirit', description: 'Companion gains additional abilities.' }
  },
  {
    id: 'witch',
    image: '/img/heroes/witch.webp',
    imageUrl: '/img/heroes/witch.webp',
    name: 'Witch',
    faction: 'Horde',
    rarity: 'Mythic',
    role: 'Healer',
    tier: 'B',
    description: 'Dark healer summoning golems while healing allies. Provides ATK buff and stun immunity.',
    skills: [
      { name: 'Dark Healing', type: 'Active', description: 'Heals allies with dark magic.' },
      { name: 'Dread Golem', type: 'Ultimate', description: 'Summons a powerful golem that fears enemies and deals damage.' },
      { name: 'Curse Fire', type: 'Active', description: 'After Dark Healing, grants damage reduction and additional healing.' },
      { name: 'Dark Magic Boost', type: 'Active', description: 'Boosts allies\' ATK and grants temporary stun immunity.' },
      { name: 'Dark Magic Shield', type: 'Passive', description: 'Provides passive defensive bonuses.' },
      { name: 'Guardian Messenger', type: 'Passive', description: 'Increases soldiers\' HP per 1000 deployed.' }
    ],
    recommendedSets: ['Glory of the Knight'],
    specialWeapon: { name: 'Codex of Shadows', description: 'Golem gains additional abilities and fear duration increased.' }
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // HORDE FACTION — Legendary
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'barbarian',
    image: '/img/heroes/barbarian.webp',
    imageUrl: '/img/heroes/barbarian.webp',
    name: 'Barbarian',
    faction: 'Horde',
    rarity: 'Legendary',
    role: 'Tank',
    tier: 'B',
    description: 'Resilient Horde tank with shields, taunts, and team-wide damage reduction.',
    skills: [
      { name: 'Fortified Defense', type: 'Active', description: 'Grants a shield that absorbs incoming damage.' },
      { name: 'Taunt', type: 'Ultimate', description: 'Forces enemies to attack Barbarian instead of allies.' },
      { name: 'Savage Strike', type: 'Active', description: 'Deals damage and stuns enemies.' },
      { name: 'Insatiable Hunger', type: 'Passive', description: 'Increases HP and ATK stats.' },
      { name: 'Horde Defender', type: 'Passive', description: 'Increases damage reduction for all Horde heroes.' }
    ],
    recommendedSets: ['Fury of Blood'],
    specialWeapon: { name: 'Star Breaker', description: 'Shield absorption increased and taunt duration extended.' }
  },
  {
    id: 'headhunter',
    image: '/img/heroes/headhunter.webp',
    imageUrl: '/img/heroes/headhunter.webp',
    name: 'Headhunter',
    faction: 'Horde',
    rarity: 'Legendary',
    role: 'DPS',
    tier: 'C',
    description: 'Pursuit-focused damage dealer with boomerang blades and bounty reward mechanics.',
    skills: [
      { name: 'Menace', type: 'Active', description: 'Intimidates and damages enemies.' },
      { name: 'Pursuit', type: 'Ultimate', description: 'Chases down and eliminates the weakest enemy.' },
      { name: 'Boomerang Blade', type: 'Active', description: 'Throws a boomerang blade hitting multiple targets.' },
      { name: 'Veteran Warrior', type: 'Passive', description: 'Gains combat experience stacks.' },
      { name: 'Bounty Reward', type: 'Passive', description: 'Gains bonuses for each enemy killed.' }
    ]
  },
  {
    id: 'shaman',
    image: '/img/heroes/shaman.webp',
    imageUrl: '/img/heroes/shaman.webp',
    name: 'Shaman',
    faction: 'Horde',
    rarity: 'Legendary',
    role: 'Healer',
    tier: 'B',
    description: 'Totem healer who summons wolves and prevents key hero deaths with possession ultimate.',
    skills: [
      { name: 'Healing Breeze', type: 'Active', description: 'Heals the ally with the lowest HP.' },
      { name: "Ancestor's Soul", type: 'Ultimate', description: 'Possesses the ally with lowest HP, preventing their death.' },
      { name: 'Restorative Totem', type: 'Active', description: 'Summons a healing totem that continuously restores HP.' },
      { name: 'Rain Blessing', type: 'Passive', description: 'Increases the healing effect of all allies.' },
      { name: 'Wolf Soul', type: 'Passive', description: 'Summons 2 wolves to fight alongside team.' }
    ],
    recommendedSets: ['Fury of Blood'],
    specialWeapon: { name: 'Echo of the Mountains', description: 'Totem healing enhanced and wolf damage increased.' }
  },
  {
    id: 'soulmancer',
    image: '/img/heroes/soulmancer.webp',
    imageUrl: '/img/heroes/soulmancer.webp',
    name: 'Soulmancer',
    faction: 'Horde',
    rarity: 'Legendary',
    role: 'Support',
    tier: 'B',
    description: 'Soul linker who absorbs team damage and has a resurrection mechanic with AoE burst.',
    skills: [
      { name: 'Soul Link', type: 'Active', description: 'Links with an ally to share damage and absorb part of it.' },
      { name: 'Soul Recall', type: 'Ultimate', description: 'Upon near-death, deals AoE damage and cannot die for a duration.' },
      { name: 'Soul Freeze', type: 'Active', description: 'Deals damage and may freeze the target.' },
      { name: 'Soul Empowerment', type: 'Passive', description: 'Increases HP of all Horde heroes.' },
      { name: 'Pain Diffusion', type: 'Passive', description: 'Triggers Soul Freeze automatically when HP falls below threshold.' }
    ],
    recommendedSets: ['Fury of Blood'],
    specialWeapon: { name: 'Ascendant', description: 'Soul Link absorption increased and resurrection damage enhanced.' }
  },
  {
    id: 'warlock',
    image: '/img/heroes/warlock.webp',
    imageUrl: '/img/heroes/warlock.webp',
    name: 'Warlock',
    faction: 'Horde',
    rarity: 'Legendary',
    role: 'Support',
    tier: 'B',
    description: 'Dark support with simultaneous damage/heal, team HP buff, enemy debuffs, and attack speed boost.',
    skills: [
      { name: 'Whispered Shadows', type: 'Active', description: 'Deals damage to enemies and heals allies simultaneously.' },
      { name: 'Bloodlust', type: 'Ultimate', description: 'Grants HP drain and boosts allies\' attack speed.' },
      { name: 'Malicious Passion', type: 'Active', description: 'Increases damage of allied Horde heroes.' },
      { name: 'Debilitation', type: 'Active', description: 'Reduces enemies\' skill damage and damage reduction.' },
      { name: 'Shadow Rite', type: 'Passive', description: 'Increases HP of all Horde heroes.' }
    ],
    recommendedSets: ['Glory of the Knight'],
    specialWeapon: { name: 'Cursed Scythe', description: 'Debuffs last longer and Bloodlust ATK speed increased.' }
  },
  {
    id: 'swordmaster',
    image: '/img/heroes/swordmaster.webp',
    imageUrl: '/img/heroes/swordmaster.webp',
    name: 'Swordmaster',
    faction: 'Horde',
    rarity: 'Legendary',
    role: 'Tank',
    tier: 'B',
    description: 'Blade storm tank with AoE damage, a death-prevention passive, and scaling damage when low HP.',
    skills: [
      { name: 'Whirlwind', type: 'Active', description: 'Attacks all surrounding enemies with spinning blade attack.' },
      { name: 'Blade Storm', type: 'Ultimate', description: 'Massive spinning attack dealing heavy AoE damage.' },
      { name: 'Crazy Cut', type: 'Active', description: 'Deals damage and gains damage reduction.' },
      { name: 'Battle Will', type: 'Passive', description: 'Prevents death once by staying at 1 HP.' },
      { name: 'Suppression', type: 'Passive', description: 'Increases damage based on missing HP.' }
    ],
    recommendedSets: ['Fury of Blood'],
    specialWeapon: { name: 'Crimson Sword', description: 'Blade Storm radius increased and death prevention extended.' }
  },
  {
    id: 'wilderness-hunter',
    image: '/img/heroes/wilderness-hunter.webp',
    imageUrl: '/img/heroes/wilderness-hunter.webp',
    name: 'Wilderness Hunter',
    faction: 'Horde',
    rarity: 'Legendary',
    role: 'DPS',
    tier: 'C',
    description: 'Horde ranged DPS with multi-hit attacks, bleeding DoT, and team damage buff.',
    skills: [
      { name: 'Fatal Preyer', type: 'Ultimate', description: 'Deals damage, knocks back enemies, increases ATK.' },
      { name: 'Barb', type: 'Passive', description: 'Increases normal attack count and applies bleeding.' },
      { name: 'Hunter', type: 'Passive', description: 'Increases ATK stat.' },
      { name: 'Tradition', type: 'Passive', description: 'Increases damage of Horde heroes in queue.' },
      { name: 'Impulse Instinct', type: 'Passive', description: 'Increases attack speed.' }
    ],
    recommendedSets: ["Titan's Might"],
    specialWeapon: { name: 'Giant Slayer', description: 'Bleeding damage increased and additional attack procs.' }
  },

  // Horde — Epic
  {
    id: 'outlaw',
    image: '/img/heroes/outlaw.webp',
    imageUrl: '/img/heroes/outlaw.webp',
    name: 'Outlaw',
    faction: 'Horde',
    rarity: 'Epic',
    role: 'Support',
    tier: 'C',
    description: 'Horde support outlaw.'
  },
  {
    id: 'rogue',
    image: '/img/heroes/rogue.webp',
    imageUrl: '/img/heroes/rogue.webp',
    name: 'Rogue',
    faction: 'Horde',
    rarity: 'Epic',
    role: 'DPS',
    tier: 'C',
    description: 'Horde stealth damage dealer.'
  },

  // Horde — Rare
  {
    id: 'blacksmith',
    image: '/img/heroes/blacksmith.webp',
    imageUrl: '/img/heroes/blacksmith.webp',
    name: 'Blacksmith',
    faction: 'Horde',
    rarity: 'Rare',
    role: 'Support',
    tier: 'D',
    description: 'Basic Horde support.'
  },
];

// =============================================================================
// PETS — 11 pets from topheroes1.fandom.com wiki
// 3 Uncommon (no faction), 8 Rare (faction-specific)
// Last updated: February 2026
// =============================================================================

export const PETS: Pet[] = [
  // Uncommon Pets (No Faction)
  {
    id: 'slime',
    name: 'Slime',
    rarity: 'Rare',
    description: 'A cheerful blob that evolves into King Slime. Uncommon pet with no faction affiliation.',
    skillName: 'Bouncy Bash',
    skillDescription: 'Bounces into enemies dealing splash damage.',
    baseInfluence: 500,
    imageUrl: '/img/pets/slime.webp'
  },
  {
    id: 'bunnie',
    name: 'Bunnie',
    rarity: 'Rare',
    description: 'An adorable rabbit that evolves into Buncool. Uncommon pet with no faction affiliation.',
    skillName: 'Carrot Rush',
    skillDescription: 'Dashes forward dealing damage in a line.',
    baseInfluence: 500,
    imageUrl: '/img/pets/bunnie.webp'
  },
  {
    id: 'grubbie',
    name: 'Grubbie',
    rarity: 'Rare',
    description: 'A tiny grub that evolves into Snarluff. Uncommon pet with no faction affiliation.',
    skillName: 'Burrow Strike',
    skillDescription: 'Burrows underground and strikes from below.',
    baseInfluence: 500,
    imageUrl: '/img/pets/grubbie.webp'
  },

  // Rare Pets (Faction-Specific)
  {
    id: 'howli',
    name: 'Howli',
    rarity: 'Rare',
    description: 'A fierce wolf pup that evolves into Razoruff. Horde faction pet providing ATK bonuses.',
    skillName: 'Savage Howl',
    skillDescription: 'Howls to boost allied Horde heroes\' ATK.',
    baseInfluence: 800,
    imageUrl: '/img/pets/howli.webp'
  },
  {
    id: 'cubbly',
    name: 'Cubbly',
    rarity: 'Rare',
    description: 'A gentle bear cub that evolves into Grizzmaw. Nature faction pet providing HP bonuses.',
    skillName: 'Nature\'s Embrace',
    skillDescription: 'Heals nearby Nature heroes over time.',
    baseInfluence: 800,
    imageUrl: '/img/pets/cubbly.webp'
  },
  {
    id: 'zappy',
    name: 'Zappy',
    rarity: 'Rare',
    description: 'An electric critter that evolves into Thundee. League faction pet providing Skill DMG bonuses.',
    skillName: 'Static Shock',
    skillDescription: 'Shocks enemies, briefly stunning them.',
    baseInfluence: 800,
    imageUrl: '/img/pets/zappy.webp'
  },
  {
    id: 'eggy',
    name: 'Eggy',
    rarity: 'Rare',
    description: 'A mysterious egg that evolves into Turkster. League faction pet providing DEF bonuses.',
    skillName: 'Shell Guard',
    skillDescription: 'Creates a protective shell reducing damage taken.',
    baseInfluence: 800,
    imageUrl: '/img/pets/eggy.webp'
  },
  {
    id: 'cactini',
    name: 'Cactini',
    rarity: 'Rare',
    description: 'A spiky cactus pet that evolves into Cactarior. Nature faction pet providing damage reflection.',
    skillName: 'Thorn Volley',
    skillDescription: 'Fires thorns at nearby enemies dealing damage.',
    baseInfluence: 800,
    imageUrl: '/img/pets/cactini.webp'
  },
  {
    id: 'snowpal',
    name: 'Snowpal',
    rarity: 'Rare',
    description: 'A frosty companion that evolves into Snobleman. Nature faction pet providing slow effects.',
    skillName: 'Frostbite',
    skillDescription: 'Chills enemies, reducing their attack speed.',
    baseInfluence: 800,
    imageUrl: '/img/pets/snowpal.webp'
  },
  {
    id: 'flickerkit',
    name: 'Flickerkit',
    rarity: 'Rare',
    description: 'A fiery fox kit that evolves into Burnclaw. Horde faction pet providing burn damage.',
    skillName: 'Ember Dash',
    skillDescription: 'Dashes through enemies leaving a trail of fire.',
    baseInfluence: 800,
    imageUrl: '/img/pets/flickerkit.webp'
  },
  {
    id: 'sproutfang',
    name: 'Sproutfang',
    rarity: 'Rare',
    description: 'A venomous plant pet that evolves into Venomara. Nature faction pet providing poison damage.',
    skillName: 'Toxic Bite',
    skillDescription: 'Bites enemies applying a poison DoT.',
    baseInfluence: 800,
    imageUrl: '/img/pets/sproutfang.webp'
  },
];

// =============================================================================
// RELICS — From topheroes.info Relic Guide
// Faction-specific and Universal relics with Attack/Defense/Assist types
// Last updated: February 2026
// =============================================================================

export const RELICS: Relic[] = [
  // Nature Relics
  {
    id: 'undefeated-crown',
    name: 'Undefeated Crown',
    type: 'Defense',
    rarity: 'Legendary',
    description: 'A crown infused with Nature energy that provides unmatched defensive capabilities.',
    baseInfluence: 1200,
    statBonus: 'HP +15%, DEF +10%, DMG Reduction +5%',
    imageUrl: '/img/relics/undefeated-crown.webp'
  },
  {
    id: 'vineborn-bow',
    name: 'Vineborn Bow',
    type: 'Attack',
    rarity: 'Legendary',
    description: 'A bow woven from living vines that channels Nature\'s offensive power.',
    baseInfluence: 1200,
    statBonus: 'ATK +15%, Crit Rate +8%, Skill DMG +10%',
    imageUrl: '/img/relics/vineborn-bow.webp'
  },
  {
    id: 'sacred-scroll',
    name: 'Sacred Scroll',
    type: 'Assist',
    rarity: 'Legendary',
    description: 'An ancient scroll containing Nature\'s utility secrets.',
    baseInfluence: 1200,
    statBonus: 'Energy Regen +10%, Healing +12%, Skill Haste +8%',
    imageUrl: '/img/relics/sacred-scroll.webp'
  },

  // League Relics
  {
    id: 'petrification-staff',
    name: 'Petrification Staff',
    type: 'Attack',
    rarity: 'Legendary',
    description: 'A League staff that petrifies enemies, controlling the battlefield.',
    baseInfluence: 1200,
    statBonus: 'ATK +12%, Control Duration +15%, Skill DMG +10%',
    imageUrl: '/img/relics/petrification-staff.webp'
  },
  {
    id: 'soul-guard-orb',
    name: 'Soul Guard Orb',
    type: 'Defense',
    rarity: 'Legendary',
    description: 'A League orb that guards the souls of allies, providing defensive buffs.',
    baseInfluence: 1200,
    statBonus: 'HP +12%, DMG Reduction +8%, Shield +10%',
    imageUrl: '/img/relics/soul-guard-orb.webp'
  },
  {
    id: 'feather-of-pact',
    name: 'Feather of Pact',
    type: 'Assist',
    rarity: 'Legendary',
    description: 'A League feather that strengthens pacts between allies.',
    baseInfluence: 1200,
    statBonus: 'Team ATK +8%, Team DEF +5%, Buff Duration +10%',
    imageUrl: '/img/relics/feather-of-pact.webp'
  },

  // Horde Relics
  {
    id: 'frost-diadem',
    name: 'Frost Diadem',
    type: 'Attack',
    rarity: 'Legendary',
    description: 'A Horde crown of ice that stuns and damages enemies.',
    baseInfluence: 1200,
    statBonus: 'ATK +12%, Stun Chance +10%, Crit DMG +15%',
    imageUrl: '/img/relics/frost-diadem.webp'
  },
  {
    id: 'scale-of-injustice',
    name: 'Scale of Injustice',
    type: 'Assist',
    rarity: 'Legendary',
    description: 'A Horde scale that tips battles in your favor through utility effects.',
    baseInfluence: 1200,
    statBonus: 'Debuff Duration +12%, Enemy DEF -8%, Skill Haste +5%',
    imageUrl: '/img/relics/scale-of-injustice.webp'
  },
  {
    id: 'duke-signet',
    name: 'Duke Signet',
    type: 'Defense',
    rarity: 'Legendary',
    description: 'A Horde signet ring of a duke, granting commanding defensive aura.',
    baseInfluence: 1200,
    statBonus: 'HP +10%, DEF +12%, Lifesteal +5%',
    imageUrl: '/img/relics/duke-signet.webp'
  },

  // Universal Relics
  {
    id: 'eternal-wings',
    name: 'Eternal Wings',
    type: 'Assist',
    rarity: 'Mythic',
    description: 'Wings that transcend factions, providing speed and utility to any team.',
    baseInfluence: 1500,
    statBonus: 'ATK SPD +15%, Movement SPD +10%, Energy Regen +8%',
    imageUrl: '/img/relics/eternal-wings.webp'
  },
  {
    id: 'marshals-warhorn',
    name: "Marshal's Warhorn",
    type: 'Assist',
    rarity: 'Mythic',
    description: 'A universal warhorn that rallies all allies regardless of faction.',
    baseInfluence: 1500,
    statBonus: 'Team ATK +10%, Team DEF +8%, Skill Haste +5%',
    imageUrl: '/img/relics/marshals-warhorn.webp'
  },
  {
    id: 'dukes-ring',
    name: "Duke's Ring",
    type: 'Defense',
    rarity: 'Legendary',
    description: 'A universal defensive ring worn by noble commanders.',
    baseInfluence: 1200,
    statBonus: 'HP +12%, DEF +8%, Crit Res +10%',
    imageUrl: '/img/relics/dukes-ring.webp'
  },
  {
    id: 'philosophers-stone',
    name: "Philosopher's Stone",
    type: 'Attack',
    rarity: 'Mythic',
    description: 'The legendary stone that amplifies all damage output.',
    baseInfluence: 1500,
    statBonus: 'ATK +15%, Skill DMG +12%, Crit Rate +8%',
    imageUrl: '/img/relics/philosophers-stone.webp'
  },
  {
    id: 'moonstone',
    name: 'Moonstone',
    type: 'Assist',
    rarity: 'Legendary',
    description: 'A glowing moonstone that provides healing and energy support.',
    baseInfluence: 1200,
    statBonus: 'Healing +12%, Energy Regen +8%, HP +8%',
    imageUrl: '/img/relics/moonstone.webp'
  },
];

// =============================================================================
// SKINS — Castle and March skins
// Last updated: February 2026
// =============================================================================

export const SKINS: Skin[] = [
  // Castle Skins
  {
    id: 'castle-golden-fortress',
    name: 'Golden Fortress',
    type: 'Castle',
    bonus: 'Castle DEF +5%, Troop Training SPD +3%',
    baseInfluence: 800,
    imageUrl: '/img/skins/golden-fortress.webp'
  },
  {
    id: 'castle-dark-citadel',
    name: 'Dark Citadel',
    type: 'Castle',
    bonus: 'Troop ATK +3%, Resource Production +5%',
    baseInfluence: 800,
    imageUrl: '/img/skins/dark-citadel.webp'
  },
  {
    id: 'castle-crystal-palace',
    name: 'Crystal Palace',
    type: 'Castle',
    bonus: 'Research SPD +5%, Construction SPD +3%',
    baseInfluence: 1000,
    imageUrl: '/img/skins/crystal-palace.webp'
  },
  {
    id: 'castle-dragon-keep',
    name: 'Dragon Keep',
    type: 'Castle',
    bonus: 'Troop ATK +5%, March SPD +3%',
    baseInfluence: 1200,
    imageUrl: '/img/skins/dragon-keep.webp'
  },

  // March Skins
  {
    id: 'march-crimson-banner',
    name: 'Crimson Banner',
    type: 'March',
    bonus: 'March ATK +3%, March SPD +2%',
    baseInfluence: 600,
    imageUrl: '/img/skins/crimson-banner.webp'
  },
  {
    id: 'march-frost-legion',
    name: 'Frost Legion',
    type: 'March',
    bonus: 'March DEF +3%, Troop HP +2%',
    baseInfluence: 600,
    imageUrl: '/img/skins/frost-legion.webp'
  },
  {
    id: 'march-golden-vanguard',
    name: 'Golden Vanguard',
    type: 'March',
    bonus: 'March ATK +5%, March Load +5%',
    baseInfluence: 1000,
    imageUrl: '/img/skins/golden-vanguard.webp'
  },
  {
    id: 'march-shadow-strike',
    name: 'Shadow Strike',
    type: 'March',
    bonus: 'March ATK +5%, March SPD +5%',
    baseInfluence: 1200,
    imageUrl: '/img/skins/shadow-strike.webp'
  },
];

// =============================================================================
// EVENTS — Complete event roster
// Last updated: February 2026
// =============================================================================

export const EVENTS: GameEvent[] = [
  // GUILD ARMS RACE - Most important recurring event
  {
    id: 'guild-arms-race',
    image: '/img/heroes/guild-arms-race.webp',
    imageUrl: '/img/heroes/guild-arms-race.webp',
    name: 'Guild Arms Race',
    type: 'Guild',
    scheduleType: 'Weekly-UTC',
    frequency: 'Every Monday 00:00 UTC',
    duration: '6 days (Mon-Sat)',
    nextOccurrence: new Date(Date.UTC(
      new Date().getUTCFullYear(),
      new Date().getUTCMonth(),
      new Date().getUTCDate() + (new Date().getUTCDay() === 0 ? 1 : 8 - new Date().getUTCDay())
    )).toISOString(),
    preparationTime: '1-2 weeks before',
    criticalDays: [4, 6],
    scoringDataKey: 'guild-arms-race',
    description: 'The most important weekly Guild event. Six days of military-themed competitions where guilds battle for Victory Points. Each day requires specific preparation.',
    isActive: true,
    phases: [
      {
        name: "Day 1: Construction Territory (Monday)",
        description: "Points for building upgrades, construction speed-ups, and diamond spending.",
        victoryPoints: 1,
        preparation: [
          "Start 2-3 long building upgrades on Sunday afternoon",
          "Aim for 95% completion by Monday 00:00 UTC",
          "Save construction speed-ups from guild gifts and VIP shop",
          "Stockpile Dragon Essence and Legendary Relic Shards"
        ],
        keyTasks: [
          "Complete all building upgrades you pre-started",
          "Use construction speed-ups immediately",
          "Spend Dragon Essence (3,200 pts each!)",
          "Use Legendary Relic Shards (10,000 pts each!)",
          "Coordinate with guild for simultaneous completions"
        ],
        scoringActions: [
          { action: 'Legendary Relic Shard', points: 10000, unit: 'each', efficiency: 'S' as const, notes: 'Save for GAR over KvK (2x value)' },
          { action: 'Dragon Essence', points: 3200, unit: 'each', efficiency: 'S' as const, notes: '32x more valuable here than Chess War' },
          { action: 'Construction Speedup', points: 30, unit: 'per 1 min', efficiency: 'S' as const },
          { action: 'Building Upgrade Completion', points: 50000, unit: 'varies by level', efficiency: 'A' as const, notes: 'Higher level = more points' },
          { action: 'Diamond Spending', points: 1, unit: 'per diamond', efficiency: 'B' as const }
        ],
        stockpileTargets: [
          { resource: 'Construction Speedups', targetAmount: '500+ minutes', startSavingDays: 7, pointsPerUnit: 30, bestEventDay: 'Day 1' },
          { resource: 'Dragon Essence', targetAmount: '10-50+', startSavingDays: 7, pointsPerUnit: 3200, bestEventDay: 'Day 1-2', alternativeEvent: 'Chess War Phase 1', conflictNote: 'GAR value 32x higher than Chess War' },
          { resource: 'Legendary Relic Shards', targetAmount: '5-20+', startSavingDays: 14, pointsPerUnit: 10000, bestEventDay: 'Day 1-2', alternativeEvent: 'KvK Day 1', conflictNote: 'GAR gives 2x points vs KvK' }
        ],
        doNotDo: [
          "Don't use Dragon Essence outside of GAR — value drops 32x in Chess War",
          "Don't rush buildings early — time completions for Monday 00:00 UTC",
          "Don't spend diamonds on non-point items"
        ],
        exploits: [
          "Pre-queue buildings to 95% completion Sunday evening for instant finish Monday",
          "Dragon Essence + Relic Shards combo can score 50k+ with small stockpile"
        ],
        pointsStrategy: "Relic Shards (10k each) and Dragon Essence (3.2k each) are the highest-value items. Construction Speedups at 30 pts/min are solid filler. Diamond spending is last resort."
      },
      {
        name: "Day 2: Tech Boost (Tuesday)",
        description: "Points for technology research and research speed-ups.",
        victoryPoints: 1,
        preparation: [
          "Start high-level research on Monday evening",
          "Time completion for Tuesday morning",
          "Save Dragon Essence if not used Day 1"
        ],
        keyTasks: [
          "Complete all pre-started research",
          "Focus on military research (more points)",
          "Use research speed-ups aggressively",
          "Start saving stamina for Day 3"
        ],
        scoringActions: [
          { action: 'T5 Military Research Completion', points: 300000, unit: 'per completion', efficiency: 'S' as const, notes: 'Highest single-completion value' },
          { action: 'Dragon Essence', points: 3200, unit: 'each', efficiency: 'S' as const },
          { action: 'Research Speedup', points: 30, unit: 'per 1 min', efficiency: 'S' as const },
          { action: 'T4 Research Completion', points: 100000, unit: 'per completion', efficiency: 'A' as const },
          { action: 'T3 Research Completion', points: 30000, unit: 'per completion', efficiency: 'B' as const }
        ],
        stockpileTargets: [
          { resource: 'Research Speedups', targetAmount: '500+ minutes', startSavingDays: 7, pointsPerUnit: 30, bestEventDay: 'Day 2' }
        ],
        doNotDo: [
          "Don't research economy tech — military gives 2-3x more points",
          "Don't forget to start new research immediately after completing one"
        ],
        exploits: [
          "Pre-start expensive T5 research on Monday, use speedups Tuesday to finish multiple",
          "Dragon Essence also scores here if you saved from Day 1"
        ],
        pointsStrategy: "T5 military research completions are king. Research speedups at 30 pts/min fill gaps. Dragon Essence works here too (3.2k each)."
      },
      {
        name: "Day 3: Global Battles (Wednesday)",
        description: "Points for defeating monsters and boss rallies.",
        victoryPoints: 1,
        preparation: [
          "Save 10-20 stamina potions",
          "Coordinate boss rally schedule with guild",
          "Verify you have 50+ recruitment vouchers for Day 4!"
        ],
        keyTasks: [
          "Use ALL saved stamina potions",
          "Only attack Level 8+ monsters (preferably L10+)",
          "Join EVERY guild boss rally",
          "Help organize rally schedule for max participation"
        ],
        scoringActions: [
          { action: 'Guild Boss Rally', points: 200000, unit: 'per rally (varies)', efficiency: 'S' as const, notes: 'Coordinate with guild for max rallies' },
          { action: 'Monster L15 Kill', points: 150000, unit: 'each', efficiency: 'S' as const },
          { action: 'Monster L10 Kill', points: 40000, unit: 'each', efficiency: 'A' as const },
          { action: 'Monster L8 Kill', points: 15000, unit: 'each', efficiency: 'B' as const },
          { action: 'Stamina Potion', points: 5000, unit: 'each (indirect)', efficiency: 'A' as const, notes: 'Enables more monster kills' }
        ],
        doNotDo: [
          "Don't attack monsters below L8 — terrible points",
          "Don't miss guild boss rallies — they're the highest value",
          "Don't use recruitment vouchers today!"
        ],
        exploits: [
          "Stack stamina potions for 2 weeks before GAR for maximum monster kills",
          "Boss rally timing: schedule rallies every 30 min for sustained scoring"
        ],
        pointsStrategy: "Boss rallies (50k-200k each) and L15 monsters (150k each) are the big scores. Stamina potions fuel the grind."
      },
      {
        name: "Day 4: Call of the Hero (Thursday) - CRITICAL",
        description: "THE MOST IMPORTANT DAY. Awards 2 Victory Points. Recruitment and hero development.",
        victoryPoints: 2,
        preparation: [
          "Save 50-100+ recruitment vouchers (START 1-2 WEEKS EARLY)",
          "Save Universal Mythic hero shards",
          "DO NOT use vouchers on non-Arms Race days!",
          "Save Soul Stones ONLY if KvK is NOT within 2 weeks"
        ],
        keyTasks: [
          "Use ALL vouchers — ONLY 10-pulls (12k pts vs 10k for singles!)",
          "Consume all saved hero shards",
          "Use Recruitment Tokens",
          "Guild-wide participation is critical for VP"
        ],
        scoringActions: [
          { action: '10-Pull Recruitment', points: 12000, unit: 'per 10-pull', efficiency: 'S' as const, notes: '20% bonus over single pulls!' },
          { action: 'Universal Mythic Shard', points: 10000, unit: 'each', efficiency: 'S' as const },
          { action: 'Recruitment Token', points: 1500, unit: 'each', efficiency: 'S' as const },
          { action: 'Single Recruitment', points: 1000, unit: 'each', efficiency: 'B' as const, notes: 'Always do 10-pulls instead' },
          { action: 'Soul Stone', points: 5000, unit: 'each', efficiency: 'A' as const, notes: 'BUT worth 120k in KvK Day 4 — save for KvK!' }
        ],
        stockpileTargets: [
          { resource: 'Recruitment Vouchers', targetAmount: '50-100+', startSavingDays: 14, pointsPerUnit: 1200, bestEventDay: 'Day 4', conflictNote: 'Also high value in KvK Day 4' },
          { resource: 'Recruitment Tokens', targetAmount: '20-50+', startSavingDays: 14, pointsPerUnit: 1500, bestEventDay: 'Day 4' },
          { resource: 'Universal Mythic Shards', targetAmount: '5-10+', startSavingDays: 14, pointsPerUnit: 10000, bestEventDay: 'Day 4' }
        ],
        doNotDo: [
          "NEVER do single pulls — 10-pulls give 20% bonus (12k vs 10k)",
          "Don't use Soul Stones here if KvK is within 2 weeks (worth 120k there vs 5k here)",
          "Don't hoard vouchers past Day 4 — use them ALL"
        ],
        exploits: [
          "10-pull bonus: Always batch pulls for 20% more points",
          "Pre-save 2 weeks of vouchers for 100+ pulls = 120k+ guaranteed",
          "Soul Stone priority: KvK Day 4 (120k) >> GAR Day 4 (5k) — 24x difference"
        ],
        pointsStrategy: "10-pulls at 12k each are the bread and butter. 50 vouchers = 60k pts minimum. Mythic shards at 10k each add up fast. Soul Stones are worth 24x more in KvK!"
      },
      {
        name: "Day 5: Combat Ready (Friday)",
        description: "Points for training troops and speed-ups.",
        victoryPoints: 1,
        preparation: [
          "Stock training resources and food",
          "Ensure Training Grounds MAX LEVEL",
          "Save Pet Food (960 pts per 100!)"
        ],
        keyTasks: [
          "Promote T1->T4 (faster, comparable pts)",
          "Use training speed-ups for multiple batches",
          "Spend Pet Food (960 pts per 100)",
          "Pre-queue soldiers for Day 6 combat"
        ],
        scoringActions: [
          { action: 'Train T5 Troop', points: 100, unit: 'per troop', efficiency: 'S' as const },
          { action: 'Pet Food', points: 960, unit: 'per 100', efficiency: 'A' as const, notes: '64x more value here than Chess War Phase 4' },
          { action: 'Promote T1->T4', points: 65, unit: 'per troop', efficiency: 'A' as const, notes: 'Faster than training T4 fresh' },
          { action: 'Train T4 Troop', points: 50, unit: 'per troop', efficiency: 'A' as const },
          { action: 'Training Speedup', points: 30, unit: 'per 1 min', efficiency: 'S' as const }
        ],
        stockpileTargets: [
          { resource: 'Pet Food', targetAmount: '1000+', startSavingDays: 7, pointsPerUnit: 960, bestEventDay: 'Day 5', alternativeEvent: 'Chess War Phase 4', conflictNote: 'GAR value 64x higher than Chess War' }
        ],
        doNotDo: [
          "Don't train T1-T3 directly — promote from T1 instead",
          "Don't forget Pet Food — it's a hidden high-value resource here"
        ],
        exploits: [
          "Pre-queue T1 troops day before, promote en masse on Day 5 for fast points",
          "Pet Food is 64x more valuable here than in Chess War — always save for GAR"
        ],
        pointsStrategy: "T5 troops at 100 pts each are king. Pet Food at 960/100 is surprisingly valuable. Promotion (T1->T4) at 65 pts is faster than fresh T4 training."
      },
      {
        name: "Day 6: Invincible Warrior (Saturday) - HIGHEST VALUE",
        description: "Awards 4 Victory Points! Combat + healing determines winners. This is make-or-break.",
        victoryPoints: 4,
        preparation: [
          "Buy 5-10x 24-hour shields",
          "Stock healing speed-ups (lots!)",
          "Coordinate guild combat strategy",
          "Pre-position troops for attack"
        ],
        keyTasks: [
          "Attack enemy guild members for kill points",
          "Heal ALL injured troops immediately for heal points",
          "Point farm with friendly guilds if arranged",
          "STOP all combat 20min before event ends"
        ],
        scoringActions: [
          { action: 'Kill T5 Troop', points: 200, unit: 'per troop', efficiency: 'S' as const },
          { action: 'Heal T5 Troop', points: 200, unit: 'per troop', efficiency: 'S' as const },
          { action: 'Kill + Heal Combo', points: 400, unit: 'per T5 troop', efficiency: 'S' as const, notes: 'Attack then immediately heal = DOUBLE points' },
          { action: 'Kill T4 Troop', points: 100, unit: 'per troop', efficiency: 'A' as const },
          { action: 'Heal T4 Troop', points: 100, unit: 'per troop', efficiency: 'A' as const }
        ],
        doNotDo: [
          "DON'T keep fighting in the last 20 minutes — risk losing troops with no time to heal",
          "Don't forget to heal — healing points equal kill points!",
          "Don't attack without shields ready — you'll lose troops and points"
        ],
        exploits: [
          "Kill + Heal combo: Attack enemy, immediately heal your wounded = 400 pts per T5",
          "15-min lockout: Stop combat 15-20 min before end to ensure all heals complete",
          "Friendly guild farming: Coordinate with allies to trade kills for mutual points",
          "Shield cycling: Shield between attack rounds to minimize permanent losses"
        ],
        pointsStrategy: "4 Victory Points! Kill + Heal combo at 400 pts per T5 troop is the meta. Coordinate guild-wide combat for maximum scoring."
      }
    ],
    rewardsHighlight: [
      "Day 4 = 2 VPs, Day 6 = 4 VPs, Other days = 1 VP each",
      "Individual milestone rewards per day",
      "Guild ranking rewards (top 3 guilds)",
      "Total: 10 Victory Points available per week"
    ]
  },

  // Chess War
  {
    id: 'chess-war',
    image: '/img/heroes/chess-war.webp',
    imageUrl: '/img/heroes/chess-war.webp',
    name: 'Chess War',
    type: 'Bi-Weekly',
    scheduleType: 'Bi-Weekly',
    frequency: 'Rotates through 6 phases: Mon-Tue, Wed-Thu, Fri-Sat',
    duration: '2 days per phase',
    scoringDataKey: 'chess-war',
    description: 'Rotating 2-day events cycling through 6 progression focuses. IMPORTANT: Many resources score far less here than in GAR or KvK — check conflict warnings before spending!',
    isActive: true,
    phases: [
      {
        name: "Phase 1: Construction Territory (Mon-Tue)",
        description: "Spend resources and complete bounty quests.",
        keyTasks: ["Complete bounty quests for base points", "Use construction speedups if GAR is 5+ days away", "Check resource conflicts before spending Dragon Essence"],
        scoringActions: [
          { action: 'Dragon Essence', points: 100, unit: 'each', efficiency: 'C' as const, notes: 'Worth 3,200 in GAR — save unless GAR is 5+ days away!' },
          { action: 'Bounty Quest', points: 500, unit: 'each', efficiency: 'B' as const },
          { action: 'Construction Speedup', points: 1, unit: 'per 1 min', efficiency: 'C' as const, notes: 'Worth 30/min in GAR Day 1' }
        ],
        doNotDo: [
          "Don't spend Dragon Essence here if GAR is within 5 days (32x less value!)",
          "Don't use construction speedups if GAR Day 1 is upcoming"
        ]
      },
      {
        name: "Phase 2: Hero Development (Wed-Thu)",
        description: "Consume hero shards and soul stones.",
        keyTasks: ["Use Mythic shards (5k pts each)", "Only use Soul Stones if KvK is 3+ weeks away!"],
        scoringActions: [
          { action: 'Mythic Shard', points: 5000, unit: 'each', efficiency: 'A' as const },
          { action: 'Soul Stone', points: 1500, unit: 'each', efficiency: 'C' as const, notes: 'Worth 120,000 in KvK Day 4 — 80x more! SAVE FOR KVK!' },
          { action: 'Hero Upgrade', points: 1000, unit: 'per level', efficiency: 'B' as const }
        ],
        doNotDo: [
          "NEVER spend Soul Stones here if KvK is within 3 weeks (80x less value!)",
          "Don't use Universal Mythic Shards — save for GAR Day 4 (10k there)"
        ],
        exploits: [
          "Soul Stone priority: KvK Day 4 (120k) >>> GAR Day 4 (5k) >>> Chess War (1.5k)",
          "Only use faction-specific shards you wouldn't save for other events"
        ]
      },
      {
        name: "Phase 3: Decor Upgrade (Fri-Sat)",
        description: "Increase decoration rating.",
        keyTasks: ["Multiple small upgrades", "Focus on cheap decor items first"],
        scoringActions: [
          { action: 'Decor Rating Increase', points: 3, unit: 'per +1 rating', efficiency: 'C' as const },
          { action: 'Decoration Upgrade', points: 500, unit: 'varies', efficiency: 'B' as const }
        ],
        doNotDo: ["Don't over-invest in decor — lowest value Chess War phase"]
      },
      {
        name: "Phase 4: Troop Skin Boost (Mon-Tue)",
        description: "Upgrade troop skins.",
        keyTasks: ["Upgrade Epic/Legendary skins if available", "Save Pet Food for GAR Day 5!"],
        scoringActions: [
          { action: 'Legendary Skin Upgrade', points: 5000, unit: 'each', efficiency: 'A' as const },
          { action: 'Epic Skin Upgrade', points: 2000, unit: 'each', efficiency: 'B' as const },
          { action: 'Pet Food', points: 15, unit: 'per 100', efficiency: 'C' as const, notes: 'Worth 960/100 in GAR Day 5 — 64x more! SAVE!' }
        ],
        doNotDo: [
          "Don't spend Pet Food here — worth 64x more in GAR Day 5!"
        ]
      },
      {
        name: "Phase 5: Relic Race (Wed-Thu)",
        description: "Activate and upgrade Relics.",
        keyTasks: ["Activate Epic+ relics", "Upgrade existing relics", "Save Orichalcum for KvK!"],
        scoringActions: [
          { action: 'Epic Relic Activation', points: 3000, unit: 'each', efficiency: 'A' as const },
          { action: 'Relic Upgrade', points: 1000, unit: 'per level', efficiency: 'B' as const },
          { action: 'Orichalcum', points: 15, unit: 'each', efficiency: 'C' as const, notes: 'Worth 600 in KvK Day 3-4 — 40x more! SAVE!' }
        ],
        doNotDo: [
          "Don't use Orichalcum here if KvK is within 3 weeks (40x less value!)"
        ]
      },
      {
        name: "Phase 6: Gear Trial (Fri-Sat)",
        description: "Upgrade Lord Gear.",
        keyTasks: ["Upgrade Lord Gear pieces", "Use refined metal"],
        scoringActions: [
          { action: 'Lord Gear Upgrade', points: 2000, unit: 'per piece', efficiency: 'B' as const },
          { action: 'Refined Metal', points: 500, unit: 'each', efficiency: 'B' as const },
          { action: 'Orichalcum', points: 15, unit: 'each', efficiency: 'C' as const, notes: 'Save for KvK (40x value)' }
        ],
        doNotDo: [
          "Don't waste Orichalcum here — save for KvK Day 3-4"
        ]
      }
    ],
    rewardsHighlight: ["Tiered rewards: 1k-80k+ Trial Points", "Phase-specific heroes", "Warning: Many resources are worth 10-80x MORE in other events!"]
  },

  // KvK
  {
    id: 'kingdom-vs-kingdom',
    image: '/img/heroes/kingdom-vs-kingdom.webp',
    imageUrl: '/img/heroes/kingdom-vs-kingdom.webp',
    name: 'Kingdom vs Kingdom (KvK)',
    type: 'Server War',
    scheduleType: 'Manual',
    frequency: 'Monthly',
    duration: '8 days total (5 prep + war)',
    scoringDataKey: 'kingdom-vs-kingdom',
    criticalDays: [4],
    description: 'Server vs server war. 5-day preparation phase determines damage buffs for the 4-hour war day. Day 4 features the SOUL STONE EXPLOIT — 120,000 points per Soul Stone!',
    isActive: false,
    preparationTime: '3 weeks before',
    phases: [
      {
        name: "KvK Day 1: Construction",
        description: "Construction and building upgrades contribute to server-wide prep score.",
        victoryPoints: 1,
        keyTasks: ["Use construction speedups (30 pts/min)", "Complete building upgrades", "Use Legendary Relic Shards (5k each)"],
        scoringActions: [
          { action: 'Construction Speedup', points: 30, unit: 'per 1 min', efficiency: 'S' as const },
          { action: 'Legendary Relic Shard', points: 5000, unit: 'each', efficiency: 'A' as const, notes: 'Worth 10k in GAR Day 1 — use here only if no GAR soon' },
          { action: 'Building Completion', points: 50000, unit: 'varies', efficiency: 'A' as const }
        ],
        doNotDo: ["Don't use Legendary Relic Shards if GAR is within 5 days (2x less value here)"]
      },
      {
        name: "KvK Day 2: Research",
        description: "Research completions and speedups boost server prep.",
        victoryPoints: 1,
        keyTasks: ["Use research speedups (30 pts/min)", "Complete military research"],
        scoringActions: [
          { action: 'Research Speedup', points: 30, unit: 'per 1 min', efficiency: 'S' as const },
          { action: 'T5 Military Research', points: 300000, unit: 'per completion', efficiency: 'S' as const }
        ]
      },
      {
        name: "KvK Day 3: Power Up",
        description: "Various power-up activities including gear and relic upgrades.",
        victoryPoints: 1,
        keyTasks: ["Use Orichalcum (600 pts each!)", "Upgrade gear and relics"],
        scoringActions: [
          { action: 'Orichalcum', points: 600, unit: 'each', efficiency: 'A' as const, notes: '40x more valuable here than Chess War' },
          { action: 'Gear Upgrade', points: 2000, unit: 'per piece', efficiency: 'B' as const }
        ],
        stockpileTargets: [
          { resource: 'Orichalcum', targetAmount: '50-200+', startSavingDays: 14, pointsPerUnit: 600, bestEventDay: 'Day 3-4', alternativeEvent: 'Chess War Phase 5-6', conflictNote: 'KvK value 40x higher than Chess War' }
        ]
      },
      {
        name: "KvK Day 4: Hero Development - MEGA VALUE",
        description: "THE most valuable prep day. Soul Stones are worth 120,000 POINTS EACH — the highest single-item value in the entire game!",
        victoryPoints: 2,
        keyTasks: [
          "USE ALL SOUL STONES — 120,000 pts EACH!",
          "Use Mythic Shards (10k each)",
          "Use Recruitment Tokens (1.5k each)",
          "This single day can determine server victory!"
        ],
        scoringActions: [
          { action: 'Soul Stone', points: 120000, unit: 'each', efficiency: 'S' as const, notes: 'THE most valuable single-item scoring in the entire game! 80x Chess War value!' },
          { action: 'Mythic Shard', points: 10000, unit: 'each', efficiency: 'S' as const },
          { action: 'Recruitment Token', points: 1500, unit: 'each', efficiency: 'A' as const },
          { action: 'Orichalcum', points: 600, unit: 'each', efficiency: 'A' as const }
        ],
        stockpileTargets: [
          { resource: 'Soul Stones', targetAmount: '5-20+', startSavingDays: 21, pointsPerUnit: 120000, bestEventDay: 'Day 4', alternativeEvent: 'Chess War Phase 2', conflictNote: 'KvK value is 80x Chess War — ALWAYS save for KvK!' },
          { resource: 'Mythic Shards', targetAmount: '10-30+', startSavingDays: 14, pointsPerUnit: 10000, bestEventDay: 'Day 4' }
        ],
        doNotDo: [
          "NEVER use Soul Stones outside KvK Day 4 — they're worth 80x more here than Chess War!",
          "Don't forget Orichalcum — still worth 600 pts each here"
        ],
        exploits: [
          "Soul Stone stockpiling: Start 3 weeks early. Each stone = 120k points — even 5 stones = 600k!",
          "Cross-event priority: Soul Stones (KvK 120k) >>> GAR Day 4 (5k) >>> Chess War (1.5k)",
          "Coordinate server-wide: All members burning Soul Stones on Day 4 can swing the prep outcome"
        ]
      },
      {
        name: "KvK Day 5: Military",
        description: "Troop training and military preparation for war day.",
        victoryPoints: 1,
        keyTasks: ["Train T5 troops (100 pts each)", "Use training speedups"],
        scoringActions: [
          { action: 'Train T5 Troop', points: 100, unit: 'per troop', efficiency: 'A' as const },
          { action: 'Training Speedup', points: 30, unit: 'per 1 min', efficiency: 'A' as const }
        ]
      },
      {
        name: "War Day: Royal Castle Siege",
        description: "4-hour all-out server war. Prep day performance determines damage buffs (+3-5%).",
        keyTasks: [
          "Control Magic Tower for 2+ hours",
          "Follow rally leaders — coordination is everything",
          "Use shields between fight rounds",
          "Focus fire on enemy structures"
        ],
        scoringActions: [
          { action: 'Castle Control', points: 500000, unit: 'per hour', efficiency: 'S' as const },
          { action: 'Rally Participation', points: 50000, unit: 'per rally', efficiency: 'S' as const },
          { action: 'Troop Kill', points: 200, unit: 'per T5', efficiency: 'A' as const }
        ],
        exploits: [
          "Prep day wins give +3-5% damage buff — can decide the war",
          "Magic Tower control for 2+ hours = massive point swing",
          "Shield cycling between rally waves to preserve troops"
        ]
      }
    ],
    rewardsHighlight: [
      "Exclusive throne skins",
      "Massive Mythic shards",
      "Server damage buffs (+3-5%)",
      "Day 4 Soul Stone exploit: 120k pts each!"
    ]
  },

  // Guild Race
  {
    id: 'guild-race',
    name: 'Guild Race',
    type: 'Guild',
    frequency: 'Weekly',
    scoringDataKey: 'guild-race',
    description: 'Weekly guild competition where guilds race to complete task objectives. Task rarity determines honor points — always prioritize Legendary tasks.',
    isActive: true,
    phases: [
      {
        name: "Guild Race Tasks",
        description: "Complete tasks of varying rarity for honor points. Higher rarity = more points.",
        keyTasks: ["Prioritize Legendary tasks (300 honor)", "Complete Epic tasks (150 honor)", "Fill remaining slots with Rare tasks (50 honor)"],
        scoringActions: [
          { action: 'Legendary Task', points: 300, unit: 'honor', efficiency: 'S' as const, notes: 'Always prioritize these' },
          { action: 'Epic Task', points: 150, unit: 'honor', efficiency: 'A' as const },
          { action: 'Rare Task', points: 50, unit: 'honor', efficiency: 'B' as const },
          { action: 'Common Task', points: 10, unit: 'honor', efficiency: 'C' as const, notes: 'Skip if possible' }
        ],
        doNotDo: ["Don't waste slots on Common tasks", "Don't complete tasks that conflict with GAR resource saving"]
      }
    ],
    rewardsHighlight: ["Guild ranking rewards", "Speed-ups", "Resources"]
  },

  // Frostfield Battle
  {
    id: 'frostfield-battle',
    name: 'Frostfield Battle',
    type: 'PvP',
    frequency: 'Periodic',
    scoringDataKey: 'frostfield-battle',
    description: 'PvP battle on a frozen battlefield. Key mechanic: Supply Box collection windows (1,800 pts per box, 7 windows total). Territory capture and lord kills add bonus points.',
    isActive: false,
    phases: [
      {
        name: "Frostfield Supply & Combat",
        description: "Collect supply boxes at timed windows and engage in PvP combat.",
        keyTasks: ["Collect ALL supply boxes (1,800 pts each)", "Don't miss any of the 7 collection windows", "Capture territories between windows"],
        scoringActions: [
          { action: 'Supply Box Collection', points: 1800, unit: 'per box', efficiency: 'S' as const, notes: '7 collection windows — never miss one!' },
          { action: 'Territory Capture', points: 500, unit: 'varies', efficiency: 'A' as const },
          { action: 'Enemy Lord Kill', points: 500, unit: 'each', efficiency: 'B' as const }
        ],
        exploits: [
          "Set timers for all 7 supply box windows — missing one costs 1,800 pts",
          "Territory capture between collection windows maximizes total score"
        ]
      }
    ],
    rewardsHighlight: ["Exclusive frost items", "Hero shards", "Resources"]
  },

  // Mine Vein Battle
  {
    id: 'mine-vein-battle',
    name: 'Mine Vein Battle',
    type: 'PvP',
    frequency: 'Periodic',
    description: 'Compete with other players to control valuable mine veins. Defend your mines while attacking others.',
    isActive: false,
    rewardsHighlight: ["Mining resources", "Rare materials", "Speed-ups"]
  },

  // Citadel Clash
  {
    id: 'citadel-clash',
    name: 'Citadel Clash',
    type: 'Guild',
    frequency: 'Periodic',
    description: 'Guild vs Guild citadel siege event. Coordinate attacks and defenses to conquer enemy citadels.',
    isActive: false,
    rewardsHighlight: ["Citadel rewards", "Guild ranking bonuses", "Hero shards"]
  },

  // Guild Rush
  {
    id: 'guild-rush',
    name: 'Guild Rush',
    type: 'Guild',
    frequency: 'Periodic',
    description: 'Guild speed event where members rush to complete objectives within a time limit for team rewards.',
    isActive: false,
    rewardsHighlight: ["Guild tokens", "Speed-ups", "Resources"]
  },

  // Daily/Regular events
  {
    id: 'arena',
    image: '/img/heroes/arena.webp',
    imageUrl: '/img/heroes/arena.webp',
    name: 'Arena',
    type: 'Daily',
    frequency: 'Daily reset 00:00 UTC',
    description: 'Daily PvP battles for ranking rewards.',
    isActive: true,
    rewardsHighlight: ["Arena tokens", "Hero shards"]
  },
  {
    id: 'ancient-battlefield',
    image: '/img/heroes/ancient-battlefield.webp',
    imageUrl: '/img/heroes/ancient-battlefield.webp',
    name: 'Ancient Battlefield',
    type: 'Guild',
    frequency: 'Weekly',
    scoringDataKey: 'ancient-battlefield',
    description: 'Guild vs Guild 20v20 battles with stage progression. Mana Mine control is the #1 priority — it provides sustained point generation throughout the match.',
    isActive: false,
    phases: [
      {
        name: "Ancient Battlefield Strategy",
        description: "Capture Mana Mines for sustained scoring, progress through stages for bonus points.",
        keyTasks: ["Capture and hold Mana Mines (priority #1)", "Progress through stages for milestone points", "Coordinate 20-man team composition"],
        scoringActions: [
          { action: 'Mana Mine Control', points: 1000, unit: 'per tick (sustained)', efficiency: 'S' as const, notes: 'Priority #1 — provides continuous point generation' },
          { action: 'Stage Progression', points: 5000, unit: 'per stage', efficiency: 'A' as const },
          { action: 'Kill Score', points: 200, unit: 'per kill', efficiency: 'B' as const }
        ],
        exploits: [
          "Mana Mine control is the single most important objective — assign dedicated defenders",
          "Stage progression milestones provide burst points to supplement Mine income"
        ]
      }
    ],
    rewardsHighlight: ["Points-based rewards", "Guild ranking bonuses"]
  },
  {
    id: 'glory-battlefield',
    image: '/img/heroes/glory-battlefield.webp',
    imageUrl: '/img/heroes/glory-battlefield.webp',
    name: 'Glory Battlefield',
    type: 'PvP Arena',
    frequency: 'Multiple weekly',
    scoringDataKey: 'glory-battlefield',
    description: 'Non-guild 5v5 PvP with capture point mechanics. Facility control provides time-based scoring — hold points to win.',
    isActive: false,
    phases: [
      {
        name: "Glory Battlefield Tactics",
        description: "Capture and hold facilities for time-based scoring. Kills provide supplementary points.",
        keyTasks: ["Capture facilities and defend them", "Hold capture points for sustained scoring", "Focus on facility effects for team advantage"],
        scoringActions: [
          { action: 'Facility Capture Hold', points: 100, unit: 'per second held', efficiency: 'A' as const },
          { action: 'Facility Effect Bonus', points: 500, unit: 'varies by facility', efficiency: 'A' as const, notes: 'Different facilities grant different team effects' },
          { action: 'Kill Assist', points: 50, unit: 'each', efficiency: 'B' as const }
        ],
        exploits: [
          "Facility holding time is more valuable than chasing kills",
          "Different facilities have different effects — learn which ones benefit your comp"
        ]
      }
    ],
    rewardsHighlight: ["Victory/defeat rewards", "PvP ranking points"]
  },
  {
    id: 'dark-invasion',
    image: '/img/heroes/dark-invasion.webp',
    imageUrl: '/img/heroes/dark-invasion.webp',
    name: 'Dark Legion Invasion',
    type: 'PvE',
    frequency: 'Periodic',
    description: 'Hunt Yetis for Dark Medals.',
    isActive: false,
    rewardsHighlight: ["Dark Medals shop", "Lootbox tokens"]
  },
  {
    id: 'daily-bounties',
    image: '/img/heroes/daily-bounties.webp',
    imageUrl: '/img/heroes/daily-bounties.webp',
    name: 'Daily Bounties',
    type: 'Daily',
    frequency: 'Daily reset',
    description: 'Daily quest rewards.',
    isActive: true,
    rewardsHighlight: ["Resources", "Hero EXP"]
  },
  {
    id: 'guild-boss',
    image: '/img/heroes/guild-boss.webp',
    imageUrl: '/img/heroes/guild-boss.webp',
    name: 'Guild Boss',
    type: 'Guild',
    frequency: 'Multiple daily',
    description: 'Cooperative guild boss raids.',
    isActive: true,
    rewardsHighlight: ["Damage ranking rewards"]
  }
];

// =============================================================================
// GIFT CODES — 26 active codes + tracked expired codes
// Sources: pocketgamer.com, progameguides.com, topheroes.info
// Last updated: February 2026
// =============================================================================

export const GIFT_CODES: GiftCode[] = [
  // Active Codes (February 2026)
  { code: 'BABB8D0B8C', rewards: 'Diamonds, Speed-ups, Resources', isActive: true, addedDate: '2026-02-01' },
  { code: 'D2B95BF63', rewards: 'Diamonds, Speed-ups, Resources', isActive: true, addedDate: '2026-01-15' },
  { code: 'DB70EAC6B', rewards: 'Diamonds, Speed-ups, Resources', isActive: true, addedDate: '2026-01-15' },
  { code: '71FD831C6', rewards: 'Diamonds, Speed-ups, Resources', isActive: true, addedDate: '2026-01-15' },
  { code: 'THKR2026', rewards: 'Korean New Year Rewards', isActive: true, addedDate: '2026-01-25' },
  { code: 'THJP2026', rewards: 'Japanese New Year Rewards', isActive: true, addedDate: '2026-01-01' },
  { code: 'B356D783FF', rewards: 'Diamonds, Speed-ups', isActive: true, addedDate: '2025-12-20' },
  { code: 'HalloweenAwakens', rewards: 'Halloween Event Rewards', isActive: true, addedDate: '2025-10-31' },
  { code: '4AFCE82C', rewards: 'Diamonds, Resources', isActive: true, addedDate: '2025-10-15' },
  { code: '3D8AF500', rewards: 'Diamonds, Resources', isActive: true, addedDate: '2025-10-01' },
  { code: '2025TOPHEROES', rewards: 'New Year 2025 Celebration Pack', isActive: true, addedDate: '2025-01-01' },
  { code: 'GOLDENMOON2025', rewards: 'Mid-Autumn Festival Rewards', isActive: true, addedDate: '2025-09-15' },
  { code: 'TH2gether', rewards: 'Community Event Rewards', isActive: true, addedDate: '2025-08-01' },
  { code: 'TopHeroesTurn2', rewards: '2nd Anniversary Rewards', isActive: true, addedDate: '2025-07-15' },
  { code: 'TwoTHYears', rewards: '2nd Anniversary Bonus', isActive: true, addedDate: '2025-07-15' },
  { code: 'obon2025', rewards: 'Obon Festival Rewards', isActive: true, addedDate: '2025-08-15' },
  { code: 'TOPLOVE5000', rewards: 'Community Milestone Rewards', isActive: true, addedDate: '2025-06-01' },
  { code: 'TopHeroes20M', rewards: '20M Downloads Celebration', isActive: true, addedDate: '2025-05-01' },
  { code: 'TopHeroes2025', rewards: 'New Year 2025 Pack', isActive: true, addedDate: '2025-01-01' },
  { code: 'SerpentTH', rewards: 'Year of the Serpent Rewards', isActive: true, addedDate: '2025-01-29' },
  { code: 'EAA924CB', rewards: 'Diamonds, Speed-ups', isActive: true, addedDate: '2025-03-01' },
  { code: 'JingleBellSTH', rewards: 'Christmas 2025 Rewards', isActive: true, addedDate: '2025-12-25' },
  { code: 'MistletoETH', rewards: 'Christmas Mistletoe Pack', isActive: true, addedDate: '2025-12-20' },
  { code: 'THSnowMan', rewards: 'Winter Event Rewards', isActive: true, addedDate: '2025-12-15' },
  { code: 'TH777', rewards: 'Lucky 777 Rewards', isActive: true, addedDate: '2025-11-01' },
  { code: 'TopHeroes2024', rewards: 'Legacy Rewards', isActive: true, addedDate: '2024-01-01' },

  // Recently Expired Codes
  { code: 'BLOSSOMSHADOW', rewards: 'Spring Event Rewards', isActive: false, addedDate: '2025-03-01' },
  { code: 'THMerrYXmaS', rewards: 'Holiday Rewards', isActive: false, addedDate: '2024-12-25' },
  { code: 'ReinDeERTH', rewards: 'Reindeer Holiday Pack', isActive: false, addedDate: '2024-12-20' },
  { code: 'CAndyCAneTH', rewards: 'Candy Cane Rewards', isActive: false, addedDate: '2024-12-15' },
  { code: 'NORUMORS', rewards: 'Community Event', isActive: false, addedDate: '2024-11-01' },
  { code: 'THANKS2025', rewards: 'Thanksgiving Rewards', isActive: false, addedDate: '2025-11-28' },
];

export const FACTION_COLORS: Record<Faction, string> = {
  Nature: 'text-nature-light border-nature',
  League: 'text-league-light border-league',
  Horde: 'text-horde-light border-horde',
};

export const FACTION_BG: Record<Faction, string> = {
  Nature: 'bg-nature-bg',
  League: 'bg-league-bg',
  Horde: 'bg-horde-bg',
};
