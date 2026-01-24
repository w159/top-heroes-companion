import requests
from bs4 import BeautifulSoup

url = "https://topheroes1.fandom.com/wiki/Warlock"
headers = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36"
}

resp = requests.get(url, headers=headers)
soup = BeautifulSoup(resp.content, 'html.parser')

print(soup.prettify()[:10000])
