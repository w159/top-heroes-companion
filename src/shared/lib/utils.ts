import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Shield, Sword, Heart, Zap, Star, Crosshair } from 'lucide-react';
import type React from 'react';

/**
 * Merges class names with Tailwind CSS conflict resolution
 * This is the core utility for all component styling
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format numbers with K/M suffixes
 */
export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(2) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

/**
 * Get rarity color class
 */
export function getRarityColor(rarity: string): string {
  const colors: Record<string, string> = {
    'Common': 'text-surface-400',
    'Rare': 'text-primary-400',
    'Epic': 'text-tertiary-400',
    'Legendary': 'text-warning-400',
    'Mythic': 'text-error-400',
  };
  return colors[rarity] || 'text-foreground';
}

/**
 * Get rarity background color class
 */
export function getRarityBgColor(rarity: string): string {
  const colors: Record<string, string> = {
    'Common': 'bg-surface-700',
    'Rare': 'bg-primary-900',
    'Epic': 'bg-tertiary-900',
    'Legendary': 'bg-warning-900',
    'Mythic': 'bg-error-900',
  };
  return colors[rarity] || 'bg-surface-800';
}

/**
 * Get rarity border color class
 */
export function getRarityBorderColor(rarity: string): string {
  const colors: Record<string, string> = {
    'Common': 'border-surface-500',
    'Rare': 'border-primary-500',
    'Epic': 'border-tertiary-500',
    'Legendary': 'border-warning-500',
    'Mythic': 'border-error-500',
  };
  return colors[rarity] || 'border-border';
}

/**
 * Get the icon component for a hero role
 */
export function getRoleIcon(role: string): React.ElementType {
  const icons: Record<string, React.ElementType> = {
    'Tank': Shield,
    'DPS': Sword,
    'Damage Dealer': Sword,
    'Support': Heart,
    'Supporter': Heart,
    'Healer': Heart,
    'Controller': Zap,
    'Warrior': Sword,
    'Mage': Star,
    'Assassin': Zap,
  };
  return icons[role] || Shield;
}
