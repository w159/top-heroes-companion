import requests
from bs4 import BeautifulSoup

URL = "https://topheroes.info/hero-guide.php"
headers = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36"
}

resp = requests.get(URL, headers=headers)
soup = BeautifulSoup(resp.content, 'html.parser')

# Inspect Core Hero Strategy
core = soup.find(string=lambda t: t and "Core Hero Strategy" in t)
if core:
    print("--- Core Hero Strategy Context ---")
    parent = core.parent
    # Print the parent and its next few siblings
    print(parent.prettify())
    for i, sib in enumerate(parent.next_siblings):
        if i > 5: break
        if sib.name:
            print(f"Sibling {i}: {sib.name}")
            print(sib.prettify()[:500]) # First 500 chars

# Inspect Faction Meta Guides
meta = soup.find(string=lambda t: t and "Faction Meta Guides" in t)
if meta:
    print("\n--- Faction Meta Guides Context ---")
    parent = meta.parent
    print(parent.prettify())
    for i, sib in enumerate(parent.next_siblings):
        if i > 5: break
        if sib.name:
            print(f"Sibling {i}: {sib.name}")
            print(sib.prettify()[:500])
