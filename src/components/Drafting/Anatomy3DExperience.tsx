import { useState, useRef, useEffect, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Line, Html } from '@react-three/drei';
import * as THREE from 'three';

// ─── TYPES & DATA ─────────────────────────────────────────────────────────────

export interface AnatomyStepData {
  id: number;
  marker: number;
  title: string;
  subtitle: string;
  badge: string;
  standard: string;
  explanation: string;
  manufacturingSignificance: string;
  cameraPos: [number, number, number];
  cameraTarget: [number, number, number];
  color: string;
}

export const ANATOMY_STEPS: AnatomyStepData[] = [
  {
    id: 1,
    marker: 1,
    title: 'Drawing Sheet',
    subtitle: 'Standardized ISO/ASME Sheet, Borders & Zones',
    badge: 'ISO 5457 / ASME Y14.1',
    standard: 'Standard Sheet Architecture',
    explanation:
      'The drawing sheet provides a standardized layout for presenting manufacturing information, views, dimensions, and technical notes.',
    manufacturingSignificance:
      'Ensures universal legibility across machine shops, suppliers, and CMM inspection rooms. Alphanumeric zoning grids (A–D, 1–4) allow machinists to instantly cross-reference features on multi-page production prints.',
    cameraPos: [0, 4.2, 4.5],
    cameraTarget: [0, 0, 0],
    color: '#14b8a6', // Teal
  },
  {
    id: 2,
    marker: 2,
    title: 'Dimensions & Tolerances',
    subtitle: 'Component Sizes, Limits & Permissible Variation',
    badge: 'ISO 286 / ASME Y14.5',
    standard: 'Linear & Coordinate Tolerancing',
    explanation:
      'Dimensions define the required component size, while tolerances specify the acceptable variation for reliable manufacturing and assembly.',
    manufacturingSignificance:
      'Tolerances control manufacturing cost and functionality. Tight tolerances require precision grinding and CNC milling, while nominal clearances permit cost-effective standard tooling.',
    cameraPos: [0, 3.2, 3.8],
    cameraTarget: [0, 0.2, 0],
    color: '#38bdf8', // Blue
  },
  {
    id: 3,
    marker: 3,
    title: 'GD&T',
    subtitle: 'Geometric Dimensioning & Datum Reference Frames',
    badge: 'ASME Y14.5 / ISO 1101',
    standard: 'Feature Control Frame & Position',
    explanation:
      'GD&T controls geometric variation and defines how features must relate to datums for accurate assembly and inspection.',
    manufacturingSignificance:
      'A position tolerance of ⌀0.05 mm relative to Datums A and B establishes a cylindrical tolerance zone. This guarantees that mating pins or bearings align without binding, preventing costly assembly re-work.',
    cameraPos: [1.8, 3.0, 3.2],
    cameraTarget: [0, 0.3, 0],
    color: '#14b8a6', // Teal
  },
  {
    id: 4,
    marker: 4,
    title: 'Material Specifications',
    subtitle: 'Alloy Grade, Heat Treatment & Hardness',
    badge: 'EN 10083-2 / AISI 1045',
    standard: 'EN8 Unalloyed Carbon Steel',
    explanation:
      'Material specifications identify the required material grade and condition so the component can achieve its intended strength, durability, and manufacturing performance.',
    manufacturingSignificance:
      'Specifying EN8 (080M40) ensures high tensile strength (550–700 MPa) with excellent machinability (60%). Omitting condition or hardness specifications can cause premature fatigue failure or tool chatter.',
    cameraPos: [2.5, 2.6, 2.8],
    cameraTarget: [0, 0.1, 0],
    color: '#a855f7', // Purple/Violet
  },
  {
    id: 5,
    marker: 5,
    title: 'Manufacturing Notes',
    subtitle: 'Surface Roughness Ra 3.2 µm & Shop Instructions',
    badge: 'ISO 1302 / ASME Y14.36',
    standard: 'Texture & Secondary Operations',
    explanation:
      'Manufacturing notes communicate surface finish, edge treatment, welding, coating, and other requirements that affect the final component.',
    manufacturingSignificance:
      'Specifying Ra 3.2 µm on the mounting face allows economical face milling, while breaking sharp edges (0.5×45°) prevents operator cut hazards and stress risers that cause fatigue cracks.',
    cameraPos: [0.8, 2.0, 1.8],
    cameraTarget: [0, 0.4, 0],
    color: '#10b981', // Emerald
  },
  {
    id: 6,
    marker: 6,
    title: 'Title Block',
    subtitle: 'Identity, Scale 1:1, 1st Angle & Sign-offs',
    badge: 'ISO 7200 / ASME Y14.1M',
    standard: 'Document Governance & Traceability',
    explanation:
      'The title block identifies the component and drawing, records essential manufacturing information, and supports traceability and approval.',
    manufacturingSignificance:
      'Acts as the legal contract for production. Contains part numbers, 1st/3rd angle projection symbols, scale ratios, and sign-offs for quality assurance and warranty traceability.',
    cameraPos: [1.5, 3.4, 3.0],
    cameraTarget: [0.6, -0.2, 0.4],
    color: '#38bdf8', // Blue
  },
  {
    id: 7,
    marker: 7,
    title: 'Revision Control',
    subtitle: 'REV 01 Change Tracking & ECO-104 History',
    badge: 'ASME Y14.35 / ISO 11442',
    standard: 'Engineering Change Order (ECO)',
    explanation:
      'Revision control records drawing changes and helps ensure manufacturing uses the correct approved design revision.',
    manufacturingSignificance:
      'Prevents manufacturing obsolete parts. Revision letters (REV 01) and ECO references tie the drawing directly to PLM/ERP systems, ensuring machinists never produce scrap from superseded prints.',
    cameraPos: [-0.6, 2.8, 2.6],
    cameraTarget: [0, 0.2, 0],
    color: '#f97316', // Orange
  },
];

// ─── 3D MACHINED COMPONENT ───────────────────────────────────────────────────

