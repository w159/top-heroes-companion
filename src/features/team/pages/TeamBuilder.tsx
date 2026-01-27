import React, { useState } from 'react';
import { useUserData, calculateHeroPower, calculateQueueInfluence, isHeroUsedElsewhere, isPetUsedElsewhere, isRelicUsedElsewhere } from '../../../shared/utils';
import { UserHero, Queue, RelicType } from '../../../shared/types';
import { PETS, RELICS, SKINS } from '../../../shared/types/constants';
import HeroCard from '../../heroes/components/HeroCard';
import { Plus, X, Zap, Swords, Heart, Gem, Castle, Flag, Star, Shield, Crosshair, HelpingHand, Users } from 'lucide-react';
import { Card, CardContent, CardHeader } from '../../../shared/ui/components/card';
import { Button } from '../../../shared/ui/components/button';
import { Badge } from '../../../shared/ui/components/badge';
import { cn } from '../../../shared/lib/utils';

const TeamBuilder: React.FC = () => {
  const { data, updateQueue } = useUserData();
  const [activeQueueId, setActiveQueueId] = useState<number>(1);

  // Selectors State
  const [selectorType, setSelectorType] = useState<'hero' | 'pet' | 'relic' | 'castle' | 'march' | null>(null);
  const [relicSlotType, setRelicSlotType] = useState<RelicType | null>(null);
  const [selectorSlotIndex, setSelectorSlotIndex] = useState<number | null>(null);

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
    <div className="space-y-6 animate-in pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-tertiary-500 flex items-center justify-center shadow-lg shadow-primary-500/30">
            <Users className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-headline-lg font-bold">Queue Manager</h1>
            <p className="text-body-md text-muted-foreground">Configure heroes, pets, and relics for maximum influence</p>
          </div>
        </div>

        <Card variant="filled" className="border-gold-500/30">
          <CardContent className="p-4 flex items-center gap-3">
            <Zap className="w-6 h-6 text-gold-400" />
            <div className="text-right">
              <span className="text-label-sm text-muted-foreground block">Queue Influence</span>
              <span className="text-headline-sm font-bold">{queueInfluence.toLocaleString()}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Queue Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 border-b border-border">
        {data.queues.map(q => (
          <button
            key={q.id}
            onClick={() => setActiveQueueId(q.id)}
            className={cn(
              'px-6 py-3 rounded-t-xl font-semibold whitespace-nowrap transition-all',
              'border-b-2 -mb-[1px]',
              activeQueueId === q.id
                ? 'bg-primary-500/10 border-primary-500 text-primary-400'
                : 'bg-surface-800/50 border-transparent text-muted-foreground hover:text-foreground hover:bg-surface-800'
            )}
          >
            Queue {q.id}
          </button>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="space-y-6 animate-in">

        {/* 1. Heroes Section */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <Swords className="w-5 h-5 text-error-400" />
            <h3 className="text-title-lg font-semibold">Heroes</h3>
          </div>
          <div className="grid grid-cols-5 gap-2 md:gap-4">
            {activeQueue.heroIds.map((heroId, index) => {
              const hero = heroId ? data.roster.find(h => h.id === heroId) : null;
              return (
                <div key={index} className="flex flex-col items-center">
                  <div className="text-label-sm text-muted-foreground mb-2 uppercase">Slot {index + 1}</div>
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
                        className="absolute -top-2 -right-2 bg-error-500 text-white rounded-full p-1 shadow-lg hover:bg-error-400 z-10 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => { setSelectorType('hero'); setSelectorSlotIndex(index); }}
                      className={cn(
                        'w-full aspect-[3/4] rounded-xl transition-all',
                        'border-2 border-dashed border-border hover:border-primary-500',
                        'flex flex-col items-center justify-center',
                        'text-muted-foreground hover:text-primary-400 hover:bg-primary-500/5'
                      )}
                    >
                      <Plus className="w-8 h-8" />
                      <span className="mt-2 text-label-sm font-semibold">Select</span>
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* 2. Soldiers Configuration */}
        <Card variant="filled">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-3">
              <Flag className="w-5 h-5 text-primary-400" />
              <h3 className="text-title-lg font-semibold">Soldiers</h3>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-label-sm text-muted-foreground mb-2 block">Soldier Type</label>
                <div className="flex gap-2">
                  {['Infantry', 'Archer', 'Mage'].map((type) => (
                    <button
                      key={type}
                      onClick={() => updateQueue({ ...activeQueue, soldierType: type as any })}
                      className={cn(
                        'flex-1 py-2.5 rounded-lg border transition-all text-label-lg font-medium',
                        activeQueue.soldierType === type
                          ? 'bg-primary-500 border-primary-500 text-white'
                          : 'bg-surface-800 border-border text-muted-foreground hover:border-primary-500/50 hover:text-foreground'
                      )}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-label-sm text-muted-foreground mb-2 block">Soldier Tier (Level)</label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="1" max="12"
                    value={activeQueue.soldierTier}
                    onChange={(e) => updateQueue({ ...activeQueue, soldierTier: parseInt(e.target.value) })}
                    className="flex-1 accent-primary-500"
                  />
                  <div className="text-headline-sm font-bold w-12 text-center">T{activeQueue.soldierTier}</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 3. Relics Section */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <Gem className="w-5 h-5 text-tertiary-400" />
            <h3 className="text-title-lg font-semibold">Relics</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(['Attack', 'Defense', 'Assist'] as RelicType[]).map(type => {
              const relicEntry = activeQueue.relics[type];
              const relic = relicEntry ? RELICS.find(r => r.id === relicEntry.id) : null;

              let Icon = Gem;
              let iconColor = 'text-tertiary-400';
              if (type === 'Attack') { Icon = Crosshair; iconColor = 'text-error-400'; }
              if (type === 'Defense') { Icon = Shield; iconColor = 'text-primary-400'; }
              if (type === 'Assist') { Icon = HelpingHand; iconColor = 'text-success-400'; }

              return (
                <Card key={type} variant="filled" className="flex flex-col">
                  <CardContent className="p-4 flex flex-col flex-1">
                    <div className="flex items-center justify-between mb-3">
                      <div className={cn('flex items-center gap-2 text-label-md font-semibold uppercase', iconColor)}>
                        <Icon className="w-4 h-4" /> {type}
                      </div>
                      {relic && (
                        <button
                          onClick={() => {
                            const newRelics = { ...activeQueue.relics };
                            newRelics[type] = null;
                            updateQueue({ ...activeQueue, relics: newRelics });
                          }}
                          className="text-muted-foreground hover:text-error-400 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    {relic ? (
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-12 h-12 rounded-lg bg-tertiary-500/10 border border-tertiary-500/30 p-1 flex-shrink-0">
                            <ItemImage name={relic.name} className="w-full h-full rounded" />
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-title-sm font-semibold truncate">{relic.name}</h4>
                            <Badge variant="default" size="sm" className="bg-tertiary-500/20 text-tertiary-400 border-tertiary-500/30">
                              {relic.rarity}
                            </Badge>
                          </div>
                        </div>
                        <p className="text-body-sm text-muted-foreground line-clamp-2 h-10 mb-3">{relic.statBonus}</p>
                        <div className="flex items-center gap-2 mt-auto">
                          <span className="text-label-sm text-muted-foreground">Lv:</span>
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
                            className="w-14 h-8 px-2 bg-surface-800 border border-border rounded-lg text-label-md text-center focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => { setSelectorType('relic'); setRelicSlotType(type); }}
                        className={cn(
                          'flex-1 border-2 border-dashed border-border rounded-xl',
                          'hover:border-tertiary-500 hover:text-tertiary-400 hover:bg-tertiary-500/5',
                          'flex flex-col items-center justify-center min-h-[100px] transition-all',
                          'text-muted-foreground'
                        )}
                      >
                        <Plus className="w-6 h-6 mb-1" />
                        <span className="text-label-sm">Select {type}</span>
                      </button>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* 4. Pet Slot & Skins */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

          {/* Pet Slot */}
          <Card variant="filled" className="flex flex-col">
            <CardContent className="p-5 flex flex-col flex-1">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Heart className="w-5 h-5 text-success-400" />
                  <h4 className="text-title-lg font-semibold">Pet Companion</h4>
                </div>
                {activeQueue.petId && (
                  <button
                    onClick={() => updateQueue({ ...activeQueue, petId: null })}
                    className="text-error-400 hover:text-error-300 text-label-sm flex items-center gap-1 transition-colors"
                  >
                    <X className="w-4 h-4" /> Remove
                  </button>
                )}
              </div>
              {activeQueue.petId ? (
                <div className="flex items-start gap-4">
                  <div className="w-20 h-20 rounded-xl bg-success-500/10 border border-success-500/30 p-1 flex-shrink-0">
                    <ItemImage name={PETS.find(p => p.id === activeQueue.petId)?.name || ''} className="w-full h-full rounded-lg" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-2 mb-1">
                      <h3 className="text-title-md font-semibold truncate">{PETS.find(p => p.id === activeQueue.petId)?.name}</h3>
                      <Badge variant="success" size="sm">{PETS.find(p => p.id === activeQueue.petId)?.rarity}</Badge>
                    </div>
                    <p className="text-body-sm text-muted-foreground line-clamp-2">{PETS.find(p => p.id === activeQueue.petId)?.description}</p>
                    <div className="mt-2 bg-surface-800/50 p-2 rounded-lg">
                      <span className="text-label-sm text-primary-400 font-semibold block">{PETS.find(p => p.id === activeQueue.petId)?.skillName}</span>
                      <span className="text-body-sm text-muted-foreground line-clamp-2">{PETS.find(p => p.id === activeQueue.petId)?.skillDescription}</span>
                    </div>
                    <div className="mt-3 flex items-center gap-6">
                      <div className="flex flex-col">
                        <span className="text-label-sm text-muted-foreground mb-1">Level (Max 90)</span>
                        <input
                          type="number"
                          min="1" max="90"
                          value={activeQueue.petLevel || 1}
                          onChange={(e) => updateQueue({ ...activeQueue, petLevel: Math.min(90, Math.max(1, parseInt(e.target.value) || 1)) })}
                          className="w-20 h-9 px-2 bg-surface-800 border border-border rounded-lg text-label-lg text-center focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-label-sm text-muted-foreground mb-1">Stars</span>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min="1" max="10"
                            value={activeQueue.petStars || 1}
                            onChange={(e) => updateQueue({ ...activeQueue, petStars: Math.min(10, Math.max(1, parseInt(e.target.value) || 1)) })}
                            className="w-16 h-9 px-2 bg-surface-800 border border-border rounded-lg text-label-lg text-center focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          />
                          <Star className="w-5 h-5 text-gold-400" fill="currentColor" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setSelectorType('pet')}
                  className={cn(
                    'flex-1 border-2 border-dashed border-border rounded-xl',
                    'hover:border-success-500 hover:text-success-400 hover:bg-success-500/5',
                    'flex flex-col items-center justify-center min-h-[140px] transition-all',
                    'text-muted-foreground'
                  )}
                >
                  <Heart className="w-8 h-8 mb-2" />
                  <span className="text-label-md">Assign Pet</span>
                </button>
              )}
            </CardContent>
          </Card>

          {/* Skins */}
          <div className="flex flex-col gap-4">
            {/* Castle Skin */}
            <Card variant="filled" className="flex-1">
              <CardContent className="p-4 flex items-center justify-between h-full">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gold-500/20 flex items-center justify-center">
                    <Castle className="w-6 h-6 text-gold-400" />
                  </div>
                  <div>
                    <div className="text-label-sm text-muted-foreground">Castle Skin</div>
                    <div className="text-title-sm font-semibold">{activeQueue.castleSkinId ? SKINS.find(s => s.id === activeQueue.castleSkinId)?.name : 'Default'}</div>
                  </div>
                </div>
                <Button variant="tonal" size="sm" onClick={() => setSelectorType('castle')}>
                  Change
                </Button>
              </CardContent>
            </Card>

            {/* March Skin */}
            <Card variant="filled" className="flex-1">
              <CardContent className="p-4 flex items-center justify-between h-full">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-warning-500/20 flex items-center justify-center">
                    <Flag className="w-6 h-6 text-warning-400" />
                  </div>
                  <div>
                    <div className="text-label-sm text-muted-foreground">March Skin</div>
                    <div className="text-title-sm font-semibold">{activeQueue.marchSkinId ? SKINS.find(s => s.id === activeQueue.marchSkinId)?.name : 'Default'}</div>
                  </div>
                </div>
                <Button variant="tonal" size="sm" onClick={() => setSelectorType('march')}>
                  Change
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Selection Modal */}
      {selectorType && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in">
          <Card variant="elevated" className="w-full max-w-4xl h-[85vh] flex flex-col">
            <CardHeader className="border-b border-border flex-shrink-0">
              <div className="flex justify-between items-center">
                <h3 className="text-title-lg font-semibold capitalize">
                  Select {selectorType} {relicSlotType ? `(${relicSlotType})` : ''}
                </h3>
                <button
                  onClick={() => { setSelectorType(null); setRelicSlotType(null); }}
                  className="p-2 rounded-lg bg-surface-800 hover:bg-surface-700 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto p-4">

              {/* Hero Selection */}
              {selectorType === 'hero' && (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {data.roster.length === 0 ? (
                    <div className="col-span-full text-center py-12 text-muted-foreground">
                      No heroes in roster. Go to Database to add some!
                    </div>
                  ) : (
                    data.roster.map(hero => {
                      const isUsed = isHeroUsedElsewhere(hero.id, activeQueueId, data.queues);
                      const isCurrent = activeQueue.heroIds.includes(hero.id);

                      return (
                        <div
                          key={hero.id}
                          className={cn(
                            'relative transition-all',
                            isUsed ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:scale-[1.02]',
                            isCurrent && 'ring-2 ring-success-500 rounded-xl'
                          )}
                          onClick={() => !isUsed && handleHeroSelect(hero)}
                        >
                          <HeroCard hero={hero} disableLink={true} />
                          {isUsed && (
                            <div className="absolute inset-0 bg-surface-900/70 flex items-center justify-center rounded-xl backdrop-blur-sm">
                              <Badge variant="error" size="sm">Used Elsewhere</Badge>
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
                      <Card
                        key={pet.id}
                        variant={isUsed ? 'outlined' : 'filled'}
                        interactive={!isUsed}
                        onClick={() => !isUsed && handlePetSelect(pet.id)}
                        className={cn(
                          isUsed && 'opacity-50 cursor-not-allowed'
                        )}
                      >
                        <CardContent className="p-4 flex items-start gap-4">
                          <div className="w-16 h-16 rounded-lg bg-surface-800 flex-shrink-0">
                            <ItemImage name={pet.name} className="w-full h-full rounded-lg" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start">
                              <h4 className="text-title-md font-semibold">{pet.name}</h4>
                              <Badge variant="success" size="sm">{pet.rarity}</Badge>
                            </div>
                            <p className="text-body-sm text-muted-foreground mt-1 line-clamp-2">{pet.description}</p>
                            <div className="mt-2 text-label-sm text-primary-400">
                              <span className="font-semibold">Skill:</span> {pet.skillName}
                            </div>
                          </div>
                          {isUsed && <Badge variant="error" size="sm">In Use</Badge>}
                        </CardContent>
                      </Card>
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
                      <Card
                        key={relic.id}
                        variant={isUsed ? 'outlined' : 'filled'}
                        interactive={!isUsed}
                        onClick={() => !isUsed && handleRelicSelect(relic.id)}
                        className={cn(
                          isUsed && 'opacity-50 cursor-not-allowed'
                        )}
                      >
                        <CardContent className="p-4 flex items-start gap-4">
                          <div className="w-16 h-16 rounded-lg bg-surface-800 flex-shrink-0">
                            <ItemImage name={relic.name} className="w-full h-full rounded-lg" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start">
                              <h4 className="text-title-md font-semibold">{relic.name}</h4>
                              <Badge variant="default" size="sm" className="bg-tertiary-500/20 text-tertiary-400 border-tertiary-500/30">
                                {relic.rarity}
                              </Badge>
                            </div>
                            <p className="text-body-sm text-muted-foreground mt-1">{relic.description}</p>
                            <div className="mt-2">
                              <Badge variant="success" size="sm">{relic.statBonus}</Badge>
                            </div>
                          </div>
                          {isUsed && <Badge variant="error" size="sm">In Use</Badge>}
                        </CardContent>
                      </Card>
                    );
                  })}
                  {RELICS.filter(r => r.type === relicSlotType).length === 0 && (
                    <div className="col-span-full text-center text-muted-foreground py-12">
                      No relics found for {relicSlotType} slot.
                    </div>
                  )}
                </div>
              )}

              {/* Skin Selection */}
              {(selectorType === 'castle' || selectorType === 'march') && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {SKINS.filter(s => s.type === (selectorType === 'castle' ? 'Castle' : 'March')).map(skin => (
                    <Card
                      key={skin.id}
                      variant="filled"
                      interactive
                      onClick={() => handleSkinSelect(skin.id, skin.type)}
                    >
                      <CardContent className="p-4">
                        <h4 className="text-title-md font-semibold">{skin.name}</h4>
                        <Badge variant="primary" size="sm" className="mt-2">{skin.type} Skin</Badge>
                        <p className="text-label-sm text-success-400 mt-2">{skin.bonus}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default TeamBuilder;
