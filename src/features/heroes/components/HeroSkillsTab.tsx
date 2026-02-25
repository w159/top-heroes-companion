import React from 'react';
import { Zap } from 'lucide-react';
import SkillCard from './SkillCard';
import { Card, CardContent } from '../../../shared/ui/components/card';
import { Badge } from '../../../shared/ui/components/badge';

interface DetailSkill {
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
}

interface BasicSkill {
  name: string;
  type: string;
  description?: string;
  tips?: string;
}

interface HeroSkillsTabProps {
  detailSkills: DetailSkill[] | undefined;
  basicSkills: BasicSkill[];
  hasDetailData: boolean;
}

const HeroSkillsTab: React.FC<HeroSkillsTabProps> = ({
  detailSkills,
  basicSkills,
  hasDetailData,
}) => (
  <div className="space-y-4">
    {hasDetailData && detailSkills ? (
      detailSkills.map((skill, index) => (
        <SkillCard key={index} skill={skill} index={index} />
      ))
    ) : (
      basicSkills.map((skill, index) => (
        <Card key={index} variant="filled">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-title-md font-semibold">{skill.name}</h3>
              <Badge variant="primary" size="sm">{skill.type}</Badge>
            </div>
            <p className="text-body-md text-muted-foreground mb-3">
              {skill.description || 'No description available.'}
            </p>
            {skill.tips && (
              <div className="bg-surface-800/50 rounded-lg p-3">
                <p className="text-body-sm text-muted-foreground italic flex items-start gap-2">
                  <Zap className="w-4 h-4 text-gold-400 mt-0.5 flex-shrink-0" />
                  {skill.tips}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      ))
    )}
    {basicSkills.length === 0 && !hasDetailData && (
      <Card variant="outlined" className="text-center py-12">
        <p className="text-body-md text-muted-foreground italic">No skill data available.</p>
      </Card>
    )}
  </div>
);

export default HeroSkillsTab;
