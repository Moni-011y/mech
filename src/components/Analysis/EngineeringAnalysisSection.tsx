import { useState, useEffect, useRef } from 'react';
import WheelchairAnalysis3D, { type AnalysisMode } from './WheelchairAnalysis3D';

interface EngineeringAnalysisSectionProps {
  onBack?: () => void;
}

// ─── SVG Engineering Illustrations ───────────────────────────────────────────

function HeroMeshSVG() {
  return (
    <svg viewBox="0 0 400 220" className="w-full h-full opacity-30" xmlns="http://www.w3.org/2000/svg">
      {Array.from({ length: 9 }).map((_, r) =>
        Array.from({ length: 16 }).map((_, c) => {
          const x = 10 + c * 24;
          const y = 10 + r * 24;
          const hue = Math.sin(r * 0.5 + c * 0.3) * 0.5 + 0.5;
          const color = hue > 0.7 ? '#ef4444' : hue > 0.45 ? '#f59e0b' : '#16B8A6';
          return (
            <rect key={`${r}-${c}`} x={x} y={y} width={22} height={22} fill={color} fillOpacity={0.15 + hue * 0.25} stroke="#16B8A6" strokeOpacity={0.25} strokeWidth={0.5} rx={1} />
          );
        })
      )}
      <ellipse cx="200" cy="110" rx="60" ry="40" fill="#ef4444" fillOpacity="0.08" stroke="#ef4444" strokeOpacity="0.4" strokeWidth="1.5" strokeDasharray="4 3" />
      <text x="200" y="114" textAnchor="middle" fill="#ef4444" fontSize="9" fontFamily="monospace" opacity="0.7">MAX STRESS ZONE</text>
    </svg>
  );
}

function StaticStructuralSVG() {
  return (
    <svg viewBox="0 0 280 160" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="stressGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="30%" stopColor="#16B8A6" />
          <stop offset="65%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#ef4444" />
        </linearGradient>
        <marker id="arrowRed1" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill="#ef4444" />
        </marker>
      </defs>
      <rect x="20" y="60" width="240" height="40" rx="4" fill="url(#stressGrad1)" opacity="0.8" />
      <rect x="10" y="55" width="12" height="50" fill="#7D8790" rx="2" />
      <path d="M0 50 L22 55 L22 105 L0 110 Z" fill="#30363D" />
      <line x1="140" y1="20" x2="140" y2="56" stroke="#ef4444" strokeWidth="2" markerEnd="url(#arrowRed1)" />
      <line x1="100" y1="25" x2="100" y2="56" stroke="#ef4444" strokeWidth="1.5" markerEnd="url(#arrowRed1)" />
      <line x1="180" y1="25" x2="180" y2="56" stroke="#ef4444" strokeWidth="1.5" markerEnd="url(#arrowRed1)" />
      <text x="140" y="15" textAnchor="middle" fill="#ef4444" fontSize="8" fontFamily="monospace">APPLIED LOAD</text>
      <rect x="20" y="120" width="240" height="8" rx="2" fill="url(#stressGrad1)" opacity="0.7" />
      <text x="20" y="145" fill="#3B82F6" fontSize="7" fontFamily="monospace">LOW STRESS</text>
      <text x="250" y="145" textAnchor="end" fill="#ef4444" fontSize="7" fontFamily="monospace">HIGH STRESS</text>
      <text x="140" y="155" textAnchor="middle" fill="#9DA7B0" fontSize="7" fontFamily="monospace">CONCEPTUAL STRESS DISTRIBUTION</text>
    </svg>
  );
}

function ThermalSVG() {
  return (
    <svg viewBox="0 0 280 160" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="thermalGrad1" cx="35%" cy="50%" r="55%">
          <stop offset="0%" stopColor="#ef4444" />
          <stop offset="35%" stopColor="#f59e0b" />
          <stop offset="65%" stopColor="#16B8A6" />
          <stop offset="100%" stopColor="#3B82F6" />
        </radialGradient>
        <linearGradient id="tempScale1" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="50%" stopColor="#16B8A6" />
          <stop offset="75%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#ef4444" />
        </linearGradient>
      </defs>
      <rect x="30" y="30" width="220" height="100" rx="8" fill="url(#thermalGrad1)" opacity="0.85" />
      {[45, 65, 85, 110].map((r, i) => (
        <ellipse key={i} cx="108" cy="80" rx={r} ry={r * 0.5} fill="none" stroke="white" strokeOpacity="0.2" strokeWidth="1" strokeDasharray="3 2" />
      ))}
      <text x="108" y="83" textAnchor="middle" fill="white" fontSize="8" fontFamily="monospace" fontWeight="bold">HOT ZONE</text>
      <text x="235" y="83" textAnchor="middle" fill="white" fontSize="8" fontFamily="monospace">COOL</text>
      <rect x="30" y="143" width="220" height="7" rx="2" fill="url(#tempScale1)" opacity="0.8" />
      <text x="30" y="158" fill="#3B82F6" fontSize="7" fontFamily="monospace">LOW TEMP</text>
      <text x="250" y="158" textAnchor="end" fill="#ef4444" fontSize="7" fontFamily="monospace">HIGH TEMP</text>
    </svg>
  );
}

