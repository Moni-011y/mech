import { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Line, Float, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import FlatnessVideoPlayer from './FlatnessVideoPlayer';
import CircularityVideoPlayer from './CircularityVideoPlayer';
import CylindricityVideoPlayer from './CylindricityVideoPlayer';
import StraightnessVideoPlayer from './StraightnessVideoPlayer';
import ProfileLineVideoPlayer from './ProfileLineVideoPlayer';
import ProfileSurfaceVideoPlayer from './ProfileSurfaceVideoPlayer';
import PerpendicularityVideoPlayer from './PerpendicularityVideoPlayer';
import ParallelismVideoPlayer from './ParallelismVideoPlayer';
import AngularityVideoPlayer from './AngularityVideoPlayer';
import PositionVideoPlayer from './PositionVideoPlayer';
import ConcentricityVideoPlayer from './ConcentricityVideoPlayer';
import SymmetryVideoPlayer from './SymmetryVideoPlayer';
import CircularRunoutVideoPlayer from './CircularRunoutVideoPlayer';
import TotalRunoutVideoPlayer from './TotalRunoutVideoPlayer';

export type MaterialPreset = 'titanium' | 'gold' | 'chrome' | 'neon' | 'cobalt';

interface Gdt3dSymbolCanvasProps {
  symbolId: string;
  materialPreset?: MaterialPreset;
  autoRotate?: boolean;
  showToleranceZone?: boolean;
  showExploded?: boolean;
  rotationSpeed?: number;
  className?: string;
}

// ═══════════════════════════════════════════════════
// MATERIAL PRESETS FACTORY
// ═══════════════════════════════════════════════════
function useSymbolMaterial(preset: MaterialPreset = 'titanium') {
  return useMemo(() => {
    switch (preset) {
      case 'gold':
        return new THREE.MeshStandardMaterial({
          color: '#f59e0b',
          metalness: 0.9,
          roughness: 0.15,
          emissive: '#78350f',
          emissiveIntensity: 0.15,
        });
      case 'chrome':
        return new THREE.MeshStandardMaterial({
          color: '#e2e8f0',
          metalness: 0.95,
          roughness: 0.05,
          emissive: '#334155',
          emissiveIntensity: 0.1,
        });
      case 'neon':
        return new THREE.MeshPhysicalMaterial({
          color: '#06b6d4',
          transmission: 0.6,
          opacity: 0.9,
          transparent: true,
          roughness: 0.1,
          ior: 1.5,
          thickness: 0.5,
        });
      case 'cobalt':
        return new THREE.MeshStandardMaterial({
          color: '#3b82f6',
          metalness: 0.85,
          roughness: 0.2,
          emissive: '#1e3a8a',
          emissiveIntensity: 0.2,
        });
      case 'titanium':
      default:
        return new THREE.MeshStandardMaterial({
          color: '#0284c7',
          metalness: 0.8,
          roughness: 0.25,
          emissive: '#0c4a6e',
          emissiveIntensity: 0.15,
        });
    }
  }, [preset]);
}

// ═══════════════════════════════════════════════════
// INDIVIDUAL 3D SYMBOL GEOMETRIES
// ═══════════════════════════════════════════════════

// 1. POSITION (⊕ / ⌖)
function PositionSymbol3D({ mat, showZone }: { mat: THREE.Material; showZone: boolean }) {
  const groupRef = useRef<THREE.Group>(null!);
  const laserRef = useRef<THREE.Mesh>(null!);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (groupRef.current) groupRef.current.rotation.y = Math.sin(t * 0.5) * 0.25;
    if (laserRef.current) laserRef.current.rotation.z = t * 1.5;
  });

  return (
    <group ref={groupRef}>
      {/* Outer Extruded Ring */}
      <mesh material={mat} castShadow receiveShadow>
        <torusGeometry args={[1.2, 0.18, 24, 64]} />
      </mesh>
      {/* Horizontal Crosshair Bar */}
      <mesh material={mat} position={[0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[3.2, 0.22, 0.22]} />
      </mesh>
      {/* Vertical Crosshair Bar */}
      <mesh material={mat} position={[0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.22, 3.2, 0.22]} />
      </mesh>
      {/* Center Target Sphere */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.35, 32, 32]} />
        <meshStandardMaterial color="#38bdf8" emissive="#0284c7" emissiveIntensity={0.8} />
      </mesh>

      {/* Tolerance Zone Cylinder & Laser */}
      {showZone && (
        <group position={[0, 0, -0.5]}>
          <mesh>
            <cylinderGeometry args={[0.8, 0.8, 2.8, 32, 1, true]} />
            <meshStandardMaterial color="#06b6d4" transparent opacity={0.25} wireframe side={THREE.DoubleSide} />
          </mesh>
          <mesh ref={laserRef} position={[0, 0, 0]}>
            <boxGeometry args={[1.4, 0.04, 2.6]} />
            <meshStandardMaterial color="#38bdf8" transparent opacity={0.4} />
          </mesh>
        </group>
      )}
    </group>
  );
}

