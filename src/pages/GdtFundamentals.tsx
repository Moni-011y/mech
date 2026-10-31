import { useState, useRef, Suspense, useCallback, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Line } from '@react-three/drei';
import * as THREE from 'three';
import Navbar from '../components/Navigation/Navbar';
import GdtSymbolStudio from '../components/Gdt/GdtSymbolStudio';
import GdtCardsSection from '../components/Gdt/GdtCardsSection';
import GdtTheorySection from '../components/Gdt/GdtTheorySection';
import FlatnessVideoPlayer from '../components/Gdt/FlatnessVideoPlayer';
import CircularityVideoPlayer from '../components/Gdt/CircularityVideoPlayer';
import CircularRunoutVideoPlayer from '../components/Gdt/CircularRunoutVideoPlayer';
import CylindricityVideoPlayer from '../components/Gdt/CylindricityVideoPlayer';
import StraightnessVideoPlayer from '../components/Gdt/StraightnessVideoPlayer';
import ProfileLineVideoPlayer from '../components/Gdt/ProfileLineVideoPlayer';
import ProfileSurfaceVideoPlayer from '../components/Gdt/ProfileSurfaceVideoPlayer';
import PerpendicularityVideoPlayer from '../components/Gdt/PerpendicularityVideoPlayer';
import ParallelismVideoPlayer from '../components/Gdt/ParallelismVideoPlayer';
import AngularityVideoPlayer from '../components/Gdt/AngularityVideoPlayer';
import PositionVideoPlayer from '../components/Gdt/PositionVideoPlayer';
import ConcentricityVideoPlayer from '../components/Gdt/ConcentricityVideoPlayer';
import SymmetryVideoPlayer from '../components/Gdt/SymmetryVideoPlayer';
import TotalRunoutVideoPlayer from '../components/Gdt/TotalRunoutVideoPlayer';
import { GDT_SYMBOLS_DATA } from '../components/Gdt/gdtData';
import SymbolCardNotesPanel from '../components/Gdt/SymbolCardNotesPanel';

// ═══════════════════════════════════════════════════
// GD&T SYMBOL METADATA
// ═══════════════════════════════════════════════════
const GDT_LIBRARY = [
  {
    id: 'flatness', cat: 'FORM', catColor: '#14b8a6', sym: '⏥', name: 'FLATNESS',
    desc: 'Controls how flat a surface is. The entire surface must lie between two parallel planes separated by the tolerance value.',
    zone: 'Two parallel planes', datum: false,
    example: 'Machined base plate: ⏥ 0.02 mm — surface within 2 parallel planes 0.02 mm apart.',
    note: 'Form control — no datum needed.',
  },
  {
    id: 'circularity', cat: 'FORM', catColor: '#14b8a6', sym: '○', name: 'CIRCULARITY',
    desc: 'At any cross-section perpendicular to the axis, the actual circle must lie between two concentric circles.',
    zone: 'Two concentric circles (annular zone)', datum: false,
    example: 'Shaft cross-section circularity 0.01 mm — any slice must be within 0.01 mm of a perfect circle.',
    note: 'Form control — no datum needed.',
  },
  {
    id: 'cylindricity', cat: 'FORM', catColor: '#14b8a6', sym: '⌭', name: 'CYLINDRICITY',
    desc: 'Controls the entire cylindrical surface — combines circularity, straightness, and taper simultaneously.',
    zone: 'Two coaxial cylinders', datum: false,
    example: 'Bearing journal: ⌭ 0.03 mm — entire surface within two cylinders 0.03 mm apart.',
    note: 'Most comprehensive form control for cylinders.',
  },
  {
    id: 'straightness', cat: 'FORM', catColor: '#14b8a6', sym: '⏤', name: 'STRAIGHTNESS',
    desc: 'Controls how straight a line element or axis is. Each line element (or axis) must lie within the tolerance zone.',
    zone: 'Two parallel lines / Cylinder (for axis)', datum: false,
    example: 'Shaft axis straightness 0.05 mm — axis must lie within a cylinder Ø0.05 mm.',
    note: 'Can apply to surface lines or feature axes.',
  },
  {
    id: 'profile-line', cat: 'PROFILE', catColor: '#6366f1', sym: '⌒', name: 'PROFILE OF A LINE',
    desc: 'Controls the shape of a 2D cross-sectional profile. The profile must lie within a tolerance band offset equally on each side.',
    zone: 'Two offset curves (crescent zones)', datum: false,
    example: 'Cam follower profile: ⌒ 0.1 — each cross-section must match within 0.1 mm.',
    note: 'Can reference a datum for location.',
  },
  {
    id: 'profile-surface', cat: 'PROFILE', catColor: '#6366f1', sym: '⌓', name: 'PROFILE OF A SURFACE',
    desc: 'Controls the 3D shape of any surface. The entire surface must lie within a 3D tolerance zone.',
    zone: 'Two offset surfaces', datum: false,
    example: 'Turbine blade: ⌓ 0.05 A — entire surface within 0.05 mm offset zone.',
    note: 'Most powerful profile control.',
  },
  {
    id: 'perpendicularity', cat: 'ORIENTATION', catColor: '#f59e0b', sym: '⊾', name: 'PERPENDICULARITY',
    desc: 'Controls a surface or axis that must be exactly 90° to the datum. Orientation control — requires datum.',
    zone: 'Two parallel planes / Cylindrical zone', datum: true,
    example: 'Hole axis ⊾ 0.03 A — axis within Ø0.03 mm cylinder perpendicular to datum A.',
    note: 'Requires datum reference.',
  },
  {
    id: 'parallelism', cat: 'ORIENTATION', catColor: '#f59e0b', sym: '∥', name: 'PARALLELISM',
    desc: 'Controls a surface or axis that must be exactly parallel to the datum.',
    zone: 'Two parallel planes / Cylindrical zone', datum: true,
    example: 'Top surface ∥ 0.02 A — surface within two planes 0.02 mm apart, parallel to datum A.',
    note: 'Requires datum reference.',
  },
  {
    id: 'angularity', cat: 'ORIENTATION', catColor: '#f59e0b', sym: '∠', name: 'ANGULARITY',
    desc: 'Controls a surface or axis at a specified basic angle to the datum. The tolerance zone is parallel to the true angle.',
    zone: 'Two parallel planes at basic angle', datum: true,
    example: 'Inclined surface at 45° basic angle: ∠ 0.05 A — zone parallel to true 45° position.',
    note: 'Requires datum and basic angle dimension.',
  },
  {
    id: 'position', cat: 'LOCATION', catColor: '#ec4899', sym: '⊕', name: 'POSITION',
    desc: 'Controls the location of a feature relative to datums. The tolerance zone is cylindrical (Ø). Most widely used GD&T symbol.',
    zone: 'Cylindrical zone (Ø)', datum: true,
    example: 'Bolt hole pattern ⊕ Ø0.05 A|B|C — each hole center within Ø0.05 mm of true position.',
    note: 'Requires datum reference. Most common GD&T callout.',
  },
  {
    id: 'concentricity', cat: 'LOCATION', catColor: '#ec4899', sym: '◎', name: 'CONCENTRICITY',
    desc: 'Controls the median points of a feature (all mid-points of diametrically opposed surface elements) relative to a datum axis.',
    zone: 'Cylindrical zone coaxial with datum', datum: true,
    example: 'Inner bore ◎ 0.02 A — all median points within Ø0.02 cylinder coaxial with datum A.',
    note: 'Difficult to measure. Often replaced by Runout.',
  },
  {
    id: 'symmetry', cat: 'LOCATION', catColor: '#ec4899', sym: '⌯', name: 'SYMMETRY',
    desc: 'Controls the median plane of a feature relative to the datum median plane.',
    zone: 'Two parallel planes symmetric about datum', datum: true,
    example: 'Slot ⌯ 0.04 B — median plane of slot within 0.04 mm of datum B median plane.',
    note: 'Difficult to measure. Often replaced by Position.',
  },
  {
    id: 'circular-runout', cat: 'RUNOUT', catColor: '#f97316', sym: '↗', name: 'CIRCULAR RUNOUT',
    desc: 'At any single cross-section perpendicular to the datum axis, surface variation must not exceed tolerance during one full rotation.',
    zone: 'Annular zone at each cross-section', datum: true,
    example: 'Shaft surface ↗ 0.05 A — at any cross-section, total indicator movement ≤ 0.05 mm.',
    note: 'Measured one cross-section at a time.',
  },
  {
    id: 'total-runout', cat: 'RUNOUT', catColor: '#f97316', sym: '⇗', name: 'TOTAL RUNOUT',
    desc: 'Simultaneously controls the entire surface relative to the datum axis during full rotation and axial traverse.',
    zone: 'Cylindrical zone over entire surface', datum: true,
    example: 'Shaft ⇗ 0.1 A — entire surface within 0.1 mm total as dial traverses full length.',
    note: 'Controls circularity + straightness + taper simultaneously.',
  },
];

