# Event Strategy Optimizer Guide

## Overview

The Event Strategy Optimizer is an intelligent system that analyzes game events and provides data-driven recommendations for optimal participation. It uses multi-objective optimization to balance reward maximization with effort minimization, helping players make informed decisions about event participation.

## Features

### 1. **Intelligent Event Analysis** 🎯

Analyzes each event across multiple dimensions:
- **Reward Structure**: Rank-based, milestone, and exclusive rewards
- **Competition Level**: Server-wide vs cross-server, expected participants
- **Resource Requirements**: Gold, gems, consumables, hero requirements
- **Time Investment**: Total hours needed and daily commitment
- **Player Readiness**: Power level, hero roster, resource availability

### 2. **Multi-Objective Optimization** ⚖️

Balances competing objectives:
- **Maximize Rewards**: Higher ranks = better rewards
- **Minimize Effort**: Lower time and resource investment
- **Optimize ROI**: Best return on investment (reward value per hour)
- **Risk Management**: Confidence-based targeting with fallback options

### 3. **Rank Prediction** 📊

Predicts achievable ranks based on:
- Player power level vs event requirements
- Historical performance data
- Competition difficulty and level
- Time and resource investment
- Meta analysis and trends

### 4. **Participation Strategies** 🎮

Four participation levels:
- **Maximal**: Top ranks (1-50), high effort, best rewards
- **Moderate**: Mid ranks (51-500), balanced approach
- **Minimal**: Participation rewards only, low effort
- **Skip**: Not worth participating, focus elsewhere

### 5. **Multi-Event Planning** 📅

Optimizes across multiple concurrent events:
- **Conflict Detection**: Identifies time and resource conflicts
- **Priority Assignment**: Ranks events by importance and ROI
- **Resource Allocation**: Distributes resources optimally
- **Schedule Creation**: Plans participation timeline
- **Feasibility Analysis**: Validates plan viability

## Usage Examples

### Basic Event Strategy

```typescript
import { optimizeEventStrategy } from './src/engine/eventStrategyOptimizer';
import { GameEvent, PlayerState } from './src/types/strategic';

// Define event
const serverBattle: GameEvent = {
  id: 'sb_2026_01',
  name: 'Server Battle: Winter Championship',
  type: 'server_battle',
  difficulty: 'hard',
  startDate: new Date('2026-01-20'),
  endDate: new Date('2026-01-22'),
  duration: 48, // hours
  minPowerLevel: 1000000,
  minCastleLevel: 40,
  expectedParticipants: 5000,
  serverWide: false,
  crossServer: true,
  rewards: {
    participation: { gold: 100000, gems: 50 },
    milestone: [
      { points: 1000, rewards: { gold: 50000, gems: 25 } },
      { points: 5000, rewards: { gold: 100000, gems: 50 } },
    ],
    ranking: [
      { minRank: 1, maxRank: 1, rewards: { gold: 1000000, gems: 5000 } },
      { minRank: 2, maxRank: 10, rewards: { gold: 500000, gems: 2000 } },
      { minRank: 11, maxRank: 50, rewards: { gold: 250000, gems: 1000 } },
      { minRank: 51, maxRank: 100, rewards: { gold: 150000, gems: 500 } },
    ],
    exclusive: [],
  },
  tags: ['pvp', 'cross-server'],
  priority: 9,
};

// Player state
const player: PlayerState = {
  userId: 'player123',
  server: 'S431',
  powerLevel: 1500000,
  castleLevel: 45,
  spendProfile: 'F2P',
  vipLevel: 8,
  daysSinceStart: 120,
  resources: {
    gold: 5000000,
    gems: 10000,
    // ... other resources
  },
  ownedHeroes: [
    // ... hero roster
  ],
  focusedHeroes: ['tidecaller', 'flamebringer', 'shadowstalker'],
  goals: {
    shortTerm: 'Increase power to 2M',
    longTerm: 'Top 100 server ranking',
  },
  // ... other player data
};

// Get optimized strategy
const strategy = optimizeEventStrategy(serverBattle, player);

console.log(`
Event: ${strategy.event.name}
Recommendation: ${strategy.participation}
Target Rank: ${strategy.targetRank}
Expected Rewards: ${JSON.stringify(strategy.expectedRewards)}
Time Investment: ${strategy.requiredEffort.timeInvestment} hours
ROI: ${strategy.roi.toFixed(1)} value/hour
Confidence: ${strategy.confidenceScore}%

