import { Queue } from '../types/types';

export const isHeroUsedElsewhere = (heroId: string, currentQueueId: number, allQueues: Queue[]): boolean => {
    return allQueues.some(q => q.id !== currentQueueId && q.heroIds.includes(heroId));
};

export const isPetUsedElsewhere = (petId: string, currentQueueId: number, allQueues: Queue[]): boolean => {
    return allQueues.some(q => q.id !== currentQueueId && q.petId === petId);
};

export const isRelicUsedElsewhere = (relicId: string, currentQueueId: number, allQueues: Queue[]): boolean => {
    return allQueues.some(q => {
        if (q.id === currentQueueId) return false;
        return Object.values(q.relics || {}).some(entry => entry?.id === relicId);
    });
};
