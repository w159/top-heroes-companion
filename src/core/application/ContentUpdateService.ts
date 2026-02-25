/**
 * Application Layer - Content Update Service
 * Manages automatic content updates with versioning and change tracking
 */

import {
  IContentUpdateService,
  ContentVersion,
  ContentMetadata,
  UpdateRecord,
  IDataRepository,
  IStorageService,
} from '../domain/interfaces';
import { Hero, GameEvent, Pet, Relic, Skin, GiftCode } from '@/shared/types';

const METADATA_KEY = 'app_content_metadata_v2';
const UPDATE_HISTORY_KEY = 'app_update_history_v2';
const LAST_CHECK_KEY = 'app_last_update_check_v2';

export class ContentUpdateService implements IContentUpdateService {
  private readonly CHECK_INTERVAL = 24 * 60 * 60 * 1000; // 24 hours

  constructor(
    private dataRepo: IDataRepository,
    private storage: IStorageService
  ) {}

  async checkForUpdates(): Promise<ContentMetadata> {
    const lastCheck = this.storage.get<number>(LAST_CHECK_KEY, 0);
    const now = Date.now();

    // Only check if interval has passed
    if (now - lastCheck < this.CHECK_INTERVAL) {
      return this.getCurrentVersions();
    }

    // In a real implementation, this would fetch from a remote source
    // For now, we return current versions
    this.storage.set(LAST_CHECK_KEY, now);
    return this.getCurrentVersions();
  }

  getCurrentVersions(): ContentMetadata {
    const defaultMetadata: ContentMetadata = {
      heroes: {
        version: '2.0.0',
        lastUpdated: new Date('2026-01-24'),
        changelog: ['Initial release with 67 heroes'],
      },
      events: {
        version: '2.0.0',
        lastUpdated: new Date('2026-01-24'),
        changelog: ['Current active events'],
      },
      pets: {
        version: '2.0.0',
        lastUpdated: new Date('2026-01-24'),
        changelog: ['All available pets'],
      },
      relics: {
        version: '2.0.0',
        lastUpdated: new Date('2026-01-24'),
        changelog: ['Complete relic sets'],
      },
      skins: {
        version: '2.0.0',
        lastUpdated: new Date('2026-01-24'),
        changelog: ['Castle and March skins'],
      },
      codes: {
        version: '2.0.0',
        lastUpdated: new Date('2026-01-24'),
        changelog: ['Active gift codes'],
      },
    };

    return this.storage.get(METADATA_KEY, defaultMetadata);
  }

  async applyUpdate(category: keyof ContentMetadata, data: unknown[]): Promise<void> {
    // Apply the update to the appropriate repository
    switch (category) {
      case 'heroes':
        await this.dataRepo.updateHeroes(data as Hero[]);
        break;
      case 'events':
        await this.dataRepo.updateEvents(data as GameEvent[]);
        break;
      case 'pets':
        await this.dataRepo.updatePets(data as Pet[]);
        break;
      case 'relics':
        await this.dataRepo.updateRelics(data as Relic[]);
        break;
      case 'skins':
        await this.dataRepo.updateSkins(data as Skin[]);
        break;
      case 'codes':
        await this.dataRepo.updateGiftCodes(data as GiftCode[]);
        break;
    }

    // Update metadata
    const metadata = this.getCurrentVersions();
    const currentVersion = metadata[category].version;
    const [major, minor, patch] = currentVersion.split('.').map(Number);
    const newVersion = `${major}.${minor}.${patch + 1}`;

    metadata[category] = {
      version: newVersion,
      lastUpdated: new Date(),
      changelog: [`Updated ${data.length} items`],
    };

    this.storage.set(METADATA_KEY, metadata);

    // Record update history
    this.recordUpdate({
      category,
      version: newVersion,
      timestamp: new Date(),
      itemsUpdated: data.length,
    });
  }

  getUpdateHistory(): UpdateRecord[] {
    return this.storage.get<UpdateRecord[]>(UPDATE_HISTORY_KEY, []);
  }

  private recordUpdate(record: UpdateRecord): void {
    const history = this.getUpdateHistory();
    history.unshift(record);

    // Keep only last 50 records
    if (history.length > 50) {
      history.splice(50);
    }

    this.storage.set(UPDATE_HISTORY_KEY, history);
  }

  /**
   * Check if content needs refreshing based on age
   */
  isContentStale(category: keyof ContentMetadata, maxAgeDays: number = 7): boolean {
    const metadata = this.getCurrentVersions();
    const contentVersion = metadata[category];
    const ageMs = Date.now() - new Date(contentVersion.lastUpdated).getTime();
    const ageDays = ageMs / (24 * 60 * 60 * 1000);
    return ageDays > maxAgeDays;
  }

  /**
   * Get summary of content freshness
   */
  getContentFreshness(): Record<keyof ContentMetadata, { age: number; isStale: boolean }> {
    const metadata = this.getCurrentVersions();
    const result = {} as Record<keyof ContentMetadata, { age: number; isStale: boolean }>;

    (Object.keys(metadata) as Array<keyof ContentMetadata>).forEach(category => {
      const ageMs = Date.now() - new Date(metadata[category].lastUpdated).getTime();
      const ageDays = Math.floor(ageMs / (24 * 60 * 60 * 1000));

      result[category] = {
        age: ageDays,
        isStale: ageDays > 7,
      };
    });

    return result;
  }
}
