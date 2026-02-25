import * as React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Shield, X } from 'lucide-react';
import { cn } from '../../lib/utils';
import { IconButton } from './icon-button';
import { navigationSections } from './navigationConfig';

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
    onClose();
  }, [location.pathname]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          'fixed inset-0 z-[250] bg-black/60 backdrop-blur-sm transition-opacity duration-300 md:hidden',
          open ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={onClose}
      />

      {/* Drawer */}
      <aside
        className={cn(
          'fixed left-0 top-0 bottom-0 z-[300] w-72 max-w-[calc(100%-56px)]',
          'bg-surface-900/98 backdrop-blur-md border-r border-[rgba(196,170,126,0.1)]',
          'flex flex-col transition-transform duration-300 ease-[cubic-bezier(0.2,0,0,1)]',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Header */}
        <div className="flex items-center gap-4 p-5 border-b border-[rgba(196,170,126,0.08)]">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center flex-shrink-0 shadow-glow">
            <Shield className="w-5 h-5 text-surface-950" strokeWidth={2.5} />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-title-md font-heading font-semibold truncate text-gradient">Top Heroes</h1>
            <span className="text-label-sm text-muted-foreground tracking-wider uppercase">Companion</span>
          </div>
          <IconButton variant="default" size="sm" onClick={onClose}>
            <X className="w-5 h-5" />
          </IconButton>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-3">
          {navigationSections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="px-3 mb-1">
              {section.title && (
                <div className="px-4 py-3 text-[11px] text-primary-500/80 uppercase tracking-[0.15em] font-medium">
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
                      'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-normal mb-0.5',
                      isActive
                        ? 'bg-primary-900/30 text-primary-200 border border-primary-700/20'
                        : 'text-muted-foreground hover:bg-surface-800/60 hover:text-foreground border border-transparent'
                    )}
                  >
                    <item.icon className={cn('w-[18px] h-[18px] flex-shrink-0', isActive && 'text-primary-400')} />
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