// 2. FLATNESS (⏥)
function FlatnessSymbol3D({ mat, showZone }: { mat: THREE.Material; showZone: boolean }) {
  const groupRef = useRef<THREE.Group>(null!);

  const shape = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(-1.4, -0.7);
    s.lineTo(0.7, -0.7);
    s.lineTo(1.4, 0.7);
    s.lineTo(-0.7, 0.7);
    s.closePath();
    return s;
  }, []);

  const extrudeSettings = useMemo(
    () => ({
      depth: 0.3,
      bevelEnabled: true,
      bevelSegments: 4,
      steps: 1,
      bevelSize: 0.05,
      bevelThickness: 0.05,
    }),
    []
  );

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(clock.elapsedTime * 1.2) * 0.1;
      groupRef.current.rotation.y = Math.cos(clock.elapsedTime * 0.4) * 0.2;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh material={mat} castShadow receiveShadow position={[0, 0, -0.15]}>
        <extrudeGeometry args={[shape, extrudeSettings]} />
      </mesh>

      {showZone && (
        <group>
          {/* Top Tolerance Plane */}
          <mesh position={[0, 0.8, 0]} rotation={[Math.PI / 6, 0, 0]}>
            <planeGeometry args={[3.2, 1.8]} />
            <meshStandardMaterial color="#10b981" transparent opacity={0.3} side={THREE.DoubleSide} />
          </mesh>
          {/* Bottom Tolerance Plane */}
          <mesh position={[0, -0.8, 0]} rotation={[Math.PI / 6, 0, 0]}>
            <planeGeometry args={[3.2, 1.8]} />
            <meshStandardMaterial color="#10b981" transparent opacity={0.3} side={THREE.DoubleSide} />
          </mesh>
          <Line points={[[-1.4, 0.8, 0], [1.4, 0.8, 0]]} color="#10b981" lineWidth={3} />
          <Line points={[[-1.4, -0.8, 0], [1.4, -0.8, 0]]} color="#10b981" lineWidth={3} />
        </group>
      )}
    </group>
  );
}

// 3. PERPENDICULARITY (⊾ / ⟂)
function PerpendicularitySymbol3D({ mat, showZone }: { mat: THREE.Material; showZone: boolean }) {
  const groupRef = useRef<THREE.Group>(null!);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(clock.elapsedTime * 0.6) * 0.3;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Base Horizontal Bar */}
      <mesh material={mat} position={[0, -1.1, 0]} castShadow receiveShadow>
        <boxGeometry args={[3.0, 0.35, 0.35]} />
      </mesh>
      {/* Vertical Bar */}
      <mesh material={mat} position={[0, 0.3, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.35, 2.5, 0.35]} />
      </mesh>
      {/* 90 Degree Angle Arc */}
      <mesh position={[0.4, -0.7, 0]} rotation={[0, 0, 0]}>
        <torusGeometry args={[0.45, 0.04, 16, 32, Math.PI / 2]} />
        <meshStandardMaterial color="#f59e0b" emissive="#f59e0b" emissiveIntensity={0.6} />
      </mesh>

      {showZone && (
        <group position={[0, 0, -0.4]}>
          <mesh position={[0, 0.3, 0]}>
            <cylinderGeometry args={[0.65, 0.65, 2.8, 32, 1, true]} />
            <meshStandardMaterial color="#f59e0b" transparent opacity={0.25} wireframe side={THREE.DoubleSide} />
          </mesh>
          {/* Datum Plane Reference */}
          <mesh position={[0, -1.3, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <planeGeometry args={[3.6, 2.0]} />
            <meshStandardMaterial color="#64748b" transparent opacity={0.4} side={THREE.DoubleSide} />
          </mesh>
        </group>
      )}
    </group>
  );
}

// 4. PARALLELISM (∥ / ⫽)
function ParallelismSymbol3D({ mat, showZone }: { mat: THREE.Material; showZone: boolean }) {
  const groupRef = useRef<THREE.Group>(null!);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(clock.elapsedTime * 0.7) * 0.25;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Left Slanted Bar */}
      <mesh material={mat} position={[-0.65, 0, 0]} rotation={[0, 0, Math.PI / 6]} castShadow receiveShadow>
        <boxGeometry args={[0.32, 3.0, 0.32]} />
      </mesh>
      {/* Right Slanted Bar */}
      <mesh material={mat} position={[0.65, 0, 0]} rotation={[0, 0, Math.PI / 6]} castShadow receiveShadow>
        <boxGeometry args={[0.32, 3.0, 0.32]} />
      </mesh>

      {showZone && (
        <group>
          {/* Parallel laser vectors */}
          <Line points={[[-0.65, 0.8, 0.2], [0.65, 0.8, 0.2]]} color="#f59e0b" lineWidth={3} dashed dashScale={10} />
          <Line points={[[-0.65, 0, 0.2], [0.65, 0, 0.2]]} color="#f59e0b" lineWidth={3} dashed dashScale={10} />
          <Line points={[[-0.65, -0.8, 0.2], [0.65, -0.8, 0.2]]} color="#f59e0b" lineWidth={3} dashed dashScale={10} />
        </group>
      )}
    </group>
  );
}

