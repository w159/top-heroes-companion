import React, { useState, useMemo } from 'react';
import { Plus, X, Users, TrendingUp, AlertTriangle, CheckCircle, Sparkles, Search } from 'lucide-react';

interface TeamBuilderProps {
  heroes: any[];
  enhancedData: Record<string, any>;
}

const TeamBuilder: React.FC<TeamBuilderProps> = ({ heroes, enhancedData }) => {
  const [team, setTeam] = useState<(any | null)[]>([null, null, null, null, null]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [filterFaction, setFilterFaction] = useState<string>('all');

  // Calculate team synergy
  const teamAnalysis = useMemo(() => {
    const filledSlots = team.filter(h => h !== null);
    if (filledSlots.length < 2) {
      return {
        synergyScore: 0,
        warnings: [],
        strengths: [],
        factionBalance: {},
        roleBalance: {}
      };
    }

    let synergyScore = 0;
    const warnings: string[] = [];
    const strengths: string[] = [];
    const factionCount: Record<string, number> = {};
    const roleStrength: Record<string, number> = { damage: 0, survivability: 0, utility: 0, support: 0 };

    // Count factions
    filledSlots.forEach(hero => {
      factionCount[hero.faction] = (factionCount[hero.faction] || 0) + 1;
      
      // Add role strengths
      if (hero.enhanced?.role_rating) {
        Object.entries(hero.enhanced.role_rating).forEach(([role, value]) => {
          roleStrength[role] = (roleStrength[role] || 0) + (value as number);
        });
      }
    });

    // Check synergies
    filledSlots.forEach((hero1, idx) => {
      filledSlots.slice(idx + 1).forEach(hero2 => {
        const enhanced1 = enhancedData[hero1.id];
        const enhanced2 = enhancedData[hero2.id];

        if (enhanced1?.synergies?.includes(hero2.name)) {
          synergyScore += 20;
          strengths.push(`${hero1.name} synergizes with ${hero2.name}`);
        }

        if (enhanced1?.counters?.includes(hero2.name) || enhanced2?.counters?.includes(hero1.name)) {
          synergyScore -= 15;
          warnings.push(`${hero1.name} and ${hero2.name} may conflict`);
        }
      });
    });

    // Faction bonuses
    const factionEntries = Object.entries(factionCount);
    factionEntries.forEach(([faction, count]) => {
      if (count >= 3) {
        synergyScore += 15 * (count - 2);
        strengths.push(`${faction} faction bonus (${count} heroes)`);
      }
    });

    // Check faction diversity (too many different factions can be bad)
    if (factionEntries.length >= 4) {
      synergyScore -= 10;
      warnings.push('Too many different factions - missing faction bonuses');
    }

    // Role balance checks
    if (roleStrength.damage < 100 && filledSlots.length >= 4) {
      warnings.push('Low damage output - add more DPS heroes');
    }
    if (roleStrength.survivability < 80 && filledSlots.length >= 4) {
      warnings.push('Low survivability - team may be too squishy');
    }
    if (roleStrength.damage >= 200) {
      strengths.push('High damage output');
    }
    if (roleStrength.survivability >= 150) {
      strengths.push('Strong frontline and survivability');
    }
    if (roleStrength.support >= 100) {
      strengths.push('Good support and healing');
    }

    // Normalize synergy score
    synergyScore = Math.max(0, Math.min(100, 50 + synergyScore));

    return {
      synergyScore,
      warnings,
      strengths,
      factionBalance: factionCount,
      roleBalance: roleStrength
    };
  }, [team, enhancedData]);

  const addHeroToSlot = (hero: any, slotIndex: number) => {
    // Check if hero already in team
    if (team.some(h => h?.id === hero.id)) {
      return;
    }

    const newTeam = [...team];
    newTeam[slotIndex] = hero;
    setTeam(newTeam);
    setSelectedSlot(null);
    setSearchTerm('');
  };

  const removeHero = (slotIndex: number) => {
    const newTeam = [...team];
    newTeam[slotIndex] = null;
    setTeam(newTeam);
  };

  const clearTeam = () => {
    setTeam([null, null, null, null, null]);
  };

  // Filter available heroes
  const availableHeroes = useMemo(() => {
    return heroes.filter(hero => {
      const inTeam = team.some(h => h?.id === hero.id);
      if (inTeam) return false;

      const matchesSearch = hero.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFaction = filterFaction === 'all' || hero.faction === filterFaction;

      return matchesSearch && matchesFaction;
    });
  }, [heroes, team, searchTerm, filterFaction]);

  const getSynergyColor = (score: number) => {
    if (score >= 75) return 'var(--ios-green)';
    if (score >= 50) return 'var(--ios-blue)';
    if (score >= 25) return 'var(--ios-orange)';
    return 'var(--ios-red)';
  };

  const positions = [
    { label: 'Front', positions: [0, 1] },
    { label: 'Back', positions: [2, 3, 4] }
  ];

  return (
    <div style={{ padding: 20, maxWidth: 1200, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{
          fontSize: 28,
          fontWeight: 700,
          marginBottom: 8,
          display: 'flex',
          alignItems: 'center',
          gap: 12
        }}>
          <Users size={32} color="var(--ios-blue)" />
          Team Builder
        </h1>
        <p style={{ color: 'var(--ios-text-secondary)', fontSize: 15 }}>
          Build your perfect team with synergy analysis
        </p>
      </div>

      {/* Team Formation */}
      <div style={{
        background: 'var(--ios-card-bg)',
        border: '1px solid var(--ios-border)',
        borderRadius: 16,
        padding: 24,
        marginBottom: 24
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 20
        }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>
            Formation
          </h2>
          <button
            onClick={clearTeam}
            style={{
              padding: '8px 16px',
              background: 'var(--ios-red-tint)',
              color: 'var(--ios-red)',
              border: 'none',
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Clear Team
          </button>
        </div>

        {positions.map(({ label, positions: posIndices }) => (
          <div key={label} style={{ marginBottom: 24 }}>
            <div style={{
              fontSize: 14,
              fontWeight: 600,
              color: 'var(--ios-text-secondary)',
              marginBottom: 12
            }}>
              {label}
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${posIndices.length}, 1fr)`,
              gap: 12
            }}>
              {posIndices.map(slotIndex => {
                const hero = team[slotIndex];
                return (
                  <div
                    key={slotIndex}
                    onClick={() => !hero && setSelectedSlot(slotIndex)}
                    style={{
                      position: 'relative',
                      paddingBottom: '100%',
                      background: hero ? 'var(--ios-grouped-bg)' : 'var(--ios-blue-tint)',
                      border: selectedSlot === slotIndex 
                        ? '2px solid var(--ios-blue)' 
                        : `2px dashed ${hero ? 'var(--ios-border)' : 'var(--ios-blue)'}`,
                      borderRadius: 12,
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      overflow: 'hidden'
                    }}
                  >
                    {hero ? (
                      <>
                        <div style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          background: `url(${hero.portrait}) center/cover`
                        }} />
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeHero(slotIndex);
                          }}
                          style={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            width: 28,
                            height: 28,
                            background: 'var(--ios-red)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '50%',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <X size={16} />
                        </button>
                        <div style={{
                          position: 'absolute',
                          bottom: 0,
                          left: 0,
                          right: 0,
                          background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
                          padding: 8,
                          color: 'white',
                          fontSize: 12,
                          fontWeight: 600,
                          textAlign: 'center'
                        }}>
                          {hero.name}
                        </div>
                      </>
                    ) : (
                      <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        textAlign: 'center',
                        color: 'var(--ios-blue)',
                        opacity: 0.6
                      }}>
                        <Plus size={32} />
                        <div style={{ fontSize: 11, marginTop: 4 }}>
                          Add Hero
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Synergy Analysis */}
      {team.filter(h => h !== null).length >= 2 && (
        <div style={{
          background: 'var(--ios-card-bg)',
          border: '1px solid var(--ios-border)',
          borderRadius: 16,
          padding: 24,
          marginBottom: 24
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            marginBottom: 20
          }}>
            <Sparkles size={24} color="var(--ios-orange)" />
            <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>
              Team Synergy Analysis
            </h2>
          </div>

          {/* Synergy Score */}
          <div style={{
            background: 'var(--ios-grouped-bg)',
            borderRadius: 12,
            padding: 20,
            marginBottom: 20,
            textAlign: 'center'
          }}>
            <div style={{ fontSize: 48, fontWeight: 800, color: getSynergyColor(teamAnalysis.synergyScore) }}>
              {teamAnalysis.synergyScore}
            </div>
            <div style={{ fontSize: 14, color: 'var(--ios-text-secondary)' }}>
              Synergy Score
            </div>
            <div style={{
              width: '100%',
              height: 8,
              background: 'var(--ios-separator)',
              borderRadius: 4,
              marginTop: 16,
              overflow: 'hidden'
            }}>
              <div style={{
                width: `${teamAnalysis.synergyScore}%`,
                height: '100%',
                background: getSynergyColor(teamAnalysis.synergyScore),
                transition: 'all 0.3s ease'
              }} />
            </div>
          </div>

          {/* Strengths */}
          {teamAnalysis.strengths.length > 0 && (
            <div style={{ marginBottom: 16 }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                marginBottom: 12,
                fontSize: 15,
                fontWeight: 600
              }}>
                <CheckCircle size={18} color="var(--ios-green)" />
                Strengths
              </div>
              {teamAnalysis.strengths.map((strength, idx) => (
                <div
                  key={idx}
                  style={{
                    background: 'var(--ios-green-tint)',
                    padding: '10px 12px',
                    borderRadius: 8,
                    marginBottom: 8,
                    fontSize: 14,
                    color: 'var(--ios-green)'
                  }}
                >
                  {strength}
                </div>
              ))}
            </div>
          )}

          {/* Warnings */}
          {teamAnalysis.warnings.length > 0 && (
            <div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                marginBottom: 12,
                fontSize: 15,
                fontWeight: 600
              }}>
                <AlertTriangle size={18} color="var(--ios-orange)" />
                Warnings
              </div>
              {teamAnalysis.warnings.map((warning, idx) => (
                <div
                  key={idx}
                  style={{
                    background: 'var(--ios-orange-tint)',
                    padding: '10px 12px',
                    borderRadius: 8,
                    marginBottom: 8,
                    fontSize: 14,
                    color: 'var(--ios-orange)'
                  }}
                >
                  {warning}
                </div>
              ))}
            </div>
          )}

          {/* Role Balance */}
          <div style={{ marginTop: 20 }}>
            <div style={{
              fontSize: 15,
              fontWeight: 600,
              marginBottom: 12
            }}>
              Role Balance
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
              {Object.entries(teamAnalysis.roleBalance).map(([role, value]) => (
                <div key={role} style={{
                  background: 'var(--ios-grouped-bg)',
                  padding: 12,
                  borderRadius: 8
                }}>
                  <div style={{
                    fontSize: 13,
                    fontWeight: 600,
                    marginBottom: 6,
                    textTransform: 'capitalize'
                  }}>
                    {role}
                  </div>
                  <div style={{
                    height: 6,
                    background: 'var(--ios-separator)',
                    borderRadius: 3,
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${Math.min(100, (value / 200) * 100)}%`,
                      height: '100%',
                      background: 'var(--ios-blue)',
                      transition: 'all 0.3s ease'
                    }} />
                  </div>
                  <div style={{
                    fontSize: 11,
                    color: 'var(--ios-text-secondary)',
                    marginTop: 4
                  }}>
                    {Math.round(value)} / 200
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Hero Selector */}
      {selectedSlot !== null && (
        <div style={{
          background: 'var(--ios-card-bg)',
          border: '1px solid var(--ios-border)',
          borderRadius: 16,
          padding: 24
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 20
          }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>
              Select Hero
            </h2>
            <button
              onClick={() => setSelectedSlot(null)}
              style={{
                padding: 8,
                background: 'var(--ios-grouped-bg)',
                border: 'none',
                borderRadius: 8,
                cursor: 'pointer'
              }}
            >
              <X size={20} />
            </button>
          </div>

          {/* Search */}
          <div style={{
            position: 'relative',
            marginBottom: 16
          }}>
            <Search
              size={18}
              style={{
                position: 'absolute',
                left: 12,
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--ios-text-secondary)'
              }}
            />
            <input
              type="text"
              placeholder="Search heroes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 12px 12px 40px',
                background: 'var(--ios-grouped-bg)',
                border: '1px solid var(--ios-border)',
                borderRadius: 10,
                fontSize: 15,
                outline: 'none'
              }}
            />
          </div>

          {/* Faction Filter */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
            {['all', 'Nature', 'League', 'Horde'].map(faction => (
              <button
                key={faction}
                onClick={() => setFilterFaction(faction)}
                style={{
                  padding: '8px 16px',
                  background: filterFaction === faction ? 'var(--ios-blue)' : 'var(--ios-grouped-bg)',
                  color: filterFaction === faction ? 'white' : 'var(--ios-text-primary)',
                  border: 'none',
                  borderRadius: 8,
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                {faction === 'all' ? 'All' : faction}
              </button>
            ))}
          </div>

          {/* Heroes Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
            gap: 12,
            maxHeight: 400,
            overflowY: 'auto'
          }}>
            {availableHeroes.map(hero => (
              <div
                key={hero.id}
                onClick={() => addHeroToSlot(hero, selectedSlot)}
                style={{
                  background: 'var(--ios-grouped-bg)',
                  border: '1px solid var(--ios-border)',
                  borderRadius: 12,
                  padding: 8,
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{
                  width: '100%',
                  paddingBottom: '100%',
                  position: 'relative',
                  marginBottom: 8,
                  borderRadius: 8,
                  overflow: 'hidden'
                }}>
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: `url(${hero.portrait}) center/cover`
                  }} />
                </div>
                <div style={{
                  fontSize: 12,
                  fontWeight: 600,
                  textAlign: 'center',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {hero.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamBuilder;
