import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Shield, Calendar, Trophy, Zap, 
  ChevronRight, ArrowUpRight 
} from 'lucide-react';
import '../styles/ios.css';
import heroesData from '../src/data/heroes.json';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  
  // Quick stats
  const totalHeroes = heroesData.length;
  const mythicHeroes = heroesData.filter((h: any) => h.rarity === 'Mythic').length;

  const quickLinks = [
    { title: 'Hero Database', icon: Shield, path: '/heroes', color: '#007AFF' },
    { title: 'Event Roadmap', icon: Calendar, path: '/events', color: '#FF9500' },
    { title: 'Roster Manager', icon: Trophy, path: '/roster', color: '#AF52DE' },
    { title: 'Gift Codes', icon: Zap, path: '/codes', color: '#34C759' },
  ];

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: '34px', fontWeight: 800, margin: '0 0 8px', color: 'var(--ios-text-primary)' }}>
          Dashboard
        </h1>
        <p style={{ fontSize: '17px', color: 'var(--ios-text-secondary)', margin: 0 }}>
          Welcome back, Commander.
        </p>
      </div>

      {/* Quick Links Grid */}
      <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: 16, color: 'var(--ios-text-primary)' }}>Quick Access</h2>
      <div style={{ 
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
        gap: 16, marginBottom: 40 
      }}>
        {quickLinks.map((link) => (
          <div 
            key={link.title}
            onClick={() => navigate(link.path)}
            className="ios-card"
            style={{ 
              padding: 20, cursor: 'pointer', 
              display: 'flex', flexDirection: 'column', gap: 16,
              transition: 'transform 0.1s'
            }}
            onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.96)'}
            onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <div style={{ 
              width: 40, height: 40, borderRadius: 10, 
              background: link.color, display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', boxShadow: `0 4px 12px ${link.color}60`
            }}>
              <link.icon size={22} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <span style={{ fontWeight: 600, fontSize: '15px', color: 'var(--ios-text-primary)' }}>{link.title}</span>
              <ArrowUpRight size={16} color="var(--ios-text-secondary)" />
            </div>
          </div>
        ))}
      </div>

      {/* Featured / Recent Section */}
      <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: 16, color: 'var(--ios-text-primary)' }}>Database Status</h2>
      <div className="ios-card" style={{ padding: 0 }}>
         <div style={{ padding: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '0.5px solid var(--ios-separator)' }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
               <span style={{ fontSize: '13px', color: 'var(--ios-text-secondary)', textTransform: 'uppercase', fontWeight: 600 }}>Total Operatives</span>
               <span style={{ fontSize: '28px', fontWeight: 800, color: 'var(--ios-text-primary)' }}>{totalHeroes}</span>
            </div>
             <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#34C759' }} />
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#34C759' }}>Operational</span>
             </div>
         </div>
         <div 
           onClick={() => navigate('/heroes')}
           style={{ 
             padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
             cursor: 'pointer' 
           }}
         >
            <span style={{ fontSize: '15px', fontWeight: 500, color: 'var(--ios-text-primary)' }}>View Full Roster</span>
            <ChevronRight size={18} color="var(--ios-text-secondary)" />
         </div>
      </div>
      
    </div>
  );
};

export default Dashboard;