// 5. CYLINDRICITY (⌭)
function CylindricitySymbol3D({ mat, showZone }: { mat: THREE.Material; showZone: boolean }) {
  const groupRef = useRef<THREE.Group>(null!);
  const innerRef = useRef<THREE.Mesh>(null!);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (groupRef.current) groupRef.current.rotation.y = t * 0.4;
    if (innerRef.current) innerRef.current.rotation.y = -t * 0.8;
  });

  return (
    <group ref={groupRef}>
      {/* Outer Ring */}
      <mesh material={mat} castShadow receiveShadow>
        <torusGeometry args={[1.1, 0.18, 24, 64]} />
      </mesh>
      {/* Tangent Line Left */}
      <mesh material={mat} position={[-1.1, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.2, 2.8, 0.2]} />
      </mesh>
      {/* Tangent Line Right */}
      <mesh material={mat} position={[1.1, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.2, 2.8, 0.2]} />
      </mesh>

      {/* Internal Rotating Coaxial Cylinder */}
      <mesh ref={innerRef} position={[0, 0, 0]}>
        <cylinderGeometry args={[0.65, 0.65, 2.4, 32]} />
        <meshStandardMaterial color="#06b6d4" metalness={0.9} roughness={0.15} />
      </mesh>

      {showZone && (
        <group>
          <mesh>
            <cylinderGeometry args={[0.85, 0.85, 2.6, 32, 1, true]} />
            <meshStandardMaterial color="#06b6d4" transparent opacity={0.2} wireframe side={THREE.DoubleSide} />
          </mesh>
        </group>
      )}
    </group>
  );
}

// 6. CIRCULARITY (○)
function CircularitySymbol3D({ mat, showZone }: { mat: THREE.Material; showZone: boolean }) {
  const groupRef = useRef<THREE.Group>(null!);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.z = Math.sin(clock.elapsedTime * 0.8) * 0.2;
      groupRef.current.rotation.y = Math.cos(clock.elapsedTime * 0.5) * 0.3;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh material={mat} castShadow receiveShadow>
        <torusGeometry args={[1.3, 0.22, 32, 64]} />
      </mesh>

      {showZone && (
        <group>
          {/* Inner Tolerance Ring */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[1.05, 0.02, 16, 64]} />
            <meshStandardMaterial color="#10b981" emissive="#10b981" emissiveIntensity={0.5} />
          </mesh>
          {/* Outer Tolerance Ring */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[1.55, 0.02, 16, 64]} />
            <meshStandardMaterial color="#10b981" emissive="#10b981" emissiveIntensity={0.5} />
          </mesh>
        </group>
      )}
    </group>
  );
}

// 7. STRAIGHTNESS (⏤)
function StraightnessSymbol3D({ mat, showZone }: { mat: THREE.Material; showZone: boolean }) {
  const groupRef = useRef<THREE.Group>(null!);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(clock.elapsedTime * 0.5) * 0.3;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh material={mat} castShadow receiveShadow>
        <boxGeometry args={[3.2, 0.32, 0.32]} />
      </mesh>

      {showZone && (
        <group>
          <Line points={[[-1.8, 0.45, 0], [1.8, 0.45, 0]]} color="#06b6d4" lineWidth={3} dashed dashScale={12} />
          <Line points={[[-1.8, -0.45, 0], [1.8, -0.45, 0]]} color="#06b6d4" lineWidth={3} dashed dashScale={12} />
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.45, 0.45, 3.4, 32, 1, true]} />
            <meshStandardMaterial color="#06b6d4" transparent opacity={0.2} wireframe side={THREE.DoubleSide} />
          </mesh>
        </group>
      )}
    </group>
  );
}

// 8. PROFILE OF SURFACE (⌓)
function ProfileSurfaceSymbol3D({ mat, showZone }: { mat: THREE.Material; showZone: boolean }) {
  const groupRef = useRef<THREE.Group>(null!);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(clock.elapsedTime * 0.6) * 0.25;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Outer Semi-Circle Arc */}
      <mesh material={mat} position={[0, 0.2, 0]} castShadow receiveShadow>
        <torusGeometry args={[1.2, 0.18, 24, 64, Math.PI]} />
      </mesh>
      {/* Bottom Flat Base */}
      <mesh material={mat} position={[0, 0.2, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.58, 0.22, 0.22]} />
      </mesh>

      {showZone && (
        <group position={[0, -0.8, 0]}>
          {/* Surface Shell */}
          <mesh rotation={[-Math.PI / 4, 0, 0]}>
            <sphereGeometry args={[1.5, 32, 16, 0, Math.PI, 0, Math.PI / 2]} />
            <meshStandardMaterial color="#6366f1" transparent opacity={0.3} side={THREE.DoubleSide} />
          </mesh>
        </group>
      )}
    </group>
  );
}

// 9. PROFILE OF LINE (⌒)
function ProfileLineSymbol3D({ mat }: { mat: THREE.Material }) {
  const groupRef = useRef<THREE.Group>(null!);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(clock.elapsedTime * 1.5) * 0.08;
      groupRef.current.rotation.y = Math.sin(clock.elapsedTime * 0.7) * 0.25;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh material={mat} castShadow receiveShadow position={[0, -0.4, 0]}>
        <torusGeometry args={[1.3, 0.22, 24, 64, Math.PI]} />
      </mesh>
    </group>
  );
}

