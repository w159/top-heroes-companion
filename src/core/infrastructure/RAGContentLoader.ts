/**
 * Infrastructure Layer - RAG Content Loader
 * Loads and indexes content from /rag-content directory
 */

import { DocumentChunk } from '../domain/interfaces';

export class RAGContentLoader {
  /**
   * Load all RAG content from the /rag-content directory
   * In production, this would dynamically import markdown files
   */
  static async loadAllContent(): Promise<DocumentChunk[]> {
    const chunks: DocumentChunk[] = [];

    // Hero content
    chunks.push(...this.createHeroChunks());

    // Team composition content
    chunks.push(...this.createTeamChunks());

    // Gear and equipment content
    chunks.push(...this.createGearChunks());

    // Pet content
    chunks.push(...this.createPetChunks());

    // Relic content
    chunks.push(...this.createRelicChunks());

    // Strategy and mechanics content
    chunks.push(...this.createStrategyChunks());

    // Progression content
    chunks.push(...this.createProgressionChunks());

    // Event content
    chunks.push(...this.createEventChunks());

    return chunks;
  }

  private static createHeroChunks(): DocumentChunk[] {
    return [
      {
        id: 'hero_tidecaller',
        content: `Tidecaller is the supreme support hero in Nature faction. S-Tier rating. Role: Support/Healer. Skills: Tidal Wave (Ultimate) deals 320% ATK damage and stuns all enemies for 2.5s. Soothing Mist heals lowest HP ally for 210% ATK and grants 15% damage reduction. Ocean's Blessing increases energy regen for all allies by 10%. Best gear: Guardian and Sage sets. Essential for any Nature team composition. Pairs excellently with Altar Marshal (HP +10% bond) and Monk (DEF +8% bond). Recommended pet: Cactini for sustain scaling.`,
        source: 'heroes/tidecaller.md',
        category: 'heroes',
        metadata: { faction: 'Nature', tier: 'S', priority: 'high' },
      },
      {
        id: 'hero_pyromancer',
        content: `Pyromancer is the essential early-game carry for League faction. S-Tier DPS hero. Max Meteor Blaze skill first for devastating AoE damage. Use Glory of the Knight gear for +8% skill damage bonus. Awaken to Tier 2 early for major power spike. Pair with Secret Keeper for shields. Best pet: Eggy for critical rate buffs. Pyromancer's burst damage makes her ideal for both PvE and PvP content.`,
        source: 'heroes/pyromancer.md',
        category: 'heroes',
        metadata: { faction: 'League', tier: 'S', priority: 'high' },
      },
      {
        id: 'hero_wanderer',
        content: `Wanderer is the main DPS carry for Horde faction despite being classified as Tank. Use Titan's Might gear for flat attack scaling. Dragon's Might relics are essential. Pair with Desert Prince as main tank. Best pets: Flickerkit (BiS) or Howli (F2P option). Horde builds are slower but Wanderer's late-game damage is unmatched. Focus all resources on Wanderer first.`,
        source: 'heroes/wanderer.md',
        category: 'heroes',
        metadata: { faction: 'Horde', tier: 'S', priority: 'high' },
      },
    ];
  }

  private static createTeamChunks(): DocumentChunk[] {
    return [
      {
        id: 'team_nature_meta',
        content: `Best Nature Team Composition: Front line: Altar Marshal (main tank) + Monk (off-tank/dodge). Middle line: Petalis + Tidecaller (essential support). Back line: Pixie (DPS carry) + Forest Maiden. Use Oath of Sacred Forest relic set across the team. Cactini pet is mandatory. Nature excels at sustain and outlasting enemies. Awakening priority: Pixie → Tidecaller → Altar Marshal.`,
        source: 'meta/teams.md',
        category: 'team_composition',
        metadata: { faction: 'Nature', priority: 'high' },
      },
      {
        id: 'team_league_meta',
        content: `Best League Team Composition: Front: Adjudicator + Rose Princess (tanks). Middle: Paragon (buffer) + Bishop (healer). Back: Pyromancer (main DPS) + Nun (CC/support). Use Arcane Vault relics. Eggy pet for crit buffs. League dominates with skill damage and crowd control. Awakening priority: Pyromancer → Nun → Adjudicator.`,
        source: 'meta/teams.md',
        category: 'team_composition',
        metadata: { faction: 'League', priority: 'high' },
      },
      {
        id: 'team_horde_meta',
        content: `Best Horde Team Composition: Front: Beastmaster + Desert Prince (dual tanks). Middle: Wanderer (main DPS) + Soulmancer (debuffer). Back: Storm Maiden + Witch (AoE damage). Use Dragon's Might relics. Flickerkit or Howli pet. Horde = raw damage, excellent for PvE/bosses. Awakening priority: Wanderer → Beastmaster → Storm Maiden.`,
        source: 'meta/teams.md',
        category: 'team_composition',
        metadata: { faction: 'Horde', priority: 'high' },
      },
    ];
  }

