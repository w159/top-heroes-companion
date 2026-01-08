import requests
from bs4 import BeautifulSoup
import re
import json
import os
import time

# Config
BASE_URL = "https://topheroes.info"
HERO_LIST_URL = f"{BASE_URL}/hero.php"
OUTPUT_DIR = "docs/heroes"
IMG_DIR = "static/img/heroes"

os.makedirs(OUTPUT_DIR, exist_ok=True)
os.makedirs(IMG_DIR, exist_ok=True)

headers = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36"
}

def download_image(hero_slug, web_slug):
    # Try multiple naming conventions
    # 1. Exact match to hero_slug from JSON (e.g. "tidecaller")
    # 2. Match to web_slug (e.g. "tidecaller" or "altar-marshal")
    candidates = [hero_slug, web_slug, hero_slug.replace('-', ''), web_slug.replace('-', '')]
    extensions = ['webp', 'png', 'jpg']
    
    for name in set(candidates):
        for ext in extensions:
            filename = f"{web_slug}.{ext}" # Canonical filename we want locally
            filepath = os.path.join(IMG_DIR, filename)
            
            # If we already have it, skip
            if os.path.exists(filepath) and os.path.getsize(filepath) > 1000:
                return filename

            url = f"{BASE_URL}/assets/heroes/{name}.{ext}"
            try:
                # print(f"  Checking {url}...") 
                resp = requests.get(url, headers=headers)
                if resp.status_code == 200:
                    print(f"  Downloading image from {url}")
                    with open(filepath, 'wb') as f:
                        f.write(resp.content)
                    return filename
            except Exception:
                pass
    
    return "placeholder.png"

def extract_json_from_html(content):
    # upgraded to find HERO_MASTER specifically
    # Pattern: const HERO_MASTER = {...};
    match = re.search(r'const\s+HERO_MASTER\s*=\s*({.*?});', content, re.DOTALL)
    if match:
        try:
            return json.loads(match.group(1))
        except:
            pass
            
    # Fallback to old patterns if needed (though HERO_MASTER is the new truth)
    # Try different regex patterns to support variances in pages
    patterns = [
        r'(?:const|var|let|window\.)\s*\w+\s*=\s*(\[\{"hero_id":.*?\}\]);', # Variable assignment
        r'(\[\{"hero_id":.*?\}\])', # Raw list, relying on simple brackets
    ]
    
    for pattern in patterns:
        match = re.search(pattern, content, re.DOTALL)
        if match:
             try:
                 data = json.loads(match.group(1))
                 return data
             except:
                 pass
    return None

def generate_markdown(hero, filename):
    if not filename.endswith('.md'):
        filename += '.md'
        
    # Prepare props for React Component
    clean_skills = []
    if 'skills' in hero:
        for s in hero['skills']:
            clean_skills.append({
                'name': s.get('name', 'Unknown'),
                'type': s.get('type', 'Passive'),
                'description': s.get('base_description', '').replace('"', "'").replace('\n', ' '),
                'tips': s.get('tips', '').replace('"', "'")
            })
            
    # New Metadata extraction
    gear_set = hero.get('gear', {}).get('default_set_name', 'None')
    positions = hero.get('positions', [])
    unique_weapon = hero.get('unique_weapon', 'None')
    
    skills_json = json.dumps(clean_skills)
    positions_json = json.dumps(positions)
    
    # Image filename logic
    image_file = download_image(hero.get('hero_id', hero.get('id', filename.replace('.md', ''))), filename.replace('.md', ''))
    
    # MDX Content
    md_content = f"""---
title: {hero.get('hero_name', hero.get('name', 'Unknown'))}
description: Guide for {hero.get('hero_name', hero.get('name', 'Unknown'))}
image: {image_file}
tags: [{hero.get('rarity', 'Legendary')}, {hero.get('faction', 'Unknown')}, Hero]
---

import HeroProfile from '@site/src/components/HeroProfile';

<HeroProfile 
  name="{hero.get('hero_name', hero.get('name', 'Unknown'))}"
  rarity="{hero.get('rarity', 'Legendary')}"
  faction="{hero.get('faction', 'Unknown')}"
  role="{hero.get('role', 'DPS')}"
  image="{image_file}"
  gear="{gear_set}"
  positions={{{positions_json}}}
  uniqueWeapon="{unique_weapon}"
  skills={{{skills_json}}}
/>

"""
    
    filepath = os.path.join(OUTPUT_DIR, filename)
    with open(filepath, 'w') as f:
        f.write(md_content)
    print(f"Generated {filename}")


