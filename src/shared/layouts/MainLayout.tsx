import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  NavigationRail,
  NavigationDrawer,
  BottomNavigation,
  TopAppBar,
  getPageTitle,
} from '../ui/components/navigation';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const location = useLocation();

  const pageTitle = getPageTitle(location.pathname);

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Navigation Rail */}
      <NavigationRail onExpandClick={() => setIsDrawerOpen(true)} />

      {/* Mobile Navigation Drawer */}
      <NavigationDrawer
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />

      {/* Main Content Area */}
      <div className="md:ml-20 min-h-screen flex flex-col">
        {/* Top App Bar */}
        <TopAppBar
          title={pageTitle}
          onMenuClick={() => setIsDrawerOpen(true)}
        />

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-6 pb-24 md:pb-6 max-w-[1400px] w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
};

export default MainLayout;
