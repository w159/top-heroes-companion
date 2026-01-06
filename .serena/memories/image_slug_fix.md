[Type: Fix]
[Context: Hero images]
[Summary: Image URLs now use hero.id slug to match topheroes filenames.]
[Details:
- In HeroCard and HeroDetail, the topheroes URL slug now derives from `hero.id` (fallback to name) instead of `hero.name`.
- Intended to match topheroes.info file naming and reduce missing portraits.
- No build/tests run.
]
[References: components/HeroCard.tsx, pages/HeroDetail.tsx]