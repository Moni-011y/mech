import { useState, useRef, useEffect, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

// ─── Scene Timeline Data (Exactly 20 Seconds) ─────────────────────────────────

export interface SceneData {
  id: number;
  startTime: number;
  endTime: number;
  title: string;
  onScreenText: string;
  subText?: string;
  voiceOverThanglish: string;
  voiceOverEnglish: string;
  badge: string;
  badgeColor: string;
  cameraPos: [number, number, number];
  cameraTarget: [number, number, number];
}

export const SCENES: SceneData[] = [
  {
    id: 1,
    startTime: 0,
    endTime: 4,
    title: 'STAGE 01: MANUAL LOADING',
    onScreenText: 'MANUAL LOADING → RETROFIT SETUP',
    subText: 'Legacy Manual Machine Workstation',
    voiceOverThanglish: 'Idhu namma old manual loading setup. Idhula manual loading panradhu nala process romba slow-a irundhuchu.',
    voiceOverEnglish: 'This is our old manual loading setup. Because of manual loading, the process was very slow.',
    badge: '⏱️ CYCLE TIME: 45 SEC (FATIGUE: HIGH)',
    badgeColor: 'border-red-500/50 bg-red-950/70 text-red-300',
    cameraPos: [4, 3, 7],
    cameraTarget: [0, 0, 0],
  },
  {
    id: 2,
    startTime: 4,
    endTime: 8,
    title: 'PNEUMATIC CYLINDER RETROFIT',
    onScreenText: 'PNEUMATIC CYLINDER RETROFIT ACTIVE',
    subText: 'Double-Acting Cylinder & Proximity Sensors Assembly',
    voiceOverThanglish: 'Ippo idhula double-acting pneumatic cylinder matrum proximity sensors-a retrofit panni semi-automatic-a maathirukom.',
    voiceOverEnglish: 'Now we have retrofitted a double-acting pneumatic cylinder and proximity sensors, converting it to semi-automatic.',
    badge: '⚡ DOUBLE-ACTING CYLINDER + PROXIMITY SENSORS',
    badgeColor: 'border-cyan-500/50 bg-cyan-950/70 text-cyan-300',
    cameraPos: [3, 2.5, 4.5],
    cameraTarget: [1.5, 0.5, 0],
  },
  {
    id: 3,
    startTime: 8,
    endTime: 13,
    title: 'PRODUCTIVITY BOOST (+460%)',
    onScreenText: 'CYCLE TIME: 45s ➔ 8s | PRODUCTIVITY +460%',
    subText: 'Automated 8-Second High-Speed Transfer Stroke',
    voiceOverThanglish: 'Cycle time 45 seconds-la irundhu 8 seconds-a koranjidichu. Overall productivity 460% increase aagudhu!',
    voiceOverEnglish: 'Cycle time dropped from 45 seconds down to 8 seconds. Overall productivity increased by 460%!',
    badge: '🚀 PRODUCTIVITY +460% (CYCLE: 8s)',
    badgeColor: 'border-emerald-500/50 bg-emerald-950/70 text-emerald-300',
    cameraPos: [1, 3.5, 6],
    cameraTarget: [0, 0.5, 0],
  },
  {
    id: 4,
    startTime: 13,
    endTime: 17,
    title: 'OPERATOR SAFETY & ISOLATION',
    onScreenText: 'REDUCED LABOR • DUAL PALM SAFETY',
    subText: 'Hand Isolation Interlock & Proximity Sensing',
    voiceOverThanglish: 'Dual palm buttons moolama hand isolation & safety ensure aagudhu. Single operator multiple cells-a easily supervise pannalaam.',
    voiceOverEnglish: 'Dual palm buttons guarantee hand isolation and safety. A single operator can now supervise multiple cells easily.',
    badge: '🛡️ DUAL PALM SAFETY & HAND ISOLATION',
    badgeColor: 'border-amber-500/50 bg-amber-950/70 text-amber-300',
    cameraPos: [-2, 3, 5],
    cameraTarget: [-1, 0, 0],
  },
  {
    id: 5,
    startTime: 17,
    endTime: 20,
    title: 'FINAL PROJECT SHOWCASE',
    onScreenText: 'MANUAL LOADING ➔ SEMI-AUTOMATIC PNEUMATIC RETROFIT',
    subText: '3D ENGINEERING CASE STUDY • FULL CELL COMMISSIONING',
    voiceOverThanglish: 'Ippadi dhaan manual machine-a semi-automatic pneumatic system-a retrofit panrom!',
    voiceOverEnglish: 'This is how we successfully retrofit a manual machine into a semi-automatic pneumatic system!',
    badge: '✅ RETROFIT TRANSFORMATION COMPLETE',
    badgeColor: 'border-sky-500/50 bg-sky-950/70 text-sky-300',
    cameraPos: [5, 4.5, 7.5],
    cameraTarget: [0, 0, 0],
  },
];

const TOTAL_DURATION = 20.0;

// ─── 3D Camera Controller (Smooth Interpolation) ──────────────────────────────

function CameraDirector({ time }: { time: number }) {
  const { camera } = useThree();
  const currentScene = SCENES.find((s) => time >= s.startTime && time < s.endTime) || SCENES[SCENES.length - 1];

  useFrame(() => {
    const targetPos = new THREE.Vector3(...currentScene.cameraPos);
    const targetLook = new THREE.Vector3(...currentScene.cameraTarget);

    camera.position.lerp(targetPos, 0.04);
    camera.lookAt(targetLook);
  });

  return null;
}

// ─── 3D Mechanical Workstation Model ──────────────────────────────────────────

function MachineWorkstation3D({ time }: { time: number }) {
  const pistonRef = useRef<THREE.Group>(null);
  const manualLeverRef = useRef<THREE.Group>(null);
  const partRef = useRef<THREE.Mesh>(null);
  const safetyRingRef = useRef<THREE.Mesh>(null);

  // Time-based scene state
  const isScene1 = time < 4;
  const isScene2 = time >= 4 && time < 8;
  const isScene3 = time >= 8 && time < 13;
  const isScene4 = time >= 13 && time < 17;
  const isScene5 = time >= 17;

  // Retrofit assembly animation factor in Scene 2 (4 to 8s)
  const retrofitSlideIn = isScene1
    ? 0
    : isScene2
    ? Math.min(1, (time - 4) / 2.5)
    : 1;

  // Continuous stroke in automated scenes (3, 4, 5)
  useFrame(() => {
    if (manualLeverRef.current) {
      if (isScene1) {
        // Slow hesitant manual pull cycle (takes 4s)
        const cycleProgress = (time % 4) / 4;
        const leverAngle = Math.sin(cycleProgress * Math.PI * 2) * 0.45;
        manualLeverRef.current.rotation.z = leverAngle;
      }
    }

    if (pistonRef.current && (isScene3 || isScene4 || isScene5)) {
      // Fast pneumatic stroke (cycle: ~1.5s visual period representing 8s automated cycle)
      const strokeProgress = (time * 2.5) % (Math.PI * 2);
      const strokeDist = Math.max(0, Math.sin(strokeProgress)) * 2.2;
      pistonRef.current.position.x = -strokeDist;

      if (partRef.current) {
        // Part pushed across slideway
        partRef.current.position.x = -1.2 - strokeDist * 0.95;
      }
    } else if (partRef.current) {
      partRef.current.position.x = -1.2;
    }

    if (safetyRingRef.current && isScene4) {
      safetyRingRef.current.rotation.y += 0.03;
    }
  });

  return (
    <group position={[0, -0.6, 0]}>
      {/* ── Cyan Grid Studio Base Floor ── */}
      <gridHelper args={[24, 32, '#06B6D4', '#0E2439']} position={[0, -0.01, 0]} />

      {/* Subtle floor reflection disc */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]}>
        <circleGeometry args={[12, 64]} />
        <meshBasicMaterial color="#070C15" transparent opacity={0.85} />
      </mesh>

      {/* ── Heavy Workstation Main Casting Frame ── */}
      <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
        <boxGeometry args={[7.5, 0.8, 4.2]} />
        <meshStandardMaterial
          color="#161F2E"
          metalness={0.75}
          roughness={0.25}
        />
      </mesh>

      {/* Machine Bed Support Legs */}
      {[[-3.2, 1.8], [3.2, 1.8], [-3.2, -1.8], [3.2, -1.8]].map(([x, z], i) => (
        <mesh key={i} position={[x, -0.2, z]}>
          <cylinderGeometry args={[0.25, 0.35, 0.8, 16]} />
          <meshStandardMaterial color="#0F172A" metalness={0.9} roughness={0.3} />
        </mesh>
      ))}

      {/* ── Precision Ground Slideway / Conveyor Track ── */}
      <mesh position={[0, 0.9, 0]} receiveShadow>
        <boxGeometry args={[6.8, 0.2, 1.6]} />
        <meshStandardMaterial
          color="#94A3B8"
          metalness={0.92}
          roughness={0.12}
        />
      </mesh>

      {/* Dual Ground Guide Rails */}
      {[-0.65, 0.65].map((z, i) => (
        <mesh key={i} position={[0, 1.05, z]}>
          <boxGeometry args={[6.8, 0.1, 0.08]} />
          <meshStandardMaterial color="#38BDF8" metalness={0.95} roughness={0.1} />
        </mesh>
      ))}

      {/* ── Mechanical Workpiece (Part being transferred) ── */}
      <mesh ref={partRef} position={[-1.2, 1.3, 0]} castShadow>
        <boxGeometry args={[0.9, 0.6, 0.9]} />
        <meshStandardMaterial
          color="#10B981"
          metalness={0.8}
          roughness={0.2}
          emissive="#059669"
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Part Fixture Clamp Base */}
      <mesh position={[-1.2, 1.05, 0]}>
        <boxGeometry args={[1.2, 0.15, 1.2]} />
        <meshStandardMaterial color="#334155" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* ── SCENE 1: MANUAL LOADING LEVER (Visible when !retroffited) ── */}
      {isScene1 && (
        <group ref={manualLeverRef} position={[2.5, 1.2, 0]}>
          {/* Lever Pivot Fulcrum */}
          <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.3, 0.3, 0.6, 16]} />
            <meshStandardMaterial color="#64748B" metalness={0.8} roughness={0.3} />
          </mesh>

          {/* Steel Lever Bar */}
          <mesh position={[0, 1.2, 0]} rotation={[0, 0, 0]}>
            <cylinderGeometry args={[0.08, 0.08, 2.4, 16]} />
            <meshStandardMaterial color="#CBD5E1" metalness={0.9} roughness={0.15} />
          </mesh>

          {/* Operator Red Knob Grip */}
          <mesh position={[0, 2.4, 0]}>
            <sphereGeometry args={[0.26, 24, 24]} />
            <meshStandardMaterial
              color="#EF4444"
              emissive="#EF4444"
              emissiveIntensity={0.35}
              roughness={0.3}
            />
          </mesh>

          {/* Fatigue / Manual Warning Halo */}
          <mesh position={[0, 2.4, 0]}>
            <ringGeometry args={[0.35, 0.42, 32]} />
            <meshBasicMaterial color="#EF4444" side={THREE.DoubleSide} transparent opacity={0.6} />
          </mesh>
        </group>
      )}

      {/* ── RETROFIT PACKAGE (Slides & mounts onto workstation at 4-8s) ── */}
      {retrofitSlideIn > 0 && (
        <group
          position={[
            2.5 + (1 - retrofitSlideIn) * 3, // Slides in along X axis
            1.2 + (1 - retrofitSlideIn) * 1.5, // Descends slightly into place
            0,
          ]}
        >
          {/* Glowing Cyan Interface Lines when retrofitting */}
          {isScene2 && (
            <mesh position={[-0.8, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
              <ringGeometry args={[0.7, 0.85, 32]} />
              <meshBasicMaterial color="#06B6D4" side={THREE.DoubleSide} transparent opacity={0.85} />
            </mesh>
          )}

          {/* Heavy Cylinder Mounting Bracket Flange */}
          <mesh position={[1.4, 0.2, 0]} castShadow>
            <boxGeometry args={[0.5, 1.4, 1.2]} />
            <meshStandardMaterial color="#1E293B" metalness={0.85} roughness={0.2} />
          </mesh>

          {/* Mounting Bolts (4x) */}
          {[[-0.4, -0.4], [-0.4, 0.4], [0.4, -0.4], [0.4, 0.4]].map(([y, z], idx) => (
            <mesh key={idx} position={[1.15, 0.2 + y, z]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.07, 0.07, 0.2, 12]} />
              <meshStandardMaterial color="#38BDF8" metalness={0.9} />
            </mesh>
          ))}

          {/* Double-Acting Pneumatic Cylinder Barrel */}
          <mesh position={[0.2, 0.35, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.48, 0.48, 2.2, 32]} />
            <meshStandardMaterial
              color="#0284C7"
              metalness={0.88}
              roughness={0.18}
            />
          </mesh>

          {/* Front & Rear Cylinder End Caps (Aluminium) */}
          {[-0.95, 1.35].map((x, i) => (
            <mesh key={i} position={[x, 0.35, 0]} rotation={[0, 0, Math.PI / 2]}>
              <boxGeometry args={[1.05, 1.05, 0.25]} />
              <meshStandardMaterial color="#38BDF8" metalness={0.92} roughness={0.15} />
            </mesh>
          ))}

          {/* Pneumatic Ports with Quick-Fit Connectors */}
          {[-0.8, 1.2].map((x, i) => (
            <group key={i} position={[x, 0.95, 0]}>
              <mesh>
                <cylinderGeometry args={[0.08, 0.08, 0.3, 12]} />
                <meshStandardMaterial color="#F59E0B" metalness={0.9} />
              </mesh>
              {/* Blue PU Air Hose Arc */}
              <mesh position={[0.2, 0.3, 0]} rotation={[0, 0, 0.4]}>
                <cylinderGeometry args={[0.04, 0.04, 0.7, 12]} />
                <meshStandardMaterial color="#0284C7" roughness={0.4} />
              </mesh>
            </group>
          ))}

          {/* Moving Piston Rod & Pusher Assembly */}
          <group ref={pistonRef} position={[0, 0.35, 0]}>
            {/* Mirror-Finished Chrome Piston Rod */}
            <mesh position={[-1.2, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.2, 0.2, 2.0, 32]} />
              <meshStandardMaterial
                color="#F8FAFC"
                metalness={0.98}
                roughness={0.04}
              />
            </mesh>

            {/* Front Tooling Pusher Block */}
            <mesh position={[-2.2, 0, 0]} castShadow>
              <boxGeometry args={[0.25, 0.8, 1.1]} />
              <meshStandardMaterial color="#06B6D4" metalness={0.8} roughness={0.2} />
            </mesh>

            {/* Rubber Wear-Resistant Pusher Pad */}
            <mesh position={[-2.35, 0, 0]}>
              <boxGeometry args={[0.08, 0.7, 0.95]} />
              <meshStandardMaterial color="#0F172A" roughness={0.9} />
            </mesh>
          </group>

          {/* Proximity Sensors (Mounted on Cylinder Tie-Rods) */}
          {[-0.5, 0.9].map((x, i) => (
            <group key={i} position={[x, 0.35, 0.58]}>
              <mesh rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.08, 0.08, 0.35, 16]} />
                <meshStandardMaterial color="#334155" metalness={0.8} />
              </mesh>
              {/* LED Sensing Indicator Ring */}
              <mesh position={[0, 0, 0.15]}>
                <sphereGeometry args={[0.06, 16, 16]} />
                <meshStandardMaterial
                  color="#F59E0B"
                  emissive="#F59E0B"
                  emissiveIntensity={1.2}
                />
              </mesh>
            </group>
          ))}

          {/* 5/2 Solenoid Valve Block with Indicator LEDs */}
          <group position={[1.3, -0.4, 1.2]}>
            <mesh>
              <boxGeometry args={[0.8, 0.6, 0.9]} />
              <meshStandardMaterial color="#1E293B" metalness={0.8} />
            </mesh>
            <mesh position={[0, 0.2, 0.46]}>
              <boxGeometry args={[0.6, 0.15, 0.05]} />
              <meshStandardMaterial
                color="#10B981"
                emissive="#10B981"
                emissiveIntensity={1.0}
              />
            </mesh>
          </group>
        </group>
      )}

      {/* ── SCENE 4: DUAL PALM SAFETY BUTTONS & OPERATOR INTERLOCK CONSOLE ── */}
      <group position={[-2.8, 0.8, 2.2]}>
        {/* Operator Safety Console Pedestal */}
        <mesh position={[0, -0.2, 0]}>
          <boxGeometry args={[1.8, 0.8, 0.6]} />
          <meshStandardMaterial color="#1E293B" metalness={0.7} roughness={0.3} />
        </mesh>

        {/* Dual Palm Mushroom Safety Buttons (Hands must press both) */}
        {[-0.6, 0.6].map((x, i) => (
          <group key={i} position={[x, 0.3, 0]}>
            <mesh>
              <cylinderGeometry args={[0.15, 0.18, 0.2, 16]} />
              <meshStandardMaterial color="#0F172A" />
            </mesh>
            {/* High-Visibility Yellow/Black Palm Button */}
            <mesh position={[0, 0.12, 0]}>
              <cylinderGeometry args={[0.26, 0.26, 0.12, 24]} />
              <meshStandardMaterial
                color={isScene4 ? '#FACC15' : '#EAB308'}
                emissive={isScene4 ? '#FACC15' : '#000000'}
                emissiveIntensity={isScene4 ? 0.6 : 0}
                roughness={0.3}
              />
            </mesh>
          </group>
        ))}

        {/* Hand Isolation Safety Zone (Visualized in Scene 4) */}
        {isScene4 && (
          <mesh ref={safetyRingRef} position={[0, 0.6, 0]}>
            <ringGeometry args={[1.1, 1.25, 32]} />
            <meshBasicMaterial color="#10B981" side={THREE.DoubleSide} transparent opacity={0.7} />
          </mesh>
        )}
      </group>

      {/* Floating 3D HUD Callout Pin in 3D Space */}
      <Float speed={2} rotationIntensity={0.1} floatIntensity={0.2}>
        <mesh position={[0, 2.6, 0]}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshBasicMaterial color="#06B6D4" />
        </mesh>
      </Float>
    </group>
  );
}