function FatigueSVG() {
  return (
    <svg viewBox="0 0 280 160" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <line x1="30" y1="130" x2="30" y2="20" stroke="#30363D" strokeWidth="1" />
      <line x1="30" y1="130" x2="260" y2="130" stroke="#30363D" strokeWidth="1" />
      <path d="M40 30 Q80 35 120 70 Q160 105 200 118 L255 120" fill="none" stroke="#16B8A6" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="30" y1="118" x2="260" y2="118" stroke="#f59e0b" strokeWidth="1.2" strokeDasharray="5 3" />
      <text x="200" y="114" fill="#f59e0b" fontSize="7" fontFamily="monospace">ENDURANCE LIMIT</text>
      <rect x="40" y="25" width="80" height="50" fill="#ef4444" fillOpacity="0.06" />
      <text x="80" y="55" textAnchor="middle" fill="#ef4444" fontSize="7" fontFamily="monospace">FAILURE ZONE</text>
      <rect x="150" y="90" width="105" height="35" fill="#16B8A6" fillOpacity="0.07" />
      <text x="200" y="110" textAnchor="middle" fill="#16B8A6" fontSize="7" fontFamily="monospace">SAFE ZONE</text>
      <text x="145" y="148" textAnchor="middle" fill="#9DA7B0" fontSize="8" fontFamily="monospace">NUMBER OF CYCLES (N)</text>
      <text x="145" y="160" textAnchor="middle" fill="#9DA7B0" fontSize="6" fontFamily="monospace">CONCEPTUAL S-N CURVE</text>
    </svg>
  );
}

function VibrationSVG() {
  return (
    <svg viewBox="0 0 280 160" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <line x1="20" y1="80" x2="260" y2="80" stroke="#30363D" strokeWidth="1.5" strokeDasharray="4 3" />
      <path d="M20 80 Q90 30 140 80 Q190 130 260 80" fill="none" stroke="#16B8A6" strokeWidth="2.5" opacity="0.9" />
      <path d="M20 80 Q60 30 100 80 Q140 130 180 80 Q220 30 260 80" fill="none" stroke="#f59e0b" strokeWidth="1.8" strokeDasharray="4 2" opacity="0.7" />
      {[20, 260].map((x, i) => <circle key={i} cx={x} cy={80} r={4} fill="#16B8A6" />)}
      <circle cx={140} cy={80} r={3} fill="#f59e0b" />
      <text x="90" y="26" fill="#16B8A6" fontSize="7" fontFamily="monospace">MODE 1 (fn1)</text>
      <text x="145" y="150" textAnchor="middle" fill="#9DA7B0" fontSize="7" fontFamily="monospace">MODE 2 (fn2)</text>
      <text x="145" y="160" textAnchor="middle" fill="#9DA7B0" fontSize="6" fontFamily="monospace">CONCEPTUAL VIBRATION MODE SHAPES</text>
      <text x="145" y="16" textAnchor="middle" fill="#9DA7B0" fontSize="7" fontFamily="monospace">NATURAL FREQUENCY VISUALIZATION</text>
    </svg>
  );
}

function CFDSvg() {
  return (
    <svg viewBox="0 0 280 160" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <path d="M40 80 Q80 50 160 78 Q200 83 240 80 Q200 90 160 82 Q80 112 40 80 Z" fill="#20262E" stroke="#16B8A6" strokeWidth="1.5" />
      {[0, 8, 16, 24, 32].map((offset, i) => (
        <path
          key={`u${i}`}
          d={`M10 ${48 + offset} Q120 ${38 + offset * 0.3} 200 ${52 + offset * 0.4} Q230 ${54 + offset * 0.4} 265 ${48 + offset}`}
          fill="none"
          stroke={i === 0 ? '#ef4444' : i === 1 ? '#f59e0b' : '#16B8A6'}
          strokeWidth={i === 0 ? 1.8 : 1.2}
          strokeOpacity={0.8 - i * 0.12}
        />
      ))}
      {[0, 8, 16, 24].map((offset, i) => (
        <path
          key={`l${i}`}
          d={`M10 ${88 + offset} Q100 ${92 + offset} 165 ${84 + offset} Q210 ${82 + offset} 265 ${88 + offset}`}
          fill="none"
          stroke="#16B8A6"
          strokeWidth="1.2"
          strokeOpacity={0.5 - i * 0.08}
        />
      ))}
      <text x="145" y="158" textAnchor="middle" fill="#9DA7B0" fontSize="6" fontFamily="monospace">CONCEPTUAL CFD STREAMLINES</text>
      <text x="12" y="44" fill="#ef4444" fontSize="7" fontFamily="monospace">HIGH V</text>
      <text x="12" y="102" fill="#16B8A6" fontSize="7" fontFamily="monospace">LOW V</text>
    </svg>
  );
}

