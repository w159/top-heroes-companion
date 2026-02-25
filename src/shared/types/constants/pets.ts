import { Pet } from '../types';

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