// ═══════════════════════════════════════════════════
// ALL 14 THREE.JS ANIMATED MODELS
// ═══════════════════════════════════════════════════

// 1 — FLATNESS
function FlatnessModel() {
  const meshRef = useRef<THREE.Mesh>(null!);
  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.position.y = Math.sin(clock.elapsedTime * 0.7) * 0.08;
    }
  });
  return (
    <group>
      <mesh ref={meshRef} castShadow>
        <boxGeometry args={[3.5, 0.18, 2.2]} />
        <meshStandardMaterial color="#64748b" metalness={0.85} roughness={0.2} />
      </mesh>
      {/* Upper tolerance plane */}
      <mesh position={[0, 0.28, 0]}>
        <boxGeometry args={[3.7, 0.012, 2.4]} />
        <meshStandardMaterial color="#14b8a6" transparent opacity={0.5} />
      </mesh>
      {/* Lower tolerance plane */}
      <mesh position={[0, -0.28, 0]}>
        <boxGeometry args={[3.7, 0.012, 2.4]} />
        <meshStandardMaterial color="#14b8a6" transparent opacity={0.5} />
      </mesh>
      <Line points={[[-1.9, 0.28, 1.3], [1.9, 0.28, 1.3]]} color="#14b8a6" lineWidth={2} />
      <Line points={[[-1.9, -0.28, 1.3], [1.9, -0.28, 1.3]]} color="#14b8a6" lineWidth={2} />
      <Text position={[0, 0.55, 0]} fontSize={0.2} color="#14b8a6" font={undefined}>⏥ FLATNESS  0.02 mm</Text>
      <Text position={[-2.0, 0, 0]} fontSize={0.14} color="#94a3b8" font={undefined}>DATUM A</Text>
    </group>
  );
}

// 2 — CIRCULARITY
function CircularityModel() {
  const shaftRef = useRef<THREE.Group>(null!);
  useFrame(({ clock }) => {
    if (shaftRef.current) shaftRef.current.rotation.y = clock.elapsedTime * 1.2;
  });
  return (
    <group>
      <group ref={shaftRef}>
        <mesh castShadow>
          <cylinderGeometry args={[0.6, 0.6, 3, 32]} />
          <meshStandardMaterial color="#64748b" metalness={0.9} roughness={0.2} />
        </mesh>
      </group>
      {/* Cross-section rings at mid-point */}
      <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.6, 0.01, 8, 64]} />
        <meshStandardMaterial color="#14b8a6" />
      </mesh>
      {/* Outer tolerance ring */}
      <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.65, 0.008, 8, 64]} />
        <meshStandardMaterial color="#14b8a6" transparent opacity={0.5} />
      </mesh>
      {/* Inner tolerance ring */}
      <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.55, 0.008, 8, 64]} />
        <meshStandardMaterial color="#14b8a6" transparent opacity={0.5} />
      </mesh>
      <Text position={[0, 2.1, 0]} fontSize={0.2} color="#14b8a6" font={undefined}>○ CIRCULARITY  0.01 mm</Text>
      <Text position={[0, -2.1, 0]} fontSize={0.14} color="#94a3b8" font={undefined}>Any cross-section — 2 concentric circles</Text>
    </group>
  );
}

// 3 — CYLINDRICITY
function CylindricityModel() {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame(({ clock }) => { if (ref.current) ref.current.rotation.y = clock.elapsedTime * 0.6; });
  return (
    <group>
      <mesh ref={ref} castShadow>
        <cylinderGeometry args={[0.55, 0.55, 3.2, 40]} />
        <meshStandardMaterial color="#64748b" metalness={0.9} roughness={0.2} />
      </mesh>
      {/* Outer tolerance cylinder */}
      <mesh>
        <cylinderGeometry args={[0.65, 0.65, 3.4, 40]} />
        <meshStandardMaterial color="#14b8a6" transparent opacity={0.12} wireframe />
      </mesh>
      {/* Inner tolerance cylinder */}
      <mesh>
        <cylinderGeometry args={[0.45, 0.45, 3.4, 40]} />
        <meshStandardMaterial color="#6366f1" transparent opacity={0.08} wireframe />
      </mesh>
      <Text position={[0, 2.2, 0]} fontSize={0.2} color="#14b8a6" font={undefined}>⌭ CYLINDRICITY  0.03 mm</Text>
      <Text position={[0, -2.2, 0]} fontSize={0.14} color="#94a3b8" font={undefined}>Two coaxial cylinders — circularity + straightness + taper</Text>
    </group>
  );
}

// 4 — STRAIGHTNESS
function StraightnessModel() {
  const t = useRef(0);
  useFrame(({ clock }) => {
    t.current = clock.elapsedTime;
  });
  // Use a custom curve for the wavy shaft
  const curve = useMemo(() => {
    const pts = [];
    for (let i = 0; i <= 40; i++) {
      const x = (i / 40) * 4 - 2;
      const y = Math.sin((i / 40) * Math.PI * 2) * 0.14;
      pts.push(new THREE.Vector3(x, y, 0));
    }
    return new THREE.CatmullRomCurve3(pts);
  }, []);
  return (
    <group>
      {/* Wavy shaft line */}
      <Line
        points={curve.getPoints(60).map((p) => [p.x, p.y, p.z] as [number, number, number])}
        color="#64748b"
        lineWidth={10}
      />
      {/* Upper tolerance line */}
      <Line points={[[-2, 0.18, 0], [2, 0.18, 0]]} color="#14b8a6" lineWidth={2} dashed dashScale={10} />
      {/* Lower tolerance line */}
      <Line points={[[-2, -0.18, 0], [2, -0.18, 0]]} color="#14b8a6" lineWidth={2} dashed dashScale={10} />
      {/* Perfect axis */}
      <Line points={[[-2.2, 0, 0], [2.2, 0, 0]]} color="#f59e0b" lineWidth={1} dashed dashScale={15} />
      <Text position={[0, 0.6, 0]} fontSize={0.2} color="#14b8a6" font={undefined}>⏤ STRAIGHTNESS  0.05 mm</Text>
      <Text position={[0, -0.6, 0]} fontSize={0.14} color="#94a3b8" font={undefined}>Actual axis must lie within tolerance zone</Text>
      <Text position={[2.3, 0.05, 0]} fontSize={0.13} color="#f59e0b" font={undefined}>TRUE AXIS</Text>
    </group>
  );
}

// 5 — PROFILE OF A LINE
function ProfileLineModel() {
  const profilePts: [number, number, number][] = useMemo(() => {
    const pts: [number, number, number][] = [];
    for (let i = 0; i <= 50; i++) {
      const x = (i / 50) * 4 - 2;
      const y = Math.sin((i / 50) * Math.PI * 2.5) * 0.5 + Math.sin((i / 50) * Math.PI * 5) * 0.18;
      pts.push([x, y, 0]);
    }
    return pts;
  }, []);
  const upperPts: [number, number, number][] = profilePts.map(([x, y, z]) => [x, y + 0.18, z]);
  const lowerPts: [number, number, number][] = profilePts.map(([x, y, z]) => [x, y - 0.18, z]);
  const ref = useRef<THREE.Group>(null!);
  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.y = Math.sin(clock.elapsedTime * 0.4) * 0.3;
  });
  return (
    <group ref={ref}>
      <Line points={profilePts} color="#64748b" lineWidth={8} />
      <Line points={upperPts} color="#6366f1" lineWidth={2} />
      <Line points={lowerPts} color="#6366f1" lineWidth={2} />
      <Text position={[0, 1.2, 0]} fontSize={0.2} color="#6366f1" font={undefined}>⌒ PROFILE OF A LINE  0.1 mm</Text>
      <Text position={[0, -1.0, 0]} fontSize={0.14} color="#94a3b8" font={undefined}>Purple lines = tolerance band (bilateral)</Text>
    </group>
  );
}

