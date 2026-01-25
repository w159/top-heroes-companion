import React, { useState } from 'react';
import { BookOpen, Zap, Users, Trophy, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import gameGuides from '../../../data/gameGuides.json';
import eventGuides from '../../../data/eventGuides.json';

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
    <div style={{ padding: '20px', maxWidth: '900px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{
          fontSize: '28px',
          fontWeight: 700,
          marginBottom: '8px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <BookOpen size={32} color="var(--ios-blue)" />
          Game Guides
        </h1>
        <p style={{ color: 'var(--ios-text-secondary)', fontSize: '15px' }}>
          Comprehensive strategies from community experts
        </p>
      </div>

      {/* Core Principles */}
      <Section
        title="Core Gameplay Principles"
        icon={<Zap size={20} />}
        isExpanded={expandedSection === 'principles'}
        onToggle={() => toggleSection('principles')}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {gameGuides.corePrinciples.principles.map((principle, idx) => (
            <div key={idx} style={{
              background: principle.importance === 'critical' ? 'var(--ios-red-tint)' : 'var(--ios-grouped-bg)',
              border: `2px solid ${principle.importance === 'critical' ? 'var(--ios-red)' : 'var(--ios-border)'}`,
              borderRadius: '12px',
              padding: '16px'
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                {principle.importance === 'critical' && (
                  <span style={{ fontSize: '24px' }}>⚠️</span>
                )}
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '17px', fontWeight: 600, marginBottom: '8px' }}>
                    {principle.title}
                  </h3>
                  <p style={{ fontSize: '15px', color: 'var(--ios-text-secondary)', marginBottom: '8px' }}>
                    {principle.description}
                  </p>
                  <p style={{ fontSize: '14px', color: 'var(--ios-text-tertiary)', fontStyle: 'italic', marginBottom: '12px' }}>
                    Why: {principle.reasoning}
                  </p>
                  <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '14px' }}>
                    {principle.tips.map((tip, tipIdx) => (
                      <li key={tipIdx} style={{ marginBottom: '4px' }}>{tip}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Beginner Guide */}
      <Section
        title="New Player Roadmap (10 Steps)"
        icon={<BookOpen size={20} />}
        isExpanded={expandedSection === 'beginner'}
        onToggle={() => toggleSection('beginner')}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {gameGuides.beginnerGuide.steps.map((step) => (
            <div key={step.step} style={{
              background: 'var(--ios-card-bg)',
              border: `2px solid ${step.priority === 'critical' ? 'var(--ios-red)' : 'var(--ios-blue)'}`,
              borderRadius: '12px',
              padding: '16px'
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <div style={{
                  minWidth: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: step.priority === 'critical' ? 'var(--ios-red)' : 'var(--ios-blue)',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '16px'
                }}>
                  {step.step}
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '17px', fontWeight: 600, marginBottom: '8px' }}>
                    {step.title}
                  </h3>
                  <p style={{ fontSize: '15px', color: 'var(--ios-text-secondary)', marginBottom: '12px' }}>
                    {step.description}
                  </p>
                  {step.rewards && (
                    <div style={{
                      background: 'var(--ios-green-tint)',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      marginBottom: '12px',
                      fontSize: '14px',
                      color: 'var(--ios-green)'
                    }}>
                      🎁 Rewards: {step.rewards}
                    </div>
                  )}
                  {step.tips && (
                    <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '14px' }}>
                      {step.tips.map((tip, idx) => (
                        <li key={idx} style={{ marginBottom: '4px' }}>{tip}</li>
                      ))}
                    </ul>
                  )}
                  {step.tasks && (
                    <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '14px' }}>
                      {step.tasks.map((task, idx) => (
                        <li key={idx} style={{ marginBottom: '4px' }}>{task}</li>
                      ))}
                    </ul>
                  )}
                  {step.order && (
                    <ol style={{ margin: 0, paddingLeft: '20px', fontSize: '14px' }}>
                      {step.order.map((item, idx) => (
                        <li key={idx} style={{ marginBottom: '4px' }}>{item}</li>
                      ))}
                    </ol>
                  )}
                  {step.priorities && (
                    <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '14px' }}>
                      {step.priorities.map((priority, idx) => (
                        <li key={idx} style={{ marginBottom: '4px' }}>{priority}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Faction Guide */}
      <Section
        title="Faction Strategy Guide"
        icon={<Users size={20} />}
        isExpanded={expandedSection === 'factions'}
        onToggle={() => toggleSection('factions')}
      >
        <div style={{
          background: 'var(--ios-blue-tint)',
          border: '2px solid var(--ios-blue)',
          borderRadius: '12px',
          padding: '16px',
          marginBottom: '16px'
        }}>
          <h3 style={{ fontSize: '17px', fontWeight: 600, marginBottom: '8px' }}>
            🎯 {gameGuides.factionGuide.system.name}
          </h3>
          <p style={{ fontSize: '15px', marginBottom: '8px' }}>
            {gameGuides.factionGuide.system.description}
          </p>
          <p style={{ fontSize: '14px', color: 'var(--ios-text-secondary)' }}>
            {gameGuides.factionGuide.system.damageBonus}
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {gameGuides.factionGuide.factions.map((faction) => (
            <div key={faction.name} style={{
              background: 'var(--ios-card-bg)',
              border: '2px solid var(--ios-border)',
              borderRadius: '12px',
              padding: '16px'
            }}>
              <h3 style={{ fontSize: '19px', fontWeight: 700, marginBottom: '8px' }}>
                {faction.name}
              </h3>
              <p style={{ fontSize: '15px', color: 'var(--ios-text-secondary)', marginBottom: '16px' }}>
                {faction.description}
              </p>

              {/* Key Hero */}
              <div style={{
                background: 'var(--ios-yellow-tint)',
                border: '1px solid var(--ios-yellow)',
                borderRadius: '8px',
                padding: '12px',
                marginBottom: '16px'
              }}>
                <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--ios-yellow)', marginBottom: '4px' }}>
                  ⭐ KEY HERO: {faction.keyHero.name}
                </div>
                <div style={{ fontSize: '14px', marginBottom: '4px' }}>
                  Role: {faction.keyHero.role}
                </div>
                <div style={{ fontSize: '14px', color: 'var(--ios-text-secondary)' }}>
                  {faction.keyHero.description}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                <div>
                  <h4 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '8px', color: 'var(--ios-green)' }}>
                    ✓ Strengths
                  </h4>
                  <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '14px' }}>
                    {faction.strengths.map((strength, idx) => (
                      <li key={idx} style={{ marginBottom: '4px' }}>{strength}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '8px', color: 'var(--ios-red)' }}>
                    ✗ Weaknesses
                  </h4>
                  <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '14px' }}>
                    {faction.weaknesses.map((weakness, idx) => (
                      <li key={idx} style={{ marginBottom: '4px' }}>{weakness}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div style={{
                background: 'var(--ios-grouped-bg)',
                borderRadius: '8px',
                padding: '12px',
                marginBottom: '12px'
              }}>
                <div style={{ fontSize: '15px', fontWeight: 600, marginBottom: '8px' }}>
                  Recommended Lineup
                </div>
                <div style={{ fontSize: '14px' }}>
                  <div><strong>Front:</strong> {faction.recommendedLineup.front.join(', ')}</div>
                  <div><strong>Middle:</strong> {faction.recommendedLineup.middle.join(', ')}</div>
                  <div><strong>Back:</strong> {faction.recommendedLineup.back.join(', ')}</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', fontSize: '14px' }}>
                <div>
                  <strong>Cost:</strong> {faction.buildingCost}
                </div>
              </div>
              <div style={{ marginTop: '8px', fontSize: '14px' }}>
                <strong>Best For:</strong> {faction.bestFor.join(', ')}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Event Guides */}
      <Section
        title="Event Strategies"
        icon={<Trophy size={20} />}
        isExpanded={expandedSection === 'events'}
        onToggle={() => toggleSection('events')}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {eventGuides.events.map((event) => (
            <div key={event.id} style={{
              background: 'var(--ios-card-bg)',
              border: '2px solid var(--ios-border)',
              borderRadius: '12px',
              overflow: 'hidden'
            }}>
              <div
                onClick={() => toggleEvent(event.id)}
                style={{
                  padding: '16px',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: 'var(--ios-grouped-bg)'
                }}
              >
                <div>
                  <h3 style={{ fontSize: '17px', fontWeight: 600, marginBottom: '4px' }}>
                    {event.name}
                  </h3>
                  <p style={{ fontSize: '14px', color: 'var(--ios-text-secondary)' }}>
                    {event.type} • {event.frequency}
                  </p>
                </div>
                {expandedEvent === event.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </div>

              {expandedEvent === event.id && (
                <div style={{ padding: '16px' }}>
                  <p style={{ fontSize: '15px', marginBottom: '16px' }}>
                    {event.description}
                  </p>

                  {event.stages && (
                    <div>
                      <h4 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px' }}>
                        Event Stages
                      </h4>
                      {event.stages.map((stage) => (
                        <div key={stage.stage} style={{
                          background: 'var(--ios-grouped-bg)',
                          borderRadius: '8px',
                          padding: '12px',
                          marginBottom: '12px'
                        }}>
                          <div style={{ fontSize: '15px', fontWeight: 600, marginBottom: '8px' }}>
                            Stage {stage.stage}: {stage.name}
                          </div>
                          <div style={{ fontSize: '14px', color: 'var(--ios-text-secondary)', marginBottom: '8px' }}>
                            Focus: {stage.focus}
                          </div>
                          <div style={{ fontSize: '14px', marginBottom: '8px' }}>
                            <strong>Strategy:</strong> {stage.strategy}
                          </div>
                          <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '14px' }}>
                            {stage.tips.map((tip, idx) => (
                              <li key={idx} style={{ marginBottom: '4px' }}>{tip}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  )}

                  {event.dailySchedule && (
                    <div>
                      <h4 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px' }}>
                        Daily Schedule
                      </h4>
                      {event.dailySchedule.map((day, idx) => (
                        <div key={idx} style={{
                          background: 'var(--ios-grouped-bg)',
                          borderRadius: '8px',
                          padding: '12px',
                          marginBottom: '8px'
                        }}>
                          <div style={{ fontSize: '15px', fontWeight: 600, marginBottom: '4px' }}>
                            {day.day}: {day.focus}
                          </div>
                          <div style={{ fontSize: '14px' }}>
                            {day.strategy}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {event.strategy && (
                    <div style={{
                      background: 'var(--ios-blue-tint)',
                      borderRadius: '8px',
                      padding: '12px',
                      marginTop: '12px'
                    }}>
                      <h4 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '8px' }}>
                        💡 Pro Tips
                      </h4>
                      {Array.isArray(event.strategy.tips) ? (
                        <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '14px' }}>
                          {event.strategy.tips.map((tip, idx) => (
                            <li key={idx} style={{ marginBottom: '4px' }}>{tip}</li>
                          ))}
                        </ul>
                      ) : (
                        <div style={{ fontSize: '14px' }}>
                          {event.strategy.early_game && <div><strong>Early:</strong> {event.strategy.early_game}</div>}
                          {event.strategy.mid_game && <div><strong>Mid:</strong> {event.strategy.mid_game}</div>}
                          {event.strategy.late_game && <div><strong>Late:</strong> {event.strategy.late_game}</div>}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </Section>

      {/* Resources */}
      <div style={{
        marginTop: '32px',
        padding: '16px',
        background: 'var(--ios-grouped-bg)',
        borderRadius: '12px'
      }}>
        <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '12px' }}>
          External Resources
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <a
            href="https://topheroes.info/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: 'var(--ios-blue)',
              fontSize: '14px',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <ExternalLink size={14} />
            TopHeroes.info - Comprehensive Guides & Tools
          </a>
          <a
            href="https://www.reddit.com/r/TopHeroes"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: 'var(--ios-blue)',
              fontSize: '14px',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <ExternalLink size={14} />
            r/TopHeroes - Community Discussion
          </a>
          <a
            href="https://topheroes1.fandom.com/wiki/Top_Heroes_Wiki"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: 'var(--ios-blue)',
              fontSize: '14px',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <ExternalLink size={14} />
            Top Heroes Wiki - Hero Database
          </a>
        </div>
      </div>
    </div>
  );
};

// Reusable Section Component
const Section: React.FC<{
  title: string;
  icon: React.ReactNode;
  isExpanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}> = ({ title, icon, isExpanded, onToggle, children }) => {
  return (
    <div style={{
      background: 'var(--ios-card-bg)',
      border: '1px solid var(--ios-border)',
      borderRadius: '12px',
      marginBottom: '16px',
      overflow: 'hidden'
    }}>
      <div
        onClick={onToggle}
        style={{
          padding: '16px',
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'var(--ios-grouped-bg)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {icon}
          <h2 style={{ fontSize: '19px', fontWeight: 600, margin: 0 }}>
            {title}
          </h2>
        </div>
        {isExpanded ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
      </div>
      {isExpanded && (
        <div style={{ padding: '16px' }}>
          {children}
        </div>
      )}
    </div>
  );
};

export default Guides;
