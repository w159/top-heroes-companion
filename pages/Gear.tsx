import React from 'react';

interface GearSet {
  name: string;
  shortName: string;
  attackBonus: string;
  hpBonus: string;
  special: string;
  bestFor: string[];
  color: string;
}

const gearSets: GearSet[] = [
  {
    name: 'Glory of the Knight',
    shortName: 'Knight',
    attackBonus: '+40%',
    hpBonus: '+80%',
    special: 'Skill Damage +8%',
    bestFor: ['Pyromancer', 'Paragon', 'Bishop', 'Pixie', 'Artificer'],
    color: '#5856D6'
  },
  {
    name: 'Fury of Blood',
    shortName: 'Blood',
    attackBonus: '-',
    hpBonus: '+160%',
    special: 'Damage Reduction +6%',
    bestFor: ['All Tanks', 'All Healers', 'Adjudicator', 'Forest Maiden', 'Witch'],
    color: '#FF3B30'
  },
  {
    name: "Titan's Might",
    shortName: 'Titan',
    attackBonus: '+80%',
    hpBonus: '-',
    special: 'Damage Increase +6%',
    bestFor: ['Wanderer', 'Storm Maiden', 'Tidecaller', 'Astrologer'],
    color: '#FF9F0A'
  }
];

const gearSlots = [
  { name: 'Sword', stat: 'Attack', bonus: 'Critical Attack' },
  { name: 'Boots', stat: 'Attack', bonus: 'Critical Attack' },
  { name: 'Helmet', stat: 'HP', bonus: 'Block Chance' },
  { name: 'Chest', stat: 'HP', bonus: 'Block Chance' }
];

