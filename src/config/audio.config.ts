export const AUDIO_CONFIG = {
  defaultVolumes: {
    bgm: 0.7,
    voice: 0.9,
    sfx: 0.8,
    movie: 1.0,
  },
  channels: ['bgm', 'voice', 'sfx', 'movie'] as const,
  tracks: {
    mainTheme: 'https://raw.githubusercontent.com/asahichanID/MediaGame/main/audio/bgm_main_theme.mp3',
    trainingTheme: 'https://raw.githubusercontent.com/asahichanID/MediaGame/main/audio/bgm_training.mp3',
    raceTheme: 'https://raw.githubusercontent.com/asahichanID/MediaGame/main/audio/bgm_race.mp3',
    victoryTheme: 'https://raw.githubusercontent.com/asahichanID/MediaGame/main/audio/bgm_victory.mp3',
  },
  sfx: {
    buttonClick: 'click',
    levelUp: 'levelup',
    reward: 'reward',
    error: 'error',
    whoosh: 'whoosh',
  }
};
