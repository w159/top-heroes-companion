import requests
from bs4 import BeautifulSoup
import re
import json
import os
import time

# Config
BASE_URL = "https://topheroes.info"
HERO_LIST_URL = f"{BASE_URL}/hero.php"
OUTPUT_DIR = "rag-content/heroes"
IMG_DIR = "public/img/heroes"

os.makedirs(OUTPUT_DIR, exist_ok=True)
os.makedirs(IMG_DIR, exist_ok=True)

headers = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36"
}

def clean_text(text):
    if not text: return ""
    return text.strip().replace('"', "'")

def download_image(img_url, filename):
    if not img_url: return None
    
    filepath = os.path.join(IMG_DIR, filename)
    if os.path.exists(filepath) and os.path.getsize(filepath) > 1000:
        return filename

    # Handle relative URLs
    if not img_url.startswith('http'):
        img_url = f"{BASE_URL}/{img_url.lstrip('/')}"
        
    try:
        print(f"  Downloading image: {img_url}")
        resp = requests.get(img_url, headers=headers)
        if resp.status_code == 200:
            with open(filepath, 'wb') as f:
                f.write(resp.content)
            return filename
    except Exception as e:
        print(f"  Failed to download image {img_url}: {e}")
    return None

def extract_json_from_html(content):
    match = re.search(r'const\s+HERO_MASTER\s*=\s*({.*?});', content, re.DOTALL)
    if match:
        try:
            return json.loads(match.group(1))
        except:
            pass
    return None

def parse_hero_page(url, web_slug):
    print(f"Processing {web_slug} from {url}...")
    try:
        resp = requests.get(url, headers=headers)
        soup = BeautifulSoup(resp.content, 'html.parser')
        
        # 1. Try to get JSON data
        json_data = extract_json_from_html(resp.text)
        hero_json = None
        if json_data:
            if 'heroes' in json_data:
                # Find matching hero
                simple_slug = web_slug.replace('-', '').lower()
                for h in json_data['heroes']:
                    if h.get('slug', '').replace('-', '').lower() == simple_slug or \
                       h.get('id', '').replace('-', '').lower() == simple_slug:
                        hero_json = h
                        break
        
        # 2. Extract Skills from HTML (often better descriptions than JSON)
        skills_html = []
        skill_titles = soup.select('.text-sm.font-bold.text-slate-900')
        for title_el in skill_titles:
            container = title_el.find_parent('div', class_='rounded-xl')
            if not container: continue
            
            skill_name = title_el.get_text(strip=True)
            desc_el = container.select_one('p.text-\[13px\].text-slate-800')
            description = desc_el.get_text(strip=True) if desc_el else ""
            
            tags = [tag.get_text(strip=True) for tag in container.select('span.rounded-full')]
            
            skills_html.append({
                'name': skill_name,
                'description': description,
                'tags': tags
            })
            
        # 3. Combine Data
        name = web_slug.replace('-', ' ').title()
        faction = "Unknown"
        rarity = "Legendary"
        role = "Unknown"
        image_url = None
        
        if hero_json:
            name = hero_json.get('name', name)
            faction = hero_json.get('faction', faction)
            rarity = hero_json.get('rarity', rarity)
            role = hero_json.get('role', role)
            # JSON might have image path
            if 'portrait' in hero_json:
                image_url = f"assets/heroes/{hero_json['portrait']}"
        
        # Fallback/Override Image from HTML
        if not image_url:
            img_tag = soup.select_one('img.rounded-2xl.object-cover.shadow-lg')
            if not img_tag: img_tag = soup.find('img', alt=name)
            if img_tag: image_url = img_tag.get('src')

        # Download Image
        image_filename = f"{web_slug}.webp" # Prefer webp
        saved_image = download_image(image_url, image_filename)
        
        # 4. Generate Markdown
        md_content = f"""# {name}

## Overview

- **Faction**: {faction}
- **Rarity**: {rarity}
- **Role**: {role}

"""
        # Add JSON extra data if available
        if hero_json:
            if 'tier' in hero_json:
                md_content += f"- **Tier**: {hero_json['tier']}\n"
            
            # Gear
            if 'gear' in hero_json:
                gear = hero_json['gear']
                md_content += f"\n## Recommended Build\n\n"
                if 'default_set_name' in gear:
                    md_content += f"### Gear Set\n**{gear['default_set_name']}**\n"
                    if 'notes' in gear:
                        md_content += f"> {gear['notes']}\n"
                
                if 'default_set_stats' in gear:
                    stats = gear['default_set_stats']
                    if isinstance(stats, dict):
                        md_content += "\n**Stats to Focus:**\n"
                        for k, v in stats.items():
                            md_content += f"- {k.replace('_', ' ').title()}: {v}\n"

            # Awakening
            if 'awakening_details' in hero_json:
                awk = hero_json['awakening_details']
                md_content += f"\n## Awakening\n\n"
                if 'notes' in awk:
                    md_content += f"{awk['notes']}\n\n"
                md_content += f"**Estimated Cost:** {awk.get('awakening_shards_estimate', '???')} Shards\n"

        # Skills Section
        md_content += "\n## Skills\n\n"
        if skills_html:
            for skill in skills_html:
                tags_str = ", ".join([f"`{t}`" for t in skill['tags']])
                md_content += f"### {skill['name']}\n"
                if tags_str:
                    md_content += f"**Type:** {tags_str}\n\n"
                md_content += f"{skill['description']}\n\n"
        elif hero_json and 'skills' in hero_json:
             for skill in hero_json['skills']:
                 md_content += f"### {skill.get('name', 'Unknown')}\n"
                 md_content += f"**Type:** {skill.get('type', '')}\n\n"
        else:
            md_content += "*Skill data not available.*\n"

        # Write to file
        filename = f"{web_slug}.md"
        with open(os.path.join(OUTPUT_DIR, filename), 'w') as f:
            f.write(md_content)
        
        print(f"  Generated {filename}")

    except Exception as e:
        print(f"  Error processing {web_slug}: {e}")

def main():
    print("Fetching hero list...")
    resp = requests.get(HERO_LIST_URL, headers=headers)
    soup = BeautifulSoup(resp.content, 'html.parser')
    
    links = soup.find_all('a', href=re.compile(r'/hero/'))
    processed = set()
    
    for link in links:
        href = link['href']
        web_slug = href.split('/')[-1]
        
        if web_slug in processed: continue
        processed.add(web_slug)
        
        full_url = f"{BASE_URL}/{href.lstrip('/')}"
        parse_hero_page(full_url, web_slug)
        
        time.sleep(0.5)

if __name__ == "__main__":
    main()
