import React from 'react';
import {
  Search,
  Filter,
  X,
  ChevronDown,
} from 'lucide-react';
import { Button } from '@/shared/ui/components/button';
import { Card } from '@/shared/ui/components/card';
import { Badge } from '@/shared/ui/components/badge';
import { Chip } from '@/shared/ui/components/chip';
import { Input } from '@/shared/ui/components/input';
import { cn, getRarityColor, getRoleIcon } from '@/shared/lib/utils';
import type { SortBy } from '../hooks/useHeroFiltering';

interface HeroFilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  isFilterOpen: boolean;
  onFilterToggle: () => void;
  sortBy: SortBy;
  onSortChange: (sort: SortBy) => void;
  selectedFaction: string | null;
  onFactionChange: (faction: string | null) => void;
  selectedRole: string | null;
  onRoleChange: (role: string | null) => void;
  selectedRarity: string | null;
  onRarityChange: (rarity: string | null) => void;
  activeFiltersCount: number;
  onClearFilters: () => void;
  factions: string[];
  roles: string[];
  rarities: string[];
}

const HeroFilterBar: React.FC<HeroFilterBarProps> = ({
  searchQuery,
  onSearchChange,
  isFilterOpen,
  onFilterToggle,
  sortBy,
  onSortChange,
  selectedFaction,
  onFactionChange,
  selectedRole,
  onRoleChange,
  selectedRarity,
  onRarityChange,
  activeFiltersCount,
  onClearFilters,
  factions,
  roles,
  rarities,
}) => (
  <Card variant="filled" className="p-4">
    <div className="flex flex-wrap gap-3">
      {/* Search Input */}
      <div className="flex-1 min-w-[240px]">
        <Input
          type="text"
          placeholder="Search heroes..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          leadingIcon={<Search className="w-5 h-5" />}
        />
      </div>

      {/* Filter Toggle */}
      <Button
        variant={isFilterOpen ? 'tonal' : 'outlined'}
        onClick={onFilterToggle}
        className="relative"
      >
        <Filter className="w-4 h-4" />
        Filters
        {activeFiltersCount > 0 && (
          <Badge variant="error" size="sm" className="absolute -top-2 -right-2">
            {activeFiltersCount}
          </Badge>
        )}
      </Button>

      {/* Sort Dropdown */}
      <div className="relative">
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value as SortBy)}
          className="h-10 pl-4 pr-10 bg-surface-800/60 border border-border rounded-lg text-label-lg text-foreground appearance-none cursor-pointer focus:outline-none focus:border-primary-500/40 focus:shadow-glow transition-all duration-normal"
        >
          <option value="name">Sort: Name</option>
          <option value="rarity">Sort: Rarity</option>
          <option value="faction">Sort: Faction</option>
          <option value="role">Sort: Role</option>
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
      </div>
    </div>

    {/* Filter Panel */}
    {isFilterOpen && (
      <div className="mt-4 pt-4 border-t border-[rgba(196,170,126,0.08)] animate-in grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Faction Filter */}
        <div>
          <p className="text-label-md text-primary-500/80 uppercase tracking-[0.15em] mb-3 font-medium">Faction</p>
          <div className="flex flex-wrap gap-2">
            {factions.map(faction => (
              <Chip
                key={faction}
                variant="filter"
                selected={selectedFaction === faction}
                onClick={() => onFactionChange(selectedFaction === faction ? null : faction)}
              >
                {faction}
              </Chip>
            ))}
          </div>
        </div>

        {/* Role Filter */}
        <div>
          <p className="text-label-md text-primary-500/80 uppercase tracking-[0.15em] mb-3 font-medium">Role</p>
          <div className="flex flex-wrap gap-2">
            {roles.map(role => {
              const RoleIcon = getRoleIcon(role);
              return (
                <Chip
                  key={role}
                  variant="filter"
                  selected={selectedRole === role}
                  onClick={() => onRoleChange(selectedRole === role ? null : role)}
                  leadingIcon={<RoleIcon className="w-4 h-4" />}
                >
                  {role}
                </Chip>
              );
            })}
          </div>
        </div>

        {/* Rarity Filter */}
        <div>
          <p className="text-label-md text-primary-500/80 uppercase tracking-[0.15em] mb-3 font-medium">Rarity</p>
          <div className="flex flex-wrap gap-2">
            {rarities.map(rarity => (
              <Chip
                key={rarity}
                variant="filter"
                selected={selectedRarity === rarity}
                onClick={() => onRarityChange(selectedRarity === rarity ? null : rarity)}
                className={cn(
                  selectedRarity !== rarity && getRarityColor(rarity)
                )}
              >
                {rarity}
              </Chip>
            ))}
          </div>
        </div>

        {/* Clear Filters */}
        {activeFiltersCount > 0 && (
          <div className="flex items-end">
            <Button variant="ghost" size="sm" onClick={onClearFilters}>
              <X className="w-4 h-4" />
              Clear All Filters
            </Button>
          </div>
        )}
      </div>
    )}
  </Card>
);

export default HeroFilterBar;
