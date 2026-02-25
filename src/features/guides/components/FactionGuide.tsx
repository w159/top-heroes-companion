import React from 'react';
import { Target, Star } from 'lucide-react';
import { Card, CardContent } from '../../../shared/ui/components/card';
import { Badge } from '../../../shared/ui/components/badge';
import gameGuides from '../../../data/gameGuides.json';

export const FactionGuide: React.FC = () => {
  return (
    <div className="space-y-4 pt-4">
      {/* System Info */}
      <div className="bg-primary-500/10 border-2 border-primary-500/30 rounded-xl p-4">
        <div className="flex items-center gap-3 mb-2">
          <Target className="w-5 h-5 text-primary-400" />
          <h3 className="text-title-md font-semibold">{gameGuides.factionGuide.system.name}</h3>
        </div>
        <p className="text-body-md text-muted-foreground mb-2">
          {gameGuides.factionGuide.system.description}
        </p>
        <Badge variant="primary" size="sm">
          {gameGuides.factionGuide.system.damageBonus}
        </Badge>
      </div>

      {/* Factions */}
      {gameGuides.factionGuide.factions.map((faction) => (
        <Card key={faction.name} variant="outlined" className="overflow-hidden">
          <CardContent className="p-4">
            <h3 className="text-headline-sm font-bold mb-2">{faction.name}</h3>
            <p className="text-body-md text-muted-foreground mb-4">
              {faction.description}
            </p>

            {/* Key Hero */}
            <div className="bg-gold-500/10 border border-gold-500/30 rounded-xl p-4 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-4 h-4 text-gold-400" />
                <span className="text-label-lg font-semibold text-gold-400">
                  KEY HERO: {faction.keyHero.name}
                </span>
              </div>
              <p className="text-body-sm mb-1">Role: {faction.keyHero.role}</p>
              <p className="text-body-sm text-muted-foreground">{faction.keyHero.description}</p>
            </div>

            {/* Strengths & Weaknesses */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div className="bg-success-500/10 rounded-xl p-4">
                <h4 className="text-label-lg font-semibold text-success-400 mb-3">{'\u2713'} Strengths</h4>
                <ul className="space-y-2">
                  {faction.strengths.map((strength, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-body-sm text-muted-foreground">
                      <span className="text-success-400">{'\u2022'}</span>
                      {strength}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-error-500/10 rounded-xl p-4">
                <h4 className="text-label-lg font-semibold text-error-400 mb-3">{'\u2717'} Weaknesses</h4>
                <ul className="space-y-2">
                  {faction.weaknesses.map((weakness, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-body-sm text-muted-foreground">
                      <span className="text-error-400">{'\u2022'}</span>
                      {weakness}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Lineup */}
            <div className="bg-surface-800 rounded-xl p-4 mb-4">
              <h4 className="text-label-lg font-semibold mb-3">Recommended Lineup</h4>
              <div className="grid grid-cols-3 gap-3 text-body-sm">
                <div>
                  <span className="text-muted-foreground">Front:</span>
                  <p className="font-medium">{faction.recommendedLineup.front.join(', ')}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Middle:</span>
                  <p className="font-medium">{faction.recommendedLineup.middle.join(', ')}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Back:</span>
                  <p className="font-medium">{faction.recommendedLineup.back.join(', ')}</p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 text-body-sm">
              <div><span className="text-muted-foreground">Cost:</span> <span className="font-medium">{faction.buildingCost}</span></div>
              <div><span className="text-muted-foreground">Best For:</span> <span className="font-medium">{faction.bestFor.join(', ')}</span></div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
