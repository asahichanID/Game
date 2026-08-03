import { Achievement, InventoryItem, PlayerBadge, UserProfile } from './game';

export interface EndpointConfig {
  baseUrl: string;
  timeoutMs: number;
  useMockMode: boolean;
  tokenStorageKey: string;
}

export interface ApiBaseResponse<T> {
  success: boolean;
  message: string;
  data: T;
  code?: string;
  timestamp: string;
}

export interface AuthTokenPayload {
  token: string;
  mainAppUserId: string;
  expiresAt: string;
}

export interface SyncCarrotCoinRequest {
  publicId: string;
  token: string;
  amountChange: number;
  reason: string;
}

export interface SyncCarrotCoinResponse {
  newCarrotCoins: number;
  transactionId: string;
}

export interface SyncBadgeRequest {
  publicId: string;
  badgeId: string;
  action: 'grant' | 'equip' | 'unequip';
}

export interface SyncInventoryRequest {
  publicId: string;
  items: Array<{ itemId: string; quantityChange: number }>;
}

export interface SyncAchievementRequest {
  publicId: string;
  achievementId: string;
}

export interface EventData {
  eventId: string;
  title: string;
  bannerImage: string;
  description: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  rewardCarrotCoins: number;
}

export interface FullSyncPayload {
  profile: UserProfile;
  badges: PlayerBadge[];
  inventory: InventoryItem[];
  achievements: Achievement[];
  activeEvents: EventData[];
}
