import requests
from bs4 import BeautifulSoup
import re

url = "https://topheroes.info/hero/adjudicator"
headers = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36"
}

resp = requests.get(url, headers=headers)
soup = BeautifulSoup(resp.content, 'html.parser')

# Find "Guardian Discipline"
skill = soup.find(string=re.compile("Guardian Discipline"))
if skill:
    print("Found skill:", skill)
    parent = skill.parent
    print("Parent:", parent)
    print("Grandparent:", parent.parent)
    # Print the container to see where description is
    container = parent.find_parent('div', class_='rounded-xl') # My guess was rounded-xl
    if container:
        print("Container found")
        print(container.prettify())
    else:
        print("Container NOT found with class rounded-xl")
        # Go up 3 levels
        print(parent.parent.parent.prettify())
else:
    print("Skill not found in HTML")
