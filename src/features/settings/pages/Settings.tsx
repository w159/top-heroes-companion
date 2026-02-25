import React, { useState } from 'react';
import { useUserData } from '../../../shared/utils';
import { Settings as SettingsIcon, Save } from 'lucide-react';
import { Faction } from '../../../shared/types';
import { GameSettingsSection } from '../components/GameSettingsSection';
import { DataManagementSection } from '../components/DataManagementSection';
import { AboutSection } from '../components/AboutSection';

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

      {/* Success Toast */}
      {showSuccessMessage && (
        <div className="fixed top-4 right-4 z-50 bg-success-500 text-white px-6 py-3 rounded-xl shadow-lg shadow-success-500/30 animate-in flex items-center gap-2">
          <Save className="w-5 h-5" />
          Data exported successfully!
        </div>
      )}

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
    </div>
  );
};

export default Settings;
