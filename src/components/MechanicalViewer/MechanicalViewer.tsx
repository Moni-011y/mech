import React, { useRef } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrthographicCamera, PerspectiveCamera, OrbitControls, Html, Grid } from '@react-three/drei';
import * as THREE from 'three';
import { useViewerStore } from '../../store/viewerStore';

function Toolbar() {
  const {
    orthographic,
    wireframe,
    xray,
    section,
    exploded,
    dimensions,
    labels,
    axes,
    playing,
    toggleOrthographic,
    toggleWireframe,
    toggleXray,
    toggleSection,
    toggleExploded,
    toggleDimensions,
    toggleLabels,
    toggleAxes,
    togglePlaying,
    resetCamera,
  } = useViewerStore();

  const { camera } = useThree();
  const controlsRef = useRef<any>(null);

  const handleReset = () => {
    if (camera) {
      resetCamera(camera, controlsRef.current);
    }
  };

  const activeBtn = "px-2.5 py-1 text-[11px] font-bold text-background bg-accent rounded shadow transition";
  const inactiveBtn = "px-2.5 py-1 text-[11px] font-medium text-text-primary bg-surface hover:bg-surface-elevated border border-border rounded transition";

  return (
    <Html position={[0, 0, 0]} style={{ inset: 'auto', pointerEvents: 'none' }} className="pointer-events-auto">
      <div className="absolute top-3 left-3 z-20 flex flex-wrap gap-1.5 bg-surface-elevated/90 backdrop-blur-md p-1.5 rounded-lg border border-border shadow-2xl max-w-[90vw]">
        <button className={inactiveBtn} onClick={handleReset}>RESET</button>
        <button className={orthographic ? activeBtn : inactiveBtn} onClick={toggleOrthographic}>
          {orthographic ? 'ORTHO' : 'PERSP'}
        </button>
        <button className={wireframe ? activeBtn : inactiveBtn} onClick={toggleWireframe}>WIREFRAME</button>
        <button className={xray ? activeBtn : inactiveBtn} onClick={toggleXray}>X-RAY</button>
        <button className={section ? activeBtn : inactiveBtn} onClick={toggleSection}>SECTION</button>
        <button className={exploded ? activeBtn : inactiveBtn} onClick={toggleExploded}>EXPLODE</button>
        <button className={dimensions ? activeBtn : inactiveBtn} onClick={toggleDimensions}>DIMENSIONS</button>
        <button className={labels ? activeBtn : inactiveBtn} onClick={toggleLabels}>LABELS</button>
        <button className={axes ? activeBtn : inactiveBtn} onClick={toggleAxes}>AXES</button>
        <button className={playing ? activeBtn : inactiveBtn} onClick={togglePlaying}>
          {playing ? 'PAUSE' : 'PLAY'}
        </button>
      </div>
    </Html>
  );
}

function AxesDisplay() {
  const axes = useViewerStore((s) => s.axes);
  const axesHelper = useRef(new THREE.AxesHelper(15));
  if (!axes) return null;
  return <primitive object={axesHelper.current} />;
}

export default function MechanicalViewer({ children }: { children: React.ReactNode }) {
  const orthographic = useViewerStore((s) => s.orthographic);
  const grid = useViewerStore((s) => s.grid);

  const camProps = orthographic
    ? { left: -30, right: 30, top: 30, bottom: -30, near: 0.1, far: 1000, position: [0, 0, 50] as [number, number, number] }
    : { fov: 45, near: 0.1, far: 1000, position: [0, 20, 40] as [number, number, number] };

  return (
    <div className="relative w-full h-full min-h-[450px] bg-background rounded-xl overflow-hidden border border-border">
      <Canvas shadows dpr={[1, 2]}>
        {orthographic ? (
          <OrthographicCamera makeDefault {...camProps} />
        ) : (
          <PerspectiveCamera makeDefault {...camProps} />
        )}
        <ambientLight intensity={0.9} />
        <directionalLight position={[10, 20, 15]} intensity={1.5} castShadow />
        <directionalLight position={[-10, -10, -10]} intensity={0.5} />
        <OrbitControls enableDamping={true} dampingFactor={0.05} />

        {grid && (
          <Grid
            position={[0, -15, 0]}
            args={[100, 100]}
            cellSize={2}
            cellThickness={1}
            cellColor="#30363D"
            sectionSize={10}
            sectionThickness={1.5}
            sectionColor="#16B8A6"
            fadeDistance={80}
          />
        )}

        <AxesDisplay />
        <Toolbar />
        {children}
      </Canvas>
    </div>
  );
}
