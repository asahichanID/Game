import React from 'react';
import { BUNDLED_ASSETS } from '../assets';

export interface AssetInfo {
  id: string;
  name: string;
  path: string;
  resolvedUrl: string;
  type: 'image' | 'video';
  status: 'loading' | 'loaded' | 'failed';
  httpStatus?: number;
  contentType?: string;
  fileSize?: string;
  errorMessage?: string;
}

type AssetListener = (assets: Record<string, AssetInfo>) => void;

class AssetManagerClass {
  private assets: Record<string, AssetInfo> = {};
  private listeners: Set<AssetListener> = new Set();
  private failedPaths: Set<string> = new Set();

  constructor() {
    this.initDefaultAssets();
  }

  /**
   * Helper to resolve relative/absolute paths consistently across Vite dev & production
   */
  public getUrl(path: string): string {
    if (!path) return BUNDLED_ASSETS.oguriCap;
    if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:') || path.startsWith('blob:')) {
      return path;
    }

    // Match exact paths or legacy path keys to fresh bundled assets from MediaGame
    if (path === '/background_utama.png' || path === 'background_utama.png' || path.includes('background_utama')) {
      return BUNDLED_ASSETS.backgroundUtama;
    }
    if (path === '/oguri_cap.png' || path === 'oguri_cap.png' || path.includes('oguri_cap') || path.includes('full_body')) {
      return BUNDLED_ASSETS.oguriCap;
    }
    if (path === '/oguri_win.png' || path === 'oguri_win.png' || path.includes('oguri_win') || path.includes('win_character')) {
      return BUNDLED_ASSETS.oguriWin;
    }
    if (path === '/1st.png' || path === '1st.png' || path.includes('1st') || path.includes('winning_logo')) {
      return BUNDLED_ASSETS.winningLogo;
    }
    if (path === '/track_race.jpg' || path === 'track_race.jpg' || path.includes('track_race')) {
      return BUNDLED_ASSETS.trackRace;
    }
    if (path === '/ultimate_oguri.mp4' || path === '/ultimate_cutscene.mp4' || path.includes('ultimate')) {
      return BUNDLED_ASSETS.ultimateVideo;
    }

    // If it's already a processed Vite asset path (starts with /assets/ or ./assets/ or blob), return as is
    if (path.startsWith('/assets/') || path.startsWith('./assets/')) {
      return path;
    }

    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    const metaEnv = (import.meta as any).env || {};
    const baseUrl = metaEnv.BASE_URL || '/';

    if (baseUrl === './' || baseUrl === '') {
      return `./${cleanPath}`;
    }

