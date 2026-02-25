// =============================================================================
// Event Scoring Data - Top Heroes Companion
// Structured scoring tables, stockpile plans, and resource priority data
// =============================================================================

import { ScoringAction, StockpileItem, EfficiencyTier } from '../shared/types/types';

// -----------------------------------------------------------------------------
// Resource Priority Interface
// -----------------------------------------------------------------------------

export interface ResourcePriority {
  resource: string;
  bestEvent: string;
  bestEventDay: string;
  bestPoints: number;
  bestUnit: string;
  alternativeEvent?: string;
  alternativeDay?: string;
  alternativePoints?: number;
  alternativeUnit?: string;
  multiplier?: string;
}

// -----------------------------------------------------------------------------
// Resource Conflict Interface (returned by getResourceConflicts)
// -----------------------------------------------------------------------------

export interface ResourceConflict {
  resource: string;
  events: {
    eventId: string;
    day: string;
    pointsPerUnit: number;
    unit: string;
  }[];
  recommendation: string;
}

// -----------------------------------------------------------------------------
// Event Day Interface
// -----------------------------------------------------------------------------

export interface EventDay {
  day: string;
  name: string;
  victoryPoints?: number;
  note?: string;
  actions: ScoringAction[];
}

// -----------------------------------------------------------------------------
// 1. EVENT_SCORING - Record keyed by event ID
// -----------------------------------------------------------------------------

