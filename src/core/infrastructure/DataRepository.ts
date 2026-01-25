/**
 * Infrastructure Layer - Data Repository Implementation
 * Manages all game content data with caching and versioning
 */

import { IDataRepository, IUserDataRepository, IStorageService } from '../domain/interfaces';
import { Hero, GameEvent, Pet, Relic, Skin, GiftCode, UserHero } from '../../../types';
import { HEROES, EVENTS, PETS, RELICS, SKINS, GIFT_CODES } from '../../shared/types/constants';

const KEYS = {
  HEROES: 'app_data_heroes_v2',
  EVENTS: 'app_data_events_v2',
  PETS: 'app_data_pets_v2',
  RELICS: 'app_data_relics_v2',
  SKINS: 'app_data_skins_v2',
  CODES: 'app_data_codes_v2',
  USER_HEROES: 'app_user_heroes_v2',
  USER_DATA_EXPORT: 'app_user_full_export',
} as const;

export class DataRepository implements IDataRepository, IUserDataRepository {
  constructor(private storage: IStorageService) {}

  // ============================================================================
  // GAME DATA
  // ============================================================================

  async getHeroes(): Promise<Hero[]> {
    return Promise.resolve(this.storage.get(KEYS.HEROES, HEROES));
  }

  async getEvents(): Promise<GameEvent[]> {
    return Promise.resolve(this.storage.get(KEYS.EVENTS, EVENTS));
  }

  async getPets(): Promise<Pet[]> {
    return Promise.resolve(this.storage.get(KEYS.PETS, PETS));
  }

  async getRelics(): Promise<Relic[]> {
    return Promise.resolve(this.storage.get(KEYS.RELICS, RELICS));
  }

  async getSkins(): Promise<Skin[]> {
    return Promise.resolve(this.storage.get(KEYS.SKINS, SKINS));
  }

  async getGiftCodes(): Promise<GiftCode[]> {
    return Promise.resolve(this.storage.get(KEYS.CODES, GIFT_CODES));
  }

  async updateHeroes(heroes: Hero[]): Promise<void> {
    this.storage.set(KEYS.HEROES, heroes);
  }

  async updateEvents(events: GameEvent[]): Promise<void> {
    this.storage.set(KEYS.EVENTS, events);
  }

  async updatePets(pets: Pet[]): Promise<void> {
    this.storage.set(KEYS.PETS, pets);
  }

  async updateRelics(relics: Relic[]): Promise<void> {
    this.storage.set(KEYS.RELICS, relics);
  }

  async updateSkins(skins: Skin[]): Promise<void> {
    this.storage.set(KEYS.SKINS, skins);
  }

  async updateGiftCodes(codes: GiftCode[]): Promise<void> {
    this.storage.set(KEYS.CODES, codes);
  }

  // ============================================================================
  // USER DATA
  // ============================================================================

  async getUserHeroes(): Promise<UserHero[]> {
    return Promise.resolve(this.storage.get<UserHero[]>(KEYS.USER_HEROES, []));
  }

  async saveUserHero(hero: UserHero): Promise<void> {
    const heroes = await this.getUserHeroes();
    const index = heroes.findIndex(h => h.id === hero.id);

    if (index >= 0) {
      heroes[index] = hero;
    } else {
      heroes.push(hero);
    }

    this.storage.set(KEYS.USER_HEROES, heroes);
  }

  async deleteUserHero(heroId: string): Promise<void> {
    const heroes = await this.getUserHeroes();
    const filtered = heroes.filter(h => h.id !== heroId);
    this.storage.set(KEYS.USER_HEROES, filtered);
  }

  async exportData(): Promise<string> {
    const data = {
      version: '2.0',
      exportedAt: new Date().toISOString(),
      userHeroes: await this.getUserHeroes(),
      // Add other user data as needed
    };
    return JSON.stringify(data, null, 2);
  }

  async importData(jsonData: string): Promise<void> {
    try {
      const data = JSON.parse(jsonData);

      if (data.version !== '2.0') {
        throw new Error('Incompatible data version');
      }

      if (data.userHeroes) {
        this.storage.set(KEYS.USER_HEROES, data.userHeroes);
      }

      // Import other data as needed
    } catch (error) {
      console.error('Failed to import data:', error);
      throw new Error('Invalid import data format');
    }
  }
}
