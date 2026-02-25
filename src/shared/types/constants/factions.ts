import { Faction } from '../types';

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
