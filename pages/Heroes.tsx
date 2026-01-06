
import React, { useState, useMemo } from 'react';
import { HEROES } from '../constants';
import { useUserData } from '../utils';
import HeroCard from '../components/HeroCard';
import { Search, ArrowUpDown, Filter } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import { Rarity, Tier } from '../types';

const Heroes: React.FC = () => {
  const { data, addToRoster, isLoaded } = useUserData();
  const [search, setSearch] = useState('');
  const [filterFaction, setFilterFaction] = useState('All');
  const [filterRole, setFilterRole] = useState('All');
  const [filterRarity, setFilterRarity] = useState('All');
  const [sortBy, setSortBy] = useState<'Tier' | 'Rarity' | 'Name'>('Tier');

  // Sorting priorities
  const tierOrder: Record<Tier, number> = { 'S': 0, 'A': 1, 'B': 2, 'C': 3, 'D': 4 };
  const rarityOrder: Record<Rarity, number> = { 'Mythic': 0, 'Legendary': 1, 'Epic': 2, 'Rare': 3 };

  const filteredHeroes = useMemo(() => {
    return HEROES.filter(hero => {
      const matchesSearch = hero.name.toLowerCase().includes(search.toLowerCase());
      const matchesFaction = filterFaction === 'All' || hero.faction === filterFaction;
      const matchesRole = filterRole === 'All' || hero.role === filterRole;
      const matchesRarity = filterRarity === 'All' || hero.rarity === filterRarity;
      return matchesSearch && matchesFaction && matchesRole && matchesRarity;
    }).sort((a, b) => {
        if (sortBy === 'Tier') {
            if (tierOrder[a.tier] !== tierOrder[b.tier]) {
                return tierOrder[a.tier] - tierOrder[b.tier];
            }
            return rarityOrder[a.rarity] - rarityOrder[b.rarity];
        }
        if (sortBy === 'Rarity') {
            if (rarityOrder[a.rarity] !== rarityOrder[b.rarity]) {
                return rarityOrder[a.rarity] - rarityOrder[b.rarity];
            }
            return tierOrder[a.tier] - tierOrder[b.tier];
        }
        return a.name.localeCompare(b.name);
    });
  }, [search, filterFaction, filterRole, filterRarity, sortBy]);

  if (!isLoaded) return <LoadingSpinner />;

  const ownedIds = new Set(data.roster.map(h => h.id));

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 bg-bg-secondary p-6 rounded-3xl border border-border">
        <div>
          <h1 className="text-3xl font-display font-black text-white flex items-center">
            Hero Database
            <span className="ml-3 text-xs bg-gray-800 text-gray-400 px-2 py-1 rounded-full border border-gray-700 font-mono">
              {filteredHeroes.length} OPERATIVES
            </span>
          </h1>
          <p className="text-gray-500 text-sm mt-1">Full Kingdom Saga intelligence roster.</p>
        </div>
        
        {/* Search & Filters */}
        <div className="flex flex-col md:flex-row gap-3 flex-wrap">
            <div className="relative flex-grow md:flex-grow-0">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={16} />
                <input 
                    type="text" 
                    placeholder="Search name..." 
                    className="pl-10 pr-4 py-2.5 bg-bg-tertiary border border-border rounded-xl text-sm text-white focus:outline-none focus:border-blue-500/50 w-full md:w-56 transition-all"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>
            
            <div className="flex gap-2 flex-wrap">
                <select 
                    className="px-3 py-2.5 bg-bg-tertiary border border-border rounded-xl text-xs font-bold text-gray-300 focus:outline-none hover:border-gray-600 transition-colors"
                    value={filterFaction}
                    onChange={(e) => setFilterFaction(e.target.value)}
                >
                    <option value="All">All Factions</option>
                    <option value="Nature">Nature</option>
                    <option value="League">League</option>
                    <option value="Horde">Horde</option>
                </select>

                <select 
                    className="px-3 py-2.5 bg-bg-tertiary border border-border rounded-xl text-xs font-bold text-gray-300 focus:outline-none hover:border-gray-600 transition-colors"
                    value={filterRole}
                    onChange={(e) => setFilterRole(e.target.value)}
                >
                    <option value="All">All Roles</option>
                    <option value="Tank">Tank</option>
                    <option value="DPS">DPS</option>
                    <option value="Support">Support</option>
                    <option value="Healer">Healer</option>
                </select>

                <select 
                    className="px-3 py-2.5 bg-bg-tertiary border border-border rounded-xl text-xs font-bold text-gray-300 focus:outline-none hover:border-gray-600 transition-colors"
                    value={filterRarity}
                    onChange={(e) => setFilterRarity(e.target.value)}
                >
                    <option value="All">All Rarities</option>
                    <option value="Mythic">Mythic</option>
                    <option value="Legendary">Legendary</option>
                    <option value="Epic">Epic</option>
                    <option value="Rare">Rare</option>
                </select>

                <div className="relative flex items-center">
                    <ArrowUpDown size={14} className="absolute left-3 text-gray-500" />
                    <select 
                        className="pl-9 pr-4 py-2.5 bg-bg-tertiary border border-border rounded-xl text-xs font-bold text-gray-300 focus:outline-none hover:border-gray-600 appearance-none"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as any)}
                    >
                        <option value="Tier">Tier Priority</option>
                        <option value="Rarity">Rarity Rank</option>
                        <option value="Name">Alpha Order</option>
                    </select>
                </div>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {filteredHeroes.map(hero => (
            <HeroCard 
                key={hero.id} 
                hero={hero} 
                isOwned={ownedIds.has(hero.id)} 
                onAction={() => !ownedIds.has(hero.id) && addToRoster(hero)}
                actionLabel="Recruit"
            />
        ))}
      </div>
      
      {filteredHeroes.length === 0 && (
          <div className="text-center py-32 bg-bg-secondary rounded-3xl border border-dashed border-gray-800">
              <Filter className="mx-auto text-gray-700 mb-4" size={48} />
              <h3 className="text-xl font-bold text-white">No matches found</h3>
              <p className="text-gray-500 mt-2">Try adjusting your filters or search terms.</p>
              <button 
                onClick={() => { setSearch(''); setFilterFaction('All'); setFilterRole('All'); setFilterRarity('All'); }}
                className="mt-6 text-blue-500 font-bold hover:text-blue-400"
              >
                  Clear all filters
              </button>
          </div>
      )}
    </div>
  );
};

export default Heroes;
