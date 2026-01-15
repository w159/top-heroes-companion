import requests
from bs4 import BeautifulSoup

url = "https://topheroes.info/hero/warlock"
headers = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36"
}

resp = requests.get(url, headers=headers)
soup = BeautifulSoup(resp.content, 'html.parser')

# Look for anything that might look like a skill
# In scrape_heroes_enhanced.py, I used: soup.select('.text-sm.font-bold.text-slate-900')
# Let's print all text to see if skills are present at all.

# Or better, let's print the body content but limit it.
# Actually, let's look for "Skills" or similar keywords.

print(soup.prettify()[:20000])
