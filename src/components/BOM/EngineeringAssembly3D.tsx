import { useRef, useState, useEffect, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import * as THREE from 'three';

// ─── Types ──────────────────────────────────────────────────────────────────

type PanelId = 'cad' | 'assembly' | 'parts' | 'material' | 'specs';
type AnimationPhase =
  | 'idle'
  | 'reveal'
  | 'exploded'
  | 'definition'
  | 'assembling'
  | 'inspection'
  | 'done';

// ─── Part highlight mapping ─────────────────────────────────────────────────

const PANEL_PART_MAP: Record<PanelId, string[]> = {
  cad: ['housing', 'shaft', 'plate', 'bracket'],
  assembly: ['housing', 'shaft'],
  parts: ['bolt1', 'bolt2', 'bolt3', 'bolt4'],
  material: ['shaft', 'housing'],
  specs: ['plate', 'bracket'],
};

// ─── Scene Part Component ────────────────────────────────────────────────────

interface AssemblyPartProps {
  explodedOffset: THREE.Vector3;
  explodeProgress: number;
  highlighted: boolean;
  color: string;
  roughness?: number;
  metalness?: number;
  children: React.ReactNode;
  onClick?: () => void;
}

function AssemblyPart({
  explodedOffset,
  explodeProgress,
  highlighted,
  color,
  roughness = 0.25,
  metalness = 0.9,
  children,
  onClick,
}: AssemblyPartProps) {
  const groupRef = useRef<THREE.Group>(null!);
  const [hovered, setHovered] = useState(false);

  useFrame(() => {
    if (!groupRef.current) return;
    const target = explodedOffset.clone().multiplyScalar(explodeProgress);
    groupRef.current.position.lerp(target, 0.08);
  });

  const emissiveIntensity = highlighted ? 0.4 : hovered ? 0.2 : 0;
  const emissiveColor = highlighted || hovered ? color : '#000000';

  return (
    <group ref={groupRef}>
      <mesh
        castShadow
        receiveShadow
        onClick={(e) => { e.stopPropagation(); onClick?.(); }}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        {children}
        <meshStandardMaterial
          color={color}
          roughness={roughness}
          metalness={metalness}
          emissive={emissiveColor}
          emissiveIntensity={emissiveIntensity}
        />
      </mesh>
    </group>
  );
}

// ─── Bolt Component ──────────────────────────────────────────────────────────

function Bolt({
  position,
  explodedOffset,
  explodeProgress,
  highlighted,
  onClick,
}: {
  position: [number, number, number];
  explodedOffset: THREE.Vector3;
  explodeProgress: number;
  highlighted: boolean;
  onClick: () => void;
}) {
  const groupRef = useRef<THREE.Group>(null!);
  const [hovered, setHovered] = useState(false);
  const highlight = highlighted || hovered;

  useFrame(() => {
    if (!groupRef.current) return;
    const base = new THREE.Vector3(...position);
    const target = base.add(explodedOffset.clone().multiplyScalar(explodeProgress));
    groupRef.current.position.lerp(target, 0.08);
  });

  return (
    <group ref={groupRef}>
      <mesh
        castShadow
        onClick={(e) => { e.stopPropagation(); onClick(); }}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <cylinderGeometry args={[0.055, 0.055, 0.7, 12]} />
        <meshStandardMaterial
          color="#9ca3af"
          roughness={0.2}
          metalness={0.95}
          emissive={highlight ? '#a78bfa' : '#000000'}
          emissiveIntensity={highlight ? 0.4 : 0}
        />
      </mesh>
      <mesh
        position={[0, 0.38, 0]}
        castShadow
        onClick={(e) => { e.stopPropagation(); onClick(); }}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <cylinderGeometry args={[0.1, 0.1, 0.12, 6]} />
        <meshStandardMaterial
          color="#6b7280"
          roughness={0.25}
          metalness={0.9}
          emissive={highlight ? '#a78bfa' : '#000000'}
          emissiveIntensity={highlight ? 0.4 : 0}
        />
      </mesh>
    </group>
  );
}

// ─── Camera Animator ─────────────────────────────────────────────────────────

function CameraAnimator({ phase }: { phase: AnimationPhase }) {
  const { camera } = useThree();
  const targetPos = useRef(new THREE.Vector3(4.5, 3.5, 4.5));

  useEffect(() => {
    if (phase === 'inspection') {
      targetPos.current.set(3.5, 2.5, 3.5);
    } else if (phase === 'exploded' || phase === 'definition') {
      targetPos.current.set(5.5, 4, 5.5);
    } else {
      targetPos.current.set(4.5, 3.5, 4.5);
    }
  }, [phase]);

  useFrame(() => {
    camera.position.lerp(targetPos.current, 0.04);
    camera.lookAt(0, 0, 0);
  });

  return null;
}

// ─── Full Assembly Scene ──────────────────────────────────────────────────────

function AssemblyScene({
  explodeProgress,
  highlightedPanel,
  onPartClick,
  inspectionPhase,
}: {
  explodeProgress: number;
  highlightedPanel: PanelId | null;
  onPartClick: (panel: PanelId) => void;
  inspectionPhase: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null!);

  useFrame(({ clock }) => {
    if (!groupRef.current || !inspectionPhase) return;
    groupRef.current.rotation.y = clock.getElapsedTime() * 0.3;
  });

  const isHighlighted = (partName: string) => {
    if (!highlightedPanel) return false;
    return PANEL_PART_MAP[highlightedPanel]?.includes(partName) ?? false;
  };

  const panelForPart = (parts: string[]): PanelId => {
    for (const [panelId, partNames] of Object.entries(PANEL_PART_MAP)) {
      if (parts.some((p) => partNames.includes(p))) return panelId as PanelId;
    }
    return 'cad';
  };

  return (
    <group ref={groupRef}>
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 8, 5]} intensity={1.5} castShadow />
      <pointLight position={[-4, 2, -4]} intensity={0.8} color="#14b8a6" />
      <pointLight position={[4, -2, 4]} intensity={0.5} color="#38bdf8" />

      {/* Ground */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.5, 0]}>
        <planeGeometry args={[12, 12]} />
        <meshStandardMaterial color="#0a0f1e" roughness={1} metalness={0} />
      </mesh>
      <gridHelper args={[10, 20, '#1a2a4a', '#0d1830']} position={[0, -1.5, 0]} />

      {/* Central Housing */}
      <AssemblyPart
        name="housing"
        explodedOffset={new THREE.Vector3(0, 0, 0)}
        explodeProgress={explodeProgress}
        highlighted={isHighlighted('housing')}
        color="#4a5568"
        roughness={0.3}
        metalness={0.85}
        onClick={() => onPartClick(panelForPart(['housing']))}
      >
        <boxGeometry args={[1.6, 1.0, 1.6]} />
      </AssemblyPart>

      {/* Shaft */}
      <AssemblyPart
        name="shaft"
        explodedOffset={new THREE.Vector3(0, 2.2, 0)}
        explodeProgress={explodeProgress}
        highlighted={isHighlighted('shaft')}
        color="#718096"
        roughness={0.15}
        metalness={0.95}
        onClick={() => onPartClick(panelForPart(['shaft']))}
      >
        <cylinderGeometry args={[0.18, 0.18, 2.6, 32]} />
      </AssemblyPart>

      {/* Mounting Plate */}
      <AssemblyPart
        name="plate"
        explodedOffset={new THREE.Vector3(0, -1.8, 0)}
        explodeProgress={explodeProgress}
        highlighted={isHighlighted('plate')}
        color="#5a6a82"
        roughness={0.35}
        metalness={0.8}
        onClick={() => onPartClick(panelForPart(['plate']))}
      >
        <boxGeometry args={[2.4, 0.12, 2.4]} />
      </AssemblyPart>

      {/* Bracket */}
      <AssemblyPart
        name="bracket"
        explodedOffset={new THREE.Vector3(2.0, 0, 0)}
        explodeProgress={explodeProgress}
        highlighted={isHighlighted('bracket')}
        color="#6b7280"
        roughness={0.4}
        metalness={0.75}
        onClick={() => onPartClick(panelForPart(['bracket']))}
      >
        <boxGeometry args={[0.35, 0.8, 1.2]} />
      </AssemblyPart>

      {/* 4 Bolts */}
      {[
        { key: 'bolt1', pos: [0.65, -0.94, 0.65] as [number, number, number],  off: new THREE.Vector3(1.2, -1.5, 1.2) },
        { key: 'bolt2', pos: [-0.65, -0.94, 0.65] as [number, number, number], off: new THREE.Vector3(-1.2, -1.5, 1.2) },
        { key: 'bolt3', pos: [0.65, -0.94, -0.65] as [number, number, number], off: new THREE.Vector3(1.2, -1.5, -1.2) },
        { key: 'bolt4', pos: [-0.65, -0.94, -0.65] as [number, number, number],off: new THREE.Vector3(-1.2, -1.5, -1.2) },
      ].map((b) => (
        <Bolt
          key={b.key}
          position={b.pos}
          explodedOffset={b.off}
          explodeProgress={explodeProgress}
          highlighted={isHighlighted(b.key)}
          onClick={() => onPartClick('parts')}
        />
      ))}
    </group>
  );
}

