import { BUNDLED_ASSETS } from '../../assets';
import { CharacterConfig } from '../../types/game';

// Oguri Cap - MediaGame Primary Character
export const CHARACTER_OGURI_CAP: CharacterConfig = {
  id: 'ch_oguri_01',
  name: 'Oguri Cap',
  title: 'Monster of Kasamatsu',
  rarity: 'SSR',
  icon: BUNDLED_ASSETS.oguriCap,
  fullBody: BUNDLED_ASSETS.oguriCap,
  winImage: BUNDLED_ASSETS.oguriWin,
  ultimateVideo: BUNDLED_ASSETS.ultimateVideo,
  trainingBackground: BUNDLED_ASSETS.backgroundUtama,
  status: {
    speed: 125,
    stamina: 120,
    power: 115,
    guts: 110,
    wit: 105,
  },
  growth: {
    speedGrowth: 20,
    staminaGrowth: 15,
    powerGrowth: 15,
    gutsGrowth: 10,
    witGrowth: 10,
  },
  voice: {
    titleCall: 'MediaGame! Selamat datang, Trainer!',
    greeting: 'Halo Trainer! Mari kita berlari sekuat tenaga hari ini!',
    trainingStart: 'Latihan intensif dimulai! Aku siap!',
    trainingSuccess: 'Luar biasa! Staminaku bertambah!',
    raceStart: 'Aku tidak akan menyerah sampai garis finish!',
    victory: 'Kemenangan ini berkat bimbinganmu, Trainer!',
    ultimate: 'Langkah Ajaib: Gray Phantom Sprint!!',
  },
  animation: {
    idle: 'idle_bounce',
    cheer: 'cheer_jump',
    win: 'victory_pose',
    run: 'sprint_cycle',
  },
  bio: 'Legenda pelari berjuluk Monster of Kasamatsu. Memiliki nafsu makan dan semangat juang tanpa batas!',
  favoriteFood: 'Mangkuk Nasi Raksasa & Wortel Spesial',
};

// Beta Character Definition - Asahi-chan
export const BETA_CHARACTER_ASAHI: CharacterConfig = {
  id: 'ch_asahi_01',
  name: 'Asahi-chan',
  title: 'Radiant Dawn Star',
  rarity: 'SSR',
  icon: BUNDLED_ASSETS.oguriCap,
  fullBody: BUNDLED_ASSETS.oguriCap,
  winImage: BUNDLED_ASSETS.oguriWin,
  ultimateVideo: BUNDLED_ASSETS.ultimateVideo,
  trainingBackground: BUNDLED_ASSETS.backgroundUtama,
  status: {
    speed: 120,
    stamina: 105,
    power: 110,
    guts: 95,
    wit: 100,
  },
  growth: {
    speedGrowth: 20,
    staminaGrowth: 10,
    powerGrowth: 15,
    gutsGrowth: 5,
    witGrowth: 10,
  },
  voice: {
    titleCall: 'game.shironna.my.id! Selamat datang, Trainer!',
    greeting: 'Halo Trainer! Hari ini kita latihan lari di mana?',
    trainingStart: 'Semangat! Latihan hari ini akan luar biasa!',
    trainingSuccess: 'Yatta! Statusku meningkat pesat!',
    raceStart: 'Garis finish sudah di depan mata! Ayo berkibar!',
    victory: 'Kemenangan ini untukmu, Trainer!',
    ultimate: 'Langkah Impian: Ultimate Sunrise Dash!!',
  },
  animation: {
    idle: 'idle_bounce',
    cheer: 'cheer_jump',
    win: 'victory_pose',
    run: 'sprint_cycle',
  },
  bio: 'Gadis pelari penuh energi dengan mimpi menjadi pelari tercepat di dunia. Selalu membawa semangat pagi menyinari lintasan!',
  favoriteFood: 'Wortel Manis & Carrot Shake',
};

// Character Registry - Add new characters here without changing core logic
export const CHARACTER_REGISTRY: Record<string, CharacterConfig> = {
  [CHARACTER_OGURI_CAP.id]: CHARACTER_OGURI_CAP,
  [BETA_CHARACTER_ASAHI.id]: BETA_CHARACTER_ASAHI,
};

export const getAllCharacters = (): CharacterConfig[] => {
  return Object.values(CHARACTER_REGISTRY);
};

export const getCharacterById = (id: string): CharacterConfig => {
  return CHARACTER_REGISTRY[id] || CHARACTER_OGURI_CAP;
};
