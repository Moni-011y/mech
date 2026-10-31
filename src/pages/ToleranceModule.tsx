import { useState, useRef, useCallback, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import * as THREE from 'three';
import Navbar from '../components/Navigation/Navbar';
import {
  Chapter9CoreSection,
  DimensionalToleranceTypesSection,
  DimVsGeomSection,
  GeneralToleranceSection,
  ChecklistAndSummarySection,
} from '../components/Tolerance/Chapter9ToleranceSections';

// ─────────────────────────────────────────────
// 3D SHAFT + HOLE MODEL
// ─────────────────────────────────────────────
function ShaftHoleModel({
  holeUpper, holeLower,
  shaftUpper, shaftLower,
  actualShaft, actualHole,
}: {
  holeUpper: number; holeLower: number;
  shaftUpper: number; shaftLower: number;
  actualShaft: number; actualHole: number;
}) {
  void shaftUpper; void shaftLower;
  const shaftRef = useRef<THREE.Group>(null!);
  useFrame((state) => {
    if (shaftRef.current) {
      shaftRef.current.rotation.y = state.clock.elapsedTime * 0.4;
    }
  });

  const nominalHoleR = 0.8;
  const holeR = nominalHoleR + (actualHole - 50) * 0.05;
  const shaftR = nominalHoleR - 0.05 + (actualShaft - 49.98) * 0.05;
  const clearance = holeR - shaftR;
  const isInterference = clearance < 0;
  const isTransition = Math.abs(clearance) < 0.005;

  const fitColor = isTransition ? '#f59e0b' : isInterference ? '#ef4444' : '#14b8a6';
  const fitLabel = isTransition ? 'TRANSITION FIT' : isInterference ? 'INTERFERENCE FIT' : 'CLEARANCE FIT';

  return (
    <group>
      {/* HOLE (outer transparent ring) */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[holeR + 0.4, holeR + 0.4, 2.5, 32]} />
        <meshStandardMaterial color="#334155" metalness={0.7} roughness={0.4} transparent opacity={0.7} />
      </mesh>
      {/* Hole bore */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[holeR, holeR, 2.5, 32]} />
        <meshStandardMaterial color="#0f172a" transparent opacity={0.9} />
      </mesh>
      {/* Tolerance zone cylinders */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[nominalHoleR + (holeUpper - 50) * 0.05 + 0.002, nominalHoleR + (holeUpper - 50) * 0.05 + 0.002, 2.6, 32]} />
        <meshStandardMaterial color="#6366f1" transparent opacity={0.12} wireframe />
      </mesh>
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[nominalHoleR + (holeLower - 50) * 0.05, nominalHoleR + (holeLower - 50) * 0.05, 2.6, 32]} />
        <meshStandardMaterial color="#6366f1" transparent opacity={0.10} wireframe />
      </mesh>

      {/* SHAFT */}
      <group ref={shaftRef}>
        <mesh position={[0, 0, 0]} castShadow>
          <cylinderGeometry args={[shaftR, shaftR, 4, 32]} />
          <meshStandardMaterial color={fitColor} metalness={0.85} roughness={0.2} />
        </mesh>
      </group>

      {/* Clearance gap visual */}
      {!isInterference && clearance > 0.01 && (
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[holeR, holeR, 0.05, 32]} />
          <meshStandardMaterial color="#14b8a6" transparent opacity={0.5} />
        </mesh>
      )}

      {/* Labels */}
      <Text position={[0, 2.2, 0]} fontSize={0.22} color={fitColor} font={undefined}>{fitLabel}</Text>
      <Text position={[0, -2.2, 0]} fontSize={0.16} color="#94a3b8" font={undefined}>
        {`Clearance: ${(clearance * 20).toFixed(3)} mm`}
      </Text>
      <Text position={[-1.5, 0, 0]} fontSize={0.14} color="#6366f1" font={undefined}>HOLE</Text>
      <Text position={[1.2, 0, 0]} fontSize={0.14} color={fitColor} font={undefined}>SHAFT</Text>
    </group>
  );
}