    const formattedBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
    return `${formattedBase}${cleanPath}`;
  }

  /**
   * Initialize standard game assets
   */
  private initDefaultAssets() {
    const list: Array<{ id: string; name: string; url: string; type: 'image' | 'video' }> = [
      { id: 'trainingBackground', name: 'Training Background', url: BUNDLED_ASSETS.backgroundUtama, type: 'image' },
      { id: 'raceTrackBackground', name: 'Race Track Arena', url: BUNDLED_ASSETS.trackRace, type: 'image' },
      { id: 'homeHubBackground', name: 'Home Hub BG', url: BUNDLED_ASSETS.backgroundUtama, type: 'image' },
      { id: 'characterFullBody', name: 'Oguri Cap Full Body', url: BUNDLED_ASSETS.oguriCap, type: 'image' },
      { id: 'winImage', name: 'Oguri Victory Pose', url: BUNDLED_ASSETS.oguriWin, type: 'image' },
      { id: 'winningLogo', name: '1st Place WIN Logo', url: BUNDLED_ASSETS.winningLogo, type: 'image' },
      { id: 'ultimateVideo', name: 'Ultimate Cutscene Video', url: BUNDLED_ASSETS.ultimateVideo, type: 'video' },
      { id: 'asahiFullBody', name: 'Asahi Full Body', url: BUNDLED_ASSETS.oguriCap, type: 'image' },
      { id: 'asahiWin', name: 'Asahi Victory Pose', url: BUNDLED_ASSETS.oguriWin, type: 'image' },
    ];

    list.forEach((item) => {
      this.assets[item.id] = {
        id: item.id,
        name: item.name,
        path: item.url,
        resolvedUrl: item.url,
        type: item.type,
        status: 'loaded',
      };
    });
  }

  public subscribe(listener: AssetListener): () => void {
    this.listeners.add(listener);
    listener(this.assets);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach((listener) => listener({ ...this.assets }));
  }

  public getAsset(id: string): string {
    if (id === 'trainingBackground' || id === 'homeHubBackground') return BUNDLED_ASSETS.backgroundUtama;
    if (id === 'raceTrackBackground') return BUNDLED_ASSETS.trackRace;
    if (id === 'characterFullBody' || id === 'asahiFullBody') return BUNDLED_ASSETS.oguriCap;
    if (id === 'winImage' || id === 'asahiWin') return BUNDLED_ASSETS.oguriWin;
    if (id === 'winningLogo') return BUNDLED_ASSETS.winningLogo;
    if (id === 'ultimateVideo') return BUNDLED_ASSETS.ultimateVideo;
    const item = this.assets[id];
    return item ? item.resolvedUrl : BUNDLED_ASSETS.oguriCap;
  }

  public getAllAssets(): Record<string, AssetInfo> {
    return { ...this.assets };
  }

  public async preloadImage(url: string): Promise<boolean> {
    if (!url) return false;
    return new Promise((resolve) => {
      const img = new Image();
      img.src = this.getUrl(url);
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
    });
  }

  /**
   * Diagnostic test: fetch asset header & status
   */
  public async diagnoseAllAssets() {
    for (const id of Object.keys(this.assets)) {
      const asset = this.assets[id];
      asset.status = 'loading';
      this.notify();

      try {
        const response = await fetch(asset.resolvedUrl, { method: 'GET' });
        asset.httpStatus = response.status;
        asset.contentType = response.headers.get('content-type') || 'unknown';

        const contentLength = response.headers.get('content-length');
        if (contentLength) {
          const bytes = parseInt(contentLength, 10);
          asset.fileSize = `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
        } else {
          asset.fileSize = 'Unknown';
        }

        if (!response.ok) {
          asset.status = 'failed';
          asset.errorMessage = `HTTP ${response.status} ${response.statusText} - Asset not found`;
          this.failedPaths.add(asset.path);
        } else if (asset.contentType.includes('text/html')) {
          asset.status = 'failed';
          asset.errorMessage = `MIME Mismatch: Returned text/html (SPA fallback)`;
          this.failedPaths.add(asset.path);
        } else {
          asset.status = 'loaded';
          asset.errorMessage = undefined;
        }
      } catch (err: any) {
        asset.status = 'failed';
        asset.httpStatus = 0;
        asset.errorMessage = `Network Error: ${err.message || 'Failed to fetch asset'}`;
        this.failedPaths.add(asset.path);
      }

      this.notify();
    }
  }

  /**
   * Universal error handler for <img> tags
   */
  public handleImgError(e: React.SyntheticEvent<HTMLImageElement, Event>, fallbackKey: string = 'characterFullBody') {
    const target = e.currentTarget;
    let fallbackUrl = BUNDLED_ASSETS.oguriCap;
    if (fallbackKey === 'trainingBackground' || fallbackKey === 'raceTrackBackground') {
      fallbackUrl = BUNDLED_ASSETS.backgroundUtama;
    } else if (fallbackKey === 'winningLogo') {
      fallbackUrl = BUNDLED_ASSETS.winningLogo;
    } else if (fallbackKey === 'winImage') {
      fallbackUrl = BUNDLED_ASSETS.oguriWin;
    }

    if (target.src !== fallbackUrl) {
      target.src = fallbackUrl;
    }
  }

  /**
   * Universal error handler for <video> tags
   */
  public handleVideoError(e: React.SyntheticEvent<HTMLVideoElement, Event>, fallbackKey: string = 'ultimateVideo') {
    const target = e.currentTarget;
    const fallbackUrl = BUNDLED_ASSETS.ultimateVideo;
    if (target.src !== fallbackUrl) {
      target.src = fallbackUrl;
      target.load();
    }
  }
}

export const AssetManager = new AssetManagerClass();
