import type { ReactNode } from 'react';

export type ToastType = 'info' | 'success' | 'warning' | 'error';

export interface ToastNotification {
  id: string;
  type: ToastType;
  title: string;
  message: string;
  durationMs?: number;
}

export interface DialogOptions {
  id: string;
  title: string;
  content: string | ReactNode;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  type?: 'default' | 'danger' | 'reward';
}

export interface ResourceItem {
  id: string;
  url: string;
  type: 'image' | 'video' | 'audio' | 'font' | 'effect';
  sizeBytes?: number;
  status: 'pending' | 'loading' | 'loaded' | 'error';
  fallbackUrl?: string;
}

export interface PreloadProgress {
  total: number;
  loaded: number;
  failed: number;
  percentage: number;
  currentlyLoading?: string;
}

export interface VideoPlaybackOptions {
  src: string;
  title?: string;
  autoplay?: boolean;
  loop?: boolean;
  muted?: boolean;
  fullscreenOverlay?: boolean;
  onEnded?: () => void;
}

export interface AudioChannelState {
  bgmVolume: number;
  voiceVolume: number;
  sfxVolume: number;
  movieVolume: number;
  isMuted: boolean;
  currentBgmTrack?: string;
}