Reasoning: ${strategy.reasoning}

Recommendations:
${strategy.recommendations.map(r => `- ${r.action}`).join('\n')}

Preparation Steps:
${strategy.preparationSteps.map(s => `${s.step}. ${s.title} (${s.timeRequired}h)`).join('\n')}
`);
```

### Example Output

```
Event: Server Battle: Winter Championship
Recommendation: moderate
Target Rank: 50
Expected Rewards: {"gold":250000,"gems":1000,"soulStones":50}
Time Investment: 18.5 hours
ROI: 67.2 value/hour
Confidence: 72%

Reasoning: Target rank 50 offers rewards worth 1243 value for 18.5 hours of effort (ROI: 67.2). Confidence in achieving this rank: 72%. Good return on investment - recommended for most players.

Recommendations:
- Begin preparation 2 days before event starts
- Prepare your strongest 5 heroes: tidecaller, flamebringer, shadowstalker, ironguard, stormcaller
- Allocate 2.3 hours per day
- Reserve 500 gems for event refreshes
- Focus effort in the final 1 days

Preparation Steps:
1. Acquire required resources (0.8h)
2. Strengthen hero team (0.6h)
3. Review event mechanics (1h)
4. Final readiness check (0.5h)
```

### Multi-Event Optimization

```typescript
import { optimizeMultiEventStrategy } from './src/engine/eventStrategyOptimizer';

// Multiple concurrent/upcoming events
const events: GameEvent[] = [
  serverBattle,
  towerRush,
  bossRaid,
  treasureHunt,
];

// Optimize across all events
const timeframe = {
  start: new Date('2026-01-20'),
  end: new Date('2026-01-27'),
};

const multiStrategy = optimizeMultiEventStrategy(events, player, timeframe);

console.log(`
Multi-Event Plan (${multiStrategy.timeframe.days} days)

Selected Events: ${multiStrategy.selectedEvents.length}
${multiStrategy.selectedEvents.map(s => 
  `- ${s.event.name}: Target rank ${s.targetRank} (${s.requiredEffort.timeInvestment}h)`
).join('\n')}

Skipped Events: ${multiStrategy.skippedEvents.length}
${multiStrategy.skippedEvents.map(e => 
  `- ${e.event.name}: ${e.reason}`
).join('\n')}

Total Resources Needed:
- Gold: ${multiStrategy.totalResourcesNeeded.gold}
- Gems: ${multiStrategy.totalResourcesNeeded.gems}

Total Time: ${multiStrategy.totalTimeRequired} hours
Overall ROI: ${multiStrategy.overallROI.toFixed(1)} value/hour
Feasibility: ${multiStrategy.feasibility}%

Conflicts Detected: ${multiStrategy.conflicts.length}
${multiStrategy.conflicts.map(c => `- ${c.description}`).join('\n')}
`);
```

## Algorithm Details

### Multi-Objective Optimization

The optimizer uses a weighted scoring system:

```typescript
Score = (
  ROI * 0.35 +
  Confidence * 0.25 +
  Priority * 0.20 +
  (100 - Effort) * 0.20
)
```

Where:
- **ROI**: Reward value per hour (0-100 scale)
- **Confidence**: Probability of achieving target rank (0-100%)
- **Priority**: Event importance (0-100)
- **Effort**: Time investment (inverted, lower is better)

### Rank Difficulty Multipliers

Effort scales exponentially with target rank:

| Target Rank | Multiplier | Typical Time |
|------------|------------|--------------|
| 1          | 5.0x       | 50+ hours    |
| 2-3        | 3.5x       | 35+ hours    |
| 4-10       | 2.5x       | 25+ hours    |
| 11-50      | 2.0x       | 20+ hours    |
| 51-100     | 1.5x       | 15+ hours    |
| 101-500    | 1.2x       | 12+ hours    |
| 500+       | 1.0x       | 10+ hours    |

