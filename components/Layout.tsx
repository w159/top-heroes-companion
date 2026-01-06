import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Users, Sword, Calendar, Gift, Settings, Menu, X, Shield } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const NavItem = ({ to, icon: Icon, label }: { to: string; icon: any; label: string }) => (
    <NavLink
      to={to}
      onClick={() => setIsMobileMenuOpen(false)}
      className={({ isActive }) =>
        `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
          isActive
            ? 'bg-blue-900/40 text-blue-400 border-l-4 border-blue-500'
            : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
        }`
      }
    >
      <Icon size={20} />
      <span className="font-medium">{label}</span>
    </NavLink>
  );

  return (
    <div className="min-h-screen bg-bg-primary text-gray-100 flex font-body">
      {/* Sidebar (Desktop) */}
      <aside className="hidden md:flex flex-col w-64 bg-bg-secondary border-r border-border fixed h-full z-10">
        <div className="p-6 border-b border-border flex items-center space-x-2">
          <Shield className="text-yellow-500" size={32} />
          <h1 className="text-xl font-display font-bold text-white tracking-wider">TOP HEROES</h1>
        </div>
        <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
          <NavItem to="/" icon={Home} label="Dashboard" />
          <NavItem to="/heroes" icon={Users} label="Hero Database" />
          <NavItem to="/roster" icon={Shield} label="My Roster" />
          <NavItem to="/team" icon={Sword} label="Team Builder" />
          <NavItem to="/events" icon={Calendar} label="Events" />
          <NavItem to="/codes" icon={Gift} label="Gift Codes" />
          <NavItem to="/settings" icon={Settings} label="Settings" />
        </nav>
        <div className="p-4 border-t border-border text-xs text-gray-600 text-center">
          <p>Unofficial Companion App</p>
          <p>v1.0.0</p>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 w-full bg-bg-secondary border-b border-border z-20 px-4 py-3 flex justify-between items-center">
         <div className="flex items-center space-x-2">
          <Shield className="text-yellow-500" size={24} />
          <span className="font-display font-bold text-lg">TOP HEROES</span>
        </div>
        <button onClick={toggleMenu} className="text-gray-300">
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-bg-primary z-10 pt-16 px-4">
          <nav className="flex flex-col space-y-2">
            <NavItem to="/" icon={Home} label="Dashboard" />
            <NavItem to="/heroes" icon={Users} label="Hero Database" />
            <NavItem to="/roster" icon={Shield} label="My Roster" />
            <NavItem to="/team" icon={Sword} label="Team Builder" />
            <NavItem to="/events" icon={Calendar} label="Events" />
            <NavItem to="/codes" icon={Gift} label="Gift Codes" />
            <NavItem to="/settings" icon={Settings} label="Settings" />
          </nav>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-4 md:p-8 pt-20 md:pt-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
            {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
