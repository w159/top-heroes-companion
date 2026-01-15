from bs4 import BeautifulSoup

with open("fandom_nun.html", "r") as f:
    content = f.read()

soup = BeautifulSoup(content, 'html.parser')

print("All Headers:")
for h in soup.find_all(['h1', 'h2', 'h3']):
    print(f"[{h.name}] {h.get_text(strip=True)}")
