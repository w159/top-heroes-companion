import React from 'react';
import { Clock, Calendar, Swords, Zap as Lightning } from 'lucide-react';
import { Card } from '../../../shared/ui/components/card';

interface EventHeaderProps {
  resetCountdown: string;
  activeCount: number;
  upcomingCount: number;
}

const EventHeader: React.FC<EventHeaderProps> = ({ resetCountdown, activeCount, upcomingCount }) => {
  return (
    <div className="rounded-3xl bg-gradient-to-br from-tertiary-500/10 via-primary-500/5 to-surface-900 border border-tertiary-500/20 p-6 sm:p-8">
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center gap-6 mb-6">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-tertiary-500 to-primary-500 flex items-center justify-center shadow-lg shadow-tertiary-500/30">
            <Swords className="w-10 h-10 text-white" />
          </div>
          <div>
            <h1 className="text-headline-lg sm:text-display-sm font-bold bg-gradient-to-r from-white via-tertiary-300 to-primary-300 bg-clip-text text-transparent">
              Event Command Center
            </h1>
            <p className="text-body-md text-muted-foreground mt-1">
              Tactical briefings • Strategic planning • Victory optimization
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card variant="filled" className="p-4 border border-border/50 hover:border-primary-500/50 transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary-500/20 flex items-center justify-center">
                <Clock className="w-6 h-6 text-primary-400" />
              </div>
              <div>
                <p className="text-label-sm text-muted-foreground uppercase tracking-wider">Next Reset</p>
                <p className="text-title-lg font-bold font-mono">{resetCountdown}</p>
              </div>
            </div>
          </Card>

          <Card variant="filled" className="p-4 border border-primary-500/30 hover:border-primary-500/50 transition-colors shadow-sm shadow-primary-500/20">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary-500/20 flex items-center justify-center">
                <Lightning className="w-6 h-6 text-primary-400" />
              </div>
              <div>
                <p className="text-label-sm text-muted-foreground uppercase tracking-wider">Active Events</p>
                <p className="text-title-lg font-bold text-primary-400">{activeCount}</p>
              </div>
            </div>
          </Card>

          <Card variant="filled" className="p-4 border border-gold-500/30 hover:border-gold-500/50 transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gold-500/20 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-gold-400" />
              </div>
              <div>
                <p className="text-label-sm text-muted-foreground uppercase tracking-wider">Upcoming</p>
                <p className="text-title-lg font-bold text-gold-400">{upcomingCount}</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EventHeader;
