import os
import json
import re

DOCS_DIR = "docs/heroes"
JSON_OUT = "src/data/heroes.json"

heroes = []

for root, dirs, files in os.walk(DOCS_DIR):
    for filename in files:
        if not filename.endswith(".md") or filename.startswith("_") or filename == "heroes-intro.md":
            continue
            
        filepath = os.path.join(root, filename)
        # Determine relative folder (e.g. "League" or ".")
        rel_folder = os.path.relpath(root, DOCS_DIR)
        if rel_folder == ".": rel_folder = ""
        
        with open(filepath, 'r') as f:
            content = f.read()
            
        # Extract Frontmatter
        title_match = re.search(r'title:\s*(.+)', content)
        name = title_match.group(1).strip() if title_match else filename.replace('.md', '').title()
        
        slug = filename.replace('.md', '')
        
        # Extract body fields
        # Try both React Props (primary) and Legacy Regex
        
        # Faction
        faction_match = re.search(r'faction="([^"]+)"', content)
        if not faction_match:
             faction_match = re.search(r'<strong>Faction:</strong>\s*(.+?)</p>', content)
        if not faction_match:
             faction_match = re.search(r'\*\*Faction:\*\*\s*(.+)', content)
        faction = faction_match.group(1).strip() if faction_match else "Unknown"
        
        # Rarity
        rarity_match = re.search(r'rarity="([^"]+)"', content)
        if not rarity_match:
            rarity_match = re.search(r'<strong>Rarity:</strong>\s*(.+?)</p>', content)
        if not rarity_match:
            rarity_match = re.search(r'\*\*Rarity:\*\*\s*(.+)', content)
        rarity = rarity_match.group(1).strip() if rarity_match else "Legendary"
        
        # Role
        role_match = re.search(r'role="([^"]+)"', content)
        if not role_match:
            role_match = re.search(r'<strong>Role:</strong>\s*(.+?)</p>', content)
        if not role_match:
            role_match = re.search(r'\*\*Role:\*\*\s*(.+)', content)
        role = role_match.group(1).strip() if role_match else "Unknown"
        
        image_match = re.search(r'image:\s*(.+)', content)
        image = image_match.group(1).strip() if image_match else f"{slug}.png"
        
        heroes.append({
            "name": name,
            "slug": slug,
            "faction": faction,
            "rarity": rarity,
            "role": role,
            "image": image,
            "folder": rel_folder
        })

with open(JSON_OUT, 'w') as f:
    json.dump(heroes, f, indent=2)

print(f"Generated heroes.json with {len(heroes)} heroes.")
