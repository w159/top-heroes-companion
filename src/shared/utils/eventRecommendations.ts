import { UserData, GameEvent, SpendProfile } from '../types/types';
import { getEventState } from './eventUtils';
import { getProgressSpendProfile } from './heroRecommendations';

export type RecommendationPriority = 'High' | 'Medium' | 'Low';

export interface EventStrategyRecommendation {
  eventId: string;
  eventName: string;
  priority: RecommendationPriority;
  focus: string;
  actions: string[];
}

export function recommendEventStrategies(userData: UserData, events: GameEvent[]): EventStrategyRecommendation[] {
  const spendProfile = getProgressSpendProfile(userData);
  const mainFaction = userData.settings.mainFaction;

  return events.map(event => {
    const state = getEventState(event);
    const isActive = state.isActive;
    const actions: string[] = [];
    let focus = '';
    let priority: RecommendationPriority = 'Medium';

    const lowerId = event.id.toLowerCase();
    const lowerName = event.name.toLowerCase();

    // Event Specific Logic
    if (lowerId.includes('arms') || lowerName.includes('arms race')) {
      focus = 'Daily Routine Anchor';
      priority = 'High';

      actions.push('Align daily activities with current 4-hour phase');
      if (isActive && event.phases && state.activePhaseIndex !== undefined) {
         const phase = event.phases[state.activePhaseIndex];
         actions.push(`CURRENT PHASE: ${phase?.name || 'Unknown'}`);
         if (phase?.name?.includes('Train')) actions.push('Use speedups on troops now');
         if (phase?.name?.includes('Hero')) actions.push('Use EXP books and shards now');
      } else {
         actions.push('Check next phase timer before spending speedups');
      }

      if (spendProfile === 'F2P') actions.push('Save resources for "City Building" and "Research" phases for max points');

    } else if (lowerName.includes('guild expedition') || lowerName.includes('boss')) {
      focus = 'Guild Boss Damage';
      priority = 'High';
      actions.push('Equip single-target DPS loadout');
      actions.push('Challenge immediately after server reset for max attempts');
      actions.push('Coordinate buffs with guild leadership');

    } else if (lowerId === 'kingdom-war' || lowerName.includes('kvk')) {
      focus = 'Server War (PvP)';
      priority = 'High';
      actions.push('Hospital capacity check: Heal before engaging');
      actions.push('Enable "War Mode" talents if available');
      if (mainFaction === 'Nature') actions.push('Nature main: Focus on defending structures with sustain');
      if (mainFaction === 'League') actions.push('League main: Rally leader for objectives');
      if (mainFaction === 'Horde') actions.push('Horde main: Swarm field battles');

    } else if (lowerName.includes('ruins') || lowerName.includes('ancient')) {
      focus = 'Exploration & Puzzles';
      priority = 'Medium';
      actions.push('Save stamina for ruin tiles');
      actions.push('Scout tiles before marching to avoid counters');

    } else if (lowerName.includes('arena') || lowerName.includes('duel')) {
      focus = 'PvP Ladder';
      priority = 'Medium';
      actions.push('Refresh opponents to find favorable matchups');
      actions.push('Check enemy defense formation before attacking');
      if (spendProfile !== 'Whale') actions.push('Avoid top 10 whales; target active but lower power players');

    } else {
      // Generic Fallback
      focus = 'Standard Participation';
      priority = isActive ? 'Medium' : 'Low';
      actions.push('Complete daily free attempts');
      actions.push('Check reward thresholds vs resource cost');
    }

    // Active Phase Generic Logic
    if (isActive && event.phases && typeof state.activePhaseIndex === 'number' && state.activePhaseIndex >= 0) {
      const phase = event.phases[state.activePhaseIndex];
      if (phase && !lowerId.includes('arms')) { // Arms race already handled
        actions.push(`Current Phase: ${phase.name}`);
        if (phase.keyTasks.length > 0) {
          actions.push(`Focus: ${phase.keyTasks.slice(0, 2).join(', ')}`);
        }
      }
    }

    return {
      eventId: event.id,
      eventName: event.name,
      priority,
      focus,
      actions,
    };
  });
}