  private static createGearChunks(): DocumentChunk[] {
    return [
      {
        id: 'gear_sets',
        content: `Gear Sets Guide: Knight (Glory of the Knight): +40% ATK, +80% HP, +8% Skill Damage - best for skill-based DPS heroes like Pyromancer. Blood (Fury of Blood): +160% HP, +6% Damage Reduction - ideal for tanks and healers. Titan (Titan's Might): +80% ATK, +6% Damage - for flat attack scalers like Wanderer. Always match gear to hero role for maximum efficiency.`,
        source: 'gear/sets.md',
        category: 'gear',
        metadata: { priority: 'high' },
      },
    ];
  }

  private static createPetChunks(): DocumentChunk[] {
    return [
      {
        id: 'pet_priorities',
        content: `Pet Priority Guide: League - Eggy (Critical Rate buffs, essential for burst). Nature - Cactini (best sustain scaling, synergizes with heals). Horde - Flickerkit (BiS) or Howli (F2P alternative). Key tip: Focus 100% of Pet Food on ONE pet matching your main faction. Level to 120+ for Mythic promotion. Never split resources between multiple pets early game.`,
        source: 'pets/guide.md',
        category: 'pets',
        metadata: { priority: 'high' },
      },
    ];
  }

  private static createRelicChunks(): DocumentChunk[] {
    return [
      {
        id: 'relic_sets',
        content: `Relic Sets by Faction: Nature - Oath of Sacred Forest (Survival + CC bonuses). League - Arcane Vault (Control + Skill Damage). Horde - Dragon's Might (Raw Damage increase). Strategy: Max ONE relic at a time for star bonuses. 5-star Epic beats 1-star Legendary. Prioritize your main faction's set.`,
        source: 'relics/guide.md',
        category: 'relics',
        metadata: { priority: 'high' },
      },
    ];
  }

  private static createStrategyChunks(): DocumentChunk[] {
    return [
      {
        id: 'f2p_strategy',
        content: `F2P Strategy Guide: 1. Save diamonds for events only (never random summons). 2. Pick ONE faction and focus entirely on it. 3. League is easiest to start. 4. Join active guild ASAP (requires Castle level 7). 5. Don't invest in Rare heroes. 6. Use all resources during events for double value. 7. Rush Castle to level 25 for important unlocks. Patience and focus are key to F2P success.`,
        source: 'progression/f2p.md',
        category: 'strategy',
        metadata: { priority: 'high' },
      },
      {
        id: 'awakening_system',
        content: `Awakening System: Requires 5-star Legendary hero (11 total stars). 4 tiers to full Mythic status. Total cost: 9 Soul Stones + ~115 hero copies. Each faction has specific Soul Stones. Priority order: Awaken main DPS first - usually Pyromancer (League), Pixie (Nature), or Warlock (Horde). Massive power spike at each tier.`,
        source: 'mechanics/awakening.md',
        category: 'mechanics',
        metadata: { priority: 'high' },
      },
    ];
  }

  private static createProgressionChunks(): DocumentChunk[] {
    return [
      {
        id: 'early_game',
        content: `Early Game Guide (Castle 1-15): Focus on one faction team. Complete all daily quests. Join guild at Castle 7. Save diamonds for summoning events. Don't waste resources on Rare heroes. Gear priority: Get full sets even if lower quality. Pet: Choose faction-matching pet and commit. Push main campaign for resource unlocks.`,
        source: 'progression/early_game.md',
        category: 'progression',
        metadata: { priority: 'high' },
      },
    ];
  }

  private static createEventChunks(): DocumentChunk[] {
    return [
      {
        id: 'event_strategy',
        content: `Event Strategy: Always participate in summoning events for bonus rewards. Save diamonds for 2-3 weeks before events. Heroic Summon Events give best value. Don't chase top ranks unless whale. Aim for milestone rewards (better ROI). Complete daily event tasks for accumulation. Events are the fastest way to progress as F2P.`,
        source: 'events/guide.md',
        category: 'events',
        metadata: { priority: 'high' },
      },
    ];
  }
}
