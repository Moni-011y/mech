import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

interface CadPatternMeshProps {
  progress: number;
  wireframe?: boolean;
  xray?: boolean;
  section?: boolean;
  patternMode?: 'circular' | 'linear';
  instanceCountParam?: number; // 4, 6, 8, 12
  isPlaying?: boolean;
}

export default function CadPatternMesh({
  progress,
  wireframe = false,
  xray = false,
  section = false,
  patternMode = 'circular',
  instanceCountParam = 6,
  isPlaying = true,
}: CadPatternMeshProps) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current && isPlaying && progress >= 0.85) {
      groupRef.current.rotation.y += delta * 0.25;
    }
  });

  const N = instanceCountParam;
  const pcdRadius = 3.5;

  const isSeedPhase = progress < 0.25;
  const isReplicatingPhase = progress >= 0.25 && progress < 0.85;
  const isCompletedPhase = progress >= 0.85;

  const activeInstanceCount = useMemo(() => {
    if (isSeedPhase) return 1;
    if (isCompletedPhase) return N;
    const t = (progress - 0.25) / 0.6;
    return Math.min(N, 1 + Math.floor(t * (N - 1 + 0.99)));
  }, [isSeedPhase, isCompletedPhase, progress, N]);

  // Points for Pitch Circle Diameter (PCD) reference ring
  const pcdRingGeo = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    const segments = 64;
    for (let i = 0; i <= segments; i++) {
      const a = (i / segments) * Math.PI * 2;
      pts.push(new THREE.Vector3(Math.cos(a) * pcdRadius, 0.42, Math.sin(a) * pcdRadius));
    }
    return new THREE.BufferGeometry().setFromPoints(pts);
  }, [pcdRadius]);

  // Axis geometry
  const axisGeo = useMemo(() => {
    return new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, -2.5, 0),
      new THREE.Vector3(0, 3.0, 0),
    ]);
  }, []);

  // Linear pattern coordinates (cols x rows)
  const linearPositions = useMemo(() => {
    const positions: { x: number; z: number; idx: number }[] = [];
    const cols = Math.min(4, Math.ceil(N / 2));
    const rows = 2;
    const dx = 2.0;
    const dz = 2.4;
    const startX = -((cols - 1) * dx) / 2;
    const startZ = -((rows - 1) * dz) / 2;
    let count = 0;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (count < N) {
          positions.push({ x: startX + c * dx, z: startZ + r * dz, idx: count });
          count++;
        }
      }
    }
    return positions;
  }, [N]);

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {patternMode === 'circular' ? (
        /* CIRCULAR PATTERN: Machined Flange with PCD Bolt Holes */
        <group>
          {/* Main Flange Disc */}
          <mesh position={[0, 0, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[5.2, 5.2, 0.8, 48]} />
            <meshStandardMaterial
              color={isCompletedPhase ? '#64748b' : '#334155'}
              metalness={0.85}
              roughness={0.25}
              wireframe={wireframe}
              transparent={xray}
              opacity={xray ? 0.35 : 1.0}
              clipShadows={section}
            />
          </mesh>

          {/* Central Flange Hub */}
          <mesh position={[0, 0.8, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[2.2, 2.4, 0.8, 36]} />
            <meshStandardMaterial color="#475569" metalness={0.85} roughness={0.3} />
          </mesh>

          {/* Central Bore Hole */}
          <mesh position={[0, 0.4, 0]}>
            <cylinderGeometry args={[1.2, 1.2, 1.7, 32]} />
            <meshStandardMaterial color="#0b0f19" roughness={0.9} />
          </mesh>

          {/* Pitch Circle Diameter (PCD) Reference Guide */}
          <lineLoop geometry={pcdRingGeo}>
            <lineBasicMaterial color="#22d3ee" />
          </lineLoop>

          {/* Center Rotation Axis Line */}
          <line geometry={axisGeo}>
            <lineBasicMaterial color="#f59e0b" />
          </line>

          {/* Pattern Instances (Bolt Holes) */}
          {Array.from({ length: N }).map((_, i) => {
            const angle = (i / N) * Math.PI * 2;
            const x = Math.cos(angle) * pcdRadius;
            const z = Math.sin(angle) * pcdRadius;
            const isVisible = i < activeInstanceCount;
            const isSeed = i === 0;

            if (!isVisible) return null;

            return (
              <group key={i} position={[x, 0, z]}>
                {/* Counterbore Hole Body */}
                <mesh position={[0, 0.1, 0]}>
                  <cylinderGeometry args={[0.55, 0.55, 0.85, 24]} />
                  <meshStandardMaterial
                    color="#0f172a"
                    metalness={0.2}
                    roughness={0.8}
                    wireframe={wireframe}
                  />
                </mesh>

                {/* Counterbore Top Lip Rim */}
                <mesh position={[0, 0.42, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                  <ringGeometry args={[0.35, 0.55, 24]} />
                  <meshStandardMaterial
                    color={isSeed ? '#f59e0b' : '#38bdf8'}
                    emissive={isSeed ? '#f59e0b' : '#0284c7'}
                    emissiveIntensity={0.6}
                    side={THREE.DoubleSide}
                  />
                </mesh>

                {/* Seed Feature Badge on Instance 0 */}
                {isSeed && (
                  <Html position={[0, 1.2, 0]} center>
                    <div className="bg-amber-500/20 border border-amber-400 text-amber-400 text-[10px] font-mono font-bold px-2 py-0.5 rounded shadow whitespace-nowrap">
                      ★ SEED FEATURE #1 (0°)
                    </div>
                  </Html>
                )}

                {/* Instance Index Badge */}
                {!isSeed && isReplicatingPhase && i === activeInstanceCount - 1 && (
                  <Html position={[0, 0.8, 0]} center>
                    <div className="bg-sky-500/20 border border-sky-400 text-sky-400 text-[9px] font-mono px-1.5 py-0.5 rounded shadow whitespace-nowrap animate-pulse">
                      #{i + 1} ({Math.round((angle * 180) / Math.PI)}°)
                    </div>
                  </Html>
                )}
              </group>
            );
          })}

          {/* HUD Annotations */}
          {isSeedPhase && (
            <Html position={[0, -1.8, 0]} center>
              <div className="bg-surface/90 border border-amber-400 text-amber-400 px-2 py-1 rounded text-[11px] font-mono shadow-xl flex items-center gap-1.5 whitespace-nowrap">
                <span>PCD Guide:</span>
                <span className="text-white font-bold">Ø70.0 mm</span>
                <span className="text-text-secondary">(Seed Hole: Ø11 mm C'Bore)</span>
              </div>
            </Html>
          )}

          {isCompletedPhase && (
            <Html position={[0, -2.2, 0]} center>
              <div className="bg-surface-elevated/95 border border-emerald-400 text-emerald-400 px-2 py-1 rounded text-[11px] font-mono shadow-xl flex items-center gap-1.5 whitespace-nowrap">
                <span className="font-bold">Circular Pattern Complete:</span>
                <span className="text-white font-mono">{N}× Holes on Ø70 mm PCD (Equal Spacing)</span>
              </div>
            </Html>
          )}
        </group>
      ) : (
        /* LINEAR PATTERN: Rectangular Plate with Matrix Arrays */
        <group>
          {/* Base Plate */}
          <mesh position={[0, -0.3, 0]} castShadow receiveShadow>
            <boxGeometry args={[8.8, 0.6, 5.8]} />
            <meshStandardMaterial
              color={isCompletedPhase ? '#64748b' : '#334155'}
              metalness={0.8}
              roughness={0.25}
              wireframe={wireframe}
              transparent={xray}
              opacity={xray ? 0.35 : 1.0}
            />
          </mesh>

          {/* Linear Direction Guide Arrows (Standard Meshes) */}
          <group position={[-3.8, 0.1, -2.4]}>
            {/* X-direction arrow */}
            <group position={[1.5, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
              <mesh position={[0, 0.8, 0]}>
                <cylinderGeometry args={[0.03, 0.03, 1.6, 12]} />
                <meshBasicMaterial color="#38bdf8" />
              </mesh>
              <mesh position={[0, 1.7, 0]}>
                <coneGeometry args={[0.12, 0.3, 12]} />
                <meshBasicMaterial color="#38bdf8" />
              </mesh>
            </group>

            {/* Z-direction arrow */}
            <group position={[0, 0, 1.2]} rotation={[Math.PI / 2, 0, 0]}>
              <mesh position={[0, 0.6, 0]}>
                <cylinderGeometry args={[0.03, 0.03, 1.2, 12]} />
                <meshBasicMaterial color="#38bdf8" />
              </mesh>
              <mesh position={[0, 1.3, 0]}>
                <coneGeometry args={[0.12, 0.3, 12]} />
                <meshBasicMaterial color="#38bdf8" />
              </mesh>
            </group>
          </group>

          {/* Instances */}
          {linearPositions.map((pos, i) => {
            const isVisible = i < activeInstanceCount;
            const isSeed = i === 0;
            if (!isVisible) return null;

            return (
              <group key={i} position={[pos.x, 0, pos.z]}>
                <mesh position={[0, 0.05, 0]}>
                  <cylinderGeometry args={[0.45, 0.45, 0.7, 24]} />
                  <meshStandardMaterial color="#0f172a" roughness={0.8} />
                </mesh>
                <mesh position={[0, 0.36, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                  <ringGeometry args={[0.3, 0.45, 24]} />
                  <meshStandardMaterial
                    color={isSeed ? '#f59e0b' : '#38bdf8'}
                    emissive={isSeed ? '#f59e0b' : '#0284c7'}
                    emissiveIntensity={0.6}
                    side={THREE.DoubleSide}
                  />
                </mesh>

                {isSeed && (
                  <Html position={[0, 0.8, 0]} center>
                    <div className="bg-amber-500/20 border border-amber-400 text-amber-400 text-[10px] font-mono font-bold px-2 py-0.5 rounded shadow whitespace-nowrap">
                      ★ SEED FEATURE #1
                    </div>
                  </Html>
                )}
              </group>
            );
          })}

          {isCompletedPhase && (
            <Html position={[0, -1.8, 0]} center>
              <div className="bg-surface-elevated/95 border border-emerald-400 text-emerald-400 px-2 py-1 rounded text-[11px] font-mono shadow-xl flex items-center gap-1.5 whitespace-nowrap">
                <span className="font-bold">Linear Pattern Complete:</span>
                <span className="text-white font-mono">{N} Instances (ΔX: 20 mm, ΔZ: 24 mm)</span>
              </div>
            </Html>
          )}
        </group>
      )}
    </group>
  );
}
