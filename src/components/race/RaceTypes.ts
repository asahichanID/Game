export type RaceDistance = 1400 | 2000 | 3400;

export interface RaceOption {
  id: string;
  name: string;
  distance: RaceDistance;
  category: string;
  description: string;
  badgeBg: string;
}

export type RunningStyle = 'Front' | 'Pace' | 'Late' | 'End';

export interface StyleOption {
  id: RunningStyle;
  label: string;
  description: string;
}

export interface Racer {
  id: string;
  name: string;
  avatar: string;
  isPlayer: boolean;
  color: string;
  baseSpeed: number; // km/h
  currentSpeed: number; // km/h
  progress: number; // 0.0 to 1.0 (lap progress)
  distanceRemaining: number; // meters
  placement: number; // 1 to 5
  hasUltimateActive: boolean;
  style: RunningStyle;
}

export type RacePhase = 'prep' | 'countdown' | 'running' | 'ultimate_cutscene' | 'victory';