// 10. ANGULARITY (∠)
function AngularitySymbol3D({ mat, showZone }: { mat: THREE.Material; showZone: boolean }) {
  const groupRef = useRef<THREE.Group>(null!);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(clock.elapsedTime * 0.6) * 0.3;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Base Bar */}
      <mesh material={mat} position={[0, -0.9, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.8, 0.3, 0.3]} />
      </mesh>
      {/* Inclined Bar */}
      <mesh material={mat} position={[0, 0.2, 0]} rotation={[0, 0, Math.PI / 4]} castShadow receiveShadow>
        <boxGeometry args={[2.8, 0.3, 0.3]} />
      </mesh>

      {showZone && (
        <group position={[0.3, -0.5, 0]}>
          <mesh>
            <torusGeometry args={[0.8, 0.03, 16, 32, Math.PI / 4]} />
            <meshStandardMaterial color="#f59e0b" emissive="#f59e0b" emissiveIntensity={0.8} />
          </mesh>
        </group>
      )}
    </group>
  );
}

// 11. CONCENTRICITY (◎)
function ConcentricitySymbol3D({ mat, showZone }: { mat: THREE.Material; showZone: boolean }) {
  const groupRef = useRef<THREE.Group>(null!);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (groupRef.current) groupRef.current.rotation.y = t * 0.5;
  });

  return (
    <group ref={groupRef}>
      {/* Outer Torus */}
      <mesh material={mat} castShadow receiveShadow>
        <torusGeometry args={[1.4, 0.18, 24, 64]} />
      </mesh>
      {/* Inner Concentric Torus */}
      <mesh material={mat} castShadow receiveShadow>
        <torusGeometry args={[0.7, 0.18, 24, 64]} />
      </mesh>

      {showZone && (
        <group>
          <mesh>
            <sphereGeometry args={[0.25, 32, 32]} />
            <meshStandardMaterial color="#ec4899" emissive="#ec4899" emissiveIntensity={0.8} />
          </mesh>
        </group>
      )}
    </group>
  );
}

// 12. SYMMETRY (⌯)
function SymmetrySymbol3D({ mat, showZone }: { mat: THREE.Material; showZone: boolean }) {
  const groupRef = useRef<THREE.Group>(null!);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(clock.elapsedTime * 0.6) * 0.3;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Top Bar */}
      <mesh material={mat} position={[0, 0.9, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.5, 0.25, 0.25]} />
      </mesh>
      {/* Center Bar */}
      <mesh material={mat} position={[0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[3.2, 0.3, 0.3]} />
      </mesh>
      {/* Bottom Bar */}
      <mesh material={mat} position={[0, -0.9, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.5, 0.25, 0.25]} />
      </mesh>

      {showZone && (
        <group>
          <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <planeGeometry args={[3.4, 2.0]} />
            <meshStandardMaterial color="#ec4899" transparent opacity={0.25} side={THREE.DoubleSide} />
          </mesh>
        </group>
      )}
    </group>
  );
}

// 13. CIRCULAR RUNOUT (↗)
function CircularRunoutSymbol3D({ mat, showZone }: { mat: THREE.Material; showZone: boolean }) {
  const groupRef = useRef<THREE.Group>(null!);
  const arrowRef = useRef<THREE.Group>(null!);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (groupRef.current) groupRef.current.rotation.y = Math.sin(t * 0.5) * 0.2;
    if (arrowRef.current) arrowRef.current.position.y = Math.sin(t * 2) * 0.08;
  });

  return (
    <group ref={groupRef}>
      <group ref={arrowRef}>
        {/* Shaft of Arrow */}
        <mesh material={mat} position={[-0.3, -0.3, 0]} rotation={[0, 0, Math.PI / 4]} castShadow receiveShadow>
          <boxGeometry args={[0.25, 2.4, 0.25]} />
        </mesh>
        {/* Arrowhead Cone */}
        <mesh material={mat} position={[0.55, 0.55, 0]} rotation={[0, 0, -Math.PI / 4]} castShadow receiveShadow>
          <coneGeometry args={[0.45, 0.9, 32]} />
        </mesh>
      </group>

      {showZone && (
        <group position={[0, -1.2, 0]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[1.2, 0.05, 16, 64]} />
            <meshStandardMaterial color="#f97316" emissive="#f97316" emissiveIntensity={0.6} />
          </mesh>
        </group>
      )}
    </group>
  );
}

// 14. TOTAL RUNOUT (⇗)
function TotalRunoutSymbol3D({ mat, showZone }: { mat: THREE.Material; showZone: boolean }) {
  const groupRef = useRef<THREE.Group>(null!);
  const arrowsRef = useRef<THREE.Group>(null!);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (groupRef.current) groupRef.current.rotation.y = Math.sin(t * 0.5) * 0.2;
    if (arrowsRef.current) arrowsRef.current.position.x = Math.sin(t * 1.5) * 0.3;
  });

  return (
    <group ref={groupRef}>
      <group ref={arrowsRef}>
        {/* Arrow 1 */}
        <group position={[-0.4, 0, 0]}>
          <mesh material={mat} position={[-0.3, -0.3, 0]} rotation={[0, 0, Math.PI / 4]} castShadow receiveShadow>
            <boxGeometry args={[0.2, 2.2, 0.2]} />
          </mesh>
          <mesh material={mat} position={[0.45, 0.45, 0]} rotation={[0, 0, -Math.PI / 4]} castShadow receiveShadow>
            <coneGeometry args={[0.35, 0.75, 32]} />
          </mesh>
        </group>
        {/* Arrow 2 */}
        <group position={[0.4, 0, 0]}>
          <mesh material={mat} position={[-0.3, -0.3, 0]} rotation={[0, 0, Math.PI / 4]} castShadow receiveShadow>
            <boxGeometry args={[0.2, 2.2, 0.2]} />
          </mesh>
          <mesh material={mat} position={[0.45, 0.45, 0]} rotation={[0, 0, -Math.PI / 4]} castShadow receiveShadow>
            <coneGeometry args={[0.35, 0.75, 32]} />
          </mesh>
        </group>
      </group>

      {showZone && (
        <group position={[0, -1.2, 0]}>
          <mesh>
            <cylinderGeometry args={[1.2, 1.2, 1.5, 32, 1, true]} />
            <meshStandardMaterial color="#f97316" transparent opacity={0.25} wireframe side={THREE.DoubleSide} />
          </mesh>
        </group>
      )}
    </group>
  );
}

