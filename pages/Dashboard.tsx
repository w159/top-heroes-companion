import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Trophy,
  TrendingUp,
  ArrowUpRight,
  Shield,
  Zap,
  Sword,
  Target,
  Calendar,
  Users,
  Star,
  Activity,
  BarChart3,
  Clock,
  Sparkles,
  Award,
  Flame
} from 'lucide-react';
import { useUserData } from '../utils';
import {
  recommendHeroUpgrades,
  recommendResourcePlan,
  simulateProgression
} from '../utils/recommendations';
import {
  addProgressSnapshot,
  calculateProgressTrend,
  calculateTotalInfluence
} from '../utils';
import '../styles/design-system.css';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { userData, updateUserData } = useUserData();

  // Calculate metrics
  const totalInfluence = calculateTotalInfluence(userData);
  const snapshots = userData.progressLog || [];
  const trendPercentage = calculateProgressTrend(snapshots);
  const upgrades = recommendHeroUpgrades(userData, 3);
  const resourcePlan = recommendResourcePlan(userData);
  const simulation = simulateProgression({ days: 30, userData });

  // Mock data for demonstration (replace with real data)
  const recentAchievements = [
    { name: 'First S-Tier Hero', icon: Star, rarity: 'gold' },
    { name: 'Team Power 1M', icon: Trophy, rarity: 'primary' },
    { name: 'Event Champion', icon: Award, rarity: 'gold' }
  ];

  const activeEvents = [
    { name: 'Guild War', endsIn: '2h 45m', rewards: 'Epic Gear', priority: 'high' },
    { name: 'Hero Trial', endsIn: '1d 5h', rewards: 'Summon Tickets', priority: 'medium' },
    { name: 'Daily Challenges', endsIn: '8h 12m', rewards: 'Resources', priority: 'low' }
  ];

  const quickStats = [
    { label: 'Total Heroes', value: '42', icon: Shield, change: '+3' },
    { label: 'Team Power', value: `${(totalInfluence / 1000000).toFixed(2)}M`, icon: Zap, change: `+${trendPercentage.toFixed(1)}%` },
    { label: 'Guild Rank', value: '#127', icon: Users, change: '+12' },
    { label: 'Daily Login', value: '47', icon: Calendar, change: 'Streak' }
  ];

  return (
    <div style={{ paddingBottom: 'var(--space-4xl)' }} className="animate-fadeIn">
      {/* Hero Section - Welcome Banner */}
      <div className="card card-glass" style={{
        marginBottom: 'var(--space-2xl)',
        padding: 'var(--space-2xl)',
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, rgba(0, 212, 255, 0.1) 0%, rgba(10, 14, 26, 0.9) 50%)',
        border: '1px solid var(--color-primary)'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '40%',
          height: '100%',
          background: 'var(--gradient-radial-glow)',
          opacity: 0.3,
          pointerEvents: 'none'
        }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 'var(--space-lg)' }}>
            <div>
              <div style={{
                fontSize: 'var(--text-sm)',
                color: 'var(--color-text-tertiary)',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                marginBottom: 'var(--space-sm)'
              }}>
                Welcome Back, Commander
              </div>
              <h1 className="font-display" style={{
                fontSize: 'var(--text-4xl)',
                margin: 0,
                marginBottom: 'var(--space-md)'
              }}>
                COMMAND CENTER
              </h1>
              <p style={{
                fontSize: 'var(--text-base)',
                color: 'var(--color-text-secondary)',
                maxWidth: '600px'
              }}>
                Server {userData.settings.serverGroup} • {userData.settings.mainFaction} Faction
              </p>
            </div>

            <button className="btn btn-gold btn-lg" onClick={() => navigate('/heroes')}>
              <Shield size={20} />
              View Heroes
              <ArrowUpRight size={18} />
            </button>
          </div>

          {/* Quick Stats Row */}
          <div className="grid grid-4" style={{ marginTop: 'var(--space-2xl)' }}>
            {quickStats.map((stat, i) => (
              <div key={i} style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-md)',
                padding: 'var(--space-lg)',
                background: 'rgba(18, 24, 38, 0.5)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--color-border)'
              }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: 'var(--radius-lg)',
                  background: 'var(--gradient-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <stat.icon size={24} color="white" strokeWidth={2.5} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: 'var(--text-xs)',
                    color: 'var(--color-text-tertiary)',
                    marginBottom: '2px'
                  }}>
                    {stat.label}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--space-sm)' }}>
                    <span className="font-heading" style={{ fontSize: 'var(--text-xl)' }}>{stat.value}</span>
                    <span className="badge badge-success" style={{ fontSize: '10px' }}>{stat.change}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid" style={{
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
        gap: 'var(--space-xl)'
      }}>
        {/* Power Progression Card */}
        <div className="card" style={{ gridColumn: 'span 1' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 'var(--space-xl)' }}>
            <div>
              <h3 className="font-heading" style={{
                fontSize: 'var(--text-lg)',
                color: 'var(--color-text-tertiary)',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                marginBottom: 'var(--space-sm)'
              }}>
                Total Influence
              </h3>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--space-md)' }}>
                <span className="font-display text-gradient-primary" style={{ fontSize: 'var(--text-4xl)' }}>
                  {(totalInfluence / 1000000).toFixed(2)}M
                </span>
                <div className={trendPercentage >= 0 ? 'badge badge-success' : 'badge badge-danger'} style={{ padding: 'var(--space-sm) var(--space-md)' }}>
                  <TrendingUp size={14} />
                  {trendPercentage > 0 ? '+' : ''}{trendPercentage.toFixed(1)}%
                </div>
              </div>
            </div>
            <button className="btn btn-ghost btn-sm">
              <Activity size={16} />
              Track
            </button>
          </div>

          {/* Progress Visual */}
          <div style={{
            height: '80px',
            background: 'var(--color-bg-tertiary)',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--space-lg)',
            marginBottom: 'var(--space-xl)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
              width: `${Math.min((trendPercentage + 50) * 2, 100)}%`,
              background: 'var(--gradient-primary)',
              opacity: 0.2,
              transition: 'width 1s ease-out'
            }} />
            <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '100%' }}>
              <div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', marginBottom: '4px' }}>Current</div>
                <div className="font-heading" style={{ fontSize: 'var(--text-lg)' }}>{(totalInfluence / 1000000).toFixed(2)}M</div>
              </div>
              <ArrowUpRight size={24} color="var(--color-primary)" />
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', marginBottom: '4px' }}>30-Day Projection</div>
                <div className="font-heading" style={{ fontSize: 'var(--text-lg)' }}>{(simulation.projectedTotalInfluence / 1000000).toFixed(2)}M</div>
              </div>
            </div>
          </div>

          {/* Growth Insights */}
          <div style={{
            padding: 'var(--space-lg)',
            background: 'var(--color-bg-tertiary)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--color-border)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', marginBottom: 'var(--space-md)' }}>
              <Flame size={16} color="var(--color-accent-gold)" />
              <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600 }}>Growth Strategy</span>
            </div>
            <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
              {resourcePlan.spendProfile} spending pattern detected. Focus on {resourcePlan.weeklyFocusEvents.join(', ')} events for optimal progression.
            </div>
          </div>
        </div>

        {/* Priority Upgrades Card */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-xl)' }}>
            <h3 className="font-heading" style={{ fontSize: 'var(--text-xl)', margin: 0 }}>
              Priority Upgrades
            </h3>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate('/roster')}>
              View All
              <ArrowUpRight size={14} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
            {upgrades.length === 0 && (
              <div style={{
                padding: 'var(--space-2xl)',
                textAlign: 'center',
                color: 'var(--color-text-tertiary)',
                background: 'var(--color-bg-tertiary)',
                borderRadius: 'var(--radius-lg)'
              }}>
                <Shield size={48} style={{ opacity: 0.3, marginBottom: 'var(--space-md)' }} />
                <p>No urgent upgrades found. Your roster is optimized!</p>
              </div>
            )}

            {upgrades.map((rec, index) => (
              <div key={rec.heroId} style={{
                display: 'flex',
                gap: 'var(--space-lg)',
                padding: 'var(--space-lg)',
                background: 'var(--color-bg-tertiary)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--color-border)',
                cursor: 'pointer',
                transition: 'all var(--transition-base)',
                position: 'relative',
                overflow: 'hidden'
              }}
                className="card"
                onClick={() => navigate(`/heroes/${rec.heroId}`)}
              >
                {/* Priority Badge */}
                <div style={{
                  position: 'absolute',
                  top: 'var(--space-md)',
                  right: 'var(--space-md)',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: index === 0 ? 'var(--gradient-gold)' : 'var(--gradient-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: 'var(--text-sm)',
                  color: 'white'
                }}>
                  {index + 1}
                </div>

                {/* Hero Avatar */}
                <div style={{
                  width: '72px',
                  height: '72px',
                  borderRadius: 'var(--radius-lg)',
                  background: 'var(--gradient-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 'var(--text-2xl)',
                  fontWeight: 700,
                  flexShrink: 0,
                  boxShadow: 'var(--shadow-glow)'
                }}>
                  {rec.heroName.substring(0, 1)}
                </div>

                {/* Hero Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', marginBottom: 'var(--space-sm)' }}>
                    <h4 className="font-heading" style={{ fontSize: 'var(--text-lg)', margin: 0 }}>{rec.heroName}</h4>
                    <span className="badge badge-primary">Score: {rec.score.toFixed(0)}</span>
                  </div>
                  <p style={{
                    fontSize: 'var(--text-sm)',
                    color: 'var(--color-text-secondary)',
                    margin: 0,
                    marginBottom: 'var(--space-md)'
                  }}>
                    {rec.reason}
                  </p>
                  <div style={{ display: 'flex', gap: 'var(--space-md)', fontSize: 'var(--text-xs)' }}>
                    <div>
                      <span style={{ color: 'var(--color-text-tertiary)' }}>Target: </span>
                      <span className="font-heading" style={{ color: 'var(--color-accent-gold)' }}>Lv.{rec.recommendedLevel}</span>
                    </div>
                    <div style={{ color: 'var(--color-text-tertiary)' }}>•</div>
                    <div>
                      <span style={{ color: 'var(--color-text-tertiary)' }}>Impact: </span>
                      <span style={{ color: 'var(--color-success)' }}>High</span>
                    </div>
                  </div>
                </div>

                <button className="btn btn-primary btn-sm" style={{ alignSelf: 'center' }}>
                  Upgrade
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Active Events Card */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-xl)' }}>
            <h3 className="font-heading" style={{ fontSize: 'var(--text-xl)', margin: 0 }}>
              Active Events
            </h3>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate('/events')}>
              <Calendar size={14} />
              View All
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
            {activeEvents.map((event, i) => (
              <div key={i} style={{
                padding: 'var(--space-lg)',
                background: 'var(--color-bg-tertiary)',
                borderRadius: 'var(--radius-lg)',
                border: `1px solid ${event.priority === 'high' ? 'var(--color-danger)' : event.priority === 'medium' ? 'var(--color-warning)' : 'var(--color-border)'}`,
                transition: 'all var(--transition-base)'
              }}
                className="card"
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 'var(--space-md)' }}>
                  <div>
                    <h4 className="font-heading" style={{ fontSize: 'var(--text-base)', margin: 0, marginBottom: '4px' }}>{event.name}</h4>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>
                      <Clock size={12} />
                      Ends in {event.endsIn}
                    </div>
                  </div>
                  <span className={`badge ${event.priority === 'high' ? 'badge-danger' : event.priority === 'medium' ? 'badge-warning' : 'badge-primary'}`}>
                    {event.priority.toUpperCase()}
                  </span>
                </div>
                <div style={{
                  padding: 'var(--space-md)',
                  background: 'rgba(0, 212, 255, 0.05)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: 'var(--text-sm)'
                }}>
                  <Sparkles size={14} style={{ display: 'inline', marginRight: '6px', color: 'var(--color-accent-gold)' }} />
                  Rewards: <span style={{ color: 'var(--color-accent-gold)', fontWeight: 600 }}>{event.rewards}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Achievements */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-xl)' }}>
            <h3 className="font-heading" style={{ fontSize: 'var(--text-xl)', margin: 0 }}>
              Recent Achievements
            </h3>
            <button className="btn btn-ghost btn-sm">
              <Trophy size={14} />
              View All
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: 'var(--space-md)' }}>
            {recentAchievements.map((achievement, i) => (
              <div key={i} style={{
                padding: 'var(--space-lg)',
                background: 'var(--color-bg-tertiary)',
                borderRadius: 'var(--radius-lg)',
                textAlign: 'center',
                border: `1px solid ${achievement.rarity === 'gold' ? 'var(--color-accent-gold)' : 'var(--color-primary)'}`,
                position: 'relative',
                overflow: 'hidden'
              }}>
                {achievement.rarity === 'gold' && (
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'var(--gradient-gold)',
                    opacity: 0.1
                  }} />
                )}
                <div style={{
                  width: '64px',
                  height: '64px',
                  margin: '0 auto var(--space-md)',
                  borderRadius: '50%',
                  background: achievement.rarity === 'gold' ? 'var(--gradient-gold)' : 'var(--gradient-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: achievement.rarity === 'gold' ? 'var(--shadow-glow-gold)' : 'var(--shadow-glow)',
                  position: 'relative',
                  zIndex: 1
                }}>
                  <achievement.icon size={32} color="white" strokeWidth={2.5} />
                </div>
                <p style={{
                  fontSize: 'var(--text-sm)',
                  fontWeight: 600,
                  margin: 0,
                  position: 'relative',
                  zIndex: 1
                }}>
                  {achievement.name}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Resource Strategy Card */}
        <div className="card card-elevated" style={{ gridColumn: 'span 1' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-xl)' }}>
            <h3 className="font-heading" style={{ fontSize: 'var(--text-xl)', margin: 0 }}>
              Resource Strategy
            </h3>
            <BarChart3 size={20} color="var(--color-primary)" />
          </div>

          <div className="grid grid-2" style={{ gap: 'var(--space-lg)' }}>
            <div style={{
              padding: 'var(--space-lg)',
              background: 'linear-gradient(135deg, rgba(0, 212, 255, 0.1) 0%, transparent 100%)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--color-border)'
            }}>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', marginBottom: 'var(--space-sm)', textTransform: 'uppercase' }}>
                Daily Diamond Budget
              </div>
              <div className="font-display" style={{ fontSize: 'var(--text-3xl)', color: 'var(--color-primary)' }}>
                {resourcePlan.dailyDiamondBudget}
                <span style={{ fontSize: 'var(--text-lg)', marginLeft: 'var(--space-sm)' }}>💎</span>
              </div>
            </div>

            <div style={{
              padding: 'var(--space-lg)',
              background: 'linear-gradient(135deg, rgba(245, 197, 99, 0.1) 0%, transparent 100%)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--color-border)'
            }}>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', marginBottom: 'var(--space-sm)', textTransform: 'uppercase' }}>
                Spending Profile
              </div>
              <div className="font-heading" style={{ fontSize: 'var(--text-2xl)', color: 'var(--color-accent-gold)' }}>
                {resourcePlan.spendProfile}
              </div>
            </div>
          </div>

          <div style={{ marginTop: 'var(--space-xl)' }}>
            <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, marginBottom: 'var(--space-md)' }}>
              Focus Events This Week
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-sm)' }}>
              {resourcePlan.weeklyFocusEvents.map((event, i) => (
                <span key={i} className="badge badge-primary" style={{ padding: 'var(--space-sm) var(--space-md)' }}>
                  {event}
                </span>
              ))}
            </div>
          </div>

          <div style={{
            marginTop: 'var(--space-xl)',
            padding: 'var(--space-lg)',
            background: 'var(--color-bg-tertiary)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--color-border)'
          }}>
            <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, marginBottom: 'var(--space-md)', display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
              <Target size={16} color="var(--color-primary)" />
              Strategy Notes
            </div>
            <ul style={{ margin: 0, paddingLeft: 'var(--space-xl)', fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', lineHeight: 1.8 }}>
              {resourcePlan.notes.map((note, i) => (
                <li key={i}>{note}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card" style={{
          background: 'linear-gradient(135deg, rgba(245, 197, 99, 0.15) 0%, rgba(10, 14, 26, 0.8) 100%)',
          border: '1px solid var(--color-accent-gold)'
        }}>
          <h3 className="font-heading" style={{ fontSize: 'var(--text-xl)', marginBottom: 'var(--space-xl)' }}>
            Quick Actions
          </h3>

          <div style={{ display: 'grid', gap: 'var(--space-md)' }}>
            <button className="btn btn-secondary" style={{ width: '100%', justifyContent: 'space-between' }} onClick={() => navigate('/team')}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
                <Target size={20} />
                Build Team
              </div>
              <ArrowUpRight size={18} />
            </button>

            <button className="btn btn-secondary" style={{ width: '100%', justifyContent: 'space-between' }} onClick={() => navigate('/heroes')}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
                <Shield size={20} />
                Browse Heroes
              </div>
              <ArrowUpRight size={18} />
            </button>

            <button className="btn btn-secondary" style={{ width: '100%', justifyContent: 'space-between' }} onClick={() => navigate('/guides')}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
                <BookOpen size={20} />
                View Guides
              </div>
              <ArrowUpRight size={18} />
            </button>

            <button className="btn btn-gold" style={{ width: '100%', justifyContent: 'space-between', marginTop: 'var(--space-md)' }} onClick={() => navigate('/codes')}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
                <Gift size={20} />
                Redeem Gift Code
              </div>
              <Sparkles size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
