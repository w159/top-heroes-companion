import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Clock, Zap, Target, TrendingUp } from 'lucide-react';
import { Badge } from '../../../shared/ui/components/badge';
import { cn } from '../../../shared/lib/utils';

interface SkillCardProps {
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

const TYPE_CLASSES: Record<string, { text: string; bg: string; border: string; badge: string }> = {
  'Ultimate': {
    text: 'text-error-400',
    bg: 'bg-error-500/10',
    border: 'border-error-500/20',
    badge: 'bg-error-500 text-white',
  },
  'Active': {
    text: 'text-primary-400',
    bg: 'bg-primary-500/10',
    border: 'border-primary-500/20',
    badge: 'bg-primary-500 text-white',
  },
  'Passive': {
    text: 'text-success-400',
    bg: 'bg-success-500/10',
    border: 'border-success-500/20',
    badge: 'bg-success-500 text-white',
  },
  'Skill': {
    text: 'text-tertiary-400',
    bg: 'bg-tertiary-500/10',
    border: 'border-tertiary-500/20',
    badge: 'bg-tertiary-500 text-white',
  },
};

const DAMAGE_CLASSES: Record<string, string> = {
  'Physical': 'text-warning-400',
  'Magic': 'text-tertiary-400',
  'True': 'text-error-400',
  'Passive': 'text-muted-foreground',
};

const DEFAULT_TYPE = TYPE_CLASSES['Active'];

const SkillCard: React.FC<SkillCardProps> = ({ skill, index }) => {
  const [expanded, setExpanded] = useState(false);

  const typeStyle = TYPE_CLASSES[skill.type] || DEFAULT_TYPE;
  const damageColorClass = DAMAGE_CLASSES[skill.damage_type || ''] || 'text-muted-foreground';

  return (
    <div className={cn(
      'bg-surface-800/80 border-2 rounded-2xl overflow-hidden transition-all',
      typeStyle.border
    )}>
      {/* Header Bar */}
      <div className={cn(
        'p-3 border-b flex items-center gap-3',
        typeStyle.bg,
        typeStyle.border
      )}>
        {/* Skill Icon */}
        <div className={cn(
          'w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-lg',
          typeStyle.badge
        )}>
          {skill.icon || '\u2694\uFE0F'}
        </div>

        {/* Skill Name & Type */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <h3 className="text-title-md font-bold truncate">{skill.name}</h3>
            <Badge size="sm" className={cn('font-bold uppercase tracking-wide', typeStyle.badge)}>
              {skill.type}
            </Badge>
          </div>
          {skill.damage_type && (
            <span className={cn('text-label-sm font-semibold', damageColorClass)}>
              {skill.damage_type} DMG
            </span>
          )}
        </div>

        {/* Cooldown & Energy */}
        <div className="flex flex-col gap-1 items-end">
          {skill.cooldown !== undefined && skill.cooldown > 0 && (
            <div className="flex items-center gap-1">
              <Clock size={14} className="text-muted-foreground" />
              <span className="text-body-sm font-bold text-muted-foreground">
                {skill.cooldown}s
              </span>
            </div>
          )}
          {skill.energy !== undefined && (
            <div className="flex items-center gap-1">
              <Zap size={14} className="text-warning-400" />
              <span className="text-body-sm font-bold text-warning-400">
                {skill.energy}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4">
        {/* Scaling & Range Badges */}
        {(skill.scaling || skill.range) && (
          <div className="flex gap-2 mb-3 flex-wrap">
            {skill.scaling && (
              <div className="bg-primary-500/10 border border-primary-500/20 rounded-lg px-2.5 py-1.5 flex items-center gap-1.5">
                <TrendingUp size={14} className="text-primary-400" />
                <span className="text-label-sm font-semibold text-primary-400">
                  {skill.scaling}
                </span>
              </div>
            )}
            {skill.range && (
              <div className="bg-tertiary-500/10 border border-tertiary-500/20 rounded-lg px-2.5 py-1.5 flex items-center gap-1.5">
                <Target size={14} className="text-tertiary-400" />
                <span className="text-label-sm font-semibold text-tertiary-400">
                  {skill.range}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Description */}
        {skill.description && (
          <p className="text-body-md leading-relaxed text-foreground mb-3">
            {skill.description}
          </p>
        )}

        {/* Effects Pills */}
        {skill.effects && skill.effects.length > 0 && (
          <div className="flex gap-1.5 flex-wrap mb-3">
            {skill.effects.map((effect, i) => (
              <span
                key={i}
                className={cn(
                  'text-label-sm font-bold px-2.5 py-1 rounded-full border',
                  typeStyle.text,
                  typeStyle.bg,
                  typeStyle.border
                )}
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
              className={cn(
                'w-full bg-surface-900 border border-border rounded-xl',
                'px-3 py-2.5 flex items-center justify-between',
                'cursor-pointer mt-2 hover:bg-surface-800 transition-colors'
              )}
            >
              <span className="text-body-sm font-semibold text-primary-400">
                Strategy Tips
              </span>
              {expanded ? <ChevronUp size={18} className="text-muted-foreground" /> : <ChevronDown size={18} className="text-muted-foreground" />}
            </button>

            {expanded && (
              <div className="mt-2 p-3 bg-surface-900 rounded-xl border border-border">
                <p className="text-body-sm leading-relaxed text-muted-foreground italic">
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

export default SkillCard;
