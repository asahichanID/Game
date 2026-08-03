import { useState } from 'react';
import { getAllCharacters, getCharacterById } from '../characters/character.data';
import { CharacterConfig } from '../../types/game';
import { SaveManager } from '../../core/SaveManager';

export function useCharacter() {
  const saveData = SaveManager.getSave();
  const [selectedId, setSelectedId] = useState<string>(saveData.characters.selectedId || 'ch_asahi_01');

  const selectedCharacter: CharacterConfig = getCharacterById(selectedId);
  const allCharacters: CharacterConfig[] = getAllCharacters();

  const selectCharacter = (id: string) => {
    setSelectedId(id);
    const chars = SaveManager.getSave().characters;
    SaveManager.updateSection('characters', {
      ...chars,
      selectedId: id,
    });
  };

  return {
    selectedCharacter,
    allCharacters,
    selectedId,
    selectCharacter,
  };
}
