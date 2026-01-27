import React, { useState } from 'react';
import { useUserData } from '../../../shared/utils';
import {
  Download, Upload, Trash2, Save, Settings as SettingsIcon,
  User, Server, Bell, Palette, Shield, ChevronRight, Moon,
  Sun, Globe, HelpCircle, Info, ExternalLink
} from 'lucide-react';
import { Faction } from '../../../shared/types';
import { Card, CardContent, CardHeader } from '../../../shared/ui/components/card';
import { Button } from '../../../shared/ui/components/button';
import { Badge } from '../../../shared/ui/components/badge';
import { Input } from '../../../shared/ui/components/input';
import { cn } from '../../../shared/lib/utils';

interface SettingItemProps {
  icon: React.ElementType;
  label: string;
  description?: string;
  children: React.ReactNode;
  iconColor?: string;
}

const SettingItem: React.FC<SettingItemProps> = ({
  icon: Icon,
  label,
  description,
  children,
  iconColor = 'text-primary-400'
}) => (
  <div className="flex items-start sm:items-center justify-between gap-4 p-4 bg-surface-800/50 rounded-xl hover:bg-surface-800 transition-colors">
    <div className="flex items-start sm:items-center gap-4 flex-1 min-w-0">
      <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0', 'bg-surface-700')}>
        <Icon className={cn('w-5 h-5', iconColor)} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-title-sm font-medium">{label}</p>
        {description && (
          <p className="text-body-sm text-muted-foreground mt-0.5">{description}</p>
        )}
      </div>
    </div>
    <div className="flex-shrink-0">{children}</div>
  </div>
);

const Settings: React.FC = () => {
  const { data, updateSettings, saveData } = useUserData();
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `topheroes_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();

    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 3000);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (event.target.files && event.target.files.length > 0) {
      fileReader.readAsText(event.target.files[0], "UTF-8");
      fileReader.onload = (e) => {
        if (e.target?.result) {
          try {
            const parsedData = JSON.parse(e.target.result as string);
            if (parsedData.roster && Array.isArray(parsedData.roster)) {
              saveData(parsedData);
              alert("Data imported successfully!");
              window.location.reload();
            } else {
              alert("Invalid file format.");
            }
          } catch (error) {
            alert("Error parsing file.");
          }
        }
      };
    }
  };

  const handleReset = () => {
    if (confirm("Are you sure? This will delete all your roster data and redeemed codes.")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  const factionOptions = [
    { value: 'Nature', label: 'Nature', color: 'text-success-400' },
    { value: 'League', label: 'League', color: 'text-primary-400' },
    { value: 'Horde', label: 'Horde', color: 'text-error-400' },
  ];

  return (
    <div className="space-y-6 animate-in">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-lg shadow-primary-500/30">
          <SettingsIcon className="w-7 h-7 text-white" />
        </div>
        <div>
          <h1 className="text-headline-lg font-bold">Settings</h1>
          <p className="text-body-md text-muted-foreground">Customize your experience</p>
        </div>
      </div>

      {/* Success Toast */}
      {showSuccessMessage && (
        <div className="fixed top-4 right-4 z-50 bg-success-500 text-white px-6 py-3 rounded-xl shadow-lg shadow-success-500/30 animate-in flex items-center gap-2">
          <Save className="w-5 h-5" />
          Data exported successfully!
        </div>
      )}

      {/* Profile & Preferences */}
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
              value={data.settings.mainFaction}
              onChange={(e) => updateSettings({ ...data.settings, mainFaction: e.target.value as Faction })}
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
              value={data.settings.serverGroup}
              onChange={(e) => updateSettings({ ...data.settings, serverGroup: e.target.value })}
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

      {/* Data Management */}
      <Card variant="filled">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-3">
            <Save className="w-5 h-5 text-primary-400" />
            <h2 className="text-title-lg font-semibold">Data Management</h2>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-body-md text-muted-foreground">
            Your data is stored locally on this device. Export backups regularly to prevent data loss.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Button
              variant="tonal"
              size="lg"
              onClick={handleExport}
              className="w-full justify-start"
            >
              <Download className="w-5 h-5" />
              <span className="flex-1 text-left">Export Backup</span>
              <Badge variant="primary" size="sm">JSON</Badge>
            </Button>

            <div className="relative">
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <Button
                variant="outlined"
                size="lg"
                className="w-full justify-start pointer-events-none"
              >
                <Upload className="w-5 h-5" />
                <span className="flex-1 text-left">Import Backup</span>
              </Button>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="pt-4 mt-4 border-t border-border">
            <div className="bg-error-500/10 border border-error-500/30 rounded-xl p-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-error-500/20 flex items-center justify-center flex-shrink-0">
                  <Trash2 className="w-5 h-5 text-error-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-title-sm font-semibold text-error-400">Danger Zone</h3>
                  <p className="text-body-sm text-muted-foreground mt-1">
                    This action cannot be undone. All your roster data and redeemed codes will be permanently deleted.
                  </p>
                  <Button
                    variant="text"
                    size="sm"
                    onClick={handleReset}
                    className="mt-3 text-error-400 hover:bg-error-500/20"
                  >
                    <Trash2 className="w-4 h-4" />
                    Reset All Data
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* About Section */}
      <Card variant="filled">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-3">
            <Info className="w-5 h-5 text-primary-400" />
            <h2 className="text-title-lg font-semibold">About</h2>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between p-4 bg-surface-800/50 rounded-xl">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-tertiary-500 flex items-center justify-center">
                <span className="text-xl font-bold text-white">TH</span>
              </div>
              <div>
                <p className="text-title-md font-semibold">Top Heroes Companion</p>
                <p className="text-body-sm text-muted-foreground">Version 2.0.0</p>
              </div>
            </div>
            <Badge variant="success" size="sm">TBB Guild</Badge>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <a
              href="https://discord.gg/tbbtopheroes"
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                'flex items-center gap-3 p-4 bg-surface-800/50 rounded-xl',
                'hover:bg-surface-800 transition-colors group'
              )}
            >
              <div className="w-10 h-10 rounded-lg bg-[#5865F2]/20 flex items-center justify-center">
                <Globe className="w-5 h-5 text-[#5865F2]" />
              </div>
              <div className="flex-1">
                <p className="text-title-sm font-medium">Join Discord</p>
                <p className="text-body-sm text-muted-foreground">Get help & updates</p>
              </div>
              <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary-400 transition-colors" />
            </a>

            <a
              href="https://github.com/topheroes-companion"
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                'flex items-center gap-3 p-4 bg-surface-800/50 rounded-xl',
                'hover:bg-surface-800 transition-colors group'
              )}
            >
              <div className="w-10 h-10 rounded-lg bg-surface-700 flex items-center justify-center">
                <HelpCircle className="w-5 h-5 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <p className="text-title-sm font-medium">Help & Support</p>
                <p className="text-body-sm text-muted-foreground">Report issues</p>
              </div>
              <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary-400 transition-colors" />
            </a>
          </div>

          <p className="text-body-sm text-muted-foreground text-center pt-4">
            Made with ❤️ by the TBB Guild Community
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
