import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter } from 'lucide-react';
import heroesData from '../../../data/heroes.json';
import '../../../styles/main.css';

interface Hero {
  id: string;
  name: string;
  faction: string;
  rarity: string;
  role: string;
  image: string;
}

const HeroGrid: React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');

  const filteredHeroes = useMemo(() => {
    return heroesData.filter((hero: Hero) => {
      const matchesSearch = hero.name.toLowerCase().includes(search.toLowerCase());
      const matchesFilter = filter === 'All' || hero.faction === filter || hero.role === filter;
      return matchesSearch && matchesFilter;
    });
  }, [search, filter]);

  const factions = ['All', 'League', 'Horde', 'Nature'];

  return (
    <div className="animate-fade-in">
      {/* Search & Filter Bar */}
      <div style={{ marginBottom: 24, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <div style={{ 
          position: 'relative', flex: 1, minWidth: '200px'
        }}>
          <Search size={18} style={{ position: 'absolute', left: 12, top: 10, color: 'var(--ios-text-secondary)' }} />
          <input 
            type="text" 
            placeholder="Search Heroes" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%', padding: '10px 10px 10px 40px',
              borderRadius: 12, border: 'none',
              background: 'rgba(118, 118, 128, 0.12)',
              color: 'var(--ios-text-primary)', fontSize: '16px'
            }}
          />
        </div>

        {/* Segmented Control / Tags */}
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }}>
          {factions.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: '8px 16px', borderRadius: 20, border: 'none',
                background: filter === f ? 'var(--ios-blue)' : 'rgba(118, 118, 128, 0.12)',
                color: filter === f ? 'white' : 'var(--ios-text-primary)',
                fontWeight: 600, fontSize: '13px', whiteSpace: 'nowrap',
                cursor: 'pointer'
              }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Hero Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', 
        gap: 16 
      }}>
        {filteredHeroes.map((hero: Hero) => (
          <div 
            key={hero.id}
            onClick={() => navigate(`/heroes/${hero.id}`)}
            style={{ 
              display: 'flex', flexDirection: 'column', alignItems: 'center', 
              gap: 8, cursor: 'pointer', transition: 'transform 0.1s'
            }}
            onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.95)'}
            onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <div style={{ 
              width: '100%', aspectRatio: '1/1', borderRadius: 18, 
              overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              background: 'white', position: 'relative'
            }}>
              <img
                src={hero.image || hero.imageUrl || '/img/heroes/placeholder.png'}
                alt={hero.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={(e) => { e.currentTarget.src = '/img/heroes/placeholder.png'; }}
              />
               {/* Rarity & Faction Badge (Mini) */}
               <div style={{
                 position: 'absolute', bottom: 4, right: 4, width: 20, height: 20,
                 borderRadius: '50%', background: 'rgba(0,0,0,0.5)',
                 display: 'flex', alignItems: 'center', justifyContent: 'center'
               }}>
                  <span style={{ fontSize: 10 }}>{hero.faction[0]}</span>
               </div>
            </div>
            <span style={{ 
              fontSize: '12px', fontWeight: 500, textAlign: 'center',
              lineHeight: 1.2, color: 'var(--ios-text-primary)'
            }}>
              {hero.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HeroGrid;
