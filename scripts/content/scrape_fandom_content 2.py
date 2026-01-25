import os
import re
import time
import subprocess
from bs4 import BeautifulSoup

RAG_DIR = "rag-content/heroes"

def get_fandom_content(hero_name):
    url_name = hero_name.replace(" ", "_")
    url = f"https://topheroes1.fandom.com/wiki/{url_name}"
    print(f"Fetching {url}...")

    try:
        # Use curl to bypass simple bot protection
        result = subprocess.run(
            ["curl", "-L", "-s", url],
            capture_output=True,
            text=True,
            timeout=15
        )
        if result.returncode != 0:
            print(f"  Curl failed for {hero_name}")
            return None

        soup = BeautifulSoup(result.stdout, 'html.parser')

        # Check if we got a valid page (look for specific Fandom elements)
        if not soup.find(id="firstHeading"):
            print(f"  Invalid page for {hero_name}")
            return None

        data = {}

        # 1. Lore
        lore_header = soup.find(lambda tag: tag.name in ['h2', 'h3'] and 'Lore' in tag.get_text())
        if lore_header:
            lore_text = ""
            curr = lore_header.find_next_sibling()
            while curr and curr.name not in ['h2', 'h3']:
                if curr.name == 'p':
                    lore_text += curr.get_text(strip=True) + "\n\n"
                curr = curr.find_next_sibling()
            if lore_text:
                data['lore'] = lore_text.strip()

        # 2. Skills
        skills_header = soup.find(lambda tag: tag.name in ['h2', 'h3'] and 'Skills' in tag.get_text())
        if skills_header:
            skills_text = ""
            curr = skills_header.find_next_sibling()

            # Determine stop level: if we started at H2, stop at H2. If H3, stop at H3.
            stop_tags = ['h2'] if skills_header.name == 'h2' else ['h2', 'h3']

            while curr and curr.name not in stop_tags:
                if curr.name == 'h3':
                    # Skill Title (if we started at H2)
                    skills_text += f"### {curr.get_text(strip=True).replace('[edit]', '')}\n"
                elif curr.name == 'p':
                    # Clean up text
                    text = curr.get_text(strip=True)
                    if text:
                        # Format headings/bolding if it looks like a skill title (Warlock style)
                        if re.match(r'^\d+\.', text):
                            skills_text += f"### {text}\n"
                        elif text.startswith("→"):
                            skills_text += f"> {text}\n\n"
                        else:
                            skills_text += f"{text}\n\n"
                elif curr.name == 'ul':
                    for li in curr.find_all('li'):
                        skills_text += f"- {li.get_text(strip=True)}\n"
                    skills_text += "\n"
                curr = curr.find_next_sibling()
            if skills_text:
                data['skills'] = skills_text.strip()

        # 3. Strategy
        strat_header = soup.find(lambda tag: tag.name in ['h2', 'h3'] and ('Strategy' in tag.get_text() or 'Formation' in tag.get_text()))
        if strat_header:
            strat_text = ""
            curr = strat_header.find_next_sibling()
            stop_tags = ['h2'] if strat_header.name == 'h2' else ['h2', 'h3']

            while curr and curr.name not in stop_tags:
                if curr.name == 'p':
                    strat_text += curr.get_text(strip=True) + "\n\n"
                elif curr.name == 'ul':
                    for li in curr.find_all('li'):
                        strat_text += f"- {li.get_text(strip=True)}\n"
                    strat_text += "\n"
                curr = curr.find_next_sibling()
            if strat_text:
                data['strategy'] = strat_text.strip()

        return data

    except Exception as e:
        print(f"  Error fetching {hero_name}: {e}")
        return None

def update_markdown(filepath, data):
    with open(filepath, 'r') as f:
        content = f.read()

    # Update Lore
    if 'lore' in data:
        # Check if Lore section exists
        if "## Lore" in content:
            # Replace existing Lore
            content = re.sub(r'## Lore\n.*?(?=\n##|\Z)', f"## Lore\n\n{data['lore']}\n", content, flags=re.DOTALL)
        else:
            # Insert after Overview (or at top if no Overview)
            if "## Overview" in content:
                content = content.replace("## Overview", f"## Lore\n\n{data['lore']}\n\n## Overview")
            else:
                # Insert after Title (# Name)
                content = re.sub(r'(# .*?\n)', f"\\1\n## Lore\n\n{data['lore']}\n\n", content, count=1)

    # Update Skills
    if 'skills' in data:
        # Check for existing Skills section
        if "## Skills" in content:
            # Replace content of Skills section
            # We want to replace everything from ## Skills until the next ## or End of File
            # BUT we want to keep "## Skills" header
            content = re.sub(r'(## Skills\n).*?(?=\n##|\Z)', f"\\1\n{data['skills']}\n", content, flags=re.DOTALL)
        else:
            # Append Skills
            content += f"\n## Skills\n\n{data['skills']}\n"

    # Update Strategy
    if 'strategy' in data:
        if "## Strategy" in content:
            content = re.sub(r'## Strategy\n.*?(?=\n##|\Z)', f"## Strategy\n\n{data['strategy']}\n", content, flags=re.DOTALL)
        else:
            content += f"\n## Strategy\n\n{data['strategy']}\n"

    with open(filepath, 'w') as f:
        f.write(content)
    print(f"  Updated {filepath}")

def main():
    files = [f for f in os.listdir(RAG_DIR) if f.endswith('.md')]
    print(f"Found {len(files)} hero files.")

    for filename in files:
        filepath = os.path.join(RAG_DIR, filename)

        # Extract hero name from file content or filename
        # Filename: warlock.md -> Warlock
        hero_name = filename.replace('.md', '').replace('-', ' ').title()

        # Special cases mapping if needed
        # e.g. "Forest Maiden" -> "Forest_Maiden" handled by replace space with underscore

        print(f"Processing {hero_name}...")
        fandom_data = get_fandom_content(hero_name)

        if fandom_data:
            update_markdown(filepath, fandom_data)

        time.sleep(1) # Polite delay

if __name__ == "__main__":
    main()
