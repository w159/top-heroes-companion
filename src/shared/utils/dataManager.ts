import { Hero, GameEvent, GiftCode, Pet, Relic, Skin } from '../types/types';
import { HEROES, EVENTS, PETS, RELICS, SKINS, GIFT_CODES } from '../types/constants';
import { storageManager } from './storage';

const DATA_VERSION_KEY = 'top_heroes_data_version';
const HEROES_KEY = 'top_heroes_data_heroes';
const EVENTS_KEY = 'top_heroes_data_events';
const PETS_KEY = 'top_heroes_data_pets';
const RELICS_KEY = 'top_heroes_data_relics';
const SKINS_KEY = 'top_heroes_data_skins';
const CODES_KEY = 'top_heroes_data_codes';

export class DataManager {
  private static instance: DataManager;
  private storage = storageManager;

  private heroes: Hero[] = [];
  private events: GameEvent[] = [];
  private pets: Pet[] = [];
  private relics: Relic[] = [];
  private skins: Skin[] = [];
  private giftCodes: GiftCode[] = [];

  private constructor() {
    this.loadData();
  }

  public static getInstance(): DataManager {
    if (!DataManager.instance) {
      DataManager.instance = new DataManager();
    }
    return DataManager.instance;
  }

  private loadData() {
    this.heroes = this.storage.getItem<Hero[]>(HEROES_KEY, HEROES);
    this.events = this.storage.getItem<GameEvent[]>(EVENTS_KEY, EVENTS);
    this.pets = this.storage.getItem<Pet[]>(PETS_KEY, PETS);
    this.relics = this.storage.getItem<Relic[]>(RELICS_KEY, RELICS);
    this.skins = this.storage.getItem<Skin[]>(SKINS_KEY, SKINS);
    this.giftCodes = this.storage.getItem<GiftCode[]>(CODES_KEY, GIFT_CODES);
  }

  public getHeroes(): Hero[] {
    return this.heroes;
  }

  public getEvents(): GameEvent[] {
    return this.events;
  }

  public getPets(): Pet[] {
    return this.pets;
  }

  public getRelics(): Relic[] {
    return this.relics;
  }

  public getSkins(): Skin[] {
    return this.skins;
  }

  public getGiftCodes(): GiftCode[] {
    return this.giftCodes;
  }

  public async checkForUpdates(): Promise<boolean> {
    console.log('Checking for data updates...');

    const remoteVersion = '1.1.0';
    const currentVersion = this.storage.getItem<string>(DATA_VERSION_KEY, '1.0.0');

    if (remoteVersion > currentVersion) {
        console.log('Update found, applying data changes');
        const newHero: Hero = {
            id: 'storm-bringer-preview',
            name: 'Storm Bringer (Preview)',
            faction: 'Nature',
            rarity: 'Mythic',
            role: 'DPS',
            tier: 'S',
            description: 'New mythic hero coming soon. Data updated remotely.',
            skills: [],
            recommendedSets: ['Warlord'],
            bonds: [],
            specialWeapon: { name: 'Thunder', description: 'Zap' },
            exclusiveGear: { name: 'Cloak', statBonus: 'ATK' }
        };

        if (this.validateData(newHero, 'hero')) {
             const updatedHeroes = [...HEROES, newHero];
             this.storage.setItem(HEROES_KEY, updatedHeroes);
             this.heroes = updatedHeroes;
        }

        this.storage.setItem(DATA_VERSION_KEY, remoteVersion);
        return true;
    }

    return false;
  }

  public validateData(data: any, schema: 'hero' | 'event' | 'item'): boolean {
      switch (schema) {
          case 'hero':
              return !!(data.id && data.name && data.faction && data.rarity);
          case 'event':
              return !!(data.id && data.name && data.type);
          case 'item':
              return !!(data.id && data.name);
          default:
              return false;
      }
  }

  public forceReset(): void {
      this.storage.removeItem(HEROES_KEY);
      this.storage.removeItem(EVENTS_KEY);
      this.storage.removeItem(PETS_KEY);
      this.storage.removeItem(RELICS_KEY);
      this.storage.removeItem(SKINS_KEY);
      this.storage.removeItem(CODES_KEY);
      this.storage.removeItem(DATA_VERSION_KEY);
      this.loadData();
  }
}
