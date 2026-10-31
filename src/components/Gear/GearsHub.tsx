import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

// ─── Types ─────────────────────────────────────────────────────────────────────
interface GearsHubProps {
  onBackToTopics?: () => void;
}

// ─── Scroll Reveal Hook ────────────────────────────────────────────────────────
function useScrollReveal(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

// ─── Sub-topic nav data ────────────────────────────────────────────────────────
const SUBTOPICS = [
  { label: 'TERMINOLOGY', path: '/topics/gears/terminology', icon: '📖', subtitle: 'Module, Pitch Diameter, Addendum, Dedendum, Pressure Angle.' },
  { label: 'TYPES', path: '/topics/gears/types', icon: '⚙️', subtitle: 'Explore 6 industrial gear geometry types.' },
  { label: 'GEAR SELECTION', path: '/topics/gears/selection', icon: '🎯', subtitle: 'Application-based gear selection and material considerations.' },
  { label: 'GEAR RATIO', path: '/topics/gears/ratio', icon: '🔢', subtitle: 'Speed reduction and torque multiplication formulas.' },
  { label: 'SPEED CALCULATION', path: '/topics/gears/speed-calculation', icon: '⚡', subtitle: 'RPM, gear speed relationships and transmission output.' },
  { label: 'MODULE', path: '/topics/gears/module', icon: '📐', subtitle: 'Module calculation, pitch diameter and metric gear sizing.' },
  { label: 'MANUAL CALCULATION', path: '/topics/gears/calculation', icon: '🧮', subtitle: 'Step-by-step spur gear design calculations.' },
  { label: 'HOW TO DRAW', path: '/topics/gears/how-to-draw', icon: '✏️', subtitle: '2D gear drawing and involute tooth profile construction.' },
  { label: 'REVERSE ENGINEERING', path: '/topics/gears/reverse-engineering', icon: '🔍', subtitle: 'Gear measurement, parameter identification and CAD replacement workflow.' },
];

// ─── Shared Components ─────────────────────────────────────────────────────────

function FormulaBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-surface-elevated border border-accent/30 rounded-xl px-5 py-4 font-mono text-sm text-accent my-3 overflow-x-auto">
      {children}
    </div>
  );
}

function SectionLabel({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <span className="text-[10px] font-mono text-accent font-bold tracking-widest">{text}</span>
      <div className="flex-1 h-px bg-border" />
    </div>
  );
}

function SourceBadge() {
  return <span className="inline-block text-[9px] font-mono px-1.5 py-0.5 rounded bg-accent/10 border border-accent/20 text-accent font-bold ml-1">SOURCE</span>;
}

function SupplBadge() {
  return <span className="inline-block text-[9px] font-mono px-1.5 py-0.5 rounded bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 font-bold ml-1">SUPPLEMENTARY</span>;
}

function CalcInput({ label, value, onChange, min, step }: { label: string; value: number; onChange: (v: number) => void; min?: number; step?: number }) {
  return (
    <div>
      <label className="block text-[11px] font-mono text-text-secondary mb-1">{label}</label>
      <input
        type="number"
        value={value}
        min={min ?? 1}
        step={step ?? 1}
        onChange={(e) => onChange(Math.max(min ?? 1, Number(e.target.value)))}
        className="w-full bg-background border border-border p-2 rounded-lg text-text-primary font-mono text-sm focus:outline-none focus:border-accent/60 transition"
      />
    </div>
  );
}

function ResultRow({ label, value, unit, highlight }: { label: string; value: string; unit: string; highlight?: boolean }) {
  return (
    <div className={`p-3 rounded-xl border ${highlight ? 'bg-accent/10 border-accent/50' : 'bg-surface-elevated border-border'}`}>
      <span className="block text-[10px] font-mono text-text-secondary">{label}</span>
      <strong className={`text-sm font-mono ${highlight ? 'text-accent' : 'text-text-primary'}`}>{value} <span className="text-xs text-text-secondary">{unit}</span></strong>
    </div>
  );
}

function NavRow({ prev, next, backPath, backLabel }: { prev?: { path: string; label: string }; next?: { path: string; label: string }; backPath: string; backLabel: string }) {
  return (
    <div className="flex items-center justify-between gap-3 pt-6 border-t border-border mt-8 text-xs font-mono flex-wrap">
      <Link to={backPath} className="text-accent hover:text-accent-bright transition font-bold">← {backLabel}</Link>
      <div className="flex gap-3">
        {prev && <Link to={prev.path} className="px-3 py-1.5 rounded-lg border border-border bg-surface-elevated text-text-secondary hover:border-accent/40 transition">← {prev.label}</Link>}
        {next && <Link to={next.path} className="px-3 py-1.5 rounded-lg border border-accent/40 bg-accent/10 text-accent hover:border-accent transition">{next.label} →</Link>}
      </div>
    </div>
  );
}

// ─── SVG Illustrations ─────────────────────────────────────────────────────────

function GearDiagramSVG({ showLabels = true }: { showLabels?: boolean }) {
  return (
    <svg viewBox="0 0 300 300" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="gearBody" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#20262E" />
          <stop offset="100%" stopColor="#161B22" />
        </radialGradient>
      </defs>
      {/* Root circle */}
      <circle cx="150" cy="150" r="75" fill="none" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="5 3" opacity="0.7" />
      {/* Pitch circle */}
      <circle cx="150" cy="150" r="90" fill="none" stroke="#16B8A6" strokeWidth="1.5" strokeDasharray="8 4" opacity="0.9" />
      {/* Outside circle */}
      <circle cx="150" cy="150" r="105" fill="none" stroke="#3B82F6" strokeWidth="1.5" opacity="0.8" />
      {/* Base circle */}
      <circle cx="150" cy="150" r="85" fill="none" stroke="#f59e0b" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
      {/* Gear body */}
      <circle cx="150" cy="150" r="74" fill="url(#gearBody)" />
      {/* 16 teeth */}
      {Array.from({ length: 16 }).map((_, i) => {
        const angle = (i / 16) * Math.PI * 2;
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        const tx = 150 + cos * 90;
        const ty = 150 + sin * 90;
        const cosP = Math.cos(angle + 0.1);
        const sinP = Math.sin(angle + 0.1);
        const cosN = Math.cos(angle - 0.1);
        const sinN = Math.sin(angle - 0.1);
        return (
          <polygon
            key={i}
            points={`${150 + cosN * 75},${150 + sinN * 75} ${150 + cosN * 105},${150 + sinN * 105} ${tx + cosP * 12},${ty + sinP * 12} ${150 + cosP * 75},${150 + sinP * 75}`}
            fill="#16B8A6"
            fillOpacity="0.25"
            stroke="#16B8A6"
            strokeWidth="0.8"
            strokeOpacity="0.6"
          />
        );
      })}
      {/* Centre bore */}
      <circle cx="150" cy="150" r="18" fill="#0D1117" stroke="#30363D" strokeWidth="1.5" />
      <circle cx="150" cy="150" r="3" fill="#16B8A6" />
      {/* Centre lines */}
      <line x1="150" y1="20" x2="150" y2="280" stroke="#30363D" strokeWidth="0.8" strokeDasharray="4 3" />
      <line x1="20" y1="150" x2="280" y2="150" stroke="#30363D" strokeWidth="0.8" strokeDasharray="4 3" />
      {/* Labels */}
      {showLabels && (
        <>
          {/* Outside diameter */}
          <line x1="150" y1="150" x2="255" y2="150" stroke="#3B82F6" strokeWidth="1" />
          <text x="258" y="150" fill="#3B82F6" fontSize="9" fontFamily="monospace" dominantBaseline="middle">da (Outside Ø)</text>
          {/* Pitch circle */}
          <line x1="150" y1="150" x2="150" y2="62" stroke="#16B8A6" strokeWidth="1" />
          <text x="152" y="56" fill="#16B8A6" fontSize="9" fontFamily="monospace">d (Pitch Ø)</text>
          {/* Root diameter */}
          <line x1="150" y1="150" x2="88" y2="210" stroke="#ef4444" strokeWidth="1" />
          <text x="20" y="218" fill="#ef4444" fontSize="9" fontFamily="monospace">df (Root Ø)</text>
          {/* Base circle */}
          <text x="155" y="70" fill="#f59e0b" fontSize="8" fontFamily="monospace">Base Circle</text>
          {/* Addendum arc */}
          <line x1="150" y1="62" x2="150" y2="47" stroke="#7D8790" strokeWidth="1" markerEnd="url(#arr)" />
          <text x="152" y="44" fill="#9DA7B0" fontSize="8" fontFamily="monospace">ha (Addendum)</text>
          {/* Dedendum arc */}
          <line x1="88" y1="155" x2="75" y2="155" stroke="#7D8790" strokeWidth="1" />
          <text x="10" y="152" fill="#9DA7B0" fontSize="8" fontFamily="monospace">hf (Ded.)</text>
        </>
      )}
    </svg>
  );
}

function SpurGearSVG() {
  return (
    <svg viewBox="0 0 160 120" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      {[0, 1].map((gi) => {
        const cx = gi === 0 ? 48 : 112;
        const dir = gi === 0 ? 1 : -1;
        return (
          <g key={gi}>
            <circle cx={cx} cy={60} r={28} fill="#161B22" stroke="#16B8A6" strokeWidth={1.2} />
            {Array.from({ length: 12 }).map((_, i) => {
              const angle = (i / 12) * Math.PI * 2 + (gi === 1 ? Math.PI / 12 : 0);
              const cosA = Math.cos(angle);
              const sinA = Math.sin(angle);
              return (
                <rect
                  key={i}
                  x={cx + cosA * 26 - 3}
                  y={60 + sinA * 26 - 3}
                  width={8}
                  height={6}
                  rx={1}
                  fill="#16B8A6"
                  fillOpacity={0.6}
                  stroke="#16B8A6"
                  strokeWidth={0.5}
                  transform={`rotate(${(angle * 180) / Math.PI} ${cx + cosA * 26} ${60 + sinA * 26})`}
                />
              );
            })}
            <circle cx={cx} cy={60} r={7} fill="#0D1117" stroke="#30363D" strokeWidth={1} />
            <circle cx={cx} cy={60} r={2} fill="#16B8A6" />
            {/* Rotation arrows */}
            <path d={gi === 0 ? `M${cx - 35} 40 A35 35 0 0 1 ${cx - 35} 80` : `M${cx + 35} 80 A35 35 0 0 1 ${cx + 35} 40`}
              fill="none" stroke="#f59e0b" strokeWidth={1.2} strokeDasharray="3 2" opacity={0.7} />
            <text x={cx} y={dir > 0 ? 106 : 106} textAnchor="middle" fill="#9DA7B0" fontSize={7} fontFamily="monospace">
              {gi === 0 ? 'DRIVER' : 'DRIVEN'}
            </text>
          </g>
        );
      })}
      <text x="80" y="15" textAnchor="middle" fill="#16B8A6" fontSize={8} fontFamily="monospace" fontWeight="bold">SPUR GEAR PAIR</text>
    </svg>
  );
}

