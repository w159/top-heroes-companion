from bs4 import BeautifulSoup

with open("fandom_warlock.html", "r") as f:
    content = f.read()

soup = BeautifulSoup(content, 'html.parser')

headers = soup.find_all('h2')
for h2 in headers:
    if "Gear" in h2.get_text():
        print("Found Gear H2")
        sibling = h2.find_next_sibling()
        while sibling and sibling.name != 'h2':
            print(f"[{sibling.name}] {sibling.get_text(strip=True)}")
            sibling = sibling.find_next_sibling()
