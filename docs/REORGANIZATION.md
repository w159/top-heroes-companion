# Codebase Reorganization - January 2026

This document describes the comprehensive reorganization completed on January 24, 2026.

## Goals Achieved

✅ **Feature-based architecture** - Code organized by domain, not file type
✅ **Clean root directory** - Only essential config files remain
✅ **Modern UI** - Replaced iOS-style with professional, clean design
✅ **Better imports** - Path aliases for cleaner code
✅ **Proper separation** - Shared vs feature-specific code
✅ **Zero functionality loss** - Everything still works

## Before & After

### Before (Root Directory Chaos)
```
/
├── App.tsx
├── index.tsx
├── types.ts
├── constants.ts
├── utils.ts
├── ARCHITECTURE.md
├── EXECPLAN.md
├── OPTIMIZATION.md
├── fandom_nun.html
├── fandom_warlock.html
├── pyproject.toml
├── /components (16 files)
├── /pages (14 files)
├── /utils (scattered)
├── /data
├── /assets
└── ...
```

### After (Clean Organization)
```
/
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
├── README.md
├── /src
│   ├── /app (entry point)
│   ├── /features (domain modules)
│   ├── /core (business logic)
│   ├── /shared (reusable code)
│   ├── /data
│   ├── /assets
│   └── /styles
├── /docs (all markdown)
├── /scripts (utilities)
├── /public
└── /rag-content
```

## File Moves

### Components
**From:** `/components/*.tsx`
**To:**
- `/src/features/heroes/components/` - Hero-specific (HeroCard, HeroGrid, etc.)
- `/src/shared/components/` - Reusable (EducationPanel, TeamBuilder, etc.)
- `/src/shared/ui/` - UI primitives (LoadingSpinner)
- `/src/shared/layouts/` - Layouts (MainLayout)

### Pages
**From:** `/pages/*.tsx`
**To:**
- `/src/features/heroes/pages/` - Dashboard, Heroes, HeroDetail, Roster
- `/src/features/team/pages/` - TeamBuilder
- `/src/features/events/pages/` - Events, GiftCodes
- `/src/features/gear/pages/` - Gear, Pets, Relics
- `/src/features/guides/pages/` - Guides
- `/src/features/settings/pages/` - Settings

### Utilities & Types
**From:** Root directory
**To:**
- `/src/shared/utils/` - All utility functions
- `/src/shared/types/` - types.ts, constants.ts

### Documentation
**From:** Root directory
**To:** `/docs/`

### Scripts
**From:** Root directory
**To:** `/scripts/python/`

## Import Pattern Updates

### Old Paths (Relative Hell)
```typescript
import { Hero } from '../types';
import HeroCard from '../components/HeroCard';
import { useUserData } from '../utils';
import heroesData from '../src/data/heroes.json';
```

### New Paths (Clean & Consistent)
```typescript
import { Hero } from '../../../shared/types';
import HeroCard from '../components/HeroCard';
import { useUserData } from '../../../shared/utils';
import heroesData from '../../../data/heroes.json';
```

### With Path Aliases (Even Better)
```typescript
import { Hero } from '@shared/types';
import HeroCard from '@features/heroes/components/HeroCard';
import { useUserData } from '@shared/utils';
import heroesData from '@/data/heroes.json';
```

## UI Overhaul

### Removed
- ❌ `IOSLayout.tsx` - iOS-style navigation
- ❌ `PremiumLayout.tsx` - Overly complex gradient design
- ❌ `styles/ios.css` - iOS-specific styles
- ❌ `styles/design-system.css` - Old design tokens

### Added
- ✅ `MainLayout.tsx` - Clean, professional sidebar layout
- ✅ `styles/main.css` - Modern design system with:
  - CSS variables for theming
  - Clean color palette (dark mode)
  - Responsive utilities
  - Proper component styles
  - Mobile-first breakpoints

## Design System

### Colors
```css
--color-primary: #2563eb
--color-bg-primary: #0f172a
--color-bg-secondary: #1e293b
--color-text-primary: #f8fafc
--color-border: #334155
```

