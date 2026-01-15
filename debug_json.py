import requests
import re
import json

url = "https://topheroes.info/hero/warlock"
headers = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36"
}

resp = requests.get(url, headers=headers)
content = resp.text

match = re.search(r'const\s+HERO_MASTER\s*=\s*({.*?});', content, re.DOTALL)
if match:
    try:
        data = json.loads(match.group(1))
        # Find the hero data in the structure
        if 'heroes' in data:
            for hero in data['heroes']:
                if hero.get('slug') == 'warlock' or hero.get('id') == 'warlock':
                    print(json.dumps(hero, indent=2))
                    break
        else:
             print(json.dumps(data, indent=2))
    except Exception as e:
        print(f"Error parsing JSON: {e}")
else:
    print("No HERO_MASTER found")