export const EVENT_SCORING: Record<string, EventDay[]> = {

  // ===========================================================================
  // GUILD ARMS RACE (6 days)
  // ===========================================================================
  'guild-arms-race': [
    {
      day: '1',
      name: 'Construction Territory',
      victoryPoints: 1,
      actions: [
        { action: 'Construction speedup', points: 30, unit: 'per 1 min', efficiency: 'S' },
        { action: 'Building upgrade completion', points: 0, unit: 'varies by level', efficiency: 'A', notes: 'Points scale with building level' },
        { action: 'Diamond spending', points: 1, unit: 'per diamond', efficiency: 'B' },
        { action: 'Dragon Essence', points: 3200, unit: 'each', efficiency: 'S' },
        { action: 'Legendary Relic Shards', points: 10000, unit: 'each', efficiency: 'S' },
      ],
    },
    {
      day: '2',
      name: 'Tech Boost',
      victoryPoints: 1,
      actions: [
        { action: 'Research speedup', points: 30, unit: 'per 1 min', efficiency: 'S' },
        { action: 'T5 military research completion', points: 150000, unit: '150k-300k per completion', efficiency: 'S' },
        { action: 'T4 research completion', points: 50000, unit: '50k-100k per completion', efficiency: 'A' },
        { action: 'Dragon Essence', points: 3200, unit: 'each', efficiency: 'S' },
      ],
    },
    {
      day: '3',
      name: 'Global Battles',
      victoryPoints: 1,
      actions: [
        { action: 'Monster L15 kill', points: 150000, unit: 'per kill', efficiency: 'S' },
        { action: 'Monster L10 kill', points: 40000, unit: 'per kill', efficiency: 'A' },
        { action: 'Monster L8 kill', points: 15000, unit: 'per kill', efficiency: 'B' },
        { action: 'Guild Boss Rally', points: 50000, unit: '50k-200k per rally', efficiency: 'S' },
        { action: 'Stamina Potion usage', points: 5000, unit: 'each', efficiency: 'A' },
      ],
    },
    {
      day: '4',
      name: 'Call of the Hero',
      victoryPoints: 2,
      note: 'CRITICAL - Double VP day',
      actions: [
        { action: '10-pull recruitment', points: 12000, unit: 'per 10-pull', efficiency: 'S', notes: '20% bonus over singles' },
        { action: 'Single recruitment', points: 1000, unit: 'each', efficiency: 'B' },
        { action: 'Universal Mythic Shard', points: 10000, unit: 'each', efficiency: 'S' },
        { action: 'Soul Stone usage', points: 0, unit: 'varies', efficiency: 'A', notes: 'Points vary by hero rarity' },
        { action: 'Recruitment Token', points: 1500, unit: 'each', efficiency: 'S' },
      ],
    },
    {
      day: '5',
      name: 'Combat Ready',
      victoryPoints: 1,
      actions: [
        { action: 'T5 troop training', points: 100, unit: 'per troop', efficiency: 'S' },
        { action: 'T4 troop training', points: 50, unit: 'per troop', efficiency: 'A' },
        { action: 'T1 to T4 promotion', points: 65, unit: 'total per promotion', efficiency: 'A', notes: 'Faster than training T4 fresh' },
        { action: 'Training speedup', points: 30, unit: 'per 1 min', efficiency: 'S' },
        { action: 'Pet Food', points: 960, unit: 'per 100', efficiency: 'A' },
      ],
    },
    {
      day: '6',
      name: 'Invincible Warrior',
      victoryPoints: 4,
      note: 'HIGHEST VALUE - 4 VP day',
      actions: [
        { action: 'Kill T5 troop', points: 200, unit: 'per troop', efficiency: 'S' },
        { action: 'Heal T5 troop', points: 200, unit: 'per troop', efficiency: 'S' },
        { action: 'Kill T4 troop', points: 100, unit: 'per troop', efficiency: 'A' },
        { action: 'Heal T4 troop', points: 100, unit: 'per troop', efficiency: 'A' },
        { action: 'Kill+Heal combo', points: 400, unit: 'per T5 troop cycle', efficiency: 'S', notes: 'Attack then immediately heal for 2x' },
      ],
    },
  ],

  // ===========================================================================
  // CHESS WAR (6 phases)
  // ===========================================================================
  'chess-war': [
    {
      day: 'Phase 1',
      name: 'Construction Territory',
      actions: [
        { action: 'Dragon Essence', points: 3200, unit: 'each', efficiency: 'A', notes: 'Save for GAR Day 1-2 if within 3 days' },
        { action: 'Bounty Quest completion', points: 500, unit: 'each', efficiency: 'B' },
        { action: 'Construction speedup', points: 100, unit: 'per 1 min', efficiency: 'C', notes: 'Much less value than GAR' },
      ],
    },
    {
      day: 'Phase 2',
      name: 'Hero Development',
      actions: [
        { action: 'Mythic Shard', points: 5000, unit: 'each', efficiency: 'A' },
        { action: 'Soul Stone', points: 1500, unit: 'each', efficiency: 'B', notes: 'Save for KvK Day 4 - worth 120k there!' },
        { action: 'Hero upgrade', points: 1000, unit: 'per level', efficiency: 'B' },
      ],
    },
    {
      day: 'Phase 3',
      name: 'Decor Upgrade',
      actions: [
        { action: 'Decor Rating +1', points: 3, unit: 'Trial pts per +1 rating', efficiency: 'C' },
        { action: 'Multiple small upgrades', points: 0, unit: 'varies', efficiency: 'B', notes: 'Many small upgrades recommended over one large' },
      ],
    },
    {
      day: 'Phase 4',
      name: 'Troop Skin Boost',
      actions: [
        { action: 'Legendary skin upgrade', points: 5000, unit: 'each', efficiency: 'A' },
        { action: 'Epic skin upgrade', points: 2000, unit: 'each', efficiency: 'B' },
        { action: 'Pet Food', points: 15, unit: 'per 100', efficiency: 'C', notes: 'Terrible value - save for GAR Day 5' },
      ],
    },
    {
      day: 'Phase 5',
      name: 'Relic Race',
      actions: [
        { action: 'Epic Relic activation', points: 3000, unit: 'each', efficiency: 'A' },
        { action: 'Relic upgrade', points: 1000, unit: 'per level', efficiency: 'B' },
        { action: 'Orichalcum usage', points: 15, unit: 'each', efficiency: 'C', notes: 'Save for KvK Day 3-4 - worth 600 there' },
      ],
    },
    {
      day: 'Phase 6',
      name: 'Gear Trial',
      actions: [
        { action: 'Lord Gear upgrade', points: 2000, unit: 'per piece', efficiency: 'B' },
        { action: 'Orichalcum', points: 15, unit: 'each', efficiency: 'C' },
        { action: 'Refined Metal', points: 500, unit: 'each', efficiency: 'B' },
      ],
    },
  ],

  // ===========================================================================
  // KINGDOM VS KINGDOM (5 prep days + war)
  // ===========================================================================
  'kvk': [
    {
      day: '1',
      name: 'Construction',
      actions: [
        { action: 'Construction speedup', points: 30, unit: 'per 1 min', efficiency: 'S' },
        { action: 'Legendary Relic Shards', points: 5000, unit: 'each', efficiency: 'A' },
      ],
    },
    {
      day: '2',
      name: 'Research',
      actions: [
        { action: 'Research speedup', points: 30, unit: 'per 1 min', efficiency: 'S' },
      ],
    },
    {
      day: '3',
      name: 'Power Up',
      actions: [
        { action: 'Orichalcum', points: 600, unit: 'each', efficiency: 'A' },
        { action: 'Various upgrade materials', points: 0, unit: 'varies', efficiency: 'B', notes: 'General power-up materials' },
      ],
    },
    {
      day: '4',
      name: 'Hero Development',
      victoryPoints: undefined,
      note: 'MEGA VALUE - Highest single-item scoring in the game',
      actions: [
        { action: 'Soul Stone', points: 120000, unit: 'each', efficiency: 'S', notes: 'THE most valuable single-item scoring in the game' },
        { action: 'Mythic Shards', points: 10000, unit: 'each', efficiency: 'S' },
        { action: 'Recruitment Tokens', points: 1500, unit: 'each', efficiency: 'A' },
      ],
    },
    {
      day: '5',
      name: 'Military',
      actions: [
        { action: 'T5 troop training', points: 100, unit: 'per troop', efficiency: 'A', notes: 'Similar to GAR Day 5' },
        { action: 'T4 troop training', points: 50, unit: 'per troop', efficiency: 'A' },
        { action: 'Training speedup', points: 30, unit: 'per 1 min', efficiency: 'A' },
      ],
    },
    {
      day: 'War',
      name: 'War Day',
      actions: [
        { action: 'Combat performance', points: 0, unit: 'varies', efficiency: 'S', notes: 'Based on kills, rallies, and objectives' },
        { action: 'Rally participation', points: 0, unit: 'varies', efficiency: 'S' },
      ],
    },
  ],

  // ===========================================================================
  // GUILD RACE
  // ===========================================================================
  'guild-race': [
    {
      day: 'All',
      name: 'Task Completion',
      actions: [
        { action: 'Legendary Task completion', points: 300, unit: 'honor', efficiency: 'S' },
        { action: 'Epic Task completion', points: 150, unit: 'honor', efficiency: 'A' },
        { action: 'Rare Task completion', points: 50, unit: 'honor', efficiency: 'B' },
        { action: 'Common Task completion', points: 10, unit: 'honor', efficiency: 'C' },
      ],
    },
  ],

  // ===========================================================================
  // FROSTFIELD BATTLE
  // ===========================================================================
  'frostfield-battle': [
    {
      day: 'All',
      name: 'Frostfield Battle',
      actions: [
        { action: 'Supply Box collection', points: 1800, unit: 'each', efficiency: 'S', notes: '7 collection windows total' },
        { action: 'Territory capture', points: 0, unit: 'varies', efficiency: 'A', notes: 'Points vary by territory value' },
        { action: 'Enemy Lord kill', points: 500, unit: 'per kill', efficiency: 'B' },
      ],
    },
  ],

  // ===========================================================================
  // ANCIENT BATTLEFIELD
  // ===========================================================================
  'ancient-battlefield': [
    {
      day: 'All',
      name: 'Ancient Battlefield',
      actions: [
        { action: 'Mana Mine capture', points: 0, unit: 'priority #1', efficiency: 'S', notes: 'Capture and hold mana mines first' },
        { action: 'Stage progression', points: 0, unit: 'varies', efficiency: 'A' },
        { action: 'Kill score', points: 0, unit: 'varies', efficiency: 'B' },
      ],
    },
  ],

  // ===========================================================================
  // GLORY BATTLEFIELD
  // ===========================================================================
  'glory-battlefield': [
    {
      day: 'All',
      name: 'Glory Battlefield',
      actions: [
        { action: 'Facility capture scoring', points: 0, unit: 'varies', efficiency: 'A' },
        { action: 'Kill assists', points: 50, unit: 'per assist', efficiency: 'B' },
        { action: 'Capture point holding', points: 0, unit: 'time-based', efficiency: 'A', notes: 'Points accumulate over time held' },
      ],
    },
  ],
} as const satisfies Record<string, EventDay[]>;

