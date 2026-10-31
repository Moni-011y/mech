import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

interface CadLoftMeshProps {
  progress: number;
  wireframe?: boolean;
  xray?: boolean;
  section?: boolean;
  isPlaying?: boolean;
}

export default function CadLoftMesh({
  progress,
  wireframe = false,
  xray = false,
  section = false,
  isPlaying = true,
}: CadLoftMeshProps) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current && isPlaying && progress >= 0.85) {
      groupRef.current.rotation.y += delta * 0.25;
    }
  });

  const Y1 = -2.8;
  const Y2 = 0.0;
  const Y3 = 2.8;

  const getProfile1Point = (angle: number): THREE.Vector3 => {
    const r = 2.2;
    return new THREE.Vector3(Math.cos(angle) * r, Y1, Math.sin(angle) * r);
  };

  const getProfile2Point = (angle: number): THREE.Vector3 => {
    const a = 3.2, b = 1.4;
    return new THREE.Vector3(Math.cos(angle) * a, Y2, Math.sin(angle) * b);
  };

  // Safe superellipse – avoid Math.pow(0, negative)
  const getProfile3Point = (angle: number): THREE.Vector3 => {
    const w = 2.2, h = 2.2, n = 3.5;
    const cosA = Math.cos(angle);
    const sinA = Math.sin(angle);
    const absCos = Math.abs(cosA);
    const absSin = Math.abs(sinA);
    const x = Math.sign(cosA || 1) * (absCos > 0 ? Math.pow(absCos, 2 / n) : 0) * w;
    const z = Math.sign(sinA || 1) * (absSin > 0 ? Math.pow(absSin, 2 / n) : 0) * h;
    return new THREE.Vector3(x, Y3, z);
  };

  const { loop1Geo, loop2Geo, loop3Geo } = useMemo(() => {
    const segments = 48;
    const pts1: THREE.Vector3[] = [];
    const pts2: THREE.Vector3[] = [];
    const pts3: THREE.Vector3[] = [];
    for (let i = 0; i <= segments; i++) {
      const a = (i / segments) * Math.PI * 2;
      pts1.push(getProfile1Point(a));
      pts2.push(getProfile2Point(a));
      pts3.push(getProfile3Point(a));
    }
    return {
      loop1Geo: new THREE.BufferGeometry().setFromPoints(pts1),
      loop2Geo: new THREE.BufferGeometry().setFromPoints(pts2),
      loop3Geo: new THREE.BufferGeometry().setFromPoints(pts3),
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const guideGeos = useMemo(() => {
    const angles = [0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2];
    return angles.map((a) => {
      const p1 = getProfile1Point(a);
      const p2 = getProfile2Point(a);
      const p3 = getProfile3Point(a);
      const curve = new THREE.CatmullRomCurve3([p1, p2, p3]);
      const pts = curve.getPoints(24);
      return new THREE.BufferGeometry().setFromPoints(pts);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isProfilesPhase = progress < 0.25;
  const isGuidesPhase = progress >= 0.25 && progress < 0.45;
  const isSkinningPhase = progress >= 0.45 && progress < 0.85;
  const isCompletedPhase = progress >= 0.85;

  const vMax = useMemo(() => {
    if (isProfilesPhase || isGuidesPhase) return 0.001;
    if (isCompletedPhase) return 1.0;
    const t = (progress - 0.45) / 0.4;
    return Math.max(0.08, Math.min(1.0, t));
  }, [isProfilesPhase, isGuidesPhase, isCompletedPhase, progress]);

  const loftGeo = useMemo(() => {
    if (vMax <= 0.05) return null;
    try {
      const uSteps = 36;
      const vSteps = Math.max(4, Math.floor(vMax * 24));

      const vertices: number[] = [];
      const uvs: number[] = [];
      const indices: number[] = [];

      for (let j = 0; j <= vSteps; j++) {
        const v = (j / vSteps) * vMax;
        for (let i = 0; i <= uSteps; i++) {
          const u = (i / uSteps) * Math.PI * 2;
          const p1 = getProfile1Point(u);
          const p2 = getProfile2Point(u);
          const p3 = getProfile3Point(u);

          const pt = new THREE.Vector3();
          if (v <= 0.5) {
            const tLocal = v * 2;
            const s = tLocal * tLocal * (3 - 2 * tLocal);
            pt.lerpVectors(p1, p2, s);
          } else {
            const tLocal = (v - 0.5) * 2;
            const s = tLocal * tLocal * (3 - 2 * tLocal);
            pt.lerpVectors(p2, p3, s);
          }

          vertices.push(pt.x, pt.y, pt.z);
          uvs.push(i / uSteps, v);
        }
      }

      for (let j = 0; j < vSteps; j++) {
        for (let i = 0; i < uSteps; i++) {
          const a = j * (uSteps + 1) + i;
          const b = (j + 1) * (uSteps + 1) + i;
          const c = (j + 1) * (uSteps + 1) + (i + 1);
          const d = j * (uSteps + 1) + (i + 1);
          indices.push(a, b, d);
          indices.push(b, c, d);
        }
      }

      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
      geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
      geo.setIndex(indices);
      geo.computeVertexNormals();
      return geo;
    } catch {
      return null;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vMax]);

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Profile 1: Circular Base */}
      <group>
        <lineLoop geometry={loop1Geo}>
          <lineBasicMaterial color="#38bdf8" />
        </lineLoop>
        {isProfilesPhase && (
          <Html position={[2.6, Y1, 0]} center>
            <div className="bg-surface-elevated/90 border border-sky-400 text-sky-400 text-[10px] font-mono px-2 py-0.5 rounded shadow whitespace-nowrap">
              Profile 01: Circle Ø44 mm (Z=-28)
            </div>
          </Html>
        )}
      </group>

      {/* Profile 2: Oval Transition Waist */}
      <group>
        <lineLoop geometry={loop2Geo}>
          <lineBasicMaterial color="#f59e0b" />
        </lineLoop>
        {isProfilesPhase && (
          <Html position={[3.6, Y2, 0]} center>
            <div className="bg-surface-elevated/90 border border-amber-400 text-amber-400 text-[10px] font-mono px-2 py-0.5 rounded shadow whitespace-nowrap">
              Profile 02: Oval 64 × 28 mm (Z=0)
            </div>
          </Html>
        )}
      </group>

      {/* Profile 3: Rounded Rectangular Exit */}
      <group>
        <lineLoop geometry={loop3Geo}>
          <lineBasicMaterial color="#a855f7" />
        </lineLoop>
        {isProfilesPhase && (
          <Html position={[2.6, Y3, 0]} center>
            <div className="bg-surface-elevated/90 border border-violet-400 text-violet-400 text-[10px] font-mono px-2 py-0.5 rounded shadow whitespace-nowrap">
              Profile 03: Rounded Rect 44 × 44 mm (Z=+28)
            </div>
          </Html>
        )}
      </group>

      {/* Guide Curve Rails */}
      {(isGuidesPhase || isSkinningPhase || isCompletedPhase) &&
        guideGeos.map((geo, idx) => (
          // @ts-expect-error: Three.js <line> conflicts with SVG intrinsic element type
          <line key={idx} geometry={geo}>
            <lineBasicMaterial color="#22d3ee" />
          </line>
        ))}

      {isGuidesPhase && (
        <Html position={[0, 0, 2.5]} center>
          <div className="bg-surface-elevated/90 border border-cyan-400 text-cyan-400 text-[10px] font-mono px-2 py-0.5 rounded shadow whitespace-nowrap">
            ⇡ 4 Boundary Guide Curves (Tangency Constraints)
          </div>
        </Html>
      )}

      {/* Skinned Loft Surface */}
      {loftGeo && (
        <mesh geometry={loftGeo} castShadow receiveShadow>
          <meshStandardMaterial
            color={isCompletedPhase ? '#64748b' : '#818cf8'}
            metalness={isCompletedPhase ? 0.85 : 0.4}
            roughness={isCompletedPhase ? 0.25 : 0.35}
            wireframe={wireframe}
            transparent={xray || isSkinningPhase}
            opacity={xray ? 0.35 : isSkinningPhase ? 0.85 : 1.0}
            side={THREE.DoubleSide}
            clipShadows={section}
          />
        </mesh>
      )}

      {/* Completed Caps & HUD */}
      {isCompletedPhase && (
        <>
          <mesh position={[0, Y1, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <circleGeometry args={[2.2, 32]} />
            <meshStandardMaterial color="#475569" metalness={0.8} roughness={0.3} side={THREE.DoubleSide} />
          </mesh>

          <Html position={[0, -3.6, 0]} center>
            <div className="bg-surface-elevated/95 border border-emerald-400 text-emerald-400 px-2 py-1 rounded text-[11px] font-mono shadow-xl flex items-center gap-1.5 whitespace-nowrap">
              <span className="font-bold">Lofted Solid Complete:</span>
              <span className="text-white">Continuous G2 Transition Duct</span>
            </div>
          </Html>
        </>
      )}
    </group>
  );
}
