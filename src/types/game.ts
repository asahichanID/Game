export type Rarity = 'N' | 'R' | 'SR' | 'SSR' | 'UR';

export interface CharacterStatus {
  speed: number;
  stamina: number;
  power: number;
  guts: number;
  wit: number;
}

export interface CharacterGrowth {
  speedGrowth: number;
  staminaGrowth: number;
  powerGrowth: number;
  gutsGrowth: number;
  witGrowth: number;
}

export interface CharacterVoiceLines {
  titleCall: string;
  greeting: string;
  trainingStart: string;
  trainingSuccess: string;
  raceStart: string;
  victory: string;
  ultimate: string;
}

export interface CharacterAnimations {
  idle: string;
  cheer: string;
  win: string;
  run: string;
}

export interface CharacterConfig {
  id: string;
  name: string;
  title: string;
  rarity: Rarity;
  icon: string;
  fullBody: string;
  winImage: string;
  ultimateVideo: string;
  trainingBackground: string;
  status: CharacterStatus;
  growth: CharacterGrowth;
  voice: CharacterVoiceLines;
  animation: CharacterAnimations;
  bio: string;
  favoriteFood: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  description: string;
  category: 'consumable' | 'material' | 'badge' | 'equipment';
  icon: string;
  rarity: Rarity;
  quantity: number;
  usable: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: string;
  unlocked: boolean;
  unlockedAt?: string;
  rewardCarrotCoins: number;
}

export interface PlayerBadge {
  id: string;
  name: string;
  icon: string;
  description: string;
  acquiredAt: string;
  isEquipped: boolean;
}

export interface UserProfile {
  publicId: string;
  username: string;
  avatar: string;
  trainerLevel: number;
  exp: number;
  maxExp: number;
  carrotCoins: number;
  premiumCoins: number;
  isPremium: boolean;
  linkedMainAccount: boolean;
  token?: string;
  lastSyncedAt: string;
}

export interface SaveData {
  version: string;
  timestamp: string;
  player: UserProfile;
  characters: {
    selectedId: string;
    unlockedIds: string[];
    characterStates: Record<string, { level: number; affection: number; stats: CharacterStatus }>;
  };
  progress: {
    trainingCompleted: number;
    racesWon: number;
    storyChapter: number;
  };
  inventory: InventoryItem[];
  achievements: Achievement[];
  badges: PlayerBadge[];
  configuration: {
    bgmVolume: number;
    sfxVolume: number;
    voiceVolume: number;
    highPerformance: boolean;
    particlesEnabled: boolean;
  };
}
