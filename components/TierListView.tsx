import React, { useState, useMemo } from 'react';
import { Trophy, Swords, Shield, Skull, TrendingUp, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface TierListViewProps {
  heroes: any[];
  enhancedData: Record<string, any>;
}

const TierListView: React.FC<TierListViewProps> = ({ heroes, enhancedData }) => {
  const [mode, setMode] = useState<'overall' | 'pve' | 'pvp' | 'boss'>('overall');
  const [selectedFaction, setSelectedFaction] = useState<string>('all');
  const navigate = useNavigate();

  // Define tier order and colors
  const tierConfig = {
    'S+': { color: '#FF3B30', label: 'S+', bg: 'linear-gradient(135deg, #FF3B30 0%, #FF6B6B 100%)' },
    'S': { color: '#FF9500', label: 'S', bg: 'linear-gradient(135deg, #FF9500 0%, #FFB340 100%)' },
    'A+': { color: '#FFCC00', label: 'A+', bg: 'linear-gradient(135deg, #FFCC00 0%, #FFD740 100%)' },
    'A': { color: '#34C759', label: 'A', bg: 'linear-gradient(135deg, #34C759 0%, #5DD879 100%)' },
    'B': { color: '#007AFF', label: 'B', bg: 'linear-gradient(135deg, #007AFF 0%, #409FFF 100%)' },
    'C': { color: '#5856D6', label: 'C', bg: 'linear-gradient(135deg, #5856D6 0%, #7876E6 100%)' },
    'D': { color: '#8E8E93', label: 'D', bg: 'linear-gradient(135deg, #8E8E93 0%, #AEAEB3 100%)' }
  };

  const tierOrder = ['S+', 'S', 'A+', 'A', 'B', 'C', 'D'];

  // Group heroes by tier
  const heroesGroupedByTier = useMemo(() => {
    const grouped: Record<string, any[]> = {};
    
    tierOrder.forEach(tier => {
      grouped[tier] = [];
    });

    heroes.forEach(hero => {
      const enhanced = enhancedData[hero.id];
      if (enhanced?.tier) {
        const tierValue = enhanced.tier[mode] || 'C';
        if (grouped[tierValue]) {
          if (selectedFaction === 'all' || hero.faction === selectedFaction) {
            grouped[tierValue].push({ ...hero, enhanced });
          }
        }
      } else {
        // Heroes without enhanced data go to C tier
        if (selectedFaction === 'all' || hero.faction === selectedFaction) {
          grouped['C'].push({ ...hero, enhanced: null });
        }
      }
    });

    return grouped;
  }, [heroes, enhancedData, mode, selectedFaction]);

  const factions = ['all', 'Nature', 'League', 'Horde'];

  const getModeIcon = (modeType: string) => {
    switch (modeType) {
      case 'overall': return <Trophy size={20} />;
      case 'pve': return <Shield size={20} />;
      case 'pvp': return <Swords size={20} />;
      case 'boss': return <Skull size={20} />;
      default: return <TrendingUp size={20} />;
    }
  };

  const getModeDescription = () => {
    switch (mode) {
      case 'overall': return 'General performance across all game modes';
      case 'pve': return 'Campaign, story missions, and PvE content';
      case 'pvp': return 'Arena, battlegrounds, and player vs player';
      case 'boss': return 'Boss fights and raid content';
      default: return '';
    }
  };

  return (
    <div style={{ padding: '20px 0' }}>
      {/* Header */}
      <div style={{ marginBottom: 24, padding: '0 20px' }}>
        <h1 style={{
          fontSize: 28,
          fontWeight: 700,
          marginBottom: 8,
          display: 'flex',
          alignItems: 'center',
          gap: 12
        }}>
          <Trophy size={32} color="var(--ios-orange)" />
          Hero Tier List
        </h1>
        <p style={{ color: 'var(--ios-text-secondary)', fontSize: 15 }}>
          Community-driven rankings • Updated regularly
        </p>
      </div>

      {/* Mode Selector */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 8,
        padding: '0 20px',
        marginBottom: 16
      }}>
        {['overall', 'pve', 'pvp', 'boss'].map(modeType => (
          <button
            key={modeType}
            onClick={() => setMode(modeType as any)}
            style={{
              padding: '12px 8px',
              background: mode === modeType ? 'var(--ios-blue)' : 'var(--ios-card-bg)',
              color: mode === modeType ? 'white' : 'var(--ios-text-primary)',
              border: mode === modeType ? 'none' : '1px solid var(--ios-border)',
              borderRadius: 10,
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 6,
              transition: 'all 0.2s'
            }}
          >
            {getModeIcon(modeType)}
            <span style={{ textTransform: 'capitalize' }}>{modeType}</span>
          </button>
        ))}
      </div>

      {/* Mode Description */}
      <div style={{
        background: 'var(--ios-blue-tint)',
        border: '1px solid var(--ios-blue)',
        borderRadius: 12,
        padding: 12,
        margin: '0 20px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: 10
      }}>
        <Info size={18} color="var(--ios-blue)" />
        <span style={{ fontSize: 14, color: 'var(--ios-blue)' }}>
          {getModeDescription()}
        </span>
      </div>

      {/* Faction Filter */}
      <div style={{
        display: 'flex',
        gap: 8,
        padding: '0 20px',
        marginBottom: 24,
        overflowX: 'auto'
      }}>
        {factions.map(faction => (
          <button
            key={faction}
            onClick={() => setSelectedFaction(faction)}
            style={{
              padding: '8px 16px',
              background: selectedFaction === faction ? 'var(--ios-blue)' : 'var(--ios-grouped-bg)',
              color: selectedFaction === faction ? 'white' : 'var(--ios-text-primary)',
              border: 'none',
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s'
            }}
          >
            {faction === 'all' ? 'All Factions' : faction}
          </button>
        ))}
      </div>

      {/* Tier List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {tierOrder.map(tier => {
          const heroesInTier = heroesGroupedByTier[tier] || [];
          if (heroesInTier.length === 0) return null;

          const config = tierConfig[tier as keyof typeof tierConfig];

          return (
            <div key={tier} style={{ padding: '0 20px' }}>
              {/* Tier Header */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                marginBottom: 12
              }}>
                <div style={{
                  width: 60,
                  height: 60,
                  background: config.bg,
                  borderRadius: 12,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 24,
                  fontWeight: 800,
                  color: 'white',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                }}>
                  {config.label}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 20, fontWeight: 700, color: config.color }}>
                    {tier === 'S+' && 'Meta Defining'}
                    {tier === 'S' && 'Excellent'}
                    {tier === 'A+' && 'Very Strong'}
                    {tier === 'A' && 'Strong'}
                    {tier === 'B' && 'Good'}
                    {tier === 'C' && 'Average'}
                    {tier === 'D' && 'Below Average'}
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--ios-text-secondary)' }}>
                    {heroesInTier.length} {heroesInTier.length === 1 ? 'hero' : 'heroes'}
                  </div>
                </div>
              </div>

              {/* Heroes in Tier */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
                gap: 12
              }}>
                {heroesInTier.map(hero => (
                  <div
                    key={hero.id}
                    onClick={() => navigate(`/heroes/${hero.id}`)}
                    style={{
                      background: 'var(--ios-card-bg)',
                      border: '1px solid var(--ios-border)',
                      borderRadius: 12,
                      padding: 12,
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      position: 'relative',
                      overflow: 'hidden'
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
                    {/* Tier Badge */}
                    <div style={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      width: 28,
                      height: 28,
                      background: config.bg,
                      borderRadius: 6,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 12,
                      fontWeight: 800,
                      color: 'white',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
                    }}>
                      {config.label}
                    </div>

                    {/* Portrait */}
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
                        background: `url(${hero.portrait}) center/cover`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                      }} />
                    </div>

                    {/* Name */}
                    <div style={{
                      fontSize: 14,
                      fontWeight: 600,
                      marginBottom: 4,
                      textAlign: 'center',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {hero.name}
                    </div>

                    {/* Faction */}
                    <div style={{
                      fontSize: 11,
                      color: 'var(--ios-text-secondary)',
                      textAlign: 'center'
                    }}>
                      {hero.faction}
                    </div>

                    {/* Role Pills */}
                    {hero.enhanced?.role_rating && (
                      <div style={{
                        marginTop: 8,
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: 4,
                        justifyContent: 'center'
                      }}>
                        {Object.entries(hero.enhanced.role_rating)
                          .filter(([_, value]) => (value as number) >= 70)
                          .slice(0, 2)
                          .map(([role]) => (
                            <span
                              key={role}
                              style={{
                                fontSize: 10,
                                padding: '2px 6px',
                                background: 'var(--ios-blue-tint)',
                                color: 'var(--ios-blue)',
                                borderRadius: 4,
                                fontWeight: 600
                              }}
                            >
                              {role}
                            </span>
                          ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Note */}
      <div style={{
        marginTop: 32,
        padding: 20,
        background: 'var(--ios-grouped-bg)',
        borderRadius: 12,
        margin: '32px 20px 0'
      }}>
        <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 8 }}>
          About Tier Rankings
        </h3>
        <p style={{
          fontSize: 13,
          color: 'var(--ios-text-secondary)',
          lineHeight: 1.6,
          margin: 0
        }}>
          Tier lists are based on overall performance, ease of use, and meta relevance. Individual hero performance can vary greatly based on team composition, gear, and player skill. Use this as a guide, not an absolute rule.
        </p>
      </div>
    </div>
  );
};

export default TierListView;
