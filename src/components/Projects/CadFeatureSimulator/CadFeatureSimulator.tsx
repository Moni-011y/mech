import { useState, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, OrthographicCamera, Grid } from '@react-three/drei';
import * as THREE from 'three';
import { CAD_FEATURES_DATA } from './cadFeatureData';
import CadExtrudeMesh from './CadExtrudeMesh';
import CadRevolveMesh from './CadRevolveMesh';
import CadSweepMesh from './CadSweepMesh';
import CadLoftMesh from './CadLoftMesh';
import CadPatternMesh from './CadPatternMesh';
import ErrorBoundary from '../../ErrorBoundary';

export default function CadFeatureSimulator() {
  const [selectedFeature, setSelectedFeature] = useState<'EXTRUDE' | 'REVOLVE' | 'SWEEP' | 'LOFT' | 'PATTERN'>('EXTRUDE');
  const [progress, setProgress] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);

  // Viewport display toggles
  const [orthographic, setOrthographic] = useState<boolean>(false);
  const [wireframe, setWireframe] = useState<boolean>(false);
  const [xray, setXray] = useState<boolean>(false);
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [showAxes, setShowAxes] = useState<boolean>(true);

  // Feature-specific parameters
  const [extrudeDepth, setExtrudeDepth] = useState<number>(45);
  const [extrudeProfile, setExtrudeProfile] = useState<'bracket' | 'boss'>('bracket');

  const [revolveAngle, setRevolveAngle] = useState<number>(360);
  const [shaftType, setShaftType] = useState<'steppedShaft' | 'flangedHub'>('steppedShaft');

  const [pipeRadius, setPipeRadius] = useState<number>(28);
  const [routeType, setRouteType] = useState<'sCurve' | 'rightAngle'>('sCurve');

  const [patternMode, setPatternMode] = useState<'circular' | 'linear'>('circular');
  const [patternCount, setPatternCount] = useState<number>(6);

  const controlsRef = useRef<any>(null);
  const cameraRef = useRef<any>(null);

  // Active feature metadata
  const currentFeatureData = CAD_FEATURES_DATA[selectedFeature];

  // Animation loop driving progress from 0 to 1 over approx 5.5 seconds per cycle
  useEffect(() => {
    let animId: number;
    let lastTime = performance.now();

    const loop = (currentTime: number) => {
      const dt = (currentTime - lastTime) / 1000;
      lastTime = currentTime;

      if (isPlaying) {
        setProgress((prev) => {
          const speedFactor = 0.16 * playbackSpeed;
          const next = prev + dt * speedFactor;
          if (next >= 1.0) {
            return 1.0; // Hold at completed stage for inspection
          }
          return next;
        });
      }
      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [isPlaying, playbackSpeed]);

  // When user switches feature, reset progress to 0 and resume playing
  const handleSelectFeature = (feat: 'EXTRUDE' | 'REVOLVE' | 'SWEEP' | 'LOFT' | 'PATTERN') => {
    setSelectedFeature(feat);
    setProgress(0);
    setIsPlaying(true);
  };

  const handleReplay = () => {
    setProgress(0);
    setIsPlaying(true);
  };

  const handleResetCamera = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  };

  // Determine active step index (0 to steps.length-1) for synchronized UI highlighting
  const stepCount = currentFeatureData?.geometrySteps?.length ?? 4;
  const activeStepIdx = Math.min(stepCount - 1, Math.floor(progress / 0.25));

  return (
    <div className="space-y-6">
      {/* 1. Feature Selection Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {(['EXTRUDE', 'REVOLVE', 'SWEEP', 'LOFT', 'PATTERN'] as const).map((featName) => {
          const isSelected = selectedFeature === featName;
          const feat = CAD_FEATURES_DATA[featName];
          return (
            <button
              key={featName}
              onClick={() => handleSelectFeature(featName)}
              className={`p-3.5 rounded-xl border text-center transition-all flex items-center justify-center gap-2 ${
                isSelected
                  ? 'bg-accent text-background border-accent font-black shadow-lg shadow-accent/25 ring-2 ring-accent'
                  : 'bg-surface-elevated text-text-primary border-border hover:border-accent/40 font-bold hover:bg-surface'
              }`}
            >
              <span className="text-base">{feat.icon}</span>
              <span className="text-xs tracking-wider uppercase font-mono">{featName}</span>
            </button>
          );
        })}
      </div>

      {/* 2. Main Simulation Layout: 3D Viewport + Information Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Interactive 3D CAD Viewport */}
        <div className="lg:col-span-8 bg-[#090D16] rounded-2xl overflow-hidden border border-border shadow-2xl flex flex-col relative">
          {/* Top HUD: Feature Banner & Viewport Quick Toggles */}
          <div className="p-3 sm:p-4 bg-surface/90 border-b border-border/80 backdrop-blur-md flex flex-wrap items-center justify-between gap-3 z-10">
            <div className="flex items-center gap-2.5">
              <span className="text-xl">{currentFeatureData.icon}</span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black uppercase text-text-primary tracking-wider">
                    {currentFeatureData.name}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-accent/15 text-accent border border-accent/30 font-bold">
                    STEP {activeStepIdx + 1}/{stepCount}: {currentFeatureData.geometrySteps[activeStepIdx]?.title ?? ''}
                  </span>
                </div>
                <div className="text-[11px] font-mono text-accent font-semibold">
                  {currentFeatureData.bannerLabel}
                </div>
              </div>
            </div>

            {/* Viewport Display Toggles */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                onClick={handleResetCamera}
                className="px-2 py-1 text-[10px] font-mono font-bold rounded bg-surface-elevated hover:bg-surface border border-border text-text-secondary hover:text-text-primary transition"
                title="Reset Camera View"
              >
                RESET CAM
              </button>
              <button
                onClick={() => setOrthographic(!orthographic)}
                className={`px-2 py-1 text-[10px] font-mono font-bold rounded border transition ${
                  orthographic
                    ? 'bg-accent text-background border-accent'
                    : 'bg-surface-elevated border-border text-text-secondary hover:text-text-primary'
                }`}
                title="Toggle Orthographic / Perspective Projection"
              >
                {orthographic ? 'ORTHO' : 'PERSP'}
              </button>
              <button
                onClick={() => setWireframe(!wireframe)}
                className={`px-2 py-1 text-[10px] font-mono font-bold rounded border transition ${
                  wireframe
                    ? 'bg-accent text-background border-accent'
                    : 'bg-surface-elevated border-border text-text-secondary hover:text-text-primary'
                }`}
                title="Toggle Wireframe CAD Mode"
              >
                WIREFRAME
              </button>
              <button
                onClick={() => setXray(!xray)}
                className={`px-2 py-1 text-[10px] font-mono font-bold rounded border transition ${
                  xray
                    ? 'bg-accent text-background border-accent'
                    : 'bg-surface-elevated border-border text-text-secondary hover:text-text-primary'
                }`}
                title="Toggle X-Ray / Transparent Inspection"
              >
                X-RAY
              </button>
              <button
                onClick={() => setShowGrid(!showGrid)}
                className={`px-2 py-1 text-[10px] font-mono font-bold rounded border transition ${
                  showGrid
                    ? 'bg-accent/20 text-accent border-accent/40'
                    : 'bg-surface-elevated border-border text-text-secondary'
                }`}
                title="Toggle Workplane Grid"
              >
                GRID
              </button>
              <button
                onClick={() => setShowAxes(!showAxes)}
                className={`px-2 py-1 text-[10px] font-mono font-bold rounded border transition ${
                  showAxes
                    ? 'bg-accent/20 text-accent border-accent/40'
                    : 'bg-surface-elevated border-border text-text-secondary'
                }`}
                title="Toggle XYZ Axes"
              >
                AXES
              </button>
            </div>
          </div>

          {/* 3D Canvas Viewport */}
          <div className="relative w-full h-[460px] bg-gradient-to-b from-[#090D16] via-[#0D1424] to-[#080B12]">
            <ErrorBoundary fallbackTitle="WebGL 3D Canvas Simulation Error">
            <Canvas shadows dpr={[1, 2]}>
              {orthographic ? (
                <OrthographicCamera
                  ref={cameraRef}
                  makeDefault
                  position={[12, 14, 18]}
                  zoom={35}
                  near={-100}
                  far={1000}
                />
              ) : (
                <PerspectiveCamera
                  ref={cameraRef}
                  makeDefault
                  position={[9, 10, 14]}
                  fov={42}
                  near={0.1}
                  far={1000}
                />
              )}

              <ambientLight intensity={0.8} />
              <directionalLight position={[12, 18, 10]} intensity={1.5} castShadow />
              <directionalLight position={[-10, 10, -10]} intensity={0.6} />
              <pointLight position={[0, -5, 0]} intensity={0.4} color="#38bdf8" />

              <OrbitControls
                ref={controlsRef}
                enableDamping={true}
                dampingFactor={0.05}
                maxDistance={40}
                minDistance={4}
              />

              {showGrid && (
                <Grid
                  position={[0, -4.5, 0]}
                  args={[30, 30]}
                  cellSize={1}
                  cellThickness={0.8}
                  cellColor="#1e293b"
                  sectionSize={5}
                  sectionThickness={1.5}
                  sectionColor="#38bdf8"
                  fadeDistance={35}
                />
              )}

              {showAxes && <primitive object={new THREE.AxesHelper(6)} position={[0, -4.5, 0]} />}

              {/* Render Selected Feature's 3D CAD Model */}
              {selectedFeature === 'EXTRUDE' && (
                <CadExtrudeMesh
                  progress={progress}
                  wireframe={wireframe}
                  xray={xray}
                  depthParam={extrudeDepth}
                  profileType={extrudeProfile}
                  isPlaying={isPlaying}
                />
              )}

              {selectedFeature === 'REVOLVE' && (
                <CadRevolveMesh
                  progress={progress}
                  wireframe={wireframe}
                  xray={xray}
                  maxAngleParam={revolveAngle}
                  shaftType={shaftType}
                  isPlaying={isPlaying}
                />
              )}

              {selectedFeature === 'SWEEP' && (
                <CadSweepMesh
                  progress={progress}
                  wireframe={wireframe}
                  xray={xray}
                  pipeRadiusParam={pipeRadius}
                  routeType={routeType}
                  isPlaying={isPlaying}
                />
              )}

              {selectedFeature === 'LOFT' && (
                <CadLoftMesh
                  progress={progress}
                  wireframe={wireframe}
                  xray={xray}
                  isPlaying={isPlaying}
                />
              )}

              {selectedFeature === 'PATTERN' && (
                <CadPatternMesh
                  progress={progress}
                  wireframe={wireframe}
                  xray={xray}
                  patternMode={patternMode}
                  instanceCountParam={patternCount}
                  isPlaying={isPlaying}
                />
              )}
            </Canvas>
            </ErrorBoundary>

            {/* Corner CAD Watermark */}
            <div className="absolute bottom-2 left-3 pointer-events-none text-[10px] font-mono text-text-secondary/50 uppercase">
              MECH INDUSTRIAL 3D CAD SIMULATOR • REAL-TIME MESH GENERATOR
            </div>
          </div>

          {/* Bottom HUD: Playback Controls & Timeline Scrubber */}
          <div className="p-3 sm:p-4 bg-surface-elevated/95 border-t border-border/80 flex flex-col gap-3">
            {/* Timeline Scrubber Bar with Phase Markers */}
            <div className="space-y-1">
              <div className="flex justify-between items-center text-[10px] font-mono text-text-secondary">
                <span>0% 2D SKETCH</span>
                <span>25% VECTOR / AXIS</span>
                <span>50% GENERATING SOLID</span>
                <span>85% INSPECTION</span>
                <span>100% COMPLETE</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.005"
                value={progress}
                onChange={(e) => {
                  setProgress(parseFloat(e.target.value));
                  setIsPlaying(false);
                }}
                className="w-full h-2 bg-background rounded-lg appearance-none cursor-pointer accent-accent"
                style={{
                  background: `linear-gradient(to right, #14b8a6 ${progress * 100}%, rgba(48, 54, 61, 0.8) ${progress * 100}%)`,
                }}
              />
            </div>

            {/* Playback Buttons & Live CAD Parameter Controls */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-border/40">
              {/* Playback Controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    if (progress >= 1.0) setProgress(0);
                    setIsPlaying(!isPlaying);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-accent text-background font-mono font-bold text-xs flex items-center gap-1.5 shadow-md shadow-accent/20 hover:scale-105 transition"
                >
                  <span>{isPlaying ? '⏸ PAUSE' : '▶ PLAY'}</span>
                </button>
                <button
                  onClick={handleReplay}
                  className="px-2.5 py-1.5 rounded-lg bg-surface border border-border text-text-secondary hover:text-text-primary text-xs font-mono transition"
                  title="Replay from 0%"
                >
                  ↺ REPLAY
                </button>
                <button
                  onClick={() => setPlaybackSpeed((s) => (s === 1 ? 1.5 : s === 1.5 ? 0.5 : 1))}
                  className="px-2 py-1.5 rounded-lg bg-surface border border-border text-text-secondary hover:text-accent text-[11px] font-mono font-bold transition"
                  title="Cycle Playback Speed"
                >
                  {playbackSpeed}x
                </button>
                <span className="text-xs font-mono text-text-secondary ml-1">
                  Progress: <strong className="text-text-primary">{Math.round(progress * 100)}%</strong>
                </span>
              </div>

              {/* Feature-Specific Parameter Tweaks */}
              <div className="flex items-center gap-2 flex-wrap text-xs font-mono">
                {selectedFeature === 'EXTRUDE' && (
                  <div className="flex items-center gap-2 bg-surface px-2.5 py-1 rounded-lg border border-border">
                    <span className="text-text-secondary text-[11px]">Depth:</span>
                    <input
                      type="range"
                      min="20"
                      max="70"
                      step="5"
                      value={extrudeDepth}
                      onChange={(e) => setExtrudeDepth(parseInt(e.target.value))}
                      className="w-16 h-1 accent-accent cursor-pointer"
                    />
                    <span className="text-accent font-bold text-[11px]">{extrudeDepth} mm</span>
                    <button
                      onClick={() => setExtrudeProfile((p) => (p === 'bracket' ? 'boss' : 'bracket'))}
                      className="ml-2 px-2 py-0.5 rounded bg-surface-elevated border border-border text-[10px] text-text-primary hover:text-accent font-bold"
                    >
                      {extrudeProfile === 'bracket' ? 'Bracket Pocket' : 'Cylinder Boss'}
                    </button>
                  </div>
                )}

                {selectedFeature === 'REVOLVE' && (
                  <div className="flex items-center gap-2 bg-surface px-2.5 py-1 rounded-lg border border-border">
                    <span className="text-text-secondary text-[11px]">Angle:</span>
                    {[180, 270, 360].map((deg) => (
                      <button
                        key={deg}
                        onClick={() => setRevolveAngle(deg)}
                        className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                          revolveAngle === deg ? 'bg-accent text-background' : 'text-text-secondary hover:text-white'
                        }`}
                      >
                        {deg}°
                      </button>
                    ))}
                    <button
                      onClick={() => setShaftType((s) => (s === 'steppedShaft' ? 'flangedHub' : 'steppedShaft'))}
                      className="ml-1 px-2 py-0.5 rounded bg-surface-elevated border border-border text-[10px] text-text-primary hover:text-accent font-bold"
                    >
                      {shaftType === 'steppedShaft' ? 'Stepped Shaft' : 'Flanged Hub'}
                    </button>
                  </div>
                )}

                {selectedFeature === 'SWEEP' && (
                  <div className="flex items-center gap-2 bg-surface px-2.5 py-1 rounded-lg border border-border">
                    <span className="text-text-secondary text-[11px]">Pipe OD:</span>
                    <input
                      type="range"
                      min="20"
                      max="40"
                      step="2"
                      value={pipeRadius}
                      onChange={(e) => setPipeRadius(parseInt(e.target.value))}
                      className="w-16 h-1 accent-accent cursor-pointer"
                    />
                    <span className="text-accent font-bold text-[11px]">Ø{pipeRadius} mm</span>
                    <button
                      onClick={() => setRouteType((r) => (r === 'sCurve' ? 'rightAngle' : 'sCurve'))}
                      className="ml-1 px-2 py-0.5 rounded bg-surface-elevated border border-border text-[10px] text-text-primary hover:text-accent font-bold"
                    >
                      {routeType === 'sCurve' ? 'S-Curve Route' : '90° Elbow'}
                    </button>
                  </div>
                )}

                {selectedFeature === 'PATTERN' && (
                  <div className="flex items-center gap-2 bg-surface px-2.5 py-1 rounded-lg border border-border">
                    <button
                      onClick={() => setPatternMode((m) => (m === 'circular' ? 'linear' : 'circular'))}
                      className="px-2 py-0.5 rounded bg-surface-elevated border border-border text-[10px] text-accent font-bold"
                    >
                      {patternMode === 'circular' ? 'Mode: Circular PCD' : 'Mode: Linear Matrix'}
                    </button>
                    <span className="text-text-secondary text-[11px]">Count:</span>
                    {[4, 6, 8, 12].map((cnt) => (
                      <button
                        key={cnt}
                        onClick={() => setPatternCount(cnt)}
                        className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                          patternCount === cnt ? 'bg-accent text-background' : 'text-text-secondary hover:text-white'
                        }`}
                      >
                        {cnt}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Feature Information Panel */}
        <div className="lg:col-span-4 bg-surface p-5 sm:p-6 rounded-2xl border border-border shadow-xl space-y-5">
          {/* Header */}
          <div className="border-b border-border/50 pb-3 flex items-start justify-between gap-3">
            <div>
              <span className="text-[10px] font-mono text-accent uppercase font-bold tracking-widest">
                CAD OPERATION DETAIL
              </span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-2xl">{currentFeatureData.icon}</span>
                <h3 className={`text-lg font-black tracking-wide ${currentFeatureData.color}`}>
                  {currentFeatureData.name}
                </h3>
              </div>
            </div>
            <span className="text-[10px] font-mono px-2 py-1 rounded bg-surface-elevated border border-border text-text-secondary">
              ISO / ASME CAD
            </span>
          </div>

          {/* Short Explanation */}
          <p className="text-xs text-text-primary leading-relaxed bg-surface-elevated/70 p-3 rounded-xl border border-border/60">
            {currentFeatureData.shortExplanation}
          </p>

          {/* 4 Geometry Creation Steps with Synchronized Active State */}
          <div className="space-y-2">
            <div className="text-[11px] font-mono uppercase font-bold text-text-secondary tracking-wider">
              Geometry Creation Workflow
            </div>
            <div className="space-y-1.5">
              {currentFeatureData.geometrySteps.map((st, idx) => {
                const isActive = idx === activeStepIdx;
                const isPassed = idx < activeStepIdx;
                return (
                  <div
                    key={st.stepNumber}
                    onClick={() => {
                      setProgress(idx * 0.25 + 0.05);
                      setIsPlaying(false);
                    }}
                    className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                      isActive
                        ? 'bg-accent/15 border-accent shadow-md ring-1 ring-accent text-text-primary'
                        : isPassed
                        ? 'bg-surface-elevated/80 border-border text-text-secondary'
                        : 'bg-surface-elevated/40 border-border/60 text-text-secondary/70 opacity-80'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-5 h-5 rounded-full flex items-center justify-center font-mono text-[10px] font-bold ${
                            isActive
                              ? 'bg-accent text-background'
                              : isPassed
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                              : 'bg-surface border border-border text-text-secondary'
                          }`}
                        >
                          {isPassed ? '✓' : st.stepNumber}
                        </span>
                        <span className={`font-bold ${isActive ? 'text-text-primary' : ''}`}>
                          {st.title}
                        </span>
                      </div>
                      {isActive && (
                        <span className="text-[9px] font-mono text-accent animate-pulse font-bold">
                          ▶ ACTIVE STAGE
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-text-secondary mt-1 leading-snug pl-7">
                      {st.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Key Parameters Table */}
          <div className="space-y-2 pt-2 border-t border-border/50">
            <div className="text-[11px] font-mono uppercase font-bold text-text-secondary tracking-wider">
              Important CAD Parameters
            </div>
            <div className="bg-surface-elevated rounded-xl border border-border/80 divide-y divide-border/40 font-mono text-xs">
              {currentFeatureData.keyParameters.map((param) => (
                <div key={param.label} className="p-2 flex justify-between items-center gap-2">
                  <span className="text-text-secondary text-[11px]">{param.label}</span>
                  <span className="text-text-primary font-bold text-right text-[11px]">
                    {param.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Typical Industrial Applications */}
          <div className="space-y-2 pt-2 border-t border-border/50">
            <div className="text-[11px] font-mono uppercase font-bold text-text-secondary tracking-wider">
              Typical Industrial Applications
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {currentFeatureData.typicalApplications.map((app) => (
                <div key={app.title} className="p-2.5 rounded-lg bg-surface-elevated border border-border/70 space-y-0.5">
                  <div className="text-[11px] font-bold text-accent">{app.title}</div>
                  <div className="text-[10px] text-text-secondary leading-snug">{app.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Real-World Mechanical Component Case Study */}
          <div className="p-3.5 rounded-xl bg-accent/10 border border-accent/30 space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-accent uppercase tracking-wider">
              <span>⚙️ Real-World Mechanical Component</span>
            </div>
            <div className="text-xs font-extrabold text-text-primary">
              {currentFeatureData.realWorldComponent.title}
            </div>
            <p className="text-[11px] text-text-secondary leading-relaxed">
              {currentFeatureData.realWorldComponent.description}
            </p>
            <div className="pt-1.5 flex flex-wrap gap-2 text-[10px] font-mono text-text-secondary">
              <span className="px-2 py-0.5 rounded bg-surface border border-border">
                Material: <strong className="text-text-primary">{currentFeatureData.realWorldComponent.material}</strong>
              </span>
              <span className="px-2 py-0.5 rounded bg-surface border border-border">
                CAD: <strong className="text-text-primary">{currentFeatureData.realWorldComponent.cadSoftware}</strong>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
