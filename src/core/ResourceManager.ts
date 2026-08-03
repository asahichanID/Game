import { ASSET_CONFIG } from '../config/asset.config';
import { AssetManager } from './AssetManager';
import { VideoManager } from './VideoManager';
import { PreloadProgress, ResourceItem } from '../types/manager';

type ResourceListener = (progress: PreloadProgress) => void;

class ResourceManagerClass {
  private resources: Map<string, ResourceItem> = new Map();
  private listeners: Set<ResourceListener> = new Set();

  public subscribe(listener: ResourceListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify(currentUrl?: string): void {
    const progress = this.getProgress();
    if (currentUrl) progress.currentlyLoading = currentUrl;
    this.listeners.forEach((l) => l(progress));
  }

  public registerResource(item: Omit<ResourceItem, 'status'>): void {
    if (!this.resources.has(item.id)) {
      this.resources.set(item.id, { ...item, status: 'pending' });
    }
  }

  public getProgress(): PreloadProgress {
    const all = Array.from(this.resources.values());
    const total = all.length;
    if (total === 0) return { total: 0, loaded: 0, failed: 0, percentage: 100 };

    const loaded = all.filter((r) => r.status === 'loaded').length;
    const failed = all.filter((r) => r.status === 'error').length;
    const percentage = Math.round(((loaded + failed) / total) * 100);

    return { total, loaded, failed, percentage };
  }

  /**
   * Preload critical game assets (Images, Videos, Audio, Fonts, Effects)
   */
  public async preloadCriticalBatch(onUpdate?: (progress: PreloadProgress) => void): Promise<boolean> {
    // Default initial critical set
    const batch: Omit<ResourceItem, 'status'>[] = [
      { id: 'oguri_fullbody', url: '/oguri_cap.png', type: 'image' },
      { id: 'oguri_win', url: '/oguri_win.png', type: 'image' },
      { id: 'winning_logo', url: '/1st.png', type: 'image' },
      { id: 'bg_training', url: '/background_utama.png', type: 'image' },
      { id: 'ultimate_cutscene', url: '/ultimate_cutscene.mp4', type: 'video' },
    ];

    batch.forEach((b) => this.registerResource(b));

    for (const item of batch) {
      const resource = this.resources.get(item.id);
      if (!resource) continue;

      resource.status = 'loading';
      this.notify(resource.url);

      if (resource.type === 'image') {
        const ok = await AssetManager.preloadImage(resource.url);
        resource.status = ok ? 'loaded' : 'error';
      } else if (resource.type === 'video') {
        const ok = await VideoManager.preloadVideo(resource.url);
        resource.status = ok ? 'loaded' : 'error';
      } else {
        // Audio / Font / Effect mock preload
        await new Promise((r) => setTimeout(r, 100));
        resource.status = 'loaded';
      }

      const p = this.getProgress();
      if (onUpdate) onUpdate(p);
      this.notify(resource.url);
    }

    return true;
  }
}

export const ResourceManager = new ResourceManagerClass();
