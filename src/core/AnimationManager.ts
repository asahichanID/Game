import type { MouseEvent } from 'react';
import { ANIMATION_CONFIG } from '../config/animation.config';

export type AnimationType = 'fade' | 'slideUp' | 'scalePop' | 'glowPulse' | 'ripple';

class AnimationManagerClass {
  public getPreset(type: AnimationType) {
    return ANIMATION_CONFIG.presets[type as keyof typeof ANIMATION_CONFIG.presets] || ANIMATION_CONFIG.presets.fade;
  }

  public getDuration(speed: keyof typeof ANIMATION_CONFIG.durations = 'normal'): number {
    return ANIMATION_CONFIG.durations[speed] || ANIMATION_CONFIG.durations.normal;
  }

  public getSpringConfig() {
    return ANIMATION_CONFIG.easing.spring;
  }

  /**
   * Helper to create click ripple coordinates
   */
  public createRippleEvent(event: MouseEvent<HTMLElement>): { x: number; y: number } {
    const rect = event.currentTarget.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  }
}

export const AnimationManager = new AnimationManagerClass();

