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
  ChevronRight,
  Search,
  Bell,
  User,
  Menu,
  X,
  Trophy,
  Sparkles,
  Target
} from 'lucide-react';
import '../styles/design-system.css';

interface PremiumLayoutProps {
  children: React.ReactNode;
}

const PremiumLayout: React.FC<PremiumLayoutProps> = ({ children }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();

  // Auto-close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard, badge: null },
    { name: 'Heroes', path: '/heroes', icon: Shield, badge: '50' },
    { name: 'Roster', path: '/roster', icon: Users, badge: null },
    { name: 'Team Builder', path: '/team', icon: Target, badge: 'New' },
    { name: 'Events', path: '/events', icon: Calendar, badge: '3' },
    { name: 'Gift Codes', path: '/codes', icon: Gift, badge: null },
    { name: 'Guides', path: '/guides', icon: BookOpen, badge: null },
  ];

  const secondaryNavItems = [
    { name: 'Gear', path: '/gear', icon: Sword },
    { name: 'Pets', path: '/pets', icon: Sparkles },
    { name: 'Relics', path: '/relics', icon: Trophy },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  const getPageTitle = () => {
    const allItems = [...navItems, ...secondaryNavItems];
    const current = allItems.find(item => item.path === location.pathname);
    if (current) return current.name;
    if (location.pathname.startsWith('/heroes/')) return 'Hero Details';
    return 'Top Heroes Companion';
  };

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      background: 'var(--color-bg-primary)',
      position: 'relative'
    }}>
      {/* Sidebar - Desktop */}
      <aside
        className="animate-fadeIn"
        style={{
          width: isSidebarCollapsed ? '80px' : '280px',
          background: 'var(--color-bg-secondary)',
          borderRight: '1px solid var(--color-border)',
          display: 'flex',
          flexDirection: 'column',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          zIndex: 'var(--z-fixed)',
          transition: 'width var(--transition-base)',
          overflow: 'hidden',
        }}
        className="hidden md:flex"
      >
        {/* Logo Section */}
        <div style={{
          padding: 'var(--space-xl)',
          borderBottom: '1px solid var(--color-border)',
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-md)',
          minHeight: '80px'
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: 'var(--radius-lg)',
            background: 'var(--gradient-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            boxShadow: 'var(--shadow-glow)'
          }}>
            <Shield size={28} color="white" strokeWidth={2.5} />
          </div>
          {!isSidebarCollapsed && (
            <div style={{ flex: 1, minWidth: 0 }}>
              <h1 className="font-display" style={{
                fontSize: 'var(--text-lg)',
                margin: 0,
                color: 'var(--color-text-primary)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                TOP HEROES
              </h1>
              <p style={{
                fontSize: 'var(--text-xs)',
                color: 'var(--color-text-tertiary)',
                margin: 0,
                textTransform: 'uppercase',
                letterSpacing: '0.1em'
              }}>
                Companion
              </p>
            </div>
          )}
        </div>

        {/* Navigation - Primary */}
        <nav style={{
          flex: 1,
          padding: 'var(--space-lg)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-sm)',
          overflowY: 'auto',
          overflowX: 'hidden'
        }}>
          <div style={{
            fontSize: 'var(--text-xs)',
            fontWeight: 600,
            color: 'var(--color-text-tertiary)',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            marginBottom: 'var(--space-sm)',
            paddingLeft: isSidebarCollapsed ? 0 : 'var(--space-md)',
            textAlign: isSidebarCollapsed ? 'center' : 'left'
          }}>
            {!isSidebarCollapsed && 'Main Menu'}
          </div>

          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-md)',
                padding: 'var(--space-md)',
                borderRadius: 'var(--radius-lg)',
                textDecoration: 'none',
                color: isActive ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                background: isActive ? 'var(--color-bg-elevated)' : 'transparent',
                border: isActive ? '1px solid var(--color-primary)' : '1px solid transparent',
                fontWeight: isActive ? 600 : 400,
                fontSize: 'var(--text-sm)',
                transition: 'all var(--transition-base)',
                position: 'relative',
                overflow: 'hidden',
                justifyContent: isSidebarCollapsed ? 'center' : 'flex-start'
              })}
              className="nav-item"
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'var(--gradient-radial-glow)',
                      opacity: 0.5,
                      pointerEvents: 'none'
                    }} />
                  )}
                  <item.icon
                    size={20}
                    strokeWidth={isActive ? 2.5 : 2}
                    style={{ flexShrink: 0, position: 'relative', zIndex: 1 }}
                  />
                  {!isSidebarCollapsed && (
                    <>
                      <span style={{ flex: 1, position: 'relative', zIndex: 1 }}>{item.name}</span>
                      {item.badge && (
                        <span className="badge badge-primary" style={{
                          position: 'relative',
                          zIndex: 1,
                          fontSize: '10px',
                          padding: '2px 8px'
                        }}>
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                </>
              )}
            </NavLink>
          ))}

          {/* Secondary Navigation */}
          <div style={{
            marginTop: 'var(--space-xl)',
            paddingTop: 'var(--space-xl)',
            borderTop: '1px solid var(--color-divider)'
          }}>
            <div style={{
              fontSize: 'var(--text-xs)',
              fontWeight: 600,
              color: 'var(--color-text-tertiary)',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              marginBottom: 'var(--space-sm)',
              paddingLeft: isSidebarCollapsed ? 0 : 'var(--space-md)',
              textAlign: isSidebarCollapsed ? 'center' : 'left'
            }}>
              {!isSidebarCollapsed && 'Resources'}
            </div>

            {secondaryNavItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-md)',
                  padding: 'var(--space-md)',
                  borderRadius: 'var(--radius-lg)',
                  textDecoration: 'none',
                  color: isActive ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                  background: isActive ? 'var(--color-bg-elevated)' : 'transparent',
                  fontWeight: isActive ? 600 : 400,
                  fontSize: 'var(--text-sm)',
                  transition: 'all var(--transition-base)',
                  marginBottom: 'var(--space-sm)',
                  justifyContent: isSidebarCollapsed ? 'center' : 'flex-start'
                })}
              >
                <item.icon size={20} style={{ flexShrink: 0 }} />
                {!isSidebarCollapsed && <span style={{ flex: 1 }}>{item.name}</span>}
              </NavLink>
            ))}
          </div>
        </nav>

        {/* Sidebar Toggle */}
        <button
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          style={{
            position: 'absolute',
            right: '-12px',
            top: '80px',
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            background: 'var(--color-bg-elevated)',
            border: '1px solid var(--color-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all var(--transition-base)',
            zIndex: 1
          }}
          className="hidden md:flex"
        >
          <ChevronRight
            size={14}
            style={{
              transform: isSidebarCollapsed ? 'rotate(0deg)' : 'rotate(180deg)',
              transition: 'transform var(--transition-base)'
            }}
          />
        </button>
      </aside>

      {/* Main Content Area */}
      <div style={{
        marginLeft: isSidebarCollapsed ? '80px' : '280px',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        transition: 'margin-left var(--transition-base)'
      }}
        className="md:ml-0"
      >
        {/* Top Header Bar */}
        <header style={{
          height: '80px',
          background: 'var(--color-bg-secondary)',
          borderBottom: '1px solid var(--color-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 var(--space-xl)',
          position: 'sticky',
          top: 0,
          zIndex: 'var(--z-sticky)',
          backdropFilter: 'var(--blur-lg)'
        }}>
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="btn btn-ghost md:hidden"
            style={{ padding: 'var(--space-sm)' }}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Page Title */}
          <div className="hidden md:block">
            <h2 className="font-heading" style={{
              fontSize: 'var(--text-2xl)',
              color: 'var(--color-text-primary)',
              margin: 0
            }}>
              {getPageTitle()}
            </h2>
          </div>

          {/* Search & Actions */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-md)',
            flex: 1,
            justifyContent: 'flex-end'
          }}>
            {/* Search */}
            <div style={{
              position: 'relative',
              maxWidth: '400px',
              flex: 1
            }}
              className="hidden lg:block"
            >
              <Search
                size={18}
                style={{
                  position: 'absolute',
                  left: 'var(--space-md)',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--color-text-tertiary)'
                }}
              />
              <input
                type="text"
                placeholder="Search heroes, guides..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input"
                style={{
                  paddingLeft: 'var(--space-3xl)',
                  height: '44px',
                  fontSize: 'var(--text-sm)'
                }}
              />
            </div>

            {/* Notifications */}
            <button
              className="btn btn-ghost"
              style={{
                width: '44px',
                height: '44px',
                padding: 0,
                position: 'relative'
              }}
            >
              <Bell size={20} />
              <span style={{
                position: 'absolute',
                top: '8px',
                right: '8px',
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: 'var(--color-danger)',
                border: '2px solid var(--color-bg-secondary)'
              }} />
            </button>

            {/* User Profile */}
            <button
              className="btn btn-ghost"
              style={{
                width: '44px',
                height: '44px',
                padding: 0,
                borderRadius: '50%'
              }}
            >
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'var(--gradient-gold)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700
              }}>
                <User size={20} color="var(--color-text-inverse)" />
              </div>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main style={{
          flex: 1,
          padding: 'var(--space-2xl)',
          maxWidth: '1600px',
          width: '100%',
          margin: '0 auto'
        }}
          className="animate-fadeIn"
        >
          {children}
        </main>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.8)',
            zIndex: 'var(--z-modal-backdrop)',
            backdropFilter: 'var(--blur-md)'
          }}
          onClick={() => setIsMobileMenuOpen(false)}
          className="md:hidden"
        >
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
              width: '280px',
              background: 'var(--color-bg-secondary)',
              padding: 'var(--space-xl)',
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-sm)',
              overflowY: 'auto'
            }}
            onClick={(e) => e.stopPropagation()}
            className="animate-slideIn"
          >
            {/* Logo */}
            <div style={{ marginBottom: 'var(--space-xl)' }}>
              <h1 className="font-display" style={{
                fontSize: 'var(--text-xl)',
                margin: 0,
                color: 'var(--color-text-primary)'
              }}>
                TOP HEROES
              </h1>
              <p style={{
                fontSize: 'var(--text-xs)',
                color: 'var(--color-text-tertiary)',
                margin: 0
              }}>
                Companion
              </p>
            </div>

            {/* Mobile Nav Items */}
            {[...navItems, ...secondaryNavItems].map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-md)',
                  padding: 'var(--space-md)',
                  borderRadius: 'var(--radius-lg)',
                  textDecoration: 'none',
                  color: isActive ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                  background: isActive ? 'var(--color-bg-elevated)' : 'transparent',
                  fontWeight: isActive ? 600 : 400,
                  fontSize: 'var(--text-sm)'
                })}
              >
                <item.icon size={20} />
                <span>{item.name}</span>
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PremiumLayout;
