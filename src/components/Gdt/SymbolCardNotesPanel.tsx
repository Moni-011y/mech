import React from 'react';
import type { GdtSymbolCardData } from './gdtData';
import GdtSymbolSvg from './GdtSymbolSvg';
import CadFeatureControlFrame from './CadFeatureControlFrame';

interface SymbolCardNotesPanelProps {
  cardData: GdtSymbolCardData;
  catColor?: string;
  className?: string;
}

export const SymbolCardNotesPanel: React.FC<SymbolCardNotesPanelProps> = ({
  cardData,
  catColor = '#14b8a6',
  className = '',
}) => {
  const workflowSteps = [
    {
      step: '01',
      phase: 'Design Intent',
      icon: '🎯',
      desc: `Identify what needs controlling. ${cardData.name} is used when ${cardData.whatItControls.toLowerCase()}.`,
    },
    {
      step: '02',
      phase: 'Drawing Callout',
      icon: '✏️',
      desc: cardData.deepDive.cadCalloutGuide,
    },
    {
      step: '03',
      phase: 'Tolerance Zone',
      icon: '📐',
      desc: `The manufactured feature must lie within: ${cardData.deepDive.toleranceZone}`,
    },
    {
      step: '04',
      phase: 'Inspection & Measurement',
      icon: '🔬',
      desc: cardData.deepDive.inspectionMethod,
    },
    {
      step: '05',
      phase: 'Accept / Reject Decision',
      icon: '✅',
      desc: `If all measured points fall within the defined tolerance zone, the feature conforms to the drawing. ${cardData.deepDive.keyTakeaway}`,
    },
  ];

  return (
    <div className={`flex flex-col gap-3 font-mono text-slate-200 ${className}`}>

      {/* ── CARD HEADER ── */}
      <div className="bg-[#070d19]/90 border border-slate-800 rounded-2xl p-4 shadow-xl relative overflow-hidden backdrop-blur-md">
        {/* Subtle grid pattern background */}
        <div
          className="absolute inset-0 pointer-events-none opacity-10"
          style={{
            backgroundImage: `linear-gradient(${catColor} 1px, transparent 1px), linear-gradient(90deg, ${catColor} 1px, transparent 1px)`,
            backgroundSize: '16px 16px',
          }}
        />

        <div className="relative z-10 flex items-start gap-3.5">
          {/* Symbol Bezel */}
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border-2 shadow-inner"
            style={{
              backgroundColor: `${catColor}15`,
              borderColor: `${catColor}60`,
            }}
          >
            <GdtSymbolSvg
              name={cardData.svgName}
              size={28}
              color={catColor}
              strokeWidth={2.4}
            />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded"
                style={{
                  backgroundColor: `${catColor}20`,
                  color: catColor,
                }}
              >
                {cardData.category} CONTROL
              </span>
              <span className="text-[9px] text-slate-500 font-mono">
                #{cardData.symbolNumber < 10 ? `0${cardData.symbolNumber}` : cardData.symbolNumber}
              </span>
            </div>
            <h3 className="text-base font-black text-white tracking-tight mt-1 truncate">
              {cardData.name}
            </h3>
            <p className="text-[10px] text-slate-400 mt-0.5 font-sans line-clamp-2">
              {cardData.whatItControls}
            </p>
          </div>
        </div>

        {/* Datum status badge */}
        <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between">
          <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Datum Rule</span>
          <span
            className={`font-semibold text-[10px] px-2 py-0.5 rounded ${
              cardData.datumRequired
                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                : 'bg-teal-500/10 text-teal-300 border border-teal-500/30'
            }`}
          >
            {cardData.datumRequired ? '⚠ Datum Required' : '✓ No Datum Required'}
          </span>
        </div>
      </div>

      {/* ── SIMPLE EXPLANATION ── */}
      <div className="bg-[#09101f] border border-slate-700/60 rounded-2xl p-3.5">
        <div className="flex items-center gap-2 mb-2 text-slate-300 text-xs font-bold uppercase tracking-wider">
          <span>📖</span>
          <span>Simple Explanation</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed font-sans">
          {cardData.simpleExplanation}
        </p>
      </div>

      {/* ── ENGINEERING WORKFLOW (5-STEP TIMELINE) ── */}
      <div
        className="rounded-2xl p-3.5 border relative overflow-hidden"
        style={{ borderColor: `${catColor}30`, background: `${catColor}08` }}
      >
        {/* Faint corner watermark */}
        <div
          className="absolute top-2 right-3 text-[9px] font-mono opacity-25 select-none"
          style={{ color: catColor }}
        >
          GD&amp;T WORKFLOW
        </div>

        <div
          className="flex items-center gap-2 mb-3 text-xs font-bold uppercase tracking-wider"
          style={{ color: catColor }}
        >
          <span>⚙️</span>
          <span>Engineering Workflow — How to Apply This Symbol</span>
        </div>

        <div className="flex flex-col">
          {workflowSteps.map(({ step, phase, icon, desc }, idx) => (
            <div key={step} className="flex gap-3">
              {/* Timeline spine */}
              <div className="flex flex-col items-center shrink-0 w-7">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-[9px] font-black shrink-0 z-10"
                  style={{
                    background: `${catColor}25`,
                    color: catColor,
                    border: `1.5px solid ${catColor}50`,
                  }}
                >
                  {step}
                </div>
                {idx < workflowSteps.length - 1 && (
                  <div
                    className="w-px flex-1 my-1"
                    style={{ background: `${catColor}20` }}
                  />
                )}
              </div>

              {/* Step Content */}
              <div className={`pb-3.5 min-w-0 flex-1 ${idx === workflowSteps.length - 1 ? 'pb-0' : ''}`}>
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="text-sm leading-none">{icon}</span>
                  <span
                    className="text-[10px] font-bold uppercase tracking-wider"
                    style={{ color: catColor }}
                  >
                    {phase}
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 leading-relaxed font-sans">
                  {desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── DESIGN RULE & KEY TAKEAWAY (HIGHLIGHTED) ── */}
      <div className="bg-gradient-to-br from-amber-500/10 via-[#0a0f1d] to-[#070c18] border border-amber-500/40 rounded-2xl p-3.5 shadow-lg">
        <div className="flex items-center gap-2 mb-1.5 text-amber-300 text-xs font-bold uppercase tracking-wider">
          <span className="text-sm">💡</span>
          <span>Card Note · Design Rule &amp; Pitfalls</span>
        </div>
        <p className="text-xs text-slate-200 leading-relaxed font-sans font-medium">
          {cardData.deepDive.keyTakeaway}
        </p>
      </div>

      {/* ── CAD CALLOUT BEST PRACTICE ── */}
      <div className="bg-[#080e1d] border border-sky-500/30 rounded-2xl p-3.5 shadow-md">
        <div className="flex items-center gap-2 mb-1.5 text-sky-400 text-xs font-bold uppercase tracking-wider">
          <span>✏️</span>
          <span>CAD Callout Best Practice</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed font-sans">
          {cardData.deepDive.cadCalloutGuide}
        </p>
      </div>

      {/* ── FEATURE CONTROL FRAME (FCF) ── */}
      <div className="bg-[#070d19] border border-slate-800 rounded-2xl p-3.5 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
            <span>🏷️</span> Feature Control Frame
          </span>
          <span className="text-[9px] text-sky-400/80 font-mono">{cardData.exampleTolerance}</span>
        </div>
        <div className="flex justify-center bg-slate-950/80 rounded-xl border border-slate-800/80 p-3">
          <CadFeatureControlFrame
            symbolName={cardData.svgName}
            tolerance={cardData.featureControlFrame.tolerance}
            modifier={cardData.featureControlFrame.modifier}
            primaryDatum={cardData.featureControlFrame.primaryDatum}
            secondaryDatum={cardData.featureControlFrame.secondaryDatum}
            tertiaryDatum={cardData.featureControlFrame.tertiaryDatum}
            size="sm"
            withLeader={true}
          />
        </div>
        <p className="text-[11px] text-slate-400 font-sans leading-snug">
          {cardData.featureControlFrame.description}
        </p>
      </div>

      {/* ── TOLERANCE ZONE GEOMETRY ── */}
      <div className="bg-[#080d1a] border border-indigo-500/30 rounded-2xl p-3.5 shadow-md">
        <div className="flex items-center gap-2 mb-1.5 text-indigo-300 text-xs font-bold uppercase tracking-wider">
          <span>📐</span>
          <span>Tolerance Zone Geometry</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed font-sans">
          {cardData.deepDive.toleranceZone}
        </p>
      </div>

      {/* ── INSPECTION & METROLOGY SETUP ── */}
      <div className="bg-[#070e1b] border border-teal-500/30 rounded-2xl p-3.5 shadow-md">
        <div className="flex items-center gap-2 mb-1.5 text-teal-300 text-xs font-bold uppercase tracking-wider">
          <span>🔬</span>
          <span>Inspection &amp; Metrology Setup</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed font-sans">
          {cardData.deepDive.inspectionMethod}
        </p>
      </div>

      {/* ── TYPICAL APPLICATIONS & STANDARD ── */}
      <div className="bg-[#070d19] border border-slate-800 rounded-2xl p-3.5 space-y-2">
        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
          Typical Applications
        </span>
        <div className="flex flex-wrap gap-1.5">
          {cardData.typicalApplication.map((app, idx) => (
            <span
              key={idx}
              className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800"
            >
              {app}
            </span>
          ))}
        </div>
        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[9px] text-slate-500">
          <span>Standard</span>
          <span className="text-slate-400">{cardData.deepDive.asmeStandard}</span>
        </div>
      </div>

      {/* ── CHAPTER 9 TOLERANCE CONNECTION ── */}
      <div className="bg-[#06101c] border border-cyan-500/30 rounded-2xl p-3.5 space-y-1.5 text-xs">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
            <span>📖</span> Chapter 9 Engineering Note
          </span>
          <a
            href="/standards/tolerance"
            className="text-[9px] font-mono text-cyan-300 hover:text-cyan-200 underline"
          >
            Tolerance Lab →
          </a>
        </div>
        <p className="text-[11px] text-slate-300 font-sans leading-relaxed">
          <strong className="text-cyan-300">Geometric vs Dimensional:</strong> While dimensional tolerance controls size, {cardData.name.toLowerCase()} controls geometric variation ({cardData.category.toLowerCase()}). A part can have the correct size but still fail to function if its geometry is incorrect.
        </p>
      </div>

    </div>
  );
};

export default SymbolCardNotesPanel;