function MachinedMechanicalBlock({
  step,
  progress,
}: {
  step: number;
  progress: number;
}) {
  // Step 7: hole diameter animates from 18mm (0.54 scale) to 20mm (0.6 scale)
  const isRevStep = step === 7;
  const holeRadius = isRevStep
    ? 0.27 + (0.3 - 0.27) * Math.min(1, Math.max(0, (progress - 0.3) / 0.4))
    : 0.3;

  // Extrude shape with center hole and 2 mounting holes
  const shape = useMemo(() => {
    const s = new THREE.Shape();
    const w = 2.4;
    const h = 1.6;
    const r = 0.08;

    // Rounded rectangle path
    s.moveTo(-w / 2 + r, -h / 2);
    s.lineTo(w / 2 - r, -h / 2);
    s.quadraticCurveTo(w / 2, -h / 2, w / 2, -h / 2 + r);
    s.lineTo(w / 2, h / 2 - r);
    s.quadraticCurveTo(w / 2, h / 2, w / 2 - r, h / 2);
    s.lineTo(-w / 2 + r, h / 2);
    s.quadraticCurveTo(-w / 2, h / 2, -w / 2, h / 2 - r);
    s.lineTo(-w / 2, -h / 2 + r);
    s.quadraticCurveTo(-w / 2, -h / 2, -w / 2 + r, -h / 2);

    // Center through-hole
    const centerHole = new THREE.Path();
    centerHole.absarc(0, 0, holeRadius, 0, Math.PI * 2, true);
    s.holes.push(centerHole);

    // Left mounting hole
    const leftHole = new THREE.Path();
    leftHole.absarc(-0.85, 0, 0.12, 0, Math.PI * 2, true);
    s.holes.push(leftHole);

    // Right mounting hole
    const rightHole = new THREE.Path();
    rightHole.absarc(0.85, 0, 0.12, 0, Math.PI * 2, true);
    s.holes.push(rightHole);

    return s;
  }, [holeRadius]);

  const extrudeSettings = useMemo(
    () => ({
      depth: 0.55,
      bevelEnabled: true,
      bevelSegments: 4,
      steps: 1,
      bevelSize: 0.04,
      bevelThickness: 0.04,
    }),
    []
  );

  // Material properties based on step
  const materialProps = useMemo(() => {
    if (step === 4) {
      // Step 4 transitions from neutral grey to realistic micro-brushed EN8 steel
      const t = Math.min(1, Math.max(0, (progress - 0.3) / 0.5));
      return {
        color: new THREE.Color().lerpColors(
          new THREE.Color('#475569'),
          new THREE.Color('#cbd5e1'),
          t
        ),
        metalness: 0.4 + t * 0.52,
        roughness: 0.5 - t * 0.3,
      };
    }
    return {
      color: new THREE.Color('#94a3b8'),
      metalness: 0.88,
      roughness: 0.22,
    };
  }, [step, progress]);

  // Stepped center raised boss geometry
  const bossShape = useMemo(() => {
    const s = new THREE.Shape();
    const bw = 1.3;
    const bh = 1.1;
    const br = 0.06;
    s.moveTo(-bw / 2 + br, -bh / 2);
    s.lineTo(bw / 2 - br, -bh / 2);
    s.quadraticCurveTo(bw / 2, -bh / 2, bw / 2, -bh / 2 + br);
    s.lineTo(bw / 2, bh / 2 - br);
    s.quadraticCurveTo(bw / 2, bh / 2, bw / 2 - br, bh / 2);
    s.lineTo(-bw / 2 + br, bh / 2);
    s.quadraticCurveTo(-bw / 2, bh / 2, -bw / 2, bh / 2 - br);
    s.lineTo(-bw / 2, -bh / 2 + br);
    s.quadraticCurveTo(-bw / 2, -bh / 2, -bw / 2 + br, -bh / 2);

    const centerHole = new THREE.Path();
    centerHole.absarc(0, 0, holeRadius, 0, Math.PI * 2, true);
    s.holes.push(centerHole);
    return s;
  }, [holeRadius]);

  const bossExtrude = useMemo(
    () => ({
      depth: 0.25,
      bevelEnabled: true,
      bevelSegments: 3,
      steps: 1,
      bevelSize: 0.03,
      bevelThickness: 0.03,
    }),
    []
  );

  return (
    <group position={[0, -0.15, 0]}>
      {/* Base block (horizontal orientation) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} castShadow receiveShadow>
        <extrudeGeometry args={[shape, extrudeSettings]} />
        <meshStandardMaterial
          color={materialProps.color}
          metalness={materialProps.metalness}
          roughness={materialProps.roughness}
        />
      </mesh>

      {/* Central stepped boss */}
      <mesh
        position={[0, 0.55, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        castShadow
        receiveShadow
      >
        <extrudeGeometry args={[bossShape, bossExtrude]} />
        <meshStandardMaterial
          color={materialProps.color}
          metalness={materialProps.metalness}
          roughness={materialProps.roughness}
        />
      </mesh>

      {/* Bore cylinder lining with chamfered rim */}
      <mesh position={[0, 0.4, 0]}>
        <cylinderGeometry
          args={[holeRadius + 0.002, holeRadius + 0.002, 0.85, 36, 1, true]}
        />
        <meshStandardMaterial
          color="#64748b"
          metalness={0.92}
          roughness={0.16}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Subtle chamfer rings on holes */}
      <mesh position={[0, 0.83, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[holeRadius, holeRadius + 0.035, 36]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.95} roughness={0.1} />
      </mesh>

      <mesh position={[-0.85, 0.57, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.12, 0.15, 24]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.2} />
      </mesh>

      <mesh position={[0.85, 0.57, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.12, 0.15, 24]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.2} />
      </mesh>
    </group>
  );
}

// ─── STEP 1: DRAWING SHEET VISUAL ─────────────────────────────────────────────

function Step1DrawingSheetVisual({ progress }: { progress: number }) {
  // Border visibility fades in as progress advances
  const borderProgress = Math.min(1, Math.max(0, progress / 0.4));
  const viewsProgress = Math.min(1, Math.max(0, (progress - 0.35) / 0.35));
  const formatProgress = Math.min(1, Math.max(0, (progress - 0.7) / 0.3));

  return (
    <group position={[0, -0.65, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      {/* Outer standardized drawing sheet background */}
      <mesh position={[0, 0, -0.02]} receiveShadow>
        <planeGeometry args={[5.2, 3.6]} />
        <meshStandardMaterial color="#070d18" roughness={0.8} />
      </mesh>

      {/* Sheet Boundary & Zones (Glowing Cyan) */}
      {borderProgress > 0 && (
        <group>
          {/* Outer Border Line */}
          <lineLoop>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                args={[
                  new Float32Array([
                    -2.4 * borderProgress, -1.6 * borderProgress, 0.005,
                    2.4 * borderProgress, -1.6 * borderProgress, 0.005,
                    2.4 * borderProgress, 1.6 * borderProgress, 0.005,
                    -2.4 * borderProgress, 1.6 * borderProgress, 0.005,
                  ]),
                  3,
                ]}
              />
            </bufferGeometry>
            <lineBasicMaterial color="#14b8a6" linewidth={2} />
          </lineLoop>

          {/* Inner 20mm margin frame */}
          <lineLoop>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                args={[
                  new Float32Array([
                    -2.25 * borderProgress, -1.45 * borderProgress, 0.005,
                    2.25 * borderProgress, -1.45 * borderProgress, 0.005,
                    2.25 * borderProgress, 1.45 * borderProgress, 0.005,
                    -2.25 * borderProgress, 1.45 * borderProgress, 0.005,
                  ]),
                  3,
                ]}
              />
            </bufferGeometry>
            <lineBasicMaterial color="#0d9488" linewidth={1} />
          </lineLoop>

          {/* Coordinate zoning marks */}
          {[-1.5, -0.5, 0.5, 1.5].map((x, i) => (
            <Line
              key={`zone-col-${i}`}
              points={[[x, 1.6, 0.005], [x, 1.45, 0.005]]}
              color="#0d9488"
              lineWidth={1}
            />
          ))}
          {[-0.8, 0, 0.8].map((y, i) => (
            <Line
              key={`zone-row-${i}`}
              points={[[-2.4, y, 0.005], [-2.25, y, 0.005]]}
              color="#0d9488"
              lineWidth={1}
            />
          ))}
        </group>
      )}

      {/* Orthographic Projection Views (Top, Front, Side) */}
      {viewsProgress > 0 && (
        <group>
          {/* Top View Outline */}
          <group position={[-1.0, 0.6, 0.01]}>
            <lineLoop>
              <bufferGeometry>
                <bufferAttribute
                  attach="attributes-position"
                  args={[
                    new Float32Array([
                      -0.7, -0.4, 0,
                      0.7, -0.4, 0,
                      0.7, 0.4, 0,
                      -0.7, 0.4, 0,
                    ]),
                    3,
                  ]}
                />
              </bufferGeometry>
              <lineBasicMaterial color="#38bdf8" linewidth={1.5} />
            </lineLoop>
            {/* Center hole circle */}
            <mesh>
              <ringGeometry args={[0.16, 0.18, 24]} />
              <meshBasicMaterial color="#38bdf8" />
            </mesh>
            <Text position={[0, -0.55, 0]} fontSize={0.08} color="#94a3b8">
              TOP VIEW
            </Text>
          </group>

          {/* Front View Outline */}
          <group position={[-1.0, -0.6, 0.01]}>
            <lineLoop>
              <bufferGeometry>
                <bufferAttribute
                  attach="attributes-position"
                  args={[
                    new Float32Array([
                      -0.7, -0.3, 0,
                      0.7, -0.3, 0,
                      0.7, 0.3, 0,
                      -0.7, 0.3, 0,
                    ]),
                    3,
                  ]}
                />
              </bufferGeometry>
              <lineBasicMaterial color="#38bdf8" linewidth={1.5} />
            </lineLoop>
            {/* Raised boss step */}
            <Line
              points={[[-0.35, 0.3, 0], [-0.35, 0.5, 0], [0.35, 0.5, 0], [0.35, 0.3, 0]]}
              color="#38bdf8"
              lineWidth={1.5}
            />
            <Text position={[0, -0.45, 0]} fontSize={0.08} color="#94a3b8">
              FRONT VIEW
            </Text>
          </group>

          {/* Right Side View */}
          <group position={[1.0, -0.6, 0.01]}>
            <lineLoop>
              <bufferGeometry>
                <bufferAttribute
                  attach="attributes-position"
                  args={[
                    new Float32Array([
                      -0.45, -0.3, 0,
                      0.45, -0.3, 0,
                      0.45, 0.3, 0,
                      -0.45, 0.3, 0,
                    ]),
                    3,
                  ]}
                />
              </bufferGeometry>
              <lineBasicMaterial color="#38bdf8" linewidth={1.5} />
            </lineLoop>
            <Text position={[0, -0.45, 0]} fontSize={0.08} color="#94a3b8">
              SIDE VIEW
            </Text>
          </group>
        </group>
      )}

      {/* Sheet Formats Badge (A0 to A4) */}
      {formatProgress > 0 && (
        <group position={[1.2, 1.2, 0.02]}>
          <Text position={[0, 0, 0]} fontSize={0.11} color="#14b8a6">
            ISO 5457 SHEET SIZES
          </Text>
          <Text position={[0, -0.15, 0]} fontSize={0.08} color="#cbd5e1">
            A0: 841×1189 | A1: 594×841 | A2: 420×594
          </Text>
          <Text position={[0, -0.28, 0]} fontSize={0.08} color="#cbd5e1">
            A3: 297×420 (CURRENT) | A4: 210×297 mm
          </Text>
        </group>
      )}
    </group>
  );
}

// ─── STEP 2: DIMENSIONS & TOLERANCES VISUAL ───────────────────────────────────

function Step2DimensionsVisual({ progress }: { progress: number }) {
  const p1 = Math.min(1, Math.max(0, progress / 0.4));
  const p2 = Math.min(1, Math.max(0, (progress - 0.35) / 0.35));
  const p3 = Math.min(1, Math.max(0, (progress - 0.7) / 0.3));

  return (
    <group>
      {/* 1. Overall Length: 120 mm (Front dimension) */}
      {p1 > 0 && (
        <group position={[0, 0, 1.0]}>
          {/* Extension witness lines */}
          <Line points={[[-1.2, 0, -0.1], [-1.2, 0, 0.2]]} color="#38bdf8" lineWidth={1.2} />
          <Line points={[[1.2, 0, -0.1], [1.2, 0, 0.2]]} color="#38bdf8" lineWidth={1.2} />
          {/* Dimension line */}
          <Line
            points={[[-1.2 * p1, 0, 0.15], [1.2 * p1, 0, 0.15]]}
            color="#38bdf8"
            lineWidth={1.5}
          />
          {p1 > 0.6 && (
            <Text position={[0, 0.12, 0.15]} fontSize={0.13} color="#38bdf8" font={undefined}>
              120 ±0.2 mm
            </Text>
          )}
        </group>
      )}

      {/* 2. Overall Width: 80 mm (Side dimension) */}
      {p2 > 0 && (
        <group position={[1.4, 0, 0]}>
          <Line points={[[-0.1, 0, -0.8], [0.2, 0, -0.8]]} color="#38bdf8" lineWidth={1.2} />
          <Line points={[[-0.1, 0, 0.8], [0.2, 0, 0.8]]} color="#38bdf8" lineWidth={1.2} />
          <Line
            points={[[0.15, 0, -0.8 * p2], [0.15, 0, 0.8 * p2]]}
            color="#38bdf8"
            lineWidth={1.5}
          />
          {p2 > 0.6 && (
            <Text
              position={[0.15, 0.12, 0]}
              rotation={[0, Math.PI / 2, 0]}
              fontSize={0.13}
              color="#38bdf8"
            >
              80 ±0.15 mm
            </Text>
          )}
        </group>
      )}

      {/* 3. Hole Diameter: ⌀20 ±0.1 mm with Tolerance Limits */}
      {p3 > 0 && (
        <group position={[0, 0.85, 0]}>
          {/* Leader line from hole center */}
          <Line
            points={[[0, 0, 0], [0.55 * p3, 0.35 * p3, 0], [1.1 * p3, 0.35 * p3, 0]]}
            color="#14b8a6"
            lineWidth={2}
          />
          <mesh position={[0, 0, 0]}>
            <sphereGeometry args={[0.04, 16, 16]} />
            <meshBasicMaterial color="#14b8a6" />
          </mesh>
          {p3 > 0.5 && (
            <group position={[1.15, 0.35, 0]}>
              <Text position={[0, 0.08, 0]} fontSize={0.13} color="#14b8a6" anchorX="left">
                ⌀20 ±0.1 mm
              </Text>
              <Text position={[0, -0.06, 0]} fontSize={0.09} color="#94a3b8" anchorX="left">
                Limit: [19.90 – 20.10 mm]
              </Text>
            </group>
          )}
        </group>
      )}
    </group>
  );
}

// ─── STEP 3: GD&T VISUAL ──────────────────────────────────────────────────────

function Step3GdtVisual({ progress }: { progress: number }) {
  const p1 = Math.min(1, Math.max(0, progress / 0.35));
  const p2 = Math.min(1, Math.max(0, (progress - 0.3) / 0.35));
  const p3 = Math.min(1, Math.max(0, (progress - 0.65) / 0.35));

  return (
    <group>
      {/* 1. Datum A (Primary Datum Plane on Bottom Surface) */}
      {p1 > 0 && (
        <group position={[0, -0.16, 0]}>
          {/* Translucent Datum Plane */}
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[2.7 * p1, 1.9 * p1]} />
            <meshStandardMaterial
              color="#14b8a6"
              transparent
              opacity={0.25}
              side={THREE.DoubleSide}
            />
          </mesh>
          <Line
            points={[[-1.35, 0, 0.95], [-1.35, -0.4, 0.95]]}
            color="#14b8a6"
            lineWidth={2}
          />
          {p1 > 0.5 && (
            <group position={[-1.35, -0.45, 0.95]}>
              {/* Datum Flag [A] */}
              <mesh>
                <boxGeometry args={[0.3, 0.2, 0.05]} />
                <meshStandardMaterial color="#0f172a" />
              </mesh>
              <Text position={[0, 0, 0.03]} fontSize={0.12} color="#14b8a6">
                DATUM A
              </Text>
            </group>
          )}
        </group>
      )}

      {/* 2. Datum B (Secondary Datum Plane on Left Wing Face) */}
      {p2 > 0 && (
        <group position={[-1.25, 0.25, 0]}>
          <mesh rotation={[0, Math.PI / 2, 0]}>
            <planeGeometry args={[1.8 * p2, 0.8 * p2]} />
            <meshStandardMaterial
              color="#38bdf8"
              transparent
              opacity={0.25}
              side={THREE.DoubleSide}
            />
          </mesh>
          {p2 > 0.5 && (
            <group position={[-0.2, 0.5, 0]}>
              <mesh>
                <boxGeometry args={[0.3, 0.2, 0.05]} />
                <meshStandardMaterial color="#0f172a" />
              </mesh>
              <Text position={[0, 0, 0.03]} fontSize={0.12} color="#38bdf8">
                DATUM B
              </Text>
            </group>
          )}
        </group>
      )}

      {/* 3. Cylindrical Tolerance Zone (⌀0.05 mm cylinder around hole axis) & FCF */}
      {p3 > 0 && (
        <group position={[0, 0.4, 0]}>
          {/* Axis Centerline */}
          <Line
            points={[[0, -0.8 * p3, 0], [0, 0.8 * p3, 0]]}
            color="#f59e0b"
            lineWidth={2}
            dashed
            dashScale={10}
          />
          {/* Cylindrical tolerance envelope */}
          <mesh>
            <cylinderGeometry args={[0.07, 0.07, 1.1 * p3, 24, 1, true]} />
            <meshStandardMaterial
              color="#14b8a6"
              transparent
              opacity={0.35}
              wireframe
              side={THREE.DoubleSide}
            />
          </mesh>

          {/* Feature Control Frame Banner */}
          {p3 > 0.5 && (
            <group position={[0.6, 0.6, 0]}>
              {/* Leader to hole axis */}
              <Line points={[[-0.6, 0, 0], [0, 0, 0]]} color="#14b8a6" lineWidth={2} />
              {/* FCF Box: [ ⌖ | ⌀0.05 Ⓜ | A | B ] */}
              <mesh position={[0.6, 0, 0]}>
                <boxGeometry args={[1.2, 0.28, 0.04]} />
                <meshStandardMaterial color="#020617" />
              </mesh>
              <Text position={[0.6, 0, 0.03]} fontSize={0.11} color="#14b8a6">
                ⌖ | ⌀0.05 Ⓜ | A | B
              </Text>
              <Text position={[0.6, -0.22, 0]} fontSize={0.08} color="#94a3b8">
                Cylindrical Zone ⌀0.05 mm
              </Text>
            </group>
          )}
        </group>
      )}
    </group>
  );
}

// ─── STEP 4: MATERIAL SPECIFICATIONS VISUAL ───────────────────────────────────

function Step4MaterialVisual({ progress }: { progress: number }) {
  const p1 = Math.min(1, Math.max(0, progress / 0.5));
  const p2 = Math.min(1, Math.max(0, (progress - 0.45) / 0.55));

  return (
    <group position={[0, 1.1, 0]}>
      {/* 1. Material Callout Banner */}
      {p1 > 0 && (
        <group position={[0, 0.2 * p1, 0]}>
          <Line points={[[0, -0.5, 0], [0, 0, 0], [0.6 * p1, 0, 0]]} color="#a855f7" lineWidth={2} />
          {p1 > 0.5 && (
            <group position={[0.7, 0, 0]}>
              <mesh position={[0.8, 0, 0]}>
                <boxGeometry args={[1.7, 0.32, 0.04]} />
                <meshStandardMaterial color="#0f172a" />
              </mesh>
              <Text position={[0.8, 0.05, 0.03]} fontSize={0.11} color="#c084fc">
                MATL: EN8 (080M40) CARBON STEEL
              </Text>
              <Text position={[0.8, -0.07, 0.03]} fontSize={0.08} color="#94a3b8">
                Condition: Normalized / Quenched & Tempered
              </Text>
            </group>
          )}
        </group>
      )}

      {/* 2. Floating Metallurgical Properties Table */}
      {p2 > 0 && (
        <group position={[-1.2, 0.2, 0]}>
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[1.6, 0.7, 0.04]} />
            <meshStandardMaterial color="#090d16" />
          </mesh>
          <Text position={[0, 0.24, 0.03]} fontSize={0.09} color="#c084fc">
            EN8 SPECIFICATIONS
          </Text>
          <Text position={[0, 0.1, 0.03]} fontSize={0.075} color="#cbd5e1">
            Tensile Strength: 550 – 700 MPa
          </Text>
          <Text position={[0, -0.02, 0.03]} fontSize={0.075} color="#cbd5e1">
            Yield Strength: 280 MPa min
          </Text>
          <Text position={[0, -0.14, 0.03]} fontSize={0.075} color="#cbd5e1">
            Hardness: 200 – 255 HB | Machinability: 60%
          </Text>
        </group>
      )}
    </group>
  );
}

// ─── STEP 5: MANUFACTURING NOTES VISUAL ───────────────────────────────────────

function Step5ManufacturingNotesVisual({ progress }: { progress: number }) {
  const p1 = Math.min(1, Math.max(0, progress / 0.4));
  const p2 = Math.min(1, Math.max(0, (progress - 0.3) / 0.4));
  const p3 = Math.min(1, Math.max(0, (progress - 0.65) / 0.35));

  return (
    <group>
      {/* 1. Surface Roughness Symbol on Top Milled Face (Ra 3.2 µm) */}
      {p1 > 0 && (
        <group position={[0.6, 0.85, 0.4]}>
          {/* Surface finish checkmark triangle */}
          <Line
            points={[[-0.15, 0.25, 0], [0, 0, 0], [0.3 * p1, 0.4 * p1, 0]]}
            color="#10b981"
            lineWidth={2.5}
          />
          {p1 > 0.6 && (
            <group position={[0.35, 0.4, 0]}>
              <Text position={[0, 0, 0]} fontSize={0.12} color="#10b981">
                Ra 3.2 µm
              </Text>
              <Text position={[0, -0.12, 0]} fontSize={0.08} color="#94a3b8">
                (Face Milled)
              </Text>
            </group>
          )}
        </group>
      )}

      {/* 2. Simulated CNC Milling Toolpath Sweep across top face */}
      {p2 > 0 && (
        <group position={[0, 0.81, 0]}>
          {[-0.4, -0.2, 0, 0.2, 0.4].map((z, idx) => (
            <Line
              key={`toolpath-${idx}`}
              points={[[-0.6 * p2, 0, z], [0.6 * p2, 0, z]]}
              color="#34d399"
              lineWidth={1}
            />
          ))}
          {/* Cutter head icon simulation */}
          <mesh position={[0.6 * (p2 * 2 - 1), 0.05, 0]}>
            <cylinderGeometry args={[0.1, 0.1, 0.1, 16]} />
            <meshStandardMaterial color="#10b981" wireframe />
          </mesh>
        </group>
      )}

      {/* 3. Shop Notes Banner */}
      {p3 > 0 && (
        <group position={[-1.1, 0.85, 0]}>
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[1.5, 0.6, 0.04]} />
            <meshStandardMaterial color="#090d16" />
          </mesh>
          <Text position={[0, 0.18, 0.03]} fontSize={0.09} color="#34d399">
            SHOP NOTES
          </Text>
          <Text position={[0, 0.04, 0.03]} fontSize={0.075} color="#cbd5e1">
            1. All sharp edges broken 0.5 × 45°
          </Text>
          <Text position={[0, -0.08, 0.03]} fontSize={0.075} color="#cbd5e1">
            2. Bore finish Ra 1.6 µm (Reamed)
          </Text>
          <Text position={[0, -0.2, 0.03]} fontSize={0.075} color="#cbd5e1">
            3. Deburr & degrease prior to CMM
          </Text>
        </group>
      )}
    </group>
  );
}

// ─── STEP 6: TITLE BLOCK VISUAL ───────────────────────────────────────────────

function Step6TitleBlockVisual({ progress }: { progress: number }) {
  const p1 = Math.min(1, Math.max(0, progress / 0.35));
  const p2 = Math.min(1, Math.max(0, (progress - 0.3) / 0.35));
  const p3 = Math.min(1, Math.max(0, (progress - 0.65) / 0.35));

  return (
    <group position={[0.8, -0.35, 0.9]} rotation={[-0.4, 0, 0]}>
      {/* 1. Title Block Frame */}
      {p1 > 0 && (
        <group>
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[1.9 * p1, 1.0 * p1, 0.03]} />
            <meshStandardMaterial color="#020617" />
          </mesh>
          <lineLoop>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                args={[
                  new Float32Array([
                    -0.95 * p1, -0.5 * p1, 0.02,
                    0.95 * p1, -0.5 * p1, 0.02,
                    0.95 * p1, 0.5 * p1, 0.02,
                    -0.95 * p1, 0.5 * p1, 0.02,
                  ]),
                  3,
                ]}
              />
            </bufferGeometry>
            <lineBasicMaterial color="#38bdf8" linewidth={2} />
          </lineLoop>
        </group>
      )}

      {/* 2. Title, Part No, Scale, Projection Fields */}
      {p2 > 0 && (
        <group position={[0, 0.15, 0.025]}>
          <Text position={[0, 0.18, 0]} fontSize={0.1} color="#38bdf8">
            MOUNTING BEARING BASE
          </Text>
          <Text position={[0, 0.05, 0]} fontSize={0.08} color="#cbd5e1">
            DWG NO: DWG-MBB-2026-001 | REV 01
          </Text>
          <Text position={[0, -0.07, 0]} fontSize={0.075} color="#94a3b8">
            SCALE: 1:1 | UNITS: mm | PROJ: 1st ANGLE [◎⊞]
          </Text>
        </group>
      )}

      {/* 3. Approvals and Sign-offs */}
      {p3 > 0 && (
        <group position={[0, -0.22, 0.025]}>
          <Line points={[[-0.9, 0.08, 0], [0.9, 0.08, 0]]} color="#38bdf8" lineWidth={1} />
          <Text position={[-0.55, -0.02, 0]} fontSize={0.07} color="#94a3b8">
            DRAWN: J. MILLER
          </Text>
          <Text position={[0, -0.02, 0]} fontSize={0.07} color="#94a3b8">
            CHECKED: D. KUMAR
          </Text>
          <Text position={[0.55, -0.02, 0]} fontSize={0.07} color="#94a3b8">
            APPVD: M. ROSS
          </Text>
        </group>
      )}
    </group>
  );
}

