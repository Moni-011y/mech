import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html, Grid } from '@react-three/drei';
import * as THREE from 'three';

interface CadExtrudeMeshProps {
  progress: number;
  wireframe?: boolean;
  xray?: boolean;
  section?: boolean;
  depthParam?: number;
  profileType?: 'bracket' | 'boss';
  isPlaying?: boolean;
}

export default function CadExtrudeMesh({
  progress,
  wireframe = false,
  xray = false,
  section = false,
  depthParam = 45,
  profileType = 'bracket',
  isPlaying = true,
}: CadExtrudeMeshProps) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current && isPlaying && progress >= 0.85) {
      groupRef.current.rotation.y += delta * 0.25;
    }
  });

  const targetDepth = depthParam / 10;

  const { shape, outerGeo, pocketGeo, hole1Geo, hole2Geo } = useMemo(() => {
    const s = new THREE.Shape();
    if (profileType === 'bracket') {
      const w = 3.6, h = 2.4, r = 0.4;
      s.moveTo(-w + r, -h);
      s.lineTo(w - r, -h);
      s.quadraticCurveTo(w, -h, w, -h + r);
      s.lineTo(w, h - r);
      s.quadraticCurveTo(w, h, w - r, h);
      s.lineTo(-w + r, h);
      s.quadraticCurveTo(-w, h, -w, h - r);
      s.lineTo(-w, -h + r);
      s.quadraticCurveTo(-w, -h, -w + r, -h);

      const pocketHole = new THREE.Path();
      pocketHole.absarc(0, 0, 1.0, 0, Math.PI * 2, true);
      s.holes.push(pocketHole);

      const holeL = new THREE.Path();
      holeL.absarc(-2.4, 0, 0.35, 0, Math.PI * 2, true);
      s.holes.push(holeL);

      const holeR = new THREE.Path();
      holeR.absarc(2.4, 0, 0.35, 0, Math.PI * 2, true);
      s.holes.push(holeR);

      const outerPts = s.getPoints(36).map((p) => new THREE.Vector3(p.x, p.y, 0.01));
      const pocketPts = pocketHole.getPoints(24).map((p) => new THREE.Vector3(p.x, p.y, 0.01));
      const holeLPts = holeL.getPoints(16).map((p) => new THREE.Vector3(p.x, p.y, 0.01));
      const holeRPts = holeR.getPoints(16).map((p) => new THREE.Vector3(p.x, p.y, 0.01));

      return {
        shape: s,
        outerGeo: new THREE.BufferGeometry().setFromPoints(outerPts),
        pocketGeo: new THREE.BufferGeometry().setFromPoints(pocketPts),
        hole1Geo: new THREE.BufferGeometry().setFromPoints(holeLPts),
        hole2Geo: new THREE.BufferGeometry().setFromPoints(holeRPts),
      };
    } else {
      s.absarc(0, 0, 2.8, 0, Math.PI * 2, false);
      const centerBore = new THREE.Path();
      centerBore.absarc(0, 0, 1.2, 0, Math.PI * 2, true);
      s.holes.push(centerBore);

      const outerPts = s.getPoints(36).map((p) => new THREE.Vector3(p.x, p.y, 0.01));
      const pocketPts = centerBore.getPoints(24).map((p) => new THREE.Vector3(p.x, p.y, 0.01));

      return {
        shape: s,
        outerGeo: new THREE.BufferGeometry().setFromPoints(outerPts),
        pocketGeo: new THREE.BufferGeometry().setFromPoints(pocketPts),
        hole1Geo: null,
        hole2Geo: null,
      };
    }
  }, [profileType]);

  const isSketchPhase = progress < 0.25;
  const isVectorPhase = progress >= 0.25 && progress < 0.45;
  const isExtrudingPhase = progress >= 0.45 && progress < 0.85;
  const isCompletedPhase = progress >= 0.85;

  const currentHeight = useMemo(() => {
    if (isSketchPhase) return 0.001;
    if (isVectorPhase) return 0.08;
    if (isCompletedPhase) return targetDepth;
    const t = (progress - 0.45) / 0.4;
    return Math.max(0.08, targetDepth * Math.min(1, Math.max(0, t)));
  }, [isSketchPhase, isVectorPhase, isCompletedPhase, progress, targetDepth]);

  const extrudeGeo = useMemo(() => {
    if (currentHeight <= 0.05) return null;
    try {
      return new THREE.ExtrudeGeometry(shape, {
        depth: currentHeight,
        bevelEnabled: isCompletedPhase,
        bevelSegments: 2,
        steps: 1,
        bevelSize: 0.06,
        bevelThickness: 0.06,
      });
    } catch {
      return null;
    }
  }, [shape, currentHeight, isCompletedPhase]);

  return (
    <group ref={groupRef} position={[0, -targetDepth / 2, 0]}>
      {/* Sketch plane grid (using drei Grid component) */}
      <Grid
        position={[0, 0, 0]}
        args={[10, 8]}
        cellSize={1}
        cellThickness={0.6}
        cellColor="#1e293b"
        sectionSize={4}
        sectionThickness={1}
        sectionColor="#164e63"
        fadeDistance={20}
        infiniteGrid={false}
        rotation={[Math.PI / 2, 0, 0]}
      />

      {/* Sketch plane base */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <planeGeometry args={[10, 8]} />
        <meshBasicMaterial
          color="#0d1b2a"
          transparent
          opacity={isSketchPhase || isVectorPhase ? 0.65 : 0.2}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Sketch Contour Lines */}
      <group rotation={[-Math.PI / 2, 0, 0]}>
        {outerGeo && (
          <lineLoop geometry={outerGeo}>
            <lineBasicMaterial color="#38bdf8" />
          </lineLoop>
        )}
        {pocketGeo && (
          <lineLoop geometry={pocketGeo}>
            <lineBasicMaterial color="#22d3ee" />
          </lineLoop>
        )}
        {hole1Geo && (
          <lineLoop geometry={hole1Geo}>
            <lineBasicMaterial color="#22d3ee" />
          </lineLoop>
        )}
        {hole2Geo && (
          <lineLoop geometry={hole2Geo}>
            <lineBasicMaterial color="#22d3ee" />
          </lineLoop>
        )}
      </group>

      {/* Extrusion Direction Vector Arrow */}
      {(isVectorPhase || isExtrudingPhase) && (
        <group position={[0, 0, 0]}>
          <mesh position={[0, currentHeight / 2 + 0.5, 0]}>
            <cylinderGeometry args={[0.06, 0.06, Math.max(1, currentHeight + 1), 16]} />
            <meshStandardMaterial color="#38bdf8" emissive="#0284c7" emissiveIntensity={0.6} />
          </mesh>
          <mesh position={[0, currentHeight + 1.2, 0]}>
            <coneGeometry args={[0.25, 0.6, 16]} />
            <meshStandardMaterial color="#22d3ee" emissive="#0ea5e9" emissiveIntensity={0.8} />
          </mesh>
          <Html position={[1.2, currentHeight / 2 + 0.6, 0]} center>
            <div className="bg-surface-elevated/90 border border-sky-400 text-sky-400 font-mono text-[11px] px-2 py-0.5 rounded shadow-lg whitespace-nowrap">
              ↑ NORMAL VECTOR (+Y)
            </div>
          </Html>
        </group>
      )}

      {/* Moving Top Face Outline during Extrusion */}
      {(isExtrudingPhase || isVectorPhase) && outerGeo && (
        <group position={[0, currentHeight, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <lineLoop geometry={outerGeo}>
            <lineBasicMaterial color="#a5f3fc" />
          </lineLoop>
        </group>
      )}

      {/* Extruded 3D Solid */}
      {extrudeGeo && (
        <mesh
          geometry={extrudeGeo}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, 0, 0]}
          castShadow
          receiveShadow
        >
          <meshStandardMaterial
            color={isCompletedPhase ? '#64748b' : '#38bdf8'}
            metalness={isCompletedPhase ? 0.85 : 0.4}
            roughness={isCompletedPhase ? 0.25 : 0.4}
            wireframe={wireframe}
            transparent={xray || isExtrudingPhase}
            opacity={xray ? 0.35 : isExtrudingPhase ? 0.85 : 1.0}
            clipShadows={section}
          />
        </mesh>
      )}

      {/* Dimension HUD Labels */}
      {isSketchPhase && (
        <Html position={[0, 0.4, 3.2]} center>
          <div className="bg-surface/90 border border-accent text-accent px-2 py-1 rounded text-[11px] font-mono shadow-xl flex items-center gap-1.5 whitespace-nowrap">
            <span>📐 Profile Sketch:</span>
            <span className="text-white font-bold">80 mm × 50 mm</span>
            <span className="text-text-secondary">(Ø25 mm Center Pocket)</span>
          </div>
        </Html>
      )}

      {(isExtrudingPhase || isCompletedPhase) && (
        <Html position={[4.5, currentHeight / 2, 0]} center>
          <div className="bg-surface-elevated/95 border border-emerald-400 text-emerald-400 px-2 py-1 rounded text-[11px] font-mono shadow-xl flex flex-col gap-0.5 whitespace-nowrap">
            <span className="font-bold">Extrusion Depth:</span>
            <span className="text-white text-xs font-bold">{(currentHeight * 10).toFixed(1)} mm</span>
            <span className="text-[10px] text-text-secondary">Condition: Blind Normal</span>
          </div>
        </Html>
      )}
    </group>
  );
}