def main():
    print("Fetching hero list...")
    resp = requests.get(HERO_LIST_URL, headers=headers)
    soup = BeautifulSoup(resp.content, 'html.parser')
    
    links = soup.find_all('a', href=re.compile(r'/hero/'))
    
    # Track processed to avoid duplicates
    processed_slugs = set()
    
    for link in links:
        href = link['href'] # e.g. /hero/altar-marshal
        web_slug = href.split('/')[-1]
        
        if web_slug in processed_slugs: continue
        processed_slugs.add(web_slug)
        
        # Try to detect faction from the list page link context
        # Usually the list is organized by sections or the link itself contains info?
        # The previous scraper used text content.
        link_text = link.get_text().strip()
        # Sometimes the faction is in the text if we parse the full card, but here 'link' is just the <a>...
        # Let's inspect the parent or text content more broadly if possible
        # Actually, let's just use what we have:
        detected_faction = "Unknown"
        if "Nature" in link_text: detected_faction = "Nature"
        elif "Horde" in link_text: detected_faction = "Horde"
        elif "League" in link_text: detected_faction = "League"
        # Often the simple link text is just the name.
        # But maybe the previous scraper was iterating distinct list items.
        
        # Let's try to look at parent text if simple text fails
        if detected_faction == "Unknown":
            parent_text = link.find_parent('div').get_text() if link.find_parent('div') else ""
            if "Nature" in parent_text: detected_faction = "Nature"
            elif "Horde" in parent_text: detected_faction = "Horde"
            elif "League" in parent_text: detected_faction = "League"

        full_url = f"{BASE_URL}/{href.lstrip('/')}"
        print(f"Processing {web_slug} (Faction: {detected_faction})...")
        
        try:
            page_resp = requests.get(full_url, headers=headers)
            json_data = extract_json_from_html(page_resp.text)
            
            if json_data:
                target_hero = None
                
                # Determine the list of heroes to search
                heroes_list = []
                if isinstance(json_data, list):
                    heroes_list = json_data
                elif isinstance(json_data, dict):
                    # Check for 'heroes' key in HERO_MASTER
                    if 'heroes' in json_data and isinstance(json_data['heroes'], list):
                        heroes_list = json_data['heroes']
                    # Fallback or other structure handling can go here
                
                if heroes_list:
                    # Search logic
                    # First pass: try to match hero_id/id to 'simple' slug (remove dashes)
                    simple_slug = web_slug.replace('-', '').lower()
                    
                    for h in heroes_list:
                        hid = h.get('hero_id', h.get('id', '')).replace('-', '').lower()
                        # Also check 'slug' field
                        hslug = h.get('slug', '').replace('-', '').lower()
                        
                        if hid == simple_slug or hslug == simple_slug:
                            target_hero = h
                            break
                    
                    # Second pass: Try name match
                    if not target_hero:
                         link_text_lower = link_text.lower() 
                         for h in heroes_list:
                             name = h.get('hero_name', h.get('name', '')).lower()
                             if name and name in link_text_lower:
                                 target_hero = h
                                 break

                if target_hero:
                    generate_markdown(target_hero, web_slug)
                else:
                    print(f"  Could not match JSON data to {web_slug}. Using HTML fallback.")
                    # Fallback object
                    fallback_hero = {
                        'hero_name': web_slug.replace('-', ' ').title(),
                        'hero_id': web_slug,
                        'faction': detected_faction, 
                        'rarity': 'Legendary' # Default
                    }
                    generate_markdown(fallback_hero, web_slug)
            else:
                print(f"  No JSON found for {web_slug}. Using HTML fallback.")
                fallback_hero = {
                    'hero_name': web_slug.replace('-', ' ').title(),
                    'hero_id': web_slug,
                    'faction': detected_faction,
                    'rarity': 'Legendary'
                }
                generate_markdown(fallback_hero, web_slug)
                
        except Exception as e:
            print(f"  Error processing {web_slug}: {e}")
            
        time.sleep(0.5)

if __name__ == '__main__':
    main()
