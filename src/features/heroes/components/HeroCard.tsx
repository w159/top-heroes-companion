
import React from 'react';
import { Link } from 'react-router-dom';
import { Hero, UserHero } from '@/shared/types';
import { FACTION_COLORS, FACTION_BG } from '@/shared/types/constants';
import { Star } from 'lucide-react';
import { Button } from '@/shared/ui/components/button';
import { Badge } from '@/shared/ui/components/badge';
import { cn, getRarityColor, getRarityBorderColor, getRoleIcon } from '@/shared/lib/utils';
import { useHeroImage } from '@/shared/hooks';

interface HeroCardProps {
  hero: Hero | UserHero;
  isOwned?: boolean;
  onAction?: () => void;
  actionLabel?: string;
  disableLink?: boolean;
}

const HeroCard: React.FC<HeroCardProps> = ({ hero, isOwned, onAction, actionLabel, disableLink }) => {
  const isUserHero = (h: Hero | UserHero): h is UserHero => {
    return (h as UserHero).level !== undefined;
  };

  const RoleIcon = getRoleIcon(hero.role);

  const { imgSrc, handleError } = useHeroImage({
    heroId: hero.id,
    heroName: hero.name,
    primaryImage: hero.image || hero.imageUrl,
  });

  const CardContent = () => (
    <>
      <div className="flex justify-between items-start mb-2">
        <Badge
          size="sm"
          className={cn(
            'border font-black uppercase tracking-widest',
            getRarityColor(hero.rarity),
            getRarityBorderColor(hero.rarity),
            'bg-transparent'
          )}
        >
          {hero.rarity}
        </Badge>
        <div className={`p-1 rounded-full ${FACTION_COLORS[hero.faction]} border ${FACTION_BG[hero.faction]} bg-opacity-20`}>
          <RoleIcon size={12} />
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center text-center">
        <div className={`w-20 h-20 rounded-2xl border-2 overflow-hidden mb-3 relative shadow-inner group-hover:scale-105 transition-transform duration-500 ${FACTION_COLORS[hero.faction]} bg-surface-900`}>
             <img
               src={imgSrc}
               alt={hero.name}
               className="w-full h-full object-cover"
               loading="lazy"
               onError={handleError}
             />
             <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        </div>

        <h3 className="text-body-sm font-black text-foreground leading-tight truncate w-full px-1">{hero.name}</h3>
        <p className="text-label-sm font-bold text-muted-foreground uppercase tracking-widest mt-0.5">{hero.role}</p>

        {isUserHero(hero) && (
            <div className="mt-2 flex items-center justify-center space-x-2 w-full">
                <div className="bg-black/40 px-2 py-0.5 rounded border border-surface-700 text-label-sm font-mono">
                  <span className="text-muted-foreground mr-1">L</span><span className="text-white font-bold">{hero.level}</span>
                </div>
                <div className="bg-black/40 px-2 py-0.5 rounded border border-surface-700 text-label-sm font-mono flex items-center">
                  <span className="text-warning-400 font-bold mr-1">{hero.stars}</span> <Star size={8} fill="currentColor" className="text-warning-400" />
                </div>
            </div>
        )}

         {!isUserHero(hero) && (
             <div className={cn(
               'mt-2 text-label-sm font-black px-2 py-0.5 rounded-full border tracking-tighter',
               hero.tier === 'S'
                 ? 'border-error-500/40 text-error-400 bg-error-500/5'
                 : 'border-surface-700 text-muted-foreground'
             )}>
                 GRADE {hero.tier}
             </div>
         )}
      </div>
    </>
  );

  return (
    <div className={cn(
      'relative rounded-2xl border transition-all duration-300 flex flex-col h-full group overflow-hidden p-3 shadow-lg hover:shadow-2xl',
      isOwned
        ? 'border-surface-600 bg-surface-800/80 hover:border-primary-500/50'
        : 'border-dashed border-surface-700 bg-surface-900/50 hover:bg-surface-900 opacity-90 hover:opacity-100 hover:border-surface-500'
    )}>
      {disableLink ? (
        <div className="cursor-default h-full">
            <CardContent />
        </div>
      ) : (
        <Link to={`/heroes/${hero.id}`} className="block h-full cursor-pointer rounded-xl">
            <CardContent />
        </Link>
      )}

      {onAction && (
        <div className="mt-3 pt-2 border-t border-surface-700/50">
          <Button
            variant={isOwned ? 'destructive' : 'filled'}
            size="sm"
            onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onAction();
            }}
            className={cn(
              'w-full text-label-sm font-black uppercase tracking-widest',
              isOwned && 'bg-error-900/20 text-error-400 hover:bg-error-900/40 border border-error-900/30'
            )}
          >
            {isOwned ? 'Discharge' : actionLabel || 'Assign'}
          </Button>
        </div>
      )}
    </div>
  );
};

export default HeroCard;