// ─── STEP 7: REVISION CONTROL VISUAL ──────────────────────────────────────────

function Step7RevisionVisual({ progress }: { progress: number }) {
  const p1 = Math.min(1, Math.max(0, progress / 0.35));
  const p2 = Math.min(1, Math.max(0, (progress - 0.3) / 0.35));
  const p3 = Math.min(1, Math.max(0, (progress - 0.65) / 0.35));

  return (
    <group>
      {/* 1. Revision Callout on Hole: ⌀18 -> ⌀20 mm (Orange Highlight) */}
      {p1 > 0 && (
        <group position={[0, 0.9, 0]}>
          <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.26, 0.34, 36]} />
            <meshBasicMaterial color="#f97316" transparent opacity={0.8} />
          </mesh>
          <Line
            points={[[0, 0, 0], [0.6 * p1, 0.4 * p1, 0], [1.2 * p1, 0.4 * p1, 0]]}
            color="#f97316"
            lineWidth={2.5}
          />
          {p1 > 0.6 && (
            <group position={[1.25, 0.4, 0]}>
              <Text position={[0, 0.08, 0]} fontSize={0.12} color="#f97316" anchorX="left">
                MODIFIED: ⌀18.0 → ⌀20.0 mm
              </Text>
              <Text position={[0, -0.06, 0]} fontSize={0.085} color="#fdba74" anchorX="left">
                REV 01: Increased for bearing press fit
              </Text>
            </group>
          )}
        </group>
      )}

      {/* 2. Revision Table Banner in Upper Right */}
      {p2 > 0 && (
        <group position={[-1.1, 1.0, 0]}>
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[1.8 * p2, 0.7 * p2, 0.04]} />
            <meshStandardMaterial color="#0f172a" />
          </mesh>
          <lineLoop>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                args={[
                  new Float32Array([
                    -0.9 * p2, -0.35 * p2, 0.025,
                    0.9 * p2, -0.35 * p2, 0.025,
                    0.9 * p2, 0.35 * p2, 0.025,
                    -0.9 * p2, 0.35 * p2, 0.025,
                  ]),
                  3,
                ]}
              />
            </bufferGeometry>
            <lineBasicMaterial color="#f97316" linewidth={2} />
          </lineLoop>
          {p2 > 0.6 && (
            <group position={[0, 0, 0.03]}>
              <Text position={[0, 0.22, 0]} fontSize={0.09} color="#f97316">
                REVISION TABLE (ASME Y14.35)
              </Text>
              <Text position={[0, 0.08, 0]} fontSize={0.08} color="#fdba74">
                REV 01 | ZONE: B3 | ECO-2026-104
              </Text>
              <Text position={[0, -0.06, 0]} fontSize={0.075} color="#cbd5e1">
                Desc: Bore enlarged ⌀18 to ⌀20 mm
              </Text>
              <Text position={[0, -0.18, 0]} fontSize={0.07} color="#94a3b8">
                Date: 2026-10-24 | Appvd: M. Ross
              </Text>
            </group>
          )}
        </group>
      )}

      {/* 3. ECO Reference Badge */}
      {p3 > 0 && (
        <group position={[0, -0.5, 1.2]}>
          <Text position={[0, 0, 0]} fontSize={0.11} color="#f97316">
            ENGINEERING CHANGE ORDER ECO-104 ACTIVE
          </Text>
        </group>
      )}
    </group>
  );
}

