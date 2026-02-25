import React from 'react';
import { Download, Upload, Trash2, Save } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/shared/ui/components/card';
import { Button } from '@/shared/ui/components/button';
import { Badge } from '@/shared/ui/components/badge';

interface DataManagementSectionProps {
  onExport: () => void;
  onImport: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onReset: () => void;
}

export const DataManagementSection: React.FC<DataManagementSectionProps> = ({
  onExport,
  onImport,
  onReset,
}) => {
  return (
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
            variant="secondary"
            size="lg"
            onClick={onExport}
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
              onChange={onImport}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            <Button
              variant="outline"
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
                  variant="link"
                  size="sm"
                  onClick={onReset}
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
  );
};