// -----------------------------------------------------------------------------
// 2. STOCKPILE_PLANS - Record keyed by event ID
// -----------------------------------------------------------------------------

export const STOCKPILE_PLANS: Record<string, StockpileItem[]> = {

  // ===========================================================================
  // GUILD ARMS RACE - Stockpile
  // ===========================================================================
  'guild-arms-race': [
    {
      resource: 'Construction Speedups',
      targetAmount: '500+ minutes',
      startSavingDays: 7,
      pointsPerUnit: 30,
      bestEventDay: 'Day 1',
    },
    {
      resource: 'Research Speedups',
      targetAmount: '500+ minutes',
      startSavingDays: 7,
      pointsPerUnit: 30,
      bestEventDay: 'Day 2',
    },
    {
      resource: 'Stamina Potions',
      targetAmount: '10-20+',
      startSavingDays: 5,
      pointsPerUnit: 5000,
      bestEventDay: 'Day 3',
    },
    {
      resource: 'Recruitment Tokens',
      targetAmount: '50-100+',
      startSavingDays: 14,
      pointsPerUnit: 1500,
      bestEventDay: 'Day 4',
      conflictNote: 'Also high value in KvK Day 4',
    },
    {
      resource: 'Dragon Essence',
      targetAmount: '10-50+',
      startSavingDays: 7,
      pointsPerUnit: 3200,
      bestEventDay: 'Day 1-2',
      alternativeEvent: 'Chess War Phase 1',
      conflictNote: 'GAR value 32x higher than Chess War',
    },
    {
      resource: 'Legendary Relic Shards',
      targetAmount: '5-20+',
      startSavingDays: 14,
      pointsPerUnit: 10000,
      bestEventDay: 'Day 1-2',
      alternativeEvent: 'KvK Day 1',
      conflictNote: 'GAR gives 2x points vs KvK',
    },
    {
      resource: 'Pet Food',
      targetAmount: '1000+',
      startSavingDays: 7,
      pointsPerUnit: 960,
      bestEventDay: 'Day 5',
      alternativeEvent: 'Chess War Phase 4',
      conflictNote: 'GAR value 64x higher than Chess War',
    },
  ],

  // ===========================================================================
  // KVK - Stockpile
  // ===========================================================================
  'kvk': [
    {
      resource: 'Soul Stones',
      targetAmount: '5-20+',
      startSavingDays: 21,
      pointsPerUnit: 120000,
      bestEventDay: 'Day 4',
      alternativeEvent: 'Chess War Phase 2',
      conflictNote: 'KvK value is 80x Chess War \u2014 ALWAYS save for KvK',
    },
    {
      resource: 'Orichalcum',
      targetAmount: '50-200+',
      startSavingDays: 14,
      pointsPerUnit: 600,
      bestEventDay: 'Day 3-4',
      alternativeEvent: 'Chess War Phase 5-6',
      conflictNote: 'KvK value 40x higher than Chess War',
    },
  ],
} as const satisfies Record<string, StockpileItem[]>;

