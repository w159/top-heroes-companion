from bs4 import BeautifulSoup

with open("fandom_warlock.html", "r") as f:
    content = f.read()

soup = BeautifulSoup(content, 'html.parser')

headers = soup.find_all(['h2', 'h3'])
for h in headers:
    print(f"HEADER: {h.get_text(strip=True)}")