// ─── CAMERA RIG ───────────────────────────────────────────────────────────────

function CameraRig({
  selectedStep,
  viewPreset,
}: {
  selectedStep: number;
  viewPreset: 'iso' | 'top' | 'front';
}) {
  const currentStepData = ANATOMY_STEPS.find((s) => s.id === selectedStep) || ANATOMY_STEPS[0];

  useFrame(({ camera }) => {
    let targetPos: THREE.Vector3;
    let targetLook: THREE.Vector3;

    if (viewPreset === 'top') {
      targetPos = new THREE.Vector3(0, 5.0, 0.01);
      targetLook = new THREE.Vector3(0, 0, 0);
    } else if (viewPreset === 'front') {
      targetPos = new THREE.Vector3(0, 0.5, 4.2);
      targetLook = new THREE.Vector3(0, 0.3, 0);
    } else {
      // Default to step's tuned isometric camera coordinates
      targetPos = new THREE.Vector3(...currentStepData.cameraPos);
      targetLook = new THREE.Vector3(...currentStepData.cameraTarget);
    }

    camera.position.lerp(targetPos, 0.06);
    camera.lookAt(targetLook);
  });

  return null;
}

// ─── MAIN ANATOMY 3D EXPERIENCE EXPORT ────────────────────────────────────────

