
import os

heroes = [
    {"name": "Adjudicator", "faction": "League", "role": "Tank", "desc": "Frontline durability expert."},
    {"name": "Bishop", "faction": "League", "role": "Support", "desc": " Healer and buffer for League teams."},
    {"name": "Paragon", "faction": "League", "role": "DPS", "desc": "High burst damage sniper."},
    {"name": "Pyromancer", "faction": "Horde", "role": "DPS", "desc": "AoE fire damage dealer."},
    {"name": "Rose Princess", "faction": "Nature", "role": "Support", "desc": "Control and healing utility."},
    {"name": "Secret Keeper", "faction": "League", "role": "Control", "desc": "Silences and disrupts enemies."},
    {"name": "Sage", "faction": "League", "role": "Support", "desc": "Powerful shields and buffs."},
     {"name": "Soulmancer", "faction": "Horde", "role": "DPS", "desc": "Dark magic user with lifesteal."},
    {"name": "Treeguard", "faction": "Nature", "role": "Tank", "desc": "Massive HP tank with regeneration."},
    {"name": "Warlock", "faction": "Horde", "role": "Control", "desc": "Curses enemies to take more damage."},
    {"name": "Astrologer", "faction": "League", "role": "Support", "desc": "Fate-twisting support."},
    {"name": "Barbarian", "faction": "Horde", "role": "Tank", "desc": "Aggressive frontline tank."},
    {"name": "Blacksmith", "faction": "League", "role": "Tank", "desc": "Forges armor for allies."},
    {"name": "Bounty Hunter", "faction": "Horde", "role": "DPS", "desc": "Single target executioner."},
    {"name": "Desert Prince", "faction": "Horde", "role": "DPS", "desc": "Sand-based AoE damage."},
    {"name": "Druid", "faction": "Nature", "role": "Healer", "desc": "Nature's restoration expert."},
    {"name": "Elementalist", "faction": "Nature", "role": "DPS", "desc": "Master of elemental magic."},
    {"name": "Headhunter", "faction": "Horde", "role": "DPS", "desc": "Ranged physical damage."},
    {"name": "Knight", "faction": "League", "role": "Tank", "desc": "Classic sword and board tank."},
    {"name": "Nun", "faction": "League", "role": "Healer", "desc": " dedicated single target healer."},
    {"name": "Pathfinder", "faction": "Nature", "role": "DPS", "desc": "Ranged nature damage."},
    {"name": "Rogue", "faction": "Horde", "role": "DPS", "desc": "Backline assassin."},
    {"name": "Shaman", "faction": "Horde", "role": "Support", "desc": "Totem-based buffs."},
    {"name": "Swordmaster", "faction": "League", "role": "DPS", "desc": "Melee DPS specialist."},
    {"name": "Windwalker", "faction": "Nature", "role": "DPS", "desc": "Fast-attacking wind user."},
    {"name": "Witch", "faction": "Horde", "role": "Control", "desc": "Hexes and polymorphs."},
]

base_path = "docs/heroes"

for hero in heroes:
    slug = hero["name"].lower().replace(" ", "-")
    filename = f"{base_path}/{slug}.md"
    
    # Determine placeholder image based on faction
    img = "placeholder.png"
    if hero["faction"] == "League": img = "placeholder_league.png"
    if hero["faction"] == "Horde": img = "placeholder_horde.png"
    if hero["faction"] == "Nature": img = "placeholder_nature.png"

    content = f"""---
title: {hero['name']}
description: Complete guide for {hero['name']} ({hero['faction']} {hero['role']})
tags: [{hero['faction']}, {hero['role']}, Hero]
---

# {hero['name']}

![{hero['name']}](/img/{img})

## Overview
**Faction:** {hero['faction']}
**Role:** {hero['role']}

{hero['desc']}

## Skills
*(Detailed skill data coming soon)*

## Gear Recommendations
- **Set:** Coming soon.
- **Stats:** Coming soon.

## Analysis
{hero['name']} is a key unit in {hero['faction']} compositions.
"""
    
    with open(filename, "w") as f:
        f.write(content)
        print(f"Created {filename}")

print("Mass generation complete.")
