import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import IOSLayout from './components/IOSLayout';
import ChatAssistant from './components/ChatAssistant';
import './styles/ios.css';
import Dashboard from './pages/Dashboard';
import Heroes from './pages/Heroes';
import HeroDetail from './pages/HeroDetail';
import Roster from './pages/Roster';
import Events from './pages/Events';
import Codes from './pages/Codes';
import TeamBuilder from './pages/TeamBuilder';
import Settings from './pages/Settings';
import Pets from './pages/Pets';
import Relics from './pages/Relics';
import Gear from './pages/Gear';

const App: React.FC = () => {
  return (
    <Router>
      <IOSLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/heroes" element={<Heroes />} />
          <Route path="/heroes/:id" element={<HeroDetail />} />
          <Route path="/roster" element={<Roster />} />
          <Route path="/team" element={<TeamBuilder />} />
          <Route path="/events" element={<Events />} />
          <Route path="/codes" element={<Codes />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/pets" element={<Pets />} />
          <Route path="/relics" element={<Relics />} />
          <Route path="/gear" element={<Gear />} />
        </Routes>
      </IOSLayout>
      <ChatAssistant />
    </Router>
  );
};

export default App;