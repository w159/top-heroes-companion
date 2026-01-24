
import os
import requests
from bs4 import BeautifulSoup
import time

# Comprehensive list from research
heroes = [
    "Adjudicator", "Astrologer", "Barbarian", "Bard", "Beastmaster", "Bishop", 
    "Blacksmith", "Bounty Hunter", "Dancer", "Desert Prince", "Druid", "Elementalist",
    "Forest Maiden", "Headhunter", "Hostess", "Knight", "Minister", "Monk", "Nezha",
    "Nun", "Outlaw", "Paragon", "Pathfinder", "Petalis", "Pixie", "Priestess", 
    "Pyromancer", "Ranger", "Rogue", "Rose Princess", "Sage", "Secret Keeper", 
    "Shaman", "Soulmancer", "Stonemason", "Storm Maiden", "Swordmaster", 
    "Tidecaller", "Treeguard", "Warlock", "Watcher", "Wilderness Hunter", 
    "Windwalker", "Witch", "Wukong", "Artificer"
]

base_url = "https://topheroes1.fandom.com/wiki/"
img_dir = "static/img/heroes"
doc_dir = "docs/heroes"

os.makedirs(img_dir, exist_ok=True)
os.makedirs(doc_dir, exist_ok=True)

headers = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36"
}

def clean_text(text):
    if not text: return ""
    return text.strip().replace("\n", " ")

for hero_name in heroes:
    slug = hero_name.lower().replace(" ", "-")
    url = f"{base_url}{hero_name.replace(' ', '_')}"
    print(f"Processing {hero_name} from {url}...")
    
    try:
        response = requests.get(url, headers=headers)
        if response.status_code != 200:
            print(f"Failed to fetch {hero_name}: {response.status_code}")
            continue
            
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Extract Image
        img_url = None
        
        # Strategy 1: Open Graph Image
        og_image = soup.find("meta", property="og:image")
        if og_image:
            img_url = og_image["content"]
            
        # Strategy 2: Infobox image
        if not img_url:
            infobox_img = soup.find("img", class_="pi-image-thumbnail")
            if infobox_img:
                img_url = infobox_img["src"]
        
        # Download Image
        final_img_path = "placeholder.png" # Fallback
        if img_url:
            # Remove query params for cleaner filename if needed, but Fandom/Wikia usually needs them for sizing.
            # Usually the revision/width parts are needed. We'll try to get the 'original' or a good size.
            # Fandom URLs often look like: .../image.png/revision/latest?cb=...
            # We will use the URL as is.
            try:
                img_data = requests.get(img_url, headers=headers).content
                img_filename = f"{slug}.png"
                with open(f"{img_dir}/{img_filename}", "wb") as f:
                    f.write(img_data)
                final_img_path = f"heroes/{img_filename}"
                print(f"  Downloaded image for {hero_name}")
            except Exception as e:
                print(f"  Failed to download image: {e}")
        
        # Extract Faction and Role (heuristic)
        # Fandom often puts this in the "aside" infobox
        infobox = soup.find("aside", class_="portable-infobox")
        faction = "Unknown"
        role = "Unknown"
        
        if infobox:
            # Try to find data-source="faction" or just search for keywords in the text
            text_content = infobox.get_text()
            if "League" in text_content: faction = "League"
            elif "Horde" in text_content: faction = "Horde"
            elif "Nature" in text_content: faction = "Nature"
            
            if "Tank" in text_content: role = "Tank"
            elif "Support" in text_content: role = "Support"
            elif "DPS" in text_content: role = "DPS"
            elif "Healer" in text_content: role = "Healer"
        
        # Generate Markdown
        markdown = f"""---
title: {hero_name}
description: Complete guide for {hero_name} in Top Heroes.
tags: [{faction}, {role}, Hero]
---

# {hero_name}

![{hero_name}](/img/{final_img_path})

## Overview
**Faction:** {faction}
**Role:** {role}

## Skills
*(Skill data extracted from Fandom)*
> This section is under construction. Please check [Fandom]({url}) for accurate skill percentages.

## Strategies
- **Best Team Comps:** Coming soon.
- **Countered By:** Coming soon.

"""
        with open(f"{doc_dir}/{slug}.md", "w") as f:
            f.write(markdown)
            print(f"  Generated page for {hero_name}")
            
        time.sleep(1) # Be nice to the server

    except Exception as e:
        print(f"Error processing {hero_name}: {e}")

print("Scraping complete.")
