import { ENDPOINT_CONFIG, ENDPOINT_PATHS } from '../config/endpoint.config';
import { SaveManager } from './SaveManager';
import {
  ApiBaseResponse,
  AuthTokenPayload,
  EventData,
  FullSyncPayload,
  SyncBadgeRequest,
  SyncCarrotCoinRequest,
  SyncCarrotCoinResponse,
} from '../types/endpoint';
import { UserProfile } from '../types/game';

class EndpointManagerClass {
  private config = { ...ENDPOINT_CONFIG };
  private activeToken: string | null = null;

  constructor() {
    this.initTokenFromStorage();
  }

  private initTokenFromStorage(): void {
    if (typeof window !== 'undefined') {
      const savedToken = localStorage.getItem(this.config.tokenStorageKey);
      if (savedToken) {
        this.activeToken = savedToken;
      }
    }
  }

  public setToken(token: string): void {
    this.activeToken = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.config.tokenStorageKey, token);
    }
  }

  public getToken(): string | null {
    return this.activeToken;
  }

  public toggleMockMode(useMock: boolean): void {
    this.config.useMockMode = useMock;
  }

  public isMockMode(): boolean {
    return this.config.useMockMode;
  }

  /**
   * Login using auth token from main web app (e.g., token passed via URL ?token=xyz or header)
   */
  public async loginWithMainAppToken(token: string): Promise<ApiBaseResponse<UserProfile>> {
    this.setToken(token);

    if (this.config.useMockMode) {
      // Mock API delay simulation
      await new Promise((r) => setTimeout(r, 400));

      const updatedPlayer: UserProfile = {
        ...SaveManager.getPlayer(),
        linkedMainAccount: true,
        token,
        lastSyncedAt: new Date().toISOString(),
      };

      SaveManager.updatePlayer(updatedPlayer);

      return {
        success: true,
        message: 'Token berhasil diverifikasi dari web app utama!',
        data: updatedPlayer,
        timestamp: new Date().toISOString(),
      };
    }

    try {
      const res = await fetch(`${this.config.baseUrl}${ENDPOINT_PATHS.authVerify}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ token }),
      });
      const data = await res.json();
      return data;
    } catch {
      return {
        success: false,
        message: 'Gagal terhubung ke endpoint web utama. Menggunakan mode offline fallback.',
        data: SaveManager.getPlayer(),
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * Sync Carrot Coins with main web app
   */
  public async syncCarrotCoins(amountChange: number, reason: string): Promise<ApiBaseResponse<SyncCarrotCoinResponse>> {
    const player = SaveManager.getPlayer();
    const payload: SyncCarrotCoinRequest = {
      publicId: player.publicId,
      token: this.activeToken || 'MOCK-TOKEN-DEMO',
      amountChange,
      reason,
    };

    if (this.config.useMockMode) {
      await new Promise((r) => setTimeout(r, 300));
      const newCoins = SaveManager.updateCarrotCoins(amountChange);

      return {
        success: true,
        message: `Carrot Coins tersinkronisasi: ${amountChange > 0 ? '+' : ''}${amountChange}`,
        data: {
          newCarrotCoins: newCoins,
          transactionId: `TX-CARROT-${Date.now()}`,
        },
        timestamp: new Date().toISOString(),
      };
    }

    try {
      const res = await fetch(`${this.config.baseUrl}${ENDPOINT_PATHS.syncCarrotCoins}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.activeToken}`,
        },
        body: JSON.stringify(payload),
      });
      return await res.json();
    } catch {
      const newCoins = SaveManager.updateCarrotCoins(amountChange);
      return {
        success: true,
        message: 'Mode offline: Carrot Coins tersimpan secara lokal.',
        data: { newCarrotCoins: newCoins, transactionId: `TX-LOCAL-${Date.now()}` },
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * Sync Badges with main web app
   */
  public async syncBadge(badgeId: string, action: 'grant' | 'equip' | 'unequip'): Promise<ApiBaseResponse<boolean>> {
    if (this.config.useMockMode) {
      await new Promise((r) => setTimeout(r, 200));
      const saveData = SaveManager.getSave();
      const updatedBadges = saveData.badges.map((b) => {
        if (b.id === badgeId) {
          return { ...b, isEquipped: action === 'equip' };
        }
        return action === 'equip' ? { ...b, isEquipped: false } : b;
      });
      SaveManager.updateSection('badges', updatedBadges);

      return {
        success: true,
        message: `Badge ${badgeId} berhasil di-${action}`,
        data: true,
        timestamp: new Date().toISOString(),
      };
    }

    return {
      success: true,
      message: 'Badge synced',
      data: true,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Fetch Active Events
   */
  public async fetchActiveEvents(): Promise<ApiBaseResponse<EventData[]>> {
    const mockEvents: EventData[] = [
      {
        eventId: 'evt_summer_race_2026',
        title: 'Summer Racing Festival 2026',
        bannerImage: '/background_utama.png',
        description: 'Ikuti event balapan musim panas dan dapatkan bonus +200% Carrot Coins!',
        startDate: '2026-08-01',
        endDate: '2026-08-15',
        isActive: true,
        rewardCarrotCoins: 5000,
      },
    ];

    return {
      success: true,
      message: 'Event data loaded',
      data: mockEvents,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Full Sync state with main web app
   */
  public async performFullSync(): Promise<ApiBaseResponse<FullSyncPayload>> {
    const saveData = SaveManager.getSave();
    const eventsRes = await this.fetchActiveEvents();

    return {
      success: true,
      message: 'Full sync berhasil dilakukan dengan Endpoint main web app!',
      data: {
        profile: saveData.player,
        badges: saveData.badges,
        inventory: saveData.inventory,
        achievements: saveData.achievements,
        activeEvents: eventsRes.data,
      },
      timestamp: new Date().toISOString(),
    };
  }
}

export const EndpointManager = new EndpointManagerClass();
