import React from 'react';
import { useParams, Link } from 'react-router-dom';
import HeroDetailView from '../components/HeroDetailView';
import heroesData from '../src/data/heroes.json';
import { useUserData } from '../utils';
import { ArrowLeft } from 'lucide-react';

const HeroDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data, addToRoster } = useUserData();
  
  // Find hero in our JSON data
  const hero = heroesData.find((h: any) => h.id === id);

  if (!hero) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: 8 }}>Hero Not Found</h2>
        <p style={{ color: 'var(--ios-text-secondary)', marginBottom: 20 }}>
          The hero you are looking for does not exist in our database.
        </p>
        <Link 
          to="/heroes"
          style={{ 
            color: 'var(--ios-blue)', fontWeight: 600, textDecoration: 'none',
            display: 'inline-flex', alignItems: 'center', gap: 4
          }}
        >
          <ArrowLeft size={18} /> Back to Heroes
        </Link>
      </div>
    );
  }

  // Find in user roster
  // Note: old hero.id might match, or we might need to be careful with ID matching if JSON ids differ from old hardcoded ones.
  // Assuming 'id' is consistent.
  const userHero = data.roster.find((h: any) => h.id === hero.id);

  return (
    <HeroDetailView 
        hero={hero} 
        userHero={userHero} 
        onRecruit={() => addToRoster({ ...hero, level: 1, stars: 1, power: 0 })}
    />
  );
};

export default HeroDetail;
