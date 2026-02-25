import { GameEvent } from '../types';

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
