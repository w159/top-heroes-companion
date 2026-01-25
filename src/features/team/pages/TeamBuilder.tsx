
import React, { useState } from 'react';
import { useUserData, calculateHeroPower, calculateQueueInfluence, isHeroUsedElsewhere, isPetUsedElsewhere, isRelicUsedElsewhere } from '../../../shared/utils';
import { UserHero, Queue, RelicType } from '../../../shared/types';
import { PETS, RELICS, SKINS } from '../../../shared/types/constants';
import HeroCard from '../../heroes/components/HeroCard';
import { Plus, X, Zap, Swords, Dog, Gem, Castle, Flag, Info, Star, Shield, Crosshair, HelpingHand } from 'lucide-react';

const TeamBuilder: React.FC = () => {
  const { data, updateQueue } = useUserData();
  const [activeQueueId, setActiveQueueId] = useState<number>(1);
  
  // Selectors State
  const [selectorType, setSelectorType] = useState<'hero' | 'pet' | 'relic' | 'castle' | 'march' | null>(null);
  const [relicSlotType, setRelicSlotType] = useState<RelicType | null>(null); // To know which slot we are filling
  const [selectorSlotIndex, setSelectorSlotIndex] = useState<number | null>(null); // For heroes

  const activeQueue = data.queues.find(q => q.id === activeQueueId) || data.queues[0];
  const queueInfluence = calculateQueueInfluence(activeQueue, data.roster);

  // Ensure relics object exists (migration safety)
  if (!activeQueue.relics) {
      activeQueue.relics = { Attack: null, Defense: null, Assist: null };
  }

  // Helper to generate Wiki Image URL
  const getWikiImageUrl = (name: string) => `https://topheroes1.fandom.com/wiki/Special:FilePath/${name.replace(/\s+/g, '_')}.png`;
  const getPlaceholderImage = (name: string) => `https://ui-avatars.com/api/?name=${name.replace(' ', '+')}&background=random&size=128&color=fff`;

  const handleHeroSelect = (hero: UserHero) => {
      if (selectorSlotIndex === null) return;
      if (isHeroUsedElsewhere(hero.id, activeQueue.id, data.queues)) {
          alert(`This hero is already in another queue!`);
          return;
      }

      const newHeroIds = [...activeQueue.heroIds];
      const existingIdx = newHeroIds.indexOf(hero.id);
      if (existingIdx !== -1) newHeroIds[existingIdx] = null;
      
      newHeroIds[selectorSlotIndex] = hero.id;
      updateQueue({ ...activeQueue, heroIds: newHeroIds });
      setSelectorType(null);
  };

  const handlePetSelect = (petId: string) => {
      if (isPetUsedElsewhere(petId, activeQueue.id, data.queues)) {
           alert(`This pet is already in another queue!`);
           return;
      }
      updateQueue({ ...activeQueue, petId, petLevel: activeQueue.petLevel || 1, petStars: activeQueue.petStars || 1 });
      setSelectorType(null);
  };

  const handleRelicSelect = (relicId: string) => {
      if (!relicSlotType) return;
      if (isRelicUsedElsewhere(relicId, activeQueue.id, data.queues)) {
           alert(`This relic is already in use by another queue!`);
           return;
      }
      
      const newRelics = { ...activeQueue.relics };
      newRelics[relicSlotType] = {
          id: relicId,
          level: (activeQueue.relics[relicSlotType]?.level || 1)
      };

      updateQueue({ ...activeQueue, relics: newRelics });
      setSelectorType(null);
      setRelicSlotType(null);
  };
  
  const handleSkinSelect = (skinId: string, type: 'Castle' | 'March') => {
      if (type === 'Castle') updateQueue({ ...activeQueue, castleSkinId: skinId });
      else updateQueue({ ...activeQueue, marchSkinId: skinId });
      setSelectorType(null);
  };

  // Generic Image Component for non-heroes
  const ItemImage = ({ name, className }: { name: string, className: string }) => (
      <img 
          src={getWikiImageUrl(name)} 
          alt={name}
          className={`${className} object-cover`}
          onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = getPlaceholderImage(name);
          }}
      />
  );

  return (
    <div className="space-y-6 relative pb-20">
       <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
                <h1 className="text-3xl font-display font-bold text-white">Queue Manager</h1>
                <p className="text-gray-400">Manage your 5 marches. Configure heroes, pets, and relics for maximum influence.</p>
            </div>
            
            <div className="mt-4 md:mt-0 bg-gray-800 rounded-lg px-4 py-2 flex items-center border border-yellow-500/30">
                <Zap className="text-yellow-400 mr-2" size={20} />
                <div className="flex flex-col text-right">
                    <span className="text-xs text-gray-500 uppercase">Queue Influence</span>
                    <span className="text-xl font-mono font-bold text-white">{queueInfluence.toLocaleString()}</span>
                </div>
            </div>
       </div>

       {/* Queue Tabs */}
       <div className="flex space-x-2 overflow-x-auto pb-2 border-b border-gray-700">
           {data.queues.map(q => (
               <button
                   key={q.id}
                   onClick={() => setActiveQueueId(q.id)}
                   className={`px-6 py-3 rounded-t-lg font-bold whitespace-nowrap transition-colors ${
                       activeQueueId === q.id 
                       ? 'bg-blue-600 text-white border-b-2 border-blue-400' 
                       : 'bg-bg-secondary text-gray-400 hover:bg-gray-800'
                   }`}
               >
                   Queue {q.id}
               </button>
           ))}
       </div>

       {/* Main Content Area */}
       <div className="space-y-8 animate-in fade-in duration-300">
           
           {/* 1. Heroes Section */}
           <div>
               <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                   <Swords className="mr-2 text-red-400" size={20} /> Heroes
               </h3>
               <div className="grid grid-cols-5 gap-2 md:gap-4">
                   {activeQueue.heroIds.map((heroId, index) => {
                       const hero = heroId ? data.roster.find(h => h.id === heroId) : null;
                       return (
                           <div key={index} className="flex flex-col items-center">
                               <div className="text-xs text-gray-500 mb-2 uppercase">Slot {index + 1}</div>
                               {hero ? (
                                   <div className="w-full relative group">
                                       <div className="transform scale-90 md:scale-100 origin-top">
                                           <HeroCard hero={hero} disableLink={true} />
                                       </div>
                                       <button 
                                            onClick={() => {
                                                const newIds = [...activeQueue.heroIds];
                                                newIds[index] = null;
                                                updateQueue({ ...activeQueue, heroIds: newIds });
                                            }}
                                            className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 shadow-lg hover:bg-red-500 z-10"
                                       >
                                           <X size={14} />
                                       </button>
                                   </div>
                               ) : (
                                   <button 
                                        onClick={() => { setSelectorType('hero'); setSelectorSlotIndex(index); }}
                                        className="w-full aspect-[3/4] rounded-xl border-2 border-dashed border-gray-700 hover:border-blue-500 hover:bg-bg-secondary transition-all flex flex-col items-center justify-center text-gray-600 hover:text-blue-400"
                                   >
                                       <Plus size={32} />
                                       <span className="mt-2 text-sm font-semibold">Select</span>
                                   </button>
                               )}
                           </div>
                       );
                   })}
               </div>
           </div>

           {/* 2. Soldiers Configuration */}
           <div className="bg-bg-secondary border border-border p-4 rounded-xl">
               <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                   <Flag className="mr-2 text-blue-400" size={20} /> Soldiers
               </h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div>
                       <label className="text-sm text-gray-400 mb-2 block">Soldier Type</label>
                       <div className="flex space-x-2">
                           {['Infantry', 'Archer', 'Mage'].map((type) => (
                               <button
                                   key={type}
                                   onClick={() => updateQueue({ ...activeQueue, soldierType: type as any })}
                                   className={`flex-1 py-2 rounded border transition-colors ${
                                       activeQueue.soldierType === type 
                                       ? 'bg-blue-600 border-blue-500 text-white' 
                                       : 'bg-bg-tertiary border-gray-700 text-gray-400 hover:bg-gray-700'
                                   }`}
                               >
                                   {type}
                               </button>
                           ))}
                       </div>
                   </div>
                   <div>
                       <label className="text-sm text-gray-400 mb-2 block">Soldier Tier (Level)</label>
                       <div className="flex items-center space-x-4">
                           <input 
                               type="range" 
                               min="1" max="12" 
                               value={activeQueue.soldierTier}
                               onChange={(e) => updateQueue({ ...activeQueue, soldierTier: parseInt(e.target.value) })}
                               className="flex-1 accent-blue-500"
                           />
                           <div className="text-2xl font-bold font-mono text-white">T{activeQueue.soldierTier}</div>
                       </div>
                   </div>
               </div>
           </div>

           {/* 3. Relics Section (3 Slots) */}
           <div>
               <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                   <Gem className="mr-2 text-purple-400" size={20} /> Relics
               </h3>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                   {(['Attack', 'Defense', 'Assist'] as RelicType[]).map(type => {
                       const relicEntry = activeQueue.relics[type];
                       const relic = relicEntry ? RELICS.find(r => r.id === relicEntry.id) : null;
                       
                       let Icon = Gem;
                       if (type === 'Attack') Icon = Crosshair;
                       if (type === 'Defense') Icon = Shield;
                       if (type === 'Assist') Icon = HelpingHand;

                       return (
                           <div key={type} className="bg-bg-secondary border border-border p-4 rounded-xl flex flex-col relative">
                               <div className="flex items-center justify-between mb-2">
                                   <div className="flex items-center text-sm font-bold text-gray-400 uppercase">
                                       <Icon size={14} className="mr-1" /> {type}
                                   </div>
                                   {relic && (
                                       <button 
                                           onClick={() => {
                                               const newRelics = { ...activeQueue.relics };
                                               newRelics[type] = null;
                                               updateQueue({ ...activeQueue, relics: newRelics });
                                           }}
                                           className="text-gray-500 hover:text-red-400"
                                       >
                                           <X size={14} />
                                       </button>
                                   )}
                               </div>

                               {relic ? (
                                   <div className="flex-1">
                                       <div className="flex items-center mb-2">
                                           <div className="w-12 h-12 rounded bg-purple-900/10 border border-purple-500/30 p-1 mr-3 flex-shrink-0">
                                                <ItemImage name={relic.name} className="w-full h-full rounded" />
                                           </div>
                                           <div>
                                               <h4 className="font-bold text-white text-sm line-clamp-1">{relic.name}</h4>
                                               <div className="text-xs text-purple-400">{relic.rarity}</div>
                                           </div>
                                       </div>
                                       <div className="text-xs text-gray-400 mb-2 line-clamp-2 h-8">{relic.statBonus}</div>
                                       <div className="flex items-center space-x-2 mt-auto">
                                           <span className="text-xs text-gray-500">Lv:</span>
                                           <input 
                                                type="number" 
                                                min="1" max="100" 
                                                value={relicEntry!.level}
                                                onChange={(e) => {
                                                    const newRelics = { ...activeQueue.relics };
                                                    if (newRelics[type]) {
                                                        newRelics[type]!.level = parseInt(e.target.value) || 1;
                                                        updateQueue({ ...activeQueue, relics: newRelics });
                                                    }
                                                }}
                                                className="w-12 bg-bg-primary border border-gray-700 rounded px-1 py-0.5 text-white text-xs"
                                           />
                                       </div>
                                   </div>
                               ) : (
                                   <button 
                                       onClick={() => { setSelectorType('relic'); setRelicSlotType(type); }}
                                       className="flex-1 border-2 border-dashed border-gray-700 rounded-lg hover:border-purple-500 hover:text-purple-400 text-gray-500 flex flex-col items-center justify-center min-h-[100px] transition-all"
                                   >
                                       <Plus size={24} className="mb-1" />
                                       <span className="text-sm">Select {type}</span>
                                   </button>
                               )}
                           </div>
                       );
                   })}
               </div>
           </div>

           {/* 4. Pet Slot & Skins */}
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
               
               {/* Pet Slot */}
               <div className="bg-bg-secondary border border-border p-6 rounded-xl flex flex-col">
                   <div className="flex items-center justify-between mb-4">
                       <h4 className="font-bold text-white flex items-center text-lg"><Dog size={20} className="mr-2 text-green-400" /> Pet Companion</h4>
                       {activeQueue.petId && (
                           <button onClick={() => updateQueue({ ...activeQueue, petId: null })} className="text-red-400 hover:text-red-300 text-sm flex items-center"><X size={14} className="mr-1"/> Remove</button>
                       )}
                   </div>
                   {activeQueue.petId ? (
                       <div className="flex items-start space-x-4">
                           <div className="w-24 h-24 rounded-lg bg-green-900/10 border border-green-500/30 p-1 flex-shrink-0">
                                <ItemImage name={PETS.find(p => p.id === activeQueue.petId)?.name || ''} className="w-full h-full rounded" />
                           </div>
                           <div className="flex-1">
                                <div className="flex justify-between">
                                    <h3 className="font-bold text-green-100">{PETS.find(p => p.id === activeQueue.petId)?.name}</h3>
                                    <span className="text-xs bg-green-900/40 text-green-400 px-2 py-0.5 rounded border border-green-800">{PETS.find(p => p.id === activeQueue.petId)?.rarity}</span>
                                </div>
                                <p className="text-xs text-gray-400 mt-1">{PETS.find(p => p.id === activeQueue.petId)?.description}</p>
                                <div className="mt-2 bg-bg-tertiary p-2 rounded border border-gray-700">
                                    <span className="text-xs text-blue-300 font-bold block">{PETS.find(p => p.id === activeQueue.petId)?.skillName}</span>
                                    <span className="text-xs text-gray-500">{PETS.find(p => p.id === activeQueue.petId)?.skillDescription}</span>
                                </div>
                                <div className="mt-3 flex items-center space-x-6">
                                    <div className="flex flex-col">
                                        <span className="text-xs text-gray-400 mb-1">Level (Max 90)</span>
                                        <input 
                                            type="number" 
                                            min="1" max="90" 
                                            value={activeQueue.petLevel || 1}
                                            onChange={(e) => updateQueue({ ...activeQueue, petLevel: Math.min(90, Math.max(1, parseInt(e.target.value) || 1)) })}
                                            className="w-20 bg-bg-primary border border-gray-700 rounded px-2 py-1 text-white text-sm"
                                        />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-xs text-gray-400 mb-1">Stars</span>
                                        <div className="flex items-center space-x-2">
                                            <input 
                                                type="number" 
                                                min="1" max="10" 
                                                value={activeQueue.petStars || 1}
                                                onChange={(e) => updateQueue({ ...activeQueue, petStars: Math.min(10, Math.max(1, parseInt(e.target.value) || 1)) })}
                                                className="w-16 bg-bg-primary border border-gray-700 rounded px-2 py-1 text-white text-sm"
                                            />
                                            <Star size={16} className="text-yellow-500" fill="currentColor" />
                                        </div>
                                    </div>
                                </div>
                           </div>
                       </div>
                   ) : (
                       <button onClick={() => setSelectorType('pet')} className="flex-1 border-2 border-dashed border-gray-700 rounded-lg hover:border-green-500 hover:text-green-400 text-gray-500 flex flex-col items-center justify-center min-h-[140px] transition-all">
                           <Dog size={32} className="mb-2" /> 
                           <span>Assign Pet</span>
                       </button>
                   )}
               </div>

                {/* Skins (Compact) */}
                <div className="flex flex-col space-y-4">
                    {/* Castle Skin */}
                   <div className="bg-bg-secondary border border-border p-4 rounded-xl flex items-center justify-between flex-1">
                       <div className="flex items-center">
                           <div className="p-3 bg-yellow-900/20 rounded-lg mr-4 text-yellow-500"><Castle size={20}/></div>
                           <div>
                               <div className="text-xs text-gray-500">Castle Skin</div>
                               <div className="font-bold text-white">{activeQueue.castleSkinId ? SKINS.find(s => s.id === activeQueue.castleSkinId)?.name : 'Default'}</div>
                           </div>
                       </div>
                       <button onClick={() => setSelectorType('castle')} className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-xs text-white">Change</button>
                   </div>

                   {/* March Skin */}
                   <div className="bg-bg-secondary border border-border p-4 rounded-xl flex items-center justify-between flex-1">
                       <div className="flex items-center">
                           <div className="p-3 bg-orange-900/20 rounded-lg mr-4 text-orange-500"><Flag size={20}/></div>
                           <div>
                               <div className="text-xs text-gray-500">March Skin</div>
                               <div className="font-bold text-white">{activeQueue.marchSkinId ? SKINS.find(s => s.id === activeQueue.marchSkinId)?.name : 'Default'}</div>
                           </div>
                       </div>
                       <button onClick={() => setSelectorType('march')} className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-xs text-white">Change</button>
                   </div>
                </div>

           </div>
       </div>

       {/* Selection Modal */}
       {selectorType && (
           <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
               <div className="bg-bg-secondary w-full max-w-4xl h-[85vh] rounded-2xl flex flex-col border border-border">
                   <div className="p-4 border-b border-border flex justify-between items-center">
                       <h3 className="text-xl font-bold text-white capitalize">Select {selectorType} {relicSlotType ? `(${relicSlotType})` : ''}</h3>
                       <button onClick={() => { setSelectorType(null); setRelicSlotType(null); }} className="text-gray-400 hover:text-white">
                           <X size={24} />
                       </button>
                   </div>
                   <div className="flex-1 overflow-y-auto p-4">
                       
                       {/* Hero Selection */}
                       {selectorType === 'hero' && (
                           <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                               {data.roster.length === 0 ? (
                                   <div className="col-span-full text-center py-10 text-gray-500">
                                       No heroes in roster. Go to Database to add some!
                                   </div>
                               ) : (
                                   data.roster.map(hero => {
                                       const isUsed = isHeroUsedElsewhere(hero.id, activeQueueId, data.queues);
                                       const isCurrent = activeQueue.heroIds.includes(hero.id);
                                       
                                       return (
                                           <div 
                                                key={hero.id} 
                                                className={`relative ${isUsed ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${isCurrent ? 'ring-2 ring-green-500 rounded-xl' : ''}`}
                                                onClick={() => !isUsed && handleHeroSelect(hero)}
                                           >
                                               <HeroCard hero={hero} disableLink={true} />
                                               {isUsed && (
                                                   <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-xl">
                                                       <span className="text-xs font-bold text-red-400 bg-black/80 px-2 py-1 rounded">Used Elsewhere</span>
                                                   </div>
                                               )}
                                           </div>
                                       );
                                   })
                               )}
                           </div>
                       )}

                       {/* Pet Selection */}
                       {selectorType === 'pet' && (
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                               {PETS.map(pet => {
                                   const isUsed = isPetUsedElsewhere(pet.id, activeQueueId, data.queues);
                                   return (
                                       <div 
                                            key={pet.id} 
                                            onClick={() => !isUsed && handlePetSelect(pet.id)}
                                            className={`p-4 rounded-lg border flex items-start space-x-4 transition-colors ${
                                                isUsed ? 'bg-gray-900 border-gray-800 opacity-50 cursor-not-allowed' : 'bg-bg-tertiary border-gray-700 hover:border-green-500 cursor-pointer'
                                            }`}
                                       >
                                           <div className="w-16 h-16 rounded bg-black/20 flex-shrink-0">
                                                <ItemImage name={pet.name} className="w-full h-full rounded" />
                                           </div>
                                           <div className="flex-1">
                                               <div className="flex justify-between">
                                                    <h4 className="font-bold text-white">{pet.name}</h4>
                                                    <span className="text-xs text-green-400 border border-green-900 px-1 rounded">{pet.rarity}</span>
                                               </div>
                                               <p className="text-xs text-gray-500 mt-1 line-clamp-2">{pet.description}</p>
                                               <div className="mt-2 text-xs text-blue-300">
                                                   <span className="font-bold">Skill:</span> {pet.skillName}
                                               </div>
                                           </div>
                                            {isUsed && <span className="text-xs text-red-500 font-bold whitespace-nowrap">In Use</span>}
                                       </div>
                                   );
                               })}
                           </div>
                       )}

                       {/* Relic Selection */}
                       {selectorType === 'relic' && relicSlotType && (
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                               {RELICS.filter(r => r.type === relicSlotType).map(relic => {
                                   const isUsed = isRelicUsedElsewhere(relic.id, activeQueueId, data.queues);
                                   return (
                                       <div 
                                            key={relic.id} 
                                            onClick={() => !isUsed && handleRelicSelect(relic.id)}
                                            className={`p-4 rounded-lg border flex items-start space-x-4 transition-colors ${
                                                isUsed 
                                                ? 'bg-gray-900 border-gray-800 opacity-50 cursor-not-allowed' 
                                                : 'bg-bg-tertiary border-gray-700 hover:border-purple-500 cursor-pointer'
                                            }`}
                                       >
                                           <div className="w-16 h-16 rounded bg-black/20 flex-shrink-0">
                                                <ItemImage name={relic.name} className="w-full h-full rounded" />
                                           </div>
                                           <div className="flex-1">
                                               <div className="flex justify-between">
                                                    <h4 className="font-bold text-white">{relic.name}</h4>
                                                    <span className="text-xs text-purple-400 font-bold">{relic.rarity}</span>
                                               </div>
                                               <p className="text-xs text-gray-400 mt-1">{relic.description}</p>
                                               <div className="mt-2 text-xs text-green-400 bg-green-900/10 inline-block px-1 rounded">
                                                   {relic.statBonus}
                                               </div>
                                           </div>
                                           {isUsed && <span className="text-xs text-red-500 font-bold whitespace-nowrap">In Use</span>}
                                       </div>
                                   );
                               })}
                               {RELICS.filter(r => r.type === relicSlotType).length === 0 && (
                                   <div className="col-span-full text-center text-gray-500 py-10">
                                       No relics found for {relicSlotType} slot.
                                   </div>
                               )}
                           </div>
                       )}

                       {/* Skin Selection */}
                       {(selectorType === 'castle' || selectorType === 'march') && (
                           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                               {SKINS.filter(s => s.type === (selectorType === 'castle' ? 'Castle' : 'March')).map(skin => (
                                   <div 
                                        key={skin.id} 
                                        onClick={() => handleSkinSelect(skin.id, skin.type)}
                                        className="p-4 rounded-lg border border-gray-700 bg-bg-tertiary hover:border-yellow-500 cursor-pointer"
                                   >
                                       <h4 className="font-bold text-white">{skin.name}</h4>
                                       <span className="text-xs text-blue-400">{skin.type} Skin</span>
                                       <p className="text-xs text-green-400 mt-1">{skin.bonus}</p>
                                   </div>
                               ))}
                           </div>
                       )}

                   </div>
               </div>
           </div>
       )}
    </div>
  );
};

export default TeamBuilder;