### Confidence Calculation

Confidence factors:
- **Power Ratio**: Player power vs minimum requirement
  - ≥2.0x: +30 confidence
  - ≥1.5x: +20 confidence
  - ≥1.2x: +10 confidence
  - <1.2x: -10 confidence

- **Historical Performance**: Based on past event ranks
  - Better than average: +10-15 confidence
  - Below target: -5 to -15 confidence

- **Competition Level**:
  - Extreme: -15 confidence
  - Hard: -10 confidence
  - Easy: +10 confidence

- **Rank Difficulty**:
  - Rank 1: -30 confidence
  - Rank 2-3: -20 confidence
  - Rank 4-10: -10 confidence

### ROI Calculation

```typescript
ROI = Total Reward Value / Time Investment (hours)

Reward Value = (
  Gold * 0.001 +
  Gems * 1.0 +
  Soul Stones * 50 +
  Skill Books * 2 +
  Trait Stones * 3 +
  ... // Other resources weighted by rarity
)
```

ROI Interpretation:
- **≥100**: Exceptional - highest priority
- **50-99**: Excellent - highly recommended
- **25-49**: Good - recommended
- **10-24**: Moderate - consider if resources allow
- **<10**: Poor - likely not worth effort

## Event Types

### 1. Server Battle (Cross-Server PvP)
- **Duration**: 2-3 days
- **Typical Effort**: 20-50 hours
- **Best For**: Competitive players with strong teams
- **Key Factor**: Hero power and PvP strategy

### 2. Tower Rush (Faction Tower Climbing)
- **Duration**: 1-2 days
- **Typical Effort**: 10-20 hours
- **Best For**: Players with diverse faction heroes
- **Key Factor**: Faction coverage and synergy

### 3. Boss Raid (Guild Boss Battles)
- **Duration**: 1 day
- **Typical Effort**: 5-15 hours
- **Best For**: Guild-focused players
- **Key Factor**: DPS optimization and coordination

### 4. Treasure Hunt (Resource Gathering)
- **Duration**: 3-5 days
- **Typical Effort**: 8-20 hours
- **Best For**: Resource-hungry F2P players
- **Key Factor**: Consistency and gem efficiency

### 5. Hero Trial (Hero-Specific Challenges)
- **Duration**: 2-3 days
- **Typical Effort**: 12-25 hours
- **Best For**: Players with featured heroes
- **Key Factor**: Specific hero investment

### 6. Season Event (Limited-Time Seasonal)
- **Duration**: 7-14 days
- **Typical Effort**: 20-60 hours
- **Best For**: All players (best ROI typically)
- **Key Factor**: Long-term planning and resource management

### 7. Guild War (Guild vs Guild)
- **Duration**: 2-3 days
- **Typical Effort**: 25-40 hours
- **Best For**: Competitive guilds
- **Key Factor**: Team coordination and strategy

### 8. Arena Tournament (PvP Tournament)
- **Duration**: 1 day
- **Typical Effort**: 15-30 hours
- **Best For**: PvP specialists
- **Key Factor**: Arena team strength and META knowledge

### 9. Campaign Blitz (Campaign Speed Runs)
- **Duration**: 1 day
- **Typical Effort**: 5-10 hours
- **Best For**: Early/mid game players
- **Key Factor**: Campaign progress and hero levels

### 10. Collection Event (Hero Collection Missions)
- **Duration**: 7 days
- **Typical Effort**: 10-25 hours
- **Best For**: Collectors and completionists
- **Key Factor**: Hero diversity and completeness

## Participation Strategies

### Maximal Participation

**When to Choose:**
- High ROI (≥50 value/hour)
- High confidence (≥70%)
- Top reward tier includes exclusive items
- Event aligns with player goals
- Available time and resources

**Characteristics:**
- Target: Top 50 ranks
- Time: 20-50+ hours
- Resources: High investment
- Stress: High
- Rewards: Best available

**Tips:**
- Prepare well in advance
- Use gems for refreshes strategically
- Monitor rank throughout event
- Late push in final hours for efficiency
- Have backup strategy if falling behind

### Moderate Participation

