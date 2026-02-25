/**
 * Stockpile Planner — Barrel Re-export
 *
 * Core functions have been split into:
 * - stockpileTypes: interfaces and spend profile configuration
 * - stockpileCore: recommendation, conflict resolution, timeline, and advice functions
 *
 * This barrel preserves the original import path so existing consumers
 * continue to work without changes.
 */

export type {
  StockpileRecommendation,
  ResourceConflict,
  StockpileTimeline,
  ProfileModifier,
} from './stockpileTypes';

export {
  PROFILE_MODIFIERS,
  isResourceRelevant,
  determineUrgency,
  buildSaveReason,
} from './stockpileTypes';

export {
  generateStockpileRecommendations,
  resolveResourceConflicts,
  generateStockpileTimeline,
  getSpendOrSaveAdvice,
} from './stockpileCore';
