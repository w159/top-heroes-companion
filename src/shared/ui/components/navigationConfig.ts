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
  Sparkles,
  Trophy,
  Target,
  type LucideIcon,
} from 'lucide-react';

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

export const bottomNavItems: NavItem[] = [
  { name: 'Home', path: '/', icon: LayoutDashboard },
  { name: 'Heroes', path: '/heroes', icon: Shield },
  { name: 'Team', path: '/team', icon: Target },
  { name: 'Events', path: '/events', icon: Calendar },
  { name: 'More', path: '/settings', icon: Menu },
];

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
