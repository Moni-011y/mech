import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

interface CadSweepMeshProps {
  progress: number;
  wireframe?: boolean;
  xray?: boolean;
  section?: boolean;
  pipeRadiusParam?: number;
  routeType?: 'sCurve' | 'rightAngle';
  isPlaying?: boolean;
}

export default function CadSweepMesh({
  progress,
  wireframe = false,
  xray = false,
  section = false,
  pipeRadiusParam = 28,
  routeType = 'sCurve',
  isPlaying = true,
}: CadSweepMeshProps) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current && isPlaying && progress >= 0.85) {
      groupRef.current.rotation.y += delta * 0.25;
    }
  });

  const outerRadius = (pipeRadiusParam / 28) * 0.55;

  const curve = useMemo(() => {
    if (routeType === 'sCurve') {
      return new THREE.CatmullRomCurve3([
        new THREE.Vector3(-3.2, -1.8, -1.2),
        new THREE.Vector3(-1.8, -0.9, 1.2),
        new THREE.Vector3(0, 0.8, 1.4),
        new THREE.Vector3(1.8, 0.2, -1.2),
        new THREE.Vector3(3.2, 1.8, 0.2),
      ]);
    } else {
      return new THREE.CatmullRomCurve3([
        new THREE.Vector3(-3.0, -2.0, 0),
        new THREE.Vector3(-0.5, -2.0, 0),
        new THREE.Vector3(1.2, -1.5, 0),
        new THREE.Vector3(2.0, -0.5, 0),
        new THREE.Vector3(2.0, 2.0, 0),
      ]);
    }
  }, [routeType]);

  const pathGeo = useMemo(() => {
    const pts = curve.getPoints(64);
    return new THREE.BufferGeometry().setFromPoints(pts);
  }, [curve]);

  const isSketchPhase = progress < 0.25;
  const isSweepingPhase = progress >= 0.25 && progress < 0.85;
  const isCompletedPhase = progress >= 0.85;

  const t = useMemo(() => {
    if (isSketchPhase) return 0.05;
    if (isCompletedPhase) return 1.0;
    const progressNorm = (progress - 0.25) / 0.6;
    return Math.max(0.08, Math.min(1.0, progressNorm));
  }, [isSketchPhase, isCompletedPhase, progress]);

  const activeGeo = useMemo(() => {
    try {
      const sampleCount = Math.max(8, Math.floor(t * 48));
      const subPoints: THREE.Vector3[] = [];
      for (let i = 0; i <= sampleCount; i++) {
        subPoints.push(curve.getPoint((i / sampleCount) * t));
      }
      // Need at least 3 points for CatmullRomCurve3 to work properly
      if (subPoints.length < 3) return null;
      const subCurve = new THREE.CatmullRomCurve3(subPoints);
      return new THREE.TubeGeometry(subCurve, sampleCount, outerRadius, 16, false);
    } catch {
      return null;
    }
  }, [curve, t, outerRadius]);

  // Safe helper to get a stable quaternion from a tangent vector
  const safeQuatFromTangent = (tangent: THREE.Vector3): THREE.Quaternion => {
    const up = new THREE.Vector3(0, 1, 0);
    const tan = tangent.clone().normalize();
    // Avoid degenerate case where tangent is nearly antiparallel to up
    const dot = tan.dot(up);
    if (dot < -0.9999) {
      // Return 180° rotation around X
      return new THREE.Quaternion(1, 0, 0, 0);
    }
    const q = new THREE.Quaternion();
    try {
      q.setFromUnitVectors(up, tan);
    } catch {
      // fallback: identity
    }
    return q;
  };

  const { currentPos, currentTangent } = useMemo(() => {
    const pos = curve.getPoint(Math.min(t, 0.9999));
    const tan = curve.getTangent(Math.min(t, 0.9999)).normalize();
    return { currentPos: pos, currentTangent: tan };
  }, [curve, t]);

  // Profile ring geometry at current sweep front
  const profileRingGeo = useMemo(() => {
    try {
      const up = new THREE.Vector3(0, 1, 0);
      const tan = currentTangent.clone();
      const dot = tan.dot(up);
      let norm: THREE.Vector3;
      if (Math.abs(dot) > 0.9) {
        norm = new THREE.Vector3(1, 0, 0);
      } else {
        norm = new THREE.Vector3().crossVectors(tan, up).normalize();
      }
      const binorm = new THREE.Vector3().crossVectors(tan, norm).normalize();
      const pts: THREE.Vector3[] = [];
      const segments = 24;
      for (let i = 0; i <= segments; i++) {
        const angle = (i / segments) * Math.PI * 2;
        const x = Math.cos(angle) * outerRadius;
        const y = Math.sin(angle) * outerRadius;
        const pt = currentPos.clone()
          .add(norm.clone().multiplyScalar(x))
          .add(binorm.clone().multiplyScalar(y));
        pts.push(pt);
      }
      return new THREE.BufferGeometry().setFromPoints(pts);
    } catch {
      return new THREE.BufferGeometry().setFromPoints([currentPos]);
    }
  }, [currentPos, currentTangent, outerRadius]);

  // Starting profile ring
  const startProfileGeo = useMemo(() => {
    try {
      const pos = curve.getPoint(0);
      const tan = curve.getTangent(0).normalize();
      const up = new THREE.Vector3(0, 1, 0);
      let norm: THREE.Vector3;
      if (Math.abs(tan.dot(up)) > 0.9) {
        norm = new THREE.Vector3(1, 0, 0);
      } else {
        norm = new THREE.Vector3().crossVectors(tan, up).normalize();
      }
      const binorm = new THREE.Vector3().crossVectors(tan, norm).normalize();
      const pts: THREE.Vector3[] = [];
      const segments = 24;
      for (let i = 0; i <= segments; i++) {
        const angle = (i / segments) * Math.PI * 2;
        const x = Math.cos(angle) * outerRadius;
        const y = Math.sin(angle) * outerRadius;
        pts.push(pos.clone().add(norm.clone().multiplyScalar(x)).add(binorm.clone().multiplyScalar(y)));
      }
      return new THREE.BufferGeometry().setFromPoints(pts);
    } catch {
      return new THREE.BufferGeometry().setFromPoints([new THREE.Vector3()]);
    }
  }, [curve, outerRadius]);

  const arrowQuat = useMemo(() => safeQuatFromTangent(currentTangent), [currentTangent]);

  const startFlangePosAndQuat = useMemo(() => ({
    pos: curve.getPoint(0),
    quat: safeQuatFromTangent(curve.getTangent(0).normalize()),
  }), [curve]);

  const endFlangePosAndQuat = useMemo(() => ({
    pos: curve.getPoint(1),
    quat: safeQuatFromTangent(curve.getTangent(1).normalize()),
  }), [curve]);

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* 3D Trajectory Centerline */}
      <line geometry={pathGeo}>
        <lineBasicMaterial color="#f59e0b" />
      </line>

      {/* Trajectory waypoint nodes */}
      {curve.points.map((pt, idx) => (
        <mesh key={idx} position={pt}>
          <sphereGeometry args={[0.07, 12, 12]} />
          <meshBasicMaterial color="#f59e0b" />
        </mesh>
      ))}

      {/* Starting Profile Ring */}
      <lineLoop geometry={startProfileGeo}>
        <lineBasicMaterial color="#38bdf8" />
      </lineLoop>

      {isSketchPhase && (
        <Html position={[curve.points[0].x - 0.5, curve.points[0].y + 0.6, curve.points[0].z]} center>
          <div className="bg-surface-elevated/90 border border-sky-400 text-sky-400 text-[10px] font-mono px-2 py-0.5 rounded shadow whitespace-nowrap">
            ⨁ START PROFILE (Ø28 mm)
          </div>
        </Html>
      )}

      {/* Leading Sweep Profile Ring */}
      {isSweepingPhase && (
        <group>
          <lineLoop geometry={profileRingGeo}>
            <lineBasicMaterial color="#22d3ee" />
          </lineLoop>

          {/* Tangent arrow at sweep front */}
          <group position={currentPos} quaternion={arrowQuat}>
            <mesh position={[0, 0.4, 0]}>
              <cylinderGeometry args={[0.03, 0.03, 0.7, 12]} />
              <meshBasicMaterial color="#22d3ee" />
            </mesh>
            <mesh position={[0, 0.8, 0]}>
              <coneGeometry args={[0.12, 0.3, 12]} />
              <meshBasicMaterial color="#22d3ee" />
            </mesh>
          </group>
        </group>
      )}

      {/* Progressively Generated Swept Tube */}
      {activeGeo && (
        <mesh geometry={activeGeo} castShadow receiveShadow>
          <meshStandardMaterial
            color={isCompletedPhase ? '#64748b' : '#38bdf8'}
            metalness={isCompletedPhase ? 0.85 : 0.4}
            roughness={isCompletedPhase ? 0.25 : 0.35}
            wireframe={wireframe}
            transparent={xray || isSweepingPhase}
            opacity={xray ? 0.35 : isSweepingPhase ? 0.85 : 1.0}
            clipShadows={section}
          />
        </mesh>
      )}

      {/* End Mounting Flanges */}
      {isCompletedPhase && (
        <group>
          <mesh position={startFlangePosAndQuat.pos} quaternion={startFlangePosAndQuat.quat}>
            <cylinderGeometry args={[0.9, 0.9, 0.2, 24]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.2} />
          </mesh>
          <mesh position={endFlangePosAndQuat.pos} quaternion={endFlangePosAndQuat.quat}>
            <cylinderGeometry args={[0.9, 0.9, 0.2, 24]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.2} />
          </mesh>
        </group>
      )}

      {isSweepingPhase && (
        <Html position={[currentPos.x + 0.6, currentPos.y + 0.6, currentPos.z]} center>
          <div className="bg-surface-elevated/95 border border-accent text-accent px-2 py-0.5 rounded text-[10px] font-mono shadow-lg whitespace-nowrap">
            ▶ Sweep Traversal: {Math.round(t * 100)}%
          </div>
        </Html>
      )}

      {isCompletedPhase && (
        <Html position={[0, -2.6, 0]} center>
          <div className="bg-surface-elevated/95 border border-emerald-400 text-emerald-400 px-2 py-1 rounded text-[11px] font-mono shadow-xl flex items-center gap-1.5 whitespace-nowrap">
            <span className="font-bold">Swept Conduit Solid:</span>
            <span className="text-white">Seamless 3D Routed Pipe</span>
            <span className="text-text-secondary">(Ø28 mm OD)</span>
          </div>
        </Html>
      )}
    </group>
  );
}
