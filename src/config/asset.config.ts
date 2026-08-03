import { BUNDLED_ASSETS } from '../assets';

export const ASSET_CONFIG = {
  repositoryUrl: 'https://raw.githubusercontent.com/asahichanID/MediaGame/main/',
  defaultCharacterId: 'ch_asahi_01',
  
  // Dynamic path resolvers for characters with bundled asset fallback
  getCharacterPaths: (characterFolder: string) => {
    return {
      fullBody: BUNDLED_ASSETS.oguriCap,
      winImage: BUNDLED_ASSETS.oguriWin,
      ultimateVideo: BUNDLED_ASSETS.ultimateVideo,
      icon: BUNDLED_ASSETS.oguriCap,
      voiceGreeting: '',
      voiceUltimate: '',
    };
  },

  // Common bundled assets from MediaGame repo
  common: {
    winningLogo: BUNDLED_ASSETS.winningLogo,
    trainingBackground: BUNDLED_ASSETS.backgroundUtama,
    raceTrackBackground: BUNDLED_ASSETS.trackRace,
    homeHubBackground: BUNDLED_ASSETS.backgroundUtama,
    carrotCoinIcon: BUNDLED_ASSETS.winningLogo,
    badgeFrame: BUNDLED_ASSETS.winningLogo,
  },

  // Fallback high quality bundled assets
  fallbacks: {
    characterFullBody: BUNDLED_ASSETS.oguriCap,
    winImage: BUNDLED_ASSETS.oguriWin,
    winningLogo: BUNDLED_ASSETS.winningLogo,
    trainingBackground: BUNDLED_ASSETS.backgroundUtama,
    ultimateVideo: BUNDLED_ASSETS.ultimateVideo,
  }
};
