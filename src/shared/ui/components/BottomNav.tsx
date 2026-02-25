import * as React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { Button } from './button';
import { bottomNavItems } from './navigationConfig';

// ============================================
// Bottom Navigation (Mobile)
// ============================================

export const BottomNavigation: React.FC = () => {
  const location = useLocation();

  return (
    <nav className="fixed left-0 right-0 bottom-0 z-[200] flex md:hidden h-20 bg-surface-950/95 backdrop-blur-md border-t border-surface-700/30 safe-area-bottom">
      <div className="flex items-center justify-around w-full px-2">
        {bottomNavItems.map((item) => {
          const isActive = location.pathname === item.path ||
            (item.path !== '/' && item.path !== '/settings' && location.pathname.startsWith(item.path));

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={cn(
                'flex flex-col items-center justify-center min-w-[56px] max-w-[80px] py-2 rounded-lg transition-all duration-normal',
                isActive
                  ? 'text-primary-300'
                  : 'text-muted-foreground'
              )}
            >
              <div
                className={cn(
                  'flex items-center justify-center w-14 h-8 rounded-lg transition-all duration-normal',
                  isActive ? 'bg-primary-900/40 shadow-glow' : ''
                )}
              >
                <item.icon className="w-5 h-5" />
              </div>
              <span className={cn(
                'text-[10px] mt-1 tracking-wide uppercase font-medium',
                isActive && 'text-primary-400'
              )}>
                {item.name}
              </span>
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
    <header className="sticky top-0 z-[150] h-16 bg-surface-950/90 backdrop-blur-md border-b border-surface-700/20 flex items-center gap-4 px-5">
      {onMenuClick && (
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={onMenuClick}
        >
          <Menu className="w-5 h-5" />
        </Button>
      )}
      <h1 className="flex-1 text-title-lg font-heading font-medium truncate tracking-wide">{title}</h1>
      {actions && (
        <div className="flex items-center gap-1">{actions}</div>
      )}
    </header>
  );
};
