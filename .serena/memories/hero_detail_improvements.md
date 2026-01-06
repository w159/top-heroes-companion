[Type: Decision]
[Context: Project: top-heroes-companion | Feature: HeroDetail + HeroCard]
[Summary: Updated HeroDetail sections and HeroCard image fallback to prioritize topheroes.info.]
[Details:
- HeroDetail: bonds now show portrait + name link + bonus badge; recommended gear heading updated and guarded for empty lists.
- HeroDetail: added separate Specialized Weapon and Exclusive Gear sections with styled cards and fallbacks; skins bonus now uses a distinct badge style.
- HeroCard: image sources now prioritize topheroes main/alt URLs, then optional hero.imageUrl, then wiki, then placeholder.
- Docs consulted: React Router Link usage (/remix-run/react-router).
- Tests: not run (no test script configured).
]
[References: pages/HeroDetail.tsx, components/HeroCard.tsx]