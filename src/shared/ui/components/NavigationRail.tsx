import * as React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Shield } from 'lucide-react';
import { cn } from '../../lib/utils';
import { navigationSections } from './navigationConfig';

interface NavigationRailProps {
  onExpandClick?: () => void;
}

export const NavigationRail: React.FC<NavigationRailProps> = ({ onExpandClick }) => {
  const location = useLocation();
  const allItems = navigationSections.flatMap((section) => section.items);

  return (
    <aside className="fixed left-0 top-0 bottom-0 z-[200] hidden md:flex w-20 flex-col bg-surface-950/95 backdrop-blur-sm border-r border-[rgba(196,170,126,0.08)]">
      {/* Logo */}
      <div className="flex items-center justify-center h-16 border-b border-[rgba(196,170,126,0.08)]">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-glow">
          <Shield className="w-5 h-5 text-surface-950" strokeWidth={2.5} />
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 overflow-y-auto py-3 px-3">
        <div className="flex flex-col items-center gap-1">
          {allItems.map((item, index) => {
            const isActive = location.pathname === item.path ||
              (item.path !== '/' && location.pathname.startsWith(item.path));

            const showSeparator = index === allItems.length - 1;

            return (
              <React.Fragment key={item.path}>
                {showSeparator && (
                  <div className="rune-divider w-8 my-2" />
                )}
                <NavLink
                  to={item.path}
                  className={cn(
                    'group flex flex-col items-center justify-center w-14 py-1.5 rounded-lg transition-all duration-normal',
                    isActive
                      ? 'text-primary-300'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  <div
                    className={cn(
                      'flex items-center justify-center w-12 h-8 rounded-lg transition-all duration-normal',
                      isActive
                        ? 'bg-primary-900/40 border border-primary-600/20 shadow-glow'
                        : 'group-hover:bg-surface-800/60'
                    )}
                  >
                    <item.icon className="w-[18px] h-[18px]" />
                  </div>
                  <span className="text-[10px] font-medium mt-1.5 text-center truncate w-full px-0.5 tracking-wide uppercase">
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
