import requests
from bs4 import BeautifulSoup
import os
import re

URL = "https://topheroes.info/hero-guide.php"
OUTPUT_DIR = "rag-content"

headers = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36"
}

def clean_text(text):
    if not text: return ""
    return re.sub(r'\s+', ' ', text).strip()

def main():
    print(f"Fetching guides from {URL}...")
    resp = requests.get(URL, headers=headers)
    soup = BeautifulSoup(resp.content, 'html.parser')

    # Create directories
    os.makedirs(f"{OUTPUT_DIR}/mechanics", exist_ok=True)
    os.makedirs(f"{OUTPUT_DIR}/meta", exist_ok=True)

    # 1. Core Hero Strategy
    # Structure: H2 -> div (grid) -> div (item) -> div (icon) + div (content: h3, p)
    core_header = soup.find(lambda tag: tag.name == 'h2' and 'Core Hero Strategy' in tag.get_text())
    if core_header:
        print("Found Core Hero Strategy")
        content = "# Core Hero Strategy\n\n"

        # The grid container is usually the next sibling
        grid_container = core_header.find_next_sibling('div')
        if grid_container:
            # Iterate through items in the grid
            # Items might be direct children or wrapped
            items = grid_container.find_all('h3')
            for item_title in items:
                title_text = clean_text(item_title.get_text())
                content += f"## {title_text}\n"

                # Description is usually in the next sibling P or parent's P
                # Based on inspection: h3 -> p (sibling)
                desc = item_title.find_next_sibling('p')
                if desc:
                    content += f"{clean_text(desc.get_text())}\n\n"
                else:
                    # Fallback: look in parent
                    parent = item_title.parent
                    p = parent.find('p')
                    if p:
                        content += f"{clean_text(p.get_text())}\n\n"

        with open(f"{OUTPUT_DIR}/mechanics/core-strategy.md", "w") as f:
            f.write(content)
            print("  Saved mechanics/core-strategy.md")
    else:
        print("Core Hero Strategy header not found")

    # 2. Faction Meta Guides
    # Structure: H2 -> p (intro) -> ... maybe detailed sections are further down or missing?
    # Let's try to capture everything until the next H2
    meta_header = soup.find(lambda tag: tag.name == 'h2' and 'Faction Meta Guides' in tag.get_text())
    if meta_header:
        print("Found Faction Meta Guides")
        content = "# Faction Meta Guides\n\n"

        curr = meta_header.find_next_sibling()
        while curr and curr.name != 'h2':
            if curr.name == 'p':
                text = clean_text(curr.get_text())
                if text:
                    content += f"{text}\n\n"
            elif curr.name == 'h3':
                 content += f"## {clean_text(curr.get_text())}\n\n"
            elif curr.name == 'h4':
                 content += f"### {clean_text(curr.get_text())}\n\n"
            elif curr.name == 'div':
                # Check for grid items inside div
                # If it contains h3/h4, extract them
                headers_in_div = curr.find_all(['h3', 'h4'])
                if headers_in_div:
                    for h in headers_in_div:
                        content += f"## {clean_text(h.get_text())}\n"
                        # Find p following this header
                        p = h.find_next_sibling('p')
                        if p:
                            content += f"{clean_text(p.get_text())}\n\n"
                else:
                    # Just text
                    text = clean_text(curr.get_text())
                    if len(text) > 20: # Filter out empty/small divs
                        content += f"{text}\n\n"

            curr = curr.find_next_sibling()

        with open(f"{OUTPUT_DIR}/meta/faction-meta.md", "w") as f:
            f.write(content)
            print("  Saved meta/faction-meta.md")
    else:
        print("Faction Meta Guides header not found")

    # 3. Epic Hero Passive Traits
    passive_header = soup.find(string=re.compile("Epic Hero Passive Traits"))
    if passive_header:
        print("Found Epic Hero Passive Traits")
        # Go up to H2 container or find table globally nearby
        # Try to find the nearest table following this header
        header_elem = passive_header.parent if passive_header.parent.name else passive_header
        # If it's a string, parent is the tag.

        # Search for table in next siblings
        table = None
        curr = header_elem
        for _ in range(10): # Check next 10 siblings
            if not curr: break
            curr = curr.find_next_sibling()
            if curr and curr.name == 'div':
                t = curr.find('table')
                if t:
                    table = t
                    break
            if curr and curr.name == 'table':
                table = curr
                break

        if not table:
             # Fallback: Find *any* table that looks like it has "Hero" and "Trait" headers
             tables = soup.find_all('table')
             for t in tables:
                 if "Hero" in t.get_text() and "Trait" in t.get_text():
                     table = t
                     break

        content = "# Epic Hero Passive Traits\n\n"
        content += "Once Epic Heroes reach 2-Star Platinum, they unlock a global passive trait (Skill 3). Prioritize maxing these out!\n\n"

        if table:
            rows = table.find_all('tr')
            if rows:
                # Header
                headers_list = [clean_text(th.get_text()) for th in rows[0].find_all(['th', 'td'])]
                content += "| " + " | ".join(headers_list) + " |\n"
                content += "| " + " | ".join(['---'] * len(headers_list)) + " |\n"

                # Body
                for row in rows[1:]:
                    cols = [clean_text(td.get_text()) for td in row.find_all('td')]
                    if cols:
                        content += "| " + " | ".join(cols) + " |\n"

        with open(f"{OUTPUT_DIR}/mechanics/epic-passives.md", "w") as f:
            f.write(content)
            print("  Saved mechanics/epic-passives.md")
    else:
        print("Epic Hero Passive Traits header not found")

if __name__ == "__main__":
    main()
