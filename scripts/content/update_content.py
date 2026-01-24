#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
import os
import re
import time
from pathlib import Path
from typing import Any, Iterable, Optional

import requests
from bs4 import BeautifulSoup

PROJECT_ROOT = Path(__file__).resolve().parents[2]
RAG_DIR = PROJECT_ROOT / "rag-content"
HERO_RAG_DIR = RAG_DIR / "heroes"
MECHANICS_DIR = RAG_DIR / "mechanics"
META_DIR = RAG_DIR / "meta"
HEROES_JSON = PROJECT_ROOT / "src" / "data" / "heroes.json"
HERO_IMAGES_DIR = PROJECT_ROOT / "public" / "img" / "heroes"

TOPHEROES_BASE = "https://topheroes.info"
TOPHEROES_HERO_LIST = f"{TOPHEROES_BASE}/hero.php"
TOPHEROES_GUIDE = f"{TOPHEROES_BASE}/hero-guide.php"
FANDOM_BASE = "https://topheroes1.fandom.com/wiki/"

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/91.0.4472.114 Safari/537.36"
    )
}


def clean_text(text: Optional[str]) -> str:
    if not text:
        return ""
    return text.strip().replace('"', "'").replace("\n", " ")


def request_text(url: str, timeout: int = 20) -> str:
    response = requests.get(url, headers=HEADERS, timeout=timeout)
    response.raise_for_status()
    return response.text


def download_image(hero_slug: str, web_slug: str) -> str:
    HERO_IMAGES_DIR.mkdir(parents=True, exist_ok=True)
    candidates = {
        hero_slug,
        web_slug,
        hero_slug.replace("-", ""),
        web_slug.replace("-", ""),
    }
    for name in candidates:
        for ext in ("webp", "png", "jpg"):
            filename = f"{web_slug}.{ext}"
            filepath = HERO_IMAGES_DIR / filename
            if filepath.exists() and filepath.stat().st_size > 1000:
                return f"/img/heroes/{filename}"

            url = f"{TOPHEROES_BASE}/assets/heroes/{name}.{ext}"
            try:
                resp = requests.get(url, headers=HEADERS, timeout=20)
                if resp.status_code == 200:
                    filepath.write_bytes(resp.content)
                    return f"/img/heroes/{filename}"
            except requests.RequestException:
                continue
    return "/img/heroes/placeholder.png"


def extract_json_from_html(content: str) -> Optional[Any]:
    match = re.search(r"const\s+HERO_MASTER\s*=\s*({.*?});", content, re.DOTALL)
    if match:
        try:
            return json.loads(match.group(1))
        except json.JSONDecodeError:
            pass

    patterns = [
        r"(?:const|var|let|window\.)\s*\w+\s*=\s*(\[\{\"hero_id\":.*?\}\]);",
        r"(\[\{\"hero_id\":.*?\}\])",
    ]
    for pattern in patterns:
        match = re.search(pattern, content, re.DOTALL)
        if match:
            try:
                return json.loads(match.group(1))
            except json.JSONDecodeError:
                continue
    return None


def detect_faction_from_link(link: Any) -> str:
    link_text = link.get_text().strip()
    context_text = link_text
    parent_div = link.find_parent("div")
    if parent_div:
        context_text += " " + parent_div.get_text()

    if "Nature" in context_text:
        return "Nature"
    if "Horde" in context_text:
        return "Horde"
    if "League" in context_text:
        return "League"
    return "Unknown"


def normalize_hero(hero: dict, web_slug: str, detected_faction: str) -> dict:
    hero_id = hero.get("hero_id", hero.get("id", web_slug)).replace("-", "").lower()
    name = hero.get("hero_name", hero.get("name", web_slug.replace("-", " ").title()))
    faction = hero.get("faction", detected_faction)
    rarity = hero.get("rarity", "Legendary")
    role = hero.get("role", "DPS")

    skills = []
    for skill in hero.get("skills", []) or []:
        skills.append(
            {
                "name": skill.get("name", "Unknown"),
                "type": skill.get("type", "Passive"),
                "description": clean_text(skill.get("base_description", "")),
                "tips": clean_text(skill.get("tips", "")),
            }
        )

    gear_data = hero.get("gear") or {}
    gear_set = gear_data.get("default_set_name", "None")
    positions = hero.get("positions") or []
    unique_weapon = hero.get("unique_weapon", "None")

    image_path = download_image(hero_id, web_slug)

    return {
        "id": web_slug,
        "game_id": hero_id,
        "name": name,
        "faction": faction,
        "rarity": rarity,
        "role": role,
        "image": image_path,
        "gear_set": gear_set,
        "unique_weapon": unique_weapon,
        "positions": positions,
        "skills": skills,
    }