// MODIFIER: MMC (Ⓜ)
function MmcSymbol3D({ mat }: { mat: THREE.Material }) {
  const groupRef = useRef<THREE.Group>(null!);

  useFrame(({ clock }) => {
    if (groupRef.current) groupRef.current.rotation.y = clock.elapsedTime * 0.6;
  });

  return (
    <group ref={groupRef}>
      {/* Circle Badge */}
      <mesh material={mat} castShadow receiveShadow>
        <torusGeometry args={[1.1, 0.18, 24, 64]} />
      </mesh>
      <Text position={[0, 0, 0.1]} fontSize={1.2} color="#ffffff" font={undefined}>
        M
      </Text>
    </group>
  );
}

// MODIFIER: LMC (Ⓛ)
function LmcSymbol3D({ mat }: { mat: THREE.Material }) {
  const groupRef = useRef<THREE.Group>(null!);

  useFrame(({ clock }) => {
    if (groupRef.current) groupRef.current.rotation.y = clock.elapsedTime * 0.6;
  });

  return (
    <group ref={groupRef}>
      <mesh material={mat} castShadow receiveShadow>
        <torusGeometry args={[1.1, 0.18, 24, 64]} />
      </mesh>
      <Text position={[0, 0, 0.1]} fontSize={1.2} color="#ffffff" font={undefined}>
        L
      </Text>
    </group>
  );
}

// ═══════════════════════════════════════════════════
// MAIN ROUTER ROUTINE FOR 3D SYMBOLS
// ═══════════════════════════════════════════════════
function SymbolSelector3D({
  symbolId,
  mat,
  showZone,
}: {
  symbolId: string;
  mat: THREE.Material;
  showZone: boolean;
}) {
  const normalized = symbolId.toLowerCase();

  switch (normalized) {
    case 'position':
      return <PositionSymbol3D mat={mat} showZone={showZone} />;
    case 'flatness':
      return <FlatnessSymbol3D mat={mat} showZone={showZone} />;
    case 'perpendicularity':
      return <PerpendicularitySymbol3D mat={mat} showZone={showZone} />;
    case 'parallelism':
      return <ParallelismSymbol3D mat={mat} showZone={showZone} />;
    case 'cylindricity':
      return <CylindricitySymbol3D mat={mat} showZone={showZone} />;
    case 'circularity':
      return <CircularitySymbol3D mat={mat} showZone={showZone} />;
    case 'straightness':
      return <StraightnessSymbol3D mat={mat} showZone={showZone} />;
    case 'profile-surface':
    case 'profile of a surface':
      return <ProfileSurfaceSymbol3D mat={mat} showZone={showZone} />;
    case 'profile-line':
    case 'profile of a line':
      return <ProfileLineSymbol3D mat={mat} />;
    case 'angularity':
      return <AngularitySymbol3D mat={mat} showZone={showZone} />;
    case 'concentricity':
      return <ConcentricitySymbol3D mat={mat} showZone={showZone} />;
    case 'symmetry':
      return <SymmetrySymbol3D mat={mat} showZone={showZone} />;
    case 'circular-runout':
    case 'circular runout':
      return <CircularRunoutSymbol3D mat={mat} showZone={showZone} />;
    case 'total-runout':
    case 'total runout':
      return <TotalRunoutSymbol3D mat={mat} showZone={showZone} />;
    case 'mmc':
      return <MmcSymbol3D mat={mat} />;
    case 'lmc':
      return <LmcSymbol3D mat={mat} />;
    default:
      return <PositionSymbol3D mat={mat} showZone={showZone} />;
  }
}

