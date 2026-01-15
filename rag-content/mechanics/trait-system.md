# Trait System Guide

Traits provide additional stat boosts to heroes after they've reached maximum stars.

## Overview

- **Requirement**: Hero at 5 Silver Stars (max base stars)
- **Cost**: Diamonds to unlock, Shards to upgrade
- **Structure**: 4 traits per hero, upgraded sequentially

## How Traits Work

### Unlocking

- Available at 5 silver stars
- Costs diamonds to unlock first trait

### Upgrading

- 10 shards per level
- Max level 30 per trait
- Must max one trait before moving to next
- Cycle: Upgrade trait 1 levels 1-5, then trait 2, etc.

### Trait Order

```
Trait 1 (Lv 1-5) → Trait 2 (Lv 1-5) → Trait 3 (Lv 1-5) → Trait 4 (Lv 1-5)
→ Trait 1 (Lv 6-10) → Trait 2 (Lv 6-10) → ... → All at Lv 30
```

## Trait Types

| Trait Type   | Effect                      |
| ------------ | --------------------------- |
| Attack       | Increases base attack       |
| HP           | Increases base HP           |
| Armor        | Increases armor rating      |
| Speed        | Increases action speed      |
| Critical     | Increases crit rate/damage  |
| Skill Damage | Increases skill multipliers |

## Priority Strategy

### DPS Heroes

1. Attack traits
2. Critical traits
3. Skill damage traits

### Tank Heroes

1. HP traits
2. Armor traits
3. Damage reduction

### Healers

- HP traits (most heals scale with HP)
- Attack (if skills scale with attack)

## Resource Management

### Shard Calculation

- 10 shards × 30 levels × 4 traits = **1,200 shards per hero**

### Investment Priority

1. Main team DPS first
2. Primary tank
3. Main healer
4. Other core heroes
