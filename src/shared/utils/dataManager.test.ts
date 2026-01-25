import { beforeEach, describe, expect, it, vi } from 'vitest';
import { DataManager } from './dataManager';
import { HEROES, EVENTS } from '../types/constants';

describe('DataManager', () => {
  beforeEach(() => {
    vi.resetModules();
    localStorage.clear();
  });

  it('should load static data when storage is empty', () => {
    const manager = DataManager.getInstance();

    expect(manager.getHeroes().length).toBe(HEROES.length);
    expect(manager.getEvents().length).toBe(EVENTS.length);
  });

  it('should write updated data to storage on update', async () => {
    const manager = DataManager.getInstance();

    const updated = await manager.checkForUpdates();
    expect(updated).toBe(true);

    const heroes = manager.getHeroes();
    expect(heroes.length).toBeGreaterThan(HEROES.length);

    const stored = localStorage.getItem('top_heroes_data_heroes');
    expect(stored).not.toBeNull();
  });

  it('should validate hero data correctly', () => {
    const manager = DataManager.getInstance();

    const validHero = {
      id: 'test-hero',
      name: 'Test Hero',
      faction: 'Nature',
      rarity: 'Mythic',
    };

    const invalidHero = {
      id: 'broken-hero',
      name: '',
    };

    expect(manager.validateData(validHero, 'hero')).toBe(true);
    expect(manager.validateData(invalidHero, 'hero')).toBe(false);
  });
});

