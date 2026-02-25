import React from 'react';
import {
  Search,
  Filter,
  X,
} from 'lucide-react';
import { Button } from '@/shared/ui/components/button';
import { Card } from '@/shared/ui/components/card';
import { Badge } from '@/shared/ui/components/badge';
import { Chip } from '@/shared/ui/components/chip';
import { Input } from '@/shared/ui/components/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/shared/ui/components/select';
import { Collapsible, CollapsibleContent } from '@/shared/ui/components/collapsible';
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
        variant={isFilterOpen ? 'secondary' : 'outline'}
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
      <Select value={sortBy} onValueChange={(v) => onSortChange(v as SortBy)}>
        <SelectTrigger className="w-[160px]">
          <SelectValue placeholder="Sort by..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="name">Name</SelectItem>
          <SelectItem value="rarity">Rarity</SelectItem>
          <SelectItem value="faction">Faction</SelectItem>
          <SelectItem value="role">Role</SelectItem>
        </SelectContent>
      </Select>
    </div>

    {/* Filter Panel */}
    <Collapsible open={isFilterOpen}>
      <CollapsibleContent>
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
      </CollapsibleContent>
    </Collapsible>
  </Card>
);

export default HeroFilterBar;