def update_heroes_json(delay: float) -> int:
    print("Fetching hero list...")
    html = request_text(TOPHEROES_HERO_LIST)
    soup = BeautifulSoup(html, "html.parser")
    links = soup.find_all("a", href=re.compile(r"/hero/"))

    processed_slugs: set[str] = set()
    all_heroes: list[dict] = []

    for link in links:
        href = link.get("href")
        if isinstance(href, list):
            href = href[0]
        if not href:
            continue

        web_slug = href.split("/")[-1]
        if web_slug in processed_slugs:
            continue
        processed_slugs.add(web_slug)

        detected_faction = detect_faction_from_link(link)
        full_url = f"{TOPHEROES_BASE}/{href.lstrip('/')}"
        print(f"Processing {web_slug}...")

        try:
            page_html = request_text(full_url)
            json_data = extract_json_from_html(page_html)

            hero_data = None
            if json_data:
                heroes_list: Iterable[dict] = []
                if isinstance(json_data, list):
                    heroes_list = json_data
                elif isinstance(json_data, dict) and "heroes" in json_data:
                    heroes_list = json_data["heroes"]

                if heroes_list:
                    simple_slug = web_slug.replace("-", "").lower()
                    for hero in heroes_list:
                        hero_id = hero.get("hero_id", hero.get("id", "")).replace("-", "").lower()
                        hero_slug = hero.get("slug", "").replace("-", "").lower()
                        if hero_id == simple_slug or hero_slug == simple_slug:
                            hero_data = hero
                            break

                    if not hero_data:
                        link_text = link.get_text().strip().lower()
                        for hero in heroes_list:
                            hero_name = hero.get("hero_name", hero.get("name", "")).lower()
                            if hero_name and hero_name in link_text:
                                hero_data = hero
                                break

            if not hero_data:
                hero_data = {}

            all_heroes.append(normalize_hero(hero_data, web_slug, detected_faction))
        except requests.RequestException as exc:
            print(f"  Error processing {web_slug}: {exc}")

        time.sleep(delay)

    HEROES_JSON.parent.mkdir(parents=True, exist_ok=True)
    HEROES_JSON.write_text(json.dumps(all_heroes, indent=2), encoding="utf-8")
    print(f"Wrote {len(all_heroes)} heroes to {HEROES_JSON}")
    return len(all_heroes)


