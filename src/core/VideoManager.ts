import { VIDEO_CONFIG } from '../config/video.config';
import { VideoPlaybackOptions } from '../types/manager';

type VideoListener = (options: VideoPlaybackOptions | null) => void;

class VideoManagerClass {
  private activeVideo: VideoPlaybackOptions | null = null;
  private listeners: Set<VideoListener> = new Set();
  private videoCache: Map<string, HTMLVideoElement> = new Map();

  public subscribe(listener: VideoListener): () => void {
    this.listeners.add(listener);
    listener(this.activeVideo);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify(): void {
    this.listeners.forEach((l) => l(this.activeVideo));
  }

  /**
   * Preload MP4 video for cutscenes
   */
  public async preloadVideo(url: string): Promise<boolean> {
    if (!url) return false;
    if (this.videoCache.has(url)) return true;

    return new Promise((resolve) => {
      const video = document.createElement('video');
      video.src = url;
      video.preload = 'auto';

      const onCanPlay = () => {
        if (this.videoCache.size >= VIDEO_CONFIG.maxCachedVideos) {
          const oldestKey = this.videoCache.keys().next().value;
          if (oldestKey) this.videoCache.delete(oldestKey);
        }
        this.videoCache.set(url, video);
        cleanup();
        resolve(true);
      };

      const onError = () => {
        cleanup();
        resolve(false);
      };

      const cleanup = () => {
        video.removeEventListener('canplaythrough', onCanPlay);
        video.removeEventListener('error', onError);
      };

      video.addEventListener('canplaythrough', onCanPlay);
      video.addEventListener('error', onError);

      // Force load trigger
      video.load();
    });
  }

  /**
   * Trigger cutscene or ultimate video modal overlay
   */
  public playVideo(options: VideoPlaybackOptions): void {
    this.activeVideo = {
      autoplay: true,
      fullscreenOverlay: true,
      ...options,
    };
    this.notify();
  }

  /**
   * Stop video and cleanup resources
   */
  public stopVideo(): void {
    if (this.activeVideo && this.activeVideo.onEnded) {
      this.activeVideo.onEnded();
    }
    this.activeVideo = null;
    this.notify();
  }

  public getActiveVideo(): VideoPlaybackOptions | null {
    return this.activeVideo;
  }
}

export const VideoManager = new VideoManagerClass();
