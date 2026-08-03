import { GAME_CONFIG } from '../config/game.config';
import { BETA_CHARACTER_ASAHI } from '../game/characters/character.data';
import { SaveData, UserProfile } from '../types/game';

type SaveListener = (data: SaveData) => void;

const DEFAULT_SAVE_DATA: SaveData = {
  version: GAME_CONFIG.version,
  timestamp: new Date().toISOString(),
  player: {
    publicId: 'SHRN-98241',
    username: 'Trainer Shironna',
    avatar: BETA_CHARACTER_ASAHI.icon,
    trainerLevel: 12,
    exp: 2400,
    maxExp: 5000,
    carrotCoins: 12500,
    premiumCoins: 150,
    isPremium: true,
    linkedMainAccount: false,
    lastSyncedAt: new Date().toISOString(),
  },
  characters: {
    selectedId: BETA_CHARACTER_ASAHI.id,
    unlockedIds: [BETA_CHARACTER_ASAHI.id],
    characterStates: {
      [BETA_CHARACTER_ASAHI.id]: {
        level: 15,
        affection: 80,
        stats: { ...BETA_CHARACTER_ASAHI.status },
      },
    },
  },
  progress: {
    trainingCompleted: 24,
    racesWon: 18,
    storyChapter: 3,
  },
  inventory: [
    {
      id: 'item_carrot_shake',
      name: 'Super Carrot Shake',
      description: 'Memulihkan 50 Stamina karakter saat latihan.',
      category: 'consumable',
      icon: '🥕',
      rarity: 'SR',
      quantity: 10,
      usable: true,
    },
    {
      id: 'item_golden_horseshoe',
      name: 'Golden Horseshoe',
      description: 'Meningkatkan Speed Growth sebesar +10%.',
      category: 'equipment',
      icon: '👟',
      rarity: 'SSR',
      quantity: 2,
      usable: true,
    },
  ],
  achievements: [
    {
      id: 'ach_first_win',
      title: 'First Victory!',
      description: 'Memenangkan balapan pertama.',
      icon: '🏆',
      category: 'Race',
      unlocked: true,
      unlockedAt: '2026-07-28T10:00:00Z',
      rewardCarrotCoins: 500,
    },
    {
      id: 'ach_training_master',
      title: 'Master Trainer',
      description: 'Selesaikan 20 sesi latihan.',
      icon: '💪',
      category: 'Training',
      unlocked: true,
      unlockedAt: '2026-07-30T14:20:00Z',
      rewardCarrotCoins: 1000,
    },
  ],
  badges: [
    {
      id: 'badge_beta_tester',
      name: 'Beta Pioneer',
      icon: '⭐',
      description: 'Diberikan kepada pengguna versi Beta game.shironna.my.id',
      acquiredAt: '2026-07-25T08:00:00Z',
      isEquipped: true,
    },
  ],
  configuration: {
    bgmVolume: 0.7,
    sfxVolume: 0.8,
    voiceVolume: 0.9,
    highPerformance: true,
    particlesEnabled: true,
  },
};

class SaveManagerClass {
  private currentSave: SaveData = { ...DEFAULT_SAVE_DATA };
  private listeners: Set<SaveListener> = new Set();

  constructor() {
    this.loadFromStorage();
  }

  public subscribe(listener: SaveListener): () => void {
    this.listeners.add(listener);
    listener(this.currentSave);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify(): void {
    this.listeners.forEach((l) => l(this.currentSave));
  }

  public getSave(): SaveData {
    return { ...this.currentSave };
  }

  public getPlayer(): UserProfile {
    return { ...this.currentSave.player };
  }

  public updatePlayer(partial: Partial<UserProfile>): void {
    this.currentSave.player = {
      ...this.currentSave.player,
      ...partial,
    };
    this.saveToStorage();
  }

  public updateCarrotCoins(delta: number): number {
    const newAmount = Math.max(0, this.currentSave.player.carrotCoins + delta);
    this.currentSave.player.carrotCoins = newAmount;
    this.saveToStorage();
    return newAmount;
  }

  public updateSection<K extends keyof SaveData>(section: K, value: SaveData[K]): void {
    this.currentSave[section] = value;
    this.saveToStorage();
  }

  public saveToStorage(): void {
    this.currentSave.timestamp = new Date().toISOString();
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(GAME_CONFIG.storageKey, JSON.stringify(this.currentSave));
      }
    } catch {
      // LocalStorage fallback catch
    }
    this.notify();
  }

  public loadFromStorage(): SaveData {
    try {
      if (typeof window !== 'undefined') {
        const raw = localStorage.getItem(GAME_CONFIG.storageKey);
        if (raw) {
          const parsed = JSON.parse(raw);
          this.currentSave = { ...DEFAULT_SAVE_DATA, ...parsed };
        }
      }
    } catch {
      this.currentSave = { ...DEFAULT_SAVE_DATA };
    }
    return this.currentSave;
  }

  public resetToDefault(): void {
    this.currentSave = JSON.parse(JSON.stringify(DEFAULT_SAVE_DATA));
    this.saveToStorage();
  }

  public exportSaveJson(): string {
    return JSON.stringify(this.currentSave, null, 2);
  }

  public importSaveJson(jsonString: string): boolean {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.player && parsed.characters && parsed.version) {
        this.currentSave = parsed;
        this.saveToStorage();
        return true;
      }
    } catch {
      // Parse error
    }
    return false;
  }
}

export const SaveManager = new SaveManagerClass();