function WheelchairFrameSVG() {
  const spokeAngles = [0, 45, 90, 135];
  return (
    <svg viewBox="0 0 340 260" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="frameGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#16B8A6" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.7" />
        </linearGradient>
        <linearGradient id="stressFrameGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.5" />
          <stop offset="40%" stopColor="#16B8A6" stopOpacity="0.7" />
          <stop offset="75%" stopColor="#f59e0b" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#ef4444" stopOpacity="0.9" />
        </linearGradient>
        <marker id="arrRed2" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8 Z" fill="#ef4444" />
        </marker>
      </defs>
      <rect x="80" y="80" width="180" height="8" rx="4" fill="url(#frameGrad2)" />
      <rect x="80" y="80" width="8" height="100" rx="4" fill="url(#frameGrad2)" />
      <rect x="252" y="80" width="8" height="100" rx="4" fill="url(#frameGrad2)" />
      <rect x="80" y="172" width="180" height="8" rx="4" fill="url(#stressFrameGrad2)" />
      <rect x="120" y="100" width="8" height="72" rx="3" fill="url(#frameGrad2)" />
      <rect x="210" y="100" width="8" height="72" rx="3" fill="url(#frameGrad2)" />
      <line x1="80" y1="140" x2="260" y2="140" stroke="#16B8A6" strokeWidth="5" strokeLinecap="round" opacity="0.6" />
      <rect x="100" y="74" width="140" height="12" rx="5" fill="#20262E" stroke="#16B8A6" strokeWidth="1.5" />
      <rect x="92" y="30" width="10" height="56" rx="4" fill="url(#frameGrad2)" />
      <rect x="242" y="30" width="10" height="56" rx="4" fill="url(#frameGrad2)" />
      <rect x="92" y="30" width="160" height="10" rx="4" fill="url(#frameGrad2)" />
      <circle cx="100" cy="210" r="38" fill="none" stroke="#16B8A6" strokeWidth="3.5" />
      <circle cx="100" cy="210" r="28" fill="none" stroke="#16B8A6" strokeWidth="1.5" strokeDasharray="6 4" />
      <circle cx="100" cy="210" r="6" fill="#16B8A6" />
      <circle cx="240" cy="210" r="38" fill="none" stroke="#16B8A6" strokeWidth="3.5" />
      <circle cx="240" cy="210" r="28" fill="none" stroke="#16B8A6" strokeWidth="1.5" strokeDasharray="6 4" />
      <circle cx="240" cy="210" r="6" fill="#16B8A6" />
      {spokeAngles.map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        const cos = Math.cos(rad);
        const sin = Math.sin(rad);
        return (
          <g key={i}>
            <line x1={100 + cos * 6} y1={210 + sin * 6} x2={100 + cos * 28} y2={210 + sin * 28} stroke="#16B8A6" strokeWidth="1" opacity="0.6" />
            <line x1={100 - cos * 6} y1={210 - sin * 6} x2={100 - cos * 28} y2={210 - sin * 28} stroke="#16B8A6" strokeWidth="1" opacity="0.6" />
            <line x1={240 + cos * 6} y1={210 + sin * 6} x2={240 + cos * 28} y2={210 + sin * 28} stroke="#16B8A6" strokeWidth="1" opacity="0.6" />
            <line x1={240 - cos * 6} y1={210 - sin * 6} x2={240 - cos * 28} y2={210 - sin * 28} stroke="#16B8A6" strokeWidth="1" opacity="0.6" />
          </g>
        );
      })}
      <line x1="170" y1="10" x2="170" y2="68" stroke="#ef4444" strokeWidth="2.5" markerEnd="url(#arrRed2)" />
      <text x="170" y="8" textAnchor="middle" fill="#ef4444" fontSize="9" fontFamily="monospace" fontWeight="bold">150 kg LOAD</text>
      <text x="170" y="252" textAnchor="middle" fill="#9DA7B0" fontSize="7" fontFamily="monospace">CONCEPTUAL ILLUSTRATION — NOT ACTUAL SIMULATION DATA</text>
    </svg>
  );
}

// ─── Analysis Type Card ───────────────────────────────────────────────────────

interface AnalysisCardProps {
  num: string;
  title: string;
  subtitle?: string;
  purpose: string;
  expandedDesc: string;
  icon: string;
  IllustrationComponent: React.FC;
}

function AnalysisCard({ num, title, subtitle, purpose, expandedDesc, icon, IllustrationComponent }: AnalysisCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={`bg-surface rounded-2xl border transition-all duration-300 group overflow-hidden flex flex-col ${
        expanded ? 'border-accent/60 shadow-lg shadow-accent/10' : 'border-border hover:border-accent/40'
      }`}
    >
      <div className="h-36 bg-surface-elevated flex items-center justify-center p-3 border-b border-border/40">
        <IllustrationComponent />
      </div>
      <div className="p-4 space-y-3 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-2">
          <div>
            <span className="text-[10px] font-mono text-accent/70 font-bold">{num}</span>
            <h3 className="text-sm font-bold text-text-primary group-hover:text-accent transition leading-tight mt-0.5">
              {title}
            </h3>
            {subtitle && <span className="text-[10px] text-text-secondary font-mono">{subtitle}</span>}
          </div>
          <span className="text-xl mt-0.5 shrink-0">{icon}</span>
        </div>
        <p className="text-xs text-text-secondary leading-relaxed">{purpose}</p>
        {expanded && (
          <div className="pt-2 border-t border-border/40">
            <p className="text-xs text-text-secondary leading-relaxed">{expandedDesc}</p>
          </div>
        )}
        <button
          onClick={() => setExpanded((v) => !v)}
          className="text-[11px] font-mono font-bold text-accent hover:text-accent-bright transition flex items-center gap-1 mt-auto pt-1"
          aria-expanded={expanded}
        >
          {expanded ? '▲ SHOW LESS' : '▼ LEARN MORE'}
        </button>
      </div>
    </div>
  );
}

