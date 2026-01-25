import React, { useState } from 'react';
import { useUserData, calculateHeroPower } from '../../../shared/utils';
import HeroCard from '../components/HeroCard';
import { X, Star, Save } from 'lucide-react';
import LoadingSpinner from '../../../shared/ui/LoadingSpinner';

const Roster: React.FC = () => {
  const { data, updateHero, removeFromRoster, isLoaded } = useUserData();
  const [editingHeroId, setEditingHeroId] = useState<string | null>(null);

  // Edit State
  const [editLevel, setEditLevel] = useState(1);
  const [editStars, setEditStars] = useState(0);

  if (!isLoaded) return <LoadingSpinner />;

  const startEdit = (hero: any) => {
      setEditingHeroId(hero.id);
      setEditLevel(hero.level);
      setEditStars(hero.stars);
  };

  const saveEdit = (hero: any) => {
      updateHero({ ...hero, level: editLevel, stars: editStars });
      setEditingHeroId(null);
  };

  const handleRemove = (heroId: string, heroName: string) => {
      if (window.confirm(`Are you sure you want to remove ${heroName} from your roster?`)) {
          removeFromRoster(heroId);
      }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-display font-bold text-white">My Roster</h1>
        <div className="text-gray-400 text-sm">
            {data.roster.length} Heroes Owned
        </div>
      </div>

      {data.roster.length === 0 ? (
          <div className="text-center py-20 bg-bg-secondary rounded-xl border border-dashed border-gray-700">
              <h3 className="text-xl text-gray-300 font-bold mb-2">Your roster is empty</h3>
              <p className="text-gray-500 mb-6">Head to the Database to add heroes you own.</p>
              <a href="#/heroes" className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors">
                  Go to Database
              </a>
          </div>
      ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {data.roster.map(hero => (
                <div key={hero.id} className="relative group">
                    <HeroCard 
                        hero={hero} 
                        isOwned={true}
                        onAction={() => handleRemove(hero.id, hero.name)}
                    />
                    
                    {/* Edit Overlay Trigger */}
                    <div 
                        className="absolute top-2 right-16 p-2 z-10 cursor-pointer bg-gray-800/80 rounded hover:bg-gray-700"
                        onClick={(e) => {
                             e.preventDefault();
                             startEdit(hero);
                        }}
                    >
                        <span className="text-xs font-bold text-white">Edit</span>
                    </div>
                    
                     {/* Edit Modal (Inline for simplicity in this structure) */}
                     {editingHeroId === hero.id && (
                         <div className="absolute inset-0 bg-bg-secondary z-20 rounded-xl p-4 border border-blue-500 flex flex-col justify-between shadow-xl">
                             <div>
                                 <h4 className="text-white font-bold mb-4 border-b border-gray-700 pb-2">Edit {hero.name}</h4>
                                 
                                 <div className="mb-3">
                                     <label className="text-xs text-gray-500 block mb-1">Level</label>
                                     <input 
                                        type="number" 
                                        className="w-full bg-bg-primary border border-gray-700 rounded px-2 py-1 text-white"
                                        value={editLevel}
                                        onChange={(e) => setEditLevel(parseInt(e.target.value) || 0)}
                                     />
                                 </div>

                                 <div className="mb-3">
                                     <label className="text-xs text-gray-500 block mb-1">Stars</label>
                                     <div className="flex items-center space-x-2">
                                         <input 
                                            type="range" 
                                            min="0" max="10" 
                                            className="flex-1 accent-yellow-500"
                                            value={editStars}
                                            onChange={(e) => setEditStars(parseInt(e.target.value))}
                                         />
                                         <span className="text-yellow-500 font-mono font-bold w-6 text-right">{editStars}</span>
                                     </div>
                                 </div>
                             </div>

                             <div className="flex space-x-2 mt-2">
                                 <button 
                                    onClick={(e) => { e.stopPropagation(); saveEdit(hero); }}
                                    className="flex-1 bg-green-700 hover:bg-green-600 text-white py-1 rounded text-sm flex items-center justify-center"
                                 >
                                     <Save size={14} className="mr-1"/> Save
                                 </button>
                                 <button 
                                    onClick={(e) => { e.stopPropagation(); setEditingHeroId(null); }}
                                    className="px-2 bg-gray-700 hover:bg-gray-600 text-white rounded"
                                 >
                                     <X size={14} />
                                 </button>
                             </div>
                         </div>
                     )}
                </div>
            ))}
          </div>
      )}
    </div>
  );
};

export default Roster;