import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Trophy,
  Users,
  Target,
  TrendingUp,
  BookOpen,
  Activity,
  ArrowUpRight,
  Shield,
  Zap,
  Sword,
  Menu,
  X
} from 'lucide-react';
import { useUserData } from '../utils';
import {
  recommendHeroUpgrades,
  recommendResourcePlan,
  simulateProgression,
  runRecommendationSelfTests,
  RecommendationTestResult
} from '../utils/recommendations';
import {
  addProgressSnapshot,
  calculateProgressTrend,
  calculateTotalInfluence
} from '../utils';
import { EducationPanel } from '../components/EducationPanel';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { userData, updateUserData } = useUserData();
  const [showTests, setShowTests] = useState(false);
  const [testResults, setTestResults] = useState<RecommendationTestResult[]>([]);

  // Calculate Influence & Trends
  const totalInfluence = calculateTotalInfluence(userData);
  const snapshots = userData.progressLog || [];
  const trendPercentage = calculateProgressTrend(snapshots);
  const trendColor = trendPercentage >= 0 ? 'var(--ios-green)' : 'var(--ios-red)';

  // Recommendations
  const upgrades = recommendHeroUpgrades(userData, 3);
  const resourcePlan = recommendResourcePlan(userData);
  const simulation = simulateProgression({ days: 30, userData });

  const addSnapshot = () => {
    const newUserData = addProgressSnapshot(userData, {
      date: new Date().toISOString(),
      totalInfluence,
      notes: 'Manual snapshot'
    });
    updateUserData(newUserData);
  };

  const runTests = () => {
    const results = runRecommendationSelfTests(userData);
    setTestResults(results);
    setShowTests(true);
  };

  return (
    <div style={{ padding: '20px', paddingBottom: '100px', maxWidth: '1200px', margin: '0 auto' }}>

      {/* Header Section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: '34px', fontWeight: 800, margin: '0 0 8px 0' }}>Dashboard</h1>
          <p style={{ fontSize: '17px', color: 'var(--ios-text-secondary)', margin: 0 }}>
            Server {userData.settings.serverGroup} • {userData.settings.mainFaction} Main
          </p>
        </div>
        <button
          onClick={runTests}
          style={{
            padding: '8px 16px',
            background: 'rgba(0,122,255,0.1)',
            color: 'var(--ios-blue)',
            border: 'none',
            borderRadius: 20,
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          Run Diagnostics
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: 24 }}>

        {/* Progress Tracking Card */}
        <div className="ios-card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 20 }}>
            <div>
              <h2 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--ios-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px', margin: 0 }}>Total Influence</h2>
              <div style={{ marginTop: 8, display: 'flex', alignItems: 'baseline', gap: 12 }}>
                <span style={{ fontSize: '34px', fontWeight: 800 }}>{(totalInfluence / 1000000).toFixed(2)}M</span>
                <div style={{ display: 'flex', alignItems: 'center', color: trendColor, background: trendPercentage >= 0 ? 'rgba(52, 199, 89, 0.1)' : 'rgba(255, 59, 48, 0.1)', padding: '4px 8px', borderRadius: 12 }}>
                  <TrendingUp size={14} style={{ marginRight: 4 }} />
                  <span style={{ fontSize: '13px', fontWeight: 600 }}>
                    {trendPercentage > 0 ? '+' : ''}{trendPercentage.toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={addSnapshot}
              style={{
                width: 36,
                height: 36,
                borderRadius: 18,
                background: 'var(--ios-gray-6)',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <Activity size={18} color="var(--ios-blue)" />
            </button>
          </div>

          <div style={{ marginTop: 24, paddingTop: 24, borderTop: '1px solid var(--ios-separator)' }}>
            <h3 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ios-text-secondary)', marginBottom: 12 }}>30-Day Projection</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '20px', fontWeight: 700 }}>{(simulation.projectedTotalInfluence / 1000000).toFixed(2)}M</span>
                <span style={{ fontSize: '13px', color: 'var(--ios-text-secondary)', marginLeft: 8 }}>Estimated</span>
              </div>
              <span style={{ fontSize: '12px', color: 'var(--ios-blue)', background: 'rgba(0,122,255,0.1)', padding: '4px 8px', borderRadius: 6 }}>
                {resourcePlan.spendProfile} Growth
              </span>
            </div>
          </div>
        </div>

        {/* Priority Actions Card */}
        <div className="ios-card" style={{ padding: 24 }}>
          <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: 20 }}>Priority Upgrades</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {upgrades.map((rec) => (
              <div key={rec.heroId} style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                <div style={{
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  background: 'var(--ios-gray-6)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '18px',
                  color: 'var(--ios-text-secondary)'
                }}>
                  {rec.heroName.substring(0, 1)}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontWeight: 600 }}>{rec.heroName}</span>
                    <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--ios-blue)' }}>Score: {rec.score.toFixed(0)}</span>
                  </div>
                  <p style={{ fontSize: '13px', color: 'var(--ios-text-secondary)', margin: 0, lineHeight: 1.4 }}>
                    Target: Lv.{rec.recommendedLevel} • {rec.reason}
                  </p>
                </div>
              </div>
            ))}
            {upgrades.length === 0 && (
              <p style={{ color: 'var(--ios-text-secondary)', textAlign: 'center' }}>No urgent upgrades found.</p>
            )}
          </div>
        </div>

      </div>

      {/* Educational Content Section */}
      <div style={{ marginTop: 32 }}>
        <EducationPanel />
      </div>

      {/* Resource Plan Section */}
      <div style={{ marginTop: 32 }} className="ios-card">
        <div style={{ padding: 24 }}>
          <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: 16 }}>Resource Strategy</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 24 }}>
            <div>
              <h3 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ios-text-secondary)', marginBottom: 8 }}>Daily Diamond Budget</h3>
              <p style={{ fontSize: '24px', fontWeight: 700, margin: 0, color: 'var(--ios-blue)' }}>
                {resourcePlan.dailyDiamondBudget} <span style={{ fontSize: '14px', color: 'var(--ios-text-primary)' }}>💎</span>
              </p>
            </div>
            <div>
              <h3 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ios-text-secondary)', marginBottom: 8 }}>Focus Events</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {resourcePlan.weeklyFocusEvents.map((event, i) => (
                  <span key={i} style={{
                    fontSize: '12px',
                    padding: '4px 10px',
                    background: 'var(--ios-gray-6)',
                    borderRadius: 6,
                    fontWeight: 500
                  }}>
                    {event}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h3 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ios-text-secondary)', marginBottom: 8 }}>Strategy Notes</h3>
              <ul style={{ margin: 0, paddingLeft: 20, fontSize: '13px', color: 'var(--ios-text-primary)', lineHeight: 1.6 }}>
                {resourcePlan.notes.map((note, i) => (
                  <li key={i}>{note}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Diagnostic Modal */}
      {showTests && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2000,
          backdropFilter: 'blur(5px)'
        }} onClick={() => setShowTests(false)}>
          <div style={{
            background: 'white',
            borderRadius: 20,
            padding: 32,
            width: '90%',
            maxWidth: '500px',
            maxHeight: '80vh',
            overflowY: 'auto'
          }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ margin: 0, fontSize: '24px' }}>System Diagnostics</h2>
              <button onClick={() => setShowTests(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={24} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {testResults.map((result, index) => (
                <div key={index} style={{
                  padding: 16,
                  borderRadius: 12,
                  background: result.passed ? 'rgba(52, 199, 89, 0.1)' : 'rgba(255, 59, 48, 0.1)',
                  border: `1px solid ${result.passed ? 'var(--ios-green)' : 'var(--ios-red)'}`
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
                    {result.passed ? <Shield size={20} color="var(--ios-green)" /> : <Activity size={20} color="var(--ios-red)" />}
                    <span style={{ fontWeight: 600 }}>{result.name}</span>
                  </div>
                  {!result.passed && result.details && (
                    <p style={{ margin: '8px 0 0 0', fontSize: '13px', color: 'var(--ios-red)' }}>{result.details}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
