import requests
from bs4 import BeautifulSoup

URL = "https://topheroes.info/hero-guide.php"
headers = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36"
}

resp = requests.get(URL, headers=headers)
soup = BeautifulSoup(resp.content, 'html.parser')

# Search for "League" to find the faction guides
league = soup.find(string=lambda t: t and "League" in t and len(t) < 50)
if league:
    print("\n--- Found 'League' ---")
    print(league.parent.prettify())
    print("\n--- Parent of League ---")
    print(league.parent.parent.prettify()[:1000])
