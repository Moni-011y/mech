import { create } from 'zustand';
import * as THREE from 'three';

export type ViewerState = {
  orthographic: boolean;
  wireframe: boolean;
  xray: boolean;
  section: boolean;
  exploded: boolean;
  dimensions: boolean;
  labels: boolean;
  axes: boolean;
  grid: boolean;
  playing: boolean;
  // actions
  toggleOrthographic: () => void;
  toggleWireframe: () => void;
  toggleXray: () => void;
  toggleSection: () => void;
  toggleExploded: () => void;
  toggleDimensions: () => void;
  toggleLabels: () => void;
  toggleAxes: () => void;
  toggleGrid: () => void;
  togglePlaying: () => void;
  resetCamera: (camera: THREE.Camera, controls: any) => void;
};

export const useViewerStore = create<ViewerState>((set) => ({
  orthographic: false,
  wireframe: false,
  xray: false,
  section: false,
  exploded: false,
  dimensions: false,
  labels: false,
  axes: false,
  grid: true,
  playing: true,
  toggleOrthographic: () => set((s) => ({ orthographic: !s.orthographic })),
  toggleWireframe: () => set((s) => ({ wireframe: !s.wireframe })),
  toggleXray: () => set((s) => ({ xray: !s.xray })),
  toggleSection: () => set((s) => ({ section: !s.section })),
  toggleExploded: () => set((s) => ({ exploded: !s.exploded })),
  toggleDimensions: () => set((s) => ({ dimensions: !s.dimensions })),
  toggleLabels: () => set((s) => ({ labels: !s.labels })),
  toggleAxes: () => set((s) => ({ axes: !s.axes })),
  toggleGrid: () => set((s) => ({ grid: !s.grid })),
  togglePlaying: () => set((s) => ({ playing: !s.playing })),
  resetCamera: (camera, controls) => {
    camera.position.set(0, 15, 35);
    camera.lookAt(0, 0, 0);
    if (controls) {
      controls.target.set(0, 0, 0);
      controls.update();
    }
  },
}));