function HelicalGearSVG() {
  return (
    <svg viewBox="0 0 160 120" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      {[0, 1].map((gi) => {
        const cx = gi === 0 ? 48 : 112;
        return (
          <g key={gi}>
            <ellipse cx={cx} cy={60} rx={28} ry={18} fill="#161B22" stroke="#16B8A6" strokeWidth={1.2} />
            <ellipse cx={cx} cy={48} rx={28} ry={18} fill="#161B22" stroke="#16B8A6" strokeWidth={1.2} strokeDasharray="3 2" opacity={0.5} />
            {/* Helix lines */}
            {Array.from({ length: 6 }).map((_, i) => {
              const x0 = cx - 24 + i * 10;
              return <line key={i} x1={x0} y1={52} x2={x0 + 6} y2={42} stroke="#16B8A6" strokeWidth={1} strokeOpacity={0.7} />;
            })}
            <circle cx={cx} cy={60} r={5} fill="#0D1117" stroke="#30363D" strokeWidth={1} />
            <text x={cx} y={88} textAnchor="middle" fill="#9DA7B0" fontSize={7} fontFamily="monospace">{gi === 0 ? 'DRIVER' : 'DRIVEN'}</text>
          </g>
        );
      })}
      <text x="80" y="12" textAnchor="middle" fill="#16B8A6" fontSize={8} fontFamily="monospace" fontWeight="bold">HELICAL GEAR</text>
      <text x="80" y="108" textAnchor="middle" fill="#f59e0b" fontSize={7} fontFamily="monospace">Helix angle α</text>
    </svg>
  );
}

function BevelGearSVG() {
  return (
    <svg viewBox="0 0 160 140" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      {/* Horizontal bevel gear */}
      <ellipse cx="80" cy="90" rx="50" ry="20" fill="#161B22" stroke="#16B8A6" strokeWidth={1.2} />
      <polygon points="30,90 55,55 105,55 130,90" fill="#20262E" stroke="#16B8A6" strokeWidth={1} />
      {/* Vertical bevel gear */}
      <ellipse cx="80" cy="55" rx="20" ry="35" fill="#161B22" stroke="#16B8A6" strokeWidth={1.2} />
      <line x1="80" y1="55" x2="80" y2="90" stroke="#16B8A6" strokeWidth={2} strokeDasharray="3 2" />
      {/* 90° angle indicator */}
      <rect x="76" y="84" width="8" height="8" fill="none" stroke="#f59e0b" strokeWidth={1} />
      <text x="92" y="76" fill="#f59e0b" fontSize={8} fontFamily="monospace">90°</text>
      <text x="80" y="128" textAnchor="middle" fill="#16B8A6" fontSize={8} fontFamily="monospace" fontWeight="bold">BEVEL GEAR PAIR</text>
      <text x="80" y="140" textAnchor="middle" fill="#9DA7B0" fontSize={7} fontFamily="monospace">Intersecting shafts</text>
    </svg>
  );
}

function WormGearSVG() {
  return (
    <svg viewBox="0 0 160 130" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      {/* Worm */}
      <rect x="8" y="55" width="80" height="22" rx="11" fill="#161B22" stroke="#16B8A6" strokeWidth={1.2} />
      {Array.from({ length: 6 }).map((_, i) => (
        <ellipse key={i} cx={20 + i * 13} cy={66} rx={4} ry={11} fill="none" stroke="#16B8A6" strokeWidth={1} strokeOpacity={0.5} />
      ))}
      <text x="48" y="95" textAnchor="middle" fill="#9DA7B0" fontSize={7} fontFamily="monospace">WORM</text>
      {/* Worm wheel */}
      <circle cx="120" cy="66" r="40" fill="none" stroke="#16B8A6" strokeWidth={1.5} />
      <circle cx="120" cy="66" r="32" fill="#161B22" stroke="#16B8A6" strokeWidth={1} strokeDasharray="3 2" />
      <circle cx="120" cy="66" r="8" fill="#0D1117" stroke="#30363D" />
      <circle cx="120" cy="66" r="2" fill="#16B8A6" />
      {/* Teeth on worm wheel */}
      {Array.from({ length: 16 }).map((_, i) => {
        const a = (i / 16) * Math.PI * 2;
        return <rect key={i} x={120 + Math.cos(a) * 30 - 2} y={66 + Math.sin(a) * 30 - 2} width={5} height={4} fill="#16B8A6" fillOpacity={0.4} rx={1} transform={`rotate(${(a * 180) / Math.PI} ${120 + Math.cos(a) * 30} ${66 + Math.sin(a) * 30})`} />;
      })}
      <text x="120" y="118" textAnchor="middle" fill="#9DA7B0" fontSize={7} fontFamily="monospace">WORM WHEEL</text>
      <text x="80" y="12" textAnchor="middle" fill="#16B8A6" fontSize={8} fontFamily="monospace" fontWeight="bold">WORM GEAR SET</text>
    </svg>
  );
}

function RackPinionSVG() {
  return (
    <svg viewBox="0 0 200 120" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      {/* Rack */}
      <rect x="10" y="75" width="180" height="22" rx="3" fill="#161B22" stroke="#16B8A6" strokeWidth={1.2} />
      {Array.from({ length: 12 }).map((_, i) => (
        <rect key={i} x={15 + i * 14} y={64} width={8} height={12} rx={1} fill="#16B8A6" fillOpacity={0.4} stroke="#16B8A6" strokeWidth={0.8} />
      ))}
      <text x="100" y="110" textAnchor="middle" fill="#9DA7B0" fontSize={7} fontFamily="monospace">RACK (Linear)</text>
      {/* Pinion */}
      <circle cx="55" cy="48" r="22" fill="#161B22" stroke="#16B8A6" strokeWidth={1.2} />
      {Array.from({ length: 12 }).map((_, i) => {
        const a = (i / 12) * Math.PI * 2;
        return <rect key={i} x={55 + Math.cos(a) * 20 - 2} y={48 + Math.sin(a) * 20 - 2} width={6} height={4} rx={1} fill="#16B8A6" fillOpacity={0.4} stroke="#16B8A6" strokeWidth={0.5} transform={`rotate(${(a * 180) / Math.PI} ${55 + Math.cos(a) * 20} ${48 + Math.sin(a) * 20})`} />;
      })}
      <circle cx="55" cy="48" r="6" fill="#0D1117" stroke="#30363D" />
      <circle cx="55" cy="48" r="2" fill="#16B8A6" />
      <text x="55" y="20" textAnchor="middle" fill="#9DA7B0" fontSize={7} fontFamily="monospace">PINION</text>
      {/* Arrows */}
      <path d="M80 66 L160 66" stroke="#f59e0b" strokeWidth={1.5} markerEnd="url(#arrYell)" strokeDasharray="4 2" />
      <defs><marker id="arrYell" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#f59e0b" /></marker></defs>
      <text x="120" y="62" fill="#f59e0b" fontSize={7} fontFamily="monospace">Linear motion</text>
      <text x="100" y="14" textAnchor="middle" fill="#16B8A6" fontSize={8} fontFamily="monospace" fontWeight="bold">RACK AND PINION</text>
    </svg>
  );
}

function InternalGearSVG() {
  return (
    <svg viewBox="0 0 160 160" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      {/* Ring gear */}
      <circle cx="80" cy="80" r="68" fill="none" stroke="#30363D" strokeWidth={12} />
      {Array.from({ length: 24 }).map((_, i) => {
        const a = (i / 24) * Math.PI * 2;
        return <rect key={i} x={80 + Math.cos(a) * 60 - 3} y={80 + Math.sin(a) * 60 - 3} width={8} height={6} rx={1} fill="#16B8A6" fillOpacity={0.5} stroke="#16B8A6" strokeWidth={0.5} transform={`rotate(${(a * 180) / Math.PI} ${80 + Math.cos(a) * 60} ${80 + Math.sin(a) * 60})`} />;
      })}
      <text x="80" y="148" textAnchor="middle" fill="#9DA7B0" fontSize={7} fontFamily="monospace">RING GEAR</text>
      {/* Planet gear */}
      <circle cx="80" cy="48" r="20" fill="#161B22" stroke="#16B8A6" strokeWidth={1.2} />
      {Array.from({ length: 10 }).map((_, i) => {
        const a = (i / 10) * Math.PI * 2;
        return <rect key={i} x={80 + Math.cos(a) * 18 - 2} y={48 + Math.sin(a) * 18 - 2} width={5} height={4} rx={1} fill="#16B8A6" fillOpacity={0.5} stroke="#16B8A6" strokeWidth={0.5} transform={`rotate(${(a * 180) / Math.PI} ${80 + Math.cos(a) * 18} ${48 + Math.sin(a) * 18})`} />;
      })}
      <circle cx="80" cy="48" r="5" fill="#0D1117" stroke="#30363D" />
      <text x="80" y="32" textAnchor="middle" fill="#9DA7B0" fontSize={7} fontFamily="monospace">PLANET GEAR</text>
      <text x="80" y="14" textAnchor="middle" fill="#16B8A6" fontSize={8} fontFamily="monospace" fontWeight="bold">INTERNAL GEAR</text>
    </svg>
  );
}

