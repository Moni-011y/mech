import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

interface CadRevolveMeshProps {
  progress: number;
  wireframe?: boolean;
  xray?: boolean;
  section?: boolean;
  maxAngleParam?: number; // 90, 180, 270, 360 (degrees)
  shaftType?: 'steppedShaft' | 'flangedHub';
  isPlaying?: boolean;
}

export default function CadRevolveMesh({
  progress,
  wireframe = false,
  xray = false,
  section = false,
  maxAngleParam = 360,
  shaftType = 'steppedShaft',
  isPlaying = true,
}: CadRevolveMeshProps) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current && isPlaying && progress >= 0.85) {
      groupRef.current.rotation.y += delta * 0.3;
    }
  });

  const maxAngleRad = (maxAngleParam * Math.PI) / 180;

  // 2D half-profile points along X >= 0
  const profilePoints = useMemo(() => {
    if (shaftType === 'steppedShaft') {
      return [
        new THREE.Vector2(0, -3.5),
        new THREE.Vector2(1.0, -3.5),
        new THREE.Vector2(1.0, -2.0),
        new THREE.Vector2(1.6, -2.0),
        new THREE.Vector2(1.6, -0.6),
        new THREE.Vector2(2.4, -0.6),
        new THREE.Vector2(2.4, 1.2),
        new THREE.Vector2(1.5, 1.2),
        new THREE.Vector2(1.5, 2.6),
        new THREE.Vector2(0.9, 2.6),
        new THREE.Vector2(0.9, 3.5),
        new THREE.Vector2(0, 3.5),
      ];
    } else {
      return [
        new THREE.Vector2(0.8, -2.5),
        new THREE.Vector2(2.8, -2.5),
        new THREE.Vector2(2.8, -1.5),
        new THREE.Vector2(1.8, -1.5),
        new THREE.Vector2(1.8, 1.8),
        new THREE.Vector2(2.2, 1.8),
        new THREE.Vector2(2.2, 2.5),
        new THREE.Vector2(0.8, 2.5),
      ];
    }
  }, [shaftType]);

  const isSketchPhase = progress < 0.25;
  const isRotatingPhase = progress >= 0.25 && progress < 0.85;
  const isCompletedPhase = progress >= 0.85;

  const currentAngle = useMemo(() => {
    if (isSketchPhase) return 0.001;
    if (isCompletedPhase) return maxAngleRad;
    const t = (progress - 0.25) / 0.6;
    return Math.max(0.05, maxAngleRad * Math.min(1, Math.max(0, t)));
  }, [isSketchPhase, isCompletedPhase, progress, maxAngleRad]);

  const latheGeo = useMemo(() => {
    if (currentAngle <= 0.04) return null;
    const segments = Math.max(16, Math.floor((currentAngle / (Math.PI * 2)) * 48));
    return new THREE.LatheGeometry(profilePoints, segments, 0, currentAngle);
  }, [profilePoints, currentAngle]);

  // Precomputed line geometry for profile
  const profileLineGeo = useMemo(() => {
    const pts = [...profilePoints];
    if (shaftType === 'steppedShaft') pts.push(new THREE.Vector2(0, -3.5));
    else pts.push(new THREE.Vector2(0.8, -2.5));
    const v3Pts = pts.map((p) => new THREE.Vector3(p.x, p.y, 0));
    return new THREE.BufferGeometry().setFromPoints(v3Pts);
  }, [profilePoints, shaftType]);

  // Centerline axis geometry
  const axisGeo = useMemo(() => {
    return new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, -5, 0),
      new THREE.Vector3(0, 5, 0),
    ]);
  }, []);

  const angleDeg = Math.round((currentAngle * 180) / Math.PI);

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Central Axis of Revolution */}
      <group>
        <line geometry={axisGeo}>
          <lineBasicMaterial color="#f59e0b" />
        </line>
        <mesh position={[0, -4.8, 0]}>
          <sphereGeometry args={[0.08, 12, 12]} />
          <meshBasicMaterial color="#f59e0b" />
        </mesh>
        <mesh position={[0, 4.8, 0]}>
          <sphereGeometry args={[0.08, 12, 12]} />
          <meshBasicMaterial color="#f59e0b" />
        </mesh>
        <Html position={[0, 5.1, 0]} center>
          <div className="bg-surface-elevated/90 border border-amber-400 text-amber-400 font-mono text-[10px] px-2 py-0.5 rounded shadow-lg whitespace-nowrap">
            ℄ AXIS OF REVOLUTION
          </div>
        </Html>
      </group>

      {/* 2D Half-Profile Outline (Base sketch at angle = 0) */}
      <lineLoop geometry={profileLineGeo}>
        <lineBasicMaterial color="#38bdf8" />
      </lineLoop>

      {/* Leading Edge Profile Face (rotates with current angle) */}
      {isRotatingPhase && (
        <group rotation={[0, -currentAngle, 0]}>
          <lineLoop geometry={profileLineGeo}>
            <lineBasicMaterial color="#22d3ee" />
          </lineLoop>
        </group>
      )}

      {/* Circular Sweep Arc Track */}
      {(isSketchPhase || isRotatingPhase) && (
        <group position={[0, 0, 0]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[2.35, 2.45, 48, 1, 0, isSketchPhase ? Math.PI * 2 : currentAngle]} />
            <meshBasicMaterial color="#f59e0b" transparent opacity={0.6} side={THREE.DoubleSide} />
          </mesh>
          <Html position={[Math.cos(currentAngle / 2) * 2.8, 0, Math.sin(currentAngle / 2) * 2.8]} center>
            <div className="bg-surface-elevated/90 border border-sky-400 text-sky-400 text-[10px] font-mono px-1.5 py-0.5 rounded shadow whitespace-nowrap">
              ↻ θ = {angleDeg}°
            </div>
          </Html>
        </group>
      )}

      {/* Generated Revolved 3D Solid */}
      {latheGeo && (
        <mesh geometry={latheGeo} castShadow receiveShadow>
          <meshStandardMaterial
            color={isCompletedPhase ? '#94a3b8' : '#38bdf8'}
            metalness={isCompletedPhase ? 0.85 : 0.5}
            roughness={isCompletedPhase ? 0.2 : 0.35}
            wireframe={wireframe}
            transparent={xray || isRotatingPhase}
            opacity={xray ? 0.35 : isRotatingPhase ? 0.85 : 1.0}
            clipShadows={section}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}

      {/* Dimension & Feature HUD Indicators */}
      {isSketchPhase && (
        <Html position={[3.2, 0, 0]} center>
          <div className="bg-surface/90 border border-accent text-accent px-2 py-1 rounded text-[11px] font-mono shadow-xl flex flex-col gap-0.5 whitespace-nowrap">
            <span className="font-bold">2D Half-Profile:</span>
            <span className="text-white text-[10px]">Max OD: Ø48 mm | Length: 70 mm</span>
            <span className="text-text-secondary text-[10px]">Bearing Journals: Ø20 &amp; Ø32 mm</span>
          </div>
        </Html>
      )}

      {isCompletedPhase && (
        <Html position={[0, -4.2, 0]} center>
          <div className="bg-surface-elevated/95 border border-emerald-400 text-emerald-400 px-2 py-1 rounded text-[11px] font-mono shadow-xl flex items-center gap-2 whitespace-nowrap">
            <span className="font-bold">360° Revolved Solid Complete:</span>
            <span className="text-white font-mono">Turned CNC Stepped Shaft</span>
          </div>
        </Html>
      )}
    </group>
  );
}
