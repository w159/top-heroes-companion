// Pages
export { default as Events } from './pages/Events';
export { default as GiftCodes } from './pages/GiftCodes';

// Components
export { default as ScoringTable } from './components/ScoringTable';
export { default as StockpileTracker } from './components/StockpileTracker';
export { default as ResourceConflictAlert } from './components/ResourceConflictAlert';
export { default as EventCard } from './components/EventCard';
export { default as EventHeader } from './components/EventHeader';
export { default as PhaseContent } from './components/PhaseContent';

// Hooks
export { useEvents } from './hooks/useEvents';
export type { EventTab } from './hooks/useEvents';

// Utilities
export { getEventIcon, getEventColorClass } from './lib/eventUtils';
export type { EventColorSet } from './lib/eventUtils';
