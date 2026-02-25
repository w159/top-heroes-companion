
import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Hero, UserHero } from '../../../shared/types';
import { FACTION_COLORS, FACTION_BG } from '../../../shared/types/constants';
import { Star, Shield, Sword, Heart, Zap, Crosshair } from 'lucide-react';

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

  const rarityColor = {
    Mythic: 'text-orange-500 border-orange-500/50 bg-orange-900/10',
    Legendary: 'text-yellow-500 border-yellow-500/50 bg-yellow-900/10',
    Epic: 'text-purple-500 border-purple-500/50 bg-purple-900/10',
    Rare: 'text-blue-400 border-blue-400/50 bg-blue-900/10',
  };

  const getRoleIcon = (role: string) => {
    switch(role) {
        case 'Tank': return <Shield size={12} />;
        case 'DPS':
        case 'Damage Dealer': return <Sword size={12} />;
        case 'Support':
        case 'Supporter': return <Heart size={12} />;
        case 'Healer': return <Zap size={12} />;
        case 'Controller': return <Crosshair size={12} />;
        default: return <Star size={12} />;
    }
  };

  // Advanced Image Loading Strategy
  // 1. Local image (primary - fast and reliable)
  // 2. User provided imageUrl (if present)
  // 3. topheroes.info assets (fallback)
  // 4. Fandom Wiki assets (fallback)
  // 5. UI Avatars (Final fallback)

  const formattedSlug = (hero.id || hero.name).toLowerCase().replace(/\s+/g, '-');
  const localImage = hero.image || hero.imageUrl;
  const topHeroesInfoUrl = `https://topheroes.info/assets/img/hero/avatars/${formattedSlug}.webp`;
  const topHeroesAltUrl = `https://topheroes.info/assets/heroes/${formattedSlug}.webp`;
  const wikiImageUrl = `https://topheroes1.fandom.com/wiki/Special:FilePath/${hero.name.replace(/\s+/g, '_')}.png`;
  const placeholderImage = `https://ui-avatars.com/api/?name=${hero.name.replace(/\s+/g, '+')}&background=1f2937&color=fff&size=256`;

  const imageSources = useMemo(() => {
    const sources = [localImage, topHeroesInfoUrl, topHeroesAltUrl, wikiImageUrl, placeholderImage]
      .filter((src): src is string => Boolean(src));
    return sources.filter((src, index) => sources.indexOf(src) === index);
  }, [localImage, topHeroesInfoUrl, topHeroesAltUrl, wikiImageUrl, placeholderImage]);

  const [imgSrc, setImgSrc] = useState(imageSources[0]);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    setImgSrc(imageSources[0]);
    setAttempt(0);
  }, [hero.id, imageSources]);

  const handleError = () => {
    const nextAttempt = attempt + 1;
    if (nextAttempt < imageSources.length) {
      setImgSrc(imageSources[nextAttempt]);
      setAttempt(nextAttempt);
    }
  };

  const CardContent = () => (
    <>
      <div className="flex justify-between items-start mb-2">
        <div className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest border ${rarityColor[hero.rarity]}`}>
          {hero.rarity}
        </div>
        <div className={`p-1 rounded-full ${FACTION_COLORS[hero.faction]} border ${FACTION_BG[hero.faction]} bg-opacity-20`}>
          {getRoleIcon(hero.role)}
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center text-center">
        <div className={`w-20 h-20 rounded-2xl border-2 overflow-hidden mb-3 relative shadow-inner group-hover:scale-105 transition-transform duration-500 ${FACTION_COLORS[hero.faction]} bg-gray-900`}>
             <img 
               src={imgSrc} 
               alt={hero.name}
               className="w-full h-full object-cover"
               loading="lazy"
               onError={handleError}
             />
             <div className={`absolute inset-0 bg-gradient-to-t from-black/40 to-transparent`}></div>
        </div>
        
        <h3 className="text-sm font-black text-gray-100 leading-tight truncate w-full px-1">{hero.name}</h3>
        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-0.5">{hero.role}</p>
        
        {isUserHero(hero) && (
            <div className="mt-2 flex items-center justify-center space-x-2 w-full">
                <div className="bg-black/40 px-2 py-0.5 rounded border border-gray-800 text-[10px] font-mono">
                  <span className="text-gray-500 mr-1">L</span><span className="text-white font-bold">{hero.level}</span>
                </div>
                <div className="bg-black/40 px-2 py-0.5 rounded border border-gray-800 text-[10px] font-mono flex items-center">
                  <span className="text-yellow-500 font-bold mr-1">{hero.stars}</span> <Star size={8} fill="currentColor" className="text-yellow-500" />
                </div>
            </div>
        )}

         {!isUserHero(hero) && (
             <div className={`mt-2 text-[10px] font-black px-2 py-0.5 rounded-full border tracking-tighter ${hero.tier === 'S' ? 'border-orange-500/40 text-orange-500 bg-orange-500/5' : 'border-gray-800 text-gray-500'}`}>
                 GRADE {hero.tier}
             </div>
         )}
      </div>
    </>
  );

  return (
    <div className={`relative rounded-2xl border transition-all duration-300 flex flex-col h-full group overflow-hidden ${isOwned ? 'border-gray-700 bg-bg-secondary hover:border-blue-500/50' : 'border-dashed border-gray-800 bg-bg-tertiary/50 hover:bg-bg-tertiary opacity-90 hover:opacity-100 hover:border-gray-600'} p-3 shadow-lg hover:shadow-2xl`}>
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
        <div className="mt-3 pt-2 border-t border-gray-800/50">
             <button
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onAction();
                }}
                className={`w-full py-2 rounded-xl flex items-center justify-center text-[10px] font-black uppercase tracking-widest transition-all ${
                    isOwned 
                    ? 'bg-red-900/20 text-red-500 hover:bg-red-900/40 border border-red-900/30' 
                    : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/20 active:scale-95'
                }`}
            >
                {isOwned ? 'Discharge' : actionLabel || 'Assign'}
            </button>
        </div>
      )}
    </div>
  );
};

export default HeroCard;
