import * as React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Shield } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from './sheet';
import { ScrollArea } from './scroll-area';
import { navigationSections } from './navigationConfig';

interface NavigationDrawerProps {
  open: boolean;
  onClose: () => void;
}

export const NavigationDrawer: React.FC<NavigationDrawerProps> = ({ open, onClose }) => {
  const location = useLocation();

  React.useEffect(() => {
    onClose();
  }, [location.pathname]);

  return (
    <Sheet open={open} onOpenChange={(isOpen) => { if (!isOpen) onClose(); }}>
      <SheetContent side="left" className="w-72 p-0 bg-surface-900/98 border-r border-surface-700/30">
        <SheetHeader className="p-5 border-b border-surface-700/30">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center flex-shrink-0 shadow-glow">
              <Shield className="w-5 h-5 text-surface-950" strokeWidth={2.5} />
            </div>
            <div className="flex-1 min-w-0">
              <SheetTitle className="text-title-md font-heading font-semibold truncate text-gradient">Top Heroes</SheetTitle>
              <span className="text-label-sm text-muted-foreground tracking-wider uppercase">Companion</span>
            </div>
          </div>
        </SheetHeader>

        <ScrollArea className="flex-1 h-[calc(100vh-80px)]">
          <nav className="py-3">
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
                        'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 mb-0.5',
                        isActive
                          ? 'bg-primary-900/30 text-primary-200 border border-primary-700/20'
                          : 'text-muted-foreground hover:bg-surface-800/60 hover:text-foreground border border-transparent'
                      )}
                    >
                      <item.icon className={cn('w-[18px] h-[18px] flex-shrink-0', isActive && 'text-primary-400')} />
                      <span className="text-sm font-medium">{item.name}</span>
                    </NavLink>
                  );
                })}
              </div>
            ))}
          </nav>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};
