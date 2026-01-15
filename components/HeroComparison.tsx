import React, { useState } from 'react';
import { X, TrendingUp, TrendingDown, Minus, Swords, Shield, Users } from 'lucide-react';
import StatRadarChart from './StatRadarChart';
import SkillCardEnhanced from './SkillCardEnhanced';

interface HeroComparisonProps {
  heroes: any[];
  enhancedData: Record<string, any>;
  onClose: () => void;
}

const HeroComparison: React.FC<HeroComparisonProps> = ({ heroes, enhancedData, onClose }) => {
  const [selectedView, setSelectedView] = useState<'stats' | 'skills' | 'synergy'>('stats');

  // Get enhanced data for selected heroes
  const heroData = heroes.map(hero => ({
    ...hero,
    enhanced: enhancedData[hero.id] || null
  }));

  // Calculate stat differences
  const getStatComparison = (heroIndex: number, stat: string) => {
    if (heroData.length < 2 || !heroData[0].enhanced || !heroData[1].enhanced) return 'equal';
    const value1 = heroData[0].enhanced.stats[stat];
    const value2 = heroData[1].enhanced.stats[stat];
    const currentValue = heroData[heroIndex].enhanced.stats[stat];
    
    if (currentValue > (heroIndex === 0 ? value2 : value1)) return 'better';
    if (currentValue < (heroIndex === 0 ? value2 : value1)) return 'worse';
    return 'equal';
  };

  // Calculate synergy between heroes
  const calculateSynergy = (hero1: any, hero2: any) => {
    if (!hero1.enhanced || !hero2.enhanced) return 'unknown';
    const synergies1 = hero1.enhanced.synergies || [];
    const synergies2 = hero2.enhanced.synergies || [];
    
    if (synergies1.includes(hero2.name)) return 'strong';
    if (synergies2.includes(hero1.name)) return 'strong';
    
    const counters1 = hero1.enhanced.counters || [];
    const counters2 = hero2.enhanced.counters || [];
    if (counters1.includes(hero2.name) || counters2.includes(hero1.name)) return 'poor';
    
    return 'neutral';
  };

  // Predict 1v1 matchup
  const predict1v1Winner = (hero1: any, hero2: any) => {
    if (!hero1.enhanced || !hero2.enhanced) return null;
    
    const counters1 = hero1.enhanced.counters || [];
    const weak1 = hero1.enhanced.weak_against || [];
    
    if (counters1.includes(hero2.name)) return hero1.id;
    if (weak1.includes(hero2.name)) return hero2.id;
    
    // Simple stat-based prediction
    const power1 = hero1.enhanced.stats.attack + hero1.enhanced.stats.hp * 0.5;
    const power2 = hero2.enhanced.stats.attack + hero2.enhanced.stats.hp * 0.5;
    
    if (Math.abs(power1 - power2) < 50) return null; // Too close
    return power1 > power2 ? hero1.id : hero2.id;
  };

  const StatComparisonBar: React.FC<{ label: string; hero1Value: number; hero2Value: number; max: number }> = 
    ({ label, hero1Value, hero2Value, max }) => {
    const hero1Pct = (hero1Value / max) * 100;
    const hero2Pct = (hero2Value / max) * 100;
    
    return (
      <div style={{ marginBottom: 16 }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          fontSize: 13,
          fontWeight: 600,
          marginBottom: 6,
          color: 'var(--ios-text-secondary)'
        }}>
          <span>{hero1Value}</span>
          <span>{label}</span>
          <span>{hero2Value}</span>
        </div>
        <div style={{ 
          display: 'flex', 
          gap: 8, 
          alignItems: 'center',
          height: 24
        }}>
          <div style={{ 
            flex: 1, 
            height: '100%',
            background: 'var(--ios-grouped-bg)',
            borderRadius: 6,
            overflow: 'hidden',
            position: 'relative'
          }}>
            <div style={{ 
              position: 'absolute',
              right: 0,
              width: `${hero1Pct}%`,
              height: '100%',
              background: hero1Value > hero2Value ? 'var(--ios-green)' : 
                         hero1Value < hero2Value ? 'var(--ios-orange)' : 'var(--ios-blue)',
              transition: 'all 0.3s ease'
            }} />
          </div>
          <div style={{ 
            flex: 1, 
            height: '100%',
            background: 'var(--ios-grouped-bg)',
            borderRadius: 6,
            overflow: 'hidden',
            position: 'relative'
          }}>
            <div style={{ 
              position: 'absolute',
              left: 0,
              width: `${hero2Pct}%`,
              height: '100%',
              background: hero2Value > hero1Value ? 'var(--ios-green)' : 
                         hero2Value < hero1Value ? 'var(--ios-orange)' : 'var(--ios-blue)',
              transition: 'all 0.3s ease'
            }} />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.5)',
      zIndex: 2000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20
    }}>
      <div style={{
        background: 'var(--ios-card-bg)',
        borderRadius: 20,
        maxWidth: 1000,
        width: '100%',
        maxHeight: '90vh',
        overflow: 'auto',
        position: 'relative'
      }}>
        {/* Header */}
        <div style={{
          position: 'sticky',
          top: 0,
          background: 'var(--ios-card-bg)',
          borderBottom: '1px solid var(--ios-separator)',
          padding: 20,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: 10
        }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>
            Hero Comparison
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'var(--ios-grouped-bg)',
              border: 'none',
              borderRadius: 8,
              padding: 8,
              cursor: 'pointer'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* View Selector */}
        <div style={{
          display: 'flex',
          gap: 8,
          padding: '0 20px 20px',
          borderBottom: '1px solid var(--ios-separator)'
        }}>
          {['stats', 'skills', 'synergy'].map(view => (
            <button
              key={view}
              onClick={() => setSelectedView(view as any)}
              style={{
                flex: 1,
                padding: '10px 16px',
                background: selectedView === view ? 'var(--ios-blue)' : 'var(--ios-grouped-bg)',
                color: selectedView === view ? 'white' : 'var(--ios-text-primary)',
                border: 'none',
                borderRadius: 10,
                fontSize: 15,
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {view === 'stats' && 'Stats'}
              {view === 'skills' && 'Skills'}
              {view === 'synergy' && 'Synergy'}
            </button>
          ))}
        </div>

        {/* Content */}
        <div style={{ padding: 20 }}>
          {/* Hero Headers */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: `repeat(${heroes.length}, 1fr)`,
            gap: 16,
            marginBottom: 24
          }}>
            {heroData.map((hero, idx) => (
              <div key={hero.id} style={{
                background: 'var(--ios-grouped-bg)',
                borderRadius: 12,
                padding: 16,
                textAlign: 'center'
              }}>
                <div style={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  margin: '0 auto 12px',
                  background: `url(${hero.portrait}) center/cover`,
                  border: '3px solid var(--ios-blue)'
                }} />
                <div style={{ fontSize: 17, fontWeight: 700, marginBottom: 4 }}>
                  {hero.name}
                </div>
                <div style={{
                  display: 'inline-block',
                  padding: '4px 12px',
                  background: 'var(--ios-blue-tint)',
                  color: 'var(--ios-blue)',
                  borderRadius: 6,
                  fontSize: 13,
                  fontWeight: 600
                }}>
                  {hero.enhanced?.tier?.overall || 'N/A'}
                </div>
              </div>
            ))}
          </div>

          {/* Stats View */}
          {selectedView === 'stats' && heroData[0].enhanced && heroData[1]?.enhanced && (
            <>
              {/* Radar Charts Overlay */}
              <div style={{
                position: 'relative',
                height: 320,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: 32
              }}>
                <div style={{ position: 'absolute' }}>
                  <StatRadarChart 
                    stats={heroData[0].enhanced.stats}
                    color="#007AFF"
                    size={280}
                  />
                </div>
                {heroData[1] && (
                  <div style={{ position: 'absolute', opacity: 0.7 }}>
                    <StatRadarChart 
                      stats={heroData[1].enhanced.stats}
                      color="#FF3B30"
                      size={280}
                    />
                  </div>
                )}
                
                {/* Legend */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  display: 'flex',
                  gap: 16
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 16, height: 16, background: '#007AFF', borderRadius: 3 }} />
                    <span style={{ fontSize: 13, fontWeight: 600 }}>{heroData[0].name}</span>
                  </div>
                  {heroData[1] && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <div style={{ width: 16, height: 16, background: '#FF3B30', borderRadius: 3 }} />
                      <span style={{ fontSize: 13, fontWeight: 600 }}>{heroData[1].name}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Detailed Stat Bars */}
              {heroData[1] && (
                <div style={{
                  background: 'var(--ios-grouped-bg)',
                  borderRadius: 12,
                  padding: 20
                }}>
                  <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 20 }}>
                    Detailed Comparison
                  </h3>
                  <StatComparisonBar 
                    label="HP"
                    hero1Value={heroData[0].enhanced.stats.hp}
                    hero2Value={heroData[1].enhanced.stats.hp}
                    max={1200}
                  />
                  <StatComparisonBar 
                    label="Attack"
                    hero1Value={heroData[0].enhanced.stats.attack}
                    hero2Value={heroData[1].enhanced.stats.attack}
                    max={200}
                  />
                  <StatComparisonBar 
                    label="Defense"
                    hero1Value={heroData[0].enhanced.stats.defense}
                    hero2Value={heroData[1].enhanced.stats.defense}
                    max={150}
                  />
                  <StatComparisonBar 
                    label="Speed"
                    hero1Value={heroData[0].enhanced.stats.speed}
                    hero2Value={heroData[1].enhanced.stats.speed}
                    max={120}
                  />
                  <StatComparisonBar 
                    label="Crit Rate"
                    hero1Value={heroData[0].enhanced.stats.crit_rate}
                    hero2Value={heroData[1].enhanced.stats.crit_rate}
                    max={30}
                  />
                  <StatComparisonBar 
                    label="Crit Damage"
                    hero1Value={heroData[0].enhanced.stats.crit_dmg}
                    hero2Value={heroData[1].enhanced.stats.crit_dmg}
                    max={200}
                  />
                </div>
              )}
            </>
          )}

          {/* Skills View */}
          {selectedView === 'skills' && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${heroes.length}, 1fr)`,
              gap: 16
            }}>
              {heroData.map(hero => (
                <div key={hero.id}>
                  <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 12 }}>
                    {hero.name} Skills
                  </h3>
                  {hero.enhanced?.skills_enhanced?.map((skill: any, idx: number) => (
                    <div key={idx} style={{ marginBottom: 12 }}>
                      <SkillCardEnhanced skill={skill} index={idx} />
                    </div>
                  )) || (
                    <div style={{
                      background: 'var(--ios-grouped-bg)',
                      padding: 16,
                      borderRadius: 12,
                      textAlign: 'center',
                      color: 'var(--ios-text-secondary)'
                    }}>
                      Enhanced skill data not available
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Synergy View */}
          {selectedView === 'synergy' && heroData.length === 2 && (
            <div>
              {/* Team Synergy */}
              <div style={{
                background: 'var(--ios-grouped-bg)',
                borderRadius: 12,
                padding: 20,
                marginBottom: 16
              }}>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 12,
                  marginBottom: 16
                }}>
                  <Users size={24} color="var(--ios-blue)" />
                  <h3 style={{ fontSize: 17, fontWeight: 700, margin: 0 }}>
                    Team Synergy
                  </h3>
                </div>
                {(() => {
                  const synergy = calculateSynergy(heroData[0], heroData[1]);
                  const colors = {
                    strong: { bg: 'var(--ios-green-tint)', text: 'var(--ios-green)', icon: '✨' },
                    neutral: { bg: 'var(--ios-blue-tint)', text: 'var(--ios-blue)', icon: '➖' },
                    poor: { bg: 'var(--ios-orange-tint)', text: 'var(--ios-orange)', icon: '⚠️' },
                    unknown: { bg: 'var(--ios-grouped-bg)', text: 'var(--ios-text-secondary)', icon: '?' }
                  };
                  const style = colors[synergy as keyof typeof colors];
                  
                  return (
                    <div style={{
                      background: style.bg,
                      padding: 16,
                      borderRadius: 10,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12
                    }}>
                      <span style={{ fontSize: 28 }}>{style.icon}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ 
                          fontSize: 17, 
                          fontWeight: 700, 
                          color: style.text,
                          marginBottom: 4
                        }}>
                          {synergy.charAt(0).toUpperCase() + synergy.slice(1)} Synergy
                        </div>
                        <div style={{ fontSize: 14, color: 'var(--ios-text-secondary)' }}>
                          {synergy === 'strong' && 'These heroes work great together!'}
                          {synergy === 'neutral' && 'No special synergy or conflicts'}
                          {synergy === 'poor' && 'These heroes may conflict in team comps'}
                          {synergy === 'unknown' && 'Synergy data not available'}
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* 1v1 Matchup */}
              <div style={{
                background: 'var(--ios-grouped-bg)',
                borderRadius: 12,
                padding: 20
              }}>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 12,
                  marginBottom: 16
                }}>
                  <Swords size={24} color="var(--ios-orange)" />
                  <h3 style={{ fontSize: 17, fontWeight: 700, margin: 0 }}>
                    1v1 Matchup Prediction
                  </h3>
                </div>
                {(() => {
                  const winner = predict1v1Winner(heroData[0], heroData[1]);
                  const winnerHero = winner ? heroData.find(h => h.id === winner) : null;
                  
                  return (
                    <div style={{
                      background: winner ? 'var(--ios-blue-tint)' : 'var(--ios-orange-tint)',
                      padding: 16,
                      borderRadius: 10,
                      textAlign: 'center'
                    }}>
                      <div style={{ fontSize: 40, marginBottom: 8 }}>
                        {winner ? '👑' : '⚖️'}
                      </div>
                      <div style={{
                        fontSize: 17,
                        fontWeight: 700,
                        color: winner ? 'var(--ios-blue)' : 'var(--ios-orange)',
                        marginBottom: 4
                      }}>
                        {winner ? `${winnerHero?.name} Favored` : 'Even Matchup'}
                      </div>
                      <div style={{ fontSize: 14, color: 'var(--ios-text-secondary)' }}>
                        {winner 
                          ? 'Based on stats, counters, and faction advantage'
                          : 'Too close to call - skill and build matter most'}
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HeroComparison;