// ─── Main 20-Second Cinematic Video Simulation Component ─────────────────────

export default function PneumaticRetrofitAnimationVideo() {
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isVoiceOverEnabled, setIsVoiceOverEnabled] = useState<boolean>(true);
  const [showEnglishTranslation, setShowEnglishTranslation] = useState<boolean>(true);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showControls, setShowControls] = useState<boolean>(true);

  const containerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(performance.now());
  const synthRef = useRef<SpeechSynthesisUtterance | null>(null);
  const lastSpokenSceneId = useRef<number>(-1);

  // Active Scene based on currentTime
  const activeSceneIndex = SCENES.findIndex(
    (s) => currentTime >= s.startTime && currentTime < s.endTime
  );
  const currentScene = SCENES[activeSceneIndex !== -1 ? activeSceneIndex : SCENES.length - 1];

  // ── Voice-Over Trigger (Web Speech API with South Indian English/Tamil accent) ──
  const speakCurrentScene = useCallback(
    (scene: SceneData) => {
      if (!isVoiceOverEnabled) return;
      if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(scene.voiceOverThanglish);
      utterance.rate = 1.05;
      utterance.pitch = 1.0;

      // Select South Indian / Indian English or Tamil voice if available
      const voices = window.speechSynthesis.getVoices();
      const inVoice =
        voices.find((v) => v.lang.includes('ta') || v.lang.includes('en-IN') || v.name.toLowerCase().includes('india')) ||
        voices.find((v) => v.lang.includes('en')) ||
        voices[0];

      if (inVoice) {
        utterance.voice = inVoice;
      }

      synthRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    },
    [isVoiceOverEnabled]
  );

  // Handle Scene Transitions & Voice-Over
  useEffect(() => {
    if (!isPlaying) {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      return;
    }

    if (currentScene.id !== lastSpokenSceneId.current) {
      lastSpokenSceneId.current = currentScene.id;
      speakCurrentScene(currentScene);
    }
  }, [currentScene, isPlaying, speakCurrentScene]);

  // Main animation ticker loop (0 to 20 seconds)
  useEffect(() => {
    if (!isPlaying) return;

    let animId: number;
    const tick = () => {
      const now = performance.now();
      const deltaSec = (now - lastTimeRef.current) / 1000;
      lastTimeRef.current = now;

      setCurrentTime((prev) => {
        const nextTime = prev + deltaSec * playbackSpeed;
        if (nextTime >= TOTAL_DURATION) {
          // Seamless loop back to 0
          lastSpokenSceneId.current = -1;
          return 0;
        }
        return nextTime;
      });

      animId = requestAnimationFrame(tick);
    };

    lastTimeRef.current = performance.now();
    animId = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(animId);
  }, [isPlaying, playbackSpeed]);

  const togglePlay = () => {
    setIsPlaying((p) => {
      if (!p) {
        lastTimeRef.current = performance.now();
      }
      return !p;
    });
  };

  const jumpToScene = (startTime: number) => {
    lastSpokenSceneId.current = -1;
    setCurrentTime(startTime);
    lastTimeRef.current = performance.now();
  };

  const restartVideo = () => {
    lastSpokenSceneId.current = -1;
    setCurrentTime(0);
    setIsPlaying(true);
    lastTimeRef.current = performance.now();
  };

  const toggleVoiceOver = () => {
    setIsVoiceOverEnabled((prev) => {
      if (prev && typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      return !prev;
    });
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      window.clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = window.setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 3200);
  };

  const progressPct = (currentTime / TOTAL_DURATION) * 100;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setShowControls(false)}
      className="relative w-full aspect-video min-h-[480px] sm:min-h-[520px] bg-[#070B12] rounded-2xl overflow-hidden border border-cyan-500/30 shadow-[0_0_35px_rgba(6,182,212,0.15)] flex flex-col justify-between select-none"
    >
      {/* ── 3D WebGL Canvas Layer (4K CAD Studio Simulation) ── */}
      <div className="absolute inset-0">
        <Canvas
          shadows
          camera={{ position: [5, 4, 7], fov: 42 }}
          gl={{ antialias: true, alpha: false }}
          onCreated={({ gl }) => gl.setClearColor('#070B12')}
        >
          {/* Studio Lights */}
          <ambientLight intensity={0.5} />
          <directionalLight position={[6, 9, 5]} intensity={1.8} castShadow shadow-mapSize={[1024, 1024]} />
          <pointLight position={[-4, 3, -3]} intensity={0.9} color="#06B6D4" />
          <pointLight position={[4, 2, 4]} intensity={0.6} color="#38BDF8" />
          <pointLight position={[-2, 1, 3]} intensity={0.4} color="#10B981" />

          {/* Smooth Scene Camera Director */}
          <CameraDirector time={currentTime} />

          {/* 3D Model with Scene Transformations */}
          <MachineWorkstation3D time={currentTime} />
        </Canvas>
      </div>

      {/* ── High-Tech Scanline & Dark Vignette Overlay ── */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#070B12]/95 via-transparent to-[#070B12]/70" />
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(to_bottom,transparent_50%,rgba(6,182,212,0.08)_51%)] bg-[size:100%_4px] opacity-25" />

      {/* ── TOP HUD HEADER (Labels & Scene Tabs) ── */}
      <div
        className={`relative z-10 p-3 sm:p-5 flex flex-wrap items-center justify-between gap-3 transition-opacity duration-300 pointer-events-auto ${
          showControls ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {/* Project & Machine Label */}
        <div className="flex items-center gap-2.5 bg-[#0D1522]/90 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-cyan-500/40 shadow-xl">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_10px_#22d3ee]" />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-widest">
                4K UHD 3D CAD ANIMATION
              </span>
              <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold">
                20 SEC EXACT
              </span>
            </div>
            <h3 className="text-xs sm:text-sm font-extrabold text-white tracking-wide">
              Manual Loading ➔ Semi-Automatic Pneumatic Retrofit
            </h3>
          </div>
        </div>

        {/* 5-Scene Jump Pills */}
        <div className="hidden md:flex items-center gap-1 bg-[#0D1522]/80 backdrop-blur-md p-1 rounded-xl border border-border">
          {SCENES.map((scene) => {
            const isActive = currentScene.id === scene.id;
            return (
              <button
                key={scene.id}
                onClick={() => jumpToScene(scene.startTime)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition-all ${
                  isActive
                    ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                    : 'text-text-secondary hover:text-white hover:bg-surface-elevated'
                }`}
              >
                0{scene.id} {scene.startTime}s
              </button>
            );
          })}
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center gap-2">
          {/* Thanglish Voice-Over Toggle */}
          <button
            onClick={toggleVoiceOver}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-bold border backdrop-blur-md transition shadow-md ${
              isVoiceOverEnabled
                ? 'bg-cyan-500/20 border-cyan-500/60 text-cyan-300'
                : 'bg-surface/80 border-border text-text-secondary hover:text-white'
            }`}
            title={isVoiceOverEnabled ? 'Mute Thanglish Voice-Over' : 'Enable Thanglish Voice-Over'}
          >
            {isVoiceOverEnabled ? (
              <>
                <span className="flex gap-0.5 items-end h-3">
                  <span className="w-0.5 h-1.5 bg-cyan-400 animate-pulse" />
                  <span className="w-0.5 h-3 bg-cyan-400 animate-pulse delay-75" />
                  <span className="w-0.5 h-2 bg-cyan-400 animate-pulse delay-150" />
                </span>
                <span className="hidden sm:inline">VOICE: ON</span>
              </>
            ) : (
              <>
                <span>🔇</span>
                <span className="hidden sm:inline">VOICE: MUTED</span>
              </>
            )}
          </button>

          {/* Fullscreen Button */}
          <button
            onClick={toggleFullscreen}
            className="p-1.5 rounded-xl bg-surface/90 hover:bg-surface-elevated text-text-secondary hover:text-white border border-border text-xs backdrop-blur-md transition shadow-md"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* ── CENTER CINEMATIC ON-SCREEN OVERLAYS (Timeline Specific) ── */}
      <div className="relative z-10 px-4 sm:px-8 py-2 flex flex-col justify-center pointer-events-none">
        {/* High-Impact Badge */}
        <div className="flex items-center gap-2 mb-2">
          <span
            className={`px-3 py-1 rounded-full text-xs font-mono font-extrabold border backdrop-blur-md tracking-wider uppercase transition-all duration-300 ${currentScene.badgeColor}`}
          >
            {currentScene.badge}
          </span>
        </div>

        {/* Main On-Screen Headline */}
        <h2 className="text-xl sm:text-3xl font-black text-white tracking-tight drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">
          {currentScene.onScreenText}
        </h2>
        {currentScene.subText && (
          <p className="text-xs sm:text-sm font-mono text-cyan-300/90 font-semibold mt-1 drop-shadow-md">
            {currentScene.subText}
          </p>
        )}

        {/* Scene 3 Special Graphic: Productivity 460% Boost Visualizer */}
        {currentScene.id === 3 && (
          <div className="mt-3 inline-flex items-center gap-3 bg-emerald-950/80 border border-emerald-500/60 p-2.5 rounded-xl max-w-sm backdrop-blur-md">
            <span className="text-2xl animate-bounce">📈</span>
            <div className="font-mono text-xs">
              <div className="text-emerald-400 font-extrabold text-sm">+460% OUTPUT BOOST</div>
              <div className="text-slate-300 text-[11px]">45s (Manual) ➔ 8s (Pneumatic Stroke)</div>
            </div>
          </div>
        )}

        {/* Scene 4 Special Graphic: Dual Palm Hand Isolation Visualizer */}
        {currentScene.id === 4 && (
          <div className="mt-3 inline-flex items-center gap-3 bg-amber-950/80 border border-amber-500/60 p-2.5 rounded-xl max-w-sm backdrop-blur-md">
            <span className="text-2xl animate-pulse">✋🛡️✋</span>
            <div className="font-mono text-xs">
              <div className="text-amber-400 font-extrabold text-sm">DUAL PALM INTERLOCK ACTIVE</div>
              <div className="text-slate-300 text-[11px]">Hands Isolated • Proximity Safe Distance</div>
            </div>
          </div>
        )}
      </div>

      {/* ── BOTTOM SUBTITLES & CAPTIONS (Thanglish Voice-Over) ── */}
      <div className="relative z-10 px-4 sm:px-8 pb-2 pointer-events-auto">
        <div className="bg-[#0B1220]/90 border border-cyan-500/40 rounded-xl p-3 sm:p-4 backdrop-blur-md shadow-2xl space-y-1.5">
          <div className="flex items-center justify-between text-[10px] font-mono">
            <span className="text-amber-400 font-bold flex items-center gap-1.5">
              <span>🎙️</span>
              <span>SOUTH INDIAN THANGLISH VOICE-OVER:</span>
            </span>
            <button
              onClick={() => setShowEnglishTranslation(!showEnglishTranslation)}
              className="text-text-secondary hover:text-cyan-400 underline"
            >
              {showEnglishTranslation ? 'Hide English Translation' : 'Show English Translation'}
            </button>
          </div>

          {/* Primary Thanglish Speech Text */}
          <div className="text-xs sm:text-sm font-semibold text-white leading-relaxed">
            "{currentScene.voiceOverThanglish}"
          </div>

          {/* English Translation */}
          {showEnglishTranslation && (
            <div className="text-[11px] font-mono text-cyan-300/80 italic pt-1 border-t border-border/50">
              English: "{currentScene.voiceOverEnglish}"
            </div>
          )}
        </div>
      </div>

      {/* ── BOTTOM CONTROLS & TIMELINE (Exact 20s Scrub Bar) ── */}
      <div
        className={`relative z-10 p-3 sm:p-5 bg-gradient-to-t from-[#070B12] via-[#070B12]/90 to-transparent flex flex-col gap-2 transition-opacity duration-300 pointer-events-auto ${
          showControls || !isPlaying ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {/* Scrubber Timeline Bar */}
        <div className="relative w-full flex items-center group/scrubber">
          <input
            type="range"
            min="0"
            max={TOTAL_DURATION}
            step="0.05"
            value={currentTime}
            onChange={(e) => jumpToScene(parseFloat(e.target.value))}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400 focus:outline-none transition"
            style={{
              background: `linear-gradient(to right, #06b6d4 ${progressPct}%, rgba(30, 41, 59, 0.8) ${progressPct}%)`,
            }}
          />

          {/* 5-Scene Marker Ticks on the bar */}
          <div className="absolute inset-x-0 flex justify-between pointer-events-none px-1">
            {SCENES.map((scene) => (
              <span
                key={scene.id}
                className="w-1 h-3 rounded-full bg-cyan-400/50 -translate-y-0.5"
                title={`${scene.title} (${scene.startTime}s)`}
              />
            ))}
          </div>
        </div>

        {/* Controls Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            {/* Play / Pause Button */}
            <button
              onClick={togglePlay}
              className="p-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition shadow-md shadow-cyan-500/20"
              title={isPlaying ? 'Pause Animation' : 'Play 20s Animation'}
            >
              {isPlaying ? (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>

            {/* Restart Button */}
            <button
              onClick={restartVideo}
              className="p-2 rounded-xl bg-surface/90 hover:bg-surface-elevated text-text-secondary hover:text-white border border-border transition"
              title="Replay from 00:00"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>

            {/* Exact Timestamp Display */}
            <span className="font-mono text-xs text-text-secondary">
              <span className="text-cyan-400 font-bold">{currentTime.toFixed(1)}s</span> / {TOTAL_DURATION.toFixed(1)}s
            </span>
          </div>

          {/* Current Active Scene Pill */}
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-block px-2.5 py-0.5 rounded text-[10px] font-mono uppercase bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
              SCENE 0{currentScene.id}: {currentScene.title}
            </span>

            {/* Speed Toggle */}
            <button
              onClick={() => setPlaybackSpeed((s) => (s === 1.0 ? 1.5 : s === 1.5 ? 0.75 : 1.0))}
              className="px-2 py-1 rounded-lg bg-surface/90 hover:bg-surface-elevated text-cyan-400 font-mono text-[10px] font-bold border border-border transition"
              title="Playback Speed"
            >
              {playbackSpeed}x
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
