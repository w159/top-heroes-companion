import os
import re
import shutil

DOCS_DIR = "docs/heroes"
# Correct capitalization map
FACTIONS = ["League", "Horde", "Nature", "Unknown"]

def organize():
    files = [f for f in os.listdir(DOCS_DIR) if f.endswith(".md") and f != "heroes-intro.md"]
    
    for filename in files:
        filepath = os.path.join(DOCS_DIR, filename)
        with open(filepath, 'r') as f:
            content = f.read()
            
        # Extract faction
        # Try React Prop first
        faction_match = re.search(r'faction="([^"]+)"', content)
        if not faction_match:
            # Try HTML
            faction_match = re.search(r'<strong>Faction:</strong>\s*(.+?)</p>', content)
        if not faction_match:
            # Try Markdown
            faction_match = re.search(r'\*\*Faction:\*\*\s*(.+)', content)
            
        faction = faction_match.group(1).strip() if faction_match else "Unknown"
        
        # Clean up faction name (sometimes it might have extra chars?)
        target_dir = "Unknown"
        for f in FACTIONS:
            if f.lower() in faction.lower():
                target_dir = f
                break
                
        dest_dir = os.path.join(DOCS_DIR, target_dir)
        dest_path = os.path.join(dest_dir, filename)
        
        print(f"Moving {filename} -> {target_dir}/")
        shutil.move(filepath, dest_path)

if __name__ == "__main__":
    organize()
