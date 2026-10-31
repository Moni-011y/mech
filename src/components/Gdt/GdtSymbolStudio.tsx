import { useState } from 'react';
import Gdt3dSymbolCanvas from './Gdt3dSymbolCanvas';
import type { MaterialPreset } from './Gdt3dSymbolCanvas';
import Gdt3dFcf from './Gdt3dFcf';
import GdtSymbolSvg from './GdtSymbolSvg';

export interface GdtSymbolItem {
  id: string;
  cat: 'FORM' | 'PROFILE' | 'ORIENTATION' | 'LOCATION' | 'RUNOUT';
  catColor: string;
  sym: string;
  name: string;
  desc: string;
  zone: string;
  datum: boolean;
  example: string;
  note: string;
}

export const GDT_SYMBOLS: GdtSymbolItem[] = [
  {
    id: 'flatness',
    cat: 'FORM',
    catColor: '#14b8a6',
    sym: '⏥',
    name: 'FLATNESS',
    desc: 'Controls surface planarity. The entire surface must lie between two parallel planes separated by the tolerance value.',
    zone: 'Two parallel planes',
    datum: false,
    example: 'Engine block sealing surface: ⏥ 0.02 mm — prevents oil and coolant leakage.',
    note: 'Form control — no datum reference permitted.',
  },
  {
    id: 'circularity',
    cat: 'FORM',
    catColor: '#14b8a6',
    sym: '○',
    name: 'CIRCULARITY',
    desc: 'At any cross-section perpendicular to axis, actual circle must lie between two concentric circles.',
    zone: 'Two concentric circles (annular zone)',
    datum: false,
    example: 'Hydraulic piston rod cross-section circularity 0.01 mm.',
    note: 'Evaluates single cross-sections individually.',
  },
  {
    id: 'cylindricity',
    cat: 'FORM',
    catColor: '#14b8a6',
    sym: '⌭',
    name: 'CYLINDRICITY',
    desc: 'Comprehensive 3D control of cylindrical surface — combines circularity, straightness, and taper simultaneously.',
    zone: 'Two coaxial cylinders',
    datum: false,
    example: 'Precision bearing journal: ⌭ 0.015 mm.',
    note: 'Most stringent form control for cylinders.',
  },
  {
    id: 'straightness',
    cat: 'FORM',
    catColor: '#14b8a6',
    sym: '⏤',
    name: 'STRAIGHTNESS',
    desc: 'Controls straightness of surface line elements or feature axis within a cylindrical or planar tolerance zone.',
    zone: 'Cylinder zone (axis) / 2 Parallel lines',
    datum: false,
    example: 'Guide pin axis straightness ⏤ Ø0.05 mm.',
    note: 'Applies to derived median line or surface elements.',
  },
  {
    id: 'profile-line',
    cat: 'PROFILE',
    catColor: '#6366f1',
    sym: '⌒',
    name: 'PROFILE OF A LINE',
    desc: 'Controls 2D cross-sectional contour of a feature relative to true profile.',
    zone: 'Two offset curves',
    datum: false,
    example: 'Aerofoil section profile line ⌒ 0.1 mm.',
    note: 'Evaluates individual 2D line slices.',
  },
  {
    id: 'profile-surface',
    cat: 'PROFILE',
    catColor: '#6366f1',
    sym: '⌓',
    name: 'PROFILE OF A SURFACE',
    desc: 'Controls complete 3D shape of complex surfaces. Highly versatile geometric control.',
    zone: 'Two 3D offset surface envelopes',
    datum: true,
    example: 'Automotive body panel: ⌓ 0.5 A|B|C.',
    note: 'Can control form, orientation, location, and size simultaneously.',
  },
  {
    id: 'perpendicularity',
    cat: 'ORIENTATION',
    catColor: '#f59e0b',
    sym: '⊾',
    name: 'PERPENDICULARITY',
    desc: 'Controls surface or feature axis required to be at 90° exact angle to datum reference plane/axis.',
    zone: 'Two parallel planes / Cylindrical zone at 90°',
    datum: true,
    example: 'Cylinder head mounting face ⊾ 0.03 A.',
    note: 'Requires primary datum reference.',
  },
  {
    id: 'parallelism',
    cat: 'ORIENTATION',
    catColor: '#f59e0b',
    sym: '∥',
    name: 'PARALLELISM',
    desc: 'Controls surface or axis parallel to datum reference plane/axis.',
    zone: 'Two parallel planes / Cylindrical zone',
    datum: true,
    example: 'Gearbox top plate ∥ 0.02 A.',
    note: 'Requires datum reference.',
  },
  {
    id: 'angularity',
    cat: 'ORIENTATION',
    catColor: '#f59e0b',
    sym: '∠',
    name: 'ANGULARITY',
    desc: 'Controls surface or axis at specified basic angle relative to datum plane.',
    zone: 'Two parallel planes inclined at basic angle',
    datum: true,
    example: 'Bevel gear mounting angle ∠ 0.04 A at 45° basic.',
    note: 'Requires basic angle dimension on drawing.',
  },
  {
    id: 'position',
    cat: 'LOCATION',
    catColor: '#ec4899',
    sym: '⊕',
    name: 'POSITION',
    desc: 'Controls location of feature center, axis, or center plane relative to true position and datums. Most common GD&T control.',
    zone: 'Cylindrical zone (Ø)',
    datum: true,
    example: 'Flange bolt hole circle: ⊕ Ø0.05 A|B|C MMC.',
    note: 'Supports MMC / LMC material condition modifiers for bonus tolerance.',
  },
  {
    id: 'concentricity',
    cat: 'LOCATION',
    catColor: '#ec4899',
    sym: '◎',
    name: 'CONCENTRICITY',
    desc: 'Controls median points of diametrically opposed elements relative to datum axis.',
    zone: 'Cylindrical zone coaxial with datum axis',
    datum: true,
    example: 'High-speed motor rotor journal ◎ 0.01 A.',
    note: 'Difficult to measure; often substituted with Position or Runout.',
  },
  {
    id: 'symmetry',
    cat: 'LOCATION',
    catColor: '#ec4899',
    sym: '⌯',
    name: 'SYMMETRY',
    desc: 'Controls median points of feature opposite sides relative to datum center plane.',
    zone: 'Two parallel planes symmetric about datum plane',
    datum: true,
    example: 'Keyway slot symmetry ⌯ 0.03 A.',
    note: 'Evaluates median points of opposing elements.',
  },
  {
    id: 'circular-runout',
    cat: 'RUNOUT',
    catColor: '#f97316',
    sym: '↗',
    name: 'CIRCULAR RUNOUT',
    desc: 'Controls circular variation during 360° rotation at any single circular cross-section.',
    zone: 'Annular zone at each cross-section',
    datum: true,
    example: 'Shaft coupling shoulder ↗ 0.02 A.',
    note: 'Measured section-by-section with dial indicator.',
  },
  {
    id: 'total-runout',
    cat: 'RUNOUT',
    catColor: '#f97316',
    sym: '⇗',
    name: 'TOTAL RUNOUT',
    desc: 'Simultaneously controls entire surface during full 360° rotation while traversing indicator along feature.',
    zone: 'Cylindrical zone over entire surface length',
    datum: true,
    example: 'Turbine shaft main journal ⇗ 0.01 A-B.',
    note: 'Combines circularity, straightness, coaxiality, and taper.',
  },
];

