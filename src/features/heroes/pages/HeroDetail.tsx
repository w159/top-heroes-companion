import React from 'react';
import { useParams, Link } from 'react-router-dom';
import HeroDetailView from '../components/HeroDetailView';
import heroesData from '../../../data/heroes.json';
import heroDetailData from '../../../data/heroDetailData.json';
import { useUserData } from '../../../shared/utils';
import { ArrowLeft, Shield } from 'lucide-react';
import { Faction, Rarity, Role, Hero } from '../../../shared/types';
import { Card } from '../../../shared/ui/components/card';
import { Button } from '../../../shared/ui/components/button';

const HeroDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data, addToRoster } = useUserData();

  const hero = heroesData.find((h: { id: string }) => h.id === id);

  if (!hero) {
    return (
      <Card variant="outlined" className="text-center py-16 animate-in">
        <Shield className="w-16 h-16 mx-auto mb-4 text-muted-foreground/30" />
        <h2 className="text-headline-sm font-semibold mb-2">Hero Not Found</h2>
        <p className="text-body-md text-muted-foreground mb-6">
          The hero you are looking for does not exist in our database.
        </p>
        <Button variant="filled" asChild>
          <Link to="/heroes" className="inline-flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Back to Heroes
          </Link>
        </Button>
      </Card>
    );
  }

  const userHero = data.roster.find((h: { id: string }) => h.id === hero.id);

  return (
    <HeroDetailView
      hero={hero}
      userHero={userHero}
      detailData={heroDetailData}
      onRecruit={() => {
        const normalizedRole: Role =
          hero.role === 'Damage Dealer' ? 'DPS' :
            hero.role === 'Supporter' ? 'Support' :
              (hero.role as Role);

        const baseHero: Hero = {
          id: hero.id,
          name: hero.name,
          faction: hero.faction as Faction,
          rarity: hero.rarity as Rarity,
          role: normalizedRole,
        };

        addToRoster(baseHero);
      }}
    />
  );
};

export default HeroDetail;
