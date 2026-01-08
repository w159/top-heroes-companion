import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { LayoutGrid, Users, Calendar, Settings, Shield, Menu, X, Terminal } from 'lucide-react';
import '../styles/ios.css';

interface IOSLayoutProps {
  children: React.ReactNode;
}

const IOSLayout: React.FC<IOSLayoutProps> = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutGrid },
    { name: 'Heroes', path: '/heroes', icon: Shield },
    { name: 'Roster', path: '/roster', icon: Users },
    { name: 'Events', path: '/events', icon: Calendar },
    { name: 'Codes', path: '/codes', icon: Terminal },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  const getTitle = () => {
    const current = navItems.find(item => item.path === location.pathname);
    if (!current && location.pathname.startsWith('/heroes/')) return 'Hero Detail';
    return current ? current.name : 'Top Heroes';
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', flexDirection: 'column' }}>
      {/* Mobile Header */}
      <div className="glass" style={{ 
        position: 'sticky', top: 0, zIndex: 1000, 
        padding: '12px 16px', display: 'flex', 
        justifyContent: 'space-between', alignItems: 'center',
        background: 'rgba(255,255,255,0.85)'
      }}>
        <span style={{ fontWeight: 700, fontSize: '1.2rem' }}>{getTitle()}</span>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          style={{ background: 'none', border: 'none', padding: 8 }}
          className="md:hidden"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <div style={{ display: 'flex', flex: 1, position: 'relative' }}>
        {/* Sidebar (Desktop) */}
        <aside style={{ 
          width: '280px', 
          background: 'var(--ios-sidebar-bg)', 
          backdropFilter: 'blur(20px)',
          borderRight: '0.5px solid var(--ios-separator)',
          padding: '24px 16px',
          display: 'none',
          flexDirection: 'column',
          position: 'sticky',
          top: 0,
          height: '100vh',
          '@media (min-width: 768px)': { display: 'flex' }
        }} className="hidden md:flex">
          
          <div style={{ marginBottom: 32, padding: '0 12px' }}>
            <h1 style={{ fontSize: '24px', fontWeight: 800, margin: 0, color: 'var(--ios-blue)' }}>
              Top Heroes
            </h1>
            <p style={{ fontSize: '13px', color: 'var(--ios-text-secondary)', margin: '4px 0 0' }}>
              Companion App
            </p>
          </div>

          <nav style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '10px 12px',
                  borderRadius: 10,
                  textDecoration: 'none',
                  color: isActive ? 'white' : 'var(--ios-text-primary)',
                  background: isActive ? 'var(--ios-blue)' : 'transparent',
                  fontWeight: isActive ? 600 : 400,
                  transition: 'all 0.2s ease'
                })}
              >
                <item.icon size={20} />
                {item.name}
              </NavLink>
            ))}
          </nav>
        </aside>

        {/* content */}
        <main style={{ flex: 1, padding: '20px', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
          {children}
        </main>
      </div>

       {/* Mobile Tab Bar (Alternative to Side Menu for true iOS feel) */}
      <div className="md:hidden glass" style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        display: 'flex', justifyContent: 'space-around',
        padding: '10px 0 24px', // iPhone Home Indicator spacing
        borderTop: '0.5px solid var(--ios-separator)',
        background: 'rgba(255,255,255,0.9)'
      }}>
        {navItems.slice(0, 5).map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            style={({ isActive }) => ({
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              textDecoration: 'none', gap: 4,
              color: isActive ? 'var(--ios-blue)' : 'var(--ios-text-secondary)',
              fontSize: '10px', fontWeight: 500
            })}
          >
            <item.icon size={24} strokeWidth={isActive ? 2.5 : 2} />
            {item.name}
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default IOSLayout;
