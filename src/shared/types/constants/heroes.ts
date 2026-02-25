import { Hero } from '../types';

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
