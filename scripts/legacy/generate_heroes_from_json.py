import json
import os
import re
import requests

# Config
IMG_DIR = "static/img/heroes"
OUTPUT_DIR = "docs/heroes"
BASE_URL = "https://topheroes.info"

os.makedirs(IMG_DIR, exist_ok=True)
os.makedirs(OUTPUT_DIR, exist_ok=True)

def download_image(hero_slug):
    # Try webp first as seen in source
    extensions = ['webp', 'png', 'jpg']
    for ext in extensions:
        url = f"{BASE_URL}/assets/heroes/{hero_slug}.{ext}"
        try:
            filename = f"{hero_slug}.{ext}"
            filepath = os.path.join(IMG_DIR, filename)
            if os.path.exists(filepath):
                 return filename
            
            print(f"Downloading {url}...")
            resp = requests.get(url, headers={"User-Agent": "Mozilla/5.0"})
            if resp.status_code == 200:
                with open(filepath, 'wb') as f:
                    f.write(resp.content)
                return filename
        except Exception as e:
            print(f"Failed to download {url}: {e}")
    return "placeholder.png"

def generate_markdown(hero):
    name = hero.get('hero_name', 'Unknown')
    slug = hero.get('hero_id', name.lower().replace(' ', '-'))
    faction = hero.get('faction', 'Unknown')
    # Default rarity logic if not in JSON (it wasn't in the snippet provided, but we can infer or default)
    # The snippet didn't show 'rarity' field explicitly in the grep, but maybe it's there.
    # If not, we use the list from before.
    rarity = hero.get('rarity', 'Legendary')
    
    # Heuristics for Rarity if missing
    mythics = ["Paragon", "Tidecaller", "Storm", "Pixie", "Sage", "Monkey", "Panda", "Rose", "Aahura", "Soulmancer", "Wanderer", "Desert Prince", "Astrologer"]
    if any(m in name for m in mythics):
        rarity = "Mythic"

    image_file = download_image(slug)
    
    # Skills
    skills_md = ""
    if 'skills' in hero:
        for skill in hero['skills']:
            s_name = skill.get('name', 'Unnamed Skill')
            s_type = skill.get('type', 'Passive').capitalize()
            s_cooldown = skill.get('cooldown_sec')
            s_desc = skill.get('base_description', '')
            
            cd_str = f" ({s_cooldown}s CD)" if s_cooldown else ""
            
            skills_md += f"### {s_name}\n"
            skills_md += f"**Type:** {s_type}{cd_str}\n\n"
            skills_md += f"{s_desc}\n\n"
            
            # Star levels
            if 'star_levels' in skill and skill['star_levels']:
                skills_md += "**Upgrades:**\n"
                for star in skill['star_levels']:
                    stars_icon = "⭐" * star['stars']
                    skills_md += f"- **{stars_icon}**: {star['description']}\n"
            
            skills_md += "\n---\n\n"
    
    md_content = f"""---
title: {name}
description: Complete guide for {name} ({rarity} {faction})
tags: [{rarity}, {faction}, Hero]
---

# {name}

<div className="hero-header">
  <img src="/img/heroes/{image_file}" alt="{name}" width="200" />
  <div className="hero-info">
    <p><strong>Faction:</strong> {faction}</p>
    <p><strong>Rarity:</strong> {rarity}</p>
    <p><strong>Role:</strong> DPS/Support (Automated Role Detection Coming Soon)</p>
  </div>
</div>

## Overview

{name} is a {rarity} hero from the {faction} faction.

## Skills

{skills_md}

## Recommended Queues

*Updated lineup strategies coming soon.*

<small>Data sourced from TopHeroes.info</small>
"""
    
    with open(os.path.join(OUTPUT_DIR, f"{slug}.md"), 'w') as f:
        f.write(md_content)
    print(f"Generated {slug}.md")

def main():
    # Read the extracted script content
    try:
        with open('debug_script_content.js', 'r') as f:
            content = f.read()
            
        # Extract the JSON list
        # We look for the start of the list `[{"hero_id":`
        # And hopefully a closing `]`
        # Since it's nested in a huge string/object, regex is safer if we target the structure
        
        # Regex to find `[{ "hero_id": ... }]`
        # We use a non-greedy match valid for JSON structure
        # Use simple string finding for robustness
        start_marker = '[{"hero_id":'
        start_idx = content.find(start_marker)
        
        if start_idx == -1:
            print("Could not find start of hero list")
            return

        # Simple bracket balancing to find the end
        balance = 0
        end_idx = -1
        for i in range(start_idx, len(content)):
            char = content[i]
            if char == '[':
                balance += 1
            elif char == ']':
                balance -= 1
                if balance == 0:
                    end_idx = i + 1
                    break
        
        if end_idx != -1:
            json_str = content[start_idx:end_idx]
            try:
                heroes = json.loads(json_str)
                print(f"Found {len(heroes)} heroes.")
                for hero in heroes:
                    generate_markdown(hero)
            except json.JSONDecodeError as e:
                print(f"JSON Parse Error: {e}")
                # debug
                print(json_str[:200])
        else:
            print("Could not find end of JSON list")

    except FileNotFoundError:
        print("debug_script_content.js not found")

if __name__ == '__main__':
    main()
