import { useCallback } from "react";
import { useAppStore } from "../store/useAppStore";
import { sfxBossWin, sfxCorrect, sfxLevelUp, sfxTap, sfxWrong } from "../lib/sound";

export function useSound() {
  const soundEnabled = useAppStore((s) => s.soundEnabled);

  const play = useCallback(
    (fn) => {
      if (!soundEnabled) return;
      try {
        fn();
      } catch {
        /* ignore */
      }
    },
    [soundEnabled]
  );

  return {
    correct: () => play(sfxCorrect),
    wrong: () => play(sfxWrong),
    levelUp: () => play(sfxLevelUp),
    bossWin: () => play(sfxBossWin),
    tap: () => play(sfxTap),
  };
}
