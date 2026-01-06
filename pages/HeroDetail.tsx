
import React, { useEffect, useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { HEROES, FACTION_COLORS, FACTION_BG } from '../constants';
import { useUserData } from '../utils';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer 
} from 'recharts';
import { 
  ArrowLeft, Shield, Sword, Heart, Star, Zap, Crosshair, 
  Shirt, Sparkles, Gem, Book, Flame, Wind, Anchor, ChevronRight, Activity, 
  Dna, Award, Info, Target, Layers, Link as LinkIcon, Cpu
} from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';

const HeroDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data, isLoaded, addToRoster } = useUserData();

  const hero = HEROES.find(h => h.id === id);

  // Synchronized Multi-step Fallback Strategy
  const formattedName = hero?.name.toLowerCase().replace(/\s+/g, '-') || '';
  const topHeroesInfoUrl = `https://topheroes.info/assets/img/hero/avatars/${formattedName}.webp`;
  const topHeroesAltUrl = `https://topheroes.info/assets/heroes/${formattedName}.webp`;
  const wikiImageUrl = hero ? `https://topheroes1.fandom.com/wiki/Special:FilePath/${hero.name.replace(/\s+/g, '_')}.png` : '';
  const placeholderImage = hero ? `https://ui-avatars.com/api/?name=${hero.name.replace(/\s+/g, '+')}&background=1f2937&color=fff&size=256` : '';
  
  const [imgSrc, setImgSrc] = useState<string>('');
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (hero) {
        setImgSrc(hero.imageUrl || topHeroesInfoUrl);
        setAttempt(0);
    }
  }, [id, hero, topHeroesInfoUrl]);

  const handleImageError = () => {
    if (attempt === 0) {
      setImgSrc(topHeroesAltUrl);
      setAttempt(1);
    } else if (attempt === 1) {
      setImgSrc(wikiImageUrl);
      setAttempt(2);
    } else if (attempt === 2) {
      setImgSrc(placeholderImage);
      setAttempt(3);
    }
  };

  // Radar Chart Data derivation
  const radarData = useMemo(() => {
    if (!hero) return [];
    
    const weights: Record<string, number[]> = {
        'Tank': [95, 40, 30, 80, 50],
        'DPS': [40, 95, 85, 30, 20],
        'Support': [60, 50, 40, 70, 95],
        'Healer': [55, 30, 20, 40, 100],
        'Controller': [65, 60, 50, 90, 70],
        'Hybrid': [75, 75, 60, 60, 60],
    };

    const [def, atk, burst, ctrl, util] = weights[hero.role] || [50, 50, 50, 50, 50];

    return [
      { subject: 'Durability', A: def, fullMark: 100 },
      { subject: 'Attack', A: atk, fullMark: 100 },
      { subject: 'Burst', A: burst, fullMark: 100 },
      { subject: 'Control', A: ctrl, fullMark: 100 },
      { subject: 'Utility', A: util, fullMark: 100 },
    ];
  }, [hero]);

  if (!isLoaded) return <LoadingSpinner />;
  
  if (!hero) {
    return (
        <div className="text-center py-20 flex flex-col items-center">
            <Target size={64} className="text-gray-700 mb-4" />
            <h2 className="text-2xl font-bold text-white">Target Out of Range</h2>
            <p className="text-gray-500 mt-2">The hero ID requested does not exist in our database.</p>
            <Link to="/heroes" className="mt-6 px-6 py-2 bg-blue-600 rounded-lg text-white hover:bg-blue-500 transition-all font-bold">Return to Database</Link>
        </div>
    );
  }

  const userHero = data.roster.find(h => h.id === hero.id);
  const isOwned = !!userHero;

  const getRoleIcon = (role: string) => {
      switch(role) {
          case 'Tank': return <Shield size={20} className="text-blue-400"/>;
          case 'DPS': return <Sword size={20} className="text-red-400"/>;
          case 'Support': return <Heart size={20} className="text-green-400"/>;
          case 'Healer': return <Zap size={20} className="text-yellow-400"/>;
          case 'Controller': return <Crosshair size={20} className="text-purple-400"/>;
          default: return <Star size={20} className="text-gray-400"/>;
      }
  };

  const gearSetMap: Record<string, { icon: any, color: string, bg: string }> = {
    'Guardian': { icon: Shield, color: 'text-teal-400', bg: 'bg-teal-900/10 border-teal-500/30' },
    'Sage': { icon: Book, color: 'text-purple-400', bg: 'bg-purple-900/10 border-purple-500/30' },
    'Warlord': { icon: Sword, color: 'text-orange-400', bg: 'bg-orange-900/10 border-orange-500/30' },
    'Titan': { icon: Anchor, color: 'text-blue-400', bg: 'bg-blue-900/10 border-blue-500/30' },
    'Swift': { icon: Wind, color: 'text-cyan-400', bg: 'bg-cyan-900/10 border-cyan-500/30' },
  };

  return (
    <div className="space-y-6 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <Link to="/heroes" className="flex items-center text-gray-500 hover:text-white transition-colors w-fit group">
          <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Database
      </Link>

      <div className="bg-bg-secondary border border-border rounded-3xl overflow-hidden shadow-2xl">
          <div className="flex flex-col xl:flex-row">
              {/* Profile Sidebar */}
              <div className="w-full xl:w-[400px] bg-bg-secondary p-8 flex flex-col items-center border-b xl:border-b-0 xl:border-r border-border relative">
                  <div className={`absolute inset-0 opacity-5 ${FACTION_BG[hero.faction]} pointer-events-none`}></div>
                  
                  <div className={`w-64 h-64 rounded-3xl border-4 overflow-hidden mb-6 shadow-2xl relative bg-gray-900 z-10 group ${FACTION_COLORS[hero.faction]}`}>
                      <img 
                        src={imgSrc} 
                        alt={hero.name} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        onError={handleImageError}
                      />
                      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/80 to-transparent flex items-end justify-center pb-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-[10px] font-black text-white uppercase tracking-[0.3em]">Commander Record</span>
                      </div>
                  </div>
                  
                  <h1 className="text-5xl font-display font-black text-white text-center mb-2 z-10">{hero.name}</h1>
                  
                  <div className="flex space-x-2 mb-8 z-10">
                      <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                          hero.rarity === 'Mythic' ? 'text-orange-400 border-orange-500/30 bg-orange-500/5' :
                          hero.rarity === 'Legendary' ? 'text-yellow-400 border-yellow-500/30 bg-yellow-500/5' :
                          'text-blue-400 border-blue-500/30 bg-blue-500/5'
                      }`}>
                          {hero.rarity}
                      </div>
                      <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${FACTION_COLORS[hero.faction]} border-opacity-30 bg-opacity-5 ${FACTION_BG[hero.faction]}`}>
                          {hero.faction}
                      </div>
                  </div>

                  {/* Stat Radar */}
                  <div className="w-full h-64 mb-8 z-10 relative">
                     <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
                        <Layers size={140} className="text-gray-500" />
                     </div>
                     <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                            <PolarGrid stroke="#30363D" />
                            <PolarAngleAxis dataKey="subject" tick={{ fill: '#8B949E', fontSize: 10, fontWeight: 'bold' }} />
                            <Radar
                                name={hero.name}
                                dataKey="A"
                                stroke={hero.faction === 'Nature' ? '#8BC34A' : hero.faction === 'League' ? '#64B5F6' : '#EF5350'}
                                fill={hero.faction === 'Nature' ? '#8BC34A' : hero.faction === 'League' ? '#64B5F6' : '#EF5350'}
                                fillOpacity={0.4}
                            />
                        </RadarChart>
                     </ResponsiveContainer>
                  </div>
                  
                  {/* Roster Controls */}
                  <div className="w-full z-10 mt-auto">
                    {isOwned ? (
                        <div className="w-full bg-bg-tertiary border border-border rounded-2xl p-6 text-center shadow-inner">
                            <div className="flex items-center justify-center text-green-400 font-black text-[10px] uppercase tracking-widest mb-4">
                                <Activity size={14} className="mr-2"/> Deployment Ready
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-black/30 p-3 rounded-xl border border-gray-800">
                                    <div className="text-[10px] text-gray-500 font-bold uppercase mb-1">Level</div>
                                    <div className="text-2xl font-mono font-black text-white">{userHero.level}</div>
                                </div>
                                <div className="bg-black/30 p-3 rounded-xl border border-gray-800">
                                    <div className="text-[10px] text-gray-500 font-bold uppercase mb-1">Stars</div>
                                    <div className="text-2xl font-mono font-black text-yellow-500 flex items-center justify-center">
                                        {userHero.stars} <Star size={16} className="ml-1" fill="currentColor" />
                                    </div>
                                </div>
                            </div>
                            <Link to="/roster" className="text-[10px] font-bold text-blue-500 hover:text-blue-400 uppercase tracking-widest mt-6 block transition-colors">Open Roster Settings &rarr;</Link>
                        </div>
                    ) : (
                        <button 
                            onClick={() => addToRoster(hero)}
                            className="w-full py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black uppercase tracking-[0.2em] transition-all shadow-xl shadow-blue-900/20 flex items-center justify-center group"
                        >
                            <Dna size={20} className="mr-3 group-hover:rotate-12 transition-transform" /> Recruit Operation
                        </button>
                    )}
                  </div>
              </div>

              {/* Tactical Content */}
              <div className="flex-1 p-8 lg:p-14 space-y-16">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="bg-bg-tertiary p-8 rounded-3xl border border-border flex items-center shadow-xl group">
                          <div className="p-5 bg-gray-800 rounded-2xl mr-6 text-gray-400 group-hover:scale-110 transition-transform">
                             {getRoleIcon(hero.role)}
                          </div>
                          <div>
                              <div className="text-gray-500 text-[10px] uppercase font-black tracking-[0.3em] mb-1">Combat Role</div>
                              <div className="text-white font-black text-3xl tracking-tight">{hero.role}</div>
                          </div>
                      </div>
                      <div className="bg-bg-tertiary p-8 rounded-3xl border border-border flex items-center shadow-xl group">
                           <div className="p-5 bg-gray-800 rounded-2xl mr-6 text-gray-400 group-hover:scale-110 transition-transform">
                                <Award size={32} className={hero.tier === 'S' ? 'text-orange-500' : 'text-gray-400'} />
                          </div>
                          <div>
                              <div className="text-gray-500 text-[10px] uppercase font-black tracking-[0.3em] mb-1">Command Tier</div>
                              <div className={`text-3xl font-black tracking-tight ${hero.tier === 'S' ? 'text-orange-500' : 'text-white'}`}>
                                  Grade {hero.tier}
                              </div>
                          </div>
                      </div>
                  </div>

                  <div>
                      <h3 className="text-xs font-black text-gray-600 uppercase tracking-[0.4em] mb-6 flex items-center">
                          <Info size={14} className="mr-3" /> Tactical Overview
                      </h3>
                      <p className="text-gray-300 leading-relaxed text-xl italic font-medium bg-bg-tertiary/50 p-6 rounded-2xl border-l-4 border-gray-700">
                          "{hero.description || `A specialist from the ${hero.faction} corps, vital for high-priority ${hero.role.toLowerCase()} missions.`}"
                      </p>
                  </div>

                  {hero.skills && hero.skills.length > 0 && (
                      <div>
                          <h3 className="text-xs font-black text-gray-600 uppercase tracking-[0.4em] mb-8 flex items-center">
                              <Zap size={14} className="mr-3" /> Ability Manifest
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              {hero.skills.map((skill, idx) => (
                                  <div key={idx} className="bg-bg-tertiary p-6 rounded-3xl border border-border hover:border-blue-500/30 transition-all group relative overflow-hidden">
                                      <div className="absolute -bottom-4 -right-4 p-8 opacity-5 group-hover:opacity-10 group-hover:scale-125 transition-all text-blue-400">
                                          {skill.type === 'Ultimate' ? <Flame size={80} /> : <Sparkles size={80} />}
                                      </div>
                                      <div className="flex justify-between items-start mb-4">
                                          <h4 className="font-black text-white text-xl tracking-tight">{skill.name}</h4>
                                          <span className={`text-[9px] uppercase px-2.5 py-1 rounded font-black border ${
                                              skill.type === 'Ultimate' ? 'bg-orange-900/20 text-orange-400 border-orange-900/30' : 
                                              skill.type === 'Passive' ? 'bg-purple-900/20 text-purple-400 border-purple-900/30' : 
                                              'bg-blue-900/20 text-blue-400 border-blue-900/30'
                                          }`}>
                                              {skill.type}
                                          </span>
                                      </div>
                                      <p className="text-sm text-gray-400 leading-relaxed relative z-10">{skill.description}</p>
                                  </div>
                              ))}
                          </div>
                      </div>
                  )}

                  <div>
                      <h3 className="text-xs font-black text-gray-600 uppercase tracking-[0.4em] mb-8 flex items-center">
                          <LinkIcon size={14} className="mr-3" /> Synergy Network
                      </h3>
                      {hero.bonds && hero.bonds.length > 0 ? (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              {hero.bonds.map(bond => {
                                  const partner = HEROES.find(h => h.id === bond.partnerId);
                                  const partnerName = partner?.name || 'Classified';
                                  const formattedPartnerName = partnerName.toLowerCase().replace(/\s+/g, '-');
                                  const partnerPortrait = `https://topheroes.info/assets/img/hero/avatars/${formattedPartnerName}.webp`;
                                  
                                  return (
                                      <Link 
                                        key={bond.partnerId} 
                                        to={`/heroes/${bond.partnerId}`}
                                        className="bg-bg-tertiary p-4 rounded-2xl border border-border hover:border-blue-500/50 transition-all flex items-center group shadow-md"
                                      >
                                          <div className="w-16 h-16 rounded-xl border-2 border-gray-700 overflow-hidden mr-5 flex-shrink-0 bg-gray-800 shadow-lg group-hover:border-blue-500 transition-colors">
                                              <img 
                                                src={partnerPortrait} 
                                                alt={partnerName} 
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                                                onError={(e) => (e.currentTarget.src = `https://ui-avatars.com/api/?name=${partnerName}&background=1f2937&color=fff`)}
                                              />
                                          </div>
                                          <div className="flex-1 truncate">
                                              <div className="text-white font-black text-base truncate mb-1">{partnerName}</div>
                                              <div className="text-green-400 text-[10px] font-black uppercase tracking-widest bg-green-900/10 px-2 py-0.5 rounded-full inline-block">{bond.bonus}</div>
                                          </div>
                                          <ChevronRight size={20} className="text-gray-700 group-hover:text-blue-500 group-hover:translate-x-1 transition-all mr-2" />
                                      </Link>
                                  );
                              })}
                          </div>
                      ) : (
                          <div className="bg-bg-tertiary p-10 rounded-3xl border border-dashed border-gray-800 text-center text-gray-600 font-bold">
                              Intelligence indicates no primary squad synergies.
                          </div>
                      )}
                  </div>

                  <div>
                        <h3 className="text-xs font-black text-gray-600 uppercase tracking-[0.4em] mb-8 flex items-center">
                            <Shirt size={14} className="mr-3" /> Recommended Gear Sets
                        </h3>
                        <div className="flex flex-wrap gap-4">
                            {hero.recommendedSets?.map(set => {
                                const config = gearSetMap[set] || { icon: Shield, color: 'text-gray-400', bg: 'bg-gray-800 border-gray-700' };
                                const Icon = config.icon;
                                return (
                                    <div key={set} className={`flex items-center px-6 py-4 rounded-2xl border ${config.bg} shadow-lg transition-transform hover:-translate-y-1`}>
                                        <div className={`p-2.5 bg-black/30 rounded-lg mr-4 ${config.color}`}>
                                            <Icon size={20} />
                                        </div>
                                        <span className="font-black text-sm uppercase tracking-widest text-white">{set} Set</span>
                                    </div>
                                );
                            })}
                            {!hero.recommendedSets && <span className="text-gray-600 italic">No specific gear set optimized.</span>}
                        </div>
                  </div>

                  {(hero.specialWeapon || hero.exclusiveGear) && (
                       <div>
                            <h3 className="text-xs font-black text-gray-600 uppercase tracking-[0.4em] mb-8 flex items-center">
                                <Award size={14} className="mr-3" /> Legendary Armory
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {hero.specialWeapon && (
                                    <div className="bg-gradient-to-br from-gray-800/50 to-bg-tertiary p-8 rounded-[2rem] border border-orange-500/20 relative group overflow-hidden">
                                        <div className="absolute -top-6 -right-6 p-12 opacity-5 text-orange-400 group-hover:rotate-12 group-hover:scale-110 transition-all">
                                            <Sword size={120} />
                                        </div>
                                        <div className="text-[10px] text-orange-500 uppercase font-black tracking-[0.3em] mb-3 flex items-center">
                                            <Sparkles size={14} className="mr-2"/> Specialized Weapon
                                        </div>
                                        <div className="text-white font-black text-2xl mb-3 tracking-tight">{hero.specialWeapon.name}</div>
                                        <p className="text-sm text-gray-400 leading-relaxed font-medium">{hero.specialWeapon.description}</p>
                                    </div>
                                )}
                                {hero.exclusiveGear && (
                                    <div className="bg-gradient-to-br from-gray-800/50 to-bg-tertiary p-8 rounded-[2rem] border border-purple-500/20 relative group overflow-hidden">
                                        <div className="absolute -top-6 -right-6 p-12 opacity-5 text-purple-400 group-hover:-rotate-12 group-hover:scale-110 transition-all">
                                            <Gem size={120} />
                                        </div>
                                        <div className="text-[10px] text-purple-500 uppercase font-black tracking-[0.3em] mb-3 flex items-center">
                                            <Award size={14} className="mr-2"/> Exclusive Artifact
                                        </div>
                                        <div className="text-white font-black text-2xl mb-3 tracking-tight">{hero.exclusiveGear.name}</div>
                                        <div className="text-xs text-purple-400 font-black uppercase tracking-widest mb-3 bg-purple-900/10 px-3 py-1 rounded-full inline-block border border-purple-900/30">{hero.exclusiveGear.statBonus}</div>
                                        {hero.exclusiveGear.description && <p className="text-sm text-gray-400 font-medium">{hero.exclusiveGear.description}</p>}
                                    </div>
                                )}
                            </div>
                       </div>
                  )}

                  <div>
                      <h3 className="text-xs font-black text-gray-600 uppercase tracking-[0.4em] mb-8 flex items-center">
                          <Shirt size={14} className="mr-3" /> Appearance Modifications
                      </h3>
                      {hero.skins && hero.skins.length > 0 ? (
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                              {hero.skins.map((skin, idx) => (
                                  <div key={idx} className="bg-bg-tertiary p-6 rounded-3xl border border-border flex items-center group hover:border-pink-500/30 transition-all hover:bg-pink-900/5">
                                      <div className="w-14 h-14 rounded-2xl bg-gray-800 mr-5 flex items-center justify-center text-pink-400 group-hover:bg-pink-900/20 transition-all shadow-md">
                                          <Shirt size={24} />
                                      </div>
                                      <div>
                                          <div className="text-white font-black text-sm uppercase tracking-widest mb-1">{skin.name}</div>
                                          {skin.bonus && <div className="text-[10px] font-black text-pink-500 tracking-wider uppercase">{skin.bonus}</div>}
                                      </div>
                                  </div>
                              ))}
                          </div>
                      ) : (
                          <div className="text-gray-600 italic text-sm">Deployment restricted to default uniform only.</div>
                      )}
                  </div>
              </div>
          </div>
      </div>
      
      <div className="text-center pt-10 opacity-30 hover:opacity-100 transition-opacity">
          <div className="flex justify-center items-center space-x-6 mb-3">
              <Cpu size={20} />
              <div className="w-48 h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent"></div>
              <Anchor size={20} />
          </div>
          <p className="text-[9px] font-black uppercase tracking-[0.6em] text-gray-500">End of Intelligence Transmission</p>
      </div>
    </div>
  );
};

export default HeroDetail;
