import React, { Suspense, lazy } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import IOSLayout from './components/IOSLayout';
import ChatAssistant from './components/ChatAssistant';
import LoadingSpinner from './components/LoadingSpinner';
import './styles/ios.css';

// Lazy load all pages for optimal code splitting
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Heroes = lazy(() => import('./pages/Heroes'));
const HeroDetail = lazy(() => import('./pages/HeroDetail'));
const Roster = lazy(() => import('./pages/Roster'));
const Events = lazy(() => import('./pages/Events'));
const GiftCodes = lazy(() => import('./pages/GiftCodes'));
const Guides = lazy(() => import('./pages/Guides'));
const TeamBuilder = lazy(() => import('./pages/TeamBuilder'));
const Settings = lazy(() => import('./pages/Settings'));
const Pets = lazy(() => import('./pages/Pets'));
const Relics = lazy(() => import('./pages/Relics'));
const Gear = lazy(() => import('./pages/Gear'));

const App: React.FC = () => {
  return (
    <Router>
      <IOSLayout>
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
            <Route path="/settings" element={<Settings />} />
            <Route path="/pets" element={<Pets />} />
            <Route path="/relics" element={<Relics />} />
            <Route path="/gear" element={<Gear />} />
          </Routes>
        </Suspense>
      </IOSLayout>
      <ChatAssistant />
    </Router>
  );
};

export default App;