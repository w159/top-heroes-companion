from bs4 import BeautifulSoup

with open("fandom_warlock.html", "r") as f:
    content = f.read()

soup = BeautifulSoup(content, 'html.parser')

# Find all h2
headers = soup.find_all('h2')
for h2 in headers:
    if "Skills" in h2.get_text():
        print("Found Skills H2")
        # Print next siblings
        sibling = h2.find_next_sibling()
        while sibling and sibling.name != 'h2':
            print(f"[{sibling.name}] {sibling.get_text(strip=True)[:200]}")
            sibling = sibling.find_next_sibling()
        break
