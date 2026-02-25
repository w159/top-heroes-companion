import { useState, useMemo } from 'react';
import heroesData from '../../../data/heroes.json';
import { Hero } from '../../../shared/types';

export type ViewMode = 'grid' | 'list';
export type SortBy = 'name' | 'rarity' | 'faction' | 'role';

export interface HeroFilterState {
  viewMode: ViewMode;
  searchQuery: string;
  selectedFaction: string | null;
  selectedRole: string | null;
  selectedRarity: string | null;
  sortBy: SortBy;
  isFilterOpen: boolean;
}

export interface HeroFilterActions {
  setViewMode: (mode: ViewMode) => void;
  setSearchQuery: (query: string) => void;
  setSelectedFaction: (faction: string | null) => void;
  setSelectedRole: (role: string | null) => void;
  setSelectedRarity: (rarity: string | null) => void;
  setSortBy: (sort: SortBy) => void;
  setIsFilterOpen: (open: boolean) => void;
  clearFilters: () => void;
}

export interface UseHeroFilteringReturn {
  state: HeroFilterState;
  actions: HeroFilterActions;
  filteredAndSortedHeroes: Hero[];
  activeFiltersCount: number;
  factions: string[];
  roles: string[];
  rarities: string[];
  totalHeroCount: number;
}

export function useHeroFiltering(): UseHeroFilteringReturn {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFaction, setSelectedFaction] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [selectedRarity, setSelectedRarity] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortBy>('name');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const factions = useMemo(() => [...new Set(heroesData.map(h => h.faction))].sort(), []);
  const roles = useMemo(() => [...new Set(heroesData.map(h => h.role))].sort(), []);
  const rarities = ['Common', 'Rare', 'Epic', 'Legendary', 'Mythic'];

  const filteredAndSortedHeroes = useMemo(() => {
    let filtered = heroesData.filter((hero: Hero) => {
      const matchesSearch = hero.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFaction = !selectedFaction || hero.faction === selectedFaction;
      const matchesRole = !selectedRole || hero.role === selectedRole;
      const matchesRarity = !selectedRarity || hero.rarity === selectedRarity;
      return matchesSearch && matchesFaction && matchesRole && matchesRarity;
    });

    filtered.sort((a: Hero, b: Hero) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'faction') return a.faction.localeCompare(b.faction);
      if (sortBy === 'role') return a.role.localeCompare(b.role);
      if (sortBy === 'rarity') {
        const rarityOrder = ['Common', 'Rare', 'Epic', 'Legendary', 'Mythic'];
        return rarityOrder.indexOf(b.rarity) - rarityOrder.indexOf(a.rarity);
      }
      return 0;
    });

    return filtered;
  }, [searchQuery, selectedFaction, selectedRole, selectedRarity, sortBy]);

  const activeFiltersCount = [selectedFaction, selectedRole, selectedRarity].filter(Boolean).length;

  const clearFilters = () => {
    setSelectedFaction(null);
    setSelectedRole(null);
    setSelectedRarity(null);
  };

  return {
    state: {
      viewMode,
      searchQuery,
      selectedFaction,
      selectedRole,
      selectedRarity,
      sortBy,
      isFilterOpen,
    },
    actions: {
      setViewMode,
      setSearchQuery,
      setSelectedFaction,
      setSelectedRole,
      setSelectedRarity,
      setSortBy,
      setIsFilterOpen,
      clearFilters,
    },
    filteredAndSortedHeroes,
    activeFiltersCount,
    factions,
    roles,
    rarities,
    totalHeroCount: heroesData.length,
  };
}
