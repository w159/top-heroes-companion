import { useState, useEffect } from 'react';
import { UserData, UserHero, Hero, Queue } from '../types/types';
import { calculateTotalInfluence } from '../utils/calculations';
import { logger } from '../lib/logger';

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

const LOAD_DELAY_MS = 300;

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
             parsed.queues = parsed.queues.map((q: Queue) => ({
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
        logger.error('Failed to parse local storage', e);
      }
    }
    setTimeout(() => setIsLoaded(true), LOAD_DELAY_MS);
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
