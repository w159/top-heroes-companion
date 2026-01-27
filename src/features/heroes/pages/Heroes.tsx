import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Filter,
  Grid3x3,
  List,
  Shield,
  Sword,
  Heart,
  Zap,
  Star,
  X,
  ChevronDown,
} from 'lucide-react';
import heroesData from '../../../data/heroes.json';
import { Button } from '../../../shared/ui/components/button';
import { Card, CardContent } from '../../../shared/ui/components/card';
import { Badge } from '../../../shared/ui/components/badge';
import { Chip } from '../../../shared/ui/components/chip';
import { Input } from '../../../shared/ui/components/input';
import { IconButton } from '../../../shared/ui/components/icon-button';
import { cn, getRarityColor, getRarityBorderColor } from '../../../shared/lib/utils';

type ViewMode = 'grid' | 'list';
type SortBy = 'name' | 'rarity' | 'faction' | 'role';

interface Hero {
  id: string;
  name: string;
  faction: string;
  rarity: string;
  role: string;
  image: string;
}

const Heroes: React.FC = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFaction, setSelectedFaction] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [selectedRarity, setSelectedRarity] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortBy>('name');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const factions = [...new Set(heroesData.map(h => h.faction))].sort();
  const roles = [...new Set(heroesData.map(h => h.role))].sort();
  const rarities = ['Common', 'Rare', 'Epic', 'Legendary', 'Mythic'];

  const getRoleIcon = (role: string) => {
    const icons: Record<string, React.ElementType> = {
      'Tank': Shield,
      'Warrior': Sword,
      'Mage': Star,
      'Support': Heart,
      'Assassin': Zap
    };
    return icons[role] || Shield;
  };

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

  return (
    <div className="space-y-6 animate-in">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-headline-lg font-semibold">Hero Arsenal</h1>
          <p className="text-body-md text-muted-foreground mt-1">
            {filteredAndSortedHeroes.length} of {heroesData.length} heroes
            {activeFiltersCount > 0 && ` • ${activeFiltersCount} filter${activeFiltersCount > 1 ? 's' : ''} active`}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <IconButton
            variant={viewMode === 'grid' ? 'tonal' : 'default'}
            onClick={() => setViewMode('grid')}
          >
            <Grid3x3 className="w-5 h-5" />
          </IconButton>
          <IconButton
            variant={viewMode === 'list' ? 'tonal' : 'default'}
            onClick={() => setViewMode('list')}
          >
            <List className="w-5 h-5" />
          </IconButton>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <Card variant="filled" className="p-4">
        <div className="flex flex-wrap gap-3">
          {/* Search Input */}
          <div className="flex-1 min-w-[240px]">
            <Input
              type="text"
              placeholder="Search heroes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leadingIcon={<Search className="w-5 h-5" />}
            />
          </div>

          {/* Filter Toggle */}
          <Button
            variant={isFilterOpen ? 'tonal' : 'outlined'}
            onClick={() => setIsFilterOpen(!isFilterOpen)}
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
              onChange={(e) => setSortBy(e.target.value as SortBy)}
              className="h-10 pl-4 pr-10 bg-surface-800 border border-border rounded-full text-label-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring"
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
          <div className="mt-4 pt-4 border-t border-border animate-in grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Faction Filter */}
            <div>
              <p className="text-label-md text-muted-foreground uppercase tracking-wider mb-3">Faction</p>
              <div className="flex flex-wrap gap-2">
                {factions.map(faction => (
                  <Chip
                    key={faction}
                    variant="filter"
                    selected={selectedFaction === faction}
                    onClick={() => setSelectedFaction(selectedFaction === faction ? null : faction)}
                  >
                    {faction}
                  </Chip>
                ))}
              </div>
            </div>

            {/* Role Filter */}
            <div>
              <p className="text-label-md text-muted-foreground uppercase tracking-wider mb-3">Role</p>
              <div className="flex flex-wrap gap-2">
                {roles.map(role => {
                  const RoleIcon = getRoleIcon(role);
                  return (
                    <Chip
                      key={role}
                      variant="filter"
                      selected={selectedRole === role}
                      onClick={() => setSelectedRole(selectedRole === role ? null : role)}
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
              <p className="text-label-md text-muted-foreground uppercase tracking-wider mb-3">Rarity</p>
              <div className="flex flex-wrap gap-2">
                {rarities.map(rarity => (
                  <Chip
                    key={rarity}
                    variant="filter"
                    selected={selectedRarity === rarity}
                    onClick={() => setSelectedRarity(selectedRarity === rarity ? null : rarity)}
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
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  <X className="w-4 h-4" />
                  Clear All Filters
                </Button>
              </div>
            )}
          </div>
        )}
      </Card>

      {/* Hero Grid */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 stagger-children">
          {filteredAndSortedHeroes.map((hero: Hero) => {
            const RoleIcon = getRoleIcon(hero.role);

            return (
              <Card
                key={hero.id}
                variant="filled"
                interactive
                onClick={() => navigate(`/heroes/${hero.id}`)}
                className="overflow-hidden"
              >
                {/* Hero Image */}
                <div
                  className="relative h-48 bg-gradient-to-b from-transparent to-surface-900"
                  style={{
                    backgroundImage: `linear-gradient(to bottom, transparent 40%, var(--color-surface-900) 100%), url(${hero.image || hero.imageUrl})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                >
                  {/* Rarity Badge */}
                  <div className="absolute top-3 right-3">
                    <Badge
                      className={cn(
                        'backdrop-blur-sm bg-surface-900/80',
                        getRarityColor(hero.rarity),
                        getRarityBorderColor(hero.rarity)
                      )}
                      size="sm"
                    >
                      {hero.rarity}
                    </Badge>
                  </div>

                  {/* Faction Badge */}
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
                      <h3 className="text-title-md font-medium truncate">{hero.name}</h3>
                      <div className="flex items-center gap-1.5 text-body-sm text-muted-foreground mt-1">
                        <RoleIcon className="w-4 h-4" />
                        {hero.role}
                      </div>
                    </div>
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center flex-shrink-0">
                      <RoleIcon className="w-5 h-5 text-white" />
                    </div>
                  </div>

                  <Button variant="tonal" size="sm" className="w-full mt-4">
                    View Details
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Hero List View */}
      {viewMode === 'list' && (
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
                  {/* Hero Image */}
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

                  {/* Hero Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-title-md font-medium truncate">{hero.name}</h3>
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

                  <Button variant="filled" size="sm" className="flex-shrink-0">
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
          <Shield className="w-16 h-16 mx-auto mb-4 text-muted-foreground/30" />
          <h3 className="text-headline-sm font-medium mb-2">No Heroes Found</h3>
          <p className="text-body-md text-muted-foreground mb-6">
            Try adjusting your filters or search query
          </p>
          <Button variant="filled" onClick={clearFilters}>
            Clear All Filters
          </Button>
        </Card>
      )}
    </div>
  );
};

export default Heroes;
