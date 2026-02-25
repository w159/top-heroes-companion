import React from 'react';
import { User, Shield, Server } from 'lucide-react';
import { Faction } from '../../../shared/types';
import { Card, CardContent, CardHeader } from '../../../shared/ui/components/card';
import { cn } from '../../../shared/lib/utils';
import { SettingItem } from './SettingItem';

interface GameSettingsSectionProps {
  mainFaction: string;
  serverGroup: string;
  onFactionChange: (faction: Faction) => void;
  onServerGroupChange: (serverGroup: string) => void;
}

const factionOptions = [
  { value: 'Nature', label: 'Nature', color: 'text-success-400' },
  { value: 'League', label: 'League', color: 'text-primary-400' },
  { value: 'Horde', label: 'Horde', color: 'text-error-400' },
];

export const GameSettingsSection: React.FC<GameSettingsSectionProps> = ({
  mainFaction,
  serverGroup,
  onFactionChange,
  onServerGroupChange,
}) => {
  return (
    <Card variant="filled">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-3">
          <User className="w-5 h-5 text-primary-400" />
          <h2 className="text-title-lg font-semibold">Game Profile</h2>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <SettingItem
          icon={Shield}
          label="Main Faction"
          description="Used for hero recommendations"
          iconColor="text-tertiary-400"
        >
          <select
            value={mainFaction}
            onChange={(e) => onFactionChange(e.target.value as Faction)}
            className={cn(
              'h-10 px-4 bg-surface-700 border border-border rounded-lg',
              'text-label-lg font-medium',
              'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
              'cursor-pointer transition-all'
            )}
          >
            {factionOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </SettingItem>

        <SettingItem
          icon={Server}
          label="Server Group"
          description="E.g., 100+, S5, etc."
          iconColor="text-gold-400"
        >
          <input
            type="text"
            value={serverGroup}
            onChange={(e) => onServerGroupChange(e.target.value)}
            className={cn(
              'h-10 w-28 px-3 bg-surface-700 border border-border rounded-lg',
              'text-label-lg font-medium text-center',
              'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
              'transition-all'
            )}
            placeholder="S1-10"
          />
        </SettingItem>
      </CardContent>
    </Card>
  );
};
