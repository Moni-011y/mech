import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Float, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

interface Gdt3dFcfProps {
  characteristicSymbol?: string;
  toleranceValue?: number;
  modifier?: string;
  datumA?: string;
  datumB?: string;
  datumC?: string;
  className?: string;
}

function FeatureControlFrame3D({
  characteristicSymbol = '⊕',
  toleranceValue = 0.05,
  modifier = 'MMC',
  datumA = 'A',
  datumB = 'B',
  datumC = 'C',
}: Gdt3dFcfProps) {
  const fcfGroup = useRef<THREE.Group>(null!);

  useFrame(({ clock }) => {
    if (fcfGroup.current) {
      fcfGroup.current.rotation.y = Math.sin(clock.elapsedTime * 0.5) * 0.15;
      fcfGroup.current.rotation.x = Math.cos(clock.elapsedTime * 0.4) * 0.08;
    }
  });

  const frameMat = new THREE.MeshStandardMaterial({
    color: '#1e293b',
    metalness: 0.85,
    roughness: 0.2,
  });

  const textMat = new THREE.MeshStandardMaterial({
    color: '#38bdf8',
    emissive: '#0284c7',
    emissiveIntensity: 0.5,
  });

  const datumMat = new THREE.MeshStandardMaterial({
    color: '#f59e0b',
    emissive: '#b45309',
    emissiveIntensity: 0.4,
  });

  return (
    <group ref={fcfGroup}>
      {/* Outer Feature Control Frame Box */}
      <RoundedBox args={[6.2, 1.4, 0.4]} radius={0.08} smoothness={4} material={frameMat} castShadow receiveShadow>
        {/* Compartment Dividers */}
        <mesh position={[-1.6, 0, 0]}>
          <boxGeometry args={[0.06, 1.35, 0.42]} />
          <meshStandardMaterial color="#475569" metalness={0.9} />
        </mesh>
        <mesh position={[0.6, 0, 0]}>
          <boxGeometry args={[0.06, 1.35, 0.42]} />
          <meshStandardMaterial color="#475569" metalness={0.9} />
        </mesh>
        <mesh position={[1.7, 0, 0]}>
          <boxGeometry args={[0.06, 1.35, 0.42]} />
          <meshStandardMaterial color="#475569" metalness={0.9} />
        </mesh>
        <mesh position={[2.4, 0, 0]}>
          <boxGeometry args={[0.06, 1.35, 0.42]} />
          <meshStandardMaterial color="#475569" metalness={0.9} />
        </mesh>
      </RoundedBox>

      {/* Compartment 1: Symbol */}
      <Text position={[-2.3, 0, 0.22]} fontSize={0.7} material={textMat} font={undefined}>
        {characteristicSymbol}
      </Text>

      {/* Compartment 2: Tolerance + Diameter + Modifier */}
      <group position={[-0.5, 0, 0.22]}>
        <Text fontSize={0.5} material={textMat} font={undefined}>
          {`⌀${toleranceValue.toFixed(2)}`}
        </Text>
        {modifier !== 'RFS' && (
          <group position={[1.1, 0, 0]}>
            <mesh>
              <torusGeometry args={[0.22, 0.04, 16, 32]} />
              <meshStandardMaterial color="#38bdf8" />
            </mesh>
            <Text position={[0, 0, 0.02]} fontSize={0.28} material={textMat} font={undefined}>
              {modifier[0]}
            </Text>
          </group>
        )}
      </group>

      {/* Compartment 3: Primary Datum */}
      <Text position={[1.15, 0, 0.22]} fontSize={0.55} material={datumMat} font={undefined}>
        {datumA}
      </Text>

      {/* Compartment 4: Secondary Datum */}
      <Text position={[2.05, 0, 0.22]} fontSize={0.55} material={datumMat} font={undefined}>
        {datumB}
      </Text>

      {/* Compartment 5: Tertiary Datum */}
      <Text position={[2.8, 0, 0.22]} fontSize={0.55} material={datumMat} font={undefined}>
        {datumC}
      </Text>
    </group>
  );
}

export default function Gdt3dFcf(props: Gdt3dFcfProps) {
  return (
    <div className={`relative bg-slate-950/80 rounded-xl overflow-hidden border border-slate-800 shadow-xl ${props.className || 'w-full h-44'}`}>
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <ambientLight intensity={0.8} />
        <directionalLight position={[4, 6, 4]} intensity={1.5} />
        <directionalLight position={[-4, -3, -2]} intensity={0.5} color="#06b6d4" />

        <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.4}>
          <FeatureControlFrame3D {...props} />
        </Float>

        <OrbitControls enableZoom={false} enablePan={false} />
      </Canvas>
    </div>
  );
}