function GearRatioAnimSVG({ ratio }: { ratio: number }) {
  const [tick, setTick] = useState(0);
  const rafRef = useRef<number>(0);
  useEffect(() => {
    let last = 0;
    function loop(ts: number) {
      if (ts - last > 30) { setTick((t) => t + 1); last = ts; }
      rafRef.current = requestAnimationFrame(loop);
    }
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);
  const angle1 = (tick * 3) % 360;
  const angle2 = (tick * 3 / ratio) % 360;
  return (
    <svg viewBox="0 0 300 160" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      {/* Driver (small) */}
      <g transform={`rotate(${angle1} 70 80)`}>
        <circle cx="70" cy="80" r="30" fill="#161B22" stroke="#16B8A6" strokeWidth={1.5} />
        {Array.from({ length: 12 }).map((_, i) => {
          const a = (i / 12) * Math.PI * 2;
          return <rect key={i} x={70 + Math.cos(a) * 28 - 2.5} y={80 + Math.sin(a) * 28 - 2.5} width={6} height={5} rx={1} fill="#16B8A6" fillOpacity={0.6} stroke="#16B8A6" strokeWidth={0.7} transform={`rotate(${(a * 180) / Math.PI} ${70 + Math.cos(a) * 28} ${80 + Math.sin(a) * 28})`} />;
        })}
        <circle cx="70" cy="80" r="6" fill="#0D1117" stroke="#30363D" />
        <line x1="70" y1="80" x2="70" y2="52" stroke="#f59e0b" strokeWidth={1.5} />
      </g>
      {/* Driven (large) */}
      <g transform={`rotate(${-angle2} 210 80)`}>
        <circle cx="210" cy="80" r="60" fill="#161B22" stroke="#16B8A6" strokeWidth={1.5} />
        {Array.from({ length: 24 }).map((_, i) => {
          const a = (i / 24) * Math.PI * 2;
          return <rect key={i} x={210 + Math.cos(a) * 58 - 2.5} y={80 + Math.sin(a) * 58 - 2.5} width={7} height={5} rx={1} fill="#16B8A6" fillOpacity={0.6} stroke="#16B8A6" strokeWidth={0.7} transform={`rotate(${(a * 180) / Math.PI} ${210 + Math.cos(a) * 58} ${80 + Math.sin(a) * 58})`} />;
        })}
        <circle cx="210" cy="80" r="12" fill="#0D1117" stroke="#30363D" />
        <circle cx="210" cy="80" r="3" fill="#16B8A6" />
        <line x1="210" y1="80" x2="210" y2="22" stroke="#f59e0b" strokeWidth={1.5} />
      </g>
      <text x="70" y="125" textAnchor="middle" fill="#16B8A6" fontSize={8} fontFamily="monospace">DRIVER (Z₁)</text>
      <text x="210" y="152" textAnchor="middle" fill="#16B8A6" fontSize={8} fontFamily="monospace">DRIVEN (Z₂)</text>
      <text x="150" y="145" textAnchor="middle" fill="#f59e0b" fontSize={7} fontFamily="monospace">Ratio = {ratio.toFixed(2)}:1</text>
    </svg>
  );
}

function GearDrawingSVG({ teeth = 20, pitchR = 40, outsideR = 44, rootR = 35, step = 10 }: { teeth?: number; pitchR?: number; outsideR?: number; rootR?: number; step?: number }) {
  const scale = 110 / outsideR;
  const cx = 150, cy = 150;
  const pr = pitchR * scale;
  const or = outsideR * scale;
  const rr = rootR * scale;
  const br = pr * Math.cos((20 * Math.PI) / 180);
  const angStep = (2 * Math.PI) / teeth;
  return (
    <svg viewBox="0 0 300 300" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      {/* Construction circles */}
      {step >= 2 && <circle cx={cx} cy={cy} r={br} fill="none" stroke="#f59e0b" strokeWidth={0.8} strokeDasharray="3 2" opacity={0.5} />}
      {step >= 2 && <circle cx={cx} cy={cy} r={rr} fill="none" stroke="#ef4444" strokeWidth={1} strokeDasharray="4 3" opacity={0.7} />}
      {step >= 2 && <circle cx={cx} cy={cy} r={pr} fill="none" stroke="#16B8A6" strokeWidth={1} strokeDasharray="6 3" opacity={0.7} />}
      {step >= 2 && <circle cx={cx} cy={cy} r={or} fill="none" stroke="#3B82F6" strokeWidth={1} opacity={0.8} />}
      {/* Radial construction lines */}
      {step >= 4 && Array.from({ length: teeth }).map((_, i) => {
        const a = i * angStep;
        return <line key={i} x1={cx} y1={cy} x2={cx + Math.cos(a) * or} y2={cy + Math.sin(a) * or} stroke="#30363D" strokeWidth={0.5} strokeDasharray="3 3" />;
      })}
      {/* Teeth */}
      {step >= 5 && Array.from({ length: teeth }).map((_, i) => {
        const a = i * angStep;
        const cosA = Math.cos(a);
        const sinA = Math.sin(a);
        const w = angStep * 0.4;
        const cosL = Math.cos(a - w / 2);
        const sinL = Math.sin(a - w / 2);
        const cosR = Math.cos(a + w / 2);
        const sinR = Math.sin(a + w / 2);
        return (
          <polygon
            key={i}
            points={`
              ${cx + cosL * rr},${cy + sinL * rr}
              ${cx + cosL * or},${cy + sinL * or}
              ${cx + cosA * or},${cy + cosA > -sinA ? cy + sinA * or : cy + sinA * or}
              ${cx + cosR * or},${cy + sinR * or}
              ${cx + cosR * rr},${cy + sinR * rr}
            `}
            fill="#16B8A6"
            fillOpacity={0.2}
            stroke="#16B8A6"
            strokeWidth={0.8}
          />
        );
      })}
      {/* Root circle fill */}
      {step >= 5 && <circle cx={cx} cy={cy} r={rr} fill="#161B22" />}
      {/* Centre point */}
      {step >= 1 && <circle cx={cx} cy={cy} r={3} fill="#16B8A6" />}
      {/* Centre hole */}
      {step >= 9 && <circle cx={cx} cy={cy} r={18 * scale} fill="#0D1117" stroke="#30363D" strokeWidth={1.5} />}
      {/* Centre lines */}
      <line x1={cx - or - 10} y1={cy} x2={cx + or + 10} y2={cy} stroke="#30363D" strokeWidth={0.5} strokeDasharray="4 3" />
      <line x1={cx} y1={cy - or - 10} x2={cx} y2={cy + or + 10} stroke="#30363D" strokeWidth={0.5} strokeDasharray="4 3" />
      {/* Labels */}
      {step >= 10 && (
        <>
          <text x={cx + or + 4} y={cy} fill="#3B82F6" fontSize={7} fontFamily="monospace" dominantBaseline="middle">Ø{(outsideR * 2).toFixed(0)}</text>
          <text x={cx + 3} y={cy - pr - 3} fill="#16B8A6" fontSize={7} fontFamily="monospace">Ø{(pitchR * 2).toFixed(0)} PCD</text>
        </>
      )}
    </svg>
  );
}

// ─── TOPIC VIEWS ───────────────────────────────────────────────────────────────

// T1 — TERMINOLOGY
function TopicTerminology() {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<number | null>(null);
  const r1 = useScrollReveal();
  const _r2 = useScrollReveal();
  const terms = [
    { id: 1, term: 'Gear', symbol: '', def: 'A mechanical machine element with teeth arranged around a circular body, used to transmit rotational motion and torque between shafts.', sig: 'Foundation of mechanical power transmission.' },
    { id: 2, term: 'Gear Teeth', symbol: 'Z', def: 'Projections around the gear circumference that engage with another gear to transmit motion.', sig: 'Tooth count (Z) directly determines gear ratio.' },
    { id: 3, term: 'Pitch Circle', symbol: '', def: 'An imaginary circle representing the effective rolling diameter of a gear — the circle at which two meshing gears are considered to roll without slipping.', sig: 'All fundamental gear parameters are referenced to the pitch circle.' },
    { id: 4, term: 'Pitch Diameter', symbol: 'd', def: 'Diameter of the pitch circle.  d = m × Z', sig: 'Primary sizing parameter in metric gear design.' },
    { id: 5, term: 'Outside Diameter', symbol: 'da', def: 'Maximum diameter of the gear, measured at the tips of the teeth.  da = d + 2m', sig: 'Defines the envelope and mounting clearance of the gear.' },
    { id: 6, term: 'Root Diameter', symbol: 'df', def: 'Diameter measured at the bottom of the gear teeth.  df = d − 2hf', sig: 'Critical for stress analysis at the tooth root.' },
    { id: 7, term: 'Base Circle', symbol: 'db', def: 'The circle from which the involute tooth profile is generated.  db = d × cos(α)', sig: 'Defines the true involute geometry of the tooth flanks.' },
    { id: 8, term: 'Addendum', symbol: 'ha', def: 'Distance from the pitch circle to the tip (outside diameter) of the tooth.  ha = m (for standard gears)', sig: 'Determines the engagement depth of the tooth above the pitch line.' },
    { id: 9, term: 'Dedendum', symbol: 'hf', def: 'Distance from the pitch circle to the root of the tooth.  hf ≈ 1.25m (standard full-depth)', sig: 'Provides clearance to prevent tip-to-root interference.' },
    { id: 10, term: 'Tooth Thickness', symbol: 't', def: 'Thickness of a single tooth measured along the pitch circle.  t = πm / 2 (theoretical)', sig: 'Affects strength; reduced in practice to provide backlash.' },
    { id: 11, term: 'Circular Pitch', symbol: 'p', def: 'Distance between corresponding points on adjacent teeth, measured along the pitch circle arc.  p = πm', sig: 'Determines tooth spacing; must match for mating gears.' },
    { id: 12, term: 'Pressure Angle', symbol: 'α', def: 'Angle between the line of action and the tangent to the pitch circle. 20° is the widely used standard pressure angle for basic industrial gear design.', sig: 'Affects load distribution, tooth strength and radial separating force.' },
  ];
  const filtered = terms.filter(t => t.term.toLowerCase().includes(search.toLowerCase()) || t.def.toLowerCase().includes(search.toLowerCase()));
  return (
    <div className="space-y-8">
      <div className="bg-surface rounded-2xl border border-border overflow-hidden">
        <div className="bg-surface-elevated px-6 py-4 border-b border-border">
          <span className="text-[10px] font-mono text-accent font-bold">CHAPTER 1 & 3 • SOURCE CONTENT</span>
          <h2 className="text-xl font-bold text-text-primary mt-0.5">Gear Terminology</h2>
          <p className="text-xs text-text-secondary mt-1">Fundamental definitions and symbols used in gear engineering.</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
          <div className="p-6 border-b lg:border-b-0 lg:border-r border-border flex items-center justify-center bg-surface-elevated/30">
            <div className="w-full max-w-xs h-64"><GearDiagramSVG /></div>
          </div>
          <div className="p-6 space-y-3">
            <h3 className="text-sm font-bold text-text-primary">Gear Anatomy — Key Circles</h3>
            {[
              { color: '#3B82F6', label: 'Outside Circle (da)', desc: 'Tip diameter — maximum gear extent' },
              { color: '#16B8A6', label: 'Pitch Circle (d)', desc: 'Reference circle for all calculations' },
              { color: '#f59e0b', label: 'Base Circle (db)', desc: 'Origin of involute tooth profile' },
              { color: '#ef4444', label: 'Root Circle (df)', desc: 'Bottom of tooth space' },
            ].map(c => (
              <div key={c.label} className="flex items-start gap-3">
                <div className="w-3 h-3 rounded-full shrink-0 mt-0.5" style={{ backgroundColor: c.color }} />
                <div>
                  <span className="text-xs font-bold text-text-primary">{c.label}</span>
                  <span className="text-xs text-text-secondary ml-2">{c.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Search + Term Cards */}
      <div ref={r1.ref} className={`space-y-4 transition-all duration-700 ${r1.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <SectionLabel text="TERMINOLOGY REFERENCE" />
        <input
          type="text"
          placeholder="Search terms…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full bg-surface-elevated border border-border rounded-xl px-4 py-2 text-sm text-text-primary placeholder-text-secondary/50 focus:outline-none focus:border-accent/60 transition font-mono"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.map(t => (
            <button
              key={t.id}
              onClick={() => setSelected(selected === t.id ? null : t.id)}
              className={`text-left p-4 rounded-xl border transition-all space-y-1.5 ${selected === t.id ? 'border-accent/60 bg-accent/10' : 'border-border bg-surface hover:border-accent/30'}`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-text-primary">{t.term}</span>
                {t.symbol && <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-accent/10 border border-accent/20 text-accent font-bold">{t.symbol}</span>}
              </div>
              <p className="text-[11px] text-text-secondary leading-relaxed">{t.def}</p>
              {selected === t.id && (
                <div className="pt-2 border-t border-border/50">
                  <span className="text-[10px] font-mono text-accent font-bold">SIGNIFICANCE: </span>
                  <span className="text-[11px] text-text-secondary">{t.sig}</span>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      <NavRow backPath="/topics/gears" backLabel="GEARS HUB" next={{ path: '/topics/gears/types', label: 'TYPES' }} />
    </div>
  );
}

// T2 — TYPES
function TopicTypes() {
  const [expanded, setExpanded] = useState<number | null>(null);
  const r1 = useScrollReveal();
  const gearTypes = [
    {
      id: 1, icon: <SpurGearSVG />, name: 'Spur Gear', badge: 'PARALLEL SHAFT',
      principle: 'Straight teeth are cut parallel to the gear axis, transmitting motion between parallel shafts.',
      apps: 'Simple gearboxes, machine tools, conveyors, speed reducers.',
      advantages: ['Simple design and easy manufacturing', 'Low cost and high efficiency', 'Well-established standardization'],
      limitations: ['Produces more noise at high speed', 'Sudden tooth engagement causes impact loading'],
    },
    {
      id: 2, icon: <HelicalGearSVG />, name: 'Helical Gear', badge: 'PARALLEL / CROSSED SHAFT',
      principle: 'Teeth are inclined at a helix angle to the gear axis, allowing gradual engagement.',
      apps: 'Automotive transmissions, industrial gearboxes, heavy machinery.',
      advantages: ['Smooth and quiet operation', 'Lower noise than spur', 'Higher load capacity'],
      limitations: ['Generates axial thrust loads requiring thrust bearings', 'More complex and costly to manufacture'],
    },
    {
      id: 3, icon: <BevelGearSVG />, name: 'Bevel Gear', badge: '90° INTERSECTING SHAFTS',
      principle: 'Conical teeth transmit motion between shafts whose axes intersect, typically at 90°.',
      apps: 'Differential systems, right-angle drives, machine tools, hand drills.',
      advantages: ['Compact right-angle drive', 'Available in straight, spiral and hypoid variants'],
      limitations: ['More complex to manufacture', 'Requires precise mounting alignment'],
    },
    {
      id: 4, icon: <WormGearSVG />, name: 'Worm Gear', badge: 'NON-INTERSECTING SHAFTS',
      principle: 'A worm (screw-like element) meshes with a worm wheel to achieve high speed reduction in a compact arrangement.',
      apps: 'Lifting mechanisms, hoists, conveyor systems, rotary tables.',
      advantages: ['Very high speed reduction in a single stage', 'Compact and self-locking capability', 'Smooth and quiet operation'],
      limitations: ['Lower efficiency than other gear types', 'High heat generation at high speeds'],
    },
    {
      id: 5, icon: <RackPinionSVG />, name: 'Rack and Pinion', badge: 'ROTARY TO LINEAR',
      principle: 'A circular pinion meshes with a flat rack, converting rotary motion into linear motion and vice versa.',
      apps: 'Steering systems, linear actuators, CNC machines, automation equipment.',
      advantages: ['Direct conversion between rotary and linear motion', 'Simple and robust design'],
      limitations: ['Rack length limits travel distance', 'Backlash can affect positioning precision'],
    },
    {
      id: 6, icon: <InternalGearSVG />, name: 'Internal Gear', badge: 'PLANETARY / COMPACT',
      principle: 'Teeth are cut on the inside of a ring gear, allowing the mating gear to rotate in the same direction.',
      apps: 'Planetary gearboxes, automatic transmissions, speed-reduction systems.',
      advantages: ['Compact arrangement', 'Coaxial input and output', 'High load sharing in planetary systems'],
      limitations: ['More complex to manufacture than external gears', 'Limited to specific configurations'],
    },
  ];
  return (
    <div className="space-y-8">
      <div className="bg-surface rounded-2xl border border-border p-6">
        <span className="text-[10px] font-mono text-accent font-bold">CHAPTER 4 • SOURCE CONTENT</span>
        <h2 className="text-xl font-bold text-text-primary mt-0.5">6 Industrial Gear Types</h2>
        <p className="text-xs text-text-secondary mt-1">Each gear type has distinct geometry, working principles and industrial applications. Click <em>Learn More</em> to expand.</p>
      </div>
      <div ref={r1.ref} className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 transition-all duration-700 ${r1.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        {gearTypes.map(gt => (
          <div key={gt.id} className={`bg-surface rounded-2xl border overflow-hidden transition-all ${expanded === gt.id ? 'border-accent/60 shadow-lg shadow-accent/10' : 'border-border hover:border-accent/30'}`}>
            <div className="h-36 bg-surface-elevated border-b border-border/40 flex items-center justify-center p-3">
              {gt.icon}
            </div>
            <div className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-text-primary">{gt.name}</h3>
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-accent/10 border border-accent/20 text-accent">{gt.badge}</span>
              </div>
              <p className="text-[11px] text-text-secondary leading-relaxed">{gt.principle}</p>
              {expanded === gt.id && (
                <div className="pt-2 border-t border-border/40 space-y-2">
                  <div><span className="text-[10px] font-mono text-accent font-bold">APPLICATIONS: </span><span className="text-[11px] text-text-secondary">{gt.apps}</span></div>
                  <div>
                    <span className="text-[10px] font-mono text-green-400 font-bold">ADVANTAGES:</span>
                    <ul className="mt-1 space-y-0.5">{gt.advantages.map(a => <li key={a} className="text-[11px] text-text-secondary flex gap-1.5"><span className="text-green-400">+</span>{a}</li>)}</ul>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-red-400 font-bold">LIMITATIONS:</span>
                    <ul className="mt-1 space-y-0.5">{gt.limitations.map(l => <li key={l} className="text-[11px] text-text-secondary flex gap-1.5"><span className="text-red-400">−</span>{l}</li>)}</ul>
                  </div>
                </div>
              )}
              <button onClick={() => setExpanded(expanded === gt.id ? null : gt.id)} className="text-[11px] font-mono font-bold text-accent hover:text-accent-bright transition">
                {expanded === gt.id ? '▲ SHOW LESS' : '▼ LEARN MORE'}
              </button>
            </div>
          </div>
        ))}
      </div>
      <NavRow backPath="/topics/gears" backLabel="GEARS HUB" prev={{ path: '/topics/gears/terminology', label: 'TERMINOLOGY' }} next={{ path: '/topics/gears/selection', label: 'SELECTION' }} />
    </div>
  );
}

// T3 — SELECTION
function TopicSelection() {
  const r1 = useScrollReveal();
  const factors = [
    { num: '01', icon: '⚡', label: 'Input Speed', desc: 'RPM at the driving shaft — determines gear type and lubrication needs.' },
    { num: '02', icon: '🎯', label: 'Output Speed', desc: 'Required RPM at the driven shaft — defines the gear ratio needed.' },
    { num: '03', icon: '🔩', label: 'Input Torque', desc: 'Torque delivered by the motor or prime mover.' },
    { num: '04', icon: '💪', label: 'Output Torque', desc: 'Required torque at the output shaft for the application.' },
    { num: '05', icon: '⚙️', label: 'Power', desc: 'Total power to be transmitted (kW or HP).' },
    { num: '06', icon: '🔢', label: 'Gear Ratio', desc: 'Ratio of output speed to input speed — determines tooth count relationship.' },
    { num: '07', icon: '📏', label: 'Shaft Arrangement', desc: 'Parallel, perpendicular (90°) or non-intersecting — determines gear type family.' },
    { num: '08', icon: '📦', label: 'Available Space', desc: 'Envelope constraints on diameter, length and centre distance.' },
    { num: '09', icon: '🔬', label: 'Material', desc: 'Steel, cast iron, plastics — selected based on strength, wear and environmental requirements.' },
    { num: '10', icon: '📅', label: 'Required Service Life', desc: 'Hours of operation, duty cycle and overhaul intervals.' },
  ];
  const groups = [
    { title: 'Operating Requirements', items: [1, 2, 3, 4, 5, 6] },
    { title: 'Mechanical Arrangement', items: [7, 8] },
    { title: 'Material & Service', items: [9, 10] },
  ];
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const toggle = (k: string) => setChecked(p => ({ ...p, [k]: !p[k] }));
  return (
    <div className="space-y-8">
      <div className="bg-surface rounded-2xl border border-border p-6">
        <span className="text-[10px] font-mono text-accent font-bold">CHAPTER 5 • SOURCE CONTENT</span>
        <h2 className="text-xl font-bold text-text-primary mt-0.5">Gear Selection — Basic Industrial Concepts</h2>
        <p className="text-xs text-text-secondary mt-1">Gear selection starts by identifying the operating requirements of the application. All ten factors listed below should be evaluated before specifying a gear type.</p>
      </div>
      <div ref={r1.ref} className={`space-y-6 transition-all duration-700 ${r1.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        {groups.map(g => (
          <div key={g.title}>
            <SectionLabel text={g.title.toUpperCase()} />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {factors.filter(f => g.items.includes(Number(f.num))).map(f => (
                <div key={f.num} className="bg-surface rounded-xl border border-border p-4 space-y-2 hover:border-accent/30 transition">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{f.icon}</span>
                      <span className="text-xs font-bold text-text-primary">{f.label}</span>
                    </div>
                    <span className="text-[10px] font-mono text-accent/60">{f.num}</span>
                  </div>
                  <p className="text-[11px] text-text-secondary leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
        {/* Selection checklist */}
        <div>
          <SectionLabel text="SELECTION CHECKLIST" />
          <div className="bg-surface rounded-2xl border border-border p-6 space-y-3">
            <h3 className="text-sm font-bold text-text-primary mb-3">Application Requirement Checklist <SourceBadge /></h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {factors.map(f => {
                const c = !!checked[f.num];
                return (
                  <label key={f.num} htmlFor={`sel-${f.num}`} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all select-none ${c ? 'border-accent/50 bg-accent/10' : 'border-border bg-surface-elevated hover:border-accent/30'}`}>
                    <input id={`sel-${f.num}`} type="checkbox" checked={c} onChange={() => toggle(f.num)} className="sr-only" />
                    <div className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 ${c ? 'bg-accent border-accent' : 'bg-surface border-border'}`}>
                      {c && <svg className="w-2.5 h-2.5 text-background" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth={2.5}><path d="M1.5 5l2.5 2.5 4.5-4" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                    </div>
                    <span className="text-xs">{f.num}. {f.label}</span>
                    {c && <span className="ml-auto text-[10px] font-mono text-accent">✓</span>}
                  </label>
                );
              })}
            </div>
            <p className="text-[11px] text-text-secondary pt-2">{Object.values(checked).filter(Boolean).length}/10 factors evaluated. Material choice should always consider actual operating conditions and engineering requirements.</p>
          </div>
        </div>
      </div>
      <NavRow backPath="/topics/gears" backLabel="GEARS HUB" prev={{ path: '/topics/gears/types', label: 'TYPES' }} next={{ path: '/topics/gears/ratio', label: 'GEAR RATIO' }} />
    </div>
  );
}

// T4 — GEAR RATIO
function TopicRatio() {
  const [z1, setZ1] = useState(20);
  const [z2, setZ2] = useState(60);
  const ratio = z2 / z1;
  const r1 = useScrollReveal();
  return (
    <div className="space-y-8">
      <div className="bg-surface rounded-2xl border border-border p-6">
        <span className="text-[10px] font-mono text-accent font-bold">CHAPTER 6 • SOURCE CONTENT</span>
        <h2 className="text-xl font-bold text-text-primary mt-0.5">Gear Ratio — Speed Reduction and Torque Relationship</h2>
        <p className="text-xs text-text-secondary mt-1">Gear ratio describes the relationship between the number of teeth on the driven gear and the driver gear.</p>
      </div>

      {/* Formula */}
      <div>
        <SectionLabel text="FORMULA" />
        <FormulaBox>
          <div className="space-y-1">
            <div>Gear Ratio = Z₂ / Z₁</div>
            <div className="text-text-secondary text-xs mt-2">Where: Z₁ = driver gear teeth &nbsp;|&nbsp; Z₂ = driven gear teeth</div>
          </div>
        </FormulaBox>
      </div>

      {/* Worked Example */}
      <div ref={r1.ref} className={`space-y-4 transition-all duration-700 ${r1.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <SectionLabel text="WORKED EXAMPLE — SOURCE BOOK" />
        <div className="bg-surface rounded-2xl border border-border p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="text-sm font-bold text-text-primary">Given <SourceBadge /></h4>
              <div className="space-y-1 text-xs font-mono">
                <div className="flex justify-between p-2 bg-surface-elevated rounded-lg border border-border"><span className="text-text-secondary">Driver gear teeth (Z₁)</span><span className="text-accent font-bold">20</span></div>
                <div className="flex justify-between p-2 bg-surface-elevated rounded-lg border border-border"><span className="text-text-secondary">Driven gear teeth (Z₂)</span><span className="text-accent font-bold">60</span></div>
              </div>
              <div className="bg-surface-elevated rounded-xl border border-border p-4">
                <span className="text-[10px] font-mono text-text-secondary">CALCULATION</span>
                <div className="font-mono text-sm text-text-primary mt-1">Gear Ratio = 60 / 20</div>
                <div className="font-mono text-xl font-bold text-accent mt-1">= 3:1</div>
              </div>
              <p className="text-xs text-text-secondary leading-relaxed">The driven gear rotates at approximately one-third of the driver's speed in this arrangement. Torque increases ideally in proportion to the ratio, but actual torque depends on efficiency and operating conditions.</p>
            </div>
            <div className="h-48 bg-surface-elevated rounded-xl border border-border flex items-center justify-center p-2">
              <GearRatioAnimSVG ratio={3} />
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Calculator */}
      <div>
        <SectionLabel text="INTERACTIVE CALCULATOR" />
        <div className="bg-surface rounded-2xl border border-border p-6 space-y-4">
          <h3 className="text-sm font-bold text-text-primary">Gear Ratio Calculator <span className="text-[10px] font-mono text-text-secondary ml-1">— basic gear pair relationship</span></h3>
          <div className="grid grid-cols-2 gap-4">
            <CalcInput label="Driver Teeth (Z₁)" value={z1} onChange={setZ1} min={4} />
            <CalcInput label="Driven Teeth (Z₂)" value={z2} onChange={setZ2} min={4} />
          </div>
          <div className="bg-surface-elevated rounded-xl border border-accent/30 p-4 font-mono text-sm space-y-2">
            <div className="text-text-secondary text-xs">Substitution:</div>
            <div className="text-text-primary">Gear Ratio = {z2} / {z1}</div>
            <div className="text-accent text-xl font-bold">= {ratio.toFixed(3)} : 1</div>
            <div className="text-text-secondary text-xs pt-1">Driven speed = Input speed ÷ {ratio.toFixed(3)}</div>
          </div>
          <div className="h-44"><GearRatioAnimSVG ratio={ratio} /></div>
        </div>
      </div>
      <NavRow backPath="/topics/gears" backLabel="GEARS HUB" prev={{ path: '/topics/gears/selection', label: 'SELECTION' }} next={{ path: '/topics/gears/speed-calculation', label: 'SPEED CALC' }} />
    </div>
  );
}

// T5 — SPEED CALCULATION
function TopicSpeed() {
  const [n1, setN1] = useState(1500);
  const [z1, setZ1] = useState(20);
  const [z2, setZ2] = useState(60);
  const n2 = (n1 * z1) / z2;
  const r1 = useScrollReveal();
  return (
    <div className="space-y-8">
      <div className="bg-surface rounded-2xl border border-border p-6">
        <span className="text-[10px] font-mono text-accent font-bold">CHAPTER 7 • SOURCE CONTENT</span>
        <h2 className="text-xl font-bold text-text-primary mt-0.5">Gear Speed Calculation</h2>
        <p className="text-xs text-text-secondary mt-1">Relationship between driver and driven gear speeds using the fundamental speed equation.</p>
      </div>

      <div>
        <SectionLabel text="FUNDAMENTAL FORMULA" />
        <FormulaBox>
          <div className="space-y-1">
            <div>N₁ × Z₁ = N₂ × Z₂</div>
            <div className="text-text-secondary text-xs mt-2">
              N₁ = driver speed (RPM) &nbsp;|&nbsp; Z₁ = driver teeth
              <br />N₂ = driven speed (RPM) &nbsp;|&nbsp; Z₂ = driven teeth
            </div>
          </div>
        </FormulaBox>
        <FormulaBox>
          <div>N₂ = (N₁ × Z₁) / Z₂</div>
        </FormulaBox>
      </div>

      <div ref={r1.ref} className={`space-y-4 transition-all duration-700 ${r1.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <SectionLabel text="WORKED EXAMPLE — SOURCE BOOK" />
        <div className="bg-surface rounded-2xl border border-border p-6 space-y-4">
          <h4 className="text-sm font-bold text-text-primary">Given <SourceBadge /></h4>
          <div className="grid grid-cols-3 gap-3 text-xs font-mono">
            <ResultRow label="Driver Speed (N₁)" value="1500" unit="RPM" />
            <ResultRow label="Driver Teeth (Z₁)" value="20" unit="teeth" />
            <ResultRow label="Driven Teeth (Z₂)" value="60" unit="teeth" />
          </div>
          <div className="bg-surface-elevated rounded-xl border border-border p-4 font-mono text-sm space-y-1">
            <div className="text-text-secondary text-xs">Step-by-step:</div>
            <div className="text-text-primary">1500 × 20 = N₂ × 60</div>
            <div className="text-text-primary">30,000 = N₂ × 60</div>
            <div className="text-text-primary">N₂ = 30,000 / 60</div>
            <div className="text-accent text-xl font-bold">N₂ = 500 RPM</div>
          </div>
        </div>
      </div>

      <div>
        <SectionLabel text="INTERACTIVE CALCULATOR" />
        <div className="bg-surface rounded-2xl border border-border p-6 space-y-4">
          <h3 className="text-sm font-bold text-text-primary">Speed Calculator</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <CalcInput label="Driver Speed N₁ (RPM)" value={n1} onChange={setN1} min={1} />
            <CalcInput label="Driver Teeth Z₁" value={z1} onChange={setZ1} min={4} />
            <CalcInput label="Driven Teeth Z₂" value={z2} onChange={setZ2} min={4} />
          </div>
          <div className="bg-surface-elevated rounded-xl border border-accent/30 p-4 font-mono text-sm space-y-1">
            <div className="text-text-secondary text-xs">Formula substitution:</div>
            <div className="text-text-primary">N₂ = ({n1} × {z1}) / {z2}</div>
            <div className="text-text-primary">N₂ = {n1 * z1} / {z2}</div>
            <div className="text-accent text-xl font-bold">N₂ = {n2.toFixed(1)} RPM</div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <ResultRow label="Gear Ratio" value={(z2 / z1).toFixed(3)} unit=":1" highlight />
            <ResultRow label="Driven Speed" value={n2.toFixed(1)} unit="RPM" highlight />
            <ResultRow label="Speed Reduction" value={`${(100 - (n2 / n1) * 100).toFixed(1)}%`} unit="" />
          </div>
        </div>
      </div>

      <div className="bg-surface-elevated rounded-xl border border-yellow-500/20 p-4 space-y-2">
        <div className="flex items-center gap-2"><span>ℹ️</span><span className="text-xs font-mono font-bold text-yellow-400">SUPPLEMENTARY NOTE <SupplBadge /></span></div>
        <p className="text-xs text-text-secondary leading-relaxed">Pitch line velocity (v = π × d × N / 60,000 m/s) and transmission output power are important supplementary design parameters. These are standard engineering formulas and not extracted from the source book. Always verify applicable standards for your specific application.</p>
      </div>
      <NavRow backPath="/topics/gears" backLabel="GEARS HUB" prev={{ path: '/topics/gears/ratio', label: 'GEAR RATIO' }} next={{ path: '/topics/gears/module', label: 'MODULE' }} />
    </div>
  );
}

// T6 — MODULE
function TopicModule() {
  const [z, setZ] = useState(30);
  const [m, setM] = useState(2);
  const d = m * z;
  const r1 = useScrollReveal();
  return (
    <div className="space-y-8">
      <div className="bg-surface rounded-2xl border border-border p-6">
        <span className="text-[10px] font-mono text-accent font-bold">CHAPTER 8 • SOURCE CONTENT</span>
        <h2 className="text-xl font-bold text-text-primary mt-0.5">Gear Module and Metric Gear Sizing</h2>
        <p className="text-xs text-text-secondary mt-1">Module is the key parameter in metric gear design. It defines tooth size and is used to calculate pitch diameter.</p>
      </div>

      <div>
        <SectionLabel text="FORMULAS" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormulaBox><div>m = d / Z</div><div className="text-text-secondary text-xs mt-1">Module from pitch diameter and tooth count</div></FormulaBox>
          <FormulaBox><div>d = m × Z</div><div className="text-text-secondary text-xs mt-1">Pitch diameter from module and tooth count</div></FormulaBox>
        </div>
        <div className="bg-surface rounded-xl border border-border p-4 text-xs text-text-secondary mt-2">
          <strong className="text-text-primary">Where:</strong> m = module (mm) &nbsp;|&nbsp; d = pitch diameter (mm) &nbsp;|&nbsp; Z = number of teeth
        </div>
      </div>

      <div ref={r1.ref} className={`space-y-4 transition-all duration-700 ${r1.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <SectionLabel text="WORKED EXAMPLE — SOURCE BOOK" />
        <div className="bg-surface rounded-2xl border border-border p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4 text-xs font-mono">
            <ResultRow label="Number of Teeth (Z)" value="30" unit="teeth" />
            <ResultRow label="Module (m)" value="2" unit="mm" />
          </div>
          <div className="bg-surface-elevated rounded-xl border border-border p-4 font-mono text-sm space-y-1">
            <div className="text-text-secondary text-xs">Calculation:</div>
            <div className="text-text-primary">d = m × Z = 2 × 30</div>
            <div className="text-accent text-xl font-bold">Pitch Diameter = 60 mm</div>
          </div>
        </div>
      </div>

      <div>
        <SectionLabel text="INTERACTIVE MODULE CALCULATOR" />
        <div className="bg-surface rounded-2xl border border-border p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <CalcInput label="Module (m) mm" value={m} onChange={setM} min={0.5} step={0.5} />
            <CalcInput label="Number of Teeth (Z)" value={z} onChange={setZ} min={6} />
          </div>
          <div className="bg-surface-elevated rounded-xl border border-accent/30 p-4 font-mono text-sm space-y-1">
            <div className="text-text-secondary text-xs">Formula substitution:</div>
            <div className="text-text-primary">d = {m} × {z}</div>
            <div className="text-accent text-xl font-bold">d = {d.toFixed(1)} mm</div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <ResultRow label="Pitch Diameter" value={d.toFixed(1)} unit="mm" highlight />
            <ResultRow label="Outside Diameter" value={(d + 2 * m).toFixed(1)} unit="mm" />
            <ResultRow label="Root Diameter" value={(d - 2.5 * m).toFixed(1)} unit="mm" />
            <ResultRow label="Circular Pitch" value={(Math.PI * m).toFixed(3)} unit="mm" />
          </div>
        </div>
      </div>

      <div className="bg-surface-elevated rounded-xl border border-yellow-500/20 p-4">
        <div className="flex items-center gap-2 mb-2"><span>📌</span><span className="text-xs font-mono font-bold text-yellow-400">SUPPLEMENTARY <SupplBadge /></span></div>
        <p className="text-xs text-text-secondary leading-relaxed">The source book explains the metric module concept. ISO preferred module values (e.g. 1, 1.25, 1.5, 2, 2.5, 3, 4, 5…) are standardised in ISO 54 / ISO 1340. Always consult the applicable standard for your design. Do not assume a non-standard module value will be interchangeable with a standard one.</p>
      </div>
      <NavRow backPath="/topics/gears" backLabel="GEARS HUB" prev={{ path: '/topics/gears/speed-calculation', label: 'SPEED CALC' }} next={{ path: '/topics/gears/calculation', label: 'MANUAL CALC' }} />
    </div>
  );
}

// T7 — MANUAL CALCULATION
function TopicManualCalc() {
  const [z, setZ] = useState(30);
  const [m, setM] = useState(2);
  const [showReset, setShowReset] = useState(false);
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const d = m * z;
  const ha = m;
  const da = d + 2 * m;
  const hf = 1.25 * m;
  const df = d - 2 * hf;
  const p = Math.PI * m;
  const t = p / 2;
  useEffect(() => { setShowReset(z !== 30 || m !== 2); }, [z, m]);
  const reset = () => { setZ(30); setM(2); };
  const steps = [
    { num: 1, title: 'Pitch Diameter', formula: 'd = m × Z', calc: `d = ${m} × ${z}`, result: `${d.toFixed(1)} mm`, note: 'Primary gear size parameter.' },
    { num: 2, title: 'Addendum', formula: 'ha = m', calc: `ha = ${m}`, result: `${ha.toFixed(1)} mm`, note: 'Standard full-depth assumption: addendum equals one module.' },
    { num: 3, title: 'Outside Diameter', formula: 'da = d + 2m', calc: `da = ${d.toFixed(1)} + 2(${m})`, result: `${da.toFixed(1)} mm`, note: 'Maximum gear envelope diameter.' },
    { num: 4, title: 'Dedendum', formula: 'hf ≈ 1.25m', calc: `hf = 1.25 × ${m}`, result: `${hf.toFixed(3)} mm`, note: 'Standard full-depth involute system. Provides bottom clearance.' },
    { num: 5, title: 'Root Diameter', formula: 'df = d − 2hf', calc: `df = ${d.toFixed(1)} − 2(${hf.toFixed(3)})`, result: `${df.toFixed(1)} mm`, note: 'Diameter at tooth root. Critical for stress analysis.' },
    { num: 6, title: 'Circular Pitch', formula: 'p = πm', calc: `p = π × ${m}`, result: `${p.toFixed(3)} mm`, note: 'Arc length between same point on adjacent teeth.' },
    { num: 7, title: 'Tooth Thickness', formula: 't = p / 2', calc: `t = ${p.toFixed(3)} / 2`, result: `${t.toFixed(3)} mm`, note: 'Theoretical value; actual thickness is reduced for backlash.' },
  ];
  const r1 = useScrollReveal();
  return (
    <div className="space-y-8">
      <div className="bg-surface rounded-2xl border border-border p-6">
        <span className="text-[10px] font-mono text-accent font-bold">CHAPTERS 9 & 10 • SOURCE CONTENT</span>
        <h2 className="text-xl font-bold text-text-primary mt-0.5">Manual Spur Gear Design Calculation</h2>
        <p className="text-xs text-text-secondary mt-1">Seven-step guided calculation. Click any step to expand its explanation.</p>
      </div>

      {/* Inputs */}
      <div className="bg-surface rounded-2xl border border-border p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-text-primary">Input Parameters</h3>
          {showReset && <button onClick={reset} className="text-[11px] font-mono text-red-400 hover:text-red-300 transition border border-red-400/30 rounded px-2 py-1">↺ RESET</button>}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <CalcInput label="Number of Teeth (Z)" value={z} onChange={setZ} min={6} />
          <CalcInput label="Module (m) mm" value={m} onChange={setM} min={0.5} step={0.5} />
        </div>
      </div>

      {/* Steps */}
      <div ref={r1.ref} className={`space-y-3 transition-all duration-700 ${r1.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <SectionLabel text="7-STEP CALCULATION" />
        {steps.map(s => (
          <div
            key={s.num}
            className={`rounded-xl border overflow-hidden transition-all ${activeStep === s.num ? 'border-accent/60' : 'border-border hover:border-accent/30'}`}
          >
            <button
              className="w-full flex items-center gap-4 p-4 text-left"
              onClick={() => setActiveStep(activeStep === s.num ? null : s.num)}
            >
              <div className="w-8 h-8 rounded-full bg-accent/10 border border-accent/30 flex items-center justify-center text-xs font-mono font-bold text-accent shrink-0">{s.num}</div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-bold text-text-primary">{s.title}</div>
                <div className="text-xs font-mono text-text-secondary">{s.formula}</div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-base font-bold text-accent font-mono">{s.result}</div>
              </div>
            </button>
            {activeStep === s.num && (
              <div className="px-4 pb-4 bg-surface-elevated/50 border-t border-border/40 space-y-2">
                <div className="font-mono text-sm text-text-primary pt-2">{s.calc} = <strong className="text-accent">{s.result}</strong></div>
                <p className="text-xs text-text-secondary">{s.note}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Results Summary */}
      <div>
        <SectionLabel text="RESULTS SUMMARY" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {steps.map(s => <ResultRow key={s.num} label={s.title} value={s.result.split(' ')[0]} unit={s.result.split(' ')[1] || ''} highlight={s.num === 1} />)}
        </div>
      </div>

      {/* Second example */}
      <div>
        <SectionLabel text="DRAWING EXAMPLE — SOURCE BOOK" />
        <div className="bg-surface rounded-2xl border border-border p-6 space-y-4">
          <h4 className="text-sm font-bold text-text-primary">Example Parameters <SourceBadge /></h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              ['Teeth (Z)', '20'], ['Module (m)', '2 mm'], ['Pressure Angle', '20°'],
              ['Pitch Diameter', '40 mm'], ['Outside Diameter', '44 mm'], ['Root Diameter', '35 mm'],
            ].map(([l, v]) => <ResultRow key={l} label={l} value={v} unit="" />)}
          </div>
        </div>
      </div>
      <NavRow backPath="/topics/gears" backLabel="GEARS HUB" prev={{ path: '/topics/gears/module', label: 'MODULE' }} next={{ path: '/topics/gears/how-to-draw', label: 'HOW TO DRAW' }} />
    </div>
  );
}

// T8 — HOW TO DRAW
function TopicHowToDraw() {
  const [drawStep, setDrawStep] = useState(1);
  const TOTAL_STEPS = 10;
  const teeth = 20, _m = 2, _alpha = 20, pitchR = 20, outsideR = 22, rootR = 17.5;
  const angSpacing = 360 / teeth;
  const r1 = useScrollReveal();
  const stepDescs = [
    { title: 'Mark Centre Point', desc: 'Mark and identify the centre point of the gear. This is the origin for all circle radii.' },
    { title: 'Draw Concentric Circles', desc: 'Draw three primary circles from the centre: Outside circle (da = 44 mm), Pitch circle (d = 40 mm), Root circle (df = 35 mm). Optionally add the base circle (db = d × cos 20° ≈ 37.6 mm).' },
    { title: 'Calculate Angular Spacing', desc: `Angular tooth spacing = 360° / Z = 360° / ${teeth} = ${angSpacing}°` },
    { title: 'Draw Radial Construction Lines', desc: `Draw ${teeth} equally spaced radial lines at ${angSpacing}° intervals from the centre.` },
    { title: 'Construct First Tooth', desc: 'Using the angular spacing, construct one tooth profile symmetrically about one radial line.' },
    { title: 'Create Tooth Profile', desc: 'The tooth flanks should use an involute profile. For detailed design, the involute is generated from the base circle.' },
    { title: 'Repeat Tooth Around Gear', desc: `Copy the tooth geometry to all ${teeth} positions around the gear circumference.` },
    { title: 'Remove Construction Geometry', desc: 'Delete or convert to dashed lines all radial construction lines that are inside the tooth spaces.' },
    { title: 'Add Centre Hole and Keyway', desc: 'Add the bore hole and any keyway if required for the application.' },
    { title: 'Add Dimensions and Technical Information', desc: 'Dimension the drawing: outside diameter, pitch diameter, root diameter, bore, face width, module, tooth count, pressure angle and surface finish.' },
  ];
  return (
    <div className="space-y-8">
      <div className="bg-surface rounded-2xl border border-border p-6">
        <span className="text-[10px] font-mono text-accent font-bold">CHAPTERS 10 & 11 • SOURCE CONTENT</span>
        <h2 className="text-xl font-bold text-text-primary mt-0.5">How to Draw a Gear — 2D Drafting & Involute Tooth Profile</h2>
        <p className="text-xs text-text-secondary mt-1">Step-by-step drawing procedure using the book's worked example (Z=20, m=2, α=20°).</p>
      </div>

      {/* Drawing parameters */}
      <div>
        <SectionLabel text="EXAMPLE PARAMETERS — SOURCE BOOK" />
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[['Teeth (Z)', '20'], ['Module (m)', '2 mm'], ['Pressure Angle (α)', '20°'], ['Pitch Diameter (d)', '40 mm'], ['Outside Diameter (da)', '44 mm'], ['Root Diameter (df)', '35 mm']].map(([l, v]) => (
            <ResultRow key={l} label={l} value={v} unit="" />
          ))}
        </div>
        <div className="mt-3 bg-surface rounded-xl border border-border p-3">
          <span className="text-[10px] font-mono text-accent">Angular Tooth Spacing</span>
          <div className="font-mono text-sm mt-1 text-text-primary">360° / {teeth} = <strong className="text-accent">{angSpacing}°</strong> per tooth</div>
        </div>
      </div>

      {/* Step-by-step drawing */}
      <div ref={r1.ref} className={`transition-all duration-700 ${r1.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <SectionLabel text="DRAWING PROCEDURE — STEP BY STEP" />
        <div className="bg-surface rounded-2xl border border-border overflow-hidden">
          {/* Step controls */}
          <div className="bg-surface-elevated px-4 py-3 border-b border-border flex items-center justify-between gap-3 flex-wrap">
            <span className="text-xs font-mono text-text-secondary">STEP {drawStep} OF {TOTAL_STEPS}: <span className="text-text-primary font-bold">{stepDescs[drawStep - 1].title}</span></span>
            <div className="flex gap-2">
              <button disabled={drawStep <= 1} onClick={() => setDrawStep(s => s - 1)} className="px-3 py-1 text-xs font-mono rounded border border-border disabled:opacity-30 hover:border-accent/40 transition">← PREV</button>
              <button disabled={drawStep >= TOTAL_STEPS} onClick={() => setDrawStep(s => s + 1)} className="px-3 py-1 text-xs font-mono rounded border border-accent/40 text-accent hover:border-accent disabled:opacity-30 transition">NEXT →</button>
            </div>
          </div>
          {/* Progress bar */}
          <div className="h-1 bg-surface-elevated"><div className="h-full bg-accent transition-all duration-300" style={{ width: `${(drawStep / TOTAL_STEPS) * 100}%` }} /></div>
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="flex items-center justify-center p-6 border-b lg:border-b-0 lg:border-r border-border bg-surface-elevated/30">
              <div className="w-full max-w-[260px] h-[260px]">
                <GearDrawingSVG teeth={teeth} pitchR={pitchR} outsideR={outsideR} rootR={rootR} step={drawStep} />
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-accent/10 border border-accent/30 flex items-center justify-center text-sm font-mono font-bold text-accent shrink-0">{drawStep}</div>
                <h3 className="text-sm font-bold text-text-primary">{stepDescs[drawStep - 1].title}</h3>
              </div>
              <p className="text-xs text-text-secondary leading-relaxed">{stepDescs[drawStep - 1].desc}</p>
              {/* Step dots */}
              <div className="flex gap-1.5 flex-wrap">
                {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
                  <button key={i} onClick={() => setDrawStep(i + 1)} className={`w-2.5 h-2.5 rounded-full transition ${i + 1 === drawStep ? 'bg-accent' : i + 1 < drawStep ? 'bg-accent/40' : 'bg-border'}`} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Involute Profile Section */}
      <div>
        <SectionLabel text="INVOLUTE TOOTH PROFILE — CONCEPTS" />
        <div className="bg-surface rounded-2xl border border-border p-6 space-y-4">
          <p className="text-xs text-text-secondary leading-relaxed">
            <strong className="text-text-primary">Important:</strong> The source book states that a professional standard gear should use an <strong className="text-accent">involute tooth profile</strong> rather than simple rectangular teeth. Rectangular teeth are not a valid final manufacturing profile.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { label: 'Base Circle', desc: 'The involute curve is generated from this circle. db = d × cos(α)' },
              { label: 'Pitch Circle', desc: 'Reference circle where mating gears effectively roll together.' },
              { label: 'Addendum Circle', desc: 'Outside diameter — tip of teeth.' },
              { label: 'Root Circle', desc: 'Bottom of tooth space — dedendum measured from pitch circle.' },
              { label: 'Pressure Angle (α)', desc: '20° standard — angle between line of action and pitch circle tangent.' },
              { label: 'Involute Generation', desc: 'Curve traced by a point on a string unwinding from the base circle.' },
            ].map(c => (
              <div key={c.label} className="bg-surface-elevated rounded-xl border border-border p-3 space-y-1">
                <span className="text-xs font-bold text-accent">{c.label}</span>
                <p className="text-[11px] text-text-secondary">{c.desc}</p>
              </div>
            ))}
          </div>
          <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-xl p-3">
            <p className="text-xs text-text-secondary"><span className="text-yellow-400 font-mono font-bold">SUPPLEMENTARY <SupplBadge />:</span> A complete mathematical derivation of the involute curve requires differential geometry. The source book does not provide this derivation. For precise tooth profile generation, refer to ISO 1328 and AGMA 2001 or use dedicated gear design software.</p>
          </div>
        </div>
      </div>
      <NavRow backPath="/topics/gears" backLabel="GEARS HUB" prev={{ path: '/topics/gears/calculation', label: 'MANUAL CALC' }} next={{ path: '/topics/gears/reverse-engineering', label: 'REVERSE ENG.' }} />
    </div>
  );
}

// T9 — REVERSE ENGINEERING
function TopicReverseEng() {
  const [beforeChecked, setBeforeChecked] = useState<Record<string, boolean>>({});
  const [afterChecked, setAfterChecked] = useState<Record<string, boolean>>({});
  const [expanded, setExpanded] = useState<string | null>('inspection');
  const r1 = useScrollReveal();
  const r2 = useScrollReveal();

  const toggleBefore = (k: string) => setBeforeChecked(p => ({ ...p, [k]: !p[k] }));
  const toggleAfter = (k: string) => setAfterChecked(p => ({ ...p, [k]: !p[k] }));

  const workflow = [
    { id: '01', icon: '🔭', title: 'Physical Gear', desc: 'Obtain the physical gear sample to be reverse engineered.' },
    { id: '02', icon: '🔍', title: 'Visual Inspection', desc: 'Record gear type, tooth count, bore type, keyway, thickness, helix angle, damage, wear, surface condition and manufacturing marks.' },
    { id: '03', icon: '📏', title: 'Measurement', desc: 'Use Vernier calipers, micrometers, CMM or optical measurement systems.' },
    { id: '04', icon: '🔢', title: 'Tooth Counting', desc: 'Count and record the total number of teeth accurately.' },
    { id: '05', icon: '🧮', title: 'Dimension Calculation', desc: 'Calculate module from measured outside diameter: m = da / (Z + 2).' },
    { id: '06', icon: '⚙️', title: 'Gear Parameter ID', desc: 'Identify pitch diameter, root diameter, pressure angle and other parameters.' },
    { id: '07', icon: '🖥️', title: 'CAD Modeling', desc: 'Create a 3D parametric gear model using the identified parameters.' },
    { id: '08', icon: '📐', title: 'Drawing Creation', desc: 'Generate 2D manufacturing drawing with all required specifications.' },
    { id: '09', icon: '✅', title: 'Validation', desc: 'Verify the model and drawing against the physical gear measurements.' },
    { id: '10', icon: '🏭', title: 'Manufacturing', desc: 'Manufacture the replacement gear to the drawing specification.' },
    { id: '11', icon: '🎯', title: 'Final Production', desc: 'Install, validate function and document the complete replacement.' },
  ];

  const beforeItems = [
    { k: 'type', label: 'Gear type identified' },
    { k: 'teeth', label: 'Number of teeth counted' },
    { k: 'module', label: 'Module determined' },
    { k: 'pa', label: 'Pressure angle identified' },
    { k: 'od', label: 'Outside diameter measured' },
    { k: 'bore', label: 'Bore measured' },
    { k: 'fw', label: 'Face width measured' },
    { k: 'kw', label: 'Keyway checked' },
    { k: 'mat', label: 'Material identified' },
  ];

  const afterItems = [
    { k: 'dims', label: 'Dimensions verified' },
    { k: 'tooth', label: 'Tooth data verified' },
    { k: 'tol', label: 'Tolerances added' },
    { k: 'mat2', label: 'Material specified' },
    { k: 'ht', label: 'Heat treatment specified where required' },
    { k: 'sf', label: 'Surface finish specified where required' },
    { k: 'rev', label: 'Revision updated' },
    { k: 'rev2', label: 'Drawing reviewed' },
  ];

  const beforePct = Math.round((Object.values(beforeChecked).filter(Boolean).length / beforeItems.length) * 100);
  const afterPct = Math.round((Object.values(afterChecked).filter(Boolean).length / afterItems.length) * 100);

  const mistakes = [
    'Incorrect tooth count', 'Wrong module', 'Incorrect pressure angle', 'Incorrect bore size',
    'Ignoring backlash', 'Incorrect tooth profile', 'Overlooking material and heat treatment', 'Manufacturing without proper drawing specifications',
  ];

  const faq = [
    { id: 'inspection', title: 'Inspection Requirements', content: 'Check outside diameter, bore diameter, face width, keyway, tooth thickness, and runout. Use CMM or gear measuring machines for critical dimensions. Inspect profile, lead and tooth-contact characteristics. Verify material, heat treatment, surface treatment, hardness and surface finish. Ensure drawing carries number, revision, general tolerances and datum references.' },
    { id: 'deliverables', title: 'Final Deliverables', content: '3D CAD model, 2D manufacturing drawing, gear parameters table, material specification, inspection report, and BOM if the gear belongs to an assembly.' },
    { id: 'mistakes', title: 'Common Design Mistakes', content: mistakes.map((m, i) => `${i + 1}. ${m}`).join('\n') },
  ];

  return (
    <div className="space-y-8">
      <div className="bg-surface rounded-2xl border border-border p-6">
        <span className="text-[10px] font-mono text-accent font-bold">CHAPTER 12 • SOURCE CONTENT</span>
        <h2 className="text-xl font-bold text-text-primary mt-0.5">Industrial Gear Reverse Engineering</h2>
        <p className="text-xs text-text-secondary mt-1">Reconstruct a gear from physical measurements and develop a manufacturing-ready CAD model.</p>
      </div>

      {/* Workflow Timeline */}
      <div>
        <SectionLabel text="11-STAGE WORKFLOW" />
        {/* Desktop */}
        <div className="hidden lg:flex items-start gap-0 overflow-x-auto pb-4 min-w-[900px]">
          {workflow.map((s, i) => (
            <div key={s.id} className="flex-1 flex flex-col items-center group relative px-1">
              {i < workflow.length - 1 && <div className="absolute top-5 left-1/2 w-full h-0.5 bg-gradient-to-r from-accent/40 to-accent/10 z-0" />}
              <div className="relative z-10 w-10 h-10 rounded-full bg-surface-elevated border-2 border-accent/30 group-hover:border-accent flex items-center justify-center text-base mb-2 transition group-hover:scale-110 duration-200">
                {s.icon}
              </div>
              <span className="text-[9px] font-mono text-accent font-bold">{s.id}</span>
              <h4 className="text-[10px] font-bold text-text-primary text-center mt-0.5 px-1">{s.title}</h4>
              <p className="text-[9px] text-text-secondary text-center leading-tight px-1 mt-0.5">{s.desc}</p>
            </div>
          ))}
        </div>
        {/* Mobile */}
        <div className="lg:hidden space-y-0">
          {workflow.map((s, i) => (
            <div key={s.id} className="flex gap-3 group">
              <div className="flex flex-col items-center">
                <div className="w-9 h-9 rounded-full bg-surface-elevated border-2 border-accent/30 flex items-center justify-center text-sm shrink-0">{s.icon}</div>
                {i < workflow.length - 1 && <div className="w-0.5 flex-1 bg-gradient-to-b from-accent/30 to-accent/10 my-1 min-h-[24px]" />}
              </div>
              <div className="pb-4">
                <span className="text-[9px] font-mono text-accent font-bold">STAGE {s.id}</span>
                <h4 className="text-xs font-bold text-text-primary">{s.title}</h4>
                <p className="text-[11px] text-text-secondary leading-relaxed mt-0.5">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Key Calculations */}
      <div ref={r1.ref} className={`space-y-4 transition-all duration-700 ${r1.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <SectionLabel text="KEY CALCULATIONS — SOURCE BOOK" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-surface rounded-2xl border border-border p-5 space-y-3">
            <h4 className="text-sm font-bold text-text-primary">Step 4 — Estimate Module <SourceBadge /></h4>
            <FormulaBox><div>m = da / (Z + 2)</div></FormulaBox>
            <div className="text-xs text-text-secondary space-y-1">
              <div>Given: Z = 24 teeth, da = 52 mm</div>
              <div className="font-mono">m = 52 / (24 + 2) = 52 / 26</div>
              <div className="font-mono text-accent font-bold text-base">m = 2 mm</div>
            </div>
          </div>
          <div className="bg-surface rounded-2xl border border-border p-5 space-y-3">
            <h4 className="text-sm font-bold text-text-primary">Steps 5 & 6 — Pitch & Root Diameter <SourceBadge /></h4>
            <FormulaBox><div>d = mZ = 2 × 24 = <strong>48 mm</strong></div></FormulaBox>
            <div className="text-xs text-text-secondary">
              <div>hf = 1.25m = 1.25 × 2 = 2.5 mm</div>
              <div className="font-mono">df = d − 2hf = 48 − 5</div>
              <div className="font-mono text-accent font-bold text-base">df = 43 mm</div>
            </div>
          </div>
        </div>
        <div className="bg-surface rounded-2xl border border-border p-5">
          <h4 className="text-sm font-bold text-text-primary mb-3">Step 7 & 8 — Bore, Keyway, Face Width <SourceBadge /></h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[['Bore', 'Ø20 mm'], ['Keyway', '6 × 3 mm'], ['Face Width', '20 mm'], ['Module', '2 mm']].map(([l, v]) => <ResultRow key={l} label={l} value={v} unit="" />)}
          </div>
          <p className="text-xs text-text-secondary mt-3">Face width affects load capacity, assembly fit, shaft positioning and manufacturing cost.</p>
        </div>
      </div>

      {/* Material */}
      <div className="bg-surface rounded-2xl border border-border p-5 space-y-2">
        <h4 className="text-sm font-bold text-text-primary">Step 9 — Material Identification <SourceBadge /></h4>
        <p className="text-xs text-text-secondary">The source book lists possible gear materials: <strong className="text-text-primary">EN8, EN19, case-hardened steels, stainless steels, cast iron</strong> and engineering plastics. Identification methods include existing documentation, material markings, hardness testing and PMI/material testing. <strong className="text-red-400">Do not assume material solely from appearance.</strong></p>
      </div>

      {/* CAD Parameters */}
      <div className="bg-surface rounded-2xl border border-border p-5 space-y-3">
        <h4 className="text-sm font-bold text-text-primary">Step 10 — CAD Model Parameters <SourceBadge /></h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[['Teeth', '24'], ['Module', '2 mm'], ['Pitch Diameter', '48 mm'], ['Outside Diameter', '52 mm'], ['Root Diameter', '~43 mm'], ['Bore', '20 mm'], ['Face Width', '20 mm']].map(([l, v]) => <ResultRow key={l} label={l} value={v} unit="" />)}
        </div>
      </div>

      {/* Expandable sections */}
      <div ref={r2.ref} className={`space-y-3 transition-all duration-700 ${r2.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <SectionLabel text="SUPPLEMENTARY REFERENCE" />
        {faq.map(f => (
          <div key={f.id} className={`rounded-xl border overflow-hidden transition ${expanded === f.id ? 'border-accent/50' : 'border-border'}`}>
            <button className="w-full flex items-center justify-between px-4 py-3 text-left" onClick={() => setExpanded(expanded === f.id ? null : f.id)}>
              <span className="text-sm font-bold text-text-primary">{f.title}</span>
              <span className="text-accent text-sm">{expanded === f.id ? '▲' : '▼'}</span>
            </button>
            {expanded === f.id && (
              <div className="px-4 pb-4 border-t border-border/40 bg-surface-elevated/30">
                {f.id === 'mistakes' ? (
                  <ul className="pt-3 space-y-1">
                    {mistakes.map((m, i) => <li key={m} className="text-xs text-text-secondary flex gap-2"><span className="text-red-400 font-mono">{i + 1}.</span>{m}</li>)}
                  </ul>
                ) : (
                  <p className="text-xs text-text-secondary leading-relaxed pt-3">{f.content}</p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Dual Checklists */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Before modeling */}
        <div className="bg-surface rounded-2xl border border-border p-5 space-y-3">
          <h4 className="text-sm font-bold text-text-primary">Before Modeling Checklist</h4>
          <div className="h-1.5 bg-surface-elevated rounded-full overflow-hidden"><div className="h-full bg-accent transition-all duration-500" style={{ width: `${beforePct}%` }} /></div>
          <span className="text-[10px] font-mono text-text-secondary">{beforePct}% complete</span>
          <div className="space-y-2">
            {beforeItems.map(item => {
              const c = !!beforeChecked[item.k];
              return (
                <label key={item.k} htmlFor={`bm-${item.k}`} className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition-all ${c ? 'border-accent/40 bg-accent/10' : 'border-border hover:border-accent/20'}`}>
                  <input id={`bm-${item.k}`} type="checkbox" checked={c} onChange={() => toggleBefore(item.k)} className="sr-only" />
                  <div className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 ${c ? 'bg-accent border-accent' : 'bg-surface border-border'}`}>
                    {c && <svg className="w-2.5 h-2.5 text-background" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth={2.5}><path d="M1.5 5l2.5 2.5 4.5-4" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                  </div>
                  <span className={`text-xs ${c ? 'line-through text-text-secondary' : 'text-text-primary'}`}>{item.label}</span>
                </label>
              );
            })}
          </div>
        </div>
        {/* Before drawing release */}
        <div className="bg-surface rounded-2xl border border-border p-5 space-y-3">
          <h4 className="text-sm font-bold text-text-primary">Before Drawing Release Checklist</h4>
          <div className="h-1.5 bg-surface-elevated rounded-full overflow-hidden"><div className="h-full bg-accent transition-all duration-500" style={{ width: `${afterPct}%` }} /></div>
          <span className="text-[10px] font-mono text-text-secondary">{afterPct}% complete</span>
          <div className="space-y-2">
            {afterItems.map(item => {
              const c = !!afterChecked[item.k];
              return (
                <label key={item.k} htmlFor={`dr-${item.k}`} className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition-all ${c ? 'border-accent/40 bg-accent/10' : 'border-border hover:border-accent/20'}`}>
                  <input id={`dr-${item.k}`} type="checkbox" checked={c} onChange={() => toggleAfter(item.k)} className="sr-only" />
                  <div className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 ${c ? 'bg-accent border-accent' : 'bg-surface border-border'}`}>
                    {c && <svg className="w-2.5 h-2.5 text-background" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth={2.5}><path d="M1.5 5l2.5 2.5 4.5-4" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                  </div>
                  <span className={`text-xs ${c ? 'line-through text-text-secondary' : 'text-text-primary'}`}>{item.label}</span>
                </label>
              );
            })}
          </div>
        </div>
      </div>
      <NavRow backPath="/topics/gears" backLabel="GEARS HUB" prev={{ path: '/topics/gears/how-to-draw', label: 'HOW TO DRAW' }} />
    </div>
  );
}

// ─── GEARS LANDING PAGE ────────────────────────────────────────────────────────

function GearsLanding({ onBackToTopics }: { onBackToTopics?: () => void }) {
  const navigate = useNavigate();
  const r1 = useScrollReveal();
  return (
    <div className="space-y-6">
      <div className="bg-surface p-6 sm:p-8 rounded-2xl border border-border space-y-6">
        <div className="border-b border-border/50 pb-4 flex flex-wrap items-start justify-between gap-3">
          <div>
            <span className="text-xs font-mono text-accent font-bold">GEAR CONCEPTS BOOK • 9 TOPICS</span>
            <h2 className="text-3xl font-extrabold text-text-primary mt-1">GEARS HUB</h2>
            <p className="text-xs sm:text-sm text-text-secondary mt-1 max-w-2xl">
              Comprehensive gear engineering — tooth geometry terminology, 6 industrial gear types, speed calculations, manual design calculations, drawing procedures and reverse engineering workflows.
            </p>
          </div>
          {onBackToTopics && (
            <button onClick={onBackToTopics} className="text-[11px] font-mono font-bold text-accent hover:text-accent-bright transition px-3 py-1.5 rounded-lg bg-surface-elevated border border-border hover:border-accent/50">
              ← BACK TO TOPICS
            </button>
          )}
        </div>
        <div ref={r1.ref} className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 transition-all duration-700 ${r1.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {SUBTOPICS.map((st) => (
            <div
              key={st.path}
              onClick={() => navigate(st.path)}
              className="bg-surface-elevated p-5 rounded-2xl border border-border hover:border-accent/60 transition-all cursor-pointer group space-y-2 flex flex-col"
            >
              <div className="flex items-center justify-between">
                <span className="text-2xl">{st.icon}</span>
              </div>
              <h3 className="text-sm font-bold text-text-primary group-hover:text-accent transition">{st.label}</h3>
              <p className="text-xs text-text-secondary flex-1">{st.subtitle}</p>
              <div className="text-[10px] font-mono text-accent font-bold pt-2 border-t border-border/40 flex items-center justify-between">
                <span>EXPLORE</span><span>→</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── MAIN EXPORT ───────────────────────────────────────────────────────────────

export default function GearsHub({ onBackToTopics }: GearsHubProps) {
  const location = useLocation();
  const pathname = location.pathname;

  const is = (path: string) => pathname === path || pathname.startsWith(path + '/');

  return (
    <div className="space-y-0">
      {/* Sub-topic nav bar — shown on all gears sub-pages */}
      {pathname !== '/topics/gears' && (
        <div className="bg-surface border border-border rounded-2xl p-4 sm:p-6 mb-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="text-xs font-mono text-accent font-bold">GEAR CONCEPTS BOOK</span>
              <h2 className="text-2xl font-extrabold text-text-primary mt-0.5">GEARS HUB</h2>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 text-xs font-mono">
            {SUBTOPICS.map(st => (
              <Link
                key={st.path}
                to={st.path}
                className={`px-3 py-1.5 rounded-lg border transition ${
                  pathname === st.path ? 'bg-accent text-background font-bold border-accent' : 'bg-surface-elevated text-text-primary border-border hover:border-accent/40'
                }`}
              >
                {st.label}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Route Content */}
      {pathname === '/topics/gears' && <GearsLanding onBackToTopics={onBackToTopics} />}
      {is('/topics/gears/terminology') && <TopicTerminology />}
      {is('/topics/gears/types') && <TopicTypes />}
      {is('/topics/gears/selection') && <TopicSelection />}
      {is('/topics/gears/ratio') && <TopicRatio />}
      {is('/topics/gears/speed-calculation') && <TopicSpeed />}
      {is('/topics/gears/module') && <TopicModule />}
      {is('/topics/gears/calculation') && <TopicManualCalc />}
      {is('/topics/gears/how-to-draw') && <TopicHowToDraw />}
      {is('/topics/gears/reverse-engineering') && <TopicReverseEng />}
    </div>
  );
}