// -----------------------------------------------------------------------------
// 3. RESOURCE_PRIORITY_TABLE
// -----------------------------------------------------------------------------

export const RESOURCE_PRIORITY_TABLE: ResourcePriority[] = [
  {
    resource: 'Soul Stones',
    bestEvent: 'KvK',
    bestEventDay: 'Day 4',
    bestPoints: 120000,
    bestUnit: 'each',
    alternativeEvent: 'Chess War',
    alternativeDay: 'Hero Development',
    alternativePoints: 1500,
    alternativeUnit: 'each',
    multiplier: '80x better',
  },
  {
    resource: 'Legendary Relic Shards',
    bestEvent: 'Guild Arms Race',
    bestEventDay: 'Day 1-2',
    bestPoints: 10000,
    bestUnit: 'each',
    alternativeEvent: 'KvK',
    alternativeDay: 'Day 1',
    alternativePoints: 5000,
    alternativeUnit: 'each',
    multiplier: '2x better',
  },
  {
    resource: 'Dragon Essence',
    bestEvent: 'Guild Arms Race',
    bestEventDay: 'Day 1-2',
    bestPoints: 3200,
    bestUnit: 'each',
    alternativeEvent: 'Chess War',
    alternativeDay: 'Construction',
    alternativePoints: 100,
    alternativeUnit: 'each',
    multiplier: '32x better',
  },
  {
    resource: 'Recruitment Tokens',
    bestEvent: 'Guild Arms Race',
    bestEventDay: 'Day 4',
    bestPoints: 1500,
    bestUnit: 'each',
    alternativeEvent: 'KvK',
    alternativeDay: 'Day 4',
    alternativePoints: 1500,
    alternativeUnit: 'each',
  },
  {
    resource: 'Pet Food',
    bestEvent: 'Guild Arms Race',
    bestEventDay: 'Day 5',
    bestPoints: 960,
    bestUnit: 'per 100',
    alternativeEvent: 'Chess War',
    alternativeDay: 'Troop Skin',
    alternativePoints: 15,
    alternativeUnit: 'per 100',
    multiplier: '64x better',
  },
  {
    resource: 'Orichalcum',
    bestEvent: 'KvK',
    bestEventDay: 'Day 3-4',
    bestPoints: 600,
    bestUnit: 'each',
    alternativeEvent: 'Chess War',
    alternativeDay: 'Gear Trial',
    alternativePoints: 15,
    alternativeUnit: 'each',
    multiplier: '40x better',
  },
  {
    resource: 'Construction Speedups',
    bestEvent: 'Guild Arms Race',
    bestEventDay: 'Day 1',
    bestPoints: 30,
    bestUnit: 'per min',
    alternativeEvent: 'KvK',
    alternativeDay: 'Day 1',
    alternativePoints: 30,
    alternativeUnit: 'per min',
  },
  {
    resource: 'Research Speedups',
    bestEvent: 'Guild Arms Race',
    bestEventDay: 'Day 2',
    bestPoints: 30,
    bestUnit: 'per min',
    alternativeEvent: 'KvK',
    alternativeDay: 'Day 2',
    alternativePoints: 30,
    alternativeUnit: 'per min',
  },
] as const satisfies ResourcePriority[];

