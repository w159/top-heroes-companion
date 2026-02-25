import React from 'react';
import { Info, Globe, HelpCircle, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader } from '../../../shared/ui/components/card';
import { Badge } from '../../../shared/ui/components/badge';
import { cn } from '../../../shared/lib/utils';

export const AboutSection: React.FC = () => {
  return (
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
            <div className="w-10 h-10 rounded-lg bg-tertiary-500/20 flex items-center justify-center">
              <Globe className="w-5 h-5 text-tertiary-400" />
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
          Made with {'\u2764\uFE0F'} by the TBB Guild Community
        </p>
      </CardContent>
    </Card>
  );
};
