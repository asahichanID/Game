export type RoutePath =
  | 'home'
  | 'character'
  | 'training'
  | 'race'
  | 'story'
  | 'inventory'
  | 'profile'
  | 'settings'
  | 'sandbox';

export interface RouteMeta {
  path: RoutePath;
  title: string;
  iconName: string;
  badge?: string;
}

export const GAME_ROUTES: RouteMeta[] = [
  { path: 'home', title: 'Home Hub', iconName: 'Home' },
  { path: 'character', title: 'Character', iconName: 'User', badge: '1 Beta' },
  { path: 'race', title: 'Race', iconName: 'Trophy' },
  { path: 'story', title: 'Story', iconName: 'BookOpen' },
  { path: 'inventory', title: 'Inventory', iconName: 'Package' },
  { path: 'profile', title: 'Profile', iconName: 'ShieldCheck' },
  { path: 'settings', title: 'Settings', iconName: 'Settings' },
  { path: 'sandbox', title: 'Dev Sandbox', iconName: 'Terminal', badge: 'Test UI' },
];
