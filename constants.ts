
import { Hero, GameEvent, GiftCode, Faction, Pet, Relic, Skin } from './types';

export const HEROES: Hero[] = [
  // --- NATURE FACTION (21 Heroes) ---
  { 
    id: 'tidecaller', 
    name: 'Tidecaller', 
    faction: 'Nature', 
    rarity: 'Mythic', 
    role: 'Support', 
    tier: 'S',
    description: 'The supreme support hero. Essential for team survival, energy regeneration, and mass crowd control.',
    skills: [
      { name: 'Tidal Wave', type: 'Ultimate', description: 'Deals 320% ATK damage to all enemies and stuns them for 2.5s.' },
      { name: 'Soothing Mist', type: 'Active', description: 'Heals the ally with the lowest HP for 210% ATK and grants a 15% DMG Reduction buff.' },
      { name: 'Ocean\'s Blessing', type: 'Passive', description: 'Increases the Energy Regen of all allies by 10%.' }
    ],
    recommendedSets: ['Guardian', 'Sage'],
    bonds: [{ partnerId: 'altar-marshal', bonus: 'HP +10%' }, { partnerId: 'monk', bonus: 'DEF +8%' }],
    skins: [{ name: 'Ocean Song', bonus: 'Healing +5%' }, { name: 'Midnight Deep', bonus: 'HP +3%' }],
    specialWeapon: { name: 'Siren\'s Call', description: 'Increases the duration of stuns by 0.5s and boosts healing by 15%.' },
    exclusiveGear: { name: 'Heart of the Sea', statBonus: 'Healing Effect +20%, Crit Res +10%' }
  },
  { 
    id: 'altar-marshal', 
    name: 'Altar Marshal', 
    faction: 'Nature', 
    rarity: 'Mythic', 
    role: 'Tank', 
    tier: 'S', 
    description: 'A colossal frontline unit that provides massive shields to the entire team.',
    skills: [
        { name: 'Divine Shield', type: 'Ultimate', description: 'Grants all allies a shield equal to 30% of Altar Marshal\'s Max HP.' },
        { name: 'Judgment', type: 'Active', description: 'Smashes the ground, dealing damage and taunting nearby enemies for 3s.' }
    ],
    recommendedSets: ['Titan', 'Guardian'],
    bonds: [{ partnerId: 'tidecaller', bonus: 'HP +12%' }, { partnerId: 'tree-guard', bonus: 'DEF +10%' }],
    specialWeapon: { name: 'Aegis of Fate', description: 'Shields now reflect 10% of damage taken.' },
    exclusiveGear: { name: 'Commander\'s Cloak', statBonus: 'Damage Reduction +15%, HP +10%' }
  },
  { 
    id: 'monk', 
    name: 'Monk', 
    faction: 'Nature', 
    rarity: 'Mythic', 
    role: 'Tank', 
    tier: 'A',
    description: 'Agile frontline disruptor who specializes in dodging and counter-attacking.',
    recommendedSets: ['Guardian', 'Swift'],
    bonds: [{ partnerId: 'tidecaller', bonus: 'Dodge +5%' }],
    specialWeapon: { name: 'Iron Staff', description: 'Increases Dodge rate by an additional 10%.' },
    exclusiveGear: { name: 'Prayer Beads', statBonus: 'HP +15%, Crit Res +15%' }
  },
  { 
    id: 'petalis', 
    name: 'Petalis', 
    faction: 'Nature', 
    rarity: 'Mythic', 
    role: 'Hybrid', 
    tier: 'S',
    description: 'Deals damage over time and reduces enemy healing efficacy.',
    recommendedSets: ['Warlord', 'Sage'],
    bonds: [{ partnerId: 'tidecaller', bonus: 'ATK +10%' }],
    specialWeapon: { name: 'Thorn Whip', description: 'DoT effects tick 20% faster.' },
    exclusiveGear: { name: 'Verdant Core', statBonus: 'Skill DMG +15%, ATK +10%' }
  },
  { 
    id: 'tree-guard', 
    name: 'Tree Guard', 
    faction: 'Nature', 
    rarity: 'Mythic', 
    role: 'Tank', 
    tier: 'S',
    description: 'The ultimate physical wall. High self-regeneration and CC immunity.',
    recommendedSets: ['Titan'],
    bonds: [{ partnerId: 'altar-marshal', bonus: 'DEF +15%' }],
    specialWeapon: { name: 'Living Root', description: 'Increases self-healing by 25%.' }
  },
  { id: 'rose-agent', name: 'Rose Agent', faction: 'Nature', rarity: 'Mythic', role: 'DPS', tier: 'S', description: 'Elegant duelist that stacks bleed damage on targets.' },
  { id: 'ent-elder', name: 'Ent Elder', faction: 'Nature', rarity: 'Mythic', role: 'Controller', tier: 'A', description: 'Nature spirit that roots enemies and reduces their attack power.' },
  { id: 'forest-maiden', name: 'Forest Maiden', faction: 'Nature', rarity: 'Legendary', role: 'Healer', tier: 'B', description: 'Reliable early game healer.' },
  { id: 'windwalker', name: 'Windwalker', faction: 'Nature', rarity: 'Legendary', role: 'DPS', tier: 'B', description: 'High attack speed archer.' },
  { id: 'sage', name: 'Sage', faction: 'Nature', rarity: 'Legendary', role: 'Support', tier: 'B', description: 'Energy battery for early teams.' },
  { id: 'bramble', name: 'Bramble', faction: 'Nature', rarity: 'Legendary', role: 'Controller', tier: 'B' },
  { id: 'shaman-nature', name: 'Nature Shaman', faction: 'Nature', rarity: 'Legendary', role: 'Support', tier: 'B' },
  { id: 'grove-knight', name: 'Grove Knight', faction: 'Nature', rarity: 'Legendary', role: 'Tank', tier: 'B' },
  { id: 'leaf-guardian', name: 'Leaf Guardian', faction: 'Nature', rarity: 'Legendary', role: 'Tank', tier: 'B' },
  { id: 'forest-ranger', name: 'Forest Ranger', faction: 'Nature', rarity: 'Legendary', role: 'DPS', tier: 'B' },
  { id: 'wild-growth', name: 'Wild Growth', faction: 'Nature', rarity: 'Epic', role: 'Tank', tier: 'C' },
  { id: 'druid', name: 'Druid', faction: 'Nature', rarity: 'Epic', role: 'Support', tier: 'C' },
  { id: 'leaf-blade', name: 'Leaf Blade', faction: 'Nature', rarity: 'Epic', role: 'DPS', tier: 'C' },
  { id: 'faerie', name: 'Faerie', faction: 'Nature', rarity: 'Rare', role: 'Support', tier: 'D' },
  { id: 'wood-elf', name: 'Wood Elf', faction: 'Nature', rarity: 'Rare', role: 'DPS', tier: 'D' },
  { id: 'nature-archer', name: 'Nature Archer', faction: 'Nature', rarity: 'Rare', role: 'DPS', tier: 'D' },

  // --- LEAGUE FACTION (21 Heroes) ---
  { 
    id: 'pyromancer', 
    name: 'Pyromancer', 
    faction: 'League', 
    rarity: 'Mythic', 
    role: 'DPS', 
    tier: 'S', 
    description: 'The queen of AoE damage. Capable of wiping entire waves with her ultimate.',
    skills: [
        { name: 'Inferno Storm', type: 'Ultimate', description: 'Summons 5 meteors, each dealing 250% ATK damage.' },
        { name: 'Fireball', type: 'Active', description: 'Launches a flame blast that explodes on contact.' }
    ],
    recommendedSets: ['Warlord', 'Titan'],
    bonds: [{ partnerId: 'paragon', bonus: 'ATK +15%' }, { partnerId: 'astro-hunter', bonus: 'Crit Rate +8%' }],
    specialWeapon: { name: 'Dragonbone Wand', description: 'Meteors have a 30% chance to stun.' },
    exclusiveGear: { name: 'Eternal Flame', statBonus: 'Crit DMG +30%, ATK +15%' }
  },
  { 
    id: 'paragon', 
    name: 'Paragon', 
    faction: 'League', 
    rarity: 'Mythic', 
    role: 'DPS', 
    tier: 'S',
    description: 'Holy warrior specializing in single-target burst and armor penetration.',
    recommendedSets: ['Warlord'],
    bonds: [{ partnerId: 'pyromancer', bonus: 'Crit Rate +10%' }, { partnerId: 'saint', bonus: 'Lifesteal +5%' }],
    specialWeapon: { name: 'Truthbringer', description: 'Ultimate ignores 25% of target defense.' },
    exclusiveGear: { name: 'Golden Armor', statBonus: 'ATK +20%, HP +10%' }
  },
  { 
    id: 'saint', 
    name: 'Saint', 
    faction: 'League', 
    rarity: 'Mythic', 
    role: 'Healer', 
    tier: 'S',
    description: 'The best pure healer in the League. Provides massive HoT and debuff cleansing.',
    recommendedSets: ['Sage'],
    bonds: [{ partnerId: 'paragon', bonus: 'Healing +20%' }],
    specialWeapon: { name: 'Book of Life', description: 'Heals also grant 10% DMG reduction for 3s.' }
  },
  { id: 'valkyrie', name: 'Valkyrie', faction: 'League', rarity: 'Mythic', role: 'DPS', tier: 'S', description: 'Dives into the backline with high burst.' },
  { id: 'astro-hunter', name: 'Astro-Hunter', faction: 'League', rarity: 'Mythic', role: 'DPS', tier: 'S', description: 'Ranged sniper with scaling damage based on distance.' },
  { id: 'artificer', name: 'Artificer', faction: 'League', rarity: 'Mythic', role: 'Support', tier: 'S', description: 'Mechanical genius that provides shields and turret fire.' },
  { id: 'nun', name: 'Nun', faction: 'League', rarity: 'Mythic', role: 'Support', tier: 'S', description: 'Cleanses debuffs and heals allies.' },
  { id: 'bishop', name: 'Bishop', faction: 'League', rarity: 'Mythic', role: 'Support', tier: 'S', description: 'Provides mana regeneration and invulnerability.' },
  { id: 'grand-master', name: 'Grand Master', faction: 'League', rarity: 'Mythic', role: 'Support', tier: 'S' },
  { id: 'royal-knight', name: 'Royal Knight', faction: 'League', rarity: 'Mythic', role: 'Tank', tier: 'S' },
  { id: 'secret-keeper', name: 'Secret Keeper', faction: 'League', rarity: 'Mythic', role: 'Support', tier: 'S' },
  { id: 'arcane-weaver', name: 'Arcane Weaver', faction: 'League', rarity: 'Mythic', role: 'DPS', tier: 'A' },
  { id: 'inquisitor', name: 'Inquisitor', faction: 'League', rarity: 'Legendary', role: 'Tank', tier: 'A', description: 'Anti-magic tank.' },
  { id: 'blacksmith', name: 'Blacksmith', faction: 'League', rarity: 'Legendary', role: 'Support', tier: 'B', description: 'Buffs team equipment stats.' },
  { id: 'musketeer', name: 'Musketeer', faction: 'League', rarity: 'Legendary', role: 'DPS', tier: 'B' },
  { id: 'shield-maiden', name: 'Shield Maiden', faction: 'League', rarity: 'Legendary', role: 'Tank', tier: 'B' },
  { id: 'hammer-vanguard', name: 'Hammer Vanguard', faction: 'League', rarity: 'Legendary', role: 'Tank', tier: 'B' },
  { id: 'paladin-league', name: 'League Paladin', faction: 'League', rarity: 'Legendary', role: 'Tank', tier: 'B' },
  { id: 'cleric', name: 'Cleric', faction: 'League', rarity: 'Epic', role: 'Healer', tier: 'C' },
  { id: 'scholar', name: 'Scholar', faction: 'League', rarity: 'Epic', role: 'Controller', tier: 'C' },
  { id: 'templar', name: 'Templar', faction: 'League', rarity: 'Epic', role: 'Tank', tier: 'C' },
  { id: 'guard', name: 'Guard', faction: 'League', rarity: 'Rare', role: 'Tank', tier: 'D' },
  { id: 'footman', name: 'Footman', faction: 'League', rarity: 'Rare', role: 'Tank', tier: 'D' },
  { id: 'archer-league', name: 'League Archer', faction: 'League', rarity: 'Rare', role: 'DPS', tier: 'D' },

  // --- HORDE FACTION (20 Heroes) ---
  { 
    id: 'wanderer', 
    name: 'Wanderer', 
    faction: 'Horde', 
    rarity: 'Mythic', 
    role: 'DPS', 
    tier: 'S',
    description: 'An assassin who teleports behind enemies and executes low HP targets.',
    recommendedSets: ['Warlord', 'Swift'],
    bonds: [{ partnerId: 'shadow-priest', bonus: 'Crit DMG +20%' }],
    specialWeapon: { name: 'Twin Fangs', description: 'Executes targets below 15% HP instantly.' },
    exclusiveGear: { name: 'Shadow Cloak', statBonus: 'Dodge +20%, Crit Rate +10%' }
  },
  { 
    id: 'shadow-priest', 
    name: 'Shadow Priest', 
    faction: 'Horde', 
    rarity: 'Mythic', 
    role: 'Support', 
    tier: 'S',
    description: 'Debuffs enemies with armor reduction and lifesteal curses.',
    recommendedSets: ['Sage'],
    bonds: [{ partnerId: 'wanderer', bonus: 'Energy Regen +15%' }],
    specialWeapon: { name: 'Skull Scepter', description: 'Curses also reduce enemy attack speed by 20%.' }
  },
  { 
    id: 'headhunter', 
    name: 'Headhunter', 
    faction: 'Horde', 
    rarity: 'Mythic', 
    role: 'DPS', 
    tier: 'S',
    description: 'Melee fighter that becomes unstoppable as his HP drops.',
    recommendedSets: ['Warlord'],
    bonds: [{ partnerId: 'bloodlust-bear', bonus: 'Lifesteal +10%' }],
    specialWeapon: { name: 'Slayer\'s Axe', description: 'Grants immunity to CC when below 30% HP.' }
  },
  { 
    id: 'desert-prince', 
    name: 'Desert Prince', 
    faction: 'Horde', 
    rarity: 'Mythic', 
    role: 'Tank', 
    tier: 'S',
    description: 'Tank who uses sand walls to block incoming projectiles.',
    recommendedSets: ['Titan'],
    bonds: [{ partnerId: 'shadow-priest', bonus: 'DEF +12%' }],
    specialWeapon: { name: 'Scimitar of Dust', description: 'Projectiles blocked heal the Prince for 5% HP.' }
  },
  { 
    id: 'bloodlust-bear', 
    name: 'Bloodlust Bear', 
    faction: 'Horde', 
    rarity: 'Mythic', 
    role: 'Tank', 
    tier: 'S',
    description: 'Aggressive tank that recovers health based on damage dealt.',
    recommendedSets: ['Titan', 'Warlord'],
    bonds: [{ partnerId: 'headhunter', bonus: 'HP +15%' }],
    specialWeapon: { name: 'Primal Claws', description: 'Increases Lifesteal by an additional 15%.' }
  },
  { 
    id: 'warlock', 
    name: 'Warlock', 
    faction: 'Horde', 
    rarity: 'Mythic', 
    role: 'Controller', 
    tier: 'A',
    description: 'Summons demons to fight and distract enemies.',
    recommendedSets: ['Sage'],
    bonds: [{ partnerId: 'shadow-priest', bonus: 'Skill DMG +10%' }],
    specialWeapon: { name: 'Demonic Orb', description: 'Demons gain 30% of Warlock\'s stats.' }
  },
  { id: 'wild-girl', name: 'Wild Girl', faction: 'Horde', rarity: 'Mythic', role: 'DPS', tier: 'S', description: 'Feral combatant with massive burst potential.' },
  { id: 'night-blade', name: 'Night Blade', faction: 'Horde', rarity: 'Mythic', role: 'DPS', tier: 'S' },
  { id: 'demon-king', name: 'Demon King', faction: 'Horde', rarity: 'Mythic', role: 'DPS', tier: 'S' },
  { id: 'blade-master', name: 'Blade Master', faction: 'Horde', rarity: 'Legendary', role: 'DPS', tier: 'A', description: 'Fast melee strikes.' },
  { id: 'shaman-horde', name: 'Horde Shaman', faction: 'Horde', rarity: 'Legendary', role: 'Support', tier: 'B', description: 'Totem buffer.' },
  { id: 'reaper', name: 'Reaper', faction: 'Horde', rarity: 'Legendary', role: 'DPS', tier: 'B', description: 'AoE scythe attacks.' },
  { id: 'barbarian', name: 'Barbarian', faction: 'Horde', rarity: 'Legendary', role: 'Tank', tier: 'B', description: 'Resilient warrior.' },
  { id: 'voodoo-doctor', name: 'Voodoo Doctor', faction: 'Horde', rarity: 'Legendary', role: 'Support', tier: 'B' },
  { id: 'beast-tamer', name: 'Beast Tamer', faction: 'Horde', rarity: 'Legendary', role: 'Hybrid', tier: 'B' },
  { id: 'bone-breaker', name: 'Bone Breaker', faction: 'Horde', rarity: 'Legendary', role: 'Tank', tier: 'B' },
  { id: 'goblin-rogue', name: 'Goblin Rogue', faction: 'Horde', rarity: 'Epic', role: 'DPS', tier: 'C' },
  { id: 'ogre-brute', name: 'Ogre Brute', faction: 'Horde', rarity: 'Epic', role: 'Tank', tier: 'C' },
  { id: 'troll-priest', name: 'Troll Priest', faction: 'Horde', rarity: 'Epic', role: 'Healer', tier: 'C' },
  { id: 'grunt', name: 'Grunt', faction: 'Horde', rarity: 'Rare', role: 'Tank', tier: 'D' },
  { id: 'skull-warrior', name: 'Skull Warrior', faction: 'Horde', rarity: 'Rare', role: 'DPS', tier: 'D' },
  { id: 'horde-sniper', name: 'Horde Sniper', faction: 'Horde', rarity: 'Rare', role: 'DPS', tier: 'D' },
];

