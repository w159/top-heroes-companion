import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Heroes from './pages/Heroes';
import HeroDetail from './pages/HeroDetail';
import Roster from './pages/Roster';
import Events from './pages/Events';
import Codes from './pages/Codes';
import TeamBuilder from './pages/TeamBuilder';
import Settings from './pages/Settings';

const App: React.FC = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/heroes" element={<Heroes />} />
          <Route path="/heroes/:id" element={<HeroDetail />} />
          <Route path="/roster" element={<Roster />} />
          <Route path="/team" element={<TeamBuilder />} />
          <Route path="/events" element={<Events />} />
          <Route path="/codes" element={<Codes />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;