// 6 — PROFILE OF A SURFACE
function ProfileSurfaceModel() {
  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(3.5, 2.5, 30, 20);
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      pos.setZ(i, Math.sin(x * 1.5) * 0.2 + Math.sin(y * 2) * 0.15);
    }
    geo.computeVertexNormals();
    return geo;
  }, []);
  const ref = useRef<THREE.Group>(null!);
  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.x = Math.sin(clock.elapsedTime * 0.4) * 0.2 + 0.3;
  });
  return (
    <group ref={ref}>
      {/* Actual surface */}
      <mesh geometry={geometry} castShadow>
        <meshStandardMaterial color="#64748b" metalness={0.6} roughness={0.4} side={THREE.DoubleSide} />
      </mesh>
      {/* Offset upper tolerance surface */}
      <mesh>
        <planeGeometry args={[3.7, 2.7, 1, 1]} />
        <meshStandardMaterial color="#6366f1" transparent opacity={0.15} side={THREE.DoubleSide} />
      </mesh>
      <mesh rotation={[0, 0, 0]} position={[0, 0, -0.18]}>
        <planeGeometry args={[3.7, 2.7, 1, 1]} />
        <meshStandardMaterial color="#6366f1" transparent opacity={0.15} side={THREE.DoubleSide} />
      </mesh>
      <Text position={[0, 1.7, 0.3]} fontSize={0.2} color="#6366f1" font={undefined}>⌓ PROFILE OF A SURFACE</Text>
    </group>
  );
}

// 7 — PERPENDICULARITY
function PerpendicularityModel() {
  const axisRef = useRef<THREE.Group>(null!);
  useFrame(({ clock }) => {
    if (axisRef.current) {
      axisRef.current.rotation.z = Math.sin(clock.elapsedTime * 0.7) * 0.1;
    }
  });
  return (
    <group>
      {/* Datum A — horizontal base */}
      <mesh position={[0, -1.2, 0]}>
        <boxGeometry args={[4, 0.22, 1.8]} />
        <meshStandardMaterial color="#334155" metalness={0.7} roughness={0.4} />
      </mesh>
      <Text position={[-2.2, -1.2, 0]} fontSize={0.18} color="#f59e0b" font={undefined}>DATUM A</Text>
      {/* Axis / shaft */}
      <group ref={axisRef} position={[0, -0.1, 0]}>
        <mesh>
          <cylinderGeometry args={[0.18, 0.18, 2.4, 24]} />
          <meshStandardMaterial color="#14b8a6" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Tolerance zone */}
        <mesh>
          <cylinderGeometry args={[0.3, 0.3, 2.5, 24]} />
          <meshStandardMaterial color="#6366f1" transparent opacity={0.13} wireframe />
        </mesh>
      </group>
      {/* 90° indicator line */}
      <Line points={[[0, -1.1, 0], [0.35, -1.1, 0], [0.35, -0.75, 0]]} color="#f59e0b" lineWidth={2} />
      <Text position={[0, 1.5, 0]} fontSize={0.2} color="#14b8a6" font={undefined}>⊾ PERPENDICULARITY  0.03 A</Text>
    </group>
  );
}

// 8 — PARALLELISM
function ParallelismModel() {
  const topRef = useRef<THREE.Mesh>(null!);
  useFrame(({ clock }) => {
    if (topRef.current) {
      topRef.current.rotation.z = Math.sin(clock.elapsedTime * 0.6) * 0.08;
    }
  });
  return (
    <group>
      {/* Datum surface — bottom */}
      <mesh position={[0, -1.0, 0]}>
        <boxGeometry args={[3.6, 0.22, 1.8]} />
        <meshStandardMaterial color="#334155" metalness={0.7} roughness={0.4} />
      </mesh>
      <Text position={[-2.0, -1.0, 0]} fontSize={0.18} color="#f59e0b" font={undefined}>DATUM A</Text>
      {/* Measured surface — top with tilt */}
      <mesh ref={topRef} position={[0, 0.8, 0]}>
        <boxGeometry args={[3.6, 0.22, 1.8]} />
        <meshStandardMaterial color="#14b8a6" metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Tolerance zone planes */}
      <mesh position={[0, 1.14, 0]}>
        <boxGeometry args={[3.8, 0.012, 2.0]} />
        <meshStandardMaterial color="#6366f1" transparent opacity={0.4} />
      </mesh>
      <mesh position={[0, 0.44, 0]}>
        <boxGeometry args={[3.8, 0.012, 2.0]} />
        <meshStandardMaterial color="#6366f1" transparent opacity={0.4} />
      </mesh>
      <Text position={[0, 1.8, 0]} fontSize={0.2} color="#f59e0b" font={undefined}>∥ PARALLELISM  0.02 A</Text>
    </group>
  );
}

// 9 — ANGULARITY
function AngularityModel() {
  const surfRef = useRef<THREE.Mesh>(null!);
  const [angle, setAngle] = useState(45);
  useFrame(({ clock }) => {
    const a = 30 + Math.abs(Math.sin(clock.elapsedTime * 0.3)) * 45;
    setAngle(Math.round(a));
    if (surfRef.current) surfRef.current.rotation.z = (a * Math.PI) / 180;
  });
  const rad = (angle * Math.PI) / 180;
  return (
    <group>
      {/* Datum A — base */}
      <mesh position={[0, -1.2, 0]}>
        <boxGeometry args={[4, 0.22, 1.8]} />
        <meshStandardMaterial color="#334155" metalness={0.7} roughness={0.4} />
      </mesh>
      <Text position={[-2.1, -1.2, 0]} fontSize={0.18} color="#f59e0b" font={undefined}>DATUM A</Text>
      {/* Angled surface */}
      <mesh ref={surfRef} position={[-0.5, -0.2, 0]}>
        <boxGeometry args={[2.4, 0.18, 1.6]} />
        <meshStandardMaterial color="#14b8a6" metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Angle arc indicator */}
      <mesh position={[0, -1.1, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.55, 0.018, 8, 32, rad]} />
        <meshStandardMaterial color="#f97316" />
      </mesh>
      <Text position={[0.5, -0.6, 0]} fontSize={0.18} color="#f97316" font={undefined}>{angle}°</Text>
      <Text position={[0, 1.8, 0]} fontSize={0.2} color="#f59e0b" font={undefined}>∠ ANGULARITY  0.05 A</Text>
      <Text position={[0, -2.0, 0]} fontSize={0.14} color="#94a3b8" font={undefined}>Basic angle animating 30°→75°</Text>
    </group>
  );
}

// 10 — POSITION
function PositionModel() {
  const holeRef = useRef<THREE.Group>(null!);
  useFrame(({ clock }) => {
    if (holeRef.current) {
      holeRef.current.position.x = Math.sin(clock.elapsedTime * 0.9) * 0.22;
      holeRef.current.position.z = Math.cos(clock.elapsedTime * 0.9) * 0.18;
    }
  });
  return (
    <group>
      {/* Base plate */}
      <mesh position={[0, 0, -0.18]}>
        <boxGeometry args={[4, 3, 0.25]} />
        <meshStandardMaterial color="#1e293b" metalness={0.5} roughness={0.5} />
      </mesh>
      {/* True position marker */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.38, 0.38, 0.06, 32]} />
        <meshStandardMaterial color="#14b8a6" transparent opacity={0.3} />
      </mesh>
      <mesh position={[0, 0, 0.04]}>
        <cylinderGeometry args={[0.055, 0.055, 0.06, 16]} />
        <meshStandardMaterial color="#14b8a6" />
      </mesh>
      {/* Actual hole position — orbiting */}
      <group ref={holeRef}>
        <mesh position={[0, 0, 0.04]}>
          <cylinderGeometry args={[0.13, 0.13, 0.08, 32]} />
          <meshStandardMaterial color="#ec4899" />
        </mesh>
      </group>
      {/* Tolerance zone ring */}
      <mesh position={[0, 0, 0.01]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.38, 0.016, 8, 64]} />
        <meshStandardMaterial color="#14b8a6" transparent opacity={0.6} />
      </mesh>
      <Text position={[0, 1.8, 0]} fontSize={0.2} color="#ec4899" font={undefined}>⊕ POSITION  Ø0.05 A|B|C</Text>
      <Text position={[0, -1.8, 0]} fontSize={0.14} color="#94a3b8" font={undefined}>Pink = actual hole orbiting true position</Text>
    </group>
  );
}

