import React, { useState, useMemo } from 'react';
import GdtSymbolSvg from './GdtSymbolSvg';
import CadFeatureControlFrame from './CadFeatureControlFrame';
import Gdt3dSymbolCanvas from './Gdt3dSymbolCanvas';
import {
  GDT_SYMBOLS_DATA,
  GDT_CATEGORIES_METADATA,
  type GdtSymbolCardData,
  type GdtCategory,
} from './gdtData';

export const GdtCardsSection: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<GdtCategory | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSymbol, setExpandedSymbol] = useState<GdtSymbolCardData | null>(null);
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);

  // Filtered symbols
  const filteredSymbols = useMemo(() => {
    return GDT_SYMBOLS_DATA.filter((sym) => {
      const matchesCat = selectedCategory === 'ALL' || sym.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        sym.name.toLowerCase().includes(q) ||
        sym.whatItControls.toLowerCase().includes(q) ||
        sym.categoryLabel.toLowerCase().includes(q) ||
        sym.typicalApplication.some((app) => app.toLowerCase().includes(q));
      return matchesCat && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  // Group by category for visually separated layout
  const categoriesList: GdtCategory[] = ['FORM', 'PROFILE', 'ORIENTATION', 'LOCATION', 'RUNOUT'];

  return (
    <section className="w-full flex flex-col gap-10">
      {/* ── SECTION HEADER & BLUEPRINT BANNER ── */}
      <div className="relative rounded-2xl border border-sky-500/30 bg-[#060b16] p-6 sm:p-8 overflow-hidden shadow-2xl">
        {/* Engineering CAD Grid Background Pattern */}
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(rgba(56, 189, 248, 0.15) 1px, transparent 1px),
              linear-gradient(90deg, rgba(56, 189, 248, 0.15) 1px, transparent 1px)
            `,
            backgroundSize: '24px 24px',
          }}
        />

        {/* Blueprint Corner Registration Marks */}
        <div className="absolute top-2 left-2 text-[10px] font-mono text-sky-400/50">+ [0,0]</div>
        <div className="absolute top-2 right-2 text-[10px] font-mono text-sky-400/50">[CAD_REF] +</div>
        <div className="absolute bottom-2 left-2 text-[10px] font-mono text-sky-400/50">+ ASME Y14.5</div>
        <div className="absolute bottom-2 right-2 text-[10px] font-mono text-sky-400/50">ISO 1101 +</div>

        {/* Glowing blueprint gradient orb */}
        <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-sky-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-950/80 border border-sky-400/40 text-sky-300 text-xs font-mono font-bold tracking-wider">
              <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping" />
              SECTION 14 · INTERACTIVE GD&T SYMBOL MATRIX
            </div>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white font-mono">
              ENGINEERING GD&T <span className="text-sky-400">CHARACTERISTICS</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Explore all 14 standard Geometric Dimensioning & Tolerancing symbols formatted as CAD engineering cards.
              Each card features vector linework, ASME/ISO definitions, controls, tolerance examples, datum rules, and live Feature Control Frames.
            </p>
          </div>

          {/* Quick Stats Pill Counters */}
          <div className="grid grid-cols-3 gap-3 self-stretch lg:self-auto shrink-0 font-mono">
            <div className="bg-slate-900/90 border border-sky-500/30 rounded-xl p-3 text-center">
              <span className="block text-2xl font-black text-sky-400">14</span>
              <span className="text-[10px] text-slate-400 uppercase tracking-widest">Symbols</span>
            </div>
            <div className="bg-slate-900/90 border border-teal-500/30 rounded-xl p-3 text-center">
              <span className="block text-2xl font-black text-teal-400">5</span>
              <span className="text-[10px] text-slate-400 uppercase tracking-widest">Categories</span>
            </div>
            <div className="bg-slate-900/90 border border-amber-500/30 rounded-xl p-3 text-center">
              <span className="block text-2xl font-black text-amber-400">3D</span>
              <span className="text-[10px] text-slate-400 uppercase tracking-widest">Interactive</span>
            </div>
          </div>
        </div>

        {/* Controls Bar: Category Filters & Search */}
        <div className="relative z-10 mt-6 pt-6 border-t border-slate-800 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 font-mono">
            <button
              onClick={() => setSelectedCategory('ALL')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                selectedCategory === 'ALL'
                  ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/30 ring-1 ring-sky-300'
                  : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              <span>ALL</span>
              <span className="text-[10px] opacity-70">(14)</span>
            </button>

            {categoriesList.map((catKey) => {
              const meta = GDT_CATEGORIES_METADATA[catKey];
              const count = GDT_SYMBOLS_DATA.filter((s) => s.category === catKey).length;
              const isSelected = selectedCategory === catKey;
              return (
                <button
                  key={catKey}
                  onClick={() => setSelectedCategory(catKey)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 border ${
                    isSelected
                      ? 'shadow-lg ring-1'
                      : 'bg-slate-900 text-slate-400 hover:text-white border-slate-800 hover:border-slate-700'
                  }`}
                  style={{
                    backgroundColor: isSelected ? `${meta.color}25` : undefined,
                    borderColor: isSelected ? meta.color : undefined,
                    color: isSelected ? meta.color : undefined,
                  }}
                >
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: meta.color }} />
                  <span>{meta.name.replace(' Controls', '')}</span>
                  <span className="text-[10px] opacity-75">({count})</span>
                </button>
              );
            })}
          </div>

          {/* Search Input Box */}
          <div className="relative w-full md:w-64 shrink-0 font-mono">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search symbol, control, or application..."
              className="w-full bg-slate-950/80 border border-slate-800 focus:border-sky-400 focus:ring-1 focus:ring-sky-400 rounded-lg px-3.5 py-1.5 text-xs text-white placeholder-slate-500 outline-none transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1.5 text-xs text-slate-400 hover:text-white"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── VISUALLY SEPARATED CATEGORIES CONTAINER ── */}
      <div className="space-y-12">
        {categoriesList.map((catKey) => {
          const categoryMeta = GDT_CATEGORIES_METADATA[catKey];
          const symbolsInCat = filteredSymbols.filter((s) => s.category === catKey);

          // If filtering and this category has no items matching, hide it
          if (symbolsInCat.length === 0) return null;

          return (
            <div key={catKey} className="space-y-4">
              {/* Category Header with Engineering Title Block */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b-2 border-slate-800 gap-2">
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center font-black font-mono text-sm border"
                    style={{
                      backgroundColor: `${categoryMeta.color}15`,
                      borderColor: `${categoryMeta.color}40`,
                      color: categoryMeta.color,
                    }}
                  >
                    0{categoryMeta.code === 'FORM' ? 1 : categoryMeta.code === 'PROFILE' ? 2 : categoryMeta.code === 'ORIENTATION' ? 3 : categoryMeta.code === 'LOCATION' ? 4 : 5}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-black text-white uppercase tracking-wider font-mono">
                        {categoryMeta.name}
                      </h3>
                      <span
                        className="text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase"
                        style={{
                          backgroundColor: `${categoryMeta.color}15`,
                          color: categoryMeta.color,
                          border: `1px solid ${categoryMeta.color}30`,
                        }}
                      >
                        {symbolsInCat.length} {symbolsInCat.length === 1 ? 'Symbol' : 'Symbols'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">{categoryMeta.description}</p>
                  </div>
                </div>

                {/* Datum rule reminder pill */}
                <div className="self-start sm:self-auto text-[11px] font-mono px-3 py-1 rounded bg-slate-900 border border-slate-800 text-slate-400">
                  <span className="text-slate-500 mr-1.5">Rule:</span>
                  <span className="text-slate-300 font-semibold">{categoryMeta.requiresDatumSummary}</span>
                </div>
              </div>

              {/* Engineering Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-5">
                {symbolsInCat.map((item) => {
                  const isHovered = hoveredCardId === item.id;
                  return (
                    <div
                      key={item.id}
                      onMouseEnter={() => setHoveredCardId(item.id)}
                      onMouseLeave={() => setHoveredCardId(null)}
                      className={`relative bg-gradient-to-b from-[#0a101f] to-[#050811] rounded-2xl border transition-all duration-300 flex flex-col justify-between overflow-hidden group shadow-xl ${
                        isHovered ? 'scale-[1.02] shadow-2xl' : ''
                      }`}
                      style={{
                        borderColor: isHovered ? categoryMeta.color : '#1e293b',
                        boxShadow: isHovered ? `0 10px 30px -10px ${categoryMeta.accentGlow}` : undefined,
                      }}
                    >
                      {/* Top CAD Reticle & Corner Accents */}
                      <div className="absolute top-2 right-2 flex items-center gap-1 font-mono text-[9px] text-slate-600 group-hover:text-slate-400 transition">
                        <span>#0{item.symbolNumber}</span>
                      </div>

                      {/* Card Content Top Body */}
                      <div className="p-5 space-y-4">
                        {/* Symbol Header Bezel */}
                        <div className="flex items-start gap-3.5">
                          {/* CAD Bezel Icon Container */}
                          <div
                            className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0 border-2 transition-transform duration-300 group-hover:rotate-3 shadow-inner relative overflow-hidden"
                            style={{
                              backgroundColor: `${categoryMeta.color}10`,
                              borderColor: `${categoryMeta.color}50`,
                            }}
                          >
                            {/* Subtle inner grid in symbol bezel */}
                            <div
                              className="absolute inset-0 opacity-15"
                              style={{
                                backgroundImage: `radial-gradient(${categoryMeta.color} 1px, transparent 1px)`,
                                backgroundSize: '6px 6px',
                              }}
                            />
                            <GdtSymbolSvg
                              name={item.svgName}
                              size={32}
                              color={categoryMeta.color}
                              strokeWidth={2.4}
                              className="transition-transform duration-300 group-hover:scale-110 relative z-10"
                            />
                          </div>

                          {/* Symbol Name & Category */}
                          <div className="min-w-0 flex-1">
                            <span
                              className="inline-block text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded mb-1"
                              style={{
                                backgroundColor: `${categoryMeta.color}15`,
                                color: categoryMeta.color,
                              }}
                            >
                              {item.category}
                            </span>
                            <h4 className="text-base font-bold text-white font-mono tracking-tight group-hover:text-sky-300 transition truncate">
                              {item.name}
                            </h4>
                            <div className="text-[11px] text-slate-400 font-mono mt-0.5 line-clamp-1">
                              {item.datumRequired ? (
                                <span className="text-amber-400 flex items-center gap-1">
                                  <span>⚠</span> Datum Required
                                </span>
                              ) : (
                                <span className="text-teal-400 flex items-center gap-1">
                                  <span>✓</span> No Datum Required
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Controls Field */}
                        <div className="space-y-1">
                          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block font-bold">
                            What It Controls
                          </span>
                          <p className="text-xs text-slate-200 leading-snug font-medium line-clamp-2">
                            {item.whatItControls}
                          </p>
                        </div>

                        {/* Simple Explanation */}
                        <div className="space-y-1">
                          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block font-bold">
                            Simple Explanation
                          </span>
                          <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                            {item.simpleExplanation}
                          </p>
                        </div>

                        {/* Typical Applications Tags */}
                        <div className="space-y-1.5">
                          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block font-bold">
                            Typical Applications
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {item.typicalApplication.slice(0, 3).map((app, i) => (
                              <span
                                key={i}
                                className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800"
                              >
                                {app}
                              </span>
                            ))}
                            {item.typicalApplication.length > 3 && (
                              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-900 text-slate-500">
                                +{item.typicalApplication.length - 3}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Example Tolerance Callout */}
                        <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 font-mono text-xs flex items-center justify-between">
                          <span className="text-slate-500 text-[10px] uppercase font-bold">Tol Ex:</span>
                          <span className="text-sky-300 font-bold">{item.exampleTolerance}</span>
                        </div>

                        {/* Feature Control Frame (FCF) Component */}
                        <div className="space-y-1">
                          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block font-bold">
                            Example Feature Control Frame
                          </span>
                          <div className="pt-1">
                            <CadFeatureControlFrame
                              symbolName={item.svgName}
                              tolerance={item.featureControlFrame.tolerance}
                              modifier={item.featureControlFrame.modifier}
                              primaryDatum={item.featureControlFrame.primaryDatum}
                              secondaryDatum={item.featureControlFrame.secondaryDatum}
                              tertiaryDatum={item.featureControlFrame.tertiaryDatum}
                              size="sm"
                              withLeader={true}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Card Bottom: Click to Expand Button */}
                      <div className="p-4 pt-2 border-t border-slate-800/70 bg-slate-950/50">
                        <button
                          onClick={() => setExpandedSymbol(item)}
                          className="w-full py-2 px-3 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 hover:text-sky-300 border border-sky-500/30 text-xs font-mono font-bold flex items-center justify-center gap-2 transition group-hover:border-sky-400/60"
                        >
                          <span>Click to Expand CAD Details</span>
                          <span className="transition-transform group-hover:translate-x-1">→</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── CLICK-TO-EXPAND DETAILS MODAL / DRAWER ── */}
      {expandedSymbol && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200"
        >
          {/* Modal Card Backdrop Dismiss */}
          <div
            className="absolute inset-0"
            onClick={() => setExpandedSymbol(null)}
          />

          {/* Modal Container */}
          <div className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto bg-[#070d19] border-2 border-sky-400/60 rounded-3xl shadow-2xl z-10 flex flex-col font-mono text-slate-200">
            {/* Modal Blueprint Grid Background */}
            <div
              className="absolute inset-0 pointer-events-none opacity-10"
              style={{
                backgroundImage: `
                  linear-gradient(rgba(56, 189, 248, 0.2) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(56, 189, 248, 0.2) 1px, transparent 1px)
                `,
                backgroundSize: '20px 20px',
              }}
            />

            {/* Modal Header */}
            <div className="relative z-10 sticky top-0 bg-[#070d19]/95 backdrop-blur-md border-b border-slate-800 p-5 sm:p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-sky-500/10 border border-sky-400/40 flex items-center justify-center shrink-0">
                  <GdtSymbolSvg
                    name={expandedSymbol.svgName}
                    size={32}
                    color="#38bdf8"
                    strokeWidth={2.4}
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-sky-500/20 text-sky-400 border border-sky-500/30">
                      {expandedSymbol.category} CONTROL
                    </span>
                    <span className="text-slate-500 text-xs">ASME / ISO</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-0.5">
                    {expandedSymbol.name}
                  </h3>
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setExpandedSymbol(null)}
                className="w-10 h-10 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white flex items-center justify-center text-sm transition"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="relative z-10 p-6 space-y-6">
              {/* Top Overview 2-Column: Live 3D Canvas & Feature Control Frame */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* 3D WebGL Live Preview (5 Cols) */}
                <div className="lg:col-span-5 bg-slate-950 rounded-2xl border border-slate-800 p-3 flex flex-col gap-2">
                  <div className="flex items-center justify-between px-2 pt-1 text-[11px] text-slate-400">
                    <span className="flex items-center gap-1.5 text-sky-400 font-bold">
                      <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
                      3D WebGL Symbol
                    </span>
                    <span className="text-[10px] text-slate-500">Interactive Orbit</span>
                  </div>
                  <Gdt3dSymbolCanvas
                    symbolId={expandedSymbol.id}
                    materialPreset="titanium"
                    autoRotate={true}
                    showToleranceZone={true}
                    className="w-full h-52 rounded-xl"
                  />
                  <div className="text-[10px] text-center text-slate-500 pb-1">
                    Left-click to orbit · Scroll to zoom
                  </div>
                </div>

                {/* Technical Callout & FCF Blueprint (7 Cols) */}
                <div className="lg:col-span-7 flex flex-col justify-between gap-4 bg-slate-900/60 p-5 rounded-2xl border border-slate-800">
                  <div className="space-y-3">
                    <div className="text-xs font-bold text-sky-400 uppercase tracking-wider flex items-center justify-between">
                      <span>Drawing Callout Specification</span>
                      <span className="text-[10px] text-slate-400">{expandedSymbol.deepDive.asmeStandard}</span>
                    </div>

                    {/* Prominent FCF Box with leader line */}
                    <div className="p-4 bg-slate-950 rounded-xl border border-sky-500/20 flex flex-col items-center justify-center gap-2">
                      <CadFeatureControlFrame
                        symbolName={expandedSymbol.svgName}
                        tolerance={expandedSymbol.featureControlFrame.tolerance}
                        modifier={expandedSymbol.featureControlFrame.modifier}
                        primaryDatum={expandedSymbol.featureControlFrame.primaryDatum}
                        secondaryDatum={expandedSymbol.featureControlFrame.secondaryDatum}
                        tertiaryDatum={expandedSymbol.featureControlFrame.tertiaryDatum}
                        size="lg"
                        withLeader={true}
                      />
                      <p className="text-[11px] text-slate-400 text-center max-w-md mt-1 leading-snug">
                        {expandedSymbol.featureControlFrame.description}
                      </p>
                    </div>
                  </div>

                  {/* Datum requirement status */}
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                      <span className="text-[10px] text-slate-500 uppercase block font-bold">Datum Reference</span>
                      <span className={`font-bold mt-0.5 block ${expandedSymbol.datumRequired ? 'text-amber-400' : 'text-teal-400'}`}>
                        {expandedSymbol.datumRequirementText}
                      </span>
                    </div>
                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                      <span className="text-[10px] text-slate-500 uppercase block font-bold">Example Tolerance</span>
                      <span className="text-sky-300 font-bold mt-0.5 block">
                        {expandedSymbol.exampleTolerance}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Comprehensive Engineering Sections */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {/* Tolerance Zone Blueprint */}
                <div className="p-4 bg-slate-900/60 rounded-2xl border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 text-sky-400 font-bold uppercase tracking-wider">
                    <span>📐</span>
                    <span>Tolerance Zone Geometry</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    {expandedSymbol.deepDive.toleranceZone}
                  </p>
                </div>

                {/* Inspection & Measurement Method */}
                <div className="p-4 bg-slate-900/60 rounded-2xl border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 text-teal-400 font-bold uppercase tracking-wider">
                    <span>🔬</span>
                    <span>Inspection & Metrology Setup</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    {expandedSymbol.deepDive.inspectionMethod}
                  </p>
                </div>

                {/* CAD Callout Guide */}
                <div className="p-4 bg-slate-900/60 rounded-2xl border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 text-amber-400 font-bold uppercase tracking-wider">
                    <span>✏️</span>
                    <span>CAD Callout Best Practice</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    {expandedSymbol.deepDive.cadCalloutGuide}
                  </p>
                </div>

                {/* Key Engineering Takeaway */}
                <div className="p-4 bg-slate-900/60 rounded-2xl border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 text-pink-400 font-bold uppercase tracking-wider">
                    <span>💡</span>
                    <span>Design Rule & Pitfall Avoidance</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    {expandedSymbol.deepDive.keyTakeaway}
                  </p>
                </div>
              </div>

              {/* Applications List */}
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold block">
                  Real-World Industrial Applications
                </span>
                <div className="flex flex-wrap gap-2">
                  {expandedSymbol.typicalApplication.map((app, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 text-sky-300 text-xs font-semibold"
                    >
                      ✓ {app}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="relative z-10 border-t border-slate-800 p-4 bg-[#070d19] flex items-center justify-between text-xs">
              <span className="text-slate-500">
                Standard Reference: <strong className="text-slate-300">{expandedSymbol.deepDive.asmeStandard}</strong>
              </span>
              <button
                onClick={() => setExpandedSymbol(null)}
                className="px-5 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-black tracking-wide transition shadow-lg shadow-sky-500/20"
              >
                CLOSE SPECIFICATION
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default GdtCardsSection;