export default function Anatomy3DExperience() {
  const [selectedStep, setSelectedStep] = useState<number>(1);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [progress, setProgress] = useState<number>(0);
  const [viewPreset, setViewPreset] = useState<'iso' | 'top' | 'front'>('iso');
  const [show2dOverlay, setShow2dOverlay] = useState<boolean>(true);

  const stepDuration = 5000; // 5 seconds per step animation
  const lastTimeRef = useRef<number>(Date.now());

  // Animation timeline ticker
  useEffect(() => {
    let animId: number;
    lastTimeRef.current = Date.now();

    const loop = () => {
      const now = Date.now();
      const delta = now - lastTimeRef.current;
      lastTimeRef.current = now;

      if (isPlaying) {
        setProgress((prev) => {
          const next = prev + delta / stepDuration;
          if (next >= 1.0) {
            return 1.0; // Hold at finished state for examination
          }
          return next;
        });
      }
      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [isPlaying, stepDuration]);

  // Handle step selection from markers or cards
  const handleSelectStep = (stepId: number) => {
    setSelectedStep(stepId);
    setProgress(0); // Reset animation to beginning of step
    setIsPlaying(true); // Auto-start the selected step's sequence
  };

  const handleReplay = () => {
    setProgress(0);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    const prev = selectedStep > 1 ? selectedStep - 1 : 7;
    handleSelectStep(prev);
  };

  const handleNext = () => {
    const next = selectedStep < 7 ? selectedStep + 1 : 1;
    handleSelectStep(next);
  };

  const currentStep = ANATOMY_STEPS.find((s) => s.id === selectedStep) || ANATOMY_STEPS[0];

  return (
    <div className="space-y-6">
      {/* Grid: 3D Viewport on Left (lg:col-span-8), 7 Steps List on Right (lg:col-span-4) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ─── LEFT COLUMN: 3D VIEWPORT & CONTROLS ─── */}
        <div className="lg:col-span-8 space-y-4">
          {/* Viewport Card */}
          <div className="relative bg-[#050811] rounded-2xl border-2 border-accent/40 shadow-2xl overflow-hidden flex flex-col">
            {/* Top Toolbar / Badge Bar */}
            <div className="p-3 sm:p-4 bg-slate-900/90 backdrop-blur-md border-b border-border/70 flex flex-wrap items-center justify-between gap-2 z-10">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-accent animate-pulse shadow-[0_0_8px_#14b8a6]" />
                <span className="text-xs font-mono font-bold text-accent tracking-wider uppercase">
                  STEP {currentStep.marker} OF 7 · {currentStep.title}
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-mono bg-accent/10 border border-accent/30 text-accent">
                  {currentStep.badge}
                </span>
              </div>

              {/* View Presets & 2D Overlay Toggle */}
              <div className="flex items-center gap-1.5 text-xs font-mono">
                <button
                  onClick={() => setViewPreset('iso')}
                  className={`px-2.5 py-1 rounded-lg border transition ${
                    viewPreset === 'iso'
                      ? 'bg-accent text-background font-bold border-accent'
                      : 'bg-surface-elevated text-text-secondary border-border hover:border-accent/40'
                  }`}
                  title="Isometric CAD View"
                >
                  3D ISO
                </button>
                <button
                  onClick={() => setViewPreset('top')}
                  className={`px-2.5 py-1 rounded-lg border transition ${
                    viewPreset === 'top'
                      ? 'bg-accent text-background font-bold border-accent'
                      : 'bg-surface-elevated text-text-secondary border-border hover:border-accent/40'
                  }`}
                  title="Top Orthographic View"
                >
                  TOP
                </button>
                <button
                  onClick={() => setViewPreset('front')}
                  className={`px-2.5 py-1 rounded-lg border transition ${
                    viewPreset === 'front'
                      ? 'bg-accent text-background font-bold border-accent'
                      : 'bg-surface-elevated text-text-secondary border-border hover:border-accent/40'
                  }`}
                  title="Front Orthographic View"
                >
                  FRONT
                </button>

                <button
                  onClick={() => setShow2dOverlay(!show2dOverlay)}
                  className={`px-2.5 py-1 rounded-lg border transition flex items-center gap-1 ${
                    show2dOverlay
                      ? 'bg-sky-500/20 text-sky-300 border-sky-500/50'
                      : 'bg-surface-elevated text-text-secondary border-border'
                  }`}
                  title="Toggle 2D Blueprint Markers Overlay"
                >
                  <span>📐</span>
                  <span className="hidden md:inline">2D Markers:</span>
                  <span>{show2dOverlay ? 'ON' : 'OFF'}</span>
                </button>
              </div>
            </div>

            {/* Canvas Container with Overlaid Interactive 2D Blueprint Markers */}
            <div className="relative w-full h-[380px] sm:h-[460px] bg-gradient-to-b from-slate-950 via-[#070b14] to-black">
              {/* R3F Canvas */}
              <Canvas
                shadows
                camera={{ position: [0, 3.5, 4.5], fov: 42 }}
                gl={{ antialias: true }}
              >
                {/* Studio Lighting */}
                <ambientLight intensity={0.55} />
                <directionalLight
                  position={[6, 9, 6]}
                  intensity={1.8}
                  castShadow
                  shadow-mapSize-width={1024}
                  shadow-mapSize-height={1024}
                />
                <directionalLight position={[-6, 4, -4]} intensity={0.7} color="#38bdf8" />
                <pointLight position={[0, 4, 3]} intensity={0.9} color="#14b8a6" />

                {/* Ground grid */}
                <gridHelper args={[8, 16, '#0f2233', '#0a1a28']} position={[0, -0.65, 0]} />

                {/* Camera Rig that smoothly shifts focus for each step */}
                <CameraRig selectedStep={selectedStep} viewPreset={viewPreset} />

                {/* Main 3D Component */}
                <MachinedMechanicalBlock step={selectedStep} progress={progress} />

                {/* Step-Specific Progressive Visualizations */}
                {selectedStep === 1 && <Step1DrawingSheetVisual progress={progress} />}
                {selectedStep === 2 && <Step2DimensionsVisual progress={progress} />}
                {selectedStep === 3 && <Step3GdtVisual progress={progress} />}
                {selectedStep === 4 && <Step4MaterialVisual progress={progress} />}
                {selectedStep === 5 && <Step5ManufacturingNotesVisual progress={progress} />}
                {selectedStep === 6 && <Step6TitleBlockVisual progress={progress} />}
                {selectedStep === 7 && <Step7RevisionVisual progress={progress} />}

                <OrbitControls
                  enablePan={true}
                  enableZoom={true}
                  enableRotate={true}
                  minDistance={1.8}
                  maxDistance={8}
                />
              </Canvas>

              {/* 2D Interactive Blueprint Markers Overlay */}
              {show2dOverlay && (
                <div className="absolute inset-0 pointer-events-none p-4 flex flex-col justify-between">
                  {/* Top Bar with Drawing Grid Coordinates & Revision Marker (7) */}
                  <div className="flex justify-between items-center text-[10px] font-mono text-accent/60 bg-slate-950/40 backdrop-blur-sm p-1.5 rounded-lg border border-accent/20">
                    <div className="flex items-center gap-3">
                      <span className="text-accent font-bold">ZONE A1</span>
                      <span>ZONE B2</span>
                      <span>ZONE C3</span>
                      <span>ZONE D4</span>
                    </div>

                    {/* Marker 7: Revision Table */}
                    <button
                      onClick={() => handleSelectStep(7)}
                      className={`pointer-events-auto flex items-center gap-1.5 px-2 py-1 rounded-lg border transition ${
                        selectedStep === 7
                          ? 'bg-orange-500 text-slate-950 font-bold border-orange-400 shadow-[0_0_12px_#f97316]'
                          : 'bg-slate-900/80 text-orange-400 border-orange-500/50 hover:bg-orange-500/20'
                      }`}
                      title="Step 7: Revision Control (REV 01 • ECO-104)"
                    >
                      <span className="w-4 h-4 rounded-full bg-orange-400 text-slate-950 text-[10px] font-bold flex items-center justify-center">
                        7
                      </span>
                      <span className="text-[10px] font-bold">REV 01 · ECO-104</span>
                    </button>
                  </div>

                  {/* Center Area with Interactive Numbered Markers (1 to 5) */}
                  <div className="relative w-full h-full flex items-center justify-center pointer-events-none">
                    {/* Marker 1: Drawing Sheet (Top Left) */}
                    <button
                      onClick={() => handleSelectStep(1)}
                      className={`absolute top-4 left-4 pointer-events-auto w-8 h-8 rounded-full flex items-center justify-center font-mono font-bold text-xs border-2 shadow-lg transition-transform hover:scale-110 ${
                        selectedStep === 1
                          ? 'bg-accent text-slate-950 border-white shadow-[0_0_15px_#14b8a6] scale-110'
                          : 'bg-slate-900/90 text-accent border-accent hover:bg-accent/20'
                      }`}
                      title="Step 1: Drawing Sheet Standards"
                    >
                      1
                    </button>

                    {/* Marker 2: Dimensions & Tolerances (Top Center) */}
                    <button
                      onClick={() => handleSelectStep(2)}
                      className={`absolute top-4 pointer-events-auto w-8 h-8 rounded-full flex items-center justify-center font-mono font-bold text-xs border-2 shadow-lg transition-transform hover:scale-110 ${
                        selectedStep === 2
                          ? 'bg-sky-400 text-slate-950 border-white shadow-[0_0_15px_#38bdf8] scale-110'
                          : 'bg-slate-900/90 text-sky-400 border-sky-400 hover:bg-sky-500/20'
                      }`}
                      title="Step 2: Dimensions & Tolerances"
                    >
                      2
                    </button>

                    {/* Marker 3: GD&T (Center Right) */}
                    <button
                      onClick={() => handleSelectStep(3)}
                      className={`absolute right-6 top-1/3 pointer-events-auto w-8 h-8 rounded-full flex items-center justify-center font-mono font-bold text-xs border-2 shadow-lg transition-transform hover:scale-110 ${
                        selectedStep === 3
                          ? 'bg-accent text-slate-950 border-white shadow-[0_0_15px_#14b8a6] scale-110'
                          : 'bg-slate-900/90 text-accent border-accent hover:bg-accent/20'
                      }`}
                      title="Step 3: GD&T Feature Control"
                    >
                      3
                    </button>

                    {/* Marker 4: Material Specification (Bottom Left) */}
                    <button
                      onClick={() => handleSelectStep(4)}
                      className={`absolute bottom-6 left-6 pointer-events-auto flex items-center gap-1.5 px-2.5 py-1 rounded-xl font-mono text-xs border-2 shadow-lg transition-transform hover:scale-105 ${
                        selectedStep === 4
                          ? 'bg-purple-500 text-slate-950 font-bold border-white shadow-[0_0_15px_#a855f7]'
                          : 'bg-slate-900/90 text-purple-300 border-purple-500/60 hover:bg-purple-500/20'
                      }`}
                      title="Step 4: Material Specifications"
                    >
                      <span className="w-5 h-5 rounded-full bg-purple-400 text-slate-950 font-bold flex items-center justify-center text-[11px]">
                        4
                      </span>
                      <span className="hidden sm:inline">MATL: EN8 STEEL</span>
                    </button>

                    {/* Marker 5: Manufacturing Notes (Bottom Center-Left) */}
                    <button
                      onClick={() => handleSelectStep(5)}
                      className={`absolute bottom-6 left-1/3 pointer-events-auto flex items-center gap-1.5 px-2.5 py-1 rounded-xl font-mono text-xs border-2 shadow-lg transition-transform hover:scale-105 ${
                        selectedStep === 5
                          ? 'bg-emerald-500 text-slate-950 font-bold border-white shadow-[0_0_15px_#10b981]'
                          : 'bg-slate-900/90 text-emerald-300 border-emerald-500/60 hover:bg-emerald-500/20'
                      }`}
                      title="Step 5: Manufacturing Notes"
                    >
                      <span className="w-5 h-5 rounded-full bg-emerald-400 text-slate-950 font-bold flex items-center justify-center text-[11px]">
                        5
                      </span>
                      <span className="hidden sm:inline">FINISH: Ra 3.2 µm</span>
                    </button>

                    {/* Marker 6: Title Block (Bottom Right) */}
                    <button
                      onClick={() => handleSelectStep(6)}
                      className={`absolute bottom-6 right-6 pointer-events-auto flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-mono text-xs border-2 shadow-lg transition-transform hover:scale-105 ${
                        selectedStep === 6
                          ? 'bg-sky-400 text-slate-950 font-bold border-white shadow-[0_0_15px_#38bdf8]'
                          : 'bg-slate-900/90 text-sky-300 border-sky-400/60 hover:bg-sky-400/20'
                      }`}
                      title="Step 6: Title Block (ISO 7200)"
                    >
                      <span className="w-5 h-5 rounded-full bg-sky-400 text-slate-950 font-bold flex items-center justify-center text-[11px]">
                        6
                      </span>
                      <span>TITLE BLOCK</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Viewport instruction label */}
              <div className="absolute bottom-2 left-3 text-[9px] font-mono text-accent/50 bg-black/60 px-2 py-0.5 rounded border border-accent/10 backdrop-blur pointer-events-none">
                3D CAD · DRAG TO ROTATE · SCROLL TO ZOOM · CLICK ANY MARKER
              </div>
            </div>

            {/* Bottom Playback & Timeline Controls Bar */}
            <div className="p-3 sm:p-4 bg-slate-950/95 border-t border-border flex flex-col gap-3">
              {/* Timeline Progress Bar */}
              <div className="space-y-1">
                <div className="flex justify-between items-center text-[11px] font-mono text-text-secondary">
                  <span>ANIMATION PROGRESS</span>
                  <span className="text-accent font-bold">
                    {Math.round(progress * 100)}% COMPLETE
                  </span>
                </div>
                <div className="relative w-full h-2 bg-slate-800 rounded-full overflow-hidden cursor-pointer">
                  <div
                    className="h-full bg-gradient-to-r from-teal-500 via-sky-400 to-accent transition-all duration-100"
                    style={{ width: `${progress * 100}%` }}
                  />
                </div>
              </div>

              {/* Controls Row */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                {/* Play, Replay, Prev, Next Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="px-3.5 py-1.5 rounded-xl bg-accent hover:bg-accent-bright text-slate-950 font-mono font-bold text-xs flex items-center gap-1.5 shadow-md transition"
                    title={isPlaying ? 'Pause Animation' : 'Play Animation'}
                  >
                    <span>{isPlaying ? '⏸' : '▶'}</span>
                    <span>{isPlaying ? 'PAUSE' : 'PLAY'}</span>
                  </button>

                  <button
                    onClick={handleReplay}
                    className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-border text-xs font-mono transition flex items-center gap-1"
                    title="Replay Current Step Sequence"
                  >
                    <span>↺</span>
                    <span>REPLAY</span>
                  </button>

                  <button
                    onClick={handlePrev}
                    className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-border text-xs font-mono transition"
                    title="Previous Step"
                  >
                    ← PREV
                  </button>

                  <button
                    onClick={handleNext}
                    className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-accent border border-accent/40 text-xs font-mono transition"
                    title="Next Step"
                  >
                    NEXT →
                  </button>
                </div>

                {/* Reset Camera button */}
                <button
                  onClick={() => setViewPreset('iso')}
                  className="px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-text-secondary hover:text-white border border-border text-xs font-mono transition flex items-center gap-1"
                  title="Reset Camera View to Default"
                >
                  <span>⟲</span>
                  <span>RESET CAMERA</span>
                </button>
              </div>
            </div>
          </div>

          {/* Active Step Technical Explanation Card */}
          <div className="p-5 rounded-2xl bg-surface border border-accent/40 shadow-xl space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/60 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-accent text-slate-950 text-xs font-bold font-mono flex items-center justify-center">
                  {currentStep.marker}
                </span>
                <h3 className="text-base sm:text-lg font-bold text-text-primary">
                  {currentStep.title}
                </h3>
              </div>
              <span className="text-xs font-mono px-2.5 py-0.5 rounded bg-accent/10 border border-accent/30 text-accent font-semibold">
                {currentStep.standard}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-text-primary leading-relaxed">
              {currentStep.explanation}
            </p>

            <div className="p-3 bg-surface-elevated rounded-xl border border-border/80 text-xs text-text-secondary space-y-1">
              <strong className="text-accent text-xs font-mono block uppercase">
                Why it matters in manufacturing:
              </strong>
              <p className="leading-relaxed">{currentStep.manufacturingSignificance}</p>
            </div>
          </div>
        </div>

        {/* ─── RIGHT COLUMN: 7 CLICKABLE STEP CARDS ─── */}
        <div className="lg:col-span-4 space-y-2.5">
          <div className="flex items-center justify-between pb-1">
            <span className="text-xs font-mono font-bold text-accent uppercase tracking-wider">
              MANUFACTURING DRAWING STEPS (7)
            </span>
            <span className="text-[10px] font-mono text-text-secondary">CLICK ANY STEP</span>
          </div>

          {ANATOMY_STEPS.map((step) => {
            const isSelected = selectedStep === step.id;
            return (
              <div
                key={step.id}
                onClick={() => handleSelectStep(step.id)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer group flex items-start gap-3 select-none ${
                  isSelected
                    ? 'bg-gradient-to-r from-accent/20 via-slate-900 to-surface border-accent shadow-lg shadow-accent/10 scale-[1.01]'
                    : 'bg-surface hover:bg-surface-elevated border-border/80 hover:border-accent/40'
                }`}
              >
                {/* Number Badge */}
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono text-xs font-bold shrink-0 transition-transform ${
                    isSelected
                      ? 'bg-accent text-slate-950 shadow-[0_0_10px_#14b8a6] scale-110'
                      : 'bg-surface-elevated text-accent border border-accent/30 group-hover:border-accent'
                  }`}
                >
                  {step.marker}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <h4
                      className={`text-xs sm:text-sm font-bold truncate transition ${
                        isSelected ? 'text-accent' : 'text-text-primary group-hover:text-accent'
                      }`}
                    >
                      {step.title}
                    </h4>
                    {isSelected && (
                      <span className="w-2 h-2 rounded-full bg-accent animate-ping shrink-0" />
                    )}
                  </div>
                  <p
                    className={`text-[11px] line-clamp-2 mt-0.5 leading-snug ${
                      isSelected ? 'text-slate-300' : 'text-text-secondary'
                    }`}
                  >
                    {step.subtitle}
                  </p>
                  <span className="inline-block mt-1 text-[9px] font-mono text-accent/80 bg-accent/5 px-1.5 py-0.5 rounded border border-accent/20">
                    {step.badge}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
