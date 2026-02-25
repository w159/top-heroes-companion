import {
  Calendar, Swords, Target, Flame, Trophy, Layers, Crown, Skull, Gift, BookOpen,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { GameEvent } from '@/shared/types/types';

export interface EventColorSet {
  border: string;
  bg: string;
  text: string;
  gradient: string;
  glow: string;
}

export function getEventIcon(event: GameEvent): LucideIcon {
  const name = event.name.toLowerCase();
  if (name.includes('arms') || name.includes('war')) return Swords;
  if (name.includes('battlefield') || name.includes('glory')) return Target;
  if (name.includes('boss')) return Flame;
  if (name.includes('arena')) return Trophy;
  if (name.includes('chess')) return Layers;
  if (name.includes('kingdom')) return Crown;
  if (name.includes('dark') || name.includes('invasion')) return Skull;
  if (name.includes('loot') || name.includes('wheel') || name.includes('dice')) return Gift;
  if (name.includes('bounty') || name.includes('hunt')) return BookOpen;
  return Calendar;
}

export function getEventColorClass(event: GameEvent): EventColorSet {
  if (event.isActive) return {
    border: 'border-primary-500',
    bg: 'bg-primary-500/10',
    text: 'text-primary-400',
    gradient: 'from-primary-500 to-primary-600',
    glow: 'shadow-primary-500/30',
  };

  if (event.type === 'Guild') return {
    border: 'border-tertiary-500',
    bg: 'bg-tertiary-500/10',
    text: 'text-tertiary-400',
    gradient: 'from-tertiary-500 to-tertiary-600',
    glow: 'shadow-tertiary-500/30',
  };

  if (event.type === 'PvP' || event.type === 'PvP Arena' || event.type === 'Server War') return {
    border: 'border-error-500',
    bg: 'bg-error-500/10',
    text: 'text-error-400',
    gradient: 'from-error-500 to-error-600',
    glow: 'shadow-error-500/30',
  };

  if (event.type === 'Seasonal') return {
    border: 'border-gold-500',
    bg: 'bg-gold-500/10',
    text: 'text-gold-400',
    gradient: 'from-gold-500 to-gold-600',
    glow: 'shadow-gold-500/30',
  };

  return {
    border: 'border-success-500',
    bg: 'bg-success-500/10',
    text: 'text-success-400',
    gradient: 'from-success-500 to-success-600',
    glow: 'shadow-success-500/30',
  };
}
