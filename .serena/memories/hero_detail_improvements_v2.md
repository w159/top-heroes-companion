[Type: Decision]
[Context: Project: top-heroes-companion | Feature: HeroDetail + HeroCard]
[Summary: HeroDetail additions and HeroCard image fallback finalized with topheroes-first ordering.]
[Details:
- HeroDetail: bonds layout shows portrait + linked partner name + bonus badge; skins show bonus badge with fallback text.
- HeroDetail: separate Specialized Weapon and Exclusive Gear sections with styled cards and empty-state messaging.
- HeroDetail: Recommended Gear section keeps icon badges and handles empty lists.
- HeroCard: image fallback order is topheroes main/alt, then optional hero.imageUrl, then wiki, then placeholder; comment updated to match.
- Tests: not run (no test script configured).
]
[References: pages/HeroDetail.tsx, components/HeroCard.tsx]