export const PETS: Pet[] = [
    { id: 'azure-dragon', name: 'Azure Dragon', rarity: 'Mythic', description: 'Boosts skill damage.', skillName: 'Azure Breath', skillDescription: 'Massive AoE DMG +20% Skill DMG.', baseInfluence: 60000 },
    { id: 'crimson-dragon', name: 'Crimson Dragon', rarity: 'Mythic', description: 'Enhances ATK.', skillName: 'Flame Burst', skillDescription: 'Burn + 15% ATK.', baseInfluence: 60000 },
    { id: 'rock-golem', name: 'Rock Golem', rarity: 'Legendary', description: 'Tank pet.', skillName: 'Stone Skin', skillDescription: '10% HP Shield.', baseInfluence: 35000 },
];

export const RELICS: Relic[] = [
    { id: 'cup-of-jamshid', name: 'Cup of Jamshid', type: 'Assist', rarity: 'Mythic', description: 'Healing boost.', statBonus: 'HP +15%, Healing +10%', baseInfluence: 100000 },
    { id: 'sword-of-victory', name: 'Sword of Victory', type: 'Attack', rarity: 'Mythic', description: 'Offensive powerhouse.', statBonus: 'ATK +15%, Crit DMG +10%', baseInfluence: 100000 },
    { id: 'hand-of-tyr', name: 'Hand of Tyr', type: 'Defense', rarity: 'Legendary', description: 'Solid tank relic.', statBonus: 'DEF +20%, Crit Res +10%', baseInfluence: 60000 },
];

