#!/usr/bin/env python3
"""
Top Heroes Content Scraper Agent System
Orchestrates multiple scrapers to gather and update game content.
"""

import json
import os
import asyncio
import logging
from pathlib import Path
from datetime import datetime
from typing import Dict, List, Optional
from dataclasses import dataclass, asdict

import aiohttp
from bs4 import BeautifulSoup

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Project paths
PROJECT_ROOT = Path(__file__).parent.parent.parent
RAG_CONTENT_DIR = PROJECT_ROOT / "rag-content"
DATA_DIR = PROJECT_ROOT / "src" / "data"


@dataclass
class HeroData:
    """Structured hero data from scraping"""
    id: str
    name: str
    faction: str  # League, Horde, Nature
    rarity: str   # Mythic, Legendary, Epic, Rare
    role: str     # Tank, DPS, Healer, Support
    tier: str     # S, A, B, C
    skills: List[Dict]
    recommended_gear: str
    recommended_relic: str
    recommended_pet: str
    synergies: List[str]
    counters: List[str]
    countered_by: List[str]
    awakening_priority: str
    f2p_rating: int  # 1-5
    tips: List[str]


@dataclass
class ScraperResult:
    """Result from a scraper run"""
    source: str
    timestamp: str
    success: bool
    items_scraped: int
    errors: List[str]
    data: Optional[Dict]


class BaseScraperAgent:
    """Base class for all scraper agents"""
    
    def __init__(self, name: str):
        self.name = name
        self.logger = logging.getLogger(f"scraper.{name}")
    
    async def scrape(self) -> ScraperResult:
        """Override in subclass"""
        raise NotImplementedError
    
    def save_to_rag(self, category: str, filename: str, content: str):
        """Save content to RAG directory"""
        output_path = RAG_CONTENT_DIR / category / filename
        output_path.parent.mkdir(parents=True, exist_ok=True)
        output_path.write_text(content, encoding='utf-8')
        self.logger.info(f"Saved: {output_path}")


class TopHeroesInfoScraper(BaseScraperAgent):
    """Scraper for topheroes.info website"""
    
    BASE_URL = "https://topheroes.info"
    
    def __init__(self):
        super().__init__("topheroes_info")
    
    async def scrape(self) -> ScraperResult:
        """Scrape hero data from topheroes.info"""
        
        errors = []
        heroes_scraped = 0
        
        try:
            async with aiohttp.ClientSession() as session:
                # Fetch hero list page
                async with session.get(f"{self.BASE_URL}/hero.php") as response:
                    if response.status != 200:
                        raise Exception(f"HTTP {response.status}")
                    
                    html = await response.text()
                    soup = BeautifulSoup(html, 'html.parser')
                    
                    # Parse hero links
                    hero_links = soup.select('a[href*="/hero/"]')
                    
                    for link in hero_links:
                        try:
                            hero_url = link.get('href')
                            if hero_url:
                                # Fetch individual hero page
                                hero_data = await self._scrape_hero_page(
                                    session, 
                                    f"{self.BASE_URL}{hero_url}"
                                )
                                if hero_data:
                                    self._save_hero_markdown(hero_data)
                                    heroes_scraped += 1
                        except Exception as e:
                            errors.append(f"Error scraping {link}: {e}")
            
            return ScraperResult(
                source=self.name,
                timestamp=datetime.now().isoformat(),
                success=True,
                items_scraped=heroes_scraped,
                errors=errors,
                data=None
            )
            
        except Exception as e:
            return ScraperResult(
                source=self.name,
                timestamp=datetime.now().isoformat(),
                success=False,
                items_scraped=0,
                errors=[str(e)],
                data=None
            )
    
    async def _scrape_hero_page(self, session, url: str) -> Optional[Dict]:
        """Scrape individual hero page"""
        try:
            async with session.get(url) as response:
                if response.status != 200:
                    return None
                
                html = await response.text()
                soup = BeautifulSoup(html, 'html.parser')
                
                # Extract hero data from page
                # This would be customized based on actual page structure
                name = soup.select_one('h1')
                if name:
                    return {
                        'name': name.get_text(strip=True),
                        'url': url,
                        # Add more fields based on page structure
                    }
                
                return None
        except Exception as e:
            self.logger.error(f"Error scraping {url}: {e}")
            return None
    
    def _save_hero_markdown(self, hero_data: Dict):
        """Convert hero data to markdown and save"""
        name = hero_data.get('name', 'Unknown')
        slug = name.lower().replace(' ', '-')
        
        markdown = f"""# {name}

## Overview
- **Faction**: TBD
- **Rarity**: TBD
- **Role**: TBD
- **Tier**: TBD

## Skills
*Content scraped from topheroes.info*

## Recommended Build
*See topheroes.info for latest recommendations*

## Source
- URL: {hero_data.get('url', 'N/A')}
- Last Updated: {datetime.now().isoformat()}
"""
        
        self.save_to_rag('heroes', f'{slug}.md', markdown)