// -----------------------------------------------------------------------------
// 4. getEventScoring - Lookup scoring data by event ID
// -----------------------------------------------------------------------------

export function getEventScoring(eventId: string): EventDay[] | undefined {
  return EVENT_SCORING[eventId];
}

// -----------------------------------------------------------------------------
// 5. getStockpilePlan - Lookup stockpile plan by event ID
// -----------------------------------------------------------------------------

export function getStockpilePlan(eventId: string): StockpileItem[] | undefined {
  return STOCKPILE_PLANS[eventId];
}

// -----------------------------------------------------------------------------
// 6. getResourceConflicts - Find resources shared across upcoming events
// -----------------------------------------------------------------------------

/**
 * Analyzes upcoming events and identifies resources that appear in multiple
 * events, returning point comparisons and recommendations for optimal usage.
 *
 * @param upcomingEvents - Array of event IDs (e.g., ['guild-arms-race', 'kvk'])
 * @returns Array of ResourceConflict objects describing shared resources
 */
export function getResourceConflicts(upcomingEvents: string[]): ResourceConflict[] {
  // Build a map of resource -> event appearances with point data
  const resourceMap = new Map<
    string,
    { eventId: string; day: string; pointsPerUnit: number; unit: string }[]
  >();

  for (const eventId of upcomingEvents) {
    // Check stockpile plans for resource data
    const stockpile = STOCKPILE_PLANS[eventId];
    if (stockpile) {
      for (const item of stockpile) {
        const entries = resourceMap.get(item.resource) ?? [];
        entries.push({
          eventId,
          day: item.bestEventDay,
          pointsPerUnit: item.pointsPerUnit,
          unit: 'each',
        });
        resourceMap.set(item.resource, entries);

        // Also track the alternative event if it is in the upcoming list
        if (item.alternativeEvent) {
          const altEventId = Object.keys(EVENT_SCORING).find((key) => {
            const scoring = EVENT_SCORING[key];
            return scoring.some(
              (phase) =>
                phase.name.toLowerCase().includes(item.alternativeEvent!.toLowerCase().split(' ').pop()!) ||
                item.alternativeEvent!.toLowerCase().includes(key)
            );
          });
          if (altEventId && upcomingEvents.includes(altEventId)) {
            // Find alternative points from scoring data
            const altScoring = EVENT_SCORING[altEventId];
            for (const phase of altScoring) {
              const matchingAction = phase.actions.find(
                (a) => a.action.toLowerCase().includes(item.resource.toLowerCase().split(' ')[0]!)
              );
              if (matchingAction && matchingAction.points > 0) {
                const existing = entries.find((e) => e.eventId === altEventId);
                if (!existing) {
                  entries.push({
                    eventId: altEventId,
                    day: phase.day,
                    pointsPerUnit: matchingAction.points,
                    unit: matchingAction.unit ?? 'each',
                  });
                }
              }
            }
          }
        }
      }
    }
  }

  // Also scan the RESOURCE_PRIORITY_TABLE for additional cross-event conflicts
  for (const priority of RESOURCE_PRIORITY_TABLE) {
    const matchingEvents = upcomingEvents.filter((eventId) => {
      const eventName = eventId.replace(/-/g, ' ');
      return (
        priority.bestEvent.toLowerCase().includes(eventName) ||
        eventName.includes(priority.bestEvent.toLowerCase().replace(/\s+/g, '-')) ||
        (priority.alternativeEvent &&
          (priority.alternativeEvent.toLowerCase().includes(eventName) ||
            eventName.includes(priority.alternativeEvent.toLowerCase().replace(/\s+/g, '-'))))
      );
    });

    if (matchingEvents.length >= 2) {
      const existing = resourceMap.get(priority.resource);
      if (!existing || existing.length < 2) {
        const entries: { eventId: string; day: string; pointsPerUnit: number; unit: string }[] = [];
        for (const eventId of matchingEvents) {
          const eventName = eventId.replace(/-/g, ' ');
          if (
            priority.bestEvent.toLowerCase().includes(eventName) ||
            eventName.includes(priority.bestEvent.toLowerCase().replace(/\s+/g, '-'))
          ) {
            entries.push({
              eventId,
              day: priority.bestEventDay,
              pointsPerUnit: priority.bestPoints,
              unit: priority.bestUnit,
            });
          } else if (priority.alternativeEvent && priority.alternativePoints) {
            entries.push({
              eventId,
              day: priority.alternativeDay ?? 'Unknown',
              pointsPerUnit: priority.alternativePoints,
              unit: priority.alternativeUnit ?? 'each',
            });
          }
        }
        if (entries.length >= 2) {
          resourceMap.set(priority.resource, entries);
        }
      }
    }
  }

  // Convert to conflicts (only resources appearing in 2+ events)
  const conflicts: ResourceConflict[] = [];

  for (const [resource, events] of resourceMap) {
    if (events.length < 2) continue;

    // Deduplicate by eventId
    const uniqueEvents = new Map<string, (typeof events)[0]>();
    for (const event of events) {
      const existing = uniqueEvents.get(event.eventId);
      if (!existing || event.pointsPerUnit > existing.pointsPerUnit) {
        uniqueEvents.set(event.eventId, event);
      }
    }

    if (uniqueEvents.size < 2) continue;

    const eventList = Array.from(uniqueEvents.values());
    const sorted = [...eventList].sort((a, b) => b.pointsPerUnit - a.pointsPerUnit);
    const best = sorted[0]!;
    const secondBest = sorted[1]!;

    let recommendation: string;
    if (best.pointsPerUnit === secondBest.pointsPerUnit) {
      recommendation = `${resource}: Equal value in both events (${best.pointsPerUnit} pts). Use in whichever event you need more points.`;
    } else {
      const ratio = Math.round(best.pointsPerUnit / secondBest.pointsPerUnit);
      recommendation = `${resource}: Save for ${best.eventId} ${best.day} (${best.pointsPerUnit} pts vs ${secondBest.pointsPerUnit} pts in ${secondBest.eventId} - ${ratio}x better).`;
    }

    conflicts.push({
      resource,
      events: eventList,
      recommendation,
    });
  }

  // Sort by the magnitude of difference (highest-impact conflicts first)
  conflicts.sort((a, b) => {
    const aRatio = a.events.length > 1
      ? Math.max(...a.events.map((e) => e.pointsPerUnit)) / Math.min(...a.events.map((e) => e.pointsPerUnit))
      : 1;
    const bRatio = b.events.length > 1
      ? Math.max(...b.events.map((e) => e.pointsPerUnit)) / Math.min(...b.events.map((e) => e.pointsPerUnit))
      : 1;
    return bRatio - aRatio;
  });

  return conflicts;
}
