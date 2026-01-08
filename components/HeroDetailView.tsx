import React from 'react';
import { ArrowLeft, Swords, Shield, Heart, Zap, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import '../styles/ios.css';

interface Skill {
  name: string;
  type: string;
  description: string;
  tips: string;
}

interface Hero {
  id: string;
  name: string;
  faction: string;
  rarity: string;
  role: string;
  image: string;
  gear_set: string;
  unique_weapon: string;
  positions: string[];
  skills: Skill[];
}

interface UserHeroData {
  id: string;
  level: number;
  stars: number;
  power: number;
}

interface Props {
  hero: Hero;
  userHero?: UserHeroData;
  onRecruit?: () => void;
  onUpdate?: (data: Partial<UserHeroData>) => void;
}

const HeroDetailView: React.FC<Props> = ({ hero, userHero, onRecruit }) => {
  const navigate = useNavigate();

  return (
    <div className="animate-slide-up" style={{ paddingBottom: 80 }}>
      {/* Sticky Header */}
      <div className="glass" style={{ 
        position: 'sticky', top: 0, zIndex: 100, 
        padding: '12px 16px', margin: '0 -20px 20px', 
        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
      }}>
        <button 
          onClick={() => navigate(-1)}
          style={{ 
            background: 'none', border: 'none', 
            display: 'flex', alignItems: 'center', gap: 4,
            color: 'var(--ios-blue)', fontSize: '17px', cursor: 'pointer'
          }}
        >
          <ArrowLeft size={22} /> Back
        </button>
        {userHero ? (
             <span style={{ fontSize: '12px', fontWeight: 600, color: '#34C759', background: 'rgba(52, 199, 89, 0.1)', padding: '4px 8px', borderRadius: 8 }}>
                In Roster
             </span>
        ) : (
            <button
                onClick={onRecruit}
                style={{
                    background: 'var(--ios-blue)', color: 'white', border: 'none',
                    padding: '6px 16px', borderRadius: 20, fontWeight: 600, fontSize: '13px',
                    cursor: 'pointer'
                }}
            >
                Recruit
            </button>
        )}
      </div>

      {/* Hero Header (App Store Style) */}
      <div style={{ display: 'flex', gap: 20, marginBottom: 30, alignItems: 'center' }}>
        <img 
          src={hero.image} 
          alt={hero.name} 
          style={{ 
            width: 100, height: 100, borderRadius: 22, 
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            objectFit: 'cover', background: 'white'
          }}
          onError={(e) => { e.currentTarget.src = '/img/heroes/placeholder.png'; }}
        />
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, margin: '0 0 4px', lineHeight: 1.1 }}>
            {hero.name}
          </h1>
          <p style={{ color: 'var(--ios-text-secondary)', margin: 0, fontSize: '15px' }}>
            {hero.faction} • {hero.role}
          </p>
          <div style={{ display: 'flex', gap: 4, marginTop: 8 }}>
             <span style={{ 
               background: 'rgba(0,0,0,0.05)', color: 'var(--ios-text-secondary)',
               padding: '4px 10px', borderRadius: 12, fontSize: '12px', fontWeight: 600
             }}>
               {hero.rarity}
             </span>
          </div>
        </div>
      </div>

      {/* Stats / Info Row */}
      <div style={{ display: 'flex', gap: 12, overflowX: 'auto', marginBottom: 30, paddingBottom: 4 }}>
        <div className="ios-card" style={{ flex: 1, minWidth: 100, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: '11px', color: 'var(--ios-text-secondary)', fontWeight: 600 }}>POSITIONS</span>
          <div style={{ display: 'flex', gap: 4 }}>
            {hero.positions.map((p, i) => (
              <span key={i} style={{ fontSize: '12px', fontWeight: 600 }}>{p}</span>
            ))}
            {hero.positions.length === 0 && <span>-</span>}
          </div>
        </div>

        <div className="ios-card" style={{ flex: 1, minWidth: 100, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: '11px', color: 'var(--ios-text-secondary)', fontWeight: 600 }}>GEAR SET</span>
          <span style={{ fontSize: '12px', textAlign: 'center', fontWeight: 600 }}>{hero.gear_set}</span>
        </div>

        <div className="ios-card" style={{ flex: 1, minWidth: 100, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
           <span style={{ fontSize: '11px', color: 'var(--ios-text-secondary)', fontWeight: 600 }}>WEAPON</span>
           <span style={{ fontSize: '12px', textAlign: 'center', fontWeight: 600 }}>{hero.unique_weapon || 'None'}</span>
        </div>
      </div>

      <hr style={{ border: 'none', borderBottom: '0.5px solid var(--ios-separator)', margin: '0 0 30px' }} />

      {/* Skills Section */}
      <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: 16 }}>Skills</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {hero.skills.map((skill, index) => (
          <div key={index} className="ios-card" style={{ padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700 }}>{skill.name}</h3>
              <span style={{ 
                fontSize: '11px', fontWeight: 700, textTransform: 'uppercase',
                color: 'var(--ios-blue)', background: 'rgba(0,122,255,0.1)',
                padding: '4px 8px', borderRadius: 6
              }}>
                {skill.type}
              </span>
            </div>
            <p style={{ margin: 0, fontSize: '14px', lineHeight: 1.5, color: 'var(--ios-text-primary)' }}>
              {skill.description || 'No description available.'}
            </p>
            {skill.tips && (
              <div style={{ marginTop: 12, padding: 12, background: 'var(--ios-background)', borderRadius: 12 }}>
                <p style={{ margin: 0, fontSize: '13px', fontStyle: 'italic', color: 'var(--ios-text-secondary)' }}>
                  Tip: {skill.tips}
                </p>
              </div>
            )}
          </div>
        ))}
         {hero.skills.length === 0 && (
           <p style={{ color: 'var(--ios-text-secondary)', fontStyle: 'italic' }}>No skill data available.</p>
         )}
      </div>

    </div>
  );
};

export default HeroDetailView;