**When to Choose:**
- Good ROI (25-49 value/hour)
- Moderate confidence (50-69%)
- Reasonable time commitment
- Balanced approach preferred
- Multiple events running concurrently

**Characteristics:**
- Target: Rank 51-500
- Time: 12-25 hours
- Resources: Moderate investment
- Stress: Medium
- Rewards: Good value

**Tips:**
- Steady daily participation
- Don't over-invest in final push
- Focus on consistent progress
- Save resources for multiple events
- Adjust target if needed

### Minimal Participation

**When to Choose:**
- Low ROI but still positive (10-24 value/hour)
- Low confidence (<50%)
- Limited time available
- Many better events upcoming
- Just want participation rewards

**Characteristics:**
- Target: Participation/milestone only
- Time: 5-15 hours
- Resources: Minimal investment
- Stress: Low
- Rewards: Basic participation

**Tips:**
- Hit easy milestones quickly
- Don't stress about rank
- Use leftover resources
- Good for event currency accumulation
- Prepare for better future events

### Skip

**When to Choose:**
- Negative or very low ROI (<10 value/hour)
- Don't meet minimum requirements
- No available time or resources
- Better events available
- Event doesn't align with goals

**Characteristics:**
- Target: None
- Time: 0 hours
- Resources: 0 investment
- Stress: None
- Rewards: None

**Tips:**
- Focus resources elsewhere
- Don't feel obligated to participate
- Use time for hero upgrades
- Prepare for upcoming events
- Sometimes not playing is optimal

## Risk Management

### Common Risks

#### 1. Competition Risk
**Description**: Underestimating competition level  
**Mitigation**:
- Research past event results
- Monitor leaderboard early
- Adjust target rank mid-event
- Have fallback strategy ready

#### 2. Resource Risk
**Description**: Insufficient resources to maintain pace  
**Mitigation**:
- Acquire resources in advance
- Keep gem reserve for emergencies
- Use consumables strategically
- Consider gem purchases if needed

#### 3. Time Commitment Risk
**Description**: Unable to maintain daily participation  
**Mitigation**:
- Plan schedule ahead of time
- Set realistic targets
- Use auto-battle features
- Consider moderate instead of maximal

#### 4. Hero Strength Risk
**Description**: Heroes weaker than competition  
**Mitigation**:
- Upgrade key heroes before event
- Focus on hero synergies
- Use optimal team composition
- Consider skipping if too underpowered

#### 5. Meta Shift Risk
**Description**: META changes mid-event  
**Mitigation**:
- Stay updated on patches
- Have versatile hero pool
- Adapt strategy quickly
- Focus on stable heroes

## Best Practices

### 1. **Preparation is Key** 📝
- Review event 3-7 days in advance
- Acquire needed resources early
- Upgrade key heroes beforehand
- Understand scoring mechanics
- Plan daily participation schedule

### 2. **Resource Management** 💎
- Keep gem reserve for refreshes
- Don't deplete all resources
- Save some for next event
- Use free refreshes first
- Gems most valuable near end

### 3. **Time Optimization** ⏰
- Focus on high-value activities
- Use auto-battle when possible
- Late push more efficient than early
- Don't waste time on low ROI tasks
- Batch activities when possible

### 4. **Competitive Intelligence** 🕵️
- Monitor top players early
- Track point requirements
- Adjust strategy based on trends
- Learn from top performers
- Share intel with guild

### 5. **Emotional Control** 🧘
- Don't over-invest emotionally
- Accept when targets unrealistic
- Celebrate small wins
- Learn from each event
- Remember it's a marathon, not sprint

## Integration with Other Systems

### Hero Upgrade Optimizer
The Event Strategy Optimizer works with the Hero Upgrade Optimizer to:
- Prioritize heroes useful for upcoming events
- Time upgrades for event preparation
- Allocate resources efficiently
- Build versatile roster for multiple event types

### Resource Allocation Planner
Coordinates with resource planning to:
- Reserve resources for high-priority events
- Balance long-term upgrades with event participation
- Optimize spending profile for event success
- Track resource ROI across activities

### Meta Analysis System
Leverages meta analysis for:
- Event-specific team compositions
- Counter strategies for opponents
- Hero popularity and effectiveness trends
- Server-specific competitive landscape