// 11 — CONCENTRICITY
function ConcentricityModel() {
  const innerRef = useRef<THREE.Mesh>(null!);
  useFrame(({ clock }) => {
    if (innerRef.current) {
      innerRef.current.position.x = Math.sin(clock.elapsedTime * 0.8) * 0.08;
      innerRef.current.position.z = Math.cos(clock.elapsedTime * 0.8) * 0.06;
      innerRef.current.rotation.y = clock.elapsedTime * 0.4;
    }
  });
  return (
    <group>
      {/* Datum axis (outer cylinder) */}
      <mesh>
        <cylinderGeometry args={[1.0, 1.0, 3, 40]} />
        <meshStandardMaterial color="#334155" metalness={0.7} roughness={0.4} transparent opacity={0.7} />
      </mesh>
      {/* Datum axis line */}
      <Line points={[[0, -1.8, 0], [0, 1.8, 0]]} color="#f59e0b" lineWidth={2} />
      <Text position={[1.3, 1.5, 0]} fontSize={0.16} color="#f59e0b" font={undefined}>DATUM AXIS A</Text>
      {/* Inner bore — slightly off-center */}
      <mesh ref={innerRef}>
        <cylinderGeometry args={[0.48, 0.48, 3.2, 32]} />
        <meshStandardMaterial color="#ec4899" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Tolerance zone */}
      <mesh>
        <cylinderGeometry args={[0.1, 0.1, 3.2, 32]} />
        <meshStandardMaterial color="#ec4899" transparent opacity={0.2} wireframe />
      </mesh>
      <Text position={[0, 2.2, 0]} fontSize={0.2} color="#ec4899" font={undefined}>◎ CONCENTRICITY  0.02 A</Text>
    </group>
  );
}

// 12 — SYMMETRY
function SymmetryModel() {
  const slotRef = useRef<THREE.Mesh>(null!);
  useFrame(({ clock }) => {
    if (slotRef.current) {
      slotRef.current.position.x = Math.sin(clock.elapsedTime * 0.8) * 0.12;
    }
  });
  return (
    <group>
      {/* Main block */}
      <mesh>
        <boxGeometry args={[3.5, 2.0, 1.2]} />
        <meshStandardMaterial color="#334155" metalness={0.6} roughness={0.5} />
      </mesh>
      {/* Datum median plane */}
      <mesh>
        <boxGeometry args={[3.7, 2.2, 0.01]} />
        <meshStandardMaterial color="#f59e0b" transparent opacity={0.25} />
      </mesh>
      <Text position={[2.2, 1.2, 0]} fontSize={0.16} color="#f59e0b" font={undefined}>DATUM B</Text>
      {/* Slot (moving) */}
      <mesh ref={slotRef} position={[0, 0, 0.61]}>
        <boxGeometry args={[0.7, 1.8, 0.25]} />
        <meshStandardMaterial color="#ec4899" metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Tolerance zone planes */}
      <mesh position={[0.12, 0, 0.61]}>
        <boxGeometry args={[0.01, 2.0, 0.3]} />
        <meshStandardMaterial color="#6366f1" transparent opacity={0.4} />
      </mesh>
      <mesh position={[-0.12, 0, 0.61]}>
        <boxGeometry args={[0.01, 2.0, 0.3]} />
        <meshStandardMaterial color="#6366f1" transparent opacity={0.4} />
      </mesh>
      <Text position={[0, 1.4, 0.6]} fontSize={0.18} color="#ec4899" font={undefined}>⌯ SYMMETRY  0.04 B</Text>
    </group>
  );
}

// 13 — CIRCULAR RUNOUT
function CircularRunoutModel() {
  const shaftRef = useRef<THREE.Group>(null!);
  const dialRef = useRef<THREE.Mesh>(null!);
  const angle = useRef(0);
  useFrame((_, delta) => {
    angle.current += delta * 2;
    if (shaftRef.current) {
      shaftRef.current.rotation.y = angle.current;
      // Eccentricity wobble
      shaftRef.current.position.x = Math.cos(angle.current) * 0.06;
      shaftRef.current.position.z = Math.sin(angle.current) * 0.06;
    }
    if (dialRef.current) {
      dialRef.current.rotation.z = Math.sin(angle.current) * 0.5;
    }
  });
  return (
    <group>
      {/* Datum axis */}
      <Line points={[[-2.5, 0, 0], [2.5, 0, 0]]} color="#f59e0b" lineWidth={2} dashed dashScale={8} />
      <Text position={[-2.8, 0.2, 0]} fontSize={0.15} color="#f59e0b" font={undefined}>DATUM A</Text>
      {/* Rotating shaft */}
      <group ref={shaftRef}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.42, 0.42, 4.0, 32]} />
          <meshStandardMaterial color="#64748b" metalness={0.9} roughness={0.2} />
        </mesh>
      </group>
      {/* Measurement indicator at single cross-section */}
      <mesh position={[0, 0.85, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 0.55, 12]} />
        <meshStandardMaterial color="#334155" />
      </mesh>
      <mesh ref={dialRef} position={[0, 0.85, 0]}>
        <boxGeometry args={[0.025, 0.3, 0.025]} />
        <meshStandardMaterial color="#f97316" />
      </mesh>
      {/* Cross-section ring */}
      <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.42, 0.015, 8, 64]} />
        <meshStandardMaterial color="#f97316" transparent opacity={0.7} />
      </mesh>
      <Text position={[0, 2.1, 0]} fontSize={0.2} color="#f97316" font={undefined}>↗ CIRCULAR RUNOUT  0.05 A</Text>
      <Text position={[0, -1.6, 0]} fontSize={0.13} color="#94a3b8" font={undefined}>Single cross-section — dial indicator</Text>
    </group>
  );
}

// 14 — TOTAL RUNOUT
function TotalRunoutModel() {
  const shaftRef = useRef<THREE.Group>(null!);
  const dialGroupRef = useRef<THREE.Group>(null!);
  const dialRef = useRef<THREE.Mesh>(null!);
  const angle = useRef(0);
  const traverse = useRef(0);
  useFrame((_, delta) => {
    angle.current += delta * 2.2;
    traverse.current += delta * 0.6;
    if (shaftRef.current) {
      shaftRef.current.rotation.y = angle.current;
      shaftRef.current.position.x = Math.cos(angle.current) * 0.08;
    }
    if (dialGroupRef.current) {
      // Traverse dial along shaft
      dialGroupRef.current.position.z = Math.sin(traverse.current) * 1.8;
    }
    if (dialRef.current) {
      dialRef.current.rotation.z = Math.sin(angle.current) * 0.6;
    }
  });
  return (
    <group>
      <Line points={[[-2.5, 0, 0], [2.5, 0, 0]]} color="#f59e0b" lineWidth={2} dashed dashScale={8} />
      <Text position={[-2.8, 0.2, 0]} fontSize={0.15} color="#f59e0b" font={undefined}>DATUM A</Text>
      {/* Rotating shaft */}
      <group ref={shaftRef}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.42, 0.42, 4.2, 32]} />
          <meshStandardMaterial color="#64748b" metalness={0.9} roughness={0.2} />
        </mesh>
      </group>
      {/* Traversing dial indicator group */}
      <group ref={dialGroupRef} position={[0, 0.85, 0]}>
        <mesh>
          <cylinderGeometry args={[0.1, 0.1, 0.55, 12]} />
          <meshStandardMaterial color="#334155" />
        </mesh>
        <mesh ref={dialRef}>
          <boxGeometry args={[0.025, 0.3, 0.025]} />
          <meshStandardMaterial color="#f97316" />
        </mesh>
      </group>
      {/* Tolerance zone cylinder */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.55, 0.55, 4.4, 32]} />
        <meshStandardMaterial color="#f97316" transparent opacity={0.1} wireframe />
      </mesh>
      <Text position={[0, 2.1, 0]} fontSize={0.2} color="#f97316" font={undefined}>⇗ TOTAL RUNOUT  0.1 A</Text>
      <Text position={[0, -1.6, 0]} fontSize={0.13} color="#94a3b8" font={undefined}>Dial traverses entire surface length</Text>
    </group>
  );
}

// ═══════════════════════════════════════════════════
// MODEL ROUTER
// ═══════════════════════════════════════════════════
function GdtModel({ id }: { id: string }) {
  switch (id) {
    case 'flatness': return <FlatnessModel />;
    case 'circularity': return <CircularityModel />;
    case 'cylindricity': return <CylindricityModel />;
    case 'straightness': return <StraightnessModel />;
    case 'profile-line': return <ProfileLineModel />;
    case 'profile-surface': return <ProfileSurfaceModel />;
    case 'perpendicularity': return <PerpendicularityModel />;
    case 'parallelism': return <ParallelismModel />;
    case 'angularity': return <AngularityModel />;
    case 'position': return <PositionModel />;
    case 'concentricity': return <ConcentricityModel />;
    case 'symmetry': return <SymmetryModel />;
    case 'circular-runout': return <CircularRunoutModel />;
    case 'total-runout': return <TotalRunoutModel />;
    default: return <FlatnessModel />;
  }
}

