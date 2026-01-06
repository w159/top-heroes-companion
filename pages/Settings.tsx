import React from 'react';
import { useUserData } from '../utils';
import { Download, Upload, Trash2, Save } from 'lucide-react';
import { Faction } from '../types';

const Settings: React.FC = () => {
  const { data, updateSettings, saveData } = useUserData();

  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `topheroes_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (event.target.files && event.target.files.length > 0) {
        fileReader.readAsText(event.target.files[0], "UTF-8");
        fileReader.onload = (e) => {
            if (e.target?.result) {
                try {
                    const parsedData = JSON.parse(e.target.result as string);
                    // Simple validation check
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

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-display font-bold text-white">Settings</h1>
      
      <div className="bg-bg-secondary border border-border rounded-xl p-6 space-y-6">
          <h2 className="text-xl font-bold text-white border-b border-gray-700 pb-2">Preferences</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                  <label className="block text-sm text-gray-400 mb-2">Main Faction</label>
                  <select 
                    className="w-full bg-bg-tertiary border border-border text-white rounded p-2 focus:border-blue-500 outline-none"
                    value={data.settings.mainFaction}
                    onChange={(e) => updateSettings({...data.settings, mainFaction: e.target.value as Faction})}
                  >
                      <option value="Nature">Nature</option>
                      <option value="League">League</option>
                      <option value="Horde">Horde</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-1">Used for recommendations.</p>
              </div>

               <div>
                  <label className="block text-sm text-gray-400 mb-2">Server Group</label>
                  <input 
                    type="text"
                    className="w-full bg-bg-tertiary border border-border text-white rounded p-2 focus:border-blue-500 outline-none"
                    value={data.settings.serverGroup}
                    onChange={(e) => updateSettings({...data.settings, serverGroup: e.target.value})}
                  />
                  <p className="text-xs text-gray-500 mt-1">E.g., 100+, S5, etc.</p>
              </div>
          </div>
      </div>

      <div className="bg-bg-secondary border border-border rounded-xl p-6 space-y-6">
          <h2 className="text-xl font-bold text-white border-b border-gray-700 pb-2">Data Management</h2>
          
          <div className="flex flex-col md:flex-row gap-4">
              <button onClick={handleExport} className="flex-1 bg-blue-700 hover:bg-blue-600 text-white py-3 rounded-lg flex items-center justify-center font-semibold">
                  <Download className="mr-2" size={20} /> Export Backup
              </button>
              
              <div className="flex-1 relative">
                  <input 
                    type="file" 
                    accept=".json" 
                    onChange={handleImport}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <button className="w-full h-full bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg flex items-center justify-center font-semibold pointer-events-none">
                     <Upload className="mr-2" size={20} /> Import Backup
                  </button>
              </div>
          </div>

          <div className="pt-4 border-t border-gray-800">
               <button onClick={handleReset} className="text-red-500 hover:text-red-400 text-sm flex items-center">
                   <Trash2 size={16} className="mr-1" /> Reset All Data
               </button>
          </div>
      </div>
    </div>
  );
};

export default Settings;
