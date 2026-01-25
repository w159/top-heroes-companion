import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Shield,
  Users,
  Sword,
  Calendar,
  Gift,
  BookOpen,
  Settings,
  Menu,
  X,
  Trophy,
  Sparkles,
  Target
} from 'lucide-react';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Heroes', path: '/heroes', icon: Shield },
    { name: 'Roster', path: '/roster', icon: Users },
    { name: 'Team Builder', path: '/team', icon: Target },
    { name: 'Events', path: '/events', icon: Calendar },
    { name: 'Gift Codes', path: '/codes', icon: Gift },
    { name: 'Guides', path: '/guides', icon: BookOpen },
    { name: 'Gear', path: '/gear', icon: Sword },
    { name: 'Pets', path: '/pets', icon: Sparkles },
    { name: 'Relics', path: '/relics', icon: Trophy },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  const getPageTitle = () => {
    const current = navItems.find(item => item.path === location.pathname);
    if (current) return current.name;
    if (location.pathname.startsWith('/heroes/')) return 'Hero Details';
    return 'Top Heroes Companion';
  };

  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside className={`sidebar ${isMobileMenuOpen ? 'sidebar-mobile-open' : ''}`}>
        <div className="sidebar-header">
          <div className="logo">
            <Shield size={32} strokeWidth={2.5} />
            <div className="logo-text">
              <h1>TOP HEROES</h1>
              <span>Companion</span>
            </div>
          </div>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              <item.icon size={20} />
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="main-content">
        <header className="app-header">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="mobile-menu-btn"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <h2 className="page-title">{getPageTitle()}</h2>
        </header>

        <main className="content">
          {children}
        </main>
      </div>

      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div
          className="mobile-overlay"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
};

export default MainLayout;
