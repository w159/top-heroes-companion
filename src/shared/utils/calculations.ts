import { UserData, UserHero, Faction, Queue } from '../types/types';
import { PETS, RELICS, SKINS } from '../types/constants';

export const calculateHeroPower = (hero: UserHero): number => {
    const base = 1000;
    const levelMulti = hero.level * 50;
    const starMulti = (hero.stars + 1) * 1.5;
    const rarityBonus = hero.rarity === 'Mythic' ? 1.5 : hero.rarity === 'Legendary' ? 1.2 : 1.0;
    return Math.floor((base + levelMulti) * starMulti * rarityBonus);
};

export const calculateQueueInfluence = (queue: Queue, roster: UserHero[] = []): number => {
    if (!queue) return 0;
    let total = 0;

    if (queue.heroIds) {
        queue.heroIds.forEach(id => {
            if (id) {
                const hero = roster.find(h => h.id === id);
                if (hero) total += calculateHeroPower(hero);
            }
        });
    }

    if (queue.soldierType) total += (queue.soldierTier || 1) * 5000;
    if (queue.petId) {
        const pet = PETS.find(p => p.id === queue.petId);
        if (pet) total += pet.baseInfluence + ((queue.petLevel || 1) * 250) + ((queue.petStars || 1) * 2000);
    }
    if (queue.relics) {
        Object.values(queue.relics).forEach(entry => {
            if (entry) {
                const relic = RELICS.find(r => r.id === entry.id);
                if (relic) total += relic.baseInfluence + ((entry.level || 1) * 150);
            }
        });
    }
    if (queue.castleSkinId) {
        const skin = SKINS.find(s => s.id === queue.castleSkinId);
        if (skin) total += skin.baseInfluence;
    }
    if (queue.marchSkinId) {
        const skin = SKINS.find(s => s.id === queue.marchSkinId);
        if (skin) total += skin.baseInfluence;
    }
    return total;
};

export const calculateTotalInfluence = (data: UserData): number => {
  if (!data || !data.queues || !data.roster) return 0;
  return data.queues.reduce((sum, queue) => sum + calculateQueueInfluence(queue, data.roster), 0);
};

export const calculateProgressTrend = (snapshots: { totalInfluence: number }[]): number => {
  if (!snapshots || snapshots.length < 2) return 0;
  const first = snapshots[0].totalInfluence;
  const last = snapshots[snapshots.length - 1].totalInfluence;
  if (first === 0) return 0;
  return ((last - first) / first) * 100;
};

export const getFactionAdvantage = (attacker: Faction, defender: Faction): number => {
  if (attacker === 'Nature' && defender === 'Horde') return 1.3;
  if (attacker === 'Horde' && defender === 'League') return 1.3;
  if (attacker === 'League' && defender === 'Nature') return 1.3;
  return 1.0;
};

export const addProgressSnapshot = (data: UserData, snapshot: { date: string; totalInfluence: number; notes?: string }): UserData => {
  const progressLog = [...(data.progressLog || []), snapshot];
  const progressModel = {
    spendProfile: data.progressModel?.spendProfile || 'F2P',
    snapshots: [...(data.progressModel?.snapshots || []), snapshot],
  };
  return {
    ...data,
    progressLog,
    progressModel,
    lastUpdated: snapshot.date,
  };
};