// ─── Main Exported Component ─────────────────────────────────────────────────

export interface EngineeringAssembly3DProps {
  selectedPanel: PanelId | null;
  onPanelSelect: (id: PanelId | null) => void;
}

export default function EngineeringAssembly3D({
  selectedPanel,
  onPanelSelect,
}: EngineeringAssembly3DProps) {
  const [phase, setPhase] = useState<AnimationPhase>('idle');
  const [explodeProgress, setExplodeProgress] = useState(0);
  const [status, setStatus] = useState('Initializing 3D scene…');
  const [webGLError, setWebGLError] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = () => {
    if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null; }
  };

  const animateExplode = useCallback((from: number, to: number, onDone?: () => void) => {
    let p = from;
    const dir = to > from ? 1 : -1;
    const step = () => {
      p += dir * 0.018;
      const clamped = dir > 0 ? Math.min(p, to) : Math.max(p, to);
      setExplodeProgress(clamped);
      if (clamped !== to) {
        timerRef.current = setTimeout(step, 16);
      } else {
        onDone?.();
      }
    };
    step();
  }, []);

  const runAnimation = useCallback(() => {
    clearTimer();
    setExplodeProgress(0);
    setPhase('reveal');
    setStatus('INITIALIZING — Revealing assembly…');

    timerRef.current = setTimeout(() => {
      setPhase('exploded');
      setStatus('EXPLODED VIEW — Separating components…');
      animateExplode(0, 1, () => {
        timerRef.current = setTimeout(() => {
          setPhase('definition');
          setStatus('DEFINITION REVEAL — Engineering panels active');
          timerRef.current = setTimeout(() => {
            setPhase('assembling');
            setStatus('ASSEMBLY ANIMATION — Returning components…');
            animateExplode(1, 0, () => {
              timerRef.current = setTimeout(() => {
                setPhase('inspection');
                setStatus('FINAL INSPECTION — Rotate to explore');
                timerRef.current = setTimeout(() => {
                  setPhase('done');
                  setStatus('INTERACTIVE MODE — Drag · Scroll · Click');
                }, 3000);
              }, 400);
            });
          }, 4000);
        }, 3000);
      });
    }, 2000);
  }, [animateExplode]);

  useEffect(() => {
    const t = setTimeout(runAnimation, 500);
    return () => { clearTimeout(t); clearTimer(); };
  }, [runAnimation]);

  const handleExploded = () => {
    clearTimer(); setPhase('done'); setStatus('EXPLODED VIEW');
    animateExplode(explodeProgress, 1);
  };
  const handleAssembled = () => {
    clearTimer(); setPhase('done'); setStatus('ASSEMBLED VIEW');
    animateExplode(explodeProgress, 0);
  };
  const handleReplay = () => runAnimation();
  const handleResetCamera = () => {
    setPhase('done'); setStatus('CAMERA RESET');
    setTimeout(() => setStatus('INTERACTIVE MODE — Drag · Scroll · Click'), 1500);
  };

  const handlePartClick = (panelId: PanelId) => {
    onPanelSelect(panelId === selectedPanel ? null : panelId);
  };

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Canvas */}
      <div
        className="relative w-full rounded-xl overflow-hidden border border-[#1e3a5f]"
        style={{ height: '380px', background: '#060d1a' }}
      >
        {webGLError ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-8 space-y-3">
            <div className="text-4xl">⚠️</div>
            <p className="text-sm font-mono text-amber-400">WebGL unavailable</p>
            <p className="text-xs text-slate-400">Enable hardware acceleration to view 3D animation.</p>
          </div>
        ) : (
          <>
            <Canvas
              shadows
              camera={{ position: [4.5, 3.5, 4.5], fov: 45 }}
              gl={{ antialias: true }}
              onCreated={({ gl }) => { gl.setClearColor('#060d1a'); }}
              onError={() => setWebGLError(true)}
            >
              <CameraAnimator phase={phase} />
              <AssemblyScene
                explodeProgress={explodeProgress}
                highlightedPanel={selectedPanel}
                onPartClick={handlePartClick}
                inspectionPhase={phase === 'inspection'}
              />
              <OrbitControls enablePan={false} minDistance={2.5} maxDistance={12} target={[0, 0, 0]} />
              <Environment preset="city" />
            </Canvas>

            {/* Status bar */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-black/70 border border-[#14b8a6]/30 text-[10px] font-mono text-[#14b8a6] whitespace-nowrap backdrop-blur-sm pointer-events-none">
              {status}
            </div>

            {/* Phase badge */}
            {phase !== 'idle' && phase !== 'done' && (
              <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2 py-1 rounded-md bg-black/70 border border-[#14b8a6]/30 backdrop-blur-sm pointer-events-none">
                <span className="w-1.5 h-1.5 rounded-full bg-[#14b8a6] animate-pulse" />
                <span className="text-[9px] font-mono text-[#14b8a6] uppercase tracking-wider">
                  {phase}
                </span>
              </div>
            )}
          </>
        )}
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-2 justify-center">
        {[
          { label: 'EXPLODED VIEW', action: handleExploded, icon: '↗' },
          { label: 'ASSEMBLED VIEW', action: handleAssembled, icon: '⬜' },
          { label: 'REPLAY ANIMATION', action: handleReplay, icon: '▶' },
          { label: 'RESET CAMERA', action: handleResetCamera, icon: '⟳' },
        ].map((btn) => (
          <button
            key={btn.label}
            onClick={btn.action}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#1e3a5f] bg-[#0a0f1e] hover:border-[#14b8a6]/60 hover:bg-[#14b8a6]/10 text-[#94a3b8] hover:text-[#14b8a6] text-[10px] font-mono font-bold uppercase tracking-wider transition-all duration-200"
          >
            <span className="text-[#14b8a6]">{btn.icon}</span>
            {btn.label}
          </button>
        ))}
      </div>
    </div>
  );
}
