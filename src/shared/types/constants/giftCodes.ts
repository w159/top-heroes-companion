import { GiftCode } from '../types';

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
