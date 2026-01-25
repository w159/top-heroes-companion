import React, { Suspense, lazy } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from '../shared/layouts/MainLayout';
import ChatAssistantEnhanced from '../shared/components/ChatAssistantEnhanced';
import LoadingSpinner from '../shared/ui/LoadingSpinner';
import '../styles/main.css';

// Lazy load pages for code splitting
const Dashboard = lazy(() => import('../features/heroes/pages/Dashboard'));
const Heroes = lazy(() => import('../features/heroes/pages/Heroes'));
const HeroDetail = lazy(() => import('../features/heroes/pages/HeroDetail'));
const Roster = lazy(() => import('../features/heroes/pages/Roster'));
const TeamBuilder = lazy(() => import('../features/team/pages/TeamBuilder'));
const Events = lazy(() => import('../features/events/pages/Events'));
const GiftCodes = lazy(() => import('../features/events/pages/GiftCodes'));
const Guides = lazy(() => import('../features/guides/pages/Guides'));
const Gear = lazy(() => import('../features/gear/pages/Gear'));
const Pets = lazy(() => import('../features/gear/pages/Pets'));
const Relics = lazy(() => import('../features/gear/pages/Relics'));
const Settings = lazy(() => import('../features/settings/pages/Settings'));

const App: React.FC = () => {
  return (
    <Router>
      <MainLayout>
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/heroes" element={<Heroes />} />
            <Route path="/heroes/:id" element={<HeroDetail />} />
            <Route path="/roster" element={<Roster />} />
            <Route path="/team" element={<TeamBuilder />} />
            <Route path="/events" element={<Events />} />
            <Route path="/codes" element={<GiftCodes />} />
            <Route path="/guides" element={<Guides />} />
            <Route path="/gear" element={<Gear />} />
            <Route path="/pets" element={<Pets />} />
            <Route path="/relics" element={<Relics />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </Suspense>
      </MainLayout>
      <ChatAssistantEnhanced />
    </Router>
  );
};

export default App;
