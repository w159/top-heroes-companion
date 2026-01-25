
import { useState, useEffect } from 'react';
import { UserData, UserHero, Hero, Faction, TeamPreset, Queue, RelicType, GameEvent } from '../types/types';
import { HEROES, PETS, RELICS, SKINS } from '../types/constants';

const STORAGE_KEY = 'topheroes_companion_data_v6';

const INITIAL_QUEUES: Queue[] = Array.from({ length: 5 }, (_, i) => ({
    id: i + 1,
    name: `Queue ${i + 1}`,
    heroIds: [null, null, null, null, null],
    petId: null,
    petLevel: 1,
    petStars: 1,
    relics: {
        Attack: null,
        Defense: null,
        Assist: null
    },
    soldierType: null,
    soldierTier: 1,
    castleSkinId: null,
    marchSkinId: null,
}));

const DEFAULT_DATA: UserData = {
  roster: [],
  inventory: {
    diamonds: 0,
    gold: 0,
    experience: 0,
    stamina: 0,
    speedups: {
      generic: 0,
      building: 0,
      training: 0,
      research: 0,
    },
    shards: {
      generic: {
        legendary: 0,
        mythic: 0,
      },
      specific: {},
    },
    guildCoins: 0,
    ruinsCoins: 0,
    arenaTokens: 0,
  },
  buildings: {
    castle: 1,
    trainingGrounds: 1,
  },
  research: {
    economy: {},
    military: {},
  },
  redeemedCodes: [],
  settings: {
    mainFaction: 'Nature',
    serverGroup: '100+',
  },
  queues: INITIAL_QUEUES,
  teamPresets: [],
  lastUpdated: new Date().toISOString(),
  progressLog: [],
  progressModel: {
    spendProfile: 'F2P',
    snapshots: [],
  },
};

export const useUserData = () => {
  const [data, setData] = useState<UserData>(DEFAULT_DATA);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed: UserData = JSON.parse(stored);
        if (!parsed.queues) {
            parsed.queues = INITIAL_QUEUES;
        } else {
             parsed.queues = parsed.queues.map((q: any) => ({
                 ...q,
                 relics: q.relics || { Attack: null, Defense: null, Assist: null }
             }));
        }
        if (!parsed.progressLog) {
          parsed.progressLog = [];
        }
        if (!parsed.progressModel) {
          parsed.progressModel = {
            spendProfile: 'F2P',
            snapshots: [],
          };
        }
        setData(parsed);
      } catch (e) {
        console.error("Failed to parse local storage", e);
      }
    }
    setTimeout(() => setIsLoaded(true), 300);
  }, []);

  const saveData = (newData: UserData) => {
    setData(newData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
  };

  const addToRoster = (hero: Hero) => {
    if (data.roster.find(h => h.id === hero.id)) return;
    const newHero: UserHero = {
      ...hero,
      level: 1,
      stars: hero.rarity === 'Mythic' ? 0 : 1,
      awakening: 0,
      power: 0,
      isOwned: true
    };
    saveData({ ...data, roster: [...data.roster, newHero] });
  };

  const removeFromRoster = (heroId: string) => {
    const newQueues = data.queues.map(q => ({
        ...q,
        heroIds: q.heroIds.map(hid => hid === heroId ? null : hid)
    }));
    saveData({
      ...data,
        roster: data.roster.filter(h => h.id !== heroId),
        queues: newQueues
    });
  };

  const updateHero = (updatedHero: UserHero) => {
    saveData({
      ...data,
      roster: data.roster.map(h => h.id === updatedHero.id ? updatedHero : h)
    });
  };

  const toggleCodeRedeemed = (code: string) => {
    const isRedeemed = data.redeemedCodes.includes(code);
    let newCodes;
    if (isRedeemed) {
      newCodes = data.redeemedCodes.filter(c => c !== code);
    } else {
      newCodes = [...data.redeemedCodes, code];
    }
    saveData({ ...data, redeemedCodes: newCodes });
  };

  const updateSettings = (newSettings: UserData['settings']) => {
    saveData({ ...data, settings: newSettings });
  };

  const updateQueue = (updatedQueue: Queue) => {
      const newQueues = data.queues.map(q => q.id === updatedQueue.id ? updatedQueue : q);
      saveData({ ...data, queues: newQueues });
  };

  const recordProgressSnapshot = (notes?: string) => {
    const totalInfluence = calculateTotalInfluence(data);
    const snapshot = {
      date: new Date().toISOString(),
      totalInfluence,
      notes,
    };
    const updatedLog = [...(data.progressLog || []), snapshot];
    const updatedModel = {
      spendProfile: data.progressModel?.spendProfile || 'F2P',
      snapshots: [...(data.progressModel?.snapshots || []), snapshot],
    };
    saveData({
      ...data,
      progressLog: updatedLog,
      progressModel: updatedModel,
      lastUpdated: new Date().toISOString(),
    });
  };

  return {
    data,
    isLoaded,
    addToRoster,
    removeFromRoster,
    updateHero,
    toggleCodeRedeemed,
    updateSettings,
    updateQueue,
    recordProgressSnapshot,
    saveData
  };
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

export const getTimeUntilReset = (): string => {
    const now = new Date();
    const nextReset = new Date();
    nextReset.setUTCHours(24, 0, 0, 0);

    const diff = nextReset.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return `${hours}h ${minutes}m ${seconds}s`;
};

export const getEventState = (event: GameEvent): { isActive: boolean; activePhaseIndex: number; activePhaseName?: string } => {
    const today = new Date();
    const day = today.getUTCDay(); // 0=Sun, 1=Mon... 6=Sat

    if (event.scheduleType === 'Weekly-UTC') {
        if (event.id === 'arms-race') {
            if (day === 0) return { isActive: false, activePhaseIndex: -1 };
            const phaseIndex = day - 1;
            if (event.phases && event.phases[phaseIndex]) {
              return {
                isActive: true,
                    activePhaseIndex: phaseIndex,
                    activePhaseName: event.phases[phaseIndex].name
                };
            }
        }

        // Sunday specific events
        if (event.id === 'ancient-ruins') {
            const isWeekend = day === 0 || day === 6;
            return { isActive: isWeekend, activePhaseIndex: 0 };
        }
    }

    return {
        isActive: !!event.isActive,
        activePhaseIndex: event.activePhaseIndex || 0,
        activePhaseName: event.phases?.[event.activePhaseIndex || 0]?.name
    };
};

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

export const getFactionAdvantage = (attacker: Faction, defender: Faction): number => {
  if (attacker === 'Nature' && defender === 'Horde') return 1.3;
  if (attacker === 'Horde' && defender === 'League') return 1.3;
  if (attacker === 'League' && defender === 'Nature') return 1.3;
  return 1.0;
};
