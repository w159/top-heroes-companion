import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Clock, Zap, Target, TrendingUp } from 'lucide-react';

interface SkillCardEnhancedProps {
  skill: {
    name: string;
    type: string;
    description?: string;
    tips?: string;
    cooldown?: number;
    energy?: number;
    damage_type?: string;
    range?: string;
    scaling?: string;
    targets?: string;
    effects?: string[];
    icon?: string;
  };
  index: number;
}

const SkillCardEnhanced: React.FC<SkillCardEnhancedProps> = ({ skill, index }) => {
  const [expanded, setExpanded] = useState(false);

  const typeColors: Record<string, string> = {
    'Ultimate': '#FF3B30',
    'Active': '#007AFF',
    'Passive': '#34C759',
    'Skill': '#5856D6'
  };

  const damageColors: Record<string, string> = {
    'Physical': '#FF9500',
    'Magic': '#AF52DE',
    'True': '#FF2D55',
    'Passive': '#8E8E93'
  };

  const typeColor = typeColors[skill.type] || '#007AFF';
  const damageColor = damageColors[skill.damage_type || ''] || '#8E8E93';

  return (
    <div 
      style={{
        background: 'var(--ios-card-bg)',
        border: `2px solid ${typeColor}15`,
        borderRadius: 16,
        overflow: 'hidden',
        transition: 'all 0.2s'
      }}
    >
      {/* Header Bar */}
      <div 
        style={{
          background: `linear-gradient(135deg, ${typeColor}15, ${typeColor}05)`,
          padding: '12px 16px',
          borderBottom: `1px solid ${typeColor}20`,
          display: 'flex',
          alignItems: 'center',
          gap: 12
        }}
      >
        {/* Skill Icon */}
        <div 
          style={{
            width: 48,
            height: 48,
            borderRadius: 12,
            background: `linear-gradient(135deg, ${typeColor}, ${typeColor}CC)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 24,
            boxShadow: `0 4px 12px ${typeColor}40`
          }}
        >
          {skill.icon || '⚔️'}
        </div>

        {/* Skill Name & Type */}
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
            <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700 }}>
              {skill.name}
            </h3>
            <span 
              style={{
                fontSize: 10,
                fontWeight: 800,
                textTransform: 'uppercase',
                color: 'white',
                background: typeColor,
                padding: '3px 8px',
                borderRadius: 6,
                letterSpacing: '0.5px'
              }}
            >
              {skill.type}
            </span>
          </div>
          {skill.damage_type && (
            <span 
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: damageColor,
                display: 'inline-block'
              }}
            >
              {skill.damage_type} DMG
            </span>
          )}
        </div>

        {/* Cooldown & Energy */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'flex-end' }}>
          {skill.cooldown !== undefined && skill.cooldown > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Clock size={14} color="#8E8E93" />
              <span style={{ fontSize: 13, fontWeight: 700, color: '#8E8E93' }}>
                {skill.cooldown}s
              </span>
            </div>
          )}
          {skill.energy !== undefined && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Zap size={14} color="#FF9500" />
              <span style={{ fontSize: 13, fontWeight: 700, color: '#FF9500' }}>
                {skill.energy}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div style={{ padding: 16 }}>
        {/* Scaling & Range Badges */}
        {(skill.scaling || skill.range) && (
          <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
            {skill.scaling && (
              <div 
                style={{
                  background: 'rgba(0, 122, 255, 0.1)',
                  border: '1px solid rgba(0, 122, 255, 0.2)',
                  borderRadius: 8,
                  padding: '6px 10px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6
                }}
              >
                <TrendingUp size={14} color="#007AFF" />
                <span style={{ fontSize: 12, fontWeight: 600, color: '#007AFF' }}>
                  {skill.scaling}
                </span>
              </div>
            )}
            {skill.range && (
              <div 
                style={{
                  background: 'rgba(88, 86, 214, 0.1)',
                  border: '1px solid rgba(88, 86, 214, 0.2)',
                  borderRadius: 8,
                  padding: '6px 10px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6
                }}
              >
                <Target size={14} color="#5856D6" />
                <span style={{ fontSize: 12, fontWeight: 600, color: '#5856D6' }}>
                  {skill.range}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Description */}
        {skill.description && (
          <p style={{ 
            margin: '0 0 12px', 
            fontSize: 14, 
            lineHeight: 1.5,
            color: 'var(--ios-text-primary)'
          }}>
            {skill.description}
          </p>
        )}

        {/* Effects Pills */}
        {skill.effects && skill.effects.length > 0 && (
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
            {skill.effects.map((effect, i) => (
              <span
                key={i}
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: typeColor,
                  background: `${typeColor}10`,
                  padding: '4px 10px',
                  borderRadius: 12,
                  border: `1px solid ${typeColor}30`
                }}
              >
                {effect}
              </span>
            ))}
          </div>
        )}

        {/* Expandable Tips Section */}
        {skill.tips && (
          <>
            <button
              onClick={() => setExpanded(!expanded)}
              style={{
                width: '100%',
                background: 'var(--ios-background)',
                border: '1px solid var(--ios-separator)',
                borderRadius: 10,
                padding: '10px 12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                marginTop: 8
              }}
            >
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--ios-blue)' }}>
                💡 Strategy Tips
              </span>
              {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
            
            {expanded && (
              <div
                style={{
                  marginTop: 8,
                  padding: 12,
                  background: 'var(--ios-background)',
                  borderRadius: 10,
                  border: '1px solid var(--ios-separator)'
                }}
              >
                <p style={{ 
                  margin: 0, 
                  fontSize: 13, 
                  lineHeight: 1.6,
                  color: 'var(--ios-text-secondary)',
                  fontStyle: 'italic'
                }}>
                  {skill.tips}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SkillCardEnhanced;