class FandomWikiScraper(BaseScraperAgent):
    """Scraper for Top Heroes Fandom wiki"""
    
    BASE_URL = "https://topheroes1.fandom.com"
    
    def __init__(self):
        super().__init__("fandom_wiki")
    
    async def scrape(self) -> ScraperResult:
        """Scrape content from Fandom wiki"""
        # Implementation similar to TopHeroesInfoScraper
        # but adapted for Fandom wiki structure
        return ScraperResult(
            source=self.name,
            timestamp=datetime.now().isoformat(),
            success=True,
            items_scraped=0,
            errors=[],
            data=None
        )


class ContentOrchestrator:
    """
    Main orchestrator that coordinates all scrapers
    and manages content updates.
    """
    
    def __init__(self):
        self.scrapers = [
            TopHeroesInfoScraper(),
            FandomWikiScraper(),
        ]
        self.logger = logging.getLogger("orchestrator")
    
    async def run_all_scrapers(self) -> List[ScraperResult]:
        """Run all scrapers concurrently"""
        self.logger.info("Starting scraper orchestration...")
        
        tasks = [scraper.scrape() for scraper in self.scrapers]
        results = await asyncio.gather(*tasks, return_exceptions=True)
        
        # Process results
        successful = sum(1 for r in results if isinstance(r, ScraperResult) and r.success)
        self.logger.info(f"Scraping complete: {successful}/{len(self.scrapers)} successful")
        
        return [r for r in results if isinstance(r, ScraperResult)]
    
    async def validate_content(self):
        """Validate all RAG content files"""
        issues = []
        
        for category in RAG_CONTENT_DIR.iterdir():
            if category.is_dir():
                for file in category.glob('*.md'):
                    content = file.read_text()
                    
                    # Basic validation
                    if len(content) < 100:
                        issues.append(f"Short content: {file}")
                    
                    if '# ' not in content:
                        issues.append(f"Missing header: {file}")
        
        return issues
    
    def generate_content_index(self):
        """Generate index of all RAG content"""
        index = {}
        
        for category in RAG_CONTENT_DIR.iterdir():
            if category.is_dir():
                index[category.name] = []
                for file in category.glob('*.md'):
                    index[category.name].append({
                        'filename': file.name,
                        'path': str(file.relative_to(RAG_CONTENT_DIR)),
                        'size': file.stat().st_size,
                        'modified': datetime.fromtimestamp(
                            file.stat().st_mtime
                        ).isoformat()
                    })
        
        # Save index
        index_path = RAG_CONTENT_DIR / 'index.json'
        index_path.write_text(json.dumps(index, indent=2), encoding='utf-8')
        self.logger.info(f"Index generated: {index_path}")
        
        return index


async def main():
    """Main entry point"""
    orchestrator = ContentOrchestrator()
    
    # Run scrapers
    results = await orchestrator.run_all_scrapers()
    
    # Validate content
    issues = await orchestrator.validate_content()
    if issues:
        logger.warning(f"Content validation issues: {issues}")
    
    # Generate index
    orchestrator.generate_content_index()
    
    # Summary
    for result in results:
        if isinstance(result, ScraperResult):
            status = "✓" if result.success else "✗"
            logger.info(f"{status} {result.source}: {result.items_scraped} items")


if __name__ == "__main__":
    asyncio.run(main())
