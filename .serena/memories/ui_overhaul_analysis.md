# UI Overhaul Analysis - Current State & Plan

## Current UI Problems

### HeroDetailView Issues:
1. **No visual hierarchy** - Just plain text cards
2. **Missing numerical data** - No cooldowns, damage values, ranges, mana costs
3. **No skill icons** - Text-only presentation
4. **No stat displays** - No HP, ATK, DEF, SPD visualization  
5. **No comparisons** - Can't compare with other heroes
6. **No build guides** - No skill priority recommendations
7. **No synergy info** - No team composition suggestions
8. **No counter matchups** - No weakness/strength indicators
9. **Static content** - No interactive calculators or tools

### HeroGrid Issues:
1. **Minimal information** - Just portrait and name
2. **No tier indicators** - No S/A/B/C tier visual
3. **No role icons** - Hard to scan for tanks/dps/healers
4. **No quick stats** - No at-a-glance power comparison
5. **Basic filtering** - Only search + faction filter

### Guides Page Issues:
1. **Text walls** - No interactivity
2. **No progress tracking** - Can't mark as read/completed
3. **No search within guides** - Hard to find specific info
4. **No bookmarks** - Can't save favorite strategies

## Comprehensive Overhaul Plan

### 1. Enhanced Data Structure
```json
{
  "stats": {
    "hp": 850, "attack": 120, "defense": 85,
    "speed": 95, "crit_rate": 15, "crit_dmg": 150
  },
  "skills": [{
    "cooldown": 8, "energy_cost": 30,
    "damage_type": "Physical", "range": "Melee",
    "scaling": "120% ATK + 5% MAX_HP",
    "targets": "AOE-3x3", "icon": "/icons/skill1.png"
  }],
  "synergies": ["Witch", "Barbarian"],
  "counters": ["Paragon", "Bishop"],
  "weak_against": ["Secret Keeper"],
  "tier": "S", "tier_pve": "S+", "tier_pvp": "A"
}
```

### 2. Rich Skill Cards Component
- **Skill icon** (left side)
- **Skill name + type badge** (top)
- **Cooldown/Cost** (top right with icons)
- **Description** with highlighted keywords
- **Damage/scaling formula** in colored box
- **Range/Target indicator** with visual diagram
- **Tips** in expandable section
- **Upgrade path** showing skill levels 1-10

### 3. Stat Visualization
- **Radar chart** for 6 core stats
- **Comparison mode** overlay 2 heroes
- **Stat bars** with numerical values
- **Growth curve** showing stat scaling by level

### 4. Hero Comparison Tool
- **Side-by-side layout** (2-3 heroes)
- **Stat comparison** with color-coded better/worse
- **Skill comparison** aligned by type
- **Synergy matrix** showing team fit
- **Matchup calculator** who wins 1v1

### 5. Interactive Team Builder
- **5-slot drag-and-drop** formation editor
- **Synergy calculator** with visual connections
- **Team stats aggregate** total HP/ATK/buffs
- **Formation previewer** visual grid layout
- **Counter analysis** vs enemy comps
- **Save/load teams** with names

### 6. Advanced Filtering System
- **Multi-select** faction/role/tier
- **Stat range sliders** (HP: 500-1000)
- **Synergy tags** find heroes that buff X
- **Owned/Not owned** toggle
- **Sort by** power/tier/name/rarity

### 7. Tier List View
- **S/A/B/C/D tiers** with drag-and-drop
- **PvE vs PvP** toggle separate tier lists
- **Community ratings** vs official
- **Tier explanations** why hero is ranked here
- **Meta shift timeline** tier changes over patches

### 8. Damage Calculator
- **Hero selection** dropdown
- **Skill selection** which ability
- **Target inputs** enemy HP/DEF
- **Buff modifiers** +ATK%, crit, etc.
- **Output** total damage, DPS, time to kill
- **Comparison mode** compare 2 hero rotations

### 9. Build Priority Guide
- **Visual skill tree** with recommended path
- **Stat priority** what to upgrade first
- **Gear recommendations** with set bonuses
- **Pet pairings** best pet for hero
- **Progression timeline** early/mid/late game focus

### 10. Enhanced Hero Cards (Grid View)
- **Tier badge** S/A/B on corner
- **Role icon** tank/dps/healer/support
- **Power rating** number display
- **Faction border** color-coded
- **Owned checkmark** if in roster
- **Quick stats** HP/ATK on hover
- **Synergy dots** colored indicators

## Implementation Priority
1. Enhanced data for top 10 meta heroes
2. Stat visualization radar chart component
3. Rich skill cards with icons
4. Hero comparison tool (2-hero)
5. Advanced filters on grid
6. Tier list display
7. Team builder v1
8. Damage calculator
9. Full data coverage (50 heroes)
10. Polish and animations