// ─── Workflow stages data ─────────────────────────────────────────────────────

const workflowStages = [
  { num: '01', icon: '🖥️', title: 'CAD Model', desc: 'Prepare the 3D model of the component to be analyzed.' },
  { num: '02', icon: '🔩', title: 'Material Assignment', desc: 'Assign appropriate material properties to the model.' },
  { num: '03', icon: '🔲', title: 'Meshing', desc: 'Divide the model into smaller elements for numerical analysis.' },
  { num: '04', icon: '📌', title: 'Boundary Conditions', desc: 'Define required constraints and support conditions.' },
  { num: '05', icon: '⬇️', title: 'Load Application', desc: 'Apply relevant loads to represent expected operating conditions.' },
  { num: '06', icon: '⚙️', title: 'Solver Execution', desc: "Run the analysis solver to calculate the component's response." },
  { num: '07', icon: '📊', title: 'Result Interpretation', desc: 'Evaluate generated results and identify critical areas.' },
  { num: '08', icon: '🔧', title: 'Optimization', desc: 'Use analysis findings to improve the design where necessary.' },
];

// ─── Case Study Tabs ──────────────────────────────────────────────────────────

const caseStudyTabs = [
  {
    key: 'deformation',
    label: 'Total Deformation',
    icon: '📐',
    description:
      'Total Deformation shows the maximum displacement of the wheelchair frame under the applied 150 kg load. Critical areas near the seat and cross members are monitored for excessive deflection.',
    label2: 'DEFORMATION MAP — CONCEPTUAL',
  },
  {
    key: 'stress',
    label: 'Equivalent Stress',
    icon: '⚡',
    description:
      'Equivalent (von Mises) Stress distribution reveals stress concentration zones across the frame tubes. Areas with higher stress values, shown in warm colors on the color map, indicate regions requiring reinforcement.',
    label2: 'STRESS DISTRIBUTION — CONCEPTUAL',
  },
  {
    key: 'fos',
    label: 'Factor of Safety',
    icon: '🛡️',
    description:
      'The Factor of Safety (FoS) evaluates the safety margin of the design by comparing material yield strength to working stress. A minimum FoS of 2.5 is typically required for structural components like wheelchair frames.',
    label2: 'FACTOR OF SAFETY MAP — CONCEPTUAL',
  },
  {
    key: 'life',
    label: 'Life Prediction',
    icon: '♾️',
    description:
      'Fatigue Life Prediction estimates the number of loading cycles before potential failure, based on cyclic stress analysis. The result guides maintenance intervals and design life specifications.',
    label2: 'FATIGUE LIFE MAP — CONCEPTUAL',
  },
];

// ─── Best Practices data ──────────────────────────────────────────────────────

const bestPractices = [
  { num: '01', icon: '🗂️', title: 'Revision Control', desc: 'Always maintain revision control to track design changes.' },
  { num: '02', icon: '📏', title: 'ISO & ASME Standards', desc: 'Follow ISO and ASME standards throughout the design process.' },
  { num: '03', icon: '📐', title: 'GD&T Application', desc: 'Apply GD&T wherever required.' },
  { num: '04', icon: '🖥️', title: 'Simulation Validation', desc: 'Validate design through simulation before manufacturing.' },
  { num: '05', icon: '📋', title: 'Bill of Materials', desc: 'Prepare a proper Bill of Materials (BOM) for every project.' },
  { num: '06', icon: '📄', title: 'Drawing Templates', desc: 'Maintain standardized drawing templates for consistency.' },
  { num: '07', icon: '🔖', title: 'Title Blocks', desc: 'Create standard title blocks on all engineering drawings.' },
  { num: '08', icon: '✏️', title: 'Change Documentation', desc: 'Document all design changes with rationale and date.' },
  { num: '09', icon: '👥', title: 'Design Reviews', desc: 'Conduct formal design reviews at key project milestones.' },
  { num: '10', icon: '📁', title: 'Project Records', desc: 'Maintain complete project records for future reference.' },
];

// ─── Checklist items data ─────────────────────────────────────────────────────

const checklistItems = [
  { key: 'cadModel', label: 'CAD Model Completed', icon: '🖥️' },
  { key: 'drafting', label: 'Drafting Completed', icon: '📐' },
  { key: 'dimensions', label: 'Dimensions Verified', icon: '📏' },
  { key: 'gdt', label: 'GD&T Applied', icon: '⊕' },
  { key: 'tolerances', label: 'Tolerances Checked', icon: '🔍' },
  { key: 'bom', label: 'BOM Prepared', icon: '📋' },
  { key: 'titleBlock', label: 'Title Block Verified', icon: '📄' },
  { key: 'analysis', label: 'Analysis Completed', icon: '📊' },
  { key: 'designReview', label: 'Design Review Approved', icon: '✅' },
  { key: 'finalRelease', label: 'Final Release Document Prepared', icon: '🚀' },
];

// ─── Scroll reveal hook ───────────────────────────────────────────────────────

