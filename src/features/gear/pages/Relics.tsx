import React from 'react';

interface RelicSet {
  name: string;
  faction: string;
  focus: string;
  relics: { name: string; type: string; effect: string }[];
  f2pAlternative?: string[];
}

const relicSets: RelicSet[] = [
  {
    name: 'Oath of Sacred Forest',
    faction: 'Nature',
    focus: 'Survival + CC',
    relics: [
      { name: 'Undefeated Crown', type: 'Defense', effect: 'Shelter of Nature - reduces max damage, heals team' },
      { name: 'Vineborn Bow', type: 'Attack', effect: 'Entangle CC - +10% damage per Nature hero (max 60%)' },
      { name: 'Sacred Scroll', type: 'Utility', effect: 'Shield + Damage Reduction + Shield Breaker' }
    ],
    f2pAlternative: ['Frost Diadem', "Marshal's Warhorn", 'Eternal Wings']
  },
  {
    name: 'Arcane Vault',
    faction: 'League',
    focus: 'Control + Skill Damage',
    relics: [
      { name: 'Petrification Staff', type: 'Control', effect: 'Petrify CC + Overall damage increase' },
      { name: 'Soul Guard Orb', type: 'Defense', effect: 'Resist - caps max damage, provides shield' },
      { name: 'Feather of Pact', type: 'Buffs', effect: 'Shield value increase + Block Break' }
    ],
    f2pAlternative: ['Petrification Staff', 'Moonstone', 'Scale of Injustice']
  },
  {
    name: "Dragon's Might",
    faction: 'Horde',
    focus: 'Raw Damage + Shield Break',
    relics: [
      { name: 'Thunder Judgment', type: 'AoE', effect: 'Thunderbind CC - prevents movement/skills' },
      { name: 'Dragon Heart', type: 'Defense', effect: 'Indomitable - caps damage, heals team' },
      { name: 'Dragon Bone Amulet', type: 'Utility', effect: 'Various buffs' }
    ],
    f2pAlternative: ['Duke Signet', 'Eternal Wings', "Marshal's Warhorn"]
  }
];

const factionColors: Record<string, string> = {
  'League': '#5856D6',
  'Nature': '#34C759',
  'Horde': '#FF3B30'
};

const Relics: React.FC = () => {
  return (
    <div className="relics-page">
      <div className="page-header">
        <h1>Relic Sets Guide</h1>
        <p className="page-subtitle">Max ONE relic at a time - 5★ Epic beats 1★ Legendary!</p>
      </div>

      {/* Strategy Tips */}
      <div className="strategy-card">
        <h3>🎯 Relic Strategy</h3>
        <ul>
          <li><strong>Focus one relic to max stars</strong> before moving to the next</li>
          <li><strong>Match your faction's set</strong> for best synergy</li>
          <li><strong>Buy from Guild Store</strong> daily - mandatory for progression</li>
          <li><strong>Legion Boss hits</strong> for random relic shards</li>
        </ul>
      </div>

      {/* Relic Set Cards */}
      {relicSets.map((set) => (
        <div key={set.name} className="relic-set-card">
          <div className="set-header" style={{ borderLeftColor: factionColors[set.faction] }}>
            <div>
              <h2>{set.name}</h2>
              <div className="set-meta">
                <span className="faction-tag" style={{ backgroundColor: factionColors[set.faction] }}>
                  {set.faction}
                </span>
                <span className="focus-tag">{set.focus}</span>
              </div>
            </div>
          </div>

          <div className="relics-list">
            {set.relics.map((relic, index) => (
              <div key={index} className="relic-item">
                <div className="relic-name">
                  <span className="relic-icon">💎</span>
                  <strong>{relic.name}</strong>
                  <span className="relic-type">{relic.type}</span>
                </div>
                <p className="relic-effect">{relic.effect}</p>
              </div>
            ))}
          </div>

          {set.f2pAlternative && (
            <div className="f2p-section">
              <h4>🆓 F2P Alternative</h4>
              <div className="f2p-relics">
                {set.f2pAlternative.map((relic, index) => (
                  <span key={index} className="f2p-relic">{relic}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}

      {/* Starter Kit */}
      <div className="starter-card">
        <h3>🌟 Starter Relic Kit (All Factions)</h3>
        <p className="starter-desc">Easy to obtain, universally useful:</p>
        <div className="starter-relics">
          <div className="starter-relic">
            <strong>Duke's Ring</strong>
            <span>Solid all-around stats</span>
          </div>
          <div className="starter-relic">
            <strong>Philosopher's Stone</strong>
            <span>Healing + HP regen</span>
          </div>
          <div className="starter-relic">
            <strong>Marshal's Warhorn</strong>
            <span>Team attack speed boost</span>
          </div>
        </div>
      </div>

      <style>{`
        .relics-page {
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
        
        .strategy-card, .starter-card {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 16px;
          padding: 20px;
          margin-bottom: 24px;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .strategy-card h3, .starter-card h3 {
          margin-bottom: 16px;
          font-size: 18px;
        }
        
        .strategy-card ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        
        .strategy-card li {
          padding: 8px 0;
          font-size: 14px;
          color: rgba(255, 255, 255, 0.8);
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }
        
        .strategy-card li:last-child {
          border-bottom: none;
        }
        
        .relic-set-card {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 16px;
          padding: 20px;
          margin-bottom: 20px;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .set-header {
          border-left: 4px solid;
          padding-left: 16px;
          margin-bottom: 16px;
        }
        
        .set-header h2 {
          font-size: 20px;
          margin-bottom: 8px;
        }
        
        .set-meta {
          display: flex;
          gap: 10px;
          align-items: center;
        }
        
        .faction-tag {
          padding: 4px 10px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 600;
          color: white;
        }
        
        .focus-tag {
          font-size: 13px;
          color: rgba(255, 255, 255, 0.6);
        }
        
        .relics-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        
        .relic-item {
          background: rgba(255, 255, 255, 0.03);
          border-radius: 12px;
          padding: 12px 16px;
        }
        
        .relic-name {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 6px;
        }
        
        .relic-icon {
          font-size: 16px;
        }
        
        .relic-type {
          font-size: 11px;
          padding: 2px 6px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 6px;
          color: rgba(255, 255, 255, 0.6);
        }
        
        .relic-effect {
          font-size: 13px;
          color: rgba(255, 255, 255, 0.7);
          margin: 0;
        }
        
        .f2p-section {
          margin-top: 16px;
          padding-top: 16px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .f2p-section h4 {
          font-size: 14px;
          margin-bottom: 10px;
          color: #30D158;
        }
        
        .f2p-relics {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        
        .f2p-relic {
          padding: 4px 10px;
          background: rgba(48, 209, 88, 0.15);
          border-radius: 8px;
          font-size: 12px;
          color: #30D158;
        }
        
        .starter-desc {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.6);
          margin-bottom: 16px;
        }
        
        .starter-relics {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 12px;
        }
        
        .starter-relic {
          background: rgba(255, 255, 255, 0.03);
          border-radius: 12px;
          padding: 12px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        
        .starter-relic strong {
          color: #FFD60A;
        }
        
        .starter-relic span {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.6);
        }
      `}</style>
    </div>
  );
};

export default Relics;
