import React, { useState, useMemo } from 'react';
import GdtSymbolSvg from './GdtSymbolSvg';
import CadFeatureControlFrame from './CadFeatureControlFrame';

export const GdtTheorySection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    'what-is-gdt' | 'fcf' | 'datums' | 'modifiers' | 'example' | 'gdt-vs-dim' | 'cheat-sheet'
  >('what-is-gdt');

  // Bonus Tolerance Interactive Simulator State
  const [featureType, setFeatureType] = useState<'hole' | 'pin'>('hole');
  const nominalSize = 10.0;
  const sizeTolerance = 0.05; // ±0.05 mm
  const [actualProducedSize, setActualProducedSize] = useState<number>(10.03);
  const [basePositionTol, setBasePositionTol] = useState<number>(0.2);
  const [selectedModifier, setSelectedModifier] = useState<'MMC' | 'LMC' | 'RFS'>('MMC');

  // Calculations for Bonus Tolerance
  const mmcSize = featureType === 'hole' ? nominalSize - sizeTolerance : nominalSize + sizeTolerance;
  const lmcSize = featureType === 'hole' ? nominalSize + sizeTolerance : nominalSize - sizeTolerance;

  const bonusTolerance = useMemo(() => {
    if (selectedModifier === 'RFS') return 0;
    if (selectedModifier === 'MMC') {
      if (featureType === 'hole') {
        // For hole: departure from smallest hole (MMC) gives bonus
        return Math.max(0, actualProducedSize - mmcSize);
      } else {
        // For pin: departure from largest pin (MMC) gives bonus
        return Math.max(0, mmcSize - actualProducedSize);
      }
    } else {
      // LMC
      if (featureType === 'hole') {
        return Math.max(0, lmcSize - actualProducedSize);
      } else {
        return Math.max(0, actualProducedSize - lmcSize);
      }
    }
  }, [selectedModifier, featureType, actualProducedSize, mmcSize, lmcSize]);

  const totalAllowedPositionTol = basePositionTol + bonusTolerance;

  return (
    <div className="w-full flex flex-col gap-8 font-mono text-slate-200">
      {/* ── TOP THEORY SUB-NAV TABS ── */}
      <div className="bg-[#060b16] border border-sky-500/20 rounded-2xl p-3 flex flex-wrap gap-2 shadow-xl">
        {[
          { id: 'what-is-gdt', label: '1. What is GD&T?', icon: '📘' },
          { id: 'fcf', label: '8. Feature Control Frame', icon: '🔲' },
          { id: 'datums', label: '9. Datum Reference Frame', icon: '📍' },
          { id: 'modifiers', label: '10. Modifiers & Bonus Calc', icon: 'Ⓜ️' },
          { id: 'example', label: '11. Base Plate Worked Example', icon: '🔩' },
          { id: 'gdt-vs-dim', label: '12. GD&T vs Dimensional', icon: '⚖️' },
          { id: 'cheat-sheet', label: '13. Symbol Cheat Sheet', icon: '📑' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 border ${
              activeTab === tab.id
                ? 'bg-sky-500 text-slate-950 border-sky-400 shadow-lg shadow-sky-500/25 scale-[1.02]'
                : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border-slate-800 hover:border-slate-700'
            }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* ══ TAB 1: WHAT IS GD&T? ══ */}
      {activeTab === 'what-is-gdt' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          {/* Hero Definition Card */}
          <div className="relative rounded-2xl border border-sky-500/30 bg-gradient-to-br from-[#081226] to-[#040812] p-6 sm:p-8 overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 space-y-4 max-w-3xl">
              <span className="text-xs font-bold text-sky-400 uppercase tracking-widest block">
                SECTION 1 · CORE FOUNDATION
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                WHAT IS <span className="text-sky-400">GD&T</span>?
              </h2>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-sans">
                <strong>Geometric Dimensioning and Tolerancing (GD&T)</strong> is a symbolic language used to define geometry requirements on engineering drawings. Unlike traditional plus/minus tolerancing that only controls size, GD&T controls the <em>geometry</em> of a part.
              </p>
              <div className="p-4 rounded-xl bg-sky-950/40 border border-sky-500/30 text-xs sm:text-sm text-sky-200">
                🚀 <strong>Primary Purpose:</strong> GD&T communicates design requirements from the designer to the manufacturer and quality inspector through engineering drawings with zero ambiguity.
              </div>
            </div>
          </div>

          {/* The 5 Geometry Requirements GD&T Controls */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-400" />
              GD&T Controls the 5 Core Geometric Properties of a Part:
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {[
                {
                  title: 'SHAPE',
                  icon: '▱',
                  desc: 'Controls form (straightness, flatness, circularity, cylindricity) independent of datums.',
                  color: '#14b8a6',
                  tag: 'Form Controls',
                },
                {
                  title: 'ORIENTATION',
                  icon: '⊥',
                  desc: 'Controls angular relationships (perpendicularity, parallelism, angularity) relative to datums.',
                  color: '#f59e0b',
                  tag: 'Orientation Controls',
                },
                {
                  title: 'POSITION',
                  icon: '⌖',
                  desc: 'Controls exact location of features (holes, pins, slots) relative to basic dimensions and datums.',
                  color: '#ec4899',
                  tag: 'Location Controls',
                },
                {
                  title: 'PROFILE',
                  icon: '⌓',
                  desc: 'Controls 2D cross-sections and 3D complex organic contours within uniform boundary envelopes.',
                  color: '#6366f1',
                  tag: 'Profile Controls',
                },
                {
                  title: 'RUNOUT',
                  icon: '↗',
                  desc: 'Controls surface variation and coaxiality of rotating components during a 360° rotation.',
                  color: '#f97316',
                  tag: 'Runout Controls',
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-[#091122] border transition-all hover:scale-[1.02] flex flex-col justify-between gap-3 shadow-lg"
                  style={{ borderColor: `${item.color}40` }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-serif font-black" style={{ color: item.color }}>
                      {item.icon}
                    </span>
                    <span
                      className="text-[9px] font-bold px-2 py-0.5 rounded uppercase"
                      style={{ backgroundColor: `${item.color}15`, color: item.color }}
                    >
                      {item.tag}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-base font-black text-white">{item.title}</h4>
                    <p className="text-xs text-slate-400 mt-1 leading-snug font-sans">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Designer to Manufacturer Flow Diagram */}
          <div className="p-6 rounded-2xl bg-[#070e1c] border border-slate-800 space-y-4">
            <h4 className="text-sm font-bold text-sky-400 uppercase tracking-wider">
              THE GD&T ENGINEERING COMMUNICATION BRIDGE
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-center space-y-2">
                <span className="text-2xl">👨‍💻</span>
                <h5 className="text-sm font-bold text-white">1. Design Engineer</h5>
                <p className="text-xs text-slate-400 font-sans">
                  Determines functional intent, mating clearances, and maximum allowable variation for assembly.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-sky-950/60 border border-sky-500/40 text-center space-y-2 relative">
                <span className="text-2xl">📐</span>
                <h5 className="text-sm font-bold text-sky-300">2. Engineering Drawing (CAD)</h5>
                <p className="text-xs text-slate-300 font-sans">
                  Encodes requirements into standardized Feature Control Frames, Datum Reference Frames, and Modifiers (ASME Y14.5).
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-center space-y-2">
                <span className="text-2xl">🏭</span>
                <h5 className="text-sm font-bold text-white">3. Manufacturing & Quality</h5>
                <p className="text-xs text-slate-400 font-sans">
                  Machinists machine within tolerance zones and inspectors verify parts using functional gauges, CMMs, or dial indicators.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══ TAB 2: FEATURE CONTROL FRAME (FCF) ══ */}
      {activeTab === 'fcf' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          <div className="relative rounded-2xl border border-sky-500/30 bg-[#081226] p-6 sm:p-8 space-y-4 shadow-2xl">
            <span className="text-xs font-bold text-sky-400 uppercase tracking-widest block">
              SECTION 8 · THE UNIVERSAL LANGUAGE OF GD&T
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              FEATURE CONTROL FRAME <span className="text-sky-400">(FCF)</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
              A Feature Control Frame is a rectangular box used to specify the geometric requirements for a feature. It reads like an engineering sentence from left to right.
            </p>
          </div>

          {/* Interactive Breakdown of FCF Compartments */}
          <div className="p-6 rounded-2xl bg-[#070e1c] border border-slate-800 space-y-6">
            <div className="text-center space-y-2">
              <span className="text-xs text-slate-500 uppercase tracking-widest">
                Interactive Engineering Example:
              </span>
              <div className="flex justify-center py-2">
                <CadFeatureControlFrame
                  symbolName="position"
                  tolerance="⌀0.10"
                  modifier="MMC"
                  primaryDatum="A"
                  secondaryDatum="B"
                  tertiaryDatum="C"
                  size="lg"
                  withLeader={true}
                />
              </div>
              <p className="text-xs text-sky-300 font-bold">
                Meaning: Position tolerance of cylindrical zone ⌀0.10 mm at MMC relative to Datums A, B, and C
              </p>
            </div>

            {/* 4 Compartments Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-slate-800">
              <div className="p-4 rounded-xl bg-slate-900 border border-sky-500/30 space-y-2">
                <span className="text-xs font-bold text-sky-400 block">1. Characteristic Symbol</span>
                <div className="w-10 h-10 rounded-lg bg-sky-500/10 border border-sky-400/40 flex items-center justify-center">
                  <GdtSymbolSvg name="position" size={24} color="#38bdf8" />
                </div>
                <p className="text-xs text-slate-300 font-sans">
                  Specifies which of the 14 geometric characteristics is being controlled (e.g., Position, Flatness, Runout).
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-sky-500/30 space-y-2">
                <span className="text-xs font-bold text-sky-400 block">2. Tolerance Zone & Value</span>
                <div className="h-10 px-3 rounded-lg bg-sky-500/10 border border-sky-400/40 flex items-center gap-1 font-bold text-white text-base">
                  <span className="text-sky-300">⌀</span>0.10
                </div>
                <p className="text-xs text-slate-300 font-sans">
                  Numerical total allowable variation. Preceded by ⌀ if the tolerance zone is cylindrical (diameter).
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-sky-500/30 space-y-2">
                <span className="text-xs font-bold text-sky-400 block">3. Material Modifier</span>
                <div className="w-10 h-10 rounded-lg bg-sky-500/10 border border-sky-400/40 flex items-center justify-center font-bold text-sky-300 text-lg">
                  Ⓜ
                </div>
                <p className="text-xs text-slate-300 font-sans">
                  Optional modifier: MMC (Ⓜ) or LMC (Ⓛ). When omitted, RFS (Regardless of Feature Size) is default.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-sky-500/30 space-y-2">
                <span className="text-xs font-bold text-sky-400 block">4. Datum References</span>
                <div className="h-10 px-3 rounded-lg bg-sky-500/10 border border-sky-400/40 flex items-center gap-2 font-bold text-amber-300 text-base">
                  <span>[ A ]</span>
                  <span>[ B ]</span>
                  <span>[ C ]</span>
                </div>
                <p className="text-xs text-slate-300 font-sans">
                  Order of precedence: Primary (A: 3 contact points), Secondary (B: 2 points), Tertiary (C: 1 point).
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══ TAB 3: DATUMS & 3-2-1 RULE ══ */}
      {activeTab === 'datums' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          <div className="relative rounded-2xl border border-sky-500/30 bg-[#081226] p-6 sm:p-8 space-y-4 shadow-2xl">
            <span className="text-xs font-bold text-sky-400 uppercase tracking-widest block">
              SECTION 9 · THEORETICAL REFERENCES
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              WHAT IS A <span className="text-sky-400">DATUM</span>?
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
              A <strong>datum</strong> is a theoretically exact reference used for measurement and manufacturing. Real manufactured physical surfaces have microscopic roughness, so datum simulators (granite plates, precision chucks) contact high points to establish a stable reference frame.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl bg-[#070e1c] border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center font-bold text-lg">
                A
              </div>
              <h4 className="text-sm font-bold text-white uppercase">Datum Plane A (Primary)</h4>
              <p className="text-xs text-slate-400 font-sans">
                <strong>Example: Bottom Surface.</strong> Establishes primary contact by locking 3 degrees of freedom (1 translation + 2 rotations) using minimum 3 contact points.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#070e1c] border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center font-bold text-lg">
                B
              </div>
              <h4 className="text-sm font-bold text-white uppercase">Datum Plane B (Secondary)</h4>
              <p className="text-xs text-slate-400 font-sans">
                <strong>Example: Left Face.</strong> Must be perpendicular to Datum A. Locks 2 degrees of freedom (1 translation + 1 rotation) using minimum 2 contact points.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#070e1c] border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center font-bold text-lg">
                C
              </div>
              <h4 className="text-sm font-bold text-white uppercase">Datum Plane C (Tertiary)</h4>
              <p className="text-xs text-slate-400 font-sans">
                <strong>Example: Front Face.</strong> Must be perpendicular to both A and B. Locks the final remaining translation degree of freedom with 1 contact point.
              </p>
            </div>
          </div>

          {/* 3-2-1 Principle Blueprint Card */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 to-[#0b172d] border border-sky-500/30 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <h4 className="text-base font-bold text-sky-400 uppercase">The 3-2-1 Fixturing Principle</h4>
              <p className="text-xs text-slate-300 font-sans leading-relaxed">
                In 3D space, any rigid body has 6 degrees of freedom (3 linear translations along X, Y, Z and 3 rotations around X, Y, Z). The 3-2-1 principle uses 6 contact points across 3 mutually perpendicular planes to completely constrain the part for machining and inspection.
              </p>
            </div>
            <div className="px-5 py-4 rounded-xl bg-slate-950 border border-sky-400/40 text-center font-mono shrink-0">
              <span className="text-2xl font-black text-sky-300">3 + 2 + 1 = 6</span>
              <span className="block text-[10px] text-slate-400 uppercase mt-0.5">Degrees of Freedom Locked</span>
            </div>
          </div>
        </div>
      )}

      {/* ══ TAB 4: MODIFIERS & BONUS TOLERANCE CALCULATOR ══ */}
      {activeTab === 'modifiers' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          <div className="relative rounded-2xl border border-sky-500/30 bg-[#081226] p-6 sm:p-8 space-y-4 shadow-2xl">
            <span className="text-xs font-bold text-sky-400 uppercase tracking-widest block">
              SECTION 10 · MATERIAL CONDITION MODIFIERS
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              MMC, LMC & <span className="text-sky-400">BONUS TOLERANCE</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
              Material condition modifiers define how the allowable geometric tolerance changes as the physical size of a feature varies within its dimensional limits.
            </p>
          </div>

          {/* 3 Modifiers Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="p-5 rounded-2xl bg-[#070e1c] border border-sky-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <span className="w-9 h-9 rounded-full bg-sky-500/20 border border-sky-400 text-sky-300 flex items-center justify-center font-bold text-base">
                  M
                </span>
                <span className="text-[10px] font-mono text-sky-400 bg-sky-950 px-2 py-0.5 rounded border border-sky-500/30">
                  Most Common
                </span>
              </div>
              <h4 className="text-base font-bold text-white">MMC – Maximum Material Condition</h4>
              <p className="text-xs text-slate-300 font-sans leading-relaxed">
                Condition where the greatest amount of material exists within dimensional tolerance:
              </p>
              <ul className="text-xs text-slate-400 space-y-1 font-sans">
                <li>• For a <strong>Pin / Shaft</strong>: MMC = <em>Largest pin</em></li>
                <li>• For a <strong>Hole</strong>: MMC = <em>Smallest hole</em></li>
              </ul>
              <div className="text-[11px] text-teal-300 bg-teal-950/40 p-2.5 rounded-lg border border-teal-500/30">
                ⭐ Provides least clearance in assembly and enables <strong>bonus tolerance</strong>!
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#070e1c] border border-amber-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <span className="w-9 h-9 rounded-full bg-amber-500/20 border border-amber-400 text-amber-300 flex items-center justify-center font-bold text-base">
                  L
                </span>
                <span className="text-[10px] font-mono text-amber-400 bg-amber-950 px-2 py-0.5 rounded border border-amber-500/30">
                  Wall Thickness
                </span>
              </div>
              <h4 className="text-base font-bold text-white">LMC – Least Material Condition</h4>
              <p className="text-xs text-slate-300 font-sans leading-relaxed">
                Condition where the least amount of material exists within dimensional tolerance:
              </p>
              <ul className="text-xs text-slate-400 space-y-1 font-sans">
                <li>• For a <strong>Pin / Shaft</strong>: LMC = <em>Smallest pin</em></li>
                <li>• For a <strong>Hole</strong>: LMC = <em>Largest hole</em></li>
              </ul>
              <div className="text-[11px] text-amber-300 bg-amber-950/40 p-2.5 rounded-lg border border-amber-500/30">
                🛡️ Useful when maintaining minimum wall thickness or structural strength is critical.
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#070e1c] border border-slate-700 space-y-3">
              <div className="flex items-center justify-between">
                <span className="w-9 h-9 rounded-full bg-slate-800 border border-slate-600 text-slate-300 flex items-center justify-center font-bold text-base">
                  S
                </span>
                <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                  Default Rule
                </span>
              </div>
              <h4 className="text-base font-bold text-white">RFS – Regardless of Feature Size</h4>
              <p className="text-xs text-slate-300 font-sans leading-relaxed">
                Tolerance remains strictly constant regardless of the actual produced size of the feature.
              </p>
              <ul className="text-xs text-slate-400 space-y-1 font-sans">
                <li>• No bonus tolerance permitted</li>
                <li>• ASME Y14.5 default if no modifier is indicated</li>
              </ul>
              <div className="text-[11px] text-slate-400 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                🔒 Used for precision press-fits and dynamic balance where clearance must not shift.
              </div>
            </div>
          </div>

          {/* Live Interactive Bonus Tolerance Calculator */}
          <div className="p-6 rounded-2xl bg-gradient-to-b from-[#0a1428] to-[#060c18] border-2 border-sky-400/40 shadow-2xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-2">
              <div>
                <h4 className="text-lg font-black text-white font-mono flex items-center gap-2">
                  <span className="text-sky-400">⚡</span>
                  LIVE BONUS TOLERANCE CALCULATOR
                </h4>
                <p className="text-xs text-slate-400 font-sans mt-0.5">
                  Simulate hole or pin machining to see bonus tolerance added automatically.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setFeatureType('hole')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition ${
                    featureType === 'hole'
                      ? 'bg-sky-500 text-slate-950 font-black'
                      : 'bg-slate-900 text-slate-400 border border-slate-800'
                  }`}
                >
                  Internal Hole
                </button>
                <button
                  onClick={() => setFeatureType('pin')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition ${
                    featureType === 'pin'
                      ? 'bg-sky-500 text-slate-950 font-black'
                      : 'bg-slate-900 text-slate-400 border border-slate-800'
                  }`}
                >
                  External Pin / Shaft
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Slider 1: Actual Produced Size */}
              <div className="space-y-3 bg-slate-950 p-4 rounded-xl border border-slate-800">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-bold">Nominal Dimension:</span>
                  <span className="text-sky-300 font-bold">Ø{nominalSize.toFixed(2)} ±{sizeTolerance.toFixed(2)} mm</span>
                </div>
                <div className="text-[11px] text-slate-500 font-sans">
                  MMC Size = <strong className="text-white">{mmcSize.toFixed(2)} mm</strong> | LMC Size = <strong className="text-white">{lmcSize.toFixed(2)} mm</strong>
                </div>

                <div className="pt-2 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300">Produced Actual Size:</span>
                    <span className="text-amber-300 font-bold text-sm">Ø{actualProducedSize.toFixed(3)} mm</span>
                  </div>
                  <input
                    type="range"
                    min={(nominalSize - sizeTolerance).toString()}
                    max={(nominalSize + sizeTolerance).toString()}
                    step="0.005"
                    value={actualProducedSize}
                    onChange={(e) => setActualProducedSize(parseFloat(e.target.value))}
                    className="w-full accent-sky-500"
                  />
                </div>
              </div>

              {/* Slider 2: Base Position Tolerance & Modifier */}
              <div className="space-y-3 bg-slate-950 p-4 rounded-xl border border-slate-800">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-bold">Base Position Tolerance:</span>
                  <span className="text-sky-300 font-bold">⌀{basePositionTol.toFixed(2)} mm</span>
                </div>
                <input
                  type="range"
                  min="0.05"
                  max="0.50"
                  step="0.05"
                  value={basePositionTol}
                  onChange={(e) => setBasePositionTol(parseFloat(e.target.value))}
                  className="w-full accent-sky-500"
                />

                <div className="pt-2 space-y-1">
                  <span className="text-xs text-slate-400 block font-bold">Material Modifier:</span>
                  <div className="grid grid-cols-3 gap-1.5">
                    {(['MMC', 'LMC', 'RFS'] as const).map((mod) => (
                      <button
                        key={mod}
                        onClick={() => setSelectedModifier(mod)}
                        className={`py-1 rounded text-xs font-bold transition ${
                          selectedModifier === mod
                            ? 'bg-sky-500 text-slate-950'
                            : 'bg-slate-900 text-slate-400 border border-slate-800'
                        }`}
                      >
                        {mod}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Result: Total Allowed Tolerance Callout */}
              <div className="p-4 rounded-xl bg-gradient-to-br from-sky-950/60 to-slate-950 border border-sky-500/40 flex flex-col justify-between gap-3">
                <span className="text-[10px] text-sky-400 font-bold uppercase tracking-wider">
                  Calculation Results
                </span>

                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Base Tolerance:</span>
                    <span className="text-white font-mono">⌀{basePositionTol.toFixed(3)} mm</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Bonus Tolerance:</span>
                    <span className="text-teal-400 font-bold font-mono">+ ⌀{bonusTolerance.toFixed(3)} mm</span>
                  </div>
                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                    <span className="text-xs font-bold text-white uppercase">Total Allowed:</span>
                    <span className="text-lg font-black text-sky-300 font-mono">
                      ⌀{totalAllowedPositionTol.toFixed(3)} mm
                    </span>
                  </div>
                </div>

                <div className="text-[10px] text-slate-400 font-sans leading-tight">
                  {selectedModifier === 'MMC'
                    ? featureType === 'hole'
                      ? 'Because the hole was produced larger than MMC (smallest hole), the extra clearance allows the hole center to deviate further without causing assembly interference!'
                      : 'Because the pin was produced smaller than MMC (largest pin), the extra clearance gives bonus position tolerance.'
                    : selectedModifier === 'LMC'
                    ? 'Bonus tolerance calculated from departure from Least Material Condition.'
                    : 'RFS modifier gives zero bonus tolerance regardless of size.'}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══ TAB 5: BASE PLATE WORKED EXAMPLE ══ */}
      {activeTab === 'example' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          <div className="relative rounded-2xl border border-sky-500/30 bg-[#081226] p-6 sm:p-8 space-y-4 shadow-2xl">
            <span className="text-xs font-bold text-sky-400 uppercase tracking-widest block">
              SECTION 11 · COMPLETE WORKED ENGINEERING EXAMPLE
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              BASE PLATE WITH <span className="text-sky-400">4 MOUNTING HOLES</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
              An engineering component demonstrating how Feature Control Frames, Datums A, B, and C, and coordinate dimensions interact in a real assembly.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left 7 Cols: Blueprint Graphic */}
            <div className="lg:col-span-7 bg-[#050a14] rounded-2xl border-2 border-sky-500/30 p-6 flex flex-col items-center justify-center relative overflow-hidden shadow-2xl">
              {/* CAD Grid lines */}
              <div
                className="absolute inset-0 pointer-events-none opacity-20"
                style={{
                  backgroundImage: `
                    linear-gradient(rgba(56, 189, 248, 0.2) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(56, 189, 248, 0.2) 1px, transparent 1px)
                  `,
                  backgroundSize: '20px 20px',
                }}
              />

              <div className="relative z-10 w-full max-w-md aspect-[4/3] border-2 border-sky-400/80 bg-slate-900/60 rounded-xl p-6 flex flex-col justify-between shadow-inner">
                {/* Datum B Indicator (Left Face) */}
                <div className="absolute -left-3 top-1/2 -translate-y-1/2 flex items-center">
                  <div className="w-6 h-6 rounded bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center border border-amber-200 shadow">
                    B
                  </div>
                  <div className="w-3 h-0.5 bg-amber-400" />
                </div>

                {/* Datum A Indicator (Bottom Face) */}
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 flex flex-col items-center">
                  <div className="w-0.5 h-3 bg-amber-400" />
                  <div className="w-6 h-6 rounded bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center border border-amber-200 shadow">
                    A
                  </div>
                </div>

                {/* Top Row of 2 Holes */}
                <div className="flex justify-between px-8 pt-4">
                  <div className="relative flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full border-2 border-sky-300 bg-sky-950/80 flex items-center justify-center text-[10px] text-sky-200 font-bold">
                      H1
                    </div>
                    {/* Cylindrical tolerance zone circle */}
                    <div className="absolute w-14 h-14 rounded-full border border-pink-400/60 border-dashed animate-spin pointer-events-none" style={{ animationDuration: '10s' }} />
                  </div>
                  <div className="relative flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full border-2 border-sky-300 bg-sky-950/80 flex items-center justify-center text-[10px] text-sky-200 font-bold">
                      H2
                    </div>
                    <div className="absolute w-14 h-14 rounded-full border border-pink-400/60 border-dashed animate-spin pointer-events-none" style={{ animationDuration: '10s' }} />
                  </div>
                </div>

                {/* Center Callout Box */}
                <div className="text-center space-y-1 my-auto">
                  <span className="text-[11px] font-bold text-sky-300 block">4X Ø10 ±0.05 mm</span>
                  <div className="flex justify-center">
                    <CadFeatureControlFrame
                      symbolName="position"
                      tolerance="⌀0.20"
                      primaryDatum="A"
                      secondaryDatum="B"
                      tertiaryDatum="C"
                      size="sm"
                    />
                  </div>
                </div>

                {/* Bottom Row of 2 Holes */}
                <div className="flex justify-between px-8 pb-4">
                  <div className="relative flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full border-2 border-sky-300 bg-sky-950/80 flex items-center justify-center text-[10px] text-sky-200 font-bold">
                      H3
                    </div>
                    <div className="absolute w-14 h-14 rounded-full border border-pink-400/60 border-dashed animate-spin pointer-events-none" style={{ animationDuration: '10s' }} />
                  </div>
                  <div className="relative flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full border-2 border-sky-300 bg-sky-950/80 flex items-center justify-center text-[10px] text-sky-200 font-bold">
                      H4
                    </div>
                    <div className="absolute w-14 h-14 rounded-full border border-pink-400/60 border-dashed animate-spin pointer-events-none" style={{ animationDuration: '10s' }} />
                  </div>
                </div>
              </div>

              <div className="text-[10px] text-slate-500 mt-4 text-center">
                Dashed pink circles show ⌀0.20 mm cylindrical tolerance zones around theoretical true positions.
              </div>
            </div>

            {/* Right 5 Cols: Engineering Explanation */}
            <div className="lg:col-span-5 flex flex-col justify-between gap-4 bg-slate-900/60 p-6 rounded-2xl border border-slate-800">
              <div className="space-y-4">
                <h4 className="text-base font-bold text-white uppercase border-b border-slate-800 pb-3">
                  Drawing Specifications
                </h4>

                <div className="space-y-2 text-xs">
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-500 uppercase block font-bold">Hole Diameter:</span>
                    <span className="text-sky-300 font-bold text-sm">Ø10 ±0.05 mm</span>
                    <span className="text-[11px] text-slate-400 block mt-0.5">
                      Min Hole = 9.95 mm (MMC) | Max Hole = 10.05 mm (LMC)
                    </span>
                  </div>

                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-500 uppercase block font-bold">Position Tolerance:</span>
                    <span className="text-pink-400 font-bold text-sm">⌀0.20 mm relative to Datums A, B and C</span>
                  </div>

                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-[10px] text-slate-500 uppercase block font-bold">What This Controls:</span>
                    <p className="text-slate-300 font-sans leading-relaxed text-[11px]">
                      This defines a controlled cylindrical tolerance zone for each hole location while ensuring proper assembly with the mating component pins or bolts.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-emerald-950/30 rounded-xl border border-emerald-500/30 text-xs text-emerald-300 font-sans">
                ✓ <strong>Assembly Guarantee:</strong> All 4 bolt holes will assemble smoothly with mating components regardless of shop variations.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══ TAB 6: GD&T VS DIMENSIONAL TOLERANCE ══ */}
      {activeTab === 'gdt-vs-dim' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          <div className="relative rounded-2xl border border-sky-500/30 bg-[#081226] p-6 sm:p-8 space-y-4 shadow-2xl">
            <span className="text-xs font-bold text-sky-400 uppercase tracking-widest block">
              SECTION 12 · CRITICAL ENGINEERING COMPARISON
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              GD&T VS <span className="text-sky-400">DIMENSIONAL TOLERANCE</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
              Why dimensional plus/minus tolerancing alone causes assembly failures: a part can measure perfectly within size limits with calipers, but still be completely un-assemblable!
            </p>
          </div>

          {/* Side-by-Side Comparison Columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Dimensional Tolerance */}
            <div className="p-6 rounded-2xl bg-[#070e1c] border border-slate-800 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h4 className="text-base font-black text-slate-300">DIMENSIONAL TOLERANCE (±)</h4>
                <span className="text-xs font-mono text-slate-500">Size Only</span>
              </div>
              <p className="text-xs text-slate-400 font-sans leading-relaxed">
                Controls size dimensions between two parallel caliper jaws:
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                {['Length', 'Width', 'Height', 'Diameter', 'Thickness', 'Radius', 'Hole Size', 'Shaft Size'].map((item) => (
                  <div key={item} className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
                    • {item}
                  </div>
                ))}
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                <span className="text-slate-500 uppercase font-bold block text-[10px]">Typical Example:</span>
                <span className="text-amber-400 font-bold font-mono">Ø25 ±0.02 mm</span>
              </div>
            </div>

            {/* Geometric Tolerance (GD&T) */}
            <div className="p-6 rounded-2xl bg-[#071329] border border-sky-500/40 space-y-4 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-sky-500/30">
                <h4 className="text-base font-black text-sky-400">GEOMETRIC TOLERANCE (GD&T)</h4>
                <span className="text-xs font-mono text-sky-300">Geometry + Form</span>
              </div>
              <p className="text-xs text-slate-300 font-sans leading-relaxed">
                Controls geometry, shape, orientation, and relationships in 3D:
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                {['Shape', 'Orientation', 'Location', 'Geometry', 'Runout', 'Profile', 'Flatness', 'Position'].map((item) => (
                  <div key={item} className="p-2 rounded-lg bg-sky-950/60 border border-sky-500/30 text-sky-200">
                    ✓ {item}
                  </div>
                ))}
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-sky-500/30 text-xs">
                <span className="text-slate-500 uppercase font-bold block text-[10px]">Typical Example:</span>
                <span className="text-sky-300 font-bold font-mono">Position ⌀0.05 mm rel to A|B|C</span>
              </div>
            </div>
          </div>

          {/* The 5 Failure Modes */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              The 5 Hidden Defects Undetectable by Size Tolerances Alone:
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {[
                {
                  title: '1. BENDING',
                  icon: '〰️',
                  desc: 'A shaft can measure exactly Ø20 mm along its length, but be bowed or banana-shaped, causing binding in bearings.',
                  solution: 'Controlled by Straightness or Cylindricity',
                },
                {
                  title: '2. TAPER',
                  icon: '📐',
                  desc: 'A machined bore can vary from large to small along its depth while meeting nominal size at both ends.',
                  solution: 'Controlled by Cylindricity or Profile',
                },
                {
                  title: '3. OUT-OF-ROUND',
                  icon: '🔄',
                  desc: 'Tri-lobed or egg-shaped parts have constant 2-point micrometer diameter, but fail in circular bushings.',
                  solution: 'Controlled by Circularity / Roundness',
                },
                {
                  title: '4. MISALIGNMENT',
                  icon: '⚡',
                  desc: 'Holes can be the exact diameter, but drilled off-center or angled, preventing bolt insertion.',
                  solution: 'Controlled by Position & Perpendicularity',
                },
                {
                  title: '5. CONCENTRICITY LACK',
                  icon: '🎯',
                  desc: 'Inner bore and outer diameter can both be within size tolerance, but their centerlines are offset, creating severe vibration.',
                  solution: 'Controlled by Concentricity or Runout',
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-[#091122] border border-rose-500/20 hover:border-rose-400 transition flex flex-col justify-between gap-3 shadow-lg"
                >
                  <div className="text-2xl">{item.icon}</div>
                  <div>
                    <h4 className="text-sm font-black text-rose-300">{item.title}</h4>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed font-sans">{item.desc}</p>
                  </div>
                  <div className="text-[10px] text-teal-300 font-mono bg-teal-950/40 p-2 rounded border border-teal-500/20">
                    💡 {item.solution}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ══ TAB 7: CHEAT SHEET & QUICK REFERENCE ══ */}
      {activeTab === 'cheat-sheet' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="relative rounded-2xl border border-sky-500/30 bg-[#081226] p-6 sm:p-8 space-y-4 shadow-2xl">
            <span className="text-xs font-bold text-sky-400 uppercase tracking-widest block">
              SECTION 13 · QUICK REFERENCE MATRIX
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              COMMON GD&T <span className="text-sky-400">SYMBOL REFERENCE</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
              Summary table of all 14 symbols, standard vector shapes, control categories, and datum requirements.
            </p>
          </div>

          {/* Quick Table */}
          <div className="rounded-2xl border border-slate-800 bg-[#070e1c] overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-slate-900 border-b border-slate-800 text-slate-400 uppercase text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Symbol</th>
                    <th className="py-3 px-4">Characteristic Name</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Datum Needed?</th>
                    <th className="py-3 px-4">Typical Application</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  {[
                    { sym: 'straightness', name: 'Straightness', cat: 'FORM', datum: 'No', app: 'Shafts, edges, linear rails' },
                    { sym: 'flatness', name: 'Flatness', cat: 'FORM', datum: 'No', app: 'Engine block, machine bed, plate' },
                    { sym: 'circularity', name: 'Circularity / Roundness', cat: 'FORM', datum: 'No', app: 'Hydraulic piston, bearing seat' },
                    { sym: 'cylindricity', name: 'Cylindricity', cat: 'FORM', datum: 'No', app: 'Cylinder bore, high-speed shaft' },
                    { sym: 'profile-line', name: 'Profile of a Line', cat: 'PROFILE', datum: 'Optional', app: 'Cam cross-section, airfoil curve' },
                    { sym: 'profile-surface', name: 'Profile of a Surface', cat: 'PROFILE', datum: 'Normally Yes', app: 'Turbine blade, car body panel' },
                    { sym: 'parallelism', name: 'Parallelism', cat: 'ORIENTATION', datum: 'Yes', app: 'Guide rails, slide surfaces' },
                    { sym: 'perpendicularity', name: 'Perpendicularity', cat: 'ORIENTATION', datum: 'Yes', app: 'Hole-to-face squareness, columns' },
                    { sym: 'angularity', name: 'Angularity', cat: 'ORIENTATION', datum: 'Yes', app: '45° chamfer, V-blocks, wedges' },
                    { sym: 'position', name: 'Position / True Position', cat: 'LOCATION', datum: 'Yes (A, B, C)', app: 'Bolt-hole circle, pin locations' },
                    { sym: 'concentricity', name: 'Concentricity', cat: 'LOCATION', datum: 'Yes', app: 'High-speed motor rotor' },
                    { sym: 'symmetry', name: 'Symmetry', cat: 'LOCATION', datum: 'Yes', app: 'Keyway slot center plane' },
                    { sym: 'circular-runout', name: 'Circular Runout', cat: 'RUNOUT', datum: 'Yes (Axis)', app: 'Shaft shoulder, rotating pulley' },
                    { sym: 'total-runout', name: 'Total Runout', cat: 'RUNOUT', datum: 'Yes (Axis)', app: 'Turbine spindle, printer roll' },
                  ].map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-900/50 transition">
                      <td className="py-2.5 px-4">
                        <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center">
                          <GdtSymbolSvg name={row.sym} size={18} color="#38bdf8" />
                        </div>
                      </td>
                      <td className="py-2.5 px-4 font-bold text-white">{row.name}</td>
                      <td className="py-2.5 px-4 text-sky-300">{row.cat}</td>
                      <td className="py-2.5 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] ${row.datum === 'No' ? 'bg-emerald-950 text-emerald-300' : 'bg-amber-950 text-amber-300'}`}>
                          {row.datum}
                        </span>
                      </td>
                      <td className="py-2.5 px-4 text-slate-400">{row.app}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GdtTheorySection;
