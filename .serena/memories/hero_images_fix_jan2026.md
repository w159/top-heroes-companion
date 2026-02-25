# Hero Images Fix - January 27, 2026

## Problem
After the Tailwind CSS v4 migration (commit 4707b04), all hero images disappeared from the application. Users reported seeing "blank spots" where hero images should be.

## Root Cause
In `src/features/heroes/pages/Heroes.tsx` line 258, the background-image style was using an **undefined CSS variable**:

```javascript
backgroundImage: `linear-gradient(to bottom, transparent 40%, var(--color-surface-900) 100%), url(${hero.image || hero.imageUrl})`
```

The CSS variable `--color-surface-900` was never defined in any CSS file. While Tailwind defines `surface-900` as a color in its config (`#1a1c1e`), this doesn't automatically create CSS variables for inline styles.

When a CSS variable is undefined, the entire background-image property can fail or render incorrectly, causing the images to not display.

## Solution
Replaced the undefined CSS variable with the actual hex color value:

```javascript
backgroundImage: `linear-gradient(to bottom, transparent 40%, #1a1c1e 100%), url(${hero.image || hero.imageUrl})`
```

## Files Modified
- `src/features/heroes/pages/Heroes.tsx` - Fixed line 258 to use `#1a1c1e` instead of `var(--color-surface-900)`
- `src/features/events/pages/EventsRevamped.tsx` - Re-enabled the events-revamped.css import (it wasn't the cause)

## Verification
- Image files exist in `public/img/heroes/` (50 webp files)
- Images are served correctly (HTTP 200)
- `heroes.json` has image properties
- Hero interface has image property
- HeroCard and other components use proper fallback chain: `hero.image || hero.imageUrl`

## Key Learnings
- Inline styles can't use Tailwind utility classes as CSS variables unless explicitly configured
- Always verify CSS variables are defined before using them
- The Tailwind config defines colors but doesn't automatically create CSS variables for them