def update_guides() -> None:
    print("Fetching hero guides...")
    html = request_text(TOPHEROES_GUIDE)
    soup = BeautifulSoup(html, "html.parser")

    MECHANICS_DIR.mkdir(parents=True, exist_ok=True)
    META_DIR.mkdir(parents=True, exist_ok=True)

    core_header = soup.find(lambda tag: tag.name == "h2" and "Core Hero Strategy" in tag.get_text())
    if core_header:
        content = "# Core Hero Strategy\n\n"
        grid_container = core_header.find_next_sibling("div")
        if grid_container:
            items = grid_container.find_all("h3")
            for item_title in items:
                title_text = clean_text(item_title.get_text())
                content += f"## {title_text}\n"

                desc = item_title.find_next_sibling("p")
                if desc:
                    content += f"{clean_text(desc.get_text())}\n\n"
                else:
                    parent = item_title.parent
                    paragraph = parent.find("p")
                    if paragraph:
                        content += f"{clean_text(paragraph.get_text())}\n\n"

        (MECHANICS_DIR / "core-strategy.md").write_text(content, encoding="utf-8")
        print("  Updated mechanics/core-strategy.md")
    else:
        print("  Core Hero Strategy header not found")

    meta_header = soup.find(lambda tag: tag.name == "h2" and "Faction Meta Guides" in tag.get_text())
    if meta_header:
        content = "# Faction Meta Guides\n\n"
        curr = meta_header.find_next_sibling()
        while curr and curr.name != "h2":
            if curr.name == "p":
                text = clean_text(curr.get_text())
                if text:
                    content += f"{text}\n\n"
            elif curr.name == "h3":
                content += f"## {clean_text(curr.get_text())}\n\n"
            elif curr.name == "h4":
                content += f"### {clean_text(curr.get_text())}\n\n"
            elif curr.name == "div":
                headers_in_div = curr.find_all(["h3", "h4"])
                if headers_in_div:
                    for header in headers_in_div:
                        content += f"## {clean_text(header.get_text())}\n"
                        paragraph = header.find_next_sibling("p")
                        if paragraph:
                            content += f"{clean_text(paragraph.get_text())}\n\n"
                else:
                    text = clean_text(curr.get_text())
                    if len(text) > 20:
                        content += f"{text}\n\n"
            curr = curr.find_next_sibling()

        (META_DIR / "faction-meta.md").write_text(content, encoding="utf-8")
        print("  Updated meta/faction-meta.md")
    else:
        print("  Faction Meta Guides header not found")

    passive_header = soup.find(string=re.compile("Epic Hero Passive Traits"))
    if passive_header:
        header_elem = passive_header.parent if getattr(passive_header, "parent", None) else passive_header
        table = None
        curr = header_elem
        for _ in range(10):
            if not curr:
                break
            curr = curr.find_next_sibling()
            if curr and curr.name == "div":
                candidate = curr.find("table")
                if candidate:
                    table = candidate
                    break
            if curr and curr.name == "table":
                table = curr
                break

        if not table:
            for candidate in soup.find_all("table"):
                if "Hero" in candidate.get_text() and "Trait" in candidate.get_text():
                    table = candidate
                    break

        content = "# Epic Hero Passive Traits\n\n"
        content += (
            "Once Epic Heroes reach 2-Star Platinum, they unlock a global passive trait "
            "(Skill 3). Prioritize maxing these out!\n\n"
        )

        if table:
            rows = table.find_all("tr")
            if rows:
                headers_list = [clean_text(th.get_text()) for th in rows[0].find_all(["th", "td"])]
                content += "| " + " | ".join(headers_list) + " |\n"
                content += "| " + " | ".join(["---"] * len(headers_list)) + " |\n"
                for row in rows[1:]:
                    cols = [clean_text(td.get_text()) for td in row.find_all("td")]
                    if cols:
                        content += "| " + " | ".join(cols) + " |\n"

        (MECHANICS_DIR / "epic-passives.md").write_text(content, encoding="utf-8")
        print("  Updated mechanics/epic-passives.md")
    else:
        print("  Epic Hero Passive Traits header not found")


def fetch_fandom_html(hero_name: str) -> Optional[str]:
    url_name = hero_name.replace(" ", "_")
    url = f"{FANDOM_BASE}{url_name}"
    try:
        response = requests.get(url, headers=HEADERS, timeout=20)
        if response.status_code != 200:
            return None
        return response.text
    except requests.RequestException:
        return None


def extract_fandom_sections(html: str) -> dict:
    soup = BeautifulSoup(html, "html.parser")
    if not soup.find(id="firstHeading"):
        return {}

    data: dict[str, str] = {}

    lore_header = soup.find(lambda tag: tag.name in ["h2", "h3"] and "Lore" in tag.get_text())
    if lore_header:
        lore_text = ""
        curr = lore_header.find_next_sibling()
        while curr and curr.name not in ["h2", "h3"]:
            if curr.name == "p":
                lore_text += curr.get_text(strip=True) + "\n\n"
            curr = curr.find_next_sibling()
        if lore_text:
            data["lore"] = lore_text.strip()

    skills_header = soup.find(lambda tag: tag.name in ["h2", "h3"] and "Skills" in tag.get_text())
    if skills_header:
        skills_text = ""
        curr = skills_header.find_next_sibling()
        stop_tags = ["h2"] if skills_header.name == "h2" else ["h2", "h3"]

        while curr and curr.name not in stop_tags:
            if curr.name == "h3":
                skills_text += f"### {curr.get_text(strip=True).replace('[edit]', '')}\n"
            elif curr.name == "p":
                text = curr.get_text(strip=True)
                if text:
                    if re.match(r"^\d+\.", text):
                        skills_text += f"### {text}\n"
                    elif text.startswith("→"):
                        skills_text += f"> {text}\n\n"
                    else:
                        skills_text += f"{text}\n\n"
            elif curr.name == "ul":
                for li in curr.find_all("li"):
                    skills_text += f"- {li.get_text(strip=True)}\n"
                skills_text += "\n"
            curr = curr.find_next_sibling()
        if skills_text:
            data["skills"] = skills_text.strip()

    strat_header = soup.find(
        lambda tag: tag.name in ["h2", "h3"]
        and ("Strategy" in tag.get_text() or "Formation" in tag.get_text())
    )
    if strat_header:
        strat_text = ""
        curr = strat_header.find_next_sibling()
        stop_tags = ["h2"] if strat_header.name == "h2" else ["h2", "h3"]

        while curr and curr.name not in stop_tags:
            if curr.name == "p":
                strat_text += curr.get_text(strip=True) + "\n\n"
            elif curr.name == "ul":
                for li in curr.find_all("li"):
                    strat_text += f"- {li.get_text(strip=True)}\n"
                strat_text += "\n"
            curr = curr.find_next_sibling()
        if strat_text:
            data["strategy"] = strat_text.strip()

    return data


