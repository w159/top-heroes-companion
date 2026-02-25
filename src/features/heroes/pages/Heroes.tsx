import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Grid3x3,
  List,
  Shield,
} from 'lucide-react';
import { Button } from '@/shared/ui/components/button';
import { Card, CardContent } from '@/shared/ui/components/card';
import { Badge } from '@/shared/ui/components/badge';
import { ToggleGroup, ToggleGroupItem } from '@/shared/ui/components/toggle-group';
import { cn, getRarityColor, getRarityBorderColor, getRoleIcon } from '@/shared/lib/utils';
import { Hero } from '@/shared/types';
import { useHeroFiltering } from '../hooks/useHeroFiltering';
import HeroFilterBar from '../components/HeroFilterBar';

const Heroes: React.FC = () => {
  const navigate = useNavigate();
  const {
    state,
    actions,
    filteredAndSortedHeroes,
    activeFiltersCount,
    factions,
    roles,
    rarities,
    totalHeroCount,
  } = useHeroFiltering();

  return (
    <div className="space-y-6 animate-in">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-headline-lg font-heading font-semibold tracking-wide">Hero Arsenal</h1>
          <p className="text-body-md text-muted-foreground mt-1">
            {filteredAndSortedHeroes.length} of {totalHeroCount} heroes
            {activeFiltersCount > 0 && ` \u2022 ${activeFiltersCount} filter${activeFiltersCount > 1 ? 's' : ''} active`}
          </p>
        </div>

        <ToggleGroup type="single" value={state.viewMode} onValueChange={(v) => { if (v) actions.setViewMode(v as 'grid' | 'list'); }}>
          <ToggleGroupItem value="grid" aria-label="Grid view">
            <Grid3x3 className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="list" aria-label="List view">
            <List className="h-4 w-4" />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      {/* Search and Filter Bar */}
      <HeroFilterBar
        searchQuery={state.searchQuery}
        onSearchChange={actions.setSearchQuery}
        isFilterOpen={state.isFilterOpen}
        onFilterToggle={() => actions.setIsFilterOpen(!state.isFilterOpen)}
        sortBy={state.sortBy}
        onSortChange={actions.setSortBy}
        selectedFaction={state.selectedFaction}
        onFactionChange={actions.setSelectedFaction}
        selectedRole={state.selectedRole}
        onRoleChange={actions.setSelectedRole}
        selectedRarity={state.selectedRarity}
        onRarityChange={actions.setSelectedRarity}
        activeFiltersCount={activeFiltersCount}
        onClearFilters={actions.clearFilters}
        factions={factions}
        roles={roles}
        rarities={rarities}
      />

      {/* Hero Grid */}
      {state.viewMode === 'grid' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 stagger-children">
          {filteredAndSortedHeroes.map((hero: Hero) => {
            const RoleIcon = getRoleIcon(hero.role);

            return (
              <Card
                key={hero.id}
                variant="filled"
                interactive
                onClick={() => navigate(`/heroes/${hero.id}`)}
                className="overflow-hidden group"
              >
                {/* Hero Image */}
                <div
                  className="relative h-48 bg-gradient-to-b from-transparent to-surface-800/80"
                  style={{
                    backgroundImage: `linear-gradient(to bottom, transparent 40%, rgba(10,9,8,0.95) 100%), url(${hero.image || hero.imageUrl})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                >
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-500/0 to-transparent group-hover:via-primary-500/30 transition-all duration-normal" />
                  <div className="absolute top-3 right-3">
                    <Badge
                      className={cn(
                        'backdrop-blur-sm bg-surface-900/80 border',
                        getRarityColor(hero.rarity),
                        getRarityBorderColor(hero.rarity)
                      )}
                      size="sm"
                    >
                      {hero.rarity}
                    </Badge>
                  </div>
                  <div className="absolute top-3 left-3">
                    <Badge variant="default" size="sm" className="backdrop-blur-sm bg-surface-900/80">
                      {hero.faction}
                    </Badge>
                  </div>
                </div>

                {/* Hero Info */}
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-title-md font-heading font-medium truncate">{hero.name}</h3>
                      <div className="flex items-center gap-1.5 text-body-sm text-muted-foreground mt-1">
                        <RoleIcon className="w-4 h-4 text-primary-500/60" />
                        {hero.role}
                      </div>
                    </div>
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center flex-shrink-0 border border-primary-500/20">
                      <RoleIcon className="w-5 h-5 text-surface-950" />
                    </div>
                  </div>
                  <Button variant="secondary" size="sm" className="w-full mt-4">
                    View Details
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Hero List View */}
      {state.viewMode === 'list' && (
        <div className="space-y-3 stagger-children">
          {filteredAndSortedHeroes.map((hero: Hero) => {
            const RoleIcon = getRoleIcon(hero.role);

            return (
              <Card
                key={hero.id}
                variant="filled"
                interactive
                onClick={() => navigate(`/heroes/${hero.id}`)}
                className="p-4"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={cn(
                      'w-16 h-16 rounded-lg flex-shrink-0 border-2',
                      getRarityBorderColor(hero.rarity)
                    )}
                    style={{
                      backgroundImage: `url(${hero.image || hero.imageUrl})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-title-md font-heading font-medium truncate">{hero.name}</h3>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <Badge
                        className={cn(
                          getRarityColor(hero.rarity),
                          getRarityBorderColor(hero.rarity)
                        )}
                        size="sm"
                      >
                        {hero.rarity}
                      </Badge>
                      <Badge variant="primary" size="sm">{hero.faction}</Badge>
                      <Badge variant="default" size="sm">
                        <RoleIcon className="w-3 h-3 mr-1" />
                        {hero.role}
                      </Badge>
                    </div>
                  </div>
                  <Button variant="default" size="sm" className="flex-shrink-0">
                    View Details
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Empty State */}
      {filteredAndSortedHeroes.length === 0 && (
        <Card variant="outlined" className="text-center py-16">
          <Shield className="w-16 h-16 mx-auto mb-4 text-muted-foreground/20" />
          <h3 className="text-headline-sm font-heading font-medium mb-2">No Heroes Found</h3>
          <p className="text-body-md text-muted-foreground mb-6">
            Try adjusting your filters or search query
          </p>
          <Button variant="default" onClick={actions.clearFilters}>
            Clear All Filters
          </Button>
        </Card>
      )}
    </div>
  );
};

export default Heroes;