## Performance Metrics

### Success Indicators

1. **Target Achievement Rate**
   - % of events where target rank achieved
   - Goal: >70% for high-confidence predictions

2. **ROI Accuracy**
   - Actual rewards vs predicted rewards
   - Goal: Within 20% of prediction

3. **Time Estimation**
   - Actual time vs predicted time
   - Goal: Within 25% of estimate

4. **Resource Efficiency**
   - Rewards earned vs resources spent
   - Goal: Positive ROI on all participated events

5. **Confidence Calibration**
   - Success rate by confidence band
   - Goal: 70% confidence = 70% success rate

### Tracking Recommendations

```typescript
interface EventPerformanceTracking {
  eventId: string;
  prediction: EventStrategy;
  actual: {
    rank: number;
    rewards: Resources;
    timeInvested: number;
    resourcesSpent: Resources;
  };
  variance: {
    rankDelta: number;
    rewardsDelta: number;
    timeDelta: number;
  };
  lessons: string[];
}
```

## Future Enhancements

### Planned Features (Phase 3)

1. **Machine Learning Integration**
   - Learn from historical performance
   - Improve rank predictions
   - Personalize recommendations
   - Adapt to player behavior

2. **Real-Time Adjustments**
   - Monitor event progress live
   - Adjust strategy mid-event
   - Alert for rank changes
   - Suggest tactical pivots

3. **Social Features**
   - Share strategies with guild
   - Compare with friends
   - Learn from top players
   - Collaborative planning

4. **Advanced Analytics**
   - Performance dashboards
   - Trend analysis
   - Competitive benchmarking
   - ROI tracking over time

5. **Automated Execution**
   - Auto-participation in low-effort events
   - Scheduled notifications
   - Resource auto-allocation
   - Strategy auto-adjustment

## Troubleshooting

### Common Issues

**Q: Strategy suggests skipping all events**  
A: Likely power level too low. Focus on hero upgrades first, or try minimal participation for resource accumulation.

**Q: Confidence scores always low**  
A: May need more historical data. Participate in a few events to build baseline, or consider more conservative targets.

**Q: ROI seems inaccurate**  
A: Check resource valuation weights. Adjust if your play style values certain resources differently.

**Q: Time estimates way off**  
A: Baseline time per event type may need adjustment based on your efficiency. Track actual time and calibrate.

**Q: Can't achieve target ranks**  
A: Competition may be stronger than estimated. Lower targets or focus on different event types where you're more competitive.

## API Reference

### Main Functions

```typescript
// Optimize single event
function optimizeEventStrategy(
  event: GameEvent,
  playerState: PlayerState,
  historicalData?: EventPerformance[]
): EventStrategy

// Optimize multiple events
function optimizeMultiEventStrategy(
  events: GameEvent[],
  playerState: PlayerState,
  timeframe: { start: Date; end: Date }
): MultiEventStrategy

// Predict rank
function predictFinalRank(
  currentPoints: number,
  currentRank: number,
  event: GameEvent,
  hoursRemaining: number
): RankPrediction
```

### Key Types

```typescript
// See src/types/strategic.ts for full definitions
- GameEvent
- EventStrategy
- EventEffort
- EventRecommendation
- PreparationStep
- EventRisk
- AlternativeStrategy
- RankPrediction
- MultiEventStrategy
```

## Conclusion

The Event Strategy Optimizer transforms event participation from guesswork into data-driven decision-making. By analyzing effort, rewards, competition, and player state, it provides clear recommendations that maximize value while respecting time and resource constraints.

**Key Benefits:**
- **Objective Analysis**: Remove emotion from decisions
- **ROI Focus**: Prioritize high-value opportunities
- **Risk Awareness**: Understand what can go wrong
- **Flexibility**: Multiple strategies for different situations
- **Learning**: Improves with historical data

**Remember**: The optimizer is a tool to aid decision-making, not replace it. Your personal goals, preferences, and circumstances should always be the final factor in choosing how to participate in events.

---

*Event Strategy Optimizer*  
*Part of the Top Heroes Companion Strategic System*  
*Version 1.0.0 - 2026-01-15*