def update_markdown(filepath: Path, data: dict) -> None:
    content = filepath.read_text(encoding="utf-8")

    if "lore" in data:
        if "## Lore" in content:
            content = re.sub(
                r"## Lore\n.*?(?=\n##|\Z)",
                f"## Lore\n\n{data['lore']}\n",
                content,
                flags=re.DOTALL,
            )
        else:
            if "## Overview" in content:
                content = content.replace("## Overview", f"## Lore\n\n{data['lore']}\n\n## Overview")
            else:
                content = re.sub(
                    r"(# .*?\n)",
                    f"\\1\n## Lore\n\n{data['lore']}\n\n",
                    content,
                    count=1,
                )

    if "skills" in data:
        if "## Skills" in content:
            content = re.sub(
                r"(## Skills\n).*?(?=\n##|\Z)",
                f"\\1\n{data['skills']}\n",
                content,
                flags=re.DOTALL,
            )
        else:
            content += f"\n## Skills\n\n{data['skills']}\n"

    if "strategy" in data:
        if "## Strategy" in content:
            content = re.sub(
                r"## Strategy\n.*?(?=\n##|\Z)",
                f"## Strategy\n\n{data['strategy']}\n",
                content,
                flags=re.DOTALL,
            )
        else:
            content += f"\n## Strategy\n\n{data['strategy']}\n"

    filepath.write_text(content, encoding="utf-8")
    print(f"  Updated {filepath.name}")


def update_fandom_hero_content(delay: float) -> int:
    if not HERO_RAG_DIR.exists():
        print(f"Hero RAG directory not found: {HERO_RAG_DIR}")
        return 0

    files = [path for path in HERO_RAG_DIR.iterdir() if path.suffix == ".md"]
    print(f"Found {len(files)} hero files.")

    updated = 0
    for filepath in files:
        hero_name = filepath.stem.replace("-", " ").title()
        html = fetch_fandom_html(hero_name)
        if not html:
            print(f"  Failed to fetch {hero_name}")
            time.sleep(delay)
            continue

        fandom_data = extract_fandom_sections(html)
        if fandom_data:
            update_markdown(filepath, fandom_data)
            updated += 1

        time.sleep(delay)

    return updated


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Update Top Heroes content from official sources."
    )
    parser.add_argument("--heroes-json", action="store_true", help="Update src/data/heroes.json")
    parser.add_argument("--guides", action="store_true", help="Update rag-content guides")
    parser.add_argument("--fandom", action="store_true", help="Update rag-content hero lore/skills")
    parser.add_argument("--all", action="store_true", help="Run all updates")
    parser.add_argument(
        "--delay",
        type=float,
        default=0.4,
        help="Delay between requests (seconds)",
    )
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    run_all = args.all or not (args.heroes_json or args.guides or args.fandom)

    if run_all or args.heroes_json:
        update_heroes_json(args.delay)

    if run_all or args.guides:
        update_guides()

    if run_all or args.fandom:
        updated = update_fandom_hero_content(args.delay)
        print(f"Updated {updated} hero files from Fandom.")


if __name__ == "__main__":
    main()
