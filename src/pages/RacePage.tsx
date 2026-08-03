import React, { useState } from 'react';
import { RoutePath } from '../router/routes';
import { useCharacter } from '../game/hooks/useCharacter';
import { useAudio } from '../game/hooks/useAudio';
import { useEndpoint } from '../game/hooks/useEndpoint';
import { RaceOption, RunningStyle, RacePhase } from '../components/race/RaceTypes';
import { RacePrepModal } from '../components/race/RacePrepModal';
import { RaceCountdown } from '../components/race/RaceCountdown';
import { RaceTrackCanvas } from '../components/race/RaceTrackCanvas';
import { RaceVictoryOverlay } from '../components/race/RaceVictoryOverlay';

interface RacePageProps {
  onNavigate?: (route: RoutePath) => void;
}

export const RacePage: React.FC<RacePageProps> = ({ onNavigate }) => {
  const { selectedCharacter } = useCharacter();
  const { playSFX, playVoice } = useAudio();
  const { syncCarrotCoins } = useEndpoint();

  // Race System Flow Phase
  const [racePhase, setRacePhase] = useState<RacePhase>('prep');
  const [selectedRace, setSelectedRace] = useState<RaceOption | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<RunningStyle>('Pace');
  const [playerRank, setPlayerRank] = useState<number>(1);

  // 1. User selects Race & Running Style in Paddock Prep
  const handleStartRacePrep = (race: RaceOption, style: RunningStyle) => {
    setSelectedRace(race);
    setSelectedStyle(style);
    playSFX('whoosh');
    playVoice(selectedCharacter.voice.raceStart);
    setRacePhase('countdown');
  };

  // 2. Countdown completes -> Start Track Racing
  const handleFinishCountdown = () => {
    setRacePhase('running');
  };

  // 3. Race finished on track -> Victory Transition
  const handleRaceFinishedOnTrack = (rank: number) => {
    setPlayerRank(rank);
    playSFX('reward');
    playVoice(selectedCharacter.voice.victory);
    syncCarrotCoins(500, 'Race Victory Award');
    setRacePhase('victory');
  };

  // 4. Victory screen completed -> Return to Home
  const handleVictoryComplete = () => {
    if (onNavigate) {
      onNavigate('home');
    } else {
      setRacePhase('prep');
    }
  };

  return (
    <div className="w-full h-full min-h-screen bg-slate-950 relative overflow-hidden font-sans">
      {/* 1. PREPARATION PHASE (PADDOCK SELECTION) */}
      {racePhase === 'prep' && (
        <RacePrepModal
          onStartRace={handleStartRacePrep}
          onBackToHome={() => onNavigate && onNavigate('home')}
        />
      )}

      {/* 2. COUNTDOWN OVERLAY */}
      {racePhase === 'countdown' && (
        <RaceCountdown onFinishCountdown={handleFinishCountdown} />
      )}

      {/* 3. RUNNING RACE TRACK CANVAS */}
      {racePhase === 'running' && selectedRace && (
        <RaceTrackCanvas
          race={selectedRace}
          style={selectedStyle}
          playerCharacter={{
            name: selectedCharacter.name,
            icon: selectedCharacter.icon,
          }}
          onRaceFinish={handleRaceFinishedOnTrack}
        />
      )}

      {/* 4. VICTORY OVERLAY SCREEN */}
      {racePhase === 'victory' && (
        <RaceVictoryOverlay
          playerRank={playerRank}
          onFinish={handleVictoryComplete}
        />
      )}
    </div>
  );
};
