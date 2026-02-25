import { useState } from 'react';
import { useUserData, calculateQueueInfluence, isHeroUsedElsewhere, isPetUsedElsewhere, isRelicUsedElsewhere } from '../../../shared/utils';
import { UserHero, RelicType } from '../../../shared/types';

export type SelectorType = 'hero' | 'pet' | 'relic' | 'castle' | 'march' | null;

export const useTeamBuilder = () => {
  const { data, updateQueue } = useUserData();
  const [activeQueueId, setActiveQueueId] = useState<number>(1);

  // Selectors State
  const [selectorType, setSelectorType] = useState<SelectorType>(null);
  const [relicSlotType, setRelicSlotType] = useState<RelicType | null>(null);
  const [selectorSlotIndex, setSelectorSlotIndex] = useState<number | null>(null);

  const activeQueue = data.queues.find(q => q.id === activeQueueId) || data.queues[0];
  const queueInfluence = calculateQueueInfluence(activeQueue, data.roster);

  // Ensure relics object exists (migration safety)
  if (!activeQueue.relics) {
    activeQueue.relics = { Attack: null, Defense: null, Assist: null };
  }

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

  const openHeroSelector = (slotIndex: number) => {
    setSelectorType('hero');
    setSelectorSlotIndex(slotIndex);
  };

  const openRelicSelector = (type: RelicType) => {
    setSelectorType('relic');
    setRelicSlotType(type);
  };

  const closeSelector = () => {
    setSelectorType(null);
    setRelicSlotType(null);
  };

  return {
    data,
    activeQueueId,
    setActiveQueueId,
    activeQueue,
    queueInfluence,
    updateQueue,
    // Selector state
    selectorType,
    setSelectorType,
    relicSlotType,
    // Handlers
    handleHeroSelect,
    handlePetSelect,
    handleRelicSelect,
    handleSkinSelect,
    // Selector controls
    openHeroSelector,
    openRelicSelector,
    closeSelector,
  };
};