function useScrollReveal(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return { ref, visible };
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function EngineeringAnalysisSection({ onBack }: EngineeringAnalysisSectionProps) {
  const [activeTab, setActiveTab] = useState<AnalysisMode>('deformation');
  const [viewMode, setViewMode] = useState<'3d' | '2d'>('3d');
  const [checkedList, setCheckedList] = useState<Record<string, boolean>>(
    Object.fromEntries(checklistItems.map((item) => [item.key, false]))
  );
  const [showComplete, setShowComplete] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

  const completedCount = Object.values(checkedList).filter(Boolean).length;
  const progressPct = Math.round((completedCount / checklistItems.length) * 100);

  const toggleCheck = (key: string) => {
    setCheckedList((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      setShowComplete(Object.values(next).every(Boolean));
      return next;
    });
  };

  const resetChecklist = () => {
    setCheckedList(Object.fromEntries(checklistItems.map((item) => [item.key, false])));
    setShowComplete(false);
  };

  useEffect(() => {
    const handleScroll = () => setShowBackToTop(window.scrollY > 500);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const introReveal = useScrollReveal();
  const typesReveal = useScrollReveal();
  const workflowReveal = useScrollReveal();
  const caseReveal = useScrollReveal();
  const bestReveal = useScrollReveal();
  const checkReveal = useScrollReveal();

  const activeTabData = caseStudyTabs.find((t) => t.key === activeTab)!;

  return (
    <div className="space-y-10 pb-20">
      {/* ── HERO ──────────────────────────────────────────────────────────────── */}
      <div className="relative rounded-2xl overflow-hidden border border-border bg-surface min-h-[220px] flex flex-col justify-end p-6 sm:p-10">
        <div className="absolute inset-0 pointer-events-none">
          <HeroMeshSVG />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/70 to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent pointer-events-none" />

        {onBack && (
          <button
            onClick={onBack}
            className="absolute top-4 left-4 sm:top-6 sm:left-6 z-10 inline-flex items-center gap-1.5 text-[11px] font-mono font-bold text-accent hover:text-accent-bright transition px-3 py-1.5 rounded-lg bg-surface-elevated/80 border border-border hover:border-accent/50 backdrop-blur-sm"
          >
            ← BACK TO TOPICS
          </button>
        )}

        <div className="relative z-10 mt-14 sm:mt-0 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/30 text-accent text-[11px] font-mono font-bold">
            FEA &amp; ENGINEERING SIMULATION
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-text-primary tracking-tight leading-tight">
            Engineering Analysis
          </h1>
          <p className="text-sm sm:text-base text-text-secondary max-w-2xl leading-relaxed">
            Predict component behavior, evaluate structural performance, and optimize engineering designs before manufacturing.
          </p>
        </div>
      </div>

      {/* ── SECTION 1: INTRODUCTION ──────────────────────────────────────────── */}
      <div
        ref={introReveal.ref}
        className={`space-y-6 transition-all duration-700 ${introReveal.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      >
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-mono text-accent font-bold tracking-widest">SECTION 01</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        <div className="bg-surface rounded-2xl border border-border p-6 sm:p-8 space-y-4">
          <div className="flex items-start gap-3">
            <span className="text-2xl mt-0.5">🔬</span>
            <div>
              <h2 className="text-xl font-bold text-text-primary mb-2">What is Engineering Analysis?</h2>
              <p className="text-sm text-text-secondary leading-relaxed">
                Engineering Analysis is the process of predicting how a component behaves under real-world conditions
                <strong className="text-text-primary"> before manufacturing</strong>. By simulating loads, temperatures,
                vibrations, and fluid interactions digitally, engineers identify weaknesses, optimize designs, and
                reduce development risk — all before a single prototype is built.
              </p>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-base font-bold text-text-primary mb-4">Objectives of Engineering Analysis</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: '🛡️', title: 'Reduce Failure', desc: 'Identify potential design weaknesses before manufacturing begins.', border: 'border-red-500/20', bg: 'from-red-500/10' },
              { icon: '✅', title: 'Improve Safety', desc: 'Evaluate whether a component can withstand expected operating conditions.', border: 'border-green-500/20', bg: 'from-green-500/10' },
              { icon: '⚡', title: 'Optimize Design', desc: 'Improve component performance through systematic engineering evaluation.', border: 'border-accent/20', bg: 'from-accent/10' },
              { icon: '💰', title: 'Reduce Development Cost', desc: 'Detect design issues early and reduce unnecessary development expenses.', border: 'border-yellow-500/20', bg: 'from-yellow-500/10' },
            ].map((obj) => (
              <div
                key={obj.title}
                className={`bg-gradient-to-b ${obj.bg} to-transparent bg-surface rounded-xl border ${obj.border} p-5 space-y-2 hover:scale-[1.02] transition-transform duration-200`}
              >
                <span className="text-2xl block">{obj.icon}</span>
                <h4 className="text-sm font-bold text-text-primary">{obj.title}</h4>
                <p className="text-xs text-text-secondary leading-relaxed">{obj.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── SECTION 2: TYPES OF ENGINEERING ANALYSIS ─────────────────────────── */}
      <div
        ref={typesReveal.ref}
        className={`space-y-6 transition-all duration-700 delay-100 ${typesReveal.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      >
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-mono text-accent font-bold tracking-widest">SECTION 02</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        <div>
          <h2 className="text-xl font-bold text-text-primary mb-1">Types of Engineering Analysis</h2>
          <p className="text-xs text-text-secondary">Click <em>Learn More</em> on any card to expand its description.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          <AnalysisCard
            num="01"
            title="Static Structural Analysis"
            icon="🏗️"
            purpose="Evaluate stress and deformation in a component under static loading conditions."
            expandedDesc="Static Structural Analysis uses the Finite Element Method (FEM) to calculate internal stresses, displacements, and reaction forces when a component is subjected to constant loads. The results help engineers determine whether the material yield strength is sufficient and identify regions requiring reinforcement."
            IllustrationComponent={StaticStructuralSVG}
          />
          <AnalysisCard
            num="02"
            title="Thermal Analysis"
            icon="🌡️"
            purpose="Study temperature distribution and heat flow within a component."
            expandedDesc="Thermal Analysis predicts how heat conducts through a structure, identifying hot spots and temperature gradients. It is critical for components near heat sources, such as engine parts, electronic housings, and heat exchangers, where thermal stress can cause warping or material degradation."
            IllustrationComponent={ThermalSVG}
          />
          <AnalysisCard
            num="03"
            title="Fatigue Analysis"
            icon="🔄"
            purpose="Predict component life under repeated or cyclic loading over time."
            expandedDesc="Fatigue Analysis uses S-N (Stress vs. Number of cycles) curves to estimate how many load cycles a component can sustain before crack initiation and propagation occur. This is critical for rotating machinery, vehicle frames, and structural joints exposed to fluctuating forces."
            IllustrationComponent={FatigueSVG}
          />
          <AnalysisCard
            num="04"
            title="Vibration Analysis"
            icon="〰️"
            purpose="Study the natural frequencies and mode shapes of a component."
            expandedDesc="Vibration Analysis identifies the natural frequencies at which a component resonates. If operating frequencies match natural frequencies, resonance can cause catastrophic failure. Modal analysis ensures designs avoid these conditions and helps engineers add damping or stiffen structures appropriately."
            IllustrationComponent={VibrationSVG}
          />
          <AnalysisCard
            num="05"
            title="CFD Analysis"
            subtitle="Computational Fluid Dynamics"
            icon="💨"
            purpose="Analyze fluid flow behavior around or through an engineering component."
            expandedDesc="Computational Fluid Dynamics (CFD) simulates how gases and liquids interact with surfaces. It is used in aerodynamics, HVAC design, pipe flow analysis, and cooling system optimization. CFD helps engineers minimize drag, improve heat transfer, and reduce turbulence losses without physical testing."
            IllustrationComponent={CFDSvg}
          />
        </div>
      </div>

      {/* ── SECTION 3: WORKFLOW ───────────────────────────────────────────────── */}
      <div
        ref={workflowReveal.ref}
        className={`space-y-6 transition-all duration-700 delay-100 ${workflowReveal.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      >
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-mono text-accent font-bold tracking-widest">SECTION 03</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        <div>
          <h2 className="text-xl font-bold text-text-primary mb-1">Industrial Analysis Project Execution</h2>
          <p className="text-xs text-text-secondary">Eight-stage workflow followed in professional engineering analysis projects.</p>
        </div>

        {/* Desktop: horizontal timeline */}
        <div className="hidden lg:block overflow-x-auto pb-4">
          <div className="relative flex items-start gap-0 min-w-[900px]">
            {workflowStages.map((stage, i) => (
              <div key={stage.num} className="flex-1 flex flex-col items-center group relative px-1">
                {i < workflowStages.length - 1 && (
                  <div className="absolute top-6 left-1/2 w-full h-0.5 bg-gradient-to-r from-accent/40 to-accent/10 z-0" />
                )}
                <div className="relative z-10 w-12 h-12 rounded-full bg-surface-elevated border-2 border-accent/40 group-hover:border-accent transition-all flex items-center justify-center text-lg mb-3 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-accent/20 duration-200">
                  {stage.icon}
                </div>
                <span className="text-[10px] font-mono text-accent font-bold mb-1">STAGE {stage.num}</span>
                <h4 className="text-xs font-bold text-text-primary text-center mb-1 px-1">{stage.title}</h4>
                <p className="text-[10px] text-text-secondary text-center leading-relaxed px-2">{stage.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile: vertical timeline */}
        <div className="lg:hidden space-y-0">
          {workflowStages.map((stage, i) => (
            <div key={stage.num} className="flex gap-4 group">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-surface-elevated border-2 border-accent/40 group-hover:border-accent transition-all flex items-center justify-center text-base shrink-0">
                  {stage.icon}
                </div>
                {i < workflowStages.length - 1 && (
                  <div className="w-0.5 flex-1 bg-gradient-to-b from-accent/40 to-accent/10 my-1 min-h-[32px]" />
                )}
              </div>
              <div className="pb-6">
                <span className="text-[10px] font-mono text-accent font-bold">STAGE {stage.num}</span>
                <h4 className="text-sm font-bold text-text-primary mt-0.5">{stage.title}</h4>
                <p className="text-xs text-text-secondary leading-relaxed mt-1">{stage.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── SECTION 4: CASE STUDY ─────────────────────────────────────────────── */}
      <div
        ref={caseReveal.ref}
        className={`space-y-6 transition-all duration-700 delay-100 ${caseReveal.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      >
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-mono text-accent font-bold tracking-widest">SECTION 04</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-text-primary mb-1">Practical Engineering Case Study</h2>
            <p className="text-xs text-text-secondary">Wheelchair Frame Analysis — interactive 3D structural analysis simulation.</p>
          </div>
          <div className="flex items-center p-1 rounded-xl bg-surface border border-border">
            <button
              onClick={() => setViewMode('3d')}
              className={`text-[11px] font-mono font-bold px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                viewMode === '3d'
                  ? 'bg-accent text-background shadow-sm'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              <span>🎲</span>
              <span>3D Simulation</span>
            </button>
            <button
              onClick={() => setViewMode('2d')}
              className={`text-[11px] font-mono font-bold px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                viewMode === '2d'
                  ? 'bg-accent text-background shadow-sm'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              <span>📐</span>
              <span>2D Schematic</span>
            </button>
          </div>
        </div>

        {viewMode === '3d' ? (
          <div className="space-y-4">
            {/* Context callout */}
            <div className="bg-surface rounded-xl border border-border p-4 sm:p-5">
              <h4 className="text-sm font-bold text-text-primary mb-1.5 flex items-center gap-2">
                <span>♿</span> Why Analyze a Wheelchair Frame?
              </h4>
              <p className="text-xs text-text-secondary leading-relaxed">
                A wheelchair frame is a critical structural assembly that must reliably support occupant weight (typically 100–150+ kg)
                during daily movement, curb impacts, and cyclic fatigue. Engineering analysis ensures safety factors are met without excessive weight,
                revealing stress concentration hot-spots at axle junctions, seat rails, and cross-braces before fabrication.
              </p>
            </div>

            <WheelchairAnalysis3D
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />
          </div>
        ) : (
        <div className="bg-surface rounded-2xl border border-border overflow-hidden">
          {/* Report header */}
          <div className="bg-surface-elevated px-6 py-4 border-b border-border flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="text-[10px] font-mono text-accent font-bold tracking-widest">ENGINEERING ANALYSIS REPORT</span>
              <h3 className="text-base font-bold text-text-primary mt-0.5">Wheelchair Frame — Structural Analysis</h3>
            </div>
            <div className="flex gap-3 text-[10px] font-mono">
              <span className="px-2.5 py-1 rounded bg-accent/10 border border-accent/30 text-accent font-bold">LOAD: 150 kg</span>
              <span className="px-2.5 py-1 rounded bg-surface border border-border text-text-secondary">CONCEPTUAL</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            {/* Left */}
            <div className="p-6 space-y-5 border-b lg:border-b-0 lg:border-r border-border">
              <div>
                <h4 className="text-sm font-bold text-text-primary mb-2">Why Analyze a Wheelchair Frame?</h4>
                <p className="text-xs text-text-secondary leading-relaxed">
                  A wheelchair frame is a critical structural component that must reliably support a user's weight during
                  daily activities, including traversal over uneven terrain and sudden impacts. Engineering analysis ensures
                  that the frame meets structural safety requirements without being unnecessarily heavy, and that the design
                  will achieve its intended service life under cyclic loading.
                </p>
              </div>

              <div className="flex items-center gap-3 bg-surface-elevated rounded-xl border border-red-500/30 p-4">
                <span className="text-3xl">⬇️</span>
                <div>
                  <span className="text-[10px] font-mono text-text-secondary">APPLIED LOAD</span>
                  <div className="text-2xl font-extrabold text-red-400 font-mono leading-tight">150 kg</div>
                  <span className="text-[10px] text-text-secondary font-mono">≈ 1471 N (gravitational force)</span>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-mono text-text-secondary font-bold mb-3 tracking-widest">ANALYSIS OUTPUTS</h4>
                <div className="grid grid-cols-2 gap-2">
                  {caseStudyTabs.map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key)}
                      className={`text-left p-3 rounded-xl border transition-all ${
                        activeTab === tab.key
                          ? 'border-accent bg-accent/10 text-accent'
                          : 'border-border bg-surface-elevated text-text-secondary hover:border-accent/40'
                      }`}
                    >
                      <span className="text-lg block mb-1">{tab.icon}</span>
                      <span className="text-[11px] font-bold leading-tight block">{tab.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right */}
            <div className="p-6 space-y-4">
              <div className="flex flex-wrap gap-2">
                {caseStudyTabs.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`text-[10px] font-mono font-bold px-3 py-1.5 rounded-lg border transition-all ${
                      activeTab === tab.key
                        ? 'bg-accent text-background border-accent'
                        : 'bg-surface-elevated border-border text-text-secondary hover:border-accent/40'
                    }`}
                  >
                    {tab.icon} {tab.label}
                  </button>
                ))}
              </div>

              <div className="bg-surface-elevated rounded-xl border border-border p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-text-secondary tracking-widest">
                    {activeTabData.label2}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 font-mono font-bold">
                    ILLUSTRATIVE
                  </span>
                </div>
                <div className="h-56 flex items-center justify-center">
                  <WheelchairFrameSVG />
                </div>
                {(activeTab === 'stress' || activeTab === 'deformation') && (
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-mono text-text-secondary">LOW</span>
                    <div className="flex-1 h-2 rounded-full bg-gradient-to-r from-blue-500 via-accent to-red-500 opacity-70" />
                    <span className="text-[9px] font-mono text-text-secondary">HIGH</span>
                  </div>
                )}
                <div className="pt-2 border-t border-border/40">
                  <p className="text-xs text-text-secondary leading-relaxed">{activeTabData.description}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        )}
      </div>

      {/* ── SECTION 5: BEST PRACTICES ─────────────────────────────────────────── */}
      <div
        ref={bestReveal.ref}
        className={`space-y-6 transition-all duration-700 delay-100 ${bestReveal.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      >
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-mono text-accent font-bold tracking-widest">SECTION 05</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        <div>
          <h2 className="text-xl font-bold text-text-primary mb-1">Industry Best Practices</h2>
          <p className="text-xs text-text-secondary">Standard practices followed by professional design engineers.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {bestPractices.map((bp) => (
            <div
              key={bp.num}
              className="bg-surface rounded-xl border border-border hover:border-accent/50 transition-all hover:shadow-md hover:shadow-accent/5 p-4 space-y-2 group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xl">{bp.icon}</span>
                <span className="text-[10px] font-mono text-accent/60 font-bold">{bp.num}</span>
              </div>
              <h4 className="text-xs font-bold text-text-primary group-hover:text-accent transition">{bp.title}</h4>
              <p className="text-[11px] text-text-secondary leading-relaxed">{bp.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── SECTION 6: CHECKLIST ─────────────────────────────────────────────── */}
      <div
        ref={checkReveal.ref}
        className={`space-y-6 transition-all duration-700 delay-100 ${checkReveal.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      >
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-mono text-accent font-bold tracking-widest">SECTION 06</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        <div className="bg-surface rounded-2xl border border-border overflow-hidden">
          <div className="bg-surface-elevated px-6 py-4 border-b border-border flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="text-[10px] font-mono text-accent font-bold tracking-widest">INTERACTIVE CHECKLIST</span>
              <h2 className="text-base font-bold text-text-primary mt-0.5">Design Engineer's Checklist Before Release</h2>
              <p className="text-[11px] text-text-secondary mt-0.5">
                Note: Checklist state is not saved permanently — it resets on page refresh.
              </p>
            </div>
            <button
              id="ea-reset-checklist"
              onClick={resetChecklist}
              className="text-[11px] font-mono font-bold px-4 py-2 rounded-lg border border-border bg-surface text-text-secondary hover:border-red-500/50 hover:text-red-400 transition-all"
            >
              ↺ RESET CHECKLIST
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Progress bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-text-secondary">Completion Progress</span>
                <span className={`font-bold ${progressPct === 100 ? 'text-green-400' : 'text-accent'}`}>
                  {completedCount}/{checklistItems.length} — {progressPct}%
                </span>
              </div>
              <div className="h-2.5 bg-surface-elevated rounded-full overflow-hidden border border-border">
                <div
                  className="h-full rounded-full transition-all duration-500 ease-out"
                  style={{
                    width: `${progressPct}%`,
                    background:
                      progressPct === 100
                        ? '#22c55e'
                        : 'linear-gradient(90deg, #16B8A6, #3B82F6)',
                  }}
                />
              </div>
            </div>

            {/* Completion message */}
            {showComplete && (
              <div className="flex items-center gap-3 bg-green-500/10 border border-green-500/30 rounded-xl p-4">
                <span className="text-2xl">🎉</span>
                <div>
                  <h4 className="text-sm font-bold text-green-400">All Items Completed!</h4>
                  <p className="text-xs text-text-secondary">Design is ready for release review. Proceed with final sign-off.</p>
                </div>
              </div>
            )}

            {/* Checklist items */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {checklistItems.map((item) => {
                const checked = checkedList[item.key];
                return (
                  <label
                    key={item.key}
                    htmlFor={`ea-check-${item.key}`}
                    className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all select-none ${
                      checked
                        ? 'bg-accent/10 border-accent/50 text-text-primary'
                        : 'bg-surface-elevated border-border hover:border-accent/30 text-text-secondary'
                    }`}
                  >
                    <input
                      id={`ea-check-${item.key}`}
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleCheck(item.key)}
                      className="sr-only"
                    />
                    <div
                      className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all ${
                        checked ? 'bg-accent border-accent' : 'bg-surface border-border'
                      }`}
                    >
                      {checked && (
                        <svg className="w-3 h-3 text-background" fill="none" viewBox="0 0 12 12" stroke="currentColor" strokeWidth={2.5}>
                          <path d="M2 6l3 3 5-5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>
                    <span className="text-lg shrink-0">{item.icon}</span>
                    <span className={`text-sm font-medium transition-all flex-1 ${checked ? 'line-through text-text-secondary' : ''}`}>
                      {item.label}
                    </span>
                    {checked && (
                      <span className="text-[10px] font-mono text-accent font-bold shrink-0">✓ DONE</span>
                    )}
                  </label>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ── BACK TO TOP BUTTON ────────────────────────────────────────────────── */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-50 w-10 h-10 rounded-full bg-accent text-background flex items-center justify-center shadow-lg hover:bg-accent-bright transition-all hover:scale-110 font-bold text-base"
          aria-label="Back to top"
        >
          ↑
        </button>
      )}

      <style>{`
        @keyframes ea-fadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
