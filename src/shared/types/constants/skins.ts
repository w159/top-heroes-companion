import { Skin } from '../types';

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