// ═══════════════════════════════════════════════════
// 3D VIEWER
// ═══════════════════════════════════════════════════
function Viewer3D({ id }: { id: string }) {
  const isFlatness = id === 'flatness';
  const isCircularity = id === 'circularity';
  const isCylindricity = id === 'cylindricity';
  const isStraightness = id === 'straightness';
  const isProfileLine = id === 'profile-line';
  const isProfileSurface = id === 'profile-surface';
  const isPerpendicularity = id === 'perpendicularity';
  const isParallelism = id === 'parallelism';
  const isAngularity = id === 'angularity';
  const isPosition = id === 'position';
  const isConcentricity = id === 'concentricity';
  const isSymmetry = id === 'symmetry';
  const isCircularRunout = id === 'circular-runout';
  const isTotalRunout = id === 'total-runout';
  const [flatnessMode, setFlatnessMode] = useState<'video' | '3d'>('video');
  const [circularityMode, setCircularityMode] = useState<'video' | '3d'>('video');
  const [cylindricityMode, setCylindricityMode] = useState<'video' | '3d'>('video');
  const [straightnessMode, setStraightnessMode] = useState<'video' | '3d'>('video');
  const [profileLineMode, setProfileLineMode] = useState<'video' | '3d'>('video');
  const [profileSurfaceMode, setProfileSurfaceMode] = useState<'video' | '3d'>('video');
  const [perpendicularityMode, setPerpendicularityMode] = useState<'video' | '3d'>('video');
  const [parallelismMode, setParallelismMode] = useState<'video' | '3d'>('video');
  const [angularityMode, setAngularityMode] = useState<'video' | '3d'>('video');
  const [positionMode, setPositionMode] = useState<'video' | '3d'>('video');
  const [concentricityMode, setConcentricityMode] = useState<'video' | '3d'>('video');
  const [symmetryMode, setSymmetryMode] = useState<'video' | '3d'>('video');
  const [circularRunoutMode, setCircularRunoutMode] = useState<'video' | '3d'>('video');
  const [totalRunoutMode, setTotalRunoutMode] = useState<'video' | '3d'>('video');

  if (isFlatness && flatnessMode === 'video') {
    return (
      <div className="w-full h-full rounded-2xl overflow-hidden border border-border bg-[#040810] relative">
        <FlatnessVideoPlayer
          className="w-full h-full rounded-2xl"
          onSwitchTo3d={() => setFlatnessMode('3d')}
          show3dToggle={true}
        />
      </div>
    );
  }

  if (isCircularity && circularityMode === 'video') {
    return (
      <div className="w-full h-full rounded-2xl overflow-hidden border border-border bg-[#040810] relative">
        <CircularityVideoPlayer
          className="w-full h-full rounded-2xl"
          onSwitchTo3d={() => setCircularityMode('3d')}
          show3dToggle={true}
        />
      </div>
    );
  }

  if (isCylindricity && cylindricityMode === 'video') {
    return (
      <div className="w-full h-full rounded-2xl overflow-hidden border border-border bg-[#040810] relative">
        <CylindricityVideoPlayer
          className="w-full h-full rounded-2xl"
          onSwitchTo3d={() => setCylindricityMode('3d')}
          show3dToggle={true}
        />
      </div>
    );
  }

  if (isStraightness && straightnessMode === 'video') {
    return (
      <div className="w-full h-full rounded-2xl overflow-hidden border border-border bg-[#040810] relative">
        <StraightnessVideoPlayer
          className="w-full h-full rounded-2xl"
          onSwitchTo3d={() => setStraightnessMode('3d')}
          show3dToggle={true}
        />
      </div>
    );
  }

  if (isProfileLine && profileLineMode === 'video') {
    return (
      <div className="w-full h-full rounded-2xl overflow-hidden border border-border bg-[#040810] relative">
        <ProfileLineVideoPlayer
          className="w-full h-full rounded-2xl"
          onSwitchTo3d={() => setProfileLineMode('3d')}
          show3dToggle={true}
        />
      </div>
    );
  }

  if (isProfileSurface && profileSurfaceMode === 'video') {
    return (
      <div className="w-full h-full rounded-2xl overflow-hidden border border-border bg-[#040810] relative">
        <ProfileSurfaceVideoPlayer
          className="w-full h-full rounded-2xl"
          onSwitchTo3d={() => setProfileSurfaceMode('3d')}
          show3dToggle={true}
        />
      </div>
    );
  }

  if (isPerpendicularity && perpendicularityMode === 'video') {
    return (
      <div className="w-full h-full rounded-2xl overflow-hidden border border-border bg-[#040810] relative">
        <PerpendicularityVideoPlayer
          className="w-full h-full rounded-2xl"
          onSwitchTo3d={() => setPerpendicularityMode('3d')}
          show3dToggle={true}
        />
      </div>
    );
  }

  if (isParallelism && parallelismMode === 'video') {
    return (
      <div className="w-full h-full rounded-2xl overflow-hidden border border-border bg-[#040810] relative">
        <ParallelismVideoPlayer
          className="w-full h-full rounded-2xl"
          onSwitchTo3d={() => setParallelismMode('3d')}
          show3dToggle={true}
        />
      </div>
    );
  }

  if (isCircularRunout && circularRunoutMode === 'video') {
    return (
      <div className="w-full h-full rounded-2xl overflow-hidden border border-border bg-[#040810] relative">
        <CircularRunoutVideoPlayer
          className="w-full h-full rounded-2xl"
          onSwitchTo3d={() => setCircularRunoutMode('3d')}
          show3dToggle={true}
        />
      </div>
    );
  }

  if (isAngularity && angularityMode === 'video') {
    return (
      <div className="w-full h-full rounded-2xl overflow-hidden border border-border bg-[#040810] relative">
        <AngularityVideoPlayer
          className="w-full h-full rounded-2xl"
          onSwitchTo3d={() => setAngularityMode('3d')}
          show3dToggle={true}
        />
      </div>
    );
  }

  if (isPosition && positionMode === 'video') {
    return (
      <div className="w-full h-full rounded-2xl overflow-hidden border border-border bg-[#040810] relative">
        <PositionVideoPlayer
          className="w-full h-full rounded-2xl"
          onSwitchTo3d={() => setPositionMode('3d')}
          show3dToggle={true}
        />
      </div>
    );
  }

  if (isConcentricity && concentricityMode === 'video') {
    return (
      <div className="w-full h-full rounded-2xl overflow-hidden border border-border bg-[#040810] relative">
        <ConcentricityVideoPlayer
          className="w-full h-full rounded-2xl"
          onSwitchTo3d={() => setConcentricityMode('3d')}
          show3dToggle={true}
        />
      </div>
    );
  }

  if (isSymmetry && symmetryMode === 'video') {
    return (
      <div className="w-full h-full rounded-2xl overflow-hidden border border-border bg-[#040810] relative">
        <SymmetryVideoPlayer
          className="w-full h-full rounded-2xl"
          onSwitchTo3d={() => setSymmetryMode('3d')}
          show3dToggle={true}
        />
      </div>
    );
  }

  if (isTotalRunout && totalRunoutMode === 'video') {
    return (
      <div className="w-full h-full rounded-2xl overflow-hidden border border-border bg-[#040810] relative">
        <TotalRunoutVideoPlayer
          className="w-full h-full rounded-2xl"
          onSwitchTo3d={() => setTotalRunoutMode('3d')}
          show3dToggle={true}
        />
      </div>
    );
  }

  return (
    <div className="w-full h-full rounded-2xl overflow-hidden border border-border bg-[#040810] relative">
      {isFlatness && (
        <button
          onClick={() => setFlatnessMode('video')}
          className="absolute top-3 right-3 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-500/90 hover:bg-teal-400 text-slate-950 text-xs font-bold shadow-lg shadow-teal-500/30 transition backdrop-blur-md"
        >
          <span>🎥</span>
          <span>Watch Industrial Video</span>
        </button>
      )}
      {isCircularity && (
        <button
          onClick={() => setCircularityMode('video')}
          className="absolute top-3 right-3 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-500/90 hover:bg-teal-400 text-slate-950 text-xs font-bold shadow-lg shadow-teal-500/30 transition backdrop-blur-md"
        >
          <span>🎥</span>
          <span>Watch Industrial Video</span>
        </button>
      )}
      {isCylindricity && (
        <button
          onClick={() => setCylindricityMode('video')}
          className="absolute top-3 right-3 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-500/90 hover:bg-teal-400 text-slate-950 text-xs font-bold shadow-lg shadow-teal-500/30 transition backdrop-blur-md"
        >
          <span>🎥</span>
          <span>Watch Industrial Video</span>
        </button>
      )}
      {isStraightness && (
        <button
          onClick={() => setStraightnessMode('video')}
          className="absolute top-3 right-3 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-500/90 hover:bg-teal-400 text-slate-950 text-xs font-bold shadow-lg shadow-teal-500/30 transition backdrop-blur-md"
        >
          <span>🎥</span>
          <span>Watch Industrial Video</span>
        </button>
      )}
      {isProfileLine && (
        <button
          onClick={() => setProfileLineMode('video')}
          className="absolute top-3 right-3 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-500/90 hover:bg-indigo-400 text-white text-xs font-bold shadow-lg shadow-indigo-500/30 transition backdrop-blur-md"
        >
          <span>🎥</span>
          <span>Watch Industrial Video</span>
        </button>
      )}
      {isProfileSurface && (
        <button
          onClick={() => setProfileSurfaceMode('video')}
          className="absolute top-3 right-3 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-500/90 hover:bg-indigo-400 text-white text-xs font-bold shadow-lg shadow-indigo-500/30 transition backdrop-blur-md"
        >
          <span>🎥</span>
          <span>Watch Industrial Video</span>
        </button>
      )}
      {isPerpendicularity && (
        <button
          onClick={() => setPerpendicularityMode('video')}
          className="absolute top-3 right-3 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/90 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-lg shadow-amber-500/30 transition backdrop-blur-md"
        >
          <span>🎥</span>
          <span>Watch Industrial Video</span>
        </button>
      )}
      {isParallelism && (
        <button
          onClick={() => setParallelismMode('video')}
          className="absolute top-3 right-3 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/90 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-lg shadow-amber-500/30 transition backdrop-blur-md"
        >
          <span>🎥</span>
          <span>Watch Industrial Video</span>
        </button>
      )}
      {isAngularity && (
        <button
          onClick={() => setAngularityMode('video')}
          className="absolute top-3 right-3 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/90 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-lg shadow-amber-500/30 transition backdrop-blur-md"
        >
          <span>🎥</span>
          <span>Watch Industrial Video</span>
        </button>
      )}
      {isPosition && (
        <button
          onClick={() => setPositionMode('video')}
          className="absolute top-3 right-3 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-pink-500/90 hover:bg-pink-400 text-white text-xs font-bold shadow-lg shadow-pink-500/30 transition backdrop-blur-md"
        >
          <span>🎥</span>
          <span>Watch Industrial Video</span>
        </button>
      )}
      {isConcentricity && (
        <button
          onClick={() => setConcentricityMode('video')}
          className="absolute top-3 right-3 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-pink-500/90 hover:bg-pink-400 text-white text-xs font-bold shadow-lg shadow-pink-500/30 transition backdrop-blur-md"
        >
          <span>🎥</span>
          <span>Watch Industrial Video</span>
        </button>
      )}
      {isSymmetry && (
        <button
          onClick={() => setSymmetryMode('video')}
          className="absolute top-3 right-3 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-pink-500/90 hover:bg-pink-400 text-white text-xs font-bold shadow-lg shadow-pink-500/30 transition backdrop-blur-md"
        >
          <span>🎥</span>
          <span>Watch Industrial Video</span>
        </button>
      )}
      {isTotalRunout && (
        <button
          onClick={() => setTotalRunoutMode('video')}
          className="absolute top-3 right-3 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-500/90 hover:bg-orange-400 text-white text-xs font-bold shadow-lg shadow-orange-500/30 transition backdrop-blur-md"
        >
          <span>🎥</span>
          <span>Watch Industrial Video</span>
        </button>
      )}
      <Canvas camera={{ position: [3.5, 2.5, 4.5], fov: 45 }} shadows gl={{ antialias: true }}>
        <ambientLight intensity={0.35} />
        <directionalLight position={[6, 10, 6]} intensity={1.4} castShadow />
        <pointLight position={[-5, 5, -5]} intensity={0.6} color="#14b8a6" />
        <pointLight position={[5, -3, 5]} intensity={0.3} color="#6366f1" />
        <Suspense fallback={null}>
          <GdtModel id={id} />
        </Suspense>
        <OrbitControls makeDefault enablePan enableZoom enableRotate autoRotate={false} />
        <gridHelper args={[10, 20, '#0f2233', '#0a1a28']} />
      </Canvas>
      <div className="absolute top-3 left-3 text-[9px] font-mono text-accent/50 bg-black/60 px-2 py-1 rounded-lg border border-accent/10 backdrop-blur">
        LIVE 3D · DRAG TO ORBIT · SCROLL TO ZOOM
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════
// PRACTICE QUIZ
// ═══════════════════════════════════════════════════
const QUIZ: { q: string; a: boolean; exp: string }[] = [
  { q: 'Flatness requires a datum reference.', a: false, exp: 'FALSE. Flatness is a FORM control. It only controls the surface relative to itself — no datum needed.' },
  { q: 'True position tolerance can be specified as a diametral (Ø) zone.', a: true, exp: 'YES. Position uses a cylindrical (Ø) tolerance zone, which is more mathematically precise than a square zone.' },
  { q: 'Total runout controls only a single cross-section of a rotating part.', a: false, exp: 'FALSE. Total runout controls the ENTIRE surface simultaneously. Circular runout controls single cross-sections.' },
  { q: 'Perpendicularity requires a datum reference.', a: true, exp: 'YES. Perpendicularity is an ORIENTATION control and must reference a datum to define what "90°" means.' },
  { q: 'Cylindricity is a combination of circularity, straightness, and taper control.', a: true, exp: 'YES. Cylindricity is the most comprehensive FORM control for cylindrical surfaces.' },
  { q: 'Concentricity is easy to measure with standard CMM tools.', a: false, exp: 'FALSE. Concentricity requires finding median points of opposed elements — very difficult. Runout is usually used instead.' },
  { q: 'Angularity requires both a datum and a basic angle dimension.', a: true, exp: 'YES. The basic angle must be stated on the drawing and the datum must be identified.' },
  { q: 'Profile of a Surface requires a datum reference.', a: false, exp: 'FALSE. Profile can be used without a datum (bilateral equal tolerance). A datum is needed only when location is also controlled.' },
];

function PracticeQuiz() {
  const [qi, setQi] = useState(0);
  const [answered, setAnswered] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const q = QUIZ[qi];

  const answer = useCallback((choice: boolean) => {
    setAnswered(choice);
    if (choice === q.a) setScore((s) => s + 1);
  }, [q]);

  const next = useCallback(() => {
    if (qi + 1 >= QUIZ.length) setDone(true);
    else { setQi((i) => i + 1); setAnswered(null); }
  }, [qi]);

  const reset = useCallback(() => { setQi(0); setAnswered(null); setScore(0); setDone(false); }, []);

  return (
    <div className="bg-surface border border-border rounded-2xl p-6 space-y-4 max-w-2xl mx-auto">
      {done ? (
        <div className="text-center py-10 space-y-4">
          <div className="text-5xl">🎯</div>
          <div className="text-2xl font-black text-accent">{score} / {QUIZ.length}</div>
          <p className="text-text-secondary">{score >= 6 ? 'Excellent GD&T knowledge!' : score >= 4 ? 'Good — review missed answers.' : 'Keep studying and try again.'}</p>
          <button onClick={reset} className="px-8 py-2.5 rounded-xl bg-accent text-background font-bold hover:bg-accent/90 transition">RETRY</button>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-mono text-text-secondary">Q {qi + 1} / {QUIZ.length}</span>
            <span className="text-[10px] font-mono text-accent">SCORE: {score}</span>
          </div>
          <div className="h-1.5 bg-surface-elevated rounded-full overflow-hidden">
            <div className="h-full bg-accent transition-all duration-300" style={{ width: `${(qi / QUIZ.length) * 100}%` }} />
          </div>
          <div className="bg-surface-elevated border border-border rounded-xl p-4">
            <p className="text-sm font-semibold text-accent">TRUE or FALSE:</p>
            <p className="text-sm text-text-primary mt-1">{q.q}</p>
          </div>
          {answered === null ? (
            <div className="flex gap-3">
              <button onClick={() => answer(true)} className="flex-1 py-3 rounded-xl bg-emerald-600/15 border border-emerald-600/40 text-emerald-400 font-bold text-sm hover:bg-emerald-600/25 transition">TRUE</button>
              <button onClick={() => answer(false)} className="flex-1 py-3 rounded-xl bg-red-600/15 border border-red-600/40 text-red-400 font-bold text-sm hover:bg-red-600/25 transition">FALSE</button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className={`p-4 rounded-xl border ${answered === q.a ? 'bg-emerald-600/10 border-emerald-600/40' : 'bg-red-600/10 border-red-600/40'}`}>
                <div className={`text-sm font-bold mb-1 ${answered === q.a ? 'text-emerald-400' : 'text-red-400'}`}>
                  {answered === q.a ? '✓ CORRECT' : '✗ INCORRECT'}
                </div>
                <p className="text-sm text-text-secondary">{q.exp}</p>
              </div>
              <button onClick={next} className="w-full py-2.5 rounded-xl bg-accent text-background font-bold text-sm hover:bg-accent/90 transition">
                {qi + 1 >= QUIZ.length ? 'SEE RESULTS →' : 'NEXT →'}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════
// FEATURE CONTROL FRAME BUILDER
// ═══════════════════════════════════════════════════
const FCF_SYMS = [
  { sym: '⊕', name: 'Position' }, { sym: '⏥', name: 'Flatness' }, { sym: '⊾', name: 'Perpendicularity' },
  { sym: '∥', name: 'Parallelism' }, { sym: '∠', name: 'Angularity' }, { sym: '↗', name: 'Circ. Runout' },
  { sym: '⇗', name: 'Total Runout' }, { sym: '○', name: 'Circularity' }, { sym: '⌭', name: 'Cylindricity' },
  { sym: '⌒', name: 'Profile Line' }, { sym: '⌓', name: 'Profile Surf.' }, { sym: '◎', name: 'Concentricity' },
  { sym: '⌯', name: 'Symmetry' }, { sym: '⏤', name: 'Straightness' },
];

function FcfBuilder() {
  const [sym, setSym] = useState('⊕');
  const [tol, setTol] = useState('Ø0.05');
  const [datA, setDatA] = useState('A');
  const [datB, setDatB] = useState('B');
  const [datC, setDatC] = useState('C');
  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Live FCF display */}
      <div className="flex justify-center">
        <div className="flex items-stretch border-2 border-accent rounded-lg overflow-hidden font-mono text-xl shadow-xl shadow-accent/10">
          {[
            { val: sym, sub: 'Symbol' },
            { val: tol, sub: 'Tolerance' },
            { val: datA, sub: 'Datum A' },
            { val: datB, sub: 'Datum B' },
            { val: datC, sub: 'Datum C' },
          ].map((cell, i) => (
            <div key={i} className="relative group">
              <div className={`px-5 py-3.5 text-center min-w-[64px] text-text-primary border-l first:border-l-0 border-accent/40 bg-surface group-hover:bg-accent/10 transition-colors`}>
                {cell.val}
              </div>
              <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[8px] font-mono text-text-secondary whitespace-nowrap opacity-0 group-hover:opacity-100 transition">
                {cell.sub}
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Controls */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-8">
        <div className="col-span-2 sm:col-span-1">
          <label className="block text-[10px] font-mono text-text-secondary mb-1.5">GD&T SYMBOL</label>
          <select value={sym} onChange={(e) => setSym(e.target.value)} className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent">
            {FCF_SYMS.map((c) => <option key={c.sym} value={c.sym}>{c.sym} {c.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-[10px] font-mono text-text-secondary mb-1.5">TOLERANCE</label>
          <input value={tol} onChange={(e) => setTol(e.target.value)} className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-sm text-text-primary font-mono focus:outline-none focus:ring-2 focus:ring-accent" />
        </div>
        <div>
          <label className="block text-[10px] font-mono text-text-secondary mb-1.5">DATUM A</label>
          <input value={datA} onChange={(e) => setDatA(e.target.value.toUpperCase())} maxLength={1} className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-sm text-text-primary font-mono focus:outline-none focus:ring-2 focus:ring-accent" />
        </div>
        <div>
          <label className="block text-[10px] font-mono text-text-secondary mb-1.5">DATUM B</label>
          <input value={datB} onChange={(e) => setDatB(e.target.value.toUpperCase())} maxLength={1} className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-sm text-text-primary font-mono focus:outline-none focus:ring-2 focus:ring-accent" />
        </div>
        <div>
          <label className="block text-[10px] font-mono text-text-secondary mb-1.5">DATUM C</label>
          <input value={datC} onChange={(e) => setDatC(e.target.value.toUpperCase())} maxLength={1} className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-sm text-text-primary font-mono focus:outline-none focus:ring-2 focus:ring-accent" />
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════
// VIDEO CARDS
// ═══════════════════════════════════════════════════
const GDT_VIDEOS = [
  { id: 1, title: 'What is GD&T?', desc: 'Introduction — why GD&T exists and what problems it solves vs ± tolerances.', dur: '8 min', tags: ['GD&T definition', 'ISO 1101', 'ASME Y14.5'] },
  { id: 2, title: 'Understanding Datums', desc: 'Datum reference frames, primary/secondary/tertiary datums, the 3-2-1 rule.', dur: '10 min', tags: ['Datum definition', '3-2-1 rule', 'DRF'] },
  { id: 3, title: 'Feature Control Frames', desc: 'How to read and write feature control frames — the language of GD&T.', dur: '9 min', tags: ['FCF structure', 'Modifiers', 'Reading'] },
  { id: 4, title: 'Form Controls', desc: 'Flatness, straightness, circularity, and cylindricity visualized.', dur: '11 min', tags: ['Flatness', 'Circularity', 'Cylindricity'] },
  { id: 5, title: 'Orientation Controls', desc: 'Perpendicularity, parallelism, and angularity explained.', dur: '9 min', tags: ['Perpendicularity', 'Parallelism', 'Angularity'] },
  { id: 6, title: 'Position Tolerance', desc: 'True position, basic dimensions, cylindrical zones, MMC/LMC.', dur: '13 min', tags: ['True position', 'Basic dims', 'MMC/LMC'] },
  { id: 7, title: 'Runout Controls', desc: 'Circular runout vs total runout — rotating parts and datum axes.', dur: '8 min', tags: ['Circular runout', 'Total runout', 'Datum axis'] },
  { id: 8, title: 'Reading a GD&T Drawing', desc: 'Full worked example: reading a complete engineering drawing with multiple callouts.', dur: '15 min', tags: ['Drawing read', 'Stacked callouts', 'Datum precedence'] },
];

// ═══════════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════════
const TABS = [
  { id: 'cards', label: 'Interactive CAD Cards' },
  { id: 'theory', label: 'GD&T Fundamentals Guide' },
  { id: 'studio', label: '3D Symbol Studio' },
  { id: 'lab', label: 'Mechanical Part 3D Lab' },
  { id: 'fcf', label: 'FCF Builder' },
  { id: 'videos', label: 'Video Learning' },
  { id: 'practice', label: 'Practice Quiz' },
];

const CAT_ORDER = ['FORM', 'PROFILE', 'ORIENTATION', 'LOCATION', 'RUNOUT'];

export default function GdtFundamentals() {
  const [activeTab, setActiveTab] = useState('cards');
  const [selectedId, setSelectedId] = useState('flatness');
  const selected = GDT_LIBRARY.find((s) => s.id === selectedId)!;
  const cardData = useMemo(() => {
    return GDT_SYMBOLS_DATA.find((c) => c.id === selectedId) || GDT_SYMBOLS_DATA[0];
  }, [selectedId]);

  const grouped = useMemo(() => {
    const map: Record<string, typeof GDT_LIBRARY> = {};
    for (const cat of CAT_ORDER) map[cat] = GDT_LIBRARY.filter((s) => s.cat === cat);
    return map;
  }, []);

  return (
    <div className="min-h-screen bg-background text-text-primary">
      <Navbar />

      {/* ── HERO ── */}
      <div className="relative overflow-hidden border-b border-border bg-[#040810]">
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: 'linear-gradient(rgba(22,184,166,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(22,184,166,0.05) 1px,transparent 1px)',
          backgroundSize: '28px 28px',
        }} />
        {/* Animated gradient orb */}
        <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-accent/5 blur-3xl pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-6 py-10">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[10px] font-mono text-accent/60 uppercase tracking-widest">Industrial Standards</span>
                <span className="text-text-secondary/30">›</span>
                <span className="text-[10px] font-mono text-accent uppercase tracking-widest">GD&T Fundamentals</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
                GD&T <span className="text-accent">3D SYMBOL LAB</span>
              </h1>
              <p className="text-sm text-text-secondary mt-2 max-w-lg leading-relaxed">
                Every GD&T symbol — animated in real Three.js WebGL. Click any symbol to see its live 3D visualization, tolerance zone, and engineering explanation.
              </p>
              <p className="text-[10px] font-mono text-text-secondary/40 mt-2 italic">
                Educational visualization — verify against applicable engineering drawing & standard for production use.
              </p>
            </div>
            <div className="flex gap-2 flex-wrap">
              {['ISO 1101', 'ASME Y14.5', '14 Symbols', 'Live WebGL', '3D Animated'].map((tag) => (
                <span key={tag} className="text-[10px] font-mono px-2.5 py-1 rounded-full border border-accent/30 text-accent bg-accent/5">{tag}</span>
              ))}
            </div>
          </div>

          {/* Tab navigation */}
          <div className="flex gap-1 mt-8 flex-wrap">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`px-5 py-2 rounded-xl text-xs font-bold tracking-wider border transition ${
                  activeTab === t.id
                    ? 'bg-accent text-background border-accent shadow-lg shadow-accent/20'
                    : 'bg-surface/60 border-border text-text-secondary hover:border-accent/40 hover:text-text-primary'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ══ TAB: INTERACTIVE CAD CARDS (SECTION 14) ══ */}
      {activeTab === 'cards' && (
        <div className="max-w-7xl mx-auto px-4 py-8">
          <GdtCardsSection />
        </div>
      )}

      {/* ══ TAB: GD&T FUNDAMENTALS & THEORY (SECTIONS 1-13) ══ */}
      {activeTab === 'theory' && (
        <div className="max-w-7xl mx-auto px-4 py-8">
          <GdtTheorySection />
        </div>
      )}

      {/* ══ TAB: 3D SYMBOL STUDIO ══ */}
      {activeTab === 'studio' && (
        <div className="max-w-7xl mx-auto px-4 py-8">
          <GdtSymbolStudio />
        </div>
      )}

      {/* ══ TAB: 3D SYMBOL LAB ══ */}
      {activeTab === 'lab' && (
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-5 lg:h-[calc(100vh-13rem)] lg:min-h-[640px]">

            {/* LEFT — Symbol Selector */}
            <aside className="hidden lg:flex flex-col w-56 shrink-0 overflow-y-auto pr-1 space-y-3">
              {CAT_ORDER.map((cat) => {
                const items = grouped[cat];
                const catItem = items[0];
                return (
                  <div key={cat}>
                    <div className="text-[9px] font-mono font-bold tracking-widest px-2 mb-1.5" style={{ color: catItem.catColor }}>
                      {cat}
                    </div>
                    <div className="space-y-1">
                      {items.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => setSelectedId(item.id)}
                          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl border text-left transition group ${
                            selectedId === item.id
                              ? 'border-accent/70 bg-accent/10 shadow-md shadow-accent/10'
                              : 'border-transparent hover:border-border hover:bg-surface'
                          }`}
                        >
                          <span className="text-lg leading-none shrink-0">{item.sym}</span>
                          <span className={`text-[11px] font-semibold leading-tight transition ${selectedId === item.id ? 'text-accent' : 'text-text-secondary group-hover:text-text-primary'}`}>
                            {item.name}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </aside>

            {/* Mobile symbol scroller */}
            <div className="lg:hidden mb-2 flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 w-full">
              {GDT_LIBRARY.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSelectedId(item.id)}
                  className={`shrink-0 flex flex-col items-center px-3 py-2 rounded-xl border text-center transition ${
                    selectedId === item.id ? 'bg-accent/10 border-accent text-accent' : 'bg-surface border-border text-text-secondary'
                  }`}
                >
                  <span className="text-xl">{item.sym}</span>
                  <span className="text-[8px] font-mono mt-0.5 whitespace-nowrap">{item.name}</span>
                </button>
              ))}
            </div>

            {/* CENTER — 3D Viewer / Industrial Simulation Video */}
            <div className="flex-1 min-w-0 flex flex-col gap-4 h-[420px] sm:h-[480px] lg:h-full">
              <Viewer3D key={selectedId} id={selectedId} />
            </div>

            {/* RIGHT — Interactive Cards Notes Panel */}
            <aside className="hidden lg:flex flex-col w-80 xl:w-96 shrink-0 overflow-y-auto pr-1">
              <SymbolCardNotesPanel
                cardData={cardData}
                catColor={selected.catColor}
              />
            </aside>
          </div>

          {/* Mobile interactive cards notes panel (below viewer on smaller screens) */}
          <div className="lg:hidden mt-6">
            <SymbolCardNotesPanel
              cardData={cardData}
              catColor={selected.catColor}
            />
          </div>
        </div>
      )}

      {/* ══ TAB: FCF BUILDER ══ */}
      {activeTab === 'fcf' && (
        <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
          <div>
            <h2 className="text-2xl font-black text-text-primary">FEATURE CONTROL FRAME BUILDER</h2>
            <p className="text-sm text-text-secondary mt-2">
              A Feature Control Frame (FCF) is the universal language of GD&T. Every GD&T callout on an engineering drawing is written in this format. Build one interactively below.
            </p>
          </div>
          <div className="bg-surface border border-border rounded-2xl p-6">
            <FcfBuilder />
          </div>
          <div className="bg-surface-elevated border border-border rounded-2xl p-5 text-sm text-text-secondary space-y-2">
            <h4 className="text-xs font-mono font-bold text-accent tracking-widest">FCF READING GUIDE</h4>
            <ul className="list-disc ml-5 space-y-1 text-xs leading-relaxed">
              <li><strong className="text-text-primary">Cell 1 — Symbol:</strong> The geometric characteristic being controlled (e.g., ⊕ Position)</li>
              <li><strong className="text-text-primary">Cell 2 — Tolerance:</strong> The tolerance value with optional Ø for cylindrical zone</li>
              <li><strong className="text-text-primary">Cells 3–5 — Datums:</strong> Reference datums in order of precedence (primary, secondary, tertiary)</li>
            </ul>
          </div>
        </div>
      )}

      {/* ══ TAB: VIDEO LEARNING ══ */}
      {activeTab === 'videos' && (
        <div className="max-w-7xl mx-auto px-4 py-10 space-y-6">
          <div>
            <h2 className="text-2xl font-black text-text-primary">VIDEO LEARNING</h2>
            <p className="text-sm text-text-secondary mt-1">8 comprehensive lessons covering GD&T fundamentals (ISO 1101 / ASME Y14.5).</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {GDT_VIDEOS.map((v) => (
              <div key={v.id} className="bg-surface border border-border rounded-2xl overflow-hidden hover:border-accent/40 transition group">
                <div className="bg-[#040810] h-32 flex flex-col items-center justify-center gap-2 border-b border-border relative">
                  <div className="w-12 h-12 rounded-full bg-accent/10 border border-accent/30 flex items-center justify-center text-accent text-lg group-hover:bg-accent/20 transition">▶</div>
                  <span className="text-[9px] font-mono text-text-secondary/60">Video source will be added.</span>
                  <span className="absolute top-2 right-2 text-[9px] font-mono px-2 py-0.5 rounded bg-surface border border-border text-text-secondary">{v.dur}</span>
                  <span className="absolute top-2 left-2 text-[9px] font-mono text-accent/60">VIDEO {String(v.id).padStart(2, '0')}</span>
                </div>
                <div className="p-3 space-y-2">
                  <h4 className="text-sm font-bold text-text-primary group-hover:text-accent transition leading-tight">{v.title}</h4>
                  <p className="text-[11px] text-text-secondary leading-relaxed">{v.desc}</p>
                  <div className="flex flex-wrap gap-1">
                    {v.tags.map((t) => (
                      <span key={t} className="text-[8px] font-mono px-1.5 py-0.5 rounded bg-accent/10 text-accent border border-accent/20">{t}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ══ TAB: PRACTICE ══ */}
      {activeTab === 'practice' && (
        <div className="max-w-4xl mx-auto px-4 py-12 space-y-6">
          <div>
            <h2 className="text-2xl font-black text-text-primary">PRACTICE QUIZ</h2>
            <p className="text-sm text-text-secondary mt-1">8 questions covering all GD&T categories — Form, Profile, Orientation, Location, and Runout.</p>
          </div>
          <PracticeQuiz />
        </div>
      )}
    </div>
  );
}
