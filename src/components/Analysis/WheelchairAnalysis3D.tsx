import { useRef, useState, useEffect, useCallback, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

// ─── Types ────────────────────────────────────────────────────────────────────

export type AnalysisMode = 'deformation' | 'stress' | 'fos' | 'life';
export type ViewPreset = 'iso' | 'front' | 'side' | 'rear';

// ─── Engineering Calculations ─────────────────────────────────────────────────
// All values are illustrative/conceptual — NOT actual FEA results.
// F = m × g (N); stress estimated from simplified beam theory; FoS = Fy / σ_max.

const G = 9.81; // m/s²
const YIELD_STRENGTH_MPA = 250; // EN8 steel ~250 MPa yield (simplified)
const SECTION_MODULUS_MM3 = 1200; // Approximate for 25mm OD × 2mm wall tube

function calcForce(massKg: number) {
  return massKg * G;
}

function calcMaxStressMPa(massKg: number) {
  // Simplified bending stress at seat-to-frame joint, M = F × L / 4
  const F = calcForce(massKg);
  const L_mm = 450; // characteristic span
  const M_Nmm = (F * L_mm) / 4;
  return M_Nmm / SECTION_MODULUS_MM3; // MPa
}

function calcFoS(massKg: number) {
  const sigma = calcMaxStressMPa(massKg);
  return sigma > 0 ? YIELD_STRENGTH_MPA / sigma : 99;
}

function calcDeflectionMm(massKg: number) {
  // δ = F·L³ / (48·E·I) for simply-supported beam (illustrative)
  const F = calcForce(massKg);
  const L = 0.45; // m
  const E = 200e9; // Pa — steel
  const I = 1.5e-8; // m⁴ — approx for 25×2 tube
  return (F * Math.pow(L, 3)) / (48 * E * I) * 1000; // mm
}

function calcFatigueLife(massKg: number) {
  const sigma = calcMaxStressMPa(massKg);
  const Se = YIELD_STRENGTH_MPA * 0.4; // endurance limit ≈ 0.4 × Sy
  if (sigma <= Se) return Infinity;
  // Simplified Basquin: N = (Sf / sigma)^b, Sf = 0.9*Su, b ≈ -0.085
  const Su = 550; // MPa EN8 UTS
  const Sf = 0.9 * Su;
  const b = -0.085;
  return Math.pow(Sf / sigma, 1 / b);
}

// ─── Color Helpers ────────────────────────────────────────────────────────────

function stressColor(norm: number): THREE.Color {
  // 0=blue, 0.25=cyan, 0.5=green, 0.75=yellow, 1=red
  const c = new THREE.Color();
  if (norm < 0.25) c.setRGB(0, norm * 4, 1);
  else if (norm < 0.5) c.setRGB(0, 1, 1 - (norm - 0.25) * 4);
  else if (norm < 0.75) c.setRGB((norm - 0.5) * 4, 1, 0);
  else c.setRGB(1, 1 - (norm - 0.75) * 4, 0);
  return c;
}

function fosColor(fos: number): THREE.Color {
  // >4 green, 2.5–4 cyan, 1.5–2.5 yellow, <1.5 red
  const c = new THREE.Color();
  if (fos > 4) c.setRGB(0.1, 0.85, 0.3);
  else if (fos > 2.5) c.setRGB(0.1, 0.75, 0.8);
  else if (fos > 1.5) c.setRGB(0.95, 0.75, 0.1);
  else c.setRGB(0.95, 0.2, 0.1);
  return c;
}

// Normalized stress value (0–1) for a given part based on its structural role
const PART_STRESS_NORM: Record<string, number> = {
  seat_rail_l: 0.78,
  seat_rail_r: 0.78,
  seat_cross_f: 0.62,
  seat_cross_r: 0.55,
  side_frame_l: 0.45,
  side_frame_r: 0.45,
  backrest_v_l: 0.30,
  backrest_v_r: 0.30,
  backrest_h: 0.22,
  front_leg_l: 0.38,
  front_leg_r: 0.38,
  footrest_h: 0.28,
  axle_l: 0.85,
  axle_r: 0.85,
  wheel_rear_l: 0.15,
  wheel_rear_r: 0.15,
  wheel_front_l: 0.10,
  wheel_front_r: 0.10,
};

// ─── Tube helper ─────────────────────────────────────────────────────────────

function TubeMesh({
  start,
  end,
  radius = 0.018,
  color,
  emissive,
  emissiveIntensity = 0,
  segments = 8,
}: {
  start: [number, number, number];
  end: [number, number, number];
  radius?: number;
  color: THREE.Color | string;
  emissive?: THREE.Color | string;
  emissiveIntensity?: number;
  segments?: number;
}) {
  const s = new THREE.Vector3(...start);
  const e = new THREE.Vector3(...end);
  const dir = new THREE.Vector3().subVectors(e, s);
  const length = dir.length();
  const mid = new THREE.Vector3().addVectors(s, e).multiplyScalar(0.5);

  const up = new THREE.Vector3(0, 1, 0);
  const quaternion = new THREE.Quaternion().setFromUnitVectors(up, dir.clone().normalize());

  return (
    <mesh position={mid.toArray()} quaternion={quaternion.toArray() as [number, number, number, number]} castShadow>
      <cylinderGeometry args={[radius, radius, length, segments]} />
      <meshStandardMaterial
        color={color}
        emissive={emissive ?? color}
        emissiveIntensity={emissiveIntensity}
        roughness={0.35}
        metalness={0.8}
      />
    </mesh>
  );
}

// ─── Wheel ────────────────────────────────────────────────────────────────────

function Wheel({
  position,
  radius,
  width = 0.04,
  color,
  spokeCount = 12,
}: {
  position: [number, number, number];
  radius: number;
  width?: number;
  color: THREE.Color | string;
  spokeCount?: number;
}) {
  const spokes = Array.from({ length: spokeCount }, (_, i) => {
    const a = (i / spokeCount) * Math.PI * 2;
    return [Math.cos(a) * radius * 0.85, Math.sin(a) * radius * 0.85];
  });

  return (
    <group position={position} rotation={[0, 0, Math.PI / 2]}>
      {/* Tire ring */}
      <mesh castShadow>
        <torusGeometry args={[radius, width, 8, 48]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.9} metalness={0.1} />
      </mesh>
      {/* Rim */}
      <mesh castShadow>
        <torusGeometry args={[radius * 0.85, 0.008, 6, 40]} />
        <meshStandardMaterial color={color} roughness={0.3} metalness={0.85} />
      </mesh>
      {/* Hub */}
      <mesh castShadow>
        <cylinderGeometry args={[0.025, 0.025, width * 2, 12]} />
        <meshStandardMaterial color={color} roughness={0.2} metalness={0.95} />
      </mesh>
      {/* Spokes */}
      {spokes.map(([x, y], i) => (
        <TubeMesh
          key={i}
          start={[0, 0, 0]}
          end={[0, x, y]}
          radius={0.004}
          color={color}
          segments={6}
        />
      ))}
    </group>
  );
}

// ─── Force Arrow ─────────────────────────────────────────────────────────────

function ForceArrow({ massKg, visible }: { massKg: number; visible: boolean }) {
  const arrowRef = useRef<THREE.Group>(null!);
  useFrame(({ clock }) => {
    if (arrowRef.current) {
      arrowRef.current.position.y = 1.35 + Math.sin(clock.elapsedTime * 2) * 0.04;
    }
  });
  if (!visible) return null;
  const label = `${massKg} kg ↓`;
  return (
    <group ref={arrowRef} position={[0, 1.35, 0]}>
      {/* Arrow shaft */}
      <mesh position={[0, -0.15, 0]}>
        <cylinderGeometry args={[0.012, 0.012, 0.3, 8]} />
        <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={0.6} />
      </mesh>
      {/* Arrowhead */}
      <mesh position={[0, -0.32, 0]}>
        <coneGeometry args={[0.035, 0.08, 8]} />
        <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={0.6} />
      </mesh>
    </group>
  );
}

// ─── Wheelchair 3D Model ───────────────────────────────────────────────────────

interface WheelchairModelProps {
  analysisMode: AnalysisMode;
  massKg: number;
  showHeatmap: boolean;
  explodedView: boolean;
  animTime: number;
}

function WheelchairModel({ analysisMode, massKg, showHeatmap, explodedView, animTime }: WheelchairModelProps) {
  const groupRef = useRef<THREE.Group>(null!);

  // Deformation animation parameters
  const maxDefl = Math.min(calcDeflectionMm(massKg) / 1000, 0.03); // cap visual deflection
  const deformPhase = Math.sin(animTime * 1.5) * 0.5 + 0.5; // 0–1

  // Resolve part color
  const partColor = useCallback((partId: string, baseColor: string): THREE.Color => {
    if (!showHeatmap) return new THREE.Color(baseColor);
    const norm = (PART_STRESS_NORM[partId] ?? 0.3);
    if (analysisMode === 'stress') return stressColor(norm);
    if (analysisMode === 'deformation') return stressColor(norm * deformPhase);
    if (analysisMode === 'fos') {
      const partFos = calcFoS(massKg) * (1 - norm * 0.6);
      return fosColor(partFos);
    }
    // life: similar to stress
    if (analysisMode === 'life') return stressColor(norm * 0.9);
    return new THREE.Color(baseColor);
  }, [analysisMode, showHeatmap, massKg, deformPhase]);

  const STEEL = '#4a5568';
  const STEEL_LIGHT = '#718096';

  // Seat deformation offset
  const seatDefl = showHeatmap && analysisMode === 'deformation' ? -maxDefl * deformPhase : 0;

  // Exploded offsets
  const expl = explodedView ? 1 : 0;

  return (
    <group ref={groupRef} position={[0, -0.3, 0]}>
      {/* ── Seat rail left */}
      <TubeMesh
        start={[-0.22, 0.65 + seatDefl, -0.20]}
        end={[-0.22, 0.65 + seatDefl, 0.22]}
        radius={0.015}
        color={partColor('seat_rail_l', STEEL)}
        emissiveIntensity={showHeatmap ? 0.3 : 0}
      />
      {/* ── Seat rail right */}
      <TubeMesh
        start={[0.22, 0.65 + seatDefl, -0.20]}
        end={[0.22, 0.65 + seatDefl, 0.22]}
        radius={0.015}
        color={partColor('seat_rail_r', STEEL)}
        emissiveIntensity={showHeatmap ? 0.3 : 0}
      />
      {/* ── Seat cross front */}
      <TubeMesh
        start={[-0.22, 0.65 + seatDefl * 0.8, 0.22]}
        end={[0.22, 0.65 + seatDefl * 0.8, 0.22]}
        radius={0.013}
        color={partColor('seat_cross_f', STEEL)}
        emissiveIntensity={showHeatmap ? 0.28 : 0}
      />
      {/* ── Seat cross rear */}
      <TubeMesh
        start={[-0.22, 0.65 + seatDefl * 0.6, -0.20]}
        end={[0.22, 0.65 + seatDefl * 0.6, -0.20]}
        radius={0.013}
        color={partColor('seat_cross_r', STEEL)}
        emissiveIntensity={showHeatmap ? 0.28 : 0}
      />

      {/* ── Side frame left — from seat to rear axle */}
      <TubeMesh
        start={[-0.22, 0.65, 0.20]}
        end={[-0.22, 0.30, 0.28]}
        radius={0.018}
        color={partColor('side_frame_l', STEEL)}
        emissiveIntensity={showHeatmap ? 0.22 : 0}
      />
      <TubeMesh
        start={[-0.22, 0.30, 0.28]}
        end={[-0.22, 0.35, -0.20]}
        radius={0.018}
        color={partColor('side_frame_l', STEEL)}
        emissiveIntensity={showHeatmap ? 0.22 : 0}
      />
      {/* ── Side frame right */}
      <TubeMesh
        start={[0.22, 0.65, 0.20]}
        end={[0.22, 0.30, 0.28]}
        radius={0.018}
        color={partColor('side_frame_r', STEEL)}
        emissiveIntensity={showHeatmap ? 0.22 : 0}
      />
      <TubeMesh
        start={[0.22, 0.30, 0.28]}
        end={[0.22, 0.35, -0.20]}
        radius={0.018}
        color={partColor('side_frame_r', STEEL)}
        emissiveIntensity={showHeatmap ? 0.22 : 0}
      />

      {/* ── Backrest verticals */}
      <TubeMesh
        start={[-0.22, 0.65, -0.20]}
        end={[-0.18, 1.10 + expl * 0.3, -0.22]}
        radius={0.014}
        color={partColor('backrest_v_l', STEEL_LIGHT)}
        emissiveIntensity={showHeatmap ? 0.18 : 0}
      />
      <TubeMesh
        start={[0.22, 0.65, -0.20]}
        end={[0.18, 1.10 + expl * 0.3, -0.22]}
        radius={0.014}
        color={partColor('backrest_v_r', STEEL_LIGHT)}
        emissiveIntensity={showHeatmap ? 0.18 : 0}
      />
      {/* Backrest horizontal */}
      <TubeMesh
        start={[-0.18, 1.05 + expl * 0.3, -0.22]}
        end={[0.18, 1.05 + expl * 0.3, -0.22]}
        radius={0.013}
        color={partColor('backrest_h', STEEL_LIGHT)}
        emissiveIntensity={showHeatmap ? 0.15 : 0}
      />
      {/* Backrest mid horizontal */}
      <TubeMesh
        start={[-0.18, 0.84 + expl * 0.15, -0.22]}
        end={[0.18, 0.84 + expl * 0.15, -0.22]}
        radius={0.012}
        color={partColor('backrest_h', STEEL_LIGHT)}
        emissiveIntensity={showHeatmap ? 0.15 : 0}
      />

      {/* ── Push handles */}
      <TubeMesh
        start={[-0.18, 1.10, -0.22]}
        end={[-0.16, 1.22, -0.28]}
        radius={0.012}
        color={STEEL_LIGHT}
      />
      <TubeMesh
        start={[0.18, 1.10, -0.22]}
        end={[0.16, 1.22, -0.28]}
        radius={0.012}
        color={STEEL_LIGHT}
      />

      {/* ── Front legs */}
      <TubeMesh
        start={[-0.22, 0.65, 0.22]}
        end={[-0.20, 0.08 - expl * 0.25, 0.36]}
        radius={0.013}
        color={partColor('front_leg_l', STEEL)}
        emissiveIntensity={showHeatmap ? 0.2 : 0}
      />
      <TubeMesh
        start={[0.22, 0.65, 0.22]}
        end={[0.20, 0.08 - expl * 0.25, 0.36]}
        radius={0.013}
        color={partColor('front_leg_r', STEEL)}
        emissiveIntensity={showHeatmap ? 0.2 : 0}
      />
      {/* ── Footrest horizontal */}
      <TubeMesh
        start={[-0.20, 0.08 - expl * 0.25, 0.36]}
        end={[0.20, 0.08 - expl * 0.25, 0.36]}
        radius={0.012}
        color={partColor('footrest_h', STEEL_LIGHT)}
        emissiveIntensity={showHeatmap ? 0.18 : 0}
      />

      {/* ── Axle tubes */}
      <TubeMesh
        start={[-0.34 - expl * 0.3, 0.35, 0.18]}
        end={[-0.22, 0.35, 0.18]}
        radius={0.014}
        color={partColor('axle_l', '#374151')}
        emissiveIntensity={showHeatmap ? 0.4 : 0}
      />
      <TubeMesh
        start={[0.22, 0.35, 0.18]}
        end={[0.34 + expl * 0.3, 0.35, 0.18]}
        radius={0.014}
        color={partColor('axle_r', '#374151')}
        emissiveIntensity={showHeatmap ? 0.4 : 0}
      />

      {/* ── Rear wheels */}
      <Wheel
        position={[-0.36 - expl * 0.3, 0.35, 0.18]}
        radius={0.30}
        color={partColor('wheel_rear_l', '#374151')}
      />
      <Wheel
        position={[0.36 + expl * 0.3, 0.35, 0.18]}
        radius={0.30}
        color={partColor('wheel_rear_r', '#374151')}
      />

      {/* ── Front caster wheels */}
      <Wheel
        position={[-0.20, 0.08 - expl * 0.25, 0.42]}
        radius={0.08}
        width={0.025}
        color={partColor('wheel_front_l', '#374151')}
        spokeCount={6}
      />
      <Wheel
        position={[0.20, 0.08 - expl * 0.25, 0.42]}
        radius={0.08}
        width={0.025}
        color={partColor('wheel_front_r', '#374151')}
        spokeCount={6}
      />

      {/* ── Cross brace (X-frame) */}
      <TubeMesh
        start={[-0.20, 0.50, 0.10]}
        end={[0.20, 0.50, -0.10]}
        radius={0.010}
        color={STEEL_LIGHT}
      />
      <TubeMesh
        start={[0.20, 0.50, 0.10]}
        end={[-0.20, 0.50, -0.10]}
        radius={0.010}
        color={STEEL_LIGHT}
      />

      {/* ── Armrests */}
      <TubeMesh
        start={[-0.26, 0.78, -0.10]}
        end={[-0.26, 0.78, 0.20]}
        radius={0.010}
        color={STEEL_LIGHT}
      />
      <TubeMesh
        start={[0.26, 0.78, -0.10]}
        end={[0.26, 0.78, 0.20]}
        radius={0.010}
        color={STEEL_LIGHT}
      />
    </group>
  );
}

// ─── Camera Presets ───────────────────────────────────────────────────────────

const VIEW_POSITIONS: Record<ViewPreset, [number, number, number]> = {
  iso: [1.4, 1.0, 1.6],
  front: [0, 0.5, 2.2],
  side: [2.5, 0.5, 0],
  rear: [0, 0.5, -2.2],
};

function CameraController({ preset, resetKey }: { preset: ViewPreset; resetKey: number }) {
  const { camera } = useThree();
  const target = VIEW_POSITIONS[preset];
  useEffect(() => {
    camera.position.set(...target);
    camera.lookAt(0, 0.3, 0);
  }, [preset, resetKey]);
  return null;
}

// ─── Life prediction chart (mini SVG) ────────────────────────────────────────

function LifeChart({ massKg }: { massKg: number }) {
  const life = calcFatigueLife(massKg);
  const lifeStr = !isFinite(life) ? '> 10⁷ cycles (infinite life)' : `~${(life / 1e6).toFixed(2)} × 10⁶ cycles`;
  const Se = YIELD_STRENGTH_MPA * 0.4;
  const sigma = calcMaxStressMPa(massKg);
  const xNorm = Math.min(sigma / YIELD_STRENGTH_MPA, 1);

  const pts = Array.from({ length: 20 }, (_, i) => {
    const t = i / 19;
    const x = 20 + t * 240;
    const y = 130 - Math.max(0, (1 - t * t * 0.9)) * 100;
    return `${x},${y}`;
  }).join(' ');

  const userX = 20 + xNorm * 240;
  const userY = 130 - Math.max(0, (1 - xNorm * xNorm * 0.9)) * 100;

  return (
    <svg viewBox="0 0 280 160" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <line x1="20" y1="20" x2="20" y2="140" stroke="#30363D" strokeWidth="1" />
      <line x1="20" y1="140" x2="265" y2="140" stroke="#30363D" strokeWidth="1" />
      <line x1="20" y1="100" x2="265" y2="100" stroke="#f59e0b" strokeWidth="1" strokeDasharray="5 3" />
      <polyline points={pts} fill="none" stroke="#16B8A6" strokeWidth="2" />
      <circle cx={userX} cy={userY} r={5} fill="#ef4444" />
      <line x1={userX} y1="20" x2={userX} y2={userY} stroke="#ef4444" strokeWidth="1" strokeDasharray="3 2" />
      <text x="100" y="96" fill="#f59e0b" fontSize="7" fontFamily="monospace">ENDURANCE LIMIT ≈ {Se.toFixed(0)} MPa</text>
      <text x="22" y="12" fill="#9DA7B0" fontSize="7" fontFamily="monospace">STRESS AMPLITUDE (MPa)</text>
      <text x="120" y="156" fill="#9DA7B0" fontSize="7" fontFamily="monospace" textAnchor="middle">CYCLES TO FAILURE (log N)</text>
      <text x="145" y="130" fill="#9DA7B0" fontSize="6" fontFamily="monospace" textAnchor="middle">CONCEPTUAL S–N CURVE</text>
      <text x={userX + 6} y={userY - 6} fill="#ef4444" fontSize="6" fontFamily="monospace">OPERATING POINT</text>
    </svg>
  );
}

// ─── Color Legend ─────────────────────────────────────────────────────────────

function ColorLegend({ mode }: { mode: AnalysisMode }) {
  if (mode === 'fos') {
    return (
      <div className="flex items-center gap-2 text-[10px] font-mono">
        <span className="text-[#1de84e]">●</span><span className="text-[#9DA7B0]">Safe (&gt;4)</span>
        <span className="text-[#16B8A6]">●</span><span className="text-[#9DA7B0]">OK (2.5–4)</span>
        <span className="text-[#f59e0b]">●</span><span className="text-[#9DA7B0]">Caution (1.5–2.5)</span>
        <span className="text-[#ef4444]">●</span><span className="text-[#9DA7B0]">Critical (&lt;1.5)</span>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-2 flex-1">
      <span className="text-[10px] font-mono text-[#9DA7B0]">LOW</span>
      <div className="flex-1 h-2.5 rounded-full bg-gradient-to-r from-blue-600 via-cyan-400 via-green-400 via-yellow-400 to-red-500 opacity-80" />
      <span className="text-[10px] font-mono text-[#9DA7B0]">HIGH</span>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export interface WheelchairAnalysis3DProps {
  activeTab: AnalysisMode;
  onTabChange: (tab: AnalysisMode) => void;
}

export default function WheelchairAnalysis3D({ activeTab, onTabChange }: WheelchairAnalysis3DProps) {
  const [massKg, setMassKg] = useState(150);
  const [playing, setPlaying] = useState(true);
  const [animTime, setAnimTime] = useState(0);
  const [showForce, setShowForce] = useState(true);
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [explodedView, setExplodedView] = useState(false);
  const [viewPreset, setViewPreset] = useState<ViewPreset>('iso');
  const [resetKey, setResetKey] = useState(0);
  const [webGLError, setWebGLError] = useState(false);
  const rafRef = useRef<number | null>(null);
  const lastT = useRef(performance.now());

  // Animation ticker
  useEffect(() => {
    if (!playing) return;
    const tick = () => {
      const now = performance.now();
      const dt = (now - lastT.current) / 1000;
      lastT.current = now;
      setAnimTime((t) => t + dt);
      rafRef.current = requestAnimationFrame(tick);
    };
    lastT.current = performance.now();
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [playing]);

  const handleReset = () => {
    setAnimTime(0);
    setMassKg(150);
    setPlaying(true);
    setShowForce(true);
    setShowHeatmap(true);
    setExplodedView(false);
    setViewPreset('iso');
    setResetKey((k) => k + 1);
  };

  const force = calcForce(massKg);
  const stress = calcMaxStressMPa(massKg);
  const fos = calcFoS(massKg);
  const defl = calcDeflectionMm(massKg);
  const life = calcFatigueLife(massKg);
  const lifeStr = !isFinite(life) ? '> 10⁷' : `${(life / 1e6).toFixed(2)}×10⁶`;

  const TABS: { key: AnalysisMode; label: string; icon: string }[] = [
    { key: 'deformation', label: 'Total Deformation', icon: '📐' },
    { key: 'stress', label: 'Equiv. Stress', icon: '⚡' },
    { key: 'fos', label: 'Factor of Safety', icon: '🛡️' },
    { key: 'life', label: 'Life Prediction', icon: '♾️' },
  ];

  const tabDesc: Record<AnalysisMode, string> = {
    deformation: `Max frame deflection ≈ ${defl.toFixed(2)} mm at seat centre. Calculated using simplified beam theory (δ = FL³/48EI). Actual FEA result will differ based on full geometry and constraints. Heatmap: blue = low displacement, red = high.`,
    stress: `Peak von Mises stress ≈ ${stress.toFixed(1)} MPa at axle-frame junction (conceptual estimate). For EN8 steel (Fy ≈ ${YIELD_STRENGTH_MPA} MPa). Actual stress distribution requires full 3D FEA solver and validated mesh.`,
    fos: `Calculated FoS = Fy / σ_max ≈ ${fos.toFixed(2)} (illustrative). Minimum recommended FoS for medical structures ≥ 2.5. Green = safe, red = critical. Actual safety factors depend on full loading cases and weld quality.`,
    life: `Using simplified Basquin relation. At ${massKg} kg applied load, estimated fatigue life ≈ ${lifeStr} cycles. Actual fatigue life requires validated S–N data, surface finish factors, and stress concentration coefficients.`,
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#20262E] rounded-xl border border-[#30363D] px-5 py-3">
        <div>
          <span className="text-[10px] font-mono text-[#16B8A6] font-bold tracking-widest">ENGINEERING ANALYSIS REPORT</span>
          <h3 className="text-sm font-bold text-white mt-0.5">Wheelchair Frame — Structural Analysis</h3>
        </div>
        <div className="flex gap-2 text-[10px] font-mono">
          <span className="px-2.5 py-1 rounded bg-[#3B82F6]/15 border border-[#3B82F6]/30 text-[#3B82F6] font-bold">LOAD: {massKg} kg</span>
          <span className="px-2.5 py-1 rounded bg-[#30363D] border border-[#30363D] text-[#9DA7B0]">CONCEPTUAL / ILLUSTRATIVE</span>
        </div>
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-4">
        {/* ── Left panel ── */}
        <div className="space-y-3">
          {/* Applied load card */}
          <div className="bg-[#20262E] rounded-xl border border-[#30363D] p-4 space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-xl">⬇️</span>
              <div>
                <span className="text-[10px] font-mono text-[#9DA7B0]">APPLIED LOAD</span>
                <div className="text-xl font-extrabold text-red-400 font-mono leading-tight">{massKg} kg</div>
                <span className="text-[10px] text-[#9DA7B0] font-mono">F = {force.toFixed(0)} N</span>
              </div>
            </div>
            <input
              type="range"
              min={25}
              max={200}
              value={massKg}
              onChange={(e) => setMassKg(Number(e.target.value))}
              className="w-full accent-[#3B82F6]"
            />
            <div className="flex justify-between text-[9px] font-mono text-[#9DA7B0]">
              <span>25 kg</span><span>200 kg</span>
            </div>
          </div>

          {/* Material card */}
          <div className="bg-[#20262E] rounded-xl border border-[#30363D] p-4 space-y-2">
            <span className="text-[10px] font-mono text-[#9DA7B0] font-bold tracking-widest">MATERIAL (ASSUMED)</span>
            <div className="space-y-1 text-[11px] font-mono">
              <div className="flex justify-between"><span className="text-[#9DA7B0]">Material</span><span className="text-white">EN8 Steel</span></div>
              <div className="flex justify-between"><span className="text-[#9DA7B0]">Yield Str.</span><span className="text-[#16B8A6]">{YIELD_STRENGTH_MPA} MPa</span></div>
              <div className="flex justify-between"><span className="text-[#9DA7B0]">UTS</span><span className="text-[#16B8A6]">550 MPa</span></div>
              <div className="flex justify-between"><span className="text-[#9DA7B0]">Density</span><span className="text-white">7850 kg/m³</span></div>
              <div className="flex justify-between"><span className="text-[#9DA7B0]">Tube OD/t</span><span className="text-white">25 / 2 mm</span></div>
            </div>
          </div>

          {/* Metrics */}
          <div className="bg-[#20262E] rounded-xl border border-[#30363D] p-4 space-y-2">
            <span className="text-[10px] font-mono text-[#9DA7B0] font-bold tracking-widest">ANALYSIS METRICS</span>
            <div className="space-y-2 text-[11px] font-mono">
              <div className="flex justify-between items-center">
                <span className="text-[#9DA7B0]">Max Stress</span>
                <span className={`font-bold ${stress > 180 ? 'text-red-400' : stress > 100 ? 'text-yellow-400' : 'text-[#16B8A6]'}`}>{stress.toFixed(1)} MPa</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#9DA7B0]">Deflection</span>
                <span className="text-white">{defl.toFixed(2)} mm</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#9DA7B0]">FoS</span>
                <span className={`font-bold ${fos < 1.5 ? 'text-red-400' : fos < 2.5 ? 'text-yellow-400' : 'text-green-400'}`}>{fos.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#9DA7B0]">Fatigue Life</span>
                <span className="text-white text-right">{lifeStr} cyc.</span>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="bg-[#20262E] rounded-xl border border-[#30363D] p-4 space-y-2">
            <span className="text-[10px] font-mono text-[#9DA7B0] font-bold tracking-widest">CONTROLS</span>
            <div className="grid grid-cols-2 gap-1.5">
              {[
                { label: playing ? '⏸ PAUSE' : '▶ PLAY', action: () => setPlaying((p) => !p), accent: playing },
                { label: '↺ RESET', action: handleReset, accent: false },
                { label: showForce ? '🔴 HIDE FORCE' : '🔴 SHOW FORCE', action: () => setShowForce((v) => !v), accent: showForce },
                { label: showHeatmap ? '🎨 HIDE MAP' : '🎨 SHOW MAP', action: () => setShowHeatmap((v) => !v), accent: showHeatmap },
                { label: explodedView ? '⬛ ASSEMBLED' : '↗ EXPLODED', action: () => setExplodedView((v) => !v), accent: explodedView },
              ].map((btn) => (
                <button
                  key={btn.label}
                  onClick={btn.action}
                  className={`text-[9px] font-mono font-bold px-2 py-1.5 rounded-lg border transition-all ${btn.accent ? 'bg-[#3B82F6]/15 border-[#3B82F6]/50 text-[#3B82F6]' : 'bg-[#30363D] border-[#30363D] text-[#9DA7B0] hover:border-[#3B82F6]/40 hover:text-white'}`}
                >
                  {btn.label}
                </button>
              ))}
            </div>
            <div className="pt-1">
              <span className="text-[10px] font-mono text-[#9DA7B0]">VIEW PRESET</span>
              <div className="grid grid-cols-4 gap-1 mt-1">
                {(['iso', 'front', 'side', 'rear'] as ViewPreset[]).map((v) => (
                  <button
                    key={v}
                    onClick={() => setViewPreset(v)}
                    className={`text-[8px] font-mono font-bold py-1 rounded border transition-all uppercase ${viewPreset === v ? 'bg-[#3B82F6] text-white border-[#3B82F6]' : 'bg-[#30363D] text-[#9DA7B0] border-[#30363D] hover:border-[#3B82F6]/40'}`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Analysis tabs (left) */}
          <div className="bg-[#20262E] rounded-xl border border-[#30363D] p-4 space-y-2">
            <span className="text-[10px] font-mono text-[#9DA7B0] font-bold tracking-widest">ANALYSIS MODE</span>
            <div className="space-y-1">
              {TABS.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => onTabChange(tab.key)}
                  className={`w-full text-left text-[11px] font-mono font-bold px-3 py-2 rounded-lg border transition-all ${activeTab === tab.key ? 'bg-[#3B82F6]/15 border-[#3B82F6]/50 text-[#3B82F6]' : 'bg-[#30363D] border-[#30363D] text-[#9DA7B0] hover:border-[#3B82F6]/30 hover:text-white'}`}
                >
                  {tab.icon} {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Right panel (3D + life chart) ── */}
        <div className="space-y-3">
          {/* 3D canvas */}
          <div
            className="relative w-full rounded-xl overflow-hidden border border-[#30363D]"
            style={{ height: '420px', background: '#171C22' }}
          >
            {webGLError ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-8 space-y-3">
                <div className="text-4xl">⚠️</div>
                <p className="text-sm font-mono text-amber-400">WebGL unavailable</p>
                <p className="text-xs text-[#9DA7B0]">Enable hardware acceleration to view the 3D model.</p>
              </div>
            ) : (
              <>
                <Suspense fallback={
                  <div className="flex items-center justify-center h-full">
                    <span className="text-xs font-mono text-[#16B8A6] animate-pulse">Loading 3D model…</span>
                  </div>
                }>
                  <Canvas
                    shadows
                    camera={{ position: VIEW_POSITIONS.iso, fov: 40 }}
                    gl={{ antialias: true }}
                    onCreated={({ gl }) => gl.setClearColor('#171C22')}
                    onError={() => setWebGLError(true)}
                  >
                    <CameraController preset={viewPreset} resetKey={resetKey} />

                    {/* Lighting */}
                    <ambientLight intensity={0.4} />
                    <directionalLight position={[3, 5, 3]} intensity={1.8} castShadow />
                    <pointLight position={[-3, 2, -2]} intensity={0.6} color="#16B8A6" />
                    <pointLight position={[2, -1, 3]} intensity={0.4} color="#3B82F6" />

                    {/* Ground */}
                    <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.32, 0]}>
                      <planeGeometry args={[6, 6]} />
                      <meshStandardMaterial color="#12171F" roughness={1} />
                    </mesh>
                    <gridHelper args={[4, 20, '#1e2a3a', '#141b25']} position={[0, -0.32, 0]} />

                    <WheelchairModel
                      analysisMode={activeTab}
                      massKg={massKg}
                      showHeatmap={showHeatmap}
                      explodedView={explodedView}
                      animTime={animTime}
                    />

                    <ForceArrow massKg={massKg} visible={showForce} />

                    <OrbitControls
                      enablePan={true}
                      minDistance={0.8}
                      maxDistance={5}
                      target={[0, 0.3, 0]}
                    />
                  </Canvas>
                </Suspense>

                {/* Overlay badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-1.5 pointer-events-none">
                  <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded bg-black/60 border border-[#30363D] text-[#16B8A6] backdrop-blur-sm uppercase">
                    {TABS.find((t) => t.key === activeTab)?.label}
                  </span>
                  {!playing && (
                    <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-amber-500/20 border border-amber-500/40 text-amber-400 backdrop-blur-sm">
                      ⏸ PAUSED
                    </span>
                  )}
                  {explodedView && (
                    <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-[#3B82F6]/20 border border-[#3B82F6]/40 text-[#3B82F6] backdrop-blur-sm">
                      EXPLODED VIEW
                    </span>
                  )}
                </div>

                <div className="absolute bottom-3 left-3 right-3 pointer-events-none">
                  <div className="bg-black/60 backdrop-blur-sm rounded-lg border border-[#30363D] px-3 py-2">
                    <ColorLegend mode={activeTab} />
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Life prediction chart (only for 'life' mode) */}
          {activeTab === 'life' && (
            <div className="bg-[#20262E] rounded-xl border border-[#30363D] p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono text-[#9DA7B0] font-bold tracking-widest">S–N FATIGUE CURVE</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-yellow-500/10 border border-yellow-500/30 text-yellow-400">CONCEPTUAL</span>
              </div>
              <div className="h-36">
                <LifeChart massKg={massKg} />
              </div>
            </div>
          )}

          {/* Description */}
          <div className="bg-[#20262E] rounded-xl border border-[#30363D] p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-[#9DA7B0] font-bold tracking-widest">
                {TABS.find((t) => t.key === activeTab)?.label.toUpperCase()} — EXPLANATION
              </span>
              <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-yellow-500/10 border border-yellow-500/30 text-yellow-400">ILLUSTRATIVE</span>
            </div>
            <p className="text-[11px] text-[#9DA7B0] leading-relaxed">{tabDesc[activeTab]}</p>
            <p className="text-[10px] text-[#505860] font-mono italic">
              ⚠ Actual structural validation requires proper FEA geometry, validated material data, correct boundary conditions, solver verification, and engineering judgment.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
