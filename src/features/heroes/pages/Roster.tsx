import React, { useState } from 'react';
import { useUserData, calculateHeroPower } from '../../../shared/utils';
import HeroCard from '../components/HeroCard';
import { X, Star, Save, Users, AlertTriangle, Database, Pencil } from 'lucide-react';
import { Card, CardContent } from '../../../shared/ui/components/card';
import { Button } from '../../../shared/ui/components/button';
import { Badge } from '../../../shared/ui/components/badge';
import { cn } from '../../../shared/lib/utils';
import { UserHero } from '../../../shared/types';

const Roster: React.FC = () => {
  const { data, updateHero, removeFromRoster, isLoaded } = useUserData();
  const [editingHeroId, setEditingHeroId] = useState<string | null>(null);

  const [editLevel, setEditLevel] = useState(1);
  const [editStars, setEditStars] = useState(0);

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  const startEdit = (hero: UserHero) => {
    setEditingHeroId(hero.id);
    setEditLevel(hero.level);
    setEditStars(hero.stars);
  };

  const saveEdit = (hero: UserHero) => {
    updateHero({ ...hero, level: editLevel, stars: editStars });
    setEditingHeroId(null);
  };

  const handleRemove = (heroId: string, heroName: string) => {
    if (window.confirm(`Are you sure you want to remove ${heroName} from your roster?`)) {
      removeFromRoster(heroId);
    }
  };

  return (
    <div className="space-y-6 animate-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-lg shadow-primary-500/30">
            <Users className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-headline-lg font-bold">My Roster</h1>
            <p className="text-body-md text-muted-foreground">
              Manage your hero collection
            </p>
          </div>
        </div>
        <Badge variant="primary" size="md" className="text-title-md">
          {data.roster.length} Heroes
        </Badge>
      </div>

      {data.roster.length === 0 ? (
        <Card variant="outlined" className="text-center py-16 border-dashed">
          <Database className="w-16 h-16 mx-auto mb-4 text-muted-foreground/30" />
          <h3 className="text-headline-sm font-medium mb-2">Your roster is empty</h3>
          <p className="text-body-md text-muted-foreground mb-6">
            Head to the Heroes page to add heroes you own.
          </p>
          <Button variant="filled" asChild>
            <a href="#/heroes">Go to Heroes</a>
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {data.roster.map(hero => (
            <div key={hero.id} className="relative group">
              <Card variant="filled" className="overflow-hidden">
                <HeroCard
                  hero={hero}
                  isOwned={true}
                  onAction={() => handleRemove(hero.id, hero.name)}
                />

                {/* Edit Button */}
                <button
                  className={cn(
                    'absolute top-3 right-14 z-10',
                    'p-2 bg-surface-800/90 backdrop-blur-sm rounded-lg',
                    'border border-border hover:border-primary-500',
                    'text-muted-foreground hover:text-primary-400',
                    'transition-all duration-200'
                  )}
                  onClick={(e) => {
                    e.preventDefault();
                    startEdit(hero);
                  }}
                >
                  <Pencil className="w-4 h-4" />
                </button>
              </Card>

              {/* Edit Modal Overlay */}
              {editingHeroId === hero.id && (
                <div className="absolute inset-0 z-20 animate-in">
                  <Card variant="filled" className="h-full border-2 border-primary-500 flex flex-col">
                    <CardContent className="flex-1 p-4 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-4 pb-3 border-b border-border">
                          <h4 className="text-title-md font-semibold">Edit {hero.name}</h4>
                          <button
                            onClick={(e) => { e.stopPropagation(); setEditingHeroId(null); }}
                            className="p-1.5 rounded-lg bg-surface-700 hover:bg-surface-600 text-muted-foreground hover:text-foreground transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <label className="text-label-sm text-muted-foreground block mb-2">Level</label>
                            <input
                              type="number"
                              className={cn(
                                'w-full h-10 px-3 bg-surface-800 border border-border rounded-lg',
                                'text-title-sm font-medium',
                                'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
                                'transition-all'
                              )}
                              value={editLevel}
                              onChange={(e) => setEditLevel(parseInt(e.target.value) || 0)}
                            />
                          </div>

                          <div>
                            <label className="text-label-sm text-muted-foreground block mb-2">
                              Stars ({editStars})
                            </label>
                            <div className="flex items-center gap-3">
                              <input
                                type="range"
                                min="0" max="10"
                                className="flex-1 accent-gold-500"
                                value={editStars}
                                onChange={(e) => setEditStars(parseInt(e.target.value))}
                              />
                              <div className="flex items-center gap-1">
                                <Star className="w-5 h-5 text-gold-400" fill="currentColor" />
                                <span className="text-title-md font-bold text-gold-400 w-6 text-right">
                                  {editStars}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2 mt-4">
                        <Button
                          variant="filled"
                          size="md"
                          onClick={(e) => { e.stopPropagation(); saveEdit(hero); }}
                          className="flex-1 bg-success-500 hover:bg-success-400"
                        >
                          <Save className="w-4 h-4" />
                          Save
                        </Button>
                        <Button
                          variant="outlined"
                          size="md"
                          onClick={(e) => { e.stopPropagation(); setEditingHeroId(null); }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Roster;