// ─────────────────────────────────────────────
// SHAFT ENTRY ANIMATION MODEL
// ─────────────────────────────────────────────
function ShaftEntryAnimation({ mode }: { mode: 'clearance' | 'transition' | 'interference' }) {
  const shaftRef = useRef<THREE.Group>(null!);
  useFrame((state) => {
    if (!shaftRef.current) return;
    const t = state.clock.elapsedTime;
    // Oscillate shaft in/out of hole
    shaftRef.current.position.y = Math.sin(t * 0.7) * 1.2;
    if (mode === 'interference') shaftRef.current.position.y = Math.sin(t * 0.5) * 0.3;
    if (mode === 'clearance') shaftRef.current.position.y = Math.sin(t * 0.8) * 1.5;
  });

  const colors = { clearance: '#14b8a6', transition: '#f59e0b', interference: '#ef4444' };
  const holeR = 0.8;
  const shaftR = mode === 'clearance' ? 0.65 : mode === 'transition' ? 0.79 : 0.87;

  return (
    <group>
      {/* Hole body */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[holeR + 0.5, holeR + 0.5, 2.5, 32]} />
        <meshStandardMaterial color="#334155" metalness={0.7} roughness={0.4} transparent opacity={0.75} />
      </mesh>
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[holeR, holeR, 2.5, 32]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>
      {/* Moving shaft */}
      <group ref={shaftRef}>
        <mesh castShadow>
          <cylinderGeometry args={[shaftR, shaftR, 3.5, 32]} />
          <meshStandardMaterial color={colors[mode]} metalness={0.9} roughness={0.15} />
        </mesh>
        <Text position={[0, 2.0, 0]} fontSize={0.2} color={colors[mode]} font={undefined}>{mode.toUpperCase()} FIT</Text>
      </group>
    </group>
  );
}

