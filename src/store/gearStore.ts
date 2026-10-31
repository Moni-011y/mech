// src/store/gearStore.ts
import { create } from 'zustand';

type GearParams = {
  teeth: number; // Z
  module: number; // m (mm)
  pressureAngle: number; // degrees
  bore: number; // diameter of hole (mm)
  faceWidth: number; // mm
  // computed values (derived, not stored)
};

type GearStore = GearParams & {
  setTeeth: (z: number) => void;
  setModule: (m: number) => void;
  setPressureAngle: (a: number) => void;
  setBore: (b: number) => void;
  setFaceWidth: (fw: number) => void;
};

export const useGearStore = create<GearStore>((set) => ({
  teeth: 30,
  module: 2,
  pressureAngle: 20,
  bore: 10,
  faceWidth: 20,
  setTeeth: (z) => set({ teeth: z }),
  setModule: (m) => set({ module: m }),
  setPressureAngle: (a) => set({ pressureAngle: a }),
  setBore: (b) => set({ bore: b }),
  setFaceWidth: (fw) => set({ faceWidth: fw }),
}));
