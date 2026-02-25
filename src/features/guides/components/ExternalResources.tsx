import React from 'react';
import { ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/shared/ui/components/card';
import { cn } from '@/shared/lib/utils';

const resources = [
  { url: 'https://topheroes.info/', label: 'TopHeroes.info', description: 'Comprehensive Guides & Tools' },
  { url: 'https://www.reddit.com/r/TopHeroes', label: 'r/TopHeroes', description: 'Community Discussion' },
  { url: 'https://topheroes1.fandom.com/wiki/Top_Heroes_Wiki', label: 'Top Heroes Wiki', description: 'Hero Database' },
];

export const ExternalResources: React.FC = () => {
  return (
    <Card variant="filled">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-3">
          <ExternalLink className="w-5 h-5 text-primary-400" />
          <h2 className="text-title-lg font-semibold">External Resources</h2>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {resources.map((link) => (
          <a
            key={link.url}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              'flex items-center gap-3 p-4 bg-surface-800/50 rounded-xl',
              'hover:bg-surface-800 transition-colors group border border-transparent hover:border-primary-500/30'
            )}
          >
            <div className="w-10 h-10 rounded-lg bg-primary-500/20 flex items-center justify-center">
              <ExternalLink className="w-5 h-5 text-primary-400" />
            </div>
            <div className="flex-1">
              <p className="text-title-sm font-medium group-hover:text-primary-400 transition-colors">
                {link.label}
              </p>
              <p className="text-body-sm text-muted-foreground">{link.description}</p>
            </div>
          </a>
        ))}
      </CardContent>
    </Card>
  );
};
