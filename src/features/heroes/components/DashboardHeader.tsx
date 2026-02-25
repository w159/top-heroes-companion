import React from 'react';
import { Shield, ArrowUpRight } from 'lucide-react';
import { Button } from '../../../shared/ui/components/button';

interface DashboardHeaderProps {
  serverGroup: string;
  mainFaction: string;
  onViewHeroes: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ serverGroup, mainFaction, onViewHeroes }) => (
  <div className="relative overflow-hidden rounded-xl border border-primary-800/20">
    {/* Background layers */}
    <div className="absolute inset-0 bg-gradient-to-br from-primary-900/50 via-surface-900 to-surface-950" />
    <div className="absolute inset-0 bg-forge-radial opacity-40" />
    <div className="absolute top-0 right-0 w-2/3 h-full bg-gradient-to-l from-primary-500/8 to-transparent" />
    <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-500/30 to-transparent" />

    <div className="relative z-10 p-6 md:p-8">
      <p className="text-label-md text-primary-500/80 uppercase tracking-[0.2em] font-medium mb-2">
        Welcome Back, Commander
      </p>
      <h1 className="text-display-sm font-heading font-semibold text-gradient mb-2">Command Center</h1>
      <p className="text-body-lg text-muted-foreground">
        Server {serverGroup} &bull; {mainFaction} Faction
      </p>

      <Button
        variant="gold"
        size="lg"
        className="mt-6"
        onClick={onViewHeroes}
      >
        <Shield className="w-5 h-5" />
        View Heroes
        <ArrowUpRight className="w-4 h-4" />
      </Button>
    </div>
  </div>
);

export default DashboardHeader;
