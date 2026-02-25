import React from 'react';
import { useTeamBuilder } from '../hooks/useTeamBuilder';
import HeroSlots from '../components/HeroSlots';
import SoldierConfig from '../components/SoldierConfig';
import RelicSlots from '../components/RelicSlots';
import PetSlot from '../components/PetSlot';
import SkinSlots from '../components/SkinSlots';
import SelectorModal from '../components/SelectorModal';
import { Users, Zap, Swords, Gem } from 'lucide-react';
import { Card, CardContent } from '@/shared/ui/components/card';
import { cn } from '@/shared/lib/utils';

const TeamBuilder: React.FC = () => {
  const {
    data,
    activeQueueId,
    setActiveQueueId,
    activeQueue,
    queueInfluence,
    updateQueue,
    selectorType,
    setSelectorType,
    relicSlotType,
    handleHeroSelect,
    handlePetSelect,
    handleRelicSelect,
    handleSkinSelect,
    openHeroSelector,
    openRelicSelector,
    closeSelector,
  } = useTeamBuilder();

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
          <HeroSlots
            activeQueue={activeQueue}
            roster={data.roster}
            onSelectSlot={openHeroSelector}
            updateQueue={updateQueue}
          />
        </div>

        {/* 2. Soldiers Configuration */}
        <SoldierConfig activeQueue={activeQueue} updateQueue={updateQueue} />

        {/* 3. Relics Section */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <Gem className="w-5 h-5 text-tertiary-400" />
            <h3 className="text-title-lg font-semibold">Relics</h3>
          </div>
          <RelicSlots
            activeQueue={activeQueue}
            updateQueue={updateQueue}
            onSelectRelic={openRelicSelector}
          />
        </div>

        {/* 4. Pet Slot & Skins */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <PetSlot
            activeQueue={activeQueue}
            updateQueue={updateQueue}
            onSelectPet={() => setSelectorType('pet')}
          />
          <SkinSlots
            activeQueue={activeQueue}
            onSelectSkin={setSelectorType}
          />
        </div>
      </div>

      {/* Selection Modal */}
      <SelectorModal
        selectorType={selectorType}
        relicSlotType={relicSlotType}
        activeQueueId={activeQueueId}
        activeQueue={activeQueue}
        roster={data.roster}
        allQueues={data.queues}
        onHeroSelect={handleHeroSelect}
        onPetSelect={handlePetSelect}
        onRelicSelect={handleRelicSelect}
        onSkinSelect={handleSkinSelect}
        onClose={closeSelector}
      />
    </div>
  );
};

export default TeamBuilder;