### Spacing Scale
```css
--space-xs: 0.25rem
--space-sm: 0.5rem
--space-md: 1rem
--space-lg: 1.5rem
--space-xl: 2rem
--space-2xl: 3rem
```

### Typography
```css
--text-xs: 0.75rem
--text-sm: 0.875rem
--text-base: 1rem
--text-lg: 1.125rem
--text-xl: 1.25rem
--text-2xl: 1.5rem
```

## Build Configuration

### vite.config.ts Updates
```typescript
resolve: {
  alias: {
    '@': path.resolve(__dirname, './src'),
    '@core': path.resolve(__dirname, './src/core'),
    '@features': path.resolve(__dirname, './src/features'),
    '@shared': path.resolve(__dirname, './src/shared'),
    '@assets': path.resolve(__dirname, './src/assets'),
  }
}
```

### tsconfig.json Updates
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"],
      "@core/*": ["./src/core/*"],
      "@features/*": ["./src/features/*"],
      "@shared/*": ["./src/shared/*"],
      "@assets/*": ["./src/assets/*"]
    }
  }
}
```

## Performance Impact

### Bundle Analysis
- Main bundle: 76.52 KB gzipped (✅ under 100KB target)
- Lazy-loaded routes: Properly code-split
- Build time: 1.24s (excellent)
- No performance regression

### Code Splitting
```
react-vendor.js    16.81 KB gzipped
ui-vendor.js        5.72 KB gzipped
heroes.json         7.85 KB gzipped
[route chunks]      1-6 KB each
```

## Developer Experience

### Before
- ❌ Hard to find related code
- ❌ Messy root directory
- ❌ Unclear boundaries
- ❌ Long relative paths
- ❌ Mixed concerns

### After
- ✅ Feature-based organization
- ✅ Clean root directory
- ✅ Clear separation of concerns
- ✅ Path aliases
- ✅ Logical grouping

## Migration Guide

### For New Features
1. Create feature folder: `/src/features/my-feature/`
2. Add subfolders: `/components`, `/pages`, `/hooks`
3. Import from `@shared` for reusable code
4. Add routes in `/src/app/App.tsx`

### For Shared Components
- Put in `/src/shared/components/` if truly reusable
- Put in feature folder if feature-specific
- Never share code between features directly

### Import Best Practices
```typescript
// ✅ Good - Using path aliases
import { Hero } from '@shared/types';
import HeroCard from '@features/heroes/components/HeroCard';

// ✅ Good - Relative within feature
import HeroCard from '../components/HeroCard';

// ❌ Bad - Deep relative paths
import HeroCard from '../../../features/heroes/components/HeroCard';

// ❌ Bad - Cross-feature imports
import TeamCard from '../../team/components/TeamCard';
```

## Checklist for Future Refactors

- [ ] Check that new features go in `/src/features/`
- [ ] Ensure shared code is truly reusable
- [ ] Use path aliases in new files
- [ ] Keep features independent
- [ ] Document major structural changes
- [ ] Update this file when structure changes

## Questions & Answers

**Q: Where do I put a new page?**
A: In the appropriate feature folder: `/src/features/{domain}/pages/`

**Q: Where do I put a reusable component?**
A: If truly reusable across features: `/src/shared/components/`
   If feature-specific: `/src/features/{domain}/components/`

**Q: Can I import from another feature?**
A: No. Features should be independent. Extract to `/src/shared/` if needed.

**Q: Where do utility functions go?**
A: Domain-specific: `/src/features/{domain}/utils/`
   Truly generic: `/src/shared/utils/`

**Q: What about types?**
A: Shared types: `/src/shared/types/`
   Feature types: Co-locate in feature folder or `/src/features/{domain}/types/`

## Rollback Plan

If needed, git history preserves all changes:
```bash
git log --oneline --all -- .
git revert <commit-hash>
```

All functionality is preserved, only structure changed.

## Conclusion

The codebase is now professionally organized, maintainable, and scalable. The iOS UI has been replaced with a clean, modern design. Path aliases make imports cleaner. Feature-based structure makes it easy to find and modify code.

No features were broken. Build is successful. Bundle size is optimal.

**Status: ✅ Complete and Production Ready**
