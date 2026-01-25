import requests
from bs4 import BeautifulSoup
import re
import json
import os
import time

# Config
BASE_URL = "https://topheroes.info"
HERO_LIST_URL = f"{BASE_URL}/hero.php"
OUTPUT_FILE = "src/data/heroes.json"
IMG_DIR = "public/img/heroes"

os.makedirs(os.path.dirname(OUTPUT_FILE), exist_ok=True)
os.makedirs(IMG_DIR, exist_ok=True)

headers = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36"
}

def clean_text(text):
    if not text: return ""
    return text.strip().replace('"', "'").replace('\n', ' ')

def download_image(hero_slug, web_slug):
    # Try multiple naming conventions
    candidates = [hero_slug, web_slug, hero_slug.replace('-', ''), web_slug.replace('-', '')]
    extensions = ['webp', 'png', 'jpg']
    
    for name in set(candidates):
        for ext in extensions:
            filename = f"{web_slug}.{ext}" # Canonical filename we want locally
            filepath = os.path.join(IMG_DIR, filename)
            
            # If we already have it, skip
            if os.path.exists(filepath) and os.path.getsize(filepath) > 1000:
                print(f"  Skipping existing image: {filename}")
                return f"/img/heroes/{filename}" # Return public path

            url = f"{BASE_URL}/assets/heroes/{name}.{ext}"
            try:
                resp = requests.get(url, headers=headers)
                if resp.status_code == 200:
                    print(f"  Downloading image from {url}")
                    with open(filepath, 'wb') as f:
                        f.write(resp.content)
                    return f"/img/heroes/{filename}"
            except Exception:
                pass
    
    return "/img/heroes/placeholder.png"

def extract_json_from_html(content):
    # Pattern: const HERO_MASTER = {...};
    match = re.search(r'const\s+HERO_MASTER\s*=\s*({.*?});', content, re.DOTALL)
    if match:
        try:
            return json.loads(match.group(1))
        except:
            pass
            
    # Fallback to variable assignment patterns
    patterns = [
        r'(?:const|var|let|window\.)\s*\w+\s*=\s*(\[\{"hero_id":.*?\}\]);', 
        r'(\[\{"hero_id":.*?\}\])', 
    ]
    
    for pattern in patterns:
        match = re.search(pattern, content, re.DOTALL)
        if match:
             try:
                 return json.loads(match.group(1))
             except:
                 pass
    return None

def process_hero(hero, web_slug, detected_faction):
    # Normalize data structure
    hero_id = hero.get('hero_id', hero.get('id', web_slug)).replace('-', '').lower()
    name = hero.get('hero_name', hero.get('name', web_slug.replace('-', ' ').title()))
    faction = hero.get('faction', detected_faction)
    rarity = hero.get('rarity', 'Legendary')
    role = hero.get('role', 'DPS') # Default
    
    # Skills
    skills = []
    if hero.get('skills'):
        for s in hero['skills']:
            skills.append({
                'name': s.get('name', 'Unknown'),
                'type': s.get('type', 'Passive'),
                'description': clean_text(s.get('base_description', '')),
                'tips': clean_text(s.get('tips', ''))
            })
            
    # Gear / Meta
    gear_data = hero.get('gear') or {}
    gear_set = gear_data.get('default_set_name', 'None')
    positions = hero.get('positions') or []
    unique_weapon = hero.get('unique_weapon', 'None')
    
    # Image
    image_path = download_image(hero_id, web_slug)

    return {
        "id": web_slug, # Use web_slug as distinct ID
        "game_id": hero_id,
        "name": name,
        "faction": faction,
        "rarity": rarity,
        "role": role,
        "image": image_path,
        "gear_set": gear_set,
        "unique_weapon": unique_weapon,
        "positions": positions,
        "skills": skills
    }


def main():
    print("Fetching hero list...")
    resp = requests.get(HERO_LIST_URL, headers=headers)
    soup = BeautifulSoup(resp.content, 'html.parser')
    
    links = soup.find_all('a', href=re.compile(r'/hero/'))
    
    processed_slugs = set()
    all_heroes = []
    
    for link in links:
        href = link.get('href')
        if isinstance(href, list):
            href = href[0]
        
        if not href:
            continue
            
        web_slug = href.split('/')[-1]
        
        if web_slug in processed_slugs: continue
        processed_slugs.add(web_slug)
        
        # Faction Detection
        link_text = link.get_text().strip()
        detected_faction = "Unknown"
        
        # Check parent and text for faction keywords
        context_text = link_text
        parent_div = link.find_parent('div')
        if parent_div:
             context_text += " " + parent_div.get_text()
             
        if "Nature" in context_text: detected_faction = "Nature"
        elif "Horde" in context_text: detected_faction = "Horde"
        elif "League" in context_text: detected_faction = "League"

        full_url = f"{BASE_URL}/{href.lstrip('/')}"
        print(f"Processing {web_slug}...")
        
        try:
            page_resp = requests.get(full_url, headers=headers)
            json_data = extract_json_from_html(page_resp.text)
            
            hero_data = None
            
            if json_data:
                # Find matching hero in JSON blob
                heroes_list = []
                if isinstance(json_data, list): heroes_list = json_data
                elif isinstance(json_data, dict) and 'heroes' in json_data: heroes_list = json_data['heroes']
                
                if heroes_list:
                    simple_slug = web_slug.replace('-', '').lower()
                    for h in heroes_list:
                        hid = h.get('hero_id', h.get('id', '')).replace('-', '').lower()
                        hslug = h.get('slug', '').replace('-', '').lower()
                        if hid == simple_slug or hslug == simple_slug:
                            hero_data = h
                            break
                    
                    if not hero_data:
                        # Name match fallback
                        for h in heroes_list:
                            if h.get('hero_name', h.get('name', '')).lower() in link_text.lower():
                                hero_data = h
                                break
            
            if not hero_data:
                print(f"  Fallback -> HTML/Basic data for {web_slug}")
                hero_data = {} # Will trigger defaults in process_hero

            final_hero = process_hero(hero_data, web_slug, detected_faction)
            all_heroes.append(final_hero)

        except Exception as e:
            print(f"  Error processing {web_slug}: {e}")
            
        time.sleep(0.2)
        
    # Write JSON
    print(f"Writing {len(all_heroes)} heroes to {OUTPUT_FILE}")
    with open(OUTPUT_FILE, 'w') as f:
        json.dump(all_heroes, f, indent=2)

if __name__ == '__main__':
    main()
