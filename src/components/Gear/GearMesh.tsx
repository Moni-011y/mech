import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGearStore } from '../../store/gearStore';
import { useViewerStore } from '../../store/viewerStore';
import { createInvoluteGear } from '../../utils/geometry/involuteGear';
import * as THREE from 'three';

export default function GearMesh() {
  const { teeth, module, pressureAngle, bore, faceWidth } = useGearStore();
  const playing = useViewerStore((s) => s.playing);
  const wireframe = useViewerStore((s) => s.wireframe);
  const xray = useViewerStore((s) => s.xray);

  const meshRef = useRef<THREE.Mesh>(null);

  const geometry = useMemo(() => {
    return createInvoluteGear(teeth, module, pressureAngle, faceWidth, bore);
  }, [teeth, module, pressureAngle, faceWidth, bore]);

  useFrame((_, delta) => {
    if (playing && meshRef.current) {
      meshRef.current.rotation.z += delta * 0.5;
    }
  });

  return (
    <mesh ref={meshRef} geometry={geometry} castShadow receiveShadow>
      <meshStandardMaterial
        color="#16B8A6"
        metalness={0.4}
        roughness={0.3}
        wireframe={wireframe}
        transparent={xray}
        opacity={xray ? 0.4 : 1.0}
      />
    </mesh>
  );
}