// ─────────────────────────────────────────────
// TOLERANCE ZONE SVG DIAGRAM
// ─────────────────────────────────────────────
function ToleranceDiagram({
  nominal, upper, lower, actual, label
}: {
  nominal: number; upper: number; lower: number; actual: number; label: string;
}) {
  const range = upper - lower;
  const inTol = actual >= lower && actual <= upper;
  const pct = range > 0 ? Math.max(0, Math.min(100, ((actual - lower) / range) * 100)) : 50;

  const pctNominal = range > 0 ? ((nominal - lower) / range) * 100 : 50;

  return (
    <div className="bg-surface border border-border rounded-xl p-5 space-y-4">
      <h4 className="text-xs font-mono font-bold text-accent uppercase tracking-widest">{label} — TOLERANCE ZONE DIAGRAM</h4>

      {/* Vertical tolerance bar */}
      <div className="flex items-start gap-6">
        <div className="relative w-8 flex-shrink-0" style={{ height: 200 }}>
          {/* Zone fill */}
          <div className="absolute left-1/2 -translate-x-1/2 w-3 bg-accent/20 border border-accent/40 rounded" style={{ top: 10, height: 160 }} />
          {/* Nominal line */}
          <div className="absolute left-0 w-8 h-0.5 bg-text-secondary/60" style={{ top: 10 + (1 - pctNominal / 100) * 160 - 1 }} />
          {/* Upper limit */}
          <div className="absolute left-0 w-8 h-0.5 bg-accent" style={{ top: 10 }} />
          {/* Lower limit */}
          <div className="absolute left-0 w-8 h-0.5 bg-accent" style={{ top: 170 }} />
          {/* Actual marker */}
          <div
            className={`absolute left-0 w-8 h-1 rounded transition-all ${inTol ? 'bg-emerald-400' : 'bg-red-400'}`}
            style={{ top: 10 + (1 - pct / 100) * 160 - 2 }}
          />
        </div>

        {/* Labels */}
        <div className="relative flex-1" style={{ height: 200 }}>
          <div className="absolute text-xs font-mono text-accent font-bold" style={{ top: 2 }}>{upper.toFixed(3)} mm — UPPER LIMIT</div>
          <div className="absolute text-xs font-mono text-text-secondary" style={{ top: 10 + (1 - pctNominal / 100) * 160 - 8 }}>{nominal.toFixed(3)} mm — NOMINAL</div>
          <div className="absolute text-xs font-mono text-accent font-bold" style={{ top: 162 }}>{lower.toFixed(3)} mm — LOWER LIMIT</div>
          <div
            className={`absolute text-xs font-mono font-bold transition-all ${inTol ? 'text-emerald-400' : 'text-red-400'}`}
            style={{ top: Math.max(8, Math.min(150, 10 + (1 - pct / 100) * 160 - 8)) }}
          >
            ◄ {actual.toFixed(3)} mm — ACTUAL {inTol ? '✓ IN TOLERANCE' : '✗ OUT OF TOLERANCE'}
          </div>
        </div>
      </div>

      <div className={`text-center text-sm font-bold py-2 rounded-lg ${inTol ? 'bg-emerald-600/10 border border-emerald-600/30 text-emerald-400' : 'bg-red-600/10 border border-red-600/30 text-red-400'}`}>
        {inTol ? '✓ WITHIN TOLERANCE' : '✗ OUT OF TOLERANCE'}
        <span className="text-xs font-mono text-text-secondary ml-2">
          Tolerance = {(upper - lower).toFixed(3)} mm
        </span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// VIDEO PLACEHOLDER
// ─────────────────────────────────────────────
const TOL_VIDEOS = [
  { id: 1, title: 'What is Tolerance?', desc: 'Introduction to dimensional tolerance — why manufacturing variation is inevitable and how engineering controls it.', duration: '7 min', concepts: ['Definition', 'Why tolerance exists', 'Cost vs tolerance'] },
  { id: 2, title: 'Nominal, Upper and Lower Limits', desc: 'Understanding the three key dimension values and how they define the tolerance zone.', duration: '8 min', concepts: ['Nominal size', 'Upper limit', 'Lower limit'] },
  { id: 3, title: 'Tolerance Zones', desc: 'How to visualize and calculate tolerance zones in engineering drawings.', duration: '9 min', concepts: ['Tolerance zone', 'Bilateral tolerance', 'Unilateral tolerance'] },
  { id: 4, title: 'Clearance and Interference', desc: 'Shaft and hole relationships — clearance fits, interference fits, and transition fits.', duration: '11 min', concepts: ['Clearance fit', 'Interference fit', 'Transition fit'] },
  { id: 5, title: 'Reading Engineering Dimensions', desc: 'How to interpret ±, +/−, and limit-format dimension callouts on engineering drawings.', duration: '8 min', concepts: ['Bilateral tolerance', 'Limit dimensioning', 'ISO vs ASME'] },
  { id: 6, title: 'Tolerance in Manufacturing', desc: 'How tolerance affects manufacturing process selection, cost, and quality control.', duration: '12 min', concepts: ['Process capability', 'Cost relationship', 'SPC basics'] },
];

function VideoCard({ v }: { v: typeof TOL_VIDEOS[0] }) {
  return (
    <div className="bg-surface border border-border rounded-xl overflow-hidden hover:border-accent/40 transition group">
      <div className="bg-[#050a0f] h-32 flex flex-col items-center justify-center gap-2 border-b border-border relative">
        <div className="w-11 h-11 rounded-full bg-accent/10 border border-accent/30 flex items-center justify-center text-accent text-lg">▶</div>
        <span className="text-[10px] font-mono text-text-secondary">Video source will be added.</span>
        <span className="absolute top-2 right-2 text-[10px] font-mono px-2 py-0.5 rounded bg-surface border border-border text-text-secondary">{v.duration}</span>
      </div>
      <div className="p-3">
        <div className="text-[10px] font-mono text-accent mb-1">VIDEO {String(v.id).padStart(2, '0')}</div>
        <h4 className="text-sm font-bold text-text-primary group-hover:text-accent transition">{v.title}</h4>
        <p className="text-[11px] text-text-secondary mt-1 leading-relaxed">{v.desc}</p>
        <div className="flex flex-wrap gap-1 mt-2">
          {v.concepts.map((c) => (
            <span key={c} className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-accent/10 text-accent border border-accent/20">{c}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// PRACTICE EXERCISES
// ─────────────────────────────────────────────
type PracticeQ = {
  nominal: number; upper: number; lower: number; actual: number;
  q: string;
};

function generateQuestions(): PracticeQ[] {
  return [
    { nominal: 20.00, upper: 20.00, lower: 19.98, actual: 19.99, q: 'A shaft: Nominal=20.00 mm, Upper=20.00 mm, Lower=19.98 mm. Is 19.99 mm acceptable?' },
    { nominal: 50.00, upper: 50.02, lower: 50.00, actual: 50.03, q: 'A hole: Nominal=50.00 mm, Upper=50.02 mm, Lower=50.00 mm. Is 50.03 mm acceptable?' },
    { nominal: 25.00, upper: 25.05, lower: 24.95, actual: 24.97, q: 'A shaft: Nominal=25.00 mm, Tolerance ±0.05 mm. Is 24.97 mm acceptable?' },
    { nominal: 12.00, upper: 12.02, lower: 11.98, actual: 12.025, q: 'A bore: Nominal=12.00 mm, Upper=12.02 mm, Lower=11.98 mm. Is 12.025 mm acceptable?' },
    { nominal: 80.00, upper: 80.04, lower: 79.97, actual: 79.98, q: 'A journal: Nominal=80.00 mm, Upper=80.04 mm, Lower=79.97 mm. Is 79.98 mm acceptable?' },
  ];
}

function PracticeSection() {
  const questions = generateQuestions();
  const [qi, setQi] = useState(0);
  const [answered, setAnswered] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const q = questions[qi];
  const correct = q.actual >= q.lower && q.actual <= q.upper;

  const answer = useCallback((choice: boolean) => {
    setAnswered(choice);
    if (choice === correct) setScore((s) => s + 1);
  }, [correct]);

  const next = useCallback(() => {
    if (qi + 1 >= questions.length) setDone(true);
    else { setQi((i) => i + 1); setAnswered(null); }
  }, [qi, questions.length]);

  const reset = useCallback(() => { setQi(0); setAnswered(null); setScore(0); setDone(false); }, []);

  return (
    <div className="bg-surface border border-border rounded-xl p-5 space-y-4">
      {done ? (
        <div className="text-center py-8 space-y-4">
          <div className="text-4xl">📏</div>
          <div className="text-xl font-black text-accent">{score}/{questions.length} CORRECT</div>
          <p className="text-text-secondary text-sm">{score === questions.length ? 'Perfect! You understand tolerance zones.' : 'Review the examples above and try again.'}</p>
          <button onClick={reset} className="px-6 py-2 rounded-lg bg-accent text-background font-bold text-sm hover:bg-accent/90 transition">RETRY</button>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-text-secondary">QUESTION {qi + 1} / {questions.length}</span>
            <span className="text-[10px] font-mono text-accent">SCORE: {score}</span>
          </div>
          <div className="h-1.5 bg-surface-elevated rounded-full overflow-hidden">
            <div className="h-full bg-accent transition-all" style={{ width: `${(qi / questions.length) * 100}%` }} />
          </div>
          {/* Question */}
          <div className="bg-surface-elevated border border-border rounded-lg p-4">
            <p className="text-sm text-accent font-semibold">{q.q}</p>
            <div className="grid grid-cols-3 gap-2 mt-3 text-xs font-mono">
              <div className="bg-surface rounded p-2 text-center">
                <div className="text-text-secondary mb-0.5">LOWER</div>
                <div className="text-text-primary font-bold">{q.lower.toFixed(3)} mm</div>
              </div>
              <div className="bg-surface rounded p-2 text-center border border-accent/30">
                <div className="text-text-secondary mb-0.5">NOMINAL</div>
                <div className="text-accent font-bold">{q.nominal.toFixed(3)} mm</div>
              </div>
              <div className="bg-surface rounded p-2 text-center">
                <div className="text-text-secondary mb-0.5">UPPER</div>
                <div className="text-text-primary font-bold">{q.upper.toFixed(3)} mm</div>
              </div>
            </div>
            <div className="mt-3 text-center text-sm font-mono text-text-secondary">
              Measured: <span className="text-text-primary font-bold">{q.actual.toFixed(3)} mm</span>
            </div>
          </div>

          {answered === null ? (
            <div className="flex gap-3">
              <button onClick={() => answer(true)} className="flex-1 py-3 rounded-lg bg-emerald-600/20 border border-emerald-600/40 text-emerald-400 font-bold text-sm hover:bg-emerald-600/30 transition">✓ YES — ACCEPTABLE</button>
              <button onClick={() => answer(false)} className="flex-1 py-3 rounded-lg bg-red-600/20 border border-red-600/40 text-red-400 font-bold text-sm hover:bg-red-600/30 transition">✗ NO — REJECT</button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className={`p-4 rounded-lg border ${answered === correct ? 'bg-emerald-600/10 border-emerald-600/40' : 'bg-red-600/10 border-red-600/40'}`}>
                <div className={`text-sm font-bold mb-2 ${answered === correct ? 'text-emerald-400' : 'text-red-400'}`}>
                  {answered === correct ? '✓ CORRECT' : '✗ INCORRECT'}
                </div>
                <div className="text-xs font-mono text-text-secondary space-y-1">
                  <div>Actual: <span className="text-text-primary">{q.actual.toFixed(3)} mm</span></div>
                  <div>Range: <span className="text-text-primary">{q.lower.toFixed(3)} — {q.upper.toFixed(3)} mm</span></div>
                  <div>Tolerance: <span className="text-text-primary">{(q.upper - q.lower).toFixed(3)} mm</span></div>
                  <div className={`font-bold mt-2 ${correct ? 'text-emerald-400' : 'text-red-400'}`}>
                    {correct
                      ? `${q.actual.toFixed(3)} ≥ ${q.lower.toFixed(3)} AND ${q.actual.toFixed(3)} ≤ ${q.upper.toFixed(3)} → WITHIN TOLERANCE`
                      : `${q.actual.toFixed(3)} is outside [${q.lower.toFixed(3)}, ${q.upper.toFixed(3)}] → OUT OF TOLERANCE`
                    }
                  </div>
                </div>
              </div>
              <button onClick={next} className="w-full py-2.5 rounded-lg bg-accent text-background font-bold text-sm hover:bg-accent/90 transition">
                {qi + 1 >= questions.length ? 'SEE RESULTS' : 'NEXT QUESTION →'}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// 3D VIEWER WRAPPER
// ─────────────────────────────────────────────
function Viewer3D({ children, height = 360 }: { children: React.ReactNode; height?: number }) {
  return (
    <div style={{ height }} className="w-full rounded-xl overflow-hidden border border-border bg-[#050a0f] relative">
      <Canvas camera={{ position: [3.5, 2, 4], fov: 45 }} shadows gl={{ antialias: true }}>
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 8, 5]} intensity={1.2} castShadow />
        <pointLight position={[-4, 4, -4]} intensity={0.4} color="#14b8a6" />
        <Suspense fallback={null}>
          {children}
        </Suspense>
        <OrbitControls makeDefault enablePan enableZoom enableRotate />
        <gridHelper args={[8, 16, '#1e293b', '#0f172a']} />
      </Canvas>
      <div className="absolute top-2 left-2 text-[9px] font-mono text-accent/60 bg-black/40 px-2 py-0.5 rounded">
        INTERACTIVE 3D · DRAG TO ORBIT
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────
const LESSONS = [
  { id: 'ch9-core', label: 'Ch 9: Tolerance Core', icon: '📖', badge: 'BOOK' },
  { id: 'types', label: 'Bilateral / Unilateral / Limit', icon: '⚖️', badge: 'TYPES' },
  { id: 'dim-vs-geom', label: 'Dimensional vs GD&T', icon: '🔄', badge: 'MATRIX' },
  { id: 'general-tol', label: 'General Tolerance (Title Block)', icon: '📋', badge: 'TABLE' },
  { id: 'lab', label: '3D Shaft/Hole Lab', icon: '🧊', badge: '3D' },
  { id: 'diagram', label: 'Tolerance Diagram', icon: '📊', badge: 'SVG' },
  { id: 'fits', label: 'Fits Animation', icon: '⚙️', badge: 'ANIM' },
  { id: 'checklist', label: 'Design Checklist & Summary', icon: '✅', badge: 'GATE' },
  { id: 'videos', label: 'Video Learning', icon: '🎥', badge: 'VIDEOS' },
  { id: 'practice', label: 'Practice Exercises', icon: '✏️', badge: 'QUIZ' },
];

export default function ToleranceModule() {
  const [activeLesson, setActiveLesson] = useState('ch9-core');

  // Hole parameters
  const [holeNominal] = useState(50.00);
  const [holeUpper, setHoleUpper] = useState(50.02);
  const [holeLower, setHoleLower] = useState(50.00);
  const [actualHole, setActualHole] = useState(50.01);

  // Shaft parameters
  const [shaftNominal] = useState(49.98);
  const [shaftUpper, setShaftUpper] = useState(50.00);
  const [shaftLower, setShaftLower] = useState(49.98);
  const [actualShaft, setActualShaft] = useState(49.99);

  // Fits mode
  const [fitMode, setFitMode] = useState<'clearance' | 'transition' | 'interference'>('clearance');

  // Derived values
  const maxClearance = holeUpper - shaftLower;
  const minClearance = holeLower - shaftUpper;
  const fitType = minClearance > 0 ? 'CLEARANCE FIT' : maxClearance < 0 ? 'INTERFERENCE FIT' : 'TRANSITION FIT';
  const fitColor = fitType === 'CLEARANCE FIT' ? '#14b8a6' : fitType === 'INTERFERENCE FIT' ? '#ef4444' : '#f59e0b';

  return (
    <div className="min-h-screen bg-background text-text-primary">
      <Navbar />

      {/* Hero Banner */}
      <div className="relative overflow-hidden border-b border-border bg-[#050a0f]">
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: 'linear-gradient(rgba(22,184,166,0.06) 1px,transparent 1px),linear-gradient(90deg,rgba(22,184,166,0.06) 1px,transparent 1px)',
          backgroundSize: '32px 32px',
        }} />
        <div className="relative max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest font-bold">Chapter 09</span>
                <span className="text-text-secondary/40">›</span>
                <span className="text-[10px] font-mono text-accent uppercase tracking-widest">Tolerance Engineering</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-text-primary">
                TOLERANCE <span className="text-cyan-400">ENGINEERING</span>
              </h1>
              <p className="text-sm text-text-secondary mt-1 max-w-2xl">
                Permissible dimensional variation, limits and fits, general tolerances, and the critical link between dimensional limits and GD&T geometric controls.
              </p>
              <p className="text-[10px] font-mono text-text-secondary/60 mt-2 italic">
                Mechanical Industrial Book Reference: Chapter 9 • Tolerance = Maximum Limit − Minimum Limit • Final Gate: “Tolerances Checked”
              </p>
            </div>
            <div className="flex gap-2 flex-wrap max-w-md justify-end">
              {[
                'Ch 9 Core',
                '50 ± 0.05 mm Example',
                'Bilateral & Unilateral',
                'Dim vs Geometric',
                'Title Block ±0.1~0.3',
                'Tolerances Checked Gate',
              ].map((tag) => (
                <span key={tag} className="text-[10px] font-mono px-2.5 py-1 rounded-full border border-cyan-500/30 text-cyan-300 bg-cyan-500/5">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main layout */}
      <div className="max-w-7xl mx-auto px-4 py-8 flex gap-6">
        {/* Sidebar */}
        <aside className="hidden lg:block w-56 shrink-0">
          <div className="sticky top-20 space-y-1.5">
            <div className="text-[10px] font-mono text-text-secondary uppercase tracking-widest mb-3 px-2 flex items-center justify-between">
              <span>CHAPTER 9 MODULES</span>
              <span className="text-cyan-400 font-bold">{LESSONS.length}</span>
            </div>
            {LESSONS.map((l) => (
              <button
                key={l.id}
                onClick={() => setActiveLesson(l.id)}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold transition flex items-center justify-between group ${
                  activeLesson === l.id
                    ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 shadow-sm'
                    : 'text-text-secondary hover:text-text-primary hover:bg-surface border border-transparent'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <span className="text-sm shrink-0">{l.icon}</span>
                  <span className="truncate">{l.label}</span>
                </div>
                {l.badge && (
                  <span className={`text-[8px] font-mono px-1.5 py-0.5 rounded uppercase tracking-wider shrink-0 ${
                    activeLesson === l.id ? 'bg-cyan-400 text-slate-950 font-bold' : 'bg-surface-elevated text-text-secondary border border-border'
                  }`}>
                    {l.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        </aside>

        {/* Mobile tabs */}
        <div className="lg:hidden mb-4 flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 w-full">
          {LESSONS.map((l) => (
            <button
              key={l.id}
              onClick={() => setActiveLesson(l.id)}
              className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                activeLesson === l.id ? 'bg-cyan-400 text-slate-950 shadow' : 'bg-surface border border-border text-text-secondary'
              }`}
            >
              <span>{l.icon}</span>
              <span>{l.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <main className="flex-1 min-w-0 space-y-8">

          {/* ── CHAPTER 9 CORE & INTRODUCTION ── */}
          {activeLesson === 'ch9-core' && (
            <section className="space-y-8">
              <Chapter9CoreSection />

              {/* Key terms grid */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-2">
                  <span className="text-cyan-400 font-mono text-xs font-bold">TERMINOLOGY</span>
                  <span className="text-text-secondary">|</span>
                  <h4 className="text-sm font-bold text-text-primary tracking-wide">CORE TOLERANCE VOCABULARY</h4>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {[
                    { term: 'NOMINAL SIZE', def: 'The ideal theoretical dimension stated on the drawing. Example: Ø50.00 mm.', color: '#14b8a6' },
                    { term: 'UPPER LIMIT', def: 'The largest permissible value. The feature may not exceed this.', color: '#6366f1' },
                    { term: 'LOWER LIMIT', def: 'The smallest permissible value. The feature may not be smaller than this.', color: '#f59e0b' },
                    { term: 'TOLERANCE', def: 'Upper Limit − Lower Limit. The total permissible variation range.', color: '#ec4899' },
                    { term: 'ACTUAL SIZE', def: 'The measured dimension of the manufactured part.', color: '#22c55e' },
                    { term: 'DEVIATION', def: 'Difference between actual size and nominal size.', color: '#f97316' },
                  ].map((item) => (
                    <div key={item.term} className="bg-surface border border-border rounded-xl p-3.5 hover:border-accent/30 transition">
                      <div className="text-[10px] font-mono font-bold mb-1 tracking-widest" style={{ color: item.color }}>{item.term}</div>
                      <p className="text-xs text-text-secondary">{item.def}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tolerance notation overview */}
              <div className="bg-surface-elevated border border-border rounded-xl p-5">
                <h4 className="text-xs font-mono font-bold text-cyan-400 tracking-widest mb-3 uppercase">TOLERANCE NOTATION FORMATS PREVIEW</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-sm">
                  <div className="bg-surface rounded-lg p-3 border border-border text-center">
                    <div className="text-text-secondary text-[9px] mb-2">BILATERAL</div>
                    <div className="text-text-primary text-base font-bold">50.00 ± 0.05 mm</div>
                    <div className="text-text-secondary text-[9px] mt-1">Range: 49.95 — 50.05</div>
                  </div>
                  <div className="bg-surface rounded-lg p-3 border border-border text-center">
                    <div className="text-text-secondary text-[9px] mb-2">UNILATERAL</div>
                    <div className="text-text-primary text-base font-bold">50.00 +0.10/−0.00</div>
                    <div className="text-text-secondary text-[9px] mt-1">Range: 50.00 — 50.10</div>
                  </div>
                  <div className="bg-surface rounded-lg p-3 border border-border text-center">
                    <div className="text-text-secondary text-[9px] mb-2">LIMIT FORMAT</div>
                    <div className="text-text-primary text-base font-bold">49.95 – 50.05 mm</div>
                    <div className="text-text-secondary text-[9px] mt-1">Lower: 49.95 / Upper: 50.05</div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* ── TYPES OF DIMENSIONAL TOLERANCE ── */}
          {activeLesson === 'types' && (
            <section className="space-y-6">
              <DimensionalToleranceTypesSection />
            </section>
          )}

          {/* ── DIMENSIONAL VS GEOMETRIC (GD&T) ── */}
          {activeLesson === 'dim-vs-geom' && (
            <section className="space-y-6">
              <DimVsGeomSection />
            </section>
          )}

          {/* ── GENERAL TOLERANCE (TITLE BLOCK) ── */}
          {activeLesson === 'general-tol' && (
            <section className="space-y-6">
              <GeneralToleranceSection />
            </section>
          )}

          {/* ── DESIGN CHECKLIST & SUMMARY ── */}
          {activeLesson === 'checklist' && (
            <section className="space-y-6">
              <ChecklistAndSummarySection />
            </section>
          )}

          {/* ── 3D SHAFT / HOLE LAB ── */}
          {activeLesson === 'lab' && (
            <section className="space-y-6">
              <div>
                <h2 className="text-xl font-black text-text-primary tracking-wide">3D SHAFT / HOLE LAB</h2>
                <p className="text-sm text-text-secondary mt-1">Adjust hole and shaft dimensions to visualize clearance, transition, and interference fits in 3D.</p>
              </div>

              {/* Derived values display */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: 'MAX CLEARANCE', val: maxClearance.toFixed(3) + ' mm', color: '#14b8a6' },
                  { label: 'MIN CLEARANCE', val: minClearance.toFixed(3) + ' mm', color: minClearance < 0 ? '#ef4444' : '#14b8a6' },
                  { label: 'FIT TYPE', val: fitType, color: fitColor },
                  { label: 'HOLE TOLERANCE', val: (holeUpper - holeLower).toFixed(3) + ' mm', color: '#6366f1' },
                ].map((item) => (
                  <div key={item.label} className="bg-surface border border-border rounded-lg p-3 text-center">
                    <div className="text-[9px] font-mono text-text-secondary mb-1">{item.label}</div>
                    <div className="text-sm font-bold font-mono" style={{ color: item.color }}>{item.val}</div>
                  </div>
                ))}
              </div>

              {/* Parameter controls */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* HOLE */}
                <div className="bg-surface border border-border rounded-xl p-4 space-y-3">
                  <h3 className="text-xs font-mono font-bold text-accent tracking-widest">HOLE Ø {holeNominal.toFixed(2)} mm</h3>
                  <div>
                    <div className="flex justify-between text-[10px] font-mono text-text-secondary mb-1">
                      <span>UPPER LIMIT</span><span className="text-accent">{holeUpper.toFixed(3)} mm</span>
                    </div>
                    <input type="range" min={50.00} max={50.06} step={0.001} value={holeUpper} onChange={(e) => setHoleUpper(+e.target.value)} className="w-full accent-teal-400" />
                  </div>
                  <div>
                    <div className="flex justify-between text-[10px] font-mono text-text-secondary mb-1">
                      <span>LOWER LIMIT</span><span className="text-accent">{holeLower.toFixed(3)} mm</span>
                    </div>
                    <input type="range" min={49.97} max={50.00} step={0.001} value={holeLower} onChange={(e) => setHoleLower(+e.target.value)} className="w-full accent-teal-400" />
                  </div>
                  <div>
                    <div className="flex justify-between text-[10px] font-mono text-text-secondary mb-1">
                      <span>ACTUAL HOLE</span><span className={actualHole >= holeLower && actualHole <= holeUpper ? 'text-emerald-400' : 'text-red-400'}>{actualHole.toFixed(3)} mm</span>
                    </div>
                    <input type="range" min={49.97} max={50.06} step={0.001} value={actualHole} onChange={(e) => setActualHole(+e.target.value)} className="w-full accent-teal-400" />
                  </div>
                </div>

                {/* SHAFT */}
                <div className="bg-surface border border-border rounded-xl p-4 space-y-3">
                  <h3 className="text-xs font-mono font-bold text-accent tracking-widest">SHAFT Ø {shaftNominal.toFixed(2)} mm</h3>
                  <div>
                    <div className="flex justify-between text-[10px] font-mono text-text-secondary mb-1">
                      <span>UPPER LIMIT</span><span className="text-accent">{shaftUpper.toFixed(3)} mm</span>
                    </div>
                    <input type="range" min={49.97} max={50.04} step={0.001} value={shaftUpper} onChange={(e) => setShaftUpper(+e.target.value)} className="w-full accent-teal-400" />
                  </div>
                  <div>
                    <div className="flex justify-between text-[10px] font-mono text-text-secondary mb-1">
                      <span>LOWER LIMIT</span><span className="text-accent">{shaftLower.toFixed(3)} mm</span>
                    </div>
                    <input type="range" min={49.94} max={50.00} step={0.001} value={shaftLower} onChange={(e) => setShaftLower(+e.target.value)} className="w-full accent-teal-400" />
                  </div>
                  <div>
                    <div className="flex justify-between text-[10px] font-mono text-text-secondary mb-1">
                      <span>ACTUAL SHAFT</span><span className={actualShaft >= shaftLower && actualShaft <= shaftUpper ? 'text-emerald-400' : 'text-red-400'}>{actualShaft.toFixed(3)} mm</span>
                    </div>
                    <input type="range" min={49.94} max={50.04} step={0.001} value={actualShaft} onChange={(e) => setActualShaft(+e.target.value)} className="w-full accent-teal-400" />
                  </div>
                </div>
              </div>

              <Viewer3D height={380}>
                <ShaftHoleModel
                  holeUpper={holeUpper} holeLower={holeLower}
                  shaftUpper={shaftUpper} shaftLower={shaftLower}
                  actualShaft={actualShaft} actualHole={actualHole}
                />
              </Viewer3D>
            </section>
          )}

          {/* ── TOLERANCE DIAGRAM ── */}
          {activeLesson === 'diagram' && (
            <section className="space-y-6">
              <div>
                <h2 className="text-xl font-black text-text-primary tracking-wide">TOLERANCE ZONE DIAGRAM</h2>
                <p className="text-sm text-text-secondary mt-1">Interactive tolerance zone visualization for hole and shaft. Move the "ACTUAL" sliders to see whether the part is in or out of tolerance.</p>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <ToleranceDiagram
                    nominal={50.00} upper={50.025} lower={49.99}
                    actual={actualHole}
                    label="HOLE"
                  />
                  <div>
                    <div className="flex justify-between text-[10px] font-mono text-text-secondary mb-1">
                      <span>DRAG ACTUAL HOLE SIZE</span><span className="text-accent">{actualHole.toFixed(3)} mm</span>
                    </div>
                    <input type="range" min={49.96} max={50.06} step={0.001} value={actualHole} onChange={(e) => setActualHole(+e.target.value)} className="w-full accent-teal-400" />
                  </div>
                </div>
                <div className="space-y-4">
                  <ToleranceDiagram
                    nominal={49.98} upper={50.00} lower={49.975}
                    actual={actualShaft}
                    label="SHAFT"
                  />
                  <div>
                    <div className="flex justify-between text-[10px] font-mono text-text-secondary mb-1">
                      <span>DRAG ACTUAL SHAFT SIZE</span><span className="text-accent">{actualShaft.toFixed(3)} mm</span>
                    </div>
                    <input type="range" min={49.94} max={50.04} step={0.001} value={actualShaft} onChange={(e) => setActualShaft(+e.target.value)} className="w-full accent-teal-400" />
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* ── FITS ANIMATION ── */}
          {activeLesson === 'fits' && (
            <section className="space-y-6">
              <div>
                <h2 className="text-xl font-black text-text-primary tracking-wide">SHAFT & HOLE FIT ANIMATION</h2>
                <p className="text-sm text-text-secondary mt-1">Animate shaft entering a hole for each fit condition. Select a fit type:</p>
              </div>
              <div className="flex gap-3">
                {(['clearance', 'transition', 'interference'] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => setFitMode(m)}
                    className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider border transition ${
                      fitMode === m
                        ? m === 'clearance' ? 'bg-teal-500/20 border-teal-500 text-teal-400'
                          : m === 'transition' ? 'bg-amber-500/20 border-amber-500 text-amber-400'
                          : 'bg-red-500/20 border-red-500 text-red-400'
                        : 'bg-surface border-border text-text-secondary hover:border-accent/40'
                    }`}
                  >
                    {m.replace('-', ' ')} FIT
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
                <div className="bg-teal-500/10 border border-teal-500/30 rounded-lg p-3">
                  <div className="text-teal-400 font-bold mb-1">CLEARANCE FIT</div>
                  <div className="text-text-secondary">Shaft is always smaller than hole. Free sliding movement. Minimum clearance &gt; 0.</div>
                </div>
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3">
                  <div className="text-amber-400 font-bold mb-1">TRANSITION FIT</div>
                  <div className="text-text-secondary">May result in clearance or interference depending on actual sizes. Locating fits.</div>
                </div>
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                  <div className="text-red-400 font-bold mb-1">INTERFERENCE FIT</div>
                  <div className="text-text-secondary">Shaft is always larger than hole. Requires force or heat to assemble. Maximum clearance &lt; 0.</div>
                </div>
              </div>

              <Viewer3D height={400}>
                <ShaftEntryAnimation mode={fitMode} />
              </Viewer3D>
            </section>
          )}

          {/* ── VIDEOS ── */}
          {activeLesson === 'videos' && (
            <section className="space-y-6">
              <div>
                <h2 className="text-xl font-black text-text-primary tracking-wide">VIDEO LEARNING</h2>
                <p className="text-sm text-text-secondary mt-1">Six comprehensive lessons covering dimensional tolerance theory and application.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {TOL_VIDEOS.map((v) => <VideoCard key={v.id} v={v} />)}
              </div>
            </section>
          )}

          {/* ── PRACTICE ── */}
          {activeLesson === 'practice' && (
            <section className="space-y-6">
              <div>
                <h2 className="text-xl font-black text-text-primary tracking-wide">PRACTICE EXERCISES</h2>
                <p className="text-sm text-text-secondary mt-1">Is the measured dimension within tolerance? Work through each engineering scenario.</p>
              </div>
              <PracticeSection />
            </section>
          )}

        </main>
      </div>
    </div>
  );
}
