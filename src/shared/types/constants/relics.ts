import { Relic } from '../types';

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
