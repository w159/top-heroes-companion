
import { Hero, GameEvent, GiftCode, Faction, Pet, Relic, Skin } from './types';

export const HEROES: Hero[] = [
  // --- NATURE FACTION (21 Heroes) ---
  { 
    id: 'tidecaller', 
    image: '/img/heroes/tidecaller.webp',
    imageUrl: '/img/heroes/tidecaller.webp',
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
    image: '/img/heroes/altar-marshal.webp',
    imageUrl: '/img/heroes/altar-marshal.webp',
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
    image: '/img/heroes/monk.webp',
    imageUrl: '/img/heroes/monk.webp',
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
    image: '/img/heroes/petalis.webp',
    imageUrl: '/img/heroes/petalis.webp',
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
    image: '/img/heroes/tree-guard.webp',
    imageUrl: '/img/heroes/tree-guard.webp',
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
  { 
    id: 'rose-agent', 
    image: '/img/heroes/rose-agent.webp',
    imageUrl: '/img/heroes/rose-agent.webp',
    name: 'Rose Agent', 
    faction: 'Nature', 
    rarity: 'Mythic', 
    role: 'DPS', 
    tier: 'S', 
    description: 'Elegant duelist that stacks bleed damage on targets. Her thorns reflect damage back to attackers.',
    skills: [
        { name: 'Bloody Waltz', type: 'Ultimate', description: 'Deals 280% ATK damage to random enemies 5 times. Each hit applies a Bleed stack.' },
        { name: 'Thorned Armor', type: 'Active', description: 'Grants a shield. While active, 20% of received damage is reflected as True Damage.' },
        { name: 'Rose Garden', type: 'Passive', description: 'Enemies standing near Rose Agent take 50% ATK damage per second.' }
    ],
    recommendedSets: ['Warlord', 'Swift'],
    bonds: [{ partnerId: 'tidecaller', bonus: 'ATK +12%' }, { partnerId: 'petalis', bonus: 'Crit Rate +8%' }],
    specialWeapon: { name: 'Crimson Rapier', description: 'Bleed effects can now stack up to 10 times.' },
    exclusiveGear: { name: 'Rose Choker', statBonus: 'ATK +20%, Lifesteal +10%' }
  },
  { 
    id: 'ent-elder', 
    image: '/img/heroes/ent-elder.webp',
    imageUrl: '/img/heroes/ent-elder.webp',
    name: 'Ent Elder', 
    faction: 'Nature', 
    rarity: 'Mythic', 
    role: 'Controller', 
    tier: 'A', 
    description: 'Nature spirit that roots enemies and reduces their attack power.',
    skills: [
        { name: 'Nature\'s Grasp', type: 'Ultimate', description: 'Roots all enemies in a large area for 3s and deals 150% ATK damage.' },
        { name: 'Sappling Toss', type: 'Active', description: 'Throws a sappling that explodes, slowing enemies by 30%.' },
        { name: 'Ancient Bark', type: 'Passive', description: 'Reduces incoming Physical Damage by 15%.' }
    ],
    recommendedSets: ['Sage', 'Guardian'],
    bonds: [{ partnerId: 'tree-guard', bonus: 'HP +15%' }],
    specialWeapon: { name: 'Elder Branch', description: 'Rooted enemies deal 20% less damage.' },
    exclusiveGear: { name: 'Bark Shield', statBonus: 'DEF +25%, Crit Res +15%' }
  },
  { 
    id: 'forest-maiden', 
    image: '/img/heroes/forest-maiden.webp',
    imageUrl: '/img/heroes/forest-maiden.webp',
    name: 'Forest Maiden', 
    faction: 'Nature', 
    rarity: 'Legendary', 
    role: 'Healer', 
    tier: 'B', 
    description: 'Reliable early game healer found in the deep woods.',
    skills: [
        { name: 'Healing Rain', type: 'Ultimate', description: 'Heals all allies for 180% ATK.' },
        { name: 'Vine Shield', type: 'Active', description: 'Grants the weakest ally a shield absorbing 200% ATK damage.' }
    ],
    recommendedSets: ['Sage'],
    bonds: [{ partnerId: 'windwalker', bonus: 'Healing +10%' }]
  },
  { 
    id: 'windwalker', 
    image: '/img/heroes/windwalker.webp',
    imageUrl: '/img/heroes/windwalker.webp',
    name: 'Windwalker', 
    faction: 'Nature', 
    rarity: 'Legendary', 
    role: 'DPS', 
    tier: 'B', 
    description: 'High attack speed archer riding the currents of the wind.',
    skills: [
        { name: 'Gale Shot', type: 'Ultimate', description: 'Fires a piercing arrow dealing 220% damage to a line of enemies.' },
        { name: 'Tailwind', type: 'Passive', description: 'Increases Attack Speed by 15%.' }
    ],
    recommendedSets: ['Swift'],
    bonds: [{ partnerId: 'forest-maiden', bonus: 'ATK +10%' }]
  },
  { 
    id: 'sage', 
    image: '/img/heroes/sage.webp',
    imageUrl: '/img/heroes/sage.webp',
    name: 'Sage', 
    faction: 'Nature', 
    rarity: 'Legendary', 
    role: 'Support', 
    tier: 'B', 
    description: 'Energy battery for early teams, providing constant mana regeneration.',
    skills: [
        { name: 'Clarity', type: 'Ultimate', description: 'Restores 100 Energy to all allies.' },
        { name: 'Wisdom', type: 'Passive', description: 'Increases Skill Damage of adjacent allies by 10%.' }
    ],
    recommendedSets: ['Sage']
  },
  { id: 'bramble', image: '/img/heroes/bramble.webp', name: 'Bramble', faction: 'Nature', rarity: 'Legendary', role: 'Controller', tier: 'B', description: 'Summons thorny vines to entangle foes.' },
  { id: 'shaman-nature', image: '/img/heroes/shaman-nature.webp', name: 'Nature Shaman', faction: 'Nature', rarity: 'Legendary', role: 'Support', tier: 'B', description: 'Channels the spirits to buff ally defense.' },
  { id: 'grove-knight', image: '/img/heroes/grove-knight.webp', name: 'Grove Knight', faction: 'Nature', rarity: 'Legendary', role: 'Tank', tier: 'B', description: 'A fallen log brought to life to defend the grove.' },
  { id: 'leaf-guardian', image: '/img/heroes/leaf-guardian.webp', name: 'Leaf Guardian', faction: 'Nature', rarity: 'Legendary', role: 'Tank', tier: 'B', description: 'Uses giant leaves to deflect arrows.' },
  { id: 'forest-ranger', image: '/img/heroes/forest-ranger.webp', name: 'Forest Ranger', faction: 'Nature', rarity: 'Legendary', role: 'DPS', tier: 'B', description: 'Patrols the forest borders.' },
  { id: 'wild-growth', image: '/img/heroes/wild-growth.webp', name: 'Wild Growth', faction: 'Nature', rarity: 'Epic', role: 'Tank', tier: 'C', description: 'Overgrown plant monster.' },
  { id: 'druid', image: '/img/heroes/druid.webp', name: 'Druid', faction: 'Nature', rarity: 'Epic', role: 'Support', tier: 'C', description: 'Shapeshifts to protect the pack.' },
  { id: 'leaf-blade', image: '/img/heroes/leaf-blade.webp', name: 'Leaf Blade', faction: 'Nature', rarity: 'Epic', role: 'DPS', tier: 'C', description: 'Swift strikes with leaf-shaped daggers.' },
  { id: 'faerie', image: '/img/heroes/faerie.webp', name: 'Faerie', faction: 'Nature', rarity: 'Rare', role: 'Support', tier: 'D', description: 'Tiny healer.' },
  { id: 'wood-elf', image: '/img/heroes/wood-elf.webp', name: 'Wood Elf', faction: 'Nature', rarity: 'Rare', role: 'DPS', tier: 'D', description: 'Basic archer unit.' },
  { id: 'nature-archer', image: '/img/heroes/nature-archer.webp', name: 'Nature Archer', faction: 'Nature', rarity: 'Rare', role: 'DPS', tier: 'D', description: 'Militia ranged unit.' },

  // --- LEAGUE FACTION (21 Heroes) ---
  { 
    id: 'pyromancer', 
    image: '/img/heroes/pyromancer.webp',
    imageUrl: '/img/heroes/pyromancer.webp',
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
    image: '/img/heroes/paragon.webp',
    imageUrl: '/img/heroes/paragon.webp',
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
    image: '/img/heroes/saint.webp',
    imageUrl: '/img/heroes/saint.webp',
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
  { 
    id: 'valkyrie', 
    image: '/img/heroes/valkyrie.webp',
    imageUrl: '/img/heroes/valkyrie.webp',
    name: 'Valkyrie', 
    faction: 'League', 
    rarity: 'Mythic', 
    role: 'DPS', 
    tier: 'S', 
    description: 'Dives into the backline with high burst. Excellent for assassinating enemy supports.',
    skills: [
        { name: 'Skyfall', type: 'Ultimate', description: 'Leaps into the air and crashes down on the farthest enemy, dealing 300% ATK damage.' },
        { name: 'Piercing Spear', type: 'Active', description: 'Thrusts forward, ignoring 30% of target Defense.' },
        { name: 'Battle Cry', type: 'Passive', description: 'Increases ATK by 10% for every enemy killed.' }
    ],
    recommendedSets: ['Warlord', 'Swift'],
    bonds: [{ partnerId: 'royal-knight', bonus: 'Crit DMG +15%' }, { partnerId: 'paragon', bonus: 'ATK +10%' }],
    specialWeapon: { name: 'Spear of Odin', description: 'Skyfall stuns the target for 2s.' },
    exclusiveGear: { name: 'Winged Helm', statBonus: 'Crit Rate +15%, ATK +10%' }
  },
  { 
    id: 'astro-hunter', 
    image: '/img/heroes/astro-hunter.webp',
    imageUrl: '/img/heroes/astro-hunter.webp',
    name: 'Astro-Hunter', 
    faction: 'League', 
    rarity: 'Mythic', 
    role: 'DPS', 
    tier: 'S', 
    description: 'Ranged sniper with scaling damage based on distance. Keeps enemies at bay.',
    skills: [
        { name: 'Starshot', type: 'Ultimate', description: 'Fires a global beam dealing 400% ATK damage.' },
        { name: 'Gravity Trap', type: 'Active', description: 'Create a black hole that pulls enemies to the center.' },
        { name: 'Light Speed', type: 'Passive', description: 'Example Passive: Deals 10% more damage for every 5 meters of distance.' }
    ],
    recommendedSets: ['Warlord'],
    bonds: [{ partnerId: 'pyromancer', bonus: 'Crit Rate +12%' }],
    specialWeapon: { name: 'Cosmic Bow', description: 'Starshot executes enemies below 10% HP.' },
    exclusiveGear: { name: 'Void Quiver', statBonus: 'ATK +25%, Hit Rate +10%' }
  },
  { 
    id: 'artificer', 
    image: '/img/heroes/artificer.webp',
    imageUrl: '/img/heroes/artificer.webp',
    name: 'Artificer', 
    faction: 'League', 
    rarity: 'Mythic', 
    role: 'Support', 
    tier: 'S', 
    description: 'Mechanical genius that provides shields and turret fire. Controls the battlefield with tech.',
    skills: [
        { name: 'Sentry Turret', type: 'Ultimate', description: 'Deploys a turret that deals 100% ATK damage per second.' },
        { name: 'Overcharge', type: 'Active', description: 'Boosts the Attack Speed of all allies by 20%.' },
        { name: 'Repair Bot', type: 'Passive', description: 'Heals the lowest HP ally every 5s.' }
    ],
    recommendedSets: ['Sage', 'Guardian'],
    bonds: [{ partnerId: 'blacksmith', bonus: 'Skill DMG +15%' }],
    specialWeapon: { name: 'Wrench of Creation', description: 'Turrets now apply a slowing effect.' },
    exclusiveGear: { name: 'Tech Goggles', statBonus: 'Skill Haste +20%, HP +10%' }
  },
  { 
    id: 'nun', 
    image: '/img/heroes/nun.webp',
    imageUrl: '/img/heroes/nun.webp',
    name: 'Nun', 
    faction: 'League', 
    rarity: 'Mythic', 
    role: 'Support', 
    tier: 'S', 
    description: 'Cleanses debuffs and heals allies. A staple for sustain compositions.',
    skills: [
        { name: 'Holy Light', type: 'Ultimate', description: 'Heals all allies and removes all negative effects.' },
        { name: 'Blessing', type: 'Active', description: 'Grants a random buff to 3 allies.' }
    ],
    recommendedSets: ['Sage'],
    bonds: [{ partnerId: 'cleric', bonus: 'Healing +15%' }],
    specialWeapon: { name: 'Sacred Scripture', description: 'Overhealing is converted into a shield.' }
  },
  { 
    id: 'bishop', 
    image: '/img/heroes/bishop.webp',
    imageUrl: '/img/heroes/bishop.webp',
    name: 'Bishop', 
    faction: 'League', 
    rarity: 'Mythic', 
    role: 'Support', 
    tier: 'S', 
    description: 'Provides mana regeneration and invulnerability. Critical for ultimate-heavy teams.',
    skills: [
        { name: 'Sanctuary', type: 'Ultimate', description: 'Makes all allies invulnerable for 3s.' },
        { name: 'Mana Tide', type: 'Passive', description: 'Regenerates 5 Energy per second for all allies.' }
    ],
    recommendedSets: ['Sage'],
    specialWeapon: { name: 'Mitre of Power', description: 'Sanctuary lasts 1s longer.' }
  },
  { id: 'grand-master', image: '/img/heroes/grand-master.webp', name: 'Grand Master', faction: 'League', rarity: 'Mythic', role: 'Support', tier: 'S', description: 'Tactical genius who buffs team accuracy and crit.' },
  { id: 'royal-knight', image: '/img/heroes/royal-knight.webp', name: 'Royal Knight', faction: 'League', rarity: 'Mythic', role: 'Tank', tier: 'S', description: 'The King\'s personal guard. High physical defense.' },
  { id: 'secret-keeper', image: '/img/heroes/secret-keeper.webp', name: 'Secret Keeper', faction: 'League', rarity: 'Mythic', role: 'Support', tier: 'S', description: 'Silences enemies and prevents skill usage.' },
  { id: 'arcane-weaver', image: '/img/heroes/arcane-weaver.webp', name: 'Arcane Weaver', faction: 'League', rarity: 'Mythic', role: 'DPS', tier: 'A', description: 'Weaves spells to deal consistent magic damage.' },
  { id: 'inquisitor', image: '/img/heroes/inquisitor.webp', name: 'Inquisitor', faction: 'League', rarity: 'Legendary', role: 'Tank', tier: 'A', description: 'Anti-magic tank who absorbs spell damage.' },
  { id: 'blacksmith', image: '/img/heroes/blacksmith.webp', name: 'Blacksmith', faction: 'League', rarity: 'Legendary', role: 'Support', tier: 'B', description: 'Buffs team equipment stats temporarily.' },
  { id: 'musketeer', image: '/img/heroes/musketeer.webp', name: 'Musketeer', faction: 'League', rarity: 'Legendary', role: 'DPS', tier: 'B', description: 'Ranged unit with piercing shots.' },
  { id: 'shield-maiden', image: '/img/heroes/shield-maiden.webp', name: 'Shield Maiden', faction: 'League', rarity: 'Legendary', role: 'Tank', tier: 'B', description: 'Blocks frontal attacks.' },
  { id: 'hammer-vanguard', image: '/img/heroes/hammer-vanguard.webp', name: 'Hammer Vanguard', faction: 'League', rarity: 'Legendary', role: 'Tank', tier: 'B', description: 'Stuns enemies with a giant hammer.' },
  { id: 'paladin-league', image: '/img/heroes/paladin-league.webp', name: 'League Paladin', faction: 'League', rarity: 'Legendary', role: 'Tank', tier: 'B', description: 'Heals self while tanking.' },
  { id: 'cleric', image: '/img/heroes/cleric.webp', name: 'Cleric', faction: 'League', rarity: 'Epic', role: 'Healer', tier: 'C', description: 'Basic healer.' },
  { id: 'scholar', image: '/img/heroes/scholar.webp', name: 'Scholar', faction: 'League', rarity: 'Epic', role: 'Controller', tier: 'C', description: 'Knowledge is power.' },
  { id: 'templar', image: '/img/heroes/templar.webp', name: 'Templar', faction: 'League', rarity: 'Epic', role: 'Tank', tier: 'C', description: 'Frontline fodder.' },
  { id: 'guard', image: '/img/heroes/guard.webp', name: 'Guard', faction: 'League', rarity: 'Rare', role: 'Tank', tier: 'D' },
  { id: 'footman', image: '/img/heroes/footman.webp', name: 'Footman', faction: 'League', rarity: 'Rare', role: 'Tank', tier: 'D' },
  { id: 'archer-league', image: '/img/heroes/archer-league.webp', name: 'League Archer', faction: 'League', rarity: 'Rare', role: 'DPS', tier: 'D' },

  // --- HORDE FACTION (20 Heroes) ---
  { 
    id: 'wanderer', 
    image: '/img/heroes/wanderer.webp',
    imageUrl: '/img/heroes/wanderer.webp',
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
    image: '/img/heroes/shadow-priest.webp',
    imageUrl: '/img/heroes/shadow-priest.webp',
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
    image: '/img/heroes/headhunter.webp',
    imageUrl: '/img/heroes/headhunter.webp',
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
    image: '/img/heroes/desert-prince.webp',
    imageUrl: '/img/heroes/desert-prince.webp',
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
    image: '/img/heroes/bloodlust-bear.webp',
    imageUrl: '/img/heroes/bloodlust-bear.webp',
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
    image: '/img/heroes/warlock.webp',
    imageUrl: '/img/heroes/warlock.webp',
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
  { 
    id: 'wild-girl', 
    image: '/img/heroes/wild-girl.webp',
    imageUrl: '/img/heroes/wild-girl.webp',
    name: 'Wild Girl', 
    faction: 'Horde', 
    rarity: 'Mythic', 
    role: 'DPS', 
    tier: 'S', 
    description: 'Feral combatant with massive burst potential. Gains power as the fight drags on.',
    skills: [
        { name: 'Feral Rage', type: 'Ultimate', description: 'Enters a frenzy, increasing ATK Speed by 50% and Lifesteal by 20%.' },
        { name: 'Claw Swipe', type: 'Active', description: 'Deals 200% damage in a frontal cone.' }
    ],
    recommendedSets: ['Warlord', 'Titan'],
    bonds: [{ partnerId: 'headhunter', bonus: 'ATK +12%' }],
    specialWeapon: { name: 'Bone Necklace', description: 'Frenzy duration extended by 3s.' }
  },
  { 
    id: 'night-blade', 
    image: '/img/heroes/night-blade.webp',
    imageUrl: '/img/heroes/night-blade.webp',
    name: 'Night Blade', 
    faction: 'Horde', 
    rarity: 'Mythic', 
    role: 'DPS', 
    tier: 'S', 
    description: 'Master of shadows who strikes from the darkness.',
    skills: [
        { name: 'Assassinate', type: 'Ultimate', description: 'Deals 500% ATK damage to the enemy with the lowest HP.' },
        { name: 'Vanish', type: 'Active', description: 'Becomes invisible for 2s, dropping all aggro.' }
    ],
    recommendedSets: ['Swift'],
    bonds: [{ partnerId: 'wanderer', bonus: 'Crit DMG +20%' }],
    specialWeapon: { name: 'Moonlit Dagger', description: 'Assassinate resets cooldown on kill.' }
  },
  { 
    id: 'demon-king', 
    image: '/img/heroes/demon-king.webp',
    imageUrl: '/img/heroes/demon-king.webp',
    name: 'Demon King', 
    faction: 'Horde', 
    rarity: 'Mythic', 
    role: 'DPS', 
    tier: 'S', 
    description: ' Ruler of the abyss. Commands dark energies to obliterate foes.',
    skills: [
        { name: 'Oblivion', type: 'Ultimate', description: 'Deals massive AoE damage and reduces enemy healing by 50%.' },
        { name: 'Dark Aura', type: 'Passive', description: 'Nearby enemies have their DEF reduced by 15%.' }
    ],
    recommendedSets: ['Warlord'],
    bonds: [{ partnerId: 'warlock', bonus: 'Skill DMG +15%' }],
    specialWeapon: { name: 'Crown of Torment', description: 'Oblivion deals 20% more damage to shielded targets.' }
  },
  { id: 'blade-master', image: '/img/heroes/blade-master.webp', name: 'Blade Master', faction: 'Horde', rarity: 'Legendary', role: 'DPS', tier: 'A', description: 'Fast melee strikes. A whirlwind of steel.' },
  { id: 'shaman-horde', image: '/img/heroes/shaman-horde.webp', name: 'Horde Shaman', faction: 'Horde', rarity: 'Legendary', role: 'Support', tier: 'B', description: 'Totem buffer who grants ATK buffs.' },
  { id: 'reaper', image: '/img/heroes/reaper.webp', name: 'Reaper', faction: 'Horde', rarity: 'Legendary', role: 'DPS', tier: 'B', description: 'AoE scythe attacks that harvest souls.' },
  { id: 'barbarian', image: '/img/heroes/barbarian.webp', name: 'Barbarian', faction: 'Horde', rarity: 'Legendary', role: 'Tank', tier: 'B', description: 'Resilient warrior who refuses to die.' },
  { id: 'voodoo-doctor', image: '/img/heroes/voodoo-doctor.webp', name: 'Voodoo Doctor', faction: 'Horde', rarity: 'Legendary', role: 'Support', tier: 'B', description: 'Uses curses to weaken enemies.' },
  { id: 'beast-tamer', image: '/img/heroes/beast-tamer.webp', name: 'Beast Tamer', faction: 'Horde', rarity: 'Legendary', role: 'Hybrid', tier: 'B', description: 'Fights alongside a summoned beast.' },
  { id: 'bone-breaker', image: '/img/heroes/bone-breaker.webp', name: 'Bone Breaker', faction: 'Horde', rarity: 'Legendary', role: 'Tank', tier: 'B', description: 'Smashes armor.' },
  { id: 'goblin-rogue', image: '/img/heroes/goblin-rogue.webp', name: 'Goblin Rogue', faction: 'Horde', rarity: 'Epic', role: 'DPS', tier: 'C', description: 'Sneaky little stabber.' },
  { id: 'ogre-brute', image: '/img/heroes/ogre-brute.webp', name: 'Ogre Brute', faction: 'Horde', rarity: 'Epic', role: 'Tank', tier: 'C', description: 'Big dumb meat shield.' },
  { id: 'troll-priest', image: '/img/heroes/troll-priest.webp', name: 'Troll Priest', faction: 'Horde', rarity: 'Epic', role: 'Healer', tier: 'C', description: 'Voodoo healing.' },
  { id: 'grunt', image: '/img/heroes/grunt.webp', name: 'Grunt', faction: 'Horde', rarity: 'Rare', role: 'Tank', tier: 'D', description: 'Basic infantry.' },
  { id: 'skull-warrior', image: '/img/heroes/skull-warrior.webp', name: 'Skull Warrior', faction: 'Horde', rarity: 'Rare', role: 'DPS', tier: 'D', description: 'Skeleton soldier.' },
  { id: 'horde-sniper', image: '/img/heroes/horde-sniper.webp', name: 'Horde Sniper', faction: 'Horde', rarity: 'Rare', role: 'DPS', tier: 'D', description: 'Ranged backup.' },
];



export const PETS: Pet[] = [];
export const RELICS: Relic[] = [];
export const SKINS: Skin[] = [];

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
    description: 'The most important weekly Guild event. Six days of military-themed competitions where guilds battle for Victory Points. Each day requires specific preparation - follow the phase-by-phase guidance below.',
    isActive: true,
    phases: [
      {
        name: "Day 1: Construction Territory (Monday)",
        description: "Points for building upgrades, construction speed-ups, and diamond spending.",
        preparation: [
          "🏗️ Start 2-3 long building upgrades on Sunday afternoon (Castle, Barracks, Hospital)",
          "⏱️ Aim for 95% completion by Monday 00:00 UTC",
          "💎 Save construction speed-ups from guild gifts and VIP shop",
          "📅 Check which buildings give most points at your level"
        ],
        keyTasks: [
          "Complete all building upgrades you pre-started on Sunday",
          "Collect completions immediately when day starts for points",
          "Use construction speed-ups if needed (but save universal for Day 4/6)",
          "Coordinate with guild for simultaneous completions"
        ],
        pointsStrategy: `
📊 POINT VALUES:
• Building upgrade completion: Varies by level (Castle L25+ = highest)
• Construction Speed-up (1 min): ~2-3 points
• Diamond Spending: 1 diamond = 1 point

🎯 WINNING STRATEGY:
• Pre-complete 95% of upgrades BEFORE Monday
• Instant points when you collect on Monday morning
• Focus on highest-level buildings (Castle, Barracks, Hospital)
• Awards 1 VP (first race) or 2 VP (later races)
        `,
        tips: [
          "⏰ Set alarm for Sunday to start upgrades",
          "💎 Don't overspend diamonds - save for Day 4",
          "🏗️ Higher building levels = more points per completion",
          "⚡ Universal speed-ups are too valuable - save for Days 4 & 6"
        ]
      },
      {
        name: "Day 2: Tech Boost (Tuesday)",
        description: "Points for technology research, research speed-ups, and diamond spending.",
        preparation: [
          "📚 Start high-level research on Monday evening (T4/T5 military tech preferred)",
          "⏱️ Time completion for Tuesday morning (95% done)",
          "🎁 Claim research speed-ups from guild gifts",
          "💰 Buy speed-ups from VIP shop if needed"
        ],
        keyTasks: [
          "Complete all research you pre-started Monday evening",
          "Use research speed-ups strategically",
          "Focus on military research (gives more points than economic)",
          "Start saving stamina potions for Day 3"
        ],
        pointsStrategy: `
📊 POINT VALUES:
• Research completion: T4/T5 military = highest points
• Research Speed-up (1 min): ~2-3 points
• Diamond Spending: 1 diamond = 1 point

🎯 WINNING STRATEGY:
• Military research > Economic/Development research
• Pre-complete high-tier research before Tuesday
• Long research (7+ days) can span multiple weeks
        `,
        tips: [
          "📚 T5 unit research gives maximum points",
          "⏱️ Start long research Monday night for next week's race",
          "🎁 Check guild shop daily for speed-up deals",
          "💡 Economic research gives fewer points - avoid during event"
        ]
      },
      {
        name: "Day 3: Global Battles (Wednesday)",
        description: "Points for defeating monsters, boss rallies, and diamond spending.",
        preparation: [
          "🧪 Save 10-20 stamina potions from weekly rewards/guild shop (start 1-2 weeks early)",
          "🎯 Identify high-level monsters near you (Level 10+)",
          "🐉 Coordinate with guild leadership for boss rally schedule",
          "⚡ Ensure your hero lineup is optimized for PvE"
        ],
        keyTasks: [
          "Use ALL saved stamina potions today",
          "Only attack Level 8+ monsters (Level 10+ = 40,000pts each)",
          "Join EVERY guild boss rally (50,000-200,000pts each)",
          "Attack in waves - let stamina regenerate between sessions",
          "LAST CHANCE: Verify you have 50+ vouchers for tomorrow!"
        ],
        pointsStrategy: `
📊 POINT VALUES:
• Monster Level 10: 40,000 points
• Monster Level 15: 150,000 points
• Guild Boss Rally: 50,000-200,000 points (based on damage)
• Stamina Potion: Enables more attacks = more points

🎯 WINNING STRATEGY:
• NEVER attack monsters below Level 8 (waste of stamina)
• Use all 10-20 saved stamina potions
• Join every boss rally your guild launches
• Attack high-level Dark Legion if available
        `,
        tips: [
          "⚔️ Level 10+ monsters = 40,000+ points each",
          "🐉 Boss rallies = 100,000+ points per participation",
          "🧪 Each stamina potion = 5-10 extra attacks",
          "⏰ CRITICAL REMINDER: Tomorrow is Day 4 - verify voucher count NOW!"
        ]
      },
      {
        name: "Day 4: Call of the Hero (Thursday) ⭐ CRITICAL DAY",
        description: "THE MOST IMPORTANT DAY. Awards 2 Victory Points. This day alone can win or lose the entire Arms Race.",
        preparation: [
          "🎫 Save 50-100+ recruitment vouchers (START 1-2 WEEKS EARLY)",
          "💎 Save Universal Mythic hero shards (10,000pts each)",
          "🛒 Buy vouchers from: Guild Shop (daily), VIP Shop, Weekly Events",
          "❌ DO NOT use vouchers on non-Arms Race days!",
          "🤝 Coordinate with guild - everyone must go ALL IN today"
        ],
        keyTasks: [
          "Use ALL recruitment vouchers - ONLY do 10-pulls (12,000pts vs 10,000pts)",
          "Consume all saved hero shards (Universal Mythic = best)",
          "Upgrade heroes with shards earned",
          "Complete any hero promotions possible",
          "Guild-wide participation determines victory"
        ],
        pointsStrategy: `
📊 POINT VALUES:
• Recruitment 10-pull: 12,000 points (20% bonus!)
• Recruitment 1-pull: 10,000 points (NEVER DO THIS)
• Hero Shards:
  - Universal Mythic: 10,000 pts each
  - Mythic: 5,000 pts each
  - Legendary: 1,000 pts each
  - Epic: 200 pts each
  - Rare: 50 pts each
  - Common: 10 pts each

🎯 WINNING STRATEGY:
• 50 vouchers (5× 10-pulls) = 60,000 points MINIMUM
• 100 vouchers (10× 10-pulls) = 120,000 points
• Save Universal Mythic shards specifically for today
• This day awards 2 VICTORY POINTS (double!)
• Guild coordination CRITICAL - everyone participates

💰 MATH:
If you do single pulls instead of 10-pulls:
50 vouchers as singles = 50,000 points
50 vouchers as 10-pulls = 60,000 points
YOU LOSE 10,000 POINTS by doing singles!
        `,
        tips: [
          "🎯 This single day can swing the entire Arms Race",
          "💎 Never use vouchers outside Arms Race Day 4",
          "⭐ Universal Mythic shards worth 2x regular Mythic",
          "🤝 Guild must coordinate - losing Day 4 often = losing race",
          "⚠️ Used vouchers already this week? You just threw away points!",
          "📈 Even 50 vouchers makes huge difference for your guild"
        ]
      },
      {
        name: "Day 5: Combat Ready (Friday)",
        description: "Points for training troops, using training speed-ups, and diamond spending.",
        preparation: [
          "📦 Stock training resources from guild shop throughout the week",
          "🏗️ Ensure Training Grounds are MAX LEVEL before event",
          "⚡ Save training speed-ups from weekly rewards",
          "🎖️ Identify which troop tier you can train (T4 minimum, T5 ideal)"
        ],
        keyTasks: [
          "Promote T1 troops to T4 (faster & comparable points to fresh training)",
          "Or train fresh T4/T5 troops if you have resources",
          "Use training speed-ups to complete multiple batches",
          "Start preparing for Day 6 combat (tomorrow is highest value day!)"
        ],
        pointsStrategy: `
📊 POINT VALUES:
• Train T5: 100 pts per troop
• Train T4: 50 pts per troop
• Train T3: 20 pts per troop
• Promote T1→T4: 65 pts total (FASTER than fresh T4!)
• Training Speed-up (1 min): ~2-3 points

🎯 WINNING STRATEGY:
• Promoting T1→T4 is FASTER and gives comparable points
• Only train T4/T5 (lower tiers = waste of time)
• Use speed-ups to complete batches instantly
• Maximize training ground level before event
        `,
        tips: [
          "🏋️ Promotion strategy: T1→T4 saves hours vs fresh training",
          "⚡ Training speed-ups let you complete multiple batches",
          "🎖️ T5 gives 2× points vs T4 (if you have T5 unlocked)",
          "⏰ TOMORROW IS DAY 6 - Highest value day! Get ready!",
          "💡 Training Grounds level = max batch size = more efficiency"
        ]
      },
      {
        name: "Day 6: Invincible Warrior (Saturday) 🔥 HIGHEST VALUE DAY",
        description: "THE HIGHEST POINT VALUE DAY. Awards 4 Victory Points - more than Day 4! Combat and healing determines Arms Race winners.",
        preparation: [
          "🛡️ Buy 5-10× 24-hour shields (you'll need protection between attacks)",
          "🏥 Stock healing speed-ups and hospital capacity items",
          "🤝 Coordinate with guild leadership on combat strategy",
          "👥 Identify friendly non-opponent guild for point farming (advanced)",
          "💬 Join guild Discord/LINE for real-time coordination"
        ],
        keyTasks: [
          "Attack enemy guild members (coordinate guild vs guild combat)",
          "Heal ALL injured troops immediately (same points as kills!)",
          "Attack Level 10+ bosses to injure your troops, then heal for points",
          "Point farming: Coordinate with friendly guild for mutual attacks (both gain points)",
          "Go ALL IN - this day awards 4 VICTORY POINTS!"
        ],
        pointsStrategy: `
📊 POINT VALUES:
• Kill enemy T5: 200 pts per troop
• Kill enemy T4: 100 pts per troop
• Heal T5: 200 pts per troop
• Heal T4: 100 pts per troop
• Boss attacks = injure troops = heal for points

🎯 WINNING STRATEGY:
• Attack + Heal = DOUBLE points (kill 1000 T4 = 100k, heal 1000 T4 = 100k = 200k total!)
• Collaborate with non-opponent guilds for mutual attacks
• Attack bosses to safely injure your troops, then heal
• This day awards 4 VICTORY POINTS (MOST IMPORTANT!)

💡 ADVANCED STRATEGY - POINT FARMING:
1. Find friendly guild (not your opponent)
2. Both guilds agree to mutual attacks
3. Attack each other repeatedly (farm kills)
4. Heal troops after each attack (farm healing)
5. Both guilds gain massive points
6. This is allowed and used at high levels

⚠️ CRITICAL RULE:
• NO POINTS in final 15 minutes of event
• Plan attacks to finish 20min before event ends
        `,
        tips: [
          "⚔️ 4 Victory Points make this THE deciding day",
          "🤝 Point farming with friendly guilds = both gain huge points",
          "🏥 Heal immediately after each attack - don't let injured sit",
          "🐉 Boss attacks = safe way to injure troops for healing points",
          "⏰ STOP attacking 20min before event ends (15min rule + buffer)",
          "🎯 Strong Day 6 can overcome earlier deficits",
          "💬 Real-time communication critical - use voice chat",
          "🛡️ Use shields between attacks to avoid being zeroed"
        ]
      }
    ],
    rewardsHighlight: [
      "Victory Points: Day 4 = 2 VPs, Day 6 = 4 VPs, Other days = 1-2 VPs",
      "Individual milestone rewards based on your daily points",
      "Daily settlement rewards distributed each day",
      "Weekly victory bonus if guild wins",
      "Guild ranking rewards (top guilds get exclusive items)",
      "Season-long rewards from accumulated Victory Points"
    ]
  },

  // Keep other events but update Chess War and KvK similarly...
  {
    id: 'chess-war',
    image: '/img/heroes/chess-war.webp',
    imageUrl: '/img/heroes/chess-war.webp',
    name: 'Chess War',
    type: 'Bi-Weekly',
    scheduleType: 'Bi-Weekly',
    frequency: 'Rotates through 6 phases: Mon-Tue, Wed-Thu, Fri-Sat',
    duration: '2 days per phase',
    nextOccurrence: (() => {
      const now = new Date();
      const day = now.getUTCDay();
      let daysToAdd = 0;
      if (day === 0) daysToAdd = 1;
      else if (day === 1 || day === 2) daysToAdd = 0;
      else if (day === 3 || day === 4) daysToAdd = 0;
      else if (day === 5 || day === 6) daysToAdd = 0;
      const next = new Date(now);
      next.setUTCDate(now.getUTCDate() + daysToAdd);
      next.setUTCHours(0, 0, 0, 0);
      return next.toISOString();
    })(),
    preparationTime: '3-5 days before phase starts',
    description: 'Rotating 2-day events cycling through 6 different progression focuses. Track the rotation and prepare resources for each phase.',
    isActive: true,
    phases: [
      {
        name: "Phase 1: Construction Territory (Mon-Tue)",
        description: "Spend resources and complete bounty quests.",
        preparation: [
          "💎 Save Dragon Essence for 3-5 days (don't use on normal days!)",
          "🪵 Stockpile Timber, Stones, Rubies from gathering",
          "📋 Hold bounty quest completions until this phase starts"
        ],
        keyTasks: [
          "Use all saved Dragon Essence (3,200 points each!)",
          "Spend Timber, Stones, Rubies",
          "Complete ALL bounty quests",
          "Refresh bounty board for highest-value quests"
        ],
        pointsStrategy: `
📊 POINT VALUES:
• Dragon Essence: 3,200 pts each (HIGHEST VALUE)
• Timber/Stones/Rubies: 100 pts per 10,000 resources
• Bounty Quests: 200-1,000 pts by difficulty

🎯 STRATEGY:
• Dragon Essence is most valuable - save specifically for this
• Complete all bounty quests for easy points
        `,
        tips: [
          "💎 Dragon Essence = best points-per-item ratio",
          "📋 Refresh bounty board to get high-point quests"
        ]
      },
      {
        name: "Phase 2: Hero Development (Wed-Thu)",
        description: "Consume hero shards and soul stones.",
        preparation: [
          "⭐ Save ALL hero shards for this phase (don't use on normal days)",
          "💎 Stockpile soul stones from weekly rewards",
          "📊 Prioritize Mythic/Legendary shards (highest points)"
        ],
        keyTasks: [
          "Use all saved hero shards (Mythic/Legendary first)",
          "Consume soul stones for hero upgrades",
          "Level up and promote heroes"
        ],
        pointsStrategy: `
📊 POINT VALUES:
• Mythic shards: 5,000 pts each
• Legendary shards: 1,000 pts each
• Epic shards: 200 pts each
• Soul stones: 100-500 pts

🎯 STRATEGY:
• Save shards from all sources for this 2-day window
• Mythic shards = best value
        `,
        tips: [
          "⭐ Don't use shards outside this phase - pure waste",
          "💎 Mythic shards worth 5× Legendary"
        ]
      },
      {
        name: "Phase 3: Decor Upgrade (Fri-Sat)",
        description: "Increase decoration rating.",
        preparation: [
          "🎨 Save decoration materials from events",
          "🏰 Identify cheap decorations to upgrade (more upgrades = more points)"
        ],
        keyTasks: [
          "Activate new decorations",
          "Upgrade existing decorations",
          "Focus on multiple small upgrades vs one large"
        ],
        pointsStrategy: `
📊 POINT VALUES:
• Decor Rating +1 = 3 Trial Points (simple!)

🎯 STRATEGY:
• Multiple small upgrades better than one large
• Easiest Chess War phase
        `,
        tips: [
          "🎨 Simplest phase - just upgrade decorations",
          "🏰 Focus on cheap upgrades for maximum rating increases"
        ]
      },
      {
        name: "Phase 4: Troop Skin Boost (Mon-Tue)",
        description: "Upgrade troop skins.",
        preparation: [
          "🎭 Save skin materials from events (very rare!)",
          "⭐ Prioritize Epic/Legendary skin upgrades"
        ],
        keyTasks: [
          "Upgrade troop skins (Epic/Legendary = highest points)",
          "Consume saved skin materials",
          "Activate new skins"
        ],
        pointsStrategy: `
📊 POINT VALUES:
• Legendary skin upgrade: 5,000 pts
• Epic skin upgrade: 2,000 pts
• Rare skin upgrade: 500 pts

🎯 STRATEGY:
• Skin materials are extremely rare - save them!
• Higher rarity = exponentially more points
        `,
        tips: [
          "🎭 Skin materials very rare - hoard them",
          "⭐ Legendary upgrades worth 10× Rare"
        ]
      },
      {
        name: "Phase 5: Relic Race (Wed-Thu)",
        description: "Activate and upgrade Relics.",
        preparation: [
          "⚔️ Save relic shards from all sources",
          "🎯 Identify which relics to activate (Epic+ = best points)"
        ],
        keyTasks: [
          "Activate new relics (Epic+ priority)",
          "Upgrade existing relics",
          "Consume relic shards"
        ],
        pointsStrategy: `
📊 POINT VALUES:
• Epic+ relic activation: 5,000-10,000 pts
• Relic upgrades: 500-5,000 pts per level
• Relic shards: 100-500 pts each

🎯 STRATEGY:
• Epic+ relic activations = highest value
• Save shards for this phase only
        `,
        tips: [
          "⚔️ Relic shards precious - don't waste",
          "🎯 Epic+ relics = best activation points"
        ]
      },
      {
        name: "Phase 6: Gear Trial (Fri-Sat)",
        description: "Upgrade Lord Gear.",
        preparation: [
          "⚔️ Save refined metal from guild shop (very rare!)",
          "💎 Stock gear upgrade materials",
          "🏆 Focus on Lord Gear (gives more points)"
        ],
        keyTasks: [
          "Upgrade Lord Gear pieces",
          "Use all saved refined metal",
          "Consume gear materials"
        ],
        pointsStrategy: `
📊 POINT VALUES:
• Gear upgrade: 500-2,000 pts per level
• Refined metal: 200 pts each
• Materials: 100-500 pts

🎯 STRATEGY:
• Refined metal is rare - save for this
• Lord Gear > normal gear for points
        `,
        tips: [
          "⚔️ Refined metal extremely rare",
          "💎 Lord Gear upgrades = best value"
        ]
      }
    ],
    rewardsHighlight: [
      "Tiered rewards: 1,000 to 80,000+ Trial Points",
      "Phase-specific heroes (Knight, Bishop, Warlock, Rook)",
      "Crafting materials and rare resources"
    ]
  },

  // Simplified entries for other events (can expand these later)
  {
    id: 'kingdom-vs-kingdom',
    image: '/img/heroes/kingdom-vs-kingdom.webp',
    imageUrl: '/img/heroes/kingdom-vs-kingdom.webp',
    name: 'Kingdom vs Kingdom (KvK)',
    type: 'Server War',
    scheduleType: 'Manual',
    frequency: 'Monthly',
    duration: '8 days total',
    description: 'Massive server vs server war. Preparation phase (5 days) determines damage buffs for war day.',
    isActive: false,
    phases: [
      {
        name: "Preparation Phase (Days 3-7)",
        description: "Complete daily tasks to earn server damage buffs.",
        preparation: [
          "🛡️ Buy 10-15× 24-hour shields",
          "📍 Stock 10-20 Relocators (Advanced preferred)",
          "🎖️ Ensure you have T4 or T5 troops unlocked",
          "🏥 Save healing speed-ups and resources"
        ],
        keyTasks: [
          "Complete all 5 preparation days (like mini Arms Race)",
          "Winning prep = +3-5% damage buff for war",
          "Full server participation required"
        ],
        pointsStrategy: `
Winning preparation gives server-wide damage buffs:
• Win prep: +3% damage
• Win by 25%+: +5% damage
• These buffs can decide the war!
        `
      },
      {
        name: "War Day (Day 8)",
        description: "4-hour Royal Castle siege.",
        preparation: [
          "💬 Join guild Discord/LINE for coordination",
          "📅 Block out 4-6 hours for war window",
          "🤝 Coordinate with guild on attack/defense roles"
        ],
        keyTasks: [
          "Control Magic Tower for 2 cumulative hours",
          "Follow rally leaders - NEVER solo attack",
          "Use free relocations to position near objectives"
        ],
        pointsStrategy: `
Victory Condition: Hold Magic Tower for 2 hours
• Join rallies only - solo = instant death
• Use shields when not actively fighting
• Real-time coordination essential
        `
      }
    ],
    rewardsHighlight: [
      "Exclusive throne skins (winners)",
      "Massive Mythic hero shards",
      "Server damage buffs"
    ]
  },

  // Daily events (minimal detail)
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
    type: 'Guild PvP',
    frequency: 'Weekly',
    description: 'Guild vs Guild 20v20 battles.',
    isActive: false,
    rewardsHighlight: ["Points-based rewards"]
  },
  {
    id: 'glory-battlefield',
    image: '/img/heroes/glory-battlefield.webp',
    imageUrl: '/img/heroes/glory-battlefield.webp',
    name: 'Glory Battlefield',
    type: 'PvP Arena',
    frequency: 'Multiple weekly',
    description: 'Non-guild 5v5 PvP.',
    isActive: false,
    rewardsHighlight: ["Victory/defeat rewards"]
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
