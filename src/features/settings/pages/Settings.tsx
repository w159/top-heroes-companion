import React, { useState } from 'react';
import { useUserData } from '@/shared/utils';
import { Settings as SettingsIcon } from 'lucide-react';
import { Faction } from '@/shared/types';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/shared/ui/components/alert-dialog';
import { GameSettingsSection } from '../components/GameSettingsSection';
import { DataManagementSection } from '../components/DataManagementSection';
import { AboutSection } from '../components/AboutSection';

const Settings: React.FC = () => {
  const { data, updateSettings, saveData } = useUserData();
  const [resetDialogOpen, setResetDialogOpen] = useState(false);

  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `topheroes_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();

    toast.success("Data exported successfully!");
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
              toast.success("Data imported successfully!");
              window.location.reload();
            } else {
              toast.error("Invalid file format");
            }
          } catch {
            toast.error("Error parsing file");
          }
        }
      };
    }
  };

  const handleReset = () => {
    setResetDialogOpen(true);
  };

  const confirmReset = () => {
    localStorage.clear();
    window.location.reload();
  };

  const handleFactionChange = (faction: Faction) => {
    updateSettings({ ...data.settings, mainFaction: faction });
  };

  const handleServerGroupChange = (serverGroup: string) => {
    updateSettings({ ...data.settings, serverGroup });
  };

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

      <GameSettingsSection
        mainFaction={data.settings.mainFaction}
        serverGroup={data.settings.serverGroup}
        onFactionChange={handleFactionChange}
        onServerGroupChange={handleServerGroupChange}
      />

      <DataManagementSection
        onExport={handleExport}
        onImport={handleImport}
        onReset={handleReset}
      />

      <AboutSection />

      <AlertDialog open={resetDialogOpen} onOpenChange={setResetDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reset All Data</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure? This will delete all your roster data and redeemed codes. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmReset}
              className="bg-error-500 hover:bg-error-600 text-white"
            >
              Reset All Data
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Settings;
