import React from 'react';
import { User, Shield, Server } from 'lucide-react';
import { Faction } from '@/shared/types';
import { Card, CardContent, CardHeader } from '@/shared/ui/components/card';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/shared/ui/components/select';
import { Input } from '@/shared/ui/components/input';
import { SettingItem } from './SettingItem';

interface GameSettingsSectionProps {
  mainFaction: string;
  serverGroup: string;
  onFactionChange: (faction: Faction) => void;
  onServerGroupChange: (serverGroup: string) => void;
}

const factionOptions = [
  { value: 'Nature', label: 'Nature' },
  { value: 'League', label: 'League' },
  { value: 'Horde', label: 'Horde' },
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
          <Select value={mainFaction} onValueChange={(v) => onFactionChange(v as Faction)}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Select faction" />
            </SelectTrigger>
            <SelectContent>
              {factionOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </SettingItem>

        <SettingItem
          icon={Server}
          label="Server Group"
          description="E.g., 100+, S5, etc."
          iconColor="text-gold-400"
        >
          <Input
            type="text"
            value={serverGroup}
            onChange={(e) => onServerGroupChange(e.target.value)}
            className="w-28 text-center"
            placeholder="S1-10"
          />
        </SettingItem>
      </CardContent>
    </Card>
  );
};
