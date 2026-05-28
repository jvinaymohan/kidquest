import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export const usePreferencesStore = create(
  persist(
    (set) => ({
      locale: "en",
      dyslexiaFont: false,
      lowBandwidth: false,
      screenTimeLimitMinutes: null,
      parentConsentAt: null,
      teslaMode: false,

      setLocale: (locale) => set({ locale }),
      setDyslexiaFont: (v) => set({ dyslexiaFont: v }),
      setLowBandwidth: (v) => set({ lowBandwidth: v }),
      setScreenTimeLimit: (minutes) => set({ screenTimeLimitMinutes: minutes }),
      setParentConsent: () => set({ parentConsentAt: new Date().toISOString() }),
      setTeslaMode: (v) => set({ teslaMode: v }),
    }),
    { name: "kidquest-preferences-v1", storage: createJSONStorage(() => localStorage) }
  )
);
