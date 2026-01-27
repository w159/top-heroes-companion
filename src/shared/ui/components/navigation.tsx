import * as React from 'react';
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
  Sparkles,
  Trophy,
  Target,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { IconButton } from './icon-button';
import { Separator } from './separator';

// Navigation structure with grouped sections
export interface NavItem {
  name: string;
  path: string;
  icon: LucideIcon;
}

export interface NavSection {
  title?: string;
  items: NavItem[];
}

export const navigationSections: NavSection[] = [
  {
    items: [
      { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    ],
  },
  {
    title: 'Heroes',
    items: [
      { name: 'All Heroes', path: '/heroes', icon: Shield },
      { name: 'My Roster', path: '/roster', icon: Users },
      { name: 'Team Builder', path: '/team', icon: Target },
    ],
  },
  {
    title: 'Equipment',
    items: [
      { name: 'Gear', path: '/gear', icon: Sword },
      { name: 'Pets', path: '/pets', icon: Sparkles },
      { name: 'Relics', path: '/relics', icon: Trophy },
    ],
  },
  {
    title: 'Resources',
    items: [
      { name: 'Events', path: '/events', icon: Calendar },
      { name: 'Gift Codes', path: '/codes', icon: Gift },
      { name: 'Guides', path: '/guides', icon: BookOpen },
    ],
  },
  {
    items: [
      { name: 'Settings', path: '/settings', icon: Settings },
    ],
  },
];

// Flat list for mobile bottom nav (top 5 items)
export const bottomNavItems: NavItem[] = [
  { name: 'Home', path: '/', icon: LayoutDashboard },
  { name: 'Heroes', path: '/heroes', icon: Shield },
  { name: 'Team', path: '/team', icon: Target },
  { name: 'Events', path: '/events', icon: Calendar },
  { name: 'More', path: '/settings', icon: Menu },
];

// ============================================
// Navigation Rail (Desktop Sidebar)
// ============================================

interface NavigationRailProps {
  onExpandClick?: () => void;
}

export const NavigationRail: React.FC<NavigationRailProps> = ({ onExpandClick }) => {
  const location = useLocation();

  // Flatten items for rail display
  const allItems = navigationSections.flatMap((section) => section.items);

  return (
    <aside className="fixed left-0 top-0 bottom-0 z-[200] hidden md:flex w-20 flex-col bg-surface-950 border-r border-border">
      {/* Logo */}
      <div className="flex items-center justify-center h-16 border-b border-border">
        <div className="w-10 h-10 rounded-lg bg-primary-600 flex items-center justify-center">
          <Shield className="w-6 h-6 text-white" strokeWidth={2.5} />
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 overflow-y-auto py-2 px-3">
        <div className="flex flex-col items-center gap-1">
          {allItems.map((item, index) => {
            const isActive = location.pathname === item.path ||
              (item.path !== '/' && location.pathname.startsWith(item.path));

            // Add separator before Settings (last item)
            const showSeparator = index === allItems.length - 1;

            return (
              <React.Fragment key={item.path}>
                {showSeparator && (
                  <Separator className="my-2 w-10" />
                )}
                <NavLink
                  to={item.path}
                  className={cn(
                    'group flex flex-col items-center justify-center w-14 py-1 rounded-xl transition-all duration-200',
                    isActive
                      ? 'text-secondary-100'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  <div
                    className={cn(
                      'flex items-center justify-center w-14 h-8 rounded-full transition-colors duration-200',
                      isActive
                        ? 'bg-secondary-800'
                        : 'group-hover:bg-surface-800'
                    )}
                  >
                    <item.icon className="w-5 h-5" />
                  </div>
                  <span className="text-label-sm mt-1 text-center truncate w-full px-1">
                    {item.name.split(' ')[0]}
                  </span>
                </NavLink>
              </React.Fragment>
            );
          })}
        </div>
      </nav>
    </aside>
  );
};

// ============================================
// Navigation Drawer (Expanded Sidebar)
// ============================================

interface NavigationDrawerProps {
  open: boolean;
  onClose: () => void;
}

export const NavigationDrawer: React.FC<NavigationDrawerProps> = ({
  open,
  onClose,
}) => {
  const location = useLocation();

  React.useEffect(() => {
    // Close drawer on route change
    onClose();
  }, [location.pathname]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          'fixed inset-0 z-[250] bg-black/50 transition-opacity duration-300 md:hidden',
          open ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={onClose}
      />

      {/* Drawer */}
      <aside
        className={cn(
          'fixed left-0 top-0 bottom-0 z-[300] w-72 max-w-[calc(100%-56px)] bg-surface-900 border-r border-border',
          'flex flex-col transition-transform duration-300 ease-[cubic-bezier(0.2,0,0,1)]',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Header */}
        <div className="flex items-center gap-4 p-4 border-b border-border">
          <div className="w-10 h-10 rounded-lg bg-primary-600 flex items-center justify-center flex-shrink-0">
            <Shield className="w-6 h-6 text-white" strokeWidth={2.5} />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-title-md font-semibold truncate">Top Heroes</h1>
            <span className="text-label-sm text-muted-foreground">Companion</span>
          </div>
          <IconButton variant="default" size="sm" onClick={onClose}>
            <X className="w-5 h-5" />
          </IconButton>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-2">
          {navigationSections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="px-3 mb-2">
              {section.title && (
                <div className="px-4 py-3 text-title-sm text-muted-foreground uppercase tracking-wider">
                  {section.title}
                </div>
              )}
              {section.items.map((item) => {
                const isActive = location.pathname === item.path ||
                  (item.path !== '/' && location.pathname.startsWith(item.path));

                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={cn(
                      'flex items-center gap-3 px-4 py-3 rounded-xl transition-colors duration-200',
                      isActive
                        ? 'bg-secondary-800 text-secondary-100'
                        : 'text-muted-foreground hover:bg-surface-800 hover:text-foreground'
                    )}
                  >
                    <item.icon className="w-5 h-5 flex-shrink-0" />
                    <span className="text-label-lg">{item.name}</span>
                  </NavLink>
                );
              })}
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
};

// ============================================
// Bottom Navigation (Mobile)
// ============================================

export const BottomNavigation: React.FC = () => {
  const location = useLocation();

  return (
    <nav className="fixed left-0 right-0 bottom-0 z-[200] flex md:hidden h-20 bg-surface-900 border-t border-border safe-area-bottom">
      <div className="flex items-center justify-around w-full px-2">
        {bottomNavItems.map((item) => {
          const isActive = location.pathname === item.path ||
            (item.path !== '/' && item.path !== '/settings' && location.pathname.startsWith(item.path));

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={cn(
                'flex flex-col items-center justify-center min-w-[64px] max-w-[96px] py-2 rounded-xl transition-colors duration-200',
                isActive
                  ? 'text-secondary-100'
                  : 'text-muted-foreground'
              )}
            >
              <div
                className={cn(
                  'flex items-center justify-center w-16 h-8 rounded-full transition-colors duration-200',
                  isActive ? 'bg-secondary-800' : ''
                )}
              >
                <item.icon className="w-5 h-5" />
              </div>
              <span className="text-label-sm mt-1">{item.name}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};

// ============================================
// Top App Bar
// ============================================

interface TopAppBarProps {
  title: string;
  onMenuClick?: () => void;
  actions?: React.ReactNode;
}

export const TopAppBar: React.FC<TopAppBarProps> = ({
  title,
  onMenuClick,
  actions,
}) => {
  return (
    <header className="sticky top-0 z-[150] h-16 bg-surface-950/95 backdrop-blur-sm border-b border-border flex items-center gap-4 px-4">
      {onMenuClick && (
        <IconButton
          variant="default"
          size="md"
          className="md:hidden"
          onClick={onMenuClick}
        >
          <Menu className="w-5 h-5" />
        </IconButton>
      )}
      <h1 className="flex-1 text-title-lg font-medium truncate">{title}</h1>
      {actions && (
        <div className="flex items-center gap-1">{actions}</div>
      )}
    </header>
  );
};

// ============================================
// Get Page Title Utility
// ============================================

export function getPageTitle(pathname: string): string {
  const allItems = navigationSections.flatMap((section) => section.items);
  const match = allItems.find(
    (item) => item.path === pathname ||
      (item.path !== '/' && pathname.startsWith(item.path))
  );
  if (match) return match.name;
  if (pathname.startsWith('/heroes/')) return 'Hero Details';
  return 'Top Heroes Companion';
}