// ═══════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════
export default function Gdt3dSymbolCanvas({
  symbolId,
  materialPreset = 'titanium',
  autoRotate = true,
  showToleranceZone = true,
  rotationSpeed = 1.0,
  className = 'w-full h-64 md:h-80',
}: Gdt3dSymbolCanvasProps) {
  const mat = useSymbolMaterial(materialPreset);
  const isFlatness = symbolId.toLowerCase() === 'flatness';
  const isCircularity = symbolId.toLowerCase() === 'circularity';
  const isCylindricity = symbolId.toLowerCase() === 'cylindricity';
  const isStraightness = symbolId.toLowerCase() === 'straightness';
  const isProfileLine =
    symbolId.toLowerCase() === 'profile-line' ||
    symbolId.toLowerCase() === 'profile of a line' ||
    symbolId.toLowerCase() === 'profile_of_a_line' ||
    symbolId.toLowerCase() === 'profile-of-a-line';
  const isProfileSurface =
    symbolId.toLowerCase() === 'profile-surface' ||
    symbolId.toLowerCase() === 'profile of a surface' ||
    symbolId.toLowerCase() === 'profile_of_a_surface' ||
    symbolId.toLowerCase() === 'profile-of-a-surface';
  const isPerpendicularity = symbolId.toLowerCase() === 'perpendicularity';
  const isParallelism = symbolId.toLowerCase() === 'parallelism';
  const isAngularity = symbolId.toLowerCase() === 'angularity';
  const isPosition =
    symbolId.toLowerCase() === 'position' ||
    symbolId.toLowerCase() === 'true-position' ||
    symbolId.toLowerCase() === 'true position';
  const isConcentricity = symbolId.toLowerCase() === 'concentricity';
  const isSymmetry = symbolId.toLowerCase() === 'symmetry';
  const isCircularRunout =
    symbolId.toLowerCase() === 'circular-runout' ||
    symbolId.toLowerCase() === 'circular runout';
  const isTotalRunout =
    symbolId.toLowerCase() === 'total-runout' ||
    symbolId.toLowerCase() === 'total runout';
  const [flatnessDisplayMode, setFlatnessDisplayMode] = useState<'video' | '3d'>('video');
  const [circularityDisplayMode, setCircularityDisplayMode] = useState<'video' | '3d'>('video');
  const [cylindricityDisplayMode, setCylindricityDisplayMode] = useState<'video' | '3d'>('video');
  const [straightnessDisplayMode, setStraightnessDisplayMode] = useState<'video' | '3d'>('video');
  const [profileLineDisplayMode, setProfileLineDisplayMode] = useState<'video' | '3d'>('video');
  const [profileSurfaceDisplayMode, setProfileSurfaceDisplayMode] = useState<'video' | '3d'>('video');
  const [perpendicularityDisplayMode, setPerpendicularityDisplayMode] = useState<'video' | '3d'>('video');
  const [parallelismDisplayMode, setParallelismDisplayMode] = useState<'video' | '3d'>('video');
  const [angularityDisplayMode, setAngularityDisplayMode] = useState<'video' | '3d'>('video');
  const [positionDisplayMode, setPositionDisplayMode] = useState<'video' | '3d'>('video');
  const [concentricityDisplayMode, setConcentricityDisplayMode] = useState<'video' | '3d'>('video');
  const [symmetryDisplayMode, setSymmetryDisplayMode] = useState<'video' | '3d'>('video');
  const [circularRunoutDisplayMode, setCircularRunoutDisplayMode] = useState<'video' | '3d'>('video');
  const [totalRunoutDisplayMode, setTotalRunoutDisplayMode] = useState<'video' | '3d'>('video');

  useEffect(() => {
    if (isFlatness) {
      setFlatnessDisplayMode('video');
    }
  }, [symbolId, isFlatness]);

  useEffect(() => {
    if (isCircularity) {
      setCircularityDisplayMode('video');
    }
  }, [symbolId, isCircularity]);

  useEffect(() => {
    if (isCylindricity) {
      setCylindricityDisplayMode('video');
    }
  }, [symbolId, isCylindricity]);

  useEffect(() => {
    if (isStraightness) {
      setStraightnessDisplayMode('video');
    }
  }, [symbolId, isStraightness]);

  useEffect(() => {
    if (isProfileLine) {
      setProfileLineDisplayMode('video');
    }
  }, [symbolId, isProfileLine]);

  useEffect(() => {
    if (isProfileSurface) {
      setProfileSurfaceDisplayMode('video');
    }
  }, [symbolId, isProfileSurface]);

  useEffect(() => {
    if (isPerpendicularity) {
      setPerpendicularityDisplayMode('video');
    }
  }, [symbolId, isPerpendicularity]);

  useEffect(() => {
    if (isParallelism) {
      setParallelismDisplayMode('video');
    }
  }, [symbolId, isParallelism]);

  useEffect(() => {
    if (isAngularity) {
      setAngularityDisplayMode('video');
    }
  }, [symbolId, isAngularity]);

  useEffect(() => {
    if (isPosition) {
      setPositionDisplayMode('video');
    }
  }, [symbolId, isPosition]);

  useEffect(() => {
    if (isConcentricity) {
      setConcentricityDisplayMode('video');
    }
  }, [symbolId, isConcentricity]);

  useEffect(() => {
    if (isSymmetry) {
      setSymmetryDisplayMode('video');
    }
  }, [symbolId, isSymmetry]);

  useEffect(() => {
    if (isCircularRunout) {
      setCircularRunoutDisplayMode('video');
    }
  }, [symbolId, isCircularRunout]);

  useEffect(() => {
    if (isTotalRunout) {
      setTotalRunoutDisplayMode('video');
    }
  }, [symbolId, isTotalRunout]);

  if (isCircularRunout && circularRunoutDisplayMode === 'video') {
    return (
      <CircularRunoutVideoPlayer
        className={className}
        onSwitchTo3d={() => setCircularRunoutDisplayMode('3d')}
        show3dToggle={true}
      />
    );
  }

  if (isTotalRunout && totalRunoutDisplayMode === 'video') {
    return (
      <TotalRunoutVideoPlayer
        className={className}
        onSwitchTo3d={() => setTotalRunoutDisplayMode('3d')}
        show3dToggle={true}
      />
    );
  }

  if (isFlatness && flatnessDisplayMode === 'video') {
    return (
      <FlatnessVideoPlayer
        className={className}
        onSwitchTo3d={() => setFlatnessDisplayMode('3d')}
        show3dToggle={true}
      />
    );
  }

  if (isCircularity && circularityDisplayMode === 'video') {
    return (
      <CircularityVideoPlayer
        className={className}
        onSwitchTo3d={() => setCircularityDisplayMode('3d')}
        show3dToggle={true}
      />
    );
  }

  if (isCylindricity && cylindricityDisplayMode === 'video') {
    return (
      <CylindricityVideoPlayer
        className={className}
        onSwitchTo3d={() => setCylindricityDisplayMode('3d')}
        show3dToggle={true}
      />
    );
  }

  if (isStraightness && straightnessDisplayMode === 'video') {
    return (
      <StraightnessVideoPlayer
        className={className}
        onSwitchTo3d={() => setStraightnessDisplayMode('3d')}
        show3dToggle={true}
      />
    );
  }

  if (isProfileLine && profileLineDisplayMode === 'video') {
    return (
      <ProfileLineVideoPlayer
        className={className}
        onSwitchTo3d={() => setProfileLineDisplayMode('3d')}
        show3dToggle={true}
      />
    );
  }

  if (isProfileSurface && profileSurfaceDisplayMode === 'video') {
    return (
      <ProfileSurfaceVideoPlayer
        className={className}
        onSwitchTo3d={() => setProfileSurfaceDisplayMode('3d')}
        show3dToggle={true}
      />
    );
  }

  if (isPerpendicularity && perpendicularityDisplayMode === 'video') {
    return (
      <PerpendicularityVideoPlayer
        className={className}
        onSwitchTo3d={() => setPerpendicularityDisplayMode('3d')}
        show3dToggle={true}
      />
    );
  }

  if (isParallelism && parallelismDisplayMode === 'video') {
    return (
      <ParallelismVideoPlayer
        className={className}
        onSwitchTo3d={() => setParallelismDisplayMode('3d')}
        show3dToggle={true}
      />
    );
  }

  if (isAngularity && angularityDisplayMode === 'video') {
    return (
      <AngularityVideoPlayer
        className={className}
        onSwitchTo3d={() => setAngularityDisplayMode('3d')}
        show3dToggle={true}
      />
    );
  }

  if (isPosition && positionDisplayMode === 'video') {
    return (
      <PositionVideoPlayer
        className={className}
        onSwitchTo3d={() => setPositionDisplayMode('3d')}
        show3dToggle={true}
      />
    );
  }

  if (isConcentricity && concentricityDisplayMode === 'video') {
    return (
      <ConcentricityVideoPlayer
        className={className}
        onSwitchTo3d={() => setConcentricityDisplayMode('3d')}
        show3dToggle={true}
      />
    );
  }

  if (isSymmetry && symmetryDisplayMode === 'video') {
    return (
      <SymmetryVideoPlayer
        className={className}
        onSwitchTo3d={() => setSymmetryDisplayMode('3d')}
        show3dToggle={true}
      />
    );
  }

  return (
    <div className={`relative bg-gradient-to-b from-slate-900/90 via-slate-950 to-black rounded-xl overflow-hidden border border-slate-800 shadow-2xl ${className}`}>
      {/* Background Grid Lines & Glow */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:2rem_2rem] opacity-25 pointer-events-none" />
      <div className="absolute -top-24 -left-24 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Switch back to video button if viewing 3D for flatness */}
      {isFlatness && (
        <button
          onClick={() => setFlatnessDisplayMode('video')}
          className="absolute top-3 right-3 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-500/90 hover:bg-teal-400 text-slate-950 text-xs font-bold shadow-lg shadow-teal-500/30 transition backdrop-blur-md"
        >
          <span>🎥</span>
          <span>Watch Industrial Video</span>
        </button>
      )}

      {/* Switch back to video button if viewing 3D for circularity */}
      {isCircularity && (
        <button
          onClick={() => setCircularityDisplayMode('video')}
          className="absolute top-3 right-3 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-500/90 hover:bg-teal-400 text-slate-950 text-xs font-bold shadow-lg shadow-teal-500/30 transition backdrop-blur-md"
        >
          <span>🎥</span>
          <span>Watch Industrial Video</span>
        </button>
      )}

      {/* Switch back to video button if viewing 3D for cylindricity */}
      {isCylindricity && (
        <button
          onClick={() => setCylindricityDisplayMode('video')}
          className="absolute top-3 right-3 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-500/90 hover:bg-teal-400 text-slate-950 text-xs font-bold shadow-lg shadow-teal-500/30 transition backdrop-blur-md"
        >
          <span>🎥</span>
          <span>Watch Industrial Video</span>
        </button>
      )}

      {/* Switch back to video button if viewing 3D for straightness */}
      {isStraightness && (
        <button
          onClick={() => setStraightnessDisplayMode('video')}
          className="absolute top-3 right-3 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-500/90 hover:bg-teal-400 text-slate-950 text-xs font-bold shadow-lg shadow-teal-500/30 transition backdrop-blur-md"
        >
          <span>🎥</span>
          <span>Watch Industrial Video</span>
        </button>
      )}

      {/* Switch back to video button if viewing 3D for profile-line */}
      {isProfileLine && (
        <button
          onClick={() => setProfileLineDisplayMode('video')}
          className="absolute top-3 right-3 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-500/90 hover:bg-indigo-400 text-white text-xs font-bold shadow-lg shadow-indigo-500/30 transition backdrop-blur-md"
        >
          <span>🎥</span>
          <span>Watch Industrial Video</span>
        </button>
      )}

      {/* Switch back to video button if viewing 3D for profile-surface */}
      {isProfileSurface && (
        <button
          onClick={() => setProfileSurfaceDisplayMode('video')}
          className="absolute top-3 right-3 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-500/90 hover:bg-indigo-400 text-white text-xs font-bold shadow-lg shadow-indigo-500/30 transition backdrop-blur-md"
        >
          <span>🎥</span>
          <span>Watch Industrial Video</span>
        </button>
      )}

      {/* Switch back to video button if viewing 3D for perpendicularity */}
      {isPerpendicularity && (
        <button
          onClick={() => setPerpendicularityDisplayMode('video')}
          className="absolute top-3 right-3 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/90 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-lg shadow-amber-500/30 transition backdrop-blur-md"
        >
          <span>🎥</span>
          <span>Watch Industrial Video</span>
        </button>
      )}

      {/* Switch back to video button if viewing 3D for parallelism */}
      {isParallelism && (
        <button
          onClick={() => setParallelismDisplayMode('video')}
          className="absolute top-3 right-3 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/90 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-lg shadow-amber-500/30 transition backdrop-blur-md"
        >
          <span>🎥</span>
          <span>Watch Industrial Video</span>
        </button>
      )}

      {/* Switch back to video button if viewing 3D for angularity */}
      {isAngularity && (
        <button
          onClick={() => setAngularityDisplayMode('video')}
          className="absolute top-3 right-3 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/90 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-lg shadow-amber-500/30 transition backdrop-blur-md"
        >
          <span>🎥</span>
          <span>Watch Industrial Video</span>
        </button>
      )}

      {/* Switch back to video button if viewing 3D for position */}
      {isPosition && (
        <button
          onClick={() => setPositionDisplayMode('video')}
          className="absolute top-3 right-3 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-pink-500/90 hover:bg-pink-400 text-white text-xs font-bold shadow-lg shadow-pink-500/30 transition backdrop-blur-md"
        >
          <span>🎥</span>
          <span>Watch Industrial Video</span>
        </button>
      )}

      {/* Switch back to video button if viewing 3D for concentricity */}
      {isConcentricity && (
        <button
          onClick={() => setConcentricityDisplayMode('video')}
          className="absolute top-3 right-3 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-pink-500/90 hover:bg-pink-400 text-white text-xs font-bold shadow-lg shadow-pink-500/30 transition backdrop-blur-md"
        >
          <span>🎥</span>
          <span>Watch Industrial Video</span>
        </button>
      )}

      {/* Switch back to video button if viewing 3D for symmetry */}
      {isSymmetry && (
        <button
          onClick={() => setSymmetryDisplayMode('video')}
          className="absolute top-3 right-3 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-pink-500/90 hover:bg-pink-400 text-white text-xs font-bold shadow-lg shadow-pink-500/30 transition backdrop-blur-md"
        >
          <span>🎥</span>
          <span>Watch Industrial Video</span>
        </button>
      )}

      {/* Switch back to video button if viewing 3D for circular runout */}
      {isCircularRunout && (
        <button
          onClick={() => setCircularRunoutDisplayMode('video')}
          className="absolute top-3 right-3 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-500/90 hover:bg-orange-400 text-white text-xs font-bold shadow-lg shadow-orange-500/30 transition backdrop-blur-md"
        >
          <span>🎥</span>
          <span>Watch Industrial Video</span>
        </button>
      )}

      {/* Switch back to video button if viewing 3D for total runout */}
      {isTotalRunout && (
        <button
          onClick={() => setTotalRunoutDisplayMode('video')}
          className="absolute top-3 right-3 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-500/90 hover:bg-orange-400 text-white text-xs font-bold shadow-lg shadow-orange-500/30 transition backdrop-blur-md"
        >
          <span>🎥</span>
          <span>Watch Industrial Video</span>
        </button>
      )}

      {/* R3F Canvas */}
      <Canvas camera={{ position: [0, 0, 5.2], fov: 45 }} shadows>
        <ambientLight intensity={0.7} />
        <directionalLight position={[5, 8, 5]} intensity={1.8} castShadow />
        <directionalLight position={[-5, -4, -2]} intensity={0.6} color="#06b6d4" />
        <pointLight position={[0, 4, 3]} intensity={1.2} color="#38bdf8" />

        <Float speed={autoRotate ? 2 * rotationSpeed : 0} rotationIntensity={0.4} floatIntensity={0.6}>
          <SymbolSelector3D symbolId={symbolId} mat={mat} showZone={showToleranceZone} />
        </Float>

        <ContactShadows position={[0, -2.2, 0]} opacity={0.6} scale={6} blur={2} far={4} color="#0284c7" />

        <OrbitControls enableZoom enablePan autoRotate={autoRotate} autoRotateSpeed={2 * rotationSpeed} />
      </Canvas>
    </div>
  );
}
