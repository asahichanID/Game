import { EndpointConfig } from '../types/endpoint';

export const ENDPOINT_CONFIG: EndpointConfig = {
  baseUrl: process.env.APP_URL || 'https://game.shironna.my.id/api',
  timeoutMs: 10000,
  useMockMode: true, // Default to true in Sandbox / AI Studio test environment
  tokenStorageKey: 'shironna_game_auth_token',
};

export const ENDPOINT_PATHS = {
  authVerify: '/v1/auth/verify-token',
  getProfile: '/v1/player/profile',
  syncCarrotCoins: '/v1/sync/carrot-coins',
  syncBadges: '/v1/sync/badges',
  syncInventory: '/v1/sync/inventory',
  syncAchievements: '/v1/sync/achievements',
  getEvents: '/v1/events/active',
  fullSync: '/v1/sync/full',
};