export default function GdtSymbolStudio() {
  const [selectedSymbolId, setSelectedSymbolId] = useState<string>('flatness');
  const [catFilter, setCatFilter] = useState<string>('ALL');
  const [material, setMaterial] = useState<MaterialPreset>('titanium');
  const [showZone, setShowZone] = useState<boolean>(true);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [toleranceVal, setToleranceVal] = useState<number>(0.05);

  const selectedSymbol = GDT_SYMBOLS.find((s) => s.id === selectedSymbolId) || GDT_SYMBOLS[0];

  const filteredSymbols = GDT_SYMBOLS.filter((s) => (catFilter === 'ALL' ? true : s.cat === catFilter));

  const materialsList: { id: MaterialPreset; label: string; bg: string }[] = [
    { id: 'titanium', label: 'Titanium Blue', bg: 'from-sky-500 to-blue-700' },
    { id: 'gold', label: 'Anodized Gold', bg: 'from-amber-400 to-amber-600' },
    { id: 'chrome', label: 'Cyber Chrome', bg: 'from-slate-200 to-slate-400' },
    { id: 'neon', label: 'Neon Glass', bg: 'from-cyan-400 to-emerald-400' },
    { id: 'cobalt', label: 'Deep Cobalt', bg: 'from-blue-600 to-indigo-800' },
  ];

  return (
    <div className="flex flex-col gap-8 w-full">
      {/* Top Header Banner */}
      <div className="relative bg-gradient-to-r from-slate-900 via-sky-950/80 to-slate-900 border border-sky-500/20 rounded-2xl p-6 md:p-8 shadow-2xl overflow-hidden">
        <div className="absolute -right-12 -top-12 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400 text-xs font-semibold uppercase tracking-wider mb-3">
              <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping" />
              ASME Y14.5 / ISO 1101 3D Visualizer
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              Interactive 3D GD&T Symbol Studio
            </h1>
            <p className="text-slate-400 text-sm md:text-base mt-2 max-w-2xl">
              Explore geometric characteristics with real-time 3D rendered extruded symbols, live tolerance zone envelopes, lighting reflections, and 3D Feature Control Frame specification builders.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-2">
            {['ALL', 'FORM', 'PROFILE', 'ORIENTATION', 'LOCATION', 'RUNOUT'].map((cat) => (
              <button
                key={cat}
                onClick={() => setCatFilter(cat)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
                  catFilter === cat
                    ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/25 scale-105'
                    : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Studio 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: 3D Canvas Viewport & Studio Controls (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="flex items-center justify-between bg-slate-900/80 p-4 rounded-xl border border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-sky-500/10 border border-sky-400/40 flex items-center justify-center">
                <GdtSymbolSvg name={selectedSymbol.id} size={24} color="#38bdf8" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-white tracking-wide">{selectedSymbol.name}</h3>
                  <span
                    className="inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded"
                    style={{ backgroundColor: `${selectedSymbol.catColor}20`, color: selectedSymbol.catColor }}
                  >
                    {selectedSymbol.cat}
                  </span>
                </div>
                {(selectedSymbol.id === 'flatness' || selectedSymbol.id === 'circularity' || selectedSymbol.id === 'cylindricity' || selectedSymbol.id === 'total-runout') && (
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
                    <span className="text-[11px] font-semibold text-teal-300">
                      Photorealistic Industrial Video Active
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Toggles */}
            <div className="flex items-center gap-3">
              {selectedSymbol.id !== 'flatness' && selectedSymbol.id !== 'circularity' && selectedSymbol.id !== 'cylindricity' && selectedSymbol.id !== 'total-runout' ? (
                <>
                  <button
                    onClick={() => setShowZone(!showZone)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
                      showZone
                        ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
                        : 'bg-slate-800 border-slate-700 text-slate-400'
                    }`}
                  >
                    {showZone ? 'Zone: ON' : 'Zone: OFF'}
                  </button>
                  <button
                    onClick={() => setAutoRotate(!autoRotate)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
                      autoRotate
                        ? 'bg-sky-500/20 border-sky-500/50 text-sky-300'
                        : 'bg-slate-800 border-slate-700 text-slate-400'
                    }`}
                  >
                    {autoRotate ? 'Rotate: ON' : 'Rotate: OFF'}
                  </button>
                </>
              ) : (
                <span className="text-xs font-mono text-teal-300 bg-teal-950/70 border border-teal-500/30 px-3 py-1.5 rounded-lg flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping" />
                  HD 1080P Video
                </span>
              )}
            </div>
          </div>

          {/* 3D Symbol Viewport */}
          <Gdt3dSymbolCanvas
            symbolId={selectedSymbol.id}
            materialPreset={material}
            showToleranceZone={showZone}
            autoRotate={autoRotate}
            className="w-full h-80 md:h-96 rounded-2xl shadow-2xl"
          />

          {/* 3D Material Picker Bar */}
          <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
            {selectedSymbol.id === 'flatness' ? (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 w-full text-xs">
                <div className="flex items-center gap-2 text-slate-300">
                  <span className="text-teal-400 font-bold">🎬 Industrial Simulation:</span>
                  <span>Photorealistic machining & surface plate flatness verification with dial indicator</span>
                </div>
                <span className="text-[11px] font-mono text-teal-400 bg-teal-500/10 border border-teal-500/20 px-2.5 py-0.5 rounded self-start sm:self-auto">
                  Tolerance: ⏥ 0.02 mm
                </span>
              </div>
            ) : selectedSymbol.id === 'circularity' ? (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 w-full text-xs">
                <div className="flex items-center gap-2 text-slate-300">
                  <span className="text-teal-400 font-bold">🎬 Industrial Simulation:</span>
                  <span>Photorealistic precision shaft circularity verification with rotational dial indicator</span>
                </div>
                <span className="text-[11px] font-mono text-teal-400 bg-teal-500/10 border border-teal-500/20 px-2.5 py-0.5 rounded self-start sm:self-auto">
                  Tolerance: ○ 0.01 mm
                </span>
              </div>
            ) : selectedSymbol.id === 'total-runout' ? (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 w-full text-xs">
                <div className="flex items-center gap-2 text-slate-300">
                  <span className="text-orange-400 font-bold">🎬 Industrial Simulation:</span>
                  <span>Full-length rotating shaft total runout verification with traversing dial indicator</span>
                </div>
                <span className="text-[11px] font-mono text-orange-400 bg-orange-500/10 border border-orange-500/20 px-2.5 py-0.5 rounded self-start sm:self-auto">
                  Tolerance: ⇗ 0.05 A
                </span>
              </div>
            ) : (
              <>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  3D Surface Finish Material:
                </span>
                <div className="flex flex-wrap gap-2">
                  {materialsList.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setMaterial(m.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 border transition ${
                        material === m.id
                          ? 'border-sky-400 bg-sky-500/10 text-white shadow-md'
                          : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <span className={`w-3 h-3 rounded-full bg-gradient-to-tr ${m.bg}`} />
                      {m.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Right Column: Specification & 3D FCF Inspector (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* Live 3D Feature Control Frame Component */}
          <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-sky-400 uppercase tracking-wider">
                Live 3D Feature Control Frame
              </h4>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span>Tol:</span>
                <input
                  type="range"
                  min="0.01"
                  max="0.25"
                  step="0.01"
                  value={toleranceVal}
                  onChange={(e) => setToleranceVal(parseFloat(e.target.value))}
                  className="w-20 accent-sky-500"
                />
                <span className="font-mono text-sky-300 font-bold">{toleranceVal.toFixed(2)} mm</span>
              </div>
            </div>

            <Gdt3dFcf
              characteristicSymbol={selectedSymbol.sym}
              toleranceValue={toleranceVal}
              modifier="MMC"
              datumA="A"
              datumB="B"
              datumC="C"
              className="w-full h-40"
            />
          </div>

          {/* ASME Y14.5 Specification Details */}
          <div className="bg-slate-900/90 p-6 rounded-2xl border border-slate-800 flex flex-col gap-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: selectedSymbol.catColor }} />
              Engineering Standard Details
            </h4>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-500 font-bold uppercase block mb-1">Description</span>
                <p className="text-slate-300 leading-relaxed font-medium">{selectedSymbol.desc}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80">
                  <span className="text-slate-500 font-bold uppercase block text-[10px]">Tolerance Zone</span>
                  <span className="text-sky-300 font-semibold">{selectedSymbol.zone}</span>
                </div>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80">
                  <span className="text-slate-500 font-bold uppercase block text-[10px]">Datum Required</span>
                  <span className={selectedSymbol.datum ? 'text-amber-400 font-bold' : 'text-emerald-400 font-bold'}>
                    {selectedSymbol.datum ? 'YES (Primary/Secondary)' : 'NO (Form Control)'}
                  </span>
                </div>
              </div>

              <div className="pt-2">
                <span className="text-slate-500 font-bold uppercase block mb-1">Industrial Application Example</span>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-slate-300 font-mono text-[11px]">
                  {selectedSymbol.example}
                </div>
              </div>

              <div className="pt-1">
                <span className="text-amber-400/90 text-[11px] font-medium flex items-center gap-1.5">
                  <span>💡</span> {selectedSymbol.note}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3D Symbols Interactive Grid */}
      <div className="flex flex-col gap-4 mt-4">
        <h3 className="text-xl font-bold text-white flex items-center gap-3">
          <span className="w-3 h-3 rounded-full bg-sky-500" />
          All 14 GD&T Characteristics (Select to View in 3D)
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {filteredSymbols.map((item) => {
            const isSelected = item.id === selectedSymbolId;
            return (
              <button
                key={item.id}
                onClick={() => setSelectedSymbolId(item.id)}
                className={`p-4 rounded-xl border text-left flex flex-col justify-between gap-3 transition-all duration-300 group ${
                  isSelected
                    ? 'bg-sky-500/10 border-sky-500 shadow-lg shadow-sky-500/20 scale-105'
                    : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-lg bg-slate-950/70 border border-slate-800 flex items-center justify-center group-hover:border-sky-400/50 transition">
                    <GdtSymbolSvg
                      name={item.id}
                      size={22}
                      color={isSelected ? '#38bdf8' : '#94a3b8'}
                      strokeWidth={2.4}
                    />
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span
                      className="text-[9px] font-bold px-1.5 py-0.5 rounded uppercase"
                      style={{ backgroundColor: `${item.catColor}20`, color: item.catColor }}
                    >
                      {item.cat}
                    </span>
                    {(item.id === 'flatness' || item.id === 'circularity' || item.id === 'cylindricity') && (
                      <span className="text-[8px] font-mono font-bold px-1.5 py-0.5 rounded uppercase bg-teal-500/20 text-teal-300 border border-teal-500/40">
                        🎥 VIDEO
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-200 group-hover:text-white">{item.name}</h4>
                  <p className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">{item.zone}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
