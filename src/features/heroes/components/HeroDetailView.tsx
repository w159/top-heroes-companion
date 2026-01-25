import React, { useState } from 'react';
import { ArrowLeft, Trophy, Users, Swords, Shield, Heart, Target, TrendingUp, Sparkles, Info, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import StatRadarChart from './StatRadarChart';
import SkillCardEnhanced from './SkillCardEnhanced';
import '../../../styles/main.css';

interface Skill {
  name: string;
  type: string;
  description: string;
  tips: string;
}

interface Hero {
  id: string;
  name: string;
  faction: string;
  rarity: string;
  role: string;
  image: string;
  gear_set: string;
  unique_weapon: string;
  positions: string[];
  skills: Skill[];
}

interface UserHeroData {
  id: string;
  level: number;
  stars: number;
  power: number;
}

interface Props {
  hero: Hero;
  userHero?: UserHeroData;
  enhancedData?: any;
  onRecruit?: () => void;
  onUpdate?: (data: Partial<UserHeroData>) => void;
}

const HeroDetailView: React.FC<Props> = ({ hero, userHero, enhancedData, onRecruit }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'skills' | 'build'>('overview');

  const enhanced = enhancedData?.[hero.id];
  const hasEnhancedData = !!enhanced;

  // Tier color mapping
  const getTierColor = (tier: string) => {
    const colors: Record<string, string> = {
      'S+': '#FF3B30',
      'S': '#FF9500',
      'A+': '#FFCC00',
      'A': '#34C759',
      'B': '#007AFF',
      'C': '#5856D6',
      'D': '#8E8E93'
    };
    return colors[tier] || '#8E8E93';
  };

  return (
    <div className="animate-slide-up" style={{ paddingBottom: 80 }}>
      {/* Sticky Header */}
      <div className="glass" style={{ 
        position: 'sticky', top: 0, zIndex: 100, 
        padding: '12px 16px', margin: '0 -20px 20px', 
        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
      }}>
        <button 
          onClick={() => navigate(-1)}
          style={{ 
            background: 'none', border: 'none', 
            display: 'flex', alignItems: 'center', gap: 4,
            color: 'var(--ios-blue)', fontSize: '17px', cursor: 'pointer'
          }}
        >
          <ArrowLeft size={22} /> Back
        </button>
        {userHero ? (
          <span style={{ fontSize: '12px', fontWeight: 600, color: '#34C759', background: 'rgba(52, 199, 89, 0.1)', padding: '4px 8px', borderRadius: 8 }}>
            In Roster
          </span>
        ) : (
          <button
            onClick={onRecruit}
            style={{
              background: 'var(--ios-blue)', color: 'white', border: 'none',
              padding: '6px 16px', borderRadius: 20, fontWeight: 600, fontSize: '13px',
              cursor: 'pointer'
            }}
          >
            Recruit
          </button>
        )}
      </div>

      {/* Hero Header */}
      <div style={{ display: 'flex', gap: 20, marginBottom: 24, alignItems: 'flex-start' }}>
        <div style={{ position: 'relative' }}>
          <img 
            src={hero.image} 
            alt={hero.name} 
            style={{ 
              width: 120, height: 120, borderRadius: 24, 
              boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
              objectFit: 'cover', background: 'white'
            }}
            onError={(e) => { e.currentTarget.src = '/img/heroes/placeholder.png'; }}
          />
          {hasEnhancedData && enhanced.tier?.overall && (
            <div style={{
              position: 'absolute',
              bottom: -8,
              left: '50%',
              transform: 'translateX(-50%)',
              background: `linear-gradient(135deg, ${getTierColor(enhanced.tier.overall)} 0%, ${getTierColor(enhanced.tier.overall)}dd 100%)`,
              color: 'white',
              padding: '6px 16px',
              borderRadius: 12,
              fontSize: 14,
              fontWeight: 800,
              boxShadow: '0 4px 12px rgba(0,0,0,0.25)'
            }}>
              {enhanced.tier.overall}
            </div>
          )}
        </div>
        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: '28px', fontWeight: 800, margin: '0 0 6px', lineHeight: 1.1 }}>
            {hero.name}
          </h1>
          <p style={{ color: 'var(--ios-text-secondary)', margin: '0 0 12px', fontSize: '16px' }}>
            {hero.faction} • {hero.role}
          </p>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            <span style={{ 
              background: 'var(--ios-blue-tint)', color: 'var(--ios-blue)',
              padding: '6px 12px', borderRadius: 10, fontSize: '13px', fontWeight: 600
            }}>
              {hero.rarity}
            </span>
            {hasEnhancedData && enhanced.tier && (
              <>
                <span style={{ 
                  background: 'var(--ios-green-tint)', color: 'var(--ios-green)',
                  padding: '6px 12px', borderRadius: 10, fontSize: '13px', fontWeight: 600
                }}>
                  PvE: {enhanced.tier.pve}
                </span>
                <span style={{ 
                  background: 'var(--ios-orange-tint)', color: 'var(--ios-orange)',
                  padding: '6px 12px', borderRadius: 10, fontSize: '13px', fontWeight: 600
                }}>
                  PvP: {enhanced.tier.pvp}
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div style={{
        display: 'flex',
        gap: 8,
        marginBottom: 24,
        borderBottom: '1px solid var(--ios-separator)',
        paddingBottom: 2
      }}>
        {[
          { id: 'overview', label: 'Overview', icon: Info },
          { id: 'skills', label: 'Skills', icon: Sparkles },
          { id: 'build', label: 'Build', icon: TrendingUp }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            style={{
              flex: 1,
              padding: '12px 16px',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === tab.id ? '3px solid var(--ios-blue)' : '3px solid transparent',
              color: activeTab === tab.id ? 'var(--ios-blue)' : 'var(--ios-text-secondary)',
              fontSize: 15,
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              transition: 'all 0.2s'
            }}
          >
            <tab.icon size={18} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div>
          {/* Stats Radar */}
          {hasEnhancedData && enhanced.stats && (
            <div style={{
              background: 'var(--ios-card-bg)',
              border: '1px solid var(--ios-border)',
              borderRadius: 16,
              padding: 24,
              marginBottom: 20
            }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
                <Trophy size={24} color="var(--ios-orange)" />
                Base Stats
              </h2>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
                <StatRadarChart stats={enhanced.stats} size={300} />
              </div>
              
              {/* Stat Details */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: 12
              }}>
                {Object.entries(enhanced.stats).map(([key, value]) => (
                  <div key={key} style={{
                    background: 'var(--ios-grouped-bg)',
                    padding: 12,
                    borderRadius: 10
                  }}>
                    <div style={{ fontSize: 12, color: 'var(--ios-text-secondary)', marginBottom: 4, textTransform: 'uppercase' }}>
                      {key.replace('_', ' ')}
                    </div>
                    <div style={{ fontSize: 20, fontWeight: 700 }}>
                      {value}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Role Ratings */}
          {hasEnhancedData && enhanced.role_rating && (
            <div style={{
              background: 'var(--ios-card-bg)',
              border: '1px solid var(--ios-border)',
              borderRadius: 16,
              padding: 24,
              marginBottom: 20
            }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
                <Users size={24} color="var(--ios-blue)" />
                Role Performance
              </h2>
              {Object.entries(enhanced.role_rating).map(([role, rating]) => (
                <div key={role} style={{ marginBottom: 16 }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: 6
                  }}>
                    <span style={{ fontSize: 15, fontWeight: 600, textTransform: 'capitalize' }}>{role}</span>
                    <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--ios-blue)' }}>{rating}/100</span>
                  </div>
                  <div style={{
                    height: 8,
                    background: 'var(--ios-grouped-bg)',
                    borderRadius: 4,
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${rating}%`,
                      height: '100%',
                      background: (rating as number) >= 80 ? 'var(--ios-green)' : 
                                 (rating as number) >= 60 ? 'var(--ios-blue)' : 'var(--ios-orange)',
                      transition: 'all 0.3s ease'
                    }} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Synergies & Counters */}
          {hasEnhancedData && (enhanced.synergies || enhanced.counters || enhanced.weak_against) && (
            <div style={{
              background: 'var(--ios-card-bg)',
              border: '1px solid var(--ios-border)',
              borderRadius: 16,
              padding: 24,
              marginBottom: 20
            }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
                <Swords size={24} color="var(--ios-purple)" />
                Team Synergy
              </h2>

              {enhanced.synergies && enhanced.synergies.length > 0 && (
                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 10, color: 'var(--ios-green)' }}>
                    ✨ Works Well With
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {enhanced.synergies.map((hero: string) => (
                      <span key={hero} style={{
                        background: 'var(--ios-green-tint)',
                        color: 'var(--ios-green)',
                        padding: '8px 14px',
                        borderRadius: 10,
                        fontSize: 14,
                        fontWeight: 600
                      }}>
                        {hero}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {enhanced.counters && enhanced.counters.length > 0 && (
                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 10, color: 'var(--ios-blue)' }}>
                    🎯 Strong Against
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {enhanced.counters.map((hero: string) => (
                      <span key={hero} style={{
                        background: 'var(--ios-blue-tint)',
                        color: 'var(--ios-blue)',
                        padding: '8px 14px',
                        borderRadius: 10,
                        fontSize: 14,
                        fontWeight: 600
                      }}>
                        {hero}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {enhanced.weak_against && enhanced.weak_against.length > 0 && (
                <div>
                  <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 10, color: 'var(--ios-orange)' }}>
                    ⚠️ Weak Against
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {enhanced.weak_against.map((hero: string) => (
                      <span key={hero} style={{
                        background: 'var(--ios-orange-tint)',
                        color: 'var(--ios-orange)',
                        padding: '8px 14px',
                        borderRadius: 10,
                        fontSize: 14,
                        fontWeight: 600
                      }}>
                        {hero}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Positioning */}
          {hasEnhancedData && enhanced.positioning && (
            <div style={{
              background: 'var(--ios-blue-tint)',
              border: '1px solid var(--ios-blue)',
              borderRadius: 12,
              padding: 16,
              marginBottom: 20
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <Target size={20} color="var(--ios-blue)" />
                <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--ios-blue)' }}>
                  Optimal Position
                </span>
              </div>
              <p style={{ margin: 0, fontSize: 14, color: 'var(--ios-blue)' }}>
                {enhanced.positioning}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Skills Tab */}
      {activeTab === 'skills' && (
        <div>
          {hasEnhancedData && enhanced.skills_enhanced ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {enhanced.skills_enhanced.map((skill: any, index: number) => (
                <SkillCardEnhanced key={index} skill={skill} index={index} />
              ))}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {hero.skills.map((skill, index) => (
                <div key={index} className="ios-card" style={{ padding: 20 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, alignItems: 'center' }}>
                    <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700 }}>{skill.name}</h3>
                    <span style={{ 
                      fontSize: '11px', fontWeight: 700, textTransform: 'uppercase',
                      color: 'var(--ios-blue)', background: 'rgba(0,122,255,0.1)',
                      padding: '4px 8px', borderRadius: 6
                    }}>
                      {skill.type}
                    </span>
                  </div>
                  <p style={{ margin: 0, fontSize: '14px', lineHeight: 1.5, color: 'var(--ios-text-primary)' }}>
                    {skill.description || 'No description available.'}
                  </p>
                  {skill.tips && (
                    <div style={{ marginTop: 12, padding: 12, background: 'var(--ios-background)', borderRadius: 12 }}>
                      <p style={{ margin: 0, fontSize: '13px', fontStyle: 'italic', color: 'var(--ios-text-secondary)' }}>
                        💡 {skill.tips}
                      </p>
                    </div>
                  )}
                </div>
              ))}
              {hero.skills.length === 0 && (
                <p style={{ color: 'var(--ios-text-secondary)', fontStyle: 'italic', textAlign: 'center', padding: 40 }}>
                  No skill data available.
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Build Tab */}
      {activeTab === 'build' && (
        <div>
          {/* Best Gear */}
          {hasEnhancedData && enhanced.best_with && (
            <div style={{
              background: 'var(--ios-card-bg)',
              border: '1px solid var(--ios-border)',
              borderRadius: 16,
              padding: 24,
              marginBottom: 20
            }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
                <Shield size={24} color="var(--ios-green)" />
                Recommended Build
              </h2>

              {enhanced.best_with.gear && (
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 13, color: 'var(--ios-text-secondary)', marginBottom: 6, fontWeight: 600 }}>
                    BEST GEAR SET
                  </div>
                  <div style={{
                    background: 'var(--ios-green-tint)',
                    color: 'var(--ios-green)',
                    padding: 12,
                    borderRadius: 10,
                    fontSize: 15,
                    fontWeight: 600
                  }}>
                    {enhanced.best_with.gear}
                  </div>
                </div>
              )}

              {enhanced.best_with.weapon && (
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 13, color: 'var(--ios-text-secondary)', marginBottom: 6, fontWeight: 600 }}>
                    BEST WEAPON
                  </div>
                  <div style={{
                    background: 'var(--ios-blue-tint)',
                    color: 'var(--ios-blue)',
                    padding: 12,
                    borderRadius: 10,
                    fontSize: 15,
                    fontWeight: 600
                  }}>
                    {enhanced.best_with.weapon}
                  </div>
                </div>
              )}

              {enhanced.best_with.pet && (
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 13, color: 'var(--ios-text-secondary)', marginBottom: 6, fontWeight: 600 }}>
                    BEST PET
                  </div>
                  <div style={{
                    background: 'var(--ios-purple-tint)',
                    color: 'var(--ios-purple)',
                    padding: 12,
                    borderRadius: 10,
                    fontSize: 15,
                    fontWeight: 600
                  }}>
                    {enhanced.best_with.pet}
                  </div>
                </div>
              )}

              {enhanced.best_with.relics && enhanced.best_with.relics.length > 0 && (
                <div>
                  <div style={{ fontSize: 13, color: 'var(--ios-text-secondary)', marginBottom: 6, fontWeight: 600 }}>
                    BEST RELICS
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {enhanced.best_with.relics.map((relic: string, idx: number) => (
                      <div key={idx} style={{
                        background: 'var(--ios-orange-tint)',
                        color: 'var(--ios-orange)',
                        padding: 12,
                        borderRadius: 10,
                        fontSize: 14,
                        fontWeight: 600
                      }}>
                        {relic}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Skill Priority */}
          {hasEnhancedData && enhanced.skill_priority && (
            <div style={{
              background: 'var(--ios-card-bg)',
              border: '1px solid var(--ios-border)',
              borderRadius: 16,
              padding: 24
            }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10 }}>
                <CheckCircle size={24} color="var(--ios-blue)" />
                Skill Upgrade Priority
              </h2>
              <p style={{ fontSize: 14, color: 'var(--ios-text-secondary)', marginBottom: 16 }}>
                Upgrade skills in this order for optimal performance:
              </p>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {enhanced.skill_priority.map((priority: number, idx: number) => (
                  <div key={idx} style={{
                    width: 40,
                    height: 40,
                    background: idx === 0 ? 'var(--ios-blue)' : 'var(--ios-grouped-bg)',
                    color: idx === 0 ? 'white' : 'var(--ios-text-primary)',
                    borderRadius: 10,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 18,
                    fontWeight: 700,
                    border: idx === 0 ? 'none' : '1px solid var(--ios-border)'
                  }}>
                    {priority}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Fallback to basic info */}
          {!hasEnhancedData && (
            <div style={{
              background: 'var(--ios-card-bg)',
              border: '1px solid var(--ios-border)',
              borderRadius: 16,
              padding: 24
            }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>Basic Info</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div>
                  <div style={{ fontSize: 13, color: 'var(--ios-text-secondary)', marginBottom: 4 }}>Gear Set</div>
                  <div style={{ fontSize: 16, fontWeight: 600 }}>{hero.gear_set}</div>
                </div>
                <div>
                  <div style={{ fontSize: 13, color: 'var(--ios-text-secondary)', marginBottom: 4 }}>Unique Weapon</div>
                  <div style={{ fontSize: 16, fontWeight: 600 }}>{hero.unique_weapon || 'None'}</div>
                </div>
                <div>
                  <div style={{ fontSize: 13, color: 'var(--ios-text-secondary)', marginBottom: 4 }}>Positions</div>
                  <div style={{ fontSize: 16, fontWeight: 600 }}>
                    {hero.positions.join(', ') || 'Any'}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default HeroDetailView;
