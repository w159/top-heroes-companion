import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Filter,
  SlidersHorizontal,
  Grid3x3,
  List,
  Star,
  Shield,
  Sword,
  Heart,
  Zap,
  X,
  ChevronDown,
  ArrowUpDown
} from 'lucide-react';
import heroesData from '../../../data/heroes.json';
import '../../../styles/main.css';

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

  const getRarityColor = (rarity: string) => {
    const colors: Record<string, string> = {
      'Common': 'var(--color-text-tertiary)',
      'Rare': 'var(--color-info)',
      'Epic': '#9f7aea',
      'Legendary': 'var(--color-warning)',
      'Mythic': 'var(--color-danger)'
    };
    return colors[rarity] || 'var(--color-text-primary)';
  };

  const getRoleIcon = (role: string) => {
    const icons: Record<string, any> = {
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
    <div className="animate-fadeIn" style={{ paddingBottom: 'var(--space-4xl)' }}>
      {/* Header Section */}
      <div style={{ marginBottom: 'var(--space-2xl)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 'var(--space-lg)' }}>
          <div>
            <h1 className="font-display" style={{
              fontSize: 'var(--text-4xl)',
              margin: 0,
              marginBottom: 'var(--space-sm)'
            }}>
              HERO ARSENAL
            </h1>
            <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-text-secondary)', margin: 0 }}>
              {filteredAndSortedHeroes.length} of {heroesData.length} heroes
              {activeFiltersCount > 0 && ` • ${activeFiltersCount} filter${activeFiltersCount > 1 ? 's' : ''} active`}
            </p>
          </div>

          <div style={{ display: 'flex', gap: 'var(--space-md)' }}>
            <button
              className={`btn ${viewMode === 'grid' ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setViewMode('grid')}
              style={{ padding: 'var(--space-md)' }}
            >
              <Grid3x3 size={20} />
            </button>
            <button
              className={`btn ${viewMode === 'list' ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setViewMode('list')}
              style={{ padding: 'var(--space-md)' }}
            >
              <List size={20} />
            </button>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="card" style={{ padding: 'var(--space-lg)' }}>
          <div style={{ display: 'flex', gap: 'var(--space-md)', flexWrap: 'wrap' }}>
            {/* Search Input */}
            <div style={{ position: 'relative', flex: 1, minWidth: '280px' }}>
              <Search
                size={18}
                style={{
                  position: 'absolute',
                  left: 'var(--space-md)',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--color-text-tertiary)'
                }}
              />
              <input
                type="text"
                placeholder="Search heroes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input"
                style={{
                  paddingLeft: 'var(--space-3xl)',
                  height: '48px',
                  fontSize: 'var(--text-sm)',
                  background: 'var(--color-bg-tertiary)',
                  width: '100%'
                }}
              />
            </div>

            {/* Filter Toggle */}
            <button
              className={`btn ${isFilterOpen ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              style={{ position: 'relative' }}
            >
              <Filter size={18} />
              Filters
              {activeFiltersCount > 0 && (
                <span className="badge badge-danger" style={{
                  position: 'absolute',
                  top: '-6px',
                  right: '-6px',
                  fontSize: '10px',
                  padding: '2px 6px',
                  minWidth: '20px'
                }}>
                  {activeFiltersCount}
                </span>
              )}
            </button>

            {/* Sort Dropdown */}
            <div style={{ position: 'relative' }}>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortBy)}
                className="btn btn-secondary"
                style={{
                  appearance: 'none',
                  paddingRight: 'var(--space-2xl)',
                  cursor: 'pointer'
                }}
              >
                <option value="name">Sort: Name</option>
                <option value="rarity">Sort: Rarity</option>
                <option value="faction">Sort: Faction</option>
                <option value="role">Sort: Role</option>
              </select>
              <ChevronDown
                size={16}
                style={{
                  position: 'absolute',
                  right: 'var(--space-md)',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  pointerEvents: 'none',
                  color: 'var(--color-text-tertiary)'
                }}
              />
            </div>
          </div>

          {/* Filter Panel */}
          {isFilterOpen && (
            <div className="animate-fadeIn" style={{
              marginTop: 'var(--space-xl)',
              paddingTop: 'var(--space-xl)',
              borderTop: '1px solid var(--color-divider)',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: 'var(--space-xl)'
            }}>
              {/* Faction Filter */}
              <div>
                <div style={{
                  fontSize: 'var(--text-xs)',
                  fontWeight: 600,
                  color: 'var(--color-text-tertiary)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  marginBottom: 'var(--space-md)'
                }}>
                  Faction
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-sm)' }}>
                  {factions.map(faction => (
                    <button
                      key={faction}
                      className={`badge ${selectedFaction === faction ? 'badge-primary' : ''}`}
                      onClick={() => setSelectedFaction(selectedFaction === faction ? null : faction)}
                      style={{
                        cursor: 'pointer',
                        padding: 'var(--space-sm) var(--space-md)',
                        background: selectedFaction === faction ? 'var(--gradient-primary)' : 'var(--color-bg-elevated)',
                        border: selectedFaction === faction ? 'none' : '1px solid var(--color-border)',
                        color: selectedFaction === faction ? 'white' : 'var(--color-text-primary)'
                      }}
                    >
                      {faction}
                    </button>
                  ))}
                </div>
              </div>

              {/* Role Filter */}
              <div>
                <div style={{
                  fontSize: 'var(--text-xs)',
                  fontWeight: 600,
                  color: 'var(--color-text-tertiary)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  marginBottom: 'var(--space-md)'
                }}>
                  Role
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-sm)' }}>
                  {roles.map(role => {
                    const RoleIcon = getRoleIcon(role);
                    return (
                      <button
                        key={role}
                        className={`badge ${selectedRole === role ? 'badge-primary' : ''}`}
                        onClick={() => setSelectedRole(selectedRole === role ? null : role)}
                        style={{
                          cursor: 'pointer',
                          padding: 'var(--space-sm) var(--space-md)',
                          background: selectedRole === role ? 'var(--gradient-primary)' : 'var(--color-bg-elevated)',
                          border: selectedRole === role ? 'none' : '1px solid var(--color-border)',
                          color: selectedRole === role ? 'white' : 'var(--color-text-primary)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 'var(--space-xs)'
                        }}
                      >
                        <RoleIcon size={14} />
                        {role}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Rarity Filter */}
              <div>
                <div style={{
                  fontSize: 'var(--text-xs)',
                  fontWeight: 600,
                  color: 'var(--color-text-tertiary)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  marginBottom: 'var(--space-md)'
                }}>
                  Rarity
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-sm)' }}>
                  {rarities.map(rarity => (
                    <button
                      key={rarity}
                      className={`badge ${selectedRarity === rarity ? 'badge-primary' : ''}`}
                      onClick={() => setSelectedRarity(selectedRarity === rarity ? null : rarity)}
                      style={{
                        cursor: 'pointer',
                        padding: 'var(--space-sm) var(--space-md)',
                        background: selectedRarity === rarity ? 'var(--gradient-primary)' : 'var(--color-bg-elevated)',
                        border: selectedRarity === rarity ? 'none' : `1px solid ${getRarityColor(rarity)}`,
                        color: selectedRarity === rarity ? 'white' : getRarityColor(rarity)
                      }}
                    >
                      {rarity}
                    </button>
                  ))}
                </div>
              </div>

              {/* Clear Filters */}
              {activeFiltersCount > 0 && (
                <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                  <button className="btn btn-ghost btn-sm" onClick={clearFilters}>
                    <X size={14} />
                    Clear All Filters
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Hero Grid */}
      {viewMode === 'grid' && (
        <div className="grid" style={{
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 'var(--space-xl)'
        }}>
          {filteredAndSortedHeroes.map((hero: Hero) => {
            const RoleIcon = getRoleIcon(hero.role);

            return (
              <div
                key={hero.id}
                className="card animate-fadeIn"
                onClick={() => navigate(`/heroes/${hero.id}`)}
                style={{
                  cursor: 'pointer',
                  padding: 0,
                  overflow: 'hidden',
                  position: 'relative',
                  background: 'var(--color-bg-secondary)'
                }}
              >
                {/* Hero Image */}
                <div style={{
                  width: '100%',
                  height: '220px',
                  background: `linear-gradient(180deg, transparent 0%, var(--color-bg-secondary) 100%), url(${hero.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  position: 'relative'
                }}>
                  {/* Rarity Badge */}
                  <div style={{
                    position: 'absolute',
                    top: 'var(--space-md)',
                    right: 'var(--space-md)',
                    padding: 'var(--space-xs) var(--space-md)',
                    background: 'rgba(10, 14, 26, 0.8)',
                    backdropFilter: 'var(--blur-md)',
                    borderRadius: 'var(--radius-full)',
                    border: `1px solid ${getRarityColor(hero.rarity)}`,
                    fontSize: 'var(--text-xs)',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    color: getRarityColor(hero.rarity),
                    letterSpacing: '0.05em'
                  }}>
                    {hero.rarity}
                  </div>

                  {/* Faction Badge */}
                  <div style={{
                    position: 'absolute',
                    top: 'var(--space-md)',
                    left: 'var(--space-md)',
                    padding: 'var(--space-xs) var(--space-md)',
                    background: 'rgba(10, 14, 26, 0.8)',
                    backdropFilter: 'var(--blur-md)',
                    borderRadius: 'var(--radius-full)',
                    border: '1px solid var(--color-border)',
                    fontSize: 'var(--text-xs)',
                    fontWeight: 600,
                    color: 'var(--color-text-secondary)'
                  }}>
                    {hero.faction}
                  </div>
                </div>

                {/* Hero Info */}
                <div style={{ padding: 'var(--space-lg)' }}>
                  <div style={{ display: 'flex', alignItems: 'start', gap: 'var(--space-md)', marginBottom: 'var(--space-md)' }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h3 className="font-heading" style={{
                        fontSize: 'var(--text-lg)',
                        margin: 0,
                        marginBottom: '4px',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}>
                        {hero.name}
                      </h3>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--space-xs)',
                        fontSize: 'var(--text-sm)',
                        color: 'var(--color-text-tertiary)'
                      }}>
                        <RoleIcon size={14} />
                        {hero.role}
                      </div>
                    </div>

                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: 'var(--radius-lg)',
                      background: 'var(--gradient-primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <RoleIcon size={20} color="white" strokeWidth={2.5} />
                    </div>
                  </div>

                  <button className="btn btn-secondary btn-sm" style={{ width: '100%' }}>
                    View Details
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Hero List View */}
      {viewMode === 'list' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
          {filteredAndSortedHeroes.map((hero: Hero) => {
            const RoleIcon = getRoleIcon(hero.role);

            return (
              <div
                key={hero.id}
                className="card animate-fadeIn"
                onClick={() => navigate(`/heroes/${hero.id}`)}
                style={{
                  cursor: 'pointer',
                  padding: 'var(--space-lg)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-xl)'
                }}
              >
                {/* Hero Image */}
                <div style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: 'var(--radius-lg)',
                  background: `url(${hero.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  flexShrink: 0,
                  border: `2px solid ${getRarityColor(hero.rarity)}`
                }} />

                {/* Hero Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h3 className="font-heading" style={{ fontSize: 'var(--text-xl)', margin: 0, marginBottom: 'var(--space-sm)' }}>
                    {hero.name}
                  </h3>
                  <div style={{ display: 'flex', gap: 'var(--space-md)', flexWrap: 'wrap' }}>
                    <span className="badge" style={{
                      background: 'var(--color-bg-elevated)',
                      border: `1px solid ${getRarityColor(hero.rarity)}`,
                      color: getRarityColor(hero.rarity)
                    }}>
                      {hero.rarity}
                    </span>
                    <span className="badge badge-primary">
                      {hero.faction}
                    </span>
                    <span className="badge" style={{
                      background: 'var(--color-bg-elevated)',
                      border: '1px solid var(--color-border)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--space-xs)'
                    }}>
                      <RoleIcon size={12} />
                      {hero.role}
                    </span>
                  </div>
                </div>

                <button className="btn btn-primary">
                  View Details
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Empty State */}
      {filteredAndSortedHeroes.length === 0 && (
        <div className="card" style={{
          padding: 'var(--space-4xl)',
          textAlign: 'center'
        }}>
          <Shield size={64} style={{ opacity: 0.2, margin: '0 auto var(--space-xl)' }} />
          <h3 className="font-heading" style={{ fontSize: 'var(--text-2xl)', marginBottom: 'var(--space-md)' }}>
            No Heroes Found
          </h3>
          <p style={{ color: 'var(--color-text-tertiary)', marginBottom: 'var(--space-xl)' }}>
            Try adjusting your filters or search query
          </p>
          <button className="btn btn-primary" onClick={clearFilters}>
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default Heroes;
