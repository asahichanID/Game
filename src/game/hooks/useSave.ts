import { useEffect, useState } from 'react';
import { SaveManager } from '../../core/SaveManager';
import { SaveData, UserProfile } from '../../types/game';

export function useSave() {
  const [save, setSave] = useState<SaveData>(SaveManager.getSave());

  useEffect(() => {
    const unsubscribe = SaveManager.subscribe((data) => {
      setSave(data);
    });
    return unsubscribe;
  }, []);

  return {
    save,
    player: save.player,
    characters: save.characters,
    progress: save.progress,
    inventory: save.inventory,
    achievements: save.achievements,
    badges: save.badges,
    updatePlayer: (partial: Partial<UserProfile>) => SaveManager.updatePlayer(partial),
    updateCarrotCoins: (delta: number) => SaveManager.updateCarrotCoins(delta),
    resetSave: () => SaveManager.resetToDefault(),
    exportSave: () => SaveManager.exportSaveJson(),
    importSave: (json: string) => SaveManager.importSaveJson(json),
  };
}
