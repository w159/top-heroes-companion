import requests
from bs4 import BeautifulSoup
import os
import re
import time

BASE_URL = "https://topheroes.info"
HERO_LIST_URL = f"{BASE_URL}/hero.php"
OUTPUT_DIR = "docs/heroes"
IMG_DIR = "static/img/heroes"

os.makedirs(OUTPUT_DIR, exist_ok=True)
os.makedirs(IMG_DIR, exist_ok=True)

headers = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36"
}

def clean_text(text):
    if not text: return ""
    return text.strip()

def download_image(img_url, hero_slug):
    if not img_url:
        return "placeholder.png"
    
    if not img_url.startswith("http"):
        img_url = f"{BASE_URL}/{img_url.lstrip('/')}"
        
    try:
        filename = f"{hero_slug}.png"
        filepath = os.path.join(IMG_DIR, filename)
        
        # specific fix for warlock which might be large
        if os.path.exists(filepath) and os.path.getsize(filepath) > 1000:
            return filename
            
        print(f"  Downloading image: {img_url}")
        img_data = requests.get(img_url, headers=headers).content
        with open(filepath, 'wb') as handler:
            handler.write(img_data)
        return filename
    except Exception as e:
        print(f"  Failed to download image: {e}")
        return "placeholder.png"

def parse_hero_page(hero_url, hero_name, rarity, faction):
    print(f"Processing {hero_name} from {hero_url}...")
    try:
        resp = requests.get(hero_url, headers=headers)
        soup = BeautifulSoup(resp.content, 'html.parser')
        
        # 1. Image Extraction
        # Priority: Specific styling class found by subagent
        img_tag = soup.select_one('img.rounded-2xl.object-cover.shadow-lg')
        if not img_tag:
            img_tag = soup.find('img', alt=hero_name)
        
        # Fallbacks
        if not img_tag:
            content_div = soup.find('div', {'class': 'entry-content'})
            if content_div:
                img_tag = content_div.find('img')
        
        img_src = None
        if img_tag:
            img_src = img_tag.get('src')
            # Handle relative URLs if any
            if img_src and not img_src.startswith('http'):
                img_src = f"{BASE_URL}/{img_src.lstrip('/')}"

        print(f"  Found image src: {img_src}")
        
        slug = hero_name.lower().replace(' ', '-').replace("'", "")
        local_image = download_image(img_src, slug)
        
        # 2. Skill Extraction
        skills = []
        # Selector based on subagent findings: div.p-4.rounded-xl.bg-white/90
        # We look for the skill title class
        skill_titles = soup.select('.text-sm.font-bold.text-slate-900')
        
        for title_el in skill_titles:
            # Navigate up to the container
            container = title_el.find_parent('div', class_='rounded-xl')
            if not container:
                continue
                
            skill_name = title_el.get_text(strip=True)
            
            # Description is usually in a p tag with specific styling
            desc_el = container.select_one('p.text-\[13px\].text-slate-800')
            description = desc_el.get_text(strip=True) if desc_el else "Description not available."
            
            # Tags (Active/Passive/etc)
            tags = [tag.get_text(strip=True) for tag in container.select('span.rounded-full')]
            
            skills.append({
                'name': skill_name,
                'description': description,
                'tags': tags
            })

        # 3. Recommended Queues (Heuristic search)
        queues = []
        # Look for sections that might contain queue info. 
        # Often headers "Lineups" or "Queues"
        # Based on typical structure, might be text based. We'll scan headers.
        for header in soup.find_all(['h2', 'h3']):
            if "Queue" in header.get_text() or "Lineup" in header.get_text():
                # Grab the next few siblings?
                # detailed logic omitted to keep it simple, placeholder for now
                pass

        # 4. Generate Markdown
        skill_section = ""
        if skills:
            skill_section = "## Skills\n\n"
            for skill in skills:
                tags_str = ", ".join([f"`{t}`" for t in skill['tags']])
                skill_section += f"### {skill['name']}\n"
                if tags_str:
                    skill_section += f"**Type:** {tags_str}\n\n"
                skill_section += f"{skill['description']}\n\n---\n\n"
        else:
            skill_section = "## Skills\n\n*Skill data currently unavailable.*\n"

        md_content = f"""---
title: {hero_name}
description: Complete guide for {hero_name} ({rarity} {faction}) - Skills, Gears, and Lineups.
tags: [{rarity}, {faction}, Hero]
---

# {hero_name}

<div className="hero-header">
  <img src="/img/heroes/{local_image}" alt="{hero_name}" width="200" />
  <div className="hero-info">
    <p><strong>Faction:</strong> {faction}</p>
    <p><strong>Rarity:</strong> {rarity}</p>
    <p><strong>Role:</strong> (Role functionality coming soon)</p>
  </div>
</div>

## Overview

{hero_name} is a {rarity} hero from the {faction} faction.

{skill_section}

## Recommended Queues

*Coming soon. Check back for updated lineup strategies.*

## Gear Priorities

*Coming soon.*

<br/>

<small>Data sourced from [TopHeroes.info]({hero_url})</small>
"""
        
        filename = f"{slug}.md"
        with open(os.path.join(OUTPUT_DIR, filename), 'w') as f:
            f.write(md_content)
            
        print(f"  Generated {filename} with {len(skills)} skills")
        
    except Exception as e:
        print(f"  Error processing {hero_name}: {e}")

def main():
    print("Fetching hero list...")
    resp = requests.get(HERO_LIST_URL, headers=headers)
    soup = BeautifulSoup(resp.content, 'html.parser')
    
    links = soup.find_all('a', href=re.compile(r'/hero/'))
    
    seen = set()
    count = 0
    
    for link in links:
        href = link['href']
        full_url = f"{BASE_URL}/{href.lstrip('/')}"
        
        # Extract Name
        clean_lines = [l.strip() for l in link.get_text("\n").split("\n") if l.strip()]
        if not clean_lines: continue
        name = clean_lines[0]
        
        if not name or name in seen: continue
        seen.add(name)
        
        # Faction & Rarity Heuristics
        full_text = link.get_text()
        faction = "Unknown"
        if "Nature" in full_text: faction = "Nature"
        elif "Horde" in full_text: faction = "Horde"
        elif "League" in full_text: faction = "League"
        
        rarity = "Legendary" 
        # Known Mythics (expand list as needed)
        mythics = ["Paragon", "Tidecaller", "Storm", "Pixie", "Sage", "Monkey", "Panda", "Rose"]
        if any(m in name for m in mythics):
            rarity = "Mythic"
            
        # Rate limit to avoid being blocked
        parse_hero_page(full_url, name, rarity, faction)
        count += 1
        time.sleep(1) # Be nice to the server
        
        if count >= 30: # Limit for now to test
            print("limit reached for test run")
            break

if __name__ == "__main__":
    main()
