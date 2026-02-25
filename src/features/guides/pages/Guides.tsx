import React, { useState } from 'react';
import { BookOpen, Zap, Users, Trophy } from 'lucide-react';
import { Section } from '../components/Section';
import { CorePrinciples } from '../components/CorePrinciples';
import { BeginnerGuide } from '../components/BeginnerGuide';
import { FactionGuide } from '../components/FactionGuide';
import { EventGuides } from '../components/EventGuides';
import { ExternalResources } from '../components/ExternalResources';

const Guides: React.FC = () => {
  const [expandedSection, setExpandedSection] = useState<string | null>('beginner');
  const [expandedEvent, setExpandedEvent] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const toggleEvent = (eventId: string) => {
    setExpandedEvent(expandedEvent === eventId ? null : eventId);
  };

  return (
    <div className="space-y-6 animate-in">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-tertiary-500 to-tertiary-600 flex items-center justify-center shadow-lg shadow-tertiary-500/30">
          <BookOpen className="w-7 h-7 text-white" />
        </div>
        <div>
          <h1 className="text-headline-lg font-bold">Game Guides</h1>
          <p className="text-body-md text-muted-foreground">
            Comprehensive strategies from community experts
          </p>
        </div>
      </div>

      {/* Core Principles */}
      <Section
        title="Core Gameplay Principles"
        icon={<Zap className="w-5 h-5" />}
        iconColor="text-gold-400"
        isExpanded={expandedSection === 'principles'}
        onToggle={() => toggleSection('principles')}
      >
        <CorePrinciples />
      </Section>

      {/* Beginner Guide */}
      <Section
        title="New Player Roadmap (10 Steps)"
        icon={<BookOpen className="w-5 h-5" />}
        iconColor="text-primary-400"
        isExpanded={expandedSection === 'beginner'}
        onToggle={() => toggleSection('beginner')}
      >
        <BeginnerGuide />
      </Section>

      {/* Faction Guide */}
      <Section
        title="Faction Strategy Guide"
        icon={<Users className="w-5 h-5" />}
        iconColor="text-tertiary-400"
        isExpanded={expandedSection === 'factions'}
        onToggle={() => toggleSection('factions')}
      >
        <FactionGuide />
      </Section>

      {/* Event Guides */}
      <Section
        title="Event Strategies"
        icon={<Trophy className="w-5 h-5" />}
        iconColor="text-gold-400"
        isExpanded={expandedSection === 'events'}
        onToggle={() => toggleSection('events')}
      >
        <EventGuides expandedEvent={expandedEvent} onToggleEvent={toggleEvent} />
      </Section>

      {/* External Resources */}
      <ExternalResources />
    </div>
  );
};

export default Guides;