export const SKINS: Skin[] = [
    { id: 'dragon-castle', name: 'Dragon Keep', type: 'Castle', bonus: 'All Troops ATK +5%', baseInfluence: 100000 },
    { id: 'royal-march', name: 'Royal Guard', type: 'March', bonus: 'March Speed +10%', baseInfluence: 30000 },
];

export const EVENTS: GameEvent[] = [
  {
    id: 'arms-race',
    name: 'Guild Arms Race',
    type: 'Recurring',
    scheduleType: 'Weekly-UTC',
    description: 'The foundation of progression. Coordinate with your guild to secure 3-chest rewards daily.',
    isActive: true,
    phases: [
        {
            name: "Monday: Tycoon (Gathering)",
            description: "Points for gathering resources and using construction/research speedups.",
            keyTasks: ["Gather Gold/Wood/Stone/Meat", "Use Speedups (Building/Research)"],
            pointsStrategy: "Send troops to nodes late Sunday UTC so they return after Monday reset.",
            tips: ["Use the 'Gathering Speed' rune from your inventory.", "Only speed up tasks that finish on this day to maximize efficiency."]
        },
        {
            name: "Tuesday: Construction",
            description: "Points for increasing Building Power.",
            keyTasks: ["Upgrade Main Buildings", "Use Construction Speedups"],
            pointsStrategy: "Save large building completions (Castle, Embassy) specifically for Tuesday.",
            tips: ["Start upgrades early in the week but hold the completion until Tuesday reset."]
        },
        {
            name: "Wednesday: Training",
            description: "Points for increasing Troop Power.",
            keyTasks: ["Train New Troops", "Promote Low-Tier Troops"],
            pointsStrategy: "Promoting T1 to T4 is faster and gives comparable points to fresh training.",
            tips: ["Ensure your Training Grounds are at max capacity before this day."]
        },
        {
            name: "Thursday: Hero Recruitment",
            description: "The most important day. Points for recruitment and hero growth.",
            keyTasks: ["Use Vouchers", "Use Universal Shards", "Hero Awakening"],
            pointsStrategy: "SAVE ALL VOUCHERS for this day. 10-pulls only for bonus rates.",
            tips: ["Universal Mythic shards are best spent here to secure rank rewards."]
        },
        {
            name: "Friday: Stamina & Runes",
            description: "Points for killing Dark Forces and consuming Runes.",
            keyTasks: ["Kill High-Level Mobs", "Use Stamina Potions", "Use Inventory Runes"],
            pointsStrategy: "Attack the highest level Dark Force you can defeat.",
            tips: ["Coordinate with guild to hit rallies; rallies give 1.5x points per Stamina spent."]
        },
        {
            name: "Saturday: Final Sprint",
            description: "All tasks from previous days provide points today.",
            keyTasks: ["Speedups", "Recruitment", "Training", "Gathering"],
            pointsStrategy: "This is your catch-up day. Dump any remaining resources here.",
            tips: ["Check the leaderboard every 2 hours to ensure you stay in your desired bracket."]
        }
    ],
    preparationChecklist: [
        "Store at least 50 Recruitment Vouchers for Thursday.",
        "Pre-farm Level 6 nodes Sunday night.",
        "Save all Universal Speedups for Day 1 or Day 6.",
        "Have at least 20 Stamina potions for Friday."
    ],
    rewardsHighlight: ["Mythic Hero Shards", "Diamonds", "Legendary Gear Materials", "Universal Speedups"]
  },
  {
    id: 'kvk',
    name: 'Kingdom War (KvK)',
    type: 'Season',
    description: 'A multi-server war lasting weeks. Capture the World Throne to rule the cluster.',
    isActive: false,
    rewardsHighlight: ["Exclusive Throne Skins", "Artifact Selection Chests", "Server-wide Buffs"]
  },
  {
    id: 'lava-rift',
    name: 'Lava Rift Challenge',
    type: 'Season',
    description: 'Climb the seasonal rift floors. Each floor increases in difficulty.',
    isActive: true,
    rewardsHighlight: ["Relic Upgrade Materials", "Diamonds", "Hero EXP"]
  }
];

export const GIFT_CODES: GiftCode[] = [
  { code: 'THMerrYXmaS', rewards: 'Holiday Rewards', isActive: true, addedDate: '2025-12-25' },
  { code: 'TopHeroes2024', rewards: 'Common Resources', isActive: false },
];

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