const Gear: React.FC = () => {
  return (
    <div className="gear-page">
      <div className="page-header">
        <h1>Gear Sets Guide</h1>
        <p className="page-subtitle">Match gear to hero role for maximum effectiveness</p>
      </div>

      {/* Quick Reference */}
      <div className="quick-ref-card">
        <h3>⚡ Quick Reference</h3>
        <div className="quick-grid">
          <div className="quick-item">
            <span className="quick-label" style={{ color: '#5856D6' }}>Knight</span>
            <span className="quick-use">→ Skill-based DPS</span>
          </div>
          <div className="quick-item">
            <span className="quick-label" style={{ color: '#FF3B30' }}>Blood</span>
            <span className="quick-use">→ Tanks & Healers</span>
          </div>
          <div className="quick-item">
            <span className="quick-label" style={{ color: '#FF9F0A' }}>Titan</span>
            <span className="quick-use">→ Flat Attack DPS</span>
          </div>
        </div>
      </div>

      {/* Gear Set Cards */}
      <div className="sets-section">
        <h2>Gear Sets</h2>
        <div className="sets-grid">
          {gearSets.map((set) => (
            <div key={set.name} className="set-card" style={{ borderTopColor: set.color }}>
              <div className="set-header">
                <h3>{set.name}</h3>
                <span className="set-short" style={{ color: set.color }}>{set.shortName}</span>
              </div>
              
              <div className="set-stats">
                <div className="stat-row">
                  <span className="stat-label">Attack</span>
                  <span className="stat-value">{set.attackBonus}</span>
                </div>
                <div className="stat-row">
                  <span className="stat-label">HP</span>
                  <span className="stat-value">{set.hpBonus}</span>
                </div>
                <div className="stat-row special">
                  <span className="stat-label">Special</span>
                  <span className="stat-value">{set.special}</span>
                </div>
              </div>
              
              <div className="best-for">
                <h4>Best For:</h4>
                <div className="hero-tags">
                  {set.bestFor.map((hero, index) => (
                    <span key={index} className="hero-tag">{hero}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Gear Slots */}
      <div className="slots-section">
        <h2>Gear Slots</h2>
        <div className="slots-grid">
          {gearSlots.map((slot) => (
            <div key={slot.name} className="slot-card">
              <div className="slot-icon">
                {slot.name === 'Sword' && '⚔️'}
                {slot.name === 'Boots' && '👞'}
                {slot.name === 'Helmet' && '⛑️'}
                {slot.name === 'Chest' && '🛡️'}
              </div>
              <div className="slot-info">
                <strong>{slot.name}</strong>
                <div className="slot-stats">
                  <span>Primary: {slot.stat}</span>
                  <span>Bonus: {slot.bonus}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upgrade Tips */}
      <div className="tips-card">
        <h3>📈 Upgrade Strategy</h3>
        <ul>
          <li><strong>Level in 10s:</strong> Extra buffs unlock at Lv 10, 20, 30, 40</li>
          <li><strong>Enhancement Master:</strong> Keep all 4 pieces at same level for bonus</li>
          <li><strong>Titan Marks:</strong> Add +30% faction-specific bonuses from Guild Vault</li>
          <li><strong>Promotion:</strong> Unlocks at Lv 40, requires Legendary/Mythic Promotion Stones</li>
        </ul>
      </div>

      {/* Priority Order */}
      <div className="priority-card">
        <h3>🎯 Upgrade Priority</h3>
        <div className="priority-grid">
          <div className="priority-section">
            <h4>For DPS/Healers</h4>
            <ol>
              <li>Sword (max attack)</li>
              <li>Boots (secondary attack)</li>
              <li>Helmet/Chest (survival)</li>
            </ol>
          </div>
          <div className="priority-section">
            <h4>For Tanks</h4>
            <ol>
              <li>Helmet (max HP)</li>
              <li>Chest (secondary HP)</li>
              <li>Sword/Boots (minor damage)</li>
            </ol>
          </div>
        </div>
      </div>

      <style>{`
        .gear-page {
          padding: 20px;
          max-width: 1200px;
          margin: 0 auto;
        }
        
        .page-header {
          text-align: center;
          margin-bottom: 24px;
        }
        
        .page-header h1 {
          font-size: 28px;
          margin-bottom: 8px;
        }
        
        .page-subtitle {
          color: rgba(255, 255, 255, 0.6);
          font-size: 14px;
        }
        
        .quick-ref-card, .tips-card, .priority-card {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 16px;
          padding: 20px;
          margin-bottom: 24px;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .quick-ref-card h3, .tips-card h3, .priority-card h3 {
          margin-bottom: 16px;
          font-size: 18px;
        }
        
        .quick-grid {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
        }
        
        .quick-item {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .quick-label {
          font-weight: bold;
          font-size: 14px;
        }
        
        .quick-use {
          font-size: 13px;
          color: rgba(255, 255, 255, 0.6);
        }
        
        .sets-section, .slots-section {
          margin-bottom: 24px;
        }
        
        .sets-section h2, .slots-section h2 {
          font-size: 20px;
          margin-bottom: 16px;
        }
        
        .sets-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 16px;
        }
        
        .set-card {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 16px;
          padding: 20px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-top: 4px solid;
        }
        
        .set-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }
        
        .set-header h3 {
          font-size: 16px;
        }
        
        .set-short {
          font-weight: bold;
          font-size: 12px;
          padding: 4px 10px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 8px;
        }
        
        .set-stats {
          margin-bottom: 16px;
        }
        
        .stat-row {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          font-size: 14px;
        }
        
        .stat-row.special {
          border-bottom: none;
          color: #FFD60A;
        }
        
        .stat-label {
          color: rgba(255, 255, 255, 0.6);
        }
        
        .stat-value {
          font-weight: 600;
        }
        
        .best-for h4 {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.5);
          margin-bottom: 8px;
        }
        
        .hero-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }
        
        .hero-tag {
          padding: 3px 8px;
          background: rgba(255, 255, 255, 0.08);
          border-radius: 6px;
          font-size: 11px;
          color: rgba(255, 255, 255, 0.7);
        }
        
        .slots-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 12px;
        }
        
        .slot-card {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 12px;
          padding: 16px;
          display: flex;
          gap: 12px;
          align-items: center;
        }
        
        .slot-icon {
          font-size: 28px;
        }
        
        .slot-info strong {
          display: block;
          margin-bottom: 4px;
        }
        
        .slot-stats {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.6);
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        
        .tips-card ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        
        .tips-card li {
          padding: 8px 0;
          font-size: 14px;
          color: rgba(255, 255, 255, 0.8);
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }
        
        .tips-card li:last-child {
          border-bottom: none;
        }
        
        .priority-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
        }
        
        .priority-section h4 {
          font-size: 14px;
          margin-bottom: 12px;
          color: #007AFF;
        }
        
        .priority-section ol {
          margin: 0;
          padding-left: 20px;
        }
        
        .priority-section li {
          padding: 4px 0;
          font-size: 13px;
          color: rgba(255, 255, 255, 0.8);
        }
      `}</style>
    </div>
  );
};

export default Gear;
