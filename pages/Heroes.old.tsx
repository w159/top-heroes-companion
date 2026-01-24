import React from 'react';
import heroesData from '../src/data/heroes.json';
import HeroGrid from '../components/HeroGrid';

const Heroes: React.FC = () => {
  return (
    <div>
      <h1 style={{ 
        fontSize: '34px', fontWeight: 800, marginBottom: 16,
        color: 'var(--ios-text-primary)'
      }}>
        Heroes
      </h1>
      <HeroGrid />
    </div>
  );
};

export default Heroes;
