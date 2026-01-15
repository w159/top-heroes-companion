import React from 'react';

interface PetInfo {
  name: string;
  faction: string;
  tier: string;
  specialty: string;
  recommendation: string;
  imageUrl?: string;
}

const pets: PetInfo[] = [
  // League Pets
  {
    name: 'Eggy',
    faction: 'League',
    tier: 'S-Tier',
    specialty: 'Critical Rate buffs that scale with team',
    recommendation: 'Best in Slot for League. Focus 100% of Pet Food here.'
  },
  {
    name: 'Zappy',
    faction: 'League',
    tier: 'B-Tier',
    specialty: 'AoE damage focus',
    recommendation: 'Alternative if Eggy unavailable'
  },
  {
    name: 'CandiBoo',
    faction: 'League',
    tier: 'B-Tier',
    specialty: 'Season 3 option',
    recommendation: 'Good for S3 content'
  },
  // Nature Pets
  {
    name: 'Cactini',
    faction: 'Nature',
    tier: 'S-Tier',
    specialty: 'Superior stat scaling for sustain meta',
    recommendation: 'Best in Slot for Nature. Essential for late-game.'
  },
  {
    name: 'Sproutfang',
    faction: 'Nature',
    tier: 'B-Tier',
    specialty: 'Alternative damage option',
    recommendation: 'Secondary choice'
  },
  {
    name: 'Bear',
    faction: 'Nature',
    tier: 'C-Tier',
    specialty: 'Generic stats',
    recommendation: 'F2P fallback only'
  },
  // Horde Pets
  {
    name: 'Flickerkit',
    faction: 'Horde',
    tier: 'S-Tier',
    specialty: 'All Horde Hero Attack/HP bonuses',
    recommendation: 'Best in Slot (P2W) - hard to obtain for F2P'
  },
  {
    name: 'Howli (Wolf)',
    faction: 'Horde',
    tier: 'A-Tier',
    specialty: 'Balanced stats and effects',
    recommendation: 'Best F2P Alternative for Horde'
  }
];

const factionColors: Record<string, string> = {
  'League': '#5856D6',
  'Nature': '#34C759',
  'Horde': '#FF3B30'
};

const tierColors: Record<string, string> = {
  'S-Tier': '#FFD60A',
  'A-Tier': '#FF9F0A',
  'B-Tier': '#5AC8FA',
  'C-Tier': '#8E8E93'
};

const Pets: React.FC = () => {
  const groupByFaction = (pets: PetInfo[]) => {
    return pets.reduce((acc, pet) => {
      if (!acc[pet.faction]) acc[pet.faction] = [];
      acc[pet.faction].push(pet);
      return acc;
    }, {} as Record<string, PetInfo[]>);
  };

  const groupedPets = groupByFaction(pets);

  return (
    <div className="pets-page">
      <div className="page-header">
        <h1>Pet Guide</h1>
        <p className="page-subtitle">Focus 100% of Pet Food on ONE pet matching your main faction</p>
      </div>

      {/* Strategy Tips */}
      <div className="strategy-card">
        <h3>🎯 Pet Strategy</h3>
        <ul>
          <li><strong>Focus on ONE pet</strong> - A Level 100+ pet beats multiple Level 30 pets</li>
          <li><strong>Match your faction</strong> - Faction bonuses are massive</li>
          <li><strong>Save Pet Essence</strong> - Only use for Mythic promotion at Level 120</li>
          <li><strong>Complete Pet Rush events</strong> - Primary source of Pet Essence</li>
        </ul>
      </div>

      {/* Pet Cards by Faction */}
      {Object.entries(groupedPets).map(([faction, factionPets]) => (
        <div key={faction} className="faction-section">
          <h2 style={{ color: factionColors[faction] }}>{faction} Pets</h2>
          <div className="pets-grid">
            {factionPets.map((pet) => (
              <div key={pet.name} className="pet-card">
                <div className="pet-card-header">
                  <div className="pet-avatar">
                    {pet.name[0]}
                  </div>
                  <div className="pet-info">
                    <h3>{pet.name}</h3>
                    <span 
                      className="tier-badge"
                      style={{ backgroundColor: tierColors[pet.tier] }}
                    >
                      {pet.tier}
                    </span>
                  </div>
                </div>
                <div className="pet-details">
                  <p className="specialty">{pet.specialty}</p>
                  <p className="recommendation">
                    <strong>📌</strong> {pet.recommendation}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Level Milestones */}
      <div className="milestones-card">
        <h3>📈 Level Milestones</h3>
        <div className="milestones-grid">
          <div className="milestone">
            <span className="level">Lv 30</span>
            <span className="unlock">Star upgrades unlock</span>
          </div>
          <div className="milestone">
            <span className="level">Lv 60</span>
            <span className="unlock">Significant stat boost</span>
          </div>
          <div className="milestone">
            <span className="level">Lv 100</span>
            <span className="unlock">Major power spike</span>
          </div>
          <div className="milestone">
            <span className="level">Lv 120</span>
            <span className="unlock">Mythic promotion available</span>
          </div>
        </div>
      </div>

      <style>{`
        .pets-page {
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
        
        .strategy-card, .milestones-card {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 16px;
          padding: 20px;
          margin-bottom: 24px;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .strategy-card h3, .milestones-card h3 {
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
        
        .faction-section {
          margin-bottom: 32px;
        }
        
        .faction-section h2 {
          font-size: 20px;
          margin-bottom: 16px;
        }
        
        .pets-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 16px;
        }
        
        .pet-card {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 16px;
          padding: 16px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          transition: transform 0.2s, box-shadow 0.2s;
        }
        
        .pet-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
        }
        
        .pet-card-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 12px;
        }
        
        .pet-avatar {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          background: linear-gradient(135deg, #007AFF, #5856D6);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          font-weight: bold;
        }
        
        .pet-info h3 {
          font-size: 16px;
          margin-bottom: 4px;
        }
        
        .tier-badge {
          padding: 2px 8px;
          border-radius: 8px;
          font-size: 11px;
          font-weight: 600;
          color: black;
        }
        
        .pet-details {
          font-size: 13px;
        }
        
        .specialty {
          color: rgba(255, 255, 255, 0.7);
          margin-bottom: 8px;
        }
        
        .recommendation {
          color: #30D158;
          font-size: 12px;
        }
        
        .milestones-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 12px;
        }
        
        .milestone {
          background: rgba(255, 255, 255, 0.03);
          border-radius: 12px;
          padding: 12px;
          text-align: center;
          border: 1px solid rgba(255, 255, 255, 0.05);
        }
        
        .milestone .level {
          display: block;
          font-size: 18px;
          font-weight: bold;
          color: #FFD60A;
          margin-bottom: 4px;
        }
        
        .milestone .unlock {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.6);
        }
      `}</style>
    </div>
  );
};

export default Pets;
