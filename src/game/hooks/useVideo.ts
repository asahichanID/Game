import { useEffect, useState } from 'react';
import { VideoManager } from '../../core/VideoManager';
import { VideoPlaybackOptions } from '../../types/manager';

export function useVideo() {
  const [activeVideo, setActiveVideo] = useState<VideoPlaybackOptions | null>(VideoManager.getActiveVideo());

  useEffect(() => {
    const unsub = VideoManager.subscribe((video) => {
      setActiveVideo(video);
    });
    return unsub;
  }, []);

  return {
    activeVideo,
    playVideo: (opts: VideoPlaybackOptions) => VideoManager.playVideo(opts),
    stopVideo: () => VideoManager.stopVideo(),
    preloadVideo: (url: string) => VideoManager.preloadVideo(url),
  };
}
