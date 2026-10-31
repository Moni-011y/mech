import { useState } from 'react';

// ═════════════════════════════════════════════════════════════════
// 1. CHAPTER 9 CORE & WHY TOLERANCE MATTERS
// ═════════════════════════════════════════════════════════════════
export function Chapter9CoreSection() {
  const [basicDim, setBasicDim] = useState<number>(50);
  const [plusTol, setPlusTol] = useState<number>(0.05);
  const [minusTol, setMinusTol] = useState<number>(0.05);

  const maxLimit = basicDim + plusTol;
  const minLimit = basicDim - minusTol;
  const totalTol = maxLimit - minLimit;

  return (
    <div className="space-y-8">
      {/* Chapter Banner */}
      <div className="bg-gradient-to-r from-[#071626] via-[#0d2238] to-[#0a1829] border border-cyan-500/30 rounded-2xl p-6 sm:p-8 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-3">
          <div className="flex items-center gap-2.5">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              BOOK REFERENCE: CHAPTER 09
            </span>
            <span className="text-text-secondary text-xs">•</span>
            <span className="text-text-secondary text-xs font-mono">Mechanical Industrial Engineering</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-text-primary tracking-tight">
            CHAPTER 9 — <span className="text-cyan-400">TOLERANCE ENGINEERING</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed">
            The book defines <strong className="text-cyan-300">tolerance</strong> as the permissible variation in the size/dimension of a manufactured part. It ensures that parts can be manufactured economically while still fitting and functioning correctly.
          </p>
        </div>
      </div>

      {/* 1. Why Tolerance Matters */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="text-cyan-400 font-mono text-sm font-bold">SECTION 1</span>
          <span className="text-text-secondary">|</span>
          <h3 className="text-lg font-black text-text-primary tracking-wide">WHY TOLERANCE MATTERS</h3>
        </div>

        <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
          Without tolerance, manufacturing perfection is impossible. Attempting zero variation causes immediate assembly and cost failure:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[#0b1220] border border-red-500/30 hover:border-red-500/60 transition rounded-xl p-5 space-y-2 relative overflow-hidden group">
            <div className="w-10 h-10 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center justify-center text-xl text-red-400 mb-2">
              🧩
            </div>
            <div className="text-xs font-mono font-bold text-red-400 uppercase tracking-wider">
              1. Parts May Not Fit
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Variations in tooling, thermal expansion, or machine vibration will cause mating shafts to be oversized or holes to be undersized, preventing assembly completely.
            </p>
          </div>

          <div className="bg-[#0b1220] border border-amber-500/30 hover:border-amber-500/60 transition rounded-xl p-5 space-y-2 relative overflow-hidden group">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-xl text-amber-400 mb-2">
              ⚠️
            </div>
            <div className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
              2. Assemblies May Fail
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Improper fit leads to excessive play (causing vibration, rattling, and fatigue) or excessive binding (causing seizure, overheating, and mechanical failure in service).
            </p>
          </div>

          <div className="bg-[#0b1220] border border-emerald-500/30 hover:border-emerald-500/60 transition rounded-xl p-5 space-y-2 relative overflow-hidden group">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-xl text-emerald-400 mb-2">
              📈
            </div>
            <div className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
              3. Manufacturing Cost Increases
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Ultra-tight or unspecified tolerances require specialized grinding, lapping, cleanrooms, and high scrap rates. Realistic tolerances optimize manufacturing economy.
            </p>
          </div>
        </div>
      </div>

      {/* Fundamental Formula & Book Example */}
      <div className="bg-[#08101d] border border-cyan-500/30 rounded-2xl p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-4">
          <div>
            <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-widest">
              FUNDAMENTAL MATHEMATICAL RELATIONSHIP
            </span>
            <h4 className="text-lg font-black text-text-primary mt-1">
              Tolerance = Maximum Limit − Minimum Limit
            </h4>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 font-mono text-xs font-bold">
            T = Upper Limit − Lower Limit
          </div>
        </div>

        {/* Book Example Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-6 bg-surface-elevated/70 border border-border rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-accent font-bold uppercase tracking-wider">
                📖 BOOK WORKED EXAMPLE
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                Chapter 9 Example
              </span>
            </div>

            <div className="p-3.5 rounded-lg bg-black/40 border border-cyan-500/30 font-mono text-center">
              <div className="text-text-secondary text-[11px] mb-1">SPECIFIED DRAWING DIMENSION</div>
              <div className="text-2xl font-black text-cyan-300 tracking-wider">50 ± 0.05 mm</div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div className="bg-surface rounded-lg p-3 border border-border">
                <div className="text-text-secondary text-[10px] mb-1">MAXIMUM SIZE</div>
                <div className="text-sm font-bold text-text-primary">50 + 0.05 = <span className="text-cyan-400">50.05 mm</span></div>
              </div>
              <div className="bg-surface rounded-lg p-3 border border-border">
                <div className="text-text-secondary text-[10px] mb-1">MINIMUM SIZE</div>
                <div className="text-sm font-bold text-text-primary">50 − 0.05 = <span className="text-cyan-400">49.95 mm</span></div>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-between font-mono text-xs">
              <span className="text-text-secondary">Tolerance Calculation:</span>
              <span className="font-bold text-cyan-300">50.05 − 49.95 = <span className="text-accent underline font-black">0.10 mm</span></span>
            </div>
          </div>

          {/* Interactive Sandbox Calculator */}
          <div className="lg:col-span-6 bg-surface border border-border rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-accent font-bold uppercase tracking-wider">
                ⚡ INTERACTIVE TOLERANCE CALCULATOR
              </span>
              <span className="text-[10px] font-mono text-text-secondary">Try custom values</span>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-[10px] font-mono text-text-secondary mb-1">BASIC SIZE (mm)</label>
                <input
                  type="number"
                  step="0.1"
                  value={basicDim}
                  onChange={(e) => setBasicDim(parseFloat(e.target.value) || 0)}
                  className="w-full bg-surface-elevated border border-border rounded-lg px-2.5 py-1.5 text-xs font-mono font-bold text-cyan-300 focus:outline-none focus:border-cyan-400"
                />
              </div>
              <div>
                <label className="block text-[10px] font-mono text-text-secondary mb-1">+ TOL (+mm)</label>
                <input
                  type="number"
                  step="0.01"
                  value={plusTol}
                  onChange={(e) => setPlusTol(Math.abs(parseFloat(e.target.value) || 0))}
                  className="w-full bg-surface-elevated border border-border rounded-lg px-2.5 py-1.5 text-xs font-mono font-bold text-emerald-400 focus:outline-none focus:border-emerald-400"
                />
              </div>
              <div>
                <label className="block text-[10px] font-mono text-text-secondary mb-1">− TOL (−mm)</label>
                <input
                  type="number"
                  step="0.01"
                  value={minusTol}
                  onChange={(e) => setMinusTol(Math.abs(parseFloat(e.target.value) || 0))}
                  className="w-full bg-surface-elevated border border-border rounded-lg px-2.5 py-1.5 text-xs font-mono font-bold text-amber-400 focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            {/* Visual Tolerance Bar */}
            <div className="space-y-1.5 pt-2">
              <div className="flex justify-between text-[10px] font-mono text-text-secondary">
                <span>Lower Limit: {minLimit.toFixed(3)} mm</span>
                <span className="text-cyan-400 font-bold">Nominal: {basicDim.toFixed(3)} mm</span>
                <span>Upper Limit: {maxLimit.toFixed(3)} mm</span>
              </div>
              <div className="h-4 bg-surface-elevated rounded-full overflow-hidden border border-border relative">
                <div className="absolute inset-y-0 bg-gradient-to-r from-amber-500/40 via-cyan-500/50 to-emerald-500/40 w-full" />
                <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-0.5 bg-cyan-400 z-10" />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono pt-1">
              <div className="bg-surface-elevated p-2 rounded border border-border">
                <div className="text-[9px] text-text-secondary">MIN LIMIT</div>
                <div className="text-xs font-bold text-amber-300">{minLimit.toFixed(3)} mm</div>
              </div>
              <div className="bg-surface-elevated p-2 rounded border border-border">
                <div className="text-[9px] text-text-secondary">MAX LIMIT</div>
                <div className="text-xs font-bold text-emerald-300">{maxLimit.toFixed(3)} mm</div>
              </div>
              <div className="bg-cyan-500/10 p-2 rounded border border-cyan-500/30">
                <div className="text-[9px] text-cyan-300 font-bold">TOTAL TOL</div>
                <div className="text-xs font-black text-cyan-400">{totalTol.toFixed(3)} mm</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════
// 2. TYPES OF DIMENSIONAL TOLERANCE
// ═════════════════════════════════════════════════════════════════
export function DimensionalToleranceTypesSection() {
  const [selectedType, setSelectedType] = useState<'bilateral' | 'unilateral' | 'limit'>('bilateral');

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <span className="text-cyan-400 font-mono text-sm font-bold">SECTION 2</span>
        <span className="text-text-secondary">|</span>
        <h3 className="text-lg font-black text-text-primary tracking-wide">
          TYPES OF DIMENSIONAL TOLERANCE
        </h3>
      </div>
      <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
        The book classifies dimensional tolerances into three fundamental types according to how variation is permitted relative to the basic dimension:
      </p>

      {/* Type Selector Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <button
          onClick={() => setSelectedType('bilateral')}
          className={`p-4 rounded-xl border text-left transition flex flex-col justify-between ${
            selectedType === 'bilateral'
              ? 'bg-cyan-500/15 border-cyan-400 shadow-lg shadow-cyan-500/10'
              : 'bg-surface border-border hover:border-accent/40'
          }`}
        >
          <div>
            <div className="text-[10px] font-mono text-cyan-400 font-bold mb-1">TYPE 01</div>
            <div className="text-sm font-bold text-text-primary">Bilateral Tolerance</div>
            <p className="text-[11px] text-text-secondary mt-1">
              Variation allowed in BOTH (+) and (−) directions from basic size.
            </p>
          </div>
          <div className="mt-3 text-xs font-mono text-cyan-300 font-bold">e.g. 50 ± 0.05 mm</div>
        </button>

        <button
          onClick={() => setSelectedType('unilateral')}
          className={`p-4 rounded-xl border text-left transition flex flex-col justify-between ${
            selectedType === 'unilateral'
              ? 'bg-cyan-500/15 border-cyan-400 shadow-lg shadow-cyan-500/10'
              : 'bg-surface border-border hover:border-accent/40'
          }`}
        >
          <div>
            <div className="text-[10px] font-mono text-cyan-400 font-bold mb-1">TYPE 02</div>
            <div className="text-sm font-bold text-text-primary">Unilateral Tolerance</div>
            <p className="text-[11px] text-text-secondary mt-1">
              Variation permitted ONLY in one direction (+ or −).
            </p>
          </div>
          <div className="mt-3 text-xs font-mono text-cyan-300 font-bold">e.g. 50.00 +0.10 / 0</div>
        </button>

        <button
          onClick={() => setSelectedType('limit')}
          className={`p-4 rounded-xl border text-left transition flex flex-col justify-between ${
            selectedType === 'limit'
              ? 'bg-cyan-500/15 border-cyan-400 shadow-lg shadow-cyan-500/10'
              : 'bg-surface border-border hover:border-accent/40'
          }`}
        >
          <div>
            <div className="text-[10px] font-mono text-cyan-400 font-bold mb-1">TYPE 03</div>
            <div className="text-sm font-bold text-text-primary">Limit Tolerance</div>
            <p className="text-[11px] text-text-secondary mt-1">
              Specifies the maximum and minimum permissible limits directly.
            </p>
          </div>
          <div className="mt-3 text-xs font-mono text-cyan-300 font-bold">e.g. 49.95 – 50.05 mm</div>
        </button>
      </div>

      {/* Detailed Type Panels */}
      {selectedType === 'bilateral' && (
        <div className="bg-[#09111e] border border-cyan-500/30 rounded-2xl p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/60 pb-3">
            <div>
              <span className="text-[10px] font-mono text-cyan-400 font-bold">TYPE A</span>
              <h4 className="text-xl font-bold text-text-primary">Bilateral Tolerance</h4>
            </div>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full self-start sm:self-auto">
              Most Common Industrial Standard
            </span>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            In bilateral tolerancing, variation is allowed in <strong className="text-cyan-300">both positive (+) and negative (−) directions</strong> from the basic dimension.
          </p>

          {/* Book Distinction: Equal vs Unequal */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-surface p-4 rounded-xl border border-cyan-500/20 space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
                <span className="text-xs font-mono font-bold text-cyan-300">BILATERAL – EQUAL</span>
              </div>
              <p className="text-xs text-text-secondary">
                Equal variation allowed on both positive and negative sides of the basic dimension.
              </p>
              <div className="p-2.5 rounded bg-black/40 font-mono text-center text-sm font-bold text-cyan-200 border border-cyan-500/20">
                50 ± 0.05 mm
              </div>
              <div className="text-[11px] font-mono text-text-secondary flex justify-between pt-1">
                <span>Basic: 50 mm</span>
                <span>Max: 50.05 mm</span>
                <span>Min: 49.95 mm</span>
              </div>
            </div>

            <div className="bg-surface p-4 rounded-xl border border-cyan-500/20 space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
                <span className="text-xs font-mono font-bold text-cyan-300">BILATERAL – UNEQUAL</span>
              </div>
              <p className="text-xs text-text-secondary">
                Different permissible variation on each side of the basic dimension.
              </p>
              <div className="p-2.5 rounded bg-black/40 font-mono text-center text-sm font-bold text-cyan-200 border border-cyan-500/20">
                50.00 +0.08 / −0.02 mm
              </div>
              <div className="text-[11px] font-mono text-text-secondary flex justify-between pt-1">
                <span>Basic: 50 mm</span>
                <span>Max: 50.08 mm</span>
                <span>Min: 49.98 mm</span>
              </div>
            </div>
          </div>

          {/* Applications Mentioned in the Book */}
          <div className="space-y-2">
            <span className="text-xs font-mono font-bold text-accent uppercase tracking-wider block">
              🏭 INDUSTRIAL APPLICATIONS CITED IN THE BOOK:
            </span>
            <div className="flex flex-wrap gap-2">
              {['Shafts', 'Bushes', 'General Machining', 'CNC Components', 'Automotive Parts'].map((app) => (
                <span key={app} className="px-3 py-1.5 rounded-lg bg-surface-elevated border border-border text-xs font-mono text-slate-200 flex items-center gap-1.5">
                  <span className="text-cyan-400">✓</span> {app}
                </span>
              ))}
            </div>
          </div>

          {/* Advantages Listed in the Book */}
          <div className="space-y-2">
            <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider block">
              ⭐ KEY ADVANTAGES CITED IN THE BOOK:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-surface p-3 rounded-lg border border-emerald-500/20 text-center">
                <div className="text-base mb-1">⚙️</div>
                <div className="text-xs font-bold text-emerald-300">Easy to Manufacture</div>
                <div className="text-[10px] text-text-secondary mt-0.5">Provides machinist with two-sided buffer</div>
              </div>
              <div className="bg-surface p-3 rounded-lg border border-emerald-500/20 text-center">
                <div className="text-base mb-1">🔍</div>
                <div className="text-xs font-bold text-emerald-300">Easy to Inspect</div>
                <div className="text-[10px] text-text-secondary mt-0.5">Symmetric tolerance band easy to gauge</div>
              </div>
              <div className="bg-surface p-3 rounded-lg border border-emerald-500/20 text-center">
                <div className="text-base mb-1">⚖️</div>
                <div className="text-xs font-bold text-emerald-300">Balanced Machining Allowance</div>
                <div className="text-[10px] text-text-secondary mt-0.5">Targets mean dimension safely</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedType === 'unilateral' && (
        <div className="bg-[#09111e] border border-cyan-500/30 rounded-2xl p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/60 pb-3">
            <div>
              <span className="text-[10px] font-mono text-cyan-400 font-bold">TYPE B</span>
              <h4 className="text-xl font-bold text-text-primary">Unilateral Tolerance</h4>
            </div>
            <span className="text-xs font-mono text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-full self-start sm:self-auto">
              One-Direction Variation
            </span>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Variation is permitted <strong className="text-cyan-300">only in one direction</strong>, either positive or negative from the basic size. The other deviation is zero.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-surface p-4 rounded-xl border border-border space-y-2">
              <div className="text-xs font-mono font-bold text-emerald-400">POSITIVE UNILATERAL (BOOK EXAMPLE)</div>
              <p className="text-xs text-text-secondary">
                Permitted variation lies completely in the positive direction above nominal size.
              </p>
              <div className="p-3 rounded bg-black/40 font-mono text-center text-lg font-bold text-emerald-300 border border-emerald-500/30">
                50.00 +0.10 / 0
              </div>
              <div className="text-xs font-mono text-text-secondary space-y-1 pt-1">
                <div>• Maximum Limit = <span className="text-emerald-400 font-bold">50.10 mm</span></div>
                <div>• Minimum Limit = <span className="text-emerald-400 font-bold">50.00 mm</span></div>
                <div>• Total Tolerance = <span className="text-cyan-300 font-bold">0.10 mm</span></div>
              </div>
            </div>

            <div className="bg-surface p-4 rounded-xl border border-border space-y-2">
              <div className="text-xs font-mono font-bold text-amber-400">NEGATIVE UNILATERAL (BOOK EXAMPLE)</div>
              <p className="text-xs text-text-secondary">
                Variation permitted only in the negative direction below nominal size.
              </p>
              <div className="p-3 rounded bg-black/40 font-mono text-center text-lg font-bold text-amber-300 border border-amber-500/30">
                50.00 0 / −0.10
              </div>
              <div className="text-xs font-mono text-text-secondary space-y-1 pt-1">
                <div>• Maximum Limit = <span className="text-amber-400 font-bold">50.00 mm</span></div>
                <div>• Minimum Limit = <span className="text-amber-400 font-bold">49.90 mm</span></div>
                <div>• Total Tolerance = <span className="text-cyan-300 font-bold">0.10 mm</span></div>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-xs font-mono text-slate-300 space-y-1">
            <span className="text-cyan-400 font-bold">💡 WHEN TO USE UNILATERAL TOLERANCES:</span>
            <p className="text-[11px] text-text-secondary leading-relaxed font-sans">
              Frequently applied to mating holes or shafts produced by fixed-size cutting tools (drills, reamers, broaches) where tooling wear or standard tool sizing dictates tolerance in only one direction to prevent interference.
            </p>
          </div>
        </div>
      )}

      {selectedType === 'limit' && (
        <div className="bg-[#09111e] border border-cyan-500/30 rounded-2xl p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/60 pb-3">
            <div>
              <span className="text-[10px] font-mono text-cyan-400 font-bold">TYPE C</span>
              <h4 className="text-xl font-bold text-text-primary">Limit Tolerance</h4>
            </div>
            <span className="text-xs font-mono text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2.5 py-1 rounded-full self-start sm:self-auto">
              Direct Limit Values
            </span>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            In limit tolerancing, the drawing <strong className="text-cyan-300">specifies the lower and upper limits directly</strong>. The machinist or quality inspector does not need to perform addition or subtraction to determine permissible boundaries.
          </p>

          <div className="bg-surface p-5 rounded-xl border border-cyan-500/30 space-y-4">
            <span className="text-xs font-mono font-bold text-accent">📖 BOOK EXAMPLE SPECIFICATION</span>
            <div className="p-4 rounded bg-black/40 font-mono text-center text-xl sm:text-2xl font-bold text-cyan-300 border border-cyan-500/40">
              49.95 – 50.05 mm
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center text-xs font-mono">
              <div className="bg-surface-elevated p-3 rounded-lg border border-border">
                <div className="text-text-secondary text-[10px]">LOWER LIMIT</div>
                <div className="text-base font-bold text-amber-400">49.95 mm</div>
              </div>
              <div className="bg-surface-elevated p-3 rounded-lg border border-border">
                <div className="text-text-secondary text-[10px]">UPPER LIMIT</div>
                <div className="text-base font-bold text-emerald-400">50.05 mm</div>
              </div>
              <div className="bg-surface-elevated p-3 rounded-lg border border-cyan-500/30">
                <div className="text-cyan-300 text-[10px]">TOLERANCE</div>
                <div className="text-base font-bold text-cyan-400">0.10 mm</div>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-surface border border-border text-xs text-text-secondary space-y-1">
            <span className="font-bold text-slate-200">Shop Floor Advantage:</span>
            <p className="text-[11px] leading-relaxed">
              Eliminates operator calculation errors on the production line. Go / No-Go limit plug or snap gauges are set directly to the numbers printed on the drawing.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════
// 3. DIMENSIONAL TOLERANCE VS GEOMETRIC TOLERANCE (GD&T)
// ═════════════════════════════════════════════════════════════════
export function DimVsGeomSection() {
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-2">
        <span className="text-cyan-400 font-mono text-sm font-bold">SECTION 3</span>
        <span className="text-text-secondary">|</span>
        <h3 className="text-lg font-black text-text-primary tracking-wide">
          DIMENSIONAL TOLERANCE VS GEOMETRIC TOLERANCE
        </h3>
      </div>

      <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
        The book clearly separates engineering tolerances into two complementary domains: <strong className="text-text-primary">dimensional tolerance</strong> and <strong className="text-text-primary">geometric tolerance</strong>.
      </p>

      {/* Comparison Matrix Table matching Book */}
      <div className="overflow-x-auto rounded-2xl border border-border shadow-xl">
        <table className="w-full text-left border-collapse text-xs sm:text-sm">
          <thead>
            <tr className="bg-[#0b1728] border-b border-border font-mono text-[11px] uppercase tracking-wider">
              <th className="p-4 text-cyan-400 font-bold w-1/4">Aspect / Parameter</th>
              <th className="p-4 text-emerald-400 font-bold w-3/8 border-l border-border">Dimensional Tolerance</th>
              <th className="p-4 text-indigo-400 font-bold w-3/8 border-l border-border">Geometric Tolerance (GD&T)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60 bg-surface">
            <tr className="hover:bg-surface-elevated/40 transition">
              <td className="p-4 font-mono font-bold text-text-primary">Core Purpose</td>
              <td className="p-4 text-slate-200 border-l border-border">
                <span className="font-semibold text-emerald-400">Controls size</span>
              </td>
              <td className="p-4 text-slate-200 border-l border-border">
                <span className="font-semibold text-indigo-400">Controls shape, orientation, location, and geometry</span>
              </td>
            </tr>
            <tr className="hover:bg-surface-elevated/40 transition">
              <td className="p-4 font-mono font-bold text-text-primary">Drawing Callout Example</td>
              <td className="p-4 font-mono text-emerald-300 font-bold border-l border-border">
                Ø25 ± 0.02 mm
              </td>
              <td className="p-4 font-mono text-indigo-300 font-bold border-l border-border">
                ⌖ ⌀0.05 | A | B | C
              </td>
            </tr>
            <tr className="hover:bg-surface-elevated/40 transition">
              <td className="p-4 font-mono font-bold text-text-primary">Variation Controlled</td>
              <td className="p-4 text-slate-200 border-l border-border">Controls size variation</td>
              <td className="p-4 text-slate-200 border-l border-border">Controls geometric variation</td>
            </tr>
            <tr className="hover:bg-surface-elevated/40 transition">
              <td className="p-4 font-mono font-bold text-text-primary">Features Applied To</td>
              <td className="p-4 text-slate-200 border-l border-border">Used for length, diameter, thickness</td>
              <td className="p-4 text-slate-200 border-l border-border">Used for flatness, position, perpendicularity, circularity, etc.</td>
            </tr>
            <tr className="hover:bg-surface-elevated/40 transition">
              <td className="p-4 font-mono font-bold text-text-primary">Symbology Required</td>
              <td className="p-4 text-slate-200 border-l border-border">Generally does not require GD&T symbols</td>
              <td className="p-4 text-slate-200 border-l border-border">Uses standard GD&T symbols & feature control frames</td>
            </tr>
            <tr className="hover:bg-surface-elevated/40 transition">
              <td className="p-4 font-mono font-bold text-text-primary">Datum Requirement</td>
              <td className="p-4 text-slate-200 border-l border-border">Usually no datum required</td>
              <td className="p-4 text-slate-200 border-l border-border">Often uses datums (reference features A, B, C)</td>
            </tr>
            <tr className="hover:bg-surface-elevated/40 transition">
              <td className="p-4 font-mono font-bold text-text-primary">Metrology & Inspection</td>
              <td className="p-4 text-slate-200 border-l border-border font-mono text-xs">
                Vernier caliper, outside micrometer, bore gauge, depth micrometer
              </td>
              <td className="p-4 text-slate-200 border-l border-border font-mono text-xs">
                Coordinate Measuring Machine (CMM), height gauge, surface plate, dial test indicators
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Section 4: Important GD&T Connection Callout */}
      <div className="bg-[#0b1525] border border-indigo-500/40 rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-2">
          <span className="text-indigo-400 font-mono text-sm font-bold">SECTION 4</span>
          <span className="text-text-secondary">|</span>
          <h4 className="text-lg font-black text-text-primary tracking-wide">
            IMPORTANT GD&T CONNECTION
          </h4>
        </div>

        <blockquote className="border-l-4 border-indigo-500 pl-4 py-1 text-sm sm:text-base font-medium text-slate-200 italic">
          "A component can have the correct size but still fail to function because its <strong className="text-indigo-300">geometry or position is incorrect</strong>."
        </blockquote>

        <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
          The book explains that geometric tolerance controls the <strong className="text-text-primary">geometry, form, orientation, location, and runout</strong> of a feature. It is commonly designated as <strong className="text-indigo-400">GD&T — Geometric Dimensioning and Tolerancing</strong>.
        </p>

        {/* Visual Paradox Demonstration */}
        <div className="bg-surface-elevated/80 border border-border rounded-xl p-5 space-y-3">
          <div className="text-xs font-mono font-bold text-accent uppercase tracking-wider">
            ⚠️ THE "PASSING SIZE, FAILING PART" PARADOX
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
            <div className="bg-surface p-3.5 rounded-lg border border-emerald-500/30 space-y-1">
              <div className="text-emerald-400 font-bold">✅ 2-POINT MICROMETER CHECK: PASS</div>
              <p className="text-[11px] text-text-secondary font-sans leading-relaxed">
                A bent pin measures exactly Ø25.00 mm with an outside micrometer at every single cross-section. It passes dimensional tolerance completely!
              </p>
            </div>
            <div className="bg-surface p-3.5 rounded-lg border border-red-500/30 space-y-1">
              <div className="text-red-400 font-bold">❌ FUNCTIONAL ASSEMBLY: FAIL</div>
              <p className="text-[11px] text-text-secondary font-sans leading-relaxed">
                Because its axis is bowed by 0.20 mm (violating straightness/cylindricity), the pin jams and cannot enter a straight Ø25.02 mm reamed hole!
              </p>
            </div>
          </div>
        </div>

        {/* The 5 Geometric Controls from Book */}
        <div className="space-y-2 pt-2">
          <span className="text-[11px] font-mono text-indigo-300 uppercase tracking-wider block font-bold">
            THE 5 GEOMETRIC TOLERANCE FAMILIES:
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs font-mono">
            <div className="bg-surface p-2.5 rounded-lg border border-border">
              <div className="text-accent font-bold">FORM</div>
              <div className="text-[10px] text-text-secondary">Flat, Straight, Circ, Cyl</div>
            </div>
            <div className="bg-surface p-2.5 rounded-lg border border-border">
              <div className="text-accent font-bold">ORIENTATION</div>
              <div className="text-[10px] text-text-secondary">Perp, Parallel, Angular</div>
            </div>
            <div className="bg-surface p-2.5 rounded-lg border border-border">
              <div className="text-accent font-bold">LOCATION</div>
              <div className="text-[10px] text-text-secondary">Position, Concentricity</div>
            </div>
            <div className="bg-surface p-2.5 rounded-lg border border-border">
              <div className="text-accent font-bold">RUNOUT</div>
              <div className="text-[10px] text-text-secondary">Circular, Total Runout</div>
            </div>
            <div className="bg-surface p-2.5 rounded-lg border border-border">
              <div className="text-accent font-bold">PROFILE</div>
              <div className="text-[10px] text-text-secondary">Line & Surface Profile</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════
// 4. GENERAL TOLERANCE & TITLE BLOCK
// ═════════════════════════════════════════════════════════════════
export function GeneralToleranceSection() {
  const [testDim, setTestDim] = useState<number>(45);

  const getGeneralTol = (val: number) => {
    if (val > 0 && val <= 30) return 0.1;
    if (val > 30 && val <= 100) return 0.2;
    if (val > 100 && val <= 300) return 0.3;
    return 0.5;
  };

  const tol = getGeneralTol(testDim);
  const upper = testDim + tol;
  const lower = testDim - tol;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <span className="text-cyan-400 font-mono text-sm font-bold">SECTION 5</span>
        <span className="text-text-secondary">|</span>
        <h3 className="text-lg font-black text-text-primary tracking-wide">
          GENERAL TOLERANCE (TITLE BLOCK STANDARD)
        </h3>
      </div>

      <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
        The book notes that dimensions without explicit individual tolerances fall under <strong className="text-text-primary">General Tolerances</strong> specified in the drawing title block. The actual tolerance scheme should be based on the specified standard (e.g. ISO 2768) and company practice.
      </p>

      {/* Book General Tolerance Table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 bg-surface border border-border rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-accent uppercase tracking-wider">
              📋 BOOK DRAWING / TITLE BLOCK GENERAL TOLERANCE TABLE
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              Drawing Standard
            </span>
          </div>

          <div className="overflow-hidden rounded-xl border border-border">
            <table className="w-full text-left font-mono text-xs">
              <thead className="bg-[#0c1829] text-text-secondary border-b border-border">
                <tr>
                  <th className="p-3">DIMENSION RANGE</th>
                  <th className="p-3 text-right">GENERAL TOLERANCE</th>
                  <th className="p-3 text-right">EXAMPLE (MIDPOINT)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                <tr className={`transition ${testDim > 0 && testDim <= 30 ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'hover:bg-surface-elevated'}`}>
                  <td className="p-3">0 to 30 mm</td>
                  <td className="p-3 text-right font-bold text-emerald-400">±0.1 mm</td>
                  <td className="p-3 text-right text-text-secondary">15 ± 0.1 mm</td>
                </tr>
                <tr className={`transition ${testDim > 30 && testDim <= 100 ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'hover:bg-surface-elevated'}`}>
                  <td className="p-3">30 to 100 mm</td>
                  <td className="p-3 text-right font-bold text-cyan-400">±0.2 mm</td>
                  <td className="p-3 text-right text-text-secondary">50 ± 0.2 mm</td>
                </tr>
                <tr className={`transition ${testDim > 100 && testDim <= 300 ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'hover:bg-surface-elevated'}`}>
                  <td className="p-3">100 to 300 mm</td>
                  <td className="p-3 text-right font-bold text-amber-400">±0.3 mm</td>
                  <td className="p-3 text-right text-text-secondary">200 ± 0.3 mm</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="text-[11px] font-mono text-text-secondary/70 italic">
            * Note: For dimensions exceeding 300 mm, reference ISO 2768-m or ASME drawing block standards.
          </p>
        </div>

        {/* Interactive Title Block Dimension Tester */}
        <div className="lg:col-span-5 bg-[#09111e] border border-cyan-500/30 rounded-2xl p-5 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
              🔍 TITLE BLOCK TOLERANCE LOOKUP
            </div>
            <p className="text-xs text-text-secondary">
              Enter any drawing dimension to see how the title block general tolerance governs it:
            </p>

            <div>
              <label className="block text-[10px] font-mono text-text-secondary mb-1">
                UNSPECIFIED DIMENSION VALUE (mm)
              </label>
              <input
                type="number"
                min={1}
                max={300}
                step={1}
                value={testDim}
                onChange={(e) => setTestDim(parseFloat(e.target.value) || 0)}
                className="w-full bg-surface-elevated border border-border rounded-lg px-3 py-2 text-sm font-mono font-bold text-cyan-300 focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-black/40 border border-cyan-500/20 space-y-2 font-mono text-xs">
            <div className="flex justify-between text-text-secondary">
              <span>Applied General Tol:</span>
              <span className="text-cyan-400 font-bold">±{tol.toFixed(1)} mm</span>
            </div>
            <div className="flex justify-between text-text-secondary">
              <span>Permissible Range:</span>
              <span className="text-emerald-400 font-bold">{lower.toFixed(2)} — {upper.toFixed(2)} mm</span>
            </div>
            <div className="flex justify-between text-text-secondary">
              <span>Title Block Callout:</span>
              <span className="text-cyan-300 font-bold">{testDim} ± {tol.toFixed(1)} mm</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════
// 5. KEY POINTS TO REMEMBER & DESIGN-ENGINEER CHECKLIST
// ═════════════════════════════════════════════════════════════════
export function ChecklistAndSummarySection() {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({
    'tolerances-checked': true,
    'manufacturing-economy': false,
    'interchangeability': false,
    'gdt-geometry': false,
    'inspection-metrology': false,
  });

  const toggleCheck = (id: string) => {
    setCheckedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-8">
      {/* 6. Key Points to Remember */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="text-cyan-400 font-mono text-sm font-bold">SECTION 6</span>
          <span className="text-text-secondary">|</span>
          <h3 className="text-lg font-black text-text-primary tracking-wide">
            KEY POINTS TO REMEMBER
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 font-mono text-xs">
          <div className="bg-surface p-4 rounded-xl border border-cyan-500/20 space-y-1">
            <div className="text-cyan-400 font-bold text-sm">Tolerance → Permissible Variation</div>
            <p className="text-[11px] text-text-secondary font-sans leading-relaxed">
              Permissible variation in the size/dimension of a manufactured component.
            </p>
          </div>

          <div className="bg-surface p-4 rounded-xl border border-cyan-500/20 space-y-1">
            <div className="text-cyan-400 font-bold text-sm">Tolerance Formula</div>
            <p className="text-[11px] text-text-secondary font-sans leading-relaxed">
              <strong>Tolerance = Maximum Limit − Minimum Limit</strong>
            </p>
          </div>

          <div className="bg-surface p-4 rounded-xl border border-cyan-500/20 space-y-1">
            <div className="text-cyan-400 font-bold text-sm">3 Main Dimensional Types</div>
            <p className="text-[11px] text-text-secondary font-sans leading-relaxed">
              1. Bilateral &nbsp; 2. Unilateral &nbsp; 3. Limit Tolerance
            </p>
          </div>

          <div className="bg-surface p-4 rounded-xl border border-emerald-500/20 space-y-1">
            <div className="text-emerald-400 font-bold text-sm">Dimensional Tolerance</div>
            <p className="text-[11px] text-text-secondary font-sans leading-relaxed">
              Controls component size, length, diameter, and thickness.
            </p>
          </div>

          <div className="bg-surface p-4 rounded-xl border border-indigo-500/20 space-y-1">
            <div className="text-indigo-400 font-bold text-sm">Geometric Tolerance (GD&T)</div>
            <p className="text-[11px] text-text-secondary font-sans leading-relaxed">
              Controls shape, orientation, location, and runout geometry.
            </p>
          </div>

          <div className="bg-surface p-4 rounded-xl border border-amber-500/20 space-y-1">
            <div className="text-amber-400 font-bold text-sm">Interchangeability</div>
            <p className="text-[11px] text-text-secondary font-sans leading-relaxed">
              Guarantees any random part fits into any random assembly without rework.
            </p>
          </div>
        </div>
      </div>

      {/* 5 Interconnected Engineering Pillars */}
      <div className="bg-[#08111e] border border-cyan-500/30 rounded-2xl p-6 space-y-4">
        <h4 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest">
          INTERCONNECTED DOMAINS OF TOLERANCE ENGINEERING
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center font-mono text-xs">
          {[
            { name: 'GD&T', icon: '📐', desc: 'Geometry control' },
            { name: 'Manufacturing', icon: '🏭', desc: 'Process capability' },
            { name: 'Inspection', icon: '🔬', desc: 'Metrology & CMM' },
            { name: 'Interchangeability', icon: '🔄', desc: 'Mass assembly' },
            { name: 'Eng. Drawings', icon: '📜', desc: 'Unambiguous prints' },
          ].map((item) => (
            <div key={item.name} className="bg-surface p-3 rounded-xl border border-border">
              <div className="text-xl mb-1">{item.icon}</div>
              <div className="font-bold text-text-primary">{item.name}</div>
              <div className="text-[10px] text-text-secondary mt-0.5">{item.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Design-Engineer Checklist */}
      <div className="bg-surface border border-border rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono text-accent uppercase tracking-widest font-bold">
              FINAL STAGE QUALITY GATE
            </span>
            <h4 className="text-lg font-black text-text-primary mt-1">
              DESIGN-ENGINEER VERIFICATION CHECKLIST
            </h4>
          </div>
          <span className="text-xs font-mono text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-3 py-1 rounded-full">
            Book Chapter 9 Final Gate
          </span>
        </div>

        <p className="text-xs text-text-secondary">
          The book's final design-engineer checklist specifically mandates that tolerances must be systematically reviewed before releasing drawings to production:
        </p>

        <div className="space-y-3 font-mono text-xs">
          {[
            {
              id: 'tolerances-checked',
              title: '“TOLERANCES CHECKED” (MANDATORY IN BOOK CHECKLIST)',
              desc: 'Every critical dimension has explicit limits; unspecified dimensions are bounded by the general tolerance title block.',
              critical: true,
            },
            {
              id: 'manufacturing-economy',
              title: 'Manufacturing Economy & Process Capability',
              desc: 'Tolerances are realistic for chosen machinery (CNC turning, milling, grinding) without causing excessive scrap or cost spikes.',
              critical: false,
            },
            {
              id: 'interchangeability',
              title: 'Interchangeability & Assembly Fit Guaranteed',
              desc: 'Shaft and hole clearance/interference limits verified under worst-case condition (MMC / LMC).',
              critical: false,
            },
            {
              id: 'gdt-geometry',
              title: 'GD&T Geometric Controls Complete',
              desc: 'Features whose functionality depends on form, orientation, location, or runout have appropriate feature control frames.',
              critical: false,
            },
            {
              id: 'inspection-metrology',
              title: 'Inspection & Gauging Feasibility',
              desc: 'Calipers, micrometers, CMM probes, or functional go/no-go gauges can physically access and measure each tolerance zone.',
              critical: false,
            },
          ].map((item) => (
            <div
              key={item.id}
              onClick={() => toggleCheck(item.id)}
              className={`p-4 rounded-xl border transition cursor-pointer flex items-start gap-3.5 ${
                checkedItems[item.id]
                  ? item.critical
                    ? 'bg-cyan-500/15 border-cyan-400 text-text-primary'
                    : 'bg-emerald-500/15 border-emerald-400 text-text-primary'
                  : 'bg-surface-elevated border-border text-text-secondary hover:border-accent/40'
              }`}
            >
              <div
                className={`w-5 h-5 rounded flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 border ${
                  checkedItems[item.id]
                    ? item.critical
                      ? 'bg-cyan-400 text-slate-950 border-cyan-400'
                      : 'bg-emerald-400 text-slate-950 border-emerald-400'
                    : 'bg-surface border-border text-transparent'
                }`}
              >
                ✓
              </div>
              <div className="space-y-1">
                <div className={`font-bold ${checkedItems[item.id] ? (item.critical ? 'text-cyan-300' : 'text-emerald-300') : 'text-text-primary'}`}>
                  {item.title}
                </div>
                <div className="text-[11px] font-sans text-slate-300 leading-relaxed">
                  {item.desc}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
